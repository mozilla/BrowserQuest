animation.js
Animation engine

app.js
Contains functions for the game client (gui), such as initializing exp
bar or targethud

area.js
Area information (decides that game should do X or Y in area Z)

audio.js
How the game handles audio

bubble.js
How speech bubbles are handled

build.js
Describes how a build of the client should work (set output directory,
for example)

camera.js
What should the camera be focused on?

character.js
Functions for the character, such as knowing if character is dead , if
its in combat or walking

chest.js
Functions of how a chest is handled (that it's possible to open it)

config.js
Reads if there is a ../config/config_build.json o config_local.json to
get server info

detect.js
Detect is user is using Safari, Chrome, Firefox, Android or Opera

entity.js
Handles NPCs (town folk and enemies)

entityfactory.js
The NPCs and other items which are in game

entrypoint.js
Code to stop people from cheating by giving themself a firefox suit

exceptions.js
Sends exception if a user for example already have an item thats
attempted to be picked up

game.js
loads character information and contains game logic of for example what
happens when attacking a creature

gameclient.js
How the client connects to server, gets info regarding drops,
population, chat messages etc

guild.js
Functions for the guilds

home.js
>>to add info about<<

infomanager.js
Get info about what you're attacking

item.js
Switch to the new weapon and armor you have picked up

items.js
Describes what happens when you pick up weapons (messages)

lib/
libraries used

main.js
Control what happens when you press keys

map.js
Load the map and the tilesheets that are used for it

mapworker.js
Generate things such as collisiongrid and plateaugrid

mob.js
init basic mob function

mobs.js
mob information (aggro range, speed, attackrate etc)

npc.js
What each NPC says and how he says it

npcs.js
init the different NPCs

pathfinder.js
How to find the best path from X to Y

player.js
Get information about player (if he's in a guild, what rank item he is
wearing, if he is moving towards loot etc

renderer.js
Rendering engine - can tun on debug mode for FPS etc.

sprite.js
Sprite functions - generate dynamic damage sprites for example.

sprites.js
The different sprites in-game

storage.js
--TO BE DELETED-- local storage engine

text.js
>>to add info about<<

tile.js
Functions to animate tiles

timer.js
Function to create a timer to see if X was done in time

transition.js
>>to add info about<<

updater.js
Functions to update movement, aggro, zoning etc

util.js
Sets Smart Animating 
http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
and URL Parameters
http://snipplr.com/view/19838/get-url-parameters/

warrior.js
Creates the warrior entity
