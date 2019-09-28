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

function buildBytestream(data) {
  const bytestream = {};
  bytestream.id = data.id;
  bytestream.name = data.attributes.name;
  bytestream.media_type = data.attributes.media_type;
  bytestream.size = data.attributes.size;

  return bytestream;
}

function buildContainer(data) {
  const container = {};

  container.id = data.id;
  container.name = data.attributes.name;
  container.bytestreams = data.relationships.bytestreams.data.map(childData => buildBytestream(childData));
  container.containers = data.relationships.containers.data.map(childData => buildContainer(childData));

  return container;
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

export function getRootContainer(session, authToken) {
  return (dispatch, getState) => {
    if (shouldRequestRootContainer(getState())) {
      return dispatch(requestAndReceiveRootContainer(session, authToken));
    }
  };
}