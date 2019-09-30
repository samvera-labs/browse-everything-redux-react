import { api } from '../bees';
import * as types from '../types';

/**
 * Requesting all of the providers from the API
 */
function requestUpload() {
  return {
    type: types.REQUEST_UPLOAD,
    isRequesting: true
  };
}

function buildUpload(data) {
  const upload = {};

  upload.authorizations = data.relationships.authorizations;
  upload.provider = data.relationships.provider;
  upload.id = data.id

  return upload;
}

/**
 * Receiving all of the providers from the API
 */
function receiveUpload(response) {
  const body = response.body;
  const data = body.data;
  const upload = buildUpload(data);
  return {
    type: types.RECEIVE_UPLOAD,
    isRequesting: false,
    item: upload,
    receivedAt: Date.now()
  };
}

function postAndReceiveUpload(provider, authToken) {
  return (dispatch, getState) => {
    // Ensure that the auth. token is loaded
    dispatch(requestUpload());

    const state = getState();
    const session = state.currentSession.item;
    const selectedBytestreams = state.selectedBytestreams;
    const selectedContainers = state.selectedContainers;

    const attributes = {
      session_id: session.id,
      bytestream_ids: selectedBytestreams.map(bytestream => bytestream.id),
      container_ids: selectedContainers.map(container => container.id)
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

    return api.createUpload(postData).then(response => {
      return dispatch(receiveUpload(response));
    });
  };
}

export function createUpload(provider, authToken) {
  return dispatch => dispatch(postAndReceiveUpload(provider, authToken));
}
