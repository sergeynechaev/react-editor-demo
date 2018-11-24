import { ContentModel } from 'app/models';

export interface RootState {
  content: RootState.ContentState;
  router?: any;
}

export namespace RootState {
  export type ContentState = ContentModel[];
}
