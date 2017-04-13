(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'react'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react);
    global.index = mod.exports;
  }
})(this, function (exports, _react) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ConcurrentComponent = undefined;
  exports.task = task;
  exports.timeout = timeout;

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function task(generator) {
    var taskInstance = {
      isIdle: true,
      isRunning: false
    };
    taskInstance.perform = function () {
      taskInstance.isIdle = false;
      taskInstance.isRunning = true;
      var component = this;
      var iterator = generator.call(component);
      recursivelyCallNextOnIterator();

      // this function keeps calling next() if a promise is yielded
      function recursivelyCallNextOnIterator(data) {
        var yielded = iterator.next.apply(iterator, arguments);
        // yielded = { value: Any, done: Boolean }

        if (yielded.done) {
          taskInstance.isIdle = true;
          taskInstance.isRunning = false;
          // call setState with the same state to trigger another render
          // so that you can use task properties like isIdle directly
          // in your render function
          component.setState(component.state);
          return;
        }

        if (isPromise(yielded.value)) {
          yielded.value.then(function (data) {
            if (component._isMounted) {
              recursivelyCallNextOnIterator(data);
            }
          }, function (e) {
            if (component._isMounted) {
              iterator.throw(e);
            }
          });
        }
      }
    };
    return taskInstance;
  }

  function timeout(milliseconds) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, milliseconds);
    });
  }

  var ConcurrentComponent = exports.ConcurrentComponent = function (_React$Component) {
    _inherits(ConcurrentComponent, _React$Component);

    function ConcurrentComponent() {
      _classCallCheck(this, ConcurrentComponent);

      return _possibleConstructorReturn(this, (ConcurrentComponent.__proto__ || Object.getPrototypeOf(ConcurrentComponent)).apply(this, arguments));
    }

    _createClass(ConcurrentComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this._isMounted = true;
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._isMounted = false;
      }
    }]);

    return ConcurrentComponent;
  }(_react2.default.Component);

  function isPromise(value) {
    return value && typeof value.then === 'function';
  }
});