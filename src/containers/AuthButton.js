import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

class AuthButton extends React.Component {
  render() {
    const textContent = this.props.disabled ? 'Authorized' : 'Sign In';
    return (
      <Button
        variant="contained"
        color="secondary"
        className={this.props.classes.root}
        onClick={this.props.handleClick}
        href={this.props.authorizationUrl}
        disabled={this.props.disabled}>{textContent}
      </Button>
    );
  }
}

AuthButton.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  authorizationUrl: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

const styles = {
  root: {
    alignSelf: 'center'
  }
};

export default withStyles(styles)(AuthButton);
