import React from 'react'
import SelectProvider from '../containers/SelectProvider'
import { render } from '@testing-library/react'

const mockFn = jest.fn()

const defaultProps = {
  selectedProvider: { foo: 'bar' },
  providers: { items: [], id: 'ABC123', name: 'Ima provider 1' },
  handleChange: mockFn
}

it('renders without crashing', () => {
  expect(render(<SelectProvider {...defaultProps} />))
})

it('renders the select provider form control', () => {
  const { getByTestId } = render(<SelectProvider {...defaultProps} />)
  expect(getByTestId('select-provider-wrapper')).toBeInTheDocument()
})

it('renders the select element', () => {
  const { getByTestId } = render(<SelectProvider {...defaultProps} />)
  expect(getByTestId('select-provider')).toBeInTheDocument()
})
