var uu = Object.defineProperty, lu = Object.defineProperties;
var du = Object.getOwnPropertyDescriptors;
var ra = Object.getOwnPropertySymbols;
var cu = Object.prototype.hasOwnProperty, vu = Object.prototype.propertyIsEnumerable;
var me = Math.pow, ia = (a, n, o) => n in a ? uu(a, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : a[n] = o, ni = (a, n) => {
  for (var o in n || (n = {}))
    cu.call(n, o) && ia(a, o, n[o]);
  if (ra)
    for (var o of ra(n))
      vu.call(n, o) && ia(a, o, n[o]);
  return a;
}, cf = (a, n) => lu(a, du(n));
var Ie = (a, n, o) => new Promise((s, m) => {
  var f = (S) => {
    try {
      y(o.next(S));
    } catch (B) {
      m(B);
    }
  }, g = (S) => {
    try {
      y(o.throw(S));
    } catch (B) {
      m(B);
    }
  }, y = (S) => S.done ? s(S.value) : Promise.resolve(S.value).then(f, g);
  y((o = o.apply(a, n)).next());
});
var Xt = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function pu(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
function mu(a) {
  if (a.__esModule)
    return a;
  var n = a.default;
  if (typeof n == "function") {
    var o = function s() {
      return this instanceof s ? Reflect.construct(n, arguments, this.constructor) : n.apply(this, arguments);
    };
    o.prototype = n.prototype;
  } else
    o = {};
  return Object.defineProperty(o, "__esModule", { value: !0 }), Object.keys(a).forEach(function(s) {
    var m = Object.getOwnPropertyDescriptor(a, s);
    Object.defineProperty(o, s, m.get ? m : {
      enumerable: !0,
      get: function() {
        return a[s];
      }
    });
  }), o;
}
var br = {}, Cn = {};
Cn.byteLength = yu;
Cn.toByteArray = Mu;
Cn.fromByteArray = Su;
var sr = [], He = [], gu = typeof Uint8Array != "undefined" ? Uint8Array : Array, vf = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var fi = 0, bu = vf.length; fi < bu; ++fi)
  sr[fi] = vf[fi], He[vf.charCodeAt(fi)] = fi;
He["-".charCodeAt(0)] = 62;
He["_".charCodeAt(0)] = 63;
function Ah(a) {
  var n = a.length;
  if (n % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var o = a.indexOf("=");
  o === -1 && (o = n);
  var s = o === n ? 0 : 4 - o % 4;
  return [o, s];
}
function yu(a) {
  var n = Ah(a), o = n[0], s = n[1];
  return (o + s) * 3 / 4 - s;
}
function wu(a, n, o) {
  return (n + o) * 3 / 4 - o;
}
function Mu(a) {
  var n, o = Ah(a), s = o[0], m = o[1], f = new gu(wu(a, s, m)), g = 0, y = m > 0 ? s - 4 : s, S;
  for (S = 0; S < y; S += 4)
    n = He[a.charCodeAt(S)] << 18 | He[a.charCodeAt(S + 1)] << 12 | He[a.charCodeAt(S + 2)] << 6 | He[a.charCodeAt(S + 3)], f[g++] = n >> 16 & 255, f[g++] = n >> 8 & 255, f[g++] = n & 255;
  return m === 2 && (n = He[a.charCodeAt(S)] << 2 | He[a.charCodeAt(S + 1)] >> 4, f[g++] = n & 255), m === 1 && (n = He[a.charCodeAt(S)] << 10 | He[a.charCodeAt(S + 1)] << 4 | He[a.charCodeAt(S + 2)] >> 2, f[g++] = n >> 8 & 255, f[g++] = n & 255), f;
}
function xu(a) {
  return sr[a >> 18 & 63] + sr[a >> 12 & 63] + sr[a >> 6 & 63] + sr[a & 63];
}
function _u(a, n, o) {
  for (var s, m = [], f = n; f < o; f += 3)
    s = (a[f] << 16 & 16711680) + (a[f + 1] << 8 & 65280) + (a[f + 2] & 255), m.push(xu(s));
  return m.join("");
}
function Su(a) {
  for (var n, o = a.length, s = o % 3, m = [], f = 16383, g = 0, y = o - s; g < y; g += f)
    m.push(_u(a, g, g + f > y ? y : g + f));
  return s === 1 ? (n = a[o - 1], m.push(
    sr[n >> 2] + sr[n << 4 & 63] + "=="
  )) : s === 2 && (n = (a[o - 2] << 8) + a[o - 1], m.push(
    sr[n >> 10] + sr[n >> 4 & 63] + sr[n << 2 & 63] + "="
  )), m.join("");
}
var M0 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
M0.read = function(a, n, o, s, m) {
  var f, g, y = m * 8 - s - 1, S = (1 << y) - 1, B = S >> 1, M = -7, x = o ? m - 1 : 0, I = o ? -1 : 1, k = a[n + x];
  for (x += I, f = k & (1 << -M) - 1, k >>= -M, M += y; M > 0; f = f * 256 + a[n + x], x += I, M -= 8)
    ;
  for (g = f & (1 << -M) - 1, f >>= -M, M += s; M > 0; g = g * 256 + a[n + x], x += I, M -= 8)
    ;
  if (f === 0)
    f = 1 - B;
  else {
    if (f === S)
      return g ? NaN : (k ? -1 : 1) * (1 / 0);
    g = g + Math.pow(2, s), f = f - B;
  }
  return (k ? -1 : 1) * g * Math.pow(2, f - s);
};
M0.write = function(a, n, o, s, m, f) {
  var g, y, S, B = f * 8 - m - 1, M = (1 << B) - 1, x = M >> 1, I = m === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, k = s ? 0 : f - 1, D = s ? 1 : -1, U = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
  for (n = Math.abs(n), isNaN(n) || n === 1 / 0 ? (y = isNaN(n) ? 1 : 0, g = M) : (g = Math.floor(Math.log(n) / Math.LN2), n * (S = Math.pow(2, -g)) < 1 && (g--, S *= 2), g + x >= 1 ? n += I / S : n += I * Math.pow(2, 1 - x), n * S >= 2 && (g++, S /= 2), g + x >= M ? (y = 0, g = M) : g + x >= 1 ? (y = (n * S - 1) * Math.pow(2, m), g = g + x) : (y = n * Math.pow(2, x - 1) * Math.pow(2, m), g = 0)); m >= 8; a[o + k] = y & 255, k += D, y /= 256, m -= 8)
    ;
  for (g = g << m | y, B += m; B > 0; a[o + k] = g & 255, k += D, g /= 256, B -= 8)
    ;
  a[o + k - D] |= U * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(a) {
  const n = Cn, o = M0, s = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  a.Buffer = y, a.SlowBuffer = $, a.INSPECT_MAX_BYTES = 50;
  const m = 2147483647;
  a.kMaxLength = m, y.TYPED_ARRAY_SUPPORT = f(), !y.TYPED_ARRAY_SUPPORT && typeof console != "undefined" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function f() {
    try {
      const E = new Uint8Array(1), w = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(w, Uint8Array.prototype), Object.setPrototypeOf(E, w), E.foo() === 42;
    } catch (E) {
      return !1;
    }
  }
  Object.defineProperty(y.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (y.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(y.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (y.isBuffer(this))
        return this.byteOffset;
    }
  });
  function g(E) {
    if (E > m)
      throw new RangeError('The value "' + E + '" is invalid for option "size"');
    const w = new Uint8Array(E);
    return Object.setPrototypeOf(w, y.prototype), w;
  }
  function y(E, w, A) {
    if (typeof E == "number") {
      if (typeof w == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return x(E);
    }
    return S(E, w, A);
  }
  y.poolSize = 8192;
  function S(E, w, A) {
    if (typeof E == "string")
      return I(E, w);
    if (ArrayBuffer.isView(E))
      return D(E);
    if (E == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof E
      );
    if (dt(E, ArrayBuffer) || E && dt(E.buffer, ArrayBuffer) || typeof SharedArrayBuffer != "undefined" && (dt(E, SharedArrayBuffer) || E && dt(E.buffer, SharedArrayBuffer)))
      return U(E, w, A);
    if (typeof E == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const T = E.valueOf && E.valueOf();
    if (T != null && T !== E)
      return y.from(T, w, A);
    const F = W(E);
    if (F)
      return F;
    if (typeof Symbol != "undefined" && Symbol.toPrimitive != null && typeof E[Symbol.toPrimitive] == "function")
      return y.from(E[Symbol.toPrimitive]("string"), w, A);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof E
    );
  }
  y.from = function(E, w, A) {
    return S(E, w, A);
  }, Object.setPrototypeOf(y.prototype, Uint8Array.prototype), Object.setPrototypeOf(y, Uint8Array);
  function B(E) {
    if (typeof E != "number")
      throw new TypeError('"size" argument must be of type number');
    if (E < 0)
      throw new RangeError('The value "' + E + '" is invalid for option "size"');
  }
  function M(E, w, A) {
    return B(E), E <= 0 ? g(E) : w !== void 0 ? typeof A == "string" ? g(E).fill(w, A) : g(E).fill(w) : g(E);
  }
  y.alloc = function(E, w, A) {
    return M(E, w, A);
  };
  function x(E) {
    return B(E), g(E < 0 ? 0 : z(E) | 0);
  }
  y.allocUnsafe = function(E) {
    return x(E);
  }, y.allocUnsafeSlow = function(E) {
    return x(E);
  };
  function I(E, w) {
    if ((typeof w != "string" || w === "") && (w = "utf8"), !y.isEncoding(w))
      throw new TypeError("Unknown encoding: " + w);
    const A = lt(E, w) | 0;
    let T = g(A);
    const F = T.write(E, w);
    return F !== A && (T = T.slice(0, F)), T;
  }
  function k(E) {
    const w = E.length < 0 ? 0 : z(E.length) | 0, A = g(w);
    for (let T = 0; T < w; T += 1)
      A[T] = E[T] & 255;
    return A;
  }
  function D(E) {
    if (dt(E, Uint8Array)) {
      const w = new Uint8Array(E);
      return U(w.buffer, w.byteOffset, w.byteLength);
    }
    return k(E);
  }
  function U(E, w, A) {
    if (w < 0 || E.byteLength < w)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (E.byteLength < w + (A || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let T;
    return w === void 0 && A === void 0 ? T = new Uint8Array(E) : A === void 0 ? T = new Uint8Array(E, w) : T = new Uint8Array(E, w, A), Object.setPrototypeOf(T, y.prototype), T;
  }
  function W(E) {
    if (y.isBuffer(E)) {
      const w = z(E.length) | 0, A = g(w);
      return A.length === 0 || E.copy(A, 0, 0, w), A;
    }
    if (E.length !== void 0)
      return typeof E.length != "number" || qt(E.length) ? g(0) : k(E);
    if (E.type === "Buffer" && Array.isArray(E.data))
      return k(E.data);
  }
  function z(E) {
    if (E >= m)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + m.toString(16) + " bytes");
    return E | 0;
  }
  function $(E) {
    return +E != E && (E = 0), y.alloc(+E);
  }
  y.isBuffer = function(w) {
    return w != null && w._isBuffer === !0 && w !== y.prototype;
  }, y.compare = function(w, A) {
    if (dt(w, Uint8Array) && (w = y.from(w, w.offset, w.byteLength)), dt(A, Uint8Array) && (A = y.from(A, A.offset, A.byteLength)), !y.isBuffer(w) || !y.isBuffer(A))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (w === A)
      return 0;
    let T = w.length, F = A.length;
    for (let V = 0, L = Math.min(T, F); V < L; ++V)
      if (w[V] !== A[V]) {
        T = w[V], F = A[V];
        break;
      }
    return T < F ? -1 : F < T ? 1 : 0;
  }, y.isEncoding = function(w) {
    switch (String(w).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, y.concat = function(w, A) {
    if (!Array.isArray(w))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (w.length === 0)
      return y.alloc(0);
    let T;
    if (A === void 0)
      for (A = 0, T = 0; T < w.length; ++T)
        A += w[T].length;
    const F = y.allocUnsafe(A);
    let V = 0;
    for (T = 0; T < w.length; ++T) {
      let L = w[T];
      if (dt(L, Uint8Array))
        V + L.length > F.length ? (y.isBuffer(L) || (L = y.from(L)), L.copy(F, V)) : Uint8Array.prototype.set.call(
          F,
          L,
          V
        );
      else if (y.isBuffer(L))
        L.copy(F, V);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      V += L.length;
    }
    return F;
  };
  function lt(E, w) {
    if (y.isBuffer(E))
      return E.length;
    if (ArrayBuffer.isView(E) || dt(E, ArrayBuffer))
      return E.byteLength;
    if (typeof E != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof E
      );
    const A = E.length, T = arguments.length > 2 && arguments[2] === !0;
    if (!T && A === 0)
      return 0;
    let F = !1;
    for (; ; )
      switch (w) {
        case "ascii":
        case "latin1":
        case "binary":
          return A;
        case "utf8":
        case "utf-8":
          return Dt(E).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return A * 2;
        case "hex":
          return A >>> 1;
        case "base64":
          return Pt(E).length;
        default:
          if (F)
            return T ? -1 : Dt(E).length;
          w = ("" + w).toLowerCase(), F = !0;
      }
  }
  y.byteLength = lt;
  function H(E, w, A) {
    let T = !1;
    if ((w === void 0 || w < 0) && (w = 0), w > this.length || ((A === void 0 || A > this.length) && (A = this.length), A <= 0) || (A >>>= 0, w >>>= 0, A <= w))
      return "";
    for (E || (E = "utf8"); ; )
      switch (E) {
        case "hex":
          return u(this, w, A);
        case "utf8":
        case "utf-8":
          return i(this, w, A);
        case "ascii":
          return c(this, w, A);
        case "latin1":
        case "binary":
          return v(this, w, A);
        case "base64":
          return r(this, w, A);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return e(this, w, A);
        default:
          if (T)
            throw new TypeError("Unknown encoding: " + E);
          E = (E + "").toLowerCase(), T = !0;
      }
  }
  y.prototype._isBuffer = !0;
  function At(E, w, A) {
    const T = E[w];
    E[w] = E[A], E[A] = T;
  }
  y.prototype.swap16 = function() {
    const w = this.length;
    if (w % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let A = 0; A < w; A += 2)
      At(this, A, A + 1);
    return this;
  }, y.prototype.swap32 = function() {
    const w = this.length;
    if (w % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let A = 0; A < w; A += 4)
      At(this, A, A + 3), At(this, A + 1, A + 2);
    return this;
  }, y.prototype.swap64 = function() {
    const w = this.length;
    if (w % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let A = 0; A < w; A += 8)
      At(this, A, A + 7), At(this, A + 1, A + 6), At(this, A + 2, A + 5), At(this, A + 3, A + 4);
    return this;
  }, y.prototype.toString = function() {
    const w = this.length;
    return w === 0 ? "" : arguments.length === 0 ? i(this, 0, w) : H.apply(this, arguments);
  }, y.prototype.toLocaleString = y.prototype.toString, y.prototype.equals = function(w) {
    if (!y.isBuffer(w))
      throw new TypeError("Argument must be a Buffer");
    return this === w ? !0 : y.compare(this, w) === 0;
  }, y.prototype.inspect = function() {
    let w = "";
    const A = a.INSPECT_MAX_BYTES;
    return w = this.toString("hex", 0, A).replace(/(.{2})/g, "$1 ").trim(), this.length > A && (w += " ... "), "<Buffer " + w + ">";
  }, s && (y.prototype[s] = y.prototype.inspect), y.prototype.compare = function(w, A, T, F, V) {
    if (dt(w, Uint8Array) && (w = y.from(w, w.offset, w.byteLength)), !y.isBuffer(w))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof w
      );
    if (A === void 0 && (A = 0), T === void 0 && (T = w ? w.length : 0), F === void 0 && (F = 0), V === void 0 && (V = this.length), A < 0 || T > w.length || F < 0 || V > this.length)
      throw new RangeError("out of range index");
    if (F >= V && A >= T)
      return 0;
    if (F >= V)
      return -1;
    if (A >= T)
      return 1;
    if (A >>>= 0, T >>>= 0, F >>>= 0, V >>>= 0, this === w)
      return 0;
    let L = V - F, X = T - A;
    const Tt = Math.min(L, X), G = this.slice(F, V), rt = w.slice(A, T);
    for (let Rt = 0; Rt < Tt; ++Rt)
      if (G[Rt] !== rt[Rt]) {
        L = G[Rt], X = rt[Rt];
        break;
      }
    return L < X ? -1 : X < L ? 1 : 0;
  };
  function Bt(E, w, A, T, F) {
    if (E.length === 0)
      return -1;
    if (typeof A == "string" ? (T = A, A = 0) : A > 2147483647 ? A = 2147483647 : A < -2147483648 && (A = -2147483648), A = +A, qt(A) && (A = F ? 0 : E.length - 1), A < 0 && (A = E.length + A), A >= E.length) {
      if (F)
        return -1;
      A = E.length - 1;
    } else if (A < 0)
      if (F)
        A = 0;
      else
        return -1;
    if (typeof w == "string" && (w = y.from(w, T)), y.isBuffer(w))
      return w.length === 0 ? -1 : Ct(E, w, A, T, F);
    if (typeof w == "number")
      return w = w & 255, typeof Uint8Array.prototype.indexOf == "function" ? F ? Uint8Array.prototype.indexOf.call(E, w, A) : Uint8Array.prototype.lastIndexOf.call(E, w, A) : Ct(E, [w], A, T, F);
    throw new TypeError("val must be string, number or Buffer");
  }
  function Ct(E, w, A, T, F) {
    let V = 1, L = E.length, X = w.length;
    if (T !== void 0 && (T = String(T).toLowerCase(), T === "ucs2" || T === "ucs-2" || T === "utf16le" || T === "utf-16le")) {
      if (E.length < 2 || w.length < 2)
        return -1;
      V = 2, L /= 2, X /= 2, A /= 2;
    }
    function Tt(rt, Rt) {
      return V === 1 ? rt[Rt] : rt.readUInt16BE(Rt * V);
    }
    let G;
    if (F) {
      let rt = -1;
      for (G = A; G < L; G++)
        if (Tt(E, G) === Tt(w, rt === -1 ? 0 : G - rt)) {
          if (rt === -1 && (rt = G), G - rt + 1 === X)
            return rt * V;
        } else
          rt !== -1 && (G -= G - rt), rt = -1;
    } else
      for (A + X > L && (A = L - X), G = A; G >= 0; G--) {
        let rt = !0;
        for (let Rt = 0; Rt < X; Rt++)
          if (Tt(E, G + Rt) !== Tt(w, Rt)) {
            rt = !1;
            break;
          }
        if (rt)
          return G;
      }
    return -1;
  }
  y.prototype.includes = function(w, A, T) {
    return this.indexOf(w, A, T) !== -1;
  }, y.prototype.indexOf = function(w, A, T) {
    return Bt(this, w, A, T, !0);
  }, y.prototype.lastIndexOf = function(w, A, T) {
    return Bt(this, w, A, T, !1);
  };
  function Et(E, w, A, T) {
    A = Number(A) || 0;
    const F = E.length - A;
    T ? (T = Number(T), T > F && (T = F)) : T = F;
    const V = w.length;
    T > V / 2 && (T = V / 2);
    let L;
    for (L = 0; L < T; ++L) {
      const X = parseInt(w.substr(L * 2, 2), 16);
      if (qt(X))
        return L;
      E[A + L] = X;
    }
    return L;
  }
  function Y(E, w, A, T) {
    return j(Dt(w, E.length - A), E, A, T);
  }
  function It(E, w, A, T) {
    return j(et(w), E, A, T);
  }
  function p(E, w, A, T) {
    return j(Pt(w), E, A, T);
  }
  function t(E, w, A, T) {
    return j(pt(w, E.length - A), E, A, T);
  }
  y.prototype.write = function(w, A, T, F) {
    if (A === void 0)
      F = "utf8", T = this.length, A = 0;
    else if (T === void 0 && typeof A == "string")
      F = A, T = this.length, A = 0;
    else if (isFinite(A))
      A = A >>> 0, isFinite(T) ? (T = T >>> 0, F === void 0 && (F = "utf8")) : (F = T, T = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const V = this.length - A;
    if ((T === void 0 || T > V) && (T = V), w.length > 0 && (T < 0 || A < 0) || A > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    F || (F = "utf8");
    let L = !1;
    for (; ; )
      switch (F) {
        case "hex":
          return Et(this, w, A, T);
        case "utf8":
        case "utf-8":
          return Y(this, w, A, T);
        case "ascii":
        case "latin1":
        case "binary":
          return It(this, w, A, T);
        case "base64":
          return p(this, w, A, T);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return t(this, w, A, T);
        default:
          if (L)
            throw new TypeError("Unknown encoding: " + F);
          F = ("" + F).toLowerCase(), L = !0;
      }
  }, y.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function r(E, w, A) {
    return w === 0 && A === E.length ? n.fromByteArray(E) : n.fromByteArray(E.slice(w, A));
  }
  function i(E, w, A) {
    A = Math.min(E.length, A);
    const T = [];
    let F = w;
    for (; F < A; ) {
      const V = E[F];
      let L = null, X = V > 239 ? 4 : V > 223 ? 3 : V > 191 ? 2 : 1;
      if (F + X <= A) {
        let Tt, G, rt, Rt;
        switch (X) {
          case 1:
            V < 128 && (L = V);
            break;
          case 2:
            Tt = E[F + 1], (Tt & 192) === 128 && (Rt = (V & 31) << 6 | Tt & 63, Rt > 127 && (L = Rt));
            break;
          case 3:
            Tt = E[F + 1], G = E[F + 2], (Tt & 192) === 128 && (G & 192) === 128 && (Rt = (V & 15) << 12 | (Tt & 63) << 6 | G & 63, Rt > 2047 && (Rt < 55296 || Rt > 57343) && (L = Rt));
            break;
          case 4:
            Tt = E[F + 1], G = E[F + 2], rt = E[F + 3], (Tt & 192) === 128 && (G & 192) === 128 && (rt & 192) === 128 && (Rt = (V & 15) << 18 | (Tt & 63) << 12 | (G & 63) << 6 | rt & 63, Rt > 65535 && Rt < 1114112 && (L = Rt));
        }
      }
      L === null ? (L = 65533, X = 1) : L > 65535 && (L -= 65536, T.push(L >>> 10 & 1023 | 55296), L = 56320 | L & 1023), T.push(L), F += X;
    }
    return d(T);
  }
  const h = 4096;
  function d(E) {
    const w = E.length;
    if (w <= h)
      return String.fromCharCode.apply(String, E);
    let A = "", T = 0;
    for (; T < w; )
      A += String.fromCharCode.apply(
        String,
        E.slice(T, T += h)
      );
    return A;
  }
  function c(E, w, A) {
    let T = "";
    A = Math.min(E.length, A);
    for (let F = w; F < A; ++F)
      T += String.fromCharCode(E[F] & 127);
    return T;
  }
  function v(E, w, A) {
    let T = "";
    A = Math.min(E.length, A);
    for (let F = w; F < A; ++F)
      T += String.fromCharCode(E[F]);
    return T;
  }
  function u(E, w, A) {
    const T = E.length;
    (!w || w < 0) && (w = 0), (!A || A < 0 || A > T) && (A = T);
    let F = "";
    for (let V = w; V < A; ++V)
      F += Q[E[V]];
    return F;
  }
  function e(E, w, A) {
    const T = E.slice(w, A);
    let F = "";
    for (let V = 0; V < T.length - 1; V += 2)
      F += String.fromCharCode(T[V] + T[V + 1] * 256);
    return F;
  }
  y.prototype.slice = function(w, A) {
    const T = this.length;
    w = ~~w, A = A === void 0 ? T : ~~A, w < 0 ? (w += T, w < 0 && (w = 0)) : w > T && (w = T), A < 0 ? (A += T, A < 0 && (A = 0)) : A > T && (A = T), A < w && (A = w);
    const F = this.subarray(w, A);
    return Object.setPrototypeOf(F, y.prototype), F;
  };
  function l(E, w, A) {
    if (E % 1 !== 0 || E < 0)
      throw new RangeError("offset is not uint");
    if (E + w > A)
      throw new RangeError("Trying to access beyond buffer length");
  }
  y.prototype.readUintLE = y.prototype.readUIntLE = function(w, A, T) {
    w = w >>> 0, A = A >>> 0, T || l(w, A, this.length);
    let F = this[w], V = 1, L = 0;
    for (; ++L < A && (V *= 256); )
      F += this[w + L] * V;
    return F;
  }, y.prototype.readUintBE = y.prototype.readUIntBE = function(w, A, T) {
    w = w >>> 0, A = A >>> 0, T || l(w, A, this.length);
    let F = this[w + --A], V = 1;
    for (; A > 0 && (V *= 256); )
      F += this[w + --A] * V;
    return F;
  }, y.prototype.readUint8 = y.prototype.readUInt8 = function(w, A) {
    return w = w >>> 0, A || l(w, 1, this.length), this[w];
  }, y.prototype.readUint16LE = y.prototype.readUInt16LE = function(w, A) {
    return w = w >>> 0, A || l(w, 2, this.length), this[w] | this[w + 1] << 8;
  }, y.prototype.readUint16BE = y.prototype.readUInt16BE = function(w, A) {
    return w = w >>> 0, A || l(w, 2, this.length), this[w] << 8 | this[w + 1];
  }, y.prototype.readUint32LE = y.prototype.readUInt32LE = function(w, A) {
    return w = w >>> 0, A || l(w, 4, this.length), (this[w] | this[w + 1] << 8 | this[w + 2] << 16) + this[w + 3] * 16777216;
  }, y.prototype.readUint32BE = y.prototype.readUInt32BE = function(w, A) {
    return w = w >>> 0, A || l(w, 4, this.length), this[w] * 16777216 + (this[w + 1] << 16 | this[w + 2] << 8 | this[w + 3]);
  }, y.prototype.readBigUInt64LE = ct(function(w) {
    w = w >>> 0, J(w, "offset");
    const A = this[w], T = this[w + 7];
    (A === void 0 || T === void 0) && Ft(w, this.length - 8);
    const F = A + this[++w] * me(2, 8) + this[++w] * me(2, 16) + this[++w] * me(2, 24), V = this[++w] + this[++w] * me(2, 8) + this[++w] * me(2, 16) + T * me(2, 24);
    return BigInt(F) + (BigInt(V) << BigInt(32));
  }), y.prototype.readBigUInt64BE = ct(function(w) {
    w = w >>> 0, J(w, "offset");
    const A = this[w], T = this[w + 7];
    (A === void 0 || T === void 0) && Ft(w, this.length - 8);
    const F = A * me(2, 24) + this[++w] * me(2, 16) + this[++w] * me(2, 8) + this[++w], V = this[++w] * me(2, 24) + this[++w] * me(2, 16) + this[++w] * me(2, 8) + T;
    return (BigInt(F) << BigInt(32)) + BigInt(V);
  }), y.prototype.readIntLE = function(w, A, T) {
    w = w >>> 0, A = A >>> 0, T || l(w, A, this.length);
    let F = this[w], V = 1, L = 0;
    for (; ++L < A && (V *= 256); )
      F += this[w + L] * V;
    return V *= 128, F >= V && (F -= Math.pow(2, 8 * A)), F;
  }, y.prototype.readIntBE = function(w, A, T) {
    w = w >>> 0, A = A >>> 0, T || l(w, A, this.length);
    let F = A, V = 1, L = this[w + --F];
    for (; F > 0 && (V *= 256); )
      L += this[w + --F] * V;
    return V *= 128, L >= V && (L -= Math.pow(2, 8 * A)), L;
  }, y.prototype.readInt8 = function(w, A) {
    return w = w >>> 0, A || l(w, 1, this.length), this[w] & 128 ? (255 - this[w] + 1) * -1 : this[w];
  }, y.prototype.readInt16LE = function(w, A) {
    w = w >>> 0, A || l(w, 2, this.length);
    const T = this[w] | this[w + 1] << 8;
    return T & 32768 ? T | 4294901760 : T;
  }, y.prototype.readInt16BE = function(w, A) {
    w = w >>> 0, A || l(w, 2, this.length);
    const T = this[w + 1] | this[w] << 8;
    return T & 32768 ? T | 4294901760 : T;
  }, y.prototype.readInt32LE = function(w, A) {
    return w = w >>> 0, A || l(w, 4, this.length), this[w] | this[w + 1] << 8 | this[w + 2] << 16 | this[w + 3] << 24;
  }, y.prototype.readInt32BE = function(w, A) {
    return w = w >>> 0, A || l(w, 4, this.length), this[w] << 24 | this[w + 1] << 16 | this[w + 2] << 8 | this[w + 3];
  }, y.prototype.readBigInt64LE = ct(function(w) {
    w = w >>> 0, J(w, "offset");
    const A = this[w], T = this[w + 7];
    (A === void 0 || T === void 0) && Ft(w, this.length - 8);
    const F = this[w + 4] + this[w + 5] * me(2, 8) + this[w + 6] * me(2, 16) + (T << 24);
    return (BigInt(F) << BigInt(32)) + BigInt(A + this[++w] * me(2, 8) + this[++w] * me(2, 16) + this[++w] * me(2, 24));
  }), y.prototype.readBigInt64BE = ct(function(w) {
    w = w >>> 0, J(w, "offset");
    const A = this[w], T = this[w + 7];
    (A === void 0 || T === void 0) && Ft(w, this.length - 8);
    const F = (A << 24) + // Overflow
    this[++w] * me(2, 16) + this[++w] * me(2, 8) + this[++w];
    return (BigInt(F) << BigInt(32)) + BigInt(this[++w] * me(2, 24) + this[++w] * me(2, 16) + this[++w] * me(2, 8) + T);
  }), y.prototype.readFloatLE = function(w, A) {
    return w = w >>> 0, A || l(w, 4, this.length), o.read(this, w, !0, 23, 4);
  }, y.prototype.readFloatBE = function(w, A) {
    return w = w >>> 0, A || l(w, 4, this.length), o.read(this, w, !1, 23, 4);
  }, y.prototype.readDoubleLE = function(w, A) {
    return w = w >>> 0, A || l(w, 8, this.length), o.read(this, w, !0, 52, 8);
  }, y.prototype.readDoubleBE = function(w, A) {
    return w = w >>> 0, A || l(w, 8, this.length), o.read(this, w, !1, 52, 8);
  };
  function b(E, w, A, T, F, V) {
    if (!y.isBuffer(E))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (w > F || w < V)
      throw new RangeError('"value" argument is out of bounds');
    if (A + T > E.length)
      throw new RangeError("Index out of range");
  }
  y.prototype.writeUintLE = y.prototype.writeUIntLE = function(w, A, T, F) {
    if (w = +w, A = A >>> 0, T = T >>> 0, !F) {
      const X = Math.pow(2, 8 * T) - 1;
      b(this, w, A, T, X, 0);
    }
    let V = 1, L = 0;
    for (this[A] = w & 255; ++L < T && (V *= 256); )
      this[A + L] = w / V & 255;
    return A + T;
  }, y.prototype.writeUintBE = y.prototype.writeUIntBE = function(w, A, T, F) {
    if (w = +w, A = A >>> 0, T = T >>> 0, !F) {
      const X = Math.pow(2, 8 * T) - 1;
      b(this, w, A, T, X, 0);
    }
    let V = T - 1, L = 1;
    for (this[A + V] = w & 255; --V >= 0 && (L *= 256); )
      this[A + V] = w / L & 255;
    return A + T;
  }, y.prototype.writeUint8 = y.prototype.writeUInt8 = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 1, 255, 0), this[A] = w & 255, A + 1;
  }, y.prototype.writeUint16LE = y.prototype.writeUInt16LE = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 2, 65535, 0), this[A] = w & 255, this[A + 1] = w >>> 8, A + 2;
  }, y.prototype.writeUint16BE = y.prototype.writeUInt16BE = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 2, 65535, 0), this[A] = w >>> 8, this[A + 1] = w & 255, A + 2;
  }, y.prototype.writeUint32LE = y.prototype.writeUInt32LE = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 4, 4294967295, 0), this[A + 3] = w >>> 24, this[A + 2] = w >>> 16, this[A + 1] = w >>> 8, this[A] = w & 255, A + 4;
  }, y.prototype.writeUint32BE = y.prototype.writeUInt32BE = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 4, 4294967295, 0), this[A] = w >>> 24, this[A + 1] = w >>> 16, this[A + 2] = w >>> 8, this[A + 3] = w & 255, A + 4;
  };
  function _(E, w, A, T, F) {
    Z(w, T, F, E, A, 7);
    let V = Number(w & BigInt(4294967295));
    E[A++] = V, V = V >> 8, E[A++] = V, V = V >> 8, E[A++] = V, V = V >> 8, E[A++] = V;
    let L = Number(w >> BigInt(32) & BigInt(4294967295));
    return E[A++] = L, L = L >> 8, E[A++] = L, L = L >> 8, E[A++] = L, L = L >> 8, E[A++] = L, A;
  }
  function C(E, w, A, T, F) {
    Z(w, T, F, E, A, 7);
    let V = Number(w & BigInt(4294967295));
    E[A + 7] = V, V = V >> 8, E[A + 6] = V, V = V >> 8, E[A + 5] = V, V = V >> 8, E[A + 4] = V;
    let L = Number(w >> BigInt(32) & BigInt(4294967295));
    return E[A + 3] = L, L = L >> 8, E[A + 2] = L, L = L >> 8, E[A + 1] = L, L = L >> 8, E[A] = L, A + 8;
  }
  y.prototype.writeBigUInt64LE = ct(function(w, A = 0) {
    return _(this, w, A, BigInt(0), BigInt("0xffffffffffffffff"));
  }), y.prototype.writeBigUInt64BE = ct(function(w, A = 0) {
    return C(this, w, A, BigInt(0), BigInt("0xffffffffffffffff"));
  }), y.prototype.writeIntLE = function(w, A, T, F) {
    if (w = +w, A = A >>> 0, !F) {
      const Tt = Math.pow(2, 8 * T - 1);
      b(this, w, A, T, Tt - 1, -Tt);
    }
    let V = 0, L = 1, X = 0;
    for (this[A] = w & 255; ++V < T && (L *= 256); )
      w < 0 && X === 0 && this[A + V - 1] !== 0 && (X = 1), this[A + V] = (w / L >> 0) - X & 255;
    return A + T;
  }, y.prototype.writeIntBE = function(w, A, T, F) {
    if (w = +w, A = A >>> 0, !F) {
      const Tt = Math.pow(2, 8 * T - 1);
      b(this, w, A, T, Tt - 1, -Tt);
    }
    let V = T - 1, L = 1, X = 0;
    for (this[A + V] = w & 255; --V >= 0 && (L *= 256); )
      w < 0 && X === 0 && this[A + V + 1] !== 0 && (X = 1), this[A + V] = (w / L >> 0) - X & 255;
    return A + T;
  }, y.prototype.writeInt8 = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 1, 127, -128), w < 0 && (w = 255 + w + 1), this[A] = w & 255, A + 1;
  }, y.prototype.writeInt16LE = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 2, 32767, -32768), this[A] = w & 255, this[A + 1] = w >>> 8, A + 2;
  }, y.prototype.writeInt16BE = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 2, 32767, -32768), this[A] = w >>> 8, this[A + 1] = w & 255, A + 2;
  }, y.prototype.writeInt32LE = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 4, 2147483647, -2147483648), this[A] = w & 255, this[A + 1] = w >>> 8, this[A + 2] = w >>> 16, this[A + 3] = w >>> 24, A + 4;
  }, y.prototype.writeInt32BE = function(w, A, T) {
    return w = +w, A = A >>> 0, T || b(this, w, A, 4, 2147483647, -2147483648), w < 0 && (w = 4294967295 + w + 1), this[A] = w >>> 24, this[A + 1] = w >>> 16, this[A + 2] = w >>> 8, this[A + 3] = w & 255, A + 4;
  }, y.prototype.writeBigInt64LE = ct(function(w, A = 0) {
    return _(this, w, A, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), y.prototype.writeBigInt64BE = ct(function(w, A = 0) {
    return C(this, w, A, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function q(E, w, A, T, F, V) {
    if (A + T > E.length)
      throw new RangeError("Index out of range");
    if (A < 0)
      throw new RangeError("Index out of range");
  }
  function O(E, w, A, T, F) {
    return w = +w, A = A >>> 0, F || q(E, w, A, 4), o.write(E, w, A, T, 23, 4), A + 4;
  }
  y.prototype.writeFloatLE = function(w, A, T) {
    return O(this, w, A, !0, T);
  }, y.prototype.writeFloatBE = function(w, A, T) {
    return O(this, w, A, !1, T);
  };
  function R(E, w, A, T, F) {
    return w = +w, A = A >>> 0, F || q(E, w, A, 8), o.write(E, w, A, T, 52, 8), A + 8;
  }
  y.prototype.writeDoubleLE = function(w, A, T) {
    return R(this, w, A, !0, T);
  }, y.prototype.writeDoubleBE = function(w, A, T) {
    return R(this, w, A, !1, T);
  }, y.prototype.copy = function(w, A, T, F) {
    if (!y.isBuffer(w))
      throw new TypeError("argument should be a Buffer");
    if (T || (T = 0), !F && F !== 0 && (F = this.length), A >= w.length && (A = w.length), A || (A = 0), F > 0 && F < T && (F = T), F === T || w.length === 0 || this.length === 0)
      return 0;
    if (A < 0)
      throw new RangeError("targetStart out of bounds");
    if (T < 0 || T >= this.length)
      throw new RangeError("Index out of range");
    if (F < 0)
      throw new RangeError("sourceEnd out of bounds");
    F > this.length && (F = this.length), w.length - A < F - T && (F = w.length - A + T);
    const V = F - T;
    return this === w && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(A, T, F) : Uint8Array.prototype.set.call(
      w,
      this.subarray(T, F),
      A
    ), V;
  }, y.prototype.fill = function(w, A, T, F) {
    if (typeof w == "string") {
      if (typeof A == "string" ? (F = A, A = 0, T = this.length) : typeof T == "string" && (F = T, T = this.length), F !== void 0 && typeof F != "string")
        throw new TypeError("encoding must be a string");
      if (typeof F == "string" && !y.isEncoding(F))
        throw new TypeError("Unknown encoding: " + F);
      if (w.length === 1) {
        const L = w.charCodeAt(0);
        (F === "utf8" && L < 128 || F === "latin1") && (w = L);
      }
    } else
      typeof w == "number" ? w = w & 255 : typeof w == "boolean" && (w = Number(w));
    if (A < 0 || this.length < A || this.length < T)
      throw new RangeError("Out of range index");
    if (T <= A)
      return this;
    A = A >>> 0, T = T === void 0 ? this.length : T >>> 0, w || (w = 0);
    let V;
    if (typeof w == "number")
      for (V = A; V < T; ++V)
        this[V] = w;
    else {
      const L = y.isBuffer(w) ? w : y.from(w, F), X = L.length;
      if (X === 0)
        throw new TypeError('The value "' + w + '" is invalid for argument "value"');
      for (V = 0; V < T - A; ++V)
        this[V + A] = L[V % X];
    }
    return this;
  };
  const P = {};
  function N(E, w, A) {
    P[E] = class extends A {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: w.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${E}]`, this.stack, delete this.name;
      }
      get code() {
        return E;
      }
      set code(F) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: F,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${E}]: ${this.message}`;
      }
    };
  }
  N(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(E) {
      return E ? `${E} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), N(
    "ERR_INVALID_ARG_TYPE",
    function(E, w) {
      return `The "${E}" argument must be of type number. Received type ${typeof w}`;
    },
    TypeError
  ), N(
    "ERR_OUT_OF_RANGE",
    function(E, w, A) {
      let T = `The value of "${E}" is out of range.`, F = A;
      return Number.isInteger(A) && Math.abs(A) > me(2, 32) ? F = K(String(A)) : typeof A == "bigint" && (F = String(A), (A > me(BigInt(2), BigInt(32)) || A < -me(BigInt(2), BigInt(32))) && (F = K(F)), F += "n"), T += ` It must be ${w}. Received ${F}`, T;
    },
    RangeError
  );
  function K(E) {
    let w = "", A = E.length;
    const T = E[0] === "-" ? 1 : 0;
    for (; A >= T + 4; A -= 3)
      w = `_${E.slice(A - 3, A)}${w}`;
    return `${E.slice(0, A)}${w}`;
  }
  function kt(E, w, A) {
    J(w, "offset"), (E[w] === void 0 || E[w + A] === void 0) && Ft(w, E.length - (A + 1));
  }
  function Z(E, w, A, T, F, V) {
    if (E > A || E < w) {
      const L = typeof w == "bigint" ? "n" : "";
      let X;
      throw V > 3 ? w === 0 || w === BigInt(0) ? X = `>= 0${L} and < 2${L} ** ${(V + 1) * 8}${L}` : X = `>= -(2${L} ** ${(V + 1) * 8 - 1}${L}) and < 2 ** ${(V + 1) * 8 - 1}${L}` : X = `>= ${w}${L} and <= ${A}${L}`, new P.ERR_OUT_OF_RANGE("value", X, E);
    }
    kt(T, F, V);
  }
  function J(E, w) {
    if (typeof E != "number")
      throw new P.ERR_INVALID_ARG_TYPE(w, "number", E);
  }
  function Ft(E, w, A) {
    throw Math.floor(E) !== E ? (J(E, A), new P.ERR_OUT_OF_RANGE(A || "offset", "an integer", E)) : w < 0 ? new P.ERR_BUFFER_OUT_OF_BOUNDS() : new P.ERR_OUT_OF_RANGE(
      A || "offset",
      `>= ${A ? 1 : 0} and <= ${w}`,
      E
    );
  }
  const tt = /[^+/0-9A-Za-z-_]/g;
  function vt(E) {
    if (E = E.split("=")[0], E = E.trim().replace(tt, ""), E.length < 2)
      return "";
    for (; E.length % 4 !== 0; )
      E = E + "=";
    return E;
  }
  function Dt(E, w) {
    w = w || 1 / 0;
    let A;
    const T = E.length;
    let F = null;
    const V = [];
    for (let L = 0; L < T; ++L) {
      if (A = E.charCodeAt(L), A > 55295 && A < 57344) {
        if (!F) {
          if (A > 56319) {
            (w -= 3) > -1 && V.push(239, 191, 189);
            continue;
          } else if (L + 1 === T) {
            (w -= 3) > -1 && V.push(239, 191, 189);
            continue;
          }
          F = A;
          continue;
        }
        if (A < 56320) {
          (w -= 3) > -1 && V.push(239, 191, 189), F = A;
          continue;
        }
        A = (F - 55296 << 10 | A - 56320) + 65536;
      } else
        F && (w -= 3) > -1 && V.push(239, 191, 189);
      if (F = null, A < 128) {
        if ((w -= 1) < 0)
          break;
        V.push(A);
      } else if (A < 2048) {
        if ((w -= 2) < 0)
          break;
        V.push(
          A >> 6 | 192,
          A & 63 | 128
        );
      } else if (A < 65536) {
        if ((w -= 3) < 0)
          break;
        V.push(
          A >> 12 | 224,
          A >> 6 & 63 | 128,
          A & 63 | 128
        );
      } else if (A < 1114112) {
        if ((w -= 4) < 0)
          break;
        V.push(
          A >> 18 | 240,
          A >> 12 & 63 | 128,
          A >> 6 & 63 | 128,
          A & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return V;
  }
  function et(E) {
    const w = [];
    for (let A = 0; A < E.length; ++A)
      w.push(E.charCodeAt(A) & 255);
    return w;
  }
  function pt(E, w) {
    let A, T, F;
    const V = [];
    for (let L = 0; L < E.length && !((w -= 2) < 0); ++L)
      A = E.charCodeAt(L), T = A >> 8, F = A % 256, V.push(F), V.push(T);
    return V;
  }
  function Pt(E) {
    return n.toByteArray(vt(E));
  }
  function j(E, w, A, T) {
    let F;
    for (F = 0; F < T && !(F + A >= w.length || F >= E.length); ++F)
      w[F + A] = E[F];
    return F;
  }
  function dt(E, w) {
    return E instanceof w || E != null && E.constructor != null && E.constructor.name != null && E.constructor.name === w.name;
  }
  function qt(E) {
    return E !== E;
  }
  const Q = function() {
    const E = "0123456789abcdef", w = new Array(256);
    for (let A = 0; A < 16; ++A) {
      const T = A * 16;
      for (let F = 0; F < 16; ++F)
        w[T + F] = E[A] + E[F];
    }
    return w;
  }();
  function ct(E) {
    return typeof BigInt == "undefined" ? Ut : E;
  }
  function Ut() {
    throw new Error("BigInt not supported");
  }
})(br);
function t0(a) {
  if (!a || typeof a != "object" || Array.isArray(a))
    return a;
  const n = a, o = n["custom.source"], s = n.custom, m = s && typeof s == "object" && !Array.isArray(s) ? s.source : void 0, f = typeof o == "string" ? o : typeof m == "string" ? m : "API";
  return cf(ni({}, n), {
    custom: s && typeof s == "object" && !Array.isArray(s) ? cf(ni({}, s), {
      source: f
    }) : { source: f }
  });
}
const Au = [
  "Connected",
  "Disconnected",
  "Connection closed",
  "connected",
  "disconnected",
  "Flagmint SDK is connected",
  "Flagmint SDK is disconnected"
];
function Bu() {
  return typeof process != "undefined" ? (process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV || "development").toLowerCase() : "development";
}
function ki(a, n) {
  const o = Bu();
  return ["staging", "sandbox", "acceptance", "local", "testing", "development"].includes(o) ? !0 : o === "production" ? Au.some(
    (f) => a.toLowerCase().includes(f.toLowerCase())
  ) : !0;
}
const Ot = {
  log: (a, ...n) => {
    ki(a) && console.log(a, ...n);
  },
  error: (a, ...n) => {
    ki(a) && console.error(a, ...n);
  },
  warn: (a, ...n) => {
    ki(a) && console.warn(a, ...n);
  },
  info: (a, ...n) => {
    ki(a) && console.info(a, ...n);
  },
  debug: (a, ...n) => {
    ki(a) && console.debug(a, ...n);
  }
};
class Eu {
  constructor(n, o, s, m = {}) {
    this.endpoint = n, this.apiKey = o, this.isStopped = !1, this.pollTimeoutId = null, this.currentFlags = {}, this.consecutiveErrors = 0, this.currentBackoffMs = 0, this.pollIntervalMs = m.pollIntervalMs || 1e4, this.maxBackoffMs = m.maxBackoffMs || 6e4, this.backoffMultiplier = m.backoffMultiplier || 2, this.currentContext = s;
  }
  init() {
    return Ie(this, null, function* () {
      try {
        this.currentFlags = yield this.fetchFlags(this.currentContext), this.consecutiveErrors = 0, Ot.log("[LongPollingTransport] Initial fetch complete");
      } catch (n) {
        Ot.error("[LongPollingTransport] Initial fetch failed:", n);
      }
      this.scheduleNextPoll();
    });
  }
  scheduleNextPoll() {
    if (this.isStopped)
      return;
    const n = this.pollIntervalMs + this.currentBackoffMs;
    Ot.log(
      `[LongPollingTransport] Next poll in ${n}ms` + (this.currentBackoffMs > 0 ? ` (backoff: ${this.currentBackoffMs}ms)` : "")
    ), this.pollTimeoutId = setTimeout(() => Ie(this, null, function* () {
      yield this.poll(), this.scheduleNextPoll();
    }), n);
  }
  poll() {
    return Ie(this, null, function* () {
      var n;
      try {
        const o = yield this.fetchFlags(this.currentContext);
        this.consecutiveErrors > 0 && (Ot.log("[LongPollingTransport] ✅ Recovered from errors"), this.consecutiveErrors = 0, this.currentBackoffMs = 0), this.flagsChanged(o) && (Ot.log("[LongPollingTransport] Flags changed, notifying..."), this.currentFlags = o, (n = this.onUpdateCallback) == null || n.call(this, o));
      } catch (o) {
        Ot.error("[LongPollingTransport] ❌ Poll error:", o), this.consecutiveErrors++, this.applyBackoff();
      }
    });
  }
  applyBackoff() {
    if (this.consecutiveErrors === 1)
      this.currentBackoffMs = 0;
    else {
      const n = this.pollIntervalMs * Math.pow(
        this.backoffMultiplier,
        this.consecutiveErrors - 2
      );
      this.currentBackoffMs = Math.min(n, this.maxBackoffMs), Ot.warn(
        `[LongPollingTransport] Backing off ${this.currentBackoffMs}ms (${this.consecutiveErrors} consecutive errors)`
      );
    }
  }
  flagsChanged(n) {
    return JSON.stringify(n) !== JSON.stringify(this.currentFlags);
  }
  fetchFlags(n) {
    return Ie(this, null, function* () {
      const o = t0(n);
      this.currentContext = o;
      const s = yield fetch(this.endpoint, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ context: o })
      });
      if (s.status === 401 || s.status === 403)
        throw new Error("Unauthorized: Invalid API key");
      if (!s.ok)
        throw new Error(`HTTP ${s.status}: ${s.statusText}`);
      return (yield s.json()).data;
    });
  }
  onFlagsUpdated(n) {
    this.onUpdateCallback = n;
  }
  destroy() {
    Ot.log("[LongPollingTransport] Destroying..."), this.isStopped = !0, this.pollTimeoutId !== null && (clearTimeout(this.pollTimeoutId), this.pollTimeoutId = null), this.onUpdateCallback = void 0;
  }
}
class ku {
  constructor(n, o, s = 5, m = 1e3) {
    this.wsUrl = n, this.apiKey = o, this.maxRetries = s, this.initialBackoffMs = m, this.socket = null, this.flags = {}, this.context = null, this.isReady = !1, this.initialFlagsReceived = !1, this.initialFlagsPromise = null, this.retries = 0, this.reconnectTimeoutId = null;
  }
  init() {
    return Ie(this, null, function* () {
      yield this.connectWithRetry(), yield this.waitForInitialFlags();
    });
  }
  waitForInitialFlags() {
    return this.initialFlagsReceived ? Promise.resolve() : (this.initialFlagsPromise || (this.initialFlagsPromise = new Promise((n) => {
      const o = setInterval(() => {
        this.initialFlagsReceived && (clearInterval(o), n());
      }, 50);
      setTimeout(() => {
        clearInterval(o), Ot.warn("[WebSocketTransport] Initial flags timeout"), n();
      }, 5e3);
    })), this.initialFlagsPromise);
  }
  connectWithRetry() {
    return new Promise((n, o) => {
      const s = () => {
        try {
          this.cleanupSocket(), this.setConnectionState("connecting");
          const m = this.getWebSocketImplementation();
          this.socket = new m(`${this.wsUrl}?apiKey=${this.apiKey}`), this.socket.onopen = () => {
            Ot.log("[WebSocketTransport] Connected"), this.isReady = !0, this.retries = 0, this.setConnectionState("connected"), this.context && this.sendContext(this.context), n();
          }, this.socket.onmessage = (f) => {
            var g;
            try {
              const y = JSON.parse(f.data);
              if (Ot.log("[WebSocketTransport] Message received:", y), y.type === "ping") {
                this.socket && this.socket.readyState === 1 && this.socket.send(JSON.stringify({ type: "pong" }));
                return;
              }
              if (y.type === "pong") {
                Ot.log("[WebSocketTransport] Pong received");
                return;
              }
              y.type === "flags" && (Ot.log("[WebSocketTransport] Flags update received"), this.flags = y.flags, this.initialFlagsReceived = !0, (g = this.onFlagsUpdatedCallback) == null || g.call(this, this.flags));
            } catch (y) {
              Ot.warn("[WebSocketTransport] Failed to parse message:", y);
            }
          }, this.socket.onerror = (f) => {
            Ot.error("[WebSocketTransport] Error:", f);
          }, this.socket.onclose = (f) => {
            if (Ot.log("[WebSocketTransport] Connection closed:", f.code), this.isReady = !1, this.setConnectionState("disconnected"), f.code === 1008 || f.code === 4001) {
              this.setConnectionState("failed"), o(new Error("Unauthorized: Invalid API key"));
              return;
            }
            if (this.retries < this.maxRetries) {
              const g = this.initialBackoffMs * Math.pow(2, this.retries);
              Ot.warn(
                `[WebSocketTransport] Reconnecting in ${g}ms (attempt ${this.retries + 1})`
              ), this.setConnectionState("reconnecting"), this.reconnectTimeoutId = setTimeout(s, g), this.retries++;
            } else
              this.setConnectionState("failed"), o(new Error(`WebSocket failed after ${this.retries} retries`));
          };
        } catch (m) {
          Ot.error("[WebSocketTransport] Failed to create socket:", m), this.setConnectionState("failed"), o(m);
        }
      };
      s();
    });
  }
  cleanupSocket() {
    this.socket && (this.socket.onopen = null, this.socket.onmessage = null, this.socket.onerror = null, this.socket.onclose = null, this.socket.readyState === 1 && this.socket.close(), this.socket = null);
  }
  setConnectionState(n) {
    var o;
    (o = this.onConnectionStateCallback) == null || o.call(this, n);
  }
  getWebSocketImplementation() {
    if (typeof WebSocket != "undefined")
      return WebSocket;
    try {
      const n = typeof require != "undefined" ? require("ws") : null;
      if (n)
        return n.default || n;
      throw new Error("ws package not available");
    } catch (n) {
      throw new Error(
        'WebSocket not available. Install "ws" package for Node.js: npm install ws'
      );
    }
  }
  fetchFlags(n) {
    return Ie(this, null, function* () {
      var o;
      return this.context = t0(n), this.isReady && ((o = this.socket) == null ? void 0 : o.readyState) === 1 && (this.sendContext(this.context), this.initialFlagsReceived ? yield new Promise((s) => setTimeout(s, 200)) : yield this.waitForInitialFlags()), this.flags;
    });
  }
  onFlagsUpdated(n) {
    this.onFlagsUpdatedCallback = n;
  }
  onConnectionStateChanged(n) {
    this.onConnectionStateCallback = n;
  }
  destroy() {
    Ot.log("[WebSocketTransport] Destroying..."), this.reconnectTimeoutId !== null && (clearTimeout(this.reconnectTimeoutId), this.reconnectTimeoutId = null), this.cleanupSocket(), this.flags = {}, this.context = null, this.isReady = !1, this.initialFlagsReceived = !1, this.initialFlagsPromise = null, this.onFlagsUpdatedCallback = void 0, this.onConnectionStateCallback = void 0, this.retries = 0;
  }
  sendContext(n) {
    if (!this.socket || this.socket.readyState !== 1) {
      Ot.warn("[WebSocketTransport] Socket not ready, cannot send context");
      return;
    }
    const o = JSON.stringify({
      type: "context",
      context: t0(n)
    });
    this.socket.send(o);
  }
}
function Bh(a, n) {
  if (a.type !== "rule")
    return !1;
  const o = a.attribute.split(".").reduce((s, m) => s == null ? void 0 : s[m], n);
  switch (a.operator) {
    case "eq":
      return o === a.value;
    case "neq":
      return o !== a.value;
    case "in":
      return Array.isArray(a.value) && a.value.includes(o);
    case "nin":
      return Array.isArray(a.value) && !a.value.includes(o);
    case "gt":
      return typeof o == "number" && typeof a.value == "number" && o > a.value;
    case "lt":
      return typeof o == "number" && typeof a.value == "number" && o < a.value;
    case "exists":
      return o != null;
    case "not_exists":
      return o == null;
    default:
      return !1;
  }
}
function Iu(a, n) {
  return a.rules.every((o) => Bh(o, n));
}
var Lt = {};
const Ki = typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {};
function Eh() {
  throw new Error("setTimeout has not been defined");
}
function kh() {
  throw new Error("clearTimeout has not been defined");
}
var Fr = Eh, qr = kh;
typeof Ki.setTimeout == "function" && (Fr = setTimeout);
typeof Ki.clearTimeout == "function" && (qr = clearTimeout);
function Ih(a) {
  if (Fr === setTimeout)
    return setTimeout(a, 0);
  if ((Fr === Eh || !Fr) && setTimeout)
    return Fr = setTimeout, setTimeout(a, 0);
  try {
    return Fr(a, 0);
  } catch (n) {
    try {
      return Fr.call(null, a, 0);
    } catch (o) {
      return Fr.call(this, a, 0);
    }
  }
}
function Ru(a) {
  if (qr === clearTimeout)
    return clearTimeout(a);
  if ((qr === kh || !qr) && clearTimeout)
    return qr = clearTimeout, clearTimeout(a);
  try {
    return qr(a);
  } catch (n) {
    try {
      return qr.call(null, a);
    } catch (o) {
      return qr.call(this, a);
    }
  }
}
var xr = [], oi = !1, Wr, bn = -1;
function Tu() {
  !oi || !Wr || (oi = !1, Wr.length ? xr = Wr.concat(xr) : bn = -1, xr.length && Rh());
}
function Rh() {
  if (!oi) {
    var a = Ih(Tu);
    oi = !0;
    for (var n = xr.length; n; ) {
      for (Wr = xr, xr = []; ++bn < n; )
        Wr && Wr[bn].run();
      bn = -1, n = xr.length;
    }
    Wr = null, oi = !1, Ru(a);
  }
}
function Cu(a) {
  var n = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var o = 1; o < arguments.length; o++)
      n[o - 1] = arguments[o];
  xr.push(new Th(a, n)), xr.length === 1 && !oi && Ih(Rh);
}
function Th(a, n) {
  this.fun = a, this.array = n;
}
Th.prototype.run = function() {
  this.fun.apply(null, this.array);
};
var Fu = "browser", qu = "browser", Pu = !0, Du = {}, Nu = [], $u = "", Lu = {}, Uu = {}, Ou = {};
function ti() {
}
var zu = ti, Ku = ti, Hu = ti, Zu = ti, Wu = ti, Vu = ti, Yu = ti;
function Ju(a) {
  throw new Error("process.binding is not supported");
}
function Gu() {
  return "/";
}
function Xu(a) {
  throw new Error("process.chdir is not supported");
}
function ju() {
  return 0;
}
var hi = Ki.performance || {}, Qu = hi.now || hi.mozNow || hi.msNow || hi.oNow || hi.webkitNow || function() {
  return (/* @__PURE__ */ new Date()).getTime();
};
function tl(a) {
  var n = Qu.call(hi) * 1e-3, o = Math.floor(n), s = Math.floor(n % 1 * 1e9);
  return a && (o = o - a[0], s = s - a[1], s < 0 && (o--, s += 1e9)), [o, s];
}
var el = /* @__PURE__ */ new Date();
function rl() {
  var a = /* @__PURE__ */ new Date(), n = a - el;
  return n / 1e3;
}
var we = {
  nextTick: Cu,
  title: Fu,
  browser: Pu,
  env: Du,
  argv: Nu,
  version: $u,
  versions: Lu,
  on: zu,
  addListener: Ku,
  once: Hu,
  off: Zu,
  removeListener: Wu,
  removeAllListeners: Vu,
  emit: Yu,
  binding: Ju,
  cwd: Gu,
  chdir: Xu,
  umask: ju,
  hrtime: tl,
  platform: qu,
  release: Uu,
  config: Ou,
  uptime: rl
}, e0 = { exports: {} }, r0 = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(a, n) {
  var o = br, s = o.Buffer;
  function m(g, y) {
    for (var S in g)
      y[S] = g[S];
  }
  s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? a.exports = o : (m(o, n), n.Buffer = f);
  function f(g, y, S) {
    return s(g, y, S);
  }
  f.prototype = Object.create(s.prototype), m(s, f), f.from = function(g, y, S) {
    if (typeof g == "number")
      throw new TypeError("Argument must not be a number");
    return s(g, y, S);
  }, f.alloc = function(g, y, S) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    var B = s(g);
    return y !== void 0 ? typeof S == "string" ? B.fill(y, S) : B.fill(y) : B.fill(0), B;
  }, f.allocUnsafe = function(g) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    return s(g);
  }, f.allocUnsafeSlow = function(g) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    return o.SlowBuffer(g);
  };
})(r0, r0.exports);
var zt = r0.exports, pf = 65536, il = 4294967295;
function nl() {
  throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`);
}
var fl = zt.Buffer, _n = Xt.crypto || Xt.msCrypto;
_n && _n.getRandomValues ? e0.exports = al : e0.exports = nl;
function al(a, n) {
  if (a > il)
    throw new RangeError("requested too many random bytes");
  var o = fl.allocUnsafe(a);
  if (a > 0)
    if (a > pf)
      for (var s = 0; s < a; s += pf)
        _n.getRandomValues(o.slice(s, s + pf));
    else
      _n.getRandomValues(o);
  return typeof n == "function" ? we.nextTick(function() {
    n(null, o);
  }) : o;
}
var yi = e0.exports, i0 = { exports: {} };
typeof Object.create == "function" ? i0.exports = function(n, o) {
  o && (n.super_ = o, n.prototype = Object.create(o.prototype, {
    constructor: {
      value: n,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : i0.exports = function(n, o) {
  if (o) {
    n.super_ = o;
    var s = function() {
    };
    s.prototype = o.prototype, n.prototype = new s(), n.prototype.constructor = n;
  }
};
var Gt = i0.exports;
const hl = {}, sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hl
}, Symbol.toStringTag, { value: "Module" })), Ne = /* @__PURE__ */ mu(sl);
var ar = zt.Buffer, Ch = Ne.Transform, ol = Gt;
function $r(a) {
  Ch.call(this), this._block = ar.allocUnsafe(a), this._blockSize = a, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
}
ol($r, Ch);
$r.prototype._transform = function(a, n, o) {
  var s = null;
  try {
    this.update(a, n);
  } catch (m) {
    s = m;
  }
  o(s);
};
$r.prototype._flush = function(a) {
  var n = null;
  try {
    this.push(this.digest());
  } catch (o) {
    n = o;
  }
  a(n);
};
var ul = typeof Uint8Array != "undefined", ll = typeof ArrayBuffer != "undefined" && typeof Uint8Array != "undefined" && ArrayBuffer.isView && (ar.prototype instanceof Uint8Array || ar.TYPED_ARRAY_SUPPORT);
function dl(a, n) {
  if (a instanceof ar)
    return a;
  if (typeof a == "string")
    return ar.from(a, n);
  if (ll && ArrayBuffer.isView(a)) {
    if (a.byteLength === 0)
      return ar.alloc(0);
    var o = ar.from(a.buffer, a.byteOffset, a.byteLength);
    if (o.byteLength === a.byteLength)
      return o;
  }
  if (ul && a instanceof Uint8Array || ar.isBuffer(a) && a.constructor && typeof a.constructor.isBuffer == "function" && a.constructor.isBuffer(a))
    return ar.from(a);
  throw new TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.');
}
$r.prototype.update = function(a, n) {
  if (this._finalized)
    throw new Error("Digest already called");
  a = dl(a, n);
  for (var o = this._block, s = 0; this._blockOffset + a.length - s >= this._blockSize; ) {
    for (var m = this._blockOffset; m < this._blockSize; )
      o[m++] = a[s++];
    this._update(), this._blockOffset = 0;
  }
  for (; s < a.length; )
    o[this._blockOffset++] = a[s++];
  for (var f = 0, g = a.length * 8; g > 0; ++f)
    this._length[f] += g, g = this._length[f] / 4294967296 | 0, g > 0 && (this._length[f] -= 4294967296 * g);
  return this;
};
$r.prototype._update = function() {
  throw new Error("_update is not implemented");
};
$r.prototype.digest = function(a) {
  if (this._finalized)
    throw new Error("Digest already called");
  this._finalized = !0;
  var n = this._digest();
  a !== void 0 && (n = n.toString(a)), this._block.fill(0), this._blockOffset = 0;
  for (var o = 0; o < 4; ++o)
    this._length[o] = 0;
  return n;
};
$r.prototype._digest = function() {
  throw new Error("_digest is not implemented");
};
var Fh = $r, cl = Gt, qh = Fh, vl = zt.Buffer, pl = new Array(16);
function Fn() {
  qh.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
}
cl(Fn, qh);
Fn.prototype._update = function() {
  for (var a = pl, n = 0; n < 16; ++n)
    a[n] = this._block.readInt32LE(n * 4);
  var o = this._a, s = this._b, m = this._c, f = this._d;
  o = Re(o, s, m, f, a[0], 3614090360, 7), f = Re(f, o, s, m, a[1], 3905402710, 12), m = Re(m, f, o, s, a[2], 606105819, 17), s = Re(s, m, f, o, a[3], 3250441966, 22), o = Re(o, s, m, f, a[4], 4118548399, 7), f = Re(f, o, s, m, a[5], 1200080426, 12), m = Re(m, f, o, s, a[6], 2821735955, 17), s = Re(s, m, f, o, a[7], 4249261313, 22), o = Re(o, s, m, f, a[8], 1770035416, 7), f = Re(f, o, s, m, a[9], 2336552879, 12), m = Re(m, f, o, s, a[10], 4294925233, 17), s = Re(s, m, f, o, a[11], 2304563134, 22), o = Re(o, s, m, f, a[12], 1804603682, 7), f = Re(f, o, s, m, a[13], 4254626195, 12), m = Re(m, f, o, s, a[14], 2792965006, 17), s = Re(s, m, f, o, a[15], 1236535329, 22), o = Te(o, s, m, f, a[1], 4129170786, 5), f = Te(f, o, s, m, a[6], 3225465664, 9), m = Te(m, f, o, s, a[11], 643717713, 14), s = Te(s, m, f, o, a[0], 3921069994, 20), o = Te(o, s, m, f, a[5], 3593408605, 5), f = Te(f, o, s, m, a[10], 38016083, 9), m = Te(m, f, o, s, a[15], 3634488961, 14), s = Te(s, m, f, o, a[4], 3889429448, 20), o = Te(o, s, m, f, a[9], 568446438, 5), f = Te(f, o, s, m, a[14], 3275163606, 9), m = Te(m, f, o, s, a[3], 4107603335, 14), s = Te(s, m, f, o, a[8], 1163531501, 20), o = Te(o, s, m, f, a[13], 2850285829, 5), f = Te(f, o, s, m, a[2], 4243563512, 9), m = Te(m, f, o, s, a[7], 1735328473, 14), s = Te(s, m, f, o, a[12], 2368359562, 20), o = Ce(o, s, m, f, a[5], 4294588738, 4), f = Ce(f, o, s, m, a[8], 2272392833, 11), m = Ce(m, f, o, s, a[11], 1839030562, 16), s = Ce(s, m, f, o, a[14], 4259657740, 23), o = Ce(o, s, m, f, a[1], 2763975236, 4), f = Ce(f, o, s, m, a[4], 1272893353, 11), m = Ce(m, f, o, s, a[7], 4139469664, 16), s = Ce(s, m, f, o, a[10], 3200236656, 23), o = Ce(o, s, m, f, a[13], 681279174, 4), f = Ce(f, o, s, m, a[0], 3936430074, 11), m = Ce(m, f, o, s, a[3], 3572445317, 16), s = Ce(s, m, f, o, a[6], 76029189, 23), o = Ce(o, s, m, f, a[9], 3654602809, 4), f = Ce(f, o, s, m, a[12], 3873151461, 11), m = Ce(m, f, o, s, a[15], 530742520, 16), s = Ce(s, m, f, o, a[2], 3299628645, 23), o = Fe(o, s, m, f, a[0], 4096336452, 6), f = Fe(f, o, s, m, a[7], 1126891415, 10), m = Fe(m, f, o, s, a[14], 2878612391, 15), s = Fe(s, m, f, o, a[5], 4237533241, 21), o = Fe(o, s, m, f, a[12], 1700485571, 6), f = Fe(f, o, s, m, a[3], 2399980690, 10), m = Fe(m, f, o, s, a[10], 4293915773, 15), s = Fe(s, m, f, o, a[1], 2240044497, 21), o = Fe(o, s, m, f, a[8], 1873313359, 6), f = Fe(f, o, s, m, a[15], 4264355552, 10), m = Fe(m, f, o, s, a[6], 2734768916, 15), s = Fe(s, m, f, o, a[13], 1309151649, 21), o = Fe(o, s, m, f, a[4], 4149444226, 6), f = Fe(f, o, s, m, a[11], 3174756917, 10), m = Fe(m, f, o, s, a[2], 718787259, 15), s = Fe(s, m, f, o, a[9], 3951481745, 21), this._a = this._a + o | 0, this._b = this._b + s | 0, this._c = this._c + m | 0, this._d = this._d + f | 0;
};
Fn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var a = vl.allocUnsafe(16);
  return a.writeInt32LE(this._a, 0), a.writeInt32LE(this._b, 4), a.writeInt32LE(this._c, 8), a.writeInt32LE(this._d, 12), a;
};
function qn(a, n) {
  return a << n | a >>> 32 - n;
}
function Re(a, n, o, s, m, f, g) {
  return qn(a + (n & o | ~n & s) + m + f | 0, g) + n | 0;
}
function Te(a, n, o, s, m, f, g) {
  return qn(a + (n & s | o & ~s) + m + f | 0, g) + n | 0;
}
function Ce(a, n, o, s, m, f, g) {
  return qn(a + (n ^ o ^ s) + m + f | 0, g) + n | 0;
}
function Fe(a, n, o, s, m, f, g) {
  return qn(a + (o ^ (n | ~s)) + m + f | 0, g) + n | 0;
}
var x0 = Fn, mf = br.Buffer, ml = Gt, Ph = Fh, gl = new Array(16), Ii = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8,
  3,
  10,
  14,
  4,
  9,
  15,
  8,
  1,
  2,
  7,
  0,
  6,
  13,
  11,
  5,
  12,
  1,
  9,
  11,
  10,
  0,
  8,
  12,
  4,
  13,
  3,
  7,
  15,
  14,
  5,
  6,
  2,
  4,
  0,
  5,
  9,
  7,
  12,
  2,
  10,
  14,
  1,
  3,
  8,
  11,
  6,
  15,
  13
], Ri = [
  5,
  14,
  7,
  0,
  9,
  2,
  11,
  4,
  13,
  6,
  15,
  8,
  1,
  10,
  3,
  12,
  6,
  11,
  3,
  7,
  0,
  13,
  5,
  10,
  14,
  15,
  8,
  12,
  4,
  9,
  1,
  2,
  15,
  5,
  1,
  3,
  7,
  14,
  6,
  9,
  11,
  8,
  12,
  2,
  10,
  0,
  4,
  13,
  8,
  6,
  4,
  1,
  3,
  11,
  15,
  0,
  5,
  12,
  2,
  13,
  9,
  7,
  10,
  14,
  12,
  15,
  10,
  4,
  1,
  5,
  8,
  7,
  6,
  2,
  13,
  14,
  0,
  3,
  9,
  11
], Ti = [
  11,
  14,
  15,
  12,
  5,
  8,
  7,
  9,
  11,
  13,
  14,
  15,
  6,
  7,
  9,
  8,
  7,
  6,
  8,
  13,
  11,
  9,
  7,
  15,
  7,
  12,
  15,
  9,
  11,
  7,
  13,
  12,
  11,
  13,
  6,
  7,
  14,
  9,
  13,
  15,
  14,
  8,
  13,
  6,
  5,
  12,
  7,
  5,
  11,
  12,
  14,
  15,
  14,
  15,
  9,
  8,
  9,
  14,
  5,
  6,
  8,
  6,
  5,
  12,
  9,
  15,
  5,
  11,
  6,
  8,
  13,
  12,
  5,
  12,
  13,
  14,
  11,
  8,
  5,
  6
], Ci = [
  8,
  9,
  9,
  11,
  13,
  15,
  15,
  5,
  7,
  7,
  8,
  11,
  14,
  14,
  12,
  6,
  9,
  13,
  15,
  7,
  12,
  8,
  9,
  11,
  7,
  7,
  12,
  7,
  6,
  15,
  13,
  11,
  9,
  7,
  15,
  11,
  8,
  6,
  6,
  14,
  12,
  13,
  5,
  14,
  13,
  13,
  7,
  5,
  15,
  5,
  8,
  11,
  14,
  14,
  6,
  14,
  6,
  9,
  12,
  9,
  12,
  5,
  15,
  8,
  8,
  5,
  12,
  9,
  12,
  5,
  14,
  6,
  8,
  13,
  6,
  5,
  15,
  13,
  11,
  11
], Fi = [0, 1518500249, 1859775393, 2400959708, 2840853838], qi = [1352829926, 1548603684, 1836072691, 2053994217, 0];
function Pn() {
  Ph.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
}
ml(Pn, Ph);
Pn.prototype._update = function() {
  for (var a = gl, n = 0; n < 16; ++n)
    a[n] = this._block.readInt32LE(n * 4);
  for (var o = this._a | 0, s = this._b | 0, m = this._c | 0, f = this._d | 0, g = this._e | 0, y = this._a | 0, S = this._b | 0, B = this._c | 0, M = this._d | 0, x = this._e | 0, I = 0; I < 80; I += 1) {
    var k, D;
    I < 16 ? (k = na(o, s, m, f, g, a[Ii[I]], Fi[0], Ti[I]), D = sa(y, S, B, M, x, a[Ri[I]], qi[0], Ci[I])) : I < 32 ? (k = fa(o, s, m, f, g, a[Ii[I]], Fi[1], Ti[I]), D = ha(y, S, B, M, x, a[Ri[I]], qi[1], Ci[I])) : I < 48 ? (k = aa(o, s, m, f, g, a[Ii[I]], Fi[2], Ti[I]), D = aa(y, S, B, M, x, a[Ri[I]], qi[2], Ci[I])) : I < 64 ? (k = ha(o, s, m, f, g, a[Ii[I]], Fi[3], Ti[I]), D = fa(y, S, B, M, x, a[Ri[I]], qi[3], Ci[I])) : (k = sa(o, s, m, f, g, a[Ii[I]], Fi[4], Ti[I]), D = na(y, S, B, M, x, a[Ri[I]], qi[4], Ci[I])), o = g, g = f, f = Xr(m, 10), m = s, s = k, y = x, x = M, M = Xr(B, 10), B = S, S = D;
  }
  var U = this._b + m + M | 0;
  this._b = this._c + f + x | 0, this._c = this._d + g + y | 0, this._d = this._e + o + S | 0, this._e = this._a + s + B | 0, this._a = U;
};
Pn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var a = mf.alloc ? mf.alloc(20) : new mf(20);
  return a.writeInt32LE(this._a, 0), a.writeInt32LE(this._b, 4), a.writeInt32LE(this._c, 8), a.writeInt32LE(this._d, 12), a.writeInt32LE(this._e, 16), a;
};
function Xr(a, n) {
  return a << n | a >>> 32 - n;
}
function na(a, n, o, s, m, f, g, y) {
  return Xr(a + (n ^ o ^ s) + f + g | 0, y) + m | 0;
}
function fa(a, n, o, s, m, f, g, y) {
  return Xr(a + (n & o | ~n & s) + f + g | 0, y) + m | 0;
}
function aa(a, n, o, s, m, f, g, y) {
  return Xr(a + ((n | ~o) ^ s) + f + g | 0, y) + m | 0;
}
function ha(a, n, o, s, m, f, g, y) {
  return Xr(a + (n & s | o & ~s) + f + g | 0, y) + m | 0;
}
function sa(a, n, o, s, m, f, g, y) {
  return Xr(a + (n ^ (o | ~s)) + f + g | 0, y) + m | 0;
}
var _0 = Pn, Dh = { exports: {} }, Nh = zt.Buffer;
function Dn(a, n) {
  this._block = Nh.alloc(a), this._finalSize = n, this._blockSize = a, this._len = 0;
}
Dn.prototype.update = function(a, n) {
  typeof a == "string" && (n = n || "utf8", a = Nh.from(a, n));
  for (var o = this._block, s = this._blockSize, m = a.length, f = this._len, g = 0; g < m; ) {
    for (var y = f % s, S = Math.min(m - g, s - y), B = 0; B < S; B++)
      o[y + B] = a[g + B];
    f += S, g += S, f % s === 0 && this._update(o);
  }
  return this._len += m, this;
};
Dn.prototype.digest = function(a) {
  var n = this._len % this._blockSize;
  this._block[n] = 128, this._block.fill(0, n + 1), n >= this._finalSize && (this._update(this._block), this._block.fill(0));
  var o = this._len * 8;
  if (o <= 4294967295)
    this._block.writeUInt32BE(o, this._blockSize - 4);
  else {
    var s = (o & 4294967295) >>> 0, m = (o - s) / 4294967296;
    this._block.writeUInt32BE(m, this._blockSize - 8), this._block.writeUInt32BE(s, this._blockSize - 4);
  }
  this._update(this._block);
  var f = this._hash();
  return a ? f.toString(a) : f;
};
Dn.prototype._update = function() {
  throw new Error("_update must be implemented by subclass");
};
var wi = Dn, bl = Gt, $h = wi, yl = zt.Buffer, wl = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], Ml = new Array(80);
function Yi() {
  this.init(), this._w = Ml, $h.call(this, 64, 56);
}
bl(Yi, $h);
Yi.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function xl(a) {
  return a << 5 | a >>> 27;
}
function _l(a) {
  return a << 30 | a >>> 2;
}
function Sl(a, n, o, s) {
  return a === 0 ? n & o | ~n & s : a === 2 ? n & o | n & s | o & s : n ^ o ^ s;
}
Yi.prototype._update = function(a) {
  for (var n = this._w, o = this._a | 0, s = this._b | 0, m = this._c | 0, f = this._d | 0, g = this._e | 0, y = 0; y < 16; ++y)
    n[y] = a.readInt32BE(y * 4);
  for (; y < 80; ++y)
    n[y] = n[y - 3] ^ n[y - 8] ^ n[y - 14] ^ n[y - 16];
  for (var S = 0; S < 80; ++S) {
    var B = ~~(S / 20), M = xl(o) + Sl(B, s, m, f) + g + n[S] + wl[B] | 0;
    g = f, f = m, m = _l(s), s = o, o = M;
  }
  this._a = o + this._a | 0, this._b = s + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = g + this._e | 0;
};
Yi.prototype._hash = function() {
  var a = yl.allocUnsafe(20);
  return a.writeInt32BE(this._a | 0, 0), a.writeInt32BE(this._b | 0, 4), a.writeInt32BE(this._c | 0, 8), a.writeInt32BE(this._d | 0, 12), a.writeInt32BE(this._e | 0, 16), a;
};
var Al = Yi, Bl = Gt, Lh = wi, El = zt.Buffer, kl = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], Il = new Array(80);
function Ji() {
  this.init(), this._w = Il, Lh.call(this, 64, 56);
}
Bl(Ji, Lh);
Ji.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function Rl(a) {
  return a << 1 | a >>> 31;
}
function Tl(a) {
  return a << 5 | a >>> 27;
}
function Cl(a) {
  return a << 30 | a >>> 2;
}
function Fl(a, n, o, s) {
  return a === 0 ? n & o | ~n & s : a === 2 ? n & o | n & s | o & s : n ^ o ^ s;
}
Ji.prototype._update = function(a) {
  for (var n = this._w, o = this._a | 0, s = this._b | 0, m = this._c | 0, f = this._d | 0, g = this._e | 0, y = 0; y < 16; ++y)
    n[y] = a.readInt32BE(y * 4);
  for (; y < 80; ++y)
    n[y] = Rl(n[y - 3] ^ n[y - 8] ^ n[y - 14] ^ n[y - 16]);
  for (var S = 0; S < 80; ++S) {
    var B = ~~(S / 20), M = Tl(o) + Fl(B, s, m, f) + g + n[S] + kl[B] | 0;
    g = f, f = m, m = Cl(s), s = o, o = M;
  }
  this._a = o + this._a | 0, this._b = s + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = g + this._e | 0;
};
Ji.prototype._hash = function() {
  var a = El.allocUnsafe(20);
  return a.writeInt32BE(this._a | 0, 0), a.writeInt32BE(this._b | 0, 4), a.writeInt32BE(this._c | 0, 8), a.writeInt32BE(this._d | 0, 12), a.writeInt32BE(this._e | 0, 16), a;
};
var ql = Ji, Pl = Gt, Uh = wi, Dl = zt.Buffer, Nl = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
], $l = new Array(64);
function Gi() {
  this.init(), this._w = $l, Uh.call(this, 64, 56);
}
Pl(Gi, Uh);
Gi.prototype.init = function() {
  return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
};
function Ll(a, n, o) {
  return o ^ a & (n ^ o);
}
function Ul(a, n, o) {
  return a & n | o & (a | n);
}
function Ol(a) {
  return (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
}
function zl(a) {
  return (a >>> 6 | a << 26) ^ (a >>> 11 | a << 21) ^ (a >>> 25 | a << 7);
}
function Kl(a) {
  return (a >>> 7 | a << 25) ^ (a >>> 18 | a << 14) ^ a >>> 3;
}
function Hl(a) {
  return (a >>> 17 | a << 15) ^ (a >>> 19 | a << 13) ^ a >>> 10;
}
Gi.prototype._update = function(a) {
  for (var n = this._w, o = this._a | 0, s = this._b | 0, m = this._c | 0, f = this._d | 0, g = this._e | 0, y = this._f | 0, S = this._g | 0, B = this._h | 0, M = 0; M < 16; ++M)
    n[M] = a.readInt32BE(M * 4);
  for (; M < 64; ++M)
    n[M] = Hl(n[M - 2]) + n[M - 7] + Kl(n[M - 15]) + n[M - 16] | 0;
  for (var x = 0; x < 64; ++x) {
    var I = B + zl(g) + Ll(g, y, S) + Nl[x] + n[x] | 0, k = Ol(o) + Ul(o, s, m) | 0;
    B = S, S = y, y = g, g = f + I | 0, f = m, m = s, s = o, o = I + k | 0;
  }
  this._a = o + this._a | 0, this._b = s + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = g + this._e | 0, this._f = y + this._f | 0, this._g = S + this._g | 0, this._h = B + this._h | 0;
};
Gi.prototype._hash = function() {
  var a = Dl.allocUnsafe(32);
  return a.writeInt32BE(this._a, 0), a.writeInt32BE(this._b, 4), a.writeInt32BE(this._c, 8), a.writeInt32BE(this._d, 12), a.writeInt32BE(this._e, 16), a.writeInt32BE(this._f, 20), a.writeInt32BE(this._g, 24), a.writeInt32BE(this._h, 28), a;
};
var Oh = Gi, Zl = Gt, Wl = Oh, Vl = wi, Yl = zt.Buffer, Jl = new Array(64);
function Nn() {
  this.init(), this._w = Jl, Vl.call(this, 64, 56);
}
Zl(Nn, Wl);
Nn.prototype.init = function() {
  return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
};
Nn.prototype._hash = function() {
  var a = Yl.allocUnsafe(28);
  return a.writeInt32BE(this._a, 0), a.writeInt32BE(this._b, 4), a.writeInt32BE(this._c, 8), a.writeInt32BE(this._d, 12), a.writeInt32BE(this._e, 16), a.writeInt32BE(this._f, 20), a.writeInt32BE(this._g, 24), a;
};
var Gl = Nn, Xl = Gt, zh = wi, jl = zt.Buffer, oa = [
  1116352408,
  3609767458,
  1899447441,
  602891725,
  3049323471,
  3964484399,
  3921009573,
  2173295548,
  961987163,
  4081628472,
  1508970993,
  3053834265,
  2453635748,
  2937671579,
  2870763221,
  3664609560,
  3624381080,
  2734883394,
  310598401,
  1164996542,
  607225278,
  1323610764,
  1426881987,
  3590304994,
  1925078388,
  4068182383,
  2162078206,
  991336113,
  2614888103,
  633803317,
  3248222580,
  3479774868,
  3835390401,
  2666613458,
  4022224774,
  944711139,
  264347078,
  2341262773,
  604807628,
  2007800933,
  770255983,
  1495990901,
  1249150122,
  1856431235,
  1555081692,
  3175218132,
  1996064986,
  2198950837,
  2554220882,
  3999719339,
  2821834349,
  766784016,
  2952996808,
  2566594879,
  3210313671,
  3203337956,
  3336571891,
  1034457026,
  3584528711,
  2466948901,
  113926993,
  3758326383,
  338241895,
  168717936,
  666307205,
  1188179964,
  773529912,
  1546045734,
  1294757372,
  1522805485,
  1396182291,
  2643833823,
  1695183700,
  2343527390,
  1986661051,
  1014477480,
  2177026350,
  1206759142,
  2456956037,
  344077627,
  2730485921,
  1290863460,
  2820302411,
  3158454273,
  3259730800,
  3505952657,
  3345764771,
  106217008,
  3516065817,
  3606008344,
  3600352804,
  1432725776,
  4094571909,
  1467031594,
  275423344,
  851169720,
  430227734,
  3100823752,
  506948616,
  1363258195,
  659060556,
  3750685593,
  883997877,
  3785050280,
  958139571,
  3318307427,
  1322822218,
  3812723403,
  1537002063,
  2003034995,
  1747873779,
  3602036899,
  1955562222,
  1575990012,
  2024104815,
  1125592928,
  2227730452,
  2716904306,
  2361852424,
  442776044,
  2428436474,
  593698344,
  2756734187,
  3733110249,
  3204031479,
  2999351573,
  3329325298,
  3815920427,
  3391569614,
  3928383900,
  3515267271,
  566280711,
  3940187606,
  3454069534,
  4118630271,
  4000239992,
  116418474,
  1914138554,
  174292421,
  2731055270,
  289380356,
  3203993006,
  460393269,
  320620315,
  685471733,
  587496836,
  852142971,
  1086792851,
  1017036298,
  365543100,
  1126000580,
  2618297676,
  1288033470,
  3409855158,
  1501505948,
  4234509866,
  1607167915,
  987167468,
  1816402316,
  1246189591
], Ql = new Array(160);
function Xi() {
  this.init(), this._w = Ql, zh.call(this, 128, 112);
}
Xl(Xi, zh);
Xi.prototype.init = function() {
  return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
};
function ua(a, n, o) {
  return o ^ a & (n ^ o);
}
function la(a, n, o) {
  return a & n | o & (a | n);
}
function da(a, n) {
  return (a >>> 28 | n << 4) ^ (n >>> 2 | a << 30) ^ (n >>> 7 | a << 25);
}
function ca(a, n) {
  return (a >>> 14 | n << 18) ^ (a >>> 18 | n << 14) ^ (n >>> 9 | a << 23);
}
function td(a, n) {
  return (a >>> 1 | n << 31) ^ (a >>> 8 | n << 24) ^ a >>> 7;
}
function ed(a, n) {
  return (a >>> 1 | n << 31) ^ (a >>> 8 | n << 24) ^ (a >>> 7 | n << 25);
}
function rd(a, n) {
  return (a >>> 19 | n << 13) ^ (n >>> 29 | a << 3) ^ a >>> 6;
}
function id(a, n) {
  return (a >>> 19 | n << 13) ^ (n >>> 29 | a << 3) ^ (a >>> 6 | n << 26);
}
function _e(a, n) {
  return a >>> 0 < n >>> 0 ? 1 : 0;
}
Xi.prototype._update = function(a) {
  for (var n = this._w, o = this._ah | 0, s = this._bh | 0, m = this._ch | 0, f = this._dh | 0, g = this._eh | 0, y = this._fh | 0, S = this._gh | 0, B = this._hh | 0, M = this._al | 0, x = this._bl | 0, I = this._cl | 0, k = this._dl | 0, D = this._el | 0, U = this._fl | 0, W = this._gl | 0, z = this._hl | 0, $ = 0; $ < 32; $ += 2)
    n[$] = a.readInt32BE($ * 4), n[$ + 1] = a.readInt32BE($ * 4 + 4);
  for (; $ < 160; $ += 2) {
    var lt = n[$ - 30], H = n[$ - 15 * 2 + 1], At = td(lt, H), Bt = ed(H, lt);
    lt = n[$ - 2 * 2], H = n[$ - 2 * 2 + 1];
    var Ct = rd(lt, H), Et = id(H, lt), Y = n[$ - 7 * 2], It = n[$ - 7 * 2 + 1], p = n[$ - 16 * 2], t = n[$ - 16 * 2 + 1], r = Bt + It | 0, i = At + Y + _e(r, Bt) | 0;
    r = r + Et | 0, i = i + Ct + _e(r, Et) | 0, r = r + t | 0, i = i + p + _e(r, t) | 0, n[$] = i, n[$ + 1] = r;
  }
  for (var h = 0; h < 160; h += 2) {
    i = n[h], r = n[h + 1];
    var d = la(o, s, m), c = la(M, x, I), v = da(o, M), u = da(M, o), e = ca(g, D), l = ca(D, g), b = oa[h], _ = oa[h + 1], C = ua(g, y, S), q = ua(D, U, W), O = z + l | 0, R = B + e + _e(O, z) | 0;
    O = O + q | 0, R = R + C + _e(O, q) | 0, O = O + _ | 0, R = R + b + _e(O, _) | 0, O = O + r | 0, R = R + i + _e(O, r) | 0;
    var P = u + c | 0, N = v + d + _e(P, u) | 0;
    B = S, z = W, S = y, W = U, y = g, U = D, D = k + O | 0, g = f + R + _e(D, k) | 0, f = m, k = I, m = s, I = x, s = o, x = M, M = O + P | 0, o = R + N + _e(M, O) | 0;
  }
  this._al = this._al + M | 0, this._bl = this._bl + x | 0, this._cl = this._cl + I | 0, this._dl = this._dl + k | 0, this._el = this._el + D | 0, this._fl = this._fl + U | 0, this._gl = this._gl + W | 0, this._hl = this._hl + z | 0, this._ah = this._ah + o + _e(this._al, M) | 0, this._bh = this._bh + s + _e(this._bl, x) | 0, this._ch = this._ch + m + _e(this._cl, I) | 0, this._dh = this._dh + f + _e(this._dl, k) | 0, this._eh = this._eh + g + _e(this._el, D) | 0, this._fh = this._fh + y + _e(this._fl, U) | 0, this._gh = this._gh + S + _e(this._gl, W) | 0, this._hh = this._hh + B + _e(this._hl, z) | 0;
};
Xi.prototype._hash = function() {
  var a = jl.allocUnsafe(64);
  function n(o, s, m) {
    a.writeInt32BE(o, m), a.writeInt32BE(s, m + 4);
  }
  return n(this._ah, this._al, 0), n(this._bh, this._bl, 8), n(this._ch, this._cl, 16), n(this._dh, this._dl, 24), n(this._eh, this._el, 32), n(this._fh, this._fl, 40), n(this._gh, this._gl, 48), n(this._hh, this._hl, 56), a;
};
var Kh = Xi, nd = Gt, fd = Kh, ad = wi, hd = zt.Buffer, sd = new Array(160);
function $n() {
  this.init(), this._w = sd, ad.call(this, 128, 112);
}
nd($n, fd);
$n.prototype.init = function() {
  return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
};
$n.prototype._hash = function() {
  var a = hd.allocUnsafe(48);
  function n(o, s, m) {
    a.writeInt32BE(o, m), a.writeInt32BE(s, m + 4);
  }
  return n(this._ah, this._al, 0), n(this._bh, this._bl, 8), n(this._ch, this._cl, 16), n(this._dh, this._dl, 24), n(this._eh, this._el, 32), n(this._fh, this._fl, 40), a;
};
var od = $n, ei = Dh.exports = function(n) {
  n = n.toLowerCase();
  var o = ei[n];
  if (!o)
    throw new Error(n + " is not supported (we accept pull requests)");
  return new o();
};
ei.sha = Al;
ei.sha1 = ql;
ei.sha224 = Gl;
ei.sha256 = Oh;
ei.sha384 = od;
ei.sha512 = Kh;
var S0 = Dh.exports, Sn = {}, n0 = { exports: {} };
(function(a, n) {
  var o = br, s = o.Buffer;
  function m(g, y) {
    for (var S in g)
      y[S] = g[S];
  }
  s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? a.exports = o : (m(o, n), n.Buffer = f);
  function f(g, y, S) {
    return s(g, y, S);
  }
  m(s, f), f.from = function(g, y, S) {
    if (typeof g == "number")
      throw new TypeError("Argument must not be a number");
    return s(g, y, S);
  }, f.alloc = function(g, y, S) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    var B = s(g);
    return y !== void 0 ? typeof S == "string" ? B.fill(y, S) : B.fill(y) : B.fill(0), B;
  }, f.allocUnsafe = function(g) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    return s(g);
  }, f.allocUnsafeSlow = function(g) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    return o.SlowBuffer(g);
  };
})(n0, n0.exports);
var ud = n0.exports, A0 = ud.Buffer, va = A0.isEncoding || function(a) {
  switch (a = "" + a, a && a.toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
    case "raw":
      return !0;
    default:
      return !1;
  }
};
function ld(a) {
  if (!a)
    return "utf8";
  for (var n; ; )
    switch (a) {
      case "utf8":
      case "utf-8":
        return "utf8";
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return "utf16le";
      case "latin1":
      case "binary":
        return "latin1";
      case "base64":
      case "ascii":
      case "hex":
        return a;
      default:
        if (n)
          return;
        a = ("" + a).toLowerCase(), n = !0;
    }
}
function dd(a) {
  var n = ld(a);
  if (typeof n != "string" && (A0.isEncoding === va || !va(a)))
    throw new Error("Unknown encoding: " + a);
  return n || a;
}
Sn.StringDecoder = ji;
function ji(a) {
  this.encoding = dd(a);
  var n;
  switch (this.encoding) {
    case "utf16le":
      this.text = bd, this.end = yd, n = 4;
      break;
    case "utf8":
      this.fillLast = pd, n = 4;
      break;
    case "base64":
      this.text = wd, this.end = Md, n = 3;
      break;
    default:
      this.write = xd, this.end = _d;
      return;
  }
  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = A0.allocUnsafe(n);
}
ji.prototype.write = function(a) {
  if (a.length === 0)
    return "";
  var n, o;
  if (this.lastNeed) {
    if (n = this.fillLast(a), n === void 0)
      return "";
    o = this.lastNeed, this.lastNeed = 0;
  } else
    o = 0;
  return o < a.length ? n ? n + this.text(a, o) : this.text(a, o) : n || "";
};
ji.prototype.end = gd;
ji.prototype.text = md;
ji.prototype.fillLast = function(a) {
  if (this.lastNeed <= a.length)
    return a.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  a.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, a.length), this.lastNeed -= a.length;
};
function gf(a) {
  return a <= 127 ? 0 : a >> 5 === 6 ? 2 : a >> 4 === 14 ? 3 : a >> 3 === 30 ? 4 : a >> 6 === 2 ? -1 : -2;
}
function cd(a, n, o) {
  var s = n.length - 1;
  if (s < o)
    return 0;
  var m = gf(n[s]);
  return m >= 0 ? (m > 0 && (a.lastNeed = m - 1), m) : --s < o || m === -2 ? 0 : (m = gf(n[s]), m >= 0 ? (m > 0 && (a.lastNeed = m - 2), m) : --s < o || m === -2 ? 0 : (m = gf(n[s]), m >= 0 ? (m > 0 && (m === 2 ? m = 0 : a.lastNeed = m - 3), m) : 0));
}
function vd(a, n, o) {
  if ((n[0] & 192) !== 128)
    return a.lastNeed = 0, "�";
  if (a.lastNeed > 1 && n.length > 1) {
    if ((n[1] & 192) !== 128)
      return a.lastNeed = 1, "�";
    if (a.lastNeed > 2 && n.length > 2 && (n[2] & 192) !== 128)
      return a.lastNeed = 2, "�";
  }
}
function pd(a) {
  var n = this.lastTotal - this.lastNeed, o = vd(this, a);
  if (o !== void 0)
    return o;
  if (this.lastNeed <= a.length)
    return a.copy(this.lastChar, n, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  a.copy(this.lastChar, n, 0, a.length), this.lastNeed -= a.length;
}
function md(a, n) {
  var o = cd(this, a, n);
  if (!this.lastNeed)
    return a.toString("utf8", n);
  this.lastTotal = o;
  var s = a.length - (o - this.lastNeed);
  return a.copy(this.lastChar, 0, s), a.toString("utf8", n, s);
}
function gd(a) {
  var n = a && a.length ? this.write(a) : "";
  return this.lastNeed ? n + "�" : n;
}
function bd(a, n) {
  if ((a.length - n) % 2 === 0) {
    var o = a.toString("utf16le", n);
    if (o) {
      var s = o.charCodeAt(o.length - 1);
      if (s >= 55296 && s <= 56319)
        return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = a[a.length - 2], this.lastChar[1] = a[a.length - 1], o.slice(0, -1);
    }
    return o;
  }
  return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = a[a.length - 1], a.toString("utf16le", n, a.length - 1);
}
function yd(a) {
  var n = a && a.length ? this.write(a) : "";
  if (this.lastNeed) {
    var o = this.lastTotal - this.lastNeed;
    return n + this.lastChar.toString("utf16le", 0, o);
  }
  return n;
}
function wd(a, n) {
  var o = (a.length - n) % 3;
  return o === 0 ? a.toString("base64", n) : (this.lastNeed = 3 - o, this.lastTotal = 3, o === 1 ? this.lastChar[0] = a[a.length - 1] : (this.lastChar[0] = a[a.length - 2], this.lastChar[1] = a[a.length - 1]), a.toString("base64", n, a.length - o));
}
function Md(a) {
  var n = a && a.length ? this.write(a) : "";
  return this.lastNeed ? n + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : n;
}
function xd(a) {
  return a.toString(this.encoding);
}
function _d(a) {
  return a && a.length ? this.write(a) : "";
}
var hr = zt.Buffer, Hh = Ne.Transform, Sd = Sn.StringDecoder, Ad = Gt;
function rr(a) {
  Hh.call(this), this.hashMode = typeof a == "string", this.hashMode ? this[a] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
}
Ad(rr, Hh);
var Bd = typeof Uint8Array != "undefined", Ed = typeof ArrayBuffer != "undefined" && typeof Uint8Array != "undefined" && ArrayBuffer.isView && (hr.prototype instanceof Uint8Array || hr.TYPED_ARRAY_SUPPORT);
function kd(a, n) {
  if (a instanceof hr)
    return a;
  if (typeof a == "string")
    return hr.from(a, n);
  if (Ed && ArrayBuffer.isView(a)) {
    if (a.byteLength === 0)
      return hr.alloc(0);
    var o = hr.from(a.buffer, a.byteOffset, a.byteLength);
    if (o.byteLength === a.byteLength)
      return o;
  }
  if (Bd && a instanceof Uint8Array || hr.isBuffer(a) && a.constructor && typeof a.constructor.isBuffer == "function" && a.constructor.isBuffer(a))
    return hr.from(a);
  throw new TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.');
}
rr.prototype.update = function(a, n, o) {
  var s = kd(a, n), m = this._update(s);
  return this.hashMode ? this : (o && (m = this._toString(m, o)), m);
};
rr.prototype.setAutoPadding = function() {
};
rr.prototype.getAuthTag = function() {
  throw new Error("trying to get auth tag in unsupported state");
};
rr.prototype.setAuthTag = function() {
  throw new Error("trying to set auth tag in unsupported state");
};
rr.prototype.setAAD = function() {
  throw new Error("trying to set aad in unsupported state");
};
rr.prototype._transform = function(a, n, o) {
  var s;
  try {
    this.hashMode ? this._update(a) : this.push(this._update(a));
  } catch (m) {
    s = m;
  } finally {
    o(s);
  }
};
rr.prototype._flush = function(a) {
  var n;
  try {
    this.push(this.__final());
  } catch (o) {
    n = o;
  }
  a(n);
};
rr.prototype._finalOrDigest = function(a) {
  var n = this.__final() || hr.alloc(0);
  return a && (n = this._toString(n, a, !0)), n;
};
rr.prototype._toString = function(a, n, o) {
  if (this._decoder || (this._decoder = new Sd(n), this._encoding = n), this._encoding !== n)
    throw new Error("can’t switch encodings");
  var s = this._decoder.write(a);
  return o && (s += this._decoder.end()), s;
};
var Lr = rr, Id = Gt, Rd = x0, Td = _0, Cd = S0, Zh = Lr;
function Ln(a) {
  Zh.call(this, "digest"), this._hash = a;
}
Id(Ln, Zh);
Ln.prototype._update = function(a) {
  this._hash.update(a);
};
Ln.prototype._final = function() {
  return this._hash.digest();
};
var Qi = function(n) {
  return n = n.toLowerCase(), n === "md5" ? new Rd() : n === "rmd160" || n === "ripemd160" ? new Td() : new Ln(Cd(n));
}, Fd = Gt, Vr = zt.Buffer, Wh = Lr, qd = Vr.alloc(128), ai = 64;
function Un(a, n) {
  Wh.call(this, "digest"), typeof n == "string" && (n = Vr.from(n)), this._alg = a, this._key = n, n.length > ai ? n = a(n) : n.length < ai && (n = Vr.concat([n, qd], ai));
  for (var o = this._ipad = Vr.allocUnsafe(ai), s = this._opad = Vr.allocUnsafe(ai), m = 0; m < ai; m++)
    o[m] = n[m] ^ 54, s[m] = n[m] ^ 92;
  this._hash = [o];
}
Fd(Un, Wh);
Un.prototype._update = function(a) {
  this._hash.push(a);
};
Un.prototype._final = function() {
  var a = this._alg(Vr.concat(this._hash));
  return this._alg(Vr.concat([this._opad, a]));
};
var Pd = Un, Dd = x0, Vh = function(a) {
  return new Dd().update(a).digest();
}, Nd = Gt, $d = Pd, Yh = Lr, $i = zt.Buffer, Ld = Vh, f0 = _0, a0 = S0, Ud = $i.alloc(128);
function Hi(a, n) {
  Yh.call(this, "digest"), typeof n == "string" && (n = $i.from(n));
  var o = a === "sha512" || a === "sha384" ? 128 : 64;
  if (this._alg = a, this._key = n, n.length > o) {
    var s = a === "rmd160" ? new f0() : a0(a);
    n = s.update(n).digest();
  } else
    n.length < o && (n = $i.concat([n, Ud], o));
  for (var m = this._ipad = $i.allocUnsafe(o), f = this._opad = $i.allocUnsafe(o), g = 0; g < o; g++)
    m[g] = n[g] ^ 54, f[g] = n[g] ^ 92;
  this._hash = a === "rmd160" ? new f0() : a0(a), this._hash.update(m);
}
Nd(Hi, Yh);
Hi.prototype._update = function(a) {
  this._hash.update(a);
};
Hi.prototype._final = function() {
  var a = this._hash.digest(), n = this._alg === "rmd160" ? new f0() : a0(this._alg);
  return n.update(this._opad).update(a).digest();
};
var Jh = function(n, o) {
  return n = n.toLowerCase(), n === "rmd160" || n === "ripemd160" ? new Hi("rmd160", o) : n === "md5" ? new $d(Ld, o) : new Hi(n, o);
};
const Od = {
  sign: "rsa",
  hash: "sha224",
  id: "302d300d06096086480165030402040500041c"
}, zd = {
  sign: "rsa",
  hash: "sha256",
  id: "3031300d060960864801650304020105000420"
}, Kd = {
  sign: "rsa",
  hash: "sha384",
  id: "3041300d060960864801650304020205000430"
}, Hd = {
  sign: "rsa",
  hash: "sha512",
  id: "3051300d060960864801650304020305000440"
}, Zd = {
  sign: "ecdsa",
  hash: "sha256",
  id: ""
}, Wd = {
  sign: "ecdsa",
  hash: "sha224",
  id: ""
}, Vd = {
  sign: "ecdsa",
  hash: "sha384",
  id: ""
}, Yd = {
  sign: "ecdsa",
  hash: "sha512",
  id: ""
}, Jd = {
  sign: "dsa",
  hash: "sha1",
  id: ""
}, Gd = {
  sign: "rsa",
  hash: "rmd160",
  id: "3021300906052b2403020105000414"
}, Xd = {
  sign: "rsa",
  hash: "md5",
  id: "3020300c06082a864886f70d020505000410"
}, Gh = {
  sha224WithRSAEncryption: Od,
  "RSA-SHA224": {
    sign: "ecdsa/rsa",
    hash: "sha224",
    id: "302d300d06096086480165030402040500041c"
  },
  sha256WithRSAEncryption: zd,
  "RSA-SHA256": {
    sign: "ecdsa/rsa",
    hash: "sha256",
    id: "3031300d060960864801650304020105000420"
  },
  sha384WithRSAEncryption: Kd,
  "RSA-SHA384": {
    sign: "ecdsa/rsa",
    hash: "sha384",
    id: "3041300d060960864801650304020205000430"
  },
  sha512WithRSAEncryption: Hd,
  "RSA-SHA512": {
    sign: "ecdsa/rsa",
    hash: "sha512",
    id: "3051300d060960864801650304020305000440"
  },
  "RSA-SHA1": {
    sign: "rsa",
    hash: "sha1",
    id: "3021300906052b0e03021a05000414"
  },
  "ecdsa-with-SHA1": {
    sign: "ecdsa",
    hash: "sha1",
    id: ""
  },
  sha256: Zd,
  sha224: Wd,
  sha384: Vd,
  sha512: Yd,
  "DSA-SHA": {
    sign: "dsa",
    hash: "sha1",
    id: ""
  },
  "DSA-SHA1": {
    sign: "dsa",
    hash: "sha1",
    id: ""
  },
  DSA: Jd,
  "DSA-WITH-SHA224": {
    sign: "dsa",
    hash: "sha224",
    id: ""
  },
  "DSA-SHA224": {
    sign: "dsa",
    hash: "sha224",
    id: ""
  },
  "DSA-WITH-SHA256": {
    sign: "dsa",
    hash: "sha256",
    id: ""
  },
  "DSA-SHA256": {
    sign: "dsa",
    hash: "sha256",
    id: ""
  },
  "DSA-WITH-SHA384": {
    sign: "dsa",
    hash: "sha384",
    id: ""
  },
  "DSA-SHA384": {
    sign: "dsa",
    hash: "sha384",
    id: ""
  },
  "DSA-WITH-SHA512": {
    sign: "dsa",
    hash: "sha512",
    id: ""
  },
  "DSA-SHA512": {
    sign: "dsa",
    hash: "sha512",
    id: ""
  },
  "DSA-RIPEMD160": {
    sign: "dsa",
    hash: "rmd160",
    id: ""
  },
  ripemd160WithRSA: Gd,
  "RSA-RIPEMD160": {
    sign: "rsa",
    hash: "rmd160",
    id: "3021300906052b2403020105000414"
  },
  md5WithRSAEncryption: Xd,
  "RSA-MD5": {
    sign: "rsa",
    hash: "md5",
    id: "3020300c06082a864886f70d020505000410"
  }
};
var jd = Gh, On = {}, Qd = Math.pow(2, 30) - 1, Xh = function(a, n) {
  if (typeof a != "number")
    throw new TypeError("Iterations not a number");
  if (a < 0)
    throw new TypeError("Bad iterations");
  if (typeof n != "number")
    throw new TypeError("Key length not a number");
  if (n < 0 || n > Qd || n !== n)
    throw new TypeError("Bad key length");
}, yn;
if (Xt.process && Xt.process.browser)
  yn = "utf-8";
else if (Xt.process && Xt.process.version) {
  var tc = parseInt(we.version.split(".")[0].slice(1), 10);
  yn = tc >= 6 ? "utf-8" : "binary";
} else
  yn = "utf-8";
var jh = yn, bf = zt.Buffer, Qh = function(a, n, o) {
  if (bf.isBuffer(a))
    return a;
  if (typeof a == "string")
    return bf.from(a, n);
  if (ArrayBuffer.isView(a))
    return bf.from(a.buffer);
  throw new TypeError(o + " must be a string, a Buffer, a typed array or a DataView");
}, ec = Vh, rc = _0, ic = S0, Yr = zt.Buffer, nc = Xh, pa = jh, ma = Qh, fc = Yr.alloc(128), wn = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
};
function ts(a, n, o) {
  var s = ac(a), m = a === "sha512" || a === "sha384" ? 128 : 64;
  n.length > m ? n = s(n) : n.length < m && (n = Yr.concat([n, fc], m));
  for (var f = Yr.allocUnsafe(m + wn[a]), g = Yr.allocUnsafe(m + wn[a]), y = 0; y < m; y++)
    f[y] = n[y] ^ 54, g[y] = n[y] ^ 92;
  var S = Yr.allocUnsafe(m + o + 4);
  f.copy(S, 0, 0, m), this.ipad1 = S, this.ipad2 = f, this.opad = g, this.alg = a, this.blocksize = m, this.hash = s, this.size = wn[a];
}
ts.prototype.run = function(a, n) {
  a.copy(n, this.blocksize);
  var o = this.hash(n);
  return o.copy(this.opad, this.blocksize), this.hash(this.opad);
};
function ac(a) {
  function n(s) {
    return ic(a).update(s).digest();
  }
  function o(s) {
    return new rc().update(s).digest();
  }
  return a === "rmd160" || a === "ripemd160" ? o : a === "md5" ? ec : n;
}
function hc(a, n, o, s, m) {
  nc(o, s), a = ma(a, pa, "Password"), n = ma(n, pa, "Salt"), m = m || "sha1";
  var f = new ts(m, a, n.length), g = Yr.allocUnsafe(s), y = Yr.allocUnsafe(n.length + 4);
  n.copy(y, 0, 0, n.length);
  for (var S = 0, B = wn[m], M = Math.ceil(s / B), x = 1; x <= M; x++) {
    y.writeUInt32BE(x, n.length);
    for (var I = f.run(y, f.ipad1), k = I, D = 1; D < o; D++) {
      k = f.run(k, f.ipad2);
      for (var U = 0; U < B; U++)
        I[U] ^= k[U];
    }
    I.copy(g, S), S += B;
  }
  return g;
}
var es = hc, rs = zt.Buffer, sc = Xh, ga = jh, ba = es, ya = Qh, un, Oi = Xt.crypto && Xt.crypto.subtle, oc = {
  sha: "SHA-1",
  "sha-1": "SHA-1",
  sha1: "SHA-1",
  sha256: "SHA-256",
  "sha-256": "SHA-256",
  sha384: "SHA-384",
  "sha-384": "SHA-384",
  "sha-512": "SHA-512",
  sha512: "SHA-512"
}, yf = [];
function uc(a) {
  if (Xt.process && !Xt.process.browser || !Oi || !Oi.importKey || !Oi.deriveBits)
    return Promise.resolve(!1);
  if (yf[a] !== void 0)
    return yf[a];
  un = un || rs.alloc(8);
  var n = is(un, un, 10, 128, a).then(function() {
    return !0;
  }).catch(function() {
    return !1;
  });
  return yf[a] = n, n;
}
var Or;
function h0() {
  return Or || (Xt.process && Xt.process.nextTick ? Or = Xt.process.nextTick : Xt.queueMicrotask ? Or = Xt.queueMicrotask : Xt.setImmediate ? Or = Xt.setImmediate : Or = Xt.setTimeout, Or);
}
function is(a, n, o, s, m) {
  return Oi.importKey(
    "raw",
    a,
    { name: "PBKDF2" },
    !1,
    ["deriveBits"]
  ).then(function(f) {
    return Oi.deriveBits({
      name: "PBKDF2",
      salt: n,
      iterations: o,
      hash: {
        name: m
      }
    }, f, s << 3);
  }).then(function(f) {
    return rs.from(f);
  });
}
function lc(a, n) {
  a.then(function(o) {
    h0()(function() {
      n(null, o);
    });
  }, function(o) {
    h0()(function() {
      n(o);
    });
  });
}
var dc = function(a, n, o, s, m, f) {
  typeof m == "function" && (f = m, m = void 0), m = m || "sha1";
  var g = oc[m.toLowerCase()];
  if (!g || typeof Xt.Promise != "function") {
    h0()(function() {
      var y;
      try {
        y = ba(a, n, o, s, m);
      } catch (S) {
        return f(S);
      }
      f(null, y);
    });
    return;
  }
  if (sc(o, s), a = ya(a, ga, "Password"), n = ya(n, ga, "Salt"), typeof f != "function")
    throw new Error("No callback provided to pbkdf2");
  lc(uc(g).then(function(y) {
    return y ? is(a, n, o, s, g) : ba(a, n, o, s, m);
  }), f);
};
On.pbkdf2 = dc;
On.pbkdf2Sync = es;
var tr = {}, Mi = {}, ze = {};
ze.readUInt32BE = function(n, o) {
  var s = n[0 + o] << 24 | n[1 + o] << 16 | n[2 + o] << 8 | n[3 + o];
  return s >>> 0;
};
ze.writeUInt32BE = function(n, o, s) {
  n[0 + s] = o >>> 24, n[1 + s] = o >>> 16 & 255, n[2 + s] = o >>> 8 & 255, n[3 + s] = o & 255;
};
ze.ip = function(n, o, s, m) {
  for (var f = 0, g = 0, y = 6; y >= 0; y -= 2) {
    for (var S = 0; S <= 24; S += 8)
      f <<= 1, f |= o >>> S + y & 1;
    for (var S = 0; S <= 24; S += 8)
      f <<= 1, f |= n >>> S + y & 1;
  }
  for (var y = 6; y >= 0; y -= 2) {
    for (var S = 1; S <= 25; S += 8)
      g <<= 1, g |= o >>> S + y & 1;
    for (var S = 1; S <= 25; S += 8)
      g <<= 1, g |= n >>> S + y & 1;
  }
  s[m + 0] = f >>> 0, s[m + 1] = g >>> 0;
};
ze.rip = function(n, o, s, m) {
  for (var f = 0, g = 0, y = 0; y < 4; y++)
    for (var S = 24; S >= 0; S -= 8)
      f <<= 1, f |= o >>> S + y & 1, f <<= 1, f |= n >>> S + y & 1;
  for (var y = 4; y < 8; y++)
    for (var S = 24; S >= 0; S -= 8)
      g <<= 1, g |= o >>> S + y & 1, g <<= 1, g |= n >>> S + y & 1;
  s[m + 0] = f >>> 0, s[m + 1] = g >>> 0;
};
ze.pc1 = function(n, o, s, m) {
  for (var f = 0, g = 0, y = 7; y >= 5; y--) {
    for (var S = 0; S <= 24; S += 8)
      f <<= 1, f |= o >> S + y & 1;
    for (var S = 0; S <= 24; S += 8)
      f <<= 1, f |= n >> S + y & 1;
  }
  for (var S = 0; S <= 24; S += 8)
    f <<= 1, f |= o >> S + y & 1;
  for (var y = 1; y <= 3; y++) {
    for (var S = 0; S <= 24; S += 8)
      g <<= 1, g |= o >> S + y & 1;
    for (var S = 0; S <= 24; S += 8)
      g <<= 1, g |= n >> S + y & 1;
  }
  for (var S = 0; S <= 24; S += 8)
    g <<= 1, g |= n >> S + y & 1;
  s[m + 0] = f >>> 0, s[m + 1] = g >>> 0;
};
ze.r28shl = function(n, o) {
  return n << o & 268435455 | n >>> 28 - o;
};
var ln = [
  // inL => outL
  14,
  11,
  17,
  4,
  27,
  23,
  25,
  0,
  13,
  22,
  7,
  18,
  5,
  9,
  16,
  24,
  2,
  20,
  12,
  21,
  1,
  8,
  15,
  26,
  // inR => outR
  15,
  4,
  25,
  19,
  9,
  1,
  26,
  16,
  5,
  11,
  23,
  8,
  12,
  7,
  17,
  0,
  22,
  3,
  10,
  14,
  6,
  20,
  27,
  24
];
ze.pc2 = function(n, o, s, m) {
  for (var f = 0, g = 0, y = ln.length >>> 1, S = 0; S < y; S++)
    f <<= 1, f |= n >>> ln[S] & 1;
  for (var S = y; S < ln.length; S++)
    g <<= 1, g |= o >>> ln[S] & 1;
  s[m + 0] = f >>> 0, s[m + 1] = g >>> 0;
};
ze.expand = function(n, o, s) {
  var m = 0, f = 0;
  m = (n & 1) << 5 | n >>> 27;
  for (var g = 23; g >= 15; g -= 4)
    m <<= 6, m |= n >>> g & 63;
  for (var g = 11; g >= 3; g -= 4)
    f |= n >>> g & 63, f <<= 6;
  f |= (n & 31) << 1 | n >>> 31, o[s + 0] = m >>> 0, o[s + 1] = f >>> 0;
};
var wa = [
  14,
  0,
  4,
  15,
  13,
  7,
  1,
  4,
  2,
  14,
  15,
  2,
  11,
  13,
  8,
  1,
  3,
  10,
  10,
  6,
  6,
  12,
  12,
  11,
  5,
  9,
  9,
  5,
  0,
  3,
  7,
  8,
  4,
  15,
  1,
  12,
  14,
  8,
  8,
  2,
  13,
  4,
  6,
  9,
  2,
  1,
  11,
  7,
  15,
  5,
  12,
  11,
  9,
  3,
  7,
  14,
  3,
  10,
  10,
  0,
  5,
  6,
  0,
  13,
  15,
  3,
  1,
  13,
  8,
  4,
  14,
  7,
  6,
  15,
  11,
  2,
  3,
  8,
  4,
  14,
  9,
  12,
  7,
  0,
  2,
  1,
  13,
  10,
  12,
  6,
  0,
  9,
  5,
  11,
  10,
  5,
  0,
  13,
  14,
  8,
  7,
  10,
  11,
  1,
  10,
  3,
  4,
  15,
  13,
  4,
  1,
  2,
  5,
  11,
  8,
  6,
  12,
  7,
  6,
  12,
  9,
  0,
  3,
  5,
  2,
  14,
  15,
  9,
  10,
  13,
  0,
  7,
  9,
  0,
  14,
  9,
  6,
  3,
  3,
  4,
  15,
  6,
  5,
  10,
  1,
  2,
  13,
  8,
  12,
  5,
  7,
  14,
  11,
  12,
  4,
  11,
  2,
  15,
  8,
  1,
  13,
  1,
  6,
  10,
  4,
  13,
  9,
  0,
  8,
  6,
  15,
  9,
  3,
  8,
  0,
  7,
  11,
  4,
  1,
  15,
  2,
  14,
  12,
  3,
  5,
  11,
  10,
  5,
  14,
  2,
  7,
  12,
  7,
  13,
  13,
  8,
  14,
  11,
  3,
  5,
  0,
  6,
  6,
  15,
  9,
  0,
  10,
  3,
  1,
  4,
  2,
  7,
  8,
  2,
  5,
  12,
  11,
  1,
  12,
  10,
  4,
  14,
  15,
  9,
  10,
  3,
  6,
  15,
  9,
  0,
  0,
  6,
  12,
  10,
  11,
  1,
  7,
  13,
  13,
  8,
  15,
  9,
  1,
  4,
  3,
  5,
  14,
  11,
  5,
  12,
  2,
  7,
  8,
  2,
  4,
  14,
  2,
  14,
  12,
  11,
  4,
  2,
  1,
  12,
  7,
  4,
  10,
  7,
  11,
  13,
  6,
  1,
  8,
  5,
  5,
  0,
  3,
  15,
  15,
  10,
  13,
  3,
  0,
  9,
  14,
  8,
  9,
  6,
  4,
  11,
  2,
  8,
  1,
  12,
  11,
  7,
  10,
  1,
  13,
  14,
  7,
  2,
  8,
  13,
  15,
  6,
  9,
  15,
  12,
  0,
  5,
  9,
  6,
  10,
  3,
  4,
  0,
  5,
  14,
  3,
  12,
  10,
  1,
  15,
  10,
  4,
  15,
  2,
  9,
  7,
  2,
  12,
  6,
  9,
  8,
  5,
  0,
  6,
  13,
  1,
  3,
  13,
  4,
  14,
  14,
  0,
  7,
  11,
  5,
  3,
  11,
  8,
  9,
  4,
  14,
  3,
  15,
  2,
  5,
  12,
  2,
  9,
  8,
  5,
  12,
  15,
  3,
  10,
  7,
  11,
  0,
  14,
  4,
  1,
  10,
  7,
  1,
  6,
  13,
  0,
  11,
  8,
  6,
  13,
  4,
  13,
  11,
  0,
  2,
  11,
  14,
  7,
  15,
  4,
  0,
  9,
  8,
  1,
  13,
  10,
  3,
  14,
  12,
  3,
  9,
  5,
  7,
  12,
  5,
  2,
  10,
  15,
  6,
  8,
  1,
  6,
  1,
  6,
  4,
  11,
  11,
  13,
  13,
  8,
  12,
  1,
  3,
  4,
  7,
  10,
  14,
  7,
  10,
  9,
  15,
  5,
  6,
  0,
  8,
  15,
  0,
  14,
  5,
  2,
  9,
  3,
  2,
  12,
  13,
  1,
  2,
  15,
  8,
  13,
  4,
  8,
  6,
  10,
  15,
  3,
  11,
  7,
  1,
  4,
  10,
  12,
  9,
  5,
  3,
  6,
  14,
  11,
  5,
  0,
  0,
  14,
  12,
  9,
  7,
  2,
  7,
  2,
  11,
  1,
  4,
  14,
  1,
  7,
  9,
  4,
  12,
  10,
  14,
  8,
  2,
  13,
  0,
  15,
  6,
  12,
  10,
  9,
  13,
  0,
  15,
  3,
  3,
  5,
  5,
  6,
  8,
  11
];
ze.substitute = function(n, o) {
  for (var s = 0, m = 0; m < 4; m++) {
    var f = n >>> 18 - m * 6 & 63, g = wa[m * 64 + f];
    s <<= 4, s |= g;
  }
  for (var m = 0; m < 4; m++) {
    var f = o >>> 18 - m * 6 & 63, g = wa[4 * 64 + m * 64 + f];
    s <<= 4, s |= g;
  }
  return s >>> 0;
};
var Ma = [
  16,
  25,
  12,
  11,
  3,
  20,
  4,
  15,
  31,
  17,
  9,
  6,
  27,
  14,
  1,
  22,
  30,
  24,
  8,
  18,
  0,
  5,
  29,
  23,
  13,
  19,
  2,
  26,
  10,
  21,
  28,
  7
];
ze.permute = function(n) {
  for (var o = 0, s = 0; s < Ma.length; s++)
    o <<= 1, o |= n >>> Ma[s] & 1;
  return o >>> 0;
};
ze.padSplit = function(n, o, s) {
  for (var m = n.toString(2); m.length < o; )
    m = "0" + m;
  for (var f = [], g = 0; g < o; g += s)
    f.push(m.slice(g, g + s));
  return f.join(" ");
};
var Ve = ns;
function ns(a, n) {
  if (!a)
    throw new Error(n || "Assertion failed");
}
ns.equal = function(n, o, s) {
  if (n != o)
    throw new Error(s || "Assertion failed: " + n + " != " + o);
};
var cc = Ve;
function Ye(a) {
  this.options = a, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0, this.padding = a.padding !== !1;
}
var B0 = Ye;
Ye.prototype._init = function() {
};
Ye.prototype.update = function(n) {
  return n.length === 0 ? [] : this.type === "decrypt" ? this._updateDecrypt(n) : this._updateEncrypt(n);
};
Ye.prototype._buffer = function(n, o) {
  for (var s = Math.min(this.buffer.length - this.bufferOff, n.length - o), m = 0; m < s; m++)
    this.buffer[this.bufferOff + m] = n[o + m];
  return this.bufferOff += s, s;
};
Ye.prototype._flushBuffer = function(n, o) {
  return this._update(this.buffer, 0, n, o), this.bufferOff = 0, this.blockSize;
};
Ye.prototype._updateEncrypt = function(n) {
  var o = 0, s = 0, m = (this.bufferOff + n.length) / this.blockSize | 0, f = new Array(m * this.blockSize);
  this.bufferOff !== 0 && (o += this._buffer(n, o), this.bufferOff === this.buffer.length && (s += this._flushBuffer(f, s)));
  for (var g = n.length - (n.length - o) % this.blockSize; o < g; o += this.blockSize)
    this._update(n, o, f, s), s += this.blockSize;
  for (; o < n.length; o++, this.bufferOff++)
    this.buffer[this.bufferOff] = n[o];
  return f;
};
Ye.prototype._updateDecrypt = function(n) {
  for (var o = 0, s = 0, m = Math.ceil((this.bufferOff + n.length) / this.blockSize) - 1, f = new Array(m * this.blockSize); m > 0; m--)
    o += this._buffer(n, o), s += this._flushBuffer(f, s);
  return o += this._buffer(n, o), f;
};
Ye.prototype.final = function(n) {
  var o;
  n && (o = this.update(n));
  var s;
  return this.type === "encrypt" ? s = this._finalEncrypt() : s = this._finalDecrypt(), o ? o.concat(s) : s;
};
Ye.prototype._pad = function(n, o) {
  if (o === 0)
    return !1;
  for (; o < n.length; )
    n[o++] = 0;
  return !0;
};
Ye.prototype._finalEncrypt = function() {
  if (!this._pad(this.buffer, this.bufferOff))
    return [];
  var n = new Array(this.blockSize);
  return this._update(this.buffer, 0, n, 0), n;
};
Ye.prototype._unpad = function(n) {
  return n;
};
Ye.prototype._finalDecrypt = function() {
  cc.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
  var n = new Array(this.blockSize);
  return this._flushBuffer(n, 0), this._unpad(n);
};
var fs = Ve, vc = Gt, xe = ze, as = B0;
function pc() {
  this.tmp = new Array(2), this.keys = null;
}
function cr(a) {
  as.call(this, a);
  var n = new pc();
  this._desState = n, this.deriveKeys(n, a.key);
}
vc(cr, as);
var hs = cr;
cr.create = function(n) {
  return new cr(n);
};
var mc = [
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  2,
  1,
  2,
  2,
  2,
  2,
  2,
  2,
  1
];
cr.prototype.deriveKeys = function(n, o) {
  n.keys = new Array(16 * 2), fs.equal(o.length, this.blockSize, "Invalid key length");
  var s = xe.readUInt32BE(o, 0), m = xe.readUInt32BE(o, 4);
  xe.pc1(s, m, n.tmp, 0), s = n.tmp[0], m = n.tmp[1];
  for (var f = 0; f < n.keys.length; f += 2) {
    var g = mc[f >>> 1];
    s = xe.r28shl(s, g), m = xe.r28shl(m, g), xe.pc2(s, m, n.keys, f);
  }
};
cr.prototype._update = function(n, o, s, m) {
  var f = this._desState, g = xe.readUInt32BE(n, o), y = xe.readUInt32BE(n, o + 4);
  xe.ip(g, y, f.tmp, 0), g = f.tmp[0], y = f.tmp[1], this.type === "encrypt" ? this._encrypt(f, g, y, f.tmp, 0) : this._decrypt(f, g, y, f.tmp, 0), g = f.tmp[0], y = f.tmp[1], xe.writeUInt32BE(s, g, m), xe.writeUInt32BE(s, y, m + 4);
};
cr.prototype._pad = function(n, o) {
  if (this.padding === !1)
    return !1;
  for (var s = n.length - o, m = o; m < n.length; m++)
    n[m] = s;
  return !0;
};
cr.prototype._unpad = function(n) {
  if (this.padding === !1)
    return n;
  for (var o = n[n.length - 1], s = n.length - o; s < n.length; s++)
    fs.equal(n[s], o);
  return n.slice(0, n.length - o);
};
cr.prototype._encrypt = function(n, o, s, m, f) {
  for (var g = o, y = s, S = 0; S < n.keys.length; S += 2) {
    var B = n.keys[S], M = n.keys[S + 1];
    xe.expand(y, n.tmp, 0), B ^= n.tmp[0], M ^= n.tmp[1];
    var x = xe.substitute(B, M), I = xe.permute(x), k = y;
    y = (g ^ I) >>> 0, g = k;
  }
  xe.rip(y, g, m, f);
};
cr.prototype._decrypt = function(n, o, s, m, f) {
  for (var g = s, y = o, S = n.keys.length - 2; S >= 0; S -= 2) {
    var B = n.keys[S], M = n.keys[S + 1];
    xe.expand(g, n.tmp, 0), B ^= n.tmp[0], M ^= n.tmp[1];
    var x = xe.substitute(B, M), I = xe.permute(x), k = g;
    g = (y ^ I) >>> 0, y = k;
  }
  xe.rip(g, y, m, f);
};
var ss = {}, gc = Ve, bc = Gt, An = {};
function yc(a) {
  gc.equal(a.length, 8, "Invalid IV length"), this.iv = new Array(8);
  for (var n = 0; n < this.iv.length; n++)
    this.iv[n] = a[n];
}
function wc(a) {
  function n(f) {
    a.call(this, f), this._cbcInit();
  }
  bc(n, a);
  for (var o = Object.keys(An), s = 0; s < o.length; s++) {
    var m = o[s];
    n.prototype[m] = An[m];
  }
  return n.create = function(g) {
    return new n(g);
  }, n;
}
ss.instantiate = wc;
An._cbcInit = function() {
  var n = new yc(this.options.iv);
  this._cbcState = n;
};
An._update = function(n, o, s, m) {
  var f = this._cbcState, g = this.constructor.super_.prototype, y = f.iv;
  if (this.type === "encrypt") {
    for (var S = 0; S < this.blockSize; S++)
      y[S] ^= n[o + S];
    g._update.call(this, y, 0, s, m);
    for (var S = 0; S < this.blockSize; S++)
      y[S] = s[m + S];
  } else {
    g._update.call(this, n, o, s, m);
    for (var S = 0; S < this.blockSize; S++)
      s[m + S] ^= y[S];
    for (var S = 0; S < this.blockSize; S++)
      y[S] = n[o + S];
  }
};
var Mc = Ve, xc = Gt, os = B0, Pr = hs;
function _c(a, n) {
  Mc.equal(n.length, 24, "Invalid key length");
  var o = n.slice(0, 8), s = n.slice(8, 16), m = n.slice(16, 24);
  a === "encrypt" ? this.ciphers = [
    Pr.create({ type: "encrypt", key: o }),
    Pr.create({ type: "decrypt", key: s }),
    Pr.create({ type: "encrypt", key: m })
  ] : this.ciphers = [
    Pr.create({ type: "decrypt", key: m }),
    Pr.create({ type: "encrypt", key: s }),
    Pr.create({ type: "decrypt", key: o })
  ];
}
function jr(a) {
  os.call(this, a);
  var n = new _c(this.type, this.options.key);
  this._edeState = n;
}
xc(jr, os);
var Sc = jr;
jr.create = function(n) {
  return new jr(n);
};
jr.prototype._update = function(n, o, s, m) {
  var f = this._edeState;
  f.ciphers[0]._update(n, o, s, m), f.ciphers[1]._update(s, m, s, m), f.ciphers[2]._update(s, m, s, m);
};
jr.prototype._pad = Pr.prototype._pad;
jr.prototype._unpad = Pr.prototype._unpad;
Mi.utils = ze;
Mi.Cipher = B0;
Mi.DES = hs;
Mi.CBC = ss;
Mi.EDE = Sc;
var us = Lr, Mr = Mi, Ac = Gt, Zr = zt.Buffer, Zi = {
  "des-ede3-cbc": Mr.CBC.instantiate(Mr.EDE),
  "des-ede3": Mr.EDE,
  "des-ede-cbc": Mr.CBC.instantiate(Mr.EDE),
  "des-ede": Mr.EDE,
  "des-cbc": Mr.CBC.instantiate(Mr.DES),
  "des-ecb": Mr.DES
};
Zi.des = Zi["des-cbc"];
Zi.des3 = Zi["des-ede3-cbc"];
var Bc = zn;
Ac(zn, us);
function zn(a) {
  us.call(this);
  var n = a.mode.toLowerCase(), o = Zi[n], s;
  a.decrypt ? s = "decrypt" : s = "encrypt";
  var m = a.key;
  Zr.isBuffer(m) || (m = Zr.from(m)), (n === "des-ede" || n === "des-ede-cbc") && (m = Zr.concat([m, m.slice(0, 8)]));
  var f = a.iv;
  Zr.isBuffer(f) || (f = Zr.from(f)), this._des = o.create({
    key: m,
    iv: f,
    type: s
  });
}
zn.prototype._update = function(a) {
  return Zr.from(this._des.update(a));
};
zn.prototype._final = function() {
  return Zr.from(this._des.final());
};
var Oe = {}, E0 = {}, k0 = {};
k0.encrypt = function(a, n) {
  return a._cipher.encryptBlock(n);
};
k0.decrypt = function(a, n) {
  return a._cipher.decryptBlock(n);
};
var I0 = {}, or = [], Ze = [], Ec = typeof Uint8Array != "undefined" ? Uint8Array : Array, R0 = !1;
function ls() {
  R0 = !0;
  for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, o = a.length; n < o; ++n)
    or[n] = a[n], Ze[a.charCodeAt(n)] = n;
  Ze["-".charCodeAt(0)] = 62, Ze["_".charCodeAt(0)] = 63;
}
function kc(a) {
  R0 || ls();
  var n, o, s, m, f, g, y = a.length;
  if (y % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  f = a[y - 2] === "=" ? 2 : a[y - 1] === "=" ? 1 : 0, g = new Ec(y * 3 / 4 - f), s = f > 0 ? y - 4 : y;
  var S = 0;
  for (n = 0, o = 0; n < s; n += 4, o += 3)
    m = Ze[a.charCodeAt(n)] << 18 | Ze[a.charCodeAt(n + 1)] << 12 | Ze[a.charCodeAt(n + 2)] << 6 | Ze[a.charCodeAt(n + 3)], g[S++] = m >> 16 & 255, g[S++] = m >> 8 & 255, g[S++] = m & 255;
  return f === 2 ? (m = Ze[a.charCodeAt(n)] << 2 | Ze[a.charCodeAt(n + 1)] >> 4, g[S++] = m & 255) : f === 1 && (m = Ze[a.charCodeAt(n)] << 10 | Ze[a.charCodeAt(n + 1)] << 4 | Ze[a.charCodeAt(n + 2)] >> 2, g[S++] = m >> 8 & 255, g[S++] = m & 255), g;
}
function Ic(a) {
  return or[a >> 18 & 63] + or[a >> 12 & 63] + or[a >> 6 & 63] + or[a & 63];
}
function Rc(a, n, o) {
  for (var s, m = [], f = n; f < o; f += 3)
    s = (a[f] << 16) + (a[f + 1] << 8) + a[f + 2], m.push(Ic(s));
  return m.join("");
}
function xa(a) {
  R0 || ls();
  for (var n, o = a.length, s = o % 3, m = "", f = [], g = 16383, y = 0, S = o - s; y < S; y += g)
    f.push(Rc(a, y, y + g > S ? S : y + g));
  return s === 1 ? (n = a[o - 1], m += or[n >> 2], m += or[n << 4 & 63], m += "==") : s === 2 && (n = (a[o - 2] << 8) + a[o - 1], m += or[n >> 10], m += or[n >> 4 & 63], m += or[n << 2 & 63], m += "="), f.push(m), f.join("");
}
function Kn(a, n, o, s, m) {
  var f, g, y = m * 8 - s - 1, S = (1 << y) - 1, B = S >> 1, M = -7, x = o ? m - 1 : 0, I = o ? -1 : 1, k = a[n + x];
  for (x += I, f = k & (1 << -M) - 1, k >>= -M, M += y; M > 0; f = f * 256 + a[n + x], x += I, M -= 8)
    ;
  for (g = f & (1 << -M) - 1, f >>= -M, M += s; M > 0; g = g * 256 + a[n + x], x += I, M -= 8)
    ;
  if (f === 0)
    f = 1 - B;
  else {
    if (f === S)
      return g ? NaN : (k ? -1 : 1) * (1 / 0);
    g = g + Math.pow(2, s), f = f - B;
  }
  return (k ? -1 : 1) * g * Math.pow(2, f - s);
}
function ds(a, n, o, s, m, f) {
  var g, y, S, B = f * 8 - m - 1, M = (1 << B) - 1, x = M >> 1, I = m === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, k = s ? 0 : f - 1, D = s ? 1 : -1, U = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
  for (n = Math.abs(n), isNaN(n) || n === 1 / 0 ? (y = isNaN(n) ? 1 : 0, g = M) : (g = Math.floor(Math.log(n) / Math.LN2), n * (S = Math.pow(2, -g)) < 1 && (g--, S *= 2), g + x >= 1 ? n += I / S : n += I * Math.pow(2, 1 - x), n * S >= 2 && (g++, S /= 2), g + x >= M ? (y = 0, g = M) : g + x >= 1 ? (y = (n * S - 1) * Math.pow(2, m), g = g + x) : (y = n * Math.pow(2, x - 1) * Math.pow(2, m), g = 0)); m >= 8; a[o + k] = y & 255, k += D, y /= 256, m -= 8)
    ;
  for (g = g << m | y, B += m; B > 0; a[o + k] = g & 255, k += D, g /= 256, B -= 8)
    ;
  a[o + k - D] |= U * 128;
}
var Tc = {}.toString, cs = Array.isArray || function(a) {
  return Tc.call(a) == "[object Array]";
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var Cc = 50;
mt.TYPED_ARRAY_SUPPORT = Ki.TYPED_ARRAY_SUPPORT !== void 0 ? Ki.TYPED_ARRAY_SUPPORT : !0;
Bn();
function Bn() {
  return mt.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function _r(a, n) {
  if (Bn() < n)
    throw new RangeError("Invalid typed array length");
  return mt.TYPED_ARRAY_SUPPORT ? (a = new Uint8Array(n), a.__proto__ = mt.prototype) : (a === null && (a = new mt(n)), a.length = n), a;
}
function mt(a, n, o) {
  if (!mt.TYPED_ARRAY_SUPPORT && !(this instanceof mt))
    return new mt(a, n, o);
  if (typeof a == "number") {
    if (typeof n == "string")
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    return T0(this, a);
  }
  return vs(this, a, n, o);
}
mt.poolSize = 8192;
mt._augment = function(a) {
  return a.__proto__ = mt.prototype, a;
};
function vs(a, n, o, s) {
  if (typeof n == "number")
    throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer != "undefined" && n instanceof ArrayBuffer ? Pc(a, n, o, s) : typeof n == "string" ? qc(a, n, o) : Dc(a, n);
}
mt.from = function(a, n, o) {
  return vs(null, a, n, o);
};
mt.TYPED_ARRAY_SUPPORT && (mt.prototype.__proto__ = Uint8Array.prototype, mt.__proto__ = Uint8Array, typeof Symbol != "undefined" && Symbol.species && mt[Symbol.species]);
function ps(a) {
  if (typeof a != "number")
    throw new TypeError('"size" argument must be a number');
  if (a < 0)
    throw new RangeError('"size" argument must not be negative');
}
function Fc(a, n, o, s) {
  return ps(n), n <= 0 ? _r(a, n) : o !== void 0 ? typeof s == "string" ? _r(a, n).fill(o, s) : _r(a, n).fill(o) : _r(a, n);
}
mt.alloc = function(a, n, o) {
  return Fc(null, a, n, o);
};
function T0(a, n) {
  if (ps(n), a = _r(a, n < 0 ? 0 : C0(n) | 0), !mt.TYPED_ARRAY_SUPPORT)
    for (var o = 0; o < n; ++o)
      a[o] = 0;
  return a;
}
mt.allocUnsafe = function(a) {
  return T0(null, a);
};
mt.allocUnsafeSlow = function(a) {
  return T0(null, a);
};
function qc(a, n, o) {
  if ((typeof o != "string" || o === "") && (o = "utf8"), !mt.isEncoding(o))
    throw new TypeError('"encoding" must be a valid string encoding');
  var s = ms(n, o) | 0;
  a = _r(a, s);
  var m = a.write(n, o);
  return m !== s && (a = a.slice(0, m)), a;
}
function s0(a, n) {
  var o = n.length < 0 ? 0 : C0(n.length) | 0;
  a = _r(a, o);
  for (var s = 0; s < o; s += 1)
    a[s] = n[s] & 255;
  return a;
}
function Pc(a, n, o, s) {
  if (n.byteLength, o < 0 || n.byteLength < o)
    throw new RangeError("'offset' is out of bounds");
  if (n.byteLength < o + (s || 0))
    throw new RangeError("'length' is out of bounds");
  return o === void 0 && s === void 0 ? n = new Uint8Array(n) : s === void 0 ? n = new Uint8Array(n, o) : n = new Uint8Array(n, o, s), mt.TYPED_ARRAY_SUPPORT ? (a = n, a.__proto__ = mt.prototype) : a = s0(a, n), a;
}
function Dc(a, n) {
  if (vr(n)) {
    var o = C0(n.length) | 0;
    return a = _r(a, o), a.length === 0 || n.copy(a, 0, 0, o), a;
  }
  if (n) {
    if (typeof ArrayBuffer != "undefined" && n.buffer instanceof ArrayBuffer || "length" in n)
      return typeof n.length != "number" || e1(n.length) ? _r(a, 0) : s0(a, n);
    if (n.type === "Buffer" && cs(n.data))
      return s0(a, n.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function C0(a) {
  if (a >= Bn())
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + Bn().toString(16) + " bytes");
  return a | 0;
}
mt.isBuffer = r1;
function vr(a) {
  return !!(a != null && a._isBuffer);
}
mt.compare = function(n, o) {
  if (!vr(n) || !vr(o))
    throw new TypeError("Arguments must be Buffers");
  if (n === o)
    return 0;
  for (var s = n.length, m = o.length, f = 0, g = Math.min(s, m); f < g; ++f)
    if (n[f] !== o[f]) {
      s = n[f], m = o[f];
      break;
    }
  return s < m ? -1 : m < s ? 1 : 0;
};
mt.isEncoding = function(n) {
  switch (String(n).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return !0;
    default:
      return !1;
  }
};
mt.concat = function(n, o) {
  if (!cs(n))
    throw new TypeError('"list" argument must be an Array of Buffers');
  if (n.length === 0)
    return mt.alloc(0);
  var s;
  if (o === void 0)
    for (o = 0, s = 0; s < n.length; ++s)
      o += n[s].length;
  var m = mt.allocUnsafe(o), f = 0;
  for (s = 0; s < n.length; ++s) {
    var g = n[s];
    if (!vr(g))
      throw new TypeError('"list" argument must be an Array of Buffers');
    g.copy(m, f), f += g.length;
  }
  return m;
};
function ms(a, n) {
  if (vr(a))
    return a.length;
  if (typeof ArrayBuffer != "undefined" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(a) || a instanceof ArrayBuffer))
    return a.byteLength;
  typeof a != "string" && (a = "" + a);
  var o = a.length;
  if (o === 0)
    return 0;
  for (var s = !1; ; )
    switch (n) {
      case "ascii":
      case "latin1":
      case "binary":
        return o;
      case "utf8":
      case "utf-8":
      case void 0:
        return En(a).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return o * 2;
      case "hex":
        return o >>> 1;
      case "base64":
        return _s(a).length;
      default:
        if (s)
          return En(a).length;
        n = ("" + n).toLowerCase(), s = !0;
    }
}
mt.byteLength = ms;
function Nc(a, n, o) {
  var s = !1;
  if ((n === void 0 || n < 0) && (n = 0), n > this.length || ((o === void 0 || o > this.length) && (o = this.length), o <= 0) || (o >>>= 0, n >>>= 0, o <= n))
    return "";
  for (a || (a = "utf8"); ; )
    switch (a) {
      case "hex":
        return Vc(this, n, o);
      case "utf8":
      case "utf-8":
        return ys(this, n, o);
      case "ascii":
        return Zc(this, n, o);
      case "latin1":
      case "binary":
        return Wc(this, n, o);
      case "base64":
        return Kc(this, n, o);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Yc(this, n, o);
      default:
        if (s)
          throw new TypeError("Unknown encoding: " + a);
        a = (a + "").toLowerCase(), s = !0;
    }
}
mt.prototype._isBuffer = !0;
function Jr(a, n, o) {
  var s = a[n];
  a[n] = a[o], a[o] = s;
}
mt.prototype.swap16 = function() {
  var n = this.length;
  if (n % 2 !== 0)
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var o = 0; o < n; o += 2)
    Jr(this, o, o + 1);
  return this;
};
mt.prototype.swap32 = function() {
  var n = this.length;
  if (n % 4 !== 0)
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var o = 0; o < n; o += 4)
    Jr(this, o, o + 3), Jr(this, o + 1, o + 2);
  return this;
};
mt.prototype.swap64 = function() {
  var n = this.length;
  if (n % 8 !== 0)
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var o = 0; o < n; o += 8)
    Jr(this, o, o + 7), Jr(this, o + 1, o + 6), Jr(this, o + 2, o + 5), Jr(this, o + 3, o + 4);
  return this;
};
mt.prototype.toString = function() {
  var n = this.length | 0;
  return n === 0 ? "" : arguments.length === 0 ? ys(this, 0, n) : Nc.apply(this, arguments);
};
mt.prototype.equals = function(n) {
  if (!vr(n))
    throw new TypeError("Argument must be a Buffer");
  return this === n ? !0 : mt.compare(this, n) === 0;
};
mt.prototype.inspect = function() {
  var n = "", o = Cc;
  return this.length > 0 && (n = this.toString("hex", 0, o).match(/.{2}/g).join(" "), this.length > o && (n += " ... ")), "<Buffer " + n + ">";
};
mt.prototype.compare = function(n, o, s, m, f) {
  if (!vr(n))
    throw new TypeError("Argument must be a Buffer");
  if (o === void 0 && (o = 0), s === void 0 && (s = n ? n.length : 0), m === void 0 && (m = 0), f === void 0 && (f = this.length), o < 0 || s > n.length || m < 0 || f > this.length)
    throw new RangeError("out of range index");
  if (m >= f && o >= s)
    return 0;
  if (m >= f)
    return -1;
  if (o >= s)
    return 1;
  if (o >>>= 0, s >>>= 0, m >>>= 0, f >>>= 0, this === n)
    return 0;
  for (var g = f - m, y = s - o, S = Math.min(g, y), B = this.slice(m, f), M = n.slice(o, s), x = 0; x < S; ++x)
    if (B[x] !== M[x]) {
      g = B[x], y = M[x];
      break;
    }
  return g < y ? -1 : y < g ? 1 : 0;
};
function gs(a, n, o, s, m) {
  if (a.length === 0)
    return -1;
  if (typeof o == "string" ? (s = o, o = 0) : o > 2147483647 ? o = 2147483647 : o < -2147483648 && (o = -2147483648), o = +o, isNaN(o) && (o = m ? 0 : a.length - 1), o < 0 && (o = a.length + o), o >= a.length) {
    if (m)
      return -1;
    o = a.length - 1;
  } else if (o < 0)
    if (m)
      o = 0;
    else
      return -1;
  if (typeof n == "string" && (n = mt.from(n, s)), vr(n))
    return n.length === 0 ? -1 : _a(a, n, o, s, m);
  if (typeof n == "number")
    return n = n & 255, mt.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? m ? Uint8Array.prototype.indexOf.call(a, n, o) : Uint8Array.prototype.lastIndexOf.call(a, n, o) : _a(a, [n], o, s, m);
  throw new TypeError("val must be string, number or Buffer");
}
function _a(a, n, o, s, m) {
  var f = 1, g = a.length, y = n.length;
  if (s !== void 0 && (s = String(s).toLowerCase(), s === "ucs2" || s === "ucs-2" || s === "utf16le" || s === "utf-16le")) {
    if (a.length < 2 || n.length < 2)
      return -1;
    f = 2, g /= 2, y /= 2, o /= 2;
  }
  function S(k, D) {
    return f === 1 ? k[D] : k.readUInt16BE(D * f);
  }
  var B;
  if (m) {
    var M = -1;
    for (B = o; B < g; B++)
      if (S(a, B) === S(n, M === -1 ? 0 : B - M)) {
        if (M === -1 && (M = B), B - M + 1 === y)
          return M * f;
      } else
        M !== -1 && (B -= B - M), M = -1;
  } else
    for (o + y > g && (o = g - y), B = o; B >= 0; B--) {
      for (var x = !0, I = 0; I < y; I++)
        if (S(a, B + I) !== S(n, I)) {
          x = !1;
          break;
        }
      if (x)
        return B;
    }
  return -1;
}
mt.prototype.includes = function(n, o, s) {
  return this.indexOf(n, o, s) !== -1;
};
mt.prototype.indexOf = function(n, o, s) {
  return gs(this, n, o, s, !0);
};
mt.prototype.lastIndexOf = function(n, o, s) {
  return gs(this, n, o, s, !1);
};
function $c(a, n, o, s) {
  o = Number(o) || 0;
  var m = a.length - o;
  s ? (s = Number(s), s > m && (s = m)) : s = m;
  var f = n.length;
  if (f % 2 !== 0)
    throw new TypeError("Invalid hex string");
  s > f / 2 && (s = f / 2);
  for (var g = 0; g < s; ++g) {
    var y = parseInt(n.substr(g * 2, 2), 16);
    if (isNaN(y))
      return g;
    a[o + g] = y;
  }
  return g;
}
function Lc(a, n, o, s) {
  return Wn(En(n, a.length - o), a, o, s);
}
function bs(a, n, o, s) {
  return Wn(Qc(n), a, o, s);
}
function Uc(a, n, o, s) {
  return bs(a, n, o, s);
}
function Oc(a, n, o, s) {
  return Wn(_s(n), a, o, s);
}
function zc(a, n, o, s) {
  return Wn(t1(n, a.length - o), a, o, s);
}
mt.prototype.write = function(n, o, s, m) {
  if (o === void 0)
    m = "utf8", s = this.length, o = 0;
  else if (s === void 0 && typeof o == "string")
    m = o, s = this.length, o = 0;
  else if (isFinite(o))
    o = o | 0, isFinite(s) ? (s = s | 0, m === void 0 && (m = "utf8")) : (m = s, s = void 0);
  else
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  var f = this.length - o;
  if ((s === void 0 || s > f) && (s = f), n.length > 0 && (s < 0 || o < 0) || o > this.length)
    throw new RangeError("Attempt to write outside buffer bounds");
  m || (m = "utf8");
  for (var g = !1; ; )
    switch (m) {
      case "hex":
        return $c(this, n, o, s);
      case "utf8":
      case "utf-8":
        return Lc(this, n, o, s);
      case "ascii":
        return bs(this, n, o, s);
      case "latin1":
      case "binary":
        return Uc(this, n, o, s);
      case "base64":
        return Oc(this, n, o, s);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return zc(this, n, o, s);
      default:
        if (g)
          throw new TypeError("Unknown encoding: " + m);
        m = ("" + m).toLowerCase(), g = !0;
    }
};
mt.prototype.toJSON = function() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function Kc(a, n, o) {
  return n === 0 && o === a.length ? xa(a) : xa(a.slice(n, o));
}
function ys(a, n, o) {
  o = Math.min(a.length, o);
  for (var s = [], m = n; m < o; ) {
    var f = a[m], g = null, y = f > 239 ? 4 : f > 223 ? 3 : f > 191 ? 2 : 1;
    if (m + y <= o) {
      var S, B, M, x;
      switch (y) {
        case 1:
          f < 128 && (g = f);
          break;
        case 2:
          S = a[m + 1], (S & 192) === 128 && (x = (f & 31) << 6 | S & 63, x > 127 && (g = x));
          break;
        case 3:
          S = a[m + 1], B = a[m + 2], (S & 192) === 128 && (B & 192) === 128 && (x = (f & 15) << 12 | (S & 63) << 6 | B & 63, x > 2047 && (x < 55296 || x > 57343) && (g = x));
          break;
        case 4:
          S = a[m + 1], B = a[m + 2], M = a[m + 3], (S & 192) === 128 && (B & 192) === 128 && (M & 192) === 128 && (x = (f & 15) << 18 | (S & 63) << 12 | (B & 63) << 6 | M & 63, x > 65535 && x < 1114112 && (g = x));
      }
    }
    g === null ? (g = 65533, y = 1) : g > 65535 && (g -= 65536, s.push(g >>> 10 & 1023 | 55296), g = 56320 | g & 1023), s.push(g), m += y;
  }
  return Hc(s);
}
var Sa = 4096;
function Hc(a) {
  var n = a.length;
  if (n <= Sa)
    return String.fromCharCode.apply(String, a);
  for (var o = "", s = 0; s < n; )
    o += String.fromCharCode.apply(
      String,
      a.slice(s, s += Sa)
    );
  return o;
}
function Zc(a, n, o) {
  var s = "";
  o = Math.min(a.length, o);
  for (var m = n; m < o; ++m)
    s += String.fromCharCode(a[m] & 127);
  return s;
}
function Wc(a, n, o) {
  var s = "";
  o = Math.min(a.length, o);
  for (var m = n; m < o; ++m)
    s += String.fromCharCode(a[m]);
  return s;
}
function Vc(a, n, o) {
  var s = a.length;
  (!n || n < 0) && (n = 0), (!o || o < 0 || o > s) && (o = s);
  for (var m = "", f = n; f < o; ++f)
    m += jc(a[f]);
  return m;
}
function Yc(a, n, o) {
  for (var s = a.slice(n, o), m = "", f = 0; f < s.length; f += 2)
    m += String.fromCharCode(s[f] + s[f + 1] * 256);
  return m;
}
mt.prototype.slice = function(n, o) {
  var s = this.length;
  n = ~~n, o = o === void 0 ? s : ~~o, n < 0 ? (n += s, n < 0 && (n = 0)) : n > s && (n = s), o < 0 ? (o += s, o < 0 && (o = 0)) : o > s && (o = s), o < n && (o = n);
  var m;
  if (mt.TYPED_ARRAY_SUPPORT)
    m = this.subarray(n, o), m.__proto__ = mt.prototype;
  else {
    var f = o - n;
    m = new mt(f, void 0);
    for (var g = 0; g < f; ++g)
      m[g] = this[g + n];
  }
  return m;
};
function Be(a, n, o) {
  if (a % 1 !== 0 || a < 0)
    throw new RangeError("offset is not uint");
  if (a + n > o)
    throw new RangeError("Trying to access beyond buffer length");
}
mt.prototype.readUIntLE = function(n, o, s) {
  n = n | 0, o = o | 0, s || Be(n, o, this.length);
  for (var m = this[n], f = 1, g = 0; ++g < o && (f *= 256); )
    m += this[n + g] * f;
  return m;
};
mt.prototype.readUIntBE = function(n, o, s) {
  n = n | 0, o = o | 0, s || Be(n, o, this.length);
  for (var m = this[n + --o], f = 1; o > 0 && (f *= 256); )
    m += this[n + --o] * f;
  return m;
};
mt.prototype.readUInt8 = function(n, o) {
  return o || Be(n, 1, this.length), this[n];
};
mt.prototype.readUInt16LE = function(n, o) {
  return o || Be(n, 2, this.length), this[n] | this[n + 1] << 8;
};
mt.prototype.readUInt16BE = function(n, o) {
  return o || Be(n, 2, this.length), this[n] << 8 | this[n + 1];
};
mt.prototype.readUInt32LE = function(n, o) {
  return o || Be(n, 4, this.length), (this[n] | this[n + 1] << 8 | this[n + 2] << 16) + this[n + 3] * 16777216;
};
mt.prototype.readUInt32BE = function(n, o) {
  return o || Be(n, 4, this.length), this[n] * 16777216 + (this[n + 1] << 16 | this[n + 2] << 8 | this[n + 3]);
};
mt.prototype.readIntLE = function(n, o, s) {
  n = n | 0, o = o | 0, s || Be(n, o, this.length);
  for (var m = this[n], f = 1, g = 0; ++g < o && (f *= 256); )
    m += this[n + g] * f;
  return f *= 128, m >= f && (m -= Math.pow(2, 8 * o)), m;
};
mt.prototype.readIntBE = function(n, o, s) {
  n = n | 0, o = o | 0, s || Be(n, o, this.length);
  for (var m = o, f = 1, g = this[n + --m]; m > 0 && (f *= 256); )
    g += this[n + --m] * f;
  return f *= 128, g >= f && (g -= Math.pow(2, 8 * o)), g;
};
mt.prototype.readInt8 = function(n, o) {
  return o || Be(n, 1, this.length), this[n] & 128 ? (255 - this[n] + 1) * -1 : this[n];
};
mt.prototype.readInt16LE = function(n, o) {
  o || Be(n, 2, this.length);
  var s = this[n] | this[n + 1] << 8;
  return s & 32768 ? s | 4294901760 : s;
};
mt.prototype.readInt16BE = function(n, o) {
  o || Be(n, 2, this.length);
  var s = this[n + 1] | this[n] << 8;
  return s & 32768 ? s | 4294901760 : s;
};
mt.prototype.readInt32LE = function(n, o) {
  return o || Be(n, 4, this.length), this[n] | this[n + 1] << 8 | this[n + 2] << 16 | this[n + 3] << 24;
};
mt.prototype.readInt32BE = function(n, o) {
  return o || Be(n, 4, this.length), this[n] << 24 | this[n + 1] << 16 | this[n + 2] << 8 | this[n + 3];
};
mt.prototype.readFloatLE = function(n, o) {
  return o || Be(n, 4, this.length), Kn(this, n, !0, 23, 4);
};
mt.prototype.readFloatBE = function(n, o) {
  return o || Be(n, 4, this.length), Kn(this, n, !1, 23, 4);
};
mt.prototype.readDoubleLE = function(n, o) {
  return o || Be(n, 8, this.length), Kn(this, n, !0, 52, 8);
};
mt.prototype.readDoubleBE = function(n, o) {
  return o || Be(n, 8, this.length), Kn(this, n, !1, 52, 8);
};
function Ue(a, n, o, s, m, f) {
  if (!vr(a))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (n > m || n < f)
    throw new RangeError('"value" argument is out of bounds');
  if (o + s > a.length)
    throw new RangeError("Index out of range");
}
mt.prototype.writeUIntLE = function(n, o, s, m) {
  if (n = +n, o = o | 0, s = s | 0, !m) {
    var f = Math.pow(2, 8 * s) - 1;
    Ue(this, n, o, s, f, 0);
  }
  var g = 1, y = 0;
  for (this[o] = n & 255; ++y < s && (g *= 256); )
    this[o + y] = n / g & 255;
  return o + s;
};
mt.prototype.writeUIntBE = function(n, o, s, m) {
  if (n = +n, o = o | 0, s = s | 0, !m) {
    var f = Math.pow(2, 8 * s) - 1;
    Ue(this, n, o, s, f, 0);
  }
  var g = s - 1, y = 1;
  for (this[o + g] = n & 255; --g >= 0 && (y *= 256); )
    this[o + g] = n / y & 255;
  return o + s;
};
mt.prototype.writeUInt8 = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 1, 255, 0), mt.TYPED_ARRAY_SUPPORT || (n = Math.floor(n)), this[o] = n & 255, o + 1;
};
function Hn(a, n, o, s) {
  n < 0 && (n = 65535 + n + 1);
  for (var m = 0, f = Math.min(a.length - o, 2); m < f; ++m)
    a[o + m] = (n & 255 << 8 * (s ? m : 1 - m)) >>> (s ? m : 1 - m) * 8;
}
mt.prototype.writeUInt16LE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 2, 65535, 0), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n & 255, this[o + 1] = n >>> 8) : Hn(this, n, o, !0), o + 2;
};
mt.prototype.writeUInt16BE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 2, 65535, 0), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n >>> 8, this[o + 1] = n & 255) : Hn(this, n, o, !1), o + 2;
};
function Zn(a, n, o, s) {
  n < 0 && (n = 4294967295 + n + 1);
  for (var m = 0, f = Math.min(a.length - o, 4); m < f; ++m)
    a[o + m] = n >>> (s ? m : 3 - m) * 8 & 255;
}
mt.prototype.writeUInt32LE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 4, 4294967295, 0), mt.TYPED_ARRAY_SUPPORT ? (this[o + 3] = n >>> 24, this[o + 2] = n >>> 16, this[o + 1] = n >>> 8, this[o] = n & 255) : Zn(this, n, o, !0), o + 4;
};
mt.prototype.writeUInt32BE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 4, 4294967295, 0), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n >>> 24, this[o + 1] = n >>> 16, this[o + 2] = n >>> 8, this[o + 3] = n & 255) : Zn(this, n, o, !1), o + 4;
};
mt.prototype.writeIntLE = function(n, o, s, m) {
  if (n = +n, o = o | 0, !m) {
    var f = Math.pow(2, 8 * s - 1);
    Ue(this, n, o, s, f - 1, -f);
  }
  var g = 0, y = 1, S = 0;
  for (this[o] = n & 255; ++g < s && (y *= 256); )
    n < 0 && S === 0 && this[o + g - 1] !== 0 && (S = 1), this[o + g] = (n / y >> 0) - S & 255;
  return o + s;
};
mt.prototype.writeIntBE = function(n, o, s, m) {
  if (n = +n, o = o | 0, !m) {
    var f = Math.pow(2, 8 * s - 1);
    Ue(this, n, o, s, f - 1, -f);
  }
  var g = s - 1, y = 1, S = 0;
  for (this[o + g] = n & 255; --g >= 0 && (y *= 256); )
    n < 0 && S === 0 && this[o + g + 1] !== 0 && (S = 1), this[o + g] = (n / y >> 0) - S & 255;
  return o + s;
};
mt.prototype.writeInt8 = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 1, 127, -128), mt.TYPED_ARRAY_SUPPORT || (n = Math.floor(n)), n < 0 && (n = 255 + n + 1), this[o] = n & 255, o + 1;
};
mt.prototype.writeInt16LE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 2, 32767, -32768), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n & 255, this[o + 1] = n >>> 8) : Hn(this, n, o, !0), o + 2;
};
mt.prototype.writeInt16BE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 2, 32767, -32768), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n >>> 8, this[o + 1] = n & 255) : Hn(this, n, o, !1), o + 2;
};
mt.prototype.writeInt32LE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 4, 2147483647, -2147483648), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n & 255, this[o + 1] = n >>> 8, this[o + 2] = n >>> 16, this[o + 3] = n >>> 24) : Zn(this, n, o, !0), o + 4;
};
mt.prototype.writeInt32BE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ue(this, n, o, 4, 2147483647, -2147483648), n < 0 && (n = 4294967295 + n + 1), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n >>> 24, this[o + 1] = n >>> 16, this[o + 2] = n >>> 8, this[o + 3] = n & 255) : Zn(this, n, o, !1), o + 4;
};
function ws(a, n, o, s, m, f) {
  if (o + s > a.length)
    throw new RangeError("Index out of range");
  if (o < 0)
    throw new RangeError("Index out of range");
}
function Ms(a, n, o, s, m) {
  return m || ws(a, n, o, 4), ds(a, n, o, s, 23, 4), o + 4;
}
mt.prototype.writeFloatLE = function(n, o, s) {
  return Ms(this, n, o, !0, s);
};
mt.prototype.writeFloatBE = function(n, o, s) {
  return Ms(this, n, o, !1, s);
};
function xs(a, n, o, s, m) {
  return m || ws(a, n, o, 8), ds(a, n, o, s, 52, 8), o + 8;
}
mt.prototype.writeDoubleLE = function(n, o, s) {
  return xs(this, n, o, !0, s);
};
mt.prototype.writeDoubleBE = function(n, o, s) {
  return xs(this, n, o, !1, s);
};
mt.prototype.copy = function(n, o, s, m) {
  if (s || (s = 0), !m && m !== 0 && (m = this.length), o >= n.length && (o = n.length), o || (o = 0), m > 0 && m < s && (m = s), m === s || n.length === 0 || this.length === 0)
    return 0;
  if (o < 0)
    throw new RangeError("targetStart out of bounds");
  if (s < 0 || s >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (m < 0)
    throw new RangeError("sourceEnd out of bounds");
  m > this.length && (m = this.length), n.length - o < m - s && (m = n.length - o + s);
  var f = m - s, g;
  if (this === n && s < o && o < m)
    for (g = f - 1; g >= 0; --g)
      n[g + o] = this[g + s];
  else if (f < 1e3 || !mt.TYPED_ARRAY_SUPPORT)
    for (g = 0; g < f; ++g)
      n[g + o] = this[g + s];
  else
    Uint8Array.prototype.set.call(
      n,
      this.subarray(s, s + f),
      o
    );
  return f;
};
mt.prototype.fill = function(n, o, s, m) {
  if (typeof n == "string") {
    if (typeof o == "string" ? (m = o, o = 0, s = this.length) : typeof s == "string" && (m = s, s = this.length), n.length === 1) {
      var f = n.charCodeAt(0);
      f < 256 && (n = f);
    }
    if (m !== void 0 && typeof m != "string")
      throw new TypeError("encoding must be a string");
    if (typeof m == "string" && !mt.isEncoding(m))
      throw new TypeError("Unknown encoding: " + m);
  } else
    typeof n == "number" && (n = n & 255);
  if (o < 0 || this.length < o || this.length < s)
    throw new RangeError("Out of range index");
  if (s <= o)
    return this;
  o = o >>> 0, s = s === void 0 ? this.length : s >>> 0, n || (n = 0);
  var g;
  if (typeof n == "number")
    for (g = o; g < s; ++g)
      this[g] = n;
  else {
    var y = vr(n) ? n : En(new mt(n, m).toString()), S = y.length;
    for (g = 0; g < s - o; ++g)
      this[g + o] = y[g % S];
  }
  return this;
};
var Jc = /[^+\/0-9A-Za-z-_]/g;
function Gc(a) {
  if (a = Xc(a).replace(Jc, ""), a.length < 2)
    return "";
  for (; a.length % 4 !== 0; )
    a = a + "=";
  return a;
}
function Xc(a) {
  return a.trim ? a.trim() : a.replace(/^\s+|\s+$/g, "");
}
function jc(a) {
  return a < 16 ? "0" + a.toString(16) : a.toString(16);
}
function En(a, n) {
  n = n || 1 / 0;
  for (var o, s = a.length, m = null, f = [], g = 0; g < s; ++g) {
    if (o = a.charCodeAt(g), o > 55295 && o < 57344) {
      if (!m) {
        if (o > 56319) {
          (n -= 3) > -1 && f.push(239, 191, 189);
          continue;
        } else if (g + 1 === s) {
          (n -= 3) > -1 && f.push(239, 191, 189);
          continue;
        }
        m = o;
        continue;
      }
      if (o < 56320) {
        (n -= 3) > -1 && f.push(239, 191, 189), m = o;
        continue;
      }
      o = (m - 55296 << 10 | o - 56320) + 65536;
    } else
      m && (n -= 3) > -1 && f.push(239, 191, 189);
    if (m = null, o < 128) {
      if ((n -= 1) < 0)
        break;
      f.push(o);
    } else if (o < 2048) {
      if ((n -= 2) < 0)
        break;
      f.push(
        o >> 6 | 192,
        o & 63 | 128
      );
    } else if (o < 65536) {
      if ((n -= 3) < 0)
        break;
      f.push(
        o >> 12 | 224,
        o >> 6 & 63 | 128,
        o & 63 | 128
      );
    } else if (o < 1114112) {
      if ((n -= 4) < 0)
        break;
      f.push(
        o >> 18 | 240,
        o >> 12 & 63 | 128,
        o >> 6 & 63 | 128,
        o & 63 | 128
      );
    } else
      throw new Error("Invalid code point");
  }
  return f;
}
function Qc(a) {
  for (var n = [], o = 0; o < a.length; ++o)
    n.push(a.charCodeAt(o) & 255);
  return n;
}
function t1(a, n) {
  for (var o, s, m, f = [], g = 0; g < a.length && !((n -= 2) < 0); ++g)
    o = a.charCodeAt(g), s = o >> 8, m = o % 256, f.push(m), f.push(s);
  return f;
}
function _s(a) {
  return kc(Gc(a));
}
function Wn(a, n, o, s) {
  for (var m = 0; m < s && !(m + o >= n.length || m >= a.length); ++m)
    n[m + o] = a[m];
  return m;
}
function e1(a) {
  return a !== a;
}
function r1(a) {
  return a != null && (!!a._isBuffer || Ss(a) || i1(a));
}
function Ss(a) {
  return !!a.constructor && typeof a.constructor.isBuffer == "function" && a.constructor.isBuffer(a);
}
function i1(a) {
  return typeof a.readFloatLE == "function" && typeof a.slice == "function" && Ss(a.slice(0, 0));
}
var tn = function(n, o) {
  for (var s = Math.min(n.length, o.length), m = new mt(s), f = 0; f < s; ++f)
    m[f] = n[f] ^ o[f];
  return m;
}, As = tn;
I0.encrypt = function(a, n) {
  var o = As(n, a._prev);
  return a._prev = a._cipher.encryptBlock(o), a._prev;
};
I0.decrypt = function(a, n) {
  var o = a._prev;
  a._prev = n;
  var s = a._cipher.decryptBlock(n);
  return As(s, o);
};
var Bs = {}, Li = zt.Buffer, n1 = tn;
function Aa(a, n, o) {
  var s = n.length, m = n1(n, a._cache);
  return a._cache = a._cache.slice(s), a._prev = Li.concat([a._prev, o ? n : m]), m;
}
Bs.encrypt = function(a, n, o) {
  for (var s = Li.allocUnsafe(0), m; n.length; )
    if (a._cache.length === 0 && (a._cache = a._cipher.encryptBlock(a._prev), a._prev = Li.allocUnsafe(0)), a._cache.length <= n.length)
      m = a._cache.length, s = Li.concat([s, Aa(a, n.slice(0, m), o)]), n = n.slice(m);
    else {
      s = Li.concat([s, Aa(a, n, o)]);
      break;
    }
  return s;
};
var Es = {}, o0 = zt.Buffer;
function f1(a, n, o) {
  var s = a._cipher.encryptBlock(a._prev), m = s[0] ^ n;
  return a._prev = o0.concat([
    a._prev.slice(1),
    o0.from([o ? n : m])
  ]), m;
}
Es.encrypt = function(a, n, o) {
  for (var s = n.length, m = o0.allocUnsafe(s), f = -1; ++f < s; )
    m[f] = f1(a, n[f], o);
  return m;
};
var ks = {}, Mn = zt.Buffer;
function a1(a, n, o) {
  for (var s, m = -1, f = 8, g = 0, y, S; ++m < f; )
    s = a._cipher.encryptBlock(a._prev), y = n & 1 << 7 - m ? 128 : 0, S = s[0] ^ y, g += (S & 128) >> m % 8, a._prev = h1(a._prev, o ? y : S);
  return g;
}
function h1(a, n) {
  var o = a.length, s = -1, m = Mn.allocUnsafe(a.length);
  for (a = Mn.concat([a, Mn.from([n])]); ++s < o; )
    m[s] = a[s] << 1 | a[s + 1] >> 7;
  return m;
}
ks.encrypt = function(a, n, o) {
  for (var s = n.length, m = Mn.allocUnsafe(s), f = -1; ++f < s; )
    m[f] = a1(a, n[f], o);
  return m;
};
var Is = {}, s1 = tn;
function o1(a) {
  return a._prev = a._cipher.encryptBlock(a._prev), a._prev;
}
Is.encrypt = function(a, n) {
  for (; a._cache.length < n.length; )
    a._cache = mt.concat([a._cache, o1(a)]);
  var o = a._cache.slice(0, n.length);
  return a._cache = a._cache.slice(n.length), s1(n, o);
};
var u0 = {};
function u1(a) {
  for (var n = a.length, o; n--; )
    if (o = a.readUInt8(n), o === 255)
      a.writeUInt8(0, n);
    else {
      o++, a.writeUInt8(o, n);
      break;
    }
}
var Rs = u1, l1 = tn, Ba = zt.Buffer, d1 = Rs;
function c1(a) {
  var n = a._cipher.encryptBlockRaw(a._prev);
  return d1(a._prev), n;
}
var wf = 16;
u0.encrypt = function(a, n) {
  var o = Math.ceil(n.length / wf), s = a._cache.length;
  a._cache = Ba.concat([
    a._cache,
    Ba.allocUnsafe(o * wf)
  ]);
  for (var m = 0; m < o; m++) {
    var f = c1(a), g = s + m * wf;
    a._cache.writeUInt32BE(f[0], g + 0), a._cache.writeUInt32BE(f[1], g + 4), a._cache.writeUInt32BE(f[2], g + 8), a._cache.writeUInt32BE(f[3], g + 12);
  }
  var y = a._cache.slice(0, n.length);
  return a._cache = a._cache.slice(n.length), l1(n, y);
};
const v1 = {
  cipher: "AES",
  key: 128,
  iv: 16,
  mode: "CBC",
  type: "block"
}, p1 = {
  cipher: "AES",
  key: 192,
  iv: 16,
  mode: "CBC",
  type: "block"
}, m1 = {
  cipher: "AES",
  key: 256,
  iv: 16,
  mode: "CBC",
  type: "block"
}, Ts = {
  "aes-128-ecb": {
    cipher: "AES",
    key: 128,
    iv: 0,
    mode: "ECB",
    type: "block"
  },
  "aes-192-ecb": {
    cipher: "AES",
    key: 192,
    iv: 0,
    mode: "ECB",
    type: "block"
  },
  "aes-256-ecb": {
    cipher: "AES",
    key: 256,
    iv: 0,
    mode: "ECB",
    type: "block"
  },
  "aes-128-cbc": {
    cipher: "AES",
    key: 128,
    iv: 16,
    mode: "CBC",
    type: "block"
  },
  "aes-192-cbc": {
    cipher: "AES",
    key: 192,
    iv: 16,
    mode: "CBC",
    type: "block"
  },
  "aes-256-cbc": {
    cipher: "AES",
    key: 256,
    iv: 16,
    mode: "CBC",
    type: "block"
  },
  aes128: v1,
  aes192: p1,
  aes256: m1,
  "aes-128-cfb": {
    cipher: "AES",
    key: 128,
    iv: 16,
    mode: "CFB",
    type: "stream"
  },
  "aes-192-cfb": {
    cipher: "AES",
    key: 192,
    iv: 16,
    mode: "CFB",
    type: "stream"
  },
  "aes-256-cfb": {
    cipher: "AES",
    key: 256,
    iv: 16,
    mode: "CFB",
    type: "stream"
  },
  "aes-128-cfb8": {
    cipher: "AES",
    key: 128,
    iv: 16,
    mode: "CFB8",
    type: "stream"
  },
  "aes-192-cfb8": {
    cipher: "AES",
    key: 192,
    iv: 16,
    mode: "CFB8",
    type: "stream"
  },
  "aes-256-cfb8": {
    cipher: "AES",
    key: 256,
    iv: 16,
    mode: "CFB8",
    type: "stream"
  },
  "aes-128-cfb1": {
    cipher: "AES",
    key: 128,
    iv: 16,
    mode: "CFB1",
    type: "stream"
  },
  "aes-192-cfb1": {
    cipher: "AES",
    key: 192,
    iv: 16,
    mode: "CFB1",
    type: "stream"
  },
  "aes-256-cfb1": {
    cipher: "AES",
    key: 256,
    iv: 16,
    mode: "CFB1",
    type: "stream"
  },
  "aes-128-ofb": {
    cipher: "AES",
    key: 128,
    iv: 16,
    mode: "OFB",
    type: "stream"
  },
  "aes-192-ofb": {
    cipher: "AES",
    key: 192,
    iv: 16,
    mode: "OFB",
    type: "stream"
  },
  "aes-256-ofb": {
    cipher: "AES",
    key: 256,
    iv: 16,
    mode: "OFB",
    type: "stream"
  },
  "aes-128-ctr": {
    cipher: "AES",
    key: 128,
    iv: 16,
    mode: "CTR",
    type: "stream"
  },
  "aes-192-ctr": {
    cipher: "AES",
    key: 192,
    iv: 16,
    mode: "CTR",
    type: "stream"
  },
  "aes-256-ctr": {
    cipher: "AES",
    key: 256,
    iv: 16,
    mode: "CTR",
    type: "stream"
  },
  "aes-128-gcm": {
    cipher: "AES",
    key: 128,
    iv: 12,
    mode: "GCM",
    type: "auth"
  },
  "aes-192-gcm": {
    cipher: "AES",
    key: 192,
    iv: 12,
    mode: "GCM",
    type: "auth"
  },
  "aes-256-gcm": {
    cipher: "AES",
    key: 256,
    iv: 12,
    mode: "GCM",
    type: "auth"
  }
};
var g1 = {
  ECB: k0,
  CBC: I0,
  CFB: Bs,
  CFB8: Es,
  CFB1: ks,
  OFB: Is,
  CTR: u0,
  GCM: u0
}, xn = Ts;
for (var Ea in xn)
  xn[Ea].module = g1[xn[Ea].mode];
var F0 = xn, en = {}, kn = zt.Buffer;
function q0(a) {
  kn.isBuffer(a) || (a = kn.from(a));
  for (var n = a.length / 4 | 0, o = new Array(n), s = 0; s < n; s++)
    o[s] = a.readUInt32BE(s * 4);
  return o;
}
function Mf(a) {
  for (var n = 0; n < a.length; a++)
    a[n] = 0;
}
function Cs(a, n, o, s, m) {
  for (var f = o[0], g = o[1], y = o[2], S = o[3], B = a[0] ^ n[0], M = a[1] ^ n[1], x = a[2] ^ n[2], I = a[3] ^ n[3], k, D, U, W, z = 4, $ = 1; $ < m; $++)
    k = f[B >>> 24] ^ g[M >>> 16 & 255] ^ y[x >>> 8 & 255] ^ S[I & 255] ^ n[z++], D = f[M >>> 24] ^ g[x >>> 16 & 255] ^ y[I >>> 8 & 255] ^ S[B & 255] ^ n[z++], U = f[x >>> 24] ^ g[I >>> 16 & 255] ^ y[B >>> 8 & 255] ^ S[M & 255] ^ n[z++], W = f[I >>> 24] ^ g[B >>> 16 & 255] ^ y[M >>> 8 & 255] ^ S[x & 255] ^ n[z++], B = k, M = D, x = U, I = W;
  return k = (s[B >>> 24] << 24 | s[M >>> 16 & 255] << 16 | s[x >>> 8 & 255] << 8 | s[I & 255]) ^ n[z++], D = (s[M >>> 24] << 24 | s[x >>> 16 & 255] << 16 | s[I >>> 8 & 255] << 8 | s[B & 255]) ^ n[z++], U = (s[x >>> 24] << 24 | s[I >>> 16 & 255] << 16 | s[B >>> 8 & 255] << 8 | s[M & 255]) ^ n[z++], W = (s[I >>> 24] << 24 | s[B >>> 16 & 255] << 16 | s[M >>> 8 & 255] << 8 | s[x & 255]) ^ n[z++], k = k >>> 0, D = D >>> 0, U = U >>> 0, W = W >>> 0, [k, D, U, W];
}
var b1 = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], ye = function() {
  for (var a = new Array(256), n = 0; n < 256; n++)
    n < 128 ? a[n] = n << 1 : a[n] = n << 1 ^ 283;
  for (var o = [], s = [], m = [[], [], [], []], f = [[], [], [], []], g = 0, y = 0, S = 0; S < 256; ++S) {
    var B = y ^ y << 1 ^ y << 2 ^ y << 3 ^ y << 4;
    B = B >>> 8 ^ B & 255 ^ 99, o[g] = B, s[B] = g;
    var M = a[g], x = a[M], I = a[x], k = a[B] * 257 ^ B * 16843008;
    m[0][g] = k << 24 | k >>> 8, m[1][g] = k << 16 | k >>> 16, m[2][g] = k << 8 | k >>> 24, m[3][g] = k, k = I * 16843009 ^ x * 65537 ^ M * 257 ^ g * 16843008, f[0][B] = k << 24 | k >>> 8, f[1][B] = k << 16 | k >>> 16, f[2][B] = k << 8 | k >>> 24, f[3][B] = k, g === 0 ? g = y = 1 : (g = M ^ a[a[a[I ^ M]]], y ^= a[a[y]]);
  }
  return {
    SBOX: o,
    INV_SBOX: s,
    SUB_MIX: m,
    INV_SUB_MIX: f
  };
}();
function We(a) {
  this._key = q0(a), this._reset();
}
We.blockSize = 4 * 4;
We.keySize = 256 / 8;
We.prototype.blockSize = We.blockSize;
We.prototype.keySize = We.keySize;
We.prototype._reset = function() {
  for (var a = this._key, n = a.length, o = n + 6, s = (o + 1) * 4, m = [], f = 0; f < n; f++)
    m[f] = a[f];
  for (f = n; f < s; f++) {
    var g = m[f - 1];
    f % n === 0 ? (g = g << 8 | g >>> 24, g = ye.SBOX[g >>> 24] << 24 | ye.SBOX[g >>> 16 & 255] << 16 | ye.SBOX[g >>> 8 & 255] << 8 | ye.SBOX[g & 255], g ^= b1[f / n | 0] << 24) : n > 6 && f % n === 4 && (g = ye.SBOX[g >>> 24] << 24 | ye.SBOX[g >>> 16 & 255] << 16 | ye.SBOX[g >>> 8 & 255] << 8 | ye.SBOX[g & 255]), m[f] = m[f - n] ^ g;
  }
  for (var y = [], S = 0; S < s; S++) {
    var B = s - S, M = m[B - (S % 4 ? 0 : 4)];
    S < 4 || B <= 4 ? y[S] = M : y[S] = ye.INV_SUB_MIX[0][ye.SBOX[M >>> 24]] ^ ye.INV_SUB_MIX[1][ye.SBOX[M >>> 16 & 255]] ^ ye.INV_SUB_MIX[2][ye.SBOX[M >>> 8 & 255]] ^ ye.INV_SUB_MIX[3][ye.SBOX[M & 255]];
  }
  this._nRounds = o, this._keySchedule = m, this._invKeySchedule = y;
};
We.prototype.encryptBlockRaw = function(a) {
  return a = q0(a), Cs(a, this._keySchedule, ye.SUB_MIX, ye.SBOX, this._nRounds);
};
We.prototype.encryptBlock = function(a) {
  var n = this.encryptBlockRaw(a), o = kn.allocUnsafe(16);
  return o.writeUInt32BE(n[0], 0), o.writeUInt32BE(n[1], 4), o.writeUInt32BE(n[2], 8), o.writeUInt32BE(n[3], 12), o;
};
We.prototype.decryptBlock = function(a) {
  a = q0(a);
  var n = a[1];
  a[1] = a[3], a[3] = n;
  var o = Cs(a, this._invKeySchedule, ye.INV_SUB_MIX, ye.INV_SBOX, this._nRounds), s = kn.allocUnsafe(16);
  return s.writeUInt32BE(o[0], 0), s.writeUInt32BE(o[3], 4), s.writeUInt32BE(o[2], 8), s.writeUInt32BE(o[1], 12), s;
};
We.prototype.scrub = function() {
  Mf(this._keySchedule), Mf(this._invKeySchedule), Mf(this._key);
};
en.AES = We;
var li = zt.Buffer, y1 = li.alloc(16, 0);
function w1(a) {
  return [
    a.readUInt32BE(0),
    a.readUInt32BE(4),
    a.readUInt32BE(8),
    a.readUInt32BE(12)
  ];
}
function Fs(a) {
  var n = li.allocUnsafe(16);
  return n.writeUInt32BE(a[0] >>> 0, 0), n.writeUInt32BE(a[1] >>> 0, 4), n.writeUInt32BE(a[2] >>> 0, 8), n.writeUInt32BE(a[3] >>> 0, 12), n;
}
function rn(a) {
  this.h = a, this.state = li.alloc(16, 0), this.cache = li.allocUnsafe(0);
}
rn.prototype.ghash = function(a) {
  for (var n = -1; ++n < a.length; )
    this.state[n] ^= a[n];
  this._multiply();
};
rn.prototype._multiply = function() {
  for (var a = w1(this.h), n = [0, 0, 0, 0], o, s, m, f = -1; ++f < 128; ) {
    for (s = (this.state[~~(f / 8)] & 1 << 7 - f % 8) !== 0, s && (n[0] ^= a[0], n[1] ^= a[1], n[2] ^= a[2], n[3] ^= a[3]), m = (a[3] & 1) !== 0, o = 3; o > 0; o--)
      a[o] = a[o] >>> 1 | (a[o - 1] & 1) << 31;
    a[0] = a[0] >>> 1, m && (a[0] = a[0] ^ 225 << 24);
  }
  this.state = Fs(n);
};
rn.prototype.update = function(a) {
  this.cache = li.concat([this.cache, a]);
  for (var n; this.cache.length >= 16; )
    n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(n);
};
rn.prototype.final = function(a, n) {
  return this.cache.length && this.ghash(li.concat([this.cache, y1], 16)), this.ghash(Fs([0, a, 0, n])), this.state;
};
var M1 = rn, x1 = en, De = zt.Buffer, qs = Lr, _1 = Gt, Ps = M1, S1 = tn, A1 = Rs;
function B1(a, n) {
  var o = 0;
  a.length !== n.length && o++;
  for (var s = Math.min(a.length, n.length), m = 0; m < s; ++m)
    o += a[m] ^ n[m];
  return o;
}
function E1(a, n, o) {
  if (n.length === 12)
    return a._finID = De.concat([n, De.from([0, 0, 0, 1])]), De.concat([n, De.from([0, 0, 0, 2])]);
  var s = new Ps(o), m = n.length, f = m % 16;
  s.update(n), f && (f = 16 - f, s.update(De.alloc(f, 0))), s.update(De.alloc(8, 0));
  var g = m * 8, y = De.alloc(8);
  y.writeUIntBE(g, 0, 8), s.update(y), a._finID = s.state;
  var S = De.from(a._finID);
  return A1(S), S;
}
function ri(a, n, o, s) {
  qs.call(this);
  var m = De.alloc(4, 0);
  this._cipher = new x1.AES(n);
  var f = this._cipher.encryptBlock(m);
  this._ghash = new Ps(f), o = E1(this, o, f), this._prev = De.from(o), this._cache = De.allocUnsafe(0), this._secCache = De.allocUnsafe(0), this._decrypt = s, this._alen = 0, this._len = 0, this._mode = a, this._authTag = null, this._called = !1;
}
_1(ri, qs);
ri.prototype._update = function(a) {
  if (!this._called && this._alen) {
    var n = 16 - this._alen % 16;
    n < 16 && (n = De.alloc(n, 0), this._ghash.update(n));
  }
  this._called = !0;
  var o = this._mode.encrypt(this, a);
  return this._decrypt ? this._ghash.update(a) : this._ghash.update(o), this._len += a.length, o;
};
ri.prototype._final = function() {
  if (this._decrypt && !this._authTag)
    throw new Error("Unsupported state or unable to authenticate data");
  var a = S1(this._ghash.final(this._alen * 8, this._len * 8), this._cipher.encryptBlock(this._finID));
  if (this._decrypt && B1(a, this._authTag))
    throw new Error("Unsupported state or unable to authenticate data");
  this._authTag = a, this._cipher.scrub();
};
ri.prototype.getAuthTag = function() {
  if (this._decrypt || !De.isBuffer(this._authTag))
    throw new Error("Attempting to get auth tag in unsupported state");
  return this._authTag;
};
ri.prototype.setAuthTag = function(n) {
  if (!this._decrypt)
    throw new Error("Attempting to set auth tag in unsupported state");
  this._authTag = n;
};
ri.prototype.setAAD = function(n) {
  if (this._called)
    throw new Error("Attempting to set AAD in unsupported state");
  this._ghash.update(n), this._alen += n.length;
};
var Ds = ri, k1 = en, xf = zt.Buffer, Ns = Lr, I1 = Gt;
function Vn(a, n, o, s) {
  Ns.call(this), this._cipher = new k1.AES(n), this._prev = xf.from(o), this._cache = xf.allocUnsafe(0), this._secCache = xf.allocUnsafe(0), this._decrypt = s, this._mode = a;
}
I1(Vn, Ns);
Vn.prototype._update = function(a) {
  return this._mode.encrypt(this, a, this._decrypt);
};
Vn.prototype._final = function() {
  this._cipher.scrub();
};
var $s = Vn, zr = zt.Buffer, R1 = x0;
function T1(a, n, o, s) {
  if (zr.isBuffer(a) || (a = zr.from(a, "binary")), n && (zr.isBuffer(n) || (n = zr.from(n, "binary")), n.length !== 8))
    throw new RangeError("salt should be Buffer with 8 byte length");
  for (var m = o / 8, f = zr.alloc(m), g = zr.alloc(s || 0), y = zr.alloc(0); m > 0 || s > 0; ) {
    var S = new R1();
    S.update(y), S.update(a), n && S.update(n), y = S.digest();
    var B = 0;
    if (m > 0) {
      var M = f.length - m;
      B = Math.min(m, y.length), y.copy(f, M, 0, B), m -= B;
    }
    if (B < y.length && s > 0) {
      var x = g.length - s, I = Math.min(s, y.length - B);
      y.copy(g, x, B, B + I), s -= I;
    }
  }
  return y.fill(0), { key: f, iv: g };
}
var Yn = T1, Ls = F0, C1 = Ds, Br = zt.Buffer, F1 = $s, Us = Lr, q1 = en, P1 = Yn, D1 = Gt;
function nn(a, n, o) {
  Us.call(this), this._cache = new Jn(), this._cipher = new q1.AES(n), this._prev = Br.from(o), this._mode = a, this._autopadding = !0;
}
D1(nn, Us);
nn.prototype._update = function(a) {
  this._cache.add(a);
  for (var n, o, s = []; n = this._cache.get(); )
    o = this._mode.encrypt(this, n), s.push(o);
  return Br.concat(s);
};
var N1 = Br.alloc(16, 16);
nn.prototype._final = function() {
  var a = this._cache.flush();
  if (this._autopadding)
    return a = this._mode.encrypt(this, a), this._cipher.scrub(), a;
  if (!a.equals(N1))
    throw this._cipher.scrub(), new Error("data not multiple of block length");
};
nn.prototype.setAutoPadding = function(a) {
  return this._autopadding = !!a, this;
};
function Jn() {
  this.cache = Br.allocUnsafe(0);
}
Jn.prototype.add = function(a) {
  this.cache = Br.concat([this.cache, a]);
};
Jn.prototype.get = function() {
  if (this.cache.length > 15) {
    var a = this.cache.slice(0, 16);
    return this.cache = this.cache.slice(16), a;
  }
  return null;
};
Jn.prototype.flush = function() {
  for (var a = 16 - this.cache.length, n = Br.allocUnsafe(a), o = -1; ++o < a; )
    n.writeUInt8(a, o);
  return Br.concat([this.cache, n]);
};
function Os(a, n, o) {
  var s = Ls[a.toLowerCase()];
  if (!s)
    throw new TypeError("invalid suite type");
  if (typeof n == "string" && (n = Br.from(n)), n.length !== s.key / 8)
    throw new TypeError("invalid key length " + n.length);
  if (typeof o == "string" && (o = Br.from(o)), s.mode !== "GCM" && o.length !== s.iv)
    throw new TypeError("invalid iv length " + o.length);
  return s.type === "stream" ? new F1(s.module, n, o) : s.type === "auth" ? new C1(s.module, n, o) : new nn(s.module, n, o);
}
function $1(a, n) {
  var o = Ls[a.toLowerCase()];
  if (!o)
    throw new TypeError("invalid suite type");
  var s = P1(n, !1, o.key, o.iv);
  return Os(a, s.key, s.iv);
}
E0.createCipheriv = Os;
E0.createCipher = $1;
var P0 = {}, L1 = Ds, di = zt.Buffer, zs = F0, U1 = $s, Ks = Lr, O1 = en, z1 = Yn, K1 = Gt;
function fn(a, n, o) {
  Ks.call(this), this._cache = new Gn(), this._last = void 0, this._cipher = new O1.AES(n), this._prev = di.from(o), this._mode = a, this._autopadding = !0;
}
K1(fn, Ks);
fn.prototype._update = function(a) {
  this._cache.add(a);
  for (var n, o, s = []; n = this._cache.get(this._autopadding); )
    o = this._mode.decrypt(this, n), s.push(o);
  return di.concat(s);
};
fn.prototype._final = function() {
  var a = this._cache.flush();
  if (this._autopadding)
    return H1(this._mode.decrypt(this, a));
  if (a)
    throw new Error("data not multiple of block length");
};
fn.prototype.setAutoPadding = function(a) {
  return this._autopadding = !!a, this;
};
function Gn() {
  this.cache = di.allocUnsafe(0);
}
Gn.prototype.add = function(a) {
  this.cache = di.concat([this.cache, a]);
};
Gn.prototype.get = function(a) {
  var n;
  if (a) {
    if (this.cache.length > 16)
      return n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), n;
  } else if (this.cache.length >= 16)
    return n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), n;
  return null;
};
Gn.prototype.flush = function() {
  if (this.cache.length)
    return this.cache;
};
function H1(a) {
  var n = a[15];
  if (n < 1 || n > 16)
    throw new Error("unable to decrypt data");
  for (var o = -1; ++o < n; )
    if (a[o + (16 - n)] !== n)
      throw new Error("unable to decrypt data");
  if (n !== 16)
    return a.slice(0, 16 - n);
}
function Hs(a, n, o) {
  var s = zs[a.toLowerCase()];
  if (!s)
    throw new TypeError("invalid suite type");
  if (typeof o == "string" && (o = di.from(o)), s.mode !== "GCM" && o.length !== s.iv)
    throw new TypeError("invalid iv length " + o.length);
  if (typeof n == "string" && (n = di.from(n)), n.length !== s.key / 8)
    throw new TypeError("invalid key length " + n.length);
  return s.type === "stream" ? new U1(s.module, n, o, !0) : s.type === "auth" ? new L1(s.module, n, o, !0) : new fn(s.module, n, o);
}
function Z1(a, n) {
  var o = zs[a.toLowerCase()];
  if (!o)
    throw new TypeError("invalid suite type");
  var s = z1(n, !1, o.key, o.iv);
  return Hs(a, s.key, s.iv);
}
P0.createDecipher = Z1;
P0.createDecipheriv = Hs;
var Zs = E0, Ws = P0, W1 = Ts;
function V1() {
  return Object.keys(W1);
}
Oe.createCipher = Oe.Cipher = Zs.createCipher;
Oe.createCipheriv = Oe.Cipheriv = Zs.createCipheriv;
Oe.createDecipher = Oe.Decipher = Ws.createDecipher;
Oe.createDecipheriv = Oe.Decipheriv = Ws.createDecipheriv;
Oe.listCiphers = Oe.getCiphers = V1;
var Vs = {};
(function(a) {
  a["des-ecb"] = {
    key: 8,
    iv: 0
  }, a["des-cbc"] = a.des = {
    key: 8,
    iv: 8
  }, a["des-ede3-cbc"] = a.des3 = {
    key: 24,
    iv: 8
  }, a["des-ede3"] = {
    key: 24,
    iv: 0
  }, a["des-ede-cbc"] = {
    key: 16,
    iv: 8
  }, a["des-ede"] = {
    key: 16,
    iv: 0
  };
})(Vs);
var Ys = Bc, D0 = Oe, Dr = F0, Ar = Vs, Js = Yn;
function Y1(a, n) {
  a = a.toLowerCase();
  var o, s;
  if (Dr[a])
    o = Dr[a].key, s = Dr[a].iv;
  else if (Ar[a])
    o = Ar[a].key * 8, s = Ar[a].iv;
  else
    throw new TypeError("invalid suite type");
  var m = Js(n, !1, o, s);
  return Gs(a, m.key, m.iv);
}
function J1(a, n) {
  a = a.toLowerCase();
  var o, s;
  if (Dr[a])
    o = Dr[a].key, s = Dr[a].iv;
  else if (Ar[a])
    o = Ar[a].key * 8, s = Ar[a].iv;
  else
    throw new TypeError("invalid suite type");
  var m = Js(n, !1, o, s);
  return Xs(a, m.key, m.iv);
}
function Gs(a, n, o) {
  if (a = a.toLowerCase(), Dr[a])
    return D0.createCipheriv(a, n, o);
  if (Ar[a])
    return new Ys({ key: n, iv: o, mode: a });
  throw new TypeError("invalid suite type");
}
function Xs(a, n, o) {
  if (a = a.toLowerCase(), Dr[a])
    return D0.createDecipheriv(a, n, o);
  if (Ar[a])
    return new Ys({ key: n, iv: o, mode: a, decrypt: !0 });
  throw new TypeError("invalid suite type");
}
function G1() {
  return Object.keys(Ar).concat(D0.getCiphers());
}
tr.createCipher = tr.Cipher = Y1;
tr.createCipheriv = tr.Cipheriv = Gs;
tr.createDecipher = tr.Decipher = J1;
tr.createDecipheriv = tr.Decipheriv = Xs;
tr.listCiphers = tr.getCiphers = G1;
var Kr = {}, N0 = { exports: {} };
N0.exports;
(function(a) {
  (function(n, o) {
    function s(p, t) {
      if (!p)
        throw new Error(t || "Assertion failed");
    }
    function m(p, t) {
      p.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, p.prototype = new r(), p.prototype.constructor = p;
    }
    function f(p, t, r) {
      if (f.isBN(p))
        return p;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, p !== null && ((t === "le" || t === "be") && (r = t, t = 10), this._init(p || 0, t || 10, r || "be"));
    }
    typeof n == "object" ? n.exports = f : o.BN = f, f.BN = f, f.wordSize = 26;
    var g;
    try {
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Ne.Buffer;
    } catch (p) {
    }
    f.isBN = function(t) {
      return t instanceof f ? !0 : t !== null && typeof t == "object" && t.constructor.wordSize === f.wordSize && Array.isArray(t.words);
    }, f.max = function(t, r) {
      return t.cmp(r) > 0 ? t : r;
    }, f.min = function(t, r) {
      return t.cmp(r) < 0 ? t : r;
    }, f.prototype._init = function(t, r, i) {
      if (typeof t == "number")
        return this._initNumber(t, r, i);
      if (typeof t == "object")
        return this._initArray(t, r, i);
      r === "hex" && (r = 16), s(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var h = 0;
      t[0] === "-" && (h++, this.negative = 1), h < t.length && (r === 16 ? this._parseHex(t, h, i) : (this._parseBase(t, r, h), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (s(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (s(typeof t.length == "number"), t.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(t.length / 3), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (h = t.length - 1, d = 0; h >= 0; h -= 3)
          c = t[h] | t[h - 1] << 8 | t[h - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (h = 0, d = 0; h < t.length; h += 3)
          c = t[h] | t[h + 1] << 8 | t[h + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      return this.strip();
    };
    function y(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function S(p, t, r) {
      var i = y(p, r);
      return r - 1 >= t && (i |= y(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (h = t.length - 1; h >= r; h -= 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (h = u % 2 === 0 ? r + 1 : r; h < t.length; h += 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var h = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        h *= i, v >= 49 ? h += v - 49 + 10 : v >= 17 ? h += v - 17 + 10 : h += v;
      }
      return h;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var h = 0, d = 1; d <= 67108863; d *= r)
        h++;
      h--, d = d / r | 0;
      for (var c = t.length - i, v = c % h, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += h)
        e = B(t, l, l + h, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var b = 1;
        for (e = B(t, l, t.length, r), l = 0; l < v; l++)
          b *= r;
        this.imuln(b), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      }
      this.strip();
    }, f.prototype.copy = function(t) {
      t.words = new Array(this.length);
      for (var r = 0; r < this.length; r++)
        t.words[r] = this.words[r];
      t.length = this.length, t.negative = this.negative, t.red = this.red;
    }, f.prototype.clone = function() {
      var t = new f(null);
      return this.copy(t), t;
    }, f.prototype._expand = function(t) {
      for (; this.length < t; )
        this.words[this.length++] = 0;
      return this;
    }, f.prototype.strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, f.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, f.prototype.inspect = function() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var M = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], x = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], I = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    f.prototype.toString = function(t, r) {
      t = t || 10, r = r | 0 || 1;
      var i;
      if (t === 16 || t === "hex") {
        i = "";
        for (var h = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << h | d) & 16777215).toString(16);
          d = v >>> 24 - h & 16777215, h += 2, h >= 26 && (h -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = I[t];
        i = "";
        var b = this.clone();
        for (b.negative = 0; !b.isZero(); ) {
          var _ = b.modn(l).toString(t);
          b = b.idivn(l), b.isZero() ? i = _ + i : i = M[e - _.length] + _ + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      s(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && s(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return s(typeof g != "undefined"), this.toArrayLike(g, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var h = this.byteLength(), d = i || Math.max(1, h);
      s(h <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - h; e++)
          v[e] = 0;
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[d - e - 1] = u;
      }
      return v;
    }, Math.clz32 ? f.prototype._countBits = function(t) {
      return 32 - Math.clz32(t);
    } : f.prototype._countBits = function(t) {
      var r = t, i = 0;
      return r >= 4096 && (i += 13, r >>>= 13), r >= 64 && (i += 7, r >>>= 7), r >= 8 && (i += 4, r >>>= 4), r >= 2 && (i += 2, r >>>= 2), i + r;
    }, f.prototype._zeroBits = function(t) {
      if (t === 0)
        return 26;
      var r = t, i = 0;
      return r & 8191 || (i += 13, r >>>= 13), r & 127 || (i += 7, r >>>= 7), r & 15 || (i += 4, r >>>= 4), r & 3 || (i += 2, r >>>= 2), r & 1 || i++, i;
    }, f.prototype.bitLength = function() {
      var t = this.words[this.length - 1], r = this._countBits(t);
      return (this.length - 1) * 26 + r;
    };
    function k(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, h = r % 26;
        t[r] = (p.words[i] & 1 << h) >>> h;
      }
      return t;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var t = 0, r = 0; r < this.length; r++) {
        var i = this._zeroBits(this.words[r]);
        if (t += i, i !== 26)
          break;
      }
      return t;
    }, f.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, f.prototype.toTwos = function(t) {
      return this.negative !== 0 ? this.abs().inotn(t).iaddn(1) : this.clone();
    }, f.prototype.fromTwos = function(t) {
      return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone();
    }, f.prototype.isNeg = function() {
      return this.negative !== 0;
    }, f.prototype.neg = function() {
      return this.clone().ineg();
    }, f.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, f.prototype.iuor = function(t) {
      for (; this.length < t.length; )
        this.words[this.length++] = 0;
      for (var r = 0; r < t.length; r++)
        this.words[r] = this.words[r] | t.words[r];
      return this.strip();
    }, f.prototype.ior = function(t) {
      return s((this.negative | t.negative) === 0), this.iuor(t);
    }, f.prototype.or = function(t) {
      return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this);
    }, f.prototype.uor = function(t) {
      return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this);
    }, f.prototype.iuand = function(t) {
      var r;
      this.length > t.length ? r = t : r = this;
      for (var i = 0; i < r.length; i++)
        this.words[i] = this.words[i] & t.words[i];
      return this.length = r.length, this.strip();
    }, f.prototype.iand = function(t) {
      return s((this.negative | t.negative) === 0), this.iuand(t);
    }, f.prototype.and = function(t) {
      return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this);
    }, f.prototype.uand = function(t) {
      return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this);
    }, f.prototype.iuxor = function(t) {
      var r, i;
      this.length > t.length ? (r = this, i = t) : (r = t, i = this);
      for (var h = 0; h < i.length; h++)
        this.words[h] = r.words[h] ^ i.words[h];
      if (this !== r)
        for (; h < r.length; h++)
          this.words[h] = r.words[h];
      return this.length = r.length, this.strip();
    }, f.prototype.ixor = function(t) {
      return s((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var h = 0; h < r; h++)
        this.words[h] = ~this.words[h] & 67108863;
      return i > 0 && (this.words[h] = ~this.words[h] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, h = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << h : this.words[i] = this.words[i] & ~(1 << h), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, h;
      this.length > t.length ? (i = this, h = t) : (i = t, h = this);
      for (var d = 0, c = 0; c < h.length; c++)
        r = (i.words[c] | 0) + (h.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      for (; d !== 0 && c < i.length; c++)
        r = (i.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      if (this.length = i.length, d !== 0)
        this.words[this.length] = d, this.length++;
      else if (i !== this)
        for (; c < i.length; c++)
          this.words[c] = i.words[c];
      return this;
    }, f.prototype.add = function(t) {
      var r;
      return t.negative !== 0 && this.negative === 0 ? (t.negative = 0, r = this.sub(t), t.negative ^= 1, r) : t.negative === 0 && this.negative !== 0 ? (this.negative = 0, r = t.sub(this), this.negative = 1, r) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this);
    }, f.prototype.isub = function(t) {
      if (t.negative !== 0) {
        t.negative = 0;
        var r = this.iadd(t);
        return t.negative = 1, r._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
      var i = this.cmp(t);
      if (i === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var h, d;
      i > 0 ? (h = this, d = t) : (h = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (h.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < h.length; v++)
        r = (h.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < h.length && h !== this)
        for (; v < h.length; v++)
          this.words[v] = h.words[v];
      return this.length = Math.max(this.length, v), h !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var h = p.words[0] | 0, d = t.words[0] | 0, c = h * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var q = e - C | 0;
          h = p.words[q] | 0, d = t.words[C] | 0, c = h * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var U = function(t, r, i) {
      var h = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = h[0] | 0, _ = b & 8191, C = b >>> 13, q = h[1] | 0, O = q & 8191, R = q >>> 13, P = h[2] | 0, N = P & 8191, K = P >>> 13, kt = h[3] | 0, Z = kt & 8191, J = kt >>> 13, Ft = h[4] | 0, tt = Ft & 8191, vt = Ft >>> 13, Dt = h[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = h[6] | 0, j = Pt & 8191, dt = Pt >>> 13, qt = h[7] | 0, Q = qt & 8191, ct = qt >>> 13, Ut = h[8] | 0, E = Ut & 8191, w = Ut >>> 13, A = h[9] | 0, T = A & 8191, F = A >>> 13, V = d[0] | 0, L = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, Kt = d[3] | 0, nt = Kt & 8191, bt = Kt >>> 13, Ht = d[4] | 0, ft = Ht & 8191, yt = Ht >>> 13, Zt = d[5] | 0, at = Zt & 8191, wt = Zt >>> 13, Wt = d[6] | 0, ht = Wt & 8191, Mt = Wt >>> 13, Vt = d[7] | 0, st = Vt & 8191, xt = Vt >>> 13, Yt = d[8] | 0, ot = Yt & 8191, _t = Yt >>> 13, Jt = d[9] | 0, ut = Jt & 8191, St = Jt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, L), e = Math.imul(_, X), e = e + Math.imul(C, L) | 0, l = Math.imul(C, X);
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul(O, L), e = Math.imul(O, X), e = e + Math.imul(R, L) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(N, L), e = Math.imul(N, X), e = e + Math.imul(K, L) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(Z, L), e = Math.imul(Z, X), e = e + Math.imul(J, L) | 0, l = Math.imul(J, X), u = u + Math.imul(N, G) | 0, e = e + Math.imul(N, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(tt, L), e = Math.imul(tt, X), e = e + Math.imul(vt, L) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul(N, it) | 0, e = e + Math.imul(N, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(et, L), e = Math.imul(et, X), e = e + Math.imul(pt, L) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul(N, nt) | 0, e = e + Math.imul(N, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(j, L), e = Math.imul(j, X), e = e + Math.imul(dt, L) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul(N, ft) | 0, e = e + Math.imul(N, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(Q, L), e = Math.imul(Q, X), e = e + Math.imul(ct, L) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul(N, at) | 0, e = e + Math.imul(N, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(E, L), e = Math.imul(E, X), e = e + Math.imul(w, L) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul(N, ht) | 0, e = e + Math.imul(N, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, L), e = Math.imul(T, X), e = e + Math.imul(F, L) | 0, l = Math.imul(F, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul(N, st) | 0, e = e + Math.imul(N, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(F, G) | 0, l = Math.imul(F, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul(N, ot) | 0, e = e + Math.imul(N, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(F, it) | 0, l = Math.imul(F, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul(N, ut) | 0, e = e + Math.imul(N, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(F, nt) | 0, l = Math.imul(F, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(F, ft) | 0, l = Math.imul(F, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(F, at) | 0, l = Math.imul(F, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(F, ht) | 0, l = Math.imul(F, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(F, st) | 0, l = Math.imul(F, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(F, ot) | 0, l = Math.imul(F, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(F, ut) | 0, l = Math.imul(F, St);
      var pe = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (pe >>> 26) | 0, pe &= 67108863, c[0] = Nt, c[1] = $t, c[2] = Qt, c[3] = te, c[4] = ee, c[5] = re, c[6] = ie, c[7] = ne, c[8] = fe, c[9] = ae, c[10] = he, c[11] = se, c[12] = oe, c[13] = ue, c[14] = le, c[15] = de, c[16] = ce, c[17] = ve, c[18] = pe, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (U = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, h = 0, d = 0; d < r.length - 1; d++) {
        var c = h;
        h = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, q = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, q = q + v | 0, v = q & 67108863, c = c + (q >>> 26) | 0, h += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = h;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new $();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, h = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = U(this, t, r) : h < 63 ? i = D(this, t, r) : h < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function $(p, t) {
      this.x = p, this.y = t;
    }
    $.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, h = 0; h < t; h++)
        r[h] = this.revBin(h, i, t);
      return r;
    }, $.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var h = 0, d = 0; d < r; d++)
        h |= (t & 1) << r - d - 1, t >>= 1;
      return h;
    }, $.prototype.permute = function(t, r, i, h, d, c) {
      for (var v = 0; v < c; v++)
        h[v] = r[t[v]], d[v] = i[t[v]];
    }, $.prototype.transform = function(t, r, i, h, d, c) {
      this.permute(c, t, r, i, h, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, q = 0; q < v; q++) {
            var O = i[b + q], R = h[b + q], P = i[b + q + v], N = h[b + q + v], K = _ * P - C * N;
            N = _ * N + C * P, P = K, i[b + q] = O + P, h[b + q] = R + N, i[b + q + v] = O - P, h[b + q + v] = R - N, q !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, $.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, h = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + h;
    }, $.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var h = 0; h < i / 2; h++) {
          var d = t[h];
          t[h] = t[i - h - 1], t[i - h - 1] = d, d = r[h], r[h] = -r[i - h - 1], r[i - h - 1] = -d;
        }
    }, $.prototype.normalize13b = function(t, r) {
      for (var i = 0, h = 0; h < r / 2; h++) {
        var d = Math.round(t[2 * h + 1] / r) * 8192 + Math.round(t[2 * h] / r) + i;
        t[h] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, $.prototype.convert13b = function(t, r, i, h) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < h; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, $.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, $.prototype.mulp = function(t, r, i) {
      var h = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(h), c = this.stub(h), v = new Array(h), u = new Array(h), e = new Array(h), l = new Array(h), b = new Array(h), _ = new Array(h), C = i.words;
      C.length = h, this.convert13b(t.words, t.length, v, h), this.convert13b(r.words, r.length, l, h), this.transform(v, c, u, e, h, d), this.transform(l, c, b, _, h, d);
      for (var q = 0; q < h; q++) {
        var O = u[q] * b[q] - e[q] * _[q];
        e[q] = u[q] * _[q] + e[q] * b[q], u[q] = O;
      }
      return this.conjugate(u, e, h), this.transform(u, e, C, c, h, d), this.conjugate(C, c, h), this.normalize13b(C, h), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), z(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      s(typeof t == "number"), s(t < 67108864);
      for (var r = 0, i = 0; i < this.length; i++) {
        var h = (this.words[i] | 0) * t, d = (h & 67108863) + (r & 67108863);
        r >>= 26, r += h / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = k(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, h = 0; h < r.length && r[h] === 0; h++, i = i.sqr())
        ;
      if (++h < r.length)
        for (var d = i.sqr(); h < r.length; h++, d = d.sqr())
          r[h] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & h, u = (this.words[d] | 0) - v << r;
          this.words[d] = u | c, c = v >>> 26 - r;
        }
        c && (this.words[d] = c, this.length++);
      }
      if (i !== 0) {
        for (d = this.length - 1; d >= 0; d--)
          this.words[d + i] = this.words[d];
        for (d = 0; d < i; d++)
          this.words[d] = 0;
        this.length += i;
      }
      return this.strip();
    }, f.prototype.ishln = function(t) {
      return s(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      s(typeof t == "number" && t >= 0);
      var h;
      r ? h = (r - r % 26) / 26 : h = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (h -= c, h = Math.max(0, h), u) {
        for (var e = 0; e < c; e++)
          u.words[e] = this.words[e];
        u.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var l = 0;
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= h); e--) {
        var b = this.words[e] | 0;
        this.words[e] = l << 26 - d | b >>> d, l = b & v;
      }
      return u && l !== 0 && (u.words[u.length++] = l), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return s(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & h);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var h = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= h;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return s(typeof t == "number"), s(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (s(typeof t == "number"), s(t < 67108864), t < 0)
        return this.iaddn(-t);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(t), this.negative = 1, this;
      if (this.words[0] -= t, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var r = 0; r < this.length && this.words[r] < 0; r++)
          this.words[r] += 67108864, this.words[r + 1] -= 1;
      return this.strip();
    }, f.prototype.addn = function(t) {
      return this.clone().iaddn(t);
    }, f.prototype.subn = function(t) {
      return this.clone().isubn(t);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(t, r, i) {
      var h = t.length + i, d;
      this._expand(h);
      var c, v = 0;
      for (d = 0; d < t.length; d++) {
        c = (this.words[d + i] | 0) + v;
        var u = (t.words[d] | 0) * r;
        c -= u & 67108863, v = (c >> 26) - (u / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (s(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, h = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), h.iushln(i), c = d.words[d.length - 1] | 0);
      var u = h.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = h.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (h = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (h.words[d.length + _] | 0) * 67108864 + (h.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), h._ishlnsubmul(d, C, _); h.negative !== 0; )
          C--, h.negative = 0, h._ishlnsubmul(d, 1, _), h.isZero() || (h.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), h.strip(), r !== "div" && i !== 0 && h.iushrn(i), {
        div: e || null,
        mod: h
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var h, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (h = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: h,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (h = c.div.neg()), {
        div: h,
        mod: c.mod
      }) : this.negative & t.negative ? (c = this.neg().divmod(t.neg(), r), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.isub(t)), {
        div: c.div,
        mod: d
      }) : t.length > this.length || this.cmp(t) < 0 ? {
        div: new f(0),
        mod: this
      } : t.length === 1 ? r === "div" ? {
        div: this.divn(t.words[0]),
        mod: null
      } : r === "mod" ? {
        div: null,
        mod: new f(this.modn(t.words[0]))
      } : {
        div: this.divn(t.words[0]),
        mod: new f(this.modn(t.words[0]))
      } : this._wordDiv(t, r);
    }, f.prototype.div = function(t) {
      return this.divmod(t, "div", !1).div;
    }, f.prototype.mod = function(t) {
      return this.divmod(t, "mod", !1).mod;
    }, f.prototype.umod = function(t) {
      return this.divmod(t, "mod", !0).mod;
    }, f.prototype.divRound = function(t) {
      var r = this.divmod(t);
      if (r.mod.isZero())
        return r.div;
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, h = t.ushrn(1), d = t.andln(1), c = i.cmp(h);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, h = this.length - 1; h >= 0; h--)
        i = (r * i + (this.words[h] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = (this.words[i] | 0) + r * 67108864;
        this.words[i] = h / t | 0, r = h % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (h.isOdd() || d.isOdd()) && (h.iadd(e), d.isub(l)), h.iushrn(1), d.iushrn(1);
        for (var C = 0, q = 1; !(i.words[0] & q) && C < 26; ++C, q <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(c), d.isub(v)) : (i.isub(r), c.isub(h), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(u)
      };
    }, f.prototype._invmp = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            h.isOdd() && h.iadd(c), h.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(d)) : (i.isub(r), d.isub(h));
      }
      var b;
      return r.cmpn(1) === 0 ? b = h : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var h = 0; r.isEven() && i.isEven(); h++)
        r.iushrn(1), i.iushrn(1);
      do {
        for (; r.isEven(); )
          r.iushrn(1);
        for (; i.isEven(); )
          i.iushrn(1);
        var d = r.cmp(i);
        if (d < 0) {
          var c = r;
          r = i, i = c;
        } else if (d === 0 || i.cmpn(1) === 0)
          break;
        r.isub(i);
      } while (!0);
      return i.iushln(h);
    }, f.prototype.invm = function(t) {
      return this.egcd(t).a.umod(t);
    }, f.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, f.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, f.prototype.andln = function(t) {
      return this.words[0] & t;
    }, f.prototype.bincn = function(t) {
      s(typeof t == "number");
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= h, this;
      for (var d = h, c = i; d !== 0 && c < this.length; c++) {
        var v = this.words[c] | 0;
        v += d, d = v >>> 26, v &= 67108863, this.words[c] = v;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(t) {
      var r = t < 0;
      if (this.negative !== 0 && !r)
        return -1;
      if (this.negative === 0 && r)
        return 1;
      this.strip();
      var i;
      if (this.length > 1)
        i = 1;
      else {
        r && (t = -t), s(t <= 67108863, "Number is too big");
        var h = this.words[0] | 0;
        i = h === t ? 0 : h < t ? -1 : 1;
      }
      return this.negative !== 0 ? -i | 0 : i;
    }, f.prototype.cmp = function(t) {
      if (this.negative !== 0 && t.negative === 0)
        return -1;
      if (this.negative === 0 && t.negative !== 0)
        return 1;
      var r = this.ucmp(t);
      return this.negative !== 0 ? -r | 0 : r;
    }, f.prototype.ucmp = function(t) {
      if (this.length > t.length)
        return 1;
      if (this.length < t.length)
        return -1;
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = this.words[i] | 0, d = t.words[i] | 0;
        if (h !== d) {
          h < d ? r = -1 : h > d && (r = 1);
          break;
        }
      }
      return r;
    }, f.prototype.gtn = function(t) {
      return this.cmpn(t) === 1;
    }, f.prototype.gt = function(t) {
      return this.cmp(t) === 1;
    }, f.prototype.gten = function(t) {
      return this.cmpn(t) >= 0;
    }, f.prototype.gte = function(t) {
      return this.cmp(t) >= 0;
    }, f.prototype.ltn = function(t) {
      return this.cmpn(t) === -1;
    }, f.prototype.lt = function(t) {
      return this.cmp(t) === -1;
    }, f.prototype.lten = function(t) {
      return this.cmpn(t) <= 0;
    }, f.prototype.lte = function(t) {
      return this.cmp(t) <= 0;
    }, f.prototype.eqn = function(t) {
      return this.cmpn(t) === 0;
    }, f.prototype.eq = function(t) {
      return this.cmp(t) === 0;
    }, f.red = function(t) {
      return new Y(t);
    }, f.prototype.toRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), s(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return s(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return s(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return s(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return s(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return s(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return s(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return s(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return s(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return s(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return s(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return s(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return s(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var lt = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function H(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    H.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, H.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var h = i < this.n ? -1 : r.ucmp(this.p);
      return h === 0 ? (r.words[0] = 0, r.length = 1) : h > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, H.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, H.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function At() {
      H.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(At, H), At.prototype.split = function(t, r) {
      for (var i = 4194303, h = Math.min(t.length, 9), d = 0; d < h; d++)
        r.words[d] = t.words[d];
      if (r.length = h, t.length <= 9) {
        t.words[0] = 0, t.length = 1;
        return;
      }
      var c = t.words[9];
      for (r.words[r.length++] = c & i, d = 10; d < t.length; d++) {
        var v = t.words[d] | 0;
        t.words[d - 10] = (v & i) << 4 | c >>> 22, c = v;
      }
      c >>>= 22, t.words[d - 10] = c, c === 0 && t.length > 10 ? t.length -= 10 : t.length -= 9;
    }, At.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = t.words[i] | 0;
        r += h * 977, t.words[i] = r & 67108863, r = h * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function Bt() {
      H.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(Bt, H);
    function Ct() {
      H.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(Ct, H);
    function Et() {
      H.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(Et, H), Et.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = (t.words[i] | 0) * 19 + r, d = h & 67108863;
        h >>>= 26, t.words[i] = d, r = h;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (lt[t])
        return lt[t];
      var r;
      if (t === "k256")
        r = new At();
      else if (t === "p224")
        r = new Bt();
      else if (t === "p192")
        r = new Ct();
      else if (t === "p25519")
        r = new Et();
      else
        throw new Error("Unknown prime " + t);
      return lt[t] = r, r;
    };
    function Y(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        s(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    Y.prototype._verify1 = function(t) {
      s(t.negative === 0, "red works only with positives"), s(t.red, "red works only with red numbers");
    }, Y.prototype._verify2 = function(t, r) {
      s((t.negative | r.negative) === 0, "red works only with positives"), s(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, Y.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, Y.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, Y.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, Y.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, Y.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, Y.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, Y.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, Y.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, Y.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, Y.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, Y.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, Y.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (s(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var h = this.m.subn(1), d = 0; !h.isZero() && h.andln(1) === 0; )
        d++, h.iushrn(1);
      s(!h.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, h), b = this.pow(t, h.addn(1).iushrn(1)), _ = this.pow(t, h), C = d; _.cmp(c) !== 0; ) {
        for (var q = _, O = 0; q.cmp(c) !== 0; O++)
          q = q.redSqr();
        s(O < C);
        var R = this.pow(l, new f(1).iushln(C - O - 1));
        b = b.redMul(R), l = R.redSqr(), _ = _.redMul(l), C = O;
      }
      return b;
    }, Y.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, Y.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, h = new Array(1 << i);
      h[0] = new f(1).toRed(this), h[1] = t;
      for (var d = 2; d < h.length; d++)
        h[d] = this.mul(h[d - 1], t);
      var c = h[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== h[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, h[v]), u = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, Y.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, Y.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new It(t);
    };
    function It(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(It, Y), It.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, It.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, It.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(a, Xt);
})(N0);
var js = N0.exports, $0 = { exports: {} };
$0.exports;
(function(a) {
  (function(n, o) {
    function s(p, t) {
      if (!p)
        throw new Error(t || "Assertion failed");
    }
    function m(p, t) {
      p.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, p.prototype = new r(), p.prototype.constructor = p;
    }
    function f(p, t, r) {
      if (f.isBN(p))
        return p;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, p !== null && ((t === "le" || t === "be") && (r = t, t = 10), this._init(p || 0, t || 10, r || "be"));
    }
    typeof n == "object" ? n.exports = f : o.BN = f, f.BN = f, f.wordSize = 26;
    var g;
    try {
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Ne.Buffer;
    } catch (p) {
    }
    f.isBN = function(t) {
      return t instanceof f ? !0 : t !== null && typeof t == "object" && t.constructor.wordSize === f.wordSize && Array.isArray(t.words);
    }, f.max = function(t, r) {
      return t.cmp(r) > 0 ? t : r;
    }, f.min = function(t, r) {
      return t.cmp(r) < 0 ? t : r;
    }, f.prototype._init = function(t, r, i) {
      if (typeof t == "number")
        return this._initNumber(t, r, i);
      if (typeof t == "object")
        return this._initArray(t, r, i);
      r === "hex" && (r = 16), s(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var h = 0;
      t[0] === "-" && (h++, this.negative = 1), h < t.length && (r === 16 ? this._parseHex(t, h, i) : (this._parseBase(t, r, h), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (s(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (s(typeof t.length == "number"), t.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(t.length / 3), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (h = t.length - 1, d = 0; h >= 0; h -= 3)
          c = t[h] | t[h - 1] << 8 | t[h - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (h = 0, d = 0; h < t.length; h += 3)
          c = t[h] | t[h + 1] << 8 | t[h + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      return this.strip();
    };
    function y(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function S(p, t, r) {
      var i = y(p, r);
      return r - 1 >= t && (i |= y(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (h = t.length - 1; h >= r; h -= 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (h = u % 2 === 0 ? r + 1 : r; h < t.length; h += 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var h = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        h *= i, v >= 49 ? h += v - 49 + 10 : v >= 17 ? h += v - 17 + 10 : h += v;
      }
      return h;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var h = 0, d = 1; d <= 67108863; d *= r)
        h++;
      h--, d = d / r | 0;
      for (var c = t.length - i, v = c % h, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += h)
        e = B(t, l, l + h, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var b = 1;
        for (e = B(t, l, t.length, r), l = 0; l < v; l++)
          b *= r;
        this.imuln(b), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      }
      this.strip();
    }, f.prototype.copy = function(t) {
      t.words = new Array(this.length);
      for (var r = 0; r < this.length; r++)
        t.words[r] = this.words[r];
      t.length = this.length, t.negative = this.negative, t.red = this.red;
    }, f.prototype.clone = function() {
      var t = new f(null);
      return this.copy(t), t;
    }, f.prototype._expand = function(t) {
      for (; this.length < t; )
        this.words[this.length++] = 0;
      return this;
    }, f.prototype.strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, f.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, f.prototype.inspect = function() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var M = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], x = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], I = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    f.prototype.toString = function(t, r) {
      t = t || 10, r = r | 0 || 1;
      var i;
      if (t === 16 || t === "hex") {
        i = "";
        for (var h = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << h | d) & 16777215).toString(16);
          d = v >>> 24 - h & 16777215, h += 2, h >= 26 && (h -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = I[t];
        i = "";
        var b = this.clone();
        for (b.negative = 0; !b.isZero(); ) {
          var _ = b.modn(l).toString(t);
          b = b.idivn(l), b.isZero() ? i = _ + i : i = M[e - _.length] + _ + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      s(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && s(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return s(typeof g != "undefined"), this.toArrayLike(g, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var h = this.byteLength(), d = i || Math.max(1, h);
      s(h <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - h; e++)
          v[e] = 0;
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[d - e - 1] = u;
      }
      return v;
    }, Math.clz32 ? f.prototype._countBits = function(t) {
      return 32 - Math.clz32(t);
    } : f.prototype._countBits = function(t) {
      var r = t, i = 0;
      return r >= 4096 && (i += 13, r >>>= 13), r >= 64 && (i += 7, r >>>= 7), r >= 8 && (i += 4, r >>>= 4), r >= 2 && (i += 2, r >>>= 2), i + r;
    }, f.prototype._zeroBits = function(t) {
      if (t === 0)
        return 26;
      var r = t, i = 0;
      return r & 8191 || (i += 13, r >>>= 13), r & 127 || (i += 7, r >>>= 7), r & 15 || (i += 4, r >>>= 4), r & 3 || (i += 2, r >>>= 2), r & 1 || i++, i;
    }, f.prototype.bitLength = function() {
      var t = this.words[this.length - 1], r = this._countBits(t);
      return (this.length - 1) * 26 + r;
    };
    function k(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, h = r % 26;
        t[r] = (p.words[i] & 1 << h) >>> h;
      }
      return t;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var t = 0, r = 0; r < this.length; r++) {
        var i = this._zeroBits(this.words[r]);
        if (t += i, i !== 26)
          break;
      }
      return t;
    }, f.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, f.prototype.toTwos = function(t) {
      return this.negative !== 0 ? this.abs().inotn(t).iaddn(1) : this.clone();
    }, f.prototype.fromTwos = function(t) {
      return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone();
    }, f.prototype.isNeg = function() {
      return this.negative !== 0;
    }, f.prototype.neg = function() {
      return this.clone().ineg();
    }, f.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, f.prototype.iuor = function(t) {
      for (; this.length < t.length; )
        this.words[this.length++] = 0;
      for (var r = 0; r < t.length; r++)
        this.words[r] = this.words[r] | t.words[r];
      return this.strip();
    }, f.prototype.ior = function(t) {
      return s((this.negative | t.negative) === 0), this.iuor(t);
    }, f.prototype.or = function(t) {
      return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this);
    }, f.prototype.uor = function(t) {
      return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this);
    }, f.prototype.iuand = function(t) {
      var r;
      this.length > t.length ? r = t : r = this;
      for (var i = 0; i < r.length; i++)
        this.words[i] = this.words[i] & t.words[i];
      return this.length = r.length, this.strip();
    }, f.prototype.iand = function(t) {
      return s((this.negative | t.negative) === 0), this.iuand(t);
    }, f.prototype.and = function(t) {
      return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this);
    }, f.prototype.uand = function(t) {
      return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this);
    }, f.prototype.iuxor = function(t) {
      var r, i;
      this.length > t.length ? (r = this, i = t) : (r = t, i = this);
      for (var h = 0; h < i.length; h++)
        this.words[h] = r.words[h] ^ i.words[h];
      if (this !== r)
        for (; h < r.length; h++)
          this.words[h] = r.words[h];
      return this.length = r.length, this.strip();
    }, f.prototype.ixor = function(t) {
      return s((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var h = 0; h < r; h++)
        this.words[h] = ~this.words[h] & 67108863;
      return i > 0 && (this.words[h] = ~this.words[h] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, h = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << h : this.words[i] = this.words[i] & ~(1 << h), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, h;
      this.length > t.length ? (i = this, h = t) : (i = t, h = this);
      for (var d = 0, c = 0; c < h.length; c++)
        r = (i.words[c] | 0) + (h.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      for (; d !== 0 && c < i.length; c++)
        r = (i.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      if (this.length = i.length, d !== 0)
        this.words[this.length] = d, this.length++;
      else if (i !== this)
        for (; c < i.length; c++)
          this.words[c] = i.words[c];
      return this;
    }, f.prototype.add = function(t) {
      var r;
      return t.negative !== 0 && this.negative === 0 ? (t.negative = 0, r = this.sub(t), t.negative ^= 1, r) : t.negative === 0 && this.negative !== 0 ? (this.negative = 0, r = t.sub(this), this.negative = 1, r) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this);
    }, f.prototype.isub = function(t) {
      if (t.negative !== 0) {
        t.negative = 0;
        var r = this.iadd(t);
        return t.negative = 1, r._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
      var i = this.cmp(t);
      if (i === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var h, d;
      i > 0 ? (h = this, d = t) : (h = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (h.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < h.length; v++)
        r = (h.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < h.length && h !== this)
        for (; v < h.length; v++)
          this.words[v] = h.words[v];
      return this.length = Math.max(this.length, v), h !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var h = p.words[0] | 0, d = t.words[0] | 0, c = h * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var q = e - C | 0;
          h = p.words[q] | 0, d = t.words[C] | 0, c = h * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var U = function(t, r, i) {
      var h = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = h[0] | 0, _ = b & 8191, C = b >>> 13, q = h[1] | 0, O = q & 8191, R = q >>> 13, P = h[2] | 0, N = P & 8191, K = P >>> 13, kt = h[3] | 0, Z = kt & 8191, J = kt >>> 13, Ft = h[4] | 0, tt = Ft & 8191, vt = Ft >>> 13, Dt = h[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = h[6] | 0, j = Pt & 8191, dt = Pt >>> 13, qt = h[7] | 0, Q = qt & 8191, ct = qt >>> 13, Ut = h[8] | 0, E = Ut & 8191, w = Ut >>> 13, A = h[9] | 0, T = A & 8191, F = A >>> 13, V = d[0] | 0, L = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, Kt = d[3] | 0, nt = Kt & 8191, bt = Kt >>> 13, Ht = d[4] | 0, ft = Ht & 8191, yt = Ht >>> 13, Zt = d[5] | 0, at = Zt & 8191, wt = Zt >>> 13, Wt = d[6] | 0, ht = Wt & 8191, Mt = Wt >>> 13, Vt = d[7] | 0, st = Vt & 8191, xt = Vt >>> 13, Yt = d[8] | 0, ot = Yt & 8191, _t = Yt >>> 13, Jt = d[9] | 0, ut = Jt & 8191, St = Jt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, L), e = Math.imul(_, X), e = e + Math.imul(C, L) | 0, l = Math.imul(C, X);
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul(O, L), e = Math.imul(O, X), e = e + Math.imul(R, L) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(N, L), e = Math.imul(N, X), e = e + Math.imul(K, L) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(Z, L), e = Math.imul(Z, X), e = e + Math.imul(J, L) | 0, l = Math.imul(J, X), u = u + Math.imul(N, G) | 0, e = e + Math.imul(N, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(tt, L), e = Math.imul(tt, X), e = e + Math.imul(vt, L) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul(N, it) | 0, e = e + Math.imul(N, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(et, L), e = Math.imul(et, X), e = e + Math.imul(pt, L) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul(N, nt) | 0, e = e + Math.imul(N, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(j, L), e = Math.imul(j, X), e = e + Math.imul(dt, L) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul(N, ft) | 0, e = e + Math.imul(N, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(Q, L), e = Math.imul(Q, X), e = e + Math.imul(ct, L) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul(N, at) | 0, e = e + Math.imul(N, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(E, L), e = Math.imul(E, X), e = e + Math.imul(w, L) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul(N, ht) | 0, e = e + Math.imul(N, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, L), e = Math.imul(T, X), e = e + Math.imul(F, L) | 0, l = Math.imul(F, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul(N, st) | 0, e = e + Math.imul(N, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(F, G) | 0, l = Math.imul(F, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul(N, ot) | 0, e = e + Math.imul(N, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(F, it) | 0, l = Math.imul(F, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul(N, ut) | 0, e = e + Math.imul(N, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(F, nt) | 0, l = Math.imul(F, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(F, ft) | 0, l = Math.imul(F, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(F, at) | 0, l = Math.imul(F, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(F, ht) | 0, l = Math.imul(F, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(F, st) | 0, l = Math.imul(F, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(F, ot) | 0, l = Math.imul(F, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(F, ut) | 0, l = Math.imul(F, St);
      var pe = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (pe >>> 26) | 0, pe &= 67108863, c[0] = Nt, c[1] = $t, c[2] = Qt, c[3] = te, c[4] = ee, c[5] = re, c[6] = ie, c[7] = ne, c[8] = fe, c[9] = ae, c[10] = he, c[11] = se, c[12] = oe, c[13] = ue, c[14] = le, c[15] = de, c[16] = ce, c[17] = ve, c[18] = pe, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (U = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, h = 0, d = 0; d < r.length - 1; d++) {
        var c = h;
        h = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, q = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, q = q + v | 0, v = q & 67108863, c = c + (q >>> 26) | 0, h += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = h;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new $();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, h = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = U(this, t, r) : h < 63 ? i = D(this, t, r) : h < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function $(p, t) {
      this.x = p, this.y = t;
    }
    $.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, h = 0; h < t; h++)
        r[h] = this.revBin(h, i, t);
      return r;
    }, $.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var h = 0, d = 0; d < r; d++)
        h |= (t & 1) << r - d - 1, t >>= 1;
      return h;
    }, $.prototype.permute = function(t, r, i, h, d, c) {
      for (var v = 0; v < c; v++)
        h[v] = r[t[v]], d[v] = i[t[v]];
    }, $.prototype.transform = function(t, r, i, h, d, c) {
      this.permute(c, t, r, i, h, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, q = 0; q < v; q++) {
            var O = i[b + q], R = h[b + q], P = i[b + q + v], N = h[b + q + v], K = _ * P - C * N;
            N = _ * N + C * P, P = K, i[b + q] = O + P, h[b + q] = R + N, i[b + q + v] = O - P, h[b + q + v] = R - N, q !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, $.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, h = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + h;
    }, $.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var h = 0; h < i / 2; h++) {
          var d = t[h];
          t[h] = t[i - h - 1], t[i - h - 1] = d, d = r[h], r[h] = -r[i - h - 1], r[i - h - 1] = -d;
        }
    }, $.prototype.normalize13b = function(t, r) {
      for (var i = 0, h = 0; h < r / 2; h++) {
        var d = Math.round(t[2 * h + 1] / r) * 8192 + Math.round(t[2 * h] / r) + i;
        t[h] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, $.prototype.convert13b = function(t, r, i, h) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < h; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, $.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, $.prototype.mulp = function(t, r, i) {
      var h = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(h), c = this.stub(h), v = new Array(h), u = new Array(h), e = new Array(h), l = new Array(h), b = new Array(h), _ = new Array(h), C = i.words;
      C.length = h, this.convert13b(t.words, t.length, v, h), this.convert13b(r.words, r.length, l, h), this.transform(v, c, u, e, h, d), this.transform(l, c, b, _, h, d);
      for (var q = 0; q < h; q++) {
        var O = u[q] * b[q] - e[q] * _[q];
        e[q] = u[q] * _[q] + e[q] * b[q], u[q] = O;
      }
      return this.conjugate(u, e, h), this.transform(u, e, C, c, h, d), this.conjugate(C, c, h), this.normalize13b(C, h), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), z(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      s(typeof t == "number"), s(t < 67108864);
      for (var r = 0, i = 0; i < this.length; i++) {
        var h = (this.words[i] | 0) * t, d = (h & 67108863) + (r & 67108863);
        r >>= 26, r += h / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = k(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, h = 0; h < r.length && r[h] === 0; h++, i = i.sqr())
        ;
      if (++h < r.length)
        for (var d = i.sqr(); h < r.length; h++, d = d.sqr())
          r[h] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & h, u = (this.words[d] | 0) - v << r;
          this.words[d] = u | c, c = v >>> 26 - r;
        }
        c && (this.words[d] = c, this.length++);
      }
      if (i !== 0) {
        for (d = this.length - 1; d >= 0; d--)
          this.words[d + i] = this.words[d];
        for (d = 0; d < i; d++)
          this.words[d] = 0;
        this.length += i;
      }
      return this.strip();
    }, f.prototype.ishln = function(t) {
      return s(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      s(typeof t == "number" && t >= 0);
      var h;
      r ? h = (r - r % 26) / 26 : h = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (h -= c, h = Math.max(0, h), u) {
        for (var e = 0; e < c; e++)
          u.words[e] = this.words[e];
        u.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var l = 0;
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= h); e--) {
        var b = this.words[e] | 0;
        this.words[e] = l << 26 - d | b >>> d, l = b & v;
      }
      return u && l !== 0 && (u.words[u.length++] = l), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return s(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & h);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var h = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= h;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return s(typeof t == "number"), s(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (s(typeof t == "number"), s(t < 67108864), t < 0)
        return this.iaddn(-t);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(t), this.negative = 1, this;
      if (this.words[0] -= t, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var r = 0; r < this.length && this.words[r] < 0; r++)
          this.words[r] += 67108864, this.words[r + 1] -= 1;
      return this.strip();
    }, f.prototype.addn = function(t) {
      return this.clone().iaddn(t);
    }, f.prototype.subn = function(t) {
      return this.clone().isubn(t);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(t, r, i) {
      var h = t.length + i, d;
      this._expand(h);
      var c, v = 0;
      for (d = 0; d < t.length; d++) {
        c = (this.words[d + i] | 0) + v;
        var u = (t.words[d] | 0) * r;
        c -= u & 67108863, v = (c >> 26) - (u / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (s(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, h = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), h.iushln(i), c = d.words[d.length - 1] | 0);
      var u = h.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = h.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (h = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (h.words[d.length + _] | 0) * 67108864 + (h.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), h._ishlnsubmul(d, C, _); h.negative !== 0; )
          C--, h.negative = 0, h._ishlnsubmul(d, 1, _), h.isZero() || (h.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), h.strip(), r !== "div" && i !== 0 && h.iushrn(i), {
        div: e || null,
        mod: h
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var h, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (h = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: h,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (h = c.div.neg()), {
        div: h,
        mod: c.mod
      }) : this.negative & t.negative ? (c = this.neg().divmod(t.neg(), r), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.isub(t)), {
        div: c.div,
        mod: d
      }) : t.length > this.length || this.cmp(t) < 0 ? {
        div: new f(0),
        mod: this
      } : t.length === 1 ? r === "div" ? {
        div: this.divn(t.words[0]),
        mod: null
      } : r === "mod" ? {
        div: null,
        mod: new f(this.modn(t.words[0]))
      } : {
        div: this.divn(t.words[0]),
        mod: new f(this.modn(t.words[0]))
      } : this._wordDiv(t, r);
    }, f.prototype.div = function(t) {
      return this.divmod(t, "div", !1).div;
    }, f.prototype.mod = function(t) {
      return this.divmod(t, "mod", !1).mod;
    }, f.prototype.umod = function(t) {
      return this.divmod(t, "mod", !0).mod;
    }, f.prototype.divRound = function(t) {
      var r = this.divmod(t);
      if (r.mod.isZero())
        return r.div;
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, h = t.ushrn(1), d = t.andln(1), c = i.cmp(h);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, h = this.length - 1; h >= 0; h--)
        i = (r * i + (this.words[h] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = (this.words[i] | 0) + r * 67108864;
        this.words[i] = h / t | 0, r = h % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (h.isOdd() || d.isOdd()) && (h.iadd(e), d.isub(l)), h.iushrn(1), d.iushrn(1);
        for (var C = 0, q = 1; !(i.words[0] & q) && C < 26; ++C, q <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(c), d.isub(v)) : (i.isub(r), c.isub(h), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(u)
      };
    }, f.prototype._invmp = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            h.isOdd() && h.iadd(c), h.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(d)) : (i.isub(r), d.isub(h));
      }
      var b;
      return r.cmpn(1) === 0 ? b = h : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var h = 0; r.isEven() && i.isEven(); h++)
        r.iushrn(1), i.iushrn(1);
      do {
        for (; r.isEven(); )
          r.iushrn(1);
        for (; i.isEven(); )
          i.iushrn(1);
        var d = r.cmp(i);
        if (d < 0) {
          var c = r;
          r = i, i = c;
        } else if (d === 0 || i.cmpn(1) === 0)
          break;
        r.isub(i);
      } while (!0);
      return i.iushln(h);
    }, f.prototype.invm = function(t) {
      return this.egcd(t).a.umod(t);
    }, f.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, f.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, f.prototype.andln = function(t) {
      return this.words[0] & t;
    }, f.prototype.bincn = function(t) {
      s(typeof t == "number");
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= h, this;
      for (var d = h, c = i; d !== 0 && c < this.length; c++) {
        var v = this.words[c] | 0;
        v += d, d = v >>> 26, v &= 67108863, this.words[c] = v;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(t) {
      var r = t < 0;
      if (this.negative !== 0 && !r)
        return -1;
      if (this.negative === 0 && r)
        return 1;
      this.strip();
      var i;
      if (this.length > 1)
        i = 1;
      else {
        r && (t = -t), s(t <= 67108863, "Number is too big");
        var h = this.words[0] | 0;
        i = h === t ? 0 : h < t ? -1 : 1;
      }
      return this.negative !== 0 ? -i | 0 : i;
    }, f.prototype.cmp = function(t) {
      if (this.negative !== 0 && t.negative === 0)
        return -1;
      if (this.negative === 0 && t.negative !== 0)
        return 1;
      var r = this.ucmp(t);
      return this.negative !== 0 ? -r | 0 : r;
    }, f.prototype.ucmp = function(t) {
      if (this.length > t.length)
        return 1;
      if (this.length < t.length)
        return -1;
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = this.words[i] | 0, d = t.words[i] | 0;
        if (h !== d) {
          h < d ? r = -1 : h > d && (r = 1);
          break;
        }
      }
      return r;
    }, f.prototype.gtn = function(t) {
      return this.cmpn(t) === 1;
    }, f.prototype.gt = function(t) {
      return this.cmp(t) === 1;
    }, f.prototype.gten = function(t) {
      return this.cmpn(t) >= 0;
    }, f.prototype.gte = function(t) {
      return this.cmp(t) >= 0;
    }, f.prototype.ltn = function(t) {
      return this.cmpn(t) === -1;
    }, f.prototype.lt = function(t) {
      return this.cmp(t) === -1;
    }, f.prototype.lten = function(t) {
      return this.cmpn(t) <= 0;
    }, f.prototype.lte = function(t) {
      return this.cmp(t) <= 0;
    }, f.prototype.eqn = function(t) {
      return this.cmpn(t) === 0;
    }, f.prototype.eq = function(t) {
      return this.cmp(t) === 0;
    }, f.red = function(t) {
      return new Y(t);
    }, f.prototype.toRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), s(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return s(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return s(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return s(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return s(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return s(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return s(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return s(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return s(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return s(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return s(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return s(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return s(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var lt = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function H(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    H.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, H.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var h = i < this.n ? -1 : r.ucmp(this.p);
      return h === 0 ? (r.words[0] = 0, r.length = 1) : h > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, H.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, H.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function At() {
      H.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(At, H), At.prototype.split = function(t, r) {
      for (var i = 4194303, h = Math.min(t.length, 9), d = 0; d < h; d++)
        r.words[d] = t.words[d];
      if (r.length = h, t.length <= 9) {
        t.words[0] = 0, t.length = 1;
        return;
      }
      var c = t.words[9];
      for (r.words[r.length++] = c & i, d = 10; d < t.length; d++) {
        var v = t.words[d] | 0;
        t.words[d - 10] = (v & i) << 4 | c >>> 22, c = v;
      }
      c >>>= 22, t.words[d - 10] = c, c === 0 && t.length > 10 ? t.length -= 10 : t.length -= 9;
    }, At.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = t.words[i] | 0;
        r += h * 977, t.words[i] = r & 67108863, r = h * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function Bt() {
      H.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(Bt, H);
    function Ct() {
      H.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(Ct, H);
    function Et() {
      H.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(Et, H), Et.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = (t.words[i] | 0) * 19 + r, d = h & 67108863;
        h >>>= 26, t.words[i] = d, r = h;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (lt[t])
        return lt[t];
      var r;
      if (t === "k256")
        r = new At();
      else if (t === "p224")
        r = new Bt();
      else if (t === "p192")
        r = new Ct();
      else if (t === "p25519")
        r = new Et();
      else
        throw new Error("Unknown prime " + t);
      return lt[t] = r, r;
    };
    function Y(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        s(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    Y.prototype._verify1 = function(t) {
      s(t.negative === 0, "red works only with positives"), s(t.red, "red works only with red numbers");
    }, Y.prototype._verify2 = function(t, r) {
      s((t.negative | r.negative) === 0, "red works only with positives"), s(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, Y.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, Y.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, Y.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, Y.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, Y.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, Y.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, Y.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, Y.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, Y.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, Y.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, Y.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, Y.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (s(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var h = this.m.subn(1), d = 0; !h.isZero() && h.andln(1) === 0; )
        d++, h.iushrn(1);
      s(!h.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, h), b = this.pow(t, h.addn(1).iushrn(1)), _ = this.pow(t, h), C = d; _.cmp(c) !== 0; ) {
        for (var q = _, O = 0; q.cmp(c) !== 0; O++)
          q = q.redSqr();
        s(O < C);
        var R = this.pow(l, new f(1).iushln(C - O - 1));
        b = b.redMul(R), l = R.redSqr(), _ = _.redMul(l), C = O;
      }
      return b;
    }, Y.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, Y.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, h = new Array(1 << i);
      h[0] = new f(1).toRed(this), h[1] = t;
      for (var d = 2; d < h.length; d++)
        h[d] = this.mul(h[d - 1], t);
      var c = h[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== h[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, h[v]), u = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, Y.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, Y.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new It(t);
    };
    function It(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(It, Y), It.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, It.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, It.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(a, Xt);
})($0);
var X1 = $0.exports, dn = { exports: {} }, ka;
function L0() {
  if (ka)
    return dn.exports;
  ka = 1;
  var a;
  dn.exports = function(m) {
    return a || (a = new n(null)), a.generate(m);
  };
  function n(s) {
    this.rand = s;
  }
  if (dn.exports.Rand = n, n.prototype.generate = function(m) {
    return this._rand(m);
  }, n.prototype._rand = function(m) {
    if (this.rand.getBytes)
      return this.rand.getBytes(m);
    for (var f = new Uint8Array(m), g = 0; g < f.length; g++)
      f[g] = this.rand.getByte();
    return f;
  }, typeof self == "object")
    self.crypto && self.crypto.getRandomValues ? n.prototype._rand = function(m) {
      var f = new Uint8Array(m);
      return self.crypto.getRandomValues(f), f;
    } : self.msCrypto && self.msCrypto.getRandomValues ? n.prototype._rand = function(m) {
      var f = new Uint8Array(m);
      return self.msCrypto.getRandomValues(f), f;
    } : typeof window == "object" && (n.prototype._rand = function() {
      throw new Error("Not implemented yet");
    });
  else
    try {
      var o = Qo();
      if (typeof o.randomBytes != "function")
        throw new Error("Not supported");
      n.prototype._rand = function(m) {
        return o.randomBytes(m);
      };
    } catch (s) {
    }
  return dn.exports;
}
var _f, Ia;
function Qs() {
  if (Ia)
    return _f;
  Ia = 1;
  var a = X1, n = L0();
  function o(s) {
    this.rand = s || new n.Rand();
  }
  return _f = o, o.create = function(m) {
    return new o(m);
  }, o.prototype._randbelow = function(m) {
    var f = m.bitLength(), g = Math.ceil(f / 8);
    do
      var y = new a(this.rand.generate(g));
    while (y.cmp(m) >= 0);
    return y;
  }, o.prototype._randrange = function(m, f) {
    var g = f.sub(m);
    return m.add(this._randbelow(g));
  }, o.prototype.test = function(m, f, g) {
    var y = m.bitLength(), S = a.mont(m), B = new a(1).toRed(S);
    f || (f = Math.max(1, y / 48 | 0));
    for (var M = m.subn(1), x = 0; !M.testn(x); x++)
      ;
    for (var I = m.shrn(x), k = M.toRed(S), D = !0; f > 0; f--) {
      var U = this._randrange(new a(2), M);
      g && g(U);
      var W = U.toRed(S).redPow(I);
      if (!(W.cmp(B) === 0 || W.cmp(k) === 0)) {
        for (var z = 1; z < x; z++) {
          if (W = W.redSqr(), W.cmp(B) === 0)
            return !1;
          if (W.cmp(k) === 0)
            break;
        }
        if (z === x)
          return !1;
      }
    }
    return D;
  }, o.prototype.getDivisor = function(m, f) {
    var g = m.bitLength(), y = a.mont(m), S = new a(1).toRed(y);
    f || (f = Math.max(1, g / 48 | 0));
    for (var B = m.subn(1), M = 0; !B.testn(M); M++)
      ;
    for (var x = m.shrn(M), I = B.toRed(y); f > 0; f--) {
      var k = this._randrange(new a(2), B), D = m.gcd(k);
      if (D.cmpn(1) !== 0)
        return D;
      var U = k.toRed(y).redPow(x);
      if (!(U.cmp(S) === 0 || U.cmp(I) === 0)) {
        for (var W = 1; W < M; W++) {
          if (U = U.redSqr(), U.cmp(S) === 0)
            return U.fromRed().subn(1).gcd(m);
          if (U.cmp(I) === 0)
            break;
        }
        if (W === M)
          return U = U.redSqr(), U.fromRed().subn(1).gcd(m);
      }
    }
    return !1;
  }, _f;
}
var Sf, Ra;
function to() {
  if (Ra)
    return Sf;
  Ra = 1;
  var a = yi;
  Sf = W, W.simpleSieve = D, W.fermatTest = U;
  var n = js, o = new n(24), s = Qs(), m = new s(), f = new n(1), g = new n(2), y = new n(5);
  new n(16), new n(8);
  var S = new n(10), B = new n(3);
  new n(7);
  var M = new n(11), x = new n(4);
  new n(12);
  var I = null;
  function k() {
    if (I !== null)
      return I;
    var z = 1048576, $ = [];
    $[0] = 2;
    for (var lt = 1, H = 3; H < z; H += 2) {
      for (var At = Math.ceil(Math.sqrt(H)), Bt = 0; Bt < lt && $[Bt] <= At && H % $[Bt] !== 0; Bt++)
        ;
      lt !== Bt && $[Bt] <= At || ($[lt++] = H);
    }
    return I = $, $;
  }
  function D(z) {
    for (var $ = k(), lt = 0; lt < $.length; lt++)
      if (z.modn($[lt]) === 0)
        return z.cmpn($[lt]) === 0;
    return !0;
  }
  function U(z) {
    var $ = n.mont(z);
    return g.toRed($).redPow(z.subn(1)).fromRed().cmpn(1) === 0;
  }
  function W(z, $) {
    if (z < 16)
      return $ === 2 || $ === 5 ? new n([140, 123]) : new n([140, 39]);
    $ = new n($);
    for (var lt, H; ; ) {
      for (lt = new n(a(Math.ceil(z / 8))); lt.bitLength() > z; )
        lt.ishrn(1);
      if (lt.isEven() && lt.iadd(f), lt.testn(1) || lt.iadd(g), $.cmp(g)) {
        if (!$.cmp(y))
          for (; lt.mod(S).cmp(B); )
            lt.iadd(x);
      } else
        for (; lt.mod(o).cmp(M); )
          lt.iadd(x);
      if (H = lt.shrn(1), D(H) && D(lt) && U(H) && U(lt) && m.test(H) && m.test(lt))
        return lt;
    }
  }
  return Sf;
}
const j1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
}, Q1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
}, tv = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
}, ev = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
}, rv = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
}, iv = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
}, nv = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
}, fv = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
}, av = {
  modp1: j1,
  modp2: Q1,
  modp5: tv,
  modp14: ev,
  modp15: rv,
  modp16: iv,
  modp17: nv,
  modp18: fv
};
var Af, Ta;
function hv() {
  if (Ta)
    return Af;
  Ta = 1;
  var a = js, n = Qs(), o = new n(), s = new a(24), m = new a(11), f = new a(10), g = new a(3), y = new a(7), S = to(), B = yi;
  Af = D;
  function M(W, z) {
    return z = z || "utf8", mt.isBuffer(W) || (W = new mt(W, z)), this._pub = new a(W), this;
  }
  function x(W, z) {
    return z = z || "utf8", mt.isBuffer(W) || (W = new mt(W, z)), this._priv = new a(W), this;
  }
  var I = {};
  function k(W, z) {
    var $ = z.toString("hex"), lt = [$, W.toString(16)].join("_");
    if (lt in I)
      return I[lt];
    var H = 0;
    if (W.isEven() || !S.simpleSieve || !S.fermatTest(W) || !o.test(W))
      return H += 1, $ === "02" || $ === "05" ? H += 8 : H += 4, I[lt] = H, H;
    o.test(W.shrn(1)) || (H += 2);
    var At;
    switch ($) {
      case "02":
        W.mod(s).cmp(m) && (H += 8);
        break;
      case "05":
        At = W.mod(f), At.cmp(g) && At.cmp(y) && (H += 8);
        break;
      default:
        H += 4;
    }
    return I[lt] = H, H;
  }
  function D(W, z, $) {
    this.setGenerator(z), this.__prime = new a(W), this._prime = a.mont(this.__prime), this._primeLen = W.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, $ ? (this.setPublicKey = M, this.setPrivateKey = x) : this._primeCode = 8;
  }
  Object.defineProperty(D.prototype, "verifyError", {
    enumerable: !0,
    get: function() {
      return typeof this._primeCode != "number" && (this._primeCode = k(this.__prime, this.__gen)), this._primeCode;
    }
  }), D.prototype.generateKeys = function() {
    return this._priv || (this._priv = new a(B(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey();
  }, D.prototype.computeSecret = function(W) {
    W = new a(W), W = W.toRed(this._prime);
    var z = W.redPow(this._priv).fromRed(), $ = new mt(z.toArray()), lt = this.getPrime();
    if ($.length < lt.length) {
      var H = new mt(lt.length - $.length);
      H.fill(0), $ = mt.concat([H, $]);
    }
    return $;
  }, D.prototype.getPublicKey = function(z) {
    return U(this._pub, z);
  }, D.prototype.getPrivateKey = function(z) {
    return U(this._priv, z);
  }, D.prototype.getPrime = function(W) {
    return U(this.__prime, W);
  }, D.prototype.getGenerator = function(W) {
    return U(this._gen, W);
  }, D.prototype.setGenerator = function(W, z) {
    return z = z || "utf8", mt.isBuffer(W) || (W = new mt(W, z)), this.__gen = W, this._gen = new a(W), this;
  };
  function U(W, z) {
    var $ = new mt(W.toArray());
    return z ? $.toString(z) : $;
  }
  return Af;
}
var Ca;
function sv() {
  if (Ca)
    return Kr;
  Ca = 1;
  var a = to(), n = av, o = hv();
  function s(g) {
    var y = new mt(n[g].prime, "hex"), S = new mt(n[g].gen, "hex");
    return new o(y, S);
  }
  var m = {
    binary: !0,
    hex: !0,
    base64: !0
  };
  function f(g, y, S, B) {
    return mt.isBuffer(y) || m[y] === void 0 ? f(g, "binary", y, S) : (y = y || "binary", B = B || "binary", S = S || new mt([2]), mt.isBuffer(S) || (S = new mt(S, B)), typeof g == "number" ? new o(a(g, S), S, !0) : (mt.isBuffer(g) || (g = new mt(g, y)), new o(g, S, !0)));
  }
  return Kr.DiffieHellmanGroup = Kr.createDiffieHellmanGroup = Kr.getDiffieHellman = s, Kr.createDiffieHellman = Kr.DiffieHellman = f, Kr;
}
var l0 = { exports: {} }, d0 = { exports: {} };
typeof we == "undefined" || !we.version || we.version.indexOf("v0.") === 0 || we.version.indexOf("v1.") === 0 && we.version.indexOf("v1.8.") !== 0 ? d0.exports = { nextTick: ov } : d0.exports = we;
function ov(a, n, o, s) {
  if (typeof a != "function")
    throw new TypeError('"callback" argument must be a function');
  var m = arguments.length, f, g;
  switch (m) {
    case 0:
    case 1:
      return we.nextTick(a);
    case 2:
      return we.nextTick(function() {
        a.call(null, n);
      });
    case 3:
      return we.nextTick(function() {
        a.call(null, n, o);
      });
    case 4:
      return we.nextTick(function() {
        a.call(null, n, o, s);
      });
    default:
      for (f = new Array(m - 1), g = 0; g < f.length; )
        f[g++] = arguments[g];
      return we.nextTick(function() {
        a.apply(null, f);
      });
  }
}
var Xn = d0.exports, uv = {}.toString, lv = Array.isArray || function(a) {
  return uv.call(a) == "[object Array]";
}, eo = Ne.EventEmitter, c0 = { exports: {} };
(function(a, n) {
  var o = br, s = o.Buffer;
  function m(g, y) {
    for (var S in g)
      y[S] = g[S];
  }
  s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? a.exports = o : (m(o, n), n.Buffer = f);
  function f(g, y, S) {
    return s(g, y, S);
  }
  m(s, f), f.from = function(g, y, S) {
    if (typeof g == "number")
      throw new TypeError("Argument must not be a number");
    return s(g, y, S);
  }, f.alloc = function(g, y, S) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    var B = s(g);
    return y !== void 0 ? typeof S == "string" ? B.fill(y, S) : B.fill(y) : B.fill(0), B;
  }, f.allocUnsafe = function(g) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    return s(g);
  }, f.allocUnsafeSlow = function(g) {
    if (typeof g != "number")
      throw new TypeError("Argument must be a number");
    return o.SlowBuffer(g);
  };
})(c0, c0.exports);
var U0 = c0.exports, Me = {};
function dv(a) {
  return Array.isArray ? Array.isArray(a) : jn(a) === "[object Array]";
}
Me.isArray = dv;
function cv(a) {
  return typeof a == "boolean";
}
Me.isBoolean = cv;
function vv(a) {
  return a === null;
}
Me.isNull = vv;
function pv(a) {
  return a == null;
}
Me.isNullOrUndefined = pv;
function mv(a) {
  return typeof a == "number";
}
Me.isNumber = mv;
function gv(a) {
  return typeof a == "string";
}
Me.isString = gv;
function bv(a) {
  return typeof a == "symbol";
}
Me.isSymbol = bv;
function yv(a) {
  return a === void 0;
}
Me.isUndefined = yv;
function wv(a) {
  return jn(a) === "[object RegExp]";
}
Me.isRegExp = wv;
function Mv(a) {
  return typeof a == "object" && a !== null;
}
Me.isObject = Mv;
function xv(a) {
  return jn(a) === "[object Date]";
}
Me.isDate = xv;
function _v(a) {
  return jn(a) === "[object Error]" || a instanceof Error;
}
Me.isError = _v;
function Sv(a) {
  return typeof a == "function";
}
Me.isFunction = Sv;
function Av(a) {
  return a === null || typeof a == "boolean" || typeof a == "number" || typeof a == "string" || typeof a == "symbol" || // ES6 symbol
  typeof a == "undefined";
}
Me.isPrimitive = Av;
Me.isBuffer = br.Buffer.isBuffer;
function jn(a) {
  return Object.prototype.toString.call(a);
}
var Bf = { exports: {} }, Fa;
function Bv() {
  return Fa || (Fa = 1, function(a) {
    function n(f, g) {
      if (!(f instanceof g))
        throw new TypeError("Cannot call a class as a function");
    }
    var o = U0.Buffer, s = Ne;
    function m(f, g, y) {
      f.copy(g, y);
    }
    a.exports = function() {
      function f() {
        n(this, f), this.head = null, this.tail = null, this.length = 0;
      }
      return f.prototype.push = function(y) {
        var S = { data: y, next: null };
        this.length > 0 ? this.tail.next = S : this.head = S, this.tail = S, ++this.length;
      }, f.prototype.unshift = function(y) {
        var S = { data: y, next: this.head };
        this.length === 0 && (this.tail = S), this.head = S, ++this.length;
      }, f.prototype.shift = function() {
        if (this.length !== 0) {
          var y = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, y;
        }
      }, f.prototype.clear = function() {
        this.head = this.tail = null, this.length = 0;
      }, f.prototype.join = function(y) {
        if (this.length === 0)
          return "";
        for (var S = this.head, B = "" + S.data; S = S.next; )
          B += y + S.data;
        return B;
      }, f.prototype.concat = function(y) {
        if (this.length === 0)
          return o.alloc(0);
        for (var S = o.allocUnsafe(y >>> 0), B = this.head, M = 0; B; )
          m(B.data, S, M), M += B.data.length, B = B.next;
        return S;
      }, f;
    }(), s && s.inspect && s.inspect.custom && (a.exports.prototype[s.inspect.custom] = function() {
      var f = s.inspect({ length: this.length });
      return this.constructor.name + " " + f;
    });
  }(Bf)), Bf.exports;
}
var cn = Xn;
function Ev(a, n) {
  var o = this, s = this._readableState && this._readableState.destroyed, m = this._writableState && this._writableState.destroyed;
  return s || m ? (n ? n(a) : a && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, cn.nextTick(vn, this, a)) : cn.nextTick(vn, this, a)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(a || null, function(f) {
    !n && f ? o._writableState ? o._writableState.errorEmitted || (o._writableState.errorEmitted = !0, cn.nextTick(vn, o, f)) : cn.nextTick(vn, o, f) : n && n(f);
  }), this);
}
function kv() {
  this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
}
function vn(a, n) {
  a.emit("error", n);
}
var ro = {
  destroy: Ev,
  undestroy: kv
}, Iv = Rv;
function Rv(a, n) {
  if (Ef("noDeprecation"))
    return a;
  var o = !1;
  function s() {
    if (!o) {
      if (Ef("throwDeprecation"))
        throw new Error(n);
      Ef("traceDeprecation") ? console.trace(n) : console.warn(n), o = !0;
    }
    return a.apply(this, arguments);
  }
  return s;
}
function Ef(a) {
  try {
    if (!Xt.localStorage)
      return !1;
  } catch (o) {
    return !1;
  }
  var n = Xt.localStorage[a];
  return n == null ? !1 : String(n).toLowerCase() === "true";
}
var kf, qa;
function io() {
  if (qa)
    return kf;
  qa = 1;
  var a = Xn;
  kf = U;
  function n(c) {
    var v = this;
    this.next = null, this.entry = null, this.finish = function() {
      d(v, c);
    };
  }
  var o = !we.browser && ["v0.10", "v0.9."].indexOf(we.version.slice(0, 5)) > -1 ? setImmediate : a.nextTick, s;
  U.WritableState = k;
  var m = Object.create(Me);
  m.inherits = Gt;
  var f = {
    deprecate: Iv
  }, g = eo, y = U0.Buffer, S = (typeof Xt != "undefined" ? Xt : typeof window != "undefined" ? window : typeof self != "undefined" ? self : {}).Uint8Array || function() {
  };
  function B(c) {
    return y.from(c);
  }
  function M(c) {
    return y.isBuffer(c) || c instanceof S;
  }
  var x = ro;
  m.inherits(U, g);
  function I() {
  }
  function k(c, v) {
    s = s || ci(), c = c || {};
    var u = v instanceof s;
    this.objectMode = !!c.objectMode, u && (this.objectMode = this.objectMode || !!c.writableObjectMode);
    var e = c.highWaterMark, l = c.writableHighWaterMark, b = this.objectMode ? 16 : 16 * 1024;
    e || e === 0 ? this.highWaterMark = e : u && (l || l === 0) ? this.highWaterMark = l : this.highWaterMark = b, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var _ = c.decodeStrings === !1;
    this.decodeStrings = !_, this.defaultEncoding = c.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(C) {
      Ct(v, C);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new n(this);
  }
  k.prototype.getBuffer = function() {
    for (var v = this.bufferedRequest, u = []; v; )
      u.push(v), v = v.next;
    return u;
  }, function() {
    try {
      Object.defineProperty(k.prototype, "buffer", {
        get: f.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch (c) {
    }
  }();
  var D;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (D = Function.prototype[Symbol.hasInstance], Object.defineProperty(U, Symbol.hasInstance, {
    value: function(c) {
      return D.call(this, c) ? !0 : this !== U ? !1 : c && c._writableState instanceof k;
    }
  })) : D = function(c) {
    return c instanceof this;
  };
  function U(c) {
    if (s = s || ci(), !D.call(U, this) && !(this instanceof s))
      return new U(c);
    this._writableState = new k(c, this), this.writable = !0, c && (typeof c.write == "function" && (this._write = c.write), typeof c.writev == "function" && (this._writev = c.writev), typeof c.destroy == "function" && (this._destroy = c.destroy), typeof c.final == "function" && (this._final = c.final)), g.call(this);
  }
  U.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function W(c, v) {
    var u = new Error("write after end");
    c.emit("error", u), a.nextTick(v, u);
  }
  function z(c, v, u, e) {
    var l = !0, b = !1;
    return u === null ? b = new TypeError("May not write null values to stream") : typeof u != "string" && u !== void 0 && !v.objectMode && (b = new TypeError("Invalid non-string/buffer chunk")), b && (c.emit("error", b), a.nextTick(e, b), l = !1), l;
  }
  U.prototype.write = function(c, v, u) {
    var e = this._writableState, l = !1, b = !e.objectMode && M(c);
    return b && !y.isBuffer(c) && (c = B(c)), typeof v == "function" && (u = v, v = null), b ? v = "buffer" : v || (v = e.defaultEncoding), typeof u != "function" && (u = I), e.ended ? W(this, u) : (b || z(this, e, c, u)) && (e.pendingcb++, l = lt(this, e, b, c, v, u)), l;
  }, U.prototype.cork = function() {
    var c = this._writableState;
    c.corked++;
  }, U.prototype.uncork = function() {
    var c = this._writableState;
    c.corked && (c.corked--, !c.writing && !c.corked && !c.bufferProcessing && c.bufferedRequest && It(this, c));
  }, U.prototype.setDefaultEncoding = function(v) {
    if (typeof v == "string" && (v = v.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((v + "").toLowerCase()) > -1))
      throw new TypeError("Unknown encoding: " + v);
    return this._writableState.defaultEncoding = v, this;
  };
  function $(c, v, u) {
    return !c.objectMode && c.decodeStrings !== !1 && typeof v == "string" && (v = y.from(v, u)), v;
  }
  Object.defineProperty(U.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function lt(c, v, u, e, l, b) {
    if (!u) {
      var _ = $(v, e, l);
      e !== _ && (u = !0, l = "buffer", e = _);
    }
    var C = v.objectMode ? 1 : e.length;
    v.length += C;
    var q = v.length < v.highWaterMark;
    if (q || (v.needDrain = !0), v.writing || v.corked) {
      var O = v.lastBufferedRequest;
      v.lastBufferedRequest = {
        chunk: e,
        encoding: l,
        isBuf: u,
        callback: b,
        next: null
      }, O ? O.next = v.lastBufferedRequest : v.bufferedRequest = v.lastBufferedRequest, v.bufferedRequestCount += 1;
    } else
      H(c, v, !1, C, e, l, b);
    return q;
  }
  function H(c, v, u, e, l, b, _) {
    v.writelen = e, v.writecb = _, v.writing = !0, v.sync = !0, u ? c._writev(l, v.onwrite) : c._write(l, b, v.onwrite), v.sync = !1;
  }
  function At(c, v, u, e, l) {
    --v.pendingcb, u ? (a.nextTick(l, e), a.nextTick(i, c, v), c._writableState.errorEmitted = !0, c.emit("error", e)) : (l(e), c._writableState.errorEmitted = !0, c.emit("error", e), i(c, v));
  }
  function Bt(c) {
    c.writing = !1, c.writecb = null, c.length -= c.writelen, c.writelen = 0;
  }
  function Ct(c, v) {
    var u = c._writableState, e = u.sync, l = u.writecb;
    if (Bt(u), v)
      At(c, u, e, v, l);
    else {
      var b = p(u);
      !b && !u.corked && !u.bufferProcessing && u.bufferedRequest && It(c, u), e ? o(Et, c, u, b, l) : Et(c, u, b, l);
    }
  }
  function Et(c, v, u, e) {
    u || Y(c, v), v.pendingcb--, e(), i(c, v);
  }
  function Y(c, v) {
    v.length === 0 && v.needDrain && (v.needDrain = !1, c.emit("drain"));
  }
  function It(c, v) {
    v.bufferProcessing = !0;
    var u = v.bufferedRequest;
    if (c._writev && u && u.next) {
      var e = v.bufferedRequestCount, l = new Array(e), b = v.corkedRequestsFree;
      b.entry = u;
      for (var _ = 0, C = !0; u; )
        l[_] = u, u.isBuf || (C = !1), u = u.next, _ += 1;
      l.allBuffers = C, H(c, v, !0, v.length, l, "", b.finish), v.pendingcb++, v.lastBufferedRequest = null, b.next ? (v.corkedRequestsFree = b.next, b.next = null) : v.corkedRequestsFree = new n(v), v.bufferedRequestCount = 0;
    } else {
      for (; u; ) {
        var q = u.chunk, O = u.encoding, R = u.callback, P = v.objectMode ? 1 : q.length;
        if (H(c, v, !1, P, q, O, R), u = u.next, v.bufferedRequestCount--, v.writing)
          break;
      }
      u === null && (v.lastBufferedRequest = null);
    }
    v.bufferedRequest = u, v.bufferProcessing = !1;
  }
  U.prototype._write = function(c, v, u) {
    u(new Error("_write() is not implemented"));
  }, U.prototype._writev = null, U.prototype.end = function(c, v, u) {
    var e = this._writableState;
    typeof c == "function" ? (u = c, c = null, v = null) : typeof v == "function" && (u = v, v = null), c != null && this.write(c, v), e.corked && (e.corked = 1, this.uncork()), e.ending || h(this, e, u);
  };
  function p(c) {
    return c.ending && c.length === 0 && c.bufferedRequest === null && !c.finished && !c.writing;
  }
  function t(c, v) {
    c._final(function(u) {
      v.pendingcb--, u && c.emit("error", u), v.prefinished = !0, c.emit("prefinish"), i(c, v);
    });
  }
  function r(c, v) {
    !v.prefinished && !v.finalCalled && (typeof c._final == "function" ? (v.pendingcb++, v.finalCalled = !0, a.nextTick(t, c, v)) : (v.prefinished = !0, c.emit("prefinish")));
  }
  function i(c, v) {
    var u = p(v);
    return u && (r(c, v), v.pendingcb === 0 && (v.finished = !0, c.emit("finish"))), u;
  }
  function h(c, v, u) {
    v.ending = !0, i(c, v), u && (v.finished ? a.nextTick(u) : c.once("finish", u)), v.ended = !0, c.writable = !1;
  }
  function d(c, v, u) {
    var e = c.entry;
    for (c.entry = null; e; ) {
      var l = e.callback;
      v.pendingcb--, l(u), e = e.next;
    }
    v.corkedRequestsFree.next = c;
  }
  return Object.defineProperty(U.prototype, "destroyed", {
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(c) {
      this._writableState && (this._writableState.destroyed = c);
    }
  }), U.prototype.destroy = x.destroy, U.prototype._undestroy = x.undestroy, U.prototype._destroy = function(c, v) {
    this.end(), v(c);
  }, kf;
}
var If, Pa;
function ci() {
  if (Pa)
    return If;
  Pa = 1;
  var a = Xn, n = Object.keys || function(x) {
    var I = [];
    for (var k in x)
      I.push(k);
    return I;
  };
  If = S;
  var o = Object.create(Me);
  o.inherits = Gt;
  var s = no(), m = io();
  o.inherits(S, s);
  for (var f = n(m.prototype), g = 0; g < f.length; g++) {
    var y = f[g];
    S.prototype[y] || (S.prototype[y] = m.prototype[y]);
  }
  function S(x) {
    if (!(this instanceof S))
      return new S(x);
    s.call(this, x), m.call(this, x), x && x.readable === !1 && (this.readable = !1), x && x.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, x && x.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", B);
  }
  Object.defineProperty(S.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function B() {
    this.allowHalfOpen || this._writableState.ended || a.nextTick(M, this);
  }
  function M(x) {
    x.end();
  }
  return Object.defineProperty(S.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(x) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = x, this._writableState.destroyed = x);
    }
  }), S.prototype._destroy = function(x, I) {
    this.push(null), this.end(), a.nextTick(I, x);
  }, If;
}
var Rf, Da;
function no() {
  if (Da)
    return Rf;
  Da = 1;
  var a = Xn;
  Rf = $;
  var n = lv, o;
  $.ReadableState = z, Ne.EventEmitter;
  var s = function(R, P) {
    return R.listeners(P).length;
  }, m = eo, f = U0.Buffer, g = (typeof Xt != "undefined" ? Xt : typeof window != "undefined" ? window : typeof self != "undefined" ? self : {}).Uint8Array || function() {
  };
  function y(R) {
    return f.from(R);
  }
  function S(R) {
    return f.isBuffer(R) || R instanceof g;
  }
  var B = Object.create(Me);
  B.inherits = Gt;
  var M = Ne, x = void 0;
  M && M.debuglog ? x = M.debuglog("stream") : x = function() {
  };
  var I = Bv(), k = ro, D;
  B.inherits($, m);
  var U = ["error", "close", "destroy", "pause", "resume"];
  function W(R, P, N) {
    if (typeof R.prependListener == "function")
      return R.prependListener(P, N);
    !R._events || !R._events[P] ? R.on(P, N) : n(R._events[P]) ? R._events[P].unshift(N) : R._events[P] = [N, R._events[P]];
  }
  function z(R, P) {
    o = o || ci(), R = R || {};
    var N = P instanceof o;
    this.objectMode = !!R.objectMode, N && (this.objectMode = this.objectMode || !!R.readableObjectMode);
    var K = R.highWaterMark, kt = R.readableHighWaterMark, Z = this.objectMode ? 16 : 16 * 1024;
    K || K === 0 ? this.highWaterMark = K : N && (kt || kt === 0) ? this.highWaterMark = kt : this.highWaterMark = Z, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new I(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = R.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, R.encoding && (D || (D = Sn.StringDecoder), this.decoder = new D(R.encoding), this.encoding = R.encoding);
  }
  function $(R) {
    if (o = o || ci(), !(this instanceof $))
      return new $(R);
    this._readableState = new z(R, this), this.readable = !0, R && (typeof R.read == "function" && (this._read = R.read), typeof R.destroy == "function" && (this._destroy = R.destroy)), m.call(this);
  }
  Object.defineProperty($.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(R) {
      this._readableState && (this._readableState.destroyed = R);
    }
  }), $.prototype.destroy = k.destroy, $.prototype._undestroy = k.undestroy, $.prototype._destroy = function(R, P) {
    this.push(null), P(R);
  }, $.prototype.push = function(R, P) {
    var N = this._readableState, K;
    return N.objectMode ? K = !0 : typeof R == "string" && (P = P || N.defaultEncoding, P !== N.encoding && (R = f.from(R, P), P = ""), K = !0), lt(this, R, P, !1, K);
  }, $.prototype.unshift = function(R) {
    return lt(this, R, null, !0, !1);
  };
  function lt(R, P, N, K, kt) {
    var Z = R._readableState;
    if (P === null)
      Z.reading = !1, It(R, Z);
    else {
      var J;
      kt || (J = At(Z, P)), J ? R.emit("error", J) : Z.objectMode || P && P.length > 0 ? (typeof P != "string" && !Z.objectMode && Object.getPrototypeOf(P) !== f.prototype && (P = y(P)), K ? Z.endEmitted ? R.emit("error", new Error("stream.unshift() after end event")) : H(R, Z, P, !0) : Z.ended ? R.emit("error", new Error("stream.push() after EOF")) : (Z.reading = !1, Z.decoder && !N ? (P = Z.decoder.write(P), Z.objectMode || P.length !== 0 ? H(R, Z, P, !1) : r(R, Z)) : H(R, Z, P, !1))) : K || (Z.reading = !1);
    }
    return Bt(Z);
  }
  function H(R, P, N, K) {
    P.flowing && P.length === 0 && !P.sync ? (R.emit("data", N), R.read(0)) : (P.length += P.objectMode ? 1 : N.length, K ? P.buffer.unshift(N) : P.buffer.push(N), P.needReadable && p(R)), r(R, P);
  }
  function At(R, P) {
    var N;
    return !S(P) && typeof P != "string" && P !== void 0 && !R.objectMode && (N = new TypeError("Invalid non-string/buffer chunk")), N;
  }
  function Bt(R) {
    return !R.ended && (R.needReadable || R.length < R.highWaterMark || R.length === 0);
  }
  $.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, $.prototype.setEncoding = function(R) {
    return D || (D = Sn.StringDecoder), this._readableState.decoder = new D(R), this._readableState.encoding = R, this;
  };
  var Ct = 8388608;
  function Et(R) {
    return R >= Ct ? R = Ct : (R--, R |= R >>> 1, R |= R >>> 2, R |= R >>> 4, R |= R >>> 8, R |= R >>> 16, R++), R;
  }
  function Y(R, P) {
    return R <= 0 || P.length === 0 && P.ended ? 0 : P.objectMode ? 1 : R !== R ? P.flowing && P.length ? P.buffer.head.data.length : P.length : (R > P.highWaterMark && (P.highWaterMark = Et(R)), R <= P.length ? R : P.ended ? P.length : (P.needReadable = !0, 0));
  }
  $.prototype.read = function(R) {
    x("read", R), R = parseInt(R, 10);
    var P = this._readableState, N = R;
    if (R !== 0 && (P.emittedReadable = !1), R === 0 && P.needReadable && (P.length >= P.highWaterMark || P.ended))
      return x("read: emitReadable", P.length, P.ended), P.length === 0 && P.ended ? C(this) : p(this), null;
    if (R = Y(R, P), R === 0 && P.ended)
      return P.length === 0 && C(this), null;
    var K = P.needReadable;
    x("need readable", K), (P.length === 0 || P.length - R < P.highWaterMark) && (K = !0, x("length less than watermark", K)), P.ended || P.reading ? (K = !1, x("reading or ended", K)) : K && (x("do read"), P.reading = !0, P.sync = !0, P.length === 0 && (P.needReadable = !0), this._read(P.highWaterMark), P.sync = !1, P.reading || (R = Y(N, P)));
    var kt;
    return R > 0 ? kt = e(R, P) : kt = null, kt === null ? (P.needReadable = !0, R = 0) : P.length -= R, P.length === 0 && (P.ended || (P.needReadable = !0), N !== R && P.ended && C(this)), kt !== null && this.emit("data", kt), kt;
  };
  function It(R, P) {
    if (!P.ended) {
      if (P.decoder) {
        var N = P.decoder.end();
        N && N.length && (P.buffer.push(N), P.length += P.objectMode ? 1 : N.length);
      }
      P.ended = !0, p(R);
    }
  }
  function p(R) {
    var P = R._readableState;
    P.needReadable = !1, P.emittedReadable || (x("emitReadable", P.flowing), P.emittedReadable = !0, P.sync ? a.nextTick(t, R) : t(R));
  }
  function t(R) {
    x("emit readable"), R.emit("readable"), u(R);
  }
  function r(R, P) {
    P.readingMore || (P.readingMore = !0, a.nextTick(i, R, P));
  }
  function i(R, P) {
    for (var N = P.length; !P.reading && !P.flowing && !P.ended && P.length < P.highWaterMark && (x("maybeReadMore read 0"), R.read(0), N !== P.length); )
      N = P.length;
    P.readingMore = !1;
  }
  $.prototype._read = function(R) {
    this.emit("error", new Error("_read() is not implemented"));
  }, $.prototype.pipe = function(R, P) {
    var N = this, K = this._readableState;
    switch (K.pipesCount) {
      case 0:
        K.pipes = R;
        break;
      case 1:
        K.pipes = [K.pipes, R];
        break;
      default:
        K.pipes.push(R);
        break;
    }
    K.pipesCount += 1, x("pipe count=%d opts=%j", K.pipesCount, P);
    var kt = (!P || P.end !== !1) && R !== we.stdout && R !== we.stderr, Z = kt ? Ft : qt;
    K.endEmitted ? a.nextTick(Z) : N.once("end", Z), R.on("unpipe", J);
    function J(Q, ct) {
      x("onunpipe"), Q === N && ct && ct.hasUnpiped === !1 && (ct.hasUnpiped = !0, Dt());
    }
    function Ft() {
      x("onend"), R.end();
    }
    var tt = h(N);
    R.on("drain", tt);
    var vt = !1;
    function Dt() {
      x("cleanup"), R.removeListener("close", j), R.removeListener("finish", dt), R.removeListener("drain", tt), R.removeListener("error", Pt), R.removeListener("unpipe", J), N.removeListener("end", Ft), N.removeListener("end", qt), N.removeListener("data", pt), vt = !0, K.awaitDrain && (!R._writableState || R._writableState.needDrain) && tt();
    }
    var et = !1;
    N.on("data", pt);
    function pt(Q) {
      x("ondata"), et = !1;
      var ct = R.write(Q);
      ct === !1 && !et && ((K.pipesCount === 1 && K.pipes === R || K.pipesCount > 1 && O(K.pipes, R) !== -1) && !vt && (x("false write response, pause", K.awaitDrain), K.awaitDrain++, et = !0), N.pause());
    }
    function Pt(Q) {
      x("onerror", Q), qt(), R.removeListener("error", Pt), s(R, "error") === 0 && R.emit("error", Q);
    }
    W(R, "error", Pt);
    function j() {
      R.removeListener("finish", dt), qt();
    }
    R.once("close", j);
    function dt() {
      x("onfinish"), R.removeListener("close", j), qt();
    }
    R.once("finish", dt);
    function qt() {
      x("unpipe"), N.unpipe(R);
    }
    return R.emit("pipe", N), K.flowing || (x("pipe resume"), N.resume()), R;
  };
  function h(R) {
    return function() {
      var P = R._readableState;
      x("pipeOnDrain", P.awaitDrain), P.awaitDrain && P.awaitDrain--, P.awaitDrain === 0 && s(R, "data") && (P.flowing = !0, u(R));
    };
  }
  $.prototype.unpipe = function(R) {
    var P = this._readableState, N = { hasUnpiped: !1 };
    if (P.pipesCount === 0)
      return this;
    if (P.pipesCount === 1)
      return R && R !== P.pipes ? this : (R || (R = P.pipes), P.pipes = null, P.pipesCount = 0, P.flowing = !1, R && R.emit("unpipe", this, N), this);
    if (!R) {
      var K = P.pipes, kt = P.pipesCount;
      P.pipes = null, P.pipesCount = 0, P.flowing = !1;
      for (var Z = 0; Z < kt; Z++)
        K[Z].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var J = O(P.pipes, R);
    return J === -1 ? this : (P.pipes.splice(J, 1), P.pipesCount -= 1, P.pipesCount === 1 && (P.pipes = P.pipes[0]), R.emit("unpipe", this, N), this);
  }, $.prototype.on = function(R, P) {
    var N = m.prototype.on.call(this, R, P);
    if (R === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (R === "readable") {
      var K = this._readableState;
      !K.endEmitted && !K.readableListening && (K.readableListening = K.needReadable = !0, K.emittedReadable = !1, K.reading ? K.length && p(this) : a.nextTick(d, this));
    }
    return N;
  }, $.prototype.addListener = $.prototype.on;
  function d(R) {
    x("readable nexttick read 0"), R.read(0);
  }
  $.prototype.resume = function() {
    var R = this._readableState;
    return R.flowing || (x("resume"), R.flowing = !0, c(this, R)), this;
  };
  function c(R, P) {
    P.resumeScheduled || (P.resumeScheduled = !0, a.nextTick(v, R, P));
  }
  function v(R, P) {
    P.reading || (x("resume read 0"), R.read(0)), P.resumeScheduled = !1, P.awaitDrain = 0, R.emit("resume"), u(R), P.flowing && !P.reading && R.read(0);
  }
  $.prototype.pause = function() {
    return x("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (x("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
  };
  function u(R) {
    var P = R._readableState;
    for (x("flow", P.flowing); P.flowing && R.read() !== null; )
      ;
  }
  $.prototype.wrap = function(R) {
    var P = this, N = this._readableState, K = !1;
    R.on("end", function() {
      if (x("wrapped end"), N.decoder && !N.ended) {
        var J = N.decoder.end();
        J && J.length && P.push(J);
      }
      P.push(null);
    }), R.on("data", function(J) {
      if (x("wrapped data"), N.decoder && (J = N.decoder.write(J)), !(N.objectMode && J == null) && !(!N.objectMode && (!J || !J.length))) {
        var Ft = P.push(J);
        Ft || (K = !0, R.pause());
      }
    });
    for (var kt in R)
      this[kt] === void 0 && typeof R[kt] == "function" && (this[kt] = function(J) {
        return function() {
          return R[J].apply(R, arguments);
        };
      }(kt));
    for (var Z = 0; Z < U.length; Z++)
      R.on(U[Z], this.emit.bind(this, U[Z]));
    return this._read = function(J) {
      x("wrapped _read", J), K && (K = !1, R.resume());
    }, this;
  }, Object.defineProperty($.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), $._fromList = e;
  function e(R, P) {
    if (P.length === 0)
      return null;
    var N;
    return P.objectMode ? N = P.buffer.shift() : !R || R >= P.length ? (P.decoder ? N = P.buffer.join("") : P.buffer.length === 1 ? N = P.buffer.head.data : N = P.buffer.concat(P.length), P.buffer.clear()) : N = l(R, P.buffer, P.decoder), N;
  }
  function l(R, P, N) {
    var K;
    return R < P.head.data.length ? (K = P.head.data.slice(0, R), P.head.data = P.head.data.slice(R)) : R === P.head.data.length ? K = P.shift() : K = N ? b(R, P) : _(R, P), K;
  }
  function b(R, P) {
    var N = P.head, K = 1, kt = N.data;
    for (R -= kt.length; N = N.next; ) {
      var Z = N.data, J = R > Z.length ? Z.length : R;
      if (J === Z.length ? kt += Z : kt += Z.slice(0, R), R -= J, R === 0) {
        J === Z.length ? (++K, N.next ? P.head = N.next : P.head = P.tail = null) : (P.head = N, N.data = Z.slice(J));
        break;
      }
      ++K;
    }
    return P.length -= K, kt;
  }
  function _(R, P) {
    var N = f.allocUnsafe(R), K = P.head, kt = 1;
    for (K.data.copy(N), R -= K.data.length; K = K.next; ) {
      var Z = K.data, J = R > Z.length ? Z.length : R;
      if (Z.copy(N, N.length - R, 0, J), R -= J, R === 0) {
        J === Z.length ? (++kt, K.next ? P.head = K.next : P.head = P.tail = null) : (P.head = K, K.data = Z.slice(J));
        break;
      }
      ++kt;
    }
    return P.length -= kt, N;
  }
  function C(R) {
    var P = R._readableState;
    if (P.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    P.endEmitted || (P.ended = !0, a.nextTick(q, P, R));
  }
  function q(R, P) {
    !R.endEmitted && R.length === 0 && (R.endEmitted = !0, P.readable = !1, P.emit("end"));
  }
  function O(R, P) {
    for (var N = 0, K = R.length; N < K; N++)
      if (R[N] === P)
        return N;
    return -1;
  }
  return Rf;
}
var fo = Er, Qn = ci(), ao = Object.create(Me);
ao.inherits = Gt;
ao.inherits(Er, Qn);
function Tv(a, n) {
  var o = this._transformState;
  o.transforming = !1;
  var s = o.writecb;
  if (!s)
    return this.emit("error", new Error("write callback called multiple times"));
  o.writechunk = null, o.writecb = null, n != null && this.push(n), s(a);
  var m = this._readableState;
  m.reading = !1, (m.needReadable || m.length < m.highWaterMark) && this._read(m.highWaterMark);
}
function Er(a) {
  if (!(this instanceof Er))
    return new Er(a);
  Qn.call(this, a), this._transformState = {
    afterTransform: Tv.bind(this),
    needTransform: !1,
    transforming: !1,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }, this._readableState.needReadable = !0, this._readableState.sync = !1, a && (typeof a.transform == "function" && (this._transform = a.transform), typeof a.flush == "function" && (this._flush = a.flush)), this.on("prefinish", Cv);
}
function Cv() {
  var a = this;
  typeof this._flush == "function" ? this._flush(function(n, o) {
    Na(a, n, o);
  }) : Na(this, null, null);
}
Er.prototype.push = function(a, n) {
  return this._transformState.needTransform = !1, Qn.prototype.push.call(this, a, n);
};
Er.prototype._transform = function(a, n, o) {
  throw new Error("_transform() is not implemented");
};
Er.prototype._write = function(a, n, o) {
  var s = this._transformState;
  if (s.writecb = o, s.writechunk = a, s.writeencoding = n, !s.transforming) {
    var m = this._readableState;
    (s.needTransform || m.needReadable || m.length < m.highWaterMark) && this._read(m.highWaterMark);
  }
};
Er.prototype._read = function(a) {
  var n = this._transformState;
  n.writechunk !== null && n.writecb && !n.transforming ? (n.transforming = !0, this._transform(n.writechunk, n.writeencoding, n.afterTransform)) : n.needTransform = !0;
};
Er.prototype._destroy = function(a, n) {
  var o = this;
  Qn.prototype._destroy.call(this, a, function(s) {
    n(s), o.emit("close");
  });
};
function Na(a, n, o) {
  if (n)
    return a.emit("error", n);
  if (o != null && a.push(o), a._writableState.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (a._transformState.transforming)
    throw new Error("Calling transform done when still transforming");
  return a.push(null);
}
var Fv = Wi, ho = fo, so = Object.create(Me);
so.inherits = Gt;
so.inherits(Wi, ho);
function Wi(a) {
  if (!(this instanceof Wi))
    return new Wi(a);
  ho.call(this, a);
}
Wi.prototype._transform = function(a, n, o) {
  o(null, a);
};
(function(a, n) {
  n = a.exports = no(), n.Stream = n, n.Readable = n, n.Writable = io(), n.Duplex = ci(), n.Transform = fo, n.PassThrough = Fv;
})(l0, l0.exports);
var qv = l0.exports, Pi = { exports: {} }, O0 = { exports: {} };
O0.exports;
(function(a) {
  (function(n, o) {
    function s(r, i) {
      if (!r)
        throw new Error(i || "Assertion failed");
    }
    function m(r, i) {
      r.super_ = i;
      var h = function() {
      };
      h.prototype = i.prototype, r.prototype = new h(), r.prototype.constructor = r;
    }
    function f(r, i, h) {
      if (f.isBN(r))
        return r;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, r !== null && ((i === "le" || i === "be") && (h = i, i = 10), this._init(r || 0, i || 10, h || "be"));
    }
    typeof n == "object" ? n.exports = f : o.BN = f, f.BN = f, f.wordSize = 26;
    var g;
    try {
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Ne.Buffer;
    } catch (r) {
    }
    f.isBN = function(i) {
      return i instanceof f ? !0 : i !== null && typeof i == "object" && i.constructor.wordSize === f.wordSize && Array.isArray(i.words);
    }, f.max = function(i, h) {
      return i.cmp(h) > 0 ? i : h;
    }, f.min = function(i, h) {
      return i.cmp(h) < 0 ? i : h;
    }, f.prototype._init = function(i, h, d) {
      if (typeof i == "number")
        return this._initNumber(i, h, d);
      if (typeof i == "object")
        return this._initArray(i, h, d);
      h === "hex" && (h = 16), s(h === (h | 0) && h >= 2 && h <= 36), i = i.toString().replace(/\s+/g, "");
      var c = 0;
      i[0] === "-" && (c++, this.negative = 1), c < i.length && (h === 16 ? this._parseHex(i, c, d) : (this._parseBase(i, h, c), d === "le" && this._initArray(this.toArray(), h, d)));
    }, f.prototype._initNumber = function(i, h, d) {
      i < 0 && (this.negative = 1, i = -i), i < 67108864 ? (this.words = [i & 67108863], this.length = 1) : i < 4503599627370496 ? (this.words = [
        i & 67108863,
        i / 67108864 & 67108863
      ], this.length = 2) : (s(i < 9007199254740992), this.words = [
        i & 67108863,
        i / 67108864 & 67108863,
        1
      ], this.length = 3), d === "le" && this._initArray(this.toArray(), h, d);
    }, f.prototype._initArray = function(i, h, d) {
      if (s(typeof i.length == "number"), i.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(i.length / 3), this.words = new Array(this.length);
      for (var c = 0; c < this.length; c++)
        this.words[c] = 0;
      var v, u, e = 0;
      if (d === "be")
        for (c = i.length - 1, v = 0; c >= 0; c -= 3)
          u = i[c] | i[c - 1] << 8 | i[c - 2] << 16, this.words[v] |= u << e & 67108863, this.words[v + 1] = u >>> 26 - e & 67108863, e += 24, e >= 26 && (e -= 26, v++);
      else if (d === "le")
        for (c = 0, v = 0; c < i.length; c += 3)
          u = i[c] | i[c + 1] << 8 | i[c + 2] << 16, this.words[v] |= u << e & 67108863, this.words[v + 1] = u >>> 26 - e & 67108863, e += 24, e >= 26 && (e -= 26, v++);
      return this._strip();
    };
    function y(r, i) {
      var h = r.charCodeAt(i);
      if (h >= 48 && h <= 57)
        return h - 48;
      if (h >= 65 && h <= 70)
        return h - 55;
      if (h >= 97 && h <= 102)
        return h - 87;
      s(!1, "Invalid character in " + r);
    }
    function S(r, i, h) {
      var d = y(r, h);
      return h - 1 >= i && (d |= y(r, h - 1) << 4), d;
    }
    f.prototype._parseHex = function(i, h, d) {
      this.length = Math.ceil((i.length - h) / 6), this.words = new Array(this.length);
      for (var c = 0; c < this.length; c++)
        this.words[c] = 0;
      var v = 0, u = 0, e;
      if (d === "be")
        for (c = i.length - 1; c >= h; c -= 2)
          e = S(i, h, c) << v, this.words[u] |= e & 67108863, v >= 18 ? (v -= 18, u += 1, this.words[u] |= e >>> 26) : v += 8;
      else {
        var l = i.length - h;
        for (c = l % 2 === 0 ? h + 1 : h; c < i.length; c += 2)
          e = S(i, h, c) << v, this.words[u] |= e & 67108863, v >= 18 ? (v -= 18, u += 1, this.words[u] |= e >>> 26) : v += 8;
      }
      this._strip();
    };
    function B(r, i, h, d) {
      for (var c = 0, v = 0, u = Math.min(r.length, h), e = i; e < u; e++) {
        var l = r.charCodeAt(e) - 48;
        c *= d, l >= 49 ? v = l - 49 + 10 : l >= 17 ? v = l - 17 + 10 : v = l, s(l >= 0 && v < d, "Invalid character"), c += v;
      }
      return c;
    }
    f.prototype._parseBase = function(i, h, d) {
      this.words = [0], this.length = 1;
      for (var c = 0, v = 1; v <= 67108863; v *= h)
        c++;
      c--, v = v / h | 0;
      for (var u = i.length - d, e = u % c, l = Math.min(u, u - e) + d, b = 0, _ = d; _ < l; _ += c)
        b = B(i, _, _ + c, h), this.imuln(v), this.words[0] + b < 67108864 ? this.words[0] += b : this._iaddn(b);
      if (e !== 0) {
        var C = 1;
        for (b = B(i, _, i.length, h), _ = 0; _ < e; _++)
          C *= h;
        this.imuln(C), this.words[0] + b < 67108864 ? this.words[0] += b : this._iaddn(b);
      }
      this._strip();
    }, f.prototype.copy = function(i) {
      i.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        i.words[h] = this.words[h];
      i.length = this.length, i.negative = this.negative, i.red = this.red;
    };
    function M(r, i) {
      r.words = i.words, r.length = i.length, r.negative = i.negative, r.red = i.red;
    }
    if (f.prototype._move = function(i) {
      M(i, this);
    }, f.prototype.clone = function() {
      var i = new f(null);
      return this.copy(i), i;
    }, f.prototype._expand = function(i) {
      for (; this.length < i; )
        this.words[this.length++] = 0;
      return this;
    }, f.prototype._strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, f.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, typeof Symbol != "undefined" && typeof Symbol.for == "function")
      try {
        f.prototype[Symbol.for("nodejs.util.inspect.custom")] = x;
      } catch (r) {
        f.prototype.inspect = x;
      }
    else
      f.prototype.inspect = x;
    function x() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    }
    var I = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], k = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], D = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    f.prototype.toString = function(i, h) {
      i = i || 10, h = h | 0 || 1;
      var d;
      if (i === 16 || i === "hex") {
        d = "";
        for (var c = 0, v = 0, u = 0; u < this.length; u++) {
          var e = this.words[u], l = ((e << c | v) & 16777215).toString(16);
          v = e >>> 24 - c & 16777215, c += 2, c >= 26 && (c -= 26, u--), v !== 0 || u !== this.length - 1 ? d = I[6 - l.length] + l + d : d = l + d;
        }
        for (v !== 0 && (d = v.toString(16) + d); d.length % h !== 0; )
          d = "0" + d;
        return this.negative !== 0 && (d = "-" + d), d;
      }
      if (i === (i | 0) && i >= 2 && i <= 36) {
        var b = k[i], _ = D[i];
        d = "";
        var C = this.clone();
        for (C.negative = 0; !C.isZero(); ) {
          var q = C.modrn(_).toString(i);
          C = C.idivn(_), C.isZero() ? d = q + d : d = I[b - q.length] + q + d;
        }
        for (this.isZero() && (d = "0" + d); d.length % h !== 0; )
          d = "0" + d;
        return this.negative !== 0 && (d = "-" + d), d;
      }
      s(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var i = this.words[0];
      return this.length === 2 ? i += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? i += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && s(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -i : i;
    }, f.prototype.toJSON = function() {
      return this.toString(16, 2);
    }, g && (f.prototype.toBuffer = function(i, h) {
      return this.toArrayLike(g, i, h);
    }), f.prototype.toArray = function(i, h) {
      return this.toArrayLike(Array, i, h);
    };
    var U = function(i, h) {
      return i.allocUnsafe ? i.allocUnsafe(h) : new i(h);
    };
    f.prototype.toArrayLike = function(i, h, d) {
      this._strip();
      var c = this.byteLength(), v = d || Math.max(1, c);
      s(c <= v, "byte array longer than desired length"), s(v > 0, "Requested array length <= 0");
      var u = U(i, v), e = h === "le" ? "LE" : "BE";
      return this["_toArrayLike" + e](u, c), u;
    }, f.prototype._toArrayLikeLE = function(i, h) {
      for (var d = 0, c = 0, v = 0, u = 0; v < this.length; v++) {
        var e = this.words[v] << u | c;
        i[d++] = e & 255, d < i.length && (i[d++] = e >> 8 & 255), d < i.length && (i[d++] = e >> 16 & 255), u === 6 ? (d < i.length && (i[d++] = e >> 24 & 255), c = 0, u = 0) : (c = e >>> 24, u += 2);
      }
      if (d < i.length)
        for (i[d++] = c; d < i.length; )
          i[d++] = 0;
    }, f.prototype._toArrayLikeBE = function(i, h) {
      for (var d = i.length - 1, c = 0, v = 0, u = 0; v < this.length; v++) {
        var e = this.words[v] << u | c;
        i[d--] = e & 255, d >= 0 && (i[d--] = e >> 8 & 255), d >= 0 && (i[d--] = e >> 16 & 255), u === 6 ? (d >= 0 && (i[d--] = e >> 24 & 255), c = 0, u = 0) : (c = e >>> 24, u += 2);
      }
      if (d >= 0)
        for (i[d--] = c; d >= 0; )
          i[d--] = 0;
    }, Math.clz32 ? f.prototype._countBits = function(i) {
      return 32 - Math.clz32(i);
    } : f.prototype._countBits = function(i) {
      var h = i, d = 0;
      return h >= 4096 && (d += 13, h >>>= 13), h >= 64 && (d += 7, h >>>= 7), h >= 8 && (d += 4, h >>>= 4), h >= 2 && (d += 2, h >>>= 2), d + h;
    }, f.prototype._zeroBits = function(i) {
      if (i === 0)
        return 26;
      var h = i, d = 0;
      return h & 8191 || (d += 13, h >>>= 13), h & 127 || (d += 7, h >>>= 7), h & 15 || (d += 4, h >>>= 4), h & 3 || (d += 2, h >>>= 2), h & 1 || d++, d;
    }, f.prototype.bitLength = function() {
      var i = this.words[this.length - 1], h = this._countBits(i);
      return (this.length - 1) * 26 + h;
    };
    function W(r) {
      for (var i = new Array(r.bitLength()), h = 0; h < i.length; h++) {
        var d = h / 26 | 0, c = h % 26;
        i[h] = r.words[d] >>> c & 1;
      }
      return i;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var i = 0, h = 0; h < this.length; h++) {
        var d = this._zeroBits(this.words[h]);
        if (i += d, d !== 26)
          break;
      }
      return i;
    }, f.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, f.prototype.toTwos = function(i) {
      return this.negative !== 0 ? this.abs().inotn(i).iaddn(1) : this.clone();
    }, f.prototype.fromTwos = function(i) {
      return this.testn(i - 1) ? this.notn(i).iaddn(1).ineg() : this.clone();
    }, f.prototype.isNeg = function() {
      return this.negative !== 0;
    }, f.prototype.neg = function() {
      return this.clone().ineg();
    }, f.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, f.prototype.iuor = function(i) {
      for (; this.length < i.length; )
        this.words[this.length++] = 0;
      for (var h = 0; h < i.length; h++)
        this.words[h] = this.words[h] | i.words[h];
      return this._strip();
    }, f.prototype.ior = function(i) {
      return s((this.negative | i.negative) === 0), this.iuor(i);
    }, f.prototype.or = function(i) {
      return this.length > i.length ? this.clone().ior(i) : i.clone().ior(this);
    }, f.prototype.uor = function(i) {
      return this.length > i.length ? this.clone().iuor(i) : i.clone().iuor(this);
    }, f.prototype.iuand = function(i) {
      var h;
      this.length > i.length ? h = i : h = this;
      for (var d = 0; d < h.length; d++)
        this.words[d] = this.words[d] & i.words[d];
      return this.length = h.length, this._strip();
    }, f.prototype.iand = function(i) {
      return s((this.negative | i.negative) === 0), this.iuand(i);
    }, f.prototype.and = function(i) {
      return this.length > i.length ? this.clone().iand(i) : i.clone().iand(this);
    }, f.prototype.uand = function(i) {
      return this.length > i.length ? this.clone().iuand(i) : i.clone().iuand(this);
    }, f.prototype.iuxor = function(i) {
      var h, d;
      this.length > i.length ? (h = this, d = i) : (h = i, d = this);
      for (var c = 0; c < d.length; c++)
        this.words[c] = h.words[c] ^ d.words[c];
      if (this !== h)
        for (; c < h.length; c++)
          this.words[c] = h.words[c];
      return this.length = h.length, this._strip();
    }, f.prototype.ixor = function(i) {
      return s((this.negative | i.negative) === 0), this.iuxor(i);
    }, f.prototype.xor = function(i) {
      return this.length > i.length ? this.clone().ixor(i) : i.clone().ixor(this);
    }, f.prototype.uxor = function(i) {
      return this.length > i.length ? this.clone().iuxor(i) : i.clone().iuxor(this);
    }, f.prototype.inotn = function(i) {
      s(typeof i == "number" && i >= 0);
      var h = Math.ceil(i / 26) | 0, d = i % 26;
      this._expand(h), d > 0 && h--;
      for (var c = 0; c < h; c++)
        this.words[c] = ~this.words[c] & 67108863;
      return d > 0 && (this.words[c] = ~this.words[c] & 67108863 >> 26 - d), this._strip();
    }, f.prototype.notn = function(i) {
      return this.clone().inotn(i);
    }, f.prototype.setn = function(i, h) {
      s(typeof i == "number" && i >= 0);
      var d = i / 26 | 0, c = i % 26;
      return this._expand(d + 1), h ? this.words[d] = this.words[d] | 1 << c : this.words[d] = this.words[d] & ~(1 << c), this._strip();
    }, f.prototype.iadd = function(i) {
      var h;
      if (this.negative !== 0 && i.negative === 0)
        return this.negative = 0, h = this.isub(i), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && i.negative !== 0)
        return i.negative = 0, h = this.isub(i), i.negative = 1, h._normSign();
      var d, c;
      this.length > i.length ? (d = this, c = i) : (d = i, c = this);
      for (var v = 0, u = 0; u < c.length; u++)
        h = (d.words[u] | 0) + (c.words[u] | 0) + v, this.words[u] = h & 67108863, v = h >>> 26;
      for (; v !== 0 && u < d.length; u++)
        h = (d.words[u] | 0) + v, this.words[u] = h & 67108863, v = h >>> 26;
      if (this.length = d.length, v !== 0)
        this.words[this.length] = v, this.length++;
      else if (d !== this)
        for (; u < d.length; u++)
          this.words[u] = d.words[u];
      return this;
    }, f.prototype.add = function(i) {
      var h;
      return i.negative !== 0 && this.negative === 0 ? (i.negative = 0, h = this.sub(i), i.negative ^= 1, h) : i.negative === 0 && this.negative !== 0 ? (this.negative = 0, h = i.sub(this), this.negative = 1, h) : this.length > i.length ? this.clone().iadd(i) : i.clone().iadd(this);
    }, f.prototype.isub = function(i) {
      if (i.negative !== 0) {
        i.negative = 0;
        var h = this.iadd(i);
        return i.negative = 1, h._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(i), this.negative = 1, this._normSign();
      var d = this.cmp(i);
      if (d === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var c, v;
      d > 0 ? (c = this, v = i) : (c = i, v = this);
      for (var u = 0, e = 0; e < v.length; e++)
        h = (c.words[e] | 0) - (v.words[e] | 0) + u, u = h >> 26, this.words[e] = h & 67108863;
      for (; u !== 0 && e < c.length; e++)
        h = (c.words[e] | 0) + u, u = h >> 26, this.words[e] = h & 67108863;
      if (u === 0 && e < c.length && c !== this)
        for (; e < c.length; e++)
          this.words[e] = c.words[e];
      return this.length = Math.max(this.length, e), c !== this && (this.negative = 1), this._strip();
    }, f.prototype.sub = function(i) {
      return this.clone().isub(i);
    };
    function z(r, i, h) {
      h.negative = i.negative ^ r.negative;
      var d = r.length + i.length | 0;
      h.length = d, d = d - 1 | 0;
      var c = r.words[0] | 0, v = i.words[0] | 0, u = c * v, e = u & 67108863, l = u / 67108864 | 0;
      h.words[0] = e;
      for (var b = 1; b < d; b++) {
        for (var _ = l >>> 26, C = l & 67108863, q = Math.min(b, i.length - 1), O = Math.max(0, b - r.length + 1); O <= q; O++) {
          var R = b - O | 0;
          c = r.words[R] | 0, v = i.words[O] | 0, u = c * v + C, _ += u / 67108864 | 0, C = u & 67108863;
        }
        h.words[b] = C | 0, l = _ | 0;
      }
      return l !== 0 ? h.words[b] = l | 0 : h.length--, h._strip();
    }
    var $ = function(i, h, d) {
      var c = i.words, v = h.words, u = d.words, e = 0, l, b, _, C = c[0] | 0, q = C & 8191, O = C >>> 13, R = c[1] | 0, P = R & 8191, N = R >>> 13, K = c[2] | 0, kt = K & 8191, Z = K >>> 13, J = c[3] | 0, Ft = J & 8191, tt = J >>> 13, vt = c[4] | 0, Dt = vt & 8191, et = vt >>> 13, pt = c[5] | 0, Pt = pt & 8191, j = pt >>> 13, dt = c[6] | 0, qt = dt & 8191, Q = dt >>> 13, ct = c[7] | 0, Ut = ct & 8191, E = ct >>> 13, w = c[8] | 0, A = w & 8191, T = w >>> 13, F = c[9] | 0, V = F & 8191, L = F >>> 13, X = v[0] | 0, Tt = X & 8191, G = X >>> 13, rt = v[1] | 0, Rt = rt & 8191, it = rt >>> 13, gt = v[2] | 0, Kt = gt & 8191, nt = gt >>> 13, bt = v[3] | 0, Ht = bt & 8191, ft = bt >>> 13, yt = v[4] | 0, Zt = yt & 8191, at = yt >>> 13, wt = v[5] | 0, Wt = wt & 8191, ht = wt >>> 13, Mt = v[6] | 0, Vt = Mt & 8191, st = Mt >>> 13, xt = v[7] | 0, Yt = xt & 8191, ot = xt >>> 13, _t = v[8] | 0, Jt = _t & 8191, ut = _t >>> 13, St = v[9] | 0, Nt = St & 8191, $t = St >>> 13;
      d.negative = i.negative ^ h.negative, d.length = 19, l = Math.imul(q, Tt), b = Math.imul(q, G), b = b + Math.imul(O, Tt) | 0, _ = Math.imul(O, G);
      var Qt = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, l = Math.imul(P, Tt), b = Math.imul(P, G), b = b + Math.imul(N, Tt) | 0, _ = Math.imul(N, G), l = l + Math.imul(q, Rt) | 0, b = b + Math.imul(q, it) | 0, b = b + Math.imul(O, Rt) | 0, _ = _ + Math.imul(O, it) | 0;
      var te = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, l = Math.imul(kt, Tt), b = Math.imul(kt, G), b = b + Math.imul(Z, Tt) | 0, _ = Math.imul(Z, G), l = l + Math.imul(P, Rt) | 0, b = b + Math.imul(P, it) | 0, b = b + Math.imul(N, Rt) | 0, _ = _ + Math.imul(N, it) | 0, l = l + Math.imul(q, Kt) | 0, b = b + Math.imul(q, nt) | 0, b = b + Math.imul(O, Kt) | 0, _ = _ + Math.imul(O, nt) | 0;
      var ee = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, l = Math.imul(Ft, Tt), b = Math.imul(Ft, G), b = b + Math.imul(tt, Tt) | 0, _ = Math.imul(tt, G), l = l + Math.imul(kt, Rt) | 0, b = b + Math.imul(kt, it) | 0, b = b + Math.imul(Z, Rt) | 0, _ = _ + Math.imul(Z, it) | 0, l = l + Math.imul(P, Kt) | 0, b = b + Math.imul(P, nt) | 0, b = b + Math.imul(N, Kt) | 0, _ = _ + Math.imul(N, nt) | 0, l = l + Math.imul(q, Ht) | 0, b = b + Math.imul(q, ft) | 0, b = b + Math.imul(O, Ht) | 0, _ = _ + Math.imul(O, ft) | 0;
      var re = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, l = Math.imul(Dt, Tt), b = Math.imul(Dt, G), b = b + Math.imul(et, Tt) | 0, _ = Math.imul(et, G), l = l + Math.imul(Ft, Rt) | 0, b = b + Math.imul(Ft, it) | 0, b = b + Math.imul(tt, Rt) | 0, _ = _ + Math.imul(tt, it) | 0, l = l + Math.imul(kt, Kt) | 0, b = b + Math.imul(kt, nt) | 0, b = b + Math.imul(Z, Kt) | 0, _ = _ + Math.imul(Z, nt) | 0, l = l + Math.imul(P, Ht) | 0, b = b + Math.imul(P, ft) | 0, b = b + Math.imul(N, Ht) | 0, _ = _ + Math.imul(N, ft) | 0, l = l + Math.imul(q, Zt) | 0, b = b + Math.imul(q, at) | 0, b = b + Math.imul(O, Zt) | 0, _ = _ + Math.imul(O, at) | 0;
      var ie = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, l = Math.imul(Pt, Tt), b = Math.imul(Pt, G), b = b + Math.imul(j, Tt) | 0, _ = Math.imul(j, G), l = l + Math.imul(Dt, Rt) | 0, b = b + Math.imul(Dt, it) | 0, b = b + Math.imul(et, Rt) | 0, _ = _ + Math.imul(et, it) | 0, l = l + Math.imul(Ft, Kt) | 0, b = b + Math.imul(Ft, nt) | 0, b = b + Math.imul(tt, Kt) | 0, _ = _ + Math.imul(tt, nt) | 0, l = l + Math.imul(kt, Ht) | 0, b = b + Math.imul(kt, ft) | 0, b = b + Math.imul(Z, Ht) | 0, _ = _ + Math.imul(Z, ft) | 0, l = l + Math.imul(P, Zt) | 0, b = b + Math.imul(P, at) | 0, b = b + Math.imul(N, Zt) | 0, _ = _ + Math.imul(N, at) | 0, l = l + Math.imul(q, Wt) | 0, b = b + Math.imul(q, ht) | 0, b = b + Math.imul(O, Wt) | 0, _ = _ + Math.imul(O, ht) | 0;
      var ne = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, l = Math.imul(qt, Tt), b = Math.imul(qt, G), b = b + Math.imul(Q, Tt) | 0, _ = Math.imul(Q, G), l = l + Math.imul(Pt, Rt) | 0, b = b + Math.imul(Pt, it) | 0, b = b + Math.imul(j, Rt) | 0, _ = _ + Math.imul(j, it) | 0, l = l + Math.imul(Dt, Kt) | 0, b = b + Math.imul(Dt, nt) | 0, b = b + Math.imul(et, Kt) | 0, _ = _ + Math.imul(et, nt) | 0, l = l + Math.imul(Ft, Ht) | 0, b = b + Math.imul(Ft, ft) | 0, b = b + Math.imul(tt, Ht) | 0, _ = _ + Math.imul(tt, ft) | 0, l = l + Math.imul(kt, Zt) | 0, b = b + Math.imul(kt, at) | 0, b = b + Math.imul(Z, Zt) | 0, _ = _ + Math.imul(Z, at) | 0, l = l + Math.imul(P, Wt) | 0, b = b + Math.imul(P, ht) | 0, b = b + Math.imul(N, Wt) | 0, _ = _ + Math.imul(N, ht) | 0, l = l + Math.imul(q, Vt) | 0, b = b + Math.imul(q, st) | 0, b = b + Math.imul(O, Vt) | 0, _ = _ + Math.imul(O, st) | 0;
      var fe = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, l = Math.imul(Ut, Tt), b = Math.imul(Ut, G), b = b + Math.imul(E, Tt) | 0, _ = Math.imul(E, G), l = l + Math.imul(qt, Rt) | 0, b = b + Math.imul(qt, it) | 0, b = b + Math.imul(Q, Rt) | 0, _ = _ + Math.imul(Q, it) | 0, l = l + Math.imul(Pt, Kt) | 0, b = b + Math.imul(Pt, nt) | 0, b = b + Math.imul(j, Kt) | 0, _ = _ + Math.imul(j, nt) | 0, l = l + Math.imul(Dt, Ht) | 0, b = b + Math.imul(Dt, ft) | 0, b = b + Math.imul(et, Ht) | 0, _ = _ + Math.imul(et, ft) | 0, l = l + Math.imul(Ft, Zt) | 0, b = b + Math.imul(Ft, at) | 0, b = b + Math.imul(tt, Zt) | 0, _ = _ + Math.imul(tt, at) | 0, l = l + Math.imul(kt, Wt) | 0, b = b + Math.imul(kt, ht) | 0, b = b + Math.imul(Z, Wt) | 0, _ = _ + Math.imul(Z, ht) | 0, l = l + Math.imul(P, Vt) | 0, b = b + Math.imul(P, st) | 0, b = b + Math.imul(N, Vt) | 0, _ = _ + Math.imul(N, st) | 0, l = l + Math.imul(q, Yt) | 0, b = b + Math.imul(q, ot) | 0, b = b + Math.imul(O, Yt) | 0, _ = _ + Math.imul(O, ot) | 0;
      var ae = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, l = Math.imul(A, Tt), b = Math.imul(A, G), b = b + Math.imul(T, Tt) | 0, _ = Math.imul(T, G), l = l + Math.imul(Ut, Rt) | 0, b = b + Math.imul(Ut, it) | 0, b = b + Math.imul(E, Rt) | 0, _ = _ + Math.imul(E, it) | 0, l = l + Math.imul(qt, Kt) | 0, b = b + Math.imul(qt, nt) | 0, b = b + Math.imul(Q, Kt) | 0, _ = _ + Math.imul(Q, nt) | 0, l = l + Math.imul(Pt, Ht) | 0, b = b + Math.imul(Pt, ft) | 0, b = b + Math.imul(j, Ht) | 0, _ = _ + Math.imul(j, ft) | 0, l = l + Math.imul(Dt, Zt) | 0, b = b + Math.imul(Dt, at) | 0, b = b + Math.imul(et, Zt) | 0, _ = _ + Math.imul(et, at) | 0, l = l + Math.imul(Ft, Wt) | 0, b = b + Math.imul(Ft, ht) | 0, b = b + Math.imul(tt, Wt) | 0, _ = _ + Math.imul(tt, ht) | 0, l = l + Math.imul(kt, Vt) | 0, b = b + Math.imul(kt, st) | 0, b = b + Math.imul(Z, Vt) | 0, _ = _ + Math.imul(Z, st) | 0, l = l + Math.imul(P, Yt) | 0, b = b + Math.imul(P, ot) | 0, b = b + Math.imul(N, Yt) | 0, _ = _ + Math.imul(N, ot) | 0, l = l + Math.imul(q, Jt) | 0, b = b + Math.imul(q, ut) | 0, b = b + Math.imul(O, Jt) | 0, _ = _ + Math.imul(O, ut) | 0;
      var he = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, l = Math.imul(V, Tt), b = Math.imul(V, G), b = b + Math.imul(L, Tt) | 0, _ = Math.imul(L, G), l = l + Math.imul(A, Rt) | 0, b = b + Math.imul(A, it) | 0, b = b + Math.imul(T, Rt) | 0, _ = _ + Math.imul(T, it) | 0, l = l + Math.imul(Ut, Kt) | 0, b = b + Math.imul(Ut, nt) | 0, b = b + Math.imul(E, Kt) | 0, _ = _ + Math.imul(E, nt) | 0, l = l + Math.imul(qt, Ht) | 0, b = b + Math.imul(qt, ft) | 0, b = b + Math.imul(Q, Ht) | 0, _ = _ + Math.imul(Q, ft) | 0, l = l + Math.imul(Pt, Zt) | 0, b = b + Math.imul(Pt, at) | 0, b = b + Math.imul(j, Zt) | 0, _ = _ + Math.imul(j, at) | 0, l = l + Math.imul(Dt, Wt) | 0, b = b + Math.imul(Dt, ht) | 0, b = b + Math.imul(et, Wt) | 0, _ = _ + Math.imul(et, ht) | 0, l = l + Math.imul(Ft, Vt) | 0, b = b + Math.imul(Ft, st) | 0, b = b + Math.imul(tt, Vt) | 0, _ = _ + Math.imul(tt, st) | 0, l = l + Math.imul(kt, Yt) | 0, b = b + Math.imul(kt, ot) | 0, b = b + Math.imul(Z, Yt) | 0, _ = _ + Math.imul(Z, ot) | 0, l = l + Math.imul(P, Jt) | 0, b = b + Math.imul(P, ut) | 0, b = b + Math.imul(N, Jt) | 0, _ = _ + Math.imul(N, ut) | 0, l = l + Math.imul(q, Nt) | 0, b = b + Math.imul(q, $t) | 0, b = b + Math.imul(O, Nt) | 0, _ = _ + Math.imul(O, $t) | 0;
      var se = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, l = Math.imul(V, Rt), b = Math.imul(V, it), b = b + Math.imul(L, Rt) | 0, _ = Math.imul(L, it), l = l + Math.imul(A, Kt) | 0, b = b + Math.imul(A, nt) | 0, b = b + Math.imul(T, Kt) | 0, _ = _ + Math.imul(T, nt) | 0, l = l + Math.imul(Ut, Ht) | 0, b = b + Math.imul(Ut, ft) | 0, b = b + Math.imul(E, Ht) | 0, _ = _ + Math.imul(E, ft) | 0, l = l + Math.imul(qt, Zt) | 0, b = b + Math.imul(qt, at) | 0, b = b + Math.imul(Q, Zt) | 0, _ = _ + Math.imul(Q, at) | 0, l = l + Math.imul(Pt, Wt) | 0, b = b + Math.imul(Pt, ht) | 0, b = b + Math.imul(j, Wt) | 0, _ = _ + Math.imul(j, ht) | 0, l = l + Math.imul(Dt, Vt) | 0, b = b + Math.imul(Dt, st) | 0, b = b + Math.imul(et, Vt) | 0, _ = _ + Math.imul(et, st) | 0, l = l + Math.imul(Ft, Yt) | 0, b = b + Math.imul(Ft, ot) | 0, b = b + Math.imul(tt, Yt) | 0, _ = _ + Math.imul(tt, ot) | 0, l = l + Math.imul(kt, Jt) | 0, b = b + Math.imul(kt, ut) | 0, b = b + Math.imul(Z, Jt) | 0, _ = _ + Math.imul(Z, ut) | 0, l = l + Math.imul(P, Nt) | 0, b = b + Math.imul(P, $t) | 0, b = b + Math.imul(N, Nt) | 0, _ = _ + Math.imul(N, $t) | 0;
      var oe = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, l = Math.imul(V, Kt), b = Math.imul(V, nt), b = b + Math.imul(L, Kt) | 0, _ = Math.imul(L, nt), l = l + Math.imul(A, Ht) | 0, b = b + Math.imul(A, ft) | 0, b = b + Math.imul(T, Ht) | 0, _ = _ + Math.imul(T, ft) | 0, l = l + Math.imul(Ut, Zt) | 0, b = b + Math.imul(Ut, at) | 0, b = b + Math.imul(E, Zt) | 0, _ = _ + Math.imul(E, at) | 0, l = l + Math.imul(qt, Wt) | 0, b = b + Math.imul(qt, ht) | 0, b = b + Math.imul(Q, Wt) | 0, _ = _ + Math.imul(Q, ht) | 0, l = l + Math.imul(Pt, Vt) | 0, b = b + Math.imul(Pt, st) | 0, b = b + Math.imul(j, Vt) | 0, _ = _ + Math.imul(j, st) | 0, l = l + Math.imul(Dt, Yt) | 0, b = b + Math.imul(Dt, ot) | 0, b = b + Math.imul(et, Yt) | 0, _ = _ + Math.imul(et, ot) | 0, l = l + Math.imul(Ft, Jt) | 0, b = b + Math.imul(Ft, ut) | 0, b = b + Math.imul(tt, Jt) | 0, _ = _ + Math.imul(tt, ut) | 0, l = l + Math.imul(kt, Nt) | 0, b = b + Math.imul(kt, $t) | 0, b = b + Math.imul(Z, Nt) | 0, _ = _ + Math.imul(Z, $t) | 0;
      var ue = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, l = Math.imul(V, Ht), b = Math.imul(V, ft), b = b + Math.imul(L, Ht) | 0, _ = Math.imul(L, ft), l = l + Math.imul(A, Zt) | 0, b = b + Math.imul(A, at) | 0, b = b + Math.imul(T, Zt) | 0, _ = _ + Math.imul(T, at) | 0, l = l + Math.imul(Ut, Wt) | 0, b = b + Math.imul(Ut, ht) | 0, b = b + Math.imul(E, Wt) | 0, _ = _ + Math.imul(E, ht) | 0, l = l + Math.imul(qt, Vt) | 0, b = b + Math.imul(qt, st) | 0, b = b + Math.imul(Q, Vt) | 0, _ = _ + Math.imul(Q, st) | 0, l = l + Math.imul(Pt, Yt) | 0, b = b + Math.imul(Pt, ot) | 0, b = b + Math.imul(j, Yt) | 0, _ = _ + Math.imul(j, ot) | 0, l = l + Math.imul(Dt, Jt) | 0, b = b + Math.imul(Dt, ut) | 0, b = b + Math.imul(et, Jt) | 0, _ = _ + Math.imul(et, ut) | 0, l = l + Math.imul(Ft, Nt) | 0, b = b + Math.imul(Ft, $t) | 0, b = b + Math.imul(tt, Nt) | 0, _ = _ + Math.imul(tt, $t) | 0;
      var le = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, l = Math.imul(V, Zt), b = Math.imul(V, at), b = b + Math.imul(L, Zt) | 0, _ = Math.imul(L, at), l = l + Math.imul(A, Wt) | 0, b = b + Math.imul(A, ht) | 0, b = b + Math.imul(T, Wt) | 0, _ = _ + Math.imul(T, ht) | 0, l = l + Math.imul(Ut, Vt) | 0, b = b + Math.imul(Ut, st) | 0, b = b + Math.imul(E, Vt) | 0, _ = _ + Math.imul(E, st) | 0, l = l + Math.imul(qt, Yt) | 0, b = b + Math.imul(qt, ot) | 0, b = b + Math.imul(Q, Yt) | 0, _ = _ + Math.imul(Q, ot) | 0, l = l + Math.imul(Pt, Jt) | 0, b = b + Math.imul(Pt, ut) | 0, b = b + Math.imul(j, Jt) | 0, _ = _ + Math.imul(j, ut) | 0, l = l + Math.imul(Dt, Nt) | 0, b = b + Math.imul(Dt, $t) | 0, b = b + Math.imul(et, Nt) | 0, _ = _ + Math.imul(et, $t) | 0;
      var de = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, l = Math.imul(V, Wt), b = Math.imul(V, ht), b = b + Math.imul(L, Wt) | 0, _ = Math.imul(L, ht), l = l + Math.imul(A, Vt) | 0, b = b + Math.imul(A, st) | 0, b = b + Math.imul(T, Vt) | 0, _ = _ + Math.imul(T, st) | 0, l = l + Math.imul(Ut, Yt) | 0, b = b + Math.imul(Ut, ot) | 0, b = b + Math.imul(E, Yt) | 0, _ = _ + Math.imul(E, ot) | 0, l = l + Math.imul(qt, Jt) | 0, b = b + Math.imul(qt, ut) | 0, b = b + Math.imul(Q, Jt) | 0, _ = _ + Math.imul(Q, ut) | 0, l = l + Math.imul(Pt, Nt) | 0, b = b + Math.imul(Pt, $t) | 0, b = b + Math.imul(j, Nt) | 0, _ = _ + Math.imul(j, $t) | 0;
      var ce = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, l = Math.imul(V, Vt), b = Math.imul(V, st), b = b + Math.imul(L, Vt) | 0, _ = Math.imul(L, st), l = l + Math.imul(A, Yt) | 0, b = b + Math.imul(A, ot) | 0, b = b + Math.imul(T, Yt) | 0, _ = _ + Math.imul(T, ot) | 0, l = l + Math.imul(Ut, Jt) | 0, b = b + Math.imul(Ut, ut) | 0, b = b + Math.imul(E, Jt) | 0, _ = _ + Math.imul(E, ut) | 0, l = l + Math.imul(qt, Nt) | 0, b = b + Math.imul(qt, $t) | 0, b = b + Math.imul(Q, Nt) | 0, _ = _ + Math.imul(Q, $t) | 0;
      var ve = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, l = Math.imul(V, Yt), b = Math.imul(V, ot), b = b + Math.imul(L, Yt) | 0, _ = Math.imul(L, ot), l = l + Math.imul(A, Jt) | 0, b = b + Math.imul(A, ut) | 0, b = b + Math.imul(T, Jt) | 0, _ = _ + Math.imul(T, ut) | 0, l = l + Math.imul(Ut, Nt) | 0, b = b + Math.imul(Ut, $t) | 0, b = b + Math.imul(E, Nt) | 0, _ = _ + Math.imul(E, $t) | 0;
      var pe = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (pe >>> 26) | 0, pe &= 67108863, l = Math.imul(V, Jt), b = Math.imul(V, ut), b = b + Math.imul(L, Jt) | 0, _ = Math.imul(L, ut), l = l + Math.imul(A, Nt) | 0, b = b + Math.imul(A, $t) | 0, b = b + Math.imul(T, Nt) | 0, _ = _ + Math.imul(T, $t) | 0;
      var lf = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (lf >>> 26) | 0, lf &= 67108863, l = Math.imul(V, Nt), b = Math.imul(V, $t), b = b + Math.imul(L, Nt) | 0, _ = Math.imul(L, $t);
      var df = (e + l | 0) + ((b & 8191) << 13) | 0;
      return e = (_ + (b >>> 13) | 0) + (df >>> 26) | 0, df &= 67108863, u[0] = Qt, u[1] = te, u[2] = ee, u[3] = re, u[4] = ie, u[5] = ne, u[6] = fe, u[7] = ae, u[8] = he, u[9] = se, u[10] = oe, u[11] = ue, u[12] = le, u[13] = de, u[14] = ce, u[15] = ve, u[16] = pe, u[17] = lf, u[18] = df, e !== 0 && (u[19] = e, d.length++), d;
    };
    Math.imul || ($ = z);
    function lt(r, i, h) {
      h.negative = i.negative ^ r.negative, h.length = r.length + i.length;
      for (var d = 0, c = 0, v = 0; v < h.length - 1; v++) {
        var u = c;
        c = 0;
        for (var e = d & 67108863, l = Math.min(v, i.length - 1), b = Math.max(0, v - r.length + 1); b <= l; b++) {
          var _ = v - b, C = r.words[_] | 0, q = i.words[b] | 0, O = C * q, R = O & 67108863;
          u = u + (O / 67108864 | 0) | 0, R = R + e | 0, e = R & 67108863, u = u + (R >>> 26) | 0, c += u >>> 26, u &= 67108863;
        }
        h.words[v] = e, d = u, u = c;
      }
      return d !== 0 ? h.words[v] = d : h.length--, h._strip();
    }
    function H(r, i, h) {
      return lt(r, i, h);
    }
    f.prototype.mulTo = function(i, h) {
      var d, c = this.length + i.length;
      return this.length === 10 && i.length === 10 ? d = $(this, i, h) : c < 63 ? d = z(this, i, h) : c < 1024 ? d = lt(this, i, h) : d = H(this, i, h), d;
    }, f.prototype.mul = function(i) {
      var h = new f(null);
      return h.words = new Array(this.length + i.length), this.mulTo(i, h);
    }, f.prototype.mulf = function(i) {
      var h = new f(null);
      return h.words = new Array(this.length + i.length), H(this, i, h);
    }, f.prototype.imul = function(i) {
      return this.clone().mulTo(i, this);
    }, f.prototype.imuln = function(i) {
      var h = i < 0;
      h && (i = -i), s(typeof i == "number"), s(i < 67108864);
      for (var d = 0, c = 0; c < this.length; c++) {
        var v = (this.words[c] | 0) * i, u = (v & 67108863) + (d & 67108863);
        d >>= 26, d += v / 67108864 | 0, d += u >>> 26, this.words[c] = u & 67108863;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this.length = i === 0 ? 1 : this.length, h ? this.ineg() : this;
    }, f.prototype.muln = function(i) {
      return this.clone().imuln(i);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(i) {
      var h = W(i);
      if (h.length === 0)
        return new f(1);
      for (var d = this, c = 0; c < h.length && h[c] === 0; c++, d = d.sqr())
        ;
      if (++c < h.length)
        for (var v = d.sqr(); c < h.length; c++, v = v.sqr())
          h[c] !== 0 && (d = d.mul(v));
      return d;
    }, f.prototype.iushln = function(i) {
      s(typeof i == "number" && i >= 0);
      var h = i % 26, d = (i - h) / 26, c = 67108863 >>> 26 - h << 26 - h, v;
      if (h !== 0) {
        var u = 0;
        for (v = 0; v < this.length; v++) {
          var e = this.words[v] & c, l = (this.words[v] | 0) - e << h;
          this.words[v] = l | u, u = e >>> 26 - h;
        }
        u && (this.words[v] = u, this.length++);
      }
      if (d !== 0) {
        for (v = this.length - 1; v >= 0; v--)
          this.words[v + d] = this.words[v];
        for (v = 0; v < d; v++)
          this.words[v] = 0;
        this.length += d;
      }
      return this._strip();
    }, f.prototype.ishln = function(i) {
      return s(this.negative === 0), this.iushln(i);
    }, f.prototype.iushrn = function(i, h, d) {
      s(typeof i == "number" && i >= 0);
      var c;
      h ? c = (h - h % 26) / 26 : c = 0;
      var v = i % 26, u = Math.min((i - v) / 26, this.length), e = 67108863 ^ 67108863 >>> v << v, l = d;
      if (c -= u, c = Math.max(0, c), l) {
        for (var b = 0; b < u; b++)
          l.words[b] = this.words[b];
        l.length = u;
      }
      if (u !== 0)
        if (this.length > u)
          for (this.length -= u, b = 0; b < this.length; b++)
            this.words[b] = this.words[b + u];
        else
          this.words[0] = 0, this.length = 1;
      var _ = 0;
      for (b = this.length - 1; b >= 0 && (_ !== 0 || b >= c); b--) {
        var C = this.words[b] | 0;
        this.words[b] = _ << 26 - v | C >>> v, _ = C & e;
      }
      return l && _ !== 0 && (l.words[l.length++] = _), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
    }, f.prototype.ishrn = function(i, h, d) {
      return s(this.negative === 0), this.iushrn(i, h, d);
    }, f.prototype.shln = function(i) {
      return this.clone().ishln(i);
    }, f.prototype.ushln = function(i) {
      return this.clone().iushln(i);
    }, f.prototype.shrn = function(i) {
      return this.clone().ishrn(i);
    }, f.prototype.ushrn = function(i) {
      return this.clone().iushrn(i);
    }, f.prototype.testn = function(i) {
      s(typeof i == "number" && i >= 0);
      var h = i % 26, d = (i - h) / 26, c = 1 << h;
      if (this.length <= d)
        return !1;
      var v = this.words[d];
      return !!(v & c);
    }, f.prototype.imaskn = function(i) {
      s(typeof i == "number" && i >= 0);
      var h = i % 26, d = (i - h) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= d)
        return this;
      if (h !== 0 && d++, this.length = Math.min(d, this.length), h !== 0) {
        var c = 67108863 ^ 67108863 >>> h << h;
        this.words[this.length - 1] &= c;
      }
      return this._strip();
    }, f.prototype.maskn = function(i) {
      return this.clone().imaskn(i);
    }, f.prototype.iaddn = function(i) {
      return s(typeof i == "number"), s(i < 67108864), i < 0 ? this.isubn(-i) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= i ? (this.words[0] = i - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(i), this.negative = 1, this) : this._iaddn(i);
    }, f.prototype._iaddn = function(i) {
      this.words[0] += i;
      for (var h = 0; h < this.length && this.words[h] >= 67108864; h++)
        this.words[h] -= 67108864, h === this.length - 1 ? this.words[h + 1] = 1 : this.words[h + 1]++;
      return this.length = Math.max(this.length, h + 1), this;
    }, f.prototype.isubn = function(i) {
      if (s(typeof i == "number"), s(i < 67108864), i < 0)
        return this.iaddn(-i);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(i), this.negative = 1, this;
      if (this.words[0] -= i, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var h = 0; h < this.length && this.words[h] < 0; h++)
          this.words[h] += 67108864, this.words[h + 1] -= 1;
      return this._strip();
    }, f.prototype.addn = function(i) {
      return this.clone().iaddn(i);
    }, f.prototype.subn = function(i) {
      return this.clone().isubn(i);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(i, h, d) {
      var c = i.length + d, v;
      this._expand(c);
      var u, e = 0;
      for (v = 0; v < i.length; v++) {
        u = (this.words[v + d] | 0) + e;
        var l = (i.words[v] | 0) * h;
        u -= l & 67108863, e = (u >> 26) - (l / 67108864 | 0), this.words[v + d] = u & 67108863;
      }
      for (; v < this.length - d; v++)
        u = (this.words[v + d] | 0) + e, e = u >> 26, this.words[v + d] = u & 67108863;
      if (e === 0)
        return this._strip();
      for (s(e === -1), e = 0, v = 0; v < this.length; v++)
        u = -(this.words[v] | 0) + e, e = u >> 26, this.words[v] = u & 67108863;
      return this.negative = 1, this._strip();
    }, f.prototype._wordDiv = function(i, h) {
      var d = this.length - i.length, c = this.clone(), v = i, u = v.words[v.length - 1] | 0, e = this._countBits(u);
      d = 26 - e, d !== 0 && (v = v.ushln(d), c.iushln(d), u = v.words[v.length - 1] | 0);
      var l = c.length - v.length, b;
      if (h !== "mod") {
        b = new f(null), b.length = l + 1, b.words = new Array(b.length);
        for (var _ = 0; _ < b.length; _++)
          b.words[_] = 0;
      }
      var C = c.clone()._ishlnsubmul(v, 1, l);
      C.negative === 0 && (c = C, b && (b.words[l] = 1));
      for (var q = l - 1; q >= 0; q--) {
        var O = (c.words[v.length + q] | 0) * 67108864 + (c.words[v.length + q - 1] | 0);
        for (O = Math.min(O / u | 0, 67108863), c._ishlnsubmul(v, O, q); c.negative !== 0; )
          O--, c.negative = 0, c._ishlnsubmul(v, 1, q), c.isZero() || (c.negative ^= 1);
        b && (b.words[q] = O);
      }
      return b && b._strip(), c._strip(), h !== "div" && d !== 0 && c.iushrn(d), {
        div: b || null,
        mod: c
      };
    }, f.prototype.divmod = function(i, h, d) {
      if (s(!i.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var c, v, u;
      return this.negative !== 0 && i.negative === 0 ? (u = this.neg().divmod(i, h), h !== "mod" && (c = u.div.neg()), h !== "div" && (v = u.mod.neg(), d && v.negative !== 0 && v.iadd(i)), {
        div: c,
        mod: v
      }) : this.negative === 0 && i.negative !== 0 ? (u = this.divmod(i.neg(), h), h !== "mod" && (c = u.div.neg()), {
        div: c,
        mod: u.mod
      }) : this.negative & i.negative ? (u = this.neg().divmod(i.neg(), h), h !== "div" && (v = u.mod.neg(), d && v.negative !== 0 && v.isub(i)), {
        div: u.div,
        mod: v
      }) : i.length > this.length || this.cmp(i) < 0 ? {
        div: new f(0),
        mod: this
      } : i.length === 1 ? h === "div" ? {
        div: this.divn(i.words[0]),
        mod: null
      } : h === "mod" ? {
        div: null,
        mod: new f(this.modrn(i.words[0]))
      } : {
        div: this.divn(i.words[0]),
        mod: new f(this.modrn(i.words[0]))
      } : this._wordDiv(i, h);
    }, f.prototype.div = function(i) {
      return this.divmod(i, "div", !1).div;
    }, f.prototype.mod = function(i) {
      return this.divmod(i, "mod", !1).mod;
    }, f.prototype.umod = function(i) {
      return this.divmod(i, "mod", !0).mod;
    }, f.prototype.divRound = function(i) {
      var h = this.divmod(i);
      if (h.mod.isZero())
        return h.div;
      var d = h.div.negative !== 0 ? h.mod.isub(i) : h.mod, c = i.ushrn(1), v = i.andln(1), u = d.cmp(c);
      return u < 0 || v === 1 && u === 0 ? h.div : h.div.negative !== 0 ? h.div.isubn(1) : h.div.iaddn(1);
    }, f.prototype.modrn = function(i) {
      var h = i < 0;
      h && (i = -i), s(i <= 67108863);
      for (var d = (1 << 26) % i, c = 0, v = this.length - 1; v >= 0; v--)
        c = (d * c + (this.words[v] | 0)) % i;
      return h ? -c : c;
    }, f.prototype.modn = function(i) {
      return this.modrn(i);
    }, f.prototype.idivn = function(i) {
      var h = i < 0;
      h && (i = -i), s(i <= 67108863);
      for (var d = 0, c = this.length - 1; c >= 0; c--) {
        var v = (this.words[c] | 0) + d * 67108864;
        this.words[c] = v / i | 0, d = v % i;
      }
      return this._strip(), h ? this.ineg() : this;
    }, f.prototype.divn = function(i) {
      return this.clone().idivn(i);
    }, f.prototype.egcd = function(i) {
      s(i.negative === 0), s(!i.isZero());
      var h = this, d = i.clone();
      h.negative !== 0 ? h = h.umod(i) : h = h.clone();
      for (var c = new f(1), v = new f(0), u = new f(0), e = new f(1), l = 0; h.isEven() && d.isEven(); )
        h.iushrn(1), d.iushrn(1), ++l;
      for (var b = d.clone(), _ = h.clone(); !h.isZero(); ) {
        for (var C = 0, q = 1; !(h.words[0] & q) && C < 26; ++C, q <<= 1)
          ;
        if (C > 0)
          for (h.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(b), v.isub(_)), c.iushrn(1), v.iushrn(1);
        for (var O = 0, R = 1; !(d.words[0] & R) && O < 26; ++O, R <<= 1)
          ;
        if (O > 0)
          for (d.iushrn(O); O-- > 0; )
            (u.isOdd() || e.isOdd()) && (u.iadd(b), e.isub(_)), u.iushrn(1), e.iushrn(1);
        h.cmp(d) >= 0 ? (h.isub(d), c.isub(u), v.isub(e)) : (d.isub(h), u.isub(c), e.isub(v));
      }
      return {
        a: u,
        b: e,
        gcd: d.iushln(l)
      };
    }, f.prototype._invmp = function(i) {
      s(i.negative === 0), s(!i.isZero());
      var h = this, d = i.clone();
      h.negative !== 0 ? h = h.umod(i) : h = h.clone();
      for (var c = new f(1), v = new f(0), u = d.clone(); h.cmpn(1) > 0 && d.cmpn(1) > 0; ) {
        for (var e = 0, l = 1; !(h.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (h.iushrn(e); e-- > 0; )
            c.isOdd() && c.iadd(u), c.iushrn(1);
        for (var b = 0, _ = 1; !(d.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (d.iushrn(b); b-- > 0; )
            v.isOdd() && v.iadd(u), v.iushrn(1);
        h.cmp(d) >= 0 ? (h.isub(d), c.isub(v)) : (d.isub(h), v.isub(c));
      }
      var C;
      return h.cmpn(1) === 0 ? C = c : C = v, C.cmpn(0) < 0 && C.iadd(i), C;
    }, f.prototype.gcd = function(i) {
      if (this.isZero())
        return i.abs();
      if (i.isZero())
        return this.abs();
      var h = this.clone(), d = i.clone();
      h.negative = 0, d.negative = 0;
      for (var c = 0; h.isEven() && d.isEven(); c++)
        h.iushrn(1), d.iushrn(1);
      do {
        for (; h.isEven(); )
          h.iushrn(1);
        for (; d.isEven(); )
          d.iushrn(1);
        var v = h.cmp(d);
        if (v < 0) {
          var u = h;
          h = d, d = u;
        } else if (v === 0 || d.cmpn(1) === 0)
          break;
        h.isub(d);
      } while (!0);
      return d.iushln(c);
    }, f.prototype.invm = function(i) {
      return this.egcd(i).a.umod(i);
    }, f.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, f.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, f.prototype.andln = function(i) {
      return this.words[0] & i;
    }, f.prototype.bincn = function(i) {
      s(typeof i == "number");
      var h = i % 26, d = (i - h) / 26, c = 1 << h;
      if (this.length <= d)
        return this._expand(d + 1), this.words[d] |= c, this;
      for (var v = c, u = d; v !== 0 && u < this.length; u++) {
        var e = this.words[u] | 0;
        e += v, v = e >>> 26, e &= 67108863, this.words[u] = e;
      }
      return v !== 0 && (this.words[u] = v, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(i) {
      var h = i < 0;
      if (this.negative !== 0 && !h)
        return -1;
      if (this.negative === 0 && h)
        return 1;
      this._strip();
      var d;
      if (this.length > 1)
        d = 1;
      else {
        h && (i = -i), s(i <= 67108863, "Number is too big");
        var c = this.words[0] | 0;
        d = c === i ? 0 : c < i ? -1 : 1;
      }
      return this.negative !== 0 ? -d | 0 : d;
    }, f.prototype.cmp = function(i) {
      if (this.negative !== 0 && i.negative === 0)
        return -1;
      if (this.negative === 0 && i.negative !== 0)
        return 1;
      var h = this.ucmp(i);
      return this.negative !== 0 ? -h | 0 : h;
    }, f.prototype.ucmp = function(i) {
      if (this.length > i.length)
        return 1;
      if (this.length < i.length)
        return -1;
      for (var h = 0, d = this.length - 1; d >= 0; d--) {
        var c = this.words[d] | 0, v = i.words[d] | 0;
        if (c !== v) {
          c < v ? h = -1 : c > v && (h = 1);
          break;
        }
      }
      return h;
    }, f.prototype.gtn = function(i) {
      return this.cmpn(i) === 1;
    }, f.prototype.gt = function(i) {
      return this.cmp(i) === 1;
    }, f.prototype.gten = function(i) {
      return this.cmpn(i) >= 0;
    }, f.prototype.gte = function(i) {
      return this.cmp(i) >= 0;
    }, f.prototype.ltn = function(i) {
      return this.cmpn(i) === -1;
    }, f.prototype.lt = function(i) {
      return this.cmp(i) === -1;
    }, f.prototype.lten = function(i) {
      return this.cmpn(i) <= 0;
    }, f.prototype.lte = function(i) {
      return this.cmp(i) <= 0;
    }, f.prototype.eqn = function(i) {
      return this.cmpn(i) === 0;
    }, f.prototype.eq = function(i) {
      return this.cmp(i) === 0;
    }, f.red = function(i) {
      return new p(i);
    }, f.prototype.toRed = function(i) {
      return s(!this.red, "Already a number in reduction context"), s(this.negative === 0, "red works only with positives"), i.convertTo(this)._forceRed(i);
    }, f.prototype.fromRed = function() {
      return s(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(i) {
      return this.red = i, this;
    }, f.prototype.forceRed = function(i) {
      return s(!this.red, "Already a number in reduction context"), this._forceRed(i);
    }, f.prototype.redAdd = function(i) {
      return s(this.red, "redAdd works only with red numbers"), this.red.add(this, i);
    }, f.prototype.redIAdd = function(i) {
      return s(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, i);
    }, f.prototype.redSub = function(i) {
      return s(this.red, "redSub works only with red numbers"), this.red.sub(this, i);
    }, f.prototype.redISub = function(i) {
      return s(this.red, "redISub works only with red numbers"), this.red.isub(this, i);
    }, f.prototype.redShl = function(i) {
      return s(this.red, "redShl works only with red numbers"), this.red.shl(this, i);
    }, f.prototype.redMul = function(i) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, i), this.red.mul(this, i);
    }, f.prototype.redIMul = function(i) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, i), this.red.imul(this, i);
    }, f.prototype.redSqr = function() {
      return s(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return s(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return s(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return s(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return s(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(i) {
      return s(this.red && !i.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, i);
    };
    var At = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function Bt(r, i) {
      this.name = r, this.p = new f(i, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    Bt.prototype._tmp = function() {
      var i = new f(null);
      return i.words = new Array(Math.ceil(this.n / 13)), i;
    }, Bt.prototype.ireduce = function(i) {
      var h = i, d;
      do
        this.split(h, this.tmp), h = this.imulK(h), h = h.iadd(this.tmp), d = h.bitLength();
      while (d > this.n);
      var c = d < this.n ? -1 : h.ucmp(this.p);
      return c === 0 ? (h.words[0] = 0, h.length = 1) : c > 0 ? h.isub(this.p) : h.strip !== void 0 ? h.strip() : h._strip(), h;
    }, Bt.prototype.split = function(i, h) {
      i.iushrn(this.n, 0, h);
    }, Bt.prototype.imulK = function(i) {
      return i.imul(this.k);
    };
    function Ct() {
      Bt.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(Ct, Bt), Ct.prototype.split = function(i, h) {
      for (var d = 4194303, c = Math.min(i.length, 9), v = 0; v < c; v++)
        h.words[v] = i.words[v];
      if (h.length = c, i.length <= 9) {
        i.words[0] = 0, i.length = 1;
        return;
      }
      var u = i.words[9];
      for (h.words[h.length++] = u & d, v = 10; v < i.length; v++) {
        var e = i.words[v] | 0;
        i.words[v - 10] = (e & d) << 4 | u >>> 22, u = e;
      }
      u >>>= 22, i.words[v - 10] = u, u === 0 && i.length > 10 ? i.length -= 10 : i.length -= 9;
    }, Ct.prototype.imulK = function(i) {
      i.words[i.length] = 0, i.words[i.length + 1] = 0, i.length += 2;
      for (var h = 0, d = 0; d < i.length; d++) {
        var c = i.words[d] | 0;
        h += c * 977, i.words[d] = h & 67108863, h = c * 64 + (h / 67108864 | 0);
      }
      return i.words[i.length - 1] === 0 && (i.length--, i.words[i.length - 1] === 0 && i.length--), i;
    };
    function Et() {
      Bt.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(Et, Bt);
    function Y() {
      Bt.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(Y, Bt);
    function It() {
      Bt.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(It, Bt), It.prototype.imulK = function(i) {
      for (var h = 0, d = 0; d < i.length; d++) {
        var c = (i.words[d] | 0) * 19 + h, v = c & 67108863;
        c >>>= 26, i.words[d] = v, h = c;
      }
      return h !== 0 && (i.words[i.length++] = h), i;
    }, f._prime = function(i) {
      if (At[i])
        return At[i];
      var h;
      if (i === "k256")
        h = new Ct();
      else if (i === "p224")
        h = new Et();
      else if (i === "p192")
        h = new Y();
      else if (i === "p25519")
        h = new It();
      else
        throw new Error("Unknown prime " + i);
      return At[i] = h, h;
    };
    function p(r) {
      if (typeof r == "string") {
        var i = f._prime(r);
        this.m = i.p, this.prime = i;
      } else
        s(r.gtn(1), "modulus must be greater than 1"), this.m = r, this.prime = null;
    }
    p.prototype._verify1 = function(i) {
      s(i.negative === 0, "red works only with positives"), s(i.red, "red works only with red numbers");
    }, p.prototype._verify2 = function(i, h) {
      s((i.negative | h.negative) === 0, "red works only with positives"), s(
        i.red && i.red === h.red,
        "red works only with red numbers"
      );
    }, p.prototype.imod = function(i) {
      return this.prime ? this.prime.ireduce(i)._forceRed(this) : (M(i, i.umod(this.m)._forceRed(this)), i);
    }, p.prototype.neg = function(i) {
      return i.isZero() ? i.clone() : this.m.sub(i)._forceRed(this);
    }, p.prototype.add = function(i, h) {
      this._verify2(i, h);
      var d = i.add(h);
      return d.cmp(this.m) >= 0 && d.isub(this.m), d._forceRed(this);
    }, p.prototype.iadd = function(i, h) {
      this._verify2(i, h);
      var d = i.iadd(h);
      return d.cmp(this.m) >= 0 && d.isub(this.m), d;
    }, p.prototype.sub = function(i, h) {
      this._verify2(i, h);
      var d = i.sub(h);
      return d.cmpn(0) < 0 && d.iadd(this.m), d._forceRed(this);
    }, p.prototype.isub = function(i, h) {
      this._verify2(i, h);
      var d = i.isub(h);
      return d.cmpn(0) < 0 && d.iadd(this.m), d;
    }, p.prototype.shl = function(i, h) {
      return this._verify1(i), this.imod(i.ushln(h));
    }, p.prototype.imul = function(i, h) {
      return this._verify2(i, h), this.imod(i.imul(h));
    }, p.prototype.mul = function(i, h) {
      return this._verify2(i, h), this.imod(i.mul(h));
    }, p.prototype.isqr = function(i) {
      return this.imul(i, i.clone());
    }, p.prototype.sqr = function(i) {
      return this.mul(i, i);
    }, p.prototype.sqrt = function(i) {
      if (i.isZero())
        return i.clone();
      var h = this.m.andln(3);
      if (s(h % 2 === 1), h === 3) {
        var d = this.m.add(new f(1)).iushrn(2);
        return this.pow(i, d);
      }
      for (var c = this.m.subn(1), v = 0; !c.isZero() && c.andln(1) === 0; )
        v++, c.iushrn(1);
      s(!c.isZero());
      var u = new f(1).toRed(this), e = u.redNeg(), l = this.m.subn(1).iushrn(1), b = this.m.bitLength();
      for (b = new f(2 * b * b).toRed(this); this.pow(b, l).cmp(e) !== 0; )
        b.redIAdd(e);
      for (var _ = this.pow(b, c), C = this.pow(i, c.addn(1).iushrn(1)), q = this.pow(i, c), O = v; q.cmp(u) !== 0; ) {
        for (var R = q, P = 0; R.cmp(u) !== 0; P++)
          R = R.redSqr();
        s(P < O);
        var N = this.pow(_, new f(1).iushln(O - P - 1));
        C = C.redMul(N), _ = N.redSqr(), q = q.redMul(_), O = P;
      }
      return C;
    }, p.prototype.invm = function(i) {
      var h = i._invmp(this.m);
      return h.negative !== 0 ? (h.negative = 0, this.imod(h).redNeg()) : this.imod(h);
    }, p.prototype.pow = function(i, h) {
      if (h.isZero())
        return new f(1).toRed(this);
      if (h.cmpn(1) === 0)
        return i.clone();
      var d = 4, c = new Array(1 << d);
      c[0] = new f(1).toRed(this), c[1] = i;
      for (var v = 2; v < c.length; v++)
        c[v] = this.mul(c[v - 1], i);
      var u = c[0], e = 0, l = 0, b = h.bitLength() % 26;
      for (b === 0 && (b = 26), v = h.length - 1; v >= 0; v--) {
        for (var _ = h.words[v], C = b - 1; C >= 0; C--) {
          var q = _ >> C & 1;
          if (u !== c[0] && (u = this.sqr(u)), q === 0 && e === 0) {
            l = 0;
            continue;
          }
          e <<= 1, e |= q, l++, !(l !== d && (v !== 0 || C !== 0)) && (u = this.mul(u, c[e]), l = 0, e = 0);
        }
        b = 26;
      }
      return u;
    }, p.prototype.convertTo = function(i) {
      var h = i.umod(this.m);
      return h === i ? h.clone() : h;
    }, p.prototype.convertFrom = function(i) {
      var h = i.clone();
      return h.red = null, h;
    }, f.mont = function(i) {
      return new t(i);
    };
    function t(r) {
      p.call(this, r), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(t, p), t.prototype.convertTo = function(i) {
      return this.imod(i.ushln(this.shift));
    }, t.prototype.convertFrom = function(i) {
      var h = this.imod(i.mul(this.rinv));
      return h.red = null, h;
    }, t.prototype.imul = function(i, h) {
      if (i.isZero() || h.isZero())
        return i.words[0] = 0, i.length = 1, i;
      var d = i.imul(h), c = d.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), v = d.isub(c).iushrn(this.shift), u = v;
      return v.cmp(this.m) >= 0 ? u = v.isub(this.m) : v.cmpn(0) < 0 && (u = v.iadd(this.m)), u._forceRed(this);
    }, t.prototype.mul = function(i, h) {
      if (i.isZero() || h.isZero())
        return new f(0)._forceRed(this);
      var d = i.mul(h), c = d.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), v = d.isub(c).iushrn(this.shift), u = v;
      return v.cmp(this.m) >= 0 ? u = v.isub(this.m) : v.cmpn(0) < 0 && (u = v.iadd(this.m)), u._forceRed(this);
    }, t.prototype.invm = function(i) {
      var h = this.imod(i._invmp(this.m).mul(this.r2));
      return h._forceRed(this);
    };
  })(a, Xt);
})(O0);
var z0 = O0.exports, ui = z0, Pv = yi, Dv = zt.Buffer;
function oo(a) {
  var n = a.modulus.byteLength(), o;
  do
    o = new ui(Pv(n));
  while (o.cmp(a.modulus) >= 0 || !o.umod(a.prime1) || !o.umod(a.prime2));
  return o;
}
function Nv(a) {
  var n = oo(a), o = n.toRed(ui.mont(a.modulus)).redPow(new ui(a.publicExponent)).fromRed();
  return { blinder: o, unblinder: n.invm(a.modulus) };
}
function uo(a, n) {
  var o = Nv(n), s = n.modulus.byteLength(), m = new ui(a).mul(o.blinder).umod(n.modulus), f = m.toRed(ui.mont(n.prime1)), g = m.toRed(ui.mont(n.prime2)), y = n.coefficient, S = n.prime1, B = n.prime2, M = f.redPow(n.exponent1).fromRed(), x = g.redPow(n.exponent2).fromRed(), I = M.isub(x).imul(y).umod(S).imul(B);
  return x.iadd(I).imul(o.unblinder).umod(n.modulus).toArrayLike(Dv, "be", s);
}
uo.getr = oo;
var K0 = uo, Tf = {};
const $v = "elliptic", Lv = "6.6.1", Uv = "EC cryptography", Ov = "lib/elliptic.js", zv = [
  "lib"
], Kv = {
  lint: "eslint lib test",
  "lint:fix": "npm run lint -- --fix",
  unit: "istanbul test _mocha --reporter=spec test/index.js",
  test: "npm run lint && npm run unit",
  version: "grunt dist && git add dist/"
}, Hv = {
  type: "git",
  url: "git@github.com:indutny/elliptic"
}, Zv = [
  "EC",
  "Elliptic",
  "curve",
  "Cryptography"
], Wv = "Fedor Indutny <fedor@indutny.com>", Vv = "MIT", Yv = {
  url: "https://github.com/indutny/elliptic/issues"
}, Jv = "https://github.com/indutny/elliptic", Gv = {
  brfs: "^2.0.2",
  coveralls: "^3.1.0",
  eslint: "^7.6.0",
  grunt: "^1.2.1",
  "grunt-browserify": "^5.3.0",
  "grunt-cli": "^1.3.2",
  "grunt-contrib-connect": "^3.0.0",
  "grunt-contrib-copy": "^1.0.0",
  "grunt-contrib-uglify": "^5.0.0",
  "grunt-mocha-istanbul": "^5.0.2",
  "grunt-saucelabs": "^9.0.1",
  istanbul: "^0.4.5",
  mocha: "^8.0.1"
}, Xv = {
  "bn.js": "^4.11.9",
  brorand: "^1.1.0",
  "hash.js": "^1.0.0",
  "hmac-drbg": "^1.0.1",
  inherits: "^2.0.4",
  "minimalistic-assert": "^1.0.1",
  "minimalistic-crypto-utils": "^1.0.1"
}, jv = {
  name: $v,
  version: Lv,
  description: Uv,
  main: Ov,
  files: zv,
  scripts: Kv,
  repository: Hv,
  keywords: Zv,
  author: Wv,
  license: Vv,
  bugs: Yv,
  homepage: Jv,
  devDependencies: Gv,
  dependencies: Xv
};
var Ke = {}, H0 = { exports: {} };
H0.exports;
(function(a) {
  (function(n, o) {
    function s(p, t) {
      if (!p)
        throw new Error(t || "Assertion failed");
    }
    function m(p, t) {
      p.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, p.prototype = new r(), p.prototype.constructor = p;
    }
    function f(p, t, r) {
      if (f.isBN(p))
        return p;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, p !== null && ((t === "le" || t === "be") && (r = t, t = 10), this._init(p || 0, t || 10, r || "be"));
    }
    typeof n == "object" ? n.exports = f : o.BN = f, f.BN = f, f.wordSize = 26;
    var g;
    try {
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Ne.Buffer;
    } catch (p) {
    }
    f.isBN = function(t) {
      return t instanceof f ? !0 : t !== null && typeof t == "object" && t.constructor.wordSize === f.wordSize && Array.isArray(t.words);
    }, f.max = function(t, r) {
      return t.cmp(r) > 0 ? t : r;
    }, f.min = function(t, r) {
      return t.cmp(r) < 0 ? t : r;
    }, f.prototype._init = function(t, r, i) {
      if (typeof t == "number")
        return this._initNumber(t, r, i);
      if (typeof t == "object")
        return this._initArray(t, r, i);
      r === "hex" && (r = 16), s(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var h = 0;
      t[0] === "-" && (h++, this.negative = 1), h < t.length && (r === 16 ? this._parseHex(t, h, i) : (this._parseBase(t, r, h), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (s(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (s(typeof t.length == "number"), t.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(t.length / 3), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (h = t.length - 1, d = 0; h >= 0; h -= 3)
          c = t[h] | t[h - 1] << 8 | t[h - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (h = 0, d = 0; h < t.length; h += 3)
          c = t[h] | t[h + 1] << 8 | t[h + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      return this.strip();
    };
    function y(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function S(p, t, r) {
      var i = y(p, r);
      return r - 1 >= t && (i |= y(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (h = t.length - 1; h >= r; h -= 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (h = u % 2 === 0 ? r + 1 : r; h < t.length; h += 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var h = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        h *= i, v >= 49 ? h += v - 49 + 10 : v >= 17 ? h += v - 17 + 10 : h += v;
      }
      return h;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var h = 0, d = 1; d <= 67108863; d *= r)
        h++;
      h--, d = d / r | 0;
      for (var c = t.length - i, v = c % h, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += h)
        e = B(t, l, l + h, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var b = 1;
        for (e = B(t, l, t.length, r), l = 0; l < v; l++)
          b *= r;
        this.imuln(b), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      }
      this.strip();
    }, f.prototype.copy = function(t) {
      t.words = new Array(this.length);
      for (var r = 0; r < this.length; r++)
        t.words[r] = this.words[r];
      t.length = this.length, t.negative = this.negative, t.red = this.red;
    }, f.prototype.clone = function() {
      var t = new f(null);
      return this.copy(t), t;
    }, f.prototype._expand = function(t) {
      for (; this.length < t; )
        this.words[this.length++] = 0;
      return this;
    }, f.prototype.strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, f.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, f.prototype.inspect = function() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var M = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], x = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], I = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    f.prototype.toString = function(t, r) {
      t = t || 10, r = r | 0 || 1;
      var i;
      if (t === 16 || t === "hex") {
        i = "";
        for (var h = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << h | d) & 16777215).toString(16);
          d = v >>> 24 - h & 16777215, h += 2, h >= 26 && (h -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = I[t];
        i = "";
        var b = this.clone();
        for (b.negative = 0; !b.isZero(); ) {
          var _ = b.modn(l).toString(t);
          b = b.idivn(l), b.isZero() ? i = _ + i : i = M[e - _.length] + _ + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      s(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && s(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return s(typeof g != "undefined"), this.toArrayLike(g, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var h = this.byteLength(), d = i || Math.max(1, h);
      s(h <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - h; e++)
          v[e] = 0;
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[d - e - 1] = u;
      }
      return v;
    }, Math.clz32 ? f.prototype._countBits = function(t) {
      return 32 - Math.clz32(t);
    } : f.prototype._countBits = function(t) {
      var r = t, i = 0;
      return r >= 4096 && (i += 13, r >>>= 13), r >= 64 && (i += 7, r >>>= 7), r >= 8 && (i += 4, r >>>= 4), r >= 2 && (i += 2, r >>>= 2), i + r;
    }, f.prototype._zeroBits = function(t) {
      if (t === 0)
        return 26;
      var r = t, i = 0;
      return r & 8191 || (i += 13, r >>>= 13), r & 127 || (i += 7, r >>>= 7), r & 15 || (i += 4, r >>>= 4), r & 3 || (i += 2, r >>>= 2), r & 1 || i++, i;
    }, f.prototype.bitLength = function() {
      var t = this.words[this.length - 1], r = this._countBits(t);
      return (this.length - 1) * 26 + r;
    };
    function k(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, h = r % 26;
        t[r] = (p.words[i] & 1 << h) >>> h;
      }
      return t;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var t = 0, r = 0; r < this.length; r++) {
        var i = this._zeroBits(this.words[r]);
        if (t += i, i !== 26)
          break;
      }
      return t;
    }, f.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, f.prototype.toTwos = function(t) {
      return this.negative !== 0 ? this.abs().inotn(t).iaddn(1) : this.clone();
    }, f.prototype.fromTwos = function(t) {
      return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone();
    }, f.prototype.isNeg = function() {
      return this.negative !== 0;
    }, f.prototype.neg = function() {
      return this.clone().ineg();
    }, f.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, f.prototype.iuor = function(t) {
      for (; this.length < t.length; )
        this.words[this.length++] = 0;
      for (var r = 0; r < t.length; r++)
        this.words[r] = this.words[r] | t.words[r];
      return this.strip();
    }, f.prototype.ior = function(t) {
      return s((this.negative | t.negative) === 0), this.iuor(t);
    }, f.prototype.or = function(t) {
      return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this);
    }, f.prototype.uor = function(t) {
      return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this);
    }, f.prototype.iuand = function(t) {
      var r;
      this.length > t.length ? r = t : r = this;
      for (var i = 0; i < r.length; i++)
        this.words[i] = this.words[i] & t.words[i];
      return this.length = r.length, this.strip();
    }, f.prototype.iand = function(t) {
      return s((this.negative | t.negative) === 0), this.iuand(t);
    }, f.prototype.and = function(t) {
      return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this);
    }, f.prototype.uand = function(t) {
      return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this);
    }, f.prototype.iuxor = function(t) {
      var r, i;
      this.length > t.length ? (r = this, i = t) : (r = t, i = this);
      for (var h = 0; h < i.length; h++)
        this.words[h] = r.words[h] ^ i.words[h];
      if (this !== r)
        for (; h < r.length; h++)
          this.words[h] = r.words[h];
      return this.length = r.length, this.strip();
    }, f.prototype.ixor = function(t) {
      return s((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var h = 0; h < r; h++)
        this.words[h] = ~this.words[h] & 67108863;
      return i > 0 && (this.words[h] = ~this.words[h] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, h = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << h : this.words[i] = this.words[i] & ~(1 << h), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, h;
      this.length > t.length ? (i = this, h = t) : (i = t, h = this);
      for (var d = 0, c = 0; c < h.length; c++)
        r = (i.words[c] | 0) + (h.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      for (; d !== 0 && c < i.length; c++)
        r = (i.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      if (this.length = i.length, d !== 0)
        this.words[this.length] = d, this.length++;
      else if (i !== this)
        for (; c < i.length; c++)
          this.words[c] = i.words[c];
      return this;
    }, f.prototype.add = function(t) {
      var r;
      return t.negative !== 0 && this.negative === 0 ? (t.negative = 0, r = this.sub(t), t.negative ^= 1, r) : t.negative === 0 && this.negative !== 0 ? (this.negative = 0, r = t.sub(this), this.negative = 1, r) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this);
    }, f.prototype.isub = function(t) {
      if (t.negative !== 0) {
        t.negative = 0;
        var r = this.iadd(t);
        return t.negative = 1, r._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
      var i = this.cmp(t);
      if (i === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var h, d;
      i > 0 ? (h = this, d = t) : (h = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (h.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < h.length; v++)
        r = (h.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < h.length && h !== this)
        for (; v < h.length; v++)
          this.words[v] = h.words[v];
      return this.length = Math.max(this.length, v), h !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var h = p.words[0] | 0, d = t.words[0] | 0, c = h * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var q = e - C | 0;
          h = p.words[q] | 0, d = t.words[C] | 0, c = h * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var U = function(t, r, i) {
      var h = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = h[0] | 0, _ = b & 8191, C = b >>> 13, q = h[1] | 0, O = q & 8191, R = q >>> 13, P = h[2] | 0, N = P & 8191, K = P >>> 13, kt = h[3] | 0, Z = kt & 8191, J = kt >>> 13, Ft = h[4] | 0, tt = Ft & 8191, vt = Ft >>> 13, Dt = h[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = h[6] | 0, j = Pt & 8191, dt = Pt >>> 13, qt = h[7] | 0, Q = qt & 8191, ct = qt >>> 13, Ut = h[8] | 0, E = Ut & 8191, w = Ut >>> 13, A = h[9] | 0, T = A & 8191, F = A >>> 13, V = d[0] | 0, L = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, Kt = d[3] | 0, nt = Kt & 8191, bt = Kt >>> 13, Ht = d[4] | 0, ft = Ht & 8191, yt = Ht >>> 13, Zt = d[5] | 0, at = Zt & 8191, wt = Zt >>> 13, Wt = d[6] | 0, ht = Wt & 8191, Mt = Wt >>> 13, Vt = d[7] | 0, st = Vt & 8191, xt = Vt >>> 13, Yt = d[8] | 0, ot = Yt & 8191, _t = Yt >>> 13, Jt = d[9] | 0, ut = Jt & 8191, St = Jt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, L), e = Math.imul(_, X), e = e + Math.imul(C, L) | 0, l = Math.imul(C, X);
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul(O, L), e = Math.imul(O, X), e = e + Math.imul(R, L) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(N, L), e = Math.imul(N, X), e = e + Math.imul(K, L) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(Z, L), e = Math.imul(Z, X), e = e + Math.imul(J, L) | 0, l = Math.imul(J, X), u = u + Math.imul(N, G) | 0, e = e + Math.imul(N, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(tt, L), e = Math.imul(tt, X), e = e + Math.imul(vt, L) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul(N, it) | 0, e = e + Math.imul(N, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(et, L), e = Math.imul(et, X), e = e + Math.imul(pt, L) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul(N, nt) | 0, e = e + Math.imul(N, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(j, L), e = Math.imul(j, X), e = e + Math.imul(dt, L) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul(N, ft) | 0, e = e + Math.imul(N, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(Q, L), e = Math.imul(Q, X), e = e + Math.imul(ct, L) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul(N, at) | 0, e = e + Math.imul(N, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(E, L), e = Math.imul(E, X), e = e + Math.imul(w, L) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul(N, ht) | 0, e = e + Math.imul(N, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, L), e = Math.imul(T, X), e = e + Math.imul(F, L) | 0, l = Math.imul(F, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul(N, st) | 0, e = e + Math.imul(N, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(F, G) | 0, l = Math.imul(F, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul(N, ot) | 0, e = e + Math.imul(N, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(F, it) | 0, l = Math.imul(F, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul(N, ut) | 0, e = e + Math.imul(N, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(F, nt) | 0, l = Math.imul(F, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(F, ft) | 0, l = Math.imul(F, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(F, at) | 0, l = Math.imul(F, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(F, ht) | 0, l = Math.imul(F, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(F, st) | 0, l = Math.imul(F, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(F, ot) | 0, l = Math.imul(F, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(F, ut) | 0, l = Math.imul(F, St);
      var pe = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (pe >>> 26) | 0, pe &= 67108863, c[0] = Nt, c[1] = $t, c[2] = Qt, c[3] = te, c[4] = ee, c[5] = re, c[6] = ie, c[7] = ne, c[8] = fe, c[9] = ae, c[10] = he, c[11] = se, c[12] = oe, c[13] = ue, c[14] = le, c[15] = de, c[16] = ce, c[17] = ve, c[18] = pe, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (U = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, h = 0, d = 0; d < r.length - 1; d++) {
        var c = h;
        h = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, q = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, q = q + v | 0, v = q & 67108863, c = c + (q >>> 26) | 0, h += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = h;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new $();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, h = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = U(this, t, r) : h < 63 ? i = D(this, t, r) : h < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function $(p, t) {
      this.x = p, this.y = t;
    }
    $.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, h = 0; h < t; h++)
        r[h] = this.revBin(h, i, t);
      return r;
    }, $.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var h = 0, d = 0; d < r; d++)
        h |= (t & 1) << r - d - 1, t >>= 1;
      return h;
    }, $.prototype.permute = function(t, r, i, h, d, c) {
      for (var v = 0; v < c; v++)
        h[v] = r[t[v]], d[v] = i[t[v]];
    }, $.prototype.transform = function(t, r, i, h, d, c) {
      this.permute(c, t, r, i, h, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, q = 0; q < v; q++) {
            var O = i[b + q], R = h[b + q], P = i[b + q + v], N = h[b + q + v], K = _ * P - C * N;
            N = _ * N + C * P, P = K, i[b + q] = O + P, h[b + q] = R + N, i[b + q + v] = O - P, h[b + q + v] = R - N, q !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, $.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, h = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + h;
    }, $.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var h = 0; h < i / 2; h++) {
          var d = t[h];
          t[h] = t[i - h - 1], t[i - h - 1] = d, d = r[h], r[h] = -r[i - h - 1], r[i - h - 1] = -d;
        }
    }, $.prototype.normalize13b = function(t, r) {
      for (var i = 0, h = 0; h < r / 2; h++) {
        var d = Math.round(t[2 * h + 1] / r) * 8192 + Math.round(t[2 * h] / r) + i;
        t[h] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, $.prototype.convert13b = function(t, r, i, h) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < h; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, $.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, $.prototype.mulp = function(t, r, i) {
      var h = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(h), c = this.stub(h), v = new Array(h), u = new Array(h), e = new Array(h), l = new Array(h), b = new Array(h), _ = new Array(h), C = i.words;
      C.length = h, this.convert13b(t.words, t.length, v, h), this.convert13b(r.words, r.length, l, h), this.transform(v, c, u, e, h, d), this.transform(l, c, b, _, h, d);
      for (var q = 0; q < h; q++) {
        var O = u[q] * b[q] - e[q] * _[q];
        e[q] = u[q] * _[q] + e[q] * b[q], u[q] = O;
      }
      return this.conjugate(u, e, h), this.transform(u, e, C, c, h, d), this.conjugate(C, c, h), this.normalize13b(C, h), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), z(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      s(typeof t == "number"), s(t < 67108864);
      for (var r = 0, i = 0; i < this.length; i++) {
        var h = (this.words[i] | 0) * t, d = (h & 67108863) + (r & 67108863);
        r >>= 26, r += h / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = k(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, h = 0; h < r.length && r[h] === 0; h++, i = i.sqr())
        ;
      if (++h < r.length)
        for (var d = i.sqr(); h < r.length; h++, d = d.sqr())
          r[h] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & h, u = (this.words[d] | 0) - v << r;
          this.words[d] = u | c, c = v >>> 26 - r;
        }
        c && (this.words[d] = c, this.length++);
      }
      if (i !== 0) {
        for (d = this.length - 1; d >= 0; d--)
          this.words[d + i] = this.words[d];
        for (d = 0; d < i; d++)
          this.words[d] = 0;
        this.length += i;
      }
      return this.strip();
    }, f.prototype.ishln = function(t) {
      return s(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      s(typeof t == "number" && t >= 0);
      var h;
      r ? h = (r - r % 26) / 26 : h = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (h -= c, h = Math.max(0, h), u) {
        for (var e = 0; e < c; e++)
          u.words[e] = this.words[e];
        u.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var l = 0;
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= h); e--) {
        var b = this.words[e] | 0;
        this.words[e] = l << 26 - d | b >>> d, l = b & v;
      }
      return u && l !== 0 && (u.words[u.length++] = l), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return s(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & h);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var h = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= h;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return s(typeof t == "number"), s(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (s(typeof t == "number"), s(t < 67108864), t < 0)
        return this.iaddn(-t);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(t), this.negative = 1, this;
      if (this.words[0] -= t, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var r = 0; r < this.length && this.words[r] < 0; r++)
          this.words[r] += 67108864, this.words[r + 1] -= 1;
      return this.strip();
    }, f.prototype.addn = function(t) {
      return this.clone().iaddn(t);
    }, f.prototype.subn = function(t) {
      return this.clone().isubn(t);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(t, r, i) {
      var h = t.length + i, d;
      this._expand(h);
      var c, v = 0;
      for (d = 0; d < t.length; d++) {
        c = (this.words[d + i] | 0) + v;
        var u = (t.words[d] | 0) * r;
        c -= u & 67108863, v = (c >> 26) - (u / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (s(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, h = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), h.iushln(i), c = d.words[d.length - 1] | 0);
      var u = h.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = h.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (h = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (h.words[d.length + _] | 0) * 67108864 + (h.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), h._ishlnsubmul(d, C, _); h.negative !== 0; )
          C--, h.negative = 0, h._ishlnsubmul(d, 1, _), h.isZero() || (h.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), h.strip(), r !== "div" && i !== 0 && h.iushrn(i), {
        div: e || null,
        mod: h
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var h, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (h = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: h,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (h = c.div.neg()), {
        div: h,
        mod: c.mod
      }) : this.negative & t.negative ? (c = this.neg().divmod(t.neg(), r), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.isub(t)), {
        div: c.div,
        mod: d
      }) : t.length > this.length || this.cmp(t) < 0 ? {
        div: new f(0),
        mod: this
      } : t.length === 1 ? r === "div" ? {
        div: this.divn(t.words[0]),
        mod: null
      } : r === "mod" ? {
        div: null,
        mod: new f(this.modn(t.words[0]))
      } : {
        div: this.divn(t.words[0]),
        mod: new f(this.modn(t.words[0]))
      } : this._wordDiv(t, r);
    }, f.prototype.div = function(t) {
      return this.divmod(t, "div", !1).div;
    }, f.prototype.mod = function(t) {
      return this.divmod(t, "mod", !1).mod;
    }, f.prototype.umod = function(t) {
      return this.divmod(t, "mod", !0).mod;
    }, f.prototype.divRound = function(t) {
      var r = this.divmod(t);
      if (r.mod.isZero())
        return r.div;
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, h = t.ushrn(1), d = t.andln(1), c = i.cmp(h);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, h = this.length - 1; h >= 0; h--)
        i = (r * i + (this.words[h] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = (this.words[i] | 0) + r * 67108864;
        this.words[i] = h / t | 0, r = h % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (h.isOdd() || d.isOdd()) && (h.iadd(e), d.isub(l)), h.iushrn(1), d.iushrn(1);
        for (var C = 0, q = 1; !(i.words[0] & q) && C < 26; ++C, q <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(c), d.isub(v)) : (i.isub(r), c.isub(h), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(u)
      };
    }, f.prototype._invmp = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            h.isOdd() && h.iadd(c), h.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(d)) : (i.isub(r), d.isub(h));
      }
      var b;
      return r.cmpn(1) === 0 ? b = h : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var h = 0; r.isEven() && i.isEven(); h++)
        r.iushrn(1), i.iushrn(1);
      do {
        for (; r.isEven(); )
          r.iushrn(1);
        for (; i.isEven(); )
          i.iushrn(1);
        var d = r.cmp(i);
        if (d < 0) {
          var c = r;
          r = i, i = c;
        } else if (d === 0 || i.cmpn(1) === 0)
          break;
        r.isub(i);
      } while (!0);
      return i.iushln(h);
    }, f.prototype.invm = function(t) {
      return this.egcd(t).a.umod(t);
    }, f.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, f.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, f.prototype.andln = function(t) {
      return this.words[0] & t;
    }, f.prototype.bincn = function(t) {
      s(typeof t == "number");
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= h, this;
      for (var d = h, c = i; d !== 0 && c < this.length; c++) {
        var v = this.words[c] | 0;
        v += d, d = v >>> 26, v &= 67108863, this.words[c] = v;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(t) {
      var r = t < 0;
      if (this.negative !== 0 && !r)
        return -1;
      if (this.negative === 0 && r)
        return 1;
      this.strip();
      var i;
      if (this.length > 1)
        i = 1;
      else {
        r && (t = -t), s(t <= 67108863, "Number is too big");
        var h = this.words[0] | 0;
        i = h === t ? 0 : h < t ? -1 : 1;
      }
      return this.negative !== 0 ? -i | 0 : i;
    }, f.prototype.cmp = function(t) {
      if (this.negative !== 0 && t.negative === 0)
        return -1;
      if (this.negative === 0 && t.negative !== 0)
        return 1;
      var r = this.ucmp(t);
      return this.negative !== 0 ? -r | 0 : r;
    }, f.prototype.ucmp = function(t) {
      if (this.length > t.length)
        return 1;
      if (this.length < t.length)
        return -1;
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = this.words[i] | 0, d = t.words[i] | 0;
        if (h !== d) {
          h < d ? r = -1 : h > d && (r = 1);
          break;
        }
      }
      return r;
    }, f.prototype.gtn = function(t) {
      return this.cmpn(t) === 1;
    }, f.prototype.gt = function(t) {
      return this.cmp(t) === 1;
    }, f.prototype.gten = function(t) {
      return this.cmpn(t) >= 0;
    }, f.prototype.gte = function(t) {
      return this.cmp(t) >= 0;
    }, f.prototype.ltn = function(t) {
      return this.cmpn(t) === -1;
    }, f.prototype.lt = function(t) {
      return this.cmp(t) === -1;
    }, f.prototype.lten = function(t) {
      return this.cmpn(t) <= 0;
    }, f.prototype.lte = function(t) {
      return this.cmp(t) <= 0;
    }, f.prototype.eqn = function(t) {
      return this.cmpn(t) === 0;
    }, f.prototype.eq = function(t) {
      return this.cmp(t) === 0;
    }, f.red = function(t) {
      return new Y(t);
    }, f.prototype.toRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), s(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return s(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return s(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return s(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return s(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return s(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return s(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return s(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return s(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return s(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return s(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return s(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return s(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var lt = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function H(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    H.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, H.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var h = i < this.n ? -1 : r.ucmp(this.p);
      return h === 0 ? (r.words[0] = 0, r.length = 1) : h > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, H.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, H.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function At() {
      H.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(At, H), At.prototype.split = function(t, r) {
      for (var i = 4194303, h = Math.min(t.length, 9), d = 0; d < h; d++)
        r.words[d] = t.words[d];
      if (r.length = h, t.length <= 9) {
        t.words[0] = 0, t.length = 1;
        return;
      }
      var c = t.words[9];
      for (r.words[r.length++] = c & i, d = 10; d < t.length; d++) {
        var v = t.words[d] | 0;
        t.words[d - 10] = (v & i) << 4 | c >>> 22, c = v;
      }
      c >>>= 22, t.words[d - 10] = c, c === 0 && t.length > 10 ? t.length -= 10 : t.length -= 9;
    }, At.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = t.words[i] | 0;
        r += h * 977, t.words[i] = r & 67108863, r = h * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function Bt() {
      H.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(Bt, H);
    function Ct() {
      H.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(Ct, H);
    function Et() {
      H.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(Et, H), Et.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = (t.words[i] | 0) * 19 + r, d = h & 67108863;
        h >>>= 26, t.words[i] = d, r = h;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (lt[t])
        return lt[t];
      var r;
      if (t === "k256")
        r = new At();
      else if (t === "p224")
        r = new Bt();
      else if (t === "p192")
        r = new Ct();
      else if (t === "p25519")
        r = new Et();
      else
        throw new Error("Unknown prime " + t);
      return lt[t] = r, r;
    };
    function Y(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        s(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    Y.prototype._verify1 = function(t) {
      s(t.negative === 0, "red works only with positives"), s(t.red, "red works only with red numbers");
    }, Y.prototype._verify2 = function(t, r) {
      s((t.negative | r.negative) === 0, "red works only with positives"), s(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, Y.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, Y.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, Y.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, Y.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, Y.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, Y.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, Y.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, Y.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, Y.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, Y.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, Y.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, Y.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (s(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var h = this.m.subn(1), d = 0; !h.isZero() && h.andln(1) === 0; )
        d++, h.iushrn(1);
      s(!h.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, h), b = this.pow(t, h.addn(1).iushrn(1)), _ = this.pow(t, h), C = d; _.cmp(c) !== 0; ) {
        for (var q = _, O = 0; q.cmp(c) !== 0; O++)
          q = q.redSqr();
        s(O < C);
        var R = this.pow(l, new f(1).iushln(C - O - 1));
        b = b.redMul(R), l = R.redSqr(), _ = _.redMul(l), C = O;
      }
      return b;
    }, Y.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, Y.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, h = new Array(1 << i);
      h[0] = new f(1).toRed(this), h[1] = t;
      for (var d = 2; d < h.length; d++)
        h[d] = this.mul(h[d - 1], t);
      var c = h[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== h[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, h[v]), u = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, Y.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, Y.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new It(t);
    };
    function It(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(It, Y), It.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, It.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, It.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(a, Xt);
})(H0);
var Tr = H0.exports, Z0 = {};
(function(a) {
  var n = a;
  function o(f, g) {
    if (Array.isArray(f))
      return f.slice();
    if (!f)
      return [];
    var y = [];
    if (typeof f != "string") {
      for (var S = 0; S < f.length; S++)
        y[S] = f[S] | 0;
      return y;
    }
    if (g === "hex") {
      f = f.replace(/[^a-z0-9]+/ig, ""), f.length % 2 !== 0 && (f = "0" + f);
      for (var S = 0; S < f.length; S += 2)
        y.push(parseInt(f[S] + f[S + 1], 16));
    } else
      for (var S = 0; S < f.length; S++) {
        var B = f.charCodeAt(S), M = B >> 8, x = B & 255;
        M ? y.push(M, x) : y.push(x);
      }
    return y;
  }
  n.toArray = o;
  function s(f) {
    return f.length === 1 ? "0" + f : f;
  }
  n.zero2 = s;
  function m(f) {
    for (var g = "", y = 0; y < f.length; y++)
      g += s(f[y].toString(16));
    return g;
  }
  n.toHex = m, n.encode = function(g, y) {
    return y === "hex" ? m(g) : g;
  };
})(Z0);
(function(a) {
  var n = a, o = Tr, s = Ve, m = Z0;
  n.assert = s, n.toArray = m.toArray, n.zero2 = m.zero2, n.toHex = m.toHex, n.encode = m.encode;
  function f(M, x, I) {
    var k = new Array(Math.max(M.bitLength(), I) + 1), D;
    for (D = 0; D < k.length; D += 1)
      k[D] = 0;
    var U = 1 << x + 1, W = M.clone();
    for (D = 0; D < k.length; D++) {
      var z, $ = W.andln(U - 1);
      W.isOdd() ? ($ > (U >> 1) - 1 ? z = (U >> 1) - $ : z = $, W.isubn(z)) : z = 0, k[D] = z, W.iushrn(1);
    }
    return k;
  }
  n.getNAF = f;
  function g(M, x) {
    var I = [
      [],
      []
    ];
    M = M.clone(), x = x.clone();
    for (var k = 0, D = 0, U; M.cmpn(-k) > 0 || x.cmpn(-D) > 0; ) {
      var W = M.andln(3) + k & 3, z = x.andln(3) + D & 3;
      W === 3 && (W = -1), z === 3 && (z = -1);
      var $;
      W & 1 ? (U = M.andln(7) + k & 7, (U === 3 || U === 5) && z === 2 ? $ = -W : $ = W) : $ = 0, I[0].push($);
      var lt;
      z & 1 ? (U = x.andln(7) + D & 7, (U === 3 || U === 5) && W === 2 ? lt = -z : lt = z) : lt = 0, I[1].push(lt), 2 * k === $ + 1 && (k = 1 - k), 2 * D === lt + 1 && (D = 1 - D), M.iushrn(1), x.iushrn(1);
    }
    return I;
  }
  n.getJSF = g;
  function y(M, x, I) {
    var k = "_" + x;
    M.prototype[x] = function() {
      return this[k] !== void 0 ? this[k] : this[k] = I.call(this);
    };
  }
  n.cachedProperty = y;
  function S(M) {
    return typeof M == "string" ? n.toArray(M, "hex") : M;
  }
  n.parseBytes = S;
  function B(M) {
    return new o(M, "hex", "le");
  }
  n.intFromLE = B;
})(Ke);
var W0 = {}, Hr = Tr, an = Ke, In = an.getNAF, Qv = an.getJSF, Rn = an.assert;
function Ur(a, n) {
  this.type = a, this.p = new Hr(n.p, 16), this.red = n.prime ? Hr.red(n.prime) : Hr.mont(this.p), this.zero = new Hr(0).toRed(this.red), this.one = new Hr(1).toRed(this.red), this.two = new Hr(2).toRed(this.red), this.n = n.n && new Hr(n.n, 16), this.g = n.g && this.pointFromJSON(n.g, n.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
  var o = this.n && this.p.div(this.n);
  !o || o.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
}
var tf = Ur;
Ur.prototype.point = function() {
  throw new Error("Not implemented");
};
Ur.prototype.validate = function() {
  throw new Error("Not implemented");
};
Ur.prototype._fixedNafMul = function(n, o) {
  Rn(n.precomputed);
  var s = n._getDoubles(), m = In(o, 1, this._bitLength), f = (1 << s.step + 1) - (s.step % 2 === 0 ? 2 : 1);
  f /= 3;
  var g = [], y, S;
  for (y = 0; y < m.length; y += s.step) {
    S = 0;
    for (var B = y + s.step - 1; B >= y; B--)
      S = (S << 1) + m[B];
    g.push(S);
  }
  for (var M = this.jpoint(null, null, null), x = this.jpoint(null, null, null), I = f; I > 0; I--) {
    for (y = 0; y < g.length; y++)
      S = g[y], S === I ? x = x.mixedAdd(s.points[y]) : S === -I && (x = x.mixedAdd(s.points[y].neg()));
    M = M.add(x);
  }
  return M.toP();
};
Ur.prototype._wnafMul = function(n, o) {
  var s = 4, m = n._getNAFPoints(s);
  s = m.wnd;
  for (var f = m.points, g = In(o, s, this._bitLength), y = this.jpoint(null, null, null), S = g.length - 1; S >= 0; S--) {
    for (var B = 0; S >= 0 && g[S] === 0; S--)
      B++;
    if (S >= 0 && B++, y = y.dblp(B), S < 0)
      break;
    var M = g[S];
    Rn(M !== 0), n.type === "affine" ? M > 0 ? y = y.mixedAdd(f[M - 1 >> 1]) : y = y.mixedAdd(f[-M - 1 >> 1].neg()) : M > 0 ? y = y.add(f[M - 1 >> 1]) : y = y.add(f[-M - 1 >> 1].neg());
  }
  return n.type === "affine" ? y.toP() : y;
};
Ur.prototype._wnafMulAdd = function(n, o, s, m, f) {
  var g = this._wnafT1, y = this._wnafT2, S = this._wnafT3, B = 0, M, x, I;
  for (M = 0; M < m; M++) {
    I = o[M];
    var k = I._getNAFPoints(n);
    g[M] = k.wnd, y[M] = k.points;
  }
  for (M = m - 1; M >= 1; M -= 2) {
    var D = M - 1, U = M;
    if (g[D] !== 1 || g[U] !== 1) {
      S[D] = In(s[D], g[D], this._bitLength), S[U] = In(s[U], g[U], this._bitLength), B = Math.max(S[D].length, B), B = Math.max(S[U].length, B);
      continue;
    }
    var W = [
      o[D],
      /* 1 */
      null,
      /* 3 */
      null,
      /* 5 */
      o[U]
      /* 7 */
    ];
    o[D].y.cmp(o[U].y) === 0 ? (W[1] = o[D].add(o[U]), W[2] = o[D].toJ().mixedAdd(o[U].neg())) : o[D].y.cmp(o[U].y.redNeg()) === 0 ? (W[1] = o[D].toJ().mixedAdd(o[U]), W[2] = o[D].add(o[U].neg())) : (W[1] = o[D].toJ().mixedAdd(o[U]), W[2] = o[D].toJ().mixedAdd(o[U].neg()));
    var z = [
      -3,
      /* -1 -1 */
      -1,
      /* -1 0 */
      -5,
      /* -1 1 */
      -7,
      /* 0 -1 */
      0,
      /* 0 0 */
      7,
      /* 0 1 */
      5,
      /* 1 -1 */
      1,
      /* 1 0 */
      3
      /* 1 1 */
    ], $ = Qv(s[D], s[U]);
    for (B = Math.max($[0].length, B), S[D] = new Array(B), S[U] = new Array(B), x = 0; x < B; x++) {
      var lt = $[0][x] | 0, H = $[1][x] | 0;
      S[D][x] = z[(lt + 1) * 3 + (H + 1)], S[U][x] = 0, y[D] = W;
    }
  }
  var At = this.jpoint(null, null, null), Bt = this._wnafT4;
  for (M = B; M >= 0; M--) {
    for (var Ct = 0; M >= 0; ) {
      var Et = !0;
      for (x = 0; x < m; x++)
        Bt[x] = S[x][M] | 0, Bt[x] !== 0 && (Et = !1);
      if (!Et)
        break;
      Ct++, M--;
    }
    if (M >= 0 && Ct++, At = At.dblp(Ct), M < 0)
      break;
    for (x = 0; x < m; x++) {
      var Y = Bt[x];
      Y !== 0 && (Y > 0 ? I = y[x][Y - 1 >> 1] : Y < 0 && (I = y[x][-Y - 1 >> 1].neg()), I.type === "affine" ? At = At.mixedAdd(I) : At = At.add(I));
    }
  }
  for (M = 0; M < m; M++)
    y[M] = null;
  return f ? At : At.toP();
};
function Je(a, n) {
  this.curve = a, this.type = n, this.precomputed = null;
}
Ur.BasePoint = Je;
Je.prototype.eq = function() {
  throw new Error("Not implemented");
};
Je.prototype.validate = function() {
  return this.curve.validate(this);
};
Ur.prototype.decodePoint = function(n, o) {
  n = an.toArray(n, o);
  var s = this.p.byteLength();
  if ((n[0] === 4 || n[0] === 6 || n[0] === 7) && n.length - 1 === 2 * s) {
    n[0] === 6 ? Rn(n[n.length - 1] % 2 === 0) : n[0] === 7 && Rn(n[n.length - 1] % 2 === 1);
    var m = this.point(
      n.slice(1, 1 + s),
      n.slice(1 + s, 1 + 2 * s)
    );
    return m;
  } else if ((n[0] === 2 || n[0] === 3) && n.length - 1 === s)
    return this.pointFromX(n.slice(1, 1 + s), n[0] === 3);
  throw new Error("Unknown point format");
};
Je.prototype.encodeCompressed = function(n) {
  return this.encode(n, !0);
};
Je.prototype._encode = function(n) {
  var o = this.curve.p.byteLength(), s = this.getX().toArray("be", o);
  return n ? [this.getY().isEven() ? 2 : 3].concat(s) : [4].concat(s, this.getY().toArray("be", o));
};
Je.prototype.encode = function(n, o) {
  return an.encode(this._encode(o), n);
};
Je.prototype.precompute = function(n) {
  if (this.precomputed)
    return this;
  var o = {
    doubles: null,
    naf: null,
    beta: null
  };
  return o.naf = this._getNAFPoints(8), o.doubles = this._getDoubles(4, n), o.beta = this._getBeta(), this.precomputed = o, this;
};
Je.prototype._hasDoubles = function(n) {
  if (!this.precomputed)
    return !1;
  var o = this.precomputed.doubles;
  return o ? o.points.length >= Math.ceil((n.bitLength() + 1) / o.step) : !1;
};
Je.prototype._getDoubles = function(n, o) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;
  for (var s = [this], m = this, f = 0; f < o; f += n) {
    for (var g = 0; g < n; g++)
      m = m.dbl();
    s.push(m);
  }
  return {
    step: n,
    points: s
  };
};
Je.prototype._getNAFPoints = function(n) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;
  for (var o = [this], s = (1 << n) - 1, m = s === 1 ? null : this.dbl(), f = 1; f < s; f++)
    o[f] = o[f - 1].add(m);
  return {
    wnd: n,
    points: o
  };
};
Je.prototype._getBeta = function() {
  return null;
};
Je.prototype.dblp = function(n) {
  for (var o = this, s = 0; s < n; s++)
    o = o.dbl();
  return o;
};
var tp = Ke, be = Tr, V0 = Gt, xi = tf, ep = tp.assert;
function Ge(a) {
  xi.call(this, "short", a), this.a = new be(a.a, 16).toRed(this.red), this.b = new be(a.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(a), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
}
V0(Ge, xi);
var rp = Ge;
Ge.prototype._getEndomorphism = function(n) {
  if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
    var o, s;
    if (n.beta)
      o = new be(n.beta, 16).toRed(this.red);
    else {
      var m = this._getEndoRoots(this.p);
      o = m[0].cmp(m[1]) < 0 ? m[0] : m[1], o = o.toRed(this.red);
    }
    if (n.lambda)
      s = new be(n.lambda, 16);
    else {
      var f = this._getEndoRoots(this.n);
      this.g.mul(f[0]).x.cmp(this.g.x.redMul(o)) === 0 ? s = f[0] : (s = f[1], ep(this.g.mul(s).x.cmp(this.g.x.redMul(o)) === 0));
    }
    var g;
    return n.basis ? g = n.basis.map(function(y) {
      return {
        a: new be(y.a, 16),
        b: new be(y.b, 16)
      };
    }) : g = this._getEndoBasis(s), {
      beta: o,
      lambda: s,
      basis: g
    };
  }
};
Ge.prototype._getEndoRoots = function(n) {
  var o = n === this.p ? this.red : be.mont(n), s = new be(2).toRed(o).redInvm(), m = s.redNeg(), f = new be(3).toRed(o).redNeg().redSqrt().redMul(s), g = m.redAdd(f).fromRed(), y = m.redSub(f).fromRed();
  return [g, y];
};
Ge.prototype._getEndoBasis = function(n) {
  for (var o = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), s = n, m = this.n.clone(), f = new be(1), g = new be(0), y = new be(0), S = new be(1), B, M, x, I, k, D, U, W = 0, z, $; s.cmpn(0) !== 0; ) {
    var lt = m.div(s);
    z = m.sub(lt.mul(s)), $ = y.sub(lt.mul(f));
    var H = S.sub(lt.mul(g));
    if (!x && z.cmp(o) < 0)
      B = U.neg(), M = f, x = z.neg(), I = $;
    else if (x && ++W === 2)
      break;
    U = z, m = s, s = z, y = f, f = $, S = g, g = H;
  }
  k = z.neg(), D = $;
  var At = x.sqr().add(I.sqr()), Bt = k.sqr().add(D.sqr());
  return Bt.cmp(At) >= 0 && (k = B, D = M), x.negative && (x = x.neg(), I = I.neg()), k.negative && (k = k.neg(), D = D.neg()), [
    { a: x, b: I },
    { a: k, b: D }
  ];
};
Ge.prototype._endoSplit = function(n) {
  var o = this.endo.basis, s = o[0], m = o[1], f = m.b.mul(n).divRound(this.n), g = s.b.neg().mul(n).divRound(this.n), y = f.mul(s.a), S = g.mul(m.a), B = f.mul(s.b), M = g.mul(m.b), x = n.sub(y).sub(S), I = B.add(M).neg();
  return { k1: x, k2: I };
};
Ge.prototype.pointFromX = function(n, o) {
  n = new be(n, 16), n.red || (n = n.toRed(this.red));
  var s = n.redSqr().redMul(n).redIAdd(n.redMul(this.a)).redIAdd(this.b), m = s.redSqrt();
  if (m.redSqr().redSub(s).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var f = m.fromRed().isOdd();
  return (o && !f || !o && f) && (m = m.redNeg()), this.point(n, m);
};
Ge.prototype.validate = function(n) {
  if (n.inf)
    return !0;
  var o = n.x, s = n.y, m = this.a.redMul(o), f = o.redSqr().redMul(o).redIAdd(m).redIAdd(this.b);
  return s.redSqr().redISub(f).cmpn(0) === 0;
};
Ge.prototype._endoWnafMulAdd = function(n, o, s) {
  for (var m = this._endoWnafT1, f = this._endoWnafT2, g = 0; g < n.length; g++) {
    var y = this._endoSplit(o[g]), S = n[g], B = S._getBeta();
    y.k1.negative && (y.k1.ineg(), S = S.neg(!0)), y.k2.negative && (y.k2.ineg(), B = B.neg(!0)), m[g * 2] = S, m[g * 2 + 1] = B, f[g * 2] = y.k1, f[g * 2 + 1] = y.k2;
  }
  for (var M = this._wnafMulAdd(1, m, f, g * 2, s), x = 0; x < g * 2; x++)
    m[x] = null, f[x] = null;
  return M;
};
function Ee(a, n, o, s) {
  xi.BasePoint.call(this, a, "affine"), n === null && o === null ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new be(n, 16), this.y = new be(o, 16), s && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
}
V0(Ee, xi.BasePoint);
Ge.prototype.point = function(n, o, s) {
  return new Ee(this, n, o, s);
};
Ge.prototype.pointFromJSON = function(n, o) {
  return Ee.fromJSON(this, n, o);
};
Ee.prototype._getBeta = function() {
  if (this.curve.endo) {
    var n = this.precomputed;
    if (n && n.beta)
      return n.beta;
    var o = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (n) {
      var s = this.curve, m = function(f) {
        return s.point(f.x.redMul(s.endo.beta), f.y);
      };
      n.beta = o, o.precomputed = {
        beta: null,
        naf: n.naf && {
          wnd: n.naf.wnd,
          points: n.naf.points.map(m)
        },
        doubles: n.doubles && {
          step: n.doubles.step,
          points: n.doubles.points.map(m)
        }
      };
    }
    return o;
  }
};
Ee.prototype.toJSON = function() {
  return this.precomputed ? [this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1)
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1)
    }
  }] : [this.x, this.y];
};
Ee.fromJSON = function(n, o, s) {
  typeof o == "string" && (o = JSON.parse(o));
  var m = n.point(o[0], o[1], s);
  if (!o[2])
    return m;
  function f(y) {
    return n.point(y[0], y[1], s);
  }
  var g = o[2];
  return m.precomputed = {
    beta: null,
    doubles: g.doubles && {
      step: g.doubles.step,
      points: [m].concat(g.doubles.points.map(f))
    },
    naf: g.naf && {
      wnd: g.naf.wnd,
      points: [m].concat(g.naf.points.map(f))
    }
  }, m;
};
Ee.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
};
Ee.prototype.isInfinity = function() {
  return this.inf;
};
Ee.prototype.add = function(n) {
  if (this.inf)
    return n;
  if (n.inf)
    return this;
  if (this.eq(n))
    return this.dbl();
  if (this.neg().eq(n))
    return this.curve.point(null, null);
  if (this.x.cmp(n.x) === 0)
    return this.curve.point(null, null);
  var o = this.y.redSub(n.y);
  o.cmpn(0) !== 0 && (o = o.redMul(this.x.redSub(n.x).redInvm()));
  var s = o.redSqr().redISub(this.x).redISub(n.x), m = o.redMul(this.x.redSub(s)).redISub(this.y);
  return this.curve.point(s, m);
};
Ee.prototype.dbl = function() {
  if (this.inf)
    return this;
  var n = this.y.redAdd(this.y);
  if (n.cmpn(0) === 0)
    return this.curve.point(null, null);
  var o = this.curve.a, s = this.x.redSqr(), m = n.redInvm(), f = s.redAdd(s).redIAdd(s).redIAdd(o).redMul(m), g = f.redSqr().redISub(this.x.redAdd(this.x)), y = f.redMul(this.x.redSub(g)).redISub(this.y);
  return this.curve.point(g, y);
};
Ee.prototype.getX = function() {
  return this.x.fromRed();
};
Ee.prototype.getY = function() {
  return this.y.fromRed();
};
Ee.prototype.mul = function(n) {
  return n = new be(n, 16), this.isInfinity() ? this : this._hasDoubles(n) ? this.curve._fixedNafMul(this, n) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [n]) : this.curve._wnafMul(this, n);
};
Ee.prototype.mulAdd = function(n, o, s) {
  var m = [this, o], f = [n, s];
  return this.curve.endo ? this.curve._endoWnafMulAdd(m, f) : this.curve._wnafMulAdd(1, m, f, 2);
};
Ee.prototype.jmulAdd = function(n, o, s) {
  var m = [this, o], f = [n, s];
  return this.curve.endo ? this.curve._endoWnafMulAdd(m, f, !0) : this.curve._wnafMulAdd(1, m, f, 2, !0);
};
Ee.prototype.eq = function(n) {
  return this === n || this.inf === n.inf && (this.inf || this.x.cmp(n.x) === 0 && this.y.cmp(n.y) === 0);
};
Ee.prototype.neg = function(n) {
  if (this.inf)
    return this;
  var o = this.curve.point(this.x, this.y.redNeg());
  if (n && this.precomputed) {
    var s = this.precomputed, m = function(f) {
      return f.neg();
    };
    o.precomputed = {
      naf: s.naf && {
        wnd: s.naf.wnd,
        points: s.naf.points.map(m)
      },
      doubles: s.doubles && {
        step: s.doubles.step,
        points: s.doubles.points.map(m)
      }
    };
  }
  return o;
};
Ee.prototype.toJ = function() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);
  var n = this.curve.jpoint(this.x, this.y, this.curve.one);
  return n;
};
function ke(a, n, o, s) {
  xi.BasePoint.call(this, a, "jacobian"), n === null && o === null && s === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new be(0)) : (this.x = new be(n, 16), this.y = new be(o, 16), this.z = new be(s, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
}
V0(ke, xi.BasePoint);
Ge.prototype.jpoint = function(n, o, s) {
  return new ke(this, n, o, s);
};
ke.prototype.toP = function() {
  if (this.isInfinity())
    return this.curve.point(null, null);
  var n = this.z.redInvm(), o = n.redSqr(), s = this.x.redMul(o), m = this.y.redMul(o).redMul(n);
  return this.curve.point(s, m);
};
ke.prototype.neg = function() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
ke.prototype.add = function(n) {
  if (this.isInfinity())
    return n;
  if (n.isInfinity())
    return this;
  var o = n.z.redSqr(), s = this.z.redSqr(), m = this.x.redMul(o), f = n.x.redMul(s), g = this.y.redMul(o.redMul(n.z)), y = n.y.redMul(s.redMul(this.z)), S = m.redSub(f), B = g.redSub(y);
  if (S.cmpn(0) === 0)
    return B.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var M = S.redSqr(), x = M.redMul(S), I = m.redMul(M), k = B.redSqr().redIAdd(x).redISub(I).redISub(I), D = B.redMul(I.redISub(k)).redISub(g.redMul(x)), U = this.z.redMul(n.z).redMul(S);
  return this.curve.jpoint(k, D, U);
};
ke.prototype.mixedAdd = function(n) {
  if (this.isInfinity())
    return n.toJ();
  if (n.isInfinity())
    return this;
  var o = this.z.redSqr(), s = this.x, m = n.x.redMul(o), f = this.y, g = n.y.redMul(o).redMul(this.z), y = s.redSub(m), S = f.redSub(g);
  if (y.cmpn(0) === 0)
    return S.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var B = y.redSqr(), M = B.redMul(y), x = s.redMul(B), I = S.redSqr().redIAdd(M).redISub(x).redISub(x), k = S.redMul(x.redISub(I)).redISub(f.redMul(M)), D = this.z.redMul(y);
  return this.curve.jpoint(I, k, D);
};
ke.prototype.dblp = function(n) {
  if (n === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!n)
    return this.dbl();
  var o;
  if (this.curve.zeroA || this.curve.threeA) {
    var s = this;
    for (o = 0; o < n; o++)
      s = s.dbl();
    return s;
  }
  var m = this.curve.a, f = this.curve.tinv, g = this.x, y = this.y, S = this.z, B = S.redSqr().redSqr(), M = y.redAdd(y);
  for (o = 0; o < n; o++) {
    var x = g.redSqr(), I = M.redSqr(), k = I.redSqr(), D = x.redAdd(x).redIAdd(x).redIAdd(m.redMul(B)), U = g.redMul(I), W = D.redSqr().redISub(U.redAdd(U)), z = U.redISub(W), $ = D.redMul(z);
    $ = $.redIAdd($).redISub(k);
    var lt = M.redMul(S);
    o + 1 < n && (B = B.redMul(k)), g = W, S = lt, M = $;
  }
  return this.curve.jpoint(g, M.redMul(f), S);
};
ke.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
};
ke.prototype._zeroDbl = function() {
  var n, o, s;
  if (this.zOne) {
    var m = this.x.redSqr(), f = this.y.redSqr(), g = f.redSqr(), y = this.x.redAdd(f).redSqr().redISub(m).redISub(g);
    y = y.redIAdd(y);
    var S = m.redAdd(m).redIAdd(m), B = S.redSqr().redISub(y).redISub(y), M = g.redIAdd(g);
    M = M.redIAdd(M), M = M.redIAdd(M), n = B, o = S.redMul(y.redISub(B)).redISub(M), s = this.y.redAdd(this.y);
  } else {
    var x = this.x.redSqr(), I = this.y.redSqr(), k = I.redSqr(), D = this.x.redAdd(I).redSqr().redISub(x).redISub(k);
    D = D.redIAdd(D);
    var U = x.redAdd(x).redIAdd(x), W = U.redSqr(), z = k.redIAdd(k);
    z = z.redIAdd(z), z = z.redIAdd(z), n = W.redISub(D).redISub(D), o = U.redMul(D.redISub(n)).redISub(z), s = this.y.redMul(this.z), s = s.redIAdd(s);
  }
  return this.curve.jpoint(n, o, s);
};
ke.prototype._threeDbl = function() {
  var n, o, s;
  if (this.zOne) {
    var m = this.x.redSqr(), f = this.y.redSqr(), g = f.redSqr(), y = this.x.redAdd(f).redSqr().redISub(m).redISub(g);
    y = y.redIAdd(y);
    var S = m.redAdd(m).redIAdd(m).redIAdd(this.curve.a), B = S.redSqr().redISub(y).redISub(y);
    n = B;
    var M = g.redIAdd(g);
    M = M.redIAdd(M), M = M.redIAdd(M), o = S.redMul(y.redISub(B)).redISub(M), s = this.y.redAdd(this.y);
  } else {
    var x = this.z.redSqr(), I = this.y.redSqr(), k = this.x.redMul(I), D = this.x.redSub(x).redMul(this.x.redAdd(x));
    D = D.redAdd(D).redIAdd(D);
    var U = k.redIAdd(k);
    U = U.redIAdd(U);
    var W = U.redAdd(U);
    n = D.redSqr().redISub(W), s = this.y.redAdd(this.z).redSqr().redISub(I).redISub(x);
    var z = I.redSqr();
    z = z.redIAdd(z), z = z.redIAdd(z), z = z.redIAdd(z), o = D.redMul(U.redISub(n)).redISub(z);
  }
  return this.curve.jpoint(n, o, s);
};
ke.prototype._dbl = function() {
  var n = this.curve.a, o = this.x, s = this.y, m = this.z, f = m.redSqr().redSqr(), g = o.redSqr(), y = s.redSqr(), S = g.redAdd(g).redIAdd(g).redIAdd(n.redMul(f)), B = o.redAdd(o);
  B = B.redIAdd(B);
  var M = B.redMul(y), x = S.redSqr().redISub(M.redAdd(M)), I = M.redISub(x), k = y.redSqr();
  k = k.redIAdd(k), k = k.redIAdd(k), k = k.redIAdd(k);
  var D = S.redMul(I).redISub(k), U = s.redAdd(s).redMul(m);
  return this.curve.jpoint(x, D, U);
};
ke.prototype.trpl = function() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);
  var n = this.x.redSqr(), o = this.y.redSqr(), s = this.z.redSqr(), m = o.redSqr(), f = n.redAdd(n).redIAdd(n), g = f.redSqr(), y = this.x.redAdd(o).redSqr().redISub(n).redISub(m);
  y = y.redIAdd(y), y = y.redAdd(y).redIAdd(y), y = y.redISub(g);
  var S = y.redSqr(), B = m.redIAdd(m);
  B = B.redIAdd(B), B = B.redIAdd(B), B = B.redIAdd(B);
  var M = f.redIAdd(y).redSqr().redISub(g).redISub(S).redISub(B), x = o.redMul(M);
  x = x.redIAdd(x), x = x.redIAdd(x);
  var I = this.x.redMul(S).redISub(x);
  I = I.redIAdd(I), I = I.redIAdd(I);
  var k = this.y.redMul(M.redMul(B.redISub(M)).redISub(y.redMul(S)));
  k = k.redIAdd(k), k = k.redIAdd(k), k = k.redIAdd(k);
  var D = this.z.redAdd(y).redSqr().redISub(s).redISub(S);
  return this.curve.jpoint(I, k, D);
};
ke.prototype.mul = function(n, o) {
  return n = new be(n, o), this.curve._wnafMul(this, n);
};
ke.prototype.eq = function(n) {
  if (n.type === "affine")
    return this.eq(n.toJ());
  if (this === n)
    return !0;
  var o = this.z.redSqr(), s = n.z.redSqr();
  if (this.x.redMul(s).redISub(n.x.redMul(o)).cmpn(0) !== 0)
    return !1;
  var m = o.redMul(this.z), f = s.redMul(n.z);
  return this.y.redMul(f).redISub(n.y.redMul(m)).cmpn(0) === 0;
};
ke.prototype.eqXToP = function(n) {
  var o = this.z.redSqr(), s = n.toRed(this.curve.red).redMul(o);
  if (this.x.cmp(s) === 0)
    return !0;
  for (var m = n.clone(), f = this.curve.redN.redMul(o); ; ) {
    if (m.iadd(this.curve.n), m.cmp(this.curve.p) >= 0)
      return !1;
    if (s.redIAdd(f), this.x.cmp(s) === 0)
      return !0;
  }
};
ke.prototype.inspect = function() {
  return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
};
ke.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
var si = Tr, lo = Gt, ef = tf, ip = Ke;
function _i(a) {
  ef.call(this, "mont", a), this.a = new si(a.a, 16).toRed(this.red), this.b = new si(a.b, 16).toRed(this.red), this.i4 = new si(4).toRed(this.red).redInvm(), this.two = new si(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
lo(_i, ef);
var np = _i;
_i.prototype.validate = function(n) {
  var o = n.normalize().x, s = o.redSqr(), m = s.redMul(o).redAdd(s.redMul(this.a)).redAdd(o), f = m.redSqrt();
  return f.redSqr().cmp(m) === 0;
};
function Ae(a, n, o) {
  ef.BasePoint.call(this, a, "projective"), n === null && o === null ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new si(n, 16), this.z = new si(o, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
}
lo(Ae, ef.BasePoint);
_i.prototype.decodePoint = function(n, o) {
  return this.point(ip.toArray(n, o), 1);
};
_i.prototype.point = function(n, o) {
  return new Ae(this, n, o);
};
_i.prototype.pointFromJSON = function(n) {
  return Ae.fromJSON(this, n);
};
Ae.prototype.precompute = function() {
};
Ae.prototype._encode = function() {
  return this.getX().toArray("be", this.curve.p.byteLength());
};
Ae.fromJSON = function(n, o) {
  return new Ae(n, o[0], o[1] || n.one);
};
Ae.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
Ae.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
Ae.prototype.dbl = function() {
  var n = this.x.redAdd(this.z), o = n.redSqr(), s = this.x.redSub(this.z), m = s.redSqr(), f = o.redSub(m), g = o.redMul(m), y = f.redMul(m.redAdd(this.curve.a24.redMul(f)));
  return this.curve.point(g, y);
};
Ae.prototype.add = function() {
  throw new Error("Not supported on Montgomery curve");
};
Ae.prototype.diffAdd = function(n, o) {
  var s = this.x.redAdd(this.z), m = this.x.redSub(this.z), f = n.x.redAdd(n.z), g = n.x.redSub(n.z), y = g.redMul(s), S = f.redMul(m), B = o.z.redMul(y.redAdd(S).redSqr()), M = o.x.redMul(y.redISub(S).redSqr());
  return this.curve.point(B, M);
};
Ae.prototype.mul = function(n) {
  for (var o = n.clone(), s = this, m = this.curve.point(null, null), f = this, g = []; o.cmpn(0) !== 0; o.iushrn(1))
    g.push(o.andln(1));
  for (var y = g.length - 1; y >= 0; y--)
    g[y] === 0 ? (s = s.diffAdd(m, f), m = m.dbl()) : (m = s.diffAdd(m, f), s = s.dbl());
  return m;
};
Ae.prototype.mulAdd = function() {
  throw new Error("Not supported on Montgomery curve");
};
Ae.prototype.jumlAdd = function() {
  throw new Error("Not supported on Montgomery curve");
};
Ae.prototype.eq = function(n) {
  return this.getX().cmp(n.getX()) === 0;
};
Ae.prototype.normalize = function() {
  return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
};
Ae.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
};
var fp = Ke, Sr = Tr, co = Gt, rf = tf, ap = fp.assert;
function yr(a) {
  this.twisted = (a.a | 0) !== 1, this.mOneA = this.twisted && (a.a | 0) === -1, this.extended = this.mOneA, rf.call(this, "edwards", a), this.a = new Sr(a.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new Sr(a.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new Sr(a.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), ap(!this.twisted || this.c.fromRed().cmpn(1) === 0), this.oneC = (a.c | 0) === 1;
}
co(yr, rf);
var hp = yr;
yr.prototype._mulA = function(n) {
  return this.mOneA ? n.redNeg() : this.a.redMul(n);
};
yr.prototype._mulC = function(n) {
  return this.oneC ? n : this.c.redMul(n);
};
yr.prototype.jpoint = function(n, o, s, m) {
  return this.point(n, o, s, m);
};
yr.prototype.pointFromX = function(n, o) {
  n = new Sr(n, 16), n.red || (n = n.toRed(this.red));
  var s = n.redSqr(), m = this.c2.redSub(this.a.redMul(s)), f = this.one.redSub(this.c2.redMul(this.d).redMul(s)), g = m.redMul(f.redInvm()), y = g.redSqrt();
  if (y.redSqr().redSub(g).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var S = y.fromRed().isOdd();
  return (o && !S || !o && S) && (y = y.redNeg()), this.point(n, y);
};
yr.prototype.pointFromY = function(n, o) {
  n = new Sr(n, 16), n.red || (n = n.toRed(this.red));
  var s = n.redSqr(), m = s.redSub(this.c2), f = s.redMul(this.d).redMul(this.c2).redSub(this.a), g = m.redMul(f.redInvm());
  if (g.cmp(this.zero) === 0) {
    if (o)
      throw new Error("invalid point");
    return this.point(this.zero, n);
  }
  var y = g.redSqrt();
  if (y.redSqr().redSub(g).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  return y.fromRed().isOdd() !== o && (y = y.redNeg()), this.point(y, n);
};
yr.prototype.validate = function(n) {
  if (n.isInfinity())
    return !0;
  n.normalize();
  var o = n.x.redSqr(), s = n.y.redSqr(), m = o.redMul(this.a).redAdd(s), f = this.c2.redMul(this.one.redAdd(this.d.redMul(o).redMul(s)));
  return m.cmp(f) === 0;
};
function ge(a, n, o, s, m) {
  rf.BasePoint.call(this, a, "projective"), n === null && o === null && s === null ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new Sr(n, 16), this.y = new Sr(o, 16), this.z = s ? new Sr(s, 16) : this.curve.one, this.t = m && new Sr(m, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
}
co(ge, rf.BasePoint);
yr.prototype.pointFromJSON = function(n) {
  return ge.fromJSON(this, n);
};
yr.prototype.point = function(n, o, s, m) {
  return new ge(this, n, o, s, m);
};
ge.fromJSON = function(n, o) {
  return new ge(n, o[0], o[1], o[2]);
};
ge.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
ge.prototype.isInfinity = function() {
  return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
};
ge.prototype._extDbl = function() {
  var n = this.x.redSqr(), o = this.y.redSqr(), s = this.z.redSqr();
  s = s.redIAdd(s);
  var m = this.curve._mulA(n), f = this.x.redAdd(this.y).redSqr().redISub(n).redISub(o), g = m.redAdd(o), y = g.redSub(s), S = m.redSub(o), B = f.redMul(y), M = g.redMul(S), x = f.redMul(S), I = y.redMul(g);
  return this.curve.point(B, M, I, x);
};
ge.prototype._projDbl = function() {
  var n = this.x.redAdd(this.y).redSqr(), o = this.x.redSqr(), s = this.y.redSqr(), m, f, g, y, S, B;
  if (this.curve.twisted) {
    y = this.curve._mulA(o);
    var M = y.redAdd(s);
    this.zOne ? (m = n.redSub(o).redSub(s).redMul(M.redSub(this.curve.two)), f = M.redMul(y.redSub(s)), g = M.redSqr().redSub(M).redSub(M)) : (S = this.z.redSqr(), B = M.redSub(S).redISub(S), m = n.redSub(o).redISub(s).redMul(B), f = M.redMul(y.redSub(s)), g = M.redMul(B));
  } else
    y = o.redAdd(s), S = this.curve._mulC(this.z).redSqr(), B = y.redSub(S).redSub(S), m = this.curve._mulC(n.redISub(y)).redMul(B), f = this.curve._mulC(y).redMul(o.redISub(s)), g = y.redMul(B);
  return this.curve.point(m, f, g);
};
ge.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
};
ge.prototype._extAdd = function(n) {
  var o = this.y.redSub(this.x).redMul(n.y.redSub(n.x)), s = this.y.redAdd(this.x).redMul(n.y.redAdd(n.x)), m = this.t.redMul(this.curve.dd).redMul(n.t), f = this.z.redMul(n.z.redAdd(n.z)), g = s.redSub(o), y = f.redSub(m), S = f.redAdd(m), B = s.redAdd(o), M = g.redMul(y), x = S.redMul(B), I = g.redMul(B), k = y.redMul(S);
  return this.curve.point(M, x, k, I);
};
ge.prototype._projAdd = function(n) {
  var o = this.z.redMul(n.z), s = o.redSqr(), m = this.x.redMul(n.x), f = this.y.redMul(n.y), g = this.curve.d.redMul(m).redMul(f), y = s.redSub(g), S = s.redAdd(g), B = this.x.redAdd(this.y).redMul(n.x.redAdd(n.y)).redISub(m).redISub(f), M = o.redMul(y).redMul(B), x, I;
  return this.curve.twisted ? (x = o.redMul(S).redMul(f.redSub(this.curve._mulA(m))), I = y.redMul(S)) : (x = o.redMul(S).redMul(f.redSub(m)), I = this.curve._mulC(y).redMul(S)), this.curve.point(M, x, I);
};
ge.prototype.add = function(n) {
  return this.isInfinity() ? n : n.isInfinity() ? this : this.curve.extended ? this._extAdd(n) : this._projAdd(n);
};
ge.prototype.mul = function(n) {
  return this._hasDoubles(n) ? this.curve._fixedNafMul(this, n) : this.curve._wnafMul(this, n);
};
ge.prototype.mulAdd = function(n, o, s) {
  return this.curve._wnafMulAdd(1, [this, o], [n, s], 2, !1);
};
ge.prototype.jmulAdd = function(n, o, s) {
  return this.curve._wnafMulAdd(1, [this, o], [n, s], 2, !0);
};
ge.prototype.normalize = function() {
  if (this.zOne)
    return this;
  var n = this.z.redInvm();
  return this.x = this.x.redMul(n), this.y = this.y.redMul(n), this.t && (this.t = this.t.redMul(n)), this.z = this.curve.one, this.zOne = !0, this;
};
ge.prototype.neg = function() {
  return this.curve.point(
    this.x.redNeg(),
    this.y,
    this.z,
    this.t && this.t.redNeg()
  );
};
ge.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
};
ge.prototype.getY = function() {
  return this.normalize(), this.y.fromRed();
};
ge.prototype.eq = function(n) {
  return this === n || this.getX().cmp(n.getX()) === 0 && this.getY().cmp(n.getY()) === 0;
};
ge.prototype.eqXToP = function(n) {
  var o = n.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(o) === 0)
    return !0;
  for (var s = n.clone(), m = this.curve.redN.redMul(this.z); ; ) {
    if (s.iadd(this.curve.n), s.cmp(this.curve.p) >= 0)
      return !1;
    if (o.redIAdd(m), this.x.cmp(o) === 0)
      return !0;
  }
};
ge.prototype.toP = ge.prototype.normalize;
ge.prototype.mixedAdd = ge.prototype.add;
(function(a) {
  var n = a;
  n.base = tf, n.short = rp, n.mont = np, n.edwards = hp;
})(W0);
var nf = {}, ff = {}, jt = {}, sp = Ve, op = Gt;
jt.inherits = op;
function up(a, n) {
  return (a.charCodeAt(n) & 64512) !== 55296 || n < 0 || n + 1 >= a.length ? !1 : (a.charCodeAt(n + 1) & 64512) === 56320;
}
function lp(a, n) {
  if (Array.isArray(a))
    return a.slice();
  if (!a)
    return [];
  var o = [];
  if (typeof a == "string")
    if (n) {
      if (n === "hex")
        for (a = a.replace(/[^a-z0-9]+/ig, ""), a.length % 2 !== 0 && (a = "0" + a), m = 0; m < a.length; m += 2)
          o.push(parseInt(a[m] + a[m + 1], 16));
    } else
      for (var s = 0, m = 0; m < a.length; m++) {
        var f = a.charCodeAt(m);
        f < 128 ? o[s++] = f : f < 2048 ? (o[s++] = f >> 6 | 192, o[s++] = f & 63 | 128) : up(a, m) ? (f = 65536 + ((f & 1023) << 10) + (a.charCodeAt(++m) & 1023), o[s++] = f >> 18 | 240, o[s++] = f >> 12 & 63 | 128, o[s++] = f >> 6 & 63 | 128, o[s++] = f & 63 | 128) : (o[s++] = f >> 12 | 224, o[s++] = f >> 6 & 63 | 128, o[s++] = f & 63 | 128);
      }
  else
    for (m = 0; m < a.length; m++)
      o[m] = a[m] | 0;
  return o;
}
jt.toArray = lp;
function dp(a) {
  for (var n = "", o = 0; o < a.length; o++)
    n += po(a[o].toString(16));
  return n;
}
jt.toHex = dp;
function vo(a) {
  var n = a >>> 24 | a >>> 8 & 65280 | a << 8 & 16711680 | (a & 255) << 24;
  return n >>> 0;
}
jt.htonl = vo;
function cp(a, n) {
  for (var o = "", s = 0; s < a.length; s++) {
    var m = a[s];
    n === "little" && (m = vo(m)), o += mo(m.toString(16));
  }
  return o;
}
jt.toHex32 = cp;
function po(a) {
  return a.length === 1 ? "0" + a : a;
}
jt.zero2 = po;
function mo(a) {
  return a.length === 7 ? "0" + a : a.length === 6 ? "00" + a : a.length === 5 ? "000" + a : a.length === 4 ? "0000" + a : a.length === 3 ? "00000" + a : a.length === 2 ? "000000" + a : a.length === 1 ? "0000000" + a : a;
}
jt.zero8 = mo;
function vp(a, n, o, s) {
  var m = o - n;
  sp(m % 4 === 0);
  for (var f = new Array(m / 4), g = 0, y = n; g < f.length; g++, y += 4) {
    var S;
    s === "big" ? S = a[y] << 24 | a[y + 1] << 16 | a[y + 2] << 8 | a[y + 3] : S = a[y + 3] << 24 | a[y + 2] << 16 | a[y + 1] << 8 | a[y], f[g] = S >>> 0;
  }
  return f;
}
jt.join32 = vp;
function pp(a, n) {
  for (var o = new Array(a.length * 4), s = 0, m = 0; s < a.length; s++, m += 4) {
    var f = a[s];
    n === "big" ? (o[m] = f >>> 24, o[m + 1] = f >>> 16 & 255, o[m + 2] = f >>> 8 & 255, o[m + 3] = f & 255) : (o[m + 3] = f >>> 24, o[m + 2] = f >>> 16 & 255, o[m + 1] = f >>> 8 & 255, o[m] = f & 255);
  }
  return o;
}
jt.split32 = pp;
function mp(a, n) {
  return a >>> n | a << 32 - n;
}
jt.rotr32 = mp;
function gp(a, n) {
  return a << n | a >>> 32 - n;
}
jt.rotl32 = gp;
function bp(a, n) {
  return a + n >>> 0;
}
jt.sum32 = bp;
function yp(a, n, o) {
  return a + n + o >>> 0;
}
jt.sum32_3 = yp;
function wp(a, n, o, s) {
  return a + n + o + s >>> 0;
}
jt.sum32_4 = wp;
function Mp(a, n, o, s, m) {
  return a + n + o + s + m >>> 0;
}
jt.sum32_5 = Mp;
function xp(a, n, o, s) {
  var m = a[n], f = a[n + 1], g = s + f >>> 0, y = (g < s ? 1 : 0) + o + m;
  a[n] = y >>> 0, a[n + 1] = g;
}
jt.sum64 = xp;
function _p(a, n, o, s) {
  var m = n + s >>> 0, f = (m < n ? 1 : 0) + a + o;
  return f >>> 0;
}
jt.sum64_hi = _p;
function Sp(a, n, o, s) {
  var m = n + s;
  return m >>> 0;
}
jt.sum64_lo = Sp;
function Ap(a, n, o, s, m, f, g, y) {
  var S = 0, B = n;
  B = B + s >>> 0, S += B < n ? 1 : 0, B = B + f >>> 0, S += B < f ? 1 : 0, B = B + y >>> 0, S += B < y ? 1 : 0;
  var M = a + o + m + g + S;
  return M >>> 0;
}
jt.sum64_4_hi = Ap;
function Bp(a, n, o, s, m, f, g, y) {
  var S = n + s + f + y;
  return S >>> 0;
}
jt.sum64_4_lo = Bp;
function Ep(a, n, o, s, m, f, g, y, S, B) {
  var M = 0, x = n;
  x = x + s >>> 0, M += x < n ? 1 : 0, x = x + f >>> 0, M += x < f ? 1 : 0, x = x + y >>> 0, M += x < y ? 1 : 0, x = x + B >>> 0, M += x < B ? 1 : 0;
  var I = a + o + m + g + S + M;
  return I >>> 0;
}
jt.sum64_5_hi = Ep;
function kp(a, n, o, s, m, f, g, y, S, B) {
  var M = n + s + f + y + B;
  return M >>> 0;
}
jt.sum64_5_lo = kp;
function Ip(a, n, o) {
  var s = n << 32 - o | a >>> o;
  return s >>> 0;
}
jt.rotr64_hi = Ip;
function Rp(a, n, o) {
  var s = a << 32 - o | n >>> o;
  return s >>> 0;
}
jt.rotr64_lo = Rp;
function Tp(a, n, o) {
  return a >>> o;
}
jt.shr64_hi = Tp;
function Cp(a, n, o) {
  var s = a << 32 - o | n >>> o;
  return s >>> 0;
}
jt.shr64_lo = Cp;
var Si = {}, $a = jt, Fp = Ve;
function af() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
Si.BlockHash = af;
af.prototype.update = function(n, o) {
  if (n = $a.toArray(n, o), this.pending ? this.pending = this.pending.concat(n) : this.pending = n, this.pendingTotal += n.length, this.pending.length >= this._delta8) {
    n = this.pending;
    var s = n.length % this._delta8;
    this.pending = n.slice(n.length - s, n.length), this.pending.length === 0 && (this.pending = null), n = $a.join32(n, 0, n.length - s, this.endian);
    for (var m = 0; m < n.length; m += this._delta32)
      this._update(n, m, m + this._delta32);
  }
  return this;
};
af.prototype.digest = function(n) {
  return this.update(this._pad()), Fp(this.pending === null), this._digest(n);
};
af.prototype._pad = function() {
  var n = this.pendingTotal, o = this._delta8, s = o - (n + this.padLength) % o, m = new Array(s + this.padLength);
  m[0] = 128;
  for (var f = 1; f < s; f++)
    m[f] = 0;
  if (n <<= 3, this.endian === "big") {
    for (var g = 8; g < this.padLength; g++)
      m[f++] = 0;
    m[f++] = 0, m[f++] = 0, m[f++] = 0, m[f++] = 0, m[f++] = n >>> 24 & 255, m[f++] = n >>> 16 & 255, m[f++] = n >>> 8 & 255, m[f++] = n & 255;
  } else
    for (m[f++] = n & 255, m[f++] = n >>> 8 & 255, m[f++] = n >>> 16 & 255, m[f++] = n >>> 24 & 255, m[f++] = 0, m[f++] = 0, m[f++] = 0, m[f++] = 0, g = 8; g < this.padLength; g++)
      m[f++] = 0;
  return m;
};
var Ai = {}, wr = {}, qp = jt, ur = qp.rotr32;
function Pp(a, n, o, s) {
  if (a === 0)
    return go(n, o, s);
  if (a === 1 || a === 3)
    return yo(n, o, s);
  if (a === 2)
    return bo(n, o, s);
}
wr.ft_1 = Pp;
function go(a, n, o) {
  return a & n ^ ~a & o;
}
wr.ch32 = go;
function bo(a, n, o) {
  return a & n ^ a & o ^ n & o;
}
wr.maj32 = bo;
function yo(a, n, o) {
  return a ^ n ^ o;
}
wr.p32 = yo;
function Dp(a) {
  return ur(a, 2) ^ ur(a, 13) ^ ur(a, 22);
}
wr.s0_256 = Dp;
function Np(a) {
  return ur(a, 6) ^ ur(a, 11) ^ ur(a, 25);
}
wr.s1_256 = Np;
function $p(a) {
  return ur(a, 7) ^ ur(a, 18) ^ a >>> 3;
}
wr.g0_256 = $p;
function Lp(a) {
  return ur(a, 17) ^ ur(a, 19) ^ a >>> 10;
}
wr.g1_256 = Lp;
var vi = jt, Up = Si, Op = wr, Cf = vi.rotl32, Di = vi.sum32, zp = vi.sum32_5, Kp = Op.ft_1, wo = Up.BlockHash, Hp = [
  1518500249,
  1859775393,
  2400959708,
  3395469782
];
function pr() {
  if (!(this instanceof pr))
    return new pr();
  wo.call(this), this.h = [
    1732584193,
    4023233417,
    2562383102,
    271733878,
    3285377520
  ], this.W = new Array(80);
}
vi.inherits(pr, wo);
var Zp = pr;
pr.blockSize = 512;
pr.outSize = 160;
pr.hmacStrength = 80;
pr.padLength = 64;
pr.prototype._update = function(n, o) {
  for (var s = this.W, m = 0; m < 16; m++)
    s[m] = n[o + m];
  for (; m < s.length; m++)
    s[m] = Cf(s[m - 3] ^ s[m - 8] ^ s[m - 14] ^ s[m - 16], 1);
  var f = this.h[0], g = this.h[1], y = this.h[2], S = this.h[3], B = this.h[4];
  for (m = 0; m < s.length; m++) {
    var M = ~~(m / 20), x = zp(Cf(f, 5), Kp(M, g, y, S), B, s[m], Hp[M]);
    B = S, S = y, y = Cf(g, 30), g = f, f = x;
  }
  this.h[0] = Di(this.h[0], f), this.h[1] = Di(this.h[1], g), this.h[2] = Di(this.h[2], y), this.h[3] = Di(this.h[3], S), this.h[4] = Di(this.h[4], B);
};
pr.prototype._digest = function(n) {
  return n === "hex" ? vi.toHex32(this.h, "big") : vi.split32(this.h, "big");
};
var pi = jt, Wp = Si, Bi = wr, Vp = Ve, je = pi.sum32, Yp = pi.sum32_4, Jp = pi.sum32_5, Gp = Bi.ch32, Xp = Bi.maj32, jp = Bi.s0_256, Qp = Bi.s1_256, tm = Bi.g0_256, em = Bi.g1_256, Mo = Wp.BlockHash, rm = [
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
];
function mr() {
  if (!(this instanceof mr))
    return new mr();
  Mo.call(this), this.h = [
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ], this.k = rm, this.W = new Array(64);
}
pi.inherits(mr, Mo);
var xo = mr;
mr.blockSize = 512;
mr.outSize = 256;
mr.hmacStrength = 192;
mr.padLength = 64;
mr.prototype._update = function(n, o) {
  for (var s = this.W, m = 0; m < 16; m++)
    s[m] = n[o + m];
  for (; m < s.length; m++)
    s[m] = Yp(em(s[m - 2]), s[m - 7], tm(s[m - 15]), s[m - 16]);
  var f = this.h[0], g = this.h[1], y = this.h[2], S = this.h[3], B = this.h[4], M = this.h[5], x = this.h[6], I = this.h[7];
  for (Vp(this.k.length === s.length), m = 0; m < s.length; m++) {
    var k = Jp(I, Qp(B), Gp(B, M, x), this.k[m], s[m]), D = je(jp(f), Xp(f, g, y));
    I = x, x = M, M = B, B = je(S, k), S = y, y = g, g = f, f = je(k, D);
  }
  this.h[0] = je(this.h[0], f), this.h[1] = je(this.h[1], g), this.h[2] = je(this.h[2], y), this.h[3] = je(this.h[3], S), this.h[4] = je(this.h[4], B), this.h[5] = je(this.h[5], M), this.h[6] = je(this.h[6], x), this.h[7] = je(this.h[7], I);
};
mr.prototype._digest = function(n) {
  return n === "hex" ? pi.toHex32(this.h, "big") : pi.split32(this.h, "big");
};
var v0 = jt, _o = xo;
function kr() {
  if (!(this instanceof kr))
    return new kr();
  _o.call(this), this.h = [
    3238371032,
    914150663,
    812702999,
    4144912697,
    4290775857,
    1750603025,
    1694076839,
    3204075428
  ];
}
v0.inherits(kr, _o);
var im = kr;
kr.blockSize = 512;
kr.outSize = 224;
kr.hmacStrength = 192;
kr.padLength = 64;
kr.prototype._digest = function(n) {
  return n === "hex" ? v0.toHex32(this.h.slice(0, 7), "big") : v0.split32(this.h.slice(0, 7), "big");
};
var $e = jt, nm = Si, fm = Ve, lr = $e.rotr64_hi, dr = $e.rotr64_lo, So = $e.shr64_hi, Ao = $e.shr64_lo, Cr = $e.sum64, Ff = $e.sum64_hi, qf = $e.sum64_lo, am = $e.sum64_4_hi, hm = $e.sum64_4_lo, sm = $e.sum64_5_hi, om = $e.sum64_5_lo, Bo = nm.BlockHash, um = [
  1116352408,
  3609767458,
  1899447441,
  602891725,
  3049323471,
  3964484399,
  3921009573,
  2173295548,
  961987163,
  4081628472,
  1508970993,
  3053834265,
  2453635748,
  2937671579,
  2870763221,
  3664609560,
  3624381080,
  2734883394,
  310598401,
  1164996542,
  607225278,
  1323610764,
  1426881987,
  3590304994,
  1925078388,
  4068182383,
  2162078206,
  991336113,
  2614888103,
  633803317,
  3248222580,
  3479774868,
  3835390401,
  2666613458,
  4022224774,
  944711139,
  264347078,
  2341262773,
  604807628,
  2007800933,
  770255983,
  1495990901,
  1249150122,
  1856431235,
  1555081692,
  3175218132,
  1996064986,
  2198950837,
  2554220882,
  3999719339,
  2821834349,
  766784016,
  2952996808,
  2566594879,
  3210313671,
  3203337956,
  3336571891,
  1034457026,
  3584528711,
  2466948901,
  113926993,
  3758326383,
  338241895,
  168717936,
  666307205,
  1188179964,
  773529912,
  1546045734,
  1294757372,
  1522805485,
  1396182291,
  2643833823,
  1695183700,
  2343527390,
  1986661051,
  1014477480,
  2177026350,
  1206759142,
  2456956037,
  344077627,
  2730485921,
  1290863460,
  2820302411,
  3158454273,
  3259730800,
  3505952657,
  3345764771,
  106217008,
  3516065817,
  3606008344,
  3600352804,
  1432725776,
  4094571909,
  1467031594,
  275423344,
  851169720,
  430227734,
  3100823752,
  506948616,
  1363258195,
  659060556,
  3750685593,
  883997877,
  3785050280,
  958139571,
  3318307427,
  1322822218,
  3812723403,
  1537002063,
  2003034995,
  1747873779,
  3602036899,
  1955562222,
  1575990012,
  2024104815,
  1125592928,
  2227730452,
  2716904306,
  2361852424,
  442776044,
  2428436474,
  593698344,
  2756734187,
  3733110249,
  3204031479,
  2999351573,
  3329325298,
  3815920427,
  3391569614,
  3928383900,
  3515267271,
  566280711,
  3940187606,
  3454069534,
  4118630271,
  4000239992,
  116418474,
  1914138554,
  174292421,
  2731055270,
  289380356,
  3203993006,
  460393269,
  320620315,
  685471733,
  587496836,
  852142971,
  1086792851,
  1017036298,
  365543100,
  1126000580,
  2618297676,
  1288033470,
  3409855158,
  1501505948,
  4234509866,
  1607167915,
  987167468,
  1816402316,
  1246189591
];
function er() {
  if (!(this instanceof er))
    return new er();
  Bo.call(this), this.h = [
    1779033703,
    4089235720,
    3144134277,
    2227873595,
    1013904242,
    4271175723,
    2773480762,
    1595750129,
    1359893119,
    2917565137,
    2600822924,
    725511199,
    528734635,
    4215389547,
    1541459225,
    327033209
  ], this.k = um, this.W = new Array(160);
}
$e.inherits(er, Bo);
var Eo = er;
er.blockSize = 1024;
er.outSize = 512;
er.hmacStrength = 192;
er.padLength = 128;
er.prototype._prepareBlock = function(n, o) {
  for (var s = this.W, m = 0; m < 32; m++)
    s[m] = n[o + m];
  for (; m < s.length; m += 2) {
    var f = Mm(s[m - 4], s[m - 3]), g = xm(s[m - 4], s[m - 3]), y = s[m - 14], S = s[m - 13], B = ym(s[m - 30], s[m - 29]), M = wm(s[m - 30], s[m - 29]), x = s[m - 32], I = s[m - 31];
    s[m] = am(
      f,
      g,
      y,
      S,
      B,
      M,
      x,
      I
    ), s[m + 1] = hm(
      f,
      g,
      y,
      S,
      B,
      M,
      x,
      I
    );
  }
};
er.prototype._update = function(n, o) {
  this._prepareBlock(n, o);
  var s = this.W, m = this.h[0], f = this.h[1], g = this.h[2], y = this.h[3], S = this.h[4], B = this.h[5], M = this.h[6], x = this.h[7], I = this.h[8], k = this.h[9], D = this.h[10], U = this.h[11], W = this.h[12], z = this.h[13], $ = this.h[14], lt = this.h[15];
  fm(this.k.length === s.length);
  for (var H = 0; H < s.length; H += 2) {
    var At = $, Bt = lt, Ct = gm(I, k), Et = bm(I, k), Y = lm(I, k, D, U, W), It = dm(I, k, D, U, W, z), p = this.k[H], t = this.k[H + 1], r = s[H], i = s[H + 1], h = sm(
      At,
      Bt,
      Ct,
      Et,
      Y,
      It,
      p,
      t,
      r,
      i
    ), d = om(
      At,
      Bt,
      Ct,
      Et,
      Y,
      It,
      p,
      t,
      r,
      i
    );
    At = pm(m, f), Bt = mm(m, f), Ct = cm(m, f, g, y, S), Et = vm(m, f, g, y, S, B);
    var c = Ff(At, Bt, Ct, Et), v = qf(At, Bt, Ct, Et);
    $ = W, lt = z, W = D, z = U, D = I, U = k, I = Ff(M, x, h, d), k = qf(x, x, h, d), M = S, x = B, S = g, B = y, g = m, y = f, m = Ff(h, d, c, v), f = qf(h, d, c, v);
  }
  Cr(this.h, 0, m, f), Cr(this.h, 2, g, y), Cr(this.h, 4, S, B), Cr(this.h, 6, M, x), Cr(this.h, 8, I, k), Cr(this.h, 10, D, U), Cr(this.h, 12, W, z), Cr(this.h, 14, $, lt);
};
er.prototype._digest = function(n) {
  return n === "hex" ? $e.toHex32(this.h, "big") : $e.split32(this.h, "big");
};
function lm(a, n, o, s, m) {
  var f = a & o ^ ~a & m;
  return f < 0 && (f += 4294967296), f;
}
function dm(a, n, o, s, m, f) {
  var g = n & s ^ ~n & f;
  return g < 0 && (g += 4294967296), g;
}
function cm(a, n, o, s, m) {
  var f = a & o ^ a & m ^ o & m;
  return f < 0 && (f += 4294967296), f;
}
function vm(a, n, o, s, m, f) {
  var g = n & s ^ n & f ^ s & f;
  return g < 0 && (g += 4294967296), g;
}
function pm(a, n) {
  var o = lr(a, n, 28), s = lr(n, a, 2), m = lr(n, a, 7), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function mm(a, n) {
  var o = dr(a, n, 28), s = dr(n, a, 2), m = dr(n, a, 7), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function gm(a, n) {
  var o = lr(a, n, 14), s = lr(a, n, 18), m = lr(n, a, 9), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function bm(a, n) {
  var o = dr(a, n, 14), s = dr(a, n, 18), m = dr(n, a, 9), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function ym(a, n) {
  var o = lr(a, n, 1), s = lr(a, n, 8), m = So(a, n, 7), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function wm(a, n) {
  var o = dr(a, n, 1), s = dr(a, n, 8), m = Ao(a, n, 7), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function Mm(a, n) {
  var o = lr(a, n, 19), s = lr(n, a, 29), m = So(a, n, 6), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function xm(a, n) {
  var o = dr(a, n, 19), s = dr(n, a, 29), m = Ao(a, n, 6), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
var p0 = jt, ko = Eo;
function Ir() {
  if (!(this instanceof Ir))
    return new Ir();
  ko.call(this), this.h = [
    3418070365,
    3238371032,
    1654270250,
    914150663,
    2438529370,
    812702999,
    355462360,
    4144912697,
    1731405415,
    4290775857,
    2394180231,
    1750603025,
    3675008525,
    1694076839,
    1203062813,
    3204075428
  ];
}
p0.inherits(Ir, ko);
var _m = Ir;
Ir.blockSize = 1024;
Ir.outSize = 384;
Ir.hmacStrength = 192;
Ir.padLength = 128;
Ir.prototype._digest = function(n) {
  return n === "hex" ? p0.toHex32(this.h.slice(0, 12), "big") : p0.split32(this.h.slice(0, 12), "big");
};
Ai.sha1 = Zp;
Ai.sha224 = im;
Ai.sha256 = xo;
Ai.sha384 = _m;
Ai.sha512 = Eo;
var Io = {}, Qr = jt, Sm = Si, pn = Qr.rotl32, La = Qr.sum32, Ni = Qr.sum32_3, Ua = Qr.sum32_4, Ro = Sm.BlockHash;
function gr() {
  if (!(this instanceof gr))
    return new gr();
  Ro.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
}
Qr.inherits(gr, Ro);
Io.ripemd160 = gr;
gr.blockSize = 512;
gr.outSize = 160;
gr.hmacStrength = 192;
gr.padLength = 64;
gr.prototype._update = function(n, o) {
  for (var s = this.h[0], m = this.h[1], f = this.h[2], g = this.h[3], y = this.h[4], S = s, B = m, M = f, x = g, I = y, k = 0; k < 80; k++) {
    var D = La(
      pn(
        Ua(s, Oa(k, m, f, g), n[Em[k] + o], Am(k)),
        Im[k]
      ),
      y
    );
    s = y, y = g, g = pn(f, 10), f = m, m = D, D = La(
      pn(
        Ua(S, Oa(79 - k, B, M, x), n[km[k] + o], Bm(k)),
        Rm[k]
      ),
      I
    ), S = I, I = x, x = pn(M, 10), M = B, B = D;
  }
  D = Ni(this.h[1], f, x), this.h[1] = Ni(this.h[2], g, I), this.h[2] = Ni(this.h[3], y, S), this.h[3] = Ni(this.h[4], s, B), this.h[4] = Ni(this.h[0], m, M), this.h[0] = D;
};
gr.prototype._digest = function(n) {
  return n === "hex" ? Qr.toHex32(this.h, "little") : Qr.split32(this.h, "little");
};
function Oa(a, n, o, s) {
  return a <= 15 ? n ^ o ^ s : a <= 31 ? n & o | ~n & s : a <= 47 ? (n | ~o) ^ s : a <= 63 ? n & s | o & ~s : n ^ (o | ~s);
}
function Am(a) {
  return a <= 15 ? 0 : a <= 31 ? 1518500249 : a <= 47 ? 1859775393 : a <= 63 ? 2400959708 : 2840853838;
}
function Bm(a) {
  return a <= 15 ? 1352829926 : a <= 31 ? 1548603684 : a <= 47 ? 1836072691 : a <= 63 ? 2053994217 : 0;
}
var Em = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  7,
  4,
  13,
  1,
  10,
  6,
  15,
  3,
  12,
  0,
  9,
  5,
  2,
  14,
  11,
  8,
  3,
  10,
  14,
  4,
  9,
  15,
  8,
  1,
  2,
  7,
  0,
  6,
  13,
  11,
  5,
  12,
  1,
  9,
  11,
  10,
  0,
  8,
  12,
  4,
  13,
  3,
  7,
  15,
  14,
  5,
  6,
  2,
  4,
  0,
  5,
  9,
  7,
  12,
  2,
  10,
  14,
  1,
  3,
  8,
  11,
  6,
  15,
  13
], km = [
  5,
  14,
  7,
  0,
  9,
  2,
  11,
  4,
  13,
  6,
  15,
  8,
  1,
  10,
  3,
  12,
  6,
  11,
  3,
  7,
  0,
  13,
  5,
  10,
  14,
  15,
  8,
  12,
  4,
  9,
  1,
  2,
  15,
  5,
  1,
  3,
  7,
  14,
  6,
  9,
  11,
  8,
  12,
  2,
  10,
  0,
  4,
  13,
  8,
  6,
  4,
  1,
  3,
  11,
  15,
  0,
  5,
  12,
  2,
  13,
  9,
  7,
  10,
  14,
  12,
  15,
  10,
  4,
  1,
  5,
  8,
  7,
  6,
  2,
  13,
  14,
  0,
  3,
  9,
  11
], Im = [
  11,
  14,
  15,
  12,
  5,
  8,
  7,
  9,
  11,
  13,
  14,
  15,
  6,
  7,
  9,
  8,
  7,
  6,
  8,
  13,
  11,
  9,
  7,
  15,
  7,
  12,
  15,
  9,
  11,
  7,
  13,
  12,
  11,
  13,
  6,
  7,
  14,
  9,
  13,
  15,
  14,
  8,
  13,
  6,
  5,
  12,
  7,
  5,
  11,
  12,
  14,
  15,
  14,
  15,
  9,
  8,
  9,
  14,
  5,
  6,
  8,
  6,
  5,
  12,
  9,
  15,
  5,
  11,
  6,
  8,
  13,
  12,
  5,
  12,
  13,
  14,
  11,
  8,
  5,
  6
], Rm = [
  8,
  9,
  9,
  11,
  13,
  15,
  15,
  5,
  7,
  7,
  8,
  11,
  14,
  14,
  12,
  6,
  9,
  13,
  15,
  7,
  12,
  8,
  9,
  11,
  7,
  7,
  12,
  7,
  6,
  15,
  13,
  11,
  9,
  7,
  15,
  11,
  8,
  6,
  6,
  14,
  12,
  13,
  5,
  14,
  13,
  13,
  7,
  5,
  15,
  5,
  8,
  11,
  14,
  14,
  6,
  14,
  6,
  9,
  12,
  9,
  12,
  5,
  15,
  8,
  8,
  5,
  12,
  9,
  12,
  5,
  14,
  6,
  8,
  13,
  6,
  5,
  15,
  13,
  11,
  11
], Tm = jt, Cm = Ve;
function mi(a, n, o) {
  if (!(this instanceof mi))
    return new mi(a, n, o);
  this.Hash = a, this.blockSize = a.blockSize / 8, this.outSize = a.outSize / 8, this.inner = null, this.outer = null, this._init(Tm.toArray(n, o));
}
var Fm = mi;
mi.prototype._init = function(n) {
  n.length > this.blockSize && (n = new this.Hash().update(n).digest()), Cm(n.length <= this.blockSize);
  for (var o = n.length; o < this.blockSize; o++)
    n.push(0);
  for (o = 0; o < n.length; o++)
    n[o] ^= 54;
  for (this.inner = new this.Hash().update(n), o = 0; o < n.length; o++)
    n[o] ^= 106;
  this.outer = new this.Hash().update(n);
};
mi.prototype.update = function(n, o) {
  return this.inner.update(n, o), this;
};
mi.prototype.digest = function(n) {
  return this.outer.update(this.inner.digest()), this.outer.digest(n);
};
(function(a) {
  var n = a;
  n.utils = jt, n.common = Si, n.sha = Ai, n.ripemd = Io, n.hmac = Fm, n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.sha384 = n.sha.sha384, n.sha512 = n.sha.sha512, n.ripemd160 = n.ripemd.ripemd160;
})(ff);
var Pf, za;
function qm() {
  return za || (za = 1, Pf = {
    doubles: {
      step: 4,
      points: [
        [
          "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
          "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"
        ],
        [
          "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
          "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"
        ],
        [
          "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
          "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"
        ],
        [
          "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
          "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"
        ],
        [
          "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
          "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"
        ],
        [
          "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
          "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"
        ],
        [
          "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
          "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"
        ],
        [
          "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
          "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"
        ],
        [
          "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
          "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"
        ],
        [
          "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
          "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"
        ],
        [
          "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
          "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"
        ],
        [
          "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
          "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"
        ],
        [
          "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
          "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"
        ],
        [
          "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
          "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"
        ],
        [
          "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
          "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"
        ],
        [
          "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
          "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"
        ],
        [
          "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
          "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"
        ],
        [
          "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
          "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"
        ],
        [
          "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
          "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"
        ],
        [
          "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
          "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"
        ],
        [
          "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
          "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"
        ],
        [
          "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
          "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"
        ],
        [
          "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
          "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"
        ],
        [
          "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
          "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"
        ],
        [
          "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
          "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"
        ],
        [
          "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
          "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"
        ],
        [
          "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
          "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"
        ],
        [
          "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
          "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"
        ],
        [
          "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
          "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"
        ],
        [
          "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
          "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"
        ],
        [
          "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
          "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"
        ],
        [
          "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
          "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"
        ],
        [
          "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
          "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"
        ],
        [
          "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
          "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"
        ],
        [
          "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
          "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"
        ],
        [
          "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
          "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"
        ],
        [
          "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
          "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"
        ],
        [
          "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
          "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"
        ],
        [
          "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
          "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"
        ],
        [
          "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
          "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"
        ],
        [
          "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
          "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"
        ],
        [
          "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
          "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"
        ],
        [
          "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
          "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"
        ],
        [
          "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
          "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"
        ],
        [
          "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
          "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"
        ],
        [
          "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
          "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"
        ],
        [
          "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
          "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"
        ],
        [
          "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
          "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"
        ],
        [
          "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
          "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"
        ],
        [
          "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
          "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"
        ],
        [
          "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
          "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"
        ],
        [
          "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
          "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"
        ],
        [
          "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
          "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"
        ],
        [
          "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
          "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"
        ],
        [
          "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
          "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"
        ],
        [
          "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
          "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"
        ],
        [
          "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
          "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"
        ],
        [
          "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
          "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"
        ],
        [
          "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
          "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"
        ],
        [
          "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
          "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"
        ],
        [
          "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
          "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"
        ],
        [
          "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
          "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"
        ],
        [
          "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
          "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"
        ],
        [
          "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
          "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"
        ],
        [
          "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
          "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"
        ]
      ]
    },
    naf: {
      wnd: 7,
      points: [
        [
          "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
          "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"
        ],
        [
          "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
          "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"
        ],
        [
          "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
          "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"
        ],
        [
          "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
          "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"
        ],
        [
          "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
          "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"
        ],
        [
          "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
          "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"
        ],
        [
          "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
          "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"
        ],
        [
          "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
          "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"
        ],
        [
          "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
          "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"
        ],
        [
          "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
          "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"
        ],
        [
          "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
          "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"
        ],
        [
          "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
          "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"
        ],
        [
          "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
          "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"
        ],
        [
          "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
          "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"
        ],
        [
          "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
          "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"
        ],
        [
          "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
          "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"
        ],
        [
          "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
          "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"
        ],
        [
          "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
          "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"
        ],
        [
          "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
          "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"
        ],
        [
          "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
          "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"
        ],
        [
          "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
          "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"
        ],
        [
          "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
          "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"
        ],
        [
          "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
          "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"
        ],
        [
          "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
          "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"
        ],
        [
          "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
          "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"
        ],
        [
          "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
          "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"
        ],
        [
          "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
          "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"
        ],
        [
          "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
          "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"
        ],
        [
          "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
          "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"
        ],
        [
          "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
          "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"
        ],
        [
          "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
          "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"
        ],
        [
          "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
          "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"
        ],
        [
          "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
          "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"
        ],
        [
          "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
          "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"
        ],
        [
          "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
          "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"
        ],
        [
          "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
          "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"
        ],
        [
          "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
          "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"
        ],
        [
          "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
          "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"
        ],
        [
          "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
          "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"
        ],
        [
          "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
          "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"
        ],
        [
          "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
          "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"
        ],
        [
          "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
          "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"
        ],
        [
          "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
          "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"
        ],
        [
          "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
          "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"
        ],
        [
          "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
          "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"
        ],
        [
          "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
          "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"
        ],
        [
          "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
          "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"
        ],
        [
          "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
          "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"
        ],
        [
          "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
          "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"
        ],
        [
          "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
          "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"
        ],
        [
          "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
          "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"
        ],
        [
          "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
          "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"
        ],
        [
          "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
          "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"
        ],
        [
          "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
          "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"
        ],
        [
          "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
          "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"
        ],
        [
          "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
          "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"
        ],
        [
          "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
          "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"
        ],
        [
          "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
          "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"
        ],
        [
          "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
          "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"
        ],
        [
          "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
          "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"
        ],
        [
          "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
          "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"
        ],
        [
          "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
          "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"
        ],
        [
          "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
          "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"
        ],
        [
          "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
          "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"
        ],
        [
          "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
          "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"
        ],
        [
          "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
          "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"
        ],
        [
          "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
          "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"
        ],
        [
          "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
          "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"
        ],
        [
          "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
          "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"
        ],
        [
          "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
          "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"
        ],
        [
          "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
          "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"
        ],
        [
          "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
          "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"
        ],
        [
          "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
          "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"
        ],
        [
          "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
          "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"
        ],
        [
          "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
          "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"
        ],
        [
          "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
          "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"
        ],
        [
          "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
          "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"
        ],
        [
          "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
          "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"
        ],
        [
          "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
          "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"
        ],
        [
          "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
          "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"
        ],
        [
          "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
          "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"
        ],
        [
          "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
          "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"
        ],
        [
          "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
          "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"
        ],
        [
          "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
          "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"
        ],
        [
          "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
          "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"
        ],
        [
          "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
          "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"
        ],
        [
          "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
          "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"
        ],
        [
          "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
          "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"
        ],
        [
          "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
          "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"
        ],
        [
          "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
          "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"
        ],
        [
          "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
          "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"
        ],
        [
          "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
          "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"
        ],
        [
          "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
          "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"
        ],
        [
          "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
          "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"
        ],
        [
          "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
          "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"
        ],
        [
          "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
          "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"
        ],
        [
          "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
          "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"
        ],
        [
          "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
          "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"
        ],
        [
          "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
          "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"
        ],
        [
          "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
          "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"
        ],
        [
          "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
          "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"
        ],
        [
          "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
          "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"
        ],
        [
          "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
          "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"
        ],
        [
          "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
          "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"
        ],
        [
          "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
          "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"
        ],
        [
          "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
          "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"
        ],
        [
          "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
          "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"
        ],
        [
          "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
          "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"
        ],
        [
          "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
          "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"
        ],
        [
          "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
          "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"
        ],
        [
          "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
          "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"
        ],
        [
          "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
          "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"
        ],
        [
          "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
          "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"
        ],
        [
          "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
          "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"
        ],
        [
          "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
          "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"
        ],
        [
          "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
          "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"
        ],
        [
          "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
          "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"
        ],
        [
          "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
          "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"
        ],
        [
          "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
          "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"
        ],
        [
          "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
          "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"
        ],
        [
          "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
          "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"
        ],
        [
          "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
          "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"
        ],
        [
          "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
          "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"
        ],
        [
          "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
          "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"
        ],
        [
          "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
          "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"
        ],
        [
          "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
          "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"
        ],
        [
          "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
          "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"
        ]
      ]
    }
  }), Pf;
}
(function(a) {
  var n = a, o = ff, s = W0, m = Ke, f = m.assert;
  function g(B) {
    B.type === "short" ? this.curve = new s.short(B) : B.type === "edwards" ? this.curve = new s.edwards(B) : this.curve = new s.mont(B), this.g = this.curve.g, this.n = this.curve.n, this.hash = B.hash, f(this.g.validate(), "Invalid curve"), f(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
  }
  n.PresetCurve = g;
  function y(B, M) {
    Object.defineProperty(n, B, {
      configurable: !0,
      enumerable: !0,
      get: function() {
        var x = new g(M);
        return Object.defineProperty(n, B, {
          configurable: !0,
          enumerable: !0,
          value: x
        }), x;
      }
    });
  }
  y("p192", {
    type: "short",
    prime: "p192",
    p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
    a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
    b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
    n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
    hash: o.sha256,
    gRed: !1,
    g: [
      "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
      "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
    ]
  }), y("p224", {
    type: "short",
    prime: "p224",
    p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
    a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
    b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
    n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
    hash: o.sha256,
    gRed: !1,
    g: [
      "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
      "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
    ]
  }), y("p256", {
    type: "short",
    prime: null,
    p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
    a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
    b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
    n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
    hash: o.sha256,
    gRed: !1,
    g: [
      "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
      "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
    ]
  }), y("p384", {
    type: "short",
    prime: null,
    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
    a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
    b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
    n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
    hash: o.sha384,
    gRed: !1,
    g: [
      "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
      "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
    ]
  }), y("p521", {
    type: "short",
    prime: null,
    p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
    a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
    b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
    n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
    hash: o.sha512,
    gRed: !1,
    g: [
      "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
      "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
    ]
  }), y("curve25519", {
    type: "mont",
    prime: "p25519",
    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
    a: "76d06",
    b: "1",
    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
    hash: o.sha256,
    gRed: !1,
    g: [
      "9"
    ]
  }), y("ed25519", {
    type: "edwards",
    prime: "p25519",
    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
    a: "-1",
    c: "1",
    // -121665 * (121666^(-1)) (mod P)
    d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
    hash: o.sha256,
    gRed: !1,
    g: [
      "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
      // 4/5
      "6666666666666666666666666666666666666666666666666666666666666658"
    ]
  });
  var S;
  try {
    S = qm();
  } catch (B) {
    S = void 0;
  }
  y("secp256k1", {
    type: "short",
    prime: "k256",
    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
    a: "0",
    b: "7",
    n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
    h: "1",
    hash: o.sha256,
    // Precomputed endomorphism
    beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
    lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
    basis: [
      {
        a: "3086d221a7d46bcde86c90e49284eb15",
        b: "-e4437ed6010e88286f547fa90abfe4c3"
      },
      {
        a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
        b: "3086d221a7d46bcde86c90e49284eb15"
      }
    ],
    gRed: !1,
    g: [
      "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
      "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
      S
    ]
  });
})(nf);
var Pm = ff, Gr = Z0, To = Ve;
function Nr(a) {
  if (!(this instanceof Nr))
    return new Nr(a);
  this.hash = a.hash, this.predResist = !!a.predResist, this.outLen = this.hash.outSize, this.minEntropy = a.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
  var n = Gr.toArray(a.entropy, a.entropyEnc || "hex"), o = Gr.toArray(a.nonce, a.nonceEnc || "hex"), s = Gr.toArray(a.pers, a.persEnc || "hex");
  To(
    n.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  ), this._init(n, o, s);
}
var Dm = Nr;
Nr.prototype._init = function(n, o, s) {
  var m = n.concat(o).concat(s);
  this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
  for (var f = 0; f < this.V.length; f++)
    this.K[f] = 0, this.V[f] = 1;
  this._update(m), this._reseed = 1, this.reseedInterval = 281474976710656;
};
Nr.prototype._hmac = function() {
  return new Pm.hmac(this.hash, this.K);
};
Nr.prototype._update = function(n) {
  var o = this._hmac().update(this.V).update([0]);
  n && (o = o.update(n)), this.K = o.digest(), this.V = this._hmac().update(this.V).digest(), n && (this.K = this._hmac().update(this.V).update([1]).update(n).digest(), this.V = this._hmac().update(this.V).digest());
};
Nr.prototype.reseed = function(n, o, s, m) {
  typeof o != "string" && (m = s, s = o, o = null), n = Gr.toArray(n, o), s = Gr.toArray(s, m), To(
    n.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  ), this._update(n.concat(s || [])), this._reseed = 1;
};
Nr.prototype.generate = function(n, o, s, m) {
  if (this._reseed > this.reseedInterval)
    throw new Error("Reseed is required");
  typeof o != "string" && (m = s, s = o, o = null), s && (s = Gr.toArray(s, m || "hex"), this._update(s));
  for (var f = []; f.length < n; )
    this.V = this._hmac().update(this.V).digest(), f = f.concat(this.V);
  var g = f.slice(0, n);
  return this._update(s), this._reseed++, Gr.encode(g, o);
};
var Nm = Tr, $m = Ke, m0 = $m.assert;
function qe(a, n) {
  this.ec = a, this.priv = null, this.pub = null, n.priv && this._importPrivate(n.priv, n.privEnc), n.pub && this._importPublic(n.pub, n.pubEnc);
}
var Lm = qe;
qe.fromPublic = function(n, o, s) {
  return o instanceof qe ? o : new qe(n, {
    pub: o,
    pubEnc: s
  });
};
qe.fromPrivate = function(n, o, s) {
  return o instanceof qe ? o : new qe(n, {
    priv: o,
    privEnc: s
  });
};
qe.prototype.validate = function() {
  var n = this.getPublic();
  return n.isInfinity() ? { result: !1, reason: "Invalid public key" } : n.validate() ? n.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : { result: !1, reason: "Public key * N != O" } : { result: !1, reason: "Public key is not a point" };
};
qe.prototype.getPublic = function(n, o) {
  return typeof n == "string" && (o = n, n = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), o ? this.pub.encode(o, n) : this.pub;
};
qe.prototype.getPrivate = function(n) {
  return n === "hex" ? this.priv.toString(16, 2) : this.priv;
};
qe.prototype._importPrivate = function(n, o) {
  this.priv = new Nm(n, o || 16), this.priv = this.priv.umod(this.ec.curve.n);
};
qe.prototype._importPublic = function(n, o) {
  if (n.x || n.y) {
    this.ec.curve.type === "mont" ? m0(n.x, "Need x coordinate") : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") && m0(n.x && n.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(n.x, n.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(n, o);
};
qe.prototype.derive = function(n) {
  return n.validate() || m0(n.validate(), "public point not validated"), n.mul(this.priv).getX();
};
qe.prototype.sign = function(n, o, s) {
  return this.ec.sign(n, this, o, s);
};
qe.prototype.verify = function(n, o, s) {
  return this.ec.verify(n, o, this, void 0, s);
};
qe.prototype.inspect = function() {
  return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
var Tn = Tr, Y0 = Ke, Um = Y0.assert;
function hf(a, n) {
  if (a instanceof hf)
    return a;
  this._importDER(a, n) || (Um(a.r && a.s, "Signature without r or s"), this.r = new Tn(a.r, 16), this.s = new Tn(a.s, 16), a.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = a.recoveryParam);
}
var Om = hf;
function zm() {
  this.place = 0;
}
function Df(a, n) {
  var o = a[n.place++];
  if (!(o & 128))
    return o;
  var s = o & 15;
  if (s === 0 || s > 4 || a[n.place] === 0)
    return !1;
  for (var m = 0, f = 0, g = n.place; f < s; f++, g++)
    m <<= 8, m |= a[g], m >>>= 0;
  return m <= 127 ? !1 : (n.place = g, m);
}
function Ka(a) {
  for (var n = 0, o = a.length - 1; !a[n] && !(a[n + 1] & 128) && n < o; )
    n++;
  return n === 0 ? a : a.slice(n);
}
hf.prototype._importDER = function(n, o) {
  n = Y0.toArray(n, o);
  var s = new zm();
  if (n[s.place++] !== 48)
    return !1;
  var m = Df(n, s);
  if (m === !1 || m + s.place !== n.length || n[s.place++] !== 2)
    return !1;
  var f = Df(n, s);
  if (f === !1 || n[s.place] & 128)
    return !1;
  var g = n.slice(s.place, f + s.place);
  if (s.place += f, n[s.place++] !== 2)
    return !1;
  var y = Df(n, s);
  if (y === !1 || n.length !== y + s.place || n[s.place] & 128)
    return !1;
  var S = n.slice(s.place, y + s.place);
  if (g[0] === 0)
    if (g[1] & 128)
      g = g.slice(1);
    else
      return !1;
  if (S[0] === 0)
    if (S[1] & 128)
      S = S.slice(1);
    else
      return !1;
  return this.r = new Tn(g), this.s = new Tn(S), this.recoveryParam = null, !0;
};
function Nf(a, n) {
  if (n < 128) {
    a.push(n);
    return;
  }
  var o = 1 + (Math.log(n) / Math.LN2 >>> 3);
  for (a.push(o | 128); --o; )
    a.push(n >>> (o << 3) & 255);
  a.push(n);
}
hf.prototype.toDER = function(n) {
  var o = this.r.toArray(), s = this.s.toArray();
  for (o[0] & 128 && (o = [0].concat(o)), s[0] & 128 && (s = [0].concat(s)), o = Ka(o), s = Ka(s); !s[0] && !(s[1] & 128); )
    s = s.slice(1);
  var m = [2];
  Nf(m, o.length), m = m.concat(o), m.push(2), Nf(m, s.length);
  var f = m.concat(s), g = [48];
  return Nf(g, f.length), g = g.concat(f), Y0.encode(g, n);
};
var $f, Ha;
function Km() {
  if (Ha)
    return $f;
  Ha = 1;
  var a = Tr, n = Dm, o = Ke, s = nf, m = L0(), f = o.assert, g = Lm, y = Om;
  function S(B) {
    if (!(this instanceof S))
      return new S(B);
    typeof B == "string" && (f(
      Object.prototype.hasOwnProperty.call(s, B),
      "Unknown curve " + B
    ), B = s[B]), B instanceof s.PresetCurve && (B = { curve: B }), this.curve = B.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = B.curve.g, this.g.precompute(B.curve.n.bitLength() + 1), this.hash = B.hash || B.curve.hash;
  }
  return $f = S, S.prototype.keyPair = function(M) {
    return new g(this, M);
  }, S.prototype.keyFromPrivate = function(M, x) {
    return g.fromPrivate(this, M, x);
  }, S.prototype.keyFromPublic = function(M, x) {
    return g.fromPublic(this, M, x);
  }, S.prototype.genKeyPair = function(M) {
    M || (M = {});
    for (var x = new n({
      hash: this.hash,
      pers: M.pers,
      persEnc: M.persEnc || "utf8",
      entropy: M.entropy || m(this.hash.hmacStrength),
      entropyEnc: M.entropy && M.entropyEnc || "utf8",
      nonce: this.n.toArray()
    }), I = this.n.byteLength(), k = this.n.sub(new a(2)); ; ) {
      var D = new a(x.generate(I));
      if (!(D.cmp(k) > 0))
        return D.iaddn(1), this.keyFromPrivate(D);
    }
  }, S.prototype._truncateToN = function(M, x, I) {
    var k;
    if (a.isBN(M) || typeof M == "number")
      M = new a(M, 16), k = M.byteLength();
    else if (typeof M == "object")
      k = M.length, M = new a(M, 16);
    else {
      var D = M.toString();
      k = D.length + 1 >>> 1, M = new a(D, 16);
    }
    typeof I != "number" && (I = k * 8);
    var U = I - this.n.bitLength();
    return U > 0 && (M = M.ushrn(U)), !x && M.cmp(this.n) >= 0 ? M.sub(this.n) : M;
  }, S.prototype.sign = function(M, x, I, k) {
    if (typeof I == "object" && (k = I, I = null), k || (k = {}), typeof M != "string" && typeof M != "number" && !a.isBN(M)) {
      f(
        typeof M == "object" && M && typeof M.length == "number",
        "Expected message to be an array-like, a hex string, or a BN instance"
      ), f(M.length >>> 0 === M.length);
      for (var D = 0; D < M.length; D++)
        f((M[D] & 255) === M[D]);
    }
    x = this.keyFromPrivate(x, I), M = this._truncateToN(M, !1, k.msgBitLength), f(!M.isNeg(), "Can not sign a negative message");
    var U = this.n.byteLength(), W = x.getPrivate().toArray("be", U), z = M.toArray("be", U);
    f(new a(z).eq(M), "Can not sign message");
    for (var $ = new n({
      hash: this.hash,
      entropy: W,
      nonce: z,
      pers: k.pers,
      persEnc: k.persEnc || "utf8"
    }), lt = this.n.sub(new a(1)), H = 0; ; H++) {
      var At = k.k ? k.k(H) : new a($.generate(this.n.byteLength()));
      if (At = this._truncateToN(At, !0), !(At.cmpn(1) <= 0 || At.cmp(lt) >= 0)) {
        var Bt = this.g.mul(At);
        if (!Bt.isInfinity()) {
          var Ct = Bt.getX(), Et = Ct.umod(this.n);
          if (Et.cmpn(0) !== 0) {
            var Y = At.invm(this.n).mul(Et.mul(x.getPrivate()).iadd(M));
            if (Y = Y.umod(this.n), Y.cmpn(0) !== 0) {
              var It = (Bt.getY().isOdd() ? 1 : 0) | (Ct.cmp(Et) !== 0 ? 2 : 0);
              return k.canonical && Y.cmp(this.nh) > 0 && (Y = this.n.sub(Y), It ^= 1), new y({ r: Et, s: Y, recoveryParam: It });
            }
          }
        }
      }
    }
  }, S.prototype.verify = function(M, x, I, k, D) {
    D || (D = {}), M = this._truncateToN(M, !1, D.msgBitLength), I = this.keyFromPublic(I, k), x = new y(x, "hex");
    var U = x.r, W = x.s;
    if (U.cmpn(1) < 0 || U.cmp(this.n) >= 0 || W.cmpn(1) < 0 || W.cmp(this.n) >= 0)
      return !1;
    var z = W.invm(this.n), $ = z.mul(M).umod(this.n), lt = z.mul(U).umod(this.n), H;
    return this.curve._maxwellTrick ? (H = this.g.jmulAdd($, I.getPublic(), lt), H.isInfinity() ? !1 : H.eqXToP(U)) : (H = this.g.mulAdd($, I.getPublic(), lt), H.isInfinity() ? !1 : H.getX().umod(this.n).cmp(U) === 0);
  }, S.prototype.recoverPubKey = function(B, M, x, I) {
    f((3 & x) === x, "The recovery param is more than two bits"), M = new y(M, I);
    var k = this.n, D = new a(B), U = M.r, W = M.s, z = x & 1, $ = x >> 1;
    if (U.cmp(this.curve.p.umod(this.curve.n)) >= 0 && $)
      throw new Error("Unable to find sencond key candinate");
    $ ? U = this.curve.pointFromX(U.add(this.curve.n), z) : U = this.curve.pointFromX(U, z);
    var lt = M.r.invm(k), H = k.sub(D).mul(lt).umod(k), At = W.mul(lt).umod(k);
    return this.g.mulAdd(H, U, At);
  }, S.prototype.getKeyRecoveryParam = function(B, M, x, I) {
    if (M = new y(M, I), M.recoveryParam !== null)
      return M.recoveryParam;
    for (var k = 0; k < 4; k++) {
      var D;
      try {
        D = this.recoverPubKey(B, M, k);
      } catch (U) {
        continue;
      }
      if (D.eq(x))
        return k;
    }
    throw new Error("Unable to find valid recovery factor");
  }, $f;
}
var hn = Ke, Co = hn.assert, Za = hn.parseBytes, Ei = hn.cachedProperty;
function Se(a, n) {
  this.eddsa = a, this._secret = Za(n.secret), a.isPoint(n.pub) ? this._pub = n.pub : this._pubBytes = Za(n.pub);
}
Se.fromPublic = function(n, o) {
  return o instanceof Se ? o : new Se(n, { pub: o });
};
Se.fromSecret = function(n, o) {
  return o instanceof Se ? o : new Se(n, { secret: o });
};
Se.prototype.secret = function() {
  return this._secret;
};
Ei(Se, "pubBytes", function() {
  return this.eddsa.encodePoint(this.pub());
});
Ei(Se, "pub", function() {
  return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
});
Ei(Se, "privBytes", function() {
  var n = this.eddsa, o = this.hash(), s = n.encodingLength - 1, m = o.slice(0, n.encodingLength);
  return m[0] &= 248, m[s] &= 127, m[s] |= 64, m;
});
Ei(Se, "priv", function() {
  return this.eddsa.decodeInt(this.privBytes());
});
Ei(Se, "hash", function() {
  return this.eddsa.hash().update(this.secret()).digest();
});
Ei(Se, "messagePrefix", function() {
  return this.hash().slice(this.eddsa.encodingLength);
});
Se.prototype.sign = function(n) {
  return Co(this._secret, "KeyPair can only verify"), this.eddsa.sign(n, this);
};
Se.prototype.verify = function(n, o) {
  return this.eddsa.verify(n, o, this);
};
Se.prototype.getSecret = function(n) {
  return Co(this._secret, "KeyPair is public only"), hn.encode(this.secret(), n);
};
Se.prototype.getPublic = function(n) {
  return hn.encode(this.pubBytes(), n);
};
var Hm = Se, Zm = Tr, sf = Ke, Wa = sf.assert, of = sf.cachedProperty, Wm = sf.parseBytes;
function ii(a, n) {
  this.eddsa = a, typeof n != "object" && (n = Wm(n)), Array.isArray(n) && (Wa(n.length === a.encodingLength * 2, "Signature has invalid size"), n = {
    R: n.slice(0, a.encodingLength),
    S: n.slice(a.encodingLength)
  }), Wa(n.R && n.S, "Signature without R or S"), a.isPoint(n.R) && (this._R = n.R), n.S instanceof Zm && (this._S = n.S), this._Rencoded = Array.isArray(n.R) ? n.R : n.Rencoded, this._Sencoded = Array.isArray(n.S) ? n.S : n.Sencoded;
}
of(ii, "S", function() {
  return this.eddsa.decodeInt(this.Sencoded());
});
of(ii, "R", function() {
  return this.eddsa.decodePoint(this.Rencoded());
});
of(ii, "Rencoded", function() {
  return this.eddsa.encodePoint(this.R());
});
of(ii, "Sencoded", function() {
  return this.eddsa.encodeInt(this.S());
});
ii.prototype.toBytes = function() {
  return this.Rencoded().concat(this.Sencoded());
};
ii.prototype.toHex = function() {
  return sf.encode(this.toBytes(), "hex").toUpperCase();
};
var Vm = ii, Ym = ff, Jm = nf, gi = Ke, Gm = gi.assert, Fo = gi.parseBytes, qo = Hm, Va = Vm;
function Le(a) {
  if (Gm(a === "ed25519", "only tested with ed25519 so far"), !(this instanceof Le))
    return new Le(a);
  a = Jm[a].curve, this.curve = a, this.g = a.g, this.g.precompute(a.n.bitLength() + 1), this.pointClass = a.point().constructor, this.encodingLength = Math.ceil(a.n.bitLength() / 8), this.hash = Ym.sha512;
}
var Xm = Le;
Le.prototype.sign = function(n, o) {
  n = Fo(n);
  var s = this.keyFromSecret(o), m = this.hashInt(s.messagePrefix(), n), f = this.g.mul(m), g = this.encodePoint(f), y = this.hashInt(g, s.pubBytes(), n).mul(s.priv()), S = m.add(y).umod(this.curve.n);
  return this.makeSignature({ R: f, S, Rencoded: g });
};
Le.prototype.verify = function(n, o, s) {
  if (n = Fo(n), o = this.makeSignature(o), o.S().gte(o.eddsa.curve.n) || o.S().isNeg())
    return !1;
  var m = this.keyFromPublic(s), f = this.hashInt(o.Rencoded(), m.pubBytes(), n), g = this.g.mul(o.S()), y = o.R().add(m.pub().mul(f));
  return y.eq(g);
};
Le.prototype.hashInt = function() {
  for (var n = this.hash(), o = 0; o < arguments.length; o++)
    n.update(arguments[o]);
  return gi.intFromLE(n.digest()).umod(this.curve.n);
};
Le.prototype.keyFromPublic = function(n) {
  return qo.fromPublic(this, n);
};
Le.prototype.keyFromSecret = function(n) {
  return qo.fromSecret(this, n);
};
Le.prototype.makeSignature = function(n) {
  return n instanceof Va ? n : new Va(this, n);
};
Le.prototype.encodePoint = function(n) {
  var o = n.getY().toArray("le", this.encodingLength);
  return o[this.encodingLength - 1] |= n.getX().isOdd() ? 128 : 0, o;
};
Le.prototype.decodePoint = function(n) {
  n = gi.parseBytes(n);
  var o = n.length - 1, s = n.slice(0, o).concat(n[o] & -129), m = (n[o] & 128) !== 0, f = gi.intFromLE(s);
  return this.curve.pointFromY(f, m);
};
Le.prototype.encodeInt = function(n) {
  return n.toArray("le", this.encodingLength);
};
Le.prototype.decodeInt = function(n) {
  return gi.intFromLE(n);
};
Le.prototype.isPoint = function(n) {
  return n instanceof this.pointClass;
};
var Ya;
function J0() {
  return Ya || (Ya = 1, function(a) {
    var n = a;
    n.version = jv.version, n.utils = Ke, n.rand = L0(), n.curve = W0, n.curves = nf, n.ec = Km(), n.eddsa = Xm;
  }(Tf)), Tf;
}
var ir = {}, Lf = {}, G0 = { exports: {} };
G0.exports;
(function(a) {
  (function(n, o) {
    function s(p, t) {
      if (!p)
        throw new Error(t || "Assertion failed");
    }
    function m(p, t) {
      p.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, p.prototype = new r(), p.prototype.constructor = p;
    }
    function f(p, t, r) {
      if (f.isBN(p))
        return p;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, p !== null && ((t === "le" || t === "be") && (r = t, t = 10), this._init(p || 0, t || 10, r || "be"));
    }
    typeof n == "object" ? n.exports = f : o.BN = f, f.BN = f, f.wordSize = 26;
    var g;
    try {
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Ne.Buffer;
    } catch (p) {
    }
    f.isBN = function(t) {
      return t instanceof f ? !0 : t !== null && typeof t == "object" && t.constructor.wordSize === f.wordSize && Array.isArray(t.words);
    }, f.max = function(t, r) {
      return t.cmp(r) > 0 ? t : r;
    }, f.min = function(t, r) {
      return t.cmp(r) < 0 ? t : r;
    }, f.prototype._init = function(t, r, i) {
      if (typeof t == "number")
        return this._initNumber(t, r, i);
      if (typeof t == "object")
        return this._initArray(t, r, i);
      r === "hex" && (r = 16), s(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var h = 0;
      t[0] === "-" && (h++, this.negative = 1), h < t.length && (r === 16 ? this._parseHex(t, h, i) : (this._parseBase(t, r, h), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (s(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (s(typeof t.length == "number"), t.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(t.length / 3), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (h = t.length - 1, d = 0; h >= 0; h -= 3)
          c = t[h] | t[h - 1] << 8 | t[h - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (h = 0, d = 0; h < t.length; h += 3)
          c = t[h] | t[h + 1] << 8 | t[h + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      return this.strip();
    };
    function y(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function S(p, t, r) {
      var i = y(p, r);
      return r - 1 >= t && (i |= y(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (h = t.length - 1; h >= r; h -= 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (h = u % 2 === 0 ? r + 1 : r; h < t.length; h += 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var h = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        h *= i, v >= 49 ? h += v - 49 + 10 : v >= 17 ? h += v - 17 + 10 : h += v;
      }
      return h;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var h = 0, d = 1; d <= 67108863; d *= r)
        h++;
      h--, d = d / r | 0;
      for (var c = t.length - i, v = c % h, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += h)
        e = B(t, l, l + h, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var b = 1;
        for (e = B(t, l, t.length, r), l = 0; l < v; l++)
          b *= r;
        this.imuln(b), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      }
      this.strip();
    }, f.prototype.copy = function(t) {
      t.words = new Array(this.length);
      for (var r = 0; r < this.length; r++)
        t.words[r] = this.words[r];
      t.length = this.length, t.negative = this.negative, t.red = this.red;
    }, f.prototype.clone = function() {
      var t = new f(null);
      return this.copy(t), t;
    }, f.prototype._expand = function(t) {
      for (; this.length < t; )
        this.words[this.length++] = 0;
      return this;
    }, f.prototype.strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, f.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, f.prototype.inspect = function() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var M = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], x = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], I = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    f.prototype.toString = function(t, r) {
      t = t || 10, r = r | 0 || 1;
      var i;
      if (t === 16 || t === "hex") {
        i = "";
        for (var h = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << h | d) & 16777215).toString(16);
          d = v >>> 24 - h & 16777215, h += 2, h >= 26 && (h -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = I[t];
        i = "";
        var b = this.clone();
        for (b.negative = 0; !b.isZero(); ) {
          var _ = b.modn(l).toString(t);
          b = b.idivn(l), b.isZero() ? i = _ + i : i = M[e - _.length] + _ + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      s(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && s(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return s(typeof g != "undefined"), this.toArrayLike(g, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var h = this.byteLength(), d = i || Math.max(1, h);
      s(h <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - h; e++)
          v[e] = 0;
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[d - e - 1] = u;
      }
      return v;
    }, Math.clz32 ? f.prototype._countBits = function(t) {
      return 32 - Math.clz32(t);
    } : f.prototype._countBits = function(t) {
      var r = t, i = 0;
      return r >= 4096 && (i += 13, r >>>= 13), r >= 64 && (i += 7, r >>>= 7), r >= 8 && (i += 4, r >>>= 4), r >= 2 && (i += 2, r >>>= 2), i + r;
    }, f.prototype._zeroBits = function(t) {
      if (t === 0)
        return 26;
      var r = t, i = 0;
      return r & 8191 || (i += 13, r >>>= 13), r & 127 || (i += 7, r >>>= 7), r & 15 || (i += 4, r >>>= 4), r & 3 || (i += 2, r >>>= 2), r & 1 || i++, i;
    }, f.prototype.bitLength = function() {
      var t = this.words[this.length - 1], r = this._countBits(t);
      return (this.length - 1) * 26 + r;
    };
    function k(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, h = r % 26;
        t[r] = (p.words[i] & 1 << h) >>> h;
      }
      return t;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var t = 0, r = 0; r < this.length; r++) {
        var i = this._zeroBits(this.words[r]);
        if (t += i, i !== 26)
          break;
      }
      return t;
    }, f.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, f.prototype.toTwos = function(t) {
      return this.negative !== 0 ? this.abs().inotn(t).iaddn(1) : this.clone();
    }, f.prototype.fromTwos = function(t) {
      return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone();
    }, f.prototype.isNeg = function() {
      return this.negative !== 0;
    }, f.prototype.neg = function() {
      return this.clone().ineg();
    }, f.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, f.prototype.iuor = function(t) {
      for (; this.length < t.length; )
        this.words[this.length++] = 0;
      for (var r = 0; r < t.length; r++)
        this.words[r] = this.words[r] | t.words[r];
      return this.strip();
    }, f.prototype.ior = function(t) {
      return s((this.negative | t.negative) === 0), this.iuor(t);
    }, f.prototype.or = function(t) {
      return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this);
    }, f.prototype.uor = function(t) {
      return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this);
    }, f.prototype.iuand = function(t) {
      var r;
      this.length > t.length ? r = t : r = this;
      for (var i = 0; i < r.length; i++)
        this.words[i] = this.words[i] & t.words[i];
      return this.length = r.length, this.strip();
    }, f.prototype.iand = function(t) {
      return s((this.negative | t.negative) === 0), this.iuand(t);
    }, f.prototype.and = function(t) {
      return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this);
    }, f.prototype.uand = function(t) {
      return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this);
    }, f.prototype.iuxor = function(t) {
      var r, i;
      this.length > t.length ? (r = this, i = t) : (r = t, i = this);
      for (var h = 0; h < i.length; h++)
        this.words[h] = r.words[h] ^ i.words[h];
      if (this !== r)
        for (; h < r.length; h++)
          this.words[h] = r.words[h];
      return this.length = r.length, this.strip();
    }, f.prototype.ixor = function(t) {
      return s((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var h = 0; h < r; h++)
        this.words[h] = ~this.words[h] & 67108863;
      return i > 0 && (this.words[h] = ~this.words[h] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, h = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << h : this.words[i] = this.words[i] & ~(1 << h), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, h;
      this.length > t.length ? (i = this, h = t) : (i = t, h = this);
      for (var d = 0, c = 0; c < h.length; c++)
        r = (i.words[c] | 0) + (h.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      for (; d !== 0 && c < i.length; c++)
        r = (i.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      if (this.length = i.length, d !== 0)
        this.words[this.length] = d, this.length++;
      else if (i !== this)
        for (; c < i.length; c++)
          this.words[c] = i.words[c];
      return this;
    }, f.prototype.add = function(t) {
      var r;
      return t.negative !== 0 && this.negative === 0 ? (t.negative = 0, r = this.sub(t), t.negative ^= 1, r) : t.negative === 0 && this.negative !== 0 ? (this.negative = 0, r = t.sub(this), this.negative = 1, r) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this);
    }, f.prototype.isub = function(t) {
      if (t.negative !== 0) {
        t.negative = 0;
        var r = this.iadd(t);
        return t.negative = 1, r._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
      var i = this.cmp(t);
      if (i === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var h, d;
      i > 0 ? (h = this, d = t) : (h = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (h.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < h.length; v++)
        r = (h.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < h.length && h !== this)
        for (; v < h.length; v++)
          this.words[v] = h.words[v];
      return this.length = Math.max(this.length, v), h !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var h = p.words[0] | 0, d = t.words[0] | 0, c = h * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var q = e - C | 0;
          h = p.words[q] | 0, d = t.words[C] | 0, c = h * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var U = function(t, r, i) {
      var h = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = h[0] | 0, _ = b & 8191, C = b >>> 13, q = h[1] | 0, O = q & 8191, R = q >>> 13, P = h[2] | 0, N = P & 8191, K = P >>> 13, kt = h[3] | 0, Z = kt & 8191, J = kt >>> 13, Ft = h[4] | 0, tt = Ft & 8191, vt = Ft >>> 13, Dt = h[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = h[6] | 0, j = Pt & 8191, dt = Pt >>> 13, qt = h[7] | 0, Q = qt & 8191, ct = qt >>> 13, Ut = h[8] | 0, E = Ut & 8191, w = Ut >>> 13, A = h[9] | 0, T = A & 8191, F = A >>> 13, V = d[0] | 0, L = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, Kt = d[3] | 0, nt = Kt & 8191, bt = Kt >>> 13, Ht = d[4] | 0, ft = Ht & 8191, yt = Ht >>> 13, Zt = d[5] | 0, at = Zt & 8191, wt = Zt >>> 13, Wt = d[6] | 0, ht = Wt & 8191, Mt = Wt >>> 13, Vt = d[7] | 0, st = Vt & 8191, xt = Vt >>> 13, Yt = d[8] | 0, ot = Yt & 8191, _t = Yt >>> 13, Jt = d[9] | 0, ut = Jt & 8191, St = Jt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, L), e = Math.imul(_, X), e = e + Math.imul(C, L) | 0, l = Math.imul(C, X);
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul(O, L), e = Math.imul(O, X), e = e + Math.imul(R, L) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(N, L), e = Math.imul(N, X), e = e + Math.imul(K, L) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(Z, L), e = Math.imul(Z, X), e = e + Math.imul(J, L) | 0, l = Math.imul(J, X), u = u + Math.imul(N, G) | 0, e = e + Math.imul(N, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(tt, L), e = Math.imul(tt, X), e = e + Math.imul(vt, L) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul(N, it) | 0, e = e + Math.imul(N, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(et, L), e = Math.imul(et, X), e = e + Math.imul(pt, L) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul(N, nt) | 0, e = e + Math.imul(N, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(j, L), e = Math.imul(j, X), e = e + Math.imul(dt, L) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul(N, ft) | 0, e = e + Math.imul(N, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(Q, L), e = Math.imul(Q, X), e = e + Math.imul(ct, L) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul(N, at) | 0, e = e + Math.imul(N, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(E, L), e = Math.imul(E, X), e = e + Math.imul(w, L) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul(N, ht) | 0, e = e + Math.imul(N, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, L), e = Math.imul(T, X), e = e + Math.imul(F, L) | 0, l = Math.imul(F, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul(N, st) | 0, e = e + Math.imul(N, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(F, G) | 0, l = Math.imul(F, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul(N, ot) | 0, e = e + Math.imul(N, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(F, it) | 0, l = Math.imul(F, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul(N, ut) | 0, e = e + Math.imul(N, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(F, nt) | 0, l = Math.imul(F, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(F, ft) | 0, l = Math.imul(F, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(F, at) | 0, l = Math.imul(F, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(F, ht) | 0, l = Math.imul(F, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(F, st) | 0, l = Math.imul(F, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(F, ot) | 0, l = Math.imul(F, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(F, ut) | 0, l = Math.imul(F, St);
      var pe = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (pe >>> 26) | 0, pe &= 67108863, c[0] = Nt, c[1] = $t, c[2] = Qt, c[3] = te, c[4] = ee, c[5] = re, c[6] = ie, c[7] = ne, c[8] = fe, c[9] = ae, c[10] = he, c[11] = se, c[12] = oe, c[13] = ue, c[14] = le, c[15] = de, c[16] = ce, c[17] = ve, c[18] = pe, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (U = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, h = 0, d = 0; d < r.length - 1; d++) {
        var c = h;
        h = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, q = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, q = q + v | 0, v = q & 67108863, c = c + (q >>> 26) | 0, h += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = h;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new $();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, h = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = U(this, t, r) : h < 63 ? i = D(this, t, r) : h < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function $(p, t) {
      this.x = p, this.y = t;
    }
    $.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, h = 0; h < t; h++)
        r[h] = this.revBin(h, i, t);
      return r;
    }, $.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var h = 0, d = 0; d < r; d++)
        h |= (t & 1) << r - d - 1, t >>= 1;
      return h;
    }, $.prototype.permute = function(t, r, i, h, d, c) {
      for (var v = 0; v < c; v++)
        h[v] = r[t[v]], d[v] = i[t[v]];
    }, $.prototype.transform = function(t, r, i, h, d, c) {
      this.permute(c, t, r, i, h, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, q = 0; q < v; q++) {
            var O = i[b + q], R = h[b + q], P = i[b + q + v], N = h[b + q + v], K = _ * P - C * N;
            N = _ * N + C * P, P = K, i[b + q] = O + P, h[b + q] = R + N, i[b + q + v] = O - P, h[b + q + v] = R - N, q !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, $.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, h = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + h;
    }, $.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var h = 0; h < i / 2; h++) {
          var d = t[h];
          t[h] = t[i - h - 1], t[i - h - 1] = d, d = r[h], r[h] = -r[i - h - 1], r[i - h - 1] = -d;
        }
    }, $.prototype.normalize13b = function(t, r) {
      for (var i = 0, h = 0; h < r / 2; h++) {
        var d = Math.round(t[2 * h + 1] / r) * 8192 + Math.round(t[2 * h] / r) + i;
        t[h] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, $.prototype.convert13b = function(t, r, i, h) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < h; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, $.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, $.prototype.mulp = function(t, r, i) {
      var h = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(h), c = this.stub(h), v = new Array(h), u = new Array(h), e = new Array(h), l = new Array(h), b = new Array(h), _ = new Array(h), C = i.words;
      C.length = h, this.convert13b(t.words, t.length, v, h), this.convert13b(r.words, r.length, l, h), this.transform(v, c, u, e, h, d), this.transform(l, c, b, _, h, d);
      for (var q = 0; q < h; q++) {
        var O = u[q] * b[q] - e[q] * _[q];
        e[q] = u[q] * _[q] + e[q] * b[q], u[q] = O;
      }
      return this.conjugate(u, e, h), this.transform(u, e, C, c, h, d), this.conjugate(C, c, h), this.normalize13b(C, h), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), z(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      s(typeof t == "number"), s(t < 67108864);
      for (var r = 0, i = 0; i < this.length; i++) {
        var h = (this.words[i] | 0) * t, d = (h & 67108863) + (r & 67108863);
        r >>= 26, r += h / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = k(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, h = 0; h < r.length && r[h] === 0; h++, i = i.sqr())
        ;
      if (++h < r.length)
        for (var d = i.sqr(); h < r.length; h++, d = d.sqr())
          r[h] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & h, u = (this.words[d] | 0) - v << r;
          this.words[d] = u | c, c = v >>> 26 - r;
        }
        c && (this.words[d] = c, this.length++);
      }
      if (i !== 0) {
        for (d = this.length - 1; d >= 0; d--)
          this.words[d + i] = this.words[d];
        for (d = 0; d < i; d++)
          this.words[d] = 0;
        this.length += i;
      }
      return this.strip();
    }, f.prototype.ishln = function(t) {
      return s(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      s(typeof t == "number" && t >= 0);
      var h;
      r ? h = (r - r % 26) / 26 : h = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (h -= c, h = Math.max(0, h), u) {
        for (var e = 0; e < c; e++)
          u.words[e] = this.words[e];
        u.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var l = 0;
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= h); e--) {
        var b = this.words[e] | 0;
        this.words[e] = l << 26 - d | b >>> d, l = b & v;
      }
      return u && l !== 0 && (u.words[u.length++] = l), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return s(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & h);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var h = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= h;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return s(typeof t == "number"), s(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (s(typeof t == "number"), s(t < 67108864), t < 0)
        return this.iaddn(-t);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(t), this.negative = 1, this;
      if (this.words[0] -= t, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var r = 0; r < this.length && this.words[r] < 0; r++)
          this.words[r] += 67108864, this.words[r + 1] -= 1;
      return this.strip();
    }, f.prototype.addn = function(t) {
      return this.clone().iaddn(t);
    }, f.prototype.subn = function(t) {
      return this.clone().isubn(t);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(t, r, i) {
      var h = t.length + i, d;
      this._expand(h);
      var c, v = 0;
      for (d = 0; d < t.length; d++) {
        c = (this.words[d + i] | 0) + v;
        var u = (t.words[d] | 0) * r;
        c -= u & 67108863, v = (c >> 26) - (u / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (s(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, h = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), h.iushln(i), c = d.words[d.length - 1] | 0);
      var u = h.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = h.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (h = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (h.words[d.length + _] | 0) * 67108864 + (h.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), h._ishlnsubmul(d, C, _); h.negative !== 0; )
          C--, h.negative = 0, h._ishlnsubmul(d, 1, _), h.isZero() || (h.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), h.strip(), r !== "div" && i !== 0 && h.iushrn(i), {
        div: e || null,
        mod: h
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var h, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (h = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: h,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (h = c.div.neg()), {
        div: h,
        mod: c.mod
      }) : this.negative & t.negative ? (c = this.neg().divmod(t.neg(), r), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.isub(t)), {
        div: c.div,
        mod: d
      }) : t.length > this.length || this.cmp(t) < 0 ? {
        div: new f(0),
        mod: this
      } : t.length === 1 ? r === "div" ? {
        div: this.divn(t.words[0]),
        mod: null
      } : r === "mod" ? {
        div: null,
        mod: new f(this.modn(t.words[0]))
      } : {
        div: this.divn(t.words[0]),
        mod: new f(this.modn(t.words[0]))
      } : this._wordDiv(t, r);
    }, f.prototype.div = function(t) {
      return this.divmod(t, "div", !1).div;
    }, f.prototype.mod = function(t) {
      return this.divmod(t, "mod", !1).mod;
    }, f.prototype.umod = function(t) {
      return this.divmod(t, "mod", !0).mod;
    }, f.prototype.divRound = function(t) {
      var r = this.divmod(t);
      if (r.mod.isZero())
        return r.div;
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, h = t.ushrn(1), d = t.andln(1), c = i.cmp(h);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, h = this.length - 1; h >= 0; h--)
        i = (r * i + (this.words[h] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = (this.words[i] | 0) + r * 67108864;
        this.words[i] = h / t | 0, r = h % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (h.isOdd() || d.isOdd()) && (h.iadd(e), d.isub(l)), h.iushrn(1), d.iushrn(1);
        for (var C = 0, q = 1; !(i.words[0] & q) && C < 26; ++C, q <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(c), d.isub(v)) : (i.isub(r), c.isub(h), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(u)
      };
    }, f.prototype._invmp = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            h.isOdd() && h.iadd(c), h.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(d)) : (i.isub(r), d.isub(h));
      }
      var b;
      return r.cmpn(1) === 0 ? b = h : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var h = 0; r.isEven() && i.isEven(); h++)
        r.iushrn(1), i.iushrn(1);
      do {
        for (; r.isEven(); )
          r.iushrn(1);
        for (; i.isEven(); )
          i.iushrn(1);
        var d = r.cmp(i);
        if (d < 0) {
          var c = r;
          r = i, i = c;
        } else if (d === 0 || i.cmpn(1) === 0)
          break;
        r.isub(i);
      } while (!0);
      return i.iushln(h);
    }, f.prototype.invm = function(t) {
      return this.egcd(t).a.umod(t);
    }, f.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, f.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, f.prototype.andln = function(t) {
      return this.words[0] & t;
    }, f.prototype.bincn = function(t) {
      s(typeof t == "number");
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= h, this;
      for (var d = h, c = i; d !== 0 && c < this.length; c++) {
        var v = this.words[c] | 0;
        v += d, d = v >>> 26, v &= 67108863, this.words[c] = v;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(t) {
      var r = t < 0;
      if (this.negative !== 0 && !r)
        return -1;
      if (this.negative === 0 && r)
        return 1;
      this.strip();
      var i;
      if (this.length > 1)
        i = 1;
      else {
        r && (t = -t), s(t <= 67108863, "Number is too big");
        var h = this.words[0] | 0;
        i = h === t ? 0 : h < t ? -1 : 1;
      }
      return this.negative !== 0 ? -i | 0 : i;
    }, f.prototype.cmp = function(t) {
      if (this.negative !== 0 && t.negative === 0)
        return -1;
      if (this.negative === 0 && t.negative !== 0)
        return 1;
      var r = this.ucmp(t);
      return this.negative !== 0 ? -r | 0 : r;
    }, f.prototype.ucmp = function(t) {
      if (this.length > t.length)
        return 1;
      if (this.length < t.length)
        return -1;
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = this.words[i] | 0, d = t.words[i] | 0;
        if (h !== d) {
          h < d ? r = -1 : h > d && (r = 1);
          break;
        }
      }
      return r;
    }, f.prototype.gtn = function(t) {
      return this.cmpn(t) === 1;
    }, f.prototype.gt = function(t) {
      return this.cmp(t) === 1;
    }, f.prototype.gten = function(t) {
      return this.cmpn(t) >= 0;
    }, f.prototype.gte = function(t) {
      return this.cmp(t) >= 0;
    }, f.prototype.ltn = function(t) {
      return this.cmpn(t) === -1;
    }, f.prototype.lt = function(t) {
      return this.cmp(t) === -1;
    }, f.prototype.lten = function(t) {
      return this.cmpn(t) <= 0;
    }, f.prototype.lte = function(t) {
      return this.cmp(t) <= 0;
    }, f.prototype.eqn = function(t) {
      return this.cmpn(t) === 0;
    }, f.prototype.eq = function(t) {
      return this.cmp(t) === 0;
    }, f.red = function(t) {
      return new Y(t);
    }, f.prototype.toRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), s(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return s(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return s(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return s(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return s(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return s(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return s(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return s(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return s(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return s(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return s(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return s(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return s(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var lt = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function H(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    H.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, H.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var h = i < this.n ? -1 : r.ucmp(this.p);
      return h === 0 ? (r.words[0] = 0, r.length = 1) : h > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, H.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, H.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function At() {
      H.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(At, H), At.prototype.split = function(t, r) {
      for (var i = 4194303, h = Math.min(t.length, 9), d = 0; d < h; d++)
        r.words[d] = t.words[d];
      if (r.length = h, t.length <= 9) {
        t.words[0] = 0, t.length = 1;
        return;
      }
      var c = t.words[9];
      for (r.words[r.length++] = c & i, d = 10; d < t.length; d++) {
        var v = t.words[d] | 0;
        t.words[d - 10] = (v & i) << 4 | c >>> 22, c = v;
      }
      c >>>= 22, t.words[d - 10] = c, c === 0 && t.length > 10 ? t.length -= 10 : t.length -= 9;
    }, At.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = t.words[i] | 0;
        r += h * 977, t.words[i] = r & 67108863, r = h * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function Bt() {
      H.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(Bt, H);
    function Ct() {
      H.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(Ct, H);
    function Et() {
      H.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(Et, H), Et.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = (t.words[i] | 0) * 19 + r, d = h & 67108863;
        h >>>= 26, t.words[i] = d, r = h;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (lt[t])
        return lt[t];
      var r;
      if (t === "k256")
        r = new At();
      else if (t === "p224")
        r = new Bt();
      else if (t === "p192")
        r = new Ct();
      else if (t === "p25519")
        r = new Et();
      else
        throw new Error("Unknown prime " + t);
      return lt[t] = r, r;
    };
    function Y(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        s(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    Y.prototype._verify1 = function(t) {
      s(t.negative === 0, "red works only with positives"), s(t.red, "red works only with red numbers");
    }, Y.prototype._verify2 = function(t, r) {
      s((t.negative | r.negative) === 0, "red works only with positives"), s(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, Y.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, Y.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, Y.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, Y.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, Y.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, Y.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, Y.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, Y.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, Y.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, Y.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, Y.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, Y.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (s(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var h = this.m.subn(1), d = 0; !h.isZero() && h.andln(1) === 0; )
        d++, h.iushrn(1);
      s(!h.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, h), b = this.pow(t, h.addn(1).iushrn(1)), _ = this.pow(t, h), C = d; _.cmp(c) !== 0; ) {
        for (var q = _, O = 0; q.cmp(c) !== 0; O++)
          q = q.redSqr();
        s(O < C);
        var R = this.pow(l, new f(1).iushln(C - O - 1));
        b = b.redMul(R), l = R.redSqr(), _ = _.redMul(l), C = O;
      }
      return b;
    }, Y.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, Y.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, h = new Array(1 << i);
      h[0] = new f(1).toRed(this), h[1] = t;
      for (var d = 2; d < h.length; d++)
        h[d] = this.mul(h[d - 1], t);
      var c = h[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== h[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, h[v]), u = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, Y.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, Y.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new It(t);
    };
    function It(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(It, Y), It.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, It.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, It.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(a, Xt);
})(G0);
var jm = G0.exports, Uf = {}, Ja;
function Qm() {
  return Ja || (Ja = 1, function(a) {
    var n = sn(), o = Gt, s = a;
    s.define = function(g, y) {
      return new m(g, y);
    };
    function m(f, g) {
      this.name = f, this.body = g, this.decoders = {}, this.encoders = {};
    }
    m.prototype._createNamed = function(g) {
      var y;
      try {
        y = Ne.runInThisContext(
          "(function " + this.name + `(entity) {
  this._initNamed(entity);
})`
        );
      } catch (S) {
        y = function(B) {
          this._initNamed(B);
        };
      }
      return o(y, g), y.prototype._initNamed = function(B) {
        g.call(this, B);
      }, new y(this);
    }, m.prototype._getDecoder = function(g) {
      return g = g || "der", this.decoders.hasOwnProperty(g) || (this.decoders[g] = this._createNamed(n.decoders[g])), this.decoders[g];
    }, m.prototype.decode = function(g, y, S) {
      return this._getDecoder(y).decode(g, S);
    }, m.prototype._getEncoder = function(g) {
      return g = g || "der", this.encoders.hasOwnProperty(g) || (this.encoders[g] = this._createNamed(n.encoders[g])), this.encoders[g];
    }, m.prototype.encode = function(g, y, S) {
      return this._getEncoder(y).encode(g, S);
    };
  }(Uf)), Uf;
}
var Of = {}, Po = {}, t2 = Gt;
function Xe(a) {
  this._reporterState = {
    obj: null,
    path: [],
    options: a || {},
    errors: []
  };
}
Po.Reporter = Xe;
Xe.prototype.isError = function(n) {
  return n instanceof bi;
};
Xe.prototype.save = function() {
  var n = this._reporterState;
  return { obj: n.obj, pathLen: n.path.length };
};
Xe.prototype.restore = function(n) {
  var o = this._reporterState;
  o.obj = n.obj, o.path = o.path.slice(0, n.pathLen);
};
Xe.prototype.enterKey = function(n) {
  return this._reporterState.path.push(n);
};
Xe.prototype.exitKey = function(n) {
  var o = this._reporterState;
  o.path = o.path.slice(0, n - 1);
};
Xe.prototype.leaveKey = function(n, o, s) {
  var m = this._reporterState;
  this.exitKey(n), m.obj !== null && (m.obj[o] = s);
};
Xe.prototype.path = function() {
  return this._reporterState.path.join("/");
};
Xe.prototype.enterObject = function() {
  var n = this._reporterState, o = n.obj;
  return n.obj = {}, o;
};
Xe.prototype.leaveObject = function(n) {
  var o = this._reporterState, s = o.obj;
  return o.obj = n, s;
};
Xe.prototype.error = function(n) {
  var o, s = this._reporterState, m = n instanceof bi;
  if (m ? o = n : o = new bi(s.path.map(function(f) {
    return "[" + JSON.stringify(f) + "]";
  }).join(""), n.message || n, n.stack), !s.options.partial)
    throw o;
  return m || s.errors.push(o), o;
};
Xe.prototype.wrapResult = function(n) {
  var o = this._reporterState;
  return o.options.partial ? {
    result: this.isError(n) ? null : n,
    errors: o.errors
  } : n;
};
function bi(a, n) {
  this.path = a, this.rethrow(n);
}
t2(bi, Error);
bi.prototype.rethrow = function(n) {
  if (this.message = n + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, bi), !this.stack)
    try {
      throw new Error(this.message);
    } catch (o) {
      this.stack = o.stack;
    }
  return this;
};
var mn = {}, Ga;
function Xa() {
  if (Ga)
    return mn;
  Ga = 1;
  var a = Gt, n = zi().Reporter, o = br.Buffer;
  function s(f, g) {
    if (n.call(this, g), !o.isBuffer(f)) {
      this.error("Input not Buffer");
      return;
    }
    this.base = f, this.offset = 0, this.length = f.length;
  }
  a(s, n), mn.DecoderBuffer = s, s.prototype.save = function() {
    return { offset: this.offset, reporter: n.prototype.save.call(this) };
  }, s.prototype.restore = function(g) {
    var y = new s(this.base);
    return y.offset = g.offset, y.length = this.offset, this.offset = g.offset, n.prototype.restore.call(this, g.reporter), y;
  }, s.prototype.isEmpty = function() {
    return this.offset === this.length;
  }, s.prototype.readUInt8 = function(g) {
    return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(g || "DecoderBuffer overrun");
  }, s.prototype.skip = function(g, y) {
    if (!(this.offset + g <= this.length))
      return this.error(y || "DecoderBuffer overrun");
    var S = new s(this.base);
    return S._reporterState = this._reporterState, S.offset = this.offset, S.length = this.offset + g, this.offset += g, S;
  }, s.prototype.raw = function(g) {
    return this.base.slice(g ? g.offset : this.offset, this.length);
  };
  function m(f, g) {
    if (Array.isArray(f))
      this.length = 0, this.value = f.map(function(y) {
        return y instanceof m || (y = new m(y, g)), this.length += y.length, y;
      }, this);
    else if (typeof f == "number") {
      if (!(0 <= f && f <= 255))
        return g.error("non-byte EncoderBuffer value");
      this.value = f, this.length = 1;
    } else if (typeof f == "string")
      this.value = f, this.length = o.byteLength(f);
    else if (o.isBuffer(f))
      this.value = f, this.length = f.length;
    else
      return g.error("Unsupported type: " + typeof f);
  }
  return mn.EncoderBuffer = m, m.prototype.join = function(g, y) {
    return g || (g = new o(this.length)), y || (y = 0), this.length === 0 || (Array.isArray(this.value) ? this.value.forEach(function(S) {
      S.join(g, y), y += S.length;
    }) : (typeof this.value == "number" ? g[y] = this.value : typeof this.value == "string" ? g.write(this.value, y) : o.isBuffer(this.value) && this.value.copy(g, y), y += this.length)), g;
  }, mn;
}
var zf, ja;
function e2() {
  if (ja)
    return zf;
  ja = 1;
  var a = zi().Reporter, n = zi().EncoderBuffer, o = zi().DecoderBuffer, s = Ve, m = [
    "seq",
    "seqof",
    "set",
    "setof",
    "objid",
    "bool",
    "gentime",
    "utctime",
    "null_",
    "enum",
    "int",
    "objDesc",
    "bitstr",
    "bmpstr",
    "charstr",
    "genstr",
    "graphstr",
    "ia5str",
    "iso646str",
    "numstr",
    "octstr",
    "printstr",
    "t61str",
    "unistr",
    "utf8str",
    "videostr"
  ], f = [
    "key",
    "obj",
    "use",
    "optional",
    "explicit",
    "implicit",
    "def",
    "choice",
    "any",
    "contains"
  ].concat(m), g = [
    "_peekTag",
    "_decodeTag",
    "_use",
    "_decodeStr",
    "_decodeObjid",
    "_decodeTime",
    "_decodeNull",
    "_decodeInt",
    "_decodeBool",
    "_decodeList",
    "_encodeComposite",
    "_encodeStr",
    "_encodeObjid",
    "_encodeTime",
    "_encodeNull",
    "_encodeInt",
    "_encodeBool"
  ];
  function y(B, M) {
    var x = {};
    this._baseState = x, x.enc = B, x.parent = M || null, x.children = null, x.tag = null, x.args = null, x.reverseArgs = null, x.choice = null, x.optional = !1, x.any = !1, x.obj = !1, x.use = null, x.useDecoder = null, x.key = null, x.default = null, x.explicit = null, x.implicit = null, x.contains = null, x.parent || (x.children = [], this._wrap());
  }
  zf = y;
  var S = [
    "enc",
    "parent",
    "children",
    "tag",
    "args",
    "reverseArgs",
    "choice",
    "optional",
    "any",
    "obj",
    "use",
    "alteredUse",
    "key",
    "default",
    "explicit",
    "implicit",
    "contains"
  ];
  return y.prototype.clone = function() {
    var M = this._baseState, x = {};
    S.forEach(function(k) {
      x[k] = M[k];
    });
    var I = new this.constructor(x.parent);
    return I._baseState = x, I;
  }, y.prototype._wrap = function() {
    var M = this._baseState;
    f.forEach(function(x) {
      this[x] = function() {
        var k = new this.constructor(this);
        return M.children.push(k), k[x].apply(k, arguments);
      };
    }, this);
  }, y.prototype._init = function(M) {
    var x = this._baseState;
    s(x.parent === null), M.call(this), x.children = x.children.filter(function(I) {
      return I._baseState.parent === this;
    }, this), s.equal(x.children.length, 1, "Root node can have only one child");
  }, y.prototype._useArgs = function(M) {
    var x = this._baseState, I = M.filter(function(k) {
      return k instanceof this.constructor;
    }, this);
    M = M.filter(function(k) {
      return !(k instanceof this.constructor);
    }, this), I.length !== 0 && (s(x.children === null), x.children = I, I.forEach(function(k) {
      k._baseState.parent = this;
    }, this)), M.length !== 0 && (s(x.args === null), x.args = M, x.reverseArgs = M.map(function(k) {
      if (typeof k != "object" || k.constructor !== Object)
        return k;
      var D = {};
      return Object.keys(k).forEach(function(U) {
        U == (U | 0) && (U |= 0);
        var W = k[U];
        D[W] = U;
      }), D;
    }));
  }, g.forEach(function(B) {
    y.prototype[B] = function() {
      var x = this._baseState;
      throw new Error(B + " not implemented for encoding: " + x.enc);
    };
  }), m.forEach(function(B) {
    y.prototype[B] = function() {
      var x = this._baseState, I = Array.prototype.slice.call(arguments);
      return s(x.tag === null), x.tag = B, this._useArgs(I), this;
    };
  }), y.prototype.use = function(M) {
    s(M);
    var x = this._baseState;
    return s(x.use === null), x.use = M, this;
  }, y.prototype.optional = function() {
    var M = this._baseState;
    return M.optional = !0, this;
  }, y.prototype.def = function(M) {
    var x = this._baseState;
    return s(x.default === null), x.default = M, x.optional = !0, this;
  }, y.prototype.explicit = function(M) {
    var x = this._baseState;
    return s(x.explicit === null && x.implicit === null), x.explicit = M, this;
  }, y.prototype.implicit = function(M) {
    var x = this._baseState;
    return s(x.explicit === null && x.implicit === null), x.implicit = M, this;
  }, y.prototype.obj = function() {
    var M = this._baseState, x = Array.prototype.slice.call(arguments);
    return M.obj = !0, x.length !== 0 && this._useArgs(x), this;
  }, y.prototype.key = function(M) {
    var x = this._baseState;
    return s(x.key === null), x.key = M, this;
  }, y.prototype.any = function() {
    var M = this._baseState;
    return M.any = !0, this;
  }, y.prototype.choice = function(M) {
    var x = this._baseState;
    return s(x.choice === null), x.choice = M, this._useArgs(Object.keys(M).map(function(I) {
      return M[I];
    })), this;
  }, y.prototype.contains = function(M) {
    var x = this._baseState;
    return s(x.use === null), x.contains = M, this;
  }, y.prototype._decode = function(M, x) {
    var I = this._baseState;
    if (I.parent === null)
      return M.wrapResult(I.children[0]._decode(M, x));
    var k = I.default, D = !0, U = null;
    if (I.key !== null && (U = M.enterKey(I.key)), I.optional) {
      var W = null;
      if (I.explicit !== null ? W = I.explicit : I.implicit !== null ? W = I.implicit : I.tag !== null && (W = I.tag), W === null && !I.any) {
        var z = M.save();
        try {
          I.choice === null ? this._decodeGeneric(I.tag, M, x) : this._decodeChoice(M, x), D = !0;
        } catch (Ct) {
          D = !1;
        }
        M.restore(z);
      } else if (D = this._peekTag(M, W, I.any), M.isError(D))
        return D;
    }
    var $;
    if (I.obj && D && ($ = M.enterObject()), D) {
      if (I.explicit !== null) {
        var lt = this._decodeTag(M, I.explicit);
        if (M.isError(lt))
          return lt;
        M = lt;
      }
      var H = M.offset;
      if (I.use === null && I.choice === null) {
        if (I.any)
          var z = M.save();
        var At = this._decodeTag(
          M,
          I.implicit !== null ? I.implicit : I.tag,
          I.any
        );
        if (M.isError(At))
          return At;
        I.any ? k = M.raw(z) : M = At;
      }
      if (x && x.track && I.tag !== null && x.track(M.path(), H, M.length, "tagged"), x && x.track && I.tag !== null && x.track(M.path(), M.offset, M.length, "content"), I.any ? k = k : I.choice === null ? k = this._decodeGeneric(I.tag, M, x) : k = this._decodeChoice(M, x), M.isError(k))
        return k;
      if (!I.any && I.choice === null && I.children !== null && I.children.forEach(function(Et) {
        Et._decode(M, x);
      }), I.contains && (I.tag === "octstr" || I.tag === "bitstr")) {
        var Bt = new o(k);
        k = this._getUse(I.contains, M._reporterState.obj)._decode(Bt, x);
      }
    }
    return I.obj && D && (k = M.leaveObject($)), I.key !== null && (k !== null || D === !0) ? M.leaveKey(U, I.key, k) : U !== null && M.exitKey(U), k;
  }, y.prototype._decodeGeneric = function(M, x, I) {
    var k = this._baseState;
    return M === "seq" || M === "set" ? null : M === "seqof" || M === "setof" ? this._decodeList(x, M, k.args[0], I) : /str$/.test(M) ? this._decodeStr(x, M, I) : M === "objid" && k.args ? this._decodeObjid(x, k.args[0], k.args[1], I) : M === "objid" ? this._decodeObjid(x, null, null, I) : M === "gentime" || M === "utctime" ? this._decodeTime(x, M, I) : M === "null_" ? this._decodeNull(x, I) : M === "bool" ? this._decodeBool(x, I) : M === "objDesc" ? this._decodeStr(x, M, I) : M === "int" || M === "enum" ? this._decodeInt(x, k.args && k.args[0], I) : k.use !== null ? this._getUse(k.use, x._reporterState.obj)._decode(x, I) : x.error("unknown tag: " + M);
  }, y.prototype._getUse = function(M, x) {
    var I = this._baseState;
    return I.useDecoder = this._use(M, x), s(I.useDecoder._baseState.parent === null), I.useDecoder = I.useDecoder._baseState.children[0], I.implicit !== I.useDecoder._baseState.implicit && (I.useDecoder = I.useDecoder.clone(), I.useDecoder._baseState.implicit = I.implicit), I.useDecoder;
  }, y.prototype._decodeChoice = function(M, x) {
    var I = this._baseState, k = null, D = !1;
    return Object.keys(I.choice).some(function(U) {
      var W = M.save(), z = I.choice[U];
      try {
        var $ = z._decode(M, x);
        if (M.isError($))
          return !1;
        k = { type: U, value: $ }, D = !0;
      } catch (lt) {
        return M.restore(W), !1;
      }
      return !0;
    }, this), D ? k : M.error("Choice not matched");
  }, y.prototype._createEncoderBuffer = function(M) {
    return new n(M, this.reporter);
  }, y.prototype._encode = function(M, x, I) {
    var k = this._baseState;
    if (!(k.default !== null && k.default === M)) {
      var D = this._encodeValue(M, x, I);
      if (D !== void 0 && !this._skipDefault(D, x, I))
        return D;
    }
  }, y.prototype._encodeValue = function(M, x, I) {
    var k = this._baseState;
    if (k.parent === null)
      return k.children[0]._encode(M, x || new a());
    var z = null;
    if (this.reporter = x, k.optional && M === void 0)
      if (k.default !== null)
        M = k.default;
      else
        return;
    var D = null, U = !1;
    if (k.any)
      z = this._createEncoderBuffer(M);
    else if (k.choice)
      z = this._encodeChoice(M, x);
    else if (k.contains)
      D = this._getUse(k.contains, I)._encode(M, x), U = !0;
    else if (k.children)
      D = k.children.map(function(H) {
        if (H._baseState.tag === "null_")
          return H._encode(null, x, M);
        if (H._baseState.key === null)
          return x.error("Child should have a key");
        var At = x.enterKey(H._baseState.key);
        if (typeof M != "object")
          return x.error("Child expected, but input is not object");
        var Bt = H._encode(M[H._baseState.key], x, M);
        return x.leaveKey(At), Bt;
      }, this).filter(function(H) {
        return H;
      }), D = this._createEncoderBuffer(D);
    else if (k.tag === "seqof" || k.tag === "setof") {
      if (!(k.args && k.args.length === 1))
        return x.error("Too many args for : " + k.tag);
      if (!Array.isArray(M))
        return x.error("seqof/setof, but data is not Array");
      var W = this.clone();
      W._baseState.implicit = null, D = this._createEncoderBuffer(M.map(function(H) {
        var At = this._baseState;
        return this._getUse(At.args[0], M)._encode(H, x);
      }, W));
    } else
      k.use !== null ? z = this._getUse(k.use, I)._encode(M, x) : (D = this._encodePrimitive(k.tag, M), U = !0);
    var z;
    if (!k.any && k.choice === null) {
      var $ = k.implicit !== null ? k.implicit : k.tag, lt = k.implicit === null ? "universal" : "context";
      $ === null ? k.use === null && x.error("Tag could be omitted only for .use()") : k.use === null && (z = this._encodeComposite($, U, lt, D));
    }
    return k.explicit !== null && (z = this._encodeComposite(k.explicit, !1, "context", z)), z;
  }, y.prototype._encodeChoice = function(M, x) {
    var I = this._baseState, k = I.choice[M.type];
    return k || s(
      !1,
      M.type + " not found in " + JSON.stringify(Object.keys(I.choice))
    ), k._encode(M.value, x);
  }, y.prototype._encodePrimitive = function(M, x) {
    var I = this._baseState;
    if (/str$/.test(M))
      return this._encodeStr(x, M);
    if (M === "objid" && I.args)
      return this._encodeObjid(x, I.reverseArgs[0], I.args[1]);
    if (M === "objid")
      return this._encodeObjid(x, null, null);
    if (M === "gentime" || M === "utctime")
      return this._encodeTime(x, M);
    if (M === "null_")
      return this._encodeNull();
    if (M === "int" || M === "enum")
      return this._encodeInt(x, I.args && I.reverseArgs[0]);
    if (M === "bool")
      return this._encodeBool(x);
    if (M === "objDesc")
      return this._encodeStr(x, M);
    throw new Error("Unsupported tag: " + M);
  }, y.prototype._isNumstr = function(M) {
    return /^[0-9 ]*$/.test(M);
  }, y.prototype._isPrintstr = function(M) {
    return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(M);
  }, zf;
}
var Qa;
function zi() {
  return Qa || (Qa = 1, function(a) {
    var n = a;
    n.Reporter = Po.Reporter, n.DecoderBuffer = Xa().DecoderBuffer, n.EncoderBuffer = Xa().EncoderBuffer, n.Node = e2();
  }(Of)), Of;
}
var Kf = {}, Hf = {}, th;
function r2() {
  return th || (th = 1, function(a) {
    var n = Do();
    a.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    }, a.tagClassByName = n._reverse(a.tagClass), a.tag = {
      0: "end",
      1: "bool",
      2: "int",
      3: "bitstr",
      4: "octstr",
      5: "null_",
      6: "objid",
      7: "objDesc",
      8: "external",
      9: "real",
      10: "enum",
      11: "embed",
      12: "utf8str",
      13: "relativeOid",
      16: "seq",
      17: "set",
      18: "numstr",
      19: "printstr",
      20: "t61str",
      21: "videostr",
      22: "ia5str",
      23: "utctime",
      24: "gentime",
      25: "graphstr",
      26: "iso646str",
      27: "genstr",
      28: "unistr",
      29: "charstr",
      30: "bmpstr"
    }, a.tagByName = n._reverse(a.tag);
  }(Hf)), Hf;
}
var eh;
function Do() {
  return eh || (eh = 1, function(a) {
    var n = a;
    n._reverse = function(s) {
      var m = {};
      return Object.keys(s).forEach(function(f) {
        (f | 0) == f && (f = f | 0);
        var g = s[f];
        m[g] = f;
      }), m;
    }, n.der = r2();
  }(Kf)), Kf;
}
var Zf = {}, Wf, rh;
function No() {
  if (rh)
    return Wf;
  rh = 1;
  var a = Gt, n = sn(), o = n.base, s = n.bignum, m = n.constants.der;
  function f(B) {
    this.enc = "der", this.name = B.name, this.entity = B, this.tree = new g(), this.tree._init(B.body);
  }
  Wf = f, f.prototype.decode = function(M, x) {
    return M instanceof o.DecoderBuffer || (M = new o.DecoderBuffer(M, x)), this.tree._decode(M, x);
  };
  function g(B) {
    o.Node.call(this, "der", B);
  }
  a(g, o.Node), g.prototype._peekTag = function(M, x, I) {
    if (M.isEmpty())
      return !1;
    var k = M.save(), D = y(M, 'Failed to peek tag: "' + x + '"');
    return M.isError(D) ? D : (M.restore(k), D.tag === x || D.tagStr === x || D.tagStr + "of" === x || I);
  }, g.prototype._decodeTag = function(M, x, I) {
    var k = y(
      M,
      'Failed to decode tag of "' + x + '"'
    );
    if (M.isError(k))
      return k;
    var D = S(
      M,
      k.primitive,
      'Failed to get length of "' + x + '"'
    );
    if (M.isError(D))
      return D;
    if (!I && k.tag !== x && k.tagStr !== x && k.tagStr + "of" !== x)
      return M.error('Failed to match tag: "' + x + '"');
    if (k.primitive || D !== null)
      return M.skip(D, 'Failed to match body of: "' + x + '"');
    var U = M.save(), W = this._skipUntilEnd(
      M,
      'Failed to skip indefinite length body: "' + this.tag + '"'
    );
    return M.isError(W) ? W : (D = M.offset - U.offset, M.restore(U), M.skip(D, 'Failed to match body of: "' + x + '"'));
  }, g.prototype._skipUntilEnd = function(M, x) {
    for (; ; ) {
      var I = y(M, x);
      if (M.isError(I))
        return I;
      var k = S(M, I.primitive, x);
      if (M.isError(k))
        return k;
      var D;
      if (I.primitive || k !== null ? D = M.skip(k) : D = this._skipUntilEnd(M, x), M.isError(D))
        return D;
      if (I.tagStr === "end")
        break;
    }
  }, g.prototype._decodeList = function(M, x, I, k) {
    for (var D = []; !M.isEmpty(); ) {
      var U = this._peekTag(M, "end");
      if (M.isError(U))
        return U;
      var W = I.decode(M, "der", k);
      if (M.isError(W) && U)
        break;
      D.push(W);
    }
    return D;
  }, g.prototype._decodeStr = function(M, x) {
    if (x === "bitstr") {
      var I = M.readUInt8();
      return M.isError(I) ? I : { unused: I, data: M.raw() };
    } else if (x === "bmpstr") {
      var k = M.raw();
      if (k.length % 2 === 1)
        return M.error("Decoding of string type: bmpstr length mismatch");
      for (var D = "", U = 0; U < k.length / 2; U++)
        D += String.fromCharCode(k.readUInt16BE(U * 2));
      return D;
    } else if (x === "numstr") {
      var W = M.raw().toString("ascii");
      return this._isNumstr(W) ? W : M.error("Decoding of string type: numstr unsupported characters");
    } else {
      if (x === "octstr")
        return M.raw();
      if (x === "objDesc")
        return M.raw();
      if (x === "printstr") {
        var z = M.raw().toString("ascii");
        return this._isPrintstr(z) ? z : M.error("Decoding of string type: printstr unsupported characters");
      } else
        return /str$/.test(x) ? M.raw().toString() : M.error("Decoding of string type: " + x + " unsupported");
    }
  }, g.prototype._decodeObjid = function(M, x, I) {
    for (var k, D = [], U = 0; !M.isEmpty(); ) {
      var W = M.readUInt8();
      U <<= 7, U |= W & 127, W & 128 || (D.push(U), U = 0);
    }
    W & 128 && D.push(U);
    var z = D[0] / 40 | 0, $ = D[0] % 40;
    if (I ? k = D : k = [z, $].concat(D.slice(1)), x) {
      var lt = x[k.join(" ")];
      lt === void 0 && (lt = x[k.join(".")]), lt !== void 0 && (k = lt);
    }
    return k;
  }, g.prototype._decodeTime = function(M, x) {
    var I = M.raw().toString();
    if (x === "gentime")
      var k = I.slice(0, 4) | 0, D = I.slice(4, 6) | 0, U = I.slice(6, 8) | 0, W = I.slice(8, 10) | 0, z = I.slice(10, 12) | 0, $ = I.slice(12, 14) | 0;
    else if (x === "utctime") {
      var k = I.slice(0, 2) | 0, D = I.slice(2, 4) | 0, U = I.slice(4, 6) | 0, W = I.slice(6, 8) | 0, z = I.slice(8, 10) | 0, $ = I.slice(10, 12) | 0;
      k < 70 ? k = 2e3 + k : k = 1900 + k;
    } else
      return M.error("Decoding " + x + " time is not supported yet");
    return Date.UTC(k, D - 1, U, W, z, $, 0);
  }, g.prototype._decodeNull = function(M) {
    return null;
  }, g.prototype._decodeBool = function(M) {
    var x = M.readUInt8();
    return M.isError(x) ? x : x !== 0;
  }, g.prototype._decodeInt = function(M, x) {
    var I = M.raw(), k = new s(I);
    return x && (k = x[k.toString(10)] || k), k;
  }, g.prototype._use = function(M, x) {
    return typeof M == "function" && (M = M(x)), M._getDecoder("der").tree;
  };
  function y(B, M) {
    var x = B.readUInt8(M);
    if (B.isError(x))
      return x;
    var I = m.tagClass[x >> 6], k = (x & 32) === 0;
    if ((x & 31) === 31) {
      var D = x;
      for (x = 0; (D & 128) === 128; ) {
        if (D = B.readUInt8(M), B.isError(D))
          return D;
        x <<= 7, x |= D & 127;
      }
    } else
      x &= 31;
    var U = m.tag[x];
    return {
      cls: I,
      primitive: k,
      tag: x,
      tagStr: U
    };
  }
  function S(B, M, x) {
    var I = B.readUInt8(x);
    if (B.isError(I))
      return I;
    if (!M && I === 128)
      return null;
    if (!(I & 128))
      return I;
    var k = I & 127;
    if (k > 4)
      return B.error("length octect is too long");
    I = 0;
    for (var D = 0; D < k; D++) {
      I <<= 8;
      var U = B.readUInt8(x);
      if (B.isError(U))
        return U;
      I |= U;
    }
    return I;
  }
  return Wf;
}
var Vf, ih;
function i2() {
  if (ih)
    return Vf;
  ih = 1;
  var a = Gt, n = br.Buffer, o = No();
  function s(m) {
    o.call(this, m), this.enc = "pem";
  }
  return a(s, o), Vf = s, s.prototype.decode = function(f, g) {
    for (var y = f.toString().split(/[\r\n]+/g), S = g.label.toUpperCase(), B = /^-----(BEGIN|END) ([^-]+)-----$/, M = -1, x = -1, I = 0; I < y.length; I++) {
      var k = y[I].match(B);
      if (k !== null && k[2] === S)
        if (M === -1) {
          if (k[1] !== "BEGIN")
            break;
          M = I;
        } else {
          if (k[1] !== "END")
            break;
          x = I;
          break;
        }
    }
    if (M === -1 || x === -1)
      throw new Error("PEM section not found for: " + S);
    var D = y.slice(M + 1, x).join("");
    D.replace(/[^a-z0-9\+\/=]+/gi, "");
    var U = new n(D, "base64");
    return o.prototype.decode.call(this, U, g);
  }, Vf;
}
var nh;
function n2() {
  return nh || (nh = 1, function(a) {
    var n = a;
    n.der = No(), n.pem = i2();
  }(Zf)), Zf;
}
var Yf = {}, Jf, fh;
function $o() {
  if (fh)
    return Jf;
  fh = 1;
  var a = Gt, n = br.Buffer, o = sn(), s = o.base, m = o.constants.der;
  function f(B) {
    this.enc = "der", this.name = B.name, this.entity = B, this.tree = new g(), this.tree._init(B.body);
  }
  Jf = f, f.prototype.encode = function(M, x) {
    return this.tree._encode(M, x).join();
  };
  function g(B) {
    s.Node.call(this, "der", B);
  }
  a(g, s.Node), g.prototype._encodeComposite = function(M, x, I, k) {
    var D = S(M, x, I, this.reporter);
    if (k.length < 128) {
      var z = new n(2);
      return z[0] = D, z[1] = k.length, this._createEncoderBuffer([z, k]);
    }
    for (var U = 1, W = k.length; W >= 256; W >>= 8)
      U++;
    var z = new n(1 + 1 + U);
    z[0] = D, z[1] = 128 | U;
    for (var W = 1 + U, $ = k.length; $ > 0; W--, $ >>= 8)
      z[W] = $ & 255;
    return this._createEncoderBuffer([z, k]);
  }, g.prototype._encodeStr = function(M, x) {
    if (x === "bitstr")
      return this._createEncoderBuffer([M.unused | 0, M.data]);
    if (x === "bmpstr") {
      for (var I = new n(M.length * 2), k = 0; k < M.length; k++)
        I.writeUInt16BE(M.charCodeAt(k), k * 2);
      return this._createEncoderBuffer(I);
    } else
      return x === "numstr" ? this._isNumstr(M) ? this._createEncoderBuffer(M) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : x === "printstr" ? this._isPrintstr(M) ? this._createEncoderBuffer(M) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(x) ? this._createEncoderBuffer(M) : x === "objDesc" ? this._createEncoderBuffer(M) : this.reporter.error("Encoding of string type: " + x + " unsupported");
  }, g.prototype._encodeObjid = function(M, x, I) {
    if (typeof M == "string") {
      if (!x)
        return this.reporter.error("string objid given, but no values map found");
      if (!x.hasOwnProperty(M))
        return this.reporter.error("objid not found in values map");
      M = x[M].split(/[\s\.]+/g);
      for (var k = 0; k < M.length; k++)
        M[k] |= 0;
    } else if (Array.isArray(M)) {
      M = M.slice();
      for (var k = 0; k < M.length; k++)
        M[k] |= 0;
    }
    if (!Array.isArray(M))
      return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(M));
    if (!I) {
      if (M[1] >= 40)
        return this.reporter.error("Second objid identifier OOB");
      M.splice(0, 2, M[0] * 40 + M[1]);
    }
    for (var D = 0, k = 0; k < M.length; k++) {
      var U = M[k];
      for (D++; U >= 128; U >>= 7)
        D++;
    }
    for (var W = new n(D), z = W.length - 1, k = M.length - 1; k >= 0; k--) {
      var U = M[k];
      for (W[z--] = U & 127; (U >>= 7) > 0; )
        W[z--] = 128 | U & 127;
    }
    return this._createEncoderBuffer(W);
  };
  function y(B) {
    return B < 10 ? "0" + B : B;
  }
  g.prototype._encodeTime = function(M, x) {
    var I, k = new Date(M);
    return x === "gentime" ? I = [
      y(k.getFullYear()),
      y(k.getUTCMonth() + 1),
      y(k.getUTCDate()),
      y(k.getUTCHours()),
      y(k.getUTCMinutes()),
      y(k.getUTCSeconds()),
      "Z"
    ].join("") : x === "utctime" ? I = [
      y(k.getFullYear() % 100),
      y(k.getUTCMonth() + 1),
      y(k.getUTCDate()),
      y(k.getUTCHours()),
      y(k.getUTCMinutes()),
      y(k.getUTCSeconds()),
      "Z"
    ].join("") : this.reporter.error("Encoding " + x + " time is not supported yet"), this._encodeStr(I, "octstr");
  }, g.prototype._encodeNull = function() {
    return this._createEncoderBuffer("");
  }, g.prototype._encodeInt = function(M, x) {
    if (typeof M == "string") {
      if (!x)
        return this.reporter.error("String int or enum given, but no values map");
      if (!x.hasOwnProperty(M))
        return this.reporter.error("Values map doesn't contain: " + JSON.stringify(M));
      M = x[M];
    }
    if (typeof M != "number" && !n.isBuffer(M)) {
      var I = M.toArray();
      !M.sign && I[0] & 128 && I.unshift(0), M = new n(I);
    }
    if (n.isBuffer(M)) {
      var k = M.length;
      M.length === 0 && k++;
      var U = new n(k);
      return M.copy(U), M.length === 0 && (U[0] = 0), this._createEncoderBuffer(U);
    }
    if (M < 128)
      return this._createEncoderBuffer(M);
    if (M < 256)
      return this._createEncoderBuffer([0, M]);
    for (var k = 1, D = M; D >= 256; D >>= 8)
      k++;
    for (var U = new Array(k), D = U.length - 1; D >= 0; D--)
      U[D] = M & 255, M >>= 8;
    return U[0] & 128 && U.unshift(0), this._createEncoderBuffer(new n(U));
  }, g.prototype._encodeBool = function(M) {
    return this._createEncoderBuffer(M ? 255 : 0);
  }, g.prototype._use = function(M, x) {
    return typeof M == "function" && (M = M(x)), M._getEncoder("der").tree;
  }, g.prototype._skipDefault = function(M, x, I) {
    var k = this._baseState, D;
    if (k.default === null)
      return !1;
    var U = M.join();
    if (k.defaultBuffer === void 0 && (k.defaultBuffer = this._encodeValue(k.default, x, I).join()), U.length !== k.defaultBuffer.length)
      return !1;
    for (D = 0; D < U.length; D++)
      if (U[D] !== k.defaultBuffer[D])
        return !1;
    return !0;
  };
  function S(B, M, x, I) {
    var k;
    if (B === "seqof" ? B = "seq" : B === "setof" && (B = "set"), m.tagByName.hasOwnProperty(B))
      k = m.tagByName[B];
    else if (typeof B == "number" && (B | 0) === B)
      k = B;
    else
      return I.error("Unknown tag: " + B);
    return k >= 31 ? I.error("Multi-octet tag encoding unsupported") : (M || (k |= 32), k |= m.tagClassByName[x || "universal"] << 6, k);
  }
  return Jf;
}
var Gf, ah;
function f2() {
  if (ah)
    return Gf;
  ah = 1;
  var a = Gt, n = $o();
  function o(s) {
    n.call(this, s), this.enc = "pem";
  }
  return a(o, n), Gf = o, o.prototype.encode = function(m, f) {
    for (var g = n.prototype.encode.call(this, m), y = g.toString("base64"), S = ["-----BEGIN " + f.label + "-----"], B = 0; B < y.length; B += 64)
      S.push(y.slice(B, B + 64));
    return S.push("-----END " + f.label + "-----"), S.join(`
`);
  }, Gf;
}
var hh;
function a2() {
  return hh || (hh = 1, function(a) {
    var n = a;
    n.der = $o(), n.pem = f2();
  }(Yf)), Yf;
}
var sh;
function sn() {
  return sh || (sh = 1, function(a) {
    var n = a;
    n.bignum = jm, n.define = Qm().define, n.base = zi(), n.constants = Do(), n.decoders = n2(), n.encoders = a2();
  }(Lf)), Lf;
}
var nr = sn(), oh = nr.define("Time", function() {
  this.choice({
    utcTime: this.utctime(),
    generalTime: this.gentime()
  });
}), h2 = nr.define("AttributeTypeValue", function() {
  this.seq().obj(
    this.key("type").objid(),
    this.key("value").any()
  );
}), X0 = nr.define("AlgorithmIdentifier", function() {
  this.seq().obj(
    this.key("algorithm").objid(),
    this.key("parameters").optional(),
    this.key("curve").objid().optional()
  );
}), s2 = nr.define("SubjectPublicKeyInfo", function() {
  this.seq().obj(
    this.key("algorithm").use(X0),
    this.key("subjectPublicKey").bitstr()
  );
}), o2 = nr.define("RelativeDistinguishedName", function() {
  this.setof(h2);
}), u2 = nr.define("RDNSequence", function() {
  this.seqof(o2);
}), uh = nr.define("Name", function() {
  this.choice({
    rdnSequence: this.use(u2)
  });
}), l2 = nr.define("Validity", function() {
  this.seq().obj(
    this.key("notBefore").use(oh),
    this.key("notAfter").use(oh)
  );
}), d2 = nr.define("Extension", function() {
  this.seq().obj(
    this.key("extnID").objid(),
    this.key("critical").bool().def(!1),
    this.key("extnValue").octstr()
  );
}), c2 = nr.define("TBSCertificate", function() {
  this.seq().obj(
    this.key("version").explicit(0).int().optional(),
    this.key("serialNumber").int(),
    this.key("signature").use(X0),
    this.key("issuer").use(uh),
    this.key("validity").use(l2),
    this.key("subject").use(uh),
    this.key("subjectPublicKeyInfo").use(s2),
    this.key("issuerUniqueID").implicit(1).bitstr().optional(),
    this.key("subjectUniqueID").implicit(2).bitstr().optional(),
    this.key("extensions").explicit(3).seqof(d2).optional()
  );
}), v2 = nr.define("X509Certificate", function() {
  this.seq().obj(
    this.key("tbsCertificate").use(c2),
    this.key("signatureAlgorithm").use(X0),
    this.key("signatureValue").bitstr()
  );
}), p2 = v2, fr = sn();
ir.certificate = p2;
var m2 = fr.define("RSAPrivateKey", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("modulus").int(),
    this.key("publicExponent").int(),
    this.key("privateExponent").int(),
    this.key("prime1").int(),
    this.key("prime2").int(),
    this.key("exponent1").int(),
    this.key("exponent2").int(),
    this.key("coefficient").int()
  );
});
ir.RSAPrivateKey = m2;
var g2 = fr.define("RSAPublicKey", function() {
  this.seq().obj(
    this.key("modulus").int(),
    this.key("publicExponent").int()
  );
});
ir.RSAPublicKey = g2;
var Lo = fr.define("AlgorithmIdentifier", function() {
  this.seq().obj(
    this.key("algorithm").objid(),
    this.key("none").null_().optional(),
    this.key("curve").objid().optional(),
    this.key("params").seq().obj(
      this.key("p").int(),
      this.key("q").int(),
      this.key("g").int()
    ).optional()
  );
}), b2 = fr.define("SubjectPublicKeyInfo", function() {
  this.seq().obj(
    this.key("algorithm").use(Lo),
    this.key("subjectPublicKey").bitstr()
  );
});
ir.PublicKey = b2;
var y2 = fr.define("PrivateKeyInfo", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("algorithm").use(Lo),
    this.key("subjectPrivateKey").octstr()
  );
});
ir.PrivateKey = y2;
var w2 = fr.define("EncryptedPrivateKeyInfo", function() {
  this.seq().obj(
    this.key("algorithm").seq().obj(
      this.key("id").objid(),
      this.key("decrypt").seq().obj(
        this.key("kde").seq().obj(
          this.key("id").objid(),
          this.key("kdeparams").seq().obj(
            this.key("salt").octstr(),
            this.key("iters").int()
          )
        ),
        this.key("cipher").seq().obj(
          this.key("algo").objid(),
          this.key("iv").octstr()
        )
      )
    ),
    this.key("subjectPrivateKey").octstr()
  );
});
ir.EncryptedPrivateKey = w2;
var M2 = fr.define("DSAPrivateKey", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("p").int(),
    this.key("q").int(),
    this.key("g").int(),
    this.key("pub_key").int(),
    this.key("priv_key").int()
  );
});
ir.DSAPrivateKey = M2;
ir.DSAparam = fr.define("DSAparam", function() {
  this.int();
});
var x2 = fr.define("ECParameters", function() {
  this.choice({
    namedCurve: this.objid()
  });
}), _2 = fr.define("ECPrivateKey", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("privateKey").octstr(),
    this.key("parameters").optional().explicit(0).use(x2),
    this.key("publicKey").optional().explicit(1).bitstr()
  );
});
ir.ECPrivateKey = _2;
ir.signature = fr.define("signature", function() {
  this.seq().obj(
    this.key("r").int(),
    this.key("s").int()
  );
});
const S2 = {
  "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
  "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
  "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
  "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
  "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
  "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
  "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
  "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
  "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
  "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
  "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
  "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
};
var A2 = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m, B2 = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m, E2 = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m, k2 = Yn, I2 = Oe, gn = zt.Buffer, R2 = function(a, n) {
  var o = a.toString(), s = o.match(A2), m;
  if (s) {
    var g = "aes" + s[1], y = gn.from(s[2], "hex"), S = gn.from(s[3].replace(/[\r\n]/g, ""), "base64"), B = k2(n, y.slice(0, 8), parseInt(s[1], 10)).key, M = [], x = I2.createDecipheriv(g, B, y);
    M.push(x.update(S)), M.push(x.final()), m = gn.concat(M);
  } else {
    var f = o.match(E2);
    m = gn.from(f[2].replace(/[\r\n]/g, ""), "base64");
  }
  var I = o.match(B2)[1];
  return {
    tag: I,
    data: m
  };
}, Pe = ir, T2 = S2, C2 = R2, F2 = Oe, q2 = On, g0 = zt.Buffer;
function P2(a, n) {
  var o = a.algorithm.decrypt.kde.kdeparams.salt, s = parseInt(a.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), m = T2[a.algorithm.decrypt.cipher.algo.join(".")], f = a.algorithm.decrypt.cipher.iv, g = a.subjectPrivateKey, y = parseInt(m.split("-")[1], 10) / 8, S = q2.pbkdf2Sync(n, o, s, y, "sha1"), B = F2.createDecipheriv(m, S, f), M = [];
  return M.push(B.update(g)), M.push(B.final()), g0.concat(M);
}
function Uo(a) {
  var n;
  typeof a == "object" && !g0.isBuffer(a) && (n = a.passphrase, a = a.key), typeof a == "string" && (a = g0.from(a));
  var o = C2(a, n), s = o.tag, m = o.data, f, g;
  switch (s) {
    case "CERTIFICATE":
      g = Pe.certificate.decode(m, "der").tbsCertificate.subjectPublicKeyInfo;
    case "PUBLIC KEY":
      switch (g || (g = Pe.PublicKey.decode(m, "der")), f = g.algorithm.algorithm.join("."), f) {
        case "1.2.840.113549.1.1.1":
          return Pe.RSAPublicKey.decode(g.subjectPublicKey.data, "der");
        case "1.2.840.10045.2.1":
          return g.subjectPrivateKey = g.subjectPublicKey, {
            type: "ec",
            data: g
          };
        case "1.2.840.10040.4.1":
          return g.algorithm.params.pub_key = Pe.DSAparam.decode(g.subjectPublicKey.data, "der"), {
            type: "dsa",
            data: g.algorithm.params
          };
        default:
          throw new Error("unknown key id " + f);
      }
    case "ENCRYPTED PRIVATE KEY":
      m = Pe.EncryptedPrivateKey.decode(m, "der"), m = P2(m, n);
    case "PRIVATE KEY":
      switch (g = Pe.PrivateKey.decode(m, "der"), f = g.algorithm.algorithm.join("."), f) {
        case "1.2.840.113549.1.1.1":
          return Pe.RSAPrivateKey.decode(g.subjectPrivateKey, "der");
        case "1.2.840.10045.2.1":
          return {
            curve: g.algorithm.curve,
            privateKey: Pe.ECPrivateKey.decode(g.subjectPrivateKey, "der").privateKey
          };
        case "1.2.840.10040.4.1":
          return g.algorithm.params.priv_key = Pe.DSAparam.decode(g.subjectPrivateKey, "der"), {
            type: "dsa",
            params: g.algorithm.params
          };
        default:
          throw new Error("unknown key id " + f);
      }
    case "RSA PUBLIC KEY":
      return Pe.RSAPublicKey.decode(m, "der");
    case "RSA PRIVATE KEY":
      return Pe.RSAPrivateKey.decode(m, "der");
    case "DSA PRIVATE KEY":
      return {
        type: "dsa",
        params: Pe.DSAPrivateKey.decode(m, "der")
      };
    case "EC PRIVATE KEY":
      return m = Pe.ECPrivateKey.decode(m, "der"), {
        curve: m.parameters.value,
        privateKey: m.privateKey
      };
    default:
      throw new Error("unknown key type " + s);
  }
}
Uo.signature = Pe.signature;
var uf = Uo;
const Oo = {
  "1.3.132.0.10": "secp256k1",
  "1.3.132.0.33": "p224",
  "1.2.840.10045.3.1.1": "p192",
  "1.2.840.10045.3.1.7": "p256",
  "1.3.132.0.34": "p384",
  "1.3.132.0.35": "p521"
};
var lh;
function D2() {
  if (lh)
    return Pi.exports;
  lh = 1;
  var a = zt.Buffer, n = Jh, o = K0, s = J0().ec, m = z0, f = uf, g = Oo, y = 1;
  function S(z, $, lt, H, At) {
    var Bt = f($);
    if (Bt.curve) {
      if (H !== "ecdsa" && H !== "ecdsa/rsa")
        throw new Error("wrong private key type");
      return B(z, Bt);
    } else if (Bt.type === "dsa") {
      if (H !== "dsa")
        throw new Error("wrong private key type");
      return M(z, Bt, lt);
    }
    if (H !== "rsa" && H !== "ecdsa/rsa")
      throw new Error("wrong private key type");
    if ($.padding !== void 0 && $.padding !== y)
      throw new Error("illegal or unsupported padding mode");
    z = a.concat([At, z]);
    for (var Ct = Bt.modulus.byteLength(), Et = [0, 1]; z.length + Et.length + 1 < Ct; )
      Et.push(255);
    Et.push(0);
    for (var Y = -1; ++Y < z.length; )
      Et.push(z[Y]);
    var It = o(Et, Bt);
    return It;
  }
  function B(z, $) {
    var lt = g[$.curve.join(".")];
    if (!lt)
      throw new Error("unknown curve " + $.curve.join("."));
    var H = new s(lt), At = H.keyFromPrivate($.privateKey), Bt = At.sign(z);
    return a.from(Bt.toDER());
  }
  function M(z, $, lt) {
    for (var H = $.params.priv_key, At = $.params.p, Bt = $.params.q, Ct = $.params.g, Et = new m(0), Y, It = k(z, Bt).mod(Bt), p = !1, t = I(H, Bt, z, lt); p === !1; )
      Y = U(Bt, t, lt), Et = W(Ct, Y, At, Bt), p = Y.invm(Bt).imul(It.add(H.mul(Et))).mod(Bt), p.cmpn(0) === 0 && (p = !1, Et = new m(0));
    return x(Et, p);
  }
  function x(z, $) {
    z = z.toArray(), $ = $.toArray(), z[0] & 128 && (z = [0].concat(z)), $[0] & 128 && ($ = [0].concat($));
    var lt = z.length + $.length + 4, H = [
      48,
      lt,
      2,
      z.length
    ];
    return H = H.concat(z, [2, $.length], $), a.from(H);
  }
  function I(z, $, lt, H) {
    if (z = a.from(z.toArray()), z.length < $.byteLength()) {
      var At = a.alloc($.byteLength() - z.length);
      z = a.concat([At, z]);
    }
    var Bt = lt.length, Ct = D(lt, $), Et = a.alloc(Bt);
    Et.fill(1);
    var Y = a.alloc(Bt);
    return Y = n(H, Y).update(Et).update(a.from([0])).update(z).update(Ct).digest(), Et = n(H, Y).update(Et).digest(), Y = n(H, Y).update(Et).update(a.from([1])).update(z).update(Ct).digest(), Et = n(H, Y).update(Et).digest(), { k: Y, v: Et };
  }
  function k(z, $) {
    var lt = new m(z), H = (z.length << 3) - $.bitLength();
    return H > 0 && lt.ishrn(H), lt;
  }
  function D(z, $) {
    z = k(z, $), z = z.mod($);
    var lt = a.from(z.toArray());
    if (lt.length < $.byteLength()) {
      var H = a.alloc($.byteLength() - lt.length);
      lt = a.concat([H, lt]);
    }
    return lt;
  }
  function U(z, $, lt) {
    var H, At;
    do {
      for (H = a.alloc(0); H.length * 8 < z.bitLength(); )
        $.v = n(lt, $.k).update($.v).digest(), H = a.concat([H, $.v]);
      At = k(H, z), $.k = n(lt, $.k).update($.v).update(a.from([0])).digest(), $.v = n(lt, $.k).update($.v).digest();
    } while (At.cmp(z) !== -1);
    return At;
  }
  function W(z, $, lt, H) {
    return z.toRed(m.mont(lt)).redPow($).fromRed().mod(H);
  }
  return Pi.exports = S, Pi.exports.getKey = I, Pi.exports.makeKey = U, Pi.exports;
}
var Xf, dh;
function N2() {
  if (dh)
    return Xf;
  dh = 1;
  var a = zt.Buffer, n = z0, o = J0().ec, s = uf, m = Oo;
  function f(B, M, x, I, k) {
    var D = s(x);
    if (D.type === "ec") {
      if (I !== "ecdsa" && I !== "ecdsa/rsa")
        throw new Error("wrong public key type");
      return g(B, M, D);
    } else if (D.type === "dsa") {
      if (I !== "dsa")
        throw new Error("wrong public key type");
      return y(B, M, D);
    }
    if (I !== "rsa" && I !== "ecdsa/rsa")
      throw new Error("wrong public key type");
    M = a.concat([k, M]);
    for (var U = D.modulus.byteLength(), W = [1], z = 0; M.length + W.length + 2 < U; )
      W.push(255), z += 1;
    W.push(0);
    for (var $ = -1; ++$ < M.length; )
      W.push(M[$]);
    W = a.from(W);
    var lt = n.mont(D.modulus);
    B = new n(B).toRed(lt), B = B.redPow(new n(D.publicExponent)), B = a.from(B.fromRed().toArray());
    var H = z < 8 ? 1 : 0;
    for (U = Math.min(B.length, W.length), B.length !== W.length && (H = 1), $ = -1; ++$ < U; )
      H |= B[$] ^ W[$];
    return H === 0;
  }
  function g(B, M, x) {
    var I = m[x.data.algorithm.curve.join(".")];
    if (!I)
      throw new Error("unknown curve " + x.data.algorithm.curve.join("."));
    var k = new o(I), D = x.data.subjectPrivateKey.data;
    return k.verify(M, B, D);
  }
  function y(B, M, x) {
    var I = x.data.p, k = x.data.q, D = x.data.g, U = x.data.pub_key, W = s.signature.decode(B, "der"), z = W.s, $ = W.r;
    S(z, k), S($, k);
    var lt = n.mont(I), H = z.invm(k), At = D.toRed(lt).redPow(new n(M).mul(H).mod(k)).fromRed().mul(U.toRed(lt).redPow($.mul(H).mod(k)).fromRed()).mod(I).mod(k);
    return At.cmp($) === 0;
  }
  function S(B, M) {
    if (B.cmpn(0) <= 0)
      throw new Error("invalid sig");
    if (B.cmp(M) >= 0)
      throw new Error("invalid sig");
  }
  return Xf = f, Xf;
}
var jf, ch;
function $2() {
  if (ch)
    return jf;
  ch = 1;
  var a = zt.Buffer, n = Qi, o = qv, s = Gt, m = D2(), f = N2(), g = Gh;
  Object.keys(g).forEach(function(x) {
    g[x].id = a.from(g[x].id, "hex"), g[x.toLowerCase()] = g[x];
  });
  function y(x) {
    o.Writable.call(this);
    var I = g[x];
    if (!I)
      throw new Error("Unknown message digest");
    this._hashType = I.hash, this._hash = n(I.hash), this._tag = I.id, this._signType = I.sign;
  }
  s(y, o.Writable), y.prototype._write = function(I, k, D) {
    this._hash.update(I), D();
  }, y.prototype.update = function(I, k) {
    return this._hash.update(typeof I == "string" ? a.from(I, k) : I), this;
  }, y.prototype.sign = function(I, k) {
    this.end();
    var D = this._hash.digest(), U = m(D, I, this._hashType, this._signType, this._tag);
    return k ? U.toString(k) : U;
  };
  function S(x) {
    o.Writable.call(this);
    var I = g[x];
    if (!I)
      throw new Error("Unknown message digest");
    this._hash = n(I.hash), this._tag = I.id, this._signType = I.sign;
  }
  s(S, o.Writable), S.prototype._write = function(I, k, D) {
    this._hash.update(I), D();
  }, S.prototype.update = function(I, k) {
    return this._hash.update(typeof I == "string" ? a.from(I, k) : I), this;
  }, S.prototype.verify = function(I, k, D) {
    var U = typeof k == "string" ? a.from(k, D) : k;
    this.end();
    var W = this._hash.digest();
    return f(U, W, I, this._signType, this._tag);
  };
  function B(x) {
    return new y(x);
  }
  function M(x) {
    return new S(x);
  }
  return jf = {
    Sign: B,
    Verify: M,
    createSign: B,
    createVerify: M
  }, jf;
}
var j0 = { exports: {} };
j0.exports;
(function(a) {
  (function(n, o) {
    function s(p, t) {
      if (!p)
        throw new Error(t || "Assertion failed");
    }
    function m(p, t) {
      p.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, p.prototype = new r(), p.prototype.constructor = p;
    }
    function f(p, t, r) {
      if (f.isBN(p))
        return p;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, p !== null && ((t === "le" || t === "be") && (r = t, t = 10), this._init(p || 0, t || 10, r || "be"));
    }
    typeof n == "object" ? n.exports = f : o.BN = f, f.BN = f, f.wordSize = 26;
    var g;
    try {
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Ne.Buffer;
    } catch (p) {
    }
    f.isBN = function(t) {
      return t instanceof f ? !0 : t !== null && typeof t == "object" && t.constructor.wordSize === f.wordSize && Array.isArray(t.words);
    }, f.max = function(t, r) {
      return t.cmp(r) > 0 ? t : r;
    }, f.min = function(t, r) {
      return t.cmp(r) < 0 ? t : r;
    }, f.prototype._init = function(t, r, i) {
      if (typeof t == "number")
        return this._initNumber(t, r, i);
      if (typeof t == "object")
        return this._initArray(t, r, i);
      r === "hex" && (r = 16), s(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var h = 0;
      t[0] === "-" && (h++, this.negative = 1), h < t.length && (r === 16 ? this._parseHex(t, h, i) : (this._parseBase(t, r, h), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (s(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (s(typeof t.length == "number"), t.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(t.length / 3), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (h = t.length - 1, d = 0; h >= 0; h -= 3)
          c = t[h] | t[h - 1] << 8 | t[h - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (h = 0, d = 0; h < t.length; h += 3)
          c = t[h] | t[h + 1] << 8 | t[h + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      return this.strip();
    };
    function y(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function S(p, t, r) {
      var i = y(p, r);
      return r - 1 >= t && (i |= y(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (h = t.length - 1; h >= r; h -= 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (h = u % 2 === 0 ? r + 1 : r; h < t.length; h += 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var h = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        h *= i, v >= 49 ? h += v - 49 + 10 : v >= 17 ? h += v - 17 + 10 : h += v;
      }
      return h;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var h = 0, d = 1; d <= 67108863; d *= r)
        h++;
      h--, d = d / r | 0;
      for (var c = t.length - i, v = c % h, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += h)
        e = B(t, l, l + h, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var b = 1;
        for (e = B(t, l, t.length, r), l = 0; l < v; l++)
          b *= r;
        this.imuln(b), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      }
      this.strip();
    }, f.prototype.copy = function(t) {
      t.words = new Array(this.length);
      for (var r = 0; r < this.length; r++)
        t.words[r] = this.words[r];
      t.length = this.length, t.negative = this.negative, t.red = this.red;
    }, f.prototype.clone = function() {
      var t = new f(null);
      return this.copy(t), t;
    }, f.prototype._expand = function(t) {
      for (; this.length < t; )
        this.words[this.length++] = 0;
      return this;
    }, f.prototype.strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, f.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, f.prototype.inspect = function() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var M = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], x = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], I = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    f.prototype.toString = function(t, r) {
      t = t || 10, r = r | 0 || 1;
      var i;
      if (t === 16 || t === "hex") {
        i = "";
        for (var h = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << h | d) & 16777215).toString(16);
          d = v >>> 24 - h & 16777215, h += 2, h >= 26 && (h -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = I[t];
        i = "";
        var b = this.clone();
        for (b.negative = 0; !b.isZero(); ) {
          var _ = b.modn(l).toString(t);
          b = b.idivn(l), b.isZero() ? i = _ + i : i = M[e - _.length] + _ + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      s(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && s(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return s(typeof g != "undefined"), this.toArrayLike(g, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var h = this.byteLength(), d = i || Math.max(1, h);
      s(h <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - h; e++)
          v[e] = 0;
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[d - e - 1] = u;
      }
      return v;
    }, Math.clz32 ? f.prototype._countBits = function(t) {
      return 32 - Math.clz32(t);
    } : f.prototype._countBits = function(t) {
      var r = t, i = 0;
      return r >= 4096 && (i += 13, r >>>= 13), r >= 64 && (i += 7, r >>>= 7), r >= 8 && (i += 4, r >>>= 4), r >= 2 && (i += 2, r >>>= 2), i + r;
    }, f.prototype._zeroBits = function(t) {
      if (t === 0)
        return 26;
      var r = t, i = 0;
      return r & 8191 || (i += 13, r >>>= 13), r & 127 || (i += 7, r >>>= 7), r & 15 || (i += 4, r >>>= 4), r & 3 || (i += 2, r >>>= 2), r & 1 || i++, i;
    }, f.prototype.bitLength = function() {
      var t = this.words[this.length - 1], r = this._countBits(t);
      return (this.length - 1) * 26 + r;
    };
    function k(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, h = r % 26;
        t[r] = (p.words[i] & 1 << h) >>> h;
      }
      return t;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var t = 0, r = 0; r < this.length; r++) {
        var i = this._zeroBits(this.words[r]);
        if (t += i, i !== 26)
          break;
      }
      return t;
    }, f.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, f.prototype.toTwos = function(t) {
      return this.negative !== 0 ? this.abs().inotn(t).iaddn(1) : this.clone();
    }, f.prototype.fromTwos = function(t) {
      return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone();
    }, f.prototype.isNeg = function() {
      return this.negative !== 0;
    }, f.prototype.neg = function() {
      return this.clone().ineg();
    }, f.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, f.prototype.iuor = function(t) {
      for (; this.length < t.length; )
        this.words[this.length++] = 0;
      for (var r = 0; r < t.length; r++)
        this.words[r] = this.words[r] | t.words[r];
      return this.strip();
    }, f.prototype.ior = function(t) {
      return s((this.negative | t.negative) === 0), this.iuor(t);
    }, f.prototype.or = function(t) {
      return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this);
    }, f.prototype.uor = function(t) {
      return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this);
    }, f.prototype.iuand = function(t) {
      var r;
      this.length > t.length ? r = t : r = this;
      for (var i = 0; i < r.length; i++)
        this.words[i] = this.words[i] & t.words[i];
      return this.length = r.length, this.strip();
    }, f.prototype.iand = function(t) {
      return s((this.negative | t.negative) === 0), this.iuand(t);
    }, f.prototype.and = function(t) {
      return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this);
    }, f.prototype.uand = function(t) {
      return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this);
    }, f.prototype.iuxor = function(t) {
      var r, i;
      this.length > t.length ? (r = this, i = t) : (r = t, i = this);
      for (var h = 0; h < i.length; h++)
        this.words[h] = r.words[h] ^ i.words[h];
      if (this !== r)
        for (; h < r.length; h++)
          this.words[h] = r.words[h];
      return this.length = r.length, this.strip();
    }, f.prototype.ixor = function(t) {
      return s((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var h = 0; h < r; h++)
        this.words[h] = ~this.words[h] & 67108863;
      return i > 0 && (this.words[h] = ~this.words[h] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, h = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << h : this.words[i] = this.words[i] & ~(1 << h), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, h;
      this.length > t.length ? (i = this, h = t) : (i = t, h = this);
      for (var d = 0, c = 0; c < h.length; c++)
        r = (i.words[c] | 0) + (h.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      for (; d !== 0 && c < i.length; c++)
        r = (i.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      if (this.length = i.length, d !== 0)
        this.words[this.length] = d, this.length++;
      else if (i !== this)
        for (; c < i.length; c++)
          this.words[c] = i.words[c];
      return this;
    }, f.prototype.add = function(t) {
      var r;
      return t.negative !== 0 && this.negative === 0 ? (t.negative = 0, r = this.sub(t), t.negative ^= 1, r) : t.negative === 0 && this.negative !== 0 ? (this.negative = 0, r = t.sub(this), this.negative = 1, r) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this);
    }, f.prototype.isub = function(t) {
      if (t.negative !== 0) {
        t.negative = 0;
        var r = this.iadd(t);
        return t.negative = 1, r._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
      var i = this.cmp(t);
      if (i === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var h, d;
      i > 0 ? (h = this, d = t) : (h = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (h.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < h.length; v++)
        r = (h.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < h.length && h !== this)
        for (; v < h.length; v++)
          this.words[v] = h.words[v];
      return this.length = Math.max(this.length, v), h !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var h = p.words[0] | 0, d = t.words[0] | 0, c = h * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var q = e - C | 0;
          h = p.words[q] | 0, d = t.words[C] | 0, c = h * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var U = function(t, r, i) {
      var h = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = h[0] | 0, _ = b & 8191, C = b >>> 13, q = h[1] | 0, O = q & 8191, R = q >>> 13, P = h[2] | 0, N = P & 8191, K = P >>> 13, kt = h[3] | 0, Z = kt & 8191, J = kt >>> 13, Ft = h[4] | 0, tt = Ft & 8191, vt = Ft >>> 13, Dt = h[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = h[6] | 0, j = Pt & 8191, dt = Pt >>> 13, qt = h[7] | 0, Q = qt & 8191, ct = qt >>> 13, Ut = h[8] | 0, E = Ut & 8191, w = Ut >>> 13, A = h[9] | 0, T = A & 8191, F = A >>> 13, V = d[0] | 0, L = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, Kt = d[3] | 0, nt = Kt & 8191, bt = Kt >>> 13, Ht = d[4] | 0, ft = Ht & 8191, yt = Ht >>> 13, Zt = d[5] | 0, at = Zt & 8191, wt = Zt >>> 13, Wt = d[6] | 0, ht = Wt & 8191, Mt = Wt >>> 13, Vt = d[7] | 0, st = Vt & 8191, xt = Vt >>> 13, Yt = d[8] | 0, ot = Yt & 8191, _t = Yt >>> 13, Jt = d[9] | 0, ut = Jt & 8191, St = Jt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, L), e = Math.imul(_, X), e = e + Math.imul(C, L) | 0, l = Math.imul(C, X);
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul(O, L), e = Math.imul(O, X), e = e + Math.imul(R, L) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(N, L), e = Math.imul(N, X), e = e + Math.imul(K, L) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(Z, L), e = Math.imul(Z, X), e = e + Math.imul(J, L) | 0, l = Math.imul(J, X), u = u + Math.imul(N, G) | 0, e = e + Math.imul(N, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(tt, L), e = Math.imul(tt, X), e = e + Math.imul(vt, L) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul(N, it) | 0, e = e + Math.imul(N, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(et, L), e = Math.imul(et, X), e = e + Math.imul(pt, L) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul(N, nt) | 0, e = e + Math.imul(N, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(j, L), e = Math.imul(j, X), e = e + Math.imul(dt, L) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul(N, ft) | 0, e = e + Math.imul(N, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(Q, L), e = Math.imul(Q, X), e = e + Math.imul(ct, L) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul(N, at) | 0, e = e + Math.imul(N, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(E, L), e = Math.imul(E, X), e = e + Math.imul(w, L) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul(N, ht) | 0, e = e + Math.imul(N, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, L), e = Math.imul(T, X), e = e + Math.imul(F, L) | 0, l = Math.imul(F, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul(N, st) | 0, e = e + Math.imul(N, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(F, G) | 0, l = Math.imul(F, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul(N, ot) | 0, e = e + Math.imul(N, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(F, it) | 0, l = Math.imul(F, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul(N, ut) | 0, e = e + Math.imul(N, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(F, nt) | 0, l = Math.imul(F, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(F, ft) | 0, l = Math.imul(F, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(F, at) | 0, l = Math.imul(F, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(F, ht) | 0, l = Math.imul(F, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(F, st) | 0, l = Math.imul(F, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(F, ot) | 0, l = Math.imul(F, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(F, ut) | 0, l = Math.imul(F, St);
      var pe = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (pe >>> 26) | 0, pe &= 67108863, c[0] = Nt, c[1] = $t, c[2] = Qt, c[3] = te, c[4] = ee, c[5] = re, c[6] = ie, c[7] = ne, c[8] = fe, c[9] = ae, c[10] = he, c[11] = se, c[12] = oe, c[13] = ue, c[14] = le, c[15] = de, c[16] = ce, c[17] = ve, c[18] = pe, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (U = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, h = 0, d = 0; d < r.length - 1; d++) {
        var c = h;
        h = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, q = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, q = q + v | 0, v = q & 67108863, c = c + (q >>> 26) | 0, h += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = h;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new $();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, h = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = U(this, t, r) : h < 63 ? i = D(this, t, r) : h < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function $(p, t) {
      this.x = p, this.y = t;
    }
    $.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, h = 0; h < t; h++)
        r[h] = this.revBin(h, i, t);
      return r;
    }, $.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var h = 0, d = 0; d < r; d++)
        h |= (t & 1) << r - d - 1, t >>= 1;
      return h;
    }, $.prototype.permute = function(t, r, i, h, d, c) {
      for (var v = 0; v < c; v++)
        h[v] = r[t[v]], d[v] = i[t[v]];
    }, $.prototype.transform = function(t, r, i, h, d, c) {
      this.permute(c, t, r, i, h, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, q = 0; q < v; q++) {
            var O = i[b + q], R = h[b + q], P = i[b + q + v], N = h[b + q + v], K = _ * P - C * N;
            N = _ * N + C * P, P = K, i[b + q] = O + P, h[b + q] = R + N, i[b + q + v] = O - P, h[b + q + v] = R - N, q !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, $.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, h = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + h;
    }, $.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var h = 0; h < i / 2; h++) {
          var d = t[h];
          t[h] = t[i - h - 1], t[i - h - 1] = d, d = r[h], r[h] = -r[i - h - 1], r[i - h - 1] = -d;
        }
    }, $.prototype.normalize13b = function(t, r) {
      for (var i = 0, h = 0; h < r / 2; h++) {
        var d = Math.round(t[2 * h + 1] / r) * 8192 + Math.round(t[2 * h] / r) + i;
        t[h] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, $.prototype.convert13b = function(t, r, i, h) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < h; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, $.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, $.prototype.mulp = function(t, r, i) {
      var h = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(h), c = this.stub(h), v = new Array(h), u = new Array(h), e = new Array(h), l = new Array(h), b = new Array(h), _ = new Array(h), C = i.words;
      C.length = h, this.convert13b(t.words, t.length, v, h), this.convert13b(r.words, r.length, l, h), this.transform(v, c, u, e, h, d), this.transform(l, c, b, _, h, d);
      for (var q = 0; q < h; q++) {
        var O = u[q] * b[q] - e[q] * _[q];
        e[q] = u[q] * _[q] + e[q] * b[q], u[q] = O;
      }
      return this.conjugate(u, e, h), this.transform(u, e, C, c, h, d), this.conjugate(C, c, h), this.normalize13b(C, h), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), z(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      s(typeof t == "number"), s(t < 67108864);
      for (var r = 0, i = 0; i < this.length; i++) {
        var h = (this.words[i] | 0) * t, d = (h & 67108863) + (r & 67108863);
        r >>= 26, r += h / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = k(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, h = 0; h < r.length && r[h] === 0; h++, i = i.sqr())
        ;
      if (++h < r.length)
        for (var d = i.sqr(); h < r.length; h++, d = d.sqr())
          r[h] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & h, u = (this.words[d] | 0) - v << r;
          this.words[d] = u | c, c = v >>> 26 - r;
        }
        c && (this.words[d] = c, this.length++);
      }
      if (i !== 0) {
        for (d = this.length - 1; d >= 0; d--)
          this.words[d + i] = this.words[d];
        for (d = 0; d < i; d++)
          this.words[d] = 0;
        this.length += i;
      }
      return this.strip();
    }, f.prototype.ishln = function(t) {
      return s(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      s(typeof t == "number" && t >= 0);
      var h;
      r ? h = (r - r % 26) / 26 : h = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (h -= c, h = Math.max(0, h), u) {
        for (var e = 0; e < c; e++)
          u.words[e] = this.words[e];
        u.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var l = 0;
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= h); e--) {
        var b = this.words[e] | 0;
        this.words[e] = l << 26 - d | b >>> d, l = b & v;
      }
      return u && l !== 0 && (u.words[u.length++] = l), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return s(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & h);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var h = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= h;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return s(typeof t == "number"), s(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (s(typeof t == "number"), s(t < 67108864), t < 0)
        return this.iaddn(-t);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(t), this.negative = 1, this;
      if (this.words[0] -= t, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var r = 0; r < this.length && this.words[r] < 0; r++)
          this.words[r] += 67108864, this.words[r + 1] -= 1;
      return this.strip();
    }, f.prototype.addn = function(t) {
      return this.clone().iaddn(t);
    }, f.prototype.subn = function(t) {
      return this.clone().isubn(t);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(t, r, i) {
      var h = t.length + i, d;
      this._expand(h);
      var c, v = 0;
      for (d = 0; d < t.length; d++) {
        c = (this.words[d + i] | 0) + v;
        var u = (t.words[d] | 0) * r;
        c -= u & 67108863, v = (c >> 26) - (u / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (s(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, h = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), h.iushln(i), c = d.words[d.length - 1] | 0);
      var u = h.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = h.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (h = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (h.words[d.length + _] | 0) * 67108864 + (h.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), h._ishlnsubmul(d, C, _); h.negative !== 0; )
          C--, h.negative = 0, h._ishlnsubmul(d, 1, _), h.isZero() || (h.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), h.strip(), r !== "div" && i !== 0 && h.iushrn(i), {
        div: e || null,
        mod: h
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var h, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (h = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: h,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (h = c.div.neg()), {
        div: h,
        mod: c.mod
      }) : this.negative & t.negative ? (c = this.neg().divmod(t.neg(), r), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.isub(t)), {
        div: c.div,
        mod: d
      }) : t.length > this.length || this.cmp(t) < 0 ? {
        div: new f(0),
        mod: this
      } : t.length === 1 ? r === "div" ? {
        div: this.divn(t.words[0]),
        mod: null
      } : r === "mod" ? {
        div: null,
        mod: new f(this.modn(t.words[0]))
      } : {
        div: this.divn(t.words[0]),
        mod: new f(this.modn(t.words[0]))
      } : this._wordDiv(t, r);
    }, f.prototype.div = function(t) {
      return this.divmod(t, "div", !1).div;
    }, f.prototype.mod = function(t) {
      return this.divmod(t, "mod", !1).mod;
    }, f.prototype.umod = function(t) {
      return this.divmod(t, "mod", !0).mod;
    }, f.prototype.divRound = function(t) {
      var r = this.divmod(t);
      if (r.mod.isZero())
        return r.div;
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, h = t.ushrn(1), d = t.andln(1), c = i.cmp(h);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, h = this.length - 1; h >= 0; h--)
        i = (r * i + (this.words[h] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = (this.words[i] | 0) + r * 67108864;
        this.words[i] = h / t | 0, r = h % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (h.isOdd() || d.isOdd()) && (h.iadd(e), d.isub(l)), h.iushrn(1), d.iushrn(1);
        for (var C = 0, q = 1; !(i.words[0] & q) && C < 26; ++C, q <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(c), d.isub(v)) : (i.isub(r), c.isub(h), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(u)
      };
    }, f.prototype._invmp = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            h.isOdd() && h.iadd(c), h.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(d)) : (i.isub(r), d.isub(h));
      }
      var b;
      return r.cmpn(1) === 0 ? b = h : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var h = 0; r.isEven() && i.isEven(); h++)
        r.iushrn(1), i.iushrn(1);
      do {
        for (; r.isEven(); )
          r.iushrn(1);
        for (; i.isEven(); )
          i.iushrn(1);
        var d = r.cmp(i);
        if (d < 0) {
          var c = r;
          r = i, i = c;
        } else if (d === 0 || i.cmpn(1) === 0)
          break;
        r.isub(i);
      } while (!0);
      return i.iushln(h);
    }, f.prototype.invm = function(t) {
      return this.egcd(t).a.umod(t);
    }, f.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, f.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, f.prototype.andln = function(t) {
      return this.words[0] & t;
    }, f.prototype.bincn = function(t) {
      s(typeof t == "number");
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= h, this;
      for (var d = h, c = i; d !== 0 && c < this.length; c++) {
        var v = this.words[c] | 0;
        v += d, d = v >>> 26, v &= 67108863, this.words[c] = v;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(t) {
      var r = t < 0;
      if (this.negative !== 0 && !r)
        return -1;
      if (this.negative === 0 && r)
        return 1;
      this.strip();
      var i;
      if (this.length > 1)
        i = 1;
      else {
        r && (t = -t), s(t <= 67108863, "Number is too big");
        var h = this.words[0] | 0;
        i = h === t ? 0 : h < t ? -1 : 1;
      }
      return this.negative !== 0 ? -i | 0 : i;
    }, f.prototype.cmp = function(t) {
      if (this.negative !== 0 && t.negative === 0)
        return -1;
      if (this.negative === 0 && t.negative !== 0)
        return 1;
      var r = this.ucmp(t);
      return this.negative !== 0 ? -r | 0 : r;
    }, f.prototype.ucmp = function(t) {
      if (this.length > t.length)
        return 1;
      if (this.length < t.length)
        return -1;
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = this.words[i] | 0, d = t.words[i] | 0;
        if (h !== d) {
          h < d ? r = -1 : h > d && (r = 1);
          break;
        }
      }
      return r;
    }, f.prototype.gtn = function(t) {
      return this.cmpn(t) === 1;
    }, f.prototype.gt = function(t) {
      return this.cmp(t) === 1;
    }, f.prototype.gten = function(t) {
      return this.cmpn(t) >= 0;
    }, f.prototype.gte = function(t) {
      return this.cmp(t) >= 0;
    }, f.prototype.ltn = function(t) {
      return this.cmpn(t) === -1;
    }, f.prototype.lt = function(t) {
      return this.cmp(t) === -1;
    }, f.prototype.lten = function(t) {
      return this.cmpn(t) <= 0;
    }, f.prototype.lte = function(t) {
      return this.cmp(t) <= 0;
    }, f.prototype.eqn = function(t) {
      return this.cmpn(t) === 0;
    }, f.prototype.eq = function(t) {
      return this.cmp(t) === 0;
    }, f.red = function(t) {
      return new Y(t);
    }, f.prototype.toRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), s(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return s(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return s(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return s(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return s(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return s(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return s(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return s(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return s(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return s(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return s(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return s(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return s(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var lt = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function H(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    H.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, H.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var h = i < this.n ? -1 : r.ucmp(this.p);
      return h === 0 ? (r.words[0] = 0, r.length = 1) : h > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, H.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, H.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function At() {
      H.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(At, H), At.prototype.split = function(t, r) {
      for (var i = 4194303, h = Math.min(t.length, 9), d = 0; d < h; d++)
        r.words[d] = t.words[d];
      if (r.length = h, t.length <= 9) {
        t.words[0] = 0, t.length = 1;
        return;
      }
      var c = t.words[9];
      for (r.words[r.length++] = c & i, d = 10; d < t.length; d++) {
        var v = t.words[d] | 0;
        t.words[d - 10] = (v & i) << 4 | c >>> 22, c = v;
      }
      c >>>= 22, t.words[d - 10] = c, c === 0 && t.length > 10 ? t.length -= 10 : t.length -= 9;
    }, At.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = t.words[i] | 0;
        r += h * 977, t.words[i] = r & 67108863, r = h * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function Bt() {
      H.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(Bt, H);
    function Ct() {
      H.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(Ct, H);
    function Et() {
      H.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(Et, H), Et.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = (t.words[i] | 0) * 19 + r, d = h & 67108863;
        h >>>= 26, t.words[i] = d, r = h;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (lt[t])
        return lt[t];
      var r;
      if (t === "k256")
        r = new At();
      else if (t === "p224")
        r = new Bt();
      else if (t === "p192")
        r = new Ct();
      else if (t === "p25519")
        r = new Et();
      else
        throw new Error("Unknown prime " + t);
      return lt[t] = r, r;
    };
    function Y(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        s(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    Y.prototype._verify1 = function(t) {
      s(t.negative === 0, "red works only with positives"), s(t.red, "red works only with red numbers");
    }, Y.prototype._verify2 = function(t, r) {
      s((t.negative | r.negative) === 0, "red works only with positives"), s(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, Y.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, Y.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, Y.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, Y.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, Y.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, Y.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, Y.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, Y.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, Y.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, Y.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, Y.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, Y.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (s(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var h = this.m.subn(1), d = 0; !h.isZero() && h.andln(1) === 0; )
        d++, h.iushrn(1);
      s(!h.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, h), b = this.pow(t, h.addn(1).iushrn(1)), _ = this.pow(t, h), C = d; _.cmp(c) !== 0; ) {
        for (var q = _, O = 0; q.cmp(c) !== 0; O++)
          q = q.redSqr();
        s(O < C);
        var R = this.pow(l, new f(1).iushln(C - O - 1));
        b = b.redMul(R), l = R.redSqr(), _ = _.redMul(l), C = O;
      }
      return b;
    }, Y.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, Y.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, h = new Array(1 << i);
      h[0] = new f(1).toRed(this), h[1] = t;
      for (var d = 2; d < h.length; d++)
        h[d] = this.mul(h[d - 1], t);
      var c = h[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== h[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, h[v]), u = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, Y.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, Y.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new It(t);
    };
    function It(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(It, Y), It.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, It.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, It.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(a, Xt);
})(j0);
var L2 = j0.exports, Qf, vh;
function U2() {
  if (vh)
    return Qf;
  vh = 1;
  var a = J0(), n = L2;
  Qf = function(g) {
    return new s(g);
  };
  var o = {
    secp256k1: {
      name: "secp256k1",
      byteLength: 32
    },
    secp224r1: {
      name: "p224",
      byteLength: 28
    },
    prime256v1: {
      name: "p256",
      byteLength: 32
    },
    prime192v1: {
      name: "p192",
      byteLength: 24
    },
    ed25519: {
      name: "ed25519",
      byteLength: 32
    },
    secp384r1: {
      name: "p384",
      byteLength: 48
    },
    secp521r1: {
      name: "p521",
      byteLength: 66
    }
  };
  o.p224 = o.secp224r1, o.p256 = o.secp256r1 = o.prime256v1, o.p192 = o.secp192r1 = o.prime192v1, o.p384 = o.secp384r1, o.p521 = o.secp521r1;
  function s(f) {
    this.curveType = o[f], this.curveType || (this.curveType = {
      name: f
    }), this.curve = new a.ec(this.curveType.name), this.keys = void 0;
  }
  s.prototype.generateKeys = function(f, g) {
    return this.keys = this.curve.genKeyPair(), this.getPublicKey(f, g);
  }, s.prototype.computeSecret = function(f, g, y) {
    g = g || "utf8", mt.isBuffer(f) || (f = new mt(f, g));
    var S = this.curve.keyFromPublic(f).getPublic(), B = S.mul(this.keys.getPrivate()).getX();
    return m(B, y, this.curveType.byteLength);
  }, s.prototype.getPublicKey = function(f, g) {
    var y = this.keys.getPublic(g === "compressed", !0);
    return g === "hybrid" && (y[y.length - 1] % 2 ? y[0] = 7 : y[0] = 6), m(y, f);
  }, s.prototype.getPrivateKey = function(f) {
    return m(this.keys.getPrivate(), f);
  }, s.prototype.setPublicKey = function(f, g) {
    return g = g || "utf8", mt.isBuffer(f) || (f = new mt(f, g)), this.keys._importPublic(f), this;
  }, s.prototype.setPrivateKey = function(f, g) {
    g = g || "utf8", mt.isBuffer(f) || (f = new mt(f, g));
    var y = new n(f);
    return y = y.toString(16), this.keys = this.curve.genKeyPair(), this.keys._importPrivate(y), this;
  };
  function m(f, g, y) {
    Array.isArray(f) || (f = f.toArray());
    var S = new mt(f);
    if (y && S.length < y) {
      var B = new mt(y - S.length);
      B.fill(0), S = mt.concat([B, S]);
    }
    return g ? S.toString(g) : S;
  }
  return Qf;
}
var zo = {}, O2 = Qi, b0 = zt.Buffer, Ko = function(a, n) {
  for (var o = b0.alloc(0), s = 0, m; o.length < n; )
    m = z2(s++), o = b0.concat([o, O2("sha1").update(a).update(m).digest()]);
  return o.slice(0, n);
};
function z2(a) {
  var n = b0.allocUnsafe(4);
  return n.writeUInt32BE(a, 0), n;
}
var Ho = function(n, o) {
  for (var s = n.length, m = -1; ++m < s; )
    n[m] ^= o[m];
  return n;
}, Q0 = { exports: {} };
Q0.exports;
(function(a) {
  (function(n, o) {
    function s(p, t) {
      if (!p)
        throw new Error(t || "Assertion failed");
    }
    function m(p, t) {
      p.super_ = t;
      var r = function() {
      };
      r.prototype = t.prototype, p.prototype = new r(), p.prototype.constructor = p;
    }
    function f(p, t, r) {
      if (f.isBN(p))
        return p;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, p !== null && ((t === "le" || t === "be") && (r = t, t = 10), this._init(p || 0, t || 10, r || "be"));
    }
    typeof n == "object" ? n.exports = f : o.BN = f, f.BN = f, f.wordSize = 26;
    var g;
    try {
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Ne.Buffer;
    } catch (p) {
    }
    f.isBN = function(t) {
      return t instanceof f ? !0 : t !== null && typeof t == "object" && t.constructor.wordSize === f.wordSize && Array.isArray(t.words);
    }, f.max = function(t, r) {
      return t.cmp(r) > 0 ? t : r;
    }, f.min = function(t, r) {
      return t.cmp(r) < 0 ? t : r;
    }, f.prototype._init = function(t, r, i) {
      if (typeof t == "number")
        return this._initNumber(t, r, i);
      if (typeof t == "object")
        return this._initArray(t, r, i);
      r === "hex" && (r = 16), s(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var h = 0;
      t[0] === "-" && (h++, this.negative = 1), h < t.length && (r === 16 ? this._parseHex(t, h, i) : (this._parseBase(t, r, h), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (s(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (s(typeof t.length == "number"), t.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(t.length / 3), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (h = t.length - 1, d = 0; h >= 0; h -= 3)
          c = t[h] | t[h - 1] << 8 | t[h - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (h = 0, d = 0; h < t.length; h += 3)
          c = t[h] | t[h + 1] << 8 | t[h + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      return this.strip();
    };
    function y(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function S(p, t, r) {
      var i = y(p, r);
      return r - 1 >= t && (i |= y(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var h = 0; h < this.length; h++)
        this.words[h] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (h = t.length - 1; h >= r; h -= 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (h = u % 2 === 0 ? r + 1 : r; h < t.length; h += 2)
          v = S(t, r, h) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var h = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        h *= i, v >= 49 ? h += v - 49 + 10 : v >= 17 ? h += v - 17 + 10 : h += v;
      }
      return h;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var h = 0, d = 1; d <= 67108863; d *= r)
        h++;
      h--, d = d / r | 0;
      for (var c = t.length - i, v = c % h, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += h)
        e = B(t, l, l + h, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var b = 1;
        for (e = B(t, l, t.length, r), l = 0; l < v; l++)
          b *= r;
        this.imuln(b), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      }
      this.strip();
    }, f.prototype.copy = function(t) {
      t.words = new Array(this.length);
      for (var r = 0; r < this.length; r++)
        t.words[r] = this.words[r];
      t.length = this.length, t.negative = this.negative, t.red = this.red;
    }, f.prototype.clone = function() {
      var t = new f(null);
      return this.copy(t), t;
    }, f.prototype._expand = function(t) {
      for (; this.length < t; )
        this.words[this.length++] = 0;
      return this;
    }, f.prototype.strip = function() {
      for (; this.length > 1 && this.words[this.length - 1] === 0; )
        this.length--;
      return this._normSign();
    }, f.prototype._normSign = function() {
      return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
    }, f.prototype.inspect = function() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    };
    var M = [
      "",
      "0",
      "00",
      "000",
      "0000",
      "00000",
      "000000",
      "0000000",
      "00000000",
      "000000000",
      "0000000000",
      "00000000000",
      "000000000000",
      "0000000000000",
      "00000000000000",
      "000000000000000",
      "0000000000000000",
      "00000000000000000",
      "000000000000000000",
      "0000000000000000000",
      "00000000000000000000",
      "000000000000000000000",
      "0000000000000000000000",
      "00000000000000000000000",
      "000000000000000000000000",
      "0000000000000000000000000"
    ], x = [
      0,
      0,
      25,
      16,
      12,
      11,
      10,
      9,
      8,
      8,
      7,
      7,
      7,
      7,
      6,
      6,
      6,
      6,
      6,
      6,
      6,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ], I = [
      0,
      0,
      33554432,
      43046721,
      16777216,
      48828125,
      60466176,
      40353607,
      16777216,
      43046721,
      1e7,
      19487171,
      35831808,
      62748517,
      7529536,
      11390625,
      16777216,
      24137569,
      34012224,
      47045881,
      64e6,
      4084101,
      5153632,
      6436343,
      7962624,
      9765625,
      11881376,
      14348907,
      17210368,
      20511149,
      243e5,
      28629151,
      33554432,
      39135393,
      45435424,
      52521875,
      60466176
    ];
    f.prototype.toString = function(t, r) {
      t = t || 10, r = r | 0 || 1;
      var i;
      if (t === 16 || t === "hex") {
        i = "";
        for (var h = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << h | d) & 16777215).toString(16);
          d = v >>> 24 - h & 16777215, h += 2, h >= 26 && (h -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = I[t];
        i = "";
        var b = this.clone();
        for (b.negative = 0; !b.isZero(); ) {
          var _ = b.modn(l).toString(t);
          b = b.idivn(l), b.isZero() ? i = _ + i : i = M[e - _.length] + _ + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      s(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && s(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return s(typeof g != "undefined"), this.toArrayLike(g, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var h = this.byteLength(), d = i || Math.max(1, h);
      s(h <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - h; e++)
          v[e] = 0;
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[d - e - 1] = u;
      }
      return v;
    }, Math.clz32 ? f.prototype._countBits = function(t) {
      return 32 - Math.clz32(t);
    } : f.prototype._countBits = function(t) {
      var r = t, i = 0;
      return r >= 4096 && (i += 13, r >>>= 13), r >= 64 && (i += 7, r >>>= 7), r >= 8 && (i += 4, r >>>= 4), r >= 2 && (i += 2, r >>>= 2), i + r;
    }, f.prototype._zeroBits = function(t) {
      if (t === 0)
        return 26;
      var r = t, i = 0;
      return r & 8191 || (i += 13, r >>>= 13), r & 127 || (i += 7, r >>>= 7), r & 15 || (i += 4, r >>>= 4), r & 3 || (i += 2, r >>>= 2), r & 1 || i++, i;
    }, f.prototype.bitLength = function() {
      var t = this.words[this.length - 1], r = this._countBits(t);
      return (this.length - 1) * 26 + r;
    };
    function k(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, h = r % 26;
        t[r] = (p.words[i] & 1 << h) >>> h;
      }
      return t;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var t = 0, r = 0; r < this.length; r++) {
        var i = this._zeroBits(this.words[r]);
        if (t += i, i !== 26)
          break;
      }
      return t;
    }, f.prototype.byteLength = function() {
      return Math.ceil(this.bitLength() / 8);
    }, f.prototype.toTwos = function(t) {
      return this.negative !== 0 ? this.abs().inotn(t).iaddn(1) : this.clone();
    }, f.prototype.fromTwos = function(t) {
      return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone();
    }, f.prototype.isNeg = function() {
      return this.negative !== 0;
    }, f.prototype.neg = function() {
      return this.clone().ineg();
    }, f.prototype.ineg = function() {
      return this.isZero() || (this.negative ^= 1), this;
    }, f.prototype.iuor = function(t) {
      for (; this.length < t.length; )
        this.words[this.length++] = 0;
      for (var r = 0; r < t.length; r++)
        this.words[r] = this.words[r] | t.words[r];
      return this.strip();
    }, f.prototype.ior = function(t) {
      return s((this.negative | t.negative) === 0), this.iuor(t);
    }, f.prototype.or = function(t) {
      return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this);
    }, f.prototype.uor = function(t) {
      return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this);
    }, f.prototype.iuand = function(t) {
      var r;
      this.length > t.length ? r = t : r = this;
      for (var i = 0; i < r.length; i++)
        this.words[i] = this.words[i] & t.words[i];
      return this.length = r.length, this.strip();
    }, f.prototype.iand = function(t) {
      return s((this.negative | t.negative) === 0), this.iuand(t);
    }, f.prototype.and = function(t) {
      return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this);
    }, f.prototype.uand = function(t) {
      return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this);
    }, f.prototype.iuxor = function(t) {
      var r, i;
      this.length > t.length ? (r = this, i = t) : (r = t, i = this);
      for (var h = 0; h < i.length; h++)
        this.words[h] = r.words[h] ^ i.words[h];
      if (this !== r)
        for (; h < r.length; h++)
          this.words[h] = r.words[h];
      return this.length = r.length, this.strip();
    }, f.prototype.ixor = function(t) {
      return s((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var h = 0; h < r; h++)
        this.words[h] = ~this.words[h] & 67108863;
      return i > 0 && (this.words[h] = ~this.words[h] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, h = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << h : this.words[i] = this.words[i] & ~(1 << h), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, h;
      this.length > t.length ? (i = this, h = t) : (i = t, h = this);
      for (var d = 0, c = 0; c < h.length; c++)
        r = (i.words[c] | 0) + (h.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      for (; d !== 0 && c < i.length; c++)
        r = (i.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
      if (this.length = i.length, d !== 0)
        this.words[this.length] = d, this.length++;
      else if (i !== this)
        for (; c < i.length; c++)
          this.words[c] = i.words[c];
      return this;
    }, f.prototype.add = function(t) {
      var r;
      return t.negative !== 0 && this.negative === 0 ? (t.negative = 0, r = this.sub(t), t.negative ^= 1, r) : t.negative === 0 && this.negative !== 0 ? (this.negative = 0, r = t.sub(this), this.negative = 1, r) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this);
    }, f.prototype.isub = function(t) {
      if (t.negative !== 0) {
        t.negative = 0;
        var r = this.iadd(t);
        return t.negative = 1, r._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(t), this.negative = 1, this._normSign();
      var i = this.cmp(t);
      if (i === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var h, d;
      i > 0 ? (h = this, d = t) : (h = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (h.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < h.length; v++)
        r = (h.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < h.length && h !== this)
        for (; v < h.length; v++)
          this.words[v] = h.words[v];
      return this.length = Math.max(this.length, v), h !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var h = p.words[0] | 0, d = t.words[0] | 0, c = h * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var q = e - C | 0;
          h = p.words[q] | 0, d = t.words[C] | 0, c = h * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var U = function(t, r, i) {
      var h = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = h[0] | 0, _ = b & 8191, C = b >>> 13, q = h[1] | 0, O = q & 8191, R = q >>> 13, P = h[2] | 0, N = P & 8191, K = P >>> 13, kt = h[3] | 0, Z = kt & 8191, J = kt >>> 13, Ft = h[4] | 0, tt = Ft & 8191, vt = Ft >>> 13, Dt = h[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = h[6] | 0, j = Pt & 8191, dt = Pt >>> 13, qt = h[7] | 0, Q = qt & 8191, ct = qt >>> 13, Ut = h[8] | 0, E = Ut & 8191, w = Ut >>> 13, A = h[9] | 0, T = A & 8191, F = A >>> 13, V = d[0] | 0, L = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, Kt = d[3] | 0, nt = Kt & 8191, bt = Kt >>> 13, Ht = d[4] | 0, ft = Ht & 8191, yt = Ht >>> 13, Zt = d[5] | 0, at = Zt & 8191, wt = Zt >>> 13, Wt = d[6] | 0, ht = Wt & 8191, Mt = Wt >>> 13, Vt = d[7] | 0, st = Vt & 8191, xt = Vt >>> 13, Yt = d[8] | 0, ot = Yt & 8191, _t = Yt >>> 13, Jt = d[9] | 0, ut = Jt & 8191, St = Jt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, L), e = Math.imul(_, X), e = e + Math.imul(C, L) | 0, l = Math.imul(C, X);
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul(O, L), e = Math.imul(O, X), e = e + Math.imul(R, L) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(N, L), e = Math.imul(N, X), e = e + Math.imul(K, L) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(Z, L), e = Math.imul(Z, X), e = e + Math.imul(J, L) | 0, l = Math.imul(J, X), u = u + Math.imul(N, G) | 0, e = e + Math.imul(N, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(tt, L), e = Math.imul(tt, X), e = e + Math.imul(vt, L) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul(N, it) | 0, e = e + Math.imul(N, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(et, L), e = Math.imul(et, X), e = e + Math.imul(pt, L) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul(N, nt) | 0, e = e + Math.imul(N, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(j, L), e = Math.imul(j, X), e = e + Math.imul(dt, L) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul(N, ft) | 0, e = e + Math.imul(N, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(Q, L), e = Math.imul(Q, X), e = e + Math.imul(ct, L) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul(N, at) | 0, e = e + Math.imul(N, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(E, L), e = Math.imul(E, X), e = e + Math.imul(w, L) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul(N, ht) | 0, e = e + Math.imul(N, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, L), e = Math.imul(T, X), e = e + Math.imul(F, L) | 0, l = Math.imul(F, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul(N, st) | 0, e = e + Math.imul(N, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(F, G) | 0, l = Math.imul(F, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul(N, ot) | 0, e = e + Math.imul(N, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(F, it) | 0, l = Math.imul(F, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul(N, ut) | 0, e = e + Math.imul(N, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(F, nt) | 0, l = Math.imul(F, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(F, ft) | 0, l = Math.imul(F, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(F, at) | 0, l = Math.imul(F, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(F, ht) | 0, l = Math.imul(F, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(F, st) | 0, l = Math.imul(F, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(F, ot) | 0, l = Math.imul(F, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(F, ut) | 0, l = Math.imul(F, St);
      var pe = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (pe >>> 26) | 0, pe &= 67108863, c[0] = Nt, c[1] = $t, c[2] = Qt, c[3] = te, c[4] = ee, c[5] = re, c[6] = ie, c[7] = ne, c[8] = fe, c[9] = ae, c[10] = he, c[11] = se, c[12] = oe, c[13] = ue, c[14] = le, c[15] = de, c[16] = ce, c[17] = ve, c[18] = pe, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (U = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, h = 0, d = 0; d < r.length - 1; d++) {
        var c = h;
        h = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, q = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, q = q + v | 0, v = q & 67108863, c = c + (q >>> 26) | 0, h += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = h;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new $();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, h = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = U(this, t, r) : h < 63 ? i = D(this, t, r) : h < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function $(p, t) {
      this.x = p, this.y = t;
    }
    $.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, h = 0; h < t; h++)
        r[h] = this.revBin(h, i, t);
      return r;
    }, $.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var h = 0, d = 0; d < r; d++)
        h |= (t & 1) << r - d - 1, t >>= 1;
      return h;
    }, $.prototype.permute = function(t, r, i, h, d, c) {
      for (var v = 0; v < c; v++)
        h[v] = r[t[v]], d[v] = i[t[v]];
    }, $.prototype.transform = function(t, r, i, h, d, c) {
      this.permute(c, t, r, i, h, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, q = 0; q < v; q++) {
            var O = i[b + q], R = h[b + q], P = i[b + q + v], N = h[b + q + v], K = _ * P - C * N;
            N = _ * N + C * P, P = K, i[b + q] = O + P, h[b + q] = R + N, i[b + q + v] = O - P, h[b + q + v] = R - N, q !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, $.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, h = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + h;
    }, $.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var h = 0; h < i / 2; h++) {
          var d = t[h];
          t[h] = t[i - h - 1], t[i - h - 1] = d, d = r[h], r[h] = -r[i - h - 1], r[i - h - 1] = -d;
        }
    }, $.prototype.normalize13b = function(t, r) {
      for (var i = 0, h = 0; h < r / 2; h++) {
        var d = Math.round(t[2 * h + 1] / r) * 8192 + Math.round(t[2 * h] / r) + i;
        t[h] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, $.prototype.convert13b = function(t, r, i, h) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < h; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, $.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, $.prototype.mulp = function(t, r, i) {
      var h = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(h), c = this.stub(h), v = new Array(h), u = new Array(h), e = new Array(h), l = new Array(h), b = new Array(h), _ = new Array(h), C = i.words;
      C.length = h, this.convert13b(t.words, t.length, v, h), this.convert13b(r.words, r.length, l, h), this.transform(v, c, u, e, h, d), this.transform(l, c, b, _, h, d);
      for (var q = 0; q < h; q++) {
        var O = u[q] * b[q] - e[q] * _[q];
        e[q] = u[q] * _[q] + e[q] * b[q], u[q] = O;
      }
      return this.conjugate(u, e, h), this.transform(u, e, C, c, h, d), this.conjugate(C, c, h), this.normalize13b(C, h), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), z(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      s(typeof t == "number"), s(t < 67108864);
      for (var r = 0, i = 0; i < this.length; i++) {
        var h = (this.words[i] | 0) * t, d = (h & 67108863) + (r & 67108863);
        r >>= 26, r += h / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = k(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, h = 0; h < r.length && r[h] === 0; h++, i = i.sqr())
        ;
      if (++h < r.length)
        for (var d = i.sqr(); h < r.length; h++, d = d.sqr())
          r[h] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & h, u = (this.words[d] | 0) - v << r;
          this.words[d] = u | c, c = v >>> 26 - r;
        }
        c && (this.words[d] = c, this.length++);
      }
      if (i !== 0) {
        for (d = this.length - 1; d >= 0; d--)
          this.words[d + i] = this.words[d];
        for (d = 0; d < i; d++)
          this.words[d] = 0;
        this.length += i;
      }
      return this.strip();
    }, f.prototype.ishln = function(t) {
      return s(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      s(typeof t == "number" && t >= 0);
      var h;
      r ? h = (r - r % 26) / 26 : h = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (h -= c, h = Math.max(0, h), u) {
        for (var e = 0; e < c; e++)
          u.words[e] = this.words[e];
        u.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var l = 0;
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= h); e--) {
        var b = this.words[e] | 0;
        this.words[e] = l << 26 - d | b >>> d, l = b & v;
      }
      return u && l !== 0 && (u.words[u.length++] = l), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return s(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & h);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var h = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= h;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return s(typeof t == "number"), s(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (s(typeof t == "number"), s(t < 67108864), t < 0)
        return this.iaddn(-t);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(t), this.negative = 1, this;
      if (this.words[0] -= t, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var r = 0; r < this.length && this.words[r] < 0; r++)
          this.words[r] += 67108864, this.words[r + 1] -= 1;
      return this.strip();
    }, f.prototype.addn = function(t) {
      return this.clone().iaddn(t);
    }, f.prototype.subn = function(t) {
      return this.clone().isubn(t);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(t, r, i) {
      var h = t.length + i, d;
      this._expand(h);
      var c, v = 0;
      for (d = 0; d < t.length; d++) {
        c = (this.words[d + i] | 0) + v;
        var u = (t.words[d] | 0) * r;
        c -= u & 67108863, v = (c >> 26) - (u / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (s(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, h = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), h.iushln(i), c = d.words[d.length - 1] | 0);
      var u = h.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = h.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (h = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (h.words[d.length + _] | 0) * 67108864 + (h.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), h._ishlnsubmul(d, C, _); h.negative !== 0; )
          C--, h.negative = 0, h._ishlnsubmul(d, 1, _), h.isZero() || (h.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), h.strip(), r !== "div" && i !== 0 && h.iushrn(i), {
        div: e || null,
        mod: h
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var h, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (h = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: h,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (h = c.div.neg()), {
        div: h,
        mod: c.mod
      }) : this.negative & t.negative ? (c = this.neg().divmod(t.neg(), r), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.isub(t)), {
        div: c.div,
        mod: d
      }) : t.length > this.length || this.cmp(t) < 0 ? {
        div: new f(0),
        mod: this
      } : t.length === 1 ? r === "div" ? {
        div: this.divn(t.words[0]),
        mod: null
      } : r === "mod" ? {
        div: null,
        mod: new f(this.modn(t.words[0]))
      } : {
        div: this.divn(t.words[0]),
        mod: new f(this.modn(t.words[0]))
      } : this._wordDiv(t, r);
    }, f.prototype.div = function(t) {
      return this.divmod(t, "div", !1).div;
    }, f.prototype.mod = function(t) {
      return this.divmod(t, "mod", !1).mod;
    }, f.prototype.umod = function(t) {
      return this.divmod(t, "mod", !0).mod;
    }, f.prototype.divRound = function(t) {
      var r = this.divmod(t);
      if (r.mod.isZero())
        return r.div;
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, h = t.ushrn(1), d = t.andln(1), c = i.cmp(h);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, h = this.length - 1; h >= 0; h--)
        i = (r * i + (this.words[h] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = (this.words[i] | 0) + r * 67108864;
        this.words[i] = h / t | 0, r = h % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (h.isOdd() || d.isOdd()) && (h.iadd(e), d.isub(l)), h.iushrn(1), d.iushrn(1);
        for (var C = 0, q = 1; !(i.words[0] & q) && C < 26; ++C, q <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(c), d.isub(v)) : (i.isub(r), c.isub(h), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(u)
      };
    }, f.prototype._invmp = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var h = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            h.isOdd() && h.iadd(c), h.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), h.isub(d)) : (i.isub(r), d.isub(h));
      }
      var b;
      return r.cmpn(1) === 0 ? b = h : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var h = 0; r.isEven() && i.isEven(); h++)
        r.iushrn(1), i.iushrn(1);
      do {
        for (; r.isEven(); )
          r.iushrn(1);
        for (; i.isEven(); )
          i.iushrn(1);
        var d = r.cmp(i);
        if (d < 0) {
          var c = r;
          r = i, i = c;
        } else if (d === 0 || i.cmpn(1) === 0)
          break;
        r.isub(i);
      } while (!0);
      return i.iushln(h);
    }, f.prototype.invm = function(t) {
      return this.egcd(t).a.umod(t);
    }, f.prototype.isEven = function() {
      return (this.words[0] & 1) === 0;
    }, f.prototype.isOdd = function() {
      return (this.words[0] & 1) === 1;
    }, f.prototype.andln = function(t) {
      return this.words[0] & t;
    }, f.prototype.bincn = function(t) {
      s(typeof t == "number");
      var r = t % 26, i = (t - r) / 26, h = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= h, this;
      for (var d = h, c = i; d !== 0 && c < this.length; c++) {
        var v = this.words[c] | 0;
        v += d, d = v >>> 26, v &= 67108863, this.words[c] = v;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this;
    }, f.prototype.isZero = function() {
      return this.length === 1 && this.words[0] === 0;
    }, f.prototype.cmpn = function(t) {
      var r = t < 0;
      if (this.negative !== 0 && !r)
        return -1;
      if (this.negative === 0 && r)
        return 1;
      this.strip();
      var i;
      if (this.length > 1)
        i = 1;
      else {
        r && (t = -t), s(t <= 67108863, "Number is too big");
        var h = this.words[0] | 0;
        i = h === t ? 0 : h < t ? -1 : 1;
      }
      return this.negative !== 0 ? -i | 0 : i;
    }, f.prototype.cmp = function(t) {
      if (this.negative !== 0 && t.negative === 0)
        return -1;
      if (this.negative === 0 && t.negative !== 0)
        return 1;
      var r = this.ucmp(t);
      return this.negative !== 0 ? -r | 0 : r;
    }, f.prototype.ucmp = function(t) {
      if (this.length > t.length)
        return 1;
      if (this.length < t.length)
        return -1;
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var h = this.words[i] | 0, d = t.words[i] | 0;
        if (h !== d) {
          h < d ? r = -1 : h > d && (r = 1);
          break;
        }
      }
      return r;
    }, f.prototype.gtn = function(t) {
      return this.cmpn(t) === 1;
    }, f.prototype.gt = function(t) {
      return this.cmp(t) === 1;
    }, f.prototype.gten = function(t) {
      return this.cmpn(t) >= 0;
    }, f.prototype.gte = function(t) {
      return this.cmp(t) >= 0;
    }, f.prototype.ltn = function(t) {
      return this.cmpn(t) === -1;
    }, f.prototype.lt = function(t) {
      return this.cmp(t) === -1;
    }, f.prototype.lten = function(t) {
      return this.cmpn(t) <= 0;
    }, f.prototype.lte = function(t) {
      return this.cmp(t) <= 0;
    }, f.prototype.eqn = function(t) {
      return this.cmpn(t) === 0;
    }, f.prototype.eq = function(t) {
      return this.cmp(t) === 0;
    }, f.red = function(t) {
      return new Y(t);
    }, f.prototype.toRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), s(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return s(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return s(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return s(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return s(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return s(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return s(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return s(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return s(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return s(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return s(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return s(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return s(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return s(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return s(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var lt = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function H(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    H.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, H.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var h = i < this.n ? -1 : r.ucmp(this.p);
      return h === 0 ? (r.words[0] = 0, r.length = 1) : h > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, H.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, H.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function At() {
      H.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(At, H), At.prototype.split = function(t, r) {
      for (var i = 4194303, h = Math.min(t.length, 9), d = 0; d < h; d++)
        r.words[d] = t.words[d];
      if (r.length = h, t.length <= 9) {
        t.words[0] = 0, t.length = 1;
        return;
      }
      var c = t.words[9];
      for (r.words[r.length++] = c & i, d = 10; d < t.length; d++) {
        var v = t.words[d] | 0;
        t.words[d - 10] = (v & i) << 4 | c >>> 22, c = v;
      }
      c >>>= 22, t.words[d - 10] = c, c === 0 && t.length > 10 ? t.length -= 10 : t.length -= 9;
    }, At.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = t.words[i] | 0;
        r += h * 977, t.words[i] = r & 67108863, r = h * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function Bt() {
      H.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(Bt, H);
    function Ct() {
      H.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(Ct, H);
    function Et() {
      H.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(Et, H), Et.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var h = (t.words[i] | 0) * 19 + r, d = h & 67108863;
        h >>>= 26, t.words[i] = d, r = h;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (lt[t])
        return lt[t];
      var r;
      if (t === "k256")
        r = new At();
      else if (t === "p224")
        r = new Bt();
      else if (t === "p192")
        r = new Ct();
      else if (t === "p25519")
        r = new Et();
      else
        throw new Error("Unknown prime " + t);
      return lt[t] = r, r;
    };
    function Y(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        s(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    Y.prototype._verify1 = function(t) {
      s(t.negative === 0, "red works only with positives"), s(t.red, "red works only with red numbers");
    }, Y.prototype._verify2 = function(t, r) {
      s((t.negative | r.negative) === 0, "red works only with positives"), s(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, Y.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, Y.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, Y.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, Y.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, Y.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, Y.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, Y.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, Y.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, Y.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, Y.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, Y.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, Y.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (s(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var h = this.m.subn(1), d = 0; !h.isZero() && h.andln(1) === 0; )
        d++, h.iushrn(1);
      s(!h.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, h), b = this.pow(t, h.addn(1).iushrn(1)), _ = this.pow(t, h), C = d; _.cmp(c) !== 0; ) {
        for (var q = _, O = 0; q.cmp(c) !== 0; O++)
          q = q.redSqr();
        s(O < C);
        var R = this.pow(l, new f(1).iushln(C - O - 1));
        b = b.redMul(R), l = R.redSqr(), _ = _.redMul(l), C = O;
      }
      return b;
    }, Y.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, Y.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, h = new Array(1 << i);
      h[0] = new f(1).toRed(this), h[1] = t;
      for (var d = 2; d < h.length; d++)
        h[d] = this.mul(h[d - 1], t);
      var c = h[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== h[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, h[v]), u = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, Y.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, Y.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new It(t);
    };
    function It(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(It, Y), It.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, It.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, It.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), h = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(h).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, It.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(a, Xt);
})(Q0);
var ta = Q0.exports, ph = ta, K2 = zt.Buffer;
function H2(a, n) {
  return K2.from(a.toRed(ph.mont(n.modulus)).redPow(new ph(n.publicExponent)).fromRed().toArray());
}
var Zo = H2, Z2 = uf, y0 = yi, W2 = Qi, mh = Ko, gh = Ho, ea = ta, V2 = Zo, Y2 = K0, Qe = zt.Buffer, J2 = function(n, o, s) {
  var m;
  n.padding ? m = n.padding : s ? m = 1 : m = 4;
  var f = Z2(n), g;
  if (m === 4)
    g = G2(f, o);
  else if (m === 1)
    g = X2(f, o, s);
  else if (m === 3) {
    if (g = new ea(o), g.cmp(f.modulus) >= 0)
      throw new Error("data too long for modulus");
  } else
    throw new Error("unknown padding");
  return s ? Y2(g, f) : V2(g, f);
};
function G2(a, n) {
  var o = a.modulus.byteLength(), s = n.length, m = W2("sha1").update(Qe.alloc(0)).digest(), f = m.length, g = 2 * f;
  if (s > o - g - 2)
    throw new Error("message too long");
  var y = Qe.alloc(o - s - g - 2), S = o - f - 1, B = y0(f), M = gh(Qe.concat([m, y, Qe.alloc(1, 1), n], S), mh(B, S)), x = gh(B, mh(M, f));
  return new ea(Qe.concat([Qe.alloc(1), x, M], o));
}
function X2(a, n, o) {
  var s = n.length, m = a.modulus.byteLength();
  if (s > m - 11)
    throw new Error("message too long");
  var f;
  return o ? f = Qe.alloc(m - s - 3, 255) : f = j2(m - s - 3), new ea(Qe.concat([Qe.from([0, o ? 1 : 2]), f, Qe.alloc(1), n], m));
}
function j2(a) {
  for (var n = Qe.allocUnsafe(a), o = 0, s = y0(a * 2), m = 0, f; o < a; )
    m === s.length && (s = y0(a * 2), m = 0), f = s[m++], f && (n[o++] = f);
  return n;
}
var Q2 = uf, bh = Ko, yh = Ho, wh = ta, tg = K0, eg = Qi, rg = Zo, Vi = zt.Buffer, ig = function(n, o, s) {
  var m;
  n.padding ? m = n.padding : s ? m = 1 : m = 4;
  var f = Q2(n), g = f.modulus.byteLength();
  if (o.length > g || new wh(o).cmp(f.modulus) >= 0)
    throw new Error("decryption error");
  var y;
  s ? y = rg(new wh(o), f) : y = tg(o, f);
  var S = Vi.alloc(g - y.length);
  if (y = Vi.concat([S, y], g), m === 4)
    return ng(f, y);
  if (m === 1)
    return fg(f, y, s);
  if (m === 3)
    return y;
  throw new Error("unknown padding");
};
function ng(a, n) {
  var o = a.modulus.byteLength(), s = eg("sha1").update(Vi.alloc(0)).digest(), m = s.length;
  if (n[0] !== 0)
    throw new Error("decryption error");
  var f = n.slice(1, m + 1), g = n.slice(m + 1), y = yh(f, bh(g, m)), S = yh(g, bh(y, o - m - 1));
  if (ag(s, S.slice(0, m)))
    throw new Error("decryption error");
  for (var B = m; S[B] === 0; )
    B++;
  if (S[B++] !== 1)
    throw new Error("decryption error");
  return S.slice(B);
}
function fg(a, n, o) {
  for (var s = n.slice(0, 2), m = 2, f = 0; n[m++] !== 0; )
    if (m >= n.length) {
      f++;
      break;
    }
  var g = n.slice(2, m - 1);
  if ((s.toString("hex") !== "0002" && !o || s.toString("hex") !== "0001" && o) && f++, g.length < 8 && f++, f)
    throw new Error("decryption error");
  return n.slice(m);
}
function ag(a, n) {
  a = Vi.from(a), n = Vi.from(n);
  var o = 0, s = a.length;
  a.length !== n.length && (o++, s = Math.min(a.length, n.length));
  for (var m = -1; ++m < s; )
    o += a[m] ^ n[m];
  return o;
}
(function(a) {
  a.publicEncrypt = J2, a.privateDecrypt = ig, a.privateEncrypt = function(o, s) {
    return a.publicEncrypt(o, s, !0);
  }, a.publicDecrypt = function(o, s) {
    return a.privateDecrypt(o, s, !0);
  };
})(zo);
var Ui = {};
function Mh() {
  throw new Error(`secure random number generation not supported by this browser
use chrome, FireFox or Internet Explorer 11`);
}
var Wo = zt, xh = yi, Vo = Wo.Buffer, Yo = Wo.kMaxLength, w0 = Xt.crypto || Xt.msCrypto, Jo = Math.pow(2, 32) - 1;
function Go(a, n) {
  if (typeof a != "number" || a !== a)
    throw new TypeError("offset must be a number");
  if (a > Jo || a < 0)
    throw new TypeError("offset must be a uint32");
  if (a > Yo || a > n)
    throw new RangeError("offset out of range");
}
function Xo(a, n, o) {
  if (typeof a != "number" || a !== a)
    throw new TypeError("size must be a number");
  if (a > Jo || a < 0)
    throw new TypeError("size must be a uint32");
  if (a + n > o || a > Yo)
    throw new RangeError("buffer too small");
}
w0 && w0.getRandomValues || !we.browser ? (Ui.randomFill = hg, Ui.randomFillSync = sg) : (Ui.randomFill = Mh, Ui.randomFillSync = Mh);
function hg(a, n, o, s) {
  if (!Vo.isBuffer(a) && !(a instanceof Xt.Uint8Array))
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
  if (typeof n == "function")
    s = n, n = 0, o = a.length;
  else if (typeof o == "function")
    s = o, o = a.length - n;
  else if (typeof s != "function")
    throw new TypeError('"cb" argument must be a function');
  return Go(n, a.length), Xo(o, n, a.length), jo(a, n, o, s);
}
function jo(a, n, o, s) {
  if (we.browser) {
    var m = a.buffer, f = new Uint8Array(m, n, o);
    if (w0.getRandomValues(f), s) {
      we.nextTick(function() {
        s(null, a);
      });
      return;
    }
    return a;
  }
  if (s) {
    xh(o, function(y, S) {
      if (y)
        return s(y);
      S.copy(a, n), s(null, a);
    });
    return;
  }
  var g = xh(o);
  return g.copy(a, n), a;
}
function sg(a, n, o) {
  if (typeof n == "undefined" && (n = 0), !Vo.isBuffer(a) && !(a instanceof Xt.Uint8Array))
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
  return Go(n, a.length), o === void 0 && (o = a.length - n), Xo(o, n, a.length), jo(a, n, o);
}
var _h;
function Qo() {
  if (_h)
    return Lt;
  _h = 1, Lt.randomBytes = Lt.rng = Lt.pseudoRandomBytes = Lt.prng = yi, Lt.createHash = Lt.Hash = Qi, Lt.createHmac = Lt.Hmac = Jh;
  var a = jd, n = Object.keys(a), o = [
    "sha1",
    "sha224",
    "sha256",
    "sha384",
    "sha512",
    "md5",
    "rmd160"
  ].concat(n);
  Lt.getHashes = function() {
    return o;
  };
  var s = On;
  Lt.pbkdf2 = s.pbkdf2, Lt.pbkdf2Sync = s.pbkdf2Sync;
  var m = tr;
  Lt.Cipher = m.Cipher, Lt.createCipher = m.createCipher, Lt.Cipheriv = m.Cipheriv, Lt.createCipheriv = m.createCipheriv, Lt.Decipher = m.Decipher, Lt.createDecipher = m.createDecipher, Lt.Decipheriv = m.Decipheriv, Lt.createDecipheriv = m.createDecipheriv, Lt.getCiphers = m.getCiphers, Lt.listCiphers = m.listCiphers;
  var f = sv();
  Lt.DiffieHellmanGroup = f.DiffieHellmanGroup, Lt.createDiffieHellmanGroup = f.createDiffieHellmanGroup, Lt.getDiffieHellman = f.getDiffieHellman, Lt.createDiffieHellman = f.createDiffieHellman, Lt.DiffieHellman = f.DiffieHellman;
  var g = $2();
  Lt.createSign = g.createSign, Lt.Sign = g.Sign, Lt.createVerify = g.createVerify, Lt.Verify = g.Verify, Lt.createECDH = U2();
  var y = zo;
  Lt.publicEncrypt = y.publicEncrypt, Lt.privateEncrypt = y.privateEncrypt, Lt.publicDecrypt = y.publicDecrypt, Lt.privateDecrypt = y.privateDecrypt;
  var S = Ui;
  return Lt.randomFill = S.randomFill, Lt.randomFillSync = S.randomFillSync, Lt.createCredentials = function() {
    throw new Error(`sorry, createCredentials is not implemented yet
we accept pull requests
https://github.com/browserify/crypto-browserify`);
  }, Lt.constants = {
    DH_CHECK_P_NOT_SAFE_PRIME: 2,
    DH_CHECK_P_NOT_PRIME: 1,
    DH_UNABLE_TO_CHECK_GENERATOR: 4,
    DH_NOT_SUITABLE_GENERATOR: 8,
    NPN_ENABLED: 1,
    ALPN_ENABLED: 1,
    RSA_PKCS1_PADDING: 1,
    RSA_SSLV23_PADDING: 2,
    RSA_NO_PADDING: 3,
    RSA_PKCS1_OAEP_PADDING: 4,
    RSA_X931_PADDING: 5,
    RSA_PKCS1_PSS_PADDING: 6,
    POINT_CONVERSION_COMPRESSED: 2,
    POINT_CONVERSION_UNCOMPRESSED: 4,
    POINT_CONVERSION_HYBRID: 6
  }, Lt;
}
var og = Qo();
const ug = /* @__PURE__ */ pu(og);
function tu(a) {
  const n = ug.createHash("sha256").update(a).digest("hex");
  return parseInt(n.slice(0, 8), 16) % 1e4 / 100;
}
function lg(a, n) {
  if (!n || n.length === 0)
    return null;
  const o = tu(a);
  let s = 0, m = 0;
  for (const g of n)
    m += g.weight;
  const f = m > 0 ? o * m / 100 : o;
  for (const g of n)
    if (s += g.weight, f < s)
      return g.value;
  return n[n.length - 1].value;
}
function Sh(a, n) {
  var m, f, g;
  const o = n, s = ((m = o.user) == null ? void 0 : m.key) || // Standard nested structure
  ((f = o.organization) == null ? void 0 : f.key) || // Organization key
  o.user_id || // Legacy flat structure
  o.id || // Legacy flat structure
  ((g = o.user) == null ? void 0 : g.email) || // User email as fallback
  o.email;
  if (!a || typeof a != "object" || !s || !("strategy" in a))
    return null;
  switch (a.strategy) {
    case "percentage": {
      if (!("percentage" in a) || !("salt" in a))
        return null;
      const { percentage: y, salt: S } = a;
      return typeof y != "number" || y < 0 || y > 100 ? null : tu(`${s}.${S}`) < y ? !0 : null;
    }
    case "variant": {
      if (!("variants" in a) || !("salt" in a))
        return null;
      const { salt: y, variants: S } = a;
      return !Array.isArray(S) || S.length === 0 ? null : lg(`${s}.${y}`, S);
    }
    default:
      return null;
  }
}
function dg(a, n) {
  var m, f, g;
  if (!(a.targeting_rules || []).every((y) => {
    var S;
    if (y.type === "segment") {
      const B = (S = a.segmentsById) == null ? void 0 : S[y.segment_id];
      return B ? Iu(B, n) : !1;
    } else
      return Bh(y, n);
  }))
    return null;
  if (a.rollout) {
    if (a.rollout.strategy === "percentage")
      return Sh(a.rollout, n) && (m = a.value) != null ? m : null;
    {
      const y = Sh(a.rollout, n);
      return (f = y != null ? y : a.value) != null ? f : null;
    }
  }
  return (g = a.value) != null ? g : null;
}
let on = {
  getItem: (a) => typeof localStorage != "undefined" ? localStorage.getItem(a) : null,
  setItem: (a, n) => {
    typeof localStorage != "undefined" && localStorage.setItem(a, n);
  }
};
function cg(a) {
  on = a;
}
function eu(a) {
  return `flagmint_${a}_flags`;
}
function ru(a) {
  return `flagmint_${a}_context`;
}
function iu(a, n) {
  try {
    const o = on.getItem(eu(a));
    if (!o)
      return null;
    const s = JSON.parse(o);
    return Date.now() - s.ts > n ? null : s.data;
  } catch (o) {
    return null;
  }
}
function nu(a, n) {
  try {
    on.setItem(eu(a), JSON.stringify({ ts: Date.now(), data: n }));
  } catch (o) {
  }
}
function fu(a) {
  try {
    const n = on.getItem(ru(a));
    return n ? JSON.parse(n) : null;
  } catch (n) {
    return null;
  }
}
function au(a, n) {
  try {
    on.setItem(ru(a), JSON.stringify(n));
  } catch (o) {
  }
}
const Sg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loadCachedContext: fu,
  loadCachedFlags: iu,
  saveCachedContext: au,
  saveCachedFlags: nu,
  setCacheStorage: cg
}, Symbol.toStringTag, { value: "Module" })), vg = 24 * 60 * 60 * 1e3;
function hu() {
  switch (typeof process != "undefined" ? process.env.NEXT_PUBLIC_NODE_ENV || process.env.NODE_ENV : "development") {
    case "production":
      return {
        rest: "https://api.flagmint.com/evaluator/evaluate",
        ws: "wss://api.flagmint.com/ws/sdk"
      };
    case "staging":
      return {
        rest: "https://staging-api.flagmint.com/evaluator/evaluate",
        ws: "wss://staging-api.flagmint.com/ws/sdk"
      };
    case "development":
    default:
      return {
        rest: "http://localhost:3000/evaluator/evaluate",
        ws: "ws://localhost:3000/ws/sdk"
      };
  }
}
const pg = hu().rest, mg = hu().ws;
class Ag {
  /**
   * Creates a new FlagClient instance.
   * @param options - Configuration options for the client.
   */
  constructor(n) {
    var o, s, m, f, g, y, S;
    if (this.flags = {}, this.refreshIntervalId = null, this.rawFlags = {}, this.isInitialized = !1, this.subscribers = /* @__PURE__ */ new Set(), this.apiKey = n.apiKey, this.enableOfflineCache = (o = n.enableOfflineCache) != null ? o : !0, this.persistContext = (s = n.persistContext) != null ? s : !1, this.cacheTTL = vg, this.onError = n.onError, this.restEndpoint = (m = n.restEndpoint) != null ? m : pg, this.wsEndpoint = (f = n.wsEndpoint) != null ? f : mg, this.cacheAdapter = (g = n.cacheAdapter) != null ? g : {
      loadFlags: iu,
      saveFlags: nu,
      loadContext: fu,
      saveContext: au
    }, this.context = n.context || {}, this.rawFlags = (y = n.rawFlags) != null ? y : {}, this.previewMode = n.previewMode || !1, this.deferInitialization = (S = n.deferInitialization) != null ? S : !1, this.previewMode && this.rawFlags && Object.keys(this.rawFlags).length > 0) {
      this.flags = this.evaluateLocally(this.rawFlags, this.context), this.readyPromise = Promise.resolve(), this.resolveReady = () => {
      }, this.rejectReady = () => {
      }, this.isInitialized = !0;
      return;
    } else
      this.previewMode && !this.rawFlags && Ot.error("[FlagClient] No raw flags provided for preview mode. Defaulting to remote fetch.");
    this.readyPromise = new Promise((B, M) => {
      this.resolveReady = B, this.rejectReady = M;
    }), this.deferInitialization ? (Ot.log("[FlagClient] Initialization deferred. Call ready() to initialize."), this.initializationOptions = n) : this.initialize(n);
  }
  /**
   * Initializes the client by loading cached flags and context, setting up the transport layer.
   */
  initialize(n) {
    return Ie(this, null, function* () {
      var o;
      if (Ot.log("[FlagClient] Initialization started with options:", n), this.isInitialized) {
        Ot.log("[FlagClient] Already initialized, skipping.");
        return;
      }
      try {
        if (this.persistContext) {
          const s = yield Promise.resolve(
            this.cacheAdapter.loadContext(this.apiKey)
          );
          s && (this.context = s);
        }
        if (this.enableOfflineCache) {
          const s = yield Promise.resolve(
            this.cacheAdapter.loadFlags(this.apiKey, this.cacheTTL)
          );
          s && (this.flags = s, this.notifySubscribers());
        }
        yield this.setupTransport(n), this.isInitialized = !0, this.resolveReady();
      } catch (s) {
        const m = s instanceof Error ? s : new Error(String(s));
        Ot.error("[FlagClient] Initialization failed:", m), Object.keys(this.flags).length > 0 && Ot.warn("[FlagClient] Transport connection failed. Serving cached flags."), (o = this.onError) == null || o.call(this, m), this.rejectReady(m);
      }
    });
  }
  /**
   * Sets up the transport layer for the client.
   */
  setupTransport(n) {
    return Ie(this, null, function* () {
      var g;
      Ot.log("[FlagClient] setupTransport() started");
      const o = (g = n.transportMode) != null ? g : "auto", s = () => Ie(this, null, function* () {
        Ot.log("[FlagClient] Initializing WebSocket transport...");
        const y = new ku(this.wsEndpoint, this.apiKey);
        return yield y.init(), Ot.log("[FlagClient] WebSocket transport initialized"), y;
      }), m = () => {
        const y = new Eu(this.restEndpoint, this.apiKey, this.context, {
          pollIntervalMs: 12e5,
          maxBackoffMs: 6e4,
          // 1min max backoff
          backoffMultiplier: 2
          // Double each time
        });
        return y.onFlagsUpdated((S) => {
          Ot.log("[FlagClient] Flags updated via long polling:", S), this.updateFlags(S);
        }), y.init(), y;
      };
      if (o === "websocket")
        this.transport = yield s();
      else if (o === "long-polling")
        this.transport = m();
      else
        try {
          this.transport = yield s();
        } catch (y) {
          Ot.warn("[FlagClient] WebSocket failed, falling back to long polling"), this.transport = m();
        }
      typeof this.transport.onFlagsUpdated == "function" && this.transport.onFlagsUpdated((y) => {
        Ot.log("[FlagClient] Flags updated via transport:", y), this.updateFlags(y);
      });
      const f = yield this.transport.fetchFlags(this.context);
      this.updateFlags(f);
    });
  }
  /**
   * Updates flags and notifies all subscribers.
   * This is the centralized method for any flag update.
   */
  updateFlags(n) {
    this.flags = n, this.enableOfflineCache && Promise.resolve(
      this.cacheAdapter.saveFlags(this.apiKey, n)
    ), this.notifySubscribers();
  }
  /**
   * Notifies all subscribers with the current flags.
   */
  notifySubscribers() {
    this.subscribers.forEach((n) => {
      try {
        n(this.flags);
      } catch (o) {
        Ot.error("[FlagClient] Error in subscriber callback:", o);
      }
    });
  }
  /**
   * Subscribe to flag changes.
   * @param callback - Function to call when flags update
   * @returns Unsubscribe function
   */
  subscribe(n) {
    return this.subscribers.add(n), n(this.flags), () => {
      this.subscribers.delete(n);
    };
  }
  /**
   * Get all flags.
   */
  getFlags() {
    return ni({}, this.flags);
  }
  /**
   * Get a single flag value.
   */
  getFlag(n, o) {
    var s;
    return (s = this.flags[n]) != null ? s : o;
  }
  /**
   * Update the evaluation context.
   */
  updateContext(n) {
    return Ie(this, null, function* () {
      var o;
      if (this.context = ni(ni({}, this.context), n), this.initializationOptions && (this.initializationOptions.context = this.context), this.persistContext && (yield Promise.resolve(
        this.cacheAdapter.saveContext(this.apiKey, this.context)
      )), this.transport && typeof this.transport.fetchFlags == "function")
        try {
          const s = yield this.transport.fetchFlags(this.context);
          typeof this.transport.onFlagsUpdated == "function" && this.transport.onFlagsUpdated((m) => {
            Ot.log("[FlagClient] Flags updated via transport:", m), this.updateFlags(m);
          });
        } catch (s) {
          Ot.error("[FlagClient] Error updating flags after context change:", s), (o = this.onError) == null || o.call(this, s);
        }
    });
  }
  /**
   * Destroy the client and clean up resources.
   */
  destroy() {
    this.refreshIntervalId && clearInterval(this.refreshIntervalId), this.subscribers.clear(), this.transport && this.transport.destroy();
  }
  /**
   * Wait for the client to be ready.
   */
  ready(n = 3e3) {
    return Ie(this, null, function* () {
      Ot.log("[FlagClient] 🔍 ready() START"), this.deferInitialization && !this.isInitialized && this.initializationOptions && (Ot.log("[FlagClient] 🔍 About to initialize..."), yield this.initialize(this.initializationOptions), Ot.log("[FlagClient] 🔍 Initialize complete")), !(Object.keys(this.flags).length > 0) && (yield this.waitForFlags(n), yield this.readyPromise);
    });
  }
  /**
   * Evaluate flags locally (for preview mode).
   */
  evaluateLocally(n, o) {
    const s = {};
    for (const m in n) {
      const f = dg(n[m], o);
      f !== null && (s[m] = f);
    }
    return s;
  }
  waitForFlags(n) {
    return new Promise((o) => {
      let s = !1;
      const m = setTimeout(() => {
        s || (s = !0, f(), o());
      }, n), f = this.subscribe((g) => {
        !s && Object.keys(g).length > 0 ? (s = !0, clearTimeout(m), f(), o()) : Ot.log("[FlagClient] 📥 Not resolving:", {
          resolved: s,
          flagsLength: Object.keys(g).length
        });
      });
      Ot.log("[FlagClient] 🔍 Subscribe callback registered");
    });
  }
}
function su(a) {
  return `flagmint_${a}_flags`;
}
function ou(a) {
  return `flagmint_${a}_context`;
}
let Rr = null;
function gg(a) {
  Rr = a;
}
function bg(a, n) {
  return Ie(this, null, function* () {
    if (!Rr)
      throw new Error("Async storage not set");
    try {
      const o = yield Rr.getItem(su(a));
      if (!o)
        return null;
      const s = JSON.parse(o);
      return Date.now() - s.ts > n ? null : s.data;
    } catch (o) {
      return null;
    }
  });
}
function yg(a, n) {
  return Ie(this, null, function* () {
    if (!Rr)
      throw new Error("Async storage not set");
    try {
      yield Rr.setItem(su(a), JSON.stringify({ ts: Date.now(), data: n }));
    } catch (o) {
    }
  });
}
function wg(a) {
  return Ie(this, null, function* () {
    if (!Rr)
      throw new Error("Async storage not set");
    try {
      const n = yield Rr.getItem(ou(a));
      return n ? JSON.parse(n) : null;
    } catch (n) {
      return null;
    }
  });
}
function Mg(a, n) {
  return Ie(this, null, function* () {
    if (!Rr)
      throw new Error("Async storage not set");
    try {
      yield Rr.setItem(ou(a), JSON.stringify(n));
    } catch (o) {
    }
  });
}
const Bg = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loadCachedContext: wg,
  loadCachedFlags: bg,
  saveCachedContext: Mg,
  saveCachedFlags: yg,
  setAsyncCacheStorage: gg
}, Symbol.toStringTag, { value: "Module" }));
typeof globalThis.Buffer == "undefined" && (globalThis.Buffer = br.Buffer);
export {
  Ag as FlagClient,
  Eu as LongPollingTransport,
  ku as WebSocketTransport,
  Bg as asyncCache,
  dg as evaluateFlagValue,
  Sh as evaluateRollout,
  tu as hashToPercentage,
  lg as pickVariant,
  Sg as syncCache
};
