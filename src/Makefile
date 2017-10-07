all: clean spartan.min.js

spartan.min.js:
	babel --minified \
		--no-comments \
		--no-babelrc \
		-o spartan.min.js \
		spartan.js

clean:
	rm spartan.min.js
