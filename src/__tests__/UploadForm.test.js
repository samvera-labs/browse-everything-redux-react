import React from 'react'
import UploadForm from '../containers/UploadForm'
import { render } from '@testing-library/react'

const mockOnUpload = jest.fn()
const mockDispatch = jest.fn()

const defaultProps = {
  selectedProvider: { foo: 'bar' },
  providers: { items: [], id: 'ABC123', name: 'Ima provider 1' },
  currentAuthToken: { foo: 'bar ' },
  currentSession: {},
  rootContainer: {},
  currentUpload: {},
  dispatch: mockDispatch,
  onUpload: mockOnUpload
}

it('renders without crashing', () => {
  expect(render(<UploadForm {...defaultProps} />))
})

it('renders the form', () => {
  const { getByTestId } = render(<UploadForm {...defaultProps} />)
  expect(getByTestId('upload-form')).toBeInTheDocument()
})

it('renders the Select Providers section', () => {
  const { getByTestId } = render(<UploadForm {...defaultProps} />)
  expect(getByTestId('select-provider-wrapper')).toBeInTheDocument()
})

it('renders the resource tree section', () => {
  const { getByTestId } = render(<UploadForm {...defaultProps} />)
  expect(getByTestId('resource-tree-wrapper')).toBeInTheDocument()
})

it('renders the submit button', () => {
  const { getByTestId } = render(<UploadForm {...defaultProps} />)
  expect(getByTestId('upload-submit-button')).toBeInTheDocument()
})
