import { RootState } from 'app/reducers';

export const initialState: RootState.EditorState = {
  content: [],
  options: {},
  ui: {
    isReady: false,
    isDirty: false,
    isSaving: false
  }
};
