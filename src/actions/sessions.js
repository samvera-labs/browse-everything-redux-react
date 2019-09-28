import { api } from '../bees';
import * as types from '../types';

/**
 * Requesting all of the providers from the API
 */
function requestSession() {
  return {
    type: types.REQUEST_SESSION,
    currentSession: {},
    isRequesting: true
  };
}

/**
 * Receiving all of the providers from the API
 */
function receiveSession(response) {
  const body = response.body;
  const data = body.data;
  return {
    type: types.RECEIVE_SESSION,
    isRequesting: false,
    currentSession: data,
    receivedAt: Date.now()
  };
}

function postAndReceiveSession(provider, authToken) {
  return dispatch => {
    // Ensure that the auth. token is loaded
    dispatch(requestSession());

    const attributes = {
      'provider_id': provider.id
    };
    const postData = {
      data: {
        type: 'post',
        attributes
      }
    };

    // This supports both the legacy approach using POST parameters and headers
    if (authToken) {
      postData['token'] = authToken;
    }

    return api.createSession({data: {type: 'post', attributes: postData}}).then(response => {
      console.log(response);
      return dispatch(receiveSession(response));
    });
  };
}

export function createSession(provider, authToken) {
  return (dispatch, getState) => {
    return dispatch(postAndReceiveSession(provider, authToken));
  };
}

