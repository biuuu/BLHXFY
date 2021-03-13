// ==UserScript==
// @name         碧蓝幻想翻译兼容版
// @namespace    https://github.com/biuuu/BLHXFY
// @version      2.3.6
// @description  碧蓝幻想的汉化脚本，提交新翻译请到 https://github.com/biuuu/BLHXFY
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @author       biuuu
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @connect      translate.google.cn
// @connect      api.interpreter.caiyunai.com
// @connect      fanyi.baidu.com
// @updateURL    https://blhx.danmu9.com/blhxfy/extension.es5.user.js
// @supportURL   https://github.com/biuuu/BLHXFY/issues
// ==/UserScript==
(function () {
  'use strict';

  const __win_blhxfy = window.unsafeWindow || window;
      if (__win_blhxfy.BLHXFY) return;
      __win_blhxfy.BLHXFY = true;
      const DEV = false;
      const LOCAL_HOST = false;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var punycode = createCommonjsModule(function (module, exports) {
  (function(root) {

  	/** Detect free variables */
  	var freeExports =  exports &&
  		!exports.nodeType && exports;
  	var freeModule =  module &&
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
   * Version: 1.19.6
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
    if ( module.exports) {
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
   * Version: 1.19.6
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
    if ( module.exports) {
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
   * Version: 1.19.6
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
    if ( module.exports) {
      // Node
      module.exports = factory(punycode, IPv6, SecondLevelDomains);
    } else {
      // Browser globals (root is window)
      root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
    }
  }(commonjsGlobal, function (punycode, IPv6, SLD, root) {
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

    URI.version = '1.19.6';

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
          } else if (string.substring(pos + 1, pos + 3).replace(/\\/g, '/') === '//') {
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
      var _string = string;
      var firstBackSlash = string.indexOf('\\');
      if (firstBackSlash !== -1) {
        string = string.replace(/\\/g, '/');
      }
      var firstSlash = string.indexOf('/');
      var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
      var t;

      // authority@ must come before /path or \path
      if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
        t = string.substring(0, pos).split(':');
        parts.username = t[0] ? URI.decode(t[0]) : null;
        t.shift();
        parts.password = t[0] ? URI.decode(t.join(':')) : null;
        string = _string.substring(pos + 1);
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
      var requireAbsolutePath = false;

      if (parts.protocol) {
        t += parts.protocol + ':';
      }

      if (!parts.urn && (t || parts.hostname)) {
        t += '//';
        requireAbsolutePath = true;
      }

      t += (URI.buildAuthority(parts) || '');

      if (typeof parts.path === 'string') {
        if (parts.path.charAt(0) !== '/' && requireAbsolutePath) {
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
        if (hasOwn.call(data, key)) {
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
        if (!punycode) {
          throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-:_] and Punycode.js is not available');
        }
        if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
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
      var punycode = false;
      var relative = !this._parts.urn;

      if (this._parts.hostname) {
        relative = false;
        ip4 = URI.ip4_expression.test(this._parts.hostname);
        ip6 = URI.ip6_expression.test(this._parts.hostname);
        ip = ip4 || ip6;
        name = !ip;
        sld = name && SLD && SLD.has(this._parts.hostname);
        idn = name && URI.idn_expression.test(this._parts.hostname);
        punycode = name && URI.punycode_expression.test(this._parts.hostname);
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
          return punycode;
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
        if (this.is('IDN') && punycode) {
          this._parts.hostname = punycode.toASCII(this._parts.hostname);
        } else if (this.is('IPv6') && IPv6) {
          this._parts.hostname = IPv6.best(this._parts.hostname);
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
        if (uri.is('punycode') && punycode) {
          t += punycode.toUnicode(uri._parts.hostname);
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

  /*! @license DOMPurify | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.0.8/LICENSE */

  function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var hasOwnProperty = Object.hasOwnProperty,
      setPrototypeOf = Object.setPrototypeOf,
      isFrozen = Object.isFrozen,
      objectKeys = Object.keys;
  var freeze = Object.freeze,
      seal = Object.seal,
      create = Object.create; // eslint-disable-line import/no-mutable-exports

  var _ref = typeof Reflect !== 'undefined' && Reflect,
      apply = _ref.apply,
      construct = _ref.construct;

  if (!apply) {
    apply = function apply(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }

  if (!freeze) {
    freeze = function freeze(x) {
      return x;
    };
  }

  if (!seal) {
    seal = function seal(x) {
      return x;
    };
  }

  if (!construct) {
    construct = function construct(Func, args) {
      return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray$1(args))))();
    };
  }

  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayIndexOf = unapply(Array.prototype.indexOf);
  var arrayJoin = unapply(Array.prototype.join);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var arraySlice = unapply(Array.prototype.slice);

  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);

  var regExpTest = unapply(RegExp.prototype.test);
  var regExpCreate = unconstruct(RegExp);

  var typeErrorCreate = unconstruct(TypeError);

  function unapply(func) {
    return function (thisArg) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return apply(func, thisArg, args);
    };
  }

  function unconstruct(func) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return construct(func, args);
    };
  }

  /* Add properties to a lookup table */
  function addToSet(set, array) {
    if (setPrototypeOf) {
      // Make 'in' and truthy checks like Boolean(set.constructor)
      // independent of any properties defined on Object.prototype.
      // Prevent prototype setters from intercepting set as a this value.
      setPrototypeOf(set, null);
    }

    var l = array.length;
    while (l--) {
      var element = array[l];
      if (typeof element === 'string') {
        var lcElement = stringToLowerCase(element);
        if (lcElement !== element) {
          // Config presets (e.g. tags.js, attrs.js) are immutable.
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }

          element = lcElement;
        }
      }

      set[element] = true;
    }

    return set;
  }

  /* Shallow clone an object */
  function clone(object) {
    var newObject = create(null);

    var property = void 0;
    for (property in object) {
      if (apply(hasOwnProperty, object, [property])) {
        newObject[property] = object[property];
      }
    }

    return newObject;
  }

  var html = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);

  // SVG
  var svg = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'audio', 'canvas', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'video', 'view', 'vkern']);

  var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);

  var mathMl = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']);

  var text = freeze(['#text']);

  var html$1 = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns']);

  var svg$1 = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);

  var mathMl$1 = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);

  var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

  // eslint-disable-next-line unicorn/better-regex
  var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
  var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
  );

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _toConsumableArray$1$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var getGlobal = function getGlobal() {
    return typeof window === 'undefined' ? null : window;
  };

  /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {Document} document The document object (to determine policy name suffix)
   * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported).
   */
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
    if ((typeof trustedTypes === 'undefined' ? 'undefined' : _typeof(trustedTypes)) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
      return null;
    }

    // Allow the callers to control the unique policy name
    // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
    // Policy creation with duplicate names throws in Trusted Types.
    var suffix = null;
    var ATTR_NAME = 'data-tt-policy-suffix';
    if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
      suffix = document.currentScript.getAttribute(ATTR_NAME);
    }

    var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML: function createHTML(html$$1) {
          return html$$1;
        }
      });
    } catch (_) {
      // Policy creation failed (most likely another DOMPurify script has
      // already run). Skip creating the policy, as this will only cause errors
      // if TT are enforced.
      console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
      return null;
    }
  };

  function createDOMPurify() {
    var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

    var DOMPurify = function DOMPurify(root) {
      return createDOMPurify(root);
    };

    /**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */
    DOMPurify.version = '2.0.17';

    /**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */
    DOMPurify.removed = [];

    if (!window || !window.document || window.document.nodeType !== 9) {
      // Not running in a browser, provide a factory function
      // so that you can pass your own Window
      DOMPurify.isSupported = false;

      return DOMPurify;
    }

    var originalDocument = window.document;
    var removeTitle = false;

    var document = window.document;
    var DocumentFragment = window.DocumentFragment,
        HTMLTemplateElement = window.HTMLTemplateElement,
        Node = window.Node,
        NodeFilter = window.NodeFilter,
        _window$NamedNodeMap = window.NamedNodeMap,
        NamedNodeMap = _window$NamedNodeMap === undefined ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
        Text = window.Text,
        Comment = window.Comment,
        DOMParser = window.DOMParser,
        trustedTypes = window.trustedTypes;

    // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.

    if (typeof HTMLTemplateElement === 'function') {
      var template = document.createElement('template');
      if (template.content && template.content.ownerDocument) {
        document = template.content.ownerDocument;
      }
    }

    var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
    var emptyHTML = trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML('') : '';

    var _document = document,
        implementation = _document.implementation,
        createNodeIterator = _document.createNodeIterator,
        getElementsByTagName = _document.getElementsByTagName,
        createDocumentFragment = _document.createDocumentFragment;
    var importNode = originalDocument.importNode;


    var documentMode = {};
    try {
      documentMode = clone(document).documentMode ? document.documentMode : {};
    } catch (_) {}

    var hooks = {};

    /**
     * Expose whether this browser supports running the full DOMPurify.
     */
    DOMPurify.isSupported = implementation && typeof implementation.createHTMLDocument !== 'undefined' && documentMode !== 9;

    var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR,
        ERB_EXPR$$1 = ERB_EXPR,
        DATA_ATTR$$1 = DATA_ATTR,
        ARIA_ATTR$$1 = ARIA_ATTR,
        IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA,
        ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
    var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;

    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

    /* allowed element names */

    var ALLOWED_TAGS = null;
    var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1$1(html), _toConsumableArray$1$1(svg), _toConsumableArray$1$1(svgFilters), _toConsumableArray$1$1(mathMl), _toConsumableArray$1$1(text)));

    /* Allowed attribute names */
    var ALLOWED_ATTR = null;
    var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1$1(html$1), _toConsumableArray$1$1(svg$1), _toConsumableArray$1$1(mathMl$1), _toConsumableArray$1$1(xml)));

    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
    var FORBID_TAGS = null;

    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
    var FORBID_ATTR = null;

    /* Decide if ARIA attributes are okay */
    var ALLOW_ARIA_ATTR = true;

    /* Decide if custom data attributes are okay */
    var ALLOW_DATA_ATTR = true;

    /* Decide if unknown protocols are okay */
    var ALLOW_UNKNOWN_PROTOCOLS = false;

    /* Output should be safe for jQuery's $() factory? */
    var SAFE_FOR_JQUERY = false;

    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */
    var SAFE_FOR_TEMPLATES = false;

    /* Decide if document with <html>... should be returned */
    var WHOLE_DOCUMENT = false;

    /* Track whether config is already set on this instance of DOMPurify. */
    var SET_CONFIG = false;

    /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */
    var FORCE_BODY = false;

    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */
    var RETURN_DOM = false;

    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */
    var RETURN_DOM_FRAGMENT = false;

    /* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
     * `Node` is imported into the current `Document`. If this flag is not enabled the
     * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
     * DOMPurify. */
    var RETURN_DOM_IMPORT = false;

    /* Try to return a Trusted Type object instead of a string, return a string in
     * case Trusted Types are not supported  */
    var RETURN_TRUSTED_TYPE = false;

    /* Output should be free from DOM clobbering attacks? */
    var SANITIZE_DOM = true;

    /* Keep element content when removing element? */
    var KEEP_CONTENT = true;

    /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */
    var IN_PLACE = false;

    /* Allow usage of profiles like html, svg and mathMl */
    var USE_PROFILES = {};

    /* Tags to ignore content of when KEEP_CONTENT is true */
    var FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);

    /* Tags that are safe for data: URIs */
    var DATA_URI_TAGS = null;
    var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);

    /* Attributes safe for values like "javascript:" */
    var URI_SAFE_ATTRIBUTES = null;
    var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'summary', 'title', 'value', 'style', 'xmlns']);

    /* Keep a reference to config to pass to hooks */
    var CONFIG = null;

    /* Ideally, do not touch anything below this line */
    /* ______________________________________________ */

    var formElement = document.createElement('form');

    /**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */
    // eslint-disable-next-line complexity
    var _parseConfig = function _parseConfig(cfg) {
      if (CONFIG && CONFIG === cfg) {
        return;
      }

      /* Shield configuration object from tampering */
      if (!cfg || (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object') {
        cfg = {};
      }

      /* Shield configuration object from prototype pollution */
      cfg = clone(cfg);

      /* Set configuration parameters */
      ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
      URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS;
      FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
      FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
      USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
      SAFE_FOR_JQUERY = cfg.SAFE_FOR_JQUERY || false; // Default false
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
      RETURN_DOM = cfg.RETURN_DOM || false; // Default false
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
      RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT || false; // Default false
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
      FORCE_BODY = cfg.FORCE_BODY || false; // Default false
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
      IN_PLACE = cfg.IN_PLACE || false; // Default false
      IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }

      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }

      /* Parse profile info */
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1$1(text)));
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html);
          addToSet(ALLOWED_ATTR, html$1);
        }

        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl);
          addToSet(ALLOWED_ATTR, mathMl$1);
          addToSet(ALLOWED_ATTR, xml);
        }
      }

      /* Merge configuration parameters */
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }

        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
      }

      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }

        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
      }

      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
      }

      /* Add #text in case KEEP_CONTENT is set to true */
      if (KEEP_CONTENT) {
        ALLOWED_TAGS['#text'] = true;
      }

      /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
      }

      /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ['tbody']);
        delete FORBID_TAGS.tbody;
      }

      // Prevent further manipulation of configuration.
      // Not available in IE8, Safari 5, etc.
      if (freeze) {
        freeze(cfg);
      }

      CONFIG = cfg;
    };

    /**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */
    var _forceRemove = function _forceRemove(node) {
      arrayPush(DOMPurify.removed, { element: node });
      try {
        node.parentNode.removeChild(node);
      } catch (_) {
        node.outerHTML = emptyHTML;
      }
    };

    /**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */
    var _removeAttribute = function _removeAttribute(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }

      node.removeAttribute(name);
    };

    /**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */
    var _initDocument = function _initDocument(dirty) {
      /* Create a HTML document */
      var doc = void 0;
      var leadingWhitespace = void 0;

      if (FORCE_BODY) {
        dirty = '<remove></remove>' + dirty;
      } else {
        /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
        var matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }

      var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      /* Use the DOMParser API by default, fallback later if needs be */
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, 'text/html');
      } catch (_) {}

      /* Remove title to fix a mXSS bug in older MS Edge */
      if (removeTitle) {
        addToSet(FORBID_TAGS, ['title']);
      }

      /* Use createHTMLDocument in case DOMParser is not available */
      if (!doc || !doc.documentElement) {
        doc = implementation.createHTMLDocument('');
        var _doc = doc,
            body = _doc.body;

        body.parentNode.removeChild(body.parentNode.firstElementChild);
        body.outerHTML = dirtyPayload;
      }

      if (dirty && leadingWhitespace) {
        doc.body.insertBefore(document.createTextNode(leadingWhitespace), doc.body.childNodes[0] || null);
      }

      /* Work on whole document or just its body */
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    };

    /* Here we test for a broken feature in Edge that might cause mXSS */
    if (DOMPurify.isSupported) {
      (function () {
        try {
          var doc = _initDocument('<x/><title>&lt;/title&gt;&lt;img&gt;');
          if (regExpTest(/<\/title/, doc.querySelector('title').innerHTML)) {
            removeTitle = true;
          }
        } catch (_) {}
      })();
    }

    /**
     * _createIterator
     *
     * @param  {Document} root document/fragment to create iterator for
     * @return {Iterator} iterator instance
     */
    var _createIterator = function _createIterator(root) {
      return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, function () {
        return NodeFilter.FILTER_ACCEPT;
      }, false);
    };

    /**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */
    var _isClobbered = function _isClobbered(elm) {
      if (elm instanceof Text || elm instanceof Comment) {
        return false;
      }

      if (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string') {
        return true;
      }

      return false;
    };

    /**
     * _isNode
     *
     * @param  {Node} obj object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */
    var _isNode = function _isNode(object) {
      return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? object instanceof Node : object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
    };

    /**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */
    var _executeHook = function _executeHook(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }

      arrayForEach(hooks[entryPoint], function (hook) {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };

    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */
    // eslint-disable-next-line complexity
    var _sanitizeElements = function _sanitizeElements(currentNode) {
      var content = void 0;

      /* Execute a hook if present */
      _executeHook('beforeSanitizeElements', currentNode, null);

      /* Check if element is clobbered or can clobber */
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Check if tagname contains Unicode */
      if (stringMatch(currentNode.nodeName, /[\u0080-\uFFFF]/)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Now let's check the element's type and name */
      var tagName = stringToLowerCase(currentNode.nodeName);

      /* Execute a hook if present */
      _executeHook('uponSanitizeElement', currentNode, {
        tagName: tagName,
        allowedTags: ALLOWED_TAGS
      });

      /* Take care of an mXSS pattern using p, br inside svg, math */
      if ((tagName === 'svg' || tagName === 'math') && currentNode.querySelectorAll('p, br, form, table').length !== 0) {
        _forceRemove(currentNode);
        return true;
      }

      /* Remove element if anything forbids its presence */
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        /* Keep content except for bad-listed elements */
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && typeof currentNode.insertAdjacentHTML === 'function') {
          try {
            var htmlToInsert = currentNode.innerHTML;
            currentNode.insertAdjacentHTML('AfterEnd', trustedTypesPolicy ? trustedTypesPolicy.createHTML(htmlToInsert) : htmlToInsert);
          } catch (_) {}
        }

        _forceRemove(currentNode);
        return true;
      }

      /* Remove in case a noscript/noembed XSS is suspected */
      if (tagName === 'noscript' && regExpTest(/<\/noscript/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      if (tagName === 'noembed' && regExpTest(/<\/noembed/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Convert markup to cover jQuery behavior */
      if (SAFE_FOR_JQUERY && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/</g, currentNode.textContent)) {
        arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
        if (currentNode.innerHTML) {
          currentNode.innerHTML = stringReplace(currentNode.innerHTML, /</g, '&lt;');
        } else {
          currentNode.innerHTML = stringReplace(currentNode.textContent, /</g, '&lt;');
        }
      }

      /* Sanitize element content to be template-safe */
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        /* Get the element's text content */
        content = currentNode.textContent;
        content = stringReplace(content, MUSTACHE_EXPR$$1, ' ');
        content = stringReplace(content, ERB_EXPR$$1, ' ');
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
          currentNode.textContent = content;
        }
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeElements', currentNode, null);

      return false;
    };

    /**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */
    // eslint-disable-next-line complexity
    var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
      /* Make sure attribute cannot clobber */
      if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
        return false;
      }

      /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        return false;

        /* Check value is safe. First, is attr inert? If so, is safe */
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if (!value) ; else {
        return false;
      }

      return true;
    };

    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */
    // eslint-disable-next-line complexity
    var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
      var attr = void 0;
      var value = void 0;
      var lcName = void 0;
      var idAttr = void 0;
      var l = void 0;
      /* Execute a hook if present */
      _executeHook('beforeSanitizeAttributes', currentNode, null);

      var attributes = currentNode.attributes;

      /* Check if we have attributes; if not we might have a text node */

      if (!attributes) {
        return;
      }

      var hookEvent = {
        attrName: '',
        attrValue: '',
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      l = attributes.length;

      /* Go backwards over all attributes; safely remove bad ones */
      while (l--) {
        attr = attributes[l];
        var _attr = attr,
            name = _attr.name,
            namespaceURI = _attr.namespaceURI;

        value = stringTrim(attr.value);
        lcName = stringToLowerCase(name);

        /* Execute a hook if present */
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
        _executeHook('uponSanitizeAttribute', currentNode, hookEvent);
        value = hookEvent.attrValue;
        /* Did the hooks approve of the attribute? */
        if (hookEvent.forceKeepAttr) {
          continue;
        }

        /* Remove attribute */
        // Safari (iOS + Mac), last tested v8.0.5, crashes if you try to
        // remove a "name" attribute from an <img> tag that has an "id"
        // attribute at the time.
        if (lcName === 'name' && currentNode.nodeName === 'IMG' && attributes.id) {
          idAttr = attributes.id;
          attributes = arraySlice(attributes, []);
          _removeAttribute('id', currentNode);
          _removeAttribute(name, currentNode);
          if (arrayIndexOf(attributes, idAttr) > l) {
            currentNode.setAttribute('id', idAttr.value);
          }
        } else if (
        // This works around a bug in Safari, where input[type=file]
        // cannot be dynamically set after type has been removed
        currentNode.nodeName === 'INPUT' && lcName === 'type' && value === 'file' && hookEvent.keepAttr && (ALLOWED_ATTR[lcName] || !FORBID_ATTR[lcName])) {
          continue;
        } else {
          // This avoids a crash in Safari v9.0 with double-ids.
          // The trick is to first set the id to be empty and then to
          // remove the attribute
          if (name === 'id') {
            currentNode.setAttribute(name, '');
          }

          _removeAttribute(name, currentNode);
        }

        /* Did the hooks approve of the attribute? */
        if (!hookEvent.keepAttr) {
          continue;
        }

        /* Work around a security issue in jQuery 3.0 */
        if (SAFE_FOR_JQUERY && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }

        /* Take care of an mXSS pattern using namespace switches */
        if (regExpTest(/svg|math/i, currentNode.namespaceURI) && regExpTest(regExpCreate('</(' + arrayJoin(objectKeys(FORBID_CONTENTS), '|') + ')', 'i'), value)) {
          _removeAttribute(name, currentNode);
          continue;
        }

        /* Sanitize attribute content to be template-safe */
        if (SAFE_FOR_TEMPLATES) {
          value = stringReplace(value, MUSTACHE_EXPR$$1, ' ');
          value = stringReplace(value, ERB_EXPR$$1, ' ');
        }

        /* Is `value` valid for this attribute? */
        var lcTag = currentNode.nodeName.toLowerCase();
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }

        /* Handle invalid data-* attribute set by try-catching it */
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }

          arrayPop(DOMPurify.removed);
        } catch (_) {}
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeAttributes', currentNode, null);
    };

    /**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */
    var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
      var shadowNode = void 0;
      var shadowIterator = _createIterator(fragment);

      /* Execute a hook if present */
      _executeHook('beforeSanitizeShadowDOM', fragment, null);

      while (shadowNode = shadowIterator.nextNode()) {
        /* Execute a hook if present */
        _executeHook('uponSanitizeShadowNode', shadowNode, null);

        /* Sanitize tags and elements */
        if (_sanitizeElements(shadowNode)) {
          continue;
        }

        /* Deep shadow DOM detected */
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(shadowNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(shadowNode);
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeShadowDOM', fragment, null);
    };

    /**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
    // eslint-disable-next-line complexity
    DOMPurify.sanitize = function (dirty, cfg) {
      var body = void 0;
      var importedNode = void 0;
      var currentNode = void 0;
      var oldNode = void 0;
      var returnNode = void 0;
      /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */
      if (!dirty) {
        dirty = '<!-->';
      }

      /* Stringify, in case dirty is an object */
      if (typeof dirty !== 'string' && !_isNode(dirty)) {
        // eslint-disable-next-line no-negated-condition
        if (typeof dirty.toString !== 'function') {
          throw typeErrorCreate('toString is not a function');
        } else {
          dirty = dirty.toString();
          if (typeof dirty !== 'string') {
            throw typeErrorCreate('dirty is not a string, aborting');
          }
        }
      }

      /* Check we can run. Otherwise fall back or ignore */
      if (!DOMPurify.isSupported) {
        if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
          if (typeof dirty === 'string') {
            return window.toStaticHTML(dirty);
          }

          if (_isNode(dirty)) {
            return window.toStaticHTML(dirty.outerHTML);
          }
        }

        return dirty;
      }

      /* Assign config vars */
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }

      /* Clean up removed elements */
      DOMPurify.removed = [];

      /* Check if dirty is correctly typed for IN_PLACE */
      if (typeof dirty === 'string') {
        IN_PLACE = false;
      }

      if (IN_PLACE) ; else if (dirty instanceof Node) {
        /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
        body = _initDocument('<!-->');
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
          /* Node is already a body, use as is */
          body = importedNode;
        } else if (importedNode.nodeName === 'HTML') {
          body = importedNode;
        } else {
          // eslint-disable-next-line unicorn/prefer-node-append
          body.appendChild(importedNode);
        }
      } else {
        /* Exit directly if we have nothing to do */
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
        // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf('<') === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }

        /* Initialize the document to work on */
        body = _initDocument(dirty);

        /* Check we have a DOM node from the data */
        if (!body) {
          return RETURN_DOM ? null : emptyHTML;
        }
      }

      /* Remove first element node (ours) if FORCE_BODY is set */
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }

      /* Get node iterator */
      var nodeIterator = _createIterator(IN_PLACE ? dirty : body);

      /* Now start iterating over the created document */
      while (currentNode = nodeIterator.nextNode()) {
        /* Fix IE's strange behavior with manipulated textNodes #89 */
        if (currentNode.nodeType === 3 && currentNode === oldNode) {
          continue;
        }

        /* Sanitize tags and elements */
        if (_sanitizeElements(currentNode)) {
          continue;
        }

        /* Shadow DOM detected, sanitize it */
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(currentNode);

        oldNode = currentNode;
      }

      oldNode = null;

      /* If we sanitized `dirty` in-place, return it. */
      if (IN_PLACE) {
        return dirty;
      }

      /* Return sanitized string or DOM */
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);

          while (body.firstChild) {
            // eslint-disable-next-line unicorn/prefer-node-append
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }

        if (RETURN_DOM_IMPORT) {
          /*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */
          returnNode = importNode.call(originalDocument, returnNode, true);
        }

        return returnNode;
      }

      var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;

      /* Sanitize final string template-safe */
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, ' ');
        serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, ' ');
      }

      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };

    /**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */
    DOMPurify.setConfig = function (cfg) {
      _parseConfig(cfg);
      SET_CONFIG = true;
    };

    /**
     * Public method to remove the configuration
     * clearConfig
     *
     */
    DOMPurify.clearConfig = function () {
      CONFIG = null;
      SET_CONFIG = false;
    };

    /**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {string} tag Tag name of containing element.
     * @param  {string} attr Attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */
    DOMPurify.isValidAttribute = function (tag, attr, value) {
      /* Initialize shared config vars if necessary. */
      if (!CONFIG) {
        _parseConfig({});
      }

      var lcTag = stringToLowerCase(tag);
      var lcName = stringToLowerCase(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };

    /**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */
    DOMPurify.addHook = function (entryPoint, hookFunction) {
      if (typeof hookFunction !== 'function') {
        return;
      }

      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };

    /**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     */
    DOMPurify.removeHook = function (entryPoint) {
      if (hooks[entryPoint]) {
        arrayPop(hooks[entryPoint]);
      }
    };

    /**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */
    DOMPurify.removeHooks = function (entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };

    /**
     * RemoveAllHooks
     * Public method to remove all DOMPurify hooks
     *
     */
    DOMPurify.removeAllHooks = function () {
      hooks = {};
    };

    return DOMPurify;
  }

  var purify = createDOMPurify();

  var trim = function trim(str) {
    if (!str) return '';
    return str.trim();
  };

  var tryDownload = function tryDownload(content, filename) {
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    var blob = new Blob([content], {
      type: 'text/csv'
    });
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  };

  var removeTag = function removeTag(html) {
    if (html.startsWith('<')) {
      return html.replace(/^<[^>]+>([^<]*)<\/[^>]+>/, '$1');
    }

    return html;
  };

  var removeNotMatchedHtmlTag = function removeNotMatchedHtmlTag(str) {
    if (/<\/?(span|div)[^>]*>/.test(str)) {
      return str.replace(/<\/?(span|div)[^>]*>/g, '');
    }

    return str;
  };

  var removeNormalHtmlTag = function removeNormalHtmlTag(str) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var wrap = arguments.length > 2 ? arguments[2] : undefined;
    count++;
    if (!/<(\w{1,7})[^>]*>/.test(str) || count > 2) return str;

    var _str;

    if (wrap) {
      _str = str.replace(/<br\s?\/?>/ig, '\n').replace(/\n+/g, '\n');
    } else {
      _str = str.replace(/<br\s?\/?>/ig, '');
    }

    _str = _str.replace(/<(\w{1,7})[^>]*>([^<]*)<\/\1>/g, '$2');
    return removeNormalHtmlTag(_str, count, wrap);
  };

  var removeHtmlTag = function removeHtmlTag(str) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var wrap = arguments.length > 2 ? arguments[2] : undefined;

    var _str = removeNormalHtmlTag(str, count, wrap);

    return removeNotMatchedHtmlTag(_str);
  };

  var isFullTag = function isFullTag(text) {
    var _text = trim(text.replace(/<br\s?\/?>/ig, ''));

    var isFull = true;
    var type = '';

    while (_text && isFull) {
      var _type = '';

      if (/^<span[^>]*>.+<\/span>/.test(_text)) {
        _type = _text.match(/^(<span[^>]*>).+<\/span>/)[1];
        _text = trim(_text.replace(/^<span[^>]*>.+<\/span>/, ''));
        if (!type) type = _type;
        if (type !== _type) isFull = false;
      } else {
        isFull = false;
      }
    }

    return isFull;
  };

  var simpleHtml = function simpleHtml(text) {
    var _text = text.replace(/<br\s?\/?>/ig, '\\n');

    if (!isFullTag(text)) return _text;
    _text = _text.replace(/<(\w{1,7})[^>]*>([^<]*)<\/\1>/g, '$2');
    return _text;
  };

  var restoreHtml = function restoreHtml(text, origin) {
    var html = text.replace(/\\n/g, '<br>');

    if (!isFullTag(text) && isFullTag(origin)) {
      var startText = origin.match(/(^<\w+[^>]*>)/)[1];
      var tagName = startText.match(/<(\w+)[^>]*>/)[1];
      html = html.split('<br>').map(function (txt) {
        return "".concat(startText).concat(txt, "</").concat(tagName, ">");
      }).join('<br>');
    }

    return html;
  };

  var replaceWords = function replaceWords(str, map) {
    var lang = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'en';
    if (!str) return str;
    var _str = str;

    var _iterator = _createForOfIteratorHelper(map),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            val = _step$value[1];

        if (!key || key.length < 2) continue;
        var expr = key.replace(/\./g, '\\.').replace(/\*/g, '\\*');
        var reStr = lang === 'en' ? "\\b".concat(expr, "\\b") : "".concat(expr);

        if (typeof val === 'string') {
          _str = _str.replace(new RegExp(reStr, 'g'), val);
        } else if (val && val.trans && !val.noun) {
          if (val.ignoreCase) {
            _str = _str.replace(new RegExp(reStr, 'gi'), val.trans);
          } else {
            _str = _str.replace(new RegExp(reStr, 'g'), val.trans);
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return _str;
  };

  var getPreview = function getPreview() {
    var str = sessionStorage.getItem('blhxfy:preview');
    var data = [];

    if (str) {
      try {
        data = JSON.parse(str);
      } catch (e) {
        console.error(e);
      }
    }

    return data;
  };

  var getPreviewCsv = function getPreviewCsv(name) {
    var data = getPreview();
    var csv = '';

    var _iterator2 = _createForOfIteratorHelper(data),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;

        if (item.name === name) {
          csv = purify.sanitize(item.csv);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return csv;
  };

  var splitSingleLineSkill = function splitSingleLineSkill(csv) {
    return csv.replace(/\s(skill|special|npc|support|intro|,|active)/g, '\n$1');
  };

  var isDomain = function isDomain(str) {
    if (!/^https?:\/\//.test(str)) return false;
    if (/\s/.test(str.trim())) return false;
    return true;
  };

  var getPlusStr = function getPlusStr(str) {
    var plusStr = '';
    var plusStr2 = '';
    var _str = str;

    while (_str.endsWith('+') || _str.endsWith('＋')) {
      plusStr += '＋';
      plusStr2 += '+';
      _str = _str.slice(0, _str.length - 1);
    }

    return [plusStr, plusStr2, _str];
  };

  var race = function race(func) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var promise1 = func.apply(void 0, args);
      var promise2 = new Promise(function (rev) {
        setTimeout(function () {
          rev(args[0]);
        }, time);
      });
      return Promise.race([promise1, promise2]);
    };
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty$1.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  var isArray_1 = isArray;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var stringTag = '[object String]';

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a string, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' ||
      (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag);
  }

  var isString_1 = isString;

  /** `Object#toString` result references. */
  var boolTag = '[object Boolean]';

  /**
   * Checks if `value` is classified as a boolean primitive or object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
   * @example
   *
   * _.isBoolean(false);
   * // => true
   *
   * _.isBoolean(null);
   * // => false
   */
  function isBoolean(value) {
    return value === true || value === false ||
      (isObjectLike_1(value) && _baseGetTag(value) == boolTag);
  }

  var isBoolean_1 = isBoolean;

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  var _overArg = overArg;

  /** Built-in value references. */
  var getPrototype = _overArg(Object.getPrototypeOf, Object);

  var _getPrototype = getPrototype;

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';

  /** Used for built-in method references. */
  var funcProto = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString.call(Object);

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = _getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      funcToString.call(Ctor) == objectCtorString;
  }

  var isPlainObject_1 = isPlainObject;

  var whiteList = ['需要<%= quest_ap - sp %><%= point_name %>来开始。', '使用道具恢复<%= point_name %>？', "\u6765\u81EA<span class='txt-request-name'><%= n.attributes.called_user_name %></span>\u7684\u6551\u63F4\u8BF7\u6C42", '物品「<%= contents[0].higher_order_info.from_name %>」的<br>效果已经生效了，<br>所以「<%= contents[0].name %>」的效果无法生效', "\u6765\u81EA<span class='txt-request-name'><%= raid['called_user_name'] %></span>\u7684\u6551\u63F4\u8BF7\u6C42", '还剩<%= can_quest_start_count %>回挑战（一共<%= max_quest_start_count %>回）', '<%= set_user.name %> Rank <%= set_user.rank %> 选择任务', '更改第<%= stamp.priority %>个表情', '→掷出了<%= log[i].result_number %>', '<%= log[i].nickname %>对<%= log[i].item_name %>进行ROLL点', '<%= log[i].nickname %>获得了<%= log[i].item_name %>', '阅读 <%= n.episode_name %>', '<%= title %>'];

  var filter = function filter(str) {
    var notTrim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!whiteList.includes(str) && /[><]/.test(str)) {
      var _str = purify.sanitize(str);

      if (typeof _str !== 'string') {
        _str = _str.toString();
      }

      return notTrim ? _str : trim(_str);
    }

    return notTrim ? str : trim(str);
  };

  var version = "2.3.6";

  var config = {
    origin: 'https://blhx.danmu9.com',
    apiHosts: ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'],
    hash: '',
    userName: '',
    displayName: '',
    defaultName: '姬塔',
    defaultEnName: 'Djeeta',
    storyOnly: false,
    font: '',
    fontBold: false,
    transApi: 'caiyun',
    timeout: 8,
    plainText: false,
    autoDownload: false,
    bottomToolbar: false,
    removeScroller: true,
    hideSidebar: false,
    battleTrans: true,
    showTranslator: true,
    log: false,
    localHash: '',
    transJa: true,
    transEn: true,
    keepBgm: false,
    originText: false,
    defaultFont: false,
    cacheTime: 30,
    version: version
  };

  var getLocalConfig = function getLocalConfig() {
    var str = localStorage.getItem('blhxfy:setting');
    var setting = JSON.parse(str);
    if (!isPlainObject_1(setting)) setting = {};
    var _setting = setting,
        origin = _setting.origin;

    if (isDomain(origin)) {
      config.origin = origin.trim();
    }

    if (LOCAL_HOST) {
      config.origin = 'http://127.0.0.1:15945';
    }

    var keys = ['autoDownload', 'bottomToolbar', 'displayName', 'removeScroller', 'hideSidebar', 'originText', 'storyOnly', 'showTranslator', 'transJa', 'transEn', 'keepBgm', 'font', 'transApi', 'fontBold', 'plainText', 'battleTrans', 'log', 'defaultFont'];
    keys.forEach(function (key) {
      var value = setting[key];
      if (isString_1(value)) value = filter(value.trim());

      if (isBoolean_1(value) || value) {
        config[key] = value;
      }

      if (key === 'transApi' && value === 'baidu') {
        config[key] = 'caiyun';
      }
    });
  };

  var getLocalHash = function getLocalHash() {
    try {
      var str = sessionStorage.getItem('blhxfy:data');
      var data = JSON.parse(str);
      config.localHash = data.hash;
    } catch (err) {// ignore
    }
  };

  getLocalConfig();
  getLocalHash();

  /** `Object#toString` result references. */
  var regexpTag = '[object RegExp]';

  /**
   * The base implementation of `_.isRegExp` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   */
  function baseIsRegExp(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == regexpTag;
  }

  var _baseIsRegExp = baseIsRegExp;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary;

  var _nodeUtil = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports =  exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && _freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  module.exports = nodeUtil;
  });

  /* Node.js helper references. */
  var nodeIsRegExp = _nodeUtil && _nodeUtil.isRegExp;

  /**
   * Checks if `value` is classified as a `RegExp` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   * @example
   *
   * _.isRegExp(/abc/);
   * // => true
   *
   * _.isRegExp('/abc/');
   * // => false
   */
  var isRegExp = nodeIsRegExp ? _baseUnary(nodeIsRegExp) : _baseIsRegExp;

  var isRegExp_1 = isRegExp;

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

  var ee = new events();
  var lacia;

  var insertCSS = function insertCSS() {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = "".concat(config.origin, "/blhxfy/data/static/style/BLHXFY.css?lacia=").concat(config.hash['BLHXFY.css'] || '');
    document.head.appendChild(link);
  };

  var timeoutStyleInserted = false;

  var timeoutStyle = function timeoutStyle() {
    if (timeoutStyleInserted) return;
    timeoutStyleInserted = true;
    var style = document.createElement('style');
    style.innerHTML = "\n  .wrapper .cnt-global-header .prt-head-current {\n    color: #ff6565;\n  }\n  ";
    document.head.appendChild(style);
  };

  var loadIframe = function loadIframe() {
    return new Promise(function (rev, rej) {
      window.addEventListener('load', function () {
        var iframe = document.createElement('iframe');
        iframe.src = "".concat(config.origin, "/blhxfy/lacia.html");
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        lacia = iframe.contentWindow;
      });
      var timer = setTimeout(function () {
        rej("\u52A0\u8F7Diframe\u8D85\u65F6");
      }, config.timeout * 1000);
      ee.once('loaded', function () {
        clearTimeout(timer);
        rev();
      });
    });
  };

  var iframeLoaded = false;

  var fetchData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pathname) {
      var url, flag;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = pathname;
              flag = Math.random();
              _context.prev = 2;

              if (!iframeLoaded) {
                loadIframe = loadIframe();
                iframeLoaded = true;
              }

              _context.next = 6;
              return loadIframe;

            case 6:
              lacia.postMessage({
                type: 'fetch',
                url: url,
                flag: flag
              }, config.origin);
              _context.next = 13;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](2);
              console.log(_context.t0);
              return _context.abrupt("return", '');

            case 13:
              return _context.abrupt("return", new Promise(function (rev, rej) {
                var timer = setTimeout(function () {
                  rej("\u52A0\u8F7D".concat(pathname, "\u8D85\u65F6"));
                  timeoutStyle();
                }, config.timeout * 1000);
                ee.once("response".concat(flag), function (data) {
                  clearTimeout(timer);

                  if (data.error) {
                    rej(data.error);
                  } else {
                    rev(data.data);
                  }
                });
              }));

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 9]]);
    }));

    return function fetchData(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var fetchInfo = {
    status: 'init',
    result: false,
    data: null
  };

  var saveManifest = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var t, res, data;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              t = Math.floor(Date.now() / 1000 / 60 / 60 / 6);
              _context2.next = 3;
              return fetch("".concat(config.origin, "/blhxfy/manifest.json?t=").concat(t));

            case 3:
              res = _context2.sent;
              _context2.next = 6;
              return res.json();

            case 6:
              data = _context2.sent;
              data.time = Date.now();
              localStorage.setItem('blhxfy:manifest', JSON.stringify(data));
              return _context2.abrupt("return", data);

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function saveManifest() {
      return _ref2.apply(this, arguments);
    };
  }();

  var getManifest = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var data, str;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              try {
                str = localStorage.getItem('blhxfy:manifest');
                if (str) data = JSON.parse(str);
                if (Date.now() - data.time > config.cacheTime * 60 * 1000) data = false;
              } catch (e) {}

              if (data) {
                _context3.next = 7;
                break;
              }

              _context3.next = 4;
              return saveManifest();

            case 4:
              data = _context3.sent;
              _context3.next = 8;
              break;

            case 7:
              setTimeout(saveManifest, 5 * 1000);

            case 8:
              return _context3.abrupt("return", data);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function getManifest() {
      return _ref3.apply(this, arguments);
    };
  }();

  var tryFetch = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var data;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!window.fetch) {
                _context4.next = 13;
                break;
              }

              _context4.prev = 1;
              _context4.next = 4;
              return getManifest();

            case 4:
              data = _context4.sent;
              fetchInfo.data = data;
              fetchInfo.result = true;
              sessionStorage.setItem('blhxfy:cors', 'enabled');
              _context4.next = 13;
              break;

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](1);
              sessionStorage.setItem('blhxfy:cors', 'disabled');

            case 13:
              fetchInfo.status = 'finished';

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[1, 10]]);
    }));

    return function tryFetch() {
      return _ref4.apply(this, arguments);
    };
  }();

  var request = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(pathname) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:

              return _context5.abrupt("return", new Promise(function (rev, rej) {
                fetch("".concat(config.origin).concat(pathname)).then(function (res) {
                  if (!res.ok) {
                    rej("".concat(res.status, " ").concat(res.url));
                    return '';
                  }

                  var type = res.headers.get('content-type');

                  if (type.includes('json')) {
                    return res.json();
                  }

                  return res.text();
                }).then(rev).catch(rej);
              }));

            case 4:
              _context5.next = 6;
              return fetchData(pathname);

            case 6:
              return _context5.abrupt("return", _context5.sent);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function request(_x2) {
      return _ref5.apply(this, arguments);
    };
  }();

  var getHashPrms;

  var getHash = function getHash() {
    if (getHashPrms) return getHashPrms;
    return getHashPrms = new Promise(function (rev, rej) {
      if (fetchInfo.status !== 'finished') {
        tryFetch().then(function () {
          var beforeStart = function beforeStart(data) {
            config.newVersion = data.version;
            config.hash = data.hashes;
            insertCSS();
          };

          if (fetchInfo.result) {
            beforeStart(fetchInfo.data);
            rev(fetchInfo.data.hashes);
          } else {
            rej('加载manifest.json失败'); // fetchData('/blhxfy/manifest.json').then(data => {
            //   beforeStart(data)
            //   fetchInfo.data = data
            //   rev(data.hash)
            // })
          }
        }).catch(rej);
      } else {
        rev(fetchInfo.data.hashes);
      }
    });
  };

  var fetchWithHash = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(pathname, hash) {
      var hashes, key, data;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (hash) {
                _context6.next = 6;
                break;
              }

              _context6.next = 3;
              return getHash();

            case 3:
              hashes = _context6.sent;
              key = pathname.replace('/blhxfy/data/', '');
              hash = hashes[key];

            case 6:
              _context6.next = 8;
              return request("".concat(pathname).concat(hash ? "?lacia=".concat(hash) : ''));

            case 8:
              data = _context6.sent;
              return _context6.abrupt("return", data);

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function fetchWithHash(_x3, _x4) {
      return _ref6.apply(this, arguments);
    };
  }();

  var receiveMessage = function receiveMessage(event) {
    if (event.origin !== config.origin) return;

    if (event.data && event.data.type) {
      if (event.data.type === 'response') {
        ee.emit("response".concat(event.data.flag), event.data);
      } else if (event.data.type === 'loaded') {
        ee.emit('loaded');
      }
    }
  };

  window.addEventListener("message", receiveMessage, false);

  var papaparse_min = createCommonjsModule(function (module, exports) {
  /* @license
  Papa Parse
  v5.2.0
  https://github.com/mholt/PapaParse
  License: MIT
  */
  !function(e,t){module.exports=t();}(commonjsGlobal,function s(){var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var i=(t=t||{}).dynamicTyping||!1;U(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!U(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var r=function(){if(!b.WORKERS_SUPPORTED)return !1;var e=(i=f.URL||f.webkitURL||null,r=s.toString(),b.BLOB_URL||(b.BLOB_URL=i.createObjectURL(new Blob(["(",r,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var i,r;return t.onmessage=_,t.id=h++,a[t.id]=t}();return r.userStep=t.step,r.userChunk=t.chunk,r.userComplete=t.complete,r.userError=t.error,t.step=U(t.step),t.chunk=U(t.chunk),t.complete=U(t.complete),t.error=U(t.error),delete t.worker,void r.postMessage({input:e,config:t,workerId:r.id})}var n=null;"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&U(e.read)&&U(e.on)?n=new g(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var n=!1,_=!0,m=",",v="\r\n",s='"',a=s+s,i=!1,r=null;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter);("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(n=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(i=t.skipEmptyLines);"string"==typeof t.newline&&(v=t.newline);"string"==typeof t.quoteChar&&(s=t.quoteChar);"boolean"==typeof t.header&&(_=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");r=t.columns;}void 0!==t.escapeChar&&(a=t.escapeChar+s);}();var o=new RegExp(q(s),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,i);if("object"==typeof e[0])return u(r||h(e[0]),e,i)}else if("object"==typeof e)return "string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:h(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],i);throw new Error("Unable to serialize unrecognized input");function h(e){if("object"!=typeof e)return [];var t=[];for(var i in e)t.push(i);return t}function u(e,t,i){var r="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(r+=m),r+=y(e[a],a);0<t.length&&(r+=v);}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(i&&!n&&(u="greedy"===i?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===i&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c]);}u=""===d.join("").trim();}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(r+=m);var g=n&&s?e[p]:p;r+=y(t[o][g],p);}o<t.length-1&&(!i||0<h&&!f)&&(r+=v);}}return r}function y(e,t){if(null==e)return "";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);var i=e.toString().replace(o,a),r="boolean"==typeof n&&n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||function(e,t){for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return !0;return !1}(i,b.BAD_DELIMITERS)||-1<i.indexOf(m)||" "===i.charAt(0)||" "===i.charAt(i.length-1);return r?s+i+s:i}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=w,b.ParserHandle=i,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=g,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return !0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)});}),e(),this;function e(){if(0!==h.length){var e,t,i,r,n=h[0];if(U(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,i=n.inputElem,r=s.reason,void(U(o.error)&&o.error({name:e},t,i,r));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config));}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){U(a)&&a(e,n.file,n.inputElem),u();},b.parse(n.file,n.instanceConfig);}else U(o.complete)&&o.complete();}function u(){h.splice(0,1),e();}};}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=E(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t;}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&U(this._config.beforeFirstChunk)){var i=this._config.beforeFirstChunk(e);void 0!==i&&(e=i);}this.isFirstChunk=!1,this._halted=!1;var r=this._partialLine+e;this._partialLine="";var n=this._handle.parse(r,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=r.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(U(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0;}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!U(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0;},this._sendError=function(e){U(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1});};}function l(e){var r;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded();}:function(){this._readChunk();},this.stream=function(e){this._input=e,this._nextChunk();},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),n||(r.onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)r.setRequestHeader(t,e[t]);}if(this._config.chunkSize){var i=this._start+this._config.chunkSize-1;r.setRequestHeader("Range","bytes="+this._start+"-"+i);}try{r.send(this._config.downloadRequestBody);}catch(e){this._chunkError(e.message);}n&&0===r.status&&this._chunkError();}},this._chunkLoaded=function(){4===r.readyState&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:r.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return -1;return parseInt(t.substring(t.lastIndexOf("/")+1))}(r),this.parseChunk(r.responseText)));},this._chunkError=function(e){var t=r.statusText||e;this._sendError(new Error(t));};}function c(e){var r,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((r=new FileReader).onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)):r=new FileReaderSync,this._nextChunk();},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk();},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t);}var i=r.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:i}});},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result);},this._chunkError=function(){this._sendError(r.error);};}function p(e){var i;u.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,t=this._config.chunkSize;return t?(e=i.substring(0,t),i=i.substring(t)):(e=i,i=""),this._finished=!i,this.parseChunk(e)}};}function g(e){u.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause();},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume();},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError);},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0);},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0;},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()));}catch(e){this._streamError(e);}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e);},this),this._streamEnd=y(function(){this._streamCleanUp(),r=!0,this._streamData("");},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError);},this);}function i(m){var a,o,h,r=Math.pow(2,53),n=-r,s=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)(e[-+]?\d+)?\s*$/,u=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,i=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(U(m.step)){var p=m.step;m.step=function(e){if(c=e,_())g();else{if(g(),0===c.data.length)return;i+=e.data.length,m.preview&&i>m.preview?o.abort():(c.data=c.data[0],p(c,t));}};}function v(e){return "greedy"===m.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function g(){if(c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),m.skipEmptyLines)for(var e=0;e<c.data.length;e++)v(c.data[e])&&c.data.splice(e--,1);return _()&&function(){if(!c)return;function e(e){U(m.transformHeader)&&(e=m.transformHeader(e)),l.push(e);}if(Array.isArray(c.data[0])){for(var t=0;_()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1);}else c.data.forEach(e);}(),function(){if(!c||!m.header&&!m.dynamicTyping&&!m.transform)return c;function e(e,t){var i,r=m.header?{}:[];for(i=0;i<e.length;i++){var n=i,s=e[i];m.header&&(n=i>=l.length?"__parsed_extra":l[i]),m.transform&&(s=m.transform(s,n)),s=y(n,s),"__parsed_extra"===n?(r[n]=r[n]||[],r[n].push(s)):r[n]=s;}return m.header&&(i>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+i,f+t):i<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+i,f+t)),r}var t=1;!c.data.length||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);m.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function _(){return m.header&&0===l.length}function y(e,t){return i=e,m.dynamicTypingFunction&&void 0===m.dynamicTyping[i]&&(m.dynamicTyping[i]=m.dynamicTypingFunction(i)),!0===(m.dynamicTyping[i]||m.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<r)return !0}return !1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var i;}function k(e,t,i,r){var n={type:e,code:t,message:i};void 0!==r&&(n.row=r),c.errors.push(n);}this.parse=function(e,t,i){var r=m.quoteChar||'"';if(m.newline||(m.newline=function(e,t){e=e.substring(0,1048576);var i=new RegExp(q(t)+"([^]*?)"+q(t),"gm"),r=(e=e.replace(i,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<r[0].length;if(1===r.length||s)return "\n";for(var a=0,o=0;o<r.length;o++)"\n"===r[o][0]&&a++;return a>=r.length/2?"\r\n":"\r"}(e,r)),h=!1,m.delimiter)U(m.delimiter)&&(m.delimiter=m.delimiter(e),c.meta.delimiter=m.delimiter);else{var n=function(e,t,i,r,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new w({comments:r,delimiter:f,newline:t,preview:10}).parse(e),g=0;g<p.data.length;g++)if(i&&v(p.data[g]))c++;else{var _=p.data[g].length;l+=_,void 0!==o?0<_&&(d+=Math.abs(_-o),o=_):o=_;}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l);}return {successful:!!(m.delimiter=s),bestDelimiter:s}}(e,m.newline,m.skipEmptyLines,m.comments,m.delimitersToGuess);n.successful?m.delimiter=n.bestDelimiter:(h=!0,m.delimiter=b.DefaultDelimiter),c.meta.delimiter=m.delimiter;}var s=E(m);return m.preview&&m.header&&s.preview++,a=e,o=new w(s),c=o.parse(a,t,i),g(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=U(m.chunk)?"":a.substring(o.getCharIndex());},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(t.resume,3);},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,U(m.complete)&&m.complete(c),a="";};}function q(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function w(e){var O,D=(e=e||{}).delimiter,I=e.newline,T=e.comments,A=e.step,L=e.preview,F=e.fastMode,z=O=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(z=e.escapeChar),("string"!=typeof D||-1<b.BAD_DELIMITERS.indexOf(D))&&(D=","),T===D)throw new Error("Comment character same as delimiter");!0===T?T="#":("string"!=typeof T||-1<b.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==I&&"\r"!==I&&"\r\n"!==I&&(I="\n");var M=0,j=!1;this.parse=function(a,t,i){if("string"!=typeof a)throw new Error("Input must be a string");var r=a.length,e=D.length,n=I.length,s=T.length,o=U(A),h=[],u=[],f=[],d=M=0;if(!a)return R();if(F||!1!==F&&-1===a.indexOf(O)){for(var l=a.split(I),c=0;c<l.length;c++){if(f=l[c],M+=f.length,c!==l.length-1)M+=I.length;else if(i)return R();if(!T||f.substring(0,s)!==T){if(o){if(h=[],b(f.split(D)),S(),j)return R()}else b(f.split(D));if(L&&L<=c)return h=h.slice(0,L),R(!0)}}return R()}for(var p=a.indexOf(D,M),g=a.indexOf(I,M),_=new RegExp(q(z)+q(O),"g"),m=a.indexOf(O,M);;)if(a[M]!==O)if(T&&0===f.length&&a.substring(M,M+s)===T){if(-1===g)return R();M=g+n,g=a.indexOf(I,M),p=a.indexOf(D,M);}else{if(-1!==p&&(p<g||-1===g)){if(!(p<m)){f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}var v=x(p,m,g);if(v&&void 0!==v.nextDelim){p=v.nextDelim,m=v.quoteSearch,f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}}if(-1===g)break;if(f.push(a.substring(M,g)),C(g+n),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0)}else for(m=M,M++;;){if(-1===(m=a.indexOf(O,m+1)))return i||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:M}),E();if(m===r-1)return E(a.substring(M,m).replace(_,O));if(O!==z||a[m+1]!==z){if(O===z||0===m||a[m-1]!==z){-1!==p&&p<m+1&&(p=a.indexOf(D,m+1)),-1!==g&&g<m+1&&(g=a.indexOf(I,m+1));var y=w(-1===g?p:Math.min(p,g));if(a[m+1+y]===D){f.push(a.substring(M,m).replace(_,O)),a[M=m+1+y+e]!==O&&(m=a.indexOf(O,M)),p=a.indexOf(D,M),g=a.indexOf(I,M);break}var k=w(g);if(a.substring(m+1+k,m+1+k+n)===I){if(f.push(a.substring(M,m).replace(_,O)),C(m+1+k+n),p=a.indexOf(D,M),m=a.indexOf(O,M),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:M}),m++;}}else m++;}return E();function b(e){h.push(e),d=M;}function w(e){var t=0;if(-1!==e){var i=a.substring(m+1,e);i&&""===i.trim()&&(t=i.length);}return t}function E(e){return i||(void 0===e&&(e=a.substring(M)),f.push(e),M=r,b(f),o&&S()),R()}function C(e){M=e,b(f),f=[],g=a.indexOf(I,M);}function R(e){return {data:h,errors:u,meta:{delimiter:D,linebreak:I,aborted:j,truncated:!!e,cursor:d+(t||0)}}}function S(){A(R()),h=[],u=[];}function x(e,t,i){var r={nextDelim:void 0,quoteSearch:void 0},n=a.indexOf(O,t+1);if(t<e&&e<n&&(n<i||-1===i)){var s=a.indexOf(D,n);if(-1===s)return r;n<s&&(n=a.indexOf(O,n+1)),r=x(s,n,i);}else r={nextDelim:e,quoteSearch:t};return r}},this.abort=function(){j=!0;},this.getCharIndex=function(){return M};}function _(e){var t=e.data,i=a[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){r=!0,m(t.workerId,{data:[],errors:[],meta:{aborted:!0}});},pause:v,resume:v};if(U(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!r);s++);delete t.results;}else U(i.userChunk)&&(i.userChunk(t.results,n,t.file),delete t.results);}t.finished&&!r&&m(t.workerId,t.results);}function m(e,t){var i=a[e];U(i.userComplete)&&i.userComplete(t),i.terminate(),delete a[e];}function v(){throw new Error("Not implemented.")}function E(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var i in e)t[i]=E(e[i]);return t}function y(e,t){return function(){e.apply(t,arguments);}}function U(e){return "function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var i=b.parse(t.input,t.config);i&&f.postMessage({workerId:b.WORKER_ID,results:i,finished:!0});}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(g.prototype=Object.create(u.prototype)).constructor=g,b});
  });

  var parseCsv = function parseCsv(str) {
    try {
      return papaparse_min.parse(str.replace(/^\ufeff/, ''), {
        header: true
      }).data;
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  var loginBonusMap = new Map();
  var loaded = false;

  var getLoginBonus = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded) {
                _context.next = 7;
                break;
              }

              _context.next = 3;
              return fetchWithHash('/blhxfy/data/login-bonus.csv');

            case 3:
              csv = _context.sent;
              list = parseCsv(csv);
              list.forEach(function (item) {
                var text = trim(item.text);
                var trans = filter(item.trans);

                if (text && trans) {
                  loginBonusMap.set(text, trans);
                }
              });
              loaded = true;

            case 7:
              return _context.abrupt("return", loginBonusMap);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getLoginBonus() {
      return _ref.apply(this, arguments);
    };
  }();

  var loginBonus = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var isReplay, loginBonusMap;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              isReplay = data.isReplay;

              if (isReplay) {
                data = localLoginBonus();
              }

              if (!(data.param && data.param.msgArray)) {
                _context.next = 8;
                break;
              }

              _context.next = 5;
              return getLoginBonus();

            case 5:
              loginBonusMap = _context.sent;
              data.param.msgArray.forEach(function (txt, index) {
                if (loginBonusMap.has(txt)) {
                  data.param.msgArray[index] = loginBonusMap.get(txt);
                }
              });

              if (isReplay) {
                localLoginBonus(data);
              }

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function loginBonus(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var localLoginBonus = function localLoginBonus(data) {
    try {
      if (data) {
        localStorage.setItem('login', JSON.stringify(data));
      } else {
        var str = localStorage.getItem('login');

        if (str) {
          var _data = JSON.parse(str);

          return _data;
        }
      }
    } catch (e) {}
  };

  localLoginBonus();

  var pako_inflate_min = createCommonjsModule(function (module, exports) {
  !function(e){module.exports=e();}(function(){return function r(o,s,f){function l(t,e){if(!s[t]){if(!o[t]){var i="function"==typeof require&&require;if(!e&&i)return i(t,!0);if(d)return d(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var a=s[t]={exports:{}};o[t][0].call(a.exports,function(e){return l(o[t][1][e]||e)},a,a.exports,r,o,s,f);}return s[t].exports}for(var d="function"==typeof require&&require,e=0;e<f.length;e++)l(f[e]);return l}({1:[function(e,t,i){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;i.assign=function(e){for(var t,i,n=Array.prototype.slice.call(arguments,1);n.length;){var a=n.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(var r in a)t=a,i=r,Object.prototype.hasOwnProperty.call(t,i)&&(e[r]=a[r]);}}return e},i.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var a={arraySet:function(e,t,i,n,a){if(t.subarray&&e.subarray)e.set(t.subarray(i,i+n),a);else for(var r=0;r<n;r++)e[a+r]=t[i+r];},flattenChunks:function(e){var t,i,n,a,r,o;for(t=n=0,i=e.length;t<i;t++)n+=e[t].length;for(o=new Uint8Array(n),t=a=0,i=e.length;t<i;t++)r=e[t],o.set(r,a),a+=r.length;return o}},r={arraySet:function(e,t,i,n,a){for(var r=0;r<n;r++)e[a+r]=t[i+r];},flattenChunks:function(e){return [].concat.apply([],e)}};i.setTyped=function(e){e?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,a)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,r));},i.setTyped(n);},{}],2:[function(e,t,i){var f=e("./common"),a=!0,r=!0;try{String.fromCharCode.apply(null,[0]);}catch(e){a=!1;}try{String.fromCharCode.apply(null,new Uint8Array(1));}catch(e){r=!1;}for(var l=new f.Buf8(256),n=0;n<256;n++)l[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function d(e,t){if(t<65534&&(e.subarray&&r||!e.subarray&&a))return String.fromCharCode.apply(null,f.shrinkBuf(e,t));for(var i="",n=0;n<t;n++)i+=String.fromCharCode(e[n]);return i}l[254]=l[254]=1,i.string2buf=function(e){var t,i,n,a,r,o=e.length,s=0;for(a=0;a<o;a++)55296==(64512&(i=e.charCodeAt(a)))&&a+1<o&&56320==(64512&(n=e.charCodeAt(a+1)))&&(i=65536+(i-55296<<10)+(n-56320),a++),s+=i<128?1:i<2048?2:i<65536?3:4;for(t=new f.Buf8(s),a=r=0;r<s;a++)55296==(64512&(i=e.charCodeAt(a)))&&a+1<o&&56320==(64512&(n=e.charCodeAt(a+1)))&&(i=65536+(i-55296<<10)+(n-56320),a++),i<128?t[r++]=i:(i<2048?t[r++]=192|i>>>6:(i<65536?t[r++]=224|i>>>12:(t[r++]=240|i>>>18,t[r++]=128|i>>>12&63),t[r++]=128|i>>>6&63),t[r++]=128|63&i);return t},i.buf2binstring=function(e){return d(e,e.length)},i.binstring2buf=function(e){for(var t=new f.Buf8(e.length),i=0,n=t.length;i<n;i++)t[i]=e.charCodeAt(i);return t},i.buf2string=function(e,t){var i,n,a,r,o=t||e.length,s=new Array(2*o);for(i=n=0;i<o;)if((a=e[i++])<128)s[n++]=a;else if(4<(r=l[a]))s[n++]=65533,i+=r-1;else{for(a&=2===r?31:3===r?15:7;1<r&&i<o;)a=a<<6|63&e[i++],r--;1<r?s[n++]=65533:a<65536?s[n++]=a:(a-=65536,s[n++]=55296|a>>10&1023,s[n++]=56320|1023&a);}return d(s,n)},i.utf8border=function(e,t){var i;for((t=t||e.length)>e.length&&(t=e.length),i=t-1;0<=i&&128==(192&e[i]);)i--;return i<0?t:0===i?t:i+l[e[i]]>t?i:t};},{"./common":1}],3:[function(e,t,i){t.exports=function(e,t,i,n){for(var a=65535&e|0,r=e>>>16&65535|0,o=0;0!==i;){for(i-=o=2e3<i?2e3:i;r=r+(a=a+t[n++]|0)|0,--o;);a%=65521,r%=65521;}return a|r<<16|0};},{}],4:[function(e,t,i){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};},{}],5:[function(e,t,i){var s=function(){for(var e,t=[],i=0;i<256;i++){e=i;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[i]=e;}return t}();t.exports=function(e,t,i,n){var a=s,r=n+i;e^=-1;for(var o=n;o<r;o++)e=e>>>8^a[255&(e^t[o])];return -1^e};},{}],6:[function(e,t,i){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1;};},{}],7:[function(e,t,i){t.exports=function(e,t){var i,n,a,r,o,s,f,l,d,c,u,h,b,m,w,k,_,g,v,p,x,y,S,E,Z;i=e.state,n=e.next_in,E=e.input,a=n+(e.avail_in-5),r=e.next_out,Z=e.output,o=r-(t-e.avail_out),s=r+(e.avail_out-257),f=i.dmax,l=i.wsize,d=i.whave,c=i.wnext,u=i.window,h=i.hold,b=i.bits,m=i.lencode,w=i.distcode,k=(1<<i.lenbits)-1,_=(1<<i.distbits)-1;e:do{b<15&&(h+=E[n++]<<b,b+=8,h+=E[n++]<<b,b+=8),g=m[h&k];t:for(;;){if(h>>>=v=g>>>24,b-=v,0===(v=g>>>16&255))Z[r++]=65535&g;else{if(!(16&v)){if(0==(64&v)){g=m[(65535&g)+(h&(1<<v)-1)];continue t}if(32&v){i.mode=12;break e}e.msg="invalid literal/length code",i.mode=30;break e}p=65535&g,(v&=15)&&(b<v&&(h+=E[n++]<<b,b+=8),p+=h&(1<<v)-1,h>>>=v,b-=v),b<15&&(h+=E[n++]<<b,b+=8,h+=E[n++]<<b,b+=8),g=w[h&_];i:for(;;){if(h>>>=v=g>>>24,b-=v,!(16&(v=g>>>16&255))){if(0==(64&v)){g=w[(65535&g)+(h&(1<<v)-1)];continue i}e.msg="invalid distance code",i.mode=30;break e}if(x=65535&g,b<(v&=15)&&(h+=E[n++]<<b,(b+=8)<v&&(h+=E[n++]<<b,b+=8)),f<(x+=h&(1<<v)-1)){e.msg="invalid distance too far back",i.mode=30;break e}if(h>>>=v,b-=v,(v=r-o)<x){if(d<(v=x-v)&&i.sane){e.msg="invalid distance too far back",i.mode=30;break e}if(S=u,(y=0)===c){if(y+=l-v,v<p){for(p-=v;Z[r++]=u[y++],--v;);y=r-x,S=Z;}}else if(c<v){if(y+=l+c-v,(v-=c)<p){for(p-=v;Z[r++]=u[y++],--v;);if(y=0,c<p){for(p-=v=c;Z[r++]=u[y++],--v;);y=r-x,S=Z;}}}else if(y+=c-v,v<p){for(p-=v;Z[r++]=u[y++],--v;);y=r-x,S=Z;}for(;2<p;)Z[r++]=S[y++],Z[r++]=S[y++],Z[r++]=S[y++],p-=3;p&&(Z[r++]=S[y++],1<p&&(Z[r++]=S[y++]));}else{for(y=r-x;Z[r++]=Z[y++],Z[r++]=Z[y++],Z[r++]=Z[y++],2<(p-=3););p&&(Z[r++]=Z[y++],1<p&&(Z[r++]=Z[y++]));}break}}break}}while(n<a&&r<s);n-=p=b>>3,h&=(1<<(b-=p<<3))-1,e.next_in=n,e.next_out=r,e.avail_in=n<a?a-n+5:5-(n-a),e.avail_out=r<s?s-r+257:257-(r-s),i.hold=h,i.bits=b;};},{}],8:[function(e,t,i){var z=e("../utils/common"),R=e("./adler32"),N=e("./crc32"),O=e("./inffast"),C=e("./inftrees"),I=1,D=2,T=0,U=-2,F=1,n=852,a=592;function L(e){return (e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function r(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new z.Buf16(320),this.work=new z.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0;}function o(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=F,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new z.Buf32(n),t.distcode=t.distdyn=new z.Buf32(a),t.sane=1,t.back=-1,T):U}function s(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,o(e)):U}function f(e,t){var i,n;return e&&e.state?(n=e.state,t<0?(i=0,t=-t):(i=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=i,n.wbits=t,s(e))):U}function l(e,t){var i,n;return e?(n=new r,(e.state=n).window=null,(i=f(e,t))!==T&&(e.state=null),i):U}var d,c,u=!0;function H(e){if(u){var t;for(d=new z.Buf32(512),c=new z.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(C(I,e.lens,0,288,d,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;C(D,e.lens,0,32,c,0,e.work,{bits:5}),u=!1;}e.lencode=d,e.lenbits=9,e.distcode=c,e.distbits=5;}function j(e,t,i,n){var a,r=e.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new z.Buf8(r.wsize)),n>=r.wsize?(z.arraySet(r.window,t,i-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(n<(a=r.wsize-r.wnext)&&(a=n),z.arraySet(r.window,t,i-n,a,r.wnext),(n-=a)?(z.arraySet(r.window,t,i-n,n,0),r.wnext=n,r.whave=r.wsize):(r.wnext+=a,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=a))),0}i.inflateReset=s,i.inflateReset2=f,i.inflateResetKeep=o,i.inflateInit=function(e){return l(e,15)},i.inflateInit2=l,i.inflate=function(e,t){var i,n,a,r,o,s,f,l,d,c,u,h,b,m,w,k,_,g,v,p,x,y,S,E,Z=0,B=new z.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(i=e.state).mode&&(i.mode=13),o=e.next_out,a=e.output,f=e.avail_out,r=e.next_in,n=e.input,s=e.avail_in,l=i.hold,d=i.bits,c=s,u=f,y=T;e:for(;;)switch(i.mode){case F:if(0===i.wrap){i.mode=13;break}for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(2&i.wrap&&35615===l){B[i.check=0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0),d=l=0,i.mode=2;break}if(i.flags=0,i.head&&(i.head.done=!1),!(1&i.wrap)||(((255&l)<<8)+(l>>8))%31){e.msg="incorrect header check",i.mode=30;break}if(8!=(15&l)){e.msg="unknown compression method",i.mode=30;break}if(d-=4,x=8+(15&(l>>>=4)),0===i.wbits)i.wbits=x;else if(x>i.wbits){e.msg="invalid window size",i.mode=30;break}i.dmax=1<<x,e.adler=i.check=1,i.mode=512&l?10:12,d=l=0;break;case 2:for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(i.flags=l,8!=(255&i.flags)){e.msg="unknown compression method",i.mode=30;break}if(57344&i.flags){e.msg="unknown header flags set",i.mode=30;break}i.head&&(i.head.text=l>>8&1),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0,i.mode=3;case 3:for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.head&&(i.head.time=l),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,B[2]=l>>>16&255,B[3]=l>>>24&255,i.check=N(i.check,B,4,0)),d=l=0,i.mode=4;case 4:for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.head&&(i.head.xflags=255&l,i.head.os=l>>8),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0,i.mode=5;case 5:if(1024&i.flags){for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.length=l,i.head&&(i.head.extra_len=l),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0;}else i.head&&(i.head.extra=null);i.mode=6;case 6:if(1024&i.flags&&(s<(h=i.length)&&(h=s),h&&(i.head&&(x=i.head.extra_len-i.length,i.head.extra||(i.head.extra=new Array(i.head.extra_len)),z.arraySet(i.head.extra,n,r,h,x)),512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,i.length-=h),i.length))break e;i.length=0,i.mode=7;case 7:if(2048&i.flags){if(0===s)break e;for(h=0;x=n[r+h++],i.head&&x&&i.length<65536&&(i.head.name+=String.fromCharCode(x)),x&&h<s;);if(512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,x)break e}else i.head&&(i.head.name=null);i.length=0,i.mode=8;case 8:if(4096&i.flags){if(0===s)break e;for(h=0;x=n[r+h++],i.head&&x&&i.length<65536&&(i.head.comment+=String.fromCharCode(x)),x&&h<s;);if(512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,x)break e}else i.head&&(i.head.comment=null);i.mode=9;case 9:if(512&i.flags){for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(l!==(65535&i.check)){e.msg="header crc mismatch",i.mode=30;break}d=l=0;}i.head&&(i.head.hcrc=i.flags>>9&1,i.head.done=!0),e.adler=i.check=0,i.mode=12;break;case 10:for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}e.adler=i.check=L(l),d=l=0,i.mode=11;case 11:if(0===i.havedict)return e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,2;e.adler=i.check=1,i.mode=12;case 12:if(5===t||6===t)break e;case 13:if(i.last){l>>>=7&d,d-=7&d,i.mode=27;break}for(;d<3;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}switch(i.last=1&l,d-=1,3&(l>>>=1)){case 0:i.mode=14;break;case 1:if(H(i),i.mode=20,6!==t)break;l>>>=2,d-=2;break e;case 2:i.mode=17;break;case 3:e.msg="invalid block type",i.mode=30;}l>>>=2,d-=2;break;case 14:for(l>>>=7&d,d-=7&d;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if((65535&l)!=(l>>>16^65535)){e.msg="invalid stored block lengths",i.mode=30;break}if(i.length=65535&l,d=l=0,i.mode=15,6===t)break e;case 15:i.mode=16;case 16:if(h=i.length){if(s<h&&(h=s),f<h&&(h=f),0===h)break e;z.arraySet(a,n,r,h,o),s-=h,r+=h,f-=h,o+=h,i.length-=h;break}i.mode=12;break;case 17:for(;d<14;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(i.nlen=257+(31&l),l>>>=5,d-=5,i.ndist=1+(31&l),l>>>=5,d-=5,i.ncode=4+(15&l),l>>>=4,d-=4,286<i.nlen||30<i.ndist){e.msg="too many length or distance symbols",i.mode=30;break}i.have=0,i.mode=18;case 18:for(;i.have<i.ncode;){for(;d<3;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.lens[A[i.have++]]=7&l,l>>>=3,d-=3;}for(;i.have<19;)i.lens[A[i.have++]]=0;if(i.lencode=i.lendyn,i.lenbits=7,S={bits:i.lenbits},y=C(0,i.lens,0,19,i.lencode,0,i.work,S),i.lenbits=S.bits,y){e.msg="invalid code lengths set",i.mode=30;break}i.have=0,i.mode=19;case 19:for(;i.have<i.nlen+i.ndist;){for(;k=(Z=i.lencode[l&(1<<i.lenbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(_<16)l>>>=w,d-=w,i.lens[i.have++]=_;else{if(16===_){for(E=w+2;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(l>>>=w,d-=w,0===i.have){e.msg="invalid bit length repeat",i.mode=30;break}x=i.lens[i.have-1],h=3+(3&l),l>>>=2,d-=2;}else if(17===_){for(E=w+3;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}d-=w,x=0,h=3+(7&(l>>>=w)),l>>>=3,d-=3;}else{for(E=w+7;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}d-=w,x=0,h=11+(127&(l>>>=w)),l>>>=7,d-=7;}if(i.have+h>i.nlen+i.ndist){e.msg="invalid bit length repeat",i.mode=30;break}for(;h--;)i.lens[i.have++]=x;}}if(30===i.mode)break;if(0===i.lens[256]){e.msg="invalid code -- missing end-of-block",i.mode=30;break}if(i.lenbits=9,S={bits:i.lenbits},y=C(I,i.lens,0,i.nlen,i.lencode,0,i.work,S),i.lenbits=S.bits,y){e.msg="invalid literal/lengths set",i.mode=30;break}if(i.distbits=6,i.distcode=i.distdyn,S={bits:i.distbits},y=C(D,i.lens,i.nlen,i.ndist,i.distcode,0,i.work,S),i.distbits=S.bits,y){e.msg="invalid distances set",i.mode=30;break}if(i.mode=20,6===t)break e;case 20:i.mode=21;case 21:if(6<=s&&258<=f){e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,O(e,u),o=e.next_out,a=e.output,f=e.avail_out,r=e.next_in,n=e.input,s=e.avail_in,l=i.hold,d=i.bits,12===i.mode&&(i.back=-1);break}for(i.back=0;k=(Z=i.lencode[l&(1<<i.lenbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(k&&0==(240&k)){for(g=w,v=k,p=_;k=(Z=i.lencode[p+((l&(1<<g+v)-1)>>g)])>>>16&255,_=65535&Z,!(g+(w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}l>>>=g,d-=g,i.back+=g;}if(l>>>=w,d-=w,i.back+=w,i.length=_,0===k){i.mode=26;break}if(32&k){i.back=-1,i.mode=12;break}if(64&k){e.msg="invalid literal/length code",i.mode=30;break}i.extra=15&k,i.mode=22;case 22:if(i.extra){for(E=i.extra;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.length+=l&(1<<i.extra)-1,l>>>=i.extra,d-=i.extra,i.back+=i.extra;}i.was=i.length,i.mode=23;case 23:for(;k=(Z=i.distcode[l&(1<<i.distbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(0==(240&k)){for(g=w,v=k,p=_;k=(Z=i.distcode[p+((l&(1<<g+v)-1)>>g)])>>>16&255,_=65535&Z,!(g+(w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}l>>>=g,d-=g,i.back+=g;}if(l>>>=w,d-=w,i.back+=w,64&k){e.msg="invalid distance code",i.mode=30;break}i.offset=_,i.extra=15&k,i.mode=24;case 24:if(i.extra){for(E=i.extra;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.offset+=l&(1<<i.extra)-1,l>>>=i.extra,d-=i.extra,i.back+=i.extra;}if(i.offset>i.dmax){e.msg="invalid distance too far back",i.mode=30;break}i.mode=25;case 25:if(0===f)break e;if(h=u-f,i.offset>h){if((h=i.offset-h)>i.whave&&i.sane){e.msg="invalid distance too far back",i.mode=30;break}h>i.wnext?(h-=i.wnext,b=i.wsize-h):b=i.wnext-h,h>i.length&&(h=i.length),m=i.window;}else m=a,b=o-i.offset,h=i.length;for(f<h&&(h=f),f-=h,i.length-=h;a[o++]=m[b++],--h;);0===i.length&&(i.mode=21);break;case 26:if(0===f)break e;a[o++]=i.length,f--,i.mode=21;break;case 27:if(i.wrap){for(;d<32;){if(0===s)break e;s--,l|=n[r++]<<d,d+=8;}if(u-=f,e.total_out+=u,i.total+=u,u&&(e.adler=i.check=i.flags?N(i.check,a,u,o-u):R(i.check,a,u,o-u)),u=f,(i.flags?l:L(l))!==i.check){e.msg="incorrect data check",i.mode=30;break}d=l=0;}i.mode=28;case 28:if(i.wrap&&i.flags){for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(l!==(4294967295&i.total)){e.msg="incorrect length check",i.mode=30;break}d=l=0;}i.mode=29;case 29:y=1;break e;case 30:y=-3;break e;case 31:return -4;case 32:default:return U}return e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,(i.wsize||u!==e.avail_out&&i.mode<30&&(i.mode<27||4!==t))&&j(e,e.output,e.next_out,u-e.avail_out)?(i.mode=31,-4):(c-=e.avail_in,u-=e.avail_out,e.total_in+=c,e.total_out+=u,i.total+=u,i.wrap&&u&&(e.adler=i.check=i.flags?N(i.check,a,u,e.next_out-u):R(i.check,a,u,e.next_out-u)),e.data_type=i.bits+(i.last?64:0)+(12===i.mode?128:0)+(20===i.mode||15===i.mode?256:0),(0===c&&0===u||4===t)&&y===T&&(y=-5),y)},i.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,T},i.inflateGetHeader=function(e,t){var i;return e&&e.state?0==(2&(i=e.state).wrap)?U:((i.head=t).done=!1,T):U},i.inflateSetDictionary=function(e,t){var i,n=t.length;return e&&e.state?0!==(i=e.state).wrap&&11!==i.mode?U:11===i.mode&&R(1,t,n,0)!==i.check?-3:j(e,t,n,n)?(i.mode=31,-4):(i.havedict=1,T):U},i.inflateInfo="pako inflate (from Nodeca project)";},{"../utils/common":1,"./adler32":3,"./crc32":5,"./inffast":7,"./inftrees":9}],9:[function(e,t,i){var I=e("../utils/common"),D=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],T=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],F=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,i,n,a,r,o,s){var f,l,d,c,u,h,b,m,w,k=s.bits,_=0,g=0,v=0,p=0,x=0,y=0,S=0,E=0,Z=0,B=0,A=null,z=0,R=new I.Buf16(16),N=new I.Buf16(16),O=null,C=0;for(_=0;_<=15;_++)R[_]=0;for(g=0;g<n;g++)R[t[i+g]]++;for(x=k,p=15;1<=p&&0===R[p];p--);if(p<x&&(x=p),0===p)return a[r++]=20971520,a[r++]=20971520,s.bits=1,0;for(v=1;v<p&&0===R[v];v++);for(x<v&&(x=v),_=E=1;_<=15;_++)if(E<<=1,(E-=R[_])<0)return -1;if(0<E&&(0===e||1!==p))return -1;for(N[1]=0,_=1;_<15;_++)N[_+1]=N[_]+R[_];for(g=0;g<n;g++)0!==t[i+g]&&(o[N[t[i+g]]++]=g);if(0===e?(A=O=o,h=19):1===e?(A=D,z-=257,O=T,C-=257,h=256):(A=U,O=F,h=-1),_=v,u=r,S=g=B=0,d=-1,c=(Z=1<<(y=x))-1,1===e&&852<Z||2===e&&592<Z)return 1;for(;;){for(b=_-S,o[g]<h?(m=0,w=o[g]):o[g]>h?(m=O[C+o[g]],w=A[z+o[g]]):(m=96,w=0),f=1<<_-S,v=l=1<<y;a[u+(B>>S)+(l-=f)]=b<<24|m<<16|w|0,0!==l;);for(f=1<<_-1;B&f;)f>>=1;if(0!==f?(B&=f-1,B+=f):B=0,g++,0==--R[_]){if(_===p)break;_=t[i+o[g]];}if(x<_&&(B&c)!==d){for(0===S&&(S=x),u+=v,E=1<<(y=_-S);y+S<p&&!((E-=R[y+S])<=0);)y++,E<<=1;if(Z+=1<<y,1===e&&852<Z||2===e&&592<Z)return 1;a[d=B&c]=x<<24|y<<16|u-r|0;}}return 0!==B&&(a[u+B]=_-S<<24|64<<16|0),s.bits=x,0};},{"../utils/common":1}],10:[function(e,t,i){t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};},{}],11:[function(e,t,i){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0;};},{}],"/lib/inflate.js":[function(e,t,i){var c=e("./zlib/inflate"),u=e("./utils/common"),h=e("./utils/strings"),b=e("./zlib/constants"),n=e("./zlib/messages"),a=e("./zlib/zstream"),r=e("./zlib/gzheader"),m=Object.prototype.toString;function o(e){if(!(this instanceof o))return new o(e);this.options=u.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new a,this.strm.avail_out=0;var i=c.inflateInit2(this.strm,t.windowBits);if(i!==b.Z_OK)throw new Error(n[i]);if(this.header=new r,c.inflateGetHeader(this.strm,this.header),t.dictionary&&("string"==typeof t.dictionary?t.dictionary=h.string2buf(t.dictionary):"[object ArrayBuffer]"===m.call(t.dictionary)&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(i=c.inflateSetDictionary(this.strm,t.dictionary))!==b.Z_OK))throw new Error(n[i])}function s(e,t){var i=new o(t);if(i.push(e,!0),i.err)throw i.msg||n[i.err];return i.result}o.prototype.push=function(e,t){var i,n,a,r,o,s=this.strm,f=this.options.chunkSize,l=this.options.dictionary,d=!1;if(this.ended)return !1;n=t===~~t?t:!0===t?b.Z_FINISH:b.Z_NO_FLUSH,"string"==typeof e?s.input=h.binstring2buf(e):"[object ArrayBuffer]"===m.call(e)?s.input=new Uint8Array(e):s.input=e,s.next_in=0,s.avail_in=s.input.length;do{if(0===s.avail_out&&(s.output=new u.Buf8(f),s.next_out=0,s.avail_out=f),(i=c.inflate(s,b.Z_NO_FLUSH))===b.Z_NEED_DICT&&l&&(i=c.inflateSetDictionary(this.strm,l)),i===b.Z_BUF_ERROR&&!0===d&&(i=b.Z_OK,d=!1),i!==b.Z_STREAM_END&&i!==b.Z_OK)return this.onEnd(i),!(this.ended=!0);s.next_out&&(0!==s.avail_out&&i!==b.Z_STREAM_END&&(0!==s.avail_in||n!==b.Z_FINISH&&n!==b.Z_SYNC_FLUSH)||("string"===this.options.to?(a=h.utf8border(s.output,s.next_out),r=s.next_out-a,o=h.buf2string(s.output,a),s.next_out=r,s.avail_out=f-r,r&&u.arraySet(s.output,s.output,a,r,0),this.onData(o)):this.onData(u.shrinkBuf(s.output,s.next_out)))),0===s.avail_in&&0===s.avail_out&&(d=!0);}while((0<s.avail_in||0===s.avail_out)&&i!==b.Z_STREAM_END);return i===b.Z_STREAM_END&&(n=b.Z_FINISH),n===b.Z_FINISH?(i=c.inflateEnd(this.strm),this.onEnd(i),this.ended=!0,i===b.Z_OK):n!==b.Z_SYNC_FLUSH||(this.onEnd(b.Z_OK),!(s.avail_out=0))},o.prototype.onData=function(e){this.chunks.push(e);},o.prototype.onEnd=function(e){e===b.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=u.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},i.Inflate=o,i.inflate=s,i.inflateRaw=function(e,t){return (t=t||{}).raw=!0,s(e,t)},i.ungzip=s;},{"./utils/common":1,"./utils/strings":2,"./zlib/constants":4,"./zlib/gzheader":6,"./zlib/inflate":8,"./zlib/messages":10,"./zlib/zstream":11}]},{},[])("/lib/inflate.js")});
  });

  var sortKeywords = function sortKeywords(list) {
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EMPTY';
    return list.sort(function (prev, next) {
      var valPrev = prev;
      var valNext = next;

      if (key !== 'EMPTY') {
        valPrev = prev[key];
        valNext = next[key];
      }

      if (!valNext) valNext = '';
      if (!valPrev) valPrev = '';

      if (valNext.length > valPrev.length) {
        return 1;
      } else if (valPrev.length > valNext.length) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  var enNameMap = new Map();
  var jpNameMap = new Map();
  var nounMap = new Map();
  var nounFixMap = new Map();
  var caiyunPrefixMap = new Map();
  var loaded$1 = false;
  var nounLoaded = false;

  var checkVersion = function checkVersion(str) {
    if (/^\(v\d+_\d+_\d+\).+/.test(str)) {
      var rgs = str.match(/^\(v(\d+)_(\d+)_(\d+)\)(.+)/);
      return {
        version: [rgs[1], rgs[2], rgs[3]],
        text: rgs[4]
      };
    }

    return false;
  };

  var versionPass = function versionPass(ver) {
    var arr = config.version.split('.');
    var res = [arr[0] - ver[0], arr[1] - ver[1], arr[2] - ver[2]];
    return res[0] > 0 || res[0] === 0 && res[1] > 0 || res[0] === 0 && res[1] === 0 && res[2] >= 0;
  };

  var getNameData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var nameEn, nameJp, listEn, listJp;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$1) {
                _context.next = 12;
                break;
              }

              _context.next = 3;
              return fetchWithHash('/blhxfy/data/npc-name-en.csv');

            case 3:
              nameEn = _context.sent;
              _context.next = 6;
              return fetchWithHash('/blhxfy/data/npc-name-jp.csv');

            case 6:
              nameJp = _context.sent;
              listEn = parseCsv(nameEn);
              listJp = parseCsv(nameJp);
              sortKeywords(listEn, 'name').forEach(function (item) {
                var name = trim(item.name);
                var trans = filter(item.trans);
                enNameMap.set(name, trans);
              });
              sortKeywords(listJp, 'name').forEach(function (item) {
                var name = trim(item.name);
                var trans = filter(item.trans);
                jpNameMap.set(name, trans);
              });
              loaded$1 = true;

            case 12:
              return _context.abrupt("return", {
                enNameMap: enNameMap,
                jpNameMap: jpNameMap
              });

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getNameData() {
      return _ref.apply(this, arguments);
    };
  }();

  var getNounData = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var noun, nounFix, caiyunPrefix, listNoun, listNounFix, listCaiyunPrefix;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (nounLoaded) {
                _context2.next = 17;
                break;
              }

              _context2.next = 3;
              return fetchWithHash('/blhxfy/data/noun.csv');

            case 3:
              noun = _context2.sent;
              _context2.next = 6;
              return fetchWithHash('/blhxfy/data/noun-fix.csv');

            case 6:
              nounFix = _context2.sent;
              _context2.next = 9;
              return fetchWithHash('/blhxfy/data/caiyun-prefix.csv');

            case 9:
              caiyunPrefix = _context2.sent;
              listNoun = parseCsv(noun);
              listNounFix = parseCsv(nounFix);
              listCaiyunPrefix = parseCsv(caiyunPrefix);
              sortKeywords(listNoun, 'keyword').forEach(function (item) {
                var keyword = trim(item.keyword);
                var trans = filter(item.trans);

                if (keyword && trans) {
                  nounMap.set(keyword, {
                    trans: trans,
                    ignoreCase: !item.cs
                  });
                }
              });
              sortKeywords(listNounFix, 'text').forEach(function (item) {
                var text = trim(item.text);
                var fix = filter(item.fixed);

                if (text) {
                  var result = checkVersion(text);

                  if (result) {
                    if (versionPass(result.version)) {
                      nounFixMap.set(result.text, fix);
                    }
                  } else {
                    nounFixMap.set(text, fix);
                  }
                }
              });
              sortKeywords(listCaiyunPrefix, 'text').forEach(function (item) {
                var text = trim(item.text);
                var fix = filter(item.fixed);

                if (text && fix) {
                  caiyunPrefixMap.set(text, fix);
                }
              });
              nounLoaded = true;

            case 17:
              return _context2.abrupt("return", {
                nounMap: nounMap,
                nounFixMap: nounFixMap,
                caiyunPrefixMap: caiyunPrefixMap
              });

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function getNounData() {
      return _ref2.apply(this, arguments);
    };
  }();

  var ignoreList = ['null', '???', '？？？'];
  var sepList = ['・', '&', ' and ', '＆', '／'];

  var getTrans = function getTrans(text, maps) {
    var _iterator = _createForOfIteratorHelper(maps),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var map = _step.value;

        if (map.has(text)) {
          return map.get(text);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return false;
  };

  var transName = function transName(text, maps) {
    var name = trim(text);
    if (ignoreList.includes(name)) return text;
    var trans = getTrans(text, maps);

    if (/.+?\s?[\?？0-9０-９]{1,2}$/.test(name)) {
      var rs = name.match(/(.+?)\s?([\?？0-9０-９]{1,2})$/);
      var transTemp = getTrans(rs[1], maps);
      if (transTemp) trans = "".concat(transTemp).concat(rs[2]);
    } else if (/'s\sVoice$/.test(name)) {
      var nameTemp = name.slice(0, name.length - 8);

      var _transTemp = getTrans(nameTemp, maps);

      if (_transTemp) trans = "".concat(_transTemp, "\u7684\u58F0\u97F3");
    } else if (/の声$/.test(name)) {
      var _nameTemp = name.slice(0, name.length - 2);

      var _transTemp2 = getTrans(_nameTemp, maps);

      if (_transTemp2) trans = "".concat(_transTemp2, "\u7684\u58F0\u97F3");
    } else if (!trans) {
      sepList.forEach(function (sep) {

        if (new RegExp(sep).test(name)) {
          var arr = name.split(sep);
          trans = arr.map(function (nm) {
            var transTemp = getTrans(nm, maps);
            return transTemp || nm;
          }).join(sep);
        }
      });
    }

    return trans || text;
  };

  var template = "\n<style>\n#wrapper .cnt-setting #btn-setting-blhxfy {\n  position: absolute;\n  left: 16px;\n  top: 104px;\n}\n#blhxfy-setting-modal {\n  display: none;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: #f6feff;\n  width: 100%;\n  min-height: 100%;\n  z-index: 99999;\n  padding-bottom: 38px;\n}\n#blhxfy-setting-modal input[type=text] {\n  display: block !important;\n  outline: none;\n  width: 274px;\n  font-size: 12px;\n  padding: 4px;\n  box-shadow: none;\n  border: 1px solid #78bbd8;\n  border-radius: 2px;\n  font-family: sans-serif;\n  color: #4d6671;\n}\n#blhxfy-setting-modal.show {\n  display: block;\n}\n#blhxfy-setting-modal input[type=text]::placeholder {\n  color: #aaa;\n}\n</style>\n<div id=\"blhxfy-setting-modal\">\n<div class=\"cnt-setting\">\n\t<div class=\"prt-setting-header\"><img class=\"img-header\" src=\"https://blhx.danmu9.com/blhxfy/data/static/image/setting-header.jpg\" alt=\"header_public\"></div>\n\n\t<div class=\"prt-setting-module \">\n\t\t<div class=\"txt-setting-title\">\u63D2\u4EF6\u8BBE\u7F6E</div>\n\n\t\t<div class=\"block-story-only prt-button\">\n\t\t<input id=\"story-only-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'story-only', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t<label for=\"story-only-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u53EA\u7FFB\u8BD1\u5267\u60C5</label>\n\t\t</div>\n\n\t\t<div class=\"prt-setting-frame\">\n\t\t\t<div class=\"prt-setting-article\">\n\t\t\t\t<div class=\"txt-article-title\">\u7FFB\u8BD1\u6570\u636E\u57DF\u540D</div>\n\t\t\t\t<ul class=\"txt-article-lead\">\n\t\t\t\t\t<li>\u7559\u7A7A\u5219\u4F7F\u7528\u9ED8\u8BA4\u7684\u6570\u636E\u6E90</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\"prt-button-l\">\n          <input id=\"origin-setting-blhxfy\" oninput=\"window.blhxfy.sendEvent('setting', 'origin', this.value)\" type=\"text\" value=\"\" placeholder=\"https://blhx.danmu9.com\">\n        </div>\n      </div>\n      <div class=\"txt-setting-lead\">\n        \u203B\u4F7F\u7528\u7B2C\u4E09\u65B9\u6570\u636E\u6E90\u6709\u98CE\u9669\uFF0C\u8BF7\u9009\u62E9\u53EF\u4EE5\u4FE1\u4EFB\u7684\u6570\u636E\u6E90\u3002\n      </div>\n\n      <div class=\"prt-setting-article\">\n\t\t\t\t<div class=\"txt-article-title\">\u4E3B\u89D2\u540D</div>\n\t\t\t\t<ul class=\"txt-article-lead\">\n\t\t\t\t\t<li>\u5267\u60C5\u91CC\u663E\u793A\u7684\u4E3B\u89D2\u540D\u5B57\uFF0C\u7559\u7A7A\u5219\u4F7F\u7528\u4F60\u81EA\u5DF1\u7684\u6635\u79F0</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\"prt-button-l\">\n          <input id=\"username-setting-blhxfy\" oninput=\"window.blhxfy.sendEvent('setting', 'username', this.value)\" type=\"text\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u4E3B\u89D2\u540D\">\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"prt-setting-article\">\n\t\t\t\t<div class=\"txt-article-title\">\u673A\u7FFB\u8BBE\u7F6E</div>\n\t\t\t\t<ul class=\"txt-article-lead\">\n\t\t\t\t\t<li>\u5728\u4E00\u4E9B\u4F7F\u7528\u573A\u666F\u4E0B\uFF0C\u53EF\u80FD\u4E0D\u4F1A\u751F\u6548</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\"prt-button\">\n\t\t\t\t\t<div class=\"prt-select-box\" style=\"margin:0 6px 0 0\">\n\t\t\t\t\t\t<div style=\"width:103px\" id=\"trans-api-setting-blhxfy-pulldown\" class=\"prt-list-pulldown btn-sort\">\n\t\t\t\t\t\t\t<div id=\"trans-api-setting-blhxfy-txt\" class=\"txt-selected\">\u5F69\u4E91\u5C0F\u8BD1</div>\n\t\t\t\t\t\t\t<select id=\"trans-api-setting-blhxfy\" class=\"frm-list-select\" onchange=\"window.blhxfy.sendEvent('setting', 'trans-api', this.value)\">\n\t\t\t\t\t\t\t<option value=\"google\">Google\u7FFB\u8BD1</option>\n\t\t\t\t\t\t\t<option value=\"caiyun\" selected>\u5F69\u4E91\u5C0F\u8BD1</option>\n\t\t\t\t\t\t\t</select>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input id=\"trans-ja-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'trans-ja', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"trans-ja-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u65E5\u8BED\u673A\u7FFB</label>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input id=\"trans-en-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'trans-en', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"trans-en-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u82F1\u8BED\u673A\u7FFB</label>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"prt-setting-article\">\n\t\t\t\t<div class=\"txt-article-title\">\u5B57\u4F53\u8BBE\u7F6E</div>\n\t\t\t\t<ul class=\"txt-article-lead\">\n\t\t\t\t\t<li>\u5267\u60C5\u6587\u672C\u4F7F\u7528\u7684\u5B57\u4F53\u3002</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\"prt-button\">\n\t\t\t\t\t<input style=\"width:180px;margin-right:10px\" id=\"font-setting-blhxfy\" oninput=\"window.blhxfy.sendEvent('setting', 'font', this.value)\" type=\"text\" value=\"\" placeholder=\"\u8BF7\u8F93\u5165\u5B57\u4F53\">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input id=\"font-bold-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'font-bold', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label style=\"top:2px\" for=\"font-bold-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u52A0\u7C97</label>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t\t<div class=\"txt-setting-lead\">\n        \u203B\u683C\u5F0F\u540CCSS\u7684font-family\u3002\u586B none \u5219\u4E0D\u4FEE\u6539\u5B57\u4F53\uFF0C\u663E\u793A\u6E38\u620F\u9ED8\u8BA4\u5B57\u4F53\u6548\u679C\u3002\n      </div>\n\n      <div class=\"prt-setting-article\">\n\t\t\t\t<div class=\"txt-article-title\">\u6218\u6597\u754C\u9762\u7684\u6280\u80FD\u7FFB\u8BD1</div>\n\t\t\t\t<ul class=\"txt-article-lead\">\n\t\t\t\t\t<li>\u6FC0\u6D3B\u540E\u5728\u6C49\u5316\u6218\u6597\u754C\u9762\u7684\u6280\u80FD\u6309\u94AE</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\"prt-button-l\">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input id=\"battle-trans-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'battle-trans', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"battle-trans-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u542F\u7528</label>\n\t\t\t\t\t</div>\n        </div>\n\t\t\t</div>\n\n\t\t\t<div class=\"prt-setting-article\">\n\t\t\t\t<div class=\"txt-article-title\">\u5267\u60C5CSV\u6587\u4EF6\u5FEB\u6377\u4E0B\u8F7D</div>\n\t\t\t\t<ul class=\"txt-article-lead\">\n\t\t\t\t\t<li>\u6FC0\u6D3B\u540E\u5728 SKIP \u7684\u65F6\u5019\u81EA\u52A8\u4E0B\u8F7D\u5267\u60C5CSV\uFF08\u6B64\u529F\u80FD\u4EC5\u4F9B\u8BD1\u8005\u4F7F\u7528\uFF0C\u8FD9\u91CC\u7684\u4E0B\u8F7D\u6587\u4EF6\u5E76\u4E0D\u662F\u6307\u52A0\u8F7D\u6570\u636E\uFF09</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\"prt-button-l\">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input id=\"auto-download-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'auto-download', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"auto-download-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u81EA\u52A8\u4E0B\u8F7DCSV</label>\n\t\t\t\t\t</div>\n        </div>\n\t\t\t</div>\n\n\t\t\t<div class=\"prt-setting-article\">\n\t\t\t\t<div class=\"txt-article-title\">\u5176\u4ED6\u8BBE\u7F6E</div>\n\t\t\t\t<ul class=\"txt-article-lead\">\n\t\t\t\t\t<li>\u53EF\u4EE5\u9009\u62E9\u9690\u85CF\u7F51\u9875\u6EDA\u52A8\u6761 / \u9690\u85CFMobage\u4FA7\u8FB9\u680F\uFF08\u4EC5PC\u7F51\u9875\uFF09 / \u5728\u540E\u53F0\u64AD\u653EBGM</li>\n\t\t\t\t</ul>\n\t\t\t\t<div class=\"prt-button\" style=\"flex-wrap: wrap;display: flex;\">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input id=\"remove-scroller-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'remove-scroller', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"remove-scroller-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u9690\u85CF\u6EDA\u52A8\u6761</label>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input id=\"hide-sidebar-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'hide-sidebar', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"hide-sidebar-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u9690\u85CF\u4FA7\u8FB9\u680F</label>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<input id=\"default-font-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'default-font', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"default-font-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u8C03\u6574\u5B57\u4F53</label>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div style=\"margin-top:5px;\">\n\t\t\t\t\t\t<input id=\"keep-bgm-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'keep-bgm', this.checked)\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"keep-bgm-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u4FDD\u6301BGM</label>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div style=\"margin-top:5px;\">\n\t\t\t\t\t\t<input id=\"origin-text-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'origin-text', this.checked);window.blhxfy.sendEvent('setting', 'fast-mode', event);\" type=\"checkbox\" value=\"\" data-post-name=\"scene_fast_text_mode\" name=\"scene-fast-text-mode\">\n\t\t\t\t\t\t<label for=\"origin-text-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u539F\u6587\u5BF9\u7167</label>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div style=\"margin-top:5px;\">\n\t\t\t\t\t\t<input id=\"show-translator-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'show-translator', this.checked);\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"show-translator-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u663E\u793A\u8BD1\u8005</label>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div style=\"margin-top:5px;\">\n\t\t\t\t\t\t<input id=\"log-setting-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'log', this.checked);\" type=\"checkbox\" value=\"\">\n\t\t\t\t\t\t<label for=\"log-setting-blhxfy\" class=\"btn-usual-setting-new adjust-font-s\">\u663E\u793ALog</label>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n      <div class=\"txt-setting-lead\">\n        \u203B\u4FEE\u6539\u7684\u8BBE\u7F6E\u5728\u5237\u65B0\u9875\u9762\u540E\u751F\u6548\n      </div>\n\t\t</div>\n\t</div>\n\n\t<div class=\"prt-lead-link\">\n\t\t<div class=\"lis-lead-prev\" data-href=\"setting\"><div class=\"atx-lead-link\">\u8FD4\u56DE\u8BBE\u7F6E</div></div>\n\t\t<div class=\"lis-lead-prev\" data-href=\"mypage\"><div class=\"atx-lead-link\">\u8FD4\u56DE\u9996\u9875</div></div>\n\t</div>\n</div>\n</div>\n";
  var templateForWheel = "\n<style>\n#blhxfy-setting-modal {\n\theight: 100%;\n\toverflow: auto;\n}\n</style>\n";

  var wheelStopPg = function wheelStopPg(e) {
    e.stopImmediatePropagation();
  };

  function insertSettingHtml (html) {
    html = html.replace('<div class="cnt-setting">', "".concat(template, "<div class=\"cnt-setting\"><div class=\"cnt-setting\"><div class=\"btn-usual-text\" id=\"btn-setting-blhxfy\" onclick=\"window.blhxfy.sendEvent('setting', 'show')\">\u6C49\u5316\u63D2\u4EF6\u8BBE\u7F6E</div>"));

    if (location.hash !== '#setting') {
      html = html.replace('<div class="btn-usual-text" id="btn-setting-blhxfy"', "".concat(templateForWheel, "<div class=\"btn-usual-text\" id=\"btn-setting-blhxfy\""));
      setTimeout(function () {
        var modal = document.getElementById('blhxfy-setting-modal');
        modal.removeEventListener('wheel', wheelStopPg);
        modal.removeEventListener('DOMMouseScroll', wheelStopPg);
        modal.removeEventListener('mousewheel', wheelStopPg);
        modal.addEventListener('wheel', wheelStopPg, false);
        modal.addEventListener('DOMMouseScroll', wheelStopPg, false);
        modal.addEventListener('mousewheel', wheelStopPg, false);
      }, 1000);
    }

    return html;
  }

  var extraHtml = template.replace('data-href="setting"', 'onclick="window.blhxfy.sendEvent(\'setting\', \'hide\')"').replace('返回设置', '返回剧情');
  function insertToolHtml () {
    var html = "\n  <style>\n  @font-face {\n    font-family: 'blhxwf';\n    font-style: normal;\n    font-weight: normal;\n    src: url('".concat(config.origin, "/blhxfy/data/static/webfont.woff2');\n  }\n  .cnt-quest-scene .prt-log-display {\n    padding-top: 74px;\n  }\n  #blhxfy-story-tool {\n    display: none;\n  }\n  #blhxfy-story-tool > div {\n    width: 152px;\n    margin: 7px auto;\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n  }\n  #blhxfy-story-input button,\n  #blhxfy-story-tool button {\n    border: none;\n    background: none;\n    cursor: pointer;\n    padding: 4px 6px;\n    font-size: 10px;\n    margin: 0;\n    letter-spacing: 1px;\n    line-height: 1;\n    outline: none;\n    position: relative;\n    transition: none;\n    border-radius: 3px;\n    background: #539cba;\n    color: #fff;\n    box-shadow: 0 3px #165c85;\n    text-shadow: 1px 1px 2px rgba(0,0,0,0.5)\n  }\n\n  #blhxfy-story-input button:hover,\n  #blhxfy-story-tool button:hover {\n    box-shadow: 0 2px #165c85;\n    top: 1px;\n  }\n  #blhxfy-story-input button:active,\n  #blhxfy-story-tool button:active {\n    box-shadow: 0 1px #165c85;\n    top: 2px;\n  }\n  .log #blhxfy-story-tool {\n    display: block;\n    position: absolute;\n    top: 26px;\n    left: 50%;\n    width: 180px;\n    margin-left: -90px;\n    z-index: 9999;\n    text-align: center;\n  }\n  #blhxfy-story-input {\n    position: absolute;\n    display: none;\n    top: 0;\n    left: 0;\n    width: 320px;\n    height: 100%;\n    background: #fff;\n    z-index: 10000;\n  }\n  .blhxfy-preview-tool {\n    padding-top: 10px;\n    padding-bottom: 10px;\n    border-bottom: 1px solid #e3e3e3;\n    display: flex;\n    justify-content: space-between;\n    padding-left: 10px;\n    padding-right: 10px;\n    background: #116d82;\n  }\n  #blhxfy-story-input p {\n    margin: 10px 10px 0 10px;\n    color: #5b8690;\n    text-align: left;\n    font-size: 10px;\n    position: relative;\n  }\n  #blhxfy-story-input p a {\n    color: #29b82d;\n    position: absolute;\n    cursor: pointer;\n    padding: 4px;\n    right: 0;\n    top: -5px;\n  }\n  #blhxfy-story-input textarea {\n    width: 300px;\n    height: calc(100% - 80px);\n    margin: 10px;\n    box-sizing: border-box;\n    font-size: 8px;\n    padding: 4px;\n    border-radius: 2px;\n    box-shadow: inset 0 0 3px #2c88d775;\n    outline: none;\n    resize: none;\n    font-family: Consolas, \"Microsoft Yahei\";\n  }\n  .language-setting-blhxfy {\n    font-size: 10px;\n    color: #fff;\n    top: 1px;\n    position: relative;\n    font-family: Microsoft Jhenghei;\n  }\n  .language-setting-blhxfy select {\n    border: none;\n    border-radius: 2px;\n  }\n  .blhxfy-story-plaintext {\n    position: absolute;\n    right: -33px;\n    top: 8px;\n    color: #fff;\n    width: auto !important;\n    font-size: 8px;\n  }\n  </style>\n  <div id=\"blhxfy-story-tool\">\n    <div class=\"blhxfy-story-plaintext\">\n      <input id=\"plain-text-blhxfy\" type=\"checkbox\" onchange=\"window.blhxfy.sendEvent('setting', 'plain-text', this.checked)\">\n      <label for=\"plain-text-blhxfy\" style=\"padding-left:2px\" title=\"\u52FE\u9009\u540E\uFF0C\u4E0B\u8F7D\u7684csv\u6587\u4EF6\u4F1A\u53BB\u6389\u91CC\u9762\u7684html\u4EE3\u7801\">\u7EAF\u6587\u672C</label>\n    </div>\n    <div>\n      <button onclick=\"window.blhxfy.sendEvent('dlStoryCsv')\" title=\"\u4E0B\u8F7D\u672A\u7FFB\u8BD1\u7684\u5267\u60C5\u6587\u672C\">\u539F\u6587</button>\n      <button onclick=\"window.blhxfy.sendEvent('dlStoryCsv', 'fill')\" title=\"\u4E0B\u8F7D\u7528\u539F\u6587\u586B\u5145trans\u5217\u7684\u5267\u60C5\u6587\u672C\">\u586B\u5145</button>\n      <button onclick=\"window.blhxfy.sendEvent('dlStoryCsv', 'trans')\" title=\"\u4E0B\u8F7D\u5DF2\u7FFB\u8BD1\u7684\u5267\u60C5\u6587\u672C\">\u8BD1\u6587</button>\n      <button onclick=\"window.blhxfy.sendEvent('previewCsv', 'show')\" title=\"\u586B\u5199\u7FFB\u8BD1\u597D\u7684\u5267\u60C5\u6587\u672C\u6765\u9884\u89C8\">\u9884\u89C8</button>\n    </div>\n    <div>\n      <div class=\"language-setting-blhxfy\">\n        <span>\u8BED\u8A00\uFF1A</span>\n        <select id=\"language-type-blhxfy\" onchange=\"window.blhxfy.sendEvent('setting', 'language', event)\" class=\"frm-list-select frm-post-async is-reload\" data-post-name=\"language_type\">\n          <option value=\"1\">\u65E5\u672C\u8A9E</option>\n          <option value=\"2\">English</option>\n        </select>\n      </div>\n      <button onclick=\"window.blhxfy.sendEvent('setting', 'show')\" title=\"\u63D2\u4EF6\u8BBE\u7F6E\">\u8BBE\u7F6E</button>\n    </div>\n  </div>\n  <div id=\"blhxfy-story-input\">\n    <div class=\"blhxfy-preview-tool\">\n      <button onclick=\"window.blhxfy.sendEvent('previewCsv', 'hide')\">\u53D6\u6D88</button>\n      <button onclick=\"window.blhxfy.sendEvent('previewCsv', 'save')\" title=\"\u4FDD\u5B58\u9884\u89C8\u6587\u672C\u5E76\u5237\u65B0\u9875\u9762\">\u4FDD\u5B58</button>\n    </div>\n    <p>\u8BF7\u5C06\u7F16\u8F91\u597D\u7684\u5267\u60C5\u6587\u672C\u7C98\u8D34\u5230\u6587\u672C\u6846<a onclick=\"window.blhxfy.sendEvent('previewCsv', 'clear')\" title=\"\u6E05\u9664\u9884\u89C8\u6587\u672C\">\u6E05\u7A7A</a></p>\n    <textarea placeholder=\"\u5267\u60C5\u6587\u672C\"></textarea>\n  </div>\n  <link type=\"text/css\" rel=\"stylesheet\" href=\"").concat(Game.cssUri, "/setting/index.css\">\n  ").concat(extraHtml, "\n  ");
    var cont = $('.cnt-quest-scene');
    var tool = $('#blhxfy-story-tool');
    if (tool[0]) return;

    if (cont[0]) {
      cont.prepend(html);
      var langVal = {
        ja: 1,
        en: 2
      };
      $('#language-type-blhxfy').val(langVal[Game.lang]);
      $('#plain-text-blhxfy')[0].checked = config.plainText;

      if (config.originText) {
        cont.find('.prt-scene-comment').prepend("<div class=\"blhxfy-btn-origin-text\"></div>");
      }
    }
  }

  function autoDownloadCsv () {
    if (config.autoDownload) {
      var downloaded = false;
      var win = window.unsafeWindow || window;
      $('#wrapper').off('click.blhxfy-dlcsv').on('click.blhxfy-dlcsv', '.cnt-quest-scene .btn-skip', function () {
        setTimeout(function () {
          if (!document.querySelector('.pop-synopsis')) {
            win.blhxfy.sendEvent('dlStoryCsv');
            downloaded = true;
          }
        }, 100);
      });
      $('#wrapper').off('click.blhxfy-dlcsv2').on('click.blhxfy-dlcsv2', '.pop-synopsis .btn-usual-ok', function () {
        if (!downloaded) {
          win.blhxfy.sendEvent('dlStoryCsv');
        }
      });
    }
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_1(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var _assocIndexOf = assocIndexOf;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return _assocIndexOf(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas;

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  var _listCacheSet = listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = _listCacheClear;
  ListCache.prototype['delete'] = _listCacheDelete;
  ListCache.prototype.get = _listCacheGet;
  ListCache.prototype.has = _listCacheHas;
  ListCache.prototype.set = _listCacheSet;

  var _ListCache = ListCache;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new _ListCache;
    this.size = 0;
  }

  var _stackClear = stackClear;

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  var _stackDelete = stackDelete;

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  var _stackGet = stackGet;

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  var _stackHas = stackHas;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject_1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = _root['__core-js_shared__'];

  var _coreJsData = coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  var _isMasked = isMasked;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$1.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype,
      objectProto$3 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$2 = funcProto$2.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$2.call(hasOwnProperty$3).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject_1(value) || _isMasked(value)) {
      return false;
    }
    var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
  }

  var _baseIsNative = baseIsNative;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  /* Built-in method references that are verified to be native. */
  var Map$1 = _getNative(_root, 'Map');

  var _Map = Map$1;

  /* Built-in method references that are verified to be native. */
  var nativeCreate = _getNative(Object, 'create');

  var _nativeCreate = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear;

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (_nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$4.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$5.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$5.call(data, key);
  }

  var _hashHas = hashHas;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = _hashClear;
  Hash.prototype['delete'] = _hashDelete;
  Hash.prototype.get = _hashGet;
  Hash.prototype.has = _hashHas;
  Hash.prototype.set = _hashSet;

  var _Hash = Hash;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new _Hash,
      'map': new (_Map || _ListCache),
      'string': new _Hash
    };
  }

  var _mapCacheClear = mapCacheClear;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  var _isKeyable = isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return _isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  var _getMapData = getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return _getMapData(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return _getMapData(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas;

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = _getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = _mapCacheClear;
  MapCache.prototype['delete'] = _mapCacheDelete;
  MapCache.prototype.get = _mapCacheGet;
  MapCache.prototype.has = _mapCacheHas;
  MapCache.prototype.set = _mapCacheSet;

  var _MapCache = MapCache;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof _ListCache) {
      var pairs = data.__data__;
      if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new _MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  var _stackSet = stackSet;

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new _ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = _stackClear;
  Stack.prototype['delete'] = _stackDelete;
  Stack.prototype.get = _stackGet;
  Stack.prototype.has = _stackHas;
  Stack.prototype.set = _stackSet;

  var _Stack = Stack;

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  var _arrayEach = arrayEach;

  var defineProperty = (function() {
    try {
      var func = _getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  var _defineProperty$1 = defineProperty;

  /**
   * The base implementation of `assignValue` and `assignMergeValue` without
   * value checks.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function baseAssignValue(object, key, value) {
    if (key == '__proto__' && _defineProperty$1) {
      _defineProperty$1(object, key, {
        'configurable': true,
        'enumerable': true,
        'value': value,
        'writable': true
      });
    } else {
      object[key] = value;
    }
  }

  var _baseAssignValue = baseAssignValue;

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$6.hasOwnProperty;

  /**
   * Assigns `value` to `key` of `object` if the existing value is not equivalent
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons.
   *
   * @private
   * @param {Object} object The object to modify.
   * @param {string} key The key of the property to assign.
   * @param {*} value The value to assign.
   */
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$6.call(object, key) && eq_1(objValue, value)) ||
        (value === undefined && !(key in object))) {
      _baseAssignValue(object, key, value);
    }
  }

  var _assignValue = assignValue;

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property identifiers to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Function} [customizer] The function to customize copied values.
   * @returns {Object} Returns `object`.
   */
  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];

      var newValue = customizer
        ? customizer(object[key], source[key], key, object, source)
        : undefined;

      if (newValue === undefined) {
        newValue = source[key];
      }
      if (isNew) {
        _baseAssignValue(object, key, newValue);
      } else {
        _assignValue(object, key, newValue);
      }
    }
    return object;
  }

  var _copyObject = copyObject;

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  var _baseTimes = baseTimes;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$7.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$7.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
    return isObjectLike_1(value) && hasOwnProperty$7.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  var isArguments_1 = isArguments;

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  var stubFalse_1 = stubFalse;

  var isBuffer_1 = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports =  exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse_1;

  module.exports = isBuffer;
  });

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  var _isIndex = isIndex;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  var isLength_1 = isLength;

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag$1 = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag$1 = '[object Object]',
      regexpTag$1 = '[object RegExp]',
      setTag = '[object Set]',
      stringTag$1 = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag$1] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag$1] = typedArrayTags[regexpTag$1] =
  typedArrayTags[setTag] = typedArrayTags[stringTag$1] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike_1(value) &&
      isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
  }

  var _baseIsTypedArray = baseIsTypedArray;

  /* Node.js helper references. */
  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

  var isTypedArray_1 = isTypedArray;

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$8.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_1(value),
        isArg = !isArr && isArguments_1(value),
        isBuff = !isArr && !isArg && isBuffer_1(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? _baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$8.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             _isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  var _arrayLikeKeys = arrayLikeKeys;

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$9;

    return value === proto;
  }

  var _isPrototype = isPrototype;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = _overArg(Object.keys, Object);

  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$9 = objectProto$a.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!_isPrototype(object)) {
      return _nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$9.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeys = baseKeys;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength_1(value.length) && !isFunction_1(value);
  }

  var isArrayLike_1 = isArrayLike;

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
  }

  var keys_1 = keys;

  /**
   * The base implementation of `_.assign` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssign(object, source) {
    return object && _copyObject(source, keys_1(source), object);
  }

  var _baseAssign = baseAssign;

  /**
   * This function is like
   * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * except that it includes inherited enumerable properties.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  var _nativeKeysIn = nativeKeysIn;

  /** Used for built-in method references. */
  var objectProto$b = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$a = objectProto$b.hasOwnProperty;

  /**
   * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeysIn(object) {
    if (!isObject_1(object)) {
      return _nativeKeysIn(object);
    }
    var isProto = _isPrototype(object),
        result = [];

    for (var key in object) {
      if (!(key == 'constructor' && (isProto || !hasOwnProperty$a.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeysIn = baseKeysIn;

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn$1(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
  }

  var keysIn_1 = keysIn$1;

  /**
   * The base implementation of `_.assignIn` without support for multiple sources
   * or `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssignIn(object, source) {
    return object && _copyObject(source, keysIn_1(source), object);
  }

  var _baseAssignIn = baseAssignIn;

  var _cloneBuffer = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports =  exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

  /**
   * Creates a clone of  `buffer`.
   *
   * @private
   * @param {Buffer} buffer The buffer to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Buffer} Returns the cloned buffer.
   */
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

    buffer.copy(result);
    return result;
  }

  module.exports = cloneBuffer;
  });

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  var _copyArray = copyArray;

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  var _arrayFilter = arrayFilter;

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  var stubArray_1 = stubArray;

  /** Used for built-in method references. */
  var objectProto$c = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return _arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable$1.call(object, symbol);
    });
  };

  var _getSymbols = getSymbols;

  /**
   * Copies own symbols of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */
  function copySymbols(source, object) {
    return _copyObject(source, _getSymbols(source), object);
  }

  var _copySymbols = copySymbols;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush$1(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  var _arrayPush = arrayPush$1;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own and inherited enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
    var result = [];
    while (object) {
      _arrayPush(result, _getSymbols(object));
      object = _getPrototype(object);
    }
    return result;
  };

  var _getSymbolsIn = getSymbolsIn;

  /**
   * Copies own and inherited symbols of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy symbols from.
   * @param {Object} [object={}] The object to copy symbols to.
   * @returns {Object} Returns `object`.
   */
  function copySymbolsIn(source, object) {
    return _copyObject(source, _getSymbolsIn(source), object);
  }

  var _copySymbolsIn = copySymbolsIn;

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
  }

  var _baseGetAllKeys = baseGetAllKeys;

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return _baseGetAllKeys(object, keys_1, _getSymbols);
  }

  var _getAllKeys = getAllKeys;

  /**
   * Creates an array of own and inherited enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeysIn(object) {
    return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
  }

  var _getAllKeysIn = getAllKeysIn;

  /* Built-in method references that are verified to be native. */
  var DataView = _getNative(_root, 'DataView');

  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */
  var Promise$1 = _getNative(_root, 'Promise');

  var _Promise = Promise$1;

  /* Built-in method references that are verified to be native. */
  var Set$1 = _getNative(_root, 'Set');

  var _Set = Set$1;

  /* Built-in method references that are verified to be native. */
  var WeakMap$1 = _getNative(_root, 'WeakMap');

  var _WeakMap = WeakMap$1;

  /** `Object#toString` result references. */
  var mapTag$1 = '[object Map]',
      objectTag$2 = '[object Object]',
      promiseTag = '[object Promise]',
      setTag$1 = '[object Set]',
      weakMapTag$1 = '[object WeakMap]';

  var dataViewTag$1 = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = _toSource(_DataView),
      mapCtorString = _toSource(_Map),
      promiseCtorString = _toSource(_Promise),
      setCtorString = _toSource(_Set),
      weakMapCtorString = _toSource(_WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = _baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
      (_Map && getTag(new _Map) != mapTag$1) ||
      (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
      (_Set && getTag(new _Set) != setTag$1) ||
      (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
    getTag = function(value) {
      var result = _baseGetTag(value),
          Ctor = result == objectTag$2 ? value.constructor : undefined,
          ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag$1;
          case mapCtorString: return mapTag$1;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag$1;
          case weakMapCtorString: return weakMapTag$1;
        }
      }
      return result;
    };
  }

  var _getTag = getTag;

  /** Used for built-in method references. */
  var objectProto$d = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$b = objectProto$d.hasOwnProperty;

  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */
  function initCloneArray(array) {
    var length = array.length,
        result = new array.constructor(length);

    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty$b.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  var _initCloneArray = initCloneArray;

  /** Built-in value references. */
  var Uint8Array$1 = _root.Uint8Array;

  var _Uint8Array = Uint8Array$1;

  /**
   * Creates a clone of `arrayBuffer`.
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
    return result;
  }

  var _cloneArrayBuffer = cloneArrayBuffer;

  /**
   * Creates a clone of `dataView`.
   *
   * @private
   * @param {Object} dataView The data view to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned data view.
   */
  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }

  var _cloneDataView = cloneDataView;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /**
   * Creates a clone of `regexp`.
   *
   * @private
   * @param {Object} regexp The regexp to clone.
   * @returns {Object} Returns the cloned regexp.
   */
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }

  var _cloneRegExp = cloneRegExp;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  /**
   * Creates a clone of the `symbol` object.
   *
   * @private
   * @param {Object} symbol The symbol object to clone.
   * @returns {Object} Returns the cloned symbol object.
   */
  function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  }

  var _cloneSymbol = cloneSymbol;

  /**
   * Creates a clone of `typedArray`.
   *
   * @private
   * @param {Object} typedArray The typed array to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the cloned typed array.
   */
  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  var _cloneTypedArray = cloneTypedArray;

  /** `Object#toString` result references. */
  var boolTag$2 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      mapTag$2 = '[object Map]',
      numberTag$1 = '[object Number]',
      regexpTag$2 = '[object RegExp]',
      setTag$2 = '[object Set]',
      stringTag$2 = '[object String]',
      symbolTag = '[object Symbol]';

  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$2 = '[object DataView]',
      float32Tag$1 = '[object Float32Array]',
      float64Tag$1 = '[object Float64Array]',
      int8Tag$1 = '[object Int8Array]',
      int16Tag$1 = '[object Int16Array]',
      int32Tag$1 = '[object Int32Array]',
      uint8Tag$1 = '[object Uint8Array]',
      uint8ClampedTag$1 = '[object Uint8ClampedArray]',
      uint16Tag$1 = '[object Uint16Array]',
      uint32Tag$1 = '[object Uint32Array]';

  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag$1:
        return _cloneArrayBuffer(object);

      case boolTag$2:
      case dateTag$1:
        return new Ctor(+object);

      case dataViewTag$2:
        return _cloneDataView(object, isDeep);

      case float32Tag$1: case float64Tag$1:
      case int8Tag$1: case int16Tag$1: case int32Tag$1:
      case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
        return _cloneTypedArray(object, isDeep);

      case mapTag$2:
        return new Ctor;

      case numberTag$1:
      case stringTag$2:
        return new Ctor(object);

      case regexpTag$2:
        return _cloneRegExp(object);

      case setTag$2:
        return new Ctor;

      case symbolTag:
        return _cloneSymbol(object);
    }
  }

  var _initCloneByTag = initCloneByTag;

  /** Built-in value references. */
  var objectCreate = Object.create;

  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} proto The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  var baseCreate = (function() {
    function object() {}
    return function(proto) {
      if (!isObject_1(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object;
      object.prototype = undefined;
      return result;
    };
  }());

  var _baseCreate = baseCreate;

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    return (typeof object.constructor == 'function' && !_isPrototype(object))
      ? _baseCreate(_getPrototype(object))
      : {};
  }

  var _initCloneObject = initCloneObject;

  /** `Object#toString` result references. */
  var mapTag$3 = '[object Map]';

  /**
   * The base implementation of `_.isMap` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   */
  function baseIsMap(value) {
    return isObjectLike_1(value) && _getTag(value) == mapTag$3;
  }

  var _baseIsMap = baseIsMap;

  /* Node.js helper references. */
  var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

  /**
   * Checks if `value` is classified as a `Map` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a map, else `false`.
   * @example
   *
   * _.isMap(new Map);
   * // => true
   *
   * _.isMap(new WeakMap);
   * // => false
   */
  var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

  var isMap_1 = isMap;

  /** `Object#toString` result references. */
  var setTag$3 = '[object Set]';

  /**
   * The base implementation of `_.isSet` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a set, else `false`.
   */
  function baseIsSet(value) {
    return isObjectLike_1(value) && _getTag(value) == setTag$3;
  }

  var _baseIsSet = baseIsSet;

  /* Node.js helper references. */
  var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

  /**
   * Checks if `value` is classified as a `Set` object.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a set, else `false`.
   * @example
   *
   * _.isSet(new Set);
   * // => true
   *
   * _.isSet(new WeakSet);
   * // => false
   */
  var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

  var isSet_1 = isSet;

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG = 1,
      CLONE_FLAT_FLAG = 2,
      CLONE_SYMBOLS_FLAG = 4;

  /** `Object#toString` result references. */
  var argsTag$2 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      boolTag$3 = '[object Boolean]',
      dateTag$2 = '[object Date]',
      errorTag$1 = '[object Error]',
      funcTag$2 = '[object Function]',
      genTag$1 = '[object GeneratorFunction]',
      mapTag$4 = '[object Map]',
      numberTag$2 = '[object Number]',
      objectTag$3 = '[object Object]',
      regexpTag$3 = '[object RegExp]',
      setTag$4 = '[object Set]',
      stringTag$3 = '[object String]',
      symbolTag$1 = '[object Symbol]',
      weakMapTag$2 = '[object WeakMap]';

  var arrayBufferTag$2 = '[object ArrayBuffer]',
      dataViewTag$3 = '[object DataView]',
      float32Tag$2 = '[object Float32Array]',
      float64Tag$2 = '[object Float64Array]',
      int8Tag$2 = '[object Int8Array]',
      int16Tag$2 = '[object Int16Array]',
      int32Tag$2 = '[object Int32Array]',
      uint8Tag$2 = '[object Uint8Array]',
      uint8ClampedTag$2 = '[object Uint8ClampedArray]',
      uint16Tag$2 = '[object Uint16Array]',
      uint32Tag$2 = '[object Uint32Array]';

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
  cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
  cloneableTags[boolTag$3] = cloneableTags[dateTag$2] =
  cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
  cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
  cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
  cloneableTags[numberTag$2] = cloneableTags[objectTag$3] =
  cloneableTags[regexpTag$3] = cloneableTags[setTag$4] =
  cloneableTags[stringTag$3] = cloneableTags[symbolTag$1] =
  cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
  cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
  cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
  cloneableTags[weakMapTag$2] = false;

  /**
   * The base implementation of `_.clone` and `_.cloneDeep` which tracks
   * traversed objects.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Deep clone
   *  2 - Flatten inherited properties
   *  4 - Clone symbols
   * @param {Function} [customizer] The function to customize cloning.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The parent object of `value`.
   * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result,
        isDeep = bitmask & CLONE_DEEP_FLAG,
        isFlat = bitmask & CLONE_FLAT_FLAG,
        isFull = bitmask & CLONE_SYMBOLS_FLAG;

    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!isObject_1(value)) {
      return value;
    }
    var isArr = isArray_1(value);
    if (isArr) {
      result = _initCloneArray(value);
      if (!isDeep) {
        return _copyArray(value, result);
      }
    } else {
      var tag = _getTag(value),
          isFunc = tag == funcTag$2 || tag == genTag$1;

      if (isBuffer_1(value)) {
        return _cloneBuffer(value, isDeep);
      }
      if (tag == objectTag$3 || tag == argsTag$2 || (isFunc && !object)) {
        result = (isFlat || isFunc) ? {} : _initCloneObject(value);
        if (!isDeep) {
          return isFlat
            ? _copySymbolsIn(value, _baseAssignIn(result, value))
            : _copySymbols(value, _baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = _initCloneByTag(value, tag, isDeep);
      }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new _Stack);
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);

    if (isSet_1(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap_1(value)) {
      value.forEach(function(subValue, key) {
        result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
      });
    }

    var keysFunc = isFull
      ? (isFlat ? _getAllKeysIn : _getAllKeys)
      : (isFlat ? keysIn : keys_1);

    var props = isArr ? undefined : keysFunc(value);
    _arrayEach(props || value, function(subValue, key) {
      if (props) {
        key = subValue;
        subValue = value[key];
      }
      // Recursively populate clone (susceptible to call stack limits).
      _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
    return result;
  }

  var _baseClone = baseClone;

  /** Used to compose bitmasks for cloning. */
  var CLONE_DEEP_FLAG$1 = 1,
      CLONE_SYMBOLS_FLAG$1 = 4;

  /**
   * This method is like `_.clone` except that it recursively clones `value`.
   *
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category Lang
   * @param {*} value The value to recursively clone.
   * @returns {*} Returns the deep cloned value.
   * @see _.clone
   * @example
   *
   * var objects = [{ 'a': 1 }, { 'b': 2 }];
   *
   * var deep = _.cloneDeep(objects);
   * console.log(deep[0] === objects[0]);
   * // => false
   */
  function cloneDeep(value) {
    return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
  }

  var cloneDeep_1 = cloneDeep;

  var CROSS_DOMAIN_REQ = !!window.GM_xmlhttpRequest;

  var request$1 = function request(url, option) {
    var _option$method = option.method,
        method = _option$method === void 0 ? 'GET' : _option$method,
        headers = option.headers,
        _option$responseType = option.responseType,
        responseType = _option$responseType === void 0 ? 'json' : _option$responseType,
        data = option.data,
        _option$cors = option.cors,
        cors = _option$cors === void 0 ? false : _option$cors,
        credentials = option.credentials;

    if (cors) {
      return fetch(url, {
        body: data,
        headers: headers,
        method: method,
        mode: 'cors',
        credentials: credentials
      }).then(function (res) {
        return res.json();
      });
    }

    return new Promise(function (rev, rej) {
      if (!CROSS_DOMAIN_REQ) {
        return rej('GM_XHR MISSING');
      }

      window.GM_xmlhttpRequest({
        method: method,
        url: url,
        headers: headers,
        responseType: responseType,
        data: data,
        onload: function onload(_ref) {
          var status = _ref.status,
              responseText = _ref.responseText,
              statusText = _ref.statusText;

          if (status >= 200 && status < 300) {
            if (responseType === 'json') {
              var obj = JSON.parse(responseText);
              rev(obj);
            } else {
              rev(responseText);
            }
          } else {
            rej(statusText);
          }
        },
        onerror: function onerror(err) {
          rej(err);
        }
      });
    });
  };

  try {
    if (new URLSearchParams({
      q: '+'
    }).get('q') !== '+' || new URLSearchParams('q=%2B').get('q') !== '+') throw {};
  } catch (error) {
    window.URLSearchParams = void 0;
  }

  var urlSearchParams_node = createCommonjsModule(function (module) {

  function URLSearchParams(query) {
    var
      index, key, value,
      pairs, i, length,
      dict = Object.create(null)
    ;
    this[secret] = dict;
    if (!query) return;
    if (typeof query === 'string') {
      if (query.charAt(0) === '?') {
        query = query.slice(1);
      }
      for (
        pairs = query.split('&'),
        i = 0,
        length = pairs.length; i < length; i++
      ) {
        value = pairs[i];
        index = value.indexOf('=');
        if (-1 < index) {
          appendTo(
            dict,
            decode(value.slice(0, index)),
            decode(value.slice(index + 1))
          );
        } else if (value.length){
          appendTo(
            dict,
            decode(value),
            ''
          );
        }
      }
    } else {
      if (isArray(query)) {
        for (
          i = 0,
          length = query.length; i < length; i++
        ) {
          value = query[i];
          appendTo(dict, value[0], value[1]);
        }
      } else if (query.forEach) {
        query.forEach(addEach, dict);
      } else {
        for (key in query) {
           appendTo(dict, key, query[key]);
        }
      }
    }
  }

  var
    isArray = Array.isArray,
    URLSearchParamsProto = URLSearchParams.prototype,
    find = /[!'\(\)~]|%20|%00/g,
    plus = /\+/g,
    replace = {
      '!': '%21',
      "'": '%27',
      '(': '%28',
      ')': '%29',
      '~': '%7E',
      '%20': '+',
      '%00': '\x00'
    },
    replacer = function (match) {
      return replace[match];
    },
    secret = '__URLSearchParams__:' + Math.random()
  ;

  function addEach(value, key) {
    /* jshint validthis:true */
    appendTo(this, key, value);
  }

  function appendTo(dict, name, value) {
    var res = isArray(value) ? value.join(',') : value;
    if (name in dict)
      dict[name].push(res);
    else
      dict[name] = [res];
  }

  function decode(str) {
    return decodeURIComponent(str.replace(plus, ' '));
  }

  function encode(str) {
    return encodeURIComponent(str).replace(find, replacer);
  }

  URLSearchParamsProto.append = function append(name, value) {
    appendTo(this[secret], name, value);
  };

  URLSearchParamsProto.delete = function del(name) {
    delete this[secret][name];
  };

  URLSearchParamsProto.get = function get(name) {
    var dict = this[secret];
    return name in dict ? dict[name][0] : null;
  };

  URLSearchParamsProto.getAll = function getAll(name) {
    var dict = this[secret];
    return name in dict ? dict[name].slice(0) : [];
  };

  URLSearchParamsProto.has = function has(name) {
    return name in this[secret];
  };

  URLSearchParamsProto.set = function set(name, value) {
    this[secret][name] = ['' + value];
  };

  URLSearchParamsProto.forEach = function forEach(callback, thisArg) {
    var dict = this[secret];
    Object.getOwnPropertyNames(dict).forEach(function(name) {
      dict[name].forEach(function(value) {
        callback.call(thisArg, value, name, this);
      }, this);
    }, this);
  };

  /*
  URLSearchParamsProto.toBody = function() {
    return new Blob(
      [this.toString()],
      {type: 'application/x-www-form-urlencoded'}
    );
  };
  */

  URLSearchParamsProto.toJSON = function toJSON() {
    return {};
  };

  URLSearchParamsProto.toString = function toString() {
    var dict = this[secret], query = [], i, key, name, value;
    for (key in dict) {
      name = encode(key);
      for (
        i = 0,
        value = dict[key];
        i < value.length; i++
      ) {
        query.push(name + '=' + encode(value[i]));
      }
    }
    return query.join('&');
  };

  URLSearchParams = (module.exports = commonjsGlobal.URLSearchParams || URLSearchParams);

  (function (URLSearchParamsProto) {

    var iterable = (function () {
      try {
        return !!Symbol.iterator;
      } catch(error) {
        return false;
      }
    }());

    // mostly related to issue #24
    if (!('forEach' in URLSearchParamsProto)) {
      URLSearchParamsProto.forEach = function forEach(callback, thisArg) {
        var names = Object.create(null);
        this.toString()
            .replace(/=[\s\S]*?(?:&|$)/g, '=')
            .split('=')
            .forEach(function (name) {
              if (!name.length || name in names) return;
              (names[name] = this.getAll(name)).forEach(function(value) {
                callback.call(thisArg, value, name, this);
              }, this);
            }, this);
      };
    }

    if (!('keys' in URLSearchParamsProto)) {
      URLSearchParamsProto.keys = function keys() {
        var items = [];
        this.forEach(function(value, name) { items.push(name); });
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value};
          }
        };

        if (iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }

        return iterator;
      };
    }

    if (!('values' in URLSearchParamsProto)) {
      URLSearchParamsProto.values = function values() {
        var items = [];
        this.forEach(function(value) { items.push(value); });
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value};
          }
        };

        if (iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }

        return iterator;
      };
    }

    if (!('entries' in URLSearchParamsProto)) {
      URLSearchParamsProto.entries = function entries() {
        var items = [];
        this.forEach(function(value, name) { items.push([name, value]); });
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value};
          }
        };

        if (iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }

        return iterator;
      };
    }

    if (iterable && !(Symbol.iterator in URLSearchParamsProto)) {
      URLSearchParamsProto[Symbol.iterator] = URLSearchParamsProto.entries;
    }

    if (!('sort' in URLSearchParamsProto)) {
      URLSearchParamsProto.sort = function sort() {
        var
          entries = this.entries(),
          entry = entries.next(),
          done = entry.done,
          keys = [],
          values = Object.create(null),
          i, key, value
        ;
        while (!done) {
          value = entry.value;
          key = value[0];
          keys.push(key);
          if (!(key in values)) {
            values[key] = [];
          }
          values[key].push(value[1]);
          entry = entries.next();
          done = entry.done;
        }
        // not the champion in efficiency
        // but these two bits just do the job
        keys.sort();
        for (i = 0; i < keys.length; i++) {
          this.delete(keys[i]);
        }
        for (i = 0; i < keys.length; i++) {
          key = keys[i];
          this.append(key, values[key].shift());
        }
      };
    }

  }(URLSearchParams.prototype));
  });

  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // added together as a 64bit int (as an array of two 32bit ints).
  //
  var x64Add = function x64Add(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
  }; //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // multiplied together as a 64bit int (as an array of two 32bit ints).
  //


  var x64Multiply = function x64Multiply(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
    o[0] &= 0xffff;
    return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
  }; //
  // Given a 64bit int (as an array of two 32bit ints) and an int
  // representing a number of bit positions, returns the 64bit int (as an
  // array of two 32bit ints) rotated left by that number of positions.
  //


  var x64Rotl = function x64Rotl(m, n) {
    n %= 64;

    if (n === 32) {
      return [m[1], m[0]];
    } else if (n < 32) {
      return [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n];
    } else {
      n -= 32;
      return [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n];
    }
  }; //
  // Given a 64bit int (as an array of two 32bit ints) and an int
  // representing a number of bit positions, returns the 64bit int (as an
  // array of two 32bit ints) shifted left by that number of positions.
  //


  var x64LeftShift = function x64LeftShift(m, n) {
    n %= 64;

    if (n === 0) {
      return m;
    } else if (n < 32) {
      return [m[0] << n | m[1] >>> 32 - n, m[1] << n];
    } else {
      return [m[1] << n - 32, 0];
    }
  }; //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // xored together as a 64bit int (as an array of two 32bit ints).
  //


  var x64Xor = function x64Xor(m, n) {
    return [m[0] ^ n[0], m[1] ^ n[1]];
  }; //
  // Given a block, returns murmurHash3's final x64 mix of that block.
  // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
  // only place where we need to right shift 64bit ints.)
  //


  var x64Fmix = function x64Fmix(h) {
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    return h;
  }; //
  // Given a string and an optional seed as an int, returns a 128 bit
  // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
  //


  var x64hash128 = function x64hash128(key, seed) {
    key = key || '';
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];

    for (var i = 0; i < bytes; i = i + 16) {
      k1 = [key.charCodeAt(i + 4) & 0xff | (key.charCodeAt(i + 5) & 0xff) << 8 | (key.charCodeAt(i + 6) & 0xff) << 16 | (key.charCodeAt(i + 7) & 0xff) << 24, key.charCodeAt(i) & 0xff | (key.charCodeAt(i + 1) & 0xff) << 8 | (key.charCodeAt(i + 2) & 0xff) << 16 | (key.charCodeAt(i + 3) & 0xff) << 24];
      k2 = [key.charCodeAt(i + 12) & 0xff | (key.charCodeAt(i + 13) & 0xff) << 8 | (key.charCodeAt(i + 14) & 0xff) << 16 | (key.charCodeAt(i + 15) & 0xff) << 24, key.charCodeAt(i + 8) & 0xff | (key.charCodeAt(i + 9) & 0xff) << 8 | (key.charCodeAt(i + 10) & 0xff) << 16 | (key.charCodeAt(i + 11) & 0xff) << 24];
      k1 = x64Multiply(k1, c1);
      k1 = x64Rotl(k1, 31);
      k1 = x64Multiply(k1, c2);
      h1 = x64Xor(h1, k1);
      h1 = x64Rotl(h1, 27);
      h1 = x64Add(h1, h2);
      h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
      k2 = x64Multiply(k2, c2);
      k2 = x64Rotl(k2, 33);
      k2 = x64Multiply(k2, c1);
      h2 = x64Xor(h2, k2);
      h2 = x64Rotl(h2, 31);
      h2 = x64Add(h2, h1);
      h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }

    k1 = [0, 0];
    k2 = [0, 0];

    switch (remainder) {
      case 15:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48));
      // fallthrough

      case 14:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40));
      // fallthrough

      case 13:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32));
      // fallthrough

      case 12:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24));
      // fallthrough

      case 11:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16));
      // fallthrough

      case 10:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8));
      // fallthrough

      case 9:
        k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)]);
        k2 = x64Multiply(k2, c2);
        k2 = x64Rotl(k2, 33);
        k2 = x64Multiply(k2, c1);
        h2 = x64Xor(h2, k2);
      // fallthrough

      case 8:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56));
      // fallthrough

      case 7:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48));
      // fallthrough

      case 6:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40));
      // fallthrough

      case 5:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32));
      // fallthrough

      case 4:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24));
      // fallthrough

      case 3:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16));
      // fallthrough

      case 2:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8));
      // fallthrough

      case 1:
        k1 = x64Xor(k1, [0, key.charCodeAt(i)]);
        k1 = x64Multiply(k1, c1);
        k1 = x64Rotl(k1, 31);
        k1 = x64Multiply(k1, c2);
        h1 = x64Xor(h1, k1);
      // fallthrough
    }

    h1 = x64Xor(h1, [0, key.length]);
    h2 = x64Xor(h2, [0, key.length]);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    h1 = x64Fmix(h1);
    h2 = x64Fmix(h2);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    return ('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8);
  };

  var bid = '';
  var uid = '';
  var pid = '';
  var auth = null;
  var limited = false;

  var setBid = function setBid() {
    var str = '0123456789abcdefghijklmnopqrstuvwxyz';
    var text = '';

    for (var i = 0; i < 33; i++) {
      text += str[Math.floor(Math.random() * str.length)];
    }

    bid = x64hash128(text, 31);
    localStorage.setItem('blhxfy:bid', bid);
  };

  try {
    bid = localStorage.getItem('blhxfy:bid');
  } catch (e) {}

  if (!bid) {
    setBid();
  }

  var getAuth = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var res;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return request$1('https://api.interpreter.caiyunai.com/v1/page/auth', {
                cors: true,
                method: 'POST',
                headers: {
                  'X-Authorization': "token ".concat(fetchInfo.data.cyweb_token),
                  'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                  browser_id: bid,
                  device_id: '',
                  os_type: 'web',
                  title: 'グランブルーファンタジー',
                  url: document.URL,
                  user_id: uid
                })
              });

            case 2:
              res = _context2.sent;

              if (res.auth_type === -1 || !res.page_id) {
                limited = true;
                setBid();
              } else {
                pid = res.page_id;
              }

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function getAuth() {
      return _ref2.apply(this, arguments);
    };
  }();

  var translator = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(list) {
      var from,
          res,
          _args3 = arguments;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              from = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 'ja';
              _context3.next = 3;
              return getAuth();

            case 3:
              _context3.next = 5;
              return auth;

            case 5:
              if (!limited) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt("return", ['caiyunoutoflimit']);

            case 7:
              _context3.next = 9;
              return request$1('https://api.interpreter.caiyunai.com/v1/page/translator', {
                cors: true,
                method: 'POST',
                headers: {
                  'X-Authorization': "token ".concat(fetchInfo.data.cyweb_token),
                  'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                  cached: true,
                  os_type: 'web',
                  page_id: pid,
                  replaced: true,
                  request_id: bid || uid,
                  source: list,
                  trans_type: "".concat(from, "2zh"),
                  url: document.URL
                })
              });

            case 9:
              res = _context3.sent;

              if (!(res && res.target)) {
                _context3.next = 12;
                break;
              }

              return _context3.abrupt("return", res.target.map(function (item) {
                return item.target;
              }));

            case 12:
              return _context3.abrupt("return", []);

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function translator(_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  var joinBr = function joinBr(list, br, transArr) {
    br.forEach(function (count) {
      var i = count;
      var str = '';

      while (i >= 0) {
        i--;

        var _str = list.shift();

        str += _str + '\n';
      }

      if (str) {
        transArr.push(str.slice(0, str.length - 1));
      }
    });
  };

  var getTransResult = function getTransResult(data) {
    if (data[0] && data[0].length) {
      var result = data[0].map(function (item) {
        return item[0];
      });
      return result.join('').split('\n');
    }

    return [];
  };

  var trim$1 = function trim(str) {
    if (!str) return '';

    var _str = str.replace(/[\u0020]+$/g, '');

    return _str.replace(/^[\u0020]+/g, '');
  };

  var fixWrap = function fixWrap(str) {
    return trim$1(str).replace(/\r/g, '\n').replace(/\n{2,}/g, '\n');
  };

  var joinText = function joinText(list) {
    var br = [];

    var _list = list.map(function (text) {
      return removeHtmlTag(fixWrap(text));
    });

    _list.forEach(function (text) {
      var count = _toConsumableArray(text).filter(function (l) {
        return l === '\n';
      }).length;

      br.push(count);
    });

    var query = _list.join('\n');

    return [query, br];
  };

  var splitText = function splitText(text) {
    var WORDS_LIMIT = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4000;
    var strTemp = '';
    var arr = [];
    var count = 0;
    text.split('\n').forEach(function (txt) {
      strTemp += txt;
      count += new Blob([txt]).size;

      if (count > WORDS_LIMIT) {
        arr.push(strTemp);
        count = 0;
        strTemp = '';
      } else {
        strTemp += '\n';
      }
    });

    if (strTemp) {
      arr.push(strTemp.replace(/\n$/, ''));
    }

    return arr;
  };

  var googleApi = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(keyword) {
      var from,
          query,
          data,
          res,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              from = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'ja';
              query = new urlSearchParams_node({
                client: 'gtx',
                sl: from,
                tl: 'zh-CN',
                hl: 'zh-CN',
                ie: 'UTF-8',
                oe: 'UTF-8'
              });
              query = query.toString();
              ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].forEach(function (item) {
                query += "&dt=".concat(item);
              });
              data = new urlSearchParams_node({
                q: keyword
              });
              _context.next = 7;
              return request$1("https://translate.google.cn/translate_a/single?".concat(query), {
                data: data.toString(),
                method: 'POST',
                headers: {
                  'accept': '*/*',
                  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  'referer': 'https://translate.google.cn',
                  'origin': 'https://translate.google.cn'
                }
              });

            case 7:
              res = _context.sent;
              return _context.abrupt("return", getTransResult(res));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function googleApi(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var googleTrans = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(source) {
      var from,
          _joinText,
          _joinText2,
          query,
          br,
          textArr,
          result,
          list,
          transArr,
          _args2 = arguments;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              from = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 'ja';
              _context2.prev = 1;
              _joinText = joinText(source), _joinText2 = _slicedToArray(_joinText, 2), query = _joinText2[0], br = _joinText2[1];
              textArr = splitText(query);
              _context2.next = 6;
              return Promise.all(textArr.map(function (query) {
                return googleApi(query, from);
              }));

            case 6:
              result = _context2.sent;
              list = result.reduce(function (a, b) {
                return a.concat(b);
              });
              transArr = [];
              joinBr(list, br, transArr);
              return _context2.abrupt("return", transArr);

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](1);
              console.log(_context2.t0);
              return _context2.abrupt("return", []);

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 13]]);
    }));

    return function googleTrans(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var caiyunTrans = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(source, from) {
      var _joinText3, _joinText4, query, br, textArr, result, list, transArr;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _joinText3 = joinText(source), _joinText4 = _slicedToArray(_joinText3, 2), query = _joinText4[0], br = _joinText4[1];
              textArr = splitText(query);
              _context3.next = 5;
              return Promise.all(textArr.map(function (query) {
                return translator(query.split('\n'), from);
              }));

            case 5:
              result = _context3.sent;
              list = result.reduce(function (a, b) {
                return a.concat(b);
              });
              transArr = [];
              joinBr(list, br, transArr);
              return _context3.abrupt("return", transArr);

            case 12:
              _context3.prev = 12;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);
              return _context3.abrupt("return", []);

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 12]]);
    }));

    return function caiyunTrans(_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }();

  function transApi () {
    return _ref4.apply(this, arguments);
  }

  function _ref4() {
    _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var _args4 = arguments;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(config.transApi === 'caiyun')) {
                _context4.next = 4;
                break;
              }

              return _context4.abrupt("return", caiyunTrans.apply(void 0, _args4));

            case 4:
              if (!(config.transApi === 'google')) {
                _context4.next = 6;
                break;
              }

              return _context4.abrupt("return", googleTrans.apply(void 0, _args4));

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _ref4.apply(this, arguments);
  }

  var insertCSS$1 = function insertCSS(fontValue) {
    var font = '';
    if (fontValue && fontValue !== 'none') font = "".concat(fontValue, ", ");
    var style = document.createElement('style');
    style.innerHTML = ".prt-scene-comment :not(.blhxfy-origin-text), .prt-pop-synopsis, .prt-log-display, .btn-select-baloon {\n    font-family: ".concat(font).concat(Game.ua.os.name === 'Windows' ? 'blhxwf, ' : '', "nickname_scene, \"FOT-\u30CB\u30E5\u30FC\u30B7\u30CD\u30DEA Std D\", \"Average Sans\", sans-serif !important;\n  }");
    document.head.appendChild(style);
  };

  var setBold = function setBold() {
    var style = document.createElement('style');
    style.innerHTML = ".prt-scene-comment, .prt-log-display, .btn-select-baloon {\n    font-weight: bold;\n  }";
    document.head.appendChild(style);
  };

  var scenarioFont = function scenarioFont() {
    if (!config.font) {
      if (Game.ua.os.name === 'Windows') {
        insertCSS$1('none');
      } else {
        insertCSS$1('none');
      }
    } else if (config.font !== 'none') {
      insertCSS$1(config.font);
    }

    if (config.fontBold) setBold();
  };

  var txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt', 'sel5_txt', 'sel6_txt'];
  var scenarioCache = {
    data: null,
    name: '',
    originName: '',
    hasTrans: false,
    hasAutoTrans: false,
    csv: '',
    nameMap: null,
    transMap: null
  };

  var collectTxt = function collectTxt(data) {
    var txtList = [];
    var infoList = [];

    var getTxt = function getTxt(obj, key, index) {
      var txt = obj[key];

      if (txt) {
        txtList.push(txt.replace(/\n/g, '').trim());
        infoList.push({
          id: obj.id,
          type: key,
          index: index
        });
      }
    };

    data.forEach(function (item, index) {
      txtKeys.forEach(function (key) {
        return getTxt(item, key, index);
      });
    });
    return {
      txtList: txtList,
      infoList: infoList
    };
  };

  var getStartIndex = function getStartIndex(data) {
    var findStart = function findStart(item, index) {
      if (!item) return false;

      if (item.detail) {
        return index;
      } else if (item.next) {
        var next = item.next | 0 || -1;
        return findStart(data[next], next);
      } else {
        return findStart(data[index + 1], index + 1);
      }
    };

    return findStart(data[0], 0);
  };

  var transMulti = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(list, nameMap, nounMap, nounFixMap, caiyunPrefixMap) {
      var userName, lang, _list, transList, fixedList;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              userName = config.userName;
              lang = Game.lang;
              _list = list.map(function (txt) {
                if (config.transApi === 'google') {
                  if (lang === 'en') {
                    txt = replaceWords(txt, nameMap, lang);
                  }

                  txt = replaceWords(txt, nounMap, lang);
                } else if (config.transApi === 'caiyun') {
                  txt = replaceWords(txt, caiyunPrefixMap, lang);
                }

                if (userName) {
                  var _lang = lang;
                  if (!/^\w+$/.test(userName)) _lang = 'unknown';

                  if (lang === 'en') {
                    txt = replaceWords(txt, new Map([[userName, config.defaultEnName]]), _lang);
                  } else if (config.transApi !== 'google') {
                    txt = replaceWords(txt, new Map([[userName, config.defaultName]]), _lang);
                  }
                }

                return txt;
              });
              _context.next = 5;
              return transApi(_list, lang);

            case 5:
              transList = _context.sent;

              if (!(transList[0] === 'caiyunoutoflimit')) {
                _context.next = 8;
                break;
              }

              return _context.abrupt("return", transList);

            case 8:
              fixedList = transList.map(function (txt) {
                var _str = txt;

                if (_str) {
                  _str = _str.replace(/\n/g, '<br>');
                  _str = replaceWords(_str, nounFixMap, lang);

                  if (config.displayName || userName) {
                    var name = config.displayName || userName;

                    if (lang === 'en') {
                      _str = _str.replace(new RegExp("".concat(config.defaultEnName), 'g'), name);
                    }

                    _str = _str.replace(new RegExp("".concat(config.defaultName, "(\u5148\u751F|\u5C0F\u59D0)?"), 'g'), name);
                  }
                }

                return _str;
              });
              return _context.abrupt("return", fixedList);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function transMulti(_x, _x2, _x3, _x4, _x5) {
      return _ref.apply(this, arguments);
    };
  }();

  var scenarioData;

  var getScenario = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
      var csv, binaryString, pathname, list, transMap;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              csv = getPreviewCsv(name);

              if (csv) {
                _context2.next = 13;
                break;
              }

              if (scenarioData) {
                _context2.next = 7;
                break;
              }

              _context2.next = 5;
              return fetchWithHash('/blhxfy/data/story-map.json');

            case 5:
              binaryString = _context2.sent;
              scenarioData = JSON.parse(pako_inflate_min.inflate(binaryString, {
                to: 'string'
              }));

            case 7:
              pathname = scenarioData[name];

              if (pathname) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt("return", {
                transMap: null,
                csv: ''
              });

            case 10:
              _context2.next = 12;
              return fetchWithHash("/blhxfy/data/story/".concat(pathname));

            case 12:
              csv = _context2.sent;

            case 13:
              list = parseCsv(csv);
              transMap = new Map();
              list.forEach(function (item) {
                if (item.id) {
                  var idArr = item.id.split('-');
                  var id = idArr[0];
                  var type = idArr[1] || 'detail';
                  var obj = transMap.get(id) || {};

                  if (item.trans) {
                    var rep = new RegExp(config.defaultName, 'g');
                    var uname = config.displayName || config.userName;
                    var str = filter(item.trans.replace(rep, uname));
                    obj[type] = str.replace(/<span\sclass="nickname"><\/span>/g, "<span class='nickname'></span>");
                  }

                  obj["".concat(type, "-origin")] = item.trans;
                  transMap.set(id, obj);
                }
              });
              return _context2.abrupt("return", {
                transMap: transMap,
                csv: csv
              });

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function getScenario(_x6) {
      return _ref2.apply(this, arguments);
    };
  }();

  var collectNameHtml = function collectNameHtml(str) {
    if (!str) return str;
    var name = str;
    var html = '';
    var rgs = name.match(/<[^>]+>([^<]*)<\/[^>]+>/);

    if (rgs && rgs[1]) {
      name = rgs[1];
      html = str.replace(name, '$name');
    }

    return {
      name: name,
      html: html
    };
  };

  var replaceChar = function replaceChar(key, item, map) {
    var nameStr = item[key] ? item[key].trim() : '';

    var _collectNameHtml = collectNameHtml(nameStr),
        name = _collectNameHtml.name,
        html = _collectNameHtml.html;

    var trans;

    if (name && name === config.userName && config.displayName) {
      trans = config.displayName;
    } else {
      trans = transName(name, [map]);
    }

    if (trans !== name) {
      if (html) {
        trans = html.replace('$name', trans);
      }

      item[key] = trans;
    }
  };

  var getUsernameFromTutorial = function getUsernameFromTutorial(data) {
    var _iterator = _createForOfIteratorHelper(data),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        var id = parseInt(item.id);

        if (id === 25 || id === 24) {
          if (item.charcter1_name) {
            config.userName = item.charcter1_name;
            localStorage.setItem('blhxfy:name', config.userName);
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  var transStart = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, pathname) {
      var pathRst, sNameTemp, rst, startIndex, scenarioName, _yield$getScenario, transMap, csv, nameData, nameMap, _yield$getNounData, nounMap, nounFixMap, caiyunPrefixMap, _collectTxt, txtList, infoList, transList, transNotice, transApiName, apiData;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              pathRst = pathname.match(/\/[^/]*?scenario.*?\/(scene[^\/]+)\/?/);

              if (!(!pathRst || !pathRst[1])) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return", data);

            case 3:
              sNameTemp = pathRst[1];

              if (!(pathRst[1].includes('birthday') || pathname.includes('season_event'))) {
                _context3.next = 9;
                break;
              }

              rst = pathname.match(/\/[^/]*?scenario.*?\/(scene.+)$/);

              if (!(!rst || !rst[1])) {
                _context3.next = 8;
                break;
              }

              return _context3.abrupt("return", data);

            case 8:
              sNameTemp = rst[1].replace(/\//g, '_');

            case 9:
              if (pathname.includes('scene_tutorial02')) {
                getUsernameFromTutorial(data);
              }

              insertToolHtml();
              autoDownloadCsv();
              startIndex = getStartIndex(data);
              scenarioName = sNameTemp;
              scenarioCache.data = cloneDeep_1(data);
              scenarioCache.name = scenarioName;
              scenarioCache.hasTrans = false;
              scenarioCache.hasAutoTrans = false;
              scenarioCache.transMap = null;
              _context3.next = 21;
              return getScenario(scenarioName);

            case 21:
              _yield$getScenario = _context3.sent;
              transMap = _yield$getScenario.transMap;
              csv = _yield$getScenario.csv;

              if (transMap && transMap.has('filename')) {
                scenarioCache.originName = transMap.get('filename').detail;
              }

              _context3.next = 27;
              return getNameData();

            case 27:
              nameData = _context3.sent;
              nameMap = Game.lang !== 'ja' ? nameData['enNameMap'] : nameData['jpNameMap'];
              scenarioCache.nameMap = nameMap;

              if (transMap) {
                _context3.next = 53;
                break;
              }

              if (!(config.transJa && Game.lang === 'ja' || config.transEn && Game.lang === 'en')) {
                _context3.next = 50;
                break;
              }

              _context3.next = 34;
              return getNounData();

            case 34:
              _yield$getNounData = _context3.sent;
              nounMap = _yield$getNounData.nounMap;
              nounFixMap = _yield$getNounData.nounFixMap;
              caiyunPrefixMap = _yield$getNounData.caiyunPrefixMap;
              transMap = new Map();
              _collectTxt = collectTxt(data), txtList = _collectTxt.txtList, infoList = _collectTxt.infoList;
              _context3.next = 42;
              return transMulti(txtList, nameMap, nounMap, nounFixMap, caiyunPrefixMap);

            case 42:
              transList = _context3.sent;
              transNotice = false;
              transApiName = {
                google: ['Google翻译', 'https://translate.google.cn'],
                baidu: ['百度翻译', 'https://fanyi.baidu.com/'],
                caiyun: ['彩云小译', 'https://fanyi.caiyunapp.com/']
              };
              apiData = transApiName[config.transApi];
              infoList.forEach(function (info, index) {
                var obj = transMap.get(info.id) || {};
                obj[info.type] = transList[index] || '';

                if (!transNotice && info.index === startIndex && info.type === 'detail' && transList.length > 0) {
                  if (transList[0] === 'caiyunoutoflimit') {
                    obj[info.type] = "<span style=\"color:#fd8484;font-size:10px;\">\u5F69\u4E91\u5C0F\u8BD1\u8D85\u51FA\u4F7F\u7528\u6B21\u6570\uFF0C\u8BF7\u5C1D\u8BD5\u767B\u5F55\u5F69\u4E91\u8D26\u53F7\u540E\u518D\u4F7F\u7528\u3002\u53EF\u4EE5\u901A\u8FC7\u70B9\u51FB\u53F3\u4E0A\u89D2Log\u6309\u94AE\uFF0C\u7136\u540E\u70B9\u51FB\u94FE\u63A5\u6253\u5F00\u767B\u5F55\u9875\u9762\uFF1A</span><a style=\"color:#62dccb;font-size:10px;\" href=\"http://www.caiyunapp.com/user/login/\" target=\"_blank\">\u5F69\u4E91\u7528\u6237\u767B\u5F55</a>";
                  } else {
                    obj[info.type] = "<a href=\"".concat(apiData[1], "\" target=\"_blank\" class=\"autotrans-hint-blhxfy ").concat(config.transApi, "-blhxfy\"> </a>").concat(obj[info.type]);
                  }

                  transNotice = true;
                }

                transMap.set(info.id, obj);
              });

              if (transList.length > 0) {
                scenarioCache.hasAutoTrans = true;
                scenarioCache.transMap = transMap;
              }

              _context3.next = 51;
              break;

            case 50:
              return _context3.abrupt("return", data);

            case 51:
              _context3.next = 56;
              break;

            case 53:
              scenarioCache.hasTrans = true;
              scenarioCache.csv = csv;
              scenarioCache.transMap = transMap;

            case 56:
              if (scenarioCache.hasAutoTrans || scenarioCache.hasTrans) {
                scenarioFont();
              }

              data.forEach(function (item, index) {
                replaceChar('charcter1_name', item, nameMap);
                replaceChar('charcter2_name', item, nameMap);
                replaceChar('charcter3_name', item, nameMap);
                var obj = transMap.get(item.id);
                if (!obj) return;
                txtKeys.forEach(function (key) {
                  if (obj[key]) {
                    if (key === 'detail' && config.originText) {
                      item[key] = "".concat(restoreHtml(obj[key], item[key]), "\n          <div class=\"blhxfy-origin-text\" data-text='").concat(removeHtmlTag(item[key], 0, true), "'> </div>");
                    } else {
                      item[key] = restoreHtml(obj[key], item[key]);
                    }

                    if (scenarioCache.hasTrans && config.showTranslator && key === 'detail' && index === startIndex) {
                      var name = '我们仍未知道翻译这篇剧情的骑空士的名字';

                      if (transMap.has('translator')) {
                        name = transMap.get('translator').detail || name;
                      }

                      item[key] = "<a class=\"autotrans-hint-blhxfy translator-blhxfy\" data-text=\"\u8BD1\u8005\uFF1A".concat(name, "\"> </a>").concat(item[key]);
                    }
                  }
                });
              });
              return _context3.abrupt("return", data);

            case 59:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function transStart(_x7, _x8) {
      return _ref3.apply(this, arguments);
    };
  }();

  function transScenario (_x9, _x10) {
    return _ref4$1.apply(this, arguments);
  }

  function _ref4$1() {
    _ref4$1 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data, pathname) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!Array.isArray(data)) {
                _context4.next = 6;
                break;
              }

              _context4.next = 3;
              return transStart(data, pathname);

            case 3:
              return _context4.abrupt("return", _context4.sent);

            case 6:
              if (!Array.isArray(data.scene_list)) {
                _context4.next = 16;
                break;
              }

              _context4.t0 = Object;
              _context4.t1 = data;
              _context4.next = 11;
              return transStart(data.scene_list, pathname);

            case 11:
              _context4.t2 = _context4.sent;
              _context4.t3 = {
                scene_list: _context4.t2
              };
              return _context4.abrupt("return", _context4.t0.assign.call(_context4.t0, _context4.t1, _context4.t3));

            case 16:
              if (!Array.isArray(data.scenario)) {
                _context4.next = 26;
                break;
              }

              _context4.t4 = Object;
              _context4.t5 = data;
              _context4.next = 21;
              return transStart(data.scenario, pathname);

            case 21:
              _context4.t6 = _context4.sent;
              _context4.t7 = {
                scenario: _context4.t6
              };
              return _context4.abrupt("return", _context4.t4.assign.call(_context4.t4, _context4.t5, _context4.t7));

            case 26:
              return _context4.abrupt("return", data);

            case 27:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _ref4$1.apply(this, arguments);
  }

  var data = null;

  var getLocalData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type) {
      var str, key, hash, newHash, savedHash;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (data) {
                _context.next = 11;
                break;
              }

              _context.prev = 1;
              str = sessionStorage.getItem('blhxfy:data');

              if (str) {
                _context.next = 5;
                break;
              }

              return _context.abrupt("return", false);

            case 5:
              data = JSON.parse(str);
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](1);
              console.error(_context.t0);

            case 11:
              key = type;

              if (!/(\.csv|\.json)/.test(type)) {
                key = "".concat(type, ".csv");
              }

              _context.next = 15;
              return getHash();

            case 15:
              hash = _context.sent;
              newHash = hash[key];
              savedHash = data.hash[key];

              if (!(savedHash && savedHash === newHash)) {
                _context.next = 22;
                break;
              }

              return _context.abrupt("return", data[type]);

            case 22:
              data.hash[key] = newHash;
              return _context.abrupt("return", false);

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 8]]);
    }));

    return function getLocalData(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var setLocalData = function setLocalData(type, value) {
    // if (DEV) return false
    if (!data || isString_1(data.hash)) data = {
      hash: config.hash
    };
    var key = type;

    if (!/(\.csv|\.json)/.test(type)) {
      key = "".concat(type, ".csv");
    }

    var newHash = config.hash[key];

    if (newHash) {
      data.hash[key] = newHash;
    }

    data[type] = value;
    var str = JSON.stringify(data);

    try {
      sessionStorage.setItem('blhxfy:data', str);
    } catch (err) {
      console.error(err);
    }
  };

  var phraseMap = new Map();
  var loaded$2 = false;

  var getPhrase = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$2) {
                _context.next = 12;
                break;
              }

              _context.next = 3;
              return getLocalData('phrase');

            case 3:
              csv = _context.sent;

              if (csv) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return fetchWithHash('/blhxfy/data/phrase.csv');

            case 7:
              csv = _context.sent;
              setLocalData('phrase', csv);

            case 9:
              list = parseCsv(csv);
              list.forEach(function (item) {
                var text = item.text;
                var trans = filter(item.trans, true);

                if (trim(text) && trans) {
                  phraseMap.set(text, trans);
                }
              });
              loaded$2 = true;

            case 12:
              return _context.abrupt("return", phraseMap);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getPhrase() {
      return _ref.apply(this, arguments);
    };
  }();

  var transPhrase = function transPhrase(data, key, map) {
    if (!data || !data[key]) return;
    var text = data[key];

    if (map.has(text)) {
      data[key] = map.get(text);
    }
  };

  var shopLabel = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var phraseMap;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(data && data.labels && data.labels.length)) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return getPhrase();

            case 3:
              phraseMap = _context.sent;
              data.labels.forEach(function (item) {
                transPhrase(item, 'name', phraseMap);

                if (item.contents && item.contents.length) {
                  item.contents.forEach(function (cont) {
                    transPhrase(cont, 'name', phraseMap);
                  });
                }
              });

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function shopLabel(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  function transLangMsg(_x2) {
    return _transLangMsg.apply(this, arguments);
  }

  function _transLangMsg() {
    _transLangMsg = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
      var msgs, phraseMap, _i, _Object$keys, key, text;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(!data.option || !data.option.langMsg)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", data);

            case 2:
              msgs = data.option.langMsg;
              _context2.next = 5;
              return getPhrase();

            case 5:
              phraseMap = _context2.sent;

              for (_i = 0, _Object$keys = Object.keys(msgs); _i < _Object$keys.length; _i++) {
                key = _Object$keys[_i];
                text = msgs[key].msg;

                if (text && phraseMap.has(text)) {
                  msgs[key].msg = phraseMap.get(text);
                }
              }

              return _context2.abrupt("return", data);

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _transLangMsg.apply(this, arguments);
  }

  /**
   * Gets the timestamp of the number of milliseconds that have elapsed since
   * the Unix epoch (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Date
   * @returns {number} Returns the timestamp.
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => Logs the number of milliseconds it took for the deferred invocation.
   */
  var now = function() {
    return _root.Date.now();
  };

  var now_1 = now;

  /** `Object#toString` result references. */
  var symbolTag$2 = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$2);
  }

  var isSymbol_1 = isSymbol;

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol_1(value)) {
      return NAN;
    }
    if (isObject_1(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject_1(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  var toNumber_1 = toNumber;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max,
      nativeMin = Math.min;

  /**
   * Creates a debounced function that delays invoking `func` until after `wait`
   * milliseconds have elapsed since the last time the debounced function was
   * invoked. The debounced function comes with a `cancel` method to cancel
   * delayed `func` invocations and a `flush` method to immediately invoke them.
   * Provide `options` to indicate whether `func` should be invoked on the
   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
   * with the last arguments provided to the debounced function. Subsequent
   * calls to the debounced function return the result of the last `func`
   * invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the debounced function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} [wait=0] The number of milliseconds to delay.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=false]
   *  Specify invoking on the leading edge of the timeout.
   * @param {number} [options.maxWait]
   *  The maximum time `func` is allowed to be delayed before it's invoked.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // Avoid costly calculations while the window size is in flux.
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // Invoke `sendMail` when clicked, debouncing subsequent calls.
   * jQuery(element).on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', debounced);
   *
   * // Cancel the trailing debounced invocation.
   * jQuery(window).on('popstate', debounced.cancel);
   */
  function debounce(func, wait, options) {
    var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber_1(wait) || 0;
    if (isObject_1(options)) {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs,
          thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time;
      // Start the timer for the trailing edge.
      timerId = setTimeout(timerExpired, wait);
      // Invoke the leading edge.
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime,
          timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime;

      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
        (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired() {
      var time = now_1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // Restart the timer.
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(now_1());
    }

    function debounced() {
      var time = now_1(),
          isInvoking = shouldInvoke(time);

      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          // Handle invocations in a tight loop.
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  var debounce_1 = debounce;

  var skillMap = new Map();
  var skillKeys = [['special_skill', 'special'], ['action_ability1', 'skill-1'], ['action_ability2', 'skill-2'], ['action_ability3', 'skill-3'], ['action_ability4', 'skill-4'], ['support_ability1', 'support-1'], ['support_ability2', 'support-2'], ['support_ability_of_npczenith', 'skill-lb'], ['appear_ability', 'skill-main'], ['backmember_ability1', 'skill-sub']];
  var state = {
    status: 'init',
    cStatus: 'init',
    locSkMap: false,
    locASMap: false,
    skillMap: skillMap,
    skillKeys: skillKeys,
    skillData: null,
    commSkillMap: new Map(),
    autoTransCache: new Map(),
    nounMap: new Map(),
    nounRE: '',
    failed: new Set()
  };

  var getCommSkillMap = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csvData, list, sortedList, nounArr;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(state.cStatus === 'loaded')) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _context.next = 4;
              return getLocalData('common-skill');

            case 4:
              csvData = _context.sent;

              if (csvData) {
                _context.next = 10;
                break;
              }

              _context.next = 8;
              return fetchWithHash('/blhxfy/data/common-skill.csv');

            case 8:
              csvData = _context.sent;
              setLocalData('common-skill', csvData);

            case 10:
              _context.next = 12;
              return parseCsv(csvData);

            case 12:
              list = _context.sent;
              sortedList = sortKeywords(list, 'comment');
              nounArr = [];
              sortedList.forEach(function (item) {
                if (item.comment && item.trans && item.type) {
                  var comment = trim(item.comment);
                  var trans = filter(item.trans);
                  var type = trim(item.type) || '1';

                  if (comment && trans) {
                    if (type === '4') {
                      state.nounMap.set(comment, trans);
                      nounArr.push(comment);
                    } else {
                      state.commSkillMap.set(comment, {
                        trans: trans,
                        type: type
                      });
                    }
                  }
                }
              });
              if (nounArr.length) state.nounRE = "(".concat(nounArr.join('|'), ")");
              state.cStatus = 'loaded';

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getCommSkillMap() {
      return _ref.apply(this, arguments);
    };
  }();

  var saveSkillMap = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(skillMap) {
      var arr;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              arr = _toConsumableArray(skillMap).slice(-20);
              setLocalData('skill-npc', JSON.stringify(arr));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function saveSkillMap(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var getSkillMap = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var str, arr, _iterator, _step, _step$value, key, item, _key;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return getLocalData('skill-npc');

            case 2:
              str = _context3.sent;

              try {
                arr = JSON.parse(str);
                state.skillMap = new Map(arr);
                _iterator = _createForOfIteratorHelper(state.skillMap);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    _step$value = _slicedToArray(_step.value, 2), key = _step$value[0], item = _step$value[1];

                    for (_key in item) {
                      item[_key].name = filter(item[_key].name);
                      item[_key].detail = filter(item[_key].detail);
                    }
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                state.locSkMap = true;
              } catch (e) {}

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function getSkillMap() {
      return _ref3.apply(this, arguments);
    };
  }();

  var saveAutoTrans = debounce_1(function () {
    var arr = _toConsumableArray(state.autoTransCache).slice(-200);

    setLocalData('auto-trans', JSON.stringify(arr));
  }, 500);

  var getAutoTrans = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var str, arr, _iterator2, _step2, _step2$value, key, item;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getLocalData('auto-trans');

            case 2:
              str = _context4.sent;

              try {
                arr = JSON.parse(str);
                state.autoTransCache = new Map(arr);
                _iterator2 = _createForOfIteratorHelper(state.autoTransCache);

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    _step2$value = _slicedToArray(_step2.value, 2), key = _step2$value[0], item = _step2$value[1];
                    state.autoTransCache.set(key, filter(item));
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

                state.locASMap = true;
              } catch (e) {}

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function getAutoTrans() {
      return _ref4.apply(this, arguments);
    };
  }();

  var setSkillMap = function setSkillMap(list) {
    var stable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var npcId,
        active,
        idArr = [];

    var _iterator3 = _createForOfIteratorHelper(list),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var row = _step3.value;

        if (row.id === 'npc') {
          idArr = row.detail.split('|');
        } else if (row.id === 'active') {
          if (row.name !== '0') {
            active = true;
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    if (!idArr.length || !idArr[0]) return;
    npcId = idArr[1] || idArr[0];
    var skillData = {};

    var _iterator4 = _createForOfIteratorHelper(list),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _row = _step4.value;

        if (stable || active) {
          if (/.+\[lv\d+\]/.test(_row.id)) {
            var rgs = _row.id.match(/(.+)\[lv(\d+)\]/);

            var key = rgs[1];
            var level = parseInt(rgs[2]);

            var _list = skillData[key + '-lv'] || [];

            if (!skillData[key + '-lv']) skillData[key + '-lv'] = _list;

            _list.push({
              level: level,
              data: _row
            });

            _list.sort(function (m, n) {
              return m.level - n.level;
            });
          } else {
            skillData[_row.id] = _row;
          }
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    state.skillMap.set(npcId, skillData);
    saveSkillMap(state.skillMap);
  };

  var getSkillData = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(npcId) {
      var csvName, csvData, list;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (state.locSkMap) {
                _context5.next = 3;
                break;
              }

              _context5.next = 3;
              return getSkillMap();

            case 3:
              if (state.locASMap) {
                _context5.next = 6;
                break;
              }

              _context5.next = 6;
              return getAutoTrans();

            case 6:
              if (!state.skillMap.has(npcId)) {
                _context5.next = 8;
                break;
              }

              return _context5.abrupt("return", state);

            case 8:
              _context5.next = 10;
              return getLocalData('skill.json');

            case 10:
              state.skillData = _context5.sent;

              if (!(!state.skillData || !isObject_1(state.skillData))) {
                _context5.next = 16;
                break;
              }

              _context5.next = 14;
              return fetchWithHash('/blhxfy/data/skill.json');

            case 14:
              state.skillData = _context5.sent;
              setLocalData('skill.json', state.skillData);

            case 16:
              csvName = state.skillData[npcId];

              if (!(csvName && !state.failed.has(csvName))) {
                _context5.next = 31;
                break;
              }

              csvData = '';
              _context5.prev = 19;
              _context5.next = 22;
              return fetchWithHash("/blhxfy/data/skill/".concat(csvName));

            case 22:
              csvData = _context5.sent;
              list = parseCsv(filter(csvData));
              setSkillMap(list);
              _context5.next = 31;
              break;

            case 27:
              _context5.prev = 27;
              _context5.t0 = _context5["catch"](19);
              state.failed.add(csvName);
              console.log(_context5.t0);

            case 31:
              return _context5.abrupt("return", state);

            case 32:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[19, 27]]);
    }));

    return function getSkillData(_x2) {
      return _ref5.apply(this, arguments);
    };
  }();

  var getLocalSkillData = function getLocalSkillData(npcId) {
    var str = sessionStorage.getItem('blhxfy:skill-preview');

    if (str) {
      try {
        var data = JSON.parse(str);

        if (data.id === npcId) {
          var csv = filter(data.csv);
          var list = parseCsv(csv);
          list.forEach(function (item) {
            if (item.id === 'npc') {
              item.detail = npcId;
            }
          });
          setSkillMap(list);
          return state;
        }
      } catch (err) {
        console.error(err);
      }
    }

    return false;
  };

  function replaceTurn (str) {
    return str.replace('ターン', '回合').replace('turns', '回合').replace('turn', '回合').replace('Cooldown', '使用间隔').replace('使用間隔', '使用间隔').replace('初回召喚', '初次召唤').replace('後', '后');
  }

  var buffMap = {
    buff: new Map(),
    debuff: new Map()
  };
  var loaded$3 = false;

  var getData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type) {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getLocalData(type);

            case 2:
              csv = _context.sent;

              if (csv) {
                _context.next = 8;
                break;
              }

              _context.next = 6;
              return fetchWithHash("/blhxfy/data/".concat(type, ".csv"));

            case 6:
              csv = _context.sent;
              setLocalData(type, csv);

            case 8:
              list = parseCsv(csv);
              list.forEach(function (item) {
                var detail = trim(item.detail);
                var trans = filter(item.trans);

                if (detail && trans) {
                  buffMap[type].set(detail, trans);
                }
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getData(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var getBuffData = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(type) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (loaded$3) {
                _context2.next = 6;
                break;
              }

              _context2.next = 3;
              return getData('buff');

            case 3:
              _context2.next = 5;
              return getData('debuff');

            case 5:
              loaded$3 = true;

            case 6:
              return _context2.abrupt("return", buffMap[type]);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function getBuffData(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var transBuff = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(obj) {
      var data, keys, _i, _keys, key, buffMap, k, item;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!obj || !obj.condition)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              data = obj.condition;
              keys = ['buff', 'debuff'];
              _i = 0, _keys = keys;

            case 5:
              if (!(_i < _keys.length)) {
                _context.next = 15;
                break;
              }

              key = _keys[_i];

              if (!data[key]) {
                _context.next = 12;
                break;
              }

              _context.next = 10;
              return getBuffData(key);

            case 10:
              buffMap = _context.sent;

              for (k in data[key]) {
                item = data[key][k];

                if (item.detail && buffMap.has(item.detail)) {
                  item.detail = buffMap.get(item.detail);
                }

                if (item.effect) item.effect = replaceTurn(item.effect);
              }

            case 12:
              _i++;
              _context.next = 5;
              break;

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function transBuff(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var elemtRE = '([光闇水火風土無全]|light|dark|water|wind|earth|fire|plain|all)';
  var elemtMap = {
    light: '光',
    '光': '光',
    dark: '暗',
    '闇': '暗',
    water: '水',
    '水': '水',
    wind: '风',
    '風': '风',
    earth: '土',
    '土': '土',
    fire: '火',
    '火': '火',
    plain: '无',
    '無': '无',
    all: '全',
    '全': '全'
  };
  var numRE = '(\\d{1,10}\\.?\\d{0,4}?)';
  var percentRE = '(\\d{1,10}\\.?\\d{0,4}?[%％])';

  var parseRegExp = function parseRegExp(str, nounRE) {
    return str.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\$elemt/g, elemtRE).replace(/\$num/g, numRE).replace(/\$percent/g, percentRE).replace(/\$noun/g, nounRE);
  };

  var transSkill = function transSkill(comment, _ref) {
    var commSkillMap = _ref.commSkillMap,
        nounMap = _ref.nounMap,
        nounRE = _ref.nounRE,
        autoTransCache = _ref.autoTransCache;
    if (autoTransCache.has(comment)) return autoTransCache.get(comment);
    var result = comment;

    var _iterator = _createForOfIteratorHelper(commSkillMap),
        _step;

    try {
      var _loop = function _loop() {
        var _step$value = _slicedToArray(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];

        if (!trim(key)) return "continue";
        var trans = value.trans,
            type = value.type;

        if (type === '1') {
          var re = new RegExp(parseRegExp(key, nounRE), 'gi');
          result = result.replace(re, function () {
            var _trans = trans;

            for (var _len = arguments.length, arr = new Array(_len), _key = 0; _key < _len; _key++) {
              arr[_key] = arguments[_key];
            }

            for (var i = 1; i < arr.length - 2; i++) {
              var eleKey = arr[i].toLowerCase();

              if (elemtMap[eleKey]) {
                _trans = _trans.replace("$".concat(i), elemtMap[eleKey]);
              } else if (nounMap.has(eleKey)) {
                _trans = _trans.replace("$".concat(i), nounMap.get(eleKey));
              } else {
                _trans = _trans.replace("$".concat(i), arr[i]);
              }
            }

            return _trans;
          });
        } else if (type === '2') {
          var res,
              i = 0;

          while (res !== result && i < 10) {
            res = result;
            result = result.replace(key, trans);
            i++;
          }
        } else if (type === '3') {
          result = result.replace("(".concat(key, ")"), "(".concat(trans, ")"));
        }
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _ret = _loop();

        if (_ret === "continue") continue;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    autoTransCache.set(comment, result);
    saveAutoTrans();
    return result;
  };

  var parseBuff = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var _iterator2, _step2, item, key, ability;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iterator2 = _createForOfIteratorHelper(skillKeys);
              _context.prev = 1;

              _iterator2.s();

            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context.next = 18;
                break;
              }

              item = _step2.value;
              key = item[0];
              ability = data[key];

              if (ability) {
                _context.next = 13;
                break;
              }

              if (data.ability) {
                _context.next = 10;
                break;
              }

              return _context.abrupt("continue", 16);

            case 10:
              ability = data.ability[key];

              if (ability) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("continue", 16);

            case 13:
              if (!ability.ability_detail) {
                _context.next = 16;
                break;
              }

              _context.next = 16;
              return transBuff(ability.ability_detail);

            case 16:
              _context.next = 3;
              break;

            case 18:
              _context.next = 23;
              break;

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](1);

              _iterator2.e(_context.t0);

            case 23:
              _context.prev = 23;

              _iterator2.f();

              return _context.finish(23);

            case 26:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 20, 23, 26]]);
    }));

    return function parseBuff(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var previewSkill = function previewSkill(npcId) {
    $('#cnt-detail').off('click.blhxfy').on('click.blhxfy', '.prt-evolution-star>div:eq(1)', function () {
      var csv = window.prompt('粘贴要预览的技能翻译CSV文本');

      if (csv) {
        sessionStorage.setItem('blhxfy:skill-preview', JSON.stringify({
          id: npcId,
          csv: splitSingleLineSkill(csv)
        }));
        location.reload();
      }
    }).on('click.blhxfy', '.prt-evolution-star>div:eq(2)', function () {
      if (confirm('清除技能预览？')) {
        sessionStorage.removeItem('blhxfy:skill-preview');
        location.reload();
      }
    });
  };

  var parseSkill = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, pathname) {
      var npcId, level, skillState, skillData, translated, keys, _iterator3, _step3, item, key1, key2, ability, _getPlusStr, _getPlusStr2, plus1, plus2, _trans4, list, trans, intro, _trans2, _intro, _trans3;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(Game.lang === 'en')) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", data);

            case 2:
              if (!pathname.includes('/npc/npc/')) {
                _context2.next = 9;
                break;
              }

              if (!(!data.master || !data.master.id)) {
                _context2.next = 5;
                break;
              }

              return _context2.abrupt("return", data);

            case 5:
              npcId = "".concat(data.master.id);
              level = data.param.level;
              _context2.next = 14;
              break;

            case 9:
              if (!pathname.includes('/archive/npc_detail')) {
                _context2.next = 14;
                break;
              }

              if (data.id) {
                _context2.next = 12;
                break;
              }

              return _context2.abrupt("return", data);

            case 12:
              npcId = data.id;
              level = data.max_level;

            case 14:
              _context2.next = 16;
              return parseBuff(data);

            case 16:
              previewSkill(npcId);
              skillState = getLocalSkillData(npcId);

              if (skillState) {
                _context2.next = 22;
                break;
              }

              _context2.next = 21;
              return getSkillData(npcId);

            case 21:
              skillState = _context2.sent;

            case 22:
              skillData = skillState.skillMap.get(npcId);
              translated = new Map();
              keys = skillState.skillKeys;

              if (!skillData) {
                _context2.next = 68;
                break;
              }

              _iterator3 = _createForOfIteratorHelper(keys);
              _context2.prev = 27;

              _iterator3.s();

            case 29:
              if ((_step3 = _iterator3.n()).done) {
                _context2.next = 58;
                break;
              }

              item = _step3.value;
              key1 = item[0];
              key2 = item[1];
              ability = data[key1];

              if (ability) {
                _context2.next = 40;
                break;
              }

              if (data.ability) {
                _context2.next = 37;
                break;
              }

              return _context2.abrupt("continue", 56);

            case 37:
              ability = data.ability[key1];

              if (ability) {
                _context2.next = 40;
                break;
              }

              return _context2.abrupt("continue", 56);

            case 40:
              if (ability.recast_comment) {
                ability.recast_comment = replaceTurn(ability.recast_comment);
              }

              _getPlusStr = getPlusStr(ability.name), _getPlusStr2 = _slicedToArray(_getPlusStr, 2), plus1 = _getPlusStr2[0], plus2 = _getPlusStr2[1];
              _trans4 = skillData["skill-".concat(ability.name)];

              if (_trans4) {
                _context2.next = 54;
                break;
              }

              _trans4 = skillData["special-".concat(ability.name)];

              if (_trans4) {
                _context2.next = 54;
                break;
              }

              list = skillData[key2 + '-lv'];
              list && list.forEach(function (item) {
                if (level >= item.level) {
                  _trans4 = item.data;
                }
              });

              if (_trans4) {
                _context2.next = 54;
                break;
              }

              _trans4 = skillData[key2 + plus2];

              if (_trans4) {
                _context2.next = 54;
                break;
              }

              _trans4 = skillData[key2];

              if (_trans4) {
                _context2.next = 54;
                break;
              }

              return _context2.abrupt("continue", 56);

            case 54:
              if (_trans4.name) {
                ability.name = _trans4.name + plus1;
              }

              if (_trans4.detail) {
                ability.comment = _trans4.detail;
                translated.set(key1, true);
              }

            case 56:
              _context2.next = 29;
              break;

            case 58:
              _context2.next = 63;
              break;

            case 60:
              _context2.prev = 60;
              _context2.t0 = _context2["catch"](27);

              _iterator3.e(_context2.t0);

            case 63:
              _context2.prev = 63;

              _iterator3.f();

              return _context2.finish(63);

            case 66:
              if (data.master) {
                trans = skillData['npc'];

                if (trans && trans.name) {
                  data.master.name = trans.name;
                  intro = skillData['intro'];
                  if (intro && intro.name) data.master.evo_name = "[".concat(intro.name, "]").concat(trans.name);
                }
              } else if (data.name) {
                _trans2 = skillData['npc'];

                if (_trans2 && _trans2.name) {
                  data.name = _trans2.name;
                  _intro = skillData['intro'];
                  if (_intro && _intro.name) data.evo_name = "[".concat(_intro.name, "]").concat(_trans2.name);
                }
              }

              if (data.comment) {
                _trans3 = skillData['intro'];
                if (_trans3 && _trans3.detail) data.comment = _trans3.detail;
              }

            case 68:
              _context2.next = 70;
              return getCommSkillMap();

            case 70:
              keys.forEach(function (item) {
                if (!translated.get(item[0])) {
                  var skill = data[item[0]];

                  if (skill) {
                    skill.comment = transSkill(skill.comment, skillState);
                  }
                }
              });
              return _context2.abrupt("return", data);

            case 72:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[27, 60, 63, 66]]);
    }));

    return function parseSkill(_x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  var skillMap$1 = new Map();
  var loaded$4 = false;

  var getSkillData$1 = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
      var csv, list, trans;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$4) {
                _context.next = 12;
                break;
              }

              _context.next = 3;
              return getLocalData('job-skill');

            case 3:
              csv = _context.sent;

              if (csv) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return fetchWithHash('/blhxfy/data/job-skill.csv');

            case 7:
              csv = _context.sent;
              setLocalData('job-skill', csv);

            case 9:
              list = parseCsv(csv);
              list.forEach(function (item) {
                if (item && item.id) {
                  var _id = trim(item.id);

                  var _en = trim(item.en);

                  var _ja = trim(item.ja);

                  if (_id) {
                    var value = {
                      name: filter(item.name),
                      detail: filter(item.detail)
                    };
                    skillMap$1.set(_id, value);
                    if (_ja) skillMap$1.set(_ja, value);
                    if (_en) skillMap$1.set(_en, value);
                  }
                }
              });
              loaded$4 = true;

            case 12:
              trans = skillMap$1.get(id);
              return _context.abrupt("return", trans);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getSkillData(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var startTrans = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var key, trans;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = regeneratorRuntime.keys(data);

            case 1:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 15;
                break;
              }

              key = _context.t1.value;

              if (!data[key]) {
                _context.next = 13;
                break;
              }

              _context.next = 6;
              return getSkillData$1(data[key].action_id);

            case 6:
              trans = _context.sent;

              if (trans) {
                data[key].name = trans.name;
                data[key].comment = trans.detail;
              }

              if (data[key].recast_comment) {
                data[key].recast_comment = replaceTurn(data[key].recast_comment);
              }

              if (data[key].turn_comment) {
                data[key].turn_comment = replaceTurn(data[key].turn_comment);
              }

              if (!data[key].ability_detail) {
                _context.next = 13;
                break;
              }

              _context.next = 13;
              return transBuff(data[key].ability_detail);

            case 13:
              _context.next = 1;
              break;

            case 15:
              return _context.abrupt("return", data);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function startTrans(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var replaceSkill = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!data.action_ability) {
                _context2.next = 4;
                break;
              }

              _context2.next = 3;
              return startTrans(data.action_ability);

            case 3:
              data.action_ability = _context2.sent;

            case 4:
              if (!data.support_ability) {
                _context2.next = 8;
                break;
              }

              _context2.next = 7;
              return startTrans(data.support_ability);

            case 7:
              data.support_ability = _context2.sent;

            case 8:
              return _context2.abrupt("return", data);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function replaceSkill(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var transSkill$1 = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, pathname) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!/\/party\/job_equipped\/\d+/.test(pathname)) {
                _context3.next = 7;
                break;
              }

              if (!data.job) {
                _context3.next = 5;
                break;
              }

              _context3.next = 4;
              return replaceSkill(data.job);

            case 4:
              data.job = _context3.sent;

            case 5:
              _context3.next = 36;
              break;

            case 7:
              if (!pathname.includes('/party_ability_subaction/')) {
                _context3.next = 14;
                break;
              }

              if (!data.list) {
                _context3.next = 12;
                break;
              }

              _context3.next = 11;
              return startTrans(data.list);

            case 11:
              data.list = _context3.sent;

            case 12:
              _context3.next = 36;
              break;

            case 14:
              if (!/\/party\/ability_list\/\d+\//.test(pathname)) {
                _context3.next = 20;
                break;
              }

              _context3.next = 17;
              return replaceSkill(data);

            case 17:
              data = _context3.sent;
              _context3.next = 36;
              break;

            case 20:
              if (!/\/party\/job_info\/\d+\//.test(pathname)) {
                _context3.next = 31;
                break;
              }

              if (!data.after_job_master) {
                _context3.next = 25;
                break;
              }

              _context3.next = 24;
              return replaceSkill(data.after_job_master);

            case 24:
              data.after_job_master = _context3.sent;

            case 25:
              if (!data.before_job_info) {
                _context3.next = 29;
                break;
              }

              _context3.next = 28;
              return replaceSkill(data.before_job_info);

            case 28:
              data.before_job_info = _context3.sent;

            case 29:
              _context3.next = 36;
              break;

            case 31:
              if (!/\/zenith\/ability_list\/\d+/.test(pathname)) {
                _context3.next = 36;
                break;
              }

              if (!data.ability_list) {
                _context3.next = 36;
                break;
              }

              _context3.next = 35;
              return startTrans(data.ability_list);

            case 35:
              data.list = _context3.sent;

            case 36:
              return _context3.abrupt("return", data);

            case 37:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function transSkill(_x3, _x4) {
      return _ref3.apply(this, arguments);
    };
  }();

  var htmlMap = new Map();
  var loaded$5 = false;

  var getCommHtmlData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list, tempMap;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$5) {
                _context.next = 14;
                break;
              }

              _context.next = 3;
              return getLocalData('common-html');

            case 3:
              csv = _context.sent;

              if (csv) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return fetchWithHash('/blhxfy/data/common-html.csv');

            case 7:
              csv = _context.sent;
              setLocalData('common-html', csv);

            case 9:
              list = parseCsv(csv);
              tempMap = new Map();
              sortKeywords(list, 'text').forEach(function (item, index) {
                var pathname = trim(item.path);
                var text = trim(item.text);
                var trans = filter(item.trans);
                var times = item.count | 0 || 1;

                if (pathname && text && trans) {
                  if (tempMap.has(pathname)) {
                    tempMap.get(pathname).push({
                      text: text,
                      trans: trans,
                      times: times,
                      index: index
                    });
                  } else {
                    tempMap.set(pathname, [{
                      text: text,
                      trans: trans,
                      times: times,
                      index: index
                    }]);
                  }
                }
              });
              sortKeywords(Array.from(tempMap.keys())).forEach(function (key) {
                htmlMap.set(key, tempMap.get(key));
              });
              loaded$5 = true;

            case 14:
              return _context.abrupt("return", htmlMap);

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getCommHtmlData() {
      return _ref.apply(this, arguments);
    };
  }();

  var htmlMap$1 = new Map();
  var loaded$6 = false;

  var getArchiveData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$6) {
                _context.next = 7;
                break;
              }

              _context.next = 3;
              return fetchWithHash('/blhxfy/data/archive.csv');

            case 3:
              csv = _context.sent;
              list = parseCsv(csv);
              sortKeywords(list, 'text').forEach(function (item) {
                var text = trim(item.text);
                var trans = filter(item.trans);
                var times = item.count | 0 || 1;

                if (text && trans) {
                  htmlMap$1.set(text, {
                    trans: trans,
                    times: times
                  });
                }
              });
              loaded$6 = true;

            case 7:
              return _context.abrupt("return", htmlMap$1);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getArchiveData() {
      return _ref.apply(this, arguments);
    };
  }();

  var replaceHTML = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(html, pathname) {
      var _html, theList, htmlMap, _iterator, _step, _step$value, key, list;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _html = html;
              theList = [];
              _context.next = 4;
              return getCommHtmlData();

            case 4:
              htmlMap = _context.sent;
              _iterator = _createForOfIteratorHelper(htmlMap.entries());

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _step$value = _slicedToArray(_step.value, 2), key = _step$value[0], list = _step$value[1];

                  if (pathname.includes(key)) {
                    theList = theList.concat(list);
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              theList.sort(function (prev, next) {
                return prev.index - next.index;
              }).forEach(function (item) {
                for (var i = 0; i < item.times; i++) {
                  var newHtml = _html.replace(item.text, item.trans);

                  if (newHtml !== _html) {
                    _html = newHtml;
                  } else {
                    break;
                  }
                }
              });
              return _context.abrupt("return", _html);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function replaceHTML(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var replaceArchive = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(html) {
      var _html, htmlMap, _iterator2, _step2, _step2$value, text, item, i, newHtml;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _html = html;
              _context2.next = 3;
              return getArchiveData();

            case 3:
              htmlMap = _context2.sent;
              _iterator2 = _createForOfIteratorHelper(htmlMap.entries());
              _context2.prev = 5;

              _iterator2.s();

            case 7:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 22;
                break;
              }

              _step2$value = _slicedToArray(_step2.value, 2), text = _step2$value[0], item = _step2$value[1];
              i = 0;

            case 10:
              if (!(i < item.times)) {
                _context2.next = 20;
                break;
              }

              newHtml = _html.replace(text, item.trans);

              if (!(newHtml !== _html)) {
                _context2.next = 16;
                break;
              }

              _html = newHtml;
              _context2.next = 17;
              break;

            case 16:
              return _context2.abrupt("break", 20);

            case 17:
              i++;
              _context2.next = 10;
              break;

            case 20:
              _context2.next = 7;
              break;

            case 22:
              _context2.next = 27;
              break;

            case 24:
              _context2.prev = 24;
              _context2.t0 = _context2["catch"](5);

              _iterator2.e(_context2.t0);

            case 27:
              _context2.prev = 27;

              _iterator2.f();

              return _context2.finish(27);

            case 30:
              return _context2.abrupt("return", _html);

            case 31:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[5, 24, 27, 30]]);
    }));

    return function replaceArchive(_x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  var settingHtml = false;

  var getHtml = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(encodedHtml, pathname) {
      var html;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              html = '';
              _context3.prev = 1;
              html = decodeURIComponent(encodedHtml);
              _context3.next = 8;
              break;

            case 5:
              _context3.prev = 5;
              _context3.t0 = _context3["catch"](1);
              return _context3.abrupt("return", encodedHtml);

            case 8:
              if (config.log) {
                console.log(_defineProperty({}, pathname, html.trim()));
              }

              _context3.prev = 9;

              if (!pathname.includes('/archive/content/library/')) {
                _context3.next = 16;
                break;
              }

              _context3.next = 13;
              return replaceArchive(html);

            case 13:
              html = _context3.sent;
              _context3.next = 19;
              break;

            case 16:
              _context3.next = 18;
              return replaceHTML(html, pathname);

            case 18:
              html = _context3.sent;

            case 19:
              _context3.next = 24;
              break;

            case 21:
              _context3.prev = 21;
              _context3.t1 = _context3["catch"](9);
              console.error(_context3.t1);

            case 24:
              if (!settingHtml && pathname.includes('/setting/content/index/index')) {
                html = insertSettingHtml(html);
                settingHtml = true;
              }

              return _context3.abrupt("return", encodeURIComponent(html));

            case 26:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 5], [9, 21]]);
    }));

    return function getHtml(_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();

  function transHTML(_x6, _x7) {
    return _transHTML.apply(this, arguments);
  }

  function _transHTML() {
    _transHTML = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data, pathname) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!data.data) {
                _context4.next = 4;
                break;
              }

              _context4.next = 3;
              return getHtml(data.data, pathname);

            case 3:
              data.data = _context4.sent;

            case 4:
              if (!(data.option && data.option.progress)) {
                _context4.next = 8;
                break;
              }

              _context4.next = 7;
              return getHtml(data.option.progress, pathname);

            case 7:
              data.option.progress = _context4.sent;

            case 8:
              if (!(data.option && data.option.quest)) {
                _context4.next = 17;
                break;
              }

              if (!data.option.quest.content__index) {
                _context4.next = 13;
                break;
              }

              _context4.next = 12;
              return getHtml(data.option.quest.content__index, pathname);

            case 12:
              data.option.quest.content__index = _context4.sent;

            case 13:
              if (!data.option.quest.content_list) {
                _context4.next = 17;
                break;
              }

              _context4.next = 16;
              return getHtml(data.option.quest.content_list, pathname);

            case 16:
              data.option.quest.content_list = _context4.sent;

            case 17:
              return _context4.abrupt("return", data);

            case 18:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _transHTML.apply(this, arguments);
  }

  var townMap = new Map();
  var loaded$7 = false;

  var getTownData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$7) {
                _context.next = 12;
                break;
              }

              _context.next = 3;
              return getLocalData('town-info');

            case 3:
              csv = _context.sent;

              if (csv) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return fetchWithHash('/blhxfy/data/town-info.csv');

            case 7:
              csv = _context.sent;
              setLocalData('town-info', csv);

            case 9:
              list = parseCsv(csv);
              list.forEach(function (item) {
                var id = trim(item.id);
                var name = filter(item.name);
                var detail = filter(item.detail);
                var vyrn = filter(item.vyrn);

                if (id && name) {
                  townMap.set(id, {
                    name: name,
                    detail: detail,
                    vyrn: vyrn
                  });
                }
              });
              loaded$7 = true;

            case 12:
              return _context.abrupt("return", townMap);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getTownData() {
      return _ref.apply(this, arguments);
    };
  }();

  function transTownInfo(_x, _x2) {
    return _transTownInfo.apply(this, arguments);
  }

  function _transTownInfo() {
    _transTownInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, pathname) {
      var town, townMap, key, item, id, _data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              town = data.option.mydata_assets.mydata.town;
              _context.next = 7;
              break;

            case 4:
              _context.prev = 4;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", data);

            case 7:
              _context.next = 9;
              return getTownData();

            case 9:
              townMap = _context.sent;

              if (townMap.has(town.location_id)) {
                town.town_name = townMap.get(town.location_id).name;
              }

              for (key in town.spot) {
                item = town.spot[key];
                id = "".concat(town.location_id, "-").concat(item.id);

                if (townMap.has(id)) {
                  _data = townMap.get(id);
                  item.location = _data.name;
                  item.description = _data.detail;
                  item.bee_comment = _data.vyrn;
                }
              }

              return _context.abrupt("return", data);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 4]]);
    }));
    return _transTownInfo.apply(this, arguments);
  }

  var islandMap = new Map();
  var loaded$8 = false;

  var getIslandData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$8) {
                _context.next = 7;
                break;
              }

              _context.next = 3;
              return fetchWithHash('/blhxfy/data/island-info.csv');

            case 3:
              csv = _context.sent;
              list = parseCsv(csv);
              list.forEach(function (item) {
                var id = trim(item.id);
                var name = filter(item.name);
                var detail = filter(item.detail);

                if (id && name) {
                  islandMap.set(id, {
                    name: name,
                    detail: detail
                  });

                  if (id === 'skydom') {
                    islandMap.set(name, detail);
                  }
                }
              });
              loaded$8 = true;

            case 7:
              return _context.abrupt("return", islandMap);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getIslandData() {
      return _ref.apply(this, arguments);
    };
  }();

  function transIslandInfo(_x, _x2) {
    return _transIslandInfo.apply(this, arguments);
  }

  function _transIslandInfo() {
    _transIslandInfo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, pathname) {
      var island, islandMap, key, item, id, _data;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              island = data.island_info;
              _context.next = 7;
              break;

            case 4:
              _context.prev = 4;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", data);

            case 7:
              _context.next = 9;
              return getIslandData();

            case 9:
              islandMap = _context.sent;

              if (islandMap.has(island.island_name)) {
                island.island_name = islandMap.get(island.island_name);
              }

              for (key in island) {
                item = island[key];
                id = key;

                if (islandMap.has(id)) {
                  if (id !== 'island_name') {
                    _data = islandMap.get(id);
                    item.name = _data.name;
                    item.area_comment = _data.detail;
                  }
                }
              }

              return _context.abrupt("return", data);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 4]]);
    }));
    return _transIslandInfo.apply(this, arguments);
  }

  var chatMap = new Map();
  var nChatMap = new Map();
  var loaded$9 = false;

  var getChatData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$9) {
                _context.next = 12;
                break;
              }

              _context.next = 3;
              return getLocalData('chat-preset');

            case 3:
              csv = _context.sent;

              if (csv) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return fetchWithHash('/blhxfy/data/chat-preset.csv');

            case 7:
              csv = _context.sent;
              setLocalData('chat-preset', csv);

            case 9:
              list = parseCsv(csv);
              list.forEach(function (item) {
                var id = trim(item.id);
                var text = trim(item.text);
                var trans = filter(item.trans);

                if (id && trans) {
                  if (/\d+-n/.test(id)) {
                    var rgs = id.match(/(\d+)-n/);
                    var _id = rgs[1];
                    nChatMap.set(_id, {
                      text: text,
                      trans: trans
                    });
                  } else {
                    chatMap.set(id, trans);
                  }
                }
              });
              loaded$9 = true;

            case 12:
              return _context.abrupt("return", {
                chatMap: chatMap,
                nChatMap: nChatMap
              });

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getChatData() {
      return _ref.apply(this, arguments);
    };
  }();

  function transChat(_x) {
    return _transChat.apply(this, arguments);
  }

  function _transChat() {
    _transChat = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var _yield$getChatData, chatMap, nChatMap, key, item, ck, id, hasSpecialTrans, _nChatMap$get, text, trans;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (data.chat) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", data);

            case 2:
              _context.next = 4;
              return getChatData();

            case 4:
              _yield$getChatData = _context.sent;
              chatMap = _yield$getChatData.chatMap;
              nChatMap = _yield$getChatData.nChatMap;

              for (key in data.chat) {
                item = data.chat[key];

                for (ck in item) {
                  id = item[ck].chat_id;

                  if (chatMap.has(id)) {
                    hasSpecialTrans = false;

                    if (nChatMap.has(id)) {
                      _nChatMap$get = nChatMap.get(id), text = _nChatMap$get.text, trans = _nChatMap$get.trans;

                      if (item[ck].text === text) {
                        item[ck].text = trans;
                        hasSpecialTrans = true;
                      }
                    }

                    if (!hasSpecialTrans) {
                      item[ck].text = chatMap.get(id);
                    }
                  }
                }
              }

              return _context.abrupt("return", data);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _transChat.apply(this, arguments);
  }

  var bossNameMap = new Map();
  var loaded$a = false;

  var getBossName = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, csvNpc, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$a) {
                _context.next = 17;
                break;
              }

              _context.next = 3;
              return getLocalData('battle/boss-name');

            case 3:
              csv = _context.sent;

              if (csv) {
                _context.next = 14;
                break;
              }

              _context.next = 7;
              return fetchWithHash('/blhxfy/data/battle/boss-name.csv');

            case 7:
              csv = _context.sent;
              _context.next = 10;
              return fetchWithHash('/blhxfy/data/npc-name-jp.csv');

            case 10:
              csvNpc = _context.sent;
              csv = csv.replace(/\r\n/g, '\n');
              csv += csvNpc.replace(/\r\n/g, '\n').replace(/^name,trans/, '');
              setLocalData('battle/boss-name', csv);

            case 14:
              list = parseCsv(csv);
              list.forEach(function (item) {
                var name = trim(item.name);
                var trans = filter(item.trans);

                if (name && trans) {
                  bossNameMap.set(name, trans);
                }
              });
              loaded$a = true;

            case 17:
              return _context.abrupt("return", bossNameMap);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getBossName() {
      return _ref.apply(this, arguments);
    };
  }();

  var skillTemp = new Map();
  var posMap = new Map();
  var bossNameMap$1 = new Map();

  var collectNpcSkill = function collectNpcSkill(skillData) {
    for (var key in skillData) {
      if (/(skill|special)-\D.*/.test(key)) {
        var rgs = key.match(/(skill|special)-(\D.*)/);

        if (rgs && rgs[2] && !skillTemp.has(rgs[2])) {
          skillTemp.set(rgs[2], skillData[key]);
        }
      }
    }
  };

  var replaceMonsterName = function replaceMonsterName(item, key) {
    var name = item[key].replace(/^Lvl?\s?[\d?]+\s+/, '');

    if (bossNameMap$1.has(name)) {
      var trans = bossNameMap$1.get(name);
      item[key] = item[key].replace(name, trans);
    }
  };

  var transBossName = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (data && isArray_1(data.param)) {
                data.param.forEach(function (item) {
                  replaceMonsterName(item, 'monster');
                  replaceMonsterName(item.name, 'en');
                  replaceMonsterName(item.name, 'ja');
                });
              }

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function transBossName(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var battle = /*#__PURE__*/function () {
    var _battle = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, mode) {
      var ability, scenario, spms, abKey, item, key, arr, skill, _name2, trans, tsDetail, npcId, state$1, skillData, index, _key, _arr, _skill, _name3, _getPlusStr, _getPlusStr2, plus1, plus2, _name, _trans, tsName, _tsDetail, _trans2, _tsName, _tsDetail2, _key2, _arr2, _skill2, _name4, detail, param, _index, _iterator, _step, _item, _npcId, _state, _skillData, _name5, _getPlusStr3, _getPlusStr4, _plus, _plus2, _name6, _trans3, _tsName2, _tsDetail3, _trans4, _tsName3, _tsDetail4, _name7, _detail, _iterator2, _step2, _item2, scKey, _item3, _trans5, _getPlusStr5, _getPlusStr6, _plus3, _trans6, _getPlusStr7, _getPlusStr8, _plus4, _getPlusStr9, _getPlusStr10, _plus5, _plus6, _name8, _trans7, _tsName4, _tsDetail5;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (config.battleTrans) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", data);

            case 2:
              _context2.next = 4;
              return getBossName();

            case 4:
              bossNameMap$1 = _context2.sent;

              if (!(mode === 'result')) {
                _context2.next = 9;
                break;
              }

              if (isObject_1(data.status)) {
                ability = data.status.ability;
                spms = data.status.skip_special_motion_setting;
              }

              _context2.next = 15;
              break;

            case 9:
              ability = data.ability;
              spms = data.skip_special_motion_setting;
              data.temporary_potion_all_name = '群体回复药水';
              data.temporary_potion_one_name = '治疗药水';
              _context2.next = 15;
              return transBossName(data.boss);

            case 15:
              if (isArray_1(spms)) {
                spms.forEach(function (item) {
                  posMap.set(item.pos, item.setting_id);
                });
              }

              if (isObject_1(data.scenario)) scenario = data.scenario;
              _context2.next = 19;
              return getCommSkillMap();

            case 19:
              if (!isObject_1(ability)) {
                _context2.next = 120;
                break;
              }

              _context2.t0 = regeneratorRuntime.keys(ability);

            case 21:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 120;
                break;
              }

              abKey = _context2.t1.value;
              item = ability[abKey];

              if (!(item && isObject_1(item.list))) {
                _context2.next = 118;
                break;
              }

              if (!(item.mode === 'player')) {
                _context2.next = 52;
                break;
              }

              _context2.t2 = regeneratorRuntime.keys(item.list);

            case 27:
              if ((_context2.t3 = _context2.t2()).done) {
                _context2.next = 50;
                break;
              }

              key = _context2.t3.value;
              arr = item.list[key];
              skill = arr[0];

              if (!(skill && skill['ability-name'])) {
                _context2.next = 48;
                break;
              }

              _name2 = skill['ability-name'];
              _context2.next = 35;
              return getSkillData$1(_name2);

            case 35:
              trans = _context2.sent;

              if (!trans) {
                _context2.next = 42;
                break;
              }

              if (!skillTemp.has(_name2)) skillTemp.set(_name2, trans);
              skill['ability-name'] = trans.name;
              skill['text-data'] = trans.detail;
              _context2.next = 47;
              break;

            case 42:
              _context2.next = 44;
              return transSkill(skill['text-data'], state);

            case 44:
              tsDetail = _context2.sent;
              skill['text-data'] = tsDetail;
              if (!skillTemp.has(_name2)) skillTemp.set(_name2, {
                name: _name2,
                detail: tsDetail
              });

            case 47:
              skill['duration-type'] = replaceTurn(skill['duration-type']);

            case 48:
              _context2.next = 27;
              break;

            case 50:
              _context2.next = 118;
              break;

            case 52:
              if (!(item.mode === 'npc')) {
                _context2.next = 118;
                break;
              }

              npcId = posMap.get(item.pos);
              _context2.next = 56;
              return getSkillData(npcId);

            case 56:
              state$1 = _context2.sent;
              skillData = state$1.skillMap.get(npcId);

              if (!(skillData && isObject_1(item.list))) {
                _context2.next = 104;
                break;
              }

              collectNpcSkill(skillData);
              index = 0;
              _context2.t4 = regeneratorRuntime.keys(item.list);

            case 62:
              if ((_context2.t5 = _context2.t4()).done) {
                _context2.next = 102;
                break;
              }

              _key = _context2.t5.value;
              index++;
              _arr = item.list[_key];
              _skill = _arr[0];

              if (!(_skill && _skill['ability-name'])) {
                _context2.next = 100;
                break;
              }

              _name3 = _skill['ability-name'];
              _getPlusStr = getPlusStr(_name3), _getPlusStr2 = _slicedToArray(_getPlusStr, 3), plus1 = _getPlusStr2[0], plus2 = _getPlusStr2[1], _name = _getPlusStr2[2];

              if (!skillData["skill-".concat(_name)]) {
                _context2.next = 86;
                break;
              }

              _trans = skillData["skill-".concat(_name).concat(plus2)];
              if (!_trans) _trans = skillData["skill-".concat(_name)];
              tsName = _name3;
              _tsDetail = _skill['text-data'];

              if (_trans) {
                if (_trans.name) tsName = _trans.name + plus1;
                if (_trans.detail) _tsDetail = _trans.detail;
              }

              if (!(_tsDetail === _skill['text-data'])) {
                _context2.next = 81;
                break;
              }

              _context2.next = 79;
              return transSkill(_skill['text-data'], state$1);

            case 79:
              _tsDetail = _context2.sent;
              _skill['text-data'] = _tsDetail;

            case 81:
              _skill['ability-name'] = tsName;
              _skill['text-data'] = _tsDetail;
              skillTemp.set(_name3, {
                name: getPlusStr(tsName)[2],
                detail: _tsDetail
              });
              _context2.next = 99;
              break;

            case 86:
              _trans2 = skillData["skill-".concat(index).concat(plus2)];
              if (!_trans2) _trans2 = skillData["skill-".concat(index)];
              _tsName = _name3;
              _tsDetail2 = _skill['text-data'];

              if (_trans2) {
                if (_trans2.name) _tsName = _trans2.name + plus1;
                if (_trans2.detail) _tsDetail2 = _trans2.detail;
              }

              if (!(_tsDetail2 === _skill['text-data'])) {
                _context2.next = 96;
                break;
              }

              _context2.next = 94;
              return transSkill(_skill['text-data'], state$1);

            case 94:
              _tsDetail2 = _context2.sent;
              _skill['text-data'] = _tsDetail2;

            case 96:
              _skill['ability-name'] = _tsName;
              _skill['text-data'] = _tsDetail2;
              skillTemp.set(_name3, {
                name: getPlusStr(_tsName)[2],
                detail: _tsDetail2
              });

            case 99:
              _skill['duration-type'] = replaceTurn(_skill['duration-type']);

            case 100:
              _context2.next = 62;
              break;

            case 102:
              _context2.next = 118;
              break;

            case 104:
              _context2.t6 = regeneratorRuntime.keys(item.list);

            case 105:
              if ((_context2.t7 = _context2.t6()).done) {
                _context2.next = 118;
                break;
              }

              _key2 = _context2.t7.value;
              _arr2 = item.list[_key2];
              _skill2 = _arr2[0];

              if (!(_skill2 && _skill2['ability-name'] && _skill2['text-data'])) {
                _context2.next = 116;
                break;
              }

              _name4 = _skill2['ability-name'];
              _context2.next = 113;
              return transSkill(_skill2['text-data'], state$1);

            case 113:
              detail = _context2.sent;
              _skill2['text-data'] = detail;
              skillTemp.set(_name4, {
                name: getPlusStr(_name4)[2],
                detail: detail
              });

            case 116:
              _context2.next = 105;
              break;

            case 118:
              _context2.next = 21;
              break;

            case 120:
              if (!(mode !== 'result' && data.player && isArray_1(data.player.param))) {
                _context2.next = 189;
                break;
              }

              param = data.player.param;
              _index = 0;
              _iterator = _createForOfIteratorHelper(param);
              _context2.prev = 124;

              _iterator.s();

            case 126:
              if ((_step = _iterator.n()).done) {
                _context2.next = 181;
                break;
              }

              _item = _step.value;
              _npcId = posMap.get(_index);
              _index++;
              _context2.next = 132;
              return getSkillData(_npcId);

            case 132:
              _state = _context2.sent;
              _skillData = _state.skillMap.get(_npcId);

              if (!_skillData) {
                _context2.next = 171;
                break;
              }

              collectNpcSkill(_skillData);

              if (_item.name && _skillData.npc && _skillData.npc.name) {
                _item.name = _skillData.npc.name;
              }

              if (!_item['special_skill']) {
                _context2.next = 169;
                break;
              }

              _name5 = _item['special_skill'];
              _getPlusStr3 = getPlusStr(_name5), _getPlusStr4 = _slicedToArray(_getPlusStr3, 3), _plus = _getPlusStr4[0], _plus2 = _getPlusStr4[1], _name6 = _getPlusStr4[2];

              if (!_skillData["special-".concat(_name6)]) {
                _context2.next = 156;
                break;
              }

              _trans3 = _skillData["special-".concat(_name6).concat(_plus2)];
              if (!_trans3) _trans3 = _skillData["special-".concat(_name6)];
              _tsName2 = _name5;
              _tsDetail3 = _item['special_comment'];

              if (_trans3) {
                if (_trans3.name) _tsName2 = _trans3.name + _plus;
                if (_trans3.detail) _tsDetail3 = _trans3.detail;
              }

              if (!(_tsDetail3 === _item['special_comment'])) {
                _context2.next = 151;
                break;
              }

              _context2.next = 149;
              return transSkill(_item['special_comment'], _state);

            case 149:
              _tsDetail3 = _context2.sent;
              _item['special_comment'] = _tsDetail3;

            case 151:
              _item['special_skill'] = _tsName2;
              _item['special_comment'] = _tsDetail3;
              skillTemp.set(_name5, {
                name: getPlusStr(_tsName2)[2],
                detail: _tsDetail3
              });
              _context2.next = 169;
              break;

            case 156:
              _trans4 = _skillData["special".concat(_plus2)];
              if (!_trans4) _trans4 = _skillData["special"];
              _tsName3 = _name5;
              _tsDetail4 = _item['special_comment'];

              if (_trans4) {
                if (_trans4.name) _tsName3 = _trans4.name + _plus;
                if (_trans4.detail) _tsDetail4 = _trans4.detail;
              }

              if (!(_tsDetail4 === _item['special_comment'])) {
                _context2.next = 166;
                break;
              }

              _context2.next = 164;
              return transSkill(_item['special_comment'], _state);

            case 164:
              _tsDetail4 = _context2.sent;
              _item['special_comment'] = _tsDetail4;

            case 166:
              _item['special_skill'] = _tsName3;
              _item['special_comment'] = _tsDetail4;
              skillTemp.set(_name5, {
                name: getPlusStr(_tsName3)[2],
                detail: _tsDetail4
              });

            case 169:
              _context2.next = 179;
              break;

            case 171:
              if (!(_item['special_skill'] && _item['special_comment'])) {
                _context2.next = 178;
                break;
              }

              _name7 = _item['special_skill'];
              _context2.next = 175;
              return transSkill(_item['special_comment'], _state);

            case 175:
              _detail = _context2.sent;
              _item['special_comment'] = _detail;
              skillTemp.set(_name7, {
                name: getPlusStr(_name7)[2],
                detail: _detail
              });

            case 178:
              if (_item.name && bossNameMap$1.has(_item.name)) {
                _item.name = bossNameMap$1.get(_item.name);
              }

            case 179:
              _context2.next = 126;
              break;

            case 181:
              _context2.next = 186;
              break;

            case 183:
              _context2.prev = 183;
              _context2.t8 = _context2["catch"](124);

              _iterator.e(_context2.t8);

            case 186:
              _context2.prev = 186;

              _iterator.f();

              return _context2.finish(186);

            case 189:
              if (!(data.summon && isArray_1(data.summon))) {
                _context2.next = 214;
                break;
              }

              _iterator2 = _createForOfIteratorHelper(data.summon);
              _context2.prev = 191;

              _iterator2.s();

            case 193:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 206;
                break;
              }

              _item2 = _step2.value;

              if (!_item2) {
                _context2.next = 204;
                break;
              }

              if (!_item2.comment) {
                _context2.next = 200;
                break;
              }

              _context2.next = 199;
              return transSkill(_item2.comment, state);

            case 199:
              _item2.comment = _context2.sent;

            case 200:
              if (!_item2.protection) {
                _context2.next = 204;
                break;
              }

              _context2.next = 203;
              return transSkill(_item2.protection, state);

            case 203:
              _item2.protection = _context2.sent;

            case 204:
              _context2.next = 193;
              break;

            case 206:
              _context2.next = 211;
              break;

            case 208:
              _context2.prev = 208;
              _context2.t9 = _context2["catch"](191);

              _iterator2.e(_context2.t9);

            case 211:
              _context2.prev = 211;

              _iterator2.f();

              return _context2.finish(211);

            case 214:
              if (!(data.supporter && data.supporter.name)) {
                _context2.next = 224;
                break;
              }

              _context2.next = 217;
              return transSkill(data.supporter.comment, state);

            case 217:
              data.supporter.comment = _context2.sent;
              _context2.next = 220;
              return transSkill(data.supporter.detail, state);

            case 220:
              data.supporter.detail = _context2.sent;
              _context2.next = 223;
              return transSkill(data.supporter.protection, state);

            case 223:
              data.supporter.protection = _context2.sent;

            case 224:
              if (!scenario) {
                _context2.next = 262;
                break;
              }

              _context2.t10 = regeneratorRuntime.keys(scenario);

            case 226:
              if ((_context2.t11 = _context2.t10()).done) {
                _context2.next = 262;
                break;
              }

              scKey = _context2.t11.value;
              _item3 = scenario[scKey];

              if (!(_item3 && _item3.name)) {
                _context2.next = 260;
                break;
              }

              if (!(_item3.cmd === 'ability')) {
                _context2.next = 236;
                break;
              }

              _trans5 = skillTemp.get(_item3.name);
              _getPlusStr5 = getPlusStr(_item3.name), _getPlusStr6 = _slicedToArray(_getPlusStr5, 1), _plus3 = _getPlusStr6[0];

              if (_trans5) {
                _item3.name = _trans5.name + _plus3;
                _item3.comment = _trans5.detail;
              }

              _context2.next = 260;
              break;

            case 236:
              if (!(_item3.cmd === 'special_npc')) {
                _context2.next = 242;
                break;
              }

              _trans6 = skillTemp.get(_item3.name);
              _getPlusStr7 = getPlusStr(_item3.name), _getPlusStr8 = _slicedToArray(_getPlusStr7, 1), _plus4 = _getPlusStr8[0];

              if (_trans6) {
                _item3.name = _trans6.name + _plus4;
              }

              _context2.next = 260;
              break;

            case 242:
              if (!(_item3.cmd === 'special_change')) {
                _context2.next = 259;
                break;
              }

              _getPlusStr9 = getPlusStr(_item3.name), _getPlusStr10 = _slicedToArray(_getPlusStr9, 3), _plus5 = _getPlusStr10[0], _plus6 = _getPlusStr10[1], _name8 = _getPlusStr10[2];
              _trans7 = skillTemp.get(_item3.name);
              if (!_trans7) _trans7 = skillTemp.get(_name8);
              _tsName4 = _item3.name;
              _tsDetail5 = _item3.text;

              if (_trans7) {
                if (_trans7.name) _tsName4 = _trans7.name + _plus5;
                if (_trans7.detail) _tsDetail5 = _trans7.detail;
              }

              if (!(_tsDetail5 === _item3.text)) {
                _context2.next = 254;
                break;
              }

              _context2.next = 252;
              return transSkill(_item3.text, state);

            case 252:
              _tsDetail5 = _context2.sent;
              _item3.text = _tsDetail5;

            case 254:
              _item3.name = _tsName4;
              _item3.text = _tsDetail5;
              skillTemp.set(name, {
                name: getPlusStr(_tsName4)[2],
                detail: _tsDetail5
              });
              _context2.next = 260;
              break;

            case 259:
              if (_item3.cmd === 'boss_gauge') {
                replaceMonsterName(_item3.name, 'ja');
                replaceMonsterName(_item3.name, 'en');
              }

            case 260:
              _context2.next = 226;
              break;

            case 262:
              return _context2.abrupt("return", data);

            case 263:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[124, 183, 186, 189], [191, 208, 211, 214]]);
    }));

    function battle(_x2, _x3) {
      return _battle.apply(this, arguments);
    }

    return battle;
  }();

  var transBattle = race(battle);

  var transBattleR = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return transBattle(data, 'result');

            case 2:
              return _context3.abrupt("return", _context3.sent);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function transBattleR(_x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  var autoTrans = function autoTrans(skill) {
    if (!skill.comment) return;
    skill.comment = transSkill(skill.comment, state);
  };

  var weaponSkill = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getCommSkillMap();

            case 2:
              if (data.skill1) {
                autoTrans(data.skill1);
              }

              if (data.skill2) {
                autoTrans(data.skill2);
              }

              if (data.special_skill) {
                autoTrans(data.special_skill);
              }

              return _context.abrupt("return", data);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function weaponSkill(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var autoTrans$1 = function autoTrans(skill, type) {
    if (!skill.comment) return;
    skill.comment = transSkill(skill.comment, state);

    if (type === 'call') {
      if (skill.recast_comment) skill.recast_comment = replaceTurn(skill.recast_comment);
      if (skill.start_recast_comment) skill.start_recast_comment = replaceTurn(skill.start_recast_comment);
    }
  };

  var summonSkill = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getCommSkillMap();

            case 2:
              if (data.skill) {
                autoTrans$1(data.skill);
              }

              if (data.sub_skill) {
                autoTrans$1(data.sub_skill);
              }

              if (data.special_skill) {
                autoTrans$1(data.special_skill, 'call');
              }

              return _context.abrupt("return", data);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function summonSkill(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var comicMap = new Map();
  var loaded$b = false;

  var getComicData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$b) {
                _context.next = 9;
                break;
              }

              _context.next = 3;
              return fetch('https://gbf.danmu9.com/4ko.json');

            case 3:
              res = _context.sent;
              _context.next = 6;
              return res.json();

            case 6:
              list = _context.sent;
              list.forEach(function (arr) {
                var id = arr[0];
                var title = filter(arr[1]);
                var url = "https://gbf.danmu9.com/4ko/".concat(id, ".jpg");

                if (id) {
                  comicMap.set(id, {
                    title: title,
                    url: url
                  });
                }
              });
              loaded$b = true;

            case 9:
              return _context.abrupt("return", comicMap);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getComicData() {
      return _ref.apply(this, arguments);
    };
  }();

  var insertTemplate = function insertTemplate(html) {
    return html.replace('<div class="prt-episode-thumbnail">', "<% if (n.trans) { %><div class=\"comic-transtag-blhxfy\">\uD83C\uDF3C</div><% } %><div class=\"prt-episode-thumbnail\">");
  };

  var comic = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, pathname) {
      var type,
          html,
          comicMap,
          key,
          item,
          id,
          rgs,
          _id,
          _comicMap,
          info,
          _html,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              type = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'default';

              if (!(type === 'template')) {
                _context.next = 13;
                break;
              }

              _context.prev = 2;
              html = decodeURIComponent(data.data);
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](2);
              return _context.abrupt("return", data);

            case 9:
              html = insertTemplate(html);
              data.data = encodeURIComponent(html);
              _context.next = 38;
              break;

            case 13:
              if (!(type === 'data')) {
                _context.next = 20;
                break;
              }

              _context.next = 16;
              return getComicData();

            case 16:
              comicMap = _context.sent;

              if (data.list) {
                for (key in data.list) {
                  item = data.list[key];
                  id = parseInt(item.id);

                  if (comicMap.has(id)) {
                    item.trans = true;
                  }
                }
              }

              _context.next = 38;
              break;

            case 20:
              rgs = pathname.match(/\/comic\/content\/episode\/(\d+)/);

              if (!(rgs && rgs[1])) {
                _context.next = 38;
                break;
              }

              _id = parseInt(rgs[1]);
              _context.next = 25;
              return getComicData();

            case 25:
              _comicMap = _context.sent;
              info = _comicMap.get(_id);

              if (!info) {
                _context.next = 38;
                break;
              }

              _context.prev = 28;
              _html = decodeURIComponent(data.data);
              _context.next = 35;
              break;

            case 32:
              _context.prev = 32;
              _context.t1 = _context["catch"](28);
              return _context.abrupt("return", data);

            case 35:
              if (info.title) {
                _html = _html.replace(/(<div\s+class=["']*prt-episode-title["']*>)[^<]*(<\/div>)/, "$1".concat(info.title, "$2"));
              }

              _html = _html.replace(/(<img\s+class=["']*img-episode["']* src=["']*)[^\s"'>]+(?=[\s"'>])/, "$1".concat(info.url));
              data.data = encodeURIComponent(_html);

            case 38:
              return _context.abrupt("return", data);

            case 39:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 6], [28, 32]]);
    }));

    return function comic(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var transComicT = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, pathname) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return comic(data, pathname, 'template');

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function transComicT(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  var transComicD = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, pathname) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return comic(data, pathname, 'data');

            case 2:
              return _context3.abrupt("return", _context3.sent);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function transComicD(_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }();

  var arcarumMap = new Map();
  var loaded$c = false;

  var getArcarumData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$c) {
                _context.next = 12;
                break;
              }

              _context.next = 3;
              return getLocalData('arcarum');

            case 3:
              csv = _context.sent;

              if (csv) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return fetchWithHash('/blhxfy/data/arcarum.csv');

            case 7:
              csv = _context.sent;
              setLocalData('arcarum', csv);

            case 9:
              list = parseCsv(csv);
              list.forEach(function (item) {
                var ja = trim(item.ja).replace(/<br>/g, '');
                var zh = filter(item.zh);

                if (ja && zh) {
                  arcarumMap.set(ja, zh);
                }
              });
              loaded$c = true;

            case 12:
              return _context.abrupt("return", arcarumMap);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getArcarumData() {
      return _ref.apply(this, arguments);
    };
  }();

  var arcarumMap$1 = new Map();
  var textTempArr = [];
  var debounceLog = debounce_1(function () {
    if (!textTempArr.length) return;
    var text = textTempArr.join(',\n');
    console.log(text + ',');
    textTempArr = [];
  }, 200);

  var replaceText = function replaceText(key, data) {
    if (data && data[key]) {
      var text = data[key].replace(/<br\s?\/?>/gi, '').replace(/\r?\n/g, '');

      if (arcarumMap$1.has(text)) {
        data[key] = arcarumMap$1.get(text);
      } else {
        var _text = data[key].replace(/\r?\n/g, '');

        if (!textTempArr.includes(_text)) {
          textTempArr.push(_text);
        }

        debounceLog();
      }
    }
  };

  var replaceListText = function replaceListText(key, list) {
    if (list && list.length) {
      list.forEach(function (item) {
        if (Array.isArray(key)) {
          key.forEach(function (k) {
            replaceText(k, item);
          });
        } else {
          replaceText(key, item);
        }
      });
    }
  };

  var transDivisionList = function transDivisionList(list) {
    for (var key in list) {
      var item = list[key];
      replaceText('text', item);
      replaceListText('message', item.gatepost_list);
      replaceListText('message', item.chest_list);

      for (var qlk in item.quest_list) {
        replaceText('quest_name', item.quest_list[qlk]);
        replaceText('chapter_name', item.quest_list[qlk]);
      }
    }
  };

  var transArcarum = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var key, obj;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getArcarumData();

            case 2:
              arcarumMap$1 = _context.sent;
              replaceText('group_name', data.condition);
              replaceText('name', data.stage);

              if (data.map && data.map.division_list) {
                transDivisionList(data.map.division_list);
              }

              if (data.notice_effect) {
                for (key in data.notice_effect) {
                  obj = data.notice_effect[key];

                  if (obj && obj.maps) {
                    obj.maps.forEach(function (map) {
                      if (map.division_list) {
                        transDivisionList(map.division_list);
                      }
                    });
                  }
                }
              }

              return _context.abrupt("return", data);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function transArcarum(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var replaceTime = function replaceTime(str) {
    if (!str) return str;
    return str.replace('時間', '小时');
  };

  var pageIndex = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var messages, mydata, status, newMessages, phraseMap;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              mydata = data.option.mydata_assets.mydata;
              messages = mydata.mypage_notification_list;
              status = mydata.status;
              _context.next = 9;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context["catch"](0);
              return _context.abrupt("return", data);

            case 9:
              if (!messages.length) {
                _context.next = 16;
                break;
              }

              newMessages = [];
              _context.next = 13;
              return getPhrase();

            case 13:
              phraseMap = _context.sent;
              messages.forEach(function (item) {
                if (phraseMap.has(item.text)) {
                  item.text = phraseMap.get(item.text);
                }

                if (item.url !== 'news/detail/1/20002') {
                  newMessages.push(item);
                }
              });
              mydata.mypage_notification_list = newMessages;

            case 16:
              status.action_point_remain = replaceTime(status.action_point_remain);
              status.battle_point_remain = replaceTime(status.battle_point_remain);
              return _context.abrupt("return", data);

            case 19:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 6]]);
    }));

    return function pageIndex(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var replaceHour = function replaceHour(data, type) {
    if (!data.status && (!data.option || !data.option.user_status)) {
      return data;
    }

    var status;

    try {
      if (type === 'user') {
        status = data.status;
      } else {
        status = data.option.user_status;
      }
    } catch (e) {
      return data;
    }

    if (status) {
      if (status.action_point_remain) status.action_point_remain = replaceTime(status.action_point_remain);
      if (status.battle_point_remain) status.battle_point_remain = replaceTime(status.battle_point_remain);
    }

    return data;
  };

  var replaceHourU = function replaceHourU(data) {
    return replaceHour(data, 'user');
  };

  var voiceMap = new Map();
  var loaded$d = false;

  var getTownData$1 = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$d) {
                _context.next = 7;
                break;
              }

              _context.next = 3;
              return fetchWithHash('/blhxfy/data/voice-mypage.csv');

            case 3:
              csv = _context.sent;
              list = parseCsv(csv);
              list.forEach(function (item) {
                var path = trim(item.path);
                var trans = filter(item.trans);
                var duration = trim(item.duration) || 10;

                if (path && trans) {
                  voiceMap.set(path, {
                    trans: trans,
                    duration: duration
                  });
                }
              });
              loaded$d = true;

            case 7:
              return _context.abrupt("return", voiceMap);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getTownData() {
      return _ref.apply(this, arguments);
    };
  }();

  var voiceList = [];

  var saveList = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      var obj, key, item, vkey, voice;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              obj = data.data;

              for (key in obj) {
                item = obj[key];

                for (vkey in item) {
                  voice = item[vkey].replace(/\.[\w\d]+$/, '');

                  if (!voiceList.includes(voice)) {
                    voiceList.push(voice);
                  }
                }
              }

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function saveList(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var createBox = function createBox() {
    var box = document.createElement('div');
    box.id = 'box-sub-blhxfy';
    box.innerHTML = '<div></div>';
    return box;
  };

  var hideTimer = null;

  var hideBox = function hideBox() {
    var box = document.getElementById('box-sub-blhxfy');
    if (!box) return;
    box.style.pointerEvents = 'none';
    box.style.opacity = 0;
    box.style.transition = 'opacity 1.5s';
    clearTimeout(hideTimer);
  };

  var setSubBox = function setSubBox(text, duration) {
    var cont = document.querySelector('.cnt-mypage') || document.querySelector('.cnt-detail .prt-image');
    if (!cont) return;
    var box = document.getElementById('box-sub-blhxfy');

    if (!box) {
      box = createBox();
      cont.appendChild(box);
    }

    var _text = text;

    if (config.userName && (config.userName !== '姬塔' || config.userName !== '古兰')) {
      _text = _text.replace(/(团长|姬塔)/g, config.displayName || config.userName);
    }

    box.querySelector('div').innerText = _text.replace(/\\n/g, '\n');
    setTimeout(function () {
      box.style.opacity = 1;
      box.style.pointerEvents = 'auto';
      box.style.transition = 'opacity 0.5s';
    }, 100);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideBox, duration * 1000);
    box.removeEventListener('click', hideBox);
    box.addEventListener('click', hideBox);
  };

  var showSub = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(src) {
      var voice, voiceMap, data;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (src) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              hideBox();
              voice = src.replace(/\.[\w\d]+$/, '');

              if (voiceList.includes(voice)) {
                _context2.next = 6;
                break;
              }

              return _context2.abrupt("return");

            case 6:
              _context2.next = 8;
              return getTownData$1();

            case 8:
              voiceMap = _context2.sent;

              if (voiceMap.has(voice)) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt("return");

            case 11:
              data = voiceMap.get(voice);
              setSubBox(data.trans, data.duration);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function showSub(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var setFont = function setFont() {
    var css = "@font-face {\n    font-family: 'blhxwf';\n    font-style: normal;\n    font-weight: normal;\n    src: url('".concat(config.origin, "/blhxfy/data/static/webfont.woff2');\n  }\n  #box-sub-blhxfy {\n    font-family: blhxwf, sans-serif;\n  }");
    var tag = document.createElement('style');
    tag.innerHTML = css;
    document.head.appendChild(tag);
  };

  var soundInjected = false;

  function showVoiceSub(_x3, _x4, _x5) {
    return _showVoiceSub.apply(this, arguments);
  }

  function _showVoiceSub() {
    _showVoiceSub = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data, pathname, type) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!soundInjected) {
                require(['model/sound'], function (sound) {
                  var playVoice = sound.prototype.playVoice;

                  sound.prototype.playVoice = function (src, force) {
                    if (!Game.setting.sound_flag) return;
                    showSub(src);
                    playVoice.call(this, src, force);
                  };
                });

                setFont();
              }

              soundInjected = true;

              if (!(type === 'list')) {
                _context4.next = 7;
                break;
              }

              _context4.next = 5;
              return saveList(data);

            case 5:
              _context4.next = 9;
              break;

            case 7:
              _context4.next = 9;
              return showSub(pathname);

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _showVoiceSub.apply(this, arguments);
  }

  var showVoiceSubL = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data, pathname) {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return showVoiceSub(data, pathname, 'list');

            case 2:
              return _context3.abrupt("return", _context3.sent);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function showVoiceSubL(_x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }();

  var getUserName = function getUserName(data) {
    var html = decodeURIComponent(data.data);
    var rgs = html.match(/<span\sclass="txt-user-name">([^<]+)<\/span>/);

    if (rgs && rgs[1]) {
      config.userName = rgs[1];
      localStorage.setItem('blhxfy:name', rgs[1]);
    }
  };

  var setUserName = function setUserName() {
    if ((!config.userName || config.userName === '<span>古兰</span>') && Game.userId && location.hash !== '#tutorial/4' && location.hash !== '#tutorial/6' && location.hash !== '#tutorial/8') {
      require(['model/content'], function (mc) {
        var req = new mc({
          controller: "profile",
          action: "index",
          param: {
            user_id: Game.userId
          }
        });
        req.fetch();
      });

      config.userName = '<span>古兰</span>';
      localStorage.setItem('blhxfy:name', config.userName);
    }
  };

  var getLocalName = function getLocalName() {
    var name = localStorage.getItem('blhxfy:name');
    if (name) config.userName = filter(name);
  };

  getLocalName();

  var nameMap;

  var getName = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var chapterName;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (nameMap) {
                _context.next = 8;
                break;
              }

              _context.next = 3;
              return fetchWithHash('/blhxfy/data/chapter-name.json');

            case 3:
              chapterName = _context.sent;
              nameMap = new Map(chapterName);
              nameMap.set('エンディング', '终章');
              nameMap.set('オープニング', '序章');
              nameMap.set('信頼度エピソード', '信赖度剧情');

            case 8:
              return _context.abrupt("return", nameMap);

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getName() {
      return _ref.apply(this, arguments);
    };
  }();

  var chapterList = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data) {
      var list, nameMap;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              list = data.chapter_list;

              if (list) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return");

            case 3:
              _context2.next = 5;
              return getName();

            case 5:
              nameMap = _context2.sent;
              list.forEach(function (item) {
                var name = item.chapter_name;

                if (nameMap.has(name)) {
                  item.chapter_name = nameMap.get(name);
                }
              });

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function chapterList(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var npcChapterList = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
      var nameMap, key, item, name;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return getName();

            case 2:
              nameMap = _context3.sent;

              if (data.scenes) {
                for (key in data.scenes) {
                  item = data.scenes[key];
                  name = item.scene_name;

                  if (nameMap.has(name)) {
                    item.scene_name = nameMap.get(name);
                  }
                }
              }

              if (data.episode) {
                data.episode.forEach(function (item) {
                  var name = item.chapter_name;

                  if (nameMap.has(name)) {
                    item.chapter_name = nameMap.get(name);
                  }
                });
              }

              if (data.other_episode) {
                if (nameMap.has(data.other_episode.title)) {
                  data.other_episode.title = nameMap.get(data.other_episode.title);
                }

                if (data.other_episode.list) {
                  data.other_episode.list.forEach(function (item) {
                    var name = item.scene_name;

                    if (nameMap.has(name)) {
                      item.scene_name = nameMap.get(name);
                    }
                  });
                }
              }

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function npcChapterList(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();

  var arcarumSceneName = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(data) {
      var nameMap;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getName();

            case 2:
              nameMap = _context4.sent;

              if (data.option.scenes) {
                data.option.scenes.forEach(function (item) {
                  var name = item.scene_name;

                  if (nameMap.has(name)) {
                    item.scene_name = nameMap.get(name);
                  }
                });
              }

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function arcarumSceneName(_x3) {
      return _ref4.apply(this, arguments);
    };
  }();

  var episodeList = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(data) {
      var nameMap, name, key, item;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return getName();

            case 2:
              nameMap = _context5.sent;
              name = data.chapter_name;

              if (nameMap.has(name)) {
                data.chapter_name = nameMap.get(name);
              }

              for (key in data.list) {
                item = data.list[key];
                item.episode_name = item.episode_name.replace(/エピソード (\d+)/, '第 $1 节');
              }

            case 6:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function episodeList(_x4) {
      return _ref5.apply(this, arguments);
    };
  }();

  var battleNoteMap = new Map();
  var loaded$e = false;

  var getBattleNote = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$e) {
                _context.next = 12;
                break;
              }

              _context.next = 3;
              return getLocalData('battle/battle-note');

            case 3:
              csv = _context.sent;

              if (csv) {
                _context.next = 9;
                break;
              }

              _context.next = 7;
              return fetchWithHash('/blhxfy/data/battle/battle-note.csv');

            case 7:
              csv = _context.sent;
              setLocalData('battle/battle-note', csv);

            case 9:
              list = parseCsv(csv);
              list.forEach(function (item) {
                var text = trim(item.text);
                var trans = filter(item.trans);

                if (text && trans) {
                  battleNoteMap.set(text, trans);
                }
              });
              loaded$e = true;

            case 12:
              return _context.abrupt("return", battleNoteMap);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getBattleNote() {
      return _ref.apply(this, arguments);
    };
  }();

  var battleNoteQuestMapId = {};
  var questNote;

  var getBattleNoteQuest = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
      var questNoteData, csv, list, battleNoteQuestMap;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!battleNoteQuestMapId[id]) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", battleNoteQuestMapId[id]);

            case 2:
              if (questNote) {
                _context2.next = 6;
                break;
              }

              _context2.next = 5;
              return getLocalData('battle-note.json');

            case 5:
              questNote = _context2.sent;

            case 6:
              if (questNote) {
                _context2.next = 11;
                break;
              }

              _context2.next = 9;
              return fetchWithHash('/blhxfy/data/battle-note.json');

            case 9:
              questNote = _context2.sent;
              setLocalData('battle-note.json', questNote);

            case 11:
              if (!questNote[id]) {
                _context2.next = 24;
                break;
              }

              questNoteData = getLocalData('battle-note-quest');

              if (!(!questNoteData || !questNoteData[id])) {
                _context2.next = 19;
                break;
              }

              _context2.next = 16;
              return fetchWithHash("/blhxfy/data/battle/note/".concat(questNote[id]));

            case 16:
              csv = _context2.sent;
              questNoteData = _defineProperty({}, id, csv);
              setLocalData('battle-note-quest', questNoteData);

            case 19:
              list = parseCsv(questNoteData[id]);
              battleNoteQuestMap = new Map();
              list.forEach(function (item) {
                var text = trim(item.text);
                var trans = filter(item.trans);

                if (text && trans) {
                  battleNoteQuestMap.set(text, trans);
                }
              });
              battleNoteQuestMapId[id] = battleNoteQuestMap;
              return _context2.abrupt("return", battleNoteQuestMap);

            case 24:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function getBattleNoteQuest(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  var questMap = new Map();
  var battleQuestNoteMap;
  var battleNoteMap$1 = new Map();
  var rid = 0;

  var getQuestId = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, pathname) {
      var questId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!pathname.endsWith('start.json')) {
                _context.next = 8;
                break;
              }

              if (!data.quest_id) {
                _context.next = 7;
                break;
              }

              questId = parseInt(data.quest_id);
              questMap.set(data.raid_id, questId);
              _context.next = 6;
              return getBattleNoteQuest(questId);

            case 6:
              battleQuestNoteMap = _context.sent;

            case 7:
              rid = data.raid_id;

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getQuestId(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var reList = [[/(Lv.+\s)?(.+)が真の力を解放した！/, '$1$2释放了真正的力量！', {
    2: 'name'
  }], [/(Lv.+\s)?(.+)の特殊行動が発動！/, '$1$2的特殊行动发动了！', {
    2: 'name'
  }], [/(Lv.+\s)?(.+)が更なる力を覚醒させた！/, '$1$2唤醒了更强的力量！', {
    2: 'name'
  }], [/(Lv.+\s)?(.+)のCTがMAXになった。/, '$1$2的CT达到了MAX。', {
    2: 'name'
  }], [/(Lv.+\s)?(.+)は麻痺していて動けない！/, '$1$2因麻痹效果无法行动！', {
    2: 'name'
  }], [/>(.+)の効果により(.+)が復活した！/, '>因$1的效果$2复活了！', {
    1: 'skill',
    2: 'name'
  }], [/(.+)を喚べますよ！/, '现在可以召唤$1了！', {
    1: 'name'
  }], [/(.+)召喚、いけます！/, '$1召唤，准备就绪！', {
    1: 'name'
  }], [/(Lv.+\s)?(.+)は眠っていて動けない！/, '$1$2因睡眠效果无法行动！', {
    2: 'name'
  }], [/(Lv.+\s)?(.+)は魅了されていて動けない！/, '$1$2因魅惑效果无法行动！', {
    2: 'name'
  }]];
  var textList = [];

  var transNote = function transNote(item, key) {
    if (!isObject_1(item)) return;
    var text = trim(item[key]);
    if (!text && !isString_1(text)) return;
    text = text.replace(config.userName, '姬塔');
    text = text.replace(/\r?\n/g, '');

    if (battleNoteMap$1.has(text)) {
      var trans = battleNoteMap$1.get(text);
      trans = trans.replace('姬塔', config.displayName || config.userName);
      item[key] = trans;
    } else if (questMap.has(rid) && battleQuestNoteMap && battleQuestNoteMap.has(text)) {
      var _trans = battleQuestNoteMap.get(text);

      _trans = _trans.replace('姬塔', config.displayName || config.userName);
      item[key] = _trans;
    } else {
      reList.forEach(function (reArr) {
        if (reArr[0].test(text)) {
          var _trans2 = reArr[1];
          item[key] = text.replace(reArr[0], function () {
            for (var _len = arguments.length, arr = new Array(_len), _key = 0; _key < _len; _key++) {
              arr[_key] = arguments[_key];
            }

            for (var i = 1; i < arr.length - 2; i++) {
              if (reArr[2][i] === 'name' && bossNameMap$1.has(arr[i])) {
                _trans2 = _trans2.replace("$".concat(i), bossNameMap$1.get(arr[i]));
              } else {
                _trans2 = _trans2.replace("$".concat(i), arr[i] || '');
              }
            }

            _trans2 = _trans2.replace('姬塔', config.displayName || config.userName);
            return _trans2;
          });
        }
      });
    }

    if (config.log && !textList.includes(text)) {
      textList.push(text);
    }
  };

  var win = window.unsafeWindow || window;

  win.printBattleNote = function () {
    var str = 'text,\n' + textList.join(',\n') + ',';

    if (questMap.has(rid)) {
      str = "quest-".concat(questMap.get(rid), ".note.csv\n\n").concat(str);
    }

    console.log(str);
  };

  var startData = function startData(data) {
    if (isArray_1(data.navi_information)) {
      data.navi_information.forEach(function (item) {
        transNote(item, 'text');
      });
    }

    if (!config.userName && isString_1(data.nickname)) {
      config.userName = data.nickname;
      localStorage.setItem('blhxfy:name', data.nickname);
    }

    if (isObject_1(data.battle_condition)) {
      transNote(data.battle_condition, 'body');
    }
  };

  var normalData = function normalData(data) {
    if (isArray_1(data.scenario)) {
      data.scenario.forEach(function (item) {
        if (item.cmd === 'battlelog') {
          if (isString_1(item.body)) {
            transNote(item, 'body');
            transNote(item, 'title');
          } else if (isObject_1(item.body)) {
            transNote(item.body, 'ja');
          } else if (isObject_1(item.title)) {
            transNote(item.title, 'ja');
          }
        } else if (item.cmd === 'navi_information') {
          if (isArray_1(item.details)) {
            item.details.forEach(function (detail) {
              transNote(detail, 'text');
            });
          }
        } else if (item.cmd === 'super') {
          transNote(item, 'name');
        } else if (item.cmd === 'line_message') {
          transNote(item, 'title');
          transNote(item, 'message');
        } else if (item.cmd === 'resurrection') {
          transNote(item, 'title');
          transNote(item, 'comment');
        }
      });
    }

    if (isArray_1(data.navi_information)) {
      data.navi_information.forEach(function (item) {
        transNote(item, 'text');
      });
    }
  };

  var battleNote = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(data, pathname) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return getQuestId(data, pathname);

            case 2:
              _context2.next = 4;
              return getBattleNote();

            case 4:
              battleNoteMap$1 = _context2.sent;

              if (pathname.endsWith('start.json')) {
                startData(data);
              }

              normalData(data);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function battleNote(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  var str = '';

  var storyNavi = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (config.log && data && data.option && data.option.navi) {
                (function () {
                  var naviData = data.option.navi;
                  var npc = naviData.npc_list;
                  var list = [];

                  for (var key in naviData.comment_list) {
                    var synopsis = naviData.episode_status[key].synopsis;
                    list.push({
                      name: "\u7B80\u4ECB ".concat(key),
                      text: synopsis,
                      voice: '',
                      image: ''
                    });
                    var commList = naviData.comment_list[key];

                    for (var npcId in commList) {
                      if (isArray_1(commList[npcId])) {
                        (function () {
                          var name = npc[npcId];
                          commList[npcId].forEach(function (item, index) {
                            list.push({
                              name: "".concat(name).concat(index ? index : ''),
                              text: item.text,
                              voice: item.voice,
                              image: item.img
                            });
                          });
                        })();
                      } else {
                        var item = commList[npcId];
                        list.push({
                          name: item.npc_name,
                          text: item.text,
                          voice: item.voice,
                          image: item.img
                        });
                      }
                    }
                  }

                  str = papaparse_min.unparse(list);
                })();
              }

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function storyNavi(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var win$1 = window.unsafeWindow || window;

  win$1.dlStoryNavi = function () {
    if (!config.log) return;
    var date = new Date();
    tryDownload(str, "story-navi-".concat(date.getFullYear()).concat(date.getMonth() + 1).concat(date.getDate()).concat(date.getHours()).concat(date.getMinutes()).concat(date.getSeconds(), ".csv"));
  };

  var skinMap = new Map();
  var loaded$f = false;

  var getSkinData = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$f) {
                _context.next = 7;
                break;
              }

              _context.next = 3;
              return fetchWithHash('/blhxfy/data/skin.csv');

            case 3:
              csv = _context.sent;
              list = parseCsv(csv);
              list.forEach(function (item) {
                var name = filter(item.name);
                var comment = filter(item.comment);
                var id = item.id;

                if (id && comment) {
                  skinMap.set(id, {
                    name: name,
                    comment: comment
                  });
                }
              });
              loaded$f = true;

            case 7:
              return _context.abrupt("return", skinMap);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getSkinData() {
      return _ref.apply(this, arguments);
    };
  }();

  function transSkin(_x, _x2) {
    return _transSkin.apply(this, arguments);
  }

  function _transSkin() {
    _transSkin = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, pathname) {
      var skinMap, _yield$getNameData, jpNameMap, enNameMap;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getSkinData();

            case 2:
              skinMap = _context.sent;
              _context.next = 5;
              return getNameData();

            case 5:
              _yield$getNameData = _context.sent;
              jpNameMap = _yield$getNameData.jpNameMap;
              enNameMap = _yield$getNameData.enNameMap;
              data.list.forEach(function (char) {
                char.name = transName(char.name, [jpNameMap, enNameMap]);
                char.list_data.forEach(function (item) {
                  var id = item.master.id;

                  if (skinMap.has(id)) {
                    var _data = skinMap.get(id);

                    if (_data.name) item.master.name = _data.name;
                    if (_data.comment) item.master.comment = _data.comment;
                  }
                });
              });
              return _context.abrupt("return", data);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _transSkin.apply(this, arguments);
  }

  function archiveCharName(_x, _x2) {
    return _archiveCharName.apply(this, arguments);
  }

  function _archiveCharName() {
    _archiveCharName = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, pathname) {
      var _yield$getNameData, jpNameMap, enNameMap, key, item;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getNameData();

            case 2:
              _yield$getNameData = _context.sent;
              jpNameMap = _yield$getNameData.jpNameMap;
              enNameMap = _yield$getNameData.enNameMap;

              for (key in data.npc_list) {
                item = data.npc_list[key];
                item.name = transName(item.name, [jpNameMap, enNameMap]);
              }

              return _context.abrupt("return", data);

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _archiveCharName.apply(this, arguments);
  }

  var skinMap$1 = new Map();
  var loaded$g = false;

  var getStoryNpc = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var csv, list;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (loaded$g) {
                _context.next = 7;
                break;
              }

              _context.next = 3;
              return fetchWithHash('/blhxfy/data/story-npc.csv');

            case 3:
              csv = _context.sent;
              list = parseCsv(csv);
              list.forEach(function (item) {
                var comment = filter(item.comment);
                var id = item.id;

                if (id && comment) {
                  skinMap$1.set(id, comment);
                }
              });
              loaded$g = true;

            case 7:
              return _context.abrupt("return", skinMap$1);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function getStoryNpc() {
      return _ref.apply(this, arguments);
    };
  }();

  function storyNpcDetail (_x, _x2) {
    return _ref$1.apply(this, arguments);
  }

  function _ref$1() {
    _ref$1 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, pathname) {
      var _yield$getNameData, jpNameMap, enNameMap, storyNpc;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getNameData();

            case 2:
              _yield$getNameData = _context.sent;
              jpNameMap = _yield$getNameData.jpNameMap;
              enNameMap = _yield$getNameData.enNameMap;
              _context.next = 7;
              return getStoryNpc();

            case 7:
              storyNpc = _context.sent;
              data.name = transName(data.name, [jpNameMap, enNameMap]);

              if (storyNpc.has(data.id)) {
                data.comment = storyNpc.get(data.id);
              }

              return _context.abrupt("return", data);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _ref$1.apply(this, arguments);
  }

  var apiHosts = ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'];

  var requestRouter = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, type, list) {
      var result, _iterator, _step, _step$value, paths, handles, pass, _iterator2, _step2, path, _iterator3, _step3, handle;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              result = false;
              _iterator = _createForOfIteratorHelper(list);
              _context.prev = 2;

              _iterator.s();

            case 4:
              if ((_step = _iterator.n()).done) {
                _context.next = 41;
                break;
              }

              _step$value = _slicedToArray(_step.value, 2), paths = _step$value[0], handles = _step$value[1];
              if (!Array.isArray(paths)) paths = [paths];
              pass = false;
              _iterator2 = _createForOfIteratorHelper(paths);

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  path = _step2.value;

                  if (isString_1(path) && type.includes(path)) {
                    if (!config.storyOnly || storyPath.includes(path)) {
                      pass = true;
                    }
                  } else if (isRegExp_1(path) && path.test(type)) {
                    if (!config.storyOnly) pass = true;
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              if (!pass) {
                _context.next = 39;
                break;
              }

              result = true;
              if (!Array.isArray(handles)) handles = [handles];
              _iterator3 = _createForOfIteratorHelper(handles);
              _context.prev = 14;

              _iterator3.s();

            case 16:
              if ((_step3 = _iterator3.n()).done) {
                _context.next = 31;
                break;
              }

              handle = _step3.value;
              _context.prev = 18;

              if (!isString_1(handle)) {
                _context.next = 22;
                break;
              }

              _context.next = 24;
              break;

            case 22:
              _context.next = 24;
              return handle(data, type);

            case 24:
              _context.next = 29;
              break;

            case 26:
              _context.prev = 26;
              _context.t0 = _context["catch"](18);
              console.log(_context.t0);

            case 29:
              _context.next = 16;
              break;

            case 31:
              _context.next = 36;
              break;

            case 33:
              _context.prev = 33;
              _context.t1 = _context["catch"](14);

              _iterator3.e(_context.t1);

            case 36:
              _context.prev = 36;

              _iterator3.f();

              return _context.finish(36);

            case 39:
              _context.next = 4;
              break;

            case 41:
              _context.next = 46;
              break;

            case 43:
              _context.prev = 43;
              _context.t2 = _context["catch"](2);

              _iterator.e(_context.t2);

            case 46:
              _context.prev = 46;

              _iterator.f();

              return _context.finish(46);

            case 49:
              return _context.abrupt("return", result);

            case 50:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 43, 46, 49], [14, 33, 36, 39], [18, 26]]);
    }));

    return function requestRouter(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  var storyPath = ['scenario', '/profile/content/index/'];
  var requestList = [['/loginbonus/', loginBonus], ['scenario', [setUserName, transScenario]], ['/profile/content/index/', getUserName], ['/content/', [transLangMsg, transHTML, replaceHour]], ['/user/content/index', [transTownInfo, pageIndex]], ['/comic/content/episode/', comic], ['/comic/content/index', transComicT], ['/comic/list/', transComicD], [['/npc/npc/', '/archive/npc_detail'], parseSkill], [['/party_ability_subaction/', '/party/job_equipped/', '/party/ability_list/', '/zenith/ability_list/', '/party/job_info/'], transSkill$1], ['/island/init', transIslandInfo], [['/rest/sound/mypage_voice', '/rest/sound/archive_voice'], showVoiceSubL], [[/\/rest\/(multi)?raid\/start\.json/, /\/rest\/tutorial\/tutorial\d+(_\d+)?\.json/], [transChat, transBattle, battleNote]], [[/\/rest\/(multi)?raid\/ability_result\.json/, /\/rest\/(multi)?raid\/temporary_item_result\.json/, /\/rest\/(multi)?raid\/normal_attack_result\.json/, /\/rest\/(multi)?raid\/summon_result\.json/, /\/rest\/tutorial\/tutorial_battle_\d+(_\d+)?\.json/], [transBattleR, battleNote]], [/\/rest\/.*?raid\/condition\/\d+\/\d\/\d\.json/, transBuff], ['/user/status', replaceHourU], [['/weapon/weapon/', '/archive/weapon_detail'], weaponSkill], [['/summon/summon/', '/archive/summon_detail'], summonSkill], [['/rest/arcarum/move_division', '/rest/arcarum/start_stage', '/rest/arcarum/open_gatepost', '/rest/arcarum/open_chest', '/rest/arcarum/next_stage', '/rest/arcarum/stage'], transArcarum], [/\/story_chapter_list\/\d+(_\d+)?$/, chapterList], [/\/story_episode_list\/\d+(_\d+)?\/\d+(_\d+)?$/, episodeList], ['/archive/npc_detail', npcChapterList], [/^\/arcarum\/content\/summon_enhancement_detail\/\d+(_\d+)?$/, arcarumSceneName], ['/rest_shop_exchange_treasure/article_labels/', shopLabel], [/\/content\/navi/, storyNavi], [/^\/skin\/list\/\d+/, transSkin], [/^\/archive\/npc_list/, archiveCharName], [/^\/archive\/story_npc_detail/, storyNpcDetail]];
  function translate(_x4) {
    return _translate.apply(this, arguments);
  }

  function _translate() {
    _translate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(state) {
      var uri, pathname, hostname, data, isJSON, result;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              uri = URI(state.url);
              pathname = uri.pathname();
              hostname = uri.hostname();
              data = state.result;
              isJSON = true;

              try {
                data = JSON.parse(data);
              } catch (err) {
                isJSON = false;
              }

              if (!(apiHosts.indexOf(hostname) !== -1)) {
                _context2.next = 14;
                break;
              }

              _context2.next = 9;
              return requestRouter(data, pathname, requestList);

            case 9:
              result = _context2.sent;

              if (result) {
                _context2.next = 12;
                break;
              }

              return _context2.abrupt("return");

            case 12:
              _context2.next = 15;
              break;

            case 14:
              return _context2.abrupt("return");

            case 15:
              state.result = isJSON ? JSON.stringify(data) : data;

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _translate.apply(this, arguments);
  }

  var injectXHR = function injectXHR() {
    // The following code are inspired by viramate/external.js
    // intercept xhr request and modify the response
    var XHR = XMLHttpRequest;
    var originOpen = XHR.prototype.open;
    var originSend = XHR.prototype.send;
    var originAddEventListener = XHR.prototype.addEventListener;
    var stateMap = new WeakMap();

    function log(data) {
      console.error(data);
    }

    function getXhrState(xhr) {
      var result = stateMap.get(xhr);

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

    var customOnLoad = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(evt) {
        var state;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                state = getXhrState(this);
                state.onLoadEvent = evt;
                Object.defineProperties(this, {
                  response: {
                    get: function get() {
                      return state.result;
                    }
                  },
                  responseText: {
                    get: function get() {
                      return state.result;
                    }
                  }
                });
                _context.prev = 3;
                _context.next = 6;
                return translate(state);

              case 6:
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](3);
                log(_context.t0);

              case 11:
                state.onload && state.onload.call(this, state.onLoadEvent);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 8]]);
      }));

      return function customOnLoad(_x) {
        return _ref.apply(this, arguments);
      };
    }();

    var customOnReadyStateChange = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var state,
            i,
            l,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                try {
                  state = getXhrState(this);

                  if (this.readyState == XHR.DONE) {
                    state.onComplete.call(this, state);
                  }
                } catch (err) {
                  log(err);
                }

                try {
                  for (i = 0, l = state.readyStateListeners.length; i < l; i++) {
                    try {
                      state.readyStateListeners[i].apply(this, _args2);
                    } catch (err) {
                      log(err);
                    }
                  }
                } catch (err) {
                  log(err);
                }

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function customOnReadyStateChange() {
        return _ref2.apply(this, arguments);
      };
    }();

    function customOnComplete(state) {
      if (state.done) return;
      state.done = performance.now();
      state.response = this.response;
      state.responseType = this.responseType;

      if (state.responseType === "" || state.responseType === "text") {
        state.responseText = this.responseText;
        state.result = this.response || this.responseText;
      }

      state.status = this.status;
      state.statusText = this.statusText;
      state.contentType = this.getResponseHeader('content-type');
    }

    XHR.prototype.open = function open(method, url, async, user, password) {
      try {
        var state = getXhrState(this);
        state.method = method;
        state.url = url;
      } catch (err) {
        log(err);
      }

      originAddEventListener.call(this, "readystatechange", customOnReadyStateChange, false);
      var result = originOpen.apply(this, arguments);
      return result;
    };

    XHR.prototype.addEventListener = function addEventListener(eventName, listener, useCapture) {
      try {
        var state = getXhrState(this);

        if (eventName === "readystatechange") {
          state.readyStateListeners.push(listener);
          return true;
        }
      } catch (err) {
        log(err);
      }

      var result = originAddEventListener.apply(this, arguments);
      return result;
    };

    XHR.prototype.send = function send(data) {
      var state = null;

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
  };

  var addCss = function addCss() {
    var css = '';

    if (config.removeScroller) {
      css += "\n    ::-webkit-scrollbar {\n      display: none;\n    }";
    }

    if (config.hideSidebar) {
      css += "\n    body>div:first-child>div:first-child>div:first-child[data-reactid] {\n      display: none;\n    }";
    }

    if (config.defaultFont) {
      css += "\n    @font-face {\n      font-family: 'blhxwf';\n      font-style: normal;\n      font-weight: normal;\n      src: url('".concat(config.origin, "/blhxfy/data/static/webfont.woff2');\n    }\n    body {\n      font-family: \"FOT-\u30CB\u30E5\u30FC\u30ED\u30C0\u30F3 Pro M\",\"FOT-\u7B51\u7D2B\u30AA\u30FC\u30EB\u30C9\u660E\u671D Pro R\",\"Average Sans\", blhxwf, sans-serif;\n    }");
    }

    if (css) {
      var style = document.createElement('style');
      style.innerHTML = css;
      document.head.appendChild(style);
    }
  };

  var keepBgm = function keepBgm() {
    if (config.keepBgm) {
      window.addEventListener('blur', function (e) {
        e.stopImmediatePropagation();
      }, false);
    }
  };

  var settingEtc = function settingEtc() {
    addCss();
    keepBgm();
  };

  settingEtc();

  /** Error message constants. */
  var FUNC_ERROR_TEXT$1 = 'Expected a function';

  /**
   * Creates a throttled function that only invokes `func` at most once per
   * every `wait` milliseconds. The throttled function comes with a `cancel`
   * method to cancel delayed `func` invocations and a `flush` method to
   * immediately invoke them. Provide `options` to indicate whether `func`
   * should be invoked on the leading and/or trailing edge of the `wait`
   * timeout. The `func` is invoked with the last arguments provided to the
   * throttled function. Subsequent calls to the throttled function return the
   * result of the last `func` invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the throttled function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.throttle` and `_.debounce`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to throttle.
   * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=true]
   *  Specify invoking on the leading edge of the timeout.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new throttled function.
   * @example
   *
   * // Avoid excessively updating the position while scrolling.
   * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
   *
   * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
   * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
   * jQuery(element).on('click', throttled);
   *
   * // Cancel the trailing throttled invocation.
   * jQuery(window).on('popstate', throttled.cancel);
   */
  function throttle(func, wait, options) {
    var leading = true,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    if (isObject_1(options)) {
      leading = 'leading' in options ? !!options.leading : leading;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return debounce_1(func, wait, {
      'leading': leading,
      'maxWait': wait,
      'trailing': trailing
    });
  }

  var throttle_1 = throttle;

  var saveToLocalstorage = function saveToLocalstorage(key, value) {
    var data;

    try {
      var str = localStorage.getItem('blhxfy:setting');
      data = JSON.parse(str);
    } catch (err) {
      console.error(err);
    }

    if (!isPlainObject_1(data)) {
      data = {};
    }

    data[key] = value;
    config[key] = value;
    localStorage.setItem('blhxfy:setting', JSON.stringify(data));
  };

  var keyMap = new Map([['origin', 'origin'], ['auto-download', 'autoDownload'], ['bottom-toolbar', 'bottomToolbar'], ['username', 'displayName'], ['remove-scroller', 'removeScroller'], ['hide-sidebar', 'hideSidebar'], ['trans-ja', 'transJa'], ['trans-en', 'transEn'], ['keep-bgm', 'keepBgm'], ['trans-api', 'transApi'], ['story-only', 'storyOnly'], ['show-translator', 'showTranslator'], ['font', 'font'], ['log', 'log'], ['font-bold', 'fontBold'], ['plain-text', 'plainText'], ['battle-trans', 'battleTrans'], ['origin-text', 'originText'], ['default-font', 'defaultFont']]);

  var setting = function setting(type, value) {
    if (type === 'show') {
      var _iterator = _createForOfIteratorHelper(keyMap),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              id = _step$value[0],
              key = _step$value[1];

          var ipt = $("#".concat(id, "-setting-blhxfy"));
          if (!ipt.length) continue;

          if (ipt.attr('type') === 'checkbox') {
            ipt[0].checked = config[key];
          } else if (ipt[0].tagName.toUpperCase() === 'SELECT') {
            ipt.val(config[key]);
            var text = ipt.find('option:selected').text();
            $("#".concat(id, "-setting-blhxfy-txt")).text(text);
          } else {
            ipt.val(config[key]);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      $('#blhxfy-setting-modal').addClass('show');
    } else if (type === 'hide') {
      $('#blhxfy-setting-modal').removeClass('show');
    } else if (type === 'language' || type === 'fast-mode') {
      require(['view/setting/index'], function (sett) {
        sett.prototype.onChangePostAsyncInput({
          currentTarget: value.target
        });
      });
    } else {
      if (type === 'trans-api') {
        var _text = $('#trans-api-setting-blhxfy').find('option:selected').text();

        $('#trans-api-setting-blhxfy-txt').text(_text);
      }

      saveToLocalstorage(keyMap.get(type), value);
    }
  };

  var thSetting = throttle_1(setting, 300);

  var txtKeys$1 = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt', 'sel5_txt', 'sel6_txt'];

  var replaceName = function replaceName(content, userName) {
    if (userName) {
      content.forEach(function (item) {
        if (item.id === 'info') return;
        ['name', 'text', 'trans'].forEach(function (key) {
          if (!item[key]) return;
          var _lang = Game.lang;
          if (!/^\w+$/.test(userName)) _lang = 'unknown';
          item[key] = replaceWords(item[key], new Map([[userName, '姬塔']]), _lang);
        });
      });
    }
  };

  var dataToCsv = function dataToCsv(data, fill, isTrans, isAutoTrans) {
    var result = [];

    var _data = cloneDeep_1(data);

    _data.forEach(function (item) {
      var name = removeTag(item.charcter1_name);
      replaceChar('charcter1_name', item, scenarioCache.nameMap);
      var transName = removeTag(item.charcter1_name);
      var hasTransName = name !== transName;

      if (name && config.userName === name) {
        name = config.defaultName;
        hasTransName = false;
      }

      txtKeys$1.forEach(function (key) {
        var txt = item[key];
        var hasName = key === 'detail' && name && name !== 'null';

        if (txt) {
          txt = txt.replace(/\n/g, '');
          txt = simpleHtml(txt);
          var trans = '';

          if (isTrans) {
            var obj = scenarioCache.transMap.get(item.id);

            if (obj && obj["".concat(key, "-origin")]) {
              trans = obj["".concat(key, "-origin")];
            }
          } else if (isAutoTrans) {
            var _obj = scenarioCache.transMap.get(item.id);

            if (_obj && _obj[key]) {
              trans = _obj[key];
            }
          } else if (fill) {
            trans = txt;
          }

          if (config.plainText) {
            txt = removeHtmlTag(txt);
            trans = removeHtmlTag(trans);
          }

          result.push({
            id: "".concat(item.id).concat(key === 'detail' ? '' : '-' + key),
            name: hasName ? "".concat(name).concat(hasTransName ? '/' + transName : '') : '',
            text: txt,
            trans: trans
          });
        }
      });
    });

    var translator = '';

    if (isTrans && scenarioCache.transMap.has('translator')) {
      translator = scenarioCache.transMap.get('translator').detail;
    }

    var extraInfo = {
      id: 'info',
      name: '',
      text: '',
      trans: scenarioCache.name
    };
    replaceName(result, config.userName);
    result.push(extraInfo);
    result.push({
      id: '译者',
      name: '',
      text: '',
      trans: translator
    });
    return papaparse_min.unparse(result);
  };

  function dlStoryCsv () {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'normal';

    if (type === 'normal') {
      tryDownload(dataToCsv(scenarioCache.data), scenarioCache.name + '.csv');
    } else if (type === 'trans') {
      if (scenarioCache.hasTrans) {
        tryDownload(dataToCsv(scenarioCache.data, false, true), "".concat(scenarioCache.originName || scenarioCache.name, ".csv"));
      } else {
        if (scenarioCache.hasAutoTrans) {
          if (confirm('这个章节还没有翻译，是否下载含有机翻文本的文件。')) {
            tryDownload(dataToCsv(scenarioCache.data, false, false, true), scenarioCache.name + '.csv');
          }
        } else {
          alert('这个章节还没有翻译。');
        }
      }
    } else if (type === 'fill') {
      tryDownload(dataToCsv(scenarioCache.data, true), scenarioCache.name + '.csv');
    }
  }

  var setLocalData$1 = function setLocalData(name, csv) {
    var data = getPreview();
    var exist = false;

    var _iterator = _createForOfIteratorHelper(data),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;

        if (item.name === name) {
          exist = true;
          item.csv = csv;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (!exist) {
      if (data.length >= 5) {
        data.shift();
      }

      data.push({
        name: name,
        csv: csv
      });
    }

    sessionStorage.setItem('blhxfy:preview', JSON.stringify(data));
  };

  function previewCsv (type) {
    var cont = document.getElementById('blhxfy-story-input');

    if (type === 'hide') {
      cont.style.display = 'none';
    } else if (type === 'show') {
      var csv = getPreviewCsv(scenarioCache.name);
      cont.querySelector('textarea').value = csv;
      cont.style.display = 'block';
    } else if (type === 'clear') {
      cont.querySelector('textarea').value = '';
    } else if (type === 'save') {
      setLocalData$1(scenarioCache.name, cont.querySelector('textarea').value);
      location.reload();
    }
  }

  function eventMessage () {
    var win = window.unsafeWindow || window;
    win.blhxfy || (win.blhxfy = {});

    win.blhxfy.sendEvent = function (name, type, data) {
      var event = new CustomEvent('blhxfy:message', {
        detail: {
          type: type,
          data: data,
          name: name
        }
      });
      document.body.dispatchEvent(event);
    };

    document.body.addEventListener('blhxfy:message', function (e) {
      var _e$detail = e.detail,
          name = _e$detail.name,
          type = _e$detail.type,
          data = _e$detail.data;

      if (name === 'setting') {
        thSetting(type, data);
      } else if (name === 'dlStoryCsv') {
        dlStoryCsv(type, data);
      } else if (name === 'previewCsv') {
        previewCsv(type);
      }
    });
  }

  var main = function main() {
    var time = sessionStorage.getItem('blhxfy:startTime') || 0;
    var now = Date.now();
    if (now - time < 1000) return;
    sessionStorage.setItem('blhxfy:startTime', now);
    eventMessage();
    injectXHR();
  };

  var init = function init() {
    if (!config.storyOnly) {
      main();
    } else {
      var started = false;

      var start = function start() {
        if (!started) {
          started = true;
          main();
          observer.disconnect();
        }
      };

      var mutationCallback = function mutationCallback(mutationsList) {
        var _iterator = _createForOfIteratorHelper(mutationsList),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var mutation = _step.value;
            var type = mutation.type;
            var addedNodes = mutation.addedNodes;

            if (type === 'childList' && addedNodes.length && addedNodes.length < 2) {
              addedNodes.forEach(function (node) {
                if (node.tagName.toUpperCase() === 'SCRIPT' && node.src.includes('scenario-model')) {
                  start();
                }
              });
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };

      var obConfig = {
        childList: true
      };
      var targetNode = document.head;
      var observer = new MutationObserver(mutationCallback);
      observer.observe(targetNode, obConfig);
    }
  };

  if (window.unsafeWindow) {
    init();
  } else {
    window.addEventListener('load', function () {
      init();
    });
  }

}());
