import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    alignSelf: 'center',
    float: 'right'
  }
}

const AuthButton = ({ classes, handleClick, authorizationUrl, disabled }) => {
  const textContent = disabled ? 'Authorized' : 'Sign In'

  return (
    <Button
      data-testid="auth-button"
      variant="contained"
      color="secondary"
      className={classes.root}
      onClick={handleClick}
      href={authorizationUrl}
      disabled={disabled}
    >
      {textContent}
    </Button>
  )
}

AuthButton.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  authorizationUrl: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

export default withStyles(styles)(AuthButton)
