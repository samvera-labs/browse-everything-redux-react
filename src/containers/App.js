import React from 'react'
import PropTypes from 'prop-types'
import UploadForm from './UploadForm'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import { Trans } from 'react-i18next'

class App extends React.Component {
  render() {
    const { classes } = this.props

    return (
      <div className="App">
        <Container maxWidth="lg">
          {this.props.title && (
            <Typography variant="h3" component="h1" gutterBottom>
              <Trans>{this.props.title}</Trans>
            </Typography>
          )}
        </Container>
        <Container maxWidth="lg">
          <Paper className={classes.root}>
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
          </Paper>
        </Container>
      </div>
    )
  }
}

App.propTypes = {
  style: PropTypes.object,
  classes: PropTypes.object,
  title: PropTypes.string,
  selectedProvider: PropTypes.object.isRequired, // This should be updated to currentProvider
  providers: PropTypes.object.isRequired,
  currentAuthToken: PropTypes.object.isRequired,
  currentSession: PropTypes.object.isRequired,
  rootContainer: PropTypes.object.isRequired,
  currentUpload: PropTypes.object.isRequired,

  dispatch: PropTypes.func.isRequired,
  onUpload: PropTypes.func
}

function mapStateToProps(state) {
  const { selectedProvider } = state
  const currentAuthToken = state.currentAuthToken || {
    isRequesting: false,
    authToken: null
  }
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
    item: {},
    cache: {}
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

const styles = {
  root: {
    padding: '30px',
    paddingBottom: '2px'
  }
}
const AppWithStyles = withStyles(styles)(App)
export default connect(mapStateToProps)(AppWithStyles)
