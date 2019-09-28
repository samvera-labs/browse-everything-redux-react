import * as types from '../types';

/**
 * Authorizations
 *
 */
function receiveWebToken(authToken) {
  return {
    type: types.RECEIVE_WEB_TOKEN,
    authToken
  };
}

export function authorize(authToken) {
  return (dispatch, getState) => {
    return dispatch(receiveWebToken(authToken));
  };
}
