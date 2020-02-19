import { buildApi, get, patch, post } from 'redux-bees'

const apiEndpoints = {
  getProviders: { method: get, path: '/providers' },
  getProvider: { method: get, path: '/providers/:id' },
  createSession: { method: post, path: '/sessions' },
  getRootContainer: { method: get, path: '/sessions/:id/containers' },
  getContainer: { method: get, path: '/sessions/:sessionId/containers/:id' },
  createUpload: { method: post, path: '/uploads' },
  updateAuthorization: { method: patch, path: '/authorizations/:id' }
}

export const config = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/browse'
}

export const api = buildApi(apiEndpoints, config)
