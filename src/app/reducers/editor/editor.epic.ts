import { combineEpics } from 'redux-observable';
import { editorSave } from './editor-save.epic';

export const editorEpic = combineEpics(
  editorSave
);
