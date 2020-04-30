import React from 'react'
import PropTypes from 'prop-types'

import './UploadForm.css'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import SelectProvider from './SelectProvider'
import AuthButton from './AuthButton'
import ResourceTree from './ResourceTree'
import GooglePickerTree from './GooglePickerTree'
import {
  selectProvider,
  updateProviders,
  getRootContainer,
  createSession,
  clearSession,
  authorize,
  createAuthorization,
  createClientAuthorization,
  createUpload
} from '../actions'

class UploadForm extends React.Component {
  // This should be refactored
  state = {
    providerSupportsAuth: false,
    currentSessionEmpty: true,
    rootContainerEmpty: true,
    currentUploadEmpty: true,
    oauthToken: null
  }

  constructor(props) {
    super(props)
    this.handleChangeProvider = this.handleChangeProvider.bind(this)
    this.handleClickAuthButton = this.handleClickAuthButton.bind(this)
    this.handleAuthorize = this.handleAuthorize.bind(this)
    /** @todo Investigate why <form onSubmit> isn't being dispatched */
    this.handleClickSubmit = this.handleClickSubmit.bind(this)
    this.requestGoogleAuth = this.requestGoogleAuth.bind(this)
    this.clearSession = this.clearSession.bind(this)
  }

  clearSession() {
    /**
     * When there is an existing session and an upload has been created
     */
    if (this.props.currentUpload) {
      const uploadEvent = new CustomEvent('browseEverything.upload', {
        detail: this.props.currentUpload.item
      })
      window.dispatchEvent(uploadEvent)
      if (this.props.onUpload) {
        this.props.onUpload.call(this, uploadEvent)
      }
    }

    // Reinitializing the state does not re-render the components
    // This does not seem right, probably another point to refactor
    this.setState({
      providerSupportsAuth: false,
      currentSessionEmpty: true,
      rootContainerEmpty: true,
      currentUploadEmpty: true
    })
    this.props.dispatch(clearSession())
  }

  /**
   * This changes the provider when users select from the dropdown
   */
  handleChangeProvider(event) {
    const providerId = event.target.value
    const provider = this.props.providers.items.find(
      provider => provider.id === providerId
    )
    this.props.dispatch(selectProvider(provider))
  }

  requestGoogleAuth() {
    const initialized = window.gapi.auth2.init({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID
    })

    initialized.then(googleAuth => {
      let authenticated
      authenticated = googleAuth.signIn({
        scope: process.env.REACT_APP_GOOGLE_SCOPE
      })

      authenticated.then(
        result => {
          const authResponse = result.getAuthResponse(true)

          if (authResponse) {
            if (authResponse.error) {
              console.error(authResponse.error)
              this.clearSession()
            } else {
              // This might actually be a Google API bug
              const oauthToken = authResponse.access_token || result.uc.access_token
              if (oauthToken) {
                this.setState({ oauthToken })
                this.props.dispatch(
                  createClientAuthorization(this.state.oauthToken)
                )
              } else {
                console.error('Failed to retrieve the OAuth2 token from the Google API response.')
                console.error(authResponse)
                this.clearSession()
              }
            }
          }
        },
        error => {
          this.clearSession()
        }
      )
    })
  }

  /**
   * This initiates the OAuth2 workflow in another browser window or tab
   */
  handleClickAuthButton(event) {
    event.preventDefault()

    if (this.googlePickerApi) {
      this.requestGoogleAuth()
    } else {
      // This opens the new window for the OAuth
      window.open(this.props.selectedProvider.authorizationUrl)
    }
  }

  handleAuthorize(event) {
    // Update the state with the authorization
    if (event.data && event.data.authToken) {
      this.props.dispatch(authorize(event.data.authToken))
    }
  }

  handleClickSubmit() {
    this.props.dispatch(createUpload(this.props.currentAuthToken.authToken))
  }

  componentDidMount() {
    // Once the component mounts the DOM, retrieve all Providers from the API
    this.props.dispatch(updateProviders())
    window.addEventListener('message', this.handleAuthorize)
  }

  updateCurrentSessionEmpty(currentSessionEmpty) {
    if (this.state.currentSessionEmpty !== currentSessionEmpty) {
      this.setState({ currentSessionEmpty: currentSessionEmpty })
    }
  }

  updateRootContainerEmpty(rootContainerEmpty) {
    // Request the root container if the Session is already established
    if (this.state.rootContainerEmpty !== rootContainerEmpty) {
      this.setState({ rootContainerEmpty: rootContainerEmpty })
    }
  }

  updateCurrentUploadEmpty(currentUploadEmpty) {
    if (this.state.currentUploadEmpty !== currentUploadEmpty) {
      this.setState({ currentUploadEmpty: currentUploadEmpty })
    }
  }

  updateProviderSupportsAuth(providerSupportsAuth) {
    // Update the state when a provider has been selected which supports/does
    // not support authentication
    if (providerSupportsAuth !== this.state.providerSupportsAuth) {
      this.setState({ providerSupportsAuth: providerSupportsAuth })
    }
  }

  get googlePickerApi() {
    return this.props.selectedProvider.id === 'google_drive'
  }

  /**
   * This requires a signficant refactor
   * Perhaps decomposing some components will be necessary in order to more
   * properly structure this
   *
   * This is also likely where the performance issues are arising
   */
  componentDidUpdate() {
    const currentSessionEmpty =
      Object.keys(this.props.currentSession.item).length === 0
    this.updateCurrentSessionEmpty(currentSessionEmpty)

    const rootContainerEmpty =
      Object.keys(this.props.rootContainer.item).length === 0
    this.updateRootContainerEmpty(rootContainerEmpty)

    const currentUploadEmpty =
      this.props.currentUpload.item.containers.length === 0 &&
      this.props.currentUpload.item.bytestreams.length === 0
    this.updateCurrentUploadEmpty(currentUploadEmpty)

    if (!this.state.currentSessionEmpty && this.props.currentUpload.item.id) {
      /**
       * When there is an existing session and an upload has been created
       */
      const uploadEvent = new CustomEvent('browseEverything.upload', {
        detail: this.props.currentUpload.item
      })
      window.dispatchEvent(uploadEvent)
      if (this.props.onUpload) {
        this.props.onUpload.call(this, uploadEvent)
      }

      // Reinitializing the state does not re-render the components
      // This does not seem right, probably another point to refactor
      this.setState({
        providerSupportsAuth: false,
        currentSessionEmpty: true,
        rootContainerEmpty: true,
        currentUploadEmpty: true
      })
      this.props.dispatch(clearSession())
    } else if (
      !this.state.currentSessionEmpty &&
      this.state.rootContainerEmpty
    ) {
      /**
       * If the session is established and there is no root container, request
       * it and build the resource tree
       */
      if (!this.props.rootContainer.isRequesting && !this.googlePickerApi) {
        this.props.dispatch(
          getRootContainer(
            this.props.currentSession.item,
            this.props.currentAuthToken.authToken
          )
        )
      }
    } else if (
      this.state.currentSessionEmpty &&
      this.props.selectedProvider.id
    ) {
      /**
       * If there is no session and a provider has been selected, create a
       * session
       */
      const requestedProvider = this.props.providers.items.find(
        provider => provider.id === this.props.selectedProvider.id
      )
      if (!requestedProvider) {
        throw new Error(
          `Unsupported provider selected: ${this.props.selectedProvider.id}`
        )
      }

      const providerSupportsAuth =
        this.googlePickerApi || !!requestedProvider.authorizationUrl

      this.updateProviderSupportsAuth(providerSupportsAuth)

      if (this.props.currentAuthToken.authToken) {
        // We only want to request a new session if one is not already being
        // requested
        if (!this.props.currentSession.isRequesting) {
          this.props.dispatch(
            createSession(
              this.props.selectedProvider,
              this.props.currentAuthToken.authToken
            )
          )
        }
      } else if (!providerSupportsAuth) {
        if (!this.props.currentAuthToken.isRequesting) {
          this.props.dispatch(createAuthorization())
        }
      }
    }
  }

  render() {
    let resourceTree
    let renderResourceTree =
      (!this.props.currentUpload.isRequesting &&
        !this.state.rootContainerEmpty) ||
      this.googlePickerApi

    if (renderResourceTree) {
      if (this.googlePickerApi) {
        let innerText = 'Authorizing Google Drive...'
        if (this.props.currentUpload.isRequesting) {
          innerText = 'Uploading files...'
        }

        resourceTree = (
          <GooglePickerTree
            className={this.props.classes.resourceTree}
            innerText={innerText}
            dispatch={this.props.dispatch}
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            developerKey={process.env.REACT_APP_GOOGLE_DEVELOPER_KEY}
            oauthToken={this.state.oauthToken}
            handleAuthApiLoad={this.requestGoogleAuth}
            handleSubmit={this.handleClickSubmit}
            handleCancel={this.clearSession}
          />
        )
      } else {
        resourceTree = (
          <ResourceTree
            className={this.props.classes.resourceTree}
            root={true}
            container={this.props.rootContainer.item}
            dispatch={this.props.dispatch}
          />
        )
      }
    } else {
      let rootContainerText = 'Please select a provider'

      if (this.props.currentUpload.isRequesting) {
        rootContainerText = 'Uploading files...'
      } else if (!!this.props.currentAuthToken.authToken) {
        rootContainerText = 'Loading content...'
      }

      resourceTree = (
        <Typography
          className={this.props.classes.resourceTree}
          variant="body1"
          component="div"
        >
          {rootContainerText}
        </Typography>
      )
    }

    // Only checking providerSupportsAuth should be necessary
    let renderAuthButton =
      this.state.providerSupportsAuth &&
      !!this.props.selectedProvider.authorizationUrl

    let authButtonDisabled = true
    if (this.googlePickerApi) {
      authButtonDisabled = !!this.state.oauthToken || !window.gapi
    } else {
      authButtonDisabled = !!this.props.currentAuthToken.authToken
    }

    return (
      <form className={this.props.classes.root} data-testid="upload-form">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <SelectProvider
              handleChange={this.handleChangeProvider}
              selectedProvider={this.props.selectedProvider}
              providers={this.props.providers}
            />
          </Grid>

          <Grid item xs={6} className={this.props.classes.grid.item}>
            {renderAuthButton && (
              <AuthButton
                handleClick={this.handleClickAuthButton}
                authorizationUrl={this.props.selectedProvider.authorizationUrl}
                disabled={authButtonDisabled}
              />
            )}
          </Grid>

          <Grid container spacing={3} align="left">
            <Grid
              item
              xs={12}
              height={200}
              className={this.props.classes.resourceTreeContainer}
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
                disabled={
                  this.state.currentUploadEmpty ||
                  this.props.currentUpload.isRequesting
                }
                onClick={this.handleClickSubmit}
              >
                Upload
              </Button>
            </label>
          </Grid>
        </Grid>
      </form>
    )
  }
}

UploadForm.propTypes = {
  classes: PropTypes.object.isRequired,

  selectedProvider: PropTypes.object.isRequired,
  providers: PropTypes.object.isRequired,
  currentAuthToken: PropTypes.object.isRequired,
  currentSession: PropTypes.object.isRequired,
  rootContainer: PropTypes.object.isRequired,
  currentUpload: PropTypes.object.isRequired,

  dispatch: PropTypes.func.isRequired,
  onUpload: PropTypes.func
}

const styles = {
  root: {},
  grid: {
    item: {
      alignSelf: 'center'
    }
  },
  resourceTreeContainer: {
    overflow: 'scroll',
    maxHeight: '29.65rem',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#cccccc',
    marginTop: '0.7rem',
    marginBottom: '0.7rem'
  },
  resourceTree: {
    padding: '0.65rem 0.85rem',
    minHeight: '20rem'
  }
}

export default withStyles(styles)(UploadForm)
