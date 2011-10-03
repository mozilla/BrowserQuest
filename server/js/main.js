
var fs = require('fs');


function main(config) {
    var ws = require("./ws"),
        WorldServer = require("./worldserver"),
        Log = require('log'),
        _ = require('underscore'),
        server = new ws.MultiVersionWebsocketServer(config.port),
        worlds = [];
    
    switch(config.debug_level) {
        case "error":
            log = new Log(Log.ERROR); break;
        case "debug":
            log = new Log(Log.DEBUG); break;
        case "info":
            log = new Log(Log.INFO); break;
    };
    
    server.onConnect(function(connection) {
        var world = _.detect(worlds, function(world) {
            return world.playerCount < config.nb_players_per_world;
        });
        if(world) {
            world.connect_callback(new Player(connection, world));
        }
    });

    server.onError(function() {
        log.error(Array.prototype.join.call(arguments, ", "));
    });

    _.each(_.range(config.nb_worlds), function(i) {
        var world = new WorldServer('world'+ (i+1), config.nb_players_per_world, server);
        world.run(config.map_filepath);
        worlds.push(world);
    });
    
    server.onRequestStatus(function() {
        var status = [];
        _.each(worlds, function(world) {
            status.push(world.playerCount);
        });
        return JSON.stringify(status);
    });
}

function getConfigFile(path, callback) {
    fs.readFile(path, 'utf8', function(err, json_string) {
        if(err) {
            console.error("Could not open config file:", err.path);
            callback(null);
        } else {
            callback(JSON.parse(json_string));
        }
    });
}


getConfigFile('./server/config.json', function(defaultConfig) {
    getConfigFile('./server/config_local.json', function(localConfig) {
        if(localConfig) {
            main(localConfig);
        } else if(defaultConfig) {
            main(defaultConfig);
        } else {
            console.error("Server cannot start without any configuration file.");
            process.exit(1);
        }
    });
});
