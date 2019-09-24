import React from 'react';
import './UploadForm.css';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import SelectProvider from './SelectProvider';
import AuthButton from './AuthButton';
import ResourceTree from './ResourceTree';
import ResourceNode from './ResourceNode';
import Grid from '@material-ui/core/Grid';
import { selectProvider, getRootContainer, createSession } from '../actions';
import Paper from '@material-ui/core/Paper';

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangeProvider = this.handleChangeProvider.bind(this)
    this.handleClickAuthButton = this.handleClickAuthButton.bind(this)
    this.handleAuthorize = this.handleAuthorize.bind(this)
    this.authorizationURL = 'https://accounts.google.com/o/oauth2/auth?access_type=offline&approval_prompt=force&client_id=484835294878-9cg485q5tpqq6gna68ntntvnujt2dgt6.apps.googleusercontent.com&include_granted_scopes=true&redirect_uri=http://localhost:3000/browse/providers/google_drive/authorize&response_type=code&scope=https://www.googleapis.com/auth/drive';
  }

  handleChangeProvider(event) {
    const provider = event.target.value;
    this.props.dispatch(selectProvider(provider));
  }

  handleClickAuthButton(event) {
    // This opens the new window for the OAuth
    window.open(this.authorizationURL);
  }

  handleAuthorize(event) {
    // Update the state with the authorization
    this.props.dispatch(authorize(event.authToken));
  }

  componentDidMount() {
    //this.props.dispatch(getProviders());
    window.addEventListener('browseEverything.authorize', this.handleAuthorize);
  }

  componentDidUpdate(props) {

    if (this.props.currentSession) {
      this.props.dispatch(getRootContainer(this.props.currentSession));
    } else if (this.props.selectedProvider) {
      this.props.dispatch(createSession(this.props.selectedProvider));
    }
  }

  render() {
    return (
      <form className="upload">
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <SelectProvider style={this.props.style.selectProvider} handleChange={this.handleChangeProvider} provider={this.props.selectedProvider}/>
          </Grid>

          <Grid item xs={6} style={this.props.style.grid.item}>
            <AuthButton style={this.props.style.authButton} handleClick={this.handleClickAuthButton} authorizationURL={this.authorizationURL}/>
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
  selectedProvider: PropTypes.string.isRequired,
  currentProvider: PropTypes.object,
  authorization: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

UploadForm.defaultProps = {
  style: {
    submit: {
    },
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
  },
  authorizationURL: 'https://accounts.google.com/o/oauth2/auth?access_type=offline&approval_prompt=force&client_id=484835294878-9cg485q5tpqq6gna68ntntvnujt2dgt6.apps.googleusercontent.com&include_granted_scopes=true&redirect_uri=http://localhost:3000/browse/providers/google_drive/authorize&response_type=code&scope=https://www.googleapis.com/auth/drive'
}

export default UploadForm;
