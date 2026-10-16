(function () {
  "use strict";

  function load(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }

  function fail(id, what) {
    document.getElementById(id).textContent =
      "Could not load " + what + ". Open the page through GitHub Pages or a local server.";
  }

  // Show the logo only if assets/logo.jpeg exists
  var logo = document.getElementById("logo");
  logo.addEventListener("load", function () { logo.hidden = false; });
  logo.addEventListener("error", function () { logo.remove(); });
  if (logo.complete && logo.naturalWidth > 0) logo.hidden = false;

  load("team.json").then(function (people) {
    var ul = document.getElementById("team-list");
    people.forEach(function (p) {
      var li = document.createElement("li");
      if (p.photo) {
        var img = document.createElement("img");
        img.src = p.photo;
        img.alt = p.name;
        li.appendChild(img);
      }
      li.appendChild(document.createTextNode(p.name));
      ul.appendChild(li);
    });
  }).catch(function () { fail("team-status", "the team list"); });

  load("assets/projects.json").then(function (items) {
    var ol = document.getElementById("project-list");
    items
      .slice()
      .sort(function (a, b) { return String(a.date || "").localeCompare(String(b.date || "")); })
      .forEach(function (p) {
        var li = document.createElement("li");
        if (p.url) {
          var a = document.createElement("a");
          a.href = p.url;
          a.textContent = p.title;
          li.appendChild(a);
        } else {
          li.textContent = p.title;
        }
        ol.appendChild(li);
      });
  }).catch(function () { fail("projects-status", "the projects"); });
})();

/* Falling snow */
(function () {
  "use strict";
  var canvas = document.getElementById("snow");
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var w = 0, h = 0, flakes = [];

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(140, Math.max(50, w / 9)));
    flakes = [];
    for (var i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.8,
        v: 0.4 + Math.random() * 1.0,
        sway: Math.random() * Math.PI * 2,
        amp: 0.3 + Math.random() * 0.8
      });
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.v;
      f.sway += 0.015;
      f.x += Math.sin(f.sway) * f.amp;
      if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
      if (f.x > w + 5) f.x = -5;
      if (f.x < -5) f.x = w + 5;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
})();
