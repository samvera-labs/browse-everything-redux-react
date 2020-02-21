import * as types from '../types'

export function authToken(state = {}, action) {
  switch (action.type) {
    case types.RECEIVE_WEB_TOKEN:
    case types.REQUEST_AUTHORIZATION:
    case types.RECEIVE_AUTHORIZATION:
      const updated = {
        authToken: action.authToken,
        lastUpdated: action.receivedAt,
        isRequesting: action.isRequesting
      }
      return Object.assign({}, state, updated)
    case types.CLEAR_SESSION:
      return {}
    default:
      return state
  }
}
