import * as types from '../types'
import { api, config } from '../bees'
import jwt from 'jsonwebtoken'

/**
 * Authorizations
 *
 */
function receiveWebToken(authToken) {
  return {
    type: types.RECEIVE_WEB_TOKEN,
    isRequesting: false,
    authToken
  }
}

function requestAuthorization() {
  return {
    type: types.REQUEST_AUTHORIZATION,
    authToken: null,
    isRequesting: true
  }
}

function receiveAuthorization(response) {
  const authToken = response.authToken
  return {
    type: types.RECEIVE_AUTHORIZATION,
    isRequesting: false,
    receivedAt: Date.now(),
    authToken
  }
}

// This should probably be renamed
function updateAuthorization(updated) {
  return dispatch => {
    dispatch(requestAuthorization())

    const attributes = {
      id: updated.id,
      code: updated.code
    }
    const patchData = {
      data: {
        type: 'post',
        attributes
      }
    }

    return api
      .updateAuthorization({ id: updated.id }, patchData)
      .then(response => {
        const jsonData = response.body
        const updatedWebToken = jwt.sign(jsonData, process.env.REACT_APP_SECRET, { algorithm: 'HS256' })
        dispatch(authorize(updatedWebToken))
      })
  }
}

function receiveClientAuthorization(response, oauthToken) {
  return (dispatch, getState) => {
    // Here the auth. is not extracted from the HTTP response
    const authToken = response.authToken
    const webToken = jwt.verify(authToken, process.env.REACT_APP_SECRET, { algorithms: ['HS256'] })
    // This does come with problems from the API
    // Without updating the Authorization, the token cannot be passed to the API
    // Updating the Authorization is a bit of a security risk, but I suppose that this is the case for any Authorization
    // IDs (we just don't let clients retrieve an #index of all Authorizations)
    const updated = { id: webToken.data.id, code: oauthToken }
    dispatch(updateAuthorization(updated))

    return {
      type: types.RECEIVE_AUTHORIZATION,
      isRequesting: false,
      receivedAt: Date.now(),
      authToken
    }
  }
}

export function createClientAuthorization(oauthToken) {
  return (dispatch, getState) => {
    dispatch(requestAuthorization())

    const state = getState()
    const provider = state.selectedProvider

    // This is not a REST operation
    const endpoint = config.baseUrl
    const requestUrl = `${endpoint}/providers/${provider.id}/authorize`
    const request = fetch(requestUrl)

    return request.then(
      response => {
        const jsonResponse = response.json()
        return jsonResponse.then(json => {
          return dispatch(receiveClientAuthorization(json, oauthToken))
        })
      },
      error => {
        console.error(error)
      }
    )
  }
}

export function createAuthorization() {
  return (dispatch, getState) => {
    dispatch(requestAuthorization())

    const state = getState()
    const provider = state.selectedProvider

    // This is not a REST operation
    const endpoint = config.baseUrl
    const requestUrl = `${endpoint}/providers/${provider.id}/authorize`
    const request = fetch(requestUrl)

    return request.then(
      response => {
        const jsonResponse = response.json()
        return jsonResponse.then(json => {
          return dispatch(receiveAuthorization(json))
        })
      },
      error => {
        console.error(error)
      }
    )
  }
}

export function authorize(authToken) {
  return (dispatch, getState) => {
    return dispatch(receiveWebToken(authToken))
  }
}
