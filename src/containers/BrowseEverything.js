import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import App from './App'
import './BrowseEverything.css'

const store = configureStore()

class BrowseEverything extends Component {
  render() {
    return (
      <Provider store={store}>
        <App
          onUpload={this.props.handleUpload}
          title={this.props.title}
        />
      </Provider>
    )
  }
}

BrowseEverything.propTypes = {
  handleUpload: PropTypes.func,
  title: PropTypes.string
}

export default BrowseEverything
