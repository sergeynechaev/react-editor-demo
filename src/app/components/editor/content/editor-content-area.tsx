import * as React from 'react';
import { EditorContent } from 'app/models';
import { EditorActions } from 'app/actions/editor.actions';
import { EditorContentItem } from './editor-content-item';

export namespace EditorContentArea {
  export interface Props {
    items: EditorContent[];
    remove: typeof EditorActions.removeContent;
    move: typeof EditorActions.moveContent;
    resize: typeof EditorActions.resizeContent;
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
    const { items, remove, move, resize } = this.props;
    return (
      <div ref={this.refCallback}>
        {items.map((item) => (
          <EditorContentItem
            key={item.id}
            item={item}
            remove={remove}
            move={move}
            resize={resize}
          />
        ))}
      </div>
    );
  }
}
