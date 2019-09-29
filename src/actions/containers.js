import { api, config } from '../bees';
import * as types from '../types';

/**
 * Build a bytestream object from JSON-API responses
 */
function buildBytestream(data) {
  const bytestream = {};
  bytestream.id = data.id;
  bytestream.name = data.attributes.name;
  bytestream.media_type = data.attributes.media_type;
  bytestream.size = data.attributes.size;

  return bytestream;
}

/**
 * Build a container object from JSON-API responses
 */
function buildContainer(data) {
  const container = {};

  container.id = data.id;
  container.name = data.attributes.name;
  container.bytestreams = data.relationships.bytestreams.data.map(childData => buildBytestream(childData));
  container.containers = data.relationships.containers.data.map(childData => buildContainer(childData));

  return container;
}

/**
 * For requesting the root container for the tree
 */
function requestRootContainer() {
  return {
    type: types.REQUEST_ROOT_CONTAINER,
    item: {},
    isRequesting: true
  };
}

function receiveRootContainer(response) {
  const body = response.body;
  const data = body.data;
  const container = buildContainer(data);
  return {
    type: types.RECEIVE_ROOT_CONTAINER,
    isRequesting: false,
    item: container,
    receivedAt: Date.now()
  };
}

function requestAndReceiveRootContainer(session, authToken) {
  return dispatch => {
    dispatch(requestRootContainer());

    return api.getRootContainer({id: session.id, token: authToken}).then(response => {
      return dispatch(receiveRootContainer(response));
    });
  };
}

function shouldRequestRootContainer(state) {
  const rootContainer = state.rootContainer;

  // This requires a refactor
  const rootContainerEmpty = Object.keys(rootContainer.item).length === 0;
  return rootContainerEmpty && !rootContainer.isRequesting;
}


/**
 * Retrieve and build the root container tree
 */
export function getRootContainer(session, authToken) {
  return (dispatch, getState) => {
    if (shouldRequestRootContainer(getState())) {
      return dispatch(requestAndReceiveRootContainer(session, authToken));
    }
  };
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
  };
}

function receiveContainer(response, rootContainer) {
  //const body = response.body;
  //const data = body.data;
  // This approach is used here because now Bees no longer works :(
  const data = response.data;

  const container = buildContainer(data);

  // This is the action, it is *not* mapped directly to the state
  // Instead, the reducer uses this data in order to modify the rootContainer
  // object
  return {
    type: types.RECEIVE_CONTAINER,
    isRequesting: false,
    item: container,
    receivedAt: Date.now()
  };
}
/**
 * Retrieving the container requires that the root container be passed for the
 * ID in order to construct the query for the container
 */
function requestAndReceiveContainer(session, authToken, rootContainer, container) {
  return dispatch => {
    dispatch(requestContainer());

    // I am tired and this does not work - perhaps the errors are being
    // swallowed for some unholy reason
    // return api.getContainer({ sessionId: session.id, token: authToken, id: container.id }).then(response => {
    const endpoint = config.baseUrl;
    const request = fetch(`${endpoint}/sessions/${session.id}/containers/${container.id}?token=${authToken}`, {
      headers: {
        'Accepts': 'application/vnd.api+json'
      }
    });

    return request.then(response => {
      const jsonResponse = response.json();
      return jsonResponse.then(json => {
        return dispatch(receiveContainer(json, rootContainer));
      });
    },
    error => {
      console.error(error);
    });
  };
}

export function getContainer(container) {

  return(dispatch, getState) => {
    const state = getState();
    // Because the reducers modify the root container, this should only check
    // for whether or not the root container is being modified
    //if (shouldRequestRootContainer(state)) {
    //if (!state.rootContainer.isRequesting) {

      console.log(state);
      console.log(container);
      const session = state.currentSession.item;
      const authToken = state.currentAuthToken.authToken;
      const rootContainer = state.rootContainer.item;
      return dispatch(requestAndReceiveContainer(session, authToken, rootContainer, container));
    //}
  }
}
