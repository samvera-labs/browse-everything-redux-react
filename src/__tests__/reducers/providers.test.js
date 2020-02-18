import * as types from '../../types'
import {
  selectedProvider as reducerSp,
  providers as reducerP
} from '../../reducers/providers'

describe('selectedProvider reducer', () => {
  it('should return the initial state', () => {
    expect(reducerSp({}, {})).toEqual({})
  })

  it('should handle SELECT_PROVIDER action', () => {
    expect(
      reducerSp(
        {},
        {
          type: types.SELECT_PROVIDER,
          provider: 'file_system'
        }
      )
    ).toEqual('file_system')
  })

  it('should handle CLEAR_SESSION', () => {
    expect(
      reducerSp({ provider: 'Google' }, { type: types.CLEAR_SESSION })
    ).toEqual({})
  })
})

describe('providers reducer', () => {
  it('should return the initial state', () => {
    expect(reducerP({}, {})).toEqual({ isRequesting: false, items: [] })
  })

  it('should handle REQUEST_PROVIDERS', () => {
    expect(reducerP({}, { type: types.REQUEST_PROVIDERS })).toEqual({
      isRequesting: true,
      items: [],
      didInvalidate: false
    })
  })

  it('should handle RECEIVE_PROVIDERS', () => {
    expect(
      reducerP(
        {},
        {
          type: types.RECEIVE_PROVIDERS,
          providers: [{ foo: 'bar' }],
          receivedAt: '2020 January 3'
        }
      )
    ).toEqual({
      isRequesting: false,
      didInvalidate: false,
      items: [{ foo: 'bar' }],
      lastUpdated: '2020 January 3'
    })
  })
})
