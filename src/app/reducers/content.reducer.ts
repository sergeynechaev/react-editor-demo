import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { ContentModel } from 'app/models';
import { ContentActions } from 'app/actions/content.actions';

const initialState: RootState.ContentState = [];

export const contentReducer = handleActions<RootState.ContentState, ContentModel>(
  {
    [ContentActions.Type.ADD]: (state, action) => {
      if (action.payload && action.payload.type && action.payload.previewUrl) {
        // calculate position to show new element below existent
        const coordY = state.reduce((max, item) => Math.max((item.position.y + item.height), max), 0);

        // calculate the middle of the editor area
        const coordX = action.payload.options && action.payload.options.editorSize && action.payload.options.editorSize.width
          ? Math.round((action.payload.options.editorSize.width / 2) - (action.payload.width / 2))
          : 100;

        return [
          {
            id: state.reduce((max, item) => Math.max(item.id || 1, max), 0) + 1,
            type: action.payload.type,
            previewUrl: action.payload.previewUrl,
            data: action.payload.data,
            width: action.payload.width,
            height: action.payload.height,
            position: {
              x: coordX,
              y: coordY + 5 // add extra 5px space below the latest element
            }
          },
          ...state
        ];
      }
      return state;
    },

    [ContentActions.Type.MOVE]: (state, action) => {
      if (!action.payload || !action.payload.id || !action.payload.position) {
        return state;
      }
      return state.map(item => item.id !== action.payload.id ? item : {
          ...item,
          position: {
            x: action.payload.position.x || 0,
            y: action.payload.position.y || 0
          }
        }
      );
    },

    [ContentActions.Type.RESIZE]: (state, action) => {
      if (!action.payload || !action.payload.id || !action.payload.width || !action.payload.height || !action.payload.position) {
        return state;
      }
      return state.map(item => item.id !== action.payload.id ? item : {
          ...item,
          width: action.payload.width,
          height: action.payload.height,
          position: {
            x: action.payload.position.x || 0,
            y: action.payload.position.y || 0
          }
        }
      );
    }
  },

  initialState
);
