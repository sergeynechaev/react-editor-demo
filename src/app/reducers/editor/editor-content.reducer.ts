import { handleActions } from 'redux-actions';
import { RootState } from 'app/reducers';
import { EditorModel } from 'app/models';
import { EditorActions } from 'app/actions';
import { initialState } from './editor-initial-state';

export const editorContentReducer = handleActions<RootState.EditorState, EditorModel.Content>(
  {

    [EditorActions.Type.ADD_CONTENT]: (state, action) => {
      const { type, previewUrl, data, width, height } = action.payload;
      const { content, options, ui } = state;
      if (type && previewUrl) {
        // calculate position to show new element below existent
        const coordY = content.reduce((max, item) => Math.max((item.position.y + item.height), max), 0);
        // calculate the middle of the editor area
        const coordX = options.editorSize && options.editorSize.width
          ? Math.round((options.editorSize.width / 2) - (width / 2))
          : 100;
        return {
          ...state,
          content: [
            {
              id: content.reduce((max, item) => Math.max(item.id || 1, max), 0) + 1,
              type,
              previewUrl,
              data,
              width,
              height,
              position: {
                x: coordX,
                y: coordY + 5 // add extra 5px space below the latest element
              }
            },
            ...content
          ],
          ui: {
            ...ui,
            isDirty: true
          }
        };
      }
      return state;
    },

    [EditorActions.Type.REMOVE_CONTENT]: (state, action) => {
      const { id } = action.payload;
      const { content, ui } = state;
      return !id
        ? state
        : {
          ...state,
          content: content.filter(item => item.id !== id),
          ui: {
            ...ui,
            isDirty: true
          }
        }
    },

    [EditorActions.Type.MOVE_CONTENT]: (state, action) => {
      const { id, position } = action.payload;
      const { content, ui } = state;
      if (!id || !position) {
        return state;
      }
      return {
        ...state,
        content: content.map(item => item.id !== id ? item : {
          ...item,
          position: {
            x: position.x || 0,
            y: position.y || 0
          }
        }),
        ui: {
          ...ui,
          isDirty: true
        }
      };
    },

    [EditorActions.Type.RESIZE_CONTENT]: (state, action) => {
      const { id, width, height, position } = action.payload;
      const { content, ui } = state;
      if (!id || !width || !height || !position) {
        return state;
      }
      return {
        ...state,
        content: content.map(item => item.id !== id ? item : {
          ...item,
          width,
          height,
          position: {
            x: position.x || 0,
            y: position.y || 0
          }
        }),
        ui: {
          ...ui,
          isDirty: true
        }
      };
    },

  },

  initialState
);
