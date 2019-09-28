import React from 'react';
import './UploadForm.css';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import SelectProvider from './SelectProvider';
import AuthButton from './AuthButton';
import ResourceTree from './ResourceTree';
import ResourceNode from './ResourceNode';
import Grid from '@material-ui/core/Grid';
import { selectProvider, updateProviders, getRootContainer, createSession, authorize } from '../actions';
import Paper from '@material-ui/core/Paper';

class UploadForm extends React.Component {
  // This should be refactored
  state = {
    providerSupportsAuth: false
  }

  constructor(props) {
    super(props);
    this.handleChangeProvider = this.handleChangeProvider.bind(this)
    this.handleClickAuthButton = this.handleClickAuthButton.bind(this)
    this.handleAuthorize = this.handleAuthorize.bind(this)
  }

  handleChangeProvider(event) {
    const providerId = event.target.value;
    const provider = this.props.providers.items.find(provider => provider.id === providerId);
    this.props.dispatch(selectProvider(provider));
  }

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

  componentDidMount() {
    // Once the component mounts the DOM, retrieve all Providers from the API
    this.props.dispatch(updateProviders());
    window.document.addEventListener('browseEverything.authorize', this.handleAuthorize);
  }

  componentDidUpdate(prevProps) {
    // If a Session has been established, retrieve all entries from the root
    // container

    // Request the root container if the Session is already established
    if (Object.keys(this.props.currentSession.item).length > 0) {
      if (!this.props.rootContainer.isRequesting) {
        this.props.dispatch(getRootContainer(this.props.currentSession.item, this.props.currentAuthToken.authToken));
      }
    } else if (this.props.selectedProvider.id) {
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
      <form className="upload">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <SelectProvider style={this.props.style.selectProvider} handleChange={this.handleChangeProvider} selectedProvider={this.props.selectedProvider} providers={this.props.providers}/>
          </Grid>

          <Grid item xs={6} style={this.props.style.grid.item}>
            { this.state.providerSupportsAuth &&
                <AuthButton style={this.props.style.authButton} handleClick={this.handleClickAuthButton} authorizationUrl={this.props.selectedProvider.authorizationUrl} disabled={this.props.currentAuthToken.authToken}/>
            }
          </Grid>

          <Grid container spacing={3} align="left">
            <Grid item xs={12}>
              <Paper>
                <ResourceTree style={this.props.style.resourceTree} root={true} label="Current Files">

                  <ResourceTree style={this.props.style} label="Test Directory" />
                  <ResourceNode style={this.props.style} label="Test File" />
                </ResourceTree>
              </Paper>
            </Grid>
          </Grid>

          <Grid item xs={12} align="left">
            <label htmlFor="upload-form-submit">
              <Button variant="contained" color="primary" style={this.props.style.submit}>Upload</Button>
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
