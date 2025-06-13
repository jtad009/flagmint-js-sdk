class Zo {
  constructor(n, l, o) {
    this.endpoint = n, this.apiKey = l, this.context = o, this.isStopped = !1;
  }
  async init(n) {
    for (; !this.isStopped; )
      try {
        const l = await this.fetchFlags(this.context);
        n(l);
      } catch (l) {
        console.error("[LongPollingTransport] poll error", l), await new Promise((o) => setTimeout(o, 2e3));
      }
  }
  async fetchFlags(n) {
    const l = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "x-api-key": `${this.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ context: n })
    });
    if (console.log(l, "response"), l.status === 401 || l.status === 403)
      throw new Error("Unauthorized: Invalid API key");
    if (!l.ok)
      throw new Error(`Unexpected response: ${l.status}`);
    return (await l.json()).data;
  }
  destroy() {
    this.isStopped = !0;
  }
}
class Wo {
  constructor(n, l, o = 5, m = 1e3) {
    this.wsUrl = n, this.apiKey = l, this.maxRetries = o, this.initialBackoffMs = m, this.socket = null, this.flags = {}, this.context = null, this.isReady = !1, this.retries = 0;
  }
  async init() {
    return this.connectWithRetry();
  }
  /**
   * Attempts to connect to the WebSocket server with retry logic.
   * If the connection fails, it will retry with exponential backoff.
   */
  connectWithRetry() {
    return new Promise((n, l) => {
      const o = () => {
        this.socket = new WebSocket(`${this.wsUrl}?apiKey=${this.apiKey}`), this.socket.onopen = () => {
          this.isReady = !0, this.retries = 0, this.context && this.sendContext(this.context), n();
        }, this.socket.onmessage = (m) => {
          var f;
          try {
            const b = JSON.parse(m.data);
            b.type === "flags" && (this.flags = b.flags, (f = this.onFlagsUpdatedCallback) == null || f.call(this, this.flags));
          } catch (b) {
            console.warn("Failed to parse WebSocket message:", b);
          }
        }, this.socket.onerror = (m) => {
          console.error("[WebSocketTransport] Error:", m);
        }, this.socket.onclose = (m) => {
          if (this.isReady = !1, m.code === 1008 || m.code === 4001)
            l(new Error("Unauthorized: Invalid API key"));
          else if (this.retries < this.maxRetries) {
            const f = this.initialBackoffMs * Math.pow(2, this.retries);
            console.warn(`[WebSocketTransport] Reconnecting in ${f}ms (attempt ${this.retries + 1})`), setTimeout(o, f), this.retries++;
          } else
            l(new Error(`WebSocket failed after ${this.retries} retries`));
        };
      };
      o();
    });
  }
  async fetchFlags(n) {
    var l;
    return this.context = n, this.isReady && ((l = this.socket) == null ? void 0 : l.readyState) === WebSocket.OPEN && this.sendContext(n), this.flags;
  }
  onFlagsUpdated(n) {
    this.onFlagsUpdatedCallback = n;
  }
  destroy() {
    this.socket && this.socket.readyState === WebSocket.OPEN && this.socket.close(), this.socket = null, this.flags = {}, this.context = null, this.isReady = !1, this.onFlagsUpdatedCallback = void 0;
  }
  sendContext(n) {
    var o;
    const l = JSON.stringify({ type: "context", context: n });
    (o = this.socket) == null || o.send(l);
  }
}
function sh(h, n) {
  if (h.type !== "rule")
    return !1;
  const l = h.attribute.split(".").reduce((o, m) => o == null ? void 0 : o[m], n);
  switch (h.operator) {
    case "eq":
      return l === h.value;
    case "neq":
      return l !== h.value;
    case "in":
      return Array.isArray(h.value) && h.value.includes(l);
    case "nin":
      return Array.isArray(h.value) && !h.value.includes(l);
    case "gt":
      return typeof l == "number" && typeof h.value == "number" && l > h.value;
    case "lt":
      return typeof l == "number" && typeof h.value == "number" && l < h.value;
    case "exists":
      return l != null;
    case "not_exists":
      return l == null;
    default:
      return !1;
  }
}
function Vo(h, n) {
  return h.rules.every((l) => sh(l, n));
}
var Gt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Yo(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default") ? h.default : h;
}
function Jo(h) {
  if (h.__esModule)
    return h;
  var n = h.default;
  if (typeof n == "function") {
    var l = function o() {
      return this instanceof o ? Reflect.construct(n, arguments, this.constructor) : n.apply(this, arguments);
    };
    l.prototype = n.prototype;
  } else
    l = {};
  return Object.defineProperty(l, "__esModule", { value: !0 }), Object.keys(h).forEach(function(o) {
    var m = Object.getOwnPropertyDescriptor(h, o);
    Object.defineProperty(l, o, m.get ? m : {
      enumerable: !0,
      get: function() {
        return h[o];
      }
    });
  }), l;
}
var Pt = {};
const Pi = typeof global < "u" ? global : typeof self < "u" ? self : typeof window < "u" ? window : {};
function oh() {
  throw new Error("setTimeout has not been defined");
}
function uh() {
  throw new Error("clearTimeout has not been defined");
}
var Er = oh, kr = uh;
typeof Pi.setTimeout == "function" && (Er = setTimeout);
typeof Pi.clearTimeout == "function" && (kr = clearTimeout);
function lh(h) {
  if (Er === setTimeout)
    return setTimeout(h, 0);
  if ((Er === oh || !Er) && setTimeout)
    return Er = setTimeout, setTimeout(h, 0);
  try {
    return Er(h, 0);
  } catch {
    try {
      return Er.call(null, h, 0);
    } catch {
      return Er.call(this, h, 0);
    }
  }
}
function Go(h) {
  if (kr === clearTimeout)
    return clearTimeout(h);
  if ((kr === uh || !kr) && clearTimeout)
    return kr = clearTimeout, clearTimeout(h);
  try {
    return kr(h);
  } catch {
    try {
      return kr.call(null, h);
    } catch {
      return kr.call(this, h);
    }
  }
}
var mr = [], ei = !1, Or, on = -1;
function Xo() {
  !ei || !Or || (ei = !1, Or.length ? mr = Or.concat(mr) : on = -1, mr.length && dh());
}
function dh() {
  if (!ei) {
    var h = lh(Xo);
    ei = !0;
    for (var n = mr.length; n; ) {
      for (Or = mr, mr = []; ++on < n; )
        Or && Or[on].run();
      on = -1, n = mr.length;
    }
    Or = null, ei = !1, Go(h);
  }
}
function jo(h) {
  var n = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var l = 1; l < arguments.length; l++)
      n[l - 1] = arguments[l];
  mr.push(new ch(h, n)), mr.length === 1 && !ei && lh(dh);
}
function ch(h, n) {
  this.fun = h, this.array = n;
}
ch.prototype.run = function() {
  this.fun.apply(null, this.array);
};
var Qo = "browser", tu = "browser", eu = !0, ru = {}, iu = [], nu = "", fu = {}, au = {}, hu = {};
function Yr() {
}
var su = Yr, ou = Yr, uu = Yr, lu = Yr, du = Yr, cu = Yr, vu = Yr;
function pu(h) {
  throw new Error("process.binding is not supported");
}
function mu() {
  return "/";
}
function gu(h) {
  throw new Error("process.chdir is not supported");
}
function bu() {
  return 0;
}
var Qr = Pi.performance || {}, yu = Qr.now || Qr.mozNow || Qr.msNow || Qr.oNow || Qr.webkitNow || function() {
  return (/* @__PURE__ */ new Date()).getTime();
};
function wu(h) {
  var n = yu.call(Qr) * 1e-3, l = Math.floor(n), o = Math.floor(n % 1 * 1e9);
  return h && (l = l - h[0], o = o - h[1], o < 0 && (l--, o += 1e9)), [l, o];
}
var Mu = /* @__PURE__ */ new Date();
function xu() {
  var h = /* @__PURE__ */ new Date(), n = h - Mu;
  return n / 1e3;
}
var ye = {
  nextTick: jo,
  title: Qo,
  browser: eu,
  env: ru,
  argv: iu,
  version: nu,
  versions: fu,
  on: su,
  addListener: ou,
  once: uu,
  off: lu,
  removeListener: du,
  removeAllListeners: cu,
  emit: vu,
  binding: pu,
  cwd: mu,
  chdir: gu,
  umask: bu,
  hrtime: wu,
  platform: tu,
  release: au,
  config: hu,
  uptime: xu
}, zf = { exports: {} }, Kf = { exports: {} };
const _u = {}, Su = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _u
}, Symbol.toStringTag, { value: "Module" })), ge = /* @__PURE__ */ Jo(Su);
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
(function(h, n) {
  var l = ge, o = l.Buffer;
  function m(b, w) {
    for (var _ in b)
      w[_] = b[_];
  }
  o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? h.exports = l : (m(l, n), n.Buffer = f);
  function f(b, w, _) {
    return o(b, w, _);
  }
  f.prototype = Object.create(o.prototype), m(o, f), f.from = function(b, w, _) {
    if (typeof b == "number")
      throw new TypeError("Argument must not be a number");
    return o(b, w, _);
  }, f.alloc = function(b, w, _) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    var S = o(b);
    return w !== void 0 ? typeof _ == "string" ? S.fill(w, _) : S.fill(w) : S.fill(0), S;
  }, f.allocUnsafe = function(b) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    return o(b);
  }, f.allocUnsafeSlow = function(b) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    return l.SlowBuffer(b);
  };
})(Kf, Kf.exports);
var Nt = Kf.exports, rf = 65536, Au = 4294967295;
function Bu() {
  throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`);
}
var Eu = Nt.Buffer, vn = Gt.crypto || Gt.msCrypto;
vn && vn.getRandomValues ? zf.exports = ku : zf.exports = Bu;
function ku(h, n) {
  if (h > Au)
    throw new RangeError("requested too many random bytes");
  var l = Eu.allocUnsafe(h);
  if (h > 0)
    if (h > rf)
      for (var o = 0; o < h; o += rf)
        vn.getRandomValues(l.slice(o, o + rf));
    else
      vn.getRandomValues(l);
  return typeof n == "function" ? ye.nextTick(function() {
    n(null, l);
  }) : l;
}
var li = zf.exports, Hf = { exports: {} };
typeof Object.create == "function" ? Hf.exports = function(n, l) {
  l && (n.super_ = l, n.prototype = Object.create(l.prototype, {
    constructor: {
      value: n,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : Hf.exports = function(n, l) {
  if (l) {
    n.super_ = l;
    var o = function() {
    };
    o.prototype = l.prototype, n.prototype = new o(), n.prototype.constructor = n;
  }
};
var Jt = Hf.exports, rr = Nt.Buffer, vh = ge.Transform, Ru = Jt;
function Cr(h) {
  vh.call(this), this._block = rr.allocUnsafe(h), this._blockSize = h, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
}
Ru(Cr, vh);
Cr.prototype._transform = function(h, n, l) {
  var o = null;
  try {
    this.update(h, n);
  } catch (m) {
    o = m;
  }
  l(o);
};
Cr.prototype._flush = function(h) {
  var n = null;
  try {
    this.push(this.digest());
  } catch (l) {
    n = l;
  }
  h(n);
};
var Iu = typeof Uint8Array < "u", Tu = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && ArrayBuffer.isView && (rr.prototype instanceof Uint8Array || rr.TYPED_ARRAY_SUPPORT);
function Cu(h, n) {
  if (h instanceof rr)
    return h;
  if (typeof h == "string")
    return rr.from(h, n);
  if (Tu && ArrayBuffer.isView(h)) {
    if (h.byteLength === 0)
      return rr.alloc(0);
    var l = rr.from(h.buffer, h.byteOffset, h.byteLength);
    if (l.byteLength === h.byteLength)
      return l;
  }
  if (Iu && h instanceof Uint8Array || rr.isBuffer(h) && h.constructor && typeof h.constructor.isBuffer == "function" && h.constructor.isBuffer(h))
    return rr.from(h);
  throw new TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.');
}
Cr.prototype.update = function(h, n) {
  if (this._finalized)
    throw new Error("Digest already called");
  h = Cu(h, n);
  for (var l = this._block, o = 0; this._blockOffset + h.length - o >= this._blockSize; ) {
    for (var m = this._blockOffset; m < this._blockSize; )
      l[m++] = h[o++];
    this._update(), this._blockOffset = 0;
  }
  for (; o < h.length; )
    l[this._blockOffset++] = h[o++];
  for (var f = 0, b = h.length * 8; b > 0; ++f)
    this._length[f] += b, b = this._length[f] / 4294967296 | 0, b > 0 && (this._length[f] -= 4294967296 * b);
  return this;
};
Cr.prototype._update = function() {
  throw new Error("_update is not implemented");
};
Cr.prototype.digest = function(h) {
  if (this._finalized)
    throw new Error("Digest already called");
  this._finalized = !0;
  var n = this._digest();
  h !== void 0 && (n = n.toString(h)), this._block.fill(0), this._blockOffset = 0;
  for (var l = 0; l < 4; ++l)
    this._length[l] = 0;
  return n;
};
Cr.prototype._digest = function() {
  throw new Error("_digest is not implemented");
};
var ph = Cr, qu = Jt, mh = ph, Pu = Nt.Buffer, Du = new Array(16);
function _n() {
  mh.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
}
qu(_n, mh);
_n.prototype._update = function() {
  for (var h = Du, n = 0; n < 16; ++n)
    h[n] = this._block.readInt32LE(n * 4);
  var l = this._a, o = this._b, m = this._c, f = this._d;
  l = ke(l, o, m, f, h[0], 3614090360, 7), f = ke(f, l, o, m, h[1], 3905402710, 12), m = ke(m, f, l, o, h[2], 606105819, 17), o = ke(o, m, f, l, h[3], 3250441966, 22), l = ke(l, o, m, f, h[4], 4118548399, 7), f = ke(f, l, o, m, h[5], 1200080426, 12), m = ke(m, f, l, o, h[6], 2821735955, 17), o = ke(o, m, f, l, h[7], 4249261313, 22), l = ke(l, o, m, f, h[8], 1770035416, 7), f = ke(f, l, o, m, h[9], 2336552879, 12), m = ke(m, f, l, o, h[10], 4294925233, 17), o = ke(o, m, f, l, h[11], 2304563134, 22), l = ke(l, o, m, f, h[12], 1804603682, 7), f = ke(f, l, o, m, h[13], 4254626195, 12), m = ke(m, f, l, o, h[14], 2792965006, 17), o = ke(o, m, f, l, h[15], 1236535329, 22), l = Re(l, o, m, f, h[1], 4129170786, 5), f = Re(f, l, o, m, h[6], 3225465664, 9), m = Re(m, f, l, o, h[11], 643717713, 14), o = Re(o, m, f, l, h[0], 3921069994, 20), l = Re(l, o, m, f, h[5], 3593408605, 5), f = Re(f, l, o, m, h[10], 38016083, 9), m = Re(m, f, l, o, h[15], 3634488961, 14), o = Re(o, m, f, l, h[4], 3889429448, 20), l = Re(l, o, m, f, h[9], 568446438, 5), f = Re(f, l, o, m, h[14], 3275163606, 9), m = Re(m, f, l, o, h[3], 4107603335, 14), o = Re(o, m, f, l, h[8], 1163531501, 20), l = Re(l, o, m, f, h[13], 2850285829, 5), f = Re(f, l, o, m, h[2], 4243563512, 9), m = Re(m, f, l, o, h[7], 1735328473, 14), o = Re(o, m, f, l, h[12], 2368359562, 20), l = Ie(l, o, m, f, h[5], 4294588738, 4), f = Ie(f, l, o, m, h[8], 2272392833, 11), m = Ie(m, f, l, o, h[11], 1839030562, 16), o = Ie(o, m, f, l, h[14], 4259657740, 23), l = Ie(l, o, m, f, h[1], 2763975236, 4), f = Ie(f, l, o, m, h[4], 1272893353, 11), m = Ie(m, f, l, o, h[7], 4139469664, 16), o = Ie(o, m, f, l, h[10], 3200236656, 23), l = Ie(l, o, m, f, h[13], 681279174, 4), f = Ie(f, l, o, m, h[0], 3936430074, 11), m = Ie(m, f, l, o, h[3], 3572445317, 16), o = Ie(o, m, f, l, h[6], 76029189, 23), l = Ie(l, o, m, f, h[9], 3654602809, 4), f = Ie(f, l, o, m, h[12], 3873151461, 11), m = Ie(m, f, l, o, h[15], 530742520, 16), o = Ie(o, m, f, l, h[2], 3299628645, 23), l = Te(l, o, m, f, h[0], 4096336452, 6), f = Te(f, l, o, m, h[7], 1126891415, 10), m = Te(m, f, l, o, h[14], 2878612391, 15), o = Te(o, m, f, l, h[5], 4237533241, 21), l = Te(l, o, m, f, h[12], 1700485571, 6), f = Te(f, l, o, m, h[3], 2399980690, 10), m = Te(m, f, l, o, h[10], 4293915773, 15), o = Te(o, m, f, l, h[1], 2240044497, 21), l = Te(l, o, m, f, h[8], 1873313359, 6), f = Te(f, l, o, m, h[15], 4264355552, 10), m = Te(m, f, l, o, h[6], 2734768916, 15), o = Te(o, m, f, l, h[13], 1309151649, 21), l = Te(l, o, m, f, h[4], 4149444226, 6), f = Te(f, l, o, m, h[11], 3174756917, 10), m = Te(m, f, l, o, h[2], 718787259, 15), o = Te(o, m, f, l, h[9], 3951481745, 21), this._a = this._a + l | 0, this._b = this._b + o | 0, this._c = this._c + m | 0, this._d = this._d + f | 0;
};
_n.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var h = Pu.allocUnsafe(16);
  return h.writeInt32LE(this._a, 0), h.writeInt32LE(this._b, 4), h.writeInt32LE(this._c, 8), h.writeInt32LE(this._d, 12), h;
};
function Sn(h, n) {
  return h << n | h >>> 32 - n;
}
function ke(h, n, l, o, m, f, b) {
  return Sn(h + (n & l | ~n & o) + m + f | 0, b) + n | 0;
}
function Re(h, n, l, o, m, f, b) {
  return Sn(h + (n & o | l & ~o) + m + f | 0, b) + n | 0;
}
function Ie(h, n, l, o, m, f, b) {
  return Sn(h + (n ^ l ^ o) + m + f | 0, b) + n | 0;
}
function Te(h, n, l, o, m, f, b) {
  return Sn(h + (l ^ (n | ~o)) + m + f | 0, b) + n | 0;
}
var s0 = _n, nf = ge.Buffer, Nu = Jt, gh = ph, $u = new Array(16), wi = [
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
], Mi = [
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
], xi = [
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
], _i = [
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
], Si = [0, 1518500249, 1859775393, 2400959708, 2840853838], Ai = [1352829926, 1548603684, 1836072691, 2053994217, 0];
function An() {
  gh.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
}
Nu(An, gh);
An.prototype._update = function() {
  for (var h = $u, n = 0; n < 16; ++n)
    h[n] = this._block.readInt32LE(n * 4);
  for (var l = this._a | 0, o = this._b | 0, m = this._c | 0, f = this._d | 0, b = this._e | 0, w = this._a | 0, _ = this._b | 0, S = this._c | 0, y = this._d | 0, x = this._e | 0, B = 0; B < 80; B += 1) {
    var A, T;
    B < 16 ? (A = z0(l, o, m, f, b, h[wi[B]], Si[0], xi[B]), T = W0(w, _, S, y, x, h[Mi[B]], Ai[0], _i[B])) : B < 32 ? (A = K0(l, o, m, f, b, h[wi[B]], Si[1], xi[B]), T = Z0(w, _, S, y, x, h[Mi[B]], Ai[1], _i[B])) : B < 48 ? (A = H0(l, o, m, f, b, h[wi[B]], Si[2], xi[B]), T = H0(w, _, S, y, x, h[Mi[B]], Ai[2], _i[B])) : B < 64 ? (A = Z0(l, o, m, f, b, h[wi[B]], Si[3], xi[B]), T = K0(w, _, S, y, x, h[Mi[B]], Ai[3], _i[B])) : (A = W0(l, o, m, f, b, h[wi[B]], Si[4], xi[B]), T = z0(w, _, S, y, x, h[Mi[B]], Ai[4], _i[B])), l = b, b = f, f = Zr(m, 10), m = o, o = A, w = x, x = y, y = Zr(S, 10), S = _, _ = T;
  }
  var D = this._b + m + y | 0;
  this._b = this._c + f + x | 0, this._c = this._d + b + w | 0, this._d = this._e + l + _ | 0, this._e = this._a + o + S | 0, this._a = D;
};
An.prototype._digest = function() {
  this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
  var h = nf.alloc ? nf.alloc(20) : new nf(20);
  return h.writeInt32LE(this._a, 0), h.writeInt32LE(this._b, 4), h.writeInt32LE(this._c, 8), h.writeInt32LE(this._d, 12), h.writeInt32LE(this._e, 16), h;
};
function Zr(h, n) {
  return h << n | h >>> 32 - n;
}
function z0(h, n, l, o, m, f, b, w) {
  return Zr(h + (n ^ l ^ o) + f + b | 0, w) + m | 0;
}
function K0(h, n, l, o, m, f, b, w) {
  return Zr(h + (n & l | ~n & o) + f + b | 0, w) + m | 0;
}
function H0(h, n, l, o, m, f, b, w) {
  return Zr(h + ((n | ~l) ^ o) + f + b | 0, w) + m | 0;
}
function Z0(h, n, l, o, m, f, b, w) {
  return Zr(h + (n & o | l & ~o) + f + b | 0, w) + m | 0;
}
function W0(h, n, l, o, m, f, b, w) {
  return Zr(h + (n ^ (l | ~o)) + f + b | 0, w) + m | 0;
}
var o0 = An, bh = { exports: {} }, yh = Nt.Buffer;
function Bn(h, n) {
  this._block = yh.alloc(h), this._finalSize = n, this._blockSize = h, this._len = 0;
}
Bn.prototype.update = function(h, n) {
  typeof h == "string" && (n = n || "utf8", h = yh.from(h, n));
  for (var l = this._block, o = this._blockSize, m = h.length, f = this._len, b = 0; b < m; ) {
    for (var w = f % o, _ = Math.min(m - b, o - w), S = 0; S < _; S++)
      l[w + S] = h[b + S];
    f += _, b += _, f % o === 0 && this._update(l);
  }
  return this._len += m, this;
};
Bn.prototype.digest = function(h) {
  var n = this._len % this._blockSize;
  this._block[n] = 128, this._block.fill(0, n + 1), n >= this._finalSize && (this._update(this._block), this._block.fill(0));
  var l = this._len * 8;
  if (l <= 4294967295)
    this._block.writeUInt32BE(l, this._blockSize - 4);
  else {
    var o = (l & 4294967295) >>> 0, m = (l - o) / 4294967296;
    this._block.writeUInt32BE(m, this._blockSize - 8), this._block.writeUInt32BE(o, this._blockSize - 4);
  }
  this._update(this._block);
  var f = this._hash();
  return h ? f.toString(h) : f;
};
Bn.prototype._update = function() {
  throw new Error("_update must be implemented by subclass");
};
var di = Bn, Fu = Jt, wh = di, Lu = Nt.Buffer, Ou = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], Uu = new Array(80);
function Li() {
  this.init(), this._w = Uu, wh.call(this, 64, 56);
}
Fu(Li, wh);
Li.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function zu(h) {
  return h << 5 | h >>> 27;
}
function Ku(h) {
  return h << 30 | h >>> 2;
}
function Hu(h, n, l, o) {
  return h === 0 ? n & l | ~n & o : h === 2 ? n & l | n & o | l & o : n ^ l ^ o;
}
Li.prototype._update = function(h) {
  for (var n = this._w, l = this._a | 0, o = this._b | 0, m = this._c | 0, f = this._d | 0, b = this._e | 0, w = 0; w < 16; ++w)
    n[w] = h.readInt32BE(w * 4);
  for (; w < 80; ++w)
    n[w] = n[w - 3] ^ n[w - 8] ^ n[w - 14] ^ n[w - 16];
  for (var _ = 0; _ < 80; ++_) {
    var S = ~~(_ / 20), y = zu(l) + Hu(S, o, m, f) + b + n[_] + Ou[S] | 0;
    b = f, f = m, m = Ku(o), o = l, l = y;
  }
  this._a = l + this._a | 0, this._b = o + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = b + this._e | 0;
};
Li.prototype._hash = function() {
  var h = Lu.allocUnsafe(20);
  return h.writeInt32BE(this._a | 0, 0), h.writeInt32BE(this._b | 0, 4), h.writeInt32BE(this._c | 0, 8), h.writeInt32BE(this._d | 0, 12), h.writeInt32BE(this._e | 0, 16), h;
};
var Zu = Li, Wu = Jt, Mh = di, Vu = Nt.Buffer, Yu = [
  1518500249,
  1859775393,
  -1894007588,
  -899497514
], Ju = new Array(80);
function Oi() {
  this.init(), this._w = Ju, Mh.call(this, 64, 56);
}
Wu(Oi, Mh);
Oi.prototype.init = function() {
  return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
};
function Gu(h) {
  return h << 1 | h >>> 31;
}
function Xu(h) {
  return h << 5 | h >>> 27;
}
function ju(h) {
  return h << 30 | h >>> 2;
}
function Qu(h, n, l, o) {
  return h === 0 ? n & l | ~n & o : h === 2 ? n & l | n & o | l & o : n ^ l ^ o;
}
Oi.prototype._update = function(h) {
  for (var n = this._w, l = this._a | 0, o = this._b | 0, m = this._c | 0, f = this._d | 0, b = this._e | 0, w = 0; w < 16; ++w)
    n[w] = h.readInt32BE(w * 4);
  for (; w < 80; ++w)
    n[w] = Gu(n[w - 3] ^ n[w - 8] ^ n[w - 14] ^ n[w - 16]);
  for (var _ = 0; _ < 80; ++_) {
    var S = ~~(_ / 20), y = Xu(l) + Qu(S, o, m, f) + b + n[_] + Yu[S] | 0;
    b = f, f = m, m = ju(o), o = l, l = y;
  }
  this._a = l + this._a | 0, this._b = o + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = b + this._e | 0;
};
Oi.prototype._hash = function() {
  var h = Vu.allocUnsafe(20);
  return h.writeInt32BE(this._a | 0, 0), h.writeInt32BE(this._b | 0, 4), h.writeInt32BE(this._c | 0, 8), h.writeInt32BE(this._d | 0, 12), h.writeInt32BE(this._e | 0, 16), h;
};
var tl = Oi, el = Jt, xh = di, rl = Nt.Buffer, il = [
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
], nl = new Array(64);
function Ui() {
  this.init(), this._w = nl, xh.call(this, 64, 56);
}
el(Ui, xh);
Ui.prototype.init = function() {
  return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
};
function fl(h, n, l) {
  return l ^ h & (n ^ l);
}
function al(h, n, l) {
  return h & n | l & (h | n);
}
function hl(h) {
  return (h >>> 2 | h << 30) ^ (h >>> 13 | h << 19) ^ (h >>> 22 | h << 10);
}
function sl(h) {
  return (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
}
function ol(h) {
  return (h >>> 7 | h << 25) ^ (h >>> 18 | h << 14) ^ h >>> 3;
}
function ul(h) {
  return (h >>> 17 | h << 15) ^ (h >>> 19 | h << 13) ^ h >>> 10;
}
Ui.prototype._update = function(h) {
  for (var n = this._w, l = this._a | 0, o = this._b | 0, m = this._c | 0, f = this._d | 0, b = this._e | 0, w = this._f | 0, _ = this._g | 0, S = this._h | 0, y = 0; y < 16; ++y)
    n[y] = h.readInt32BE(y * 4);
  for (; y < 64; ++y)
    n[y] = ul(n[y - 2]) + n[y - 7] + ol(n[y - 15]) + n[y - 16] | 0;
  for (var x = 0; x < 64; ++x) {
    var B = S + sl(b) + fl(b, w, _) + il[x] + n[x] | 0, A = hl(l) + al(l, o, m) | 0;
    S = _, _ = w, w = b, b = f + B | 0, f = m, m = o, o = l, l = B + A | 0;
  }
  this._a = l + this._a | 0, this._b = o + this._b | 0, this._c = m + this._c | 0, this._d = f + this._d | 0, this._e = b + this._e | 0, this._f = w + this._f | 0, this._g = _ + this._g | 0, this._h = S + this._h | 0;
};
Ui.prototype._hash = function() {
  var h = rl.allocUnsafe(32);
  return h.writeInt32BE(this._a, 0), h.writeInt32BE(this._b, 4), h.writeInt32BE(this._c, 8), h.writeInt32BE(this._d, 12), h.writeInt32BE(this._e, 16), h.writeInt32BE(this._f, 20), h.writeInt32BE(this._g, 24), h.writeInt32BE(this._h, 28), h;
};
var _h = Ui, ll = Jt, dl = _h, cl = di, vl = Nt.Buffer, pl = new Array(64);
function En() {
  this.init(), this._w = pl, cl.call(this, 64, 56);
}
ll(En, dl);
En.prototype.init = function() {
  return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
};
En.prototype._hash = function() {
  var h = vl.allocUnsafe(28);
  return h.writeInt32BE(this._a, 0), h.writeInt32BE(this._b, 4), h.writeInt32BE(this._c, 8), h.writeInt32BE(this._d, 12), h.writeInt32BE(this._e, 16), h.writeInt32BE(this._f, 20), h.writeInt32BE(this._g, 24), h;
};
var ml = En, gl = Jt, Sh = di, bl = Nt.Buffer, V0 = [
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
], yl = new Array(160);
function zi() {
  this.init(), this._w = yl, Sh.call(this, 128, 112);
}
gl(zi, Sh);
zi.prototype.init = function() {
  return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
};
function Y0(h, n, l) {
  return l ^ h & (n ^ l);
}
function J0(h, n, l) {
  return h & n | l & (h | n);
}
function G0(h, n) {
  return (h >>> 28 | n << 4) ^ (n >>> 2 | h << 30) ^ (n >>> 7 | h << 25);
}
function X0(h, n) {
  return (h >>> 14 | n << 18) ^ (h >>> 18 | n << 14) ^ (n >>> 9 | h << 23);
}
function wl(h, n) {
  return (h >>> 1 | n << 31) ^ (h >>> 8 | n << 24) ^ h >>> 7;
}
function Ml(h, n) {
  return (h >>> 1 | n << 31) ^ (h >>> 8 | n << 24) ^ (h >>> 7 | n << 25);
}
function xl(h, n) {
  return (h >>> 19 | n << 13) ^ (n >>> 29 | h << 3) ^ h >>> 6;
}
function _l(h, n) {
  return (h >>> 19 | n << 13) ^ (n >>> 29 | h << 3) ^ (h >>> 6 | n << 26);
}
function xe(h, n) {
  return h >>> 0 < n >>> 0 ? 1 : 0;
}
zi.prototype._update = function(h) {
  for (var n = this._w, l = this._ah | 0, o = this._bh | 0, m = this._ch | 0, f = this._dh | 0, b = this._eh | 0, w = this._fh | 0, _ = this._gh | 0, S = this._hh | 0, y = this._al | 0, x = this._bl | 0, B = this._cl | 0, A = this._dl | 0, T = this._el | 0, D = this._fl | 0, O = this._gl | 0, N = this._hl | 0, q = 0; q < 32; q += 2)
    n[q] = h.readInt32BE(q * 4), n[q + 1] = h.readInt32BE(q * 4 + 4);
  for (; q < 160; q += 2) {
    var ft = n[q - 30], F = n[q - 15 * 2 + 1], _t = wl(ft, F), St = Ml(F, ft);
    ft = n[q - 2 * 2], F = n[q - 2 * 2 + 1];
    var kt = xl(ft, F), At = _l(F, ft), U = n[q - 7 * 2], Et = n[q - 7 * 2 + 1], p = n[q - 16 * 2], t = n[q - 16 * 2 + 1], r = St + Et | 0, i = _t + U + xe(r, St) | 0;
    r = r + At | 0, i = i + kt + xe(r, At) | 0, r = r + t | 0, i = i + p + xe(r, t) | 0, n[q] = i, n[q + 1] = r;
  }
  for (var a = 0; a < 160; a += 2) {
    i = n[a], r = n[a + 1];
    var d = J0(l, o, m), c = J0(y, x, B), v = G0(l, y), s = G0(y, l), e = X0(b, T), u = X0(T, b), g = V0[a], M = V0[a + 1], k = Y0(b, w, _), R = Y0(T, D, O), P = N + u | 0, E = S + e + xe(P, N) | 0;
    P = P + R | 0, E = E + k + xe(P, R) | 0, P = P + M | 0, E = E + g + xe(P, M) | 0, P = P + r | 0, E = E + i + xe(P, r) | 0;
    var I = s + c | 0, C = v + d + xe(I, s) | 0;
    S = _, N = O, _ = w, O = D, w = b, D = T, T = A + P | 0, b = f + E + xe(T, A) | 0, f = m, A = B, m = o, B = x, o = l, x = y, y = P + I | 0, l = E + C + xe(y, P) | 0;
  }
  this._al = this._al + y | 0, this._bl = this._bl + x | 0, this._cl = this._cl + B | 0, this._dl = this._dl + A | 0, this._el = this._el + T | 0, this._fl = this._fl + D | 0, this._gl = this._gl + O | 0, this._hl = this._hl + N | 0, this._ah = this._ah + l + xe(this._al, y) | 0, this._bh = this._bh + o + xe(this._bl, x) | 0, this._ch = this._ch + m + xe(this._cl, B) | 0, this._dh = this._dh + f + xe(this._dl, A) | 0, this._eh = this._eh + b + xe(this._el, T) | 0, this._fh = this._fh + w + xe(this._fl, D) | 0, this._gh = this._gh + _ + xe(this._gl, O) | 0, this._hh = this._hh + S + xe(this._hl, N) | 0;
};
zi.prototype._hash = function() {
  var h = bl.allocUnsafe(64);
  function n(l, o, m) {
    h.writeInt32BE(l, m), h.writeInt32BE(o, m + 4);
  }
  return n(this._ah, this._al, 0), n(this._bh, this._bl, 8), n(this._ch, this._cl, 16), n(this._dh, this._dl, 24), n(this._eh, this._el, 32), n(this._fh, this._fl, 40), n(this._gh, this._gl, 48), n(this._hh, this._hl, 56), h;
};
var Ah = zi, Sl = Jt, Al = Ah, Bl = di, El = Nt.Buffer, kl = new Array(160);
function kn() {
  this.init(), this._w = kl, Bl.call(this, 128, 112);
}
Sl(kn, Al);
kn.prototype.init = function() {
  return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
};
kn.prototype._hash = function() {
  var h = El.allocUnsafe(48);
  function n(l, o, m) {
    h.writeInt32BE(l, m), h.writeInt32BE(o, m + 4);
  }
  return n(this._ah, this._al, 0), n(this._bh, this._bl, 8), n(this._ch, this._cl, 16), n(this._dh, this._dl, 24), n(this._eh, this._el, 32), n(this._fh, this._fl, 40), h;
};
var Rl = kn, Jr = bh.exports = function(n) {
  n = n.toLowerCase();
  var l = Jr[n];
  if (!l)
    throw new Error(n + " is not supported (we accept pull requests)");
  return new l();
};
Jr.sha = Zu;
Jr.sha1 = tl;
Jr.sha224 = ml;
Jr.sha256 = _h;
Jr.sha384 = Rl;
Jr.sha512 = Ah;
var u0 = bh.exports, pn = {}, Zf = { exports: {} };
(function(h, n) {
  var l = ge, o = l.Buffer;
  function m(b, w) {
    for (var _ in b)
      w[_] = b[_];
  }
  o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? h.exports = l : (m(l, n), n.Buffer = f);
  function f(b, w, _) {
    return o(b, w, _);
  }
  m(o, f), f.from = function(b, w, _) {
    if (typeof b == "number")
      throw new TypeError("Argument must not be a number");
    return o(b, w, _);
  }, f.alloc = function(b, w, _) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    var S = o(b);
    return w !== void 0 ? typeof _ == "string" ? S.fill(w, _) : S.fill(w) : S.fill(0), S;
  }, f.allocUnsafe = function(b) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    return o(b);
  }, f.allocUnsafeSlow = function(b) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    return l.SlowBuffer(b);
  };
})(Zf, Zf.exports);
var Il = Zf.exports, l0 = Il.Buffer, j0 = l0.isEncoding || function(h) {
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
function Tl(h) {
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
function Cl(h) {
  var n = Tl(h);
  if (typeof n != "string" && (l0.isEncoding === j0 || !j0(h)))
    throw new Error("Unknown encoding: " + h);
  return n || h;
}
pn.StringDecoder = Ki;
function Ki(h) {
  this.encoding = Cl(h);
  var n;
  switch (this.encoding) {
    case "utf16le":
      this.text = Fl, this.end = Ll, n = 4;
      break;
    case "utf8":
      this.fillLast = Dl, n = 4;
      break;
    case "base64":
      this.text = Ol, this.end = Ul, n = 3;
      break;
    default:
      this.write = zl, this.end = Kl;
      return;
  }
  this.lastNeed = 0, this.lastTotal = 0, this.lastChar = l0.allocUnsafe(n);
}
Ki.prototype.write = function(h) {
  if (h.length === 0)
    return "";
  var n, l;
  if (this.lastNeed) {
    if (n = this.fillLast(h), n === void 0)
      return "";
    l = this.lastNeed, this.lastNeed = 0;
  } else
    l = 0;
  return l < h.length ? n ? n + this.text(h, l) : this.text(h, l) : n || "";
};
Ki.prototype.end = $l;
Ki.prototype.text = Nl;
Ki.prototype.fillLast = function(h) {
  if (this.lastNeed <= h.length)
    return h.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  h.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, h.length), this.lastNeed -= h.length;
};
function ff(h) {
  return h <= 127 ? 0 : h >> 5 === 6 ? 2 : h >> 4 === 14 ? 3 : h >> 3 === 30 ? 4 : h >> 6 === 2 ? -1 : -2;
}
function ql(h, n, l) {
  var o = n.length - 1;
  if (o < l)
    return 0;
  var m = ff(n[o]);
  return m >= 0 ? (m > 0 && (h.lastNeed = m - 1), m) : --o < l || m === -2 ? 0 : (m = ff(n[o]), m >= 0 ? (m > 0 && (h.lastNeed = m - 2), m) : --o < l || m === -2 ? 0 : (m = ff(n[o]), m >= 0 ? (m > 0 && (m === 2 ? m = 0 : h.lastNeed = m - 3), m) : 0));
}
function Pl(h, n, l) {
  if ((n[0] & 192) !== 128)
    return h.lastNeed = 0, "�";
  if (h.lastNeed > 1 && n.length > 1) {
    if ((n[1] & 192) !== 128)
      return h.lastNeed = 1, "�";
    if (h.lastNeed > 2 && n.length > 2 && (n[2] & 192) !== 128)
      return h.lastNeed = 2, "�";
  }
}
function Dl(h) {
  var n = this.lastTotal - this.lastNeed, l = Pl(this, h);
  if (l !== void 0)
    return l;
  if (this.lastNeed <= h.length)
    return h.copy(this.lastChar, n, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
  h.copy(this.lastChar, n, 0, h.length), this.lastNeed -= h.length;
}
function Nl(h, n) {
  var l = ql(this, h, n);
  if (!this.lastNeed)
    return h.toString("utf8", n);
  this.lastTotal = l;
  var o = h.length - (l - this.lastNeed);
  return h.copy(this.lastChar, 0, o), h.toString("utf8", n, o);
}
function $l(h) {
  var n = h && h.length ? this.write(h) : "";
  return this.lastNeed ? n + "�" : n;
}
function Fl(h, n) {
  if ((h.length - n) % 2 === 0) {
    var l = h.toString("utf16le", n);
    if (l) {
      var o = l.charCodeAt(l.length - 1);
      if (o >= 55296 && o <= 56319)
        return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = h[h.length - 2], this.lastChar[1] = h[h.length - 1], l.slice(0, -1);
    }
    return l;
  }
  return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = h[h.length - 1], h.toString("utf16le", n, h.length - 1);
}
function Ll(h) {
  var n = h && h.length ? this.write(h) : "";
  if (this.lastNeed) {
    var l = this.lastTotal - this.lastNeed;
    return n + this.lastChar.toString("utf16le", 0, l);
  }
  return n;
}
function Ol(h, n) {
  var l = (h.length - n) % 3;
  return l === 0 ? h.toString("base64", n) : (this.lastNeed = 3 - l, this.lastTotal = 3, l === 1 ? this.lastChar[0] = h[h.length - 1] : (this.lastChar[0] = h[h.length - 2], this.lastChar[1] = h[h.length - 1]), h.toString("base64", n, h.length - l));
}
function Ul(h) {
  var n = h && h.length ? this.write(h) : "";
  return this.lastNeed ? n + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : n;
}
function zl(h) {
  return h.toString(this.encoding);
}
function Kl(h) {
  return h && h.length ? this.write(h) : "";
}
var ir = Nt.Buffer, Bh = ge.Transform, Hl = pn.StringDecoder, Zl = Jt;
function je(h) {
  Bh.call(this), this.hashMode = typeof h == "string", this.hashMode ? this[h] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
}
Zl(je, Bh);
var Wl = typeof Uint8Array < "u", Vl = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && ArrayBuffer.isView && (ir.prototype instanceof Uint8Array || ir.TYPED_ARRAY_SUPPORT);
function Yl(h, n) {
  if (h instanceof ir)
    return h;
  if (typeof h == "string")
    return ir.from(h, n);
  if (Vl && ArrayBuffer.isView(h)) {
    if (h.byteLength === 0)
      return ir.alloc(0);
    var l = ir.from(h.buffer, h.byteOffset, h.byteLength);
    if (l.byteLength === h.byteLength)
      return l;
  }
  if (Wl && h instanceof Uint8Array || ir.isBuffer(h) && h.constructor && typeof h.constructor.isBuffer == "function" && h.constructor.isBuffer(h))
    return ir.from(h);
  throw new TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.');
}
je.prototype.update = function(h, n, l) {
  var o = Yl(h, n), m = this._update(o);
  return this.hashMode ? this : (l && (m = this._toString(m, l)), m);
};
je.prototype.setAutoPadding = function() {
};
je.prototype.getAuthTag = function() {
  throw new Error("trying to get auth tag in unsupported state");
};
je.prototype.setAuthTag = function() {
  throw new Error("trying to set auth tag in unsupported state");
};
je.prototype.setAAD = function() {
  throw new Error("trying to set aad in unsupported state");
};
je.prototype._transform = function(h, n, l) {
  var o;
  try {
    this.hashMode ? this._update(h) : this.push(this._update(h));
  } catch (m) {
    o = m;
  } finally {
    l(o);
  }
};
je.prototype._flush = function(h) {
  var n;
  try {
    this.push(this.__final());
  } catch (l) {
    n = l;
  }
  h(n);
};
je.prototype._finalOrDigest = function(h) {
  var n = this.__final() || ir.alloc(0);
  return h && (n = this._toString(n, h, !0)), n;
};
je.prototype._toString = function(h, n, l) {
  if (this._decoder || (this._decoder = new Hl(n), this._encoding = n), this._encoding !== n)
    throw new Error("can’t switch encodings");
  var o = this._decoder.write(h);
  return l && (o += this._decoder.end()), o;
};
var qr = je, Jl = Jt, Gl = s0, Xl = o0, jl = u0, Eh = qr;
function Rn(h) {
  Eh.call(this, "digest"), this._hash = h;
}
Jl(Rn, Eh);
Rn.prototype._update = function(h) {
  this._hash.update(h);
};
Rn.prototype._final = function() {
  return this._hash.digest();
};
var Hi = function(n) {
  return n = n.toLowerCase(), n === "md5" ? new Gl() : n === "rmd160" || n === "ripemd160" ? new Xl() : new Rn(jl(n));
}, Ql = Jt, Ur = Nt.Buffer, kh = qr, td = Ur.alloc(128), jr = 64;
function In(h, n) {
  kh.call(this, "digest"), typeof n == "string" && (n = Ur.from(n)), this._alg = h, this._key = n, n.length > jr ? n = h(n) : n.length < jr && (n = Ur.concat([n, td], jr));
  for (var l = this._ipad = Ur.allocUnsafe(jr), o = this._opad = Ur.allocUnsafe(jr), m = 0; m < jr; m++)
    l[m] = n[m] ^ 54, o[m] = n[m] ^ 92;
  this._hash = [l];
}
Ql(In, kh);
In.prototype._update = function(h) {
  this._hash.push(h);
};
In.prototype._final = function() {
  var h = this._alg(Ur.concat(this._hash));
  return this._alg(Ur.concat([this._opad, h]));
};
var ed = In, rd = s0, Rh = function(h) {
  return new rd().update(h).digest();
}, id = Jt, nd = ed, Ih = qr, Ri = Nt.Buffer, fd = Rh, Wf = o0, Vf = u0, ad = Ri.alloc(128);
function Di(h, n) {
  Ih.call(this, "digest"), typeof n == "string" && (n = Ri.from(n));
  var l = h === "sha512" || h === "sha384" ? 128 : 64;
  if (this._alg = h, this._key = n, n.length > l) {
    var o = h === "rmd160" ? new Wf() : Vf(h);
    n = o.update(n).digest();
  } else
    n.length < l && (n = Ri.concat([n, ad], l));
  for (var m = this._ipad = Ri.allocUnsafe(l), f = this._opad = Ri.allocUnsafe(l), b = 0; b < l; b++)
    m[b] = n[b] ^ 54, f[b] = n[b] ^ 92;
  this._hash = h === "rmd160" ? new Wf() : Vf(h), this._hash.update(m);
}
id(Di, Ih);
Di.prototype._update = function(h) {
  this._hash.update(h);
};
Di.prototype._final = function() {
  var h = this._hash.digest(), n = this._alg === "rmd160" ? new Wf() : Vf(this._alg);
  return n.update(this._opad).update(h).digest();
};
var Th = function(n, l) {
  return n = n.toLowerCase(), n === "rmd160" || n === "ripemd160" ? new Di("rmd160", l) : n === "md5" ? new nd(fd, l) : new Di(n, l);
};
const hd = {
  sign: "rsa",
  hash: "sha224",
  id: "302d300d06096086480165030402040500041c"
}, sd = {
  sign: "rsa",
  hash: "sha256",
  id: "3031300d060960864801650304020105000420"
}, od = {
  sign: "rsa",
  hash: "sha384",
  id: "3041300d060960864801650304020205000430"
}, ud = {
  sign: "rsa",
  hash: "sha512",
  id: "3051300d060960864801650304020305000440"
}, ld = {
  sign: "ecdsa",
  hash: "sha256",
  id: ""
}, dd = {
  sign: "ecdsa",
  hash: "sha224",
  id: ""
}, cd = {
  sign: "ecdsa",
  hash: "sha384",
  id: ""
}, vd = {
  sign: "ecdsa",
  hash: "sha512",
  id: ""
}, pd = {
  sign: "dsa",
  hash: "sha1",
  id: ""
}, md = {
  sign: "rsa",
  hash: "rmd160",
  id: "3021300906052b2403020105000414"
}, gd = {
  sign: "rsa",
  hash: "md5",
  id: "3020300c06082a864886f70d020505000410"
}, Ch = {
  sha224WithRSAEncryption: hd,
  "RSA-SHA224": {
    sign: "ecdsa/rsa",
    hash: "sha224",
    id: "302d300d06096086480165030402040500041c"
  },
  sha256WithRSAEncryption: sd,
  "RSA-SHA256": {
    sign: "ecdsa/rsa",
    hash: "sha256",
    id: "3031300d060960864801650304020105000420"
  },
  sha384WithRSAEncryption: od,
  "RSA-SHA384": {
    sign: "ecdsa/rsa",
    hash: "sha384",
    id: "3041300d060960864801650304020205000430"
  },
  sha512WithRSAEncryption: ud,
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
  sha256: ld,
  sha224: dd,
  sha384: cd,
  sha512: vd,
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
  DSA: pd,
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
  ripemd160WithRSA: md,
  "RSA-RIPEMD160": {
    sign: "rsa",
    hash: "rmd160",
    id: "3021300906052b2403020105000414"
  },
  md5WithRSAEncryption: gd,
  "RSA-MD5": {
    sign: "rsa",
    hash: "md5",
    id: "3020300c06082a864886f70d020505000410"
  }
};
var bd = Ch, Tn = {}, yd = Math.pow(2, 30) - 1, qh = function(h, n) {
  if (typeof h != "number")
    throw new TypeError("Iterations not a number");
  if (h < 0)
    throw new TypeError("Bad iterations");
  if (typeof n != "number")
    throw new TypeError("Key length not a number");
  if (n < 0 || n > yd || n !== n)
    throw new TypeError("Bad key length");
}, un;
if (Gt.process && Gt.process.browser)
  un = "utf-8";
else if (Gt.process && Gt.process.version) {
  var wd = parseInt(ye.version.split(".")[0].slice(1), 10);
  un = wd >= 6 ? "utf-8" : "binary";
} else
  un = "utf-8";
var Ph = un, af = Nt.Buffer, Dh = function(h, n, l) {
  if (af.isBuffer(h))
    return h;
  if (typeof h == "string")
    return af.from(h, n);
  if (ArrayBuffer.isView(h))
    return af.from(h.buffer);
  throw new TypeError(l + " must be a string, a Buffer, a typed array or a DataView");
}, Md = Rh, xd = o0, _d = u0, zr = Nt.Buffer, Sd = qh, Q0 = Ph, ta = Dh, Ad = zr.alloc(128), ln = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
};
function Nh(h, n, l) {
  var o = Bd(h), m = h === "sha512" || h === "sha384" ? 128 : 64;
  n.length > m ? n = o(n) : n.length < m && (n = zr.concat([n, Ad], m));
  for (var f = zr.allocUnsafe(m + ln[h]), b = zr.allocUnsafe(m + ln[h]), w = 0; w < m; w++)
    f[w] = n[w] ^ 54, b[w] = n[w] ^ 92;
  var _ = zr.allocUnsafe(m + l + 4);
  f.copy(_, 0, 0, m), this.ipad1 = _, this.ipad2 = f, this.opad = b, this.alg = h, this.blocksize = m, this.hash = o, this.size = ln[h];
}
Nh.prototype.run = function(h, n) {
  h.copy(n, this.blocksize);
  var l = this.hash(n);
  return l.copy(this.opad, this.blocksize), this.hash(this.opad);
};
function Bd(h) {
  function n(o) {
    return _d(h).update(o).digest();
  }
  function l(o) {
    return new xd().update(o).digest();
  }
  return h === "rmd160" || h === "ripemd160" ? l : h === "md5" ? Md : n;
}
function Ed(h, n, l, o, m) {
  Sd(l, o), h = ta(h, Q0, "Password"), n = ta(n, Q0, "Salt"), m = m || "sha1";
  var f = new Nh(m, h, n.length), b = zr.allocUnsafe(o), w = zr.allocUnsafe(n.length + 4);
  n.copy(w, 0, 0, n.length);
  for (var _ = 0, S = ln[m], y = Math.ceil(o / S), x = 1; x <= y; x++) {
    w.writeUInt32BE(x, n.length);
    for (var B = f.run(w, f.ipad1), A = B, T = 1; T < l; T++) {
      A = f.run(A, f.ipad2);
      for (var D = 0; D < S; D++)
        B[D] ^= A[D];
    }
    B.copy(b, _), _ += S;
  }
  return b;
}
var $h = Ed, Fh = Nt.Buffer, kd = qh, ea = Ph, ra = $h, ia = Dh, tn, Ci = Gt.crypto && Gt.crypto.subtle, Rd = {
  sha: "SHA-1",
  "sha-1": "SHA-1",
  sha1: "SHA-1",
  sha256: "SHA-256",
  "sha-256": "SHA-256",
  sha384: "SHA-384",
  "sha-384": "SHA-384",
  "sha-512": "SHA-512",
  sha512: "SHA-512"
}, hf = [];
function Id(h) {
  if (Gt.process && !Gt.process.browser || !Ci || !Ci.importKey || !Ci.deriveBits)
    return Promise.resolve(!1);
  if (hf[h] !== void 0)
    return hf[h];
  tn = tn || Fh.alloc(8);
  var n = Lh(tn, tn, 10, 128, h).then(function() {
    return !0;
  }).catch(function() {
    return !1;
  });
  return hf[h] = n, n;
}
var Dr;
function Yf() {
  return Dr || (Gt.process && Gt.process.nextTick ? Dr = Gt.process.nextTick : Gt.queueMicrotask ? Dr = Gt.queueMicrotask : Gt.setImmediate ? Dr = Gt.setImmediate : Dr = Gt.setTimeout, Dr);
}
function Lh(h, n, l, o, m) {
  return Ci.importKey(
    "raw",
    h,
    { name: "PBKDF2" },
    !1,
    ["deriveBits"]
  ).then(function(f) {
    return Ci.deriveBits({
      name: "PBKDF2",
      salt: n,
      iterations: l,
      hash: {
        name: m
      }
    }, f, o << 3);
  }).then(function(f) {
    return Fh.from(f);
  });
}
function Td(h, n) {
  h.then(function(l) {
    Yf()(function() {
      n(null, l);
    });
  }, function(l) {
    Yf()(function() {
      n(l);
    });
  });
}
var Cd = function(h, n, l, o, m, f) {
  typeof m == "function" && (f = m, m = void 0), m = m || "sha1";
  var b = Rd[m.toLowerCase()];
  if (!b || typeof Gt.Promise != "function") {
    Yf()(function() {
      var w;
      try {
        w = ra(h, n, l, o, m);
      } catch (_) {
        return f(_);
      }
      f(null, w);
    });
    return;
  }
  if (kd(l, o), h = ia(h, ea, "Password"), n = ia(n, ea, "Salt"), typeof f != "function")
    throw new Error("No callback provided to pbkdf2");
  Td(Id(b).then(function(w) {
    return w ? Lh(h, n, l, o, b) : ra(h, n, l, o, m);
  }), f);
};
Tn.pbkdf2 = Cd;
Tn.pbkdf2Sync = $h;
var Ge = {}, ci = {}, Le = {};
Le.readUInt32BE = function(n, l) {
  var o = n[0 + l] << 24 | n[1 + l] << 16 | n[2 + l] << 8 | n[3 + l];
  return o >>> 0;
};
Le.writeUInt32BE = function(n, l, o) {
  n[0 + o] = l >>> 24, n[1 + o] = l >>> 16 & 255, n[2 + o] = l >>> 8 & 255, n[3 + o] = l & 255;
};
Le.ip = function(n, l, o, m) {
  for (var f = 0, b = 0, w = 6; w >= 0; w -= 2) {
    for (var _ = 0; _ <= 24; _ += 8)
      f <<= 1, f |= l >>> _ + w & 1;
    for (var _ = 0; _ <= 24; _ += 8)
      f <<= 1, f |= n >>> _ + w & 1;
  }
  for (var w = 6; w >= 0; w -= 2) {
    for (var _ = 1; _ <= 25; _ += 8)
      b <<= 1, b |= l >>> _ + w & 1;
    for (var _ = 1; _ <= 25; _ += 8)
      b <<= 1, b |= n >>> _ + w & 1;
  }
  o[m + 0] = f >>> 0, o[m + 1] = b >>> 0;
};
Le.rip = function(n, l, o, m) {
  for (var f = 0, b = 0, w = 0; w < 4; w++)
    for (var _ = 24; _ >= 0; _ -= 8)
      f <<= 1, f |= l >>> _ + w & 1, f <<= 1, f |= n >>> _ + w & 1;
  for (var w = 4; w < 8; w++)
    for (var _ = 24; _ >= 0; _ -= 8)
      b <<= 1, b |= l >>> _ + w & 1, b <<= 1, b |= n >>> _ + w & 1;
  o[m + 0] = f >>> 0, o[m + 1] = b >>> 0;
};
Le.pc1 = function(n, l, o, m) {
  for (var f = 0, b = 0, w = 7; w >= 5; w--) {
    for (var _ = 0; _ <= 24; _ += 8)
      f <<= 1, f |= l >> _ + w & 1;
    for (var _ = 0; _ <= 24; _ += 8)
      f <<= 1, f |= n >> _ + w & 1;
  }
  for (var _ = 0; _ <= 24; _ += 8)
    f <<= 1, f |= l >> _ + w & 1;
  for (var w = 1; w <= 3; w++) {
    for (var _ = 0; _ <= 24; _ += 8)
      b <<= 1, b |= l >> _ + w & 1;
    for (var _ = 0; _ <= 24; _ += 8)
      b <<= 1, b |= n >> _ + w & 1;
  }
  for (var _ = 0; _ <= 24; _ += 8)
    b <<= 1, b |= n >> _ + w & 1;
  o[m + 0] = f >>> 0, o[m + 1] = b >>> 0;
};
Le.r28shl = function(n, l) {
  return n << l & 268435455 | n >>> 28 - l;
};
var en = [
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
Le.pc2 = function(n, l, o, m) {
  for (var f = 0, b = 0, w = en.length >>> 1, _ = 0; _ < w; _++)
    f <<= 1, f |= n >>> en[_] & 1;
  for (var _ = w; _ < en.length; _++)
    b <<= 1, b |= l >>> en[_] & 1;
  o[m + 0] = f >>> 0, o[m + 1] = b >>> 0;
};
Le.expand = function(n, l, o) {
  var m = 0, f = 0;
  m = (n & 1) << 5 | n >>> 27;
  for (var b = 23; b >= 15; b -= 4)
    m <<= 6, m |= n >>> b & 63;
  for (var b = 11; b >= 3; b -= 4)
    f |= n >>> b & 63, f <<= 6;
  f |= (n & 31) << 1 | n >>> 31, l[o + 0] = m >>> 0, l[o + 1] = f >>> 0;
};
var na = [
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
Le.substitute = function(n, l) {
  for (var o = 0, m = 0; m < 4; m++) {
    var f = n >>> 18 - m * 6 & 63, b = na[m * 64 + f];
    o <<= 4, o |= b;
  }
  for (var m = 0; m < 4; m++) {
    var f = l >>> 18 - m * 6 & 63, b = na[4 * 64 + m * 64 + f];
    o <<= 4, o |= b;
  }
  return o >>> 0;
};
var fa = [
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
Le.permute = function(n) {
  for (var l = 0, o = 0; o < fa.length; o++)
    l <<= 1, l |= n >>> fa[o] & 1;
  return l >>> 0;
};
Le.padSplit = function(n, l, o) {
  for (var m = n.toString(2); m.length < l; )
    m = "0" + m;
  for (var f = [], b = 0; b < l; b += o)
    f.push(m.slice(b, b + o));
  return f.join(" ");
};
var Ke = Oh;
function Oh(h, n) {
  if (!h)
    throw new Error(n || "Assertion failed");
}
Oh.equal = function(n, l, o) {
  if (n != l)
    throw new Error(o || "Assertion failed: " + n + " != " + l);
};
var qd = Ke;
function He(h) {
  this.options = h, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0, this.padding = h.padding !== !1;
}
var d0 = He;
He.prototype._init = function() {
};
He.prototype.update = function(n) {
  return n.length === 0 ? [] : this.type === "decrypt" ? this._updateDecrypt(n) : this._updateEncrypt(n);
};
He.prototype._buffer = function(n, l) {
  for (var o = Math.min(this.buffer.length - this.bufferOff, n.length - l), m = 0; m < o; m++)
    this.buffer[this.bufferOff + m] = n[l + m];
  return this.bufferOff += o, o;
};
He.prototype._flushBuffer = function(n, l) {
  return this._update(this.buffer, 0, n, l), this.bufferOff = 0, this.blockSize;
};
He.prototype._updateEncrypt = function(n) {
  var l = 0, o = 0, m = (this.bufferOff + n.length) / this.blockSize | 0, f = new Array(m * this.blockSize);
  this.bufferOff !== 0 && (l += this._buffer(n, l), this.bufferOff === this.buffer.length && (o += this._flushBuffer(f, o)));
  for (var b = n.length - (n.length - l) % this.blockSize; l < b; l += this.blockSize)
    this._update(n, l, f, o), o += this.blockSize;
  for (; l < n.length; l++, this.bufferOff++)
    this.buffer[this.bufferOff] = n[l];
  return f;
};
He.prototype._updateDecrypt = function(n) {
  for (var l = 0, o = 0, m = Math.ceil((this.bufferOff + n.length) / this.blockSize) - 1, f = new Array(m * this.blockSize); m > 0; m--)
    l += this._buffer(n, l), o += this._flushBuffer(f, o);
  return l += this._buffer(n, l), f;
};
He.prototype.final = function(n) {
  var l;
  n && (l = this.update(n));
  var o;
  return this.type === "encrypt" ? o = this._finalEncrypt() : o = this._finalDecrypt(), l ? l.concat(o) : o;
};
He.prototype._pad = function(n, l) {
  if (l === 0)
    return !1;
  for (; l < n.length; )
    n[l++] = 0;
  return !0;
};
He.prototype._finalEncrypt = function() {
  if (!this._pad(this.buffer, this.bufferOff))
    return [];
  var n = new Array(this.blockSize);
  return this._update(this.buffer, 0, n, 0), n;
};
He.prototype._unpad = function(n) {
  return n;
};
He.prototype._finalDecrypt = function() {
  qd.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
  var n = new Array(this.blockSize);
  return this._flushBuffer(n, 0), this._unpad(n);
};
var Uh = Ke, Pd = Jt, Me = Le, zh = d0;
function Dd() {
  this.tmp = new Array(2), this.keys = null;
}
function sr(h) {
  zh.call(this, h);
  var n = new Dd();
  this._desState = n, this.deriveKeys(n, h.key);
}
Pd(sr, zh);
var Kh = sr;
sr.create = function(n) {
  return new sr(n);
};
var Nd = [
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
sr.prototype.deriveKeys = function(n, l) {
  n.keys = new Array(16 * 2), Uh.equal(l.length, this.blockSize, "Invalid key length");
  var o = Me.readUInt32BE(l, 0), m = Me.readUInt32BE(l, 4);
  Me.pc1(o, m, n.tmp, 0), o = n.tmp[0], m = n.tmp[1];
  for (var f = 0; f < n.keys.length; f += 2) {
    var b = Nd[f >>> 1];
    o = Me.r28shl(o, b), m = Me.r28shl(m, b), Me.pc2(o, m, n.keys, f);
  }
};
sr.prototype._update = function(n, l, o, m) {
  var f = this._desState, b = Me.readUInt32BE(n, l), w = Me.readUInt32BE(n, l + 4);
  Me.ip(b, w, f.tmp, 0), b = f.tmp[0], w = f.tmp[1], this.type === "encrypt" ? this._encrypt(f, b, w, f.tmp, 0) : this._decrypt(f, b, w, f.tmp, 0), b = f.tmp[0], w = f.tmp[1], Me.writeUInt32BE(o, b, m), Me.writeUInt32BE(o, w, m + 4);
};
sr.prototype._pad = function(n, l) {
  if (this.padding === !1)
    return !1;
  for (var o = n.length - l, m = l; m < n.length; m++)
    n[m] = o;
  return !0;
};
sr.prototype._unpad = function(n) {
  if (this.padding === !1)
    return n;
  for (var l = n[n.length - 1], o = n.length - l; o < n.length; o++)
    Uh.equal(n[o], l);
  return n.slice(0, n.length - l);
};
sr.prototype._encrypt = function(n, l, o, m, f) {
  for (var b = l, w = o, _ = 0; _ < n.keys.length; _ += 2) {
    var S = n.keys[_], y = n.keys[_ + 1];
    Me.expand(w, n.tmp, 0), S ^= n.tmp[0], y ^= n.tmp[1];
    var x = Me.substitute(S, y), B = Me.permute(x), A = w;
    w = (b ^ B) >>> 0, b = A;
  }
  Me.rip(w, b, m, f);
};
sr.prototype._decrypt = function(n, l, o, m, f) {
  for (var b = o, w = l, _ = n.keys.length - 2; _ >= 0; _ -= 2) {
    var S = n.keys[_], y = n.keys[_ + 1];
    Me.expand(b, n.tmp, 0), S ^= n.tmp[0], y ^= n.tmp[1];
    var x = Me.substitute(S, y), B = Me.permute(x), A = b;
    b = (w ^ B) >>> 0, w = A;
  }
  Me.rip(b, w, m, f);
};
var Hh = {}, $d = Ke, Fd = Jt, mn = {};
function Ld(h) {
  $d.equal(h.length, 8, "Invalid IV length"), this.iv = new Array(8);
  for (var n = 0; n < this.iv.length; n++)
    this.iv[n] = h[n];
}
function Od(h) {
  function n(f) {
    h.call(this, f), this._cbcInit();
  }
  Fd(n, h);
  for (var l = Object.keys(mn), o = 0; o < l.length; o++) {
    var m = l[o];
    n.prototype[m] = mn[m];
  }
  return n.create = function(b) {
    return new n(b);
  }, n;
}
Hh.instantiate = Od;
mn._cbcInit = function() {
  var n = new Ld(this.options.iv);
  this._cbcState = n;
};
mn._update = function(n, l, o, m) {
  var f = this._cbcState, b = this.constructor.super_.prototype, w = f.iv;
  if (this.type === "encrypt") {
    for (var _ = 0; _ < this.blockSize; _++)
      w[_] ^= n[l + _];
    b._update.call(this, w, 0, o, m);
    for (var _ = 0; _ < this.blockSize; _++)
      w[_] = o[m + _];
  } else {
    b._update.call(this, n, l, o, m);
    for (var _ = 0; _ < this.blockSize; _++)
      o[m + _] ^= w[_];
    for (var _ = 0; _ < this.blockSize; _++)
      w[_] = n[l + _];
  }
};
var Ud = Ke, zd = Jt, Zh = d0, Rr = Kh;
function Kd(h, n) {
  Ud.equal(n.length, 24, "Invalid key length");
  var l = n.slice(0, 8), o = n.slice(8, 16), m = n.slice(16, 24);
  h === "encrypt" ? this.ciphers = [
    Rr.create({ type: "encrypt", key: l }),
    Rr.create({ type: "decrypt", key: o }),
    Rr.create({ type: "encrypt", key: m })
  ] : this.ciphers = [
    Rr.create({ type: "decrypt", key: m }),
    Rr.create({ type: "encrypt", key: o }),
    Rr.create({ type: "decrypt", key: l })
  ];
}
function Wr(h) {
  Zh.call(this, h);
  var n = new Kd(this.type, this.options.key);
  this._edeState = n;
}
zd(Wr, Zh);
var Hd = Wr;
Wr.create = function(n) {
  return new Wr(n);
};
Wr.prototype._update = function(n, l, o, m) {
  var f = this._edeState;
  f.ciphers[0]._update(n, l, o, m), f.ciphers[1]._update(o, m, o, m), f.ciphers[2]._update(o, m, o, m);
};
Wr.prototype._pad = Rr.prototype._pad;
Wr.prototype._unpad = Rr.prototype._unpad;
ci.utils = Le;
ci.Cipher = d0;
ci.DES = Kh;
ci.CBC = Hh;
ci.EDE = Hd;
var Wh = qr, pr = ci, Zd = Jt, Lr = Nt.Buffer, Ni = {
  "des-ede3-cbc": pr.CBC.instantiate(pr.EDE),
  "des-ede3": pr.EDE,
  "des-ede-cbc": pr.CBC.instantiate(pr.EDE),
  "des-ede": pr.EDE,
  "des-cbc": pr.CBC.instantiate(pr.DES),
  "des-ecb": pr.DES
};
Ni.des = Ni["des-cbc"];
Ni.des3 = Ni["des-ede3-cbc"];
var Wd = Cn;
Zd(Cn, Wh);
function Cn(h) {
  Wh.call(this);
  var n = h.mode.toLowerCase(), l = Ni[n], o;
  h.decrypt ? o = "decrypt" : o = "encrypt";
  var m = h.key;
  Lr.isBuffer(m) || (m = Lr.from(m)), (n === "des-ede" || n === "des-ede-cbc") && (m = Lr.concat([m, m.slice(0, 8)]));
  var f = h.iv;
  Lr.isBuffer(f) || (f = Lr.from(f)), this._des = l.create({
    key: m,
    iv: f,
    type: o
  });
}
Cn.prototype._update = function(h) {
  return Lr.from(this._des.update(h));
};
Cn.prototype._final = function() {
  return Lr.from(this._des.final());
};
var Fe = {}, c0 = {}, v0 = {};
v0.encrypt = function(h, n) {
  return h._cipher.encryptBlock(n);
};
v0.decrypt = function(h, n) {
  return h._cipher.decryptBlock(n);
};
var p0 = {}, nr = [], Ue = [], Vd = typeof Uint8Array < "u" ? Uint8Array : Array, m0 = !1;
function Vh() {
  m0 = !0;
  for (var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, l = h.length; n < l; ++n)
    nr[n] = h[n], Ue[h.charCodeAt(n)] = n;
  Ue["-".charCodeAt(0)] = 62, Ue["_".charCodeAt(0)] = 63;
}
function Yd(h) {
  m0 || Vh();
  var n, l, o, m, f, b, w = h.length;
  if (w % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  f = h[w - 2] === "=" ? 2 : h[w - 1] === "=" ? 1 : 0, b = new Vd(w * 3 / 4 - f), o = f > 0 ? w - 4 : w;
  var _ = 0;
  for (n = 0, l = 0; n < o; n += 4, l += 3)
    m = Ue[h.charCodeAt(n)] << 18 | Ue[h.charCodeAt(n + 1)] << 12 | Ue[h.charCodeAt(n + 2)] << 6 | Ue[h.charCodeAt(n + 3)], b[_++] = m >> 16 & 255, b[_++] = m >> 8 & 255, b[_++] = m & 255;
  return f === 2 ? (m = Ue[h.charCodeAt(n)] << 2 | Ue[h.charCodeAt(n + 1)] >> 4, b[_++] = m & 255) : f === 1 && (m = Ue[h.charCodeAt(n)] << 10 | Ue[h.charCodeAt(n + 1)] << 4 | Ue[h.charCodeAt(n + 2)] >> 2, b[_++] = m >> 8 & 255, b[_++] = m & 255), b;
}
function Jd(h) {
  return nr[h >> 18 & 63] + nr[h >> 12 & 63] + nr[h >> 6 & 63] + nr[h & 63];
}
function Gd(h, n, l) {
  for (var o, m = [], f = n; f < l; f += 3)
    o = (h[f] << 16) + (h[f + 1] << 8) + h[f + 2], m.push(Jd(o));
  return m.join("");
}
function aa(h) {
  m0 || Vh();
  for (var n, l = h.length, o = l % 3, m = "", f = [], b = 16383, w = 0, _ = l - o; w < _; w += b)
    f.push(Gd(h, w, w + b > _ ? _ : w + b));
  return o === 1 ? (n = h[l - 1], m += nr[n >> 2], m += nr[n << 4 & 63], m += "==") : o === 2 && (n = (h[l - 2] << 8) + h[l - 1], m += nr[n >> 10], m += nr[n >> 4 & 63], m += nr[n << 2 & 63], m += "="), f.push(m), f.join("");
}
function qn(h, n, l, o, m) {
  var f, b, w = m * 8 - o - 1, _ = (1 << w) - 1, S = _ >> 1, y = -7, x = l ? m - 1 : 0, B = l ? -1 : 1, A = h[n + x];
  for (x += B, f = A & (1 << -y) - 1, A >>= -y, y += w; y > 0; f = f * 256 + h[n + x], x += B, y -= 8)
    ;
  for (b = f & (1 << -y) - 1, f >>= -y, y += o; y > 0; b = b * 256 + h[n + x], x += B, y -= 8)
    ;
  if (f === 0)
    f = 1 - S;
  else {
    if (f === _)
      return b ? NaN : (A ? -1 : 1) * (1 / 0);
    b = b + Math.pow(2, o), f = f - S;
  }
  return (A ? -1 : 1) * b * Math.pow(2, f - o);
}
function Yh(h, n, l, o, m, f) {
  var b, w, _, S = f * 8 - m - 1, y = (1 << S) - 1, x = y >> 1, B = m === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, A = o ? 0 : f - 1, T = o ? 1 : -1, D = n < 0 || n === 0 && 1 / n < 0 ? 1 : 0;
  for (n = Math.abs(n), isNaN(n) || n === 1 / 0 ? (w = isNaN(n) ? 1 : 0, b = y) : (b = Math.floor(Math.log(n) / Math.LN2), n * (_ = Math.pow(2, -b)) < 1 && (b--, _ *= 2), b + x >= 1 ? n += B / _ : n += B * Math.pow(2, 1 - x), n * _ >= 2 && (b++, _ /= 2), b + x >= y ? (w = 0, b = y) : b + x >= 1 ? (w = (n * _ - 1) * Math.pow(2, m), b = b + x) : (w = n * Math.pow(2, x - 1) * Math.pow(2, m), b = 0)); m >= 8; h[l + A] = w & 255, A += T, w /= 256, m -= 8)
    ;
  for (b = b << m | w, S += m; S > 0; h[l + A] = b & 255, A += T, b /= 256, S -= 8)
    ;
  h[l + A - T] |= D * 128;
}
var Xd = {}.toString, Jh = Array.isArray || function(h) {
  return Xd.call(h) == "[object Array]";
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var jd = 50;
ut.TYPED_ARRAY_SUPPORT = Pi.TYPED_ARRAY_SUPPORT !== void 0 ? Pi.TYPED_ARRAY_SUPPORT : !0;
gn();
function gn() {
  return ut.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function gr(h, n) {
  if (gn() < n)
    throw new RangeError("Invalid typed array length");
  return ut.TYPED_ARRAY_SUPPORT ? (h = new Uint8Array(n), h.__proto__ = ut.prototype) : (h === null && (h = new ut(n)), h.length = n), h;
}
function ut(h, n, l) {
  if (!ut.TYPED_ARRAY_SUPPORT && !(this instanceof ut))
    return new ut(h, n, l);
  if (typeof h == "number") {
    if (typeof n == "string")
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    return g0(this, h);
  }
  return Gh(this, h, n, l);
}
ut.poolSize = 8192;
ut._augment = function(h) {
  return h.__proto__ = ut.prototype, h;
};
function Gh(h, n, l, o) {
  if (typeof n == "number")
    throw new TypeError('"value" argument must not be a number');
  return typeof ArrayBuffer < "u" && n instanceof ArrayBuffer ? ec(h, n, l, o) : typeof n == "string" ? tc(h, n, l) : rc(h, n);
}
ut.from = function(h, n, l) {
  return Gh(null, h, n, l);
};
ut.TYPED_ARRAY_SUPPORT && (ut.prototype.__proto__ = Uint8Array.prototype, ut.__proto__ = Uint8Array, typeof Symbol < "u" && Symbol.species && ut[Symbol.species]);
function Xh(h) {
  if (typeof h != "number")
    throw new TypeError('"size" argument must be a number');
  if (h < 0)
    throw new RangeError('"size" argument must not be negative');
}
function Qd(h, n, l, o) {
  return Xh(n), n <= 0 ? gr(h, n) : l !== void 0 ? typeof o == "string" ? gr(h, n).fill(l, o) : gr(h, n).fill(l) : gr(h, n);
}
ut.alloc = function(h, n, l) {
  return Qd(null, h, n, l);
};
function g0(h, n) {
  if (Xh(n), h = gr(h, n < 0 ? 0 : b0(n) | 0), !ut.TYPED_ARRAY_SUPPORT)
    for (var l = 0; l < n; ++l)
      h[l] = 0;
  return h;
}
ut.allocUnsafe = function(h) {
  return g0(null, h);
};
ut.allocUnsafeSlow = function(h) {
  return g0(null, h);
};
function tc(h, n, l) {
  if ((typeof l != "string" || l === "") && (l = "utf8"), !ut.isEncoding(l))
    throw new TypeError('"encoding" must be a valid string encoding');
  var o = jh(n, l) | 0;
  h = gr(h, o);
  var m = h.write(n, l);
  return m !== o && (h = h.slice(0, m)), h;
}
function Jf(h, n) {
  var l = n.length < 0 ? 0 : b0(n.length) | 0;
  h = gr(h, l);
  for (var o = 0; o < l; o += 1)
    h[o] = n[o] & 255;
  return h;
}
function ec(h, n, l, o) {
  if (n.byteLength, l < 0 || n.byteLength < l)
    throw new RangeError("'offset' is out of bounds");
  if (n.byteLength < l + (o || 0))
    throw new RangeError("'length' is out of bounds");
  return l === void 0 && o === void 0 ? n = new Uint8Array(n) : o === void 0 ? n = new Uint8Array(n, l) : n = new Uint8Array(n, l, o), ut.TYPED_ARRAY_SUPPORT ? (h = n, h.__proto__ = ut.prototype) : h = Jf(h, n), h;
}
function rc(h, n) {
  if (or(n)) {
    var l = b0(n.length) | 0;
    return h = gr(h, l), h.length === 0 || n.copy(h, 0, 0, l), h;
  }
  if (n) {
    if (typeof ArrayBuffer < "u" && n.buffer instanceof ArrayBuffer || "length" in n)
      return typeof n.length != "number" || Mc(n.length) ? gr(h, 0) : Jf(h, n);
    if (n.type === "Buffer" && Jh(n.data))
      return Jf(h, n.data);
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function b0(h) {
  if (h >= gn())
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + gn().toString(16) + " bytes");
  return h | 0;
}
ut.isBuffer = xc;
function or(h) {
  return !!(h != null && h._isBuffer);
}
ut.compare = function(n, l) {
  if (!or(n) || !or(l))
    throw new TypeError("Arguments must be Buffers");
  if (n === l)
    return 0;
  for (var o = n.length, m = l.length, f = 0, b = Math.min(o, m); f < b; ++f)
    if (n[f] !== l[f]) {
      o = n[f], m = l[f];
      break;
    }
  return o < m ? -1 : m < o ? 1 : 0;
};
ut.isEncoding = function(n) {
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
ut.concat = function(n, l) {
  if (!Jh(n))
    throw new TypeError('"list" argument must be an Array of Buffers');
  if (n.length === 0)
    return ut.alloc(0);
  var o;
  if (l === void 0)
    for (l = 0, o = 0; o < n.length; ++o)
      l += n[o].length;
  var m = ut.allocUnsafe(l), f = 0;
  for (o = 0; o < n.length; ++o) {
    var b = n[o];
    if (!or(b))
      throw new TypeError('"list" argument must be an Array of Buffers');
    b.copy(m, f), f += b.length;
  }
  return m;
};
function jh(h, n) {
  if (or(h))
    return h.length;
  if (typeof ArrayBuffer < "u" && typeof ArrayBuffer.isView == "function" && (ArrayBuffer.isView(h) || h instanceof ArrayBuffer))
    return h.byteLength;
  typeof h != "string" && (h = "" + h);
  var l = h.length;
  if (l === 0)
    return 0;
  for (var o = !1; ; )
    switch (n) {
      case "ascii":
      case "latin1":
      case "binary":
        return l;
      case "utf8":
      case "utf-8":
      case void 0:
        return bn(h).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return l * 2;
      case "hex":
        return l >>> 1;
      case "base64":
        return fs(h).length;
      default:
        if (o)
          return bn(h).length;
        n = ("" + n).toLowerCase(), o = !0;
    }
}
ut.byteLength = jh;
function ic(h, n, l) {
  var o = !1;
  if ((n === void 0 || n < 0) && (n = 0), n > this.length || ((l === void 0 || l > this.length) && (l = this.length), l <= 0) || (l >>>= 0, n >>>= 0, l <= n))
    return "";
  for (h || (h = "utf8"); ; )
    switch (h) {
      case "hex":
        return cc(this, n, l);
      case "utf8":
      case "utf-8":
        return es(this, n, l);
      case "ascii":
        return lc(this, n, l);
      case "latin1":
      case "binary":
        return dc(this, n, l);
      case "base64":
        return oc(this, n, l);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return vc(this, n, l);
      default:
        if (o)
          throw new TypeError("Unknown encoding: " + h);
        h = (h + "").toLowerCase(), o = !0;
    }
}
ut.prototype._isBuffer = !0;
function Kr(h, n, l) {
  var o = h[n];
  h[n] = h[l], h[l] = o;
}
ut.prototype.swap16 = function() {
  var n = this.length;
  if (n % 2 !== 0)
    throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var l = 0; l < n; l += 2)
    Kr(this, l, l + 1);
  return this;
};
ut.prototype.swap32 = function() {
  var n = this.length;
  if (n % 4 !== 0)
    throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var l = 0; l < n; l += 4)
    Kr(this, l, l + 3), Kr(this, l + 1, l + 2);
  return this;
};
ut.prototype.swap64 = function() {
  var n = this.length;
  if (n % 8 !== 0)
    throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var l = 0; l < n; l += 8)
    Kr(this, l, l + 7), Kr(this, l + 1, l + 6), Kr(this, l + 2, l + 5), Kr(this, l + 3, l + 4);
  return this;
};
ut.prototype.toString = function() {
  var n = this.length | 0;
  return n === 0 ? "" : arguments.length === 0 ? es(this, 0, n) : ic.apply(this, arguments);
};
ut.prototype.equals = function(n) {
  if (!or(n))
    throw new TypeError("Argument must be a Buffer");
  return this === n ? !0 : ut.compare(this, n) === 0;
};
ut.prototype.inspect = function() {
  var n = "", l = jd;
  return this.length > 0 && (n = this.toString("hex", 0, l).match(/.{2}/g).join(" "), this.length > l && (n += " ... ")), "<Buffer " + n + ">";
};
ut.prototype.compare = function(n, l, o, m, f) {
  if (!or(n))
    throw new TypeError("Argument must be a Buffer");
  if (l === void 0 && (l = 0), o === void 0 && (o = n ? n.length : 0), m === void 0 && (m = 0), f === void 0 && (f = this.length), l < 0 || o > n.length || m < 0 || f > this.length)
    throw new RangeError("out of range index");
  if (m >= f && l >= o)
    return 0;
  if (m >= f)
    return -1;
  if (l >= o)
    return 1;
  if (l >>>= 0, o >>>= 0, m >>>= 0, f >>>= 0, this === n)
    return 0;
  for (var b = f - m, w = o - l, _ = Math.min(b, w), S = this.slice(m, f), y = n.slice(l, o), x = 0; x < _; ++x)
    if (S[x] !== y[x]) {
      b = S[x], w = y[x];
      break;
    }
  return b < w ? -1 : w < b ? 1 : 0;
};
function Qh(h, n, l, o, m) {
  if (h.length === 0)
    return -1;
  if (typeof l == "string" ? (o = l, l = 0) : l > 2147483647 ? l = 2147483647 : l < -2147483648 && (l = -2147483648), l = +l, isNaN(l) && (l = m ? 0 : h.length - 1), l < 0 && (l = h.length + l), l >= h.length) {
    if (m)
      return -1;
    l = h.length - 1;
  } else if (l < 0)
    if (m)
      l = 0;
    else
      return -1;
  if (typeof n == "string" && (n = ut.from(n, o)), or(n))
    return n.length === 0 ? -1 : ha(h, n, l, o, m);
  if (typeof n == "number")
    return n = n & 255, ut.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf == "function" ? m ? Uint8Array.prototype.indexOf.call(h, n, l) : Uint8Array.prototype.lastIndexOf.call(h, n, l) : ha(h, [n], l, o, m);
  throw new TypeError("val must be string, number or Buffer");
}
function ha(h, n, l, o, m) {
  var f = 1, b = h.length, w = n.length;
  if (o !== void 0 && (o = String(o).toLowerCase(), o === "ucs2" || o === "ucs-2" || o === "utf16le" || o === "utf-16le")) {
    if (h.length < 2 || n.length < 2)
      return -1;
    f = 2, b /= 2, w /= 2, l /= 2;
  }
  function _(A, T) {
    return f === 1 ? A[T] : A.readUInt16BE(T * f);
  }
  var S;
  if (m) {
    var y = -1;
    for (S = l; S < b; S++)
      if (_(h, S) === _(n, y === -1 ? 0 : S - y)) {
        if (y === -1 && (y = S), S - y + 1 === w)
          return y * f;
      } else
        y !== -1 && (S -= S - y), y = -1;
  } else
    for (l + w > b && (l = b - w), S = l; S >= 0; S--) {
      for (var x = !0, B = 0; B < w; B++)
        if (_(h, S + B) !== _(n, B)) {
          x = !1;
          break;
        }
      if (x)
        return S;
    }
  return -1;
}
ut.prototype.includes = function(n, l, o) {
  return this.indexOf(n, l, o) !== -1;
};
ut.prototype.indexOf = function(n, l, o) {
  return Qh(this, n, l, o, !0);
};
ut.prototype.lastIndexOf = function(n, l, o) {
  return Qh(this, n, l, o, !1);
};
function nc(h, n, l, o) {
  l = Number(l) || 0;
  var m = h.length - l;
  o ? (o = Number(o), o > m && (o = m)) : o = m;
  var f = n.length;
  if (f % 2 !== 0)
    throw new TypeError("Invalid hex string");
  o > f / 2 && (o = f / 2);
  for (var b = 0; b < o; ++b) {
    var w = parseInt(n.substr(b * 2, 2), 16);
    if (isNaN(w))
      return b;
    h[l + b] = w;
  }
  return b;
}
function fc(h, n, l, o) {
  return Nn(bn(n, h.length - l), h, l, o);
}
function ts(h, n, l, o) {
  return Nn(yc(n), h, l, o);
}
function ac(h, n, l, o) {
  return ts(h, n, l, o);
}
function hc(h, n, l, o) {
  return Nn(fs(n), h, l, o);
}
function sc(h, n, l, o) {
  return Nn(wc(n, h.length - l), h, l, o);
}
ut.prototype.write = function(n, l, o, m) {
  if (l === void 0)
    m = "utf8", o = this.length, l = 0;
  else if (o === void 0 && typeof l == "string")
    m = l, o = this.length, l = 0;
  else if (isFinite(l))
    l = l | 0, isFinite(o) ? (o = o | 0, m === void 0 && (m = "utf8")) : (m = o, o = void 0);
  else
    throw new Error(
      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
    );
  var f = this.length - l;
  if ((o === void 0 || o > f) && (o = f), n.length > 0 && (o < 0 || l < 0) || l > this.length)
    throw new RangeError("Attempt to write outside buffer bounds");
  m || (m = "utf8");
  for (var b = !1; ; )
    switch (m) {
      case "hex":
        return nc(this, n, l, o);
      case "utf8":
      case "utf-8":
        return fc(this, n, l, o);
      case "ascii":
        return ts(this, n, l, o);
      case "latin1":
      case "binary":
        return ac(this, n, l, o);
      case "base64":
        return hc(this, n, l, o);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return sc(this, n, l, o);
      default:
        if (b)
          throw new TypeError("Unknown encoding: " + m);
        m = ("" + m).toLowerCase(), b = !0;
    }
};
ut.prototype.toJSON = function() {
  return {
    type: "Buffer",
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};
function oc(h, n, l) {
  return n === 0 && l === h.length ? aa(h) : aa(h.slice(n, l));
}
function es(h, n, l) {
  l = Math.min(h.length, l);
  for (var o = [], m = n; m < l; ) {
    var f = h[m], b = null, w = f > 239 ? 4 : f > 223 ? 3 : f > 191 ? 2 : 1;
    if (m + w <= l) {
      var _, S, y, x;
      switch (w) {
        case 1:
          f < 128 && (b = f);
          break;
        case 2:
          _ = h[m + 1], (_ & 192) === 128 && (x = (f & 31) << 6 | _ & 63, x > 127 && (b = x));
          break;
        case 3:
          _ = h[m + 1], S = h[m + 2], (_ & 192) === 128 && (S & 192) === 128 && (x = (f & 15) << 12 | (_ & 63) << 6 | S & 63, x > 2047 && (x < 55296 || x > 57343) && (b = x));
          break;
        case 4:
          _ = h[m + 1], S = h[m + 2], y = h[m + 3], (_ & 192) === 128 && (S & 192) === 128 && (y & 192) === 128 && (x = (f & 15) << 18 | (_ & 63) << 12 | (S & 63) << 6 | y & 63, x > 65535 && x < 1114112 && (b = x));
      }
    }
    b === null ? (b = 65533, w = 1) : b > 65535 && (b -= 65536, o.push(b >>> 10 & 1023 | 55296), b = 56320 | b & 1023), o.push(b), m += w;
  }
  return uc(o);
}
var sa = 4096;
function uc(h) {
  var n = h.length;
  if (n <= sa)
    return String.fromCharCode.apply(String, h);
  for (var l = "", o = 0; o < n; )
    l += String.fromCharCode.apply(
      String,
      h.slice(o, o += sa)
    );
  return l;
}
function lc(h, n, l) {
  var o = "";
  l = Math.min(h.length, l);
  for (var m = n; m < l; ++m)
    o += String.fromCharCode(h[m] & 127);
  return o;
}
function dc(h, n, l) {
  var o = "";
  l = Math.min(h.length, l);
  for (var m = n; m < l; ++m)
    o += String.fromCharCode(h[m]);
  return o;
}
function cc(h, n, l) {
  var o = h.length;
  (!n || n < 0) && (n = 0), (!l || l < 0 || l > o) && (l = o);
  for (var m = "", f = n; f < l; ++f)
    m += bc(h[f]);
  return m;
}
function vc(h, n, l) {
  for (var o = h.slice(n, l), m = "", f = 0; f < o.length; f += 2)
    m += String.fromCharCode(o[f] + o[f + 1] * 256);
  return m;
}
ut.prototype.slice = function(n, l) {
  var o = this.length;
  n = ~~n, l = l === void 0 ? o : ~~l, n < 0 ? (n += o, n < 0 && (n = 0)) : n > o && (n = o), l < 0 ? (l += o, l < 0 && (l = 0)) : l > o && (l = o), l < n && (l = n);
  var m;
  if (ut.TYPED_ARRAY_SUPPORT)
    m = this.subarray(n, l), m.__proto__ = ut.prototype;
  else {
    var f = l - n;
    m = new ut(f, void 0);
    for (var b = 0; b < f; ++b)
      m[b] = this[b + n];
  }
  return m;
};
function Ae(h, n, l) {
  if (h % 1 !== 0 || h < 0)
    throw new RangeError("offset is not uint");
  if (h + n > l)
    throw new RangeError("Trying to access beyond buffer length");
}
ut.prototype.readUIntLE = function(n, l, o) {
  n = n | 0, l = l | 0, o || Ae(n, l, this.length);
  for (var m = this[n], f = 1, b = 0; ++b < l && (f *= 256); )
    m += this[n + b] * f;
  return m;
};
ut.prototype.readUIntBE = function(n, l, o) {
  n = n | 0, l = l | 0, o || Ae(n, l, this.length);
  for (var m = this[n + --l], f = 1; l > 0 && (f *= 256); )
    m += this[n + --l] * f;
  return m;
};
ut.prototype.readUInt8 = function(n, l) {
  return l || Ae(n, 1, this.length), this[n];
};
ut.prototype.readUInt16LE = function(n, l) {
  return l || Ae(n, 2, this.length), this[n] | this[n + 1] << 8;
};
ut.prototype.readUInt16BE = function(n, l) {
  return l || Ae(n, 2, this.length), this[n] << 8 | this[n + 1];
};
ut.prototype.readUInt32LE = function(n, l) {
  return l || Ae(n, 4, this.length), (this[n] | this[n + 1] << 8 | this[n + 2] << 16) + this[n + 3] * 16777216;
};
ut.prototype.readUInt32BE = function(n, l) {
  return l || Ae(n, 4, this.length), this[n] * 16777216 + (this[n + 1] << 16 | this[n + 2] << 8 | this[n + 3]);
};
ut.prototype.readIntLE = function(n, l, o) {
  n = n | 0, l = l | 0, o || Ae(n, l, this.length);
  for (var m = this[n], f = 1, b = 0; ++b < l && (f *= 256); )
    m += this[n + b] * f;
  return f *= 128, m >= f && (m -= Math.pow(2, 8 * l)), m;
};
ut.prototype.readIntBE = function(n, l, o) {
  n = n | 0, l = l | 0, o || Ae(n, l, this.length);
  for (var m = l, f = 1, b = this[n + --m]; m > 0 && (f *= 256); )
    b += this[n + --m] * f;
  return f *= 128, b >= f && (b -= Math.pow(2, 8 * l)), b;
};
ut.prototype.readInt8 = function(n, l) {
  return l || Ae(n, 1, this.length), this[n] & 128 ? (255 - this[n] + 1) * -1 : this[n];
};
ut.prototype.readInt16LE = function(n, l) {
  l || Ae(n, 2, this.length);
  var o = this[n] | this[n + 1] << 8;
  return o & 32768 ? o | 4294901760 : o;
};
ut.prototype.readInt16BE = function(n, l) {
  l || Ae(n, 2, this.length);
  var o = this[n + 1] | this[n] << 8;
  return o & 32768 ? o | 4294901760 : o;
};
ut.prototype.readInt32LE = function(n, l) {
  return l || Ae(n, 4, this.length), this[n] | this[n + 1] << 8 | this[n + 2] << 16 | this[n + 3] << 24;
};
ut.prototype.readInt32BE = function(n, l) {
  return l || Ae(n, 4, this.length), this[n] << 24 | this[n + 1] << 16 | this[n + 2] << 8 | this[n + 3];
};
ut.prototype.readFloatLE = function(n, l) {
  return l || Ae(n, 4, this.length), qn(this, n, !0, 23, 4);
};
ut.prototype.readFloatBE = function(n, l) {
  return l || Ae(n, 4, this.length), qn(this, n, !1, 23, 4);
};
ut.prototype.readDoubleLE = function(n, l) {
  return l || Ae(n, 8, this.length), qn(this, n, !0, 52, 8);
};
ut.prototype.readDoubleBE = function(n, l) {
  return l || Ae(n, 8, this.length), qn(this, n, !1, 52, 8);
};
function $e(h, n, l, o, m, f) {
  if (!or(h))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (n > m || n < f)
    throw new RangeError('"value" argument is out of bounds');
  if (l + o > h.length)
    throw new RangeError("Index out of range");
}
ut.prototype.writeUIntLE = function(n, l, o, m) {
  if (n = +n, l = l | 0, o = o | 0, !m) {
    var f = Math.pow(2, 8 * o) - 1;
    $e(this, n, l, o, f, 0);
  }
  var b = 1, w = 0;
  for (this[l] = n & 255; ++w < o && (b *= 256); )
    this[l + w] = n / b & 255;
  return l + o;
};
ut.prototype.writeUIntBE = function(n, l, o, m) {
  if (n = +n, l = l | 0, o = o | 0, !m) {
    var f = Math.pow(2, 8 * o) - 1;
    $e(this, n, l, o, f, 0);
  }
  var b = o - 1, w = 1;
  for (this[l + b] = n & 255; --b >= 0 && (w *= 256); )
    this[l + b] = n / w & 255;
  return l + o;
};
ut.prototype.writeUInt8 = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 1, 255, 0), ut.TYPED_ARRAY_SUPPORT || (n = Math.floor(n)), this[l] = n & 255, l + 1;
};
function Pn(h, n, l, o) {
  n < 0 && (n = 65535 + n + 1);
  for (var m = 0, f = Math.min(h.length - l, 2); m < f; ++m)
    h[l + m] = (n & 255 << 8 * (o ? m : 1 - m)) >>> (o ? m : 1 - m) * 8;
}
ut.prototype.writeUInt16LE = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 2, 65535, 0), ut.TYPED_ARRAY_SUPPORT ? (this[l] = n & 255, this[l + 1] = n >>> 8) : Pn(this, n, l, !0), l + 2;
};
ut.prototype.writeUInt16BE = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 2, 65535, 0), ut.TYPED_ARRAY_SUPPORT ? (this[l] = n >>> 8, this[l + 1] = n & 255) : Pn(this, n, l, !1), l + 2;
};
function Dn(h, n, l, o) {
  n < 0 && (n = 4294967295 + n + 1);
  for (var m = 0, f = Math.min(h.length - l, 4); m < f; ++m)
    h[l + m] = n >>> (o ? m : 3 - m) * 8 & 255;
}
ut.prototype.writeUInt32LE = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 4, 4294967295, 0), ut.TYPED_ARRAY_SUPPORT ? (this[l + 3] = n >>> 24, this[l + 2] = n >>> 16, this[l + 1] = n >>> 8, this[l] = n & 255) : Dn(this, n, l, !0), l + 4;
};
ut.prototype.writeUInt32BE = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 4, 4294967295, 0), ut.TYPED_ARRAY_SUPPORT ? (this[l] = n >>> 24, this[l + 1] = n >>> 16, this[l + 2] = n >>> 8, this[l + 3] = n & 255) : Dn(this, n, l, !1), l + 4;
};
ut.prototype.writeIntLE = function(n, l, o, m) {
  if (n = +n, l = l | 0, !m) {
    var f = Math.pow(2, 8 * o - 1);
    $e(this, n, l, o, f - 1, -f);
  }
  var b = 0, w = 1, _ = 0;
  for (this[l] = n & 255; ++b < o && (w *= 256); )
    n < 0 && _ === 0 && this[l + b - 1] !== 0 && (_ = 1), this[l + b] = (n / w >> 0) - _ & 255;
  return l + o;
};
ut.prototype.writeIntBE = function(n, l, o, m) {
  if (n = +n, l = l | 0, !m) {
    var f = Math.pow(2, 8 * o - 1);
    $e(this, n, l, o, f - 1, -f);
  }
  var b = o - 1, w = 1, _ = 0;
  for (this[l + b] = n & 255; --b >= 0 && (w *= 256); )
    n < 0 && _ === 0 && this[l + b + 1] !== 0 && (_ = 1), this[l + b] = (n / w >> 0) - _ & 255;
  return l + o;
};
ut.prototype.writeInt8 = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 1, 127, -128), ut.TYPED_ARRAY_SUPPORT || (n = Math.floor(n)), n < 0 && (n = 255 + n + 1), this[l] = n & 255, l + 1;
};
ut.prototype.writeInt16LE = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 2, 32767, -32768), ut.TYPED_ARRAY_SUPPORT ? (this[l] = n & 255, this[l + 1] = n >>> 8) : Pn(this, n, l, !0), l + 2;
};
ut.prototype.writeInt16BE = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 2, 32767, -32768), ut.TYPED_ARRAY_SUPPORT ? (this[l] = n >>> 8, this[l + 1] = n & 255) : Pn(this, n, l, !1), l + 2;
};
ut.prototype.writeInt32LE = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 4, 2147483647, -2147483648), ut.TYPED_ARRAY_SUPPORT ? (this[l] = n & 255, this[l + 1] = n >>> 8, this[l + 2] = n >>> 16, this[l + 3] = n >>> 24) : Dn(this, n, l, !0), l + 4;
};
ut.prototype.writeInt32BE = function(n, l, o) {
  return n = +n, l = l | 0, o || $e(this, n, l, 4, 2147483647, -2147483648), n < 0 && (n = 4294967295 + n + 1), ut.TYPED_ARRAY_SUPPORT ? (this[l] = n >>> 24, this[l + 1] = n >>> 16, this[l + 2] = n >>> 8, this[l + 3] = n & 255) : Dn(this, n, l, !1), l + 4;
};
function rs(h, n, l, o, m, f) {
  if (l + o > h.length)
    throw new RangeError("Index out of range");
  if (l < 0)
    throw new RangeError("Index out of range");
}
function is(h, n, l, o, m) {
  return m || rs(h, n, l, 4), Yh(h, n, l, o, 23, 4), l + 4;
}
ut.prototype.writeFloatLE = function(n, l, o) {
  return is(this, n, l, !0, o);
};
ut.prototype.writeFloatBE = function(n, l, o) {
  return is(this, n, l, !1, o);
};
function ns(h, n, l, o, m) {
  return m || rs(h, n, l, 8), Yh(h, n, l, o, 52, 8), l + 8;
}
ut.prototype.writeDoubleLE = function(n, l, o) {
  return ns(this, n, l, !0, o);
};
ut.prototype.writeDoubleBE = function(n, l, o) {
  return ns(this, n, l, !1, o);
};
ut.prototype.copy = function(n, l, o, m) {
  if (o || (o = 0), !m && m !== 0 && (m = this.length), l >= n.length && (l = n.length), l || (l = 0), m > 0 && m < o && (m = o), m === o || n.length === 0 || this.length === 0)
    return 0;
  if (l < 0)
    throw new RangeError("targetStart out of bounds");
  if (o < 0 || o >= this.length)
    throw new RangeError("sourceStart out of bounds");
  if (m < 0)
    throw new RangeError("sourceEnd out of bounds");
  m > this.length && (m = this.length), n.length - l < m - o && (m = n.length - l + o);
  var f = m - o, b;
  if (this === n && o < l && l < m)
    for (b = f - 1; b >= 0; --b)
      n[b + l] = this[b + o];
  else if (f < 1e3 || !ut.TYPED_ARRAY_SUPPORT)
    for (b = 0; b < f; ++b)
      n[b + l] = this[b + o];
  else
    Uint8Array.prototype.set.call(
      n,
      this.subarray(o, o + f),
      l
    );
  return f;
};
ut.prototype.fill = function(n, l, o, m) {
  if (typeof n == "string") {
    if (typeof l == "string" ? (m = l, l = 0, o = this.length) : typeof o == "string" && (m = o, o = this.length), n.length === 1) {
      var f = n.charCodeAt(0);
      f < 256 && (n = f);
    }
    if (m !== void 0 && typeof m != "string")
      throw new TypeError("encoding must be a string");
    if (typeof m == "string" && !ut.isEncoding(m))
      throw new TypeError("Unknown encoding: " + m);
  } else
    typeof n == "number" && (n = n & 255);
  if (l < 0 || this.length < l || this.length < o)
    throw new RangeError("Out of range index");
  if (o <= l)
    return this;
  l = l >>> 0, o = o === void 0 ? this.length : o >>> 0, n || (n = 0);
  var b;
  if (typeof n == "number")
    for (b = l; b < o; ++b)
      this[b] = n;
  else {
    var w = or(n) ? n : bn(new ut(n, m).toString()), _ = w.length;
    for (b = 0; b < o - l; ++b)
      this[b + l] = w[b % _];
  }
  return this;
};
var pc = /[^+\/0-9A-Za-z-_]/g;
function mc(h) {
  if (h = gc(h).replace(pc, ""), h.length < 2)
    return "";
  for (; h.length % 4 !== 0; )
    h = h + "=";
  return h;
}
function gc(h) {
  return h.trim ? h.trim() : h.replace(/^\s+|\s+$/g, "");
}
function bc(h) {
  return h < 16 ? "0" + h.toString(16) : h.toString(16);
}
function bn(h, n) {
  n = n || 1 / 0;
  for (var l, o = h.length, m = null, f = [], b = 0; b < o; ++b) {
    if (l = h.charCodeAt(b), l > 55295 && l < 57344) {
      if (!m) {
        if (l > 56319) {
          (n -= 3) > -1 && f.push(239, 191, 189);
          continue;
        } else if (b + 1 === o) {
          (n -= 3) > -1 && f.push(239, 191, 189);
          continue;
        }
        m = l;
        continue;
      }
      if (l < 56320) {
        (n -= 3) > -1 && f.push(239, 191, 189), m = l;
        continue;
      }
      l = (m - 55296 << 10 | l - 56320) + 65536;
    } else
      m && (n -= 3) > -1 && f.push(239, 191, 189);
    if (m = null, l < 128) {
      if ((n -= 1) < 0)
        break;
      f.push(l);
    } else if (l < 2048) {
      if ((n -= 2) < 0)
        break;
      f.push(
        l >> 6 | 192,
        l & 63 | 128
      );
    } else if (l < 65536) {
      if ((n -= 3) < 0)
        break;
      f.push(
        l >> 12 | 224,
        l >> 6 & 63 | 128,
        l & 63 | 128
      );
    } else if (l < 1114112) {
      if ((n -= 4) < 0)
        break;
      f.push(
        l >> 18 | 240,
        l >> 12 & 63 | 128,
        l >> 6 & 63 | 128,
        l & 63 | 128
      );
    } else
      throw new Error("Invalid code point");
  }
  return f;
}
function yc(h) {
  for (var n = [], l = 0; l < h.length; ++l)
    n.push(h.charCodeAt(l) & 255);
  return n;
}
function wc(h, n) {
  for (var l, o, m, f = [], b = 0; b < h.length && !((n -= 2) < 0); ++b)
    l = h.charCodeAt(b), o = l >> 8, m = l % 256, f.push(m), f.push(o);
  return f;
}
function fs(h) {
  return Yd(mc(h));
}
function Nn(h, n, l, o) {
  for (var m = 0; m < o && !(m + l >= n.length || m >= h.length); ++m)
    n[m + l] = h[m];
  return m;
}
function Mc(h) {
  return h !== h;
}
function xc(h) {
  return h != null && (!!h._isBuffer || as(h) || _c(h));
}
function as(h) {
  return !!h.constructor && typeof h.constructor.isBuffer == "function" && h.constructor.isBuffer(h);
}
function _c(h) {
  return typeof h.readFloatLE == "function" && typeof h.slice == "function" && as(h.slice(0, 0));
}
var Zi = function(n, l) {
  for (var o = Math.min(n.length, l.length), m = new ut(o), f = 0; f < o; ++f)
    m[f] = n[f] ^ l[f];
  return m;
}, hs = Zi;
p0.encrypt = function(h, n) {
  var l = hs(n, h._prev);
  return h._prev = h._cipher.encryptBlock(l), h._prev;
};
p0.decrypt = function(h, n) {
  var l = h._prev;
  h._prev = n;
  var o = h._cipher.decryptBlock(n);
  return hs(o, l);
};
var ss = {}, Ii = Nt.Buffer, Sc = Zi;
function oa(h, n, l) {
  var o = n.length, m = Sc(n, h._cache);
  return h._cache = h._cache.slice(o), h._prev = Ii.concat([h._prev, l ? n : m]), m;
}
ss.encrypt = function(h, n, l) {
  for (var o = Ii.allocUnsafe(0), m; n.length; )
    if (h._cache.length === 0 && (h._cache = h._cipher.encryptBlock(h._prev), h._prev = Ii.allocUnsafe(0)), h._cache.length <= n.length)
      m = h._cache.length, o = Ii.concat([o, oa(h, n.slice(0, m), l)]), n = n.slice(m);
    else {
      o = Ii.concat([o, oa(h, n, l)]);
      break;
    }
  return o;
};
var os = {}, Gf = Nt.Buffer;
function Ac(h, n, l) {
  var o = h._cipher.encryptBlock(h._prev), m = o[0] ^ n;
  return h._prev = Gf.concat([
    h._prev.slice(1),
    Gf.from([l ? n : m])
  ]), m;
}
os.encrypt = function(h, n, l) {
  for (var o = n.length, m = Gf.allocUnsafe(o), f = -1; ++f < o; )
    m[f] = Ac(h, n[f], l);
  return m;
};
var us = {}, dn = Nt.Buffer;
function Bc(h, n, l) {
  for (var o, m = -1, f = 8, b = 0, w, _; ++m < f; )
    o = h._cipher.encryptBlock(h._prev), w = n & 1 << 7 - m ? 128 : 0, _ = o[0] ^ w, b += (_ & 128) >> m % 8, h._prev = Ec(h._prev, l ? w : _);
  return b;
}
function Ec(h, n) {
  var l = h.length, o = -1, m = dn.allocUnsafe(h.length);
  for (h = dn.concat([h, dn.from([n])]); ++o < l; )
    m[o] = h[o] << 1 | h[o + 1] >> 7;
  return m;
}
us.encrypt = function(h, n, l) {
  for (var o = n.length, m = dn.allocUnsafe(o), f = -1; ++f < o; )
    m[f] = Bc(h, n[f], l);
  return m;
};
var ls = {}, kc = Zi;
function Rc(h) {
  return h._prev = h._cipher.encryptBlock(h._prev), h._prev;
}
ls.encrypt = function(h, n) {
  for (; h._cache.length < n.length; )
    h._cache = ut.concat([h._cache, Rc(h)]);
  var l = h._cache.slice(0, n.length);
  return h._cache = h._cache.slice(n.length), kc(n, l);
};
var Xf = {};
function Ic(h) {
  for (var n = h.length, l; n--; )
    if (l = h.readUInt8(n), l === 255)
      h.writeUInt8(0, n);
    else {
      l++, h.writeUInt8(l, n);
      break;
    }
}
var ds = Ic, Tc = Zi, ua = Nt.Buffer, Cc = ds;
function qc(h) {
  var n = h._cipher.encryptBlockRaw(h._prev);
  return Cc(h._prev), n;
}
var sf = 16;
Xf.encrypt = function(h, n) {
  var l = Math.ceil(n.length / sf), o = h._cache.length;
  h._cache = ua.concat([
    h._cache,
    ua.allocUnsafe(l * sf)
  ]);
  for (var m = 0; m < l; m++) {
    var f = qc(h), b = o + m * sf;
    h._cache.writeUInt32BE(f[0], b + 0), h._cache.writeUInt32BE(f[1], b + 4), h._cache.writeUInt32BE(f[2], b + 8), h._cache.writeUInt32BE(f[3], b + 12);
  }
  var w = h._cache.slice(0, n.length);
  return h._cache = h._cache.slice(n.length), Tc(n, w);
};
const Pc = {
  cipher: "AES",
  key: 128,
  iv: 16,
  mode: "CBC",
  type: "block"
}, Dc = {
  cipher: "AES",
  key: 192,
  iv: 16,
  mode: "CBC",
  type: "block"
}, Nc = {
  cipher: "AES",
  key: 256,
  iv: 16,
  mode: "CBC",
  type: "block"
}, cs = {
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
  aes128: Pc,
  aes192: Dc,
  aes256: Nc,
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
var $c = {
  ECB: v0,
  CBC: p0,
  CFB: ss,
  CFB8: os,
  CFB1: us,
  OFB: ls,
  CTR: Xf,
  GCM: Xf
}, cn = cs;
for (var la in cn)
  cn[la].module = $c[cn[la].mode];
var y0 = cn, Wi = {}, yn = Nt.Buffer;
function w0(h) {
  yn.isBuffer(h) || (h = yn.from(h));
  for (var n = h.length / 4 | 0, l = new Array(n), o = 0; o < n; o++)
    l[o] = h.readUInt32BE(o * 4);
  return l;
}
function of(h) {
  for (var n = 0; n < h.length; h++)
    h[n] = 0;
}
function vs(h, n, l, o, m) {
  for (var f = l[0], b = l[1], w = l[2], _ = l[3], S = h[0] ^ n[0], y = h[1] ^ n[1], x = h[2] ^ n[2], B = h[3] ^ n[3], A, T, D, O, N = 4, q = 1; q < m; q++)
    A = f[S >>> 24] ^ b[y >>> 16 & 255] ^ w[x >>> 8 & 255] ^ _[B & 255] ^ n[N++], T = f[y >>> 24] ^ b[x >>> 16 & 255] ^ w[B >>> 8 & 255] ^ _[S & 255] ^ n[N++], D = f[x >>> 24] ^ b[B >>> 16 & 255] ^ w[S >>> 8 & 255] ^ _[y & 255] ^ n[N++], O = f[B >>> 24] ^ b[S >>> 16 & 255] ^ w[y >>> 8 & 255] ^ _[x & 255] ^ n[N++], S = A, y = T, x = D, B = O;
  return A = (o[S >>> 24] << 24 | o[y >>> 16 & 255] << 16 | o[x >>> 8 & 255] << 8 | o[B & 255]) ^ n[N++], T = (o[y >>> 24] << 24 | o[x >>> 16 & 255] << 16 | o[B >>> 8 & 255] << 8 | o[S & 255]) ^ n[N++], D = (o[x >>> 24] << 24 | o[B >>> 16 & 255] << 16 | o[S >>> 8 & 255] << 8 | o[y & 255]) ^ n[N++], O = (o[B >>> 24] << 24 | o[S >>> 16 & 255] << 16 | o[y >>> 8 & 255] << 8 | o[x & 255]) ^ n[N++], A = A >>> 0, T = T >>> 0, D = D >>> 0, O = O >>> 0, [A, T, D, O];
}
var Fc = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], be = function() {
  for (var h = new Array(256), n = 0; n < 256; n++)
    n < 128 ? h[n] = n << 1 : h[n] = n << 1 ^ 283;
  for (var l = [], o = [], m = [[], [], [], []], f = [[], [], [], []], b = 0, w = 0, _ = 0; _ < 256; ++_) {
    var S = w ^ w << 1 ^ w << 2 ^ w << 3 ^ w << 4;
    S = S >>> 8 ^ S & 255 ^ 99, l[b] = S, o[S] = b;
    var y = h[b], x = h[y], B = h[x], A = h[S] * 257 ^ S * 16843008;
    m[0][b] = A << 24 | A >>> 8, m[1][b] = A << 16 | A >>> 16, m[2][b] = A << 8 | A >>> 24, m[3][b] = A, A = B * 16843009 ^ x * 65537 ^ y * 257 ^ b * 16843008, f[0][S] = A << 24 | A >>> 8, f[1][S] = A << 16 | A >>> 16, f[2][S] = A << 8 | A >>> 24, f[3][S] = A, b === 0 ? b = w = 1 : (b = y ^ h[h[h[B ^ y]]], w ^= h[h[w]]);
  }
  return {
    SBOX: l,
    INV_SBOX: o,
    SUB_MIX: m,
    INV_SUB_MIX: f
  };
}();
function ze(h) {
  this._key = w0(h), this._reset();
}
ze.blockSize = 4 * 4;
ze.keySize = 256 / 8;
ze.prototype.blockSize = ze.blockSize;
ze.prototype.keySize = ze.keySize;
ze.prototype._reset = function() {
  for (var h = this._key, n = h.length, l = n + 6, o = (l + 1) * 4, m = [], f = 0; f < n; f++)
    m[f] = h[f];
  for (f = n; f < o; f++) {
    var b = m[f - 1];
    f % n === 0 ? (b = b << 8 | b >>> 24, b = be.SBOX[b >>> 24] << 24 | be.SBOX[b >>> 16 & 255] << 16 | be.SBOX[b >>> 8 & 255] << 8 | be.SBOX[b & 255], b ^= Fc[f / n | 0] << 24) : n > 6 && f % n === 4 && (b = be.SBOX[b >>> 24] << 24 | be.SBOX[b >>> 16 & 255] << 16 | be.SBOX[b >>> 8 & 255] << 8 | be.SBOX[b & 255]), m[f] = m[f - n] ^ b;
  }
  for (var w = [], _ = 0; _ < o; _++) {
    var S = o - _, y = m[S - (_ % 4 ? 0 : 4)];
    _ < 4 || S <= 4 ? w[_] = y : w[_] = be.INV_SUB_MIX[0][be.SBOX[y >>> 24]] ^ be.INV_SUB_MIX[1][be.SBOX[y >>> 16 & 255]] ^ be.INV_SUB_MIX[2][be.SBOX[y >>> 8 & 255]] ^ be.INV_SUB_MIX[3][be.SBOX[y & 255]];
  }
  this._nRounds = l, this._keySchedule = m, this._invKeySchedule = w;
};
ze.prototype.encryptBlockRaw = function(h) {
  return h = w0(h), vs(h, this._keySchedule, be.SUB_MIX, be.SBOX, this._nRounds);
};
ze.prototype.encryptBlock = function(h) {
  var n = this.encryptBlockRaw(h), l = yn.allocUnsafe(16);
  return l.writeUInt32BE(n[0], 0), l.writeUInt32BE(n[1], 4), l.writeUInt32BE(n[2], 8), l.writeUInt32BE(n[3], 12), l;
};
ze.prototype.decryptBlock = function(h) {
  h = w0(h);
  var n = h[1];
  h[1] = h[3], h[3] = n;
  var l = vs(h, this._invKeySchedule, be.INV_SUB_MIX, be.INV_SBOX, this._nRounds), o = yn.allocUnsafe(16);
  return o.writeUInt32BE(l[0], 0), o.writeUInt32BE(l[3], 4), o.writeUInt32BE(l[2], 8), o.writeUInt32BE(l[1], 12), o;
};
ze.prototype.scrub = function() {
  of(this._keySchedule), of(this._invKeySchedule), of(this._key);
};
Wi.AES = ze;
var ii = Nt.Buffer, Lc = ii.alloc(16, 0);
function Oc(h) {
  return [
    h.readUInt32BE(0),
    h.readUInt32BE(4),
    h.readUInt32BE(8),
    h.readUInt32BE(12)
  ];
}
function ps(h) {
  var n = ii.allocUnsafe(16);
  return n.writeUInt32BE(h[0] >>> 0, 0), n.writeUInt32BE(h[1] >>> 0, 4), n.writeUInt32BE(h[2] >>> 0, 8), n.writeUInt32BE(h[3] >>> 0, 12), n;
}
function Vi(h) {
  this.h = h, this.state = ii.alloc(16, 0), this.cache = ii.allocUnsafe(0);
}
Vi.prototype.ghash = function(h) {
  for (var n = -1; ++n < h.length; )
    this.state[n] ^= h[n];
  this._multiply();
};
Vi.prototype._multiply = function() {
  for (var h = Oc(this.h), n = [0, 0, 0, 0], l, o, m, f = -1; ++f < 128; ) {
    for (o = (this.state[~~(f / 8)] & 1 << 7 - f % 8) !== 0, o && (n[0] ^= h[0], n[1] ^= h[1], n[2] ^= h[2], n[3] ^= h[3]), m = (h[3] & 1) !== 0, l = 3; l > 0; l--)
      h[l] = h[l] >>> 1 | (h[l - 1] & 1) << 31;
    h[0] = h[0] >>> 1, m && (h[0] = h[0] ^ 225 << 24);
  }
  this.state = ps(n);
};
Vi.prototype.update = function(h) {
  this.cache = ii.concat([this.cache, h]);
  for (var n; this.cache.length >= 16; )
    n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(n);
};
Vi.prototype.final = function(h, n) {
  return this.cache.length && this.ghash(ii.concat([this.cache, Lc], 16)), this.ghash(ps([0, h, 0, n])), this.state;
};
var Uc = Vi, zc = Wi, Pe = Nt.Buffer, ms = qr, Kc = Jt, gs = Uc, Hc = Zi, Zc = ds;
function Wc(h, n) {
  var l = 0;
  h.length !== n.length && l++;
  for (var o = Math.min(h.length, n.length), m = 0; m < o; ++m)
    l += h[m] ^ n[m];
  return l;
}
function Vc(h, n, l) {
  if (n.length === 12)
    return h._finID = Pe.concat([n, Pe.from([0, 0, 0, 1])]), Pe.concat([n, Pe.from([0, 0, 0, 2])]);
  var o = new gs(l), m = n.length, f = m % 16;
  o.update(n), f && (f = 16 - f, o.update(Pe.alloc(f, 0))), o.update(Pe.alloc(8, 0));
  var b = m * 8, w = Pe.alloc(8);
  w.writeUIntBE(b, 0, 8), o.update(w), h._finID = o.state;
  var _ = Pe.from(h._finID);
  return Zc(_), _;
}
function Gr(h, n, l, o) {
  ms.call(this);
  var m = Pe.alloc(4, 0);
  this._cipher = new zc.AES(n);
  var f = this._cipher.encryptBlock(m);
  this._ghash = new gs(f), l = Vc(this, l, f), this._prev = Pe.from(l), this._cache = Pe.allocUnsafe(0), this._secCache = Pe.allocUnsafe(0), this._decrypt = o, this._alen = 0, this._len = 0, this._mode = h, this._authTag = null, this._called = !1;
}
Kc(Gr, ms);
Gr.prototype._update = function(h) {
  if (!this._called && this._alen) {
    var n = 16 - this._alen % 16;
    n < 16 && (n = Pe.alloc(n, 0), this._ghash.update(n));
  }
  this._called = !0;
  var l = this._mode.encrypt(this, h);
  return this._decrypt ? this._ghash.update(h) : this._ghash.update(l), this._len += h.length, l;
};
Gr.prototype._final = function() {
  if (this._decrypt && !this._authTag)
    throw new Error("Unsupported state or unable to authenticate data");
  var h = Hc(this._ghash.final(this._alen * 8, this._len * 8), this._cipher.encryptBlock(this._finID));
  if (this._decrypt && Wc(h, this._authTag))
    throw new Error("Unsupported state or unable to authenticate data");
  this._authTag = h, this._cipher.scrub();
};
Gr.prototype.getAuthTag = function() {
  if (this._decrypt || !Pe.isBuffer(this._authTag))
    throw new Error("Attempting to get auth tag in unsupported state");
  return this._authTag;
};
Gr.prototype.setAuthTag = function(n) {
  if (!this._decrypt)
    throw new Error("Attempting to set auth tag in unsupported state");
  this._authTag = n;
};
Gr.prototype.setAAD = function(n) {
  if (this._called)
    throw new Error("Attempting to set AAD in unsupported state");
  this._ghash.update(n), this._alen += n.length;
};
var bs = Gr, Yc = Wi, uf = Nt.Buffer, ys = qr, Jc = Jt;
function $n(h, n, l, o) {
  ys.call(this), this._cipher = new Yc.AES(n), this._prev = uf.from(l), this._cache = uf.allocUnsafe(0), this._secCache = uf.allocUnsafe(0), this._decrypt = o, this._mode = h;
}
Jc($n, ys);
$n.prototype._update = function(h) {
  return this._mode.encrypt(this, h, this._decrypt);
};
$n.prototype._final = function() {
  this._cipher.scrub();
};
var ws = $n, Nr = Nt.Buffer, Gc = s0;
function Xc(h, n, l, o) {
  if (Nr.isBuffer(h) || (h = Nr.from(h, "binary")), n && (Nr.isBuffer(n) || (n = Nr.from(n, "binary")), n.length !== 8))
    throw new RangeError("salt should be Buffer with 8 byte length");
  for (var m = l / 8, f = Nr.alloc(m), b = Nr.alloc(o || 0), w = Nr.alloc(0); m > 0 || o > 0; ) {
    var _ = new Gc();
    _.update(w), _.update(h), n && _.update(n), w = _.digest();
    var S = 0;
    if (m > 0) {
      var y = f.length - m;
      S = Math.min(m, w.length), w.copy(f, y, 0, S), m -= S;
    }
    if (S < w.length && o > 0) {
      var x = b.length - o, B = Math.min(o, w.length - S);
      w.copy(b, x, S, S + B), o -= B;
    }
  }
  return w.fill(0), { key: f, iv: b };
}
var Fn = Xc, Ms = y0, jc = bs, wr = Nt.Buffer, Qc = ws, xs = qr, t1 = Wi, e1 = Fn, r1 = Jt;
function Yi(h, n, l) {
  xs.call(this), this._cache = new Ln(), this._cipher = new t1.AES(n), this._prev = wr.from(l), this._mode = h, this._autopadding = !0;
}
r1(Yi, xs);
Yi.prototype._update = function(h) {
  this._cache.add(h);
  for (var n, l, o = []; n = this._cache.get(); )
    l = this._mode.encrypt(this, n), o.push(l);
  return wr.concat(o);
};
var i1 = wr.alloc(16, 16);
Yi.prototype._final = function() {
  var h = this._cache.flush();
  if (this._autopadding)
    return h = this._mode.encrypt(this, h), this._cipher.scrub(), h;
  if (!h.equals(i1))
    throw this._cipher.scrub(), new Error("data not multiple of block length");
};
Yi.prototype.setAutoPadding = function(h) {
  return this._autopadding = !!h, this;
};
function Ln() {
  this.cache = wr.allocUnsafe(0);
}
Ln.prototype.add = function(h) {
  this.cache = wr.concat([this.cache, h]);
};
Ln.prototype.get = function() {
  if (this.cache.length > 15) {
    var h = this.cache.slice(0, 16);
    return this.cache = this.cache.slice(16), h;
  }
  return null;
};
Ln.prototype.flush = function() {
  for (var h = 16 - this.cache.length, n = wr.allocUnsafe(h), l = -1; ++l < h; )
    n.writeUInt8(h, l);
  return wr.concat([this.cache, n]);
};
function _s(h, n, l) {
  var o = Ms[h.toLowerCase()];
  if (!o)
    throw new TypeError("invalid suite type");
  if (typeof n == "string" && (n = wr.from(n)), n.length !== o.key / 8)
    throw new TypeError("invalid key length " + n.length);
  if (typeof l == "string" && (l = wr.from(l)), o.mode !== "GCM" && l.length !== o.iv)
    throw new TypeError("invalid iv length " + l.length);
  return o.type === "stream" ? new Qc(o.module, n, l) : o.type === "auth" ? new jc(o.module, n, l) : new Yi(o.module, n, l);
}
function n1(h, n) {
  var l = Ms[h.toLowerCase()];
  if (!l)
    throw new TypeError("invalid suite type");
  var o = e1(n, !1, l.key, l.iv);
  return _s(h, o.key, o.iv);
}
c0.createCipheriv = _s;
c0.createCipher = n1;
var M0 = {}, f1 = bs, ni = Nt.Buffer, Ss = y0, a1 = ws, As = qr, h1 = Wi, s1 = Fn, o1 = Jt;
function Ji(h, n, l) {
  As.call(this), this._cache = new On(), this._last = void 0, this._cipher = new h1.AES(n), this._prev = ni.from(l), this._mode = h, this._autopadding = !0;
}
o1(Ji, As);
Ji.prototype._update = function(h) {
  this._cache.add(h);
  for (var n, l, o = []; n = this._cache.get(this._autopadding); )
    l = this._mode.decrypt(this, n), o.push(l);
  return ni.concat(o);
};
Ji.prototype._final = function() {
  var h = this._cache.flush();
  if (this._autopadding)
    return u1(this._mode.decrypt(this, h));
  if (h)
    throw new Error("data not multiple of block length");
};
Ji.prototype.setAutoPadding = function(h) {
  return this._autopadding = !!h, this;
};
function On() {
  this.cache = ni.allocUnsafe(0);
}
On.prototype.add = function(h) {
  this.cache = ni.concat([this.cache, h]);
};
On.prototype.get = function(h) {
  var n;
  if (h) {
    if (this.cache.length > 16)
      return n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), n;
  } else if (this.cache.length >= 16)
    return n = this.cache.slice(0, 16), this.cache = this.cache.slice(16), n;
  return null;
};
On.prototype.flush = function() {
  if (this.cache.length)
    return this.cache;
};
function u1(h) {
  var n = h[15];
  if (n < 1 || n > 16)
    throw new Error("unable to decrypt data");
  for (var l = -1; ++l < n; )
    if (h[l + (16 - n)] !== n)
      throw new Error("unable to decrypt data");
  if (n !== 16)
    return h.slice(0, 16 - n);
}
function Bs(h, n, l) {
  var o = Ss[h.toLowerCase()];
  if (!o)
    throw new TypeError("invalid suite type");
  if (typeof l == "string" && (l = ni.from(l)), o.mode !== "GCM" && l.length !== o.iv)
    throw new TypeError("invalid iv length " + l.length);
  if (typeof n == "string" && (n = ni.from(n)), n.length !== o.key / 8)
    throw new TypeError("invalid key length " + n.length);
  return o.type === "stream" ? new a1(o.module, n, l, !0) : o.type === "auth" ? new f1(o.module, n, l, !0) : new Ji(o.module, n, l);
}
function l1(h, n) {
  var l = Ss[h.toLowerCase()];
  if (!l)
    throw new TypeError("invalid suite type");
  var o = s1(n, !1, l.key, l.iv);
  return Bs(h, o.key, o.iv);
}
M0.createDecipher = l1;
M0.createDecipheriv = Bs;
var Es = c0, ks = M0, d1 = cs;
function c1() {
  return Object.keys(d1);
}
Fe.createCipher = Fe.Cipher = Es.createCipher;
Fe.createCipheriv = Fe.Cipheriv = Es.createCipheriv;
Fe.createDecipher = Fe.Decipher = ks.createDecipher;
Fe.createDecipheriv = Fe.Decipheriv = ks.createDecipheriv;
Fe.listCiphers = Fe.getCiphers = c1;
var Rs = {};
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
})(Rs);
var Is = Wd, x0 = Fe, Ir = y0, yr = Rs, Ts = Fn;
function v1(h, n) {
  h = h.toLowerCase();
  var l, o;
  if (Ir[h])
    l = Ir[h].key, o = Ir[h].iv;
  else if (yr[h])
    l = yr[h].key * 8, o = yr[h].iv;
  else
    throw new TypeError("invalid suite type");
  var m = Ts(n, !1, l, o);
  return Cs(h, m.key, m.iv);
}
function p1(h, n) {
  h = h.toLowerCase();
  var l, o;
  if (Ir[h])
    l = Ir[h].key, o = Ir[h].iv;
  else if (yr[h])
    l = yr[h].key * 8, o = yr[h].iv;
  else
    throw new TypeError("invalid suite type");
  var m = Ts(n, !1, l, o);
  return qs(h, m.key, m.iv);
}
function Cs(h, n, l) {
  if (h = h.toLowerCase(), Ir[h])
    return x0.createCipheriv(h, n, l);
  if (yr[h])
    return new Is({ key: n, iv: l, mode: h });
  throw new TypeError("invalid suite type");
}
function qs(h, n, l) {
  if (h = h.toLowerCase(), Ir[h])
    return x0.createDecipheriv(h, n, l);
  if (yr[h])
    return new Is({ key: n, iv: l, mode: h, decrypt: !0 });
  throw new TypeError("invalid suite type");
}
function m1() {
  return Object.keys(yr).concat(x0.getCiphers());
}
Ge.createCipher = Ge.Cipher = v1;
Ge.createCipheriv = Ge.Cipheriv = Cs;
Ge.createDecipher = Ge.Decipher = p1;
Ge.createDecipheriv = Ge.Decipheriv = qs;
Ge.listCiphers = Ge.getCiphers = m1;
var $r = {}, _0 = { exports: {} };
_0.exports;
(function(h) {
  (function(n, l) {
    function o(p, t) {
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
    typeof n == "object" ? n.exports = f : l.BN = f, f.BN = f, f.wordSize = 26;
    var b;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? b = window.Buffer : b = ge.Buffer;
    } catch {
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
      r === "hex" && (r = 16), o(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (o(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (o(typeof t.length == "number"), t.length <= 0)
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
    function w(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function _(p, t, r) {
      var i = w(p, r);
      return r - 1 >= t && (i |= w(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var s = t.length - r;
        for (a = s % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function S(p, t, r, i) {
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
      for (var c = t.length - i, v = c % a, s = Math.min(c, c - v) + i, e = 0, u = i; u < s; u += a)
        e = S(t, u, u + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var g = 1;
        for (e = S(t, u, t.length, r), u = 0; u < v; u++)
          g *= r;
        this.imuln(g), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    var y = [
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
    ], B = [
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
          var v = this.words[c], s = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = y[6 - s.length] + s + i : i = s + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], u = B[t];
        i = "";
        var g = this.clone();
        for (g.negative = 0; !g.isZero(); ) {
          var M = g.modn(u).toString(t);
          g = g.idivn(u), g.isZero() ? i = M + i : i = y[e - M.length] + M + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      o(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && o(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return o(typeof b < "u"), this.toArrayLike(b, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var a = this.byteLength(), d = i || Math.max(1, a);
      o(a <= d, "byte array longer than desired length"), o(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), s, e, u = this.clone();
      if (c) {
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[e] = s;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
          v[e] = 0;
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[d - e - 1] = s;
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
    function A(p) {
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
      return o((this.negative | t.negative) === 0), this.iuor(t);
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
      return o((this.negative | t.negative) === 0), this.iuand(t);
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
      return o((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      o(typeof t == "number" && t >= 0);
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
    function T(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, s = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var u = s >>> 26, g = s & 67108863, M = Math.min(e, t.length - 1), k = Math.max(0, e - p.length + 1); k <= M; k++) {
          var R = e - k | 0;
          a = p.words[R] | 0, d = t.words[k] | 0, c = a * d + g, u += c / 67108864 | 0, g = c & 67108863;
        }
        r.words[e] = g | 0, s = u | 0;
      }
      return s !== 0 ? r.words[e] = s | 0 : r.length--, r.strip();
    }
    var D = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, s, e, u, g = a[0] | 0, M = g & 8191, k = g >>> 13, R = a[1] | 0, P = R & 8191, E = R >>> 13, I = a[2] | 0, C = I & 8191, $ = I >>> 13, Bt = a[3] | 0, L = Bt & 8191, z = Bt >>> 13, Ct = a[4] | 0, H = Ct & 8191, st = Ct >>> 13, Dt = a[5] | 0, Z = Dt & 8191, ot = Dt >>> 13, qt = a[6] | 0, W = qt & 8191, ht = qt >>> 13, Rt = a[7] | 0, K = Rt & 8191, at = Rt >>> 13, $t = a[8] | 0, V = $t & 8191, lt = $t >>> 13, Ft = a[9] | 0, Y = Ft & 8191, dt = Ft >>> 13, Lt = d[0] | 0, J = Lt & 8191, ct = Lt >>> 13, Ot = d[1] | 0, G = Ot & 8191, vt = Ot >>> 13, Ut = d[2] | 0, X = Ut & 8191, pt = Ut >>> 13, zt = d[3] | 0, j = zt & 8191, mt = zt >>> 13, Kt = d[4] | 0, Q = Kt & 8191, gt = Kt >>> 13, Ht = d[5] | 0, tt = Ht & 8191, bt = Ht >>> 13, Zt = d[6] | 0, et = Zt & 8191, yt = Zt >>> 13, Wt = d[7] | 0, rt = Wt & 8191, wt = Wt >>> 13, Vt = d[8] | 0, it = Vt & 8191, Mt = Vt >>> 13, Yt = d[9] | 0, nt = Yt & 8191, xt = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, s = Math.imul(M, J), e = Math.imul(M, ct), e = e + Math.imul(k, J) | 0, u = Math.imul(k, ct);
      var It = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (It >>> 26) | 0, It &= 67108863, s = Math.imul(P, J), e = Math.imul(P, ct), e = e + Math.imul(E, J) | 0, u = Math.imul(E, ct), s = s + Math.imul(M, G) | 0, e = e + Math.imul(M, vt) | 0, e = e + Math.imul(k, G) | 0, u = u + Math.imul(k, vt) | 0;
      var Tt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Tt >>> 26) | 0, Tt &= 67108863, s = Math.imul(C, J), e = Math.imul(C, ct), e = e + Math.imul($, J) | 0, u = Math.imul($, ct), s = s + Math.imul(P, G) | 0, e = e + Math.imul(P, vt) | 0, e = e + Math.imul(E, G) | 0, u = u + Math.imul(E, vt) | 0, s = s + Math.imul(M, X) | 0, e = e + Math.imul(M, pt) | 0, e = e + Math.imul(k, X) | 0, u = u + Math.imul(k, pt) | 0;
      var jt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, s = Math.imul(L, J), e = Math.imul(L, ct), e = e + Math.imul(z, J) | 0, u = Math.imul(z, ct), s = s + Math.imul(C, G) | 0, e = e + Math.imul(C, vt) | 0, e = e + Math.imul($, G) | 0, u = u + Math.imul($, vt) | 0, s = s + Math.imul(P, X) | 0, e = e + Math.imul(P, pt) | 0, e = e + Math.imul(E, X) | 0, u = u + Math.imul(E, pt) | 0, s = s + Math.imul(M, j) | 0, e = e + Math.imul(M, mt) | 0, e = e + Math.imul(k, j) | 0, u = u + Math.imul(k, mt) | 0;
      var Qt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, s = Math.imul(H, J), e = Math.imul(H, ct), e = e + Math.imul(st, J) | 0, u = Math.imul(st, ct), s = s + Math.imul(L, G) | 0, e = e + Math.imul(L, vt) | 0, e = e + Math.imul(z, G) | 0, u = u + Math.imul(z, vt) | 0, s = s + Math.imul(C, X) | 0, e = e + Math.imul(C, pt) | 0, e = e + Math.imul($, X) | 0, u = u + Math.imul($, pt) | 0, s = s + Math.imul(P, j) | 0, e = e + Math.imul(P, mt) | 0, e = e + Math.imul(E, j) | 0, u = u + Math.imul(E, mt) | 0, s = s + Math.imul(M, Q) | 0, e = e + Math.imul(M, gt) | 0, e = e + Math.imul(k, Q) | 0, u = u + Math.imul(k, gt) | 0;
      var te = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, s = Math.imul(Z, J), e = Math.imul(Z, ct), e = e + Math.imul(ot, J) | 0, u = Math.imul(ot, ct), s = s + Math.imul(H, G) | 0, e = e + Math.imul(H, vt) | 0, e = e + Math.imul(st, G) | 0, u = u + Math.imul(st, vt) | 0, s = s + Math.imul(L, X) | 0, e = e + Math.imul(L, pt) | 0, e = e + Math.imul(z, X) | 0, u = u + Math.imul(z, pt) | 0, s = s + Math.imul(C, j) | 0, e = e + Math.imul(C, mt) | 0, e = e + Math.imul($, j) | 0, u = u + Math.imul($, mt) | 0, s = s + Math.imul(P, Q) | 0, e = e + Math.imul(P, gt) | 0, e = e + Math.imul(E, Q) | 0, u = u + Math.imul(E, gt) | 0, s = s + Math.imul(M, tt) | 0, e = e + Math.imul(M, bt) | 0, e = e + Math.imul(k, tt) | 0, u = u + Math.imul(k, bt) | 0;
      var ee = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, s = Math.imul(W, J), e = Math.imul(W, ct), e = e + Math.imul(ht, J) | 0, u = Math.imul(ht, ct), s = s + Math.imul(Z, G) | 0, e = e + Math.imul(Z, vt) | 0, e = e + Math.imul(ot, G) | 0, u = u + Math.imul(ot, vt) | 0, s = s + Math.imul(H, X) | 0, e = e + Math.imul(H, pt) | 0, e = e + Math.imul(st, X) | 0, u = u + Math.imul(st, pt) | 0, s = s + Math.imul(L, j) | 0, e = e + Math.imul(L, mt) | 0, e = e + Math.imul(z, j) | 0, u = u + Math.imul(z, mt) | 0, s = s + Math.imul(C, Q) | 0, e = e + Math.imul(C, gt) | 0, e = e + Math.imul($, Q) | 0, u = u + Math.imul($, gt) | 0, s = s + Math.imul(P, tt) | 0, e = e + Math.imul(P, bt) | 0, e = e + Math.imul(E, tt) | 0, u = u + Math.imul(E, bt) | 0, s = s + Math.imul(M, et) | 0, e = e + Math.imul(M, yt) | 0, e = e + Math.imul(k, et) | 0, u = u + Math.imul(k, yt) | 0;
      var re = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, s = Math.imul(K, J), e = Math.imul(K, ct), e = e + Math.imul(at, J) | 0, u = Math.imul(at, ct), s = s + Math.imul(W, G) | 0, e = e + Math.imul(W, vt) | 0, e = e + Math.imul(ht, G) | 0, u = u + Math.imul(ht, vt) | 0, s = s + Math.imul(Z, X) | 0, e = e + Math.imul(Z, pt) | 0, e = e + Math.imul(ot, X) | 0, u = u + Math.imul(ot, pt) | 0, s = s + Math.imul(H, j) | 0, e = e + Math.imul(H, mt) | 0, e = e + Math.imul(st, j) | 0, u = u + Math.imul(st, mt) | 0, s = s + Math.imul(L, Q) | 0, e = e + Math.imul(L, gt) | 0, e = e + Math.imul(z, Q) | 0, u = u + Math.imul(z, gt) | 0, s = s + Math.imul(C, tt) | 0, e = e + Math.imul(C, bt) | 0, e = e + Math.imul($, tt) | 0, u = u + Math.imul($, bt) | 0, s = s + Math.imul(P, et) | 0, e = e + Math.imul(P, yt) | 0, e = e + Math.imul(E, et) | 0, u = u + Math.imul(E, yt) | 0, s = s + Math.imul(M, rt) | 0, e = e + Math.imul(M, wt) | 0, e = e + Math.imul(k, rt) | 0, u = u + Math.imul(k, wt) | 0;
      var ie = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, s = Math.imul(V, J), e = Math.imul(V, ct), e = e + Math.imul(lt, J) | 0, u = Math.imul(lt, ct), s = s + Math.imul(K, G) | 0, e = e + Math.imul(K, vt) | 0, e = e + Math.imul(at, G) | 0, u = u + Math.imul(at, vt) | 0, s = s + Math.imul(W, X) | 0, e = e + Math.imul(W, pt) | 0, e = e + Math.imul(ht, X) | 0, u = u + Math.imul(ht, pt) | 0, s = s + Math.imul(Z, j) | 0, e = e + Math.imul(Z, mt) | 0, e = e + Math.imul(ot, j) | 0, u = u + Math.imul(ot, mt) | 0, s = s + Math.imul(H, Q) | 0, e = e + Math.imul(H, gt) | 0, e = e + Math.imul(st, Q) | 0, u = u + Math.imul(st, gt) | 0, s = s + Math.imul(L, tt) | 0, e = e + Math.imul(L, bt) | 0, e = e + Math.imul(z, tt) | 0, u = u + Math.imul(z, bt) | 0, s = s + Math.imul(C, et) | 0, e = e + Math.imul(C, yt) | 0, e = e + Math.imul($, et) | 0, u = u + Math.imul($, yt) | 0, s = s + Math.imul(P, rt) | 0, e = e + Math.imul(P, wt) | 0, e = e + Math.imul(E, rt) | 0, u = u + Math.imul(E, wt) | 0, s = s + Math.imul(M, it) | 0, e = e + Math.imul(M, Mt) | 0, e = e + Math.imul(k, it) | 0, u = u + Math.imul(k, Mt) | 0;
      var ne = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, s = Math.imul(Y, J), e = Math.imul(Y, ct), e = e + Math.imul(dt, J) | 0, u = Math.imul(dt, ct), s = s + Math.imul(V, G) | 0, e = e + Math.imul(V, vt) | 0, e = e + Math.imul(lt, G) | 0, u = u + Math.imul(lt, vt) | 0, s = s + Math.imul(K, X) | 0, e = e + Math.imul(K, pt) | 0, e = e + Math.imul(at, X) | 0, u = u + Math.imul(at, pt) | 0, s = s + Math.imul(W, j) | 0, e = e + Math.imul(W, mt) | 0, e = e + Math.imul(ht, j) | 0, u = u + Math.imul(ht, mt) | 0, s = s + Math.imul(Z, Q) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(ot, Q) | 0, u = u + Math.imul(ot, gt) | 0, s = s + Math.imul(H, tt) | 0, e = e + Math.imul(H, bt) | 0, e = e + Math.imul(st, tt) | 0, u = u + Math.imul(st, bt) | 0, s = s + Math.imul(L, et) | 0, e = e + Math.imul(L, yt) | 0, e = e + Math.imul(z, et) | 0, u = u + Math.imul(z, yt) | 0, s = s + Math.imul(C, rt) | 0, e = e + Math.imul(C, wt) | 0, e = e + Math.imul($, rt) | 0, u = u + Math.imul($, wt) | 0, s = s + Math.imul(P, it) | 0, e = e + Math.imul(P, Mt) | 0, e = e + Math.imul(E, it) | 0, u = u + Math.imul(E, Mt) | 0, s = s + Math.imul(M, nt) | 0, e = e + Math.imul(M, xt) | 0, e = e + Math.imul(k, nt) | 0, u = u + Math.imul(k, xt) | 0;
      var fe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, s = Math.imul(Y, G), e = Math.imul(Y, vt), e = e + Math.imul(dt, G) | 0, u = Math.imul(dt, vt), s = s + Math.imul(V, X) | 0, e = e + Math.imul(V, pt) | 0, e = e + Math.imul(lt, X) | 0, u = u + Math.imul(lt, pt) | 0, s = s + Math.imul(K, j) | 0, e = e + Math.imul(K, mt) | 0, e = e + Math.imul(at, j) | 0, u = u + Math.imul(at, mt) | 0, s = s + Math.imul(W, Q) | 0, e = e + Math.imul(W, gt) | 0, e = e + Math.imul(ht, Q) | 0, u = u + Math.imul(ht, gt) | 0, s = s + Math.imul(Z, tt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(ot, tt) | 0, u = u + Math.imul(ot, bt) | 0, s = s + Math.imul(H, et) | 0, e = e + Math.imul(H, yt) | 0, e = e + Math.imul(st, et) | 0, u = u + Math.imul(st, yt) | 0, s = s + Math.imul(L, rt) | 0, e = e + Math.imul(L, wt) | 0, e = e + Math.imul(z, rt) | 0, u = u + Math.imul(z, wt) | 0, s = s + Math.imul(C, it) | 0, e = e + Math.imul(C, Mt) | 0, e = e + Math.imul($, it) | 0, u = u + Math.imul($, Mt) | 0, s = s + Math.imul(P, nt) | 0, e = e + Math.imul(P, xt) | 0, e = e + Math.imul(E, nt) | 0, u = u + Math.imul(E, xt) | 0;
      var ae = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, s = Math.imul(Y, X), e = Math.imul(Y, pt), e = e + Math.imul(dt, X) | 0, u = Math.imul(dt, pt), s = s + Math.imul(V, j) | 0, e = e + Math.imul(V, mt) | 0, e = e + Math.imul(lt, j) | 0, u = u + Math.imul(lt, mt) | 0, s = s + Math.imul(K, Q) | 0, e = e + Math.imul(K, gt) | 0, e = e + Math.imul(at, Q) | 0, u = u + Math.imul(at, gt) | 0, s = s + Math.imul(W, tt) | 0, e = e + Math.imul(W, bt) | 0, e = e + Math.imul(ht, tt) | 0, u = u + Math.imul(ht, bt) | 0, s = s + Math.imul(Z, et) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(ot, et) | 0, u = u + Math.imul(ot, yt) | 0, s = s + Math.imul(H, rt) | 0, e = e + Math.imul(H, wt) | 0, e = e + Math.imul(st, rt) | 0, u = u + Math.imul(st, wt) | 0, s = s + Math.imul(L, it) | 0, e = e + Math.imul(L, Mt) | 0, e = e + Math.imul(z, it) | 0, u = u + Math.imul(z, Mt) | 0, s = s + Math.imul(C, nt) | 0, e = e + Math.imul(C, xt) | 0, e = e + Math.imul($, nt) | 0, u = u + Math.imul($, xt) | 0;
      var he = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, s = Math.imul(Y, j), e = Math.imul(Y, mt), e = e + Math.imul(dt, j) | 0, u = Math.imul(dt, mt), s = s + Math.imul(V, Q) | 0, e = e + Math.imul(V, gt) | 0, e = e + Math.imul(lt, Q) | 0, u = u + Math.imul(lt, gt) | 0, s = s + Math.imul(K, tt) | 0, e = e + Math.imul(K, bt) | 0, e = e + Math.imul(at, tt) | 0, u = u + Math.imul(at, bt) | 0, s = s + Math.imul(W, et) | 0, e = e + Math.imul(W, yt) | 0, e = e + Math.imul(ht, et) | 0, u = u + Math.imul(ht, yt) | 0, s = s + Math.imul(Z, rt) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(ot, rt) | 0, u = u + Math.imul(ot, wt) | 0, s = s + Math.imul(H, it) | 0, e = e + Math.imul(H, Mt) | 0, e = e + Math.imul(st, it) | 0, u = u + Math.imul(st, Mt) | 0, s = s + Math.imul(L, nt) | 0, e = e + Math.imul(L, xt) | 0, e = e + Math.imul(z, nt) | 0, u = u + Math.imul(z, xt) | 0;
      var se = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, s = Math.imul(Y, Q), e = Math.imul(Y, gt), e = e + Math.imul(dt, Q) | 0, u = Math.imul(dt, gt), s = s + Math.imul(V, tt) | 0, e = e + Math.imul(V, bt) | 0, e = e + Math.imul(lt, tt) | 0, u = u + Math.imul(lt, bt) | 0, s = s + Math.imul(K, et) | 0, e = e + Math.imul(K, yt) | 0, e = e + Math.imul(at, et) | 0, u = u + Math.imul(at, yt) | 0, s = s + Math.imul(W, rt) | 0, e = e + Math.imul(W, wt) | 0, e = e + Math.imul(ht, rt) | 0, u = u + Math.imul(ht, wt) | 0, s = s + Math.imul(Z, it) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(ot, it) | 0, u = u + Math.imul(ot, Mt) | 0, s = s + Math.imul(H, nt) | 0, e = e + Math.imul(H, xt) | 0, e = e + Math.imul(st, nt) | 0, u = u + Math.imul(st, xt) | 0;
      var oe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, s = Math.imul(Y, tt), e = Math.imul(Y, bt), e = e + Math.imul(dt, tt) | 0, u = Math.imul(dt, bt), s = s + Math.imul(V, et) | 0, e = e + Math.imul(V, yt) | 0, e = e + Math.imul(lt, et) | 0, u = u + Math.imul(lt, yt) | 0, s = s + Math.imul(K, rt) | 0, e = e + Math.imul(K, wt) | 0, e = e + Math.imul(at, rt) | 0, u = u + Math.imul(at, wt) | 0, s = s + Math.imul(W, it) | 0, e = e + Math.imul(W, Mt) | 0, e = e + Math.imul(ht, it) | 0, u = u + Math.imul(ht, Mt) | 0, s = s + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(ot, nt) | 0, u = u + Math.imul(ot, xt) | 0;
      var ue = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, s = Math.imul(Y, et), e = Math.imul(Y, yt), e = e + Math.imul(dt, et) | 0, u = Math.imul(dt, yt), s = s + Math.imul(V, rt) | 0, e = e + Math.imul(V, wt) | 0, e = e + Math.imul(lt, rt) | 0, u = u + Math.imul(lt, wt) | 0, s = s + Math.imul(K, it) | 0, e = e + Math.imul(K, Mt) | 0, e = e + Math.imul(at, it) | 0, u = u + Math.imul(at, Mt) | 0, s = s + Math.imul(W, nt) | 0, e = e + Math.imul(W, xt) | 0, e = e + Math.imul(ht, nt) | 0, u = u + Math.imul(ht, xt) | 0;
      var le = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, s = Math.imul(Y, rt), e = Math.imul(Y, wt), e = e + Math.imul(dt, rt) | 0, u = Math.imul(dt, wt), s = s + Math.imul(V, it) | 0, e = e + Math.imul(V, Mt) | 0, e = e + Math.imul(lt, it) | 0, u = u + Math.imul(lt, Mt) | 0, s = s + Math.imul(K, nt) | 0, e = e + Math.imul(K, xt) | 0, e = e + Math.imul(at, nt) | 0, u = u + Math.imul(at, xt) | 0;
      var de = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, s = Math.imul(Y, it), e = Math.imul(Y, Mt), e = e + Math.imul(dt, it) | 0, u = Math.imul(dt, Mt), s = s + Math.imul(V, nt) | 0, e = e + Math.imul(V, xt) | 0, e = e + Math.imul(lt, nt) | 0, u = u + Math.imul(lt, xt) | 0;
      var ce = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, s = Math.imul(Y, nt), e = Math.imul(Y, xt), e = e + Math.imul(dt, nt) | 0, u = Math.imul(dt, xt);
      var ve = (v + s | 0) + ((e & 8191) << 13) | 0;
      return v = (u + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = It, c[1] = Tt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (D = T);
    function O(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, s = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= s; e++) {
          var u = d - e, g = p.words[u] | 0, M = t.words[e] | 0, k = g * M, R = k & 67108863;
          c = c + (k / 67108864 | 0) | 0, R = R + v | 0, v = R & 67108863, c = c + (R >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function N(p, t, r) {
      var i = new q();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = D(this, t, r) : a < 63 ? i = T(this, t, r) : a < 1024 ? i = O(this, t, r) : i = N(this, t, r), i;
    };
    function q(p, t) {
      this.x = p, this.y = t;
    }
    q.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, q.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, q.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, q.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var s = v << 1, e = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), g = 0; g < d; g += s)
          for (var M = e, k = u, R = 0; R < v; R++) {
            var P = i[g + R], E = a[g + R], I = i[g + R + v], C = a[g + R + v], $ = M * I - k * C;
            C = M * C + k * I, I = $, i[g + R] = P + I, a[g + R] = E + C, i[g + R + v] = P - I, a[g + R + v] = E - C, R !== s && ($ = e * M - u * k, k = e * k + u * M, M = $);
          }
    }, q.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, q.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, q.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, q.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      o(d === 0), o((d & -8192) === 0);
    }, q.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, q.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), s = new Array(a), e = new Array(a), u = new Array(a), g = new Array(a), M = new Array(a), k = i.words;
      k.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, u, a), this.transform(v, c, s, e, a, d), this.transform(u, c, g, M, a, d);
      for (var R = 0; R < a; R++) {
        var P = s[R] * g[R] - e[R] * M[R];
        e[R] = s[R] * M[R] + e[R] * g[R], s[R] = P;
      }
      return this.conjugate(s, e, a), this.transform(s, e, k, c, a, d), this.conjugate(k, c, a), this.normalize13b(k, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), N(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      o(typeof t == "number"), o(t < 67108864);
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
      var r = A(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, s = (this.words[d] | 0) - v << r;
          this.words[d] = s | c, c = v >>> 26 - r;
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
      return o(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      o(typeof t == "number" && t >= 0);
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, s = i;
      if (a -= c, a = Math.max(0, a), s) {
        for (var e = 0; e < c; e++)
          s.words[e] = this.words[e];
        s.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var u = 0;
      for (e = this.length - 1; e >= 0 && (u !== 0 || e >= a); e--) {
        var g = this.words[e] | 0;
        this.words[e] = u << 26 - d | g >>> d, u = g & v;
      }
      return s && u !== 0 && (s.words[s.length++] = u), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return o(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (o(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return o(typeof t == "number"), o(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (o(typeof t == "number"), o(t < 67108864), t < 0)
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
        var s = (t.words[d] | 0) * r;
        c -= s & 67108863, v = (c >> 26) - (s / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (o(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var s = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = s + 1, e.words = new Array(e.length);
        for (var u = 0; u < e.length; u++)
          e.words[u] = 0;
      }
      var g = a.clone()._ishlnsubmul(d, 1, s);
      g.negative === 0 && (a = g, e && (e.words[s] = 1));
      for (var M = s - 1; M >= 0; M--) {
        var k = (a.words[d.length + M] | 0) * 67108864 + (a.words[d.length + M - 1] | 0);
        for (k = Math.min(k / c | 0, 67108863), a._ishlnsubmul(d, k, M); a.negative !== 0; )
          k--, a.negative = 0, a._ishlnsubmul(d, 1, M), a.isZero() || (a.negative ^= 1);
        e && (e.words[M] = k);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (o(!t.isZero()), this.isZero())
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
      o(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      o(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), s = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++s;
      for (var e = i.clone(), u = r.clone(); !r.isZero(); ) {
        for (var g = 0, M = 1; !(r.words[0] & M) && g < 26; ++g, M <<= 1)
          ;
        if (g > 0)
          for (r.iushrn(g); g-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(u)), a.iushrn(1), d.iushrn(1);
        for (var k = 0, R = 1; !(i.words[0] & R) && k < 26; ++k, R <<= 1)
          ;
        if (k > 0)
          for (i.iushrn(k); k-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(u)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(s)
      };
    }, f.prototype._invmp = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, s = 1; !(r.words[0] & s) && v < 26; ++v, s <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, u = 1; !(i.words[0] & u) && e < 26; ++e, u <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var g;
      return r.cmpn(1) === 0 ? g = a : g = d, g.cmpn(0) < 0 && g.iadd(t), g;
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
      o(typeof t == "number");
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
        r && (t = -t), o(t <= 67108863, "Number is too big");
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
      return new U(t);
    }, f.prototype.toRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), o(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return o(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return o(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return o(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return o(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return o(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return o(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return o(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return o(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return o(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return o(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return o(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return o(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var ft = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function F(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    F.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, F.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, F.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, F.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function _t() {
      F.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(_t, F), _t.prototype.split = function(t, r) {
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
    }, _t.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function St() {
      F.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(St, F);
    function kt() {
      F.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(kt, F);
    function At() {
      F.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(At, F), At.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (ft[t])
        return ft[t];
      var r;
      if (t === "k256")
        r = new _t();
      else if (t === "p224")
        r = new St();
      else if (t === "p192")
        r = new kt();
      else if (t === "p25519")
        r = new At();
      else
        throw new Error("Unknown prime " + t);
      return ft[t] = r, r;
    };
    function U(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        o(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    U.prototype._verify1 = function(t) {
      o(t.negative === 0, "red works only with positives"), o(t.red, "red works only with red numbers");
    }, U.prototype._verify2 = function(t, r) {
      o((t.negative | r.negative) === 0, "red works only with positives"), o(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, U.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, U.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, U.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, U.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, U.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, U.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, U.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, U.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, U.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, U.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, U.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, U.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (o(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      o(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), s = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, s).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var u = this.pow(e, a), g = this.pow(t, a.addn(1).iushrn(1)), M = this.pow(t, a), k = d; M.cmp(c) !== 0; ) {
        for (var R = M, P = 0; R.cmp(c) !== 0; P++)
          R = R.redSqr();
        o(P < k);
        var E = this.pow(u, new f(1).iushln(k - P - 1));
        g = g.redMul(E), u = E.redSqr(), M = M.redMul(u), k = P;
      }
      return g;
    }, U.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, U.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, s = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var u = r.words[d], g = e - 1; g >= 0; g--) {
          var M = u >> g & 1;
          if (c !== a[0] && (c = this.sqr(c)), M === 0 && v === 0) {
            s = 0;
            continue;
          }
          v <<= 1, v |= M, s++, !(s !== i && (d !== 0 || g !== 0)) && (c = this.mul(c, a[v]), s = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, U.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, U.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new Et(t);
    };
    function Et(p) {
      U.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(Et, U), Et.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, Et.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, Et.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(_0);
var Ps = _0.exports, S0 = { exports: {} };
S0.exports;
(function(h) {
  (function(n, l) {
    function o(p, t) {
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
    typeof n == "object" ? n.exports = f : l.BN = f, f.BN = f, f.wordSize = 26;
    var b;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? b = window.Buffer : b = ge.Buffer;
    } catch {
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
      r === "hex" && (r = 16), o(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (o(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (o(typeof t.length == "number"), t.length <= 0)
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
    function w(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function _(p, t, r) {
      var i = w(p, r);
      return r - 1 >= t && (i |= w(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var s = t.length - r;
        for (a = s % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function S(p, t, r, i) {
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
      for (var c = t.length - i, v = c % a, s = Math.min(c, c - v) + i, e = 0, u = i; u < s; u += a)
        e = S(t, u, u + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var g = 1;
        for (e = S(t, u, t.length, r), u = 0; u < v; u++)
          g *= r;
        this.imuln(g), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    var y = [
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
    ], B = [
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
          var v = this.words[c], s = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = y[6 - s.length] + s + i : i = s + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], u = B[t];
        i = "";
        var g = this.clone();
        for (g.negative = 0; !g.isZero(); ) {
          var M = g.modn(u).toString(t);
          g = g.idivn(u), g.isZero() ? i = M + i : i = y[e - M.length] + M + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      o(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && o(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return o(typeof b < "u"), this.toArrayLike(b, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var a = this.byteLength(), d = i || Math.max(1, a);
      o(a <= d, "byte array longer than desired length"), o(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), s, e, u = this.clone();
      if (c) {
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[e] = s;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
          v[e] = 0;
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[d - e - 1] = s;
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
    function A(p) {
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
      return o((this.negative | t.negative) === 0), this.iuor(t);
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
      return o((this.negative | t.negative) === 0), this.iuand(t);
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
      return o((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      o(typeof t == "number" && t >= 0);
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
    function T(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, s = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var u = s >>> 26, g = s & 67108863, M = Math.min(e, t.length - 1), k = Math.max(0, e - p.length + 1); k <= M; k++) {
          var R = e - k | 0;
          a = p.words[R] | 0, d = t.words[k] | 0, c = a * d + g, u += c / 67108864 | 0, g = c & 67108863;
        }
        r.words[e] = g | 0, s = u | 0;
      }
      return s !== 0 ? r.words[e] = s | 0 : r.length--, r.strip();
    }
    var D = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, s, e, u, g = a[0] | 0, M = g & 8191, k = g >>> 13, R = a[1] | 0, P = R & 8191, E = R >>> 13, I = a[2] | 0, C = I & 8191, $ = I >>> 13, Bt = a[3] | 0, L = Bt & 8191, z = Bt >>> 13, Ct = a[4] | 0, H = Ct & 8191, st = Ct >>> 13, Dt = a[5] | 0, Z = Dt & 8191, ot = Dt >>> 13, qt = a[6] | 0, W = qt & 8191, ht = qt >>> 13, Rt = a[7] | 0, K = Rt & 8191, at = Rt >>> 13, $t = a[8] | 0, V = $t & 8191, lt = $t >>> 13, Ft = a[9] | 0, Y = Ft & 8191, dt = Ft >>> 13, Lt = d[0] | 0, J = Lt & 8191, ct = Lt >>> 13, Ot = d[1] | 0, G = Ot & 8191, vt = Ot >>> 13, Ut = d[2] | 0, X = Ut & 8191, pt = Ut >>> 13, zt = d[3] | 0, j = zt & 8191, mt = zt >>> 13, Kt = d[4] | 0, Q = Kt & 8191, gt = Kt >>> 13, Ht = d[5] | 0, tt = Ht & 8191, bt = Ht >>> 13, Zt = d[6] | 0, et = Zt & 8191, yt = Zt >>> 13, Wt = d[7] | 0, rt = Wt & 8191, wt = Wt >>> 13, Vt = d[8] | 0, it = Vt & 8191, Mt = Vt >>> 13, Yt = d[9] | 0, nt = Yt & 8191, xt = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, s = Math.imul(M, J), e = Math.imul(M, ct), e = e + Math.imul(k, J) | 0, u = Math.imul(k, ct);
      var It = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (It >>> 26) | 0, It &= 67108863, s = Math.imul(P, J), e = Math.imul(P, ct), e = e + Math.imul(E, J) | 0, u = Math.imul(E, ct), s = s + Math.imul(M, G) | 0, e = e + Math.imul(M, vt) | 0, e = e + Math.imul(k, G) | 0, u = u + Math.imul(k, vt) | 0;
      var Tt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Tt >>> 26) | 0, Tt &= 67108863, s = Math.imul(C, J), e = Math.imul(C, ct), e = e + Math.imul($, J) | 0, u = Math.imul($, ct), s = s + Math.imul(P, G) | 0, e = e + Math.imul(P, vt) | 0, e = e + Math.imul(E, G) | 0, u = u + Math.imul(E, vt) | 0, s = s + Math.imul(M, X) | 0, e = e + Math.imul(M, pt) | 0, e = e + Math.imul(k, X) | 0, u = u + Math.imul(k, pt) | 0;
      var jt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, s = Math.imul(L, J), e = Math.imul(L, ct), e = e + Math.imul(z, J) | 0, u = Math.imul(z, ct), s = s + Math.imul(C, G) | 0, e = e + Math.imul(C, vt) | 0, e = e + Math.imul($, G) | 0, u = u + Math.imul($, vt) | 0, s = s + Math.imul(P, X) | 0, e = e + Math.imul(P, pt) | 0, e = e + Math.imul(E, X) | 0, u = u + Math.imul(E, pt) | 0, s = s + Math.imul(M, j) | 0, e = e + Math.imul(M, mt) | 0, e = e + Math.imul(k, j) | 0, u = u + Math.imul(k, mt) | 0;
      var Qt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, s = Math.imul(H, J), e = Math.imul(H, ct), e = e + Math.imul(st, J) | 0, u = Math.imul(st, ct), s = s + Math.imul(L, G) | 0, e = e + Math.imul(L, vt) | 0, e = e + Math.imul(z, G) | 0, u = u + Math.imul(z, vt) | 0, s = s + Math.imul(C, X) | 0, e = e + Math.imul(C, pt) | 0, e = e + Math.imul($, X) | 0, u = u + Math.imul($, pt) | 0, s = s + Math.imul(P, j) | 0, e = e + Math.imul(P, mt) | 0, e = e + Math.imul(E, j) | 0, u = u + Math.imul(E, mt) | 0, s = s + Math.imul(M, Q) | 0, e = e + Math.imul(M, gt) | 0, e = e + Math.imul(k, Q) | 0, u = u + Math.imul(k, gt) | 0;
      var te = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, s = Math.imul(Z, J), e = Math.imul(Z, ct), e = e + Math.imul(ot, J) | 0, u = Math.imul(ot, ct), s = s + Math.imul(H, G) | 0, e = e + Math.imul(H, vt) | 0, e = e + Math.imul(st, G) | 0, u = u + Math.imul(st, vt) | 0, s = s + Math.imul(L, X) | 0, e = e + Math.imul(L, pt) | 0, e = e + Math.imul(z, X) | 0, u = u + Math.imul(z, pt) | 0, s = s + Math.imul(C, j) | 0, e = e + Math.imul(C, mt) | 0, e = e + Math.imul($, j) | 0, u = u + Math.imul($, mt) | 0, s = s + Math.imul(P, Q) | 0, e = e + Math.imul(P, gt) | 0, e = e + Math.imul(E, Q) | 0, u = u + Math.imul(E, gt) | 0, s = s + Math.imul(M, tt) | 0, e = e + Math.imul(M, bt) | 0, e = e + Math.imul(k, tt) | 0, u = u + Math.imul(k, bt) | 0;
      var ee = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, s = Math.imul(W, J), e = Math.imul(W, ct), e = e + Math.imul(ht, J) | 0, u = Math.imul(ht, ct), s = s + Math.imul(Z, G) | 0, e = e + Math.imul(Z, vt) | 0, e = e + Math.imul(ot, G) | 0, u = u + Math.imul(ot, vt) | 0, s = s + Math.imul(H, X) | 0, e = e + Math.imul(H, pt) | 0, e = e + Math.imul(st, X) | 0, u = u + Math.imul(st, pt) | 0, s = s + Math.imul(L, j) | 0, e = e + Math.imul(L, mt) | 0, e = e + Math.imul(z, j) | 0, u = u + Math.imul(z, mt) | 0, s = s + Math.imul(C, Q) | 0, e = e + Math.imul(C, gt) | 0, e = e + Math.imul($, Q) | 0, u = u + Math.imul($, gt) | 0, s = s + Math.imul(P, tt) | 0, e = e + Math.imul(P, bt) | 0, e = e + Math.imul(E, tt) | 0, u = u + Math.imul(E, bt) | 0, s = s + Math.imul(M, et) | 0, e = e + Math.imul(M, yt) | 0, e = e + Math.imul(k, et) | 0, u = u + Math.imul(k, yt) | 0;
      var re = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, s = Math.imul(K, J), e = Math.imul(K, ct), e = e + Math.imul(at, J) | 0, u = Math.imul(at, ct), s = s + Math.imul(W, G) | 0, e = e + Math.imul(W, vt) | 0, e = e + Math.imul(ht, G) | 0, u = u + Math.imul(ht, vt) | 0, s = s + Math.imul(Z, X) | 0, e = e + Math.imul(Z, pt) | 0, e = e + Math.imul(ot, X) | 0, u = u + Math.imul(ot, pt) | 0, s = s + Math.imul(H, j) | 0, e = e + Math.imul(H, mt) | 0, e = e + Math.imul(st, j) | 0, u = u + Math.imul(st, mt) | 0, s = s + Math.imul(L, Q) | 0, e = e + Math.imul(L, gt) | 0, e = e + Math.imul(z, Q) | 0, u = u + Math.imul(z, gt) | 0, s = s + Math.imul(C, tt) | 0, e = e + Math.imul(C, bt) | 0, e = e + Math.imul($, tt) | 0, u = u + Math.imul($, bt) | 0, s = s + Math.imul(P, et) | 0, e = e + Math.imul(P, yt) | 0, e = e + Math.imul(E, et) | 0, u = u + Math.imul(E, yt) | 0, s = s + Math.imul(M, rt) | 0, e = e + Math.imul(M, wt) | 0, e = e + Math.imul(k, rt) | 0, u = u + Math.imul(k, wt) | 0;
      var ie = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, s = Math.imul(V, J), e = Math.imul(V, ct), e = e + Math.imul(lt, J) | 0, u = Math.imul(lt, ct), s = s + Math.imul(K, G) | 0, e = e + Math.imul(K, vt) | 0, e = e + Math.imul(at, G) | 0, u = u + Math.imul(at, vt) | 0, s = s + Math.imul(W, X) | 0, e = e + Math.imul(W, pt) | 0, e = e + Math.imul(ht, X) | 0, u = u + Math.imul(ht, pt) | 0, s = s + Math.imul(Z, j) | 0, e = e + Math.imul(Z, mt) | 0, e = e + Math.imul(ot, j) | 0, u = u + Math.imul(ot, mt) | 0, s = s + Math.imul(H, Q) | 0, e = e + Math.imul(H, gt) | 0, e = e + Math.imul(st, Q) | 0, u = u + Math.imul(st, gt) | 0, s = s + Math.imul(L, tt) | 0, e = e + Math.imul(L, bt) | 0, e = e + Math.imul(z, tt) | 0, u = u + Math.imul(z, bt) | 0, s = s + Math.imul(C, et) | 0, e = e + Math.imul(C, yt) | 0, e = e + Math.imul($, et) | 0, u = u + Math.imul($, yt) | 0, s = s + Math.imul(P, rt) | 0, e = e + Math.imul(P, wt) | 0, e = e + Math.imul(E, rt) | 0, u = u + Math.imul(E, wt) | 0, s = s + Math.imul(M, it) | 0, e = e + Math.imul(M, Mt) | 0, e = e + Math.imul(k, it) | 0, u = u + Math.imul(k, Mt) | 0;
      var ne = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, s = Math.imul(Y, J), e = Math.imul(Y, ct), e = e + Math.imul(dt, J) | 0, u = Math.imul(dt, ct), s = s + Math.imul(V, G) | 0, e = e + Math.imul(V, vt) | 0, e = e + Math.imul(lt, G) | 0, u = u + Math.imul(lt, vt) | 0, s = s + Math.imul(K, X) | 0, e = e + Math.imul(K, pt) | 0, e = e + Math.imul(at, X) | 0, u = u + Math.imul(at, pt) | 0, s = s + Math.imul(W, j) | 0, e = e + Math.imul(W, mt) | 0, e = e + Math.imul(ht, j) | 0, u = u + Math.imul(ht, mt) | 0, s = s + Math.imul(Z, Q) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(ot, Q) | 0, u = u + Math.imul(ot, gt) | 0, s = s + Math.imul(H, tt) | 0, e = e + Math.imul(H, bt) | 0, e = e + Math.imul(st, tt) | 0, u = u + Math.imul(st, bt) | 0, s = s + Math.imul(L, et) | 0, e = e + Math.imul(L, yt) | 0, e = e + Math.imul(z, et) | 0, u = u + Math.imul(z, yt) | 0, s = s + Math.imul(C, rt) | 0, e = e + Math.imul(C, wt) | 0, e = e + Math.imul($, rt) | 0, u = u + Math.imul($, wt) | 0, s = s + Math.imul(P, it) | 0, e = e + Math.imul(P, Mt) | 0, e = e + Math.imul(E, it) | 0, u = u + Math.imul(E, Mt) | 0, s = s + Math.imul(M, nt) | 0, e = e + Math.imul(M, xt) | 0, e = e + Math.imul(k, nt) | 0, u = u + Math.imul(k, xt) | 0;
      var fe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, s = Math.imul(Y, G), e = Math.imul(Y, vt), e = e + Math.imul(dt, G) | 0, u = Math.imul(dt, vt), s = s + Math.imul(V, X) | 0, e = e + Math.imul(V, pt) | 0, e = e + Math.imul(lt, X) | 0, u = u + Math.imul(lt, pt) | 0, s = s + Math.imul(K, j) | 0, e = e + Math.imul(K, mt) | 0, e = e + Math.imul(at, j) | 0, u = u + Math.imul(at, mt) | 0, s = s + Math.imul(W, Q) | 0, e = e + Math.imul(W, gt) | 0, e = e + Math.imul(ht, Q) | 0, u = u + Math.imul(ht, gt) | 0, s = s + Math.imul(Z, tt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(ot, tt) | 0, u = u + Math.imul(ot, bt) | 0, s = s + Math.imul(H, et) | 0, e = e + Math.imul(H, yt) | 0, e = e + Math.imul(st, et) | 0, u = u + Math.imul(st, yt) | 0, s = s + Math.imul(L, rt) | 0, e = e + Math.imul(L, wt) | 0, e = e + Math.imul(z, rt) | 0, u = u + Math.imul(z, wt) | 0, s = s + Math.imul(C, it) | 0, e = e + Math.imul(C, Mt) | 0, e = e + Math.imul($, it) | 0, u = u + Math.imul($, Mt) | 0, s = s + Math.imul(P, nt) | 0, e = e + Math.imul(P, xt) | 0, e = e + Math.imul(E, nt) | 0, u = u + Math.imul(E, xt) | 0;
      var ae = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, s = Math.imul(Y, X), e = Math.imul(Y, pt), e = e + Math.imul(dt, X) | 0, u = Math.imul(dt, pt), s = s + Math.imul(V, j) | 0, e = e + Math.imul(V, mt) | 0, e = e + Math.imul(lt, j) | 0, u = u + Math.imul(lt, mt) | 0, s = s + Math.imul(K, Q) | 0, e = e + Math.imul(K, gt) | 0, e = e + Math.imul(at, Q) | 0, u = u + Math.imul(at, gt) | 0, s = s + Math.imul(W, tt) | 0, e = e + Math.imul(W, bt) | 0, e = e + Math.imul(ht, tt) | 0, u = u + Math.imul(ht, bt) | 0, s = s + Math.imul(Z, et) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(ot, et) | 0, u = u + Math.imul(ot, yt) | 0, s = s + Math.imul(H, rt) | 0, e = e + Math.imul(H, wt) | 0, e = e + Math.imul(st, rt) | 0, u = u + Math.imul(st, wt) | 0, s = s + Math.imul(L, it) | 0, e = e + Math.imul(L, Mt) | 0, e = e + Math.imul(z, it) | 0, u = u + Math.imul(z, Mt) | 0, s = s + Math.imul(C, nt) | 0, e = e + Math.imul(C, xt) | 0, e = e + Math.imul($, nt) | 0, u = u + Math.imul($, xt) | 0;
      var he = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, s = Math.imul(Y, j), e = Math.imul(Y, mt), e = e + Math.imul(dt, j) | 0, u = Math.imul(dt, mt), s = s + Math.imul(V, Q) | 0, e = e + Math.imul(V, gt) | 0, e = e + Math.imul(lt, Q) | 0, u = u + Math.imul(lt, gt) | 0, s = s + Math.imul(K, tt) | 0, e = e + Math.imul(K, bt) | 0, e = e + Math.imul(at, tt) | 0, u = u + Math.imul(at, bt) | 0, s = s + Math.imul(W, et) | 0, e = e + Math.imul(W, yt) | 0, e = e + Math.imul(ht, et) | 0, u = u + Math.imul(ht, yt) | 0, s = s + Math.imul(Z, rt) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(ot, rt) | 0, u = u + Math.imul(ot, wt) | 0, s = s + Math.imul(H, it) | 0, e = e + Math.imul(H, Mt) | 0, e = e + Math.imul(st, it) | 0, u = u + Math.imul(st, Mt) | 0, s = s + Math.imul(L, nt) | 0, e = e + Math.imul(L, xt) | 0, e = e + Math.imul(z, nt) | 0, u = u + Math.imul(z, xt) | 0;
      var se = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, s = Math.imul(Y, Q), e = Math.imul(Y, gt), e = e + Math.imul(dt, Q) | 0, u = Math.imul(dt, gt), s = s + Math.imul(V, tt) | 0, e = e + Math.imul(V, bt) | 0, e = e + Math.imul(lt, tt) | 0, u = u + Math.imul(lt, bt) | 0, s = s + Math.imul(K, et) | 0, e = e + Math.imul(K, yt) | 0, e = e + Math.imul(at, et) | 0, u = u + Math.imul(at, yt) | 0, s = s + Math.imul(W, rt) | 0, e = e + Math.imul(W, wt) | 0, e = e + Math.imul(ht, rt) | 0, u = u + Math.imul(ht, wt) | 0, s = s + Math.imul(Z, it) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(ot, it) | 0, u = u + Math.imul(ot, Mt) | 0, s = s + Math.imul(H, nt) | 0, e = e + Math.imul(H, xt) | 0, e = e + Math.imul(st, nt) | 0, u = u + Math.imul(st, xt) | 0;
      var oe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, s = Math.imul(Y, tt), e = Math.imul(Y, bt), e = e + Math.imul(dt, tt) | 0, u = Math.imul(dt, bt), s = s + Math.imul(V, et) | 0, e = e + Math.imul(V, yt) | 0, e = e + Math.imul(lt, et) | 0, u = u + Math.imul(lt, yt) | 0, s = s + Math.imul(K, rt) | 0, e = e + Math.imul(K, wt) | 0, e = e + Math.imul(at, rt) | 0, u = u + Math.imul(at, wt) | 0, s = s + Math.imul(W, it) | 0, e = e + Math.imul(W, Mt) | 0, e = e + Math.imul(ht, it) | 0, u = u + Math.imul(ht, Mt) | 0, s = s + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(ot, nt) | 0, u = u + Math.imul(ot, xt) | 0;
      var ue = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, s = Math.imul(Y, et), e = Math.imul(Y, yt), e = e + Math.imul(dt, et) | 0, u = Math.imul(dt, yt), s = s + Math.imul(V, rt) | 0, e = e + Math.imul(V, wt) | 0, e = e + Math.imul(lt, rt) | 0, u = u + Math.imul(lt, wt) | 0, s = s + Math.imul(K, it) | 0, e = e + Math.imul(K, Mt) | 0, e = e + Math.imul(at, it) | 0, u = u + Math.imul(at, Mt) | 0, s = s + Math.imul(W, nt) | 0, e = e + Math.imul(W, xt) | 0, e = e + Math.imul(ht, nt) | 0, u = u + Math.imul(ht, xt) | 0;
      var le = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, s = Math.imul(Y, rt), e = Math.imul(Y, wt), e = e + Math.imul(dt, rt) | 0, u = Math.imul(dt, wt), s = s + Math.imul(V, it) | 0, e = e + Math.imul(V, Mt) | 0, e = e + Math.imul(lt, it) | 0, u = u + Math.imul(lt, Mt) | 0, s = s + Math.imul(K, nt) | 0, e = e + Math.imul(K, xt) | 0, e = e + Math.imul(at, nt) | 0, u = u + Math.imul(at, xt) | 0;
      var de = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, s = Math.imul(Y, it), e = Math.imul(Y, Mt), e = e + Math.imul(dt, it) | 0, u = Math.imul(dt, Mt), s = s + Math.imul(V, nt) | 0, e = e + Math.imul(V, xt) | 0, e = e + Math.imul(lt, nt) | 0, u = u + Math.imul(lt, xt) | 0;
      var ce = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, s = Math.imul(Y, nt), e = Math.imul(Y, xt), e = e + Math.imul(dt, nt) | 0, u = Math.imul(dt, xt);
      var ve = (v + s | 0) + ((e & 8191) << 13) | 0;
      return v = (u + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = It, c[1] = Tt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (D = T);
    function O(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, s = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= s; e++) {
          var u = d - e, g = p.words[u] | 0, M = t.words[e] | 0, k = g * M, R = k & 67108863;
          c = c + (k / 67108864 | 0) | 0, R = R + v | 0, v = R & 67108863, c = c + (R >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function N(p, t, r) {
      var i = new q();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = D(this, t, r) : a < 63 ? i = T(this, t, r) : a < 1024 ? i = O(this, t, r) : i = N(this, t, r), i;
    };
    function q(p, t) {
      this.x = p, this.y = t;
    }
    q.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, q.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, q.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, q.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var s = v << 1, e = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), g = 0; g < d; g += s)
          for (var M = e, k = u, R = 0; R < v; R++) {
            var P = i[g + R], E = a[g + R], I = i[g + R + v], C = a[g + R + v], $ = M * I - k * C;
            C = M * C + k * I, I = $, i[g + R] = P + I, a[g + R] = E + C, i[g + R + v] = P - I, a[g + R + v] = E - C, R !== s && ($ = e * M - u * k, k = e * k + u * M, M = $);
          }
    }, q.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, q.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, q.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, q.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      o(d === 0), o((d & -8192) === 0);
    }, q.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, q.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), s = new Array(a), e = new Array(a), u = new Array(a), g = new Array(a), M = new Array(a), k = i.words;
      k.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, u, a), this.transform(v, c, s, e, a, d), this.transform(u, c, g, M, a, d);
      for (var R = 0; R < a; R++) {
        var P = s[R] * g[R] - e[R] * M[R];
        e[R] = s[R] * M[R] + e[R] * g[R], s[R] = P;
      }
      return this.conjugate(s, e, a), this.transform(s, e, k, c, a, d), this.conjugate(k, c, a), this.normalize13b(k, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), N(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      o(typeof t == "number"), o(t < 67108864);
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
      var r = A(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, s = (this.words[d] | 0) - v << r;
          this.words[d] = s | c, c = v >>> 26 - r;
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
      return o(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      o(typeof t == "number" && t >= 0);
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, s = i;
      if (a -= c, a = Math.max(0, a), s) {
        for (var e = 0; e < c; e++)
          s.words[e] = this.words[e];
        s.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var u = 0;
      for (e = this.length - 1; e >= 0 && (u !== 0 || e >= a); e--) {
        var g = this.words[e] | 0;
        this.words[e] = u << 26 - d | g >>> d, u = g & v;
      }
      return s && u !== 0 && (s.words[s.length++] = u), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return o(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (o(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return o(typeof t == "number"), o(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (o(typeof t == "number"), o(t < 67108864), t < 0)
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
        var s = (t.words[d] | 0) * r;
        c -= s & 67108863, v = (c >> 26) - (s / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (o(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var s = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = s + 1, e.words = new Array(e.length);
        for (var u = 0; u < e.length; u++)
          e.words[u] = 0;
      }
      var g = a.clone()._ishlnsubmul(d, 1, s);
      g.negative === 0 && (a = g, e && (e.words[s] = 1));
      for (var M = s - 1; M >= 0; M--) {
        var k = (a.words[d.length + M] | 0) * 67108864 + (a.words[d.length + M - 1] | 0);
        for (k = Math.min(k / c | 0, 67108863), a._ishlnsubmul(d, k, M); a.negative !== 0; )
          k--, a.negative = 0, a._ishlnsubmul(d, 1, M), a.isZero() || (a.negative ^= 1);
        e && (e.words[M] = k);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (o(!t.isZero()), this.isZero())
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
      o(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      o(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), s = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++s;
      for (var e = i.clone(), u = r.clone(); !r.isZero(); ) {
        for (var g = 0, M = 1; !(r.words[0] & M) && g < 26; ++g, M <<= 1)
          ;
        if (g > 0)
          for (r.iushrn(g); g-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(u)), a.iushrn(1), d.iushrn(1);
        for (var k = 0, R = 1; !(i.words[0] & R) && k < 26; ++k, R <<= 1)
          ;
        if (k > 0)
          for (i.iushrn(k); k-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(u)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(s)
      };
    }, f.prototype._invmp = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, s = 1; !(r.words[0] & s) && v < 26; ++v, s <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, u = 1; !(i.words[0] & u) && e < 26; ++e, u <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var g;
      return r.cmpn(1) === 0 ? g = a : g = d, g.cmpn(0) < 0 && g.iadd(t), g;
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
      o(typeof t == "number");
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
        r && (t = -t), o(t <= 67108863, "Number is too big");
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
      return new U(t);
    }, f.prototype.toRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), o(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return o(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return o(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return o(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return o(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return o(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return o(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return o(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return o(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return o(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return o(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return o(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return o(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var ft = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function F(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    F.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, F.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, F.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, F.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function _t() {
      F.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(_t, F), _t.prototype.split = function(t, r) {
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
    }, _t.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function St() {
      F.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(St, F);
    function kt() {
      F.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(kt, F);
    function At() {
      F.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(At, F), At.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (ft[t])
        return ft[t];
      var r;
      if (t === "k256")
        r = new _t();
      else if (t === "p224")
        r = new St();
      else if (t === "p192")
        r = new kt();
      else if (t === "p25519")
        r = new At();
      else
        throw new Error("Unknown prime " + t);
      return ft[t] = r, r;
    };
    function U(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        o(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    U.prototype._verify1 = function(t) {
      o(t.negative === 0, "red works only with positives"), o(t.red, "red works only with red numbers");
    }, U.prototype._verify2 = function(t, r) {
      o((t.negative | r.negative) === 0, "red works only with positives"), o(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, U.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, U.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, U.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, U.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, U.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, U.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, U.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, U.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, U.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, U.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, U.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, U.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (o(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      o(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), s = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, s).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var u = this.pow(e, a), g = this.pow(t, a.addn(1).iushrn(1)), M = this.pow(t, a), k = d; M.cmp(c) !== 0; ) {
        for (var R = M, P = 0; R.cmp(c) !== 0; P++)
          R = R.redSqr();
        o(P < k);
        var E = this.pow(u, new f(1).iushln(k - P - 1));
        g = g.redMul(E), u = E.redSqr(), M = M.redMul(u), k = P;
      }
      return g;
    }, U.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, U.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, s = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var u = r.words[d], g = e - 1; g >= 0; g--) {
          var M = u >> g & 1;
          if (c !== a[0] && (c = this.sqr(c)), M === 0 && v === 0) {
            s = 0;
            continue;
          }
          v <<= 1, v |= M, s++, !(s !== i && (d !== 0 || g !== 0)) && (c = this.mul(c, a[v]), s = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, U.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, U.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new Et(t);
    };
    function Et(p) {
      U.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(Et, U), Et.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, Et.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, Et.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(S0);
var g1 = S0.exports, rn = { exports: {} }, da;
function A0() {
  if (da)
    return rn.exports;
  da = 1;
  var h;
  rn.exports = function(m) {
    return h || (h = new n(null)), h.generate(m);
  };
  function n(o) {
    this.rand = o;
  }
  if (rn.exports.Rand = n, n.prototype.generate = function(m) {
    return this._rand(m);
  }, n.prototype._rand = function(m) {
    if (this.rand.getBytes)
      return this.rand.getBytes(m);
    for (var f = new Uint8Array(m), b = 0; b < f.length; b++)
      f[b] = this.rand.getByte();
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
      var l = Do();
      if (typeof l.randomBytes != "function")
        throw new Error("Not supported");
      n.prototype._rand = function(m) {
        return l.randomBytes(m);
      };
    } catch {
    }
  return rn.exports;
}
var lf, ca;
function Ds() {
  if (ca)
    return lf;
  ca = 1;
  var h = g1, n = A0();
  function l(o) {
    this.rand = o || new n.Rand();
  }
  return lf = l, l.create = function(m) {
    return new l(m);
  }, l.prototype._randbelow = function(m) {
    var f = m.bitLength(), b = Math.ceil(f / 8);
    do
      var w = new h(this.rand.generate(b));
    while (w.cmp(m) >= 0);
    return w;
  }, l.prototype._randrange = function(m, f) {
    var b = f.sub(m);
    return m.add(this._randbelow(b));
  }, l.prototype.test = function(m, f, b) {
    var w = m.bitLength(), _ = h.mont(m), S = new h(1).toRed(_);
    f || (f = Math.max(1, w / 48 | 0));
    for (var y = m.subn(1), x = 0; !y.testn(x); x++)
      ;
    for (var B = m.shrn(x), A = y.toRed(_), T = !0; f > 0; f--) {
      var D = this._randrange(new h(2), y);
      b && b(D);
      var O = D.toRed(_).redPow(B);
      if (!(O.cmp(S) === 0 || O.cmp(A) === 0)) {
        for (var N = 1; N < x; N++) {
          if (O = O.redSqr(), O.cmp(S) === 0)
            return !1;
          if (O.cmp(A) === 0)
            break;
        }
        if (N === x)
          return !1;
      }
    }
    return T;
  }, l.prototype.getDivisor = function(m, f) {
    var b = m.bitLength(), w = h.mont(m), _ = new h(1).toRed(w);
    f || (f = Math.max(1, b / 48 | 0));
    for (var S = m.subn(1), y = 0; !S.testn(y); y++)
      ;
    for (var x = m.shrn(y), B = S.toRed(w); f > 0; f--) {
      var A = this._randrange(new h(2), S), T = m.gcd(A);
      if (T.cmpn(1) !== 0)
        return T;
      var D = A.toRed(w).redPow(x);
      if (!(D.cmp(_) === 0 || D.cmp(B) === 0)) {
        for (var O = 1; O < y; O++) {
          if (D = D.redSqr(), D.cmp(_) === 0)
            return D.fromRed().subn(1).gcd(m);
          if (D.cmp(B) === 0)
            break;
        }
        if (O === y)
          return D = D.redSqr(), D.fromRed().subn(1).gcd(m);
      }
    }
    return !1;
  }, lf;
}
var df, va;
function Ns() {
  if (va)
    return df;
  va = 1;
  var h = li;
  df = O, O.simpleSieve = T, O.fermatTest = D;
  var n = Ps, l = new n(24), o = Ds(), m = new o(), f = new n(1), b = new n(2), w = new n(5);
  new n(16), new n(8);
  var _ = new n(10), S = new n(3);
  new n(7);
  var y = new n(11), x = new n(4);
  new n(12);
  var B = null;
  function A() {
    if (B !== null)
      return B;
    var N = 1048576, q = [];
    q[0] = 2;
    for (var ft = 1, F = 3; F < N; F += 2) {
      for (var _t = Math.ceil(Math.sqrt(F)), St = 0; St < ft && q[St] <= _t && F % q[St] !== 0; St++)
        ;
      ft !== St && q[St] <= _t || (q[ft++] = F);
    }
    return B = q, q;
  }
  function T(N) {
    for (var q = A(), ft = 0; ft < q.length; ft++)
      if (N.modn(q[ft]) === 0)
        return N.cmpn(q[ft]) === 0;
    return !0;
  }
  function D(N) {
    var q = n.mont(N);
    return b.toRed(q).redPow(N.subn(1)).fromRed().cmpn(1) === 0;
  }
  function O(N, q) {
    if (N < 16)
      return q === 2 || q === 5 ? new n([140, 123]) : new n([140, 39]);
    q = new n(q);
    for (var ft, F; ; ) {
      for (ft = new n(h(Math.ceil(N / 8))); ft.bitLength() > N; )
        ft.ishrn(1);
      if (ft.isEven() && ft.iadd(f), ft.testn(1) || ft.iadd(b), q.cmp(b)) {
        if (!q.cmp(w))
          for (; ft.mod(_).cmp(S); )
            ft.iadd(x);
      } else
        for (; ft.mod(l).cmp(y); )
          ft.iadd(x);
      if (F = ft.shrn(1), T(F) && T(ft) && D(F) && D(ft) && m.test(F) && m.test(ft))
        return ft;
    }
  }
  return df;
}
const b1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
}, y1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
}, w1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
}, M1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
}, x1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
}, _1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
}, S1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
}, A1 = {
  gen: "02",
  prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
}, B1 = {
  modp1: b1,
  modp2: y1,
  modp5: w1,
  modp14: M1,
  modp15: x1,
  modp16: _1,
  modp17: S1,
  modp18: A1
};
var cf, pa;
function E1() {
  if (pa)
    return cf;
  pa = 1;
  var h = Ps, n = Ds(), l = new n(), o = new h(24), m = new h(11), f = new h(10), b = new h(3), w = new h(7), _ = Ns(), S = li;
  cf = T;
  function y(O, N) {
    return N = N || "utf8", ut.isBuffer(O) || (O = new ut(O, N)), this._pub = new h(O), this;
  }
  function x(O, N) {
    return N = N || "utf8", ut.isBuffer(O) || (O = new ut(O, N)), this._priv = new h(O), this;
  }
  var B = {};
  function A(O, N) {
    var q = N.toString("hex"), ft = [q, O.toString(16)].join("_");
    if (ft in B)
      return B[ft];
    var F = 0;
    if (O.isEven() || !_.simpleSieve || !_.fermatTest(O) || !l.test(O))
      return F += 1, q === "02" || q === "05" ? F += 8 : F += 4, B[ft] = F, F;
    l.test(O.shrn(1)) || (F += 2);
    var _t;
    switch (q) {
      case "02":
        O.mod(o).cmp(m) && (F += 8);
        break;
      case "05":
        _t = O.mod(f), _t.cmp(b) && _t.cmp(w) && (F += 8);
        break;
      default:
        F += 4;
    }
    return B[ft] = F, F;
  }
  function T(O, N, q) {
    this.setGenerator(N), this.__prime = new h(O), this._prime = h.mont(this.__prime), this._primeLen = O.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, q ? (this.setPublicKey = y, this.setPrivateKey = x) : this._primeCode = 8;
  }
  Object.defineProperty(T.prototype, "verifyError", {
    enumerable: !0,
    get: function() {
      return typeof this._primeCode != "number" && (this._primeCode = A(this.__prime, this.__gen)), this._primeCode;
    }
  }), T.prototype.generateKeys = function() {
    return this._priv || (this._priv = new h(S(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey();
  }, T.prototype.computeSecret = function(O) {
    O = new h(O), O = O.toRed(this._prime);
    var N = O.redPow(this._priv).fromRed(), q = new ut(N.toArray()), ft = this.getPrime();
    if (q.length < ft.length) {
      var F = new ut(ft.length - q.length);
      F.fill(0), q = ut.concat([F, q]);
    }
    return q;
  }, T.prototype.getPublicKey = function(N) {
    return D(this._pub, N);
  }, T.prototype.getPrivateKey = function(N) {
    return D(this._priv, N);
  }, T.prototype.getPrime = function(O) {
    return D(this.__prime, O);
  }, T.prototype.getGenerator = function(O) {
    return D(this._gen, O);
  }, T.prototype.setGenerator = function(O, N) {
    return N = N || "utf8", ut.isBuffer(O) || (O = new ut(O, N)), this.__gen = O, this._gen = new h(O), this;
  };
  function D(O, N) {
    var q = new ut(O.toArray());
    return N ? q.toString(N) : q;
  }
  return cf;
}
var ma;
function k1() {
  if (ma)
    return $r;
  ma = 1;
  var h = Ns(), n = B1, l = E1();
  function o(b) {
    var w = new ut(n[b].prime, "hex"), _ = new ut(n[b].gen, "hex");
    return new l(w, _);
  }
  var m = {
    binary: !0,
    hex: !0,
    base64: !0
  };
  function f(b, w, _, S) {
    return ut.isBuffer(w) || m[w] === void 0 ? f(b, "binary", w, _) : (w = w || "binary", S = S || "binary", _ = _ || new ut([2]), ut.isBuffer(_) || (_ = new ut(_, S)), typeof b == "number" ? new l(h(b, _), _, !0) : (ut.isBuffer(b) || (b = new ut(b, w)), new l(b, _, !0)));
  }
  return $r.DiffieHellmanGroup = $r.createDiffieHellmanGroup = $r.getDiffieHellman = o, $r.createDiffieHellman = $r.DiffieHellman = f, $r;
}
var jf = { exports: {} }, Qf = { exports: {} };
typeof ye > "u" || !ye.version || ye.version.indexOf("v0.") === 0 || ye.version.indexOf("v1.") === 0 && ye.version.indexOf("v1.8.") !== 0 ? Qf.exports = { nextTick: R1 } : Qf.exports = ye;
function R1(h, n, l, o) {
  if (typeof h != "function")
    throw new TypeError('"callback" argument must be a function');
  var m = arguments.length, f, b;
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
        h.call(null, n, l);
      });
    case 4:
      return ye.nextTick(function() {
        h.call(null, n, l, o);
      });
    default:
      for (f = new Array(m - 1), b = 0; b < f.length; )
        f[b++] = arguments[b];
      return ye.nextTick(function() {
        h.apply(null, f);
      });
  }
}
var Un = Qf.exports, I1 = {}.toString, T1 = Array.isArray || function(h) {
  return I1.call(h) == "[object Array]";
}, $s = ge.EventEmitter, t0 = { exports: {} };
(function(h, n) {
  var l = ge, o = l.Buffer;
  function m(b, w) {
    for (var _ in b)
      w[_] = b[_];
  }
  o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? h.exports = l : (m(l, n), n.Buffer = f);
  function f(b, w, _) {
    return o(b, w, _);
  }
  m(o, f), f.from = function(b, w, _) {
    if (typeof b == "number")
      throw new TypeError("Argument must not be a number");
    return o(b, w, _);
  }, f.alloc = function(b, w, _) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    var S = o(b);
    return w !== void 0 ? typeof _ == "string" ? S.fill(w, _) : S.fill(w) : S.fill(0), S;
  }, f.allocUnsafe = function(b) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    return o(b);
  }, f.allocUnsafeSlow = function(b) {
    if (typeof b != "number")
      throw new TypeError("Argument must be a number");
    return l.SlowBuffer(b);
  };
})(t0, t0.exports);
var B0 = t0.exports, we = {};
function C1(h) {
  return Array.isArray ? Array.isArray(h) : zn(h) === "[object Array]";
}
we.isArray = C1;
function q1(h) {
  return typeof h == "boolean";
}
we.isBoolean = q1;
function P1(h) {
  return h === null;
}
we.isNull = P1;
function D1(h) {
  return h == null;
}
we.isNullOrUndefined = D1;
function N1(h) {
  return typeof h == "number";
}
we.isNumber = N1;
function $1(h) {
  return typeof h == "string";
}
we.isString = $1;
function F1(h) {
  return typeof h == "symbol";
}
we.isSymbol = F1;
function L1(h) {
  return h === void 0;
}
we.isUndefined = L1;
function O1(h) {
  return zn(h) === "[object RegExp]";
}
we.isRegExp = O1;
function U1(h) {
  return typeof h == "object" && h !== null;
}
we.isObject = U1;
function z1(h) {
  return zn(h) === "[object Date]";
}
we.isDate = z1;
function K1(h) {
  return zn(h) === "[object Error]" || h instanceof Error;
}
we.isError = K1;
function H1(h) {
  return typeof h == "function";
}
we.isFunction = H1;
function Z1(h) {
  return h === null || typeof h == "boolean" || typeof h == "number" || typeof h == "string" || typeof h == "symbol" || // ES6 symbol
  typeof h > "u";
}
we.isPrimitive = Z1;
we.isBuffer = ge.Buffer.isBuffer;
function zn(h) {
  return Object.prototype.toString.call(h);
}
var vf = { exports: {} }, ga;
function W1() {
  return ga || (ga = 1, function(h) {
    function n(f, b) {
      if (!(f instanceof b))
        throw new TypeError("Cannot call a class as a function");
    }
    var l = B0.Buffer, o = ge;
    function m(f, b, w) {
      f.copy(b, w);
    }
    h.exports = function() {
      function f() {
        n(this, f), this.head = null, this.tail = null, this.length = 0;
      }
      return f.prototype.push = function(w) {
        var _ = { data: w, next: null };
        this.length > 0 ? this.tail.next = _ : this.head = _, this.tail = _, ++this.length;
      }, f.prototype.unshift = function(w) {
        var _ = { data: w, next: this.head };
        this.length === 0 && (this.tail = _), this.head = _, ++this.length;
      }, f.prototype.shift = function() {
        if (this.length !== 0) {
          var w = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, w;
        }
      }, f.prototype.clear = function() {
        this.head = this.tail = null, this.length = 0;
      }, f.prototype.join = function(w) {
        if (this.length === 0)
          return "";
        for (var _ = this.head, S = "" + _.data; _ = _.next; )
          S += w + _.data;
        return S;
      }, f.prototype.concat = function(w) {
        if (this.length === 0)
          return l.alloc(0);
        for (var _ = l.allocUnsafe(w >>> 0), S = this.head, y = 0; S; )
          m(S.data, _, y), y += S.data.length, S = S.next;
        return _;
      }, f;
    }(), o && o.inspect && o.inspect.custom && (h.exports.prototype[o.inspect.custom] = function() {
      var f = o.inspect({ length: this.length });
      return this.constructor.name + " " + f;
    });
  }(vf)), vf.exports;
}
var nn = Un;
function V1(h, n) {
  var l = this, o = this._readableState && this._readableState.destroyed, m = this._writableState && this._writableState.destroyed;
  return o || m ? (n ? n(h) : h && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, nn.nextTick(fn, this, h)) : nn.nextTick(fn, this, h)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(h || null, function(f) {
    !n && f ? l._writableState ? l._writableState.errorEmitted || (l._writableState.errorEmitted = !0, nn.nextTick(fn, l, f)) : nn.nextTick(fn, l, f) : n && n(f);
  }), this);
}
function Y1() {
  this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
}
function fn(h, n) {
  h.emit("error", n);
}
var Fs = {
  destroy: V1,
  undestroy: Y1
}, J1 = G1;
function G1(h, n) {
  if (pf("noDeprecation"))
    return h;
  var l = !1;
  function o() {
    if (!l) {
      if (pf("throwDeprecation"))
        throw new Error(n);
      pf("traceDeprecation") ? console.trace(n) : console.warn(n), l = !0;
    }
    return h.apply(this, arguments);
  }
  return o;
}
function pf(h) {
  try {
    if (!Gt.localStorage)
      return !1;
  } catch {
    return !1;
  }
  var n = Gt.localStorage[h];
  return n == null ? !1 : String(n).toLowerCase() === "true";
}
var mf, ba;
function Ls() {
  if (ba)
    return mf;
  ba = 1;
  var h = Un;
  mf = D;
  function n(c) {
    var v = this;
    this.next = null, this.entry = null, this.finish = function() {
      d(v, c);
    };
  }
  var l = !ye.browser && ["v0.10", "v0.9."].indexOf(ye.version.slice(0, 5)) > -1 ? setImmediate : h.nextTick, o;
  D.WritableState = A;
  var m = Object.create(we);
  m.inherits = Jt;
  var f = {
    deprecate: J1
  }, b = $s, w = B0.Buffer, _ = (typeof Gt < "u" ? Gt : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function S(c) {
    return w.from(c);
  }
  function y(c) {
    return w.isBuffer(c) || c instanceof _;
  }
  var x = Fs;
  m.inherits(D, b);
  function B() {
  }
  function A(c, v) {
    o = o || fi(), c = c || {};
    var s = v instanceof o;
    this.objectMode = !!c.objectMode, s && (this.objectMode = this.objectMode || !!c.writableObjectMode);
    var e = c.highWaterMark, u = c.writableHighWaterMark, g = this.objectMode ? 16 : 16 * 1024;
    e || e === 0 ? this.highWaterMark = e : s && (u || u === 0) ? this.highWaterMark = u : this.highWaterMark = g, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var M = c.decodeStrings === !1;
    this.decodeStrings = !M, this.defaultEncoding = c.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(k) {
      kt(v, k);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new n(this);
  }
  A.prototype.getBuffer = function() {
    for (var v = this.bufferedRequest, s = []; v; )
      s.push(v), v = v.next;
    return s;
  }, function() {
    try {
      Object.defineProperty(A.prototype, "buffer", {
        get: f.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  }();
  var T;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (T = Function.prototype[Symbol.hasInstance], Object.defineProperty(D, Symbol.hasInstance, {
    value: function(c) {
      return T.call(this, c) ? !0 : this !== D ? !1 : c && c._writableState instanceof A;
    }
  })) : T = function(c) {
    return c instanceof this;
  };
  function D(c) {
    if (o = o || fi(), !T.call(D, this) && !(this instanceof o))
      return new D(c);
    this._writableState = new A(c, this), this.writable = !0, c && (typeof c.write == "function" && (this._write = c.write), typeof c.writev == "function" && (this._writev = c.writev), typeof c.destroy == "function" && (this._destroy = c.destroy), typeof c.final == "function" && (this._final = c.final)), b.call(this);
  }
  D.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function O(c, v) {
    var s = new Error("write after end");
    c.emit("error", s), h.nextTick(v, s);
  }
  function N(c, v, s, e) {
    var u = !0, g = !1;
    return s === null ? g = new TypeError("May not write null values to stream") : typeof s != "string" && s !== void 0 && !v.objectMode && (g = new TypeError("Invalid non-string/buffer chunk")), g && (c.emit("error", g), h.nextTick(e, g), u = !1), u;
  }
  D.prototype.write = function(c, v, s) {
    var e = this._writableState, u = !1, g = !e.objectMode && y(c);
    return g && !w.isBuffer(c) && (c = S(c)), typeof v == "function" && (s = v, v = null), g ? v = "buffer" : v || (v = e.defaultEncoding), typeof s != "function" && (s = B), e.ended ? O(this, s) : (g || N(this, e, c, s)) && (e.pendingcb++, u = ft(this, e, g, c, v, s)), u;
  }, D.prototype.cork = function() {
    var c = this._writableState;
    c.corked++;
  }, D.prototype.uncork = function() {
    var c = this._writableState;
    c.corked && (c.corked--, !c.writing && !c.corked && !c.bufferProcessing && c.bufferedRequest && Et(this, c));
  }, D.prototype.setDefaultEncoding = function(v) {
    if (typeof v == "string" && (v = v.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((v + "").toLowerCase()) > -1))
      throw new TypeError("Unknown encoding: " + v);
    return this._writableState.defaultEncoding = v, this;
  };
  function q(c, v, s) {
    return !c.objectMode && c.decodeStrings !== !1 && typeof v == "string" && (v = w.from(v, s)), v;
  }
  Object.defineProperty(D.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function ft(c, v, s, e, u, g) {
    if (!s) {
      var M = q(v, e, u);
      e !== M && (s = !0, u = "buffer", e = M);
    }
    var k = v.objectMode ? 1 : e.length;
    v.length += k;
    var R = v.length < v.highWaterMark;
    if (R || (v.needDrain = !0), v.writing || v.corked) {
      var P = v.lastBufferedRequest;
      v.lastBufferedRequest = {
        chunk: e,
        encoding: u,
        isBuf: s,
        callback: g,
        next: null
      }, P ? P.next = v.lastBufferedRequest : v.bufferedRequest = v.lastBufferedRequest, v.bufferedRequestCount += 1;
    } else
      F(c, v, !1, k, e, u, g);
    return R;
  }
  function F(c, v, s, e, u, g, M) {
    v.writelen = e, v.writecb = M, v.writing = !0, v.sync = !0, s ? c._writev(u, v.onwrite) : c._write(u, g, v.onwrite), v.sync = !1;
  }
  function _t(c, v, s, e, u) {
    --v.pendingcb, s ? (h.nextTick(u, e), h.nextTick(i, c, v), c._writableState.errorEmitted = !0, c.emit("error", e)) : (u(e), c._writableState.errorEmitted = !0, c.emit("error", e), i(c, v));
  }
  function St(c) {
    c.writing = !1, c.writecb = null, c.length -= c.writelen, c.writelen = 0;
  }
  function kt(c, v) {
    var s = c._writableState, e = s.sync, u = s.writecb;
    if (St(s), v)
      _t(c, s, e, v, u);
    else {
      var g = p(s);
      !g && !s.corked && !s.bufferProcessing && s.bufferedRequest && Et(c, s), e ? l(At, c, s, g, u) : At(c, s, g, u);
    }
  }
  function At(c, v, s, e) {
    s || U(c, v), v.pendingcb--, e(), i(c, v);
  }
  function U(c, v) {
    v.length === 0 && v.needDrain && (v.needDrain = !1, c.emit("drain"));
  }
  function Et(c, v) {
    v.bufferProcessing = !0;
    var s = v.bufferedRequest;
    if (c._writev && s && s.next) {
      var e = v.bufferedRequestCount, u = new Array(e), g = v.corkedRequestsFree;
      g.entry = s;
      for (var M = 0, k = !0; s; )
        u[M] = s, s.isBuf || (k = !1), s = s.next, M += 1;
      u.allBuffers = k, F(c, v, !0, v.length, u, "", g.finish), v.pendingcb++, v.lastBufferedRequest = null, g.next ? (v.corkedRequestsFree = g.next, g.next = null) : v.corkedRequestsFree = new n(v), v.bufferedRequestCount = 0;
    } else {
      for (; s; ) {
        var R = s.chunk, P = s.encoding, E = s.callback, I = v.objectMode ? 1 : R.length;
        if (F(c, v, !1, I, R, P, E), s = s.next, v.bufferedRequestCount--, v.writing)
          break;
      }
      s === null && (v.lastBufferedRequest = null);
    }
    v.bufferedRequest = s, v.bufferProcessing = !1;
  }
  D.prototype._write = function(c, v, s) {
    s(new Error("_write() is not implemented"));
  }, D.prototype._writev = null, D.prototype.end = function(c, v, s) {
    var e = this._writableState;
    typeof c == "function" ? (s = c, c = null, v = null) : typeof v == "function" && (s = v, v = null), c != null && this.write(c, v), e.corked && (e.corked = 1, this.uncork()), e.ending || a(this, e, s);
  };
  function p(c) {
    return c.ending && c.length === 0 && c.bufferedRequest === null && !c.finished && !c.writing;
  }
  function t(c, v) {
    c._final(function(s) {
      v.pendingcb--, s && c.emit("error", s), v.prefinished = !0, c.emit("prefinish"), i(c, v);
    });
  }
  function r(c, v) {
    !v.prefinished && !v.finalCalled && (typeof c._final == "function" ? (v.pendingcb++, v.finalCalled = !0, h.nextTick(t, c, v)) : (v.prefinished = !0, c.emit("prefinish")));
  }
  function i(c, v) {
    var s = p(v);
    return s && (r(c, v), v.pendingcb === 0 && (v.finished = !0, c.emit("finish"))), s;
  }
  function a(c, v, s) {
    v.ending = !0, i(c, v), s && (v.finished ? h.nextTick(s) : c.once("finish", s)), v.ended = !0, c.writable = !1;
  }
  function d(c, v, s) {
    var e = c.entry;
    for (c.entry = null; e; ) {
      var u = e.callback;
      v.pendingcb--, u(s), e = e.next;
    }
    v.corkedRequestsFree.next = c;
  }
  return Object.defineProperty(D.prototype, "destroyed", {
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(c) {
      this._writableState && (this._writableState.destroyed = c);
    }
  }), D.prototype.destroy = x.destroy, D.prototype._undestroy = x.undestroy, D.prototype._destroy = function(c, v) {
    this.end(), v(c);
  }, mf;
}
var gf, ya;
function fi() {
  if (ya)
    return gf;
  ya = 1;
  var h = Un, n = Object.keys || function(x) {
    var B = [];
    for (var A in x)
      B.push(A);
    return B;
  };
  gf = _;
  var l = Object.create(we);
  l.inherits = Jt;
  var o = Os(), m = Ls();
  l.inherits(_, o);
  for (var f = n(m.prototype), b = 0; b < f.length; b++) {
    var w = f[b];
    _.prototype[w] || (_.prototype[w] = m.prototype[w]);
  }
  function _(x) {
    if (!(this instanceof _))
      return new _(x);
    o.call(this, x), m.call(this, x), x && x.readable === !1 && (this.readable = !1), x && x.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, x && x.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", S);
  }
  Object.defineProperty(_.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function S() {
    this.allowHalfOpen || this._writableState.ended || h.nextTick(y, this);
  }
  function y(x) {
    x.end();
  }
  return Object.defineProperty(_.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(x) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = x, this._writableState.destroyed = x);
    }
  }), _.prototype._destroy = function(x, B) {
    this.push(null), this.end(), h.nextTick(B, x);
  }, gf;
}
var bf, wa;
function Os() {
  if (wa)
    return bf;
  wa = 1;
  var h = Un;
  bf = q;
  var n = T1, l;
  q.ReadableState = N, ge.EventEmitter;
  var o = function(E, I) {
    return E.listeners(I).length;
  }, m = $s, f = B0.Buffer, b = (typeof Gt < "u" ? Gt : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function w(E) {
    return f.from(E);
  }
  function _(E) {
    return f.isBuffer(E) || E instanceof b;
  }
  var S = Object.create(we);
  S.inherits = Jt;
  var y = ge, x = void 0;
  y && y.debuglog ? x = y.debuglog("stream") : x = function() {
  };
  var B = W1(), A = Fs, T;
  S.inherits(q, m);
  var D = ["error", "close", "destroy", "pause", "resume"];
  function O(E, I, C) {
    if (typeof E.prependListener == "function")
      return E.prependListener(I, C);
    !E._events || !E._events[I] ? E.on(I, C) : n(E._events[I]) ? E._events[I].unshift(C) : E._events[I] = [C, E._events[I]];
  }
  function N(E, I) {
    l = l || fi(), E = E || {};
    var C = I instanceof l;
    this.objectMode = !!E.objectMode, C && (this.objectMode = this.objectMode || !!E.readableObjectMode);
    var $ = E.highWaterMark, Bt = E.readableHighWaterMark, L = this.objectMode ? 16 : 16 * 1024;
    $ || $ === 0 ? this.highWaterMark = $ : C && (Bt || Bt === 0) ? this.highWaterMark = Bt : this.highWaterMark = L, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new B(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = E.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, E.encoding && (T || (T = pn.StringDecoder), this.decoder = new T(E.encoding), this.encoding = E.encoding);
  }
  function q(E) {
    if (l = l || fi(), !(this instanceof q))
      return new q(E);
    this._readableState = new N(E, this), this.readable = !0, E && (typeof E.read == "function" && (this._read = E.read), typeof E.destroy == "function" && (this._destroy = E.destroy)), m.call(this);
  }
  Object.defineProperty(q.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(E) {
      this._readableState && (this._readableState.destroyed = E);
    }
  }), q.prototype.destroy = A.destroy, q.prototype._undestroy = A.undestroy, q.prototype._destroy = function(E, I) {
    this.push(null), I(E);
  }, q.prototype.push = function(E, I) {
    var C = this._readableState, $;
    return C.objectMode ? $ = !0 : typeof E == "string" && (I = I || C.defaultEncoding, I !== C.encoding && (E = f.from(E, I), I = ""), $ = !0), ft(this, E, I, !1, $);
  }, q.prototype.unshift = function(E) {
    return ft(this, E, null, !0, !1);
  };
  function ft(E, I, C, $, Bt) {
    var L = E._readableState;
    if (I === null)
      L.reading = !1, Et(E, L);
    else {
      var z;
      Bt || (z = _t(L, I)), z ? E.emit("error", z) : L.objectMode || I && I.length > 0 ? (typeof I != "string" && !L.objectMode && Object.getPrototypeOf(I) !== f.prototype && (I = w(I)), $ ? L.endEmitted ? E.emit("error", new Error("stream.unshift() after end event")) : F(E, L, I, !0) : L.ended ? E.emit("error", new Error("stream.push() after EOF")) : (L.reading = !1, L.decoder && !C ? (I = L.decoder.write(I), L.objectMode || I.length !== 0 ? F(E, L, I, !1) : r(E, L)) : F(E, L, I, !1))) : $ || (L.reading = !1);
    }
    return St(L);
  }
  function F(E, I, C, $) {
    I.flowing && I.length === 0 && !I.sync ? (E.emit("data", C), E.read(0)) : (I.length += I.objectMode ? 1 : C.length, $ ? I.buffer.unshift(C) : I.buffer.push(C), I.needReadable && p(E)), r(E, I);
  }
  function _t(E, I) {
    var C;
    return !_(I) && typeof I != "string" && I !== void 0 && !E.objectMode && (C = new TypeError("Invalid non-string/buffer chunk")), C;
  }
  function St(E) {
    return !E.ended && (E.needReadable || E.length < E.highWaterMark || E.length === 0);
  }
  q.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, q.prototype.setEncoding = function(E) {
    return T || (T = pn.StringDecoder), this._readableState.decoder = new T(E), this._readableState.encoding = E, this;
  };
  var kt = 8388608;
  function At(E) {
    return E >= kt ? E = kt : (E--, E |= E >>> 1, E |= E >>> 2, E |= E >>> 4, E |= E >>> 8, E |= E >>> 16, E++), E;
  }
  function U(E, I) {
    return E <= 0 || I.length === 0 && I.ended ? 0 : I.objectMode ? 1 : E !== E ? I.flowing && I.length ? I.buffer.head.data.length : I.length : (E > I.highWaterMark && (I.highWaterMark = At(E)), E <= I.length ? E : I.ended ? I.length : (I.needReadable = !0, 0));
  }
  q.prototype.read = function(E) {
    x("read", E), E = parseInt(E, 10);
    var I = this._readableState, C = E;
    if (E !== 0 && (I.emittedReadable = !1), E === 0 && I.needReadable && (I.length >= I.highWaterMark || I.ended))
      return x("read: emitReadable", I.length, I.ended), I.length === 0 && I.ended ? k(this) : p(this), null;
    if (E = U(E, I), E === 0 && I.ended)
      return I.length === 0 && k(this), null;
    var $ = I.needReadable;
    x("need readable", $), (I.length === 0 || I.length - E < I.highWaterMark) && ($ = !0, x("length less than watermark", $)), I.ended || I.reading ? ($ = !1, x("reading or ended", $)) : $ && (x("do read"), I.reading = !0, I.sync = !0, I.length === 0 && (I.needReadable = !0), this._read(I.highWaterMark), I.sync = !1, I.reading || (E = U(C, I)));
    var Bt;
    return E > 0 ? Bt = e(E, I) : Bt = null, Bt === null ? (I.needReadable = !0, E = 0) : I.length -= E, I.length === 0 && (I.ended || (I.needReadable = !0), C !== E && I.ended && k(this)), Bt !== null && this.emit("data", Bt), Bt;
  };
  function Et(E, I) {
    if (!I.ended) {
      if (I.decoder) {
        var C = I.decoder.end();
        C && C.length && (I.buffer.push(C), I.length += I.objectMode ? 1 : C.length);
      }
      I.ended = !0, p(E);
    }
  }
  function p(E) {
    var I = E._readableState;
    I.needReadable = !1, I.emittedReadable || (x("emitReadable", I.flowing), I.emittedReadable = !0, I.sync ? h.nextTick(t, E) : t(E));
  }
  function t(E) {
    x("emit readable"), E.emit("readable"), s(E);
  }
  function r(E, I) {
    I.readingMore || (I.readingMore = !0, h.nextTick(i, E, I));
  }
  function i(E, I) {
    for (var C = I.length; !I.reading && !I.flowing && !I.ended && I.length < I.highWaterMark && (x("maybeReadMore read 0"), E.read(0), C !== I.length); )
      C = I.length;
    I.readingMore = !1;
  }
  q.prototype._read = function(E) {
    this.emit("error", new Error("_read() is not implemented"));
  }, q.prototype.pipe = function(E, I) {
    var C = this, $ = this._readableState;
    switch ($.pipesCount) {
      case 0:
        $.pipes = E;
        break;
      case 1:
        $.pipes = [$.pipes, E];
        break;
      default:
        $.pipes.push(E);
        break;
    }
    $.pipesCount += 1, x("pipe count=%d opts=%j", $.pipesCount, I);
    var Bt = (!I || I.end !== !1) && E !== ye.stdout && E !== ye.stderr, L = Bt ? Ct : Rt;
    $.endEmitted ? h.nextTick(L) : C.once("end", L), E.on("unpipe", z);
    function z(K, at) {
      x("onunpipe"), K === C && at && at.hasUnpiped === !1 && (at.hasUnpiped = !0, Dt());
    }
    function Ct() {
      x("onend"), E.end();
    }
    var H = a(C);
    E.on("drain", H);
    var st = !1;
    function Dt() {
      x("cleanup"), E.removeListener("close", W), E.removeListener("finish", ht), E.removeListener("drain", H), E.removeListener("error", qt), E.removeListener("unpipe", z), C.removeListener("end", Ct), C.removeListener("end", Rt), C.removeListener("data", ot), st = !0, $.awaitDrain && (!E._writableState || E._writableState.needDrain) && H();
    }
    var Z = !1;
    C.on("data", ot);
    function ot(K) {
      x("ondata"), Z = !1;
      var at = E.write(K);
      at === !1 && !Z && (($.pipesCount === 1 && $.pipes === E || $.pipesCount > 1 && P($.pipes, E) !== -1) && !st && (x("false write response, pause", $.awaitDrain), $.awaitDrain++, Z = !0), C.pause());
    }
    function qt(K) {
      x("onerror", K), Rt(), E.removeListener("error", qt), o(E, "error") === 0 && E.emit("error", K);
    }
    O(E, "error", qt);
    function W() {
      E.removeListener("finish", ht), Rt();
    }
    E.once("close", W);
    function ht() {
      x("onfinish"), E.removeListener("close", W), Rt();
    }
    E.once("finish", ht);
    function Rt() {
      x("unpipe"), C.unpipe(E);
    }
    return E.emit("pipe", C), $.flowing || (x("pipe resume"), C.resume()), E;
  };
  function a(E) {
    return function() {
      var I = E._readableState;
      x("pipeOnDrain", I.awaitDrain), I.awaitDrain && I.awaitDrain--, I.awaitDrain === 0 && o(E, "data") && (I.flowing = !0, s(E));
    };
  }
  q.prototype.unpipe = function(E) {
    var I = this._readableState, C = { hasUnpiped: !1 };
    if (I.pipesCount === 0)
      return this;
    if (I.pipesCount === 1)
      return E && E !== I.pipes ? this : (E || (E = I.pipes), I.pipes = null, I.pipesCount = 0, I.flowing = !1, E && E.emit("unpipe", this, C), this);
    if (!E) {
      var $ = I.pipes, Bt = I.pipesCount;
      I.pipes = null, I.pipesCount = 0, I.flowing = !1;
      for (var L = 0; L < Bt; L++)
        $[L].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var z = P(I.pipes, E);
    return z === -1 ? this : (I.pipes.splice(z, 1), I.pipesCount -= 1, I.pipesCount === 1 && (I.pipes = I.pipes[0]), E.emit("unpipe", this, C), this);
  }, q.prototype.on = function(E, I) {
    var C = m.prototype.on.call(this, E, I);
    if (E === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (E === "readable") {
      var $ = this._readableState;
      !$.endEmitted && !$.readableListening && ($.readableListening = $.needReadable = !0, $.emittedReadable = !1, $.reading ? $.length && p(this) : h.nextTick(d, this));
    }
    return C;
  }, q.prototype.addListener = q.prototype.on;
  function d(E) {
    x("readable nexttick read 0"), E.read(0);
  }
  q.prototype.resume = function() {
    var E = this._readableState;
    return E.flowing || (x("resume"), E.flowing = !0, c(this, E)), this;
  };
  function c(E, I) {
    I.resumeScheduled || (I.resumeScheduled = !0, h.nextTick(v, E, I));
  }
  function v(E, I) {
    I.reading || (x("resume read 0"), E.read(0)), I.resumeScheduled = !1, I.awaitDrain = 0, E.emit("resume"), s(E), I.flowing && !I.reading && E.read(0);
  }
  q.prototype.pause = function() {
    return x("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (x("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
  };
  function s(E) {
    var I = E._readableState;
    for (x("flow", I.flowing); I.flowing && E.read() !== null; )
      ;
  }
  q.prototype.wrap = function(E) {
    var I = this, C = this._readableState, $ = !1;
    E.on("end", function() {
      if (x("wrapped end"), C.decoder && !C.ended) {
        var z = C.decoder.end();
        z && z.length && I.push(z);
      }
      I.push(null);
    }), E.on("data", function(z) {
      if (x("wrapped data"), C.decoder && (z = C.decoder.write(z)), !(C.objectMode && z == null) && !(!C.objectMode && (!z || !z.length))) {
        var Ct = I.push(z);
        Ct || ($ = !0, E.pause());
      }
    });
    for (var Bt in E)
      this[Bt] === void 0 && typeof E[Bt] == "function" && (this[Bt] = function(z) {
        return function() {
          return E[z].apply(E, arguments);
        };
      }(Bt));
    for (var L = 0; L < D.length; L++)
      E.on(D[L], this.emit.bind(this, D[L]));
    return this._read = function(z) {
      x("wrapped _read", z), $ && ($ = !1, E.resume());
    }, this;
  }, Object.defineProperty(q.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), q._fromList = e;
  function e(E, I) {
    if (I.length === 0)
      return null;
    var C;
    return I.objectMode ? C = I.buffer.shift() : !E || E >= I.length ? (I.decoder ? C = I.buffer.join("") : I.buffer.length === 1 ? C = I.buffer.head.data : C = I.buffer.concat(I.length), I.buffer.clear()) : C = u(E, I.buffer, I.decoder), C;
  }
  function u(E, I, C) {
    var $;
    return E < I.head.data.length ? ($ = I.head.data.slice(0, E), I.head.data = I.head.data.slice(E)) : E === I.head.data.length ? $ = I.shift() : $ = C ? g(E, I) : M(E, I), $;
  }
  function g(E, I) {
    var C = I.head, $ = 1, Bt = C.data;
    for (E -= Bt.length; C = C.next; ) {
      var L = C.data, z = E > L.length ? L.length : E;
      if (z === L.length ? Bt += L : Bt += L.slice(0, E), E -= z, E === 0) {
        z === L.length ? (++$, C.next ? I.head = C.next : I.head = I.tail = null) : (I.head = C, C.data = L.slice(z));
        break;
      }
      ++$;
    }
    return I.length -= $, Bt;
  }
  function M(E, I) {
    var C = f.allocUnsafe(E), $ = I.head, Bt = 1;
    for ($.data.copy(C), E -= $.data.length; $ = $.next; ) {
      var L = $.data, z = E > L.length ? L.length : E;
      if (L.copy(C, C.length - E, 0, z), E -= z, E === 0) {
        z === L.length ? (++Bt, $.next ? I.head = $.next : I.head = I.tail = null) : (I.head = $, $.data = L.slice(z));
        break;
      }
      ++Bt;
    }
    return I.length -= Bt, C;
  }
  function k(E) {
    var I = E._readableState;
    if (I.length > 0)
      throw new Error('"endReadable()" called on non-empty stream');
    I.endEmitted || (I.ended = !0, h.nextTick(R, I, E));
  }
  function R(E, I) {
    !E.endEmitted && E.length === 0 && (E.endEmitted = !0, I.readable = !1, I.emit("end"));
  }
  function P(E, I) {
    for (var C = 0, $ = E.length; C < $; C++)
      if (E[C] === I)
        return C;
    return -1;
  }
  return bf;
}
var Us = Mr, Kn = fi(), zs = Object.create(we);
zs.inherits = Jt;
zs.inherits(Mr, Kn);
function X1(h, n) {
  var l = this._transformState;
  l.transforming = !1;
  var o = l.writecb;
  if (!o)
    return this.emit("error", new Error("write callback called multiple times"));
  l.writechunk = null, l.writecb = null, n != null && this.push(n), o(h);
  var m = this._readableState;
  m.reading = !1, (m.needReadable || m.length < m.highWaterMark) && this._read(m.highWaterMark);
}
function Mr(h) {
  if (!(this instanceof Mr))
    return new Mr(h);
  Kn.call(this, h), this._transformState = {
    afterTransform: X1.bind(this),
    needTransform: !1,
    transforming: !1,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }, this._readableState.needReadable = !0, this._readableState.sync = !1, h && (typeof h.transform == "function" && (this._transform = h.transform), typeof h.flush == "function" && (this._flush = h.flush)), this.on("prefinish", j1);
}
function j1() {
  var h = this;
  typeof this._flush == "function" ? this._flush(function(n, l) {
    Ma(h, n, l);
  }) : Ma(this, null, null);
}
Mr.prototype.push = function(h, n) {
  return this._transformState.needTransform = !1, Kn.prototype.push.call(this, h, n);
};
Mr.prototype._transform = function(h, n, l) {
  throw new Error("_transform() is not implemented");
};
Mr.prototype._write = function(h, n, l) {
  var o = this._transformState;
  if (o.writecb = l, o.writechunk = h, o.writeencoding = n, !o.transforming) {
    var m = this._readableState;
    (o.needTransform || m.needReadable || m.length < m.highWaterMark) && this._read(m.highWaterMark);
  }
};
Mr.prototype._read = function(h) {
  var n = this._transformState;
  n.writechunk !== null && n.writecb && !n.transforming ? (n.transforming = !0, this._transform(n.writechunk, n.writeencoding, n.afterTransform)) : n.needTransform = !0;
};
Mr.prototype._destroy = function(h, n) {
  var l = this;
  Kn.prototype._destroy.call(this, h, function(o) {
    n(o), l.emit("close");
  });
};
function Ma(h, n, l) {
  if (n)
    return h.emit("error", n);
  if (l != null && h.push(l), h._writableState.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (h._transformState.transforming)
    throw new Error("Calling transform done when still transforming");
  return h.push(null);
}
var Q1 = $i, Ks = Us, Hs = Object.create(we);
Hs.inherits = Jt;
Hs.inherits($i, Ks);
function $i(h) {
  if (!(this instanceof $i))
    return new $i(h);
  Ks.call(this, h);
}
$i.prototype._transform = function(h, n, l) {
  l(null, h);
};
(function(h, n) {
  n = h.exports = Os(), n.Stream = n, n.Readable = n, n.Writable = Ls(), n.Duplex = fi(), n.Transform = Us, n.PassThrough = Q1;
})(jf, jf.exports);
var tv = jf.exports, Bi = { exports: {} }, E0 = { exports: {} };
E0.exports;
(function(h) {
  (function(n, l) {
    function o(r, i) {
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
    typeof n == "object" ? n.exports = f : l.BN = f, f.BN = f, f.wordSize = 26;
    var b;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? b = window.Buffer : b = ge.Buffer;
    } catch {
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
      a === "hex" && (a = 16), o(a === (a | 0) && a >= 2 && a <= 36), i = i.toString().replace(/\s+/g, "");
      var c = 0;
      i[0] === "-" && (c++, this.negative = 1), c < i.length && (a === 16 ? this._parseHex(i, c, d) : (this._parseBase(i, a, c), d === "le" && this._initArray(this.toArray(), a, d)));
    }, f.prototype._initNumber = function(i, a, d) {
      i < 0 && (this.negative = 1, i = -i), i < 67108864 ? (this.words = [i & 67108863], this.length = 1) : i < 4503599627370496 ? (this.words = [
        i & 67108863,
        i / 67108864 & 67108863
      ], this.length = 2) : (o(i < 9007199254740992), this.words = [
        i & 67108863,
        i / 67108864 & 67108863,
        1
      ], this.length = 3), d === "le" && this._initArray(this.toArray(), a, d);
    }, f.prototype._initArray = function(i, a, d) {
      if (o(typeof i.length == "number"), i.length <= 0)
        return this.words = [0], this.length = 1, this;
      this.length = Math.ceil(i.length / 3), this.words = new Array(this.length);
      for (var c = 0; c < this.length; c++)
        this.words[c] = 0;
      var v, s, e = 0;
      if (d === "be")
        for (c = i.length - 1, v = 0; c >= 0; c -= 3)
          s = i[c] | i[c - 1] << 8 | i[c - 2] << 16, this.words[v] |= s << e & 67108863, this.words[v + 1] = s >>> 26 - e & 67108863, e += 24, e >= 26 && (e -= 26, v++);
      else if (d === "le")
        for (c = 0, v = 0; c < i.length; c += 3)
          s = i[c] | i[c + 1] << 8 | i[c + 2] << 16, this.words[v] |= s << e & 67108863, this.words[v + 1] = s >>> 26 - e & 67108863, e += 24, e >= 26 && (e -= 26, v++);
      return this._strip();
    };
    function w(r, i) {
      var a = r.charCodeAt(i);
      if (a >= 48 && a <= 57)
        return a - 48;
      if (a >= 65 && a <= 70)
        return a - 55;
      if (a >= 97 && a <= 102)
        return a - 87;
      o(!1, "Invalid character in " + r);
    }
    function _(r, i, a) {
      var d = w(r, a);
      return a - 1 >= i && (d |= w(r, a - 1) << 4), d;
    }
    f.prototype._parseHex = function(i, a, d) {
      this.length = Math.ceil((i.length - a) / 6), this.words = new Array(this.length);
      for (var c = 0; c < this.length; c++)
        this.words[c] = 0;
      var v = 0, s = 0, e;
      if (d === "be")
        for (c = i.length - 1; c >= a; c -= 2)
          e = _(i, a, c) << v, this.words[s] |= e & 67108863, v >= 18 ? (v -= 18, s += 1, this.words[s] |= e >>> 26) : v += 8;
      else {
        var u = i.length - a;
        for (c = u % 2 === 0 ? a + 1 : a; c < i.length; c += 2)
          e = _(i, a, c) << v, this.words[s] |= e & 67108863, v >= 18 ? (v -= 18, s += 1, this.words[s] |= e >>> 26) : v += 8;
      }
      this._strip();
    };
    function S(r, i, a, d) {
      for (var c = 0, v = 0, s = Math.min(r.length, a), e = i; e < s; e++) {
        var u = r.charCodeAt(e) - 48;
        c *= d, u >= 49 ? v = u - 49 + 10 : u >= 17 ? v = u - 17 + 10 : v = u, o(u >= 0 && v < d, "Invalid character"), c += v;
      }
      return c;
    }
    f.prototype._parseBase = function(i, a, d) {
      this.words = [0], this.length = 1;
      for (var c = 0, v = 1; v <= 67108863; v *= a)
        c++;
      c--, v = v / a | 0;
      for (var s = i.length - d, e = s % c, u = Math.min(s, s - e) + d, g = 0, M = d; M < u; M += c)
        g = S(i, M, M + c, a), this.imuln(v), this.words[0] + g < 67108864 ? this.words[0] += g : this._iaddn(g);
      if (e !== 0) {
        var k = 1;
        for (g = S(i, M, i.length, a), M = 0; M < e; M++)
          k *= a;
        this.imuln(k), this.words[0] + g < 67108864 ? this.words[0] += g : this._iaddn(g);
      }
      this._strip();
    }, f.prototype.copy = function(i) {
      i.words = new Array(this.length);
      for (var a = 0; a < this.length; a++)
        i.words[a] = this.words[a];
      i.length = this.length, i.negative = this.negative, i.red = this.red;
    };
    function y(r, i) {
      r.words = i.words, r.length = i.length, r.negative = i.negative, r.red = i.red;
    }
    if (f.prototype._move = function(i) {
      y(i, this);
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
    }, typeof Symbol < "u" && typeof Symbol.for == "function")
      try {
        f.prototype[Symbol.for("nodejs.util.inspect.custom")] = x;
      } catch {
        f.prototype.inspect = x;
      }
    else
      f.prototype.inspect = x;
    function x() {
      return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
    }
    var B = [
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
    ], A = [
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
    ], T = [
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
        for (var c = 0, v = 0, s = 0; s < this.length; s++) {
          var e = this.words[s], u = ((e << c | v) & 16777215).toString(16);
          v = e >>> 24 - c & 16777215, c += 2, c >= 26 && (c -= 26, s--), v !== 0 || s !== this.length - 1 ? d = B[6 - u.length] + u + d : d = u + d;
        }
        for (v !== 0 && (d = v.toString(16) + d); d.length % a !== 0; )
          d = "0" + d;
        return this.negative !== 0 && (d = "-" + d), d;
      }
      if (i === (i | 0) && i >= 2 && i <= 36) {
        var g = A[i], M = T[i];
        d = "";
        var k = this.clone();
        for (k.negative = 0; !k.isZero(); ) {
          var R = k.modrn(M).toString(i);
          k = k.idivn(M), k.isZero() ? d = R + d : d = B[g - R.length] + R + d;
        }
        for (this.isZero() && (d = "0" + d); d.length % a !== 0; )
          d = "0" + d;
        return this.negative !== 0 && (d = "-" + d), d;
      }
      o(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var i = this.words[0];
      return this.length === 2 ? i += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? i += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && o(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -i : i;
    }, f.prototype.toJSON = function() {
      return this.toString(16, 2);
    }, b && (f.prototype.toBuffer = function(i, a) {
      return this.toArrayLike(b, i, a);
    }), f.prototype.toArray = function(i, a) {
      return this.toArrayLike(Array, i, a);
    };
    var D = function(i, a) {
      return i.allocUnsafe ? i.allocUnsafe(a) : new i(a);
    };
    f.prototype.toArrayLike = function(i, a, d) {
      this._strip();
      var c = this.byteLength(), v = d || Math.max(1, c);
      o(c <= v, "byte array longer than desired length"), o(v > 0, "Requested array length <= 0");
      var s = D(i, v), e = a === "le" ? "LE" : "BE";
      return this["_toArrayLike" + e](s, c), s;
    }, f.prototype._toArrayLikeLE = function(i, a) {
      for (var d = 0, c = 0, v = 0, s = 0; v < this.length; v++) {
        var e = this.words[v] << s | c;
        i[d++] = e & 255, d < i.length && (i[d++] = e >> 8 & 255), d < i.length && (i[d++] = e >> 16 & 255), s === 6 ? (d < i.length && (i[d++] = e >> 24 & 255), c = 0, s = 0) : (c = e >>> 24, s += 2);
      }
      if (d < i.length)
        for (i[d++] = c; d < i.length; )
          i[d++] = 0;
    }, f.prototype._toArrayLikeBE = function(i, a) {
      for (var d = i.length - 1, c = 0, v = 0, s = 0; v < this.length; v++) {
        var e = this.words[v] << s | c;
        i[d--] = e & 255, d >= 0 && (i[d--] = e >> 8 & 255), d >= 0 && (i[d--] = e >> 16 & 255), s === 6 ? (d >= 0 && (i[d--] = e >> 24 & 255), c = 0, s = 0) : (c = e >>> 24, s += 2);
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
    function O(r) {
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
      return o((this.negative | i.negative) === 0), this.iuor(i);
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
      return o((this.negative | i.negative) === 0), this.iuand(i);
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
      return o((this.negative | i.negative) === 0), this.iuxor(i);
    }, f.prototype.xor = function(i) {
      return this.length > i.length ? this.clone().ixor(i) : i.clone().ixor(this);
    }, f.prototype.uxor = function(i) {
      return this.length > i.length ? this.clone().iuxor(i) : i.clone().iuxor(this);
    }, f.prototype.inotn = function(i) {
      o(typeof i == "number" && i >= 0);
      var a = Math.ceil(i / 26) | 0, d = i % 26;
      this._expand(a), d > 0 && a--;
      for (var c = 0; c < a; c++)
        this.words[c] = ~this.words[c] & 67108863;
      return d > 0 && (this.words[c] = ~this.words[c] & 67108863 >> 26 - d), this._strip();
    }, f.prototype.notn = function(i) {
      return this.clone().inotn(i);
    }, f.prototype.setn = function(i, a) {
      o(typeof i == "number" && i >= 0);
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
      for (var v = 0, s = 0; s < c.length; s++)
        a = (d.words[s] | 0) + (c.words[s] | 0) + v, this.words[s] = a & 67108863, v = a >>> 26;
      for (; v !== 0 && s < d.length; s++)
        a = (d.words[s] | 0) + v, this.words[s] = a & 67108863, v = a >>> 26;
      if (this.length = d.length, v !== 0)
        this.words[this.length] = v, this.length++;
      else if (d !== this)
        for (; s < d.length; s++)
          this.words[s] = d.words[s];
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
      for (var s = 0, e = 0; e < v.length; e++)
        a = (c.words[e] | 0) - (v.words[e] | 0) + s, s = a >> 26, this.words[e] = a & 67108863;
      for (; s !== 0 && e < c.length; e++)
        a = (c.words[e] | 0) + s, s = a >> 26, this.words[e] = a & 67108863;
      if (s === 0 && e < c.length && c !== this)
        for (; e < c.length; e++)
          this.words[e] = c.words[e];
      return this.length = Math.max(this.length, e), c !== this && (this.negative = 1), this._strip();
    }, f.prototype.sub = function(i) {
      return this.clone().isub(i);
    };
    function N(r, i, a) {
      a.negative = i.negative ^ r.negative;
      var d = r.length + i.length | 0;
      a.length = d, d = d - 1 | 0;
      var c = r.words[0] | 0, v = i.words[0] | 0, s = c * v, e = s & 67108863, u = s / 67108864 | 0;
      a.words[0] = e;
      for (var g = 1; g < d; g++) {
        for (var M = u >>> 26, k = u & 67108863, R = Math.min(g, i.length - 1), P = Math.max(0, g - r.length + 1); P <= R; P++) {
          var E = g - P | 0;
          c = r.words[E] | 0, v = i.words[P] | 0, s = c * v + k, M += s / 67108864 | 0, k = s & 67108863;
        }
        a.words[g] = k | 0, u = M | 0;
      }
      return u !== 0 ? a.words[g] = u | 0 : a.length--, a._strip();
    }
    var q = function(i, a, d) {
      var c = i.words, v = a.words, s = d.words, e = 0, u, g, M, k = c[0] | 0, R = k & 8191, P = k >>> 13, E = c[1] | 0, I = E & 8191, C = E >>> 13, $ = c[2] | 0, Bt = $ & 8191, L = $ >>> 13, z = c[3] | 0, Ct = z & 8191, H = z >>> 13, st = c[4] | 0, Dt = st & 8191, Z = st >>> 13, ot = c[5] | 0, qt = ot & 8191, W = ot >>> 13, ht = c[6] | 0, Rt = ht & 8191, K = ht >>> 13, at = c[7] | 0, $t = at & 8191, V = at >>> 13, lt = c[8] | 0, Ft = lt & 8191, Y = lt >>> 13, dt = c[9] | 0, Lt = dt & 8191, J = dt >>> 13, ct = v[0] | 0, Ot = ct & 8191, G = ct >>> 13, vt = v[1] | 0, Ut = vt & 8191, X = vt >>> 13, pt = v[2] | 0, zt = pt & 8191, j = pt >>> 13, mt = v[3] | 0, Kt = mt & 8191, Q = mt >>> 13, gt = v[4] | 0, Ht = gt & 8191, tt = gt >>> 13, bt = v[5] | 0, Zt = bt & 8191, et = bt >>> 13, yt = v[6] | 0, Wt = yt & 8191, rt = yt >>> 13, wt = v[7] | 0, Vt = wt & 8191, it = wt >>> 13, Mt = v[8] | 0, Yt = Mt & 8191, nt = Mt >>> 13, xt = v[9] | 0, It = xt & 8191, Tt = xt >>> 13;
      d.negative = i.negative ^ a.negative, d.length = 19, u = Math.imul(R, Ot), g = Math.imul(R, G), g = g + Math.imul(P, Ot) | 0, M = Math.imul(P, G);
      var jt = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, u = Math.imul(I, Ot), g = Math.imul(I, G), g = g + Math.imul(C, Ot) | 0, M = Math.imul(C, G), u = u + Math.imul(R, Ut) | 0, g = g + Math.imul(R, X) | 0, g = g + Math.imul(P, Ut) | 0, M = M + Math.imul(P, X) | 0;
      var Qt = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, u = Math.imul(Bt, Ot), g = Math.imul(Bt, G), g = g + Math.imul(L, Ot) | 0, M = Math.imul(L, G), u = u + Math.imul(I, Ut) | 0, g = g + Math.imul(I, X) | 0, g = g + Math.imul(C, Ut) | 0, M = M + Math.imul(C, X) | 0, u = u + Math.imul(R, zt) | 0, g = g + Math.imul(R, j) | 0, g = g + Math.imul(P, zt) | 0, M = M + Math.imul(P, j) | 0;
      var te = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, u = Math.imul(Ct, Ot), g = Math.imul(Ct, G), g = g + Math.imul(H, Ot) | 0, M = Math.imul(H, G), u = u + Math.imul(Bt, Ut) | 0, g = g + Math.imul(Bt, X) | 0, g = g + Math.imul(L, Ut) | 0, M = M + Math.imul(L, X) | 0, u = u + Math.imul(I, zt) | 0, g = g + Math.imul(I, j) | 0, g = g + Math.imul(C, zt) | 0, M = M + Math.imul(C, j) | 0, u = u + Math.imul(R, Kt) | 0, g = g + Math.imul(R, Q) | 0, g = g + Math.imul(P, Kt) | 0, M = M + Math.imul(P, Q) | 0;
      var ee = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, u = Math.imul(Dt, Ot), g = Math.imul(Dt, G), g = g + Math.imul(Z, Ot) | 0, M = Math.imul(Z, G), u = u + Math.imul(Ct, Ut) | 0, g = g + Math.imul(Ct, X) | 0, g = g + Math.imul(H, Ut) | 0, M = M + Math.imul(H, X) | 0, u = u + Math.imul(Bt, zt) | 0, g = g + Math.imul(Bt, j) | 0, g = g + Math.imul(L, zt) | 0, M = M + Math.imul(L, j) | 0, u = u + Math.imul(I, Kt) | 0, g = g + Math.imul(I, Q) | 0, g = g + Math.imul(C, Kt) | 0, M = M + Math.imul(C, Q) | 0, u = u + Math.imul(R, Ht) | 0, g = g + Math.imul(R, tt) | 0, g = g + Math.imul(P, Ht) | 0, M = M + Math.imul(P, tt) | 0;
      var re = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, u = Math.imul(qt, Ot), g = Math.imul(qt, G), g = g + Math.imul(W, Ot) | 0, M = Math.imul(W, G), u = u + Math.imul(Dt, Ut) | 0, g = g + Math.imul(Dt, X) | 0, g = g + Math.imul(Z, Ut) | 0, M = M + Math.imul(Z, X) | 0, u = u + Math.imul(Ct, zt) | 0, g = g + Math.imul(Ct, j) | 0, g = g + Math.imul(H, zt) | 0, M = M + Math.imul(H, j) | 0, u = u + Math.imul(Bt, Kt) | 0, g = g + Math.imul(Bt, Q) | 0, g = g + Math.imul(L, Kt) | 0, M = M + Math.imul(L, Q) | 0, u = u + Math.imul(I, Ht) | 0, g = g + Math.imul(I, tt) | 0, g = g + Math.imul(C, Ht) | 0, M = M + Math.imul(C, tt) | 0, u = u + Math.imul(R, Zt) | 0, g = g + Math.imul(R, et) | 0, g = g + Math.imul(P, Zt) | 0, M = M + Math.imul(P, et) | 0;
      var ie = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, u = Math.imul(Rt, Ot), g = Math.imul(Rt, G), g = g + Math.imul(K, Ot) | 0, M = Math.imul(K, G), u = u + Math.imul(qt, Ut) | 0, g = g + Math.imul(qt, X) | 0, g = g + Math.imul(W, Ut) | 0, M = M + Math.imul(W, X) | 0, u = u + Math.imul(Dt, zt) | 0, g = g + Math.imul(Dt, j) | 0, g = g + Math.imul(Z, zt) | 0, M = M + Math.imul(Z, j) | 0, u = u + Math.imul(Ct, Kt) | 0, g = g + Math.imul(Ct, Q) | 0, g = g + Math.imul(H, Kt) | 0, M = M + Math.imul(H, Q) | 0, u = u + Math.imul(Bt, Ht) | 0, g = g + Math.imul(Bt, tt) | 0, g = g + Math.imul(L, Ht) | 0, M = M + Math.imul(L, tt) | 0, u = u + Math.imul(I, Zt) | 0, g = g + Math.imul(I, et) | 0, g = g + Math.imul(C, Zt) | 0, M = M + Math.imul(C, et) | 0, u = u + Math.imul(R, Wt) | 0, g = g + Math.imul(R, rt) | 0, g = g + Math.imul(P, Wt) | 0, M = M + Math.imul(P, rt) | 0;
      var ne = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, u = Math.imul($t, Ot), g = Math.imul($t, G), g = g + Math.imul(V, Ot) | 0, M = Math.imul(V, G), u = u + Math.imul(Rt, Ut) | 0, g = g + Math.imul(Rt, X) | 0, g = g + Math.imul(K, Ut) | 0, M = M + Math.imul(K, X) | 0, u = u + Math.imul(qt, zt) | 0, g = g + Math.imul(qt, j) | 0, g = g + Math.imul(W, zt) | 0, M = M + Math.imul(W, j) | 0, u = u + Math.imul(Dt, Kt) | 0, g = g + Math.imul(Dt, Q) | 0, g = g + Math.imul(Z, Kt) | 0, M = M + Math.imul(Z, Q) | 0, u = u + Math.imul(Ct, Ht) | 0, g = g + Math.imul(Ct, tt) | 0, g = g + Math.imul(H, Ht) | 0, M = M + Math.imul(H, tt) | 0, u = u + Math.imul(Bt, Zt) | 0, g = g + Math.imul(Bt, et) | 0, g = g + Math.imul(L, Zt) | 0, M = M + Math.imul(L, et) | 0, u = u + Math.imul(I, Wt) | 0, g = g + Math.imul(I, rt) | 0, g = g + Math.imul(C, Wt) | 0, M = M + Math.imul(C, rt) | 0, u = u + Math.imul(R, Vt) | 0, g = g + Math.imul(R, it) | 0, g = g + Math.imul(P, Vt) | 0, M = M + Math.imul(P, it) | 0;
      var fe = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, u = Math.imul(Ft, Ot), g = Math.imul(Ft, G), g = g + Math.imul(Y, Ot) | 0, M = Math.imul(Y, G), u = u + Math.imul($t, Ut) | 0, g = g + Math.imul($t, X) | 0, g = g + Math.imul(V, Ut) | 0, M = M + Math.imul(V, X) | 0, u = u + Math.imul(Rt, zt) | 0, g = g + Math.imul(Rt, j) | 0, g = g + Math.imul(K, zt) | 0, M = M + Math.imul(K, j) | 0, u = u + Math.imul(qt, Kt) | 0, g = g + Math.imul(qt, Q) | 0, g = g + Math.imul(W, Kt) | 0, M = M + Math.imul(W, Q) | 0, u = u + Math.imul(Dt, Ht) | 0, g = g + Math.imul(Dt, tt) | 0, g = g + Math.imul(Z, Ht) | 0, M = M + Math.imul(Z, tt) | 0, u = u + Math.imul(Ct, Zt) | 0, g = g + Math.imul(Ct, et) | 0, g = g + Math.imul(H, Zt) | 0, M = M + Math.imul(H, et) | 0, u = u + Math.imul(Bt, Wt) | 0, g = g + Math.imul(Bt, rt) | 0, g = g + Math.imul(L, Wt) | 0, M = M + Math.imul(L, rt) | 0, u = u + Math.imul(I, Vt) | 0, g = g + Math.imul(I, it) | 0, g = g + Math.imul(C, Vt) | 0, M = M + Math.imul(C, it) | 0, u = u + Math.imul(R, Yt) | 0, g = g + Math.imul(R, nt) | 0, g = g + Math.imul(P, Yt) | 0, M = M + Math.imul(P, nt) | 0;
      var ae = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, u = Math.imul(Lt, Ot), g = Math.imul(Lt, G), g = g + Math.imul(J, Ot) | 0, M = Math.imul(J, G), u = u + Math.imul(Ft, Ut) | 0, g = g + Math.imul(Ft, X) | 0, g = g + Math.imul(Y, Ut) | 0, M = M + Math.imul(Y, X) | 0, u = u + Math.imul($t, zt) | 0, g = g + Math.imul($t, j) | 0, g = g + Math.imul(V, zt) | 0, M = M + Math.imul(V, j) | 0, u = u + Math.imul(Rt, Kt) | 0, g = g + Math.imul(Rt, Q) | 0, g = g + Math.imul(K, Kt) | 0, M = M + Math.imul(K, Q) | 0, u = u + Math.imul(qt, Ht) | 0, g = g + Math.imul(qt, tt) | 0, g = g + Math.imul(W, Ht) | 0, M = M + Math.imul(W, tt) | 0, u = u + Math.imul(Dt, Zt) | 0, g = g + Math.imul(Dt, et) | 0, g = g + Math.imul(Z, Zt) | 0, M = M + Math.imul(Z, et) | 0, u = u + Math.imul(Ct, Wt) | 0, g = g + Math.imul(Ct, rt) | 0, g = g + Math.imul(H, Wt) | 0, M = M + Math.imul(H, rt) | 0, u = u + Math.imul(Bt, Vt) | 0, g = g + Math.imul(Bt, it) | 0, g = g + Math.imul(L, Vt) | 0, M = M + Math.imul(L, it) | 0, u = u + Math.imul(I, Yt) | 0, g = g + Math.imul(I, nt) | 0, g = g + Math.imul(C, Yt) | 0, M = M + Math.imul(C, nt) | 0, u = u + Math.imul(R, It) | 0, g = g + Math.imul(R, Tt) | 0, g = g + Math.imul(P, It) | 0, M = M + Math.imul(P, Tt) | 0;
      var he = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, u = Math.imul(Lt, Ut), g = Math.imul(Lt, X), g = g + Math.imul(J, Ut) | 0, M = Math.imul(J, X), u = u + Math.imul(Ft, zt) | 0, g = g + Math.imul(Ft, j) | 0, g = g + Math.imul(Y, zt) | 0, M = M + Math.imul(Y, j) | 0, u = u + Math.imul($t, Kt) | 0, g = g + Math.imul($t, Q) | 0, g = g + Math.imul(V, Kt) | 0, M = M + Math.imul(V, Q) | 0, u = u + Math.imul(Rt, Ht) | 0, g = g + Math.imul(Rt, tt) | 0, g = g + Math.imul(K, Ht) | 0, M = M + Math.imul(K, tt) | 0, u = u + Math.imul(qt, Zt) | 0, g = g + Math.imul(qt, et) | 0, g = g + Math.imul(W, Zt) | 0, M = M + Math.imul(W, et) | 0, u = u + Math.imul(Dt, Wt) | 0, g = g + Math.imul(Dt, rt) | 0, g = g + Math.imul(Z, Wt) | 0, M = M + Math.imul(Z, rt) | 0, u = u + Math.imul(Ct, Vt) | 0, g = g + Math.imul(Ct, it) | 0, g = g + Math.imul(H, Vt) | 0, M = M + Math.imul(H, it) | 0, u = u + Math.imul(Bt, Yt) | 0, g = g + Math.imul(Bt, nt) | 0, g = g + Math.imul(L, Yt) | 0, M = M + Math.imul(L, nt) | 0, u = u + Math.imul(I, It) | 0, g = g + Math.imul(I, Tt) | 0, g = g + Math.imul(C, It) | 0, M = M + Math.imul(C, Tt) | 0;
      var se = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, u = Math.imul(Lt, zt), g = Math.imul(Lt, j), g = g + Math.imul(J, zt) | 0, M = Math.imul(J, j), u = u + Math.imul(Ft, Kt) | 0, g = g + Math.imul(Ft, Q) | 0, g = g + Math.imul(Y, Kt) | 0, M = M + Math.imul(Y, Q) | 0, u = u + Math.imul($t, Ht) | 0, g = g + Math.imul($t, tt) | 0, g = g + Math.imul(V, Ht) | 0, M = M + Math.imul(V, tt) | 0, u = u + Math.imul(Rt, Zt) | 0, g = g + Math.imul(Rt, et) | 0, g = g + Math.imul(K, Zt) | 0, M = M + Math.imul(K, et) | 0, u = u + Math.imul(qt, Wt) | 0, g = g + Math.imul(qt, rt) | 0, g = g + Math.imul(W, Wt) | 0, M = M + Math.imul(W, rt) | 0, u = u + Math.imul(Dt, Vt) | 0, g = g + Math.imul(Dt, it) | 0, g = g + Math.imul(Z, Vt) | 0, M = M + Math.imul(Z, it) | 0, u = u + Math.imul(Ct, Yt) | 0, g = g + Math.imul(Ct, nt) | 0, g = g + Math.imul(H, Yt) | 0, M = M + Math.imul(H, nt) | 0, u = u + Math.imul(Bt, It) | 0, g = g + Math.imul(Bt, Tt) | 0, g = g + Math.imul(L, It) | 0, M = M + Math.imul(L, Tt) | 0;
      var oe = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, u = Math.imul(Lt, Kt), g = Math.imul(Lt, Q), g = g + Math.imul(J, Kt) | 0, M = Math.imul(J, Q), u = u + Math.imul(Ft, Ht) | 0, g = g + Math.imul(Ft, tt) | 0, g = g + Math.imul(Y, Ht) | 0, M = M + Math.imul(Y, tt) | 0, u = u + Math.imul($t, Zt) | 0, g = g + Math.imul($t, et) | 0, g = g + Math.imul(V, Zt) | 0, M = M + Math.imul(V, et) | 0, u = u + Math.imul(Rt, Wt) | 0, g = g + Math.imul(Rt, rt) | 0, g = g + Math.imul(K, Wt) | 0, M = M + Math.imul(K, rt) | 0, u = u + Math.imul(qt, Vt) | 0, g = g + Math.imul(qt, it) | 0, g = g + Math.imul(W, Vt) | 0, M = M + Math.imul(W, it) | 0, u = u + Math.imul(Dt, Yt) | 0, g = g + Math.imul(Dt, nt) | 0, g = g + Math.imul(Z, Yt) | 0, M = M + Math.imul(Z, nt) | 0, u = u + Math.imul(Ct, It) | 0, g = g + Math.imul(Ct, Tt) | 0, g = g + Math.imul(H, It) | 0, M = M + Math.imul(H, Tt) | 0;
      var ue = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, u = Math.imul(Lt, Ht), g = Math.imul(Lt, tt), g = g + Math.imul(J, Ht) | 0, M = Math.imul(J, tt), u = u + Math.imul(Ft, Zt) | 0, g = g + Math.imul(Ft, et) | 0, g = g + Math.imul(Y, Zt) | 0, M = M + Math.imul(Y, et) | 0, u = u + Math.imul($t, Wt) | 0, g = g + Math.imul($t, rt) | 0, g = g + Math.imul(V, Wt) | 0, M = M + Math.imul(V, rt) | 0, u = u + Math.imul(Rt, Vt) | 0, g = g + Math.imul(Rt, it) | 0, g = g + Math.imul(K, Vt) | 0, M = M + Math.imul(K, it) | 0, u = u + Math.imul(qt, Yt) | 0, g = g + Math.imul(qt, nt) | 0, g = g + Math.imul(W, Yt) | 0, M = M + Math.imul(W, nt) | 0, u = u + Math.imul(Dt, It) | 0, g = g + Math.imul(Dt, Tt) | 0, g = g + Math.imul(Z, It) | 0, M = M + Math.imul(Z, Tt) | 0;
      var le = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, u = Math.imul(Lt, Zt), g = Math.imul(Lt, et), g = g + Math.imul(J, Zt) | 0, M = Math.imul(J, et), u = u + Math.imul(Ft, Wt) | 0, g = g + Math.imul(Ft, rt) | 0, g = g + Math.imul(Y, Wt) | 0, M = M + Math.imul(Y, rt) | 0, u = u + Math.imul($t, Vt) | 0, g = g + Math.imul($t, it) | 0, g = g + Math.imul(V, Vt) | 0, M = M + Math.imul(V, it) | 0, u = u + Math.imul(Rt, Yt) | 0, g = g + Math.imul(Rt, nt) | 0, g = g + Math.imul(K, Yt) | 0, M = M + Math.imul(K, nt) | 0, u = u + Math.imul(qt, It) | 0, g = g + Math.imul(qt, Tt) | 0, g = g + Math.imul(W, It) | 0, M = M + Math.imul(W, Tt) | 0;
      var de = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, u = Math.imul(Lt, Wt), g = Math.imul(Lt, rt), g = g + Math.imul(J, Wt) | 0, M = Math.imul(J, rt), u = u + Math.imul(Ft, Vt) | 0, g = g + Math.imul(Ft, it) | 0, g = g + Math.imul(Y, Vt) | 0, M = M + Math.imul(Y, it) | 0, u = u + Math.imul($t, Yt) | 0, g = g + Math.imul($t, nt) | 0, g = g + Math.imul(V, Yt) | 0, M = M + Math.imul(V, nt) | 0, u = u + Math.imul(Rt, It) | 0, g = g + Math.imul(Rt, Tt) | 0, g = g + Math.imul(K, It) | 0, M = M + Math.imul(K, Tt) | 0;
      var ce = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, u = Math.imul(Lt, Vt), g = Math.imul(Lt, it), g = g + Math.imul(J, Vt) | 0, M = Math.imul(J, it), u = u + Math.imul(Ft, Yt) | 0, g = g + Math.imul(Ft, nt) | 0, g = g + Math.imul(Y, Yt) | 0, M = M + Math.imul(Y, nt) | 0, u = u + Math.imul($t, It) | 0, g = g + Math.imul($t, Tt) | 0, g = g + Math.imul(V, It) | 0, M = M + Math.imul(V, Tt) | 0;
      var ve = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, u = Math.imul(Lt, Yt), g = Math.imul(Lt, nt), g = g + Math.imul(J, Yt) | 0, M = Math.imul(J, nt), u = u + Math.imul(Ft, It) | 0, g = g + Math.imul(Ft, Tt) | 0, g = g + Math.imul(Y, It) | 0, M = M + Math.imul(Y, Tt) | 0;
      var tf = (e + u | 0) + ((g & 8191) << 13) | 0;
      e = (M + (g >>> 13) | 0) + (tf >>> 26) | 0, tf &= 67108863, u = Math.imul(Lt, It), g = Math.imul(Lt, Tt), g = g + Math.imul(J, It) | 0, M = Math.imul(J, Tt);
      var ef = (e + u | 0) + ((g & 8191) << 13) | 0;
      return e = (M + (g >>> 13) | 0) + (ef >>> 26) | 0, ef &= 67108863, s[0] = jt, s[1] = Qt, s[2] = te, s[3] = ee, s[4] = re, s[5] = ie, s[6] = ne, s[7] = fe, s[8] = ae, s[9] = he, s[10] = se, s[11] = oe, s[12] = ue, s[13] = le, s[14] = de, s[15] = ce, s[16] = ve, s[17] = tf, s[18] = ef, e !== 0 && (s[19] = e, d.length++), d;
    };
    Math.imul || (q = N);
    function ft(r, i, a) {
      a.negative = i.negative ^ r.negative, a.length = r.length + i.length;
      for (var d = 0, c = 0, v = 0; v < a.length - 1; v++) {
        var s = c;
        c = 0;
        for (var e = d & 67108863, u = Math.min(v, i.length - 1), g = Math.max(0, v - r.length + 1); g <= u; g++) {
          var M = v - g, k = r.words[M] | 0, R = i.words[g] | 0, P = k * R, E = P & 67108863;
          s = s + (P / 67108864 | 0) | 0, E = E + e | 0, e = E & 67108863, s = s + (E >>> 26) | 0, c += s >>> 26, s &= 67108863;
        }
        a.words[v] = e, d = s, s = c;
      }
      return d !== 0 ? a.words[v] = d : a.length--, a._strip();
    }
    function F(r, i, a) {
      return ft(r, i, a);
    }
    f.prototype.mulTo = function(i, a) {
      var d, c = this.length + i.length;
      return this.length === 10 && i.length === 10 ? d = q(this, i, a) : c < 63 ? d = N(this, i, a) : c < 1024 ? d = ft(this, i, a) : d = F(this, i, a), d;
    }, f.prototype.mul = function(i) {
      var a = new f(null);
      return a.words = new Array(this.length + i.length), this.mulTo(i, a);
    }, f.prototype.mulf = function(i) {
      var a = new f(null);
      return a.words = new Array(this.length + i.length), F(this, i, a);
    }, f.prototype.imul = function(i) {
      return this.clone().mulTo(i, this);
    }, f.prototype.imuln = function(i) {
      var a = i < 0;
      a && (i = -i), o(typeof i == "number"), o(i < 67108864);
      for (var d = 0, c = 0; c < this.length; c++) {
        var v = (this.words[c] | 0) * i, s = (v & 67108863) + (d & 67108863);
        d >>= 26, d += v / 67108864 | 0, d += s >>> 26, this.words[c] = s & 67108863;
      }
      return d !== 0 && (this.words[c] = d, this.length++), this.length = i === 0 ? 1 : this.length, a ? this.ineg() : this;
    }, f.prototype.muln = function(i) {
      return this.clone().imuln(i);
    }, f.prototype.sqr = function() {
      return this.mul(this);
    }, f.prototype.isqr = function() {
      return this.imul(this.clone());
    }, f.prototype.pow = function(i) {
      var a = O(i);
      if (a.length === 0)
        return new f(1);
      for (var d = this, c = 0; c < a.length && a[c] === 0; c++, d = d.sqr())
        ;
      if (++c < a.length)
        for (var v = d.sqr(); c < a.length; c++, v = v.sqr())
          a[c] !== 0 && (d = d.mul(v));
      return d;
    }, f.prototype.iushln = function(i) {
      o(typeof i == "number" && i >= 0);
      var a = i % 26, d = (i - a) / 26, c = 67108863 >>> 26 - a << 26 - a, v;
      if (a !== 0) {
        var s = 0;
        for (v = 0; v < this.length; v++) {
          var e = this.words[v] & c, u = (this.words[v] | 0) - e << a;
          this.words[v] = u | s, s = e >>> 26 - a;
        }
        s && (this.words[v] = s, this.length++);
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
      return o(this.negative === 0), this.iushln(i);
    }, f.prototype.iushrn = function(i, a, d) {
      o(typeof i == "number" && i >= 0);
      var c;
      a ? c = (a - a % 26) / 26 : c = 0;
      var v = i % 26, s = Math.min((i - v) / 26, this.length), e = 67108863 ^ 67108863 >>> v << v, u = d;
      if (c -= s, c = Math.max(0, c), u) {
        for (var g = 0; g < s; g++)
          u.words[g] = this.words[g];
        u.length = s;
      }
      if (s !== 0)
        if (this.length > s)
          for (this.length -= s, g = 0; g < this.length; g++)
            this.words[g] = this.words[g + s];
        else
          this.words[0] = 0, this.length = 1;
      var M = 0;
      for (g = this.length - 1; g >= 0 && (M !== 0 || g >= c); g--) {
        var k = this.words[g] | 0;
        this.words[g] = M << 26 - v | k >>> v, M = k & e;
      }
      return u && M !== 0 && (u.words[u.length++] = M), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
    }, f.prototype.ishrn = function(i, a, d) {
      return o(this.negative === 0), this.iushrn(i, a, d);
    }, f.prototype.shln = function(i) {
      return this.clone().ishln(i);
    }, f.prototype.ushln = function(i) {
      return this.clone().iushln(i);
    }, f.prototype.shrn = function(i) {
      return this.clone().ishrn(i);
    }, f.prototype.ushrn = function(i) {
      return this.clone().iushrn(i);
    }, f.prototype.testn = function(i) {
      o(typeof i == "number" && i >= 0);
      var a = i % 26, d = (i - a) / 26, c = 1 << a;
      if (this.length <= d)
        return !1;
      var v = this.words[d];
      return !!(v & c);
    }, f.prototype.imaskn = function(i) {
      o(typeof i == "number" && i >= 0);
      var a = i % 26, d = (i - a) / 26;
      if (o(this.negative === 0, "imaskn works only with positive numbers"), this.length <= d)
        return this;
      if (a !== 0 && d++, this.length = Math.min(d, this.length), a !== 0) {
        var c = 67108863 ^ 67108863 >>> a << a;
        this.words[this.length - 1] &= c;
      }
      return this._strip();
    }, f.prototype.maskn = function(i) {
      return this.clone().imaskn(i);
    }, f.prototype.iaddn = function(i) {
      return o(typeof i == "number"), o(i < 67108864), i < 0 ? this.isubn(-i) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= i ? (this.words[0] = i - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(i), this.negative = 1, this) : this._iaddn(i);
    }, f.prototype._iaddn = function(i) {
      this.words[0] += i;
      for (var a = 0; a < this.length && this.words[a] >= 67108864; a++)
        this.words[a] -= 67108864, a === this.length - 1 ? this.words[a + 1] = 1 : this.words[a + 1]++;
      return this.length = Math.max(this.length, a + 1), this;
    }, f.prototype.isubn = function(i) {
      if (o(typeof i == "number"), o(i < 67108864), i < 0)
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
      var s, e = 0;
      for (v = 0; v < i.length; v++) {
        s = (this.words[v + d] | 0) + e;
        var u = (i.words[v] | 0) * a;
        s -= u & 67108863, e = (s >> 26) - (u / 67108864 | 0), this.words[v + d] = s & 67108863;
      }
      for (; v < this.length - d; v++)
        s = (this.words[v + d] | 0) + e, e = s >> 26, this.words[v + d] = s & 67108863;
      if (e === 0)
        return this._strip();
      for (o(e === -1), e = 0, v = 0; v < this.length; v++)
        s = -(this.words[v] | 0) + e, e = s >> 26, this.words[v] = s & 67108863;
      return this.negative = 1, this._strip();
    }, f.prototype._wordDiv = function(i, a) {
      var d = this.length - i.length, c = this.clone(), v = i, s = v.words[v.length - 1] | 0, e = this._countBits(s);
      d = 26 - e, d !== 0 && (v = v.ushln(d), c.iushln(d), s = v.words[v.length - 1] | 0);
      var u = c.length - v.length, g;
      if (a !== "mod") {
        g = new f(null), g.length = u + 1, g.words = new Array(g.length);
        for (var M = 0; M < g.length; M++)
          g.words[M] = 0;
      }
      var k = c.clone()._ishlnsubmul(v, 1, u);
      k.negative === 0 && (c = k, g && (g.words[u] = 1));
      for (var R = u - 1; R >= 0; R--) {
        var P = (c.words[v.length + R] | 0) * 67108864 + (c.words[v.length + R - 1] | 0);
        for (P = Math.min(P / s | 0, 67108863), c._ishlnsubmul(v, P, R); c.negative !== 0; )
          P--, c.negative = 0, c._ishlnsubmul(v, 1, R), c.isZero() || (c.negative ^= 1);
        g && (g.words[R] = P);
      }
      return g && g._strip(), c._strip(), a !== "div" && d !== 0 && c.iushrn(d), {
        div: g || null,
        mod: c
      };
    }, f.prototype.divmod = function(i, a, d) {
      if (o(!i.isZero()), this.isZero())
        return {
          div: new f(0),
          mod: new f(0)
        };
      var c, v, s;
      return this.negative !== 0 && i.negative === 0 ? (s = this.neg().divmod(i, a), a !== "mod" && (c = s.div.neg()), a !== "div" && (v = s.mod.neg(), d && v.negative !== 0 && v.iadd(i)), {
        div: c,
        mod: v
      }) : this.negative === 0 && i.negative !== 0 ? (s = this.divmod(i.neg(), a), a !== "mod" && (c = s.div.neg()), {
        div: c,
        mod: s.mod
      }) : this.negative & i.negative ? (s = this.neg().divmod(i.neg(), a), a !== "div" && (v = s.mod.neg(), d && v.negative !== 0 && v.isub(i)), {
        div: s.div,
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
      var d = a.div.negative !== 0 ? a.mod.isub(i) : a.mod, c = i.ushrn(1), v = i.andln(1), s = d.cmp(c);
      return s < 0 || v === 1 && s === 0 ? a.div : a.div.negative !== 0 ? a.div.isubn(1) : a.div.iaddn(1);
    }, f.prototype.modrn = function(i) {
      var a = i < 0;
      a && (i = -i), o(i <= 67108863);
      for (var d = (1 << 26) % i, c = 0, v = this.length - 1; v >= 0; v--)
        c = (d * c + (this.words[v] | 0)) % i;
      return a ? -c : c;
    }, f.prototype.modn = function(i) {
      return this.modrn(i);
    }, f.prototype.idivn = function(i) {
      var a = i < 0;
      a && (i = -i), o(i <= 67108863);
      for (var d = 0, c = this.length - 1; c >= 0; c--) {
        var v = (this.words[c] | 0) + d * 67108864;
        this.words[c] = v / i | 0, d = v % i;
      }
      return this._strip(), a ? this.ineg() : this;
    }, f.prototype.divn = function(i) {
      return this.clone().idivn(i);
    }, f.prototype.egcd = function(i) {
      o(i.negative === 0), o(!i.isZero());
      var a = this, d = i.clone();
      a.negative !== 0 ? a = a.umod(i) : a = a.clone();
      for (var c = new f(1), v = new f(0), s = new f(0), e = new f(1), u = 0; a.isEven() && d.isEven(); )
        a.iushrn(1), d.iushrn(1), ++u;
      for (var g = d.clone(), M = a.clone(); !a.isZero(); ) {
        for (var k = 0, R = 1; !(a.words[0] & R) && k < 26; ++k, R <<= 1)
          ;
        if (k > 0)
          for (a.iushrn(k); k-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(g), v.isub(M)), c.iushrn(1), v.iushrn(1);
        for (var P = 0, E = 1; !(d.words[0] & E) && P < 26; ++P, E <<= 1)
          ;
        if (P > 0)
          for (d.iushrn(P); P-- > 0; )
            (s.isOdd() || e.isOdd()) && (s.iadd(g), e.isub(M)), s.iushrn(1), e.iushrn(1);
        a.cmp(d) >= 0 ? (a.isub(d), c.isub(s), v.isub(e)) : (d.isub(a), s.isub(c), e.isub(v));
      }
      return {
        a: s,
        b: e,
        gcd: d.iushln(u)
      };
    }, f.prototype._invmp = function(i) {
      o(i.negative === 0), o(!i.isZero());
      var a = this, d = i.clone();
      a.negative !== 0 ? a = a.umod(i) : a = a.clone();
      for (var c = new f(1), v = new f(0), s = d.clone(); a.cmpn(1) > 0 && d.cmpn(1) > 0; ) {
        for (var e = 0, u = 1; !(a.words[0] & u) && e < 26; ++e, u <<= 1)
          ;
        if (e > 0)
          for (a.iushrn(e); e-- > 0; )
            c.isOdd() && c.iadd(s), c.iushrn(1);
        for (var g = 0, M = 1; !(d.words[0] & M) && g < 26; ++g, M <<= 1)
          ;
        if (g > 0)
          for (d.iushrn(g); g-- > 0; )
            v.isOdd() && v.iadd(s), v.iushrn(1);
        a.cmp(d) >= 0 ? (a.isub(d), c.isub(v)) : (d.isub(a), v.isub(c));
      }
      var k;
      return a.cmpn(1) === 0 ? k = c : k = v, k.cmpn(0) < 0 && k.iadd(i), k;
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
          var s = a;
          a = d, d = s;
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
      o(typeof i == "number");
      var a = i % 26, d = (i - a) / 26, c = 1 << a;
      if (this.length <= d)
        return this._expand(d + 1), this.words[d] |= c, this;
      for (var v = c, s = d; v !== 0 && s < this.length; s++) {
        var e = this.words[s] | 0;
        e += v, v = e >>> 26, e &= 67108863, this.words[s] = e;
      }
      return v !== 0 && (this.words[s] = v, this.length++), this;
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
        a && (i = -i), o(i <= 67108863, "Number is too big");
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
      return o(!this.red, "Already a number in reduction context"), o(this.negative === 0, "red works only with positives"), i.convertTo(this)._forceRed(i);
    }, f.prototype.fromRed = function() {
      return o(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(i) {
      return this.red = i, this;
    }, f.prototype.forceRed = function(i) {
      return o(!this.red, "Already a number in reduction context"), this._forceRed(i);
    }, f.prototype.redAdd = function(i) {
      return o(this.red, "redAdd works only with red numbers"), this.red.add(this, i);
    }, f.prototype.redIAdd = function(i) {
      return o(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, i);
    }, f.prototype.redSub = function(i) {
      return o(this.red, "redSub works only with red numbers"), this.red.sub(this, i);
    }, f.prototype.redISub = function(i) {
      return o(this.red, "redISub works only with red numbers"), this.red.isub(this, i);
    }, f.prototype.redShl = function(i) {
      return o(this.red, "redShl works only with red numbers"), this.red.shl(this, i);
    }, f.prototype.redMul = function(i) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, i), this.red.mul(this, i);
    }, f.prototype.redIMul = function(i) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, i), this.red.imul(this, i);
    }, f.prototype.redSqr = function() {
      return o(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return o(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return o(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return o(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return o(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(i) {
      return o(this.red && !i.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, i);
    };
    var _t = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function St(r, i) {
      this.name = r, this.p = new f(i, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    St.prototype._tmp = function() {
      var i = new f(null);
      return i.words = new Array(Math.ceil(this.n / 13)), i;
    }, St.prototype.ireduce = function(i) {
      var a = i, d;
      do
        this.split(a, this.tmp), a = this.imulK(a), a = a.iadd(this.tmp), d = a.bitLength();
      while (d > this.n);
      var c = d < this.n ? -1 : a.ucmp(this.p);
      return c === 0 ? (a.words[0] = 0, a.length = 1) : c > 0 ? a.isub(this.p) : a.strip !== void 0 ? a.strip() : a._strip(), a;
    }, St.prototype.split = function(i, a) {
      i.iushrn(this.n, 0, a);
    }, St.prototype.imulK = function(i) {
      return i.imul(this.k);
    };
    function kt() {
      St.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(kt, St), kt.prototype.split = function(i, a) {
      for (var d = 4194303, c = Math.min(i.length, 9), v = 0; v < c; v++)
        a.words[v] = i.words[v];
      if (a.length = c, i.length <= 9) {
        i.words[0] = 0, i.length = 1;
        return;
      }
      var s = i.words[9];
      for (a.words[a.length++] = s & d, v = 10; v < i.length; v++) {
        var e = i.words[v] | 0;
        i.words[v - 10] = (e & d) << 4 | s >>> 22, s = e;
      }
      s >>>= 22, i.words[v - 10] = s, s === 0 && i.length > 10 ? i.length -= 10 : i.length -= 9;
    }, kt.prototype.imulK = function(i) {
      i.words[i.length] = 0, i.words[i.length + 1] = 0, i.length += 2;
      for (var a = 0, d = 0; d < i.length; d++) {
        var c = i.words[d] | 0;
        a += c * 977, i.words[d] = a & 67108863, a = c * 64 + (a / 67108864 | 0);
      }
      return i.words[i.length - 1] === 0 && (i.length--, i.words[i.length - 1] === 0 && i.length--), i;
    };
    function At() {
      St.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(At, St);
    function U() {
      St.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(U, St);
    function Et() {
      St.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(Et, St), Et.prototype.imulK = function(i) {
      for (var a = 0, d = 0; d < i.length; d++) {
        var c = (i.words[d] | 0) * 19 + a, v = c & 67108863;
        c >>>= 26, i.words[d] = v, a = c;
      }
      return a !== 0 && (i.words[i.length++] = a), i;
    }, f._prime = function(i) {
      if (_t[i])
        return _t[i];
      var a;
      if (i === "k256")
        a = new kt();
      else if (i === "p224")
        a = new At();
      else if (i === "p192")
        a = new U();
      else if (i === "p25519")
        a = new Et();
      else
        throw new Error("Unknown prime " + i);
      return _t[i] = a, a;
    };
    function p(r) {
      if (typeof r == "string") {
        var i = f._prime(r);
        this.m = i.p, this.prime = i;
      } else
        o(r.gtn(1), "modulus must be greater than 1"), this.m = r, this.prime = null;
    }
    p.prototype._verify1 = function(i) {
      o(i.negative === 0, "red works only with positives"), o(i.red, "red works only with red numbers");
    }, p.prototype._verify2 = function(i, a) {
      o((i.negative | a.negative) === 0, "red works only with positives"), o(
        i.red && i.red === a.red,
        "red works only with red numbers"
      );
    }, p.prototype.imod = function(i) {
      return this.prime ? this.prime.ireduce(i)._forceRed(this) : (y(i, i.umod(this.m)._forceRed(this)), i);
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
      if (o(a % 2 === 1), a === 3) {
        var d = this.m.add(new f(1)).iushrn(2);
        return this.pow(i, d);
      }
      for (var c = this.m.subn(1), v = 0; !c.isZero() && c.andln(1) === 0; )
        v++, c.iushrn(1);
      o(!c.isZero());
      var s = new f(1).toRed(this), e = s.redNeg(), u = this.m.subn(1).iushrn(1), g = this.m.bitLength();
      for (g = new f(2 * g * g).toRed(this); this.pow(g, u).cmp(e) !== 0; )
        g.redIAdd(e);
      for (var M = this.pow(g, c), k = this.pow(i, c.addn(1).iushrn(1)), R = this.pow(i, c), P = v; R.cmp(s) !== 0; ) {
        for (var E = R, I = 0; E.cmp(s) !== 0; I++)
          E = E.redSqr();
        o(I < P);
        var C = this.pow(M, new f(1).iushln(P - I - 1));
        k = k.redMul(C), M = C.redSqr(), R = R.redMul(M), P = I;
      }
      return k;
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
      var s = c[0], e = 0, u = 0, g = a.bitLength() % 26;
      for (g === 0 && (g = 26), v = a.length - 1; v >= 0; v--) {
        for (var M = a.words[v], k = g - 1; k >= 0; k--) {
          var R = M >> k & 1;
          if (s !== c[0] && (s = this.sqr(s)), R === 0 && e === 0) {
            u = 0;
            continue;
          }
          e <<= 1, e |= R, u++, !(u !== d && (v !== 0 || k !== 0)) && (s = this.mul(s, c[e]), u = 0, e = 0);
        }
        g = 26;
      }
      return s;
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
      var d = i.imul(a), c = d.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), v = d.isub(c).iushrn(this.shift), s = v;
      return v.cmp(this.m) >= 0 ? s = v.isub(this.m) : v.cmpn(0) < 0 && (s = v.iadd(this.m)), s._forceRed(this);
    }, t.prototype.mul = function(i, a) {
      if (i.isZero() || a.isZero())
        return new f(0)._forceRed(this);
      var d = i.mul(a), c = d.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), v = d.isub(c).iushrn(this.shift), s = v;
      return v.cmp(this.m) >= 0 ? s = v.isub(this.m) : v.cmpn(0) < 0 && (s = v.iadd(this.m)), s._forceRed(this);
    }, t.prototype.invm = function(i) {
      var a = this.imod(i._invmp(this.m).mul(this.r2));
      return a._forceRed(this);
    };
  })(h, Gt);
})(E0);
var k0 = E0.exports, ri = k0, ev = li, rv = Nt.Buffer;
function Zs(h) {
  var n = h.modulus.byteLength(), l;
  do
    l = new ri(ev(n));
  while (l.cmp(h.modulus) >= 0 || !l.umod(h.prime1) || !l.umod(h.prime2));
  return l;
}
function iv(h) {
  var n = Zs(h), l = n.toRed(ri.mont(h.modulus)).redPow(new ri(h.publicExponent)).fromRed();
  return { blinder: l, unblinder: n.invm(h.modulus) };
}
function Ws(h, n) {
  var l = iv(n), o = n.modulus.byteLength(), m = new ri(h).mul(l.blinder).umod(n.modulus), f = m.toRed(ri.mont(n.prime1)), b = m.toRed(ri.mont(n.prime2)), w = n.coefficient, _ = n.prime1, S = n.prime2, y = f.redPow(n.exponent1).fromRed(), x = b.redPow(n.exponent2).fromRed(), B = y.isub(x).imul(w).umod(_).imul(S);
  return x.iadd(B).imul(l.unblinder).umod(n.modulus).toArrayLike(rv, "be", o);
}
Ws.getr = Zs;
var R0 = Ws, yf = {};
const nv = "elliptic", fv = "6.6.1", av = "EC cryptography", hv = "lib/elliptic.js", sv = [
  "lib"
], ov = {
  lint: "eslint lib test",
  "lint:fix": "npm run lint -- --fix",
  unit: "istanbul test _mocha --reporter=spec test/index.js",
  test: "npm run lint && npm run unit",
  version: "grunt dist && git add dist/"
}, uv = {
  type: "git",
  url: "git@github.com:indutny/elliptic"
}, lv = [
  "EC",
  "Elliptic",
  "curve",
  "Cryptography"
], dv = "Fedor Indutny <fedor@indutny.com>", cv = "MIT", vv = {
  url: "https://github.com/indutny/elliptic/issues"
}, pv = "https://github.com/indutny/elliptic", mv = {
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
}, gv = {
  "bn.js": "^4.11.9",
  brorand: "^1.1.0",
  "hash.js": "^1.0.0",
  "hmac-drbg": "^1.0.1",
  inherits: "^2.0.4",
  "minimalistic-assert": "^1.0.1",
  "minimalistic-crypto-utils": "^1.0.1"
}, bv = {
  name: nv,
  version: fv,
  description: av,
  main: hv,
  files: sv,
  scripts: ov,
  repository: uv,
  keywords: lv,
  author: dv,
  license: cv,
  bugs: vv,
  homepage: pv,
  devDependencies: mv,
  dependencies: gv
};
var Oe = {}, I0 = { exports: {} };
I0.exports;
(function(h) {
  (function(n, l) {
    function o(p, t) {
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
    typeof n == "object" ? n.exports = f : l.BN = f, f.BN = f, f.wordSize = 26;
    var b;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? b = window.Buffer : b = ge.Buffer;
    } catch {
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
      r === "hex" && (r = 16), o(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (o(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (o(typeof t.length == "number"), t.length <= 0)
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
    function w(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function _(p, t, r) {
      var i = w(p, r);
      return r - 1 >= t && (i |= w(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var s = t.length - r;
        for (a = s % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function S(p, t, r, i) {
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
      for (var c = t.length - i, v = c % a, s = Math.min(c, c - v) + i, e = 0, u = i; u < s; u += a)
        e = S(t, u, u + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var g = 1;
        for (e = S(t, u, t.length, r), u = 0; u < v; u++)
          g *= r;
        this.imuln(g), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    var y = [
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
    ], B = [
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
          var v = this.words[c], s = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = y[6 - s.length] + s + i : i = s + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], u = B[t];
        i = "";
        var g = this.clone();
        for (g.negative = 0; !g.isZero(); ) {
          var M = g.modn(u).toString(t);
          g = g.idivn(u), g.isZero() ? i = M + i : i = y[e - M.length] + M + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      o(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && o(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return o(typeof b < "u"), this.toArrayLike(b, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var a = this.byteLength(), d = i || Math.max(1, a);
      o(a <= d, "byte array longer than desired length"), o(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), s, e, u = this.clone();
      if (c) {
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[e] = s;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
          v[e] = 0;
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[d - e - 1] = s;
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
    function A(p) {
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
      return o((this.negative | t.negative) === 0), this.iuor(t);
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
      return o((this.negative | t.negative) === 0), this.iuand(t);
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
      return o((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      o(typeof t == "number" && t >= 0);
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
    function T(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, s = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var u = s >>> 26, g = s & 67108863, M = Math.min(e, t.length - 1), k = Math.max(0, e - p.length + 1); k <= M; k++) {
          var R = e - k | 0;
          a = p.words[R] | 0, d = t.words[k] | 0, c = a * d + g, u += c / 67108864 | 0, g = c & 67108863;
        }
        r.words[e] = g | 0, s = u | 0;
      }
      return s !== 0 ? r.words[e] = s | 0 : r.length--, r.strip();
    }
    var D = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, s, e, u, g = a[0] | 0, M = g & 8191, k = g >>> 13, R = a[1] | 0, P = R & 8191, E = R >>> 13, I = a[2] | 0, C = I & 8191, $ = I >>> 13, Bt = a[3] | 0, L = Bt & 8191, z = Bt >>> 13, Ct = a[4] | 0, H = Ct & 8191, st = Ct >>> 13, Dt = a[5] | 0, Z = Dt & 8191, ot = Dt >>> 13, qt = a[6] | 0, W = qt & 8191, ht = qt >>> 13, Rt = a[7] | 0, K = Rt & 8191, at = Rt >>> 13, $t = a[8] | 0, V = $t & 8191, lt = $t >>> 13, Ft = a[9] | 0, Y = Ft & 8191, dt = Ft >>> 13, Lt = d[0] | 0, J = Lt & 8191, ct = Lt >>> 13, Ot = d[1] | 0, G = Ot & 8191, vt = Ot >>> 13, Ut = d[2] | 0, X = Ut & 8191, pt = Ut >>> 13, zt = d[3] | 0, j = zt & 8191, mt = zt >>> 13, Kt = d[4] | 0, Q = Kt & 8191, gt = Kt >>> 13, Ht = d[5] | 0, tt = Ht & 8191, bt = Ht >>> 13, Zt = d[6] | 0, et = Zt & 8191, yt = Zt >>> 13, Wt = d[7] | 0, rt = Wt & 8191, wt = Wt >>> 13, Vt = d[8] | 0, it = Vt & 8191, Mt = Vt >>> 13, Yt = d[9] | 0, nt = Yt & 8191, xt = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, s = Math.imul(M, J), e = Math.imul(M, ct), e = e + Math.imul(k, J) | 0, u = Math.imul(k, ct);
      var It = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (It >>> 26) | 0, It &= 67108863, s = Math.imul(P, J), e = Math.imul(P, ct), e = e + Math.imul(E, J) | 0, u = Math.imul(E, ct), s = s + Math.imul(M, G) | 0, e = e + Math.imul(M, vt) | 0, e = e + Math.imul(k, G) | 0, u = u + Math.imul(k, vt) | 0;
      var Tt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Tt >>> 26) | 0, Tt &= 67108863, s = Math.imul(C, J), e = Math.imul(C, ct), e = e + Math.imul($, J) | 0, u = Math.imul($, ct), s = s + Math.imul(P, G) | 0, e = e + Math.imul(P, vt) | 0, e = e + Math.imul(E, G) | 0, u = u + Math.imul(E, vt) | 0, s = s + Math.imul(M, X) | 0, e = e + Math.imul(M, pt) | 0, e = e + Math.imul(k, X) | 0, u = u + Math.imul(k, pt) | 0;
      var jt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, s = Math.imul(L, J), e = Math.imul(L, ct), e = e + Math.imul(z, J) | 0, u = Math.imul(z, ct), s = s + Math.imul(C, G) | 0, e = e + Math.imul(C, vt) | 0, e = e + Math.imul($, G) | 0, u = u + Math.imul($, vt) | 0, s = s + Math.imul(P, X) | 0, e = e + Math.imul(P, pt) | 0, e = e + Math.imul(E, X) | 0, u = u + Math.imul(E, pt) | 0, s = s + Math.imul(M, j) | 0, e = e + Math.imul(M, mt) | 0, e = e + Math.imul(k, j) | 0, u = u + Math.imul(k, mt) | 0;
      var Qt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, s = Math.imul(H, J), e = Math.imul(H, ct), e = e + Math.imul(st, J) | 0, u = Math.imul(st, ct), s = s + Math.imul(L, G) | 0, e = e + Math.imul(L, vt) | 0, e = e + Math.imul(z, G) | 0, u = u + Math.imul(z, vt) | 0, s = s + Math.imul(C, X) | 0, e = e + Math.imul(C, pt) | 0, e = e + Math.imul($, X) | 0, u = u + Math.imul($, pt) | 0, s = s + Math.imul(P, j) | 0, e = e + Math.imul(P, mt) | 0, e = e + Math.imul(E, j) | 0, u = u + Math.imul(E, mt) | 0, s = s + Math.imul(M, Q) | 0, e = e + Math.imul(M, gt) | 0, e = e + Math.imul(k, Q) | 0, u = u + Math.imul(k, gt) | 0;
      var te = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, s = Math.imul(Z, J), e = Math.imul(Z, ct), e = e + Math.imul(ot, J) | 0, u = Math.imul(ot, ct), s = s + Math.imul(H, G) | 0, e = e + Math.imul(H, vt) | 0, e = e + Math.imul(st, G) | 0, u = u + Math.imul(st, vt) | 0, s = s + Math.imul(L, X) | 0, e = e + Math.imul(L, pt) | 0, e = e + Math.imul(z, X) | 0, u = u + Math.imul(z, pt) | 0, s = s + Math.imul(C, j) | 0, e = e + Math.imul(C, mt) | 0, e = e + Math.imul($, j) | 0, u = u + Math.imul($, mt) | 0, s = s + Math.imul(P, Q) | 0, e = e + Math.imul(P, gt) | 0, e = e + Math.imul(E, Q) | 0, u = u + Math.imul(E, gt) | 0, s = s + Math.imul(M, tt) | 0, e = e + Math.imul(M, bt) | 0, e = e + Math.imul(k, tt) | 0, u = u + Math.imul(k, bt) | 0;
      var ee = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, s = Math.imul(W, J), e = Math.imul(W, ct), e = e + Math.imul(ht, J) | 0, u = Math.imul(ht, ct), s = s + Math.imul(Z, G) | 0, e = e + Math.imul(Z, vt) | 0, e = e + Math.imul(ot, G) | 0, u = u + Math.imul(ot, vt) | 0, s = s + Math.imul(H, X) | 0, e = e + Math.imul(H, pt) | 0, e = e + Math.imul(st, X) | 0, u = u + Math.imul(st, pt) | 0, s = s + Math.imul(L, j) | 0, e = e + Math.imul(L, mt) | 0, e = e + Math.imul(z, j) | 0, u = u + Math.imul(z, mt) | 0, s = s + Math.imul(C, Q) | 0, e = e + Math.imul(C, gt) | 0, e = e + Math.imul($, Q) | 0, u = u + Math.imul($, gt) | 0, s = s + Math.imul(P, tt) | 0, e = e + Math.imul(P, bt) | 0, e = e + Math.imul(E, tt) | 0, u = u + Math.imul(E, bt) | 0, s = s + Math.imul(M, et) | 0, e = e + Math.imul(M, yt) | 0, e = e + Math.imul(k, et) | 0, u = u + Math.imul(k, yt) | 0;
      var re = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, s = Math.imul(K, J), e = Math.imul(K, ct), e = e + Math.imul(at, J) | 0, u = Math.imul(at, ct), s = s + Math.imul(W, G) | 0, e = e + Math.imul(W, vt) | 0, e = e + Math.imul(ht, G) | 0, u = u + Math.imul(ht, vt) | 0, s = s + Math.imul(Z, X) | 0, e = e + Math.imul(Z, pt) | 0, e = e + Math.imul(ot, X) | 0, u = u + Math.imul(ot, pt) | 0, s = s + Math.imul(H, j) | 0, e = e + Math.imul(H, mt) | 0, e = e + Math.imul(st, j) | 0, u = u + Math.imul(st, mt) | 0, s = s + Math.imul(L, Q) | 0, e = e + Math.imul(L, gt) | 0, e = e + Math.imul(z, Q) | 0, u = u + Math.imul(z, gt) | 0, s = s + Math.imul(C, tt) | 0, e = e + Math.imul(C, bt) | 0, e = e + Math.imul($, tt) | 0, u = u + Math.imul($, bt) | 0, s = s + Math.imul(P, et) | 0, e = e + Math.imul(P, yt) | 0, e = e + Math.imul(E, et) | 0, u = u + Math.imul(E, yt) | 0, s = s + Math.imul(M, rt) | 0, e = e + Math.imul(M, wt) | 0, e = e + Math.imul(k, rt) | 0, u = u + Math.imul(k, wt) | 0;
      var ie = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, s = Math.imul(V, J), e = Math.imul(V, ct), e = e + Math.imul(lt, J) | 0, u = Math.imul(lt, ct), s = s + Math.imul(K, G) | 0, e = e + Math.imul(K, vt) | 0, e = e + Math.imul(at, G) | 0, u = u + Math.imul(at, vt) | 0, s = s + Math.imul(W, X) | 0, e = e + Math.imul(W, pt) | 0, e = e + Math.imul(ht, X) | 0, u = u + Math.imul(ht, pt) | 0, s = s + Math.imul(Z, j) | 0, e = e + Math.imul(Z, mt) | 0, e = e + Math.imul(ot, j) | 0, u = u + Math.imul(ot, mt) | 0, s = s + Math.imul(H, Q) | 0, e = e + Math.imul(H, gt) | 0, e = e + Math.imul(st, Q) | 0, u = u + Math.imul(st, gt) | 0, s = s + Math.imul(L, tt) | 0, e = e + Math.imul(L, bt) | 0, e = e + Math.imul(z, tt) | 0, u = u + Math.imul(z, bt) | 0, s = s + Math.imul(C, et) | 0, e = e + Math.imul(C, yt) | 0, e = e + Math.imul($, et) | 0, u = u + Math.imul($, yt) | 0, s = s + Math.imul(P, rt) | 0, e = e + Math.imul(P, wt) | 0, e = e + Math.imul(E, rt) | 0, u = u + Math.imul(E, wt) | 0, s = s + Math.imul(M, it) | 0, e = e + Math.imul(M, Mt) | 0, e = e + Math.imul(k, it) | 0, u = u + Math.imul(k, Mt) | 0;
      var ne = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, s = Math.imul(Y, J), e = Math.imul(Y, ct), e = e + Math.imul(dt, J) | 0, u = Math.imul(dt, ct), s = s + Math.imul(V, G) | 0, e = e + Math.imul(V, vt) | 0, e = e + Math.imul(lt, G) | 0, u = u + Math.imul(lt, vt) | 0, s = s + Math.imul(K, X) | 0, e = e + Math.imul(K, pt) | 0, e = e + Math.imul(at, X) | 0, u = u + Math.imul(at, pt) | 0, s = s + Math.imul(W, j) | 0, e = e + Math.imul(W, mt) | 0, e = e + Math.imul(ht, j) | 0, u = u + Math.imul(ht, mt) | 0, s = s + Math.imul(Z, Q) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(ot, Q) | 0, u = u + Math.imul(ot, gt) | 0, s = s + Math.imul(H, tt) | 0, e = e + Math.imul(H, bt) | 0, e = e + Math.imul(st, tt) | 0, u = u + Math.imul(st, bt) | 0, s = s + Math.imul(L, et) | 0, e = e + Math.imul(L, yt) | 0, e = e + Math.imul(z, et) | 0, u = u + Math.imul(z, yt) | 0, s = s + Math.imul(C, rt) | 0, e = e + Math.imul(C, wt) | 0, e = e + Math.imul($, rt) | 0, u = u + Math.imul($, wt) | 0, s = s + Math.imul(P, it) | 0, e = e + Math.imul(P, Mt) | 0, e = e + Math.imul(E, it) | 0, u = u + Math.imul(E, Mt) | 0, s = s + Math.imul(M, nt) | 0, e = e + Math.imul(M, xt) | 0, e = e + Math.imul(k, nt) | 0, u = u + Math.imul(k, xt) | 0;
      var fe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, s = Math.imul(Y, G), e = Math.imul(Y, vt), e = e + Math.imul(dt, G) | 0, u = Math.imul(dt, vt), s = s + Math.imul(V, X) | 0, e = e + Math.imul(V, pt) | 0, e = e + Math.imul(lt, X) | 0, u = u + Math.imul(lt, pt) | 0, s = s + Math.imul(K, j) | 0, e = e + Math.imul(K, mt) | 0, e = e + Math.imul(at, j) | 0, u = u + Math.imul(at, mt) | 0, s = s + Math.imul(W, Q) | 0, e = e + Math.imul(W, gt) | 0, e = e + Math.imul(ht, Q) | 0, u = u + Math.imul(ht, gt) | 0, s = s + Math.imul(Z, tt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(ot, tt) | 0, u = u + Math.imul(ot, bt) | 0, s = s + Math.imul(H, et) | 0, e = e + Math.imul(H, yt) | 0, e = e + Math.imul(st, et) | 0, u = u + Math.imul(st, yt) | 0, s = s + Math.imul(L, rt) | 0, e = e + Math.imul(L, wt) | 0, e = e + Math.imul(z, rt) | 0, u = u + Math.imul(z, wt) | 0, s = s + Math.imul(C, it) | 0, e = e + Math.imul(C, Mt) | 0, e = e + Math.imul($, it) | 0, u = u + Math.imul($, Mt) | 0, s = s + Math.imul(P, nt) | 0, e = e + Math.imul(P, xt) | 0, e = e + Math.imul(E, nt) | 0, u = u + Math.imul(E, xt) | 0;
      var ae = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, s = Math.imul(Y, X), e = Math.imul(Y, pt), e = e + Math.imul(dt, X) | 0, u = Math.imul(dt, pt), s = s + Math.imul(V, j) | 0, e = e + Math.imul(V, mt) | 0, e = e + Math.imul(lt, j) | 0, u = u + Math.imul(lt, mt) | 0, s = s + Math.imul(K, Q) | 0, e = e + Math.imul(K, gt) | 0, e = e + Math.imul(at, Q) | 0, u = u + Math.imul(at, gt) | 0, s = s + Math.imul(W, tt) | 0, e = e + Math.imul(W, bt) | 0, e = e + Math.imul(ht, tt) | 0, u = u + Math.imul(ht, bt) | 0, s = s + Math.imul(Z, et) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(ot, et) | 0, u = u + Math.imul(ot, yt) | 0, s = s + Math.imul(H, rt) | 0, e = e + Math.imul(H, wt) | 0, e = e + Math.imul(st, rt) | 0, u = u + Math.imul(st, wt) | 0, s = s + Math.imul(L, it) | 0, e = e + Math.imul(L, Mt) | 0, e = e + Math.imul(z, it) | 0, u = u + Math.imul(z, Mt) | 0, s = s + Math.imul(C, nt) | 0, e = e + Math.imul(C, xt) | 0, e = e + Math.imul($, nt) | 0, u = u + Math.imul($, xt) | 0;
      var he = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, s = Math.imul(Y, j), e = Math.imul(Y, mt), e = e + Math.imul(dt, j) | 0, u = Math.imul(dt, mt), s = s + Math.imul(V, Q) | 0, e = e + Math.imul(V, gt) | 0, e = e + Math.imul(lt, Q) | 0, u = u + Math.imul(lt, gt) | 0, s = s + Math.imul(K, tt) | 0, e = e + Math.imul(K, bt) | 0, e = e + Math.imul(at, tt) | 0, u = u + Math.imul(at, bt) | 0, s = s + Math.imul(W, et) | 0, e = e + Math.imul(W, yt) | 0, e = e + Math.imul(ht, et) | 0, u = u + Math.imul(ht, yt) | 0, s = s + Math.imul(Z, rt) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(ot, rt) | 0, u = u + Math.imul(ot, wt) | 0, s = s + Math.imul(H, it) | 0, e = e + Math.imul(H, Mt) | 0, e = e + Math.imul(st, it) | 0, u = u + Math.imul(st, Mt) | 0, s = s + Math.imul(L, nt) | 0, e = e + Math.imul(L, xt) | 0, e = e + Math.imul(z, nt) | 0, u = u + Math.imul(z, xt) | 0;
      var se = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, s = Math.imul(Y, Q), e = Math.imul(Y, gt), e = e + Math.imul(dt, Q) | 0, u = Math.imul(dt, gt), s = s + Math.imul(V, tt) | 0, e = e + Math.imul(V, bt) | 0, e = e + Math.imul(lt, tt) | 0, u = u + Math.imul(lt, bt) | 0, s = s + Math.imul(K, et) | 0, e = e + Math.imul(K, yt) | 0, e = e + Math.imul(at, et) | 0, u = u + Math.imul(at, yt) | 0, s = s + Math.imul(W, rt) | 0, e = e + Math.imul(W, wt) | 0, e = e + Math.imul(ht, rt) | 0, u = u + Math.imul(ht, wt) | 0, s = s + Math.imul(Z, it) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(ot, it) | 0, u = u + Math.imul(ot, Mt) | 0, s = s + Math.imul(H, nt) | 0, e = e + Math.imul(H, xt) | 0, e = e + Math.imul(st, nt) | 0, u = u + Math.imul(st, xt) | 0;
      var oe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, s = Math.imul(Y, tt), e = Math.imul(Y, bt), e = e + Math.imul(dt, tt) | 0, u = Math.imul(dt, bt), s = s + Math.imul(V, et) | 0, e = e + Math.imul(V, yt) | 0, e = e + Math.imul(lt, et) | 0, u = u + Math.imul(lt, yt) | 0, s = s + Math.imul(K, rt) | 0, e = e + Math.imul(K, wt) | 0, e = e + Math.imul(at, rt) | 0, u = u + Math.imul(at, wt) | 0, s = s + Math.imul(W, it) | 0, e = e + Math.imul(W, Mt) | 0, e = e + Math.imul(ht, it) | 0, u = u + Math.imul(ht, Mt) | 0, s = s + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(ot, nt) | 0, u = u + Math.imul(ot, xt) | 0;
      var ue = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, s = Math.imul(Y, et), e = Math.imul(Y, yt), e = e + Math.imul(dt, et) | 0, u = Math.imul(dt, yt), s = s + Math.imul(V, rt) | 0, e = e + Math.imul(V, wt) | 0, e = e + Math.imul(lt, rt) | 0, u = u + Math.imul(lt, wt) | 0, s = s + Math.imul(K, it) | 0, e = e + Math.imul(K, Mt) | 0, e = e + Math.imul(at, it) | 0, u = u + Math.imul(at, Mt) | 0, s = s + Math.imul(W, nt) | 0, e = e + Math.imul(W, xt) | 0, e = e + Math.imul(ht, nt) | 0, u = u + Math.imul(ht, xt) | 0;
      var le = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, s = Math.imul(Y, rt), e = Math.imul(Y, wt), e = e + Math.imul(dt, rt) | 0, u = Math.imul(dt, wt), s = s + Math.imul(V, it) | 0, e = e + Math.imul(V, Mt) | 0, e = e + Math.imul(lt, it) | 0, u = u + Math.imul(lt, Mt) | 0, s = s + Math.imul(K, nt) | 0, e = e + Math.imul(K, xt) | 0, e = e + Math.imul(at, nt) | 0, u = u + Math.imul(at, xt) | 0;
      var de = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, s = Math.imul(Y, it), e = Math.imul(Y, Mt), e = e + Math.imul(dt, it) | 0, u = Math.imul(dt, Mt), s = s + Math.imul(V, nt) | 0, e = e + Math.imul(V, xt) | 0, e = e + Math.imul(lt, nt) | 0, u = u + Math.imul(lt, xt) | 0;
      var ce = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, s = Math.imul(Y, nt), e = Math.imul(Y, xt), e = e + Math.imul(dt, nt) | 0, u = Math.imul(dt, xt);
      var ve = (v + s | 0) + ((e & 8191) << 13) | 0;
      return v = (u + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = It, c[1] = Tt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (D = T);
    function O(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, s = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= s; e++) {
          var u = d - e, g = p.words[u] | 0, M = t.words[e] | 0, k = g * M, R = k & 67108863;
          c = c + (k / 67108864 | 0) | 0, R = R + v | 0, v = R & 67108863, c = c + (R >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function N(p, t, r) {
      var i = new q();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = D(this, t, r) : a < 63 ? i = T(this, t, r) : a < 1024 ? i = O(this, t, r) : i = N(this, t, r), i;
    };
    function q(p, t) {
      this.x = p, this.y = t;
    }
    q.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, q.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, q.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, q.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var s = v << 1, e = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), g = 0; g < d; g += s)
          for (var M = e, k = u, R = 0; R < v; R++) {
            var P = i[g + R], E = a[g + R], I = i[g + R + v], C = a[g + R + v], $ = M * I - k * C;
            C = M * C + k * I, I = $, i[g + R] = P + I, a[g + R] = E + C, i[g + R + v] = P - I, a[g + R + v] = E - C, R !== s && ($ = e * M - u * k, k = e * k + u * M, M = $);
          }
    }, q.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, q.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, q.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, q.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      o(d === 0), o((d & -8192) === 0);
    }, q.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, q.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), s = new Array(a), e = new Array(a), u = new Array(a), g = new Array(a), M = new Array(a), k = i.words;
      k.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, u, a), this.transform(v, c, s, e, a, d), this.transform(u, c, g, M, a, d);
      for (var R = 0; R < a; R++) {
        var P = s[R] * g[R] - e[R] * M[R];
        e[R] = s[R] * M[R] + e[R] * g[R], s[R] = P;
      }
      return this.conjugate(s, e, a), this.transform(s, e, k, c, a, d), this.conjugate(k, c, a), this.normalize13b(k, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), N(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      o(typeof t == "number"), o(t < 67108864);
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
      var r = A(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, s = (this.words[d] | 0) - v << r;
          this.words[d] = s | c, c = v >>> 26 - r;
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
      return o(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      o(typeof t == "number" && t >= 0);
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, s = i;
      if (a -= c, a = Math.max(0, a), s) {
        for (var e = 0; e < c; e++)
          s.words[e] = this.words[e];
        s.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var u = 0;
      for (e = this.length - 1; e >= 0 && (u !== 0 || e >= a); e--) {
        var g = this.words[e] | 0;
        this.words[e] = u << 26 - d | g >>> d, u = g & v;
      }
      return s && u !== 0 && (s.words[s.length++] = u), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return o(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (o(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return o(typeof t == "number"), o(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (o(typeof t == "number"), o(t < 67108864), t < 0)
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
        var s = (t.words[d] | 0) * r;
        c -= s & 67108863, v = (c >> 26) - (s / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (o(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var s = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = s + 1, e.words = new Array(e.length);
        for (var u = 0; u < e.length; u++)
          e.words[u] = 0;
      }
      var g = a.clone()._ishlnsubmul(d, 1, s);
      g.negative === 0 && (a = g, e && (e.words[s] = 1));
      for (var M = s - 1; M >= 0; M--) {
        var k = (a.words[d.length + M] | 0) * 67108864 + (a.words[d.length + M - 1] | 0);
        for (k = Math.min(k / c | 0, 67108863), a._ishlnsubmul(d, k, M); a.negative !== 0; )
          k--, a.negative = 0, a._ishlnsubmul(d, 1, M), a.isZero() || (a.negative ^= 1);
        e && (e.words[M] = k);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (o(!t.isZero()), this.isZero())
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
      o(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      o(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), s = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++s;
      for (var e = i.clone(), u = r.clone(); !r.isZero(); ) {
        for (var g = 0, M = 1; !(r.words[0] & M) && g < 26; ++g, M <<= 1)
          ;
        if (g > 0)
          for (r.iushrn(g); g-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(u)), a.iushrn(1), d.iushrn(1);
        for (var k = 0, R = 1; !(i.words[0] & R) && k < 26; ++k, R <<= 1)
          ;
        if (k > 0)
          for (i.iushrn(k); k-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(u)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(s)
      };
    }, f.prototype._invmp = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, s = 1; !(r.words[0] & s) && v < 26; ++v, s <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, u = 1; !(i.words[0] & u) && e < 26; ++e, u <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var g;
      return r.cmpn(1) === 0 ? g = a : g = d, g.cmpn(0) < 0 && g.iadd(t), g;
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
      o(typeof t == "number");
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
        r && (t = -t), o(t <= 67108863, "Number is too big");
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
      return new U(t);
    }, f.prototype.toRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), o(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return o(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return o(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return o(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return o(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return o(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return o(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return o(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return o(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return o(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return o(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return o(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return o(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var ft = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function F(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    F.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, F.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, F.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, F.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function _t() {
      F.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(_t, F), _t.prototype.split = function(t, r) {
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
    }, _t.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function St() {
      F.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(St, F);
    function kt() {
      F.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(kt, F);
    function At() {
      F.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(At, F), At.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (ft[t])
        return ft[t];
      var r;
      if (t === "k256")
        r = new _t();
      else if (t === "p224")
        r = new St();
      else if (t === "p192")
        r = new kt();
      else if (t === "p25519")
        r = new At();
      else
        throw new Error("Unknown prime " + t);
      return ft[t] = r, r;
    };
    function U(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        o(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    U.prototype._verify1 = function(t) {
      o(t.negative === 0, "red works only with positives"), o(t.red, "red works only with red numbers");
    }, U.prototype._verify2 = function(t, r) {
      o((t.negative | r.negative) === 0, "red works only with positives"), o(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, U.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, U.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, U.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, U.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, U.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, U.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, U.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, U.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, U.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, U.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, U.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, U.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (o(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      o(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), s = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, s).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var u = this.pow(e, a), g = this.pow(t, a.addn(1).iushrn(1)), M = this.pow(t, a), k = d; M.cmp(c) !== 0; ) {
        for (var R = M, P = 0; R.cmp(c) !== 0; P++)
          R = R.redSqr();
        o(P < k);
        var E = this.pow(u, new f(1).iushln(k - P - 1));
        g = g.redMul(E), u = E.redSqr(), M = M.redMul(u), k = P;
      }
      return g;
    }, U.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, U.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, s = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var u = r.words[d], g = e - 1; g >= 0; g--) {
          var M = u >> g & 1;
          if (c !== a[0] && (c = this.sqr(c)), M === 0 && v === 0) {
            s = 0;
            continue;
          }
          v <<= 1, v |= M, s++, !(s !== i && (d !== 0 || g !== 0)) && (c = this.mul(c, a[v]), s = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, U.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, U.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new Et(t);
    };
    function Et(p) {
      U.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(Et, U), Et.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, Et.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, Et.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(I0);
var Ar = I0.exports, T0 = {};
(function(h) {
  var n = h;
  function l(f, b) {
    if (Array.isArray(f))
      return f.slice();
    if (!f)
      return [];
    var w = [];
    if (typeof f != "string") {
      for (var _ = 0; _ < f.length; _++)
        w[_] = f[_] | 0;
      return w;
    }
    if (b === "hex") {
      f = f.replace(/[^a-z0-9]+/ig, ""), f.length % 2 !== 0 && (f = "0" + f);
      for (var _ = 0; _ < f.length; _ += 2)
        w.push(parseInt(f[_] + f[_ + 1], 16));
    } else
      for (var _ = 0; _ < f.length; _++) {
        var S = f.charCodeAt(_), y = S >> 8, x = S & 255;
        y ? w.push(y, x) : w.push(x);
      }
    return w;
  }
  n.toArray = l;
  function o(f) {
    return f.length === 1 ? "0" + f : f;
  }
  n.zero2 = o;
  function m(f) {
    for (var b = "", w = 0; w < f.length; w++)
      b += o(f[w].toString(16));
    return b;
  }
  n.toHex = m, n.encode = function(b, w) {
    return w === "hex" ? m(b) : b;
  };
})(T0);
(function(h) {
  var n = h, l = Ar, o = Ke, m = T0;
  n.assert = o, n.toArray = m.toArray, n.zero2 = m.zero2, n.toHex = m.toHex, n.encode = m.encode;
  function f(y, x, B) {
    var A = new Array(Math.max(y.bitLength(), B) + 1), T;
    for (T = 0; T < A.length; T += 1)
      A[T] = 0;
    var D = 1 << x + 1, O = y.clone();
    for (T = 0; T < A.length; T++) {
      var N, q = O.andln(D - 1);
      O.isOdd() ? (q > (D >> 1) - 1 ? N = (D >> 1) - q : N = q, O.isubn(N)) : N = 0, A[T] = N, O.iushrn(1);
    }
    return A;
  }
  n.getNAF = f;
  function b(y, x) {
    var B = [
      [],
      []
    ];
    y = y.clone(), x = x.clone();
    for (var A = 0, T = 0, D; y.cmpn(-A) > 0 || x.cmpn(-T) > 0; ) {
      var O = y.andln(3) + A & 3, N = x.andln(3) + T & 3;
      O === 3 && (O = -1), N === 3 && (N = -1);
      var q;
      O & 1 ? (D = y.andln(7) + A & 7, (D === 3 || D === 5) && N === 2 ? q = -O : q = O) : q = 0, B[0].push(q);
      var ft;
      N & 1 ? (D = x.andln(7) + T & 7, (D === 3 || D === 5) && O === 2 ? ft = -N : ft = N) : ft = 0, B[1].push(ft), 2 * A === q + 1 && (A = 1 - A), 2 * T === ft + 1 && (T = 1 - T), y.iushrn(1), x.iushrn(1);
    }
    return B;
  }
  n.getJSF = b;
  function w(y, x, B) {
    var A = "_" + x;
    y.prototype[x] = function() {
      return this[A] !== void 0 ? this[A] : this[A] = B.call(this);
    };
  }
  n.cachedProperty = w;
  function _(y) {
    return typeof y == "string" ? n.toArray(y, "hex") : y;
  }
  n.parseBytes = _;
  function S(y) {
    return new l(y, "hex", "le");
  }
  n.intFromLE = S;
})(Oe);
var C0 = {}, Fr = Ar, Gi = Oe, wn = Gi.getNAF, yv = Gi.getJSF, Mn = Gi.assert;
function Pr(h, n) {
  this.type = h, this.p = new Fr(n.p, 16), this.red = n.prime ? Fr.red(n.prime) : Fr.mont(this.p), this.zero = new Fr(0).toRed(this.red), this.one = new Fr(1).toRed(this.red), this.two = new Fr(2).toRed(this.red), this.n = n.n && new Fr(n.n, 16), this.g = n.g && this.pointFromJSON(n.g, n.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
  var l = this.n && this.p.div(this.n);
  !l || l.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
}
var Hn = Pr;
Pr.prototype.point = function() {
  throw new Error("Not implemented");
};
Pr.prototype.validate = function() {
  throw new Error("Not implemented");
};
Pr.prototype._fixedNafMul = function(n, l) {
  Mn(n.precomputed);
  var o = n._getDoubles(), m = wn(l, 1, this._bitLength), f = (1 << o.step + 1) - (o.step % 2 === 0 ? 2 : 1);
  f /= 3;
  var b = [], w, _;
  for (w = 0; w < m.length; w += o.step) {
    _ = 0;
    for (var S = w + o.step - 1; S >= w; S--)
      _ = (_ << 1) + m[S];
    b.push(_);
  }
  for (var y = this.jpoint(null, null, null), x = this.jpoint(null, null, null), B = f; B > 0; B--) {
    for (w = 0; w < b.length; w++)
      _ = b[w], _ === B ? x = x.mixedAdd(o.points[w]) : _ === -B && (x = x.mixedAdd(o.points[w].neg()));
    y = y.add(x);
  }
  return y.toP();
};
Pr.prototype._wnafMul = function(n, l) {
  var o = 4, m = n._getNAFPoints(o);
  o = m.wnd;
  for (var f = m.points, b = wn(l, o, this._bitLength), w = this.jpoint(null, null, null), _ = b.length - 1; _ >= 0; _--) {
    for (var S = 0; _ >= 0 && b[_] === 0; _--)
      S++;
    if (_ >= 0 && S++, w = w.dblp(S), _ < 0)
      break;
    var y = b[_];
    Mn(y !== 0), n.type === "affine" ? y > 0 ? w = w.mixedAdd(f[y - 1 >> 1]) : w = w.mixedAdd(f[-y - 1 >> 1].neg()) : y > 0 ? w = w.add(f[y - 1 >> 1]) : w = w.add(f[-y - 1 >> 1].neg());
  }
  return n.type === "affine" ? w.toP() : w;
};
Pr.prototype._wnafMulAdd = function(n, l, o, m, f) {
  var b = this._wnafT1, w = this._wnafT2, _ = this._wnafT3, S = 0, y, x, B;
  for (y = 0; y < m; y++) {
    B = l[y];
    var A = B._getNAFPoints(n);
    b[y] = A.wnd, w[y] = A.points;
  }
  for (y = m - 1; y >= 1; y -= 2) {
    var T = y - 1, D = y;
    if (b[T] !== 1 || b[D] !== 1) {
      _[T] = wn(o[T], b[T], this._bitLength), _[D] = wn(o[D], b[D], this._bitLength), S = Math.max(_[T].length, S), S = Math.max(_[D].length, S);
      continue;
    }
    var O = [
      l[T],
      /* 1 */
      null,
      /* 3 */
      null,
      /* 5 */
      l[D]
      /* 7 */
    ];
    l[T].y.cmp(l[D].y) === 0 ? (O[1] = l[T].add(l[D]), O[2] = l[T].toJ().mixedAdd(l[D].neg())) : l[T].y.cmp(l[D].y.redNeg()) === 0 ? (O[1] = l[T].toJ().mixedAdd(l[D]), O[2] = l[T].add(l[D].neg())) : (O[1] = l[T].toJ().mixedAdd(l[D]), O[2] = l[T].toJ().mixedAdd(l[D].neg()));
    var N = [
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
    ], q = yv(o[T], o[D]);
    for (S = Math.max(q[0].length, S), _[T] = new Array(S), _[D] = new Array(S), x = 0; x < S; x++) {
      var ft = q[0][x] | 0, F = q[1][x] | 0;
      _[T][x] = N[(ft + 1) * 3 + (F + 1)], _[D][x] = 0, w[T] = O;
    }
  }
  var _t = this.jpoint(null, null, null), St = this._wnafT4;
  for (y = S; y >= 0; y--) {
    for (var kt = 0; y >= 0; ) {
      var At = !0;
      for (x = 0; x < m; x++)
        St[x] = _[x][y] | 0, St[x] !== 0 && (At = !1);
      if (!At)
        break;
      kt++, y--;
    }
    if (y >= 0 && kt++, _t = _t.dblp(kt), y < 0)
      break;
    for (x = 0; x < m; x++) {
      var U = St[x];
      U !== 0 && (U > 0 ? B = w[x][U - 1 >> 1] : U < 0 && (B = w[x][-U - 1 >> 1].neg()), B.type === "affine" ? _t = _t.mixedAdd(B) : _t = _t.add(B));
    }
  }
  for (y = 0; y < m; y++)
    w[y] = null;
  return f ? _t : _t.toP();
};
function Ze(h, n) {
  this.curve = h, this.type = n, this.precomputed = null;
}
Pr.BasePoint = Ze;
Ze.prototype.eq = function() {
  throw new Error("Not implemented");
};
Ze.prototype.validate = function() {
  return this.curve.validate(this);
};
Pr.prototype.decodePoint = function(n, l) {
  n = Gi.toArray(n, l);
  var o = this.p.byteLength();
  if ((n[0] === 4 || n[0] === 6 || n[0] === 7) && n.length - 1 === 2 * o) {
    n[0] === 6 ? Mn(n[n.length - 1] % 2 === 0) : n[0] === 7 && Mn(n[n.length - 1] % 2 === 1);
    var m = this.point(
      n.slice(1, 1 + o),
      n.slice(1 + o, 1 + 2 * o)
    );
    return m;
  } else if ((n[0] === 2 || n[0] === 3) && n.length - 1 === o)
    return this.pointFromX(n.slice(1, 1 + o), n[0] === 3);
  throw new Error("Unknown point format");
};
Ze.prototype.encodeCompressed = function(n) {
  return this.encode(n, !0);
};
Ze.prototype._encode = function(n) {
  var l = this.curve.p.byteLength(), o = this.getX().toArray("be", l);
  return n ? [this.getY().isEven() ? 2 : 3].concat(o) : [4].concat(o, this.getY().toArray("be", l));
};
Ze.prototype.encode = function(n, l) {
  return Gi.encode(this._encode(l), n);
};
Ze.prototype.precompute = function(n) {
  if (this.precomputed)
    return this;
  var l = {
    doubles: null,
    naf: null,
    beta: null
  };
  return l.naf = this._getNAFPoints(8), l.doubles = this._getDoubles(4, n), l.beta = this._getBeta(), this.precomputed = l, this;
};
Ze.prototype._hasDoubles = function(n) {
  if (!this.precomputed)
    return !1;
  var l = this.precomputed.doubles;
  return l ? l.points.length >= Math.ceil((n.bitLength() + 1) / l.step) : !1;
};
Ze.prototype._getDoubles = function(n, l) {
  if (this.precomputed && this.precomputed.doubles)
    return this.precomputed.doubles;
  for (var o = [this], m = this, f = 0; f < l; f += n) {
    for (var b = 0; b < n; b++)
      m = m.dbl();
    o.push(m);
  }
  return {
    step: n,
    points: o
  };
};
Ze.prototype._getNAFPoints = function(n) {
  if (this.precomputed && this.precomputed.naf)
    return this.precomputed.naf;
  for (var l = [this], o = (1 << n) - 1, m = o === 1 ? null : this.dbl(), f = 1; f < o; f++)
    l[f] = l[f - 1].add(m);
  return {
    wnd: n,
    points: l
  };
};
Ze.prototype._getBeta = function() {
  return null;
};
Ze.prototype.dblp = function(n) {
  for (var l = this, o = 0; o < n; o++)
    l = l.dbl();
  return l;
};
var wv = Oe, me = Ar, q0 = Jt, vi = Hn, Mv = wv.assert;
function We(h) {
  vi.call(this, "short", h), this.a = new me(h.a, 16).toRed(this.red), this.b = new me(h.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(h), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
}
q0(We, vi);
var xv = We;
We.prototype._getEndomorphism = function(n) {
  if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
    var l, o;
    if (n.beta)
      l = new me(n.beta, 16).toRed(this.red);
    else {
      var m = this._getEndoRoots(this.p);
      l = m[0].cmp(m[1]) < 0 ? m[0] : m[1], l = l.toRed(this.red);
    }
    if (n.lambda)
      o = new me(n.lambda, 16);
    else {
      var f = this._getEndoRoots(this.n);
      this.g.mul(f[0]).x.cmp(this.g.x.redMul(l)) === 0 ? o = f[0] : (o = f[1], Mv(this.g.mul(o).x.cmp(this.g.x.redMul(l)) === 0));
    }
    var b;
    return n.basis ? b = n.basis.map(function(w) {
      return {
        a: new me(w.a, 16),
        b: new me(w.b, 16)
      };
    }) : b = this._getEndoBasis(o), {
      beta: l,
      lambda: o,
      basis: b
    };
  }
};
We.prototype._getEndoRoots = function(n) {
  var l = n === this.p ? this.red : me.mont(n), o = new me(2).toRed(l).redInvm(), m = o.redNeg(), f = new me(3).toRed(l).redNeg().redSqrt().redMul(o), b = m.redAdd(f).fromRed(), w = m.redSub(f).fromRed();
  return [b, w];
};
We.prototype._getEndoBasis = function(n) {
  for (var l = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), o = n, m = this.n.clone(), f = new me(1), b = new me(0), w = new me(0), _ = new me(1), S, y, x, B, A, T, D, O = 0, N, q; o.cmpn(0) !== 0; ) {
    var ft = m.div(o);
    N = m.sub(ft.mul(o)), q = w.sub(ft.mul(f));
    var F = _.sub(ft.mul(b));
    if (!x && N.cmp(l) < 0)
      S = D.neg(), y = f, x = N.neg(), B = q;
    else if (x && ++O === 2)
      break;
    D = N, m = o, o = N, w = f, f = q, _ = b, b = F;
  }
  A = N.neg(), T = q;
  var _t = x.sqr().add(B.sqr()), St = A.sqr().add(T.sqr());
  return St.cmp(_t) >= 0 && (A = S, T = y), x.negative && (x = x.neg(), B = B.neg()), A.negative && (A = A.neg(), T = T.neg()), [
    { a: x, b: B },
    { a: A, b: T }
  ];
};
We.prototype._endoSplit = function(n) {
  var l = this.endo.basis, o = l[0], m = l[1], f = m.b.mul(n).divRound(this.n), b = o.b.neg().mul(n).divRound(this.n), w = f.mul(o.a), _ = b.mul(m.a), S = f.mul(o.b), y = b.mul(m.b), x = n.sub(w).sub(_), B = S.add(y).neg();
  return { k1: x, k2: B };
};
We.prototype.pointFromX = function(n, l) {
  n = new me(n, 16), n.red || (n = n.toRed(this.red));
  var o = n.redSqr().redMul(n).redIAdd(n.redMul(this.a)).redIAdd(this.b), m = o.redSqrt();
  if (m.redSqr().redSub(o).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var f = m.fromRed().isOdd();
  return (l && !f || !l && f) && (m = m.redNeg()), this.point(n, m);
};
We.prototype.validate = function(n) {
  if (n.inf)
    return !0;
  var l = n.x, o = n.y, m = this.a.redMul(l), f = l.redSqr().redMul(l).redIAdd(m).redIAdd(this.b);
  return o.redSqr().redISub(f).cmpn(0) === 0;
};
We.prototype._endoWnafMulAdd = function(n, l, o) {
  for (var m = this._endoWnafT1, f = this._endoWnafT2, b = 0; b < n.length; b++) {
    var w = this._endoSplit(l[b]), _ = n[b], S = _._getBeta();
    w.k1.negative && (w.k1.ineg(), _ = _.neg(!0)), w.k2.negative && (w.k2.ineg(), S = S.neg(!0)), m[b * 2] = _, m[b * 2 + 1] = S, f[b * 2] = w.k1, f[b * 2 + 1] = w.k2;
  }
  for (var y = this._wnafMulAdd(1, m, f, b * 2, o), x = 0; x < b * 2; x++)
    m[x] = null, f[x] = null;
  return y;
};
function Be(h, n, l, o) {
  vi.BasePoint.call(this, h, "affine"), n === null && l === null ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new me(n, 16), this.y = new me(l, 16), o && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
}
q0(Be, vi.BasePoint);
We.prototype.point = function(n, l, o) {
  return new Be(this, n, l, o);
};
We.prototype.pointFromJSON = function(n, l) {
  return Be.fromJSON(this, n, l);
};
Be.prototype._getBeta = function() {
  if (this.curve.endo) {
    var n = this.precomputed;
    if (n && n.beta)
      return n.beta;
    var l = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (n) {
      var o = this.curve, m = function(f) {
        return o.point(f.x.redMul(o.endo.beta), f.y);
      };
      n.beta = l, l.precomputed = {
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
    return l;
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
Be.fromJSON = function(n, l, o) {
  typeof l == "string" && (l = JSON.parse(l));
  var m = n.point(l[0], l[1], o);
  if (!l[2])
    return m;
  function f(w) {
    return n.point(w[0], w[1], o);
  }
  var b = l[2];
  return m.precomputed = {
    beta: null,
    doubles: b.doubles && {
      step: b.doubles.step,
      points: [m].concat(b.doubles.points.map(f))
    },
    naf: b.naf && {
      wnd: b.naf.wnd,
      points: [m].concat(b.naf.points.map(f))
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
  var l = this.y.redSub(n.y);
  l.cmpn(0) !== 0 && (l = l.redMul(this.x.redSub(n.x).redInvm()));
  var o = l.redSqr().redISub(this.x).redISub(n.x), m = l.redMul(this.x.redSub(o)).redISub(this.y);
  return this.curve.point(o, m);
};
Be.prototype.dbl = function() {
  if (this.inf)
    return this;
  var n = this.y.redAdd(this.y);
  if (n.cmpn(0) === 0)
    return this.curve.point(null, null);
  var l = this.curve.a, o = this.x.redSqr(), m = n.redInvm(), f = o.redAdd(o).redIAdd(o).redIAdd(l).redMul(m), b = f.redSqr().redISub(this.x.redAdd(this.x)), w = f.redMul(this.x.redSub(b)).redISub(this.y);
  return this.curve.point(b, w);
};
Be.prototype.getX = function() {
  return this.x.fromRed();
};
Be.prototype.getY = function() {
  return this.y.fromRed();
};
Be.prototype.mul = function(n) {
  return n = new me(n, 16), this.isInfinity() ? this : this._hasDoubles(n) ? this.curve._fixedNafMul(this, n) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [n]) : this.curve._wnafMul(this, n);
};
Be.prototype.mulAdd = function(n, l, o) {
  var m = [this, l], f = [n, o];
  return this.curve.endo ? this.curve._endoWnafMulAdd(m, f) : this.curve._wnafMulAdd(1, m, f, 2);
};
Be.prototype.jmulAdd = function(n, l, o) {
  var m = [this, l], f = [n, o];
  return this.curve.endo ? this.curve._endoWnafMulAdd(m, f, !0) : this.curve._wnafMulAdd(1, m, f, 2, !0);
};
Be.prototype.eq = function(n) {
  return this === n || this.inf === n.inf && (this.inf || this.x.cmp(n.x) === 0 && this.y.cmp(n.y) === 0);
};
Be.prototype.neg = function(n) {
  if (this.inf)
    return this;
  var l = this.curve.point(this.x, this.y.redNeg());
  if (n && this.precomputed) {
    var o = this.precomputed, m = function(f) {
      return f.neg();
    };
    l.precomputed = {
      naf: o.naf && {
        wnd: o.naf.wnd,
        points: o.naf.points.map(m)
      },
      doubles: o.doubles && {
        step: o.doubles.step,
        points: o.doubles.points.map(m)
      }
    };
  }
  return l;
};
Be.prototype.toJ = function() {
  if (this.inf)
    return this.curve.jpoint(null, null, null);
  var n = this.curve.jpoint(this.x, this.y, this.curve.one);
  return n;
};
function Ee(h, n, l, o) {
  vi.BasePoint.call(this, h, "jacobian"), n === null && l === null && o === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new me(0)) : (this.x = new me(n, 16), this.y = new me(l, 16), this.z = new me(o, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
}
q0(Ee, vi.BasePoint);
We.prototype.jpoint = function(n, l, o) {
  return new Ee(this, n, l, o);
};
Ee.prototype.toP = function() {
  if (this.isInfinity())
    return this.curve.point(null, null);
  var n = this.z.redInvm(), l = n.redSqr(), o = this.x.redMul(l), m = this.y.redMul(l).redMul(n);
  return this.curve.point(o, m);
};
Ee.prototype.neg = function() {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
Ee.prototype.add = function(n) {
  if (this.isInfinity())
    return n;
  if (n.isInfinity())
    return this;
  var l = n.z.redSqr(), o = this.z.redSqr(), m = this.x.redMul(l), f = n.x.redMul(o), b = this.y.redMul(l.redMul(n.z)), w = n.y.redMul(o.redMul(this.z)), _ = m.redSub(f), S = b.redSub(w);
  if (_.cmpn(0) === 0)
    return S.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var y = _.redSqr(), x = y.redMul(_), B = m.redMul(y), A = S.redSqr().redIAdd(x).redISub(B).redISub(B), T = S.redMul(B.redISub(A)).redISub(b.redMul(x)), D = this.z.redMul(n.z).redMul(_);
  return this.curve.jpoint(A, T, D);
};
Ee.prototype.mixedAdd = function(n) {
  if (this.isInfinity())
    return n.toJ();
  if (n.isInfinity())
    return this;
  var l = this.z.redSqr(), o = this.x, m = n.x.redMul(l), f = this.y, b = n.y.redMul(l).redMul(this.z), w = o.redSub(m), _ = f.redSub(b);
  if (w.cmpn(0) === 0)
    return _.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
  var S = w.redSqr(), y = S.redMul(w), x = o.redMul(S), B = _.redSqr().redIAdd(y).redISub(x).redISub(x), A = _.redMul(x.redISub(B)).redISub(f.redMul(y)), T = this.z.redMul(w);
  return this.curve.jpoint(B, A, T);
};
Ee.prototype.dblp = function(n) {
  if (n === 0)
    return this;
  if (this.isInfinity())
    return this;
  if (!n)
    return this.dbl();
  var l;
  if (this.curve.zeroA || this.curve.threeA) {
    var o = this;
    for (l = 0; l < n; l++)
      o = o.dbl();
    return o;
  }
  var m = this.curve.a, f = this.curve.tinv, b = this.x, w = this.y, _ = this.z, S = _.redSqr().redSqr(), y = w.redAdd(w);
  for (l = 0; l < n; l++) {
    var x = b.redSqr(), B = y.redSqr(), A = B.redSqr(), T = x.redAdd(x).redIAdd(x).redIAdd(m.redMul(S)), D = b.redMul(B), O = T.redSqr().redISub(D.redAdd(D)), N = D.redISub(O), q = T.redMul(N);
    q = q.redIAdd(q).redISub(A);
    var ft = y.redMul(_);
    l + 1 < n && (S = S.redMul(A)), b = O, _ = ft, y = q;
  }
  return this.curve.jpoint(b, y.redMul(f), _);
};
Ee.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
};
Ee.prototype._zeroDbl = function() {
  var n, l, o;
  if (this.zOne) {
    var m = this.x.redSqr(), f = this.y.redSqr(), b = f.redSqr(), w = this.x.redAdd(f).redSqr().redISub(m).redISub(b);
    w = w.redIAdd(w);
    var _ = m.redAdd(m).redIAdd(m), S = _.redSqr().redISub(w).redISub(w), y = b.redIAdd(b);
    y = y.redIAdd(y), y = y.redIAdd(y), n = S, l = _.redMul(w.redISub(S)).redISub(y), o = this.y.redAdd(this.y);
  } else {
    var x = this.x.redSqr(), B = this.y.redSqr(), A = B.redSqr(), T = this.x.redAdd(B).redSqr().redISub(x).redISub(A);
    T = T.redIAdd(T);
    var D = x.redAdd(x).redIAdd(x), O = D.redSqr(), N = A.redIAdd(A);
    N = N.redIAdd(N), N = N.redIAdd(N), n = O.redISub(T).redISub(T), l = D.redMul(T.redISub(n)).redISub(N), o = this.y.redMul(this.z), o = o.redIAdd(o);
  }
  return this.curve.jpoint(n, l, o);
};
Ee.prototype._threeDbl = function() {
  var n, l, o;
  if (this.zOne) {
    var m = this.x.redSqr(), f = this.y.redSqr(), b = f.redSqr(), w = this.x.redAdd(f).redSqr().redISub(m).redISub(b);
    w = w.redIAdd(w);
    var _ = m.redAdd(m).redIAdd(m).redIAdd(this.curve.a), S = _.redSqr().redISub(w).redISub(w);
    n = S;
    var y = b.redIAdd(b);
    y = y.redIAdd(y), y = y.redIAdd(y), l = _.redMul(w.redISub(S)).redISub(y), o = this.y.redAdd(this.y);
  } else {
    var x = this.z.redSqr(), B = this.y.redSqr(), A = this.x.redMul(B), T = this.x.redSub(x).redMul(this.x.redAdd(x));
    T = T.redAdd(T).redIAdd(T);
    var D = A.redIAdd(A);
    D = D.redIAdd(D);
    var O = D.redAdd(D);
    n = T.redSqr().redISub(O), o = this.y.redAdd(this.z).redSqr().redISub(B).redISub(x);
    var N = B.redSqr();
    N = N.redIAdd(N), N = N.redIAdd(N), N = N.redIAdd(N), l = T.redMul(D.redISub(n)).redISub(N);
  }
  return this.curve.jpoint(n, l, o);
};
Ee.prototype._dbl = function() {
  var n = this.curve.a, l = this.x, o = this.y, m = this.z, f = m.redSqr().redSqr(), b = l.redSqr(), w = o.redSqr(), _ = b.redAdd(b).redIAdd(b).redIAdd(n.redMul(f)), S = l.redAdd(l);
  S = S.redIAdd(S);
  var y = S.redMul(w), x = _.redSqr().redISub(y.redAdd(y)), B = y.redISub(x), A = w.redSqr();
  A = A.redIAdd(A), A = A.redIAdd(A), A = A.redIAdd(A);
  var T = _.redMul(B).redISub(A), D = o.redAdd(o).redMul(m);
  return this.curve.jpoint(x, T, D);
};
Ee.prototype.trpl = function() {
  if (!this.curve.zeroA)
    return this.dbl().add(this);
  var n = this.x.redSqr(), l = this.y.redSqr(), o = this.z.redSqr(), m = l.redSqr(), f = n.redAdd(n).redIAdd(n), b = f.redSqr(), w = this.x.redAdd(l).redSqr().redISub(n).redISub(m);
  w = w.redIAdd(w), w = w.redAdd(w).redIAdd(w), w = w.redISub(b);
  var _ = w.redSqr(), S = m.redIAdd(m);
  S = S.redIAdd(S), S = S.redIAdd(S), S = S.redIAdd(S);
  var y = f.redIAdd(w).redSqr().redISub(b).redISub(_).redISub(S), x = l.redMul(y);
  x = x.redIAdd(x), x = x.redIAdd(x);
  var B = this.x.redMul(_).redISub(x);
  B = B.redIAdd(B), B = B.redIAdd(B);
  var A = this.y.redMul(y.redMul(S.redISub(y)).redISub(w.redMul(_)));
  A = A.redIAdd(A), A = A.redIAdd(A), A = A.redIAdd(A);
  var T = this.z.redAdd(w).redSqr().redISub(o).redISub(_);
  return this.curve.jpoint(B, A, T);
};
Ee.prototype.mul = function(n, l) {
  return n = new me(n, l), this.curve._wnafMul(this, n);
};
Ee.prototype.eq = function(n) {
  if (n.type === "affine")
    return this.eq(n.toJ());
  if (this === n)
    return !0;
  var l = this.z.redSqr(), o = n.z.redSqr();
  if (this.x.redMul(o).redISub(n.x.redMul(l)).cmpn(0) !== 0)
    return !1;
  var m = l.redMul(this.z), f = o.redMul(n.z);
  return this.y.redMul(f).redISub(n.y.redMul(m)).cmpn(0) === 0;
};
Ee.prototype.eqXToP = function(n) {
  var l = this.z.redSqr(), o = n.toRed(this.curve.red).redMul(l);
  if (this.x.cmp(o) === 0)
    return !0;
  for (var m = n.clone(), f = this.curve.redN.redMul(l); ; ) {
    if (m.iadd(this.curve.n), m.cmp(this.curve.p) >= 0)
      return !1;
    if (o.redIAdd(f), this.x.cmp(o) === 0)
      return !0;
  }
};
Ee.prototype.inspect = function() {
  return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
};
Ee.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
var ti = Ar, Vs = Jt, Zn = Hn, _v = Oe;
function pi(h) {
  Zn.call(this, "mont", h), this.a = new ti(h.a, 16).toRed(this.red), this.b = new ti(h.b, 16).toRed(this.red), this.i4 = new ti(4).toRed(this.red).redInvm(), this.two = new ti(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
Vs(pi, Zn);
var Sv = pi;
pi.prototype.validate = function(n) {
  var l = n.normalize().x, o = l.redSqr(), m = o.redMul(l).redAdd(o.redMul(this.a)).redAdd(l), f = m.redSqrt();
  return f.redSqr().cmp(m) === 0;
};
function Se(h, n, l) {
  Zn.BasePoint.call(this, h, "projective"), n === null && l === null ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new ti(n, 16), this.z = new ti(l, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
}
Vs(Se, Zn.BasePoint);
pi.prototype.decodePoint = function(n, l) {
  return this.point(_v.toArray(n, l), 1);
};
pi.prototype.point = function(n, l) {
  return new Se(this, n, l);
};
pi.prototype.pointFromJSON = function(n) {
  return Se.fromJSON(this, n);
};
Se.prototype.precompute = function() {
};
Se.prototype._encode = function() {
  return this.getX().toArray("be", this.curve.p.byteLength());
};
Se.fromJSON = function(n, l) {
  return new Se(n, l[0], l[1] || n.one);
};
Se.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
Se.prototype.isInfinity = function() {
  return this.z.cmpn(0) === 0;
};
Se.prototype.dbl = function() {
  var n = this.x.redAdd(this.z), l = n.redSqr(), o = this.x.redSub(this.z), m = o.redSqr(), f = l.redSub(m), b = l.redMul(m), w = f.redMul(m.redAdd(this.curve.a24.redMul(f)));
  return this.curve.point(b, w);
};
Se.prototype.add = function() {
  throw new Error("Not supported on Montgomery curve");
};
Se.prototype.diffAdd = function(n, l) {
  var o = this.x.redAdd(this.z), m = this.x.redSub(this.z), f = n.x.redAdd(n.z), b = n.x.redSub(n.z), w = b.redMul(o), _ = f.redMul(m), S = l.z.redMul(w.redAdd(_).redSqr()), y = l.x.redMul(w.redISub(_).redSqr());
  return this.curve.point(S, y);
};
Se.prototype.mul = function(n) {
  for (var l = n.clone(), o = this, m = this.curve.point(null, null), f = this, b = []; l.cmpn(0) !== 0; l.iushrn(1))
    b.push(l.andln(1));
  for (var w = b.length - 1; w >= 0; w--)
    b[w] === 0 ? (o = o.diffAdd(m, f), m = m.dbl()) : (m = o.diffAdd(m, f), o = o.dbl());
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
var Av = Oe, br = Ar, Ys = Jt, Wn = Hn, Bv = Av.assert;
function cr(h) {
  this.twisted = (h.a | 0) !== 1, this.mOneA = this.twisted && (h.a | 0) === -1, this.extended = this.mOneA, Wn.call(this, "edwards", h), this.a = new br(h.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new br(h.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new br(h.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), Bv(!this.twisted || this.c.fromRed().cmpn(1) === 0), this.oneC = (h.c | 0) === 1;
}
Ys(cr, Wn);
var Ev = cr;
cr.prototype._mulA = function(n) {
  return this.mOneA ? n.redNeg() : this.a.redMul(n);
};
cr.prototype._mulC = function(n) {
  return this.oneC ? n : this.c.redMul(n);
};
cr.prototype.jpoint = function(n, l, o, m) {
  return this.point(n, l, o, m);
};
cr.prototype.pointFromX = function(n, l) {
  n = new br(n, 16), n.red || (n = n.toRed(this.red));
  var o = n.redSqr(), m = this.c2.redSub(this.a.redMul(o)), f = this.one.redSub(this.c2.redMul(this.d).redMul(o)), b = m.redMul(f.redInvm()), w = b.redSqrt();
  if (w.redSqr().redSub(b).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  var _ = w.fromRed().isOdd();
  return (l && !_ || !l && _) && (w = w.redNeg()), this.point(n, w);
};
cr.prototype.pointFromY = function(n, l) {
  n = new br(n, 16), n.red || (n = n.toRed(this.red));
  var o = n.redSqr(), m = o.redSub(this.c2), f = o.redMul(this.d).redMul(this.c2).redSub(this.a), b = m.redMul(f.redInvm());
  if (b.cmp(this.zero) === 0) {
    if (l)
      throw new Error("invalid point");
    return this.point(this.zero, n);
  }
  var w = b.redSqrt();
  if (w.redSqr().redSub(b).cmp(this.zero) !== 0)
    throw new Error("invalid point");
  return w.fromRed().isOdd() !== l && (w = w.redNeg()), this.point(w, n);
};
cr.prototype.validate = function(n) {
  if (n.isInfinity())
    return !0;
  n.normalize();
  var l = n.x.redSqr(), o = n.y.redSqr(), m = l.redMul(this.a).redAdd(o), f = this.c2.redMul(this.one.redAdd(this.d.redMul(l).redMul(o)));
  return m.cmp(f) === 0;
};
function pe(h, n, l, o, m) {
  Wn.BasePoint.call(this, h, "projective"), n === null && l === null && o === null ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new br(n, 16), this.y = new br(l, 16), this.z = o ? new br(o, 16) : this.curve.one, this.t = m && new br(m, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
}
Ys(pe, Wn.BasePoint);
cr.prototype.pointFromJSON = function(n) {
  return pe.fromJSON(this, n);
};
cr.prototype.point = function(n, l, o, m) {
  return new pe(this, n, l, o, m);
};
pe.fromJSON = function(n, l) {
  return new pe(n, l[0], l[1], l[2]);
};
pe.prototype.inspect = function() {
  return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
pe.prototype.isInfinity = function() {
  return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
};
pe.prototype._extDbl = function() {
  var n = this.x.redSqr(), l = this.y.redSqr(), o = this.z.redSqr();
  o = o.redIAdd(o);
  var m = this.curve._mulA(n), f = this.x.redAdd(this.y).redSqr().redISub(n).redISub(l), b = m.redAdd(l), w = b.redSub(o), _ = m.redSub(l), S = f.redMul(w), y = b.redMul(_), x = f.redMul(_), B = w.redMul(b);
  return this.curve.point(S, y, B, x);
};
pe.prototype._projDbl = function() {
  var n = this.x.redAdd(this.y).redSqr(), l = this.x.redSqr(), o = this.y.redSqr(), m, f, b, w, _, S;
  if (this.curve.twisted) {
    w = this.curve._mulA(l);
    var y = w.redAdd(o);
    this.zOne ? (m = n.redSub(l).redSub(o).redMul(y.redSub(this.curve.two)), f = y.redMul(w.redSub(o)), b = y.redSqr().redSub(y).redSub(y)) : (_ = this.z.redSqr(), S = y.redSub(_).redISub(_), m = n.redSub(l).redISub(o).redMul(S), f = y.redMul(w.redSub(o)), b = y.redMul(S));
  } else
    w = l.redAdd(o), _ = this.curve._mulC(this.z).redSqr(), S = w.redSub(_).redSub(_), m = this.curve._mulC(n.redISub(w)).redMul(S), f = this.curve._mulC(w).redMul(l.redISub(o)), b = w.redMul(S);
  return this.curve.point(m, f, b);
};
pe.prototype.dbl = function() {
  return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
};
pe.prototype._extAdd = function(n) {
  var l = this.y.redSub(this.x).redMul(n.y.redSub(n.x)), o = this.y.redAdd(this.x).redMul(n.y.redAdd(n.x)), m = this.t.redMul(this.curve.dd).redMul(n.t), f = this.z.redMul(n.z.redAdd(n.z)), b = o.redSub(l), w = f.redSub(m), _ = f.redAdd(m), S = o.redAdd(l), y = b.redMul(w), x = _.redMul(S), B = b.redMul(S), A = w.redMul(_);
  return this.curve.point(y, x, A, B);
};
pe.prototype._projAdd = function(n) {
  var l = this.z.redMul(n.z), o = l.redSqr(), m = this.x.redMul(n.x), f = this.y.redMul(n.y), b = this.curve.d.redMul(m).redMul(f), w = o.redSub(b), _ = o.redAdd(b), S = this.x.redAdd(this.y).redMul(n.x.redAdd(n.y)).redISub(m).redISub(f), y = l.redMul(w).redMul(S), x, B;
  return this.curve.twisted ? (x = l.redMul(_).redMul(f.redSub(this.curve._mulA(m))), B = w.redMul(_)) : (x = l.redMul(_).redMul(f.redSub(m)), B = this.curve._mulC(w).redMul(_)), this.curve.point(y, x, B);
};
pe.prototype.add = function(n) {
  return this.isInfinity() ? n : n.isInfinity() ? this : this.curve.extended ? this._extAdd(n) : this._projAdd(n);
};
pe.prototype.mul = function(n) {
  return this._hasDoubles(n) ? this.curve._fixedNafMul(this, n) : this.curve._wnafMul(this, n);
};
pe.prototype.mulAdd = function(n, l, o) {
  return this.curve._wnafMulAdd(1, [this, l], [n, o], 2, !1);
};
pe.prototype.jmulAdd = function(n, l, o) {
  return this.curve._wnafMulAdd(1, [this, l], [n, o], 2, !0);
};
pe.prototype.normalize = function() {
  if (this.zOne)
    return this;
  var n = this.z.redInvm();
  return this.x = this.x.redMul(n), this.y = this.y.redMul(n), this.t && (this.t = this.t.redMul(n)), this.z = this.curve.one, this.zOne = !0, this;
};
pe.prototype.neg = function() {
  return this.curve.point(
    this.x.redNeg(),
    this.y,
    this.z,
    this.t && this.t.redNeg()
  );
};
pe.prototype.getX = function() {
  return this.normalize(), this.x.fromRed();
};
pe.prototype.getY = function() {
  return this.normalize(), this.y.fromRed();
};
pe.prototype.eq = function(n) {
  return this === n || this.getX().cmp(n.getX()) === 0 && this.getY().cmp(n.getY()) === 0;
};
pe.prototype.eqXToP = function(n) {
  var l = n.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(l) === 0)
    return !0;
  for (var o = n.clone(), m = this.curve.redN.redMul(this.z); ; ) {
    if (o.iadd(this.curve.n), o.cmp(this.curve.p) >= 0)
      return !1;
    if (l.redIAdd(m), this.x.cmp(l) === 0)
      return !0;
  }
};
pe.prototype.toP = pe.prototype.normalize;
pe.prototype.mixedAdd = pe.prototype.add;
(function(h) {
  var n = h;
  n.base = Hn, n.short = xv, n.mont = Sv, n.edwards = Ev;
})(C0);
var Vn = {}, Yn = {}, Xt = {}, kv = Ke, Rv = Jt;
Xt.inherits = Rv;
function Iv(h, n) {
  return (h.charCodeAt(n) & 64512) !== 55296 || n < 0 || n + 1 >= h.length ? !1 : (h.charCodeAt(n + 1) & 64512) === 56320;
}
function Tv(h, n) {
  if (Array.isArray(h))
    return h.slice();
  if (!h)
    return [];
  var l = [];
  if (typeof h == "string")
    if (n) {
      if (n === "hex")
        for (h = h.replace(/[^a-z0-9]+/ig, ""), h.length % 2 !== 0 && (h = "0" + h), m = 0; m < h.length; m += 2)
          l.push(parseInt(h[m] + h[m + 1], 16));
    } else
      for (var o = 0, m = 0; m < h.length; m++) {
        var f = h.charCodeAt(m);
        f < 128 ? l[o++] = f : f < 2048 ? (l[o++] = f >> 6 | 192, l[o++] = f & 63 | 128) : Iv(h, m) ? (f = 65536 + ((f & 1023) << 10) + (h.charCodeAt(++m) & 1023), l[o++] = f >> 18 | 240, l[o++] = f >> 12 & 63 | 128, l[o++] = f >> 6 & 63 | 128, l[o++] = f & 63 | 128) : (l[o++] = f >> 12 | 224, l[o++] = f >> 6 & 63 | 128, l[o++] = f & 63 | 128);
      }
  else
    for (m = 0; m < h.length; m++)
      l[m] = h[m] | 0;
  return l;
}
Xt.toArray = Tv;
function Cv(h) {
  for (var n = "", l = 0; l < h.length; l++)
    n += Gs(h[l].toString(16));
  return n;
}
Xt.toHex = Cv;
function Js(h) {
  var n = h >>> 24 | h >>> 8 & 65280 | h << 8 & 16711680 | (h & 255) << 24;
  return n >>> 0;
}
Xt.htonl = Js;
function qv(h, n) {
  for (var l = "", o = 0; o < h.length; o++) {
    var m = h[o];
    n === "little" && (m = Js(m)), l += Xs(m.toString(16));
  }
  return l;
}
Xt.toHex32 = qv;
function Gs(h) {
  return h.length === 1 ? "0" + h : h;
}
Xt.zero2 = Gs;
function Xs(h) {
  return h.length === 7 ? "0" + h : h.length === 6 ? "00" + h : h.length === 5 ? "000" + h : h.length === 4 ? "0000" + h : h.length === 3 ? "00000" + h : h.length === 2 ? "000000" + h : h.length === 1 ? "0000000" + h : h;
}
Xt.zero8 = Xs;
function Pv(h, n, l, o) {
  var m = l - n;
  kv(m % 4 === 0);
  for (var f = new Array(m / 4), b = 0, w = n; b < f.length; b++, w += 4) {
    var _;
    o === "big" ? _ = h[w] << 24 | h[w + 1] << 16 | h[w + 2] << 8 | h[w + 3] : _ = h[w + 3] << 24 | h[w + 2] << 16 | h[w + 1] << 8 | h[w], f[b] = _ >>> 0;
  }
  return f;
}
Xt.join32 = Pv;
function Dv(h, n) {
  for (var l = new Array(h.length * 4), o = 0, m = 0; o < h.length; o++, m += 4) {
    var f = h[o];
    n === "big" ? (l[m] = f >>> 24, l[m + 1] = f >>> 16 & 255, l[m + 2] = f >>> 8 & 255, l[m + 3] = f & 255) : (l[m + 3] = f >>> 24, l[m + 2] = f >>> 16 & 255, l[m + 1] = f >>> 8 & 255, l[m] = f & 255);
  }
  return l;
}
Xt.split32 = Dv;
function Nv(h, n) {
  return h >>> n | h << 32 - n;
}
Xt.rotr32 = Nv;
function $v(h, n) {
  return h << n | h >>> 32 - n;
}
Xt.rotl32 = $v;
function Fv(h, n) {
  return h + n >>> 0;
}
Xt.sum32 = Fv;
function Lv(h, n, l) {
  return h + n + l >>> 0;
}
Xt.sum32_3 = Lv;
function Ov(h, n, l, o) {
  return h + n + l + o >>> 0;
}
Xt.sum32_4 = Ov;
function Uv(h, n, l, o, m) {
  return h + n + l + o + m >>> 0;
}
Xt.sum32_5 = Uv;
function zv(h, n, l, o) {
  var m = h[n], f = h[n + 1], b = o + f >>> 0, w = (b < o ? 1 : 0) + l + m;
  h[n] = w >>> 0, h[n + 1] = b;
}
Xt.sum64 = zv;
function Kv(h, n, l, o) {
  var m = n + o >>> 0, f = (m < n ? 1 : 0) + h + l;
  return f >>> 0;
}
Xt.sum64_hi = Kv;
function Hv(h, n, l, o) {
  var m = n + o;
  return m >>> 0;
}
Xt.sum64_lo = Hv;
function Zv(h, n, l, o, m, f, b, w) {
  var _ = 0, S = n;
  S = S + o >>> 0, _ += S < n ? 1 : 0, S = S + f >>> 0, _ += S < f ? 1 : 0, S = S + w >>> 0, _ += S < w ? 1 : 0;
  var y = h + l + m + b + _;
  return y >>> 0;
}
Xt.sum64_4_hi = Zv;
function Wv(h, n, l, o, m, f, b, w) {
  var _ = n + o + f + w;
  return _ >>> 0;
}
Xt.sum64_4_lo = Wv;
function Vv(h, n, l, o, m, f, b, w, _, S) {
  var y = 0, x = n;
  x = x + o >>> 0, y += x < n ? 1 : 0, x = x + f >>> 0, y += x < f ? 1 : 0, x = x + w >>> 0, y += x < w ? 1 : 0, x = x + S >>> 0, y += x < S ? 1 : 0;
  var B = h + l + m + b + _ + y;
  return B >>> 0;
}
Xt.sum64_5_hi = Vv;
function Yv(h, n, l, o, m, f, b, w, _, S) {
  var y = n + o + f + w + S;
  return y >>> 0;
}
Xt.sum64_5_lo = Yv;
function Jv(h, n, l) {
  var o = n << 32 - l | h >>> l;
  return o >>> 0;
}
Xt.rotr64_hi = Jv;
function Gv(h, n, l) {
  var o = h << 32 - l | n >>> l;
  return o >>> 0;
}
Xt.rotr64_lo = Gv;
function Xv(h, n, l) {
  return h >>> l;
}
Xt.shr64_hi = Xv;
function jv(h, n, l) {
  var o = h << 32 - l | n >>> l;
  return o >>> 0;
}
Xt.shr64_lo = jv;
var mi = {}, xa = Xt, Qv = Ke;
function Jn() {
  this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
}
mi.BlockHash = Jn;
Jn.prototype.update = function(n, l) {
  if (n = xa.toArray(n, l), this.pending ? this.pending = this.pending.concat(n) : this.pending = n, this.pendingTotal += n.length, this.pending.length >= this._delta8) {
    n = this.pending;
    var o = n.length % this._delta8;
    this.pending = n.slice(n.length - o, n.length), this.pending.length === 0 && (this.pending = null), n = xa.join32(n, 0, n.length - o, this.endian);
    for (var m = 0; m < n.length; m += this._delta32)
      this._update(n, m, m + this._delta32);
  }
  return this;
};
Jn.prototype.digest = function(n) {
  return this.update(this._pad()), Qv(this.pending === null), this._digest(n);
};
Jn.prototype._pad = function() {
  var n = this.pendingTotal, l = this._delta8, o = l - (n + this.padLength) % l, m = new Array(o + this.padLength);
  m[0] = 128;
  for (var f = 1; f < o; f++)
    m[f] = 0;
  if (n <<= 3, this.endian === "big") {
    for (var b = 8; b < this.padLength; b++)
      m[f++] = 0;
    m[f++] = 0, m[f++] = 0, m[f++] = 0, m[f++] = 0, m[f++] = n >>> 24 & 255, m[f++] = n >>> 16 & 255, m[f++] = n >>> 8 & 255, m[f++] = n & 255;
  } else
    for (m[f++] = n & 255, m[f++] = n >>> 8 & 255, m[f++] = n >>> 16 & 255, m[f++] = n >>> 24 & 255, m[f++] = 0, m[f++] = 0, m[f++] = 0, m[f++] = 0, b = 8; b < this.padLength; b++)
      m[f++] = 0;
  return m;
};
var gi = {}, vr = {}, tp = Xt, fr = tp.rotr32;
function ep(h, n, l, o) {
  if (h === 0)
    return js(n, l, o);
  if (h === 1 || h === 3)
    return to(n, l, o);
  if (h === 2)
    return Qs(n, l, o);
}
vr.ft_1 = ep;
function js(h, n, l) {
  return h & n ^ ~h & l;
}
vr.ch32 = js;
function Qs(h, n, l) {
  return h & n ^ h & l ^ n & l;
}
vr.maj32 = Qs;
function to(h, n, l) {
  return h ^ n ^ l;
}
vr.p32 = to;
function rp(h) {
  return fr(h, 2) ^ fr(h, 13) ^ fr(h, 22);
}
vr.s0_256 = rp;
function ip(h) {
  return fr(h, 6) ^ fr(h, 11) ^ fr(h, 25);
}
vr.s1_256 = ip;
function np(h) {
  return fr(h, 7) ^ fr(h, 18) ^ h >>> 3;
}
vr.g0_256 = np;
function fp(h) {
  return fr(h, 17) ^ fr(h, 19) ^ h >>> 10;
}
vr.g1_256 = fp;
var ai = Xt, ap = mi, hp = vr, wf = ai.rotl32, Ei = ai.sum32, sp = ai.sum32_5, op = hp.ft_1, eo = ap.BlockHash, up = [
  1518500249,
  1859775393,
  2400959708,
  3395469782
];
function ur() {
  if (!(this instanceof ur))
    return new ur();
  eo.call(this), this.h = [
    1732584193,
    4023233417,
    2562383102,
    271733878,
    3285377520
  ], this.W = new Array(80);
}
ai.inherits(ur, eo);
var lp = ur;
ur.blockSize = 512;
ur.outSize = 160;
ur.hmacStrength = 80;
ur.padLength = 64;
ur.prototype._update = function(n, l) {
  for (var o = this.W, m = 0; m < 16; m++)
    o[m] = n[l + m];
  for (; m < o.length; m++)
    o[m] = wf(o[m - 3] ^ o[m - 8] ^ o[m - 14] ^ o[m - 16], 1);
  var f = this.h[0], b = this.h[1], w = this.h[2], _ = this.h[3], S = this.h[4];
  for (m = 0; m < o.length; m++) {
    var y = ~~(m / 20), x = sp(wf(f, 5), op(y, b, w, _), S, o[m], up[y]);
    S = _, _ = w, w = wf(b, 30), b = f, f = x;
  }
  this.h[0] = Ei(this.h[0], f), this.h[1] = Ei(this.h[1], b), this.h[2] = Ei(this.h[2], w), this.h[3] = Ei(this.h[3], _), this.h[4] = Ei(this.h[4], S);
};
ur.prototype._digest = function(n) {
  return n === "hex" ? ai.toHex32(this.h, "big") : ai.split32(this.h, "big");
};
var hi = Xt, dp = mi, bi = vr, cp = Ke, Ye = hi.sum32, vp = hi.sum32_4, pp = hi.sum32_5, mp = bi.ch32, gp = bi.maj32, bp = bi.s0_256, yp = bi.s1_256, wp = bi.g0_256, Mp = bi.g1_256, ro = dp.BlockHash, xp = [
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
function lr() {
  if (!(this instanceof lr))
    return new lr();
  ro.call(this), this.h = [
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ], this.k = xp, this.W = new Array(64);
}
hi.inherits(lr, ro);
var io = lr;
lr.blockSize = 512;
lr.outSize = 256;
lr.hmacStrength = 192;
lr.padLength = 64;
lr.prototype._update = function(n, l) {
  for (var o = this.W, m = 0; m < 16; m++)
    o[m] = n[l + m];
  for (; m < o.length; m++)
    o[m] = vp(Mp(o[m - 2]), o[m - 7], wp(o[m - 15]), o[m - 16]);
  var f = this.h[0], b = this.h[1], w = this.h[2], _ = this.h[3], S = this.h[4], y = this.h[5], x = this.h[6], B = this.h[7];
  for (cp(this.k.length === o.length), m = 0; m < o.length; m++) {
    var A = pp(B, yp(S), mp(S, y, x), this.k[m], o[m]), T = Ye(bp(f), gp(f, b, w));
    B = x, x = y, y = S, S = Ye(_, A), _ = w, w = b, b = f, f = Ye(A, T);
  }
  this.h[0] = Ye(this.h[0], f), this.h[1] = Ye(this.h[1], b), this.h[2] = Ye(this.h[2], w), this.h[3] = Ye(this.h[3], _), this.h[4] = Ye(this.h[4], S), this.h[5] = Ye(this.h[5], y), this.h[6] = Ye(this.h[6], x), this.h[7] = Ye(this.h[7], B);
};
lr.prototype._digest = function(n) {
  return n === "hex" ? hi.toHex32(this.h, "big") : hi.split32(this.h, "big");
};
var e0 = Xt, no = io;
function xr() {
  if (!(this instanceof xr))
    return new xr();
  no.call(this), this.h = [
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
e0.inherits(xr, no);
var _p = xr;
xr.blockSize = 512;
xr.outSize = 224;
xr.hmacStrength = 192;
xr.padLength = 64;
xr.prototype._digest = function(n) {
  return n === "hex" ? e0.toHex32(this.h.slice(0, 7), "big") : e0.split32(this.h.slice(0, 7), "big");
};
var De = Xt, Sp = mi, Ap = Ke, ar = De.rotr64_hi, hr = De.rotr64_lo, fo = De.shr64_hi, ao = De.shr64_lo, Br = De.sum64, Mf = De.sum64_hi, xf = De.sum64_lo, Bp = De.sum64_4_hi, Ep = De.sum64_4_lo, kp = De.sum64_5_hi, Rp = De.sum64_5_lo, ho = Sp.BlockHash, Ip = [
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
function Xe() {
  if (!(this instanceof Xe))
    return new Xe();
  ho.call(this), this.h = [
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
  ], this.k = Ip, this.W = new Array(160);
}
De.inherits(Xe, ho);
var so = Xe;
Xe.blockSize = 1024;
Xe.outSize = 512;
Xe.hmacStrength = 192;
Xe.padLength = 128;
Xe.prototype._prepareBlock = function(n, l) {
  for (var o = this.W, m = 0; m < 32; m++)
    o[m] = n[l + m];
  for (; m < o.length; m += 2) {
    var f = Up(o[m - 4], o[m - 3]), b = zp(o[m - 4], o[m - 3]), w = o[m - 14], _ = o[m - 13], S = Lp(o[m - 30], o[m - 29]), y = Op(o[m - 30], o[m - 29]), x = o[m - 32], B = o[m - 31];
    o[m] = Bp(
      f,
      b,
      w,
      _,
      S,
      y,
      x,
      B
    ), o[m + 1] = Ep(
      f,
      b,
      w,
      _,
      S,
      y,
      x,
      B
    );
  }
};
Xe.prototype._update = function(n, l) {
  this._prepareBlock(n, l);
  var o = this.W, m = this.h[0], f = this.h[1], b = this.h[2], w = this.h[3], _ = this.h[4], S = this.h[5], y = this.h[6], x = this.h[7], B = this.h[8], A = this.h[9], T = this.h[10], D = this.h[11], O = this.h[12], N = this.h[13], q = this.h[14], ft = this.h[15];
  Ap(this.k.length === o.length);
  for (var F = 0; F < o.length; F += 2) {
    var _t = q, St = ft, kt = $p(B, A), At = Fp(B, A), U = Tp(B, A, T, D, O), Et = Cp(B, A, T, D, O, N), p = this.k[F], t = this.k[F + 1], r = o[F], i = o[F + 1], a = kp(
      _t,
      St,
      kt,
      At,
      U,
      Et,
      p,
      t,
      r,
      i
    ), d = Rp(
      _t,
      St,
      kt,
      At,
      U,
      Et,
      p,
      t,
      r,
      i
    );
    _t = Dp(m, f), St = Np(m, f), kt = qp(m, f, b, w, _), At = Pp(m, f, b, w, _, S);
    var c = Mf(_t, St, kt, At), v = xf(_t, St, kt, At);
    q = O, ft = N, O = T, N = D, T = B, D = A, B = Mf(y, x, a, d), A = xf(x, x, a, d), y = _, x = S, _ = b, S = w, b = m, w = f, m = Mf(a, d, c, v), f = xf(a, d, c, v);
  }
  Br(this.h, 0, m, f), Br(this.h, 2, b, w), Br(this.h, 4, _, S), Br(this.h, 6, y, x), Br(this.h, 8, B, A), Br(this.h, 10, T, D), Br(this.h, 12, O, N), Br(this.h, 14, q, ft);
};
Xe.prototype._digest = function(n) {
  return n === "hex" ? De.toHex32(this.h, "big") : De.split32(this.h, "big");
};
function Tp(h, n, l, o, m) {
  var f = h & l ^ ~h & m;
  return f < 0 && (f += 4294967296), f;
}
function Cp(h, n, l, o, m, f) {
  var b = n & o ^ ~n & f;
  return b < 0 && (b += 4294967296), b;
}
function qp(h, n, l, o, m) {
  var f = h & l ^ h & m ^ l & m;
  return f < 0 && (f += 4294967296), f;
}
function Pp(h, n, l, o, m, f) {
  var b = n & o ^ n & f ^ o & f;
  return b < 0 && (b += 4294967296), b;
}
function Dp(h, n) {
  var l = ar(h, n, 28), o = ar(n, h, 2), m = ar(n, h, 7), f = l ^ o ^ m;
  return f < 0 && (f += 4294967296), f;
}
function Np(h, n) {
  var l = hr(h, n, 28), o = hr(n, h, 2), m = hr(n, h, 7), f = l ^ o ^ m;
  return f < 0 && (f += 4294967296), f;
}
function $p(h, n) {
  var l = ar(h, n, 14), o = ar(h, n, 18), m = ar(n, h, 9), f = l ^ o ^ m;
  return f < 0 && (f += 4294967296), f;
}
function Fp(h, n) {
  var l = hr(h, n, 14), o = hr(h, n, 18), m = hr(n, h, 9), f = l ^ o ^ m;
  return f < 0 && (f += 4294967296), f;
}
function Lp(h, n) {
  var l = ar(h, n, 1), o = ar(h, n, 8), m = fo(h, n, 7), f = l ^ o ^ m;
  return f < 0 && (f += 4294967296), f;
}
function Op(h, n) {
  var l = hr(h, n, 1), o = hr(h, n, 8), m = ao(h, n, 7), f = l ^ o ^ m;
  return f < 0 && (f += 4294967296), f;
}
function Up(h, n) {
  var l = ar(h, n, 19), o = ar(n, h, 29), m = fo(h, n, 6), f = l ^ o ^ m;
  return f < 0 && (f += 4294967296), f;
}
function zp(h, n) {
  var l = hr(h, n, 19), o = hr(n, h, 29), m = ao(h, n, 6), f = l ^ o ^ m;
  return f < 0 && (f += 4294967296), f;
}
var r0 = Xt, oo = so;
function _r() {
  if (!(this instanceof _r))
    return new _r();
  oo.call(this), this.h = [
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
r0.inherits(_r, oo);
var Kp = _r;
_r.blockSize = 1024;
_r.outSize = 384;
_r.hmacStrength = 192;
_r.padLength = 128;
_r.prototype._digest = function(n) {
  return n === "hex" ? r0.toHex32(this.h.slice(0, 12), "big") : r0.split32(this.h.slice(0, 12), "big");
};
gi.sha1 = lp;
gi.sha224 = _p;
gi.sha256 = io;
gi.sha384 = Kp;
gi.sha512 = so;
var uo = {}, Vr = Xt, Hp = mi, an = Vr.rotl32, _a = Vr.sum32, ki = Vr.sum32_3, Sa = Vr.sum32_4, lo = Hp.BlockHash;
function dr() {
  if (!(this instanceof dr))
    return new dr();
  lo.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
}
Vr.inherits(dr, lo);
uo.ripemd160 = dr;
dr.blockSize = 512;
dr.outSize = 160;
dr.hmacStrength = 192;
dr.padLength = 64;
dr.prototype._update = function(n, l) {
  for (var o = this.h[0], m = this.h[1], f = this.h[2], b = this.h[3], w = this.h[4], _ = o, S = m, y = f, x = b, B = w, A = 0; A < 80; A++) {
    var T = _a(
      an(
        Sa(o, Aa(A, m, f, b), n[Vp[A] + l], Zp(A)),
        Jp[A]
      ),
      w
    );
    o = w, w = b, b = an(f, 10), f = m, m = T, T = _a(
      an(
        Sa(_, Aa(79 - A, S, y, x), n[Yp[A] + l], Wp(A)),
        Gp[A]
      ),
      B
    ), _ = B, B = x, x = an(y, 10), y = S, S = T;
  }
  T = ki(this.h[1], f, x), this.h[1] = ki(this.h[2], b, B), this.h[2] = ki(this.h[3], w, _), this.h[3] = ki(this.h[4], o, S), this.h[4] = ki(this.h[0], m, y), this.h[0] = T;
};
dr.prototype._digest = function(n) {
  return n === "hex" ? Vr.toHex32(this.h, "little") : Vr.split32(this.h, "little");
};
function Aa(h, n, l, o) {
  return h <= 15 ? n ^ l ^ o : h <= 31 ? n & l | ~n & o : h <= 47 ? (n | ~l) ^ o : h <= 63 ? n & o | l & ~o : n ^ (l | ~o);
}
function Zp(h) {
  return h <= 15 ? 0 : h <= 31 ? 1518500249 : h <= 47 ? 1859775393 : h <= 63 ? 2400959708 : 2840853838;
}
function Wp(h) {
  return h <= 15 ? 1352829926 : h <= 31 ? 1548603684 : h <= 47 ? 1836072691 : h <= 63 ? 2053994217 : 0;
}
var Vp = [
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
], Yp = [
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
], Jp = [
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
], Gp = [
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
], Xp = Xt, jp = Ke;
function si(h, n, l) {
  if (!(this instanceof si))
    return new si(h, n, l);
  this.Hash = h, this.blockSize = h.blockSize / 8, this.outSize = h.outSize / 8, this.inner = null, this.outer = null, this._init(Xp.toArray(n, l));
}
var Qp = si;
si.prototype._init = function(n) {
  n.length > this.blockSize && (n = new this.Hash().update(n).digest()), jp(n.length <= this.blockSize);
  for (var l = n.length; l < this.blockSize; l++)
    n.push(0);
  for (l = 0; l < n.length; l++)
    n[l] ^= 54;
  for (this.inner = new this.Hash().update(n), l = 0; l < n.length; l++)
    n[l] ^= 106;
  this.outer = new this.Hash().update(n);
};
si.prototype.update = function(n, l) {
  return this.inner.update(n, l), this;
};
si.prototype.digest = function(n) {
  return this.outer.update(this.inner.digest()), this.outer.digest(n);
};
(function(h) {
  var n = h;
  n.utils = Xt, n.common = mi, n.sha = gi, n.ripemd = uo, n.hmac = Qp, n.sha1 = n.sha.sha1, n.sha256 = n.sha.sha256, n.sha224 = n.sha.sha224, n.sha384 = n.sha.sha384, n.sha512 = n.sha.sha512, n.ripemd160 = n.ripemd.ripemd160;
})(Yn);
var _f, Ba;
function t2() {
  return Ba || (Ba = 1, _f = {
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
  }), _f;
}
(function(h) {
  var n = h, l = Yn, o = C0, m = Oe, f = m.assert;
  function b(S) {
    S.type === "short" ? this.curve = new o.short(S) : S.type === "edwards" ? this.curve = new o.edwards(S) : this.curve = new o.mont(S), this.g = this.curve.g, this.n = this.curve.n, this.hash = S.hash, f(this.g.validate(), "Invalid curve"), f(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
  }
  n.PresetCurve = b;
  function w(S, y) {
    Object.defineProperty(n, S, {
      configurable: !0,
      enumerable: !0,
      get: function() {
        var x = new b(y);
        return Object.defineProperty(n, S, {
          configurable: !0,
          enumerable: !0,
          value: x
        }), x;
      }
    });
  }
  w("p192", {
    type: "short",
    prime: "p192",
    p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
    a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
    b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
    n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
    hash: l.sha256,
    gRed: !1,
    g: [
      "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
      "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
    ]
  }), w("p224", {
    type: "short",
    prime: "p224",
    p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
    a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
    b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
    n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
    hash: l.sha256,
    gRed: !1,
    g: [
      "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
      "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
    ]
  }), w("p256", {
    type: "short",
    prime: null,
    p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
    a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
    b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
    n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
    hash: l.sha256,
    gRed: !1,
    g: [
      "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
      "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
    ]
  }), w("p384", {
    type: "short",
    prime: null,
    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
    a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
    b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
    n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
    hash: l.sha384,
    gRed: !1,
    g: [
      "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
      "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
    ]
  }), w("p521", {
    type: "short",
    prime: null,
    p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
    a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
    b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
    n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
    hash: l.sha512,
    gRed: !1,
    g: [
      "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
      "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
    ]
  }), w("curve25519", {
    type: "mont",
    prime: "p25519",
    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
    a: "76d06",
    b: "1",
    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
    hash: l.sha256,
    gRed: !1,
    g: [
      "9"
    ]
  }), w("ed25519", {
    type: "edwards",
    prime: "p25519",
    p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
    a: "-1",
    c: "1",
    // -121665 * (121666^(-1)) (mod P)
    d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
    n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
    hash: l.sha256,
    gRed: !1,
    g: [
      "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
      // 4/5
      "6666666666666666666666666666666666666666666666666666666666666658"
    ]
  });
  var _;
  try {
    _ = t2();
  } catch {
    _ = void 0;
  }
  w("secp256k1", {
    type: "short",
    prime: "k256",
    p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
    a: "0",
    b: "7",
    n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
    h: "1",
    hash: l.sha256,
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
      _
    ]
  });
})(Vn);
var e2 = Yn, Hr = T0, co = Ke;
function Tr(h) {
  if (!(this instanceof Tr))
    return new Tr(h);
  this.hash = h.hash, this.predResist = !!h.predResist, this.outLen = this.hash.outSize, this.minEntropy = h.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
  var n = Hr.toArray(h.entropy, h.entropyEnc || "hex"), l = Hr.toArray(h.nonce, h.nonceEnc || "hex"), o = Hr.toArray(h.pers, h.persEnc || "hex");
  co(
    n.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  ), this._init(n, l, o);
}
var r2 = Tr;
Tr.prototype._init = function(n, l, o) {
  var m = n.concat(l).concat(o);
  this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
  for (var f = 0; f < this.V.length; f++)
    this.K[f] = 0, this.V[f] = 1;
  this._update(m), this._reseed = 1, this.reseedInterval = 281474976710656;
};
Tr.prototype._hmac = function() {
  return new e2.hmac(this.hash, this.K);
};
Tr.prototype._update = function(n) {
  var l = this._hmac().update(this.V).update([0]);
  n && (l = l.update(n)), this.K = l.digest(), this.V = this._hmac().update(this.V).digest(), n && (this.K = this._hmac().update(this.V).update([1]).update(n).digest(), this.V = this._hmac().update(this.V).digest());
};
Tr.prototype.reseed = function(n, l, o, m) {
  typeof l != "string" && (m = o, o = l, l = null), n = Hr.toArray(n, l), o = Hr.toArray(o, m), co(
    n.length >= this.minEntropy / 8,
    "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
  ), this._update(n.concat(o || [])), this._reseed = 1;
};
Tr.prototype.generate = function(n, l, o, m) {
  if (this._reseed > this.reseedInterval)
    throw new Error("Reseed is required");
  typeof l != "string" && (m = o, o = l, l = null), o && (o = Hr.toArray(o, m || "hex"), this._update(o));
  for (var f = []; f.length < n; )
    this.V = this._hmac().update(this.V).digest(), f = f.concat(this.V);
  var b = f.slice(0, n);
  return this._update(o), this._reseed++, Hr.encode(b, l);
};
var i2 = Ar, n2 = Oe, i0 = n2.assert;
function Ce(h, n) {
  this.ec = h, this.priv = null, this.pub = null, n.priv && this._importPrivate(n.priv, n.privEnc), n.pub && this._importPublic(n.pub, n.pubEnc);
}
var f2 = Ce;
Ce.fromPublic = function(n, l, o) {
  return l instanceof Ce ? l : new Ce(n, {
    pub: l,
    pubEnc: o
  });
};
Ce.fromPrivate = function(n, l, o) {
  return l instanceof Ce ? l : new Ce(n, {
    priv: l,
    privEnc: o
  });
};
Ce.prototype.validate = function() {
  var n = this.getPublic();
  return n.isInfinity() ? { result: !1, reason: "Invalid public key" } : n.validate() ? n.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : { result: !1, reason: "Public key * N != O" } : { result: !1, reason: "Public key is not a point" };
};
Ce.prototype.getPublic = function(n, l) {
  return typeof n == "string" && (l = n, n = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), l ? this.pub.encode(l, n) : this.pub;
};
Ce.prototype.getPrivate = function(n) {
  return n === "hex" ? this.priv.toString(16, 2) : this.priv;
};
Ce.prototype._importPrivate = function(n, l) {
  this.priv = new i2(n, l || 16), this.priv = this.priv.umod(this.ec.curve.n);
};
Ce.prototype._importPublic = function(n, l) {
  if (n.x || n.y) {
    this.ec.curve.type === "mont" ? i0(n.x, "Need x coordinate") : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") && i0(n.x && n.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(n.x, n.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(n, l);
};
Ce.prototype.derive = function(n) {
  return n.validate() || i0(n.validate(), "public point not validated"), n.mul(this.priv).getX();
};
Ce.prototype.sign = function(n, l, o) {
  return this.ec.sign(n, this, l, o);
};
Ce.prototype.verify = function(n, l, o) {
  return this.ec.verify(n, l, this, void 0, o);
};
Ce.prototype.inspect = function() {
  return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
var xn = Ar, P0 = Oe, a2 = P0.assert;
function Gn(h, n) {
  if (h instanceof Gn)
    return h;
  this._importDER(h, n) || (a2(h.r && h.s, "Signature without r or s"), this.r = new xn(h.r, 16), this.s = new xn(h.s, 16), h.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = h.recoveryParam);
}
var h2 = Gn;
function s2() {
  this.place = 0;
}
function Sf(h, n) {
  var l = h[n.place++];
  if (!(l & 128))
    return l;
  var o = l & 15;
  if (o === 0 || o > 4 || h[n.place] === 0)
    return !1;
  for (var m = 0, f = 0, b = n.place; f < o; f++, b++)
    m <<= 8, m |= h[b], m >>>= 0;
  return m <= 127 ? !1 : (n.place = b, m);
}
function Ea(h) {
  for (var n = 0, l = h.length - 1; !h[n] && !(h[n + 1] & 128) && n < l; )
    n++;
  return n === 0 ? h : h.slice(n);
}
Gn.prototype._importDER = function(n, l) {
  n = P0.toArray(n, l);
  var o = new s2();
  if (n[o.place++] !== 48)
    return !1;
  var m = Sf(n, o);
  if (m === !1 || m + o.place !== n.length || n[o.place++] !== 2)
    return !1;
  var f = Sf(n, o);
  if (f === !1 || n[o.place] & 128)
    return !1;
  var b = n.slice(o.place, f + o.place);
  if (o.place += f, n[o.place++] !== 2)
    return !1;
  var w = Sf(n, o);
  if (w === !1 || n.length !== w + o.place || n[o.place] & 128)
    return !1;
  var _ = n.slice(o.place, w + o.place);
  if (b[0] === 0)
    if (b[1] & 128)
      b = b.slice(1);
    else
      return !1;
  if (_[0] === 0)
    if (_[1] & 128)
      _ = _.slice(1);
    else
      return !1;
  return this.r = new xn(b), this.s = new xn(_), this.recoveryParam = null, !0;
};
function Af(h, n) {
  if (n < 128) {
    h.push(n);
    return;
  }
  var l = 1 + (Math.log(n) / Math.LN2 >>> 3);
  for (h.push(l | 128); --l; )
    h.push(n >>> (l << 3) & 255);
  h.push(n);
}
Gn.prototype.toDER = function(n) {
  var l = this.r.toArray(), o = this.s.toArray();
  for (l[0] & 128 && (l = [0].concat(l)), o[0] & 128 && (o = [0].concat(o)), l = Ea(l), o = Ea(o); !o[0] && !(o[1] & 128); )
    o = o.slice(1);
  var m = [2];
  Af(m, l.length), m = m.concat(l), m.push(2), Af(m, o.length);
  var f = m.concat(o), b = [48];
  return Af(b, f.length), b = b.concat(f), P0.encode(b, n);
};
var Bf, ka;
function o2() {
  if (ka)
    return Bf;
  ka = 1;
  var h = Ar, n = r2, l = Oe, o = Vn, m = A0(), f = l.assert, b = f2, w = h2;
  function _(S) {
    if (!(this instanceof _))
      return new _(S);
    typeof S == "string" && (f(
      Object.prototype.hasOwnProperty.call(o, S),
      "Unknown curve " + S
    ), S = o[S]), S instanceof o.PresetCurve && (S = { curve: S }), this.curve = S.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = S.curve.g, this.g.precompute(S.curve.n.bitLength() + 1), this.hash = S.hash || S.curve.hash;
  }
  return Bf = _, _.prototype.keyPair = function(y) {
    return new b(this, y);
  }, _.prototype.keyFromPrivate = function(y, x) {
    return b.fromPrivate(this, y, x);
  }, _.prototype.keyFromPublic = function(y, x) {
    return b.fromPublic(this, y, x);
  }, _.prototype.genKeyPair = function(y) {
    y || (y = {});
    for (var x = new n({
      hash: this.hash,
      pers: y.pers,
      persEnc: y.persEnc || "utf8",
      entropy: y.entropy || m(this.hash.hmacStrength),
      entropyEnc: y.entropy && y.entropyEnc || "utf8",
      nonce: this.n.toArray()
    }), B = this.n.byteLength(), A = this.n.sub(new h(2)); ; ) {
      var T = new h(x.generate(B));
      if (!(T.cmp(A) > 0))
        return T.iaddn(1), this.keyFromPrivate(T);
    }
  }, _.prototype._truncateToN = function(y, x, B) {
    var A;
    if (h.isBN(y) || typeof y == "number")
      y = new h(y, 16), A = y.byteLength();
    else if (typeof y == "object")
      A = y.length, y = new h(y, 16);
    else {
      var T = y.toString();
      A = T.length + 1 >>> 1, y = new h(T, 16);
    }
    typeof B != "number" && (B = A * 8);
    var D = B - this.n.bitLength();
    return D > 0 && (y = y.ushrn(D)), !x && y.cmp(this.n) >= 0 ? y.sub(this.n) : y;
  }, _.prototype.sign = function(y, x, B, A) {
    if (typeof B == "object" && (A = B, B = null), A || (A = {}), typeof y != "string" && typeof y != "number" && !h.isBN(y)) {
      f(
        typeof y == "object" && y && typeof y.length == "number",
        "Expected message to be an array-like, a hex string, or a BN instance"
      ), f(y.length >>> 0 === y.length);
      for (var T = 0; T < y.length; T++)
        f((y[T] & 255) === y[T]);
    }
    x = this.keyFromPrivate(x, B), y = this._truncateToN(y, !1, A.msgBitLength), f(!y.isNeg(), "Can not sign a negative message");
    var D = this.n.byteLength(), O = x.getPrivate().toArray("be", D), N = y.toArray("be", D);
    f(new h(N).eq(y), "Can not sign message");
    for (var q = new n({
      hash: this.hash,
      entropy: O,
      nonce: N,
      pers: A.pers,
      persEnc: A.persEnc || "utf8"
    }), ft = this.n.sub(new h(1)), F = 0; ; F++) {
      var _t = A.k ? A.k(F) : new h(q.generate(this.n.byteLength()));
      if (_t = this._truncateToN(_t, !0), !(_t.cmpn(1) <= 0 || _t.cmp(ft) >= 0)) {
        var St = this.g.mul(_t);
        if (!St.isInfinity()) {
          var kt = St.getX(), At = kt.umod(this.n);
          if (At.cmpn(0) !== 0) {
            var U = _t.invm(this.n).mul(At.mul(x.getPrivate()).iadd(y));
            if (U = U.umod(this.n), U.cmpn(0) !== 0) {
              var Et = (St.getY().isOdd() ? 1 : 0) | (kt.cmp(At) !== 0 ? 2 : 0);
              return A.canonical && U.cmp(this.nh) > 0 && (U = this.n.sub(U), Et ^= 1), new w({ r: At, s: U, recoveryParam: Et });
            }
          }
        }
      }
    }
  }, _.prototype.verify = function(y, x, B, A, T) {
    T || (T = {}), y = this._truncateToN(y, !1, T.msgBitLength), B = this.keyFromPublic(B, A), x = new w(x, "hex");
    var D = x.r, O = x.s;
    if (D.cmpn(1) < 0 || D.cmp(this.n) >= 0 || O.cmpn(1) < 0 || O.cmp(this.n) >= 0)
      return !1;
    var N = O.invm(this.n), q = N.mul(y).umod(this.n), ft = N.mul(D).umod(this.n), F;
    return this.curve._maxwellTrick ? (F = this.g.jmulAdd(q, B.getPublic(), ft), F.isInfinity() ? !1 : F.eqXToP(D)) : (F = this.g.mulAdd(q, B.getPublic(), ft), F.isInfinity() ? !1 : F.getX().umod(this.n).cmp(D) === 0);
  }, _.prototype.recoverPubKey = function(S, y, x, B) {
    f((3 & x) === x, "The recovery param is more than two bits"), y = new w(y, B);
    var A = this.n, T = new h(S), D = y.r, O = y.s, N = x & 1, q = x >> 1;
    if (D.cmp(this.curve.p.umod(this.curve.n)) >= 0 && q)
      throw new Error("Unable to find sencond key candinate");
    q ? D = this.curve.pointFromX(D.add(this.curve.n), N) : D = this.curve.pointFromX(D, N);
    var ft = y.r.invm(A), F = A.sub(T).mul(ft).umod(A), _t = O.mul(ft).umod(A);
    return this.g.mulAdd(F, D, _t);
  }, _.prototype.getKeyRecoveryParam = function(S, y, x, B) {
    if (y = new w(y, B), y.recoveryParam !== null)
      return y.recoveryParam;
    for (var A = 0; A < 4; A++) {
      var T;
      try {
        T = this.recoverPubKey(S, y, A);
      } catch {
        continue;
      }
      if (T.eq(x))
        return A;
    }
    throw new Error("Unable to find valid recovery factor");
  }, Bf;
}
var Xi = Oe, vo = Xi.assert, Ra = Xi.parseBytes, yi = Xi.cachedProperty;
function _e(h, n) {
  this.eddsa = h, this._secret = Ra(n.secret), h.isPoint(n.pub) ? this._pub = n.pub : this._pubBytes = Ra(n.pub);
}
_e.fromPublic = function(n, l) {
  return l instanceof _e ? l : new _e(n, { pub: l });
};
_e.fromSecret = function(n, l) {
  return l instanceof _e ? l : new _e(n, { secret: l });
};
_e.prototype.secret = function() {
  return this._secret;
};
yi(_e, "pubBytes", function() {
  return this.eddsa.encodePoint(this.pub());
});
yi(_e, "pub", function() {
  return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
});
yi(_e, "privBytes", function() {
  var n = this.eddsa, l = this.hash(), o = n.encodingLength - 1, m = l.slice(0, n.encodingLength);
  return m[0] &= 248, m[o] &= 127, m[o] |= 64, m;
});
yi(_e, "priv", function() {
  return this.eddsa.decodeInt(this.privBytes());
});
yi(_e, "hash", function() {
  return this.eddsa.hash().update(this.secret()).digest();
});
yi(_e, "messagePrefix", function() {
  return this.hash().slice(this.eddsa.encodingLength);
});
_e.prototype.sign = function(n) {
  return vo(this._secret, "KeyPair can only verify"), this.eddsa.sign(n, this);
};
_e.prototype.verify = function(n, l) {
  return this.eddsa.verify(n, l, this);
};
_e.prototype.getSecret = function(n) {
  return vo(this._secret, "KeyPair is public only"), Xi.encode(this.secret(), n);
};
_e.prototype.getPublic = function(n) {
  return Xi.encode(this.pubBytes(), n);
};
var u2 = _e, l2 = Ar, Xn = Oe, Ia = Xn.assert, jn = Xn.cachedProperty, d2 = Xn.parseBytes;
function Xr(h, n) {
  this.eddsa = h, typeof n != "object" && (n = d2(n)), Array.isArray(n) && (Ia(n.length === h.encodingLength * 2, "Signature has invalid size"), n = {
    R: n.slice(0, h.encodingLength),
    S: n.slice(h.encodingLength)
  }), Ia(n.R && n.S, "Signature without R or S"), h.isPoint(n.R) && (this._R = n.R), n.S instanceof l2 && (this._S = n.S), this._Rencoded = Array.isArray(n.R) ? n.R : n.Rencoded, this._Sencoded = Array.isArray(n.S) ? n.S : n.Sencoded;
}
jn(Xr, "S", function() {
  return this.eddsa.decodeInt(this.Sencoded());
});
jn(Xr, "R", function() {
  return this.eddsa.decodePoint(this.Rencoded());
});
jn(Xr, "Rencoded", function() {
  return this.eddsa.encodePoint(this.R());
});
jn(Xr, "Sencoded", function() {
  return this.eddsa.encodeInt(this.S());
});
Xr.prototype.toBytes = function() {
  return this.Rencoded().concat(this.Sencoded());
};
Xr.prototype.toHex = function() {
  return Xn.encode(this.toBytes(), "hex").toUpperCase();
};
var c2 = Xr, v2 = Yn, p2 = Vn, oi = Oe, m2 = oi.assert, po = oi.parseBytes, mo = u2, Ta = c2;
function Ne(h) {
  if (m2(h === "ed25519", "only tested with ed25519 so far"), !(this instanceof Ne))
    return new Ne(h);
  h = p2[h].curve, this.curve = h, this.g = h.g, this.g.precompute(h.n.bitLength() + 1), this.pointClass = h.point().constructor, this.encodingLength = Math.ceil(h.n.bitLength() / 8), this.hash = v2.sha512;
}
var g2 = Ne;
Ne.prototype.sign = function(n, l) {
  n = po(n);
  var o = this.keyFromSecret(l), m = this.hashInt(o.messagePrefix(), n), f = this.g.mul(m), b = this.encodePoint(f), w = this.hashInt(b, o.pubBytes(), n).mul(o.priv()), _ = m.add(w).umod(this.curve.n);
  return this.makeSignature({ R: f, S: _, Rencoded: b });
};
Ne.prototype.verify = function(n, l, o) {
  if (n = po(n), l = this.makeSignature(l), l.S().gte(l.eddsa.curve.n) || l.S().isNeg())
    return !1;
  var m = this.keyFromPublic(o), f = this.hashInt(l.Rencoded(), m.pubBytes(), n), b = this.g.mul(l.S()), w = l.R().add(m.pub().mul(f));
  return w.eq(b);
};
Ne.prototype.hashInt = function() {
  for (var n = this.hash(), l = 0; l < arguments.length; l++)
    n.update(arguments[l]);
  return oi.intFromLE(n.digest()).umod(this.curve.n);
};
Ne.prototype.keyFromPublic = function(n) {
  return mo.fromPublic(this, n);
};
Ne.prototype.keyFromSecret = function(n) {
  return mo.fromSecret(this, n);
};
Ne.prototype.makeSignature = function(n) {
  return n instanceof Ta ? n : new Ta(this, n);
};
Ne.prototype.encodePoint = function(n) {
  var l = n.getY().toArray("le", this.encodingLength);
  return l[this.encodingLength - 1] |= n.getX().isOdd() ? 128 : 0, l;
};
Ne.prototype.decodePoint = function(n) {
  n = oi.parseBytes(n);
  var l = n.length - 1, o = n.slice(0, l).concat(n[l] & -129), m = (n[l] & 128) !== 0, f = oi.intFromLE(o);
  return this.curve.pointFromY(f, m);
};
Ne.prototype.encodeInt = function(n) {
  return n.toArray("le", this.encodingLength);
};
Ne.prototype.decodeInt = function(n) {
  return oi.intFromLE(n);
};
Ne.prototype.isPoint = function(n) {
  return n instanceof this.pointClass;
};
var Ca;
function D0() {
  return Ca || (Ca = 1, function(h) {
    var n = h;
    n.version = bv.version, n.utils = Oe, n.rand = A0(), n.curve = C0, n.curves = Vn, n.ec = o2(), n.eddsa = g2;
  }(yf)), yf;
}
var Qe = {}, Ef = {}, N0 = { exports: {} };
N0.exports;
(function(h) {
  (function(n, l) {
    function o(p, t) {
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
    typeof n == "object" ? n.exports = f : l.BN = f, f.BN = f, f.wordSize = 26;
    var b;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? b = window.Buffer : b = ge.Buffer;
    } catch {
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
      r === "hex" && (r = 16), o(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (o(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (o(typeof t.length == "number"), t.length <= 0)
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
    function w(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function _(p, t, r) {
      var i = w(p, r);
      return r - 1 >= t && (i |= w(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var s = t.length - r;
        for (a = s % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function S(p, t, r, i) {
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
      for (var c = t.length - i, v = c % a, s = Math.min(c, c - v) + i, e = 0, u = i; u < s; u += a)
        e = S(t, u, u + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var g = 1;
        for (e = S(t, u, t.length, r), u = 0; u < v; u++)
          g *= r;
        this.imuln(g), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    var y = [
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
    ], B = [
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
          var v = this.words[c], s = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = y[6 - s.length] + s + i : i = s + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], u = B[t];
        i = "";
        var g = this.clone();
        for (g.negative = 0; !g.isZero(); ) {
          var M = g.modn(u).toString(t);
          g = g.idivn(u), g.isZero() ? i = M + i : i = y[e - M.length] + M + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      o(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && o(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return o(typeof b < "u"), this.toArrayLike(b, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var a = this.byteLength(), d = i || Math.max(1, a);
      o(a <= d, "byte array longer than desired length"), o(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), s, e, u = this.clone();
      if (c) {
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[e] = s;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
          v[e] = 0;
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[d - e - 1] = s;
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
    function A(p) {
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
      return o((this.negative | t.negative) === 0), this.iuor(t);
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
      return o((this.negative | t.negative) === 0), this.iuand(t);
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
      return o((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      o(typeof t == "number" && t >= 0);
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
    function T(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, s = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var u = s >>> 26, g = s & 67108863, M = Math.min(e, t.length - 1), k = Math.max(0, e - p.length + 1); k <= M; k++) {
          var R = e - k | 0;
          a = p.words[R] | 0, d = t.words[k] | 0, c = a * d + g, u += c / 67108864 | 0, g = c & 67108863;
        }
        r.words[e] = g | 0, s = u | 0;
      }
      return s !== 0 ? r.words[e] = s | 0 : r.length--, r.strip();
    }
    var D = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, s, e, u, g = a[0] | 0, M = g & 8191, k = g >>> 13, R = a[1] | 0, P = R & 8191, E = R >>> 13, I = a[2] | 0, C = I & 8191, $ = I >>> 13, Bt = a[3] | 0, L = Bt & 8191, z = Bt >>> 13, Ct = a[4] | 0, H = Ct & 8191, st = Ct >>> 13, Dt = a[5] | 0, Z = Dt & 8191, ot = Dt >>> 13, qt = a[6] | 0, W = qt & 8191, ht = qt >>> 13, Rt = a[7] | 0, K = Rt & 8191, at = Rt >>> 13, $t = a[8] | 0, V = $t & 8191, lt = $t >>> 13, Ft = a[9] | 0, Y = Ft & 8191, dt = Ft >>> 13, Lt = d[0] | 0, J = Lt & 8191, ct = Lt >>> 13, Ot = d[1] | 0, G = Ot & 8191, vt = Ot >>> 13, Ut = d[2] | 0, X = Ut & 8191, pt = Ut >>> 13, zt = d[3] | 0, j = zt & 8191, mt = zt >>> 13, Kt = d[4] | 0, Q = Kt & 8191, gt = Kt >>> 13, Ht = d[5] | 0, tt = Ht & 8191, bt = Ht >>> 13, Zt = d[6] | 0, et = Zt & 8191, yt = Zt >>> 13, Wt = d[7] | 0, rt = Wt & 8191, wt = Wt >>> 13, Vt = d[8] | 0, it = Vt & 8191, Mt = Vt >>> 13, Yt = d[9] | 0, nt = Yt & 8191, xt = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, s = Math.imul(M, J), e = Math.imul(M, ct), e = e + Math.imul(k, J) | 0, u = Math.imul(k, ct);
      var It = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (It >>> 26) | 0, It &= 67108863, s = Math.imul(P, J), e = Math.imul(P, ct), e = e + Math.imul(E, J) | 0, u = Math.imul(E, ct), s = s + Math.imul(M, G) | 0, e = e + Math.imul(M, vt) | 0, e = e + Math.imul(k, G) | 0, u = u + Math.imul(k, vt) | 0;
      var Tt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Tt >>> 26) | 0, Tt &= 67108863, s = Math.imul(C, J), e = Math.imul(C, ct), e = e + Math.imul($, J) | 0, u = Math.imul($, ct), s = s + Math.imul(P, G) | 0, e = e + Math.imul(P, vt) | 0, e = e + Math.imul(E, G) | 0, u = u + Math.imul(E, vt) | 0, s = s + Math.imul(M, X) | 0, e = e + Math.imul(M, pt) | 0, e = e + Math.imul(k, X) | 0, u = u + Math.imul(k, pt) | 0;
      var jt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, s = Math.imul(L, J), e = Math.imul(L, ct), e = e + Math.imul(z, J) | 0, u = Math.imul(z, ct), s = s + Math.imul(C, G) | 0, e = e + Math.imul(C, vt) | 0, e = e + Math.imul($, G) | 0, u = u + Math.imul($, vt) | 0, s = s + Math.imul(P, X) | 0, e = e + Math.imul(P, pt) | 0, e = e + Math.imul(E, X) | 0, u = u + Math.imul(E, pt) | 0, s = s + Math.imul(M, j) | 0, e = e + Math.imul(M, mt) | 0, e = e + Math.imul(k, j) | 0, u = u + Math.imul(k, mt) | 0;
      var Qt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, s = Math.imul(H, J), e = Math.imul(H, ct), e = e + Math.imul(st, J) | 0, u = Math.imul(st, ct), s = s + Math.imul(L, G) | 0, e = e + Math.imul(L, vt) | 0, e = e + Math.imul(z, G) | 0, u = u + Math.imul(z, vt) | 0, s = s + Math.imul(C, X) | 0, e = e + Math.imul(C, pt) | 0, e = e + Math.imul($, X) | 0, u = u + Math.imul($, pt) | 0, s = s + Math.imul(P, j) | 0, e = e + Math.imul(P, mt) | 0, e = e + Math.imul(E, j) | 0, u = u + Math.imul(E, mt) | 0, s = s + Math.imul(M, Q) | 0, e = e + Math.imul(M, gt) | 0, e = e + Math.imul(k, Q) | 0, u = u + Math.imul(k, gt) | 0;
      var te = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, s = Math.imul(Z, J), e = Math.imul(Z, ct), e = e + Math.imul(ot, J) | 0, u = Math.imul(ot, ct), s = s + Math.imul(H, G) | 0, e = e + Math.imul(H, vt) | 0, e = e + Math.imul(st, G) | 0, u = u + Math.imul(st, vt) | 0, s = s + Math.imul(L, X) | 0, e = e + Math.imul(L, pt) | 0, e = e + Math.imul(z, X) | 0, u = u + Math.imul(z, pt) | 0, s = s + Math.imul(C, j) | 0, e = e + Math.imul(C, mt) | 0, e = e + Math.imul($, j) | 0, u = u + Math.imul($, mt) | 0, s = s + Math.imul(P, Q) | 0, e = e + Math.imul(P, gt) | 0, e = e + Math.imul(E, Q) | 0, u = u + Math.imul(E, gt) | 0, s = s + Math.imul(M, tt) | 0, e = e + Math.imul(M, bt) | 0, e = e + Math.imul(k, tt) | 0, u = u + Math.imul(k, bt) | 0;
      var ee = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, s = Math.imul(W, J), e = Math.imul(W, ct), e = e + Math.imul(ht, J) | 0, u = Math.imul(ht, ct), s = s + Math.imul(Z, G) | 0, e = e + Math.imul(Z, vt) | 0, e = e + Math.imul(ot, G) | 0, u = u + Math.imul(ot, vt) | 0, s = s + Math.imul(H, X) | 0, e = e + Math.imul(H, pt) | 0, e = e + Math.imul(st, X) | 0, u = u + Math.imul(st, pt) | 0, s = s + Math.imul(L, j) | 0, e = e + Math.imul(L, mt) | 0, e = e + Math.imul(z, j) | 0, u = u + Math.imul(z, mt) | 0, s = s + Math.imul(C, Q) | 0, e = e + Math.imul(C, gt) | 0, e = e + Math.imul($, Q) | 0, u = u + Math.imul($, gt) | 0, s = s + Math.imul(P, tt) | 0, e = e + Math.imul(P, bt) | 0, e = e + Math.imul(E, tt) | 0, u = u + Math.imul(E, bt) | 0, s = s + Math.imul(M, et) | 0, e = e + Math.imul(M, yt) | 0, e = e + Math.imul(k, et) | 0, u = u + Math.imul(k, yt) | 0;
      var re = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, s = Math.imul(K, J), e = Math.imul(K, ct), e = e + Math.imul(at, J) | 0, u = Math.imul(at, ct), s = s + Math.imul(W, G) | 0, e = e + Math.imul(W, vt) | 0, e = e + Math.imul(ht, G) | 0, u = u + Math.imul(ht, vt) | 0, s = s + Math.imul(Z, X) | 0, e = e + Math.imul(Z, pt) | 0, e = e + Math.imul(ot, X) | 0, u = u + Math.imul(ot, pt) | 0, s = s + Math.imul(H, j) | 0, e = e + Math.imul(H, mt) | 0, e = e + Math.imul(st, j) | 0, u = u + Math.imul(st, mt) | 0, s = s + Math.imul(L, Q) | 0, e = e + Math.imul(L, gt) | 0, e = e + Math.imul(z, Q) | 0, u = u + Math.imul(z, gt) | 0, s = s + Math.imul(C, tt) | 0, e = e + Math.imul(C, bt) | 0, e = e + Math.imul($, tt) | 0, u = u + Math.imul($, bt) | 0, s = s + Math.imul(P, et) | 0, e = e + Math.imul(P, yt) | 0, e = e + Math.imul(E, et) | 0, u = u + Math.imul(E, yt) | 0, s = s + Math.imul(M, rt) | 0, e = e + Math.imul(M, wt) | 0, e = e + Math.imul(k, rt) | 0, u = u + Math.imul(k, wt) | 0;
      var ie = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, s = Math.imul(V, J), e = Math.imul(V, ct), e = e + Math.imul(lt, J) | 0, u = Math.imul(lt, ct), s = s + Math.imul(K, G) | 0, e = e + Math.imul(K, vt) | 0, e = e + Math.imul(at, G) | 0, u = u + Math.imul(at, vt) | 0, s = s + Math.imul(W, X) | 0, e = e + Math.imul(W, pt) | 0, e = e + Math.imul(ht, X) | 0, u = u + Math.imul(ht, pt) | 0, s = s + Math.imul(Z, j) | 0, e = e + Math.imul(Z, mt) | 0, e = e + Math.imul(ot, j) | 0, u = u + Math.imul(ot, mt) | 0, s = s + Math.imul(H, Q) | 0, e = e + Math.imul(H, gt) | 0, e = e + Math.imul(st, Q) | 0, u = u + Math.imul(st, gt) | 0, s = s + Math.imul(L, tt) | 0, e = e + Math.imul(L, bt) | 0, e = e + Math.imul(z, tt) | 0, u = u + Math.imul(z, bt) | 0, s = s + Math.imul(C, et) | 0, e = e + Math.imul(C, yt) | 0, e = e + Math.imul($, et) | 0, u = u + Math.imul($, yt) | 0, s = s + Math.imul(P, rt) | 0, e = e + Math.imul(P, wt) | 0, e = e + Math.imul(E, rt) | 0, u = u + Math.imul(E, wt) | 0, s = s + Math.imul(M, it) | 0, e = e + Math.imul(M, Mt) | 0, e = e + Math.imul(k, it) | 0, u = u + Math.imul(k, Mt) | 0;
      var ne = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, s = Math.imul(Y, J), e = Math.imul(Y, ct), e = e + Math.imul(dt, J) | 0, u = Math.imul(dt, ct), s = s + Math.imul(V, G) | 0, e = e + Math.imul(V, vt) | 0, e = e + Math.imul(lt, G) | 0, u = u + Math.imul(lt, vt) | 0, s = s + Math.imul(K, X) | 0, e = e + Math.imul(K, pt) | 0, e = e + Math.imul(at, X) | 0, u = u + Math.imul(at, pt) | 0, s = s + Math.imul(W, j) | 0, e = e + Math.imul(W, mt) | 0, e = e + Math.imul(ht, j) | 0, u = u + Math.imul(ht, mt) | 0, s = s + Math.imul(Z, Q) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(ot, Q) | 0, u = u + Math.imul(ot, gt) | 0, s = s + Math.imul(H, tt) | 0, e = e + Math.imul(H, bt) | 0, e = e + Math.imul(st, tt) | 0, u = u + Math.imul(st, bt) | 0, s = s + Math.imul(L, et) | 0, e = e + Math.imul(L, yt) | 0, e = e + Math.imul(z, et) | 0, u = u + Math.imul(z, yt) | 0, s = s + Math.imul(C, rt) | 0, e = e + Math.imul(C, wt) | 0, e = e + Math.imul($, rt) | 0, u = u + Math.imul($, wt) | 0, s = s + Math.imul(P, it) | 0, e = e + Math.imul(P, Mt) | 0, e = e + Math.imul(E, it) | 0, u = u + Math.imul(E, Mt) | 0, s = s + Math.imul(M, nt) | 0, e = e + Math.imul(M, xt) | 0, e = e + Math.imul(k, nt) | 0, u = u + Math.imul(k, xt) | 0;
      var fe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, s = Math.imul(Y, G), e = Math.imul(Y, vt), e = e + Math.imul(dt, G) | 0, u = Math.imul(dt, vt), s = s + Math.imul(V, X) | 0, e = e + Math.imul(V, pt) | 0, e = e + Math.imul(lt, X) | 0, u = u + Math.imul(lt, pt) | 0, s = s + Math.imul(K, j) | 0, e = e + Math.imul(K, mt) | 0, e = e + Math.imul(at, j) | 0, u = u + Math.imul(at, mt) | 0, s = s + Math.imul(W, Q) | 0, e = e + Math.imul(W, gt) | 0, e = e + Math.imul(ht, Q) | 0, u = u + Math.imul(ht, gt) | 0, s = s + Math.imul(Z, tt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(ot, tt) | 0, u = u + Math.imul(ot, bt) | 0, s = s + Math.imul(H, et) | 0, e = e + Math.imul(H, yt) | 0, e = e + Math.imul(st, et) | 0, u = u + Math.imul(st, yt) | 0, s = s + Math.imul(L, rt) | 0, e = e + Math.imul(L, wt) | 0, e = e + Math.imul(z, rt) | 0, u = u + Math.imul(z, wt) | 0, s = s + Math.imul(C, it) | 0, e = e + Math.imul(C, Mt) | 0, e = e + Math.imul($, it) | 0, u = u + Math.imul($, Mt) | 0, s = s + Math.imul(P, nt) | 0, e = e + Math.imul(P, xt) | 0, e = e + Math.imul(E, nt) | 0, u = u + Math.imul(E, xt) | 0;
      var ae = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, s = Math.imul(Y, X), e = Math.imul(Y, pt), e = e + Math.imul(dt, X) | 0, u = Math.imul(dt, pt), s = s + Math.imul(V, j) | 0, e = e + Math.imul(V, mt) | 0, e = e + Math.imul(lt, j) | 0, u = u + Math.imul(lt, mt) | 0, s = s + Math.imul(K, Q) | 0, e = e + Math.imul(K, gt) | 0, e = e + Math.imul(at, Q) | 0, u = u + Math.imul(at, gt) | 0, s = s + Math.imul(W, tt) | 0, e = e + Math.imul(W, bt) | 0, e = e + Math.imul(ht, tt) | 0, u = u + Math.imul(ht, bt) | 0, s = s + Math.imul(Z, et) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(ot, et) | 0, u = u + Math.imul(ot, yt) | 0, s = s + Math.imul(H, rt) | 0, e = e + Math.imul(H, wt) | 0, e = e + Math.imul(st, rt) | 0, u = u + Math.imul(st, wt) | 0, s = s + Math.imul(L, it) | 0, e = e + Math.imul(L, Mt) | 0, e = e + Math.imul(z, it) | 0, u = u + Math.imul(z, Mt) | 0, s = s + Math.imul(C, nt) | 0, e = e + Math.imul(C, xt) | 0, e = e + Math.imul($, nt) | 0, u = u + Math.imul($, xt) | 0;
      var he = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, s = Math.imul(Y, j), e = Math.imul(Y, mt), e = e + Math.imul(dt, j) | 0, u = Math.imul(dt, mt), s = s + Math.imul(V, Q) | 0, e = e + Math.imul(V, gt) | 0, e = e + Math.imul(lt, Q) | 0, u = u + Math.imul(lt, gt) | 0, s = s + Math.imul(K, tt) | 0, e = e + Math.imul(K, bt) | 0, e = e + Math.imul(at, tt) | 0, u = u + Math.imul(at, bt) | 0, s = s + Math.imul(W, et) | 0, e = e + Math.imul(W, yt) | 0, e = e + Math.imul(ht, et) | 0, u = u + Math.imul(ht, yt) | 0, s = s + Math.imul(Z, rt) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(ot, rt) | 0, u = u + Math.imul(ot, wt) | 0, s = s + Math.imul(H, it) | 0, e = e + Math.imul(H, Mt) | 0, e = e + Math.imul(st, it) | 0, u = u + Math.imul(st, Mt) | 0, s = s + Math.imul(L, nt) | 0, e = e + Math.imul(L, xt) | 0, e = e + Math.imul(z, nt) | 0, u = u + Math.imul(z, xt) | 0;
      var se = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, s = Math.imul(Y, Q), e = Math.imul(Y, gt), e = e + Math.imul(dt, Q) | 0, u = Math.imul(dt, gt), s = s + Math.imul(V, tt) | 0, e = e + Math.imul(V, bt) | 0, e = e + Math.imul(lt, tt) | 0, u = u + Math.imul(lt, bt) | 0, s = s + Math.imul(K, et) | 0, e = e + Math.imul(K, yt) | 0, e = e + Math.imul(at, et) | 0, u = u + Math.imul(at, yt) | 0, s = s + Math.imul(W, rt) | 0, e = e + Math.imul(W, wt) | 0, e = e + Math.imul(ht, rt) | 0, u = u + Math.imul(ht, wt) | 0, s = s + Math.imul(Z, it) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(ot, it) | 0, u = u + Math.imul(ot, Mt) | 0, s = s + Math.imul(H, nt) | 0, e = e + Math.imul(H, xt) | 0, e = e + Math.imul(st, nt) | 0, u = u + Math.imul(st, xt) | 0;
      var oe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, s = Math.imul(Y, tt), e = Math.imul(Y, bt), e = e + Math.imul(dt, tt) | 0, u = Math.imul(dt, bt), s = s + Math.imul(V, et) | 0, e = e + Math.imul(V, yt) | 0, e = e + Math.imul(lt, et) | 0, u = u + Math.imul(lt, yt) | 0, s = s + Math.imul(K, rt) | 0, e = e + Math.imul(K, wt) | 0, e = e + Math.imul(at, rt) | 0, u = u + Math.imul(at, wt) | 0, s = s + Math.imul(W, it) | 0, e = e + Math.imul(W, Mt) | 0, e = e + Math.imul(ht, it) | 0, u = u + Math.imul(ht, Mt) | 0, s = s + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(ot, nt) | 0, u = u + Math.imul(ot, xt) | 0;
      var ue = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, s = Math.imul(Y, et), e = Math.imul(Y, yt), e = e + Math.imul(dt, et) | 0, u = Math.imul(dt, yt), s = s + Math.imul(V, rt) | 0, e = e + Math.imul(V, wt) | 0, e = e + Math.imul(lt, rt) | 0, u = u + Math.imul(lt, wt) | 0, s = s + Math.imul(K, it) | 0, e = e + Math.imul(K, Mt) | 0, e = e + Math.imul(at, it) | 0, u = u + Math.imul(at, Mt) | 0, s = s + Math.imul(W, nt) | 0, e = e + Math.imul(W, xt) | 0, e = e + Math.imul(ht, nt) | 0, u = u + Math.imul(ht, xt) | 0;
      var le = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, s = Math.imul(Y, rt), e = Math.imul(Y, wt), e = e + Math.imul(dt, rt) | 0, u = Math.imul(dt, wt), s = s + Math.imul(V, it) | 0, e = e + Math.imul(V, Mt) | 0, e = e + Math.imul(lt, it) | 0, u = u + Math.imul(lt, Mt) | 0, s = s + Math.imul(K, nt) | 0, e = e + Math.imul(K, xt) | 0, e = e + Math.imul(at, nt) | 0, u = u + Math.imul(at, xt) | 0;
      var de = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, s = Math.imul(Y, it), e = Math.imul(Y, Mt), e = e + Math.imul(dt, it) | 0, u = Math.imul(dt, Mt), s = s + Math.imul(V, nt) | 0, e = e + Math.imul(V, xt) | 0, e = e + Math.imul(lt, nt) | 0, u = u + Math.imul(lt, xt) | 0;
      var ce = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, s = Math.imul(Y, nt), e = Math.imul(Y, xt), e = e + Math.imul(dt, nt) | 0, u = Math.imul(dt, xt);
      var ve = (v + s | 0) + ((e & 8191) << 13) | 0;
      return v = (u + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = It, c[1] = Tt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (D = T);
    function O(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, s = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= s; e++) {
          var u = d - e, g = p.words[u] | 0, M = t.words[e] | 0, k = g * M, R = k & 67108863;
          c = c + (k / 67108864 | 0) | 0, R = R + v | 0, v = R & 67108863, c = c + (R >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function N(p, t, r) {
      var i = new q();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = D(this, t, r) : a < 63 ? i = T(this, t, r) : a < 1024 ? i = O(this, t, r) : i = N(this, t, r), i;
    };
    function q(p, t) {
      this.x = p, this.y = t;
    }
    q.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, q.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, q.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, q.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var s = v << 1, e = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), g = 0; g < d; g += s)
          for (var M = e, k = u, R = 0; R < v; R++) {
            var P = i[g + R], E = a[g + R], I = i[g + R + v], C = a[g + R + v], $ = M * I - k * C;
            C = M * C + k * I, I = $, i[g + R] = P + I, a[g + R] = E + C, i[g + R + v] = P - I, a[g + R + v] = E - C, R !== s && ($ = e * M - u * k, k = e * k + u * M, M = $);
          }
    }, q.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, q.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, q.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, q.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      o(d === 0), o((d & -8192) === 0);
    }, q.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, q.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), s = new Array(a), e = new Array(a), u = new Array(a), g = new Array(a), M = new Array(a), k = i.words;
      k.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, u, a), this.transform(v, c, s, e, a, d), this.transform(u, c, g, M, a, d);
      for (var R = 0; R < a; R++) {
        var P = s[R] * g[R] - e[R] * M[R];
        e[R] = s[R] * M[R] + e[R] * g[R], s[R] = P;
      }
      return this.conjugate(s, e, a), this.transform(s, e, k, c, a, d), this.conjugate(k, c, a), this.normalize13b(k, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), N(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      o(typeof t == "number"), o(t < 67108864);
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
      var r = A(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, s = (this.words[d] | 0) - v << r;
          this.words[d] = s | c, c = v >>> 26 - r;
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
      return o(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      o(typeof t == "number" && t >= 0);
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, s = i;
      if (a -= c, a = Math.max(0, a), s) {
        for (var e = 0; e < c; e++)
          s.words[e] = this.words[e];
        s.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var u = 0;
      for (e = this.length - 1; e >= 0 && (u !== 0 || e >= a); e--) {
        var g = this.words[e] | 0;
        this.words[e] = u << 26 - d | g >>> d, u = g & v;
      }
      return s && u !== 0 && (s.words[s.length++] = u), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return o(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (o(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return o(typeof t == "number"), o(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (o(typeof t == "number"), o(t < 67108864), t < 0)
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
        var s = (t.words[d] | 0) * r;
        c -= s & 67108863, v = (c >> 26) - (s / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (o(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var s = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = s + 1, e.words = new Array(e.length);
        for (var u = 0; u < e.length; u++)
          e.words[u] = 0;
      }
      var g = a.clone()._ishlnsubmul(d, 1, s);
      g.negative === 0 && (a = g, e && (e.words[s] = 1));
      for (var M = s - 1; M >= 0; M--) {
        var k = (a.words[d.length + M] | 0) * 67108864 + (a.words[d.length + M - 1] | 0);
        for (k = Math.min(k / c | 0, 67108863), a._ishlnsubmul(d, k, M); a.negative !== 0; )
          k--, a.negative = 0, a._ishlnsubmul(d, 1, M), a.isZero() || (a.negative ^= 1);
        e && (e.words[M] = k);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (o(!t.isZero()), this.isZero())
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
      o(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      o(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), s = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++s;
      for (var e = i.clone(), u = r.clone(); !r.isZero(); ) {
        for (var g = 0, M = 1; !(r.words[0] & M) && g < 26; ++g, M <<= 1)
          ;
        if (g > 0)
          for (r.iushrn(g); g-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(u)), a.iushrn(1), d.iushrn(1);
        for (var k = 0, R = 1; !(i.words[0] & R) && k < 26; ++k, R <<= 1)
          ;
        if (k > 0)
          for (i.iushrn(k); k-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(u)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(s)
      };
    }, f.prototype._invmp = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, s = 1; !(r.words[0] & s) && v < 26; ++v, s <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, u = 1; !(i.words[0] & u) && e < 26; ++e, u <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var g;
      return r.cmpn(1) === 0 ? g = a : g = d, g.cmpn(0) < 0 && g.iadd(t), g;
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
      o(typeof t == "number");
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
        r && (t = -t), o(t <= 67108863, "Number is too big");
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
      return new U(t);
    }, f.prototype.toRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), o(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return o(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return o(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return o(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return o(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return o(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return o(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return o(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return o(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return o(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return o(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return o(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return o(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var ft = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function F(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    F.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, F.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, F.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, F.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function _t() {
      F.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(_t, F), _t.prototype.split = function(t, r) {
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
    }, _t.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function St() {
      F.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(St, F);
    function kt() {
      F.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(kt, F);
    function At() {
      F.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(At, F), At.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (ft[t])
        return ft[t];
      var r;
      if (t === "k256")
        r = new _t();
      else if (t === "p224")
        r = new St();
      else if (t === "p192")
        r = new kt();
      else if (t === "p25519")
        r = new At();
      else
        throw new Error("Unknown prime " + t);
      return ft[t] = r, r;
    };
    function U(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        o(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    U.prototype._verify1 = function(t) {
      o(t.negative === 0, "red works only with positives"), o(t.red, "red works only with red numbers");
    }, U.prototype._verify2 = function(t, r) {
      o((t.negative | r.negative) === 0, "red works only with positives"), o(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, U.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, U.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, U.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, U.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, U.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, U.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, U.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, U.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, U.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, U.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, U.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, U.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (o(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      o(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), s = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, s).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var u = this.pow(e, a), g = this.pow(t, a.addn(1).iushrn(1)), M = this.pow(t, a), k = d; M.cmp(c) !== 0; ) {
        for (var R = M, P = 0; R.cmp(c) !== 0; P++)
          R = R.redSqr();
        o(P < k);
        var E = this.pow(u, new f(1).iushln(k - P - 1));
        g = g.redMul(E), u = E.redSqr(), M = M.redMul(u), k = P;
      }
      return g;
    }, U.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, U.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, s = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var u = r.words[d], g = e - 1; g >= 0; g--) {
          var M = u >> g & 1;
          if (c !== a[0] && (c = this.sqr(c)), M === 0 && v === 0) {
            s = 0;
            continue;
          }
          v <<= 1, v |= M, s++, !(s !== i && (d !== 0 || g !== 0)) && (c = this.mul(c, a[v]), s = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, U.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, U.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new Et(t);
    };
    function Et(p) {
      U.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(Et, U), Et.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, Et.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, Et.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(N0);
var b2 = N0.exports, kf = {}, qa;
function y2() {
  return qa || (qa = 1, function(h) {
    var n = ji(), l = Jt, o = h;
    o.define = function(b, w) {
      return new m(b, w);
    };
    function m(f, b) {
      this.name = f, this.body = b, this.decoders = {}, this.encoders = {};
    }
    m.prototype._createNamed = function(b) {
      var w;
      try {
        w = ge.runInThisContext(
          "(function " + this.name + `(entity) {
  this._initNamed(entity);
})`
        );
      } catch {
        w = function(S) {
          this._initNamed(S);
        };
      }
      return l(w, b), w.prototype._initNamed = function(S) {
        b.call(this, S);
      }, new w(this);
    }, m.prototype._getDecoder = function(b) {
      return b = b || "der", this.decoders.hasOwnProperty(b) || (this.decoders[b] = this._createNamed(n.decoders[b])), this.decoders[b];
    }, m.prototype.decode = function(b, w, _) {
      return this._getDecoder(w).decode(b, _);
    }, m.prototype._getEncoder = function(b) {
      return b = b || "der", this.encoders.hasOwnProperty(b) || (this.encoders[b] = this._createNamed(n.encoders[b])), this.encoders[b];
    }, m.prototype.encode = function(b, w, _) {
      return this._getEncoder(w).encode(b, _);
    };
  }(kf)), kf;
}
var Rf = {}, go = {}, w2 = Jt;
function Ve(h) {
  this._reporterState = {
    obj: null,
    path: [],
    options: h || {},
    errors: []
  };
}
go.Reporter = Ve;
Ve.prototype.isError = function(n) {
  return n instanceof ui;
};
Ve.prototype.save = function() {
  var n = this._reporterState;
  return { obj: n.obj, pathLen: n.path.length };
};
Ve.prototype.restore = function(n) {
  var l = this._reporterState;
  l.obj = n.obj, l.path = l.path.slice(0, n.pathLen);
};
Ve.prototype.enterKey = function(n) {
  return this._reporterState.path.push(n);
};
Ve.prototype.exitKey = function(n) {
  var l = this._reporterState;
  l.path = l.path.slice(0, n - 1);
};
Ve.prototype.leaveKey = function(n, l, o) {
  var m = this._reporterState;
  this.exitKey(n), m.obj !== null && (m.obj[l] = o);
};
Ve.prototype.path = function() {
  return this._reporterState.path.join("/");
};
Ve.prototype.enterObject = function() {
  var n = this._reporterState, l = n.obj;
  return n.obj = {}, l;
};
Ve.prototype.leaveObject = function(n) {
  var l = this._reporterState, o = l.obj;
  return l.obj = n, o;
};
Ve.prototype.error = function(n) {
  var l, o = this._reporterState, m = n instanceof ui;
  if (m ? l = n : l = new ui(o.path.map(function(f) {
    return "[" + JSON.stringify(f) + "]";
  }).join(""), n.message || n, n.stack), !o.options.partial)
    throw l;
  return m || o.errors.push(l), l;
};
Ve.prototype.wrapResult = function(n) {
  var l = this._reporterState;
  return l.options.partial ? {
    result: this.isError(n) ? null : n,
    errors: l.errors
  } : n;
};
function ui(h, n) {
  this.path = h, this.rethrow(n);
}
w2(ui, Error);
ui.prototype.rethrow = function(n) {
  if (this.message = n + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, ui), !this.stack)
    try {
      throw new Error(this.message);
    } catch (l) {
      this.stack = l.stack;
    }
  return this;
};
var hn = {}, Pa;
function Da() {
  if (Pa)
    return hn;
  Pa = 1;
  var h = Jt, n = qi().Reporter, l = ge.Buffer;
  function o(f, b) {
    if (n.call(this, b), !l.isBuffer(f)) {
      this.error("Input not Buffer");
      return;
    }
    this.base = f, this.offset = 0, this.length = f.length;
  }
  h(o, n), hn.DecoderBuffer = o, o.prototype.save = function() {
    return { offset: this.offset, reporter: n.prototype.save.call(this) };
  }, o.prototype.restore = function(b) {
    var w = new o(this.base);
    return w.offset = b.offset, w.length = this.offset, this.offset = b.offset, n.prototype.restore.call(this, b.reporter), w;
  }, o.prototype.isEmpty = function() {
    return this.offset === this.length;
  }, o.prototype.readUInt8 = function(b) {
    return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(b || "DecoderBuffer overrun");
  }, o.prototype.skip = function(b, w) {
    if (!(this.offset + b <= this.length))
      return this.error(w || "DecoderBuffer overrun");
    var _ = new o(this.base);
    return _._reporterState = this._reporterState, _.offset = this.offset, _.length = this.offset + b, this.offset += b, _;
  }, o.prototype.raw = function(b) {
    return this.base.slice(b ? b.offset : this.offset, this.length);
  };
  function m(f, b) {
    if (Array.isArray(f))
      this.length = 0, this.value = f.map(function(w) {
        return w instanceof m || (w = new m(w, b)), this.length += w.length, w;
      }, this);
    else if (typeof f == "number") {
      if (!(0 <= f && f <= 255))
        return b.error("non-byte EncoderBuffer value");
      this.value = f, this.length = 1;
    } else if (typeof f == "string")
      this.value = f, this.length = l.byteLength(f);
    else if (l.isBuffer(f))
      this.value = f, this.length = f.length;
    else
      return b.error("Unsupported type: " + typeof f);
  }
  return hn.EncoderBuffer = m, m.prototype.join = function(b, w) {
    return b || (b = new l(this.length)), w || (w = 0), this.length === 0 || (Array.isArray(this.value) ? this.value.forEach(function(_) {
      _.join(b, w), w += _.length;
    }) : (typeof this.value == "number" ? b[w] = this.value : typeof this.value == "string" ? b.write(this.value, w) : l.isBuffer(this.value) && this.value.copy(b, w), w += this.length)), b;
  }, hn;
}
var If, Na;
function M2() {
  if (Na)
    return If;
  Na = 1;
  var h = qi().Reporter, n = qi().EncoderBuffer, l = qi().DecoderBuffer, o = Ke, m = [
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
  ].concat(m), b = [
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
  function w(S, y) {
    var x = {};
    this._baseState = x, x.enc = S, x.parent = y || null, x.children = null, x.tag = null, x.args = null, x.reverseArgs = null, x.choice = null, x.optional = !1, x.any = !1, x.obj = !1, x.use = null, x.useDecoder = null, x.key = null, x.default = null, x.explicit = null, x.implicit = null, x.contains = null, x.parent || (x.children = [], this._wrap());
  }
  If = w;
  var _ = [
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
  return w.prototype.clone = function() {
    var y = this._baseState, x = {};
    _.forEach(function(A) {
      x[A] = y[A];
    });
    var B = new this.constructor(x.parent);
    return B._baseState = x, B;
  }, w.prototype._wrap = function() {
    var y = this._baseState;
    f.forEach(function(x) {
      this[x] = function() {
        var A = new this.constructor(this);
        return y.children.push(A), A[x].apply(A, arguments);
      };
    }, this);
  }, w.prototype._init = function(y) {
    var x = this._baseState;
    o(x.parent === null), y.call(this), x.children = x.children.filter(function(B) {
      return B._baseState.parent === this;
    }, this), o.equal(x.children.length, 1, "Root node can have only one child");
  }, w.prototype._useArgs = function(y) {
    var x = this._baseState, B = y.filter(function(A) {
      return A instanceof this.constructor;
    }, this);
    y = y.filter(function(A) {
      return !(A instanceof this.constructor);
    }, this), B.length !== 0 && (o(x.children === null), x.children = B, B.forEach(function(A) {
      A._baseState.parent = this;
    }, this)), y.length !== 0 && (o(x.args === null), x.args = y, x.reverseArgs = y.map(function(A) {
      if (typeof A != "object" || A.constructor !== Object)
        return A;
      var T = {};
      return Object.keys(A).forEach(function(D) {
        D == (D | 0) && (D |= 0);
        var O = A[D];
        T[O] = D;
      }), T;
    }));
  }, b.forEach(function(S) {
    w.prototype[S] = function() {
      var x = this._baseState;
      throw new Error(S + " not implemented for encoding: " + x.enc);
    };
  }), m.forEach(function(S) {
    w.prototype[S] = function() {
      var x = this._baseState, B = Array.prototype.slice.call(arguments);
      return o(x.tag === null), x.tag = S, this._useArgs(B), this;
    };
  }), w.prototype.use = function(y) {
    o(y);
    var x = this._baseState;
    return o(x.use === null), x.use = y, this;
  }, w.prototype.optional = function() {
    var y = this._baseState;
    return y.optional = !0, this;
  }, w.prototype.def = function(y) {
    var x = this._baseState;
    return o(x.default === null), x.default = y, x.optional = !0, this;
  }, w.prototype.explicit = function(y) {
    var x = this._baseState;
    return o(x.explicit === null && x.implicit === null), x.explicit = y, this;
  }, w.prototype.implicit = function(y) {
    var x = this._baseState;
    return o(x.explicit === null && x.implicit === null), x.implicit = y, this;
  }, w.prototype.obj = function() {
    var y = this._baseState, x = Array.prototype.slice.call(arguments);
    return y.obj = !0, x.length !== 0 && this._useArgs(x), this;
  }, w.prototype.key = function(y) {
    var x = this._baseState;
    return o(x.key === null), x.key = y, this;
  }, w.prototype.any = function() {
    var y = this._baseState;
    return y.any = !0, this;
  }, w.prototype.choice = function(y) {
    var x = this._baseState;
    return o(x.choice === null), x.choice = y, this._useArgs(Object.keys(y).map(function(B) {
      return y[B];
    })), this;
  }, w.prototype.contains = function(y) {
    var x = this._baseState;
    return o(x.use === null), x.contains = y, this;
  }, w.prototype._decode = function(y, x) {
    var B = this._baseState;
    if (B.parent === null)
      return y.wrapResult(B.children[0]._decode(y, x));
    var A = B.default, T = !0, D = null;
    if (B.key !== null && (D = y.enterKey(B.key)), B.optional) {
      var O = null;
      if (B.explicit !== null ? O = B.explicit : B.implicit !== null ? O = B.implicit : B.tag !== null && (O = B.tag), O === null && !B.any) {
        var N = y.save();
        try {
          B.choice === null ? this._decodeGeneric(B.tag, y, x) : this._decodeChoice(y, x), T = !0;
        } catch {
          T = !1;
        }
        y.restore(N);
      } else if (T = this._peekTag(y, O, B.any), y.isError(T))
        return T;
    }
    var q;
    if (B.obj && T && (q = y.enterObject()), T) {
      if (B.explicit !== null) {
        var ft = this._decodeTag(y, B.explicit);
        if (y.isError(ft))
          return ft;
        y = ft;
      }
      var F = y.offset;
      if (B.use === null && B.choice === null) {
        if (B.any)
          var N = y.save();
        var _t = this._decodeTag(
          y,
          B.implicit !== null ? B.implicit : B.tag,
          B.any
        );
        if (y.isError(_t))
          return _t;
        B.any ? A = y.raw(N) : y = _t;
      }
      if (x && x.track && B.tag !== null && x.track(y.path(), F, y.length, "tagged"), x && x.track && B.tag !== null && x.track(y.path(), y.offset, y.length, "content"), B.any ? A = A : B.choice === null ? A = this._decodeGeneric(B.tag, y, x) : A = this._decodeChoice(y, x), y.isError(A))
        return A;
      if (!B.any && B.choice === null && B.children !== null && B.children.forEach(function(At) {
        At._decode(y, x);
      }), B.contains && (B.tag === "octstr" || B.tag === "bitstr")) {
        var St = new l(A);
        A = this._getUse(B.contains, y._reporterState.obj)._decode(St, x);
      }
    }
    return B.obj && T && (A = y.leaveObject(q)), B.key !== null && (A !== null || T === !0) ? y.leaveKey(D, B.key, A) : D !== null && y.exitKey(D), A;
  }, w.prototype._decodeGeneric = function(y, x, B) {
    var A = this._baseState;
    return y === "seq" || y === "set" ? null : y === "seqof" || y === "setof" ? this._decodeList(x, y, A.args[0], B) : /str$/.test(y) ? this._decodeStr(x, y, B) : y === "objid" && A.args ? this._decodeObjid(x, A.args[0], A.args[1], B) : y === "objid" ? this._decodeObjid(x, null, null, B) : y === "gentime" || y === "utctime" ? this._decodeTime(x, y, B) : y === "null_" ? this._decodeNull(x, B) : y === "bool" ? this._decodeBool(x, B) : y === "objDesc" ? this._decodeStr(x, y, B) : y === "int" || y === "enum" ? this._decodeInt(x, A.args && A.args[0], B) : A.use !== null ? this._getUse(A.use, x._reporterState.obj)._decode(x, B) : x.error("unknown tag: " + y);
  }, w.prototype._getUse = function(y, x) {
    var B = this._baseState;
    return B.useDecoder = this._use(y, x), o(B.useDecoder._baseState.parent === null), B.useDecoder = B.useDecoder._baseState.children[0], B.implicit !== B.useDecoder._baseState.implicit && (B.useDecoder = B.useDecoder.clone(), B.useDecoder._baseState.implicit = B.implicit), B.useDecoder;
  }, w.prototype._decodeChoice = function(y, x) {
    var B = this._baseState, A = null, T = !1;
    return Object.keys(B.choice).some(function(D) {
      var O = y.save(), N = B.choice[D];
      try {
        var q = N._decode(y, x);
        if (y.isError(q))
          return !1;
        A = { type: D, value: q }, T = !0;
      } catch {
        return y.restore(O), !1;
      }
      return !0;
    }, this), T ? A : y.error("Choice not matched");
  }, w.prototype._createEncoderBuffer = function(y) {
    return new n(y, this.reporter);
  }, w.prototype._encode = function(y, x, B) {
    var A = this._baseState;
    if (!(A.default !== null && A.default === y)) {
      var T = this._encodeValue(y, x, B);
      if (T !== void 0 && !this._skipDefault(T, x, B))
        return T;
    }
  }, w.prototype._encodeValue = function(y, x, B) {
    var A = this._baseState;
    if (A.parent === null)
      return A.children[0]._encode(y, x || new h());
    var N = null;
    if (this.reporter = x, A.optional && y === void 0)
      if (A.default !== null)
        y = A.default;
      else
        return;
    var T = null, D = !1;
    if (A.any)
      N = this._createEncoderBuffer(y);
    else if (A.choice)
      N = this._encodeChoice(y, x);
    else if (A.contains)
      T = this._getUse(A.contains, B)._encode(y, x), D = !0;
    else if (A.children)
      T = A.children.map(function(F) {
        if (F._baseState.tag === "null_")
          return F._encode(null, x, y);
        if (F._baseState.key === null)
          return x.error("Child should have a key");
        var _t = x.enterKey(F._baseState.key);
        if (typeof y != "object")
          return x.error("Child expected, but input is not object");
        var St = F._encode(y[F._baseState.key], x, y);
        return x.leaveKey(_t), St;
      }, this).filter(function(F) {
        return F;
      }), T = this._createEncoderBuffer(T);
    else if (A.tag === "seqof" || A.tag === "setof") {
      if (!(A.args && A.args.length === 1))
        return x.error("Too many args for : " + A.tag);
      if (!Array.isArray(y))
        return x.error("seqof/setof, but data is not Array");
      var O = this.clone();
      O._baseState.implicit = null, T = this._createEncoderBuffer(y.map(function(F) {
        var _t = this._baseState;
        return this._getUse(_t.args[0], y)._encode(F, x);
      }, O));
    } else
      A.use !== null ? N = this._getUse(A.use, B)._encode(y, x) : (T = this._encodePrimitive(A.tag, y), D = !0);
    var N;
    if (!A.any && A.choice === null) {
      var q = A.implicit !== null ? A.implicit : A.tag, ft = A.implicit === null ? "universal" : "context";
      q === null ? A.use === null && x.error("Tag could be omitted only for .use()") : A.use === null && (N = this._encodeComposite(q, D, ft, T));
    }
    return A.explicit !== null && (N = this._encodeComposite(A.explicit, !1, "context", N)), N;
  }, w.prototype._encodeChoice = function(y, x) {
    var B = this._baseState, A = B.choice[y.type];
    return A || o(
      !1,
      y.type + " not found in " + JSON.stringify(Object.keys(B.choice))
    ), A._encode(y.value, x);
  }, w.prototype._encodePrimitive = function(y, x) {
    var B = this._baseState;
    if (/str$/.test(y))
      return this._encodeStr(x, y);
    if (y === "objid" && B.args)
      return this._encodeObjid(x, B.reverseArgs[0], B.args[1]);
    if (y === "objid")
      return this._encodeObjid(x, null, null);
    if (y === "gentime" || y === "utctime")
      return this._encodeTime(x, y);
    if (y === "null_")
      return this._encodeNull();
    if (y === "int" || y === "enum")
      return this._encodeInt(x, B.args && B.reverseArgs[0]);
    if (y === "bool")
      return this._encodeBool(x);
    if (y === "objDesc")
      return this._encodeStr(x, y);
    throw new Error("Unsupported tag: " + y);
  }, w.prototype._isNumstr = function(y) {
    return /^[0-9 ]*$/.test(y);
  }, w.prototype._isPrintstr = function(y) {
    return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(y);
  }, If;
}
var $a;
function qi() {
  return $a || ($a = 1, function(h) {
    var n = h;
    n.Reporter = go.Reporter, n.DecoderBuffer = Da().DecoderBuffer, n.EncoderBuffer = Da().EncoderBuffer, n.Node = M2();
  }(Rf)), Rf;
}
var Tf = {}, Cf = {}, Fa;
function x2() {
  return Fa || (Fa = 1, function(h) {
    var n = bo();
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
  }(Cf)), Cf;
}
var La;
function bo() {
  return La || (La = 1, function(h) {
    var n = h;
    n._reverse = function(o) {
      var m = {};
      return Object.keys(o).forEach(function(f) {
        (f | 0) == f && (f = f | 0);
        var b = o[f];
        m[b] = f;
      }), m;
    }, n.der = x2();
  }(Tf)), Tf;
}
var qf = {}, Pf, Oa;
function yo() {
  if (Oa)
    return Pf;
  Oa = 1;
  var h = Jt, n = ji(), l = n.base, o = n.bignum, m = n.constants.der;
  function f(S) {
    this.enc = "der", this.name = S.name, this.entity = S, this.tree = new b(), this.tree._init(S.body);
  }
  Pf = f, f.prototype.decode = function(y, x) {
    return y instanceof l.DecoderBuffer || (y = new l.DecoderBuffer(y, x)), this.tree._decode(y, x);
  };
  function b(S) {
    l.Node.call(this, "der", S);
  }
  h(b, l.Node), b.prototype._peekTag = function(y, x, B) {
    if (y.isEmpty())
      return !1;
    var A = y.save(), T = w(y, 'Failed to peek tag: "' + x + '"');
    return y.isError(T) ? T : (y.restore(A), T.tag === x || T.tagStr === x || T.tagStr + "of" === x || B);
  }, b.prototype._decodeTag = function(y, x, B) {
    var A = w(
      y,
      'Failed to decode tag of "' + x + '"'
    );
    if (y.isError(A))
      return A;
    var T = _(
      y,
      A.primitive,
      'Failed to get length of "' + x + '"'
    );
    if (y.isError(T))
      return T;
    if (!B && A.tag !== x && A.tagStr !== x && A.tagStr + "of" !== x)
      return y.error('Failed to match tag: "' + x + '"');
    if (A.primitive || T !== null)
      return y.skip(T, 'Failed to match body of: "' + x + '"');
    var D = y.save(), O = this._skipUntilEnd(
      y,
      'Failed to skip indefinite length body: "' + this.tag + '"'
    );
    return y.isError(O) ? O : (T = y.offset - D.offset, y.restore(D), y.skip(T, 'Failed to match body of: "' + x + '"'));
  }, b.prototype._skipUntilEnd = function(y, x) {
    for (; ; ) {
      var B = w(y, x);
      if (y.isError(B))
        return B;
      var A = _(y, B.primitive, x);
      if (y.isError(A))
        return A;
      var T;
      if (B.primitive || A !== null ? T = y.skip(A) : T = this._skipUntilEnd(y, x), y.isError(T))
        return T;
      if (B.tagStr === "end")
        break;
    }
  }, b.prototype._decodeList = function(y, x, B, A) {
    for (var T = []; !y.isEmpty(); ) {
      var D = this._peekTag(y, "end");
      if (y.isError(D))
        return D;
      var O = B.decode(y, "der", A);
      if (y.isError(O) && D)
        break;
      T.push(O);
    }
    return T;
  }, b.prototype._decodeStr = function(y, x) {
    if (x === "bitstr") {
      var B = y.readUInt8();
      return y.isError(B) ? B : { unused: B, data: y.raw() };
    } else if (x === "bmpstr") {
      var A = y.raw();
      if (A.length % 2 === 1)
        return y.error("Decoding of string type: bmpstr length mismatch");
      for (var T = "", D = 0; D < A.length / 2; D++)
        T += String.fromCharCode(A.readUInt16BE(D * 2));
      return T;
    } else if (x === "numstr") {
      var O = y.raw().toString("ascii");
      return this._isNumstr(O) ? O : y.error("Decoding of string type: numstr unsupported characters");
    } else {
      if (x === "octstr")
        return y.raw();
      if (x === "objDesc")
        return y.raw();
      if (x === "printstr") {
        var N = y.raw().toString("ascii");
        return this._isPrintstr(N) ? N : y.error("Decoding of string type: printstr unsupported characters");
      } else
        return /str$/.test(x) ? y.raw().toString() : y.error("Decoding of string type: " + x + " unsupported");
    }
  }, b.prototype._decodeObjid = function(y, x, B) {
    for (var A, T = [], D = 0; !y.isEmpty(); ) {
      var O = y.readUInt8();
      D <<= 7, D |= O & 127, O & 128 || (T.push(D), D = 0);
    }
    O & 128 && T.push(D);
    var N = T[0] / 40 | 0, q = T[0] % 40;
    if (B ? A = T : A = [N, q].concat(T.slice(1)), x) {
      var ft = x[A.join(" ")];
      ft === void 0 && (ft = x[A.join(".")]), ft !== void 0 && (A = ft);
    }
    return A;
  }, b.prototype._decodeTime = function(y, x) {
    var B = y.raw().toString();
    if (x === "gentime")
      var A = B.slice(0, 4) | 0, T = B.slice(4, 6) | 0, D = B.slice(6, 8) | 0, O = B.slice(8, 10) | 0, N = B.slice(10, 12) | 0, q = B.slice(12, 14) | 0;
    else if (x === "utctime") {
      var A = B.slice(0, 2) | 0, T = B.slice(2, 4) | 0, D = B.slice(4, 6) | 0, O = B.slice(6, 8) | 0, N = B.slice(8, 10) | 0, q = B.slice(10, 12) | 0;
      A < 70 ? A = 2e3 + A : A = 1900 + A;
    } else
      return y.error("Decoding " + x + " time is not supported yet");
    return Date.UTC(A, T - 1, D, O, N, q, 0);
  }, b.prototype._decodeNull = function(y) {
    return null;
  }, b.prototype._decodeBool = function(y) {
    var x = y.readUInt8();
    return y.isError(x) ? x : x !== 0;
  }, b.prototype._decodeInt = function(y, x) {
    var B = y.raw(), A = new o(B);
    return x && (A = x[A.toString(10)] || A), A;
  }, b.prototype._use = function(y, x) {
    return typeof y == "function" && (y = y(x)), y._getDecoder("der").tree;
  };
  function w(S, y) {
    var x = S.readUInt8(y);
    if (S.isError(x))
      return x;
    var B = m.tagClass[x >> 6], A = (x & 32) === 0;
    if ((x & 31) === 31) {
      var T = x;
      for (x = 0; (T & 128) === 128; ) {
        if (T = S.readUInt8(y), S.isError(T))
          return T;
        x <<= 7, x |= T & 127;
      }
    } else
      x &= 31;
    var D = m.tag[x];
    return {
      cls: B,
      primitive: A,
      tag: x,
      tagStr: D
    };
  }
  function _(S, y, x) {
    var B = S.readUInt8(x);
    if (S.isError(B))
      return B;
    if (!y && B === 128)
      return null;
    if (!(B & 128))
      return B;
    var A = B & 127;
    if (A > 4)
      return S.error("length octect is too long");
    B = 0;
    for (var T = 0; T < A; T++) {
      B <<= 8;
      var D = S.readUInt8(x);
      if (S.isError(D))
        return D;
      B |= D;
    }
    return B;
  }
  return Pf;
}
var Df, Ua;
function _2() {
  if (Ua)
    return Df;
  Ua = 1;
  var h = Jt, n = ge.Buffer, l = yo();
  function o(m) {
    l.call(this, m), this.enc = "pem";
  }
  return h(o, l), Df = o, o.prototype.decode = function(f, b) {
    for (var w = f.toString().split(/[\r\n]+/g), _ = b.label.toUpperCase(), S = /^-----(BEGIN|END) ([^-]+)-----$/, y = -1, x = -1, B = 0; B < w.length; B++) {
      var A = w[B].match(S);
      if (A !== null && A[2] === _)
        if (y === -1) {
          if (A[1] !== "BEGIN")
            break;
          y = B;
        } else {
          if (A[1] !== "END")
            break;
          x = B;
          break;
        }
    }
    if (y === -1 || x === -1)
      throw new Error("PEM section not found for: " + _);
    var T = w.slice(y + 1, x).join("");
    T.replace(/[^a-z0-9\+\/=]+/gi, "");
    var D = new n(T, "base64");
    return l.prototype.decode.call(this, D, b);
  }, Df;
}
var za;
function S2() {
  return za || (za = 1, function(h) {
    var n = h;
    n.der = yo(), n.pem = _2();
  }(qf)), qf;
}
var Nf = {}, $f, Ka;
function wo() {
  if (Ka)
    return $f;
  Ka = 1;
  var h = Jt, n = ge.Buffer, l = ji(), o = l.base, m = l.constants.der;
  function f(S) {
    this.enc = "der", this.name = S.name, this.entity = S, this.tree = new b(), this.tree._init(S.body);
  }
  $f = f, f.prototype.encode = function(y, x) {
    return this.tree._encode(y, x).join();
  };
  function b(S) {
    o.Node.call(this, "der", S);
  }
  h(b, o.Node), b.prototype._encodeComposite = function(y, x, B, A) {
    var T = _(y, x, B, this.reporter);
    if (A.length < 128) {
      var N = new n(2);
      return N[0] = T, N[1] = A.length, this._createEncoderBuffer([N, A]);
    }
    for (var D = 1, O = A.length; O >= 256; O >>= 8)
      D++;
    var N = new n(1 + 1 + D);
    N[0] = T, N[1] = 128 | D;
    for (var O = 1 + D, q = A.length; q > 0; O--, q >>= 8)
      N[O] = q & 255;
    return this._createEncoderBuffer([N, A]);
  }, b.prototype._encodeStr = function(y, x) {
    if (x === "bitstr")
      return this._createEncoderBuffer([y.unused | 0, y.data]);
    if (x === "bmpstr") {
      for (var B = new n(y.length * 2), A = 0; A < y.length; A++)
        B.writeUInt16BE(y.charCodeAt(A), A * 2);
      return this._createEncoderBuffer(B);
    } else
      return x === "numstr" ? this._isNumstr(y) ? this._createEncoderBuffer(y) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : x === "printstr" ? this._isPrintstr(y) ? this._createEncoderBuffer(y) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(x) ? this._createEncoderBuffer(y) : x === "objDesc" ? this._createEncoderBuffer(y) : this.reporter.error("Encoding of string type: " + x + " unsupported");
  }, b.prototype._encodeObjid = function(y, x, B) {
    if (typeof y == "string") {
      if (!x)
        return this.reporter.error("string objid given, but no values map found");
      if (!x.hasOwnProperty(y))
        return this.reporter.error("objid not found in values map");
      y = x[y].split(/[\s\.]+/g);
      for (var A = 0; A < y.length; A++)
        y[A] |= 0;
    } else if (Array.isArray(y)) {
      y = y.slice();
      for (var A = 0; A < y.length; A++)
        y[A] |= 0;
    }
    if (!Array.isArray(y))
      return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(y));
    if (!B) {
      if (y[1] >= 40)
        return this.reporter.error("Second objid identifier OOB");
      y.splice(0, 2, y[0] * 40 + y[1]);
    }
    for (var T = 0, A = 0; A < y.length; A++) {
      var D = y[A];
      for (T++; D >= 128; D >>= 7)
        T++;
    }
    for (var O = new n(T), N = O.length - 1, A = y.length - 1; A >= 0; A--) {
      var D = y[A];
      for (O[N--] = D & 127; (D >>= 7) > 0; )
        O[N--] = 128 | D & 127;
    }
    return this._createEncoderBuffer(O);
  };
  function w(S) {
    return S < 10 ? "0" + S : S;
  }
  b.prototype._encodeTime = function(y, x) {
    var B, A = new Date(y);
    return x === "gentime" ? B = [
      w(A.getFullYear()),
      w(A.getUTCMonth() + 1),
      w(A.getUTCDate()),
      w(A.getUTCHours()),
      w(A.getUTCMinutes()),
      w(A.getUTCSeconds()),
      "Z"
    ].join("") : x === "utctime" ? B = [
      w(A.getFullYear() % 100),
      w(A.getUTCMonth() + 1),
      w(A.getUTCDate()),
      w(A.getUTCHours()),
      w(A.getUTCMinutes()),
      w(A.getUTCSeconds()),
      "Z"
    ].join("") : this.reporter.error("Encoding " + x + " time is not supported yet"), this._encodeStr(B, "octstr");
  }, b.prototype._encodeNull = function() {
    return this._createEncoderBuffer("");
  }, b.prototype._encodeInt = function(y, x) {
    if (typeof y == "string") {
      if (!x)
        return this.reporter.error("String int or enum given, but no values map");
      if (!x.hasOwnProperty(y))
        return this.reporter.error("Values map doesn't contain: " + JSON.stringify(y));
      y = x[y];
    }
    if (typeof y != "number" && !n.isBuffer(y)) {
      var B = y.toArray();
      !y.sign && B[0] & 128 && B.unshift(0), y = new n(B);
    }
    if (n.isBuffer(y)) {
      var A = y.length;
      y.length === 0 && A++;
      var D = new n(A);
      return y.copy(D), y.length === 0 && (D[0] = 0), this._createEncoderBuffer(D);
    }
    if (y < 128)
      return this._createEncoderBuffer(y);
    if (y < 256)
      return this._createEncoderBuffer([0, y]);
    for (var A = 1, T = y; T >= 256; T >>= 8)
      A++;
    for (var D = new Array(A), T = D.length - 1; T >= 0; T--)
      D[T] = y & 255, y >>= 8;
    return D[0] & 128 && D.unshift(0), this._createEncoderBuffer(new n(D));
  }, b.prototype._encodeBool = function(y) {
    return this._createEncoderBuffer(y ? 255 : 0);
  }, b.prototype._use = function(y, x) {
    return typeof y == "function" && (y = y(x)), y._getEncoder("der").tree;
  }, b.prototype._skipDefault = function(y, x, B) {
    var A = this._baseState, T;
    if (A.default === null)
      return !1;
    var D = y.join();
    if (A.defaultBuffer === void 0 && (A.defaultBuffer = this._encodeValue(A.default, x, B).join()), D.length !== A.defaultBuffer.length)
      return !1;
    for (T = 0; T < D.length; T++)
      if (D[T] !== A.defaultBuffer[T])
        return !1;
    return !0;
  };
  function _(S, y, x, B) {
    var A;
    if (S === "seqof" ? S = "seq" : S === "setof" && (S = "set"), m.tagByName.hasOwnProperty(S))
      A = m.tagByName[S];
    else if (typeof S == "number" && (S | 0) === S)
      A = S;
    else
      return B.error("Unknown tag: " + S);
    return A >= 31 ? B.error("Multi-octet tag encoding unsupported") : (y || (A |= 32), A |= m.tagClassByName[x || "universal"] << 6, A);
  }
  return $f;
}
var Ff, Ha;
function A2() {
  if (Ha)
    return Ff;
  Ha = 1;
  var h = Jt, n = wo();
  function l(o) {
    n.call(this, o), this.enc = "pem";
  }
  return h(l, n), Ff = l, l.prototype.encode = function(m, f) {
    for (var b = n.prototype.encode.call(this, m), w = b.toString("base64"), _ = ["-----BEGIN " + f.label + "-----"], S = 0; S < w.length; S += 64)
      _.push(w.slice(S, S + 64));
    return _.push("-----END " + f.label + "-----"), _.join(`
`);
  }, Ff;
}
var Za;
function B2() {
  return Za || (Za = 1, function(h) {
    var n = h;
    n.der = wo(), n.pem = A2();
  }(Nf)), Nf;
}
var Wa;
function ji() {
  return Wa || (Wa = 1, function(h) {
    var n = h;
    n.bignum = b2, n.define = y2().define, n.base = qi(), n.constants = bo(), n.decoders = S2(), n.encoders = B2();
  }(Ef)), Ef;
}
var tr = ji(), Va = tr.define("Time", function() {
  this.choice({
    utcTime: this.utctime(),
    generalTime: this.gentime()
  });
}), E2 = tr.define("AttributeTypeValue", function() {
  this.seq().obj(
    this.key("type").objid(),
    this.key("value").any()
  );
}), $0 = tr.define("AlgorithmIdentifier", function() {
  this.seq().obj(
    this.key("algorithm").objid(),
    this.key("parameters").optional(),
    this.key("curve").objid().optional()
  );
}), k2 = tr.define("SubjectPublicKeyInfo", function() {
  this.seq().obj(
    this.key("algorithm").use($0),
    this.key("subjectPublicKey").bitstr()
  );
}), R2 = tr.define("RelativeDistinguishedName", function() {
  this.setof(E2);
}), I2 = tr.define("RDNSequence", function() {
  this.seqof(R2);
}), Ya = tr.define("Name", function() {
  this.choice({
    rdnSequence: this.use(I2)
  });
}), T2 = tr.define("Validity", function() {
  this.seq().obj(
    this.key("notBefore").use(Va),
    this.key("notAfter").use(Va)
  );
}), C2 = tr.define("Extension", function() {
  this.seq().obj(
    this.key("extnID").objid(),
    this.key("critical").bool().def(!1),
    this.key("extnValue").octstr()
  );
}), q2 = tr.define("TBSCertificate", function() {
  this.seq().obj(
    this.key("version").explicit(0).int().optional(),
    this.key("serialNumber").int(),
    this.key("signature").use($0),
    this.key("issuer").use(Ya),
    this.key("validity").use(T2),
    this.key("subject").use(Ya),
    this.key("subjectPublicKeyInfo").use(k2),
    this.key("issuerUniqueID").implicit(1).bitstr().optional(),
    this.key("subjectUniqueID").implicit(2).bitstr().optional(),
    this.key("extensions").explicit(3).seqof(C2).optional()
  );
}), P2 = tr.define("X509Certificate", function() {
  this.seq().obj(
    this.key("tbsCertificate").use(q2),
    this.key("signatureAlgorithm").use($0),
    this.key("signatureValue").bitstr()
  );
}), D2 = P2, er = ji();
Qe.certificate = D2;
var N2 = er.define("RSAPrivateKey", function() {
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
Qe.RSAPrivateKey = N2;
var $2 = er.define("RSAPublicKey", function() {
  this.seq().obj(
    this.key("modulus").int(),
    this.key("publicExponent").int()
  );
});
Qe.RSAPublicKey = $2;
var Mo = er.define("AlgorithmIdentifier", function() {
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
}), F2 = er.define("SubjectPublicKeyInfo", function() {
  this.seq().obj(
    this.key("algorithm").use(Mo),
    this.key("subjectPublicKey").bitstr()
  );
});
Qe.PublicKey = F2;
var L2 = er.define("PrivateKeyInfo", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("algorithm").use(Mo),
    this.key("subjectPrivateKey").octstr()
  );
});
Qe.PrivateKey = L2;
var O2 = er.define("EncryptedPrivateKeyInfo", function() {
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
Qe.EncryptedPrivateKey = O2;
var U2 = er.define("DSAPrivateKey", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("p").int(),
    this.key("q").int(),
    this.key("g").int(),
    this.key("pub_key").int(),
    this.key("priv_key").int()
  );
});
Qe.DSAPrivateKey = U2;
Qe.DSAparam = er.define("DSAparam", function() {
  this.int();
});
var z2 = er.define("ECParameters", function() {
  this.choice({
    namedCurve: this.objid()
  });
}), K2 = er.define("ECPrivateKey", function() {
  this.seq().obj(
    this.key("version").int(),
    this.key("privateKey").octstr(),
    this.key("parameters").optional().explicit(0).use(z2),
    this.key("publicKey").optional().explicit(1).bitstr()
  );
});
Qe.ECPrivateKey = K2;
Qe.signature = er.define("signature", function() {
  this.seq().obj(
    this.key("r").int(),
    this.key("s").int()
  );
});
const H2 = {
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
var Z2 = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m, W2 = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m, V2 = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m, Y2 = Fn, J2 = Fe, sn = Nt.Buffer, G2 = function(h, n) {
  var l = h.toString(), o = l.match(Z2), m;
  if (o) {
    var b = "aes" + o[1], w = sn.from(o[2], "hex"), _ = sn.from(o[3].replace(/[\r\n]/g, ""), "base64"), S = Y2(n, w.slice(0, 8), parseInt(o[1], 10)).key, y = [], x = J2.createDecipheriv(b, S, w);
    y.push(x.update(_)), y.push(x.final()), m = sn.concat(y);
  } else {
    var f = l.match(V2);
    m = sn.from(f[2].replace(/[\r\n]/g, ""), "base64");
  }
  var B = l.match(W2)[1];
  return {
    tag: B,
    data: m
  };
}, qe = Qe, X2 = H2, j2 = G2, Q2 = Fe, tm = Tn, n0 = Nt.Buffer;
function em(h, n) {
  var l = h.algorithm.decrypt.kde.kdeparams.salt, o = parseInt(h.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), m = X2[h.algorithm.decrypt.cipher.algo.join(".")], f = h.algorithm.decrypt.cipher.iv, b = h.subjectPrivateKey, w = parseInt(m.split("-")[1], 10) / 8, _ = tm.pbkdf2Sync(n, l, o, w, "sha1"), S = Q2.createDecipheriv(m, _, f), y = [];
  return y.push(S.update(b)), y.push(S.final()), n0.concat(y);
}
function xo(h) {
  var n;
  typeof h == "object" && !n0.isBuffer(h) && (n = h.passphrase, h = h.key), typeof h == "string" && (h = n0.from(h));
  var l = j2(h, n), o = l.tag, m = l.data, f, b;
  switch (o) {
    case "CERTIFICATE":
      b = qe.certificate.decode(m, "der").tbsCertificate.subjectPublicKeyInfo;
    case "PUBLIC KEY":
      switch (b || (b = qe.PublicKey.decode(m, "der")), f = b.algorithm.algorithm.join("."), f) {
        case "1.2.840.113549.1.1.1":
          return qe.RSAPublicKey.decode(b.subjectPublicKey.data, "der");
        case "1.2.840.10045.2.1":
          return b.subjectPrivateKey = b.subjectPublicKey, {
            type: "ec",
            data: b
          };
        case "1.2.840.10040.4.1":
          return b.algorithm.params.pub_key = qe.DSAparam.decode(b.subjectPublicKey.data, "der"), {
            type: "dsa",
            data: b.algorithm.params
          };
        default:
          throw new Error("unknown key id " + f);
      }
    case "ENCRYPTED PRIVATE KEY":
      m = qe.EncryptedPrivateKey.decode(m, "der"), m = em(m, n);
    case "PRIVATE KEY":
      switch (b = qe.PrivateKey.decode(m, "der"), f = b.algorithm.algorithm.join("."), f) {
        case "1.2.840.113549.1.1.1":
          return qe.RSAPrivateKey.decode(b.subjectPrivateKey, "der");
        case "1.2.840.10045.2.1":
          return {
            curve: b.algorithm.curve,
            privateKey: qe.ECPrivateKey.decode(b.subjectPrivateKey, "der").privateKey
          };
        case "1.2.840.10040.4.1":
          return b.algorithm.params.priv_key = qe.DSAparam.decode(b.subjectPrivateKey, "der"), {
            type: "dsa",
            params: b.algorithm.params
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
      throw new Error("unknown key type " + o);
  }
}
xo.signature = qe.signature;
var Qn = xo;
const _o = {
  "1.3.132.0.10": "secp256k1",
  "1.3.132.0.33": "p224",
  "1.2.840.10045.3.1.1": "p192",
  "1.2.840.10045.3.1.7": "p256",
  "1.3.132.0.34": "p384",
  "1.3.132.0.35": "p521"
};
var Ja;
function rm() {
  if (Ja)
    return Bi.exports;
  Ja = 1;
  var h = Nt.Buffer, n = Th, l = R0, o = D0().ec, m = k0, f = Qn, b = _o, w = 1;
  function _(N, q, ft, F, _t) {
    var St = f(q);
    if (St.curve) {
      if (F !== "ecdsa" && F !== "ecdsa/rsa")
        throw new Error("wrong private key type");
      return S(N, St);
    } else if (St.type === "dsa") {
      if (F !== "dsa")
        throw new Error("wrong private key type");
      return y(N, St, ft);
    }
    if (F !== "rsa" && F !== "ecdsa/rsa")
      throw new Error("wrong private key type");
    if (q.padding !== void 0 && q.padding !== w)
      throw new Error("illegal or unsupported padding mode");
    N = h.concat([_t, N]);
    for (var kt = St.modulus.byteLength(), At = [0, 1]; N.length + At.length + 1 < kt; )
      At.push(255);
    At.push(0);
    for (var U = -1; ++U < N.length; )
      At.push(N[U]);
    var Et = l(At, St);
    return Et;
  }
  function S(N, q) {
    var ft = b[q.curve.join(".")];
    if (!ft)
      throw new Error("unknown curve " + q.curve.join("."));
    var F = new o(ft), _t = F.keyFromPrivate(q.privateKey), St = _t.sign(N);
    return h.from(St.toDER());
  }
  function y(N, q, ft) {
    for (var F = q.params.priv_key, _t = q.params.p, St = q.params.q, kt = q.params.g, At = new m(0), U, Et = A(N, St).mod(St), p = !1, t = B(F, St, N, ft); p === !1; )
      U = D(St, t, ft), At = O(kt, U, _t, St), p = U.invm(St).imul(Et.add(F.mul(At))).mod(St), p.cmpn(0) === 0 && (p = !1, At = new m(0));
    return x(At, p);
  }
  function x(N, q) {
    N = N.toArray(), q = q.toArray(), N[0] & 128 && (N = [0].concat(N)), q[0] & 128 && (q = [0].concat(q));
    var ft = N.length + q.length + 4, F = [
      48,
      ft,
      2,
      N.length
    ];
    return F = F.concat(N, [2, q.length], q), h.from(F);
  }
  function B(N, q, ft, F) {
    if (N = h.from(N.toArray()), N.length < q.byteLength()) {
      var _t = h.alloc(q.byteLength() - N.length);
      N = h.concat([_t, N]);
    }
    var St = ft.length, kt = T(ft, q), At = h.alloc(St);
    At.fill(1);
    var U = h.alloc(St);
    return U = n(F, U).update(At).update(h.from([0])).update(N).update(kt).digest(), At = n(F, U).update(At).digest(), U = n(F, U).update(At).update(h.from([1])).update(N).update(kt).digest(), At = n(F, U).update(At).digest(), { k: U, v: At };
  }
  function A(N, q) {
    var ft = new m(N), F = (N.length << 3) - q.bitLength();
    return F > 0 && ft.ishrn(F), ft;
  }
  function T(N, q) {
    N = A(N, q), N = N.mod(q);
    var ft = h.from(N.toArray());
    if (ft.length < q.byteLength()) {
      var F = h.alloc(q.byteLength() - ft.length);
      ft = h.concat([F, ft]);
    }
    return ft;
  }
  function D(N, q, ft) {
    var F, _t;
    do {
      for (F = h.alloc(0); F.length * 8 < N.bitLength(); )
        q.v = n(ft, q.k).update(q.v).digest(), F = h.concat([F, q.v]);
      _t = A(F, N), q.k = n(ft, q.k).update(q.v).update(h.from([0])).digest(), q.v = n(ft, q.k).update(q.v).digest();
    } while (_t.cmp(N) !== -1);
    return _t;
  }
  function O(N, q, ft, F) {
    return N.toRed(m.mont(ft)).redPow(q).fromRed().mod(F);
  }
  return Bi.exports = _, Bi.exports.getKey = B, Bi.exports.makeKey = D, Bi.exports;
}
var Lf, Ga;
function im() {
  if (Ga)
    return Lf;
  Ga = 1;
  var h = Nt.Buffer, n = k0, l = D0().ec, o = Qn, m = _o;
  function f(S, y, x, B, A) {
    var T = o(x);
    if (T.type === "ec") {
      if (B !== "ecdsa" && B !== "ecdsa/rsa")
        throw new Error("wrong public key type");
      return b(S, y, T);
    } else if (T.type === "dsa") {
      if (B !== "dsa")
        throw new Error("wrong public key type");
      return w(S, y, T);
    }
    if (B !== "rsa" && B !== "ecdsa/rsa")
      throw new Error("wrong public key type");
    y = h.concat([A, y]);
    for (var D = T.modulus.byteLength(), O = [1], N = 0; y.length + O.length + 2 < D; )
      O.push(255), N += 1;
    O.push(0);
    for (var q = -1; ++q < y.length; )
      O.push(y[q]);
    O = h.from(O);
    var ft = n.mont(T.modulus);
    S = new n(S).toRed(ft), S = S.redPow(new n(T.publicExponent)), S = h.from(S.fromRed().toArray());
    var F = N < 8 ? 1 : 0;
    for (D = Math.min(S.length, O.length), S.length !== O.length && (F = 1), q = -1; ++q < D; )
      F |= S[q] ^ O[q];
    return F === 0;
  }
  function b(S, y, x) {
    var B = m[x.data.algorithm.curve.join(".")];
    if (!B)
      throw new Error("unknown curve " + x.data.algorithm.curve.join("."));
    var A = new l(B), T = x.data.subjectPrivateKey.data;
    return A.verify(y, S, T);
  }
  function w(S, y, x) {
    var B = x.data.p, A = x.data.q, T = x.data.g, D = x.data.pub_key, O = o.signature.decode(S, "der"), N = O.s, q = O.r;
    _(N, A), _(q, A);
    var ft = n.mont(B), F = N.invm(A), _t = T.toRed(ft).redPow(new n(y).mul(F).mod(A)).fromRed().mul(D.toRed(ft).redPow(q.mul(F).mod(A)).fromRed()).mod(B).mod(A);
    return _t.cmp(q) === 0;
  }
  function _(S, y) {
    if (S.cmpn(0) <= 0)
      throw new Error("invalid sig");
    if (S.cmp(y) >= 0)
      throw new Error("invalid sig");
  }
  return Lf = f, Lf;
}
var Of, Xa;
function nm() {
  if (Xa)
    return Of;
  Xa = 1;
  var h = Nt.Buffer, n = Hi, l = tv, o = Jt, m = rm(), f = im(), b = Ch;
  Object.keys(b).forEach(function(x) {
    b[x].id = h.from(b[x].id, "hex"), b[x.toLowerCase()] = b[x];
  });
  function w(x) {
    l.Writable.call(this);
    var B = b[x];
    if (!B)
      throw new Error("Unknown message digest");
    this._hashType = B.hash, this._hash = n(B.hash), this._tag = B.id, this._signType = B.sign;
  }
  o(w, l.Writable), w.prototype._write = function(B, A, T) {
    this._hash.update(B), T();
  }, w.prototype.update = function(B, A) {
    return this._hash.update(typeof B == "string" ? h.from(B, A) : B), this;
  }, w.prototype.sign = function(B, A) {
    this.end();
    var T = this._hash.digest(), D = m(T, B, this._hashType, this._signType, this._tag);
    return A ? D.toString(A) : D;
  };
  function _(x) {
    l.Writable.call(this);
    var B = b[x];
    if (!B)
      throw new Error("Unknown message digest");
    this._hash = n(B.hash), this._tag = B.id, this._signType = B.sign;
  }
  o(_, l.Writable), _.prototype._write = function(B, A, T) {
    this._hash.update(B), T();
  }, _.prototype.update = function(B, A) {
    return this._hash.update(typeof B == "string" ? h.from(B, A) : B), this;
  }, _.prototype.verify = function(B, A, T) {
    var D = typeof A == "string" ? h.from(A, T) : A;
    this.end();
    var O = this._hash.digest();
    return f(D, O, B, this._signType, this._tag);
  };
  function S(x) {
    return new w(x);
  }
  function y(x) {
    return new _(x);
  }
  return Of = {
    Sign: S,
    Verify: y,
    createSign: S,
    createVerify: y
  }, Of;
}
var F0 = { exports: {} };
F0.exports;
(function(h) {
  (function(n, l) {
    function o(p, t) {
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
    typeof n == "object" ? n.exports = f : l.BN = f, f.BN = f, f.wordSize = 26;
    var b;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? b = window.Buffer : b = ge.Buffer;
    } catch {
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
      r === "hex" && (r = 16), o(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (o(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (o(typeof t.length == "number"), t.length <= 0)
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
    function w(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function _(p, t, r) {
      var i = w(p, r);
      return r - 1 >= t && (i |= w(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var s = t.length - r;
        for (a = s % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function S(p, t, r, i) {
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
      for (var c = t.length - i, v = c % a, s = Math.min(c, c - v) + i, e = 0, u = i; u < s; u += a)
        e = S(t, u, u + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var g = 1;
        for (e = S(t, u, t.length, r), u = 0; u < v; u++)
          g *= r;
        this.imuln(g), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    var y = [
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
    ], B = [
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
          var v = this.words[c], s = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = y[6 - s.length] + s + i : i = s + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], u = B[t];
        i = "";
        var g = this.clone();
        for (g.negative = 0; !g.isZero(); ) {
          var M = g.modn(u).toString(t);
          g = g.idivn(u), g.isZero() ? i = M + i : i = y[e - M.length] + M + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      o(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && o(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return o(typeof b < "u"), this.toArrayLike(b, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var a = this.byteLength(), d = i || Math.max(1, a);
      o(a <= d, "byte array longer than desired length"), o(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), s, e, u = this.clone();
      if (c) {
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[e] = s;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
          v[e] = 0;
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[d - e - 1] = s;
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
    function A(p) {
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
      return o((this.negative | t.negative) === 0), this.iuor(t);
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
      return o((this.negative | t.negative) === 0), this.iuand(t);
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
      return o((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      o(typeof t == "number" && t >= 0);
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
    function T(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, s = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var u = s >>> 26, g = s & 67108863, M = Math.min(e, t.length - 1), k = Math.max(0, e - p.length + 1); k <= M; k++) {
          var R = e - k | 0;
          a = p.words[R] | 0, d = t.words[k] | 0, c = a * d + g, u += c / 67108864 | 0, g = c & 67108863;
        }
        r.words[e] = g | 0, s = u | 0;
      }
      return s !== 0 ? r.words[e] = s | 0 : r.length--, r.strip();
    }
    var D = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, s, e, u, g = a[0] | 0, M = g & 8191, k = g >>> 13, R = a[1] | 0, P = R & 8191, E = R >>> 13, I = a[2] | 0, C = I & 8191, $ = I >>> 13, Bt = a[3] | 0, L = Bt & 8191, z = Bt >>> 13, Ct = a[4] | 0, H = Ct & 8191, st = Ct >>> 13, Dt = a[5] | 0, Z = Dt & 8191, ot = Dt >>> 13, qt = a[6] | 0, W = qt & 8191, ht = qt >>> 13, Rt = a[7] | 0, K = Rt & 8191, at = Rt >>> 13, $t = a[8] | 0, V = $t & 8191, lt = $t >>> 13, Ft = a[9] | 0, Y = Ft & 8191, dt = Ft >>> 13, Lt = d[0] | 0, J = Lt & 8191, ct = Lt >>> 13, Ot = d[1] | 0, G = Ot & 8191, vt = Ot >>> 13, Ut = d[2] | 0, X = Ut & 8191, pt = Ut >>> 13, zt = d[3] | 0, j = zt & 8191, mt = zt >>> 13, Kt = d[4] | 0, Q = Kt & 8191, gt = Kt >>> 13, Ht = d[5] | 0, tt = Ht & 8191, bt = Ht >>> 13, Zt = d[6] | 0, et = Zt & 8191, yt = Zt >>> 13, Wt = d[7] | 0, rt = Wt & 8191, wt = Wt >>> 13, Vt = d[8] | 0, it = Vt & 8191, Mt = Vt >>> 13, Yt = d[9] | 0, nt = Yt & 8191, xt = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, s = Math.imul(M, J), e = Math.imul(M, ct), e = e + Math.imul(k, J) | 0, u = Math.imul(k, ct);
      var It = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (It >>> 26) | 0, It &= 67108863, s = Math.imul(P, J), e = Math.imul(P, ct), e = e + Math.imul(E, J) | 0, u = Math.imul(E, ct), s = s + Math.imul(M, G) | 0, e = e + Math.imul(M, vt) | 0, e = e + Math.imul(k, G) | 0, u = u + Math.imul(k, vt) | 0;
      var Tt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Tt >>> 26) | 0, Tt &= 67108863, s = Math.imul(C, J), e = Math.imul(C, ct), e = e + Math.imul($, J) | 0, u = Math.imul($, ct), s = s + Math.imul(P, G) | 0, e = e + Math.imul(P, vt) | 0, e = e + Math.imul(E, G) | 0, u = u + Math.imul(E, vt) | 0, s = s + Math.imul(M, X) | 0, e = e + Math.imul(M, pt) | 0, e = e + Math.imul(k, X) | 0, u = u + Math.imul(k, pt) | 0;
      var jt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, s = Math.imul(L, J), e = Math.imul(L, ct), e = e + Math.imul(z, J) | 0, u = Math.imul(z, ct), s = s + Math.imul(C, G) | 0, e = e + Math.imul(C, vt) | 0, e = e + Math.imul($, G) | 0, u = u + Math.imul($, vt) | 0, s = s + Math.imul(P, X) | 0, e = e + Math.imul(P, pt) | 0, e = e + Math.imul(E, X) | 0, u = u + Math.imul(E, pt) | 0, s = s + Math.imul(M, j) | 0, e = e + Math.imul(M, mt) | 0, e = e + Math.imul(k, j) | 0, u = u + Math.imul(k, mt) | 0;
      var Qt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, s = Math.imul(H, J), e = Math.imul(H, ct), e = e + Math.imul(st, J) | 0, u = Math.imul(st, ct), s = s + Math.imul(L, G) | 0, e = e + Math.imul(L, vt) | 0, e = e + Math.imul(z, G) | 0, u = u + Math.imul(z, vt) | 0, s = s + Math.imul(C, X) | 0, e = e + Math.imul(C, pt) | 0, e = e + Math.imul($, X) | 0, u = u + Math.imul($, pt) | 0, s = s + Math.imul(P, j) | 0, e = e + Math.imul(P, mt) | 0, e = e + Math.imul(E, j) | 0, u = u + Math.imul(E, mt) | 0, s = s + Math.imul(M, Q) | 0, e = e + Math.imul(M, gt) | 0, e = e + Math.imul(k, Q) | 0, u = u + Math.imul(k, gt) | 0;
      var te = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, s = Math.imul(Z, J), e = Math.imul(Z, ct), e = e + Math.imul(ot, J) | 0, u = Math.imul(ot, ct), s = s + Math.imul(H, G) | 0, e = e + Math.imul(H, vt) | 0, e = e + Math.imul(st, G) | 0, u = u + Math.imul(st, vt) | 0, s = s + Math.imul(L, X) | 0, e = e + Math.imul(L, pt) | 0, e = e + Math.imul(z, X) | 0, u = u + Math.imul(z, pt) | 0, s = s + Math.imul(C, j) | 0, e = e + Math.imul(C, mt) | 0, e = e + Math.imul($, j) | 0, u = u + Math.imul($, mt) | 0, s = s + Math.imul(P, Q) | 0, e = e + Math.imul(P, gt) | 0, e = e + Math.imul(E, Q) | 0, u = u + Math.imul(E, gt) | 0, s = s + Math.imul(M, tt) | 0, e = e + Math.imul(M, bt) | 0, e = e + Math.imul(k, tt) | 0, u = u + Math.imul(k, bt) | 0;
      var ee = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, s = Math.imul(W, J), e = Math.imul(W, ct), e = e + Math.imul(ht, J) | 0, u = Math.imul(ht, ct), s = s + Math.imul(Z, G) | 0, e = e + Math.imul(Z, vt) | 0, e = e + Math.imul(ot, G) | 0, u = u + Math.imul(ot, vt) | 0, s = s + Math.imul(H, X) | 0, e = e + Math.imul(H, pt) | 0, e = e + Math.imul(st, X) | 0, u = u + Math.imul(st, pt) | 0, s = s + Math.imul(L, j) | 0, e = e + Math.imul(L, mt) | 0, e = e + Math.imul(z, j) | 0, u = u + Math.imul(z, mt) | 0, s = s + Math.imul(C, Q) | 0, e = e + Math.imul(C, gt) | 0, e = e + Math.imul($, Q) | 0, u = u + Math.imul($, gt) | 0, s = s + Math.imul(P, tt) | 0, e = e + Math.imul(P, bt) | 0, e = e + Math.imul(E, tt) | 0, u = u + Math.imul(E, bt) | 0, s = s + Math.imul(M, et) | 0, e = e + Math.imul(M, yt) | 0, e = e + Math.imul(k, et) | 0, u = u + Math.imul(k, yt) | 0;
      var re = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, s = Math.imul(K, J), e = Math.imul(K, ct), e = e + Math.imul(at, J) | 0, u = Math.imul(at, ct), s = s + Math.imul(W, G) | 0, e = e + Math.imul(W, vt) | 0, e = e + Math.imul(ht, G) | 0, u = u + Math.imul(ht, vt) | 0, s = s + Math.imul(Z, X) | 0, e = e + Math.imul(Z, pt) | 0, e = e + Math.imul(ot, X) | 0, u = u + Math.imul(ot, pt) | 0, s = s + Math.imul(H, j) | 0, e = e + Math.imul(H, mt) | 0, e = e + Math.imul(st, j) | 0, u = u + Math.imul(st, mt) | 0, s = s + Math.imul(L, Q) | 0, e = e + Math.imul(L, gt) | 0, e = e + Math.imul(z, Q) | 0, u = u + Math.imul(z, gt) | 0, s = s + Math.imul(C, tt) | 0, e = e + Math.imul(C, bt) | 0, e = e + Math.imul($, tt) | 0, u = u + Math.imul($, bt) | 0, s = s + Math.imul(P, et) | 0, e = e + Math.imul(P, yt) | 0, e = e + Math.imul(E, et) | 0, u = u + Math.imul(E, yt) | 0, s = s + Math.imul(M, rt) | 0, e = e + Math.imul(M, wt) | 0, e = e + Math.imul(k, rt) | 0, u = u + Math.imul(k, wt) | 0;
      var ie = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, s = Math.imul(V, J), e = Math.imul(V, ct), e = e + Math.imul(lt, J) | 0, u = Math.imul(lt, ct), s = s + Math.imul(K, G) | 0, e = e + Math.imul(K, vt) | 0, e = e + Math.imul(at, G) | 0, u = u + Math.imul(at, vt) | 0, s = s + Math.imul(W, X) | 0, e = e + Math.imul(W, pt) | 0, e = e + Math.imul(ht, X) | 0, u = u + Math.imul(ht, pt) | 0, s = s + Math.imul(Z, j) | 0, e = e + Math.imul(Z, mt) | 0, e = e + Math.imul(ot, j) | 0, u = u + Math.imul(ot, mt) | 0, s = s + Math.imul(H, Q) | 0, e = e + Math.imul(H, gt) | 0, e = e + Math.imul(st, Q) | 0, u = u + Math.imul(st, gt) | 0, s = s + Math.imul(L, tt) | 0, e = e + Math.imul(L, bt) | 0, e = e + Math.imul(z, tt) | 0, u = u + Math.imul(z, bt) | 0, s = s + Math.imul(C, et) | 0, e = e + Math.imul(C, yt) | 0, e = e + Math.imul($, et) | 0, u = u + Math.imul($, yt) | 0, s = s + Math.imul(P, rt) | 0, e = e + Math.imul(P, wt) | 0, e = e + Math.imul(E, rt) | 0, u = u + Math.imul(E, wt) | 0, s = s + Math.imul(M, it) | 0, e = e + Math.imul(M, Mt) | 0, e = e + Math.imul(k, it) | 0, u = u + Math.imul(k, Mt) | 0;
      var ne = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, s = Math.imul(Y, J), e = Math.imul(Y, ct), e = e + Math.imul(dt, J) | 0, u = Math.imul(dt, ct), s = s + Math.imul(V, G) | 0, e = e + Math.imul(V, vt) | 0, e = e + Math.imul(lt, G) | 0, u = u + Math.imul(lt, vt) | 0, s = s + Math.imul(K, X) | 0, e = e + Math.imul(K, pt) | 0, e = e + Math.imul(at, X) | 0, u = u + Math.imul(at, pt) | 0, s = s + Math.imul(W, j) | 0, e = e + Math.imul(W, mt) | 0, e = e + Math.imul(ht, j) | 0, u = u + Math.imul(ht, mt) | 0, s = s + Math.imul(Z, Q) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(ot, Q) | 0, u = u + Math.imul(ot, gt) | 0, s = s + Math.imul(H, tt) | 0, e = e + Math.imul(H, bt) | 0, e = e + Math.imul(st, tt) | 0, u = u + Math.imul(st, bt) | 0, s = s + Math.imul(L, et) | 0, e = e + Math.imul(L, yt) | 0, e = e + Math.imul(z, et) | 0, u = u + Math.imul(z, yt) | 0, s = s + Math.imul(C, rt) | 0, e = e + Math.imul(C, wt) | 0, e = e + Math.imul($, rt) | 0, u = u + Math.imul($, wt) | 0, s = s + Math.imul(P, it) | 0, e = e + Math.imul(P, Mt) | 0, e = e + Math.imul(E, it) | 0, u = u + Math.imul(E, Mt) | 0, s = s + Math.imul(M, nt) | 0, e = e + Math.imul(M, xt) | 0, e = e + Math.imul(k, nt) | 0, u = u + Math.imul(k, xt) | 0;
      var fe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, s = Math.imul(Y, G), e = Math.imul(Y, vt), e = e + Math.imul(dt, G) | 0, u = Math.imul(dt, vt), s = s + Math.imul(V, X) | 0, e = e + Math.imul(V, pt) | 0, e = e + Math.imul(lt, X) | 0, u = u + Math.imul(lt, pt) | 0, s = s + Math.imul(K, j) | 0, e = e + Math.imul(K, mt) | 0, e = e + Math.imul(at, j) | 0, u = u + Math.imul(at, mt) | 0, s = s + Math.imul(W, Q) | 0, e = e + Math.imul(W, gt) | 0, e = e + Math.imul(ht, Q) | 0, u = u + Math.imul(ht, gt) | 0, s = s + Math.imul(Z, tt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(ot, tt) | 0, u = u + Math.imul(ot, bt) | 0, s = s + Math.imul(H, et) | 0, e = e + Math.imul(H, yt) | 0, e = e + Math.imul(st, et) | 0, u = u + Math.imul(st, yt) | 0, s = s + Math.imul(L, rt) | 0, e = e + Math.imul(L, wt) | 0, e = e + Math.imul(z, rt) | 0, u = u + Math.imul(z, wt) | 0, s = s + Math.imul(C, it) | 0, e = e + Math.imul(C, Mt) | 0, e = e + Math.imul($, it) | 0, u = u + Math.imul($, Mt) | 0, s = s + Math.imul(P, nt) | 0, e = e + Math.imul(P, xt) | 0, e = e + Math.imul(E, nt) | 0, u = u + Math.imul(E, xt) | 0;
      var ae = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, s = Math.imul(Y, X), e = Math.imul(Y, pt), e = e + Math.imul(dt, X) | 0, u = Math.imul(dt, pt), s = s + Math.imul(V, j) | 0, e = e + Math.imul(V, mt) | 0, e = e + Math.imul(lt, j) | 0, u = u + Math.imul(lt, mt) | 0, s = s + Math.imul(K, Q) | 0, e = e + Math.imul(K, gt) | 0, e = e + Math.imul(at, Q) | 0, u = u + Math.imul(at, gt) | 0, s = s + Math.imul(W, tt) | 0, e = e + Math.imul(W, bt) | 0, e = e + Math.imul(ht, tt) | 0, u = u + Math.imul(ht, bt) | 0, s = s + Math.imul(Z, et) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(ot, et) | 0, u = u + Math.imul(ot, yt) | 0, s = s + Math.imul(H, rt) | 0, e = e + Math.imul(H, wt) | 0, e = e + Math.imul(st, rt) | 0, u = u + Math.imul(st, wt) | 0, s = s + Math.imul(L, it) | 0, e = e + Math.imul(L, Mt) | 0, e = e + Math.imul(z, it) | 0, u = u + Math.imul(z, Mt) | 0, s = s + Math.imul(C, nt) | 0, e = e + Math.imul(C, xt) | 0, e = e + Math.imul($, nt) | 0, u = u + Math.imul($, xt) | 0;
      var he = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, s = Math.imul(Y, j), e = Math.imul(Y, mt), e = e + Math.imul(dt, j) | 0, u = Math.imul(dt, mt), s = s + Math.imul(V, Q) | 0, e = e + Math.imul(V, gt) | 0, e = e + Math.imul(lt, Q) | 0, u = u + Math.imul(lt, gt) | 0, s = s + Math.imul(K, tt) | 0, e = e + Math.imul(K, bt) | 0, e = e + Math.imul(at, tt) | 0, u = u + Math.imul(at, bt) | 0, s = s + Math.imul(W, et) | 0, e = e + Math.imul(W, yt) | 0, e = e + Math.imul(ht, et) | 0, u = u + Math.imul(ht, yt) | 0, s = s + Math.imul(Z, rt) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(ot, rt) | 0, u = u + Math.imul(ot, wt) | 0, s = s + Math.imul(H, it) | 0, e = e + Math.imul(H, Mt) | 0, e = e + Math.imul(st, it) | 0, u = u + Math.imul(st, Mt) | 0, s = s + Math.imul(L, nt) | 0, e = e + Math.imul(L, xt) | 0, e = e + Math.imul(z, nt) | 0, u = u + Math.imul(z, xt) | 0;
      var se = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, s = Math.imul(Y, Q), e = Math.imul(Y, gt), e = e + Math.imul(dt, Q) | 0, u = Math.imul(dt, gt), s = s + Math.imul(V, tt) | 0, e = e + Math.imul(V, bt) | 0, e = e + Math.imul(lt, tt) | 0, u = u + Math.imul(lt, bt) | 0, s = s + Math.imul(K, et) | 0, e = e + Math.imul(K, yt) | 0, e = e + Math.imul(at, et) | 0, u = u + Math.imul(at, yt) | 0, s = s + Math.imul(W, rt) | 0, e = e + Math.imul(W, wt) | 0, e = e + Math.imul(ht, rt) | 0, u = u + Math.imul(ht, wt) | 0, s = s + Math.imul(Z, it) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(ot, it) | 0, u = u + Math.imul(ot, Mt) | 0, s = s + Math.imul(H, nt) | 0, e = e + Math.imul(H, xt) | 0, e = e + Math.imul(st, nt) | 0, u = u + Math.imul(st, xt) | 0;
      var oe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, s = Math.imul(Y, tt), e = Math.imul(Y, bt), e = e + Math.imul(dt, tt) | 0, u = Math.imul(dt, bt), s = s + Math.imul(V, et) | 0, e = e + Math.imul(V, yt) | 0, e = e + Math.imul(lt, et) | 0, u = u + Math.imul(lt, yt) | 0, s = s + Math.imul(K, rt) | 0, e = e + Math.imul(K, wt) | 0, e = e + Math.imul(at, rt) | 0, u = u + Math.imul(at, wt) | 0, s = s + Math.imul(W, it) | 0, e = e + Math.imul(W, Mt) | 0, e = e + Math.imul(ht, it) | 0, u = u + Math.imul(ht, Mt) | 0, s = s + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(ot, nt) | 0, u = u + Math.imul(ot, xt) | 0;
      var ue = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, s = Math.imul(Y, et), e = Math.imul(Y, yt), e = e + Math.imul(dt, et) | 0, u = Math.imul(dt, yt), s = s + Math.imul(V, rt) | 0, e = e + Math.imul(V, wt) | 0, e = e + Math.imul(lt, rt) | 0, u = u + Math.imul(lt, wt) | 0, s = s + Math.imul(K, it) | 0, e = e + Math.imul(K, Mt) | 0, e = e + Math.imul(at, it) | 0, u = u + Math.imul(at, Mt) | 0, s = s + Math.imul(W, nt) | 0, e = e + Math.imul(W, xt) | 0, e = e + Math.imul(ht, nt) | 0, u = u + Math.imul(ht, xt) | 0;
      var le = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, s = Math.imul(Y, rt), e = Math.imul(Y, wt), e = e + Math.imul(dt, rt) | 0, u = Math.imul(dt, wt), s = s + Math.imul(V, it) | 0, e = e + Math.imul(V, Mt) | 0, e = e + Math.imul(lt, it) | 0, u = u + Math.imul(lt, Mt) | 0, s = s + Math.imul(K, nt) | 0, e = e + Math.imul(K, xt) | 0, e = e + Math.imul(at, nt) | 0, u = u + Math.imul(at, xt) | 0;
      var de = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, s = Math.imul(Y, it), e = Math.imul(Y, Mt), e = e + Math.imul(dt, it) | 0, u = Math.imul(dt, Mt), s = s + Math.imul(V, nt) | 0, e = e + Math.imul(V, xt) | 0, e = e + Math.imul(lt, nt) | 0, u = u + Math.imul(lt, xt) | 0;
      var ce = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, s = Math.imul(Y, nt), e = Math.imul(Y, xt), e = e + Math.imul(dt, nt) | 0, u = Math.imul(dt, xt);
      var ve = (v + s | 0) + ((e & 8191) << 13) | 0;
      return v = (u + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = It, c[1] = Tt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (D = T);
    function O(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, s = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= s; e++) {
          var u = d - e, g = p.words[u] | 0, M = t.words[e] | 0, k = g * M, R = k & 67108863;
          c = c + (k / 67108864 | 0) | 0, R = R + v | 0, v = R & 67108863, c = c + (R >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function N(p, t, r) {
      var i = new q();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = D(this, t, r) : a < 63 ? i = T(this, t, r) : a < 1024 ? i = O(this, t, r) : i = N(this, t, r), i;
    };
    function q(p, t) {
      this.x = p, this.y = t;
    }
    q.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, q.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, q.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, q.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var s = v << 1, e = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), g = 0; g < d; g += s)
          for (var M = e, k = u, R = 0; R < v; R++) {
            var P = i[g + R], E = a[g + R], I = i[g + R + v], C = a[g + R + v], $ = M * I - k * C;
            C = M * C + k * I, I = $, i[g + R] = P + I, a[g + R] = E + C, i[g + R + v] = P - I, a[g + R + v] = E - C, R !== s && ($ = e * M - u * k, k = e * k + u * M, M = $);
          }
    }, q.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, q.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, q.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, q.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      o(d === 0), o((d & -8192) === 0);
    }, q.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, q.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), s = new Array(a), e = new Array(a), u = new Array(a), g = new Array(a), M = new Array(a), k = i.words;
      k.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, u, a), this.transform(v, c, s, e, a, d), this.transform(u, c, g, M, a, d);
      for (var R = 0; R < a; R++) {
        var P = s[R] * g[R] - e[R] * M[R];
        e[R] = s[R] * M[R] + e[R] * g[R], s[R] = P;
      }
      return this.conjugate(s, e, a), this.transform(s, e, k, c, a, d), this.conjugate(k, c, a), this.normalize13b(k, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), N(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      o(typeof t == "number"), o(t < 67108864);
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
      var r = A(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, s = (this.words[d] | 0) - v << r;
          this.words[d] = s | c, c = v >>> 26 - r;
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
      return o(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      o(typeof t == "number" && t >= 0);
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, s = i;
      if (a -= c, a = Math.max(0, a), s) {
        for (var e = 0; e < c; e++)
          s.words[e] = this.words[e];
        s.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var u = 0;
      for (e = this.length - 1; e >= 0 && (u !== 0 || e >= a); e--) {
        var g = this.words[e] | 0;
        this.words[e] = u << 26 - d | g >>> d, u = g & v;
      }
      return s && u !== 0 && (s.words[s.length++] = u), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return o(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (o(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return o(typeof t == "number"), o(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (o(typeof t == "number"), o(t < 67108864), t < 0)
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
        var s = (t.words[d] | 0) * r;
        c -= s & 67108863, v = (c >> 26) - (s / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (o(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var s = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = s + 1, e.words = new Array(e.length);
        for (var u = 0; u < e.length; u++)
          e.words[u] = 0;
      }
      var g = a.clone()._ishlnsubmul(d, 1, s);
      g.negative === 0 && (a = g, e && (e.words[s] = 1));
      for (var M = s - 1; M >= 0; M--) {
        var k = (a.words[d.length + M] | 0) * 67108864 + (a.words[d.length + M - 1] | 0);
        for (k = Math.min(k / c | 0, 67108863), a._ishlnsubmul(d, k, M); a.negative !== 0; )
          k--, a.negative = 0, a._ishlnsubmul(d, 1, M), a.isZero() || (a.negative ^= 1);
        e && (e.words[M] = k);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (o(!t.isZero()), this.isZero())
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
      o(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      o(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), s = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++s;
      for (var e = i.clone(), u = r.clone(); !r.isZero(); ) {
        for (var g = 0, M = 1; !(r.words[0] & M) && g < 26; ++g, M <<= 1)
          ;
        if (g > 0)
          for (r.iushrn(g); g-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(u)), a.iushrn(1), d.iushrn(1);
        for (var k = 0, R = 1; !(i.words[0] & R) && k < 26; ++k, R <<= 1)
          ;
        if (k > 0)
          for (i.iushrn(k); k-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(u)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(s)
      };
    }, f.prototype._invmp = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, s = 1; !(r.words[0] & s) && v < 26; ++v, s <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, u = 1; !(i.words[0] & u) && e < 26; ++e, u <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var g;
      return r.cmpn(1) === 0 ? g = a : g = d, g.cmpn(0) < 0 && g.iadd(t), g;
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
      o(typeof t == "number");
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
        r && (t = -t), o(t <= 67108863, "Number is too big");
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
      return new U(t);
    }, f.prototype.toRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), o(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return o(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return o(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return o(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return o(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return o(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return o(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return o(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return o(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return o(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return o(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return o(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return o(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var ft = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function F(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    F.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, F.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, F.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, F.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function _t() {
      F.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(_t, F), _t.prototype.split = function(t, r) {
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
    }, _t.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function St() {
      F.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(St, F);
    function kt() {
      F.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(kt, F);
    function At() {
      F.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(At, F), At.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (ft[t])
        return ft[t];
      var r;
      if (t === "k256")
        r = new _t();
      else if (t === "p224")
        r = new St();
      else if (t === "p192")
        r = new kt();
      else if (t === "p25519")
        r = new At();
      else
        throw new Error("Unknown prime " + t);
      return ft[t] = r, r;
    };
    function U(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        o(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    U.prototype._verify1 = function(t) {
      o(t.negative === 0, "red works only with positives"), o(t.red, "red works only with red numbers");
    }, U.prototype._verify2 = function(t, r) {
      o((t.negative | r.negative) === 0, "red works only with positives"), o(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, U.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, U.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, U.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, U.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, U.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, U.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, U.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, U.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, U.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, U.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, U.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, U.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (o(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      o(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), s = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, s).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var u = this.pow(e, a), g = this.pow(t, a.addn(1).iushrn(1)), M = this.pow(t, a), k = d; M.cmp(c) !== 0; ) {
        for (var R = M, P = 0; R.cmp(c) !== 0; P++)
          R = R.redSqr();
        o(P < k);
        var E = this.pow(u, new f(1).iushln(k - P - 1));
        g = g.redMul(E), u = E.redSqr(), M = M.redMul(u), k = P;
      }
      return g;
    }, U.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, U.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, s = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var u = r.words[d], g = e - 1; g >= 0; g--) {
          var M = u >> g & 1;
          if (c !== a[0] && (c = this.sqr(c)), M === 0 && v === 0) {
            s = 0;
            continue;
          }
          v <<= 1, v |= M, s++, !(s !== i && (d !== 0 || g !== 0)) && (c = this.mul(c, a[v]), s = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, U.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, U.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new Et(t);
    };
    function Et(p) {
      U.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(Et, U), Et.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, Et.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, Et.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(F0);
var fm = F0.exports, Uf, ja;
function am() {
  if (ja)
    return Uf;
  ja = 1;
  var h = D0(), n = fm;
  Uf = function(b) {
    return new o(b);
  };
  var l = {
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
  l.p224 = l.secp224r1, l.p256 = l.secp256r1 = l.prime256v1, l.p192 = l.secp192r1 = l.prime192v1, l.p384 = l.secp384r1, l.p521 = l.secp521r1;
  function o(f) {
    this.curveType = l[f], this.curveType || (this.curveType = {
      name: f
    }), this.curve = new h.ec(this.curveType.name), this.keys = void 0;
  }
  o.prototype.generateKeys = function(f, b) {
    return this.keys = this.curve.genKeyPair(), this.getPublicKey(f, b);
  }, o.prototype.computeSecret = function(f, b, w) {
    b = b || "utf8", ut.isBuffer(f) || (f = new ut(f, b));
    var _ = this.curve.keyFromPublic(f).getPublic(), S = _.mul(this.keys.getPrivate()).getX();
    return m(S, w, this.curveType.byteLength);
  }, o.prototype.getPublicKey = function(f, b) {
    var w = this.keys.getPublic(b === "compressed", !0);
    return b === "hybrid" && (w[w.length - 1] % 2 ? w[0] = 7 : w[0] = 6), m(w, f);
  }, o.prototype.getPrivateKey = function(f) {
    return m(this.keys.getPrivate(), f);
  }, o.prototype.setPublicKey = function(f, b) {
    return b = b || "utf8", ut.isBuffer(f) || (f = new ut(f, b)), this.keys._importPublic(f), this;
  }, o.prototype.setPrivateKey = function(f, b) {
    b = b || "utf8", ut.isBuffer(f) || (f = new ut(f, b));
    var w = new n(f);
    return w = w.toString(16), this.keys = this.curve.genKeyPair(), this.keys._importPrivate(w), this;
  };
  function m(f, b, w) {
    Array.isArray(f) || (f = f.toArray());
    var _ = new ut(f);
    if (w && _.length < w) {
      var S = new ut(w - _.length);
      S.fill(0), _ = ut.concat([S, _]);
    }
    return b ? _.toString(b) : _;
  }
  return Uf;
}
var So = {}, hm = Hi, f0 = Nt.Buffer, Ao = function(h, n) {
  for (var l = f0.alloc(0), o = 0, m; l.length < n; )
    m = sm(o++), l = f0.concat([l, hm("sha1").update(h).update(m).digest()]);
  return l.slice(0, n);
};
function sm(h) {
  var n = f0.allocUnsafe(4);
  return n.writeUInt32BE(h, 0), n;
}
var Bo = function(n, l) {
  for (var o = n.length, m = -1; ++m < o; )
    n[m] ^= l[m];
  return n;
}, L0 = { exports: {} };
L0.exports;
(function(h) {
  (function(n, l) {
    function o(p, t) {
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
    typeof n == "object" ? n.exports = f : l.BN = f, f.BN = f, f.wordSize = 26;
    var b;
    try {
      typeof window < "u" && typeof window.Buffer < "u" ? b = window.Buffer : b = ge.Buffer;
    } catch {
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
      r === "hex" && (r = 16), o(r === (r | 0) && r >= 2 && r <= 36), t = t.toString().replace(/\s+/g, "");
      var a = 0;
      t[0] === "-" && (a++, this.negative = 1), a < t.length && (r === 16 ? this._parseHex(t, a, i) : (this._parseBase(t, r, a), i === "le" && this._initArray(this.toArray(), r, i)));
    }, f.prototype._initNumber = function(t, r, i) {
      t < 0 && (this.negative = 1, t = -t), t < 67108864 ? (this.words = [t & 67108863], this.length = 1) : t < 4503599627370496 ? (this.words = [
        t & 67108863,
        t / 67108864 & 67108863
      ], this.length = 2) : (o(t < 9007199254740992), this.words = [
        t & 67108863,
        t / 67108864 & 67108863,
        1
      ], this.length = 3), i === "le" && this._initArray(this.toArray(), r, i);
    }, f.prototype._initArray = function(t, r, i) {
      if (o(typeof t.length == "number"), t.length <= 0)
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
    function w(p, t) {
      var r = p.charCodeAt(t);
      return r >= 65 && r <= 70 ? r - 55 : r >= 97 && r <= 102 ? r - 87 : r - 48 & 15;
    }
    function _(p, t, r) {
      var i = w(p, r);
      return r - 1 >= t && (i |= w(p, r - 1) << 4), i;
    }
    f.prototype._parseHex = function(t, r, i) {
      this.length = Math.ceil((t.length - r) / 6), this.words = new Array(this.length);
      for (var a = 0; a < this.length; a++)
        this.words[a] = 0;
      var d = 0, c = 0, v;
      if (i === "be")
        for (a = t.length - 1; a >= r; a -= 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      else {
        var s = t.length - r;
        for (a = s % 2 === 0 ? r + 1 : r; a < t.length; a += 2)
          v = _(t, r, a) << d, this.words[c] |= v & 67108863, d >= 18 ? (d -= 18, c += 1, this.words[c] |= v >>> 26) : d += 8;
      }
      this.strip();
    };
    function S(p, t, r, i) {
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
      for (var c = t.length - i, v = c % a, s = Math.min(c, c - v) + i, e = 0, u = i; u < s; u += a)
        e = S(t, u, u + a, r), this.imuln(d), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
      if (v !== 0) {
        var g = 1;
        for (e = S(t, u, t.length, r), u = 0; u < v; u++)
          g *= r;
        this.imuln(g), this.words[0] + e < 67108864 ? this.words[0] += e : this._iaddn(e);
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
    var y = [
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
    ], B = [
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
          var v = this.words[c], s = ((v << a | d) & 16777215).toString(16);
          d = v >>> 24 - a & 16777215, a += 2, a >= 26 && (a -= 26, c--), d !== 0 || c !== this.length - 1 ? i = y[6 - s.length] + s + i : i = s + i;
        }
        for (d !== 0 && (i = d.toString(16) + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      if (t === (t | 0) && t >= 2 && t <= 36) {
        var e = x[t], u = B[t];
        i = "";
        var g = this.clone();
        for (g.negative = 0; !g.isZero(); ) {
          var M = g.modn(u).toString(t);
          g = g.idivn(u), g.isZero() ? i = M + i : i = y[e - M.length] + M + i;
        }
        for (this.isZero() && (i = "0" + i); i.length % r !== 0; )
          i = "0" + i;
        return this.negative !== 0 && (i = "-" + i), i;
      }
      o(!1, "Base should be between 2 and 36");
    }, f.prototype.toNumber = function() {
      var t = this.words[0];
      return this.length === 2 ? t += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? t += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && o(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -t : t;
    }, f.prototype.toJSON = function() {
      return this.toString(16);
    }, f.prototype.toBuffer = function(t, r) {
      return o(typeof b < "u"), this.toArrayLike(b, t, r);
    }, f.prototype.toArray = function(t, r) {
      return this.toArrayLike(Array, t, r);
    }, f.prototype.toArrayLike = function(t, r, i) {
      var a = this.byteLength(), d = i || Math.max(1, a);
      o(a <= d, "byte array longer than desired length"), o(d > 0, "Requested array length <= 0"), this.strip();
      var c = r === "le", v = new t(d), s, e, u = this.clone();
      if (c) {
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[e] = s;
        for (; e < d; e++)
          v[e] = 0;
      } else {
        for (e = 0; e < d - a; e++)
          v[e] = 0;
        for (e = 0; !u.isZero(); e++)
          s = u.andln(255), u.iushrn(8), v[d - e - 1] = s;
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
    function A(p) {
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
      return o((this.negative | t.negative) === 0), this.iuor(t);
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
      return o((this.negative | t.negative) === 0), this.iuand(t);
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
      return o((this.negative | t.negative) === 0), this.iuxor(t);
    }, f.prototype.xor = function(t) {
      return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this);
    }, f.prototype.uxor = function(t) {
      return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this);
    }, f.prototype.inotn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = Math.ceil(t / 26) | 0, i = t % 26;
      this._expand(r), i > 0 && r--;
      for (var a = 0; a < r; a++)
        this.words[a] = ~this.words[a] & 67108863;
      return i > 0 && (this.words[a] = ~this.words[a] & 67108863 >> 26 - i), this.strip();
    }, f.prototype.notn = function(t) {
      return this.clone().inotn(t);
    }, f.prototype.setn = function(t, r) {
      o(typeof t == "number" && t >= 0);
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
    function T(p, t, r) {
      r.negative = t.negative ^ p.negative;
      var i = p.length + t.length | 0;
      r.length = i, i = i - 1 | 0;
      var a = p.words[0] | 0, d = t.words[0] | 0, c = a * d, v = c & 67108863, s = c / 67108864 | 0;
      r.words[0] = v;
      for (var e = 1; e < i; e++) {
        for (var u = s >>> 26, g = s & 67108863, M = Math.min(e, t.length - 1), k = Math.max(0, e - p.length + 1); k <= M; k++) {
          var R = e - k | 0;
          a = p.words[R] | 0, d = t.words[k] | 0, c = a * d + g, u += c / 67108864 | 0, g = c & 67108863;
        }
        r.words[e] = g | 0, s = u | 0;
      }
      return s !== 0 ? r.words[e] = s | 0 : r.length--, r.strip();
    }
    var D = function(t, r, i) {
      var a = t.words, d = r.words, c = i.words, v = 0, s, e, u, g = a[0] | 0, M = g & 8191, k = g >>> 13, R = a[1] | 0, P = R & 8191, E = R >>> 13, I = a[2] | 0, C = I & 8191, $ = I >>> 13, Bt = a[3] | 0, L = Bt & 8191, z = Bt >>> 13, Ct = a[4] | 0, H = Ct & 8191, st = Ct >>> 13, Dt = a[5] | 0, Z = Dt & 8191, ot = Dt >>> 13, qt = a[6] | 0, W = qt & 8191, ht = qt >>> 13, Rt = a[7] | 0, K = Rt & 8191, at = Rt >>> 13, $t = a[8] | 0, V = $t & 8191, lt = $t >>> 13, Ft = a[9] | 0, Y = Ft & 8191, dt = Ft >>> 13, Lt = d[0] | 0, J = Lt & 8191, ct = Lt >>> 13, Ot = d[1] | 0, G = Ot & 8191, vt = Ot >>> 13, Ut = d[2] | 0, X = Ut & 8191, pt = Ut >>> 13, zt = d[3] | 0, j = zt & 8191, mt = zt >>> 13, Kt = d[4] | 0, Q = Kt & 8191, gt = Kt >>> 13, Ht = d[5] | 0, tt = Ht & 8191, bt = Ht >>> 13, Zt = d[6] | 0, et = Zt & 8191, yt = Zt >>> 13, Wt = d[7] | 0, rt = Wt & 8191, wt = Wt >>> 13, Vt = d[8] | 0, it = Vt & 8191, Mt = Vt >>> 13, Yt = d[9] | 0, nt = Yt & 8191, xt = Yt >>> 13;
      i.negative = t.negative ^ r.negative, i.length = 19, s = Math.imul(M, J), e = Math.imul(M, ct), e = e + Math.imul(k, J) | 0, u = Math.imul(k, ct);
      var It = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (It >>> 26) | 0, It &= 67108863, s = Math.imul(P, J), e = Math.imul(P, ct), e = e + Math.imul(E, J) | 0, u = Math.imul(E, ct), s = s + Math.imul(M, G) | 0, e = e + Math.imul(M, vt) | 0, e = e + Math.imul(k, G) | 0, u = u + Math.imul(k, vt) | 0;
      var Tt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Tt >>> 26) | 0, Tt &= 67108863, s = Math.imul(C, J), e = Math.imul(C, ct), e = e + Math.imul($, J) | 0, u = Math.imul($, ct), s = s + Math.imul(P, G) | 0, e = e + Math.imul(P, vt) | 0, e = e + Math.imul(E, G) | 0, u = u + Math.imul(E, vt) | 0, s = s + Math.imul(M, X) | 0, e = e + Math.imul(M, pt) | 0, e = e + Math.imul(k, X) | 0, u = u + Math.imul(k, pt) | 0;
      var jt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (jt >>> 26) | 0, jt &= 67108863, s = Math.imul(L, J), e = Math.imul(L, ct), e = e + Math.imul(z, J) | 0, u = Math.imul(z, ct), s = s + Math.imul(C, G) | 0, e = e + Math.imul(C, vt) | 0, e = e + Math.imul($, G) | 0, u = u + Math.imul($, vt) | 0, s = s + Math.imul(P, X) | 0, e = e + Math.imul(P, pt) | 0, e = e + Math.imul(E, X) | 0, u = u + Math.imul(E, pt) | 0, s = s + Math.imul(M, j) | 0, e = e + Math.imul(M, mt) | 0, e = e + Math.imul(k, j) | 0, u = u + Math.imul(k, mt) | 0;
      var Qt = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (Qt >>> 26) | 0, Qt &= 67108863, s = Math.imul(H, J), e = Math.imul(H, ct), e = e + Math.imul(st, J) | 0, u = Math.imul(st, ct), s = s + Math.imul(L, G) | 0, e = e + Math.imul(L, vt) | 0, e = e + Math.imul(z, G) | 0, u = u + Math.imul(z, vt) | 0, s = s + Math.imul(C, X) | 0, e = e + Math.imul(C, pt) | 0, e = e + Math.imul($, X) | 0, u = u + Math.imul($, pt) | 0, s = s + Math.imul(P, j) | 0, e = e + Math.imul(P, mt) | 0, e = e + Math.imul(E, j) | 0, u = u + Math.imul(E, mt) | 0, s = s + Math.imul(M, Q) | 0, e = e + Math.imul(M, gt) | 0, e = e + Math.imul(k, Q) | 0, u = u + Math.imul(k, gt) | 0;
      var te = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (te >>> 26) | 0, te &= 67108863, s = Math.imul(Z, J), e = Math.imul(Z, ct), e = e + Math.imul(ot, J) | 0, u = Math.imul(ot, ct), s = s + Math.imul(H, G) | 0, e = e + Math.imul(H, vt) | 0, e = e + Math.imul(st, G) | 0, u = u + Math.imul(st, vt) | 0, s = s + Math.imul(L, X) | 0, e = e + Math.imul(L, pt) | 0, e = e + Math.imul(z, X) | 0, u = u + Math.imul(z, pt) | 0, s = s + Math.imul(C, j) | 0, e = e + Math.imul(C, mt) | 0, e = e + Math.imul($, j) | 0, u = u + Math.imul($, mt) | 0, s = s + Math.imul(P, Q) | 0, e = e + Math.imul(P, gt) | 0, e = e + Math.imul(E, Q) | 0, u = u + Math.imul(E, gt) | 0, s = s + Math.imul(M, tt) | 0, e = e + Math.imul(M, bt) | 0, e = e + Math.imul(k, tt) | 0, u = u + Math.imul(k, bt) | 0;
      var ee = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ee >>> 26) | 0, ee &= 67108863, s = Math.imul(W, J), e = Math.imul(W, ct), e = e + Math.imul(ht, J) | 0, u = Math.imul(ht, ct), s = s + Math.imul(Z, G) | 0, e = e + Math.imul(Z, vt) | 0, e = e + Math.imul(ot, G) | 0, u = u + Math.imul(ot, vt) | 0, s = s + Math.imul(H, X) | 0, e = e + Math.imul(H, pt) | 0, e = e + Math.imul(st, X) | 0, u = u + Math.imul(st, pt) | 0, s = s + Math.imul(L, j) | 0, e = e + Math.imul(L, mt) | 0, e = e + Math.imul(z, j) | 0, u = u + Math.imul(z, mt) | 0, s = s + Math.imul(C, Q) | 0, e = e + Math.imul(C, gt) | 0, e = e + Math.imul($, Q) | 0, u = u + Math.imul($, gt) | 0, s = s + Math.imul(P, tt) | 0, e = e + Math.imul(P, bt) | 0, e = e + Math.imul(E, tt) | 0, u = u + Math.imul(E, bt) | 0, s = s + Math.imul(M, et) | 0, e = e + Math.imul(M, yt) | 0, e = e + Math.imul(k, et) | 0, u = u + Math.imul(k, yt) | 0;
      var re = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (re >>> 26) | 0, re &= 67108863, s = Math.imul(K, J), e = Math.imul(K, ct), e = e + Math.imul(at, J) | 0, u = Math.imul(at, ct), s = s + Math.imul(W, G) | 0, e = e + Math.imul(W, vt) | 0, e = e + Math.imul(ht, G) | 0, u = u + Math.imul(ht, vt) | 0, s = s + Math.imul(Z, X) | 0, e = e + Math.imul(Z, pt) | 0, e = e + Math.imul(ot, X) | 0, u = u + Math.imul(ot, pt) | 0, s = s + Math.imul(H, j) | 0, e = e + Math.imul(H, mt) | 0, e = e + Math.imul(st, j) | 0, u = u + Math.imul(st, mt) | 0, s = s + Math.imul(L, Q) | 0, e = e + Math.imul(L, gt) | 0, e = e + Math.imul(z, Q) | 0, u = u + Math.imul(z, gt) | 0, s = s + Math.imul(C, tt) | 0, e = e + Math.imul(C, bt) | 0, e = e + Math.imul($, tt) | 0, u = u + Math.imul($, bt) | 0, s = s + Math.imul(P, et) | 0, e = e + Math.imul(P, yt) | 0, e = e + Math.imul(E, et) | 0, u = u + Math.imul(E, yt) | 0, s = s + Math.imul(M, rt) | 0, e = e + Math.imul(M, wt) | 0, e = e + Math.imul(k, rt) | 0, u = u + Math.imul(k, wt) | 0;
      var ie = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ie >>> 26) | 0, ie &= 67108863, s = Math.imul(V, J), e = Math.imul(V, ct), e = e + Math.imul(lt, J) | 0, u = Math.imul(lt, ct), s = s + Math.imul(K, G) | 0, e = e + Math.imul(K, vt) | 0, e = e + Math.imul(at, G) | 0, u = u + Math.imul(at, vt) | 0, s = s + Math.imul(W, X) | 0, e = e + Math.imul(W, pt) | 0, e = e + Math.imul(ht, X) | 0, u = u + Math.imul(ht, pt) | 0, s = s + Math.imul(Z, j) | 0, e = e + Math.imul(Z, mt) | 0, e = e + Math.imul(ot, j) | 0, u = u + Math.imul(ot, mt) | 0, s = s + Math.imul(H, Q) | 0, e = e + Math.imul(H, gt) | 0, e = e + Math.imul(st, Q) | 0, u = u + Math.imul(st, gt) | 0, s = s + Math.imul(L, tt) | 0, e = e + Math.imul(L, bt) | 0, e = e + Math.imul(z, tt) | 0, u = u + Math.imul(z, bt) | 0, s = s + Math.imul(C, et) | 0, e = e + Math.imul(C, yt) | 0, e = e + Math.imul($, et) | 0, u = u + Math.imul($, yt) | 0, s = s + Math.imul(P, rt) | 0, e = e + Math.imul(P, wt) | 0, e = e + Math.imul(E, rt) | 0, u = u + Math.imul(E, wt) | 0, s = s + Math.imul(M, it) | 0, e = e + Math.imul(M, Mt) | 0, e = e + Math.imul(k, it) | 0, u = u + Math.imul(k, Mt) | 0;
      var ne = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ne >>> 26) | 0, ne &= 67108863, s = Math.imul(Y, J), e = Math.imul(Y, ct), e = e + Math.imul(dt, J) | 0, u = Math.imul(dt, ct), s = s + Math.imul(V, G) | 0, e = e + Math.imul(V, vt) | 0, e = e + Math.imul(lt, G) | 0, u = u + Math.imul(lt, vt) | 0, s = s + Math.imul(K, X) | 0, e = e + Math.imul(K, pt) | 0, e = e + Math.imul(at, X) | 0, u = u + Math.imul(at, pt) | 0, s = s + Math.imul(W, j) | 0, e = e + Math.imul(W, mt) | 0, e = e + Math.imul(ht, j) | 0, u = u + Math.imul(ht, mt) | 0, s = s + Math.imul(Z, Q) | 0, e = e + Math.imul(Z, gt) | 0, e = e + Math.imul(ot, Q) | 0, u = u + Math.imul(ot, gt) | 0, s = s + Math.imul(H, tt) | 0, e = e + Math.imul(H, bt) | 0, e = e + Math.imul(st, tt) | 0, u = u + Math.imul(st, bt) | 0, s = s + Math.imul(L, et) | 0, e = e + Math.imul(L, yt) | 0, e = e + Math.imul(z, et) | 0, u = u + Math.imul(z, yt) | 0, s = s + Math.imul(C, rt) | 0, e = e + Math.imul(C, wt) | 0, e = e + Math.imul($, rt) | 0, u = u + Math.imul($, wt) | 0, s = s + Math.imul(P, it) | 0, e = e + Math.imul(P, Mt) | 0, e = e + Math.imul(E, it) | 0, u = u + Math.imul(E, Mt) | 0, s = s + Math.imul(M, nt) | 0, e = e + Math.imul(M, xt) | 0, e = e + Math.imul(k, nt) | 0, u = u + Math.imul(k, xt) | 0;
      var fe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (fe >>> 26) | 0, fe &= 67108863, s = Math.imul(Y, G), e = Math.imul(Y, vt), e = e + Math.imul(dt, G) | 0, u = Math.imul(dt, vt), s = s + Math.imul(V, X) | 0, e = e + Math.imul(V, pt) | 0, e = e + Math.imul(lt, X) | 0, u = u + Math.imul(lt, pt) | 0, s = s + Math.imul(K, j) | 0, e = e + Math.imul(K, mt) | 0, e = e + Math.imul(at, j) | 0, u = u + Math.imul(at, mt) | 0, s = s + Math.imul(W, Q) | 0, e = e + Math.imul(W, gt) | 0, e = e + Math.imul(ht, Q) | 0, u = u + Math.imul(ht, gt) | 0, s = s + Math.imul(Z, tt) | 0, e = e + Math.imul(Z, bt) | 0, e = e + Math.imul(ot, tt) | 0, u = u + Math.imul(ot, bt) | 0, s = s + Math.imul(H, et) | 0, e = e + Math.imul(H, yt) | 0, e = e + Math.imul(st, et) | 0, u = u + Math.imul(st, yt) | 0, s = s + Math.imul(L, rt) | 0, e = e + Math.imul(L, wt) | 0, e = e + Math.imul(z, rt) | 0, u = u + Math.imul(z, wt) | 0, s = s + Math.imul(C, it) | 0, e = e + Math.imul(C, Mt) | 0, e = e + Math.imul($, it) | 0, u = u + Math.imul($, Mt) | 0, s = s + Math.imul(P, nt) | 0, e = e + Math.imul(P, xt) | 0, e = e + Math.imul(E, nt) | 0, u = u + Math.imul(E, xt) | 0;
      var ae = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ae >>> 26) | 0, ae &= 67108863, s = Math.imul(Y, X), e = Math.imul(Y, pt), e = e + Math.imul(dt, X) | 0, u = Math.imul(dt, pt), s = s + Math.imul(V, j) | 0, e = e + Math.imul(V, mt) | 0, e = e + Math.imul(lt, j) | 0, u = u + Math.imul(lt, mt) | 0, s = s + Math.imul(K, Q) | 0, e = e + Math.imul(K, gt) | 0, e = e + Math.imul(at, Q) | 0, u = u + Math.imul(at, gt) | 0, s = s + Math.imul(W, tt) | 0, e = e + Math.imul(W, bt) | 0, e = e + Math.imul(ht, tt) | 0, u = u + Math.imul(ht, bt) | 0, s = s + Math.imul(Z, et) | 0, e = e + Math.imul(Z, yt) | 0, e = e + Math.imul(ot, et) | 0, u = u + Math.imul(ot, yt) | 0, s = s + Math.imul(H, rt) | 0, e = e + Math.imul(H, wt) | 0, e = e + Math.imul(st, rt) | 0, u = u + Math.imul(st, wt) | 0, s = s + Math.imul(L, it) | 0, e = e + Math.imul(L, Mt) | 0, e = e + Math.imul(z, it) | 0, u = u + Math.imul(z, Mt) | 0, s = s + Math.imul(C, nt) | 0, e = e + Math.imul(C, xt) | 0, e = e + Math.imul($, nt) | 0, u = u + Math.imul($, xt) | 0;
      var he = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (he >>> 26) | 0, he &= 67108863, s = Math.imul(Y, j), e = Math.imul(Y, mt), e = e + Math.imul(dt, j) | 0, u = Math.imul(dt, mt), s = s + Math.imul(V, Q) | 0, e = e + Math.imul(V, gt) | 0, e = e + Math.imul(lt, Q) | 0, u = u + Math.imul(lt, gt) | 0, s = s + Math.imul(K, tt) | 0, e = e + Math.imul(K, bt) | 0, e = e + Math.imul(at, tt) | 0, u = u + Math.imul(at, bt) | 0, s = s + Math.imul(W, et) | 0, e = e + Math.imul(W, yt) | 0, e = e + Math.imul(ht, et) | 0, u = u + Math.imul(ht, yt) | 0, s = s + Math.imul(Z, rt) | 0, e = e + Math.imul(Z, wt) | 0, e = e + Math.imul(ot, rt) | 0, u = u + Math.imul(ot, wt) | 0, s = s + Math.imul(H, it) | 0, e = e + Math.imul(H, Mt) | 0, e = e + Math.imul(st, it) | 0, u = u + Math.imul(st, Mt) | 0, s = s + Math.imul(L, nt) | 0, e = e + Math.imul(L, xt) | 0, e = e + Math.imul(z, nt) | 0, u = u + Math.imul(z, xt) | 0;
      var se = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (se >>> 26) | 0, se &= 67108863, s = Math.imul(Y, Q), e = Math.imul(Y, gt), e = e + Math.imul(dt, Q) | 0, u = Math.imul(dt, gt), s = s + Math.imul(V, tt) | 0, e = e + Math.imul(V, bt) | 0, e = e + Math.imul(lt, tt) | 0, u = u + Math.imul(lt, bt) | 0, s = s + Math.imul(K, et) | 0, e = e + Math.imul(K, yt) | 0, e = e + Math.imul(at, et) | 0, u = u + Math.imul(at, yt) | 0, s = s + Math.imul(W, rt) | 0, e = e + Math.imul(W, wt) | 0, e = e + Math.imul(ht, rt) | 0, u = u + Math.imul(ht, wt) | 0, s = s + Math.imul(Z, it) | 0, e = e + Math.imul(Z, Mt) | 0, e = e + Math.imul(ot, it) | 0, u = u + Math.imul(ot, Mt) | 0, s = s + Math.imul(H, nt) | 0, e = e + Math.imul(H, xt) | 0, e = e + Math.imul(st, nt) | 0, u = u + Math.imul(st, xt) | 0;
      var oe = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (oe >>> 26) | 0, oe &= 67108863, s = Math.imul(Y, tt), e = Math.imul(Y, bt), e = e + Math.imul(dt, tt) | 0, u = Math.imul(dt, bt), s = s + Math.imul(V, et) | 0, e = e + Math.imul(V, yt) | 0, e = e + Math.imul(lt, et) | 0, u = u + Math.imul(lt, yt) | 0, s = s + Math.imul(K, rt) | 0, e = e + Math.imul(K, wt) | 0, e = e + Math.imul(at, rt) | 0, u = u + Math.imul(at, wt) | 0, s = s + Math.imul(W, it) | 0, e = e + Math.imul(W, Mt) | 0, e = e + Math.imul(ht, it) | 0, u = u + Math.imul(ht, Mt) | 0, s = s + Math.imul(Z, nt) | 0, e = e + Math.imul(Z, xt) | 0, e = e + Math.imul(ot, nt) | 0, u = u + Math.imul(ot, xt) | 0;
      var ue = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ue >>> 26) | 0, ue &= 67108863, s = Math.imul(Y, et), e = Math.imul(Y, yt), e = e + Math.imul(dt, et) | 0, u = Math.imul(dt, yt), s = s + Math.imul(V, rt) | 0, e = e + Math.imul(V, wt) | 0, e = e + Math.imul(lt, rt) | 0, u = u + Math.imul(lt, wt) | 0, s = s + Math.imul(K, it) | 0, e = e + Math.imul(K, Mt) | 0, e = e + Math.imul(at, it) | 0, u = u + Math.imul(at, Mt) | 0, s = s + Math.imul(W, nt) | 0, e = e + Math.imul(W, xt) | 0, e = e + Math.imul(ht, nt) | 0, u = u + Math.imul(ht, xt) | 0;
      var le = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (le >>> 26) | 0, le &= 67108863, s = Math.imul(Y, rt), e = Math.imul(Y, wt), e = e + Math.imul(dt, rt) | 0, u = Math.imul(dt, wt), s = s + Math.imul(V, it) | 0, e = e + Math.imul(V, Mt) | 0, e = e + Math.imul(lt, it) | 0, u = u + Math.imul(lt, Mt) | 0, s = s + Math.imul(K, nt) | 0, e = e + Math.imul(K, xt) | 0, e = e + Math.imul(at, nt) | 0, u = u + Math.imul(at, xt) | 0;
      var de = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (de >>> 26) | 0, de &= 67108863, s = Math.imul(Y, it), e = Math.imul(Y, Mt), e = e + Math.imul(dt, it) | 0, u = Math.imul(dt, Mt), s = s + Math.imul(V, nt) | 0, e = e + Math.imul(V, xt) | 0, e = e + Math.imul(lt, nt) | 0, u = u + Math.imul(lt, xt) | 0;
      var ce = (v + s | 0) + ((e & 8191) << 13) | 0;
      v = (u + (e >>> 13) | 0) + (ce >>> 26) | 0, ce &= 67108863, s = Math.imul(Y, nt), e = Math.imul(Y, xt), e = e + Math.imul(dt, nt) | 0, u = Math.imul(dt, xt);
      var ve = (v + s | 0) + ((e & 8191) << 13) | 0;
      return v = (u + (e >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, c[0] = It, c[1] = Tt, c[2] = jt, c[3] = Qt, c[4] = te, c[5] = ee, c[6] = re, c[7] = ie, c[8] = ne, c[9] = fe, c[10] = ae, c[11] = he, c[12] = se, c[13] = oe, c[14] = ue, c[15] = le, c[16] = de, c[17] = ce, c[18] = ve, v !== 0 && (c[19] = v, i.length++), i;
    };
    Math.imul || (D = T);
    function O(p, t, r) {
      r.negative = t.negative ^ p.negative, r.length = p.length + t.length;
      for (var i = 0, a = 0, d = 0; d < r.length - 1; d++) {
        var c = a;
        a = 0;
        for (var v = i & 67108863, s = Math.min(d, t.length - 1), e = Math.max(0, d - p.length + 1); e <= s; e++) {
          var u = d - e, g = p.words[u] | 0, M = t.words[e] | 0, k = g * M, R = k & 67108863;
          c = c + (k / 67108864 | 0) | 0, R = R + v | 0, v = R & 67108863, c = c + (R >>> 26) | 0, a += c >>> 26, c &= 67108863;
        }
        r.words[d] = v, i = c, c = a;
      }
      return i !== 0 ? r.words[d] = i : r.length--, r.strip();
    }
    function N(p, t, r) {
      var i = new q();
      return i.mulp(p, t, r);
    }
    f.prototype.mulTo = function(t, r) {
      var i, a = this.length + t.length;
      return this.length === 10 && t.length === 10 ? i = D(this, t, r) : a < 63 ? i = T(this, t, r) : a < 1024 ? i = O(this, t, r) : i = N(this, t, r), i;
    };
    function q(p, t) {
      this.x = p, this.y = t;
    }
    q.prototype.makeRBT = function(t) {
      for (var r = new Array(t), i = f.prototype._countBits(t) - 1, a = 0; a < t; a++)
        r[a] = this.revBin(a, i, t);
      return r;
    }, q.prototype.revBin = function(t, r, i) {
      if (t === 0 || t === i - 1)
        return t;
      for (var a = 0, d = 0; d < r; d++)
        a |= (t & 1) << r - d - 1, t >>= 1;
      return a;
    }, q.prototype.permute = function(t, r, i, a, d, c) {
      for (var v = 0; v < c; v++)
        a[v] = r[t[v]], d[v] = i[t[v]];
    }, q.prototype.transform = function(t, r, i, a, d, c) {
      this.permute(c, t, r, i, a, d);
      for (var v = 1; v < d; v <<= 1)
        for (var s = v << 1, e = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), g = 0; g < d; g += s)
          for (var M = e, k = u, R = 0; R < v; R++) {
            var P = i[g + R], E = a[g + R], I = i[g + R + v], C = a[g + R + v], $ = M * I - k * C;
            C = M * C + k * I, I = $, i[g + R] = P + I, a[g + R] = E + C, i[g + R + v] = P - I, a[g + R + v] = E - C, R !== s && ($ = e * M - u * k, k = e * k + u * M, M = $);
          }
    }, q.prototype.guessLen13b = function(t, r) {
      var i = Math.max(r, t) | 1, a = i & 1, d = 0;
      for (i = i / 2 | 0; i; i = i >>> 1)
        d++;
      return 1 << d + 1 + a;
    }, q.prototype.conjugate = function(t, r, i) {
      if (!(i <= 1))
        for (var a = 0; a < i / 2; a++) {
          var d = t[a];
          t[a] = t[i - a - 1], t[i - a - 1] = d, d = r[a], r[a] = -r[i - a - 1], r[i - a - 1] = -d;
        }
    }, q.prototype.normalize13b = function(t, r) {
      for (var i = 0, a = 0; a < r / 2; a++) {
        var d = Math.round(t[2 * a + 1] / r) * 8192 + Math.round(t[2 * a] / r) + i;
        t[a] = d & 67108863, d < 67108864 ? i = 0 : i = d / 67108864 | 0;
      }
      return t;
    }, q.prototype.convert13b = function(t, r, i, a) {
      for (var d = 0, c = 0; c < r; c++)
        d = d + (t[c] | 0), i[2 * c] = d & 8191, d = d >>> 13, i[2 * c + 1] = d & 8191, d = d >>> 13;
      for (c = 2 * r; c < a; ++c)
        i[c] = 0;
      o(d === 0), o((d & -8192) === 0);
    }, q.prototype.stub = function(t) {
      for (var r = new Array(t), i = 0; i < t; i++)
        r[i] = 0;
      return r;
    }, q.prototype.mulp = function(t, r, i) {
      var a = 2 * this.guessLen13b(t.length, r.length), d = this.makeRBT(a), c = this.stub(a), v = new Array(a), s = new Array(a), e = new Array(a), u = new Array(a), g = new Array(a), M = new Array(a), k = i.words;
      k.length = a, this.convert13b(t.words, t.length, v, a), this.convert13b(r.words, r.length, u, a), this.transform(v, c, s, e, a, d), this.transform(u, c, g, M, a, d);
      for (var R = 0; R < a; R++) {
        var P = s[R] * g[R] - e[R] * M[R];
        e[R] = s[R] * M[R] + e[R] * g[R], s[R] = P;
      }
      return this.conjugate(s, e, a), this.transform(s, e, k, c, a, d), this.conjugate(k, c, a), this.normalize13b(k, a), i.negative = t.negative ^ r.negative, i.length = t.length + r.length, i.strip();
    }, f.prototype.mul = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), this.mulTo(t, r);
    }, f.prototype.mulf = function(t) {
      var r = new f(null);
      return r.words = new Array(this.length + t.length), N(this, t, r);
    }, f.prototype.imul = function(t) {
      return this.clone().mulTo(t, this);
    }, f.prototype.imuln = function(t) {
      o(typeof t == "number"), o(t < 67108864);
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
      var r = A(t);
      if (r.length === 0)
        return new f(1);
      for (var i = this, a = 0; a < r.length && r[a] === 0; a++, i = i.sqr())
        ;
      if (++a < r.length)
        for (var d = i.sqr(); a < r.length; a++, d = d.sqr())
          r[a] !== 0 && (i = i.mul(d));
      return i;
    }, f.prototype.iushln = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 67108863 >>> 26 - r << 26 - r, d;
      if (r !== 0) {
        var c = 0;
        for (d = 0; d < this.length; d++) {
          var v = this.words[d] & a, s = (this.words[d] | 0) - v << r;
          this.words[d] = s | c, c = v >>> 26 - r;
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
      return o(this.negative === 0), this.iushln(t);
    }, f.prototype.iushrn = function(t, r, i) {
      o(typeof t == "number" && t >= 0);
      var a;
      r ? a = (r - r % 26) / 26 : a = 0;
      var d = t % 26, c = Math.min((t - d) / 26, this.length), v = 67108863 ^ 67108863 >>> d << d, s = i;
      if (a -= c, a = Math.max(0, a), s) {
        for (var e = 0; e < c; e++)
          s.words[e] = this.words[e];
        s.length = c;
      }
      if (c !== 0)
        if (this.length > c)
          for (this.length -= c, e = 0; e < this.length; e++)
            this.words[e] = this.words[e + c];
        else
          this.words[0] = 0, this.length = 1;
      var u = 0;
      for (e = this.length - 1; e >= 0 && (u !== 0 || e >= a); e--) {
        var g = this.words[e] | 0;
        this.words[e] = u << 26 - d | g >>> d, u = g & v;
      }
      return s && u !== 0 && (s.words[s.length++] = u), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
    }, f.prototype.ishrn = function(t, r, i) {
      return o(this.negative === 0), this.iushrn(t, r, i);
    }, f.prototype.shln = function(t) {
      return this.clone().ishln(t);
    }, f.prototype.ushln = function(t) {
      return this.clone().iushln(t);
    }, f.prototype.shrn = function(t) {
      return this.clone().ishrn(t);
    }, f.prototype.ushrn = function(t) {
      return this.clone().iushrn(t);
    }, f.prototype.testn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26, a = 1 << r;
      if (this.length <= i)
        return !1;
      var d = this.words[i];
      return !!(d & a);
    }, f.prototype.imaskn = function(t) {
      o(typeof t == "number" && t >= 0);
      var r = t % 26, i = (t - r) / 26;
      if (o(this.negative === 0, "imaskn works only with positive numbers"), this.length <= i)
        return this;
      if (r !== 0 && i++, this.length = Math.min(i, this.length), r !== 0) {
        var a = 67108863 ^ 67108863 >>> r << r;
        this.words[this.length - 1] &= a;
      }
      return this.strip();
    }, f.prototype.maskn = function(t) {
      return this.clone().imaskn(t);
    }, f.prototype.iaddn = function(t) {
      return o(typeof t == "number"), o(t < 67108864), t < 0 ? this.isubn(-t) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < t ? (this.words[0] = t - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(t), this.negative = 1, this) : this._iaddn(t);
    }, f.prototype._iaddn = function(t) {
      this.words[0] += t;
      for (var r = 0; r < this.length && this.words[r] >= 67108864; r++)
        this.words[r] -= 67108864, r === this.length - 1 ? this.words[r + 1] = 1 : this.words[r + 1]++;
      return this.length = Math.max(this.length, r + 1), this;
    }, f.prototype.isubn = function(t) {
      if (o(typeof t == "number"), o(t < 67108864), t < 0)
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
        var s = (t.words[d] | 0) * r;
        c -= s & 67108863, v = (c >> 26) - (s / 67108864 | 0), this.words[d + i] = c & 67108863;
      }
      for (; d < this.length - i; d++)
        c = (this.words[d + i] | 0) + v, v = c >> 26, this.words[d + i] = c & 67108863;
      if (v === 0)
        return this.strip();
      for (o(v === -1), v = 0, d = 0; d < this.length; d++)
        c = -(this.words[d] | 0) + v, v = c >> 26, this.words[d] = c & 67108863;
      return this.negative = 1, this.strip();
    }, f.prototype._wordDiv = function(t, r) {
      var i = this.length - t.length, a = this.clone(), d = t, c = d.words[d.length - 1] | 0, v = this._countBits(c);
      i = 26 - v, i !== 0 && (d = d.ushln(i), a.iushln(i), c = d.words[d.length - 1] | 0);
      var s = a.length - d.length, e;
      if (r !== "mod") {
        e = new f(null), e.length = s + 1, e.words = new Array(e.length);
        for (var u = 0; u < e.length; u++)
          e.words[u] = 0;
      }
      var g = a.clone()._ishlnsubmul(d, 1, s);
      g.negative === 0 && (a = g, e && (e.words[s] = 1));
      for (var M = s - 1; M >= 0; M--) {
        var k = (a.words[d.length + M] | 0) * 67108864 + (a.words[d.length + M - 1] | 0);
        for (k = Math.min(k / c | 0, 67108863), a._ishlnsubmul(d, k, M); a.negative !== 0; )
          k--, a.negative = 0, a._ishlnsubmul(d, 1, M), a.isZero() || (a.negative ^= 1);
        e && (e.words[M] = k);
      }
      return e && e.strip(), a.strip(), r !== "div" && i !== 0 && a.iushrn(i), {
        div: e || null,
        mod: a
      };
    }, f.prototype.divmod = function(t, r, i) {
      if (o(!t.isZero()), this.isZero())
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
      o(t <= 67108863);
      for (var r = (1 << 26) % t, i = 0, a = this.length - 1; a >= 0; a--)
        i = (r * i + (this.words[a] | 0)) % t;
      return i;
    }, f.prototype.idivn = function(t) {
      o(t <= 67108863);
      for (var r = 0, i = this.length - 1; i >= 0; i--) {
        var a = (this.words[i] | 0) + r * 67108864;
        this.words[i] = a / t | 0, r = a % t;
      }
      return this.strip();
    }, f.prototype.divn = function(t) {
      return this.clone().idivn(t);
    }, f.prototype.egcd = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = new f(0), v = new f(1), s = 0; r.isEven() && i.isEven(); )
        r.iushrn(1), i.iushrn(1), ++s;
      for (var e = i.clone(), u = r.clone(); !r.isZero(); ) {
        for (var g = 0, M = 1; !(r.words[0] & M) && g < 26; ++g, M <<= 1)
          ;
        if (g > 0)
          for (r.iushrn(g); g-- > 0; )
            (a.isOdd() || d.isOdd()) && (a.iadd(e), d.isub(u)), a.iushrn(1), d.iushrn(1);
        for (var k = 0, R = 1; !(i.words[0] & R) && k < 26; ++k, R <<= 1)
          ;
        if (k > 0)
          for (i.iushrn(k); k-- > 0; )
            (c.isOdd() || v.isOdd()) && (c.iadd(e), v.isub(u)), c.iushrn(1), v.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(c), d.isub(v)) : (i.isub(r), c.isub(a), v.isub(d));
      }
      return {
        a: c,
        b: v,
        gcd: i.iushln(s)
      };
    }, f.prototype._invmp = function(t) {
      o(t.negative === 0), o(!t.isZero());
      var r = this, i = t.clone();
      r.negative !== 0 ? r = r.umod(t) : r = r.clone();
      for (var a = new f(1), d = new f(0), c = i.clone(); r.cmpn(1) > 0 && i.cmpn(1) > 0; ) {
        for (var v = 0, s = 1; !(r.words[0] & s) && v < 26; ++v, s <<= 1)
          ;
        if (v > 0)
          for (r.iushrn(v); v-- > 0; )
            a.isOdd() && a.iadd(c), a.iushrn(1);
        for (var e = 0, u = 1; !(i.words[0] & u) && e < 26; ++e, u <<= 1)
          ;
        if (e > 0)
          for (i.iushrn(e); e-- > 0; )
            d.isOdd() && d.iadd(c), d.iushrn(1);
        r.cmp(i) >= 0 ? (r.isub(i), a.isub(d)) : (i.isub(r), d.isub(a));
      }
      var g;
      return r.cmpn(1) === 0 ? g = a : g = d, g.cmpn(0) < 0 && g.iadd(t), g;
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
      o(typeof t == "number");
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
        r && (t = -t), o(t <= 67108863, "Number is too big");
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
      return new U(t);
    }, f.prototype.toRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), o(this.negative === 0, "red works only with positives"), t.convertTo(this)._forceRed(t);
    }, f.prototype.fromRed = function() {
      return o(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
    }, f.prototype._forceRed = function(t) {
      return this.red = t, this;
    }, f.prototype.forceRed = function(t) {
      return o(!this.red, "Already a number in reduction context"), this._forceRed(t);
    }, f.prototype.redAdd = function(t) {
      return o(this.red, "redAdd works only with red numbers"), this.red.add(this, t);
    }, f.prototype.redIAdd = function(t) {
      return o(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, t);
    }, f.prototype.redSub = function(t) {
      return o(this.red, "redSub works only with red numbers"), this.red.sub(this, t);
    }, f.prototype.redISub = function(t) {
      return o(this.red, "redISub works only with red numbers"), this.red.isub(this, t);
    }, f.prototype.redShl = function(t) {
      return o(this.red, "redShl works only with red numbers"), this.red.shl(this, t);
    }, f.prototype.redMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.mul(this, t);
    }, f.prototype.redIMul = function(t) {
      return o(this.red, "redMul works only with red numbers"), this.red._verify2(this, t), this.red.imul(this, t);
    }, f.prototype.redSqr = function() {
      return o(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
    }, f.prototype.redISqr = function() {
      return o(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
    }, f.prototype.redSqrt = function() {
      return o(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
    }, f.prototype.redInvm = function() {
      return o(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
    }, f.prototype.redNeg = function() {
      return o(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
    }, f.prototype.redPow = function(t) {
      return o(this.red && !t.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, t);
    };
    var ft = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };
    function F(p, t) {
      this.name = p, this.p = new f(t, 16), this.n = this.p.bitLength(), this.k = new f(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
    }
    F.prototype._tmp = function() {
      var t = new f(null);
      return t.words = new Array(Math.ceil(this.n / 13)), t;
    }, F.prototype.ireduce = function(t) {
      var r = t, i;
      do
        this.split(r, this.tmp), r = this.imulK(r), r = r.iadd(this.tmp), i = r.bitLength();
      while (i > this.n);
      var a = i < this.n ? -1 : r.ucmp(this.p);
      return a === 0 ? (r.words[0] = 0, r.length = 1) : a > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip(), r;
    }, F.prototype.split = function(t, r) {
      t.iushrn(this.n, 0, r);
    }, F.prototype.imulK = function(t) {
      return t.imul(this.k);
    };
    function _t() {
      F.call(
        this,
        "k256",
        "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
      );
    }
    m(_t, F), _t.prototype.split = function(t, r) {
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
    }, _t.prototype.imulK = function(t) {
      t.words[t.length] = 0, t.words[t.length + 1] = 0, t.length += 2;
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = t.words[i] | 0;
        r += a * 977, t.words[i] = r & 67108863, r = a * 64 + (r / 67108864 | 0);
      }
      return t.words[t.length - 1] === 0 && (t.length--, t.words[t.length - 1] === 0 && t.length--), t;
    };
    function St() {
      F.call(
        this,
        "p224",
        "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
      );
    }
    m(St, F);
    function kt() {
      F.call(
        this,
        "p192",
        "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
      );
    }
    m(kt, F);
    function At() {
      F.call(
        this,
        "25519",
        "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
      );
    }
    m(At, F), At.prototype.imulK = function(t) {
      for (var r = 0, i = 0; i < t.length; i++) {
        var a = (t.words[i] | 0) * 19 + r, d = a & 67108863;
        a >>>= 26, t.words[i] = d, r = a;
      }
      return r !== 0 && (t.words[t.length++] = r), t;
    }, f._prime = function(t) {
      if (ft[t])
        return ft[t];
      var r;
      if (t === "k256")
        r = new _t();
      else if (t === "p224")
        r = new St();
      else if (t === "p192")
        r = new kt();
      else if (t === "p25519")
        r = new At();
      else
        throw new Error("Unknown prime " + t);
      return ft[t] = r, r;
    };
    function U(p) {
      if (typeof p == "string") {
        var t = f._prime(p);
        this.m = t.p, this.prime = t;
      } else
        o(p.gtn(1), "modulus must be greater than 1"), this.m = p, this.prime = null;
    }
    U.prototype._verify1 = function(t) {
      o(t.negative === 0, "red works only with positives"), o(t.red, "red works only with red numbers");
    }, U.prototype._verify2 = function(t, r) {
      o((t.negative | r.negative) === 0, "red works only with positives"), o(
        t.red && t.red === r.red,
        "red works only with red numbers"
      );
    }, U.prototype.imod = function(t) {
      return this.prime ? this.prime.ireduce(t)._forceRed(this) : t.umod(this.m)._forceRed(this);
    }, U.prototype.neg = function(t) {
      return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
    }, U.prototype.add = function(t, r) {
      this._verify2(t, r);
      var i = t.add(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i._forceRed(this);
    }, U.prototype.iadd = function(t, r) {
      this._verify2(t, r);
      var i = t.iadd(r);
      return i.cmp(this.m) >= 0 && i.isub(this.m), i;
    }, U.prototype.sub = function(t, r) {
      this._verify2(t, r);
      var i = t.sub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i._forceRed(this);
    }, U.prototype.isub = function(t, r) {
      this._verify2(t, r);
      var i = t.isub(r);
      return i.cmpn(0) < 0 && i.iadd(this.m), i;
    }, U.prototype.shl = function(t, r) {
      return this._verify1(t), this.imod(t.ushln(r));
    }, U.prototype.imul = function(t, r) {
      return this._verify2(t, r), this.imod(t.imul(r));
    }, U.prototype.mul = function(t, r) {
      return this._verify2(t, r), this.imod(t.mul(r));
    }, U.prototype.isqr = function(t) {
      return this.imul(t, t.clone());
    }, U.prototype.sqr = function(t) {
      return this.mul(t, t);
    }, U.prototype.sqrt = function(t) {
      if (t.isZero())
        return t.clone();
      var r = this.m.andln(3);
      if (o(r % 2 === 1), r === 3) {
        var i = this.m.add(new f(1)).iushrn(2);
        return this.pow(t, i);
      }
      for (var a = this.m.subn(1), d = 0; !a.isZero() && a.andln(1) === 0; )
        d++, a.iushrn(1);
      o(!a.isZero());
      var c = new f(1).toRed(this), v = c.redNeg(), s = this.m.subn(1).iushrn(1), e = this.m.bitLength();
      for (e = new f(2 * e * e).toRed(this); this.pow(e, s).cmp(v) !== 0; )
        e.redIAdd(v);
      for (var u = this.pow(e, a), g = this.pow(t, a.addn(1).iushrn(1)), M = this.pow(t, a), k = d; M.cmp(c) !== 0; ) {
        for (var R = M, P = 0; R.cmp(c) !== 0; P++)
          R = R.redSqr();
        o(P < k);
        var E = this.pow(u, new f(1).iushln(k - P - 1));
        g = g.redMul(E), u = E.redSqr(), M = M.redMul(u), k = P;
      }
      return g;
    }, U.prototype.invm = function(t) {
      var r = t._invmp(this.m);
      return r.negative !== 0 ? (r.negative = 0, this.imod(r).redNeg()) : this.imod(r);
    }, U.prototype.pow = function(t, r) {
      if (r.isZero())
        return new f(1).toRed(this);
      if (r.cmpn(1) === 0)
        return t.clone();
      var i = 4, a = new Array(1 << i);
      a[0] = new f(1).toRed(this), a[1] = t;
      for (var d = 2; d < a.length; d++)
        a[d] = this.mul(a[d - 1], t);
      var c = a[0], v = 0, s = 0, e = r.bitLength() % 26;
      for (e === 0 && (e = 26), d = r.length - 1; d >= 0; d--) {
        for (var u = r.words[d], g = e - 1; g >= 0; g--) {
          var M = u >> g & 1;
          if (c !== a[0] && (c = this.sqr(c)), M === 0 && v === 0) {
            s = 0;
            continue;
          }
          v <<= 1, v |= M, s++, !(s !== i && (d !== 0 || g !== 0)) && (c = this.mul(c, a[v]), s = 0, v = 0);
        }
        e = 26;
      }
      return c;
    }, U.prototype.convertTo = function(t) {
      var r = t.umod(this.m);
      return r === t ? r.clone() : r;
    }, U.prototype.convertFrom = function(t) {
      var r = t.clone();
      return r.red = null, r;
    }, f.mont = function(t) {
      return new Et(t);
    };
    function Et(p) {
      U.call(this, p), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new f(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
    }
    m(Et, U), Et.prototype.convertTo = function(t) {
      return this.imod(t.ushln(this.shift));
    }, Et.prototype.convertFrom = function(t) {
      var r = this.imod(t.mul(this.rinv));
      return r.red = null, r;
    }, Et.prototype.imul = function(t, r) {
      if (t.isZero() || r.isZero())
        return t.words[0] = 0, t.length = 1, t;
      var i = t.imul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.mul = function(t, r) {
      if (t.isZero() || r.isZero())
        return new f(0)._forceRed(this);
      var i = t.mul(r), a = i.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), d = i.isub(a).iushrn(this.shift), c = d;
      return d.cmp(this.m) >= 0 ? c = d.isub(this.m) : d.cmpn(0) < 0 && (c = d.iadd(this.m)), c._forceRed(this);
    }, Et.prototype.invm = function(t) {
      var r = this.imod(t._invmp(this.m).mul(this.r2));
      return r._forceRed(this);
    };
  })(h, Gt);
})(L0);
var O0 = L0.exports, Qa = O0, om = Nt.Buffer;
function um(h, n) {
  return om.from(h.toRed(Qa.mont(n.modulus)).redPow(new Qa(n.publicExponent)).fromRed().toArray());
}
var Eo = um, lm = Qn, a0 = li, dm = Hi, th = Ao, eh = Bo, U0 = O0, cm = Eo, vm = R0, Je = Nt.Buffer, pm = function(n, l, o) {
  var m;
  n.padding ? m = n.padding : o ? m = 1 : m = 4;
  var f = lm(n), b;
  if (m === 4)
    b = mm(f, l);
  else if (m === 1)
    b = gm(f, l, o);
  else if (m === 3) {
    if (b = new U0(l), b.cmp(f.modulus) >= 0)
      throw new Error("data too long for modulus");
  } else
    throw new Error("unknown padding");
  return o ? vm(b, f) : cm(b, f);
};
function mm(h, n) {
  var l = h.modulus.byteLength(), o = n.length, m = dm("sha1").update(Je.alloc(0)).digest(), f = m.length, b = 2 * f;
  if (o > l - b - 2)
    throw new Error("message too long");
  var w = Je.alloc(l - o - b - 2), _ = l - f - 1, S = a0(f), y = eh(Je.concat([m, w, Je.alloc(1, 1), n], _), th(S, _)), x = eh(S, th(y, f));
  return new U0(Je.concat([Je.alloc(1), x, y], l));
}
function gm(h, n, l) {
  var o = n.length, m = h.modulus.byteLength();
  if (o > m - 11)
    throw new Error("message too long");
  var f;
  return l ? f = Je.alloc(m - o - 3, 255) : f = bm(m - o - 3), new U0(Je.concat([Je.from([0, l ? 1 : 2]), f, Je.alloc(1), n], m));
}
function bm(h) {
  for (var n = Je.allocUnsafe(h), l = 0, o = a0(h * 2), m = 0, f; l < h; )
    m === o.length && (o = a0(h * 2), m = 0), f = o[m++], f && (n[l++] = f);
  return n;
}
var ym = Qn, rh = Ao, ih = Bo, nh = O0, wm = R0, Mm = Hi, xm = Eo, Fi = Nt.Buffer, _m = function(n, l, o) {
  var m;
  n.padding ? m = n.padding : o ? m = 1 : m = 4;
  var f = ym(n), b = f.modulus.byteLength();
  if (l.length > b || new nh(l).cmp(f.modulus) >= 0)
    throw new Error("decryption error");
  var w;
  o ? w = xm(new nh(l), f) : w = wm(l, f);
  var _ = Fi.alloc(b - w.length);
  if (w = Fi.concat([_, w], b), m === 4)
    return Sm(f, w);
  if (m === 1)
    return Am(f, w, o);
  if (m === 3)
    return w;
  throw new Error("unknown padding");
};
function Sm(h, n) {
  var l = h.modulus.byteLength(), o = Mm("sha1").update(Fi.alloc(0)).digest(), m = o.length;
  if (n[0] !== 0)
    throw new Error("decryption error");
  var f = n.slice(1, m + 1), b = n.slice(m + 1), w = ih(f, rh(b, m)), _ = ih(b, rh(w, l - m - 1));
  if (Bm(o, _.slice(0, m)))
    throw new Error("decryption error");
  for (var S = m; _[S] === 0; )
    S++;
  if (_[S++] !== 1)
    throw new Error("decryption error");
  return _.slice(S);
}
function Am(h, n, l) {
  for (var o = n.slice(0, 2), m = 2, f = 0; n[m++] !== 0; )
    if (m >= n.length) {
      f++;
      break;
    }
  var b = n.slice(2, m - 1);
  if ((o.toString("hex") !== "0002" && !l || o.toString("hex") !== "0001" && l) && f++, b.length < 8 && f++, f)
    throw new Error("decryption error");
  return n.slice(m);
}
function Bm(h, n) {
  h = Fi.from(h), n = Fi.from(n);
  var l = 0, o = h.length;
  h.length !== n.length && (l++, o = Math.min(h.length, n.length));
  for (var m = -1; ++m < o; )
    l += h[m] ^ n[m];
  return l;
}
(function(h) {
  h.publicEncrypt = pm, h.privateDecrypt = _m, h.privateEncrypt = function(l, o) {
    return h.publicEncrypt(l, o, !0);
  }, h.publicDecrypt = function(l, o) {
    return h.privateDecrypt(l, o, !0);
  };
})(So);
var Ti = {};
function fh() {
  throw new Error(`secure random number generation not supported by this browser
use chrome, FireFox or Internet Explorer 11`);
}
var ko = Nt, ah = li, Ro = ko.Buffer, Io = ko.kMaxLength, h0 = Gt.crypto || Gt.msCrypto, To = Math.pow(2, 32) - 1;
function Co(h, n) {
  if (typeof h != "number" || h !== h)
    throw new TypeError("offset must be a number");
  if (h > To || h < 0)
    throw new TypeError("offset must be a uint32");
  if (h > Io || h > n)
    throw new RangeError("offset out of range");
}
function qo(h, n, l) {
  if (typeof h != "number" || h !== h)
    throw new TypeError("size must be a number");
  if (h > To || h < 0)
    throw new TypeError("size must be a uint32");
  if (h + n > l || h > Io)
    throw new RangeError("buffer too small");
}
h0 && h0.getRandomValues || !ye.browser ? (Ti.randomFill = Em, Ti.randomFillSync = km) : (Ti.randomFill = fh, Ti.randomFillSync = fh);
function Em(h, n, l, o) {
  if (!Ro.isBuffer(h) && !(h instanceof Gt.Uint8Array))
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
  if (typeof n == "function")
    o = n, n = 0, l = h.length;
  else if (typeof l == "function")
    o = l, l = h.length - n;
  else if (typeof o != "function")
    throw new TypeError('"cb" argument must be a function');
  return Co(n, h.length), qo(l, n, h.length), Po(h, n, l, o);
}
function Po(h, n, l, o) {
  if (ye.browser) {
    var m = h.buffer, f = new Uint8Array(m, n, l);
    if (h0.getRandomValues(f), o) {
      ye.nextTick(function() {
        o(null, h);
      });
      return;
    }
    return h;
  }
  if (o) {
    ah(l, function(w, _) {
      if (w)
        return o(w);
      _.copy(h, n), o(null, h);
    });
    return;
  }
  var b = ah(l);
  return b.copy(h, n), h;
}
function km(h, n, l) {
  if (typeof n > "u" && (n = 0), !Ro.isBuffer(h) && !(h instanceof Gt.Uint8Array))
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
  return Co(n, h.length), l === void 0 && (l = h.length - n), qo(l, n, h.length), Po(h, n, l);
}
var hh;
function Do() {
  if (hh)
    return Pt;
  hh = 1, Pt.randomBytes = Pt.rng = Pt.pseudoRandomBytes = Pt.prng = li, Pt.createHash = Pt.Hash = Hi, Pt.createHmac = Pt.Hmac = Th;
  var h = bd, n = Object.keys(h), l = [
    "sha1",
    "sha224",
    "sha256",
    "sha384",
    "sha512",
    "md5",
    "rmd160"
  ].concat(n);
  Pt.getHashes = function() {
    return l;
  };
  var o = Tn;
  Pt.pbkdf2 = o.pbkdf2, Pt.pbkdf2Sync = o.pbkdf2Sync;
  var m = Ge;
  Pt.Cipher = m.Cipher, Pt.createCipher = m.createCipher, Pt.Cipheriv = m.Cipheriv, Pt.createCipheriv = m.createCipheriv, Pt.Decipher = m.Decipher, Pt.createDecipher = m.createDecipher, Pt.Decipheriv = m.Decipheriv, Pt.createDecipheriv = m.createDecipheriv, Pt.getCiphers = m.getCiphers, Pt.listCiphers = m.listCiphers;
  var f = k1();
  Pt.DiffieHellmanGroup = f.DiffieHellmanGroup, Pt.createDiffieHellmanGroup = f.createDiffieHellmanGroup, Pt.getDiffieHellman = f.getDiffieHellman, Pt.createDiffieHellman = f.createDiffieHellman, Pt.DiffieHellman = f.DiffieHellman;
  var b = nm();
  Pt.createSign = b.createSign, Pt.Sign = b.Sign, Pt.createVerify = b.createVerify, Pt.Verify = b.Verify, Pt.createECDH = am();
  var w = So;
  Pt.publicEncrypt = w.publicEncrypt, Pt.privateEncrypt = w.privateEncrypt, Pt.publicDecrypt = w.publicDecrypt, Pt.privateDecrypt = w.privateDecrypt;
  var _ = Ti;
  return Pt.randomFill = _.randomFill, Pt.randomFillSync = _.randomFillSync, Pt.createCredentials = function() {
    throw new Error(`sorry, createCredentials is not implemented yet
we accept pull requests
https://github.com/browserify/crypto-browserify`);
  }, Pt.constants = {
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
  }, Pt;
}
var Rm = Do();
const Im = /* @__PURE__ */ Yo(Rm);
function No(h) {
  const n = Im.createHash("sha256").update(h).digest("hex");
  return parseInt(n.slice(0, 8), 16) % 1e4 / 100;
}
function Tm(h, n) {
  const l = No(h);
  let o = 0;
  for (const m of n.variants)
    if (o += m.weight, l < o)
      return m.value;
  return null;
}
function Cm(h, n) {
  const l = n.user_id || n.id || n.email;
  if (!h || typeof h != "object" || !l)
    return null;
  switch (h.strategy) {
    case "percentage": {
      if (!("percentage" in h) || !("salt" in h))
        return null;
      const { percentage: o, salt: m } = h;
      return No(`${l}.${m}`) < o ? !0 : null;
    }
    case "variant": {
      if (!("variants" in h))
        return null;
      const { salt: o, variants: m } = h;
      return Tm(`${l}.${o}`, m);
    }
    default:
      return null;
  }
}
function qm(h, n) {
  return (h.targeting_rules || []).every((f) => {
    var b;
    if (f.type === "segment") {
      const w = (b = h.segmentsById) == null ? void 0 : b[f.segment_id];
      return w ? Vo(w, n) : !1;
    } else
      return sh(f, n);
  }) ? (h.rollout ? Cm(h.rollout, n) : null) ?? h.value ?? null : null;
}
let Qi = {
  getItem: (h) => typeof localStorage < "u" ? localStorage.getItem(h) : null,
  setItem: (h, n) => {
    typeof localStorage < "u" && localStorage.setItem(h, n);
  }
};
function Pm(h) {
  Qi = h;
}
function $o(h) {
  return `flagmint_${h}_flags`;
}
function Fo(h) {
  return `flagmint_${h}_context`;
}
function Lo(h, n) {
  try {
    const l = Qi.getItem($o(h));
    if (!l)
      return null;
    const o = JSON.parse(l);
    return Date.now() - o.ts > n ? null : o.data;
  } catch {
    return null;
  }
}
function Oo(h, n) {
  try {
    Qi.setItem($o(h), JSON.stringify({ ts: Date.now(), data: n }));
  } catch {
  }
}
function Uo(h) {
  try {
    const n = Qi.getItem(Fo(h));
    return n ? JSON.parse(n) : null;
  } catch {
    return null;
  }
}
function zo(h, n) {
  try {
    Qi.setItem(Fo(h), JSON.stringify(n));
  } catch {
  }
}
const Km = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loadCachedContext: Uo,
  loadCachedFlags: Lo,
  saveCachedContext: zo,
  saveCachedFlags: Oo,
  setCacheStorage: Pm
}, Symbol.toStringTag, { value: "Module" })), Dm = 24 * 60 * 60 * 1e3, Nm = "http://localhost:3000/evaluator/evaluate", $m = "wss://api.flagmint.io/flags/ws";
class Hm {
  /**
   * Creates a new FlagClient instance.
   * @param options - Configuration options for the client.
   */
  constructor(n) {
    if (this.flags = {}, this.refreshIntervalId = null, this.rawFlags = {}, this.apiKey = n.apiKey, this.enableOfflineCache = n.enableOfflineCache ?? !0, this.persistContext = n.persistContext ?? !1, this.cacheTTL = Dm, this.onError = n.onError, this.cacheAdapter = n.cacheAdapter ?? {
      loadFlags: Lo,
      saveFlags: Oo,
      loadContext: Uo,
      saveContext: zo
    }, this.context = n.context || {}, this.rawFlags = n.rawFlags ?? {}, this.previewMode = n.previewMode || !1, this.previewMode && this.rawFlags && Object.keys(this.rawFlags).length > 0) {
      this.flags = this.evaluateLocally(this.rawFlags, this.context), this.readyPromise = Promise.resolve(), this.resolveReady = () => {
      }, this.rejectReady = () => {
      };
      return;
    } else
      this.previewMode && !this.rawFlags && console.error("[FlagClient] No raw flags provided for preview mode. Defaulting to remote fetch.");
    this.readyPromise = new Promise((l, o) => {
      this.resolveReady = l, this.rejectReady = o;
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
  async initialize(n) {
    var l;
    try {
      if (this.persistContext) {
        const o = await Promise.resolve(
          this.cacheAdapter.loadContext(this.apiKey)
        );
        o && (this.context = o);
      }
      if (this.enableOfflineCache) {
        const o = await Promise.resolve(
          this.cacheAdapter.loadFlags(this.apiKey, this.cacheTTL)
        );
        o && (this.flags = o);
      }
      await this.setupTransport(n), this.resolveReady();
    } catch (o) {
      this.rejectReady(o), (l = this.onError) == null || l.call(this, o);
    }
  }
  /**
   * Sets up the transport layer for the client.
   * @param options - The options for the transport setup.
   */
  async setupTransport(n) {
    console.log("[FlagClient] setupTransport() started");
    const l = n.transportMode ?? "auto", o = async () => {
      console.log("[FlagClient] Initializing WebSocket transport...");
      const f = new Wo($m, this.apiKey);
      return await f.init(), console.log("[FlagClient] WebSocket transport initialized"), f;
    }, m = () => {
      console.log("[FlagClient] Using long polling transport...");
      const f = new Zo(Nm, this.apiKey, this.context);
      return f.init((b) => {
        console.log("[FlagClient] LongPolling update received:", b), this.flags = b, this.enableOfflineCache && Promise.resolve(
          this.cacheAdapter.saveFlags(this.apiKey, b)
        );
      }), f;
    };
    try {
      if (l === "websocket")
        this.transport = await o();
      else if (l === "long-polling")
        this.transport = m();
      else
        try {
          this.transport = await o();
        } catch {
          console.warn("[FlagClient] WebSocket failed, falling back to long polling"), this.transport = m();
        }
      console.log("[FlagClient] Fetching flags...");
      const f = await this.transport.fetchFlags(this.context);
      console.log("[FlagClient] Initial flags fetched:", f), this.flags = f, this.enableOfflineCache && await Promise.resolve(
        this.cacheAdapter.saveFlags(this.apiKey, f)
      ), typeof this.transport.onFlagsUpdated == "function" && this.transport.onFlagsUpdated((b) => {
        this.flags = b, this.enableOfflineCache && this.cacheAdapter.saveFlags(this.apiKey, b);
      }), this.resolveReady();
    } catch (f) {
      throw console.error("[FlagClient] setupTransport error:", f), this.rejectReady(f), this.onError && this.onError(f instanceof Error ? f : new Error(String(f))), f;
    }
  }
  getFlag(n, l) {
    return this.flags[n] ?? l;
  }
  updateContext(n) {
    this.context = { ...this.context, ...n }, this.persistContext && this.cacheAdapter.saveContext(this.apiKey, this.context);
  }
  destroy() {
    this.refreshIntervalId && clearInterval(this.refreshIntervalId), this.transport.destroy();
  }
  async ready() {
    return console.log("[FlagClient] Waiting for client to be ready...", this.readyPromise), this.readyPromise;
  }
  evaluateLocally(n, l) {
    const o = {};
    for (const m in n) {
      const f = qm(n[m], l);
      f !== null && (o[m] = f);
    }
    return o;
  }
}
function Ko(h) {
  return `flagmint_${h}_flags`;
}
function Ho(h) {
  return `flagmint_${h}_context`;
}
let Sr = null;
function Fm(h) {
  Sr = h;
}
async function Lm(h, n) {
  if (!Sr)
    throw new Error("Async storage not set");
  try {
    const l = await Sr.getItem(Ko(h));
    if (!l)
      return null;
    const o = JSON.parse(l);
    return Date.now() - o.ts > n ? null : o.data;
  } catch {
    return null;
  }
}
async function Om(h, n) {
  if (!Sr)
    throw new Error("Async storage not set");
  try {
    await Sr.setItem(Ko(h), JSON.stringify({ ts: Date.now(), data: n }));
  } catch {
  }
}
async function Um(h) {
  if (!Sr)
    throw new Error("Async storage not set");
  try {
    const n = await Sr.getItem(Ho(h));
    return n ? JSON.parse(n) : null;
  } catch {
    return null;
  }
}
async function zm(h, n) {
  if (!Sr)
    throw new Error("Async storage not set");
  try {
    await Sr.setItem(Ho(h), JSON.stringify(n));
  } catch {
  }
}
const Zm = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loadCachedContext: Um,
  loadCachedFlags: Lm,
  saveCachedContext: zm,
  saveCachedFlags: Om,
  setAsyncCacheStorage: Fm
}, Symbol.toStringTag, { value: "Module" }));
export {
  Hm as FlagClient,
  Zo as LongPollingTransport,
  Wo as WebSocketTransport,
  Zm as asyncCache,
  qm as evaluateFlagValue,
  Cm as evaluateRollout,
  No as hashToPercentage,
  Tm as pickVariant,
  Km as syncCache
};
