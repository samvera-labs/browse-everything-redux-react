import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import BrowseEverything from './containers/BrowseEverything';

/**
 * This the more proper way of working with the MaterialUI approach for CSS and
 *  theming.  Unfortunately, using this at the the component-level requires
 *  restructuring in order to more properly use `makeStyles` as a hook for
 *  functional components.
 *
 * ReactDOM.render(<App styles={makeStyles(definedStyles)} />, document.getElementById('root'));
 */
ReactDOM.render(<BrowseEverything />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
