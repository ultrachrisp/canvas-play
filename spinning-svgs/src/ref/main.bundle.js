
(function () {
  function e(t, n, s) {
    function o(i, r) {
      if (!n[i]) {
        if (!t[i]) {
          var c, l, d = "function" == typeof require && require;
          if (!r && d)
            return d(i, !0);
          if (a)
            return a(i, !0);
          throw l = new Error("Cannot find module '" + i + "'"),
          l.code = "MODULE_NOT_FOUND",
          l
        }
        c = n[i] = {
          exports: {}
        },
          t[i][0].call(c.exports, function (e) {
            var n = t[i][1][e];
            return o(n || e)
          }, c, c.exports, e, t, n, s)
      }
      return n[i].exports
    }
    for (var a = "function" == typeof require && require, i = 0; i < s.length; i++)
      o(s[i]);
    return o
  }
  return e
}
)()({
  1: [function (e) {
    "use strict";
    var s, i, a, r, c, l, d, u, h, m, f, p, g, v, b = e("./particles");
    function o(e, t, n) {
      return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[t] = n,
        e
    }
    u = function () {
      i({
        anim: s
      }),
        m({
          anim: s
        }),
        window.requestAnimationFrame(v)
    }
      ,
      l = function () {
        var n, c, t = (n = {
          colours: ["#000000", "#73505d", "#312f43", "#5c7364", "#736d5c", "#3a3834"],
          pointerX: 0,
          pointerY: 0,
          grid: null,
          particles: null,
          offscreenCanvases: [],
          time: 0,
          svgWidth: 75,
          preRenderCanvases: []
        },
          o(n, "grid", []),
          o(n, "particles", []),
          o(n, "currentTime", 0),
          o(n, "start", -1),
          o(n, "element", document.getElementById("dashboard")),
          o(n, "canvas", document.createElement("canvas")),
          n);
        return t.element.innerHTML = "",
          t.element.appendChild(t.canvas),
          t.context = t.canvas.getContext("2d"),
          t.element.appendChild(t.canvas),
          t.canvas.addEventListener("mousemove", function (e) {
            a(e);
            var t = r(s);
            t.state !== "fadeIn" && t.state !== "fadeOut" && t.state !== "hover" && t.state !== "special" && t.state !== "wave" && (t.state = "hover")
          }, !1),
          window.addEventListener("resize", function () {
            clearTimeout(c),
              c = setTimeout(function () {
                i({
                  anim: s
                })
              }, 500)
          }, !1),
          t.canvas.addEventListener("click", function (e) {
            a(e);
            var t, o, n = r(s);
            if (n.state === "spin" || n.state === "hover")
              for (n.state = "click",
                t = s.particles.length; t--;)
                s.particles[t].distanceFromSpecial = (Math.abs(n.xArr - s.particles[t].xArr) + Math.abs(n.yArr - s.particles[t].yArr)) * 100,
                  s.particles[t].delay = s.currentTime,
                  s.particles[t].state = "wave";
            else if (n.state === "special")
              for (o = s.particles.length; o--;)
                s.particles[o].delay = s.currentTime,
                  s.particles[o].state = "wave"
          }, !1),
          t
      }
      ,
      r = function (t) {
        var n = Math.floor(t.pointerX / t.svgWidth)
          , s = Math.floor(t.pointerY / t.svgWidth)
          , o = t.grid && t.grid[n] && t.grid[n][s] ? t.grid[n][s] : {};
        return o
      }
      ,
      i = function (t) {
        var n = t.anim
          , s = n.canvas.width = n.canvas.height = n.element.getBoundingClientRect().width
          , i = s % n.svgWidth
          , a = n.svgWidth / 2
          , o = h({
            width: s,
            limit: n.svgWidth,
            num: n.svgWidth + 1
          });
        return n.svgWidth = o,
          n.grid = c({
            canvas: n.canvas,
            svgWidth: n.svgWidth
          }),
          n.particles = d({
            anim: n
          }),
          {}
      }
      ,
      a = function (t) {
        var n = 0
          , o = 0;
        do
          n += s.canvas.offsetLeft - s.canvas.scrollLeft,
            o += s.canvas.offsetTop - s.canvas.scrollTop;
        while (s.canvas == s.canvas.offsetParent) s.pointerX = t.pageX - n,
          s.pointerY = t.pageY - o
      }
      ,
      d = function (t) {
        var n = t.anim
          , s = [];
        return n.grid.map(function (e, t) {
          return e.map(function (e, o) {
            var i = new b.Particle({
              x: t,
              y: o,
              anim: n
            });
            n.grid[t][o] = i,
              s.push(i)
          })
        }),
          s
      }
      ,
      c = function (t) {
        for (var n, c = t.canvas, i = t.svgWidth, a = Math.floor(c.width / i), r = Math.floor(c.width / i), o = new Array(a), s = 0; s < a; s++) {
          o[s] = new Array(r);
          for (n = 0; n < r; n++)
            o[s][n] = 0
        }
        return o
      }
      ,
      h = function e(t) {
        var s = t.width
          , o = t.limit
          , n = t.num;
        return s % n < o ? e({
          width: s,
          limit: o,
          num: n + 1
        }) : n - 1
      }
      ,
      m = function (t) {
        for (var n = t.anim, s = n.colours.length; s--;)
          n.preRenderCanvases.push(f(n.colours[s]))
      }
      ,
      f = function (t) {
        n = document.createElement("canvas"),
          n.width = n.height = s.svgWidth;
        var n, i = n.getContext("2d"), a = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 115 115" width="75px" height="75px"><defs><style>.cls-1,.cls-2,.cls-3{fill:none;}.cls-1,.cls-2,.cls-3,.cls-4{stroke:' + t + ';stroke-miterlimit:10;}.cls-1,.cls-2{stroke-linecap:round;}.cls-2,.cls-3,.cls-4{stroke-width:5px;}.cls-4{fill:#fff;}</style></defs><g><path class="cls-2" d="M33.18,26.1a40,40,0,0,1,54,4.8"/><path class="cls-3" d="M87.15,30.9A40,40,0,0,1,94.23,74"/><circle class="cls-4" cx="94.38" cy="73.73" r="8"/><path class="cls-2" d="M82.38,89.47a40,40,0,0,1-54-4.8"/><path class="cls-3" d="M28.41,84.67a40.09,40.09,0,0,1-7.08-43.15"/><circle class="cls-4" cx="21.18" cy="41.84" r="8"/></g></svg>', r = encodeURIComponent(a), o = new window.Image;
        return o.onload = function () {
          i.drawImage(o, 0, 0, s.svgWidth, s.svgWidth)
        }
          ,
          o.src = "data:image/svg+xml," + r,
          n
      }
      ,
      p = function () {
        for (var t = s.particles.length; t--;)
          s.particles[t].update()
      }
      ,
      g = function () {
        s.context.clearRect(0, 0, s.canvas.width, s.canvas.height);
        for (var t = s.particles.length; t--;)
          s.particles[t].draw()
      }
      ,
      v = function e(t) {
        s.start === -1 && (s.start = t),
          s.currentTime = t - s.start,
          p(),
          g(),
          window.requestAnimationFrame(e)
      }
      ,
      s = l(),
      u()
  }
    , {
    "./particles": 2
  }],
  2: [function (e, t, n) {
    "use strict";
    Object.defineProperty(n, "__esModule", {
      value: !0
    }),
      n.Particle = void 0;
    function o(e, t) {
      if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function")
    }
    function s(e, t) {
      for (var n, s = 0; s < t.length; s++)
        n = t[s],
          n.enumerable = n.enumerable || !1,
          n.configurable = !0,
          "value" in n && (n.writable = !0),
          Object.defineProperty(e, n.key, n)
    }
    function i(e, t, n) {
      return t && s(e.prototype, t),
        n && s(e, n),
        e
    }
    function a(e, t, n) {
      return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[t] = n,
        e
    }
    var r = function () {
      function e(t) {
        var s = t.x
          , i = t.y
          , n = t.anim;
        o(this, e),
          a(this, "state", "fadeIn"),
          this.xArr = s,
          this.yArr = i,
          this.anim = n,
          this.distanceFromSpecial = 0,
          this.xPos = s * n.svgWidth,
          this.yPos = i * n.svgWidth,
          this.width = n.svgWidth,
          this.centre = this.width / 2,
          this.halfW = this.width / 2,
          this.alpha = 1,
          this.delay = 0,
          this.fadingStart = this.xPos * .5 + this.yPos * .5,
          this.colour = 0,
          this.outroStart = 0,
          this.remove = !1,
          this.bigger = !1,
          this.colourChange = !1,
          this.speed = 1,
          this.angle = 0,
          this.radians = Math.PI / 180
      }
      return i(e, [{
        key: "fadeIn",
        value: function () {
          this.fadingStart + this.delay <= this.anim.currentTime && (this.alpha += .1,
            this.alpha >= 1 && (this.state = "spin"))
        }
      }, {
        key: "click",
        value: function () {}
      }, {
        key: "hover",
        value: function () {
          this.bigger ? this.bigger && (this.width = this.width * 1.1,
            this.colour = this.getHoverColour(),
            this.width >= this.anim.svgWidth && (this.width = this.anim.svgWidth,
              this.bigger = !1,
              this.state = "spin")) : (this.width = this.width * .9,
                this.width < 20 && (this.bigger = !0,
                  this.colourChange = !0)),
            this.halfW = this.width / 2
        }
      }, {
        key: "wave",
        value: function () {
          this.distanceFromSpecial + this.delay <= this.anim.currentTime && (this.bigger ? this.bigger && (this.width = this.width * 1.1,
            this.colour = this.getWaveColour(this),
            this.width >= this.anim.svgWidth && (this.width = this.anim.svgWidth,
              this.bigger = !1,
              this.state = "spin")) : (this.width = this.width * .9,
                this.width < 20 && (this.bigger = !0,
                  this.colourChange = !0)),
            this.halfW = this.width / 2)
        }
      }, {
        key: "getWaveColour",
        value: function (t) {
          return t.colourChange ? (t.colourChange = !1,
            0) : t.colour
        }
      }, {
        key: "getHoverColour",
        value: function () {
          return this.colourChange ? (this.colourChange = !1,
            this.colour + 1 >= this.anim.colours.length ? 0 : this.colour + 1) : this.colour
        }
      }, {
        key: "update",
        value: function () {
          switch (this.angle = this.angle > 360 ? 0 : this.angle + this.speed,
          this.rAngle = this.angle * this.radians,
          this.state) {
            case "special":
              this.pulse();
              break;
            case "wave":
              this.wave();
              break;
            case "fadeIn":
              this.fadeIn();
              break;
            case "fadeOut":
              this.fadeOut();
              break;
            case "hover":
              this.hover();
              break;
            case "click":
              this.click();
              break;
            default:
              this.state = "spin"
          }
        }
      }, {
        key: "draw",
        value: function () {
          (this.state === "fadeIn" || this.state === "fadeOut") && (this.anim.context.globalAlpha = this.alpha),
            this.remove || (this.anim.context.save(),
              this.anim.context.translate(this.xPos + this.centre, this.yPos + this.centre),
              this.anim.context.rotate(this.rAngle),
              this.anim.context.drawImage(this.anim.preRenderCanvases[this.colour], -this.halfW, -this.halfW, this.width, this.width),
              this.anim.context.restore()),
            this.state === "fadeOut" && (this.anim.context.globalAlpha = 1)
        }
      }]),
        e
    }();
    n.Particle = r
  }
    , {}]
}, {}, [1])
