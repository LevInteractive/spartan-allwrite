#!/bin/sh
babel --minified \
	--no-comments \
	--no-babelrc \
	-o app.min.js \
	app.js
