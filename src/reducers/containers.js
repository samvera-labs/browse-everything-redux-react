import * as types from '../types';

function findChildOfParent(descendant, rootId, cache) {
  const nextParent = cache[descendant.id];
  if (nextParent.id === rootId) {
    return descendant;
  }

  const childIdx = nextParent.containers.findIndex(child => child.id === descendant.id);
  nextParent.containers[childIdx] = descendant;

  return findChildOfParent(nextParent, rootId, cache);
}

function updateRootContainer(rootContainer, cache, container) {
  /**
   * This fails when the container being updated is not a child (but a
   * descendent) of the root container
   */
  const child = findChildOfParent(container, rootContainer.id, cache);
  const containerIdx = rootContainer.containers.findIndex(node => node.id === child.id);
  rootContainer.containers[containerIdx] = child;

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
        lastUpdated: action.receivedAt,
        cache: action.cache
      });
    case types.REQUEST_CONTAINER:
      return Object.assign({}, state, {
        isRequesting: true
      });
    case types.RECEIVE_CONTAINER:
      const updatedRootContainer = updateRootContainer(state.item, action.cache, action.item);
      return Object.assign({}, state, {
        isRequesting: false,
        item: updatedRootContainer,
        lastUpdated: action.receivedAt,
        cache: action.cache
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
