var _ = require('underscore');
var BISON = require('bison');
var cls = require('./lib/class');
var http = require('http');
var miksagoConnection = require('websocket-server/lib/ws/connection');
var url = require('url');
var useBison = false;
var Utils = require('./utils');
var worlizeRequest = require('websocket').request;
var WS = {};
var wsServer = require('websocket-server');

module.exports = WS;


/**
 * Abstract Server and Connection classes
 */
var Server = cls.Class.extend({
    init: function (port) {
        this.port = port;
    },

    onConnect: function (callback) {
        this.connectionCallback = callback;
    },

    onError: function (callback) {
        this.errorCallback = callback;
    },

    broadcast: function (message) {
        throw 'Not implemented';
    },

    forEachConnection: function (callback) {
        _.each(this._connections, callback);
    },

    addConnection: function (connection) {
        this._connections[connection.id] = connection;
    },

    removeConnection: function (id) {
        delete this._connections[id];
    },

    getConnection: function (id) {
        return this._connections[id];
    }
});


var Connection = cls.Class.extend({
    init: function (id, connection, server) {
        this._connection = connection;
        this._server = server;
        this.id = id;
    },

    onClose: function (callback) {
        this.closeCallback = callback;
    },

    listen: function (callback) {
        this.listenCallback = callback;
    },

    broadcast: function (message) {
        throw 'Not implemented';
    },

    send: function (message) {
        throw 'Not implemented';
    },

    sendUTF8: function (data) {
        throw 'Not implemented';
    },

    close: function (logError) {
        log.info('Closing connection to ' + this._connection.remoteAddress + '. Error: ' + logError);
        this._connection.close();
    }
});



/**
 * MultiVersionWebsocketServer
 *
 * Websocket server supporting draft-75, draft-76 and version 08+ of the WebSocket protocol.
 * Fallback for older protocol versions borrowed from https://gist.github.com/1219165
 */
WS.MultiVersionWebsocketServer = Server.extend({
    worlizeServerConfig: {
        // All options *except* 'httpServer' are required when bypassing
        // WebSocketServer.
        maxReceivedFrameSize: 0x10000,
        maxReceivedMessageSize: 0x100000,
        fragmentOutgoingMessages: true,
        fragmentationThreshold: 0x4000,
        keepalive: true,
        keepaliveInterval: 20000,
        assembleFragments: true,
        // autoAcceptConnections is not applicable when bypassing WebSocketServer
        // autoAcceptConnections: false,
        disableNagleAlgorithm: true,
        closeTimeout: 5000
    },
    _connections: {},
    _counter: 0,

    init: function (port, useOnePort) {
        var self = this;

        this._super(port);

        // Are we doing both client and server on one port?
        if (useOnePort === true) {
            // Yes, we are

            // Use 'connect' for its static module
            var connect = require('connect');
            var app = connect();

            // Serve everything in the client subdir statically
            app.use(connect.static('client'));

            // Display errors (such as 404's) in the server log
            app.use(connect.logger('dev'));

            // Generate (on the fly) the pages needing special treatment
            app.use(function handleDynamicPageRequests(request, response) {
                var path = url.parse(request.url).pathname;
                switch (path) {
                    case '/status':
                        // The server status page
                        if (self.statusCallback) {
                            response.writeHead(200);
                            response.write(self.statusCallback());
                        }
                        break;
                    case '/config/config_build.json':
                    case '/config/config_local.json':
                        // Generate the config_build/local.json files on the
                        // fly, using the host address and port from the
                        // incoming http header

                        // Grab the incoming host:port request string
                        var headerPieces = request.connection.parser.incoming.headers.host.split(':', 2);

                        // Determine new host string to give clients
                        var newHost;
                        if ((typeof headerPieces[0] === 'string') && (headerPieces[0].length > 0))  {
                            // Seems like a valid string, lets use it
                            newHost = headerPieces[0];
                        } else {
                            // The host value doesn't seem usable, so
                            // fallback to the local interface IP address
                            newHost = request.connection.address().address;
                        }

                        // Default port is 80
                        var newPort = 80;
                        if (2 === headerPieces.length) {
                            // We've been given a 2nd value, maybe a port #
                            if ((typeof headerPieces[1] === 'string') && (headerPieces[1].length > 0)) {
                                // If a usable port value was given, use that instead
                                var tmpPort = parseInt(headerPieces[1], 10);
                                if (!isNaN(tmpPort) && (tmpPort > 0) && (tmpPort < 65536)) {
                                    newPort = tmpPort;
                                }
                            }
                        }

                        // Assemble the config data structure
                        var newConfig = {
                            host: newHost,
                            port: newPort,
                            dispatcher: false,
                        };

                        // Make it JSON
                        var newConfigString = JSON.stringify(newConfig);

                        // Create appropriate http headers
                        var responseHeaders = {
                            'Content-Type': 'application/json',
                            'Content-Length': newConfigString.length
                        };

                        // Send it all back to the client
                        response.writeHead(200, responseHeaders);
                        response.end(newConfigString);
                        break;
                    case '/shared/js/file.js':
                        // Sends the real shared/js/file.js to the client
                        sendFile('js/file.js', response, log);
                        break;
                    case '/shared/js/gametypes.js':
                        // Sends the real shared/js/gametypes.js to the client
                        sendFile('js/gametypes.js', response, log);
                        break;
                    default:
                        response.writeHead(404);
                }
                response.end();
            });

            this._httpServer = http.createServer(app).listen(port, function serverEverythingListening() {
                log.info('Server (everything) is listening on port ' + port);
            });
        } else {
            // Only run the server side code
            this._httpServer = http.createServer(function statusListener(request, response) {
                var path = url.parse(request.url).pathname;
                if ((path === '/status') && self.statusCallback) {
                    response.writeHead(200);
                    response.write(self.statusCallback());
                } else {
                    response.writeHead(404);
                }
                response.end();
            });
            this._httpServer.listen(port, function serverOnlyListening() {
                log.info('Server (only) is listening on port ' + port);
            });
        }

        this._miksagoServer = wsServer.createServer();
        this._miksagoServer.server = this._httpServer;
        this._miksagoServer.addListener('connection', function webSocketListener(connection) {
            // Add remoteAddress property
            connection.remoteAddress = connection._socket.remoteAddress;

            // We want to use "sendUTF" regardless of the server implementation
            connection.sendUTF = connection.send;
            var c = new WS.miksagoWebSocketConnection(self._createId(), connection, self);

            if (self.connectionCallback) {
                self.connectionCallback(c);
            }
            self.addConnection(c);
        });

        this._httpServer.on('upgrade', function httpUpgradeRequest(req, socket, head) {
            if (typeof req.headers['sec-websocket-version'] !== 'undefined') {
                // WebSocket hybi-08/-09/-10 connection (WebSocket-Node)
                var wsRequest = new worlizeRequest(socket, req, self.worlizeServerConfig);
                try {
                    wsRequest.readHandshake();
                    var wsConnection = wsRequest.accept(wsRequest.requestedProtocols[0], wsRequest.origin);
                    var c = new WS.worlizeWebSocketConnection(self._createId(), wsConnection, self);
                    if(self.connectionCallback) {
                        self.connectionCallback(c);
                    }
                    self.addConnection(c);
                }
                catch(e) {
                    console.log('WebSocket Request unsupported by WebSocket-Node: ' + e.toString());
                    return;
                }
            } else {
                // WebSocket hixie-75/-76/hybi-00 connection (node-websocket-server)
                if (req.method === 'GET' &&
                    (req.headers.upgrade && req.headers.connection) &&
                    req.headers.upgrade.toLowerCase() === 'websocket' &&
                    req.headers.connection.toLowerCase() === 'upgrade') {
                    new miksagoConnection(self._miksagoServer.manager, self._miksagoServer.options, req, socket, head);
                }
            }
        });
    },

    _createId: function() {
        return '5' + Utils.random(99) + '' + (this._counter++);
    },

    broadcast: function (message) {
        this.forEachConnection(function(connection) {
            connection.send(message);
        });
    },

    onRequestStatus: function (statusCallback) {
        this.statusCallback = statusCallback;
    }
});


/**
 * Connection class for Websocket-Node (Worlize)
 * https://github.com/Worlize/WebSocket-Node
 */
WS.worlizeWebSocketConnection = Connection.extend({
    init: function (id, connection, server) {
        var self = this;

        this._super(id, connection, server);

        this._connection.on('message', function onConnectionMessage(message) {
            if (self.listenCallback) {
                if (message.type === 'utf8') {
                    if (useBison) {
                        self.listenCallback(BISON.decode(message.utf8Data));
                    } else {
                        try {
                            self.listenCallback(JSON.parse(message.utf8Data));
                        } catch(e) {
                            if (e instanceof SyntaxError) {
                                self.close('Received message was not valid JSON.');
                            } else {
                                throw e;
                            }
                        }
                    }
                }
            }
        });

        this._connection.on('close', function onConnectionClose(connection) {
            if (self.closeCallback) {
                self.closeCallback();
            }
            delete self._server.removeConnection(self.id);
        });
    },

    send: function(message) {
        var data;
        if (useBison) {
            data = BISON.encode(message);
        } else {
            data = JSON.stringify(message);
        }
        this.sendUTF8(data);
    },

    sendUTF8: function(data) {
        this._connection.sendUTF(data);
    }
});


/**
 * Connection class for websocket-server (miksago)
 * https://github.com/miksago/node-websocket-server
 */
WS.miksagoWebSocketConnection = Connection.extend({
    init: function (id, connection, server) {
        var self = this;

        this._super(id, connection, server);

        this._connection.addListener('message', function (message) {
            if (self.listenCallback) {
                if (useBison) {
                    self.listenCallback(BISON.decode(message));
                } else {
                    self.listenCallback(JSON.parse(message));
                }
            }
        });

        this._connection.on('close', function (connection) {
            if (self.closeCallback) {
                self.closeCallback();
            }
            delete self._server.removeConnection(self.id);
        });
    },

    send: function(message) {
        var data;
        if (useBison) {
            data = BISON.encode(message);
        } else {
            data = JSON.stringify(message);
        }
        this.sendUTF8(data);
    },

    sendUTF8: function(data) {
        this._connection.send(data);
    }
});

// Sends a file to the client
function sendFile (file, response, log) {
    try {
        var fs = require('fs');
        var realFile = fs.readFileSync(__dirname + '/../../shared/' + file);
        var responseHeaders = {
            'Content-Type': 'text/javascript',
            'Content-Length': realFile.length
        };
        response.writeHead(200, responseHeaders);
        response.end(realFile);
    }
    catch (err) {
        response.writeHead(500);
        log.error('Something went wrong when trying to send ' + file);
        log.error('Error stack: ' + err.stack);
    }
}
