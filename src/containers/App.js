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
          <Typography variant="h1" component="h2" gutterBottom>
            Browse Everything
          </Typography>
        </Container>
        <Container maxWidth="lg">
          <UploadForm styles={this.props.style} dispatch={this.props.dispatch} selectedProvider={this.props.selectedProvider}/>
        </Container>
      </div>
    );
  }
}

App.propTypes = {
  style: PropTypes.object,
  selectedProvider: PropTypes.string.isRequired,
  providers: PropTypes.array.isRequired,
  isRequesting: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { selectedProvider, providers } = state
  const { isRequesting, lastUpdated, items } = providers || {
    isFetching: true,
    items: []
  }

  return {
    selectedProvider,
    providers: items,
    isRequesting,
    lastUpdated
  }
}

export default connect(mapStateToProps)(App);
