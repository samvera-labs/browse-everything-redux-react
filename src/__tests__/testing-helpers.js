import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import reducer from '../reducers'
import configureStore from '../configureStore'

// this is a handy function that I normally make available for all my tests
// that deal with connected components.
// you can provide initialState for the entire store that the ui is rendered with
export function renderWithRedux(
  ui,
  { initialState, store = configureStore(initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store
  }
}
