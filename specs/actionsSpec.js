
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../../actions/TodoActions'
import * as types from '../../constants/ActionTypes'
import fetchMock from 'fetch-mock'
//import expect from 'expect' // You can use any testing library

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('actions', () => {
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

  it('creates FETCH_TODOS_SUCCESS when fetching todos has been done', () => {
    // These should be loaded from fixture files
    const provider1 = {

    }

    const provider2 = {

    }

    fetchMock.getOnce('/browse/providers', {
      body: { providers: [provider1, provider2] },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: types.REQUEST_PROVIDERS },
      { type: types.RECEIVE_PROVIDERS, body: { providers: [provider1, provider2] } }
    ]
    const store = mockStore({ todos: [] })

    return store.dispatch(actions.fetchTodos()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})


