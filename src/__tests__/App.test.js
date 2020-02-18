import React from 'react'
import App from '../containers/App'
import { renderWithRedux } from './testing-helpers'

it('renders without crashing', () => {
  expect(renderWithRedux(<App />))
})
