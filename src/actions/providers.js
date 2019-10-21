import { api } from '../bees';
import * as types from '../types';

export function clearProvider() {
  return {
    type: types.CLEAR_UPLOAD
  };
}

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

function buildProviders(data) {
  const providers = [];

  // eslint-disable-next-line no-unused-vars
  for (const values of data) {
    const provider = values.attributes;

    let authorizationUrl;
    if (values.links['authorization_url']) {
      const urlValues = values.links.authorization_url;
      authorizationUrl = `${urlValues.scheme}://${urlValues.host}${urlValues.path}?${urlValues.query}`;
      provider.authorizationUrl = authorizationUrl;
    }

    providers.push(provider);
  }

  return providers;
}

/**
 * Receiving all of the providers from the API
 */
export function receiveProviders(response) {
  const body = response.body;
  const data = body.data;
  const providers = buildProviders(data);

  return {
    type: types.RECEIVE_PROVIDERS,
    isRequesting: false,
    receivedAt: Date.now(),
    providers
  };
}

/**
 * Request and update the providers in the state
 */
function requestAndReceiveProviders() {
  return dispatch => {
    dispatch(requestProviders());

    return api.getProviders()
      .then(response => {
        return dispatch(receiveProviders(response))
      },
      error => {
        console.error(error.message);
      });
  };
}

/**
 * Update or initialize the providers with the JSON-API responses from the
 * server
 */
export function updateProviders() {
  return (dispatch, getState) => {
    if (shouldRequestProviders(getState())) {
      return dispatch(requestAndReceiveProviders());
    }
  };
}
