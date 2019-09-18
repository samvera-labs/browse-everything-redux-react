
import fetch from 'cross-fetch'

/**
 * Define the action types
 */
export const REQUEST_PROVIDER = 'REQUEST_PROVIDER'
export const RECEIVE_PROVIDER = 'RECEIVE_PROVIDER'
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
 * Requesting a single provider
 * (Is this needed? If the providers are stored at initialization of the upload
 * form...)
 */
export function requestProvider(provider) {
  return {
    type: REQUEST_PROVIDER,
    provider
  }
}

/**
 * Receiving a single provider
 * (Is this needed? If the providers are stored at initialization of the upload
 * form...)
 */
export function receiveProvider(provider, json) {
  return {
    type: RECEIVE_PROVIDER,
    provider: json.data, // This needs to be transformed from the JSON-API response
    receivedAt: Date.now()
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

