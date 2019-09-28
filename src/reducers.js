import { combineReducers } from 'redux';
import * as types from './types';
import { getRootContainer, updateRootContainer } from './actions';
import { selectedProvider, providers } from './reducers/providers';
import { authToken } from './reducers/authorization';
import { session } from './reducers/sessions';

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
  currentSession: session,
  rootContainer,
  currentAuthToken: authToken
});

export default rootReducer;
