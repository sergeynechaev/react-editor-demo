export interface EditorContent {
  id: number;
  type: EditorContent.Type;
  previewUrl: string; // base64 for image, video thumbnail for video
  data: string;       // base64 for image, video url for video
  width: number;
  height: number;
  position: EditorContent.Coordinates;
}

export namespace EditorContent {
  export enum Type {
    IMAGE = 'image',
    VIDEO = 'video'
  }

  export interface Coordinates {
    x: number;
    y: number;
  }
}
