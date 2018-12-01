import { EditorContent, EditorOptions, EditorUi } from 'app/models';

export interface EditorModel {
  content: EditorContent[];
  options: EditorOptions;
  ui: EditorUi;
}

export namespace EditorModel {
  export type Content = EditorContent;
  export type Options = EditorOptions;
  export type Ui = EditorUi;
  export type ResponseData = {
    success: boolean;
    error: string;
  }
}
