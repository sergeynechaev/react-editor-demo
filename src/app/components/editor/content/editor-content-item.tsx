import * as React from 'react';
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd';

import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';

import * as style from './style.css';
import { EditorContent } from 'app/models';
import { EditorActions } from 'app/actions/editor.actions';

export namespace EditorContentItem {
  export interface Props {
    item: EditorContent;
    remove: typeof EditorActions.removeContent;
    move: typeof EditorActions.moveContent;
    resize: typeof EditorActions.resizeContent;
  }

  export type ResizableDirection = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';
}

export class EditorContentItem extends React.Component<EditorContentItem.Props> {
  constructor(props: EditorContentItem.Props, context?: any) {
    super(props, context);
  }

  onResize = (
    e: MouseEvent | TouchEvent,
    direction: EditorContentItem.ResizableDirection,
    elementRef: HTMLDivElement,
    delta: ResizableDelta,
    position: Position
  ) => {
    const { item } = this.props;
    const convertPxToNumber = (v: string) => Number(v.replace(/px/i, ''));

    this.props.resize({
      id: item.id,
      width: convertPxToNumber(elementRef.style.width),   // we keep dimensions as a number
      height: convertPxToNumber(elementRef.style.height),
      position: { ...position }
    });
  };

  onDragStop = (e: Event, d: DraggableData) => {
    const { item } = this.props;
    this.props.move({
      id: item.id,
      position: { x: d.x, y: d.y }
    });
  };

  onRemove = () => {
    const { item } = this.props;
    this.props.remove({
      id: item.id,
    });
  };

  render() {
    const { item } = this.props;

    const imageContainerStyle = {
      backgroundImage: `url(${item.previewUrl})`,
      backgroundSize: 'contain',
      width: item.width,
      height: item.height
    };

    return (
      <Rnd
        key={item.id}
        className={style.rndContainer}
        size={{ width: item.width, height: item.height }}
        position={{ x: item.position.x, y: item.position.y }}
        lockAspectRatio={true}
        enableResizing={{
          top: false,
          right: false,
          bottom: false,
          left: false,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true
        }}
        onDragStop={this.onDragStop}
        onResize={this.onResize}
      >
        <div style={imageContainerStyle}>
          <span className={[style.point, style.pointNE].join(' ')}/>
          <span className={[style.point, style.pointNW].join(' ')}/>
          <span className={[style.point, style.pointSE].join(' ')}/>
          <span className={[style.point, style.pointSW].join(' ')}/>
          <span className={style.remove} onClick={this.onRemove}>
            <Tooltip title="Remove permanently" enterDelay={300} leaveDelay={0}>
              <CloseIcon/>
            </Tooltip>
          </span>
        </div>
      </Rnd>
    );

  }
}
