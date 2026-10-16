(function () {
  "use strict";

  var PROJECTS_URL = "assets/projects.json";
  var TEAM_URL = "team.json";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function loadJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error("Could not load " + url + " (" + res.status + ")");
      return res.json();
    });
  }

  function showError(id, name) {
    document.getElementById(id).textContent =
      "Could not load " + name + ". If you opened this file directly, run it from a local server instead " +
      "(for example: python -m http.server) or publish it with GitHub Pages.";
  }

  /* Projects */
  var allProjects = [];
  var activeType = "All";

  function renderProjects() {
    var list = document.getElementById("project-list");
    list.replaceChildren();
    allProjects
      .filter(function (p) { return activeType === "All" || p.type === activeType; })
      .sort(function (a, b) { return b.year - a.year; })
      .forEach(function (p) {
        var li = el("li", "project");
        li.appendChild(el("span", "year", String(p.year)));
        var body = el("div");
        var h3 = el("h3");
        var link = el("a", "", p.title);
        link.href = p.url || "#";
        h3.appendChild(link);
        body.appendChild(h3);
        body.appendChild(el("p", "", p.description));
        body.appendChild(el("span", "tags", p.type));
        li.appendChild(body);
        list.appendChild(li);
      });
  }

  function renderFilters() {
    var box = document.getElementById("filters");
    var types = ["All"].concat(
      allProjects.map(function (p) { return p.type; })
        .filter(function (t, i, arr) { return arr.indexOf(t) === i; })
    );
    types.forEach(function (type) {
      var btn = el("button", "", type);
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(type === activeType));
      btn.addEventListener("click", function () {
        activeType = type;
        box.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        renderProjects();
      });
      box.appendChild(btn);
    });
  }

  /* Team */
  function renderTeam(people) {
    var grid = document.getElementById("team-grid");
    people.forEach(function (person) {
      var li = el("li", "person");
      var avatar = el("div", "avatar");
      if (person.photo) {
        var img = el("img");
        img.src = person.photo;
        img.alt = "Portrait of " + person.name;
        avatar.appendChild(img);
      } else {
        avatar.textContent = person.name.charAt(0);
        avatar.setAttribute("aria-hidden", "true");
      }
      li.appendChild(avatar);
      li.appendChild(el("h3", "", person.name));
      li.appendChild(el("p", "role", person.role));
      if (person.bio) li.appendChild(el("p", "bio", person.bio));
      grid.appendChild(li);
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  loadJSON(PROJECTS_URL)
    .then(function (data) { allProjects = data; renderFilters(); renderProjects(); })
    .catch(function () { showError("projects-status", "the projects"); });

  loadJSON(TEAM_URL)
    .then(renderTeam)
    .catch(function () { showError("team-status", "the team"); });
})();
