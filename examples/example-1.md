This example shows how tasks get automatically canceled when the component they live on is destroyed. See a live example here: [http://react-concurrency.surge.sh/](http://react-concurrency.surge.sh/)

Imagine you have an `AsyncButton` component that takes an asynchronous function that returns a promise, in this case `save`. As the promise transitions through its different states, the button's label changes.

```jsx
<AsyncButton
  default="Save"
  pending="Saving ..."
  success="Saved"
  error="Try Again"
  onClick={this.save.bind(this)} />
```

To use this library, first create a component that extends from `ConcurrentComponent`. Next, define a property using the `task` function, which takes in a generator function. See `handleClick` below. `handleClick` is a task object with a `perform` method, which gets invoked when the button is clicked.

The `yield` keyword is used with promises. When you yield a promise, your task function will pause execution. If the promise resolves, the task will continue executing from that point. If the promise rejects, the task will throw an error at that point. If the component has been unmounted, the task will get cancelled.

```js
import React from 'react';
import { task, timeout, ConcurrentComponent } from 'react-concurrency';

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
    return (
      <button onClick={this.handleClick.perform.bind(this)}>
        {this.state.label}
      </button>
    );
  }
}

export default AsyncButton;
```