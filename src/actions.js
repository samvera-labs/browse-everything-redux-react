import { api } from './bees';
import * as types from './types';

/**
 * Define the actions for updating the Redux state
 */

export function selectProvider(provider) {
  return {
    type: types.SELECT_PROVIDER,
    provider
  };
}

/**
 * Request the providers from the Rails API
 * Determines from the state whether or not the provider resources should be
 * requested from the API
 */
function shouldRequestProviders(state) {
  const providers = state.providers;
  return !providers.isRequesting;
}

/**
 * Requesting all of the providers from the API
 */
export function requestProviders() {
  return {
    type: types.REQUEST_PROVIDERS,
    providers: [],
    isRequesting: true
  };
}

/**
 * Receiving all of the providers from the API
 */
export function receiveProviders(response) {
  const body = response.body;
  const data = body.data;
  return {
    type: types.RECEIVE_PROVIDERS,
    isRequesting: false,
    providers: data,
    receivedAt: Date.now()
  };
}

/**
 * Request and update the providers in the state
 */
function requestAndReceiveProviders() {
  return dispatch => {
    dispatch(requestProviders());
    return api
      .getProviders()
      .then(response => dispatch(receiveProviders(response)));
  };
}

//.catch(response => dispatch(receiveProviders({})))
export function updateProviders() {
  return (dispatch, getState) => {
    if (shouldRequestProviders(getState())) {
      return dispatch(requestAndReceiveProviders());
    }
  };
}
