
import { combineReducers } from 'redux'
import * as types from './types'

/**
 * Define the reducers for the Redux store
 */

/**
 * Reducer for selecting a provider
 */
function selectProvider(state = {}, action) {

  // Update the state when a provider is selected by the user
  switch (action.type) {
    case types.SELECT_PROVIDER:
      return action.provider
    default:
      return state
  }
}

/**
 * Function for updating the state in response to requesting or receiving a
 * provider
 */
function updatedProviderState(
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case types.REQUEST_PROVIDERS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case types.RECEIVE_PROVIDERS:
      return Object.assign({}, state, {
        isFetching: false,
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
function updateProviders(state = {}, action) {
  switch (action.type) {
    case types.REQUEST_PROVIDER:
    case types.RECEIVE_PROVIDER:
      const updated = updatedProviderState(state.providers, action)
        //[action.provider]: provider(state[action.provider], action)
      return Object.assign({}, state, {
        providers: updated
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  selectProvider,
  updateProviders
})

export default rootReducer
