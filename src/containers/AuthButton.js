import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

class AuthButton extends React.Component {
  render() {
    return (
      <Button variant="contained" color="secondary" style={this.props.style}>Sign In</Button>
    );
  }
}

AuthButton.propTypes = {
  style: PropTypes.object
};

export default AuthButton;
