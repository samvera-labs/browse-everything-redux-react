import * as types from '../types';

function updatedRootContainerState(state = {}, action) {
  //let updatedRootContainer;

  switch (action.type) {
    case types.REQUEST_ROOT_CONTAINER:
      return Object.assign({}, state, {
        isRequesting: true
      });
    case types.RECEIVE_ROOT_CONTAINER:
      // This needs to be removed and a new Action added
      //updatedRootContainer = getRootContainer(action.rootContainer);
      return Object.assign({}, state, {
        isRequesting: false,
        item: action.item,
        lastUpdated: action.receivedAt
      });
    case types.REQUEST_CONTAINER:
      return Object.assign({}, state, {
        isRequesting: true
      });
    case types.RECEIVE_CONTAINER:
      // This needs to be removed and a new Action added
      //updatedRootContainer = updateRootContainer(action.container);
      return Object.assign({}, state, {
        isRequesting: false,
        item: action.item,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

export function rootContainer(currentState = {}, action) {
  const initialState = {
    item: {},
    isRequesting: false
  }

  const state = Object.assign({}, initialState, currentState);
  const updated = updatedRootContainerState(state, action);

  switch (action.type) {
    case types.REQUEST_ROOT_CONTAINER:
    case types.RECEIVE_ROOT_CONTAINER:
      return Object.assign({}, state, updated);
    default:
      return state;
  }
}
