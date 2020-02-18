import React from 'react'
import ResourceTree from '../containers/ResourceTree'
import { render } from '@testing-library/react'

const mockDispatch = jest.fn()

const defaultProps = {
  selected: false,
  root: false,
  label: 'Ima label',
  dispatch: mockDispatch,
  container: { foo: 'bar' }
}

it('renders without crashing', () => {
  expect(render(<ResourceTree {...defaultProps} />))
})

it('renders resource tree wrapper element', () => {
  const { getByTestId } = render(<ResourceTree {...defaultProps} />)
  expect(getByTestId('resource-tree-wrapper')).toBeInTheDocument()
})

it('renders primary checkbox', () => {
  const { getByTestId } = render(<ResourceTree {...defaultProps} />)
  expect(getByTestId('primary-checkbox')).toBeInTheDocument()
})

it('renders expand/collapse button', () => {
  const { getByTestId } = render(<ResourceTree {...defaultProps} />)
  expect(getByTestId('expand-collapse-button')).toBeInTheDocument()
})

// Not really sure yet how to test <StyledChildResourceTree /> and
// < ResourceNode /> presence in this component
