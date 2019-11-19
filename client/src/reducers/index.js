import userReducer from './userReducer';
import authReducer from './authReducer';
import appReducer from './appReducer';
import profileReducer from './profileReducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
  user: userReducer,
  auth: authReducer,
  app: appReducer,
  profile: profileReducer
});

export default allReducers;
