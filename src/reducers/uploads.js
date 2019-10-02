import * as types from '../types';

/**
 * Reducer for managing the state for current uploads
 */
function updatedUploadState(state = {}, action) {
  const updatedUpload = Object.assign({}, state.item);

  switch (action.type) {
    case types.REQUEST_UPLOAD:
      return Object.assign({}, state, {
        isRequesting: true
      });
    case types.RECEIVE_UPLOAD:
      return Object.assign({}, state, {
        isRequesting: false,
        item: action.item,
        lastUpdated: action.receivedAt
      });
    case types.SELECT_CONTAINER:
      updatedUpload.containers.push(action.selected);
      return Object.assign({}, state, {
        item: updatedUpload,
        lastUpdated: action.receivedAt
      });
    case types.SELECT_BYTESTREAM:
      updatedUpload.bytestreams.push(action.selected);
      return Object.assign({}, state, {
        item: updatedUpload,
        lastUpdated: action.receivedAt
      });
    case types.DESELECT_CONTAINER:
      // I do not know how to reduce the complexity of this
      updatedUpload.containers = updatedUpload.containers.filter(child => child.id !== action.selected.id)
      return Object.assign({}, state, {
        item: updatedUpload,
        lastUpdated: action.receivedAt
      });
    case types.DESELECT_BYTESTREAM:
      // I do not know how to reduce the complexity of this
      updatedUpload.bytestreams = updatedUpload.bytestreams.filter(child => child.id !== action.selected.id)
      return Object.assign({}, state, {
        item: updatedUpload,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

export function currentUpload(currentState = {}, action) {
  const initialState = {
    isRequesting: false,
    item: {
      containers: [],
      bytestreams: []
    }
  }
  const state = Object.assign({}, initialState, currentState);
  const updated = updatedUploadState(state, action);

  switch (action.type) {
    case types.REQUEST_UPLOAD:
    case types.RECEIVE_UPLOAD:
    case types.SELECT_CONTAINER:
    case types.DESELECT_CONTAINER:
    case types.SELECT_BYTESTREAM:
    case types.DESELECT_BYTESTREAM:
      return Object.assign({}, state, updated);
    default:
      return state;
  }
}
