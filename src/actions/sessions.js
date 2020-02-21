import { api } from '../bees'
import * as types from '../types'

export function clearSession() {
  return {
    type: types.CLEAR_SESSION
  }
}

/**
 * Requesting all of the providers from the API
 */
function requestSession() {
  return {
    type: types.REQUEST_SESSION,
    session: {},
    isRequesting: true
  }
}

function buildSession(data) {
  const session = {}

  session.authorizations = data.relationships.authorizations
  session.provider = data.relationships.provider
  session.id = data.id

  return session
}

/**
 * Receiving all of the providers from the API
 */
function receiveSession(response) {
  const body = response.body
  const data = body.data
  const session = buildSession(data)
  return {
    type: types.RECEIVE_SESSION,
    isRequesting: false,
    session: session,
    receivedAt: Date.now()
  }
}

function postAndReceiveSession(provider, authToken) {
  return dispatch => {
    // Ensure that the auth. token is loaded
    dispatch(requestSession())

    const attributes = {
      provider_id: provider.id
    }
    const postData = {
      data: {
        type: 'post',
        attributes
      }
    }

    // This supports both the legacy approach using POST parameters and headers
    if (authToken) {
      postData['token'] = authToken
    }

    return api.createSession(postData).then(response => {
      return dispatch(receiveSession(response))
    })
  }
}

export function createSession(provider, authToken) {
  return dispatch => dispatch(postAndReceiveSession(provider, authToken))
}
