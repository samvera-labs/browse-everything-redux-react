import { buildApi, get, post, patch, destroy } from 'redux-bees';

const apiEndpoints = {
    getProviders:      { method: get,     path: '/providers' },
    getProvider:       { method: get,     path: '/providers/:id' }
};

const config = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/browse'
};

export const api = buildApi(apiEndpoints, config);
