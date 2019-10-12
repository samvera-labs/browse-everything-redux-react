import * as types from '../types';

function updateRootContainer(rootContainer, container) {

  // This should be possible, but requires that the rootContainer.containers
  // property be restructured from an Array to and Object
  // rootContainer.containers[container.id] = container;
  const containerIdx = rootContainer.containers.findIndex(child => child.id === container.id);
  rootContainer.containers[containerIdx] = container;
  return Object.assign({}, rootContainer);
}

function updatedRootContainerState(state = {}, action) {
  switch (action.type) {
    case types.REQUEST_ROOT_CONTAINER:
      return Object.assign({}, state, {
        isRequesting: true
      });
    case types.RECEIVE_ROOT_CONTAINER:
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
      const updatedRootContainer = updateRootContainer(state.item, action.item);

      return Object.assign({}, state, {
        isRequesting: false,
        item: updatedRootContainer,
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
    case types.REQUEST_CONTAINER:
    case types.RECEIVE_CONTAINER:
      return Object.assign({}, state, updated);
    case types.CLEAR_SESSION:
      return initialState;
    default:
      return state;
  }
}
