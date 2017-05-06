require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":1}],"basket-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e6894t629BPYaeEppyfbgj4', 'basket-animal');
// scripts\components\baskets\basket-animal.js

'use strict';

/**
 * Enum состояний корзины.
 * @typedef {Object} StateBasket
 * @property {number} sleep корзина просто открыта.
 * @property {number} active чувствует что животное где-то рядом.
 * @property {number} work работает с попавшимся животным.
 */

/**
 * Типы состояний корзины.
 * @type {StateBasket}
 */
var StateBasket = {
    sleep: 0,
    active: 1,
    work: 2
};

/**
 * Осуществляет работу с корзиной,
 * Анимации, частицы и прочее.
 * @class basket-animal
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _leftPointBottom: null, //левая нижняя точка области поглащения животных
        _rightPointTop: null, //правая верхняяточка области поглащения животных
        _centrePointBasket: null, //центральная точка области поглащения
        _stateBasket: null, //состояние корзины

        anticipation: 150, //расстояние для принятия состояний взволнованности
        opacityOn: 255, //прозрачность к которой стремится при включении
        opacityOff: 10, //прозрачность к которой стемится после выключения
        time: 1 },

    /**
     * Инициализация непосредственно сразу после загрузки компонента.
     * @method start
     */
    start: function start() {
        this._previousStatus = this._stateBasket = StateBasket.active;
    },


    /**
     * Корзина запустилась. Запускает корзину(включает)
     * @method on
     */
    on: function on() {
        //this.node.active = true;
        this.jobWithOpacity(this.opacityOn, this.time);
    },


    /**
     * Выключение корзины.Выключает корзину.
     * @method off
     */
    off: function off() {
        this.jobWithOpacity(this.opacityOff, this.time);
    },


    /**
     * Реакция корзины на приближающееся животное.
     * @method onStatusActiveBasket
     */
    onStatusActiveBasket: function onStatusActiveBasket() {
        var myEvent = new cc.Event.EventCustom('basketActive', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Состояние сна включилось.
     * @method onStatusSleepBasket
     */
    onStatusSleepBasket: function onStatusSleepBasket() {
        var myEvent = new cc.Event.EventCustom('basketSleep', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Состояние ловли включилось.
     * @method onStatusWorkBasket
     */
    onStatusWorkBasket: function onStatusWorkBasket() {
        var myEvent = new cc.Event.EventCustom('basketWork', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Событие- животное поймано.
     * @method onGoodWorkBasket
     */
    onGoodWorkBasket: function onGoodWorkBasket() {
        cc.log('Еа, животное поймано (basket-animal)');
        this._stateBasket = StateBasket.work;
        this._updateStatusBasket();
    },


    /**
     * Событие- животное не поймано.
     * @method onBadWorkBasket
     */
    onBadWorkBasket: function onBadWorkBasket() {
        cc.log('Ну вот опять ничего непоймал (basket-animal)');
        this._stateBasket = StateBasket.sleep;
        this._updateStatusBasket();
    },


    /**
     * Работает с прозрачностью этой корзины. Постепенно приближается к прозрачности
     * корзины равной заданному значению за заданое время.
     * @method jobWithOpacity
     * @param {number} opacity нужно достич этой прозрачности
     * @param {number} time за столько секунд
     */
    jobWithOpacity: function jobWithOpacity(opacity, time) {
        var _this = this;

        var intevalIncrements = time / Math.abs(this.node.opacity - opacity);
        this.unschedule(this.callBackOpacity);
        this.callBackOpacity = function () {
            if (_this.node.opacity === opacity) {
                //if (this.node.opacity < 125) this.node.active = false;
                _this.unschedule(_this.callBackOpacity);
            }
            opacity > _this.node.opacity ? _this.node.opacity += 1 : _this.node.opacity -= 2;
        };
        this.schedule(this.callBackOpacity, intevalIncrements);
    },


    /**
     * Проверяет будет ли жить животное или оно выброшено в корзину.
     * @method isAnimalLife
     * @param {cc.Vec2} point точка нахождения животного
     * @returns {boolean} true - если животное будет жить
     */
    isAnimalLife: function isAnimalLife(point) {
        this._leftPointBottom = {
            x: this.node.x - this.node.width,
            y: this.node.y - this.node.height
        };
        this._rightPointTop = {
            x: this.node.x + this.node.width,
            y: this.node.y + this.node.height
        };
        var X = point.x > this._leftPointBottom.x && point.x < this._rightPointTop.x;
        var Y = point.y > this._leftPointBottom.y & point.y < this._rightPointTop.y;
        return !(X && Y);
    },


    /**
     * Сообщает корзине позицию животного для принятия решения по выбору действия. Корзина меняет свое состояние
     * в зависимости от расстояния.
     * @method setPositionAnimal
     * @param {cc.Vec2} point точка текущего местонахождения животного
     */
    setPositionAnimal: function setPositionAnimal(point) {
        this._leftPointBottom = {
            x: this.node.x - this.node.width,
            y: this.node.y - this.node.height
        };
        this._rightPointTop = {
            x: this.node.x + this.node.width,
            y: this.node.y + this.node.height
        };
        this._centrePointBasket = {
            x: (this._leftPointBottom.x + this._rightPointTop.x) / 2,
            y: (this._rightPointTop.y + this._leftPointBottom.y) / 2
        };

        var x = (point.x - this._centrePointBasket.x) * (point.x - this._centrePointBasket.x);
        var y = (point.y - this._centrePointBasket.y) * (point.y - this._centrePointBasket.y);
        var sqrtPoint = Math.sqrt(x + y);

        var isV = sqrtPoint < this.anticipation;
        isV ? this._stateBasket = StateBasket.active : this._stateBasket = StateBasket.sleep;
        this._updateStatusBasket();
    },


    /**
     * Обновляет статус корзины и вызывает соответствующее действие.
     * @method _updateStatusBasket
     * @private
     */
    _updateStatusBasket: function _updateStatusBasket() {
        if (this._previousStatus != this._stateBasket) {
            this._previousStatus = this._stateBasket;
            switch (this._stateBasket) {
                case StateBasket.active:
                    {
                        this.onStatusActiveBasket();
                        break;
                    }
                case StateBasket.sleep:
                    {
                        this.onStatusSleepBasket();
                        break;
                    }
                case StateBasket.work:
                    {
                        this.onStatusWorkBasket();
                        break;
                    }
            }
        }
    }
});

cc._RFpop();
},{}],"box-characteristics-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, '15897F2u1dN+o4g/2HlJ44R', 'box-characteristics-animal');
// scripts\components\boxes\box-characteristics-animal.js

'use strict';

var _box = require('./box-samples/box');

/**
 * Бокс характеристик не предназначен для управление пользователем
 * @type {Function}
 */
var BoxCharacteristicsAnimal = cc.Class({
    extends: _box.Box,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     * @private
     */
    _settings: function _settings() {
        this._type = _box.TypeBox.left;
        this.timeBring = 0.1;
        var canvas = cc.director.getWinSizeInPixels();
        var sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentRight;
        this.node.height = sizeBoxY;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x + this.node.width, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },
    onLoad: function onLoad() {},


    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen: function publishEventOpen() {
        var myEvent = new cc.Event.EventCustom('openBoxFromCharacteristicsAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Публикует событие закрыие бокса в контроллере
     */
    publishEventClose: function publishEventClose() {
        var myEvent = new cc.Event.EventCustom('closeBoxFromCharacteristicsAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update: function update(dt) {
        this._opacityNode(this.node.x - this._startPos.x);
    }
});

cc._RFpop();
},{"./box-samples/box":"box"}],"box-create-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0af51YPeQNMwqIJdmNrCGDz', 'box-create-animal');
// scripts\components\boxes\box-create-animal.js

'use strict';

var _box = require('./box-samples/box');

/**
 * Бокс списка животных
 * @type {Function}
 */
var BoxCreateAnimal = cc.Class({
    extends: _box.Box,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     * @private
     */
    _settings: function _settings() {
        this._type = _box.TypeBox.bottom;
        this.timeBring = 0.2;
        var bar = this.content;
        var canvas = cc.director.getWinSizeInPixels();
        var sizeBoxX = this._getSizeBox(canvas.width);
        this.node.x = sizeBoxX / 2 + this.indentLeft;
        bar.width = sizeBoxX;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x, this.node.y + bar.height - 10);
        this._amountPix = Math.abs(this._endPos.y - this._startPos.y);
    },


    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen: function publishEventOpen() {
        var myEvent = new cc.Event.EventCustom('openBoxFromAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Публикует событие закрытие бокса в контроллере
     */
    publishEventClose: function publishEventClose() {
        var myEvent = new cc.Event.EventCustom('closeBoxFromAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update: function update(dt) {
        this._opacityNode(this.node.y - this._startPos.y);
    }
});

cc._RFpop();
},{"./box-samples/box":"box"}],"box-menu-play":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c02746/iXtP2akY3x0U58pq', 'box-menu-play');
// scripts\components\boxes\box-menu-play.js

'use strict';

var _box = require('./box-samples/box');

/**
 * Бокс характеристик не предназначен для управление пользователем
 * @type {Function}
 */
var BoxMenuPlay = cc.Class({
    extends: _box.Box,

    /**
     * Устанавливает начальные позиции и производит вычисление длинны
     * @private
     */
    _settings: function _settings() {
        this._type = _box.TypeBox.left;
        this.timeBring = 0.6;
        var canvas = cc.director.getWinSizeInPixels();
        var sizeBoxY = this._getSizeBox(canvas.height);
        this.node.y = sizeBoxY / 2 + this.indentRight;
        this.node.height = sizeBoxY;
        this._startPos = cc.v2(this.node.x, this.node.y);
        this._endPos = cc.v2(this.node.x + this.node.width - 75, this.node.y);
        this._amountPix = Math.abs(this._endPos.x - this._startPos.x);
    },
    onLoad: function onLoad() {},


    /**
     * Открывает/закрывает бокс
     * @param event
     */
    onClick: function onClick(event) {
        this._endSwipe();
    },


    /**
     * Публикует событие открытие бокса в контроллере
     */
    publishEventOpen: function publishEventOpen() {
        var myEvent = new cc.Event.EventCustom('openBoxMenuPlay', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Публикует событие закрыие бокса в контроллере
     */
    publishEventClose: function publishEventClose() {
        var myEvent = new cc.Event.EventCustom('closeBoxMenuPlay', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обновляет прозрачность боксов
     * @param {any} dt
     */
    update: function update(dt) {
        this._opacityNode(this.node.x - this._startPos.x);
    }
}); /**
     * Created by FIRCorp on 29.03.2017.
     */

cc._RFpop();
},{"./box-samples/box":"box"}],"box":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e5e5bFR+1NAfb/Dp9tTtI5H', 'box');
// scripts\components\boxes\box-samples\box.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Enum состояний бокса
 * @typedef {Object} Movement
 * @property {number} toClose бокс закрыт.
 * @property {number} toOpen бокс открыт.
 */

/**
 * Состояние бокса (открыт/закрыт)
 * @type {Movement}
 */
var Movement = {
    toClose: 0,
    toOpen: 1
};

/**
 * Enum состояний работы бокса
 * @typedef {Object} TypeBox
 * @property {number} bottom работа как нижний бокс.
 * @property {number} top работа как верхний бокс.
 * @property {number} right работа как правый бокс.
 * @property {number} left работа как левы бокс.
 */

/**
 * Тип бокса
 * @type {{bottom: number, top: number, right: number, left: number}}
 */
var TypeBox = {
    bottom: 0,
    top: 1,
    right: 2,
    left: 3
};
/**
 * Ядро боксов
 * @type {cc.Class}
 */
var Box = cc.Class({
    extends: cc.Component,

    properties: {
        _startPos: null, //Стартовая позиция бокса
        _endPos: null, //конечная позиция бокса
        _type: null, //состояние типа бокса в котором он работает
        _direction: 1, //0- закрыться 1- открыться
        _flagBlock: false, //флаг блокировки
        _flagZaprosBlock: false, //флаг о необходиомсти блокировки
        _amountPix: null, //путь для бокса
        _actionMoveBox: null, //actions движения бокса

        timeBring: 0.01, //Время довода в секундах
        content: cc.Node, //контент над которым необходимо произвести работу
        opacityBox: 30, //Прозрачность бокса 
        indentLeft: 50, //Отступ слева (в px)
        indentRight: 50 },

    /**
     * Осуществляет первоначальную настройку
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._getPermissionMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },
    start: function start() {
        this._init();
    },


    /**
     * Инициализация переменных
     * @private
     */
    _init: function _init() {
        //Дальнейшее действие бокса
        this._direction = Movement.toOpen;
        this._settings();
    },


    /**
     * Действия на страт тача
     * @param {cc.Event} event
     */
    onTouchStart: function onTouchStart(event) {},


    /**
     * Действия на движение тача
     * @param {cc.Event} event событие
     */
    onTouchMove: function onTouchMove(event) {
        var delta = event.touch.getDelta();
        if (!this._flagBlock) {
            this._setMovement(delta)._moveBox(delta);
        }
    },


    /**
     * Действие на завершение тача
     * @param {cc.Event} event событие
     */
    onTouchEnd: function onTouchEnd(event) {
        if (!this._flagBlock) {
            this._endSwipe();
        }
    },


    /**
     * Включает блокировку бокса
     */
    onBlock: function onBlock() {
        this._flagZaprosBlock = true;
        this._flagBlock = true;
    },


    /**
     * Выключает блокировку бокса
     */
    offBlock: function offBlock() {
        this._flagZaprosBlock = false;
        this._flagBlock = false;
    },


    /**
     * Открывает бокс
     */
    openBox: function openBox() {
        this._direction = Movement.toOpen;
        this._endSwipe();
    },


    /**
     * Закрывает бокс
     */
    closeBox: function closeBox() {
        this._direction = Movement.toClose;
        this._endSwipe();
    },


    /**
     * Определяет ожидаемое состояние по направлению движения бокса
     * @param delta приращение
     * @returns {Box} этот класс
     * @private
     */
    _setMovement: function _setMovement(delta) {
        if (this._type === TypeBox.top) {
            this._direction = delta.y > 0 ? Movement.toClose : Movement.toOpen;
        } else if (this._type === TypeBox.bottom) {
            this._direction = delta.y < 0 ? Movement.toClose : Movement.toOpen;
        } else if (this._type === TypeBox.left) {
            this._direction = delta.x < 0 ? Movement.toClose : Movement.toOpen;
        } else {
            this._direction = delta.x > 0 ? Movement.toClose : Movement.toOpen;
        }
        return this;
    },


    /**
     * Проверка на выход бокса за пределы интервала в резудьтате выполнения данного приращения. true-когда он не выходит
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @return {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isCheckOutOfRange: function _isCheckOutOfRange(delta, start, end, current) {
        return start < end ? this._isOutOfRangeLeftBottom(delta, start, end, current) : this._isOutOfRangeRightTop(delta, start, end, current);
    },


    /**
     * Проверка на выход левого и нижнего бокса за пределы интервала в резудьтате выполнения данного приращения
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @returns {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isOutOfRangeLeftBottom: function _isOutOfRangeLeftBottom(delta, start, end, current) {
        return delta + current > start && delta + current < end;
    },


    /**
     * Проверка на выход верхнего и правого бокса за пределы интервала в резудьтате выполнения данного приращения
     * @param delta приращение координаты
     * @param start стартовая координа(координата закрытого бокса)
     * @param end конечная координата(координата открытого бокса)
     * @param current текущаа координата
     * @returns {boolean} true- если бокс не выходит за пределы
     * @private
     */
    _isOutOfRangeRightTop: function _isOutOfRangeRightTop(delta, start, end, current) {
        return delta + current < start && delta + current > end;
    },


    /**
     * Движение бокса
     * @param {cc.Vec2} delta приращение
     * @returns {Box}
     * @private
     */
    _moveBox: function _moveBox(delta) {
        if (this._type === TypeBox.top || this._type === TypeBox.bottom) {
            this._isCheckOutOfRange(delta.y, this._startPos.y, this._endPos.y, this.node.y) ? this.node.y += delta.y : this._endSwipe();
        } else {
            this._isCheckOutOfRange(delta.x, this._startPos.x, this._endPos.x, this.node.x) ? this.node.x += delta.x : this._endSwipe();
        }
        return this;
    },


    /**
     * Выполняет авто доводку
     * @private
     */
    _endSwipe: function _endSwipe() {
        this._flagBlock = true;
        this._direction === Movement.toClose ? this._bring(this._startPos) : this._bring(this._endPos);
        this._refocus();
    },


    /**
     * Выполняет авто довод  бокса до финальной точки назначения
     * @param pos точка назначения
     * @private
     */
    _bring: function _bring(pos) {
        this._actionMoveBox = cc.moveTo(this.timeBring, pos);
        this.node.runAction(cc.sequence(this._actionMoveBox, cc.callFunc(this._finishBring, this)));
    },


    /**
     * Функция сигнализирующая о завершении доводки бокса
     * @private
     */
    _finishBring: function _finishBring() {
        if (!this._flagZaprosBlock) this._flagBlock = false;
    },


    /**
     * Проверяет делает ли он это событие а не кто-то другой по ветке нодов до него
     * @param event событие
     * @private
     */
    _getPermissionMove: function _getPermissionMove(event) {
        if (event.target._name === this.node.name) {
            this.onTouchMove(event);
        }
    },


    /**
     * Возвращает размер бокса относительно пространства на стороне и условий отступов
     * @param {number} space  размер боксадо приращения
     * @returns {number} размер бокса
     * @private
     */
    _getSizeBox: function _getSizeBox(space) {
        return space - this.indentLeft - this.indentRight;
    },


    /**
     * Меняет действие которое необходимо сделать дальше боксу(закрыться или открыться).Публикует событие
     * @private
     */
    _refocus: function _refocus() {
        if (this._direction === Movement.toClose) {
            this._direction = Movement.toOpen;
            this.publishEventClose();
        } else {
            this._direction = Movement.toClose;
            this.publishEventOpen();
        }
    },


    /**
     * Работа с прозрачностью бокса. Изменяет прозрачность бокса на основе положения его относительно начальных и конечных координат
     * @private
     */
    _opacityNode: function _opacityNode(currentPosBox) {
        var opasity = this.opacityBox + (255 - this.opacityBox) * currentPosBox / this._amountPix;
        if (opasity > 255) {
            opasity = 255;
        } else if (opasity < this.opacityBox) {
            opasity = this.opacityBox;
        }
        this.node.opacity = opasity;
    }
});

exports.Box = Box;
exports.Movement = Movement;
exports.TypeBox = TypeBox;

cc._RFpop();
},{}],"build-ts":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7d032b6Q3JBIIr0FKeItlat', 'build-ts');
// scripts\build\build-ts.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Promise = require('es6-promise').Promise;
var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = undefined && undefined.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var APICore = function () {
    function APICore() {}
    APICore.instance = function () {
        if (!this.inst) {
            this.inst = new APICore();
        }
        return this.inst;
    };
    APICore.prototype.createAnimal = function (putToModel, id) {
        var factory = Animals.AnimalBuilder.instance();
        var animal;
        animal = factory.create(lion);
        animal.id = id;
        return animal;
    };
    return APICore;
}();
var Animals;
(function (Animals) {
    var AnimalBuilder = function () {
        function AnimalBuilder() {}
        AnimalBuilder.instance = function () {
            if (!this.inst) {
                this.inst = new AnimalBuilder();
            }
            return this.inst;
        };
        AnimalBuilder.prototype.createSystems = function (systems) {
            var _this = this;
            var factory = Animals.Systems.SystemFactory.instance();
            var mas = [];
            systems.forEach(function (item) {
                mas = [];
                item.scalesType.forEach(function (sc) {
                    mas[sc.type] = _this.masScales[sc.type];
                });
                _this.masSystems[item.type] = factory.create(item.type, mas);
            });
            return this;
        };
        AnimalBuilder.prototype.createScales = function (scales) {
            var _this = this;
            var factory = Animals.Scales.ScaleFactory.instance();
            scales.forEach(function (item) {
                var typeScale = item.typeScale,
                    type = item.type,
                    params = item.params;
                params.type = type;
                _this.masScales[type] = factory.create(typeScale, params);
            });
            return this;
        };
        AnimalBuilder.prototype.createCommunicator = function (communocation) {
            var communicatorBuild = new Animals.Communications.CommunicatorBuilder(this.masScales);
            communocation.forEach(function (item) {
                communicatorBuild.add(item);
            });
            return communicatorBuild.build();
        };
        AnimalBuilder.prototype.createStates = function (states) {
            var _this = this;
            var factory = Animals.StateMachine.StateFactory.instance();
            var paramState = [];
            var state = states.state,
                links = states.links;
            state.forEach(function (item) {
                paramState[item.type] = factory.create(item.type, item.name, _this._animal, item.isEnd);
            });
            links.forEach(function (item) {
                var massStates = [];
                item.link.forEach(function (state) {
                    massStates.push(new Animals.StateMachine.Route(paramState[state.type], function (model, probability) {
                        if (state.probability > probability) {
                            return true;
                        }
                        return false;
                    }));
                });
                paramState[item.type].setRouteEngine(new Animals.StateMachine.ProbabilityRouteEngine(massStates));
            });
            return new Animals.StateMachine.StateMachine(paramState[Animals.StateMachine.TypesState.startLife]);
        };
        AnimalBuilder.prototype.create = function (model) {
            var name = model.name,
                systems = model.systems,
                scales = model.scales,
                communication = model.communication,
                states = model.states;
            this.masScales = [];
            this.masSystems = [];
            var communicator = this.createScales(scales).createSystems(systems).createCommunicator(communication);
            this._animal = new Animals.Animal(this.masSystems);
            this._animal.name = name;
            this._animal.stateMachine = this.createStates(states);
            this._animal.communicator = communicator;
            return this._animal;
        };
        return AnimalBuilder;
    }();
    Animals.AnimalBuilder = AnimalBuilder;
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Animal = function () {
        function Animal(params) {
            this.muscular = params[Animals.Systems.SystemTypes.muscular];
            this.circulatory = params[Animals.Systems.SystemTypes.circulatory];
            this.navigation = params[Animals.Systems.SystemTypes.navigation];
            this.muscular._linkToAnimal = this;
            this.circulatory._linkToAnimal = this;
            this.navigation._linkToAnimal = this;
        }
        Object.defineProperty(Animal.prototype, "muscular", {
            get: function get() {
                return this._muscular;
            },
            set: function set(param) {
                if (param) {
                    this._muscular = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "circulatory", {
            get: function get() {
                return this._circulatory;
            },
            set: function set(param) {
                if (param) {
                    this._circulatory = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "navigation", {
            get: function get() {
                return this._navigation;
            },
            set: function set(param) {
                if (param) {
                    this._navigation = param;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "communicator", {
            get: function get() {
                return this._communicator;
            },
            set: function set(param) {
                this._communicator = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "stateMachine", {
            get: function get() {
                return this._stateMachine;
            },
            set: function set(param) {
                this._stateMachine = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "id", {
            get: function get() {
                return this._id;
            },
            set: function set(param) {
                this._id = param;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animal.prototype, "name", {
            get: function get() {
                return this._name;
            },
            set: function set(param) {
                this._name = param;
            },
            enumerable: true,
            configurable: true
        });
        Animal.prototype.moveToPoint = function (point) {};
        Animal.prototype.runLife = function () {
            console.log(this);
            this._stateMachine.run();
        };
        Animal.prototype.getCharacteristics = function () {
            var params = [{
                name: 'Скорость',
                value: 89,
                unit: 'м/с'
            }, {
                name: 'Возраст',
                value: 12,
                unit: 'лет'
            }, {
                name: 'Вес',
                value: 12,
                unit: 'кг'
            }, {
                name: 'Выносливость',
                value: 12,
                unit: 'ед.'
            }, {
                name: 'Система кровообращения',
                value: 89,
                unit: '%'
            }, {
                name: 'Система памяти',
                value: 59,
                unit: '%'
            }, {
                name: 'Система дыхания',
                value: 89,
                unit: '%'
            }];
            return {
                name: this._name,
                currentState: 'Бегу',
                param: params
            };
        };
        return Animal;
    }();
    Animals.Animal = Animal;
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var Communicator = function () {
            function Communicator() {
                this._netLinks = [];
                this._sensitivity = 0.1;
            }
            Object.defineProperty(Communicator.prototype, "sensitivity", {
                get: function get() {
                    return this._sensitivity;
                },
                set: function set(param) {
                    this._sensitivity = param ? param : 0.1;
                },
                enumerable: true,
                configurable: true
            });
            Communicator.prototype.setting = function (params) {
                this.sensitivity = params.sensitivity || 0.1;
            };
            Communicator.prototype.addLink = function (event, link) {
                if (this._netLinks[event]) {
                    this._netLinks[event].push(link);
                } else {
                    this._netLinks[event] = [link];
                }
            };
            Communicator.prototype.publish = function (pack, param) {
                var _this = this;
                var links = this._netLinks[pack.type];
                if (links) {
                    links.forEach(function (link) {
                        var delta = link.fun.calculate(param);
                        if (Math.abs(delta) > _this._sensitivity) {
                            delta = pack.behavior === link.behavior ? delta : -delta;
                            link.scale.change(delta);
                        }
                    });
                }
            };
            return Communicator;
        }();
        Communications.Communicator = Communicator;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var BehaviorScaleTypes;
        (function (BehaviorScaleTypes) {
            BehaviorScaleTypes[BehaviorScaleTypes["increase"] = 1] = "increase";
            BehaviorScaleTypes[BehaviorScaleTypes["decrease"] = 2] = "decrease";
        })(BehaviorScaleTypes = Communications.BehaviorScaleTypes || (Communications.BehaviorScaleTypes = {}));
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Communications;
    (function (Communications) {
        var CommunicatorBuilder = function () {
            function CommunicatorBuilder(scales) {
                this._scales = scales;
                this._communicator = new Communications.Communicator();
                this._factoryFunction = Animals.Functions.FunctionFactory.instance();
            }
            CommunicatorBuilder.prototype.add = function (param) {
                var _this = this;
                param.link.forEach(function (communication) {
                    var type = communication.type,
                        behavior = communication.behavior,
                        functions = communication.functions,
                        params = communication.params;
                    var scale = _this._scales[type];
                    var fun = _this._createFunction(functions, params);
                    _this._communicator.addLink(param.type, { scale: scale, behavior: behavior, fun: fun });
                    scale.communicator = _this._communicator;
                });
                return this;
            };
            CommunicatorBuilder.prototype.build = function () {
                return this._communicator;
            };
            CommunicatorBuilder.prototype._createFunction = function (type, params) {
                return this._factoryFunction.create(type, params);
            };
            return CommunicatorBuilder;
        }();
        Communications.CommunicatorBuilder = CommunicatorBuilder;
    })(Communications = Animals.Communications || (Animals.Communications = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var FunctionFactory = function () {
            function FunctionFactory() {
                this._factories = [];
                this._factories[Functions.FunctionTypes.line] = Functions.LineFunction;
                this._factories[Functions.FunctionTypes.quadratic] = Functions.QuadraticFunction;
            }
            FunctionFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new FunctionFactory();
                }
                return this._instance;
            };
            FunctionFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            FunctionFactory.prototype.create = function (functionType, params) {
                return new this._factories[functionType](params);
            };
            return FunctionFactory;
        }();
        Functions.FunctionFactory = FunctionFactory;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var FunctionTypes;
        (function (FunctionTypes) {
            FunctionTypes[FunctionTypes["line"] = 1] = "line";
            FunctionTypes[FunctionTypes["quadratic"] = 2] = "quadratic";
        })(FunctionTypes = Functions.FunctionTypes || (Functions.FunctionTypes = {}));
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var LineFunction = function () {
            function LineFunction(params) {
                this._coefficient = params[0] || 0;
                this._free = params[1] || 0;
            }
            Object.defineProperty(LineFunction.prototype, "coefficient", {
                get: function get() {
                    return this._coefficient;
                },
                set: function set(param) {
                    this._coefficient = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineFunction.prototype, "free", {
                get: function get() {
                    return this._free;
                },
                set: function set(param) {
                    this._free = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            LineFunction.prototype.calculate = function (param) {
                return this._coefficient * param + this._free;
            };
            return LineFunction;
        }();
        Functions.LineFunction = LineFunction;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Functions;
    (function (Functions) {
        var QuadraticFunction = function () {
            function QuadraticFunction(params) {
                this._coefficientA = params[0] || 0;
                this._coefficientB = params[1] || 0;
                this._free = params[2] || 0;
            }
            Object.defineProperty(QuadraticFunction.prototype, "coefficientA", {
                get: function get() {
                    return this._coefficientA;
                },
                set: function set(param) {
                    this._coefficientA = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadraticFunction.prototype, "coefficientB", {
                get: function get() {
                    return this._coefficientB;
                },
                set: function set(param) {
                    this._coefficientB = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuadraticFunction.prototype, "free", {
                get: function get() {
                    return this._free;
                },
                set: function set(param) {
                    this._free = param ? param : 0;
                },
                enumerable: true,
                configurable: true
            });
            QuadraticFunction.prototype.calculate = function (param) {
                return this._coefficientA * Math.pow(param, 2) + this._coefficientB * param + this._free;
            };
            return QuadraticFunction;
        }();
        Functions.QuadraticFunction = QuadraticFunction;
    })(Functions = Animals.Functions || (Animals.Functions = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ScaleTypes;
        (function (ScaleTypes) {
            ScaleTypes[ScaleTypes["system"] = 0] = "system";
            ScaleTypes[ScaleTypes["argument"] = 1] = "argument";
        })(ScaleTypes = Scales.ScaleTypes || (Scales.ScaleTypes = {}));
        var ParameterScaleTypes;
        (function (ParameterScaleTypes) {
            ParameterScaleTypes[ParameterScaleTypes["state"] = 1] = "state";
            ParameterScaleTypes[ParameterScaleTypes["speed"] = 2] = "speed";
            ParameterScaleTypes[ParameterScaleTypes["weight"] = 3] = "weight";
            ParameterScaleTypes[ParameterScaleTypes["heartbeat"] = 4] = "heartbeat";
            ParameterScaleTypes[ParameterScaleTypes["pressure"] = 5] = "pressure";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberWater"] = 6] = "amountPointRememberWater";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberGrass"] = 7] = "amountPointRememberGrass";
            ParameterScaleTypes[ParameterScaleTypes["amountPointRememberMeat"] = 8] = "amountPointRememberMeat";
            ParameterScaleTypes[ParameterScaleTypes["speedSavvy"] = 9] = "speedSavvy";
            ParameterScaleTypes[ParameterScaleTypes["radiusVision"] = 10] = "radiusVision";
            ParameterScaleTypes[ParameterScaleTypes["radiusHearing"] = 11] = "radiusHearing";
            ParameterScaleTypes[ParameterScaleTypes["radiusSmell"] = 12] = "radiusSmell";
            ParameterScaleTypes[ParameterScaleTypes["radiusTouch"] = 13] = "radiusTouch";
        })(ParameterScaleTypes = Scales.ParameterScaleTypes || (Scales.ParameterScaleTypes = {}));
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var AScale = function () {
            function AScale() {}
            Object.defineProperty(AScale.prototype, "name", {
                get: function get() {
                    return this._name;
                },
                set: function set(param) {
                    this._name = param;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "min", {
                get: function get() {
                    return this._min;
                },
                set: function set(param) {
                    this._min = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "max", {
                get: function get() {
                    return this._max;
                },
                set: function set(param) {
                    this._max = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "current", {
                get: function get() {
                    return this._current;
                },
                set: function set(param) {
                    this._current = param;
                    this.getPercentageInScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "percent", {
                get: function get() {
                    return this._percent;
                },
                set: function set(param) {
                    this._percent = param;
                    this.getCurrentValueOnScale();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AScale.prototype, "type", {
                get: function get() {
                    return this._type;
                },
                set: function set(param) {
                    this._type = param;
                },
                enumerable: true,
                configurable: true
            });
            AScale.prototype.getPercentageInScale = function () {
                this._percent = (this._current - this._min) * 100 / (this._max - this._min);
            };
            AScale.prototype.getCurrentValueOnScale = function () {
                this._current = (this._max - this._min) / 100 * this._percent + this._min;
            };
            return AScale;
        }();
        Scales.AScale = AScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ScaleFactory = function () {
            function ScaleFactory() {
                this._factories = [];
                this._factories[Scales.ScaleTypes.system] = Animals.Scales.SystemScale;
                this._factories[Scales.ScaleTypes.argument] = Animals.Scales.ArgumentScale;
            }
            ScaleFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new ScaleFactory();
                }
                return this._instance;
            };
            ScaleFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            ScaleFactory.prototype.create = function (functionType, params) {
                return new this._factories[functionType](params);
            };
            return ScaleFactory;
        }();
        Scales.ScaleFactory = ScaleFactory;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var ArgumentScale = function (_super) {
            __extends(ArgumentScale, _super);
            function ArgumentScale(params) {
                var _this = _super.call(this) || this;
                _this._name = params.name || "No name";
                _this._min = params.min || 0;
                _this._max = params.max || 100;
                _this._current = params.current || _this._max;
                _this._responseDelay = params.responseDelay || 1000;
                _this._type = params.type || 0;
                _this.getPercentageInScale();
                return _this;
            }
            Object.defineProperty(ArgumentScale.prototype, "responseDelay", {
                get: function get() {
                    return this._responseDelay;
                },
                set: function set(param) {
                    this._responseDelay = param ? param : 1000;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArgumentScale.prototype, "communicator", {
                get: function get() {
                    return this._communicator;
                },
                set: function set(param) {
                    this._communicator = param;
                },
                enumerable: true,
                configurable: true
            });
            ArgumentScale.prototype.trigger = function (params) {
                var event = params > 0 ? Animals.Communications.BehaviorScaleTypes.increase : Animals.Communications.BehaviorScaleTypes.decrease;
                var pack = {
                    behavior: event,
                    type: this._type
                };
                this._communicator.publish(pack, params);
            };
            ArgumentScale.prototype.change = function (delta) {
                var _this = this;
                var rez = this.percent + delta;
                if (rez <= 100 && rez >= 0) {
                    this.percent = rez;
                    this.getCurrentValueOnScale();
                }
                setTimeout(function () {
                    _this.trigger(delta);
                }, this.responseDelay);
            };
            return ArgumentScale;
        }(Scales.AScale);
        Scales.ArgumentScale = ArgumentScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Scales;
    (function (Scales) {
        var SystemScale = function (_super) {
            __extends(SystemScale, _super);
            function SystemScale(params) {
                var _this = _super.call(this) || this;
                _this._name = params.name || "No name";
                _this._min = params.min || 0;
                _this._max = params.max || 100;
                _this._current = params.current || _this._max;
                _this._type = params.type || 0;
                _this.getPercentageInScale();
                return _this;
            }
            SystemScale.prototype.analysis = function (params) {
                var rez = 0;
                params.forEach(function (param) {
                    rez += param.percent;
                });
                this.percent = rez / params.length;
                this.getCurrentValueOnScale();
            };
            return SystemScale;
        }(Scales.AScale);
        Scales.SystemScale = SystemScale;
    })(Scales = Animals.Scales || (Animals.Scales = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine_1) {
        var StateMachine = function () {
            function StateMachine(state) {
                this._state = state;
            }
            StateMachine.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                return [4, this._state.run()];
                            case 1:
                                _a.sent();
                                if (!this._state.isEndPoint()) {
                                    this._state = this._state.getNextState();
                                    this.run();
                                }
                                return [2];
                        }
                    });
                });
            };
            return StateMachine;
        }();
        StateMachine_1.StateMachine = StateMachine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateFactory = function () {
            function StateFactory() {
                this._factories = [];
                this._factories[StateMachine.TypesState.startLife] = Animals.StateMachine.StateStart;
                this._factories[StateMachine.TypesState.stand] = Animals.StateMachine.StateStand;
                this._factories[StateMachine.TypesState.run] = Animals.StateMachine.StateRun;
                this._factories[StateMachine.TypesState.die] = Animals.StateMachine.StateDie;
            }
            StateFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new StateFactory();
                }
                return this._instance;
            };
            StateFactory.prototype.add = function (type, state) {
                this._factories[type] = state;
            };
            StateFactory.prototype.create = function (typeState, name, animal, isEnd) {
                return new this._factories[typeState](name, animal, isEnd, null);
            };
            return StateFactory;
        }();
        StateMachine.StateFactory = StateFactory;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var TypesState;
        (function (TypesState) {
            TypesState[TypesState["startLife"] = 1] = "startLife";
            TypesState[TypesState["stand"] = 2] = "stand";
            TypesState[TypesState["run"] = 3] = "run";
            TypesState[TypesState["die"] = 4] = "die";
        })(TypesState = StateMachine.TypesState || (StateMachine.TypesState = {}));
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var Route = function () {
            function Route(state, availability) {
                this._state = state;
                this._availability = availability;
            }
            Route.prototype.isAvailable = function (model, probability) {
                if (probability === void 0) {
                    probability = 1.0;
                }
                return this._availability && this._availability(model, probability) ? this._state : null;
            };
            Route.prototype.getState = function () {
                return this._state;
            };
            return Route;
        }();
        StateMachine.Route = Route;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var RouteEngine = function () {
            function RouteEngine(routes, nextEngine) {
                if (routes === void 0) {
                    routes = [];
                }
                if (nextEngine === void 0) {
                    nextEngine = null;
                }
                this._routes = routes;
                this._nextEngine = nextEngine;
            }
            RouteEngine.prototype.add = function (routes) {
                (_a = this._routes).push.apply(_a, routes);
                var _a;
            };
            RouteEngine.prototype.getRoute = function () {
                throw new Error('Not implemented yet...');
            };
            RouteEngine.prototype.setNextEngine = function (engine) {
                this._nextEngine = engine;
            };
            RouteEngine.prototype.setModel = function (animal) {
                this._model = animal;
            };
            RouteEngine.prototype._nextRouteEngine = function () {
                if (this._nextEngine) {
                    return this._nextEngine.getRoute();
                }
                return null;
            };
            return RouteEngine;
        }();
        StateMachine.RouteEngine = RouteEngine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var ProbabilityRouteEngine = function (_super) {
            __extends(ProbabilityRouteEngine, _super);
            function ProbabilityRouteEngine(routes, nextEngine) {
                if (routes === void 0) {
                    routes = [];
                }
                if (nextEngine === void 0) {
                    nextEngine = null;
                }
                return _super.call(this, routes, nextEngine) || this;
            }
            ProbabilityRouteEngine.prototype.getRoute = function () {
                var _this = this;
                var probability = Math.random();
                var routes = this._routes.filter(function (route) {
                    return route.isAvailable(_this._model, probability);
                });
                return routes.length > 0 ? routes[0] : this._nextRouteEngine();
            };
            return ProbabilityRouteEngine;
        }(StateMachine.RouteEngine);
        StateMachine.ProbabilityRouteEngine = ProbabilityRouteEngine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var SimpleRouteEngine = function (_super) {
            __extends(SimpleRouteEngine, _super);
            function SimpleRouteEngine(routes, nextEngine) {
                if (routes === void 0) {
                    routes = [];
                }
                if (nextEngine === void 0) {
                    nextEngine = null;
                }
                return _super.call(this, routes, nextEngine) || this;
            }
            SimpleRouteEngine.prototype.getRoute = function () {
                var _this = this;
                var routes = this._routes.filter(function (route) {
                    return route.isAvailable(_this._model);
                });
                return routes.length > 0 ? routes[0] : this._nextRouteEngine();
            };
            return SimpleRouteEngine;
        }(StateMachine.RouteEngine);
        StateMachine.SimpleRouteEngine = SimpleRouteEngine;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var State = function () {
            function State(name, model, routeEngine, isEndPoint) {
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                this._name = name;
                this._model = model;
                this._routeEngine = routeEngine;
                this._isEndPoint = isEndPoint;
            }
            State.prototype.getName = function () {
                return this._name;
            };
            State.prototype.getNextState = function () {
                if (!this._routeEngine) {
                    return this;
                }
                var route = this._routeEngine.getRoute();
                return route ? route.getState() : this;
            };
            State.prototype.isEndPoint = function () {
                return this._isEndPoint;
            };
            State.prototype.setRouteEngine = function (routeEngine) {
                this._routeEngine = routeEngine;
                this._routeEngine.setModel(this._model);
            };
            State.prototype.add = function (state) {
                throw new Error('Not implemented yet...');
            };
            State.prototype.run = function (model) {
                throw new Error('Not implemented yet...');
            };
            State.prototype.mySleep = function (s) {
                s *= 1000;
                return new Promise(function (resolve) {
                    return setTimeout(resolve, s);
                });
            };
            return State;
        }();
        StateMachine.State = State;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateDie = function (_super) {
            __extends(StateDie, _super);
            function StateDie(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateDie.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log('умер');
                        return [2];
                    });
                });
            };
            return StateDie;
        }(StateMachine.State);
        StateMachine.StateDie = StateDie;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateRun = function (_super) {
            __extends(StateRun, _super);
            function StateRun(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateRun.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('бегу');
                                this._model.muscular.changeSpeed(-0.4);
                                this._model.muscular.changeWeight(-0.5);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateRun;
        }(StateMachine.State);
        StateMachine.StateRun = StateRun;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateStand = function (_super) {
            __extends(StateStand, _super);
            function StateStand(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateStand.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('стою');
                                this._model.muscular.changeSpeed(0.5);
                                this._model.muscular.changeWeight(0.7);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateStand;
        }(StateMachine.State);
        StateMachine.StateStand = StateStand;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var StateStart = function (_super) {
            __extends(StateStart, _super);
            function StateStart(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            StateStart.prototype.run = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log('Начал жить');
                                this._model.muscular.changeSpeed(0.001);
                                this._model.muscular.changeWeight(0.001);
                                return [4, this.mySleep(2)];
                            case 1:
                                _a.sent();
                                return [2];
                        }
                    });
                });
            };
            return StateStart;
        }(StateMachine.State);
        StateMachine.StateStart = StateStart;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var PatternState = function (_super) {
            __extends(PatternState, _super);
            function PatternState(name, model, routeEngine, states) {
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                if (states === void 0) {
                    states = [];
                }
                var _this = _super.call(this, name, model, routeEngine) || this;
                _this._states = states;
                return _this;
            }
            PatternState.prototype.add = function (state) {
                this._states.push(state);
            };
            PatternState.prototype.run = function (model) {
                var state = this._states[0];
                while (state) {
                    this._state = state;
                    state.run(model);
                }
            };
            PatternState.prototype.getName = function () {
                if (!this._state) {
                    throw new Error('Current state not initialized...');
                }
                return this._state.getName();
            };
            return PatternState;
        }(StateMachine.State);
        StateMachine.PatternState = PatternState;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var StateMachine;
    (function (StateMachine) {
        var PrimitiveState = function (_super) {
            __extends(PrimitiveState, _super);
            function PrimitiveState(name, model, isEndPoint, routeEngine) {
                if (isEndPoint === void 0) {
                    isEndPoint = false;
                }
                if (routeEngine === void 0) {
                    routeEngine = null;
                }
                return _super.call(this, name, model, routeEngine, isEndPoint) || this;
            }
            PrimitiveState.prototype.run = function () {
                throw new Error('No implementation status...');
            };
            return PrimitiveState;
        }(StateMachine.State);
        StateMachine.PrimitiveState = PrimitiveState;
    })(StateMachine = Animals.StateMachine || (Animals.StateMachine = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var SystemTypes;
        (function (SystemTypes) {
            SystemTypes[SystemTypes["muscular"] = 1] = "muscular";
            SystemTypes[SystemTypes["circulatory"] = 2] = "circulatory";
            SystemTypes[SystemTypes["memory"] = 3] = "memory";
            SystemTypes[SystemTypes["navigation"] = 4] = "navigation";
        })(SystemTypes = Systems.SystemTypes || (Systems.SystemTypes = {}));
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var SystemFactory = function () {
            function SystemFactory() {
                this._factories = [];
                this._factories[Systems.SystemTypes.muscular] = Animals.Systems.Muscular;
                this._factories[Systems.SystemTypes.circulatory] = Animals.Systems.Circulatory;
                this._factories[Systems.SystemTypes.navigation] = Animals.Systems.Navigation;
            }
            SystemFactory.instance = function () {
                if (!this._instance) {
                    this._instance = new SystemFactory();
                }
                return this._instance;
            };
            SystemFactory.prototype.add = function (type, system) {
                this._factories[type] = system;
            };
            SystemFactory.prototype.create = function (functionType, params) {
                return new this._factories[functionType](params);
            };
            return SystemFactory;
        }();
        Systems.SystemFactory = SystemFactory;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Circulatory = function () {
            function Circulatory(scales) {
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                ;
                this.heartbeat = scales[Animals.Scales.ParameterScaleTypes.heartbeat];
                this.pressure = scales[Animals.Scales.ParameterScaleTypes.pressure];
            }
            Object.defineProperty(Circulatory.prototype, "heartbeat", {
                get: function get() {
                    return this._heartbeat;
                },
                set: function set(param) {
                    if (param) {
                        this._heartbeat = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Circulatory.prototype, "pressure", {
                get: function get() {
                    return this._pressure;
                },
                set: function set(param) {
                    if (param) {
                        this._pressure = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Circulatory.prototype.changeHeartbeat = function (delta) {
                this._heartbeat.change(delta);
                this.analysis();
            };
            Circulatory.prototype.changePressure = function (delta) {
                this._pressure.change(delta);
                this.analysis();
            };
            Circulatory.prototype.analysis = function () {
                this.state.analysis([]);
            };
            return Circulatory;
        }();
        Systems.Circulatory = Circulatory;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Muscular = function () {
            function Muscular(scales) {
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                this.speed = scales[Animals.Scales.ParameterScaleTypes.speed];
                this.weight = scales[Animals.Scales.ParameterScaleTypes.weight];
            }
            Object.defineProperty(Muscular.prototype, "speed", {
                get: function get() {
                    return this._speed;
                },
                set: function set(param) {
                    if (param) {
                        this._speed = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Muscular.prototype, "weight", {
                get: function get() {
                    return this._weight;
                },
                set: function set(param) {
                    if (param) {
                        this._weight = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Muscular.prototype, "currentPoint", {
                get: function get() {
                    return this._currentPoint;
                },
                set: function set(param) {
                    this._currentPoint.x = param.x;
                    this._currentPoint.y = param.y;
                },
                enumerable: true,
                configurable: true
            });
            Muscular.prototype.changeSpeed = function (delta) {
                this._speed.change(delta);
                this.analysis();
            };
            Muscular.prototype.changeWeight = function (delta) {
                this._weight.change(delta);
                this.analysis();
            };
            Muscular.prototype.analysis = function () {
                this.state.analysis([]);
            };
            return Muscular;
        }();
        Systems.Muscular = Muscular;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var Animals;
(function (Animals) {
    var Systems;
    (function (Systems) {
        var Navigation = function () {
            function Navigation(scales) {
                this.state = scales[Animals.Scales.ParameterScaleTypes.state] || new Animals.Scales.SystemScale([]);
                this.speedSavvy = scales[Animals.Scales.ParameterScaleTypes.speedSavvy];
                this.radiusHearing = scales[Animals.Scales.ParameterScaleTypes.radiusHearing];
                this.radiusSmell = scales[Animals.Scales.ParameterScaleTypes.radiusSmell];
                this.radiusVision = scales[Animals.Scales.ParameterScaleTypes.radiusVision];
                this.radiusTouch = scales[Animals.Scales.ParameterScaleTypes.radiusTouch];
            }
            Object.defineProperty(Navigation.prototype, "speedSavvy", {
                get: function get() {
                    return this._speedSavvy;
                },
                set: function set(param) {
                    if (param) {
                        this._speedSavvy = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusVision", {
                get: function get() {
                    return this._radiusVision;
                },
                set: function set(param) {
                    if (param) {
                        this._radiusVision = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusHearing", {
                get: function get() {
                    return this._radiusHearing;
                },
                set: function set(param) {
                    if (param) {
                        this._radiusHearing = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusSmell", {
                get: function get() {
                    return this._radiusSmell;
                },
                set: function set(param) {
                    if (param) {
                        this._radiusSmell = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Navigation.prototype, "radiusTouch", {
                get: function get() {
                    return this._radiusTouch;
                },
                set: function set(param) {
                    if (param) {
                        this._radiusTouch = param;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Navigation.prototype.changeSpeedSavvy = function (delta) {
                this._speedSavvy.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusVision = function (delta) {
                this._radiusVision.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusHearing = function (delta) {
                this._radiusHearing.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusSmell = function (delta) {
                this._radiusSmell.change(delta);
                this.analysis();
            };
            Navigation.prototype.changeRadiusTouch = function (delta) {
                this._radiusTouch.change(delta);
                this.analysis();
            };
            Navigation.prototype.analysis = function () {
                this.state.analysis([]);
            };
            return Navigation;
        }();
        Systems.Navigation = Navigation;
    })(Systems = Animals.Systems || (Animals.Systems = {}));
})(Animals || (Animals = {}));
var MapGame;
(function (MapGame) {
    var Map = function () {
        function Map() {}
        Map.instance = function () {
            if (!this._inst) {
                this._inst = new Map();
            }
            return this._inst;
        };
        Object.defineProperty(Map.prototype, "world", {
            get: function get() {
                return this._world;
            },
            set: function set(map) {
                if (map) {
                    this._world = map;
                    this._initializationWorld();
                } else {
                    throw new Error('World was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "obstaclesLayer", {
            set: function set(layer) {
                if (layer) {
                    this._obstaclesLayer = layer;
                } else {
                    throw new Error('Layer obstacle was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "waterLayer", {
            set: function set(layer) {
                if (layer) {
                    this._waterLayer = layer;
                } else {
                    throw new Error('Layer water was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "treeLayer", {
            set: function set(layer) {
                if (layer) {
                    this._treeLayer = layer;
                } else {
                    throw new Error('Layer tree was not found...');
                }
            },
            enumerable: true,
            configurable: true
        });
        Map.prototype._initializationWorld = function () {
            this._initializationLayer();
            this._sizeMapTiled = this._world.getMapSize();
            this._sizeTiled = this._world.getTileSize();
            this._sizeMapPixel = this._getSizeMapPixel();
        };
        Map.prototype._initializationLayer = function () {
            this.obstaclesLayer = this._world.getLayer('obstacle');
            this.waterLayer = this._world.getLayer('water');
            this.treeLayer = this._world.getLayer('tree');
        };
        Map.prototype._getSizeMapPixel = function () {
            var sizeX = this._sizeMapTiled.width * this._sizeTiled.width;
            var sizeY = this._sizeMapTiled.height * this._sizeTiled.height;
            return cc.v2(sizeX, sizeY);
        };
        Map.prototype.convertTiledPos = function (posInPixel) {
            var x = Math.floor(posInPixel.x / this._sizeTiled.width);
            var y = Math.floor((this._sizeMapPixel.y - posInPixel.y) / this._sizeTiled.height);
            return cc.v2(x, y);
        };
        Map.prototype.convertPixelPos = function (posInTiled) {
            var x = posInTiled.x * this._sizeTiled.width + this._sizeTiled.width / 2;
            var y = this._sizeMapPixel.y - posInTiled.y * this._sizeTiled.height - this._sizeTiled.height / 2;
            return cc.v2(x, y);
        };
        Map.prototype.isCheсkObstacle = function (gid) {
            if (this._isCorrectPos(gid)) {
                if (this._obstaclesLayer.getTileGIDAt(gid.x, gid.y) === 0) {
                    return false;
                }
            }
            return true;
        };
        Map.prototype._isCorrectPos = function (pos) {
            if (pos.x < 0 || pos.y < 0 || pos.x > this._sizeMapTiled.width - 1 || pos.y > this._sizeMapTiled.height - 1) {
                return false;
            }
            return true;
        };
        return Map;
    }();
    MapGame.Map = Map;
})(MapGame || (MapGame = {}));
var lion = {
    name: 'Лев',
    systems: [{
        type: Animals.Systems.SystemTypes.muscular,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.speed }, { type: Animals.Scales.ParameterScaleTypes.weight }]
    }, {
        type: Animals.Systems.SystemTypes.circulatory,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.pressure }, { type: Animals.Scales.ParameterScaleTypes.heartbeat }]
    }, {
        type: Animals.Systems.SystemTypes.navigation,
        scalesType: [{ type: Animals.Scales.ParameterScaleTypes.speedSavvy }, { type: Animals.Scales.ParameterScaleTypes.radiusVision }, { type: Animals.Scales.ParameterScaleTypes.radiusSmell }, { type: Animals.Scales.ParameterScaleTypes.radiusHearing }, { type: Animals.Scales.ParameterScaleTypes.radiusTouch }]
    }],
    scales: [{
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.heartbeat,
        params: {
            name: 'Сердцебиение',
            current: 9,
            min: 0,
            max: 100,
            responseDelay: 0.12
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.pressure,
        params: {
            name: 'Давление',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.13
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.speed,
        params: {
            name: 'Скорость',
            current: 9,
            min: 0,
            max: 100,
            responseDelay: 0.12
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.weight,
        params: {
            name: 'Вес',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.speedSavvy,
        params: {
            name: 'Время смекалки',
            current: 8,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.radiusTouch,
        params: {
            name: 'Радиус осязания',
            current: 9,
            min: 0,
            max: 10,
            responseDelay: 0.1
        }
    }, {
        typeScale: Animals.Scales.ScaleTypes.argument,
        type: Animals.Scales.ParameterScaleTypes.radiusVision,
        params: {
            name: 'Радиус зрения',
            current: 40,
            min: 0,
            max: 80,
            responseDelay: 0.1
        }
    }],
    communication: [{
        type: Animals.Scales.ParameterScaleTypes.speed,
        link: [{
            type: Animals.Scales.ParameterScaleTypes.weight,
            behavior: Animals.Communications.BehaviorScaleTypes.increase,
            functions: Animals.Functions.FunctionTypes.line,
            params: [0.5, 0.18]
        }]
    }, {
        type: Animals.Scales.ParameterScaleTypes.weight,
        link: [{
            type: Animals.Scales.ParameterScaleTypes.speed,
            behavior: Animals.Communications.BehaviorScaleTypes.decrease,
            functions: Animals.Functions.FunctionTypes.line,
            params: [0.5, 0.1]
        }]
    }],
    states: {
        state: [{
            name: 'Старт',
            type: Animals.StateMachine.TypesState.startLife,
            isEnd: false
        }, {
            name: 'Бегу',
            type: Animals.StateMachine.TypesState.run,
            isEnd: false
        }, {
            name: 'Стою',
            type: Animals.StateMachine.TypesState.stand,
            isEnd: false
        }, {
            name: 'Умер',
            type: Animals.StateMachine.TypesState.die,
            isEnd: true
        }],
        links: [{
            type: Animals.StateMachine.TypesState.startLife,
            link: [{
                type: Animals.StateMachine.TypesState.run,
                probability: 0.7
            }, {
                type: Animals.StateMachine.TypesState.stand,
                probability: 0.7
            }, {
                type: Animals.StateMachine.TypesState.die,
                probability: 0.01
            }]
        }, {
            type: Animals.StateMachine.TypesState.stand,
            link: [{
                type: Animals.StateMachine.TypesState.run,
                probability: 0.7
            }, {
                type: Animals.StateMachine.TypesState.die,
                probability: 0.01
            }]
        }, {
            type: Animals.StateMachine.TypesState.run,
            link: [{
                type: Animals.StateMachine.TypesState.die,
                probability: 0.6
            }, {
                type: Animals.StateMachine.TypesState.stand,
                probability: 0.9
            }, {
                type: Animals.StateMachine.TypesState.run,
                probability: 0.1
            }]
        }]
    }
};
exports.APICore = APICore;


cc._RFpop();
},{"es6-promise":2}],"circular-list-actions-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a6899DVEs9GDZoz23Sq6Cgc', 'circular-list-actions-animal');
// scripts\components\circular-list\circular-list-actions-animal.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CircularListActionsAnimal = undefined;

var _circularList = require('./circular-list');

/**
 * Настраивает круглое меню животного
 * @class CircularListActionsAnimal
 * @extends CircularList
 */
var CircularListActionsAnimal = cc.Class({
    extends: _circularList.CircularList,

    /**
     * Настройка меню для конкретного животного. Настраивает радиус круга.
     * @method settings
     * @param {cc.Component} controllerAnimal контроллер животного.
     */
    settings: function settings(controllerAnimal) {
        var node = controllerAnimal.node;

        this.radius = node.width * 1.75;
        if (this.radius > 150) {
            this.radius = 150;
        } else if (this.radius < 100) {
            this.radius = 100;
        }

        this._refreshMenu();
    }
});

exports.CircularListActionsAnimal = CircularListActionsAnimal;

cc._RFpop();
},{"./circular-list":"circular-list"}],"circular-list":[function(require,module,exports){
"use strict";
cc._RFpush(module, '784b8AGpLpDe6a27LcTvsKZ', 'circular-list');
// scripts\components\circular-list\circular-list.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Состояние движения меню (по часовой/против часовой).
 * @type {MoveCircular}
 * @static
 * @element {number} clockwise крутится по часовой.
 * @element {number} anticlockwise крутится против часовой.
 */
var MoveCircular = {
    clockwise: 0, //по часовой
    anticlockwise: 1 };

/**
 * Выполняет вращениеи размещение элементов по окружности.
 * @class CircularList
 */
var CircularList = cc.Class({
    extends: cc.Component,

    properties: {
        _lengthBetweenPoints: 0, //расстояние между элементами
        _centre: cc.Vec2, //Центр круга
        _arrayAngleList: [], ///массив углов листов на которых они находятся
        _poolInvisibleList: [], //массив невидимых листов
        _prevRotation: 0, //предыдущий угол воворота до текущего поворота
        _stateDirection: MoveCircular.clockwise, //направление движения

        amountVisiblList: 7, //количество видимых липестков меню
        angleTransition: 225, //угол перехода и появленияновых липестков
        widthTransition: 0.3, //ширина перехода в градусах
        radius: 130, //радиус на котором будут крутится все кнопки
        sensitivity: 1 },

    /**
     * Инициализация меню животного.
     * @method onLoad
     */
    onLoad: function onLoad() {
        this._placementListsMenu();
        this._prevRotation = this.node.rotation;
    },


    /**
     * Обновить позиции кнопок в меню. С учетом радиуса окружности.
     * @method _refreshMenu
     * @private
     */
    _refreshMenu: function _refreshMenu() {
        this._placementListsMenu();
    },


    /**
     * Распределение кнопок по окружности.
     * @method _placementListsMenu
     * @private
     */
    _placementListsMenu: function _placementListsMenu() {
        var _this = this;

        //рассчитываем центр круга
        var window = this.node.parent;
        var currentRadians = 0,
            x = void 0,
            y = void 0;
        this._arrayAngleList = [];
        this._poolInvisibleList = [];

        this._centre = cc.v2(window.width / 2, window.height / 2);
        this._lengthBetweenPoints = 2 * Math.PI / this.amountVisiblList;

        this.node.children.forEach(function (item) {

            if (currentRadians >= 2 * Math.PI) {
                item.active = false;
                _this._poolInvisibleList.push(item);
            } else {
                y = _this.radius * Math.sin(currentRadians);
                x = _this.radius * Math.cos(currentRadians);
                item.setPosition(x, y);
                _this._arrayAngleList.push({ item: item, angle: currentRadians * (180 / Math.PI) });
            }

            currentRadians += _this._lengthBetweenPoints;
        });
    },


    /**
     * Определение направления вращения и вызывает соответствующий обработчик, передавая значения с
     * учетом чувствительности.
     * @method directionRotation
     * @param {number} x дельта изменения по абциссе.
     * @param {number} y дельта изменения по ординате.
     * @param {number} locX положение тача по абциссе.
     * @param {number} locY положение тача по ординате.
     */
    directionRotation: function directionRotation(x, y, locX, locY) {
        //применяем чувствительность
        x = x * this.sensitivity;
        y = y * this.sensitivity;

        if (locX > this._centre.x && locY > this._centre.y) {
            this._obr1(x, y);
        } else if (locX < this._centre.x && locY > this._centre.y) {
            this._obr2(x, y);
        } else if (locX < this._centre.x && locY < this._centre.y) {
            this._obr3(x, y);
        } else if (locX > this._centre.x && locY < this._centre.y) {
            this._obr4(x, y);
        } else {
            this.node.rotation += 0.001;
        }

        this._setDirection();

        if (this.amountVisiblList < this.node.children.length) {
            this._workingVisibleElements();
        }
    },


    /**
     * Работает с появлением элементов.
     * @method _workingVisibleElements
     * @private
     */
    _workingVisibleElements: function _workingVisibleElements() {
        var _this2 = this;

        var angle = this.getAngleMenu();
        //Узнаем для каждого элемента его угол на котором он находится
        this.node.children.forEach(function (item) {
            if (item.active) {
                _this2._swapElement(_this2.getAngleList(item, angle), item);
            }
            angle = _this2.getAngleMenu();
        });
    },


    /**
     * Отдает угол меню.
     * @method getAngleMenu
     * @returns {number} угол поворота от 0 до 360.
     */
    getAngleMenu: function getAngleMenu() {
        return this.node.rotation - 360 * Math.floor(this.node.rotation / 360);
    },


    /**
     * Работает с элементами выключая их и подставляяя за место них другие эелементы.
     * @method _swapElement
     * @param {number} angle угол на котором находится элемент.
     * @param {cc.Node} element элемент/лист который необходимо заменить на следующий элемент из очереди невидимых элементов.
     * @private
     */
    _swapElement: function _swapElement(angle, element) {
        if (angle > this.angleTransition - this.widthTransition && angle < this.angleTransition + this.widthTransition) {
            element.active = false;
            var actualList = this._poolInvisibleList.shift();
            actualList.setPosition(cc.v2(element.x, element.y));
            actualList.rotation = element.rotation;
            actualList.active = true;
            this._poolInvisibleList.push(element);
            this._arrayAngleList.forEach(function (item) {
                if (item.item.name === element.name) {
                    item.item = actualList;
                }
            });

            this._stateDirection === MoveCircular.clockwise ? this.node.rotation += this.widthTransition : this.node.rotation -= this.widthTransition;
        }
    },


    /**
     * Возвращает угол элемента/листа под которым он находится.
     * @method getAngleList
     * @param {cc.Node} element нод элемента.
     * @param {number} angle угол поворота меню.
     * @return {number} угол листа/элемента меню.
     */
    getAngleList: function getAngleList(element, angle) {
        var obj = this._arrayAngleList.filter(function (item) {
            return item.item.x === element.x && item.item.y === element.y;
        });

        obj = obj[0].angle - angle;
        obj -= Math.floor(obj / 360) * 360;
        return obj;
    },


    /**
     * Устанавливает состояние движения меню в зависимости от направления поворота.
     * @method _setDirection
     * @private
     */
    _setDirection: function _setDirection() {
        if (this.node.rotation > this._prevRotation) {
            this._stateDirection = MoveCircular.clockwise;
        } else if (this.node.rotation < this._prevRotation) {
            this._stateDirection = MoveCircular.anticlockwise;
        }
        this._prevRotation = this.node.rotation;
    },


    /**
     * Стабилизирует элементы меню по положению к горизонту.
     * @method stabilizationElements
     */
    stabilizationElements: function stabilizationElements() {
        var _this3 = this;

        this.node.children.forEach(function (item) {
            item.rotation = -_this3.node.rotation;
        });
    },


    /**
     * Обработчик первой четверти окружности. Распознает движение тача и применяет сответствующее поведение.
     * Для обеспечения вращения окружности пользователем.
     * @method _obr1
     * @param {number} x дельта по абциссе.
     * @param {number} y дельта по ординате.
     * @private
     */
    _obr1: function _obr1(x, y) {
        this.node.rotation += x;
        this.node.rotation -= y;
        this.stabilizationElements();
    },


    /**
     * Обработчик второй четверти круга. Распознает движение тача и применяет сответствующее поведение.
     * Для обеспечения вращения окружности пользователем.
     * @method _obr2
     * @param {number} x дельта по абциссе.
     * @param {number} y дельта по ординате.
     * @private
     */
    _obr2: function _obr2(x, y) {
        this.node.rotation += x;
        this.node.rotation += y;
        this.stabilizationElements();
    },


    /**
     * Обработчик третьей четверти круга. Распознает движение тача и применяет сответствующее поведение.
     * Для обеспечения вращения окружности пользователем.
     * @method _obr3
     * @param {number} x дельта по абциссе.
     * @param {number} y дельта по ординате.
     * @private
     */
    _obr3: function _obr3(x, y) {
        this.node.rotation -= x;
        this.node.rotation += y;
        this.stabilizationElements();
    },


    /**
     * Обработчик четвертой четверти круга. Распознает движение тача и применяет сответствующее поведение.
     * Для обеспечения вращения окружности пользователем.
     * @method _obr4
     * @param {number} x дельта по абциссе.
     * @param {number} y дельта по ординате.
     * @private
     */
    _obr4: function _obr4(x, y) {
        this.node.rotation -= x;
        this.node.rotation -= y;
        this.stabilizationElements();
    }
});

exports.CircularList = CircularList;

cc._RFpop();
},{}],"controller-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, '66c9dWcVjFAg46rYxreOb0Q', 'controller-animal');
// scripts\components\controller\controller-animal.js

'use strict';

var _buildTs = require('../../build/build-ts');

/**
 *
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _model: null, //модель животного

        _maxBiasTouch: 15, //максимальное смещение тача для открытия меню (px)
        _pointTouchForMenu: cc.v2, //точка старта тача по животному

        _isMove: false, //флаг для определения движется ли живоное за пользователем
        _isOpenMenu: false },

    onLoad: function onLoad() {
        this._api = _buildTs.APICore.instance();
        this._isOpenMenu = false;
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoveAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStartAnimal.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEndAnimal.bind(this));
    },


    /**
     * Настраивает доступные действия плюшки для животного и характеристики
     */
    settings: function settings(pack) {
        this._model = this._api.createAnimal(pack.puthToModel, pack.id); //создаем модель животного

        cc.log(this.node.children);
        this.settingCollider(this._model.navigation.radiusVision, this.node.children[0].getComponent(cc.CircleCollider));
        this.settingCollider(this._model.navigation.radiusHearing, this.node.children[1].getComponent(cc.CircleCollider));
        this.settingCollider(this._model.navigation.radiusSmell, this.node.children[2].getComponent(cc.CircleCollider));
        this.settingCollider(this._model.navigation.radiusTouch, this.node.children[3].getComponent(cc.CircleCollider));
    },


    /**
     * Настраивает коллайдеры у животного согласно его модели
     * @method settingCollider
     * @param {Animals.Systems.ISystem} system
     * @param {cc.CircleCollider} component
     */
    settingCollider: function settingCollider(system, component) {
        system === undefined ? component.radius = 0 : component.radius = system.current;
    },


    /**
     * Обработчик события начала тача
     * @param event
     * @private
     */
    _onTouchStartAnimal: function _onTouchStartAnimal(event) {
        var myEvent = new cc.Event.EventCustom('startMotionAnimal', true);
        myEvent.detail = {
            startMotion: cc.v2(this.node.x, this.node.y),
            controller: this
        };
        this.node.dispatchEvent(myEvent); //разослали евент
        this._isMove = false; //животное не движется за пользователем
        this._pointTouchForMenu = event.getLocation(); //считали точку первого нажатия
        event.stopPropagation();
    },


    /**
     * Обработчик события движения тача.
     * @param event
     * @private
     */
    _onTouchMoveAnimal: function _onTouchMoveAnimal(event) {
        //   cc.log(event);
        var delta = event.touch.getDelta();
        if (this._isCheckOnOpenMenu(event.getLocation()) && !this._isOpenMenu) {
            this._isMove = true;
            var myEvent = new cc.Event.EventCustom('motionAnimal', true);
            myEvent.detail = {
                deltaMotion: delta,
                pointEnd: event.getLocation()
            };
            this.node.dispatchEvent(myEvent);
        }
        event.stopPropagation();
    },


    /**
     * Обработчик события завершения тача
     * @param event
     * @private
     */
    _onTouchEndAnimal: function _onTouchEndAnimal(event) {
        if (this._isMove) {
            var myEvent = new cc.Event.EventCustom('endMotionAnimal', true);
            myEvent.detail = {
                pointEnd: event.getLocation()
            };
            this.node.dispatchEvent(myEvent);
            this._isMove = false;
        } else {
            this._refocusMenu();
        }
        event.stopPropagation();
    },


    /**
     * Проверяет открывается меню или нет. Путем сканирования точки тача на выходза пределы от начапльной точки
     * @param point
     * @return {boolean}
     * @private
     */
    _isCheckOnOpenMenu: function _isCheckOnOpenMenu(point) {
        var X = Math.abs(this._pointTouchForMenu.x - point.x) > this._maxBiasTouch;
        var Y = Math.abs(this._pointTouchForMenu.y - point.y) > this._maxBiasTouch;
        return X || Y;
    },


    /**
     * Изменяет состояние меню
     * @private
     */
    _refocusMenu: function _refocusMenu() {
        this._isOpenMenu = !this._isOpenMenu;
        this._isOpenMenu ? this._publishOpenMenuAnimal() : this._publishCloseMenuAnimal();
    },


    /**
     * Открытие меню животного
     */
    _publishOpenMenuAnimal: function _publishOpenMenuAnimal() {
        var myEvent = new cc.Event.EventCustom('openMenuAnimal', true);
        myEvent.detail = {
            controller: this
        };
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Закрыто меню с животными
     */
    _publishCloseMenuAnimal: function _publishCloseMenuAnimal() {
        var myEvent = new cc.Event.EventCustom('closeMenuAnimal', true);
        myEvent.detail = {
            controller: this
        };
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Открытие меню
     */
    openMenu: function openMenu() {
        this._isOpenMenu = true;
        this._publishOpenMenuAnimal();
    },


    /**
     * Закрыть меню
     */
    closeMenu: function closeMenu() {
        this._isOpenMenu = false;
        this._publishCloseMenuAnimal();
    },


    /**
     * Сообщает модели до какой точки надо дойти
     * @param point
     */
    moveToPoint: function moveToPoint(point) {
        this._model.moveToPoint(point);
    },


    /**
     * Запускает жизнь животного
     * @method run
     */
    run: function run() {
        this._model.runLife();
    },


    /**
     * Подать звук
     */
    runVoice: function runVoice() {},


    /**
     * Сесть
     */
    runSit: function runSit() {},


    /**
     * Испугаться
     */
    runFrighten: function runFrighten() {},


    /**
     * Показать ареалы
     */
    runAreal: function runAreal() {},


    /**
     * Поласкаться
     */
    runCare: function runCare() {},


    /**
     * Лечь
     */
    runLie: function runLie() {},


    /**
     * Приготовиться
     */
    runAttention: function runAttention() {},


    /**
     * Возвращает массив характеристик у животного
     * @return {*|any}
     */
    getCharacteristics: function getCharacteristics() {
        return this._model.getCharacteristics();
    }
});

cc._RFpop();
},{"../../build/build-ts":"build-ts"}],"controller-create-animal":[function(require,module,exports){
"use strict";
cc._RFpush(module, '68d96M14BpDWYNEyzwJbTpY', 'controller-create-animal');
// scripts\components\controller\controller-create-animal.js

'use strict';

cc.Class({
    extends: cc.Component,

    /**
     *
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },


    /**
     * Действия на нажатие по зверюшке после создания зверюшки
     * @param event
     */
    onTouchStart: function onTouchStart(event) {
        var myEvent = new cc.Event.EventCustom('startDragAndDropAnimal', true);
        myEvent.detail = {
            animal: this.node
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Действия надвижение зажатой зверюшки после создания звербшки
     * @param event
     */
    onTouchMove: function onTouchMove(event) {
        var delta = event.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
        var myEvent = new cc.Event.EventCustom('dragAndDropAnimal', true);
        myEvent.detail = {
            point: { x: this.node.x, y: this.node.y }
        };
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Действие на завершение нажатия по зверюшке после создания зверюшки
     * @param event
     */
    onTouchEnd: function onTouchEnd(event) {
        var myEvent = new cc.Event.EventCustom('stopDragAndDropAnimal', true);
        myEvent.detail = {
            point: { x: this.node.x, y: this.node.y }
        };
        this.node.dispatchEvent(myEvent);

        event.stopPropagation();
    }
});

cc._RFpop();
},{}],"controller-map":[function(require,module,exports){
"use strict";
cc._RFpush(module, '92c540oZntIDYNnPFU1Dt7g', 'controller-map');
// scripts\components\controller\controller-map.js

'use strict';

/**
 * Created by FIRCorp on 04.03.2017.
 */

cc.Class({
    extends: cc.Component,

    properties: {
        _fictitiousPoint: null, //Точка для фиксации движения карты. Помогает различать событие движение от завершения
        _isTouchStart: null, //Флаг запущен ли тач
        _controllerScrollMap: null,
        _actionMoveMap: null, //действие движения карты
        _maxSizeMapScroll: null, //размер offset скролла. поможет при перемещении камеры от зверюшки к зверюшке

        maxBiasTouch: 15 },

    onLoad: function onLoad() {

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));

        this._isTouchStart = false;
        this._controllerScrollMap = this.node.parent.parent.getComponent(cc.ScrollView);
        this._fictitiousPoint = cc.v2(0, 0);
        this._maxSizeMapScroll = this._controllerScrollMap.getMaxScrollOffset();
    },


    /**
     * Событие пораждающиеся скролом
     * @param event событие которое ловит скрол
     */
    onEventScroll: function onEventScroll(event) {
        var point = event.getScrollOffset();
        var logRez = point.x === this._fictitiousPoint.x && point.y === this._fictitiousPoint.y;
        logRez && this._isTouchStart ? this.onTouchEnd(event) : this._fictitiousPoint = point;
    },


    /**
     * Действия на прикосновение к карте
     * @param event событие которое поймает этот скрипт
     */
    onTouchStart: function onTouchStart(event) {
        this._isTouchStart = true;
        //запомнимпозиция начала эвента
        var myEvent = new cc.Event.EventCustom('touchOnMap', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Действия на движение touch по карте
     * @param event событие которое поймает этот скрипт
     */
    onTouchMove: function onTouchMove(event) {
        var myEvent = new cc.Event.EventCustom('touchMoveOnMap', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
        event.stopPropagation();
    },


    /**
     * Дейстия на откпускание touch от карты
     * @param event событие которое поймает скрол либо этот скрипт
     */
    onTouchEnd: function onTouchEnd(event) {
        //      cc.log(event);
        if (this._isTouchStart) {
            this._isTouchStart = false;
            var myEvent = new cc.Event.EventCustom('touchEndMoveOnMap', true);
            myEvent.detail = {};
            this.node.dispatchEvent(myEvent);
        }
        //    event.stopPropagation();
    },


    /**
     * Конвентирует точку окна в точку карты
     * @param point точка в окне
     * @returns {Vec2} точка на карте
     */
    getPointMap: function getPointMap(point) {
        var newX = point.x - this.node.x;
        var newY = point.y - this.node.y;
        return cc.v2(newX, newY);
    },


    /**
     * Конвертирует точку в координаты окна
     * @param point точка на карте
     * @returns {Vec2} точка в окне
     */
    getPointWindow: function getPointWindow(point) {
        var newX = point.x + this.node.x;
        var newY = point.y + this.node.y;
        return cc.v2(newX, newY);
    },


    /**
     * Возвращает точку карты из системы координат скролла
     * @param point исходная точка
     * @returns {Vec2}
     */
    getPointMapOfOffset: function getPointMapOfOffset(point) {
        var newY = this._maxSizeMapScroll.y - point.y;
        return cc.v2(point.x, newY);
    },


    /**
     * Инвертирует точку
     * @param point исходная точка
     * @returns {Vec2}
     */
    getInvertPoint: function getInvertPoint(point) {
        var newX = -point.x;
        var newY = -point.y;
        return cc.v2(newX, newY);
    },


    /**
     * Движение камеры внекоторую точку на основе метода движения скролла. С использованием его системы координат
     * @param point точка в которую необходимо перейти
     * @param time время за кторое производится переход
     */
    move: function move(point) {
        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        this._controllerScrollMap.scrollToOffset(this.getPointMapOfOffset(point), time);
    },


    /**
     * Движение карты в некоторую точку на основе actions
     * @param point
     * @param time
     */
    moveActions: function moveActions(point) {
        var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        this.node.stopAction(this._actionMoveMap);
        this._actionMoveMap = cc.moveTo(time, this.getInvertPoint(point));
        this.node.runAction(cc.sequence(this._actionMoveMap, cc.callFunc(this._publishFinishMoveCentreToAnimal, this)));
    },


    /**
     * Публикует событие завершения движения камеры до животного и фиксирование его по центру экрана
     * @private
     */
    _publishFinishMoveCentreToAnimal: function _publishFinishMoveCentreToAnimal() {
        var myEvent = new cc.Event.EventCustom('finishMoveCameraToAnimal', true);
        myEvent.detail = {};
        this.node.dispatchEvent(myEvent);
    }
});

cc._RFpop();
},{}],"controller-menu-play":[function(require,module,exports){
"use strict";
cc._RFpush(module, '347b4yRgbpKUKt0KdaDtRm2', 'controller-menu-play');
// scripts\components\controller\controller-menu-play.js

"use strict";

/**
 * Created by FIRCorp on 31.03.2017.
 */
cc.Class({
    extends: cc.Component,

    /**
     *
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    },


    /**
     *
     * @param event
     */
    onTouchStart: function onTouchStart(event) {},


    /**
     *
     * @param event
     */
    onTouchMove: function onTouchMove(event) {},


    /**
     *
     * @param event
     */
    onTouchEnd: function onTouchEnd(event) {}
});

cc._RFpop();
},{}],"controller-scroll-box-characteristic":[function(require,module,exports){
"use strict";
cc._RFpush(module, '04c7cO85KFEDYEx3y2vauzA', 'controller-scroll-box-characteristic');
// scripts\components\controller\controller-scroll-box-characteristic.js

"use strict";

/**
 * Created by FIRCorp on 16.04.2017.
 */

/**
 * Контроллер скролла характиристик. Производит регулировку элементов бокса харатеристик. Выполняет операции связанные с регулировкой нодов для обеспечения иллюзии вращения барабана куда накручивается/откуда скручивается список характеристик.
 * @class CharacteristicsScrollBoxController
 */
var CharacteristicsScrollBoxController = cc.Class({
    extends: cc.Component,

    properties: {
        nodeCoil: cc.Node, //нод палки
        nodeRoll: cc.Node, //нод блеска
        nodeContent: cc.Node, // нод контента
        bottomPointStartRotation: 281, //нижняя кордина старта поворота
        topPointStartRotation: 361, //верхняя кордина старта поворота
        _interval: 0, //длинна промежутка для сжития паременных
        _startPosContent: null },

    /**
     * Событие на загрузку сцены.
     * @method onLoad
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
    },


    /**
     * Инициализация по запуску элемента
     * @method start
     */
    start: function start() {
        var la = this.nodeContent.getComponent(cc.Layout);
        this._step = la.spacingY;
        this._startPosContent = this.nodeContent.y;
        this._interval = this.topPointStartRotation - this.bottomPointStartRotation;
    },


    /**
     * Обработчик старта тача
     * @method _onTouchStart
     * @param event
     * @private
     */
    _onTouchStart: function _onTouchStart(event) {},


    /**
     * Евент движения скролла. Обрабатывает вращении бокса характеристик.Производит сжатие параметров на интервале
     * @method onMoveScroll
     * @param event
     */
    onMoveScroll: function onMoveScroll(event) {
        var _this = this;

        var currentPointContent = event.getContentPosition();
        var bais = Math.abs(currentPointContent.y - this._startPosContent);
        var vr = 0;
        if (currentPointContent.y > this._startPosContent) {
            this.nodeContent.children.forEach(function (item) {
                var currentPointItem = _this._startPosContent - vr + bais;
                if (currentPointItem > _this.bottomPointStartRotation && currentPointItem < _this.topPointStartRotation) {
                    item.scaleY = _this._getScaleItem(currentPointItem);
                } else {
                    item.scaleY = 1;
                }
                vr += _this._step + item.height;
            });
        }
    },


    /**
     * Возвращает коэффицент сжатия. Который расчитывается на основе промежутка и текущего положения в этом промежутке.
     * @method _getScaleItem
     * @param currentPoint текущее положение параметра по оси ординат
     * @returns {number} коэффицент сжатия для параметра
     * @private
     */
    _getScaleItem: function _getScaleItem(currentPoint) {
        var k = 1 - 100 * (currentPoint - this.bottomPointStartRotation) / this._interval / 100;
        return k > 1 || k < 0 ? 1 : k;
    }
});

cc._RFpop();
},{}],"factory-animal-prefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'da12cCPbmFOSaLOZet/rlBG', 'factory-animal-prefab');
// scripts\components\factory-animal-prefab\factory-animal-prefab.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var FactoryAnimalPrefab = cc.Class({
    extends: cc.Component,

    properties: {
        _targetAnimal: cc.Node,
        wayToPrefab: 'prefabs/animal/LionSheath',
        wayToModel: './model', //Путь до модели
        nameAnimal: 'animal' },

    /**
     * Создает животное
     * @param {cc.Event} event
     */
    createAnimal: function createAnimal(event) {
        //  cc.log(event);
        // let pointTouch = event.getStartLocation();
        this._createPrefab();
    },


    /**
     * Создает префаб в нужном контенте
     * @see {string} wayToPrefab путь до префаба
     */
    _createPrefab: function _createPrefab() {
        var _this = this;

        cc.loader.loadRes(this.wayToPrefab, function (err, prefab) {
            _this._targetAnimal = cc.instantiate(prefab);

            var myEvent = new cc.Event.EventCustom('createAnimal', true);
            myEvent.detail = {
                animal: _this._settingsAnimal(_this._targetAnimal),
                puthToModel: _this.wayToModel
            };
            _this.node.dispatchEvent(myEvent);
        });
    },


    /**
     *
     * @param nodeAnimal
     * @returns {*}
     * @private
     */
    _settingsAnimal: function _settingsAnimal(nodeAnimal) {
        nodeAnimal.name = this.nameAnimal;

        return nodeAnimal;
    }
});

exports.FactoryAnimalPrefab = FactoryAnimalPrefab;

cc._RFpop();
},{}],"list":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0d138D7piRNwKyrESSWEncS', 'list');
// scripts\components\circular-list\list.js

'use strict';

var _circularList = require('./circular-list');

/**
 * Лист меню животного.
 * @class List
 */
cc.Class({
    extends: cc.Component,

    properties: {
        manager: _circularList.CircularList, //ссылка на ядро вращения
        nameEvent: 'voiceAnimal', //имя события которое вызывает эта кнопка
        maxBiasTouch: 15, //максимальное смещение тача для нажатия по элементу меню (px)
        _pointTouchForMenu: cc.v2 },

    /**
     * Инициализация листа меню животного.
     * @method onLoad
     */
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd.bind(this));
    },


    /**
     * Обработчик старта нажатия на лист.
     * @method _onTouchStart
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchStart: function _onTouchStart(event) {
        this._pointTouchForMenu = event.getLocation();
        event.stopPropagation();
    },


    /**
     * Обработчик отпускания тача от листа.
     * @method _onTouchEnd
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchEnd: function _onTouchEnd(event) {
        var point = event.getLocation();
        var X = Math.abs(this._pointTouchForMenu.x - point.x) < this.maxBiasTouch;
        var Y = Math.abs(this._pointTouchForMenu.y - point.y) < this.maxBiasTouch;
        if (X && Y) {
            this._publishEvent();
        }
        event.stopPropagation();
    },


    /**
     * Публикует событие свзанное с этим листом.
     * @method _publishEvent
     * @private
     */
    _publishEvent: function _publishEvent() {
        var myEvent = new cc.Event.EventCustom(this.nameEvent, true);
        myEvent.detail = {
            animal: this.manager.parent
        };
        this.node.dispatchEvent(myEvent);
    },


    /**
     * Обработчик движения тача.
     * @method _onTouchMove
     * @param {cc.Event} event объект события.
     * @private
     */
    _onTouchMove: function _onTouchMove(event) {
        var point = event.touch.getPreviousLocation();
        var delta = event.touch.getDelta();
        this.manager.directionRotation(delta.x, delta.y, point.x, point.y);
        event.stopPropagation();
    }
});

cc._RFpop();
},{"./circular-list":"circular-list"}],"play":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5472eW0A6xObaFu8KPQmp4d', 'play');
// scripts\components\scene\play.js

'use strict';

/**
 * Состояние игры.
 * @type {StatGame}
 * @static
 * @element {number} sleep бездействие.
 * @element {number} openMenu открытие меню игры.
 * @element {number} openMenuAnimal открытие меню животного.
 * @element {number} createAnimal создание животного.
 * @element {number} moveMap движение карты пользователем.
 */
var StatGame = {
    sleep: 0,
    openMenu: 1,
    openMenuAnimal: 2,
    createAnimal: 3,
    moveMap: 4
};

/**
 * Управляет представлнием.
 * @class Play
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nodeWindow: cc.Node, //окно игры
        nodeBoxCreateAnimal: cc.Node, //всплывающий бокс с животными
        nodeBoxCharacteristicsAnimal: cc.Node, //всплывающий бокс с характеристиками животного
        nodeBasket: cc.Node, //корзина для удаления животного
        nodeFieldAnimals: cc.Node, //поле жизнедеятельности животных
        nodeBoxMap: cc.Node, //бокс с картой
        nodeMap: cc.Node, //поле карты
        nodeMenu: cc.Node, //поле меню игры
        nodeMenuAnimal: cc.Node, //нод меню животного
        nodeMaskCreatedAnimal: cc.Node, //маска для создания животных

        prefabParametrCharacteristics: cc.Prefab, //префаб характеристики

        colorTextCharacteristics: cc.Color, //цвет текста у характеристик

        _targetAnimal: cc.Node, //нод животного в таргете
        _pointTargetAnimal: cc.v2, //точка назначения животного в таргете
        _targetControllerAnimal: cc.Node, //контроллер животного в таргете
        _centreWindowPoint: null },

    /**
     * Инициализация конроллера представления.
     * @method onLoad
     */
    onLoad: function onLoad() {
        this._init();
        //cd this.p=new Promise((a,b)=>{});
        this.node.on('createAnimal', this.onAnimalCreated.bind(this));
        this.node.on('openBoxFromAnimal', this.onOpenBoxFromAnimal.bind(this));
        this.node.on('closeBoxFromAnimal', this.onCloseBoxFromAnimal.bind(this));
        this.node.on('openBoxMenuPlay', this.onOpenBoxMenuPlay.bind(this));
        this.node.on('closeBoxMenuPlay', this.onCloseBoxMenuPlay.bind(this));

        this.node.on('openBoxFromCharacteristicsAnimal', this.onOpenBoxFromCharacteristicsAnimal.bind(this));
        this.node.on('closeBoxFromCharacteristicsAnimal', this.onCloseBoxFromCharacteristicsAnimal.bind(this));
        this.node.on('startDragAndDropAnimal', this.onStartDragAndDropAnimal.bind(this));
        this.node.on('dragAndDropAnimal', this.onDragAndDropAnimal.bind(this));
        this.node.on('stopDragAndDropAnimal', this.onStopDragAndDropAnimal.bind(this));
        this.node.on('motionAnimal', this.onMotionAnimal.bind(this));
        this.node.on('startMotionAnimal', this.onStartMotionAnimal.bind(this));
        this.node.on('endMotionAnimal', this.onEndMotionAnimal.bind(this));
        this.node.on('openMenuAnimal', this.onOpenMenuAnimal.bind(this));
        this.node.on('closeMenuAnimal', this.onCloseMenuAnimal.bind(this));

        this.node.on('voiceAnimal', this.onVoiceAnimal.bind(this));
        this.node.on('sitAnimal', this.onSitAnimal.bind(this)); //сидеть
        this.node.on('frightenAnimal', this.onFrightenAnimal.bind(this)); //напугать
        this.node.on('arealAnimal', this.onArealAnimal.bind(this)); //показать ареал
        this.node.on('careAnimal', this.onCareAnimal.bind(this)); //Забота, гладить
        this.node.on('lieAnimal', this.onLieAnimal.bind(this)); //Лежать,лечь
        this.node.on('attentionAnimal', this.onAttentionAnimal.bind(this)); //Внимание, готовсь

        this.node.on('basketActive', this.onBasketActive.bind(this));
        this.node.on('basketSleep', this.onBasketSleep.bind(this));
        this.node.on('basketWork', this.onBasketWork.bind(this));

        this.node.on('touchOnMap', this.onTouchOnMap.bind(this));
        this.node.on('touchMoveOnMap', this.onTouchMoveOnMap.bind(this));
        this.node.on('touchEndMoveOnMap', this.onTouchEndMoveOnMap.bind(this));
        this.node.on('finishMoveCameraToAnimal', this.onFinishMoveCameraToAnimal.bind(this));
    },


    /**
     * Инициализация данных.
     * @method _init
     * @private
     */
    _init: function _init() {

        this._stateGame = StatGame.sleep;

        this._targetSizeWith = 0; //временные размеры ширины животного в таргете. Для сохранения
        this._targetSizeHeight = 0; //временные размеры высоты животного в таргете. Для сохранения

        this._pointTargetAnimal = cc.v2(0, 0); //точка назначения животного в таргет
        this._targetAnimal = null; //нод животного в таргете
        this._controllerAnimal = null; //контроллер животного (только 1 того что в таргете)
        this._centreWindowPoint = cc.v2(this.node.width / 2, this.node.height / 2);
        this._controllerCircularMenu = this.nodeMenuAnimal.getComponent('circular-list-actions-animal');
        this._boxCreateAnimal = this.nodeBoxCreateAnimal.getComponent('box-create-animal');
        this._boxCharacteristicsAnimal = this.nodeBoxCharacteristicsAnimal.getComponent('box-characteristics-animal');
        this._controllerBasket = this.nodeBasket.getComponent('basket-animal');
        this._controllerMap = this.nodeMap.getComponent('controller-map');
    },


    /**
     * Бокс с животными закрылся.
     * @method onCloseBoxFromAnimal
     * @param {cc.Event} event
     */
    onCloseBoxFromAnimal: function onCloseBoxFromAnimal(event) {

        cc.log('закрылся BoxFromAnimal');
        if (this._stateGame != StatGame.createAnimal) {
            this.nodeMaskCreatedAnimal.active = false;
        }
    },


    /**
     * Бокс с животными открылся.
     * @method onOpenBoxFromAnimal
     * @param {cc.Event} event
     */
    onOpenBoxFromAnimal: function onOpenBoxFromAnimal(event) {

        cc.log('открылся BoxFromAnimal');
        this.nodeMaskCreatedAnimal.active = true; //активировали маску
        this.nodeMaskCreatedAnimal.setPosition(this._centreWindowPoint);
        if (this._controllerAnimal !== null) this._controllerAnimal.closeMenu();
    },


    /**
     * Меню открылось.
     * @method onOpenBoxMenuPlay
     * @param {cc.Event} event
     */
    onOpenBoxMenuPlay: function onOpenBoxMenuPlay(event) {

        cc.log('открылось меню');
        this.nodeMenu.active = true;
    },


    /**
     * Меню закрылось.
     * @method onCloseBoxMenuPlay
     * @param {cc.Event} event
     */
    onCloseBoxMenuPlay: function onCloseBoxMenuPlay(event) {

        cc.log('закрылось меню');
        this.nodeMenu.active = false;
    },


    /**
     * Создание животного.
     * Отвечает за размещение животного в дереве нодов.
     * @method onAnimalCreated
     * @param {cc.Event} event
     */
    onAnimalCreated: function onAnimalCreated(event) {
        this._stateGame = StatGame.createAnimal;
        cc.log('создание нового животного');
        event.detail.animal.parent = this.nodeFieldAnimals.parent; // подцепить животное к карте
        var point = this._controllerMap.getPointMap(cc.v2(this.node.width / 2, this.node.height / 2)); //вычислить координаты на карте
        event.detail.animal.setPosition(point.x, point.y); //Установить координаты животного
        this._targetPuthToModel = event.detail.puthToModel; //Сохранить путь до модели. используется при создании модели

        this._boxCreateAnimal.closeBox(); //закрыть бокс с животными
        this._boxCreateAnimal.onBlock(); //заблокировать бокс сживотными
        this._controllerBasket.on(); //Включить корзину
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false; //заблокировать карту

        //Необходимо закрыть все что связано с прошлым фокусом
        if (this._targetAnimal != null) {

            this._controllerAnimal.closeMenu(); //закрывает меню
            this._boxCharacteristicsAnimal.closeBox(); //закрыть бокс с характеристиками
            this._targetAnimal = null; //обнуляет ссылку на нод животного в фокусе
        }
    },


    /**
     * Перетаскивание животного началось.
     * @method onStartDragAndDropAnimal
     * @param {cc.Event} event
     */
    onStartDragAndDropAnimal: function onStartDragAndDropAnimal(event) {

        cc.log('запуск анимации подвешенности (старт перетаскивания)');
        this._targetAnimal = event.detail.animal; //Берем нод животного в фокус
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false; //заблокировать движение карты

    },


    /**
     * Перетаскивание нового животного.
     * Отвечает за перемещение нода животного по карте после создания и производит замеры до различных объектов на карте.
     * @method onDragAndDropAnimal
     * @param {cc.Event} event
     */
    onDragAndDropAnimal: function onDragAndDropAnimal(event) {

        cc.log('сообщаем корзине положение зверюшки (перетаскивание)');
        var point = this._controllerMap.getPointWindow(event.detail.point);
        this._controllerBasket.setPositionAnimal(point);
        this.nodeMaskCreatedAnimal.setPosition(point);
    },


    /**
     * Перетаскивание животного завершилось.
     * @method onStopDragAndDropAnimal
     * @param {cc.Event} event
     */
    onStopDragAndDropAnimal: function onStopDragAndDropAnimal(event) {

        cc.log('определение дальнейших действий с животным (завершение перетаскивание)');
        var point = this._controllerMap.getPointWindow(event.detail.point); //Запрашиваем точку в формате координаты окна

        if (this._controllerBasket.isAnimalLife(point)) {

            var nodeModel = cc.instantiate(this._targetAnimal.children[0]); //создаем нод животного
            nodeModel.parent = this.nodeFieldAnimals; //Вешаем нод животного на нод со всеми животными
            nodeModel.setPosition(event.detail.point.x, event.detail.point.y); //Устанавливаем позицию на карте
            nodeModel.addComponent('controller-animal'); //Добавляем контроллер телу животного
            nodeModel.getComponent('controller-animal').settings({
                puthToModel: this._targetPuthToModel,
                id: this.nodeFieldAnimals.children.length - 1
            }); //Настраивам контроллер животного
            nodeModel.getComponent('controller-animal').run(); //Запускает жизнь животного
            this._controllerBasket.onBadWorkBasket(); //Дать команду корзине(не сейчас)
        } else {
            this._controllerBasket.onGoodWorkBasket(); //Дать команду корзине(работать)
        }

        this._targetAnimal.destroy(); //Удалить временный нод животного
        this._controllerBasket.off(); //вырубить корзину
        this._boxCreateAnimal.offBlock(); //вырубить блокировку нижнего бокса
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true; //разблокировать движение карты

        this._targetAnimal = null; //обнулить  животное в таргете
        this._targetPuthToModel = null; //обнулить путь до модели животного
        this.nodeMaskCreatedAnimal.active = false;
        this._stateGame = StatGame.sleep;
    },


    /**
     * Начало движения животного.
     * @method onStartMotionAnimal
     * @param {cc.Event} event
     */
    onStartMotionAnimal: function onStartMotionAnimal(event) {
        //Закрываю меню иинформацию о животном если переключаюсь на другое животное
        if (this._targetAnimal != null && this._targetAnimal._model.id != event.detail.controller._model.id) {
            this._controllerAnimal.closeMenu(); //закрыть меню
        }

        cc.log('начинаю двигаться за пользователем(Начинаю выюор двигаться или открыть меню)');
        var point = this._controllerMap.getPointMap(event.detail.startMotion); //конвертируем точку окна к точку карты

        this._pointTargetAnimal = cc.v2(point.x, point.y); // задаем точку куда надо доставить животне
        this._controllerAnimal = event.detail.controller; //получаем контроллер животного в таргете
        this._targetAnimal = event.detail.controller; //установили нод животного на фокус

        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false; //заблокировать карту

        //увеличим поле отклика животного
        this._targetSizeWith = this._targetAnimal.node.width;
        this._targetSizeHeight = this._targetAnimal.node.height;
    },


    /**
     * Движение животного за ведущим.
     * @method onMotionAnimal
     * @param {cc.Event} event
     */
    onMotionAnimal: function onMotionAnimal(event) {
        //обработка событий с животным во время движения
        cc.log('двигаюсь за пользователем');
        //увеличим поле отклика животного
        this._targetAnimal.node.width = 2000;
        this._targetAnimal.node.height = 2000;
        var point = this._controllerMap.getPointMap(event.detail.pointEnd); // конвертируем точку окна к точке карты
        this._pointTargetAnimal = cc.v2(point.x, point.y); // вычисляем точку куда пойдет животное в итоге
        this._targetAnimal.moveToPoint(this._pointTargetAnimal);
    },


    /**
     * Окончание движения животного.
     * @method onEndMotionAnimal
     * @param {cc.Event} event
     */
    onEndMotionAnimal: function onEndMotionAnimal(event) {
        cc.log('заканчиваю двигаться за пользователем');

        //уменьшаем площадь покрытия животного
        this._targetAnimal.node.width = this._targetSizeWith;
        this._targetAnimal.node.height = this._targetSizeHeight;

        var point = this._controllerMap.getPointMap(event.detail.pointEnd); // конвертируем точку окна к точке карты
        this._pointTargetAnimal = cc.v2(point.x, point.y); // вычисляем точку куда пойдет животное в итоге
        //сообщаем модели точку до которой необходимо ей дойти
        this._targetAnimal.moveToPoint(this._pointTargetAnimal);
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true; // Разблокировали карту
    },


    /**
     * Меню животного открыто.
     * @method onOpenMenuAnimal
     * @param {cc.Event} event
     */
    onOpenMenuAnimal: function onOpenMenuAnimal(event) {
        cc.log('Открываю меню животного');
        //Центрировать животное
        var point = cc.v2(this._targetAnimal.node.x - this._centreWindowPoint.x, this._targetAnimal.node.y - this._centreWindowPoint.y);

        this._controllerMap.moveActions(point, 0.25); //переместить центр камеры на эту точку за 0.25 секунды

        //Устанавливаем настройки для меню
        this._controllerCircularMenu.settings(this._controllerAnimal);

        //заполнить бокс характеристик,,,

        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = false; //заблокировать карту
        this._stateGame = StatGame.openMenu;
    },


    /**
     * Меню животного закрыто.
     * @method onCloseMenuAnimal
     * @param {cc.Event} event
     */
    onCloseMenuAnimal: function onCloseMenuAnimal(event) {

        cc.log('Закрываю меню животного');
        this.nodeMenuAnimal.active = false;
        this.nodeBoxMap.getComponent(cc.ScrollView).enabled = true; //разблокировать карту
        this._boxCharacteristicsAnimal.closeBox();
        this._targetAnimal = null;
        this._stateGame = StatGame.sleep;
    },


    /**
     * Животное издало звук.
     * @method onVoiceAnimal
     * @param {cc.Event} event
     */
    onVoiceAnimal: function onVoiceAnimal(event) {
        cc.log('животное проявило голос');
        this._controllerAnimal.runVoice();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное село
     * @method onSitAnimal
     * @param {cc.Event} event
     */
    onSitAnimal: function onSitAnimal(event) {
        cc.log('животное село');
        this._controllerAnimal.runSit();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное испугалось
     * @method onFrightenAnimal
     * @param {cc.Event} event
     */
    onFrightenAnimal: function onFrightenAnimal(event) {
        cc.log('животное испугалось');
        this._controllerAnimal.runFrighten();
        this._controllerAnimal.closeMenu();
    },


    /**
     * ареалы чувств
     * @method onArealAnimal
     * @param {cc.Event} event
     */
    onArealAnimal: function onArealAnimal(event) {
        cc.log('животное показало свой ареал');
        this._controllerAnimal.runAreal();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное погладили,пожалели
     * @method onCareAnimal
     * @param {cc.Event} event
     */
    onCareAnimal: function onCareAnimal(event) {
        cc.log('животное погладили');
        this._controllerAnimal.runCare();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное легло
     * @method onLieAnimal
     * @param {cc.Event} event
     */
    onLieAnimal: function onLieAnimal(event) {
        cc.log('животное легло');
        this._controllerAnimal.runLie();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Животное приготовилось
     * @method onAttentionAnimal
     * @param {cc.Event} event
     */
    onAttentionAnimal: function onAttentionAnimal(event) {
        cc.log('животное приготовилось');
        this._controllerAnimal.runAttention();
        this._controllerAnimal.closeMenu();
    },


    /**
     * Бокс характристик животного открылся.
     * @method onOpenBoxFromCharacteristicsAnimal
     * @param {cc.Event} event
     */
    onOpenBoxFromCharacteristicsAnimal: function onOpenBoxFromCharacteristicsAnimal(event) {

        cc.log('открылся BoxFromCharacteristicsAnimal');
        this._boxCreateAnimal.closeBox();
        //заполняет характеристики
        var mass = this._controllerAnimal.getCharacteristics();
        var content = this._boxCharacteristicsAnimal.content;

        var nodeParam = void 0;
        //чистим предыдущие записи
        content.children.forEach(function (item) {
            item.destroy();
        });

        //Начинаем заполнение
        nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
        nodeParam.removeAllChildren();
        nodeParam.addComponent(cc.Label).string = mass.name;
        nodeParam.color = this.colorTextCharacteristics;
        content.addChild(nodeParam);

        nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
        nodeParam.removeAllChildren();
        nodeParam.addComponent(cc.Label).string = mass.currentState;
        nodeParam.color = this.colorTextCharacteristics;
        content.addChild(nodeParam);

        var vr = void 0; //временная переменная узлов
        //заполняем характеристики
        if (mass.param.length != 0) {
            for (var i = 0; i < mass.param.length; i++) {
                nodeParam = cc.instantiate(this.prefabParametrCharacteristics);
                content.addChild(nodeParam);
                nodeParam.x = 0;
                vr = nodeParam.getChildByName('name');
                vr.getComponent(cc.Label).string = mass.param[i].name;
                vr.color = this.colorTextCharacteristics;
                vr = nodeParam.getChildByName('value');
                vr.getComponent(cc.Label).string = mass.param[i].value.toString() + mass.param[i].unit;
                vr.color = this.colorTextCharacteristics;
            }
        }
    },


    /**
     * Бокс характеристик животного закрылся.
     * @method onCloseBoxFromCharacteristicsAnimal
     * @param {cc.Event} event
     */
    onCloseBoxFromCharacteristicsAnimal: function onCloseBoxFromCharacteristicsAnimal(event) {

        cc.log('закрылся BoxFromCharacteristicsAnimal');
    },


    /**
     * Корзина перешла в событие активного предвкушения.
     * @method onBasketActive
     * @param {cc.Event} event
     */
    onBasketActive: function onBasketActive(event) {

        cc.log('корзина проявляет активность');
    },


    /**
     * Корзина перешла в режим сна.
     * @method onBasketSleep
     * @param {cc.Event} event
     */
    onBasketSleep: function onBasketSleep(event) {

        cc.log('корзина спит');
    },


    /**
     * Корзина перешла в режим работы (Вот вот сбросят животное).
     * @method onBasketWork
     * @param {cc.Event} event
     */
    onBasketWork: function onBasketWork(event) {

        cc.log('корзина надеется что вот вот в нее попадет животное');
    },


    /**
     * Событие начала работы с картой.
     * @method onTouchOnMap
     * @param {cc.Event} event
     */
    onTouchOnMap: function onTouchOnMap(event) {

        cc.log('Начал работу с картой');
    },


    /**
     * Событие движения карты.
     * @method onTouchMoveOnMap
     * @param {cc.Event} event
     */
    onTouchMoveOnMap: function onTouchMoveOnMap(event) {

        cc.log('Двигает карту');
    },


    /**
     * Событие завершения работы с картой.
     * @method onTouchEndMoveOnMap
     * @param {cc.Event} event
     */
    onTouchEndMoveOnMap: function onTouchEndMoveOnMap(event) {

        if (this._stateGame === StatGame.sleep) {
            cc.log('завершил работу с картой');
        }
    },


    /**
     * Наведение центра камеры на животное завершилось.
     * @method onFinishMoveCameraToAnimal
     * @param {cc.Event} event
     */
    onFinishMoveCameraToAnimal: function onFinishMoveCameraToAnimal(event) {
        this.nodeMenuAnimal.active = true;
        this.nodeMenuAnimal.setPosition(this._centreWindowPoint.x, this._centreWindowPoint.y);
        this._boxCharacteristicsAnimal.openBox();
    }
});

cc._RFpop();
},{}]},{},["build-ts","basket-animal","box-characteristics-animal","box-create-animal","box-menu-play","box","circular-list-actions-animal","circular-list","list","controller-animal","controller-create-animal","controller-map","controller-menu-play","controller-scroll-box-characteristic","factory-animal-prefab","play"])

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvYmFza2V0cy9iYXNrZXQtYW5pbWFsLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9ib3hlcy9ib3gtY2hhcmFjdGVyaXN0aWNzLWFuaW1hbC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvYm94ZXMvYm94LWNyZWF0ZS1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2JveGVzL2JveC1tZW51LXBsYXkuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2JveGVzL2JveC1zYW1wbGVzL2JveC5qcyIsImFzc2V0cy9zY3JpcHRzL2J1aWxkL2J1aWxkLXRzLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9jaXJjdWxhci1saXN0L2NpcmN1bGFyLWxpc3QtYWN0aW9ucy1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NpcmN1bGFyLWxpc3QvY2lyY3VsYXItbGlzdC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLWFuaW1hbC5qcyIsImFzc2V0cy9zY3JpcHRzL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLWNyZWF0ZS1hbmltYWwuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1tYXAuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1tZW51LXBsYXkuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci1zY3JvbGwtYm94LWNoYXJhY3RlcmlzdGljLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9mYWN0b3J5LWFuaW1hbC1wcmVmYWIvZmFjdG9yeS1hbmltYWwtcHJlZmFiLmpzIiwiYXNzZXRzL3NjcmlwdHMvY29tcG9uZW50cy9jaXJjdWxhci1saXN0L2xpc3QuanMiLCJhc3NldHMvc2NyaXB0cy9jb21wb25lbnRzL3NjZW5lL3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFRQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBSGdCOztBQU1wQjs7Ozs7QUFLQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBSUo7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNIOzs7QUFHRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUE2Qjs7QUFDekI7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDQTtBQUNKO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSTtBQUNBO0FBRm9CO0FBSXhCO0FBQ0k7QUFDQTtBQUZrQjtBQUl0QjtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSTtBQUNBO0FBRm9CO0FBSXhCO0FBQ0k7QUFDQTtBQUZrQjtBQUl0QjtBQUNJO0FBQ0E7QUFGc0I7O0FBSzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNDO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUF5QjtBQUNyQjtBQUNBO0FBQ0g7QUFDRDtBQUF3QjtBQUNwQjtBQUNBO0FBQ0g7QUFDRDtBQUF1QjtBQUNuQjtBQUNBO0FBQ0g7QUFaTDtBQWNIO0FBQ0o7QUF4TEk7Ozs7Ozs7Ozs7QUN2QlQ7O0FBQ0E7Ozs7QUFJQTtBQUNJOztBQUVBOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUVEOzs7QUFJQTs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNIO0FBL0NtQzs7Ozs7Ozs7OztBQ0x4Qzs7QUFFQTs7OztBQUlBO0FBQ0k7O0FBRUE7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7QUE1QzBCOzs7Ozs7Ozs7O0FDSC9COztBQUNBOzs7O0FBSUE7QUFDSTs7QUFFQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFFRDs7O0FBSUE7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBR0Q7Ozs7QUFJQTtBQUNJO0FBQ0g7QUF4RHNCOzs7Ozs7Ozs7Ozs7Ozs7QUNSM0I7Ozs7Ozs7QUFPQTs7OztBQUlBO0FBQ0k7QUFDQTtBQUZhOztBQUtqQjs7Ozs7Ozs7O0FBU0E7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBSlk7QUFNaEI7Ozs7QUFJQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdKOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBRUQ7QUFDSTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7OztBQUlBOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNKOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7O0FBR0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7QUFDRztBQUNIO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDSztBQUNKO0FBQ0k7QUFDSjtBQUNEO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBR0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0k7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBQ0g7QUFDSjs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7QUE5UGM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkNuQjtBQUNBO0FBQ0k7QUFDNkQ7QUFBa0I7QUFDekQ7QUFBaUI7QUFBakI7QUFBd0Q7QUFDOUU7QUFDSTtBQUNBO0FBQWdCO0FBQXVCO0FBQ3ZDO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDSTtBQUE0QjtBQUFNO0FBQThCO0FBQWE7QUFBWTtBQUFFO0FBQzNGO0FBQTJCO0FBQU07QUFBa0M7QUFBYTtBQUFZO0FBQUU7QUFDOUY7QUFBd0I7QUFBaUU7QUFBd0I7QUFBOEI7QUFDL0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUF1QztBQUF3QztBQUEvRTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQXNJO0FBQWM7QUFDcEo7QUFBbUI7QUFBc0I7QUFBc0I7QUFBRztBQUNsRTtBQUNJO0FBQ0E7QUFBVTtBQUNOO0FBQ0E7QUFDQTtBQUNJO0FBQWdCO0FBQ2hCO0FBQVE7QUFDUjtBQUFRO0FBQ1I7QUFBUTtBQUNSO0FBQ0k7QUFBMEY7QUFBa0I7QUFDNUc7QUFBNkQ7QUFBeUI7QUFDdEY7QUFBcUM7QUFBZ0M7QUFDckU7QUFBMkI7QUFBd0M7QUFDbkU7QUFDQTtBQVhSO0FBYUE7QUFDSDtBQUFhO0FBQXFCO0FBQVc7QUFBWTtBQWpCMUQ7QUFtQkg7QUFDSjtBQUNEO0FBQ0k7QUFFQTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZnRDtBQVlwRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVm1EO0FBWXZEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWa0Q7QUFZdEQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUm9EO0FBVXhEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJvRDtBQVV4RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSMEM7QUFVOUM7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjRDO0FBVWhEO0FBRUE7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBRVE7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSjtBQUNJO0FBQ0E7QUFDQTtBQUhHO0FBS1Y7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJ5RDtBQVU3RDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVJ5RDtBQVU3RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSa0Q7QUFVdEQ7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUitEO0FBVW5FO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVIrRDtBQVVuRTtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSdUQ7QUFVM0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDQTtBQVI0QztBQVVoRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQVQyQztBQVcvQztBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQVQyQztBQVcvQztBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQVQrQztBQVduRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQVQrQztBQVduRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSNEM7QUFVaEQ7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFSNEQ7QUFVaEU7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBUjJEO0FBVS9EO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFGTztBQUlYO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0E7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0k7QUFDSTtBQUFRO0FBQ1I7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFSUjtBQVVIO0FBQ0o7QUFDSjtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQThCO0FBQW9CO0FBQ2xEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFBeUI7QUFBYztBQUN2QztBQUE2QjtBQUFvQjtBQUNqRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQXlCO0FBQWM7QUFDdkM7QUFBNkI7QUFBb0I7QUFDakQ7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQW9EO0FBQXNEO0FBQzFHO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUF5QjtBQUFjO0FBQ3ZDO0FBQTZCO0FBQW9CO0FBQ2pEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFBb0Q7QUFBeUM7QUFDN0Y7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDSTtBQUE4QjtBQUFxQjtBQUNuRDtBQUE2QjtBQUFxQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUF3QztBQUFnQztBQUMzRTtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0k7QUFDQTtBQUNJO0FBQTZCO0FBQXFCO0FBQ2xEO0FBQThCO0FBQXFCO0FBQ25EO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0g7QUFDSjtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBNkI7QUFBcUI7QUFDbEQ7QUFBOEI7QUFBcUI7QUFDbkQ7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQVJSO0FBVUg7QUFDSjtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBNkI7QUFBcUI7QUFDbEQ7QUFBOEI7QUFBcUI7QUFDbkQ7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQVJSO0FBVUg7QUFDSjtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBNkI7QUFBcUI7QUFDbEQ7QUFBOEI7QUFBcUI7QUFDbkQ7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNJO0FBQ0k7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNKO0FBQ0k7QUFDQTtBQVJSO0FBVUg7QUFDSjtBQUNKO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBOEI7QUFBcUI7QUFDbkQ7QUFBeUI7QUFBYztBQUN2QztBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSDtBQUNKO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFBNkI7QUFBcUI7QUFDbEQ7QUFBOEI7QUFBcUI7QUFDbkQ7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWc0Q7QUFZMUQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZxRDtBQVl6RDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFDSTtBQUNBO0FBQ0k7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVYrQztBQVluRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVmdEO0FBWXBEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNBO0FBVHNEO0FBVzFEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQUNJO0FBQ0E7QUFDSTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVnNEO0FBWTFEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWd0Q7QUFZNUQ7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSDtBQUNKO0FBQ0Q7QUFDQTtBQVZ5RDtBQVk3RDtBQUNJO0FBQ0k7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVnVEO0FBWTNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFWdUQ7QUFZM0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBQ0k7QUFDSTtBQUVBO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0k7QUFDSTtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0E7QUFDSDtBQUVHO0FBQ0g7QUFDSjtBQUNEO0FBQ0E7QUFkMEM7QUFnQjlDO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVm1EO0FBWXZEO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVitDO0FBWW5EO0FBQ0k7QUFDSTtBQUNJO0FBQ0g7QUFFRztBQUNIO0FBQ0o7QUFDRDtBQUNBO0FBVjhDO0FBWWxEO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBQ0Q7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQUNEO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFDRDtBQUNJO0FBQ0k7QUFDSTtBQUNIO0FBQ0o7QUFDRDtBQUNIO0FBQ0Q7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0Q7QUFDSDtBQUNEO0FBQ0g7QUFDRDtBQUNJO0FBQ0E7QUFFUTtBQUNBO0FBRko7QUFTSTtBQUNBO0FBRko7QUFRSTtBQUNBO0FBRko7QUFXSjtBQUVRO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMSTtBQUhaO0FBWUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEk7QUFIWjtBQVlJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMSTtBQUhaO0FBWUk7QUFDQTtBQUNBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxJO0FBSFo7QUFZSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEk7QUFIWjtBQVlJO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMSTtBQUhaO0FBWUo7QUFFUTtBQUNBO0FBRVE7QUFDQTtBQUNBO0FBQ0E7QUFKSjtBQUhSO0FBZUk7QUFDQTtBQUVRO0FBQ0E7QUFDQTtBQUNBO0FBSko7QUFIUjtBQWVKO0FBQ0k7QUFFUTtBQUNBO0FBQ0E7QUFISjtBQU1JO0FBQ0E7QUFDQTtBQUhKO0FBTUk7QUFDQTtBQUNBO0FBSEo7QUFNSTtBQUNBO0FBQ0E7QUFISjtBQU1KO0FBRVE7QUFDQTtBQUVRO0FBQ0E7QUFGSjtBQUtJO0FBQ0E7QUFGSjtBQUtJO0FBQ0E7QUFGSjtBQVhSO0FBa0JJO0FBQ0E7QUFFUTtBQUNBO0FBRko7QUFLSTtBQUNBO0FBRko7QUFQUjtBQWNJO0FBQ0E7QUFFUTtBQUNBO0FBRko7QUFLSTtBQUNBO0FBRko7QUFLSTtBQUNBO0FBRko7QUFYUjtBQXREQTtBQTFJRDs7QUFxTlg7Ozs7Ozs7Ozs7Ozs7OztBQ3JwREE7O0FBRUE7Ozs7O0FBS0E7QUFDSTs7QUFFQTs7Ozs7QUFLQTtBQUNJOztBQUVBO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDs7QUFFRDtBQUNIO0FBbkJvQzs7Ozs7Ozs7Ozs7Ozs7O0FDUHpDOzs7Ozs7O0FBT0E7QUFDSTtBQUNBOztBQUdKOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdKOzs7O0FBSUE7QUFDSTtBQUNBO0FBRUg7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFBcUI7O0FBQ2pCO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUk7QUFDSTtBQUNBO0FBQ0g7QUFDRztBQUNBO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0g7QUFDSjs7O0FBRUQ7Ozs7Ozs7OztBQVNBO0FBQ0k7QUFDQTtBQUNBOztBQUVBO0FBQ0k7QUFDSDtBQUNHO0FBQ0g7QUFDRztBQUNIO0FBQ0c7QUFDSDtBQUNHO0FBQ0g7O0FBRUQ7O0FBRUE7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7OztBQUtBO0FBQXlCOztBQUNyQjtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDRDtBQUNIO0FBQ0o7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7Ozs7QUFPQTtBQUNJO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0g7QUFDSjs7QUFFQTtBQUNKO0FBQ0o7OztBQUVEOzs7Ozs7O0FBT0E7QUFDSTtBQUNJO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFBdUI7O0FBQ25CO0FBQ0k7QUFDSDtBQUNKOzs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7Ozs7QUFRQTtBQUNJO0FBQ0E7QUFDQTtBQUNIO0FBdFB1Qjs7Ozs7Ozs7Ozs7O0FDaEI1Qjs7QUFDQTs7O0FBR0E7QUFDSTs7QUFFQTtBQUNJOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFHSjtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBR0Q7OztBQUdBO0FBQ0k7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFJakI7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBQ0E7QUFDSTtBQUNBO0FBRmE7QUFJakI7QUFDSDtBQUNEO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDSTtBQUNBO0FBQ0k7QUFEYTtBQUdqQjtBQUNBO0FBQ0g7QUFDRztBQUNIO0FBQ0Q7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNDO0FBRUo7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSTtBQURhO0FBR2pCO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSTtBQURhO0FBR2pCO0FBQ0g7OztBQUVEOzs7QUFHQTtBQUNJO0FBQ0E7QUFDSDs7O0FBRUQ7OztBQUdBO0FBQ0k7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0g7OztBQUVEOzs7QUFHQTs7O0FBSUE7OztBQUdBOzs7QUFJQTs7O0FBR0E7OztBQUlBOzs7QUFHQTs7O0FBSUE7OztBQUdBOzs7QUFJQTs7O0FBR0E7OztBQUlBOzs7QUFHQTs7O0FBSUE7Ozs7QUFJQTtBQUNJO0FBQ0g7QUF6T0k7Ozs7Ozs7Ozs7QUNKVDtBQUNJOztBQUVBOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7O0FBRUE7QUFDSDtBQXJESTs7Ozs7Ozs7OztBQ0FUOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBR0o7O0FBRUk7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0M7QUFDSjs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNGO0FBQ007QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUVIO0FBQ0w7QUFDQzs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQXFCOztBQUNqQjtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUE0Qjs7QUFDeEI7QUFDQTtBQUNBO0FBR0g7OztBQUVEOzs7O0FBSUE7QUFDSTtBQUNBO0FBQ0E7QUFDSDtBQXBKSTs7Ozs7Ozs7OztBQ0pUOzs7QUFHQTtBQUNJOztBQUVBOzs7QUFHQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7OztBQUlBOzs7QUFJQTs7OztBQUlBOzs7QUFJQTs7OztBQUlBO0FBaENLOzs7Ozs7Ozs7O0FDSFQ7Ozs7QUFJQTs7OztBQUlBO0FBQ0k7O0FBRUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHSjs7OztBQUlBO0FBQ0k7QUFDSDs7O0FBRUQ7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTs7O0FBSUE7Ozs7O0FBS0E7QUFBbUI7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDSTtBQUNIO0FBQ0c7QUFDSDtBQUNEO0FBQ0g7QUFDSjtBQUNKOzs7QUFFRDs7Ozs7OztBQU9BO0FBQ0k7QUFDQTtBQUNIO0FBM0U2Qzs7Ozs7Ozs7Ozs7OztBQ1JsRDtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7Ozs7QUFJQTtBQUNFO0FBQ0M7QUFDQztBQUNIOzs7QUFFRDs7OztBQUlBO0FBQWdCOztBQUNaO0FBQ0k7O0FBRUE7QUFDQTtBQUNJO0FBQ0E7QUFGYTtBQUlqQjtBQUNIO0FBQ0o7OztBQUVEOzs7Ozs7QUFNQTtBQUNJOztBQUVBO0FBQ0g7QUEvQzhCOzs7Ozs7Ozs7Ozs7QUNBbkM7O0FBRUE7Ozs7QUFJQTtBQUNJOztBQUVBO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7O0FBR0o7Ozs7QUFJQTtBQUNJO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7O0FBTUE7QUFDSTtBQUNBO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0k7QUFDSDtBQUNEO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNJO0FBRGE7QUFHakI7QUFDSDs7O0FBRUQ7Ozs7OztBQU1BO0FBQ0k7QUFDQTtBQUNBO0FBQ0E7QUFDSDtBQXZFSTs7Ozs7Ozs7OztBQ05UOzs7Ozs7Ozs7O0FBVUE7QUFDSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTGE7O0FBUWpCOzs7O0FBSUE7QUFDSTs7QUFFQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUdKOzs7O0FBSUE7QUFDSTtBQUNEO0FBQ0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBR0k7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNJO0FBQ0g7QUFFSjs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFFSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTs7QUFFSTtBQUNBO0FBQ0g7OztBQUVEOzs7Ozs7QUFNQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVJO0FBQ0E7QUFDQTtBQUVIO0FBQ0o7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDQTs7QUFHSDs7O0FBRUQ7Ozs7OztBQU1BOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7O0FBRUE7O0FBR0k7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQ0E7QUFGaUQ7QUFJckQ7QUFDQTtBQUVIO0FBQ0c7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDSTtBQUNIOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7QUFDSTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIOzs7QUFFRDs7Ozs7QUFLQTtBQUNJO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7OztBQUVEOzs7OztBQUtBOztBQUVJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0k7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDSTtBQUNJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFFSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFFSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFFSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFFSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDSDs7O0FBRUQ7Ozs7O0FBS0E7O0FBRUk7QUFDSTtBQUNIO0FBQ0o7OztBQUVEOzs7OztBQUtBO0FBQ0k7QUFDQTtBQUNBO0FBQ0g7QUFqaUJJIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEVudW0g0YHQvtGB0YLQvtGP0L3QuNC5INC60L7RgNC30LjQvdGLLlxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTdGF0ZUJhc2tldFxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2xlZXAg0LrQvtGA0LfQuNC90LAg0L/RgNC+0YHRgtC+INC+0YLQutGA0YvRgtCwLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gYWN0aXZlINGH0YPQstGB0YLQstGD0LXRgiDRh9GC0L4g0LbQuNCy0L7RgtC90L7QtSDQs9C00LUt0YLQviDRgNGP0LTQvtC8LlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gd29yayDRgNCw0LHQvtGC0LDQtdGCINGBINC/0L7Qv9Cw0LLRiNC40LzRgdGPINC20LjQstC+0YLQvdGL0LwuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqINCi0LjQv9GLINGB0L7RgdGC0L7Rj9C90LjQuSDQutC+0YDQt9C40L3Riy5cclxuICogQHR5cGUge1N0YXRlQmFza2V0fVxyXG4gKi9cclxuY29uc3QgU3RhdGVCYXNrZXQgPSB7XHJcbiAgICBzbGVlcDogMCxcclxuICAgIGFjdGl2ZTogMSxcclxuICAgIHdvcms6IDIsXHJcbn07XHJcblxyXG4vKipcclxuICog0J7RgdGD0YnQtdGB0YLQstC70Y/QtdGCINGA0LDQsdC+0YLRgyDRgSDQutC+0YDQt9C40L3QvtC5LFxyXG4gKiDQkNC90LjQvNCw0YbQuNC4LCDRh9Cw0YHRgtC40YbRiyDQuCDQv9GA0L7Rh9C10LUuXHJcbiAqIEBjbGFzcyBiYXNrZXQtYW5pbWFsXHJcbiAqL1xyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9sZWZ0UG9pbnRCb3R0b206IG51bGwsLy/Qu9C10LLQsNGPINC90LjQttC90Y/RjyDRgtC+0YfQutCwINC+0LHQu9Cw0YHRgtC4INC/0L7Qs9C70LDRidC10L3QuNGPINC20LjQstC+0YLQvdGL0YVcclxuICAgICAgICBfcmlnaHRQb2ludFRvcDogbnVsbCwvL9C/0YDQsNCy0LDRjyDQstC10YDRhdC90Y/Rj9GC0L7Rh9C60LAg0L7QsdC70LDRgdGC0Lgg0L/QvtCz0LvQsNGJ0LXQvdC40Y8g0LbQuNCy0L7RgtC90YvRhVxyXG4gICAgICAgIF9jZW50cmVQb2ludEJhc2tldDogbnVsbCwvL9GG0LXQvdGC0YDQsNC70YzQvdCw0Y8g0YLQvtGH0LrQsCDQvtCx0LvQsNGB0YLQuCDQv9C+0LPQu9Cw0YnQtdC90LjRj1xyXG4gICAgICAgIF9zdGF0ZUJhc2tldDogbnVsbCwvL9GB0L7RgdGC0L7Rj9C90LjQtSDQutC+0YDQt9C40L3Ri1xyXG5cclxuICAgICAgICBhbnRpY2lwYXRpb246IDE1MCwvL9GA0LDRgdGB0YLQvtGP0L3QuNC1INC00LvRjyDQv9GA0LjQvdGP0YLQuNGPINGB0L7RgdGC0L7Rj9C90LjQuSDQstC30LLQvtC70L3QvtCy0LDQvdC90L7RgdGC0LhcclxuICAgICAgICBvcGFjaXR5T246IDI1NSwvL9C/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQuiDQutC+0YLQvtGA0L7QuSDRgdGC0YDQtdC80LjRgtGB0Y8g0L/RgNC4INCy0LrQu9GO0YfQtdC90LjQuFxyXG4gICAgICAgIG9wYWNpdHlPZmY6IDEwLCAvL9C/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQuiDQutC+0YLQvtGA0L7QuSDRgdGC0LXQvNC40YLRgdGPINC/0L7RgdC70LUg0LLRi9C60LvRjtGH0LXQvdC40Y9cclxuICAgICAgICB0aW1lOiAxLC8v0LLRgNC10LzRjyDQt9CwINC60L7RgtC+0YDQvtC1INC/0YDQvtC40YHRhdC+0LTQuNGCINC+0YLQutGA0YvRgtC40LUg0LjQu9C4INC30LDQutGA0YvRgtC40LVcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0L3QtdC/0L7RgdGA0LXQtNGB0YLQstC10L3QvdC+INGB0YDQsNC30YMg0L/QvtGB0LvQtSDQt9Cw0LPRgNGD0LfQutC4INC60L7QvNC/0L7QvdC10L3RgtCwLlxyXG4gICAgICogQG1ldGhvZCBzdGFydFxyXG4gICAgICovXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuX3ByZXZpb3VzU3RhdHVzID0gdGhpcy5fc3RhdGVCYXNrZXQgPSBTdGF0ZUJhc2tldC5hY3RpdmU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0LfQsNC/0YPRgdGC0LjQu9Cw0YHRjC4g0JfQsNC/0YPRgdC60LDQtdGCINC60L7RgNC30LjQvdGDKNCy0LrQu9GO0YfQsNC10YIpXHJcbiAgICAgKiBAbWV0aG9kIG9uXHJcbiAgICAgKi9cclxuICAgIG9uKCl7XHJcbiAgICAgICAgLy90aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmpvYldpdGhPcGFjaXR5KHRoaXMub3BhY2l0eU9uLCB0aGlzLnRpbWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQutC70Y7Rh9C10L3QuNC1INC60L7RgNC30LjQvdGLLtCS0YvQutC70Y7Rh9Cw0LXRgiDQutC+0YDQt9C40L3Rgy5cclxuICAgICAqIEBtZXRob2Qgb2ZmXHJcbiAgICAgKi9cclxuICAgIG9mZigpe1xyXG4gICAgICAgIHRoaXMuam9iV2l0aE9wYWNpdHkodGhpcy5vcGFjaXR5T2ZmLCB0aGlzLnRpbWUpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNC10LDQutGG0LjRjyDQutC+0YDQt9C40L3RiyDQvdCwINC/0YDQuNCx0LvQuNC20LDRjtGJ0LXQtdGB0Y8g0LbQuNCy0L7RgtC90L7QtS5cclxuICAgICAqIEBtZXRob2Qgb25TdGF0dXNBY3RpdmVCYXNrZXRcclxuICAgICAqL1xyXG4gICAgb25TdGF0dXNBY3RpdmVCYXNrZXQoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnYmFza2V0QWN0aXZlJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0YHRgtC+0Y/QvdC40LUg0YHQvdCwINCy0LrQu9GO0YfQuNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvblN0YXR1c1NsZWVwQmFza2V0XHJcbiAgICAgKi9cclxuICAgIG9uU3RhdHVzU2xlZXBCYXNrZXQoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnYmFza2V0U2xlZXAnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7RgdGC0L7Rj9C90LjQtSDQu9C+0LLQu9C4INCy0LrQu9GO0YfQuNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvblN0YXR1c1dvcmtCYXNrZXRcclxuICAgICAqL1xyXG4gICAgb25TdGF0dXNXb3JrQmFza2V0KCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Jhc2tldFdvcmsnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1LSDQttC40LLQvtGC0L3QvtC1INC/0L7QudC80LDQvdC+LlxyXG4gICAgICogQG1ldGhvZCBvbkdvb2RXb3JrQmFza2V0XHJcbiAgICAgKi9cclxuICAgIG9uR29vZFdvcmtCYXNrZXQoKXtcclxuICAgICAgICBjYy5sb2coJ9CV0LAsINC20LjQstC+0YLQvdC+0LUg0L/QvtC50LzQsNC90L4gKGJhc2tldC1hbmltYWwpJyk7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVCYXNrZXQgPSBTdGF0ZUJhc2tldC53b3JrO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YXR1c0Jhc2tldCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1LSDQttC40LLQvtGC0L3QvtC1INC90LUg0L/QvtC50LzQsNC90L4uXHJcbiAgICAgKiBAbWV0aG9kIG9uQmFkV29ya0Jhc2tldFxyXG4gICAgICovXHJcbiAgICBvbkJhZFdvcmtCYXNrZXQoKXtcclxuICAgICAgICBjYy5sb2coJ9Cd0YMg0LLQvtGCINC+0L/Rj9GC0Ywg0L3QuNGH0LXQs9C+INC90LXQv9C+0LnQvNCw0LsgKGJhc2tldC1hbmltYWwpJyk7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVCYXNrZXQgPSBTdGF0ZUJhc2tldC5zbGVlcDtcclxuICAgICAgICB0aGlzLl91cGRhdGVTdGF0dXNCYXNrZXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0LHQvtGC0LDQtdGCINGBINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjNGOINGN0YLQvtC5INC60L7RgNC30LjQvdGLLiDQn9C+0YHRgtC10L/QtdC90L3QviDQv9GA0LjQsdC70LjQttCw0LXRgtGB0Y8g0Log0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtC4XHJcbiAgICAgKiDQutC+0YDQt9C40L3RiyDRgNCw0LLQvdC+0Lkg0LfQsNC00LDQvdC90L7QvNGDINC30L3QsNGH0LXQvdC40Y4g0LfQsCDQt9Cw0LTQsNC90L7QtSDQstGA0LXQvNGPLlxyXG4gICAgICogQG1ldGhvZCBqb2JXaXRoT3BhY2l0eVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG9wYWNpdHkg0L3Rg9C20L3QviDQtNC+0YHRgtC40Ycg0Y3RgtC+0Lkg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtC4XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSDQt9CwINGB0YLQvtC70YzQutC+INGB0LXQutGD0L3QtFxyXG4gICAgICovXHJcbiAgICBqb2JXaXRoT3BhY2l0eShvcGFjaXR5LCB0aW1lKXtcclxuICAgICAgICBsZXQgaW50ZXZhbEluY3JlbWVudHMgPSB0aW1lIC8gTWF0aC5hYnModGhpcy5ub2RlLm9wYWNpdHkgLSBvcGFjaXR5KTtcclxuICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5jYWxsQmFja09wYWNpdHkpO1xyXG4gICAgICAgIHRoaXMuY2FsbEJhY2tPcGFjaXR5ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLm9wYWNpdHkgPT09IG9wYWNpdHkpIHtcclxuICAgICAgICAgICAgICAgIC8vaWYgKHRoaXMubm9kZS5vcGFjaXR5IDwgMTI1KSB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5jYWxsQmFja09wYWNpdHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIChvcGFjaXR5ID4gdGhpcy5ub2RlLm9wYWNpdHkpID8gdGhpcy5ub2RlLm9wYWNpdHkgKz0gMSA6IHRoaXMubm9kZS5vcGFjaXR5IC09IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5jYWxsQmFja09wYWNpdHksIGludGV2YWxJbmNyZW1lbnRzKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0LHRg9C00LXRgiDQu9C4INC20LjRgtGMINC20LjQstC+0YLQvdC+0LUg0LjQu9C4INC+0L3QviDQstGL0LHRgNC+0YjQtdC90L4g0LIg0LrQvtGA0LfQuNC90YMuXHJcbiAgICAgKiBAbWV0aG9kIGlzQW5pbWFsTGlmZVxyXG4gICAgICogQHBhcmFtIHtjYy5WZWMyfSBwb2ludCDRgtC+0YfQutCwINC90LDRhdC+0LbQtNC10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgLSDQtdGB0LvQuCDQttC40LLQvtGC0L3QvtC1INCx0YPQtNC10YIg0LbQuNGC0YxcclxuICAgICAqL1xyXG4gICAgaXNBbmltYWxMaWZlKHBvaW50KXtcclxuICAgICAgICB0aGlzLl9sZWZ0UG9pbnRCb3R0b20gPSB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMubm9kZS54IC0gdGhpcy5ub2RlLndpZHRoLFxyXG4gICAgICAgICAgICB5OiB0aGlzLm5vZGUueSAtIHRoaXMubm9kZS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3JpZ2h0UG9pbnRUb3AgPSB7XHJcbiAgICAgICAgICAgIHg6IHRoaXMubm9kZS54ICsgdGhpcy5ub2RlLndpZHRoLFxyXG4gICAgICAgICAgICB5OiB0aGlzLm5vZGUueSArIHRoaXMubm9kZS5oZWlnaHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBYID0gcG9pbnQueCA+IHRoaXMuX2xlZnRQb2ludEJvdHRvbS54ICYmIHBvaW50LnggPCB0aGlzLl9yaWdodFBvaW50VG9wLng7XHJcbiAgICAgICAgbGV0IFkgPSBwb2ludC55ID4gdGhpcy5fbGVmdFBvaW50Qm90dG9tLnkgJiBwb2ludC55IDwgdGhpcy5fcmlnaHRQb2ludFRvcC55O1xyXG4gICAgICAgIHJldHVybiAhKFggJiYgWSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC+0LHRidCw0LXRgiDQutC+0YDQt9C40L3QtSDQv9C+0LfQuNGG0LjRjiDQttC40LLQvtGC0L3QvtCz0L4g0LTQu9GPINC/0YDQuNC90Y/RgtC40Y8g0YDQtdGI0LXQvdC40Y8g0L/QviDQstGL0LHQvtGA0YMg0LTQtdC50YHRgtCy0LjRjy4g0JrQvtGA0LfQuNC90LAg0LzQtdC90Y/QtdGCINGB0LLQvtC1INGB0L7RgdGC0L7Rj9C90LjQtVxyXG4gICAgICog0LIg0LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINGA0LDRgdGB0YLQvtGP0L3QuNGPLlxyXG4gICAgICogQG1ldGhvZCBzZXRQb3NpdGlvbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5WZWMyfSBwb2ludCDRgtC+0YfQutCwINGC0LXQutGD0YnQtdCz0L4g0LzQtdGB0YLQvtC90LDRhdC+0LbQtNC10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICovXHJcbiAgICBzZXRQb3NpdGlvbkFuaW1hbChwb2ludCl7XHJcbiAgICAgICAgdGhpcy5fbGVmdFBvaW50Qm90dG9tID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLm5vZGUueCAtIHRoaXMubm9kZS53aWR0aCxcclxuICAgICAgICAgICAgeTogdGhpcy5ub2RlLnkgLSB0aGlzLm5vZGUuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9yaWdodFBvaW50VG9wID0ge1xyXG4gICAgICAgICAgICB4OiB0aGlzLm5vZGUueCArIHRoaXMubm9kZS53aWR0aCxcclxuICAgICAgICAgICAgeTogdGhpcy5ub2RlLnkgKyB0aGlzLm5vZGUuaGVpZ2h0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9jZW50cmVQb2ludEJhc2tldCA9IHtcclxuICAgICAgICAgICAgeDogKHRoaXMuX2xlZnRQb2ludEJvdHRvbS54ICsgdGhpcy5fcmlnaHRQb2ludFRvcC54KSAvIDIsXHJcbiAgICAgICAgICAgIHk6ICh0aGlzLl9yaWdodFBvaW50VG9wLnkgKyB0aGlzLl9sZWZ0UG9pbnRCb3R0b20ueSkgLyAyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IHggPSAocG9pbnQueCAtIHRoaXMuX2NlbnRyZVBvaW50QmFza2V0LngpICogKHBvaW50LnggLSB0aGlzLl9jZW50cmVQb2ludEJhc2tldC54KTtcclxuICAgICAgICBsZXQgeSA9IChwb2ludC55IC0gdGhpcy5fY2VudHJlUG9pbnRCYXNrZXQueSkgKiAocG9pbnQueSAtIHRoaXMuX2NlbnRyZVBvaW50QmFza2V0LnkpO1xyXG4gICAgICAgIGxldCBzcXJ0UG9pbnQgPSBNYXRoLnNxcnQoeCArIHkpO1xyXG5cclxuICAgICAgICBsZXQgaXNWID0gc3FydFBvaW50IDwgdGhpcy5hbnRpY2lwYXRpb247XHJcbiAgICAgICAgKGlzVikgPyB0aGlzLl9zdGF0ZUJhc2tldCA9IFN0YXRlQmFza2V0LmFjdGl2ZSA6IHRoaXMuX3N0YXRlQmFza2V0ID0gU3RhdGVCYXNrZXQuc2xlZXA7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU3RhdHVzQmFza2V0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINGB0YLQsNGC0YPRgSDQutC+0YDQt9C40L3RiyDQuCDQstGL0LfRi9Cy0LDQtdGCINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQtNC10LnRgdGC0LLQuNC1LlxyXG4gICAgICogQG1ldGhvZCBfdXBkYXRlU3RhdHVzQmFza2V0XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfdXBkYXRlU3RhdHVzQmFza2V0KCl7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ByZXZpb3VzU3RhdHVzICE9IHRoaXMuX3N0YXRlQmFza2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ByZXZpb3VzU3RhdHVzID0gdGhpcy5fc3RhdGVCYXNrZXQ7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5fc3RhdGVCYXNrZXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgU3RhdGVCYXNrZXQuYWN0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0YXR1c0FjdGl2ZUJhc2tldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZUJhc2tldC5zbGVlcDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25TdGF0dXNTbGVlcEJhc2tldCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2FzZSBTdGF0ZUJhc2tldC53b3JrOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0YXR1c1dvcmtCYXNrZXQoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG59KTtcclxuXHJcbiIsImltcG9ydCB7IEJveCwgVHlwZUJveCB9IGZyb20gJy4vYm94LXNhbXBsZXMvYm94JztcclxuLyoqXHJcbiAqINCR0L7QutGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6INC90LUg0L/RgNC10LTQvdCw0LfQvdCw0YfQtdC9INC00LvRjyDRg9C/0YDQsNCy0LvQtdC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvFxyXG4gKiBAdHlwZSB7RnVuY3Rpb259XHJcbiAqL1xyXG52YXIgQm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsID0gY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogQm94LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10YIg0L3QsNGH0LDQu9GM0L3Ri9C1INC/0L7Qt9C40YbQuNC4INC4INC/0YDQvtC40LfQstC+0LTQuNGCINCy0YvRh9C40YHQu9C10L3QuNC1INC00LvQuNC90L3Ri1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3NldHRpbmdzKCkge1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBUeXBlQm94LmxlZnQ7XHJcbiAgICAgICAgdGhpcy50aW1lQnJpbmc9MC4xO1xyXG4gICAgICAgIGxldCBjYW52YXMgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplSW5QaXhlbHMoKTtcclxuICAgICAgICBsZXQgc2l6ZUJveFkgPSB0aGlzLl9nZXRTaXplQm94KGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMubm9kZS55ID0gc2l6ZUJveFkgLyAyICsgdGhpcy5pbmRlbnRSaWdodDtcclxuICAgICAgICB0aGlzLm5vZGUuaGVpZ2h0ID0gc2l6ZUJveFk7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIHRoaXMuX2VuZFBvcyA9IGNjLnYyKHRoaXMubm9kZS54ICsgdGhpcy5ub2RlLndpZHRoLCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy5fYW1vdW50UGl4ID0gTWF0aC5hYnModGhpcy5fZW5kUG9zLnggLSB0aGlzLl9zdGFydFBvcy54KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQvtGC0LrRgNGL0YLQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRPcGVuKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ29wZW5Cb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0LfQsNC60YDRi9C40LUg0LHQvtC60YHQsCDQsiDQutC+0L3RgtGA0L7Qu9C70LXRgNC1XHJcbiAgICAgKi9cclxuICAgIHB1Ymxpc2hFdmVudENsb3NlKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Nsb3NlQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdC+0LJcclxuICAgICAqIEBwYXJhbSB7YW55fSBkdFxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLl9vcGFjaXR5Tm9kZSh0aGlzLm5vZGUueCAtIHRoaXMuX3N0YXJ0UG9zLngpO1xyXG4gICAgfSxcclxufSk7IiwiaW1wb3J0IHsgQm94LCBUeXBlQm94IH0gZnJvbSAnLi9ib3gtc2FtcGxlcy9ib3gnO1xyXG5cclxuLyoqXHJcbiAqINCR0L7QutGBINGB0L/QuNGB0LrQsCDQttC40LLQvtGC0L3Ri9GFXHJcbiAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICovXHJcbnZhciBCb3hDcmVhdGVBbmltYWwgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBCb3gsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQo9GB0YLQsNC90LDQstC70LjQstCw0LXRgiDQvdCw0YfQsNC70YzQvdGL0LUg0L/QvtC30LjRhtC40Lgg0Lgg0L/RgNC+0LjQt9Cy0L7QtNC40YIg0LLRi9GH0LjRgdC70LXQvdC40LUg0LTQu9C40L3QvdGLXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0dGluZ3MoKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IFR5cGVCb3guYm90dG9tO1xyXG4gICAgICAgIHRoaXMudGltZUJyaW5nPTAuMjtcclxuICAgICAgICBsZXQgYmFyID0gdGhpcy5jb250ZW50O1xyXG4gICAgICAgIGxldCBjYW52YXMgPSBjYy5kaXJlY3Rvci5nZXRXaW5TaXplSW5QaXhlbHMoKTtcclxuICAgICAgICBsZXQgc2l6ZUJveFggPSB0aGlzLl9nZXRTaXplQm94KGNhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSBzaXplQm94WCAvIDIgKyB0aGlzLmluZGVudExlZnQ7XHJcbiAgICAgICAgYmFyLndpZHRoID0gc2l6ZUJveFg7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpO1xyXG4gICAgICAgIHRoaXMuX2VuZFBvcyA9IGNjLnYyKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSArIGJhci5oZWlnaHQgLSAxMCk7XHJcbiAgICAgICAgdGhpcy5fYW1vdW50UGl4ID0gTWF0aC5hYnModGhpcy5fZW5kUG9zLnkgLSB0aGlzLl9zdGFydFBvcy55KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0L7RgtC60YDRi9GC0LjQtSDQsdC+0LrRgdCwINCyINC60L7QvdGC0YDQvtC70LvQtdGA0LVcclxuICAgICAqL1xyXG4gICAgcHVibGlzaEV2ZW50T3Blbigpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdvcGVuQm94RnJvbUFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC30LDQutGA0YvRgtC40LUg0LHQvtC60YHQsCDQsiDQutC+0L3RgtGA0L7Qu9C70LXRgNC1XHJcbiAgICAgKi9cclxuICAgIHB1Ymxpc2hFdmVudENsb3NlKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ2Nsb3NlQm94RnJvbUFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdC+0LJcclxuICAgICAqIEBwYXJhbSB7YW55fSBkdFxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLl9vcGFjaXR5Tm9kZSh0aGlzLm5vZGUueSAtIHRoaXMuX3N0YXJ0UG9zLnkpO1xyXG4gICAgfSxcclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRklSQ29ycCBvbiAyOS4wMy4yMDE3LlxyXG4gKi9cclxuaW1wb3J0IHsgQm94LCBUeXBlQm94IH0gZnJvbSAnLi9ib3gtc2FtcGxlcy9ib3gnO1xyXG4vKipcclxuICog0JHQvtC60YEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40Log0L3QtSDQv9GA0LXQtNC90LDQt9C90LDRh9C10L0g0LTQu9GPINGD0L/RgNCw0LLQu9C10L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8XHJcbiAqIEB0eXBlIHtGdW5jdGlvbn1cclxuICovXHJcbnZhciBCb3hNZW51UGxheSA9IGNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IEJveCxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC90LDRh9Cw0LvRjNC90YvQtSDQv9C+0LfQuNGG0LjQuCDQuCDQv9GA0L7QuNC30LLQvtC00LjRgiDQstGL0YfQuNGB0LvQtdC90LjQtSDQtNC70LjQvdC90YtcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXR0aW5ncygpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gVHlwZUJveC5sZWZ0O1xyXG4gICAgICAgIHRoaXMudGltZUJyaW5nPTAuNjtcclxuICAgICAgICBsZXQgY2FudmFzID0gY2MuZGlyZWN0b3IuZ2V0V2luU2l6ZUluUGl4ZWxzKCk7XHJcbiAgICAgICAgbGV0IHNpemVCb3hZID0gdGhpcy5fZ2V0U2l6ZUJveChjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm5vZGUueSA9IHNpemVCb3hZIC8gMiArIHRoaXMuaW5kZW50UmlnaHQ7XHJcbiAgICAgICAgdGhpcy5ub2RlLmhlaWdodCA9IHNpemVCb3hZO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0UG9zID0gY2MudjIodGhpcy5ub2RlLngsIHRoaXMubm9kZS55KTtcclxuICAgICAgICB0aGlzLl9lbmRQb3MgPSBjYy52Mih0aGlzLm5vZGUueCArIHRoaXMubm9kZS53aWR0aCAtIDc1LCB0aGlzLm5vZGUueSk7XHJcbiAgICAgICAgdGhpcy5fYW1vdW50UGl4ID0gTWF0aC5hYnModGhpcy5fZW5kUG9zLnggLSB0aGlzLl9zdGFydFBvcy54KTtcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQutGA0YvQstCw0LXRgi/Qt9Cw0LrRgNGL0LLQsNC10YIg0LHQvtC60YFcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkNsaWNrKGV2ZW50KXtcclxuICAgICAgICB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YPQsdC70LjQutGD0LXRgiDRgdC+0LHRi9GC0LjQtSDQvtGC0LrRgNGL0YLQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRPcGVuKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ29wZW5Cb3hNZW51UGxheScsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC30LDQutGA0YvQuNC1INCx0L7QutGB0LAg0LIg0LrQvtC90YLRgNC+0LvQu9C10YDQtVxyXG4gICAgICovXHJcbiAgICBwdWJsaXNoRXZlbnRDbG9zZSgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdjbG9zZUJveE1lbnVQbGF5JywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7fTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC70Y/QtdGCINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdC+0LJcclxuICAgICAqIEBwYXJhbSB7YW55fSBkdFxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoZHQpIHtcclxuICAgICAgICB0aGlzLl9vcGFjaXR5Tm9kZSh0aGlzLm5vZGUueCAtIHRoaXMuX3N0YXJ0UG9zLngpO1xyXG4gICAgfSxcclxufSk7IiwiLyoqXHJcbiAqIEVudW0g0YHQvtGB0YLQvtGP0L3QuNC5INCx0L7QutGB0LBcclxuICogQHR5cGVkZWYge09iamVjdH0gTW92ZW1lbnRcclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHRvQ2xvc2Ug0LHQvtC60YEg0LfQsNC60YDRi9GCLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gdG9PcGVuINCx0L7QutGBINC+0YLQutGA0YvRgi5cclxuICovXHJcblxyXG4vKipcclxuICog0KHQvtGB0YLQvtGP0L3QuNC1INCx0L7QutGB0LAgKNC+0YLQutGA0YvRgi/Qt9Cw0LrRgNGL0YIpXHJcbiAqIEB0eXBlIHtNb3ZlbWVudH1cclxuICovXHJcbmNvbnN0IE1vdmVtZW50ID0ge1xyXG4gICAgdG9DbG9zZTogMCxcclxuICAgIHRvT3BlbjogMSxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbnVtINGB0L7RgdGC0L7Rj9C90LjQuSDRgNCw0LHQvtGC0Ysg0LHQvtC60YHQsFxyXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBUeXBlQm94XHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBib3R0b20g0YDQsNCx0L7RgtCwINC60LDQuiDQvdC40LbQvdC40Lkg0LHQvtC60YEuXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0b3Ag0YDQsNCx0L7RgtCwINC60LDQuiDQstC10YDRhdC90LjQuSDQsdC+0LrRgS5cclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJpZ2h0INGA0LDQsdC+0YLQsCDQutCw0Log0L/RgNCw0LLRi9C5INCx0L7QutGBLlxyXG4gKiBAcHJvcGVydHkge251bWJlcn0gbGVmdCDRgNCw0LHQvtGC0LAg0LrQsNC6INC70LXQstGLINCx0L7QutGBLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiDQotC40L8g0LHQvtC60YHQsFxyXG4gKiBAdHlwZSB7e2JvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgcmlnaHQ6IG51bWJlciwgbGVmdDogbnVtYmVyfX1cclxuICovXHJcbmNvbnN0IFR5cGVCb3ggPSB7XHJcbiAgICBib3R0b206IDAsXHJcbiAgICB0b3A6IDEsXHJcbiAgICByaWdodDogMixcclxuICAgIGxlZnQ6IDMsXHJcbn07XHJcbi8qKlxyXG4gKiDQr9C00YDQviDQsdC+0LrRgdC+0LJcclxuICogQHR5cGUge2NjLkNsYXNzfVxyXG4gKi9cclxudmFyIEJveCA9IGNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgX3N0YXJ0UG9zOiBudWxsLC8v0KHRgtCw0YDRgtC+0LLQsNGPINC/0L7Qt9C40YbQuNGPINCx0L7QutGB0LBcclxuICAgICAgICBfZW5kUG9zOiBudWxsLC8v0LrQvtC90LXRh9C90LDRjyDQv9C+0LfQuNGG0LjRjyDQsdC+0LrRgdCwXHJcbiAgICAgICAgX3R5cGU6IG51bGwsLy/RgdC+0YHRgtC+0Y/QvdC40LUg0YLQuNC/0LAg0LHQvtC60YHQsCDQsiDQutC+0YLQvtGA0L7QvCDQvtC9INGA0LDQsdC+0YLQsNC10YJcclxuICAgICAgICBfZGlyZWN0aW9uOiAxLC8vMC0g0LfQsNC60YDRi9GC0YzRgdGPIDEtINC+0YLQutGA0YvRgtGM0YHRj1xyXG4gICAgICAgIF9mbGFnQmxvY2s6IGZhbHNlLC8v0YTQu9Cw0LMg0LHQu9C+0LrQuNGA0L7QstC60LhcclxuICAgICAgICBfZmxhZ1phcHJvc0Jsb2NrOiBmYWxzZSwvL9GE0LvQsNCzINC+INC90LXQvtCx0YXQvtC00LjQvtC80YHRgtC4INCx0LvQvtC60LjRgNC+0LLQutC4XHJcbiAgICAgICAgX2Ftb3VudFBpeDogbnVsbCwvL9C/0YPRgtGMINC00LvRjyDQsdC+0LrRgdCwXHJcbiAgICAgICAgX2FjdGlvbk1vdmVCb3g6IG51bGwsLy9hY3Rpb25zINC00LLQuNC20LXQvdC40Y8g0LHQvtC60YHQsFxyXG5cclxuICAgICAgICB0aW1lQnJpbmc6IDAuMDEsLy/QktGA0LXQvNGPINC00L7QstC+0LTQsCDQsiDRgdC10LrRg9C90LTQsNGFXHJcbiAgICAgICAgY29udGVudDogY2MuTm9kZSwvL9C60L7QvdGC0LXQvdGCINC90LDQtCDQutC+0YLQvtGA0YvQvCDQvdC10L7QsdGF0L7QtNC40LzQviDQv9GA0L7QuNC30LLQtdGB0YLQuCDRgNCw0LHQvtGC0YNcclxuICAgICAgICBvcGFjaXR5Qm94OiAzMCwvL9Cf0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdCwIFxyXG4gICAgICAgIGluZGVudExlZnQ6IDUwLC8v0J7RgtGB0YLRg9C/INGB0LvQtdCy0LAgKNCyIHB4KVxyXG4gICAgICAgIGluZGVudFJpZ2h0OiA1MCwvL9Ce0YLRgdGC0YPQvyDRgdC/0YDQsNCy0LAgKNCyIHB4KVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YHRg9GJ0LXRgdGC0LLQu9GP0LXRgiDQv9C10YDQstC+0L3QsNGH0LDQu9GM0L3Rg9GOINC90LDRgdGC0YDQvtC50LrRg1xyXG4gICAgICovXHJcbiAgICBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fZ2V0UGVybWlzc2lvbk1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuX2luaXQoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQv9C10YDQtdC80LXQvdC90YvRhVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2luaXQoKXtcclxuICAgICAgICAvL9CU0LDQu9GM0L3QtdC50YjQtdC1INC00LXQudGB0YLQstC40LUg0LHQvtC60YHQsFxyXG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICB0aGlzLl9zZXR0aW5ncygpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsCDRgdGC0YDQsNGCINGC0LDRh9CwXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoU3RhcnQoZXZlbnQpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjRjyDQvdCwINC00LLQuNC20LXQvdC40LUg0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50INGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hNb3ZlKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQudG91Y2guZ2V0RGVsdGEoKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZsYWdCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXRNb3ZlbWVudChkZWx0YSkuX21vdmVCb3goZGVsdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNC1INC90LAg0LfQsNCy0LXRgNGI0LXQvdC40LUg0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50INGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmQoZXZlbnQpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2ZsYWdCbG9jaykge1xyXG4gICAgICAgICAgICB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktC60LvRjtGH0LDQtdGCINCx0LvQvtC60LjRgNC+0LLQutGDINCx0L7QutGB0LBcclxuICAgICAqL1xyXG4gICAgb25CbG9jaygpe1xyXG4gICAgICAgIHRoaXMuX2ZsYWdaYXByb3NCbG9jayA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZmxhZ0Jsb2NrID0gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0LrQu9GO0YfQsNC10YIg0LHQu9C+0LrQuNGA0L7QstC60YMg0LHQvtC60YHQsFxyXG4gICAgICovXHJcbiAgICBvZmZCbG9jaygpe1xyXG4gICAgICAgIHRoaXMuX2ZsYWdaYXByb3NCbG9jayA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2ZsYWdCbG9jayA9IGZhbHNlO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQutGA0YvQstCw0LXRgiDQsdC+0LrRgVxyXG4gICAgICovXHJcbiAgICBvcGVuQm94KCl7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC60YDRi9Cy0LDQtdGCINCx0L7QutGBXHJcbiAgICAgKi9cclxuICAgIGNsb3NlQm94KCl7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9DbG9zZTtcclxuICAgICAgICB0aGlzLl9lbmRTd2lwZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0L/RgNC10LTQtdC70Y/QtdGCINC+0LbQuNC00LDQtdC80L7QtSDRgdC+0YHRgtC+0Y/QvdC40LUg0L/QviDQvdCw0L/RgNCw0LLQu9C10L3QuNGOINC00LLQuNC20LXQvdC40Y8g0LHQvtC60YHQsFxyXG4gICAgICogQHBhcmFtIGRlbHRhINC/0YDQuNGA0LDRidC10L3QuNC1XHJcbiAgICAgKiBAcmV0dXJucyB7Qm94fSDRjdGC0L7RgiDQutC70LDRgdGBXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0TW92ZW1lbnQoZGVsdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gVHlwZUJveC50b3ApIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gZGVsdGEueSA+IDAgPyBNb3ZlbWVudC50b0Nsb3NlIDogTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fdHlwZSA9PT0gVHlwZUJveC5ib3R0b20pIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gZGVsdGEueSA8IDAgPyBNb3ZlbWVudC50b0Nsb3NlIDogTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fdHlwZSA9PT0gVHlwZUJveC5sZWZ0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbiA9IGRlbHRhLnggPCAwID8gTW92ZW1lbnQudG9DbG9zZSA6IE1vdmVtZW50LnRvT3BlbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSBkZWx0YS54ID4gMCA/IE1vdmVtZW50LnRvQ2xvc2UgOiBNb3ZlbWVudC50b09wZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNC60LAg0L3QsCDQstGL0YXQvtC0INCx0L7QutGB0LAg0LfQsCDQv9GA0LXQtNC10LvRiyDQuNC90YLQtdGA0LLQsNC70LAg0LIg0YDQtdC30YPQtNGM0YLQsNGC0LUg0LLRi9C/0L7Qu9C90LXQvdC40Y8g0LTQsNC90L3QvtCz0L4g0L/RgNC40YDQsNGJ0LXQvdC40Y8uIHRydWUt0LrQvtCz0LTQsCDQvtC9INC90LUg0LLRi9GF0L7QtNC40YJcclxuICAgICAqIEBwYXJhbSBkZWx0YSDQv9GA0LjRgNCw0YnQtdC90LjQtSDQutC+0L7RgNC00LjQvdCw0YLRi1xyXG4gICAgICogQHBhcmFtIHN0YXJ0INGB0YLQsNGA0YLQvtCy0LDRjyDQutC+0L7RgNC00LjQvdCwKNC60L7QvtGA0LTQuNC90LDRgtCwINC30LDQutGA0YvRgtC+0LPQviDQsdC+0LrRgdCwKVxyXG4gICAgICogQHBhcmFtIGVuZCDQutC+0L3QtdGH0L3QsNGPINC60L7QvtGA0LTQuNC90LDRgtCwKNC60L7QvtGA0LTQuNC90LDRgtCwINC+0YLQutGA0YvRgtC+0LPQviDQsdC+0LrRgdCwKVxyXG4gICAgICogQHBhcmFtIGN1cnJlbnQg0YLQtdC60YPRidCw0LAg0LrQvtC+0YDQtNC40L3QsNGC0LBcclxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUtINC10YHQu9C4INCx0L7QutGBINC90LUg0LLRi9GF0L7QtNC40YIg0LfQsCDQv9GA0LXQtNC10LvRi1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2lzQ2hlY2tPdXRPZlJhbmdlKGRlbHRhLCBzdGFydCwgZW5kLCBjdXJyZW50KXtcclxuICAgICAgICByZXR1cm4gc3RhcnQgPCBlbmQgPyB0aGlzLl9pc091dE9mUmFuZ2VMZWZ0Qm90dG9tKGRlbHRhLCBzdGFydCwgZW5kLCBjdXJyZW50KSA6IHRoaXMuX2lzT3V0T2ZSYW5nZVJpZ2h0VG9wKGRlbHRhLCBzdGFydCwgZW5kLCBjdXJyZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDQutCwINC90LAg0LLRi9GF0L7QtCDQu9C10LLQvtCz0L4g0Lgg0L3QuNC20L3QtdCz0L4g0LHQvtC60YHQsCDQt9CwINC/0YDQtdC00LXQu9GLINC40L3RgtC10YDQstCw0LvQsCDQsiDRgNC10LfRg9C00YzRgtCw0YLQtSDQstGL0L/QvtC70L3QtdC90LjRjyDQtNCw0L3QvdC+0LPQviDQv9GA0LjRgNCw0YnQtdC90LjRj1xyXG4gICAgICogQHBhcmFtIGRlbHRhINC/0YDQuNGA0LDRidC10L3QuNC1INC60L7QvtGA0LTQuNC90LDRgtGLXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQg0YHRgtCw0YDRgtC+0LLQsNGPINC60L7QvtGA0LTQuNC90LAo0LrQvtC+0YDQtNC40L3QsNGC0LAg0LfQsNC60YDRi9GC0L7Qs9C+INCx0L7QutGB0LApXHJcbiAgICAgKiBAcGFyYW0gZW5kINC60L7QvdC10YfQvdCw0Y8g0LrQvtC+0YDQtNC40L3QsNGC0LAo0LrQvtC+0YDQtNC40L3QsNGC0LAg0L7RgtC60YDRi9GC0L7Qs9C+INCx0L7QutGB0LApXHJcbiAgICAgKiBAcGFyYW0gY3VycmVudCDRgtC10LrRg9GJ0LDQsCDQutC+0L7RgNC00LjQvdCw0YLQsFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUtINC10YHQu9C4INCx0L7QutGBINC90LUg0LLRi9GF0L7QtNC40YIg0LfQsCDQv9GA0LXQtNC10LvRi1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2lzT3V0T2ZSYW5nZUxlZnRCb3R0b20oZGVsdGEsIHN0YXJ0LCBlbmQsIGN1cnJlbnQpe1xyXG4gICAgICAgIHJldHVybiBkZWx0YSArIGN1cnJlbnQgPiBzdGFydCAmJiBkZWx0YSArIGN1cnJlbnQgPCBlbmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/RgNC+0LLQtdGA0LrQsCDQvdCwINCy0YvRhdC+0LQg0LLQtdGA0YXQvdC10LPQviDQuCDQv9GA0LDQstC+0LPQviDQsdC+0LrRgdCwINC30LAg0L/RgNC10LTQtdC70Ysg0LjQvdGC0LXRgNCy0LDQu9CwINCyINGA0LXQt9GD0LTRjNGC0LDRgtC1INCy0YvQv9C+0LvQvdC10L3QuNGPINC00LDQvdC90L7Qs9C+INC/0YDQuNGA0LDRidC10L3QuNGPXHJcbiAgICAgKiBAcGFyYW0gZGVsdGEg0L/RgNC40YDQsNGJ0LXQvdC40LUg0LrQvtC+0YDQtNC40L3QsNGC0YtcclxuICAgICAqIEBwYXJhbSBzdGFydCDRgdGC0LDRgNGC0L7QstCw0Y8g0LrQvtC+0YDQtNC40L3QsCjQutC+0L7RgNC00LjQvdCw0YLQsCDQt9Cw0LrRgNGL0YLQvtCz0L4g0LHQvtC60YHQsClcclxuICAgICAqIEBwYXJhbSBlbmQg0LrQvtC90LXRh9C90LDRjyDQutC+0L7RgNC00LjQvdCw0YLQsCjQutC+0L7RgNC00LjQvdCw0YLQsCDQvtGC0LrRgNGL0YLQvtCz0L4g0LHQvtC60YHQsClcclxuICAgICAqIEBwYXJhbSBjdXJyZW50INGC0LXQutGD0YnQsNCwINC60L7QvtGA0LTQuNC90LDRgtCwXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZS0g0LXRgdC70Lgg0LHQvtC60YEg0L3QtSDQstGL0YXQvtC00LjRgiDQt9CwINC/0YDQtdC00LXQu9GLXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfaXNPdXRPZlJhbmdlUmlnaHRUb3AoZGVsdGEsIHN0YXJ0LCBlbmQsIGN1cnJlbnQpe1xyXG4gICAgICAgIHJldHVybiBkZWx0YSArIGN1cnJlbnQgPCBzdGFydCAmJiBkZWx0YSArIGN1cnJlbnQgPiBlbmQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQstC40LbQtdC90LjQtSDQsdC+0LrRgdCwXHJcbiAgICAgKiBAcGFyYW0ge2NjLlZlYzJ9IGRlbHRhINC/0YDQuNGA0LDRidC10L3QuNC1XHJcbiAgICAgKiBAcmV0dXJucyB7Qm94fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX21vdmVCb3goZGVsdGEpIHtcclxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gVHlwZUJveC50b3AgfHwgdGhpcy5fdHlwZSA9PT0gVHlwZUJveC5ib3R0b20pIHtcclxuICAgICAgICAgICAgKHRoaXMuX2lzQ2hlY2tPdXRPZlJhbmdlKGRlbHRhLnksIHRoaXMuX3N0YXJ0UG9zLnksIHRoaXMuX2VuZFBvcy55LCB0aGlzLm5vZGUueSkpID8gdGhpcy5ub2RlLnkgKz0gZGVsdGEueSA6IHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgKHRoaXMuX2lzQ2hlY2tPdXRPZlJhbmdlKGRlbHRhLngsIHRoaXMuX3N0YXJ0UG9zLngsIHRoaXMuX2VuZFBvcy54LCB0aGlzLm5vZGUueCkpID8gdGhpcy5ub2RlLnggKz0gZGVsdGEueCA6IHRoaXMuX2VuZFN3aXBlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0YvQv9C+0LvQvdGP0LXRgiDQsNCy0YLQviDQtNC+0LLQvtC00LrRg1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2VuZFN3aXBlKCl7XHJcbiAgICAgICAgdGhpcy5fZmxhZ0Jsb2NrID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPT09IE1vdmVtZW50LnRvQ2xvc2UgPyB0aGlzLl9icmluZyh0aGlzLl9zdGFydFBvcykgOiB0aGlzLl9icmluZyh0aGlzLl9lbmRQb3MpO1xyXG4gICAgICAgIHRoaXMuX3JlZm9jdXMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQktGL0L/QvtC70L3Rj9C10YIg0LDQstGC0L4g0LTQvtCy0L7QtCAg0LHQvtC60YHQsCDQtNC+INGE0LjQvdCw0LvRjNC90L7QuSDRgtC+0YfQutC4INC90LDQt9C90LDRh9C10L3QuNGPXHJcbiAgICAgKiBAcGFyYW0gcG9zINGC0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y9cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9icmluZyhwb3Mpe1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbk1vdmVCb3ggPSBjYy5tb3ZlVG8odGhpcy50aW1lQnJpbmcsIHBvcyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihcclxuICAgICAgICAgICAgY2Muc2VxdWVuY2UodGhpcy5fYWN0aW9uTW92ZUJveCwgY2MuY2FsbEZ1bmModGhpcy5fZmluaXNoQnJpbmcsIHRoaXMpKVxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KTRg9C90LrRhtC40Y8g0YHQuNCz0L3QsNC70LjQt9C40YDRg9GO0YnQsNGPINC+INC30LDQstC10YDRiNC10L3QuNC4INC00L7QstC+0LTQutC4INCx0L7QutGB0LBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9maW5pc2hCcmluZygpe1xyXG4gICAgICAgIGlmICghdGhpcy5fZmxhZ1phcHJvc0Jsb2NrKSB0aGlzLl9mbGFnQmxvY2sgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0L7QstC10YDRj9C10YIg0LTQtdC70LDQtdGCINC70Lgg0L7QvSDRjdGC0L4g0YHQvtCx0YvRgtC40LUg0LAg0L3QtSDQutGC0L4t0YLQviDQtNGA0YPQs9C+0Lkg0L/QviDQstC10YLQutC1INC90L7QtNC+0LIg0LTQviDQvdC10LPQvlxyXG4gICAgICogQHBhcmFtIGV2ZW50INGB0L7QsdGL0YLQuNC1XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfZ2V0UGVybWlzc2lvbk1vdmUoZXZlbnQpIHtcclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Ll9uYW1lID09PSB0aGlzLm5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uVG91Y2hNb3ZlKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YDQsNC30LzQtdGAINCx0L7QutGB0LAg0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC/0YDQvtGB0YLRgNCw0L3RgdGC0LLQsCDQvdCwINGB0YLQvtGA0L7QvdC1INC4INGD0YHQu9C+0LLQuNC5INC+0YLRgdGC0YPQv9C+0LJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGFjZSAg0YDQsNC30LzQtdGAINCx0L7QutGB0LDQtNC+INC/0YDQuNGA0LDRidC10L3QuNGPXHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDRgNCw0LfQvNC10YAg0LHQvtC60YHQsFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2dldFNpemVCb3goc3BhY2UpIHtcclxuICAgICAgICByZXR1cm4gc3BhY2UgLSB0aGlzLmluZGVudExlZnQgLSB0aGlzLmluZGVudFJpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXQvdGP0LXRgiDQtNC10LnRgdGC0LLQuNC1INC60L7RgtC+0YDQvtC1INC90LXQvtCx0YXQvtC00LjQvNC+INGB0LTQtdC70LDRgtGMINC00LDQu9GM0YjQtSDQsdC+0LrRgdGDKNC30LDQutGA0YvRgtGM0YHRjyDQuNC70Lgg0L7RgtC60YDRi9GC0YzRgdGPKS7Qn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LVcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9yZWZvY3VzKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09IE1vdmVtZW50LnRvQ2xvc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9PcGVuO1xyXG4gICAgICAgICAgICB0aGlzLnB1Ymxpc2hFdmVudENsb3NlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gTW92ZW1lbnQudG9DbG9zZTtcclxuICAgICAgICAgICAgdGhpcy5wdWJsaXNoRXZlbnRPcGVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCg0LDQsdC+0YLQsCDRgSDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0YzRjiDQsdC+0LrRgdCwLiDQmNC30LzQtdC90Y/QtdGCINC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDQsdC+0LrRgdCwINC90LAg0L7RgdC90L7QstC1INC/0L7Qu9C+0LbQtdC90LjRjyDQtdCz0L4g0L7RgtC90L7RgdC40YLQtdC70YzQvdC+INC90LDRh9Cw0LvRjNC90YvRhSDQuCDQutC+0L3QtdGH0L3Ri9GFINC60L7QvtGA0LTQuNC90LDRglxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29wYWNpdHlOb2RlKGN1cnJlbnRQb3NCb3gpIHtcclxuICAgICAgICBsZXQgb3Bhc2l0eSA9IHRoaXMub3BhY2l0eUJveCArICgoKDI1NSAtIHRoaXMub3BhY2l0eUJveCkgKiBjdXJyZW50UG9zQm94KSAvIHRoaXMuX2Ftb3VudFBpeCk7XHJcbiAgICAgICAgaWYgKG9wYXNpdHkgPiAyNTUpIHtcclxuICAgICAgICAgICAgb3Bhc2l0eSA9IDI1NTtcclxuICAgICAgICB9IGVsc2UgaWYgKG9wYXNpdHkgPCB0aGlzLm9wYWNpdHlCb3gpIHtcclxuICAgICAgICAgICAgb3Bhc2l0eSA9IHRoaXMub3BhY2l0eUJveDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSBvcGFzaXR5O1xyXG4gICAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgeyBCb3gsIE1vdmVtZW50LCBUeXBlQm94IH07IiwidmFyIFByb21pc2UgPSByZXF1aXJlKCdlczYtcHJvbWlzZScpLlByb21pc2U7XHJcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSB5W29wWzBdICYgMiA/IFwicmV0dXJuXCIgOiBvcFswXSA/IFwidGhyb3dcIiA6IFwibmV4dFwiXSkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbMCwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59O1xyXG52YXIgQVBJQ29yZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBBUElDb3JlKCkge1xyXG4gICAgfVxyXG4gICAgQVBJQ29yZS5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW5zdCkge1xyXG4gICAgICAgICAgICB0aGlzLmluc3QgPSBuZXcgQVBJQ29yZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0O1xyXG4gICAgfTtcclxuICAgIEFQSUNvcmUucHJvdG90eXBlLmNyZWF0ZUFuaW1hbCA9IGZ1bmN0aW9uIChwdXRUb01vZGVsLCBpZCkge1xyXG4gICAgICAgIHZhciBmYWN0b3J5ID0gQW5pbWFscy5BbmltYWxCdWlsZGVyLmluc3RhbmNlKCk7XHJcbiAgICAgICAgdmFyIGFuaW1hbDtcclxuICAgICAgICBhbmltYWwgPSBmYWN0b3J5LmNyZWF0ZShsaW9uKTtcclxuICAgICAgICBhbmltYWwuaWQgPSBpZDtcclxuICAgICAgICByZXR1cm4gYW5pbWFsO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBBUElDb3JlO1xyXG59KCkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgQW5pbWFsQnVpbGRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gQW5pbWFsQnVpbGRlcigpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgQW5pbWFsQnVpbGRlci5pbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmluc3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5zdCA9IG5ldyBBbmltYWxCdWlsZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIucHJvdG90eXBlLmNyZWF0ZVN5c3RlbXMgPSBmdW5jdGlvbiAoc3lzdGVtcykge1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgZmFjdG9yeSA9IEFuaW1hbHMuU3lzdGVtcy5TeXN0ZW1GYWN0b3J5Lmluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgIHZhciBtYXMgPSBbXTtcclxuICAgICAgICAgICAgc3lzdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBtYXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2NhbGVzVHlwZS5mb3JFYWNoKGZ1bmN0aW9uIChzYykge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hc1tzYy50eXBlXSA9IF90aGlzLm1hc1NjYWxlc1tzYy50eXBlXTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubWFzU3lzdGVtc1tpdGVtLnR5cGVdID0gZmFjdG9yeS5jcmVhdGUoaXRlbS50eXBlLCBtYXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWxCdWlsZGVyLnByb3RvdHlwZS5jcmVhdGVTY2FsZXMgPSBmdW5jdGlvbiAoc2NhbGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBmYWN0b3J5ID0gQW5pbWFscy5TY2FsZXMuU2NhbGVGYWN0b3J5Lmluc3RhbmNlKCk7XHJcbiAgICAgICAgICAgIHNjYWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZVNjYWxlID0gaXRlbS50eXBlU2NhbGUsIHR5cGUgPSBpdGVtLnR5cGUsIHBhcmFtcyA9IGl0ZW0ucGFyYW1zO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubWFzU2NhbGVzW3R5cGVdID0gZmFjdG9yeS5jcmVhdGUodHlwZVNjYWxlLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBBbmltYWxCdWlsZGVyLnByb3RvdHlwZS5jcmVhdGVDb21tdW5pY2F0b3IgPSBmdW5jdGlvbiAoY29tbXVub2NhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgY29tbXVuaWNhdG9yQnVpbGQgPSBuZXcgQW5pbWFscy5Db21tdW5pY2F0aW9ucy5Db21tdW5pY2F0b3JCdWlsZGVyKHRoaXMubWFzU2NhbGVzKTtcclxuICAgICAgICAgICAgY29tbXVub2NhdGlvbi5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBjb21tdW5pY2F0b3JCdWlsZC5hZGQoaXRlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tbXVuaWNhdG9yQnVpbGQuYnVpbGQoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIucHJvdG90eXBlLmNyZWF0ZVN0YXRlcyA9IGZ1bmN0aW9uIChzdGF0ZXMpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGZhY3RvcnkgPSBBbmltYWxzLlN0YXRlTWFjaGluZS5TdGF0ZUZhY3RvcnkuaW5zdGFuY2UoKTtcclxuICAgICAgICAgICAgdmFyIHBhcmFtU3RhdGUgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzLnN0YXRlLCBsaW5rcyA9IHN0YXRlcy5saW5rcztcclxuICAgICAgICAgICAgc3RhdGUuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1TdGF0ZVtpdGVtLnR5cGVdID0gZmFjdG9yeS5jcmVhdGUoaXRlbS50eXBlLCBpdGVtLm5hbWUsIF90aGlzLl9hbmltYWwsIGl0ZW0uaXNFbmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hc3NTdGF0ZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGl0ZW0ubGluay5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hc3NTdGF0ZXMucHVzaChuZXcgQW5pbWFscy5TdGF0ZU1hY2hpbmUuUm91dGUocGFyYW1TdGF0ZVtzdGF0ZS50eXBlXSwgZnVuY3Rpb24gKG1vZGVsLCBwcm9iYWJpbGl0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUucHJvYmFiaWxpdHkgPiBwcm9iYWJpbGl0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcGFyYW1TdGF0ZVtpdGVtLnR5cGVdLnNldFJvdXRlRW5naW5lKG5ldyBBbmltYWxzLlN0YXRlTWFjaGluZS5Qcm9iYWJpbGl0eVJvdXRlRW5naW5lKG1hc3NTdGF0ZXMpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5pbWFscy5TdGF0ZU1hY2hpbmUuU3RhdGVNYWNoaW5lKHBhcmFtU3RhdGVbQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5zdGFydExpZmVdKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIEFuaW1hbEJ1aWxkZXIucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IG1vZGVsLm5hbWUsIHN5c3RlbXMgPSBtb2RlbC5zeXN0ZW1zLCBzY2FsZXMgPSBtb2RlbC5zY2FsZXMsIGNvbW11bmljYXRpb24gPSBtb2RlbC5jb21tdW5pY2F0aW9uLCBzdGF0ZXMgPSBtb2RlbC5zdGF0ZXM7XHJcbiAgICAgICAgICAgIHRoaXMubWFzU2NhbGVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMubWFzU3lzdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgY29tbXVuaWNhdG9yID0gdGhpcy5jcmVhdGVTY2FsZXMoc2NhbGVzKS5jcmVhdGVTeXN0ZW1zKHN5c3RlbXMpLmNyZWF0ZUNvbW11bmljYXRvcihjb21tdW5pY2F0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5fYW5pbWFsID0gbmV3IEFuaW1hbHMuQW5pbWFsKHRoaXMubWFzU3lzdGVtcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hbC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgdGhpcy5fYW5pbWFsLnN0YXRlTWFjaGluZSA9IHRoaXMuY3JlYXRlU3RhdGVzKHN0YXRlcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1hbC5jb21tdW5pY2F0b3IgPSBjb21tdW5pY2F0b3I7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYWw7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gQW5pbWFsQnVpbGRlcjtcclxuICAgIH0oKSk7XHJcbiAgICBBbmltYWxzLkFuaW1hbEJ1aWxkZXIgPSBBbmltYWxCdWlsZGVyO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEFuaW1hbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gQW5pbWFsKHBhcmFtcykge1xyXG4gICAgICAgICAgICB0aGlzLm11c2N1bGFyID0gcGFyYW1zW0FuaW1hbHMuU3lzdGVtcy5TeXN0ZW1UeXBlcy5tdXNjdWxhcl07XHJcbiAgICAgICAgICAgIHRoaXMuY2lyY3VsYXRvcnkgPSBwYXJhbXNbQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLmNpcmN1bGF0b3J5XTtcclxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uID0gcGFyYW1zW0FuaW1hbHMuU3lzdGVtcy5TeXN0ZW1UeXBlcy5uYXZpZ2F0aW9uXTtcclxuICAgICAgICAgICAgdGhpcy5tdXNjdWxhci5fbGlua1RvQW5pbWFsID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5jaXJjdWxhdG9yeS5fbGlua1RvQW5pbWFsID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5uYXZpZ2F0aW9uLl9saW5rVG9BbmltYWwgPSB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQW5pbWFsLnByb3RvdHlwZSwgXCJtdXNjdWxhclwiLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX211c2N1bGFyO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbXVzY3VsYXIgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFuaW1hbC5wcm90b3R5cGUsIFwiY2lyY3VsYXRvcnlcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaXJjdWxhdG9yeTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NpcmN1bGF0b3J5ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcIm5hdmlnYXRpb25cIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYXZpZ2F0aW9uO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdGlvbiA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQW5pbWFsLnByb3RvdHlwZSwgXCJjb21tdW5pY2F0b3JcIiwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb21tdW5pY2F0b3I7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21tdW5pY2F0b3IgPSBwYXJhbTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFuaW1hbC5wcm90b3R5cGUsIFwic3RhdGVNYWNoaW5lXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVNYWNoaW5lO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGVNYWNoaW5lID0gcGFyYW07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBbmltYWwucHJvdG90eXBlLCBcImlkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pZCA9IHBhcmFtO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQW5pbWFsLnByb3RvdHlwZSwgXCJuYW1lXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25hbWUgPSBwYXJhbTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgQW5pbWFsLnByb3RvdHlwZS5tb3ZlVG9Qb2ludCA9IGZ1bmN0aW9uIChwb2ludCkge1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQW5pbWFsLnByb3RvdHlwZS5ydW5MaWZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdGVNYWNoaW5lLnJ1bigpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgQW5pbWFsLnByb3RvdHlwZS5nZXRDaGFyYWN0ZXJpc3RpY3MgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9Ch0LrQvtGA0L7RgdGC0YwnLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA4OSxcclxuICAgICAgICAgICAgICAgICAgICB1bml0OiAn0Lwv0YEnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0JLQvtC30YDQsNGB0YInLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAxMixcclxuICAgICAgICAgICAgICAgICAgICB1bml0OiAn0LvQtdGCJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9CS0LXRgScsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuaXQ6ICfQutCzJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ9CS0YvQvdC+0YHQu9C40LLQvtGB0YLRjCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDEyLFxyXG4gICAgICAgICAgICAgICAgICAgIHVuaXQ6ICfQtdC0LicsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICfQodC40YHRgtC10LzQsCDQutGA0L7QstC+0L7QsdGA0LDRidC10L3QuNGPJyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogODksXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdDogJyUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0KHQuNGB0YLQtdC80LAg0L/QsNC80Y/RgtC4JyxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogNTksXHJcbiAgICAgICAgICAgICAgICAgICAgdW5pdDogJyUnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAn0KHQuNGB0YLQtdC80LAg0LTRi9GF0LDQvdC40Y8nLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiA4OSxcclxuICAgICAgICAgICAgICAgICAgICB1bml0OiAnJScsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiB0aGlzLl9uYW1lLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlOiAn0JHQtdCz0YMnLFxyXG4gICAgICAgICAgICAgICAgcGFyYW06IHBhcmFtcyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBBbmltYWw7XHJcbiAgICB9KCkpO1xyXG4gICAgQW5pbWFscy5BbmltYWwgPSBBbmltYWw7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgQ29tbXVuaWNhdGlvbnM7XHJcbiAgICAoZnVuY3Rpb24gKENvbW11bmljYXRpb25zKSB7XHJcbiAgICAgICAgdmFyIENvbW11bmljYXRvciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIENvbW11bmljYXRvcigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25ldExpbmtzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZW5zaXRpdml0eSA9IDAuMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29tbXVuaWNhdG9yLnByb3RvdHlwZSwgXCJzZW5zaXRpdml0eVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Vuc2l0aXZpdHk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZW5zaXRpdml0eSA9IHBhcmFtID8gcGFyYW0gOiAwLjE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgQ29tbXVuaWNhdG9yLnByb3RvdHlwZS5zZXR0aW5nID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5zaXRpdml0eSA9IHBhcmFtcy5zZW5zaXRpdml0eSB8fCAwLjE7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENvbW11bmljYXRvci5wcm90b3R5cGUuYWRkTGluayA9IGZ1bmN0aW9uIChldmVudCwgbGluaykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX25ldExpbmtzW2V2ZW50XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25ldExpbmtzW2V2ZW50XS5wdXNoKGxpbmspO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV0TGlua3NbZXZlbnRdID0gW2xpbmtdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDb21tdW5pY2F0b3IucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbiAocGFjaywgcGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlua3MgPSB0aGlzLl9uZXRMaW5rc1twYWNrLnR5cGVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpbmtzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAobGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVsdGEgPSBsaW5rLmZ1bi5jYWxjdWxhdGUocGFyYW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZGVsdGEpID4gX3RoaXMuX3NlbnNpdGl2aXR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWx0YSA9IHBhY2suYmVoYXZpb3IgPT09IGxpbmsuYmVoYXZpb3IgPyBkZWx0YSA6IC1kZWx0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsuc2NhbGUuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tbXVuaWNhdG9yO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgQ29tbXVuaWNhdGlvbnMuQ29tbXVuaWNhdG9yID0gQ29tbXVuaWNhdG9yO1xyXG4gICAgfSkoQ29tbXVuaWNhdGlvbnMgPSBBbmltYWxzLkNvbW11bmljYXRpb25zIHx8IChBbmltYWxzLkNvbW11bmljYXRpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBDb21tdW5pY2F0aW9ucztcclxuICAgIChmdW5jdGlvbiAoQ29tbXVuaWNhdGlvbnMpIHtcclxuICAgICAgICB2YXIgQmVoYXZpb3JTY2FsZVR5cGVzO1xyXG4gICAgICAgIChmdW5jdGlvbiAoQmVoYXZpb3JTY2FsZVR5cGVzKSB7XHJcbiAgICAgICAgICAgIEJlaGF2aW9yU2NhbGVUeXBlc1tCZWhhdmlvclNjYWxlVHlwZXNbXCJpbmNyZWFzZVwiXSA9IDFdID0gXCJpbmNyZWFzZVwiO1xyXG4gICAgICAgICAgICBCZWhhdmlvclNjYWxlVHlwZXNbQmVoYXZpb3JTY2FsZVR5cGVzW1wiZGVjcmVhc2VcIl0gPSAyXSA9IFwiZGVjcmVhc2VcIjtcclxuICAgICAgICB9KShCZWhhdmlvclNjYWxlVHlwZXMgPSBDb21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMgfHwgKENvbW11bmljYXRpb25zLkJlaGF2aW9yU2NhbGVUeXBlcyA9IHt9KSk7XHJcbiAgICB9KShDb21tdW5pY2F0aW9ucyA9IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMgfHwgKEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIENvbW11bmljYXRpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChDb21tdW5pY2F0aW9ucykge1xyXG4gICAgICAgIHZhciBDb21tdW5pY2F0b3JCdWlsZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQ29tbXVuaWNhdG9yQnVpbGRlcihzY2FsZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NjYWxlcyA9IHNjYWxlcztcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW11bmljYXRvciA9IG5ldyBDb21tdW5pY2F0aW9ucy5Db21tdW5pY2F0b3IoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcnlGdW5jdGlvbiA9IEFuaW1hbHMuRnVuY3Rpb25zLkZ1bmN0aW9uRmFjdG9yeS5pbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIENvbW11bmljYXRvckJ1aWxkZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHBhcmFtLmxpbmsuZm9yRWFjaChmdW5jdGlvbiAoY29tbXVuaWNhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gY29tbXVuaWNhdGlvbi50eXBlLCBiZWhhdmlvciA9IGNvbW11bmljYXRpb24uYmVoYXZpb3IsIGZ1bmN0aW9ucyA9IGNvbW11bmljYXRpb24uZnVuY3Rpb25zLCBwYXJhbXMgPSBjb21tdW5pY2F0aW9uLnBhcmFtcztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc2NhbGUgPSBfdGhpcy5fc2NhbGVzW3R5cGVdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW4gPSBfdGhpcy5fY3JlYXRlRnVuY3Rpb24oZnVuY3Rpb25zLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9jb21tdW5pY2F0b3IuYWRkTGluayhwYXJhbS50eXBlLCB7IHNjYWxlOiBzY2FsZSwgYmVoYXZpb3I6IGJlaGF2aW9yLCBmdW46IGZ1biB9KTtcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZS5jb21tdW5pY2F0b3IgPSBfdGhpcy5fY29tbXVuaWNhdG9yO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ29tbXVuaWNhdG9yQnVpbGRlci5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29tbXVuaWNhdG9yO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBDb21tdW5pY2F0b3JCdWlsZGVyLnByb3RvdHlwZS5fY3JlYXRlRnVuY3Rpb24gPSBmdW5jdGlvbiAodHlwZSwgcGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmFjdG9yeUZ1bmN0aW9uLmNyZWF0ZSh0eXBlLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQ29tbXVuaWNhdG9yQnVpbGRlcjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIENvbW11bmljYXRpb25zLkNvbW11bmljYXRvckJ1aWxkZXIgPSBDb21tdW5pY2F0b3JCdWlsZGVyO1xyXG4gICAgfSkoQ29tbXVuaWNhdGlvbnMgPSBBbmltYWxzLkNvbW11bmljYXRpb25zIHx8IChBbmltYWxzLkNvbW11bmljYXRpb25zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBGdW5jdGlvbnM7XHJcbiAgICAoZnVuY3Rpb24gKEZ1bmN0aW9ucykge1xyXG4gICAgICAgIHZhciBGdW5jdGlvbkZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBGdW5jdGlvbkZhY3RvcnkoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1tGdW5jdGlvbnMuRnVuY3Rpb25UeXBlcy5saW5lXSA9IEZ1bmN0aW9ucy5MaW5lRnVuY3Rpb247XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbRnVuY3Rpb25zLkZ1bmN0aW9uVHlwZXMucXVhZHJhdGljXSA9IEZ1bmN0aW9ucy5RdWFkcmF0aWNGdW5jdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBGdW5jdGlvbkZhY3RvcnkuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgRnVuY3Rpb25GYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIEZ1bmN0aW9uRmFjdG9yeS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHR5cGUsIHN5c3RlbSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW3R5cGVdID0gc3lzdGVtO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBGdW5jdGlvbkZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChmdW5jdGlvblR5cGUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLl9mYWN0b3JpZXNbZnVuY3Rpb25UeXBlXShwYXJhbXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gRnVuY3Rpb25GYWN0b3J5O1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgRnVuY3Rpb25zLkZ1bmN0aW9uRmFjdG9yeSA9IEZ1bmN0aW9uRmFjdG9yeTtcclxuICAgIH0pKEZ1bmN0aW9ucyA9IEFuaW1hbHMuRnVuY3Rpb25zIHx8IChBbmltYWxzLkZ1bmN0aW9ucyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgRnVuY3Rpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChGdW5jdGlvbnMpIHtcclxuICAgICAgICB2YXIgRnVuY3Rpb25UeXBlcztcclxuICAgICAgICAoZnVuY3Rpb24gKEZ1bmN0aW9uVHlwZXMpIHtcclxuICAgICAgICAgICAgRnVuY3Rpb25UeXBlc1tGdW5jdGlvblR5cGVzW1wibGluZVwiXSA9IDFdID0gXCJsaW5lXCI7XHJcbiAgICAgICAgICAgIEZ1bmN0aW9uVHlwZXNbRnVuY3Rpb25UeXBlc1tcInF1YWRyYXRpY1wiXSA9IDJdID0gXCJxdWFkcmF0aWNcIjtcclxuICAgICAgICB9KShGdW5jdGlvblR5cGVzID0gRnVuY3Rpb25zLkZ1bmN0aW9uVHlwZXMgfHwgKEZ1bmN0aW9ucy5GdW5jdGlvblR5cGVzID0ge30pKTtcclxuICAgIH0pKEZ1bmN0aW9ucyA9IEFuaW1hbHMuRnVuY3Rpb25zIHx8IChBbmltYWxzLkZ1bmN0aW9ucyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgRnVuY3Rpb25zO1xyXG4gICAgKGZ1bmN0aW9uIChGdW5jdGlvbnMpIHtcclxuICAgICAgICB2YXIgTGluZUZ1bmN0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gTGluZUZ1bmN0aW9uKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnQgPSBwYXJhbXNbMF0gfHwgMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyZWUgPSBwYXJhbXNbMV0gfHwgMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTGluZUZ1bmN0aW9uLnByb3RvdHlwZSwgXCJjb2VmZmljaWVudFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2VmZmljaWVudCA9IHBhcmFtID8gcGFyYW0gOiAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShMaW5lRnVuY3Rpb24ucHJvdG90eXBlLCBcImZyZWVcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZyZWU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcmVlID0gcGFyYW0gPyBwYXJhbSA6IDA7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgTGluZUZ1bmN0aW9uLnByb3RvdHlwZS5jYWxjdWxhdGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2VmZmljaWVudCAqIHBhcmFtICsgdGhpcy5fZnJlZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIExpbmVGdW5jdGlvbjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIEZ1bmN0aW9ucy5MaW5lRnVuY3Rpb24gPSBMaW5lRnVuY3Rpb247XHJcbiAgICB9KShGdW5jdGlvbnMgPSBBbmltYWxzLkZ1bmN0aW9ucyB8fCAoQW5pbWFscy5GdW5jdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIEZ1bmN0aW9ucztcclxuICAgIChmdW5jdGlvbiAoRnVuY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIFF1YWRyYXRpY0Z1bmN0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gUXVhZHJhdGljRnVuY3Rpb24ocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2VmZmljaWVudEEgPSBwYXJhbXNbMF0gfHwgMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvZWZmaWNpZW50QiA9IHBhcmFtc1sxXSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZnJlZSA9IHBhcmFtc1syXSB8fCAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRdWFkcmF0aWNGdW5jdGlvbi5wcm90b3R5cGUsIFwiY29lZmZpY2llbnRBXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2VmZmljaWVudEE7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2VmZmljaWVudEEgPSBwYXJhbSA/IHBhcmFtIDogMDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUXVhZHJhdGljRnVuY3Rpb24ucHJvdG90eXBlLCBcImNvZWZmaWNpZW50QlwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29lZmZpY2llbnRCO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29lZmZpY2llbnRCID0gcGFyYW0gPyBwYXJhbSA6IDA7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFF1YWRyYXRpY0Z1bmN0aW9uLnByb3RvdHlwZSwgXCJmcmVlXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mcmVlO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJlZSA9IHBhcmFtID8gcGFyYW0gOiAwO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFF1YWRyYXRpY0Z1bmN0aW9uLnByb3RvdHlwZS5jYWxjdWxhdGUgPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2VmZmljaWVudEEgKiAoTWF0aC5wb3cocGFyYW0sIDIpKSArIHRoaXMuX2NvZWZmaWNpZW50QiAqIHBhcmFtICsgdGhpcy5fZnJlZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFF1YWRyYXRpY0Z1bmN0aW9uO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgRnVuY3Rpb25zLlF1YWRyYXRpY0Z1bmN0aW9uID0gUXVhZHJhdGljRnVuY3Rpb247XHJcbiAgICB9KShGdW5jdGlvbnMgPSBBbmltYWxzLkZ1bmN0aW9ucyB8fCAoQW5pbWFscy5GdW5jdGlvbnMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFNjYWxlcztcclxuICAgIChmdW5jdGlvbiAoU2NhbGVzKSB7XHJcbiAgICAgICAgdmFyIFNjYWxlVHlwZXM7XHJcbiAgICAgICAgKGZ1bmN0aW9uIChTY2FsZVR5cGVzKSB7XHJcbiAgICAgICAgICAgIFNjYWxlVHlwZXNbU2NhbGVUeXBlc1tcInN5c3RlbVwiXSA9IDBdID0gXCJzeXN0ZW1cIjtcclxuICAgICAgICAgICAgU2NhbGVUeXBlc1tTY2FsZVR5cGVzW1wiYXJndW1lbnRcIl0gPSAxXSA9IFwiYXJndW1lbnRcIjtcclxuICAgICAgICB9KShTY2FsZVR5cGVzID0gU2NhbGVzLlNjYWxlVHlwZXMgfHwgKFNjYWxlcy5TY2FsZVR5cGVzID0ge30pKTtcclxuICAgICAgICB2YXIgUGFyYW1ldGVyU2NhbGVUeXBlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFBhcmFtZXRlclNjYWxlVHlwZXMpIHtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wic3RhdGVcIl0gPSAxXSA9IFwic3RhdGVcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wic3BlZWRcIl0gPSAyXSA9IFwic3BlZWRcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wid2VpZ2h0XCJdID0gM10gPSBcIndlaWdodFwiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJoZWFydGJlYXRcIl0gPSA0XSA9IFwiaGVhcnRiZWF0XCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcInByZXNzdXJlXCJdID0gNV0gPSBcInByZXNzdXJlXCI7XHJcbiAgICAgICAgICAgIFBhcmFtZXRlclNjYWxlVHlwZXNbUGFyYW1ldGVyU2NhbGVUeXBlc1tcImFtb3VudFBvaW50UmVtZW1iZXJXYXRlclwiXSA9IDZdID0gXCJhbW91bnRQb2ludFJlbWVtYmVyV2F0ZXJcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wiYW1vdW50UG9pbnRSZW1lbWJlckdyYXNzXCJdID0gN10gPSBcImFtb3VudFBvaW50UmVtZW1iZXJHcmFzc1wiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJhbW91bnRQb2ludFJlbWVtYmVyTWVhdFwiXSA9IDhdID0gXCJhbW91bnRQb2ludFJlbWVtYmVyTWVhdFwiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJzcGVlZFNhdnZ5XCJdID0gOV0gPSBcInNwZWVkU2F2dnlcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wicmFkaXVzVmlzaW9uXCJdID0gMTBdID0gXCJyYWRpdXNWaXNpb25cIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wicmFkaXVzSGVhcmluZ1wiXSA9IDExXSA9IFwicmFkaXVzSGVhcmluZ1wiO1xyXG4gICAgICAgICAgICBQYXJhbWV0ZXJTY2FsZVR5cGVzW1BhcmFtZXRlclNjYWxlVHlwZXNbXCJyYWRpdXNTbWVsbFwiXSA9IDEyXSA9IFwicmFkaXVzU21lbGxcIjtcclxuICAgICAgICAgICAgUGFyYW1ldGVyU2NhbGVUeXBlc1tQYXJhbWV0ZXJTY2FsZVR5cGVzW1wicmFkaXVzVG91Y2hcIl0gPSAxM10gPSBcInJhZGl1c1RvdWNoXCI7XHJcbiAgICAgICAgfSkoUGFyYW1ldGVyU2NhbGVUeXBlcyA9IFNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzIHx8IChTY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcyA9IHt9KSk7XHJcbiAgICB9KShTY2FsZXMgPSBBbmltYWxzLlNjYWxlcyB8fCAoQW5pbWFscy5TY2FsZXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFNjYWxlcztcclxuICAgIChmdW5jdGlvbiAoU2NhbGVzKSB7XHJcbiAgICAgICAgdmFyIEFTY2FsZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIEFTY2FsZSgpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQVNjYWxlLnByb3RvdHlwZSwgXCJuYW1lXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcIm1pblwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWluO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWluID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRQZXJjZW50YWdlSW5TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcIm1heFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWF4O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF4ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRQZXJjZW50YWdlSW5TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcImN1cnJlbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRQZXJjZW50YWdlSW5TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBU2NhbGUucHJvdG90eXBlLCBcInBlcmNlbnRcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BlcmNlbnQ7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wZXJjZW50ID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VmFsdWVPblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFTY2FsZS5wcm90b3R5cGUsIFwidHlwZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3R5cGUgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBBU2NhbGUucHJvdG90eXBlLmdldFBlcmNlbnRhZ2VJblNjYWxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyY2VudCA9ICgodGhpcy5fY3VycmVudCAtIHRoaXMuX21pbikgKiAxMDApIC8gKHRoaXMuX21heCAtIHRoaXMuX21pbik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIEFTY2FsZS5wcm90b3R5cGUuZ2V0Q3VycmVudFZhbHVlT25TY2FsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSAoKCh0aGlzLl9tYXggLSB0aGlzLl9taW4pIC8gMTAwKSAqIHRoaXMuX3BlcmNlbnQpICsgdGhpcy5fbWluO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQVNjYWxlO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU2NhbGVzLkFTY2FsZSA9IEFTY2FsZTtcclxuICAgIH0pKFNjYWxlcyA9IEFuaW1hbHMuU2NhbGVzIHx8IChBbmltYWxzLlNjYWxlcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU2NhbGVzO1xyXG4gICAgKGZ1bmN0aW9uIChTY2FsZXMpIHtcclxuICAgICAgICB2YXIgU2NhbGVGYWN0b3J5ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gU2NhbGVGYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU2NhbGVzLlNjYWxlVHlwZXMuc3lzdGVtXSA9IEFuaW1hbHMuU2NhbGVzLlN5c3RlbVNjYWxlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1NjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50XSA9IEFuaW1hbHMuU2NhbGVzLkFyZ3VtZW50U2NhbGU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU2NhbGVGYWN0b3J5Lmluc3RhbmNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IFNjYWxlRmFjdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTY2FsZUZhY3RvcnkucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0eXBlLCBzeXN0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3Rvcmllc1t0eXBlXSA9IHN5c3RlbTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU2NhbGVGYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoZnVuY3Rpb25UeXBlLCBwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcy5fZmFjdG9yaWVzW2Z1bmN0aW9uVHlwZV0ocGFyYW1zKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFNjYWxlRmFjdG9yeTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFNjYWxlcy5TY2FsZUZhY3RvcnkgPSBTY2FsZUZhY3Rvcnk7XHJcbiAgICB9KShTY2FsZXMgPSBBbmltYWxzLlNjYWxlcyB8fCAoQW5pbWFscy5TY2FsZXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFNjYWxlcztcclxuICAgIChmdW5jdGlvbiAoU2NhbGVzKSB7XHJcbiAgICAgICAgdmFyIEFyZ3VtZW50U2NhbGUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoQXJndW1lbnRTY2FsZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gQXJndW1lbnRTY2FsZShwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fbmFtZSA9IHBhcmFtcy5uYW1lIHx8IFwiTm8gbmFtZVwiO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX21pbiA9IHBhcmFtcy5taW4gfHwgMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9tYXggPSBwYXJhbXMubWF4IHx8IDEwMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9jdXJyZW50ID0gcGFyYW1zLmN1cnJlbnQgfHwgX3RoaXMuX21heDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9yZXNwb25zZURlbGF5ID0gcGFyYW1zLnJlc3BvbnNlRGVsYXkgfHwgMTAwMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl90eXBlID0gcGFyYW1zLnR5cGUgfHwgMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdldFBlcmNlbnRhZ2VJblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFyZ3VtZW50U2NhbGUucHJvdG90eXBlLCBcInJlc3BvbnNlRGVsYXlcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlRGVsYXk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNwb25zZURlbGF5ID0gcGFyYW0gPyBwYXJhbSA6IDEwMDA7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFyZ3VtZW50U2NhbGUucHJvdG90eXBlLCBcImNvbW11bmljYXRvclwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29tbXVuaWNhdG9yO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29tbXVuaWNhdG9yID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgQXJndW1lbnRTY2FsZS5wcm90b3R5cGUudHJpZ2dlciA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBldmVudCA9IChwYXJhbXMgPiAwKSA/IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMuQmVoYXZpb3JTY2FsZVR5cGVzLmluY3JlYXNlIDogQW5pbWFscy5Db21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMuZGVjcmVhc2U7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFjayA9IHtcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogZXZlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogdGhpcy5fdHlwZVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbW11bmljYXRvci5wdWJsaXNoKHBhY2ssIHBhcmFtcyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIEFyZ3VtZW50U2NhbGUucHJvdG90eXBlLmNoYW5nZSA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHZhciByZXogPSB0aGlzLnBlcmNlbnQgKyBkZWx0YTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXogPD0gMTAwICYmIHJleiA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZXJjZW50ID0gcmV6O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFZhbHVlT25TY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudHJpZ2dlcihkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnJlc3BvbnNlRGVsYXkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gQXJndW1lbnRTY2FsZTtcclxuICAgICAgICB9KFNjYWxlcy5BU2NhbGUpKTtcclxuICAgICAgICBTY2FsZXMuQXJndW1lbnRTY2FsZSA9IEFyZ3VtZW50U2NhbGU7XHJcbiAgICB9KShTY2FsZXMgPSBBbmltYWxzLlNjYWxlcyB8fCAoQW5pbWFscy5TY2FsZXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFNjYWxlcztcclxuICAgIChmdW5jdGlvbiAoU2NhbGVzKSB7XHJcbiAgICAgICAgdmFyIFN5c3RlbVNjYWxlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKFN5c3RlbVNjYWxlLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTeXN0ZW1TY2FsZShwYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fbmFtZSA9IHBhcmFtcy5uYW1lIHx8IFwiTm8gbmFtZVwiO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX21pbiA9IHBhcmFtcy5taW4gfHwgMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9tYXggPSBwYXJhbXMubWF4IHx8IDEwMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9jdXJyZW50ID0gcGFyYW1zLmN1cnJlbnQgfHwgX3RoaXMuX21heDtcclxuICAgICAgICAgICAgICAgIF90aGlzLl90eXBlID0gcGFyYW1zLnR5cGUgfHwgMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdldFBlcmNlbnRhZ2VJblNjYWxlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU3lzdGVtU2NhbGUucHJvdG90eXBlLmFuYWx5c2lzID0gZnVuY3Rpb24gKHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJleiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXogKz0gcGFyYW0ucGVyY2VudDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wZXJjZW50ID0gcmV6IC8gcGFyYW1zLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFZhbHVlT25TY2FsZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtU2NhbGU7XHJcbiAgICAgICAgfShTY2FsZXMuQVNjYWxlKSk7XHJcbiAgICAgICAgU2NhbGVzLlN5c3RlbVNjYWxlID0gU3lzdGVtU2NhbGU7XHJcbiAgICB9KShTY2FsZXMgPSBBbmltYWxzLlNjYWxlcyB8fCAoQW5pbWFscy5TY2FsZXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lXzEpIHtcclxuICAgICAgICB2YXIgU3RhdGVNYWNoaW5lID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gU3RhdGVNYWNoaW5lKHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFN0YXRlTWFjaGluZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQsIHRoaXMuX3N0YXRlLnJ1bigpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9zdGF0ZS5pc0VuZFBvaW50KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLl9zdGF0ZS5nZXROZXh0U3RhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ydW4oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsyXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBTdGF0ZU1hY2hpbmU7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmVfMS5TdGF0ZU1hY2hpbmUgPSBTdGF0ZU1hY2hpbmU7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlRmFjdG9yeSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFN0YXRlRmFjdG9yeSgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1N0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnN0YXJ0TGlmZV0gPSBBbmltYWxzLlN0YXRlTWFjaGluZS5TdGF0ZVN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1N0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnN0YW5kXSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlN0YXRlU3RhbmQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUucnVuXSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlN0YXRlUnVuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzW1N0YXRlTWFjaGluZS5UeXBlc1N0YXRlLmRpZV0gPSBBbmltYWxzLlN0YXRlTWFjaGluZS5TdGF0ZURpZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTdGF0ZUZhY3RvcnkuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgU3RhdGVGYWN0b3J5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN0YXRlRmFjdG9yeS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHR5cGUsIHN0YXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbdHlwZV0gPSBzdGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU3RhdGVGYWN0b3J5LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAodHlwZVN0YXRlLCBuYW1lLCBhbmltYWwsIGlzRW5kKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMuX2ZhY3Rvcmllc1t0eXBlU3RhdGVdKG5hbWUsIGFuaW1hbCwgaXNFbmQsIG51bGwpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU3RhdGVGYWN0b3J5O1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lLlN0YXRlRmFjdG9yeSA9IFN0YXRlRmFjdG9yeTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgVHlwZXNTdGF0ZTtcclxuICAgICAgICAoZnVuY3Rpb24gKFR5cGVzU3RhdGUpIHtcclxuICAgICAgICAgICAgVHlwZXNTdGF0ZVtUeXBlc1N0YXRlW1wic3RhcnRMaWZlXCJdID0gMV0gPSBcInN0YXJ0TGlmZVwiO1xyXG4gICAgICAgICAgICBUeXBlc1N0YXRlW1R5cGVzU3RhdGVbXCJzdGFuZFwiXSA9IDJdID0gXCJzdGFuZFwiO1xyXG4gICAgICAgICAgICBUeXBlc1N0YXRlW1R5cGVzU3RhdGVbXCJydW5cIl0gPSAzXSA9IFwicnVuXCI7XHJcbiAgICAgICAgICAgIFR5cGVzU3RhdGVbVHlwZXNTdGF0ZVtcImRpZVwiXSA9IDRdID0gXCJkaWVcIjtcclxuICAgICAgICB9KShUeXBlc1N0YXRlID0gU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUgfHwgKFN0YXRlTWFjaGluZS5UeXBlc1N0YXRlID0ge30pKTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgUm91dGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBSb3V0ZShzdGF0ZSwgYXZhaWxhYmlsaXR5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYXZhaWxhYmlsaXR5ID0gYXZhaWxhYmlsaXR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFJvdXRlLnByb3RvdHlwZS5pc0F2YWlsYWJsZSA9IGZ1bmN0aW9uIChtb2RlbCwgcHJvYmFiaWxpdHkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9iYWJpbGl0eSA9PT0gdm9pZCAwKSB7IHByb2JhYmlsaXR5ID0gMS4wOyB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMuX2F2YWlsYWJpbGl0eSAmJiB0aGlzLl9hdmFpbGFiaWxpdHkobW9kZWwsIHByb2JhYmlsaXR5KSkgPyB0aGlzLl9zdGF0ZSA6IG51bGw7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFJvdXRlLnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFJvdXRlO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lLlJvdXRlID0gUm91dGU7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFJvdXRlRW5naW5lID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZnVuY3Rpb24gUm91dGVFbmdpbmUocm91dGVzLCBuZXh0RW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocm91dGVzID09PSB2b2lkIDApIHsgcm91dGVzID0gW107IH1cclxuICAgICAgICAgICAgICAgIGlmIChuZXh0RW5naW5lID09PSB2b2lkIDApIHsgbmV4dEVuZ2luZSA9IG51bGw7IH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3JvdXRlcyA9IHJvdXRlcztcclxuICAgICAgICAgICAgICAgIHRoaXMuX25leHRFbmdpbmUgPSBuZXh0RW5naW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFJvdXRlRW5naW5lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAocm91dGVzKSB7XHJcbiAgICAgICAgICAgICAgICAoX2EgPSB0aGlzLl9yb3V0ZXMpLnB1c2guYXBwbHkoX2EsIHJvdXRlcyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFJvdXRlRW5naW5lLnByb3RvdHlwZS5nZXRSb3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkIHlldC4uLicpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBSb3V0ZUVuZ2luZS5wcm90b3R5cGUuc2V0TmV4dEVuZ2luZSA9IGZ1bmN0aW9uIChlbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25leHRFbmdpbmUgPSBlbmdpbmU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFJvdXRlRW5naW5lLnByb3RvdHlwZS5zZXRNb2RlbCA9IGZ1bmN0aW9uIChhbmltYWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsID0gYW5pbWFsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBSb3V0ZUVuZ2luZS5wcm90b3R5cGUuX25leHRSb3V0ZUVuZ2luZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9uZXh0RW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25leHRFbmdpbmUuZ2V0Um91dGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gUm91dGVFbmdpbmU7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuUm91dGVFbmdpbmUgPSBSb3V0ZUVuZ2luZTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhQcm9iYWJpbGl0eVJvdXRlRW5naW5lLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBQcm9iYWJpbGl0eVJvdXRlRW5naW5lKHJvdXRlcywgbmV4dEVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlcyA9PT0gdm9pZCAwKSB7IHJvdXRlcyA9IFtdOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dEVuZ2luZSA9PT0gdm9pZCAwKSB7IG5leHRFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgcm91dGVzLCBuZXh0RW5naW5lKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFByb2JhYmlsaXR5Um91dGVFbmdpbmUucHJvdG90eXBlLmdldFJvdXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHZhciBwcm9iYWJpbGl0eSA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm91dGVzID0gdGhpcy5fcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuIHJvdXRlLmlzQXZhaWxhYmxlKF90aGlzLl9tb2RlbCwgcHJvYmFiaWxpdHkpOyB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZXMubGVuZ3RoID4gMCA/IHJvdXRlc1swXSA6IHRoaXMuX25leHRSb3V0ZUVuZ2luZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZTtcclxuICAgICAgICB9KFN0YXRlTWFjaGluZS5Sb3V0ZUVuZ2luZSkpO1xyXG4gICAgICAgIFN0YXRlTWFjaGluZS5Qcm9iYWJpbGl0eVJvdXRlRW5naW5lID0gUHJvYmFiaWxpdHlSb3V0ZUVuZ2luZTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgU2ltcGxlUm91dGVFbmdpbmUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoU2ltcGxlUm91dGVFbmdpbmUsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFNpbXBsZVJvdXRlRW5naW5lKHJvdXRlcywgbmV4dEVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlcyA9PT0gdm9pZCAwKSB7IHJvdXRlcyA9IFtdOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAobmV4dEVuZ2luZSA9PT0gdm9pZCAwKSB7IG5leHRFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgcm91dGVzLCBuZXh0RW5naW5lKSB8fCB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFNpbXBsZVJvdXRlRW5naW5lLnByb3RvdHlwZS5nZXRSb3V0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm91dGVzID0gdGhpcy5fcm91dGVzLmZpbHRlcihmdW5jdGlvbiAocm91dGUpIHsgcmV0dXJuIHJvdXRlLmlzQXZhaWxhYmxlKF90aGlzLl9tb2RlbCk7IH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlcy5sZW5ndGggPiAwID8gcm91dGVzWzBdIDogdGhpcy5fbmV4dFJvdXRlRW5naW5lKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBTaW1wbGVSb3V0ZUVuZ2luZTtcclxuICAgICAgICB9KFN0YXRlTWFjaGluZS5Sb3V0ZUVuZ2luZSkpO1xyXG4gICAgICAgIFN0YXRlTWFjaGluZS5TaW1wbGVSb3V0ZUVuZ2luZSA9IFNpbXBsZVJvdXRlRW5naW5lO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBTdGF0ZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFN0YXRlKG5hbWUsIG1vZGVsLCByb3V0ZUVuZ2luZSwgaXNFbmRQb2ludCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNFbmRQb2ludCA9PT0gdm9pZCAwKSB7IGlzRW5kUG9pbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm91dGVFbmdpbmUgPSByb3V0ZUVuZ2luZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzRW5kUG9pbnQgPSBpc0VuZFBvaW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFN0YXRlLnByb3RvdHlwZS5nZXROYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN0YXRlLnByb3RvdHlwZS5nZXROZXh0U3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3JvdXRlRW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcm91dGUgPSB0aGlzLl9yb3V0ZUVuZ2luZS5nZXRSb3V0ZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlID8gcm91dGUuZ2V0U3RhdGUoKSA6IHRoaXM7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN0YXRlLnByb3RvdHlwZS5pc0VuZFBvaW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzRW5kUG9pbnQ7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN0YXRlLnByb3RvdHlwZS5zZXRSb3V0ZUVuZ2luZSA9IGZ1bmN0aW9uIChyb3V0ZUVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm91dGVFbmdpbmUgPSByb3V0ZUVuZ2luZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JvdXRlRW5naW5lLnNldE1vZGVsKHRoaXMuX21vZGVsKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU3RhdGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQgeWV0Li4uJyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN0YXRlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkIHlldC4uLicpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdGF0ZS5wcm90b3R5cGUubXlTbGVlcCA9IGZ1bmN0aW9uIChzKSB7XHJcbiAgICAgICAgICAgICAgICBzICo9IDEwMDA7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmV0dXJuIHNldFRpbWVvdXQocmVzb2x2ZSwgcyk7IH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU3RhdGU7XHJcbiAgICAgICAgfSgpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuU3RhdGUgPSBTdGF0ZTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3RhdGVNYWNoaW5lO1xyXG4gICAgKGZ1bmN0aW9uIChTdGF0ZU1hY2hpbmUpIHtcclxuICAgICAgICB2YXIgU3RhdGVEaWUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoU3RhdGVEaWUsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFN0YXRlRGllKG5hbWUsIG1vZGVsLCBpc0VuZFBvaW50LCByb3V0ZUVuZ2luZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzRW5kUG9pbnQgPT09IHZvaWQgMCkgeyBpc0VuZFBvaW50ID0gZmFsc2U7IH1cclxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZUVuZ2luZSA9PT0gdm9pZCAwKSB7IHJvdXRlRW5naW5lID0gbnVsbDsgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIG1vZGVsLCByb3V0ZUVuZ2luZSwgaXNFbmRQb2ludCkgfHwgdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBTdGF0ZURpZS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9GD0LzQtdGAJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0YXRlRGllO1xyXG4gICAgICAgIH0oU3RhdGVNYWNoaW5lLlN0YXRlKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lLlN0YXRlRGllID0gU3RhdGVEaWU7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlUnVuID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgICAgICAgICAgX19leHRlbmRzKFN0YXRlUnVuLCBfc3VwZXIpO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTdGF0ZVJ1bihuYW1lLCBtb2RlbCwgaXNFbmRQb2ludCwgcm91dGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAocm91dGVFbmdpbmUgPT09IHZvaWQgMCkgeyByb3V0ZUVuZ2luZSA9IG51bGw7IH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIGlzRW5kUG9pbnQpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU3RhdGVSdW4ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygn0LHQtdCz0YMnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5tdXNjdWxhci5jaGFuZ2VTcGVlZCgtMC40KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5tdXNjdWxhci5jaGFuZ2VXZWlnaHQoLTAuNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCB0aGlzLm15U2xlZXAoMildO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0YXRlUnVuO1xyXG4gICAgICAgIH0oU3RhdGVNYWNoaW5lLlN0YXRlKSk7XHJcbiAgICAgICAgU3RhdGVNYWNoaW5lLlN0YXRlUnVuID0gU3RhdGVSdW47XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlU3RhbmQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoU3RhdGVTdGFuZCwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gU3RhdGVTdGFuZChuYW1lLCBtb2RlbCwgaXNFbmRQb2ludCwgcm91dGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAocm91dGVFbmdpbmUgPT09IHZvaWQgMCkgeyByb3V0ZUVuZ2luZSA9IG51bGw7IH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIGlzRW5kUG9pbnQpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU3RhdGVTdGFuZC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfRgdGC0L7RjicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLm11c2N1bGFyLmNoYW5nZVNwZWVkKDAuNSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwubXVzY3VsYXIuY2hhbmdlV2VpZ2h0KDAuNyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCB0aGlzLm15U2xlZXAoMildO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0YXRlU3RhbmQ7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuU3RhdGUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuU3RhdGVTdGFuZCA9IFN0YXRlU3RhbmQ7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFN0YXRlU3RhcnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgICAgICAgICBfX2V4dGVuZHMoU3RhdGVTdGFydCwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gU3RhdGVTdGFydChuYW1lLCBtb2RlbCwgaXNFbmRQb2ludCwgcm91dGVFbmdpbmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc0VuZFBvaW50ID09PSB2b2lkIDApIHsgaXNFbmRQb2ludCA9IGZhbHNlOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAocm91dGVFbmdpbmUgPT09IHZvaWQgMCkgeyByb3V0ZUVuZ2luZSA9IG51bGw7IH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIGlzRW5kUG9pbnQpIHx8IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgU3RhdGVTdGFydC5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQndCw0YfQsNC7INC20LjRgtGMJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwubXVzY3VsYXIuY2hhbmdlU3BlZWQoMC4wMDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLm11c2N1bGFyLmNoYW5nZVdlaWdodCgwLjAwMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0LCB0aGlzLm15U2xlZXAoMildO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIFN0YXRlU3RhcnQ7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuU3RhdGUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuU3RhdGVTdGFydCA9IFN0YXRlU3RhcnQ7XHJcbiAgICB9KShTdGF0ZU1hY2hpbmUgPSBBbmltYWxzLlN0YXRlTWFjaGluZSB8fCAoQW5pbWFscy5TdGF0ZU1hY2hpbmUgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN0YXRlTWFjaGluZTtcclxuICAgIChmdW5jdGlvbiAoU3RhdGVNYWNoaW5lKSB7XHJcbiAgICAgICAgdmFyIFBhdHRlcm5TdGF0ZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhQYXR0ZXJuU3RhdGUsIF9zdXBlcik7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFBhdHRlcm5TdGF0ZShuYW1lLCBtb2RlbCwgcm91dGVFbmdpbmUsIHN0YXRlcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGVzID09PSB2b2lkIDApIHsgc3RhdGVzID0gW107IH1cclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5hbWUsIG1vZGVsLCByb3V0ZUVuZ2luZSkgfHwgdGhpcztcclxuICAgICAgICAgICAgICAgIF90aGlzLl9zdGF0ZXMgPSBzdGF0ZXM7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgUGF0dGVyblN0YXRlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3RhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlcy5wdXNoKHN0YXRlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUGF0dGVyblN0YXRlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ZSA9IHRoaXMuX3N0YXRlc1swXTtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChzdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUucnVuKG1vZGVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUGF0dGVyblN0YXRlLnByb3RvdHlwZS5nZXROYW1lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9zdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ3VycmVudCBzdGF0ZSBub3QgaW5pdGlhbGl6ZWQuLi4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5nZXROYW1lKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBQYXR0ZXJuU3RhdGU7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuU3RhdGUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuUGF0dGVyblN0YXRlID0gUGF0dGVyblN0YXRlO1xyXG4gICAgfSkoU3RhdGVNYWNoaW5lID0gQW5pbWFscy5TdGF0ZU1hY2hpbmUgfHwgKEFuaW1hbHMuU3RhdGVNYWNoaW5lID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTdGF0ZU1hY2hpbmU7XHJcbiAgICAoZnVuY3Rpb24gKFN0YXRlTWFjaGluZSkge1xyXG4gICAgICAgIHZhciBQcmltaXRpdmVTdGF0ZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICAgICAgICAgIF9fZXh0ZW5kcyhQcmltaXRpdmVTdGF0ZSwgX3N1cGVyKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gUHJpbWl0aXZlU3RhdGUobmFtZSwgbW9kZWwsIGlzRW5kUG9pbnQsIHJvdXRlRW5naW5lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNFbmRQb2ludCA9PT0gdm9pZCAwKSB7IGlzRW5kUG9pbnQgPSBmYWxzZTsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHJvdXRlRW5naW5lID09PSB2b2lkIDApIHsgcm91dGVFbmdpbmUgPSBudWxsOyB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgbW9kZWwsIHJvdXRlRW5naW5lLCBpc0VuZFBvaW50KSB8fCB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFByaW1pdGl2ZVN0YXRlLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGltcGxlbWVudGF0aW9uIHN0YXR1cy4uLicpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gUHJpbWl0aXZlU3RhdGU7XHJcbiAgICAgICAgfShTdGF0ZU1hY2hpbmUuU3RhdGUpKTtcclxuICAgICAgICBTdGF0ZU1hY2hpbmUuUHJpbWl0aXZlU3RhdGUgPSBQcmltaXRpdmVTdGF0ZTtcclxuICAgIH0pKFN0YXRlTWFjaGluZSA9IEFuaW1hbHMuU3RhdGVNYWNoaW5lIHx8IChBbmltYWxzLlN0YXRlTWFjaGluZSA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3lzdGVtcztcclxuICAgIChmdW5jdGlvbiAoU3lzdGVtcykge1xyXG4gICAgICAgIHZhciBTeXN0ZW1UeXBlcztcclxuICAgICAgICAoZnVuY3Rpb24gKFN5c3RlbVR5cGVzKSB7XHJcbiAgICAgICAgICAgIFN5c3RlbVR5cGVzW1N5c3RlbVR5cGVzW1wibXVzY3VsYXJcIl0gPSAxXSA9IFwibXVzY3VsYXJcIjtcclxuICAgICAgICAgICAgU3lzdGVtVHlwZXNbU3lzdGVtVHlwZXNbXCJjaXJjdWxhdG9yeVwiXSA9IDJdID0gXCJjaXJjdWxhdG9yeVwiO1xyXG4gICAgICAgICAgICBTeXN0ZW1UeXBlc1tTeXN0ZW1UeXBlc1tcIm1lbW9yeVwiXSA9IDNdID0gXCJtZW1vcnlcIjtcclxuICAgICAgICAgICAgU3lzdGVtVHlwZXNbU3lzdGVtVHlwZXNbXCJuYXZpZ2F0aW9uXCJdID0gNF0gPSBcIm5hdmlnYXRpb25cIjtcclxuICAgICAgICB9KShTeXN0ZW1UeXBlcyA9IFN5c3RlbXMuU3lzdGVtVHlwZXMgfHwgKFN5c3RlbXMuU3lzdGVtVHlwZXMgPSB7fSkpO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIFN5c3RlbUZhY3RvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBTeXN0ZW1GYWN0b3J5KCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yaWVzID0gW107XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3lzdGVtcy5TeXN0ZW1UeXBlcy5tdXNjdWxhcl0gPSBBbmltYWxzLlN5c3RlbXMuTXVzY3VsYXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeV0gPSBBbmltYWxzLlN5c3RlbXMuQ2lyY3VsYXRvcnk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbU3lzdGVtcy5TeXN0ZW1UeXBlcy5uYXZpZ2F0aW9uXSA9IEFuaW1hbHMuU3lzdGVtcy5OYXZpZ2F0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFN5c3RlbUZhY3RvcnkuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgU3lzdGVtRmFjdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTeXN0ZW1GYWN0b3J5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodHlwZSwgc3lzdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mYWN0b3JpZXNbdHlwZV0gPSBzeXN0ZW07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN5c3RlbUZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChmdW5jdGlvblR5cGUsIHBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLl9mYWN0b3JpZXNbZnVuY3Rpb25UeXBlXShwYXJhbXMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtRmFjdG9yeTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFN5c3RlbXMuU3lzdGVtRmFjdG9yeSA9IFN5c3RlbUZhY3Rvcnk7XHJcbiAgICB9KShTeXN0ZW1zID0gQW5pbWFscy5TeXN0ZW1zIHx8IChBbmltYWxzLlN5c3RlbXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIEFuaW1hbHM7XHJcbihmdW5jdGlvbiAoQW5pbWFscykge1xyXG4gICAgdmFyIFN5c3RlbXM7XHJcbiAgICAoZnVuY3Rpb24gKFN5c3RlbXMpIHtcclxuICAgICAgICB2YXIgQ2lyY3VsYXRvcnkgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBDaXJjdWxhdG9yeShzY2FsZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zdGF0ZV0gfHwgbmV3IEFuaW1hbHMuU2NhbGVzLlN5c3RlbVNjYWxlKFtdKTtcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVhcnRiZWF0ID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuaGVhcnRiZWF0XTtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJlc3N1cmUgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5wcmVzc3VyZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENpcmN1bGF0b3J5LnByb3RvdHlwZSwgXCJoZWFydGJlYXRcIiwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlYXJ0YmVhdDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWFydGJlYXQgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENpcmN1bGF0b3J5LnByb3RvdHlwZSwgXCJwcmVzc3VyZVwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJlc3N1cmU7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJlc3N1cmUgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgQ2lyY3VsYXRvcnkucHJvdG90eXBlLmNoYW5nZUhlYXJ0YmVhdCA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0LmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIENpcmN1bGF0b3J5LnByb3RvdHlwZS5jaGFuZ2VQcmVzc3VyZSA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlc3N1cmUuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgQ2lyY3VsYXRvcnkucHJvdG90eXBlLmFuYWx5c2lzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5hbmFseXNpcyhbXSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBDaXJjdWxhdG9yeTtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFN5c3RlbXMuQ2lyY3VsYXRvcnkgPSBDaXJjdWxhdG9yeTtcclxuICAgIH0pKFN5c3RlbXMgPSBBbmltYWxzLlN5c3RlbXMgfHwgKEFuaW1hbHMuU3lzdGVtcyA9IHt9KSk7XHJcbn0pKEFuaW1hbHMgfHwgKEFuaW1hbHMgPSB7fSkpO1xyXG52YXIgQW5pbWFscztcclxuKGZ1bmN0aW9uIChBbmltYWxzKSB7XHJcbiAgICB2YXIgU3lzdGVtcztcclxuICAgIChmdW5jdGlvbiAoU3lzdGVtcykge1xyXG4gICAgICAgIHZhciBNdXNjdWxhciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIE11c2N1bGFyKHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnN0YXRlXSB8fCBuZXcgQW5pbWFscy5TY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZCA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkXTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2VpZ2h0ID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMud2VpZ2h0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTXVzY3VsYXIucHJvdG90eXBlLCBcInNwZWVkXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGVlZDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zcGVlZCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTXVzY3VsYXIucHJvdG90eXBlLCBcIndlaWdodFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd2VpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTXVzY3VsYXIucHJvdG90eXBlLCBcImN1cnJlbnRQb2ludFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudFBvaW50O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudFBvaW50LnggPSBwYXJhbS54O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRQb2ludC55ID0gcGFyYW0ueTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBNdXNjdWxhci5wcm90b3R5cGUuY2hhbmdlU3BlZWQgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NwZWVkLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE11c2N1bGFyLnByb3RvdHlwZS5jaGFuZ2VXZWlnaHQgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodC5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmFseXNpcygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBNdXNjdWxhci5wcm90b3R5cGUuYW5hbHlzaXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlLmFuYWx5c2lzKFtdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIE11c2N1bGFyO1xyXG4gICAgICAgIH0oKSk7XHJcbiAgICAgICAgU3lzdGVtcy5NdXNjdWxhciA9IE11c2N1bGFyO1xyXG4gICAgfSkoU3lzdGVtcyA9IEFuaW1hbHMuU3lzdGVtcyB8fCAoQW5pbWFscy5TeXN0ZW1zID0ge30pKTtcclxufSkoQW5pbWFscyB8fCAoQW5pbWFscyA9IHt9KSk7XHJcbnZhciBBbmltYWxzO1xyXG4oZnVuY3Rpb24gKEFuaW1hbHMpIHtcclxuICAgIHZhciBTeXN0ZW1zO1xyXG4gICAgKGZ1bmN0aW9uIChTeXN0ZW1zKSB7XHJcbiAgICAgICAgdmFyIE5hdmlnYXRpb24gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBOYXZpZ2F0aW9uKHNjYWxlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnN0YXRlXSB8fCBuZXcgQW5pbWFscy5TY2FsZXMuU3lzdGVtU2NhbGUoW10pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcGVlZFNhdnZ5ID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuc3BlZWRTYXZ2eV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c0hlYXJpbmcgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNIZWFyaW5nXTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmFkaXVzU21lbGwgPSBzY2FsZXNbQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNTbWVsbF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c1Zpc2lvbiA9IHNjYWxlc1tBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnJhZGl1c1Zpc2lvbl07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c1RvdWNoID0gc2NhbGVzW0FuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVG91Y2hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXZpZ2F0aW9uLnByb3RvdHlwZSwgXCJzcGVlZFNhdnZ5XCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGVlZFNhdnZ5O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NwZWVkU2F2dnkgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdmlnYXRpb24ucHJvdG90eXBlLCBcInJhZGl1c1Zpc2lvblwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzVmlzaW9uO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c1Zpc2lvbiA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmF2aWdhdGlvbi5wcm90b3R5cGUsIFwicmFkaXVzSGVhcmluZ1wiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzSGVhcmluZztcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNIZWFyaW5nID0gcGFyYW07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXZpZ2F0aW9uLnByb3RvdHlwZSwgXCJyYWRpdXNTbWVsbFwiLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcmFkaXVzU21lbGw7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzU21lbGwgPSBwYXJhbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdmlnYXRpb24ucHJvdG90eXBlLCBcInJhZGl1c1RvdWNoXCIsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yYWRpdXNUb3VjaDtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNUb3VjaCA9IHBhcmFtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBOYXZpZ2F0aW9uLnByb3RvdHlwZS5jaGFuZ2VTcGVlZFNhdnZ5ID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zcGVlZFNhdnZ5LmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmNoYW5nZVJhZGl1c1Zpc2lvbiA9IGZ1bmN0aW9uIChkZWx0YSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmFkaXVzVmlzaW9uLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmNoYW5nZVJhZGl1c0hlYXJpbmcgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c0hlYXJpbmcuY2hhbmdlKGRlbHRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYW5hbHlzaXMoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgTmF2aWdhdGlvbi5wcm90b3R5cGUuY2hhbmdlUmFkaXVzU21lbGwgPSBmdW5jdGlvbiAoZGVsdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JhZGl1c1NtZWxsLmNoYW5nZShkZWx0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFuYWx5c2lzKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIE5hdmlnYXRpb24ucHJvdG90eXBlLmNoYW5nZVJhZGl1c1RvdWNoID0gZnVuY3Rpb24gKGRlbHRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yYWRpdXNUb3VjaC5jaGFuZ2UoZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hbmFseXNpcygpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBOYXZpZ2F0aW9uLnByb3RvdHlwZS5hbmFseXNpcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuYW5hbHlzaXMoW10pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gTmF2aWdhdGlvbjtcclxuICAgICAgICB9KCkpO1xyXG4gICAgICAgIFN5c3RlbXMuTmF2aWdhdGlvbiA9IE5hdmlnYXRpb247XHJcbiAgICB9KShTeXN0ZW1zID0gQW5pbWFscy5TeXN0ZW1zIHx8IChBbmltYWxzLlN5c3RlbXMgPSB7fSkpO1xyXG59KShBbmltYWxzIHx8IChBbmltYWxzID0ge30pKTtcclxudmFyIE1hcEdhbWU7XHJcbihmdW5jdGlvbiAoTWFwR2FtZSkge1xyXG4gICAgdmFyIE1hcCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gTWFwKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBNYXAuaW5zdGFuY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5faW5zdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zdCA9IG5ldyBNYXAoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5zdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcIndvcmxkXCIsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fd29ybGQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dvcmxkID0gbWFwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemF0aW9uV29ybGQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV29ybGQgd2FzIG5vdCBmb3VuZC4uLicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWFwLnByb3RvdHlwZSwgXCJvYnN0YWNsZXNMYXllclwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vYnN0YWNsZXNMYXllciA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXllciBvYnN0YWNsZSB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcIndhdGVyTGF5ZXJcIiwge1xyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uIChsYXllcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2F0ZXJMYXllciA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdMYXllciB3YXRlciB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXAucHJvdG90eXBlLCBcInRyZWVMYXllclwiLCB7XHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKGxheWVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGF5ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cmVlTGF5ZXIgPSBsYXllcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTGF5ZXIgdHJlZSB3YXMgbm90IGZvdW5kLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2luaXRpYWxpemF0aW9uV29ybGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxpemF0aW9uTGF5ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fc2l6ZU1hcFRpbGVkID0gdGhpcy5fd29ybGQuZ2V0TWFwU2l6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplVGlsZWQgPSB0aGlzLl93b3JsZC5nZXRUaWxlU2l6ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaXplTWFwUGl4ZWwgPSB0aGlzLl9nZXRTaXplTWFwUGl4ZWwoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2luaXRpYWxpemF0aW9uTGF5ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JzdGFjbGVzTGF5ZXIgPSB0aGlzLl93b3JsZC5nZXRMYXllcignb2JzdGFjbGUnKTtcclxuICAgICAgICAgICAgdGhpcy53YXRlckxheWVyID0gdGhpcy5fd29ybGQuZ2V0TGF5ZXIoJ3dhdGVyJyk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlZUxheWVyID0gdGhpcy5fd29ybGQuZ2V0TGF5ZXIoJ3RyZWUnKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2dldFNpemVNYXBQaXhlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHNpemVYID0gdGhpcy5fc2l6ZU1hcFRpbGVkLndpZHRoICogdGhpcy5fc2l6ZVRpbGVkLndpZHRoO1xyXG4gICAgICAgICAgICB2YXIgc2l6ZVkgPSB0aGlzLl9zaXplTWFwVGlsZWQuaGVpZ2h0ICogdGhpcy5fc2l6ZVRpbGVkLmhlaWdodDtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHNpemVYLCBzaXplWSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBNYXAucHJvdG90eXBlLmNvbnZlcnRUaWxlZFBvcyA9IGZ1bmN0aW9uIChwb3NJblBpeGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gTWF0aC5mbG9vcigocG9zSW5QaXhlbC54KSAvIHRoaXMuX3NpemVUaWxlZC53aWR0aCk7XHJcbiAgICAgICAgICAgIHZhciB5ID0gTWF0aC5mbG9vcigodGhpcy5fc2l6ZU1hcFBpeGVsLnkgLSAocG9zSW5QaXhlbC55KSkgLyB0aGlzLl9zaXplVGlsZWQuaGVpZ2h0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5jb252ZXJ0UGl4ZWxQb3MgPSBmdW5jdGlvbiAocG9zSW5UaWxlZCkge1xyXG4gICAgICAgICAgICB2YXIgeCA9IHBvc0luVGlsZWQueCAqIHRoaXMuX3NpemVUaWxlZC53aWR0aCArIHRoaXMuX3NpemVUaWxlZC53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy5fc2l6ZU1hcFBpeGVsLnkgLSAocG9zSW5UaWxlZC55ICogdGhpcy5fc2l6ZVRpbGVkLmhlaWdodCkgLSB0aGlzLl9zaXplVGlsZWQuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgTWFwLnByb3RvdHlwZS5pc0NoZdGBa09ic3RhY2xlID0gZnVuY3Rpb24gKGdpZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb3JyZWN0UG9zKGdpZCkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vYnN0YWNsZXNMYXllci5nZXRUaWxlR0lEQXQoZ2lkLngsIGdpZC55KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIE1hcC5wcm90b3R5cGUuX2lzQ29ycmVjdFBvcyA9IGZ1bmN0aW9uIChwb3MpIHtcclxuICAgICAgICAgICAgaWYgKHBvcy54IDwgMCB8fCBwb3MueSA8IDAgfHwgcG9zLnggPiB0aGlzLl9zaXplTWFwVGlsZWQud2lkdGggLSAxIHx8IHBvcy55ID4gdGhpcy5fc2l6ZU1hcFRpbGVkLmhlaWdodCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBNYXA7XHJcbiAgICB9KCkpO1xyXG4gICAgTWFwR2FtZS5NYXAgPSBNYXA7XHJcbn0pKE1hcEdhbWUgfHwgKE1hcEdhbWUgPSB7fSkpO1xyXG52YXIgbGlvbiA9IHtcclxuICAgIG5hbWU6ICfQm9C10LInLFxyXG4gICAgc3lzdGVtczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLm11c2N1bGFyLFxyXG4gICAgICAgICAgICBzY2FsZXNUeXBlOiBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuc3BlZWQgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZCB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLndlaWdodCB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3lzdGVtcy5TeXN0ZW1UeXBlcy5jaXJjdWxhdG9yeSxcclxuICAgICAgICAgICAgc2NhbGVzVHlwZTogW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnByZXNzdXJlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuaGVhcnRiZWF0IH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TeXN0ZW1zLlN5c3RlbVR5cGVzLm5hdmlnYXRpb24sXHJcbiAgICAgICAgICAgIHNjYWxlc1R5cGU6IFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZFNhdnZ5IH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVmlzaW9uIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzU21lbGwgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNIZWFyaW5nIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVG91Y2ggfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgc2NhbGVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMuaGVhcnRiZWF0LFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQodC10YDQtNGG0LXQsdC40LXQvdC40LUnLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOSxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAwLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VEZWxheTogMC4xMixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucHJlc3N1cmUsXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9CU0LDQstC70LXQvdC40LUnLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOCxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZURlbGF5OiAwLjEzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQodC60L7RgNC+0YHRgtGMJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDksXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMTIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLndlaWdodCxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0JLQtdGBJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDgsXHJcbiAgICAgICAgICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgICAgICAgICBtYXg6IDEwLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VEZWxheTogMC4xXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZVNjYWxlOiBBbmltYWxzLlNjYWxlcy5TY2FsZVR5cGVzLmFyZ3VtZW50LFxyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkU2F2dnksXHJcbiAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9CS0YDQtdC80Y8g0YHQvNC10LrQsNC70LrQuCcsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50OiA4LFxyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiAxMCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGVTY2FsZTogQW5pbWFscy5TY2FsZXMuU2NhbGVUeXBlcy5hcmd1bWVudCxcclxuICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5yYWRpdXNUb3VjaCxcclxuICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KDQsNC00LjRg9GBINC+0YHRj9C30LDQvdC40Y8nLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudDogOSxcclxuICAgICAgICAgICAgICAgIG1pbjogMCxcclxuICAgICAgICAgICAgICAgIG1heDogMTAsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zZURlbGF5OiAwLjFcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlU2NhbGU6IEFuaW1hbHMuU2NhbGVzLlNjYWxlVHlwZXMuYXJndW1lbnQsXHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMucmFkaXVzVmlzaW9uLFxyXG4gICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICfQoNCw0LTQuNGD0YEg0LfRgNC10L3QuNGPJyxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQ6IDQwLFxyXG4gICAgICAgICAgICAgICAgbWluOiAwLFxyXG4gICAgICAgICAgICAgICAgbWF4OiA4MCxcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlRGVsYXk6IDAuMVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBjb21tdW5pY2F0aW9uOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBBbmltYWxzLlNjYWxlcy5QYXJhbWV0ZXJTY2FsZVR5cGVzLnNwZWVkLFxyXG4gICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy53ZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgYmVoYXZpb3I6IEFuaW1hbHMuQ29tbXVuaWNhdGlvbnMuQmVoYXZpb3JTY2FsZVR5cGVzLmluY3JlYXNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uczogQW5pbWFscy5GdW5jdGlvbnMuRnVuY3Rpb25UeXBlcy5saW5lLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAwLjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAuMThcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU2NhbGVzLlBhcmFtZXRlclNjYWxlVHlwZXMud2VpZ2h0LFxyXG4gICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TY2FsZXMuUGFyYW1ldGVyU2NhbGVUeXBlcy5zcGVlZCxcclxuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcjogQW5pbWFscy5Db21tdW5pY2F0aW9ucy5CZWhhdmlvclNjYWxlVHlwZXMuZGVjcmVhc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25zOiBBbmltYWxzLkZ1bmN0aW9ucy5GdW5jdGlvblR5cGVzLmxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAuNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgMC4xXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBzdGF0ZXM6IHtcclxuICAgICAgICBzdGF0ZTogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0KHRgtCw0YDRgicsXHJcbiAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnN0YXJ0TGlmZSxcclxuICAgICAgICAgICAgICAgIGlzRW5kOiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAn0JHQtdCz0YMnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5ydW4sXHJcbiAgICAgICAgICAgICAgICBpc0VuZDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9Ch0YLQvtGOJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuc3RhbmQsXHJcbiAgICAgICAgICAgICAgICBpc0VuZDogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ9Cj0LzQtdGAJyxcclxuICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuZGllLFxyXG4gICAgICAgICAgICAgICAgaXNFbmQ6IHRydWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgbGlua3M6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5zdGFydExpZmUsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnJ1bixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDAuN1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnN0YW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC43XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuZGllLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC4wMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5zdGFuZCxcclxuICAgICAgICAgICAgICAgIGxpbms6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUucnVuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC43XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUuZGllLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC4wMVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogQW5pbWFscy5TdGF0ZU1hY2hpbmUuVHlwZXNTdGF0ZS5ydW4sXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLmRpZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvYmFiaWxpdHk6IDAuNlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBBbmltYWxzLlN0YXRlTWFjaGluZS5UeXBlc1N0YXRlLnN0YW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC45XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IEFuaW1hbHMuU3RhdGVNYWNoaW5lLlR5cGVzU3RhdGUucnVuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9iYWJpbGl0eTogMC4xXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG59O1xyXG5leHBvcnQge0FQSUNvcmV9O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWlsZC10cy5qcy5tYXAiLCJpbXBvcnQgeyBDaXJjdWxhckxpc3QgfSBmcm9tICcuL2NpcmN1bGFyLWxpc3QnO1xyXG5cclxuLyoqXHJcbiAqINCd0LDRgdGC0YDQsNC40LLQsNC10YIg0LrRgNGD0LPQu9C+0LUg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAqIEBjbGFzcyBDaXJjdWxhckxpc3RBY3Rpb25zQW5pbWFsXHJcbiAqIEBleHRlbmRzIENpcmN1bGFyTGlzdFxyXG4gKi9cclxudmFyIENpcmN1bGFyTGlzdEFjdGlvbnNBbmltYWwgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBDaXJjdWxhckxpc3QsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0YHRgtGA0L7QudC60LAg0LzQtdC90Y4g0LTQu9GPINC60L7QvdC60YDQtdGC0L3QvtCz0L4g0LbQuNCy0L7RgtC90L7Qs9C+LiDQndCw0YHRgtGA0LDQuNCy0LDQtdGCINGA0LDQtNC40YPRgSDQutGA0YPQs9CwLlxyXG4gICAgICogQG1ldGhvZCBzZXR0aW5nc1xyXG4gICAgICogQHBhcmFtIHtjYy5Db21wb25lbnR9IGNvbnRyb2xsZXJBbmltYWwg0LrQvtC90YLRgNC+0LvQu9C10YAg0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICovXHJcbiAgICBzZXR0aW5ncyhjb250cm9sbGVyQW5pbWFsKXtcclxuICAgICAgICBsZXQgbm9kZSA9IGNvbnRyb2xsZXJBbmltYWwubm9kZTtcclxuXHJcbiAgICAgICAgdGhpcy5yYWRpdXMgPSBub2RlLndpZHRoICogMS43NTtcclxuICAgICAgICBpZiAodGhpcy5yYWRpdXMgPiAxNTApIHtcclxuICAgICAgICAgICAgdGhpcy5yYWRpdXMgPSAxNTA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJhZGl1cyA8IDEwMCkge1xyXG4gICAgICAgICAgICB0aGlzLnJhZGl1cyA9IDEwMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JlZnJlc2hNZW51KCk7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7IENpcmN1bGFyTGlzdEFjdGlvbnNBbmltYWwgfTsiLCIvKipcclxuICog0KHQvtGB0YLQvtGP0L3QuNC1INC00LLQuNC20LXQvdC40Y8g0LzQtdC90Y4gKNC/0L4g0YfQsNGB0L7QstC+0Lkv0L/RgNC+0YLQuNCyINGH0LDRgdC+0LLQvtC5KS5cclxuICogQHR5cGUge01vdmVDaXJjdWxhcn1cclxuICogQHN0YXRpY1xyXG4gKiBAZWxlbWVudCB7bnVtYmVyfSBjbG9ja3dpc2Ug0LrRgNGD0YLQuNGC0YHRjyDQv9C+INGH0LDRgdC+0LLQvtC5LlxyXG4gKiBAZWxlbWVudCB7bnVtYmVyfSBhbnRpY2xvY2t3aXNlINC60YDRg9GC0LjRgtGB0Y8g0L/RgNC+0YLQuNCyINGH0LDRgdC+0LLQvtC5LlxyXG4gKi9cclxuY29uc3QgTW92ZUNpcmN1bGFyID0ge1xyXG4gICAgY2xvY2t3aXNlOiAwLC8v0L/QviDRh9Cw0YHQvtCy0L7QuVxyXG4gICAgYW50aWNsb2Nrd2lzZTogMSwvL9C/0YDQvtGC0LjQsiDRh9Cw0YHQvtCy0L7QuVxyXG59O1xyXG5cclxuLyoqXHJcbiAqINCS0YvQv9C+0LvQvdGP0LXRgiDQstGA0LDRidC10L3QuNC10Lgg0YDQsNC30LzQtdGJ0LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQvtCyINC/0L4g0L7QutGA0YPQttC90L7RgdGC0LguXHJcbiAqIEBjbGFzcyBDaXJjdWxhckxpc3RcclxuICovXHJcbnZhciBDaXJjdWxhckxpc3QgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9sZW5ndGhCZXR3ZWVuUG9pbnRzOiAwLC8v0YDQsNGB0YHRgtC+0Y/QvdC40LUg0LzQtdC20LTRgyDRjdC70LXQvNC10L3RgtCw0LzQuFxyXG4gICAgICAgIF9jZW50cmU6IGNjLlZlYzIsLy/QptC10L3RgtGAINC60YDRg9Cz0LBcclxuICAgICAgICBfYXJyYXlBbmdsZUxpc3Q6IFtdLC8vL9C80LDRgdGB0LjQsiDRg9Cz0LvQvtCyINC70LjRgdGC0L7QsiDQvdCwINC60L7RgtC+0YDRi9GFINC+0L3QuCDQvdCw0YXQvtC00Y/RgtGB0Y9cclxuICAgICAgICBfcG9vbEludmlzaWJsZUxpc3Q6IFtdLC8v0LzQsNGB0YHQuNCyINC90LXQstC40LTQuNC80YvRhSDQu9C40YHRgtC+0LJcclxuICAgICAgICBfcHJldlJvdGF0aW9uOiAwLC8v0L/RgNC10LTRi9C00YPRidC40Lkg0YPQs9C+0Lsg0LLQvtCy0L7RgNC+0YLQsCDQtNC+INGC0LXQutGD0YnQtdCz0L4g0L/QvtCy0L7RgNC+0YLQsFxyXG4gICAgICAgIF9zdGF0ZURpcmVjdGlvbjogTW92ZUNpcmN1bGFyLmNsb2Nrd2lzZSwvL9C90LDQv9GA0LDQstC70LXQvdC40LUg0LTQstC40LbQtdC90LjRj1xyXG5cclxuICAgICAgICBhbW91bnRWaXNpYmxMaXN0OiA3LC8v0LrQvtC70LjRh9C10YHRgtCy0L4g0LLQuNC00LjQvNGL0YUg0LvQuNC/0LXRgdGC0LrQvtCyINC80LXQvdGOXHJcbiAgICAgICAgYW5nbGVUcmFuc2l0aW9uOiAyMjUsLy/Rg9Cz0L7QuyDQv9C10YDQtdGF0L7QtNCwINC4INC/0L7Rj9Cy0LvQtdC90LjRj9C90L7QstGL0YUg0LvQuNC/0LXRgdGC0LrQvtCyXHJcbiAgICAgICAgd2lkdGhUcmFuc2l0aW9uOiAwLjMsLy/RiNC40YDQuNC90LAg0L/QtdGA0LXRhdC+0LTQsCDQsiDQs9GA0LDQtNGD0YHQsNGFXHJcbiAgICAgICAgcmFkaXVzOiAxMzAsLy/RgNCw0LTQuNGD0YEg0L3QsCDQutC+0YLQvtGA0L7QvCDQsdGD0LTRg9GCINC60YDRg9GC0LjRgtGB0Y8g0LLRgdC1INC60L3QvtC/0LrQuFxyXG4gICAgICAgIHNlbnNpdGl2aXR5OiAxLC8v0KfRg9Cy0YHRgtCy0LjRgtC10LvQvdC+0YHRgtGMINCx0LDRgNCw0LHQsNC90LAg0Log0LTQstC40LbQtdC90LjRjiDRgdCy0LDQudC/0LAg0L/QviDQutC+0L7RgNC00LjQvdCw0YLQtVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpe1xyXG4gICAgICAgIHRoaXMuX3BsYWNlbWVudExpc3RzTWVudSgpO1xyXG4gICAgICAgIHRoaXMuX3ByZXZSb3RhdGlvbiA9IHRoaXMubm9kZS5yb3RhdGlvbjtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J7QsdC90L7QstC40YLRjCDQv9C+0LfQuNGG0LjQuCDQutC90L7Qv9C+0Log0LIg0LzQtdC90Y4uINChINGD0YfQtdGC0L7QvCDRgNCw0LTQuNGD0YHQsCDQvtC60YDRg9C20L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgX3JlZnJlc2hNZW51XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcmVmcmVzaE1lbnUoKXtcclxuICAgICAgICB0aGlzLl9wbGFjZW1lbnRMaXN0c01lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0YHQv9GA0LXQtNC10LvQtdC90LjQtSDQutC90L7Qv9C+0Log0L/QviDQvtC60YDRg9C20L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgX3BsYWNlbWVudExpc3RzTWVudVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3BsYWNlbWVudExpc3RzTWVudSgpe1xyXG4gICAgICAgIC8v0YDQsNGB0YHRh9C40YLRi9Cy0LDQtdC8INGG0LXQvdGC0YAg0LrRgNGD0LPQsFxyXG4gICAgICAgIGxldCB3aW5kb3cgPSB0aGlzLm5vZGUucGFyZW50O1xyXG4gICAgICAgIGxldCBjdXJyZW50UmFkaWFucyA9IDAsIHgsIHk7XHJcbiAgICAgICAgdGhpcy5fYXJyYXlBbmdsZUxpc3QgPSBbXTtcclxuICAgICAgICB0aGlzLl9wb29sSW52aXNpYmxlTGlzdCA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLl9jZW50cmUgPSBjYy52Mih3aW5kb3cud2lkdGggLyAyLCB3aW5kb3cuaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgdGhpcy5fbGVuZ3RoQmV0d2VlblBvaW50cyA9IDIgKiBNYXRoLlBJIC8gdGhpcy5hbW91bnRWaXNpYmxMaXN0O1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRSYWRpYW5zID49IDIgKiBNYXRoLlBJKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcG9vbEludmlzaWJsZUxpc3QucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHkgPSB0aGlzLnJhZGl1cyAqIE1hdGguc2luKGN1cnJlbnRSYWRpYW5zKTtcclxuICAgICAgICAgICAgICAgIHggPSB0aGlzLnJhZGl1cyAqIE1hdGguY29zKGN1cnJlbnRSYWRpYW5zKTtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2V0UG9zaXRpb24oeCwgeSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hcnJheUFuZ2xlTGlzdC5wdXNoKHtpdGVtOiBpdGVtLCBhbmdsZTogY3VycmVudFJhZGlhbnMgKiAoMTgwIC8gTWF0aC5QSSl9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudFJhZGlhbnMgKz0gdGhpcy5fbGVuZ3RoQmV0d2VlblBvaW50cztcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntC/0YDQtdC00LXQu9C10L3QuNC1INC90LDQv9GA0LDQstC70LXQvdC40Y8g0LLRgNCw0YnQtdC90LjRjyDQuCDQstGL0LfRi9Cy0LDQtdGCINGB0L7QvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LjQuSDQvtCx0YDQsNCx0L7RgtGH0LjQuiwg0L/QtdGA0LXQtNCw0LLQsNGPINC30L3QsNGH0LXQvdC40Y8g0YFcclxuICAgICAqINGD0YfQtdGC0L7QvCDRh9GD0LLRgdGC0LLQuNGC0LXQu9GM0L3QvtGB0YLQuC5cclxuICAgICAqIEBtZXRob2QgZGlyZWN0aW9uUm90YXRpb25cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4INC00LXQu9GM0YLQsCDQuNC30LzQtdC90LXQvdC40Y8g0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQuNC30LzQtdC90LXQvdC40Y8g0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvY1gg0L/QvtC70L7QttC10L3QuNC1INGC0LDRh9CwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9jWSDQv9C+0LvQvtC20LXQvdC40LUg0YLQsNGH0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICovXHJcbiAgICBkaXJlY3Rpb25Sb3RhdGlvbih4LCB5LCBsb2NYLCBsb2NZKXtcclxuICAgICAgICAvL9C/0YDQuNC80LXQvdGP0LXQvCDRh9GD0LLRgdGC0LLQuNGC0LXQu9GM0L3QvtGB0YLRjFxyXG4gICAgICAgIHggPSB4ICogdGhpcy5zZW5zaXRpdml0eTtcclxuICAgICAgICB5ID0geSAqIHRoaXMuc2Vuc2l0aXZpdHk7XHJcblxyXG4gICAgICAgIGlmIChsb2NYID4gdGhpcy5fY2VudHJlLnggJiYgbG9jWSA+IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjEoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYIDwgdGhpcy5fY2VudHJlLnggJiYgbG9jWSA+IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjIoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYIDwgdGhpcy5fY2VudHJlLnggJiYgbG9jWSA8IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjMoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChsb2NYID4gdGhpcy5fY2VudHJlLnggJiYgbG9jWSA8IHRoaXMuX2NlbnRyZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29icjQoeCwgeSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IDAuMDAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2V0RGlyZWN0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFtb3VudFZpc2libExpc3QgPCB0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmtpbmdWaXNpYmxlRWxlbWVudHMoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KDQsNCx0L7RgtCw0LXRgiDRgSDQv9C+0Y/QstC70LXQvdC40LXQvCDRjdC70LXQvNC10L3RgtC+0LIuXHJcbiAgICAgKiBAbWV0aG9kIF93b3JraW5nVmlzaWJsZUVsZW1lbnRzXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfd29ya2luZ1Zpc2libGVFbGVtZW50cygpe1xyXG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMuZ2V0QW5nbGVNZW51KCk7XHJcbiAgICAgICAgLy/Qo9C30L3QsNC10Lwg0LTQu9GPINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0LXQs9C+INGD0LPQvtC7INC90LAg0LrQvtGC0L7RgNC+0Lwg0L7QvSDQvdCw0YXQvtC00LjRgtGB0Y9cclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5hY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N3YXBFbGVtZW50KHRoaXMuZ2V0QW5nbGVMaXN0KGl0ZW0sIGFuZ2xlKSwgaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYW5nbGUgPSB0aGlzLmdldEFuZ2xlTWVudSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0YLQtNCw0LXRgiDRg9Cz0L7QuyDQvNC10L3Rji5cclxuICAgICAqIEBtZXRob2QgZ2V0QW5nbGVNZW51XHJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDRg9Cz0L7QuyDQv9C+0LLQvtGA0L7RgtCwINC+0YIgMCDQtNC+IDM2MC5cclxuICAgICAqL1xyXG4gICAgZ2V0QW5nbGVNZW51KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5yb3RhdGlvbiAtIDM2MCAqIE1hdGguZmxvb3IodGhpcy5ub2RlLnJvdGF0aW9uIC8gMzYwKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQoNCw0LHQvtGC0LDQtdGCINGBINGN0LvQtdC80LXQvdGC0LDQvNC4INCy0YvQutC70Y7Rh9Cw0Y8g0LjRhSDQuCDQv9C+0LTRgdGC0LDQstC70Y/Rj9GPINC30LAg0LzQtdGB0YLQviDQvdC40YUg0LTRgNGD0LPQuNC1INGN0LXQu9C10LzQtdC90YLRiy5cclxuICAgICAqIEBtZXRob2QgX3N3YXBFbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUg0YPQs9C+0Lsg0L3QsCDQutC+0YLQvtGA0L7QvCDQvdCw0YXQvtC00LjRgtGB0Y8g0Y3Qu9C10LzQtdC90YIuXHJcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IGVsZW1lbnQg0Y3Qu9C10LzQtdC90YIv0LvQuNGB0YIg0LrQvtGC0L7RgNGL0Lkg0L3QtdC+0LHRhdC+0LTQuNC80L4g0LfQsNC80LXQvdC40YLRjCDQvdCwINGB0LvQtdC00YPRjtGJ0LjQuSDRjdC70LXQvNC10L3RgiDQuNC3INC+0YfQtdGA0LXQtNC4INC90LXQstC40LTQuNC80YvRhSDRjdC70LXQvNC10L3RgtC+0LIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc3dhcEVsZW1lbnQoYW5nbGUsIGVsZW1lbnQpe1xyXG4gICAgICAgIGlmIChhbmdsZSA+IHRoaXMuYW5nbGVUcmFuc2l0aW9uIC0gdGhpcy53aWR0aFRyYW5zaXRpb24gJiYgYW5nbGUgPCB0aGlzLmFuZ2xlVHJhbnNpdGlvbiArIHRoaXMud2lkdGhUcmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBhY3R1YWxMaXN0ID0gdGhpcy5fcG9vbEludmlzaWJsZUxpc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgYWN0dWFsTGlzdC5zZXRQb3NpdGlvbihjYy52MihlbGVtZW50LngsIGVsZW1lbnQueSkpO1xyXG4gICAgICAgICAgICBhY3R1YWxMaXN0LnJvdGF0aW9uID0gZWxlbWVudC5yb3RhdGlvbjtcclxuICAgICAgICAgICAgYWN0dWFsTGlzdC5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9wb29sSW52aXNpYmxlTGlzdC5wdXNoKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9hcnJheUFuZ2xlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pdGVtLm5hbWUgPT09IGVsZW1lbnQubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uaXRlbSA9IGFjdHVhbExpc3Q7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgKHRoaXMuX3N0YXRlRGlyZWN0aW9uID09PSBNb3ZlQ2lyY3VsYXIuY2xvY2t3aXNlKSA/IHRoaXMubm9kZS5yb3RhdGlvbiArPSB0aGlzLndpZHRoVHJhbnNpdGlvbiA6IHRoaXMubm9kZS5yb3RhdGlvbiAtPSB0aGlzLndpZHRoVHJhbnNpdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YPQs9C+0Lsg0Y3Qu9C10LzQtdC90YLQsC/Qu9C40YHRgtCwINC/0L7QtCDQutC+0YLQvtGA0YvQvCDQvtC9INC90LDRhdC+0LTQuNGC0YHRjy5cclxuICAgICAqIEBtZXRob2QgZ2V0QW5nbGVMaXN0XHJcbiAgICAgKiBAcGFyYW0ge2NjLk5vZGV9IGVsZW1lbnQg0L3QvtC0INGN0LvQtdC80LXQvdGC0LAuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYW5nbGUg0YPQs9C+0Lsg0L/QvtCy0L7RgNC+0YLQsCDQvNC10L3Rji5cclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g0YPQs9C+0Lsg0LvQuNGB0YLQsC/RjdC70LXQvNC10L3RgtCwINC80LXQvdGOLlxyXG4gICAgICovXHJcbiAgICBnZXRBbmdsZUxpc3QoZWxlbWVudCwgYW5nbGUpe1xyXG4gICAgICAgIGxldCBvYmogPSB0aGlzLl9hcnJheUFuZ2xlTGlzdC5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXRlbS54ID09PSBlbGVtZW50LnggJiYgaXRlbS5pdGVtLnkgPT09IGVsZW1lbnQueTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgb2JqID0gb2JqWzBdLmFuZ2xlIC0gYW5nbGU7XHJcbiAgICAgICAgb2JqIC09IE1hdGguZmxvb3Iob2JqIC8gMzYwKSAqIDM2MDtcclxuICAgICAgICByZXR1cm4gb2JqO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCj0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINGB0L7RgdGC0L7Rj9C90LjQtSDQtNCy0LjQttC10L3QuNGPINC80LXQvdGOINCyINC30LDQstC40YHQuNC80L7RgdGC0Lgg0L7RgiDQvdCw0L/RgNCw0LLQu9C10L3QuNGPINC/0L7QstC+0YDQvtGC0LAuXHJcbiAgICAgKiBAbWV0aG9kIF9zZXREaXJlY3Rpb25cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9zZXREaXJlY3Rpb24oKXtcclxuICAgICAgICBpZiAodGhpcy5ub2RlLnJvdGF0aW9uID4gdGhpcy5fcHJldlJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlRGlyZWN0aW9uID0gTW92ZUNpcmN1bGFyLmNsb2Nrd2lzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMubm9kZS5yb3RhdGlvbiA8IHRoaXMuX3ByZXZSb3RhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZURpcmVjdGlvbiA9IE1vdmVDaXJjdWxhci5hbnRpY2xvY2t3aXNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wcmV2Um90YXRpb24gPSB0aGlzLm5vZGUucm90YXRpb247XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHRgtCw0LHQuNC70LjQt9C40YDRg9C10YIg0Y3Qu9C10LzQtdC90YLRiyDQvNC10L3RjiDQv9C+INC/0L7Qu9C+0LbQtdC90LjRjiDQuiDQs9C+0YDQuNC30L7QvdGC0YMuXHJcbiAgICAgKiBAbWV0aG9kIHN0YWJpbGl6YXRpb25FbGVtZW50c1xyXG4gICAgICovXHJcbiAgICBzdGFiaWxpemF0aW9uRWxlbWVudHMoKXtcclxuICAgICAgICB0aGlzLm5vZGUuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLnJvdGF0aW9uID0gLXRoaXMubm9kZS5yb3RhdGlvbjtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQv9C10YDQstC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQvtC60YDRg9C20L3QvtGB0YLQuC4g0KDQsNGB0L/QvtC30L3QsNC10YIg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsCDQuCDQv9GA0LjQvNC10L3Rj9C10YIg0YHQvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQv9C+0LLQtdC00LXQvdC40LUuXHJcbiAgICAgKiDQlNC70Y8g0L7QsdC10YHQv9C10YfQtdC90LjRjyDQstGA0LDRidC10L3QuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gICAgICogQG1ldGhvZCBfb2JyMVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgg0LTQtdC70YzRgtCwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29icjEoeCwgeSl7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uIC09IHk7XHJcbiAgICAgICAgdGhpcy5zdGFiaWxpemF0aW9uRWxlbWVudHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDQstGC0L7RgNC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQutGA0YPQs9CwLiDQoNCw0YHQv9C+0LfQvdCw0LXRgiDQtNCy0LjQttC10L3QuNC1INGC0LDRh9CwINC4INC/0YDQuNC80LXQvdGP0LXRgiDRgdC+0YLQstC10YLRgdGC0LLRg9GO0YnQtdC1INC/0L7QstC10LTQtdC90LjQtS5cclxuICAgICAqINCU0LvRjyDQvtCx0LXRgdC/0LXRh9C10L3QuNGPINCy0YDQsNGJ0LXQvdC40Y8g0L7QutGA0YPQttC90L7RgdGC0Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwuXHJcbiAgICAgKiBAbWV0aG9kIF9vYnIyXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCDQtNC10LvRjNGC0LAg0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQv9C+INC+0YDQtNC40L3QsNGC0LUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb2JyMih4LCB5KXtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gKz0geDtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gKz0geTtcclxuICAgICAgICB0aGlzLnN0YWJpbGl6YXRpb25FbGVtZW50cygpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INGC0YDQtdGC0YzQtdC5INGH0LXRgtCy0LXRgNGC0Lgg0LrRgNGD0LPQsC4g0KDQsNGB0L/QvtC30L3QsNC10YIg0LTQstC40LbQtdC90LjQtSDRgtCw0YfQsCDQuCDQv9GA0LjQvNC10L3Rj9C10YIg0YHQvtGC0LLQtdGC0YHRgtCy0YPRjtGJ0LXQtSDQv9C+0LLQtdC00LXQvdC40LUuXHJcbiAgICAgKiDQlNC70Y8g0L7QsdC10YHQv9C10YfQtdC90LjRjyDQstGA0LDRidC10L3QuNGPINC+0LrRgNGD0LbQvdC+0YHRgtC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gICAgICogQG1ldGhvZCBfb2JyM1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHgg0LTQtdC70YzRgtCwINC/0L4g0LDQsdGG0LjRgdGB0LUuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSDQtNC10LvRjNGC0LAg0L/QviDQvtGA0LTQuNC90LDRgtC1LlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29icjMoeCwgeSl7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uIC09IHg7XHJcbiAgICAgICAgdGhpcy5ub2RlLnJvdGF0aW9uICs9IHk7XHJcbiAgICAgICAgdGhpcy5zdGFiaWxpemF0aW9uRWxlbWVudHMoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRh9C10YLQstC10YDRgtC+0Lkg0YfQtdGC0LLQtdGA0YLQuCDQutGA0YPQs9CwLiDQoNCw0YHQv9C+0LfQvdCw0LXRgiDQtNCy0LjQttC10L3QuNC1INGC0LDRh9CwINC4INC/0YDQuNC80LXQvdGP0LXRgiDRgdC+0YLQstC10YLRgdGC0LLRg9GO0YnQtdC1INC/0L7QstC10LTQtdC90LjQtS5cclxuICAgICAqINCU0LvRjyDQvtCx0LXRgdC/0LXRh9C10L3QuNGPINCy0YDQsNGJ0LXQvdC40Y8g0L7QutGA0YPQttC90L7RgdGC0Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10LwuXHJcbiAgICAgKiBAbWV0aG9kIF9vYnI0XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCDQtNC10LvRjNGC0LAg0L/QviDQsNCx0YbQuNGB0YHQtS5cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5INC00LXQu9GM0YLQsCDQv9C+INC+0YDQtNC40L3QsNGC0LUuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb2JyNCh4LCB5KXtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gLT0geDtcclxuICAgICAgICB0aGlzLm5vZGUucm90YXRpb24gLT0geTtcclxuICAgICAgICB0aGlzLnN0YWJpbGl6YXRpb25FbGVtZW50cygpO1xyXG4gICAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgeyBDaXJjdWxhckxpc3QgfTsiLCJpbXBvcnQgeyBBUElDb3JlIH1mcm9tICcuLi8uLi9idWlsZC9idWlsZC10cyc7XHJcbi8qKlxyXG4gKlxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBfbW9kZWw6IG51bGwsLy/QvNC+0LTQtdC70Ywg0LbQuNCy0L7RgtC90L7Qs9C+XHJcblxyXG4gICAgICAgIF9tYXhCaWFzVG91Y2g6IDE1LC8v0LzQsNC60YHQuNC80LDQu9GM0L3QvtC1INGB0LzQtdGJ0LXQvdC40LUg0YLQsNGH0LAg0LTQu9GPINC+0YLQutGA0YvRgtC40Y8g0LzQtdC90Y4gKHB4KVxyXG4gICAgICAgIF9wb2ludFRvdWNoRm9yTWVudTogY2MudjIsLy/RgtC+0YfQutCwINGB0YLQsNGA0YLQsCDRgtCw0YfQsCDQv9C+INC20LjQstC+0YLQvdC+0LzRg1xyXG5cclxuICAgICAgICBfaXNNb3ZlOiBmYWxzZSwvL9GE0LvQsNCzINC00LvRjyDQvtC/0YDQtdC00LXQu9C10L3QuNGPINC00LLQuNC20LXRgtGB0Y8g0LvQuCDQttC40LLQvtC90L7QtSDQt9CwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8XHJcbiAgICAgICAgX2lzT3Blbk1lbnU6IGZhbHNlLC8v0YTQu9Cw0LMg0LTQu9GPINC+0L/RgNC10LTQtdC70LXQvdC40Y8g0L7RgtC60YDRi9GC0L4g0LvQuCDQvNC10L3RjlxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQoKXtcclxuICAgICAgICB0aGlzLl9hcGkgPSBBUElDb3JlLmluc3RhbmNlKCk7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hTdGFydEFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0YHRgtGA0LDQuNCy0LDQtdGCINC00L7RgdGC0YPQv9C90YvQtSDQtNC10LnRgdGC0LLQuNGPINC/0LvRjtGI0LrQuCDQtNC70Y8g0LbQuNCy0L7RgtC90L7Qs9C+INC4INGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuICAgICAqL1xyXG4gICAgc2V0dGluZ3MocGFjayl7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwgPSB0aGlzLl9hcGkuY3JlYXRlQW5pbWFsKHBhY2sucHV0aFRvTW9kZWwsIHBhY2suaWQpOy8v0YHQvtC30LTQsNC10Lwg0LzQvtC00LXQu9GMINC20LjQstC+0YLQvdC+0LPQvlxyXG5cclxuICAgICAgICBjYy5sb2codGhpcy5ub2RlLmNoaWxkcmVuKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdDb2xsaWRlcih0aGlzLl9tb2RlbC5uYXZpZ2F0aW9uLnJhZGl1c1Zpc2lvbix0aGlzLm5vZGUuY2hpbGRyZW5bMF0uZ2V0Q29tcG9uZW50KGNjLkNpcmNsZUNvbGxpZGVyKSk7XHJcbiAgICAgICAgdGhpcy5zZXR0aW5nQ29sbGlkZXIodGhpcy5fbW9kZWwubmF2aWdhdGlvbi5yYWRpdXNIZWFyaW5nLHRoaXMubm9kZS5jaGlsZHJlblsxXS5nZXRDb21wb25lbnQoY2MuQ2lyY2xlQ29sbGlkZXIpKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdDb2xsaWRlcih0aGlzLl9tb2RlbC5uYXZpZ2F0aW9uLnJhZGl1c1NtZWxsLHRoaXMubm9kZS5jaGlsZHJlblsyXS5nZXRDb21wb25lbnQoY2MuQ2lyY2xlQ29sbGlkZXIpKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdDb2xsaWRlcih0aGlzLl9tb2RlbC5uYXZpZ2F0aW9uLnJhZGl1c1RvdWNoLHRoaXMubm9kZS5jaGlsZHJlblszXS5nZXRDb21wb25lbnQoY2MuQ2lyY2xlQ29sbGlkZXIpKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNGB0YLRgNCw0LjQstCw0LXRgiDQutC+0LvQu9Cw0LnQtNC10YDRiyDRgyDQttC40LLQvtGC0L3QvtCz0L4g0YHQvtCz0LvQsNGB0L3QviDQtdCz0L4g0LzQvtC00LXQu9C4XHJcbiAgICAgKiBAbWV0aG9kIHNldHRpbmdDb2xsaWRlclxyXG4gICAgICogQHBhcmFtIHtBbmltYWxzLlN5c3RlbXMuSVN5c3RlbX0gc3lzdGVtXHJcbiAgICAgKiBAcGFyYW0ge2NjLkNpcmNsZUNvbGxpZGVyfSBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgc2V0dGluZ0NvbGxpZGVyKHN5c3RlbSxjb21wb25lbnQpe1xyXG4gICAgICAgIHN5c3RlbT09PXVuZGVmaW5lZD9jb21wb25lbnQucmFkaXVzPTA6Y29tcG9uZW50LnJhZGl1cz1zeXN0ZW0uY3VycmVudDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQvdCw0YfQsNC70LAg0YLQsNGH0LBcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hTdGFydEFuaW1hbChldmVudCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3N0YXJ0TW90aW9uQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIHN0YXJ0TW90aW9uOiBjYy52Mih0aGlzLm5vZGUueCwgdGhpcy5ub2RlLnkpLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0aGlzLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7Ly/RgNCw0LfQvtGB0LvQsNC70Lgg0LXQstC10L3RglxyXG4gICAgICAgIHRoaXMuX2lzTW92ZSA9IGZhbHNlOy8v0LbQuNCy0L7RgtC90L7QtSDQvdC1INC00LLQuNC20LXRgtGB0Y8g0LfQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvFxyXG4gICAgICAgIHRoaXMuX3BvaW50VG91Y2hGb3JNZW51ID0gZXZlbnQuZ2V0TG9jYXRpb24oKTsvL9GB0YfQuNGC0LDQu9C4INGC0L7Rh9C60YMg0L/QtdGA0LLQvtCz0L4g0L3QsNC20LDRgtC40Y9cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQtNCy0LjQttC10L3QuNGPINGC0LDRh9CwLlxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaE1vdmVBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIC8vICAgY2MubG9nKGV2ZW50KTtcclxuICAgICAgICB2YXIgZGVsdGEgPSBldmVudC50b3VjaC5nZXREZWx0YSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pc0NoZWNrT25PcGVuTWVudShldmVudC5nZXRMb2NhdGlvbigpKSAmJiAhdGhpcy5faXNPcGVuTWVudSkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc01vdmUgPSB0cnVlO1xyXG4gICAgICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnbW90aW9uQW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICAgICAgZGVsdGFNb3Rpb246IGRlbHRhLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRFbmQ6IGV2ZW50LmdldExvY2F0aW9uKClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNGPINC30LDQstC10YDRiNC10L3QuNGPINGC0LDRh9CwXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9vblRvdWNoRW5kQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBpZiAodGhpcy5faXNNb3ZlKSB7XHJcbiAgICAgICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdlbmRNb3Rpb25BbmltYWwnLCB0cnVlKTtcclxuICAgICAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgICAgICBwb2ludEVuZDogZXZlbnQuZ2V0TG9jYXRpb24oKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzTW92ZSA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlZm9jdXNNZW51KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCf0YDQvtCy0LXRgNGP0LXRgiDQvtGC0LrRgNGL0LLQsNC10YLRgdGPINC80LXQvdGOINC40LvQuCDQvdC10YIuINCf0YPRgtC10Lwg0YHQutCw0L3QuNGA0L7QstCw0L3QuNGPINGC0L7Rh9C60Lgg0YLQsNGH0LAg0L3QsCDQstGL0YXQvtC00LfQsCDQv9GA0LXQtNC10LvRiyDQvtGCINC90LDRh9Cw0L/Qu9GM0L3QvtC5INGC0L7Rh9C60LhcclxuICAgICAqIEBwYXJhbSBwb2ludFxyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9pc0NoZWNrT25PcGVuTWVudShwb2ludCl7XHJcbiAgICAgICAgbGV0IFggPSBNYXRoLmFicyh0aGlzLl9wb2ludFRvdWNoRm9yTWVudS54IC0gcG9pbnQueCkgPiB0aGlzLl9tYXhCaWFzVG91Y2g7XHJcbiAgICAgICAgbGV0IFkgPSBNYXRoLmFicyh0aGlzLl9wb2ludFRvdWNoRm9yTWVudS55IC0gcG9pbnQueSkgPiB0aGlzLl9tYXhCaWFzVG91Y2g7XHJcbiAgICAgICAgcmV0dXJuIFggfHwgWTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC30LzQtdC90Y/QtdGCINGB0L7RgdGC0L7Rj9C90LjQtSDQvNC10L3RjlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3JlZm9jdXNNZW51KCl7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9ICF0aGlzLl9pc09wZW5NZW51O1xyXG4gICAgICAgICh0aGlzLl9pc09wZW5NZW51KSA/IHRoaXMuX3B1Ymxpc2hPcGVuTWVudUFuaW1hbCgpIDogdGhpcy5fcHVibGlzaENsb3NlTWVudUFuaW1hbCgpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0LrRgNGL0YLQuNC1INC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICovXHJcbiAgICBfcHVibGlzaE9wZW5NZW51QW5pbWFsKCl7XHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ29wZW5NZW51QW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHRoaXMsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQl9Cw0LrRgNGL0YLQviDQvNC10L3RjiDRgSDQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAqL1xyXG4gICAgX3B1Ymxpc2hDbG9zZU1lbnVBbmltYWwoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnY2xvc2VNZW51QW5pbWFsJywgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHRoaXMsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm5vZGUuZGlzcGF0Y2hFdmVudChteUV2ZW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntGC0LrRgNGL0YLQuNC1INC80LXQvdGOXHJcbiAgICAgKi9cclxuICAgIG9wZW5NZW51KCl7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fcHVibGlzaE9wZW5NZW51QW5pbWFsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JfQsNC60YDRi9GC0Ywg0LzQtdC90Y5cclxuICAgICAqL1xyXG4gICAgY2xvc2VNZW51KCl7XHJcbiAgICAgICAgdGhpcy5faXNPcGVuTWVudSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3B1Ymxpc2hDbG9zZU1lbnVBbmltYWwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0L7QsdGJ0LDQtdGCINC80L7QtNC10LvQuCDQtNC+INC60LDQutC+0Lkg0YLQvtGH0LrQuCDQvdCw0LTQviDQtNC+0LnRgtC4XHJcbiAgICAgKiBAcGFyYW0gcG9pbnRcclxuICAgICAqL1xyXG4gICAgbW92ZVRvUG9pbnQocG9pbnQpe1xyXG4gICAgICAgIHRoaXMuX21vZGVsLm1vdmVUb1BvaW50KHBvaW50KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQl9Cw0L/Rg9GB0LrQsNC10YIg0LbQuNC30L3RjCDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAqIEBtZXRob2QgcnVuXHJcbiAgICAgKi9cclxuICAgIHJ1bigpe1xyXG4gICAgICAgIHRoaXMuX21vZGVsLnJ1bkxpZmUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C+0LTQsNGC0Ywg0LfQstGD0LpcclxuICAgICAqL1xyXG4gICAgcnVuVm9pY2UoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQtdGB0YLRjFxyXG4gICAgICovXHJcbiAgICBydW5TaXQoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjRgdC/0YPQs9Cw0YLRjNGB0Y9cclxuICAgICAqL1xyXG4gICAgcnVuRnJpZ2h0ZW4oKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC60LDQt9Cw0YLRjCDQsNGA0LXQsNC70YtcclxuICAgICAqL1xyXG4gICAgcnVuQXJlYWwoKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QvtC70LDRgdC60LDRgtGM0YHRj1xyXG4gICAgICovXHJcbiAgICBydW5DYXJlKCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCb0LXRh9GMXHJcbiAgICAgKi9cclxuICAgIHJ1bkxpZSgpe1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GA0LjQs9C+0YLQvtCy0LjRgtGM0YHRj1xyXG4gICAgICovXHJcbiAgICBydW5BdHRlbnRpb24oKXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0LzQsNGB0YHQuNCyINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6INGDINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICogQHJldHVybiB7Knxhbnl9XHJcbiAgICAgKi9cclxuICAgIGdldENoYXJhY3RlcmlzdGljcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXRDaGFyYWN0ZXJpc3RpY3MoKTtcclxuICAgIH1cclxuXHJcbn0pOyIsImNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMub25Ub3VjaFN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLm9uVG91Y2hNb3ZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNC10LnRgdGC0LLQuNGPINC90LAg0L3QsNC20LDRgtC40LUg0L/QviDQt9Cy0LXRgNGO0YjQutC1INC/0L7RgdC70LUg0YHQvtC30LTQsNC90LjRjyDQt9Cy0LXRgNGO0YjQutC4XHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50KXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnc3RhcnREcmFnQW5kRHJvcEFuaW1hbCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge1xyXG4gICAgICAgICAgICBhbmltYWw6IHRoaXMubm9kZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsNC00LLQuNC20LXQvdC40LUg0LfQsNC20LDRgtC+0Lkg0LfQstC10YDRjtGI0LrQuCDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0LfQstC10YDQsdGI0LrQuFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hNb3ZlKGV2ZW50KXtcclxuICAgICAgICB2YXIgZGVsdGEgPSBldmVudC50b3VjaC5nZXREZWx0YSgpO1xyXG4gICAgICAgIHRoaXMubm9kZS54ICs9IGRlbHRhLng7XHJcbiAgICAgICAgdGhpcy5ub2RlLnkgKz0gZGVsdGEueTtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSgnZHJhZ0FuZERyb3BBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgcG9pbnQ6IHt4OiB0aGlzLm5vZGUueCwgeTogdGhpcy5ub2RlLnl9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjQtSDQvdCwINC30LDQstC10YDRiNC10L3QuNC1INC90LDQttCw0YLQuNGPINC/0L4g0LfQstC10YDRjtGI0LrQtSDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0LfQstC10YDRjtGI0LrQuFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmQoZXZlbnQpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdzdG9wRHJhZ0FuZERyb3BBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHtcclxuICAgICAgICAgICAgcG9pbnQ6IHt4OiB0aGlzLm5vZGUueCwgeTogdGhpcy5ub2RlLnl9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcblxyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEZJUkNvcnAgb24gMDQuMDMuMjAxNy5cclxuICovXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF9maWN0aXRpb3VzUG9pbnQ6IG51bGwsLy/QotC+0YfQutCwINC00LvRjyDRhNC40LrRgdCw0YbQuNC4INC00LLQuNC20LXQvdC40Y8g0LrQsNGA0YLRiy4g0J/QvtC80L7Qs9Cw0LXRgiDRgNCw0LfQu9C40YfQsNGC0Ywg0YHQvtCx0YvRgtC40LUg0LTQstC40LbQtdC90LjQtSDQvtGCINC30LDQstC10YDRiNC10L3QuNGPXHJcbiAgICAgICAgX2lzVG91Y2hTdGFydDogbnVsbCwvL9Ck0LvQsNCzINC30LDQv9GD0YnQtdC9INC70Lgg0YLQsNGHXHJcbiAgICAgICAgX2NvbnRyb2xsZXJTY3JvbGxNYXA6IG51bGwsXHJcbiAgICAgICAgX2FjdGlvbk1vdmVNYXA6IG51bGwsLy/QtNC10LnRgdGC0LLQuNC1INC00LLQuNC20LXQvdC40Y8g0LrQsNGA0YLRi1xyXG4gICAgICAgIF9tYXhTaXplTWFwU2Nyb2xsOiBudWxsLC8v0YDQsNC30LzQtdGAIG9mZnNldCDRgdC60YDQvtC70LvQsC4g0L/QvtC80L7QttC10YIg0L/RgNC4INC/0LXRgNC10LzQtdGJ0LXQvdC40Lgg0LrQsNC80LXRgNGLINC+0YIg0LfQstC10YDRjtGI0LrQuCDQuiDQt9Cy0LXRgNGO0YjQutC1XHJcblxyXG4gICAgICAgIG1heEJpYXNUb3VjaDogMTUsLy/QvNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0YHQvNC10YnQtdC90LjQtSDRgtCw0YfQsCDQtNC70Y8g0L7Qv9GA0LXQtNC10LvQtdC90LjRjyDRh9GC0L4g0LrQsNGA0YLQsCDQtNCy0LjQttC10YLRgdGPXHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLm9uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5vblRvdWNoTW92ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLm9uVG91Y2hFbmQuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2lzVG91Y2hTdGFydCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJTY3JvbGxNYXAgPSB0aGlzLm5vZGUucGFyZW50LnBhcmVudC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldyk7XHJcbiAgICAgICAgdGhpcy5fZmljdGl0aW91c1BvaW50ID0gY2MudjIoMCwgMCk7XHJcbiAgICAgICAgdGhpcy5fbWF4U2l6ZU1hcFNjcm9sbCA9IHRoaXMuX2NvbnRyb2xsZXJTY3JvbGxNYXAuZ2V0TWF4U2Nyb2xsT2Zmc2V0KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtCx0YvRgtC40LUg0L/QvtGA0LDQttC00LDRjtGJ0LjQtdGB0Y8g0YHQutGA0L7Qu9C+0LxcclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtSDQutC+0YLQvtGA0L7QtSDQu9C+0LLQuNGCINGB0LrRgNC+0LtcclxuICAgICAqL1xyXG4gICAgb25FdmVudFNjcm9sbChldmVudCkge1xyXG4gICAgICAgIGxldCBwb2ludCA9IGV2ZW50LmdldFNjcm9sbE9mZnNldCgpO1xyXG4gICAgICAgIGxldCBsb2dSZXogPSBwb2ludC54ID09PSB0aGlzLl9maWN0aXRpb3VzUG9pbnQueCAmJiBwb2ludC55ID09PSB0aGlzLl9maWN0aXRpb3VzUG9pbnQueTtcclxuICAgICAgICAobG9nUmV6ICYmIHRoaXMuX2lzVG91Y2hTdGFydCkgPyB0aGlzLm9uVG91Y2hFbmQoZXZlbnQpIDogdGhpcy5fZmljdGl0aW91c1BvaW50ID0gcG9pbnQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtCy0LjRjyDQvdCwINC/0YDQuNC60L7RgdC90L7QstC10L3QuNC1INC6INC60LDRgNGC0LVcclxuICAgICAqIEBwYXJhbSBldmVudCDRgdC+0LHRi9GC0LjQtSDQutC+0YLQvtGA0L7QtSDQv9C+0LnQvNCw0LXRgiDRjdGC0L7RgiDRgdC60YDQuNC/0YJcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNUb3VjaFN0YXJ0ID0gdHJ1ZTtcclxuICAgICAgICAvL9C30LDQv9C+0LzQvdC40LzQv9C+0LfQuNGG0LjRjyDQvdCw0YfQsNC70LAg0Y3QstC10L3RgtCwXHJcbiAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3RvdWNoT25NYXAnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LXQudGB0YLQstC40Y8g0L3QsCDQtNCy0LjQttC10L3QuNC1IHRvdWNoINC/0L4g0LrQsNGA0YLQtVxyXG4gICAgICogQHBhcmFtIGV2ZW50INGB0L7QsdGL0YLQuNC1INC60L7RgtC+0YDQvtC1INC/0L7QudC80LDQtdGCINGN0YLQvtGCINGB0LrRgNC40L/RglxyXG4gICAgICovXHJcbiAgICBvblRvdWNoTW92ZShldmVudCkge1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCd0b3VjaE1vdmVPbk1hcCcsIHRydWUpO1xyXG4gICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgdGhpcy5ub2RlLmRpc3BhdGNoRXZlbnQobXlFdmVudCk7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JTQtdC50YHRgtC40Y8g0L3QsCDQvtGC0LrQv9GD0YHQutCw0L3QuNC1IHRvdWNoINC+0YIg0LrQsNGA0YLRi1xyXG4gICAgICogQHBhcmFtIGV2ZW50INGB0L7QsdGL0YLQuNC1INC60L7RgtC+0YDQvtC1INC/0L7QudC80LDQtdGCINGB0LrRgNC+0Lsg0LvQuNCx0L4g0Y3RgtC+0YIg0YHQutGA0LjQv9GCXHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmQoZXZlbnQpIHtcclxuICAvLyAgICAgIGNjLmxvZyhldmVudCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVG91Y2hTdGFydCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1RvdWNoU3RhcnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbGV0IG15RXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRDdXN0b20oJ3RvdWNoRW5kTW92ZU9uTWFwJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIG15RXZlbnQuZGV0YWlsID0ge307XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAvLyAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmtC+0L3QstC10L3RgtC40YDRg9C10YIg0YLQvtGH0LrRgyDQvtC60L3QsCDQsiDRgtC+0YfQutGDINC60LDRgNGC0YtcclxuICAgICAqIEBwYXJhbSBwb2ludCDRgtC+0YfQutCwINCyINC+0LrQvdC1XHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn0g0YLQvtGH0LrQsCDQvdCwINC60LDRgNGC0LVcclxuICAgICAqL1xyXG4gICAgZ2V0UG9pbnRNYXAocG9pbnQpIHtcclxuICAgICAgICBsZXQgbmV3WCA9IHBvaW50LnggLSB0aGlzLm5vZGUueDtcclxuICAgICAgICBsZXQgbmV3WSA9IHBvaW50LnkgLSB0aGlzLm5vZGUueTtcclxuICAgICAgICByZXR1cm4gY2MudjIobmV3WCwgbmV3WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtC90LLQtdGA0YLQuNGA0YPQtdGCINGC0L7Rh9C60YMg0LIg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0L7QutC90LBcclxuICAgICAqIEBwYXJhbSBwb2ludCDRgtC+0YfQutCwINC90LAg0LrQsNGA0YLQtVxyXG4gICAgICogQHJldHVybnMge1ZlYzJ9INGC0L7Rh9C60LAg0LIg0L7QutC90LVcclxuICAgICAqL1xyXG4gICAgZ2V0UG9pbnRXaW5kb3cocG9pbnQpIHtcclxuICAgICAgICBsZXQgbmV3WCA9IHBvaW50LnggKyB0aGlzLm5vZGUueDtcclxuICAgICAgICBsZXQgbmV3WSA9IHBvaW50LnkgKyB0aGlzLm5vZGUueTtcclxuICAgICAgICByZXR1cm4gY2MudjIobmV3WCwgbmV3WSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JLQvtC30LLRgNCw0YnQsNC10YIg0YLQvtGH0LrRgyDQutCw0YDRgtGLINC40Lcg0YHQuNGB0YLQtdC80Ysg0LrQvtC+0YDQtNC40L3QsNGCINGB0LrRgNC+0LvQu9CwXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg0LjRgdGF0L7QtNC90LDRjyDRgtC+0YfQutCwXHJcbiAgICAgKiBAcmV0dXJucyB7VmVjMn1cclxuICAgICAqL1xyXG4gICAgZ2V0UG9pbnRNYXBPZk9mZnNldChwb2ludCl7XHJcbiAgICAgICAgbGV0IG5ld1kgPSB0aGlzLl9tYXhTaXplTWFwU2Nyb2xsLnkgLSBwb2ludC55O1xyXG4gICAgICAgIHJldHVybiBjYy52Mihwb2ludC54LCBuZXdZKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LLQtdGA0YLQuNGA0YPQtdGCINGC0L7Rh9C60YNcclxuICAgICAqIEBwYXJhbSBwb2ludCDQuNGB0YXQvtC00L3QsNGPINGC0L7Rh9C60LBcclxuICAgICAqIEByZXR1cm5zIHtWZWMyfVxyXG4gICAgICovXHJcbiAgICBnZXRJbnZlcnRQb2ludChwb2ludCl7XHJcbiAgICAgICAgbGV0IG5ld1ggPSAtcG9pbnQueDtcclxuICAgICAgICBsZXQgbmV3WSA9IC1wb2ludC55O1xyXG4gICAgICAgIHJldHVybiBjYy52MihuZXdYLCBuZXdZKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNCy0LjQttC10L3QuNC1INC60LDQvNC10YDRiyDQstC90LXQutC+0YLQvtGA0YPRjiDRgtC+0YfQutGDINC90LAg0L7RgdC90L7QstC1INC80LXRgtC+0LTQsCDQtNCy0LjQttC10L3QuNGPINGB0LrRgNC+0LvQu9CwLiDQoSDQuNGB0L/QvtC70YzQt9C+0LLQsNC90LjQtdC8INC10LPQviDRgdC40YHRgtC10LzRiyDQutC+0L7RgNC00LjQvdCw0YJcclxuICAgICAqIEBwYXJhbSBwb2ludCDRgtC+0YfQutCwINCyINC60L7RgtC+0YDRg9GOINC90LXQvtCx0YXQvtC00LjQvNC+INC/0LXRgNC10LnRgtC4XHJcbiAgICAgKiBAcGFyYW0gdGltZSDQstGA0LXQvNGPINC30LAg0LrRgtC+0YDQvtC1INC/0YDQvtC40LfQstC+0LTQuNGC0YHRjyDQv9C10YDQtdGF0L7QtFxyXG4gICAgICovXHJcbiAgICBtb3ZlKHBvaW50LCB0aW1lID0gMCl7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlclNjcm9sbE1hcC5zY3JvbGxUb09mZnNldCh0aGlzLmdldFBvaW50TWFwT2ZPZmZzZXQocG9pbnQpLCB0aW1lKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQlNCy0LjQttC10L3QuNC1INC60LDRgNGC0Ysg0LIg0L3QtdC60L7RgtC+0YDRg9GOINGC0L7Rh9C60YMg0L3QsCDQvtGB0L3QvtCy0LUgYWN0aW9uc1xyXG4gICAgICogQHBhcmFtIHBvaW50XHJcbiAgICAgKiBAcGFyYW0gdGltZVxyXG4gICAgICovXHJcbiAgICBtb3ZlQWN0aW9ucyhwb2ludCwgdGltZSA9IDApe1xyXG4gICAgICAgIHRoaXMubm9kZS5zdG9wQWN0aW9uKHRoaXMuX2FjdGlvbk1vdmVNYXApO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbk1vdmVNYXAgPSBjYy5tb3ZlVG8odGltZSwgdGhpcy5nZXRJbnZlcnRQb2ludChwb2ludCkpO1xyXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oXHJcbiAgICAgICAgICAgIGNjLnNlcXVlbmNlKHRoaXMuX2FjdGlvbk1vdmVNYXAsIGNjLmNhbGxGdW5jKHRoaXMuX3B1Ymxpc2hGaW5pc2hNb3ZlQ2VudHJlVG9BbmltYWwsIHRoaXMpKVxyXG4gICAgICAgICk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/Rg9Cx0LvQuNC60YPQtdGCINGB0L7QsdGL0YLQuNC1INC30LDQstC10YDRiNC10L3QuNGPINC00LLQuNC20LXQvdC40Y8g0LrQsNC80LXRgNGLINC00L4g0LbQuNCy0L7RgtC90L7Qs9C+INC4INGE0LjQutGB0LjRgNC+0LLQsNC90LjQtSDQtdCz0L4g0L/QviDRhtC10L3RgtGA0YMg0Y3QutGA0LDQvdCwXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfcHVibGlzaEZpbmlzaE1vdmVDZW50cmVUb0FuaW1hbCgpe1xyXG4gICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdmaW5pc2hNb3ZlQ2FtZXJhVG9BbmltYWwnLCB0cnVlKTtcclxuICAgICAgICBteUV2ZW50LmRldGFpbCA9IHt9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcblxyXG59KTtcclxuIiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgRklSQ29ycCBvbiAzMS4wMy4yMDE3LlxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX01PVkUsIHRoaXMub25Ub3VjaE1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vblRvdWNoRW5kLmJpbmQodGhpcykpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50KXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblRvdWNoTW92ZShldmVudCl7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaEVuZChldmVudCl7XHJcblxyXG4gICAgfSxcclxufSk7XHJcbiIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEZJUkNvcnAgb24gMTYuMDQuMjAxNy5cclxuICovXHJcblxyXG4vKipcclxuICog0JrQvtC90YLRgNC+0LvQu9C10YAg0YHQutGA0L7Qu9C70LAg0YXQsNGA0LDQutGC0LjRgNC40YHRgtC40LouINCf0YDQvtC40LfQstC+0LTQuNGCINGA0LXQs9GD0LvQuNGA0L7QstC60YMg0Y3Qu9C10LzQtdC90YLQvtCyINCx0L7QutGB0LAg0YXQsNGA0LDRgtC10YDQuNGB0YLQuNC6LiDQktGL0L/QvtC70L3Rj9C10YIg0L7Qv9C10YDQsNGG0LjQuCDRgdCy0Y/Qt9Cw0L3QvdGL0LUg0YEg0YDQtdCz0YPQu9C40YDQvtCy0LrQvtC5INC90L7QtNC+0LIg0LTQu9GPINC+0LHQtdGB0L/QtdGH0LXQvdC40Y8g0LjQu9C70Y7Qt9C40Lgg0LLRgNCw0YnQtdC90LjRjyDQsdCw0YDQsNCx0LDQvdCwINC60YPQtNCwINC90LDQutGA0YPRh9C40LLQsNC10YLRgdGPL9C+0YLQutGD0LTQsCDRgdC60YDRg9GH0LjQstCw0LXRgtGB0Y8g0YHQv9C40YHQvtC6INGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6LlxyXG4gKiBAY2xhc3MgQ2hhcmFjdGVyaXN0aWNzU2Nyb2xsQm94Q29udHJvbGxlclxyXG4gKi9cclxudmFyIENoYXJhY3RlcmlzdGljc1Njcm9sbEJveENvbnRyb2xsZXIgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIG5vZGVDb2lsOiBjYy5Ob2RlLC8v0L3QvtC0INC/0LDQu9C60LhcclxuICAgICAgICBub2RlUm9sbDogY2MuTm9kZSwvL9C90L7QtCDQsdC70LXRgdC60LBcclxuICAgICAgICBub2RlQ29udGVudDogY2MuTm9kZSwvLyDQvdC+0LQg0LrQvtC90YLQtdC90YLQsFxyXG4gICAgICAgIGJvdHRvbVBvaW50U3RhcnRSb3RhdGlvbjogMjgxLC8v0L3QuNC20L3Rj9GPINC60L7RgNC00LjQvdCwINGB0YLQsNGA0YLQsCDQv9C+0LLQvtGA0L7RgtCwXHJcbiAgICAgICAgdG9wUG9pbnRTdGFydFJvdGF0aW9uOiAzNjEsLy/QstC10YDRhdC90Y/RjyDQutC+0YDQtNC40L3QsCDRgdGC0LDRgNGC0LAg0L/QvtCy0L7RgNC+0YLQsFxyXG4gICAgICAgIF9pbnRlcnZhbDogMCwvL9C00LvQuNC90L3QsCDQv9GA0L7QvNC10LbRg9GC0LrQsCDQtNC70Y8g0YHQttC40YLQuNGPINC/0LDRgNC10LzQtdC90L3Ri9GFXHJcbiAgICAgICAgX3N0YXJ0UG9zQ29udGVudDogbnVsbCwvL9GB0YLQsNGA0YLQvtCy0LDRjyDQv9C+0LfQuNGG0LjRjyDQutC+0L3RgtC10L3RgtCwINCx0L7QutGB0LAhIVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC90LAg0LfQsNCz0YDRg9C30LrRgyDRgdGG0LXQvdGLLlxyXG4gICAgICogQG1ldGhvZCBvbkxvYWRcclxuICAgICAqL1xyXG4gICAgb25Mb2FkKCl7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoU3RhcnQuYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0L/QviDQt9Cw0L/Rg9GB0LrRgyDRjdC70LXQvNC10L3RgtCwXHJcbiAgICAgKiBAbWV0aG9kIHN0YXJ0XHJcbiAgICAgKi9cclxuICAgIHN0YXJ0KCl7XHJcbiAgICAgICAgbGV0IGxhID0gdGhpcy5ub2RlQ29udGVudC5nZXRDb21wb25lbnQoY2MuTGF5b3V0KTtcclxuICAgICAgICB0aGlzLl9zdGVwID0gbGEuc3BhY2luZ1k7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRQb3NDb250ZW50ID0gdGhpcy5ub2RlQ29udGVudC55O1xyXG4gICAgICAgIHRoaXMuX2ludGVydmFsID0gdGhpcy50b3BQb2ludFN0YXJ0Um90YXRpb24gLSB0aGlzLmJvdHRvbVBvaW50U3RhcnRSb3RhdGlvbjtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdGC0LDRgNGC0LAg0YLQsNGH0LBcclxuICAgICAqIEBtZXRob2QgX29uVG91Y2hTdGFydFxyXG4gICAgICogQHBhcmFtIGV2ZW50XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfb25Ub3VjaFN0YXJ0KGV2ZW50KXtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JXQstC10L3RgiDQtNCy0LjQttC10L3QuNGPINGB0LrRgNC+0LvQu9CwLiDQntCx0YDQsNCx0LDRgtGL0LLQsNC10YIg0LLRgNCw0YnQtdC90LjQuCDQsdC+0LrRgdCwINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6LtCf0YDQvtC40LfQstC+0LTQuNGCINGB0LbQsNGC0LjQtSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQvdCwINC40L3RgtC10YDQstCw0LvQtVxyXG4gICAgICogQG1ldGhvZCBvbk1vdmVTY3JvbGxcclxuICAgICAqIEBwYXJhbSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbk1vdmVTY3JvbGwoZXZlbnQpe1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFBvaW50Q29udGVudCA9IGV2ZW50LmdldENvbnRlbnRQb3NpdGlvbigpO1xyXG4gICAgICAgIGxldCBiYWlzID0gTWF0aC5hYnMoY3VycmVudFBvaW50Q29udGVudC55IC0gdGhpcy5fc3RhcnRQb3NDb250ZW50KTtcclxuICAgICAgICBsZXQgdnIgPSAwO1xyXG4gICAgICAgIGlmIChjdXJyZW50UG9pbnRDb250ZW50LnkgPiB0aGlzLl9zdGFydFBvc0NvbnRlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlQ29udGVudC5jaGlsZHJlbi5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFBvaW50SXRlbSA9IHRoaXMuX3N0YXJ0UG9zQ29udGVudCAtIHZyICsgYmFpcztcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UG9pbnRJdGVtID4gdGhpcy5ib3R0b21Qb2ludFN0YXJ0Um90YXRpb24gJiYgY3VycmVudFBvaW50SXRlbSA8IHRoaXMudG9wUG9pbnRTdGFydFJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zY2FsZVkgPSB0aGlzLl9nZXRTY2FsZUl0ZW0oY3VycmVudFBvaW50SXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uc2NhbGVZID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZyICs9IHRoaXMuX3N0ZXAgKyBpdGVtLmhlaWdodDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCS0L7Qt9Cy0YDQsNGJ0LDQtdGCINC60L7RjdGE0YTQuNGG0LXQvdGCINGB0LbQsNGC0LjRjy4g0JrQvtGC0L7RgNGL0Lkg0YDQsNGB0YfQuNGC0YvQstCw0LXRgtGB0Y8g0L3QsCDQvtGB0L3QvtCy0LUg0L/RgNC+0LzQtdC20YPRgtC60LAg0Lgg0YLQtdC60YPRidC10LPQviDQv9C+0LvQvtC20LXQvdC40Y8g0LIg0Y3RgtC+0Lwg0L/RgNC+0LzQtdC20YPRgtC60LUuXHJcbiAgICAgKiBAbWV0aG9kIF9nZXRTY2FsZUl0ZW1cclxuICAgICAqIEBwYXJhbSBjdXJyZW50UG9pbnQg0YLQtdC60YPRidC10LUg0L/QvtC70L7QttC10L3QuNC1INC/0LDRgNCw0LzQtdGC0YDQsCDQv9C+INC+0YHQuCDQvtGA0LTQuNC90LDRglxyXG4gICAgICogQHJldHVybnMge251bWJlcn0g0LrQvtGN0YTRhNC40YbQtdC90YIg0YHQttCw0YLQuNGPINC00LvRjyDQv9Cw0YDQsNC80LXRgtGA0LBcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9nZXRTY2FsZUl0ZW0oY3VycmVudFBvaW50KXtcclxuICAgICAgICBsZXQgayA9IDEgLSAoKDEwMCAqIChjdXJyZW50UG9pbnQgLSB0aGlzLmJvdHRvbVBvaW50U3RhcnRSb3RhdGlvbikpIC8gdGhpcy5faW50ZXJ2YWwpIC8gMTAwO1xyXG4gICAgICAgIHJldHVybiAoayA+IDEgfHwgayA8IDApID8gMSA6IGs7XHJcbiAgICB9LFxyXG5cclxufSk7IiwidmFyIEZhY3RvcnlBbmltYWxQcmVmYWIgPSBjYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIF90YXJnZXRBbmltYWw6IGNjLk5vZGUsXHJcbiAgICAgICAgd2F5VG9QcmVmYWI6J3ByZWZhYnMvYW5pbWFsL0xpb25TaGVhdGgnLFxyXG4gICAgICAgIHdheVRvTW9kZWw6ICcuL21vZGVsJywvL9Cf0YPRgtGMINC00L4g0LzQvtC00LXQu9C4XHJcbiAgICAgICAgbmFtZUFuaW1hbDogJ2FuaW1hbCcsLy/QmNC80Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC10YIg0LbQuNCy0L7RgtC90L7QtVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgY3JlYXRlQW5pbWFsKGV2ZW50KSB7XHJcbiAgICAgIC8vICBjYy5sb2coZXZlbnQpO1xyXG4gICAgICAgLy8gbGV0IHBvaW50VG91Y2ggPSBldmVudC5nZXRTdGFydExvY2F0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fY3JlYXRlUHJlZmFiKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0KHQvtC30LTQsNC10YIg0L/RgNC10YTQsNCxINCyINC90YPQttC90L7QvCDQutC+0L3RgtC10L3RgtC1XHJcbiAgICAgKiBAc2VlIHtzdHJpbmd9IHdheVRvUHJlZmFiINC/0YPRgtGMINC00L4g0L/RgNC10YTQsNCx0LBcclxuICAgICAqL1xyXG4gICAgX2NyZWF0ZVByZWZhYigpIHtcclxuICAgICAgICBjYy5sb2FkZXIubG9hZFJlcyh0aGlzLndheVRvUHJlZmFiLCAoZXJyLCBwcmVmYWIpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBteUV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKCdjcmVhdGVBbmltYWwnLCB0cnVlKTtcclxuICAgICAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgICAgICBhbmltYWw6IHRoaXMuX3NldHRpbmdzQW5pbWFsKHRoaXMuX3RhcmdldEFuaW1hbCksXHJcbiAgICAgICAgICAgICAgICBwdXRoVG9Nb2RlbDp0aGlzLndheVRvTW9kZWwsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbm9kZUFuaW1hbFxyXG4gICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBfc2V0dGluZ3NBbmltYWwobm9kZUFuaW1hbCl7XHJcbiAgICAgICAgbm9kZUFuaW1hbC5uYW1lPXRoaXMubmFtZUFuaW1hbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGVBbmltYWw7XHJcbiAgICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCB7IEZhY3RvcnlBbmltYWxQcmVmYWJ9OyIsImltcG9ydCB7IENpcmN1bGFyTGlzdCB9IGZyb20gJy4vY2lyY3VsYXItbGlzdCc7XHJcblxyXG4vKipcclxuICog0JvQuNGB0YIg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gKiBAY2xhc3MgTGlzdFxyXG4gKi9cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICBtYW5hZ2VyOiBDaXJjdWxhckxpc3QsLy/RgdGB0YvQu9C60LAg0L3QsCDRj9C00YDQviDQstGA0LDRidC10L3QuNGPXHJcbiAgICAgICAgbmFtZUV2ZW50OiAndm9pY2VBbmltYWwnLC8v0LjQvNGPINGB0L7QsdGL0YLQuNGPINC60L7RgtC+0YDQvtC1INCy0YvQt9GL0LLQsNC10YIg0Y3RgtCwINC60L3QvtC/0LrQsFxyXG4gICAgICAgIG1heEJpYXNUb3VjaDogMTUsLy/QvNCw0LrRgdC40LzQsNC70YzQvdC+0LUg0YHQvNC10YnQtdC90LjQtSDRgtCw0YfQsCDQtNC70Y8g0L3QsNC20LDRgtC40Y8g0L/QviDRjdC70LXQvNC10L3RgtGDINC80LXQvdGOIChweClcclxuICAgICAgICBfcG9pbnRUb3VjaEZvck1lbnU6IGNjLnYyLC8v0YLQvtGH0LrQsCDRgdGC0LDRgNGC0LAg0YLQsNGH0LAg0L/QviDQv9GD0L3QutGC0YMg0LzQtdC90Y5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDQu9C40YHRgtCwINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25Mb2FkXHJcbiAgICAgKi9cclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMuX29uVG91Y2hTdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQntCx0YDQsNCx0L7RgtGH0LjQuiDRgdGC0LDRgNGC0LAg0L3QsNC20LDRgtC40Y8g0L3QsCDQu9C40YHRgi5cclxuICAgICAqIEBtZXRob2QgX29uVG91Y2hTdGFydFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnQg0L7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hTdGFydChldmVudCl7XHJcbiAgICAgICAgdGhpcy5fcG9pbnRUb3VjaEZvck1lbnUgPSBldmVudC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC+0YLQv9GD0YHQutCw0L3QuNGPINGC0LDRh9CwINC+0YIg0LvQuNGB0YLQsC5cclxuICAgICAqIEBtZXRob2QgX29uVG91Y2hFbmRcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50INC+0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRjy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9vblRvdWNoRW5kKGV2ZW50KXtcclxuICAgICAgICBsZXQgcG9pbnQgPSBldmVudC5nZXRMb2NhdGlvbigpO1xyXG4gICAgICAgIGxldCBYID0gTWF0aC5hYnModGhpcy5fcG9pbnRUb3VjaEZvck1lbnUueCAtIHBvaW50LngpIDwgdGhpcy5tYXhCaWFzVG91Y2g7XHJcbiAgICAgICAgbGV0IFkgPSBNYXRoLmFicyh0aGlzLl9wb2ludFRvdWNoRm9yTWVudS55IC0gcG9pbnQueSkgPCB0aGlzLm1heEJpYXNUb3VjaDtcclxuICAgICAgICBpZiAoWCAmJiBZKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3B1Ymxpc2hFdmVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9GD0LHQu9C40LrRg9C10YIg0YHQvtCx0YvRgtC40LUg0YHQstC30LDQvdC90L7QtSDRgSDRjdGC0LjQvCDQu9C40YHRgtC+0LwuXHJcbiAgICAgKiBAbWV0aG9kIF9wdWJsaXNoRXZlbnRcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9wdWJsaXNoRXZlbnQoKXtcclxuICAgICAgICBsZXQgbXlFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudEN1c3RvbSh0aGlzLm5hbWVFdmVudCwgdHJ1ZSk7XHJcbiAgICAgICAgbXlFdmVudC5kZXRhaWwgPSB7XHJcbiAgICAgICAgICAgIGFuaW1hbDogdGhpcy5tYW5hZ2VyLnBhcmVudCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubm9kZS5kaXNwYXRjaEV2ZW50KG15RXZlbnQpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LHRgNCw0LHQvtGC0YfQuNC6INC00LLQuNC20LXQvdC40Y8g0YLQsNGH0LAuXHJcbiAgICAgKiBAbWV0aG9kIF9vblRvdWNoTW92ZVxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnQg0L7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX29uVG91Y2hNb3ZlKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gZXZlbnQudG91Y2guZ2V0UHJldmlvdXNMb2NhdGlvbigpO1xyXG4gICAgICAgIHZhciBkZWx0YSA9IGV2ZW50LnRvdWNoLmdldERlbHRhKCk7XHJcbiAgICAgICAgdGhpcy5tYW5hZ2VyLmRpcmVjdGlvblJvdGF0aW9uKGRlbHRhLngsIGRlbHRhLnksIHBvaW50LngsIHBvaW50LnkpO1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfSxcclxufSk7IiwiLyoqXHJcbiAqINCh0L7RgdGC0L7Rj9C90LjQtSDQuNCz0YDRiy5cclxuICogQHR5cGUge1N0YXRHYW1lfVxyXG4gKiBAc3RhdGljXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IHNsZWVwINCx0LXQt9C00LXQudGB0YLQstC40LUuXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IG9wZW5NZW51INC+0YLQutGA0YvRgtC40LUg0LzQtdC90Y4g0LjQs9GA0YsuXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IG9wZW5NZW51QW5pbWFsINC+0YLQutGA0YvRgtC40LUg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gKiBAZWxlbWVudCB7bnVtYmVyfSBjcmVhdGVBbmltYWwg0YHQvtC30LTQsNC90LjQtSDQttC40LLQvtGC0L3QvtCz0L4uXHJcbiAqIEBlbGVtZW50IHtudW1iZXJ9IG1vdmVNYXAg0LTQstC40LbQtdC90LjQtSDQutCw0YDRgtGLINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8LlxyXG4gKi9cclxuY29uc3QgU3RhdEdhbWUgPSB7XHJcbiAgICBzbGVlcDogMCxcclxuICAgIG9wZW5NZW51OiAxLFxyXG4gICAgb3Blbk1lbnVBbmltYWw6IDIsXHJcbiAgICBjcmVhdGVBbmltYWw6IDMsXHJcbiAgICBtb3ZlTWFwOiA0LFxyXG59O1xyXG5cclxuLyoqXHJcbiAqINCj0L/RgNCw0LLQu9GP0LXRgiDQv9GA0LXQtNGB0YLQsNCy0LvQvdC40LXQvC5cclxuICogQGNsYXNzIFBsYXlcclxuICovXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgbm9kZVdpbmRvdzogY2MuTm9kZSwvL9C+0LrQvdC+INC40LPRgNGLXHJcbiAgICAgICAgbm9kZUJveENyZWF0ZUFuaW1hbDogY2MuTm9kZSwvL9Cy0YHQv9C70YvQstCw0Y7RidC40Lkg0LHQvtC60YEg0YEg0LbQuNCy0L7RgtC90YvQvNC4XHJcbiAgICAgICAgbm9kZUJveENoYXJhY3RlcmlzdGljc0FuaW1hbDogY2MuTm9kZSwvL9Cy0YHQv9C70YvQstCw0Y7RidC40Lkg0LHQvtC60YEg0YEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LrQsNC80Lgg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgbm9kZUJhc2tldDogY2MuTm9kZSwvL9C60L7RgNC30LjQvdCwINC00LvRjyDRg9C00LDQu9C10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgIG5vZGVGaWVsZEFuaW1hbHM6IGNjLk5vZGUsLy/Qv9C+0LvQtSDQttC40LfQvdC10LTQtdGP0YLQtdC70YzQvdC+0YHRgtC4INC20LjQstC+0YLQvdGL0YVcclxuICAgICAgICBub2RlQm94TWFwOiBjYy5Ob2RlLC8v0LHQvtC60YEg0YEg0LrQsNGA0YLQvtC5XHJcbiAgICAgICAgbm9kZU1hcDogY2MuTm9kZSwvL9C/0L7Qu9C1INC60LDRgNGC0YtcclxuICAgICAgICBub2RlTWVudTogY2MuTm9kZSwvL9C/0L7Qu9C1INC80LXQvdGOINC40LPRgNGLXHJcbiAgICAgICAgbm9kZU1lbnVBbmltYWw6IGNjLk5vZGUsLy/QvdC+0LQg0LzQtdC90Y4g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgbm9kZU1hc2tDcmVhdGVkQW5pbWFsOiBjYy5Ob2RlLC8v0LzQsNGB0LrQsCDQtNC70Y8g0YHQvtC30LTQsNC90LjRjyDQttC40LLQvtGC0L3Ri9GFXHJcblxyXG4gICAgICAgIHByZWZhYlBhcmFtZXRyQ2hhcmFjdGVyaXN0aWNzOiBjYy5QcmVmYWIsLy/Qv9GA0LXRhNCw0LEg0YXQsNGA0LDQutGC0LXRgNC40YHRgtC40LrQuFxyXG5cclxuICAgICAgICBjb2xvclRleHRDaGFyYWN0ZXJpc3RpY3M6IGNjLkNvbG9yLC8v0YbQstC10YIg0YLQtdC60YHRgtCwINGDINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6XHJcblxyXG4gICAgICAgIF90YXJnZXRBbmltYWw6IGNjLk5vZGUsLy/QvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1XHJcbiAgICAgICAgX3BvaW50VGFyZ2V0QW5pbWFsOiBjYy52MiwvL9GC0L7Rh9C60LAg0L3QsNC30L3QsNGH0LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+INCyINGC0LDRgNCz0LXRgtC1XHJcbiAgICAgICAgX3RhcmdldENvbnRyb2xsZXJBbmltYWw6IGNjLk5vZGUsLy/QutC+0L3RgtGA0L7Qu9C70LXRgCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICBfY2VudHJlV2luZG93UG9pbnQ6IG51bGwsLy/RgtC+0YfQutCwINGB0LXRgNC10LTQuNC90Ysg0Y3QutGA0LDQvdCwXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LrQvtC90YDQvtC70LvQtdGA0LAg0L/RgNC10LTRgdGC0LDQstC70LXQvdC40Y8uXHJcbiAgICAgKiBAbWV0aG9kIG9uTG9hZFxyXG4gICAgICovXHJcbiAgICBvbkxvYWQoKXtcclxuICAgICAgICB0aGlzLl9pbml0KCk7XHJcbiAgICAgICAvL2NkIHRoaXMucD1uZXcgUHJvbWlzZSgoYSxiKT0+e30pO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY3JlYXRlQW5pbWFsJywgdGhpcy5vbkFuaW1hbENyZWF0ZWQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdvcGVuQm94RnJvbUFuaW1hbCcsIHRoaXMub25PcGVuQm94RnJvbUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2Nsb3NlQm94RnJvbUFuaW1hbCcsIHRoaXMub25DbG9zZUJveEZyb21BbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdvcGVuQm94TWVudVBsYXknLCB0aGlzLm9uT3BlbkJveE1lbnVQbGF5LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY2xvc2VCb3hNZW51UGxheScsIHRoaXMub25DbG9zZUJveE1lbnVQbGF5LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGUub24oJ29wZW5Cb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsJywgdGhpcy5vbk9wZW5Cb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignY2xvc2VCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsJywgdGhpcy5vbkNsb3NlQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ3N0YXJ0RHJhZ0FuZERyb3BBbmltYWwnLCB0aGlzLm9uU3RhcnREcmFnQW5kRHJvcEFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2RyYWdBbmREcm9wQW5pbWFsJywgdGhpcy5vbkRyYWdBbmREcm9wQW5pbWFsLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignc3RvcERyYWdBbmREcm9wQW5pbWFsJywgdGhpcy5vblN0b3BEcmFnQW5kRHJvcEFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ21vdGlvbkFuaW1hbCcsIHRoaXMub25Nb3Rpb25BbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdzdGFydE1vdGlvbkFuaW1hbCcsIHRoaXMub25TdGFydE1vdGlvbkFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2VuZE1vdGlvbkFuaW1hbCcsIHRoaXMub25FbmRNb3Rpb25BbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdvcGVuTWVudUFuaW1hbCcsIHRoaXMub25PcGVuTWVudUFuaW1hbC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2Nsb3NlTWVudUFuaW1hbCcsIHRoaXMub25DbG9zZU1lbnVBbmltYWwuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbigndm9pY2VBbmltYWwnLCB0aGlzLm9uVm9pY2VBbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdzaXRBbmltYWwnLCB0aGlzLm9uU2l0QW5pbWFsLmJpbmQodGhpcykpOy8v0YHQuNC00LXRgtGMXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdmcmlnaHRlbkFuaW1hbCcsIHRoaXMub25GcmlnaHRlbkFuaW1hbC5iaW5kKHRoaXMpKTsvL9C90LDQv9GD0LPQsNGC0YxcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2FyZWFsQW5pbWFsJywgdGhpcy5vbkFyZWFsQW5pbWFsLmJpbmQodGhpcykpOy8v0L/QvtC60LDQt9Cw0YLRjCDQsNGA0LXQsNC7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdjYXJlQW5pbWFsJywgdGhpcy5vbkNhcmVBbmltYWwuYmluZCh0aGlzKSk7Ly/Ql9Cw0LHQvtGC0LAsINCz0LvQsNC00LjRgtGMXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdsaWVBbmltYWwnLCB0aGlzLm9uTGllQW5pbWFsLmJpbmQodGhpcykpOy8v0JvQtdC20LDRgtGMLNC70LXRh9GMXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdhdHRlbnRpb25BbmltYWwnLCB0aGlzLm9uQXR0ZW50aW9uQW5pbWFsLmJpbmQodGhpcykpOy8v0JLQvdC40LzQsNC90LjQtSwg0LPQvtGC0L7QstGB0YxcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdiYXNrZXRBY3RpdmUnLCB0aGlzLm9uQmFza2V0QWN0aXZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbignYmFza2V0U2xlZXAnLCB0aGlzLm9uQmFza2V0U2xlZXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCdiYXNrZXRXb3JrJywgdGhpcy5vbkJhc2tldFdvcmsuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hPbk1hcCcsIHRoaXMub25Ub3VjaE9uTWFwLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbigndG91Y2hNb3ZlT25NYXAnLCB0aGlzLm9uVG91Y2hNb3ZlT25NYXAuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKCd0b3VjaEVuZE1vdmVPbk1hcCcsIHRoaXMub25Ub3VjaEVuZE1vdmVPbk1hcC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLm5vZGUub24oJ2ZpbmlzaE1vdmVDYW1lcmFUb0FuaW1hbCcsIHRoaXMub25GaW5pc2hNb3ZlQ2FtZXJhVG9BbmltYWwuYmluZCh0aGlzKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0LTQsNC90L3Ri9GFLlxyXG4gICAgICogQG1ldGhvZCBfaW5pdFxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX2luaXQoKXtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuX3N0YXRlR2FtZSA9IFN0YXRHYW1lLnNsZWVwO1xyXG5cclxuICAgICAgICB0aGlzLl90YXJnZXRTaXplV2l0aCA9IDA7Ly/QstGA0LXQvNC10L3QvdGL0LUg0YDQsNC30LzQtdGA0Ysg0YjQuNGA0LjQvdGLINC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YLQtS4g0JTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0U2l6ZUhlaWdodCA9IDA7Ly/QstGA0LXQvNC10L3QvdGL0LUg0YDQsNC30LzQtdGA0Ysg0LLRi9GB0L7RgtGLINC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YLQtS4g0JTQu9GPINGB0L7RhdGA0LDQvdC10L3QuNGPXHJcblxyXG4gICAgICAgIHRoaXMuX3BvaW50VGFyZ2V0QW5pbWFsID0gY2MudjIoMCwgMCk7Ly/RgtC+0YfQutCwINC90LDQt9C90LDRh9C10L3QuNGPINC20LjQstC+0YLQvdC+0LPQviDQsiDRgtCw0YDQs9C10YJcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBudWxsOyAvL9C90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsID0gbnVsbDsvL9C60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQviAo0YLQvtC70YzQutC+IDEg0YLQvtCz0L4g0YfRgtC+INCyINGC0LDRgNCz0LXRgtC1KVxyXG4gICAgICAgIHRoaXMuX2NlbnRyZVdpbmRvd1BvaW50ID0gY2MudjIodGhpcy5ub2RlLndpZHRoIC8gMiwgdGhpcy5ub2RlLmhlaWdodCAvIDIpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJDaXJjdWxhck1lbnUgPSB0aGlzLm5vZGVNZW51QW5pbWFsLmdldENvbXBvbmVudCgnY2lyY3VsYXItbGlzdC1hY3Rpb25zLWFuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2JveENyZWF0ZUFuaW1hbCA9IHRoaXMubm9kZUJveENyZWF0ZUFuaW1hbC5nZXRDb21wb25lbnQoJ2JveC1jcmVhdGUtYW5pbWFsJyk7XHJcbiAgICAgICAgdGhpcy5fYm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsID0gdGhpcy5ub2RlQm94Q2hhcmFjdGVyaXN0aWNzQW5pbWFsLmdldENvbXBvbmVudCgnYm94LWNoYXJhY3RlcmlzdGljcy1hbmltYWwnKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQmFza2V0ID0gdGhpcy5ub2RlQmFza2V0LmdldENvbXBvbmVudCgnYmFza2V0LWFuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJNYXAgPSB0aGlzLm5vZGVNYXAuZ2V0Q29tcG9uZW50KCdjb250cm9sbGVyLW1hcCcpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQkdC+0LrRgSDRgSDQttC40LLQvtGC0L3Ri9C80Lgg0LfQsNC60YDRi9C70YHRjy5cclxuICAgICAqIEBtZXRob2Qgb25DbG9zZUJveEZyb21BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VCb3hGcm9tQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0LrRgNGL0LvRgdGPIEJveEZyb21BbmltYWwnKTtcclxuICAgICAgICBpZiAodGhpcy5fc3RhdGVHYW1lICE9IFN0YXRHYW1lLmNyZWF0ZUFuaW1hbCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVNYXNrQ3JlYXRlZEFuaW1hbC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCR0L7QutGBINGBINC20LjQstC+0YLQvdGL0LzQuCDQvtGC0LrRgNGL0LvRgdGPLlxyXG4gICAgICogQG1ldGhvZCBvbk9wZW5Cb3hGcm9tQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbk9wZW5Cb3hGcm9tQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQvtGC0LrRgNGL0LvRgdGPIEJveEZyb21BbmltYWwnKTtcclxuICAgICAgICB0aGlzLm5vZGVNYXNrQ3JlYXRlZEFuaW1hbC5hY3RpdmUgPSB0cnVlOy8v0LDQutGC0LjQstC40YDQvtCy0LDQu9C4INC80LDRgdC60YNcclxuICAgICAgICB0aGlzLm5vZGVNYXNrQ3JlYXRlZEFuaW1hbC5zZXRQb3NpdGlvbih0aGlzLl9jZW50cmVXaW5kb3dQb2ludCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRyb2xsZXJBbmltYWwgIT09IG51bGwpIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXQvdGOINC+0YLQutGA0YvQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25PcGVuQm94TWVudVBsYXlcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3BlbkJveE1lbnVQbGF5KGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQvtGC0LrRgNGL0LvQvtGB0Ywg0LzQtdC90Y4nKTtcclxuICAgICAgICB0aGlzLm5vZGVNZW51LmFjdGl2ZSA9IHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JzQtdC90Y4g0LfQsNC60YDRi9C70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvbkNsb3NlQm94TWVudVBsYXlcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VCb3hNZW51UGxheShldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0LfQsNC60YDRi9C70L7RgdGMINC80LXQvdGOJyk7XHJcbiAgICAgICAgdGhpcy5ub2RlTWVudS5hY3RpdmUgPSBmYWxzZTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQodC+0LfQtNCw0L3QuNC1INC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqINCe0YLQstC10YfQsNC10YIg0LfQsCDRgNCw0LfQvNC10YnQtdC90LjQtSDQttC40LLQvtGC0L3QvtCz0L4g0LIg0LTQtdGA0LXQstC1INC90L7QtNC+0LIuXHJcbiAgICAgKiBAbWV0aG9kIG9uQW5pbWFsQ3JlYXRlZFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25BbmltYWxDcmVhdGVkKGV2ZW50KXtcclxuICAgICAgICB0aGlzLl9zdGF0ZUdhbWUgPSBTdGF0R2FtZS5jcmVhdGVBbmltYWw7XHJcbiAgICAgICAgY2MubG9nKCfRgdC+0LfQtNCw0L3QuNC1INC90L7QstC+0LPQviDQttC40LLQvtGC0L3QvtCz0L4nKTtcclxuICAgICAgICBldmVudC5kZXRhaWwuYW5pbWFsLnBhcmVudCA9IHRoaXMubm9kZUZpZWxkQW5pbWFscy5wYXJlbnQ7Ly8g0L/QvtC00YbQtdC/0LjRgtGMINC20LjQstC+0YLQvdC+0LUg0Log0LrQsNGA0YLQtVxyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRNYXAoY2MudjIodGhpcy5ub2RlLndpZHRoIC8gMiwgdGhpcy5ub2RlLmhlaWdodCAvIDIpKTsvL9Cy0YvRh9C40YHQu9C40YLRjCDQutC+0L7RgNC00LjQvdCw0YLRiyDQvdCwINC60LDRgNGC0LVcclxuICAgICAgICBldmVudC5kZXRhaWwuYW5pbWFsLnNldFBvc2l0aW9uKHBvaW50LngsIHBvaW50LnkpOy8v0KPRgdGC0LDQvdC+0LLQuNGC0Ywg0LrQvtC+0YDQtNC40L3QsNGC0Ysg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0UHV0aFRvTW9kZWwgPSBldmVudC5kZXRhaWwucHV0aFRvTW9kZWw7Ly/QodC+0YXRgNCw0L3QuNGC0Ywg0L/Rg9GC0Ywg0LTQviDQvNC+0LTQtdC70LguINC40YHQv9C+0LvRjNC30YPQtdGC0YHRjyDQv9GA0Lgg0YHQvtC30LTQsNC90LjQuCDQvNC+0LTQtdC70LhcclxuXHJcbiAgICAgICAgdGhpcy5fYm94Q3JlYXRlQW5pbWFsLmNsb3NlQm94KCk7Ly/Qt9Cw0LrRgNGL0YLRjCDQsdC+0LrRgSDRgSDQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAgICB0aGlzLl9ib3hDcmVhdGVBbmltYWwub25CbG9jaygpOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LHQvtC60YEg0YHQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQmFza2V0Lm9uKCk7Ly/QktC60LvRjtGH0LjRgtGMINC60L7RgNC30LjQvdGDXHJcbiAgICAgICAgdGhpcy5ub2RlQm94TWFwLmdldENvbXBvbmVudChjYy5TY3JvbGxWaWV3KS5lbmFibGVkID0gZmFsc2U7Ly/Qt9Cw0LHQu9C+0LrQuNGA0L7QstCw0YLRjCDQutCw0YDRgtGDXHJcblxyXG4gICAgICAgIC8v0J3QtdC+0LHRhdC+0LTQuNC80L4g0LfQsNC60YDRi9GC0Ywg0LLRgdC1INGH0YLQviDRgdCy0Y/Qt9Cw0L3QviDRgSDQv9GA0L7RiNC70YvQvCDRhNC+0LrRg9GB0L7QvFxyXG4gICAgICAgIGlmICh0aGlzLl90YXJnZXRBbmltYWwgIT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTsvL9C30LDQutGA0YvQstCw0LXRgiDQvNC10L3RjlxyXG4gICAgICAgICAgICB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwuY2xvc2VCb3goKTsvL9C30LDQutGA0YvRgtGMINCx0L7QutGBINGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LDQvNC4XHJcbiAgICAgICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IG51bGw7Ly/QvtCx0L3Rg9C70Y/QtdGCINGB0YHRi9C70LrRgyDQvdCwINC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YTQvtC60YPRgdC1XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQn9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1INC20LjQstC+0YLQvdC+0LPQviDQvdCw0YfQsNC70L7RgdGMLlxyXG4gICAgICogQG1ldGhvZCBvblN0YXJ0RHJhZ0FuZERyb3BBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uU3RhcnREcmFnQW5kRHJvcEFuaW1hbChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0LfQsNC/0YPRgdC6INCw0L3QuNC80LDRhtC40Lgg0L/QvtC00LLQtdGI0LXQvdC90L7RgdGC0LggKNGB0YLQsNGA0YIg0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjRjyknKTtcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBldmVudC5kZXRhaWwuYW5pbWFsOy8v0JHQtdGA0LXQvCDQvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+INCyINGE0L7QutGD0YFcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSBmYWxzZTsvL9C30LDQsdC70L7QutC40YDQvtCy0LDRgtGMINC00LLQuNC20LXQvdC40LUg0LrQsNGA0YLRi1xyXG5cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjQtSDQvdC+0LLQvtCz0L4g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICog0J7RgtCy0LXRh9Cw0LXRgiDQt9CwINC/0LXRgNC10LzQtdGJ0LXQvdC40LUg0L3QvtC00LAg0LbQuNCy0L7RgtC90L7Qs9C+INC/0L4g0LrQsNGA0YLQtSDQv9C+0YHQu9C1INGB0L7Qt9C00LDQvdC40Y8g0Lgg0L/RgNC+0LjQt9Cy0L7QtNC40YIg0LfQsNC80LXRgNGLINC00L4g0YDQsNC30LvQuNGH0L3Ri9GFINC+0LHRitC10LrRgtC+0LIg0L3QsCDQutCw0YDRgtC1LlxyXG4gICAgICogQG1ldGhvZCBvbkRyYWdBbmREcm9wQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkRyYWdBbmREcm9wQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfRgdC+0L7QsdGJ0LDQtdC8INC60L7RgNC30LjQvdC1INC/0L7Qu9C+0LbQtdC90LjQtSDQt9Cy0LXRgNGO0YjQutC4ICjQv9C10YDQtdGC0LDRgdC60LjQstCw0L3QuNC1KScpO1xyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRXaW5kb3coZXZlbnQuZGV0YWlsLnBvaW50KTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQmFza2V0LnNldFBvc2l0aW9uQW5pbWFsKHBvaW50KTtcclxuICAgICAgICB0aGlzLm5vZGVNYXNrQ3JlYXRlZEFuaW1hbC5zZXRQb3NpdGlvbihwb2ludCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjQtSDQttC40LLQvtGC0L3QvtCz0L4g0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25TdG9wRHJhZ0FuZERyb3BBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uU3RvcERyYWdBbmREcm9wQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQvtC/0YDQtdC00LXQu9C10L3QuNC1INC00LDQu9GM0L3QtdC50YjQuNGFINC00LXQudGB0YLQstC40Lkg0YEg0LbQuNCy0L7RgtC90YvQvCAo0LfQsNCy0LXRgNGI0LXQvdC40LUg0L/QtdGA0LXRgtCw0YHQutC40LLQsNC90LjQtSknKTtcclxuICAgICAgICBsZXQgcG9pbnQgPSB0aGlzLl9jb250cm9sbGVyTWFwLmdldFBvaW50V2luZG93KGV2ZW50LmRldGFpbC5wb2ludCk7IC8v0JfQsNC/0YDQsNGI0LjQstCw0LXQvCDRgtC+0YfQutGDINCyINGE0L7RgNC80LDRgtC1INC60L7QvtGA0LTQuNC90LDRgtGLINC+0LrQvdCwXHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jb250cm9sbGVyQmFza2V0LmlzQW5pbWFsTGlmZShwb2ludCkpIHtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgbm9kZU1vZGVsID0gY2MuaW5zdGFudGlhdGUodGhpcy5fdGFyZ2V0QW5pbWFsLmNoaWxkcmVuWzBdKTsvL9GB0L7Qt9C00LDQtdC8INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICAgICAgbm9kZU1vZGVsLnBhcmVudCA9IHRoaXMubm9kZUZpZWxkQW5pbWFsczsvL9CS0LXRiNCw0LXQvCDQvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+INC90LAg0L3QvtC0INGB0L4g0LLRgdC10LzQuCDQttC40LLQvtGC0L3Ri9C80LhcclxuICAgICAgICAgICAgbm9kZU1vZGVsLnNldFBvc2l0aW9uKGV2ZW50LmRldGFpbC5wb2ludC54LCBldmVudC5kZXRhaWwucG9pbnQueSk7Ly/Qo9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDQv9C+0LfQuNGG0LjRjiDQvdCwINC60LDRgNGC0LVcclxuICAgICAgICAgICAgbm9kZU1vZGVsLmFkZENvbXBvbmVudCgnY29udHJvbGxlci1hbmltYWwnKTsvL9CU0L7QsdCw0LLQu9GP0LXQvCDQutC+0L3RgtGA0L7Qu9C70LXRgCDRgtC10LvRgyDQttC40LLQvtGC0L3QvtCz0L5cclxuICAgICAgICAgICAgbm9kZU1vZGVsLmdldENvbXBvbmVudCgnY29udHJvbGxlci1hbmltYWwnKS5zZXR0aW5ncyh7XHJcbiAgICAgICAgICAgICAgICBwdXRoVG9Nb2RlbDp0aGlzLl90YXJnZXRQdXRoVG9Nb2RlbCxcclxuICAgICAgICAgICAgICAgIGlkOnRoaXMubm9kZUZpZWxkQW5pbWFscy5jaGlsZHJlbi5sZW5ndGgtMVxyXG4gICAgICAgICAgICB9KTsvL9Cd0LDRgdGC0YDQsNC40LLQsNC8INC60L7QvdGC0YDQvtC70LvQtdGAINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgICAgICBub2RlTW9kZWwuZ2V0Q29tcG9uZW50KCdjb250cm9sbGVyLWFuaW1hbCcpLnJ1bigpOy8v0JfQsNC/0YPRgdC60LDQtdGCINC20LjQt9C90Ywg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyb2xsZXJCYXNrZXQub25CYWRXb3JrQmFza2V0KCk7Ly/QlNCw0YLRjCDQutC+0LzQsNC90LTRgyDQutC+0YDQt9C40L3QtSjQvdC1INGB0LXQudGH0LDRgSlcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udHJvbGxlckJhc2tldC5vbkdvb2RXb3JrQmFza2V0KCk7Ly/QlNCw0YLRjCDQutC+0LzQsNC90LTRgyDQutC+0YDQt9C40L3QtSjRgNCw0LHQvtGC0LDRgtGMKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLmRlc3Ryb3koKTsvL9Cj0LTQsNC70LjRgtGMINCy0YDQtdC80LXQvdC90YvQuSDQvdC+0LQg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckJhc2tldC5vZmYoKTsvL9Cy0YvRgNGD0LHQuNGC0Ywg0LrQvtGA0LfQuNC90YNcclxuICAgICAgICB0aGlzLl9ib3hDcmVhdGVBbmltYWwub2ZmQmxvY2soKTsvL9Cy0YvRgNGD0LHQuNGC0Ywg0LHQu9C+0LrQuNGA0L7QstC60YMg0L3QuNC20L3QtdCz0L4g0LHQvtC60YHQsFxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IHRydWU7Ly/RgNCw0LfQsdC70L7QutC40YDQvtCy0LDRgtGMINC00LLQuNC20LXQvdC40LUg0LrQsNGA0YLRi1xyXG5cclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBudWxsOy8v0L7QsdC90YPQu9C40YLRjCAg0LbQuNCy0L7RgtC90L7QtSDQsiDRgtCw0YDQs9C10YLQtVxyXG4gICAgICAgIHRoaXMuX3RhcmdldFB1dGhUb01vZGVsID0gbnVsbDsvL9C+0LHQvdGD0LvQuNGC0Ywg0L/Rg9GC0Ywg0LTQviDQvNC+0LTQtdC70Lgg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5ub2RlTWFza0NyZWF0ZWRBbmltYWwuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUuc2xlZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0J3QsNGH0LDQu9C+INC00LLQuNC20LXQvdC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+LlxyXG4gICAgICogQG1ldGhvZCBvblN0YXJ0TW90aW9uQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblN0YXJ0TW90aW9uQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICAvL9CX0LDQutGA0YvQstCw0Y4g0LzQtdC90Y4g0LjQuNC90YTQvtGA0LzQsNGG0LjRjiDQviDQttC40LLQvtGC0L3QvtC8INC10YHQu9C4INC/0LXRgNC10LrQu9GO0YfQsNGO0YHRjCDQvdCwINC00YDRg9Cz0L7QtSDQttC40LLQvtGC0L3QvtC1XHJcbiAgICAgICAgaWYgKHRoaXMuX3RhcmdldEFuaW1hbCAhPSBudWxsICYmIHRoaXMuX3RhcmdldEFuaW1hbC5fbW9kZWwuaWQgIT0gZXZlbnQuZGV0YWlsLmNvbnRyb2xsZXIuX21vZGVsLmlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7Ly/Qt9Cw0LrRgNGL0YLRjCDQvNC10L3RjlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2MubG9nKCfQvdCw0YfQuNC90LDRjiDQtNCy0LjQs9Cw0YLRjNGB0Y8g0LfQsCDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQvCjQndCw0YfQuNC90LDRjiDQstGL0Y7QvtGAINC00LLQuNCz0LDRgtGM0YHRjyDQuNC70Lgg0L7RgtC60YDRi9GC0Ywg0LzQtdC90Y4pJyk7XHJcbiAgICAgICAgbGV0IHBvaW50ID0gdGhpcy5fY29udHJvbGxlck1hcC5nZXRQb2ludE1hcChldmVudC5kZXRhaWwuc3RhcnRNb3Rpb24pOy8v0LrQvtC90LLQtdGA0YLQuNGA0YPQtdC8INGC0L7Rh9C60YMg0L7QutC90LAg0Log0YLQvtGH0LrRgyDQutCw0YDRgtGLXHJcblxyXG4gICAgICAgIHRoaXMuX3BvaW50VGFyZ2V0QW5pbWFsID0gY2MudjIocG9pbnQueCwgcG9pbnQueSk7Ly8g0LfQsNC00LDQtdC8INGC0L7Rh9C60YMg0LrRg9C00LAg0L3QsNC00L4g0LTQvtGB0YLQsNCy0LjRgtGMINC20LjQstC+0YLQvdC1XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbCA9IGV2ZW50LmRldGFpbC5jb250cm9sbGVyOy8v0L/QvtC70YPRh9Cw0LXQvCDQutC+0L3RgtGA0L7Qu9C70LXRgCDQttC40LLQvtGC0L3QvtCz0L4g0LIg0YLQsNGA0LPQtdGC0LVcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwgPSBldmVudC5kZXRhaWwuY29udHJvbGxlcjsvL9GD0YHRgtCw0L3QvtCy0LjQu9C4INC90L7QtCDQttC40LLQvtGC0L3QvtCz0L4g0L3QsCDRhNC+0LrRg9GBXHJcblxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IGZhbHNlOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG5cclxuICAgICAgICAvL9GD0LLQtdC70LjRh9C40Lwg0L/QvtC70LUg0L7RgtC60LvQuNC60LAg0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0U2l6ZVdpdGggPSB0aGlzLl90YXJnZXRBbmltYWwubm9kZS53aWR0aDtcclxuICAgICAgICB0aGlzLl90YXJnZXRTaXplSGVpZ2h0ID0gdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUuaGVpZ2h0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCU0LLQuNC20LXQvdC40LUg0LbQuNCy0L7RgtC90L7Qs9C+INC30LAg0LLQtdC00YPRidC40LwuXHJcbiAgICAgKiBAbWV0aG9kIG9uTW90aW9uQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbk1vdGlvbkFuaW1hbChldmVudCl7XHJcbiAgICAgICAgLy/QvtCx0YDQsNCx0L7RgtC60LAg0YHQvtCx0YvRgtC40Lkg0YEg0LbQuNCy0L7RgtC90YvQvCDQstC+INCy0YDQtdC80Y8g0LTQstC40LbQtdC90LjRj1xyXG4gICAgICAgIGNjLmxvZygn0LTQstC40LPQsNGO0YHRjCDQt9CwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8Jyk7XHJcbiAgICAgICAgLy/Rg9Cy0LXQu9C40YfQuNC8INC/0L7Qu9C1INC+0YLQutC70LjQutCwINC20LjQstC+0YLQvdC+0LPQvlxyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbC5ub2RlLndpZHRoID0gMjAwMDtcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubm9kZS5oZWlnaHQgPSAyMDAwO1xyXG4gICAgICAgIGxldCBwb2ludCA9IHRoaXMuX2NvbnRyb2xsZXJNYXAuZ2V0UG9pbnRNYXAoZXZlbnQuZGV0YWlsLnBvaW50RW5kKTsvLyDQutC+0L3QstC10YDRgtC40YDRg9C10Lwg0YLQvtGH0LrRgyDQvtC60L3QsCDQuiDRgtC+0YfQutC1INC60LDRgNGC0YtcclxuICAgICAgICB0aGlzLl9wb2ludFRhcmdldEFuaW1hbCA9IGNjLnYyKHBvaW50LngsIHBvaW50LnkpOy8vINCy0YvRh9C40YHQu9GP0LXQvCDRgtC+0YfQutGDINC60YPQtNCwINC/0L7QudC00LXRgiDQttC40LLQvtGC0L3QvtC1INCyINC40YLQvtCz0LVcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubW92ZVRvUG9pbnQodGhpcy5fcG9pbnRUYXJnZXRBbmltYWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCe0LrQvtC90YfQsNC90LjQtSDQtNCy0LjQttC10L3QuNGPINC20LjQstC+0YLQvdC+0LPQvi5cclxuICAgICAqIEBtZXRob2Qgb25FbmRNb3Rpb25BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uRW5kTW90aW9uQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C30LDQutCw0L3Rh9C40LLQsNGOINC00LLQuNCz0LDRgtGM0YHRjyDQt9CwINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQtdC8Jyk7XHJcblxyXG4gICAgICAgIC8v0YPQvNC10L3RjNGI0LDQtdC8INC/0LvQvtGJ0LDQtNGMINC/0L7QutGA0YvRgtC40Y8g0LbQuNCy0L7RgtC90L7Qs9C+XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUud2lkdGggPSB0aGlzLl90YXJnZXRTaXplV2l0aDtcclxuICAgICAgICB0aGlzLl90YXJnZXRBbmltYWwubm9kZS5oZWlnaHQgPSB0aGlzLl90YXJnZXRTaXplSGVpZ2h0O1xyXG5cclxuICAgICAgICBsZXQgcG9pbnQgPSB0aGlzLl9jb250cm9sbGVyTWFwLmdldFBvaW50TWFwKGV2ZW50LmRldGFpbC5wb2ludEVuZCk7Ly8g0LrQvtC90LLQtdGA0YLQuNGA0YPQtdC8INGC0L7Rh9C60YMg0L7QutC90LAg0Log0YLQvtGH0LrQtSDQutCw0YDRgtGLXHJcbiAgICAgICAgdGhpcy5fcG9pbnRUYXJnZXRBbmltYWwgPSBjYy52Mihwb2ludC54LCBwb2ludC55KTsvLyDQstGL0YfQuNGB0LvRj9C10Lwg0YLQvtGH0LrRgyDQutGD0LTQsCDQv9C+0LnQtNC10YIg0LbQuNCy0L7RgtC90L7QtSDQsiDQuNGC0L7Qs9C1XHJcbiAgICAgICAgLy/RgdC+0L7QsdGJ0LDQtdC8INC80L7QtNC10LvQuCDRgtC+0YfQutGDINC00L4g0LrQvtGC0L7RgNC+0Lkg0L3QtdC+0LHRhdC+0LTQuNC80L4g0LXQuSDQtNC+0LnRgtC4XHJcbiAgICAgICAgdGhpcy5fdGFyZ2V0QW5pbWFsLm1vdmVUb1BvaW50KHRoaXMuX3BvaW50VGFyZ2V0QW5pbWFsKTtcclxuICAgICAgICB0aGlzLm5vZGVCb3hNYXAuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmVuYWJsZWQgPSB0cnVlOyAvLyDQoNCw0LfQsdC70L7QutC40YDQvtCy0LDQu9C4INC60LDRgNGC0YNcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQnNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4g0L7RgtC60YDRi9GC0L4uXHJcbiAgICAgKiBAbWV0aG9kIG9uT3Blbk1lbnVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3Blbk1lbnVBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0J7RgtC60YDRi9Cy0LDRjiDQvNC10L3RjiDQttC40LLQvtGC0L3QvtCz0L4nKTtcclxuICAgICAgICAvL9Cm0LXQvdGC0YDQuNGA0L7QstCw0YLRjCDQttC40LLQvtGC0L3QvtC1XHJcbiAgICAgICAgbGV0IHBvaW50ID0gY2MudjIodGhpcy5fdGFyZ2V0QW5pbWFsLm5vZGUueCAtIHRoaXMuX2NlbnRyZVdpbmRvd1BvaW50LngsIHRoaXMuX3RhcmdldEFuaW1hbC5ub2RlLnkgLSB0aGlzLl9jZW50cmVXaW5kb3dQb2ludC55KTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlck1hcC5tb3ZlQWN0aW9ucyhwb2ludCwgMC4yNSk7Ly/Qv9C10YDQtdC80LXRgdGC0LjRgtGMINGG0LXQvdGC0YAg0LrQsNC80LXRgNGLINC90LAg0Y3RgtGDINGC0L7Rh9C60YMg0LfQsCAwLjI1INGB0LXQutGD0L3QtNGLXHJcblxyXG4gICAgICAgIC8v0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0L3QsNGB0YLRgNC+0LnQutC4INC00LvRjyDQvNC10L3RjlxyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJDaXJjdWxhck1lbnUuc2V0dGluZ3ModGhpcy5fY29udHJvbGxlckFuaW1hbCk7XHJcblxyXG4gICAgICAgIC8v0LfQsNC/0L7Qu9C90LjRgtGMINCx0L7QutGBINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC6LCwsXHJcblxyXG4gICAgICAgIHRoaXMubm9kZUJveE1hcC5nZXRDb21wb25lbnQoY2MuU2Nyb2xsVmlldykuZW5hYmxlZCA9IGZhbHNlOy8v0LfQsNCx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG4gICAgICAgIHRoaXMuX3N0YXRlR2FtZSA9IFN0YXRHYW1lLm9wZW5NZW51O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCc0LXQvdGOINC20LjQstC+0YLQvdC+0LPQviDQt9Cw0LrRgNGL0YLQvi5cclxuICAgICAqIEBtZXRob2Qgb25DbG9zZU1lbnVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VNZW51QW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQl9Cw0LrRgNGL0LLQsNGOINC80LXQvdGOINC20LjQstC+0YLQvdC+0LPQvicpO1xyXG4gICAgICAgIHRoaXMubm9kZU1lbnVBbmltYWwuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5ub2RlQm94TWFwLmdldENvbXBvbmVudChjYy5TY3JvbGxWaWV3KS5lbmFibGVkID0gdHJ1ZTsvL9GA0LDQt9Cx0LvQvtC60LjRgNC+0LLQsNGC0Ywg0LrQsNGA0YLRg1xyXG4gICAgICAgIHRoaXMuX2JveENoYXJhY3RlcmlzdGljc0FuaW1hbC5jbG9zZUJveCgpO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldEFuaW1hbCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVHYW1lID0gU3RhdEdhbWUuc2xlZXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQuNC30LTQsNC70L4g0LfQstGD0LouXHJcbiAgICAgKiBAbWV0aG9kIG9uVm9pY2VBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVm9pY2VBbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0LbQuNCy0L7RgtC90L7QtSDQv9GA0L7Rj9Cy0LjQu9C+INCz0L7Qu9C+0YEnKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1blZvaWNlKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQltC40LLQvtGC0L3QvtC1INGB0LXQu9C+XHJcbiAgICAgKiBAbWV0aG9kIG9uU2l0QW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvblNpdEFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INGB0LXQu9C+Jyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5TaXQoKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLmNsb3NlTWVudSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCW0LjQstC+0YLQvdC+0LUg0LjRgdC/0YPQs9Cw0LvQvtGB0YxcclxuICAgICAqIEBtZXRob2Qgb25GcmlnaHRlbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25GcmlnaHRlbkFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC40YHQv9GD0LPQsNC70L7RgdGMJyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5GcmlnaHRlbigpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0LDRgNC10LDQu9GLINGH0YPQstGB0YLQslxyXG4gICAgICogQG1ldGhvZCBvbkFyZWFsQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkFyZWFsQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICBjYy5sb2coJ9C20LjQstC+0YLQvdC+0LUg0L/QvtC60LDQt9Cw0LvQviDRgdCy0L7QuSDQsNGA0LXQsNC7Jyk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5ydW5BcmVhbCgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQv9C+0LPQu9Cw0LTQuNC70Lgs0L/QvtC20LDQu9C10LvQuFxyXG4gICAgICogQG1ldGhvZCBvbkNhcmVBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2FyZUFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC/0L7Qs9C70LDQtNC40LvQuCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwucnVuQ2FyZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQu9C10LPQu9C+XHJcbiAgICAgKiBAbWV0aG9kIG9uTGllQW5pbWFsXHJcbiAgICAgKiBAcGFyYW0ge2NjLkV2ZW50fSBldmVudFxyXG4gICAgICovXHJcbiAgICBvbkxpZUFuaW1hbChldmVudCl7XHJcbiAgICAgICAgY2MubG9nKCfQttC40LLQvtGC0L3QvtC1INC70LXQs9C70L4nKTtcclxuICAgICAgICB0aGlzLl9jb250cm9sbGVyQW5pbWFsLnJ1bkxpZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuY2xvc2VNZW51KCk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JbQuNCy0L7RgtC90L7QtSDQv9GA0LjQs9C+0YLQvtCy0LjQu9C+0YHRjFxyXG4gICAgICogQG1ldGhvZCBvbkF0dGVudGlvbkFuaW1hbFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25BdHRlbnRpb25BbmltYWwoZXZlbnQpe1xyXG4gICAgICAgIGNjLmxvZygn0LbQuNCy0L7RgtC90L7QtSDQv9GA0LjQs9C+0YLQvtCy0LjQu9C+0YHRjCcpO1xyXG4gICAgICAgIHRoaXMuX2NvbnRyb2xsZXJBbmltYWwucnVuQXR0ZW50aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fY29udHJvbGxlckFuaW1hbC5jbG9zZU1lbnUoKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQkdC+0LrRgSDRhdCw0YDQsNC60YLRgNC40YHRgtC40Log0LbQuNCy0L7RgtC90L7Qs9C+INC+0YLQutGA0YvQu9GB0Y8uXHJcbiAgICAgKiBAbWV0aG9kIG9uT3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uT3BlbkJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C+0YLQutGA0YvQu9GB0Y8gQm94RnJvbUNoYXJhY3RlcmlzdGljc0FuaW1hbCcpO1xyXG4gICAgICAgIHRoaXMuX2JveENyZWF0ZUFuaW1hbC5jbG9zZUJveCgpO1xyXG4gICAgICAgIC8v0LfQsNC/0L7Qu9C90Y/QtdGCINGF0LDRgNCw0LrRgtC10YDQuNGB0YLQuNC60LhcclxuICAgICAgICBsZXQgbWFzcyA9IHRoaXMuX2NvbnRyb2xsZXJBbmltYWwuZ2V0Q2hhcmFjdGVyaXN0aWNzKCk7XHJcbiAgICAgICAgbGV0IGNvbnRlbnQgPSB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwuY29udGVudDtcclxuXHJcbiAgICAgICAgbGV0IG5vZGVQYXJhbTtcclxuICAgICAgICAvL9GH0LjRgdGC0LjQvCDQv9GA0LXQtNGL0LTRg9GJ0LjQtSDQt9Cw0L/QuNGB0LhcclxuICAgICAgICBjb250ZW50LmNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5kZXN0cm95KCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8v0J3QsNGH0LjQvdCw0LXQvCDQt9Cw0L/QvtC70L3QtdC90LjQtVxyXG4gICAgICAgIG5vZGVQYXJhbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3MpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5hZGRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MubmFtZTtcclxuICAgICAgICBub2RlUGFyYW0uY29sb3IgPSB0aGlzLmNvbG9yVGV4dENoYXJhY3RlcmlzdGljcztcclxuICAgICAgICBjb250ZW50LmFkZENoaWxkKG5vZGVQYXJhbSk7XHJcblxyXG4gICAgICAgIG5vZGVQYXJhbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiUGFyYW1ldHJDaGFyYWN0ZXJpc3RpY3MpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5yZW1vdmVBbGxDaGlsZHJlbigpO1xyXG4gICAgICAgIG5vZGVQYXJhbS5hZGRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MuY3VycmVudFN0YXRlO1xyXG4gICAgICAgIG5vZGVQYXJhbS5jb2xvciA9IHRoaXMuY29sb3JUZXh0Q2hhcmFjdGVyaXN0aWNzO1xyXG4gICAgICAgIGNvbnRlbnQuYWRkQ2hpbGQobm9kZVBhcmFtKTtcclxuXHJcbiAgICAgICAgbGV0IHZyOy8v0LLRgNC10LzQtdC90L3QsNGPINC/0LXRgNC10LzQtdC90L3QsNGPINGD0LfQu9C+0LJcclxuICAgICAgICAvL9C30LDQv9C+0LvQvdGP0LXQvCDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQutC4XHJcbiAgICAgICAgaWYgKG1hc3MucGFyYW0ubGVuZ3RoICE9IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXNzLnBhcmFtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlUGFyYW0gPSBjYy5pbnN0YW50aWF0ZSh0aGlzLnByZWZhYlBhcmFtZXRyQ2hhcmFjdGVyaXN0aWNzKTtcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQuYWRkQ2hpbGQobm9kZVBhcmFtKTtcclxuICAgICAgICAgICAgICAgIG5vZGVQYXJhbS54ID0gMDtcclxuICAgICAgICAgICAgICAgIHZyID0gbm9kZVBhcmFtLmdldENoaWxkQnlOYW1lKCduYW1lJyk7XHJcbiAgICAgICAgICAgICAgICB2ci5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IG1hc3MucGFyYW1baV0ubmFtZTtcclxuICAgICAgICAgICAgICAgIHZyLmNvbG9yID0gdGhpcy5jb2xvclRleHRDaGFyYWN0ZXJpc3RpY3M7XHJcbiAgICAgICAgICAgICAgICB2ciA9IG5vZGVQYXJhbS5nZXRDaGlsZEJ5TmFtZSgndmFsdWUnKTtcclxuICAgICAgICAgICAgICAgIHZyLmdldENvbXBvbmVudChjYy5MYWJlbCkuc3RyaW5nID0gbWFzcy5wYXJhbVtpXS52YWx1ZS50b1N0cmluZygpICsgbWFzcy5wYXJhbVtpXS51bml0O1xyXG4gICAgICAgICAgICAgICAgdnIuY29sb3IgPSB0aGlzLmNvbG9yVGV4dENoYXJhY3RlcmlzdGljcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQkdC+0LrRgSDRhdCw0YDQsNC60YLQtdGA0LjRgdGC0LjQuiDQttC40LLQvtGC0L3QvtCz0L4g0LfQsNC60YDRi9C70YHRjy5cclxuICAgICAqIEBtZXRob2Qgb25DbG9zZUJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQ2xvc2VCb3hGcm9tQ2hhcmFjdGVyaXN0aWNzQW5pbWFsKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQt9Cw0LrRgNGL0LvRgdGPIEJveEZyb21DaGFyYWN0ZXJpc3RpY3NBbmltYWwnKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YHQvtCx0YvRgtC40LUg0LDQutGC0LjQstC90L7Qs9C+INC/0YDQtdC00LLQutGD0YjQtdC90LjRjy5cclxuICAgICAqIEBtZXRob2Qgb25CYXNrZXRBY3RpdmVcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQmFza2V0QWN0aXZlKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQutC+0YDQt9C40L3QsCDQv9GA0L7Rj9Cy0LvRj9C10YIg0LDQutGC0LjQstC90L7RgdGC0YwnKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YDQtdC20LjQvCDRgdC90LAuXHJcbiAgICAgKiBAbWV0aG9kIG9uQmFza2V0U2xlZXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uQmFza2V0U2xlZXAoZXZlbnQpe1xyXG5cclxuICAgICAgICBjYy5sb2coJ9C60L7RgNC30LjQvdCwINGB0L/QuNGCJyk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog0JrQvtGA0LfQuNC90LAg0L/QtdGA0LXRiNC70LAg0LIg0YDQtdC20LjQvCDRgNCw0LHQvtGC0YsgKNCS0L7RgiDQstC+0YIg0YHQsdGA0L7RgdGP0YIg0LbQuNCy0L7RgtC90L7QtSkuXHJcbiAgICAgKiBAbWV0aG9kIG9uQmFza2V0V29ya1xyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25CYXNrZXRXb3JrKGV2ZW50KXtcclxuXHJcbiAgICAgICAgY2MubG9nKCfQutC+0YDQt9C40L3QsCDQvdCw0LTQtdC10YLRgdGPINGH0YLQviDQstC+0YIg0LLQvtGCINCyINC90LXQtSDQv9C+0L/QsNC00LXRgiDQttC40LLQvtGC0L3QvtC1Jyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC90LDRh9Cw0LvQsCDRgNCw0LHQvtGC0Ysg0YEg0LrQsNGA0YLQvtC5LlxyXG4gICAgICogQG1ldGhvZCBvblRvdWNoT25NYXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hPbk1hcChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0J3QsNGH0LDQuyDRgNCw0LHQvtGC0YMg0YEg0LrQsNGA0YLQvtC5Jyk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC00LLQuNC20LXQvdC40Y8g0LrQsNGA0YLRiy5cclxuICAgICAqIEBtZXRob2Qgb25Ub3VjaE1vdmVPbk1hcFxyXG4gICAgICogQHBhcmFtIHtjYy5FdmVudH0gZXZlbnRcclxuICAgICAqL1xyXG4gICAgb25Ub3VjaE1vdmVPbk1hcChldmVudCl7XHJcblxyXG4gICAgICAgIGNjLmxvZygn0JTQstC40LPQsNC10YIg0LrQsNGA0YLRgycpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqINCh0L7QsdGL0YLQuNC1INC30LDQstC10YDRiNC10L3QuNGPINGA0LDQsdC+0YLRiyDRgSDQutCw0YDRgtC+0LkuXHJcbiAgICAgKiBAbWV0aG9kIG9uVG91Y2hFbmRNb3ZlT25NYXBcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uVG91Y2hFbmRNb3ZlT25NYXAoZXZlbnQpe1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fc3RhdGVHYW1lID09PSBTdGF0R2FtZS5zbGVlcCkge1xyXG4gICAgICAgICAgICBjYy5sb2coJ9C30LDQstC10YDRiNC40Lsg0YDQsNCx0L7RgtGDINGBINC60LDRgNGC0L7QuScpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDQndCw0LLQtdC00LXQvdC40LUg0YbQtdC90YLRgNCwINC60LDQvNC10YDRiyDQvdCwINC20LjQstC+0YLQvdC+0LUg0LfQsNCy0LXRgNGI0LjQu9C+0YHRjC5cclxuICAgICAqIEBtZXRob2Qgb25GaW5pc2hNb3ZlQ2FtZXJhVG9BbmltYWxcclxuICAgICAqIEBwYXJhbSB7Y2MuRXZlbnR9IGV2ZW50XHJcbiAgICAgKi9cclxuICAgIG9uRmluaXNoTW92ZUNhbWVyYVRvQW5pbWFsKGV2ZW50KXtcclxuICAgICAgICB0aGlzLm5vZGVNZW51QW5pbWFsLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5ub2RlTWVudUFuaW1hbC5zZXRQb3NpdGlvbih0aGlzLl9jZW50cmVXaW5kb3dQb2ludC54LCB0aGlzLl9jZW50cmVXaW5kb3dQb2ludC55KTtcclxuICAgICAgICB0aGlzLl9ib3hDaGFyYWN0ZXJpc3RpY3NBbmltYWwub3BlbkJveCgpO1xyXG4gICAgfSxcclxuXHJcbn0pOyJdLCJzb3VyY2VSb290IjoiIn0=