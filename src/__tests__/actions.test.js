import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from '../types'
import * as actions from '../actions'
import fetchMock from 'fetch-mock'
import tk from 'timekeeper'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
  const currentTime = Date.now()

  beforeAll(() => {
    tk.freeze(currentTime)
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('should create an action to select a provider', () => {
    const provider = 'google_drive'
    const expectedAction = {
      type: types.SELECT_PROVIDER,
      provider
    }

    expect(actions.selectProvider(provider)).toEqual(expectedAction)
  })

  it('dispatches REQUEST_PROVIDERS and RECEIVE_PROVIDERS when providers have been requested and received from the API', () => {
    // These should be loaded from fixture files
    const provider1 = {}

    const provider2 = {}

    fetchMock.getOnce('http://localhost:3000/browse/providers', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        data: [provider1, provider2]
      }
    })

    const expectedActions = [
      { type: types.REQUEST_PROVIDERS, isRequesting: true, providers: [] },
      {
        type: types.RECEIVE_PROVIDERS,
        isRequesting: false,
        providers: [provider1, provider2],
        receivedAt: currentTime
      }
    ]
    const store = mockStore({ providers: [] })

    const promise = store.dispatch(actions.updateProviders())
    const fulfilled = promise.then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
