#!/usr/bin/env node

var util = require('util'),
    Log = require('log'),
    path = require("path"),
    fs = require("fs"),
    file = require("../../shared/js/file"),
    processMap = require('./processmap'),
    log = new Log(Log.DEBUG);
    
var source = process.argv[2],
    mode = process.argv[3],
    destination = process.argv[4];

if(!mode){
	mode = "direct";
}

if(!source || (mode!="direct" && mode!="both" && mode!="client" && mode!="server") || (mode!="direct" && !destination)) {
    util.puts("Usage : ./exportmap.js tiled_json_file [mode] [destination]");
    util.puts("Optional parameters : mode & destination. Values:");
    util.puts("    - \"direct\" (default) → updates current server and map files (WARNING: SHOULD ONLY BE CALLED FROM BrowserQuest/tools/maps !!!);");
    util.puts("    - \"client destination_file\" → will generate destination_file.js and destination_file.json for client side map;");
    util.puts("    - \"server destination_file.json\" → will generate destination_file.json for server side map;");
    util.puts("    - \"both destination_directory\" → will generate world_client.js, world_client.json and world_server.json in directory.");
    process.exit(0);
}

function main() {
    getTiledJSONmap(source, callback_function);
}

function callback_function(json) {
	switch(mode){
		case "client":
			processClient(json, destination);
			break;
		case "server":
			processServer(json, destination);
			break;
		case "direct":
			processClient(json, "../../client/maps/world_client");
			processServer(json, "../../server/maps/world_server.json");
			break;
			
		case "both":
			var directory=destination.replace(/\/+$/,'');//strip last path slashes
			processClient(json, directory+"/world_client");
			processServer(json, directory+"/world_server.json");
			break;
		default:
			util.puts("Unrecognized mode, how on earth did you manage that ?");
	}	
}

function processClient(json, dest){
	var jsonMap = JSON.stringify(processMap(json, {mode:"client"})); // Save the processed map object as JSON data
	// map in a .json file for ajax loading
	fs.writeFile(dest+".json", jsonMap, function(err, file) {
		if(err){
			log.error(JSON.stringify(err));
		}
		else{
			log.info("Finished processing map file: "+ dest + ".json was saved.");
		}
	});
	
	// map in a .js file for web worker loading
	jsonMap = "var mapData = "+jsonMap;
	fs.writeFile(dest+".js", jsonMap, function(err, file) {
		if(err){
			log.error(JSON.stringify(err));
		}
		else{
			log.info("Finished processing map file: "+ dest + ".js was saved.");
		}
	});
}

function processServer(json, dest){
	var jsonMap = JSON.stringify(processMap(json, {mode:"server"})); // Save the processed map object as JSON data
	fs.writeFile(dest, jsonMap, function(err, file) {
		if(err){
			log.error(JSON.stringify(err));
		}
		else{
			log.info("Finished processing map file: "+ dest + " was saved.");
		}
	});
}

function getTiledJSONmap(filename, callback) {
    var self = this;
    
    file.exists(filename, function(exists) {
        if(!exists) {  
            log.error(filename + " doesn't exist.")
            return;
        }
    
        fs.readFile(filename, function(err, file) {
            callback(JSON.parse(file.toString()));
        });
    });
}

main();
