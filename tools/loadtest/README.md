Load testing tool
=================

This tool can be used to load test a BrowserQuest game server.

* It will spawn bot players randomly moving and sending chat messages.

* Requirements: 
nodejs

* Required npm modules:
─ `bison`
─ `log`
─ `underscore`
─ `websocket`

* Usage:
- `cd tools/loadtest/`
- `node main.js`

Note: this tool can be moved and run from another location since it has no other dependency in the BrowserQuest repository.

* Change settings in tools/loadtest/config.json