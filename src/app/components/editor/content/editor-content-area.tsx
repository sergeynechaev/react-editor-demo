import * as React from 'react';
import { ContentModel } from 'app/models';
import { ContentActions } from 'app/actions/content.actions';
import { EditorContentItem } from './editor-content-item';

export namespace EditorContentArea {
  export interface Props {
    items: ContentModel[];
    move: typeof ContentActions.move;
    resize: typeof ContentActions.resize;
    getSize: (size: ClientRect | DOMRect) => void
  }
}

export class EditorContentArea extends React.Component<EditorContentArea.Props> {
  refCallback = (element: any) => {
    if (element) {
      this.props.getSize(element.getBoundingClientRect());
    }
  };

  render() {
    const { items, move, resize } = this.props;
    return (
      <div ref={this.refCallback}>
        {items.map((item) => (
          <EditorContentItem
            key={item.id}
            item={item}
            move={move}
            resize={resize}
          />
        ))}
      </div>
    );
  }
}
