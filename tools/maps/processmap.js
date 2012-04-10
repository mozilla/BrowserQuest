
var Log = require('log'),
    _ = require('underscore'),
    log = new Log(Log.DEBUG),
    Types = require("../../shared/js/gametypes");

var map,
    mode,
    collidingTiles = {},
    staticEntities = {},
    mobsFirstgid;

module.exports = function processMap(json, options) {
    var self = this,
        Tiled = json.map,
		layerIndex = 0,
		tileIndex = 0,
		tilesetFilepath = "";
	
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
    map.width = Tiled.width;
    map.height = Tiled.height;
    map.tilesize = Tiled.tilewidth;

    // Tile properties (collision, z-index, animation length...)
    var tileProperties;
    var handleProp = function(property, id) {
        if(property.name === "c") {
            collidingTiles[id] = true;
        }
        
        if(mode === "client") {
            if(property.name === "v") {
                map.high.push(id);
            }
            if(property.name === "length") {
                if(!map.animated[id]) {
                    map.animated[id] = {};
                }
                map.animated[id].l = property.value;
            }
            if(property.name === "delay") {
                if(!map.animated[id]) {
                    map.animated[id] = {};
                }
                map.animated[id].d = property.value;
            }
        }
    }
    
    if(Tiled.tileset instanceof Array) {
        _.each(Tiled.tileset, function(tileset) {
            if(tileset.name === "tilesheet") {
                log.info("Processing terrain properties...");
                tileProperties = tileset.tile;
                for(var i=0; i < tileProperties.length; i += 1) {
                    var property = tileProperties[i].properties.property;
                    var tilePropertyId = tileProperties[i].id + 1;
                    if(property instanceof Array) {
                        for(var pi=0; pi < property.length; pi += 1) {
                            handleProp(property[pi], tilePropertyId);
                        }
                    } else {
                        handleProp(property, tilePropertyId);
                    }
                }
            }
            else if(tileset.name === "Mobs" && mode === "server") {
                log.info("Processing static entity properties...");
                mobsFirstgid = tileset.firstgid;
                _.each(tileset.tile, function(p) {
                    var property = p.properties.property,
                        id = p.id + 1;

                    if(property.name === "type") {
                        staticEntities[id] = property.value;
                    }
                });
            }
        });
    } else {
        log.error("A tileset is missing");
    }
    
    
    for(var i=0; i < Tiled.objectgroup.length; i += 1) {
        var group = Tiled.objectgroup[i];
        if(group.name === 'doors') {
            var doors = group.object;
            log.info("Processing doors...");
            for(var j=0; j < doors.length; j += 1) {
                map.doors[j] = {
                    x: doors[j].x / map.tilesize,
                    y: doors[j].y / map.tilesize,
                    p: (doors[j].type === 'portal') ? 1 : 0,
                }
                var doorprops = doors[j].properties.property;
                for(var k=0; k < doorprops.length; k += 1) {
                    map.doors[j]['t'+doorprops[k].name] = doorprops[k].value;
                }
            }
        }
    }

    // Object layers
    _.each(Tiled.objectgroup, function(objectlayer) {
        if(objectlayer.name === "roaming" && mode === "server") {
            log.info("Processing roaming areas...");
            var areas = objectlayer.object;
    
            for(var i=0; i < areas.length; i += 1) {
                if(areas[i].properties) {
                    var nb = areas[i].properties.property.value;
                }
        
                map.roamingAreas[i] = {  id: i,
                                         x: areas[i].x / 16,
                                         y: areas[i].y / 16,
                                         width: areas[i].width / 16,
                                         height: areas[i].height / 16,
                                         type: areas[i].type,
                                         nb: nb
                                       };
            }
        }
        else if(objectlayer.name === "chestareas" && mode === "server") {
            log.info("Processing chest areas...");
            _.each(objectlayer.object, function(area) {
                var chestArea = {
                    x: area.x / map.tilesize,
                    y: area.y / map.tilesize,
                    w: area.width / map.tilesize,
                    h: area.height / map.tilesize
                };
                _.each(area.properties.property, function(prop) {
                    if(prop.name === 'items') {
                        chestArea['i'] = _.map(prop.value.split(','), function(name) { 
                            return Types.getKindFromString(name);
                        });
                    } else {
                        chestArea['t'+prop.name] = prop.value;
                    }
                });
                map.chestAreas.push(chestArea);
            });
        }
        else if(objectlayer.name === "chests" && mode === "server") {
            log.info("Processing static chests...");
            _.each(objectlayer.object, function(chest) {
                var items = chest.properties.property.value;
                var newChest = {
                    x: chest.x / map.tilesize,
                    y: chest.y / map.tilesize,
                    i: _.map(items.split(','), function(name) {
                        return Types.getKindFromString(name);
                    })
                };
                map.staticChests.push(newChest);
            });
        }
        else if(objectlayer.name === "music" && mode === "client") {
            log.info("Processing music areas...");
            _.each(objectlayer.object, function(music) {
                var musicArea = {
                    x: music.x / map.tilesize,
                    y: music.y / map.tilesize,
                    w: music.width / map.tilesize,
                    h: music.height / map.tilesize,
                    id: music.properties.property.value
                };
                map.musicAreas.push(musicArea);
            });
        }
        else if(objectlayer.name === "checkpoints") {
            log.info("Processing check points...");
            var count = 0;
            _.each(objectlayer.object, function(checkpoint) {
                var cp = {
                    id: ++count,
                    x: checkpoint.x / map.tilesize,
                    y: checkpoint.y / map.tilesize,
                    w: checkpoint.width / map.tilesize,
                    h: checkpoint.height / map.tilesize
                };
                if(mode === "server") {
                    cp.s = checkpoint.type ? 1 : 0;
                }
                map.checkpoints.push(cp);
            });
        }
    });

    // Layers
    if(Tiled.layer instanceof Array) {
        for(var i=Tiled.layer.length - 1; i > 0; i -= 1) {
            processLayer(Tiled.layer[i]);
        }
    } else {
        processLayer(Tiled.layer);
    }
    
    if(mode === "client") {
        // Set all undefined tiles to 0
        for(var i=0, max=map.data.length; i < max; i+=1) {
            if(!map.data[i]) {
                map.data[i] = 0;
            }
        }
    }
      
    return map;
};

var processLayer = function processLayer(layer) {
    if(mode === "server") {
        // Mobs
        if(layer.name === "entities") {
            log.info("Processing positions of static entities ...");
            var tiles = layer.data.tile;
            
            for(var j=0; j < tiles.length; j += 1) {
                var gid = tiles[j].gid - mobsFirstgid + 1;
                if(gid && gid > 0) {
                    map.staticEntities[j] = staticEntities[gid];
                }
            }
        }
    }
    
    var tiles = layer.data.tile;
    
    if(mode === "client" && layer.name === "blocking") {
        log.info("Processing blocking tiles...");
        for(var i=0; i < tiles.length; i += 1) {
            var gid = tiles[i].gid;
            
            if(gid && gid > 0) {
                map.blocking.push(i);
            }
        }
    }
    else if(mode === "client" && layer.name === "plateau") {
        log.info("Processing plateau tiles...");
        for(var i=0; i < tiles.length; i += 1) {
            var gid = tiles[i].gid;
            
            if(gid && gid > 0) {
                map.plateau.push(i);
            }
        }
    }
    else if(layer.visible !== 0 && layer.name !== "entities") {
        log.info("Processing layer: "+ layer.name);
        
        for(var j=0; j < tiles.length; j += 1) {
            var gid = tiles[j].gid;

            if(mode === "client") {
                // Set tile gid in the tilesheet
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
            
            // Colliding tiles
            if(gid in collidingTiles) {
                map.collisions.push(j);
            }
        }
    }
}