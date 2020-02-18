import React from 'react'
import ReactDOM from 'react-dom'
import AuthButton from '../containers/AuthButton'

describe('<AuthButton />', () => {
  let defaultProps = {
    handleClick: () => {},
    authorizationUrl: 'http://cloud.org/authorize'
  }

  it('renders the Sign in', () => {
    // const wrapper = mount(<AuthButton {...defaultProps} />);
    // expect(wrapper).toBeTruthy;
    // expect(wrapper.text()).toEqual('Sign In');
  })

  it('renders the Authorized', () => {
    // const wrapper = mount(<AuthButton disabled={true} {...defaultProps} />);
    // expect(wrapper).toBeTruthy;
    // expect(wrapper.text()).toEqual('Authorized');
  })
})
