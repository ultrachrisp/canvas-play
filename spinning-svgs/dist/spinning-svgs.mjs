function X() {
  let n = -1, a = -1, o = 0;
  function i(g) {
    n = (g - a) * 0.06, a = g, o = Number((o + 0.25).toFixed(1));
  }
  function t() {
    return { frame: o, speedFactor: n };
  }
  function r(g) {
    o = g;
  }
  function l() {
    return n;
  }
  return {
    setTimestamp: i,
    getFrame: t,
    setFrame: r,
    getSpeedFactor: l
  };
}
function Y({ settings: e }) {
  const { tag: n, colours: a, svgWidth: o } = e, i = document.querySelector(n);
  if (!i)
    throw new Error(
      "Provided canvas tag does not exist in the HTML document"
    );
  const t = i;
  t.replaceChildren();
  const { canvas: r, context: l } = x();
  t.appendChild(r), t.setAttribute(
    "style",
    "box-sizing: border-box; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"
  );
  const { canvas: g, context: h } = x();
  g.width = a.length * o, g.height = o, k({ settings: e, spriteContext: h });
  function m() {
    return l;
  }
  function v() {
    return r;
  }
  function s() {
    return g;
  }
  function f() {
    M({ canvas: r, context: l });
    const { canvasWidth: c, canvasHeight: p } = D(
      t,
      o
    );
    return r.width = c, r.height = p, { canvasWidth: c, canvasHeight: p };
  }
  function u() {
    M({ canvas: r, context: l });
  }
  return { resize: f, draw: u, getCanvas: v, getContext: m, getOffscreenCanvas: s };
}
function k({ settings: e, spriteContext: n }) {
  const { svg: a, svgQuery: o, colours: i, svgWidth: t } = e;
  let r = i.length;
  for (; r--; ) {
    const l = a.replace(o, i[r]), g = encodeURIComponent(l), h = new Image(), m = r * t;
    h.onload = () => {
      n.drawImage(h, m, 0, t, t);
    }, h.src = `data:image/svg+xml,${g}`;
  }
}
function M({ canvas: e, context: n }) {
  return n.clearRect(0, 0, e.width, e.height);
}
function x() {
  const e = document.createElement("canvas"), n = e.getContext("2d");
  if (!n) throw new Error("Failed to get 2D canvas context");
  return { canvas: e, context: n };
}
function D(e, n) {
  const { width: a, height: o } = e.getBoundingClientRect(), i = Math.floor(a / n) * n, t = Math.floor(o / n) * n;
  return { canvasWidth: i, canvasHeight: t };
}
function L({
  width: e,
  height: n,
  arrayPositionX: a,
  arrayPositionY: o,
  numOfColours: i
}) {
  let t = 1, r = t / 2, l = 0, g = 0;
  const h = Math.PI / 180, m = a * e + e / 2, v = o * n + n / 2;
  let s = 0, f = !1, u = !0, c = "fadeIn", p = 0, C = 0;
  const w = a + o;
  function b(d) {
    w < d && (t *= 1.05, r = t / 2, t >= e && (t = e, u = !1, c = "spin"));
  }
  function T() {
    u ? (t *= 1.05, s = H(), t >= e && (t = e, u = !1, c = "spin")) : (t *= 0.95, t < 15 && (u = !0, f = !0)), r = t / 2;
  }
  function S(d) {
    p === 0 && (p = d), C + p <= d && (u ? (t *= 1.05, s = 0, t >= e && (t = e, u = !1, c = "spin", p = 0)) : (t *= 0.95, t < 15 && (u = !0, f = !0)), r = t / 2);
  }
  function H() {
    return f ? (f = !1, s >= i - 1 ? 0 : ++s) : s;
  }
  function A({ frame: d, speedFactor: P }) {
    switch (l = l > 360 ? 0 : l + P, g = l * h, c) {
      case "fadeIn":
        b(d);
        break;
      case "hover":
        T();
        break;
      case "wave":
        S(d);
        break;
      case "spin":
      default:
        c = "spin";
    }
  }
  function I({ context: d, spriteSheet: P }) {
    d.save(), d.translate(m, v), d.rotate(g), d.drawImage(
      P,
      s * e,
      0,
      e,
      n,
      -r,
      -r,
      t,
      t
    ), d.restore();
  }
  function z(d) {
    c = d;
  }
  function R() {
    return c;
  }
  function E() {
    return { arrayPositionX: a, arrayPositionY: o };
  }
  function G(d, P) {
    C = d, c = P;
  }
  return {
    hover: T,
    update: A,
    draw: I,
    setParticleState: z,
    getParticleState: R,
    getArrayPosition: E,
    setDistanceToTarget: G
  };
}
function O({ cellWidth: e, numOfSprites: n, canvasWidth: a, canvasHeight: o }) {
  let { gridRows: i, gridColumns: t } = W({
    canvasWidth: a,
    canvasHeight: o,
    cellWidth: e
  }), r = y({
    gridRows: i,
    gridColumns: t,
    cellWidth: e,
    numOfSprites: n
  });
  function l() {
    return r;
  }
  function g({ canvasWidth: s, canvasHeight: f }) {
    ({ gridRows: i, gridColumns: t } = W({
      canvasWidth: s,
      canvasHeight: f,
      cellWidth: e
    })), r = y({
      gridRows: i,
      gridColumns: t,
      cellWidth: e,
      numOfSprites: n
    });
  }
  function h({ targetRow: s, targetColumn: f }) {
    const u = r[s][f];
    u.setParticleState("click");
    const { arrayPositionX: c, arrayPositionY: p } = u.getArrayPosition();
    for (let C = 0; C < i; C++)
      for (let w = 0; w < t; w++) {
        const { arrayPositionX: b, arrayPositionY: T } = r[C][w].getArrayPosition(), S = Math.abs(c - b) + Math.abs(p - T);
        r[C][w].setDistanceToTarget(S, "wave");
      }
  }
  function m({ frame: s, speedFactor: f }) {
    for (let u = 0; u < i; u++)
      for (let c = 0; c < t; c++)
        r[u][c].update({ frame: s, speedFactor: f });
  }
  function v({ context: s, spriteSheet: f }) {
    for (let u = 0; u < i; u++)
      for (let c = 0; c < t; c++)
        r[u][c].draw({ context: s, spriteSheet: f });
  }
  return { getGrid: l, resize: g, update: m, draw: v, prepareWave: h };
}
function y({
  gridRows: e,
  gridColumns: n,
  cellWidth: a,
  numOfSprites: o
}) {
  const i = new Array(e);
  for (let t = 0; t < e; t++) {
    i[t] = new Array(n);
    for (let r = 0; r < n; r++) {
      const l = L({
        width: a,
        height: a,
        arrayPositionX: t,
        arrayPositionY: r,
        numOfColours: o
      });
      i[t][r] = l;
    }
  }
  return i;
}
function q({ evt: e, canvas: n }) {
  const { left: a, top: o } = n.getBoundingClientRect(), i = e.clientX - a, t = e.clientY - o;
  return { mouseX: i, mouseY: t };
}
function B({ mouseX: e, mouseY: n, cellWidth: a }) {
  const o = Math.floor(e / a), i = Math.floor(n / a), t = o > 0 ? o : 0, r = i > 0 ? i : 0;
  return { row: t, column: r };
}
function W({ canvasWidth: e, canvasHeight: n, cellWidth: a }) {
  const o = Math.floor(e / a), i = Math.floor(n / a);
  return { gridRows: o, gridColumns: i };
}
function N(e) {
  const n = X(), a = Y({ settings: e }), { canvasWidth: o, canvasHeight: i } = a.resize(), t = O({
    cellWidth: e.svgWidth,
    numOfSprites: e.colours.length,
    canvasWidth: o,
    canvasHeight: i
  });
  let r = globalThis.innerWidth;
  addEventListener("resize", j(() => l(), 300)), a.getCanvas().addEventListener(
    "click",
    (v) => {
      const { row: s, column: f } = F(
        v,
        a.getCanvas(),
        e.svgWidth
      );
      t.prepareWave({ targetRow: s, targetColumn: f });
    }
  ), a.getCanvas().addEventListener(
    "mousemove",
    (v) => {
      const { row: s, column: f } = F(
        v,
        a.getCanvas(),
        e.svgWidth
      );
      t.getGrid()[s][f].setParticleState("hover");
    }
  );
  function l() {
    if (r !== globalThis.innerWidth) {
      n.setFrame(0);
      const { canvasWidth: v, canvasHeight: s } = a.resize();
      t.resize({ canvasWidth: v, canvasHeight: s }), r = globalThis.innerWidth;
    }
  }
  function g() {
    t.update({ ...n.getFrame() });
  }
  function h() {
    a.draw(), t.draw({
      context: a.getContext(),
      spriteSheet: a.getOffscreenCanvas()
    });
  }
  function m(v) {
    n.setTimestamp(v), g(), h(), requestAnimationFrame(m);
  }
  l(), m(performance.now());
}
function F(e, n, a) {
  const { mouseX: o, mouseY: i } = q({
    evt: e,
    canvas: n
  });
  return B({
    mouseX: o,
    mouseY: i,
    cellWidth: a
  });
}
function j(e, n) {
  let a;
  return (...o) => {
    clearTimeout(a), a = setTimeout(() => e(...o), n);
  };
}
export {
  N as SpinningSVGs
};
