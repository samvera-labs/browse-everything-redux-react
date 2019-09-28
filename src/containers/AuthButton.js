import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

class AuthButton extends React.Component {
  render() {
    const textContent = this.props.disabled ? 'Authorized' : 'Sign In';
    return (
      <Button variant="contained" color="secondary" style={this.props.style} onClick={this.props.handleClick} href={this.props.authorizationURL} disabled={this.props.disabled}>{textContent}</Button>
    );
  }
}

AuthButton.propTypes = {
  style: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  authorizationURL: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default AuthButton;
