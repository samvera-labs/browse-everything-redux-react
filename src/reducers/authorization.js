import * as types from '../types';

export function authToken(state = {}, action) {
  switch (action.type) {
    case types.RECEIVE_WEB_TOKEN:
      const updated = {
        authToken: action.authToken,
        lastUpdated: action.receivedAt
      }
      return Object.assign({}, state, updated);
    default:
      return state;
  }
}
