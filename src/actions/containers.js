import { api } from '../bees';
import * as types from '../types';

/**
 * Requesting containers
 */
function requestContainer() {
  return {
    type: types.REQUEST_ROOT_CONTAINER,
    isRequesting: true
  };
}

function receiveContainer(response, rootContainer) {
  const body = response.body;
  const data = body.data;
  const updatedRootContainer = Object.assign({}, rootContainer);
  updatedRootContainer.containers[data.id] = data;
  return {
    type: types.RECEIVE_ROOT_CONTAINER,
    isRequesting: false,
    rootContainer: updatedRootContainer,
    receivedAt: Date.now()
  };
}

function requestAndReceiveContainer(container, rootContainer) {
  return dispatch => {
    dispatch(requestContainer());

    return api.getContainer(rootContainer, container).then(response => {
      return dispatch(receiveContainer(response, rootContainer));
    });
  };
}

/**
 * This checks the rootContainer for children with the key
 * If the key is not found, it is assumed to be invalid
 * Otherwise, check if the value is empty.  If it is not, request it
 */
function shouldRequestContainer(state, container) {
  const rootContainer = state.rootContainer;
  // If the rootContainer is not loaded, raise an exception
  if (!rootContainer['containers']) {
    throw new Error('The root container has not been loaded.');
  }
  return !state.isRequesting && !rootContainer.containers[container];
}

export function updateRootContainer(container, rootContainer) {
  return (dispatch, getState) => {
    if (shouldRequestContainer(getState(), container)) {
      return dispatch(requestAndReceiveContainer(container, rootContainer));
    }
  };
}

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
  console.log('RECEIVED THE CONTAINER');
  console.log(data);
  return {
    type: types.RECEIVE_ROOT_CONTAINER,
    isRequesting: false,
    item: data,
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

  return !rootContainer || !rootContainer.isRequesting;
}

export function getRootContainer(session, authToken) {
  return (dispatch, getState) => {
    if (shouldRequestRootContainer(getState())) {
      return dispatch(requestAndReceiveRootContainer(session, authToken));
    }
  };
}
