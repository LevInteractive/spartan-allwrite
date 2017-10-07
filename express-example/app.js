const express = require('express')
const allwrite = require('allwrite-middleware-connect');
const app = express()

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.send('check out our docs! at <a href="/docs">/docs</a>')
})

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

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
