Example 2 - Derived State Flags
===

This example shows how to use derived state flags on tasks. See a live example here: [http://react-concurrency.surge.sh/](http://react-concurrency.surge.sh/)

This example is similar to the previous one, but inside the button the derived state flags `isIdle` and `isRunning` are used.

```jsx
import React from 'react';
import { ConcurrentComponent, task, timeout } from 'react-concurrency';

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
      this.setState({ label: this.props.success });
      yield timeout(2000);
      this.setState({ label: this.props.default });
    } catch (e) {
      this.setState({ label: this.props.error });
    }
  })

  render() {
    let isIdle = this.handleClick.isIdle ? 'idle' : 'running';
    let isRunning = this.handleClick.isRunning ? 'running' : 'idle';

    return (
      <button onClick={this.handleClick.perform.bind(this)}>
        {this.state.label} - {isIdle} - {isRunning}
      </button>
    );
  }
}

export default AsyncButton;
```