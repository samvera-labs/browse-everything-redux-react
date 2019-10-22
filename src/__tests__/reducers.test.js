import reducer from '../reducers';
import * as types from '../actions';

describe('the reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      selectProvider: {},
      updateProviders: {
        providers: {
          didInvalidate: false,
          isFetching: false,
          items: []
        }
      }
    };

    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should update the state for a SELECT_PROVIDER action', () => {
    const provider1 = {};

    let updatedState = reducer([], {
      type: types.SELECT_PROVIDER,
      provider: 'file_system'
    });

    let expectedState = {
      selectProvider: {},
      updateProviders: {
        providers: {
          didInvalidate: false,
          isFetching: false,
          items: [provider1]
        }
      }
    };
    expect(updatedState).toEqual(expectedState);
  });
});
