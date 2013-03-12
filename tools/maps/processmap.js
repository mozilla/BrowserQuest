var fs = require("fs"),
    Log = require('log'),
    _ = require('underscore'),
    Types = require("../../shared/js/gametypes");

var map, mode;
var collidingTiles = {};
var staticEntities = {};
var mobsFirstGid = -1;

var log = new Log(Log.DEBUG, fs.createWriteStream('processmap.log'));

var isNumber = function(o) {
    return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
}

module.exports = function processMap(json, options) {
    var self = this, TiledJSON = json;
    var layerIndex = 0, tileIndex = 0;

    map = {
        width: 0,
        height: 0,
        collisions: [],
        doors: [],
        checkpoints: []
    };
    mode = options.mode;
    
    if(mode === "client") {
        map.data = [];
        map.high = [];
        map.animated = {};
        map.blocking = [];
        map.plateau = [];
        map.musicAreas = [];
    }
    if(mode === "server") {
        map.roamingAreas = [];
        map.chestAreas = [];
        map.staticChests = [];
        map.staticEntities = {};
    }
    
    log.info("Processing map info...");
    map.width = TiledJSON.width;
    map.height = TiledJSON.height;
    map.tilesize = TiledJSON.tilewidth;
    log.debug("Map is [" + map.width + "x" + map.height + "] Tile Size: " + map.tilesize);

    // Tile properties (collision, z-index, animation length...)
    var handleTileProp = function(propName, propValue, tileId) {
        if(propName === "c") {
            log.debug("Tile ID [" + tileId + "] is a collision tile")
            collidingTiles[tileId] = true;
        }
        
        if(mode === "client") {
            if(propName === "v") {
                map.high.push(tileId);
                log.debug("Tile ID [" + tileId + "] is a high tile (obscures foreground)");
            }
            if(propName === "length") {
                if(!map.animated[tileId]) {
                    map.animated[tileId] = {};
                    log.debug("Tile ID [" + tileId + "] is an animated tile");
                }
                map.animated[tileId].l = propValue;
            }
            if(propName === "delay") {
                if(!map.animated[tileId]) {
                    map.animated[tileId] = {};
                }
                map.animated[tileId].d = propValue;
            }
        }
    }

    // iterate through tilesets and process
    log.info("* Phase 1 Tileset Processing")
    if (TiledJSON.tilesets instanceof Array) {
        _.each(TiledJSON.tilesets, function(tileset) {
            var tileSetName = tileset.name.toLowerCase();

            if (tileSetName === "tilesheet") {
                log.info("** Processing map tileset properties...");

                // iterate through tileset tile properties
                _.each(tileset.tileproperties, function(value, name) {
                    var tileId = parseInt(name, 10) + 1;
                    log.info("*** Processing Tile ID " + tileId);

                    // iterate through individual properties
                    _.each(value, function(value, name) {
                        handleTileProp(name, (isNumber(parseInt(value, 10))) ? parseInt(value, 10) : value, tileId);
                    });
                });
            }
            else if (tileSetName === "mobs" && mode === "server") {
                log.info("** Processing static entity properties...");
                mobsFirstGid = tileset.firstgid;

                // iterate through tileset tile properties
                _.each(tileset.tileproperties, function(value, name) {
                   var tileId = parseInt(name, 10) + 1;
                    log.info("*** Processing Entity ID " + tileId + " type " + value.type);
                    staticEntities[tileId] = value.type;
                });
            }
        });
    } else {
        log.error("A tileset is missing");
    }

    // iterate through layers and process
    log.info("* Phase 2 Layer Processing");
    _.each(TiledJSON.layers, function(layer) {
        var layerName = layer.name.toLowerCase();
        var layerType = layer.type;

        // Door Layers
        if (layerName === "doors" && layerType === "objectgroup") {
            log.info("** Processing doors...");
            var doors = layer.objects;

            // iterate through the doors
            for (var j = 0; j < doors.length; j += 1) {
                map.doors[j] = {
                    x: doors[j].x / map.tilesize,
                    y: doors[j].y / map.tilesize,
                    p: (doors[j].type === 'portal') ? 1 : 0
                }

                // iterate through the door properties
                var doorProperties = doors[j].properties;
                _.each(doorProperties, function(value, name) {
                    map.doors[j]['t'+name] = (isNumber(parseInt(value, 10))) ? parseInt(value, 10) : value;
                });
            }
        }
        // Roaming Mob Areas
        else if (layerName === "roaming" && layerType === "objectgroup" && mode == "server") {
            log.info("** Processing roaming mob areas...");
            var areas = layer.objects;

            // iterate through areas
            for (var j = 0; j < areas.length; j += 1) {
                if(areas[j].properties) {
                    var nb = parseInt(areas[j].properties.nb, 10);
                }

                map.roamingAreas[j] = {
                    id: j,
                    x: areas[j].x / map.tilesize,
                    y: areas[j].y / map.tilesize,
                    width: areas[j].width / map.tilesize,
                    height: areas[j].height / map.tilesize,
                    type: areas[j].type,
                    nb: nb
                };
            }
        }
        // Chest Areas
        else if (layerName === "chestareas" && mode === "server") {
            log.info("** Processing chest areas...");
            var areas = layer.objects;

            // iterate through areas
            _.each(areas, function(area) {
                var chestArea = {
                    x: area.x / map.tilesize,
                    y: area.y / map.tilesize,
                    w: area.width / map.tilesize,
                    h: area.height / map.tilesize
                };

                // get items
                chestArea['i'] = _.map(area.properties.items.split(','), function(name) {
                    return Types.getKindFromString(name);
                });

                // iterate through remaining area's properties
                _.each(area.properties, function(value, name) {
                    if (name !== 'items') {
                        chestArea['t'+name] = (isNumber(parseInt(value, 10))) ? parseInt(value, 10) : value;
                    }
                });

                map.chestAreas.push(chestArea);
            });
        }
        // Static Chests
        else if (layerName === "chests" && mode === "server") {
            log.info("** Processing static chests...");
            var chests = layer.objects;

            // iterate through the static chests
            _.each(chests, function(chest) {
                var newChest = {
                    x: chest.x / map.tilesize,
                    y: chest.y / map.tilesize
                }

                // get items
                newChest['i'] = _.map(chest.properties.items.split(','), function(name) {
                    return Types.getKindFromString(name);
                });

                map.staticChests.push(newChest);
            });
        }
        // Music Trigger Areas
        else if (layerName === "music" && mode === "client") {
            log.info("** Processing music trigger areas...");
            var areas = layer.objects;

            // iterate through the music areas
            _.each(areas, function(music) {
                var musicArea = {
                    x: music.x / map.tilesize,
                    y: music.y / map.tilesize,
                    w: music.width / map.tilesize,
                    h: music.height / map.tilesize,
                    id: music.properties.id
                };

                map.musicAreas.push(musicArea);
            });
        }
        // Map Checkpoints
        else if (layerName === "checkpoints") {
            log.info("** Processing map checkpoints...");
            var checkpoints = layer.objects;
            var count = 0;

            // iterate through the checkpoints
            _.each(checkpoints, function(checkpoint) {
                var cp = {
                    id: ++count,
                    x: checkpoint.x / map.tilesize,
                    y: checkpoint.y / map.tilesize,
                    w: checkpoint.width / map.tilesize,
                    h: checkpoint.height / map.tilesize
                };

                if (mode === "server") {
                    cp.s = checkpoint.type ? 1 : 0;
                }

                map.checkpoints.push(cp);
            });
        }
    });

    // iterate through remaining layers
    log.info("* Phase 3 Tile Map Processing");
    for(var i = TiledJSON.layers.length - 1; i > 0; i -= 1) {
        processLayer(TiledJSON.layers[i]);
    }

    if(mode === "client") {
        log.info("* Phase 4 Map Data Fixup");

        // set all undefined tiles to 0
        for (var i = 0, max = map.data.length; i < max; i += 1) {
            if(!map.data[i]) {
                map.data[i] = 0;
            }
        }
    }

    return map;
};

var processLayer = function(layer) {
    var layerName = layer.name.toLowerCase();
    var layerType = layer.type;
    log.info("** Processing layer: " + layerName);

    if (mode === "server" && layerName === "entities") {
        log.info("*** Processing positions of static entities...");
        var tiles = layer.data;

        for(var j = 0; j < tiles.length; j += 1) {
            var gid = tiles[j] - mobsFirstGid + 1;
            if(gid && gid > 0) {
                map.staticEntities[j] = staticEntities[gid];
            }
        }
    }

    var tiles = layer.data;
    if(mode === "client" && layerName === "blocking") {
        log.info("*** Processing blocking tiles...");

        for(var i = 0; i < tiles.length; i += 1) {
            var gid = tiles[i];
            if(gid && gid > 0) {
                map.blocking.push(i);
            }
        }
    }
    else if(mode === "client" && layerName === "plateau") {
        log.info("*** Processing plateau tiles...");
        for(var i = 0; i < tiles.length; i += 1) {
            var gid = tiles[i];

            if(gid && gid > 0) {
                map.plateau.push(i);
            }
        }
    }
    else if(layerType == "tilelayer" && layer.visible !== 0 && layerName !== "entities") {
        log.info("*** Process raw layer data...");
        for(var j = 0; j < tiles.length; j += 1) {
            var gid = tiles[j];

            if(mode === "client") {
                // set tile gid in the tilesheet
                if(gid > 0) {
                    if(map.data[j] === undefined) {
                        map.data[j] = gid;
                    }
                    else if(map.data[j] instanceof Array) {
                        map.data[j].unshift(gid);
                    }
                    else {
                        map.data[j] = [gid, map.data[j]];
                    }
                }
            }

            // colliding tiles
            if(gid in collidingTiles) {
                map.collisions.push(j);
            }
        }
    }
}

