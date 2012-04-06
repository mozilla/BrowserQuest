BrowserQuest server documentation
=================================

The game server currently runs on nodejs v0.4.7 (but should run fine on the latest stable as well) and requires the latest versions of the following npm libraries:

- underscore
- log
- bison
- websocket
- websocket-server
- sanitizer
- memcache (only if you want metrics)

All of them can be installed via `npm install -d` (this will install a local copy of all the dependencies in the node_modules directory)


Configuration
-------------

The server settings (number of worlds, number of players per world, etc.) can be configured.
Copy `config_local.json-dist` to a new `config_local.json` file, then edit it. The server will override default settings with this file.


Deployment
----------

In order to deploy the server, simply copy the `server` and `shared` directories to the staging/production server.

Then run `node server/js/main.js` in order to start the server.


Note: the `shared` directory is the only one in the project which is a server dependency.


Monitoring
----------

The server has a status URL which can be used as a health check or simply as a way to monitor player population.

Send a GET request to: `http://[host]:[port]/status`

It will return a JSON array containing the number of players in all instanced worlds on this game server.
