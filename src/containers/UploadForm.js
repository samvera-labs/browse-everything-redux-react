import React from 'react';
import PropTypes from 'prop-types';

import './UploadForm.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import SelectProvider from './SelectProvider';
import AuthButton from './AuthButton';
import ResourceTree from './ResourceTree';
import {
  selectProvider,
  updateProviders,
  getRootContainer,
  createSession,
  clearSession,
  authorize,
  createUpload
} from '../actions';

class UploadForm extends React.Component {
  // This should be refactored
  state = {
    providerSupportsAuth: false,
    currentSessionEmpty: true,
    rootContainerEmpty: true,
    currentUploadEmpty: true
  }

  constructor(props) {
    super(props);
    this.handleChangeProvider = this.handleChangeProvider.bind(this);
    this.handleClickAuthButton = this.handleClickAuthButton.bind(this);
    this.handleAuthorize = this.handleAuthorize.bind(this);
    /** @todo Investigate why <form onSubmit> isn't being dispatched */
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
  }

  /**
   * This changes the provider when users select from the dropdown
   */
  handleChangeProvider(event) {
    const providerId = event.target.value;
    const provider = this.props.providers.items.find(provider => provider.id === providerId);
    this.props.dispatch(selectProvider(provider));
  }

  /**
   * This initiates the OAuth2 workflow in another browser window or tab
   */
  handleClickAuthButton(event) {
    // This opens the new window for the OAuth
    event.preventDefault();
    window.open(this.props.selectedProvider.authorizationUrl);
  }

  handleAuthorize(event) {
    // Update the state with the authorization
    if (event.data && event.data.authToken) {
      this.props.dispatch(authorize(event.data.authToken));
    }
  }

  handleClickSubmit() {
    this.props.dispatch(createUpload(this.props.currentAuthToken.authToken));
  }

  componentDidMount() {
    // Once the component mounts the DOM, retrieve all Providers from the API
    this.props.dispatch(updateProviders());
    window.addEventListener('message', this.handleAuthorize);
  }

  updateCurrentSessionEmpty(currentSessionEmpty) {
    if (this.state.currentSessionEmpty !== currentSessionEmpty) {
      this.setState({currentSessionEmpty: currentSessionEmpty});
    }
  }

  updateRootContainerEmpty(rootContainerEmpty) {
    // Request the root container if the Session is already established
    if (this.state.rootContainerEmpty !== rootContainerEmpty) {
      this.setState({rootContainerEmpty: rootContainerEmpty});
    }
  }

  updateCurrentUploadEmpty(currentUploadEmpty) {
    if (this.state.currentUploadEmpty !== currentUploadEmpty) {
      this.setState({currentUploadEmpty: currentUploadEmpty});
    }
  }

  updateProviderSupportsAuth(providerSupportsAuth) {
    // Update the state when a provider has been selected which supports/does
    // not support authentication
    if (providerSupportsAuth !== this.state.providerSupportsAuth) {
      this.setState({ providerSupportsAuth: providerSupportsAuth });
    }
  }

  /**
   * This requires a signficant refactor
   * Perhaps decomposing some components will be necessary in order to more
   * properly structure this
   *
   * This is also likely where the performance issues are arising
   */
  componentDidUpdate() {
    const currentSessionEmpty = Object.keys(this.props.currentSession.item).length === 0;
    this.updateCurrentSessionEmpty(currentSessionEmpty);

    const rootContainerEmpty = Object.keys(this.props.rootContainer.item).length === 0;
    this.updateRootContainerEmpty(rootContainerEmpty);

    const currentUploadEmpty = this.props.currentUpload.item.containers.length === 0 && this.props.currentUpload.item.bytestreams.length === 0;
    this.updateCurrentUploadEmpty(currentUploadEmpty);

    if (!this.state.currentSessionEmpty && this.props.currentUpload.item.id) {
      const uploadEvent = new CustomEvent('browseEverything.upload', { detail: this.props.currentUpload.item });
      window.dispatchEvent(uploadEvent);
      if (this.props.onUpload) {
        this.props.onUpload.call(this, uploadEvent);
      }

      // Reinitializing the state does not re-render the components
      // This does not seem right, probably another point to refactor
      this.setState({
        providerSupportsAuth: false,
        currentSessionEmpty: true,
        rootContainerEmpty: true,
        currentUploadEmpty: true
      });
      this.props.dispatch(clearSession());
    } else if (!this.state.currentSessionEmpty && this.state.rootContainerEmpty) {

      // If the session is established and there is no root container, request it
      //   and build the file tree
      if (!this.props.rootContainer.isRequesting) {
        this.props.dispatch(getRootContainer(this.props.currentSession.item, this.props.currentAuthToken.authToken));
      }
    } else if (this.state.currentSessionEmpty && this.props.selectedProvider.id) {

      // If there is no session and a provider has been selected, create a
      //   session
      const requestedProvider = this.props.providers.items.find(provider => provider.id === this.props.selectedProvider.id);
      if (!requestedProvider) {
        throw new Error(`Unsupported provider selected: ${this.props.selectedProvider.id}`)
      }
      const providerSupportsAuth = !!requestedProvider.authorizationUrl;
      this.updateProviderSupportsAuth(providerSupportsAuth);

      if (!providerSupportsAuth || this.props.currentAuthToken.authToken) {
        // We only want to request a new session if one is not already being
        // requested
        if (!this.props.currentSession.isRequesting) {
          this.props.dispatch(createSession(this.props.selectedProvider, this.props.currentAuthToken.authToken));
        }
      }
    }
  }

  render() {
    let rootContainerContent;

    if(this.props.currentUpload.isRequesting) {
      rootContainerContent = <Typography variant="h3" component="div">Uploading files...</Typography>;
    } else if (!this.state.rootContainerEmpty) {
      rootContainerContent = <ResourceTree
                               style={this.props.style.resourceTree}
                               root={true}
                               container={this.props.rootContainer.item}
                               dispatch={this.props.dispatch}
                             />;
    } else if(!!this.props.currentAuthToken.authToken) {
      rootContainerContent = <Typography variant="h3" component="div">Loading content...</Typography>;
    } else {
      rootContainerContent = <Typography variant="h3" component="div">Please select a provider</Typography>;
    }

    return (
      <form className="upload">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <SelectProvider
                style={this.props.style.selectProvider}
                handleChange={this.handleChangeProvider}
                selectedProvider={this.props.selectedProvider}
                providers={this.props.providers}
            />
          </Grid>

          <Grid item xs={6} style={this.props.style.grid.item}>
            {this.state.providerSupportsAuth &&
              <AuthButton
                style={this.props.style.authButton}
                handleClick={this.handleClickAuthButton}
                authorizationUrl={this.props.selectedProvider.authorizationUrl}
                disabled={!!this.props.currentAuthToken.authToken}
              />
            }
          </Grid>

          <Grid container spacing={3} align="left">
            <Grid item xs={12}>
              <Paper>{rootContainerContent}</Paper>
            </Grid>
          </Grid>

          <Grid item xs={12} align="left">
            <label htmlFor="upload-form-submit">
              <Button
                variant="contained"
                color="primary"
                style={this.props.style.submit}
                disabled={this.state.currentUploadEmpty || this.props.currentUpload.isRequesting}
                onClick={this.handleClickSubmit}
              >Upload</Button>
            </label>
          </Grid>

        </Grid>
      </form>
    );
  }
}

UploadForm.propTypes = {
  style: PropTypes.object,

  selectedProvider: PropTypes.object.isRequired,
  providers: PropTypes.object.isRequired,
  currentAuthToken: PropTypes.object.isRequired,
  currentSession: PropTypes.object.isRequired,
  rootContainer: PropTypes.object.isRequired,
  currentUpload: PropTypes.object.isRequired,

  dispatch: PropTypes.func.isRequired,
  onUpload: PropTypes.func
};

UploadForm.defaultProps = {
  style: {
    selectProvider: {
      formControl: {
        display: 'flex',
        flexWrap: 'wrap'
      }
    },
    grid: {
      item: {
        alignSelf: 'center'
      }
    },
    authButton: {
      alignSelf: 'center'
    }
  }
}

export default UploadForm;
