import React from 'react';

export function task(generator) {
  let taskInstance = {
    isIdle: true,
    isRunning: false
  };
  taskInstance.perform = function() {
    taskInstance.isIdle = false;
    taskInstance.isRunning = true;
    let component = this;
    let iterator = generator.call(component);
    recursivelyCallNextOnIterator();

    // this function keeps calling next() if a promise is yielded
    function recursivelyCallNextOnIterator(data) {
      let yielded = iterator.next.apply(iterator, arguments);
      // yielded = { value: Any, done: Boolean }

      if (yielded.done) {
        taskInstance.isIdle = true;
        taskInstance.isRunning = false;
        // call setState with the same state to trigger another render
        // so that you can use task properties like isIdle directly
        // in render function
        component.setState(component.state);
        return;
      }

      if (isPromise(yielded.value)) {
        yielded.value.then((data) => {
          if (component._isMounted) {
            recursivelyCallNextOnIterator(data);
          }
        }, (e) => {
          if (component._isMounted) {
            iterator.throw(e);
          }
        });
      }
    }
  };
  return taskInstance;
}

export function timeout(milliseconds) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve();
    }, milliseconds);
  });
}

export class ConcurrentComponent extends React.Component {
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}

function isPromise(value) {
  return value && typeof value.then === 'function';
}
