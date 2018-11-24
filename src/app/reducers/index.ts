import { combineReducers } from 'redux';
import { RootState } from './state';
import { contentReducer } from './content.reducer';

export { RootState };

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
  content: contentReducer as any
});
