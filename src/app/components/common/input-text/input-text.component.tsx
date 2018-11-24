import * as React from 'react';

export namespace InputText {
  export interface Props {
    text?: string;
    placeholder?: string;
    showButton?: boolean;
    buttonText?: string;
    onSave: (text: string) => void;
  }

  export interface State {
    text: string;
  }
}

export class InputText extends React.Component<InputText.Props, InputText.State> {

  static defaultProps: Partial<InputText.Props> = {
    showButton: true,
    buttonText: 'Ok'
  };

  constructor(props: InputText.Props, context?: any) {
    super(props, context);
    this.state = { text: this.props.text || '' };
  }

  submitValue(text: string) {
    this.props.onSave(text.trim());
  }

  handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const text = event.currentTarget.value.trim();
    if (event.which === 13) {
      this.submitValue(text);
      this.setState({ text: '' });
    }
  };

  handleSubmit = () => {
    this.submitValue(this.state.text);
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: event.target.value });
  };

  render() {
    return (
      <div>
        <input
          type="text"
          autoFocus
          placeholder={this.props.placeholder}
          value={this.state.text}
          onChange={this.handleChange}
          onKeyDown={this.handleEnter}
        />
        {this.props.showButton && <button onClick={this.handleSubmit}>{this.props.buttonText}</button>}
      </div>
    );
  }
}
