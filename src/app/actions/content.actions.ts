import { createAction } from 'redux-actions';
import { ContentModel } from 'app/models';

export namespace ContentActions {
  export enum Type {
    ADD = 'ADD',
    MOVE = 'MOVE',
    RESIZE = 'RESIZE'
  }

  export const add = createAction<PartialPick<ContentModel, 'type' | 'previewUrl' | 'data' | 'width' | 'height' | 'options'>>(Type.ADD);
  export const move = createAction<PartialPick<ContentModel, 'position'>>(Type.MOVE);
  export const resize = createAction<PartialPick<ContentModel, 'width' | 'height' | 'position'>>(Type.RESIZE);
}

export type ContentActions = Omit<typeof ContentActions, 'Type'>;
