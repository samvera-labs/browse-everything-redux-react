import reducer from '../reducers'
import * as types from '../actions'

describe('the reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      selectedProvider: {},
      providers: {
        isRequesting: false,
        items: []
      },
      currentSession: {
        isRequesting: false,
        item: {}
      },
      rootContainer: {
        item: {},
        isRequesting: false
      },
      currentAuthToken: {},
      currentUpload: {
        isRequesting: false,
        item: {
          containers: [],
          bytestreams: []
        }
      }
    }
    const response = reducer(undefined, {})
    expect(response).toEqual(initialState)
  })
})
