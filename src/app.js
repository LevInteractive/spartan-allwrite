(function(app) {
  app.apiURL = '';
  app.containerEl = null;
  app.sidebarEl = null;
  app.contentEl = null;
  app.searchBoxEl = null;

  // All classes get prefixed with this.
  const _awd = '__AWD__';

  function query(url) {
    return fetch(url).then(
      function(response) {
        return response.json();
      }
    );
  }

  function populateContent(url) {
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

      // When in search mode, add a class to the top level <ul />.
      app.sidebarEl.addEventListener("searchmode", function(data) {
        if (data.detail.searching) {
          ul.classList.add("searching");
        } else {
          ul.classList.remove("searching");
        }
      });
    });
  }

  function configureSearch() {
    app.searchBoxEl.addEventListener("input", function(e) {
      const v = this.value;
      const evtData = {
        detail: {
          searching: false
        }
      };

      if (v) {
        evtData.detail.searching = true;
        app.sidebarEl.dispatchEvent(new CustomEvent("searchmode", evtData));
      } else {
        app.sidebarEl.dispatchEvent(new CustomEvent("searchmode", evtData));
      }

      query(app.apiURL + '/?q=' + encodeURIComponent(v)).then(
        function(json) {
          if (json.result) {

          } else {

          }
          console.log(json);
        }
      );
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
      const onPageChange = function() {
        a.classList.remove("active");
      };
      const onClick = function(e) {
        event.preventDefault();
        populateContent(app.apiURL + "/" + data.slug);
        app.sidebarEl.dispatchEvent(new Event('pagechange'));
        a.classList.add("active");
      };
      li.appendChild(a);
      a.href = data.slug;
      a.innerHTML = data.name;
      app.sidebarEl.addEventListener("pagechange", onPageChange);
      a.addEventListener("click", onClick, false);
      li.addEventListener("destroy", function destroyfn() {
        a.removeEventListener("click", onClick);
        app.sidebarEl.removeEventListener("pagechange", onPageChange);
        li.removeEventListener("destroy", destroyfn);
      });
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