import * as React from 'react';
import { ContentModel } from 'app/models';
import { ContentActions } from 'app/actions/content.actions';
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd';

export namespace EditorContentItem {
  export interface Props {
    item: ContentModel;
    move: typeof ContentActions.move;
    resize: typeof ContentActions.resize;
  }

  export type ResizableDirection = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';
}

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#f0f0f0'
};

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
        style={style}
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
        <div style={imageContainerStyle}/>
      </Rnd>
    );

  }
}
