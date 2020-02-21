import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './UploadForm.css'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import SelectProvider from './SelectProvider'
import AuthButton from './AuthButton'
import ResourceTree from './ResourceTree'
import {
  selectProvider,
  updateProviders,
  getRootContainer,
  createSession,
  clearSession,
  authorize,
  createAuthorization,
  createUpload
} from '../actions'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles({
  root: {},
  grid: {
    item: {
      alignSelf: 'center'
    }
  },
  resourceTreeContainer: {
    overflow: 'scroll',
    maxHeight: '29.65rem'
  },
  resourceTree: {
    padding: '0.65rem 0.85rem'
  }
})

const UploadForm = ({
  currentAuthToken,
  currentSession,
  currentUpload,
  providers,
  rootContainer,
  selectedProvider,
  onUpload
}) => {
  const [providerSupportsAuth, setProviderSupportsAuth] = useState()
  const [currentSessionEmpty, setCurrentSessionEmpty] = useState(true)
  const [rootContainerEmpty, setRootContainerEmpty] = useState(true)
  const [currentUploadEmpty, setCurrentUploadEmpty] = useState(true)
  const dispatch = useDispatch()
  const classes = useStyles()

  //
  useEffect(() => {
    // Once the component mounts the DOM, retrieve all Providers from the API
    dispatch(updateProviders())
    window.addEventListener('message', handleAuthorize)
  }, [])

  /**
   * This requires a signficant refactor
   * Perhaps decomposing some components will be necessary in order to more
   * properly structure this
   *
   * This is also likely where the performance issues are arising
   */
  // Called on every update
  useEffect(() => {
    const currentSessionEmpty = Object.keys(currentSession.item).length === 0

    updateCurrentSessionEmpty(currentSessionEmpty)

    const rootContainerEmpty = Object.keys(rootContainer.item).length === 0

    updateRootContainerEmpty(rootContainerEmpty)

    const currentUploadEmpty =
      currentUpload.item.containers.length === 0 &&
      currentUpload.item.bytestreams.length === 0

    updateCurrentUploadEmpty(currentUploadEmpty)

    if (!currentSessionEmpty && currentUpload.item.id) {
      /**
       * When there is an existing session and an upload has been created
       */
      const uploadEvent = new CustomEvent('browseEverything.upload', {
        detail: currentUpload.item
      })
      window.dispatchEvent(uploadEvent)
      if (onUpload) {
        // onUpload.call(this, uploadEvent)
        onUpload(uploadEvent)
      }

      // Reinitializing the state does not re-render the components
      // This does not seem right, probably another point to refactor
      setProviderSupportsAuth(false)
      setCurrentSessionEmpty(true)
      setRootContainerEmpty(true)
      setCurrentSessionEmpty(true)
      dispatch(clearSession())
    } else if (!currentSessionEmpty && rootContainerEmpty) {
      /**
       * If the session is established and there is no root container, request
       * it and build the resource tree
       */
      if (!rootContainer.isRequesting) {
        dispatch(
          getRootContainer(currentSession.item, currentAuthToken.authToken)
        )
      }
    } else if (currentSessionEmpty && selectedProvider.id) {
      /**
       * If there is no session and a provider has been selected, create a
       * session
       */
      const requestedProvider = providers.items.find(
        provider => provider.id === selectedProvider.id
      )
      if (!requestedProvider) {
        throw new Error(`Unsupported provider selected: ${selectedProvider.id}`)
      }
      const providerSupportsAuth = !!requestedProvider.authorizationUrl
      updateProviderSupportsAuth(providerSupportsAuth)

      if (currentAuthToken.authToken) {
        // We only want to request a new session if one is not already being
        // requested
        if (!currentSession.isRequesting) {
          dispatch(createSession(selectedProvider, currentAuthToken.authToken))
        }
      } else if (!providerSupportsAuth) {
        if (!currentAuthToken.isRequesting) {
          dispatch(createAuthorization())
        }
      }
    }
  })

  /**
   * This changes the provider when users select from the dropdown
   */
  const handleChangeProvider = event => {
    const providerId = event.target.value
    const provider = providers.items.find(
      provider => provider.id === providerId
    )
    dispatch(selectProvider(provider))
  }

  /**
   * This initiates the OAuth2 workflow in another browser window or tab
   */
  const handleClickAuthButton = event => {
    // This opens the new window for the OAuth
    event.preventDefault()
    window.open(selectedProvider.authorizationUrl)
  }

  const handleAuthorize = event => {
    // Update the state with the authorization
    if (event.data && event.data.authToken) {
      dispatch(authorize(event.data.authToken))
    }
  }

  const handleClickSubmit = () => {
    dispatch(createUpload(currentAuthToken.authToken))
  }

  const updateCurrentSessionEmpty = value => {
    if (currentSessionEmpty !== value) {
      setCurrentSessionEmpty(value)
    }
  }

  const updateRootContainerEmpty = value => {
    // Request the root container if the Session is already established
    if (rootContainerEmpty !== value) {
      setRootContainerEmpty(value)
    }
  }

  const updateCurrentUploadEmpty = value => {
    if (currentUploadEmpty !== value) {
      setCurrentUploadEmpty(value)
    }
  }

  const updateProviderSupportsAuth = value => {
    // Update the state when a provider has been selected which supports/does
    // not support authentication
    if (value !== providerSupportsAuth) {
      setProviderSupportsAuth(value)
    }
  }

  let resourceTree

  if (!currentUpload.isRequesting && !rootContainerEmpty) {
    resourceTree = (
      <ResourceTree
        root={true}
        container={rootContainer.item}
        dispatch={dispatch}
      />
    )
  } else {
    let rootContainerText = 'Please select a provider'

    if (currentUpload.isRequesting) {
      rootContainerText = 'Uploading files...'
    } else if (!!currentAuthToken.authToken) {
      rootContainerText = 'Loading content...'
    }

    resourceTree = (
      <Typography
        className={classes.resourceTree}
        variant="body1"
        component="div"
      >
        {rootContainerText}
      </Typography>
    )
  }

  return (
    <form className={classes.root} data-testid="upload-form">
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <SelectProvider
            handleChange={handleChangeProvider}
            selectedProvider={selectedProvider}
            providers={providers}
          />
        </Grid>

        <Grid item xs={6} className={classes.grid.item}>
          {providerSupportsAuth && (
            <AuthButton
              handleClick={handleClickAuthButton}
              authorizationUrl={selectedProvider.authorizationUrl}
              disabled={!!currentAuthToken.authToken}
            />
          )}
        </Grid>

        <Grid container spacing={3} align="left">
          <Grid
            item
            xs={12}
            height={200}
            className={classes.resourceTreeContainer}
          >
            <div data-testid="resource-tree-wrapper">{resourceTree}</div>
          </Grid>
        </Grid>

        <Grid item xs={12} align="left">
          <label htmlFor="upload-form-submit">
            <Button
              data-testid="upload-submit-button"
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={currentUploadEmpty || currentUpload.isRequesting}
              onClick={handleClickSubmit}
            >
              Upload
            </Button>
          </label>
        </Grid>
      </Grid>
    </form>
  )
}

UploadForm.propTypes = {
  //classes: PropTypes.object.isRequired,

  selectedProvider: PropTypes.object.isRequired,
  providers: PropTypes.object.isRequired,
  currentAuthToken: PropTypes.object.isRequired,
  currentSession: PropTypes.object.isRequired,
  rootContainer: PropTypes.object.isRequired,
  currentUpload: PropTypes.object.isRequired,

  //dispatch: PropTypes.func.isRequired,
  onUpload: PropTypes.func
}

export default UploadForm
