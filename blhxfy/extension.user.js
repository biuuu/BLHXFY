// ==UserScript==
// @name         碧蓝幻想翻译
// @namespace    https://github.com/biuuu/BLHXFY
// @version      0.0.1
// @description  碧蓝幻想的汉化脚本，提交新翻译请到 https://github.com/biuuu/BLHXFY
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @author       biuuu
// @match        *://game.granbluefantasy.jp/
// @match        *://gbf.game.mbga.jp/
// @run-at       document-start
// @grant        none
// @updateURL    https://blhx.danmu9.com/blhxfy/extension.user.js
// @supportURL   https://github.com/biuuu/BLHXFY/issues
// ==/UserScript==
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('stream')) :
  typeof define === 'function' && define.amd ? define(['stream'], factory) :
  (factory(global.stream));
}(this, (function (stream) { 'use strict';

  stream = stream && stream.hasOwnProperty('default') ? stream['default'] : stream;

  // Copyright Joyent, Inc. and other Node contributors.

  var R = typeof Reflect === 'object' ? Reflect : null;
  var ReflectApply = R && typeof R.apply === 'function'
    ? R.apply
    : function ReflectApply(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };

  var ReflectOwnKeys;
  if (R && typeof R.ownKeys === 'function') {
    ReflectOwnKeys = R.ownKeys;
  } else if (Object.getOwnPropertySymbols) {
    ReflectOwnKeys = function ReflectOwnKeys(target) {
      return Object.getOwnPropertyNames(target)
        .concat(Object.getOwnPropertySymbols(target));
    };
  } else {
    ReflectOwnKeys = function ReflectOwnKeys(target) {
      return Object.getOwnPropertyNames(target);
    };
  }

  function ProcessEmitWarning(warning) {
    if (console && console.warn) console.warn(warning);
  }

  var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
    return value !== value;
  };

  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  var events = EventEmitter;

  // Backwards-compat with node 0.10.x
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._eventsCount = 0;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  var defaultMaxListeners = 10;

  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
      }
      defaultMaxListeners = arg;
    }
  });

  EventEmitter.init = function() {

    if (this._events === undefined ||
        this._events === Object.getPrototypeOf(this)._events) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
    }
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  EventEmitter.prototype.emit = function emit(type) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    var doError = (type === 'error');

    var events = this._events;
    if (events !== undefined)
      doError = (doError && events.error === undefined);
    else if (!doError)
      return false;

    // If there is no 'error' event listener then throw.
    if (doError) {
      var er;
      if (args.length > 0)
        er = args[0];
      if (er instanceof Error) {
        // Note: The comments on the `throw` lines are intentional, they show
        // up in Node's output if this results in an unhandled exception.
        throw er; // Unhandled 'error' event
      }
      // At least give some kind of context to the user
      var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
      err.context = er;
      throw err; // Unhandled 'error' event
    }

    var handler = events[type];

    if (handler === undefined)
      return false;

    if (typeof handler === 'function') {
      ReflectApply(handler, this, args);
    } else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        ReflectApply(listeners[i], this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== 'function') {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }

    events = target._events;
    if (events === undefined) {
      events = target._events = Object.create(null);
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener !== undefined) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (existing === undefined) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
        // If we've already got an array, just append.
      } else if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }

      // Check for listener leak
      m = $getMaxListeners(target);
      if (m > 0 && existing.length > m && !existing.warned) {
        existing.warned = true;
        // No error code for this since it is a Warning
        // eslint-disable-next-line no-restricted-syntax
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + String(type) + ' listeners ' +
                            'added. Use emitter.setMaxListeners() to ' +
                            'increase limit');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        ProcessEmitWarning(w);
      }
    }

    return target;
  }

  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

  function onceWrapper() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
    if (!this.fired) {
      this.target.removeListener(this.type, this.wrapFn);
      this.fired = true;
      ReflectApply(this.listener, this.target, args);
    }
  }

  function _onceWrap(target, type, listener) {
    var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
    var wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    }
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function') {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

  // Emits a 'removeListener' event if and only if the listener was removed.
  EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function') {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }

        events = this._events;
        if (events === undefined)
          return this;

        list = events[type];
        if (list === undefined)
          return this;

        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }

          if (list.length === 1)
            events[type] = list[0];

          if (events.removeListener !== undefined)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };

  EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

  EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events, i;

        events = this._events;
        if (events === undefined)
          return this;

        // not listening for removeListener, no need to emit
        if (events.removeListener === undefined) {
          if (arguments.length === 0) {
            this._events = Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== undefined) {
            if (--this._eventsCount === 0)
              this._events = Object.create(null);
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = Object.create(null);
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners !== undefined) {
          // LIFO order
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }

        return this;
      };

  function _listeners(target, type, unwrap) {
    var events = target._events;

    if (events === undefined)
      return [];

    var evlistener = events[type];
    if (evlistener === undefined)
      return [];

    if (typeof evlistener === 'function')
      return unwrap ? [evlistener.listener || evlistener] : [evlistener];

    return unwrap ?
      unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
  }

  EventEmitter.prototype.listeners = function listeners(type) {
    return _listeners(this, type, true);
  };

  EventEmitter.prototype.rawListeners = function rawListeners(type) {
    return _listeners(this, type, false);
  };

  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events !== undefined) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener !== undefined) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
  };

  function arrayClone(arr, n) {
    var copy = new Array(n);
    for (var i = 0; i < n; ++i)
      copy[i] = arr[i];
    return copy;
  }

  function spliceOne(list, index) {
    for (; index + 1 < list.length; index++)
      list[index] = list[index + 1];
    list.pop();
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  const config = {
    origin: 'https://blhx.danmu9.com',
    apiHosts: ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'],
    hash: ''
  };

  const {
    origin
  } = config;
  var ee = new events();
  const iframe = document.createElement('iframe');
  iframe.src = `${origin}/blhxfy/lecia.html`;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = `${origin}/blhxfy/data/static/style/BLHXFY.css`;
  document.head.appendChild(link);
  const lecia = iframe.contentWindow;
  const load = new Promise(rev => {
    ee.once('loaded', rev);
  });

  const fetch$1 = async pathname => {
    await load;
    const url = pathname;
    const flag = Math.random();
    lecia.postMessage({
      type: 'fetch',
      url,
      flag
    }, origin);
    return new Promise((rev, rej) => {
      ee.once(`response${flag}`, function (data) {
        if (data.err) {
          rej(err);
        } else {
          rev(data.data);
        }
      });
    });
  };

  const getHash = fetch$1('/blhxfy/manifest.json').then(data => config.hash = data.hash);

  const fetchWithHash = async pathname => {
    const {
      hash
    } = await getHash;
    return fetch$1(`${pathname}?lecia=${hash}`);
  };

  const receiveMessage = event => {
    if (event.origin !== origin) return;

    if (event.data && event.data.type) {
      if (event.data.type === 'response') {
        ee.emit(`response${event.data.flag}`, event.data);
      } else if (event.data.type === 'loaded') {
        ee.emit('loaded');
      }
    }
  };

  window.addEventListener("message", receiveMessage, false);

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var punycode = createCommonjsModule(function (module, exports) {
  (function(root) {

  	/** Detect free variables */
  	var freeExports = exports &&
  		!exports.nodeType && exports;
  	var freeModule = module &&
  		!module.nodeType && module;
  	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
  	if (
  		freeGlobal.global === freeGlobal ||
  		freeGlobal.window === freeGlobal ||
  		freeGlobal.self === freeGlobal
  	) {
  		root = freeGlobal;
  	}

  	/**
  	 * The `punycode` object.
  	 * @name punycode
  	 * @type Object
  	 */
  	var punycode,

  	/** Highest positive signed 32-bit float value */
  	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

  	/** Bootstring parameters */
  	base = 36,
  	tMin = 1,
  	tMax = 26,
  	skew = 38,
  	damp = 700,
  	initialBias = 72,
  	initialN = 128, // 0x80
  	delimiter = '-', // '\x2D'

  	/** Regular expressions */
  	regexPunycode = /^xn--/,
  	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
  	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

  	/** Error messages */
  	errors = {
  		'overflow': 'Overflow: input needs wider integers to process',
  		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  		'invalid-input': 'Invalid input'
  	},

  	/** Convenience shortcuts */
  	baseMinusTMin = base - tMin,
  	floor = Math.floor,
  	stringFromCharCode = String.fromCharCode,

  	/** Temporary variable */
  	key;

  	/*--------------------------------------------------------------------------*/

  	/**
  	 * A generic error utility function.
  	 * @private
  	 * @param {String} type The error type.
  	 * @returns {Error} Throws a `RangeError` with the applicable error message.
  	 */
  	function error(type) {
  		throw new RangeError(errors[type]);
  	}

  	/**
  	 * A generic `Array#map` utility function.
  	 * @private
  	 * @param {Array} array The array to iterate over.
  	 * @param {Function} callback The function that gets called for every array
  	 * item.
  	 * @returns {Array} A new array of values returned by the callback function.
  	 */
  	function map(array, fn) {
  		var length = array.length;
  		var result = [];
  		while (length--) {
  			result[length] = fn(array[length]);
  		}
  		return result;
  	}

  	/**
  	 * A simple `Array#map`-like wrapper to work with domain name strings or email
  	 * addresses.
  	 * @private
  	 * @param {String} domain The domain name or email address.
  	 * @param {Function} callback The function that gets called for every
  	 * character.
  	 * @returns {Array} A new string of characters returned by the callback
  	 * function.
  	 */
  	function mapDomain(string, fn) {
  		var parts = string.split('@');
  		var result = '';
  		if (parts.length > 1) {
  			// In email addresses, only the domain name should be punycoded. Leave
  			// the local part (i.e. everything up to `@`) intact.
  			result = parts[0] + '@';
  			string = parts[1];
  		}
  		// Avoid `split(regex)` for IE8 compatibility. See #17.
  		string = string.replace(regexSeparators, '\x2E');
  		var labels = string.split('.');
  		var encoded = map(labels, fn).join('.');
  		return result + encoded;
  	}

  	/**
  	 * Creates an array containing the numeric code points of each Unicode
  	 * character in the string. While JavaScript uses UCS-2 internally,
  	 * this function will convert a pair of surrogate halves (each of which
  	 * UCS-2 exposes as separate characters) into a single code point,
  	 * matching UTF-16.
  	 * @see `punycode.ucs2.encode`
  	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
  	 * @memberOf punycode.ucs2
  	 * @name decode
  	 * @param {String} string The Unicode input string (UCS-2).
  	 * @returns {Array} The new array of code points.
  	 */
  	function ucs2decode(string) {
  		var output = [],
  		    counter = 0,
  		    length = string.length,
  		    value,
  		    extra;
  		while (counter < length) {
  			value = string.charCodeAt(counter++);
  			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
  				// high surrogate, and there is a next character
  				extra = string.charCodeAt(counter++);
  				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
  					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
  				} else {
  					// unmatched surrogate; only append this code unit, in case the next
  					// code unit is the high surrogate of a surrogate pair
  					output.push(value);
  					counter--;
  				}
  			} else {
  				output.push(value);
  			}
  		}
  		return output;
  	}

  	/**
  	 * Creates a string based on an array of numeric code points.
  	 * @see `punycode.ucs2.decode`
  	 * @memberOf punycode.ucs2
  	 * @name encode
  	 * @param {Array} codePoints The array of numeric code points.
  	 * @returns {String} The new Unicode string (UCS-2).
  	 */
  	function ucs2encode(array) {
  		return map(array, function(value) {
  			var output = '';
  			if (value > 0xFFFF) {
  				value -= 0x10000;
  				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
  				value = 0xDC00 | value & 0x3FF;
  			}
  			output += stringFromCharCode(value);
  			return output;
  		}).join('');
  	}

  	/**
  	 * Converts a basic code point into a digit/integer.
  	 * @see `digitToBasic()`
  	 * @private
  	 * @param {Number} codePoint The basic numeric code point value.
  	 * @returns {Number} The numeric value of a basic code point (for use in
  	 * representing integers) in the range `0` to `base - 1`, or `base` if
  	 * the code point does not represent a value.
  	 */
  	function basicToDigit(codePoint) {
  		if (codePoint - 48 < 10) {
  			return codePoint - 22;
  		}
  		if (codePoint - 65 < 26) {
  			return codePoint - 65;
  		}
  		if (codePoint - 97 < 26) {
  			return codePoint - 97;
  		}
  		return base;
  	}

  	/**
  	 * Converts a digit/integer into a basic code point.
  	 * @see `basicToDigit()`
  	 * @private
  	 * @param {Number} digit The numeric value of a basic code point.
  	 * @returns {Number} The basic code point whose value (when used for
  	 * representing integers) is `digit`, which needs to be in the range
  	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  	 * used; else, the lowercase form is used. The behavior is undefined
  	 * if `flag` is non-zero and `digit` has no uppercase form.
  	 */
  	function digitToBasic(digit, flag) {
  		//  0..25 map to ASCII a..z or A..Z
  		// 26..35 map to ASCII 0..9
  		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  	}

  	/**
  	 * Bias adaptation function as per section 3.4 of RFC 3492.
  	 * https://tools.ietf.org/html/rfc3492#section-3.4
  	 * @private
  	 */
  	function adapt(delta, numPoints, firstTime) {
  		var k = 0;
  		delta = firstTime ? floor(delta / damp) : delta >> 1;
  		delta += floor(delta / numPoints);
  		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
  			delta = floor(delta / baseMinusTMin);
  		}
  		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  	}

  	/**
  	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  	 * symbols.
  	 * @memberOf punycode
  	 * @param {String} input The Punycode string of ASCII-only symbols.
  	 * @returns {String} The resulting string of Unicode symbols.
  	 */
  	function decode(input) {
  		// Don't use UCS-2
  		var output = [],
  		    inputLength = input.length,
  		    out,
  		    i = 0,
  		    n = initialN,
  		    bias = initialBias,
  		    basic,
  		    j,
  		    index,
  		    oldi,
  		    w,
  		    k,
  		    digit,
  		    t,
  		    /** Cached calculation results */
  		    baseMinusT;

  		// Handle the basic code points: let `basic` be the number of input code
  		// points before the last delimiter, or `0` if there is none, then copy
  		// the first basic code points to the output.

  		basic = input.lastIndexOf(delimiter);
  		if (basic < 0) {
  			basic = 0;
  		}

  		for (j = 0; j < basic; ++j) {
  			// if it's not a basic code point
  			if (input.charCodeAt(j) >= 0x80) {
  				error('not-basic');
  			}
  			output.push(input.charCodeAt(j));
  		}

  		// Main decoding loop: start just after the last delimiter if any basic code
  		// points were copied; start at the beginning otherwise.

  		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

  			// `index` is the index of the next character to be consumed.
  			// Decode a generalized variable-length integer into `delta`,
  			// which gets added to `i`. The overflow checking is easier
  			// if we increase `i` as we go, then subtract off its starting
  			// value at the end to obtain `delta`.
  			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

  				if (index >= inputLength) {
  					error('invalid-input');
  				}

  				digit = basicToDigit(input.charCodeAt(index++));

  				if (digit >= base || digit > floor((maxInt - i) / w)) {
  					error('overflow');
  				}

  				i += digit * w;
  				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

  				if (digit < t) {
  					break;
  				}

  				baseMinusT = base - t;
  				if (w > floor(maxInt / baseMinusT)) {
  					error('overflow');
  				}

  				w *= baseMinusT;

  			}

  			out = output.length + 1;
  			bias = adapt(i - oldi, out, oldi == 0);

  			// `i` was supposed to wrap around from `out` to `0`,
  			// incrementing `n` each time, so we'll fix that now:
  			if (floor(i / out) > maxInt - n) {
  				error('overflow');
  			}

  			n += floor(i / out);
  			i %= out;

  			// Insert `n` at position `i` of the output
  			output.splice(i++, 0, n);

  		}

  		return ucs2encode(output);
  	}

  	/**
  	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
  	 * Punycode string of ASCII-only symbols.
  	 * @memberOf punycode
  	 * @param {String} input The string of Unicode symbols.
  	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
  	 */
  	function encode(input) {
  		var n,
  		    delta,
  		    handledCPCount,
  		    basicLength,
  		    bias,
  		    j,
  		    m,
  		    q,
  		    k,
  		    t,
  		    currentValue,
  		    output = [],
  		    /** `inputLength` will hold the number of code points in `input`. */
  		    inputLength,
  		    /** Cached calculation results */
  		    handledCPCountPlusOne,
  		    baseMinusT,
  		    qMinusT;

  		// Convert the input in UCS-2 to Unicode
  		input = ucs2decode(input);

  		// Cache the length
  		inputLength = input.length;

  		// Initialize the state
  		n = initialN;
  		delta = 0;
  		bias = initialBias;

  		// Handle the basic code points
  		for (j = 0; j < inputLength; ++j) {
  			currentValue = input[j];
  			if (currentValue < 0x80) {
  				output.push(stringFromCharCode(currentValue));
  			}
  		}

  		handledCPCount = basicLength = output.length;

  		// `handledCPCount` is the number of code points that have been handled;
  		// `basicLength` is the number of basic code points.

  		// Finish the basic string - if it is not empty - with a delimiter
  		if (basicLength) {
  			output.push(delimiter);
  		}

  		// Main encoding loop:
  		while (handledCPCount < inputLength) {

  			// All non-basic code points < n have been handled already. Find the next
  			// larger one:
  			for (m = maxInt, j = 0; j < inputLength; ++j) {
  				currentValue = input[j];
  				if (currentValue >= n && currentValue < m) {
  					m = currentValue;
  				}
  			}

  			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
  			// but guard against overflow
  			handledCPCountPlusOne = handledCPCount + 1;
  			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
  				error('overflow');
  			}

  			delta += (m - n) * handledCPCountPlusOne;
  			n = m;

  			for (j = 0; j < inputLength; ++j) {
  				currentValue = input[j];

  				if (currentValue < n && ++delta > maxInt) {
  					error('overflow');
  				}

  				if (currentValue == n) {
  					// Represent delta as a generalized variable-length integer
  					for (q = delta, k = base; /* no condition */; k += base) {
  						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
  						if (q < t) {
  							break;
  						}
  						qMinusT = q - t;
  						baseMinusT = base - t;
  						output.push(
  							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
  						);
  						q = floor(qMinusT / baseMinusT);
  					}

  					output.push(stringFromCharCode(digitToBasic(q, 0)));
  					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
  					delta = 0;
  					++handledCPCount;
  				}
  			}

  			++delta;
  			++n;

  		}
  		return output.join('');
  	}

  	/**
  	 * Converts a Punycode string representing a domain name or an email address
  	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
  	 * it doesn't matter if you call it on a string that has already been
  	 * converted to Unicode.
  	 * @memberOf punycode
  	 * @param {String} input The Punycoded domain name or email address to
  	 * convert to Unicode.
  	 * @returns {String} The Unicode representation of the given Punycode
  	 * string.
  	 */
  	function toUnicode(input) {
  		return mapDomain(input, function(string) {
  			return regexPunycode.test(string)
  				? decode(string.slice(4).toLowerCase())
  				: string;
  		});
  	}

  	/**
  	 * Converts a Unicode string representing a domain name or an email address to
  	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
  	 * i.e. it doesn't matter if you call it with a domain that's already in
  	 * ASCII.
  	 * @memberOf punycode
  	 * @param {String} input The domain name or email address to convert, as a
  	 * Unicode string.
  	 * @returns {String} The Punycode representation of the given domain name or
  	 * email address.
  	 */
  	function toASCII(input) {
  		return mapDomain(input, function(string) {
  			return regexNonASCII.test(string)
  				? 'xn--' + encode(string)
  				: string;
  		});
  	}

  	/*--------------------------------------------------------------------------*/

  	/** Define the public API */
  	punycode = {
  		/**
  		 * A string representing the current Punycode.js version number.
  		 * @memberOf punycode
  		 * @type String
  		 */
  		'version': '1.3.2',
  		/**
  		 * An object of methods to convert from JavaScript's internal character
  		 * representation (UCS-2) to Unicode code points, and back.
  		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
  		 * @memberOf punycode
  		 * @type Object
  		 */
  		'ucs2': {
  			'decode': ucs2decode,
  			'encode': ucs2encode
  		},
  		'decode': decode,
  		'encode': encode,
  		'toASCII': toASCII,
  		'toUnicode': toUnicode
  	};

  	/** Expose `punycode` */
  	// Some AMD build optimizers, like r.js, check for specific condition patterns
  	// like the following:
  	if (freeExports && freeModule) {
  		if (module.exports == freeExports) {
  			// in Node.js, io.js, or RingoJS v0.8.0+
  			freeModule.exports = punycode;
  		} else {
  			// in Narwhal or RingoJS v0.7.0-
  			for (key in punycode) {
  				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
  			}
  		}
  	} else {
  		// in Rhino or a web browser
  		root.punycode = punycode;
  	}

  }(commonjsGlobal));
  });

  var IPv6 = createCommonjsModule(function (module) {
  /*!
   * URI.js - Mutating URLs
   * IPv6 Support
   *
   * Version: 1.19.1
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   */

  (function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (module.exports) {
      // Node
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      root.IPv6 = factory(root);
    }
  }(commonjsGlobal, function (root) {

    /*
    var _in = "fe80:0000:0000:0000:0204:61ff:fe9d:f156";
    var _out = IPv6.best(_in);
    var _expected = "fe80::204:61ff:fe9d:f156";

    console.log(_in, _out, _expected, _out === _expected);
    */

    // save current IPv6 variable, if any
    var _IPv6 = root && root.IPv6;

    function bestPresentation(address) {
      // based on:
      // Javascript to test an IPv6 address for proper format, and to
      // present the "best text representation" according to IETF Draft RFC at
      // http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04
      // 8 Feb 2010 Rich Brown, Dartware, LLC
      // Please feel free to use this code as long as you provide a link to
      // http://www.intermapper.com
      // http://intermapper.com/support/tools/IPV6-Validator.aspx
      // http://download.dartware.com/thirdparty/ipv6validator.js

      var _address = address.toLowerCase();
      var segments = _address.split(':');
      var length = segments.length;
      var total = 8;

      // trim colons (:: or ::a:b:c… or …a:b:c::)
      if (segments[0] === '' && segments[1] === '' && segments[2] === '') {
        // must have been ::
        // remove first two items
        segments.shift();
        segments.shift();
      } else if (segments[0] === '' && segments[1] === '') {
        // must have been ::xxxx
        // remove the first item
        segments.shift();
      } else if (segments[length - 1] === '' && segments[length - 2] === '') {
        // must have been xxxx::
        segments.pop();
      }

      length = segments.length;

      // adjust total segments for IPv4 trailer
      if (segments[length - 1].indexOf('.') !== -1) {
        // found a "." which means IPv4
        total = 7;
      }

      // fill empty segments them with "0000"
      var pos;
      for (pos = 0; pos < length; pos++) {
        if (segments[pos] === '') {
          break;
        }
      }

      if (pos < total) {
        segments.splice(pos, 1, '0000');
        while (segments.length < total) {
          segments.splice(pos, 0, '0000');
        }
      }

      // strip leading zeros
      var _segments;
      for (var i = 0; i < total; i++) {
        _segments = segments[i].split('');
        for (var j = 0; j < 3 ; j++) {
          if (_segments[0] === '0' && _segments.length > 1) {
            _segments.splice(0,1);
          } else {
            break;
          }
        }

        segments[i] = _segments.join('');
      }

      // find longest sequence of zeroes and coalesce them into one segment
      var best = -1;
      var _best = 0;
      var _current = 0;
      var current = -1;
      var inzeroes = false;
      // i; already declared

      for (i = 0; i < total; i++) {
        if (inzeroes) {
          if (segments[i] === '0') {
            _current += 1;
          } else {
            inzeroes = false;
            if (_current > _best) {
              best = current;
              _best = _current;
            }
          }
        } else {
          if (segments[i] === '0') {
            inzeroes = true;
            current = i;
            _current = 1;
          }
        }
      }

      if (_current > _best) {
        best = current;
        _best = _current;
      }

      if (_best > 1) {
        segments.splice(best, _best, '');
      }

      length = segments.length;

      // assemble remaining segments
      var result = '';
      if (segments[0] === '')  {
        result = ':';
      }

      for (i = 0; i < length; i++) {
        result += segments[i];
        if (i === length - 1) {
          break;
        }

        result += ':';
      }

      if (segments[length - 1] === '') {
        result += ':';
      }

      return result;
    }

    function noConflict() {
      /*jshint validthis: true */
      if (root.IPv6 === this) {
        root.IPv6 = _IPv6;
      }

      return this;
    }

    return {
      best: bestPresentation,
      noConflict: noConflict
    };
  }));
  });

  var SecondLevelDomains = createCommonjsModule(function (module) {
  /*!
   * URI.js - Mutating URLs
   * Second Level Domain (SLD) Support
   *
   * Version: 1.19.1
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   */

  (function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (module.exports) {
      // Node
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      root.SecondLevelDomains = factory(root);
    }
  }(commonjsGlobal, function (root) {

    // save current SecondLevelDomains variable, if any
    var _SecondLevelDomains = root && root.SecondLevelDomains;

    var SLD = {
      // list of known Second Level Domains
      // converted list of SLDs from https://github.com/gavingmiller/second-level-domains
      // ----
      // publicsuffix.org is more current and actually used by a couple of browsers internally.
      // downside is it also contains domains like "dyndns.org" - which is fine for the security
      // issues browser have to deal with (SOP for cookies, etc) - but is way overboard for URI.js
      // ----
      list: {
        'ac':' com gov mil net org ',
        'ae':' ac co gov mil name net org pro sch ',
        'af':' com edu gov net org ',
        'al':' com edu gov mil net org ',
        'ao':' co ed gv it og pb ',
        'ar':' com edu gob gov int mil net org tur ',
        'at':' ac co gv or ',
        'au':' asn com csiro edu gov id net org ',
        'ba':' co com edu gov mil net org rs unbi unmo unsa untz unze ',
        'bb':' biz co com edu gov info net org store tv ',
        'bh':' biz cc com edu gov info net org ',
        'bn':' com edu gov net org ',
        'bo':' com edu gob gov int mil net org tv ',
        'br':' adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ',
        'bs':' com edu gov net org ',
        'bz':' du et om ov rg ',
        'ca':' ab bc mb nb nf nl ns nt nu on pe qc sk yk ',
        'ck':' biz co edu gen gov info net org ',
        'cn':' ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ',
        'co':' com edu gov mil net nom org ',
        'cr':' ac c co ed fi go or sa ',
        'cy':' ac biz com ekloges gov ltd name net org parliament press pro tm ',
        'do':' art com edu gob gov mil net org sld web ',
        'dz':' art asso com edu gov net org pol ',
        'ec':' com edu fin gov info med mil net org pro ',
        'eg':' com edu eun gov mil name net org sci ',
        'er':' com edu gov ind mil net org rochest w ',
        'es':' com edu gob nom org ',
        'et':' biz com edu gov info name net org ',
        'fj':' ac biz com info mil name net org pro ',
        'fk':' ac co gov net nom org ',
        'fr':' asso com f gouv nom prd presse tm ',
        'gg':' co net org ',
        'gh':' com edu gov mil org ',
        'gn':' ac com gov net org ',
        'gr':' com edu gov mil net org ',
        'gt':' com edu gob ind mil net org ',
        'gu':' com edu gov net org ',
        'hk':' com edu gov idv net org ',
        'hu':' 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ',
        'id':' ac co go mil net or sch web ',
        'il':' ac co gov idf k12 muni net org ',
        'in':' ac co edu ernet firm gen gov i ind mil net nic org res ',
        'iq':' com edu gov i mil net org ',
        'ir':' ac co dnssec gov i id net org sch ',
        'it':' edu gov ',
        'je':' co net org ',
        'jo':' com edu gov mil name net org sch ',
        'jp':' ac ad co ed go gr lg ne or ',
        'ke':' ac co go info me mobi ne or sc ',
        'kh':' com edu gov mil net org per ',
        'ki':' biz com de edu gov info mob net org tel ',
        'km':' asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ',
        'kn':' edu gov net org ',
        'kr':' ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ',
        'kw':' com edu gov net org ',
        'ky':' com edu gov net org ',
        'kz':' com edu gov mil net org ',
        'lb':' com edu gov net org ',
        'lk':' assn com edu gov grp hotel int ltd net ngo org sch soc web ',
        'lr':' com edu gov net org ',
        'lv':' asn com conf edu gov id mil net org ',
        'ly':' com edu gov id med net org plc sch ',
        'ma':' ac co gov m net org press ',
        'mc':' asso tm ',
        'me':' ac co edu gov its net org priv ',
        'mg':' com edu gov mil nom org prd tm ',
        'mk':' com edu gov inf name net org pro ',
        'ml':' com edu gov net org presse ',
        'mn':' edu gov org ',
        'mo':' com edu gov net org ',
        'mt':' com edu gov net org ',
        'mv':' aero biz com coop edu gov info int mil museum name net org pro ',
        'mw':' ac co com coop edu gov int museum net org ',
        'mx':' com edu gob net org ',
        'my':' com edu gov mil name net org sch ',
        'nf':' arts com firm info net other per rec store web ',
        'ng':' biz com edu gov mil mobi name net org sch ',
        'ni':' ac co com edu gob mil net nom org ',
        'np':' com edu gov mil net org ',
        'nr':' biz com edu gov info net org ',
        'om':' ac biz co com edu gov med mil museum net org pro sch ',
        'pe':' com edu gob mil net nom org sld ',
        'ph':' com edu gov i mil net ngo org ',
        'pk':' biz com edu fam gob gok gon gop gos gov net org web ',
        'pl':' art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ',
        'pr':' ac biz com edu est gov info isla name net org pro prof ',
        'ps':' com edu gov net org plo sec ',
        'pw':' belau co ed go ne or ',
        'ro':' arts com firm info nom nt org rec store tm www ',
        'rs':' ac co edu gov in org ',
        'sb':' com edu gov net org ',
        'sc':' com edu gov net org ',
        'sh':' co com edu gov net nom org ',
        'sl':' com edu gov net org ',
        'st':' co com consulado edu embaixada gov mil net org principe saotome store ',
        'sv':' com edu gob org red ',
        'sz':' ac co org ',
        'tr':' av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ',
        'tt':' aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ',
        'tw':' club com ebiz edu game gov idv mil net org ',
        'mu':' ac co com gov net or org ',
        'mz':' ac co edu gov org ',
        'na':' co com ',
        'nz':' ac co cri geek gen govt health iwi maori mil net org parliament school ',
        'pa':' abo ac com edu gob ing med net nom org sld ',
        'pt':' com edu gov int net nome org publ ',
        'py':' com edu gov mil net org ',
        'qa':' com edu gov mil net org ',
        're':' asso com nom ',
        'ru':' ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ',
        'rw':' ac co com edu gouv gov int mil net ',
        'sa':' com edu gov med net org pub sch ',
        'sd':' com edu gov info med net org tv ',
        'se':' a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ',
        'sg':' com edu gov idn net org per ',
        'sn':' art com edu gouv org perso univ ',
        'sy':' com edu gov mil net news org ',
        'th':' ac co go in mi net or ',
        'tj':' ac biz co com edu go gov info int mil name net nic org test web ',
        'tn':' agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ',
        'tz':' ac co go ne or ',
        'ua':' biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ',
        'ug':' ac co go ne or org sc ',
        'uk':' ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ',
        'us':' dni fed isa kids nsn ',
        'uy':' com edu gub mil net org ',
        've':' co com edu gob info mil net org web ',
        'vi':' co com k12 net org ',
        'vn':' ac biz com edu gov health info int name net org pro ',
        'ye':' co com gov ltd me net org plc ',
        'yu':' ac co edu gov org ',
        'za':' ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ',
        'zm':' ac co com edu gov net org sch ',
        // https://en.wikipedia.org/wiki/CentralNic#Second-level_domains
        'com': 'ar br cn de eu gb gr hu jpn kr no qc ru sa se uk us uy za ',
        'net': 'gb jp se uk ',
        'org': 'ae',
        'de': 'com '
      },
      // gorhill 2013-10-25: Using indexOf() instead Regexp(). Significant boost
      // in both performance and memory footprint. No initialization required.
      // http://jsperf.com/uri-js-sld-regex-vs-binary-search/4
      // Following methods use lastIndexOf() rather than array.split() in order
      // to avoid any memory allocations.
      has: function(domain) {
        var tldOffset = domain.lastIndexOf('.');
        if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
          return false;
        }
        var sldOffset = domain.lastIndexOf('.', tldOffset-1);
        if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
          return false;
        }
        var sldList = SLD.list[domain.slice(tldOffset+1)];
        if (!sldList) {
          return false;
        }
        return sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') >= 0;
      },
      is: function(domain) {
        var tldOffset = domain.lastIndexOf('.');
        if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
          return false;
        }
        var sldOffset = domain.lastIndexOf('.', tldOffset-1);
        if (sldOffset >= 0) {
          return false;
        }
        var sldList = SLD.list[domain.slice(tldOffset+1)];
        if (!sldList) {
          return false;
        }
        return sldList.indexOf(' ' + domain.slice(0, tldOffset) + ' ') >= 0;
      },
      get: function(domain) {
        var tldOffset = domain.lastIndexOf('.');
        if (tldOffset <= 0 || tldOffset >= (domain.length-1)) {
          return null;
        }
        var sldOffset = domain.lastIndexOf('.', tldOffset-1);
        if (sldOffset <= 0 || sldOffset >= (tldOffset-1)) {
          return null;
        }
        var sldList = SLD.list[domain.slice(tldOffset+1)];
        if (!sldList) {
          return null;
        }
        if (sldList.indexOf(' ' + domain.slice(sldOffset+1, tldOffset) + ' ') < 0) {
          return null;
        }
        return domain.slice(sldOffset+1);
      },
      noConflict: function(){
        if (root.SecondLevelDomains === this) {
          root.SecondLevelDomains = _SecondLevelDomains;
        }
        return this;
      }
    };

    return SLD;
  }));
  });

  var URI = createCommonjsModule(function (module) {
  /*!
   * URI.js - Mutating URLs
   *
   * Version: 1.19.1
   *
   * Author: Rodney Rehm
   * Web: http://medialize.github.io/URI.js/
   *
   * Licensed under
   *   MIT License http://www.opensource.org/licenses/mit-license
   *
   */
  (function (root, factory) {
    // https://github.com/umdjs/umd/blob/master/returnExports.js
    if (module.exports) {
      // Node
      module.exports = factory(punycode, IPv6, SecondLevelDomains);
    } else {
      // Browser globals (root is window)
      root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
    }
  }(commonjsGlobal, function (punycode$$1, IPv6$$1, SLD, root) {
    /*global location, escape, unescape */
    // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
    /*jshint camelcase: false */

    // save current URI variable, if any
    var _URI = root && root.URI;

    function URI(url, base) {
      var _urlSupplied = arguments.length >= 1;
      var _baseSupplied = arguments.length >= 2;

      // Allow instantiation without the 'new' keyword
      if (!(this instanceof URI)) {
        if (_urlSupplied) {
          if (_baseSupplied) {
            return new URI(url, base);
          }

          return new URI(url);
        }

        return new URI();
      }

      if (url === undefined) {
        if (_urlSupplied) {
          throw new TypeError('undefined is not a valid argument for URI');
        }

        if (typeof location !== 'undefined') {
          url = location.href + '';
        } else {
          url = '';
        }
      }

      if (url === null) {
        if (_urlSupplied) {
          throw new TypeError('null is not a valid argument for URI');
        }
      }

      this.href(url);

      // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
      if (base !== undefined) {
        return this.absoluteTo(base);
      }

      return this;
    }

    function isInteger(value) {
      return /^[0-9]+$/.test(value);
    }

    URI.version = '1.19.1';

    var p = URI.prototype;
    var hasOwn = Object.prototype.hasOwnProperty;

    function escapeRegEx(string) {
      // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
      return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    }

    function getType(value) {
      // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
      if (value === undefined) {
        return 'Undefined';
      }

      return String(Object.prototype.toString.call(value)).slice(8, -1);
    }

    function isArray(obj) {
      return getType(obj) === 'Array';
    }

    function filterArrayValues(data, value) {
      var lookup = {};
      var i, length;

      if (getType(value) === 'RegExp') {
        lookup = null;
      } else if (isArray(value)) {
        for (i = 0, length = value.length; i < length; i++) {
          lookup[value[i]] = true;
        }
      } else {
        lookup[value] = true;
      }

      for (i = 0, length = data.length; i < length; i++) {
        /*jshint laxbreak: true */
        var _match = lookup && lookup[data[i]] !== undefined
          || !lookup && value.test(data[i]);
        /*jshint laxbreak: false */
        if (_match) {
          data.splice(i, 1);
          length--;
          i--;
        }
      }

      return data;
    }

    function arrayContains(list, value) {
      var i, length;

      // value may be string, number, array, regexp
      if (isArray(value)) {
        // Note: this can be optimized to O(n) (instead of current O(m * n))
        for (i = 0, length = value.length; i < length; i++) {
          if (!arrayContains(list, value[i])) {
            return false;
          }
        }

        return true;
      }

      var _type = getType(value);
      for (i = 0, length = list.length; i < length; i++) {
        if (_type === 'RegExp') {
          if (typeof list[i] === 'string' && list[i].match(value)) {
            return true;
          }
        } else if (list[i] === value) {
          return true;
        }
      }

      return false;
    }

    function arraysEqual(one, two) {
      if (!isArray(one) || !isArray(two)) {
        return false;
      }

      // arrays can't be equal if they have different amount of content
      if (one.length !== two.length) {
        return false;
      }

      one.sort();
      two.sort();

      for (var i = 0, l = one.length; i < l; i++) {
        if (one[i] !== two[i]) {
          return false;
        }
      }

      return true;
    }

    function trimSlashes(text) {
      var trim_expression = /^\/+|\/+$/g;
      return text.replace(trim_expression, '');
    }

    URI._parts = function() {
      return {
        protocol: null,
        username: null,
        password: null,
        hostname: null,
        urn: null,
        port: null,
        path: null,
        query: null,
        fragment: null,
        // state
        preventInvalidHostname: URI.preventInvalidHostname,
        duplicateQueryParameters: URI.duplicateQueryParameters,
        escapeQuerySpace: URI.escapeQuerySpace
      };
    };
    // state: throw on invalid hostname
    // see https://github.com/medialize/URI.js/pull/345
    // and https://github.com/medialize/URI.js/issues/354
    URI.preventInvalidHostname = false;
    // state: allow duplicate query parameters (a=1&a=1)
    URI.duplicateQueryParameters = false;
    // state: replaces + with %20 (space in query strings)
    URI.escapeQuerySpace = true;
    // static properties
    URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
    URI.idn_expression = /[^a-z0-9\._-]/i;
    URI.punycode_expression = /(xn--)/i;
    // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
    URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    // credits to Rich Brown
    // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
    // specification: http://www.ietf.org/rfc/rfc4291.txt
    URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    // expression used is "gruber revised" (@gruber v2) determined to be the
    // best solution in a regex-golf we did a couple of ages ago at
    // * http://mathiasbynens.be/demo/url-regex
    // * http://rodneyrehm.de/t/url-regex.html
    URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
    URI.findUri = {
      // valid "scheme://" or "www."
      start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
      // everything up to the next whitespace
      end: /[\s\r\n]|$/,
      // trim trailing punctuation captured by end RegExp
      trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/,
      // balanced parens inclusion (), [], {}, <>
      parens: /(\([^\)]*\)|\[[^\]]*\]|\{[^}]*\}|<[^>]*>)/g,
    };
    // http://www.iana.org/assignments/uri-schemes.html
    // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
    URI.defaultPorts = {
      http: '80',
      https: '443',
      ftp: '21',
      gopher: '70',
      ws: '80',
      wss: '443'
    };
    // list of protocols which always require a hostname
    URI.hostProtocols = [
      'http',
      'https'
    ];

    // allowed hostname characters according to RFC 3986
    // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
    // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . - _
    URI.invalid_hostname_characters = /[^a-zA-Z0-9\.\-:_]/;
    // map DOM Elements to their URI attribute
    URI.domAttributes = {
      'a': 'href',
      'blockquote': 'cite',
      'link': 'href',
      'base': 'href',
      'script': 'src',
      'form': 'action',
      'img': 'src',
      'area': 'href',
      'iframe': 'src',
      'embed': 'src',
      'source': 'src',
      'track': 'src',
      'input': 'src', // but only if type="image"
      'audio': 'src',
      'video': 'src'
    };
    URI.getDomAttribute = function(node) {
      if (!node || !node.nodeName) {
        return undefined;
      }

      var nodeName = node.nodeName.toLowerCase();
      // <input> should only expose src for type="image"
      if (nodeName === 'input' && node.type !== 'image') {
        return undefined;
      }

      return URI.domAttributes[nodeName];
    };

    function escapeForDumbFirefox36(value) {
      // https://github.com/medialize/URI.js/issues/91
      return escape(value);
    }

    // encoding / decoding according to RFC3986
    function strictEncodeURIComponent(string) {
      // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
      return encodeURIComponent(string)
        .replace(/[!'()*]/g, escapeForDumbFirefox36)
        .replace(/\*/g, '%2A');
    }
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
    URI.iso8859 = function() {
      URI.encode = escape;
      URI.decode = unescape;
    };
    URI.unicode = function() {
      URI.encode = strictEncodeURIComponent;
      URI.decode = decodeURIComponent;
    };
    URI.characters = {
      pathname: {
        encode: {
          // RFC3986 2.1: For consistency, URI producers and normalizers should
          // use uppercase hexadecimal digits for all percent-encodings.
          expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
          map: {
            // -._~!'()*
            '%24': '$',
            '%26': '&',
            '%2B': '+',
            '%2C': ',',
            '%3B': ';',
            '%3D': '=',
            '%3A': ':',
            '%40': '@'
          }
        },
        decode: {
          expression: /[\/\?#]/g,
          map: {
            '/': '%2F',
            '?': '%3F',
            '#': '%23'
          }
        }
      },
      reserved: {
        encode: {
          // RFC3986 2.1: For consistency, URI producers and normalizers should
          // use uppercase hexadecimal digits for all percent-encodings.
          expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
          map: {
            // gen-delims
            '%3A': ':',
            '%2F': '/',
            '%3F': '?',
            '%23': '#',
            '%5B': '[',
            '%5D': ']',
            '%40': '@',
            // sub-delims
            '%21': '!',
            '%24': '$',
            '%26': '&',
            '%27': '\'',
            '%28': '(',
            '%29': ')',
            '%2A': '*',
            '%2B': '+',
            '%2C': ',',
            '%3B': ';',
            '%3D': '='
          }
        }
      },
      urnpath: {
        // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
        // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
        // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
        // note that the colon character is not featured in the encoding map; this is because URI.js
        // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
        // should not appear unencoded in a segment itself.
        // See also the note above about RFC3986 and capitalalized hex digits.
        encode: {
          expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
          map: {
            '%21': '!',
            '%24': '$',
            '%27': '\'',
            '%28': '(',
            '%29': ')',
            '%2A': '*',
            '%2B': '+',
            '%2C': ',',
            '%3B': ';',
            '%3D': '=',
            '%40': '@'
          }
        },
        // These characters are the characters called out by RFC2141 as "reserved" characters that
        // should never appear in a URN, plus the colon character (see note above).
        decode: {
          expression: /[\/\?#:]/g,
          map: {
            '/': '%2F',
            '?': '%3F',
            '#': '%23',
            ':': '%3A'
          }
        }
      }
    };
    URI.encodeQuery = function(string, escapeQuerySpace) {
      var escaped = URI.encode(string + '');
      if (escapeQuerySpace === undefined) {
        escapeQuerySpace = URI.escapeQuerySpace;
      }

      return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
    };
    URI.decodeQuery = function(string, escapeQuerySpace) {
      string += '';
      if (escapeQuerySpace === undefined) {
        escapeQuerySpace = URI.escapeQuerySpace;
      }

      try {
        return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
      } catch(e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
      }
    };
    // generate encode/decode path functions
    var _parts = {'encode':'encode', 'decode':'decode'};
    var _part;
    var generateAccessor = function(_group, _part) {
      return function(string) {
        try {
          return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function(c) {
            return URI.characters[_group][_part].map[c];
          });
        } catch (e) {
          // we're not going to mess with weird encodings,
          // give up and return the undecoded original string
          // see https://github.com/medialize/URI.js/issues/87
          // see https://github.com/medialize/URI.js/issues/92
          return string;
        }
      };
    };

    for (_part in _parts) {
      URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
      URI[_part + 'UrnPathSegment'] = generateAccessor('urnpath', _parts[_part]);
    }

    var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
      return function(string) {
        // Why pass in names of functions, rather than the function objects themselves? The
        // definitions of some functions (but in particular, URI.decode) will occasionally change due
        // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
        // that the functions we use here are "fresh".
        var actualCodingFunc;
        if (!_innerCodingFuncName) {
          actualCodingFunc = URI[_codingFuncName];
        } else {
          actualCodingFunc = function(string) {
            return URI[_codingFuncName](URI[_innerCodingFuncName](string));
          };
        }

        var segments = (string + '').split(_sep);

        for (var i = 0, length = segments.length; i < length; i++) {
          segments[i] = actualCodingFunc(segments[i]);
        }

        return segments.join(_sep);
      };
    };

    // This takes place outside the above loop because we don't want, e.g., encodeUrnPath functions.
    URI.decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
    URI.decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
    URI.recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
    URI.recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');

    URI.encodeReserved = generateAccessor('reserved', 'encode');

    URI.parse = function(string, parts) {
      var pos;
      if (!parts) {
        parts = {
          preventInvalidHostname: URI.preventInvalidHostname
        };
      }
      // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

      // extract fragment
      pos = string.indexOf('#');
      if (pos > -1) {
        // escaping?
        parts.fragment = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
      }

      // extract query
      pos = string.indexOf('?');
      if (pos > -1) {
        // escaping?
        parts.query = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
      }

      // extract protocol
      if (string.substring(0, 2) === '//') {
        // relative-scheme
        parts.protocol = null;
        string = string.substring(2);
        // extract "user:pass@host:port"
        string = URI.parseAuthority(string, parts);
      } else {
        pos = string.indexOf(':');
        if (pos > -1) {
          parts.protocol = string.substring(0, pos) || null;
          if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
            // : may be within the path
            parts.protocol = undefined;
          } else if (string.substring(pos + 1, pos + 3) === '//') {
            string = string.substring(pos + 3);

            // extract "user:pass@host:port"
            string = URI.parseAuthority(string, parts);
          } else {
            string = string.substring(pos + 1);
            parts.urn = true;
          }
        }
      }

      // what's left must be the path
      parts.path = string;

      // and we're done
      return parts;
    };
    URI.parseHost = function(string, parts) {
      if (!string) {
        string = '';
      }

      // Copy chrome, IE, opera backslash-handling behavior.
      // Back slashes before the query string get converted to forward slashes
      // See: https://github.com/joyent/node/blob/386fd24f49b0e9d1a8a076592a404168faeecc34/lib/url.js#L115-L124
      // See: https://code.google.com/p/chromium/issues/detail?id=25916
      // https://github.com/medialize/URI.js/pull/233
      string = string.replace(/\\/g, '/');

      // extract host:port
      var pos = string.indexOf('/');
      var bracketPos;
      var t;

      if (pos === -1) {
        pos = string.length;
      }

      if (string.charAt(0) === '[') {
        // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
        // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
        // IPv6+port in the format [2001:db8::1]:80 (for the time being)
        bracketPos = string.indexOf(']');
        parts.hostname = string.substring(1, bracketPos) || null;
        parts.port = string.substring(bracketPos + 2, pos) || null;
        if (parts.port === '/') {
          parts.port = null;
        }
      } else {
        var firstColon = string.indexOf(':');
        var firstSlash = string.indexOf('/');
        var nextColon = string.indexOf(':', firstColon + 1);
        if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
          // IPv6 host contains multiple colons - but no port
          // this notation is actually not allowed by RFC 3986, but we're a liberal parser
          parts.hostname = string.substring(0, pos) || null;
          parts.port = null;
        } else {
          t = string.substring(0, pos).split(':');
          parts.hostname = t[0] || null;
          parts.port = t[1] || null;
        }
      }

      if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
        pos++;
        string = '/' + string;
      }

      if (parts.preventInvalidHostname) {
        URI.ensureValidHostname(parts.hostname, parts.protocol);
      }

      if (parts.port) {
        URI.ensureValidPort(parts.port);
      }

      return string.substring(pos) || '/';
    };
    URI.parseAuthority = function(string, parts) {
      string = URI.parseUserinfo(string, parts);
      return URI.parseHost(string, parts);
    };
    URI.parseUserinfo = function(string, parts) {
      // extract username:password
      var firstSlash = string.indexOf('/');
      var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
      var t;

      // authority@ must come before /path
      if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
        t = string.substring(0, pos).split(':');
        parts.username = t[0] ? URI.decode(t[0]) : null;
        t.shift();
        parts.password = t[0] ? URI.decode(t.join(':')) : null;
        string = string.substring(pos + 1);
      } else {
        parts.username = null;
        parts.password = null;
      }

      return string;
    };
    URI.parseQuery = function(string, escapeQuerySpace) {
      if (!string) {
        return {};
      }

      // throw out the funky business - "?"[name"="value"&"]+
      string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

      if (!string) {
        return {};
      }

      var items = {};
      var splits = string.split('&');
      var length = splits.length;
      var v, name, value;

      for (var i = 0; i < length; i++) {
        v = splits[i].split('=');
        name = URI.decodeQuery(v.shift(), escapeQuerySpace);
        // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
        value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

        if (hasOwn.call(items, name)) {
          if (typeof items[name] === 'string' || items[name] === null) {
            items[name] = [items[name]];
          }

          items[name].push(value);
        } else {
          items[name] = value;
        }
      }

      return items;
    };

    URI.build = function(parts) {
      var t = '';

      if (parts.protocol) {
        t += parts.protocol + ':';
      }

      if (!parts.urn && (t || parts.hostname)) {
        t += '//';
      }

      t += (URI.buildAuthority(parts) || '');

      if (typeof parts.path === 'string') {
        if (parts.path.charAt(0) !== '/' && typeof parts.hostname === 'string') {
          t += '/';
        }

        t += parts.path;
      }

      if (typeof parts.query === 'string' && parts.query) {
        t += '?' + parts.query;
      }

      if (typeof parts.fragment === 'string' && parts.fragment) {
        t += '#' + parts.fragment;
      }
      return t;
    };
    URI.buildHost = function(parts) {
      var t = '';

      if (!parts.hostname) {
        return '';
      } else if (URI.ip6_expression.test(parts.hostname)) {
        t += '[' + parts.hostname + ']';
      } else {
        t += parts.hostname;
      }

      if (parts.port) {
        t += ':' + parts.port;
      }

      return t;
    };
    URI.buildAuthority = function(parts) {
      return URI.buildUserinfo(parts) + URI.buildHost(parts);
    };
    URI.buildUserinfo = function(parts) {
      var t = '';

      if (parts.username) {
        t += URI.encode(parts.username);
      }

      if (parts.password) {
        t += ':' + URI.encode(parts.password);
      }

      if (t) {
        t += '@';
      }

      return t;
    };
    URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
      // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
      // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
      // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
      // URI.js treats the query string as being application/x-www-form-urlencoded
      // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

      var t = '';
      var unique, key, i, length;
      for (key in data) {
        if (hasOwn.call(data, key) && key) {
          if (isArray(data[key])) {
            unique = {};
            for (i = 0, length = data[key].length; i < length; i++) {
              if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
                t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
                if (duplicateQueryParameters !== true) {
                  unique[data[key][i] + ''] = true;
                }
              }
            }
          } else if (data[key] !== undefined) {
            t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
          }
        }
      }

      return t.substring(1);
    };
    URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
      // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
      // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
      return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
    };

    URI.addQuery = function(data, name, value) {
      if (typeof name === 'object') {
        for (var key in name) {
          if (hasOwn.call(name, key)) {
            URI.addQuery(data, key, name[key]);
          }
        }
      } else if (typeof name === 'string') {
        if (data[name] === undefined) {
          data[name] = value;
          return;
        } else if (typeof data[name] === 'string') {
          data[name] = [data[name]];
        }

        if (!isArray(value)) {
          value = [value];
        }

        data[name] = (data[name] || []).concat(value);
      } else {
        throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
      }
    };

    URI.setQuery = function(data, name, value) {
      if (typeof name === 'object') {
        for (var key in name) {
          if (hasOwn.call(name, key)) {
            URI.setQuery(data, key, name[key]);
          }
        }
      } else if (typeof name === 'string') {
        data[name] = value === undefined ? null : value;
      } else {
        throw new TypeError('URI.setQuery() accepts an object, string as the name parameter');
      }
    };

    URI.removeQuery = function(data, name, value) {
      var i, length, key;

      if (isArray(name)) {
        for (i = 0, length = name.length; i < length; i++) {
          data[name[i]] = undefined;
        }
      } else if (getType(name) === 'RegExp') {
        for (key in data) {
          if (name.test(key)) {
            data[key] = undefined;
          }
        }
      } else if (typeof name === 'object') {
        for (key in name) {
          if (hasOwn.call(name, key)) {
            URI.removeQuery(data, key, name[key]);
          }
        }
      } else if (typeof name === 'string') {
        if (value !== undefined) {
          if (getType(value) === 'RegExp') {
            if (!isArray(data[name]) && value.test(data[name])) {
              data[name] = undefined;
            } else {
              data[name] = filterArrayValues(data[name], value);
            }
          } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
            data[name] = undefined;
          } else if (isArray(data[name])) {
            data[name] = filterArrayValues(data[name], value);
          }
        } else {
          data[name] = undefined;
        }
      } else {
        throw new TypeError('URI.removeQuery() accepts an object, string, RegExp as the first parameter');
      }
    };
    URI.hasQuery = function(data, name, value, withinArray) {
      switch (getType(name)) {
        case 'String':
          // Nothing to do here
          break;

        case 'RegExp':
          for (var key in data) {
            if (hasOwn.call(data, key)) {
              if (name.test(key) && (value === undefined || URI.hasQuery(data, key, value))) {
                return true;
              }
            }
          }

          return false;

        case 'Object':
          for (var _key in name) {
            if (hasOwn.call(name, _key)) {
              if (!URI.hasQuery(data, _key, name[_key])) {
                return false;
              }
            }
          }

          return true;

        default:
          throw new TypeError('URI.hasQuery() accepts a string, regular expression or object as the name parameter');
      }

      switch (getType(value)) {
        case 'Undefined':
          // true if exists (but may be empty)
          return name in data; // data[name] !== undefined;

        case 'Boolean':
          // true if exists and non-empty
          var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
          return value === _booly;

        case 'Function':
          // allow complex comparison
          return !!value(data[name], name, data);

        case 'Array':
          if (!isArray(data[name])) {
            return false;
          }

          var op = withinArray ? arrayContains : arraysEqual;
          return op(data[name], value);

        case 'RegExp':
          if (!isArray(data[name])) {
            return Boolean(data[name] && data[name].match(value));
          }

          if (!withinArray) {
            return false;
          }

          return arrayContains(data[name], value);

        case 'Number':
          value = String(value);
          /* falls through */
        case 'String':
          if (!isArray(data[name])) {
            return data[name] === value;
          }

          if (!withinArray) {
            return false;
          }

          return arrayContains(data[name], value);

        default:
          throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
      }
    };


    URI.joinPaths = function() {
      var input = [];
      var segments = [];
      var nonEmptySegments = 0;

      for (var i = 0; i < arguments.length; i++) {
        var url = new URI(arguments[i]);
        input.push(url);
        var _segments = url.segment();
        for (var s = 0; s < _segments.length; s++) {
          if (typeof _segments[s] === 'string') {
            segments.push(_segments[s]);
          }

          if (_segments[s]) {
            nonEmptySegments++;
          }
        }
      }

      if (!segments.length || !nonEmptySegments) {
        return new URI('');
      }

      var uri = new URI('').segment(segments);

      if (input[0].path() === '' || input[0].path().slice(0, 1) === '/') {
        uri.path('/' + uri.path());
      }

      return uri.normalize();
    };

    URI.commonPath = function(one, two) {
      var length = Math.min(one.length, two.length);
      var pos;

      // find first non-matching character
      for (pos = 0; pos < length; pos++) {
        if (one.charAt(pos) !== two.charAt(pos)) {
          pos--;
          break;
        }
      }

      if (pos < 1) {
        return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
      }

      // revert to last /
      if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
        pos = one.substring(0, pos).lastIndexOf('/');
      }

      return one.substring(0, pos + 1);
    };

    URI.withinString = function(string, callback, options) {
      options || (options = {});
      var _start = options.start || URI.findUri.start;
      var _end = options.end || URI.findUri.end;
      var _trim = options.trim || URI.findUri.trim;
      var _parens = options.parens || URI.findUri.parens;
      var _attributeOpen = /[a-z0-9-]=["']?$/i;

      _start.lastIndex = 0;
      while (true) {
        var match = _start.exec(string);
        if (!match) {
          break;
        }

        var start = match.index;
        if (options.ignoreHtml) {
          // attribut(e=["']?$)
          var attributeOpen = string.slice(Math.max(start - 3, 0), start);
          if (attributeOpen && _attributeOpen.test(attributeOpen)) {
            continue;
          }
        }

        var end = start + string.slice(start).search(_end);
        var slice = string.slice(start, end);
        // make sure we include well balanced parens
        var parensEnd = -1;
        while (true) {
          var parensMatch = _parens.exec(slice);
          if (!parensMatch) {
            break;
          }

          var parensMatchEnd = parensMatch.index + parensMatch[0].length;
          parensEnd = Math.max(parensEnd, parensMatchEnd);
        }

        if (parensEnd > -1) {
          slice = slice.slice(0, parensEnd) + slice.slice(parensEnd).replace(_trim, '');
        } else {
          slice = slice.replace(_trim, '');
        }

        if (slice.length <= match[0].length) {
          // the extract only contains the starting marker of a URI,
          // e.g. "www" or "http://"
          continue;
        }

        if (options.ignore && options.ignore.test(slice)) {
          continue;
        }

        end = start + slice.length;
        var result = callback(slice, start, end, string);
        if (result === undefined) {
          _start.lastIndex = end;
          continue;
        }

        result = String(result);
        string = string.slice(0, start) + result + string.slice(end);
        _start.lastIndex = start + result.length;
      }

      _start.lastIndex = 0;
      return string;
    };

    URI.ensureValidHostname = function(v, protocol) {
      // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
      // they are not part of DNS and therefore ignored by URI.js

      var hasHostname = !!v; // not null and not an empty string
      var hasProtocol = !!protocol;
      var rejectEmptyHostname = false;

      if (hasProtocol) {
        rejectEmptyHostname = arrayContains(URI.hostProtocols, protocol);
      }

      if (rejectEmptyHostname && !hasHostname) {
        throw new TypeError('Hostname cannot be empty, if protocol is ' + protocol);
      } else if (v && v.match(URI.invalid_hostname_characters)) {
        // test punycode
        if (!punycode$$1) {
          throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available');
        }
        if (punycode$$1.toASCII(v).match(URI.invalid_hostname_characters)) {
          throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_]');
        }
      }
    };

    URI.ensureValidPort = function (v) {
      if (!v) {
        return;
      }

      var port = Number(v);
      if (isInteger(port) && (port > 0) && (port < 65536)) {
        return;
      }

      throw new TypeError('Port "' + v + '" is not a valid port');
    };

    // noConflict
    URI.noConflict = function(removeAll) {
      if (removeAll) {
        var unconflicted = {
          URI: this.noConflict()
        };

        if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
          unconflicted.URITemplate = root.URITemplate.noConflict();
        }

        if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
          unconflicted.IPv6 = root.IPv6.noConflict();
        }

        if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
          unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
        }

        return unconflicted;
      } else if (root.URI === this) {
        root.URI = _URI;
      }

      return this;
    };

    p.build = function(deferBuild) {
      if (deferBuild === true) {
        this._deferred_build = true;
      } else if (deferBuild === undefined || this._deferred_build) {
        this._string = URI.build(this._parts);
        this._deferred_build = false;
      }

      return this;
    };

    p.clone = function() {
      return new URI(this);
    };

    p.valueOf = p.toString = function() {
      return this.build(false)._string;
    };


    function generateSimpleAccessor(_part){
      return function(v, build) {
        if (v === undefined) {
          return this._parts[_part] || '';
        } else {
          this._parts[_part] = v || null;
          this.build(!build);
          return this;
        }
      };
    }

    function generatePrefixAccessor(_part, _key){
      return function(v, build) {
        if (v === undefined) {
          return this._parts[_part] || '';
        } else {
          if (v !== null) {
            v = v + '';
            if (v.charAt(0) === _key) {
              v = v.substring(1);
            }
          }

          this._parts[_part] = v;
          this.build(!build);
          return this;
        }
      };
    }

    p.protocol = generateSimpleAccessor('protocol');
    p.username = generateSimpleAccessor('username');
    p.password = generateSimpleAccessor('password');
    p.hostname = generateSimpleAccessor('hostname');
    p.port = generateSimpleAccessor('port');
    p.query = generatePrefixAccessor('query', '?');
    p.fragment = generatePrefixAccessor('fragment', '#');

    p.search = function(v, build) {
      var t = this.query(v, build);
      return typeof t === 'string' && t.length ? ('?' + t) : t;
    };
    p.hash = function(v, build) {
      var t = this.fragment(v, build);
      return typeof t === 'string' && t.length ? ('#' + t) : t;
    };

    p.pathname = function(v, build) {
      if (v === undefined || v === true) {
        var res = this._parts.path || (this._parts.hostname ? '/' : '');
        return v ? (this._parts.urn ? URI.decodeUrnPath : URI.decodePath)(res) : res;
      } else {
        if (this._parts.urn) {
          this._parts.path = v ? URI.recodeUrnPath(v) : '';
        } else {
          this._parts.path = v ? URI.recodePath(v) : '/';
        }
        this.build(!build);
        return this;
      }
    };
    p.path = p.pathname;
    p.href = function(href, build) {
      var key;

      if (href === undefined) {
        return this.toString();
      }

      this._string = '';
      this._parts = URI._parts();

      var _URI = href instanceof URI;
      var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
      if (href.nodeName) {
        var attribute = URI.getDomAttribute(href);
        href = href[attribute] || '';
        _object = false;
      }

      // window.location is reported to be an object, but it's not the sort
      // of object we're looking for:
      // * location.protocol ends with a colon
      // * location.query != object.search
      // * location.hash != object.fragment
      // simply serializing the unknown object should do the trick
      // (for location, not for everything...)
      if (!_URI && _object && href.pathname !== undefined) {
        href = href.toString();
      }

      if (typeof href === 'string' || href instanceof String) {
        this._parts = URI.parse(String(href), this._parts);
      } else if (_URI || _object) {
        var src = _URI ? href._parts : href;
        for (key in src) {
          if (key === 'query') { continue; }
          if (hasOwn.call(this._parts, key)) {
            this._parts[key] = src[key];
          }
        }
        if (src.query) {
          this.query(src.query, false);
        }
      } else {
        throw new TypeError('invalid input');
      }

      this.build(!build);
      return this;
    };

    // identification accessors
    p.is = function(what) {
      var ip = false;
      var ip4 = false;
      var ip6 = false;
      var name = false;
      var sld = false;
      var idn = false;
      var punycode$$1 = false;
      var relative = !this._parts.urn;

      if (this._parts.hostname) {
        relative = false;
        ip4 = URI.ip4_expression.test(this._parts.hostname);
        ip6 = URI.ip6_expression.test(this._parts.hostname);
        ip = ip4 || ip6;
        name = !ip;
        sld = name && SLD && SLD.has(this._parts.hostname);
        idn = name && URI.idn_expression.test(this._parts.hostname);
        punycode$$1 = name && URI.punycode_expression.test(this._parts.hostname);
      }

      switch (what.toLowerCase()) {
        case 'relative':
          return relative;

        case 'absolute':
          return !relative;

        // hostname identification
        case 'domain':
        case 'name':
          return name;

        case 'sld':
          return sld;

        case 'ip':
          return ip;

        case 'ip4':
        case 'ipv4':
        case 'inet4':
          return ip4;

        case 'ip6':
        case 'ipv6':
        case 'inet6':
          return ip6;

        case 'idn':
          return idn;

        case 'url':
          return !this._parts.urn;

        case 'urn':
          return !!this._parts.urn;

        case 'punycode':
          return punycode$$1;
      }

      return null;
    };

    // component specific input validation
    var _protocol = p.protocol;
    var _port = p.port;
    var _hostname = p.hostname;

    p.protocol = function(v, build) {
      if (v) {
        // accept trailing ://
        v = v.replace(/:(\/\/)?$/, '');

        if (!v.match(URI.protocol_expression)) {
          throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
        }
      }

      return _protocol.call(this, v, build);
    };
    p.scheme = p.protocol;
    p.port = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (v !== undefined) {
        if (v === 0) {
          v = null;
        }

        if (v) {
          v += '';
          if (v.charAt(0) === ':') {
            v = v.substring(1);
          }

          URI.ensureValidPort(v);
        }
      }
      return _port.call(this, v, build);
    };
    p.hostname = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (v !== undefined) {
        var x = { preventInvalidHostname: this._parts.preventInvalidHostname };
        var res = URI.parseHost(v, x);
        if (res !== '/') {
          throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
        }

        v = x.hostname;
        if (this._parts.preventInvalidHostname) {
          URI.ensureValidHostname(v, this._parts.protocol);
        }
      }

      return _hostname.call(this, v, build);
    };

    // compound accessors
    p.origin = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (v === undefined) {
        var protocol = this.protocol();
        var authority = this.authority();
        if (!authority) {
          return '';
        }

        return (protocol ? protocol + '://' : '') + this.authority();
      } else {
        var origin = URI(v);
        this
          .protocol(origin.protocol())
          .authority(origin.authority())
          .build(!build);
        return this;
      }
    };
    p.host = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (v === undefined) {
        return this._parts.hostname ? URI.buildHost(this._parts) : '';
      } else {
        var res = URI.parseHost(v, this._parts);
        if (res !== '/') {
          throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
        }

        this.build(!build);
        return this;
      }
    };
    p.authority = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (v === undefined) {
        return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
      } else {
        var res = URI.parseAuthority(v, this._parts);
        if (res !== '/') {
          throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
        }

        this.build(!build);
        return this;
      }
    };
    p.userinfo = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (v === undefined) {
        var t = URI.buildUserinfo(this._parts);
        return t ? t.substring(0, t.length -1) : t;
      } else {
        if (v[v.length-1] !== '@') {
          v += '@';
        }

        URI.parseUserinfo(v, this._parts);
        this.build(!build);
        return this;
      }
    };
    p.resource = function(v, build) {
      var parts;

      if (v === undefined) {
        return this.path() + this.search() + this.hash();
      }

      parts = URI.parse(v);
      this._parts.path = parts.path;
      this._parts.query = parts.query;
      this._parts.fragment = parts.fragment;
      this.build(!build);
      return this;
    };

    // fraction accessors
    p.subdomain = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      // convenience, return "www" from "www.example.org"
      if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
          return '';
        }

        // grab domain and add another segment
        var end = this._parts.hostname.length - this.domain().length - 1;
        return this._parts.hostname.substring(0, end) || '';
      } else {
        var e = this._parts.hostname.length - this.domain().length;
        var sub = this._parts.hostname.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(sub));

        if (v && v.charAt(v.length - 1) !== '.') {
          v += '.';
        }

        if (v.indexOf(':') !== -1) {
          throw new TypeError('Domains cannot contain colons');
        }

        if (v) {
          URI.ensureValidHostname(v, this._parts.protocol);
        }

        this._parts.hostname = this._parts.hostname.replace(replace, v);
        this.build(!build);
        return this;
      }
    };
    p.domain = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (typeof v === 'boolean') {
        build = v;
        v = undefined;
      }

      // convenience, return "example.org" from "www.example.org"
      if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
          return '';
        }

        // if hostname consists of 1 or 2 segments, it must be the domain
        var t = this._parts.hostname.match(/\./g);
        if (t && t.length < 2) {
          return this._parts.hostname;
        }

        // grab tld and add another segment
        var end = this._parts.hostname.length - this.tld(build).length - 1;
        end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
        return this._parts.hostname.substring(end) || '';
      } else {
        if (!v) {
          throw new TypeError('cannot set domain empty');
        }

        if (v.indexOf(':') !== -1) {
          throw new TypeError('Domains cannot contain colons');
        }

        URI.ensureValidHostname(v, this._parts.protocol);

        if (!this._parts.hostname || this.is('IP')) {
          this._parts.hostname = v;
        } else {
          var replace = new RegExp(escapeRegEx(this.domain()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
      }
    };
    p.tld = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (typeof v === 'boolean') {
        build = v;
        v = undefined;
      }

      // return "org" from "www.example.org"
      if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
          return '';
        }

        var pos = this._parts.hostname.lastIndexOf('.');
        var tld = this._parts.hostname.substring(pos + 1);

        if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
          return SLD.get(this._parts.hostname) || tld;
        }

        return tld;
      } else {
        var replace;

        if (!v) {
          throw new TypeError('cannot set TLD empty');
        } else if (v.match(/[^a-zA-Z0-9-]/)) {
          if (SLD && SLD.is(v)) {
            replace = new RegExp(escapeRegEx(this.tld()) + '$');
            this._parts.hostname = this._parts.hostname.replace(replace, v);
          } else {
            throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
          }
        } else if (!this._parts.hostname || this.is('IP')) {
          throw new ReferenceError('cannot set TLD on non-domain host');
        } else {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        }

        this.build(!build);
        return this;
      }
    };
    p.directory = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (v === undefined || v === true) {
        if (!this._parts.path && !this._parts.hostname) {
          return '';
        }

        if (this._parts.path === '/') {
          return '/';
        }

        var end = this._parts.path.length - this.filename().length - 1;
        var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');

        return v ? URI.decodePath(res) : res;

      } else {
        var e = this._parts.path.length - this.filename().length;
        var directory = this._parts.path.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(directory));

        // fully qualifier directories begin with a slash
        if (!this.is('relative')) {
          if (!v) {
            v = '/';
          }

          if (v.charAt(0) !== '/') {
            v = '/' + v;
          }
        }

        // directories always end with a slash
        if (v && v.charAt(v.length - 1) !== '/') {
          v += '/';
        }

        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
        this.build(!build);
        return this;
      }
    };
    p.filename = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (typeof v !== 'string') {
        if (!this._parts.path || this._parts.path === '/') {
          return '';
        }

        var pos = this._parts.path.lastIndexOf('/');
        var res = this._parts.path.substring(pos+1);

        return v ? URI.decodePathSegment(res) : res;
      } else {
        var mutatedDirectory = false;

        if (v.charAt(0) === '/') {
          v = v.substring(1);
        }

        if (v.match(/\.?\//)) {
          mutatedDirectory = true;
        }

        var replace = new RegExp(escapeRegEx(this.filename()) + '$');
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);

        if (mutatedDirectory) {
          this.normalizePath(build);
        } else {
          this.build(!build);
        }

        return this;
      }
    };
    p.suffix = function(v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }

      if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
          return '';
        }

        var filename = this.filename();
        var pos = filename.lastIndexOf('.');
        var s, res;

        if (pos === -1) {
          return '';
        }

        // suffix may only contain alnum characters (yup, I made this up.)
        s = filename.substring(pos+1);
        res = (/^[a-z0-9%]+$/i).test(s) ? s : '';
        return v ? URI.decodePathSegment(res) : res;
      } else {
        if (v.charAt(0) === '.') {
          v = v.substring(1);
        }

        var suffix = this.suffix();
        var replace;

        if (!suffix) {
          if (!v) {
            return this;
          }

          this._parts.path += '.' + URI.recodePath(v);
        } else if (!v) {
          replace = new RegExp(escapeRegEx('.' + suffix) + '$');
        } else {
          replace = new RegExp(escapeRegEx(suffix) + '$');
        }

        if (replace) {
          v = URI.recodePath(v);
          this._parts.path = this._parts.path.replace(replace, v);
        }

        this.build(!build);
        return this;
      }
    };
    p.segment = function(segment, v, build) {
      var separator = this._parts.urn ? ':' : '/';
      var path = this.path();
      var absolute = path.substring(0, 1) === '/';
      var segments = path.split(separator);

      if (segment !== undefined && typeof segment !== 'number') {
        build = v;
        v = segment;
        segment = undefined;
      }

      if (segment !== undefined && typeof segment !== 'number') {
        throw new Error('Bad segment "' + segment + '", must be 0-based integer');
      }

      if (absolute) {
        segments.shift();
      }

      if (segment < 0) {
        // allow negative indexes to address from the end
        segment = Math.max(segments.length + segment, 0);
      }

      if (v === undefined) {
        /*jshint laxbreak: true */
        return segment === undefined
          ? segments
          : segments[segment];
        /*jshint laxbreak: false */
      } else if (segment === null || segments[segment] === undefined) {
        if (isArray(v)) {
          segments = [];
          // collapse empty elements within array
          for (var i=0, l=v.length; i < l; i++) {
            if (!v[i].length && (!segments.length || !segments[segments.length -1].length)) {
              continue;
            }

            if (segments.length && !segments[segments.length -1].length) {
              segments.pop();
            }

            segments.push(trimSlashes(v[i]));
          }
        } else if (v || typeof v === 'string') {
          v = trimSlashes(v);
          if (segments[segments.length -1] === '') {
            // empty trailing elements have to be overwritten
            // to prevent results such as /foo//bar
            segments[segments.length -1] = v;
          } else {
            segments.push(v);
          }
        }
      } else {
        if (v) {
          segments[segment] = trimSlashes(v);
        } else {
          segments.splice(segment, 1);
        }
      }

      if (absolute) {
        segments.unshift('');
      }

      return this.path(segments.join(separator), build);
    };
    p.segmentCoded = function(segment, v, build) {
      var segments, i, l;

      if (typeof segment !== 'number') {
        build = v;
        v = segment;
        segment = undefined;
      }

      if (v === undefined) {
        segments = this.segment(segment, v, build);
        if (!isArray(segments)) {
          segments = segments !== undefined ? URI.decode(segments) : undefined;
        } else {
          for (i = 0, l = segments.length; i < l; i++) {
            segments[i] = URI.decode(segments[i]);
          }
        }

        return segments;
      }

      if (!isArray(v)) {
        v = (typeof v === 'string' || v instanceof String) ? URI.encode(v) : v;
      } else {
        for (i = 0, l = v.length; i < l; i++) {
          v[i] = URI.encode(v[i]);
        }
      }

      return this.segment(segment, v, build);
    };

    // mutating query string
    var q = p.query;
    p.query = function(v, build) {
      if (v === true) {
        return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      } else if (typeof v === 'function') {
        var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        var result = v.call(this, data);
        this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        this.build(!build);
        return this;
      } else if (v !== undefined && typeof v !== 'string') {
        this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        this.build(!build);
        return this;
      } else {
        return q.call(this, v, build);
      }
    };
    p.setQuery = function(name, value, build) {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

      if (typeof name === 'string' || name instanceof String) {
        data[name] = value !== undefined ? value : null;
      } else if (typeof name === 'object') {
        for (var key in name) {
          if (hasOwn.call(name, key)) {
            data[key] = name[key];
          }
        }
      } else {
        throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
      }

      this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      if (typeof name !== 'string') {
        build = value;
      }

      this.build(!build);
      return this;
    };
    p.addQuery = function(name, value, build) {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      URI.addQuery(data, name, value === undefined ? null : value);
      this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      if (typeof name !== 'string') {
        build = value;
      }

      this.build(!build);
      return this;
    };
    p.removeQuery = function(name, value, build) {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      URI.removeQuery(data, name, value);
      this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      if (typeof name !== 'string') {
        build = value;
      }

      this.build(!build);
      return this;
    };
    p.hasQuery = function(name, value, withinArray) {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      return URI.hasQuery(data, name, value, withinArray);
    };
    p.setSearch = p.setQuery;
    p.addSearch = p.addQuery;
    p.removeSearch = p.removeQuery;
    p.hasSearch = p.hasQuery;

    // sanitizing URLs
    p.normalize = function() {
      if (this._parts.urn) {
        return this
          .normalizeProtocol(false)
          .normalizePath(false)
          .normalizeQuery(false)
          .normalizeFragment(false)
          .build();
      }

      return this
        .normalizeProtocol(false)
        .normalizeHostname(false)
        .normalizePort(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
    };
    p.normalizeProtocol = function(build) {
      if (typeof this._parts.protocol === 'string') {
        this._parts.protocol = this._parts.protocol.toLowerCase();
        this.build(!build);
      }

      return this;
    };
    p.normalizeHostname = function(build) {
      if (this._parts.hostname) {
        if (this.is('IDN') && punycode$$1) {
          this._parts.hostname = punycode$$1.toASCII(this._parts.hostname);
        } else if (this.is('IPv6') && IPv6$$1) {
          this._parts.hostname = IPv6$$1.best(this._parts.hostname);
        }

        this._parts.hostname = this._parts.hostname.toLowerCase();
        this.build(!build);
      }

      return this;
    };
    p.normalizePort = function(build) {
      // remove port of it's the protocol's default
      if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
        this._parts.port = null;
        this.build(!build);
      }

      return this;
    };
    p.normalizePath = function(build) {
      var _path = this._parts.path;
      if (!_path) {
        return this;
      }

      if (this._parts.urn) {
        this._parts.path = URI.recodeUrnPath(this._parts.path);
        this.build(!build);
        return this;
      }

      if (this._parts.path === '/') {
        return this;
      }

      _path = URI.recodePath(_path);

      var _was_relative;
      var _leadingParents = '';
      var _parent, _pos;

      // handle relative paths
      if (_path.charAt(0) !== '/') {
        _was_relative = true;
        _path = '/' + _path;
      }

      // handle relative files (as opposed to directories)
      if (_path.slice(-3) === '/..' || _path.slice(-2) === '/.') {
        _path += '/';
      }

      // resolve simples
      _path = _path
        .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
        .replace(/\/{2,}/g, '/');

      // remember leading parents
      if (_was_relative) {
        _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';
        if (_leadingParents) {
          _leadingParents = _leadingParents[0];
        }
      }

      // resolve parents
      while (true) {
        _parent = _path.search(/\/\.\.(\/|$)/);
        if (_parent === -1) {
          // no more ../ to resolve
          break;
        } else if (_parent === 0) {
          // top level cannot be relative, skip it
          _path = _path.substring(3);
          continue;
        }

        _pos = _path.substring(0, _parent).lastIndexOf('/');
        if (_pos === -1) {
          _pos = _parent;
        }
        _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
      }

      // revert to relative
      if (_was_relative && this.is('relative')) {
        _path = _leadingParents + _path.substring(1);
      }

      this._parts.path = _path;
      this.build(!build);
      return this;
    };
    p.normalizePathname = p.normalizePath;
    p.normalizeQuery = function(build) {
      if (typeof this._parts.query === 'string') {
        if (!this._parts.query.length) {
          this._parts.query = null;
        } else {
          this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
        }

        this.build(!build);
      }

      return this;
    };
    p.normalizeFragment = function(build) {
      if (!this._parts.fragment) {
        this._parts.fragment = null;
        this.build(!build);
      }

      return this;
    };
    p.normalizeSearch = p.normalizeQuery;
    p.normalizeHash = p.normalizeFragment;

    p.iso8859 = function() {
      // expect unicode input, iso8859 output
      var e = URI.encode;
      var d = URI.decode;

      URI.encode = escape;
      URI.decode = decodeURIComponent;
      try {
        this.normalize();
      } finally {
        URI.encode = e;
        URI.decode = d;
      }
      return this;
    };

    p.unicode = function() {
      // expect iso8859 input, unicode output
      var e = URI.encode;
      var d = URI.decode;

      URI.encode = strictEncodeURIComponent;
      URI.decode = unescape;
      try {
        this.normalize();
      } finally {
        URI.encode = e;
        URI.decode = d;
      }
      return this;
    };

    p.readable = function() {
      var uri = this.clone();
      // removing username, password, because they shouldn't be displayed according to RFC 3986
      uri.username('').password('').normalize();
      var t = '';
      if (uri._parts.protocol) {
        t += uri._parts.protocol + '://';
      }

      if (uri._parts.hostname) {
        if (uri.is('punycode') && punycode$$1) {
          t += punycode$$1.toUnicode(uri._parts.hostname);
          if (uri._parts.port) {
            t += ':' + uri._parts.port;
          }
        } else {
          t += uri.host();
        }
      }

      if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
        t += '/';
      }

      t += uri.path(true);
      if (uri._parts.query) {
        var q = '';
        for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
          var kv = (qp[i] || '').split('=');
          q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace)
            .replace(/&/g, '%26');

          if (kv[1] !== undefined) {
            q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace)
              .replace(/&/g, '%26');
          }
        }
        t += '?' + q.substring(1);
      }

      t += URI.decodeQuery(uri.hash(), true);
      return t;
    };

    // resolving relative and absolute URLs
    p.absoluteTo = function(base) {
      var resolved = this.clone();
      var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
      var basedir, i, p;

      if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierarchical components');
      }

      if (!(base instanceof URI)) {
        base = new URI(base);
      }

      if (resolved._parts.protocol) {
        // Directly returns even if this._parts.hostname is empty.
        return resolved;
      } else {
        resolved._parts.protocol = base._parts.protocol;
      }

      if (this._parts.hostname) {
        return resolved;
      }

      for (i = 0; (p = properties[i]); i++) {
        resolved._parts[p] = base._parts[p];
      }

      if (!resolved._parts.path) {
        resolved._parts.path = base._parts.path;
        if (!resolved._parts.query) {
          resolved._parts.query = base._parts.query;
        }
      } else {
        if (resolved._parts.path.substring(-2) === '..') {
          resolved._parts.path += '/';
        }

        if (resolved.path().charAt(0) !== '/') {
          basedir = base.directory();
          basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
          resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
          resolved.normalizePath();
        }
      }

      resolved.build();
      return resolved;
    };
    p.relativeTo = function(base) {
      var relative = this.clone().normalize();
      var relativeParts, baseParts, common, relativePath, basePath;

      if (relative._parts.urn) {
        throw new Error('URNs do not have any generally defined hierarchical components');
      }

      base = new URI(base).normalize();
      relativeParts = relative._parts;
      baseParts = base._parts;
      relativePath = relative.path();
      basePath = base.path();

      if (relativePath.charAt(0) !== '/') {
        throw new Error('URI is already relative');
      }

      if (basePath.charAt(0) !== '/') {
        throw new Error('Cannot calculate a URI relative to another relative URI');
      }

      if (relativeParts.protocol === baseParts.protocol) {
        relativeParts.protocol = null;
      }

      if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
        return relative.build();
      }

      if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
        return relative.build();
      }

      if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
        relativeParts.hostname = null;
        relativeParts.port = null;
      } else {
        return relative.build();
      }

      if (relativePath === basePath) {
        relativeParts.path = '';
        return relative.build();
      }

      // determine common sub path
      common = URI.commonPath(relativePath, basePath);

      // If the paths have nothing in common, return a relative URL with the absolute path.
      if (!common) {
        return relative.build();
      }

      var parents = baseParts.path
        .substring(common.length)
        .replace(/[^\/]*$/, '')
        .replace(/.*?\//g, '../');

      relativeParts.path = (parents + relativeParts.path.substring(common.length)) || './';

      return relative.build();
    };

    // comparing URIs
    p.equals = function(uri) {
      var one = this.clone();
      var two = new URI(uri);
      var one_map = {};
      var two_map = {};
      var checked = {};
      var one_query, two_query, key;

      one.normalize();
      two.normalize();

      // exact match
      if (one.toString() === two.toString()) {
        return true;
      }

      // extract query string
      one_query = one.query();
      two_query = two.query();
      one.query('');
      two.query('');

      // definitely not equal if not even non-query parts match
      if (one.toString() !== two.toString()) {
        return false;
      }

      // query parameters have the same length, even if they're permuted
      if (one_query.length !== two_query.length) {
        return false;
      }

      one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
      two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

      for (key in one_map) {
        if (hasOwn.call(one_map, key)) {
          if (!isArray(one_map[key])) {
            if (one_map[key] !== two_map[key]) {
              return false;
            }
          } else if (!arraysEqual(one_map[key], two_map[key])) {
            return false;
          }

          checked[key] = true;
        }
      }

      for (key in two_map) {
        if (hasOwn.call(two_map, key)) {
          if (!checked[key]) {
            // two contains a parameter not present in one
            return false;
          }
        }
      }

      return true;
    };

    // state
    p.preventInvalidHostname = function(v) {
      this._parts.preventInvalidHostname = !!v;
      return this;
    };

    p.duplicateQueryParameters = function(v) {
      this._parts.duplicateQueryParameters = !!v;
      return this;
    };

    p.escapeQuerySpace = function(v) {
      this._parts.escapeQuerySpace = !!v;
      return this;
    };

    return URI;
  }));
  });

  const {
    hash
  } = config;
  let data = null;

  const getLocalData = type => {
    if (data) return data[type];

    try {
      const str = localStorage.getItem('blhxfy:data');
      if (!str) return false;
      data = JSON.parse(str);

      if (data.hash !== hash) {
        data = null;
        localStorage.removeItem('blhxfy:data');
        return false;
      }

      return data[type];
    } catch (err) {
      console.error(err);
    }

    return false;
  };

  const setLocalData = (type, value) => {
    if (!data) data = {
      hash
    };
    data[type] = value;
    const str = JSON.stringify(data);

    try {
      localStorage.setItem('blhxfy:data', str);
    } catch (err) {
      console.error(err);
    }
  };

  var papaparse = createCommonjsModule(function (module, exports) {
  /*@license
  	Papa Parse
  	v4.6.0
  	https://github.com/mholt/PapaParse
  	License: MIT
  */
  (function(root, factory)
  {
  	/* globals define */
  	{
  		// Node. Does not work with strict CommonJS, but
  		// only CommonJS-like environments that support module.exports,
  		// like Node.
  		module.exports = factory();
  	}
  }(commonjsGlobal, function()
  {

  	var global = (function() {
  		// alternative method, similar to `Function('return this')()`
  		// but without using `eval` (which is disabled when
  		// using Content Security Policy).

  		if (typeof self !== 'undefined') { return self; }
  		if (typeof window !== 'undefined') { return window; }
  		if (typeof global !== 'undefined') { return global; }

  		// When running tests none of the above have been defined
  		return {};
  	})();


  	var IS_WORKER = !global.document && !!global.postMessage,
  		IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
  		LOADED_SYNC = false, AUTO_SCRIPT_PATH;
  	var workers = {}, workerIdCounter = 0;

  	var Papa = {};

  	Papa.parse = CsvToJson;
  	Papa.unparse = JsonToCsv;

  	Papa.RECORD_SEP = String.fromCharCode(30);
  	Papa.UNIT_SEP = String.fromCharCode(31);
  	Papa.BYTE_ORDER_MARK = '\ufeff';
  	Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
  	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
  	Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously
  	Papa.NODE_STREAM_INPUT = 1;

  	// Configurable chunk sizes for local and remote files, respectively
  	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
  	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
  	Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

  	// Exposed for testing and development only
  	Papa.Parser = Parser;
  	Papa.ParserHandle = ParserHandle;
  	Papa.NetworkStreamer = NetworkStreamer;
  	Papa.FileStreamer = FileStreamer;
  	Papa.StringStreamer = StringStreamer;
  	Papa.ReadableStreamStreamer = ReadableStreamStreamer;
  	Papa.DuplexStreamStreamer = DuplexStreamStreamer;

  	if (global.jQuery)
  	{
  		var $ = global.jQuery;
  		$.fn.parse = function(options)
  		{
  			var config = options.config || {};
  			var queue = [];

  			this.each(function(idx)
  			{
  				var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
  								&& $(this).attr('type').toLowerCase() === 'file'
  								&& global.FileReader;

  				if (!supported || !this.files || this.files.length === 0)
  					return true;	// continue to next input element

  				for (var i = 0; i < this.files.length; i++)
  				{
  					queue.push({
  						file: this.files[i],
  						inputElem: this,
  						instanceConfig: $.extend({}, config)
  					});
  				}
  			});

  			parseNextFile();	// begin parsing
  			return this;		// maintains chainability


  			function parseNextFile()
  			{
  				if (queue.length === 0)
  				{
  					if (isFunction(options.complete))
  						options.complete();
  					return;
  				}

  				var f = queue[0];

  				if (isFunction(options.before))
  				{
  					var returned = options.before(f.file, f.inputElem);

  					if (typeof returned === 'object')
  					{
  						if (returned.action === 'abort')
  						{
  							error('AbortError', f.file, f.inputElem, returned.reason);
  							return;	// Aborts all queued files immediately
  						}
  						else if (returned.action === 'skip')
  						{
  							fileComplete();	// parse the next file in the queue, if any
  							return;
  						}
  						else if (typeof returned.config === 'object')
  							f.instanceConfig = $.extend(f.instanceConfig, returned.config);
  					}
  					else if (returned === 'skip')
  					{
  						fileComplete();	// parse the next file in the queue, if any
  						return;
  					}
  				}

  				// Wrap up the user's complete callback, if any, so that ours also gets executed
  				var userCompleteFunc = f.instanceConfig.complete;
  				f.instanceConfig.complete = function(results)
  				{
  					if (isFunction(userCompleteFunc))
  						userCompleteFunc(results, f.file, f.inputElem);
  					fileComplete();
  				};

  				Papa.parse(f.file, f.instanceConfig);
  			}

  			function error(name, file, elem, reason)
  			{
  				if (isFunction(options.error))
  					options.error({name: name}, file, elem, reason);
  			}

  			function fileComplete()
  			{
  				queue.splice(0, 1);
  				parseNextFile();
  			}
  		};
  	}


  	if (IS_PAPA_WORKER)
  	{
  		global.onmessage = workerThreadReceivedMessage;
  	}
  	else if (Papa.WORKERS_SUPPORTED)
  	{
  		AUTO_SCRIPT_PATH = getScriptPath();

  		// Check if the script was loaded synchronously
  		if (!document.body)
  		{
  			// Body doesn't exist yet, must be synchronous
  			LOADED_SYNC = true;
  		}
  		else
  		{
  			document.addEventListener('DOMContentLoaded', function() {
  				LOADED_SYNC = true;
  			}, true);
  		}
  	}




  	function CsvToJson(_input, _config)
  	{
  		_config = _config || {};
  		var dynamicTyping = _config.dynamicTyping || false;
  		if (isFunction(dynamicTyping)) {
  			_config.dynamicTypingFunction = dynamicTyping;
  			// Will be filled on first row call
  			dynamicTyping = {};
  		}
  		_config.dynamicTyping = dynamicTyping;

  		_config.transform = isFunction(_config.transform) ? _config.transform : false;

  		if (_config.worker && Papa.WORKERS_SUPPORTED)
  		{
  			var w = newWorker();

  			w.userStep = _config.step;
  			w.userChunk = _config.chunk;
  			w.userComplete = _config.complete;
  			w.userError = _config.error;

  			_config.step = isFunction(_config.step);
  			_config.chunk = isFunction(_config.chunk);
  			_config.complete = isFunction(_config.complete);
  			_config.error = isFunction(_config.error);
  			delete _config.worker;	// prevent infinite loop

  			w.postMessage({
  				input: _input,
  				config: _config,
  				workerId: w.id
  			});

  			return;
  		}

  		var streamer = null;
  		if (_input === Papa.NODE_STREAM_INPUT)
  		{
  			// create a node Duplex stream for use
  			// with .pipe
  			streamer = new DuplexStreamStreamer(_config);
  			return streamer.getStream();
  		}
  		else if (typeof _input === 'string')
  		{
  			if (_config.download)
  				streamer = new NetworkStreamer(_config);
  			else
  				streamer = new StringStreamer(_config);
  		}
  		else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on))
  		{
  			streamer = new ReadableStreamStreamer(_config);
  		}
  		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
  			streamer = new FileStreamer(_config);

  		return streamer.stream(_input);
  	}






  	function JsonToCsv(_input, _config)
  	{
  		// Default configuration

  		/** whether to surround every datum with quotes */
  		var _quotes = false;

  		/** whether to write headers */
  		var _writeHeader = true;

  		/** delimiting character(s) */
  		var _delimiter = ',';

  		/** newline character(s) */
  		var _newline = '\r\n';

  		/** quote character */
  		var _quoteChar = '"';

  		unpackConfig();

  		var quoteCharRegex = new RegExp(_quoteChar, 'g');

  		if (typeof _input === 'string')
  			_input = JSON.parse(_input);

  		if (_input instanceof Array)
  		{
  			if (!_input.length || _input[0] instanceof Array)
  				return serialize(null, _input);
  			else if (typeof _input[0] === 'object')
  				return serialize(objectKeys(_input[0]), _input);
  		}
  		else if (typeof _input === 'object')
  		{
  			if (typeof _input.data === 'string')
  				_input.data = JSON.parse(_input.data);

  			if (_input.data instanceof Array)
  			{
  				if (!_input.fields)
  					_input.fields =  _input.meta && _input.meta.fields;

  				if (!_input.fields)
  					_input.fields =  _input.data[0] instanceof Array
  						? _input.fields
  						: objectKeys(_input.data[0]);

  				if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
  					_input.data = [_input.data];	// handles input like [1,2,3] or ['asdf']
  			}

  			return serialize(_input.fields || [], _input.data || []);
  		}

  		// Default (any valid paths should return before this)
  		throw 'exception: Unable to serialize unrecognized input';


  		function unpackConfig()
  		{
  			if (typeof _config !== 'object')
  				return;

  			if (typeof _config.delimiter === 'string'
                  && !Papa.BAD_DELIMITERS.filter(function(value) { return _config.delimiter.indexOf(value) !== -1; }).length)
  			{
  				_delimiter = _config.delimiter;
  			}

  			if (typeof _config.quotes === 'boolean'
  				|| _config.quotes instanceof Array)
  				_quotes = _config.quotes;

  			if (typeof _config.newline === 'string')
  				_newline = _config.newline;

  			if (typeof _config.quoteChar === 'string')
  				_quoteChar = _config.quoteChar;

  			if (typeof _config.header === 'boolean')
  				_writeHeader = _config.header;
  		}


  		/** Turns an object's keys into an array */
  		function objectKeys(obj)
  		{
  			if (typeof obj !== 'object')
  				return [];
  			var keys = [];
  			for (var key in obj)
  				keys.push(key);
  			return keys;
  		}

  		/** The double for loop that iterates the data and writes out a CSV string including header row */
  		function serialize(fields, data)
  		{
  			var csv = '';

  			if (typeof fields === 'string')
  				fields = JSON.parse(fields);
  			if (typeof data === 'string')
  				data = JSON.parse(data);

  			var hasHeader = fields instanceof Array && fields.length > 0;
  			var dataKeyedByField = !(data[0] instanceof Array);

  			// If there a header row, write it first
  			if (hasHeader && _writeHeader)
  			{
  				for (var i = 0; i < fields.length; i++)
  				{
  					if (i > 0)
  						csv += _delimiter;
  					csv += safe(fields[i], i);
  				}
  				if (data.length > 0)
  					csv += _newline;
  			}

  			// Then write out the data
  			for (var row = 0; row < data.length; row++)
  			{
  				var maxCol = hasHeader ? fields.length : data[row].length;

  				for (var col = 0; col < maxCol; col++)
  				{
  					if (col > 0)
  						csv += _delimiter;
  					var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
  					csv += safe(data[row][colIdx], col);
  				}

  				if (row < data.length - 1)
  					csv += _newline;
  			}

  			return csv;
  		}

  		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
  		function safe(str, col)
  		{
  			if (typeof str === 'undefined' || str === null)
  				return '';

  			if (str.constructor === Date)
  				return JSON.stringify(str).slice(1, 25);

  			str = str.toString().replace(quoteCharRegex, _quoteChar + _quoteChar);

  			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
  							|| (_quotes instanceof Array && _quotes[col])
  							|| hasAny(str, Papa.BAD_DELIMITERS)
  							|| str.indexOf(_delimiter) > -1
  							|| str.charAt(0) === ' '
  							|| str.charAt(str.length - 1) === ' ';

  			return needsQuotes ? _quoteChar + str + _quoteChar : str;
  		}

  		function hasAny(str, substrings)
  		{
  			for (var i = 0; i < substrings.length; i++)
  				if (str.indexOf(substrings[i]) > -1)
  					return true;
  			return false;
  		}
  	}

  	/** ChunkStreamer is the base prototype for various streamer implementations. */
  	function ChunkStreamer(config)
  	{
  		this._handle = null;
  		this._finished = false;
  		this._completed = false;
  		this._input = null;
  		this._baseIndex = 0;
  		this._partialLine = '';
  		this._rowCount = 0;
  		this._start = 0;
  		this._nextChunk = null;
  		this.isFirstChunk = true;
  		this._completeResults = {
  			data: [],
  			errors: [],
  			meta: {}
  		};
  		replaceConfig.call(this, config);

  		this.parseChunk = function(chunk, isFakeChunk)
  		{
  			// First chunk pre-processing
  			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
  			{
  				var modifiedChunk = this._config.beforeFirstChunk(chunk);
  				if (modifiedChunk !== undefined)
  					chunk = modifiedChunk;
  			}
  			this.isFirstChunk = false;

  			// Rejoin the line we likely just split in two by chunking the file
  			var aggregate = this._partialLine + chunk;
  			this._partialLine = '';

  			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

  			if (this._handle.paused() || this._handle.aborted())
  				return;

  			var lastIndex = results.meta.cursor;

  			if (!this._finished)
  			{
  				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
  				this._baseIndex = lastIndex;
  			}

  			if (results && results.data)
  				this._rowCount += results.data.length;

  			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

  			if (IS_PAPA_WORKER)
  			{
  				global.postMessage({
  					results: results,
  					workerId: Papa.WORKER_ID,
  					finished: finishedIncludingPreview
  				});
  			}
  			else if (isFunction(this._config.chunk) && !isFakeChunk)
  			{
  				this._config.chunk(results, this._handle);
  				if (this._handle.paused() || this._handle.aborted())
  					return;
  				results = undefined;
  				this._completeResults = undefined;
  			}

  			if (!this._config.step && !this._config.chunk) {
  				this._completeResults.data = this._completeResults.data.concat(results.data);
  				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
  				this._completeResults.meta = results.meta;
  			}

  			if (!this._completed && finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted)) {
  				this._config.complete(this._completeResults, this._input);
  				this._completed = true;
  			}

  			if (!finishedIncludingPreview && (!results || !results.meta.paused))
  				this._nextChunk();

  			return results;
  		};

  		this._sendError = function(error)
  		{
  			if (isFunction(this._config.error))
  				this._config.error(error);
  			else if (IS_PAPA_WORKER && this._config.error)
  			{
  				global.postMessage({
  					workerId: Papa.WORKER_ID,
  					error: error,
  					finished: false
  				});
  			}
  		};

  		function replaceConfig(config)
  		{
  			// Deep-copy the config so we can edit it
  			var configCopy = copy(config);
  			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
  			if (!config.step && !config.chunk)
  				configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
  			this._handle = new ParserHandle(configCopy);
  			this._handle.streamer = this;
  			this._config = configCopy;	// persist the copy to the caller
  		}
  	}


  	function NetworkStreamer(config)
  	{
  		config = config || {};
  		if (!config.chunkSize)
  			config.chunkSize = Papa.RemoteChunkSize;
  		ChunkStreamer.call(this, config);

  		var xhr;

  		if (IS_WORKER)
  		{
  			this._nextChunk = function()
  			{
  				this._readChunk();
  				this._chunkLoaded();
  			};
  		}
  		else
  		{
  			this._nextChunk = function()
  			{
  				this._readChunk();
  			};
  		}

  		this.stream = function(url)
  		{
  			this._input = url;
  			this._nextChunk();	// Starts streaming
  		};

  		this._readChunk = function()
  		{
  			if (this._finished)
  			{
  				this._chunkLoaded();
  				return;
  			}

  			xhr = new XMLHttpRequest();

  			if (this._config.withCredentials)
  			{
  				xhr.withCredentials = this._config.withCredentials;
  			}

  			if (!IS_WORKER)
  			{
  				xhr.onload = bindFunction(this._chunkLoaded, this);
  				xhr.onerror = bindFunction(this._chunkError, this);
  			}

  			xhr.open('GET', this._input, !IS_WORKER);
  			// Headers can only be set when once the request state is OPENED
  			if (this._config.downloadRequestHeaders)
  			{
  				var headers = this._config.downloadRequestHeaders;

  				for (var headerName in headers)
  				{
  					xhr.setRequestHeader(headerName, headers[headerName]);
  				}
  			}

  			if (this._config.chunkSize)
  			{
  				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
  				xhr.setRequestHeader('Range', 'bytes=' + this._start + '-' + end);
  				xhr.setRequestHeader('If-None-Match', 'webkit-no-cache'); // https://bugs.webkit.org/show_bug.cgi?id=82672
  			}

  			try {
  				xhr.send();
  			}
  			catch (err) {
  				this._chunkError(err.message);
  			}

  			if (IS_WORKER && xhr.status === 0)
  				this._chunkError();
  			else
  				this._start += this._config.chunkSize;
  		};

  		this._chunkLoaded = function()
  		{
  			if (xhr.readyState !== 4)
  				return;

  			if (xhr.status < 200 || xhr.status >= 400)
  			{
  				this._chunkError();
  				return;
  			}

  			this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
  			this.parseChunk(xhr.responseText);
  		};

  		this._chunkError = function(errorMessage)
  		{
  			var errorText = xhr.statusText || errorMessage;
  			this._sendError(new Error(errorText));
  		};

  		function getFileSize(xhr)
  		{
  			var contentRange = xhr.getResponseHeader('Content-Range');
  			if (contentRange === null) { // no content range, then finish!
  				return -1;
  			}
  			return parseInt(contentRange.substr(contentRange.lastIndexOf('/') + 1));
  		}
  	}
  	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
  	NetworkStreamer.prototype.constructor = NetworkStreamer;


  	function FileStreamer(config)
  	{
  		config = config || {};
  		if (!config.chunkSize)
  			config.chunkSize = Papa.LocalChunkSize;
  		ChunkStreamer.call(this, config);

  		var reader, slice;

  		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
  		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
  		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

  		this.stream = function(file)
  		{
  			this._input = file;
  			slice = file.slice || file.webkitSlice || file.mozSlice;

  			if (usingAsyncReader)
  			{
  				reader = new FileReader();		// Preferred method of reading files, even in workers
  				reader.onload = bindFunction(this._chunkLoaded, this);
  				reader.onerror = bindFunction(this._chunkError, this);
  			}
  			else
  				reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

  			this._nextChunk();	// Starts streaming
  		};

  		this._nextChunk = function()
  		{
  			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
  				this._readChunk();
  		};

  		this._readChunk = function()
  		{
  			var input = this._input;
  			if (this._config.chunkSize)
  			{
  				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
  				input = slice.call(input, this._start, end);
  			}
  			var txt = reader.readAsText(input, this._config.encoding);
  			if (!usingAsyncReader)
  				this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
  		};

  		this._chunkLoaded = function(event)
  		{
  			// Very important to increment start each time before handling results
  			this._start += this._config.chunkSize;
  			this._finished = !this._config.chunkSize || this._start >= this._input.size;
  			this.parseChunk(event.target.result);
  		};

  		this._chunkError = function()
  		{
  			this._sendError(reader.error);
  		};

  	}
  	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
  	FileStreamer.prototype.constructor = FileStreamer;


  	function StringStreamer(config)
  	{
  		config = config || {};
  		ChunkStreamer.call(this, config);

  		var remaining;
  		this.stream = function(s)
  		{
  			remaining = s;
  			return this._nextChunk();
  		};
  		this._nextChunk = function()
  		{
  			if (this._finished) return;
  			var size = this._config.chunkSize;
  			var chunk = size ? remaining.substr(0, size) : remaining;
  			remaining = size ? remaining.substr(size) : '';
  			this._finished = !remaining;
  			return this.parseChunk(chunk);
  		};
  	}
  	StringStreamer.prototype = Object.create(StringStreamer.prototype);
  	StringStreamer.prototype.constructor = StringStreamer;


  	function ReadableStreamStreamer(config)
  	{
  		config = config || {};

  		ChunkStreamer.call(this, config);

  		var queue = [];
  		var parseOnData = true;
  		var streamHasEnded = false;

  		this.pause = function()
  		{
  			ChunkStreamer.prototype.pause.apply(this, arguments);
  			this._input.pause();
  		};

  		this.resume = function()
  		{
  			ChunkStreamer.prototype.resume.apply(this, arguments);
  			this._input.resume();
  		};

  		this.stream = function(stream$$1)
  		{
  			this._input = stream$$1;

  			this._input.on('data', this._streamData);
  			this._input.on('end', this._streamEnd);
  			this._input.on('error', this._streamError);
  		};

  		this._checkIsFinished = function()
  		{
  			if (streamHasEnded && queue.length === 1) {
  				this._finished = true;
  			}
  		};

  		this._nextChunk = function()
  		{
  			this._checkIsFinished();
  			if (queue.length)
  			{
  				this.parseChunk(queue.shift());
  			}
  			else
  			{
  				parseOnData = true;
  			}
  		};

  		this._streamData = bindFunction(function(chunk)
  		{
  			try
  			{
  				queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));

  				if (parseOnData)
  				{
  					parseOnData = false;
  					this._checkIsFinished();
  					this.parseChunk(queue.shift());
  				}
  			}
  			catch (error)
  			{
  				this._streamError(error);
  			}
  		}, this);

  		this._streamError = bindFunction(function(error)
  		{
  			this._streamCleanUp();
  			this._sendError(error);
  		}, this);

  		this._streamEnd = bindFunction(function()
  		{
  			this._streamCleanUp();
  			streamHasEnded = true;
  			this._streamData('');
  		}, this);

  		this._streamCleanUp = bindFunction(function()
  		{
  			this._input.removeListener('data', this._streamData);
  			this._input.removeListener('end', this._streamEnd);
  			this._input.removeListener('error', this._streamError);
  		}, this);
  	}
  	ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
  	ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;


  	function DuplexStreamStreamer(_config) {
  		var Duplex = stream.Duplex;
  		var config = copy(_config);
  		var parseOnWrite = true;
  		var writeStreamHasFinished = false;
  		var parseCallbackQueue = [];
  		var stream$$1 = null;

  		this._onCsvData = function(results)
  		{
  			var data = results.data;
  			for (var i = 0; i < data.length; i++) {
  				if (!stream$$1.push(data[i]) && !this._handle.paused()) {
  					// the writeable consumer buffer has filled up
  					// so we need to pause until more items
  					// can be processed
  					this._handle.pause();
  				}
  			}
  		};

  		this._onCsvComplete = function()
  		{
  			// node will finish the read stream when
  			// null is pushed
  			stream$$1.push(null);
  		};

  		config.step = bindFunction(this._onCsvData, this);
  		config.complete = bindFunction(this._onCsvComplete, this);
  		ChunkStreamer.call(this, config);

  		this._nextChunk = function()
  		{
  			if (writeStreamHasFinished && parseCallbackQueue.length === 1) {
  				this._finished = true;
  			}
  			if (parseCallbackQueue.length) {
  				parseCallbackQueue.shift()();
  			} else {
  				parseOnWrite = true;
  			}
  		};

  		this._addToParseQueue = function(chunk, callback)
  		{
  			// add to queue so that we can indicate
  			// completion via callback
  			// node will automatically pause the incoming stream
  			// when too many items have been added without their
  			// callback being invoked
  			parseCallbackQueue.push(bindFunction(function() {
  				this.parseChunk(typeof chunk === 'string' ? chunk : chunk.toString(config.encoding));
  				if (isFunction(callback)) {
  					return callback();
  				}
  			}, this));
  			if (parseOnWrite) {
  				parseOnWrite = false;
  				this._nextChunk();
  			}
  		};

  		this._onRead = function()
  		{
  			if (this._handle.paused()) {
  				// the writeable consumer can handle more data
  				// so resume the chunk parsing
  				this._handle.resume();
  			}
  		};

  		this._onWrite = function(chunk, encoding, callback)
  		{
  			this._addToParseQueue(chunk, callback);
  		};

  		this._onWriteComplete = function()
  		{
  			writeStreamHasFinished = true;
  			// have to write empty string
  			// so parser knows its done
  			this._addToParseQueue('');
  		};

  		this.getStream = function()
  		{
  			return stream$$1;
  		};
  		stream$$1 = new Duplex({
  			readableObjectMode: true,
  			decodeStrings: false,
  			read: bindFunction(this._onRead, this),
  			write: bindFunction(this._onWrite, this)
  		});
  		stream$$1.once('finish', bindFunction(this._onWriteComplete, this));
  	}
  	DuplexStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
  	DuplexStreamStreamer.prototype.constructor = DuplexStreamStreamer;


  	// Use one ParserHandle per entire CSV file or string
  	function ParserHandle(_config)
  	{
  		// One goal is to minimize the use of regular expressions...
  		var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;
  		var ISO_DATE = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

  		var self = this;
  		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
  		var _rowCounter = 0;	// Number of rows that have been parsed so far
  		var _input;				// The input being parsed
  		var _parser;			// The core parser being used
  		var _paused = false;	// Whether we are paused or not
  		var _aborted = false;	// Whether the parser has aborted or not
  		var _delimiterError;	// Temporary state between delimiter detection and processing results
  		var _fields = [];		// Fields are from the header row of the input, if there is one
  		var _results = {		// The last results returned from the parser
  			data: [],
  			errors: [],
  			meta: {}
  		};

  		if (isFunction(_config.step))
  		{
  			var userStep = _config.step;
  			_config.step = function(results)
  			{
  				_results = results;

  				if (needsHeaderRow())
  					processResults();
  				else	// only call user's step function after header row
  				{
  					processResults();

  					// It's possbile that this line was empty and there's no row here after all
  					if (_results.data.length === 0)
  						return;

  					_stepCounter += results.data.length;
  					if (_config.preview && _stepCounter > _config.preview)
  						_parser.abort();
  					else
  						userStep(_results, self);
  				}
  			};
  		}

  		/**
  		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
  		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
  		 * when an input comes in multiple chunks, like from a file.
  		 */
  		this.parse = function(input, baseIndex, ignoreLastRow)
  		{
  			var quoteChar = _config.quoteChar || '"';
  			if (!_config.newline)
  				_config.newline = guessLineEndings(input, quoteChar);

  			_delimiterError = false;
  			if (!_config.delimiter)
  			{
  				var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines, _config.comments);
  				if (delimGuess.successful)
  					_config.delimiter = delimGuess.bestDelimiter;
  				else
  				{
  					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
  					_config.delimiter = Papa.DefaultDelimiter;
  				}
  				_results.meta.delimiter = _config.delimiter;
  			}
  			else if(isFunction(_config.delimiter))
  			{
  				_config.delimiter = _config.delimiter(input);
  				_results.meta.delimiter = _config.delimiter;
  			}

  			var parserConfig = copy(_config);
  			if (_config.preview && _config.header)
  				parserConfig.preview++;	// to compensate for header row

  			_input = input;
  			_parser = new Parser(parserConfig);
  			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
  			processResults();
  			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
  		};

  		this.paused = function()
  		{
  			return _paused;
  		};

  		this.pause = function()
  		{
  			_paused = true;
  			_parser.abort();
  			_input = _input.substr(_parser.getCharIndex());
  		};

  		this.resume = function()
  		{
  			_paused = false;
  			self.streamer.parseChunk(_input, true);
  		};

  		this.aborted = function()
  		{
  			return _aborted;
  		};

  		this.abort = function()
  		{
  			_aborted = true;
  			_parser.abort();
  			_results.meta.aborted = true;
  			if (isFunction(_config.complete))
  				_config.complete(_results);
  			_input = '';
  		};

  		function testEmptyLine(s) {
  			return _config.skipEmptyLines === 'greedy' ? s.join('').trim() === '' : s.length === 1 && s[0].length === 0;
  		}

  		function processResults()
  		{
  			if (_results && _delimiterError)
  			{
  				addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \'' + Papa.DefaultDelimiter + '\'');
  				_delimiterError = false;
  			}

  			if (_config.skipEmptyLines)
  			{
  				for (var i = 0; i < _results.data.length; i++)
  					if (testEmptyLine(_results.data[i]))
  						_results.data.splice(i--, 1);
  			}

  			if (needsHeaderRow())
  				fillHeaderFields();

  			return applyHeaderAndDynamicTypingAndTransformation();
  		}

  		function needsHeaderRow()
  		{
  			return _config.header && _fields.length === 0;
  		}

  		function fillHeaderFields()
  		{
  			if (!_results)
  				return;
  			for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
  				for (var j = 0; j < _results.data[i].length; j++)
  				{
  					var header = _results.data[i][j];

  					if (_config.trimHeaders) {
  						header = header.trim();
  					}

  					_fields.push(header);
  				}
  			_results.data.splice(0, 1);
  		}

  		function shouldApplyDynamicTyping(field) {
  			// Cache function values to avoid calling it for each row
  			if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === undefined) {
  				_config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
  			}
  			return (_config.dynamicTyping[field] || _config.dynamicTyping) === true;
  		}

  		function parseDynamic(field, value)
  		{
  			if (shouldApplyDynamicTyping(field))
  			{
  				if (value === 'true' || value === 'TRUE')
  					return true;
  				else if (value === 'false' || value === 'FALSE')
  					return false;
  				else if (FLOAT.test(value))
  					return parseFloat(value);
  				else if (ISO_DATE.test(value))
  					return new Date(value);
  				else
  					return (value === '' ? null : value);
  			}
  			return value;
  		}

  		function applyHeaderAndDynamicTypingAndTransformation()
  		{
  			if (!_results || (!_config.header && !_config.dynamicTyping && !_config.transform))
  				return _results;

  			for (var i = 0; i < _results.data.length; i++)
  			{
  				var row = _config.header ? {} : [];

  				var j;
  				for (j = 0; j < _results.data[i].length; j++)
  				{
  					var field = j;
  					var value = _results.data[i][j];

  					if (_config.header)
  						field = j >= _fields.length ? '__parsed_extra' : _fields[j];

  					if (_config.transform)
  						value = _config.transform(value,field);

  					value = parseDynamic(field, value);

  					if (field === '__parsed_extra')
  					{
  						row[field] = row[field] || [];
  						row[field].push(value);
  					}
  					else
  						row[field] = value;
  				}

  				_results.data[i] = row;

  				if (_config.header)
  				{
  					if (j > _fields.length)
  						addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, _rowCounter + i);
  					else if (j < _fields.length)
  						addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, _rowCounter + i);
  				}
  			}

  			if (_config.header && _results.meta)
  				_results.meta.fields = _fields;

  			_rowCounter += _results.data.length;
  			return _results;
  		}

  		function guessDelimiter(input, newline, skipEmptyLines, comments)
  		{
  			var delimChoices = [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];
  			var bestDelim, bestDelta, fieldCountPrevRow;

  			for (var i = 0; i < delimChoices.length; i++)
  			{
  				var delim = delimChoices[i];
  				var delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
  				fieldCountPrevRow = undefined;

  				var preview = new Parser({
  					comments: comments,
  					delimiter: delim,
  					newline: newline,
  					preview: 10
  				}).parse(input);

  				for (var j = 0; j < preview.data.length; j++)
  				{
  					if (skipEmptyLines && testEmptyLine(preview.data[j]))
  					{
  						emptyLinesCount++;
  						continue;
  					}
  					var fieldCount = preview.data[j].length;
  					avgFieldCount += fieldCount;

  					if (typeof fieldCountPrevRow === 'undefined')
  					{
  						fieldCountPrevRow = fieldCount;
  						continue;
  					}
  					else if (fieldCount > 1)
  					{
  						delta += Math.abs(fieldCount - fieldCountPrevRow);
  						fieldCountPrevRow = fieldCount;
  					}
  				}

  				if (preview.data.length > 0)
  					avgFieldCount /= (preview.data.length - emptyLinesCount);

  				if ((typeof bestDelta === 'undefined' || delta < bestDelta)
  					&& avgFieldCount > 1.99)
  				{
  					bestDelta = delta;
  					bestDelim = delim;
  				}
  			}

  			_config.delimiter = bestDelim;

  			return {
  				successful: !!bestDelim,
  				bestDelimiter: bestDelim
  			};
  		}

  		function guessLineEndings(input, quoteChar)
  		{
  			input = input.substr(0, 1024 * 1024);	// max length 1 MB
  			// Replace all the text inside quotes
  			var re = new RegExp(escapeRegExp(quoteChar) + '([^]*?)' + escapeRegExp(quoteChar), 'gm');
  			input = input.replace(re, '');

  			var r = input.split('\r');

  			var n = input.split('\n');

  			var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

  			if (r.length === 1 || nAppearsFirst)
  				return '\n';

  			var numWithN = 0;
  			for (var i = 0; i < r.length; i++)
  			{
  				if (r[i][0] === '\n')
  					numWithN++;
  			}

  			return numWithN >= r.length / 2 ? '\r\n' : '\r';
  		}

  		function addError(type, code, msg, row)
  		{
  			_results.errors.push({
  				type: type,
  				code: code,
  				message: msg,
  				row: row
  			});
  		}
  	}

  	/** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions */
  	function escapeRegExp(string)
  	{
  		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  	}

  	/** The core parser implements speedy and correct CSV parsing */
  	function Parser(config)
  	{
  		// Unpack the config object
  		config = config || {};
  		var delim = config.delimiter;
  		var newline = config.newline;
  		var comments = config.comments;
  		var step = config.step;
  		var preview = config.preview;
  		var fastMode = config.fastMode;
  		var quoteChar;
  		/** Allows for no quoteChar by setting quoteChar to undefined in config */
  		if (config.quoteChar === undefined) {
  			quoteChar = '"';
  		} else {
  			quoteChar = config.quoteChar;
  		}
  		var escapeChar = quoteChar;
  		if (config.escapeChar !== undefined) {
  			escapeChar = config.escapeChar;
  		}

  		// Delimiter must be valid
  		if (typeof delim !== 'string'
  			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
  			delim = ',';

  		// Comment character must be valid
  		if (comments === delim)
  			throw 'Comment character same as delimiter';
  		else if (comments === true)
  			comments = '#';
  		else if (typeof comments !== 'string'
  			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
  			comments = false;

  		// Newline must be valid: \r, \n, or \r\n
  		if (newline !== '\n' && newline !== '\r' && newline !== '\r\n')
  			newline = '\n';

  		// We're gonna need these at the Parser scope
  		var cursor = 0;
  		var aborted = false;

  		this.parse = function(input, baseIndex, ignoreLastRow)
  		{
  			// For some reason, in Chrome, this speeds things up (!?)
  			if (typeof input !== 'string')
  				throw 'Input must be a string';

  			// We don't need to compute some of these every time parse() is called,
  			// but having them in a more local scope seems to perform better
  			var inputLen = input.length,
  				delimLen = delim.length,
  				newlineLen = newline.length,
  				commentsLen = comments.length;
  			var stepIsFunction = isFunction(step);

  			// Establish starting state
  			cursor = 0;
  			var data = [], errors = [], row = [], lastCursor = 0;

  			if (!input)
  				return returnable();

  			if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
  			{
  				var rows = input.split(newline);
  				for (var i = 0; i < rows.length; i++)
  				{
  					row = rows[i];
  					cursor += row.length;
  					if (i !== rows.length - 1)
  						cursor += newline.length;
  					else if (ignoreLastRow)
  						return returnable();
  					if (comments && row.substr(0, commentsLen) === comments)
  						continue;
  					if (stepIsFunction)
  					{
  						data = [];
  						pushRow(row.split(delim));
  						doStep();
  						if (aborted)
  							return returnable();
  					}
  					else
  						pushRow(row.split(delim));
  					if (preview && i >= preview)
  					{
  						data = data.slice(0, preview);
  						return returnable(true);
  					}
  				}
  				return returnable();
  			}

  			var nextDelim = input.indexOf(delim, cursor);
  			var nextNewline = input.indexOf(newline, cursor);
  			var quoteCharRegex = new RegExp(escapeChar.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&') + quoteChar, 'g');
  			var quoteSearch;

  			// Parser loop
  			for (;;)
  			{
  				// Field has opening quote
  				if (input[cursor] === quoteChar)
  				{
  					// Start our search for the closing quote where the cursor is
  					quoteSearch = cursor;

  					// Skip the opening quote
  					cursor++;

  					for (;;)
  					{
  						// Find closing quote
  						quoteSearch = input.indexOf(quoteChar, quoteSearch + 1);

  						//No other quotes are found - no other delimiters
  						if (quoteSearch === -1)
  						{
  							if (!ignoreLastRow) {
  								// No closing quote... what a pity
  								errors.push({
  									type: 'Quotes',
  									code: 'MissingQuotes',
  									message: 'Quoted field unterminated',
  									row: data.length,	// row has yet to be inserted
  									index: cursor
  								});
  							}
  							return finish();
  						}

  						// Closing quote at EOF
  						if (quoteSearch === inputLen - 1)
  						{
  							var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
  							return finish(value);
  						}

  						// If this quote is escaped, it's part of the data; skip it
  						// If the quote character is the escape character, then check if the next character is the escape character
  						if (quoteChar === escapeChar &&  input[quoteSearch + 1] === escapeChar)
  						{
  							quoteSearch++;
  							continue;
  						}

  						// If the quote character is not the escape character, then check if the previous character was the escape character
  						if (quoteChar !== escapeChar && quoteSearch !== 0 && input[quoteSearch - 1] === escapeChar)
  						{
  							continue;
  						}

  						// Check up to nextDelim or nextNewline, whichever is closest
  						var checkUpTo = nextNewline === -1 ? nextDelim : Math.min(nextDelim, nextNewline);
  						var spacesBetweenQuoteAndDelimiter = extraSpaces(checkUpTo);

  						// Closing quote followed by delimiter or 'unnecessary spaces + delimiter'
  						if (input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter] === delim)
  						{
  							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
  							cursor = quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen;
  							nextDelim = input.indexOf(delim, cursor);
  							nextNewline = input.indexOf(newline, cursor);
  							break;
  						}

  						var spacesBetweenQuoteAndNewLine = extraSpaces(nextNewline);

  						// Closing quote followed by newline or 'unnecessary spaces + newLine'
  						if (input.substr(quoteSearch + 1 + spacesBetweenQuoteAndNewLine, newlineLen) === newline)
  						{
  							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
  							saveRow(quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen);
  							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

  							if (stepIsFunction)
  							{
  								doStep();
  								if (aborted)
  									return returnable();
  							}

  							if (preview && data.length >= preview)
  								return returnable(true);

  							break;
  						}


  						// Checks for valid closing quotes are complete (escaped quotes or quote followed by EOF/delimiter/newline) -- assume these quotes are part of an invalid text string
  						errors.push({
  							type: 'Quotes',
  							code: 'InvalidQuotes',
  							message: 'Trailing quote on quoted field is malformed',
  							row: data.length,	// row has yet to be inserted
  							index: cursor
  						});

  						quoteSearch++;
  						continue;

  					}

  					continue;
  				}

  				// Comment found at start of new line
  				if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
  				{
  					if (nextNewline === -1)	// Comment ends at EOF
  						return returnable();
  					cursor = nextNewline + newlineLen;
  					nextNewline = input.indexOf(newline, cursor);
  					nextDelim = input.indexOf(delim, cursor);
  					continue;
  				}

  				// Next delimiter comes before next newline, so we've reached end of field
  				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
  				{
  					row.push(input.substring(cursor, nextDelim));
  					cursor = nextDelim + delimLen;
  					nextDelim = input.indexOf(delim, cursor);
  					continue;
  				}

  				// End of row
  				if (nextNewline !== -1)
  				{
  					row.push(input.substring(cursor, nextNewline));
  					saveRow(nextNewline + newlineLen);

  					if (stepIsFunction)
  					{
  						doStep();
  						if (aborted)
  							return returnable();
  					}

  					if (preview && data.length >= preview)
  						return returnable(true);

  					continue;
  				}

  				break;
  			}


  			return finish();


  			function pushRow(row)
  			{
  				data.push(row);
  				lastCursor = cursor;
  			}

  			/**
               * checks if there are extra spaces after closing quote and given index without any text
               * if Yes, returns the number of spaces
               */
  			function extraSpaces(index) {
  				var spaceLength = 0;
  				if (index !== -1) {
  					var textBetweenClosingQuoteAndIndex = input.substring(quoteSearch + 1, index);
  					if (textBetweenClosingQuoteAndIndex && textBetweenClosingQuoteAndIndex.trim() === '') {
  						spaceLength = textBetweenClosingQuoteAndIndex.length;
  					}
  				}
  				return spaceLength;
  			}

  			/**
  			 * Appends the remaining input from cursor to the end into
  			 * row, saves the row, calls step, and returns the results.
  			 */
  			function finish(value)
  			{
  				if (ignoreLastRow)
  					return returnable();
  				if (typeof value === 'undefined')
  					value = input.substr(cursor);
  				row.push(value);
  				cursor = inputLen;	// important in case parsing is paused
  				pushRow(row);
  				if (stepIsFunction)
  					doStep();
  				return returnable();
  			}

  			/**
  			 * Appends the current row to the results. It sets the cursor
  			 * to newCursor and finds the nextNewline. The caller should
  			 * take care to execute user's step function and check for
  			 * preview and end parsing if necessary.
  			 */
  			function saveRow(newCursor)
  			{
  				cursor = newCursor;
  				pushRow(row);
  				row = [];
  				nextNewline = input.indexOf(newline, cursor);
  			}

  			/** Returns an object with the results, errors, and meta. */
  			function returnable(stopped)
  			{
  				return {
  					data: data,
  					errors: errors,
  					meta: {
  						delimiter: delim,
  						linebreak: newline,
  						aborted: aborted,
  						truncated: !!stopped,
  						cursor: lastCursor + (baseIndex || 0)
  					}
  				};
  			}

  			/** Executes the user's step function and resets data & errors. */
  			function doStep()
  			{
  				step(returnable());
  				data = [];
  				errors = [];
  			}
  		};

  		/** Sets the abort flag */
  		this.abort = function()
  		{
  			aborted = true;
  		};

  		/** Gets the cursor position */
  		this.getCharIndex = function()
  		{
  			return cursor;
  		};
  	}


  	// If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
  	// the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
  	function getScriptPath()
  	{
  		var scripts = document.getElementsByTagName('script');
  		return scripts.length ? scripts[scripts.length - 1].src : '';
  	}

  	function newWorker()
  	{
  		if (!Papa.WORKERS_SUPPORTED)
  			return false;
  		if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
  			throw new Error(
  				'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
  				'You need to set Papa.SCRIPT_PATH manually.'
  			);
  		var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
  		// Append 'papaworker' to the search string to tell papaparse that this is our worker.
  		workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
  		var w = new global.Worker(workerUrl);
  		w.onmessage = mainThreadReceivedMessage;
  		w.id = workerIdCounter++;
  		workers[w.id] = w;
  		return w;
  	}

  	/** Callback when main thread receives a message */
  	function mainThreadReceivedMessage(e)
  	{
  		var msg = e.data;
  		var worker = workers[msg.workerId];
  		var aborted = false;

  		if (msg.error)
  			worker.userError(msg.error, msg.file);
  		else if (msg.results && msg.results.data)
  		{
  			var abort = function() {
  				aborted = true;
  				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
  			};

  			var handle = {
  				abort: abort,
  				pause: notImplemented,
  				resume: notImplemented
  			};

  			if (isFunction(worker.userStep))
  			{
  				for (var i = 0; i < msg.results.data.length; i++)
  				{
  					worker.userStep({
  						data: [msg.results.data[i]],
  						errors: msg.results.errors,
  						meta: msg.results.meta
  					}, handle);
  					if (aborted)
  						break;
  				}
  				delete msg.results;	// free memory ASAP
  			}
  			else if (isFunction(worker.userChunk))
  			{
  				worker.userChunk(msg.results, handle, msg.file);
  				delete msg.results;
  			}
  		}

  		if (msg.finished && !aborted)
  			completeWorker(msg.workerId, msg.results);
  	}

  	function completeWorker(workerId, results) {
  		var worker = workers[workerId];
  		if (isFunction(worker.userComplete))
  			worker.userComplete(results);
  		worker.terminate();
  		delete workers[workerId];
  	}

  	function notImplemented() {
  		throw 'Not implemented.';
  	}

  	/** Callback when worker thread receives a message */
  	function workerThreadReceivedMessage(e)
  	{
  		var msg = e.data;

  		if (typeof Papa.WORKER_ID === 'undefined' && msg)
  			Papa.WORKER_ID = msg.workerId;

  		if (typeof msg.input === 'string')
  		{
  			global.postMessage({
  				workerId: Papa.WORKER_ID,
  				results: Papa.parse(msg.input, msg.config),
  				finished: true
  			});
  		}
  		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
  		{
  			var results = Papa.parse(msg.input, msg.config);
  			if (results)
  				global.postMessage({
  					workerId: Papa.WORKER_ID,
  					results: results,
  					finished: true
  				});
  		}
  	}

  	/** Makes a deep copy of an array or object (mostly) */
  	function copy(obj)
  	{
  		if (typeof obj !== 'object' || obj === null)
  			return obj;
  		var cpy = obj instanceof Array ? [] : {};
  		for (var key in obj)
  			cpy[key] = copy(obj[key]);
  		return cpy;
  	}

  	function bindFunction(f, self)
  	{
  		return function() { f.apply(self, arguments); };
  	}

  	function isFunction(func)
  	{
  		return typeof func === 'function';
  	}

  	return Papa;
  }));
  });

  const parseCsv = str => {
    try {
      return papaparse.parse(str.replace(/^\ufeff/, ''), {
        header: true
      }).data;
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  const sortKeywords = (list, key = 'name') => {
    return list.sort((prev, next) => {
      if (next[key] === prev[key]) {
        return 0;
      } else if (next[key].includes(prev[key])) {
        return 1;
      } else {
        return -1;
      }
    });
  };

  const enNameMap = new Map();
  const jpNameMap = new Map();
  const loaded = false;

  const getNameData = async () => {
    if (!loaded) {
      let nameEn = getLocalData('nameEn');
      let nameJp = getLocalData('nameJp');

      if (!nameEn) {
        nameEn = await fetchWithHash('/blhxfy/data/npc-name-en.csv');
        setLocalData('nameEn', nameEn);
      }

      if (!nameEn) {
        nameJp = await fetchWithHash('/blhxfy/data/npc-name-jp.csv');
        setLocalData('nameJp', nameJp);
      }

      const listEn = parseCsv(nameEn);
      const listJp = parseCsv(nameJp);
      sortKeywords(listEn).forEach(item => {
        enNameMap.set(item.name, item);
      });
      sortKeywords(listJp).forEach(item => {
        jpNameMap.set(item.name, item);
      });
      loaded = true;
    }

    return {
      enNameMap,
      jpNameMap
    };
  };

  const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt'];

  const getScenario = async name => {
    const scenarioData = await fetch('/blhxfy/data/scenario.json');
    const pathname = scenarioData[name];
    const data = await fetch(`/blhxfy/data/scenario/${pathname}`);
    const list = parseCsv(data);
    const transMap = new Map();
    list.forEach(item => {
      if (item.id) {
        const idArr = item.id.split('-');
        const id = idArr[0];
        const type = idArr[1] || 'detail';
        const obj = transMap.get(id) || {};
        transMap.set(id, obj);
      }
    });
    return transMap;
  };

  const getNameTrans = (name, map, scenarioName) => {
    const item = map.get(name);

    if (item) {
      let existScenario = '';

      if (item.scenarios.length) {
        for (let sName of item.scenarios) {
          if (scenarioName.indexOf(sName) !== -1) {
            existScenario = sName;
            break;
          }
        }
      }

      const result = {
        trans: item.trans,
        noun: item.noun
      };

      if (existScenario) {
        result.trans = item[existScenario].trans;
        result.noun = item[existScenario].noun;
      }

      return result.trans;
    }

    return null;
  };

  const replaceChar = (key, item, map, scenarioName) => {
    const name = item[key] ? item[key].trim() : null;

    if (name && name !== 'null' && name !== '???' && name !== '？？？') {
      let trans = getNameTrans(name, map, scenarioName);
      let _name = name;

      if (/\s?[\?？0-9０－９]{1,2}$/.test(name)) {
        // name with number or symbol
        const nameRst = name.match(/(.+?)\s?([\?？0-9０－９]{1,2})$/);

        const _trans = getNameTrans(nameRst[1], map, scenarioName);

        _name = nameRst[1];
        if (_trans) trans = `${_trans}${nameRst[2]}`;
      } else if (/'s\sVoice$/.test(name)) {
        let nmKey = name.slice(0, name.length - 8);

        const _trans = getNameTrans(nmKey, map, scenarioName);

        if (_trans) trans = `${_trans}的声音`;
      } else if (/の声$/.test(name)) {
        let nmKey = name.slice(0, name.length - 2);

        const _trans = getNameTrans(nmKey, map, scenarioName);

        if (_trans) trans = `${_trans}的声音`;
      }

      if (trans) {
        item[key] = trans;
      } else if (trans !== '') {
        return _name;
      }
    }
  };

  const transStart = async (data, pathname) => {
    const pathRst = pathname.match(/\/scenario.*?\/(scene[^\/]+)\/?/);
    if (!pathRst || !pathRst[1]) return data;
    const scenarioName = pathRst[1];
    const nameData = await getNameData();
    const nameMap = Game.lang !== 'jp' ? nameData['enNameMap'] : nameData['jpNameMap'];
    const transMap = await getScenario(scenarioName);
    data.forEach((item, index) => {
      let name1, name2, name3;
      name1 = replaceChar('charcter1_name', item, nameMap, scenarioName);
      name2 = replaceChar('charcter2_name', item, nameMap, scenarioName);
      name3 = replaceChar('charcter3_name', item, nameMap, scenarioName);
      const obj = transMap.get(item.id);
      if (!obj) return;
      txtKeys.forEach(key => {
        if (obj[key]) {
          item[key] = obj[key];
        }
      });
    });
    return data;
  };

  async function transScenario (data, pathname) {
    if (Array.isArray(data)) {
      return await transStart(data, pathname);
    } else if (Array.isArray(data.scene_list)) {
      return Object.assign(data, {
        scene_list: await transStart(data.scene_list, pathname)
      });
    } else {
      return data;
    }
  }

  const apiHosts = ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'];
  async function translate(state) {
    const uri = URI(state.url);
    const pathname = uri.pathname();
    const hostname = uri.hostname();
    let data = state.result;
    let isJSON = true;

    try {
      data = JSON.parse(data);
    } catch (err) {
      isJSON = false;
    }

    console.log(pathname, hostname);
    if (apiHosts.indexOf(hostname) === -1) return;

    if (pathname.includes('scenario')) {
      result = transScenario(data);
    }

    state.result = isJSON ? JSON.stringify(result) : result;
  }

  // intercept xhr request and modify the response

  const XHR = XMLHttpRequest;
  const originOpen = XHR.prototype.open;
  const originSend = XHR.prototype.send;
  const originAddEventListener = XHR.prototype.addEventListener;
  const stateMap = new WeakMap();

  function log(data) {
    console.error(data);
  }

  function getXhrState(xhr) {
    let result = stateMap.get(xhr);

    if (!result) {
      result = {};
      stateMap.set(xhr, result);
    }

    if (!result.readyStateListeners) {
      result.readyStateListeners = [];
    }

    if (!result.loadListeners) {
      result.loadListeners = [];
    }

    return result;
  }

  const customOnLoad = async function (evt) {
    let state;

    try {
      state = getXhrState(this);
      state.onLoadEvent = evt;
      Object.defineProperties(this, {
        response: {
          get() {
            return state.result;
          }

        },
        responseText: {
          get() {
            return state.result;
          }

        }
      });
      await translate(state);
      state.onload && state.onload.call(this, state.onLoadEvent);
    } catch (err) {
      log(err);
    }
  };

  const customOnReadyStateChange = async function () {
    let state;

    try {
      state = getXhrState(this);

      if (this.readyState == XHR.DONE) {
        state.onComplete.call(this, state);
      }
    } catch (err) {
      log(err);
    }

    try {
      for (let i = 0, l = state.readyStateListeners.length; i < l; i++) {
        try {
          state.readyStateListeners[i].apply(this, arguments);
        } catch (err) {
          log(err);
        }
      }
    } catch (err) {
      log(err);
    }
  };

  function customOnComplete(state) {
    if (state.done) return;
    state.done = performance.now();
    state.result = this.response || this.responseText;
    state.response = this.response;
    state.responseType = this.responseType;

    if (state.responseType === "" || state.responseType === "text") {
      state.responseText = this.responseText;
    }

    state.status = this.status;
    state.statusText = this.statusText;
    state.contentType = this.getResponseHeader('content-type');
  }

  XHR.prototype.open = function open(method, url, async, user, password) {
    try {
      const state = getXhrState(this);
      state.method = method;
      state.url = url;
    } catch (err) {
      log(err);
    }

    originAddEventListener.call(this, "readystatechange", customOnReadyStateChange, false);
    const result = originOpen.apply(this, arguments);
    return result;
  };

  XHR.prototype.addEventListener = function addEventListener(eventName, listener, useCapture) {
    try {
      const state = getXhrState(this);

      if (eventName === "readystatechange") {
        state.readyStateListeners.push(listener);
        return true;
      }
    } catch (err) {
      log(err);
    }

    const result = originAddEventListener.apply(this, arguments);
    return result;
  };

  XHR.prototype.send = function send(data) {
    let state = null;

    try {
      state = getXhrState(this);

      if (state.url) {
        state.sent = performance.now();
        state.data = data;
        state.onComplete = customOnComplete;
        state.onload = this.onload;
        this.onload = customOnLoad;
      }
    } catch (err) {
      log(err);
    }

    originSend.call(this, data);
  };

  XHR.prototype.open.toString = function toString() {
    return originOpen.toString();
  };

  XHR.prototype.addEventListener.toString = function toString() {
    return originAddEventListener.toString();
  };

  XHR.prototype.send.toString = function toString() {
    return originSend.toString();
  };

})));
