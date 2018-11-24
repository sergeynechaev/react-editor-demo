import * as React from 'react';
import * as style from './style.css';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';
import { ContentActions } from 'app/actions/content.actions';
import { connect } from 'react-redux';
import { omit } from 'app/utils';
import { bindActionCreators, Dispatch } from 'redux';
import { EditorContentArea } from 'app/components/editor/content';
import { ContentModel } from 'app/models';
import { ChangeEvent, RefObject } from 'react';
import { InputText } from 'app/components/common/input-text/input-text.component';

export namespace Editor {
  export interface Props extends RouteComponentProps<void> {
    content: RootState.ContentState;
    actions: ContentActions;
  }

  export interface State {
    isSaved: boolean;
    mode: 'image' | 'video' | ''
  }
}

export enum ThumbnailTypes {
  default = 'default',      // 120x90
  high = 'hqdefault',       // 480x360
  medium = 'mqdefault',     // 320x180
  standard = 'sddefault',   // 640x480
  maximum = 'maxresdefault' // 1280x720
}

@connect(
  (state: RootState, ownProps): Pick<Editor.Props, 'content'> => {
    return { content: state.content };
  },
  (dispatch: Dispatch): Pick<Editor.Props, 'actions'> => ({
    actions: bindActionCreators(omit(ContentActions, 'Type'), dispatch)
  })
)
export class Editor extends React.Component<Editor.Props, Editor.State> {

  uploadImageRef: RefObject<HTMLInputElement>;
  editorSize: ClientRect | DOMRect;

  constructor(props: Editor.Props, context?: any) {
    super(props, context);

    this.uploadImageRef = React.createRef();

    this.state = {
      isSaved: true,
      mode: ''
    };
  }

  // todo: move to utils
  getVideoId(url: string) {
    const urlParts = url.split('?');
    return urlParts.length > 1 && urlParts[1].includes('v=')
      ? urlParts[1].split('v=')[1]
      : url.split('/').pop();
  };

  addContent = (type: ContentModel.Type, previewUrl: string, data: string, width: number, height: number) => {
    this.props.actions.add({ type, data, previewUrl, width, height, options: {editorSize: this.editorSize} });
    this.setState({ isSaved: false });

    // scroll to the bottom, but yep, it's a pretty simple trick
    // todo: get the last added element by ref and scroll into view of it?
    const scrollTo = this.props.content.reduce((val, item) => val + item.height, 0);
    window.scrollTo(0, scrollTo + height)
  };

  addImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }

    const file = event.target.files[0];
    const addContent = this.addContent;
    const uploadImageRef = this.uploadImageRef;

    const img = new Image();
    img.onload = () => {  // we use an Image object here to get original width and height
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {   // read base64 string
        const data = reader.result.toString();
        addContent(ContentModel.Type.IMAGE, data, data, img.width, img.height);
        URL.revokeObjectURL(img.src); // cleanup memory
        uploadImageRef.current.value = '';  // cleanup file input
      };
    };

    img.src = URL.createObjectURL(file);
  };

  addVideo = (url: string) => {
    if (!url) {
      this.onCancelClick();
      return;
    }

    const videoId = this.getVideoId(url);
    const imageURL = `https://img.youtube.com/vi/${videoId}/${ThumbnailTypes.high}.jpg`;
    const addContent = this.addContent;

    const img = new Image();
    img.onload = () => {
      addContent(ContentModel.Type.VIDEO, imageURL, url, img.width, img.height);
    };
    img.src = imageURL;
  };

  getEditorSize = (size: ClientRect | DOMRect) => {
    this.editorSize = size
  };

  onItemMove: typeof ContentActions.move = (params) => {
    this.setState({ isSaved: false });
    return this.props.actions.move(params);
  };

  onItemResize: typeof ContentActions.resize = (params) => {
    this.setState({ isSaved: false });
    return this.props.actions.resize(params);
  };

  save = () => {
    // todo: save all content data on a server
    this.setState({ isSaved: true })
  };

  onAddImageClick = () => {
    this.uploadImageRef.current.click();
  };

  onAddVideoClick = () => {
    this.setState({mode: 'video'})
  };

  onCancelClick = () => {
    this.setState({mode: ''})
  };

  render() {
    const { content } = this.props;

    return (
      <div className={style.container}>
        <EditorContentArea
          items={content}
          move={this.onItemMove}
          resize={this.onItemResize}
          getSize={this.getEditorSize}
        />
        <div className={style.controls}>
          <div className={style.status}>
            <span>Status: {this.state.isSaved ? 'Saved' : 'You have unsaved changes'}</span>
            {!this.state.isSaved && <button onClick={this.save}>Save</button>}
          </div>

          {this.state.mode !== 'video' &&
          <div>
            <span>Add: </span>
            <button onClick={this.onAddImageClick}>Image</button>
            <button onClick={this.onAddVideoClick}>Video</button>
            <input ref={this.uploadImageRef} type="file" onChange={this.addImage}/>
          </div>
          }

          {this.state.mode === 'video' &&
          <div>
            <InputText onSave={this.addVideo}/>
            <button onClick={this.onCancelClick}>Cancel</button>
          </div>
          }

        </div>
      </div>
    );
  }
}
