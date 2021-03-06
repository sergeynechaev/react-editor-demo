import { createAction } from 'redux-actions';
import { EditorModel } from 'app/models';

export namespace EditorActions {
  export enum Type {
    // reducers
    ADD_CONTENT = 'ADD_CONTENT',
    REMOVE_CONTENT = 'REMOVE_CONTENT',
    MOVE_CONTENT = 'MOVE_CONTENT',
    RESIZE_CONTENT = 'RESIZE_CONTENT',
    SET_EDITOR_SIZE = 'SET_EDITOR_SIZE',
    SAVING_COMPLETE = 'SAVING_COMPLETE',
    SET_DIRTY = 'SET_DIRTY',
    SET_READY = 'SET_READY',

    // observable epics
    SAVE = 'SAVE'
  }

  export const addContent = createAction<PartialPick<EditorModel.Content, 'type' | 'previewUrl' | 'data' | 'width' | 'height'>>(Type.ADD_CONTENT);
  export const removeContent = createAction<PartialPick<EditorModel.Content, 'id'>>(Type.REMOVE_CONTENT);
  export const moveContent = createAction<PartialPick<EditorModel.Content, 'position'>>(Type.MOVE_CONTENT);
  export const resizeContent = createAction<PartialPick<EditorModel.Content, 'width' | 'height' | 'position'>>(Type.RESIZE_CONTENT);
  export const setEditorSize = createAction<PartialPick<EditorModel.Options, 'editorSize'>>(Type.SET_EDITOR_SIZE);
  export const setDirty = createAction(Type.SET_DIRTY);
  export const setReady = createAction(Type.SET_READY);

  // observable epics
  export const save = createAction<EditorModel.Content[]>(Type.SAVE);
}

export type EditorActions = Omit<typeof EditorActions, 'Type'>;
