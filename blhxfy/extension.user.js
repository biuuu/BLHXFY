// ==UserScript==
// @name         碧蓝幻想翻译
// @namespace    https://github.com/biuuu/BLHXFY
// @version      2.7.4
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
// @updateURL    https://blhx.danmu9.com/blhxfy/extension.user.js
// @supportURL   https://github.com/biuuu/BLHXFY/issues
// ==/UserScript==
(function () {
	'use strict';

	const __win_blhxfy = window.unsafeWindow || window;
	    if (__win_blhxfy.BLHXFY) return;
	    __win_blhxfy.BLHXFY = true;
	    const DEV = false;
	    const LOCAL_HOST = false;

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
	 * Version: 1.19.11
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
	 * Version: 1.19.11
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
	 * Version: 1.19.11
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

	  URI.version = '1.19.11';

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
	  URI.leading_whitespace_expression = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
	  // https://infra.spec.whatwg.org/#ascii-tab-or-newline
	  URI.ascii_tab_whitespace = /[\u0009\u000A\u000D]+/g;
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

	    string = string.replace(URI.leading_whitespace_expression, '');
	    // https://infra.spec.whatwg.org/#ascii-tab-or-newline
	    string = string.replace(URI.ascii_tab_whitespace, '');

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

	    // slashes and backslashes have lost all meaning for the web protocols (https, http, wss, ws)
	    string = string.replace(/^(https?|ftp|wss?)?:+[/\\]*/i, '$1://');
	    // slashes and backslashes have lost all meaning for scheme relative URLs
	    string = string.replace(/^[/\\]{2,}/i, '//');

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

	      if (name === '__proto__') {
	        // ignore attempt at exploiting JavaScript internals
	        continue;
	      } else if (hasOwn.call(items, name)) {
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
	      if (key === '__proto__') {
	        // ignore attempt at exploiting JavaScript internals
	        continue;
	      } else if (hasOwn.call(data, key)) {
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

	/*! @license DOMPurify 2.5.8 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.5.8/LICENSE */

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	  }, _typeof(obj);
	}
	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };
	  return _setPrototypeOf(o, p);
	}
	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;
	  try {
	    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}
	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }
	  return _construct.apply(null, arguments);
	}
	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}
	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}
	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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

	var hasOwnProperty = Object.hasOwnProperty,
	  setPrototypeOf = Object.setPrototypeOf,
	  isFrozen = Object.isFrozen,
	  getPrototypeOf = Object.getPrototypeOf,
	  getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
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
	    return _construct(Func, _toConsumableArray(args));
	  };
	}
	var arrayForEach = unapply(Array.prototype.forEach);
	var arrayPop = unapply(Array.prototype.pop);
	var arrayPush = unapply(Array.prototype.push);
	var stringToLowerCase = unapply(String.prototype.toLowerCase);
	var stringToString = unapply(String.prototype.toString);
	var stringMatch = unapply(String.prototype.match);
	var stringReplace = unapply(String.prototype.replace);
	var stringIndexOf = unapply(String.prototype.indexOf);
	var stringTrim = unapply(String.prototype.trim);
	var regExpTest = unapply(RegExp.prototype.test);
	var typeErrorCreate = unconstruct(TypeError);
	function unapply(func) {
	  return function (thisArg) {
	    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }
	    return apply(func, thisArg, args);
	  };
	}
	function unconstruct(func) {
	  return function () {
	    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }
	    return construct(func, args);
	  };
	}

	/* Add properties to a lookup table */
	function addToSet(set, array, transformCaseFunc) {
	  var _transformCaseFunc;
	  transformCaseFunc = (_transformCaseFunc = transformCaseFunc) !== null && _transformCaseFunc !== void 0 ? _transformCaseFunc : stringToLowerCase;
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
	      var lcElement = transformCaseFunc(element);
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
	  var property;
	  for (property in object) {
	    if (apply(hasOwnProperty, object, [property]) === true) {
	      newObject[property] = object[property];
	    }
	  }
	  return newObject;
	}

	/* IE10 doesn't support __lookupGetter__ so lets'
	 * simulate it. It also automatically checks
	 * if the prop is function or getter and behaves
	 * accordingly. */
	function lookupGetter(object, prop) {
	  while (object !== null) {
	    var desc = getOwnPropertyDescriptor(object, prop);
	    if (desc) {
	      if (desc.get) {
	        return unapply(desc.get);
	      }
	      if (typeof desc.value === 'function') {
	        return unapply(desc.value);
	      }
	    }
	    object = getPrototypeOf(object);
	  }
	  function fallbackValue(element) {
	    console.warn('fallback value for', element);
	    return null;
	  }
	  return fallbackValue;
	}

	var html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);

	// SVG
	var svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
	var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);

	// List of SVG elements that are disallowed by default.
	// We still need to know them so that we can do namespace
	// checks properly in case one wants to add them to
	// allow-list.
	var svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'fedropshadow', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
	var mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']);

	// Similarly to SVG, we want to know all MathML elements,
	// even those that we disallow by default.
	var mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
	var text = freeze(['#text']);

	var html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns', 'slot']);
	var svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
	var mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
	var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

	// eslint-disable-next-line unicorn/better-regex
	var MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
	var ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
	var TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
	var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
	var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
	var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
	);
	var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
	var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
	);
	var DOCTYPE_NAME = seal(/^html$/i);
	var CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);

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
	  if (_typeof(trustedTypes) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
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
	      createHTML: function createHTML(html) {
	        return html;
	      },
	      createScriptURL: function createScriptURL(scriptUrl) {
	        return scriptUrl;
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
	  DOMPurify.version = '2.5.8';

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
	  var document = window.document;
	  var DocumentFragment = window.DocumentFragment,
	    HTMLTemplateElement = window.HTMLTemplateElement,
	    Node = window.Node,
	    Element = window.Element,
	    NodeFilter = window.NodeFilter,
	    _window$NamedNodeMap = window.NamedNodeMap,
	    NamedNodeMap = _window$NamedNodeMap === void 0 ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
	    HTMLFormElement = window.HTMLFormElement,
	    DOMParser = window.DOMParser,
	    trustedTypes = window.trustedTypes;
	  var ElementPrototype = Element.prototype;
	  var cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
	  var getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
	  var getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
	  var getParentNode = lookupGetter(ElementPrototype, 'parentNode');

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
	  var emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML('') : '';
	  var _document = document,
	    implementation = _document.implementation,
	    createNodeIterator = _document.createNodeIterator,
	    createDocumentFragment = _document.createDocumentFragment,
	    getElementsByTagName = _document.getElementsByTagName;
	  var importNode = originalDocument.importNode;
	  var documentMode = {};
	  try {
	    documentMode = clone(document).documentMode ? document.documentMode : {};
	  } catch (_) {}
	  var hooks = {};

	  /**
	   * Expose whether this browser supports running the full DOMPurify.
	   */
	  DOMPurify.isSupported = typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined && documentMode !== 9;
	  var MUSTACHE_EXPR$1 = MUSTACHE_EXPR,
	    ERB_EXPR$1 = ERB_EXPR,
	    TMPLIT_EXPR$1 = TMPLIT_EXPR,
	    DATA_ATTR$1 = DATA_ATTR,
	    ARIA_ATTR$1 = ARIA_ATTR,
	    IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA,
	    ATTR_WHITESPACE$1 = ATTR_WHITESPACE,
	    CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
	  var IS_ALLOWED_URI$1 = IS_ALLOWED_URI;

	  /**
	   * We consider the elements and attributes below to be safe. Ideally
	   * don't add any new ones but feel free to remove unwanted ones.
	   */

	  /* allowed element names */
	  var ALLOWED_TAGS = null;
	  var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray(html$1), _toConsumableArray(svg$1), _toConsumableArray(svgFilters), _toConsumableArray(mathMl$1), _toConsumableArray(text)));

	  /* Allowed attribute names */
	  var ALLOWED_ATTR = null;
	  var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray(html), _toConsumableArray(svg), _toConsumableArray(mathMl), _toConsumableArray(xml)));

	  /*
	   * Configure how DOMPUrify should handle custom elements and their attributes as well as customized built-in elements.
	   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
	   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
	   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
	   */
	  var CUSTOM_ELEMENT_HANDLING = Object.seal(Object.create(null, {
	    tagNameCheck: {
	      writable: true,
	      configurable: false,
	      enumerable: true,
	      value: null
	    },
	    attributeNameCheck: {
	      writable: true,
	      configurable: false,
	      enumerable: true,
	      value: null
	    },
	    allowCustomizedBuiltInElements: {
	      writable: true,
	      configurable: false,
	      enumerable: true,
	      value: false
	    }
	  }));

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

	  /* Decide if self-closing tags in attributes are allowed.
	   * Usually removed due to a mXSS issue in jQuery 3.0 */
	  var ALLOW_SELF_CLOSE_IN_ATTR = true;

	  /* Output should be safe for common template engines.
	   * This means, DOMPurify removes data attributes, mustaches and ERB
	   */
	  var SAFE_FOR_TEMPLATES = false;

	  /* Output should be safe even for XML used within HTML and alike.
	   * This means, DOMPurify removes comments when containing risky content.
	   */
	  var SAFE_FOR_XML = true;

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

	  /* Try to return a Trusted Type object instead of a string, return a string in
	   * case Trusted Types are not supported  */
	  var RETURN_TRUSTED_TYPE = false;

	  /* Output should be free from DOM clobbering attacks?
	   * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
	   */
	  var SANITIZE_DOM = true;

	  /* Achieve full DOM Clobbering protection by isolating the namespace of named
	   * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
	   *
	   * HTML/DOM spec rules that enable DOM Clobbering:
	   *   - Named Access on Window (§7.3.3)
	   *   - DOM Tree Accessors (§3.1.5)
	   *   - Form Element Parent-Child Relations (§4.10.3)
	   *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
	   *   - HTMLCollection (§4.2.10.2)
	   *
	   * Namespace isolation is implemented by prefixing `id` and `name` attributes
	   * with a constant string, i.e., `user-content-`
	   */
	  var SANITIZE_NAMED_PROPS = false;
	  var SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';

	  /* Keep element content when removing element? */
	  var KEEP_CONTENT = true;

	  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
	   * of importing it into a new Document and returning a sanitized copy */
	  var IN_PLACE = false;

	  /* Allow usage of profiles like html, svg and mathMl */
	  var USE_PROFILES = {};

	  /* Tags to ignore content of when KEEP_CONTENT is true */
	  var FORBID_CONTENTS = null;
	  var DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);

	  /* Tags that are safe for data: URIs */
	  var DATA_URI_TAGS = null;
	  var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);

	  /* Attributes safe for values like "javascript:" */
	  var URI_SAFE_ATTRIBUTES = null;
	  var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
	  var MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
	  var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
	  var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
	  /* Document namespace */
	  var NAMESPACE = HTML_NAMESPACE;
	  var IS_EMPTY_INPUT = false;

	  /* Allowed XHTML+XML namespaces */
	  var ALLOWED_NAMESPACES = null;
	  var DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);

	  /* Parsing of strict XHTML documents */
	  var PARSER_MEDIA_TYPE;
	  var SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
	  var DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
	  var transformCaseFunc;

	  /* Keep a reference to config to pass to hooks */
	  var CONFIG = null;

	  /* Ideally, do not touch anything below this line */
	  /* ______________________________________________ */

	  var formElement = document.createElement('form');
	  var isRegexOrFunction = function isRegexOrFunction(testValue) {
	    return testValue instanceof RegExp || testValue instanceof Function;
	  };

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
	    if (!cfg || _typeof(cfg) !== 'object') {
	      cfg = {};
	    }

	    /* Shield configuration object from prototype pollution */
	    cfg = clone(cfg);
	    PARSER_MEDIA_TYPE =
	    // eslint-disable-next-line unicorn/prefer-includes
	    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE;

	    // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
	    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;

	    /* Set configuration parameters */
	    ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
	    ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
	    ALLOWED_NAMESPACES = 'ALLOWED_NAMESPACES' in cfg ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
	    URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES),
	    // eslint-disable-line indent
	    cfg.ADD_URI_SAFE_ATTR,
	    // eslint-disable-line indent
	    transformCaseFunc // eslint-disable-line indent
	    ) // eslint-disable-line indent
	    : DEFAULT_URI_SAFE_ATTRIBUTES;
	    DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS),
	    // eslint-disable-line indent
	    cfg.ADD_DATA_URI_TAGS,
	    // eslint-disable-line indent
	    transformCaseFunc // eslint-disable-line indent
	    ) // eslint-disable-line indent
	    : DEFAULT_DATA_URI_TAGS;
	    FORBID_CONTENTS = 'FORBID_CONTENTS' in cfg ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
	    FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
	    FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
	    USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
	    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
	    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
	    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
	    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
	    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
	    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
	    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
	    RETURN_DOM = cfg.RETURN_DOM || false; // Default false
	    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
	    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
	    FORCE_BODY = cfg.FORCE_BODY || false; // Default false
	    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
	    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
	    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
	    IN_PLACE = cfg.IN_PLACE || false; // Default false
	    IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$1;
	    NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
	    CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
	    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
	      CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
	    }
	    if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
	      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
	    }
	    if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
	      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
	    }
	    if (SAFE_FOR_TEMPLATES) {
	      ALLOW_DATA_ATTR = false;
	    }
	    if (RETURN_DOM_FRAGMENT) {
	      RETURN_DOM = true;
	    }

	    /* Parse profile info */
	    if (USE_PROFILES) {
	      ALLOWED_TAGS = addToSet({}, _toConsumableArray(text));
	      ALLOWED_ATTR = [];
	      if (USE_PROFILES.html === true) {
	        addToSet(ALLOWED_TAGS, html$1);
	        addToSet(ALLOWED_ATTR, html);
	      }
	      if (USE_PROFILES.svg === true) {
	        addToSet(ALLOWED_TAGS, svg$1);
	        addToSet(ALLOWED_ATTR, svg);
	        addToSet(ALLOWED_ATTR, xml);
	      }
	      if (USE_PROFILES.svgFilters === true) {
	        addToSet(ALLOWED_TAGS, svgFilters);
	        addToSet(ALLOWED_ATTR, svg);
	        addToSet(ALLOWED_ATTR, xml);
	      }
	      if (USE_PROFILES.mathMl === true) {
	        addToSet(ALLOWED_TAGS, mathMl$1);
	        addToSet(ALLOWED_ATTR, mathMl);
	        addToSet(ALLOWED_ATTR, xml);
	      }
	    }

	    /* Merge configuration parameters */
	    if (cfg.ADD_TAGS) {
	      if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
	        ALLOWED_TAGS = clone(ALLOWED_TAGS);
	      }
	      addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
	    }
	    if (cfg.ADD_ATTR) {
	      if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
	        ALLOWED_ATTR = clone(ALLOWED_ATTR);
	      }
	      addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
	    }
	    if (cfg.ADD_URI_SAFE_ATTR) {
	      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
	    }
	    if (cfg.FORBID_CONTENTS) {
	      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
	        FORBID_CONTENTS = clone(FORBID_CONTENTS);
	      }
	      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
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
	  var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
	  var HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);

	  // Certain elements are allowed in both SVG and HTML
	  // namespace. We need to specify them explicitly
	  // so that they don't get erroneously deleted from
	  // HTML namespace.
	  var COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);

	  /* Keep track of all possible SVG and MathML tags
	   * so that we can perform the namespace checks
	   * correctly. */
	  var ALL_SVG_TAGS = addToSet({}, svg$1);
	  addToSet(ALL_SVG_TAGS, svgFilters);
	  addToSet(ALL_SVG_TAGS, svgDisallowed);
	  var ALL_MATHML_TAGS = addToSet({}, mathMl$1);
	  addToSet(ALL_MATHML_TAGS, mathMlDisallowed);

	  /**
	   *
	   *
	   * @param  {Element} element a DOM element whose namespace is being checked
	   * @returns {boolean} Return false if the element has a
	   *  namespace that a spec-compliant parser would never
	   *  return. Return true otherwise.
	   */
	  var _checkValidNamespace = function _checkValidNamespace(element) {
	    var parent = getParentNode(element);

	    // In JSDOM, if we're inside shadow DOM, then parentNode
	    // can be null. We just simulate parent in this case.
	    if (!parent || !parent.tagName) {
	      parent = {
	        namespaceURI: NAMESPACE,
	        tagName: 'template'
	      };
	    }
	    var tagName = stringToLowerCase(element.tagName);
	    var parentTagName = stringToLowerCase(parent.tagName);
	    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
	      return false;
	    }
	    if (element.namespaceURI === SVG_NAMESPACE) {
	      // The only way to switch from HTML namespace to SVG
	      // is via <svg>. If it happens via any other tag, then
	      // it should be killed.
	      if (parent.namespaceURI === HTML_NAMESPACE) {
	        return tagName === 'svg';
	      }

	      // The only way to switch from MathML to SVG is via`
	      // svg if parent is either <annotation-xml> or MathML
	      // text integration points.
	      if (parent.namespaceURI === MATHML_NAMESPACE) {
	        return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
	      }

	      // We only allow elements that are defined in SVG
	      // spec. All others are disallowed in SVG namespace.
	      return Boolean(ALL_SVG_TAGS[tagName]);
	    }
	    if (element.namespaceURI === MATHML_NAMESPACE) {
	      // The only way to switch from HTML namespace to MathML
	      // is via <math>. If it happens via any other tag, then
	      // it should be killed.
	      if (parent.namespaceURI === HTML_NAMESPACE) {
	        return tagName === 'math';
	      }

	      // The only way to switch from SVG to MathML is via
	      // <math> and HTML integration points
	      if (parent.namespaceURI === SVG_NAMESPACE) {
	        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
	      }

	      // We only allow elements that are defined in MathML
	      // spec. All others are disallowed in MathML namespace.
	      return Boolean(ALL_MATHML_TAGS[tagName]);
	    }
	    if (element.namespaceURI === HTML_NAMESPACE) {
	      // The only way to switch from SVG to HTML is via
	      // HTML integration points, and from MathML to HTML
	      // is via MathML text integration points
	      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
	        return false;
	      }
	      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
	        return false;
	      }

	      // We disallow tags that are specific for MathML
	      // or SVG and should never appear in HTML namespace
	      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
	    }

	    // For XHTML and XML documents that support custom namespaces
	    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
	      return true;
	    }

	    // The code should never reach this place (this means
	    // that the element somehow got namespace that is not
	    // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
	    // Return false just in case.
	    return false;
	  };

	  /**
	   * _forceRemove
	   *
	   * @param  {Node} node a DOM node
	   */
	  var _forceRemove = function _forceRemove(node) {
	    arrayPush(DOMPurify.removed, {
	      element: node
	    });
	    try {
	      // eslint-disable-next-line unicorn/prefer-dom-node-remove
	      node.parentNode.removeChild(node);
	    } catch (_) {
	      try {
	        node.outerHTML = emptyHTML;
	      } catch (_) {
	        node.remove();
	      }
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

	    // We void attribute values for unremovable "is"" attributes
	    if (name === 'is' && !ALLOWED_ATTR[name]) {
	      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
	        try {
	          _forceRemove(node);
	        } catch (_) {}
	      } else {
	        try {
	          node.setAttribute(name, '');
	        } catch (_) {}
	      }
	    }
	  };

	  /**
	   * _initDocument
	   *
	   * @param  {String} dirty a string of dirty markup
	   * @return {Document} a DOM, filled with the dirty markup
	   */
	  var _initDocument = function _initDocument(dirty) {
	    /* Create a HTML document */
	    var doc;
	    var leadingWhitespace;
	    if (FORCE_BODY) {
	      dirty = '<remove></remove>' + dirty;
	    } else {
	      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
	      var matches = stringMatch(dirty, /^[\r\n\t ]+/);
	      leadingWhitespace = matches && matches[0];
	    }
	    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
	      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
	      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
	    }
	    var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
	    /*
	     * Use the DOMParser API by default, fallback later if needs be
	     * DOMParser not work for svg when has multiple root element.
	     */
	    if (NAMESPACE === HTML_NAMESPACE) {
	      try {
	        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
	      } catch (_) {}
	    }

	    /* Use createHTMLDocument in case DOMParser is not available */
	    if (!doc || !doc.documentElement) {
	      doc = implementation.createDocument(NAMESPACE, 'template', null);
	      try {
	        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
	      } catch (_) {
	        // Syntax error if dirtyPayload is invalid xml
	      }
	    }
	    var body = doc.body || doc.documentElement;
	    if (dirty && leadingWhitespace) {
	      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
	    }

	    /* Work on whole document or just its body */
	    if (NAMESPACE === HTML_NAMESPACE) {
	      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
	    }
	    return WHOLE_DOCUMENT ? doc.documentElement : body;
	  };

	  /**
	   * _createIterator
	   *
	   * @param  {Document} root document/fragment to create iterator for
	   * @return {Iterator} iterator instance
	   */
	  var _createIterator = function _createIterator(root) {
	    return createNodeIterator.call(root.ownerDocument || root, root,
	    // eslint-disable-next-line no-bitwise
	    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null, false);
	  };

	  /**
	   * _isClobbered
	   *
	   * @param  {Node} elm element to check for clobbering attacks
	   * @return {Boolean} true if clobbered, false if safe
	   */
	  var _isClobbered = function _isClobbered(elm) {
	    return elm instanceof HTMLFormElement && (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function' || typeof elm.hasChildNodes !== 'function');
	  };

	  /**
	   * _isNode
	   *
	   * @param  {Node} obj object to check whether it's a DOM node
	   * @return {Boolean} true is object is a DOM node
	   */
	  var _isNode = function _isNode(object) {
	    return _typeof(Node) === 'object' ? object instanceof Node : object && _typeof(object) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
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
	  var _sanitizeElements = function _sanitizeElements(currentNode) {
	    var content;

	    /* Execute a hook if present */
	    _executeHook('beforeSanitizeElements', currentNode, null);

	    /* Check if element is clobbered or can clobber */
	    if (_isClobbered(currentNode)) {
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Check if tagname contains Unicode */
	    if (regExpTest(/[\u0080-\uFFFF]/, currentNode.nodeName)) {
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Now let's check the element's type and name */
	    var tagName = transformCaseFunc(currentNode.nodeName);

	    /* Execute a hook if present */
	    _executeHook('uponSanitizeElement', currentNode, {
	      tagName: tagName,
	      allowedTags: ALLOWED_TAGS
	    });

	    /* Detect mXSS attempts abusing namespace confusion */
	    if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Mitigate a problem with templates inside select */
	    if (tagName === 'select' && regExpTest(/<template/i, currentNode.innerHTML)) {
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Remove any ocurrence of processing instructions */
	    if (currentNode.nodeType === 7) {
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Remove any kind of possibly harmful comments */
	    if (SAFE_FOR_XML && currentNode.nodeType === 8 && regExpTest(/<[/\w]/g, currentNode.data)) {
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Remove element if anything forbids its presence */
	    if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
	      /* Check if we have a custom element to handle */
	      if (!FORBID_TAGS[tagName] && _basicCustomElementTest(tagName)) {
	        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
	        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
	      }

	      /* Keep content except for bad-listed elements */
	      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
	        var parentNode = getParentNode(currentNode) || currentNode.parentNode;
	        var childNodes = getChildNodes(currentNode) || currentNode.childNodes;
	        if (childNodes && parentNode) {
	          var childCount = childNodes.length;
	          for (var i = childCount - 1; i >= 0; --i) {
	            var childClone = cloneNode(childNodes[i], true);
	            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
	            parentNode.insertBefore(childClone, getNextSibling(currentNode));
	          }
	        }
	      }
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Check whether element has a valid namespace */
	    if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Make sure that older browsers don't get fallback-tag mXSS */
	    if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
	      _forceRemove(currentNode);
	      return true;
	    }

	    /* Sanitize element content to be template-safe */
	    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
	      /* Get the element's text content */
	      content = currentNode.textContent;
	      content = stringReplace(content, MUSTACHE_EXPR$1, ' ');
	      content = stringReplace(content, ERB_EXPR$1, ' ');
	      content = stringReplace(content, TMPLIT_EXPR$1, ' ');
	      if (currentNode.textContent !== content) {
	        arrayPush(DOMPurify.removed, {
	          element: currentNode.cloneNode()
	        });
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
	    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
	      if (
	      // First condition does a very basic check if a) it's basically a valid custom element tagname AND
	      // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
	      // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
	      _basicCustomElementTest(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) ||
	      // Alternative, second condition checks if it's an `is`-attribute, AND
	      // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
	      lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
	        return false;
	      }
	      /* Check value is safe. First, is attr inert? If so, is safe */
	    } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, ''))) ; else if (value) {
	      return false;
	    }
	    return true;
	  };

	  /**
	   * _basicCustomElementCheck
	   * checks if at least one dash is included in tagName, and it's not the first char
	   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
	   * @param {string} tagName name of the tag of the node to sanitize
	   */
	  var _basicCustomElementTest = function _basicCustomElementTest(tagName) {
	    return tagName !== 'annotation-xml' && stringMatch(tagName, CUSTOM_ELEMENT$1);
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
	  var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
	    var attr;
	    var value;
	    var lcName;
	    var l;
	    /* Execute a hook if present */
	    _executeHook('beforeSanitizeAttributes', currentNode, null);
	    var attributes = currentNode.attributes;

	    /* Check if we have attributes; if not we might have a text node */
	    if (!attributes || _isClobbered(currentNode)) {
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
	      value = name === 'value' ? attr.value : stringTrim(attr.value);
	      lcName = transformCaseFunc(name);

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
	      _removeAttribute(name, currentNode);

	      /* Did the hooks approve of the attribute? */
	      if (!hookEvent.keepAttr) {
	        continue;
	      }

	      /* Work around a security issue in jQuery 3.0 */
	      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
	        _removeAttribute(name, currentNode);
	        continue;
	      }

	      /* Sanitize attribute content to be template-safe */
	      if (SAFE_FOR_TEMPLATES) {
	        value = stringReplace(value, MUSTACHE_EXPR$1, ' ');
	        value = stringReplace(value, ERB_EXPR$1, ' ');
	        value = stringReplace(value, TMPLIT_EXPR$1, ' ');
	      }

	      /* Is `value` valid for this attribute? */
	      var lcTag = transformCaseFunc(currentNode.nodeName);
	      if (!_isValidAttribute(lcTag, lcName, value)) {
	        continue;
	      }

	      /* Full DOM Clobbering protection via namespace isolation,
	       * Prefix id and name attributes with `user-content-`
	       */
	      if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
	        // Remove the attribute with this value
	        _removeAttribute(name, currentNode);

	        // Prefix the value and later re-create the attribute with the sanitized value
	        value = SANITIZE_NAMED_PROPS_PREFIX + value;
	      }

	      /* Work around a security issue with comments inside attributes */
	      if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title)/i, value)) {
	        _removeAttribute(name, currentNode);
	        continue;
	      }

	      /* Handle attributes that require Trusted Types */
	      if (trustedTypesPolicy && _typeof(trustedTypes) === 'object' && typeof trustedTypes.getAttributeType === 'function') {
	        if (namespaceURI) ; else {
	          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
	            case 'TrustedHTML':
	              {
	                value = trustedTypesPolicy.createHTML(value);
	                break;
	              }
	            case 'TrustedScriptURL':
	              {
	                value = trustedTypesPolicy.createScriptURL(value);
	                break;
	              }
	          }
	        }
	      }

	      /* Handle invalid data-* attribute set by try-catching it */
	      try {
	        if (namespaceURI) {
	          currentNode.setAttributeNS(namespaceURI, name, value);
	        } else {
	          /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
	          currentNode.setAttribute(name, value);
	        }
	        if (_isClobbered(currentNode)) {
	          _forceRemove(currentNode);
	        } else {
	          arrayPop(DOMPurify.removed);
	        }
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
	    var shadowNode;
	    var shadowIterator = _createIterator(fragment);

	    /* Execute a hook if present */
	    _executeHook('beforeSanitizeShadowDOM', fragment, null);
	    while (shadowNode = shadowIterator.nextNode()) {
	      /* Execute a hook if present */
	      _executeHook('uponSanitizeShadowNode', shadowNode, null);
	      /* Sanitize tags and elements */
	      _sanitizeElements(shadowNode);

	      /* Check attributes next */
	      _sanitizeAttributes(shadowNode);

	      /* Deep shadow DOM detected */
	      if (shadowNode.content instanceof DocumentFragment) {
	        _sanitizeShadowDOM(shadowNode.content);
	      }
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
	  DOMPurify.sanitize = function (dirty) {
	    var cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    var body;
	    var importedNode;
	    var currentNode;
	    var oldNode;
	    var returnNode;
	    /* Make sure we have a string to sanitize.
	      DO NOT return early, as this will return the wrong type if
	      the user has requested a DOM object rather than a string */
	    IS_EMPTY_INPUT = !dirty;
	    if (IS_EMPTY_INPUT) {
	      dirty = '<!-->';
	    }

	    /* Stringify, in case dirty is an object */
	    if (typeof dirty !== 'string' && !_isNode(dirty)) {
	      if (typeof dirty.toString === 'function') {
	        dirty = dirty.toString();
	        if (typeof dirty !== 'string') {
	          throw typeErrorCreate('dirty is not a string, aborting');
	        }
	      } else {
	        throw typeErrorCreate('toString is not a function');
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
	    if (IN_PLACE) {
	      /* Do some early pre-sanitization to avoid unsafe root nodes */
	      if (dirty.nodeName) {
	        var tagName = transformCaseFunc(dirty.nodeName);
	        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
	          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
	        }
	      }
	    } else if (dirty instanceof Node) {
	      /* If dirty is a DOM element, append to an empty document to avoid
	         elements being stripped by the parser */
	      body = _initDocument('<!---->');
	      importedNode = body.ownerDocument.importNode(dirty, true);
	      if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
	        /* Node is already a body, use as is */
	        body = importedNode;
	      } else if (importedNode.nodeName === 'HTML') {
	        body = importedNode;
	      } else {
	        // eslint-disable-next-line unicorn/prefer-dom-node-append
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
	        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
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
	      _sanitizeElements(currentNode);

	      /* Check attributes next */
	      _sanitizeAttributes(currentNode);

	      /* Shadow DOM detected, sanitize it */
	      if (currentNode.content instanceof DocumentFragment) {
	        _sanitizeShadowDOM(currentNode.content);
	      }
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
	          // eslint-disable-next-line unicorn/prefer-dom-node-append
	          returnNode.appendChild(body.firstChild);
	        }
	      } else {
	        returnNode = body;
	      }
	      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmod) {
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

	    /* Serialize doctype if allowed */
	    if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
	      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
	    }

	    /* Sanitize final string template-safe */
	    if (SAFE_FOR_TEMPLATES) {
	      serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$1, ' ');
	      serializedHTML = stringReplace(serializedHTML, ERB_EXPR$1, ' ');
	      serializedHTML = stringReplace(serializedHTML, TMPLIT_EXPR$1, ' ');
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
	    var lcTag = transformCaseFunc(tag);
	    var lcName = transformCaseFunc(attr);
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
	   * @return {Function} removed(popped) hook
	   */
	  DOMPurify.removeHook = function (entryPoint) {
	    if (hooks[entryPoint]) {
	      return arrayPop(hooks[entryPoint]);
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

	const trim = str => {
	  if (!str) return '';
	  return str.trim();
	};
	const tryDownload = (content, filename) => {
	  const eleLink = document.createElement('a');
	  eleLink.download = filename;
	  eleLink.style.display = 'none';
	  const blob = new Blob([content], {
	    type: 'text/csv'
	  });
	  eleLink.href = URL.createObjectURL(blob);
	  document.body.appendChild(eleLink);
	  eleLink.click();
	  document.body.removeChild(eleLink);
	};
	const removeTag = html => {
	  if (html.startsWith('<')) {
	    return html.replace(/^<[^>]+>([^<]*)<\/[^>]+>/, '$1');
	  }
	  return html;
	};
	const removeNotMatchedHtmlTag = str => {
	  if (/<\/?(span|div)[^>]*>/.test(str)) {
	    return str.replace(/<\/?(span|div)[^>]*>/g, '');
	  }
	  return str;
	};
	const removeNormalHtmlTag = (str, count = 0, wrap) => {
	  count++;
	  if (!/<(\w{1,7})[^>]*>/.test(str) || count > 2) return str;
	  let _str;
	  if (wrap) {
	    _str = str.replace(/<br\s?\/?>/ig, '\n').replace(/\n+/g, '\n');
	  } else {
	    _str = str.replace(/<br\s?\/?>/ig, '');
	  }
	  _str = _str.replace(/<(\w{1,7})[^>]*>([^<]*)<\/\1>/g, '$2');
	  return removeNormalHtmlTag(_str, count, wrap);
	};
	const removeHtmlTag = (str, count = 0, wrap) => {
	  const _str = removeNormalHtmlTag(str, count, wrap);
	  return removeNotMatchedHtmlTag(_str);
	};
	const isFullTag = text => {
	  if (!/^<\w+[^>]*>/.test(text)) return false;
	  let _text = trim(text.replace(/<br\s?\/?>/ig, ''));
	  let isFull = true;
	  let type = '';
	  while (_text && isFull) {
	    let _type = '';
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
	const simpleHtml = text => {
	  let _text = text.replace(/<br\s?\/?>/ig, '\\n');
	  if (!isFullTag(text)) return _text;
	  _text = _text.replace(/<(\w{1,7})[^>]*>([^<]*)<\/\1>/g, '$2');
	  return _text;
	};
	const restoreHtml = (text, origin) => {
	  let html = text.replace(/\\n/g, '<br>');
	  if (!isFullTag(text) && isFullTag(origin)) {
	    let startText = origin.match(/(^<\w+[^>]*>)/)[1];
	    let tagName = startText.match(/<(\w+)[^>]*>/)[1];
	    html = html.split('<br>').map(txt => {
	      return `${startText}${txt}</${tagName}>`;
	    }).join('<br>');
	  }
	  return html;
	};
	const replaceWords = (str, map, lang = 'en') => {
	  if (!str) return str;
	  let _str = str;
	  for (let [key, val] of map) {
	    if (!key || key.length < 2) continue;
	    const expr = key.replace(/\./g, '\\.').replace(/\*/g, '\\*');
	    const reStr = lang === 'en' ? `\\b${expr}\\b` : `${expr}`;
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
	  return _str;
	};
	const getPreview = () => {
	  const str = sessionStorage.getItem('blhxfy:preview');
	  let data = [];
	  if (str) {
	    try {
	      data = JSON.parse(str);
	    } catch (e) {
	      console.error(e);
	    }
	  }
	  return data;
	};
	const getPreviewCsv = name => {
	  const data = getPreview();
	  let csv = '';
	  for (let item of data) {
	    if (item.name === name) {
	      csv = purify.sanitize(item.csv);
	    }
	  }
	  return csv;
	};
	const splitSingleLineSkill = csv => {
	  return csv.replace(/\s(skill|special|npc|support|intro|,|active)/g, '\n$1');
	};
	const isDomain = str => {
	  if (!/^https?:\/\//.test(str)) return false;
	  if (/\s/.test(str.trim())) return false;
	  return true;
	};
	const getPlusStr = str => {
	  let plusStr = '';
	  let plusStr2 = '';
	  let _str = str;
	  while (_str.endsWith('+') || _str.endsWith('＋')) {
	    plusStr += '＋';
	    plusStr2 += '+';
	    _str = _str.slice(0, _str.length - 1);
	  }
	  return [plusStr, plusStr2, _str];
	};
	const race = (func, time = 500) => {
	  return function (...args) {
	    const promise1 = func(...args);
	    const promise2 = new Promise(rev => {
	      setTimeout(() => {
	        rev(args[0]);
	      }, time);
	    });
	    return Promise.race([promise1, promise2]);
	  };
	};
	const deepClone = data => {
	  return JSON.parse(JSON.stringify(data));
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

	const whiteList = ['需要<%= quest_ap - sp %><%= point_name %>来开始。', '使用道具恢复<%= point_name %>？', `来自<span class='txt-request-name'><%= n.attributes.called_user_name %></span>的救援请求`, '物品「<%= contents[0].higher_order_info.from_name %>」的<br>效果已经生效了，<br>所以「<%= contents[0].name %>」的效果无法生效', `来自<span class='txt-request-name'><%= raid['called_user_name'] %></span>的救援请求`, '还剩<%= can_quest_start_count %>回挑战（一共<%= max_quest_start_count %>回）', '<%= set_user.name %> Rank <%= set_user.rank %> 选择任务', '更改第<%= stamp.priority %>个表情', '→掷出了<%= log[i].result_number %>', '<%= log[i].nickname %>对<%= log[i].item_name %>进行ROLL点', '<%= log[i].nickname %>获得了<%= log[i].item_name %>', '阅读 <%= n.episode_name %>', '<%= title %>'];
	const filter = (str, notTrim = false) => {
	  if (!whiteList.includes(str) && /[><]/.test(str)) {
	    let _str = purify.sanitize(str);
	    if (typeof _str !== 'string') {
	      _str = _str.toString();
	    }
	    return notTrim ? _str : trim(_str);
	  }
	  return notTrim ? str : trim(str);
	};

	var version = "2.7.4";

	const config = {
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
	  originText: false,
	  defaultFont: false,
	  cacheTime: 30,
	  version: version
	};
	const getLocalConfig = () => {
	  const str = localStorage.getItem('blhxfy:setting');
	  let setting = JSON.parse(str);
	  if (!isPlainObject_1(setting)) setting = {};
	  const {
	    origin
	  } = setting;
	  if (isDomain(origin)) {
	    config.origin = origin.trim();
	  }
	  if (LOCAL_HOST) {
	    config.origin = 'http://127.0.0.1:15945';
	  }
	  const keys = ['autoDownload', 'bottomToolbar', 'displayName', 'removeScroller', 'hideSidebar', 'originText', 'storyOnly', 'showTranslator', 'transJa', 'transEn', 'font', 'fontBold', 'plainText', 'battleTrans', 'log', 'defaultFont'];
	  keys.forEach(key => {
	    let value = setting[key];
	    if (isString_1(value)) value = filter(value.trim());
	    if (isBoolean_1(value) || value) {
	      config[key] = value;
	    }
	  });
	};
	const getLocalHash = () => {
	  try {
	    const str = sessionStorage.getItem('blhxfy:data');
	    const data = JSON.parse(str);
	    config.localHash = data.hash;
	  } catch (err) {
	    // ignore
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

	const insertCSS = () => {
	  const link = document.createElement('link');
	  link.type = 'text/css';
	  link.rel = 'stylesheet';
	  link.href = `${config.origin}/blhxfy/data/static/style/BLHXFY.css?lacia=${config.hash['BLHXFY.css'] || ''}`;
	  document.head.appendChild(link);
	};
	let fetchInfo = {
	  status: 'init',
	  result: false,
	  data: null
	};
	const saveManifest = async () => {
	  const t = Math.floor(Date.now() / 1000 / 60 / 60 / 6);
	  const res = await fetch(`${config.origin}/blhxfy/manifest.json?t=${t}`);
	  const data = await res.json();
	  data.time = Date.now();
	  localStorage.setItem('blhxfy:manifest', JSON.stringify(data));
	  return data;
	};
	const getManifest = async () => {
	  let data;
	  try {
	    let str = localStorage.getItem('blhxfy:manifest');
	    if (str) data = JSON.parse(str);
	    if (Date.now() - data.time > config.cacheTime * 60 * 1000) data = false;
	  } catch (e) {}
	  if (!data) {
	    data = await saveManifest();
	  } else {
	    setTimeout(saveManifest, 5 * 1000);
	  }
	  return data;
	};
	const tryFetch = async () => {
	  if (window.fetch) {
	    // if (sessionStorage.getItem('blhxfy:cors') === 'disabled') {
	    //   fetchInfo.status = 'finished'
	    //   return
	    // }
	    try {
	      const data = await getManifest();
	      fetchInfo.data = data;
	      fetchInfo.result = true;
	      sessionStorage.setItem('blhxfy:cors', 'enabled');
	    } catch (e) {
	      sessionStorage.setItem('blhxfy:cors', 'disabled');
	    }
	  }
	  fetchInfo.status = 'finished';
	};
	const request = async pathname => {
	  if (fetchInfo.result) {
	    return new Promise((rev, rej) => {
	      const url = /^https?:\/\//.test(pathname) ? pathname : `${config.origin}${pathname}`;
	      fetch(url).then(res => {
	        if (!res.ok) {
	          rej(`${res.status} ${res.url}`);
	          return '';
	        }
	        const type = res.headers.get('content-type');
	        if (type.includes('json')) {
	          return res.json();
	        }
	        return res.text();
	      }).then(rev).catch(rej);
	    });
	  }
	};
	let getHashPrms;
	let getHash = () => {
	  if (getHashPrms) return getHashPrms;
	  return getHashPrms = new Promise((rev, rej) => {
	    if (fetchInfo.status !== 'finished') {
	      tryFetch().then(() => {
	        const beforeStart = data => {
	          config.newVersion = data.version;
	          config.hash = data.hashes;
	          insertCSS();
	        };
	        if (fetchInfo.result) {
	          beforeStart(fetchInfo.data);
	          rev(fetchInfo.data.hashes);
	        } else {
	          rej('加载manifest.json失败');
	        }
	      }).catch(rej);
	    } else {
	      rev(fetchInfo.data.hashes);
	    }
	  });
	};
	const fetchWithHash = async (pathname, hash) => {
	  if (!hash) {
	    const hashes = await getHash();
	    const key = pathname.replace('/blhxfy/data/', '');
	    hash = hashes[key];
	  }
	  const data = await request(`${pathname}${hash ? `?lacia=${hash}` : ''}`);
	  return data;
	};

	var papaparse_min = createCommonjsModule(function (module, exports) {
	/* @license
	Papa Parse
	v5.5.3
	https://github.com/mholt/PapaParse
	License: MIT
	*/
	((e,t)=>{module.exports=t();})(commonjsGlobal,function r(){var n="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==n?n:{};var d,s=!n.document&&!!n.postMessage,a=n.IS_PAPA_WORKER||!1,o={},h=0,v={};function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=b(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t;}.call(this,e),this.parseChunk=function(t,e){var i=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<i){let e=this._config.newline;e||(r=this._config.quoteChar||'"',e=this._handle.guessLineEndings(t,r)),t=[...t.split(e).slice(i)].join(e);}this.isFirstChunk&&U(this._config.beforeFirstChunk)&&void 0!==(r=this._config.beforeFirstChunk(t))&&(t=r),this.isFirstChunk=!1,this._halted=!1;var i=this._partialLine+t,r=(this._partialLine="",this._handle.parse(i,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){t=r.meta.cursor,i=(this._finished||(this._partialLine=i.substring(t-this._baseIndex),this._baseIndex=t),r&&r.data&&(this._rowCount+=r.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview);if(a)n.postMessage({results:r,workerId:v.WORKER_ID,finished:i});else if(U(this._config.chunk)&&!e){if(this._config.chunk(r,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=r=void 0;}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(r.data),this._completeResults.errors=this._completeResults.errors.concat(r.errors),this._completeResults.meta=r.meta),this._completed||!i||!U(this._config.complete)||r&&r.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),i||r&&r.meta.paused||this._nextChunk(),r}this._halted=!0;},this._sendError=function(e){U(this._config.error)?this._config.error(e):a&&this._config.error&&n.postMessage({workerId:v.WORKER_ID,error:e,finished:!1});};}function f(e){var r;(e=e||{}).chunkSize||(e.chunkSize=v.RemoteChunkSize),u.call(this,e),this._nextChunk=s?function(){this._readChunk(),this._chunkLoaded();}:function(){this._readChunk();},this.stream=function(e){this._input=e,this._nextChunk();},this._readChunk=function(){if(this._finished)this._chunkLoaded();else {if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),s||(r.onload=y(this._chunkLoaded,this),r.onerror=y(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!s),this._config.downloadRequestHeaders){var e,t=this._config.downloadRequestHeaders;for(e in t)r.setRequestHeader(e,t[e]);}var i;this._config.chunkSize&&(i=this._start+this._config.chunkSize-1,r.setRequestHeader("Range","bytes="+this._start+"-"+i));try{r.send(this._config.downloadRequestBody);}catch(e){this._chunkError(e.message);}s&&0===r.status&&this._chunkError();}},this._chunkLoaded=function(){4===r.readyState&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize||r.responseText.length,this._finished=!this._config.chunkSize||this._start>=(e=>null!==(e=e.getResponseHeader("Content-Range"))?parseInt(e.substring(e.lastIndexOf("/")+1)):-1)(r),this.parseChunk(r.responseText)));},this._chunkError=function(e){e=r.statusText||e;this._sendError(new Error(e));};}function l(e){(e=e||{}).chunkSize||(e.chunkSize=v.LocalChunkSize),u.call(this,e);var i,r,n="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,r=e.slice||e.webkitSlice||e.mozSlice,n?((i=new FileReader).onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)):i=new FileReaderSync,this._nextChunk();},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk();},this._readChunk=function(){var e=this._input,t=(this._config.chunkSize&&(t=Math.min(this._start+this._config.chunkSize,this._input.size),e=r.call(e,this._start,t)),i.readAsText(e,this._config.encoding));n||this._chunkLoaded({target:{result:t}});},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result);},this._chunkError=function(){this._sendError(i.error);};}function c(e){var i;u.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){var e,t;if(!this._finished)return e=this._config.chunkSize,i=e?(t=i.substring(0,e),i.substring(e)):(t=i,""),this._finished=!i,this.parseChunk(t)};}function p(e){u.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause();},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume();},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError);},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0);},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0;},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()));}catch(e){this._streamError(e);}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e);},this),this._streamEnd=y(function(){this._streamCleanUp(),r=!0,this._streamData("");},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError);},this);}function i(m){var n,s,a,t,o=Math.pow(2,53),h=-o,u=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,d=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,i=this,r=0,f=0,l=!1,e=!1,c=[],p={data:[],errors:[],meta:{}};function y(e){return "greedy"===m.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function g(){if(p&&a&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+v.DefaultDelimiter+"'"),a=!1),m.skipEmptyLines&&(p.data=p.data.filter(function(e){return !y(e)})),_()){if(p)if(Array.isArray(p.data[0])){for(var e=0;_()&&e<p.data.length;e++)p.data[e].forEach(t);p.data.splice(0,1);}else p.data.forEach(t);function t(e,t){U(m.transformHeader)&&(e=m.transformHeader(e,t)),c.push(e);}}function i(e,t){for(var i=m.header?{}:[],r=0;r<e.length;r++){var n=r,s=e[r],s=((e,t)=>(e=>(m.dynamicTypingFunction&&void 0===m.dynamicTyping[e]&&(m.dynamicTyping[e]=m.dynamicTypingFunction(e)),!0===(m.dynamicTyping[e]||m.dynamicTyping)))(e)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&((e=>{if(u.test(e)){e=parseFloat(e);if(h<e&&e<o)return 1}})(t)?parseFloat(t):d.test(t)?new Date(t):""===t?null:t):t)(n=m.header?r>=c.length?"__parsed_extra":c[r]:n,s=m.transform?m.transform(s,n):s);"__parsed_extra"===n?(i[n]=i[n]||[],i[n].push(s)):i[n]=s;}return m.header&&(r>c.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+c.length+" fields but parsed "+r,f+t):r<c.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+c.length+" fields but parsed "+r,f+t)),i}var r;p&&(m.header||m.dynamicTyping||m.transform)&&(r=1,!p.data.length||Array.isArray(p.data[0])?(p.data=p.data.map(i),r=p.data.length):p.data=i(p.data,0),m.header&&p.meta&&(p.meta.fields=c),f+=r);}function _(){return m.header&&0===c.length}function k(e,t,i,r){e={type:e,code:t,message:i};void 0!==r&&(e.row=r),p.errors.push(e);}U(m.step)&&(t=m.step,m.step=function(e){p=e,_()?g():(g(),0!==p.data.length&&(r+=e.data.length,m.preview&&r>m.preview?s.abort():(p.data=p.data[0],t(p,i))));}),this.parse=function(e,t,i){var r=m.quoteChar||'"',r=(m.newline||(m.newline=this.guessLineEndings(e,r)),a=!1,m.delimiter?U(m.delimiter)&&(m.delimiter=m.delimiter(e),p.meta.delimiter=m.delimiter):((r=((e,t,i,r,n)=>{var s,a,o,h;n=n||[",","\t","|",";",v.RECORD_SEP,v.UNIT_SEP];for(var u=0;u<n.length;u++){for(var d,f=n[u],l=0,c=0,p=0,g=(o=void 0,new E({comments:r,delimiter:f,newline:t,preview:10}).parse(e)),_=0;_<g.data.length;_++)i&&y(g.data[_])?p++:(d=g.data[_].length,c+=d,void 0===o?o=d:0<d&&(l+=Math.abs(d-o),o=d));0<g.data.length&&(c/=g.data.length-p),(void 0===a||l<=a)&&(void 0===h||h<c)&&1.99<c&&(a=l,s=f,h=c);}return {successful:!!(m.delimiter=s),bestDelimiter:s}})(e,m.newline,m.skipEmptyLines,m.comments,m.delimitersToGuess)).successful?m.delimiter=r.bestDelimiter:(a=!0,m.delimiter=v.DefaultDelimiter),p.meta.delimiter=m.delimiter),b(m));return m.preview&&m.header&&r.preview++,n=e,s=new E(r),p=s.parse(n,t,i),g(),l?{meta:{paused:!0}}:p||{meta:{paused:!1}}},this.paused=function(){return l},this.pause=function(){l=!0,s.abort(),n=U(m.chunk)?"":n.substring(s.getCharIndex());},this.resume=function(){i.streamer._halted?(l=!1,i.streamer.parseChunk(n,!0)):setTimeout(i.resume,3);},this.aborted=function(){return e},this.abort=function(){e=!0,s.abort(),p.meta.aborted=!0,U(m.complete)&&m.complete(p),n="";},this.guessLineEndings=function(e,t){e=e.substring(0,1048576);var t=new RegExp(P(t)+"([^]*?)"+P(t),"gm"),i=(e=e.replace(t,"")).split("\r"),t=e.split("\n"),e=1<t.length&&t[0].length<i[0].length;if(1===i.length||e)return "\n";for(var r=0,n=0;n<i.length;n++)"\n"===i[n][0]&&r++;return r>=i.length/2?"\r\n":"\r"};}function P(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(C){var S=(C=C||{}).delimiter,O=C.newline,x=C.comments,I=C.step,A=C.preview,T=C.fastMode,D=null,L=!1,F=null==C.quoteChar?'"':C.quoteChar,j=F;if(void 0!==C.escapeChar&&(j=C.escapeChar),("string"!=typeof S||-1<v.BAD_DELIMITERS.indexOf(S))&&(S=","),x===S)throw new Error("Comment character same as delimiter");!0===x?x="#":("string"!=typeof x||-1<v.BAD_DELIMITERS.indexOf(x))&&(x=!1),"\n"!==O&&"\r"!==O&&"\r\n"!==O&&(O="\n");var z=0,M=!1;this.parse=function(i,t,r){if("string"!=typeof i)throw new Error("Input must be a string");var n=i.length,e=S.length,s=O.length,a=x.length,o=U(I),h=[],u=[],d=[],f=z=0;if(!i)return w();if(T||!1!==T&&-1===i.indexOf(F)){for(var l=i.split(O),c=0;c<l.length;c++){if(d=l[c],z+=d.length,c!==l.length-1)z+=O.length;else if(r)return w();if(!x||d.substring(0,a)!==x){if(o){if(h=[],k(d.split(S)),R(),M)return w()}else k(d.split(S));if(A&&A<=c)return h=h.slice(0,A),w(!0)}}return w()}for(var p=i.indexOf(S,z),g=i.indexOf(O,z),_=new RegExp(P(j)+P(F),"g"),m=i.indexOf(F,z);;)if(i[z]===F)for(m=z,z++;;){if(-1===(m=i.indexOf(F,m+1)))return r||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:z}),E();if(m===n-1)return E(i.substring(z,m).replace(_,F));if(F===j&&i[m+1]===j)m++;else if(F===j||0===m||i[m-1]!==j){-1!==p&&p<m+1&&(p=i.indexOf(S,m+1));var y=v(-1===(g=-1!==g&&g<m+1?i.indexOf(O,m+1):g)?p:Math.min(p,g));if(i.substr(m+1+y,e)===S){d.push(i.substring(z,m).replace(_,F)),i[z=m+1+y+e]!==F&&(m=i.indexOf(F,z)),p=i.indexOf(S,z),g=i.indexOf(O,z);break}y=v(g);if(i.substring(m+1+y,m+1+y+s)===O){if(d.push(i.substring(z,m).replace(_,F)),b(m+1+y+s),p=i.indexOf(S,z),m=i.indexOf(F,z),o&&(R(),M))return w();if(A&&h.length>=A)return w(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:z}),m++;}}else if(x&&0===d.length&&i.substring(z,z+a)===x){if(-1===g)return w();z=g+s,g=i.indexOf(O,z),p=i.indexOf(S,z);}else if(-1!==p&&(p<g||-1===g))d.push(i.substring(z,p)),z=p+e,p=i.indexOf(S,z);else {if(-1===g)break;if(d.push(i.substring(z,g)),b(g+s),o&&(R(),M))return w();if(A&&h.length>=A)return w(!0)}return E();function k(e){h.push(e),f=z;}function v(e){var t=0;return t=-1!==e&&(e=i.substring(m+1,e))&&""===e.trim()?e.length:t}function E(e){return r||(void 0===e&&(e=i.substring(z)),d.push(e),z=n,k(d),o&&R()),w()}function b(e){z=e,k(d),d=[],g=i.indexOf(O,z);}function w(e){if(C.header&&!t&&h.length&&!L){var s=h[0],a=Object.create(null),o=new Set(s);let n=!1;for(let r=0;r<s.length;r++){let i=s[r];if(a[i=U(C.transformHeader)?C.transformHeader(i,r):i]){let e,t=a[i];for(;e=i+"_"+t,t++,o.has(e););o.add(e),s[r]=e,a[i]++,n=!0,(D=null===D?{}:D)[e]=i;}else a[i]=1,s[r]=i;o.add(i);}n&&console.warn("Duplicate headers found and renamed."),L=!0;}return {data:h,errors:u,meta:{delimiter:S,linebreak:O,aborted:M,truncated:!!e,cursor:f+(t||0),renamedHeaders:D}}}function R(){I(w()),h=[],u=[];}},this.abort=function(){M=!0;},this.getCharIndex=function(){return z};}function g(e){var t=e.data,i=o[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){r=!0,_(t.workerId,{data:[],errors:[],meta:{aborted:!0}});},pause:m,resume:m};if(U(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!r);s++);delete t.results;}else U(i.userChunk)&&(i.userChunk(t.results,n,t.file),delete t.results);}t.finished&&!r&&_(t.workerId,t.results);}function _(e,t){var i=o[e];U(i.userComplete)&&i.userComplete(t),i.terminate(),delete o[e];}function m(){throw new Error("Not implemented.")}function b(e){if("object"!=typeof e||null===e)return e;var t,i=Array.isArray(e)?[]:{};for(t in e)i[t]=b(e[t]);return i}function y(e,t){return function(){e.apply(t,arguments);}}function U(e){return "function"==typeof e}return v.parse=function(e,t){var i=(t=t||{}).dynamicTyping||!1;U(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!U(t.transform)&&t.transform,!t.worker||!v.WORKERS_SUPPORTED)return i=null,"string"==typeof e?(e=(e=>65279!==e.charCodeAt(0)?e:e.slice(1))(e),i=new(t.download?f:c)(t)):!0===e.readable&&U(e.read)&&U(e.on)?i=new p(t):(n.File&&e instanceof File||e instanceof Object)&&(i=new l(t)),i.stream(e);(i=(()=>{var e;return !!v.WORKERS_SUPPORTED&&(e=(()=>{var e=n.URL||n.webkitURL||null,t=r.toString();return v.BLOB_URL||(v.BLOB_URL=e.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",t,")();"],{type:"text/javascript"})))})(),(e=new n.Worker(e)).onmessage=g,e.id=h++,o[e.id]=e)})()).userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=U(t.step),t.chunk=U(t.chunk),t.complete=U(t.complete),t.error=U(t.error),delete t.worker,i.postMessage({input:e,config:t,workerId:i.id});},v.unparse=function(e,t){var n=!1,_=!0,m=",",y="\r\n",s='"',a=s+s,i=!1,r=null,o=!1,h=((()=>{if("object"==typeof t){if("string"!=typeof t.delimiter||v.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter),"boolean"!=typeof t.quotes&&"function"!=typeof t.quotes&&!Array.isArray(t.quotes)||(n=t.quotes),"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(i=t.skipEmptyLines),"string"==typeof t.newline&&(y=t.newline),"string"==typeof t.quoteChar&&(s=t.quoteChar),"boolean"==typeof t.header&&(_=t.header),Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");r=t.columns;}void 0!==t.escapeChar&&(a=t.escapeChar+s),t.escapeFormulae instanceof RegExp?o=t.escapeFormulae:"boolean"==typeof t.escapeFormulae&&t.escapeFormulae&&(o=/^[=+\-@\t\r].*$/);}})(),new RegExp(P(s),"g"));"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,i);if("object"==typeof e[0])return u(r||Object.keys(e[0]),e,i)}else if("object"==typeof e)return "string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||r),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],i);throw new Error("Unable to serialize unrecognized input");function u(e,t,i){var r="",n=("string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t)),Array.isArray(e)&&0<e.length),s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(r+=m),r+=k(e[a],a);0<t.length&&(r+=y);}for(var o=0;o<t.length;o++){var h=(n?e:t[o]).length,u=!1,d=n?0===Object.keys(t[o]).length:0===t[o].length;if(i&&!n&&(u="greedy"===i?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===i&&n){for(var f=[],l=0;l<h;l++){var c=s?e[l]:l;f.push(t[o][c]);}u=""===f.join("").trim();}if(!u){for(var p=0;p<h;p++){0<p&&!d&&(r+=m);var g=n&&s?e[p]:p;r+=k(t[o][g],p);}o<t.length-1&&(!i||0<h&&!d)&&(r+=y);}}return r}function k(e,t){var i,r;return null==e?"":e.constructor===Date?JSON.stringify(e).slice(1,25):(r=!1,o&&"string"==typeof e&&o.test(e)&&(e="'"+e,r=!0),i=e.toString().replace(h,a),(r=r||!0===n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||((e,t)=>{for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return !0;return !1})(i,v.BAD_DELIMITERS)||-1<i.indexOf(m)||" "===i.charAt(0)||" "===i.charAt(i.length-1))?s+i+s:i)}},v.RECORD_SEP=String.fromCharCode(30),v.UNIT_SEP=String.fromCharCode(31),v.BYTE_ORDER_MARK="\ufeff",v.BAD_DELIMITERS=["\r","\n",'"',v.BYTE_ORDER_MARK],v.WORKERS_SUPPORTED=!s&&!!n.Worker,v.NODE_STREAM_INPUT=1,v.LocalChunkSize=10485760,v.RemoteChunkSize=5242880,v.DefaultDelimiter=",",v.Parser=E,v.ParserHandle=i,v.NetworkStreamer=f,v.FileStreamer=l,v.StringStreamer=c,v.ReadableStreamStreamer=p,n.jQuery&&((d=n.jQuery).fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&n.FileReader)||!this.files||0===this.files.length)return !0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)});}),e(),this;function e(){if(0===h.length)U(o.complete)&&o.complete();else {var e,t,i,r,n=h[0];if(U(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,i=n.inputElem,r=s.reason,void(U(o.error)&&o.error({name:e},t,i,r));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config));}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){U(a)&&a(e,n.file,n.inputElem),u();},v.parse(n.file,n.instanceConfig);}}function u(){h.splice(0,1),e();}}),a&&(n.onmessage=function(e){e=e.data;void 0===v.WORKER_ID&&e&&(v.WORKER_ID=e.workerId);"string"==typeof e.input?n.postMessage({workerId:v.WORKER_ID,results:v.parse(e.input,e.config),finished:!0}):(n.File&&e.input instanceof File||e.input instanceof Object)&&(e=v.parse(e.input,e.config))&&n.postMessage({workerId:v.WORKER_ID,results:e,finished:!0});}),(f.prototype=Object.create(u.prototype)).constructor=f,(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(c.prototype)).constructor=c,(p.prototype=Object.create(u.prototype)).constructor=p,v});
	});

	const parseCsv = str => {
	  try {
	    return papaparse_min.parse(str.replace(/^\ufeff/, ''), {
	      header: true
	    }).data;
	  } catch (err) {
	    console.error(err);
	    return {};
	  }
	};

	const loginBonusMap = new Map();
	let loaded = false;
	const getLoginBonus = async () => {
	  if (!loaded) {
	    const csv = await fetchWithHash('/blhxfy/data/login-bonus.csv');
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const text = trim(item.text);
	      const trans = filter(item.trans);
	      if (text && trans) {
	        loginBonusMap.set(text, trans);
	      }
	    });
	    loaded = true;
	  }
	  return loginBonusMap;
	};

	const loginBonus = async data => {
	  let isReplay = data.isReplay;
	  if (isReplay) {
	    data = localLoginBonus();
	  }
	  if (data.param && data.param.msgArray) {
	    let loginBonusMap = await getLoginBonus();
	    data.param.msgArray.forEach((txt, index) => {
	      if (loginBonusMap.has(txt)) {
	        data.param.msgArray[index] = loginBonusMap.get(txt);
	      }
	    });
	    if (isReplay) {
	      localLoginBonus(data);
	    }
	  }
	};
	const localLoginBonus = data => {
	  try {
	    if (data) {
	      localStorage.setItem('login', JSON.stringify(data));
	    } else {
	      let str = localStorage.getItem('login');
	      if (str) {
	        let data = JSON.parse(str);
	        return data;
	      }
	    }
	  } catch (e) {}
	};
	localLoginBonus();

	const sortKeywords = (list, key = 'EMPTY') => {
	  return list.sort((prev, next) => {
	    let valPrev = prev;
	    let valNext = next;
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

	const enNameMap = new Map();
	const jpNameMap = new Map();
	const nounMap = new Map();
	const nounFixMap = new Map();
	const caiyunPrefixMap = new Map();
	let loaded$1 = false;
	let nounLoaded = false;
	const checkVersion = str => {
	  if (/^\(v\d+_\d+_\d+\).+/.test(str)) {
	    let rgs = str.match(/^\(v(\d+)_(\d+)_(\d+)\)(.+)/);
	    return {
	      version: [rgs[1], rgs[2], rgs[3]],
	      text: rgs[4]
	    };
	  }
	  return false;
	};
	const versionPass = ver => {
	  let arr = config.version.split('.');
	  let res = [arr[0] - ver[0], arr[1] - ver[1], arr[2] - ver[2]];
	  return res[0] > 0 || res[0] === 0 && res[1] > 0 || res[0] === 0 && res[1] === 0 && res[2] >= 0;
	};
	const getNameData = async () => {
	  if (!loaded$1) {
	    const nameEn = await fetchWithHash('/blhxfy/data/npc-name-en.csv');
	    const nameJp = await fetchWithHash('/blhxfy/data/npc-name-jp.csv');
	    const listEn = parseCsv(nameEn);
	    const listJp = parseCsv(nameJp);
	    sortKeywords(listEn, 'name').forEach(item => {
	      const name = trim(item.name);
	      const trans = filter(item.trans);
	      enNameMap.set(name, trans);
	    });
	    sortKeywords(listJp, 'name').forEach(item => {
	      const name = trim(item.name);
	      const trans = filter(item.trans);
	      jpNameMap.set(name, trans);
	    });
	    loaded$1 = true;
	  }
	  return {
	    enNameMap,
	    jpNameMap
	  };
	};
	const getNounData = async () => {
	  if (!nounLoaded) {
	    const noun = await fetchWithHash('/blhxfy/data/noun.csv');
	    const nounFix = await fetchWithHash('/blhxfy/data/noun-fix.csv');
	    const caiyunPrefix = await fetchWithHash('/blhxfy/data/caiyun-prefix.csv');
	    const listNoun = parseCsv(noun);
	    const listNounFix = parseCsv(nounFix);
	    const listCaiyunPrefix = parseCsv(caiyunPrefix);
	    sortKeywords(listNoun, 'keyword').forEach(item => {
	      const keyword = trim(item.keyword);
	      const trans = filter(item.trans);
	      if (keyword && trans) {
	        nounMap.set(keyword, {
	          trans,
	          ignoreCase: !item.cs
	        });
	      }
	    });
	    sortKeywords(listNounFix, 'text').forEach(item => {
	      const text = trim(item.text);
	      const fix = filter(item.fixed);
	      if (text) {
	        let result = checkVersion(text);
	        if (result) {
	          if (versionPass(result.version)) {
	            nounFixMap.set(result.text, fix);
	          }
	        } else {
	          nounFixMap.set(text, fix);
	        }
	      }
	    });
	    sortKeywords(listCaiyunPrefix, 'text').forEach(item => {
	      const text = trim(item.text);
	      const fix = filter(item.fixed);
	      if (text && fix) {
	        caiyunPrefixMap.set(text, fix);
	      }
	    });
	    nounLoaded = true;
	  }
	  return {
	    nounMap,
	    nounFixMap,
	    caiyunPrefixMap
	  };
	};

	var pako_inflate_min = createCommonjsModule(function (module, exports) {
	!function(e){module.exports=e();}(function(){return function r(o,s,f){function l(t,e){if(!s[t]){if(!o[t]){var i="function"==typeof require&&require;if(!e&&i)return i(t,!0);if(d)return d(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var a=s[t]={exports:{}};o[t][0].call(a.exports,function(e){return l(o[t][1][e]||e)},a,a.exports,r,o,s,f);}return s[t].exports}for(var d="function"==typeof require&&require,e=0;e<f.length;e++)l(f[e]);return l}({1:[function(e,t,i){var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;i.assign=function(e){for(var t,i,n=Array.prototype.slice.call(arguments,1);n.length;){var a=n.shift();if(a){if("object"!=typeof a)throw new TypeError(a+"must be non-object");for(var r in a)t=a,i=r,Object.prototype.hasOwnProperty.call(t,i)&&(e[r]=a[r]);}}return e},i.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var a={arraySet:function(e,t,i,n,a){if(t.subarray&&e.subarray)e.set(t.subarray(i,i+n),a);else for(var r=0;r<n;r++)e[a+r]=t[i+r];},flattenChunks:function(e){var t,i,n,a,r,o;for(t=n=0,i=e.length;t<i;t++)n+=e[t].length;for(o=new Uint8Array(n),t=a=0,i=e.length;t<i;t++)r=e[t],o.set(r,a),a+=r.length;return o}},r={arraySet:function(e,t,i,n,a){for(var r=0;r<n;r++)e[a+r]=t[i+r];},flattenChunks:function(e){return [].concat.apply([],e)}};i.setTyped=function(e){e?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,a)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,r));},i.setTyped(n);},{}],2:[function(e,t,i){var f=e("./common"),a=!0,r=!0;try{String.fromCharCode.apply(null,[0]);}catch(e){a=!1;}try{String.fromCharCode.apply(null,new Uint8Array(1));}catch(e){r=!1;}for(var l=new f.Buf8(256),n=0;n<256;n++)l[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function d(e,t){if(t<65534&&(e.subarray&&r||!e.subarray&&a))return String.fromCharCode.apply(null,f.shrinkBuf(e,t));for(var i="",n=0;n<t;n++)i+=String.fromCharCode(e[n]);return i}l[254]=l[254]=1,i.string2buf=function(e){var t,i,n,a,r,o=e.length,s=0;for(a=0;a<o;a++)55296==(64512&(i=e.charCodeAt(a)))&&a+1<o&&56320==(64512&(n=e.charCodeAt(a+1)))&&(i=65536+(i-55296<<10)+(n-56320),a++),s+=i<128?1:i<2048?2:i<65536?3:4;for(t=new f.Buf8(s),a=r=0;r<s;a++)55296==(64512&(i=e.charCodeAt(a)))&&a+1<o&&56320==(64512&(n=e.charCodeAt(a+1)))&&(i=65536+(i-55296<<10)+(n-56320),a++),i<128?t[r++]=i:(i<2048?t[r++]=192|i>>>6:(i<65536?t[r++]=224|i>>>12:(t[r++]=240|i>>>18,t[r++]=128|i>>>12&63),t[r++]=128|i>>>6&63),t[r++]=128|63&i);return t},i.buf2binstring=function(e){return d(e,e.length)},i.binstring2buf=function(e){for(var t=new f.Buf8(e.length),i=0,n=t.length;i<n;i++)t[i]=e.charCodeAt(i);return t},i.buf2string=function(e,t){var i,n,a,r,o=t||e.length,s=new Array(2*o);for(i=n=0;i<o;)if((a=e[i++])<128)s[n++]=a;else if(4<(r=l[a]))s[n++]=65533,i+=r-1;else {for(a&=2===r?31:3===r?15:7;1<r&&i<o;)a=a<<6|63&e[i++],r--;1<r?s[n++]=65533:a<65536?s[n++]=a:(a-=65536,s[n++]=55296|a>>10&1023,s[n++]=56320|1023&a);}return d(s,n)},i.utf8border=function(e,t){var i;for((t=t||e.length)>e.length&&(t=e.length),i=t-1;0<=i&&128==(192&e[i]);)i--;return i<0?t:0===i?t:i+l[e[i]]>t?i:t};},{"./common":1}],3:[function(e,t,i){t.exports=function(e,t,i,n){for(var a=65535&e|0,r=e>>>16&65535|0,o=0;0!==i;){for(i-=o=2e3<i?2e3:i;r=r+(a=a+t[n++]|0)|0,--o;);a%=65521,r%=65521;}return a|r<<16|0};},{}],4:[function(e,t,i){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8};},{}],5:[function(e,t,i){var s=function(){for(var e,t=[],i=0;i<256;i++){e=i;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[i]=e;}return t}();t.exports=function(e,t,i,n){var a=s,r=n+i;e^=-1;for(var o=n;o<r;o++)e=e>>>8^a[255&(e^t[o])];return -1^e};},{}],6:[function(e,t,i){t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1;};},{}],7:[function(e,t,i){t.exports=function(e,t){var i,n,a,r,o,s,f,l,d,c,u,h,b,m,w,k,_,g,v,p,x,y,S,E,Z;i=e.state,n=e.next_in,E=e.input,a=n+(e.avail_in-5),r=e.next_out,Z=e.output,o=r-(t-e.avail_out),s=r+(e.avail_out-257),f=i.dmax,l=i.wsize,d=i.whave,c=i.wnext,u=i.window,h=i.hold,b=i.bits,m=i.lencode,w=i.distcode,k=(1<<i.lenbits)-1,_=(1<<i.distbits)-1;e:do{b<15&&(h+=E[n++]<<b,b+=8,h+=E[n++]<<b,b+=8),g=m[h&k];t:for(;;){if(h>>>=v=g>>>24,b-=v,0===(v=g>>>16&255))Z[r++]=65535&g;else {if(!(16&v)){if(0==(64&v)){g=m[(65535&g)+(h&(1<<v)-1)];continue t}if(32&v){i.mode=12;break e}e.msg="invalid literal/length code",i.mode=30;break e}p=65535&g,(v&=15)&&(b<v&&(h+=E[n++]<<b,b+=8),p+=h&(1<<v)-1,h>>>=v,b-=v),b<15&&(h+=E[n++]<<b,b+=8,h+=E[n++]<<b,b+=8),g=w[h&_];i:for(;;){if(h>>>=v=g>>>24,b-=v,!(16&(v=g>>>16&255))){if(0==(64&v)){g=w[(65535&g)+(h&(1<<v)-1)];continue i}e.msg="invalid distance code",i.mode=30;break e}if(x=65535&g,b<(v&=15)&&(h+=E[n++]<<b,(b+=8)<v&&(h+=E[n++]<<b,b+=8)),f<(x+=h&(1<<v)-1)){e.msg="invalid distance too far back",i.mode=30;break e}if(h>>>=v,b-=v,(v=r-o)<x){if(d<(v=x-v)&&i.sane){e.msg="invalid distance too far back",i.mode=30;break e}if(S=u,(y=0)===c){if(y+=l-v,v<p){for(p-=v;Z[r++]=u[y++],--v;);y=r-x,S=Z;}}else if(c<v){if(y+=l+c-v,(v-=c)<p){for(p-=v;Z[r++]=u[y++],--v;);if(y=0,c<p){for(p-=v=c;Z[r++]=u[y++],--v;);y=r-x,S=Z;}}}else if(y+=c-v,v<p){for(p-=v;Z[r++]=u[y++],--v;);y=r-x,S=Z;}for(;2<p;)Z[r++]=S[y++],Z[r++]=S[y++],Z[r++]=S[y++],p-=3;p&&(Z[r++]=S[y++],1<p&&(Z[r++]=S[y++]));}else {for(y=r-x;Z[r++]=Z[y++],Z[r++]=Z[y++],Z[r++]=Z[y++],2<(p-=3););p&&(Z[r++]=Z[y++],1<p&&(Z[r++]=Z[y++]));}break}}break}}while(n<a&&r<s);n-=p=b>>3,h&=(1<<(b-=p<<3))-1,e.next_in=n,e.next_out=r,e.avail_in=n<a?a-n+5:5-(n-a),e.avail_out=r<s?s-r+257:257-(r-s),i.hold=h,i.bits=b;};},{}],8:[function(e,t,i){var z=e("../utils/common"),R=e("./adler32"),N=e("./crc32"),O=e("./inffast"),C=e("./inftrees"),I=1,D=2,T=0,U=-2,F=1,n=852,a=592;function L(e){return (e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function r(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new z.Buf16(320),this.work=new z.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0;}function o(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=F,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new z.Buf32(n),t.distcode=t.distdyn=new z.Buf32(a),t.sane=1,t.back=-1,T):U}function s(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,o(e)):U}function f(e,t){var i,n;return e&&e.state?(n=e.state,t<0?(i=0,t=-t):(i=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=i,n.wbits=t,s(e))):U}function l(e,t){var i,n;return e?(n=new r,(e.state=n).window=null,(i=f(e,t))!==T&&(e.state=null),i):U}var d,c,u=!0;function H(e){if(u){var t;for(d=new z.Buf32(512),c=new z.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(C(I,e.lens,0,288,d,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;C(D,e.lens,0,32,c,0,e.work,{bits:5}),u=!1;}e.lencode=d,e.lenbits=9,e.distcode=c,e.distbits=5;}function j(e,t,i,n){var a,r=e.state;return null===r.window&&(r.wsize=1<<r.wbits,r.wnext=0,r.whave=0,r.window=new z.Buf8(r.wsize)),n>=r.wsize?(z.arraySet(r.window,t,i-r.wsize,r.wsize,0),r.wnext=0,r.whave=r.wsize):(n<(a=r.wsize-r.wnext)&&(a=n),z.arraySet(r.window,t,i-n,a,r.wnext),(n-=a)?(z.arraySet(r.window,t,i-n,n,0),r.wnext=n,r.whave=r.wsize):(r.wnext+=a,r.wnext===r.wsize&&(r.wnext=0),r.whave<r.wsize&&(r.whave+=a))),0}i.inflateReset=s,i.inflateReset2=f,i.inflateResetKeep=o,i.inflateInit=function(e){return l(e,15)},i.inflateInit2=l,i.inflate=function(e,t){var i,n,a,r,o,s,f,l,d,c,u,h,b,m,w,k,_,g,v,p,x,y,S,E,Z=0,B=new z.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(i=e.state).mode&&(i.mode=13),o=e.next_out,a=e.output,f=e.avail_out,r=e.next_in,n=e.input,s=e.avail_in,l=i.hold,d=i.bits,c=s,u=f,y=T;e:for(;;)switch(i.mode){case F:if(0===i.wrap){i.mode=13;break}for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(2&i.wrap&&35615===l){B[i.check=0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0),d=l=0,i.mode=2;break}if(i.flags=0,i.head&&(i.head.done=!1),!(1&i.wrap)||(((255&l)<<8)+(l>>8))%31){e.msg="incorrect header check",i.mode=30;break}if(8!=(15&l)){e.msg="unknown compression method",i.mode=30;break}if(d-=4,x=8+(15&(l>>>=4)),0===i.wbits)i.wbits=x;else if(x>i.wbits){e.msg="invalid window size",i.mode=30;break}i.dmax=1<<x,e.adler=i.check=1,i.mode=512&l?10:12,d=l=0;break;case 2:for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(i.flags=l,8!=(255&i.flags)){e.msg="unknown compression method",i.mode=30;break}if(57344&i.flags){e.msg="unknown header flags set",i.mode=30;break}i.head&&(i.head.text=l>>8&1),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0,i.mode=3;case 3:for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.head&&(i.head.time=l),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,B[2]=l>>>16&255,B[3]=l>>>24&255,i.check=N(i.check,B,4,0)),d=l=0,i.mode=4;case 4:for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.head&&(i.head.xflags=255&l,i.head.os=l>>8),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0,i.mode=5;case 5:if(1024&i.flags){for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.length=l,i.head&&(i.head.extra_len=l),512&i.flags&&(B[0]=255&l,B[1]=l>>>8&255,i.check=N(i.check,B,2,0)),d=l=0;}else i.head&&(i.head.extra=null);i.mode=6;case 6:if(1024&i.flags&&(s<(h=i.length)&&(h=s),h&&(i.head&&(x=i.head.extra_len-i.length,i.head.extra||(i.head.extra=new Array(i.head.extra_len)),z.arraySet(i.head.extra,n,r,h,x)),512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,i.length-=h),i.length))break e;i.length=0,i.mode=7;case 7:if(2048&i.flags){if(0===s)break e;for(h=0;x=n[r+h++],i.head&&x&&i.length<65536&&(i.head.name+=String.fromCharCode(x)),x&&h<s;);if(512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,x)break e}else i.head&&(i.head.name=null);i.length=0,i.mode=8;case 8:if(4096&i.flags){if(0===s)break e;for(h=0;x=n[r+h++],i.head&&x&&i.length<65536&&(i.head.comment+=String.fromCharCode(x)),x&&h<s;);if(512&i.flags&&(i.check=N(i.check,n,h,r)),s-=h,r+=h,x)break e}else i.head&&(i.head.comment=null);i.mode=9;case 9:if(512&i.flags){for(;d<16;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(l!==(65535&i.check)){e.msg="header crc mismatch",i.mode=30;break}d=l=0;}i.head&&(i.head.hcrc=i.flags>>9&1,i.head.done=!0),e.adler=i.check=0,i.mode=12;break;case 10:for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}e.adler=i.check=L(l),d=l=0,i.mode=11;case 11:if(0===i.havedict)return e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,2;e.adler=i.check=1,i.mode=12;case 12:if(5===t||6===t)break e;case 13:if(i.last){l>>>=7&d,d-=7&d,i.mode=27;break}for(;d<3;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}switch(i.last=1&l,d-=1,3&(l>>>=1)){case 0:i.mode=14;break;case 1:if(H(i),i.mode=20,6!==t)break;l>>>=2,d-=2;break e;case 2:i.mode=17;break;case 3:e.msg="invalid block type",i.mode=30;}l>>>=2,d-=2;break;case 14:for(l>>>=7&d,d-=7&d;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if((65535&l)!=(l>>>16^65535)){e.msg="invalid stored block lengths",i.mode=30;break}if(i.length=65535&l,d=l=0,i.mode=15,6===t)break e;case 15:i.mode=16;case 16:if(h=i.length){if(s<h&&(h=s),f<h&&(h=f),0===h)break e;z.arraySet(a,n,r,h,o),s-=h,r+=h,f-=h,o+=h,i.length-=h;break}i.mode=12;break;case 17:for(;d<14;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(i.nlen=257+(31&l),l>>>=5,d-=5,i.ndist=1+(31&l),l>>>=5,d-=5,i.ncode=4+(15&l),l>>>=4,d-=4,286<i.nlen||30<i.ndist){e.msg="too many length or distance symbols",i.mode=30;break}i.have=0,i.mode=18;case 18:for(;i.have<i.ncode;){for(;d<3;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.lens[A[i.have++]]=7&l,l>>>=3,d-=3;}for(;i.have<19;)i.lens[A[i.have++]]=0;if(i.lencode=i.lendyn,i.lenbits=7,S={bits:i.lenbits},y=C(0,i.lens,0,19,i.lencode,0,i.work,S),i.lenbits=S.bits,y){e.msg="invalid code lengths set",i.mode=30;break}i.have=0,i.mode=19;case 19:for(;i.have<i.nlen+i.ndist;){for(;k=(Z=i.lencode[l&(1<<i.lenbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(_<16)l>>>=w,d-=w,i.lens[i.have++]=_;else {if(16===_){for(E=w+2;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(l>>>=w,d-=w,0===i.have){e.msg="invalid bit length repeat",i.mode=30;break}x=i.lens[i.have-1],h=3+(3&l),l>>>=2,d-=2;}else if(17===_){for(E=w+3;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}d-=w,x=0,h=3+(7&(l>>>=w)),l>>>=3,d-=3;}else {for(E=w+7;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}d-=w,x=0,h=11+(127&(l>>>=w)),l>>>=7,d-=7;}if(i.have+h>i.nlen+i.ndist){e.msg="invalid bit length repeat",i.mode=30;break}for(;h--;)i.lens[i.have++]=x;}}if(30===i.mode)break;if(0===i.lens[256]){e.msg="invalid code -- missing end-of-block",i.mode=30;break}if(i.lenbits=9,S={bits:i.lenbits},y=C(I,i.lens,0,i.nlen,i.lencode,0,i.work,S),i.lenbits=S.bits,y){e.msg="invalid literal/lengths set",i.mode=30;break}if(i.distbits=6,i.distcode=i.distdyn,S={bits:i.distbits},y=C(D,i.lens,i.nlen,i.ndist,i.distcode,0,i.work,S),i.distbits=S.bits,y){e.msg="invalid distances set",i.mode=30;break}if(i.mode=20,6===t)break e;case 20:i.mode=21;case 21:if(6<=s&&258<=f){e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,O(e,u),o=e.next_out,a=e.output,f=e.avail_out,r=e.next_in,n=e.input,s=e.avail_in,l=i.hold,d=i.bits,12===i.mode&&(i.back=-1);break}for(i.back=0;k=(Z=i.lencode[l&(1<<i.lenbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(k&&0==(240&k)){for(g=w,v=k,p=_;k=(Z=i.lencode[p+((l&(1<<g+v)-1)>>g)])>>>16&255,_=65535&Z,!(g+(w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}l>>>=g,d-=g,i.back+=g;}if(l>>>=w,d-=w,i.back+=w,i.length=_,0===k){i.mode=26;break}if(32&k){i.back=-1,i.mode=12;break}if(64&k){e.msg="invalid literal/length code",i.mode=30;break}i.extra=15&k,i.mode=22;case 22:if(i.extra){for(E=i.extra;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.length+=l&(1<<i.extra)-1,l>>>=i.extra,d-=i.extra,i.back+=i.extra;}i.was=i.length,i.mode=23;case 23:for(;k=(Z=i.distcode[l&(1<<i.distbits)-1])>>>16&255,_=65535&Z,!((w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(0==(240&k)){for(g=w,v=k,p=_;k=(Z=i.distcode[p+((l&(1<<g+v)-1)>>g)])>>>16&255,_=65535&Z,!(g+(w=Z>>>24)<=d);){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}l>>>=g,d-=g,i.back+=g;}if(l>>>=w,d-=w,i.back+=w,64&k){e.msg="invalid distance code",i.mode=30;break}i.offset=_,i.extra=15&k,i.mode=24;case 24:if(i.extra){for(E=i.extra;d<E;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}i.offset+=l&(1<<i.extra)-1,l>>>=i.extra,d-=i.extra,i.back+=i.extra;}if(i.offset>i.dmax){e.msg="invalid distance too far back",i.mode=30;break}i.mode=25;case 25:if(0===f)break e;if(h=u-f,i.offset>h){if((h=i.offset-h)>i.whave&&i.sane){e.msg="invalid distance too far back",i.mode=30;break}h>i.wnext?(h-=i.wnext,b=i.wsize-h):b=i.wnext-h,h>i.length&&(h=i.length),m=i.window;}else m=a,b=o-i.offset,h=i.length;for(f<h&&(h=f),f-=h,i.length-=h;a[o++]=m[b++],--h;);0===i.length&&(i.mode=21);break;case 26:if(0===f)break e;a[o++]=i.length,f--,i.mode=21;break;case 27:if(i.wrap){for(;d<32;){if(0===s)break e;s--,l|=n[r++]<<d,d+=8;}if(u-=f,e.total_out+=u,i.total+=u,u&&(e.adler=i.check=i.flags?N(i.check,a,u,o-u):R(i.check,a,u,o-u)),u=f,(i.flags?l:L(l))!==i.check){e.msg="incorrect data check",i.mode=30;break}d=l=0;}i.mode=28;case 28:if(i.wrap&&i.flags){for(;d<32;){if(0===s)break e;s--,l+=n[r++]<<d,d+=8;}if(l!==(4294967295&i.total)){e.msg="incorrect length check",i.mode=30;break}d=l=0;}i.mode=29;case 29:y=1;break e;case 30:y=-3;break e;case 31:return -4;case 32:default:return U}return e.next_out=o,e.avail_out=f,e.next_in=r,e.avail_in=s,i.hold=l,i.bits=d,(i.wsize||u!==e.avail_out&&i.mode<30&&(i.mode<27||4!==t))&&j(e,e.output,e.next_out,u-e.avail_out)?(i.mode=31,-4):(c-=e.avail_in,u-=e.avail_out,e.total_in+=c,e.total_out+=u,i.total+=u,i.wrap&&u&&(e.adler=i.check=i.flags?N(i.check,a,u,e.next_out-u):R(i.check,a,u,e.next_out-u)),e.data_type=i.bits+(i.last?64:0)+(12===i.mode?128:0)+(20===i.mode||15===i.mode?256:0),(0===c&&0===u||4===t)&&y===T&&(y=-5),y)},i.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,T},i.inflateGetHeader=function(e,t){var i;return e&&e.state?0==(2&(i=e.state).wrap)?U:((i.head=t).done=!1,T):U},i.inflateSetDictionary=function(e,t){var i,n=t.length;return e&&e.state?0!==(i=e.state).wrap&&11!==i.mode?U:11===i.mode&&R(1,t,n,0)!==i.check?-3:j(e,t,n,n)?(i.mode=31,-4):(i.havedict=1,T):U},i.inflateInfo="pako inflate (from Nodeca project)";},{"../utils/common":1,"./adler32":3,"./crc32":5,"./inffast":7,"./inftrees":9}],9:[function(e,t,i){var I=e("../utils/common"),D=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],T=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],F=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,i,n,a,r,o,s){var f,l,d,c,u,h,b,m,w,k=s.bits,_=0,g=0,v=0,p=0,x=0,y=0,S=0,E=0,Z=0,B=0,A=null,z=0,R=new I.Buf16(16),N=new I.Buf16(16),O=null,C=0;for(_=0;_<=15;_++)R[_]=0;for(g=0;g<n;g++)R[t[i+g]]++;for(x=k,p=15;1<=p&&0===R[p];p--);if(p<x&&(x=p),0===p)return a[r++]=20971520,a[r++]=20971520,s.bits=1,0;for(v=1;v<p&&0===R[v];v++);for(x<v&&(x=v),_=E=1;_<=15;_++)if(E<<=1,(E-=R[_])<0)return -1;if(0<E&&(0===e||1!==p))return -1;for(N[1]=0,_=1;_<15;_++)N[_+1]=N[_]+R[_];for(g=0;g<n;g++)0!==t[i+g]&&(o[N[t[i+g]]++]=g);if(0===e?(A=O=o,h=19):1===e?(A=D,z-=257,O=T,C-=257,h=256):(A=U,O=F,h=-1),_=v,u=r,S=g=B=0,d=-1,c=(Z=1<<(y=x))-1,1===e&&852<Z||2===e&&592<Z)return 1;for(;;){for(b=_-S,o[g]<h?(m=0,w=o[g]):o[g]>h?(m=O[C+o[g]],w=A[z+o[g]]):(m=96,w=0),f=1<<_-S,v=l=1<<y;a[u+(B>>S)+(l-=f)]=b<<24|m<<16|w|0,0!==l;);for(f=1<<_-1;B&f;)f>>=1;if(0!==f?(B&=f-1,B+=f):B=0,g++,0==--R[_]){if(_===p)break;_=t[i+o[g]];}if(x<_&&(B&c)!==d){for(0===S&&(S=x),u+=v,E=1<<(y=_-S);y+S<p&&!((E-=R[y+S])<=0);)y++,E<<=1;if(Z+=1<<y,1===e&&852<Z||2===e&&592<Z)return 1;a[d=B&c]=x<<24|y<<16|u-r|0;}}return 0!==B&&(a[u+B]=_-S<<24|64<<16|0),s.bits=x,0};},{"../utils/common":1}],10:[function(e,t,i){t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"};},{}],11:[function(e,t,i){t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0;};},{}],"/lib/inflate.js":[function(e,t,i){var c=e("./zlib/inflate"),u=e("./utils/common"),h=e("./utils/strings"),b=e("./zlib/constants"),n=e("./zlib/messages"),a=e("./zlib/zstream"),r=e("./zlib/gzheader"),m=Object.prototype.toString;function o(e){if(!(this instanceof o))return new o(e);this.options=u.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new a,this.strm.avail_out=0;var i=c.inflateInit2(this.strm,t.windowBits);if(i!==b.Z_OK)throw new Error(n[i]);if(this.header=new r,c.inflateGetHeader(this.strm,this.header),t.dictionary&&("string"==typeof t.dictionary?t.dictionary=h.string2buf(t.dictionary):"[object ArrayBuffer]"===m.call(t.dictionary)&&(t.dictionary=new Uint8Array(t.dictionary)),t.raw&&(i=c.inflateSetDictionary(this.strm,t.dictionary))!==b.Z_OK))throw new Error(n[i])}function s(e,t){var i=new o(t);if(i.push(e,!0),i.err)throw i.msg||n[i.err];return i.result}o.prototype.push=function(e,t){var i,n,a,r,o,s=this.strm,f=this.options.chunkSize,l=this.options.dictionary,d=!1;if(this.ended)return !1;n=t===~~t?t:!0===t?b.Z_FINISH:b.Z_NO_FLUSH,"string"==typeof e?s.input=h.binstring2buf(e):"[object ArrayBuffer]"===m.call(e)?s.input=new Uint8Array(e):s.input=e,s.next_in=0,s.avail_in=s.input.length;do{if(0===s.avail_out&&(s.output=new u.Buf8(f),s.next_out=0,s.avail_out=f),(i=c.inflate(s,b.Z_NO_FLUSH))===b.Z_NEED_DICT&&l&&(i=c.inflateSetDictionary(this.strm,l)),i===b.Z_BUF_ERROR&&!0===d&&(i=b.Z_OK,d=!1),i!==b.Z_STREAM_END&&i!==b.Z_OK)return this.onEnd(i),!(this.ended=!0);s.next_out&&(0!==s.avail_out&&i!==b.Z_STREAM_END&&(0!==s.avail_in||n!==b.Z_FINISH&&n!==b.Z_SYNC_FLUSH)||("string"===this.options.to?(a=h.utf8border(s.output,s.next_out),r=s.next_out-a,o=h.buf2string(s.output,a),s.next_out=r,s.avail_out=f-r,r&&u.arraySet(s.output,s.output,a,r,0),this.onData(o)):this.onData(u.shrinkBuf(s.output,s.next_out)))),0===s.avail_in&&0===s.avail_out&&(d=!0);}while((0<s.avail_in||0===s.avail_out)&&i!==b.Z_STREAM_END);return i===b.Z_STREAM_END&&(n=b.Z_FINISH),n===b.Z_FINISH?(i=c.inflateEnd(this.strm),this.onEnd(i),this.ended=!0,i===b.Z_OK):n!==b.Z_SYNC_FLUSH||(this.onEnd(b.Z_OK),!(s.avail_out=0))},o.prototype.onData=function(e){this.chunks.push(e);},o.prototype.onEnd=function(e){e===b.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=u.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg;},i.Inflate=o,i.inflate=s,i.inflateRaw=function(e,t){return (t=t||{}).raw=!0,s(e,t)},i.ungzip=s;},{"./utils/common":1,"./utils/strings":2,"./zlib/constants":4,"./zlib/gzheader":6,"./zlib/inflate":8,"./zlib/messages":10,"./zlib/zstream":11}]},{},[])("/lib/inflate.js")});
	});

	let storyData = null;
	let storyDataAI = null;
	const getStoryCSV = async name => {
	  if (!storyData) {
	    const binaryString = await fetchWithHash('/blhxfy/data/story-map.json');
	    storyData = JSON.parse(pako_inflate_min.inflate(binaryString, {
	      to: 'string'
	    }));
	  }
	  if (config.transJa && Game.lang === 'ja' || config.transEn && Game.lang === 'en') {
	    if (!storyDataAI) {
	      try {
	        const binaryString = await fetchWithHash('https://blhx-ai.danmu9.com/blhxfy/story-map.json');
	        storyDataAI = JSON.parse(pako_inflate_min.inflate(binaryString, {
	          to: 'string'
	        }));
	      } finally {}
	    }
	  }
	  let isAI = false;
	  let csv = '';
	  if (storyData[name]) {
	    csv = await fetchWithHash(`/blhxfy/data/story/${storyData[name]}`);
	  } else if (storyDataAI && storyDataAI[name]) {
	    csv = await fetchWithHash(`https://blhx-ai.danmu9.com/blhxfy/story/${storyDataAI[name]}`);
	    isAI = true;
	  }
	  return [csv, isAI];
	};

	const ignoreList = ['null', '???', '？？？'];
	const sepList = ['・', '&', ' and ', '＆', '／'];
	const getTrans = (text, maps) => {
	  for (let map of maps) {
	    if (map.has(text)) {
	      return map.get(text);
	    }
	  }
	  return false;
	};
	const transName = (text, maps) => {
	  const name = trim(text);
	  if (ignoreList.includes(name)) return text;
	  let trans = getTrans(text, maps);
	  if (/.+?\s?[\?？0-9０-９]{1,2}$/.test(name)) {
	    const rs = name.match(/(.+?)\s?([\?？0-9０-９]{1,2})$/);
	    const transTemp = getTrans(rs[1], maps);
	    if (transTemp) trans = `${transTemp}${rs[2]}`;
	  } else if (/'s\sVoice$/.test(name)) {
	    let nameTemp = name.slice(0, name.length - 8);
	    const transTemp = getTrans(nameTemp, maps);
	    if (transTemp) trans = `${transTemp}的声音`;
	  } else if (/の声$/.test(name)) {
	    let nameTemp = name.slice(0, name.length - 2);
	    const transTemp = getTrans(nameTemp, maps);
	    if (transTemp) trans = `${transTemp}的声音`;
	  } else if (!trans) {
	    sepList.forEach(sep => {
	      if (new RegExp(sep).test(name)) {
	        const arr = name.split(sep);
	        trans = arr.map(nm => {
	          const transTemp = getTrans(nm, maps);
	          return transTemp || nm;
	        }).join(sep);
	      }
	    });
	  }
	  return trans || text;
	};

	const template = `
<style>
#wrapper .cnt-setting #btn-setting-blhxfy {
  position: absolute;
  left: 16px;
  top: 104px;
}
#blhxfy-setting-modal {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  background: #f6feff;
  width: 100%;
  min-height: 100%;
  z-index: 99999;
  padding-bottom: 38px;
}
#blhxfy-setting-modal input[type=text] {
  display: block !important;
  outline: none;
  width: 274px;
  font-size: 12px;
  padding: 4px;
  box-shadow: none;
  border: 1px solid #78bbd8;
  border-radius: 2px;
  font-family: sans-serif;
  color: #4d6671;
}
#blhxfy-setting-modal.show {
  display: block;
}
#blhxfy-setting-modal input[type=text]::placeholder {
  color: #aaa;
}
</style>
<div id="blhxfy-setting-modal">
<div class="cnt-setting">
	<div class="prt-setting-header"><img class="img-header" src="https://blhx.danmu9.com/blhxfy/data/static/image/setting-header.jpg" alt="header_public"></div>

	<div class="prt-setting-module ">
		<div class="txt-setting-title">插件设置</div>

		<div class="block-story-only prt-button">
		<input id="story-only-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'story-only', this.checked)" type="checkbox" value="">
		<label for="story-only-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">只翻译剧情</label>
		</div>

		<div class="prt-setting-frame">
			<div class="prt-setting-article">
				<div class="txt-article-title">翻译数据域名</div>
				<ul class="txt-article-lead">
					<li>留空则使用默认的数据源</li>
				</ul>
				<div class="prt-button-l">
          <input id="origin-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'origin', this.value)" type="text" value="" placeholder="https://blhx.danmu9.com">
        </div>
      </div>
      <div class="txt-setting-lead">
        ※使用第三方数据源有风险，请选择可以信任的数据源。
      </div>

      <div class="prt-setting-article">
				<div class="txt-article-title">主角名</div>
				<ul class="txt-article-lead">
					<li>剧情里显示的主角名字，留空则使用你自己的昵称</li>
				</ul>
				<div class="prt-button-l">
          <input id="username-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'username', this.value)" type="text" value="" placeholder="请输入主角名">
				</div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">机翻设置</div>
				<ul class="txt-article-lead">
					<li>在一些使用场景下，可能不会生效</li>
				</ul>
				<div class="prt-button">
					<div>
						<input id="trans-ja-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'trans-ja', this.checked)" type="checkbox" value="">
						<label for="trans-ja-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">日语机翻</label>
					</div>
					<div>
						<input id="trans-en-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'trans-en', this.checked)" type="checkbox" value="">
						<label for="trans-en-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">英语机翻</label>
					</div>
				</div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">字体设置</div>
				<ul class="txt-article-lead">
					<li>剧情文本使用的字体。</li>
				</ul>
				<div class="prt-button">
					<input style="width:180px;margin-right:10px" id="font-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'font', this.value)" type="text" value="" placeholder="请输入字体">
					<div>
						<input id="font-bold-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'font-bold', this.checked)" type="checkbox" value="">
						<label style="top:2px" for="font-bold-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">加粗</label>
					</div>
				</div>
			</div>

			<div class="txt-setting-lead">
        ※格式同CSS的font-family。填 none 则不修改字体，显示游戏默认字体效果。
      </div>

      <div class="prt-setting-article">
				<div class="txt-article-title">战斗界面的技能翻译</div>
				<ul class="txt-article-lead">
					<li>激活后在汉化战斗界面的技能按钮</li>
				</ul>
				<div class="prt-button-l">
					<div>
						<input id="battle-trans-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'battle-trans', this.checked)" type="checkbox" value="">
						<label for="battle-trans-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">启用</label>
					</div>
        </div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">剧情CSV文件快捷下载</div>
				<ul class="txt-article-lead">
					<li>激活后在 SKIP 的时候自动下载剧情CSV（此功能仅供译者使用，这里的下载文件并不是指加载数据）</li>
				</ul>
				<div class="prt-button-l">
					<div>
						<input id="auto-download-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'auto-download', this.checked)" type="checkbox" value="">
						<label for="auto-download-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">自动下载CSV</label>
					</div>
        </div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">其他设置</div>
				<ul class="txt-article-lead">
					<li>可以选择隐藏网页滚动条 / 隐藏Mobage侧边栏（仅PC网页） / 在后台播放BGM</li>
				</ul>
				<div class="prt-button" style="flex-wrap: wrap;display: flex;">
					<div>
						<input id="remove-scroller-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'remove-scroller', this.checked)" type="checkbox" value="">
						<label for="remove-scroller-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">隐藏滚动条</label>
					</div>
					<div>
						<input id="hide-sidebar-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'hide-sidebar', this.checked)" type="checkbox" value="">
						<label for="hide-sidebar-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">隐藏侧边栏</label>
					</div>
					<div>
						<input id="default-font-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'default-font', this.checked)" type="checkbox" value="">
						<label for="default-font-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">调整字体</label>
					</div>
					<div style="margin-top:5px;">
						<input id="origin-text-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'origin-text', this.checked);window.blhxfy.sendEvent('setting', 'fast-mode', event);" type="checkbox" value="" data-post-name="scene_fast_text_mode" name="scene-fast-text-mode">
						<label for="origin-text-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">原文对照</label>
					</div>
					<div style="margin-top:5px;">
						<input id="show-translator-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'show-translator', this.checked);" type="checkbox" value="">
						<label for="show-translator-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">显示译者</label>
					</div>
					<div style="margin-top:5px;">
						<input id="log-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'log', this.checked);" type="checkbox" value="">
						<label for="log-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">显示Log</label>
					</div>
				</div>
			</div>

      <div class="txt-setting-lead">
        ※修改的设置在刷新页面后生效
      </div>
		</div>
	</div>

	<div class="prt-lead-link">
		<div class="lis-lead-prev" data-href="setting"><div class="atx-lead-link">返回设置</div></div>
		<div class="lis-lead-prev" data-href="mypage"><div class="atx-lead-link">返回首页</div></div>
	</div>
</div>
</div>
`;
	const templateForWheel = `
<style>
#blhxfy-setting-modal {
	height: 100%;
	overflow: auto;
}
</style>
`;
	const wheelStopPg = e => {
	  e.stopImmediatePropagation();
	};
	function insertSettingHtml (html) {
	  html = html.replace('<div class="cnt-setting">', `${template}<div class="cnt-setting"><div class="cnt-setting"><div class="btn-usual-text" id="btn-setting-blhxfy" onclick="window.blhxfy.sendEvent('setting', 'show')">汉化插件设置</div>`);
	  if (location.hash !== '#setting') {
	    html = html.replace('<div class="btn-usual-text" id="btn-setting-blhxfy"', `${templateForWheel}<div class="btn-usual-text" id="btn-setting-blhxfy"`);
	    setTimeout(() => {
	      const modal = document.getElementById('blhxfy-setting-modal');
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

	const extraHtml = template.replace('data-href="setting"', 'onclick="window.blhxfy.sendEvent(\'setting\', \'hide\')"').replace('返回设置', '返回剧情');
	function insertToolHtml () {
	  const html = `
  <style>
  @font-face {
    font-family: 'blhxwf';
    font-style: normal;
    font-weight: normal;
    src: url('${config.origin}/blhxfy/data/static/webfont.woff2');
  }
  .cnt-quest-scene .prt-log-display {
    padding-top: 74px;
  }
  #blhxfy-story-tool {
    display: none;
  }
  #blhxfy-story-tool > div {
    width: 152px;
    margin: 7px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #blhxfy-story-input button,
  #blhxfy-story-tool button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px 6px;
    font-size: 10px;
    margin: 0;
    letter-spacing: 1px;
    line-height: 1;
    outline: none;
    position: relative;
    transition: none;
    border-radius: 3px;
    background: #539cba;
    color: #fff;
    box-shadow: 0 3px #165c85;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5)
  }

  #blhxfy-story-input button:hover,
  #blhxfy-story-tool button:hover {
    box-shadow: 0 2px #165c85;
    top: 1px;
  }
  #blhxfy-story-input button:active,
  #blhxfy-story-tool button:active {
    box-shadow: 0 1px #165c85;
    top: 2px;
  }
  .log #blhxfy-story-tool {
    display: block;
    position: absolute;
    top: 26px;
    left: 50%;
    width: 180px;
    margin-left: -90px;
    z-index: 9999;
    text-align: center;
  }
  #blhxfy-story-input {
    position: absolute;
    display: none;
    top: 0;
    left: 0;
    width: 320px;
    height: 100%;
    background: #fff;
    z-index: 10000;
  }
  .blhxfy-preview-tool {
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e3e3e3;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    background: #116d82;
  }
  #blhxfy-story-input p {
    margin: 10px 10px 0 10px;
    color: #5b8690;
    text-align: left;
    font-size: 10px;
    position: relative;
  }
  #blhxfy-story-input p a {
    color: #29b82d;
    position: absolute;
    cursor: pointer;
    padding: 4px;
    right: 0;
    top: -5px;
  }
  #blhxfy-story-input textarea {
    width: 300px;
    height: calc(100% - 80px);
    margin: 10px;
    box-sizing: border-box;
    font-size: 8px;
    padding: 4px;
    border-radius: 2px;
    box-shadow: inset 0 0 3px #2c88d775;
    outline: none;
    resize: none;
    font-family: Consolas, "Microsoft Yahei";
  }
  .language-setting-blhxfy {
    font-size: 10px;
    color: #fff;
    top: 1px;
    position: relative;
    font-family: Microsoft Jhenghei;
  }
  .language-setting-blhxfy select {
    border: none;
    border-radius: 2px;
  }
  .blhxfy-story-plaintext {
    position: absolute;
    right: -33px;
    top: 8px;
    color: #fff;
    width: auto !important;
    font-size: 8px;
  }
  </style>
  <div id="blhxfy-story-tool">
    <div class="blhxfy-story-plaintext">
      <input id="plain-text-blhxfy" type="checkbox" onchange="window.blhxfy.sendEvent('setting', 'plain-text', this.checked)">
      <label for="plain-text-blhxfy" style="padding-left:2px" title="勾选后，下载的csv文件会去掉里面的html代码">纯文本</label>
    </div>
    <div>
      <button onclick="window.blhxfy.sendEvent('dlStoryCsv')" title="下载未翻译的剧情文本">原文</button>
      <button onclick="window.blhxfy.sendEvent('dlStoryCsv', 'fill')" title="下载用原文填充trans列的剧情文本">填充</button>
      <button onclick="window.blhxfy.sendEvent('dlStoryCsv', 'trans')" title="下载已翻译的剧情文本">译文</button>
      <button onclick="window.blhxfy.sendEvent('previewCsv', 'show')" title="填写翻译好的剧情文本来预览">预览</button>
    </div>
    <div>
      <div class="language-setting-blhxfy">
        <span>语言：</span>
        <select id="language-type-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'language', event)" class="frm-list-select frm-post-async is-reload" data-post-name="language_type">
          <option value="1">日本語</option>
          <option value="2">English</option>
        </select>
      </div>
      <button onclick="window.blhxfy.sendEvent('setting', 'show')" title="插件设置">设置</button>
    </div>
  </div>
  <div id="blhxfy-story-input">
    <div class="blhxfy-preview-tool">
      <button onclick="window.blhxfy.sendEvent('previewCsv', 'hide')">取消</button>
      <button onclick="window.blhxfy.sendEvent('previewCsv', 'save')" title="保存预览文本并刷新页面">保存</button>
    </div>
    <p>请将编辑好的剧情文本粘贴到文本框<a onclick="window.blhxfy.sendEvent('previewCsv', 'clear')" title="清除预览文本">清空</a></p>
    <textarea placeholder="剧情文本"></textarea>
  </div>
  <link type="text/css" rel="stylesheet" href="${Game.cssUri}/setting/index.css">
  ${extraHtml}
  `;
	  const cont = jQuery('.cnt-quest-scene');
	  const tool = jQuery('#blhxfy-story-tool');
	  if (tool[0]) return;
	  if (cont[0]) {
	    cont.prepend(html);
	    const langVal = {
	      ja: 1,
	      en: 2
	    };
	    jQuery('#language-type-blhxfy').val(langVal[Game.lang]);
	    jQuery('#plain-text-blhxfy')[0].checked = config.plainText;
	    if (config.originText) {
	      cont.find('.prt-scene-comment').prepend(`<div class="blhxfy-btn-origin-text"></div>`);
	    }
	  }
	}

	function autoDownloadCsv () {
	  if (config.autoDownload) {
	    let downloaded = false;
	    let win = window.unsafeWindow || window;
	    jQuery('#wrapper').off('click.blhxfy-dlcsv').on('click.blhxfy-dlcsv', '.cnt-quest-scene .btn-skip', function () {
	      setTimeout(() => {
	        if (!document.querySelector('.pop-synopsis')) {
	          win.blhxfy.sendEvent('dlStoryCsv');
	          downloaded = true;
	        }
	      }, 100);
	    });
	    jQuery('#wrapper').off('click.blhxfy-dlcsv2').on('click.blhxfy-dlcsv2', '.pop-synopsis .btn-usual-ok,.btn-scene-skip', function () {
	      if (!downloaded) {
	        win.blhxfy.sendEvent('dlStoryCsv');
	      }
	    });
	  }
	}

	const CROSS_DOMAIN_REQ = !!window.GM_xmlhttpRequest;
	const request$1 = (url, option) => {
	  const {
	    method = 'GET',
	    headers,
	    responseType = 'json',
	    data,
	    cors = false,
	    credentials
	  } = option;
	  if (cors) {
	    return fetch(url, {
	      body: data,
	      headers,
	      method,
	      mode: 'cors',
	      credentials
	    }).then(res => res.json());
	  }
	  return new Promise((rev, rej) => {
	    if (!CROSS_DOMAIN_REQ) {
	      return rej('GM_XHR MISSING');
	    }
	    window.GM_xmlhttpRequest({
	      method,
	      url,
	      headers,
	      responseType,
	      data,
	      onload({
	        status,
	        responseText,
	        statusText
	      }) {
	        if (status >= 200 && status < 300) {
	          if (responseType === 'json') {
	            const obj = JSON.parse(responseText);
	            rev(obj);
	          } else {
	            rev(responseText);
	          }
	        } else {
	          rej(statusText);
	        }
	      },
	      onerror(err) {
	        rej(err);
	      }
	    });
	  });
	};

	//
	// Given two 64bit ints (as an array of two 32bit ints) returns the two
	// added together as a 64bit int (as an array of two 32bit ints).
	//
	var x64Add = function (m, n) {
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
	};

	//
	// Given two 64bit ints (as an array of two 32bit ints) returns the two
	// multiplied together as a 64bit int (as an array of two 32bit ints).
	//
	var x64Multiply = function (m, n) {
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
	};
	//
	// Given a 64bit int (as an array of two 32bit ints) and an int
	// representing a number of bit positions, returns the 64bit int (as an
	// array of two 32bit ints) rotated left by that number of positions.
	//
	var x64Rotl = function (m, n) {
	  n %= 64;
	  if (n === 32) {
	    return [m[1], m[0]];
	  } else if (n < 32) {
	    return [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n];
	  } else {
	    n -= 32;
	    return [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n];
	  }
	};
	//
	// Given a 64bit int (as an array of two 32bit ints) and an int
	// representing a number of bit positions, returns the 64bit int (as an
	// array of two 32bit ints) shifted left by that number of positions.
	//
	var x64LeftShift = function (m, n) {
	  n %= 64;
	  if (n === 0) {
	    return m;
	  } else if (n < 32) {
	    return [m[0] << n | m[1] >>> 32 - n, m[1] << n];
	  } else {
	    return [m[1] << n - 32, 0];
	  }
	};
	//
	// Given two 64bit ints (as an array of two 32bit ints) returns the two
	// xored together as a 64bit int (as an array of two 32bit ints).
	//
	var x64Xor = function (m, n) {
	  return [m[0] ^ n[0], m[1] ^ n[1]];
	};
	//
	// Given a block, returns murmurHash3's final x64 mix of that block.
	// (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
	// only place where we need to right shift 64bit ints.)
	//
	var x64Fmix = function (h) {
	  h = x64Xor(h, [0, h[0] >>> 1]);
	  h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
	  h = x64Xor(h, [0, h[0] >>> 1]);
	  h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
	  h = x64Xor(h, [0, h[0] >>> 1]);
	  return h;
	};

	//
	// Given a string and an optional seed as an int, returns a 128 bit
	// hash using the x64 flavor of MurmurHash3, as an unsigned hex.
	//
	var x64hash128 = function (key, seed) {
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

	/**
	 *  base64.ts
	 *
	 *  Licensed under the BSD 3-Clause License.
	 *    http://opensource.org/licenses/BSD-3-Clause
	 *
	 *  References:
	 *    http://en.wikipedia.org/wiki/Base64
	 *
	 * @author Dan Kogai (https://github.com/dankogai)
	 */
	const version$1 = '3.7.8';
	/**
	 * @deprecated use lowercase `version`.
	 */
	const VERSION = version$1;
	const _hasBuffer = typeof Buffer === 'function';
	const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
	const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
	const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	const b64chs = Array.prototype.slice.call(b64ch);
	const b64tab = ((a) => {
	    let tab = {};
	    a.forEach((c, i) => tab[c] = i);
	    return tab;
	})(b64chs);
	const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
	const _fromCC = String.fromCharCode.bind(String);
	const _U8Afrom = typeof Uint8Array.from === 'function'
	    ? Uint8Array.from.bind(Uint8Array)
	    : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
	const _mkUriSafe = (src) => src
	    .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
	const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
	/**
	 * polyfill version of `btoa`
	 */
	const btoaPolyfill = (bin) => {
	    // console.log('polyfilled');
	    let u32, c0, c1, c2, asc = '';
	    const pad = bin.length % 3;
	    for (let i = 0; i < bin.length;) {
	        if ((c0 = bin.charCodeAt(i++)) > 255 ||
	            (c1 = bin.charCodeAt(i++)) > 255 ||
	            (c2 = bin.charCodeAt(i++)) > 255)
	            throw new TypeError('invalid character found');
	        u32 = (c0 << 16) | (c1 << 8) | c2;
	        asc += b64chs[u32 >> 18 & 63]
	            + b64chs[u32 >> 12 & 63]
	            + b64chs[u32 >> 6 & 63]
	            + b64chs[u32 & 63];
	    }
	    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
	};
	/**
	 * does what `window.btoa` of web browsers do.
	 * @param {String} bin binary string
	 * @returns {string} Base64-encoded string
	 */
	const _btoa = typeof btoa === 'function' ? (bin) => btoa(bin)
	    : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
	        : btoaPolyfill;
	const _fromUint8Array = _hasBuffer
	    ? (u8a) => Buffer.from(u8a).toString('base64')
	    : (u8a) => {
	        // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
	        const maxargs = 0x1000;
	        let strs = [];
	        for (let i = 0, l = u8a.length; i < l; i += maxargs) {
	            strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
	        }
	        return _btoa(strs.join(''));
	    };
	/**
	 * converts a Uint8Array to a Base64 string.
	 * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
	 * @returns {string} Base64 string
	 */
	const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
	// This trick is found broken https://github.com/dankogai/js-base64/issues/130
	// const utob = (src: string) => unescape(encodeURIComponent(src));
	// reverting good old fationed regexp
	const cb_utob = (c) => {
	    if (c.length < 2) {
	        var cc = c.charCodeAt(0);
	        return cc < 0x80 ? c
	            : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
	                + _fromCC(0x80 | (cc & 0x3f)))
	                : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
	                    + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
	                    + _fromCC(0x80 | (cc & 0x3f)));
	    }
	    else {
	        var cc = 0x10000
	            + (c.charCodeAt(0) - 0xD800) * 0x400
	            + (c.charCodeAt(1) - 0xDC00);
	        return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
	            + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
	            + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
	            + _fromCC(0x80 | (cc & 0x3f)));
	    }
	};
	const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
	/**
	 * @deprecated should have been internal use only.
	 * @param {string} src UTF-8 string
	 * @returns {string} UTF-16 string
	 */
	const utob = (u) => u.replace(re_utob, cb_utob);
	//
	const _encode = _hasBuffer
	    ? (s) => Buffer.from(s, 'utf8').toString('base64')
	    : _TE
	        ? (s) => _fromUint8Array(_TE.encode(s))
	        : (s) => _btoa(utob(s));
	/**
	 * converts a UTF-8-encoded string to a Base64 string.
	 * @param {boolean} [urlsafe] if `true` make the result URL-safe
	 * @returns {string} Base64 string
	 */
	const encode = (src, urlsafe = false) => urlsafe
	    ? _mkUriSafe(_encode(src))
	    : _encode(src);
	/**
	 * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
	 * @returns {string} Base64 string
	 */
	const encodeURI = (src) => encode(src, true);
	// This trick is found broken https://github.com/dankogai/js-base64/issues/130
	// const btou = (src: string) => decodeURIComponent(escape(src));
	// reverting good old fationed regexp
	const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
	const cb_btou = (cccc) => {
	    switch (cccc.length) {
	        case 4:
	            var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
	                | ((0x3f & cccc.charCodeAt(1)) << 12)
	                | ((0x3f & cccc.charCodeAt(2)) << 6)
	                | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
	            return (_fromCC((offset >>> 10) + 0xD800)
	                + _fromCC((offset & 0x3FF) + 0xDC00));
	        case 3:
	            return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
	                | ((0x3f & cccc.charCodeAt(1)) << 6)
	                | (0x3f & cccc.charCodeAt(2)));
	        default:
	            return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
	                | (0x3f & cccc.charCodeAt(1)));
	    }
	};
	/**
	 * @deprecated should have been internal use only.
	 * @param {string} src UTF-16 string
	 * @returns {string} UTF-8 string
	 */
	const btou = (b) => b.replace(re_btou, cb_btou);
	/**
	 * polyfill version of `atob`
	 */
	const atobPolyfill = (asc) => {
	    // console.log('polyfilled');
	    asc = asc.replace(/\s+/g, '');
	    if (!b64re.test(asc))
	        throw new TypeError('malformed base64.');
	    asc += '=='.slice(2 - (asc.length & 3));
	    let u24, r1, r2;
	    let binArray = []; // use array to avoid minor gc in loop
	    for (let i = 0; i < asc.length;) {
	        u24 = b64tab[asc.charAt(i++)] << 18
	            | b64tab[asc.charAt(i++)] << 12
	            | (r1 = b64tab[asc.charAt(i++)]) << 6
	            | (r2 = b64tab[asc.charAt(i++)]);
	        if (r1 === 64) {
	            binArray.push(_fromCC(u24 >> 16 & 255));
	        }
	        else if (r2 === 64) {
	            binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255));
	        }
	        else {
	            binArray.push(_fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255));
	        }
	    }
	    return binArray.join('');
	};
	/**
	 * does what `window.atob` of web browsers do.
	 * @param {String} asc Base64-encoded string
	 * @returns {string} binary string
	 */
	const _atob = typeof atob === 'function' ? (asc) => atob(_tidyB64(asc))
	    : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
	        : atobPolyfill;
	//
	const _toUint8Array = _hasBuffer
	    ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
	    : (a) => _U8Afrom(_atob(a).split('').map(c => c.charCodeAt(0)));
	/**
	 * converts a Base64 string to a Uint8Array.
	 */
	const toUint8Array = (a) => _toUint8Array(_unURI(a));
	//
	const _decode = _hasBuffer
	    ? (a) => Buffer.from(a, 'base64').toString('utf8')
	    : _TD
	        ? (a) => _TD.decode(_toUint8Array(a))
	        : (a) => btou(_atob(a));
	const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
	/**
	 * converts a Base64 string to a UTF-8 string.
	 * @param {String} src Base64 string.  Both normal and URL-safe are supported
	 * @returns {string} UTF-8 string
	 */
	const decode = (src) => _decode(_unURI(src));
	/**
	 * check if a value is a valid Base64 string
	 * @param {String} src a value to check
	  */
	const isValid = (src) => {
	    if (typeof src !== 'string')
	        return false;
	    const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
	    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
	};
	//
	const _noEnum = (v) => {
	    return {
	        value: v, enumerable: false, writable: true, configurable: true
	    };
	};
	/**
	 * extend String.prototype with relevant methods
	 */
	const extendString = function () {
	    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
	    _add('fromBase64', function () { return decode(this); });
	    _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
	    _add('toBase64URI', function () { return encode(this, true); });
	    _add('toBase64URL', function () { return encode(this, true); });
	    _add('toUint8Array', function () { return toUint8Array(this); });
	};
	/**
	 * extend Uint8Array.prototype with relevant methods
	 */
	const extendUint8Array = function () {
	    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
	    _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
	    _add('toBase64URI', function () { return fromUint8Array(this, true); });
	    _add('toBase64URL', function () { return fromUint8Array(this, true); });
	};
	/**
	 * extend Builtin prototypes with relevant methods
	 */
	const extendBuiltins = () => {
	    extendString();
	    extendUint8Array();
	};
	const gBase64 = {
	    version: version$1,
	    VERSION: VERSION,
	    atob: _atob,
	    atobPolyfill: atobPolyfill,
	    btoa: _btoa,
	    btoaPolyfill: btoaPolyfill,
	    fromBase64: decode,
	    toBase64: encode,
	    encode: encode,
	    encodeURI: encodeURI,
	    encodeURL: encodeURI,
	    utob: utob,
	    btou: btou,
	    decode: decode,
	    isValid: isValid,
	    fromUint8Array: fromUint8Array,
	    toUint8Array: toUint8Array,
	    extendString: extendString,
	    extendUint8Array: extendUint8Array,
	    extendBuiltins: extendBuiltins
	};

	function e(e){this.message=e;}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw "Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e;}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";

	let bid = '';
	let jwt = '';
	const reset = () => {
	  let str = '0123456789abcdefghijklmnopqrstuvwxyz';
	  let text = '';
	  for (let i = 0; i < 33; i++) {
	    text += str[Math.floor(Math.random() * str.length)];
	  }
	  bid = x64hash128(text, 31);
	  jwt = '';
	  localStorage.setItem('blhxfy:bid', bid);
	  localStorage.setItem('blhxfy:caiyun-jwt', jwt);
	};
	function transform(e) {
	  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
	    i = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm",
	    a = n => t.indexOf(n),
	    o = n => a(n) > -1 ? i[a(n)] : n;
	  return e.split("").map(o).join("");
	}
	const checkJwt = () => {
	  try {
	    const {
	      exp
	    } = o(jwt);
	    if (exp * 1000 < Date.now()) {
	      jwt = '';
	    }
	  } catch (e) {}
	};
	try {
	  bid = localStorage.getItem('blhxfy:bid');
	  jwt = localStorage.getItem('blhxfy:caiyun-jwt');
	  checkJwt();
	} catch (e) {}
	if (!bid) {
	  reset();
	}
	const getAuth = async () => {
	  checkJwt();
	  if (jwt) return;
	  const res = await request$1('https://api.interpreter.caiyunai.com/v1/user/jwt/generate', {
	    method: 'POST',
	    headers: {
	      'X-Authorization': `token:${fetchInfo.data.cyweb_token}`,
	      'Content-Type': 'application/json',
	      'origin': 'https://fanyi.caiyunapp.com',
	      'referer': 'https://fanyi.caiyunapp.com/',
	      'Device-Id': bid
	    },
	    data: JSON.stringify({
	      browser_id: bid
	    })
	  });
	  if (!res.jwt) {
	    reset();
	  } else {
	    jwt = res.jwt;
	    localStorage.setItem('blhxfy:caiyun-jwt', jwt);
	  }
	};
	const translator = async (list, from = 'ja') => {
	  await getAuth();
	  if (!jwt) return [];
	  const res = await request$1('https://api.interpreter.caiyunai.com/v1/translator', {
	    cors: true,
	    method: 'POST',
	    headers: {
	      'X-Authorization': `token:${fetchInfo.data.cyweb_token}`,
	      'Content-Type': 'application/json',
	      'Device-Id': bid,
	      'T-Authorization': jwt
	    },
	    data: JSON.stringify({
	      cached: true,
	      os_type: 'web',
	      replaced: true,
	      request_id: 'web_fanyi',
	      source: list,
	      trans_type: `${from}2zh`,
	      style: 'formal',
	      media: 'text',
	      dict: true,
	      detect: true,
	      browser_id: bid
	    })
	  });
	  if (res && res.target) {
	    return res.target.map(str => gBase64.decode(transform(str)));
	  } else {
	    reset();
	  }
	  return [];
	};

	const joinBr = (list, br, transArr) => {
	  br.forEach(count => {
	    let i = count;
	    let str = '';
	    while (i >= 0 && list.length) {
	      i--;
	      let _str = list.shift();
	      str += _str + '\n';
	    }
	    if (str) {
	      transArr.push(str.slice(0, str.length - 1));
	    }
	  });
	};
	const trim$1 = str => {
	  if (!str) return '';
	  let _str = str.replace(/[\u0020]+$/g, '');
	  return _str.replace(/^[\u0020]+/g, '');
	};
	const fixWrap = str => {
	  return trim$1(str).replace(/\r/g, '\n').replace(/\n{2,}/g, '\n');
	};
	const joinText = list => {
	  let br = [];
	  let _list = list.map(text => removeHtmlTag(fixWrap(text)));
	  _list.forEach(text => {
	    let count = [...text].filter(l => l === '\n').length;
	    br.push(count);
	  });
	  let query = _list.join('\n');
	  return [query, br];
	};
	const splitText = (text, WORDS_LIMIT = 4000) => {
	  let strTemp = '';
	  let arr = [];
	  let count = 0;
	  text.split('\n').forEach(txt => {
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
	const caiyunTrans = async (source, from) => {
	  try {
	    let [query, br] = joinText(source);
	    let textArr = splitText(query);
	    let result = await Promise.all(textArr.map(query => {
	      return translator(query.split('\n'), from);
	    }));
	    let list = result.reduce((a, b) => a.concat(b));
	    let transArr = [];
	    joinBr(list, br, transArr);
	    return transArr;
	  } catch (e) {
	    console.info(e);
	    return [];
	  }
	};
	async function transApi (...args) {
	  if (config.transApi === 'caiyun') {
	    return caiyunTrans(...args);
	  }
	}

	const insertCSS$1 = fontValue => {
	  let font = '';
	  if (fontValue && fontValue !== 'none') font = `${fontValue}, `;
	  const style = document.createElement('style');
	  style.innerHTML = `.prt-scene-comment :not(.blhxfy-origin-text), .prt-pop-synopsis, .prt-log-display, .btn-select-baloon {
    font-family: ${font}${Game.ua.os.name === 'Windows' ? 'blhxwf, ' : ''}nickname_scene, "FOT-ニューシネマA Std D", "Average Sans", sans-serif !important;
  }`;
	  document.head.appendChild(style);
	};
	const setBold = () => {
	  const style = document.createElement('style');
	  style.innerHTML = `.prt-scene-comment, .prt-log-display, .btn-select-baloon {
    font-weight: bold;
  }`;
	  document.head.appendChild(style);
	};
	const scenarioFont = () => {
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

	const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt', 'sel5_txt', 'sel6_txt'];
	const scenarioCache = {
	  data: null,
	  name: '',
	  originName: '',
	  hasTrans: false,
	  hasAutoTrans: false,
	  csv: '',
	  nameMap: null,
	  transMap: null
	};
	const collectTxt = data => {
	  const txtList = [];
	  const infoList = [];
	  const getTxt = (obj, key, index) => {
	    const txt = obj[key];
	    if (txt) {
	      txtList.push(txt.replace(/\n/g, '').trim());
	      infoList.push({
	        id: obj.id,
	        type: key,
	        index
	      });
	    }
	  };
	  data.forEach((item, index) => {
	    txtKeys.forEach(key => getTxt(item, key, index));
	  });
	  return {
	    txtList,
	    infoList
	  };
	};
	const getStartIndex = data => {
	  const findStart = (item, index) => {
	    if (!item) return false;
	    if (item.detail) {
	      return index;
	    } else if (item.next) {
	      const next = item.next | 0 || -1;
	      return findStart(data[next], next);
	    } else {
	      return findStart(data[index + 1], index + 1);
	    }
	  };
	  return findStart(data[0], 0);
	};
	const transMulti = async (list, nameMap, nounMap, nounFixMap, caiyunPrefixMap) => {
	  const userName = config.userName;
	  const lang = Game.lang;
	  const _list = list.map(txt => {
	    txt = replaceWords(txt, caiyunPrefixMap, lang);
	    if (userName) {
	      let _lang = lang;
	      if (!/^\w+$/.test(userName)) _lang = 'unknown';
	      if (lang === 'en') {
	        txt = replaceWords(txt, new Map([[userName, config.defaultEnName]]), _lang);
	      }
	    }
	    return txt;
	  });
	  const transList = await transApi(_list, lang);
	  if (transList[0] === 'caiyunoutoflimit') return ['机翻失败，请刷新重试'];
	  const fixedList = transList.map(txt => {
	    let _str = txt;
	    if (_str) {
	      _str = _str.replace(/\n/g, '<br>');
	      _str = replaceWords(_str, nounFixMap, lang);
	      if (config.displayName || userName) {
	        const name = config.displayName || userName;
	        if (lang === 'en') {
	          _str = _str.replace(new RegExp(`${config.defaultEnName}`, 'g'), name);
	        }
	        _str = _str.replace(new RegExp(`${config.defaultName}(先生|小姐)?`, 'g'), name);
	      }
	    }
	    return _str;
	  });
	  return fixedList;
	};
	const getScenario = async name => {
	  let csv = getPreviewCsv(name);
	  let isLLMTrans = false;
	  if (!csv) {
	    const [text, isAI] = await getStoryCSV(name);
	    if (!text) {
	      return {
	        transMap: null,
	        csv: ''
	      };
	    }
	    csv = text;
	    isLLMTrans = isAI;
	  }
	  const list = parseCsv(csv);
	  const transMap = new Map();
	  list.forEach(item => {
	    if (item.id) {
	      const idArr = item.id.split('-');
	      const id = idArr[0];
	      const type = idArr[1] || 'detail';
	      const obj = transMap.get(id) || {};
	      if (item.trans) {
	        const rep = new RegExp(config.defaultName, 'g');
	        const uname = config.displayName || config.userName;
	        const str = filter(item.trans.replace(rep, uname));
	        obj[type] = str.replace(/<span\sclass="nickname"><\/span>/g, `<span class='nickname'></span>`);
	      }
	      obj[`${type}-origin`] = item.trans;
	      transMap.set(id, obj);
	    }
	  });
	  return {
	    transMap,
	    csv,
	    isLLMTrans
	  };
	};
	const collectNameHtml = str => {
	  if (!str) return str;
	  let name = str;
	  let html = '';
	  const rgs = name.match(/<[^>]+>([^<]*)<\/[^>]+>/);
	  if (rgs && rgs[1]) {
	    name = rgs[1];
	    html = str.replace(name, '$name');
	  }
	  return {
	    name,
	    html
	  };
	};
	const replaceChar = (key, item, map) => {
	  const nameStr = item[key] ? item[key].trim() : '';
	  const {
	    name,
	    html
	  } = collectNameHtml(nameStr);
	  let trans;
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
	const getUsernameFromTutorial = data => {
	  for (let item of data) {
	    let id = parseInt(item.id);
	    if (id === 25 || id === 24) {
	      if (item.charcter1_name) {
	        config.userName = item.charcter1_name;
	        localStorage.setItem('blhxfy:name', config.userName);
	      }
	    }
	  }
	};
	const transStart = async (data, pathname) => {
	  const pathRst = pathname.match(/\/[^/]*?scenario.*?\/(scene[^\/]+)\/?/);
	  if (!pathRst || !pathRst[1]) return data;
	  let sNameTemp = pathRst[1];
	  if (pathRst[1].includes('birthday') || pathname.includes('season_event')) {
	    let rst = pathname.match(/\/[^/]*?scenario.*?\/(scene.+)$/);
	    if (!rst || !rst[1]) return data;
	    sNameTemp = rst[1].replace(/\//g, '_');
	  }
	  if (pathname.includes('scene_tutorial02')) {
	    getUsernameFromTutorial(data);
	  }
	  insertToolHtml();
	  autoDownloadCsv();
	  const startIndex = getStartIndex(data);
	  const scenarioName = sNameTemp;
	  scenarioCache.data = deepClone(data);
	  scenarioCache.name = scenarioName;
	  scenarioCache.hasTrans = false;
	  scenarioCache.hasAutoTrans = false;
	  scenarioCache.transMap = null;
	  let {
	    transMap,
	    csv,
	    isLLMTrans
	  } = await getScenario(scenarioName);
	  if (transMap && transMap.has('filename')) {
	    scenarioCache.originName = transMap.get('filename').detail;
	  }
	  const nameData = await getNameData();
	  const nameMap = Game.lang !== 'ja' ? nameData['enNameMap'] : nameData['jpNameMap'];
	  scenarioCache.nameMap = nameMap;
	  if (!transMap) {
	    if (config.transJa && Game.lang === 'ja' || config.transEn && Game.lang === 'en') {
	      const {
	        nounMap,
	        nounFixMap,
	        caiyunPrefixMap
	      } = await getNounData();
	      transMap = new Map();
	      const {
	        txtList,
	        infoList
	      } = collectTxt(data);
	      const transList = await transMulti(txtList, nameMap, nounMap, nounFixMap, caiyunPrefixMap);
	      let transNotice = false;
	      const transApiName = {
	        caiyun: ['彩云小译', 'https://fanyi.caiyunapp.com/']
	      };
	      const apiData = transApiName[config.transApi];
	      infoList.forEach((info, index) => {
	        const obj = transMap.get(info.id) || {};
	        obj[info.type] = transList[index] || '';
	        if (!transNotice && info.index === startIndex && info.type === 'detail' && transList.length > 0) {
	          if (transList[0] === 'caiyunoutoflimit') ; else {
	            obj[info.type] = `<a href="${apiData[1]}" target="_blank" class="autotrans-hint-blhxfy ${config.transApi}-blhxfy"> </a>${obj[info.type]}`;
	          }
	          transNotice = true;
	        }
	        transMap.set(info.id, obj);
	      });
	      if (transList.length > 0) {
	        scenarioCache.hasAutoTrans = true;
	        scenarioCache.transMap = transMap;
	      }
	    } else {
	      return data;
	    }
	  } else {
	    scenarioCache.hasTrans = true;
	    scenarioCache.csv = csv;
	    scenarioCache.transMap = transMap;
	  }
	  if (scenarioCache.hasAutoTrans || scenarioCache.hasTrans) {
	    scenarioFont();
	  }
	  data.forEach((item, index) => {
	    replaceChar('charcter1_name', item, nameMap);
	    replaceChar('charcter2_name', item, nameMap);
	    replaceChar('charcter3_name', item, nameMap);
	    const obj = transMap.get(item.id);
	    if (!obj) return;
	    txtKeys.forEach(key => {
	      if (obj[key]) {
	        if (key === 'detail' && config.originText) {
	          item[key] = `${restoreHtml(obj[key], item[key])}
          <div class="blhxfy-origin-text" data-text='${removeHtmlTag(item[key], 0, true)}'> </div>`;
	        } else {
	          item[key] = restoreHtml(obj[key], item[key]);
	        }
	        if (scenarioCache.hasTrans && config.showTranslator && key === 'detail' && index === startIndex) {
	          let name = '我们仍未知道翻译这篇剧情的骑空士的名字';
	          if (transMap.has('translator')) {
	            name = transMap.get('translator').detail || name;
	          }
	          const translatorHint = isLLMTrans ? `本节使用 ${name} 机翻` : `译者：${name}`;
	          item[key] = `<a class="autotrans-hint-blhxfy translator-blhxfy" data-text="${translatorHint}"> </a>${item[key]}`;
	        }
	      }
	    });
	  });
	  return data;
	};

	// ↓ gemini
	/**
	 * 根据给定的路径列表，安全地从对象中获取嵌套属性值。
	 * @param {object} obj - 要访问的对象。
	 * @param {string[]} path - 描述属性路径的字符串数组，例如 ['scenario', 'scene_list']。
	 * @returns {*} 找到的属性值，如果路径无效则返回 undefined。
	 */
	const getValueByPath = (obj, path) => {
	  // 使用 reduce 方法沿着路径逐层深入对象
	  return path.reduce((currentObject, key) => {
	    // 如果当前对象有效且包含下一个键，则继续深入，否则返回 undefined
	    return currentObject && currentObject[key] !== undefined ? currentObject[key] : undefined;
	  }, obj);
	};

	/**
	 * 以不可变的方式，根据路径设置对象中的嵌套属性值。
	 * 这意味着它会返回一个新对象，而不是修改原始对象。
	 * @param {object} obj - 要更新的对象。
	 * @param {string[]} path - 描述属性路径的字符串数组。
	 * @param {*} value - 要设置的新值。
	 * @returns {object} 一个新的、更新了值的对象。
	 */
	const setValueByPath = (obj, path, value) => {
	  // 创建一个对象的浅拷贝，避免直接修改原始对象
	  const newObj = {
	    ...obj
	  };

	  // lastKey 指向路径的最后一个键，例如 'scene_list'
	  const lastKey = path[path.length - 1];
	  // parentPath 指向除最后一个键之外的路径，例如 ['scenario']
	  const parentPath = path.slice(0, -1);

	  // 逐层深入到目标属性的父对象
	  let currentLevel = newObj;
	  parentPath.forEach(key => {
	    // 为了保证不可变性，路径上的每个对象也需要被拷贝
	    // 如果当前层级的对象不存在或不是对象，就创建一个新对象
	    currentLevel[key] = currentLevel[key] && typeof currentLevel[key] === 'object' ? {
	      ...currentLevel[key]
	    } : {};
	    currentLevel = currentLevel[key];
	  });

	  // 在父对象上设置新值
	  currentLevel[lastKey] = value;
	  return newObj;
	};

	/**
	 * 递归处理数据对象，查找并转换指定路径下的数组。
	 * @param {object} data - 原始数据对象。
	 * @param {string[][]} keyPaths - 一个包含多个路径的数组，每个路径本身也是一个键的数组。
	 * @param {any} pathname - 传递给 transStart 的参数。
	 * @returns {Promise<object>} 返回处理后的数据对象。
	 */
	async function processDataByPaths(data, keyPaths, pathname) {
	  // 遍历所有预设的可能路径
	  for (const path of keyPaths) {
	    // 根据当前路径获取目标值
	    const targetArray = getValueByPath(data, path);

	    // 检查获取到的值是否为数组
	    if (Array.isArray(targetArray)) {
	      // 如果是数组，使用 transStart 函数进行处理
	      const processedArray = await transStart(targetArray, pathname);
	      // 将处理后的数组放回原有的嵌套结构中，并返回一个新的对象
	      return setValueByPath(data, path, processedArray);
	    }
	  }

	  // 如果遍历完所有路径都没有找到数组，则返回原始数据
	  return data;
	}

	/**
	 * 主处理函数，根据不同的数据结构，对其中的数组部分进行转换。
	 * @param {object|Array} data - 输入的数据，可能是一个数组，或包含数组的复杂对象。
	 * @param {any} pathname - 传递给 transStart 的参数。
	 * @returns {Promise<object|Array>} 返回转换后的数据。
	 */
	async function transScenario (data, pathname) {
	  // 1. 定义所有需要检查的嵌套路径
	  // 如果将来有新的路径，只需在这里添加即可
	  const keyPaths = [['scene_list'],
	  // 对应 data.scene_list
	  ['scenario'],
	  // 对应 data.scenario
	  ['scenario', 'scene_list'] // 对应 data.scenario.scene_list
	  ];

	  // 2. 首先处理最简单的情况：data 本身就是一个数组
	  if (Array.isArray(data)) {
	    return await transStart(data, pathname);
	  }

	  // 3. 如果 data 是一个对象，则调用辅助函数来处理定义的各个路径
	  if (data && typeof data === 'object') {
	    return await processDataByPaths(data, keyPaths, pathname);
	  }

	  // 4. 如果 data 不是数组也不是对象，直接返回
	  return data;
	}

	let data = null;
	const getLocalData = async type => {
	  // if (DEV) return false
	  if (!data) {
	    try {
	      const str = sessionStorage.getItem('blhxfy:data');
	      if (!str) return false;
	      data = JSON.parse(str);
	    } catch (err) {
	      console.error(err);
	    }
	  }
	  let key = type;
	  if (!/(\.csv|\.json)/.test(type)) {
	    key = `${type}.csv`;
	  }
	  const hash = await getHash();
	  const newHash = hash[key];
	  const savedHash = data.hash[key];
	  if (savedHash && savedHash === newHash) {
	    return data[type];
	  } else {
	    data.hash[key] = newHash;
	    return false;
	  }
	};
	const setLocalData = (type, value) => {
	  // if (DEV) return false
	  if (!data || isString_1(data.hash)) data = {
	    hash: config.hash
	  };
	  let key = type;
	  if (!/(\.csv|\.json)/.test(type)) {
	    key = `${type}.csv`;
	  }
	  const newHash = config.hash[key];
	  if (newHash) {
	    data.hash[key] = newHash;
	  }
	  data[type] = value;
	  const str = JSON.stringify(data);
	  try {
	    sessionStorage.setItem('blhxfy:data', str);
	  } catch (err) {
	    console.error(err);
	  }
	};

	const phraseMap = new Map();
	let loaded$2 = false;
	const getPhrase = async () => {
	  if (!loaded$2) {
	    let csv = await getLocalData('phrase');
	    if (!csv) {
	      csv = await fetchWithHash('/blhxfy/data/phrase.csv');
	      setLocalData('phrase', csv);
	    }
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const text = item.text;
	      const trans = filter(item.trans, true);
	      if (trim(text) && trans) {
	        phraseMap.set(text, trans);
	      }
	    });
	    loaded$2 = true;
	  }
	  return phraseMap;
	};

	const transPhrase = (data, key, map) => {
	  if (!data || !data[key]) return;
	  let text = data[key];
	  if (map.has(text)) {
	    data[key] = map.get(text);
	  }
	};
	const shopLabel = async data => {
	  if (data && data.labels && data.labels.length) {
	    const phraseMap = await getPhrase();
	    data.labels.forEach(item => {
	      transPhrase(item, 'name', phraseMap);
	      if (item.contents && item.contents.length) {
	        item.contents.forEach(cont => {
	          transPhrase(cont, 'name', phraseMap);
	        });
	      }
	    });
	  }
	};
	async function transLangMsg(data) {
	  if (!data.option || !data.option.langMsg) return data;
	  const msgs = data.option.langMsg;
	  const phraseMap = await getPhrase();
	  for (let key of Object.keys(msgs)) {
	    let text = msgs[key].msg;
	    if (text && phraseMap.has(text)) {
	      msgs[key].msg = phraseMap.get(text);
	    }
	  }
	  return data;
	}

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

	/** Used to match a single whitespace character. */
	var reWhitespace = /\s/;

	/**
	 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
	 * character of `string`.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {number} Returns the index of the last non-whitespace character.
	 */
	function trimmedEndIndex(string) {
	  var index = string.length;

	  while (index-- && reWhitespace.test(string.charAt(index))) {}
	  return index;
	}

	var _trimmedEndIndex = trimmedEndIndex;

	/** Used to match leading whitespace. */
	var reTrimStart = /^\s+/;

	/**
	 * The base implementation of `_.trim`.
	 *
	 * @private
	 * @param {string} string The string to trim.
	 * @returns {string} Returns the trimmed string.
	 */
	function baseTrim(string) {
	  return string
	    ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '')
	    : string;
	}

	var _baseTrim = baseTrim;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

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
	    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
	}

	var isSymbol_1 = isSymbol;

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

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
	  value = _baseTrim(value);
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

	const skillMap = new Map();
	const skillKeys = [['special_skill', 'special'], ['power_up_special_skill', 'special'], ['ability', 'skill-1'], ['ability', 'skill-2'], ['ability', 'skill-3'], ['ability', 'skill-4'], ['support_ability', 'support-1'], ['support_ability', 'support-2'], ['support_ability', 'support-3'], ['support_ability_of_npczenith', 'skill-lb'], ['support_ability_of_npczenith', 'skill-lb2'], ['appear_ability', 'skill-main'], ['backmember_ability', 'skill-sub']];
	const state = {
	  status: 'init',
	  cStatus: 'init',
	  locSkMap: false,
	  locASMap: false,
	  skillMap,
	  skillKeys,
	  skillData: null,
	  commSkillMap: new Map(),
	  autoTransCache: new Map(),
	  nounMap: new Map(),
	  nounRE: '',
	  failed: new Set()
	};
	const getCommSkillMap = async () => {
	  if (state.cStatus === 'loaded') return;
	  let csvData = await getLocalData('common-skill');
	  if (!csvData) {
	    csvData = await fetchWithHash('/blhxfy/data/common-skill.csv');
	    setLocalData('common-skill', csvData);
	  }
	  const list = await parseCsv(csvData);
	  const sortedList = sortKeywords(list, 'comment');
	  let nounArr = [];
	  sortedList.forEach(item => {
	    if (item.comment && item.trans && item.type) {
	      const comment = trim(item.comment);
	      const trans = filter(item.trans);
	      const type = trim(item.type) || '1';
	      if (comment && trans) {
	        if (type === '4') {
	          state.nounMap.set(comment, trans);
	          nounArr.push(comment);
	        } else {
	          state.commSkillMap.set(comment, {
	            trans,
	            type
	          });
	        }
	      }
	    }
	  });
	  if (nounArr.length) state.nounRE = `(${nounArr.join('|')})`;
	  state.cStatus = 'loaded';
	};
	const saveSkillMap = async skillMap => {
	  const arr = [...skillMap].slice(-20);
	  setLocalData('skill-npc', JSON.stringify(arr));
	};
	const getSkillMap = async () => {
	  const str = await getLocalData('skill-npc');
	  try {
	    const arr = JSON.parse(str);
	    state.skillMap = new Map(arr);
	    for (let [key, item] of state.skillMap) {
	      for (let _key in item) {
	        item[_key].name = filter(item[_key].name);
	        item[_key].detail = filter(item[_key].detail);
	      }
	    }
	    state.locSkMap = true;
	  } catch (e) {}
	};
	const saveAutoTrans = debounce_1(() => {
	  const arr = [...state.autoTransCache].slice(-200);
	  setLocalData('auto-trans', JSON.stringify(arr));
	}, 500);
	const getAutoTrans = async () => {
	  const str = await getLocalData('auto-trans');
	  try {
	    const arr = JSON.parse(str);
	    state.autoTransCache = new Map(arr);
	    for (let [key, item] of state.autoTransCache) {
	      state.autoTransCache.set(key, filter(item));
	    }
	    state.locASMap = true;
	  } catch (e) {}
	};
	const setSkillMap = (list, stable = true) => {
	  let npcId,
	    active,
	    idArr = [];
	  for (let row of list) {
	    if (row.id === 'npc') {
	      idArr = row.detail.split('|');
	    } else if (row.id === 'active') {
	      if (row.name !== '0') {
	        active = true;
	      }
	    }
	  }
	  if (!idArr.length || !idArr[0]) return;
	  npcId = idArr[1] || idArr[0];
	  const skillData = {};
	  for (let row of list) {
	    if (stable || active) {
	      if (/.+\[lv\d+\]/.test(row.id)) {
	        let rgs = row.id.match(/(.+)\[lv(\d+)\]/);
	        let key = rgs[1];
	        let level = parseInt(rgs[2]);
	        let list = skillData[key + '-lv'] || [];
	        if (!skillData[key + '-lv']) skillData[key + '-lv'] = list;
	        list.push({
	          level,
	          data: row
	        });
	        list.sort((m, n) => m.level - n.level);
	      } else {
	        skillData[row.id] = row;
	      }
	    }
	  }
	  state.skillMap.set(npcId, skillData);
	  saveSkillMap(state.skillMap);
	};
	const getSkillData = async npcId => {
	  if (!state.locSkMap) await getSkillMap();
	  if (!state.locASMap) await getAutoTrans();
	  if (state.skillMap.has(npcId)) return state;
	  state.skillData = await getLocalData('skill.json');
	  if (!state.skillData || !isObject_1(state.skillData)) {
	    state.skillData = await fetchWithHash('/blhxfy/data/skill.json');
	    setLocalData('skill.json', state.skillData);
	  }
	  const csvName = state.skillData[npcId];
	  if (csvName && !state.failed.has(csvName)) {
	    let csvData = '';
	    try {
	      csvData = await fetchWithHash(`/blhxfy/data/skill/${csvName}`);
	      const list = parseCsv(filter(csvData));
	      setSkillMap(list);
	    } catch (e) {
	      state.failed.add(csvName);
	      console.info(e);
	    }
	  }
	  return state;
	};
	const getLocalSkillData = npcId => {
	  const str = sessionStorage.getItem('blhxfy:skill-preview');
	  if (str) {
	    try {
	      const data = JSON.parse(str);
	      if (data.id === npcId) {
	        const csv = filter(data.csv);
	        const list = parseCsv(csv);
	        list.forEach(item => {
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

	const buffMap = {
	  buff: new Map(),
	  debuff: new Map()
	};
	let loaded$3 = false;
	const getData = async type => {
	  let csv = await getLocalData(type);
	  if (!csv) {
	    csv = await fetchWithHash(`/blhxfy/data/${type}.csv`);
	    setLocalData(type, csv);
	  }
	  const list = parseCsv(csv);
	  list.forEach(item => {
	    const detail = trim(item.detail);
	    const trans = filter(item.trans);
	    if (detail && trans) {
	      buffMap[type].set(detail, trans);
	    }
	  });
	};
	const getBuffData = async type => {
	  if (!loaded$3) {
	    await getData('buff');
	    await getData('debuff');
	    loaded$3 = true;
	  }
	  return buffMap[type];
	};

	const transBuff = async obj => {
	  if (!obj) return;
	  let data = obj;
	  if (obj.condition) {
	    data = obj.condition;
	  }
	  const keys = ['buff', 'debuff'];
	  for (let key of keys) {
	    if (data[key]) {
	      const buffMap = await getBuffData(key);
	      for (let k in data[key]) {
	        const item = data[key][k];
	        if (item.detail && buffMap.has(item.detail)) {
	          item.detail = buffMap.get(item.detail);
	        }
	        if (item.effect) item.effect = replaceTurn(item.effect);
	      }
	    }
	  }
	};

	const elemtRE = '([光闇水火風土無全]|light|dark|water|wind|earth|fire|plain|all)';
	const elemtMap = {
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
	const numRE = '(\\d{1,10}\\.?\\d{0,4}?)';
	const percentRE = '(\\d{1,10}\\.?\\d{0,4}?[%％])';
	const parseRegExp = (str, nounRE) => {
	  return str.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\$elemt/g, elemtRE).replace(/\$num/g, numRE).replace(/\$percent/g, percentRE).replace(/\$noun/g, nounRE);
	};
	const transSkill = (comment, {
	  commSkillMap,
	  nounMap,
	  nounRE,
	  autoTransCache
	}) => {
	  if (autoTransCache.has(comment)) return autoTransCache.get(comment);
	  let result = comment;
	  if (!result) return comment;
	  for (let [key, value] of commSkillMap) {
	    if (!trim(key)) continue;
	    const {
	      trans,
	      type
	    } = value;
	    if (type === '1') {
	      const re = new RegExp(parseRegExp(key, nounRE), 'gi');
	      result = result.replace(re, (...arr) => {
	        let _trans = trans;
	        for (let i = 1; i < arr.length - 2; i++) {
	          let eleKey = arr[i].toLowerCase();
	          if (elemtMap[eleKey]) {
	            _trans = _trans.replace(`$${i}`, elemtMap[eleKey]);
	          } else if (nounMap.has(eleKey)) {
	            _trans = _trans.replace(`$${i}`, nounMap.get(eleKey));
	          } else {
	            _trans = _trans.replace(`$${i}`, arr[i]);
	          }
	        }
	        return _trans;
	      });
	    } else if (type === '2') {
	      let res,
	        i = 0;
	      while (res !== result && i < 10) {
	        res = result;
	        result = result.replace(key, trans);
	        i++;
	      }
	    } else if (type === '3') {
	      result = result.replace(`(${key})`, `(${trans})`);
	    }
	  }
	  autoTransCache.set(comment, result);
	  saveAutoTrans();
	  return result;
	};
	const previewSkill = npcId => {
	  jQuery('#cnt-detail').off('click.blhxfy').on('click.blhxfy', '.prt-evolution-star>div:eq(1)', function () {
	    const csv = window.prompt('粘贴要预览的技能翻译CSV文本');
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
	const repalceSkillText = function (ability, key1, key2, skillData, translated, changed) {
	  if (ability.recast_comment) {
	    ability.recast_comment = replaceTurn(ability.recast_comment);
	  }
	  if (ability.recast_additional_comment) {
	    ability.recast_additional_comment.replace('リンクアビリティで連動', 'Link技能');
	  }
	  const abilityName = changed === 'ex' ? 'ex-' + ability.name : ability.name;
	  const [plus1, plus2, name] = getPlusStr(abilityName);
	  let trans = skillData[`skill-${abilityName}`] || skillData[`skill-${name}`];
	  if (!trans) {
	    trans = skillData[`special-${abilityName}`] || skillData[`special-${name}`];
	    if (!trans) {
	      let list = skillData[key2 + '-lv'];
	      list && list.forEach(item => {
	        if (level >= item.level) {
	          trans = item.data;
	        }
	      });
	      if (!trans) {
	        trans = skillData[key2 + plus2];
	        if (!trans && !changed) {
	          trans = skillData[key2];
	        }
	      }
	    }
	  }
	  if (!trans) return;
	  if (trans.name) {
	    ability.name = trans.name + plus1;
	  }
	  if (trans.detail) {
	    const detail = trans.detail;
	    const rep = new RegExp(config.defaultName, 'g');
	    const uname = config.displayName || config.userName;
	    const text = filter(detail.replace(rep, uname));
	    ability.comment = text;
	    translated.set(key1, true);
	  }
	};
	const parseSkill = async (data, pathname) => {
	  if (Game.lang === 'en') return data;
	  let npcId;
	  let level;
	  if (pathname.includes('/npc/npc/')) {
	    if (!data.master || !data.master.id) return data;
	    npcId = `${data.master.id}`;
	    level = data.param.level;
	  } else if (pathname.includes('/archive/npc_detail')) {
	    if (!data.id) return data;
	    npcId = data.id;
	    level = data.max_level;
	  }
	  previewSkill(npcId);
	  let skillState = getLocalSkillData(npcId);
	  if (!skillState) {
	    skillState = await getSkillData(npcId);
	  }
	  const skillData = skillState.skillMap.get(npcId);
	  const translated = new Map();
	  const keys = skillState.skillKeys;
	  let lbCount = 0;
	  for (let item of keys) {
	    const key1 = item[0];
	    const key2 = item[1];
	    let ability = data[key1];
	    if (!ability || Array.isArray(ability) && !ability.length) {
	      if (!data.ability) continue;
	      ability = data.ability[key1];
	      if (!ability || Array.isArray(ability) && !ability.length) continue;
	    }
	    if (key1 === 'support_ability_of_npczenith' && !Array.isArray(ability)) {
	      let lbLoopCount = 0;
	      let abTemp = ability;
	      for (let _k in ability) {
	        if (lbCount <= lbLoopCount) {
	          ability = ability[_k];
	          lbCount++;
	          break;
	        }
	        lbLoopCount++;
	      }
	      if (abTemp === ability) {
	        continue;
	      }
	    }
	    if (key2 !== 'special' && !key2.startsWith('skill-lb')) {
	      const matched = key2.match(/(\d)$/);
	      const order = matched ? matched[1] : '1';
	      ability = ability[order];
	      if (!ability) {
	        continue;
	      }
	    }
	    await transBuff(ability.ability_detail);
	    if (!skillData) continue;
	    const extraSkillKeys = ['display_action_ability_info', 'form_change_display_action_ability_info', 'select_display_action_ability_info'];
	    for (let extraKey of extraSkillKeys) {
	      if (ability[extraKey] && ability[extraKey].action_ability) {
	        const changedSkills = ability[extraKey].action_ability;
	        for (let item of changedSkills) {
	          await transBuff(item.ability_detail);
	          if (item.action_id !== ability.action_id) {
	            if (item.name === ability.name) {
	              // 因为切换后的技能名跟原技能名相同，所以必须给技能名加上 ex 标识来区分
	              repalceSkillText(item, key1, key2, skillData, translated, 'ex');
	            } else {
	              repalceSkillText(item, key1, key2, skillData, translated, 'changed');
	            }
	          } else {
	            repalceSkillText(item, key1, key2, skillData, translated);
	          }
	        }
	      }
	    }
	    repalceSkillText(ability, key1, key2, skillData, translated);
	  }
	  if (skillData) {
	    if (data.master) {
	      const trans = skillData['npc'];
	      if (trans && trans.name) {
	        data.master.name = trans.name;
	        if (data.master.short_name === data.master.name) {
	          data.master.short_name = trans.name;
	        }
	        const intro = skillData['intro'];
	        if (intro && intro.name) data.master.evo_name = `[${intro.name}]${trans.name}`;
	      }
	    } else if (data.name) {
	      const trans = skillData['npc'];
	      if (trans && trans.name) {
	        data.name = trans.name;
	        const intro = skillData['intro'];
	        if (intro && intro.name) data.evo_name = `[${intro.name}]${trans.name}`;
	      }
	    }
	    if (data.comment) {
	      const trans = skillData['intro'];
	      if (trans && trans.detail) data.comment = trans.detail;
	    }
	  }
	  await getCommSkillMap();
	  keys.forEach(item => {
	    if (!translated.get(item[0])) {
	      const skill = data[item[0]];
	      if (skill) {
	        skill.comment = transSkill(skill.comment, skillState);
	      }
	    }
	  });
	  return data;
	};

	const skillMap$1 = new Map();
	let loaded$4 = false;
	const getSkillData$1 = async id => {
	  if (!loaded$4) {
	    let csv = await getLocalData('job-skill');
	    if (!csv) {
	      csv = await fetchWithHash('/blhxfy/data/job-skill.csv');
	      setLocalData('job-skill', csv);
	    }
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      if (item && item.id) {
	        const _id = trim(item.id) | 0;
	        const _en = trim(item.en);
	        const _ja = trim(item.ja);
	        if (_id) {
	          const value = {
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
	  }
	  const trans = skillMap$1.get(id);
	  return trans;
	};

	const startTrans = async data => {
	  for (let key in data) {
	    if (data[key]) {
	      const trans = await getSkillData$1(data[key].action_id);
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
	      if (data[key].ability_detail) {
	        await transBuff(data[key].ability_detail);
	      }
	    }
	  }
	  return data;
	};
	const replaceSkill = async data => {
	  if (data.ability) {
	    data.ability = await startTrans(data.ability);
	  }
	  if (data.support_ability) {
	    data.support_ability = await startTrans(data.support_ability);
	  }
	  return data;
	};
	const transSkill$1 = async (data, pathname) => {
	  if (/\/party\/job_equipped\/\d+/.test(pathname)) {
	    if (data.job) {
	      data.job = await replaceSkill(data.job);
	    }
	  } else if (pathname.includes('/party_ability_subaction/')) {
	    if (data.list) {
	      data.list = await startTrans(data.list);
	    }
	  } else if (/\/party\/ability_list\/\d+\//.test(pathname)) {
	    data = await replaceSkill(data);
	  } else if (/\/party\/job_info\/\d+\//.test(pathname)) {
	    if (data.after_job_master) {
	      data.after_job_master = await replaceSkill(data.after_job_master);
	    }
	    if (data.before_job_info) {
	      data.before_job_info = await replaceSkill(data.before_job_info);
	    }
	  } else if (/\/zenith\/ability_list\/\d+/.test(pathname)) {
	    if (data.ability_list) {
	      data.list = await startTrans(data.ability_list);
	    }
	  }
	  return data;
	};

	const htmlMap = new Map();
	let loaded$5 = false;
	const getCommHtmlData = async () => {
	  if (!loaded$5) {
	    let csv = await getLocalData('common-html');
	    if (!csv) {
	      csv = await fetchWithHash('/blhxfy/data/common-html.csv');
	      setLocalData('common-html', csv);
	    }
	    const list = parseCsv(csv);
	    const tempMap = new Map();
	    sortKeywords(list, 'text').forEach((item, index) => {
	      const pathname = trim(item.path);
	      const text = trim(item.text);
	      const trans = filter(item.trans);
	      const times = item.count | 0 || 1;
	      if (pathname && text && trans) {
	        if (tempMap.has(pathname)) {
	          tempMap.get(pathname).push({
	            text,
	            trans,
	            times,
	            index
	          });
	        } else {
	          tempMap.set(pathname, [{
	            text,
	            trans,
	            times,
	            index
	          }]);
	        }
	      }
	    });
	    sortKeywords(Array.from(tempMap.keys())).forEach(key => {
	      htmlMap.set(key, tempMap.get(key));
	    });
	    loaded$5 = true;
	  }
	  return htmlMap;
	};

	const htmlMap$1 = new Map();
	let loaded$6 = false;
	const getArchiveData = async () => {
	  if (!loaded$6) {
	    const csv = await fetchWithHash('/blhxfy/data/archive.csv');
	    const list = parseCsv(csv);
	    sortKeywords(list, 'text').forEach(item => {
	      const text = trim(item.text);
	      const trans = filter(item.trans);
	      const times = item.count | 0 || 1;
	      if (text && trans) {
	        htmlMap$1.set(text, {
	          trans,
	          times
	        });
	      }
	    });
	    loaded$6 = true;
	  }
	  return htmlMap$1;
	};

	const replaceHTML = async (html, pathname) => {
	  let _html = html;
	  let theList = [];
	  const htmlMap = await getCommHtmlData();
	  for (let [key, list] of htmlMap.entries()) {
	    if (pathname.includes(key)) {
	      theList = theList.concat(list);
	    }
	  }
	  theList.sort((prev, next) => prev.index - next.index).forEach(item => {
	    for (let i = 0; i < item.times; i++) {
	      let newHtml = _html.replace(item.text, item.trans);
	      if (newHtml !== _html) {
	        _html = newHtml;
	      } else {
	        break;
	      }
	    }
	  });
	  return _html;
	};
	const replaceArchive = async html => {
	  let _html = html;
	  const htmlMap = await getArchiveData();
	  for (let [text, item] of htmlMap.entries()) {
	    for (let i = 0; i < item.times; i++) {
	      let newHtml = _html.replace(text, item.trans);
	      if (newHtml !== _html) {
	        _html = newHtml;
	      } else {
	        break;
	      }
	    }
	  }
	  return _html;
	};
	let settingHtml = false;
	const getHtml = async (encodedHtml, pathname) => {
	  let html = '';
	  try {
	    html = decodeURIComponent(encodedHtml);
	  } catch (err) {
	    return encodedHtml;
	  }
	  if (config.log) {
	    console.info({
	      [pathname]: html.trim()
	    });
	  }
	  try {
	    if (pathname.includes('/archive/content/library/')) {
	      html = await replaceArchive(html);
	    } else {
	      html = await replaceHTML(html, pathname);
	    }
	  } catch (err) {
	    console.error(err);
	  }
	  if (!settingHtml && pathname.includes('/setting/content/index/index')) {
	    html = insertSettingHtml(html);
	    settingHtml = true;
	  }
	  return encodeURIComponent(html);
	};
	async function transHTML(data, pathname) {
	  if (data.data) {
	    data.data = await getHtml(data.data, pathname);
	  }
	  if (data.option && data.option.progress) {
	    data.option.progress = await getHtml(data.option.progress, pathname);
	  }
	  if (data.option && data.option.quest) {
	    if (data.option.quest.content__index) {
	      data.option.quest.content__index = await getHtml(data.option.quest.content__index, pathname);
	    }
	    if (data.option.quest.content_list) {
	      data.option.quest.content_list = await getHtml(data.option.quest.content_list, pathname);
	    }
	  }
	  return data;
	}

	const townMap = new Map();
	let loaded$7 = false;
	const getTownData = async () => {
	  if (!loaded$7) {
	    let csv = await getLocalData('town-info');
	    if (!csv) {
	      csv = await fetchWithHash('/blhxfy/data/town-info.csv');
	      setLocalData('town-info', csv);
	    }
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const id = trim(item.id);
	      const name = filter(item.name);
	      const detail = filter(item.detail);
	      const vyrn = filter(item.vyrn);
	      if (id && name) {
	        townMap.set(id, {
	          name,
	          detail,
	          vyrn
	        });
	      }
	    });
	    loaded$7 = true;
	  }
	  return townMap;
	};

	async function transTownInfo(data, pathname) {
	  let town;
	  try {
	    town = data.option.mydata_assets.mydata.town;
	  } catch (err) {
	    return data;
	  }
	  const townMap = await getTownData();
	  if (townMap.has(town.location_id)) {
	    town.town_name = townMap.get(town.location_id).name;
	  }
	  for (let key in town.spot) {
	    let item = town.spot[key];
	    let id = `${town.location_id}-${item.id}`;
	    if (townMap.has(id)) {
	      let data = townMap.get(id);
	      item.location = data.name;
	      item.description = data.detail;
	      item.bee_comment = data.vyrn;
	    }
	  }
	  return data;
	}

	const islandMap = new Map();
	let loaded$8 = false;
	const getIslandData = async () => {
	  if (!loaded$8) {
	    const csv = await fetchWithHash('/blhxfy/data/island-info.csv');
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const id = trim(item.id);
	      const name = filter(item.name);
	      const detail = filter(item.detail);
	      if (id && name) {
	        islandMap.set(id, {
	          name,
	          detail
	        });
	        if (id === 'skydom') {
	          islandMap.set(name, detail);
	        }
	      }
	    });
	    loaded$8 = true;
	  }
	  return islandMap;
	};

	async function transIslandInfo(data, pathname) {
	  let island;
	  try {
	    island = data.island_info;
	  } catch (err) {
	    return data;
	  }
	  const islandMap = await getIslandData();
	  if (islandMap.has(island.island_name)) {
	    island.island_name = islandMap.get(island.island_name);
	  }
	  for (let key in island) {
	    let item = island[key];
	    let id = key;
	    if (islandMap.has(id)) {
	      if (id !== 'island_name') {
	        const data = islandMap.get(id);
	        item.name = data.name;
	        item.area_comment = data.detail;
	      }
	    }
	  }
	  return data;
	}

	const chatMap = new Map();
	const nChatMap = new Map();
	let loaded$9 = false;
	const getChatData = async () => {
	  if (!loaded$9) {
	    let csv = await getLocalData('chat-preset');
	    if (!csv) {
	      csv = await fetchWithHash('/blhxfy/data/chat-preset.csv');
	      setLocalData('chat-preset', csv);
	    }
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const id = trim(item.id);
	      const text = trim(item.text);
	      const trans = filter(item.trans);
	      if (id && trans) {
	        if (/\d+-n/.test(id)) {
	          const rgs = id.match(/(\d+)-n/);
	          const _id = rgs[1];
	          nChatMap.set(_id, {
	            text,
	            trans
	          });
	        } else {
	          chatMap.set(id, trans);
	        }
	      }
	    });
	    loaded$9 = true;
	  }
	  return {
	    chatMap,
	    nChatMap
	  };
	};

	async function transChat(data) {
	  if (!data.chat) return data;
	  const {
	    chatMap,
	    nChatMap
	  } = await getChatData();
	  for (let key in data.chat) {
	    let item = data.chat[key];
	    for (let ck in item) {
	      let id = item[ck].chat_id;
	      if (chatMap.has(id)) {
	        let hasSpecialTrans = false;
	        if (nChatMap.has(id)) {
	          const {
	            text,
	            trans
	          } = nChatMap.get(id);
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
	  return data;
	}

	const bossNameMap = new Map();
	let loaded$a = false;
	const getBossName = async () => {
	  if (!loaded$a) {
	    let csv = await getLocalData('battle/boss-name');
	    if (!csv) {
	      csv = await fetchWithHash('/blhxfy/data/battle/boss-name.csv');
	      let csvNpc = await fetchWithHash('/blhxfy/data/npc-name-jp.csv');
	      csv = csv.replace(/\r\n/g, '\n');
	      csv += csvNpc.replace(/\r\n/g, '\n').replace(/^name,trans/, '');
	      setLocalData('battle/boss-name', csv);
	    }
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const name = trim(item.name);
	      const trans = filter(item.trans);
	      if (name && trans) {
	        bossNameMap.set(name, trans);
	      }
	    });
	    loaded$a = true;
	  }
	  return bossNameMap;
	};

	const skillTemp = new Map();
	const posMap = new Map();
	let bossNameMap$1 = new Map();
	const collectNpcSkill = skillData => {
	  for (let key in skillData) {
	    if (/(skill|special)-\D.*/.test(key)) {
	      const rgs = key.match(/(skill|special)-(\D.*)/);
	      if (rgs && rgs[2] && !skillTemp.has(rgs[2])) {
	        skillTemp.set(rgs[2], skillData[key]);
	      }
	    }
	  }
	};
	const replaceMonsterName = (item, key) => {
	  const name = item[key].replace(/^Lvl?\s?[\d?]+\s+/, '');
	  if (bossNameMap$1.has(name)) {
	    const trans = bossNameMap$1.get(name);
	    item[key] = item[key].replace(name, trans);
	  }
	};
	const transBossName = async data => {
	  if (data && isArray_1(data.param)) {
	    data.param.forEach(item => {
	      replaceMonsterName(item, 'monster');
	      replaceMonsterName(item.name, 'en');
	      replaceMonsterName(item.name, 'ja');
	    });
	  }
	};
	const battle = async function battle(data, mode) {
	  if (!config.battleTrans) return data;
	  let ability;
	  let scenario;
	  let spms;
	  bossNameMap$1 = await getBossName();
	  if (mode === 'result') {
	    if (isObject_1(data.status)) {
	      ability = data.status.ability;
	      spms = data.status.skip_special_motion_setting;
	    }
	  } else {
	    ability = data.ability;
	    spms = data.skip_special_motion_setting;
	    data.temporary_potion_all_name = '群体回复药水';
	    data.temporary_potion_one_name = '治疗药水';
	    await transBossName(data.boss);
	  }
	  if (isArray_1(spms)) {
	    spms.forEach(item => {
	      posMap.set(item.pos, item.setting_id);
	    });
	  }
	  if (isObject_1(data.scenario)) scenario = data.scenario;
	  await getCommSkillMap();
	  // translate skill
	  if (isObject_1(ability)) {
	    for (let abKey in ability) {
	      let item = ability[abKey];
	      if (item && isObject_1(item.list)) {
	        if (item.mode === 'player') {
	          for (let key in item.list) {
	            let arr = item.list[key];
	            let skill = arr[0];
	            if (skill && skill['ability-name']) {
	              const name = skill['ability-name'];
	              const trans = await getSkillData$1(name);
	              if (trans) {
	                if (!skillTemp.has(name)) skillTemp.set(name, trans);
	                skill['ability-name'] = trans.name;
	                skill['text-data'] = trans.detail;
	              } else {
	                const tsDetail = await transSkill(skill['text-data'], state);
	                skill['text-data'] = tsDetail;
	                if (!skillTemp.has(name)) skillTemp.set(name, {
	                  name,
	                  detail: tsDetail
	                });
	              }
	              skill['duration-type'] = replaceTurn(skill['duration-type']);
	              if (skill['ability_detail']) {
	                await transBuff(skill['ability_detail']);
	              }
	            }
	          }
	        } else if (item.mode === 'npc') {
	          const npcId = posMap.get(item.pos);
	          const state = await getSkillData(npcId);
	          const skillData = state.skillMap.get(npcId);
	          if (skillData && isObject_1(item.list)) {
	            collectNpcSkill(skillData);
	            let index = 0;
	            for (let key in item.list) {
	              index++;
	              let arr = item.list[key];
	              let skill = arr[0];
	              if (skill && skill['ability-name']) {
	                const name = skill['ability-name'];
	                const [plus1, plus2, _name] = getPlusStr(name);
	                if (skillData[`skill-${_name}`]) {
	                  let trans = skillData[`skill-${_name}${plus2}`];
	                  if (!trans) trans = skillData[`skill-${_name}`];
	                  let tsName = name;
	                  let tsDetail = skill['text-data'];
	                  if (trans) {
	                    if (trans.name) tsName = trans.name + plus1;
	                    if (trans.detail) {
	                      const detail = trans.detail;
	                      const rep = new RegExp(config.defaultName, 'g');
	                      const uname = config.displayName || config.userName;
	                      const text = filter(detail.replace(rep, uname));
	                      tsDetail = text;
	                    }
	                  }
	                  if (tsDetail === skill['text-data']) {
	                    tsDetail = await transSkill(skill['text-data'], state);
	                    skill['text-data'] = tsDetail;
	                  }
	                  skill['ability-name'] = tsName;
	                  skill['text-data'] = tsDetail;
	                  skillTemp.set(name, {
	                    name: getPlusStr(tsName)[2],
	                    detail: tsDetail
	                  });
	                } else {
	                  let trans = skillData[`skill-${index}${plus2}`];
	                  if (!trans) trans = skillData[`skill-${index}`];
	                  let tsName = name;
	                  let tsDetail = skill['text-data'];
	                  if (trans) {
	                    if (trans.name) tsName = trans.name + plus1;
	                    if (trans.detail) tsDetail = trans.detail;
	                  }
	                  if (tsDetail === skill['text-data']) {
	                    tsDetail = await transSkill(skill['text-data'], state);
	                    skill['text-data'] = tsDetail;
	                  }
	                  skill['ability-name'] = tsName;
	                  skill['text-data'] = tsDetail;
	                  skillTemp.set(name, {
	                    name: getPlusStr(tsName)[2],
	                    detail: tsDetail
	                  });
	                }
	                skill['duration-type'] = replaceTurn(skill['duration-type']);
	              }
	            }
	          } else {
	            for (let key in item.list) {
	              let arr = item.list[key];
	              let skill = arr[0];
	              if (skill && skill['ability-name'] && skill['text-data']) {
	                const name = skill['ability-name'];
	                const detail = await transSkill(skill['text-data'], state);
	                skill['text-data'] = detail;
	                skillTemp.set(name, {
	                  name: getPlusStr(name)[2],
	                  detail
	                });
	              }
	            }
	          }
	        }
	      }
	    }
	  }
	  // translate speciall skill
	  if (mode !== 'result' && data.player && isArray_1(data.player.param)) {
	    const param = data.player.param;
	    let index = 0;
	    for (let item of param) {
	      const npcId = posMap.get(index);
	      index++;
	      const state = await getSkillData(npcId);
	      const skillData = state.skillMap.get(npcId);
	      if (skillData) {
	        collectNpcSkill(skillData);
	        if (item.name && skillData.npc && skillData.npc.name) {
	          item.name = skillData.npc.name;
	        }
	        if (item['special_skill']) {
	          const name = item['special_skill'];
	          const [plus1, plus2, _name] = getPlusStr(name);
	          if (skillData[`special-${_name}`]) {
	            let trans = skillData[`special-${_name}${plus2}`];
	            if (!trans) trans = skillData[`special-${_name}`];
	            let tsName = name;
	            let tsDetail = item['special_comment'];
	            if (trans) {
	              if (trans.name) tsName = trans.name + plus1;
	              if (trans.detail) {
	                const detail = trans.detail;
	                const rep = new RegExp(config.defaultName, 'g');
	                const uname = config.displayName || config.userName;
	                const text = filter(detail.replace(rep, uname));
	                tsDetail = text;
	              }
	            }
	            if (tsDetail === item['special_comment']) {
	              tsDetail = await transSkill(item['special_comment'], state);
	              item['special_comment'] = tsDetail;
	            }
	            item['special_skill'] = tsName;
	            item['special_comment'] = tsDetail;
	            skillTemp.set(name, {
	              name: getPlusStr(tsName)[2],
	              detail: tsDetail
	            });
	          } else {
	            let trans = skillData[`special${plus2}`];
	            if (!trans) trans = skillData[`special`];
	            let tsName = name;
	            let tsDetail = item['special_comment'];
	            if (trans) {
	              if (trans.name) tsName = trans.name + plus1;
	              if (trans.detail) tsDetail = trans.detail;
	            }
	            if (tsDetail === item['special_comment']) {
	              tsDetail = await transSkill(item['special_comment'], state);
	              item['special_comment'] = tsDetail;
	            }
	            item['special_skill'] = tsName;
	            item['special_comment'] = tsDetail;
	            skillTemp.set(name, {
	              name: getPlusStr(tsName)[2],
	              detail: tsDetail
	            });
	          }
	        }
	      } else {
	        if (item['special_skill'] && item['special_comment']) {
	          const name = item['special_skill'];
	          const detail = await transSkill(item['special_comment'], state);
	          item['special_comment'] = detail;
	          skillTemp.set(name, {
	            name: getPlusStr(name)[2],
	            detail
	          });
	        }
	        if (item.name && bossNameMap$1.has(item.name)) {
	          item.name = bossNameMap$1.get(item.name);
	        }
	      }
	    }
	  }
	  // translate summon
	  if (data.summon && isArray_1(data.summon)) {
	    for (let item of data.summon) {
	      if (item) {
	        if (item.comment) {
	          item.comment = await transSkill(item.comment, state);
	        }
	        if (item.protection) {
	          item.protection = await transSkill(item.protection, state);
	        }
	      }
	    }
	  }
	  if (data.supporter && data.supporter.name) {
	    data.supporter.comment = await transSkill(data.supporter.comment, state);
	    data.supporter.detail = await transSkill(data.supporter.detail, state);
	    data.supporter.protection = await transSkill(data.supporter.protection, state);
	  }
	  // translate scenario
	  if (scenario) {
	    for (let scKey in scenario) {
	      let item = scenario[scKey];
	      if (item && item.name) {
	        if (item.cmd === 'ability') {
	          const trans = skillTemp.get(item.name);
	          const [plus1] = getPlusStr(item.name);
	          if (trans) {
	            item.name = trans.name + plus1;
	            item.comment = trans.detail;
	          }
	        } else if (item.cmd === 'special_npc') {
	          const trans = skillTemp.get(item.name);
	          const [plus1] = getPlusStr(item.name);
	          if (trans) {
	            item.name = trans.name + plus1;
	          }
	        } else if (item.cmd === 'special_change') {
	          const [plus1, plus2, _name] = getPlusStr(item.name);
	          let trans = skillTemp.get(item.name);
	          if (!trans) trans = skillTemp.get(_name);
	          let tsName = item.name;
	          let tsDetail = item.text;
	          if (trans) {
	            if (trans.name) tsName = trans.name + plus1;
	            if (trans.detail) tsDetail = trans.detail;
	          }
	          if (tsDetail === item.text) {
	            tsDetail = await transSkill(item.text, state);
	            item.text = tsDetail;
	          }
	          item.name = tsName;
	          item.text = tsDetail;
	          skillTemp.set(name, {
	            name: getPlusStr(tsName)[2],
	            detail: tsDetail
	          });
	        } else if (item.cmd === 'boss_gauge') {
	          replaceMonsterName(item.name, 'ja');
	          replaceMonsterName(item.name, 'en');
	        }
	      }
	    }
	  }
	  return data;
	};
	const transBattle = race(battle);
	const transBattleR = async data => {
	  return await transBattle(data, 'result');
	};

	const autoTrans = skill => {
	  if (!skill.comment) return;
	  skill.comment = transSkill(skill.comment, state);
	};
	const weaponSkill = async data => {
	  await getCommSkillMap();
	  if (data.skill1) {
	    autoTrans(data.skill1);
	  }
	  if (data.skill2) {
	    autoTrans(data.skill2);
	  }
	  if (data.special_skill) {
	    autoTrans(data.special_skill);
	  }
	  return data;
	};

	const autoTrans$1 = (skill, type) => {
	  if (!skill.comment) return;
	  skill.comment = transSkill(skill.comment, state);
	  if (type === 'call') {
	    if (skill.recast_comment) skill.recast_comment = replaceTurn(skill.recast_comment);
	    if (skill.start_recast_comment) skill.start_recast_comment = replaceTurn(skill.start_recast_comment);
	  }
	};
	const summonSkill = async data => {
	  await getCommSkillMap();
	  if (data.skill) {
	    autoTrans$1(data.skill);
	  }
	  if (data.sub_skill) {
	    autoTrans$1(data.sub_skill);
	  }
	  if (data.special_skill) {
	    autoTrans$1(data.special_skill, 'call');
	  }
	  return data;
	};

	const comicMap = new Map();
	let loaded$b = false;
	const getComicData = async () => {
	  if (!loaded$b) {
	    const res = await fetch('https://gbf.danmu9.com/4ko.json');
	    const list = await res.json();
	    list.forEach(arr => {
	      const id = arr[0];
	      const title = filter(arr[1]);
	      const url = `https://gbf.danmu9.com/4ko/${id}.jpg`;
	      if (id) {
	        comicMap.set(id, {
	          title,
	          url
	        });
	      }
	    });
	    loaded$b = true;
	  }
	  return comicMap;
	};

	const insertTemplate = html => {
	  return html.replace('<div class="prt-episode-thumbnail">', `<% if (n.trans) { %><div class="comic-transtag-blhxfy">🌼</div><% } %><div class="prt-episode-thumbnail">`);
	};
	const comic = async (data, pathname, type = 'default') => {
	  if (type === 'template') {
	    let html;
	    try {
	      html = decodeURIComponent(data.data);
	    } catch (err) {
	      return data;
	    }
	    html = insertTemplate(html);
	    data.data = encodeURIComponent(html);
	  } else if (type === 'data') {
	    const comicMap = await getComicData();
	    if (data.list) {
	      for (let key in data.list) {
	        const item = data.list[key];
	        let id = parseInt(item.id);
	        if (comicMap.has(id)) {
	          item.trans = true;
	        }
	      }
	    }
	  } else {
	    const rgs = pathname.match(/\/comic\/content\/episode\/(\d+)/);
	    if (rgs && rgs[1]) {
	      const id = parseInt(rgs[1]);
	      const comicMap = await getComicData();
	      const info = comicMap.get(id);
	      if (info) {
	        let html;
	        try {
	          html = decodeURIComponent(data.data);
	        } catch (err) {
	          return data;
	        }
	        if (info.title) {
	          html = html.replace(/(<div\s+class=["']*prt-episode-title["']*>)[^<]*(<\/div>)/, `$1${info.title}$2`);
	        }
	        html = html.replace(/(<img\s+class=["']*img-episode["']* src=["']*)[^\s"'>]+(?=[\s"'>])/, `$1${info.url}`);
	        data.data = encodeURIComponent(html);
	      }
	    }
	  }
	  return data;
	};
	const transComicT = async (data, pathname) => {
	  return await comic(data, pathname, 'template');
	};
	const transComicD = async (data, pathname) => {
	  return await comic(data, pathname, 'data');
	};

	const arcarumMap = new Map();
	let loaded$c = false;
	const getArcarumData = async () => {
	  if (!loaded$c) {
	    let csv = await getLocalData('arcarum');
	    if (!csv) {
	      csv = await fetchWithHash('/blhxfy/data/arcarum.csv');
	      setLocalData('arcarum', csv);
	    }
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const ja = trim(item.ja).replace(/<br>/g, '');
	      const zh = filter(item.zh);
	      if (ja && zh) {
	        arcarumMap.set(ja, zh);
	      }
	    });
	    loaded$c = true;
	  }
	  return arcarumMap;
	};

	let arcarumMap$1 = new Map();
	let textTempArr = [];
	const debounceLog = debounce_1(() => {
	  if (!textTempArr.length) return;
	  const text = textTempArr.join(',\n');
	  console.info(text + ',');
	  textTempArr = [];
	}, 200);
	const replaceText = (key, data) => {
	  if (data && data[key]) {
	    let text = data[key].replace(/<br\s?\/?>/gi, '').replace(/\r?\n/g, '');
	    if (arcarumMap$1.has(text)) {
	      data[key] = arcarumMap$1.get(text);
	    } else {
	      let _text = data[key].replace(/\r?\n/g, '');
	      if (!textTempArr.includes(_text)) {
	        textTempArr.push(_text);
	      }
	      debounceLog();
	    }
	  }
	};
	const replaceListText = (key, list) => {
	  if (list && list.length) {
	    list.forEach(item => {
	      if (Array.isArray(key)) {
	        key.forEach(k => {
	          replaceText(k, item);
	        });
	      } else {
	        replaceText(key, item);
	      }
	    });
	  }
	};
	const transDivisionList = list => {
	  for (let key in list) {
	    const item = list[key];
	    replaceText('text', item);
	    replaceListText('message', item.gatepost_list);
	    replaceListText('message', item.chest_list);
	    for (let qlk in item.quest_list) {
	      replaceText('quest_name', item.quest_list[qlk]);
	      replaceText('chapter_name', item.quest_list[qlk]);
	    }
	  }
	};
	const transArcarum = async data => {
	  arcarumMap$1 = await getArcarumData();
	  replaceText('group_name', data.condition);
	  replaceText('name', data.stage);
	  if (data.map && data.map.division_list) {
	    transDivisionList(data.map.division_list);
	  }
	  if (data.notice_effect) {
	    for (let key in data.notice_effect) {
	      let obj = data.notice_effect[key];
	      if (obj && obj.maps) {
	        obj.maps.forEach(map => {
	          if (map.division_list) {
	            transDivisionList(map.division_list);
	          }
	        });
	      }
	    }
	  }
	  return data;
	};

	const replaceTime = str => {
	  if (!str) return str;
	  return str.replace('時間', '小时');
	};
	const pageIndex = async data => {
	  let messages;
	  let mydata;
	  let status;
	  try {
	    mydata = data.option.mydata_assets.mydata;
	    messages = mydata.mypage_notification_list;
	    status = mydata.status;
	  } catch (err) {
	    return data;
	  }
	  if (messages.length) {
	    const newMessages = [];
	    const phraseMap = await getPhrase();
	    messages.forEach(item => {
	      if (phraseMap.has(item.text)) {
	        item.text = phraseMap.get(item.text);
	      }
	      if (item.url !== 'news/detail/1/20002') {
	        newMessages.push(item);
	      }
	    });
	    mydata.mypage_notification_list = newMessages;
	  }
	  status.action_point_remain = replaceTime(status.action_point_remain);
	  status.battle_point_remain = replaceTime(status.battle_point_remain);
	  return data;
	};
	const replaceHour = (data, type) => {
	  if (!data.status && (!data.option || !data.option.user_status)) {
	    return data;
	  }
	  let status;
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
	const replaceHourU = data => {
	  return replaceHour(data, 'user');
	};

	const voiceMap = new Map();
	let loaded$d = false;
	const getTownData$1 = async () => {
	  if (!loaded$d) {
	    const csv = await fetchWithHash('/blhxfy/data/voice-mypage.csv');
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const path = trim(item.path);
	      const trans = filter(item.trans);
	      const duration = trim(item.duration) || 10;
	      if (path && trans) {
	        voiceMap.set(path, {
	          trans,
	          duration
	        });
	      }
	    });
	    loaded$d = true;
	  }
	  return voiceMap;
	};

	const voiceList = [];
	const saveList = async data => {
	  const obj = data.data;
	  for (let key in obj) {
	    let item = obj[key];
	    for (let vkey in item) {
	      let voice = item[vkey].replace(/\.[\w\d]+$/, '');
	      if (!voiceList.includes(voice)) {
	        voiceList.push(voice);
	      }
	    }
	  }
	};
	const createBox = () => {
	  const box = document.createElement('div');
	  box.id = 'box-sub-blhxfy';
	  box.innerHTML = '<div></div>';
	  return box;
	};
	let hideTimer = null;
	const hideBox = () => {
	  let box = document.getElementById('box-sub-blhxfy');
	  if (!box) return;
	  box.style.pointerEvents = 'none';
	  box.style.opacity = 0;
	  box.style.transition = 'opacity 1.5s';
	  clearTimeout(hideTimer);
	};
	const setSubBox = (text, duration) => {
	  const cont = document.querySelector('.cnt-mypage') || document.querySelector('.cnt-detail .prt-image');
	  if (!cont) return;
	  let box = document.getElementById('box-sub-blhxfy');
	  if (!box) {
	    box = createBox();
	    cont.appendChild(box);
	  }
	  let _text = text;
	  if (config.userName && (config.userName !== '姬塔' || config.userName !== '古兰')) {
	    _text = _text.replace(/(团长|姬塔)/g, config.displayName || config.userName);
	  }
	  box.querySelector('div').innerText = _text.replace(/\\n/g, '\n');
	  setTimeout(() => {
	    box.style.opacity = 1;
	    box.style.pointerEvents = 'auto';
	    box.style.transition = 'opacity 0.5s';
	  }, 100);
	  clearTimeout(hideTimer);
	  hideTimer = setTimeout(hideBox, duration * 1000);
	  box.removeEventListener('click', hideBox);
	  box.addEventListener('click', hideBox);
	};
	const showSub = async src => {
	  if (!src) return;
	  hideBox();
	  const voice = src.replace(/\.[\w\d]+$/, '');
	  if (!voiceList.includes(voice)) return;
	  const voiceMap = await getTownData$1();
	  if (!voiceMap.has(voice)) return;
	  const data = voiceMap.get(voice);
	  setSubBox(data.trans, data.duration);
	};
	const setFont = () => {
	  const css = `@font-face {
    font-family: 'blhxwf';
    font-style: normal;
    font-weight: normal;
    src: url('${config.origin}/blhxfy/data/static/webfont.woff2');
  }
  #box-sub-blhxfy {
    font-family: blhxwf, sans-serif;
  }`;
	  const tag = document.createElement('style');
	  tag.innerHTML = css;
	  document.head.appendChild(tag);
	};
	let soundInjected = false;
	async function showVoiceSub(data, pathname, type) {
	  if (!soundInjected) {
	    require(['model/sound'], function (sound) {
	      let playVoice = sound.prototype.playVoice;
	      sound.prototype.playVoice = function (src, force) {
	        if (!Game.setting.sound_flag) return;
	        showSub(src);
	        playVoice.call(this, src, force);
	      };
	    });
	    setFont();
	  }
	  soundInjected = true;
	  if (type === 'list') {
	    await saveList(data);
	  } else {
	    await showSub(pathname);
	  }
	}
	const showVoiceSubL = async (data, pathname) => {
	  return await showVoiceSub(data, pathname, 'list');
	};

	const getUserName = data => {
	  const html = decodeURIComponent(data.data);
	  const rgs = html.match(/<span\sclass="txt-user-name">([^<]+)<\/span>/);
	  if (rgs && rgs[1]) {
	    config.userName = rgs[1];
	    localStorage.setItem('blhxfy:name', rgs[1]);
	  }
	};
	const setUserName = () => {
	  if ((!config.userName || config.userName === '<span>古兰</span>') && Game.userId && location.hash !== '#tutorial/4' && location.hash !== '#tutorial/6' && location.hash !== '#tutorial/8') {
	    require(['model/content'], function (mc) {
	      let req = new mc({
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
	const getLocalName = () => {
	  const name = localStorage.getItem('blhxfy:name');
	  if (name) config.userName = filter(name);
	};
	getLocalName();

	let nameMap;
	const getName = async () => {
	  if (!nameMap) {
	    const chapterName = await fetchWithHash('/blhxfy/data/chapter-name.json');
	    nameMap = new Map(chapterName);
	    nameMap.set('エンディング', '终章');
	    nameMap.set('オープニング', '序章');
	    nameMap.set('信頼度エピソード', '信赖度剧情');
	  }
	  return nameMap;
	};
	const chapterList = async data => {
	  let list = data.chapter_list;
	  if (!list) return;
	  let nameMap = await getName();
	  list.forEach(item => {
	    let name = item.chapter_name;
	    if (nameMap.has(name)) {
	      item.chapter_name = nameMap.get(name);
	    }
	  });
	};
	const npcChapterList = async data => {
	  let nameMap = await getName();
	  if (data.scenes) {
	    for (let key in data.scenes) {
	      let item = data.scenes[key];
	      let name = item.scene_name;
	      if (nameMap.has(name)) {
	        item.scene_name = nameMap.get(name);
	      }
	    }
	  }
	  if (data.episode) {
	    data.episode.forEach(item => {
	      let name = item.chapter_name;
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
	      data.other_episode.list.forEach(item => {
	        let name = item.scene_name;
	        if (nameMap.has(name)) {
	          item.scene_name = nameMap.get(name);
	        }
	      });
	    }
	  }
	};
	const arcarumSceneName = async data => {
	  let nameMap = await getName();
	  if (data.option.scenes) {
	    data.option.scenes.forEach(item => {
	      let name = item.scene_name;
	      if (nameMap.has(name)) {
	        item.scene_name = nameMap.get(name);
	      }
	    });
	  }
	};
	const episodeList = async data => {
	  let nameMap = await getName();
	  let name = data.chapter_name;
	  if (nameMap.has(name)) {
	    data.chapter_name = nameMap.get(name);
	  }
	  for (let key in data.list) {
	    let item = data.list[key];
	    item.episode_name = item.episode_name.replace(/エピソード (\d+)/, '第 $1 节');
	  }
	};

	const battleNoteMap = new Map();
	let loaded$e = false;
	const getBattleNote = async () => {
	  if (!loaded$e) {
	    let csv = await getLocalData('battle/battle-note');
	    if (!csv) {
	      csv = await fetchWithHash('/blhxfy/data/battle/battle-note.csv');
	      setLocalData('battle/battle-note', csv);
	    }
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const text = trim(item.text);
	      const trans = filter(item.trans);
	      if (text && trans) {
	        battleNoteMap.set(text, trans);
	      }
	    });
	    loaded$e = true;
	  }
	  return battleNoteMap;
	};
	const battleNoteQuestMapId = {};
	let questNote;
	const getBattleNoteQuest = async id => {
	  if (battleNoteQuestMapId[id]) return battleNoteQuestMapId[id];
	  if (!questNote) questNote = await getLocalData('battle-note.json');
	  if (!questNote) {
	    questNote = await fetchWithHash('/blhxfy/data/battle-note.json');
	    setLocalData('battle-note.json', questNote);
	  }
	  if (questNote[id]) {
	    let questNoteData = getLocalData('battle-note-quest');
	    if (!questNoteData || !questNoteData[id]) {
	      let csv = await fetchWithHash(`/blhxfy/data/battle/${questNote[id]}.csv`);
	      questNoteData = {
	        [id]: csv
	      };
	      setLocalData('battle-note-quest', questNoteData);
	    }
	    const list = parseCsv(questNoteData[id]);
	    let battleNoteQuestMap = new Map();
	    list.forEach(item => {
	      const text = trim(item.text);
	      const trans = filter(item.trans);
	      if (text && trans) {
	        battleNoteQuestMap.set(text, trans);
	      }
	    });
	    battleNoteQuestMapId[id] = battleNoteQuestMap;
	    return battleNoteQuestMap;
	  }
	};

	const questMap = new Map();
	let battleQuestNoteMap;
	let battleNoteMap$1 = new Map();
	let rid = 0;
	const getQuestId = async (data, pathname) => {
	  if (pathname.endsWith('start.json')) {
	    if (data.quest_id) {
	      let questId = parseInt(data.quest_id);
	      questMap.set(data.raid_id, questId);
	      battleQuestNoteMap = await getBattleNoteQuest(questId);
	    }
	    rid = data.raid_id;
	  }
	};
	const reList = [[/(Lv.+\s)?(.+)が真の力を解放した！/, '$1$2释放了真正的力量！', {
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
	let textList = [];
	const transNote = (item, key) => {
	  if (!isObject_1(item)) return;
	  let text = trim(item[key]);
	  if (!text && !isString_1(text)) return;
	  text = text.replace(config.userName, '姬塔');
	  text = text.replace(/\r?\n/g, '');
	  if (battleNoteMap$1.has(text)) {
	    let trans = battleNoteMap$1.get(text);
	    trans = trans.replace('姬塔', config.displayName || config.userName);
	    item[key] = trans;
	  } else if (questMap.has(rid) && battleQuestNoteMap && battleQuestNoteMap.has(text)) {
	    let trans = battleQuestNoteMap.get(text);
	    trans = trans.replace('姬塔', config.displayName || config.userName);
	    item[key] = trans;
	  } else {
	    reList.forEach(reArr => {
	      if (reArr[0].test(text)) {
	        let trans = reArr[1];
	        item[key] = text.replace(reArr[0], function (...arr) {
	          for (let i = 1; i < arr.length - 2; i++) {
	            if (reArr[2][i] === 'name' && bossNameMap$1.has(arr[i])) {
	              trans = trans.replace(`$${i}`, bossNameMap$1.get(arr[i]));
	            } else {
	              trans = trans.replace(`$${i}`, arr[i] || '');
	            }
	          }
	          trans = trans.replace('姬塔', config.displayName || config.userName);
	          return trans;
	        });
	      }
	    });
	  }
	  if (config.log && !textList.includes(text)) {
	    textList.push(text);
	  }
	};
	let win = window.unsafeWindow || window;
	win.printBattleNote = () => {
	  let str = 'text,\n' + textList.join(',\n') + ',';
	  if (questMap.has(rid)) {
	    str = `quest-${questMap.get(rid)}.note.csv\n\n${str}`;
	  }
	  console.info(str);
	};
	const startData = data => {
	  if (isArray_1(data.navi_information)) {
	    data.navi_information.forEach(item => {
	      transNote(item, 'text');
	    });
	  }
	  if (!config.userName && isString_1(data.nickname)) {
	    config.userName = data.nickname;
	    localStorage.setItem('blhxfy:name', data.nickname);
	  }
	  if (isObject_1(data.battle_condition)) {
	    transNote(data.battle_condition, 'title');
	    transNote(data.battle_condition, 'body');
	  }
	};
	const normalData = data => {
	  if (isArray_1(data.scenario)) {
	    data.scenario.forEach(item => {
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
	          item.details.forEach(detail => {
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
	    data.navi_information.forEach(item => {
	      transNote(item, 'text');
	    });
	  }
	};
	const battleNote = async (data, pathname) => {
	  await getQuestId(data, pathname);
	  battleNoteMap$1 = await getBattleNote();
	  if (pathname.endsWith('start.json')) {
	    startData(data);
	  }
	  normalData(data);
	};

	let str = '';
	const storyNavi = async data => {
	  if (config.log && data && data.option && data.option.navi) {
	    const naviData = data.option.navi;
	    const npc = naviData.npc_list;
	    const list = [];
	    for (let key in naviData.comment_list) {
	      const synopsis = naviData.episode_status[key].synopsis;
	      list.push({
	        name: `简介 ${key}`,
	        text: synopsis,
	        voice: '',
	        image: ''
	      });
	      const commList = naviData.comment_list[key];
	      for (let npcId in commList) {
	        if (isArray_1(commList[npcId])) {
	          const name = npc[npcId];
	          commList[npcId].forEach((item, index) => {
	            list.push({
	              name: `${name}${index ? index : ''}`,
	              text: item.text,
	              voice: item.voice,
	              image: item.img
	            });
	          });
	        } else {
	          const item = commList[npcId];
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
	  }
	};
	let win$1 = window.unsafeWindow || window;
	win$1.dlStoryNavi = () => {
	  if (!config.log) return;
	  const date = new Date();
	  tryDownload(str, `story-navi-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.csv`);
	};

	const skinMap = new Map();
	let loaded$f = false;
	const getSkinData = async () => {
	  if (!loaded$f) {
	    const csv = await fetchWithHash('/blhxfy/data/skin.csv');
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const name = filter(item.name);
	      const comment = filter(item.comment);
	      const id = item.id | 0;
	      if (id && comment) {
	        skinMap.set(id, {
	          name,
	          comment
	        });
	      }
	    });
	    loaded$f = true;
	  }
	  return skinMap;
	};

	async function transSkin(data, pathname) {
	  const skinMap = await getSkinData();
	  const {
	    jpNameMap,
	    enNameMap
	  } = await getNameData();
	  data.list.forEach(char => {
	    char.name = transName(char.name, [jpNameMap, enNameMap]);
	    char.list_data.forEach(item => {
	      const id = item.master.id;
	      if (skinMap.has(id)) {
	        const data = skinMap.get(id);
	        if (data.name) item.master.name = data.name;
	        if (data.comment) item.master.comment = data.comment;
	      }
	    });
	  });
	  return data;
	}

	async function archiveCharName(data, pathname) {
	  const {
	    jpNameMap,
	    enNameMap
	  } = await getNameData();
	  for (let key in data.npc_list) {
	    let item = data.npc_list[key];
	    item.name = transName(item.name, [jpNameMap, enNameMap]);
	  }
	  return data;
	}

	const skinMap$1 = new Map();
	let loaded$g = false;
	const getStoryNpc = async () => {
	  if (!loaded$g) {
	    const csv = await fetchWithHash('/blhxfy/data/story-npc.csv');
	    const list = parseCsv(csv);
	    list.forEach(item => {
	      const comment = filter(item.comment);
	      const id = item.id;
	      if (id && comment) {
	        skinMap$1.set(id, comment);
	      }
	    });
	    loaded$g = true;
	  }
	  return skinMap$1;
	};

	async function storyNpcDetail (data, pathname) {
	  const {
	    jpNameMap,
	    enNameMap
	  } = await getNameData();
	  const storyNpc = await getStoryNpc();
	  data.name = transName(data.name, [jpNameMap, enNameMap]);
	  if (storyNpc.has(data.id)) {
	    data.comment = storyNpc.get(data.id);
	  }
	  return data;
	}

	const apiHosts = ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'];
	const requestRouter = async (data, type, list) => {
	  let result = false;
	  for (let [paths, handles] of list) {
	    if (!Array.isArray(paths)) paths = [paths];
	    let pass = false;
	    for (let path of paths) {
	      if (isString_1(path) && type.includes(path)) {
	        if (!config.storyOnly || storyPath.includes(path)) {
	          pass = true;
	        }
	      } else if (isRegExp_1(path) && path.test(type)) {
	        if (!config.storyOnly) pass = true;
	      }
	    }
	    if (pass) {
	      result = true;
	      if (!Array.isArray(handles)) handles = [handles];
	      for (let handle of handles) {
	        try {
	          if (isString_1(handle)) {} else {
	            await handle(data, type);
	          }
	        } catch (e) {
	          console.info(e);
	        }
	      }
	    }
	  }
	  return result;
	};
	const storyPath = ['scenario', '/profile/content/index/'];
	const requestList = [['/loginbonus/', loginBonus], ['scenario', [setUserName, transScenario]], ['/profile/content/index/', getUserName], ['/content/', [transLangMsg, transHTML, replaceHour]], ['/user/content/index', [transTownInfo, pageIndex]], ['/comic/content/episode/', comic], ['/comic/content/index', transComicT], ['/comic/list/', transComicD], [['/npc/npc/', '/archive/npc_detail'], parseSkill], [['/party_ability_subaction/', '/party/job_equipped/', '/party/ability_list/', '/zenith/ability_list/', '/party/job_info/'], transSkill$1], ['/island/init', transIslandInfo], [['/rest/sound/mypage_voice', '/rest/sound/archive_voice'], showVoiceSubL], [[/\/rest\/(multi)?raid\/start\.json/, /\/rest\/tutorial\/tutorial\d+(_\d+)?\.json/], [transChat, transBattle, battleNote]], [[/\/rest\/(multi)?raid\/ability_result\.json/, /\/rest\/(multi)?raid\/temporary_item_result\.json/, /\/rest\/(multi)?raid\/normal_attack_result\.json/, /\/rest\/(multi)?raid\/summon_result\.json/, /\/rest\/tutorial\/tutorial_battle_\d+(_\d+)?\.json/], [transBattleR, battleNote]], [/\/rest\/.*?raid\/condition\/\d+\/\d\/\d\.json/, transBuff], ['/user/status', replaceHourU], [['/weapon/weapon/', '/archive/weapon_detail'], weaponSkill], [['/summon/summon/', '/archive/summon_detail'], summonSkill], [['/rest/arcarum/move_division', '/rest/arcarum/start_stage', '/rest/arcarum/open_gatepost', '/rest/arcarum/open_chest', '/rest/arcarum/next_stage', '/rest/arcarum/stage'], transArcarum], [/\/story_chapter_list\/\d+(_\d+)?$/, chapterList], [/\/story_episode_list\/\d+(_\d+)?\/\d+(_\d+)?$/, episodeList], ['/archive/npc_detail', npcChapterList], [/^\/arcarum\/content\/summon_enhancement_detail\/\d+(_\d+)?$/, arcarumSceneName], ['/rest_shop_exchange_treasure/article_labels/', shopLabel], [/\/content\/navi/, storyNavi], [/^\/skin\/list\/\d+/, transSkin], [/^\/archive\/npc_list/, archiveCharName], [/^\/archive\/story_npc_detail/, storyNpcDetail]];
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
	  if (apiHosts.indexOf(hostname) !== -1) {
	    let result = await requestRouter(data, pathname, requestList);
	    if (!result) return;
	  } else {
	    return;
	  }
	  state.result = isJSON ? JSON.stringify(data) : data;
	}

	const injectXHR = () => {
	  // The following code are inspired by viramate/external.js
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
	    const state = getXhrState(this);
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
	    try {
	      await translate(state);
	    } catch (err) {
	      log(err);
	    }
	    state.onload && state.onload.call(this, state.onLoadEvent);
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
	};

	const addCss = () => {
	  let css = '';
	  if (config.removeScroller) {
	    css += `
    ::-webkit-scrollbar {
      display: none;
    }`;
	  }
	  if (config.hideSidebar) {
	    css += `
    body.jssdk>div:first-child>div:first-child>div:first-child[data-reactid] {
      display: none;
    }
    body.jssdk>div:first-child>div:nth-child(2) {
      margin-left: 0 !important;
    }`;
	  }
	  if (config.defaultFont) {
	    css += `
    @font-face {
      font-family: 'blhxwf';
      font-style: normal;
      font-weight: normal;
      src: url('${config.origin}/blhxfy/data/static/webfont.woff2');
    }
    body {
      font-family: "FOT-ニューロダン Pro M","FOT-筑紫オールド明朝 Pro R","Average Sans", blhxwf, sans-serif;
    }`;
	  }
	  if (css) {
	    const style = document.createElement('style');
	    style.innerHTML = css;
	    document.head.appendChild(style);
	  }
	};
	const settingEtc = () => {
	  addCss();
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

	const saveToLocalstorage = (key, value) => {
	  let data;
	  try {
	    const str = localStorage.getItem('blhxfy:setting');
	    data = JSON.parse(str);
	  } catch (err) {
	    console.error(err);
	  }
	  if (!data || typeof data !== 'object') {
	    data = {};
	  }
	  data[key] = value;
	  config[key] = value;
	  localStorage.setItem('blhxfy:setting', JSON.stringify(data));
	};
	const keyMap = new Map([['origin', 'origin'], ['auto-download', 'autoDownload'], ['bottom-toolbar', 'bottomToolbar'], ['username', 'displayName'], ['remove-scroller', 'removeScroller'], ['hide-sidebar', 'hideSidebar'], ['trans-ja', 'transJa'], ['trans-en', 'transEn'], ['trans-api', 'transApi'], ['story-only', 'storyOnly'], ['show-translator', 'showTranslator'], ['font', 'font'], ['log', 'log'], ['font-bold', 'fontBold'], ['plain-text', 'plainText'], ['battle-trans', 'battleTrans'], ['origin-text', 'originText'], ['default-font', 'defaultFont']]);
	const setting = (type, value) => {
	  if (type === 'show') {
	    for (let [id, key] of keyMap) {
	      const ipt = jQuery(`#${id}-setting-blhxfy`);
	      if (!ipt.length) continue;
	      if (ipt.attr('type') === 'checkbox') {
	        ipt[0].checked = config[key];
	      } else if (ipt[0].tagName.toUpperCase() === 'SELECT') {
	        ipt.val(config[key]);
	        const text = ipt.find('option:selected').text();
	        jQuery(`#${id}-setting-blhxfy-txt`).text(text);
	      } else {
	        ipt.val(config[key]);
	      }
	    }
	    jQuery('#blhxfy-setting-modal').addClass('show');
	  } else if (type === 'hide') {
	    jQuery('#blhxfy-setting-modal').removeClass('show');
	  } else if (type === 'language' || type === 'fast-mode') {
	    require(['view/setting/index'], function (sett) {
	      sett.prototype.onChangePostAsyncInput({
	        currentTarget: value.target
	      });
	    });
	  } else {
	    if (type === 'trans-api') {
	      const text = jQuery('#trans-api-setting-blhxfy').find('option:selected').text();
	      jQuery('#trans-api-setting-blhxfy-txt').text(text);
	    }
	    saveToLocalstorage(keyMap.get(type), value);
	  }
	};
	const thSetting = throttle_1(setting, 300);

	const txtKeys$1 = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt', 'sel5_txt', 'sel6_txt'];
	const replaceName = (content, userName) => {
	  if (userName) {
	    content.forEach(item => {
	      if (item.id === 'info') return;
	      ['name', 'text', 'trans'].forEach(key => {
	        if (!item[key]) return;
	        let _lang = Game.lang;
	        if (!/^\w+$/.test(userName)) _lang = 'unknown';
	        item[key] = replaceWords(item[key], new Map([[userName, '姬塔']]), _lang);
	      });
	    });
	  }
	};
	const dataToCsv = (data, fill, isTrans, isAutoTrans) => {
	  const result = [];
	  const _data = deepClone(data);
	  _data.forEach(item => {
	    let name = removeTag(item.charcter1_name);
	    replaceChar('charcter1_name', item, scenarioCache.nameMap);
	    const transName = removeTag(item.charcter1_name);
	    let hasTransName = name !== transName;
	    if (name && config.userName === name) {
	      name = config.defaultName;
	      hasTransName = false;
	    }
	    txtKeys$1.forEach(key => {
	      let txt = item[key];
	      let hasName = key === 'detail' && name && name !== 'null';
	      if (txt) {
	        txt = txt.replace(/\n/g, '');
	        txt = simpleHtml(txt);
	        let trans = '';
	        if (isTrans) {
	          const obj = scenarioCache.transMap.get(item.id);
	          if (obj && obj[`${key}-origin`]) {
	            trans = obj[`${key}-origin`];
	          }
	        } else if (isAutoTrans) {
	          const obj = scenarioCache.transMap.get(item.id);
	          if (obj && obj[key]) {
	            trans = obj[key];
	          }
	        } else if (fill) {
	          trans = txt;
	        }
	        if (config.plainText) {
	          txt = removeHtmlTag(txt);
	          trans = removeHtmlTag(trans);
	        }
	        result.push({
	          id: `${item.id}${key === 'detail' ? '' : '-' + key}`,
	          name: hasName ? `${name}${hasTransName ? '/' + transName : ''}` : '',
	          text: txt,
	          trans
	        });
	      }
	    });
	  });
	  let translator = '';
	  if (isTrans && scenarioCache.transMap.has('translator')) {
	    translator = scenarioCache.transMap.get('translator').detail;
	  }
	  const extraInfo = {
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
	function dlStoryCsv (type = 'normal') {
	  if (type === 'normal') {
	    tryDownload(dataToCsv(scenarioCache.data), scenarioCache.name + '.csv');
	  } else if (type === 'trans') {
	    if (scenarioCache.hasTrans) {
	      tryDownload(dataToCsv(scenarioCache.data, false, true), `${scenarioCache.originName || scenarioCache.name}.csv`);
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

	const setLocalData$1 = (name, csv) => {
	  const data = getPreview();
	  let exist = false;
	  for (let item of data) {
	    if (item.name === name) {
	      exist = true;
	      item.csv = csv;
	      break;
	    }
	  }
	  if (!exist) {
	    if (data.length >= 5) {
	      data.shift();
	    }
	    data.push({
	      name,
	      csv
	    });
	  }
	  sessionStorage.setItem('blhxfy:preview', JSON.stringify(data));
	};
	function previewCsv (type) {
	  const cont = document.getElementById('blhxfy-story-input');
	  if (type === 'hide') {
	    cont.style.display = 'none';
	  } else if (type === 'show') {
	    const csv = getPreviewCsv(scenarioCache.name);
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
	  let win = window.unsafeWindow || window;
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
	    const {
	      name,
	      type,
	      data
	    } = e.detail;
	    if (name === 'setting') {
	      thSetting(type, data);
	    } else if (name === 'dlStoryCsv') {
	      dlStoryCsv(type);
	    } else if (name === 'previewCsv') {
	      previewCsv(type);
	    }
	  });
	}

	const main = () => {
	  const time = sessionStorage.getItem('blhxfy:startTime') || 0;
	  const now = Date.now();
	  if (now - time < 1000) return;
	  sessionStorage.setItem('blhxfy:startTime', now);
	  eventMessage();
	  injectXHR();
	};
	const init = () => {
	  if (!config.storyOnly) {
	    main();
	  } else {
	    let started = false;
	    const start = () => {
	      if (!started) {
	        started = true;
	        main();
	        observer.disconnect();
	      }
	    };
	    const mutationCallback = mutationsList => {
	      for (let mutation of mutationsList) {
	        const type = mutation.type;
	        const addedNodes = mutation.addedNodes;
	        if (type === 'childList' && addedNodes.length && addedNodes.length < 2) {
	          addedNodes.forEach(node => {
	            if (node.tagName.toUpperCase() === 'SCRIPT' && node.src.includes('scenario-model')) {
	              start();
	            }
	          });
	        }
	      }
	    };
	    const obConfig = {
	      childList: true
	    };
	    const targetNode = document.head;
	    const observer = new MutationObserver(mutationCallback);
	    observer.observe(targetNode, obConfig);
	  }
	};
	let win$2 = window.unsafeWindow || window;
	if (win$2.document.readyState != 'loading') {
	  init();
	} else {
	  win$2.addEventListener('DOMContentLoaded', init);
	}

}());
