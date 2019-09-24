import { api } from './bees';
import * as types from './types';

/**
 * Define the actions for updating the Redux state
 */

export function selectProvider(provider) {
  return {
    type: types.SELECT_PROVIDER,
    provider
  };
}

/**
 * Request the providers from the Rails API
 * Determines from the state whether or not the provider resources should be
 * requested from the API
 */
function shouldRequestProviders(state) {
  const providers = state.providers;
  return !providers.isRequesting;
}

/**
 * Requesting all of the providers from the API
 */
export function requestProviders() {
  return {
    type: types.REQUEST_PROVIDERS,
    providers: [],
    isRequesting: true
  };
}

/**
 * Receiving all of the providers from the API
 */
export function receiveProviders(response) {
  const body = response.body;
  const data = body.data;
  return {
    type: types.RECEIVE_PROVIDERS,
    isRequesting: false,
    providers: data,
    receivedAt: Date.now()
  };
}

/**
 * Request and update the providers in the state
 */
function requestAndReceiveProviders() {
  return dispatch => {
    dispatch(requestProviders());
    return api
      .getProviders()
      .then(response => dispatch(receiveProviders(response)));
  };
}

//.catch(response => dispatch(receiveProviders({})))
export function updateProviders() {
  return (dispatch, getState) => {
    if (shouldRequestProviders(getState())) {
      return dispatch(requestAndReceiveProviders());
    }
  };
}

export function requestContainer() {
  return {
    type: types.REQUEST_ROOT_CONTAINER,
    isRequesting: true
  };
}

export function receiveContainer(response, rootContainer) {
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

export function requestRootContainer() {
  return {
    type: types.REQUEST_ROOT_CONTAINER,
    rootContainer: {},
    isRequesting: true
  };
}

export function receiveRootContainer(response) {
  const body = response.body;
  const data = body.data;
  return {
    type: types.RECEIVE_ROOT_CONTAINER,
    isRequesting: false,
    rootContainer: data,
    receivedAt: Date.now()
  };
}

function requestAndReceiveRootContainer(session) {
  return dispatch => {
    dispatch(requestRootContainer());

    return api.getRootContainer(session).then(response => {
      return dispatch(receiveRootContainer(response));
    });
  };
}

function shouldRequestRootContainer(state) {
  const rootContainer = state.rootContainer;

  return !state.isRequesting && !rootContainer;
}

export function getRootContainer(session) {
  return (dispatch, getState) => {
    if (shouldRequestRootContainer(getState())) {
      return dispatch(requestAndReceiveRootContainer(session));
    }
  };
}

/**
 * Sessions
 *
 */

/**
 * Requesting all of the providers from the API
 */
function requestSession() {
  return {
    type: types.REQUEST_SESSION,
    currentSession: {},
    isRequesting: true
  };
}

/**
 * Receiving all of the providers from the API
 */
function receiveSession(response) {
  const body = response.body;
  const data = body.data;
  return {
    type: types.RECEIVE_SESSION,
    isRequesting: false,
    currentSession: data,
    receivedAt: Date.now()
  };
}

function postAndReceiveSession(provider) {
  return dispatch => {
    // Ensure that the auth. token is loaded
    dispatch(requestSession());

    return api.postSession(provider).then(response => {
      return dispatch(receiveSession(response));
    });
  };
}

export function createSession(provider) {
  return (dispatch, getState) => {
    return dispatch(postAndReceiveSession(provider));
  };
}

/**
 * Authorizations
 *
 */
