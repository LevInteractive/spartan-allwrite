/**
 * Welcome to Sparta.
 *
 * Browser dependencies to run this file:
 *
 * * const, let
 * * promises
 * * fetch
 *
 * ---
 * If you use the minified version, this should not be an issue because babel
 * and polyfills.
 */
(function(app) {
  app.apiURL = '';
  app.containerEl = null;
  app.sidebarEl = null;
  app.contentEl = null;
  app.searchBoxEl = null;
  app.contentCache = "";

  // All classes get prefixed with this.
  const _awd = '__AWD__';

  const loaderDiv = "<div class='__AWD__loader'>Loading...</div>";

  function query(url) {
    return fetch(url).then(
      function(response) {
        return response.json();
      }
    );
  }

  function populateContent(url) {

    // Reset the content cache and implement a loader div.
    app.contentCache = "";
    app.contentEl.innerHTML = loaderDiv;

    query(url ? url : app.apiURL).then(function(json) {
      app.contentEl.innerHTML = json.result.html;

      // Apply syntax highligting to code blocks if hljs is included. We could
      // support more highlighting libs here if requested.
      if (typeof hljs !== 'undefined') {
        const snippets = document.querySelectorAll("[class^='language-'");
        snippets.forEach(function(snippet) {
          hljs.highlightBlock(snippet);
        });
      }

      // Cache our ready content so we can remove it and easily add it again
      // later.
      app.contentCache = app.contentEl.innerHTML;
    });
  }

  function configureSidebarMenu() {
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

  function configureSearch() {
    app.searchBoxEl.addEventListener("input", function(e) {
      const v = this.value;

      if (v && v.length > 2) {
        app.contentEl.innerHTML = loaderDiv;
      } else {
        app.contentEl.innerHTML = app.contentCache;
        return;
      }

      query(app.apiURL + '/?q=' + encodeURIComponent(v)).then(
        function(json) {
          if (json.result) {
            app.contentEl.innerHTML = "";
            json.result.forEach(function(row) {
              const rowEl = document.createElement("div");
              const pEl = document.createElement("p");
              const a = createLink(
                rowEl,
                row.slug,
                row.name
              );
              rowEl.classList.add(_awd + "result-row");
              rowEl.appendChild(a);
              rowEl.appendChild(pEl);
              pEl.innerHTML = row.reltext;

              app.contentEl.appendChild(rowEl);
            });
          } else {
            app.contentEl.innerHTML = "No results found.";
          }
        }
      );
    });
  }

  function createLink(parentEl, url, text) {
    const onPageChange = function() {
      a.classList.remove("active");
    };
    const onClick = function(e) {
      event.preventDefault();
      populateContent(url);
      app.sidebarEl.dispatchEvent(new Event('pagechange'));
      a.classList.add("active");
    };
    const a = document.createElement("a");
    parentEl.appendChild(a);
    a.href = url;
    a.innerHTML = text;

    app.sidebarEl.addEventListener("pagechange", onPageChange);
    a.addEventListener("click", onClick, false);

    return a;
  }

  function createMenuLi(data) {
    const li = document.createElement("li");
    if (data.type === "dir") {
      const span = document.createElement("span");
      li.appendChild(span);
      span.innerHTML = data.name;
    } else {
      createLink(li, app.apiURL + "/" + data.slug, data.name);
    }
    return li;
  }

  function main() {
    app.containerEl = document.getElementById("allwrite-docs");
    app.sidebarEl = document.createElement("div");
    app.contentEl = document.createElement("div");
    app.searchResultsEl = document.createElement("div");
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
    app.sidebarEl.appendChild(app.searchResultsEl);
    app.containerEl.appendChild(app.contentEl);
    app.containerEl.appendChild(app.sidebarEl);
  }

  try {
    main();
    populateContent();
    configureSidebarMenu();
    configureSearch();
  } catch (err) {
    console.warn(err.message);
  }
})({});
