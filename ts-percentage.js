// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register(
  "file:///C:/Users/KK/Documents/misc/ts-percentage/src/flags/types",
  [],
  function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///C:/Users/KK/Documents/misc/ts-percentage/src/util",
  [],
  function (exports_2, context_2) {
    "use strict";
    var flagRegexp, readArgs, reduceAsync, colours;
    var __moduleName = context_2 && context_2.id;
    return {
      setters: [],
      execute: function () {
        flagRegexp = /^--(?=\w)/;
        exports_2(
          "readArgs",
          readArgs = (args) => {
            let currentFlag = "";
            const result = args.reduce((map, part) => {
              if (flagRegexp.test(part)) {
                currentFlag = part.replace(flagRegexp, "");
                map[currentFlag] = [];
                return map;
              }
              if (currentFlag) {
                const flag = currentFlag;
                map[flag] = (map[flag] || []).concat(part);
              }
              return map;
            }, {});
            return result;
          },
        );
        exports_2(
          "reduceAsync",
          reduceAsync = (arr, fn, init) =>
            arr.reduce(
              (accum, item) => accum.then((res) => fn(res, item)),
              Promise.resolve(init),
            ),
        );
        exports_2(
          "colours",
          colours = {
            green: (text) => `\u001b[32m${text}\u001b[0m`,
            yellow: (text) => `\u001b[33m${text}\u001b[0m`,
          },
        );
      },
    };
  },
);
System.register(
  "file:///C:/Users/KK/Documents/misc/ts-percentage/src/flags/operators",
  [],
  function (exports_3, context_3) {
    "use strict";
    var src, onlyJavascript, operators;
    var __moduleName = context_3 && context_3.id;
    return {
      setters: [],
      execute: function () {
        src = {
          count: () =>
            (count, filename) =>
              Promise.resolve(
                /.tsx?$/.test(filename)
                  ? { ...count, success: count.success + 1 }
                  : count,
              ),
        };
        onlyJavascript = {
          total: () =>
            (count, filename) =>
              Promise.resolve(
                /\.[jt]sx?$/.test(filename)
                  ? { ...count, total: count.total + 1 }
                  : count,
              ),
        };
        operators = {
          src,
          "only-javascript": onlyJavascript,
        };
        exports_3("default", operators);
      },
    };
  },
);
System.register(
  "file:///C:/Users/KK/Documents/misc/ts-percentage/src/flags/util",
  [],
  function (exports_4, context_4) {
    "use strict";
    var curryTransformers;
    var __moduleName = context_4 && context_4.id;
    return {
      setters: [],
      execute: function () {
        curryTransformers = (transformerLookup, appliedFlags) => {
          const res = Object.keys(appliedFlags).reduce((accum, flag) => {
            const flagKey = flag;
            const transformer = transformerLookup[flagKey];
            accum[flagKey] = Object.entries(transformer).reduce(
              (nextTransformer, transformerData) => {
                const [operation, fn] = transformerData;
                nextTransformer[operation] = fn?.(appliedFlags);
                return nextTransformer;
              },
              {},
            );
            return accum;
          }, {});
          return res;
        };
        exports_4("default", curryTransformers);
      },
    };
  },
);
System.register(
  "file:///C:/Users/KK/Documents/misc/ts-percentage/src/flags/index",
  [
    "file:///C:/Users/KK/Documents/misc/ts-percentage/src/flags/operators",
    "file:///C:/Users/KK/Documents/misc/ts-percentage/src/flags/util",
  ],
  function (exports_5, context_5) {
    "use strict";
    var operators_ts_1, util_ts_1, loadOperators;
    var __moduleName = context_5 && context_5.id;
    return {
      setters: [
        function (operators_ts_1_1) {
          operators_ts_1 = operators_ts_1_1;
        },
        function (util_ts_1_1) {
          util_ts_1 = util_ts_1_1;
        },
      ],
      execute: function () {
        loadOperators = (flagLookup) =>
          util_ts_1.default(operators_ts_1.default, flagLookup);
        exports_5("default", loadOperators);
      },
    };
  },
);
System.register(
  "https://deno.land/std/path/interface",
  [],
  function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std/path/_constants",
  [],
  function (exports_7, context_7) {
    "use strict";
    var build,
      CHAR_UPPERCASE_A,
      CHAR_LOWERCASE_A,
      CHAR_UPPERCASE_Z,
      CHAR_LOWERCASE_Z,
      CHAR_DOT,
      CHAR_FORWARD_SLASH,
      CHAR_BACKWARD_SLASH,
      CHAR_VERTICAL_LINE,
      CHAR_COLON,
      CHAR_QUESTION_MARK,
      CHAR_UNDERSCORE,
      CHAR_LINE_FEED,
      CHAR_CARRIAGE_RETURN,
      CHAR_TAB,
      CHAR_FORM_FEED,
      CHAR_EXCLAMATION_MARK,
      CHAR_HASH,
      CHAR_SPACE,
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE,
      CHAR_LEFT_SQUARE_BRACKET,
      CHAR_RIGHT_SQUARE_BRACKET,
      CHAR_LEFT_ANGLE_BRACKET,
      CHAR_RIGHT_ANGLE_BRACKET,
      CHAR_LEFT_CURLY_BRACKET,
      CHAR_RIGHT_CURLY_BRACKET,
      CHAR_HYPHEN_MINUS,
      CHAR_PLUS,
      CHAR_DOUBLE_QUOTE,
      CHAR_SINGLE_QUOTE,
      CHAR_PERCENT,
      CHAR_SEMICOLON,
      CHAR_CIRCUMFLEX_ACCENT,
      CHAR_GRAVE_ACCENT,
      CHAR_AT,
      CHAR_AMPERSAND,
      CHAR_EQUAL,
      CHAR_0,
      CHAR_9,
      isWindows,
      SEP,
      SEP_PATTERN;
    var __moduleName = context_7 && context_7.id;
    return {
      setters: [],
      execute: function () {
        build = Deno.build;
        // Alphabet chars.
        exports_7("CHAR_UPPERCASE_A", CHAR_UPPERCASE_A = 65); /* A */
        exports_7("CHAR_LOWERCASE_A", CHAR_LOWERCASE_A = 97); /* a */
        exports_7("CHAR_UPPERCASE_Z", CHAR_UPPERCASE_Z = 90); /* Z */
        exports_7("CHAR_LOWERCASE_Z", CHAR_LOWERCASE_Z = 122); /* z */
        // Non-alphabetic chars.
        exports_7("CHAR_DOT", CHAR_DOT = 46); /* . */
        exports_7("CHAR_FORWARD_SLASH", CHAR_FORWARD_SLASH = 47); /* / */
        exports_7("CHAR_BACKWARD_SLASH", CHAR_BACKWARD_SLASH = 92); /* \ */
        exports_7("CHAR_VERTICAL_LINE", CHAR_VERTICAL_LINE = 124); /* | */
        exports_7("CHAR_COLON", CHAR_COLON = 58); /* : */
        exports_7("CHAR_QUESTION_MARK", CHAR_QUESTION_MARK = 63); /* ? */
        exports_7("CHAR_UNDERSCORE", CHAR_UNDERSCORE = 95); /* _ */
        exports_7("CHAR_LINE_FEED", CHAR_LINE_FEED = 10); /* \n */
        exports_7("CHAR_CARRIAGE_RETURN", CHAR_CARRIAGE_RETURN = 13); /* \r */
        exports_7("CHAR_TAB", CHAR_TAB = 9); /* \t */
        exports_7("CHAR_FORM_FEED", CHAR_FORM_FEED = 12); /* \f */
        exports_7("CHAR_EXCLAMATION_MARK", CHAR_EXCLAMATION_MARK = 33); /* ! */
        exports_7("CHAR_HASH", CHAR_HASH = 35); /* # */
        exports_7("CHAR_SPACE", CHAR_SPACE = 32); /*   */
        exports_7(
          "CHAR_NO_BREAK_SPACE",
          CHAR_NO_BREAK_SPACE = 160,
        ); /* \u00A0 */
        exports_7(
          "CHAR_ZERO_WIDTH_NOBREAK_SPACE",
          CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279,
        ); /* \uFEFF */
        exports_7(
          "CHAR_LEFT_SQUARE_BRACKET",
          CHAR_LEFT_SQUARE_BRACKET = 91,
        ); /* [ */
        exports_7(
          "CHAR_RIGHT_SQUARE_BRACKET",
          CHAR_RIGHT_SQUARE_BRACKET = 93,
        ); /* ] */
        exports_7(
          "CHAR_LEFT_ANGLE_BRACKET",
          CHAR_LEFT_ANGLE_BRACKET = 60,
        ); /* < */
        exports_7(
          "CHAR_RIGHT_ANGLE_BRACKET",
          CHAR_RIGHT_ANGLE_BRACKET = 62,
        ); /* > */
        exports_7(
          "CHAR_LEFT_CURLY_BRACKET",
          CHAR_LEFT_CURLY_BRACKET = 123,
        ); /* { */
        exports_7(
          "CHAR_RIGHT_CURLY_BRACKET",
          CHAR_RIGHT_CURLY_BRACKET = 125,
        ); /* } */
        exports_7("CHAR_HYPHEN_MINUS", CHAR_HYPHEN_MINUS = 45); /* - */
        exports_7("CHAR_PLUS", CHAR_PLUS = 43); /* + */
        exports_7("CHAR_DOUBLE_QUOTE", CHAR_DOUBLE_QUOTE = 34); /* " */
        exports_7("CHAR_SINGLE_QUOTE", CHAR_SINGLE_QUOTE = 39); /* ' */
        exports_7("CHAR_PERCENT", CHAR_PERCENT = 37); /* % */
        exports_7("CHAR_SEMICOLON", CHAR_SEMICOLON = 59); /* ; */
        exports_7(
          "CHAR_CIRCUMFLEX_ACCENT",
          CHAR_CIRCUMFLEX_ACCENT = 94,
        ); /* ^ */
        exports_7("CHAR_GRAVE_ACCENT", CHAR_GRAVE_ACCENT = 96); /* ` */
        exports_7("CHAR_AT", CHAR_AT = 64); /* @ */
        exports_7("CHAR_AMPERSAND", CHAR_AMPERSAND = 38); /* & */
        exports_7("CHAR_EQUAL", CHAR_EQUAL = 61); /* = */
        // Digits
        exports_7("CHAR_0", CHAR_0 = 48); /* 0 */
        exports_7("CHAR_9", CHAR_9 = 57); /* 9 */
        isWindows = build.os == "windows";
        exports_7("SEP", SEP = isWindows ? "\\" : "/");
        exports_7("SEP_PATTERN", SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/);
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std/path/_util",
  ["https://deno.land/std/path/_constants"],
  function (exports_8, context_8) {
    "use strict";
    var _constants_ts_1;
    var __moduleName = context_8 && context_8.id;
    function assertPath(path) {
      if (typeof path !== "string") {
        throw new TypeError(
          `Path must be a string. Received ${JSON.stringify(path)}`,
        );
      }
    }
    exports_8("assertPath", assertPath);
    function isPosixPathSeparator(code) {
      return code === _constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports_8("isPosixPathSeparator", isPosixPathSeparator);
    function isPathSeparator(code) {
      return isPosixPathSeparator(code) ||
        code === _constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports_8("isPathSeparator", isPathSeparator);
    function isWindowsDeviceRoot(code) {
      return ((code >= _constants_ts_1.CHAR_LOWERCASE_A &&
        code <= _constants_ts_1.CHAR_LOWERCASE_Z) ||
        (code >= _constants_ts_1.CHAR_UPPERCASE_A &&
          code <= _constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports_8("isWindowsDeviceRoot", isWindowsDeviceRoot);
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
      let res = "";
      let lastSegmentLength = 0;
      let lastSlash = -1;
      let dots = 0;
      let code;
      for (let i = 0, len = path.length; i <= len; ++i) {
        if (i < len) {
          code = path.charCodeAt(i);
        } else if (isPathSeparator(code)) {
          break;
        } else {
          code = _constants_ts_1.CHAR_FORWARD_SLASH;
        }
        if (isPathSeparator(code)) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (
              res.length < 2 ||
              lastSegmentLength !== 2 ||
              res.charCodeAt(res.length - 1) !== _constants_ts_1.CHAR_DOT ||
              res.charCodeAt(res.length - 2) !== _constants_ts_1.CHAR_DOT
            ) {
              if (res.length > 2) {
                const lastSlashIndex = res.lastIndexOf(separator);
                if (lastSlashIndex === -1) {
                  res = "";
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 -
                    res.lastIndexOf(separator);
                }
                lastSlash = i;
                dots = 0;
                continue;
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0) {
                res += `${separator}..`;
              } else {
                res = "..";
              }
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0) {
              res += separator + path.slice(lastSlash + 1, i);
            } else {
              res = path.slice(lastSlash + 1, i);
            }
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === _constants_ts_1.CHAR_DOT && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    exports_8("normalizeString", normalizeString);
    function _format(sep, pathObject) {
      const dir = pathObject.dir || pathObject.root;
      const base = pathObject.base ||
        (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    exports_8("_format", _format);
    return {
      setters: [
        function (_constants_ts_1_1) {
          _constants_ts_1 = _constants_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std/fmt/colors",
  [],
  function (exports_9, context_9) {
    "use strict";
    var noColor, enabled;
    var __moduleName = context_9 && context_9.id;
    function setColorEnabled(value) {
      if (noColor) {
        return;
      }
      enabled = value;
    }
    exports_9("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
      return enabled;
    }
    exports_9("getColorEnabled", getColorEnabled);
    function code(open, close) {
      return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
      };
    }
    function run(str, code) {
      return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
    }
    function reset(str) {
      return run(str, code([0], 0));
    }
    exports_9("reset", reset);
    function bold(str) {
      return run(str, code([1], 22));
    }
    exports_9("bold", bold);
    function dim(str) {
      return run(str, code([2], 22));
    }
    exports_9("dim", dim);
    function italic(str) {
      return run(str, code([3], 23));
    }
    exports_9("italic", italic);
    function underline(str) {
      return run(str, code([4], 24));
    }
    exports_9("underline", underline);
    function inverse(str) {
      return run(str, code([7], 27));
    }
    exports_9("inverse", inverse);
    function hidden(str) {
      return run(str, code([8], 28));
    }
    exports_9("hidden", hidden);
    function strikethrough(str) {
      return run(str, code([9], 29));
    }
    exports_9("strikethrough", strikethrough);
    function black(str) {
      return run(str, code([30], 39));
    }
    exports_9("black", black);
    function red(str) {
      return run(str, code([31], 39));
    }
    exports_9("red", red);
    function green(str) {
      return run(str, code([32], 39));
    }
    exports_9("green", green);
    function yellow(str) {
      return run(str, code([33], 39));
    }
    exports_9("yellow", yellow);
    function blue(str) {
      return run(str, code([34], 39));
    }
    exports_9("blue", blue);
    function magenta(str) {
      return run(str, code([35], 39));
    }
    exports_9("magenta", magenta);
    function cyan(str) {
      return run(str, code([36], 39));
    }
    exports_9("cyan", cyan);
    function white(str) {
      return run(str, code([37], 39));
    }
    exports_9("white", white);
    function gray(str) {
      return run(str, code([90], 39));
    }
    exports_9("gray", gray);
    function bgBlack(str) {
      return run(str, code([40], 49));
    }
    exports_9("bgBlack", bgBlack);
    function bgRed(str) {
      return run(str, code([41], 49));
    }
    exports_9("bgRed", bgRed);
    function bgGreen(str) {
      return run(str, code([42], 49));
    }
    exports_9("bgGreen", bgGreen);
    function bgYellow(str) {
      return run(str, code([43], 49));
    }
    exports_9("bgYellow", bgYellow);
    function bgBlue(str) {
      return run(str, code([44], 49));
    }
    exports_9("bgBlue", bgBlue);
    function bgMagenta(str) {
      return run(str, code([45], 49));
    }
    exports_9("bgMagenta", bgMagenta);
    function bgCyan(str) {
      return run(str, code([46], 49));
    }
    exports_9("bgCyan", bgCyan);
    function bgWhite(str) {
      return run(str, code([47], 49));
    }
    exports_9("bgWhite", bgWhite);
    /* Special Color Sequences */
    function clampAndTruncate(n, max = 255, min = 0) {
      return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /** Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function rgb8(str, color) {
      return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_9("rgb8", rgb8);
    /** Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function bgRgb8(str, color) {
      return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_9("bgRgb8", bgRgb8);
    /** Set text color using 24bit rgb. */
    function rgb24(str, color) {
      return run(
        str,
        code([
          38,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 39),
      );
    }
    exports_9("rgb24", rgb24);
    /** Set background color using 24bit rgb. */
    function bgRgb24(str, color) {
      return run(
        str,
        code([
          48,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 49),
      );
    }
    exports_9("bgRgb24", bgRgb24);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        /**
             * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
             * on npm.
             *
             * ```
             * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
             * console.log(bgBlue(red(bold("Hello world!"))));
             * ```
             *
             * This module supports `NO_COLOR` environmental variable disabling any coloring
             * if `NO_COLOR` is set.
             */
        noColor = Deno.noColor;
        enabled = !noColor;
      },
    };
  },
);
System.register(
  "https://deno.land/std/testing/diff",
  [],
  function (exports_10, context_10) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_10 && context_10.id;
    function createCommon(A, B, reverse) {
      const common = [];
      if (A.length === 0 || B.length === 0) {
        return [];
      }
      for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
        if (
          A[reverse ? A.length - i - 1 : i] ===
            B[reverse ? B.length - i - 1 : i]
        ) {
          common.push(A[reverse ? A.length - i - 1 : i]);
        } else {
          return common;
        }
      }
      return common;
    }
    function diff(A, B) {
      const prefixCommon = createCommon(A, B);
      const suffixCommon = createCommon(
        A.slice(prefixCommon.length),
        B.slice(prefixCommon.length),
        true,
      ).reverse();
      A = suffixCommon.length
        ? A.slice(prefixCommon.length, -suffixCommon.length)
        : A.slice(prefixCommon.length);
      B = suffixCommon.length
        ? B.slice(prefixCommon.length, -suffixCommon.length)
        : B.slice(prefixCommon.length);
      const swapped = B.length > A.length;
      [A, B] = swapped ? [B, A] : [A, B];
      const M = A.length;
      const N = B.length;
      if (!M && !N && !suffixCommon.length && !prefixCommon.length) {
        return [];
      }
      if (!N) {
        return [
          ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
          ...A.map((a) => ({
            type: swapped ? DiffType.added : DiffType.removed,
            value: a,
          })),
          ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
      }
      const offset = N;
      const delta = M - N;
      const size = M + N + 1;
      const fp = new Array(size).fill({ y: -1 });
      /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
      const routes = new Uint32Array((M * N + size + 1) * 2);
      const diffTypesPtrOffset = routes.length / 2;
      let ptr = 0;
      let p = -1;
      function backTrace(A, B, current, swapped) {
        const M = A.length;
        const N = B.length;
        const result = [];
        let a = M - 1;
        let b = N - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while (true) {
          if (!j && !type) {
            break;
          }
          const prev = j;
          if (type === REMOVED) {
            result.unshift({
              type: swapped ? DiffType.removed : DiffType.added,
              value: B[b],
            });
            b -= 1;
          } else if (type === ADDED) {
            result.unshift({
              type: swapped ? DiffType.added : DiffType.removed,
              value: A[a],
            });
            a -= 1;
          } else {
            result.unshift({ type: DiffType.common, value: A[a] });
            a -= 1;
            b -= 1;
          }
          j = routes[prev];
          type = routes[prev + diffTypesPtrOffset];
        }
        return result;
      }
      function createFP(slide, down, k, M) {
        if (slide && slide.y === -1 && down && down.y === -1) {
          return { y: 0, id: 0 };
        }
        if (
          (down && down.y === -1) ||
          k === M ||
          (slide && slide.y) > (down && down.y) + 1
        ) {
          const prev = slide.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = ADDED;
          return { y: slide.y, id: ptr };
        } else {
          const prev = down.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = REMOVED;
          return { y: down.y + 1, id: ptr };
        }
      }
      function snake(k, slide, down, _offset, A, B) {
        const M = A.length;
        const N = B.length;
        if (k < -N || M < k) {
          return { y: -1, id: -1 };
        }
        const fp = createFP(slide, down, k, M);
        while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
          const prev = fp.id;
          ptr++;
          fp.id = ptr;
          fp.y += 1;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = COMMON;
        }
        return fp;
      }
      while (fp[delta + offset].y < N) {
        p = p + 1;
        for (let k = -p; k < delta; ++k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        for (let k = delta + p; k > delta; --k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        fp[delta + offset] = snake(
          delta,
          fp[delta - 1 + offset],
          fp[delta + 1 + offset],
          offset,
          A,
          B,
        );
      }
      return [
        ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ...backTrace(A, B, fp[delta + offset], swapped),
        ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
      ];
    }
    exports_10("default", diff);
    return {
      setters: [],
      execute: function () {
        (function (DiffType) {
          DiffType["removed"] = "removed";
          DiffType["common"] = "common";
          DiffType["added"] = "added";
        })(DiffType || (DiffType = {}));
        exports_10("DiffType", DiffType);
        REMOVED = 1;
        COMMON = 2;
        ADDED = 3;
      },
    };
  },
);
System.register(
  "https://deno.land/std/testing/asserts",
  ["https://deno.land/std/fmt/colors", "https://deno.land/std/testing/diff"],
  function (exports_11, context_11) {
    "use strict";
    var colors_ts_1, diff_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_11 && context_11.id;
    function format(v) {
      let string = Deno.inspect(v);
      if (typeof v == "string") {
        string = `"${string.replace(/(?=["\\])/g, "\\")}"`;
      }
      return string;
    }
    function createColor(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return (s) => colors_ts_1.green(colors_ts_1.bold(s));
        case diff_ts_1.DiffType.removed:
          return (s) => colors_ts_1.red(colors_ts_1.bold(s));
        default:
          return colors_ts_1.white;
      }
    }
    function createSign(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return "+   ";
        case diff_ts_1.DiffType.removed:
          return "-   ";
        default:
          return "    ";
      }
    }
    function buildMessage(diffResult) {
      const messages = [];
      messages.push("");
      messages.push("");
      messages.push(
        `    ${colors_ts_1.gray(colors_ts_1.bold("[Diff]"))} ${
          colors_ts_1.red(colors_ts_1.bold("Actual"))
        } / ${colors_ts_1.green(colors_ts_1.bold("Expected"))}`,
      );
      messages.push("");
      messages.push("");
      diffResult.forEach((result) => {
        const c = createColor(result.type);
        messages.push(c(`${createSign(result.type)}${result.value}`));
      });
      messages.push("");
      return messages;
    }
    function isKeyedCollection(x) {
      return [Symbol.iterator, "size"].every((k) => k in x);
    }
    function equal(c, d) {
      const seen = new Map();
      return (function compare(a, b) {
        // Have to render RegExp & Date for string comparison
        // unless it's mistreated as object
        if (
          a &&
          b &&
          ((a instanceof RegExp && b instanceof RegExp) ||
            (a instanceof Date && b instanceof Date))
        ) {
          return String(a) === String(b);
        }
        if (Object.is(a, b)) {
          return true;
        }
        if (a && typeof a === "object" && b && typeof b === "object") {
          if (seen.get(a) === b) {
            return true;
          }
          if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
            return false;
          }
          if (isKeyedCollection(a) && isKeyedCollection(b)) {
            if (a.size !== b.size) {
              return false;
            }
            let unmatchedEntries = a.size;
            for (const [aKey, aValue] of a.entries()) {
              for (const [bKey, bValue] of b.entries()) {
                /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                if (
                  (aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                  (compare(aKey, bKey) && compare(aValue, bValue))
                ) {
                  unmatchedEntries--;
                }
              }
            }
            return unmatchedEntries === 0;
          }
          const merged = { ...a, ...b };
          for (const key in merged) {
            if (!compare(a && a[key], b && b[key])) {
              return false;
            }
          }
          seen.set(a, b);
          return true;
        }
        return false;
      })(c, d);
    }
    exports_11("equal", equal);
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
      if (!expr) {
        throw new AssertionError(msg);
      }
    }
    exports_11("assert", assert);
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
      if (equal(actual, expected)) {
        return;
      }
      let message = "";
      const actualString = format(actual);
      const expectedString = format(expected);
      try {
        const diffResult = diff_ts_1.default(
          actualString.split("\n"),
          expectedString.split("\n"),
        );
        const diffMsg = buildMessage(diffResult).join("\n");
        message = `Values are not equal:\n${diffMsg}`;
      } catch (e) {
        message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
      }
      if (msg) {
        message = msg;
      }
      throw new AssertionError(message);
    }
    exports_11("assertEquals", assertEquals);
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
      if (!equal(actual, expected)) {
        return;
      }
      let actualString;
      let expectedString;
      try {
        actualString = String(actual);
      } catch (e) {
        actualString = "[Cannot display]";
      }
      try {
        expectedString = String(expected);
      } catch (e) {
        expectedString = "[Cannot display]";
      }
      if (!msg) {
        msg = `actual: ${actualString} expected: ${expectedString}`;
      }
      throw new AssertionError(msg);
    }
    exports_11("assertNotEquals", assertNotEquals);
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
      if (actual === expected) {
        return;
      }
      let message;
      if (msg) {
        message = msg;
      } else {
        const actualString = format(actual);
        const expectedString = format(expected);
        if (actualString === expectedString) {
          const withOffset = actualString
            .split("\n")
            .map((l) => `     ${l}`)
            .join("\n");
          message =
            `Values have the same structure but are not reference-equal:\n\n${
              colors_ts_1.red(withOffset)
            }\n`;
        } else {
          try {
            const diffResult = diff_ts_1.default(
              actualString.split("\n"),
              expectedString.split("\n"),
            );
            const diffMsg = buildMessage(diffResult).join("\n");
            message = `Values are not strictly equal:\n${diffMsg}`;
          } catch (e) {
            message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
          }
        }
      }
      throw new AssertionError(message);
    }
    exports_11("assertStrictEq", assertStrictEq);
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
      if (!actual.includes(expected)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to contains: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_11("assertStrContains", assertStrContains);
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
      const missing = [];
      for (let i = 0; i < expected.length; i++) {
        let found = false;
        for (let j = 0; j < actual.length; j++) {
          if (equal(expected[i], actual[j])) {
            found = true;
            break;
          }
        }
        if (!found) {
          missing.push(expected[i]);
        }
      }
      if (missing.length === 0) {
        return;
      }
      if (!msg) {
        msg = `actual: "${actual}" expected to contains: "${expected}"`;
        msg += "\n";
        msg += `missing: ${missing}`;
      }
      throw new AssertionError(msg);
    }
    exports_11("assertArrayContains", assertArrayContains);
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
      if (!expected.test(actual)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to match: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_11("assertMatch", assertMatch);
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_11("fail", fail);
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_11("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        await fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_11("assertThrowsAsync", assertThrowsAsync);
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
      throw new AssertionError(msg || "unimplemented");
    }
    exports_11("unimplemented", unimplemented);
    /** Use this to assert unreachable code. */
    function unreachable() {
      throw new AssertionError("unreachable");
    }
    exports_11("unreachable", unreachable);
    return {
      setters: [
        function (colors_ts_1_1) {
          colors_ts_1 = colors_ts_1_1;
        },
        function (diff_ts_1_1) {
          diff_ts_1 = diff_ts_1_1;
        },
      ],
      execute: function () {
        CAN_NOT_DISPLAY = "[Cannot display]";
        AssertionError = class AssertionError extends Error {
          constructor(message) {
            super(message);
            this.name = "AssertionError";
          }
        };
        exports_11("AssertionError", AssertionError);
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std/path/win32",
  [
    "https://deno.land/std/path/_constants",
    "https://deno.land/std/path/_util",
    "https://deno.land/std/testing/asserts",
  ],
  function (exports_12, context_12) {
    "use strict";
    var cwd, env, _constants_ts_2, _util_ts_1, asserts_ts_1, sep, delimiter;
    var __moduleName = context_12 && context_12.id;
    function resolve(...pathSegments) {
      let resolvedDevice = "";
      let resolvedTail = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else if (!resolvedDevice) {
          path = cwd();
        } else {
          // Windows has the concept of drive-specific current working
          // directories. If we've resolved a drive letter but not yet an
          // absolute path, get cwd for that drive, or the process cwd if
          // the drive cwd is not available. We're sure the device is not
          // a UNC path at this points, because UNC paths are always absolute.
          path = env.get(`=${resolvedDevice}`) || cwd();
          // Verify that a cwd was found and that it actually points
          // to our drive. If not, default to the drive's root.
          if (
            path === undefined ||
            path.slice(0, 3).toLowerCase() !==
              `${resolvedDevice.toLowerCase()}\\`
          ) {
            path = `${resolvedDevice}\\`;
          }
        }
        _util_ts_1.assertPath(path);
        const len = path.length;
        // Skip empty entries
        if (len === 0) {
          continue;
        }
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
          if (_util_ts_1.isPathSeparator(code)) {
            // Possible UNC root
            // If we started with a separator, we know we at least have an
            // absolute path of some kind (UNC or otherwise)
            isAbsolute = true;
            if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
              // Matched double path separator at beginning
              let j = 2;
              let last = j;
              // Match 1 or more non-path separators
              for (; j < len; ++j) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                const firstPart = path.slice(last, j);
                // Matched!
                last = j;
                // Match 1 or more path separators
                for (; j < len; ++j) {
                  if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j < len && j !== last) {
                  // Matched!
                  last = j;
                  // Match 1 or more non-path separators
                  for (; j < len; ++j) {
                    if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                      break;
                    }
                  }
                  if (j === len) {
                    // We matched a UNC root only
                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                    rootEnd = j;
                  } else if (j !== last) {
                    // We matched a UNC root with leftovers
                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                    rootEnd = j;
                  }
                }
              }
            } else {
              rootEnd = 1;
            }
          } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
            // Possible device root
            if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
              device = path.slice(0, 2);
              rootEnd = 2;
              if (len > 2) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                  // Treat separator following drive name as an absolute path
                  // indicator
                  isAbsolute = true;
                  rootEnd = 3;
                }
              }
            }
          }
        } else if (_util_ts_1.isPathSeparator(code)) {
          // `path` contains just a path separator
          rootEnd = 1;
          isAbsolute = true;
        }
        if (
          device.length > 0 &&
          resolvedDevice.length > 0 &&
          device.toLowerCase() !== resolvedDevice.toLowerCase()
        ) {
          // This path points to another device so it is not applicable
          continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
          resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
          resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
          resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) {
          break;
        }
      }
      // At this point the path should be resolved to a full absolute path,
      // but handle relative paths to be safe (might happen when process.cwd()
      // fails)
      // Normalize the tail path
      resolvedTail = _util_ts_1.normalizeString(
        resolvedTail,
        !resolvedAbsolute,
        "\\",
        _util_ts_1.isPathSeparator,
      );
      return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail ||
        ".";
    }
    exports_12("resolve", resolve);
    function normalize(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = 0;
      let device;
      let isAbsolute = false;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          // If we started with a separator, we know we at least have an absolute
          // path of some kind (UNC or otherwise)
          isAbsolute = true;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              const firstPart = path.slice(last, j);
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  // Return the normalized version of the UNC root since there
                  // is nothing left to process
                  return `\\\\${firstPart}\\${path.slice(last)}\\`;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                  rootEnd = j;
                }
              }
            }
          } else {
            rootEnd = 1;
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            device = path.slice(0, 2);
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                // Treat separator following drive name as an absolute path
                // indicator
                isAbsolute = true;
                rootEnd = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid unnecessary
        // work
        return "\\";
      }
      let tail;
      if (rootEnd < len) {
        tail = _util_ts_1.normalizeString(
          path.slice(rootEnd),
          !isAbsolute,
          "\\",
          _util_ts_1.isPathSeparator,
        );
      } else {
        tail = "";
      }
      if (tail.length === 0 && !isAbsolute) {
        tail = ".";
      }
      if (
        tail.length > 0 &&
        _util_ts_1.isPathSeparator(path.charCodeAt(len - 1))
      ) {
        tail += "\\";
      }
      if (device === undefined) {
        if (isAbsolute) {
          if (tail.length > 0) {
            return `\\${tail}`;
          } else {
            return "\\";
          }
        } else if (tail.length > 0) {
          return tail;
        } else {
          return "";
        }
      } else if (isAbsolute) {
        if (tail.length > 0) {
          return `${device}\\${tail}`;
        } else {
          return `${device}\\`;
        }
      } else if (tail.length > 0) {
        return device + tail;
      } else {
        return device;
      }
    }
    exports_12("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return false;
      }
      const code = path.charCodeAt(0);
      if (_util_ts_1.isPathSeparator(code)) {
        return true;
      } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
        // Possible device root
        if (len > 2 && path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
            return true;
          }
        }
      }
      return false;
    }
    exports_12("isAbsolute", isAbsolute);
    function join(...paths) {
      const pathsCount = paths.length;
      if (pathsCount === 0) {
        return ".";
      }
      let joined;
      let firstPart = null;
      for (let i = 0; i < pathsCount; ++i) {
        const path = paths[i];
        _util_ts_1.assertPath(path);
        if (path.length > 0) {
          if (joined === undefined) {
            joined = firstPart = path;
          } else {
            joined += `\\${path}`;
          }
        }
      }
      if (joined === undefined) {
        return ".";
      }
      // Make sure that the joined path doesn't start with two slashes, because
      // normalize() will mistake it for an UNC path then.
      //
      // This step is skipped when it is very clear that the user actually
      // intended to point at an UNC path. This is assumed when the first
      // non-empty string arguments starts with exactly two slashes followed by
      // at least one more non-slash character.
      //
      // Note that for normalize() to treat a path as an UNC path it needs to
      // have at least 2 components, so we don't filter for that here.
      // This means that the user can use join to construct UNC paths from
      // a server name and a share name; for example:
      //   path.join('//server', 'share') -> '\\\\server\\share\\')
      let needsReplace = true;
      let slashCount = 0;
      asserts_ts_1.assert(firstPart != null);
      if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
          if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
            ++slashCount;
            if (firstLen > 2) {
              if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(2))) {
                ++slashCount;
              } else {
                // We matched a UNC path in the first part
                needsReplace = false;
              }
            }
          }
        }
      }
      if (needsReplace) {
        // Find any more consecutive slashes we need to replace
        for (; slashCount < joined.length; ++slashCount) {
          if (!_util_ts_1.isPathSeparator(joined.charCodeAt(slashCount))) {
            break;
          }
        }
        // Replace the slashes if needed
        if (slashCount >= 2) {
          joined = `\\${joined.slice(slashCount)}`;
        }
      }
      return normalize(joined);
    }
    exports_12("join", join);
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
      _util_ts_1.assertPath(from);
      _util_ts_1.assertPath(to);
      if (from === to) {
        return "";
      }
      const fromOrig = resolve(from);
      const toOrig = resolve(to);
      if (fromOrig === toOrig) {
        return "";
      }
      from = fromOrig.toLowerCase();
      to = toOrig.toLowerCase();
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 0;
      let fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (
          from.charCodeAt(fromStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; fromEnd - 1 > fromStart; --fromEnd) {
        if (
          from.charCodeAt(fromEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 0;
      let toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; toEnd - 1 > toStart; --toEnd) {
        if (to.charCodeAt(toEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
              return toOrig.slice(toStart + i + 1);
            } else if (i === 2) {
              // We get here if `from` is the device root.
              // For example: from='C:\\'; to='C:\\foo'
              return toOrig.slice(toStart + i);
            }
          }
          if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo'
              lastCommonSep = i;
            } else if (i === 2) {
              // We get here if `to` is the device root.
              // For example: from='C:\\foo\\bar'; to='C:\\'
              lastCommonSep = 3;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_2.CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      // We found a mismatch before the first common path separator was seen, so
      // return the original `to`.
      if (i !== length && lastCommonSep === -1) {
        return toOrig;
      }
      let out = "";
      if (lastCommonSep === -1) {
        lastCommonSep = 0;
      }
      // Generate the relative path based on the path difference between `to` and
      // `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "\\..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
      } else {
        toStart += lastCommonSep;
        if (
          toOrig.charCodeAt(toStart) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          ++toStart;
        }
        return toOrig.slice(toStart, toEnd);
      }
    }
    exports_12("relative", relative);
    function toNamespacedPath(path) {
      // Note: this will *probably* throw somewhere.
      if (typeof path !== "string") {
        return path;
      }
      if (path.length === 0) {
        return "";
      }
      const resolvedPath = resolve(path);
      if (resolvedPath.length >= 3) {
        if (
          resolvedPath.charCodeAt(0) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          // Possible UNC root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            const code = resolvedPath.charCodeAt(2);
            if (
              code !== _constants_ts_2.CHAR_QUESTION_MARK &&
              code !== _constants_ts_2.CHAR_DOT
            ) {
              // Matched non-long UNC root, convert the path to a long UNC path
              return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
          // Possible device root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
            resolvedPath.charCodeAt(2) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            // Matched device root, convert the path to a long UNC path
            return `\\\\?\\${resolvedPath}`;
          }
        }
      }
      return path;
    }
    exports_12("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = -1;
      let end = -1;
      let matchedSlash = true;
      let offset = 0;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = offset = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  return path;
                }
                if (j !== last) {
                  // We matched a UNC root with leftovers
                  // Offset by 1 to include the separator after the UNC root to
                  // treat it as a "normal root" on top of a (UNC) root
                  rootEnd = offset = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = offset = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                rootEnd = offset = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        return path;
      }
      for (let i = len - 1; i >= offset; --i) {
        if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        if (rootEnd === -1) {
          return ".";
        } else {
          end = rootEnd;
        }
      }
      return path.slice(0, end);
    }
    exports_12("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_1.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (_util_ts_1.isWindowsDeviceRoot(drive)) {
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            start = 2;
          }
        }
      }
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (_util_ts_1.isPathSeparator(code)) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= start; --i) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_12("basename", basename);
    function extname(path) {
      _util_ts_1.assertPath(path);
      let start = 0;
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (
        path.length >= 2 &&
        path.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
        _util_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))
      ) {
        start = startPart = 2;
      }
      for (let i = path.length - 1; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_12("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_1._format("\\", pathObject);
    }
    exports_12("format", format);
    function parse(path) {
      _util_ts_1.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      const len = path.length;
      if (len === 0) {
        return ret;
      }
      let rootEnd = 0;
      let code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  rootEnd = j;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  rootEnd = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                if (len === 3) {
                  // `path` contains just a drive root, exit early to avoid
                  // unnecessary work
                  ret.root = ret.dir = path;
                  return ret;
                }
                rootEnd = 3;
              }
            } else {
              // `path` contains just a drive root, exit early to avoid
              // unnecessary work
              ret.root = ret.dir = path;
              return ret;
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        ret.root = ret.dir = path;
        return ret;
      }
      if (rootEnd > 0) {
        ret.root = path.slice(0, rootEnd);
      }
      let startDot = -1;
      let startPart = rootEnd;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
      }
      // If the directory is the root, use the entire root as the `dir` including
      // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
      // trailing slash (`C:\abc\def` -> `C:\abc`).
      if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
      } else {
        ret.dir = ret.root;
      }
      return ret;
    }
    exports_12("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///C:/Users/foo"); // "C:\\Users\\foo"
     *      fromFileUrl("file:///home/foo"); // "\\home\\foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname
        .replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/")
        .replace(/\//g, "\\");
    }
    exports_12("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_2_1) {
          _constants_ts_2 = _constants_ts_2_1;
        },
        function (_util_ts_1_1) {
          _util_ts_1 = _util_ts_1_1;
        },
        function (asserts_ts_1_1) {
          asserts_ts_1 = asserts_ts_1_1;
        },
      ],
      execute: function () {
        cwd = Deno.cwd, env = Deno.env;
        exports_12("sep", sep = "\\");
        exports_12("delimiter", delimiter = ";");
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std/path/posix",
  ["https://deno.land/std/path/_constants", "https://deno.land/std/path/_util"],
  function (exports_13, context_13) {
    "use strict";
    var cwd, _constants_ts_3, _util_ts_2, sep, delimiter;
    var __moduleName = context_13 && context_13.id;
    // path.resolve([from ...], to)
    function resolve(...pathSegments) {
      let resolvedPath = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else {
          path = cwd();
        }
        _util_ts_2.assertPath(path);
        // Skip empty entries
        if (path.length === 0) {
          continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute =
          path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      // Normalize the path
      resolvedPath = _util_ts_2.normalizeString(
        resolvedPath,
        !resolvedAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (resolvedAbsolute) {
        if (resolvedPath.length > 0) {
          return `/${resolvedPath}`;
        } else {
          return "/";
        }
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return ".";
      }
    }
    exports_13("resolve", resolve);
    function normalize(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      const trailingSeparator =
        path.charCodeAt(path.length - 1) === _constants_ts_3.CHAR_FORWARD_SLASH;
      // Normalize the path
      path = _util_ts_2.normalizeString(
        path,
        !isAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (path.length === 0 && !isAbsolute) {
        path = ".";
      }
      if (path.length > 0 && trailingSeparator) {
        path += "/";
      }
      if (isAbsolute) {
        return `/${path}`;
      }
      return path;
    }
    exports_13("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_2.assertPath(path);
      return path.length > 0 &&
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports_13("isAbsolute", isAbsolute);
    function join(...paths) {
      if (paths.length === 0) {
        return ".";
      }
      let joined;
      for (let i = 0, len = paths.length; i < len; ++i) {
        const path = paths[i];
        _util_ts_2.assertPath(path);
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `/${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalize(joined);
    }
    exports_13("join", join);
    function relative(from, to) {
      _util_ts_2.assertPath(from);
      _util_ts_2.assertPath(to);
      if (from === to) {
        return "";
      }
      from = resolve(from);
      to = resolve(to);
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 1;
      const fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (from.charCodeAt(fromStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 1;
      const toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='/foo/bar'; to='/foo/bar/baz'
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              // We get here if `from` is the root
              // For example: from='/'; to='/foo'
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='/foo/bar/baz'; to='/foo/bar'
              lastCommonSep = i;
            } else if (i === 0) {
              // We get here if `to` is the root.
              // For example: from='/foo'; to='/'
              lastCommonSep = 0;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_3.CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      let out = "";
      // Generate the relative path based on the path difference between `to`
      // and `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "/..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + to.slice(toStart + lastCommonSep);
      } else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          ++toStart;
        }
        return to.slice(toStart);
      }
    }
    exports_13("relative", relative);
    function toNamespacedPath(path) {
      // Non-op on posix systems
      return path;
    }
    exports_13("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const hasRoot = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let end = -1;
      let matchedSlash = true;
      for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        return hasRoot ? "/" : ".";
      }
      if (hasRoot && end === 1) {
        return "//";
      }
      return path.slice(0, end);
    }
    exports_13("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_2.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= 0; --i) {
          if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_13("basename", basename);
    function extname(path) {
      _util_ts_2.assertPath(path);
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      for (let i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_13("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_2._format("/", pathObject);
    }
    exports_13("format", format);
    function parse(path) {
      _util_ts_2.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute) {
            ret.base = ret.name = path.slice(1, end);
          } else {
            ret.base = ret.name = path.slice(startPart, end);
          }
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(1, startDot);
          ret.base = path.slice(1, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }
      if (startPart > 0) {
        ret.dir = path.slice(0, startPart - 1);
      } else if (isAbsolute) {
        ret.dir = "/";
      }
      return ret;
    }
    exports_13("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///home/foo"); // "/home/foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname;
    }
    exports_13("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_3_1) {
          _constants_ts_3 = _constants_ts_3_1;
        },
        function (_util_ts_2_1) {
          _util_ts_2 = _util_ts_2_1;
        },
      ],
      execute: function () {
        cwd = Deno.cwd;
        exports_13("sep", sep = "/");
        exports_13("delimiter", delimiter = ":");
      },
    };
  },
);
System.register(
  "https://deno.land/std/path/separator",
  [],
  function (exports_14, context_14) {
    "use strict";
    var isWindows, SEP, SEP_PATTERN;
    var __moduleName = context_14 && context_14.id;
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        isWindows = Deno.build.os == "windows";
        exports_14("SEP", SEP = isWindows ? "\\" : "/");
        exports_14("SEP_PATTERN", SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/);
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std/path/common",
  ["https://deno.land/std/path/separator"],
  function (exports_15, context_15) {
    "use strict";
    var separator_ts_1;
    var __moduleName = context_15 && context_15.id;
    /** Determines the common path from a set of paths, using an optional separator,
     * which defaults to the OS default separator.
     *
     *       import { common } from "https://deno.land/std/path/mod.ts";
     *       const p = common([
     *         "./deno/std/path/mod.ts",
     *         "./deno/std/fs/mod.ts",
     *       ]);
     *       console.log(p); // "./deno/std/"
     *
     */
    function common(paths, sep = separator_ts_1.SEP) {
      const [first = "", ...remaining] = paths;
      if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep) + 1);
      }
      const parts = first.split(sep);
      let endOfPrefix = parts.length;
      for (const path of remaining) {
        const compare = path.split(sep);
        for (let i = 0; i < endOfPrefix; i++) {
          if (compare[i] !== parts[i]) {
            endOfPrefix = i;
          }
        }
        if (endOfPrefix === 0) {
          return "";
        }
      }
      const prefix = parts.slice(0, endOfPrefix).join(sep);
      return prefix.endsWith(sep) ? prefix : `${prefix}${sep}`;
    }
    exports_15("common", common);
    return {
      setters: [
        function (separator_ts_1_1) {
          separator_ts_1 = separator_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
System.register(
  "https://deno.land/std/path/_globrex",
  [],
  function (exports_16, context_16) {
    "use strict";
    var isWin,
      SEP,
      SEP_ESC,
      SEP_RAW,
      GLOBSTAR,
      WILDCARD,
      GLOBSTAR_SEGMENT,
      WILDCARD_SEGMENT;
    var __moduleName = context_16 && context_16.id;
    /**
     * Convert any glob pattern to a JavaScript Regexp object
     * @param glob Glob pattern to convert
     * @param opts Configuration object
     * @returns Converted object with string, segments and RegExp object
     */
    function globrex(
      glob,
      {
        extended = false,
        globstar = false,
        strict = false,
        filepath = false,
        flags = "",
      } = {},
    ) {
      const sepPattern = new RegExp(`^${SEP}${strict ? "" : "+"}$`);
      let regex = "";
      let segment = "";
      let pathRegexStr = "";
      const pathSegments = [];
      // If we are doing extended matching, this boolean is true when we are inside
      // a group (eg {*.html,*.js}), and false otherwise.
      let inGroup = false;
      let inRange = false;
      // extglob stack. Keep track of scope
      const ext = [];
      // Helper function to build string and segments
      function add(str, options = { split: false, last: false, only: "" }) {
        const { split, last, only } = options;
        if (only !== "path") {
          regex += str;
        }
        if (filepath && only !== "regex") {
          pathRegexStr += str.match(sepPattern) ? SEP : str;
          if (split) {
            if (last) {
              segment += str;
            }
            if (segment !== "") {
              // change it 'includes'
              if (!flags.includes("g")) {
                segment = `^${segment}$`;
              }
              pathSegments.push(new RegExp(segment, flags));
            }
            segment = "";
          } else {
            segment += str;
          }
        }
      }
      let c, n;
      for (let i = 0; i < glob.length; i++) {
        c = glob[i];
        n = glob[i + 1];
        if (["\\", "$", "^", ".", "="].includes(c)) {
          add(`\\${c}`);
          continue;
        }
        if (c.match(sepPattern)) {
          add(SEP, { split: true });
          if (n != null && n.match(sepPattern) && !strict) {
            regex += "?";
          }
          continue;
        }
        if (c === "(") {
          if (ext.length) {
            add(`${c}?:`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ")") {
          if (ext.length) {
            add(c);
            const type = ext.pop();
            if (type === "@") {
              add("{1}");
            } else if (type === "!") {
              add(WILDCARD);
            } else {
              add(type);
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "|") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "+") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "@" && extended) {
          if (n === "(") {
            ext.push(c);
            continue;
          }
        }
        if (c === "!") {
          if (extended) {
            if (inRange) {
              add("^");
              continue;
            }
            if (n === "(") {
              ext.push(c);
              add("(?!");
              i++;
              continue;
            }
            add(`\\${c}`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "?") {
          if (extended) {
            if (n === "(") {
              ext.push(c);
            } else {
              add(".");
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "[") {
          if (inRange && n === ":") {
            i++; // skip [
            let value = "";
            while (glob[++i] !== ":") {
              value += glob[i];
            }
            if (value === "alnum") {
              add("(?:\\w|\\d)");
            } else if (value === "space") {
              add("\\s");
            } else if (value === "digit") {
              add("\\d");
            }
            i++; // skip last ]
            continue;
          }
          if (extended) {
            inRange = true;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "]") {
          if (extended) {
            inRange = false;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "{") {
          if (extended) {
            inGroup = true;
            add("(?:");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "}") {
          if (extended) {
            inGroup = false;
            add(")");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ",") {
          if (inGroup) {
            add("|");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "*") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          // Move over all consecutive "*"'s.
          // Also store the previous and next characters
          const prevChar = glob[i - 1];
          let starCount = 1;
          while (glob[i + 1] === "*") {
            starCount++;
            i++;
          }
          const nextChar = glob[i + 1];
          if (!globstar) {
            // globstar is disabled, so treat any number of "*" as one
            add(".*");
          } else {
            // globstar is enabled, so determine if this is a globstar segment
            const isGlobstar = starCount > 1 && // multiple "*"'s
              // from the start of the segment
              [SEP_RAW, "/", undefined].includes(prevChar) &&
              // to the end of the segment
              [SEP_RAW, "/", undefined].includes(nextChar);
            if (isGlobstar) {
              // it's a globstar, so match zero or more path segments
              add(GLOBSTAR, { only: "regex" });
              add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
              i++; // move over the "/"
            } else {
              // it's not a globstar, so only match one path segment
              add(WILDCARD, { only: "regex" });
              add(WILDCARD_SEGMENT, { only: "path" });
            }
          }
          continue;
        }
        add(c);
      }
      // When regexp 'g' flag is specified don't
      // constrain the regular expression with ^ & $
      if (!flags.includes("g")) {
        regex = `^${regex}$`;
        segment = `^${segment}$`;
        if (filepath) {
          pathRegexStr = `^${pathRegexStr}$`;
        }
      }
      const result = { regex: new RegExp(regex, flags) };
      // Push the last segment
      if (filepath) {
        pathSegments.push(new RegExp(segment, flags));
        result.path = {
          regex: new RegExp(pathRegexStr, flags),
          segments: pathSegments,
          globstar: new RegExp(
            !flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT,
            flags,
          ),
        };
      }
      return result;
    }
    exports_16("globrex", globrex);
    return {
      setters: [],
      execute: function () {
        isWin = Deno.build.os === "windows";
        SEP = isWin ? `(?:\\\\|\\/)` : `\\/`;
        SEP_ESC = isWin ? `\\\\` : `/`;
        SEP_RAW = isWin ? `\\` : `/`;
        GLOBSTAR = `(?:(?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD = `(?:[^${SEP_ESC}/]*)`;
        GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD_SEGMENT = `(?:[^${SEP_ESC}/]*)`;
      },
    };
  },
);
System.register(
  "https://deno.land/std/path/glob",
  [
    "https://deno.land/std/path/separator",
    "https://deno.land/std/path/_globrex",
    "https://deno.land/std/path/mod",
    "https://deno.land/std/testing/asserts",
  ],
  function (exports_17, context_17) {
    "use strict";
    var separator_ts_2, _globrex_ts_1, mod_ts_1, asserts_ts_2;
    var __moduleName = context_17 && context_17.id;
    /**
     * Generate a regex based on glob pattern and options
     * This was meant to be using the the `fs.walk` function
     * but can be used anywhere else.
     * Examples:
     *
     *     Looking for all the `ts` files:
     *     walkSync(".", {
     *       match: [globToRegExp("*.ts")]
     *     })
     *
     *     Looking for all the `.json` files in any subfolder:
     *     walkSync(".", {
     *       match: [globToRegExp(join("a", "**", "*.json"),{
     *         flags: "g",
     *         extended: true,
     *         globstar: true
     *       })]
     *     })
     *
     * @param glob - Glob pattern to be used
     * @param options - Specific options for the glob pattern
     * @returns A RegExp for the glob pattern
     */
    function globToRegExp(glob, { extended = false, globstar = true } = {}) {
      const result = _globrex_ts_1.globrex(glob, {
        extended,
        globstar,
        strict: false,
        filepath: true,
      });
      asserts_ts_2.assert(result.path != null);
      return result.path.regex;
    }
    exports_17("globToRegExp", globToRegExp);
    /** Test whether the given string is a glob */
    function isGlob(str) {
      const chars = { "{": "}", "(": ")", "[": "]" };
      /* eslint-disable-next-line max-len */
      const regex =
        /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
      if (str === "") {
        return false;
      }
      let match;
      while ((match = regex.exec(str))) {
        if (match[2]) {
          return true;
        }
        let idx = match.index + match[0].length;
        // if an open bracket/brace/paren is escaped,
        // set the index to the next closing character
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
          const n = str.indexOf(close, idx);
          if (n !== -1) {
            idx = n + 1;
          }
        }
        str = str.slice(idx);
      }
      return false;
    }
    exports_17("isGlob", isGlob);
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, { globstar = false } = {}) {
      if (!!glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
      }
      if (!globstar) {
        return mod_ts_1.normalize(glob);
      }
      const s = separator_ts_2.SEP_PATTERN.source;
      const badParentPattern = new RegExp(
        `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
        "g",
      );
      return mod_ts_1.normalize(glob.replace(badParentPattern, "\0")).replace(
        /\0/g,
        "..",
      );
    }
    exports_17("normalizeGlob", normalizeGlob);
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
      if (!globstar || globs.length == 0) {
        return mod_ts_1.join(...globs);
      }
      if (globs.length === 0) {
        return ".";
      }
      let joined;
      for (const glob of globs) {
        const path = glob;
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `${separator_ts_2.SEP}${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalizeGlob(joined, { extended, globstar });
    }
    exports_17("joinGlobs", joinGlobs);
    return {
      setters: [
        function (separator_ts_2_1) {
          separator_ts_2 = separator_ts_2_1;
        },
        function (_globrex_ts_1_1) {
          _globrex_ts_1 = _globrex_ts_1_1;
        },
        function (mod_ts_1_1) {
          mod_ts_1 = mod_ts_1_1;
        },
        function (asserts_ts_2_1) {
          asserts_ts_2 = asserts_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std/path/mod",
  [
    "https://deno.land/std/path/win32",
    "https://deno.land/std/path/posix",
    "https://deno.land/std/path/common",
    "https://deno.land/std/path/separator",
    "https://deno.land/std/path/interface",
    "https://deno.land/std/path/glob",
  ],
  function (exports_18, context_18) {
    "use strict";
    var _win32,
      _posix,
      isWindows,
      path,
      win32,
      posix,
      basename,
      delimiter,
      dirname,
      extname,
      format,
      fromFileUrl,
      isAbsolute,
      join,
      normalize,
      parse,
      relative,
      resolve,
      sep,
      toNamespacedPath;
    var __moduleName = context_18 && context_18.id;
    var exportedNames_1 = {
      "win32": true,
      "posix": true,
      "basename": true,
      "delimiter": true,
      "dirname": true,
      "extname": true,
      "format": true,
      "fromFileUrl": true,
      "isAbsolute": true,
      "join": true,
      "normalize": true,
      "parse": true,
      "relative": true,
      "resolve": true,
      "sep": true,
      "toNamespacedPath": true,
      "SEP": true,
      "SEP_PATTERN": true,
    };
    function exportStar_1(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) {
          exports[n] = m[n];
        }
      }
      exports_18(exports);
    }
    return {
      setters: [
        function (_win32_1) {
          _win32 = _win32_1;
        },
        function (_posix_1) {
          _posix = _posix_1;
        },
        function (common_ts_1_1) {
          exportStar_1(common_ts_1_1);
        },
        function (separator_ts_3_1) {
          exports_18({
            "SEP": separator_ts_3_1["SEP"],
            "SEP_PATTERN": separator_ts_3_1["SEP_PATTERN"],
          });
        },
        function (interface_ts_1_1) {
          exportStar_1(interface_ts_1_1);
        },
        function (glob_ts_1_1) {
          exportStar_1(glob_ts_1_1);
        },
      ],
      execute: function () {
        isWindows = Deno.build.os == "windows";
        path = isWindows ? _win32 : _posix;
        exports_18("win32", win32 = _win32);
        exports_18("posix", posix = _posix);
        exports_18("basename", basename = path.basename),
          exports_18("delimiter", delimiter = path.delimiter),
          exports_18("dirname", dirname = path.dirname),
          exports_18("extname", extname = path.extname),
          exports_18("format", format = path.format),
          exports_18("fromFileUrl", fromFileUrl = path.fromFileUrl),
          exports_18("isAbsolute", isAbsolute = path.isAbsolute),
          exports_18("join", join = path.join),
          exports_18("normalize", normalize = path.normalize),
          exports_18("parse", parse = path.parse),
          exports_18("relative", relative = path.relative),
          exports_18("resolve", resolve = path.resolve),
          exports_18("sep", sep = path.sep),
          exports_18(
            "toNamespacedPath",
            toNamespacedPath = path.toNamespacedPath,
          );
      },
    };
  },
);
System.register(
  "file:///C:/Users/KK/Documents/misc/ts-percentage/src/cli",
  [
    "file:///C:/Users/KK/Documents/misc/ts-percentage/src/util",
    "file:///C:/Users/KK/Documents/misc/ts-percentage/src/flags/index",
    "https://deno.land/std/path/mod",
  ],
  function (exports_19, context_19) {
    "use strict";
    var util_ts_2, index_ts_1, path, processFlags, operators, readDir;
    var __moduleName = context_19 && context_19.id;
    return {
      setters: [
        function (util_ts_2_1) {
          util_ts_2 = util_ts_2_1;
        },
        function (index_ts_1_1) {
          index_ts_1 = index_ts_1_1;
        },
        function (path_1) {
          path = path_1;
        },
      ],
      execute: function () {
        processFlags = util_ts_2.readArgs(Deno.args);
        operators = index_ts_1.default(processFlags);
        if (!processFlags.src?.length) {
          console.log(new Error("No --src flag provided"));
          Deno.exit(1);
        }
        readDir = (count, dir) =>
          new Promise(async (resolve, reject) => {
            const resolvedDir = path.resolve(dir);
            let directory = Deno.readDir(resolvedDir);
            try {
              for await (let entity of directory) {
                if (entity.isFile) {
                  count = (await operators.src?.count?.(count, entity.name)) ??
                    count;
                  count =
                    (await operators["only-javascript"]?.total?.(
                      count,
                      entity.name,
                    )) ?? { ...count, total: count.total + 1 };
                } else {
                  const nextDir = `${resolvedDir}/${entity.name}`;
                  count = await readDir(count, nextDir);
                }
              }
            } catch (e) {
              reject(`Error reading directory: ${dir}`);
            }
            return resolve(count);
          });
        util_ts_2.reduceAsync(
          processFlags.src,
          readDir,
          { success: 0, total: 0 },
        )
          .then(({ success, total }) => {
            console.log(util_ts_2.colours.green("Ô£ö´©Å ts-percentage complete"));
            console.log(util_ts_2.colours.yellow("TS files:"), success);
            console.log(util_ts_2.colours.yellow("Total # of files:"), total);
            console.log(
              util_ts_2.colours.yellow("Percentage:"),
              `${Math.floor((success * 100) / total)}%`,
            );
          })
          .catch(console.error);
      },
    };
  },
);

__instantiate("file:///C:/Users/KK/Documents/misc/ts-percentage/src/cli");

