
require.paths.push(".");

var fs = require('fs'),
    cls = require('class'),
    GameClient = require('gameclient'),
    WebSocketClient = require('websocket').client,
    Types = require("gametypes").Types,
    _ = require('underscore');

var random = function(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
};

fs.readFile('config.json', 'utf8', function(err, json_string) {
    if(err) {
        console.error("Could not open config file: ", err);
        process.exit(1);
    }
    
    var config = JSON.parse(json_string);
        NB_CLIENTS = config.nb_clients,
        HOST = config.host,
        PORT = config.port,
        clients = [],
        count = 0;
    
    var createClient = function(i) {
        var client = new WebSocketClient();

        client.on('connectFailed', function(error) {
            console.log("Connect Error: " + error.toString());
        });

        client.on('connect', function(connection) {
            console.log('connection #'+ (++count));
            console.log("WebSocket client connected");

            var client = new GameClient(connection, { useBison: config.useBison });

            if (connection.connected) {
                /*
                var x = random(10, 150),
                    y = random(60, 280);*/
                var x = 43,
                    y = 210;
                
                client.sendHello('test_player_'+i);
                
                client.x = x;
                client.y = y;
            }

            connection.on('error', function(error) {
                console.log("Connection "+i+" Error: " + error.toString());
            });

            connection.on('close', function() {
                console.log("Connection "+i+" Closed");
            });

            connection.on('message', function(message) {
                if(message.type === 'utf8') {
                    //console.log("data: "+message.utf8Data);
                    var data = JSON.parse(message.utf8Data);
                    if(data) {
                        var receiveMessage = function(message) {
                            if(message[0] === Types.Messages.LIST) {
                                message.shift();
                                var who = _.rest(message, Math.floor(_.size(message) * (2/3)));
                                client.sendWho(who);
                            }
                        };
                        
                        if(data instanceof Array) {
                            _.each(data, receiveMessage);
                        } else {
                            receiveMessage(data);
                        }
                    }
                }
            });

            var automove = function() {
                setInterval(function() {
                    if(random(1, 10) === 1) {
                        var pos = getRandomClosePosition(client.x, client.y, 3);
                        
                        client.sendMove(pos.x, pos.y);
                        client.sendZone();
                        client.x = pos.x;
                        client.y = pos.y;
                    }
                }, config.moveInterval);

                setInterval(function() {
                    if(random(1, 20) === 1) {
                        client.sendChat("hello world!");
                    }
                }, config.chatInterval);
            };

            setTimeout(automove, 1000);
        });

        client.connect("ws://"+HOST+":"+PORT, 'echo-protocol');

        return client;
    };
    
    var i = NB_CLIENTS;
    var connecting = setInterval(function() {
        clients.push(createClient(NB_CLIENTS - --i));
        if(i === 0) {
            clearInterval(connecting);
        }
    }, 50);
});

var getRandomClosePosition = function(x, y, range) {
    var rx = 0,
        ry = 0;
    
    while(rx <= 0 || ry <= 0 || rx >= 167 || ry >= 287) {
        rx = x + random(-range, range);
        ry = y + random(-range, range);
    }
    return { x: rx, y: ry };
};
