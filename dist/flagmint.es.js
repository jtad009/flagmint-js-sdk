var nu = Object.defineProperty;
var j0 = Object.getOwnPropertySymbols;
var fu = Object.prototype.hasOwnProperty, au = Object.prototype.propertyIsEnumerable;
var pe = Math.pow, Q0 = (h, n, o) => n in h ? nu(h, n, { enumerable: !0, configurable: !0, writable: !0, value: o }) : h[n] = o, uf = (h, n) => {
  for (var o in n || (n = {}))
    fu.call(n, o) && Q0(h, o, n[o]);
  if (j0)
    for (var o of j0(n))
      au.call(n, o) && Q0(h, o, n[o]);
  return h;
};
var Ue = (h, n, o) => new Promise((s, m) => {
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
  y((o = o.apply(h, n)).next());
});
var Gt = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function hu(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default") ? h.default : h;
}
function su(h) {
  if (h.__esModule)
    return h;
  var n = h.default;
  if (typeof n == "function") {
    var o = function s() {
      return this instanceof s ? Reflect.construct(n, arguments, this.constructor) : n.apply(this, arguments);
    };
    o.prototype = n.prototype;
  } else
    o = {};
  return Object.defineProperty(o, "__esModule", { value: !0 }), Object.keys(h).forEach(function(s) {
    var m = Object.getOwnPropertyDescriptor(h, s);
    Object.defineProperty(o, s, m.get ? m : {
      enumerable: !0,
      get: function() {
        return h[s];
      }
    });
  }), o;
}
var gr = {}, kn = {};
kn.byteLength = lu;
kn.toByteArray = cu;
kn.fromByteArray = mu;
var hr = [], Ke = [], ou = typeof Uint8Array != "undefined" ? Uint8Array : Array, lf = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var ii = 0, uu = lf.length; ii < uu; ++ii)
  hr[ii] = lf[ii], Ke[lf.charCodeAt(ii)] = ii;
Ke["-".charCodeAt(0)] = 62;
Ke["_".charCodeAt(0)] = 63;
function wh(h) {
  var n = h.length;
  if (n % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var o = h.indexOf("=");
  o === -1 && (o = n);
  var s = o === n ? 0 : 4 - o % 4;
  return [o, s];
}
function lu(h) {
  var n = wh(h), o = n[0], s = n[1];
  return (o + s) * 3 / 4 - s;
}
function du(h, n, o) {
  return (n + o) * 3 / 4 - o;
}
function cu(h) {
  var n, o = wh(h), s = o[0], m = o[1], f = new ou(du(h, s, m)), g = 0, y = m > 0 ? s - 4 : s, S;
  for (S = 0; S < y; S += 4)
    n = Ke[h.charCodeAt(S)] << 18 | Ke[h.charCodeAt(S + 1)] << 12 | Ke[h.charCodeAt(S + 2)] << 6 | Ke[h.charCodeAt(S + 3)], f[g++] = n >> 16 & 255, f[g++] = n >> 8 & 255, f[g++] = n & 255;
  return m === 2 && (n = Ke[h.charCodeAt(S)] << 2 | Ke[h.charCodeAt(S + 1)] >> 4, f[g++] = n & 255), m === 1 && (n = Ke[h.charCodeAt(S)] << 10 | Ke[h.charCodeAt(S + 1)] << 4 | Ke[h.charCodeAt(S + 2)] >> 2, f[g++] = n >> 8 & 255, f[g++] = n & 255), f;
}
function vu(h) {
  return hr[h >> 18 & 63] + hr[h >> 12 & 63] + hr[h >> 6 & 63] + hr[h & 63];
}
function pu(h, n, o) {
  for (var s, m = [], f = n; f < o; f += 3)
    s = (h[f] << 16 & 16711680) + (h[f + 1] << 8 & 65280) + (h[f + 2] & 255), m.push(vu(s));
  return m.join("");
}
function mu(h) {
  for (var n, o = h.length, s = o % 3, m = [], f = 16383, g = 0, y = o - s; g < y; g += f)
    m.push(pu(h, g, g + f > y ? y : g + f));
  return s === 1 ? (n = h[o - 1], m.push(
    hr[n >> 2] + hr[n << 4 & 63] + "=="
  )) : s === 2 && (n = (h[o - 2] << 8) + h[o - 1], m.push(
    hr[n >> 10] + hr[n >> 4 & 63] + hr[n << 2 & 63] + "="
  )), m.join("");
}
var g0 = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
g0.read = function(h, n, o, s, m) {
  var f, g, y = m * 8 - s - 1, S = (1 << y) - 1, B = S >> 1, M = -7, x = o ? m - 1 : 0, k = o ? -1 : 1, I = h[n + x];
  for (x += k, f = I & (1 << -M) - 1, I >>= -M, M += y; M > 0; f = f * 256 + h[n + x], x += k, M -= 8)
    ;
  for (g = f & (1 << -M) - 1, f >>= -M, M += s; M > 0; g = g * 256 + h[n + x], x += k, M -= 8)
    ;
  if (f === 0)
    f = 1 - B;
  else {
    if (f === S)
      return g ? NaN : (I ? -1 : 1) * (1 / 0);
    g = g + Math.pow(2, s), f = f - B;
  }
  return (I ? -1 : 1) * g * Math.pow(2, f - s);
};
g0.write = function(h, n, o, s, m, f) {
  var g, y, S, B = f * 8 - m - 1, M = (1 << B) - 1, x = M >> 1, k = m === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, I = s ? 0 : f - 1, D = s ? 1 : -1, L = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
  for (n = Math.abs(n), isNaN(n) || n === 1 / 0 ? (y = isNaN(n) ? 1 : 0, g = M) : (g = Math.floor(Math.log(n) / Math.LN2), n * (S = Math.pow(2, -g)) < 1 && (g--, S *= 2), g + x >= 1 ? n += k / S : n += k * Math.pow(2, 1 - x), n * S >= 2 && (g++, S /= 2), g + x >= M ? (y = 0, g = M) : g + x >= 1 ? (y = (n * S - 1) * Math.pow(2, m), g = g + x) : (y = n * Math.pow(2, x - 1) * Math.pow(2, m), g = 0)); m >= 8; h[o + I] = y & 255, I += D, y /= 256, m -= 8)
    ;
  for (g = g << m | y, B += m; B > 0; h[o + I] = g & 255, I += D, g /= 256, B -= 8)
    ;
  h[o + I - D] |= L * 128;
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
(function(h) {
  const n = kn, o = g0, s = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
  h.Buffer = y, h.SlowBuffer = N, h.INSPECT_MAX_BYTES = 50;
  const m = 2147483647;
  h.kMaxLength = m, y.TYPED_ARRAY_SUPPORT = f(), !y.TYPED_ARRAY_SUPPORT && typeof console != "undefined" && typeof console.error == "function" && console.error(
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
      return k(E, w);
    if (ArrayBuffer.isView(E))
      return D(E);
    if (E == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof E
      );
    if (dt(E, ArrayBuffer) || E && dt(E.buffer, ArrayBuffer) || typeof SharedArrayBuffer != "undefined" && (dt(E, SharedArrayBuffer) || E && dt(E.buffer, SharedArrayBuffer)))
      return L(E, w, A);
    if (typeof E == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const T = E.valueOf && E.valueOf();
    if (T != null && T !== E)
      return y.from(T, w, A);
    const q = W(E);
    if (q)
      return q;
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
  function k(E, w) {
    if ((typeof w != "string" || w === "") && (w = "utf8"), !y.isEncoding(w))
      throw new TypeError("Unknown encoding: " + w);
    const A = lt(E, w) | 0;
    let T = g(A);
    const q = T.write(E, w);
    return q !== A && (T = T.slice(0, q)), T;
  }
  function I(E) {
    const w = E.length < 0 ? 0 : z(E.length) | 0, A = g(w);
    for (let T = 0; T < w; T += 1)
      A[T] = E[T] & 255;
    return A;
  }
  function D(E) {
    if (dt(E, Uint8Array)) {
      const w = new Uint8Array(E);
      return L(w.buffer, w.byteOffset, w.byteLength);
    }
    return I(E);
  }
  function L(E, w, A) {
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
      return typeof E.length != "number" || Ft(E.length) ? g(0) : I(E);
    if (E.type === "Buffer" && Array.isArray(E.data))
      return I(E.data);
  }
  function z(E) {
    if (E >= m)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + m.toString(16) + " bytes");
    return E | 0;
  }
  function N(E) {
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
    let T = w.length, q = A.length;
    for (let V = 0, U = Math.min(T, q); V < U; ++V)
      if (w[V] !== A[V]) {
        T = w[V], q = A[V];
        break;
      }
    return T < q ? -1 : q < T ? 1 : 0;
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
    const q = y.allocUnsafe(A);
    let V = 0;
    for (T = 0; T < w.length; ++T) {
      let U = w[T];
      if (dt(U, Uint8Array))
        V + U.length > q.length ? (y.isBuffer(U) || (U = y.from(U)), U.copy(q, V)) : Uint8Array.prototype.set.call(
          q,
          U,
          V
        );
      else if (y.isBuffer(U))
        U.copy(q, V);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      V += U.length;
    }
    return q;
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
    let q = !1;
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
          if (q)
            return T ? -1 : Dt(E).length;
          w = ("" + w).toLowerCase(), q = !0;
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
    const A = h.INSPECT_MAX_BYTES;
    return w = this.toString("hex", 0, A).replace(/(.{2})/g, "$1 ").trim(), this.length > A && (w += " ... "), "<Buffer " + w + ">";
  }, s && (y.prototype[s] = y.prototype.inspect), y.prototype.compare = function(w, A, T, q, V) {
    if (dt(w, Uint8Array) && (w = y.from(w, w.offset, w.byteLength)), !y.isBuffer(w))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof w
      );
    if (A === void 0 && (A = 0), T === void 0 && (T = w ? w.length : 0), q === void 0 && (q = 0), V === void 0 && (V = this.length), A < 0 || T > w.length || q < 0 || V > this.length)
      throw new RangeError("out of range index");
    if (q >= V && A >= T)
      return 0;
    if (q >= V)
      return -1;
    if (A >= T)
      return 1;
    if (A >>>= 0, T >>>= 0, q >>>= 0, V >>>= 0, this === w)
      return 0;
    let U = V - q, X = T - A;
    const Tt = Math.min(U, X), G = this.slice(q, V), rt = w.slice(A, T);
    for (let Rt = 0; Rt < Tt; ++Rt)
      if (G[Rt] !== rt[Rt]) {
        U = G[Rt], X = rt[Rt];
        break;
      }
    return U < X ? -1 : X < U ? 1 : 0;
  };
  function Bt(E, w, A, T, q) {
    if (E.length === 0)
      return -1;
    if (typeof A == "string" ? (T = A, A = 0) : A > 2147483647 ? A = 2147483647 : A < -2147483648 && (A = -2147483648), A = +A, Ft(A) && (A = q ? 0 : E.length - 1), A < 0 && (A = E.length + A), A >= E.length) {
      if (q)
        return -1;
      A = E.length - 1;
    } else if (A < 0)
      if (q)
        A = 0;
      else
        return -1;
    if (typeof w == "string" && (w = y.from(w, T)), y.isBuffer(w))
      return w.length === 0 ? -1 : Ct(E, w, A, T, q);
    if (typeof w == "number")
      return w = w & 255, typeof Uint8Array.prototype.indexOf == "function" ? q ? Uint8Array.prototype.indexOf.call(E, w, A) : Uint8Array.prototype.lastIndexOf.call(E, w, A) : Ct(E, [w], A, T, q);
    throw new TypeError("val must be string, number or Buffer");
  }
  function Ct(E, w, A, T, q) {
    let V = 1, U = E.length, X = w.length;
    if (T !== void 0 && (T = String(T).toLowerCase(), T === "ucs2" || T === "ucs-2" || T === "utf16le" || T === "utf-16le")) {
      if (E.length < 2 || w.length < 2)
        return -1;
      V = 2, U /= 2, X /= 2, A /= 2;
    }
    function Tt(rt, Rt) {
      return V === 1 ? rt[Rt] : rt.readUInt16BE(Rt * V);
    }
    let G;
    if (q) {
      let rt = -1;
      for (G = A; G < U; G++)
        if (Tt(E, G) === Tt(w, rt === -1 ? 0 : G - rt)) {
          if (rt === -1 && (rt = G), G - rt + 1 === X)
            return rt * V;
        } else
          rt !== -1 && (G -= G - rt), rt = -1;
    } else
      for (A + X > U && (A = U - X), G = A; G >= 0; G--) {
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
    const q = E.length - A;
    T ? (T = Number(T), T > q && (T = q)) : T = q;
    const V = w.length;
    T > V / 2 && (T = V / 2);
    let U;
    for (U = 0; U < T; ++U) {
      const X = parseInt(w.substr(U * 2, 2), 16);
      if (Ft(X))
        return U;
      E[A + U] = X;
    }
    return U;
  }
  function Y(E, w, A, T) {
    return j(Dt(w, E.length - A), E, A, T);
  }
  function kt(E, w, A, T) {
    return j(et(w), E, A, T);
  }
  function p(E, w, A, T) {
    return j(Pt(w), E, A, T);
  }
  function t(E, w, A, T) {
    return j(pt(w, E.length - A), E, A, T);
  }
  y.prototype.write = function(w, A, T, q) {
    if (A === void 0)
      q = "utf8", T = this.length, A = 0;
    else if (T === void 0 && typeof A == "string")
      q = A, T = this.length, A = 0;
    else if (isFinite(A))
      A = A >>> 0, isFinite(T) ? (T = T >>> 0, q === void 0 && (q = "utf8")) : (q = T, T = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const V = this.length - A;
    if ((T === void 0 || T > V) && (T = V), w.length > 0 && (T < 0 || A < 0) || A > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    q || (q = "utf8");
    let U = !1;
    for (; ; )
      switch (q) {
        case "hex":
          return Et(this, w, A, T);
        case "utf8":
        case "utf-8":
          return Y(this, w, A, T);
        case "ascii":
        case "latin1":
        case "binary":
          return kt(this, w, A, T);
        case "base64":
          return p(this, w, A, T);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return t(this, w, A, T);
        default:
          if (U)
            throw new TypeError("Unknown encoding: " + q);
          q = ("" + q).toLowerCase(), U = !0;
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
    let q = w;
    for (; q < A; ) {
      const V = E[q];
      let U = null, X = V > 239 ? 4 : V > 223 ? 3 : V > 191 ? 2 : 1;
      if (q + X <= A) {
        let Tt, G, rt, Rt;
        switch (X) {
          case 1:
            V < 128 && (U = V);
            break;
          case 2:
            Tt = E[q + 1], (Tt & 192) === 128 && (Rt = (V & 31) << 6 | Tt & 63, Rt > 127 && (U = Rt));
            break;
          case 3:
            Tt = E[q + 1], G = E[q + 2], (Tt & 192) === 128 && (G & 192) === 128 && (Rt = (V & 15) << 12 | (Tt & 63) << 6 | G & 63, Rt > 2047 && (Rt < 55296 || Rt > 57343) && (U = Rt));
            break;
          case 4:
            Tt = E[q + 1], G = E[q + 2], rt = E[q + 3], (Tt & 192) === 128 && (G & 192) === 128 && (rt & 192) === 128 && (Rt = (V & 15) << 18 | (Tt & 63) << 12 | (G & 63) << 6 | rt & 63, Rt > 65535 && Rt < 1114112 && (U = Rt));
        }
      }
      U === null ? (U = 65533, X = 1) : U > 65535 && (U -= 65536, T.push(U >>> 10 & 1023 | 55296), U = 56320 | U & 1023), T.push(U), q += X;
    }
    return d(T);
  }
  const a = 4096;
  function d(E) {
    const w = E.length;
    if (w <= a)
      return String.fromCharCode.apply(String, E);
    let A = "", T = 0;
    for (; T < w; )
      A += String.fromCharCode.apply(
        String,
        E.slice(T, T += a)
      );
    return A;
  }
  function c(E, w, A) {
    let T = "";
    A = Math.min(E.length, A);
    for (let q = w; q < A; ++q)
      T += String.fromCharCode(E[q] & 127);
    return T;
  }
  function v(E, w, A) {
    let T = "";
    A = Math.min(E.length, A);
    for (let q = w; q < A; ++q)
      T += String.fromCharCode(E[q]);
    return T;
  }
  function u(E, w, A) {
    const T = E.length;
    (!w || w < 0) && (w = 0), (!A || A < 0 || A > T) && (A = T);
    let q = "";
    for (let V = w; V < A; ++V)
      q += Q[E[V]];
    return q;
  }
  function e(E, w, A) {
    const T = E.slice(w, A);
    let q = "";
    for (let V = 0; V < T.length - 1; V += 2)
      q += String.fromCharCode(T[V] + T[V + 1] * 256);
    return q;
  }
  y.prototype.slice = function(w, A) {
    const T = this.length;
    w = ~~w, A = A === void 0 ? T : ~~A, w < 0 ? (w += T, w < 0 && (w = 0)) : w > T && (w = T), A < 0 ? (A += T, A < 0 && (A = 0)) : A > T && (A = T), A < w && (A = w);
    const q = this.subarray(w, A);
    return Object.setPrototypeOf(q, y.prototype), q;
  };
  function l(E, w, A) {
    if (E % 1 !== 0 || E < 0)
      throw new RangeError("offset is not uint");
    if (E + w > A)
      throw new RangeError("Trying to access beyond buffer length");
  }
  y.prototype.readUintLE = y.prototype.readUIntLE = function(w, A, T) {
    w = w >>> 0, A = A >>> 0, T || l(w, A, this.length);
    let q = this[w], V = 1, U = 0;
    for (; ++U < A && (V *= 256); )
      q += this[w + U] * V;
    return q;
  }, y.prototype.readUintBE = y.prototype.readUIntBE = function(w, A, T) {
    w = w >>> 0, A = A >>> 0, T || l(w, A, this.length);
    let q = this[w + --A], V = 1;
    for (; A > 0 && (V *= 256); )
      q += this[w + --A] * V;
    return q;
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
    (A === void 0 || T === void 0) && qt(w, this.length - 8);
    const q = A + this[++w] * pe(2, 8) + this[++w] * pe(2, 16) + this[++w] * pe(2, 24), V = this[++w] + this[++w] * pe(2, 8) + this[++w] * pe(2, 16) + T * pe(2, 24);
    return BigInt(q) + (BigInt(V) << BigInt(32));
  }), y.prototype.readBigUInt64BE = ct(function(w) {
    w = w >>> 0, J(w, "offset");
    const A = this[w], T = this[w + 7];
    (A === void 0 || T === void 0) && qt(w, this.length - 8);
    const q = A * pe(2, 24) + this[++w] * pe(2, 16) + this[++w] * pe(2, 8) + this[++w], V = this[++w] * pe(2, 24) + this[++w] * pe(2, 16) + this[++w] * pe(2, 8) + T;
    return (BigInt(q) << BigInt(32)) + BigInt(V);
  }), y.prototype.readIntLE = function(w, A, T) {
    w = w >>> 0, A = A >>> 0, T || l(w, A, this.length);
    let q = this[w], V = 1, U = 0;
    for (; ++U < A && (V *= 256); )
      q += this[w + U] * V;
    return V *= 128, q >= V && (q -= Math.pow(2, 8 * A)), q;
  }, y.prototype.readIntBE = function(w, A, T) {
    w = w >>> 0, A = A >>> 0, T || l(w, A, this.length);
    let q = A, V = 1, U = this[w + --q];
    for (; q > 0 && (V *= 256); )
      U += this[w + --q] * V;
    return V *= 128, U >= V && (U -= Math.pow(2, 8 * A)), U;
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
    (A === void 0 || T === void 0) && qt(w, this.length - 8);
    const q = this[w + 4] + this[w + 5] * pe(2, 8) + this[w + 6] * pe(2, 16) + (T << 24);
    return (BigInt(q) << BigInt(32)) + BigInt(A + this[++w] * pe(2, 8) + this[++w] * pe(2, 16) + this[++w] * pe(2, 24));
  }), y.prototype.readBigInt64BE = ct(function(w) {
    w = w >>> 0, J(w, "offset");
    const A = this[w], T = this[w + 7];
    (A === void 0 || T === void 0) && qt(w, this.length - 8);
    const q = (A << 24) + // Overflow
    this[++w] * pe(2, 16) + this[++w] * pe(2, 8) + this[++w];
    return (BigInt(q) << BigInt(32)) + BigInt(this[++w] * pe(2, 24) + this[++w] * pe(2, 16) + this[++w] * pe(2, 8) + T);
  }), y.prototype.readFloatLE = function(w, A) {
    return w = w >>> 0, A || l(w, 4, this.length), o.read(this, w, !0, 23, 4);
  }, y.prototype.readFloatBE = function(w, A) {
    return w = w >>> 0, A || l(w, 4, this.length), o.read(this, w, !1, 23, 4);
  }, y.prototype.readDoubleLE = function(w, A) {
    return w = w >>> 0, A || l(w, 8, this.length), o.read(this, w, !0, 52, 8);
  }, y.prototype.readDoubleBE = function(w, A) {
    return w = w >>> 0, A || l(w, 8, this.length), o.read(this, w, !1, 52, 8);
  };
  function b(E, w, A, T, q, V) {
    if (!y.isBuffer(E))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (w > q || w < V)
      throw new RangeError('"value" argument is out of bounds');
    if (A + T > E.length)
      throw new RangeError("Index out of range");
  }
  y.prototype.writeUintLE = y.prototype.writeUIntLE = function(w, A, T, q) {
    if (w = +w, A = A >>> 0, T = T >>> 0, !q) {
      const X = Math.pow(2, 8 * T) - 1;
      b(this, w, A, T, X, 0);
    }
    let V = 1, U = 0;
    for (this[A] = w & 255; ++U < T && (V *= 256); )
      this[A + U] = w / V & 255;
    return A + T;
  }, y.prototype.writeUintBE = y.prototype.writeUIntBE = function(w, A, T, q) {
    if (w = +w, A = A >>> 0, T = T >>> 0, !q) {
      const X = Math.pow(2, 8 * T) - 1;
      b(this, w, A, T, X, 0);
    }
    let V = T - 1, U = 1;
    for (this[A + V] = w & 255; --V >= 0 && (U *= 256); )
      this[A + V] = w / U & 255;
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
  function _(E, w, A, T, q) {
    Z(w, T, q, E, A, 7);
    let V = Number(w & BigInt(4294967295));
    E[A++] = V, V = V >> 8, E[A++] = V, V = V >> 8, E[A++] = V, V = V >> 8, E[A++] = V;
    let U = Number(w >> BigInt(32) & BigInt(4294967295));
    return E[A++] = U, U = U >> 8, E[A++] = U, U = U >> 8, E[A++] = U, U = U >> 8, E[A++] = U, A;
  }
  function C(E, w, A, T, q) {
    Z(w, T, q, E, A, 7);
    let V = Number(w & BigInt(4294967295));
    E[A + 7] = V, V = V >> 8, E[A + 6] = V, V = V >> 8, E[A + 5] = V, V = V >> 8, E[A + 4] = V;
    let U = Number(w >> BigInt(32) & BigInt(4294967295));
    return E[A + 3] = U, U = U >> 8, E[A + 2] = U, U = U >> 8, E[A + 1] = U, U = U >> 8, E[A] = U, A + 8;
  }
  y.prototype.writeBigUInt64LE = ct(function(w, A = 0) {
    return _(this, w, A, BigInt(0), BigInt("0xffffffffffffffff"));
  }), y.prototype.writeBigUInt64BE = ct(function(w, A = 0) {
    return C(this, w, A, BigInt(0), BigInt("0xffffffffffffffff"));
  }), y.prototype.writeIntLE = function(w, A, T, q) {
    if (w = +w, A = A >>> 0, !q) {
      const Tt = Math.pow(2, 8 * T - 1);
      b(this, w, A, T, Tt - 1, -Tt);
    }
    let V = 0, U = 1, X = 0;
    for (this[A] = w & 255; ++V < T && (U *= 256); )
      w < 0 && X === 0 && this[A + V - 1] !== 0 && (X = 1), this[A + V] = (w / U >> 0) - X & 255;
    return A + T;
  }, y.prototype.writeIntBE = function(w, A, T, q) {
    if (w = +w, A = A >>> 0, !q) {
      const Tt = Math.pow(2, 8 * T - 1);
      b(this, w, A, T, Tt - 1, -Tt);
    }
    let V = T - 1, U = 1, X = 0;
    for (this[A + V] = w & 255; --V >= 0 && (U *= 256); )
      w < 0 && X === 0 && this[A + V + 1] !== 0 && (X = 1), this[A + V] = (w / U >> 0) - X & 255;
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
  function F(E, w, A, T, q, V) {
    if (A + T > E.length)
      throw new RangeError("Index out of range");
    if (A < 0)
      throw new RangeError("Index out of range");
  }
  function O(E, w, A, T, q) {
    return w = +w, A = A >>> 0, q || F(E, w, A, 4), o.write(E, w, A, T, 23, 4), A + 4;
  }
  y.prototype.writeFloatLE = function(w, A, T) {
    return O(this, w, A, !0, T);
  }, y.prototype.writeFloatBE = function(w, A, T) {
    return O(this, w, A, !1, T);
  };
  function R(E, w, A, T, q) {
    return w = +w, A = A >>> 0, q || F(E, w, A, 8), o.write(E, w, A, T, 52, 8), A + 8;
  }
  y.prototype.writeDoubleLE = function(w, A, T) {
    return R(this, w, A, !0, T);
  }, y.prototype.writeDoubleBE = function(w, A, T) {
    return R(this, w, A, !1, T);
  }, y.prototype.copy = function(w, A, T, q) {
    if (!y.isBuffer(w))
      throw new TypeError("argument should be a Buffer");
    if (T || (T = 0), !q && q !== 0 && (q = this.length), A >= w.length && (A = w.length), A || (A = 0), q > 0 && q < T && (q = T), q === T || w.length === 0 || this.length === 0)
      return 0;
    if (A < 0)
      throw new RangeError("targetStart out of bounds");
    if (T < 0 || T >= this.length)
      throw new RangeError("Index out of range");
    if (q < 0)
      throw new RangeError("sourceEnd out of bounds");
    q > this.length && (q = this.length), w.length - A < q - T && (q = w.length - A + T);
    const V = q - T;
    return this === w && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(A, T, q) : Uint8Array.prototype.set.call(
      w,
      this.subarray(T, q),
      A
    ), V;
  }, y.prototype.fill = function(w, A, T, q) {
    if (typeof w == "string") {
      if (typeof A == "string" ? (q = A, A = 0, T = this.length) : typeof T == "string" && (q = T, T = this.length), q !== void 0 && typeof q != "string")
        throw new TypeError("encoding must be a string");
      if (typeof q == "string" && !y.isEncoding(q))
        throw new TypeError("Unknown encoding: " + q);
      if (w.length === 1) {
        const U = w.charCodeAt(0);
        (q === "utf8" && U < 128 || q === "latin1") && (w = U);
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
      const U = y.isBuffer(w) ? w : y.from(w, q), X = U.length;
      if (X === 0)
        throw new TypeError('The value "' + w + '" is invalid for argument "value"');
      for (V = 0; V < T - A; ++V)
        this[V + A] = U[V % X];
    }
    return this;
  };
  const P = {};
  function $(E, w, A) {
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
      set code(q) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: q,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${E}]: ${this.message}`;
      }
    };
  }
  $(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(E) {
      return E ? `${E} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), $(
    "ERR_INVALID_ARG_TYPE",
    function(E, w) {
      return `The "${E}" argument must be of type number. Received type ${typeof w}`;
    },
    TypeError
  ), $(
    "ERR_OUT_OF_RANGE",
    function(E, w, A) {
      let T = `The value of "${E}" is out of range.`, q = A;
      return Number.isInteger(A) && Math.abs(A) > pe(2, 32) ? q = K(String(A)) : typeof A == "bigint" && (q = String(A), (A > pe(BigInt(2), BigInt(32)) || A < -pe(BigInt(2), BigInt(32))) && (q = K(q)), q += "n"), T += ` It must be ${w}. Received ${q}`, T;
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
  function It(E, w, A) {
    J(w, "offset"), (E[w] === void 0 || E[w + A] === void 0) && qt(w, E.length - (A + 1));
  }
  function Z(E, w, A, T, q, V) {
    if (E > A || E < w) {
      const U = typeof w == "bigint" ? "n" : "";
      let X;
      throw V > 3 ? w === 0 || w === BigInt(0) ? X = `>= 0${U} and < 2${U} ** ${(V + 1) * 8}${U}` : X = `>= -(2${U} ** ${(V + 1) * 8 - 1}${U}) and < 2 ** ${(V + 1) * 8 - 1}${U}` : X = `>= ${w}${U} and <= ${A}${U}`, new P.ERR_OUT_OF_RANGE("value", X, E);
    }
    It(T, q, V);
  }
  function J(E, w) {
    if (typeof E != "number")
      throw new P.ERR_INVALID_ARG_TYPE(w, "number", E);
  }
  function qt(E, w, A) {
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
    let q = null;
    const V = [];
    for (let U = 0; U < T; ++U) {
      if (A = E.charCodeAt(U), A > 55295 && A < 57344) {
        if (!q) {
          if (A > 56319) {
            (w -= 3) > -1 && V.push(239, 191, 189);
            continue;
          } else if (U + 1 === T) {
            (w -= 3) > -1 && V.push(239, 191, 189);
            continue;
          }
          q = A;
          continue;
        }
        if (A < 56320) {
          (w -= 3) > -1 && V.push(239, 191, 189), q = A;
          continue;
        }
        A = (q - 55296 << 10 | A - 56320) + 65536;
      } else
        q && (w -= 3) > -1 && V.push(239, 191, 189);
      if (q = null, A < 128) {
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
    let A, T, q;
    const V = [];
    for (let U = 0; U < E.length && !((w -= 2) < 0); ++U)
      A = E.charCodeAt(U), T = A >> 8, q = A % 256, V.push(q), V.push(T);
    return V;
  }
  function Pt(E) {
    return n.toByteArray(vt(E));
  }
  function j(E, w, A, T) {
    let q;
    for (q = 0; q < T && !(q + A >= w.length || q >= E.length); ++q)
      w[q + A] = E[q];
    return q;
  }
  function dt(E, w) {
    return E instanceof w || E != null && E.constructor != null && E.constructor.name != null && E.constructor.name === w.name;
  }
  function Ft(E) {
    return E !== E;
  }
  const Q = function() {
    const E = "0123456789abcdef", w = new Array(256);
    for (let A = 0; A < 16; ++A) {
      const T = A * 16;
      for (let q = 0; q < 16; ++q)
        w[T + q] = E[A] + E[q];
    }
    return w;
  }();
  function ct(E) {
    return typeof BigInt == "undefined" ? Lt : E;
  }
  function Lt() {
    throw new Error("BigInt not supported");
  }
})(gr);
class gu {
  constructor(n, o, s) {
    this.endpoint = n, this.apiKey = o, this.context = s, this.isStopped = !1;
  }
  init(n) {
    return Ue(this, null, function* () {
      for (; !this.isStopped; )
        try {
          const o = yield this.fetchFlags(this.context);
          n(o);
        } catch (o) {
          console.error("[LongPollingTransport] poll error", o), yield new Promise((s) => setTimeout(s, 2e3));
        }
    });
  }
  fetchFlags(n) {
    return Ue(this, null, function* () {
      const o = yield fetch(this.endpoint, {
        method: "POST",
        headers: {
          "x-api-key": `${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ context: n })
      });
      if (console.log(o, "response"), o.status === 401 || o.status === 403)
        throw new Error("Unauthorized: Invalid API key");
      if (!o.ok)
        throw new Error(`Unexpected response: ${o.status}`);
      return (yield o.json()).data;
    });
  }
  destroy() {
    this.isStopped = !0;
  }
}
class bu {
  constructor(n, o, s = 5, m = 1e3) {
    this.wsUrl = n, this.apiKey = o, this.maxRetries = s, this.initialBackoffMs = m, this.socket = null, this.flags = {}, this.context = null, this.isReady = !1, this.retries = 0;
  }
  init() {
    return Ue(this, null, function* () {
      return this.connectWithRetry();
    });
  }
  /**
   * Attempts to connect to the WebSocket server with retry logic.
   * If the connection fails, it will retry with exponential backoff.
   */
  connectWithRetry() {
    return new Promise((n, o) => {
      const s = () => {
        this.socket = new WebSocket(`${this.wsUrl}?apiKey=${this.apiKey}`), this.socket.onopen = () => {
          this.isReady = !0, this.retries = 0, this.context && this.sendContext(this.context), n();
        }, this.socket.onmessage = (m) => {
          var f;
          try {
            const g = JSON.parse(m.data);
            g.type === "flags" && (this.flags = g.flags, (f = this.onFlagsUpdatedCallback) == null || f.call(this, this.flags));
          } catch (g) {
            console.warn("Failed to parse WebSocket message:", g);
          }
        }, this.socket.onerror = (m) => {
          console.error("[WebSocketTransport] Error:", m);
        }, this.socket.onclose = (m) => {
          if (this.isReady = !1, m.code === 1008 || m.code === 4001)
            o(new Error("Unauthorized: Invalid API key"));
          else if (this.retries < this.maxRetries) {
            const f = this.initialBackoffMs * Math.pow(2, this.retries);
            console.warn(`[WebSocketTransport] Reconnecting in ${f}ms (attempt ${this.retries + 1})`), setTimeout(s, f), this.retries++;
          } else
            o(new Error(`WebSocket failed after ${this.retries} retries`));
        };
      };
      s();
    });
  }
  fetchFlags(n) {
    return Ue(this, null, function* () {
      var o;
      return this.context = n, this.isReady && ((o = this.socket) == null ? void 0 : o.readyState) === WebSocket.OPEN && this.sendContext(n), this.flags;
    });
  }
  onFlagsUpdated(n) {
    this.onFlagsUpdatedCallback = n;
  }
  destroy() {
    this.socket && this.socket.readyState === WebSocket.OPEN && this.socket.close(), this.socket = null, this.flags = {}, this.context = null, this.isReady = !1, this.onFlagsUpdatedCallback = void 0;
  }
  sendContext(n) {
    var s;
    const o = JSON.stringify({ type: "context", context: n });
    (s = this.socket) == null || s.send(o);
  }
}
function Mh(h, n) {
  if (h.type !== "rule")
    return !1;
  const o = h.attribute.split(".").reduce((s, m) => s == null ? void 0 : s[m], n);
  switch (h.operator) {
    case "eq":
      return o === h.value;
    case "neq":
      return o !== h.value;
    case "in":
      return Array.isArray(h.value) && h.value.includes(o);
    case "nin":
      return Array.isArray(h.value) && !h.value.includes(o);
    case "gt":
      return typeof o == "number" && typeof h.value == "number" && o > h.value;
    case "lt":
      return typeof o == "number" && typeof h.value == "number" && o < h.value;
    case "exists":
      return o != null;
    case "not_exists":
      return o == null;
    default:
      return !1;
  }
}
function yu(h, n) {
  return h.rules.every((o) => Mh(o, n));
}
var Ut = {};
const Li = typeof global != "undefined" ? global : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {};
function xh() {
  throw new Error("setTimeout has not been defined");
}
function _h() {
  throw new Error("clearTimeout has not been defined");
}
var Cr = xh, qr = _h;
typeof Li.setTimeout == "function" && (Cr = setTimeout);
typeof Li.clearTimeout == "function" && (qr = clearTimeout);
function Sh(h) {
  if (Cr === setTimeout)
    return setTimeout(h, 0);
  if ((Cr === xh || !Cr) && setTimeout)
    return Cr = setTimeout, setTimeout(h, 0);
  try {
    return Cr(h, 0);
  } catch (n) {
    try {
      return Cr.call(null, h, 0);
    } catch (o) {
      return Cr.call(this, h, 0);
    }
  }
}
function wu(h) {
  if (qr === clearTimeout)
    return clearTimeout(h);
  if ((qr === _h || !qr) && clearTimeout)
    return qr = clearTimeout, clearTimeout(h);
  try {
    return qr(h);
  } catch (n) {
    try {
      return qr.call(null, h);
    } catch (o) {
      return qr.call(this, h);
    }
  }
}
var Mr = [], hi = !1, Zr, pn = -1;
function Mu() {
  !hi || !Zr || (hi = !1, Zr.length ? Mr = Zr.concat(Mr) : pn = -1, Mr.length && Ah());
}
function Ah() {
  if (!hi) {
    var h = Sh(Mu);
    hi = !0;
    for (var n = Mr.length; n; ) {
      for (Zr = Mr, Mr = []; ++pn < n; )
        Zr && Zr[pn].run();
      pn = -1, n = Mr.length;
    }
    Zr = null, hi = !1, wu(h);
  }
}
function xu(h) {
  var n = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var o = 1; o < arguments.length; o++)
      n[o - 1] = arguments[o];
  Mr.push(new Bh(h, n)), Mr.length === 1 && !hi && Sh(Ah);
}
function Bh(h, n) {
  this.fun = h, this.array = n;
}
Bh.prototype.run = function() {
  this.fun.apply(null, this.array);
};
var _u = "browser", Su = "browser", Au = !0, Bu = {}, Eu = [], Iu = "", ku = {}, Ru = {}, Tu = {};
function Qr() {
}
var Cu = Qr, qu = Qr, Fu = Qr, Pu = Qr, Du = Qr, $u = Qr, Nu = Qr;
function Uu(h) {
  throw new Error("process.binding is not supported");
}
function Lu() {
  return "/";
}
function Ou(h) {
  throw new Error("process.chdir is not supported");
}
function zu() {
  return 0;
}
var fi = Li.performance || {}, Ku = fi.now || fi.mozNow || fi.msNow || fi.oNow || fi.webkitNow || function() {
  return (/* @__PURE__ */ new Date()).getTime();
};
function Hu(h) {
  var n = Ku.call(fi) * 1e-3, o = Math.floor(n), s = Math.floor(n % 1 * 1e9);
  return h && (o = o - h[0], s = s - h[1], s < 0 && (o--, s += 1e9)), [o, s];
}
var Zu = /* @__PURE__ */ new Date();
function Wu() {
  var h = /* @__PURE__ */ new Date(), n = h - Zu;
  return n / 1e3;
}
var ye = {
  nextTick: xu,
  title: _u,
  browser: Au,
  env: Bu,
  argv: Eu,
  version: Iu,
  versions: ku,
  on: Cu,
  addListener: qu,
  once: Fu,
  off: Pu,
  removeListener: Du,
  removeAllListeners: $u,
  emit: Nu,
  binding: Uu,
  cwd: Lu,
  chdir: Ou,
  umask: zu,
  hrtime: Hu,
  platform: Su,
  release: Ru,
  config: Tu,
  uptime: Wu
}, Xf = { exports: {} }, jf = { exports: {} };
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(h, n) {
  var o = gr, s = o.Buffer;
  function m(g, y) {
    for (var S in g)
      y[S] = g[S];
  }
  s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? h.exports = o : (m(o, n), n.Buffer = f);
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
})(jf, jf.exports);
var Ot = jf.exports, df = 65536, Vu = 4294967295;
function Yu() {
  throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`);
}
var Ju = Ot.Buffer, wn = Gt.crypto || Gt.msCrypto;
wn && wn.getRandomValues ? Xf.exports = Gu : Xf.exports = Yu;
function Gu(h, n) {
  if (h > Vu)
    throw new RangeError("requested too many random bytes");
  var o = Ju.allocUnsafe(h);
  if (h > 0)
    if (h > df)
      for (var s = 0; s < h; s += df)
        wn.getRandomValues(o.slice(s, s + df));
    else
      wn.getRandomValues(o);
  return typeof n == "function" ? ye.nextTick(function() {
    n(null, o);
  }) : o;
}
var gi = Xf.exports, Qf = { exports: {} };
typeof Object.create == "function" ? Qf.exports = function(n, o) {
  o && (n.super_ = o, n.prototype = Object.create(o.prototype, {
    constructor: {
      value: n,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : Qf.exports = function(n, o) {
  if (o) {
    n.super_ = o;
    var s = function() {
    };
    s.prototype = o.prototype, n.prototype = new s(), n.prototype.constructor = n;
  }
};
var Jt = Qf.exports;
const Xu = {}, ju = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Xu
}, Symbol.toStringTag, { value: "Module" })), Pe = /* @__PURE__ */ su(ju);
var fr = Ot.Buffer, Eh = Pe.Transform, Qu = Jt;
function $r(h) {
  Eh.call(this), this._block = fr.allocUnsafe(h), this._blockSize = h, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
}
Qu($r, Eh);
$r.prototype._transform = function(h, n, o) {
  var s = null;
  try {
    this.update(h, n);
  } catch (m) {
    s = m;
  }
  o(s);
};
$r.prototype._flush = function(h) {
  var n = null;
  try {
    this.push(this.digest());
  } catch (o) {
    n = o;
  }
  h(n);
};
var tl = typeof Uint8Array != "undefined", el = typeof ArrayBuffer != "undefined" && typeof Uint8Array != "undefined" && ArrayBuffer.isView && (fr.prototype instanceof Uint8Array || fr.TYPED_ARRAY_SUPPORT);
function rl(h, n) {
  if (h instanceof fr)
    return h;
  if (typeof h == "string")
    return fr.from(h, n);
  if (el && ArrayBuffer.isView(h)) {
    if (h.byteLength === 0)
      return fr.alloc(0);
    var o = fr.from(h.buffer, h.byteOffset, h.byteLength);
    if (o.byteLength === h.byteLength)
      return o;
  }
  if (tl && h instanceof Uint8Array || fr.isBuffer(h) && h.constructor && typeof h.constructor.isBuffer == "function" && h.constructor.isBuffer(h))
    return fr.from(h);
  throw new TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.');
}
$r.prototype.update = function(h, n) {
  if (this._finalized)
    throw new Error("Digest already called");
  h = rl(h, n);
  for (var o = this._block, s = 0; this._blockOffset + h.length - s >= this._blockSize; ) {
    for (var m = this._blockOffset; m < this._blockSize; )
      o[m++] = h[s++];
    this._update(), this._blockOffset = 0;
  }
  for (; s < h.length; )
    o[this._blockOffset++] = h[s++];
  for (var f = 0, g = h.length * 8; g > 0; ++f)
    this._length[f] += g, g = this._length[f] / 4294967296 | 0, g > 0 && (this._length[f] -= 4294967296 * g);
  return this;
};
$r.prototype._update = function() {
  throw new Error("_update is not implemented");
};
$r.prototype.digest = function(h) {
  if (this._finalized)
    throw new Error("Digest already called");
  this._finalized = !0;
  var n = this._digest();
  h !== void 0 && (n = n.toString(h)), this._block.fill(0), this._blockOffset = 0;
  for (var o = 0; o < 4; ++o)
    this._length[o] = 0;
  return n;
};
$r.prototype._digest = function() {
  throw new Error("_digest is not implemented");
};
var Ih = $r, il = Jt, kh = Ih, nl = Ot.Buffer, fl = new Array(16);
function Rn() {
  kh.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
}
il(Rn, kh);
Rn.prototype._update = function() {
  for (var h = fl, n = 0; n < 16; ++n)
    h[n] = this._block.readInt32LE(n * 4);
  var o = this._a, s = this._b, m = this._c, f = this._d;
  o = Ie(o, s, m, f, h[0], 3614090360, 7), f = Ie(f, o, s, m, h[1], 3905402710, 12), m = Ie(m, f, o, s, h[2], 606105819, 17), s = Ie(s, m, f, o, h[3], 3250441966, 22), o = Ie(o, s, m, f, h[4], 4118548399, 7), f = Ie(f, o, s, m, h[5], 1200080426, 12), m = Ie(m, f, o, s, h[6], 2821735955, 17), s = Ie(s, m, f, o, h[7], 4249261313, 22), o = Ie(o, s, m, f, h[8], 1770035416, 7), f = Ie(f, o, s, m, h[9], 2336552879, 12), m = Ie(m, f, o, s, h[10], 4294925233, 17), s = Ie(s, m, f, o, h[11], 2304563134, 22), o = Ie(o, s, m, f, h[12], 1804603682, 7), f = Ie(f, o, s, m, h[13], 4254626195, 12), m = Ie(m, f, o, s, h[14], 2792965006, 17), s = Ie(s, m, f, o, h[15], 1236535329, 22), o = ke(o, s, m, f, h[1], 4129170786, 5), f = ke(f, o, s, m, h[6], 3225465664, 9), m = ke(m, f, o, s, h[11], 643717713, 14), s = ke(s, m, f, o, h[0], 3921069994, 20), o = ke(o, s, m, f, h[5], 3593408605, 5), f = ke(f, o, s, m, h[10], 38016083, 9), m = ke(m, f, o, s, h[15], 3634488961, 14), s = ke(s, m, f, o, h[4], 3889429448, 20), o = ke(o, s, m, f, h[9], 568446438, 5), f = ke(f, o, s, m, h[14], 3275163606, 9), m = ke(m, f, o, s, h[3], 4107603335, 14), s = ke(s, m, f, o, h[8], 1163531501, 20), o = ke(o, s, m, f, h[13], 2850285829, 5), f = ke(f, o, s, m, h[2], 4243563512, 9), m = ke(m, f, o, s, h[7], 1735328473, 14), s = ke(s, m, f, o, h[12], 2368359562, 20), o = Re(o, s, m, f, h[5], 4294588738, 4), f = Re(f, o, s, m, h[8], 2272392833, 11), m = Re(m, f, o, s, h[11], 1839030562, 16), s = Re(s, m, f, o, h[14], 4259657740, 23), o = Re(o, s, m, f, h[1], 2763975236, 4), f = Re(f, o, s, m, h[4], 1272893353, 11), m = Re(m, f, o, s, h[7], 4139469664, 16), s = Re(s, m, f, o, h[10], 3200236656, 23), o = Re(o, s, m, f, h[13], 681279174, 4), f = Re(f, o, s, m, h[0], 3936430074, 11), m = Re(m, f, o, s, h[3], 3572445317, 16), s = Re(s, m, f, o, h[6], 76029189, 23), o = Re(o, s, m, f, h[9], 3654602809, 4), f = Re(f, o, s, m, h[12], 3873151461, 11), m = Re(m, f, o, s, h[15], 530742520, 16), s = Re(s, m, f, o, h[2], 3299628645, 23), o = Te(o, s, m, f, h[0], 4096336452, 6), f = Te(f, o, s, m, h[7], 1126891415, 10), m = Te(m, f, o, s, h[14], 2878612391, 15), s = Te(s, m, f, o, h[5], 4237533241, 21), o = Te(o, s, m, f, h[12], 1700485571, 6), f = Te(f, o, s, m, h[3], 2399980690, 10), m = Te(m, f, o, s, h[10], 4293915773, 15), s = Te(s, m, f, o, h[1], 2240044497, 21), o = Te(o, s, m, f, h[8], 1873313359, 6), f = Te(f, o, s, m, h[15], 4264355552, 10), m = Te(m, f, o, s, h[6], 2734768916, 15), s = Te(s, m, f, o, h[13], 1309151649, 21), o = Te(o, s, m, f, h[4], 4149444226, 6), f = Te(f, o, s, m, h[11], 3174756917, 10), m = Te(m, f, o, s, h[2], 718787259, 15), s = Te(s, m, f, o, h[9], 3951481745, 21), this._a = this._a + o | 0, this._b = this._b + s | 0, this._c = this._c + m | 0, this._d = this._d + f | 0;
};
Rn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var h = nl.allocUnsafe(16);
  return h.writeInt32LE(this._a, 0), h.writeInt32LE(this._b, 4), h.writeInt32LE(this._c, 8), h.writeInt32LE(this._d, 12), h;
};
function Tn(h, n) {
  return h << n | h >>> 32 - n;
}
function Ie(h, n, o, s, m, f, g) {
  return Tn(h + (n & o | ~n & s) + m + f | 0, g) + n | 0;
}
function ke(h, n, o, s, m, f, g) {
  return Tn(h + (n & s | o & ~s) + m + f | 0, g) + n | 0;
}
function Re(h, n, o, s, m, f, g) {
  return Tn(h + (n ^ o ^ s) + m + f | 0, g) + n | 0;
}
function Te(h, n, o, s, m, f, g) {
  return Tn(h + (o ^ (n | ~s)) + m + f | 0, g) + n | 0;
}
var b0 = Rn, cf = gr.Buffer, al = Jt, Rh = Ih, hl = new Array(16), Bi = [
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
], Ei = [
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
], Ii = [
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
], ki = [
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
], Ri = [0, 1518500249, 1859775393, 2400959708, 2840853838], Ti = [1352829926, 1548603684, 1836072691, 2053994217, 0];
function Cn() {
  Rh.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
}
al(Cn, Rh);
Cn.prototype._update = function() {
  for (var h = hl, n = 0; n < 16; ++n)
    h[n] = this._block.readInt32LE(n * 4);
  for (var o = this._a | 0, s = this._b | 0, m = this._c | 0, f = this._d | 0, g = this._e | 0, y = this._a | 0, S = this._b | 0, B = this._c | 0, M = this._d | 0, x = this._e | 0, k = 0; k < 80; k += 1) {
    var I, D;
    k < 16 ? (I = ta(o, s, m, f, g, h[Bi[k]], Ri[0], Ii[k]), D = na(y, S, B, M, x, h[Ei[k]], Ti[0], ki[k])) : k < 32 ? (I = ea(o, s, m, f, g, h[Bi[k]], Ri[1], Ii[k]), D = ia(y, S, B, M, x, h[Ei[k]], Ti[1], ki[k])) : k < 48 ? (I = ra(o, s, m, f, g, h[Bi[k]], Ri[2], Ii[k]), D = ra(y, S, B, M, x, h[Ei[k]], Ti[2], ki[k])) : k < 64 ? (I = ia(o, s, m, f, g, h[Bi[k]], Ri[3], Ii[k]), D = ea(y, S, B, M, x, h[Ei[k]], Ti[3], ki[k])) : (I = na(o, s, m, f, g, h[Bi[k]], Ri[4], Ii[k]), D = ta(y, S, B, M, x, h[Ei[k]], Ti[4], ki[k])), o = g, g = f, f = Gr(m, 10), m = s, s = I, y = x, x = M, M = Gr(B, 10), B = S, S = D;
  }
  var L = this._b + m + M | 0;
  this._b = this._c + f + x | 0, this._c = this._d + g + y | 0, this._d = this._e + o + S | 0, this._e = this._a + s + B | 0, this._a = L;
};
Cn.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var h = cf.alloc ? cf.alloc(20) : new cf(20);
  return h.writeInt32LE(this._a, 0), h.writeInt32LE(this._b, 4), h.writeInt32LE(this._c, 8), h.writeInt32LE(this._d, 12), h.writeInt32LE(this._e, 16), h;
};
function Gr(h, n) {
  return h << n | h >>> 32 - n;
}
function ta(h, n, o, s, m, f, g, y) {
  return Gr(h + (n ^ o ^ s) + f + g | 0, y) + m | 0;
}
function ea(h, n, o, s, m, f, g, y) {
  return Gr(h + (n & o | ~n & s) + f + g | 0, y) + m | 0;
}
function ra(h, n, o, s, m, f, g, y) {
  return Gr(h + ((n | ~o) ^ s) + f + g | 0, y) + m | 0;
}
function ia(h, n, o, s, m, f, g, y) {
  return Gr(h + (n & s | o & ~s) + f + g | 0, y) + m | 0;
}
function na(h, n, o, s, m, f, g, y) {
  return Gr(h + (n ^ (o | ~s)) + f + g | 0, y) + m | 0;
}
var y0 = Cn, Th = { exports: {} }, Ch = Ot.Buffer;
function qn(h, n) {
  this._block = Ch.alloc(h), this._finalSize = n, this._blockSize = h, this._len = 0;
}
qn.prototype.update = function(h, n) {
  typeof h == "string" && (n = n || "utf8", h = Ch.from(h, n));
  for (var o = this._block, s = this._blockSize, m = h.length, f = this._len, g = 0; g < m; ) {
    for (var y = f % s, S = Math.min(m - g, s - y), B = 0; B < S; B++)
      o[y + B] = h[g + B];
    f += S, g += S, f % s === 0 && this._update(o);
  }
  return this._len += m, this;
};
qn.prototype.digest = function(h) {
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
  return h ? f.toString(h) : f;
};
qn.prototype._update = function() {
  throw new Error("_update must be implemented by subclass");
};
var bi = qn, sl = Jt, qh = bi, ol = Ot.Buffer, ul = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], ll = new Array(80);
function Zi() {
  this.init(), this._w = ll, qh.call(this, 64, 56);
}
sl(Zi, qh);
Zi.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function dl(h) {
  return h << 5 | h >>> 27;
}
function cl(h) {
  return h << 30 | h >>> 2;
}
function vl(h, n, o, s) {
  return h === 0 ? n & o | ~n & s : h === 2 ? n & o | n & s | o & s : n ^ o ^ s;
}
Zi.prototype._update = function(h) {
  for (var n = this._w, o = this._a | 0, s = this._b | 0, m = this._c | 0, f = this._d | 0, g = this._e | 0, y = 0; y < 16; ++y)
    n[y] = h.readInt32BE(y * 4);
  for (; y < 80; ++y)
    n[y] = n[y - 3] ^ n[y - 8] ^ n[y - 14] ^ n[y - 16];
  for (var S = 0; S < 80; ++S) {
    var B = ~~(S / 20), M = dl(o) + vl(B, s, m, f) + g + n[S] + ul[B] | 0;
    g = f, f = m, m = cl(s), s = o, o = M;
  }
  this._a = o + this._a | 0, this._b = s + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = g + this._e | 0;
};
Zi.prototype._hash = function() {
  var h = ol.allocUnsafe(20);
  return h.writeInt32BE(this._a | 0, 0), h.writeInt32BE(this._b | 0, 4), h.writeInt32BE(this._c | 0, 8), h.writeInt32BE(this._d | 0, 12), h.writeInt32BE(this._e | 0, 16), h;
};
var pl = Zi, ml = Jt, Fh = bi, gl = Ot.Buffer, bl = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], yl = new Array(80);
function Wi() {
  this.init(), this._w = yl, Fh.call(this, 64, 56);
}
ml(Wi, Fh);
Wi.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function wl(h) {
  return h << 1 | h >>> 31;
}
function Ml(h) {
  return h << 5 | h >>> 27;
}
function xl(h) {
  return h << 30 | h >>> 2;
}
function _l(h, n, o, s) {
  return h === 0 ? n & o | ~n & s : h === 2 ? n & o | n & s | o & s : n ^ o ^ s;
}
Wi.prototype._update = function(h) {
  for (var n = this._w, o = this._a | 0, s = this._b | 0, m = this._c | 0, f = this._d | 0, g = this._e | 0, y = 0; y < 16; ++y)
    n[y] = h.readInt32BE(y * 4);
  for (; y < 80; ++y)
    n[y] = wl(n[y - 3] ^ n[y - 8] ^ n[y - 14] ^ n[y - 16]);
  for (var S = 0; S < 80; ++S) {
    var B = ~~(S / 20), M = Ml(o) + _l(B, s, m, f) + g + n[S] + bl[B] | 0;
    g = f, f = m, m = xl(s), s = o, o = M;
  }
  this._a = o + this._a | 0, this._b = s + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = g + this._e | 0;
};
Wi.prototype._hash = function() {
  var h = gl.allocUnsafe(20);
  return h.writeInt32BE(this._a | 0, 0), h.writeInt32BE(this._b | 0, 4), h.writeInt32BE(this._c | 0, 8), h.writeInt32BE(this._d | 0, 12), h.writeInt32BE(this._e | 0, 16), h;
};
var Sl = Wi, Al = Jt, Ph = bi, Bl = Ot.Buffer, El = [
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
], Il = new Array(64);
function Vi() {
  this.init(), this._w = Il, Ph.call(this, 64, 56);
}
Al(Vi, Ph);
Vi.prototype.init = function() {
  return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
};
function kl(h, n, o) {
  return o ^ h & (n ^ o);
}
function Rl(h, n, o) {
  return h & n | o & (h | n);
}
function Tl(h) {
  return (h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10);
}
function Cl(h) {
  return (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
}
function ql(h) {
  return (h >>> 7 | h << 25) ^ (h >>> 18 | h << 14) ^ h >>> 3;
}
function Fl(h) {
  return (h >>> 17 | h << 15) ^ (h >>> 19 | h << 13) ^ h >>> 10;
}
Vi.prototype._update = function(h) {
  for (var n = this._w, o = this._a | 0, s = this._b | 0, m = this._c | 0, f = this._d | 0, g = this._e | 0, y = this._f | 0, S = this._g | 0, B = this._h | 0, M = 0; M < 16; ++M)
    n[M] = h.readInt32BE(M * 4);
  for (; M < 64; ++M)
    n[M] = Fl(n[M - 2]) + n[M - 7] + ql(n[M - 15]) + n[M - 16] | 0;
  for (var x = 0; x < 64; ++x) {
    var k = B + Cl(g) + kl(g, y, S) + El[x] + n[x] | 0, I = Tl(o) + Rl(o, s, m) | 0;
    B = S, S = y, y = g, g = f + k | 0, f = m, m = s, s = o, o = k + I | 0;
  }
  this._a = o + this._a | 0, this._b = s + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = g + this._e | 0, this._f = y + this._f | 0, this._g = S + this._g | 0, this._h = B + this._h | 0;
};
Vi.prototype._hash = function() {
  var h = Bl.allocUnsafe(32);
  return h.writeInt32BE(this._a, 0), h.writeInt32BE(this._b, 4), h.writeInt32BE(this._c, 8), h.writeInt32BE(this._d, 12), h.writeInt32BE(this._e, 16), h.writeInt32BE(this._f, 20), h.writeInt32BE(this._g, 24), h.writeInt32BE(this._h, 28), h;
};
var Dh = Vi, Pl = Jt, Dl = Dh, $l = bi, Nl = Ot.Buffer, Ul = new Array(64);
function Fn() {
  this.init(), this._w = Ul, $l.call(this, 64, 56);
}
Pl(Fn, Dl);
Fn.prototype.init = function() {
  return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
};
Fn.prototype._hash = function() {
  var h = Nl.allocUnsafe(28);
  return h.writeInt32BE(this._a, 0), h.writeInt32BE(this._b, 4), h.writeInt32BE(this._c, 8), h.writeInt32BE(this._d, 12), h.writeInt32BE(this._e, 16), h.writeInt32BE(this._f, 20), h.writeInt32BE(this._g, 24), h;
};
var Ll = Fn, Ol = Jt, $h = bi, zl = Ot.Buffer, fa = [
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
], Kl = new Array(160);
function Yi() {
  this.init(), this._w = Kl, $h.call(this, 128, 112);
}
Ol(Yi, $h);
Yi.prototype.init = function() {
  return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
};
function aa(h, n, o) {
  return o ^ h & (n ^ o);
}
function ha(h, n, o) {
  return h & n | o & (h | n);
}
function sa(h, n) {
  return (h >>> 28 | n << 4) ^ (n >>> 2 | h << 30) ^ (n >>> 7 | h << 25);
}
function oa(h, n) {
  return (h >>> 14 | n << 18) ^ (h >>> 18 | n << 14) ^ (n >>> 9 | h << 23);
}
function Hl(h, n) {
  return (h >>> 1 | n << 31) ^ (h >>> 8 | n << 24) ^ h >>> 7;
}
function Zl(h, n) {
  return (h >>> 1 | n << 31) ^ (h >>> 8 | n << 24) ^ (h >>> 7 | n << 25);
}
function Wl(h, n) {
  return (h >>> 19 | n << 13) ^ (n >>> 29 | h << 3) ^ h >>> 6;
}
function Vl(h, n) {
  return (h >>> 19 | n << 13) ^ (n >>> 29 | h << 3) ^ (h >>> 6 | n << 26);
}
function xe(h, n) {
  return h >>> 0 < n >>> 0 ? 1 : 0;
}
Yi.prototype._update = function(h) {
  for (var n = this._w, o = this._ah | 0, s = this._bh | 0, m = this._ch | 0, f = this._dh | 0, g = this._eh | 0, y = this._fh | 0, S = this._gh | 0, B = this._hh | 0, M = this._al | 0, x = this._bl | 0, k = this._cl | 0, I = this._dl | 0, D = this._el | 0, L = this._fl | 0, W = this._gl | 0, z = this._hl | 0, N = 0; N < 32; N += 2)
    n[N] = h.readInt32BE(N * 4), n[N + 1] = h.readInt32BE(N * 4 + 4);
  for (; N < 160; N += 2) {
    var lt = n[N - 30], H = n[N - 15 * 2 + 1], At = Hl(lt, H), Bt = Zl(H, lt);
    lt = n[N - 2 * 2], H = n[N - 2 * 2 + 1];
    var Ct = Wl(lt, H), Et = Vl(H, lt), Y = n[N - 7 * 2], kt = n[N - 7 * 2 + 1], p = n[N - 16 * 2], t = n[N - 16 * 2 + 1], r = Bt + kt | 0, i = At + Y + xe(r, Bt) | 0;
    r = r + Et | 0, i = i + Ct + xe(r, Et) | 0, r = r + t | 0, i = i + p + xe(r, t) | 0, n[N] = i, n[N + 1] = r;
  }
  for (var a = 0; a < 160; a += 2) {
    i = n[a], r = n[a + 1];
    var d = ha(o, s, m), c = ha(M, x, k), v = sa(o, M), u = sa(M, o), e = oa(g, D), l = oa(D, g), b = fa[a], _ = fa[a + 1], C = aa(g, y, S), F = aa(D, L, W), O = z + l | 0, R = B + e + xe(O, z) | 0;
    O = O + F | 0, R = R + C + xe(O, F) | 0, O = O + _ | 0, R = R + b + xe(O, _) | 0, O = O + r | 0, R = R + i + xe(O, r) | 0;
    var P = u + c | 0, $ = v + d + xe(P, u) | 0;
    B = S, z = W, S = y, W = L, y = g, L = D, D = I + O | 0, g = f + R + xe(D, I) | 0, f = m, I = k, m = s, k = x, s = o, x = M, M = O + P | 0, o = R + $ + xe(M, O) | 0;
  }
  this._al = this._al + M | 0, this._bl = this._bl + x | 0, this._cl = this._cl + k | 0, this._dl = this._dl + I | 0, this._el = this._el + D | 0, this._fl = this._fl + L | 0, this._gl = this._gl + W | 0, this._hl = this._hl + z | 0, this._ah = this._ah + o + xe(this._al, M) | 0, this._bh = this._bh + s + xe(this._bl, x) | 0, this._ch = this._ch + m + xe(this._cl, k) | 0, this._dh = this._dh + f + xe(this._dl, I) | 0, this._eh = this._eh + g + xe(this._el, D) | 0, this._fh = this._fh + y + xe(this._fl, L) | 0, this._gh = this._gh + S + xe(this._gl, W) | 0, this._hh = this._hh + B + xe(this._hl, z) | 0;
};
Yi.prototype._hash = function() {
  var h = zl.allocUnsafe(64);
  function n(o, s, m) {
    h.writeInt32BE(o, m), h.writeInt32BE(s, m + 4);
  }
  return n(this._ah, this._al, 0), n(this._bh, this._bl, 8), n(this._ch, this._cl, 16), n(this._dh, this._dl, 24), n(this._eh, this._el, 32), n(this._fh, this._fl, 40), n(this._gh, this._gl, 48), n(this._hh, this._hl, 56), h;
};
var Nh = Yi, Yl = Jt, Jl = Nh, Gl = bi, Xl = Ot.Buffer, jl = new Array(160);
function Pn() {
  this.init(), this._w = jl, Gl.call(this, 128, 112);
}
Yl(Pn, Jl);
Pn.prototype.init = function() {
  return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
};
Pn.prototype._hash = function() {
  var h = Xl.allocUnsafe(48);
  function n(o, s, m) {
    h.writeInt32BE(o, m), h.writeInt32BE(s, m + 4);
  }
  return n(this._ah, this._al, 0), n(this._bh, this._bl, 8), n(this._ch, this._cl, 16), n(this._dh, this._dl, 24), n(this._eh, this._el, 32), n(this._fh, this._fl, 40), h;
};
var Ql = Pn, ti = Th.exports = function(n) {
  n = n.toLowerCase();
  var o = ti[n];
  if (!o)
    throw new Error(n + " is not supported (we accept pull requests)");
  return new o();
};
ti.sha = pl;
ti.sha1 = Sl;
ti.sha224 = Ll;
ti.sha256 = Dh;
ti.sha384 = Ql;
ti.sha512 = Nh;
var w0 = Th.exports, Mn = {}, t0 = { exports: {} };
(function(h, n) {
  var o = gr, s = o.Buffer;
  function m(g, y) {
    for (var S in g)
      y[S] = g[S];
  }
  s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? h.exports = o : (m(o, n), n.Buffer = f);
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
})(t0, t0.exports);
var td = t0.exports, M0 = td.Buffer, ua = M0.isEncoding || function(h) {
  switch (h = "" + h, h && h.toLowerCase()) {
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
function ed(h) {
  if (!h)
    return "utf8";
  for (var n; ; )
    switch (h) {
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
        return h;
      default:
        if (n)
          return;
        h = ("" + h).toLowerCase(), n = !0;
    }
}
function rd(h) {
  var n = ed(h);
  if (typeof n != "string" && (M0.isEncoding === ua || !ua(h)))
    throw new Error("Unknown encoding: " + h);
  return n || h;
}
Mn.StringDecoder = Ji;
function Ji(h) {
  this.encoding = rd(h);
  var n;
  switch (this.encoding) {
    case "utf16le":
      this.text = sd, this.end = od, n = 4;
      break;
    case "utf8":
      this.fillLast = fd, n = 4;
      break;
    case "base64":
      this.text = ud, this.end = ld, n = 3;
      break;
    default:
      this.write = dd, this.end = cd;
      return;
  }
  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = M0.allocUnsafe(n);
}
Ji.prototype.write = function(h) {
  if (h.length === 0)
    return "";
  var n, o;
  if (this.lastNeed) {
    if (n = this.fillLast(h), n === void 0)
      return "";
    o = this.lastNeed, this.lastNeed = 0;
  } else
    o = 0;
  return o < h.length ? n ? n + this.text(h, o) : this.text(h, o) : n || "";
};
Ji.prototype.end = hd;
Ji.prototype.text = ad;
Ji.prototype.fillLast = function(h) {
  if (this.lastNeed <= h.length)
    return h.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  h.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, h.length), this.lastNeed -= h.length;
};
function vf(h) {
  return h <= 127 ? 0 : h >> 5 === 6 ? 2 : h >> 4 === 14 ? 3 : h >> 3 === 30 ? 4 : h >> 6 === 2 ? -1 : -2;
}
function id(h, n, o) {
  var s = n.length - 1;
  if (s < o)
    return 0;
  var m = vf(n[s]);
  return m >= 0 ? (m > 0 && (h.lastNeed = m - 1), m) : --s < o || m === -2 ? 0 : (m = vf(n[s]), m >= 0 ? (m > 0 && (h.lastNeed = m - 2), m) : --s < o || m === -2 ? 0 : (m = vf(n[s]), m >= 0 ? (m > 0 && (m === 2 ? m = 0 : h.lastNeed = m - 3), m) : 0));
}
function nd(h, n, o) {
  if ((n[0] & 192) !== 128)
    return h.lastNeed = 0, "�";
  if (h.lastNeed > 1 && n.length > 1) {
    if ((n[1] & 192) !== 128)
      return h.lastNeed = 1, "�";
    if (h.lastNeed > 2 && n.length > 2 && (n[2] & 192) !== 128)
      return h.lastNeed = 2, "�";
  }
}
function fd(h) {
  var n = this.lastTotal - this.lastNeed, o = nd(this, h);
  if (o !== void 0)
    return o;
  if (this.lastNeed <= h.length)
    return h.copy(this.lastChar, n, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  h.copy(this.lastChar, n, 0, h.length), this.lastNeed -= h.length;
}
function ad(h, n) {
  var o = id(this, h, n);
  if (!this.lastNeed)
    return h.toString("utf8", n);
  this.lastTotal = o;
  var s = h.length - (o - this.lastNeed);
  return h.copy(this.lastChar, 0, s), h.toString("utf8", n, s);
}
function hd(h) {
  var n = h && h.length ? this.write(h) : "";
  return this.lastNeed ? n + "�" : n;
}
function sd(h, n) {
  if ((h.length - n) % 2 === 0) {
    var o = h.toString("utf16le", n);
    if (o) {
      var s = o.charCodeAt(o.length - 1);
      if (s >= 55296 && s <= 56319)
        return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = h[h.length - 2], this.lastChar[1] = h[h.length - 1], o.slice(0, -1);
    }
    return o;
  }
  return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = h[h.length - 1], h.toString("utf16le", n, h.length - 1);
}
function od(h) {
  var n = h && h.length ? this.write(h) : "";
  if (this.lastNeed) {
    var o = this.lastTotal - this.lastNeed;
    return n + this.lastChar.toString("utf16le", 0, o);
  }
  return n;
}
function ud(h, n) {
  var o = (h.length - n) % 3;
  return o === 0 ? h.toString("base64", n) : (this.lastNeed = 3 - o, this.lastTotal = 3, o === 1 ? this.lastChar[0] = h[h.length - 1] : (this.lastChar[0] = h[h.length - 2], this.lastChar[1] = h[h.length - 1]), h.toString("base64", n, h.length - o));
}
function ld(h) {
  var n = h && h.length ? this.write(h) : "";
  return this.lastNeed ? n + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : n;
}
function dd(h) {
  return h.toString(this.encoding);
}
function cd(h) {
  return h && h.length ? this.write(h) : "";
}
var ar = Ot.Buffer, Uh = Pe.Transform, vd = Mn.StringDecoder, pd = Jt;
function er(h) {
  Uh.call(this), this.hashMode = typeof h == "string", this.hashMode ? this[h] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
}
pd(er, Uh);
var md = typeof Uint8Array != "undefined", gd = typeof ArrayBuffer != "undefined" && typeof Uint8Array != "undefined" && ArrayBuffer.isView && (ar.prototype instanceof Uint8Array || ar.TYPED_ARRAY_SUPPORT);
function bd(h, n) {
  if (h instanceof ar)
    return h;
  if (typeof h == "string")
    return ar.from(h, n);
  if (gd && ArrayBuffer.isView(h)) {
    if (h.byteLength === 0)
      return ar.alloc(0);
    var o = ar.from(h.buffer, h.byteOffset, h.byteLength);
    if (o.byteLength === h.byteLength)
      return o;
  }
  if (md && h instanceof Uint8Array || ar.isBuffer(h) && h.constructor && typeof h.constructor.isBuffer == "function" && h.constructor.isBuffer(h))
    return ar.from(h);
  throw new TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.');
}
er.prototype.update = function(h, n, o) {
  var s = bd(h, n), m = this._update(s);
  return this.hashMode ? this : (o && (m = this._toString(m, o)), m);
};
er.prototype.setAutoPadding = function() {
};
er.prototype.getAuthTag = function() {
  throw new Error("trying to get auth tag in unsupported state");
};
er.prototype.setAuthTag = function() {
  throw new Error("trying to set auth tag in unsupported state");
};
er.prototype.setAAD = function() {
  throw new Error("trying to set aad in unsupported state");
};
er.prototype._transform = function(h, n, o) {
  var s;
  try {
    this.hashMode ? this._update(h) : this.push(this._update(h));
  } catch (m) {
    s = m;
  } finally {
    o(s);
  }
};
er.prototype._flush = function(h) {
  var n;
  try {
    this.push(this.__final());
  } catch (o) {
    n = o;
  }
  h(n);
};
er.prototype._finalOrDigest = function(h) {
  var n = this.__final() || ar.alloc(0);
  return h && (n = this._toString(n, h, !0)), n;
};
er.prototype._toString = function(h, n, o) {
  if (this._decoder || (this._decoder = new vd(n), this._encoding = n), this._encoding !== n)
    throw new Error("can’t switch encodings");
  var s = this._decoder.write(h);
  return o && (s += this._decoder.end()), s;
};
var Nr = er, yd = Jt, wd = b0, Md = y0, xd = w0, Lh = Nr;
function Dn(h) {
  Lh.call(this, "digest"), this._hash = h;
}
yd(Dn, Lh);
Dn.prototype._update = function(h) {
  this._hash.update(h);
};
Dn.prototype._final = function() {
  return this._hash.digest();
};
var Gi = function(n) {
  return n = n.toLowerCase(), n === "md5" ? new wd() : n === "rmd160" || n === "ripemd160" ? new Md() : new Dn(xd(n));
}, _d = Jt, Wr = Ot.Buffer, Oh = Nr, Sd = Wr.alloc(128), ni = 64;
function $n(h, n) {
  Oh.call(this, "digest"), typeof n == "string" && (n = Wr.from(n)), this._alg = h, this._key = n, n.length > ni ? n = h(n) : n.length < ni && (n = Wr.concat([n, Sd], ni));
  for (var o = this._ipad = Wr.allocUnsafe(ni), s = this._opad = Wr.allocUnsafe(ni), m = 0; m < ni; m++)
    o[m] = n[m] ^ 54, s[m] = n[m] ^ 92;
  this._hash = [o];
}
_d($n, Oh);
$n.prototype._update = function(h) {
  this._hash.push(h);
};
$n.prototype._final = function() {
  var h = this._alg(Wr.concat(this._hash));
  return this._alg(Wr.concat([this._opad, h]));
};
var Ad = $n, Bd = b0, zh = function(h) {
  return new Bd().update(h).digest();
}, Ed = Jt, Id = Ad, Kh = Nr, Pi = Ot.Buffer, kd = zh, e0 = y0, r0 = w0, Rd = Pi.alloc(128);
function Oi(h, n) {
  Kh.call(this, "digest"), typeof n == "string" && (n = Pi.from(n));
  var o = h === "sha512" || h === "sha384" ? 128 : 64;
  if (this._alg = h, this._key = n, n.length > o) {
    var s = h === "rmd160" ? new e0() : r0(h);
    n = s.update(n).digest();
  } else
    n.length < o && (n = Pi.concat([n, Rd], o));
  for (var m = this._ipad = Pi.allocUnsafe(o), f = this._opad = Pi.allocUnsafe(o), g = 0; g < o; g++)
    m[g] = n[g] ^ 54, f[g] = n[g] ^ 92;
  this._hash = h === "rmd160" ? new e0() : r0(h), this._hash.update(m);
}
Ed(Oi, Kh);
Oi.prototype._update = function(h) {
  this._hash.update(h);
};
Oi.prototype._final = function() {
  var h = this._hash.digest(), n = this._alg === "rmd160" ? new e0() : r0(this._alg);
  return n.update(this._opad).update(h).digest();
};
var Hh = function(n, o) {
  return n = n.toLowerCase(), n === "rmd160" || n === "ripemd160" ? new Oi("rmd160", o) : n === "md5" ? new Id(kd, o) : new Oi(n, o);
};
const Td = {
  sign: "rsa",
  hash: "sha224",
  id: "302d300d06096086480165030402040500041c"
}, Cd = {
  sign: "rsa",
  hash: "sha256",
  id: "3031300d060960864801650304020105000420"
}, qd = {
  sign: "rsa",
  hash: "sha384",
  id: "3041300d060960864801650304020205000430"
}, Fd = {
  sign: "rsa",
  hash: "sha512",
  id: "3051300d060960864801650304020305000440"
}, Pd = {
  sign: "ecdsa",
  hash: "sha256",
  id: ""
}, Dd = {
  sign: "ecdsa",
  hash: "sha224",
  id: ""
}, $d = {
  sign: "ecdsa",
  hash: "sha384",
  id: ""
}, Nd = {
  sign: "ecdsa",
  hash: "sha512",
  id: ""
}, Ud = {
  sign: "dsa",
  hash: "sha1",
  id: ""
}, Ld = {
  sign: "rsa",
  hash: "rmd160",
  id: "3021300906052b2403020105000414"
}, Od = {
  sign: "rsa",
  hash: "md5",
  id: "3020300c06082a864886f70d020505000410"
}, Zh = {
  sha224WithRSAEncryption: Td,
  "RSA-SHA224": {
    sign: "ecdsa/rsa",
    hash: "sha224",
    id: "302d300d06096086480165030402040500041c"
  },
  sha256WithRSAEncryption: Cd,
  "RSA-SHA256": {
    sign: "ecdsa/rsa",
    hash: "sha256",
    id: "3031300d060960864801650304020105000420"
  },
  sha384WithRSAEncryption: qd,
  "RSA-SHA384": {
    sign: "ecdsa/rsa",
    hash: "sha384",
    id: "3041300d060960864801650304020205000430"
  },
  sha512WithRSAEncryption: Fd,
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
  sha256: Pd,
  sha224: Dd,
  sha384: $d,
  sha512: Nd,
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
  DSA: Ud,
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
  ripemd160WithRSA: Ld,
  "RSA-RIPEMD160": {
    sign: "rsa",
    hash: "rmd160",
    id: "3021300906052b2403020105000414"
  },
  md5WithRSAEncryption: Od,
  "RSA-MD5": {
    sign: "rsa",
    hash: "md5",
    id: "3020300c06082a864886f70d020505000410"
  }
};
var zd = Zh, Nn = {}, Kd = Math.pow(2, 30) - 1, Wh = function(h, n) {
  if (typeof h != "number")
    throw new TypeError("Iterations not a number");
  if (h < 0)
    throw new TypeError("Bad iterations");
  if (typeof n != "number")
    throw new TypeError("Key length not a number");
  if (n < 0 || n > Kd || n !== n)
    throw new TypeError("Bad key length");
}, mn;
if (Gt.process && Gt.process.browser)
  mn = "utf-8";
else if (Gt.process && Gt.process.version) {
  var Hd = parseInt(ye.version.split(".")[0].slice(1), 10);
  mn = Hd >= 6 ? "utf-8" : "binary";
} else
  mn = "utf-8";
var Vh = mn, pf = Ot.Buffer, Yh = function(h, n, o) {
  if (pf.isBuffer(h))
    return h;
  if (typeof h == "string")
    return pf.from(h, n);
  if (ArrayBuffer.isView(h))
    return pf.from(h.buffer);
  throw new TypeError(o + " must be a string, a Buffer, a typed array or a DataView");
}, Zd = zh, Wd = y0, Vd = w0, Vr = Ot.Buffer, Yd = Wh, la = Vh, da = Yh, Jd = Vr.alloc(128), gn = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
};
function Jh(h, n, o) {
  var s = Gd(h), m = h === "sha512" || h === "sha384" ? 128 : 64;
  n.length > m ? n = s(n) : n.length < m && (n = Vr.concat([n, Jd], m));
  for (var f = Vr.allocUnsafe(m + gn[h]), g = Vr.allocUnsafe(m + gn[h]), y = 0; y < m; y++)
    f[y] = n[y] ^ 54, g[y] = n[y] ^ 92;
  var S = Vr.allocUnsafe(m + o + 4);
  f.copy(S, 0, 0, m), this.ipad1 = S, this.ipad2 = f, this.opad = g, this.alg = h, this.blocksize = m, this.hash = s, this.size = gn[h];
}
Jh.prototype.run = function(h, n) {
  h.copy(n, this.blocksize);
  var o = this.hash(n);
  return o.copy(this.opad, this.blocksize), this.hash(this.opad);
};
function Gd(h) {
  function n(s) {
    return Vd(h).update(s).digest();
  }
  function o(s) {
    return new Wd().update(s).digest();
  }
  return h === "rmd160" || h === "ripemd160" ? o : h === "md5" ? Zd : n;
}
function Xd(h, n, o, s, m) {
  Yd(o, s), h = da(h, la, "Password"), n = da(n, la, "Salt"), m = m || "sha1";
  var f = new Jh(m, h, n.length), g = Vr.allocUnsafe(s), y = Vr.allocUnsafe(n.length + 4);
  n.copy(y, 0, 0, n.length);
  for (var S = 0, B = gn[m], M = Math.ceil(s / B), x = 1; x <= M; x++) {
    y.writeUInt32BE(x, n.length);
    for (var k = f.run(y, f.ipad1), I = k, D = 1; D < o; D++) {
      I = f.run(I, f.ipad2);
      for (var L = 0; L < B; L++)
        k[L] ^= I[L];
    }
    k.copy(g, S), S += B;
  }
  return g;
}
var Gh = Xd, Xh = Ot.Buffer, jd = Wh, ca = Vh, va = Gh, pa = Yh, hn, Ni = Gt.crypto && Gt.crypto.subtle, Qd = {
  sha: "SHA-1",
  "sha-1": "SHA-1",
  sha1: "SHA-1",
  sha256: "SHA-256",
  "sha-256": "SHA-256",
  sha384: "SHA-384",
  "sha-384": "SHA-384",
  "sha-512": "SHA-512",
  sha512: "SHA-512"
}, mf = [];
function tc(h) {
  if (Gt.process && !Gt.process.browser || !Ni || !Ni.importKey || !Ni.deriveBits)
    return Promise.resolve(!1);
  if (mf[h] !== void 0)
    return mf[h];
  hn = hn || Xh.alloc(8);
  var n = jh(hn, hn, 10, 128, h).then(function() {
    return !0;
  }).catch(function() {
    return !1;
  });
  return mf[h] = n, n;
}
var Lr;
function i0() {
  return Lr || (Gt.process && Gt.process.nextTick ? Lr = Gt.process.nextTick : Gt.queueMicrotask ? Lr = Gt.queueMicrotask : Gt.setImmediate ? Lr = Gt.setImmediate : Lr = Gt.setTimeout, Lr);
}
function jh(h, n, o, s, m) {
  return Ni.importKey(
    "raw",
    h,
    { name: "PBKDF2" },
    !1,
    ["deriveBits"]
  ).then(function(f) {
    return Ni.deriveBits({
      name: "PBKDF2",
      salt: n,
      iterations: o,
      hash: {
        name: m
      }
    }, f, s << 3);
  }).then(function(f) {
    return Xh.from(f);
  });
}
function ec(h, n) {
  h.then(function(o) {
    i0()(function() {
      n(null, o);
    });
  }, function(o) {
    i0()(function() {
      n(o);
    });
  });
}
var rc = function(h, n, o, s, m, f) {
  typeof m == "function" && (f = m, m = void 0), m = m || "sha1";
  var g = Qd[m.toLowerCase()];
  if (!g || typeof Gt.Promise != "function") {
    i0()(function() {
      var y;
      try {
        y = va(h, n, o, s, m);
      } catch (S) {
        return f(S);
      }
      f(null, y);
    });
    return;
  }
  if (jd(o, s), h = pa(h, ca, "Password"), n = pa(n, ca, "Salt"), typeof f != "function")
    throw new Error("No callback provided to pbkdf2");
  ec(tc(g).then(function(y) {
    return y ? jh(h, n, o, s, g) : va(h, n, o, s, m);
  }), f);
};
Nn.pbkdf2 = rc;
Nn.pbkdf2Sync = Gh;
var Qe = {}, yi = {}, Oe = {};
Oe.readUInt32BE = function(n, o) {
  var s = n[0 + o] << 24 | n[1 + o] << 16 | n[2 + o] << 8 | n[3 + o];
  return s >>> 0;
};
Oe.writeUInt32BE = function(n, o, s) {
  n[0 + s] = o >>> 24, n[1 + s] = o >>> 16 & 255, n[2 + s] = o >>> 8 & 255, n[3 + s] = o & 255;
};
Oe.ip = function(n, o, s, m) {
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
Oe.rip = function(n, o, s, m) {
  for (var f = 0, g = 0, y = 0; y < 4; y++)
    for (var S = 24; S >= 0; S -= 8)
      f <<= 1, f |= o >>> S + y & 1, f <<= 1, f |= n >>> S + y & 1;
  for (var y = 4; y < 8; y++)
    for (var S = 24; S >= 0; S -= 8)
      g <<= 1, g |= o >>> S + y & 1, g <<= 1, g |= n >>> S + y & 1;
  s[m + 0] = f >>> 0, s[m + 1] = g >>> 0;
};
Oe.pc1 = function(n, o, s, m) {
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
Oe.r28shl = function(n, o) {
  return n << o & 268435455 | n >>> 28 - o;
};
var sn = [
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
Oe.pc2 = function(n, o, s, m) {
  for (var f = 0, g = 0, y = sn.length >>> 1, S = 0; S < y; S++)
    f <<= 1, f |= n >>> sn[S] & 1;
  for (var S = y; S < sn.length; S++)
    g <<= 1, g |= o >>> sn[S] & 1;
  s[m + 0] = f >>> 0, s[m + 1] = g >>> 0;
};
Oe.expand = function(n, o, s) {
  var m = 0, f = 0;
  m = (n & 1) << 5 | n >>> 27;
  for (var g = 23; g >= 15; g -= 4)
    m <<= 6, m |= n >>> g & 63;
  for (var g = 11; g >= 3; g -= 4)
    f |= n >>> g & 63, f <<= 6;
  f |= (n & 31) << 1 | n >>> 31, o[s + 0] = m >>> 0, o[s + 1] = f >>> 0;
};
var ma = [
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
Oe.substitute = function(n, o) {
  for (var s = 0, m = 0; m < 4; m++) {
    var f = n >>> 18 - m * 6 & 63, g = ma[m * 64 + f];
    s <<= 4, s |= g;
  }
  for (var m = 0; m < 4; m++) {
    var f = o >>> 18 - m * 6 & 63, g = ma[4 * 64 + m * 64 + f];
    s <<= 4, s |= g;
  }
  return s >>> 0;
};
var ga = [
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
Oe.permute = function(n) {
  for (var o = 0, s = 0; s < ga.length; s++)
    o <<= 1, o |= n >>> ga[s] & 1;
  return o >>> 0;
};
Oe.padSplit = function(n, o, s) {
  for (var m = n.toString(2); m.length < o; )
    m = "0" + m;
  for (var f = [], g = 0; g < o; g += s)
    f.push(m.slice(g, g + s));
  return f.join(" ");
};
var We = Qh;
function Qh(h, n) {
  if (!h)
    throw new Error(n || "Assertion failed");
}
Qh.equal = function(n, o, s) {
  if (n != o)
    throw new Error(s || "Assertion failed: " + n + " != " + o);
};
var ic = We;
function Ve(h) {
  this.options = h, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0, this.padding = h.padding !== !1;
}
var x0 = Ve;
Ve.prototype._init = function() {
};
Ve.prototype.update = function(n) {
  return n.length === 0 ? [] : this.type === "decrypt" ? this._updateDecrypt(n) : this._updateEncrypt(n);
};
Ve.prototype._buffer = function(n, o) {
  for (var s = Math.min(this.buffer.length - this.bufferOff, n.length - o), m = 0; m < s; m++)
    this.buffer[this.bufferOff + m] = n[o + m];
  return this.bufferOff += s, s;
};
Ve.prototype._flushBuffer = function(n, o) {
  return this._update(this.buffer, 0, n, o), this.bufferOff = 0, this.blockSize;
};
Ve.prototype._updateEncrypt = function(n) {
  var o = 0, s = 0, m = (this.bufferOff + n.length) / this.blockSize | 0, f = new Array(m * this.blockSize);
  this.bufferOff !== 0 && (o += this._buffer(n, o), this.bufferOff === this.buffer.length && (s += this._flushBuffer(f, s)));
  for (var g = n.length - (n.length - o) % this.blockSize; o < g; o += this.blockSize)
    this._update(n, o, f, s), s += this.blockSize;
  for (; o < n.length; o++, this.bufferOff++)
    this.buffer[this.bufferOff] = n[o];
  return f;
};
Ve.prototype._updateDecrypt = function(n) {
  for (var o = 0, s = 0, m = Math.ceil((this.bufferOff + n.length) / this.blockSize) - 1, f = new Array(m * this.blockSize); m > 0; m--)
    o += this._buffer(n, o), s += this._flushBuffer(f, s);
  return o += this._buffer(n, o), f;
};
Ve.prototype.final = function(n) {
  var o;
  n && (o = this.update(n));
  var s;
  return this.type === "encrypt" ? s = this._finalEncrypt() : s = this._finalDecrypt(), o ? o.concat(s) : s;
};
Ve.prototype._pad = function(n, o) {
  if (o === 0)
    return !1;
  for (; o < n.length; )
    n[o++] = 0;
  return !0;
};
Ve.prototype._finalEncrypt = function() {
  if (!this._pad(this.buffer, this.bufferOff))
    return [];
  var n = new Array(this.blockSize);
  return this._update(this.buffer, 0, n, 0), n;
};
Ve.prototype._unpad = function(n) {
  return n;
};
Ve.prototype._finalDecrypt = function() {
  ic.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
  var n = new Array(this.blockSize);
  return this._flushBuffer(n, 0), this._unpad(n);
};
var ts = We, nc = Jt, Me = Oe, es = x0;
function fc() {
  this.tmp = new Array(2), this.keys = null;
}
function dr(h) {
  es.call(this, h);
  var n = new fc();
  this._desState = n, this.deriveKeys(n, h.key);
}
nc(dr, es);
var rs = dr;
dr.create = function(n) {
  return new dr(n);
};
var ac = [
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
dr.prototype.deriveKeys = function(n, o) {
  n.keys = new Array(16 * 2), ts.equal(o.length, this.blockSize, "Invalid key length");
  var s = Me.readUInt32BE(o, 0), m = Me.readUInt32BE(o, 4);
  Me.pc1(s, m, n.tmp, 0), s = n.tmp[0], m = n.tmp[1];
  for (var f = 0; f < n.keys.length; f += 2) {
    var g = ac[f >>> 1];
    s = Me.r28shl(s, g), m = Me.r28shl(m, g), Me.pc2(s, m, n.keys, f);
  }
};
dr.prototype._update = function(n, o, s, m) {
  var f = this._desState, g = Me.readUInt32BE(n, o), y = Me.readUInt32BE(n, o + 4);
  Me.ip(g, y, f.tmp, 0), g = f.tmp[0], y = f.tmp[1], this.type === "encrypt" ? this._encrypt(f, g, y, f.tmp, 0) : this._decrypt(f, g, y, f.tmp, 0), g = f.tmp[0], y = f.tmp[1], Me.writeUInt32BE(s, g, m), Me.writeUInt32BE(s, y, m + 4);
};
dr.prototype._pad = function(n, o) {
  if (this.padding === !1)
    return !1;
  for (var s = n.length - o, m = o; m < n.length; m++)
    n[m] = s;
  return !0;
};
dr.prototype._unpad = function(n) {
  if (this.padding === !1)
    return n;
  for (var o = n[n.length - 1], s = n.length - o; s < n.length; s++)
    ts.equal(n[s], o);
  return n.slice(0, n.length - o);
};
dr.prototype._encrypt = function(n, o, s, m, f) {
  for (var g = o, y = s, S = 0; S < n.keys.length; S += 2) {
    var B = n.keys[S], M = n.keys[S + 1];
    Me.expand(y, n.tmp, 0), B ^= n.tmp[0], M ^= n.tmp[1];
    var x = Me.substitute(B, M), k = Me.permute(x), I = y;
    y = (g ^ k) >>> 0, g = I;
  }
  Me.rip(y, g, m, f);
};
dr.prototype._decrypt = function(n, o, s, m, f) {
  for (var g = s, y = o, S = n.keys.length - 2; S >= 0; S -= 2) {
    var B = n.keys[S], M = n.keys[S + 1];
    Me.expand(g, n.tmp, 0), B ^= n.tmp[0], M ^= n.tmp[1];
    var x = Me.substitute(B, M), k = Me.permute(x), I = g;
    g = (y ^ k) >>> 0, y = I;
  }
  Me.rip(g, y, m, f);
};
var is = {}, hc = We, sc = Jt, xn = {};
function oc(h) {
  hc.equal(h.length, 8, "Invalid IV length"), this.iv = new Array(8);
  for (var n = 0; n < this.iv.length; n++)
    this.iv[n] = h[n];
}
function uc(h) {
  function n(f) {
    h.call(this, f), this._cbcInit();
  }
  sc(n, h);
  for (var o = Object.keys(xn), s = 0; s < o.length; s++) {
    var m = o[s];
    n.prototype[m] = xn[m];
  }
  return n.create = function(g) {
    return new n(g);
  }, n;
}
is.instantiate = uc;
xn._cbcInit = function() {
  var n = new oc(this.options.iv);
  this._cbcState = n;
};
xn._update = function(n, o, s, m) {
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
var lc = We, dc = Jt, ns = x0, Fr = rs;
function cc(h, n) {
  lc.equal(n.length, 24, "Invalid key length");
  var o = n.slice(0, 8), s = n.slice(8, 16), m = n.slice(16, 24);
  h === "encrypt" ? this.ciphers = [
    Fr.create({ type: "encrypt", key: o }),
    Fr.create({ type: "decrypt", key: s }),
    Fr.create({ type: "encrypt", key: m })
  ] : this.ciphers = [
    Fr.create({ type: "decrypt", key: m }),
    Fr.create({ type: "encrypt", key: s }),
    Fr.create({ type: "decrypt", key: o })
  ];
}
function Xr(h) {
  ns.call(this, h);
  var n = new cc(this.type, this.options.key);
  this._edeState = n;
}
dc(Xr, ns);
var vc = Xr;
Xr.create = function(n) {
  return new Xr(n);
};
Xr.prototype._update = function(n, o, s, m) {
  var f = this._edeState;
  f.ciphers[0]._update(n, o, s, m), f.ciphers[1]._update(s, m, s, m), f.ciphers[2]._update(s, m, s, m);
};
Xr.prototype._pad = Fr.prototype._pad;
Xr.prototype._unpad = Fr.prototype._unpad;
yi.utils = Oe;
yi.Cipher = x0;
yi.DES = rs;
yi.CBC = is;
yi.EDE = vc;
var fs = Nr, wr = yi, pc = Jt, Hr = Ot.Buffer, zi = {
  "des-ede3-cbc": wr.CBC.instantiate(wr.EDE),
  "des-ede3": wr.EDE,
  "des-ede-cbc": wr.CBC.instantiate(wr.EDE),
  "des-ede": wr.EDE,
  "des-cbc": wr.CBC.instantiate(wr.DES),
  "des-ecb": wr.DES
};
zi.des = zi["des-cbc"];
zi.des3 = zi["des-ede3-cbc"];
var mc = Un;
pc(Un, fs);
function Un(h) {
  fs.call(this);
  var n = h.mode.toLowerCase(), o = zi[n], s;
  h.decrypt ? s = "decrypt" : s = "encrypt";
  var m = h.key;
  Hr.isBuffer(m) || (m = Hr.from(m)), (n === "des-ede" || n === "des-ede-cbc") && (m = Hr.concat([m, m.slice(0, 8)]));
  var f = h.iv;
  Hr.isBuffer(f) || (f = Hr.from(f)), this._des = o.create({
    key: m,
    iv: f,
    type: s
  });
}
Un.prototype._update = function(h) {
  return Hr.from(this._des.update(h));
};
Un.prototype._final = function() {
  return Hr.from(this._des.final());
};
var Le = {}, _0 = {}, S0 = {};
S0.encrypt = function(h, n) {
  return h._cipher.encryptBlock(n);
};
S0.decrypt = function(h, n) {
  return h._cipher.decryptBlock(n);
};
var A0 = {}, sr = [], He = [], gc = typeof Uint8Array != "undefined" ? Uint8Array : Array, B0 = !1;
function as() {
  B0 = !0;
  for (var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, o = h.length; n < o; ++n)
    sr[n] = h[n], He[h.charCodeAt(n)] = n;
  He["-".charCodeAt(0)] = 62, He["_".charCodeAt(0)] = 63;
}
function bc(h) {
  B0 || as();
  var n, o, s, m, f, g, y = h.length;
  if (y % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  f = h[y - 2] === "=" ? 2 : h[y - 1] === "=" ? 1 : 0, g = new gc(y * 3 / 4 - f), s = f > 0 ? y - 4 : y;
  var S = 0;
  for (n = 0, o = 0; n < s; n += 4, o += 3)
    m = He[h.charCodeAt(n)] << 18 | He[h.charCodeAt(n + 1)] << 12 | He[h.charCodeAt(n + 2)] << 6 | He[h.charCodeAt(n + 3)], g[S++] = m >> 16 & 255, g[S++] = m >> 8 & 255, g[S++] = m & 255;
  return f === 2 ? (m = He[h.charCodeAt(n)] << 2 | He[h.charCodeAt(n + 1)] >> 4, g[S++] = m & 255) : f === 1 && (m = He[h.charCodeAt(n)] << 10 | He[h.charCodeAt(n + 1)] << 4 | He[h.charCodeAt(n + 2)] >> 2, g[S++] = m >> 8 & 255, g[S++] = m & 255), g;
}
function yc(h) {
  return sr[h >> 18 & 63] + sr[h >> 12 & 63] + sr[h >> 6 & 63] + sr[h & 63];
}
function wc(h, n, o) {
  for (var s, m = [], f = n; f < o; f += 3)
    s = (h[f] << 16) + (h[f + 1] << 8) + h[f + 2], m.push(yc(s));
  return m.join("");
}
function ba(h) {
  B0 || as();
  for (var n, o = h.length, s = o % 3, m = "", f = [], g = 16383, y = 0, S = o - s; y < S; y += g)
    f.push(wc(h, y, y + g > S ? S : y + g));
  return s === 1 ? (n = h[o - 1], m += sr[n >> 2], m += sr[n << 4 & 63], m += "==") : s === 2 && (n = (h[o - 2] << 8) + h[o - 1], m += sr[n >> 10], m += sr[n >> 4 & 63], m += sr[n << 2 & 63], m += "="), f.push(m), f.join("");
}
function Ln(h, n, o, s, m) {
  var f, g, y = m * 8 - s - 1, S = (1 << y) - 1, B = S >> 1, M = -7, x = o ? m - 1 : 0, k = o ? -1 : 1, I = h[n + x];
  for (x += k, f = I & (1 << -M) - 1, I >>= -M, M += y; M > 0; f = f * 256 + h[n + x], x += k, M -= 8)
    ;
  for (g = f & (1 << -M) - 1, f >>= -M, M += s; M > 0; g = g * 256 + h[n + x], x += k, M -= 8)
    ;
  if (f === 0)
    f = 1 - B;
  else {
    if (f === S)
      return g ? NaN : (I ? -1 : 1) * (1 / 0);
    g = g + Math.pow(2, s), f = f - B;
  }
  return (I ? -1 : 1) * g * Math.pow(2, f - s);
}
function hs(h, n, o, s, m, f) {
  var g, y, S, B = f * 8 - m - 1, M = (1 << B) - 1, x = M >> 1, k = m === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, I = s ? 0 : f - 1, D = s ? 1 : -1, L = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
  for (n = Math.abs(n), isNaN(n) || n === 1 / 0 ? (y = isNaN(n) ? 1 : 0, g = M) : (g = Math.floor(Math.log(n) / Math.LN2), n * (S = Math.pow(2, -g)) < 1 && (g--, S *= 2), g + x >= 1 ? n += k / S : n += k * Math.pow(2, 1 - x), n * S >= 2 && (g++, S /= 2), g + x >= M ? (y = 0, g = M) : g + x >= 1 ? (y = (n * S - 1) * Math.pow(2, m), g = g + x) : (y = n * Math.pow(2, x - 1) * Math.pow(2, m), g = 0)); m >= 8; h[o + I] = y & 255, I += D, y /= 256, m -= 8)
    ;
  for (g = g << m | y, B += m; B > 0; h[o + I] = g & 255, I += D, g /= 256, B -= 8)
    ;
  h[o + I - D] |= L * 128;
}
var Mc = {}.toString, ss = Array.isArray || function(h) {
  return Mc.call(h) == "[object Array]";
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var xc = 50;
mt.TYPED_ARRAY_SUPPORT = Li.TYPED_ARRAY_SUPPORT !== void 0 ? Li.TYPED_ARRAY_SUPPORT : !0;
_n();
function _n() {
  return mt.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function xr(h, n) {
  if (_n() < n)
    throw new RangeError("Invalid typed array length");
  return mt.TYPED_ARRAY_SUPPORT ? (h = new Uint8Array(n), h.__proto__ = mt.prototype) : (h === null && (h = new mt(n)), h.length = n), h;
}
function mt(h, n, o) {
  if (!mt.TYPED_ARRAY_SUPPORT && !(this instanceof mt))
    return new mt(h, n, o);
  if (typeof h == "number") {
    if (typeof n == "string")
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    return E0(this, h);
  }
  return os(this, h, n, o);
}
mt.poolSize = 8192;
mt._augment = function(h) {
  return h.__proto__ = mt.prototype, h;
};
function os(h, n, o, s) {
  if (typeof n == "number")
    throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer != "undefined" && n instanceof ArrayBuffer ? Ac(h, n, o, s) : typeof n == "string" ? Sc(h, n, o) : Bc(h, n);
}
mt.from = function(h, n, o) {
  return os(null, h, n, o);
};
mt.TYPED_ARRAY_SUPPORT && (mt.prototype.__proto__ = Uint8Array.prototype, mt.__proto__ = Uint8Array, typeof Symbol != "undefined" && Symbol.species && mt[Symbol.species]);
function us(h) {
  if (typeof h != "number")
    throw new TypeError('"size" argument must be a number');
  if (h < 0)
    throw new RangeError('"size" argument must not be negative');
}
function _c(h, n, o, s) {
  return us(n), n <= 0 ? xr(h, n) : o !== void 0 ? typeof s == "string" ? xr(h, n).fill(o, s) : xr(h, n).fill(o) : xr(h, n);
}
mt.alloc = function(h, n, o) {
  return _c(null, h, n, o);
};
function E0(h, n) {
  if (us(n), h = xr(h, n < 0 ? 0 : I0(n) | 0), !mt.TYPED_ARRAY_SUPPORT)
    for (var o = 0; o < n; ++o)
      h[o] = 0;
  return h;
}
mt.allocUnsafe = function(h) {
  return E0(null, h);
};
mt.allocUnsafeSlow = function(h) {
  return E0(null, h);
};
function Sc(h, n, o) {
  if ((typeof o != "string" || o === "") && (o = "utf8"), !mt.isEncoding(o))
    throw new TypeError('"encoding" must be a valid string encoding');
  var s = ls(n, o) | 0;
  h = xr(h, s);
  var m = h.write(n, o);
  return m !== s && (h = h.slice(0, m)), h;
}
function n0(h, n) {
  var o = n.length < 0 ? 0 : I0(n.length) | 0;
  h = xr(h, o);
  for (var s = 0; s < o; s += 1)
    h[s] = n[s] & 255;
  return h;
}
function Ac(h, n, o, s) {
  if (n.byteLength, o < 0 || n.byteLength < o)
    throw new RangeError("'offset' is out of bounds");
  if (n.byteLength < o + (s || 0))
    throw new RangeError("'length' is out of bounds");
  return o === void 0 && s === void 0 ? n = new Uint8Array(n) : s === void 0 ? n = new Uint8Array(n, o) : n = new Uint8Array(n, o, s), mt.TYPED_ARRAY_SUPPORT ? (h = n, h.__proto__ = mt.prototype) : h = n0(h, n), h;
}
function Bc(h, n) {
  if (cr(n)) {
    var o = I0(n.length) | 0;
    return h = xr(h, o), h.length === 0 || n.copy(h, 0, 0, o), h;
  }
  if (n) {
    if (typeof ArrayBuffer != "undefined" && n.buffer instanceof ArrayBuffer || "length" in n)
      return typeof n.length != "number" || Zc(n.length) ? xr(h, 0) : n0(h, n);
    if (n.type === "Buffer" && ss(n.data))
      return n0(h, n.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function I0(h) {
  if (h >= _n())
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + _n().toString(16) + " bytes");
  return h | 0;
}
mt.isBuffer = Wc;
function cr(h) {
  return !!(h != null && h._isBuffer);
}
mt.compare = function(n, o) {
  if (!cr(n) || !cr(o))
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
  if (!ss(n))
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
    if (!cr(g))
      throw new TypeError('"list" argument must be an Array of Buffers');
    g.copy(m, f), f += g.length;
  }
  return m;
};
function ls(h, n) {
  if (cr(h))
    return h.length;
  if (typeof ArrayBuffer != "undefined" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(h) || h instanceof ArrayBuffer))
    return h.byteLength;
  typeof h != "string" && (h = "" + h);
  var o = h.length;
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
        return Sn(h).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return o * 2;
      case "hex":
        return o >>> 1;
      case "base64":
        return bs(h).length;
      default:
        if (s)
          return Sn(h).length;
        n = ("" + n).toLowerCase(), s = !0;
    }
}
mt.byteLength = ls;
function Ec(h, n, o) {
  var s = !1;
  if ((n === void 0 || n < 0) && (n = 0), n > this.length || ((o === void 0 || o > this.length) && (o = this.length), o <= 0) || (o >>>= 0, n >>>= 0, o <= n))
    return "";
  for (h || (h = "utf8"); ; )
    switch (h) {
      case "hex":
        return $c(this, n, o);
      case "utf8":
      case "utf-8":
        return vs(this, n, o);
      case "ascii":
        return Pc(this, n, o);
      case "latin1":
      case "binary":
        return Dc(this, n, o);
      case "base64":
        return qc(this, n, o);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Nc(this, n, o);
      default:
        if (s)
          throw new TypeError("Unknown encoding: " + h);
        h = (h + "").toLowerCase(), s = !0;
    }
}
mt.prototype._isBuffer = !0;
function Yr(h, n, o) {
  var s = h[n];
  h[n] = h[o], h[o] = s;
}
mt.prototype.swap16 = function() {
  var n = this.length;
  if (n % 2 !== 0)
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var o = 0; o < n; o += 2)
    Yr(this, o, o + 1);
  return this;
};
mt.prototype.swap32 = function() {
  var n = this.length;
  if (n % 4 !== 0)
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var o = 0; o < n; o += 4)
    Yr(this, o, o + 3), Yr(this, o + 1, o + 2);
  return this;
};
mt.prototype.swap64 = function() {
  var n = this.length;
  if (n % 8 !== 0)
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var o = 0; o < n; o += 8)
    Yr(this, o, o + 7), Yr(this, o + 1, o + 6), Yr(this, o + 2, o + 5), Yr(this, o + 3, o + 4);
  return this;
};
mt.prototype.toString = function() {
  var n = this.length | 0;
  return n === 0 ? "" : arguments.length === 0 ? vs(this, 0, n) : Ec.apply(this, arguments);
};
mt.prototype.equals = function(n) {
  if (!cr(n))
    throw new TypeError("Argument must be a Buffer");
  return this === n ? !0 : mt.compare(this, n) === 0;
};
mt.prototype.inspect = function() {
  var n = "", o = xc;
  return this.length > 0 && (n = this.toString("hex", 0, o).match(/.{2}/g).join(" "), this.length > o && (n += " ... ")), "<Buffer " + n + ">";
};
mt.prototype.compare = function(n, o, s, m, f) {
  if (!cr(n))
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
function ds(h, n, o, s, m) {
  if (h.length === 0)
    return -1;
  if (typeof o == "string" ? (s = o, o = 0) : o > 2147483647 ? o = 2147483647 : o < -2147483648 && (o = -2147483648), o = +o, isNaN(o) && (o = m ? 0 : h.length - 1), o < 0 && (o = h.length + o), o >= h.length) {
    if (m)
      return -1;
    o = h.length - 1;
  } else if (o < 0)
    if (m)
      o = 0;
    else
      return -1;
  if (typeof n == "string" && (n = mt.from(n, s)), cr(n))
    return n.length === 0 ? -1 : ya(h, n, o, s, m);
  if (typeof n == "number")
    return n = n & 255, mt.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? m ? Uint8Array.prototype.indexOf.call(h, n, o) : Uint8Array.prototype.lastIndexOf.call(h, n, o) : ya(h, [n], o, s, m);
  throw new TypeError("val must be string, number or Buffer");
}
function ya(h, n, o, s, m) {
  var f = 1, g = h.length, y = n.length;
  if (s !== void 0 && (s = String(s).toLowerCase(), s === "ucs2" || s === "ucs-2" || s === "utf16le" || s === "utf-16le")) {
    if (h.length < 2 || n.length < 2)
      return -1;
    f = 2, g /= 2, y /= 2, o /= 2;
  }
  function S(I, D) {
    return f === 1 ? I[D] : I.readUInt16BE(D * f);
  }
  var B;
  if (m) {
    var M = -1;
    for (B = o; B < g; B++)
      if (S(h, B) === S(n, M === -1 ? 0 : B - M)) {
        if (M === -1 && (M = B), B - M + 1 === y)
          return M * f;
      } else
        M !== -1 && (B -= B - M), M = -1;
  } else
    for (o + y > g && (o = g - y), B = o; B >= 0; B--) {
      for (var x = !0, k = 0; k < y; k++)
        if (S(h, B + k) !== S(n, k)) {
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
  return ds(this, n, o, s, !0);
};
mt.prototype.lastIndexOf = function(n, o, s) {
  return ds(this, n, o, s, !1);
};
function Ic(h, n, o, s) {
  o = Number(o) || 0;
  var m = h.length - o;
  s ? (s = Number(s), s > m && (s = m)) : s = m;
  var f = n.length;
  if (f % 2 !== 0)
    throw new TypeError("Invalid hex string");
  s > f / 2 && (s = f / 2);
  for (var g = 0; g < s; ++g) {
    var y = parseInt(n.substr(g * 2, 2), 16);
    if (isNaN(y))
      return g;
    h[o + g] = y;
  }
  return g;
}
function kc(h, n, o, s) {
  return Kn(Sn(n, h.length - o), h, o, s);
}
function cs(h, n, o, s) {
  return Kn(Kc(n), h, o, s);
}
function Rc(h, n, o, s) {
  return cs(h, n, o, s);
}
function Tc(h, n, o, s) {
  return Kn(bs(n), h, o, s);
}
function Cc(h, n, o, s) {
  return Kn(Hc(n, h.length - o), h, o, s);
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
        return Ic(this, n, o, s);
      case "utf8":
      case "utf-8":
        return kc(this, n, o, s);
      case "ascii":
        return cs(this, n, o, s);
      case "latin1":
      case "binary":
        return Rc(this, n, o, s);
      case "base64":
        return Tc(this, n, o, s);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Cc(this, n, o, s);
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
function qc(h, n, o) {
  return n === 0 && o === h.length ? ba(h) : ba(h.slice(n, o));
}
function vs(h, n, o) {
  o = Math.min(h.length, o);
  for (var s = [], m = n; m < o; ) {
    var f = h[m], g = null, y = f > 239 ? 4 : f > 223 ? 3 : f > 191 ? 2 : 1;
    if (m + y <= o) {
      var S, B, M, x;
      switch (y) {
        case 1:
          f < 128 && (g = f);
          break;
        case 2:
          S = h[m + 1], (S & 192) === 128 && (x = (f & 31) << 6 | S & 63, x > 127 && (g = x));
          break;
        case 3:
          S = h[m + 1], B = h[m + 2], (S & 192) === 128 && (B & 192) === 128 && (x = (f & 15) << 12 | (S & 63) << 6 | B & 63, x > 2047 && (x < 55296 || x > 57343) && (g = x));
          break;
        case 4:
          S = h[m + 1], B = h[m + 2], M = h[m + 3], (S & 192) === 128 && (B & 192) === 128 && (M & 192) === 128 && (x = (f & 15) << 18 | (S & 63) << 12 | (B & 63) << 6 | M & 63, x > 65535 && x < 1114112 && (g = x));
      }
    }
    g === null ? (g = 65533, y = 1) : g > 65535 && (g -= 65536, s.push(g >>> 10 & 1023 | 55296), g = 56320 | g & 1023), s.push(g), m += y;
  }
  return Fc(s);
}
var wa = 4096;
function Fc(h) {
  var n = h.length;
  if (n <= wa)
    return String.fromCharCode.apply(String, h);
  for (var o = "", s = 0; s < n; )
    o += String.fromCharCode.apply(
      String,
      h.slice(s, s += wa)
    );
  return o;
}
function Pc(h, n, o) {
  var s = "";
  o = Math.min(h.length, o);
  for (var m = n; m < o; ++m)
    s += String.fromCharCode(h[m] & 127);
  return s;
}
function Dc(h, n, o) {
  var s = "";
  o = Math.min(h.length, o);
  for (var m = n; m < o; ++m)
    s += String.fromCharCode(h[m]);
  return s;
}
function $c(h, n, o) {
  var s = h.length;
  (!n || n < 0) && (n = 0), (!o || o < 0 || o > s) && (o = s);
  for (var m = "", f = n; f < o; ++f)
    m += zc(h[f]);
  return m;
}
function Nc(h, n, o) {
  for (var s = h.slice(n, o), m = "", f = 0; f < s.length; f += 2)
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
function Ae(h, n, o) {
  if (h % 1 !== 0 || h < 0)
    throw new RangeError("offset is not uint");
  if (h + n > o)
    throw new RangeError("Trying to access beyond buffer length");
}
mt.prototype.readUIntLE = function(n, o, s) {
  n = n | 0, o = o | 0, s || Ae(n, o, this.length);
  for (var m = this[n], f = 1, g = 0; ++g < o && (f *= 256); )
    m += this[n + g] * f;
  return m;
};
mt.prototype.readUIntBE = function(n, o, s) {
  n = n | 0, o = o | 0, s || Ae(n, o, this.length);
  for (var m = this[n + --o], f = 1; o > 0 && (f *= 256); )
    m += this[n + --o] * f;
  return m;
};
mt.prototype.readUInt8 = function(n, o) {
  return o || Ae(n, 1, this.length), this[n];
};
mt.prototype.readUInt16LE = function(n, o) {
  return o || Ae(n, 2, this.length), this[n] | this[n + 1] << 8;
};
mt.prototype.readUInt16BE = function(n, o) {
  return o || Ae(n, 2, this.length), this[n] << 8 | this[n + 1];
};
mt.prototype.readUInt32LE = function(n, o) {
  return o || Ae(n, 4, this.length), (this[n] | this[n + 1] << 8 | this[n + 2] << 16) + this[n + 3] * 16777216;
};
mt.prototype.readUInt32BE = function(n, o) {
  return o || Ae(n, 4, this.length), this[n] * 16777216 + (this[n + 1] << 16 | this[n + 2] << 8 | this[n + 3]);
};
mt.prototype.readIntLE = function(n, o, s) {
  n = n | 0, o = o | 0, s || Ae(n, o, this.length);
  for (var m = this[n], f = 1, g = 0; ++g < o && (f *= 256); )
    m += this[n + g] * f;
  return f *= 128, m >= f && (m -= Math.pow(2, 8 * o)), m;
};
mt.prototype.readIntBE = function(n, o, s) {
  n = n | 0, o = o | 0, s || Ae(n, o, this.length);
  for (var m = o, f = 1, g = this[n + --m]; m > 0 && (f *= 256); )
    g += this[n + --m] * f;
  return f *= 128, g >= f && (g -= Math.pow(2, 8 * o)), g;
};
mt.prototype.readInt8 = function(n, o) {
  return o || Ae(n, 1, this.length), this[n] & 128 ? (255 - this[n] + 1) * -1 : this[n];
};
mt.prototype.readInt16LE = function(n, o) {
  o || Ae(n, 2, this.length);
  var s = this[n] | this[n + 1] << 8;
  return s & 32768 ? s | 4294901760 : s;
};
mt.prototype.readInt16BE = function(n, o) {
  o || Ae(n, 2, this.length);
  var s = this[n + 1] | this[n] << 8;
  return s & 32768 ? s | 4294901760 : s;
};
mt.prototype.readInt32LE = function(n, o) {
  return o || Ae(n, 4, this.length), this[n] | this[n + 1] << 8 | this[n + 2] << 16 | this[n + 3] << 24;
};
mt.prototype.readInt32BE = function(n, o) {
  return o || Ae(n, 4, this.length), this[n] << 24 | this[n + 1] << 16 | this[n + 2] << 8 | this[n + 3];
};
mt.prototype.readFloatLE = function(n, o) {
  return o || Ae(n, 4, this.length), Ln(this, n, !0, 23, 4);
};
mt.prototype.readFloatBE = function(n, o) {
  return o || Ae(n, 4, this.length), Ln(this, n, !1, 23, 4);
};
mt.prototype.readDoubleLE = function(n, o) {
  return o || Ae(n, 8, this.length), Ln(this, n, !0, 52, 8);
};
mt.prototype.readDoubleBE = function(n, o) {
  return o || Ae(n, 8, this.length), Ln(this, n, !1, 52, 8);
};
function Ne(h, n, o, s, m, f) {
  if (!cr(h))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (n > m || n < f)
    throw new RangeError('"value" argument is out of bounds');
  if (o + s > h.length)
    throw new RangeError("Index out of range");
}
mt.prototype.writeUIntLE = function(n, o, s, m) {
  if (n = +n, o = o | 0, s = s | 0, !m) {
    var f = Math.pow(2, 8 * s) - 1;
    Ne(this, n, o, s, f, 0);
  }
  var g = 1, y = 0;
  for (this[o] = n & 255; ++y < s && (g *= 256); )
    this[o + y] = n / g & 255;
  return o + s;
};
mt.prototype.writeUIntBE = function(n, o, s, m) {
  if (n = +n, o = o | 0, s = s | 0, !m) {
    var f = Math.pow(2, 8 * s) - 1;
    Ne(this, n, o, s, f, 0);
  }
  var g = s - 1, y = 1;
  for (this[o + g] = n & 255; --g >= 0 && (y *= 256); )
    this[o + g] = n / y & 255;
  return o + s;
};
mt.prototype.writeUInt8 = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 1, 255, 0), mt.TYPED_ARRAY_SUPPORT || (n = Math.floor(n)), this[o] = n & 255, o + 1;
};
function On(h, n, o, s) {
  n < 0 && (n = 65535 + n + 1);
  for (var m = 0, f = Math.min(h.length - o, 2); m < f; ++m)
    h[o + m] = (n & 255 << 8 * (s ? m : 1 - m)) >>> (s ? m : 1 - m) * 8;
}
mt.prototype.writeUInt16LE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 2, 65535, 0), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n & 255, this[o + 1] = n >>> 8) : On(this, n, o, !0), o + 2;
};
mt.prototype.writeUInt16BE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 2, 65535, 0), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n >>> 8, this[o + 1] = n & 255) : On(this, n, o, !1), o + 2;
};
function zn(h, n, o, s) {
  n < 0 && (n = 4294967295 + n + 1);
  for (var m = 0, f = Math.min(h.length - o, 4); m < f; ++m)
    h[o + m] = n >>> (s ? m : 3 - m) * 8 & 255;
}
mt.prototype.writeUInt32LE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 4, 4294967295, 0), mt.TYPED_ARRAY_SUPPORT ? (this[o + 3] = n >>> 24, this[o + 2] = n >>> 16, this[o + 1] = n >>> 8, this[o] = n & 255) : zn(this, n, o, !0), o + 4;
};
mt.prototype.writeUInt32BE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 4, 4294967295, 0), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n >>> 24, this[o + 1] = n >>> 16, this[o + 2] = n >>> 8, this[o + 3] = n & 255) : zn(this, n, o, !1), o + 4;
};
mt.prototype.writeIntLE = function(n, o, s, m) {
  if (n = +n, o = o | 0, !m) {
    var f = Math.pow(2, 8 * s - 1);
    Ne(this, n, o, s, f - 1, -f);
  }
  var g = 0, y = 1, S = 0;
  for (this[o] = n & 255; ++g < s && (y *= 256); )
    n < 0 && S === 0 && this[o + g - 1] !== 0 && (S = 1), this[o + g] = (n / y >> 0) - S & 255;
  return o + s;
};
mt.prototype.writeIntBE = function(n, o, s, m) {
  if (n = +n, o = o | 0, !m) {
    var f = Math.pow(2, 8 * s - 1);
    Ne(this, n, o, s, f - 1, -f);
  }
  var g = s - 1, y = 1, S = 0;
  for (this[o + g] = n & 255; --g >= 0 && (y *= 256); )
    n < 0 && S === 0 && this[o + g + 1] !== 0 && (S = 1), this[o + g] = (n / y >> 0) - S & 255;
  return o + s;
};
mt.prototype.writeInt8 = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 1, 127, -128), mt.TYPED_ARRAY_SUPPORT || (n = Math.floor(n)), n < 0 && (n = 255 + n + 1), this[o] = n & 255, o + 1;
};
mt.prototype.writeInt16LE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 2, 32767, -32768), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n & 255, this[o + 1] = n >>> 8) : On(this, n, o, !0), o + 2;
};
mt.prototype.writeInt16BE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 2, 32767, -32768), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n >>> 8, this[o + 1] = n & 255) : On(this, n, o, !1), o + 2;
};
mt.prototype.writeInt32LE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 4, 2147483647, -2147483648), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n & 255, this[o + 1] = n >>> 8, this[o + 2] = n >>> 16, this[o + 3] = n >>> 24) : zn(this, n, o, !0), o + 4;
};
mt.prototype.writeInt32BE = function(n, o, s) {
  return n = +n, o = o | 0, s || Ne(this, n, o, 4, 2147483647, -2147483648), n < 0 && (n = 4294967295 + n + 1), mt.TYPED_ARRAY_SUPPORT ? (this[o] = n >>> 24, this[o + 1] = n >>> 16, this[o + 2] = n >>> 8, this[o + 3] = n & 255) : zn(this, n, o, !1), o + 4;
};
function ps(h, n, o, s, m, f) {
  if (o + s > h.length)
    throw new RangeError("Index out of range");
  if (o < 0)
    throw new RangeError("Index out of range");
}
function ms(h, n, o, s, m) {
  return m || ps(h, n, o, 4), hs(h, n, o, s, 23, 4), o + 4;
}
mt.prototype.writeFloatLE = function(n, o, s) {
  return ms(this, n, o, !0, s);
};
mt.prototype.writeFloatBE = function(n, o, s) {
  return ms(this, n, o, !1, s);
};
function gs(h, n, o, s, m) {
  return m || ps(h, n, o, 8), hs(h, n, o, s, 52, 8), o + 8;
}
mt.prototype.writeDoubleLE = function(n, o, s) {
  return gs(this, n, o, !0, s);
};
mt.prototype.writeDoubleBE = function(n, o, s) {
  return gs(this, n, o, !1, s);
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
    var y = cr(n) ? n : Sn(new mt(n, m).toString()), S = y.length;
    for (g = 0; g < s - o; ++g)
      this[g + o] = y[g % S];
  }
  return this;
};
var Uc = /[^+\/0-9A-Za-z-_]/g;
function Lc(h) {
  if (h = Oc(h).replace(Uc, ""), h.length < 2)
    return "";
  for (; h.length % 4 !== 0; )
    h = h + "=";
  return h;
}
function Oc(h) {
  return h.trim ? h.trim() : h.replace(/^\s+|\s+$/g, "");
}
function zc(h) {
  return h < 16 ? "0" + h.toString(16) : h.toString(16);
}
function Sn(h, n) {
  n = n || 1 / 0;
  for (var o, s = h.length, m = null, f = [], g = 0; g < s; ++g) {
    if (o = h.charCodeAt(g), o > 55295 && o < 57344) {
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
function Kc(h) {
  for (var n = [], o = 0; o < h.length; ++o)
    n.push(h.charCodeAt(o) & 255);
  return n;
}
function Hc(h, n) {
  for (var o, s, m, f = [], g = 0; g < h.length && !((n -= 2) < 0); ++g)
    o = h.charCodeAt(g), s = o >> 8, m = o % 256, f.push(m), f.push(s);
  return f;
}
function bs(h) {
  return bc(Lc(h));
}
function Kn(h, n, o, s) {
  for (var m = 0; m < s && !(m + o >= n.length || m >= h.length); ++m)
    n[m + o] = h[m];
  return m;
}
function Zc(h) {
  return h !== h;
}
function Wc(h) {
  return h != null && (!!h._isBuffer || ys(h) || Vc(h));
}
function ys(h) {
  return !!h.constructor && typeof h.constructor.isBuffer == "function" && h.constructor.isBuffer(h);
}
function Vc(h) {
  return typeof h.readFloatLE == "function" && typeof h.slice == "function" && ys(h.slice(0, 0));
}
var Xi = function(n, o) {
  for (var s = Math.min(n.length, o.length), m = new mt(s), f = 0; f < s; ++f)
    m[f] = n[f] ^ o[f];
  return m;
}, ws = Xi;
A0.encrypt = function(h, n) {
  var o = ws(n, h._prev);
  return h._prev = h._cipher.encryptBlock(o), h._prev;
};
A0.decrypt = function(h, n) {
  var o = h._prev;
  h._prev = n;
  var s = h._cipher.decryptBlock(n);
  return ws(s, o);
};
var Ms = {}, Di = Ot.Buffer, Yc = Xi;
function Ma(h, n, o) {
  var s = n.length, m = Yc(n, h._cache);
  return h._cache = h._cache.slice(s), h._prev = Di.concat([h._prev, o ? n : m]), m;
}
Ms.encrypt = function(h, n, o) {
  for (var s = Di.allocUnsafe(0), m; n.length; )
    if (h._cache.length === 0 && (h._cache = h._cipher.encryptBlock(h._prev), h._prev = Di.allocUnsafe(0)), h._cache.length <= n.length)
      m = h._cache.length, s = Di.concat([s, Ma(h, n.slice(0, m), o)]), n = n.slice(m);
    else {
      s = Di.concat([s, Ma(h, n, o)]);
      break;
    }
  return s;
};
var xs = {}, f0 = Ot.Buffer;
function Jc(h, n, o) {
  var s = h._cipher.encryptBlock(h._prev), m = s[0] ^ n;
  return h._prev = f0.concat([
    h._prev.slice(1),
    f0.from([o ? n : m])
  ]), m;
}
xs.encrypt = function(h, n, o) {
  for (var s = n.length, m = f0.allocUnsafe(s), f = -1; ++f < s; )
    m[f] = Jc(h, n[f], o);
  return m;
};
var _s = {}, bn = Ot.Buffer;
function Gc(h, n, o) {
  for (var s, m = -1, f = 8, g = 0, y, S; ++m < f; )
    s = h._cipher.encryptBlock(h._prev), y = n & 1 << 7 - m ? 128 : 0, S = s[0] ^ y, g += (S & 128) >> m % 8, h._prev = Xc(h._prev, o ? y : S);
  return g;
}
function Xc(h, n) {
  var o = h.length, s = -1, m = bn.allocUnsafe(h.length);
  for (h = bn.concat([h, bn.from([n])]); ++s < o; )
    m[s] = h[s] << 1 | h[s + 1] >> 7;
  return m;
}
_s.encrypt = function(h, n, o) {
  for (var s = n.length, m = bn.allocUnsafe(s), f = -1; ++f < s; )
    m[f] = Gc(h, n[f], o);
  return m;
};
var Ss = {}, jc = Xi;
function Qc(h) {
  return h._prev = h._cipher.encryptBlock(h._prev), h._prev;
}
Ss.encrypt = function(h, n) {
  for (; h._cache.length < n.length; )
    h._cache = mt.concat([h._cache, Qc(h)]);
  var o = h._cache.slice(0, n.length);
  return h._cache = h._cache.slice(n.length), jc(n, o);
};
var a0 = {};
function t1(h) {
  for (var n = h.length, o; n--; )
    if (o = h.readUInt8(n), o === 255)
      h.writeUInt8(0, n);
    else {
      o++, h.writeUInt8(o, n);
      break;
    }
}
var As = t1, e1 = Xi, xa = Ot.Buffer, r1 = As;
function i1(h) {
  var n = h._cipher.encryptBlockRaw(h._prev);
  return r1(h._prev), n;
}
var gf = 16;
a0.encrypt = function(h, n) {
  var o = Math.ceil(n.length / gf), s = h._cache.length;
  h._cache = xa.concat([
    h._cache,
    xa.allocUnsafe(o * gf)
  ]);
  for (var m = 0; m < o; m++) {
    var f = i1(h), g = s + m * gf;
    h._cache.writeUInt32BE(f[0], g + 0), h._cache.writeUInt32BE(f[1], g + 4), h._cache.writeUInt32BE(f[2], g + 8), h._cache.writeUInt32BE(f[3], g + 12);
  }
  var y = h._cache.slice(0, n.length);
  return h._cache = h._cache.slice(n.length), e1(n, y);
};
const n1 = {
  cipher: "AES",
  key: 128,
  iv: 16,
  mode: "CBC",
  type: "block"
}, f1 = {
  cipher: "AES",
  key: 192,
  iv: 16,
  mode: "CBC",
  type: "block"
}, a1 = {
  cipher: "AES",
  key: 256,
  iv: 16,
  mode: "CBC",
  type: "block"
}, Bs = {
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
  aes128: n1,
  aes192: f1,
  aes256: a1,
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
var h1 = {
  ECB: S0,
  CBC: A0,
  CFB: Ms,
  CFB8: xs,
  CFB1: _s,
  OFB: Ss,
  CTR: a0,
  GCM: a0
}, yn = Bs;
for (var _a in yn)
  yn[_a].module = h1[yn[_a].mode];
var k0 = yn, ji = {}, An = Ot.Buffer;
function R0(h) {
  An.isBuffer(h) || (h = An.from(h));
  for (var n = h.length / 4 | 0, o = new Array(n), s = 0; s < n; s++)
    o[s] = h.readUInt32BE(s * 4);
  return o;
}
function bf(h) {
  for (var n = 0; n < h.length; h++)
    h[n] = 0;
}
function Es(h, n, o, s, m) {
  for (var f = o[0], g = o[1], y = o[2], S = o[3], B = h[0] ^ n[0], M = h[1] ^ n[1], x = h[2] ^ n[2], k = h[3] ^ n[3], I, D, L, W, z = 4, N = 1; N < m; N++)
    I = f[B >>> 24] ^ g[M >>> 16 & 255] ^ y[x >>> 8 & 255] ^ S[k & 255] ^ n[z++], D = f[M >>> 24] ^ g[x >>> 16 & 255] ^ y[k >>> 8 & 255] ^ S[B & 255] ^ n[z++], L = f[x >>> 24] ^ g[k >>> 16 & 255] ^ y[B >>> 8 & 255] ^ S[M & 255] ^ n[z++], W = f[k >>> 24] ^ g[B >>> 16 & 255] ^ y[M >>> 8 & 255] ^ S[x & 255] ^ n[z++], B = I, M = D, x = L, k = W;
  return I = (s[B >>> 24] << 24 | s[M >>> 16 & 255] << 16 | s[x >>> 8 & 255] << 8 | s[k & 255]) ^ n[z++], D = (s[M >>> 24] << 24 | s[x >>> 16 & 255] << 16 | s[k >>> 8 & 255] << 8 | s[B & 255]) ^ n[z++], L = (s[x >>> 24] << 24 | s[k >>> 16 & 255] << 16 | s[B >>> 8 & 255] << 8 | s[M & 255]) ^ n[z++], W = (s[k >>> 24] << 24 | s[B >>> 16 & 255] << 16 | s[M >>> 8 & 255] << 8 | s[x & 255]) ^ n[z++], I = I >>> 0, D = D >>> 0, L = L >>> 0, W = W >>> 0, [I, D, L, W];
}
var s1 = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], be = function() {
  for (var h = new Array(256), n = 0; n < 256; n++)
    n < 128 ? h[n] = n << 1 : h[n] = n << 1 ^ 283;
  for (var o = [], s = [], m = [[], [], [], []], f = [[], [], [], []], g = 0, y = 0, S = 0; S < 256; ++S) {
    var B = y ^ y << 1 ^ y << 2 ^ y << 3 ^ y << 4;
    B = B >>> 8 ^ B & 255 ^ 99, o[g] = B, s[B] = g;
    var M = h[g], x = h[M], k = h[x], I = h[B] * 257 ^ B * 16843008;
    m[0][g] = I << 24 | I >>> 8, m[1][g] = I << 16 | I >>> 16, m[2][g] = I << 8 | I >>> 24, m[3][g] = I, I = k * 16843009 ^ x * 65537 ^ M * 257 ^ g * 16843008, f[0][B] = I << 24 | I >>> 8, f[1][B] = I << 16 | I >>> 16, f[2][B] = I << 8 | I >>> 24, f[3][B] = I, g === 0 ? g = y = 1 : (g = M ^ h[h[h[k ^ M]]], y ^= h[h[y]]);
  }
  return {
    SBOX: o,
    INV_SBOX: s,
    SUB_MIX: m,
    INV_SUB_MIX: f
  };
}();
function Ze(h) {
  this._key = R0(h), this._reset();
}
Ze.blockSize = 4 * 4;
Ze.keySize = 256 / 8;
Ze.prototype.blockSize = Ze.blockSize;
Ze.prototype.keySize = Ze.keySize;
Ze.prototype._reset = function() {
  for (var h = this._key, n = h.length, o = n + 6, s = (o + 1) * 4, m = [], f = 0; f < n; f++)
    m[f] = h[f];
  for (f = n; f < s; f++) {
    var g = m[f - 1];
    f % n === 0 ? (g = g << 8 | g >>> 24, g = be.SBOX[g >>> 24] << 24 | be.SBOX[g >>> 16 & 255] << 16 | be.SBOX[g >>> 8 & 255] << 8 | be.SBOX[g & 255], g ^= s1[f / n | 0] << 24) : n > 6 && f % n === 4 && (g = be.SBOX[g >>> 24] << 24 | be.SBOX[g >>> 16 & 255] << 16 | be.SBOX[g >>> 8 & 255] << 8 | be.SBOX[g & 255]), m[f] = m[f - n] ^ g;
  }
  for (var y = [], S = 0; S < s; S++) {
    var B = s - S, M = m[B - (S % 4 ? 0 : 4)];
    S < 4 || B <= 4 ? y[S] = M : y[S] = be.INV_SUB_MIX[0][be.SBOX[M >>> 24]] ^ be.INV_SUB_MIX[1][be.SBOX[M >>> 16 & 255]] ^ be.INV_SUB_MIX[2][be.SBOX[M >>> 8 & 255]] ^ be.INV_SUB_MIX[3][be.SBOX[M & 255]];
  }
  this._nRounds = o, this._keySchedule = m, this._invKeySchedule = y;
};
Ze.prototype.encryptBlockRaw = function(h) {
  return h = R0(h), Es(h, this._keySchedule, be.SUB_MIX, be.SBOX, this._nRounds);
};
Ze.prototype.encryptBlock = function(h) {
  var n = this.encryptBlockRaw(h), o = An.allocUnsafe(16);
  return o.writeUInt32BE(n[0], 0), o.writeUInt32BE(n[1], 4), o.writeUInt32BE(n[2], 8), o.writeUInt32BE(n[3], 12), o;
};
Ze.prototype.decryptBlock = function(h) {
  h = R0(h);
  var n = h[1];
  h[1] = h[3], h[3] = n;
  var o = Es(h, this._invKeySchedule, be.INV_SUB_MIX, be.INV_SBOX, this._nRounds), s = An.allocUnsafe(16);
  return s.writeUInt32BE(o[0], 0), s.writeUInt32BE(o[3], 4), s.writeUInt32BE(o[2], 8), s.writeUInt32BE(o[1], 12), s;
};
Ze.prototype.scrub = function() {
  bf(this._keySchedule), bf(this._invKeySchedule), bf(this._key);
};
ji.AES = Ze;
var oi = Ot.Buffer, o1 = oi.alloc(16, 0);
function u1(h) {
  return [
    h.readUInt32BE(0),
    h.readUInt32BE(4),
    h.readUInt32BE(8),
    h.readUInt32BE(12)
  ];
}
function Is(h) {
  var n = oi.allocUnsafe(16);
  return n.writeUInt32BE(h[0] >>> 0, 0), n.writeUInt32BE(h[1] >>> 0, 4), n.writeUInt32BE(h[2] >>> 0, 8), n.writeUInt32BE(h[3] >>> 0, 12), n;
}
function Qi(h) {
  this.h = h, this.state = oi.alloc(16, 0), this.cache = oi.allocUnsafe(0);
}
Qi.prototype.ghash = function(h) {
  for (var n = -1; ++n < h.length; )
    this.state[n] ^= h[n];
  this._multiply();
};
Qi.prototype._multiply = function() {
  for (var h = u1(this.h), n = [0, 0, 0, 0], o, s, m, f = -1; ++f < 128; ) {
    for (s = (this.state[~~(f / 8)] & 1 << 7 - f % 8) !== 0, s && (n[0] ^= h[0], n[1] ^= h[1], n[2] ^= h[2], n[3] ^= h[3]), m = (h[3] & 1) !== 0, o = 3; o > 0; o--)
      h[o] = h[o] >>> 1 | (h[o - 1] & 1) << 31;
    h[0] = h[0] >>> 1, m && (h[0] = h[0] ^ 225 << 24);
  }
  this.state = Is(n);
};
Qi.prototype.update = function(h) {
  this.cache = oi.concat([this.cache, h]);
  for (var n; this.cache.length >= 16; )
    n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(n);
};
Qi.prototype.final = function(h, n) {
  return this.cache.length && this.ghash(oi.concat([this.cache, o1], 16)), this.ghash(Is([0, h, 0, n])), this.state;
};
var l1 = Qi, d1 = ji, Fe = Ot.Buffer, ks = Nr, c1 = Jt, Rs = l1, v1 = Xi, p1 = As;
function m1(h, n) {
  var o = 0;
  h.length !== n.length && o++;
  for (var s = Math.min(h.length, n.length), m = 0; m < s; ++m)
    o += h[m] ^ n[m];
  return o;
}
function g1(h, n, o) {
  if (n.length === 12)
    return h._finID = Fe.concat([n, Fe.from([0, 0, 0, 1])]), Fe.concat([n, Fe.from([0, 0, 0, 2])]);
  var s = new Rs(o), m = n.length, f = m % 16;
  s.update(n), f && (f = 16 - f, s.update(Fe.alloc(f, 0))), s.update(Fe.alloc(8, 0));
  var g = m * 8, y = Fe.alloc(8);
  y.writeUIntBE(g, 0, 8), s.update(y), h._finID = s.state;
  var S = Fe.from(h._finID);
  return p1(S), S;
}
function ei(h, n, o, s) {
  ks.call(this);
  var m = Fe.alloc(4, 0);
  this._cipher = new d1.AES(n);
  var f = this._cipher.encryptBlock(m);
  this._ghash = new Rs(f), o = g1(this, o, f), this._prev = Fe.from(o), this._cache = Fe.allocUnsafe(0), this._secCache = Fe.allocUnsafe(0), this._decrypt = s, this._alen = 0, this._len = 0, this._mode = h, this._authTag = null, this._called = !1;
}
c1(ei, ks);
ei.prototype._update = function(h) {
  if (!this._called && this._alen) {
    var n = 16 - this._alen % 16;
    n < 16 && (n = Fe.alloc(n, 0), this._ghash.update(n));
  }
  this._called = !0;
  var o = this._mode.encrypt(this, h);
  return this._decrypt ? this._ghash.update(h) : this._ghash.update(o), this._len += h.length, o;
};
ei.prototype._final = function() {
  if (this._decrypt && !this._authTag)
    throw new Error("Unsupported state or unable to authenticate data");
  var h = v1(this._ghash.final(this._alen * 8, this._len * 8), this._cipher.encryptBlock(this._finID));
  if (this._decrypt && m1(h, this._authTag))
    throw new Error("Unsupported state or unable to authenticate data");
  this._authTag = h, this._cipher.scrub();
};
ei.prototype.getAuthTag = function() {
  if (this._decrypt || !Fe.isBuffer(this._authTag))
    throw new Error("Attempting to get auth tag in unsupported state");
  return this._authTag;
};
ei.prototype.setAuthTag = function(n) {
  if (!this._decrypt)
    throw new Error("Attempting to set auth tag in unsupported state");
  this._authTag = n;
};
ei.prototype.setAAD = function(n) {
  if (this._called)
    throw new Error("Attempting to set AAD in unsupported state");
  this._ghash.update(n), this._alen += n.length;
};
var Ts = ei, b1 = ji, yf = Ot.Buffer, Cs = Nr, y1 = Jt;
function Hn(h, n, o, s) {
  Cs.call(this), this._cipher = new b1.AES(n), this._prev = yf.from(o), this._cache = yf.allocUnsafe(0), this._secCache = yf.allocUnsafe(0), this._decrypt = s, this._mode = h;
}
y1(Hn, Cs);
Hn.prototype._update = function(h) {
  return this._mode.encrypt(this, h, this._decrypt);
};
Hn.prototype._final = function() {
  this._cipher.scrub();
};
var qs = Hn, Or = Ot.Buffer, w1 = b0;
function M1(h, n, o, s) {
  if (Or.isBuffer(h) || (h = Or.from(h, "binary")), n && (Or.isBuffer(n) || (n = Or.from(n, "binary")), n.length !== 8))
    throw new RangeError("salt should be Buffer with 8 byte length");
  for (var m = o / 8, f = Or.alloc(m), g = Or.alloc(s || 0), y = Or.alloc(0); m > 0 || s > 0; ) {
    var S = new w1();
    S.update(y), S.update(h), n && S.update(n), y = S.digest();
    var B = 0;
    if (m > 0) {
      var M = f.length - m;
      B = Math.min(m, y.length), y.copy(f, M, 0, B), m -= B;
    }
    if (B < y.length && s > 0) {
      var x = g.length - s, k = Math.min(s, y.length - B);
      y.copy(g, x, B, B + k), s -= k;
    }
  }
  return y.fill(0), { key: f, iv: g };
}
var Zn = M1, Fs = k0, x1 = Ts, Ar = Ot.Buffer, _1 = qs, Ps = Nr, S1 = ji, A1 = Zn, B1 = Jt;
function tn(h, n, o) {
  Ps.call(this), this._cache = new Wn(), this._cipher = new S1.AES(n), this._prev = Ar.from(o), this._mode = h, this._autopadding = !0;
}
B1(tn, Ps);
tn.prototype._update = function(h) {
  this._cache.add(h);
  for (var n, o, s = []; n = this._cache.get(); )
    o = this._mode.encrypt(this, n), s.push(o);
  return Ar.concat(s);
};
var E1 = Ar.alloc(16, 16);
tn.prototype._final = function() {
  var h = this._cache.flush();
  if (this._autopadding)
    return h = this._mode.encrypt(this, h), this._cipher.scrub(), h;
  if (!h.equals(E1))
    throw this._cipher.scrub(), new Error("data not multiple of block length");
};
tn.prototype.setAutoPadding = function(h) {
  return this._autopadding = !!h, this;
};
function Wn() {
  this.cache = Ar.allocUnsafe(0);
}
Wn.prototype.add = function(h) {
  this.cache = Ar.concat([this.cache, h]);
};
Wn.prototype.get = function() {
  if (this.cache.length > 15) {
    var h = this.cache.slice(0, 16);
    return this.cache = this.cache.slice(16), h;
  }
  return null;
};
Wn.prototype.flush = function() {
  for (var h = 16 - this.cache.length, n = Ar.allocUnsafe(h), o = -1; ++o < h; )
    n.writeUInt8(h, o);
  return Ar.concat([this.cache, n]);
};
function Ds(h, n, o) {
  var s = Fs[h.toLowerCase()];
  if (!s)
    throw new TypeError("invalid suite type");
  if (typeof n == "string" && (n = Ar.from(n)), n.length !== s.key / 8)
    throw new TypeError("invalid key length " + n.length);
  if (typeof o == "string" && (o = Ar.from(o)), s.mode !== "GCM" && o.length !== s.iv)
    throw new TypeError("invalid iv length " + o.length);
  return s.type === "stream" ? new _1(s.module, n, o) : s.type === "auth" ? new x1(s.module, n, o) : new tn(s.module, n, o);
}
function I1(h, n) {
  var o = Fs[h.toLowerCase()];
  if (!o)
    throw new TypeError("invalid suite type");
  var s = A1(n, !1, o.key, o.iv);
  return Ds(h, s.key, s.iv);
}
_0.createCipheriv = Ds;
_0.createCipher = I1;
var T0 = {}, k1 = Ts, ui = Ot.Buffer, $s = k0, R1 = qs, Ns = Nr, T1 = ji, C1 = Zn, q1 = Jt;
function en(h, n, o) {
  Ns.call(this), this._cache = new Vn(), this._last = void 0, this._cipher = new T1.AES(n), this._prev = ui.from(o), this._mode = h, this._autopadding = !0;
}
q1(en, Ns);
en.prototype._update = function(h) {
  this._cache.add(h);
  for (var n, o, s = []; n = this._cache.get(this._autopadding); )
    o = this._mode.decrypt(this, n), s.push(o);
  return ui.concat(s);
};
en.prototype._final = function() {
  var h = this._cache.flush();
  if (this._autopadding)
    return F1(this._mode.decrypt(this, h));
  if (h)
    throw new Error("data not multiple of block length");
};
en.prototype.setAutoPadding = function(h) {
  return this._autopadding = !!h, this;
};
function Vn() {
  this.cache = ui.allocUnsafe(0);
}
Vn.prototype.add = function(h) {
  this.cache = ui.concat([this.cache, h]);
};
Vn.prototype.get = function(h) {
  var n;
  if (h) {
    if (this.cache.length > 16)
      return n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), n;
  } else if (this.cache.length >= 16)
    return n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), n;
  return null;
};
Vn.prototype.flush = function() {
  if (this.cache.length)
    return this.cache;
};
function F1(h) {
  var n = h[15];
  if (n < 1 || n > 16)
    throw new Error("unable to decrypt data");
  for (var o = -1; ++o < n; )
    if (h[o + (16 - n)] !== n)
      throw new Error("unable to decrypt data");
  if (n !== 16)
    return h.slice(0, 16 - n);
}
function Us(h, n, o) {
  var s = $s[h.toLowerCase()];
  if (!s)
    throw new TypeError("invalid suite type");
  if (typeof o == "string" && (o = ui.from(o)), s.mode !== "GCM" && o.length !== s.iv)
    throw new TypeError("invalid iv length " + o.length);
  if (typeof n == "string" && (n = ui.from(n)), n.length !== s.key / 8)
    throw new TypeError("invalid key length " + n.length);
  return s.type === "stream" ? new R1(s.module, n, o, !0) : s.type === "auth" ? new k1(s.module, n, o, !0) : new en(s.module, n, o);
}
function P1(h, n) {
  var o = $s[h.toLowerCase()];
  if (!o)
    throw new TypeError("invalid suite type");
  var s = C1(n, !1, o.key, o.iv);
  return Us(h, s.key, s.iv);
}
T0.createDecipher = P1;
T0.createDecipheriv = Us;
var Ls = _0, Os = T0, D1 = Bs;
function $1() {
  return Object.keys(D1);
}
Le.createCipher = Le.Cipher = Ls.createCipher;
Le.createCipheriv = Le.Cipheriv = Ls.createCipheriv;
Le.createDecipher = Le.Decipher = Os.createDecipher;
Le.createDecipheriv = Le.Decipheriv = Os.createDecipheriv;
Le.listCiphers = Le.getCiphers = $1;
var zs = {};
(function(h) {
  h["des-ecb"] = {
    key: 8,
    iv: 0
  }, h["des-cbc"] = h.des = {
    key: 8,
    iv: 8
  }, h["des-ede3-cbc"] = h.des3 = {
    key: 24,
    iv: 8
  }, h["des-ede3"] = {
    key: 24,
    iv: 0
  }, h["des-ede-cbc"] = {
    key: 16,
    iv: 8
  }, h["des-ede"] = {
    key: 16,
    iv: 0
  };
})(zs);
var Ks = mc, C0 = Le, Pr = k0, Sr = zs, Hs = Zn;
function N1(h, n) {
  h = h.toLowerCase();
  var o, s;
  if (Pr[h])
    o = Pr[h].key, s = Pr[h].iv;
  else if (Sr[h])
    o = Sr[h].key * 8, s = Sr[h].iv;
  else
    throw new TypeError("invalid suite type");
  var m = Hs(n, !1, o, s);
  return Zs(h, m.key, m.iv);
}
function U1(h, n) {
  h = h.toLowerCase();
  var o, s;
  if (Pr[h])
    o = Pr[h].key, s = Pr[h].iv;
  else if (Sr[h])
    o = Sr[h].key * 8, s = Sr[h].iv;
  else
    throw new TypeError("invalid suite type");
  var m = Hs(n, !1, o, s);
  return Ws(h, m.key, m.iv);
}
function Zs(h, n, o) {
  if (h = h.toLowerCase(), Pr[h])
    return C0.createCipheriv(h, n, o);
  if (Sr[h])
    return new Ks({ key: n, iv: o, mode: h });
  throw new TypeError("invalid suite type");
}
function Ws(h, n, o) {
  if (h = h.toLowerCase(), Pr[h])
    return C0.createDecipheriv(h, n, o);
  if (Sr[h])
    return new Ks({ key: n, iv: o, mode: h, decrypt: !0 });
  throw new TypeError("invalid suite type");
}
function L1() {
  return Object.keys(Sr).concat(C0.getCiphers());
}
Qe.createCipher = Qe.Cipher = N1;
Qe.createCipheriv = Qe.Cipheriv = Zs;
Qe.createDecipher = Qe.Decipher = U1;
Qe.createDecipheriv = Qe.Decipheriv = Ws;
Qe.listCiphers = Qe.getCiphers = L1;
var zr = {}, q0 = { exports: {} };
q0.exports;
(function(h) {
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
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Pe.Buffer;
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
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (a = t.length - 1, d = 0; a >= 0; a -= 3)
          c = t[a] | t[a - 1] << 8 | t[a - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (a = 0, d = 0; a < t.length; a += 3)
          c = t[a] | t[a + 1] << 8 | t[a + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (a = u % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var a = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        a *= i, v >= 49 ? a += v - 49 + 10 : v >= 17 ? a += v - 17 + 10 : a += v;
      }
      return a;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var a = 0, d = 1; d <= 67108863; d *= r)
        a++;
      a--, d = d / r | 0;
      for (var c = t.length - i, v = c % a, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += a)
        e = B(t, l, l + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    ], k = [
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
        for (var a = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = k[t];
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
      var a = this.byteLength(), d = i || Math.max(1, a);
      s(a <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
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
    function I(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, a = r % 26;
        t[r] = (p.words[i] & 1 << a) >>> a;
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
      for (var a = 0; a < i.length; a++)
        this.words[a] = r.words[a] ^ i.words[a];
      if (this !== r)
        for (; a < r.length; a++)
          this.words[a] = r.words[a];
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
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, a = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << a : this.words[i] = this.words[i] & ~(1 << a), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, a;
      this.length > t.length ? (i = this, a = t) : (i = t, a = this);
      for (var d = 0, c = 0; c < a.length; c++)
        r = (i.words[c] | 0) + (a.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
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
      var a, d;
      i > 0 ? (a = this, d = t) : (a = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (a.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < a.length; v++)
        r = (a.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < a.length && a !== this)
        for (; v < a.length; v++)
          this.words[v] = a.words[v];
      return this.length = Math.max(this.length, v), a !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var F = e - C | 0;
          a = p.words[F] | 0, d = t.words[C] | 0, c = a * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var L = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = a[0] | 0, _ = b & 8191, C = b >>> 13, F = a[1] | 0, O = F & 8191, R = F >>> 13, P = a[2] | 0, $ = P & 8191, K = P >>> 13, It = a[3] | 0, Z = It & 8191, J = It >>> 13, qt = a[4] | 0, tt = qt & 8191, vt = qt >>> 13, Dt = a[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = a[6] | 0, j = Pt & 8191, dt = Pt >>> 13, Ft = a[7] | 0, Q = Ft & 8191, ct = Ft >>> 13, Lt = a[8] | 0, E = Lt & 8191, w = Lt >>> 13, A = a[9] | 0, T = A & 8191, q = A >>> 13, V = d[0] | 0, U = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, zt = d[3] | 0, nt = zt & 8191, bt = zt >>> 13, Kt = d[4] | 0, ft = Kt & 8191, yt = Kt >>> 13, Ht = d[5] | 0, at = Ht & 8191, wt = Ht >>> 13, Zt = d[6] | 0, ht = Zt & 8191, Mt = Zt >>> 13, Wt = d[7] | 0, st = Wt & 8191, xt = Wt >>> 13, Vt = d[8] | 0, ot = Vt & 8191, _t = Vt >>> 13, Yt = d[9] | 0, ut = Yt & 8191, St = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, U), e = Math.imul(_, X), e = e + Math.imul(C, U) | 0, l = Math.imul(C, X);
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(O, U), e = Math.imul(O, X), e = e + Math.imul(R, U) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul($, U), e = Math.imul($, X), e = e + Math.imul(K, U) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var jt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, u = Math.imul(Z, U), e = Math.imul(Z, X), e = e + Math.imul(J, U) | 0, l = Math.imul(J, X), u = u + Math.imul($, G) | 0, e = e + Math.imul($, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(tt, U), e = Math.imul(tt, X), e = e + Math.imul(vt, U) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul($, it) | 0, e = e + Math.imul($, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(et, U), e = Math.imul(et, X), e = e + Math.imul(pt, U) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul($, nt) | 0, e = e + Math.imul($, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(j, U), e = Math.imul(j, X), e = e + Math.imul(dt, U) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul($, ft) | 0, e = e + Math.imul($, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(Q, U), e = Math.imul(Q, X), e = e + Math.imul(ct, U) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul($, at) | 0, e = e + Math.imul($, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(E, U), e = Math.imul(E, X), e = e + Math.imul(w, U) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul($, ht) | 0, e = e + Math.imul($, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(T, U), e = Math.imul(T, X), e = e + Math.imul(q, U) | 0, l = Math.imul(q, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul($, st) | 0, e = e + Math.imul($, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(q, G) | 0, l = Math.imul(q, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul($, ot) | 0, e = e + Math.imul($, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(q, it) | 0, l = Math.imul(q, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul($, ut) | 0, e = e + Math.imul($, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(q, nt) | 0, l = Math.imul(q, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(q, ft) | 0, l = Math.imul(q, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(q, at) | 0, l = Math.imul(q, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(q, ht) | 0, l = Math.imul(q, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(q, st) | 0, l = Math.imul(q, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(q, ot) | 0, l = Math.imul(q, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(q, ut) | 0, l = Math.imul(q, St);
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = $t, c[1] = Nt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (L = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, F = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, F = F + v | 0, v = F & 67108863, c = c + (F >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new N();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = L(this, t, r) : a < 63 ? i = D(this, t, r) : a < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function N(p, t) {
      this.x = p, this.y = t;
    }
    N.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, N.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, N.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, N.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, F = 0; F < v; F++) {
            var O = i[b + F], R = a[b + F], P = i[b + F + v], $ = a[b + F + v], K = _ * P - C * $;
            $ = _ * $ + C * P, P = K, i[b + F] = O + P, a[b + F] = R + $, i[b + F + v] = O - P, a[b + F + v] = R - $, F !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, N.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, N.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, N.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, N.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, N.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, N.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), u = new Array(a), e = new Array(a), l = new Array(a), b = new Array(a), _ = new Array(a), C = i.words;
      C.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, l, a), this.transform(v, c, u, e, a, d), this.transform(l, c, b, _, a, d);
      for (var F = 0; F < a; F++) {
        var O = u[F] * b[F] - e[F] * _[F];
        e[F] = u[F] * _[F] + e[F] * b[F], u[F] = O;
      }
      return this.conjugate(u, e, a), this.transform(u, e, C, c, a, d), this.conjugate(C, c, a), this.normalize13b(C, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
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
        var a = (this.words[i] | 0) * t, d = (a & 67108863) + (r & 67108863);
        r >>= 26, r += a / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = I(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, u = (this.words[d] | 0) - v << r;
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
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (a -= c, a = Math.max(0, a), u) {
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
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= a); e--) {
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
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
      var a = t.length + i, d;
      this._expand(a);
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
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var u = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = a.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (a = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (a.words[d.length + _] | 0) * 67108864 + (a.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), a._ishlnsubmul(d, C, _); a.negative !== 0; )
          C--, a.negative = 0, a._ishlnsubmul(d, 1, _), a.isZero() || (a.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var a, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (a = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: a,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (a = c.div.neg()), {
        div: a,
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
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, a = t.ushrn(1), d = t.andln(1), c = i.cmp(a);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(l)), a.iushrn(1), d.iushrn(1);
        for (var C = 0, F = 1; !(i.words[0] & F) && C < 26; ++C, F <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
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
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var b;
      return r.cmpn(1) === 0 ? b = a : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var a = 0; r.isEven() && i.isEven(); a++)
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
      return i.iushln(a);
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= a, this;
      for (var d = a, c = i; d !== 0 && c < this.length; c++) {
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
        var a = this.words[0] | 0;
        i = a === t ? 0 : a < t ? -1 : 1;
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
        var a = this.words[i] | 0, d = t.words[i] | 0;
        if (a !== d) {
          a < d ? r = -1 : a > d && (r = 1);
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
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
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
      for (var i = 4194303, a = Math.min(t.length, 9), d = 0; d < a; d++)
        r.words[d] = t.words[d];
      if (r.length = a, t.length <= 9) {
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
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
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
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
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
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      s(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, a), b = this.pow(t, a.addn(1).iushrn(1)), _ = this.pow(t, a), C = d; _.cmp(c) !== 0; ) {
        for (var F = _, O = 0; F.cmp(c) !== 0; O++)
          F = F.redSqr();
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
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== a[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, a[v]), u = 0, v = 0);
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
      return new kt(t);
    };
    function kt(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(kt, Y), kt.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, kt.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, kt.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(q0);
var Vs = q0.exports, F0 = { exports: {} };
F0.exports;
(function(h) {
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
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Pe.Buffer;
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
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (a = t.length - 1, d = 0; a >= 0; a -= 3)
          c = t[a] | t[a - 1] << 8 | t[a - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (a = 0, d = 0; a < t.length; a += 3)
          c = t[a] | t[a + 1] << 8 | t[a + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (a = u % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var a = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        a *= i, v >= 49 ? a += v - 49 + 10 : v >= 17 ? a += v - 17 + 10 : a += v;
      }
      return a;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var a = 0, d = 1; d <= 67108863; d *= r)
        a++;
      a--, d = d / r | 0;
      for (var c = t.length - i, v = c % a, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += a)
        e = B(t, l, l + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    ], k = [
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
        for (var a = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = k[t];
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
      var a = this.byteLength(), d = i || Math.max(1, a);
      s(a <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
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
    function I(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, a = r % 26;
        t[r] = (p.words[i] & 1 << a) >>> a;
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
      for (var a = 0; a < i.length; a++)
        this.words[a] = r.words[a] ^ i.words[a];
      if (this !== r)
        for (; a < r.length; a++)
          this.words[a] = r.words[a];
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
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, a = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << a : this.words[i] = this.words[i] & ~(1 << a), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, a;
      this.length > t.length ? (i = this, a = t) : (i = t, a = this);
      for (var d = 0, c = 0; c < a.length; c++)
        r = (i.words[c] | 0) + (a.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
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
      var a, d;
      i > 0 ? (a = this, d = t) : (a = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (a.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < a.length; v++)
        r = (a.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < a.length && a !== this)
        for (; v < a.length; v++)
          this.words[v] = a.words[v];
      return this.length = Math.max(this.length, v), a !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var F = e - C | 0;
          a = p.words[F] | 0, d = t.words[C] | 0, c = a * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var L = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = a[0] | 0, _ = b & 8191, C = b >>> 13, F = a[1] | 0, O = F & 8191, R = F >>> 13, P = a[2] | 0, $ = P & 8191, K = P >>> 13, It = a[3] | 0, Z = It & 8191, J = It >>> 13, qt = a[4] | 0, tt = qt & 8191, vt = qt >>> 13, Dt = a[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = a[6] | 0, j = Pt & 8191, dt = Pt >>> 13, Ft = a[7] | 0, Q = Ft & 8191, ct = Ft >>> 13, Lt = a[8] | 0, E = Lt & 8191, w = Lt >>> 13, A = a[9] | 0, T = A & 8191, q = A >>> 13, V = d[0] | 0, U = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, zt = d[3] | 0, nt = zt & 8191, bt = zt >>> 13, Kt = d[4] | 0, ft = Kt & 8191, yt = Kt >>> 13, Ht = d[5] | 0, at = Ht & 8191, wt = Ht >>> 13, Zt = d[6] | 0, ht = Zt & 8191, Mt = Zt >>> 13, Wt = d[7] | 0, st = Wt & 8191, xt = Wt >>> 13, Vt = d[8] | 0, ot = Vt & 8191, _t = Vt >>> 13, Yt = d[9] | 0, ut = Yt & 8191, St = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, U), e = Math.imul(_, X), e = e + Math.imul(C, U) | 0, l = Math.imul(C, X);
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(O, U), e = Math.imul(O, X), e = e + Math.imul(R, U) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul($, U), e = Math.imul($, X), e = e + Math.imul(K, U) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var jt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, u = Math.imul(Z, U), e = Math.imul(Z, X), e = e + Math.imul(J, U) | 0, l = Math.imul(J, X), u = u + Math.imul($, G) | 0, e = e + Math.imul($, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(tt, U), e = Math.imul(tt, X), e = e + Math.imul(vt, U) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul($, it) | 0, e = e + Math.imul($, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(et, U), e = Math.imul(et, X), e = e + Math.imul(pt, U) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul($, nt) | 0, e = e + Math.imul($, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(j, U), e = Math.imul(j, X), e = e + Math.imul(dt, U) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul($, ft) | 0, e = e + Math.imul($, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(Q, U), e = Math.imul(Q, X), e = e + Math.imul(ct, U) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul($, at) | 0, e = e + Math.imul($, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(E, U), e = Math.imul(E, X), e = e + Math.imul(w, U) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul($, ht) | 0, e = e + Math.imul($, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(T, U), e = Math.imul(T, X), e = e + Math.imul(q, U) | 0, l = Math.imul(q, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul($, st) | 0, e = e + Math.imul($, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(q, G) | 0, l = Math.imul(q, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul($, ot) | 0, e = e + Math.imul($, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(q, it) | 0, l = Math.imul(q, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul($, ut) | 0, e = e + Math.imul($, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(q, nt) | 0, l = Math.imul(q, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(q, ft) | 0, l = Math.imul(q, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(q, at) | 0, l = Math.imul(q, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(q, ht) | 0, l = Math.imul(q, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(q, st) | 0, l = Math.imul(q, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(q, ot) | 0, l = Math.imul(q, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(q, ut) | 0, l = Math.imul(q, St);
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = $t, c[1] = Nt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (L = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, F = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, F = F + v | 0, v = F & 67108863, c = c + (F >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new N();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = L(this, t, r) : a < 63 ? i = D(this, t, r) : a < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function N(p, t) {
      this.x = p, this.y = t;
    }
    N.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, N.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, N.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, N.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, F = 0; F < v; F++) {
            var O = i[b + F], R = a[b + F], P = i[b + F + v], $ = a[b + F + v], K = _ * P - C * $;
            $ = _ * $ + C * P, P = K, i[b + F] = O + P, a[b + F] = R + $, i[b + F + v] = O - P, a[b + F + v] = R - $, F !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, N.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, N.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, N.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, N.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, N.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, N.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), u = new Array(a), e = new Array(a), l = new Array(a), b = new Array(a), _ = new Array(a), C = i.words;
      C.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, l, a), this.transform(v, c, u, e, a, d), this.transform(l, c, b, _, a, d);
      for (var F = 0; F < a; F++) {
        var O = u[F] * b[F] - e[F] * _[F];
        e[F] = u[F] * _[F] + e[F] * b[F], u[F] = O;
      }
      return this.conjugate(u, e, a), this.transform(u, e, C, c, a, d), this.conjugate(C, c, a), this.normalize13b(C, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
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
        var a = (this.words[i] | 0) * t, d = (a & 67108863) + (r & 67108863);
        r >>= 26, r += a / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = I(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, u = (this.words[d] | 0) - v << r;
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
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (a -= c, a = Math.max(0, a), u) {
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
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= a); e--) {
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
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
      var a = t.length + i, d;
      this._expand(a);
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
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var u = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = a.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (a = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (a.words[d.length + _] | 0) * 67108864 + (a.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), a._ishlnsubmul(d, C, _); a.negative !== 0; )
          C--, a.negative = 0, a._ishlnsubmul(d, 1, _), a.isZero() || (a.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var a, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (a = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: a,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (a = c.div.neg()), {
        div: a,
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
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, a = t.ushrn(1), d = t.andln(1), c = i.cmp(a);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(l)), a.iushrn(1), d.iushrn(1);
        for (var C = 0, F = 1; !(i.words[0] & F) && C < 26; ++C, F <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
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
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var b;
      return r.cmpn(1) === 0 ? b = a : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var a = 0; r.isEven() && i.isEven(); a++)
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
      return i.iushln(a);
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= a, this;
      for (var d = a, c = i; d !== 0 && c < this.length; c++) {
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
        var a = this.words[0] | 0;
        i = a === t ? 0 : a < t ? -1 : 1;
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
        var a = this.words[i] | 0, d = t.words[i] | 0;
        if (a !== d) {
          a < d ? r = -1 : a > d && (r = 1);
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
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
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
      for (var i = 4194303, a = Math.min(t.length, 9), d = 0; d < a; d++)
        r.words[d] = t.words[d];
      if (r.length = a, t.length <= 9) {
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
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
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
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
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
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      s(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, a), b = this.pow(t, a.addn(1).iushrn(1)), _ = this.pow(t, a), C = d; _.cmp(c) !== 0; ) {
        for (var F = _, O = 0; F.cmp(c) !== 0; O++)
          F = F.redSqr();
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
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== a[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, a[v]), u = 0, v = 0);
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
      return new kt(t);
    };
    function kt(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(kt, Y), kt.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, kt.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, kt.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(F0);
var O1 = F0.exports, on = { exports: {} }, Sa;
function P0() {
  if (Sa)
    return on.exports;
  Sa = 1;
  var h;
  on.exports = function(m) {
    return h || (h = new n(null)), h.generate(m);
  };
  function n(s) {
    this.rand = s;
  }
  if (on.exports.Rand = n, n.prototype.generate = function(m) {
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
      var o = Yo();
      if (typeof o.randomBytes != "function")
        throw new Error("Not supported");
      n.prototype._rand = function(m) {
        return o.randomBytes(m);
      };
    } catch (s) {
    }
  return on.exports;
}
var wf, Aa;
function Ys() {
  if (Aa)
    return wf;
  Aa = 1;
  var h = O1, n = P0();
  function o(s) {
    this.rand = s || new n.Rand();
  }
  return wf = o, o.create = function(m) {
    return new o(m);
  }, o.prototype._randbelow = function(m) {
    var f = m.bitLength(), g = Math.ceil(f / 8);
    do
      var y = new h(this.rand.generate(g));
    while (y.cmp(m) >= 0);
    return y;
  }, o.prototype._randrange = function(m, f) {
    var g = f.sub(m);
    return m.add(this._randbelow(g));
  }, o.prototype.test = function(m, f, g) {
    var y = m.bitLength(), S = h.mont(m), B = new h(1).toRed(S);
    f || (f = Math.max(1, y / 48 | 0));
    for (var M = m.subn(1), x = 0; !M.testn(x); x++)
      ;
    for (var k = m.shrn(x), I = M.toRed(S), D = !0; f > 0; f--) {
      var L = this._randrange(new h(2), M);
      g && g(L);
      var W = L.toRed(S).redPow(k);
      if (!(W.cmp(B) === 0 || W.cmp(I) === 0)) {
        for (var z = 1; z < x; z++) {
          if (W = W.redSqr(), W.cmp(B) === 0)
            return !1;
          if (W.cmp(I) === 0)
            break;
        }
        if (z === x)
          return !1;
      }
    }
    return D;
  }, o.prototype.getDivisor = function(m, f) {
    var g = m.bitLength(), y = h.mont(m), S = new h(1).toRed(y);
    f || (f = Math.max(1, g / 48 | 0));
    for (var B = m.subn(1), M = 0; !B.testn(M); M++)
      ;
    for (var x = m.shrn(M), k = B.toRed(y); f > 0; f--) {
      var I = this._randrange(new h(2), B), D = m.gcd(I);
      if (D.cmpn(1) !== 0)
        return D;
      var L = I.toRed(y).redPow(x);
      if (!(L.cmp(S) === 0 || L.cmp(k) === 0)) {
        for (var W = 1; W < M; W++) {
          if (L = L.redSqr(), L.cmp(S) === 0)
            return L.fromRed().subn(1).gcd(m);
          if (L.cmp(k) === 0)
            break;
        }
        if (W === M)
          return L = L.redSqr(), L.fromRed().subn(1).gcd(m);
      }
    }
    return !1;
  }, wf;
}
var Mf, Ba;
function Js() {
  if (Ba)
    return Mf;
  Ba = 1;
  var h = gi;
  Mf = W, W.simpleSieve = D, W.fermatTest = L;
  var n = Vs, o = new n(24), s = Ys(), m = new s(), f = new n(1), g = new n(2), y = new n(5);
  new n(16), new n(8);
  var S = new n(10), B = new n(3);
  new n(7);
  var M = new n(11), x = new n(4);
  new n(12);
  var k = null;
  function I() {
    if (k !== null)
      return k;
    var z = 1048576, N = [];
    N[0] = 2;
    for (var lt = 1, H = 3; H < z; H += 2) {
      for (var At = Math.ceil(Math.sqrt(H)), Bt = 0; Bt < lt && N[Bt] <= At && H % N[Bt] !== 0; Bt++)
        ;
      lt !== Bt && N[Bt] <= At || (N[lt++] = H);
    }
    return k = N, N;
  }
  function D(z) {
    for (var N = I(), lt = 0; lt < N.length; lt++)
      if (z.modn(N[lt]) === 0)
        return z.cmpn(N[lt]) === 0;
    return !0;
  }
  function L(z) {
    var N = n.mont(z);
    return g.toRed(N).redPow(z.subn(1)).fromRed().cmpn(1) === 0;
  }
  function W(z, N) {
    if (z < 16)
      return N === 2 || N === 5 ? new n([140, 123]) : new n([140, 39]);
    N = new n(N);
    for (var lt, H; ; ) {
      for (lt = new n(h(Math.ceil(z / 8))); lt.bitLength() > z; )
        lt.ishrn(1);
      if (lt.isEven() && lt.iadd(f), lt.testn(1) || lt.iadd(g), N.cmp(g)) {
        if (!N.cmp(y))
          for (; lt.mod(S).cmp(B); )
            lt.iadd(x);
      } else
        for (; lt.mod(o).cmp(M); )
          lt.iadd(x);
      if (H = lt.shrn(1), D(H) && D(lt) && L(H) && L(lt) && m.test(H) && m.test(lt))
        return lt;
    }
  }
  return Mf;
}
const z1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
}, K1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
}, H1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
}, Z1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
}, W1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
}, V1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
}, Y1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
}, J1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
}, G1 = {
  modp1: z1,
  modp2: K1,
  modp5: H1,
  modp14: Z1,
  modp15: W1,
  modp16: V1,
  modp17: Y1,
  modp18: J1
};
var xf, Ea;
function X1() {
  if (Ea)
    return xf;
  Ea = 1;
  var h = Vs, n = Ys(), o = new n(), s = new h(24), m = new h(11), f = new h(10), g = new h(3), y = new h(7), S = Js(), B = gi;
  xf = D;
  function M(W, z) {
    return z = z || "utf8", mt.isBuffer(W) || (W = new mt(W, z)), this._pub = new h(W), this;
  }
  function x(W, z) {
    return z = z || "utf8", mt.isBuffer(W) || (W = new mt(W, z)), this._priv = new h(W), this;
  }
  var k = {};
  function I(W, z) {
    var N = z.toString("hex"), lt = [N, W.toString(16)].join("_");
    if (lt in k)
      return k[lt];
    var H = 0;
    if (W.isEven() || !S.simpleSieve || !S.fermatTest(W) || !o.test(W))
      return H += 1, N === "02" || N === "05" ? H += 8 : H += 4, k[lt] = H, H;
    o.test(W.shrn(1)) || (H += 2);
    var At;
    switch (N) {
      case "02":
        W.mod(s).cmp(m) && (H += 8);
        break;
      case "05":
        At = W.mod(f), At.cmp(g) && At.cmp(y) && (H += 8);
        break;
      default:
        H += 4;
    }
    return k[lt] = H, H;
  }
  function D(W, z, N) {
    this.setGenerator(z), this.__prime = new h(W), this._prime = h.mont(this.__prime), this._primeLen = W.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, N ? (this.setPublicKey = M, this.setPrivateKey = x) : this._primeCode = 8;
  }
  Object.defineProperty(D.prototype, "verifyError", {
    enumerable: !0,
    get: function() {
      return typeof this._primeCode != "number" && (this._primeCode = I(this.__prime, this.__gen)), this._primeCode;
    }
  }), D.prototype.generateKeys = function() {
    return this._priv || (this._priv = new h(B(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey();
  }, D.prototype.computeSecret = function(W) {
    W = new h(W), W = W.toRed(this._prime);
    var z = W.redPow(this._priv).fromRed(), N = new mt(z.toArray()), lt = this.getPrime();
    if (N.length < lt.length) {
      var H = new mt(lt.length - N.length);
      H.fill(0), N = mt.concat([H, N]);
    }
    return N;
  }, D.prototype.getPublicKey = function(z) {
    return L(this._pub, z);
  }, D.prototype.getPrivateKey = function(z) {
    return L(this._priv, z);
  }, D.prototype.getPrime = function(W) {
    return L(this.__prime, W);
  }, D.prototype.getGenerator = function(W) {
    return L(this._gen, W);
  }, D.prototype.setGenerator = function(W, z) {
    return z = z || "utf8", mt.isBuffer(W) || (W = new mt(W, z)), this.__gen = W, this._gen = new h(W), this;
  };
  function L(W, z) {
    var N = new mt(W.toArray());
    return z ? N.toString(z) : N;
  }
  return xf;
}
var Ia;
function j1() {
  if (Ia)
    return zr;
  Ia = 1;
  var h = Js(), n = G1, o = X1();
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
    return mt.isBuffer(y) || m[y] === void 0 ? f(g, "binary", y, S) : (y = y || "binary", B = B || "binary", S = S || new mt([2]), mt.isBuffer(S) || (S = new mt(S, B)), typeof g == "number" ? new o(h(g, S), S, !0) : (mt.isBuffer(g) || (g = new mt(g, y)), new o(g, S, !0)));
  }
  return zr.DiffieHellmanGroup = zr.createDiffieHellmanGroup = zr.getDiffieHellman = s, zr.createDiffieHellman = zr.DiffieHellman = f, zr;
}
var h0 = { exports: {} }, s0 = { exports: {} };
typeof ye == "undefined" || !ye.version || ye.version.indexOf("v0.") === 0 || ye.version.indexOf("v1.") === 0 && ye.version.indexOf("v1.8.") !== 0 ? s0.exports = { nextTick: Q1 } : s0.exports = ye;
function Q1(h, n, o, s) {
  if (typeof h != "function")
    throw new TypeError('"callback" argument must be a function');
  var m = arguments.length, f, g;
  switch (m) {
    case 0:
    case 1:
      return ye.nextTick(h);
    case 2:
      return ye.nextTick(function() {
        h.call(null, n);
      });
    case 3:
      return ye.nextTick(function() {
        h.call(null, n, o);
      });
    case 4:
      return ye.nextTick(function() {
        h.call(null, n, o, s);
      });
    default:
      for (f = new Array(m - 1), g = 0; g < f.length; )
        f[g++] = arguments[g];
      return ye.nextTick(function() {
        h.apply(null, f);
      });
  }
}
var Yn = s0.exports, tv = {}.toString, ev = Array.isArray || function(h) {
  return tv.call(h) == "[object Array]";
}, Gs = Pe.EventEmitter, o0 = { exports: {} };
(function(h, n) {
  var o = gr, s = o.Buffer;
  function m(g, y) {
    for (var S in g)
      y[S] = g[S];
  }
  s.from && s.alloc && s.allocUnsafe && s.allocUnsafeSlow ? h.exports = o : (m(o, n), n.Buffer = f);
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
})(o0, o0.exports);
var D0 = o0.exports, we = {};
function rv(h) {
  return Array.isArray ? Array.isArray(h) : Jn(h) === "[object Array]";
}
we.isArray = rv;
function iv(h) {
  return typeof h == "boolean";
}
we.isBoolean = iv;
function nv(h) {
  return h === null;
}
we.isNull = nv;
function fv(h) {
  return h == null;
}
we.isNullOrUndefined = fv;
function av(h) {
  return typeof h == "number";
}
we.isNumber = av;
function hv(h) {
  return typeof h == "string";
}
we.isString = hv;
function sv(h) {
  return typeof h == "symbol";
}
we.isSymbol = sv;
function ov(h) {
  return h === void 0;
}
we.isUndefined = ov;
function uv(h) {
  return Jn(h) === "[object RegExp]";
}
we.isRegExp = uv;
function lv(h) {
  return typeof h == "object" && h !== null;
}
we.isObject = lv;
function dv(h) {
  return Jn(h) === "[object Date]";
}
we.isDate = dv;
function cv(h) {
  return Jn(h) === "[object Error]" || h instanceof Error;
}
we.isError = cv;
function vv(h) {
  return typeof h == "function";
}
we.isFunction = vv;
function pv(h) {
  return h === null || typeof h == "boolean" || typeof h == "number" || typeof h == "string" || typeof h == "symbol" || // ES6 symbol
  typeof h == "undefined";
}
we.isPrimitive = pv;
we.isBuffer = gr.Buffer.isBuffer;
function Jn(h) {
  return Object.prototype.toString.call(h);
}
var _f = { exports: {} }, ka;
function mv() {
  return ka || (ka = 1, function(h) {
    function n(f, g) {
      if (!(f instanceof g))
        throw new TypeError("Cannot call a class as a function");
    }
    var o = D0.Buffer, s = Pe;
    function m(f, g, y) {
      f.copy(g, y);
    }
    h.exports = function() {
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
    }(), s && s.inspect && s.inspect.custom && (h.exports.prototype[s.inspect.custom] = function() {
      var f = s.inspect({ length: this.length });
      return this.constructor.name + " " + f;
    });
  }(_f)), _f.exports;
}
var un = Yn;
function gv(h, n) {
  var o = this, s = this._readableState && this._readableState.destroyed, m = this._writableState && this._writableState.destroyed;
  return s || m ? (n ? n(h) : h && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, un.nextTick(ln, this, h)) : un.nextTick(ln, this, h)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(h || null, function(f) {
    !n && f ? o._writableState ? o._writableState.errorEmitted || (o._writableState.errorEmitted = !0, un.nextTick(ln, o, f)) : un.nextTick(ln, o, f) : n && n(f);
  }), this);
}
function bv() {
  this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
}
function ln(h, n) {
  h.emit("error", n);
}
var Xs = {
  destroy: gv,
  undestroy: bv
}, yv = wv;
function wv(h, n) {
  if (Sf("noDeprecation"))
    return h;
  var o = !1;
  function s() {
    if (!o) {
      if (Sf("throwDeprecation"))
        throw new Error(n);
      Sf("traceDeprecation") ? console.trace(n) : console.warn(n), o = !0;
    }
    return h.apply(this, arguments);
  }
  return s;
}
function Sf(h) {
  try {
    if (!Gt.localStorage)
      return !1;
  } catch (o) {
    return !1;
  }
  var n = Gt.localStorage[h];
  return n == null ? !1 : String(n).toLowerCase() === "true";
}
var Af, Ra;
function js() {
  if (Ra)
    return Af;
  Ra = 1;
  var h = Yn;
  Af = L;
  function n(c) {
    var v = this;
    this.next = null, this.entry = null, this.finish = function() {
      d(v, c);
    };
  }
  var o = !ye.browser && ["v0.10", "v0.9."].indexOf(ye.version.slice(0, 5)) > -1 ? setImmediate : h.nextTick, s;
  L.WritableState = I;
  var m = Object.create(we);
  m.inherits = Jt;
  var f = {
    deprecate: yv
  }, g = Gs, y = D0.Buffer, S = (typeof Gt != "undefined" ? Gt : typeof window != "undefined" ? window : typeof self != "undefined" ? self : {}).Uint8Array || function() {
  };
  function B(c) {
    return y.from(c);
  }
  function M(c) {
    return y.isBuffer(c) || c instanceof S;
  }
  var x = Xs;
  m.inherits(L, g);
  function k() {
  }
  function I(c, v) {
    s = s || li(), c = c || {};
    var u = v instanceof s;
    this.objectMode = !!c.objectMode, u && (this.objectMode = this.objectMode || !!c.writableObjectMode);
    var e = c.highWaterMark, l = c.writableHighWaterMark, b = this.objectMode ? 16 : 16 * 1024;
    e || e === 0 ? this.highWaterMark = e : u && (l || l === 0) ? this.highWaterMark = l : this.highWaterMark = b, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var _ = c.decodeStrings === !1;
    this.decodeStrings = !_, this.defaultEncoding = c.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(C) {
      Ct(v, C);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new n(this);
  }
  I.prototype.getBuffer = function() {
    for (var v = this.bufferedRequest, u = []; v; )
      u.push(v), v = v.next;
    return u;
  }, function() {
    try {
      Object.defineProperty(I.prototype, "buffer", {
        get: f.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch (c) {
    }
  }();
  var D;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (D = Function.prototype[Symbol.hasInstance], Object.defineProperty(L, Symbol.hasInstance, {
    value: function(c) {
      return D.call(this, c) ? !0 : this !== L ? !1 : c && c._writableState instanceof I;
    }
  })) : D = function(c) {
    return c instanceof this;
  };
  function L(c) {
    if (s = s || li(), !D.call(L, this) && !(this instanceof s))
      return new L(c);
    this._writableState = new I(c, this), this.writable = !0, c && (typeof c.write == "function" && (this._write = c.write), typeof c.writev == "function" && (this._writev = c.writev), typeof c.destroy == "function" && (this._destroy = c.destroy), typeof c.final == "function" && (this._final = c.final)), g.call(this);
  }
  L.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function W(c, v) {
    var u = new Error("write after end");
    c.emit("error", u), h.nextTick(v, u);
  }
  function z(c, v, u, e) {
    var l = !0, b = !1;
    return u === null ? b = new TypeError("May not write null values to stream") : typeof u != "string" && u !== void 0 && !v.objectMode && (b = new TypeError("Invalid non-string/buffer chunk")), b && (c.emit("error", b), h.nextTick(e, b), l = !1), l;
  }
  L.prototype.write = function(c, v, u) {
    var e = this._writableState, l = !1, b = !e.objectMode && M(c);
    return b && !y.isBuffer(c) && (c = B(c)), typeof v == "function" && (u = v, v = null), b ? v = "buffer" : v || (v = e.defaultEncoding), typeof u != "function" && (u = k), e.ended ? W(this, u) : (b || z(this, e, c, u)) && (e.pendingcb++, l = lt(this, e, b, c, v, u)), l;
  }, L.prototype.cork = function() {
    var c = this._writableState;
    c.corked++;
  }, L.prototype.uncork = function() {
    var c = this._writableState;
    c.corked && (c.corked--, !c.writing && !c.corked && !c.bufferProcessing && c.bufferedRequest && kt(this, c));
  }, L.prototype.setDefaultEncoding = function(v) {
    if (typeof v == "string" && (v = v.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((v + "").toLowerCase()) > -1))
      throw new TypeError("Unknown encoding: " + v);
    return this._writableState.defaultEncoding = v, this;
  };
  function N(c, v, u) {
    return !c.objectMode && c.decodeStrings !== !1 && typeof v == "string" && (v = y.from(v, u)), v;
  }
  Object.defineProperty(L.prototype, "writableHighWaterMark", {
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
      var _ = N(v, e, l);
      e !== _ && (u = !0, l = "buffer", e = _);
    }
    var C = v.objectMode ? 1 : e.length;
    v.length += C;
    var F = v.length < v.highWaterMark;
    if (F || (v.needDrain = !0), v.writing || v.corked) {
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
    return F;
  }
  function H(c, v, u, e, l, b, _) {
    v.writelen = e, v.writecb = _, v.writing = !0, v.sync = !0, u ? c._writev(l, v.onwrite) : c._write(l, b, v.onwrite), v.sync = !1;
  }
  function At(c, v, u, e, l) {
    --v.pendingcb, u ? (h.nextTick(l, e), h.nextTick(i, c, v), c._writableState.errorEmitted = !0, c.emit("error", e)) : (l(e), c._writableState.errorEmitted = !0, c.emit("error", e), i(c, v));
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
      !b && !u.corked && !u.bufferProcessing && u.bufferedRequest && kt(c, u), e ? o(Et, c, u, b, l) : Et(c, u, b, l);
    }
  }
  function Et(c, v, u, e) {
    u || Y(c, v), v.pendingcb--, e(), i(c, v);
  }
  function Y(c, v) {
    v.length === 0 && v.needDrain && (v.needDrain = !1, c.emit("drain"));
  }
  function kt(c, v) {
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
        var F = u.chunk, O = u.encoding, R = u.callback, P = v.objectMode ? 1 : F.length;
        if (H(c, v, !1, P, F, O, R), u = u.next, v.bufferedRequestCount--, v.writing)
          break;
      }
      u === null && (v.lastBufferedRequest = null);
    }
    v.bufferedRequest = u, v.bufferProcessing = !1;
  }
  L.prototype._write = function(c, v, u) {
    u(new Error("_write() is not implemented"));
  }, L.prototype._writev = null, L.prototype.end = function(c, v, u) {
    var e = this._writableState;
    typeof c == "function" ? (u = c, c = null, v = null) : typeof v == "function" && (u = v, v = null), c != null && this.write(c, v), e.corked && (e.corked = 1, this.uncork()), e.ending || a(this, e, u);
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
    !v.prefinished && !v.finalCalled && (typeof c._final == "function" ? (v.pendingcb++, v.finalCalled = !0, h.nextTick(t, c, v)) : (v.prefinished = !0, c.emit("prefinish")));
  }
  function i(c, v) {
    var u = p(v);
    return u && (r(c, v), v.pendingcb === 0 && (v.finished = !0, c.emit("finish"))), u;
  }
  function a(c, v, u) {
    v.ending = !0, i(c, v), u && (v.finished ? h.nextTick(u) : c.once("finish", u)), v.ended = !0, c.writable = !1;
  }
  function d(c, v, u) {
    var e = c.entry;
    for (c.entry = null; e; ) {
      var l = e.callback;
      v.pendingcb--, l(u), e = e.next;
    }
    v.corkedRequestsFree.next = c;
  }
  return Object.defineProperty(L.prototype, "destroyed", {
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(c) {
      this._writableState && (this._writableState.destroyed = c);
    }
  }), L.prototype.destroy = x.destroy, L.prototype._undestroy = x.undestroy, L.prototype._destroy = function(c, v) {
    this.end(), v(c);
  }, Af;
}
var Bf, Ta;
function li() {
  if (Ta)
    return Bf;
  Ta = 1;
  var h = Yn, n = Object.keys || function(x) {
    var k = [];
    for (var I in x)
      k.push(I);
    return k;
  };
  Bf = S;
  var o = Object.create(we);
  o.inherits = Jt;
  var s = Qs(), m = js();
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
    this.allowHalfOpen || this._writableState.ended || h.nextTick(M, this);
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
  }), S.prototype._destroy = function(x, k) {
    this.push(null), this.end(), h.nextTick(k, x);
  }, Bf;
}
var Ef, Ca;
function Qs() {
  if (Ca)
    return Ef;
  Ca = 1;
  var h = Yn;
  Ef = N;
  var n = ev, o;
  N.ReadableState = z, Pe.EventEmitter;
  var s = function(R, P) {
    return R.listeners(P).length;
  }, m = Gs, f = D0.Buffer, g = (typeof Gt != "undefined" ? Gt : typeof window != "undefined" ? window : typeof self != "undefined" ? self : {}).Uint8Array || function() {
  };
  function y(R) {
    return f.from(R);
  }
  function S(R) {
    return f.isBuffer(R) || R instanceof g;
  }
  var B = Object.create(we);
  B.inherits = Jt;
  var M = Pe, x = void 0;
  M && M.debuglog ? x = M.debuglog("stream") : x = function() {
  };
  var k = mv(), I = Xs, D;
  B.inherits(N, m);
  var L = ["error", "close", "destroy", "pause", "resume"];
  function W(R, P, $) {
    if (typeof R.prependListener == "function")
      return R.prependListener(P, $);
    !R._events || !R._events[P] ? R.on(P, $) : n(R._events[P]) ? R._events[P].unshift($) : R._events[P] = [$, R._events[P]];
  }
  function z(R, P) {
    o = o || li(), R = R || {};
    var $ = P instanceof o;
    this.objectMode = !!R.objectMode, $ && (this.objectMode = this.objectMode || !!R.readableObjectMode);
    var K = R.highWaterMark, It = R.readableHighWaterMark, Z = this.objectMode ? 16 : 16 * 1024;
    K || K === 0 ? this.highWaterMark = K : $ && (It || It === 0) ? this.highWaterMark = It : this.highWaterMark = Z, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new k(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = R.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, R.encoding && (D || (D = Mn.StringDecoder), this.decoder = new D(R.encoding), this.encoding = R.encoding);
  }
  function N(R) {
    if (o = o || li(), !(this instanceof N))
      return new N(R);
    this._readableState = new z(R, this), this.readable = !0, R && (typeof R.read == "function" && (this._read = R.read), typeof R.destroy == "function" && (this._destroy = R.destroy)), m.call(this);
  }
  Object.defineProperty(N.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(R) {
      this._readableState && (this._readableState.destroyed = R);
    }
  }), N.prototype.destroy = I.destroy, N.prototype._undestroy = I.undestroy, N.prototype._destroy = function(R, P) {
    this.push(null), P(R);
  }, N.prototype.push = function(R, P) {
    var $ = this._readableState, K;
    return $.objectMode ? K = !0 : typeof R == "string" && (P = P || $.defaultEncoding, P !== $.encoding && (R = f.from(R, P), P = ""), K = !0), lt(this, R, P, !1, K);
  }, N.prototype.unshift = function(R) {
    return lt(this, R, null, !0, !1);
  };
  function lt(R, P, $, K, It) {
    var Z = R._readableState;
    if (P === null)
      Z.reading = !1, kt(R, Z);
    else {
      var J;
      It || (J = At(Z, P)), J ? R.emit("error", J) : Z.objectMode || P && P.length > 0 ? (typeof P != "string" && !Z.objectMode && Object.getPrototypeOf(P) !== f.prototype && (P = y(P)), K ? Z.endEmitted ? R.emit("error", new Error("stream.unshift() after end event")) : H(R, Z, P, !0) : Z.ended ? R.emit("error", new Error("stream.push() after EOF")) : (Z.reading = !1, Z.decoder && !$ ? (P = Z.decoder.write(P), Z.objectMode || P.length !== 0 ? H(R, Z, P, !1) : r(R, Z)) : H(R, Z, P, !1))) : K || (Z.reading = !1);
    }
    return Bt(Z);
  }
  function H(R, P, $, K) {
    P.flowing && P.length === 0 && !P.sync ? (R.emit("data", $), R.read(0)) : (P.length += P.objectMode ? 1 : $.length, K ? P.buffer.unshift($) : P.buffer.push($), P.needReadable && p(R)), r(R, P);
  }
  function At(R, P) {
    var $;
    return !S(P) && typeof P != "string" && P !== void 0 && !R.objectMode && ($ = new TypeError("Invalid non-string/buffer chunk")), $;
  }
  function Bt(R) {
    return !R.ended && (R.needReadable || R.length < R.highWaterMark || R.length === 0);
  }
  N.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, N.prototype.setEncoding = function(R) {
    return D || (D = Mn.StringDecoder), this._readableState.decoder = new D(R), this._readableState.encoding = R, this;
  };
  var Ct = 8388608;
  function Et(R) {
    return R >= Ct ? R = Ct : (R--, R |= R >>> 1, R |= R >>> 2, R |= R >>> 4, R |= R >>> 8, R |= R >>> 16, R++), R;
  }
  function Y(R, P) {
    return R <= 0 || P.length === 0 && P.ended ? 0 : P.objectMode ? 1 : R !== R ? P.flowing && P.length ? P.buffer.head.data.length : P.length : (R > P.highWaterMark && (P.highWaterMark = Et(R)), R <= P.length ? R : P.ended ? P.length : (P.needReadable = !0, 0));
  }
  N.prototype.read = function(R) {
    x("read", R), R = parseInt(R, 10);
    var P = this._readableState, $ = R;
    if (R !== 0 && (P.emittedReadable = !1), R === 0 && P.needReadable && (P.length >= P.highWaterMark || P.ended))
      return x("read: emitReadable", P.length, P.ended), P.length === 0 && P.ended ? C(this) : p(this), null;
    if (R = Y(R, P), R === 0 && P.ended)
      return P.length === 0 && C(this), null;
    var K = P.needReadable;
    x("need readable", K), (P.length === 0 || P.length - R < P.highWaterMark) && (K = !0, x("length less than watermark", K)), P.ended || P.reading ? (K = !1, x("reading or ended", K)) : K && (x("do read"), P.reading = !0, P.sync = !0, P.length === 0 && (P.needReadable = !0), this._read(P.highWaterMark), P.sync = !1, P.reading || (R = Y($, P)));
    var It;
    return R > 0 ? It = e(R, P) : It = null, It === null ? (P.needReadable = !0, R = 0) : P.length -= R, P.length === 0 && (P.ended || (P.needReadable = !0), $ !== R && P.ended && C(this)), It !== null && this.emit("data", It), It;
  };
  function kt(R, P) {
    if (!P.ended) {
      if (P.decoder) {
        var $ = P.decoder.end();
        $ && $.length && (P.buffer.push($), P.length += P.objectMode ? 1 : $.length);
      }
      P.ended = !0, p(R);
    }
  }
  function p(R) {
    var P = R._readableState;
    P.needReadable = !1, P.emittedReadable || (x("emitReadable", P.flowing), P.emittedReadable = !0, P.sync ? h.nextTick(t, R) : t(R));
  }
  function t(R) {
    x("emit readable"), R.emit("readable"), u(R);
  }
  function r(R, P) {
    P.readingMore || (P.readingMore = !0, h.nextTick(i, R, P));
  }
  function i(R, P) {
    for (var $ = P.length; !P.reading && !P.flowing && !P.ended && P.length < P.highWaterMark && (x("maybeReadMore read 0"), R.read(0), $ !== P.length); )
      $ = P.length;
    P.readingMore = !1;
  }
  N.prototype._read = function(R) {
    this.emit("error", new Error("_read() is not implemented"));
  }, N.prototype.pipe = function(R, P) {
    var $ = this, K = this._readableState;
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
    var It = (!P || P.end !== !1) && R !== ye.stdout && R !== ye.stderr, Z = It ? qt : Ft;
    K.endEmitted ? h.nextTick(Z) : $.once("end", Z), R.on("unpipe", J);
    function J(Q, ct) {
      x("onunpipe"), Q === $ && ct && ct.hasUnpiped === !1 && (ct.hasUnpiped = !0, Dt());
    }
    function qt() {
      x("onend"), R.end();
    }
    var tt = a($);
    R.on("drain", tt);
    var vt = !1;
    function Dt() {
      x("cleanup"), R.removeListener("close", j), R.removeListener("finish", dt), R.removeListener("drain", tt), R.removeListener("error", Pt), R.removeListener("unpipe", J), $.removeListener("end", qt), $.removeListener("end", Ft), $.removeListener("data", pt), vt = !0, K.awaitDrain && (!R._writableState || R._writableState.needDrain) && tt();
    }
    var et = !1;
    $.on("data", pt);
    function pt(Q) {
      x("ondata"), et = !1;
      var ct = R.write(Q);
      ct === !1 && !et && ((K.pipesCount === 1 && K.pipes === R || K.pipesCount > 1 && O(K.pipes, R) !== -1) && !vt && (x("false write response, pause", K.awaitDrain), K.awaitDrain++, et = !0), $.pause());
    }
    function Pt(Q) {
      x("onerror", Q), Ft(), R.removeListener("error", Pt), s(R, "error") === 0 && R.emit("error", Q);
    }
    W(R, "error", Pt);
    function j() {
      R.removeListener("finish", dt), Ft();
    }
    R.once("close", j);
    function dt() {
      x("onfinish"), R.removeListener("close", j), Ft();
    }
    R.once("finish", dt);
    function Ft() {
      x("unpipe"), $.unpipe(R);
    }
    return R.emit("pipe", $), K.flowing || (x("pipe resume"), $.resume()), R;
  };
  function a(R) {
    return function() {
      var P = R._readableState;
      x("pipeOnDrain", P.awaitDrain), P.awaitDrain && P.awaitDrain--, P.awaitDrain === 0 && s(R, "data") && (P.flowing = !0, u(R));
    };
  }
  N.prototype.unpipe = function(R) {
    var P = this._readableState, $ = { hasUnpiped: !1 };
    if (P.pipesCount === 0)
      return this;
    if (P.pipesCount === 1)
      return R && R !== P.pipes ? this : (R || (R = P.pipes), P.pipes = null, P.pipesCount = 0, P.flowing = !1, R && R.emit("unpipe", this, $), this);
    if (!R) {
      var K = P.pipes, It = P.pipesCount;
      P.pipes = null, P.pipesCount = 0, P.flowing = !1;
      for (var Z = 0; Z < It; Z++)
        K[Z].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var J = O(P.pipes, R);
    return J === -1 ? this : (P.pipes.splice(J, 1), P.pipesCount -= 1, P.pipesCount === 1 && (P.pipes = P.pipes[0]), R.emit("unpipe", this, $), this);
  }, N.prototype.on = function(R, P) {
    var $ = m.prototype.on.call(this, R, P);
    if (R === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (R === "readable") {
      var K = this._readableState;
      !K.endEmitted && !K.readableListening && (K.readableListening = K.needReadable = !0, K.emittedReadable = !1, K.reading ? K.length && p(this) : h.nextTick(d, this));
    }
    return $;
  }, N.prototype.addListener = N.prototype.on;
  function d(R) {
    x("readable nexttick read 0"), R.read(0);
  }
  N.prototype.resume = function() {
    var R = this._readableState;
    return R.flowing || (x("resume"), R.flowing = !0, c(this, R)), this;
  };
  function c(R, P) {
    P.resumeScheduled || (P.resumeScheduled = !0, h.nextTick(v, R, P));
  }
  function v(R, P) {
    P.reading || (x("resume read 0"), R.read(0)), P.resumeScheduled = !1, P.awaitDrain = 0, R.emit("resume"), u(R), P.flowing && !P.reading && R.read(0);
  }
  N.prototype.pause = function() {
    return x("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (x("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
  };
  function u(R) {
    var P = R._readableState;
    for (x("flow", P.flowing); P.flowing && R.read() !== null; )
      ;
  }
  N.prototype.wrap = function(R) {
    var P = this, $ = this._readableState, K = !1;
    R.on("end", function() {
      if (x("wrapped end"), $.decoder && !$.ended) {
        var J = $.decoder.end();
        J && J.length && P.push(J);
      }
      P.push(null);
    }), R.on("data", function(J) {
      if (x("wrapped data"), $.decoder && (J = $.decoder.write(J)), !($.objectMode && J == null) && !(!$.objectMode && (!J || !J.length))) {
        var qt = P.push(J);
        qt || (K = !0, R.pause());
      }
    });
    for (var It in R)
      this[It] === void 0 && typeof R[It] == "function" && (this[It] = function(J) {
        return function() {
          return R[J].apply(R, arguments);
        };
      }(It));
    for (var Z = 0; Z < L.length; Z++)
      R.on(L[Z], this.emit.bind(this, L[Z]));
    return this._read = function(J) {
      x("wrapped _read", J), K && (K = !1, R.resume());
    }, this;
  }, Object.defineProperty(N.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), N._fromList = e;
  function e(R, P) {
    if (P.length === 0)
      return null;
    var $;
    return P.objectMode ? $ = P.buffer.shift() : !R || R >= P.length ? (P.decoder ? $ = P.buffer.join("") : P.buffer.length === 1 ? $ = P.buffer.head.data : $ = P.buffer.concat(P.length), P.buffer.clear()) : $ = l(R, P.buffer, P.decoder), $;
  }
  function l(R, P, $) {
    var K;
    return R < P.head.data.length ? (K = P.head.data.slice(0, R), P.head.data = P.head.data.slice(R)) : R === P.head.data.length ? K = P.shift() : K = $ ? b(R, P) : _(R, P), K;
  }
  function b(R, P) {
    var $ = P.head, K = 1, It = $.data;
    for (R -= It.length; $ = $.next; ) {
      var Z = $.data, J = R > Z.length ? Z.length : R;
      if (J === Z.length ? It += Z : It += Z.slice(0, R), R -= J, R === 0) {
        J === Z.length ? (++K, $.next ? P.head = $.next : P.head = P.tail = null) : (P.head = $, $.data = Z.slice(J));
        break;
      }
      ++K;
    }
    return P.length -= K, It;
  }
  function _(R, P) {
    var $ = f.allocUnsafe(R), K = P.head, It = 1;
    for (K.data.copy($), R -= K.data.length; K = K.next; ) {
      var Z = K.data, J = R > Z.length ? Z.length : R;
      if (Z.copy($, $.length - R, 0, J), R -= J, R === 0) {
        J === Z.length ? (++It, K.next ? P.head = K.next : P.head = P.tail = null) : (P.head = K, K.data = Z.slice(J));
        break;
      }
      ++It;
    }
    return P.length -= It, $;
  }
  function C(R) {
    var P = R._readableState;
    if (P.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    P.endEmitted || (P.ended = !0, h.nextTick(F, P, R));
  }
  function F(R, P) {
    !R.endEmitted && R.length === 0 && (R.endEmitted = !0, P.readable = !1, P.emit("end"));
  }
  function O(R, P) {
    for (var $ = 0, K = R.length; $ < K; $++)
      if (R[$] === P)
        return $;
    return -1;
  }
  return Ef;
}
var to = Br, Gn = li(), eo = Object.create(we);
eo.inherits = Jt;
eo.inherits(Br, Gn);
function Mv(h, n) {
  var o = this._transformState;
  o.transforming = !1;
  var s = o.writecb;
  if (!s)
    return this.emit("error", new Error("write callback called multiple times"));
  o.writechunk = null, o.writecb = null, n != null && this.push(n), s(h);
  var m = this._readableState;
  m.reading = !1, (m.needReadable || m.length < m.highWaterMark) && this._read(m.highWaterMark);
}
function Br(h) {
  if (!(this instanceof Br))
    return new Br(h);
  Gn.call(this, h), this._transformState = {
    afterTransform: Mv.bind(this),
    needTransform: !1,
    transforming: !1,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }, this._readableState.needReadable = !0, this._readableState.sync = !1, h && (typeof h.transform == "function" && (this._transform = h.transform), typeof h.flush == "function" && (this._flush = h.flush)), this.on("prefinish", xv);
}
function xv() {
  var h = this;
  typeof this._flush == "function" ? this._flush(function(n, o) {
    qa(h, n, o);
  }) : qa(this, null, null);
}
Br.prototype.push = function(h, n) {
  return this._transformState.needTransform = !1, Gn.prototype.push.call(this, h, n);
};
Br.prototype._transform = function(h, n, o) {
  throw new Error("_transform() is not implemented");
};
Br.prototype._write = function(h, n, o) {
  var s = this._transformState;
  if (s.writecb = o, s.writechunk = h, s.writeencoding = n, !s.transforming) {
    var m = this._readableState;
    (s.needTransform || m.needReadable || m.length < m.highWaterMark) && this._read(m.highWaterMark);
  }
};
Br.prototype._read = function(h) {
  var n = this._transformState;
  n.writechunk !== null && n.writecb && !n.transforming ? (n.transforming = !0, this._transform(n.writechunk, n.writeencoding, n.afterTransform)) : n.needTransform = !0;
};
Br.prototype._destroy = function(h, n) {
  var o = this;
  Gn.prototype._destroy.call(this, h, function(s) {
    n(s), o.emit("close");
  });
};
function qa(h, n, o) {
  if (n)
    return h.emit("error", n);
  if (o != null && h.push(o), h._writableState.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (h._transformState.transforming)
    throw new Error("Calling transform done when still transforming");
  return h.push(null);
}
var _v = Ki, ro = to, io = Object.create(we);
io.inherits = Jt;
io.inherits(Ki, ro);
function Ki(h) {
  if (!(this instanceof Ki))
    return new Ki(h);
  ro.call(this, h);
}
Ki.prototype._transform = function(h, n, o) {
  o(null, h);
};
(function(h, n) {
  n = h.exports = Qs(), n.Stream = n, n.Readable = n, n.Writable = js(), n.Duplex = li(), n.Transform = to, n.PassThrough = _v;
})(h0, h0.exports);
var Sv = h0.exports, Ci = { exports: {} }, $0 = { exports: {} };
$0.exports;
(function(h) {
  (function(n, o) {
    function s(r, i) {
      if (!r)
        throw new Error(i || "Assertion failed");
    }
    function m(r, i) {
      r.super_ = i;
      var a = function() {
      };
      a.prototype = i.prototype, r.prototype = new a(), r.prototype.constructor = r;
    }
    function f(r, i, a) {
      if (f.isBN(r))
        return r;
      this.negative = 0, this.words = null, this.length = 0, this.red = null, r !== null && ((i === "le" || i === "be") && (a = i, i = 10), this._init(r || 0, i || 10, a || "be"));
    }
    typeof n == "object" ? n.exports = f : o.BN = f, f.BN = f, f.wordSize = 26;
    var g;
    try {
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Pe.Buffer;
    } catch (r) {
    }
    f.isBN = function(i) {
      return i instanceof f ? !0 : i !== null && typeof i == "object" && i.constructor.wordSize === f.wordSize && Array.isArray(i.words);
    }, f.max = function(i, a) {
      return i.cmp(a) > 0 ? i : a;
    }, f.min = function(i, a) {
      return i.cmp(a) < 0 ? i : a;
    }, f.prototype._init = function(i, a, d) {
      if (typeof i == "number")
        return this._initNumber(i, a, d);
      if (typeof i == "object")
        return this._initArray(i, a, d);
      a === "hex" && (a = 16), s(a === (a | 0) && a >= 2 && a <= 36), i = i.toString().replace(/\s+/g, "");
      var c = 0;
      i[0] === "-" && (c++, this.negative = 1), c < i.length && (a === 16 ? this._parseHex(i, c, d) : (this._parseBase(i, a, c), d === "le" && this._initArray(this.toArray(), a, d)));
    }, f.prototype._initNumber = function(i, a, d) {
      i < 0 && (this.negative = 1, i = -i), i < 67108864 ? (this.words = [i & 67108863], this.length = 1) : i < 4503599627370496 ? (this.words = [
        i & 67108863,
        i / 67108864 & 67108863
      ], this.length = 2) : (s(i < 9007199254740992), this.words = [
        i & 67108863,
        i / 67108864 & 67108863,
        1
      ], this.length = 3), d === "le" && this._initArray(this.toArray(), a, d);
    }, f.prototype._initArray = function(i, a, d) {
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
      var a = r.charCodeAt(i);
      if (a >= 48 && a <= 57)
        return a - 48;
      if (a >= 65 && a <= 70)
        return a - 55;
      if (a >= 97 && a <= 102)
        return a - 87;
      s(!1, "Invalid character in " + r);
    }
    function S(r, i, a) {
      var d = y(r, a);
      return a - 1 >= i && (d |= y(r, a - 1) << 4), d;
    }
    f.prototype._parseHex = function(i, a, d) {
      this.length = Math.ceil((i.length - a) / 6), this.words = new Array(this.length);
      for (var c = 0; c < this.length; c++)
        this.words[c] = 0;
      var v = 0, u = 0, e;
      if (d === "be")
        for (c = i.length - 1; c >= a; c -= 2)
          e = S(i, a, c) << v, this.words[u] |= e & 67108863, v >= 18 ? (v -= 18, u += 1, this.words[u] |= e >>> 26) : v += 8;
      else {
        var l = i.length - a;
        for (c = l % 2 === 0 ? a + 1 : a; c < i.length; c += 2)
          e = S(i, a, c) << v, this.words[u] |= e & 67108863, v >= 18 ? (v -= 18, u += 1, this.words[u] |= e >>> 26) : v += 8;
      }
      this._strip();
    };
    function B(r, i, a, d) {
      for (var c = 0, v = 0, u = Math.min(r.length, a), e = i; e < u; e++) {
        var l = r.charCodeAt(e) - 48;
        c *= d, l >= 49 ? v = l - 49 + 10 : l >= 17 ? v = l - 17 + 10 : v = l, s(l >= 0 && v < d, "Invalid character"), c += v;
      }
      return c;
    }
    f.prototype._parseBase = function(i, a, d) {
      this.words = [0], this.length = 1;
      for (var c = 0, v = 1; v <= 67108863; v *= a)
        c++;
      c--, v = v / a | 0;
      for (var u = i.length - d, e = u % c, l = Math.min(u, u - e) + d, b = 0, _ = d; _ < l; _ += c)
        b = B(i, _, _ + c, a), this.imuln(v), this.words[0] + b < 67108864 ? this.words[0] += b : this._iaddn(b);
      if (e !== 0) {
        var C = 1;
        for (b = B(i, _, i.length, a), _ = 0; _ < e; _++)
          C *= a;
        this.imuln(C), this.words[0] + b < 67108864 ? this.words[0] += b : this._iaddn(b);
      }
      this._strip();
    }, f.prototype.copy = function(i) {
      i.words = new Array(this.length);
      for (var a = 0; a < this.length; a++)
        i.words[a] = this.words[a];
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
    var k = [
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
    ], I = [
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
    f.prototype.toString = function(i, a) {
      i = i || 10, a = a | 0 || 1;
      var d;
      if (i === 16 || i === "hex") {
        d = "";
        for (var c = 0, v = 0, u = 0; u < this.length; u++) {
          var e = this.words[u], l = ((e << c | v) & 16777215).toString(16);
          v = e >>> 24 - c & 16777215, c += 2, c >= 26 && (c -= 26, u--), v !== 0 || u !== this.length - 1 ? d = k[6 - l.length] + l + d : d = l + d;
        }
        for (v !== 0 && (d = v.toString(16) + d); d.length % a !== 0; )
          d = "0" + d;
        return this.negative !== 0 && (d = "-" + d), d;
      }
      if (i === (i | 0) && i >= 2 && i <= 36) {
        var b = I[i], _ = D[i];
        d = "";
        var C = this.clone();
        for (C.negative = 0; !C.isZero(); ) {
          var F = C.modrn(_).toString(i);
          C = C.idivn(_), C.isZero() ? d = F + d : d = k[b - F.length] + F + d;
        }
        for (this.isZero() && (d = "0" + d); d.length % a !== 0; )
          d = "0" + d;
        return this.negative !== 0 && (d = "-" + d), d;
      }
      s(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var i = this.words[0];
      return this.length === 2 ? i += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? i += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && s(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -i : i;
    }, f.prototype.toJSON = function() {
      return this.toString(16, 2);
    }, g && (f.prototype.toBuffer = function(i, a) {
      return this.toArrayLike(g, i, a);
    }), f.prototype.toArray = function(i, a) {
      return this.toArrayLike(Array, i, a);
    };
    var L = function(i, a) {
      return i.allocUnsafe ? i.allocUnsafe(a) : new i(a);
    };
    f.prototype.toArrayLike = function(i, a, d) {
      this._strip();
      var c = this.byteLength(), v = d || Math.max(1, c);
      s(c <= v, "byte array longer than desired length"), s(v > 0, "Requested array length <= 0");
      var u = L(i, v), e = a === "le" ? "LE" : "BE";
      return this["_toArrayLike" + e](u, c), u;
    }, f.prototype._toArrayLikeLE = function(i, a) {
      for (var d = 0, c = 0, v = 0, u = 0; v < this.length; v++) {
        var e = this.words[v] << u | c;
        i[d++] = e & 255, d < i.length && (i[d++] = e >> 8 & 255), d < i.length && (i[d++] = e >> 16 & 255), u === 6 ? (d < i.length && (i[d++] = e >> 24 & 255), c = 0, u = 0) : (c = e >>> 24, u += 2);
      }
      if (d < i.length)
        for (i[d++] = c; d < i.length; )
          i[d++] = 0;
    }, f.prototype._toArrayLikeBE = function(i, a) {
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
      var a = i, d = 0;
      return a >= 4096 && (d += 13, a >>>= 13), a >= 64 && (d += 7, a >>>= 7), a >= 8 && (d += 4, a >>>= 4), a >= 2 && (d += 2, a >>>= 2), d + a;
    }, f.prototype._zeroBits = function(i) {
      if (i === 0)
        return 26;
      var a = i, d = 0;
      return a & 8191 || (d += 13, a >>>= 13), a & 127 || (d += 7, a >>>= 7), a & 15 || (d += 4, a >>>= 4), a & 3 || (d += 2, a >>>= 2), a & 1 || d++, d;
    }, f.prototype.bitLength = function() {
      var i = this.words[this.length - 1], a = this._countBits(i);
      return (this.length - 1) * 26 + a;
    };
    function W(r) {
      for (var i = new Array(r.bitLength()), a = 0; a < i.length; a++) {
        var d = a / 26 | 0, c = a % 26;
        i[a] = r.words[d] >>> c & 1;
      }
      return i;
    }
    f.prototype.zeroBits = function() {
      if (this.isZero())
        return 0;
      for (var i = 0, a = 0; a < this.length; a++) {
        var d = this._zeroBits(this.words[a]);
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
      for (var a = 0; a < i.length; a++)
        this.words[a] = this.words[a] | i.words[a];
      return this._strip();
    }, f.prototype.ior = function(i) {
      return s((this.negative | i.negative) === 0), this.iuor(i);
    }, f.prototype.or = function(i) {
      return this.length > i.length ? this.clone().ior(i) : i.clone().ior(this);
    }, f.prototype.uor = function(i) {
      return this.length > i.length ? this.clone().iuor(i) : i.clone().iuor(this);
    }, f.prototype.iuand = function(i) {
      var a;
      this.length > i.length ? a = i : a = this;
      for (var d = 0; d < a.length; d++)
        this.words[d] = this.words[d] & i.words[d];
      return this.length = a.length, this._strip();
    }, f.prototype.iand = function(i) {
      return s((this.negative | i.negative) === 0), this.iuand(i);
    }, f.prototype.and = function(i) {
      return this.length > i.length ? this.clone().iand(i) : i.clone().iand(this);
    }, f.prototype.uand = function(i) {
      return this.length > i.length ? this.clone().iuand(i) : i.clone().iuand(this);
    }, f.prototype.iuxor = function(i) {
      var a, d;
      this.length > i.length ? (a = this, d = i) : (a = i, d = this);
      for (var c = 0; c < d.length; c++)
        this.words[c] = a.words[c] ^ d.words[c];
      if (this !== a)
        for (; c < a.length; c++)
          this.words[c] = a.words[c];
      return this.length = a.length, this._strip();
    }, f.prototype.ixor = function(i) {
      return s((this.negative | i.negative) === 0), this.iuxor(i);
    }, f.prototype.xor = function(i) {
      return this.length > i.length ? this.clone().ixor(i) : i.clone().ixor(this);
    }, f.prototype.uxor = function(i) {
      return this.length > i.length ? this.clone().iuxor(i) : i.clone().iuxor(this);
    }, f.prototype.inotn = function(i) {
      s(typeof i == "number" && i >= 0);
      var a = Math.ceil(i / 26) | 0, d = i % 26;
      this._expand(a), d > 0 && a--;
      for (var c = 0; c < a; c++)
        this.words[c] = ~this.words[c] & 67108863;
      return d > 0 && (this.words[c] = ~this.words[c] & 67108863 >> 26 - d), this._strip();
    }, f.prototype.notn = function(i) {
      return this.clone().inotn(i);
    }, f.prototype.setn = function(i, a) {
      s(typeof i == "number" && i >= 0);
      var d = i / 26 | 0, c = i % 26;
      return this._expand(d + 1), a ? this.words[d] = this.words[d] | 1 << c : this.words[d] = this.words[d] & ~(1 << c), this._strip();
    }, f.prototype.iadd = function(i) {
      var a;
      if (this.negative !== 0 && i.negative === 0)
        return this.negative = 0, a = this.isub(i), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && i.negative !== 0)
        return i.negative = 0, a = this.isub(i), i.negative = 1, a._normSign();
      var d, c;
      this.length > i.length ? (d = this, c = i) : (d = i, c = this);
      for (var v = 0, u = 0; u < c.length; u++)
        a = (d.words[u] | 0) + (c.words[u] | 0) + v, this.words[u] = a & 67108863, v = a >>> 26;
      for (; v !== 0 && u < d.length; u++)
        a = (d.words[u] | 0) + v, this.words[u] = a & 67108863, v = a >>> 26;
      if (this.length = d.length, v !== 0)
        this.words[this.length] = v, this.length++;
      else if (d !== this)
        for (; u < d.length; u++)
          this.words[u] = d.words[u];
      return this;
    }, f.prototype.add = function(i) {
      var a;
      return i.negative !== 0 && this.negative === 0 ? (i.negative = 0, a = this.sub(i), i.negative ^= 1, a) : i.negative === 0 && this.negative !== 0 ? (this.negative = 0, a = i.sub(this), this.negative = 1, a) : this.length > i.length ? this.clone().iadd(i) : i.clone().iadd(this);
    }, f.prototype.isub = function(i) {
      if (i.negative !== 0) {
        i.negative = 0;
        var a = this.iadd(i);
        return i.negative = 1, a._normSign();
      } else if (this.negative !== 0)
        return this.negative = 0, this.iadd(i), this.negative = 1, this._normSign();
      var d = this.cmp(i);
      if (d === 0)
        return this.negative = 0, this.length = 1, this.words[0] = 0, this;
      var c, v;
      d > 0 ? (c = this, v = i) : (c = i, v = this);
      for (var u = 0, e = 0; e < v.length; e++)
        a = (c.words[e] | 0) - (v.words[e] | 0) + u, u = a >> 26, this.words[e] = a & 67108863;
      for (; u !== 0 && e < c.length; e++)
        a = (c.words[e] | 0) + u, u = a >> 26, this.words[e] = a & 67108863;
      if (u === 0 && e < c.length && c !== this)
        for (; e < c.length; e++)
          this.words[e] = c.words[e];
      return this.length = Math.max(this.length, e), c !== this && (this.negative = 1), this._strip();
    }, f.prototype.sub = function(i) {
      return this.clone().isub(i);
    };
    function z(r, i, a) {
      a.negative = i.negative ^ r.negative;
      var d = r.length + i.length | 0;
      a.length = d, d = d - 1 | 0;
      var c = r.words[0] | 0, v = i.words[0] | 0, u = c * v, e = u & 67108863, l = u / 67108864 | 0;
      a.words[0] = e;
      for (var b = 1; b < d; b++) {
        for (var _ = l >>> 26, C = l & 67108863, F = Math.min(b, i.length - 1), O = Math.max(0, b - r.length + 1); O <= F; O++) {
          var R = b - O | 0;
          c = r.words[R] | 0, v = i.words[O] | 0, u = c * v + C, _ += u / 67108864 | 0, C = u & 67108863;
        }
        a.words[b] = C | 0, l = _ | 0;
      }
      return l !== 0 ? a.words[b] = l | 0 : a.length--, a._strip();
    }
    var N = function(i, a, d) {
      var c = i.words, v = a.words, u = d.words, e = 0, l, b, _, C = c[0] | 0, F = C & 8191, O = C >>> 13, R = c[1] | 0, P = R & 8191, $ = R >>> 13, K = c[2] | 0, It = K & 8191, Z = K >>> 13, J = c[3] | 0, qt = J & 8191, tt = J >>> 13, vt = c[4] | 0, Dt = vt & 8191, et = vt >>> 13, pt = c[5] | 0, Pt = pt & 8191, j = pt >>> 13, dt = c[6] | 0, Ft = dt & 8191, Q = dt >>> 13, ct = c[7] | 0, Lt = ct & 8191, E = ct >>> 13, w = c[8] | 0, A = w & 8191, T = w >>> 13, q = c[9] | 0, V = q & 8191, U = q >>> 13, X = v[0] | 0, Tt = X & 8191, G = X >>> 13, rt = v[1] | 0, Rt = rt & 8191, it = rt >>> 13, gt = v[2] | 0, zt = gt & 8191, nt = gt >>> 13, bt = v[3] | 0, Kt = bt & 8191, ft = bt >>> 13, yt = v[4] | 0, Ht = yt & 8191, at = yt >>> 13, wt = v[5] | 0, Zt = wt & 8191, ht = wt >>> 13, Mt = v[6] | 0, Wt = Mt & 8191, st = Mt >>> 13, xt = v[7] | 0, Vt = xt & 8191, ot = xt >>> 13, _t = v[8] | 0, Yt = _t & 8191, ut = _t >>> 13, St = v[9] | 0, $t = St & 8191, Nt = St >>> 13;
      d.negative = i.negative ^ a.negative, d.length = 19, l = Math.imul(F, Tt), b = Math.imul(F, G), b = b + Math.imul(O, Tt) | 0, _ = Math.imul(O, G);
      var jt = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, l = Math.imul(P, Tt), b = Math.imul(P, G), b = b + Math.imul($, Tt) | 0, _ = Math.imul($, G), l = l + Math.imul(F, Rt) | 0, b = b + Math.imul(F, it) | 0, b = b + Math.imul(O, Rt) | 0, _ = _ + Math.imul(O, it) | 0;
      var Qt = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, l = Math.imul(It, Tt), b = Math.imul(It, G), b = b + Math.imul(Z, Tt) | 0, _ = Math.imul(Z, G), l = l + Math.imul(P, Rt) | 0, b = b + Math.imul(P, it) | 0, b = b + Math.imul($, Rt) | 0, _ = _ + Math.imul($, it) | 0, l = l + Math.imul(F, zt) | 0, b = b + Math.imul(F, nt) | 0, b = b + Math.imul(O, zt) | 0, _ = _ + Math.imul(O, nt) | 0;
      var te = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, l = Math.imul(qt, Tt), b = Math.imul(qt, G), b = b + Math.imul(tt, Tt) | 0, _ = Math.imul(tt, G), l = l + Math.imul(It, Rt) | 0, b = b + Math.imul(It, it) | 0, b = b + Math.imul(Z, Rt) | 0, _ = _ + Math.imul(Z, it) | 0, l = l + Math.imul(P, zt) | 0, b = b + Math.imul(P, nt) | 0, b = b + Math.imul($, zt) | 0, _ = _ + Math.imul($, nt) | 0, l = l + Math.imul(F, Kt) | 0, b = b + Math.imul(F, ft) | 0, b = b + Math.imul(O, Kt) | 0, _ = _ + Math.imul(O, ft) | 0;
      var ee = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, l = Math.imul(Dt, Tt), b = Math.imul(Dt, G), b = b + Math.imul(et, Tt) | 0, _ = Math.imul(et, G), l = l + Math.imul(qt, Rt) | 0, b = b + Math.imul(qt, it) | 0, b = b + Math.imul(tt, Rt) | 0, _ = _ + Math.imul(tt, it) | 0, l = l + Math.imul(It, zt) | 0, b = b + Math.imul(It, nt) | 0, b = b + Math.imul(Z, zt) | 0, _ = _ + Math.imul(Z, nt) | 0, l = l + Math.imul(P, Kt) | 0, b = b + Math.imul(P, ft) | 0, b = b + Math.imul($, Kt) | 0, _ = _ + Math.imul($, ft) | 0, l = l + Math.imul(F, Ht) | 0, b = b + Math.imul(F, at) | 0, b = b + Math.imul(O, Ht) | 0, _ = _ + Math.imul(O, at) | 0;
      var re = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, l = Math.imul(Pt, Tt), b = Math.imul(Pt, G), b = b + Math.imul(j, Tt) | 0, _ = Math.imul(j, G), l = l + Math.imul(Dt, Rt) | 0, b = b + Math.imul(Dt, it) | 0, b = b + Math.imul(et, Rt) | 0, _ = _ + Math.imul(et, it) | 0, l = l + Math.imul(qt, zt) | 0, b = b + Math.imul(qt, nt) | 0, b = b + Math.imul(tt, zt) | 0, _ = _ + Math.imul(tt, nt) | 0, l = l + Math.imul(It, Kt) | 0, b = b + Math.imul(It, ft) | 0, b = b + Math.imul(Z, Kt) | 0, _ = _ + Math.imul(Z, ft) | 0, l = l + Math.imul(P, Ht) | 0, b = b + Math.imul(P, at) | 0, b = b + Math.imul($, Ht) | 0, _ = _ + Math.imul($, at) | 0, l = l + Math.imul(F, Zt) | 0, b = b + Math.imul(F, ht) | 0, b = b + Math.imul(O, Zt) | 0, _ = _ + Math.imul(O, ht) | 0;
      var ie = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, l = Math.imul(Ft, Tt), b = Math.imul(Ft, G), b = b + Math.imul(Q, Tt) | 0, _ = Math.imul(Q, G), l = l + Math.imul(Pt, Rt) | 0, b = b + Math.imul(Pt, it) | 0, b = b + Math.imul(j, Rt) | 0, _ = _ + Math.imul(j, it) | 0, l = l + Math.imul(Dt, zt) | 0, b = b + Math.imul(Dt, nt) | 0, b = b + Math.imul(et, zt) | 0, _ = _ + Math.imul(et, nt) | 0, l = l + Math.imul(qt, Kt) | 0, b = b + Math.imul(qt, ft) | 0, b = b + Math.imul(tt, Kt) | 0, _ = _ + Math.imul(tt, ft) | 0, l = l + Math.imul(It, Ht) | 0, b = b + Math.imul(It, at) | 0, b = b + Math.imul(Z, Ht) | 0, _ = _ + Math.imul(Z, at) | 0, l = l + Math.imul(P, Zt) | 0, b = b + Math.imul(P, ht) | 0, b = b + Math.imul($, Zt) | 0, _ = _ + Math.imul($, ht) | 0, l = l + Math.imul(F, Wt) | 0, b = b + Math.imul(F, st) | 0, b = b + Math.imul(O, Wt) | 0, _ = _ + Math.imul(O, st) | 0;
      var ne = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, l = Math.imul(Lt, Tt), b = Math.imul(Lt, G), b = b + Math.imul(E, Tt) | 0, _ = Math.imul(E, G), l = l + Math.imul(Ft, Rt) | 0, b = b + Math.imul(Ft, it) | 0, b = b + Math.imul(Q, Rt) | 0, _ = _ + Math.imul(Q, it) | 0, l = l + Math.imul(Pt, zt) | 0, b = b + Math.imul(Pt, nt) | 0, b = b + Math.imul(j, zt) | 0, _ = _ + Math.imul(j, nt) | 0, l = l + Math.imul(Dt, Kt) | 0, b = b + Math.imul(Dt, ft) | 0, b = b + Math.imul(et, Kt) | 0, _ = _ + Math.imul(et, ft) | 0, l = l + Math.imul(qt, Ht) | 0, b = b + Math.imul(qt, at) | 0, b = b + Math.imul(tt, Ht) | 0, _ = _ + Math.imul(tt, at) | 0, l = l + Math.imul(It, Zt) | 0, b = b + Math.imul(It, ht) | 0, b = b + Math.imul(Z, Zt) | 0, _ = _ + Math.imul(Z, ht) | 0, l = l + Math.imul(P, Wt) | 0, b = b + Math.imul(P, st) | 0, b = b + Math.imul($, Wt) | 0, _ = _ + Math.imul($, st) | 0, l = l + Math.imul(F, Vt) | 0, b = b + Math.imul(F, ot) | 0, b = b + Math.imul(O, Vt) | 0, _ = _ + Math.imul(O, ot) | 0;
      var fe = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, l = Math.imul(A, Tt), b = Math.imul(A, G), b = b + Math.imul(T, Tt) | 0, _ = Math.imul(T, G), l = l + Math.imul(Lt, Rt) | 0, b = b + Math.imul(Lt, it) | 0, b = b + Math.imul(E, Rt) | 0, _ = _ + Math.imul(E, it) | 0, l = l + Math.imul(Ft, zt) | 0, b = b + Math.imul(Ft, nt) | 0, b = b + Math.imul(Q, zt) | 0, _ = _ + Math.imul(Q, nt) | 0, l = l + Math.imul(Pt, Kt) | 0, b = b + Math.imul(Pt, ft) | 0, b = b + Math.imul(j, Kt) | 0, _ = _ + Math.imul(j, ft) | 0, l = l + Math.imul(Dt, Ht) | 0, b = b + Math.imul(Dt, at) | 0, b = b + Math.imul(et, Ht) | 0, _ = _ + Math.imul(et, at) | 0, l = l + Math.imul(qt, Zt) | 0, b = b + Math.imul(qt, ht) | 0, b = b + Math.imul(tt, Zt) | 0, _ = _ + Math.imul(tt, ht) | 0, l = l + Math.imul(It, Wt) | 0, b = b + Math.imul(It, st) | 0, b = b + Math.imul(Z, Wt) | 0, _ = _ + Math.imul(Z, st) | 0, l = l + Math.imul(P, Vt) | 0, b = b + Math.imul(P, ot) | 0, b = b + Math.imul($, Vt) | 0, _ = _ + Math.imul($, ot) | 0, l = l + Math.imul(F, Yt) | 0, b = b + Math.imul(F, ut) | 0, b = b + Math.imul(O, Yt) | 0, _ = _ + Math.imul(O, ut) | 0;
      var ae = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, l = Math.imul(V, Tt), b = Math.imul(V, G), b = b + Math.imul(U, Tt) | 0, _ = Math.imul(U, G), l = l + Math.imul(A, Rt) | 0, b = b + Math.imul(A, it) | 0, b = b + Math.imul(T, Rt) | 0, _ = _ + Math.imul(T, it) | 0, l = l + Math.imul(Lt, zt) | 0, b = b + Math.imul(Lt, nt) | 0, b = b + Math.imul(E, zt) | 0, _ = _ + Math.imul(E, nt) | 0, l = l + Math.imul(Ft, Kt) | 0, b = b + Math.imul(Ft, ft) | 0, b = b + Math.imul(Q, Kt) | 0, _ = _ + Math.imul(Q, ft) | 0, l = l + Math.imul(Pt, Ht) | 0, b = b + Math.imul(Pt, at) | 0, b = b + Math.imul(j, Ht) | 0, _ = _ + Math.imul(j, at) | 0, l = l + Math.imul(Dt, Zt) | 0, b = b + Math.imul(Dt, ht) | 0, b = b + Math.imul(et, Zt) | 0, _ = _ + Math.imul(et, ht) | 0, l = l + Math.imul(qt, Wt) | 0, b = b + Math.imul(qt, st) | 0, b = b + Math.imul(tt, Wt) | 0, _ = _ + Math.imul(tt, st) | 0, l = l + Math.imul(It, Vt) | 0, b = b + Math.imul(It, ot) | 0, b = b + Math.imul(Z, Vt) | 0, _ = _ + Math.imul(Z, ot) | 0, l = l + Math.imul(P, Yt) | 0, b = b + Math.imul(P, ut) | 0, b = b + Math.imul($, Yt) | 0, _ = _ + Math.imul($, ut) | 0, l = l + Math.imul(F, $t) | 0, b = b + Math.imul(F, Nt) | 0, b = b + Math.imul(O, $t) | 0, _ = _ + Math.imul(O, Nt) | 0;
      var he = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, l = Math.imul(V, Rt), b = Math.imul(V, it), b = b + Math.imul(U, Rt) | 0, _ = Math.imul(U, it), l = l + Math.imul(A, zt) | 0, b = b + Math.imul(A, nt) | 0, b = b + Math.imul(T, zt) | 0, _ = _ + Math.imul(T, nt) | 0, l = l + Math.imul(Lt, Kt) | 0, b = b + Math.imul(Lt, ft) | 0, b = b + Math.imul(E, Kt) | 0, _ = _ + Math.imul(E, ft) | 0, l = l + Math.imul(Ft, Ht) | 0, b = b + Math.imul(Ft, at) | 0, b = b + Math.imul(Q, Ht) | 0, _ = _ + Math.imul(Q, at) | 0, l = l + Math.imul(Pt, Zt) | 0, b = b + Math.imul(Pt, ht) | 0, b = b + Math.imul(j, Zt) | 0, _ = _ + Math.imul(j, ht) | 0, l = l + Math.imul(Dt, Wt) | 0, b = b + Math.imul(Dt, st) | 0, b = b + Math.imul(et, Wt) | 0, _ = _ + Math.imul(et, st) | 0, l = l + Math.imul(qt, Vt) | 0, b = b + Math.imul(qt, ot) | 0, b = b + Math.imul(tt, Vt) | 0, _ = _ + Math.imul(tt, ot) | 0, l = l + Math.imul(It, Yt) | 0, b = b + Math.imul(It, ut) | 0, b = b + Math.imul(Z, Yt) | 0, _ = _ + Math.imul(Z, ut) | 0, l = l + Math.imul(P, $t) | 0, b = b + Math.imul(P, Nt) | 0, b = b + Math.imul($, $t) | 0, _ = _ + Math.imul($, Nt) | 0;
      var se = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, l = Math.imul(V, zt), b = Math.imul(V, nt), b = b + Math.imul(U, zt) | 0, _ = Math.imul(U, nt), l = l + Math.imul(A, Kt) | 0, b = b + Math.imul(A, ft) | 0, b = b + Math.imul(T, Kt) | 0, _ = _ + Math.imul(T, ft) | 0, l = l + Math.imul(Lt, Ht) | 0, b = b + Math.imul(Lt, at) | 0, b = b + Math.imul(E, Ht) | 0, _ = _ + Math.imul(E, at) | 0, l = l + Math.imul(Ft, Zt) | 0, b = b + Math.imul(Ft, ht) | 0, b = b + Math.imul(Q, Zt) | 0, _ = _ + Math.imul(Q, ht) | 0, l = l + Math.imul(Pt, Wt) | 0, b = b + Math.imul(Pt, st) | 0, b = b + Math.imul(j, Wt) | 0, _ = _ + Math.imul(j, st) | 0, l = l + Math.imul(Dt, Vt) | 0, b = b + Math.imul(Dt, ot) | 0, b = b + Math.imul(et, Vt) | 0, _ = _ + Math.imul(et, ot) | 0, l = l + Math.imul(qt, Yt) | 0, b = b + Math.imul(qt, ut) | 0, b = b + Math.imul(tt, Yt) | 0, _ = _ + Math.imul(tt, ut) | 0, l = l + Math.imul(It, $t) | 0, b = b + Math.imul(It, Nt) | 0, b = b + Math.imul(Z, $t) | 0, _ = _ + Math.imul(Z, Nt) | 0;
      var oe = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, l = Math.imul(V, Kt), b = Math.imul(V, ft), b = b + Math.imul(U, Kt) | 0, _ = Math.imul(U, ft), l = l + Math.imul(A, Ht) | 0, b = b + Math.imul(A, at) | 0, b = b + Math.imul(T, Ht) | 0, _ = _ + Math.imul(T, at) | 0, l = l + Math.imul(Lt, Zt) | 0, b = b + Math.imul(Lt, ht) | 0, b = b + Math.imul(E, Zt) | 0, _ = _ + Math.imul(E, ht) | 0, l = l + Math.imul(Ft, Wt) | 0, b = b + Math.imul(Ft, st) | 0, b = b + Math.imul(Q, Wt) | 0, _ = _ + Math.imul(Q, st) | 0, l = l + Math.imul(Pt, Vt) | 0, b = b + Math.imul(Pt, ot) | 0, b = b + Math.imul(j, Vt) | 0, _ = _ + Math.imul(j, ot) | 0, l = l + Math.imul(Dt, Yt) | 0, b = b + Math.imul(Dt, ut) | 0, b = b + Math.imul(et, Yt) | 0, _ = _ + Math.imul(et, ut) | 0, l = l + Math.imul(qt, $t) | 0, b = b + Math.imul(qt, Nt) | 0, b = b + Math.imul(tt, $t) | 0, _ = _ + Math.imul(tt, Nt) | 0;
      var ue = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, l = Math.imul(V, Ht), b = Math.imul(V, at), b = b + Math.imul(U, Ht) | 0, _ = Math.imul(U, at), l = l + Math.imul(A, Zt) | 0, b = b + Math.imul(A, ht) | 0, b = b + Math.imul(T, Zt) | 0, _ = _ + Math.imul(T, ht) | 0, l = l + Math.imul(Lt, Wt) | 0, b = b + Math.imul(Lt, st) | 0, b = b + Math.imul(E, Wt) | 0, _ = _ + Math.imul(E, st) | 0, l = l + Math.imul(Ft, Vt) | 0, b = b + Math.imul(Ft, ot) | 0, b = b + Math.imul(Q, Vt) | 0, _ = _ + Math.imul(Q, ot) | 0, l = l + Math.imul(Pt, Yt) | 0, b = b + Math.imul(Pt, ut) | 0, b = b + Math.imul(j, Yt) | 0, _ = _ + Math.imul(j, ut) | 0, l = l + Math.imul(Dt, $t) | 0, b = b + Math.imul(Dt, Nt) | 0, b = b + Math.imul(et, $t) | 0, _ = _ + Math.imul(et, Nt) | 0;
      var le = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, l = Math.imul(V, Zt), b = Math.imul(V, ht), b = b + Math.imul(U, Zt) | 0, _ = Math.imul(U, ht), l = l + Math.imul(A, Wt) | 0, b = b + Math.imul(A, st) | 0, b = b + Math.imul(T, Wt) | 0, _ = _ + Math.imul(T, st) | 0, l = l + Math.imul(Lt, Vt) | 0, b = b + Math.imul(Lt, ot) | 0, b = b + Math.imul(E, Vt) | 0, _ = _ + Math.imul(E, ot) | 0, l = l + Math.imul(Ft, Yt) | 0, b = b + Math.imul(Ft, ut) | 0, b = b + Math.imul(Q, Yt) | 0, _ = _ + Math.imul(Q, ut) | 0, l = l + Math.imul(Pt, $t) | 0, b = b + Math.imul(Pt, Nt) | 0, b = b + Math.imul(j, $t) | 0, _ = _ + Math.imul(j, Nt) | 0;
      var de = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, l = Math.imul(V, Wt), b = Math.imul(V, st), b = b + Math.imul(U, Wt) | 0, _ = Math.imul(U, st), l = l + Math.imul(A, Vt) | 0, b = b + Math.imul(A, ot) | 0, b = b + Math.imul(T, Vt) | 0, _ = _ + Math.imul(T, ot) | 0, l = l + Math.imul(Lt, Yt) | 0, b = b + Math.imul(Lt, ut) | 0, b = b + Math.imul(E, Yt) | 0, _ = _ + Math.imul(E, ut) | 0, l = l + Math.imul(Ft, $t) | 0, b = b + Math.imul(Ft, Nt) | 0, b = b + Math.imul(Q, $t) | 0, _ = _ + Math.imul(Q, Nt) | 0;
      var ce = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, l = Math.imul(V, Vt), b = Math.imul(V, ot), b = b + Math.imul(U, Vt) | 0, _ = Math.imul(U, ot), l = l + Math.imul(A, Yt) | 0, b = b + Math.imul(A, ut) | 0, b = b + Math.imul(T, Yt) | 0, _ = _ + Math.imul(T, ut) | 0, l = l + Math.imul(Lt, $t) | 0, b = b + Math.imul(Lt, Nt) | 0, b = b + Math.imul(E, $t) | 0, _ = _ + Math.imul(E, Nt) | 0;
      var ve = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, l = Math.imul(V, Yt), b = Math.imul(V, ut), b = b + Math.imul(U, Yt) | 0, _ = Math.imul(U, ut), l = l + Math.imul(A, $t) | 0, b = b + Math.imul(A, Nt) | 0, b = b + Math.imul(T, $t) | 0, _ = _ + Math.imul(T, Nt) | 0;
      var sf = (e + l | 0) + ((b & 8191) << 13) | 0;
      e = (_ + (b >>> 13) | 0) + (sf >>> 26) | 0, sf &= 67108863, l = Math.imul(V, $t), b = Math.imul(V, Nt), b = b + Math.imul(U, $t) | 0, _ = Math.imul(U, Nt);
      var of = (e + l | 0) + ((b & 8191) << 13) | 0;
      return e = (_ + (b >>> 13) | 0) + (of >>> 26) | 0, of &= 67108863, u[0] = jt, u[1] = Qt, u[2] = te, u[3] = ee, u[4] = re, u[5] = ie, u[6] = ne, u[7] = fe, u[8] = ae, u[9] = he, u[10] = se, u[11] = oe, u[12] = ue, u[13] = le, u[14] = de, u[15] = ce, u[16] = ve, u[17] = sf, u[18] = of, e !== 0 && (u[19] = e, d.length++), d;
    };
    Math.imul || (N = z);
    function lt(r, i, a) {
      a.negative = i.negative ^ r.negative, a.length = r.length + i.length;
      for (var d = 0, c = 0, v = 0; v < a.length - 1; v++) {
        var u = c;
        c = 0;
        for (var e = d & 67108863, l = Math.min(v, i.length - 1), b = Math.max(0, v - r.length + 1); b <= l; b++) {
          var _ = v - b, C = r.words[_] | 0, F = i.words[b] | 0, O = C * F, R = O & 67108863;
          u = u + (O / 67108864 | 0) | 0, R = R + e | 0, e = R & 67108863, u = u + (R >>> 26) | 0, c += u >>> 26, u &= 67108863;
        }
        a.words[v] = e, d = u, u = c;
      }
      return d !== 0 ? a.words[v] = d : a.length--, a._strip();
    }
    function H(r, i, a) {
      return lt(r, i, a);
    }
    f.prototype.mulTo = function(i, a) {
      var d, c = this.length + i.length;
      return this.length === 10 && i.length === 10 ? d = N(this, i, a) : c < 63 ? d = z(this, i, a) : c < 1024 ? d = lt(this, i, a) : d = H(this, i, a), d;
    }, f.prototype.mul = function(i) {
      var a = new f(null);
      return a.words = new Array(this.length + i.length), this.mulTo(i, a);
    }, f.prototype.mulf = function(i) {
      var a = new f(null);
      return a.words = new Array(this.length + i.length), H(this, i, a);
    }, f.prototype.imul = function(i) {
      return this.clone().mulTo(i, this);
    }, f.prototype.imuln = function(i) {
      var a = i < 0;
      a && (i = -i), s(typeof i == "number"), s(i < 67108864);
      for (var d = 0, c = 0; c < this.length; c++) {
        var v = (this.words[c] | 0) * i, u = (v & 67108863) + (d & 67108863);
        d >>= 26, d += v / 67108864 | 0, d += u >>> 26, this.words[c] = u & 67108863;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this.length = i === 0 ? 1 : this.length, a ? this.ineg() : this;
    }, f.prototype.muln = function(i) {
      return this.clone().imuln(i);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(i) {
      var a = W(i);
      if (a.length === 0)
        return new f(1);
      for (var d = this, c = 0; c < a.length && a[c] === 0; c++, d = d.sqr())
        ;
      if (++c < a.length)
        for (var v = d.sqr(); c < a.length; c++, v = v.sqr())
          a[c] !== 0 && (d = d.mul(v));
      return d;
    }, f.prototype.iushln = function(i) {
      s(typeof i == "number" && i >= 0);
      var a = i % 26, d = (i - a) / 26, c = 67108863 >>> 26 - a << 26 - a, v;
      if (a !== 0) {
        var u = 0;
        for (v = 0; v < this.length; v++) {
          var e = this.words[v] & c, l = (this.words[v] | 0) - e << a;
          this.words[v] = l | u, u = e >>> 26 - a;
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
    }, f.prototype.iushrn = function(i, a, d) {
      s(typeof i == "number" && i >= 0);
      var c;
      a ? c = (a - a % 26) / 26 : c = 0;
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
    }, f.prototype.ishrn = function(i, a, d) {
      return s(this.negative === 0), this.iushrn(i, a, d);
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
      var a = i % 26, d = (i - a) / 26, c = 1 << a;
      if (this.length <= d)
        return !1;
      var v = this.words[d];
      return !!(v & c);
    }, f.prototype.imaskn = function(i) {
      s(typeof i == "number" && i >= 0);
      var a = i % 26, d = (i - a) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= d)
        return this;
      if (a !== 0 && d++, this.length = Math.min(d, this.length), a !== 0) {
        var c = 67108863 ^ 67108863 >>> a << a;
        this.words[this.length - 1] &= c;
      }
      return this._strip();
    }, f.prototype.maskn = function(i) {
      return this.clone().imaskn(i);
    }, f.prototype.iaddn = function(i) {
      return s(typeof i == "number"), s(i < 67108864), i < 0 ? this.isubn(-i) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= i ? (this.words[0] = i - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(i), this.negative = 1, this) : this._iaddn(i);
    }, f.prototype._iaddn = function(i) {
      this.words[0] += i;
      for (var a = 0; a < this.length && this.words[a] >= 67108864; a++)
        this.words[a] -= 67108864, a === this.length - 1 ? this.words[a + 1] = 1 : this.words[a + 1]++;
      return this.length = Math.max(this.length, a + 1), this;
    }, f.prototype.isubn = function(i) {
      if (s(typeof i == "number"), s(i < 67108864), i < 0)
        return this.iaddn(-i);
      if (this.negative !== 0)
        return this.negative = 0, this.iaddn(i), this.negative = 1, this;
      if (this.words[0] -= i, this.length === 1 && this.words[0] < 0)
        this.words[0] = -this.words[0], this.negative = 1;
      else
        for (var a = 0; a < this.length && this.words[a] < 0; a++)
          this.words[a] += 67108864, this.words[a + 1] -= 1;
      return this._strip();
    }, f.prototype.addn = function(i) {
      return this.clone().iaddn(i);
    }, f.prototype.subn = function(i) {
      return this.clone().isubn(i);
    }, f.prototype.iabs = function() {
      return this.negative = 0, this;
    }, f.prototype.abs = function() {
      return this.clone().iabs();
    }, f.prototype._ishlnsubmul = function(i, a, d) {
      var c = i.length + d, v;
      this._expand(c);
      var u, e = 0;
      for (v = 0; v < i.length; v++) {
        u = (this.words[v + d] | 0) + e;
        var l = (i.words[v] | 0) * a;
        u -= l & 67108863, e = (u >> 26) - (l / 67108864 | 0), this.words[v + d] = u & 67108863;
      }
      for (; v < this.length - d; v++)
        u = (this.words[v + d] | 0) + e, e = u >> 26, this.words[v + d] = u & 67108863;
      if (e === 0)
        return this._strip();
      for (s(e === -1), e = 0, v = 0; v < this.length; v++)
        u = -(this.words[v] | 0) + e, e = u >> 26, this.words[v] = u & 67108863;
      return this.negative = 1, this._strip();
    }, f.prototype._wordDiv = function(i, a) {
      var d = this.length - i.length, c = this.clone(), v = i, u = v.words[v.length - 1] | 0, e = this._countBits(u);
      d = 26 - e, d !== 0 && (v = v.ushln(d), c.iushln(d), u = v.words[v.length - 1] | 0);
      var l = c.length - v.length, b;
      if (a !== "mod") {
        b = new f(null), b.length = l + 1, b.words = new Array(b.length);
        for (var _ = 0; _ < b.length; _++)
          b.words[_] = 0;
      }
      var C = c.clone()._ishlnsubmul(v, 1, l);
      C.negative === 0 && (c = C, b && (b.words[l] = 1));
      for (var F = l - 1; F >= 0; F--) {
        var O = (c.words[v.length + F] | 0) * 67108864 + (c.words[v.length + F - 1] | 0);
        for (O = Math.min(O / u | 0, 67108863), c._ishlnsubmul(v, O, F); c.negative !== 0; )
          O--, c.negative = 0, c._ishlnsubmul(v, 1, F), c.isZero() || (c.negative ^= 1);
        b && (b.words[F] = O);
      }
      return b && b._strip(), c._strip(), a !== "div" && d !== 0 && c.iushrn(d), {
        div: b || null,
        mod: c
      };
    }, f.prototype.divmod = function(i, a, d) {
      if (s(!i.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var c, v, u;
      return this.negative !== 0 && i.negative === 0 ? (u = this.neg().divmod(i, a), a !== "mod" && (c = u.div.neg()), a !== "div" && (v = u.mod.neg(), d && v.negative !== 0 && v.iadd(i)), {
        div: c,
        mod: v
      }) : this.negative === 0 && i.negative !== 0 ? (u = this.divmod(i.neg(), a), a !== "mod" && (c = u.div.neg()), {
        div: c,
        mod: u.mod
      }) : this.negative & i.negative ? (u = this.neg().divmod(i.neg(), a), a !== "div" && (v = u.mod.neg(), d && v.negative !== 0 && v.isub(i)), {
        div: u.div,
        mod: v
      }) : i.length > this.length || this.cmp(i) < 0 ? {
        div: new f(0),
        mod: this
      } : i.length === 1 ? a === "div" ? {
        div: this.divn(i.words[0]),
        mod: null
      } : a === "mod" ? {
        div: null,
        mod: new f(this.modrn(i.words[0]))
      } : {
        div: this.divn(i.words[0]),
        mod: new f(this.modrn(i.words[0]))
      } : this._wordDiv(i, a);
    }, f.prototype.div = function(i) {
      return this.divmod(i, "div", !1).div;
    }, f.prototype.mod = function(i) {
      return this.divmod(i, "mod", !1).mod;
    }, f.prototype.umod = function(i) {
      return this.divmod(i, "mod", !0).mod;
    }, f.prototype.divRound = function(i) {
      var a = this.divmod(i);
      if (a.mod.isZero())
        return a.div;
      var d = a.div.negative !== 0 ? a.mod.isub(i) : a.mod, c = i.ushrn(1), v = i.andln(1), u = d.cmp(c);
      return u < 0 || v === 1 && u === 0 ? a.div : a.div.negative !== 0 ? a.div.isubn(1) : a.div.iaddn(1);
    }, f.prototype.modrn = function(i) {
      var a = i < 0;
      a && (i = -i), s(i <= 67108863);
      for (var d = (1 << 26) % i, c = 0, v = this.length - 1; v >= 0; v--)
        c = (d * c + (this.words[v] | 0)) % i;
      return a ? -c : c;
    }, f.prototype.modn = function(i) {
      return this.modrn(i);
    }, f.prototype.idivn = function(i) {
      var a = i < 0;
      a && (i = -i), s(i <= 67108863);
      for (var d = 0, c = this.length - 1; c >= 0; c--) {
        var v = (this.words[c] | 0) + d * 67108864;
        this.words[c] = v / i | 0, d = v % i;
      }
      return this._strip(), a ? this.ineg() : this;
    }, f.prototype.divn = function(i) {
      return this.clone().idivn(i);
    }, f.prototype.egcd = function(i) {
      s(i.negative === 0), s(!i.isZero());
      var a = this, d = i.clone();
      a.negative !== 0 ? a = a.umod(i) : a = a.clone();
      for (var c = new f(1), v = new f(0), u = new f(0), e = new f(1), l = 0; a.isEven() && d.isEven(); )
        a.iushrn(1), d.iushrn(1), ++l;
      for (var b = d.clone(), _ = a.clone(); !a.isZero(); ) {
        for (var C = 0, F = 1; !(a.words[0] & F) && C < 26; ++C, F <<= 1)
          ;
        if (C > 0)
          for (a.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(b), v.isub(_)), c.iushrn(1), v.iushrn(1);
        for (var O = 0, R = 1; !(d.words[0] & R) && O < 26; ++O, R <<= 1)
          ;
        if (O > 0)
          for (d.iushrn(O); O-- > 0; )
            (u.isOdd() || e.isOdd()) && (u.iadd(b), e.isub(_)), u.iushrn(1), e.iushrn(1);
        a.cmp(d) >= 0 ? (a.isub(d), c.isub(u), v.isub(e)) : (d.isub(a), u.isub(c), e.isub(v));
      }
      return {
        a: u,
        b: e,
        gcd: d.iushln(l)
      };
    }, f.prototype._invmp = function(i) {
      s(i.negative === 0), s(!i.isZero());
      var a = this, d = i.clone();
      a.negative !== 0 ? a = a.umod(i) : a = a.clone();
      for (var c = new f(1), v = new f(0), u = d.clone(); a.cmpn(1) > 0 && d.cmpn(1) > 0; ) {
        for (var e = 0, l = 1; !(a.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (a.iushrn(e); e-- > 0; )
            c.isOdd() && c.iadd(u), c.iushrn(1);
        for (var b = 0, _ = 1; !(d.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (d.iushrn(b); b-- > 0; )
            v.isOdd() && v.iadd(u), v.iushrn(1);
        a.cmp(d) >= 0 ? (a.isub(d), c.isub(v)) : (d.isub(a), v.isub(c));
      }
      var C;
      return a.cmpn(1) === 0 ? C = c : C = v, C.cmpn(0) < 0 && C.iadd(i), C;
    }, f.prototype.gcd = function(i) {
      if (this.isZero())
        return i.abs();
      if (i.isZero())
        return this.abs();
      var a = this.clone(), d = i.clone();
      a.negative = 0, d.negative = 0;
      for (var c = 0; a.isEven() && d.isEven(); c++)
        a.iushrn(1), d.iushrn(1);
      do {
        for (; a.isEven(); )
          a.iushrn(1);
        for (; d.isEven(); )
          d.iushrn(1);
        var v = a.cmp(d);
        if (v < 0) {
          var u = a;
          a = d, d = u;
        } else if (v === 0 || d.cmpn(1) === 0)
          break;
        a.isub(d);
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
      var a = i % 26, d = (i - a) / 26, c = 1 << a;
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
      var a = i < 0;
      if (this.negative !== 0 && !a)
        return -1;
      if (this.negative === 0 && a)
        return 1;
      this._strip();
      var d;
      if (this.length > 1)
        d = 1;
      else {
        a && (i = -i), s(i <= 67108863, "Number is too big");
        var c = this.words[0] | 0;
        d = c === i ? 0 : c < i ? -1 : 1;
      }
      return this.negative !== 0 ? -d | 0 : d;
    }, f.prototype.cmp = function(i) {
      if (this.negative !== 0 && i.negative === 0)
        return -1;
      if (this.negative === 0 && i.negative !== 0)
        return 1;
      var a = this.ucmp(i);
      return this.negative !== 0 ? -a | 0 : a;
    }, f.prototype.ucmp = function(i) {
      if (this.length > i.length)
        return 1;
      if (this.length < i.length)
        return -1;
      for (var a = 0, d = this.length - 1; d >= 0; d--) {
        var c = this.words[d] | 0, v = i.words[d] | 0;
        if (c !== v) {
          c < v ? a = -1 : c > v && (a = 1);
          break;
        }
      }
      return a;
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
      var a = i, d;
      do
        this.split(a, this.tmp), a = this.imulK(a), a = a.iadd(this.tmp), d = a.bitLength();
      while (d > this.n);
      var c = d < this.n ? -1 : a.ucmp(this.p);
      return c === 0 ? (a.words[0] = 0, a.length = 1) : c > 0 ? a.isub(this.p) : a.strip !== void 0 ? a.strip() : a._strip(), a;
    }, Bt.prototype.split = function(i, a) {
      i.iushrn(this.n, 0, a);
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
    m(Ct, Bt), Ct.prototype.split = function(i, a) {
      for (var d = 4194303, c = Math.min(i.length, 9), v = 0; v < c; v++)
        a.words[v] = i.words[v];
      if (a.length = c, i.length <= 9) {
        i.words[0] = 0, i.length = 1;
        return;
      }
      var u = i.words[9];
      for (a.words[a.length++] = u & d, v = 10; v < i.length; v++) {
        var e = i.words[v] | 0;
        i.words[v - 10] = (e & d) << 4 | u >>> 22, u = e;
      }
      u >>>= 22, i.words[v - 10] = u, u === 0 && i.length > 10 ? i.length -= 10 : i.length -= 9;
    }, Ct.prototype.imulK = function(i) {
      i.words[i.length] = 0, i.words[i.length + 1] = 0, i.length += 2;
      for (var a = 0, d = 0; d < i.length; d++) {
        var c = i.words[d] | 0;
        a += c * 977, i.words[d] = a & 67108863, a = c * 64 + (a / 67108864 | 0);
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
    function kt() {
      Bt.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(kt, Bt), kt.prototype.imulK = function(i) {
      for (var a = 0, d = 0; d < i.length; d++) {
        var c = (i.words[d] | 0) * 19 + a, v = c & 67108863;
        c >>>= 26, i.words[d] = v, a = c;
      }
      return a !== 0 && (i.words[i.length++] = a), i;
    }, f._prime = function(i) {
      if (At[i])
        return At[i];
      var a;
      if (i === "k256")
        a = new Ct();
      else if (i === "p224")
        a = new Et();
      else if (i === "p192")
        a = new Y();
      else if (i === "p25519")
        a = new kt();
      else
        throw new Error("Unknown prime " + i);
      return At[i] = a, a;
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
    }, p.prototype._verify2 = function(i, a) {
      s((i.negative | a.negative) === 0, "red works only with positives"), s(
        i.red && i.red === a.red,
        "red works only with red numbers"
      );
    }, p.prototype.imod = function(i) {
      return this.prime ? this.prime.ireduce(i)._forceRed(this) : (M(i, i.umod(this.m)._forceRed(this)), i);
    }, p.prototype.neg = function(i) {
      return i.isZero() ? i.clone() : this.m.sub(i)._forceRed(this);
    }, p.prototype.add = function(i, a) {
      this._verify2(i, a);
      var d = i.add(a);
      return d.cmp(this.m) >= 0 && d.isub(this.m), d._forceRed(this);
    }, p.prototype.iadd = function(i, a) {
      this._verify2(i, a);
      var d = i.iadd(a);
      return d.cmp(this.m) >= 0 && d.isub(this.m), d;
    }, p.prototype.sub = function(i, a) {
      this._verify2(i, a);
      var d = i.sub(a);
      return d.cmpn(0) < 0 && d.iadd(this.m), d._forceRed(this);
    }, p.prototype.isub = function(i, a) {
      this._verify2(i, a);
      var d = i.isub(a);
      return d.cmpn(0) < 0 && d.iadd(this.m), d;
    }, p.prototype.shl = function(i, a) {
      return this._verify1(i), this.imod(i.ushln(a));
    }, p.prototype.imul = function(i, a) {
      return this._verify2(i, a), this.imod(i.imul(a));
    }, p.prototype.mul = function(i, a) {
      return this._verify2(i, a), this.imod(i.mul(a));
    }, p.prototype.isqr = function(i) {
      return this.imul(i, i.clone());
    }, p.prototype.sqr = function(i) {
      return this.mul(i, i);
    }, p.prototype.sqrt = function(i) {
      if (i.isZero())
        return i.clone();
      var a = this.m.andln(3);
      if (s(a % 2 === 1), a === 3) {
        var d = this.m.add(new f(1)).iushrn(2);
        return this.pow(i, d);
      }
      for (var c = this.m.subn(1), v = 0; !c.isZero() && c.andln(1) === 0; )
        v++, c.iushrn(1);
      s(!c.isZero());
      var u = new f(1).toRed(this), e = u.redNeg(), l = this.m.subn(1).iushrn(1), b = this.m.bitLength();
      for (b = new f(2 * b * b).toRed(this); this.pow(b, l).cmp(e) !== 0; )
        b.redIAdd(e);
      for (var _ = this.pow(b, c), C = this.pow(i, c.addn(1).iushrn(1)), F = this.pow(i, c), O = v; F.cmp(u) !== 0; ) {
        for (var R = F, P = 0; R.cmp(u) !== 0; P++)
          R = R.redSqr();
        s(P < O);
        var $ = this.pow(_, new f(1).iushln(O - P - 1));
        C = C.redMul($), _ = $.redSqr(), F = F.redMul(_), O = P;
      }
      return C;
    }, p.prototype.invm = function(i) {
      var a = i._invmp(this.m);
      return a.negative !== 0 ? (a.negative = 0, this.imod(a).redNeg()) : this.imod(a);
    }, p.prototype.pow = function(i, a) {
      if (a.isZero())
        return new f(1).toRed(this);
      if (a.cmpn(1) === 0)
        return i.clone();
      var d = 4, c = new Array(1 << d);
      c[0] = new f(1).toRed(this), c[1] = i;
      for (var v = 2; v < c.length; v++)
        c[v] = this.mul(c[v - 1], i);
      var u = c[0], e = 0, l = 0, b = a.bitLength() % 26;
      for (b === 0 && (b = 26), v = a.length - 1; v >= 0; v--) {
        for (var _ = a.words[v], C = b - 1; C >= 0; C--) {
          var F = _ >> C & 1;
          if (u !== c[0] && (u = this.sqr(u)), F === 0 && e === 0) {
            l = 0;
            continue;
          }
          e <<= 1, e |= F, l++, !(l !== d && (v !== 0 || C !== 0)) && (u = this.mul(u, c[e]), l = 0, e = 0);
        }
        b = 26;
      }
      return u;
    }, p.prototype.convertTo = function(i) {
      var a = i.umod(this.m);
      return a === i ? a.clone() : a;
    }, p.prototype.convertFrom = function(i) {
      var a = i.clone();
      return a.red = null, a;
    }, f.mont = function(i) {
      return new t(i);
    };
    function t(r) {
      p.call(this, r), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(t, p), t.prototype.convertTo = function(i) {
      return this.imod(i.ushln(this.shift));
    }, t.prototype.convertFrom = function(i) {
      var a = this.imod(i.mul(this.rinv));
      return a.red = null, a;
    }, t.prototype.imul = function(i, a) {
      if (i.isZero() || a.isZero())
        return i.words[0] = 0, i.length = 1, i;
      var d = i.imul(a), c = d.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), v = d.isub(c).iushrn(this.shift), u = v;
      return v.cmp(this.m) >= 0 ? u = v.isub(this.m) : v.cmpn(0) < 0 && (u = v.iadd(this.m)), u._forceRed(this);
    }, t.prototype.mul = function(i, a) {
      if (i.isZero() || a.isZero())
        return new f(0)._forceRed(this);
      var d = i.mul(a), c = d.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), v = d.isub(c).iushrn(this.shift), u = v;
      return v.cmp(this.m) >= 0 ? u = v.isub(this.m) : v.cmpn(0) < 0 && (u = v.iadd(this.m)), u._forceRed(this);
    }, t.prototype.invm = function(i) {
      var a = this.imod(i._invmp(this.m).mul(this.r2));
      return a._forceRed(this);
    };
  })(h, Gt);
})($0);
var N0 = $0.exports, si = N0, Av = gi, Bv = Ot.Buffer;
function no(h) {
  var n = h.modulus.byteLength(), o;
  do
    o = new si(Av(n));
  while (o.cmp(h.modulus) >= 0 || !o.umod(h.prime1) || !o.umod(h.prime2));
  return o;
}
function Ev(h) {
  var n = no(h), o = n.toRed(si.mont(h.modulus)).redPow(new si(h.publicExponent)).fromRed();
  return { blinder: o, unblinder: n.invm(h.modulus) };
}
function fo(h, n) {
  var o = Ev(n), s = n.modulus.byteLength(), m = new si(h).mul(o.blinder).umod(n.modulus), f = m.toRed(si.mont(n.prime1)), g = m.toRed(si.mont(n.prime2)), y = n.coefficient, S = n.prime1, B = n.prime2, M = f.redPow(n.exponent1).fromRed(), x = g.redPow(n.exponent2).fromRed(), k = M.isub(x).imul(y).umod(S).imul(B);
  return x.iadd(k).imul(o.unblinder).umod(n.modulus).toArrayLike(Bv, "be", s);
}
fo.getr = no;
var U0 = fo, If = {};
const Iv = "elliptic", kv = "6.6.1", Rv = "EC cryptography", Tv = "lib/elliptic.js", Cv = [
  "lib"
], qv = {
  lint: "eslint lib test",
  "lint:fix": "npm run lint -- --fix",
  unit: "istanbul test _mocha --reporter=spec test/index.js",
  test: "npm run lint && npm run unit",
  version: "grunt dist && git add dist/"
}, Fv = {
  type: "git",
  url: "git@github.com:indutny/elliptic"
}, Pv = [
  "EC",
  "Elliptic",
  "curve",
  "Cryptography"
], Dv = "Fedor Indutny <fedor@indutny.com>", $v = "MIT", Nv = {
  url: "https://github.com/indutny/elliptic/issues"
}, Uv = "https://github.com/indutny/elliptic", Lv = {
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
}, Ov = {
  "bn.js": "^4.11.9",
  brorand: "^1.1.0",
  "hash.js": "^1.0.0",
  "hmac-drbg": "^1.0.1",
  inherits: "^2.0.4",
  "minimalistic-assert": "^1.0.1",
  "minimalistic-crypto-utils": "^1.0.1"
}, zv = {
  name: Iv,
  version: kv,
  description: Rv,
  main: Tv,
  files: Cv,
  scripts: qv,
  repository: Fv,
  keywords: Pv,
  author: Dv,
  license: $v,
  bugs: Nv,
  homepage: Uv,
  devDependencies: Lv,
  dependencies: Ov
};
var ze = {}, L0 = { exports: {} };
L0.exports;
(function(h) {
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
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Pe.Buffer;
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
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (a = t.length - 1, d = 0; a >= 0; a -= 3)
          c = t[a] | t[a - 1] << 8 | t[a - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (a = 0, d = 0; a < t.length; a += 3)
          c = t[a] | t[a + 1] << 8 | t[a + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (a = u % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var a = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        a *= i, v >= 49 ? a += v - 49 + 10 : v >= 17 ? a += v - 17 + 10 : a += v;
      }
      return a;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var a = 0, d = 1; d <= 67108863; d *= r)
        a++;
      a--, d = d / r | 0;
      for (var c = t.length - i, v = c % a, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += a)
        e = B(t, l, l + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    ], k = [
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
        for (var a = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = k[t];
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
      var a = this.byteLength(), d = i || Math.max(1, a);
      s(a <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
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
    function I(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, a = r % 26;
        t[r] = (p.words[i] & 1 << a) >>> a;
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
      for (var a = 0; a < i.length; a++)
        this.words[a] = r.words[a] ^ i.words[a];
      if (this !== r)
        for (; a < r.length; a++)
          this.words[a] = r.words[a];
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
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, a = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << a : this.words[i] = this.words[i] & ~(1 << a), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, a;
      this.length > t.length ? (i = this, a = t) : (i = t, a = this);
      for (var d = 0, c = 0; c < a.length; c++)
        r = (i.words[c] | 0) + (a.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
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
      var a, d;
      i > 0 ? (a = this, d = t) : (a = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (a.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < a.length; v++)
        r = (a.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < a.length && a !== this)
        for (; v < a.length; v++)
          this.words[v] = a.words[v];
      return this.length = Math.max(this.length, v), a !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var F = e - C | 0;
          a = p.words[F] | 0, d = t.words[C] | 0, c = a * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var L = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = a[0] | 0, _ = b & 8191, C = b >>> 13, F = a[1] | 0, O = F & 8191, R = F >>> 13, P = a[2] | 0, $ = P & 8191, K = P >>> 13, It = a[3] | 0, Z = It & 8191, J = It >>> 13, qt = a[4] | 0, tt = qt & 8191, vt = qt >>> 13, Dt = a[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = a[6] | 0, j = Pt & 8191, dt = Pt >>> 13, Ft = a[7] | 0, Q = Ft & 8191, ct = Ft >>> 13, Lt = a[8] | 0, E = Lt & 8191, w = Lt >>> 13, A = a[9] | 0, T = A & 8191, q = A >>> 13, V = d[0] | 0, U = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, zt = d[3] | 0, nt = zt & 8191, bt = zt >>> 13, Kt = d[4] | 0, ft = Kt & 8191, yt = Kt >>> 13, Ht = d[5] | 0, at = Ht & 8191, wt = Ht >>> 13, Zt = d[6] | 0, ht = Zt & 8191, Mt = Zt >>> 13, Wt = d[7] | 0, st = Wt & 8191, xt = Wt >>> 13, Vt = d[8] | 0, ot = Vt & 8191, _t = Vt >>> 13, Yt = d[9] | 0, ut = Yt & 8191, St = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, U), e = Math.imul(_, X), e = e + Math.imul(C, U) | 0, l = Math.imul(C, X);
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(O, U), e = Math.imul(O, X), e = e + Math.imul(R, U) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul($, U), e = Math.imul($, X), e = e + Math.imul(K, U) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var jt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, u = Math.imul(Z, U), e = Math.imul(Z, X), e = e + Math.imul(J, U) | 0, l = Math.imul(J, X), u = u + Math.imul($, G) | 0, e = e + Math.imul($, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(tt, U), e = Math.imul(tt, X), e = e + Math.imul(vt, U) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul($, it) | 0, e = e + Math.imul($, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(et, U), e = Math.imul(et, X), e = e + Math.imul(pt, U) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul($, nt) | 0, e = e + Math.imul($, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(j, U), e = Math.imul(j, X), e = e + Math.imul(dt, U) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul($, ft) | 0, e = e + Math.imul($, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(Q, U), e = Math.imul(Q, X), e = e + Math.imul(ct, U) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul($, at) | 0, e = e + Math.imul($, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(E, U), e = Math.imul(E, X), e = e + Math.imul(w, U) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul($, ht) | 0, e = e + Math.imul($, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(T, U), e = Math.imul(T, X), e = e + Math.imul(q, U) | 0, l = Math.imul(q, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul($, st) | 0, e = e + Math.imul($, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(q, G) | 0, l = Math.imul(q, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul($, ot) | 0, e = e + Math.imul($, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(q, it) | 0, l = Math.imul(q, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul($, ut) | 0, e = e + Math.imul($, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(q, nt) | 0, l = Math.imul(q, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(q, ft) | 0, l = Math.imul(q, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(q, at) | 0, l = Math.imul(q, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(q, ht) | 0, l = Math.imul(q, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(q, st) | 0, l = Math.imul(q, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(q, ot) | 0, l = Math.imul(q, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(q, ut) | 0, l = Math.imul(q, St);
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = $t, c[1] = Nt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (L = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, F = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, F = F + v | 0, v = F & 67108863, c = c + (F >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new N();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = L(this, t, r) : a < 63 ? i = D(this, t, r) : a < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function N(p, t) {
      this.x = p, this.y = t;
    }
    N.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, N.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, N.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, N.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, F = 0; F < v; F++) {
            var O = i[b + F], R = a[b + F], P = i[b + F + v], $ = a[b + F + v], K = _ * P - C * $;
            $ = _ * $ + C * P, P = K, i[b + F] = O + P, a[b + F] = R + $, i[b + F + v] = O - P, a[b + F + v] = R - $, F !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, N.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, N.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, N.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, N.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, N.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, N.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), u = new Array(a), e = new Array(a), l = new Array(a), b = new Array(a), _ = new Array(a), C = i.words;
      C.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, l, a), this.transform(v, c, u, e, a, d), this.transform(l, c, b, _, a, d);
      for (var F = 0; F < a; F++) {
        var O = u[F] * b[F] - e[F] * _[F];
        e[F] = u[F] * _[F] + e[F] * b[F], u[F] = O;
      }
      return this.conjugate(u, e, a), this.transform(u, e, C, c, a, d), this.conjugate(C, c, a), this.normalize13b(C, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
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
        var a = (this.words[i] | 0) * t, d = (a & 67108863) + (r & 67108863);
        r >>= 26, r += a / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = I(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, u = (this.words[d] | 0) - v << r;
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
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (a -= c, a = Math.max(0, a), u) {
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
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= a); e--) {
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
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
      var a = t.length + i, d;
      this._expand(a);
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
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var u = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = a.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (a = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (a.words[d.length + _] | 0) * 67108864 + (a.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), a._ishlnsubmul(d, C, _); a.negative !== 0; )
          C--, a.negative = 0, a._ishlnsubmul(d, 1, _), a.isZero() || (a.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var a, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (a = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: a,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (a = c.div.neg()), {
        div: a,
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
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, a = t.ushrn(1), d = t.andln(1), c = i.cmp(a);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(l)), a.iushrn(1), d.iushrn(1);
        for (var C = 0, F = 1; !(i.words[0] & F) && C < 26; ++C, F <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
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
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var b;
      return r.cmpn(1) === 0 ? b = a : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var a = 0; r.isEven() && i.isEven(); a++)
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
      return i.iushln(a);
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= a, this;
      for (var d = a, c = i; d !== 0 && c < this.length; c++) {
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
        var a = this.words[0] | 0;
        i = a === t ? 0 : a < t ? -1 : 1;
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
        var a = this.words[i] | 0, d = t.words[i] | 0;
        if (a !== d) {
          a < d ? r = -1 : a > d && (r = 1);
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
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
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
      for (var i = 4194303, a = Math.min(t.length, 9), d = 0; d < a; d++)
        r.words[d] = t.words[d];
      if (r.length = a, t.length <= 9) {
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
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
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
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
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
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      s(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, a), b = this.pow(t, a.addn(1).iushrn(1)), _ = this.pow(t, a), C = d; _.cmp(c) !== 0; ) {
        for (var F = _, O = 0; F.cmp(c) !== 0; O++)
          F = F.redSqr();
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
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== a[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, a[v]), u = 0, v = 0);
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
      return new kt(t);
    };
    function kt(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(kt, Y), kt.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, kt.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, kt.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(L0);
var Rr = L0.exports, O0 = {};
(function(h) {
  var n = h;
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
})(O0);
(function(h) {
  var n = h, o = Rr, s = We, m = O0;
  n.assert = s, n.toArray = m.toArray, n.zero2 = m.zero2, n.toHex = m.toHex, n.encode = m.encode;
  function f(M, x, k) {
    var I = new Array(Math.max(M.bitLength(), k) + 1), D;
    for (D = 0; D < I.length; D += 1)
      I[D] = 0;
    var L = 1 << x + 1, W = M.clone();
    for (D = 0; D < I.length; D++) {
      var z, N = W.andln(L - 1);
      W.isOdd() ? (N > (L >> 1) - 1 ? z = (L >> 1) - N : z = N, W.isubn(z)) : z = 0, I[D] = z, W.iushrn(1);
    }
    return I;
  }
  n.getNAF = f;
  function g(M, x) {
    var k = [
      [],
      []
    ];
    M = M.clone(), x = x.clone();
    for (var I = 0, D = 0, L; M.cmpn(-I) > 0 || x.cmpn(-D) > 0; ) {
      var W = M.andln(3) + I & 3, z = x.andln(3) + D & 3;
      W === 3 && (W = -1), z === 3 && (z = -1);
      var N;
      W & 1 ? (L = M.andln(7) + I & 7, (L === 3 || L === 5) && z === 2 ? N = -W : N = W) : N = 0, k[0].push(N);
      var lt;
      z & 1 ? (L = x.andln(7) + D & 7, (L === 3 || L === 5) && W === 2 ? lt = -z : lt = z) : lt = 0, k[1].push(lt), 2 * I === N + 1 && (I = 1 - I), 2 * D === lt + 1 && (D = 1 - D), M.iushrn(1), x.iushrn(1);
    }
    return k;
  }
  n.getJSF = g;
  function y(M, x, k) {
    var I = "_" + x;
    M.prototype[x] = function() {
      return this[I] !== void 0 ? this[I] : this[I] = k.call(this);
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
})(ze);
var z0 = {}, Kr = Rr, rn = ze, Bn = rn.getNAF, Kv = rn.getJSF, En = rn.assert;
function Ur(h, n) {
  this.type = h, this.p = new Kr(n.p, 16), this.red = n.prime ? Kr.red(n.prime) : Kr.mont(this.p), this.zero = new Kr(0).toRed(this.red), this.one = new Kr(1).toRed(this.red), this.two = new Kr(2).toRed(this.red), this.n = n.n && new Kr(n.n, 16), this.g = n.g && this.pointFromJSON(n.g, n.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
  var o = this.n && this.p.div(this.n);
  !o || o.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
}
var Xn = Ur;
Ur.prototype.point = function() {
  throw new Error("Not implemented");
};
Ur.prototype.validate = function() {
  throw new Error("Not implemented");
};
Ur.prototype._fixedNafMul = function(n, o) {
  En(n.precomputed);
  var s = n._getDoubles(), m = Bn(o, 1, this._bitLength), f = (1 << s.step + 1) - (s.step % 2 === 0 ? 2 : 1);
  f /= 3;
  var g = [], y, S;
  for (y = 0; y < m.length; y += s.step) {
    S = 0;
    for (var B = y + s.step - 1; B >= y; B--)
      S = (S << 1) + m[B];
    g.push(S);
  }
  for (var M = this.jpoint(null, null, null), x = this.jpoint(null, null, null), k = f; k > 0; k--) {
    for (y = 0; y < g.length; y++)
      S = g[y], S === k ? x = x.mixedAdd(s.points[y]) : S === -k && (x = x.mixedAdd(s.points[y].neg()));
    M = M.add(x);
  }
  return M.toP();
};
Ur.prototype._wnafMul = function(n, o) {
  var s = 4, m = n._getNAFPoints(s);
  s = m.wnd;
  for (var f = m.points, g = Bn(o, s, this._bitLength), y = this.jpoint(null, null, null), S = g.length - 1; S >= 0; S--) {
    for (var B = 0; S >= 0 && g[S] === 0; S--)
      B++;
    if (S >= 0 && B++, y = y.dblp(B), S < 0)
      break;
    var M = g[S];
    En(M !== 0), n.type === "affine" ? M > 0 ? y = y.mixedAdd(f[M - 1 >> 1]) : y = y.mixedAdd(f[-M - 1 >> 1].neg()) : M > 0 ? y = y.add(f[M - 1 >> 1]) : y = y.add(f[-M - 1 >> 1].neg());
  }
  return n.type === "affine" ? y.toP() : y;
};
Ur.prototype._wnafMulAdd = function(n, o, s, m, f) {
  var g = this._wnafT1, y = this._wnafT2, S = this._wnafT3, B = 0, M, x, k;
  for (M = 0; M < m; M++) {
    k = o[M];
    var I = k._getNAFPoints(n);
    g[M] = I.wnd, y[M] = I.points;
  }
  for (M = m - 1; M >= 1; M -= 2) {
    var D = M - 1, L = M;
    if (g[D] !== 1 || g[L] !== 1) {
      S[D] = Bn(s[D], g[D], this._bitLength), S[L] = Bn(s[L], g[L], this._bitLength), B = Math.max(S[D].length, B), B = Math.max(S[L].length, B);
      continue;
    }
    var W = [
      o[D],
      /* 1 */
      null,
      /* 3 */
      null,
      /* 5 */
      o[L]
      /* 7 */
    ];
    o[D].y.cmp(o[L].y) === 0 ? (W[1] = o[D].add(o[L]), W[2] = o[D].toJ().mixedAdd(o[L].neg())) : o[D].y.cmp(o[L].y.redNeg()) === 0 ? (W[1] = o[D].toJ().mixedAdd(o[L]), W[2] = o[D].add(o[L].neg())) : (W[1] = o[D].toJ().mixedAdd(o[L]), W[2] = o[D].toJ().mixedAdd(o[L].neg()));
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
    ], N = Kv(s[D], s[L]);
    for (B = Math.max(N[0].length, B), S[D] = new Array(B), S[L] = new Array(B), x = 0; x < B; x++) {
      var lt = N[0][x] | 0, H = N[1][x] | 0;
      S[D][x] = z[(lt + 1) * 3 + (H + 1)], S[L][x] = 0, y[D] = W;
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
      Y !== 0 && (Y > 0 ? k = y[x][Y - 1 >> 1] : Y < 0 && (k = y[x][-Y - 1 >> 1].neg()), k.type === "affine" ? At = At.mixedAdd(k) : At = At.add(k));
    }
  }
  for (M = 0; M < m; M++)
    y[M] = null;
  return f ? At : At.toP();
};
function Ye(h, n) {
  this.curve = h, this.type = n, this.precomputed = null;
}
Ur.BasePoint = Ye;
Ye.prototype.eq = function() {
  throw new Error("Not implemented");
};
Ye.prototype.validate = function() {
  return this.curve.validate(this);
};
Ur.prototype.decodePoint = function(n, o) {
  n = rn.toArray(n, o);
  var s = this.p.byteLength();
  if ((n[0] === 4 || n[0] === 6 || n[0] === 7) && n.length - 1 === 2 * s) {
    n[0] === 6 ? En(n[n.length - 1] % 2 === 0) : n[0] === 7 && En(n[n.length - 1] % 2 === 1);
    var m = this.point(
      n.slice(1, 1 + s),
      n.slice(1 + s, 1 + 2 * s)
    );
    return m;
  } else if ((n[0] === 2 || n[0] === 3) && n.length - 1 === s)
    return this.pointFromX(n.slice(1, 1 + s), n[0] === 3);
  throw new Error("Unknown point format");
};
Ye.prototype.encodeCompressed = function(n) {
  return this.encode(n, !0);
};
Ye.prototype._encode = function(n) {
  var o = this.curve.p.byteLength(), s = this.getX().toArray("be", o);
  return n ? [this.getY().isEven() ? 2 : 3].concat(s) : [4].concat(s, this.getY().toArray("be", o));
};
Ye.prototype.encode = function(n, o) {
  return rn.encode(this._encode(o), n);
};
Ye.prototype.precompute = function(n) {
  if (this.precomputed)
    return this;
  var o = {
    doubles: null,
    naf: null,
    beta: null
  };
  return o.naf = this._getNAFPoints(8), o.doubles = this._getDoubles(4, n), o.beta = this._getBeta(), this.precomputed = o, this;
};
Ye.prototype._hasDoubles = function(n) {
  if (!this.precomputed)
    return !1;
  var o = this.precomputed.doubles;
  return o ? o.points.length >= Math.ceil((n.bitLength() + 1) / o.step) : !1;
};
Ye.prototype._getDoubles = function(n, o) {
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
Ye.prototype._getNAFPoints = function(n) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;
  for (var o = [this], s = (1 << n) - 1, m = s === 1 ? null : this.dbl(), f = 1; f < s; f++)
    o[f] = o[f - 1].add(m);
  return {
    wnd: n,
    points: o
  };
};
Ye.prototype._getBeta = function() {
  return null;
};
Ye.prototype.dblp = function(n) {
  for (var o = this, s = 0; s < n; s++)
    o = o.dbl();
  return o;
};
var Hv = ze, ge = Rr, K0 = Jt, wi = Xn, Zv = Hv.assert;
function Je(h) {
  wi.call(this, "short", h), this.a = new ge(h.a, 16).toRed(this.red), this.b = new ge(h.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(h), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
}
K0(Je, wi);
var Wv = Je;
Je.prototype._getEndomorphism = function(n) {
  if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
    var o, s;
    if (n.beta)
      o = new ge(n.beta, 16).toRed(this.red);
    else {
      var m = this._getEndoRoots(this.p);
      o = m[0].cmp(m[1]) < 0 ? m[0] : m[1], o = o.toRed(this.red);
    }
    if (n.lambda)
      s = new ge(n.lambda, 16);
    else {
      var f = this._getEndoRoots(this.n);
      this.g.mul(f[0]).x.cmp(this.g.x.redMul(o)) === 0 ? s = f[0] : (s = f[1], Zv(this.g.mul(s).x.cmp(this.g.x.redMul(o)) === 0));
    }
    var g;
    return n.basis ? g = n.basis.map(function(y) {
      return {
        a: new ge(y.a, 16),
        b: new ge(y.b, 16)
      };
    }) : g = this._getEndoBasis(s), {
      beta: o,
      lambda: s,
      basis: g
    };
  }
};
Je.prototype._getEndoRoots = function(n) {
  var o = n === this.p ? this.red : ge.mont(n), s = new ge(2).toRed(o).redInvm(), m = s.redNeg(), f = new ge(3).toRed(o).redNeg().redSqrt().redMul(s), g = m.redAdd(f).fromRed(), y = m.redSub(f).fromRed();
  return [g, y];
};
Je.prototype._getEndoBasis = function(n) {
  for (var o = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), s = n, m = this.n.clone(), f = new ge(1), g = new ge(0), y = new ge(0), S = new ge(1), B, M, x, k, I, D, L, W = 0, z, N; s.cmpn(0) !== 0; ) {
    var lt = m.div(s);
    z = m.sub(lt.mul(s)), N = y.sub(lt.mul(f));
    var H = S.sub(lt.mul(g));
    if (!x && z.cmp(o) < 0)
      B = L.neg(), M = f, x = z.neg(), k = N;
    else if (x && ++W === 2)
      break;
    L = z, m = s, s = z, y = f, f = N, S = g, g = H;
  }
  I = z.neg(), D = N;
  var At = x.sqr().add(k.sqr()), Bt = I.sqr().add(D.sqr());
  return Bt.cmp(At) >= 0 && (I = B, D = M), x.negative && (x = x.neg(), k = k.neg()), I.negative && (I = I.neg(), D = D.neg()), [
    { a: x, b: k },
    { a: I, b: D }
  ];
};
Je.prototype._endoSplit = function(n) {
  var o = this.endo.basis, s = o[0], m = o[1], f = m.b.mul(n).divRound(this.n), g = s.b.neg().mul(n).divRound(this.n), y = f.mul(s.a), S = g.mul(m.a), B = f.mul(s.b), M = g.mul(m.b), x = n.sub(y).sub(S), k = B.add(M).neg();
  return { k1: x, k2: k };
};
Je.prototype.pointFromX = function(n, o) {
  n = new ge(n, 16), n.red || (n = n.toRed(this.red));
  var s = n.redSqr().redMul(n).redIAdd(n.redMul(this.a)).redIAdd(this.b), m = s.redSqrt();
  if (m.redSqr().redSub(s).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var f = m.fromRed().isOdd();
  return (o && !f || !o && f) && (m = m.redNeg()), this.point(n, m);
};
Je.prototype.validate = function(n) {
  if (n.inf)
    return !0;
  var o = n.x, s = n.y, m = this.a.redMul(o), f = o.redSqr().redMul(o).redIAdd(m).redIAdd(this.b);
  return s.redSqr().redISub(f).cmpn(0) === 0;
};
Je.prototype._endoWnafMulAdd = function(n, o, s) {
  for (var m = this._endoWnafT1, f = this._endoWnafT2, g = 0; g < n.length; g++) {
    var y = this._endoSplit(o[g]), S = n[g], B = S._getBeta();
    y.k1.negative && (y.k1.ineg(), S = S.neg(!0)), y.k2.negative && (y.k2.ineg(), B = B.neg(!0)), m[g * 2] = S, m[g * 2 + 1] = B, f[g * 2] = y.k1, f[g * 2 + 1] = y.k2;
  }
  for (var M = this._wnafMulAdd(1, m, f, g * 2, s), x = 0; x < g * 2; x++)
    m[x] = null, f[x] = null;
  return M;
};
function Be(h, n, o, s) {
  wi.BasePoint.call(this, h, "affine"), n === null && o === null ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new ge(n, 16), this.y = new ge(o, 16), s && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
}
K0(Be, wi.BasePoint);
Je.prototype.point = function(n, o, s) {
  return new Be(this, n, o, s);
};
Je.prototype.pointFromJSON = function(n, o) {
  return Be.fromJSON(this, n, o);
};
Be.prototype._getBeta = function() {
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
Be.prototype.toJSON = function() {
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
Be.fromJSON = function(n, o, s) {
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
Be.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
};
Be.prototype.isInfinity = function() {
  return this.inf;
};
Be.prototype.add = function(n) {
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
Be.prototype.dbl = function() {
  if (this.inf)
    return this;
  var n = this.y.redAdd(this.y);
  if (n.cmpn(0) === 0)
    return this.curve.point(null, null);
  var o = this.curve.a, s = this.x.redSqr(), m = n.redInvm(), f = s.redAdd(s).redIAdd(s).redIAdd(o).redMul(m), g = f.redSqr().redISub(this.x.redAdd(this.x)), y = f.redMul(this.x.redSub(g)).redISub(this.y);
  return this.curve.point(g, y);
};
Be.prototype.getX = function() {
  return this.x.fromRed();
};
Be.prototype.getY = function() {
  return this.y.fromRed();
};
Be.prototype.mul = function(n) {
  return n = new ge(n, 16), this.isInfinity() ? this : this._hasDoubles(n) ? this.curve._fixedNafMul(this, n) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [n]) : this.curve._wnafMul(this, n);
};
Be.prototype.mulAdd = function(n, o, s) {
  var m = [this, o], f = [n, s];
  return this.curve.endo ? this.curve._endoWnafMulAdd(m, f) : this.curve._wnafMulAdd(1, m, f, 2);
};
Be.prototype.jmulAdd = function(n, o, s) {
  var m = [this, o], f = [n, s];
  return this.curve.endo ? this.curve._endoWnafMulAdd(m, f, !0) : this.curve._wnafMulAdd(1, m, f, 2, !0);
};
Be.prototype.eq = function(n) {
  return this === n || this.inf === n.inf && (this.inf || this.x.cmp(n.x) === 0 && this.y.cmp(n.y) === 0);
};
Be.prototype.neg = function(n) {
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
Be.prototype.toJ = function() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);
  var n = this.curve.jpoint(this.x, this.y, this.curve.one);
  return n;
};
function Ee(h, n, o, s) {
  wi.BasePoint.call(this, h, "jacobian"), n === null && o === null && s === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new ge(0)) : (this.x = new ge(n, 16), this.y = new ge(o, 16), this.z = new ge(s, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
}
K0(Ee, wi.BasePoint);
Je.prototype.jpoint = function(n, o, s) {
  return new Ee(this, n, o, s);
};
Ee.prototype.toP = function() {
  if (this.isInfinity())
    return this.curve.point(null, null);
  var n = this.z.redInvm(), o = n.redSqr(), s = this.x.redMul(o), m = this.y.redMul(o).redMul(n);
  return this.curve.point(s, m);
};
Ee.prototype.neg = function() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
Ee.prototype.add = function(n) {
  if (this.isInfinity())
    return n;
  if (n.isInfinity())
    return this;
  var o = n.z.redSqr(), s = this.z.redSqr(), m = this.x.redMul(o), f = n.x.redMul(s), g = this.y.redMul(o.redMul(n.z)), y = n.y.redMul(s.redMul(this.z)), S = m.redSub(f), B = g.redSub(y);
  if (S.cmpn(0) === 0)
    return B.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var M = S.redSqr(), x = M.redMul(S), k = m.redMul(M), I = B.redSqr().redIAdd(x).redISub(k).redISub(k), D = B.redMul(k.redISub(I)).redISub(g.redMul(x)), L = this.z.redMul(n.z).redMul(S);
  return this.curve.jpoint(I, D, L);
};
Ee.prototype.mixedAdd = function(n) {
  if (this.isInfinity())
    return n.toJ();
  if (n.isInfinity())
    return this;
  var o = this.z.redSqr(), s = this.x, m = n.x.redMul(o), f = this.y, g = n.y.redMul(o).redMul(this.z), y = s.redSub(m), S = f.redSub(g);
  if (y.cmpn(0) === 0)
    return S.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var B = y.redSqr(), M = B.redMul(y), x = s.redMul(B), k = S.redSqr().redIAdd(M).redISub(x).redISub(x), I = S.redMul(x.redISub(k)).redISub(f.redMul(M)), D = this.z.redMul(y);
  return this.curve.jpoint(k, I, D);
};
Ee.prototype.dblp = function(n) {
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
    var x = g.redSqr(), k = M.redSqr(), I = k.redSqr(), D = x.redAdd(x).redIAdd(x).redIAdd(m.redMul(B)), L = g.redMul(k), W = D.redSqr().redISub(L.redAdd(L)), z = L.redISub(W), N = D.redMul(z);
    N = N.redIAdd(N).redISub(I);
    var lt = M.redMul(S);
    o + 1 < n && (B = B.redMul(I)), g = W, S = lt, M = N;
  }
  return this.curve.jpoint(g, M.redMul(f), S);
};
Ee.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
};
Ee.prototype._zeroDbl = function() {
  var n, o, s;
  if (this.zOne) {
    var m = this.x.redSqr(), f = this.y.redSqr(), g = f.redSqr(), y = this.x.redAdd(f).redSqr().redISub(m).redISub(g);
    y = y.redIAdd(y);
    var S = m.redAdd(m).redIAdd(m), B = S.redSqr().redISub(y).redISub(y), M = g.redIAdd(g);
    M = M.redIAdd(M), M = M.redIAdd(M), n = B, o = S.redMul(y.redISub(B)).redISub(M), s = this.y.redAdd(this.y);
  } else {
    var x = this.x.redSqr(), k = this.y.redSqr(), I = k.redSqr(), D = this.x.redAdd(k).redSqr().redISub(x).redISub(I);
    D = D.redIAdd(D);
    var L = x.redAdd(x).redIAdd(x), W = L.redSqr(), z = I.redIAdd(I);
    z = z.redIAdd(z), z = z.redIAdd(z), n = W.redISub(D).redISub(D), o = L.redMul(D.redISub(n)).redISub(z), s = this.y.redMul(this.z), s = s.redIAdd(s);
  }
  return this.curve.jpoint(n, o, s);
};
Ee.prototype._threeDbl = function() {
  var n, o, s;
  if (this.zOne) {
    var m = this.x.redSqr(), f = this.y.redSqr(), g = f.redSqr(), y = this.x.redAdd(f).redSqr().redISub(m).redISub(g);
    y = y.redIAdd(y);
    var S = m.redAdd(m).redIAdd(m).redIAdd(this.curve.a), B = S.redSqr().redISub(y).redISub(y);
    n = B;
    var M = g.redIAdd(g);
    M = M.redIAdd(M), M = M.redIAdd(M), o = S.redMul(y.redISub(B)).redISub(M), s = this.y.redAdd(this.y);
  } else {
    var x = this.z.redSqr(), k = this.y.redSqr(), I = this.x.redMul(k), D = this.x.redSub(x).redMul(this.x.redAdd(x));
    D = D.redAdd(D).redIAdd(D);
    var L = I.redIAdd(I);
    L = L.redIAdd(L);
    var W = L.redAdd(L);
    n = D.redSqr().redISub(W), s = this.y.redAdd(this.z).redSqr().redISub(k).redISub(x);
    var z = k.redSqr();
    z = z.redIAdd(z), z = z.redIAdd(z), z = z.redIAdd(z), o = D.redMul(L.redISub(n)).redISub(z);
  }
  return this.curve.jpoint(n, o, s);
};
Ee.prototype._dbl = function() {
  var n = this.curve.a, o = this.x, s = this.y, m = this.z, f = m.redSqr().redSqr(), g = o.redSqr(), y = s.redSqr(), S = g.redAdd(g).redIAdd(g).redIAdd(n.redMul(f)), B = o.redAdd(o);
  B = B.redIAdd(B);
  var M = B.redMul(y), x = S.redSqr().redISub(M.redAdd(M)), k = M.redISub(x), I = y.redSqr();
  I = I.redIAdd(I), I = I.redIAdd(I), I = I.redIAdd(I);
  var D = S.redMul(k).redISub(I), L = s.redAdd(s).redMul(m);
  return this.curve.jpoint(x, D, L);
};
Ee.prototype.trpl = function() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);
  var n = this.x.redSqr(), o = this.y.redSqr(), s = this.z.redSqr(), m = o.redSqr(), f = n.redAdd(n).redIAdd(n), g = f.redSqr(), y = this.x.redAdd(o).redSqr().redISub(n).redISub(m);
  y = y.redIAdd(y), y = y.redAdd(y).redIAdd(y), y = y.redISub(g);
  var S = y.redSqr(), B = m.redIAdd(m);
  B = B.redIAdd(B), B = B.redIAdd(B), B = B.redIAdd(B);
  var M = f.redIAdd(y).redSqr().redISub(g).redISub(S).redISub(B), x = o.redMul(M);
  x = x.redIAdd(x), x = x.redIAdd(x);
  var k = this.x.redMul(S).redISub(x);
  k = k.redIAdd(k), k = k.redIAdd(k);
  var I = this.y.redMul(M.redMul(B.redISub(M)).redISub(y.redMul(S)));
  I = I.redIAdd(I), I = I.redIAdd(I), I = I.redIAdd(I);
  var D = this.z.redAdd(y).redSqr().redISub(s).redISub(S);
  return this.curve.jpoint(k, I, D);
};
Ee.prototype.mul = function(n, o) {
  return n = new ge(n, o), this.curve._wnafMul(this, n);
};
Ee.prototype.eq = function(n) {
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
Ee.prototype.eqXToP = function(n) {
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
Ee.prototype.inspect = function() {
  return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
};
Ee.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
var ai = Rr, ao = Jt, jn = Xn, Vv = ze;
function Mi(h) {
  jn.call(this, "mont", h), this.a = new ai(h.a, 16).toRed(this.red), this.b = new ai(h.b, 16).toRed(this.red), this.i4 = new ai(4).toRed(this.red).redInvm(), this.two = new ai(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
ao(Mi, jn);
var Yv = Mi;
Mi.prototype.validate = function(n) {
  var o = n.normalize().x, s = o.redSqr(), m = s.redMul(o).redAdd(s.redMul(this.a)).redAdd(o), f = m.redSqrt();
  return f.redSqr().cmp(m) === 0;
};
function Se(h, n, o) {
  jn.BasePoint.call(this, h, "projective"), n === null && o === null ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new ai(n, 16), this.z = new ai(o, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
}
ao(Se, jn.BasePoint);
Mi.prototype.decodePoint = function(n, o) {
  return this.point(Vv.toArray(n, o), 1);
};
Mi.prototype.point = function(n, o) {
  return new Se(this, n, o);
};
Mi.prototype.pointFromJSON = function(n) {
  return Se.fromJSON(this, n);
};
Se.prototype.precompute = function() {
};
Se.prototype._encode = function() {
  return this.getX().toArray("be", this.curve.p.byteLength());
};
Se.fromJSON = function(n, o) {
  return new Se(n, o[0], o[1] || n.one);
};
Se.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
Se.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
Se.prototype.dbl = function() {
  var n = this.x.redAdd(this.z), o = n.redSqr(), s = this.x.redSub(this.z), m = s.redSqr(), f = o.redSub(m), g = o.redMul(m), y = f.redMul(m.redAdd(this.curve.a24.redMul(f)));
  return this.curve.point(g, y);
};
Se.prototype.add = function() {
  throw new Error("Not supported on Montgomery curve");
};
Se.prototype.diffAdd = function(n, o) {
  var s = this.x.redAdd(this.z), m = this.x.redSub(this.z), f = n.x.redAdd(n.z), g = n.x.redSub(n.z), y = g.redMul(s), S = f.redMul(m), B = o.z.redMul(y.redAdd(S).redSqr()), M = o.x.redMul(y.redISub(S).redSqr());
  return this.curve.point(B, M);
};
Se.prototype.mul = function(n) {
  for (var o = n.clone(), s = this, m = this.curve.point(null, null), f = this, g = []; o.cmpn(0) !== 0; o.iushrn(1))
    g.push(o.andln(1));
  for (var y = g.length - 1; y >= 0; y--)
    g[y] === 0 ? (s = s.diffAdd(m, f), m = m.dbl()) : (m = s.diffAdd(m, f), s = s.dbl());
  return m;
};
Se.prototype.mulAdd = function() {
  throw new Error("Not supported on Montgomery curve");
};
Se.prototype.jumlAdd = function() {
  throw new Error("Not supported on Montgomery curve");
};
Se.prototype.eq = function(n) {
  return this.getX().cmp(n.getX()) === 0;
};
Se.prototype.normalize = function() {
  return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
};
Se.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
};
var Jv = ze, _r = Rr, ho = Jt, Qn = Xn, Gv = Jv.assert;
function br(h) {
  this.twisted = (h.a | 0) !== 1, this.mOneA = this.twisted && (h.a | 0) === -1, this.extended = this.mOneA, Qn.call(this, "edwards", h), this.a = new _r(h.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new _r(h.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new _r(h.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), Gv(!this.twisted || this.c.fromRed().cmpn(1) === 0), this.oneC = (h.c | 0) === 1;
}
ho(br, Qn);
var Xv = br;
br.prototype._mulA = function(n) {
  return this.mOneA ? n.redNeg() : this.a.redMul(n);
};
br.prototype._mulC = function(n) {
  return this.oneC ? n : this.c.redMul(n);
};
br.prototype.jpoint = function(n, o, s, m) {
  return this.point(n, o, s, m);
};
br.prototype.pointFromX = function(n, o) {
  n = new _r(n, 16), n.red || (n = n.toRed(this.red));
  var s = n.redSqr(), m = this.c2.redSub(this.a.redMul(s)), f = this.one.redSub(this.c2.redMul(this.d).redMul(s)), g = m.redMul(f.redInvm()), y = g.redSqrt();
  if (y.redSqr().redSub(g).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var S = y.fromRed().isOdd();
  return (o && !S || !o && S) && (y = y.redNeg()), this.point(n, y);
};
br.prototype.pointFromY = function(n, o) {
  n = new _r(n, 16), n.red || (n = n.toRed(this.red));
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
br.prototype.validate = function(n) {
  if (n.isInfinity())
    return !0;
  n.normalize();
  var o = n.x.redSqr(), s = n.y.redSqr(), m = o.redMul(this.a).redAdd(s), f = this.c2.redMul(this.one.redAdd(this.d.redMul(o).redMul(s)));
  return m.cmp(f) === 0;
};
function me(h, n, o, s, m) {
  Qn.BasePoint.call(this, h, "projective"), n === null && o === null && s === null ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new _r(n, 16), this.y = new _r(o, 16), this.z = s ? new _r(s, 16) : this.curve.one, this.t = m && new _r(m, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
}
ho(me, Qn.BasePoint);
br.prototype.pointFromJSON = function(n) {
  return me.fromJSON(this, n);
};
br.prototype.point = function(n, o, s, m) {
  return new me(this, n, o, s, m);
};
me.fromJSON = function(n, o) {
  return new me(n, o[0], o[1], o[2]);
};
me.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
me.prototype.isInfinity = function() {
  return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
};
me.prototype._extDbl = function() {
  var n = this.x.redSqr(), o = this.y.redSqr(), s = this.z.redSqr();
  s = s.redIAdd(s);
  var m = this.curve._mulA(n), f = this.x.redAdd(this.y).redSqr().redISub(n).redISub(o), g = m.redAdd(o), y = g.redSub(s), S = m.redSub(o), B = f.redMul(y), M = g.redMul(S), x = f.redMul(S), k = y.redMul(g);
  return this.curve.point(B, M, k, x);
};
me.prototype._projDbl = function() {
  var n = this.x.redAdd(this.y).redSqr(), o = this.x.redSqr(), s = this.y.redSqr(), m, f, g, y, S, B;
  if (this.curve.twisted) {
    y = this.curve._mulA(o);
    var M = y.redAdd(s);
    this.zOne ? (m = n.redSub(o).redSub(s).redMul(M.redSub(this.curve.two)), f = M.redMul(y.redSub(s)), g = M.redSqr().redSub(M).redSub(M)) : (S = this.z.redSqr(), B = M.redSub(S).redISub(S), m = n.redSub(o).redISub(s).redMul(B), f = M.redMul(y.redSub(s)), g = M.redMul(B));
  } else
    y = o.redAdd(s), S = this.curve._mulC(this.z).redSqr(), B = y.redSub(S).redSub(S), m = this.curve._mulC(n.redISub(y)).redMul(B), f = this.curve._mulC(y).redMul(o.redISub(s)), g = y.redMul(B);
  return this.curve.point(m, f, g);
};
me.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
};
me.prototype._extAdd = function(n) {
  var o = this.y.redSub(this.x).redMul(n.y.redSub(n.x)), s = this.y.redAdd(this.x).redMul(n.y.redAdd(n.x)), m = this.t.redMul(this.curve.dd).redMul(n.t), f = this.z.redMul(n.z.redAdd(n.z)), g = s.redSub(o), y = f.redSub(m), S = f.redAdd(m), B = s.redAdd(o), M = g.redMul(y), x = S.redMul(B), k = g.redMul(B), I = y.redMul(S);
  return this.curve.point(M, x, I, k);
};
me.prototype._projAdd = function(n) {
  var o = this.z.redMul(n.z), s = o.redSqr(), m = this.x.redMul(n.x), f = this.y.redMul(n.y), g = this.curve.d.redMul(m).redMul(f), y = s.redSub(g), S = s.redAdd(g), B = this.x.redAdd(this.y).redMul(n.x.redAdd(n.y)).redISub(m).redISub(f), M = o.redMul(y).redMul(B), x, k;
  return this.curve.twisted ? (x = o.redMul(S).redMul(f.redSub(this.curve._mulA(m))), k = y.redMul(S)) : (x = o.redMul(S).redMul(f.redSub(m)), k = this.curve._mulC(y).redMul(S)), this.curve.point(M, x, k);
};
me.prototype.add = function(n) {
  return this.isInfinity() ? n : n.isInfinity() ? this : this.curve.extended ? this._extAdd(n) : this._projAdd(n);
};
me.prototype.mul = function(n) {
  return this._hasDoubles(n) ? this.curve._fixedNafMul(this, n) : this.curve._wnafMul(this, n);
};
me.prototype.mulAdd = function(n, o, s) {
  return this.curve._wnafMulAdd(1, [this, o], [n, s], 2, !1);
};
me.prototype.jmulAdd = function(n, o, s) {
  return this.curve._wnafMulAdd(1, [this, o], [n, s], 2, !0);
};
me.prototype.normalize = function() {
  if (this.zOne)
    return this;
  var n = this.z.redInvm();
  return this.x = this.x.redMul(n), this.y = this.y.redMul(n), this.t && (this.t = this.t.redMul(n)), this.z = this.curve.one, this.zOne = !0, this;
};
me.prototype.neg = function() {
  return this.curve.point(
    this.x.redNeg(),
    this.y,
    this.z,
    this.t && this.t.redNeg()
  );
};
me.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
};
me.prototype.getY = function() {
  return this.normalize(), this.y.fromRed();
};
me.prototype.eq = function(n) {
  return this === n || this.getX().cmp(n.getX()) === 0 && this.getY().cmp(n.getY()) === 0;
};
me.prototype.eqXToP = function(n) {
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
me.prototype.toP = me.prototype.normalize;
me.prototype.mixedAdd = me.prototype.add;
(function(h) {
  var n = h;
  n.base = Xn, n.short = Wv, n.mont = Yv, n.edwards = Xv;
})(z0);
var tf = {}, ef = {}, Xt = {}, jv = We, Qv = Jt;
Xt.inherits = Qv;
function tp(h, n) {
  return (h.charCodeAt(n) & 64512) !== 55296 || n < 0 || n + 1 >= h.length ? !1 : (h.charCodeAt(n + 1) & 64512) === 56320;
}
function ep(h, n) {
  if (Array.isArray(h))
    return h.slice();
  if (!h)
    return [];
  var o = [];
  if (typeof h == "string")
    if (n) {
      if (n === "hex")
        for (h = h.replace(/[^a-z0-9]+/ig, ""), h.length % 2 !== 0 && (h = "0" + h), m = 0; m < h.length; m += 2)
          o.push(parseInt(h[m] + h[m + 1], 16));
    } else
      for (var s = 0, m = 0; m < h.length; m++) {
        var f = h.charCodeAt(m);
        f < 128 ? o[s++] = f : f < 2048 ? (o[s++] = f >> 6 | 192, o[s++] = f & 63 | 128) : tp(h, m) ? (f = 65536 + ((f & 1023) << 10) + (h.charCodeAt(++m) & 1023), o[s++] = f >> 18 | 240, o[s++] = f >> 12 & 63 | 128, o[s++] = f >> 6 & 63 | 128, o[s++] = f & 63 | 128) : (o[s++] = f >> 12 | 224, o[s++] = f >> 6 & 63 | 128, o[s++] = f & 63 | 128);
      }
  else
    for (m = 0; m < h.length; m++)
      o[m] = h[m] | 0;
  return o;
}
Xt.toArray = ep;
function rp(h) {
  for (var n = "", o = 0; o < h.length; o++)
    n += oo(h[o].toString(16));
  return n;
}
Xt.toHex = rp;
function so(h) {
  var n = h >>> 24 | h >>> 8 & 65280 | h << 8 & 16711680 | (h & 255) << 24;
  return n >>> 0;
}
Xt.htonl = so;
function ip(h, n) {
  for (var o = "", s = 0; s < h.length; s++) {
    var m = h[s];
    n === "little" && (m = so(m)), o += uo(m.toString(16));
  }
  return o;
}
Xt.toHex32 = ip;
function oo(h) {
  return h.length === 1 ? "0" + h : h;
}
Xt.zero2 = oo;
function uo(h) {
  return h.length === 7 ? "0" + h : h.length === 6 ? "00" + h : h.length === 5 ? "000" + h : h.length === 4 ? "0000" + h : h.length === 3 ? "00000" + h : h.length === 2 ? "000000" + h : h.length === 1 ? "0000000" + h : h;
}
Xt.zero8 = uo;
function np(h, n, o, s) {
  var m = o - n;
  jv(m % 4 === 0);
  for (var f = new Array(m / 4), g = 0, y = n; g < f.length; g++, y += 4) {
    var S;
    s === "big" ? S = h[y] << 24 | h[y + 1] << 16 | h[y + 2] << 8 | h[y + 3] : S = h[y + 3] << 24 | h[y + 2] << 16 | h[y + 1] << 8 | h[y], f[g] = S >>> 0;
  }
  return f;
}
Xt.join32 = np;
function fp(h, n) {
  for (var o = new Array(h.length * 4), s = 0, m = 0; s < h.length; s++, m += 4) {
    var f = h[s];
    n === "big" ? (o[m] = f >>> 24, o[m + 1] = f >>> 16 & 255, o[m + 2] = f >>> 8 & 255, o[m + 3] = f & 255) : (o[m + 3] = f >>> 24, o[m + 2] = f >>> 16 & 255, o[m + 1] = f >>> 8 & 255, o[m] = f & 255);
  }
  return o;
}
Xt.split32 = fp;
function ap(h, n) {
  return h >>> n | h << 32 - n;
}
Xt.rotr32 = ap;
function hp(h, n) {
  return h << n | h >>> 32 - n;
}
Xt.rotl32 = hp;
function sp(h, n) {
  return h + n >>> 0;
}
Xt.sum32 = sp;
function op(h, n, o) {
  return h + n + o >>> 0;
}
Xt.sum32_3 = op;
function up(h, n, o, s) {
  return h + n + o + s >>> 0;
}
Xt.sum32_4 = up;
function lp(h, n, o, s, m) {
  return h + n + o + s + m >>> 0;
}
Xt.sum32_5 = lp;
function dp(h, n, o, s) {
  var m = h[n], f = h[n + 1], g = s + f >>> 0, y = (g < s ? 1 : 0) + o + m;
  h[n] = y >>> 0, h[n + 1] = g;
}
Xt.sum64 = dp;
function cp(h, n, o, s) {
  var m = n + s >>> 0, f = (m < n ? 1 : 0) + h + o;
  return f >>> 0;
}
Xt.sum64_hi = cp;
function vp(h, n, o, s) {
  var m = n + s;
  return m >>> 0;
}
Xt.sum64_lo = vp;
function pp(h, n, o, s, m, f, g, y) {
  var S = 0, B = n;
  B = B + s >>> 0, S += B < n ? 1 : 0, B = B + f >>> 0, S += B < f ? 1 : 0, B = B + y >>> 0, S += B < y ? 1 : 0;
  var M = h + o + m + g + S;
  return M >>> 0;
}
Xt.sum64_4_hi = pp;
function mp(h, n, o, s, m, f, g, y) {
  var S = n + s + f + y;
  return S >>> 0;
}
Xt.sum64_4_lo = mp;
function gp(h, n, o, s, m, f, g, y, S, B) {
  var M = 0, x = n;
  x = x + s >>> 0, M += x < n ? 1 : 0, x = x + f >>> 0, M += x < f ? 1 : 0, x = x + y >>> 0, M += x < y ? 1 : 0, x = x + B >>> 0, M += x < B ? 1 : 0;
  var k = h + o + m + g + S + M;
  return k >>> 0;
}
Xt.sum64_5_hi = gp;
function bp(h, n, o, s, m, f, g, y, S, B) {
  var M = n + s + f + y + B;
  return M >>> 0;
}
Xt.sum64_5_lo = bp;
function yp(h, n, o) {
  var s = n << 32 - o | h >>> o;
  return s >>> 0;
}
Xt.rotr64_hi = yp;
function wp(h, n, o) {
  var s = h << 32 - o | n >>> o;
  return s >>> 0;
}
Xt.rotr64_lo = wp;
function Mp(h, n, o) {
  return h >>> o;
}
Xt.shr64_hi = Mp;
function xp(h, n, o) {
  var s = h << 32 - o | n >>> o;
  return s >>> 0;
}
Xt.shr64_lo = xp;
var xi = {}, Fa = Xt, _p = We;
function rf() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
xi.BlockHash = rf;
rf.prototype.update = function(n, o) {
  if (n = Fa.toArray(n, o), this.pending ? this.pending = this.pending.concat(n) : this.pending = n, this.pendingTotal += n.length, this.pending.length >= this._delta8) {
    n = this.pending;
    var s = n.length % this._delta8;
    this.pending = n.slice(n.length - s, n.length), this.pending.length === 0 && (this.pending = null), n = Fa.join32(n, 0, n.length - s, this.endian);
    for (var m = 0; m < n.length; m += this._delta32)
      this._update(n, m, m + this._delta32);
  }
  return this;
};
rf.prototype.digest = function(n) {
  return this.update(this._pad()), _p(this.pending === null), this._digest(n);
};
rf.prototype._pad = function() {
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
var _i = {}, yr = {}, Sp = Xt, or = Sp.rotr32;
function Ap(h, n, o, s) {
  if (h === 0)
    return lo(n, o, s);
  if (h === 1 || h === 3)
    return vo(n, o, s);
  if (h === 2)
    return co(n, o, s);
}
yr.ft_1 = Ap;
function lo(h, n, o) {
  return h & n ^ ~h & o;
}
yr.ch32 = lo;
function co(h, n, o) {
  return h & n ^ h & o ^ n & o;
}
yr.maj32 = co;
function vo(h, n, o) {
  return h ^ n ^ o;
}
yr.p32 = vo;
function Bp(h) {
  return or(h, 2) ^ or(h, 13) ^ or(h, 22);
}
yr.s0_256 = Bp;
function Ep(h) {
  return or(h, 6) ^ or(h, 11) ^ or(h, 25);
}
yr.s1_256 = Ep;
function Ip(h) {
  return or(h, 7) ^ or(h, 18) ^ h >>> 3;
}
yr.g0_256 = Ip;
function kp(h) {
  return or(h, 17) ^ or(h, 19) ^ h >>> 10;
}
yr.g1_256 = kp;
var di = Xt, Rp = xi, Tp = yr, kf = di.rotl32, qi = di.sum32, Cp = di.sum32_5, qp = Tp.ft_1, po = Rp.BlockHash, Fp = [
  1518500249,
  1859775393,
  2400959708,
  3395469782
];
function vr() {
  if (!(this instanceof vr))
    return new vr();
  po.call(this), this.h = [
    1732584193,
    4023233417,
    2562383102,
    271733878,
    3285377520
  ], this.W = new Array(80);
}
di.inherits(vr, po);
var Pp = vr;
vr.blockSize = 512;
vr.outSize = 160;
vr.hmacStrength = 80;
vr.padLength = 64;
vr.prototype._update = function(n, o) {
  for (var s = this.W, m = 0; m < 16; m++)
    s[m] = n[o + m];
  for (; m < s.length; m++)
    s[m] = kf(s[m - 3] ^ s[m - 8] ^ s[m - 14] ^ s[m - 16], 1);
  var f = this.h[0], g = this.h[1], y = this.h[2], S = this.h[3], B = this.h[4];
  for (m = 0; m < s.length; m++) {
    var M = ~~(m / 20), x = Cp(kf(f, 5), qp(M, g, y, S), B, s[m], Fp[M]);
    B = S, S = y, y = kf(g, 30), g = f, f = x;
  }
  this.h[0] = qi(this.h[0], f), this.h[1] = qi(this.h[1], g), this.h[2] = qi(this.h[2], y), this.h[3] = qi(this.h[3], S), this.h[4] = qi(this.h[4], B);
};
vr.prototype._digest = function(n) {
  return n === "hex" ? di.toHex32(this.h, "big") : di.split32(this.h, "big");
};
var ci = Xt, Dp = xi, Si = yr, $p = We, Xe = ci.sum32, Np = ci.sum32_4, Up = ci.sum32_5, Lp = Si.ch32, Op = Si.maj32, zp = Si.s0_256, Kp = Si.s1_256, Hp = Si.g0_256, Zp = Si.g1_256, mo = Dp.BlockHash, Wp = [
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
function pr() {
  if (!(this instanceof pr))
    return new pr();
  mo.call(this), this.h = [
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ], this.k = Wp, this.W = new Array(64);
}
ci.inherits(pr, mo);
var go = pr;
pr.blockSize = 512;
pr.outSize = 256;
pr.hmacStrength = 192;
pr.padLength = 64;
pr.prototype._update = function(n, o) {
  for (var s = this.W, m = 0; m < 16; m++)
    s[m] = n[o + m];
  for (; m < s.length; m++)
    s[m] = Np(Zp(s[m - 2]), s[m - 7], Hp(s[m - 15]), s[m - 16]);
  var f = this.h[0], g = this.h[1], y = this.h[2], S = this.h[3], B = this.h[4], M = this.h[5], x = this.h[6], k = this.h[7];
  for ($p(this.k.length === s.length), m = 0; m < s.length; m++) {
    var I = Up(k, Kp(B), Lp(B, M, x), this.k[m], s[m]), D = Xe(zp(f), Op(f, g, y));
    k = x, x = M, M = B, B = Xe(S, I), S = y, y = g, g = f, f = Xe(I, D);
  }
  this.h[0] = Xe(this.h[0], f), this.h[1] = Xe(this.h[1], g), this.h[2] = Xe(this.h[2], y), this.h[3] = Xe(this.h[3], S), this.h[4] = Xe(this.h[4], B), this.h[5] = Xe(this.h[5], M), this.h[6] = Xe(this.h[6], x), this.h[7] = Xe(this.h[7], k);
};
pr.prototype._digest = function(n) {
  return n === "hex" ? ci.toHex32(this.h, "big") : ci.split32(this.h, "big");
};
var u0 = Xt, bo = go;
function Er() {
  if (!(this instanceof Er))
    return new Er();
  bo.call(this), this.h = [
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
u0.inherits(Er, bo);
var Vp = Er;
Er.blockSize = 512;
Er.outSize = 224;
Er.hmacStrength = 192;
Er.padLength = 64;
Er.prototype._digest = function(n) {
  return n === "hex" ? u0.toHex32(this.h.slice(0, 7), "big") : u0.split32(this.h.slice(0, 7), "big");
};
var De = Xt, Yp = xi, Jp = We, ur = De.rotr64_hi, lr = De.rotr64_lo, yo = De.shr64_hi, wo = De.shr64_lo, Tr = De.sum64, Rf = De.sum64_hi, Tf = De.sum64_lo, Gp = De.sum64_4_hi, Xp = De.sum64_4_lo, jp = De.sum64_5_hi, Qp = De.sum64_5_lo, Mo = Yp.BlockHash, t2 = [
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
function tr() {
  if (!(this instanceof tr))
    return new tr();
  Mo.call(this), this.h = [
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
  ], this.k = t2, this.W = new Array(160);
}
De.inherits(tr, Mo);
var xo = tr;
tr.blockSize = 1024;
tr.outSize = 512;
tr.hmacStrength = 192;
tr.padLength = 128;
tr.prototype._prepareBlock = function(n, o) {
  for (var s = this.W, m = 0; m < 32; m++)
    s[m] = n[o + m];
  for (; m < s.length; m += 2) {
    var f = l2(s[m - 4], s[m - 3]), g = d2(s[m - 4], s[m - 3]), y = s[m - 14], S = s[m - 13], B = o2(s[m - 30], s[m - 29]), M = u2(s[m - 30], s[m - 29]), x = s[m - 32], k = s[m - 31];
    s[m] = Gp(
      f,
      g,
      y,
      S,
      B,
      M,
      x,
      k
    ), s[m + 1] = Xp(
      f,
      g,
      y,
      S,
      B,
      M,
      x,
      k
    );
  }
};
tr.prototype._update = function(n, o) {
  this._prepareBlock(n, o);
  var s = this.W, m = this.h[0], f = this.h[1], g = this.h[2], y = this.h[3], S = this.h[4], B = this.h[5], M = this.h[6], x = this.h[7], k = this.h[8], I = this.h[9], D = this.h[10], L = this.h[11], W = this.h[12], z = this.h[13], N = this.h[14], lt = this.h[15];
  Jp(this.k.length === s.length);
  for (var H = 0; H < s.length; H += 2) {
    var At = N, Bt = lt, Ct = h2(k, I), Et = s2(k, I), Y = e2(k, I, D, L, W), kt = r2(k, I, D, L, W, z), p = this.k[H], t = this.k[H + 1], r = s[H], i = s[H + 1], a = jp(
      At,
      Bt,
      Ct,
      Et,
      Y,
      kt,
      p,
      t,
      r,
      i
    ), d = Qp(
      At,
      Bt,
      Ct,
      Et,
      Y,
      kt,
      p,
      t,
      r,
      i
    );
    At = f2(m, f), Bt = a2(m, f), Ct = i2(m, f, g, y, S), Et = n2(m, f, g, y, S, B);
    var c = Rf(At, Bt, Ct, Et), v = Tf(At, Bt, Ct, Et);
    N = W, lt = z, W = D, z = L, D = k, L = I, k = Rf(M, x, a, d), I = Tf(x, x, a, d), M = S, x = B, S = g, B = y, g = m, y = f, m = Rf(a, d, c, v), f = Tf(a, d, c, v);
  }
  Tr(this.h, 0, m, f), Tr(this.h, 2, g, y), Tr(this.h, 4, S, B), Tr(this.h, 6, M, x), Tr(this.h, 8, k, I), Tr(this.h, 10, D, L), Tr(this.h, 12, W, z), Tr(this.h, 14, N, lt);
};
tr.prototype._digest = function(n) {
  return n === "hex" ? De.toHex32(this.h, "big") : De.split32(this.h, "big");
};
function e2(h, n, o, s, m) {
  var f = h & o ^ ~h & m;
  return f < 0 && (f += 4294967296), f;
}
function r2(h, n, o, s, m, f) {
  var g = n & s ^ ~n & f;
  return g < 0 && (g += 4294967296), g;
}
function i2(h, n, o, s, m) {
  var f = h & o ^ h & m ^ o & m;
  return f < 0 && (f += 4294967296), f;
}
function n2(h, n, o, s, m, f) {
  var g = n & s ^ n & f ^ s & f;
  return g < 0 && (g += 4294967296), g;
}
function f2(h, n) {
  var o = ur(h, n, 28), s = ur(n, h, 2), m = ur(n, h, 7), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function a2(h, n) {
  var o = lr(h, n, 28), s = lr(n, h, 2), m = lr(n, h, 7), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function h2(h, n) {
  var o = ur(h, n, 14), s = ur(h, n, 18), m = ur(n, h, 9), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function s2(h, n) {
  var o = lr(h, n, 14), s = lr(h, n, 18), m = lr(n, h, 9), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function o2(h, n) {
  var o = ur(h, n, 1), s = ur(h, n, 8), m = yo(h, n, 7), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function u2(h, n) {
  var o = lr(h, n, 1), s = lr(h, n, 8), m = wo(h, n, 7), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function l2(h, n) {
  var o = ur(h, n, 19), s = ur(n, h, 29), m = yo(h, n, 6), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
function d2(h, n) {
  var o = lr(h, n, 19), s = lr(n, h, 29), m = wo(h, n, 6), f = o ^ s ^ m;
  return f < 0 && (f += 4294967296), f;
}
var l0 = Xt, _o = xo;
function Ir() {
  if (!(this instanceof Ir))
    return new Ir();
  _o.call(this), this.h = [
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
l0.inherits(Ir, _o);
var c2 = Ir;
Ir.blockSize = 1024;
Ir.outSize = 384;
Ir.hmacStrength = 192;
Ir.padLength = 128;
Ir.prototype._digest = function(n) {
  return n === "hex" ? l0.toHex32(this.h.slice(0, 12), "big") : l0.split32(this.h.slice(0, 12), "big");
};
_i.sha1 = Pp;
_i.sha224 = Vp;
_i.sha256 = go;
_i.sha384 = c2;
_i.sha512 = xo;
var So = {}, jr = Xt, v2 = xi, dn = jr.rotl32, Pa = jr.sum32, Fi = jr.sum32_3, Da = jr.sum32_4, Ao = v2.BlockHash;
function mr() {
  if (!(this instanceof mr))
    return new mr();
  Ao.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
}
jr.inherits(mr, Ao);
So.ripemd160 = mr;
mr.blockSize = 512;
mr.outSize = 160;
mr.hmacStrength = 192;
mr.padLength = 64;
mr.prototype._update = function(n, o) {
  for (var s = this.h[0], m = this.h[1], f = this.h[2], g = this.h[3], y = this.h[4], S = s, B = m, M = f, x = g, k = y, I = 0; I < 80; I++) {
    var D = Pa(
      dn(
        Da(s, $a(I, m, f, g), n[g2[I] + o], p2(I)),
        y2[I]
      ),
      y
    );
    s = y, y = g, g = dn(f, 10), f = m, m = D, D = Pa(
      dn(
        Da(S, $a(79 - I, B, M, x), n[b2[I] + o], m2(I)),
        w2[I]
      ),
      k
    ), S = k, k = x, x = dn(M, 10), M = B, B = D;
  }
  D = Fi(this.h[1], f, x), this.h[1] = Fi(this.h[2], g, k), this.h[2] = Fi(this.h[3], y, S), this.h[3] = Fi(this.h[4], s, B), this.h[4] = Fi(this.h[0], m, M), this.h[0] = D;
};
mr.prototype._digest = function(n) {
  return n === "hex" ? jr.toHex32(this.h, "little") : jr.split32(this.h, "little");
};
function $a(h, n, o, s) {
  return h <= 15 ? n ^ o ^ s : h <= 31 ? n & o | ~n & s : h <= 47 ? (n | ~o) ^ s : h <= 63 ? n & s | o & ~s : n ^ (o | ~s);
}
function p2(h) {
  return h <= 15 ? 0 : h <= 31 ? 1518500249 : h <= 47 ? 1859775393 : h <= 63 ? 2400959708 : 2840853838;
}
function m2(h) {
  return h <= 15 ? 1352829926 : h <= 31 ? 1548603684 : h <= 47 ? 1836072691 : h <= 63 ? 2053994217 : 0;
}
var g2 = [
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
], b2 = [
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
], y2 = [
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
], w2 = [
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
], M2 = Xt, x2 = We;
function vi(h, n, o) {
  if (!(this instanceof vi))
    return new vi(h, n, o);
  this.Hash = h, this.blockSize = h.blockSize / 8, this.outSize = h.outSize / 8, this.inner = null, this.outer = null, this._init(M2.toArray(n, o));
}
var _2 = vi;
vi.prototype._init = function(n) {
  n.length > this.blockSize && (n = new this.Hash().update(n).digest()), x2(n.length <= this.blockSize);
  for (var o = n.length; o < this.blockSize; o++)
    n.push(0);
  for (o = 0; o < n.length; o++)
    n[o] ^= 54;
  for (this.inner = new this.Hash().update(n), o = 0; o < n.length; o++)
    n[o] ^= 106;
  this.outer = new this.Hash().update(n);
};
vi.prototype.update = function(n, o) {
  return this.inner.update(n, o), this;
};
vi.prototype.digest = function(n) {
  return this.outer.update(this.inner.digest()), this.outer.digest(n);
};
(function(h) {
  var n = h;
  n.utils = Xt, n.common = xi, n.sha = _i, n.ripemd = So, n.hmac = _2, n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.sha384 = n.sha.sha384, n.sha512 = n.sha.sha512, n.ripemd160 = n.ripemd.ripemd160;
})(ef);
var Cf, Na;
function S2() {
  return Na || (Na = 1, Cf = {
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
  }), Cf;
}
(function(h) {
  var n = h, o = ef, s = z0, m = ze, f = m.assert;
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
    S = S2();
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
})(tf);
var A2 = ef, Jr = O0, Bo = We;
function Dr(h) {
  if (!(this instanceof Dr))
    return new Dr(h);
  this.hash = h.hash, this.predResist = !!h.predResist, this.outLen = this.hash.outSize, this.minEntropy = h.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
  var n = Jr.toArray(h.entropy, h.entropyEnc || "hex"), o = Jr.toArray(h.nonce, h.nonceEnc || "hex"), s = Jr.toArray(h.pers, h.persEnc || "hex");
  Bo(
    n.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  ), this._init(n, o, s);
}
var B2 = Dr;
Dr.prototype._init = function(n, o, s) {
  var m = n.concat(o).concat(s);
  this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
  for (var f = 0; f < this.V.length; f++)
    this.K[f] = 0, this.V[f] = 1;
  this._update(m), this._reseed = 1, this.reseedInterval = 281474976710656;
};
Dr.prototype._hmac = function() {
  return new A2.hmac(this.hash, this.K);
};
Dr.prototype._update = function(n) {
  var o = this._hmac().update(this.V).update([0]);
  n && (o = o.update(n)), this.K = o.digest(), this.V = this._hmac().update(this.V).digest(), n && (this.K = this._hmac().update(this.V).update([1]).update(n).digest(), this.V = this._hmac().update(this.V).digest());
};
Dr.prototype.reseed = function(n, o, s, m) {
  typeof o != "string" && (m = s, s = o, o = null), n = Jr.toArray(n, o), s = Jr.toArray(s, m), Bo(
    n.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  ), this._update(n.concat(s || [])), this._reseed = 1;
};
Dr.prototype.generate = function(n, o, s, m) {
  if (this._reseed > this.reseedInterval)
    throw new Error("Reseed is required");
  typeof o != "string" && (m = s, s = o, o = null), s && (s = Jr.toArray(s, m || "hex"), this._update(s));
  for (var f = []; f.length < n; )
    this.V = this._hmac().update(this.V).digest(), f = f.concat(this.V);
  var g = f.slice(0, n);
  return this._update(s), this._reseed++, Jr.encode(g, o);
};
var E2 = Rr, I2 = ze, d0 = I2.assert;
function Ce(h, n) {
  this.ec = h, this.priv = null, this.pub = null, n.priv && this._importPrivate(n.priv, n.privEnc), n.pub && this._importPublic(n.pub, n.pubEnc);
}
var k2 = Ce;
Ce.fromPublic = function(n, o, s) {
  return o instanceof Ce ? o : new Ce(n, {
    pub: o,
    pubEnc: s
  });
};
Ce.fromPrivate = function(n, o, s) {
  return o instanceof Ce ? o : new Ce(n, {
    priv: o,
    privEnc: s
  });
};
Ce.prototype.validate = function() {
  var n = this.getPublic();
  return n.isInfinity() ? { result: !1, reason: "Invalid public key" } : n.validate() ? n.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : { result: !1, reason: "Public key * N != O" } : { result: !1, reason: "Public key is not a point" };
};
Ce.prototype.getPublic = function(n, o) {
  return typeof n == "string" && (o = n, n = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), o ? this.pub.encode(o, n) : this.pub;
};
Ce.prototype.getPrivate = function(n) {
  return n === "hex" ? this.priv.toString(16, 2) : this.priv;
};
Ce.prototype._importPrivate = function(n, o) {
  this.priv = new E2(n, o || 16), this.priv = this.priv.umod(this.ec.curve.n);
};
Ce.prototype._importPublic = function(n, o) {
  if (n.x || n.y) {
    this.ec.curve.type === "mont" ? d0(n.x, "Need x coordinate") : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") && d0(n.x && n.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(n.x, n.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(n, o);
};
Ce.prototype.derive = function(n) {
  return n.validate() || d0(n.validate(), "public point not validated"), n.mul(this.priv).getX();
};
Ce.prototype.sign = function(n, o, s) {
  return this.ec.sign(n, this, o, s);
};
Ce.prototype.verify = function(n, o, s) {
  return this.ec.verify(n, o, this, void 0, s);
};
Ce.prototype.inspect = function() {
  return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
var In = Rr, H0 = ze, R2 = H0.assert;
function nf(h, n) {
  if (h instanceof nf)
    return h;
  this._importDER(h, n) || (R2(h.r && h.s, "Signature without r or s"), this.r = new In(h.r, 16), this.s = new In(h.s, 16), h.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = h.recoveryParam);
}
var T2 = nf;
function C2() {
  this.place = 0;
}
function qf(h, n) {
  var o = h[n.place++];
  if (!(o & 128))
    return o;
  var s = o & 15;
  if (s === 0 || s > 4 || h[n.place] === 0)
    return !1;
  for (var m = 0, f = 0, g = n.place; f < s; f++, g++)
    m <<= 8, m |= h[g], m >>>= 0;
  return m <= 127 ? !1 : (n.place = g, m);
}
function Ua(h) {
  for (var n = 0, o = h.length - 1; !h[n] && !(h[n + 1] & 128) && n < o; )
    n++;
  return n === 0 ? h : h.slice(n);
}
nf.prototype._importDER = function(n, o) {
  n = H0.toArray(n, o);
  var s = new C2();
  if (n[s.place++] !== 48)
    return !1;
  var m = qf(n, s);
  if (m === !1 || m + s.place !== n.length || n[s.place++] !== 2)
    return !1;
  var f = qf(n, s);
  if (f === !1 || n[s.place] & 128)
    return !1;
  var g = n.slice(s.place, f + s.place);
  if (s.place += f, n[s.place++] !== 2)
    return !1;
  var y = qf(n, s);
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
  return this.r = new In(g), this.s = new In(S), this.recoveryParam = null, !0;
};
function Ff(h, n) {
  if (n < 128) {
    h.push(n);
    return;
  }
  var o = 1 + (Math.log(n) / Math.LN2 >>> 3);
  for (h.push(o | 128); --o; )
    h.push(n >>> (o << 3) & 255);
  h.push(n);
}
nf.prototype.toDER = function(n) {
  var o = this.r.toArray(), s = this.s.toArray();
  for (o[0] & 128 && (o = [0].concat(o)), s[0] & 128 && (s = [0].concat(s)), o = Ua(o), s = Ua(s); !s[0] && !(s[1] & 128); )
    s = s.slice(1);
  var m = [2];
  Ff(m, o.length), m = m.concat(o), m.push(2), Ff(m, s.length);
  var f = m.concat(s), g = [48];
  return Ff(g, f.length), g = g.concat(f), H0.encode(g, n);
};
var Pf, La;
function q2() {
  if (La)
    return Pf;
  La = 1;
  var h = Rr, n = B2, o = ze, s = tf, m = P0(), f = o.assert, g = k2, y = T2;
  function S(B) {
    if (!(this instanceof S))
      return new S(B);
    typeof B == "string" && (f(
      Object.prototype.hasOwnProperty.call(s, B),
      "Unknown curve " + B
    ), B = s[B]), B instanceof s.PresetCurve && (B = { curve: B }), this.curve = B.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = B.curve.g, this.g.precompute(B.curve.n.bitLength() + 1), this.hash = B.hash || B.curve.hash;
  }
  return Pf = S, S.prototype.keyPair = function(M) {
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
    }), k = this.n.byteLength(), I = this.n.sub(new h(2)); ; ) {
      var D = new h(x.generate(k));
      if (!(D.cmp(I) > 0))
        return D.iaddn(1), this.keyFromPrivate(D);
    }
  }, S.prototype._truncateToN = function(M, x, k) {
    var I;
    if (h.isBN(M) || typeof M == "number")
      M = new h(M, 16), I = M.byteLength();
    else if (typeof M == "object")
      I = M.length, M = new h(M, 16);
    else {
      var D = M.toString();
      I = D.length + 1 >>> 1, M = new h(D, 16);
    }
    typeof k != "number" && (k = I * 8);
    var L = k - this.n.bitLength();
    return L > 0 && (M = M.ushrn(L)), !x && M.cmp(this.n) >= 0 ? M.sub(this.n) : M;
  }, S.prototype.sign = function(M, x, k, I) {
    if (typeof k == "object" && (I = k, k = null), I || (I = {}), typeof M != "string" && typeof M != "number" && !h.isBN(M)) {
      f(
        typeof M == "object" && M && typeof M.length == "number",
        "Expected message to be an array-like, a hex string, or a BN instance"
      ), f(M.length >>> 0 === M.length);
      for (var D = 0; D < M.length; D++)
        f((M[D] & 255) === M[D]);
    }
    x = this.keyFromPrivate(x, k), M = this._truncateToN(M, !1, I.msgBitLength), f(!M.isNeg(), "Can not sign a negative message");
    var L = this.n.byteLength(), W = x.getPrivate().toArray("be", L), z = M.toArray("be", L);
    f(new h(z).eq(M), "Can not sign message");
    for (var N = new n({
      hash: this.hash,
      entropy: W,
      nonce: z,
      pers: I.pers,
      persEnc: I.persEnc || "utf8"
    }), lt = this.n.sub(new h(1)), H = 0; ; H++) {
      var At = I.k ? I.k(H) : new h(N.generate(this.n.byteLength()));
      if (At = this._truncateToN(At, !0), !(At.cmpn(1) <= 0 || At.cmp(lt) >= 0)) {
        var Bt = this.g.mul(At);
        if (!Bt.isInfinity()) {
          var Ct = Bt.getX(), Et = Ct.umod(this.n);
          if (Et.cmpn(0) !== 0) {
            var Y = At.invm(this.n).mul(Et.mul(x.getPrivate()).iadd(M));
            if (Y = Y.umod(this.n), Y.cmpn(0) !== 0) {
              var kt = (Bt.getY().isOdd() ? 1 : 0) | (Ct.cmp(Et) !== 0 ? 2 : 0);
              return I.canonical && Y.cmp(this.nh) > 0 && (Y = this.n.sub(Y), kt ^= 1), new y({ r: Et, s: Y, recoveryParam: kt });
            }
          }
        }
      }
    }
  }, S.prototype.verify = function(M, x, k, I, D) {
    D || (D = {}), M = this._truncateToN(M, !1, D.msgBitLength), k = this.keyFromPublic(k, I), x = new y(x, "hex");
    var L = x.r, W = x.s;
    if (L.cmpn(1) < 0 || L.cmp(this.n) >= 0 || W.cmpn(1) < 0 || W.cmp(this.n) >= 0)
      return !1;
    var z = W.invm(this.n), N = z.mul(M).umod(this.n), lt = z.mul(L).umod(this.n), H;
    return this.curve._maxwellTrick ? (H = this.g.jmulAdd(N, k.getPublic(), lt), H.isInfinity() ? !1 : H.eqXToP(L)) : (H = this.g.mulAdd(N, k.getPublic(), lt), H.isInfinity() ? !1 : H.getX().umod(this.n).cmp(L) === 0);
  }, S.prototype.recoverPubKey = function(B, M, x, k) {
    f((3 & x) === x, "The recovery param is more than two bits"), M = new y(M, k);
    var I = this.n, D = new h(B), L = M.r, W = M.s, z = x & 1, N = x >> 1;
    if (L.cmp(this.curve.p.umod(this.curve.n)) >= 0 && N)
      throw new Error("Unable to find sencond key candinate");
    N ? L = this.curve.pointFromX(L.add(this.curve.n), z) : L = this.curve.pointFromX(L, z);
    var lt = M.r.invm(I), H = I.sub(D).mul(lt).umod(I), At = W.mul(lt).umod(I);
    return this.g.mulAdd(H, L, At);
  }, S.prototype.getKeyRecoveryParam = function(B, M, x, k) {
    if (M = new y(M, k), M.recoveryParam !== null)
      return M.recoveryParam;
    for (var I = 0; I < 4; I++) {
      var D;
      try {
        D = this.recoverPubKey(B, M, I);
      } catch (L) {
        continue;
      }
      if (D.eq(x))
        return I;
    }
    throw new Error("Unable to find valid recovery factor");
  }, Pf;
}
var nn = ze, Eo = nn.assert, Oa = nn.parseBytes, Ai = nn.cachedProperty;
function _e(h, n) {
  this.eddsa = h, this._secret = Oa(n.secret), h.isPoint(n.pub) ? this._pub = n.pub : this._pubBytes = Oa(n.pub);
}
_e.fromPublic = function(n, o) {
  return o instanceof _e ? o : new _e(n, { pub: o });
};
_e.fromSecret = function(n, o) {
  return o instanceof _e ? o : new _e(n, { secret: o });
};
_e.prototype.secret = function() {
  return this._secret;
};
Ai(_e, "pubBytes", function() {
  return this.eddsa.encodePoint(this.pub());
});
Ai(_e, "pub", function() {
  return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
});
Ai(_e, "privBytes", function() {
  var n = this.eddsa, o = this.hash(), s = n.encodingLength - 1, m = o.slice(0, n.encodingLength);
  return m[0] &= 248, m[s] &= 127, m[s] |= 64, m;
});
Ai(_e, "priv", function() {
  return this.eddsa.decodeInt(this.privBytes());
});
Ai(_e, "hash", function() {
  return this.eddsa.hash().update(this.secret()).digest();
});
Ai(_e, "messagePrefix", function() {
  return this.hash().slice(this.eddsa.encodingLength);
});
_e.prototype.sign = function(n) {
  return Eo(this._secret, "KeyPair can only verify"), this.eddsa.sign(n, this);
};
_e.prototype.verify = function(n, o) {
  return this.eddsa.verify(n, o, this);
};
_e.prototype.getSecret = function(n) {
  return Eo(this._secret, "KeyPair is public only"), nn.encode(this.secret(), n);
};
_e.prototype.getPublic = function(n) {
  return nn.encode(this.pubBytes(), n);
};
var F2 = _e, P2 = Rr, ff = ze, za = ff.assert, af = ff.cachedProperty, D2 = ff.parseBytes;
function ri(h, n) {
  this.eddsa = h, typeof n != "object" && (n = D2(n)), Array.isArray(n) && (za(n.length === h.encodingLength * 2, "Signature has invalid size"), n = {
    R: n.slice(0, h.encodingLength),
    S: n.slice(h.encodingLength)
  }), za(n.R && n.S, "Signature without R or S"), h.isPoint(n.R) && (this._R = n.R), n.S instanceof P2 && (this._S = n.S), this._Rencoded = Array.isArray(n.R) ? n.R : n.Rencoded, this._Sencoded = Array.isArray(n.S) ? n.S : n.Sencoded;
}
af(ri, "S", function() {
  return this.eddsa.decodeInt(this.Sencoded());
});
af(ri, "R", function() {
  return this.eddsa.decodePoint(this.Rencoded());
});
af(ri, "Rencoded", function() {
  return this.eddsa.encodePoint(this.R());
});
af(ri, "Sencoded", function() {
  return this.eddsa.encodeInt(this.S());
});
ri.prototype.toBytes = function() {
  return this.Rencoded().concat(this.Sencoded());
};
ri.prototype.toHex = function() {
  return ff.encode(this.toBytes(), "hex").toUpperCase();
};
var $2 = ri, N2 = ef, U2 = tf, pi = ze, L2 = pi.assert, Io = pi.parseBytes, ko = F2, Ka = $2;
function $e(h) {
  if (L2(h === "ed25519", "only tested with ed25519 so far"), !(this instanceof $e))
    return new $e(h);
  h = U2[h].curve, this.curve = h, this.g = h.g, this.g.precompute(h.n.bitLength() + 1), this.pointClass = h.point().constructor, this.encodingLength = Math.ceil(h.n.bitLength() / 8), this.hash = N2.sha512;
}
var O2 = $e;
$e.prototype.sign = function(n, o) {
  n = Io(n);
  var s = this.keyFromSecret(o), m = this.hashInt(s.messagePrefix(), n), f = this.g.mul(m), g = this.encodePoint(f), y = this.hashInt(g, s.pubBytes(), n).mul(s.priv()), S = m.add(y).umod(this.curve.n);
  return this.makeSignature({ R: f, S, Rencoded: g });
};
$e.prototype.verify = function(n, o, s) {
  if (n = Io(n), o = this.makeSignature(o), o.S().gte(o.eddsa.curve.n) || o.S().isNeg())
    return !1;
  var m = this.keyFromPublic(s), f = this.hashInt(o.Rencoded(), m.pubBytes(), n), g = this.g.mul(o.S()), y = o.R().add(m.pub().mul(f));
  return y.eq(g);
};
$e.prototype.hashInt = function() {
  for (var n = this.hash(), o = 0; o < arguments.length; o++)
    n.update(arguments[o]);
  return pi.intFromLE(n.digest()).umod(this.curve.n);
};
$e.prototype.keyFromPublic = function(n) {
  return ko.fromPublic(this, n);
};
$e.prototype.keyFromSecret = function(n) {
  return ko.fromSecret(this, n);
};
$e.prototype.makeSignature = function(n) {
  return n instanceof Ka ? n : new Ka(this, n);
};
$e.prototype.encodePoint = function(n) {
  var o = n.getY().toArray("le", this.encodingLength);
  return o[this.encodingLength - 1] |= n.getX().isOdd() ? 128 : 0, o;
};
$e.prototype.decodePoint = function(n) {
  n = pi.parseBytes(n);
  var o = n.length - 1, s = n.slice(0, o).concat(n[o] & -129), m = (n[o] & 128) !== 0, f = pi.intFromLE(s);
  return this.curve.pointFromY(f, m);
};
$e.prototype.encodeInt = function(n) {
  return n.toArray("le", this.encodingLength);
};
$e.prototype.decodeInt = function(n) {
  return pi.intFromLE(n);
};
$e.prototype.isPoint = function(n) {
  return n instanceof this.pointClass;
};
var Ha;
function Z0() {
  return Ha || (Ha = 1, function(h) {
    var n = h;
    n.version = zv.version, n.utils = ze, n.rand = P0(), n.curve = z0, n.curves = tf, n.ec = q2(), n.eddsa = O2;
  }(If)), If;
}
var rr = {}, Df = {}, W0 = { exports: {} };
W0.exports;
(function(h) {
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
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Pe.Buffer;
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
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (a = t.length - 1, d = 0; a >= 0; a -= 3)
          c = t[a] | t[a - 1] << 8 | t[a - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (a = 0, d = 0; a < t.length; a += 3)
          c = t[a] | t[a + 1] << 8 | t[a + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (a = u % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var a = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        a *= i, v >= 49 ? a += v - 49 + 10 : v >= 17 ? a += v - 17 + 10 : a += v;
      }
      return a;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var a = 0, d = 1; d <= 67108863; d *= r)
        a++;
      a--, d = d / r | 0;
      for (var c = t.length - i, v = c % a, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += a)
        e = B(t, l, l + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    ], k = [
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
        for (var a = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = k[t];
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
      var a = this.byteLength(), d = i || Math.max(1, a);
      s(a <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
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
    function I(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, a = r % 26;
        t[r] = (p.words[i] & 1 << a) >>> a;
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
      for (var a = 0; a < i.length; a++)
        this.words[a] = r.words[a] ^ i.words[a];
      if (this !== r)
        for (; a < r.length; a++)
          this.words[a] = r.words[a];
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
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, a = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << a : this.words[i] = this.words[i] & ~(1 << a), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, a;
      this.length > t.length ? (i = this, a = t) : (i = t, a = this);
      for (var d = 0, c = 0; c < a.length; c++)
        r = (i.words[c] | 0) + (a.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
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
      var a, d;
      i > 0 ? (a = this, d = t) : (a = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (a.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < a.length; v++)
        r = (a.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < a.length && a !== this)
        for (; v < a.length; v++)
          this.words[v] = a.words[v];
      return this.length = Math.max(this.length, v), a !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var F = e - C | 0;
          a = p.words[F] | 0, d = t.words[C] | 0, c = a * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var L = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = a[0] | 0, _ = b & 8191, C = b >>> 13, F = a[1] | 0, O = F & 8191, R = F >>> 13, P = a[2] | 0, $ = P & 8191, K = P >>> 13, It = a[3] | 0, Z = It & 8191, J = It >>> 13, qt = a[4] | 0, tt = qt & 8191, vt = qt >>> 13, Dt = a[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = a[6] | 0, j = Pt & 8191, dt = Pt >>> 13, Ft = a[7] | 0, Q = Ft & 8191, ct = Ft >>> 13, Lt = a[8] | 0, E = Lt & 8191, w = Lt >>> 13, A = a[9] | 0, T = A & 8191, q = A >>> 13, V = d[0] | 0, U = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, zt = d[3] | 0, nt = zt & 8191, bt = zt >>> 13, Kt = d[4] | 0, ft = Kt & 8191, yt = Kt >>> 13, Ht = d[5] | 0, at = Ht & 8191, wt = Ht >>> 13, Zt = d[6] | 0, ht = Zt & 8191, Mt = Zt >>> 13, Wt = d[7] | 0, st = Wt & 8191, xt = Wt >>> 13, Vt = d[8] | 0, ot = Vt & 8191, _t = Vt >>> 13, Yt = d[9] | 0, ut = Yt & 8191, St = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, U), e = Math.imul(_, X), e = e + Math.imul(C, U) | 0, l = Math.imul(C, X);
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(O, U), e = Math.imul(O, X), e = e + Math.imul(R, U) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul($, U), e = Math.imul($, X), e = e + Math.imul(K, U) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var jt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, u = Math.imul(Z, U), e = Math.imul(Z, X), e = e + Math.imul(J, U) | 0, l = Math.imul(J, X), u = u + Math.imul($, G) | 0, e = e + Math.imul($, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(tt, U), e = Math.imul(tt, X), e = e + Math.imul(vt, U) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul($, it) | 0, e = e + Math.imul($, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(et, U), e = Math.imul(et, X), e = e + Math.imul(pt, U) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul($, nt) | 0, e = e + Math.imul($, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(j, U), e = Math.imul(j, X), e = e + Math.imul(dt, U) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul($, ft) | 0, e = e + Math.imul($, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(Q, U), e = Math.imul(Q, X), e = e + Math.imul(ct, U) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul($, at) | 0, e = e + Math.imul($, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(E, U), e = Math.imul(E, X), e = e + Math.imul(w, U) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul($, ht) | 0, e = e + Math.imul($, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(T, U), e = Math.imul(T, X), e = e + Math.imul(q, U) | 0, l = Math.imul(q, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul($, st) | 0, e = e + Math.imul($, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(q, G) | 0, l = Math.imul(q, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul($, ot) | 0, e = e + Math.imul($, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(q, it) | 0, l = Math.imul(q, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul($, ut) | 0, e = e + Math.imul($, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(q, nt) | 0, l = Math.imul(q, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(q, ft) | 0, l = Math.imul(q, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(q, at) | 0, l = Math.imul(q, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(q, ht) | 0, l = Math.imul(q, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(q, st) | 0, l = Math.imul(q, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(q, ot) | 0, l = Math.imul(q, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(q, ut) | 0, l = Math.imul(q, St);
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = $t, c[1] = Nt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (L = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, F = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, F = F + v | 0, v = F & 67108863, c = c + (F >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new N();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = L(this, t, r) : a < 63 ? i = D(this, t, r) : a < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function N(p, t) {
      this.x = p, this.y = t;
    }
    N.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, N.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, N.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, N.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, F = 0; F < v; F++) {
            var O = i[b + F], R = a[b + F], P = i[b + F + v], $ = a[b + F + v], K = _ * P - C * $;
            $ = _ * $ + C * P, P = K, i[b + F] = O + P, a[b + F] = R + $, i[b + F + v] = O - P, a[b + F + v] = R - $, F !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, N.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, N.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, N.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, N.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, N.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, N.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), u = new Array(a), e = new Array(a), l = new Array(a), b = new Array(a), _ = new Array(a), C = i.words;
      C.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, l, a), this.transform(v, c, u, e, a, d), this.transform(l, c, b, _, a, d);
      for (var F = 0; F < a; F++) {
        var O = u[F] * b[F] - e[F] * _[F];
        e[F] = u[F] * _[F] + e[F] * b[F], u[F] = O;
      }
      return this.conjugate(u, e, a), this.transform(u, e, C, c, a, d), this.conjugate(C, c, a), this.normalize13b(C, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
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
        var a = (this.words[i] | 0) * t, d = (a & 67108863) + (r & 67108863);
        r >>= 26, r += a / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = I(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, u = (this.words[d] | 0) - v << r;
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
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (a -= c, a = Math.max(0, a), u) {
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
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= a); e--) {
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
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
      var a = t.length + i, d;
      this._expand(a);
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
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var u = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = a.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (a = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (a.words[d.length + _] | 0) * 67108864 + (a.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), a._ishlnsubmul(d, C, _); a.negative !== 0; )
          C--, a.negative = 0, a._ishlnsubmul(d, 1, _), a.isZero() || (a.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var a, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (a = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: a,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (a = c.div.neg()), {
        div: a,
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
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, a = t.ushrn(1), d = t.andln(1), c = i.cmp(a);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(l)), a.iushrn(1), d.iushrn(1);
        for (var C = 0, F = 1; !(i.words[0] & F) && C < 26; ++C, F <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
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
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var b;
      return r.cmpn(1) === 0 ? b = a : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var a = 0; r.isEven() && i.isEven(); a++)
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
      return i.iushln(a);
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= a, this;
      for (var d = a, c = i; d !== 0 && c < this.length; c++) {
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
        var a = this.words[0] | 0;
        i = a === t ? 0 : a < t ? -1 : 1;
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
        var a = this.words[i] | 0, d = t.words[i] | 0;
        if (a !== d) {
          a < d ? r = -1 : a > d && (r = 1);
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
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
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
      for (var i = 4194303, a = Math.min(t.length, 9), d = 0; d < a; d++)
        r.words[d] = t.words[d];
      if (r.length = a, t.length <= 9) {
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
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
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
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
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
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      s(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, a), b = this.pow(t, a.addn(1).iushrn(1)), _ = this.pow(t, a), C = d; _.cmp(c) !== 0; ) {
        for (var F = _, O = 0; F.cmp(c) !== 0; O++)
          F = F.redSqr();
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
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== a[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, a[v]), u = 0, v = 0);
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
      return new kt(t);
    };
    function kt(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(kt, Y), kt.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, kt.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, kt.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(W0);
var z2 = W0.exports, $f = {}, Za;
function K2() {
  return Za || (Za = 1, function(h) {
    var n = fn(), o = Jt, s = h;
    s.define = function(g, y) {
      return new m(g, y);
    };
    function m(f, g) {
      this.name = f, this.body = g, this.decoders = {}, this.encoders = {};
    }
    m.prototype._createNamed = function(g) {
      var y;
      try {
        y = Pe.runInThisContext(
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
  }($f)), $f;
}
var Nf = {}, Ro = {}, H2 = Jt;
function Ge(h) {
  this._reporterState = {
    obj: null,
    path: [],
    options: h || {},
    errors: []
  };
}
Ro.Reporter = Ge;
Ge.prototype.isError = function(n) {
  return n instanceof mi;
};
Ge.prototype.save = function() {
  var n = this._reporterState;
  return { obj: n.obj, pathLen: n.path.length };
};
Ge.prototype.restore = function(n) {
  var o = this._reporterState;
  o.obj = n.obj, o.path = o.path.slice(0, n.pathLen);
};
Ge.prototype.enterKey = function(n) {
  return this._reporterState.path.push(n);
};
Ge.prototype.exitKey = function(n) {
  var o = this._reporterState;
  o.path = o.path.slice(0, n - 1);
};
Ge.prototype.leaveKey = function(n, o, s) {
  var m = this._reporterState;
  this.exitKey(n), m.obj !== null && (m.obj[o] = s);
};
Ge.prototype.path = function() {
  return this._reporterState.path.join("/");
};
Ge.prototype.enterObject = function() {
  var n = this._reporterState, o = n.obj;
  return n.obj = {}, o;
};
Ge.prototype.leaveObject = function(n) {
  var o = this._reporterState, s = o.obj;
  return o.obj = n, s;
};
Ge.prototype.error = function(n) {
  var o, s = this._reporterState, m = n instanceof mi;
  if (m ? o = n : o = new mi(s.path.map(function(f) {
    return "[" + JSON.stringify(f) + "]";
  }).join(""), n.message || n, n.stack), !s.options.partial)
    throw o;
  return m || s.errors.push(o), o;
};
Ge.prototype.wrapResult = function(n) {
  var o = this._reporterState;
  return o.options.partial ? {
    result: this.isError(n) ? null : n,
    errors: o.errors
  } : n;
};
function mi(h, n) {
  this.path = h, this.rethrow(n);
}
H2(mi, Error);
mi.prototype.rethrow = function(n) {
  if (this.message = n + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, mi), !this.stack)
    try {
      throw new Error(this.message);
    } catch (o) {
      this.stack = o.stack;
    }
  return this;
};
var cn = {}, Wa;
function Va() {
  if (Wa)
    return cn;
  Wa = 1;
  var h = Jt, n = Ui().Reporter, o = gr.Buffer;
  function s(f, g) {
    if (n.call(this, g), !o.isBuffer(f)) {
      this.error("Input not Buffer");
      return;
    }
    this.base = f, this.offset = 0, this.length = f.length;
  }
  h(s, n), cn.DecoderBuffer = s, s.prototype.save = function() {
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
  return cn.EncoderBuffer = m, m.prototype.join = function(g, y) {
    return g || (g = new o(this.length)), y || (y = 0), this.length === 0 || (Array.isArray(this.value) ? this.value.forEach(function(S) {
      S.join(g, y), y += S.length;
    }) : (typeof this.value == "number" ? g[y] = this.value : typeof this.value == "string" ? g.write(this.value, y) : o.isBuffer(this.value) && this.value.copy(g, y), y += this.length)), g;
  }, cn;
}
var Uf, Ya;
function Z2() {
  if (Ya)
    return Uf;
  Ya = 1;
  var h = Ui().Reporter, n = Ui().EncoderBuffer, o = Ui().DecoderBuffer, s = We, m = [
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
  Uf = y;
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
    S.forEach(function(I) {
      x[I] = M[I];
    });
    var k = new this.constructor(x.parent);
    return k._baseState = x, k;
  }, y.prototype._wrap = function() {
    var M = this._baseState;
    f.forEach(function(x) {
      this[x] = function() {
        var I = new this.constructor(this);
        return M.children.push(I), I[x].apply(I, arguments);
      };
    }, this);
  }, y.prototype._init = function(M) {
    var x = this._baseState;
    s(x.parent === null), M.call(this), x.children = x.children.filter(function(k) {
      return k._baseState.parent === this;
    }, this), s.equal(x.children.length, 1, "Root node can have only one child");
  }, y.prototype._useArgs = function(M) {
    var x = this._baseState, k = M.filter(function(I) {
      return I instanceof this.constructor;
    }, this);
    M = M.filter(function(I) {
      return !(I instanceof this.constructor);
    }, this), k.length !== 0 && (s(x.children === null), x.children = k, k.forEach(function(I) {
      I._baseState.parent = this;
    }, this)), M.length !== 0 && (s(x.args === null), x.args = M, x.reverseArgs = M.map(function(I) {
      if (typeof I != "object" || I.constructor !== Object)
        return I;
      var D = {};
      return Object.keys(I).forEach(function(L) {
        L == (L | 0) && (L |= 0);
        var W = I[L];
        D[W] = L;
      }), D;
    }));
  }, g.forEach(function(B) {
    y.prototype[B] = function() {
      var x = this._baseState;
      throw new Error(B + " not implemented for encoding: " + x.enc);
    };
  }), m.forEach(function(B) {
    y.prototype[B] = function() {
      var x = this._baseState, k = Array.prototype.slice.call(arguments);
      return s(x.tag === null), x.tag = B, this._useArgs(k), this;
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
    return s(x.choice === null), x.choice = M, this._useArgs(Object.keys(M).map(function(k) {
      return M[k];
    })), this;
  }, y.prototype.contains = function(M) {
    var x = this._baseState;
    return s(x.use === null), x.contains = M, this;
  }, y.prototype._decode = function(M, x) {
    var k = this._baseState;
    if (k.parent === null)
      return M.wrapResult(k.children[0]._decode(M, x));
    var I = k.default, D = !0, L = null;
    if (k.key !== null && (L = M.enterKey(k.key)), k.optional) {
      var W = null;
      if (k.explicit !== null ? W = k.explicit : k.implicit !== null ? W = k.implicit : k.tag !== null && (W = k.tag), W === null && !k.any) {
        var z = M.save();
        try {
          k.choice === null ? this._decodeGeneric(k.tag, M, x) : this._decodeChoice(M, x), D = !0;
        } catch (Ct) {
          D = !1;
        }
        M.restore(z);
      } else if (D = this._peekTag(M, W, k.any), M.isError(D))
        return D;
    }
    var N;
    if (k.obj && D && (N = M.enterObject()), D) {
      if (k.explicit !== null) {
        var lt = this._decodeTag(M, k.explicit);
        if (M.isError(lt))
          return lt;
        M = lt;
      }
      var H = M.offset;
      if (k.use === null && k.choice === null) {
        if (k.any)
          var z = M.save();
        var At = this._decodeTag(
          M,
          k.implicit !== null ? k.implicit : k.tag,
          k.any
        );
        if (M.isError(At))
          return At;
        k.any ? I = M.raw(z) : M = At;
      }
      if (x && x.track && k.tag !== null && x.track(M.path(), H, M.length, "tagged"), x && x.track && k.tag !== null && x.track(M.path(), M.offset, M.length, "content"), k.any ? I = I : k.choice === null ? I = this._decodeGeneric(k.tag, M, x) : I = this._decodeChoice(M, x), M.isError(I))
        return I;
      if (!k.any && k.choice === null && k.children !== null && k.children.forEach(function(Et) {
        Et._decode(M, x);
      }), k.contains && (k.tag === "octstr" || k.tag === "bitstr")) {
        var Bt = new o(I);
        I = this._getUse(k.contains, M._reporterState.obj)._decode(Bt, x);
      }
    }
    return k.obj && D && (I = M.leaveObject(N)), k.key !== null && (I !== null || D === !0) ? M.leaveKey(L, k.key, I) : L !== null && M.exitKey(L), I;
  }, y.prototype._decodeGeneric = function(M, x, k) {
    var I = this._baseState;
    return M === "seq" || M === "set" ? null : M === "seqof" || M === "setof" ? this._decodeList(x, M, I.args[0], k) : /str$/.test(M) ? this._decodeStr(x, M, k) : M === "objid" && I.args ? this._decodeObjid(x, I.args[0], I.args[1], k) : M === "objid" ? this._decodeObjid(x, null, null, k) : M === "gentime" || M === "utctime" ? this._decodeTime(x, M, k) : M === "null_" ? this._decodeNull(x, k) : M === "bool" ? this._decodeBool(x, k) : M === "objDesc" ? this._decodeStr(x, M, k) : M === "int" || M === "enum" ? this._decodeInt(x, I.args && I.args[0], k) : I.use !== null ? this._getUse(I.use, x._reporterState.obj)._decode(x, k) : x.error("unknown tag: " + M);
  }, y.prototype._getUse = function(M, x) {
    var k = this._baseState;
    return k.useDecoder = this._use(M, x), s(k.useDecoder._baseState.parent === null), k.useDecoder = k.useDecoder._baseState.children[0], k.implicit !== k.useDecoder._baseState.implicit && (k.useDecoder = k.useDecoder.clone(), k.useDecoder._baseState.implicit = k.implicit), k.useDecoder;
  }, y.prototype._decodeChoice = function(M, x) {
    var k = this._baseState, I = null, D = !1;
    return Object.keys(k.choice).some(function(L) {
      var W = M.save(), z = k.choice[L];
      try {
        var N = z._decode(M, x);
        if (M.isError(N))
          return !1;
        I = { type: L, value: N }, D = !0;
      } catch (lt) {
        return M.restore(W), !1;
      }
      return !0;
    }, this), D ? I : M.error("Choice not matched");
  }, y.prototype._createEncoderBuffer = function(M) {
    return new n(M, this.reporter);
  }, y.prototype._encode = function(M, x, k) {
    var I = this._baseState;
    if (!(I.default !== null && I.default === M)) {
      var D = this._encodeValue(M, x, k);
      if (D !== void 0 && !this._skipDefault(D, x, k))
        return D;
    }
  }, y.prototype._encodeValue = function(M, x, k) {
    var I = this._baseState;
    if (I.parent === null)
      return I.children[0]._encode(M, x || new h());
    var z = null;
    if (this.reporter = x, I.optional && M === void 0)
      if (I.default !== null)
        M = I.default;
      else
        return;
    var D = null, L = !1;
    if (I.any)
      z = this._createEncoderBuffer(M);
    else if (I.choice)
      z = this._encodeChoice(M, x);
    else if (I.contains)
      D = this._getUse(I.contains, k)._encode(M, x), L = !0;
    else if (I.children)
      D = I.children.map(function(H) {
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
    else if (I.tag === "seqof" || I.tag === "setof") {
      if (!(I.args && I.args.length === 1))
        return x.error("Too many args for : " + I.tag);
      if (!Array.isArray(M))
        return x.error("seqof/setof, but data is not Array");
      var W = this.clone();
      W._baseState.implicit = null, D = this._createEncoderBuffer(M.map(function(H) {
        var At = this._baseState;
        return this._getUse(At.args[0], M)._encode(H, x);
      }, W));
    } else
      I.use !== null ? z = this._getUse(I.use, k)._encode(M, x) : (D = this._encodePrimitive(I.tag, M), L = !0);
    var z;
    if (!I.any && I.choice === null) {
      var N = I.implicit !== null ? I.implicit : I.tag, lt = I.implicit === null ? "universal" : "context";
      N === null ? I.use === null && x.error("Tag could be omitted only for .use()") : I.use === null && (z = this._encodeComposite(N, L, lt, D));
    }
    return I.explicit !== null && (z = this._encodeComposite(I.explicit, !1, "context", z)), z;
  }, y.prototype._encodeChoice = function(M, x) {
    var k = this._baseState, I = k.choice[M.type];
    return I || s(
      !1,
      M.type + " not found in " + JSON.stringify(Object.keys(k.choice))
    ), I._encode(M.value, x);
  }, y.prototype._encodePrimitive = function(M, x) {
    var k = this._baseState;
    if (/str$/.test(M))
      return this._encodeStr(x, M);
    if (M === "objid" && k.args)
      return this._encodeObjid(x, k.reverseArgs[0], k.args[1]);
    if (M === "objid")
      return this._encodeObjid(x, null, null);
    if (M === "gentime" || M === "utctime")
      return this._encodeTime(x, M);
    if (M === "null_")
      return this._encodeNull();
    if (M === "int" || M === "enum")
      return this._encodeInt(x, k.args && k.reverseArgs[0]);
    if (M === "bool")
      return this._encodeBool(x);
    if (M === "objDesc")
      return this._encodeStr(x, M);
    throw new Error("Unsupported tag: " + M);
  }, y.prototype._isNumstr = function(M) {
    return /^[0-9 ]*$/.test(M);
  }, y.prototype._isPrintstr = function(M) {
    return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(M);
  }, Uf;
}
var Ja;
function Ui() {
  return Ja || (Ja = 1, function(h) {
    var n = h;
    n.Reporter = Ro.Reporter, n.DecoderBuffer = Va().DecoderBuffer, n.EncoderBuffer = Va().EncoderBuffer, n.Node = Z2();
  }(Nf)), Nf;
}
var Lf = {}, Of = {}, Ga;
function W2() {
  return Ga || (Ga = 1, function(h) {
    var n = To();
    h.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    }, h.tagClassByName = n._reverse(h.tagClass), h.tag = {
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
    }, h.tagByName = n._reverse(h.tag);
  }(Of)), Of;
}
var Xa;
function To() {
  return Xa || (Xa = 1, function(h) {
    var n = h;
    n._reverse = function(s) {
      var m = {};
      return Object.keys(s).forEach(function(f) {
        (f | 0) == f && (f = f | 0);
        var g = s[f];
        m[g] = f;
      }), m;
    }, n.der = W2();
  }(Lf)), Lf;
}
var zf = {}, Kf, ja;
function Co() {
  if (ja)
    return Kf;
  ja = 1;
  var h = Jt, n = fn(), o = n.base, s = n.bignum, m = n.constants.der;
  function f(B) {
    this.enc = "der", this.name = B.name, this.entity = B, this.tree = new g(), this.tree._init(B.body);
  }
  Kf = f, f.prototype.decode = function(M, x) {
    return M instanceof o.DecoderBuffer || (M = new o.DecoderBuffer(M, x)), this.tree._decode(M, x);
  };
  function g(B) {
    o.Node.call(this, "der", B);
  }
  h(g, o.Node), g.prototype._peekTag = function(M, x, k) {
    if (M.isEmpty())
      return !1;
    var I = M.save(), D = y(M, 'Failed to peek tag: "' + x + '"');
    return M.isError(D) ? D : (M.restore(I), D.tag === x || D.tagStr === x || D.tagStr + "of" === x || k);
  }, g.prototype._decodeTag = function(M, x, k) {
    var I = y(
      M,
      'Failed to decode tag of "' + x + '"'
    );
    if (M.isError(I))
      return I;
    var D = S(
      M,
      I.primitive,
      'Failed to get length of "' + x + '"'
    );
    if (M.isError(D))
      return D;
    if (!k && I.tag !== x && I.tagStr !== x && I.tagStr + "of" !== x)
      return M.error('Failed to match tag: "' + x + '"');
    if (I.primitive || D !== null)
      return M.skip(D, 'Failed to match body of: "' + x + '"');
    var L = M.save(), W = this._skipUntilEnd(
      M,
      'Failed to skip indefinite length body: "' + this.tag + '"'
    );
    return M.isError(W) ? W : (D = M.offset - L.offset, M.restore(L), M.skip(D, 'Failed to match body of: "' + x + '"'));
  }, g.prototype._skipUntilEnd = function(M, x) {
    for (; ; ) {
      var k = y(M, x);
      if (M.isError(k))
        return k;
      var I = S(M, k.primitive, x);
      if (M.isError(I))
        return I;
      var D;
      if (k.primitive || I !== null ? D = M.skip(I) : D = this._skipUntilEnd(M, x), M.isError(D))
        return D;
      if (k.tagStr === "end")
        break;
    }
  }, g.prototype._decodeList = function(M, x, k, I) {
    for (var D = []; !M.isEmpty(); ) {
      var L = this._peekTag(M, "end");
      if (M.isError(L))
        return L;
      var W = k.decode(M, "der", I);
      if (M.isError(W) && L)
        break;
      D.push(W);
    }
    return D;
  }, g.prototype._decodeStr = function(M, x) {
    if (x === "bitstr") {
      var k = M.readUInt8();
      return M.isError(k) ? k : { unused: k, data: M.raw() };
    } else if (x === "bmpstr") {
      var I = M.raw();
      if (I.length % 2 === 1)
        return M.error("Decoding of string type: bmpstr length mismatch");
      for (var D = "", L = 0; L < I.length / 2; L++)
        D += String.fromCharCode(I.readUInt16BE(L * 2));
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
  }, g.prototype._decodeObjid = function(M, x, k) {
    for (var I, D = [], L = 0; !M.isEmpty(); ) {
      var W = M.readUInt8();
      L <<= 7, L |= W & 127, W & 128 || (D.push(L), L = 0);
    }
    W & 128 && D.push(L);
    var z = D[0] / 40 | 0, N = D[0] % 40;
    if (k ? I = D : I = [z, N].concat(D.slice(1)), x) {
      var lt = x[I.join(" ")];
      lt === void 0 && (lt = x[I.join(".")]), lt !== void 0 && (I = lt);
    }
    return I;
  }, g.prototype._decodeTime = function(M, x) {
    var k = M.raw().toString();
    if (x === "gentime")
      var I = k.slice(0, 4) | 0, D = k.slice(4, 6) | 0, L = k.slice(6, 8) | 0, W = k.slice(8, 10) | 0, z = k.slice(10, 12) | 0, N = k.slice(12, 14) | 0;
    else if (x === "utctime") {
      var I = k.slice(0, 2) | 0, D = k.slice(2, 4) | 0, L = k.slice(4, 6) | 0, W = k.slice(6, 8) | 0, z = k.slice(8, 10) | 0, N = k.slice(10, 12) | 0;
      I < 70 ? I = 2e3 + I : I = 1900 + I;
    } else
      return M.error("Decoding " + x + " time is not supported yet");
    return Date.UTC(I, D - 1, L, W, z, N, 0);
  }, g.prototype._decodeNull = function(M) {
    return null;
  }, g.prototype._decodeBool = function(M) {
    var x = M.readUInt8();
    return M.isError(x) ? x : x !== 0;
  }, g.prototype._decodeInt = function(M, x) {
    var k = M.raw(), I = new s(k);
    return x && (I = x[I.toString(10)] || I), I;
  }, g.prototype._use = function(M, x) {
    return typeof M == "function" && (M = M(x)), M._getDecoder("der").tree;
  };
  function y(B, M) {
    var x = B.readUInt8(M);
    if (B.isError(x))
      return x;
    var k = m.tagClass[x >> 6], I = (x & 32) === 0;
    if ((x & 31) === 31) {
      var D = x;
      for (x = 0; (D & 128) === 128; ) {
        if (D = B.readUInt8(M), B.isError(D))
          return D;
        x <<= 7, x |= D & 127;
      }
    } else
      x &= 31;
    var L = m.tag[x];
    return {
      cls: k,
      primitive: I,
      tag: x,
      tagStr: L
    };
  }
  function S(B, M, x) {
    var k = B.readUInt8(x);
    if (B.isError(k))
      return k;
    if (!M && k === 128)
      return null;
    if (!(k & 128))
      return k;
    var I = k & 127;
    if (I > 4)
      return B.error("length octect is too long");
    k = 0;
    for (var D = 0; D < I; D++) {
      k <<= 8;
      var L = B.readUInt8(x);
      if (B.isError(L))
        return L;
      k |= L;
    }
    return k;
  }
  return Kf;
}
var Hf, Qa;
function V2() {
  if (Qa)
    return Hf;
  Qa = 1;
  var h = Jt, n = gr.Buffer, o = Co();
  function s(m) {
    o.call(this, m), this.enc = "pem";
  }
  return h(s, o), Hf = s, s.prototype.decode = function(f, g) {
    for (var y = f.toString().split(/[\r\n]+/g), S = g.label.toUpperCase(), B = /^-----(BEGIN|END) ([^-]+)-----$/, M = -1, x = -1, k = 0; k < y.length; k++) {
      var I = y[k].match(B);
      if (I !== null && I[2] === S)
        if (M === -1) {
          if (I[1] !== "BEGIN")
            break;
          M = k;
        } else {
          if (I[1] !== "END")
            break;
          x = k;
          break;
        }
    }
    if (M === -1 || x === -1)
      throw new Error("PEM section not found for: " + S);
    var D = y.slice(M + 1, x).join("");
    D.replace(/[^a-z0-9\+\/=]+/gi, "");
    var L = new n(D, "base64");
    return o.prototype.decode.call(this, L, g);
  }, Hf;
}
var th;
function Y2() {
  return th || (th = 1, function(h) {
    var n = h;
    n.der = Co(), n.pem = V2();
  }(zf)), zf;
}
var Zf = {}, Wf, eh;
function qo() {
  if (eh)
    return Wf;
  eh = 1;
  var h = Jt, n = gr.Buffer, o = fn(), s = o.base, m = o.constants.der;
  function f(B) {
    this.enc = "der", this.name = B.name, this.entity = B, this.tree = new g(), this.tree._init(B.body);
  }
  Wf = f, f.prototype.encode = function(M, x) {
    return this.tree._encode(M, x).join();
  };
  function g(B) {
    s.Node.call(this, "der", B);
  }
  h(g, s.Node), g.prototype._encodeComposite = function(M, x, k, I) {
    var D = S(M, x, k, this.reporter);
    if (I.length < 128) {
      var z = new n(2);
      return z[0] = D, z[1] = I.length, this._createEncoderBuffer([z, I]);
    }
    for (var L = 1, W = I.length; W >= 256; W >>= 8)
      L++;
    var z = new n(1 + 1 + L);
    z[0] = D, z[1] = 128 | L;
    for (var W = 1 + L, N = I.length; N > 0; W--, N >>= 8)
      z[W] = N & 255;
    return this._createEncoderBuffer([z, I]);
  }, g.prototype._encodeStr = function(M, x) {
    if (x === "bitstr")
      return this._createEncoderBuffer([M.unused | 0, M.data]);
    if (x === "bmpstr") {
      for (var k = new n(M.length * 2), I = 0; I < M.length; I++)
        k.writeUInt16BE(M.charCodeAt(I), I * 2);
      return this._createEncoderBuffer(k);
    } else
      return x === "numstr" ? this._isNumstr(M) ? this._createEncoderBuffer(M) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : x === "printstr" ? this._isPrintstr(M) ? this._createEncoderBuffer(M) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(x) ? this._createEncoderBuffer(M) : x === "objDesc" ? this._createEncoderBuffer(M) : this.reporter.error("Encoding of string type: " + x + " unsupported");
  }, g.prototype._encodeObjid = function(M, x, k) {
    if (typeof M == "string") {
      if (!x)
        return this.reporter.error("string objid given, but no values map found");
      if (!x.hasOwnProperty(M))
        return this.reporter.error("objid not found in values map");
      M = x[M].split(/[\s\.]+/g);
      for (var I = 0; I < M.length; I++)
        M[I] |= 0;
    } else if (Array.isArray(M)) {
      M = M.slice();
      for (var I = 0; I < M.length; I++)
        M[I] |= 0;
    }
    if (!Array.isArray(M))
      return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(M));
    if (!k) {
      if (M[1] >= 40)
        return this.reporter.error("Second objid identifier OOB");
      M.splice(0, 2, M[0] * 40 + M[1]);
    }
    for (var D = 0, I = 0; I < M.length; I++) {
      var L = M[I];
      for (D++; L >= 128; L >>= 7)
        D++;
    }
    for (var W = new n(D), z = W.length - 1, I = M.length - 1; I >= 0; I--) {
      var L = M[I];
      for (W[z--] = L & 127; (L >>= 7) > 0; )
        W[z--] = 128 | L & 127;
    }
    return this._createEncoderBuffer(W);
  };
  function y(B) {
    return B < 10 ? "0" + B : B;
  }
  g.prototype._encodeTime = function(M, x) {
    var k, I = new Date(M);
    return x === "gentime" ? k = [
      y(I.getFullYear()),
      y(I.getUTCMonth() + 1),
      y(I.getUTCDate()),
      y(I.getUTCHours()),
      y(I.getUTCMinutes()),
      y(I.getUTCSeconds()),
      "Z"
    ].join("") : x === "utctime" ? k = [
      y(I.getFullYear() % 100),
      y(I.getUTCMonth() + 1),
      y(I.getUTCDate()),
      y(I.getUTCHours()),
      y(I.getUTCMinutes()),
      y(I.getUTCSeconds()),
      "Z"
    ].join("") : this.reporter.error("Encoding " + x + " time is not supported yet"), this._encodeStr(k, "octstr");
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
      var k = M.toArray();
      !M.sign && k[0] & 128 && k.unshift(0), M = new n(k);
    }
    if (n.isBuffer(M)) {
      var I = M.length;
      M.length === 0 && I++;
      var L = new n(I);
      return M.copy(L), M.length === 0 && (L[0] = 0), this._createEncoderBuffer(L);
    }
    if (M < 128)
      return this._createEncoderBuffer(M);
    if (M < 256)
      return this._createEncoderBuffer([0, M]);
    for (var I = 1, D = M; D >= 256; D >>= 8)
      I++;
    for (var L = new Array(I), D = L.length - 1; D >= 0; D--)
      L[D] = M & 255, M >>= 8;
    return L[0] & 128 && L.unshift(0), this._createEncoderBuffer(new n(L));
  }, g.prototype._encodeBool = function(M) {
    return this._createEncoderBuffer(M ? 255 : 0);
  }, g.prototype._use = function(M, x) {
    return typeof M == "function" && (M = M(x)), M._getEncoder("der").tree;
  }, g.prototype._skipDefault = function(M, x, k) {
    var I = this._baseState, D;
    if (I.default === null)
      return !1;
    var L = M.join();
    if (I.defaultBuffer === void 0 && (I.defaultBuffer = this._encodeValue(I.default, x, k).join()), L.length !== I.defaultBuffer.length)
      return !1;
    for (D = 0; D < L.length; D++)
      if (L[D] !== I.defaultBuffer[D])
        return !1;
    return !0;
  };
  function S(B, M, x, k) {
    var I;
    if (B === "seqof" ? B = "seq" : B === "setof" && (B = "set"), m.tagByName.hasOwnProperty(B))
      I = m.tagByName[B];
    else if (typeof B == "number" && (B | 0) === B)
      I = B;
    else
      return k.error("Unknown tag: " + B);
    return I >= 31 ? k.error("Multi-octet tag encoding unsupported") : (M || (I |= 32), I |= m.tagClassByName[x || "universal"] << 6, I);
  }
  return Wf;
}
var Vf, rh;
function J2() {
  if (rh)
    return Vf;
  rh = 1;
  var h = Jt, n = qo();
  function o(s) {
    n.call(this, s), this.enc = "pem";
  }
  return h(o, n), Vf = o, o.prototype.encode = function(m, f) {
    for (var g = n.prototype.encode.call(this, m), y = g.toString("base64"), S = ["-----BEGIN " + f.label + "-----"], B = 0; B < y.length; B += 64)
      S.push(y.slice(B, B + 64));
    return S.push("-----END " + f.label + "-----"), S.join(`
`);
  }, Vf;
}
var ih;
function G2() {
  return ih || (ih = 1, function(h) {
    var n = h;
    n.der = qo(), n.pem = J2();
  }(Zf)), Zf;
}
var nh;
function fn() {
  return nh || (nh = 1, function(h) {
    var n = h;
    n.bignum = z2, n.define = K2().define, n.base = Ui(), n.constants = To(), n.decoders = Y2(), n.encoders = G2();
  }(Df)), Df;
}
var ir = fn(), fh = ir.define("Time", function() {
  this.choice({
    utcTime: this.utctime(),
    generalTime: this.gentime()
  });
}), X2 = ir.define("AttributeTypeValue", function() {
  this.seq().obj(
    this.key("type").objid(),
    this.key("value").any()
  );
}), V0 = ir.define("AlgorithmIdentifier", function() {
  this.seq().obj(
    this.key("algorithm").objid(),
    this.key("parameters").optional(),
    this.key("curve").objid().optional()
  );
}), j2 = ir.define("SubjectPublicKeyInfo", function() {
  this.seq().obj(
    this.key("algorithm").use(V0),
    this.key("subjectPublicKey").bitstr()
  );
}), Q2 = ir.define("RelativeDistinguishedName", function() {
  this.setof(X2);
}), tm = ir.define("RDNSequence", function() {
  this.seqof(Q2);
}), ah = ir.define("Name", function() {
  this.choice({
    rdnSequence: this.use(tm)
  });
}), em = ir.define("Validity", function() {
  this.seq().obj(
    this.key("notBefore").use(fh),
    this.key("notAfter").use(fh)
  );
}), rm = ir.define("Extension", function() {
  this.seq().obj(
    this.key("extnID").objid(),
    this.key("critical").bool().def(!1),
    this.key("extnValue").octstr()
  );
}), im = ir.define("TBSCertificate", function() {
  this.seq().obj(
    this.key("version").explicit(0).int().optional(),
    this.key("serialNumber").int(),
    this.key("signature").use(V0),
    this.key("issuer").use(ah),
    this.key("validity").use(em),
    this.key("subject").use(ah),
    this.key("subjectPublicKeyInfo").use(j2),
    this.key("issuerUniqueID").implicit(1).bitstr().optional(),
    this.key("subjectUniqueID").implicit(2).bitstr().optional(),
    this.key("extensions").explicit(3).seqof(rm).optional()
  );
}), nm = ir.define("X509Certificate", function() {
  this.seq().obj(
    this.key("tbsCertificate").use(im),
    this.key("signatureAlgorithm").use(V0),
    this.key("signatureValue").bitstr()
  );
}), fm = nm, nr = fn();
rr.certificate = fm;
var am = nr.define("RSAPrivateKey", function() {
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
rr.RSAPrivateKey = am;
var hm = nr.define("RSAPublicKey", function() {
  this.seq().obj(
    this.key("modulus").int(),
    this.key("publicExponent").int()
  );
});
rr.RSAPublicKey = hm;
var Fo = nr.define("AlgorithmIdentifier", function() {
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
}), sm = nr.define("SubjectPublicKeyInfo", function() {
  this.seq().obj(
    this.key("algorithm").use(Fo),
    this.key("subjectPublicKey").bitstr()
  );
});
rr.PublicKey = sm;
var om = nr.define("PrivateKeyInfo", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("algorithm").use(Fo),
    this.key("subjectPrivateKey").octstr()
  );
});
rr.PrivateKey = om;
var um = nr.define("EncryptedPrivateKeyInfo", function() {
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
rr.EncryptedPrivateKey = um;
var lm = nr.define("DSAPrivateKey", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("p").int(),
    this.key("q").int(),
    this.key("g").int(),
    this.key("pub_key").int(),
    this.key("priv_key").int()
  );
});
rr.DSAPrivateKey = lm;
rr.DSAparam = nr.define("DSAparam", function() {
  this.int();
});
var dm = nr.define("ECParameters", function() {
  this.choice({
    namedCurve: this.objid()
  });
}), cm = nr.define("ECPrivateKey", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("privateKey").octstr(),
    this.key("parameters").optional().explicit(0).use(dm),
    this.key("publicKey").optional().explicit(1).bitstr()
  );
});
rr.ECPrivateKey = cm;
rr.signature = nr.define("signature", function() {
  this.seq().obj(
    this.key("r").int(),
    this.key("s").int()
  );
});
const vm = {
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
var pm = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m, mm = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m, gm = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m, bm = Zn, ym = Le, vn = Ot.Buffer, wm = function(h, n) {
  var o = h.toString(), s = o.match(pm), m;
  if (s) {
    var g = "aes" + s[1], y = vn.from(s[2], "hex"), S = vn.from(s[3].replace(/[\r\n]/g, ""), "base64"), B = bm(n, y.slice(0, 8), parseInt(s[1], 10)).key, M = [], x = ym.createDecipheriv(g, B, y);
    M.push(x.update(S)), M.push(x.final()), m = vn.concat(M);
  } else {
    var f = o.match(gm);
    m = vn.from(f[2].replace(/[\r\n]/g, ""), "base64");
  }
  var k = o.match(mm)[1];
  return {
    tag: k,
    data: m
  };
}, qe = rr, Mm = vm, xm = wm, _m = Le, Sm = Nn, c0 = Ot.Buffer;
function Am(h, n) {
  var o = h.algorithm.decrypt.kde.kdeparams.salt, s = parseInt(h.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), m = Mm[h.algorithm.decrypt.cipher.algo.join(".")], f = h.algorithm.decrypt.cipher.iv, g = h.subjectPrivateKey, y = parseInt(m.split("-")[1], 10) / 8, S = Sm.pbkdf2Sync(n, o, s, y, "sha1"), B = _m.createDecipheriv(m, S, f), M = [];
  return M.push(B.update(g)), M.push(B.final()), c0.concat(M);
}
function Po(h) {
  var n;
  typeof h == "object" && !c0.isBuffer(h) && (n = h.passphrase, h = h.key), typeof h == "string" && (h = c0.from(h));
  var o = xm(h, n), s = o.tag, m = o.data, f, g;
  switch (s) {
    case "CERTIFICATE":
      g = qe.certificate.decode(m, "der").tbsCertificate.subjectPublicKeyInfo;
    case "PUBLIC KEY":
      switch (g || (g = qe.PublicKey.decode(m, "der")), f = g.algorithm.algorithm.join("."), f) {
        case "1.2.840.113549.1.1.1":
          return qe.RSAPublicKey.decode(g.subjectPublicKey.data, "der");
        case "1.2.840.10045.2.1":
          return g.subjectPrivateKey = g.subjectPublicKey, {
            type: "ec",
            data: g
          };
        case "1.2.840.10040.4.1":
          return g.algorithm.params.pub_key = qe.DSAparam.decode(g.subjectPublicKey.data, "der"), {
            type: "dsa",
            data: g.algorithm.params
          };
        default:
          throw new Error("unknown key id " + f);
      }
    case "ENCRYPTED PRIVATE KEY":
      m = qe.EncryptedPrivateKey.decode(m, "der"), m = Am(m, n);
    case "PRIVATE KEY":
      switch (g = qe.PrivateKey.decode(m, "der"), f = g.algorithm.algorithm.join("."), f) {
        case "1.2.840.113549.1.1.1":
          return qe.RSAPrivateKey.decode(g.subjectPrivateKey, "der");
        case "1.2.840.10045.2.1":
          return {
            curve: g.algorithm.curve,
            privateKey: qe.ECPrivateKey.decode(g.subjectPrivateKey, "der").privateKey
          };
        case "1.2.840.10040.4.1":
          return g.algorithm.params.priv_key = qe.DSAparam.decode(g.subjectPrivateKey, "der"), {
            type: "dsa",
            params: g.algorithm.params
          };
        default:
          throw new Error("unknown key id " + f);
      }
    case "RSA PUBLIC KEY":
      return qe.RSAPublicKey.decode(m, "der");
    case "RSA PRIVATE KEY":
      return qe.RSAPrivateKey.decode(m, "der");
    case "DSA PRIVATE KEY":
      return {
        type: "dsa",
        params: qe.DSAPrivateKey.decode(m, "der")
      };
    case "EC PRIVATE KEY":
      return m = qe.ECPrivateKey.decode(m, "der"), {
        curve: m.parameters.value,
        privateKey: m.privateKey
      };
    default:
      throw new Error("unknown key type " + s);
  }
}
Po.signature = qe.signature;
var hf = Po;
const Do = {
  "1.3.132.0.10": "secp256k1",
  "1.3.132.0.33": "p224",
  "1.2.840.10045.3.1.1": "p192",
  "1.2.840.10045.3.1.7": "p256",
  "1.3.132.0.34": "p384",
  "1.3.132.0.35": "p521"
};
var hh;
function Bm() {
  if (hh)
    return Ci.exports;
  hh = 1;
  var h = Ot.Buffer, n = Hh, o = U0, s = Z0().ec, m = N0, f = hf, g = Do, y = 1;
  function S(z, N, lt, H, At) {
    var Bt = f(N);
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
    if (N.padding !== void 0 && N.padding !== y)
      throw new Error("illegal or unsupported padding mode");
    z = h.concat([At, z]);
    for (var Ct = Bt.modulus.byteLength(), Et = [0, 1]; z.length + Et.length + 1 < Ct; )
      Et.push(255);
    Et.push(0);
    for (var Y = -1; ++Y < z.length; )
      Et.push(z[Y]);
    var kt = o(Et, Bt);
    return kt;
  }
  function B(z, N) {
    var lt = g[N.curve.join(".")];
    if (!lt)
      throw new Error("unknown curve " + N.curve.join("."));
    var H = new s(lt), At = H.keyFromPrivate(N.privateKey), Bt = At.sign(z);
    return h.from(Bt.toDER());
  }
  function M(z, N, lt) {
    for (var H = N.params.priv_key, At = N.params.p, Bt = N.params.q, Ct = N.params.g, Et = new m(0), Y, kt = I(z, Bt).mod(Bt), p = !1, t = k(H, Bt, z, lt); p === !1; )
      Y = L(Bt, t, lt), Et = W(Ct, Y, At, Bt), p = Y.invm(Bt).imul(kt.add(H.mul(Et))).mod(Bt), p.cmpn(0) === 0 && (p = !1, Et = new m(0));
    return x(Et, p);
  }
  function x(z, N) {
    z = z.toArray(), N = N.toArray(), z[0] & 128 && (z = [0].concat(z)), N[0] & 128 && (N = [0].concat(N));
    var lt = z.length + N.length + 4, H = [
      48,
      lt,
      2,
      z.length
    ];
    return H = H.concat(z, [2, N.length], N), h.from(H);
  }
  function k(z, N, lt, H) {
    if (z = h.from(z.toArray()), z.length < N.byteLength()) {
      var At = h.alloc(N.byteLength() - z.length);
      z = h.concat([At, z]);
    }
    var Bt = lt.length, Ct = D(lt, N), Et = h.alloc(Bt);
    Et.fill(1);
    var Y = h.alloc(Bt);
    return Y = n(H, Y).update(Et).update(h.from([0])).update(z).update(Ct).digest(), Et = n(H, Y).update(Et).digest(), Y = n(H, Y).update(Et).update(h.from([1])).update(z).update(Ct).digest(), Et = n(H, Y).update(Et).digest(), { k: Y, v: Et };
  }
  function I(z, N) {
    var lt = new m(z), H = (z.length << 3) - N.bitLength();
    return H > 0 && lt.ishrn(H), lt;
  }
  function D(z, N) {
    z = I(z, N), z = z.mod(N);
    var lt = h.from(z.toArray());
    if (lt.length < N.byteLength()) {
      var H = h.alloc(N.byteLength() - lt.length);
      lt = h.concat([H, lt]);
    }
    return lt;
  }
  function L(z, N, lt) {
    var H, At;
    do {
      for (H = h.alloc(0); H.length * 8 < z.bitLength(); )
        N.v = n(lt, N.k).update(N.v).digest(), H = h.concat([H, N.v]);
      At = I(H, z), N.k = n(lt, N.k).update(N.v).update(h.from([0])).digest(), N.v = n(lt, N.k).update(N.v).digest();
    } while (At.cmp(z) !== -1);
    return At;
  }
  function W(z, N, lt, H) {
    return z.toRed(m.mont(lt)).redPow(N).fromRed().mod(H);
  }
  return Ci.exports = S, Ci.exports.getKey = k, Ci.exports.makeKey = L, Ci.exports;
}
var Yf, sh;
function Em() {
  if (sh)
    return Yf;
  sh = 1;
  var h = Ot.Buffer, n = N0, o = Z0().ec, s = hf, m = Do;
  function f(B, M, x, k, I) {
    var D = s(x);
    if (D.type === "ec") {
      if (k !== "ecdsa" && k !== "ecdsa/rsa")
        throw new Error("wrong public key type");
      return g(B, M, D);
    } else if (D.type === "dsa") {
      if (k !== "dsa")
        throw new Error("wrong public key type");
      return y(B, M, D);
    }
    if (k !== "rsa" && k !== "ecdsa/rsa")
      throw new Error("wrong public key type");
    M = h.concat([I, M]);
    for (var L = D.modulus.byteLength(), W = [1], z = 0; M.length + W.length + 2 < L; )
      W.push(255), z += 1;
    W.push(0);
    for (var N = -1; ++N < M.length; )
      W.push(M[N]);
    W = h.from(W);
    var lt = n.mont(D.modulus);
    B = new n(B).toRed(lt), B = B.redPow(new n(D.publicExponent)), B = h.from(B.fromRed().toArray());
    var H = z < 8 ? 1 : 0;
    for (L = Math.min(B.length, W.length), B.length !== W.length && (H = 1), N = -1; ++N < L; )
      H |= B[N] ^ W[N];
    return H === 0;
  }
  function g(B, M, x) {
    var k = m[x.data.algorithm.curve.join(".")];
    if (!k)
      throw new Error("unknown curve " + x.data.algorithm.curve.join("."));
    var I = new o(k), D = x.data.subjectPrivateKey.data;
    return I.verify(M, B, D);
  }
  function y(B, M, x) {
    var k = x.data.p, I = x.data.q, D = x.data.g, L = x.data.pub_key, W = s.signature.decode(B, "der"), z = W.s, N = W.r;
    S(z, I), S(N, I);
    var lt = n.mont(k), H = z.invm(I), At = D.toRed(lt).redPow(new n(M).mul(H).mod(I)).fromRed().mul(L.toRed(lt).redPow(N.mul(H).mod(I)).fromRed()).mod(k).mod(I);
    return At.cmp(N) === 0;
  }
  function S(B, M) {
    if (B.cmpn(0) <= 0)
      throw new Error("invalid sig");
    if (B.cmp(M) >= 0)
      throw new Error("invalid sig");
  }
  return Yf = f, Yf;
}
var Jf, oh;
function Im() {
  if (oh)
    return Jf;
  oh = 1;
  var h = Ot.Buffer, n = Gi, o = Sv, s = Jt, m = Bm(), f = Em(), g = Zh;
  Object.keys(g).forEach(function(x) {
    g[x].id = h.from(g[x].id, "hex"), g[x.toLowerCase()] = g[x];
  });
  function y(x) {
    o.Writable.call(this);
    var k = g[x];
    if (!k)
      throw new Error("Unknown message digest");
    this._hashType = k.hash, this._hash = n(k.hash), this._tag = k.id, this._signType = k.sign;
  }
  s(y, o.Writable), y.prototype._write = function(k, I, D) {
    this._hash.update(k), D();
  }, y.prototype.update = function(k, I) {
    return this._hash.update(typeof k == "string" ? h.from(k, I) : k), this;
  }, y.prototype.sign = function(k, I) {
    this.end();
    var D = this._hash.digest(), L = m(D, k, this._hashType, this._signType, this._tag);
    return I ? L.toString(I) : L;
  };
  function S(x) {
    o.Writable.call(this);
    var k = g[x];
    if (!k)
      throw new Error("Unknown message digest");
    this._hash = n(k.hash), this._tag = k.id, this._signType = k.sign;
  }
  s(S, o.Writable), S.prototype._write = function(k, I, D) {
    this._hash.update(k), D();
  }, S.prototype.update = function(k, I) {
    return this._hash.update(typeof k == "string" ? h.from(k, I) : k), this;
  }, S.prototype.verify = function(k, I, D) {
    var L = typeof I == "string" ? h.from(I, D) : I;
    this.end();
    var W = this._hash.digest();
    return f(L, W, k, this._signType, this._tag);
  };
  function B(x) {
    return new y(x);
  }
  function M(x) {
    return new S(x);
  }
  return Jf = {
    Sign: B,
    Verify: M,
    createSign: B,
    createVerify: M
  }, Jf;
}
var Y0 = { exports: {} };
Y0.exports;
(function(h) {
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
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Pe.Buffer;
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
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (a = t.length - 1, d = 0; a >= 0; a -= 3)
          c = t[a] | t[a - 1] << 8 | t[a - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (a = 0, d = 0; a < t.length; a += 3)
          c = t[a] | t[a + 1] << 8 | t[a + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (a = u % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var a = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        a *= i, v >= 49 ? a += v - 49 + 10 : v >= 17 ? a += v - 17 + 10 : a += v;
      }
      return a;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var a = 0, d = 1; d <= 67108863; d *= r)
        a++;
      a--, d = d / r | 0;
      for (var c = t.length - i, v = c % a, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += a)
        e = B(t, l, l + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    ], k = [
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
        for (var a = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = k[t];
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
      var a = this.byteLength(), d = i || Math.max(1, a);
      s(a <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
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
    function I(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, a = r % 26;
        t[r] = (p.words[i] & 1 << a) >>> a;
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
      for (var a = 0; a < i.length; a++)
        this.words[a] = r.words[a] ^ i.words[a];
      if (this !== r)
        for (; a < r.length; a++)
          this.words[a] = r.words[a];
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
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, a = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << a : this.words[i] = this.words[i] & ~(1 << a), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, a;
      this.length > t.length ? (i = this, a = t) : (i = t, a = this);
      for (var d = 0, c = 0; c < a.length; c++)
        r = (i.words[c] | 0) + (a.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
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
      var a, d;
      i > 0 ? (a = this, d = t) : (a = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (a.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < a.length; v++)
        r = (a.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < a.length && a !== this)
        for (; v < a.length; v++)
          this.words[v] = a.words[v];
      return this.length = Math.max(this.length, v), a !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var F = e - C | 0;
          a = p.words[F] | 0, d = t.words[C] | 0, c = a * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var L = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = a[0] | 0, _ = b & 8191, C = b >>> 13, F = a[1] | 0, O = F & 8191, R = F >>> 13, P = a[2] | 0, $ = P & 8191, K = P >>> 13, It = a[3] | 0, Z = It & 8191, J = It >>> 13, qt = a[4] | 0, tt = qt & 8191, vt = qt >>> 13, Dt = a[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = a[6] | 0, j = Pt & 8191, dt = Pt >>> 13, Ft = a[7] | 0, Q = Ft & 8191, ct = Ft >>> 13, Lt = a[8] | 0, E = Lt & 8191, w = Lt >>> 13, A = a[9] | 0, T = A & 8191, q = A >>> 13, V = d[0] | 0, U = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, zt = d[3] | 0, nt = zt & 8191, bt = zt >>> 13, Kt = d[4] | 0, ft = Kt & 8191, yt = Kt >>> 13, Ht = d[5] | 0, at = Ht & 8191, wt = Ht >>> 13, Zt = d[6] | 0, ht = Zt & 8191, Mt = Zt >>> 13, Wt = d[7] | 0, st = Wt & 8191, xt = Wt >>> 13, Vt = d[8] | 0, ot = Vt & 8191, _t = Vt >>> 13, Yt = d[9] | 0, ut = Yt & 8191, St = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, U), e = Math.imul(_, X), e = e + Math.imul(C, U) | 0, l = Math.imul(C, X);
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(O, U), e = Math.imul(O, X), e = e + Math.imul(R, U) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul($, U), e = Math.imul($, X), e = e + Math.imul(K, U) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var jt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, u = Math.imul(Z, U), e = Math.imul(Z, X), e = e + Math.imul(J, U) | 0, l = Math.imul(J, X), u = u + Math.imul($, G) | 0, e = e + Math.imul($, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(tt, U), e = Math.imul(tt, X), e = e + Math.imul(vt, U) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul($, it) | 0, e = e + Math.imul($, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(et, U), e = Math.imul(et, X), e = e + Math.imul(pt, U) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul($, nt) | 0, e = e + Math.imul($, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(j, U), e = Math.imul(j, X), e = e + Math.imul(dt, U) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul($, ft) | 0, e = e + Math.imul($, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(Q, U), e = Math.imul(Q, X), e = e + Math.imul(ct, U) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul($, at) | 0, e = e + Math.imul($, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(E, U), e = Math.imul(E, X), e = e + Math.imul(w, U) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul($, ht) | 0, e = e + Math.imul($, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(T, U), e = Math.imul(T, X), e = e + Math.imul(q, U) | 0, l = Math.imul(q, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul($, st) | 0, e = e + Math.imul($, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(q, G) | 0, l = Math.imul(q, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul($, ot) | 0, e = e + Math.imul($, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(q, it) | 0, l = Math.imul(q, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul($, ut) | 0, e = e + Math.imul($, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(q, nt) | 0, l = Math.imul(q, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(q, ft) | 0, l = Math.imul(q, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(q, at) | 0, l = Math.imul(q, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(q, ht) | 0, l = Math.imul(q, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(q, st) | 0, l = Math.imul(q, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(q, ot) | 0, l = Math.imul(q, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(q, ut) | 0, l = Math.imul(q, St);
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = $t, c[1] = Nt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (L = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, F = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, F = F + v | 0, v = F & 67108863, c = c + (F >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new N();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = L(this, t, r) : a < 63 ? i = D(this, t, r) : a < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function N(p, t) {
      this.x = p, this.y = t;
    }
    N.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, N.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, N.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, N.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, F = 0; F < v; F++) {
            var O = i[b + F], R = a[b + F], P = i[b + F + v], $ = a[b + F + v], K = _ * P - C * $;
            $ = _ * $ + C * P, P = K, i[b + F] = O + P, a[b + F] = R + $, i[b + F + v] = O - P, a[b + F + v] = R - $, F !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, N.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, N.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, N.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, N.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, N.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, N.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), u = new Array(a), e = new Array(a), l = new Array(a), b = new Array(a), _ = new Array(a), C = i.words;
      C.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, l, a), this.transform(v, c, u, e, a, d), this.transform(l, c, b, _, a, d);
      for (var F = 0; F < a; F++) {
        var O = u[F] * b[F] - e[F] * _[F];
        e[F] = u[F] * _[F] + e[F] * b[F], u[F] = O;
      }
      return this.conjugate(u, e, a), this.transform(u, e, C, c, a, d), this.conjugate(C, c, a), this.normalize13b(C, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
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
        var a = (this.words[i] | 0) * t, d = (a & 67108863) + (r & 67108863);
        r >>= 26, r += a / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = I(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, u = (this.words[d] | 0) - v << r;
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
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (a -= c, a = Math.max(0, a), u) {
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
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= a); e--) {
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
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
      var a = t.length + i, d;
      this._expand(a);
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
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var u = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = a.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (a = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (a.words[d.length + _] | 0) * 67108864 + (a.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), a._ishlnsubmul(d, C, _); a.negative !== 0; )
          C--, a.negative = 0, a._ishlnsubmul(d, 1, _), a.isZero() || (a.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var a, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (a = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: a,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (a = c.div.neg()), {
        div: a,
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
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, a = t.ushrn(1), d = t.andln(1), c = i.cmp(a);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(l)), a.iushrn(1), d.iushrn(1);
        for (var C = 0, F = 1; !(i.words[0] & F) && C < 26; ++C, F <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
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
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var b;
      return r.cmpn(1) === 0 ? b = a : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var a = 0; r.isEven() && i.isEven(); a++)
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
      return i.iushln(a);
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= a, this;
      for (var d = a, c = i; d !== 0 && c < this.length; c++) {
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
        var a = this.words[0] | 0;
        i = a === t ? 0 : a < t ? -1 : 1;
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
        var a = this.words[i] | 0, d = t.words[i] | 0;
        if (a !== d) {
          a < d ? r = -1 : a > d && (r = 1);
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
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
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
      for (var i = 4194303, a = Math.min(t.length, 9), d = 0; d < a; d++)
        r.words[d] = t.words[d];
      if (r.length = a, t.length <= 9) {
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
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
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
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
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
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      s(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, a), b = this.pow(t, a.addn(1).iushrn(1)), _ = this.pow(t, a), C = d; _.cmp(c) !== 0; ) {
        for (var F = _, O = 0; F.cmp(c) !== 0; O++)
          F = F.redSqr();
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
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== a[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, a[v]), u = 0, v = 0);
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
      return new kt(t);
    };
    function kt(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(kt, Y), kt.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, kt.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, kt.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(Y0);
var km = Y0.exports, Gf, uh;
function Rm() {
  if (uh)
    return Gf;
  uh = 1;
  var h = Z0(), n = km;
  Gf = function(g) {
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
    }), this.curve = new h.ec(this.curveType.name), this.keys = void 0;
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
  return Gf;
}
var $o = {}, Tm = Gi, v0 = Ot.Buffer, No = function(h, n) {
  for (var o = v0.alloc(0), s = 0, m; o.length < n; )
    m = Cm(s++), o = v0.concat([o, Tm("sha1").update(h).update(m).digest()]);
  return o.slice(0, n);
};
function Cm(h) {
  var n = v0.allocUnsafe(4);
  return n.writeUInt32BE(h, 0), n;
}
var Uo = function(n, o) {
  for (var s = n.length, m = -1; ++m < s; )
    n[m] ^= o[m];
  return n;
}, J0 = { exports: {} };
J0.exports;
(function(h) {
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
      typeof window != "undefined" && typeof window.Buffer != "undefined" ? g = window.Buffer : g = Pe.Buffer;
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
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d, c, v = 0;
      if (i === "be")
        for (a = t.length - 1, d = 0; a >= 0; a -= 3)
          c = t[a] | t[a - 1] << 8 | t[a - 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
      else if (i === "le")
        for (a = 0, d = 0; a < t.length; a += 3)
          c = t[a] | t[a + 1] << 8 | t[a + 2] << 16, this.words[d] |= c << v & 67108863, this.words[d + 1] = c >>> 26 - v & 67108863, v += 24, v >= 26 && (v -= 26, d++);
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
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var u = t.length - r;
        for (a = u % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = S(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function B(p, t, r, i) {
      for (var a = 0, d = Math.min(p.length, r), c = t; c < d; c++) {
        var v = p.charCodeAt(c) - 48;
        a *= i, v >= 49 ? a += v - 49 + 10 : v >= 17 ? a += v - 17 + 10 : a += v;
      }
      return a;
    }
    f.prototype._parseBase = function(t, r, i) {
      this.words = [0], this.length = 1;
      for (var a = 0, d = 1; d <= 67108863; d *= r)
        a++;
      a--, d = d / r | 0;
      for (var c = t.length - i, v = c % a, u = Math.min(c, c - v) + i, e = 0, l = i; l < u; l += a)
        e = B(t, l, l + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    ], k = [
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
        for (var a = 0, d = 0, c = 0; c < this.length; c++) {
          var v = this.words[c], u = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = M[6 - u.length] + u + i : i = u + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], l = k[t];
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
      var a = this.byteLength(), d = i || Math.max(1, a);
      s(a <= d, "byte array longer than desired length"), s(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), u, e, l = this.clone();
      if (c) {
        for (e = 0; !l.isZero(); e++)
          u = l.andln(255), l.iushrn(8), v[e] = u;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
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
    function I(p) {
      for (var t = new Array(p.bitLength()), r = 0; r < t.length; r++) {
        var i = r / 26 | 0, a = r % 26;
        t[r] = (p.words[i] & 1 << a) >>> a;
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
      for (var a = 0; a < i.length; a++)
        this.words[a] = r.words[a] ^ i.words[a];
      if (this !== r)
        for (; a < r.length; a++)
          this.words[a] = r.words[a];
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
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      s(typeof t == "number" && t >= 0);
      var i = t / 26 | 0, a = t % 26;
      return this._expand(i + 1), r ? this.words[i] = this.words[i] | 1 << a : this.words[i] = this.words[i] & ~(1 << a), this.strip();
    }, f.prototype.iadd = function(t) {
      var r;
      if (this.negative !== 0 && t.negative === 0)
        return this.negative = 0, r = this.isub(t), this.negative ^= 1, this._normSign();
      if (this.negative === 0 && t.negative !== 0)
        return t.negative = 0, r = this.isub(t), t.negative = 1, r._normSign();
      var i, a;
      this.length > t.length ? (i = this, a = t) : (i = t, a = this);
      for (var d = 0, c = 0; c < a.length; c++)
        r = (i.words[c] | 0) + (a.words[c] | 0) + d, this.words[c] = r & 67108863, d = r >>> 26;
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
      var a, d;
      i > 0 ? (a = this, d = t) : (a = t, d = this);
      for (var c = 0, v = 0; v < d.length; v++)
        r = (a.words[v] | 0) - (d.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      for (; c !== 0 && v < a.length; v++)
        r = (a.words[v] | 0) + c, c = r >> 26, this.words[v] = r & 67108863;
      if (c === 0 && v < a.length && a !== this)
        for (; v < a.length; v++)
          this.words[v] = a.words[v];
      return this.length = Math.max(this.length, v), a !== this && (this.negative = 1), this.strip();
    }, f.prototype.sub = function(t) {
      return this.clone().isub(t);
    };
    function D(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, u = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var l = u >>> 26, b = u & 67108863, _ = Math.min(e, t.length - 1), C = Math.max(0, e - p.length + 1); C <= _; C++) {
          var F = e - C | 0;
          a = p.words[F] | 0, d = t.words[C] | 0, c = a * d + b, l += c / 67108864 | 0, b = c & 67108863;
        }
        r.words[e] = b | 0, u = l | 0;
      }
      return u !== 0 ? r.words[e] = u | 0 : r.length--, r.strip();
    }
    var L = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, u, e, l, b = a[0] | 0, _ = b & 8191, C = b >>> 13, F = a[1] | 0, O = F & 8191, R = F >>> 13, P = a[2] | 0, $ = P & 8191, K = P >>> 13, It = a[3] | 0, Z = It & 8191, J = It >>> 13, qt = a[4] | 0, tt = qt & 8191, vt = qt >>> 13, Dt = a[5] | 0, et = Dt & 8191, pt = Dt >>> 13, Pt = a[6] | 0, j = Pt & 8191, dt = Pt >>> 13, Ft = a[7] | 0, Q = Ft & 8191, ct = Ft >>> 13, Lt = a[8] | 0, E = Lt & 8191, w = Lt >>> 13, A = a[9] | 0, T = A & 8191, q = A >>> 13, V = d[0] | 0, U = V & 8191, X = V >>> 13, Tt = d[1] | 0, G = Tt & 8191, rt = Tt >>> 13, Rt = d[2] | 0, it = Rt & 8191, gt = Rt >>> 13, zt = d[3] | 0, nt = zt & 8191, bt = zt >>> 13, Kt = d[4] | 0, ft = Kt & 8191, yt = Kt >>> 13, Ht = d[5] | 0, at = Ht & 8191, wt = Ht >>> 13, Zt = d[6] | 0, ht = Zt & 8191, Mt = Zt >>> 13, Wt = d[7] | 0, st = Wt & 8191, xt = Wt >>> 13, Vt = d[8] | 0, ot = Vt & 8191, _t = Vt >>> 13, Yt = d[9] | 0, ut = Yt & 8191, St = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, u = Math.imul(_, U), e = Math.imul(_, X), e = e + Math.imul(C, U) | 0, l = Math.imul(C, X);
      var $t = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + ($t >>> 26) | 0, $t &= 67108863, u = Math.imul(O, U), e = Math.imul(O, X), e = e + Math.imul(R, U) | 0, l = Math.imul(R, X), u = u + Math.imul(_, G) | 0, e = e + Math.imul(_, rt) | 0, e = e + Math.imul(C, G) | 0, l = l + Math.imul(C, rt) | 0;
      var Nt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Nt >>> 26) | 0, Nt &= 67108863, u = Math.imul($, U), e = Math.imul($, X), e = e + Math.imul(K, U) | 0, l = Math.imul(K, X), u = u + Math.imul(O, G) | 0, e = e + Math.imul(O, rt) | 0, e = e + Math.imul(R, G) | 0, l = l + Math.imul(R, rt) | 0, u = u + Math.imul(_, it) | 0, e = e + Math.imul(_, gt) | 0, e = e + Math.imul(C, it) | 0, l = l + Math.imul(C, gt) | 0;
      var jt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, u = Math.imul(Z, U), e = Math.imul(Z, X), e = e + Math.imul(J, U) | 0, l = Math.imul(J, X), u = u + Math.imul($, G) | 0, e = e + Math.imul($, rt) | 0, e = e + Math.imul(K, G) | 0, l = l + Math.imul(K, rt) | 0, u = u + Math.imul(O, it) | 0, e = e + Math.imul(O, gt) | 0, e = e + Math.imul(R, it) | 0, l = l + Math.imul(R, gt) | 0, u = u + Math.imul(_, nt) | 0, e = e + Math.imul(_, bt) | 0, e = e + Math.imul(C, nt) | 0, l = l + Math.imul(C, bt) | 0;
      var Qt = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(tt, U), e = Math.imul(tt, X), e = e + Math.imul(vt, U) | 0, l = Math.imul(vt, X), u = u + Math.imul(Z, G) | 0, e = e + Math.imul(Z, rt) | 0, e = e + Math.imul(J, G) | 0, l = l + Math.imul(J, rt) | 0, u = u + Math.imul($, it) | 0, e = e + Math.imul($, gt) | 0, e = e + Math.imul(K, it) | 0, l = l + Math.imul(K, gt) | 0, u = u + Math.imul(O, nt) | 0, e = e + Math.imul(O, bt) | 0, e = e + Math.imul(R, nt) | 0, l = l + Math.imul(R, bt) | 0, u = u + Math.imul(_, ft) | 0, e = e + Math.imul(_, yt) | 0, e = e + Math.imul(C, ft) | 0, l = l + Math.imul(C, yt) | 0;
      var te = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(et, U), e = Math.imul(et, X), e = e + Math.imul(pt, U) | 0, l = Math.imul(pt, X), u = u + Math.imul(tt, G) | 0, e = e + Math.imul(tt, rt) | 0, e = e + Math.imul(vt, G) | 0, l = l + Math.imul(vt, rt) | 0, u = u + Math.imul(Z, it) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(J, it) | 0, l = l + Math.imul(J, gt) | 0, u = u + Math.imul($, nt) | 0, e = e + Math.imul($, bt) | 0, e = e + Math.imul(K, nt) | 0, l = l + Math.imul(K, bt) | 0, u = u + Math.imul(O, ft) | 0, e = e + Math.imul(O, yt) | 0, e = e + Math.imul(R, ft) | 0, l = l + Math.imul(R, yt) | 0, u = u + Math.imul(_, at) | 0, e = e + Math.imul(_, wt) | 0, e = e + Math.imul(C, at) | 0, l = l + Math.imul(C, wt) | 0;
      var ee = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(j, U), e = Math.imul(j, X), e = e + Math.imul(dt, U) | 0, l = Math.imul(dt, X), u = u + Math.imul(et, G) | 0, e = e + Math.imul(et, rt) | 0, e = e + Math.imul(pt, G) | 0, l = l + Math.imul(pt, rt) | 0, u = u + Math.imul(tt, it) | 0, e = e + Math.imul(tt, gt) | 0, e = e + Math.imul(vt, it) | 0, l = l + Math.imul(vt, gt) | 0, u = u + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(J, nt) | 0, l = l + Math.imul(J, bt) | 0, u = u + Math.imul($, ft) | 0, e = e + Math.imul($, yt) | 0, e = e + Math.imul(K, ft) | 0, l = l + Math.imul(K, yt) | 0, u = u + Math.imul(O, at) | 0, e = e + Math.imul(O, wt) | 0, e = e + Math.imul(R, at) | 0, l = l + Math.imul(R, wt) | 0, u = u + Math.imul(_, ht) | 0, e = e + Math.imul(_, Mt) | 0, e = e + Math.imul(C, ht) | 0, l = l + Math.imul(C, Mt) | 0;
      var re = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(Q, U), e = Math.imul(Q, X), e = e + Math.imul(ct, U) | 0, l = Math.imul(ct, X), u = u + Math.imul(j, G) | 0, e = e + Math.imul(j, rt) | 0, e = e + Math.imul(dt, G) | 0, l = l + Math.imul(dt, rt) | 0, u = u + Math.imul(et, it) | 0, e = e + Math.imul(et, gt) | 0, e = e + Math.imul(pt, it) | 0, l = l + Math.imul(pt, gt) | 0, u = u + Math.imul(tt, nt) | 0, e = e + Math.imul(tt, bt) | 0, e = e + Math.imul(vt, nt) | 0, l = l + Math.imul(vt, bt) | 0, u = u + Math.imul(Z, ft) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(J, ft) | 0, l = l + Math.imul(J, yt) | 0, u = u + Math.imul($, at) | 0, e = e + Math.imul($, wt) | 0, e = e + Math.imul(K, at) | 0, l = l + Math.imul(K, wt) | 0, u = u + Math.imul(O, ht) | 0, e = e + Math.imul(O, Mt) | 0, e = e + Math.imul(R, ht) | 0, l = l + Math.imul(R, Mt) | 0, u = u + Math.imul(_, st) | 0, e = e + Math.imul(_, xt) | 0, e = e + Math.imul(C, st) | 0, l = l + Math.imul(C, xt) | 0;
      var ie = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(E, U), e = Math.imul(E, X), e = e + Math.imul(w, U) | 0, l = Math.imul(w, X), u = u + Math.imul(Q, G) | 0, e = e + Math.imul(Q, rt) | 0, e = e + Math.imul(ct, G) | 0, l = l + Math.imul(ct, rt) | 0, u = u + Math.imul(j, it) | 0, e = e + Math.imul(j, gt) | 0, e = e + Math.imul(dt, it) | 0, l = l + Math.imul(dt, gt) | 0, u = u + Math.imul(et, nt) | 0, e = e + Math.imul(et, bt) | 0, e = e + Math.imul(pt, nt) | 0, l = l + Math.imul(pt, bt) | 0, u = u + Math.imul(tt, ft) | 0, e = e + Math.imul(tt, yt) | 0, e = e + Math.imul(vt, ft) | 0, l = l + Math.imul(vt, yt) | 0, u = u + Math.imul(Z, at) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(J, at) | 0, l = l + Math.imul(J, wt) | 0, u = u + Math.imul($, ht) | 0, e = e + Math.imul($, Mt) | 0, e = e + Math.imul(K, ht) | 0, l = l + Math.imul(K, Mt) | 0, u = u + Math.imul(O, st) | 0, e = e + Math.imul(O, xt) | 0, e = e + Math.imul(R, st) | 0, l = l + Math.imul(R, xt) | 0, u = u + Math.imul(_, ot) | 0, e = e + Math.imul(_, _t) | 0, e = e + Math.imul(C, ot) | 0, l = l + Math.imul(C, _t) | 0;
      var ne = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul(T, U), e = Math.imul(T, X), e = e + Math.imul(q, U) | 0, l = Math.imul(q, X), u = u + Math.imul(E, G) | 0, e = e + Math.imul(E, rt) | 0, e = e + Math.imul(w, G) | 0, l = l + Math.imul(w, rt) | 0, u = u + Math.imul(Q, it) | 0, e = e + Math.imul(Q, gt) | 0, e = e + Math.imul(ct, it) | 0, l = l + Math.imul(ct, gt) | 0, u = u + Math.imul(j, nt) | 0, e = e + Math.imul(j, bt) | 0, e = e + Math.imul(dt, nt) | 0, l = l + Math.imul(dt, bt) | 0, u = u + Math.imul(et, ft) | 0, e = e + Math.imul(et, yt) | 0, e = e + Math.imul(pt, ft) | 0, l = l + Math.imul(pt, yt) | 0, u = u + Math.imul(tt, at) | 0, e = e + Math.imul(tt, wt) | 0, e = e + Math.imul(vt, at) | 0, l = l + Math.imul(vt, wt) | 0, u = u + Math.imul(Z, ht) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(J, ht) | 0, l = l + Math.imul(J, Mt) | 0, u = u + Math.imul($, st) | 0, e = e + Math.imul($, xt) | 0, e = e + Math.imul(K, st) | 0, l = l + Math.imul(K, xt) | 0, u = u + Math.imul(O, ot) | 0, e = e + Math.imul(O, _t) | 0, e = e + Math.imul(R, ot) | 0, l = l + Math.imul(R, _t) | 0, u = u + Math.imul(_, ut) | 0, e = e + Math.imul(_, St) | 0, e = e + Math.imul(C, ut) | 0, l = l + Math.imul(C, St) | 0;
      var fe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(T, G), e = Math.imul(T, rt), e = e + Math.imul(q, G) | 0, l = Math.imul(q, rt), u = u + Math.imul(E, it) | 0, e = e + Math.imul(E, gt) | 0, e = e + Math.imul(w, it) | 0, l = l + Math.imul(w, gt) | 0, u = u + Math.imul(Q, nt) | 0, e = e + Math.imul(Q, bt) | 0, e = e + Math.imul(ct, nt) | 0, l = l + Math.imul(ct, bt) | 0, u = u + Math.imul(j, ft) | 0, e = e + Math.imul(j, yt) | 0, e = e + Math.imul(dt, ft) | 0, l = l + Math.imul(dt, yt) | 0, u = u + Math.imul(et, at) | 0, e = e + Math.imul(et, wt) | 0, e = e + Math.imul(pt, at) | 0, l = l + Math.imul(pt, wt) | 0, u = u + Math.imul(tt, ht) | 0, e = e + Math.imul(tt, Mt) | 0, e = e + Math.imul(vt, ht) | 0, l = l + Math.imul(vt, Mt) | 0, u = u + Math.imul(Z, st) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(J, st) | 0, l = l + Math.imul(J, xt) | 0, u = u + Math.imul($, ot) | 0, e = e + Math.imul($, _t) | 0, e = e + Math.imul(K, ot) | 0, l = l + Math.imul(K, _t) | 0, u = u + Math.imul(O, ut) | 0, e = e + Math.imul(O, St) | 0, e = e + Math.imul(R, ut) | 0, l = l + Math.imul(R, St) | 0;
      var ae = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(T, it), e = Math.imul(T, gt), e = e + Math.imul(q, it) | 0, l = Math.imul(q, gt), u = u + Math.imul(E, nt) | 0, e = e + Math.imul(E, bt) | 0, e = e + Math.imul(w, nt) | 0, l = l + Math.imul(w, bt) | 0, u = u + Math.imul(Q, ft) | 0, e = e + Math.imul(Q, yt) | 0, e = e + Math.imul(ct, ft) | 0, l = l + Math.imul(ct, yt) | 0, u = u + Math.imul(j, at) | 0, e = e + Math.imul(j, wt) | 0, e = e + Math.imul(dt, at) | 0, l = l + Math.imul(dt, wt) | 0, u = u + Math.imul(et, ht) | 0, e = e + Math.imul(et, Mt) | 0, e = e + Math.imul(pt, ht) | 0, l = l + Math.imul(pt, Mt) | 0, u = u + Math.imul(tt, st) | 0, e = e + Math.imul(tt, xt) | 0, e = e + Math.imul(vt, st) | 0, l = l + Math.imul(vt, xt) | 0, u = u + Math.imul(Z, ot) | 0, e = e + Math.imul(Z, _t) | 0, e = e + Math.imul(J, ot) | 0, l = l + Math.imul(J, _t) | 0, u = u + Math.imul($, ut) | 0, e = e + Math.imul($, St) | 0, e = e + Math.imul(K, ut) | 0, l = l + Math.imul(K, St) | 0;
      var he = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(T, nt), e = Math.imul(T, bt), e = e + Math.imul(q, nt) | 0, l = Math.imul(q, bt), u = u + Math.imul(E, ft) | 0, e = e + Math.imul(E, yt) | 0, e = e + Math.imul(w, ft) | 0, l = l + Math.imul(w, yt) | 0, u = u + Math.imul(Q, at) | 0, e = e + Math.imul(Q, wt) | 0, e = e + Math.imul(ct, at) | 0, l = l + Math.imul(ct, wt) | 0, u = u + Math.imul(j, ht) | 0, e = e + Math.imul(j, Mt) | 0, e = e + Math.imul(dt, ht) | 0, l = l + Math.imul(dt, Mt) | 0, u = u + Math.imul(et, st) | 0, e = e + Math.imul(et, xt) | 0, e = e + Math.imul(pt, st) | 0, l = l + Math.imul(pt, xt) | 0, u = u + Math.imul(tt, ot) | 0, e = e + Math.imul(tt, _t) | 0, e = e + Math.imul(vt, ot) | 0, l = l + Math.imul(vt, _t) | 0, u = u + Math.imul(Z, ut) | 0, e = e + Math.imul(Z, St) | 0, e = e + Math.imul(J, ut) | 0, l = l + Math.imul(J, St) | 0;
      var se = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(T, ft), e = Math.imul(T, yt), e = e + Math.imul(q, ft) | 0, l = Math.imul(q, yt), u = u + Math.imul(E, at) | 0, e = e + Math.imul(E, wt) | 0, e = e + Math.imul(w, at) | 0, l = l + Math.imul(w, wt) | 0, u = u + Math.imul(Q, ht) | 0, e = e + Math.imul(Q, Mt) | 0, e = e + Math.imul(ct, ht) | 0, l = l + Math.imul(ct, Mt) | 0, u = u + Math.imul(j, st) | 0, e = e + Math.imul(j, xt) | 0, e = e + Math.imul(dt, st) | 0, l = l + Math.imul(dt, xt) | 0, u = u + Math.imul(et, ot) | 0, e = e + Math.imul(et, _t) | 0, e = e + Math.imul(pt, ot) | 0, l = l + Math.imul(pt, _t) | 0, u = u + Math.imul(tt, ut) | 0, e = e + Math.imul(tt, St) | 0, e = e + Math.imul(vt, ut) | 0, l = l + Math.imul(vt, St) | 0;
      var oe = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(T, at), e = Math.imul(T, wt), e = e + Math.imul(q, at) | 0, l = Math.imul(q, wt), u = u + Math.imul(E, ht) | 0, e = e + Math.imul(E, Mt) | 0, e = e + Math.imul(w, ht) | 0, l = l + Math.imul(w, Mt) | 0, u = u + Math.imul(Q, st) | 0, e = e + Math.imul(Q, xt) | 0, e = e + Math.imul(ct, st) | 0, l = l + Math.imul(ct, xt) | 0, u = u + Math.imul(j, ot) | 0, e = e + Math.imul(j, _t) | 0, e = e + Math.imul(dt, ot) | 0, l = l + Math.imul(dt, _t) | 0, u = u + Math.imul(et, ut) | 0, e = e + Math.imul(et, St) | 0, e = e + Math.imul(pt, ut) | 0, l = l + Math.imul(pt, St) | 0;
      var ue = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(T, ht), e = Math.imul(T, Mt), e = e + Math.imul(q, ht) | 0, l = Math.imul(q, Mt), u = u + Math.imul(E, st) | 0, e = e + Math.imul(E, xt) | 0, e = e + Math.imul(w, st) | 0, l = l + Math.imul(w, xt) | 0, u = u + Math.imul(Q, ot) | 0, e = e + Math.imul(Q, _t) | 0, e = e + Math.imul(ct, ot) | 0, l = l + Math.imul(ct, _t) | 0, u = u + Math.imul(j, ut) | 0, e = e + Math.imul(j, St) | 0, e = e + Math.imul(dt, ut) | 0, l = l + Math.imul(dt, St) | 0;
      var le = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(T, st), e = Math.imul(T, xt), e = e + Math.imul(q, st) | 0, l = Math.imul(q, xt), u = u + Math.imul(E, ot) | 0, e = e + Math.imul(E, _t) | 0, e = e + Math.imul(w, ot) | 0, l = l + Math.imul(w, _t) | 0, u = u + Math.imul(Q, ut) | 0, e = e + Math.imul(Q, St) | 0, e = e + Math.imul(ct, ut) | 0, l = l + Math.imul(ct, St) | 0;
      var de = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(T, ot), e = Math.imul(T, _t), e = e + Math.imul(q, ot) | 0, l = Math.imul(q, _t), u = u + Math.imul(E, ut) | 0, e = e + Math.imul(E, St) | 0, e = e + Math.imul(w, ut) | 0, l = l + Math.imul(w, St) | 0;
      var ce = (v + u | 0) + ((e & 8191) << 13) | 0;
      v = (l + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(T, ut), e = Math.imul(T, St), e = e + Math.imul(q, ut) | 0, l = Math.imul(q, St);
      var ve = (v + u | 0) + ((e & 8191) << 13) | 0;
      return v = (l + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = $t, c[1] = Nt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (L = D);
    function W(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, u = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= u; e++) {
          var l = d - e, b = p.words[l] | 0, _ = t.words[e] | 0, C = b * _, F = C & 67108863;
          c = c + (C / 67108864 | 0) | 0, F = F + v | 0, v = F & 67108863, c = c + (F >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function z(p, t, r) {
      var i = new N();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = L(this, t, r) : a < 63 ? i = D(this, t, r) : a < 1024 ? i = W(this, t, r) : i = z(this, t, r), i;
    };
    function N(p, t) {
      this.x = p, this.y = t;
    }
    N.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, N.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, N.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, N.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var u = v << 1, e = Math.cos(2 * Math.PI / u), l = Math.sin(2 * Math.PI / u), b = 0; b < d; b += u)
          for (var _ = e, C = l, F = 0; F < v; F++) {
            var O = i[b + F], R = a[b + F], P = i[b + F + v], $ = a[b + F + v], K = _ * P - C * $;
            $ = _ * $ + C * P, P = K, i[b + F] = O + P, a[b + F] = R + $, i[b + F + v] = O - P, a[b + F + v] = R - $, F !== u && (K = e * _ - l * C, C = e * C + l * _, _ = K);
          }
    }, N.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, N.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, N.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, N.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      s(d === 0), s((d & -8192) === 0);
    }, N.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, N.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), u = new Array(a), e = new Array(a), l = new Array(a), b = new Array(a), _ = new Array(a), C = i.words;
      C.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, l, a), this.transform(v, c, u, e, a, d), this.transform(l, c, b, _, a, d);
      for (var F = 0; F < a; F++) {
        var O = u[F] * b[F] - e[F] * _[F];
        e[F] = u[F] * _[F] + e[F] * b[F], u[F] = O;
      }
      return this.conjugate(u, e, a), this.transform(u, e, C, c, a, d), this.conjugate(C, c, a), this.normalize13b(C, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
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
        var a = (this.words[i] | 0) * t, d = (a & 67108863) + (r & 67108863);
        r >>= 26, r += a / 67108864 | 0, r += d >>> 26, this.words[i] = d & 67108863;
      }
      return r !== 0 && (this.words[i] = r, this.length++), this.length = t === 0 ? 1 : this.length, this;
    }, f.prototype.muln = function(t) {
      return this.clone().imuln(t);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(t) {
      var r = I(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, u = (this.words[d] | 0) - v << r;
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
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, u = i;
      if (a -= c, a = Math.max(0, a), u) {
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
      for (e = this.length - 1; e >= 0 && (l !== 0 || e >= a); e--) {
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      s(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (s(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
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
      var a = t.length + i, d;
      this._expand(a);
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
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var u = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = u + 1, e.words = new Array(e.length);
        for (var l = 0; l < e.length; l++)
          e.words[l] = 0;
      }
      var b = a.clone()._ishlnsubmul(d, 1, u);
      b.negative === 0 && (a = b, e && (e.words[u] = 1));
      for (var _ = u - 1; _ >= 0; _--) {
        var C = (a.words[d.length + _] | 0) * 67108864 + (a.words[d.length + _ - 1] | 0);
        for (C = Math.min(C / c | 0, 67108863), a._ishlnsubmul(d, C, _); a.negative !== 0; )
          C--, a.negative = 0, a._ishlnsubmul(d, 1, _), a.isZero() || (a.negative ^= 1);
        e && (e.words[_] = C);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (s(!t.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var a, d, c;
      return this.negative !== 0 && t.negative === 0 ? (c = this.neg().divmod(t, r), r !== "mod" && (a = c.div.neg()), r !== "div" && (d = c.mod.neg(), i && d.negative !== 0 && d.iadd(t)), {
        div: a,
        mod: d
      }) : this.negative === 0 && t.negative !== 0 ? (c = this.divmod(t.neg(), r), r !== "mod" && (a = c.div.neg()), {
        div: a,
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
      var i = r.div.negative !== 0 ? r.mod.isub(t) : r.mod, a = t.ushrn(1), d = t.andln(1), c = i.cmp(a);
      return c < 0 || d === 1 && c === 0 ? r.div : r.div.negative !== 0 ? r.div.isubn(1) : r.div.iaddn(1);
    }, f.prototype.modn = function(t) {
      s(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      s(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      s(t.negative === 0), s(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), u = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++u;
      for (var e = i.clone(), l = r.clone(); !r.isZero(); ) {
        for (var b = 0, _ = 1; !(r.words[0] & _) && b < 26; ++b, _ <<= 1)
          ;
        if (b > 0)
          for (r.iushrn(b); b-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(l)), a.iushrn(1), d.iushrn(1);
        for (var C = 0, F = 1; !(i.words[0] & F) && C < 26; ++C, F <<= 1)
          ;
        if (C > 0)
          for (i.iushrn(C); C-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(l)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
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
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, u = 1; !(r.words[0] & u) && v < 26; ++v, u <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, l = 1; !(i.words[0] & l) && e < 26; ++e, l <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var b;
      return r.cmpn(1) === 0 ? b = a : b = d, b.cmpn(0) < 0 && b.iadd(t), b;
    }, f.prototype.gcd = function(t) {
      if (this.isZero())
        return t.abs();
      if (t.isZero())
        return this.abs();
      var r = this.clone(), i = t.clone();
      r.negative = 0, i.negative = 0;
      for (var a = 0; r.isEven() && i.isEven(); a++)
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
      return i.iushln(a);
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
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return this._expand(i + 1), this.words[i] |= a, this;
      for (var d = a, c = i; d !== 0 && c < this.length; c++) {
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
        var a = this.words[0] | 0;
        i = a === t ? 0 : a < t ? -1 : 1;
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
        var a = this.words[i] | 0, d = t.words[i] | 0;
        if (a !== d) {
          a < d ? r = -1 : a > d && (r = 1);
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
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
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
      for (var i = 4194303, a = Math.min(t.length, 9), d = 0; d < a; d++)
        r.words[d] = t.words[d];
      if (r.length = a, t.length <= 9) {
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
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
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
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
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
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      s(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), u = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, u).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var l = this.pow(e, a), b = this.pow(t, a.addn(1).iushrn(1)), _ = this.pow(t, a), C = d; _.cmp(c) !== 0; ) {
        for (var F = _, O = 0; F.cmp(c) !== 0; O++)
          F = F.redSqr();
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
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, u = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var l = r.words[d], b = e - 1; b >= 0; b--) {
          var _ = l >> b & 1;
          if (c !== a[0] && (c = this.sqr(c)), _ === 0 && v === 0) {
            u = 0;
            continue;
          }
          v <<= 1, v |= _, u++, !(u !== i && (d !== 0 || b !== 0)) && (c = this.mul(c, a[v]), u = 0, v = 0);
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
      return new kt(t);
    };
    function kt(p) {
      Y.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(kt, Y), kt.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, kt.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, kt.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, kt.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(J0);
var G0 = J0.exports, lh = G0, qm = Ot.Buffer;
function Fm(h, n) {
  return qm.from(h.toRed(lh.mont(n.modulus)).redPow(new lh(n.publicExponent)).fromRed().toArray());
}
var Lo = Fm, Pm = hf, p0 = gi, Dm = Gi, dh = No, ch = Uo, X0 = G0, $m = Lo, Nm = U0, je = Ot.Buffer, Um = function(n, o, s) {
  var m;
  n.padding ? m = n.padding : s ? m = 1 : m = 4;
  var f = Pm(n), g;
  if (m === 4)
    g = Lm(f, o);
  else if (m === 1)
    g = Om(f, o, s);
  else if (m === 3) {
    if (g = new X0(o), g.cmp(f.modulus) >= 0)
      throw new Error("data too long for modulus");
  } else
    throw new Error("unknown padding");
  return s ? Nm(g, f) : $m(g, f);
};
function Lm(h, n) {
  var o = h.modulus.byteLength(), s = n.length, m = Dm("sha1").update(je.alloc(0)).digest(), f = m.length, g = 2 * f;
  if (s > o - g - 2)
    throw new Error("message too long");
  var y = je.alloc(o - s - g - 2), S = o - f - 1, B = p0(f), M = ch(je.concat([m, y, je.alloc(1, 1), n], S), dh(B, S)), x = ch(B, dh(M, f));
  return new X0(je.concat([je.alloc(1), x, M], o));
}
function Om(h, n, o) {
  var s = n.length, m = h.modulus.byteLength();
  if (s > m - 11)
    throw new Error("message too long");
  var f;
  return o ? f = je.alloc(m - s - 3, 255) : f = zm(m - s - 3), new X0(je.concat([je.from([0, o ? 1 : 2]), f, je.alloc(1), n], m));
}
function zm(h) {
  for (var n = je.allocUnsafe(h), o = 0, s = p0(h * 2), m = 0, f; o < h; )
    m === s.length && (s = p0(h * 2), m = 0), f = s[m++], f && (n[o++] = f);
  return n;
}
var Km = hf, vh = No, ph = Uo, mh = G0, Hm = U0, Zm = Gi, Wm = Lo, Hi = Ot.Buffer, Vm = function(n, o, s) {
  var m;
  n.padding ? m = n.padding : s ? m = 1 : m = 4;
  var f = Km(n), g = f.modulus.byteLength();
  if (o.length > g || new mh(o).cmp(f.modulus) >= 0)
    throw new Error("decryption error");
  var y;
  s ? y = Wm(new mh(o), f) : y = Hm(o, f);
  var S = Hi.alloc(g - y.length);
  if (y = Hi.concat([S, y], g), m === 4)
    return Ym(f, y);
  if (m === 1)
    return Jm(f, y, s);
  if (m === 3)
    return y;
  throw new Error("unknown padding");
};
function Ym(h, n) {
  var o = h.modulus.byteLength(), s = Zm("sha1").update(Hi.alloc(0)).digest(), m = s.length;
  if (n[0] !== 0)
    throw new Error("decryption error");
  var f = n.slice(1, m + 1), g = n.slice(m + 1), y = ph(f, vh(g, m)), S = ph(g, vh(y, o - m - 1));
  if (Gm(s, S.slice(0, m)))
    throw new Error("decryption error");
  for (var B = m; S[B] === 0; )
    B++;
  if (S[B++] !== 1)
    throw new Error("decryption error");
  return S.slice(B);
}
function Jm(h, n, o) {
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
function Gm(h, n) {
  h = Hi.from(h), n = Hi.from(n);
  var o = 0, s = h.length;
  h.length !== n.length && (o++, s = Math.min(h.length, n.length));
  for (var m = -1; ++m < s; )
    o += h[m] ^ n[m];
  return o;
}
(function(h) {
  h.publicEncrypt = Um, h.privateDecrypt = Vm, h.privateEncrypt = function(o, s) {
    return h.publicEncrypt(o, s, !0);
  }, h.publicDecrypt = function(o, s) {
    return h.privateDecrypt(o, s, !0);
  };
})($o);
var $i = {};
function gh() {
  throw new Error(`secure random number generation not supported by this browser
use chrome, FireFox or Internet Explorer 11`);
}
var Oo = Ot, bh = gi, zo = Oo.Buffer, Ko = Oo.kMaxLength, m0 = Gt.crypto || Gt.msCrypto, Ho = Math.pow(2, 32) - 1;
function Zo(h, n) {
  if (typeof h != "number" || h !== h)
    throw new TypeError("offset must be a number");
  if (h > Ho || h < 0)
    throw new TypeError("offset must be a uint32");
  if (h > Ko || h > n)
    throw new RangeError("offset out of range");
}
function Wo(h, n, o) {
  if (typeof h != "number" || h !== h)
    throw new TypeError("size must be a number");
  if (h > Ho || h < 0)
    throw new TypeError("size must be a uint32");
  if (h + n > o || h > Ko)
    throw new RangeError("buffer too small");
}
m0 && m0.getRandomValues || !ye.browser ? ($i.randomFill = Xm, $i.randomFillSync = jm) : ($i.randomFill = gh, $i.randomFillSync = gh);
function Xm(h, n, o, s) {
  if (!zo.isBuffer(h) && !(h instanceof Gt.Uint8Array))
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
  if (typeof n == "function")
    s = n, n = 0, o = h.length;
  else if (typeof o == "function")
    s = o, o = h.length - n;
  else if (typeof s != "function")
    throw new TypeError('"cb" argument must be a function');
  return Zo(n, h.length), Wo(o, n, h.length), Vo(h, n, o, s);
}
function Vo(h, n, o, s) {
  if (ye.browser) {
    var m = h.buffer, f = new Uint8Array(m, n, o);
    if (m0.getRandomValues(f), s) {
      ye.nextTick(function() {
        s(null, h);
      });
      return;
    }
    return h;
  }
  if (s) {
    bh(o, function(y, S) {
      if (y)
        return s(y);
      S.copy(h, n), s(null, h);
    });
    return;
  }
  var g = bh(o);
  return g.copy(h, n), h;
}
function jm(h, n, o) {
  if (typeof n == "undefined" && (n = 0), !zo.isBuffer(h) && !(h instanceof Gt.Uint8Array))
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
  return Zo(n, h.length), o === void 0 && (o = h.length - n), Wo(o, n, h.length), Vo(h, n, o);
}
var yh;
function Yo() {
  if (yh)
    return Ut;
  yh = 1, Ut.randomBytes = Ut.rng = Ut.pseudoRandomBytes = Ut.prng = gi, Ut.createHash = Ut.Hash = Gi, Ut.createHmac = Ut.Hmac = Hh;
  var h = zd, n = Object.keys(h), o = [
    "sha1",
    "sha224",
    "sha256",
    "sha384",
    "sha512",
    "md5",
    "rmd160"
  ].concat(n);
  Ut.getHashes = function() {
    return o;
  };
  var s = Nn;
  Ut.pbkdf2 = s.pbkdf2, Ut.pbkdf2Sync = s.pbkdf2Sync;
  var m = Qe;
  Ut.Cipher = m.Cipher, Ut.createCipher = m.createCipher, Ut.Cipheriv = m.Cipheriv, Ut.createCipheriv = m.createCipheriv, Ut.Decipher = m.Decipher, Ut.createDecipher = m.createDecipher, Ut.Decipheriv = m.Decipheriv, Ut.createDecipheriv = m.createDecipheriv, Ut.getCiphers = m.getCiphers, Ut.listCiphers = m.listCiphers;
  var f = j1();
  Ut.DiffieHellmanGroup = f.DiffieHellmanGroup, Ut.createDiffieHellmanGroup = f.createDiffieHellmanGroup, Ut.getDiffieHellman = f.getDiffieHellman, Ut.createDiffieHellman = f.createDiffieHellman, Ut.DiffieHellman = f.DiffieHellman;
  var g = Im();
  Ut.createSign = g.createSign, Ut.Sign = g.Sign, Ut.createVerify = g.createVerify, Ut.Verify = g.Verify, Ut.createECDH = Rm();
  var y = $o;
  Ut.publicEncrypt = y.publicEncrypt, Ut.privateEncrypt = y.privateEncrypt, Ut.publicDecrypt = y.publicDecrypt, Ut.privateDecrypt = y.privateDecrypt;
  var S = $i;
  return Ut.randomFill = S.randomFill, Ut.randomFillSync = S.randomFillSync, Ut.createCredentials = function() {
    throw new Error(`sorry, createCredentials is not implemented yet
we accept pull requests
https://github.com/browserify/crypto-browserify`);
  }, Ut.constants = {
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
  }, Ut;
}
var Qm = Yo();
const t3 = /* @__PURE__ */ hu(Qm);
function Jo(h) {
  const n = t3.createHash("sha256").update(h).digest("hex");
  return parseInt(n.slice(0, 8), 16) % 1e4 / 100;
}
function e3(h, n) {
  const o = Jo(h);
  let s = 0;
  for (const m of n.variants)
    if (s += m.weight, o < s)
      return m.value;
  return null;
}
function r3(h, n) {
  const o = n.user_id || n.id || n.email;
  if (!h || typeof h != "object" || !o)
    return null;
  switch (h.strategy) {
    case "percentage": {
      if (!("percentage" in h) || !("salt" in h))
        return null;
      const { percentage: s, salt: m } = h;
      return Jo(`${o}.${m}`) < s ? !0 : null;
    }
    case "variant": {
      if (!("variants" in h))
        return null;
      const { salt: s, variants: m } = h;
      return e3(`${o}.${s}`, m);
    }
    default:
      return null;
  }
}
function i3(h, n) {
  var f;
  if (!(h.targeting_rules || []).every((g) => {
    var y;
    if (g.type === "segment") {
      const S = (y = h.segmentsById) == null ? void 0 : y[g.segment_id];
      return S ? yu(S, n) : !1;
    } else
      return Mh(g, n);
  }))
    return null;
  const m = h.rollout ? r3(h.rollout, n) : null;
  return (f = m != null ? m : h.value) != null ? f : null;
}
let an = {
  getItem: (h) => typeof localStorage != "undefined" ? localStorage.getItem(h) : null,
  setItem: (h, n) => {
    typeof localStorage != "undefined" && localStorage.setItem(h, n);
  }
};
function n3(h) {
  an = h;
}
function Go(h) {
  return `flagmint_${h}_flags`;
}
function Xo(h) {
  return `flagmint_${h}_context`;
}
function jo(h, n) {
  try {
    const o = an.getItem(Go(h));
    if (!o)
      return null;
    const s = JSON.parse(o);
    return Date.now() - s.ts > n ? null : s.data;
  } catch (o) {
    return null;
  }
}
function Qo(h, n) {
  try {
    an.setItem(Go(h), JSON.stringify({ ts: Date.now(), data: n }));
  } catch (o) {
  }
}
function tu(h) {
  try {
    const n = an.getItem(Xo(h));
    return n ? JSON.parse(n) : null;
  } catch (n) {
    return null;
  }
}
function eu(h, n) {
  try {
    an.setItem(Xo(h), JSON.stringify(n));
  } catch (o) {
  }
}
const p3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loadCachedContext: tu,
  loadCachedFlags: jo,
  saveCachedContext: eu,
  saveCachedFlags: Qo,
  setCacheStorage: n3
}, Symbol.toStringTag, { value: "Module" })), f3 = 24 * 60 * 60 * 1e3, a3 = "http://localhost:3000/evaluator/evaluate", h3 = "wss://api.flagmint.io/flags/ws";
class m3 {
  /**
   * Creates a new FlagClient instance.
   * @param options - Configuration options for the client.
   */
  constructor(n) {
    var o, s, m, f;
    if (this.flags = {}, this.refreshIntervalId = null, this.rawFlags = {}, this.apiKey = n.apiKey, this.enableOfflineCache = (o = n.enableOfflineCache) != null ? o : !0, this.persistContext = (s = n.persistContext) != null ? s : !1, this.cacheTTL = f3, this.onError = n.onError, this.cacheAdapter = (m = n.cacheAdapter) != null ? m : {
      loadFlags: jo,
      saveFlags: Qo,
      loadContext: tu,
      saveContext: eu
    }, this.context = n.context || {}, this.rawFlags = (f = n.rawFlags) != null ? f : {}, this.previewMode = n.previewMode || !1, this.previewMode && this.rawFlags && Object.keys(this.rawFlags).length > 0) {
      this.flags = this.evaluateLocally(this.rawFlags, this.context), this.readyPromise = Promise.resolve(), this.resolveReady = () => {
      }, this.rejectReady = () => {
      };
      return;
    } else
      this.previewMode && !this.rawFlags && console.error("[FlagClient] No raw flags provided for preview mode. Defaulting to remote fetch.");
    this.readyPromise = new Promise((g, y) => {
      this.resolveReady = g, this.rejectReady = y;
    }), this.initialize(n);
  }
  /**
   * Initializes the client by loading cached flags and context, setting up the transport layer, and starting the auto-refresh timer if enabled.
   * @param options - The options for initializing the client.
   * 
   * @throws Will throw an error if initialization fails.
   * @returns {Promise<void>} A promise that resolves when the client is ready.
   * @private
   */
  initialize(n) {
    return Ue(this, null, function* () {
      var o;
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
          s && (this.flags = s);
        }
        yield this.setupTransport(n), this.resolveReady();
      } catch (s) {
        this.rejectReady(s), (o = this.onError) == null || o.call(this, s);
      }
    });
  }
  /**
   * Sets up the transport layer for the client.
   * @param options - The options for the transport setup.
   */
  setupTransport(n) {
    return Ue(this, null, function* () {
      var f;
      console.log("[FlagClient] setupTransport() started");
      const o = (f = n.transportMode) != null ? f : "auto", s = () => Ue(this, null, function* () {
        console.log("[FlagClient] Initializing WebSocket transport...");
        const g = new bu(h3, this.apiKey);
        return yield g.init(), console.log("[FlagClient] WebSocket transport initialized"), g;
      }), m = () => {
        console.log("[FlagClient] Using long polling transport...");
        const g = new gu(a3, this.apiKey, this.context);
        return g.init((y) => {
          console.log("[FlagClient] LongPolling update received:", y), this.flags = y, this.enableOfflineCache && Promise.resolve(
            this.cacheAdapter.saveFlags(this.apiKey, y)
          );
        }), g;
      };
      try {
        if (o === "websocket")
          this.transport = yield s();
        else if (o === "long-polling")
          this.transport = m();
        else
          try {
            this.transport = yield s();
          } catch (y) {
            console.warn("[FlagClient] WebSocket failed, falling back to long polling"), this.transport = m();
          }
        console.log("[FlagClient] Fetching flags...");
        const g = yield this.transport.fetchFlags(this.context);
        console.log("[FlagClient] Initial flags fetched:", g), this.flags = g, this.enableOfflineCache && (yield Promise.resolve(
          this.cacheAdapter.saveFlags(this.apiKey, g)
        )), typeof this.transport.onFlagsUpdated == "function" && this.transport.onFlagsUpdated((y) => {
          this.flags = y, this.enableOfflineCache && this.cacheAdapter.saveFlags(this.apiKey, y);
        }), this.resolveReady();
      } catch (g) {
        throw console.error("[FlagClient] setupTransport error:", g), this.rejectReady(g), this.onError && this.onError(g instanceof Error ? g : new Error(String(g))), g;
      }
    });
  }
  getFlag(n, o) {
    var s;
    return (s = this.flags[n]) != null ? s : o;
  }
  updateContext(n) {
    this.context = uf(uf({}, this.context), n), this.persistContext && this.cacheAdapter.saveContext(this.apiKey, this.context);
  }
  destroy() {
    this.refreshIntervalId && clearInterval(this.refreshIntervalId), this.transport.destroy();
  }
  ready() {
    return Ue(this, null, function* () {
      return console.log("[FlagClient] Waiting for client to be ready...", this.readyPromise), this.readyPromise;
    });
  }
  evaluateLocally(n, o) {
    const s = {};
    for (const m in n) {
      const f = i3(n[m], o);
      f !== null && (s[m] = f);
    }
    return s;
  }
}
function ru(h) {
  return `flagmint_${h}_flags`;
}
function iu(h) {
  return `flagmint_${h}_context`;
}
let kr = null;
function s3(h) {
  kr = h;
}
function o3(h, n) {
  return Ue(this, null, function* () {
    if (!kr)
      throw new Error("Async storage not set");
    try {
      const o = yield kr.getItem(ru(h));
      if (!o)
        return null;
      const s = JSON.parse(o);
      return Date.now() - s.ts > n ? null : s.data;
    } catch (o) {
      return null;
    }
  });
}
function u3(h, n) {
  return Ue(this, null, function* () {
    if (!kr)
      throw new Error("Async storage not set");
    try {
      yield kr.setItem(ru(h), JSON.stringify({ ts: Date.now(), data: n }));
    } catch (o) {
    }
  });
}
function l3(h) {
  return Ue(this, null, function* () {
    if (!kr)
      throw new Error("Async storage not set");
    try {
      const n = yield kr.getItem(iu(h));
      return n ? JSON.parse(n) : null;
    } catch (n) {
      return null;
    }
  });
}
function d3(h, n) {
  return Ue(this, null, function* () {
    if (!kr)
      throw new Error("Async storage not set");
    try {
      yield kr.setItem(iu(h), JSON.stringify(n));
    } catch (o) {
    }
  });
}
const g3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loadCachedContext: l3,
  loadCachedFlags: o3,
  saveCachedContext: d3,
  saveCachedFlags: u3,
  setAsyncCacheStorage: s3
}, Symbol.toStringTag, { value: "Module" }));
typeof globalThis.Buffer == "undefined" && (globalThis.Buffer = gr.Buffer);
export {
  m3 as FlagClient,
  gu as LongPollingTransport,
  bu as WebSocketTransport,
  g3 as asyncCache,
  i3 as evaluateFlagValue,
  r3 as evaluateRollout,
  Jo as hashToPercentage,
  e3 as pickVariant,
  p3 as syncCache
};
