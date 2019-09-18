
import { combineReducers } from 'redux'

import {
    REQUEST_PROVIDER,
    RECEIVE_PROVIDER,
    REQUEST_PROVIDERS,
    RECEIVE_PROVIDERS,
    SELECT_PROVIDER,

    REQUEST_SESSION,
    RECEIVE_SESSION,

    RECEIVE_AUTH,

    REQUEST_CONTAINER,
    RECEIVE_CONTAINER,

    SUBMIT_UPLOAD
} from './actions'

/**
 * Define the reducers for the Redux store
 */

/**
 * Reducer for selecting a provider
 */
function selectProvider(state = 'reactjs', action) {

  // Update the state when a provider is selected by the user
  switch (action.type) {
    case SELECT_PROVIDER:
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
    case REQUEST_PROVIDERS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_PROVIDERS:
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
    case REQUEST_PROVIDER:
    case RECEIVE_PROVIDER:
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
