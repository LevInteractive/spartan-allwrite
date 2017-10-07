const express = require('express')
const allwrite = require('allwrite-middleware-connect');
const app = express()

// Let's use pug!
app.set('view engine', 'pug')

// You could optionally make the docs feed from the root, but let's use /docs
// instead to demonstrate how to have a base URL.
app.get('/', (req, res) => res.send('<a href="/docs">/docs</a>'))

// 1) Listen to /docs/*
// 2) Pass in the middleware
// 3) Pass data to pug template.
app.get(
  '/docs/:slug?',
  allwrite("http://localhost:8000", "/docs"),
  (req, res, next) => {
    if (req.allwriteData.code === 404) {
      const err = new Error("Page not found");
      err.code = 404;
      return next(err);
    }
    res.render("docs", {
      title: req.allwriteData.result.name,
      content: req.allwriteData.result.html,
    });
  }
)

// To serve up our local files. You'll probably want to use the CDN instead.
app.use(express.static(
  require('path').resolve(__dirname, '../', 'src')
));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
