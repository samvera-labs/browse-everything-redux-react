import React from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import App from './App'
import './BrowseEverything.css'

const store = configureStore()

/**
 * Example of handler for updating the DOM once an upload has completed
 */
const handleUpload = function(event) {
  console.log(event)
}

const BrowseEverything = () => {
  return (
    <Provider store={store}>
      <App onUpload={handleUpload} />
    </Provider>
  )
}

export default BrowseEverything
