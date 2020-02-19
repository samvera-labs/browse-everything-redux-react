import * as types from '../types'

/**
 * Define the reducers for the Redux store
 */
function updatedSessionState(state = {}, action) {
  switch (action.type) {
    case types.REQUEST_SESSION:
      return Object.assign({}, state, {
        isRequesting: true,
        didInvalidate: false
      })
    case types.RECEIVE_SESSION:
      return Object.assign({}, state, {
        isRequesting: false,
        didInvalidate: false,
        item: action.session,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

export function session(currentState = {}, action) {
  const initialState = {
    isRequesting: false,
    item: {}
  }
  const state = Object.assign({}, initialState, currentState)
  const updated = updatedSessionState(state.providers, action)

  switch (action.type) {
    case types.REQUEST_SESSION:
    case types.RECEIVE_SESSION:
      return Object.assign({}, state, updated)
    case types.CLEAR_SESSION:
      return initialState
    default:
      return state
  }
}
