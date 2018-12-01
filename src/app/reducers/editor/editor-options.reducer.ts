import { handleActions } from 'redux-actions';
import { RootState } from 'app/reducers';
import { EditorModel } from 'app/models';
import { EditorActions } from 'app/actions';
import { initialState } from './editor-initial-state';

export const editorOptionsReducer = handleActions<RootState.EditorState, EditorModel.Options>(
  {

    [EditorActions.Type.SET_EDITOR_SIZE]: (state, action) => {
      const { editorSize } = action.payload;
      const { options } = state;
      if (!editorSize) {
        return state;
      }
      return {
        ...state,
        options: {
          ...options,
          editorSize,
        }
      }
    },

  },

  initialState
);
