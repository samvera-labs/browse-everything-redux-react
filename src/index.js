import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { makeStyles } from '@material-ui/core/styles';
import BrowseEverything from './containers/BrowseEverything';


//import 'babel-polyfill';

// Static or instance methods raise conflicts with Hooks
/*
 * Define the style rules
 */
const definedStyles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
});

//ReactDOM.render(<App styles={makeStyles(definedStyles)} />, document.getElementById('root'));
ReactDOM.render(<BrowseEverything />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
