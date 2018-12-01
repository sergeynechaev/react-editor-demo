import { handleActions } from 'redux-actions';
import { RootState } from 'app/reducers';
import { EditorModel } from 'app/models';
import { EditorActions } from 'app/actions';
import { initialState } from './editor-initial-state';

export const editorUiReducer = handleActions<RootState.EditorState, EditorModel.Ui>(
  {

    [EditorActions.Type.SAVE]: (state, action) => {
      // async saving handled in saveEpic
      const { ui } = state;
      return {
        ...state,
        ui: {
          ...ui,
          isSaving: true
        }
      }
    },

    [EditorActions.Type.SAVING_COMPLETE]: (state, action) => {
      const { ui } = state;
      return {
        ...state,
        ui: {
          ...ui,
          isDirty: false,
          isSaving: false
        }
      }
    },

    [EditorActions.Type.SET_DIRTY]: (state) => {
      const { ui } = state;
      return {
        ...state,
        ui: {
          ...ui,
          isDirty: true
        }
      }
    },

    [EditorActions.Type.SET_READY]: (state) => {
      const { ui } = state;
      return {
        ...state,
        ui: {
          ...ui,
          isReady: true
        }
      }
    }

  },

  initialState
);
