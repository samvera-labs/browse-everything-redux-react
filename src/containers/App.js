import React from 'react';
import PropTypes from 'prop-types';
import './App.css';
import UploadForm from './UploadForm';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom>
            Browse Everything
          </Typography>
        </Container>
        <Container maxWidth="lg">
          <UploadForm
            styles={this.props.style}
            dispatch={this.props.dispatch}
            onUpload={this.props.onUpload}
            selectedProvider={this.props.selectedProvider}
            currentAuthToken={this.props.currentAuthToken}
            providers={this.props.providers}
            currentSession={this.props.currentSession}
            rootContainer={this.props.rootContainer}
            currentUpload={this.props.currentUpload}
          />
        </Container>
      </div>
    );
  }
}

App.propTypes = {
  style: PropTypes.object,

  selectedProvider: PropTypes.object.isRequired, // This should be updated to currentProvider
  providers: PropTypes.object.isRequired,
  currentAuthToken: PropTypes.object.isRequired,
  currentSession: PropTypes.object.isRequired,
  rootContainer: PropTypes.object.isRequired,
  currentUpload: PropTypes.object.isRequired,

  dispatch: PropTypes.func.isRequired,
  onUpload: PropTypes.func
};

function mapStateToProps(state) {
  const { selectedProvider, currentAuthToken } = state
  const providers = state.providers || {
    isRequesting: false,
    items: []
  }
  const currentSession = state.currentSession || {
    isRequesting: false,
    item: {}
  }
  const rootContainer = state.rootContainer || {
    isRequesting: false,
    item: {}
  }
  const currentUpload = state.currentUpload || {
    isRequesting: false,
    item: {
      containers: [],
      bytestreams: []
    }
  }

  return {
    selectedProvider,
    providers,
    currentAuthToken,
    currentSession,
    rootContainer,
    currentUpload
  }
}

export default connect(mapStateToProps)(App);
