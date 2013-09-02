Descriptions

area.js
Functions to add or remove mobs from areas

character.js
Function to get health info

checkpoint.js
Create the checkpoint of your player

chest.js
Functions to generate chest content

chestarea.js
Put chests on specific areas

databasehandler.js
sets redis-server information as well as other facts to store in the
database

entity.js
creates mobs in the world

format.js
sets if a function is either a string or a number (is chest open? 0 or
1 (number). what weapon are you wielding sword2 (string))

formulas.js
formulas for weapon damage and defense damage

guild.js
Functions how the guild works - guild invite, how many members are
online etc

item.js
Handles how items on the ground starts blinking and then despawns if
left untouched

lib/
libraries used by the server

main.js
Main file, for starting up. Starts database connection, world server etc

map.js
Initializes the map (as in the world you play in, not a mini-map)

message.js
Dictates which messages are sent to the client

metrics.js
Shows some statistics about players in-game. Really poor at the moment.

mob.js
Functions to have a mob generate hate for a player, drop items or return
to his spawn position

mobarea.js
Creates the area where the mob spawns, where it roams etc

npc.js
Functions to have NPCs standing on location x y.

player.js
Functions to get information about the players character (items etc)

properties.js
Contains properties of creatures (how much hp and what they drop)

utils.js
Functions for calculations (distance to something, randomization etc)

worldserver.js
This loads up things such as mobs, chests, pushes info to client etc 

ws.js
This is the websocket
