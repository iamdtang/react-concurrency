import React from 'react';

export function task(generator) {
  return function() {
    let component = this;
    let iterator = generator.call(component);
    recursivelyCallNextOnIterator();

    // this function keeps calling next() if a promise is yielded
    function recursivelyCallNextOnIterator(data) {
      let yielded = iterator.next.apply(iterator, arguments); // { value: Any, done: Boolean }

      if (isPromise(yielded.value)) {
        yielded.value.then((data) => {
          recursivelyCallNextOnIterator(data);
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
  }
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
