# Spartan

This is a minimal theme for [Allwrite Docs](https://github.com/LevInteractive/allwrite-docs/). It
has zero dependencies and is built for speed.

You can use the latest and greatest libraries (react, redux, etc) with allwrite, but the goal
of this library is to minimal, fast, and not require compilation to run.

## Local Demo

Once you have a local or remote allwrite server running, simply `cd` to
[/express-example](/express-example) and run `npm install` and then `npm start`.

## To use:

#### Step 1

Add the following div:

```html
<div
  id="allwrite-docs"
  class="allwrite-docs"
  data-root="/my/docs/path"
  data-api="http://localhost:8000"></div>
```

* `data-api` should be your allwrite instance.
* `data-root` is optional if your serving docs from the root. However, if you're serving from a base slug like `/docs`, then you'll need to set that to the base.

#### Step 2

Then add the [app.js](app.js) and include the [css](style.css) and adjust to
your liking. You'll also need to add highlight.js (as seen in
[index.html](index.html)) if you want code highlighting.

## SEO

Spartan is a single-page-app and makes use of the html5 history API. This is
awesome for performance, but isn't great for SEO. However, you can use
middleware to render the content on the server as seen in the [express-example](/express-example).

**Middleware**

* [allwrite-middleware-connect](https://github.com/LevInteractive/allwrite-middleware-connect)
