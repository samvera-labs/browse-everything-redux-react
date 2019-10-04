import React from 'react';
import './UploadForm.css';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import SelectProvider from './SelectProvider';
import AuthButton from './AuthButton';
import ResourceTree from './ResourceTree';
import ResourceNode from './ResourceNode';
import Grid from '@material-ui/core/Grid';
import { selectProvider, updateProviders, getRootContainer, createSession, authorize, createUpload } from '../actions';
import Paper from '@material-ui/core/Paper';

class UploadForm extends React.Component {
  // This should be refactored
  state = {
    providerSupportsAuth: false,
    rootContainerEmpty: true,
    currentUploadEmpty: true
  }

  constructor(props) {
    super(props);
    this.handleChangeProvider = this.handleChangeProvider.bind(this);
    this.handleClickAuthButton = this.handleClickAuthButton.bind(this);
    this.handleAuthorize = this.handleAuthorize.bind(this);
    /** @todo Investigate why this isn't being propagate */
    this.handleSubmit = this.handleSubmit.bind(this);
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
    if (event.detail) {
      this.props.dispatch(authorize(event.detail.authToken));
    }
  }

  // @todo Address why this is not being triggered by the Material UI Button
  // The Button should propagate a <form> submit event
  handleSubmit(event) {
    event.preventDefault();

    this.props.dispatch(createUpload(event.target));
  }

  handleClickSubmit(event) {
    this.props.dispatch(createUpload(this.props.currentAuthToken.authToken));
  }

  componentDidMount() {
    // Once the component mounts the DOM, retrieve all Providers from the API
    this.props.dispatch(updateProviders());
    window.document.addEventListener('browseEverything.authorize', this.handleAuthorize);
  }

  /**
   * This requires a signficant refactor
   * Perhaps decomposing some components will be necessary in order to more
   * properly structure this
   *
   * This is also likely where the performance issues are arising
   */
  componentDidUpdate(prevProps) {
    // If a Session has been established, retrieve all entries from the root
    // container

    // Request the root container if the Session is already established
    // This requires a refactor
    const currentSessionEmpty = Object.keys(this.props.currentSession.item).length === 0;
    const rootContainerEmpty = Object.keys(this.props.rootContainer.item).length === 0;
    if (this.state.rootContainerEmpty !== rootContainerEmpty) {
      this.setState({rootContainerEmpty: rootContainerEmpty});
    }

    const currentUploadEmpty = this.props.currentUpload.item.containers.length === 0 && this.props.currentUpload.item.bytestreams.length === 0;
    if (this.state.currentUploadEmpty !== currentUploadEmpty) {
      this.setState({currentUploadEmpty: currentUploadEmpty});
    }

    // If the session is established and there is no root container, request it
    // and build the file tree
    if (!currentSessionEmpty && rootContainerEmpty) {
      if (!this.props.rootContainer.isRequesting) {
        this.props.dispatch(getRootContainer(this.props.currentSession.item, this.props.currentAuthToken.authToken));
      }
    } else if (currentSessionEmpty && this.props.selectedProvider.id) {
      // If there is no session and a provider has been selected, create a
      // session
      const requestedProvider = this.props.providers.items.find(provider => provider.id === this.props.selectedProvider.id);
      if (!requestedProvider) {
        throw new Error(`Unsupported provider selected: ${this.props.selectedProvider.id}`)
      }

      // This is a point for a refactor
      const providerSupportsAuth = !!requestedProvider.authorizationUrl;
      if (providerSupportsAuth !== this.state.providerSupportsAuth) {
        this.setState({ providerSupportsAuth: providerSupportsAuth });
      }

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
    return (
      <form className="upload" onSubmit={this.handleSubmit}>
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
              <Paper>
                {!this.state.rootContainerEmpty &&
                  <ResourceTree
                    style={this.props.style.resourceTree}
                    root={true}
                    container={this.props.rootContainer.item}
                    dispatch={this.props.dispatch}
                  />
                }
              </Paper>
            </Grid>
          </Grid>

          <Grid item xs={12} align="left">
            <label htmlFor="upload-form-submit">
              <Button
                variant="contained"
                color="primary"
                style={this.props.style.submit}
                disabled={this.state.currentUploadEmpty}
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

  dispatch: PropTypes.func.isRequired
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
