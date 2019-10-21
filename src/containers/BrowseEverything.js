import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import App from './App'

const store = configureStore()

/**
 * Example of handler for updating the DOM once an upload has completed
 */
const handleUpload = function(event) {
  console.log(event)
}

export default class BrowseEverything extends Component {
  render() {
    return (
      <Provider store={store}>
        <App onUpload={handleUpload} />
      </Provider>
    )
  }
}
