import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});
import App from '../containers/App';

/**
 * This needs to be implemented to handle working with the Redux Store
 */
it('renders the component on the DOM', () => {
  // To be implemented
});
