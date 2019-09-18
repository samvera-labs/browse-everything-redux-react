
import api from 'bees'

/**
 * Define the action types
 */
export const REQUEST_PROVIDERS = 'REQUEST_PROVIDERS'
export const RECEIVE_PROVIDERS = 'RECEIVE_PROVIDERS'
export const SELECT_PROVIDER = 'SELECT_PROVIDER'

export const REQUEST_SESSION = 'REQUEST_SESSION';
export const RECEIVE_SESSION = 'RECEIVE_SESSION';

export const RECEIVE_AUTH = 'RECEIVE_AUTH';

export const REQUEST_CONTAINER = 'REQUEST_CONTAINER';
export const RECEIVE_CONTAINER = 'RECEIVE_CONTAINER';

export const SUBMIT_UPLOAD = 'SUBMIT_UPLOAD';

/**
 * Define the actions for updating the Redux state
 */

export function selectProvider(provider) {
  return {
    type: SELECT_PROVIDER,
    provider
  }
}

/**
 * Request the providers from the Rails API
 * Determines from the state whether or not the provider resources should be
 * requested from the API
 */
function shouldRequestProviders(state) {
  const providers = state.providers
  if (!providers) {
    return true
  } else if (providers.isRequesting) {
    return false
  } else {
    return providers.didInvalidate
  }
}

/**
 * Requesting all of the providers from the API
 */
export function requestProviders() {
  return {
    type: REQUEST_PROVIDERS,
    providers: []
  }
}

/**
 * Receiving all of the providers from the API
 */
export function receiveProviders(json) {
  return {
    type: RECEIVE_PROVIDERS,
    providers: json.data.children.map(child => child.data), // This needs to be transformed from the JSON-API response
    receivedAt: Date.now()
  }
}

/**
 * Request and update the providers in the state
 */
function updateProviders() {

  return dispatch => {
    dispatch(requestProviders())
    return api.getProviders()
      .then(json => dispatch(receiveProviders(json)))
  }
}

export function updateProvidersIfNeeded() {
  return (dispatch, getState) => {
    if (shouldRequestProviders(getState())) {
      return dispatch(updateProviders())
    }
  }
}
