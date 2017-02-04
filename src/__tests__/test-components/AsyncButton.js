import React from 'react';
import { ConcurrentComponent, task } from './../../index';

class AsyncButton extends ConcurrentComponent {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.default
    };
  }

  handleClick = task(function*() {
    try {
      this.setState({ label: this.props.pending });
      yield this.props.onClick();
      this.setState({ label: this.props.default });
    } catch (e) {
      this.setState({ label: this.props.error });
    }
  })

  render() {
    let isIdle = this.handleClick.isIdle ? 'idle' : 'processing';
    let isRunning = this.handleClick.isRunning ? 'processing' : 'idle';

    return (
      <button onClick={this.handleClick.perform.bind(this)}>
        {this.state.label} - {isIdle} - {isRunning}
      </button>
    );
  }
}

export default AsyncButton;
