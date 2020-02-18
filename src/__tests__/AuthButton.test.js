import React from 'react'
import AuthButton from '../containers/AuthButton'
import { render } from '@testing-library/react'

describe('<AuthButton />', () => {
  let defaultProps = {
    handleClick: () => {},
    authorizationUrl: 'http://cloud.org/authorize'
  }

  it('renders without crashing', () => {
    expect(render(<AuthButton {...defaultProps} />))
  })

  it('renders the auth button', () => {
    const { getByTestId, debug } = render(<AuthButton {...defaultProps} />)
    expect(getByTestId('auth-button')).toBeInTheDocument()
  })

  it('renders the Sign in', () => {
    const { getByTestId, debug } = render(<AuthButton {...defaultProps} />)
    expect(getByTestId('auth-button')).toHaveTextContent(/sign in/i)
  })

  it('renders the Authorized', () => {
    const { getByTestId, debug } = render(
      <AuthButton {...defaultProps} disabled={true} />
    )
    expect(getByTestId('auth-button')).toHaveTextContent(/authorized/i)
  })
})
