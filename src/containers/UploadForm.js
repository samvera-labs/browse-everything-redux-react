import React from 'react';
import PropTypes from 'prop-types';

import './UploadForm.css';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import SelectProvider from './SelectProvider';
import AuthButton from './AuthButton';
import ResourceTree from './ResourceTree';
import {
  selectProvider,
  updateProviders,
  clearProvider,
  getRootContainer,
  createSession,
  clearSession,
  authorize,
  createAuthorization,
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
      /**
       * When there is an existing session and an upload has been created
       */
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
      /**
       * If the session is established and there is no root container, request 
       * it and build the resource tree
       */
      if (!this.props.rootContainer.isRequesting) {
        this.props.dispatch(getRootContainer(this.props.currentSession.item, this.props.currentAuthToken.authToken));
      }
    } else if (this.state.currentSessionEmpty && this.props.selectedProvider.id) {
      /**
       * If there is no session and a provider has been selected, create a
       * session
       */
      const requestedProvider = this.props.providers.items.find(provider => provider.id === this.props.selectedProvider.id);
      if (!requestedProvider) {
        throw new Error(`Unsupported provider selected: ${this.props.selectedProvider.id}`)
      }
      const providerSupportsAuth = !!requestedProvider.authorizationUrl;
      this.updateProviderSupportsAuth(providerSupportsAuth);

      if (this.props.currentAuthToken.authToken) {
        // We only want to request a new session if one is not already being
        // requested
        if (!this.props.currentSession.isRequesting) {
          this.props.dispatch(createSession(this.props.selectedProvider, this.props.currentAuthToken.authToken));
        }
      } else if (!providerSupportsAuth) {
        if (!this.props.currentAuthToken.isRequesting) {
          this.props.dispatch(createAuthorization());
        }
      }
    }
  }

  render() {
    let resourceTree;

    if (!this.props.currentUpload.isRequesting && !this.state.rootContainerEmpty) {
      resourceTree = <ResourceTree
                               root={true}
                               container={this.props.rootContainer.item}
                               dispatch={this.props.dispatch}
                             />;
    } else {
      let rootContainerText = 'Please select a provider';

      if (this.props.currentUpload.isRequesting) {
        rootContainerText = 'Uploading files...';
      } else if (!!this.props.currentAuthToken.authToken) {
        rootContainerText = 'Loading content...';
      }

      resourceTree = <Typography className={this.props.classes.resourceTree} variant="body1" component="div">{rootContainerText}</Typography>;
    }

    return (
      <form className={this.props.classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <SelectProvider
                handleChange={this.handleChangeProvider}
                selectedProvider={this.props.selectedProvider}
                providers={this.props.providers}
            />
          </Grid>

          <Grid item xs={6} className={this.props.classes.grid.item}>
            {this.state.providerSupportsAuth &&
              <AuthButton
                handleClick={this.handleClickAuthButton}
                authorizationUrl={this.props.selectedProvider.authorizationUrl}
                disabled={!!this.props.currentAuthToken.authToken}
              />
            }
          </Grid>

          <Grid container spacing={3} align="left">
            <Grid item xs={12} height={200} className={this.props.classes.resourceTreeContainer}>
              <Paper>{resourceTree}</Paper>
            </Grid>
          </Grid>

          <Grid item xs={12} align="left">
            <label htmlFor="upload-form-submit">
              <Button
                variant="contained"
                color="primary"
                className={this.props.classes.submit}
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
  classes: PropTypes.object.isRequired,

  selectedProvider: PropTypes.object.isRequired,
  providers: PropTypes.object.isRequired,
  currentAuthToken: PropTypes.object.isRequired,
  currentSession: PropTypes.object.isRequired,
  rootContainer: PropTypes.object.isRequired,
  currentUpload: PropTypes.object.isRequired,

  dispatch: PropTypes.func.isRequired,
  onUpload: PropTypes.func
};

const styles = {
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
};

export default withStyles(styles)(UploadForm);
