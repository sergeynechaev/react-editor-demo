import { EditorModel } from 'app/models';

export interface RootState {
  editor: RootState.EditorState;
  router?: any;
}

export namespace RootState {
  export type EditorState = EditorModel;
}
