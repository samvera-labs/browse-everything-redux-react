import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    alignSelf: 'center'
  }
})

const AuthButton = ({ handleClick, authorizationUrl, disabled }) => {
  const classes = useStyles
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
  handleClick: PropTypes.func.isRequired,
  authorizationUrl: PropTypes.string.isRequired,
  disabled: PropTypes.bool
}

export default AuthButton
