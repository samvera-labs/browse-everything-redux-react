import { combineReducers } from 'redux';
import { selectedProvider, providers } from './reducers/providers';
import { authToken } from './reducers/authorization';
import { session } from './reducers/sessions';
import { rootContainer } from './reducers/containers';

const rootReducer = combineReducers({
  selectedProvider,
  providers,
  currentSession: session,
  rootContainer,
  currentAuthToken: authToken
});

export default rootReducer;
