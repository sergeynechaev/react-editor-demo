import { RootState } from '../state';
import reduceReducer from 'reduce-reducers';

import { initialState } from './editor-initial-state';
import { editorContentReducer } from './editor-content.reducer';
import { editorUiReducer } from './editor-ui.reducer';
import { editorOptionsReducer } from './editor-options.reducer';

// reduce reducers to share initial state
export const editorReducer = reduceReducer<RootState.EditorState>(
  editorContentReducer,
  editorUiReducer,
  editorOptionsReducer,
  initialState
);
