import * as types from '../types';
import { config } from '../bees';

/**
 * Authorizations
 *
 */
function receiveWebToken(authToken) {
  return {
    type: types.RECEIVE_WEB_TOKEN,
    isRequesting: false,
    authToken
  };
}

function requestAuthorization() {
  return {
    type: types.REQUEST_AUTHORIZATION,
    authToken: null,
    isRequesting: true
  };
}

function receiveAuthorization(response) {
  const authToken = response.authToken;
  return {
    type: types.RECEIVE_AUTHORIZATION,
    isRequesting: false,
    receivedAt: Date.now(),
    authToken
  };
}

export function createAuthorization() {
  return (dispatch, getState) => {
    dispatch(requestAuthorization());

    const state = getState();
    const provider = state.selectedProvider;

    const endpoint = config.baseUrl;
    const requestUrl = `${endpoint}/providers/${provider.id}/authorize`;
    const request = fetch(requestUrl);

    console.log('HERE4');
    return request.then(response => {
      const jsonResponse = response.json();
      return jsonResponse.then(json => {
        return dispatch(receiveAuthorization(json));
      });
    },
    error => {
      console.error(error);
    });
  };
}

export function authorize(authToken) {
  return (dispatch, getState) => {
    return dispatch(receiveWebToken(authToken));
  };
}
