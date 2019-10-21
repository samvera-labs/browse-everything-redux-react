import React from 'react';
import ReactDOM from 'react-dom';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});
import UploadForm from '../containers/UploadForm';

it('renders the component on the DOM', () => {
  const resource = shallow(<UploadForm />);
  expect(resource).toBeTruthy;
});
