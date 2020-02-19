import React from 'react'
import ResourceNode from '../containers/ResourceNode'
import { render } from '@testing-library/react'

const mockDispatch = jest.fn()

const defaultProps = {
  selected: false,
  label: 'Ima label',
  bytestream: { foo: 'bar ' },
  dispatch: mockDispatch
}

it('renders without crashing', () => {
  expect(render(<ResourceNode {...defaultProps} />))
})

it('renders the resource node checkbox', () => {
  const { getByTestId } = render(<ResourceNode {...defaultProps} />)
  expect(getByTestId('resource-node-checkbox')).toBeInTheDocument()
})

it('renders expand/collapse button', () => {
  const { getByTestId } = render(<ResourceNode {...defaultProps} />)
  expect(getByTestId('expand-collapse-button')).toBeInTheDocument()
})
