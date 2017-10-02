(function(app) {
  const _awd = '__AWD__';

  app.apiURL = '';
  app.containerEl = null;
  app.sidebarEl = null;
  app.contentEl = null;
  app.searchBoxEl = null;

  function query(url) {
    return fetch(url)
      .then(function(response) {
        return response.json();
      });
  }

  function createMenuLi(data) {
    const li = document.createElement("li");

    if (data.type === "dir") {
      const span = document.createElement("span");
      li.appendChild(span);
      span.innerHTML = data.name;
    } else {
      const a = document.createElement("a");
      li.appendChild(a);
      a.href = data.slug;
      a.innerHTML = data.name;
      a.addEventListener(
        "click",
        function(event) {
          event.preventDefault();
          populateContent(app.apiURL + "/" + data.slug);
        },
        false
      );
    }
    return li;
  }

  function populateMenu() {
    function build(ul, links) {
      const len = links.length;
      for (let i = 0; i < len; i++) {
        ul.appendChild(createMenuLi(links[i]));
        if (links[i].children) {
          const subUl = document.createElement("ul");
          ul.appendChild(subUl);
          build(subUl, links[i].children);
        }
      }
    }
    query(app.apiURL + '/menu').then(function(json) {
      const ul = document.createElement("ul");
      app.sidebarEl.appendChild(ul);
      build(ul, json.result);
    });
  }

  function populateContent(url) {
    query(url ? url : app.apiURL).then(function(json) {
      app.contentEl.innerHTML = json.result.html;
    });
  }

  function main() {
    app.containerEl = document.getElementById("allwrite-docs");
    app.sidebarEl = document.createElement("div");
    app.contentEl = document.createElement("div");
    app.searchBoxEl = document.createElement("input");

    app.apiURL = app.containerEl.dataset.api;

    if (!app.apiURL) {
      throw new Error("You must set the url to the Allwrite API.");
    }

    app.containerEl.innerHTML = '';
    app.sidebarEl.className = _awd + 'sidebar';
    app.contentEl.className = _awd + 'content';
    app.searchBoxEl.className = _awd + 'search-input';
    app.searchBoxEl.placeholder = "Search";

    app.sidebarEl.appendChild(app.searchBoxEl);
    app.containerEl.appendChild(app.contentEl);
    app.containerEl.appendChild(app.sidebarEl);
  }

  try {
    main();
    populateMenu();
    populateContent();
  } catch (err) {
    console.warn(err.message);
  }
})({});
