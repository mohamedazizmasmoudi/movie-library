import { combineReducers } from 'redux';
import configReducer from './configReducer';
import moviesReducer from './moviesReducer';
import errorsReducer from './errorsReducer';

export default combineReducers({
  geral: configReducer,
  movies: moviesReducer,
  errors: errorsReducer,
});
