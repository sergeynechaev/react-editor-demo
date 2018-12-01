import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { RootState } from './state';
import { editorReducer } from './editor/editor.reducer';
import { editorEpic } from './editor/editor.epic';

export { RootState };

export const rootEpic = combineEpics(
  editorEpic
);

// NOTE: current type definition of Reducer in 'redux-actions' module
// doesn't go well with redux@4
export const rootReducer = combineReducers<RootState>({
  editor: editorReducer
});
