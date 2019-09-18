
import reducer from '../../structuring-reducers/todos'
import * as types from '../../constants/ActionTypes'

describe('the reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should update the state for a SELECT_PROVIDER action', () => {
    const provider1 = {

    }

    let updatedState = reducer([], {
      type: types.SELECT_PROVIDER,
      provider: 'provider'
    })
    let expectedState = [
      {
        provider: provider1
      }
    ]
    expect(updatedState.toEqual(expectedState))

    updatedState = reducer(
      [
        {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ],
      {
        type: types.ADD_TODO,
        text: 'Run the tests'
      }
    )
    expectedState = [
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      },
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ]

    expect(updatedState).toEqual(expectedState)
  })
})
