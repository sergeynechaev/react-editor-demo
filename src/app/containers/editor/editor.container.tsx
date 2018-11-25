import * as React from 'react';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Badge from '@material-ui/core/Badge';

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


export namespace Editor {
  export interface Props extends RouteComponentProps<void> {
    content: RootState.ContentState;
    actions: ContentActions;
  }

  export interface State {
    isSaved: boolean;
    menuEl: HTMLElement;
    videoDialogOpen: boolean;
    videoUrl: string;
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
      menuEl: null,
      videoDialogOpen: false,
      videoUrl: ''
    };
  }
  
  // Helpers

  // todo: move to utils
  getVideoId(url: string) {
    const urlParts = url.split('?');
    return urlParts.length > 1 && urlParts[1].includes('v=')
      ? urlParts[1].split('v=')[1]
      : url.split('/').pop();
  };

  getEditorSize = (size: ClientRect | DOMRect) => {
    this.editorSize = size;
  };

  // Content handlers

  addContent = (type: ContentModel.Type, previewUrl: string, data: string, width: number, height: number) => {
    this.props.actions.add({ type, data, previewUrl, width, height, options: { editorSize: this.editorSize } });
    this.setState({ isSaved: false });

    // scroll to the bottom, but yep, it's a pretty simple trick
    // todo: get the last added element by ref and scroll into view of it?
    if (this.props.content[0]) window.scrollTo(0, this.props.content[0].position.y);
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

  onItemMove: typeof ContentActions.move = (params) => {
    this.setState({ isSaved: false });
    return this.props.actions.move(params);
  };

  onItemResize: typeof ContentActions.resize = (params) => {
    this.setState({ isSaved: false });
    return this.props.actions.resize(params);
  };

  onItemRemove: typeof ContentActions.remove = (params) => {
    this.setState({ isSaved: this.props.content.length === 1 });
    return this.props.actions.remove(params);
  };

  save = () => {
    // todo: save all content data on a server
    this.setState({ isSaved: true });
  };

  // Interface handlers

  onAddImageClick = () => {
    this.uploadImageRef.current.click();
    this.setState({ menuEl: null });
  };

  onAddVideoClick = () => {
    this.setState({
      videoDialogOpen: true,
      menuEl: null
    });
  };

  onMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ menuEl: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ menuEl: null });
  };

  onVideoDialogClose = () => {
    this.setState({ videoDialogOpen: false });
  };

  onVideoDialogAdd = () => {
    if (this.state.videoUrl) {
      this.addVideo(this.state.videoUrl);
    }
    this.setState({
      videoUrl: '',
      videoDialogOpen: false
    });
  };

  onVideoUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ videoUrl: event.target.value });
  };

  // Render

  render() {
    const { content } = this.props;
    const { menuEl, videoDialogOpen, videoUrl, isSaved } = this.state;

    return (
      <div>
        <div className={style.container}>
          <EditorContentArea
            items={content}
            remove={this.onItemRemove}
            move={this.onItemMove}
            resize={this.onItemResize}
            getSize={this.getEditorSize}
          />

          <div className={style.controls}>
            <Tooltip title="Add a new image or video" enterDelay={500} leaveDelay={0}>
              <Button
                variant="fab"
                color="primary"
                aria-label="Add"
                aria-haspopup="true"
                onClick={this.onMenuOpen}
              >
                <AddIcon/>
              </Button>
            </Tooltip>
            <Menu
              id="add-menu"
              anchorEl={menuEl}
              open={Boolean(menuEl)}
              onClose={this.onMenuClose}
            >
              <MenuItem onClick={this.onAddImageClick}>Add a new image</MenuItem>
              <MenuItem onClick={this.onAddVideoClick}>Add YouTube video</MenuItem>
            </Menu>
          </div>

          {/* todo: move dialog to external component */}
          <Dialog open={videoDialogOpen} onClose={this.onVideoDialogClose}>
            <DialogTitle id="form-dialog-title">Add YouTube video</DialogTitle>
            <DialogContent>
              <DialogContentText>Please copy and paste a link to YouTube video.</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="video"
                label="Enter link"
                value={videoUrl}
                onChange={this.onVideoUrlChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onVideoDialogClose} color="primary">Cancel</Button>
              <Button onClick={this.onVideoDialogAdd} color="primary">Add</Button>
            </DialogActions>
          </Dialog>

          <div className={style.status}>
            <Badge color="secondary" badgeContent={'!'} invisible={isSaved}>
              <div className={[style.statusText, isSaved ? style.saved : ''].join(' ')}>
                {isSaved ? 'All data saved' : 'You have unsaved changes'}
              </div>
            </Badge>
            {!isSaved &&
            <div>
              <Button onClick={this.save}>Save</Button>
            </div>
            }

          </div>

          <input className={style.hidden} ref={this.uploadImageRef} type="file" onChange={this.addImage}/>
        </div>

        {!content.length &&
        <div className={style.empty}>
          <h1>It seems that there is nothing here yet. Feel free to add some images or video content using the Big Blue button.</h1>
        </div>
        }

      </div>
    );
  }
}
