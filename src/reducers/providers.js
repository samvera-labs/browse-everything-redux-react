import * as types from '../types'

/**
 * Reducer for selecting a provider
 */
export function selectedProvider(currentState = {}, action) {
  const initialState = {}
  const state = Object.assign({}, initialState, currentState)
  // Update the state when a provider is selected by the user
  switch (action.type) {
    case types.SELECT_PROVIDER:
      return action.provider
    case types.CLEAR_SESSION:
      return initialState
    default:
      return state
  }
}

/**
 * Function for updating the state in response to requesting or receiving a
 * provider
 */
function updatedProvidersState(state = {}, action) {
  switch (action.type) {
    case types.REQUEST_PROVIDERS:
      return Object.assign({}, state, {
        isRequesting: true,
        didInvalidate: false
      })
    case types.RECEIVE_PROVIDERS:
      return Object.assign({}, state, {
        isRequesting: false,
        didInvalidate: false,
        items: action.providers,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

/**
 * Reducer for requesting and receiving providers
 */
export function providers(currentState = {}, action) {
  const initialState = {
    isRequesting: false,
    items: []
  }
  const state = Object.assign({}, initialState, currentState)
  const updated = updatedProvidersState(state, action)

  switch (action.type) {
    case types.REQUEST_PROVIDERS:
    case types.RECEIVE_PROVIDERS:
      return Object.assign({}, state, updated)
    case types.CLEAR_SESSION:
      return initialState
    default:
      return state
  }
}
