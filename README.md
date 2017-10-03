# Spartan

This is a minimal theme for [Allwrite Docs](https://github.com/LevInteractive/allwrite-docs/). It
has zero dependencies and is built for speed.

For what it's worth, the file is 3k.

## Demo

Coming soon.

## To use:


#### Step 1

Add the following div:

```html
<div
  id="allwrite-docs"
  class="allwrite-docs"
  data-api="http://localhost:8000"></div>
```

* `data-api` should be your allwrite instance.

#### Step 2

Then add the [app.js](app.js) and include the [css](style.css) and adjust to
your liking. You'll also need to add highlight.js (as seen in
[index.html](index.html)) if you want code highlighting.
