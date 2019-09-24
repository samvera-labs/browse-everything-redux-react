import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

class AuthButton extends React.Component {
  render() {
    return (
      <Button variant="contained" color="secondary" style={this.props.style} onClick={this.props.handleClick} href={this.props.authorizationURL}>Sign In</Button>
    );
  }
}

AuthButton.propTypes = {
  style: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  authorizationURL: PropTypes.string.isRequired
};

export default AuthButton;
