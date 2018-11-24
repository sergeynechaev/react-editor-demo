export interface ContentModel {
  id: number;
  type: ContentModel.Type;
  previewUrl: string; // base64 for image, video thumbnail for video
  data: string;       // base64 for image, video url for video
  width: number;
  height: number;
  position: ContentModel.Coordinates;
  options?: {
    editorSize?:  ClientRect | DOMRect
  }
}

export namespace ContentModel {
  export enum Type {
    IMAGE = 'image',
    VIDEO = 'video'
  }

  export interface Coordinates {
    x: number;
    y: number;
  }
}
