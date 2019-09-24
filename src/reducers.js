import { combineReducers } from 'redux';
import * as types from './types';
import { getRootContainer, updateRootContainer } from './actions';

/**
 * Define the reducers for the Redux store
 */

/**
 * Reducer for selecting a provider
 */
function selectedProvider(currentState = {}, action) {
  const initialState = {
    selectedProvider: ""
  }
  const state = Object.assign({}, initialState, currentState);
  // Update the state when a provider is selected by the user
  switch (action.type) {
    case types.SELECT_PROVIDER:
      return action.provider;
    default:
      return state.selectedProvider;
  }
}

/**
 * Function for updating the state in response to requesting or receiving a
 * provider
 */
function updatedProviderState(state = {}, action) {
  switch (action.type) {
    case types.REQUEST_PROVIDERS:
      return Object.assign({}, state, {
        isRequesting: true,
        didInvalidate: false
      });
    case types.RECEIVE_PROVIDERS:
      return Object.assign({}, state, {
        isRequesting: false,
        didInvalidate: false,
        items: action.providers,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

/**
 * Reducer for requesting and receiving providers
 */
function providers(currentState = {}, action) {
  const initialState = {
    isRequesting: false,
    items: []
  }
  const state = Object.assign({}, initialState, currentState);
  const updated = updatedProviderState(state.providers, action);

  switch (action.type) {
    case types.REQUEST_PROVIDERS:
    case types.RECEIVE_PROVIDERS:
      return Object.assign({}, state, updated);
    default:
      return state;
  }
}

function updatedRootContainerState(state = {}, action) {
  let updatedRootContainer;

  switch (action.type) {
    case types.REQUEST_ROOT_CONTAINER:
      return Object.assign({}, state, {
        isRequesting: true
      });
    case types.RECEIVE_ROOT_CONTAINER:
      updatedRootContainer = getRootContainer(action.rootContainer);
      return Object.assign({}, state, {
        isRequesting: false,
        rootContainer: updatedRootContainer,
        lastUpdated: action.receivedAt
      });
    case types.REQUEST_CONTAINER:
      return Object.assign({}, state, {
        isRequesting: true
      });
    case types.RECEIVE_CONTAINER:
      updatedRootContainer = updateRootContainer(action.container);
      return Object.assign({}, state, {
        isRequesting: false,
        rootContainer: updatedRootContainer,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function rootContainer(currentState = {}, action) {
  const initialState = {
    rootContainer: {},
    isRequesting: false
  }

  const state = Object.assign({}, initialState, currentState);
  const updated = updatedRootContainerState(state.providers, action);

  switch (action.type) {
    case types.REQUEST_ROOT_CONTAINER:
    case types.RECEIVE_ROOT_CONTAINER:
      return Object.assign({}, state, updated);
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  selectedProvider,
  providers,
  rootContainer
});

export default rootReducer;
