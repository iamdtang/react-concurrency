[![Build Status](https://travis-ci.org/skaterdav85/react-concurrency.svg?branch=master)](https://travis-ci.org/skaterdav85/react-concurrency)

React Concurrency
=================

An implementation of [ember-concurrency](http://ember-concurrency.com/) for React components. This is still a work in progress.

## Currently Implemented Features

* Tasks get automatically canceled when the component they live on is destroyed
* Derived state with `isRunning` and `isIdle` flags

## Installation

```
npm install react-concurrency
```

## Why?

Have you ever seen the error?

> Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the YourComponent component.

There are a few ways to deal with this in React. Read about them [here](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html).

In Ember, there is an addon called [ember-concurrency](http://ember-concurrency.com/) to help with this problem. This library attempts to do the same but for React components while keeping a similar API.

`react-concurrency` also provides derived state. Have you ever written flags on your state like `isRunning`? `react-concurrency` gives you the concepts of tasks which expose derived state like `isRunning` and `isIdle`.

## Example 1

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

## Example 2

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

## About This Repo

This repo was created with [react-npm-boilerplate](https://github.com/juliancwirko/react-npm-boilerplate).

1. Clone this repo
2. Inside cloned repo run `npm install`
3. If you want to run tests: `npm test` or `npm run testonly` or `npm run test-watch`. You need to write tests in `__tests__` folder. You need at least Node 4 on your machine to run tests.
4. If you want to run linting: `npm test` or `npm run lint`. Fix bugs: `npm run lint-fix`. You can adjust your `.eslintrc` config file.
5. If you want to run transpilation to ES5 in `dist` folder: `npm run prepublish` (standard npm hook).

## License

MIT
