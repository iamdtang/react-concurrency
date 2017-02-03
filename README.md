React Concurrency
=================

Have you ever seen the error?

> Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the YourComponent component.

This can happen when a callback from an asynchronous operation gets executed but the component has been destroyed. For example, a user might do something that triggers and AJAX call and then transitions to another route.

There are a few ways to deal with this. Read about them [here](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html).

In Ember, there is an addon called [ember-concurrency](http://ember-concurrency.com/) to help with this problem. This package attempts to do the same but for React components while keeping a similar API. This is still a WIP.

## Example

Imagine you have an `AsyncButton` component:

```jsx
<AsyncButton
  default="Save"
  pending="Saving ..."
  success="Saved"
  error="Try Again"
  onClick={this.save} />
```

The `onClick` prop is a function that does something asynchronous. The button's text shows something different based on the state of the promise. To use this library, first create a component that extends from `ConcurrentComponent`. Next, define a method using the `task` function, which takes in a generator function. See the `handleClick` method, which gets invoked when the button is clicked.

The `yield` keyword is used with promises. When you yield a promise, your task function will pause execution. If the promise resolves, the task will continue executing from that point. If the promise rejects, the task will throw an error at that point. If the component has been destroyed, the task will stop executing.

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
      <button onClick={this.handleClick.bind(this)}>
        {this.state.label}
      </button>
    );
  }
}

export default AsyncButton;
```

## About This Repo

This repo was created with [react-npm-boilerplate](https://github.com/juliancwirko/react-npm-boilerplate).

1. Clone this repo
2. Inside cloned repo run `npm install`
3. If you want to run tests: `npm test` or `npm run testonly` or `npm run test-watch`. You need to write tests in `__tests__` folder. You need at least Node 4 on your machine to run tests.
4. If you want to run linting: `npm test` or `npm run lint`. Fix bugs: `npm run lint-fix`. You can adjust your `.eslintrc` config file.
5. If you want to run transpilation to ES5 in `dist` folder: `npm run prepublish` (standard npm hook).

## License

MIT
