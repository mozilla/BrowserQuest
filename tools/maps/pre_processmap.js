#!/usr/bin/env node

/**
 * This is meant for people who want to add sprites to the tilesheet and don't want to have to click on each tile that's a collision tile.
 *     original Tiled JSON              →      resulting Tiled JSON
 * |  |  |    |  |       |  |  |  |  |     |  |  |  |  |  |  |  |  |  |
 * |  |  |tl:c|  |       |  |  |tr|  |     |  |  | c| c| c| c| c| c|  |
 * |  |  |    |  |       |  |  |  |  |     |  |  | c| c| c| c| c| c|  |
 * |  |  |    |  |       |  |  |  |  |  →  |  |  | c| c| c| c| c| c|  |
 * |  |  |bl  |  |       |  |  |  |  |     |  |  | c| c| c| c| c| c|  |
 * |  |  |    |  |tl:v,bl|  |  |  |tr|     |  |  |  |  | v| v| v| v| v|
 * |  |  |    |  |       |  |  |  |  |     |  |  |  |  |  |  |  |  |  |
 * (tl,tr,bl) / (tl,tr) / (tl,bl) can exist in the same tile
 * two surfaces cannot overlap !
 * ./pre_processmap.js source (destination) → if destination is omitted source is overwritten (use at your own risks…)
 */
 
var fs = require("fs"),
    file = require("../../shared/js/file"),
    Log = require('log'),
    _ = require('underscore'),
    Types = require("../../shared/js/gametypes");

var source = process.argv[2],
    destination = process.argv[3],
    log = new Log(Log.DEBUG);

/* Dirty dirty add-on…*/
/**
 * p:{pi:[a,b,c], pj:[d]}
 * if property  "N":{"p":""}
 * then "N+a":{"pi":""},"N+b":{"pi":""},"N+c":{"pi":""},"N+d":{"pj":""}
 */
var extra_shapes = {
		roof1:{v:[0, 19,20,21, 38,39,40,41,42, 57,58,59,60,61,62,63, 77,78,79,80,81,82,83]},
		roof2:{v:[  -1 ,0 ,1 , 18,19,20,21,22, 37,38,39,40,41,42,43, 57,58,59,60,61,62,63]}
	};

function specific_shapes(tileset, tileId){
	_.each(extra_shapes, function(value, key) {
		if(typeof tileset.tileproperties[tileId][key] !== "undefined"){
	log.debug(key+":"+JSON.stringify(tileId));
			tileset.tileproperties[tileId][key]=undefined;
			_.each(value, function(tiles, attribute) {
				var list_modified=[];
				for(var i=0;i<tiles.length;i++){
					list_modified.push(tileId+tiles[i]);
					if(typeof tileset.tileproperties[tileId+tiles[i]] === "undefined"){
						tileset.tileproperties[tileId+tiles[i]] = {};
					}
					tileset.tileproperties[tileId+tiles[i]][attribute]="";
				}
				log.debug(tileId+":"+attribute+" → "+JSON.stringify(list_modified));
			});
		}
	});
}
		

function isInt(n) {
   return typeof n === 'number' && n % 1 === 0;
}

function preprocessMap(json) {
    if (json.tilesets instanceof Array) {
        _.each(json.tilesets, function(tileset) {
            var tileSetWidth = tileset.imagewidth / tileset.tilewidth;
            if(!isInt(tileSetWidth)){
				log.error("** The tileSetWidth ("+tileSetWidth+") is not an integer… abort! abort!");
				return false;
			}
			var c=[], currentOrigin=0, tileId, countBase=0; //Origin / Base pointers to fifo C
			_.each(tileset.tileproperties, function(recording, name) {
				tileId = parseInt(name, 10);
				if(typeof recording.tl !== "undefined"){
					/**/log.info("tl :"+tileId+"/"+recording.tl);
					if(typeof c[currentOrigin] === "undefined"){//we have the width of previous collision series
						c.push({origin:tileId});
						c[currentOrigin]["prop"]=recording.tl;
					}
					else{
						log.error("** there is inconsistency between tile "+tileId+" (tl) and "+ c[currentOrigin].origin+" which has not found its tr yet. Abort!");
						//return false;
					}
				}
				if(typeof recording.tr !== "undefined"){
					/**/log.info("tr :"+tileId);
					//check same line…
					if((typeof c[currentOrigin].origin !== "undefined") && (typeof c[currentOrigin].width === "undefined")){
						if(Math.floor(tileId/tileSetWidth) == Math.floor(c[currentOrigin].origin/tileSetWidth)){
							c[currentOrigin].width = tileId - c[currentOrigin].origin + 1; //the actual number of tiles
							currentOrigin++;
						}
						else{
							log.error("** "+tileId+" (tr) and "+ c[currentOrigin].origin+" (tl) are not on the same line. Abort!");
							//return false;
						}
					}
					else{
						log.error("** "+tileId+" (tr) but "+ c[currentOrigin].width+" is also tr. Abort!");
						//return false;
					}
				}
				if(typeof recording.bl !== "undefined"){
					/**/log.info("bl :"+tileId);
					if( typeof recording.tl !== "undefined" ){//just one line
						c[currentOrigin].height = 1;
						countBase++;
					}	
					else {
						var ok=false;
						for(var i=0; i<c.length && !ok; i++){
							if(typeof c[i].height === "undefined"){
								c[i].height = ((tileId - c[i].origin)/tileSetWidth)+1; //used as a tmp var, ok only if same column
								//check same column…
								if(isInt(c[i].height)){
									countBase++;
									ok = true;
								}
								else{
									c[i].height = undefined;
								}
							}
						}
						if(!ok){
							log.error("** "+tileId+" (bl) could not be associated to any set… Abort!");
							//return false;
						}
					}
				}
				specific_shapes(tileset, tileId);
			});
			if(currentOrigin !== countBase){
				log.error("** Not the same quantity of origins ("+currentOrigin+") and bases ("+countBase+"): abort");
				//return false;
			}
			else{ //process
				var i,j,k;
				for(i=0;i<c.length;i++){
					log.info("(o:"+c[i].origin+",w:"+c[i].width+",h:"+c[i].height+",p:"+c[i].prop+").");
					for(j=0; j<c[i].height; j++){
						for(k=0; k<c[i].width; k++){
							tileId = c[i].origin + (j*tileSetWidth) + k;
							if(typeof tileset.tileproperties[tileId] !== "undefined"){
								if(typeof tileset.tileproperties[tileId].tl !== "undefined"){
									tileset.tileproperties[tileId].tl = undefined;
								}
								if(typeof tileset.tileproperties[tileId].tr !== "undefined"){
									tileset.tileproperties[tileId].tr = undefined;
								}
								if(typeof tileset.tileproperties[tileId].bl !== "undefined"){
									tileset.tileproperties[tileId].bl = undefined;
								}
							}
							else{
								tileset.tileproperties[tileId]={};
							}
							tileset.tileproperties[tileId][c[i].prop]="";
						}
					}
				}
			}
        });
        return json;
    } else {
        log.error("A tileset is missing");
        return false;
    }
}

// Loads the temporary JSON Tiled map converted by tmx2json.py
function getTiledJSONmap(filename, callback) {
    file.exists(filename, function(exists) {
        if(!exists) {  
            log.error(filename + " doesn't exist.")
            return;
        }
    
        fs.readFile(filename, function(err, file) {
             save(callback(JSON.parse(file.toString())), destination);
        });
    });
}

function save(json, dest){
	if(json !== false){
		var jsonMap = JSON.stringify(json); // Save the processed map object as JSON data
		fs.writeFile(dest, jsonMap, function(err, file) {
			log.info("Finished processing map file: "+ dest + " was saved.");
		});
	}
}

function main(){
	if(typeof destination == "undefined"){
		destination = source;
	}
	getTiledJSONmap(source, preprocessMap);
}

main();

