mocha = ../node_modules/.bin/mocha --reporter spec

test:
	cd client && $(mocha)
	cd server && $(mocha)

all: test

.PHONY: test
