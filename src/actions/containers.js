import { api, config } from '../bees'
import * as types from '../types'

export function clearRootContainer() {
  return {
    type: types.CLEAR_ROOT_CONTAINER
  }
}

/**
 * Build a bytestream object from JSON-API responses
 */
function buildBytestream(data) {
  const bytestream = {}
  bytestream.id = data.id
  bytestream.name = data.attributes.name
  bytestream.media_type = data.attributes.media_type
  bytestream.size = data.attributes.size

  return bytestream
}

/**
 * Build a container object from JSON-API responses
 */
function buildContainer(data) {
  const container = {}

  container.id = data.id
  container.name = data.attributes.name
  container.bytestreams = data.relationships.bytestreams.data.map(childData =>
    buildBytestream(childData)
  )
  container.containers = data.relationships.containers.data.map(childData =>
    buildContainer(childData)
  )

  return container
}

/**
 * For requesting the root container for the tree
 */
function requestRootContainer() {
  return {
    type: types.REQUEST_ROOT_CONTAINER,
    item: {},
    isRequesting: true
  }
}

/**
 * Generates a cache mapping child container IDs to parent container IDs
 */
function buildCache(container) {
  let cache = {}

  // eslint-disable-next-line no-unused-vars
  for (const child of container.containers) {
    cache[child.id] = container
    const childCache = buildCache(child)
    cache = Object.assign({}, cache, childCache)
  }

  return cache
}

function receiveRootContainer(response) {
  const body = response.body
  const data = body.data
  const container = buildContainer(data)
  const cache = buildCache(container)
  return {
    type: types.RECEIVE_ROOT_CONTAINER,
    isRequesting: false,
    item: container,
    receivedAt: Date.now(),
    cache
  }
}

function requestAndReceiveRootContainer(session, authToken) {
  return dispatch => {
    dispatch(requestRootContainer())

    return api
      .getRootContainer({ id: session.id, token: authToken })
      .then(response => {
        return dispatch(receiveRootContainer(response))
      })
  }
}

function shouldRequestRootContainer(state) {
  const rootContainer = state.rootContainer

  // This requires a refactor
  const rootContainerEmpty = Object.keys(rootContainer.item).length === 0
  return rootContainerEmpty && !rootContainer.isRequesting
}

/**
 * Retrieve and build the root container tree
 */
export function getRootContainer(session, authToken) {
  return (dispatch, getState) => {
    if (shouldRequestRootContainer(getState())) {
      return dispatch(requestAndReceiveRootContainer(session, authToken))
    }
  }
}

/**
 * For handling containers within the root container tree
 *
 */

/**
 * Handling container resources (not roots of the trees)
 */
function requestContainer() {
  return {
    type: types.REQUEST_CONTAINER,
    isRequesting: true
  }
}

function receiveContainer(response, parentContainer, cache) {
  // This approach is used here because now Bees no longer works :(
  const data = response.data

  const container = buildContainer(data)
  const containerCache = buildCache(container)
  const updatedCache = Object.assign({}, cache, containerCache)

  // This is the action, it is *not* mapped directly to the state
  // Instead, the reducer uses this data in order to modify the rootContainer
  // object
  return {
    type: types.RECEIVE_CONTAINER,
    isRequesting: false,
    item: container,
    receivedAt: Date.now(),
    cache: updatedCache
  }
}
/**
 * Retrieving the container requires that the root container be passed for the
 * ID in order to construct the query for the container
 */
function requestAndReceiveContainer(session, authToken, container, cache) {
  return dispatch => {
    dispatch(requestContainer())

    // Errors are being swallowed by redux-bees here, and this needs to be
    // diagnosed
    // return api.getContainer({ sessionId: session.id, token: authToken, id: container.id }).then(response => {
    const endpoint = config.baseUrl
    let containerId = container.id.replace(/\./g, '&#x0002E;')
    containerId = encodeURIComponent(containerId)
    const request = fetch(
      `${endpoint}/sessions/${session.id}/containers/${containerId}?token=${authToken}`,
      {
        headers: {
          Accepts: 'application/vnd.api+json'
        }
      }
    )

    return request.then(
      response => {
        const jsonResponse = response.json()
        return jsonResponse.then(json => {
          return dispatch(receiveContainer(json, container, cache))
        })
      },
      error => {
        console.error(error)
      }
    )
  }
}

export function getContainer(container) {
  return (dispatch, getState) => {
    const state = getState()
    const session = state.currentSession.item
    const authToken = state.currentAuthToken.authToken
    const cache = state.rootContainer.cache
    return dispatch(
      requestAndReceiveContainer(session, authToken, container, cache)
    )
  }
}
