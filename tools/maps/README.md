BrowserQuest map exporter
=========================

***Disclaimer: due to popular demand we are open sourcing this tool, but please be aware that it was never meant to be publicly released. Therefore the code is messy/non-optimized and the exporting process can be very slow with large map files.***


Editing the map
---------------

Install the Tiled editor: http://www.mapeditor.org/

Open the `tmx/map.tmx` file in Tiled and start editing.

**Note:** there currently is no documentation on how to edit BrowserQuest-specific objects/layers in Tiled. Please refer to `tmx/map.tmx` as an example if you want to create your own map.


Using the exporter
------------------

This tool is to be used from the command line after the TMX file has been saved from the Tiled editor.

Note: This tool was written with OSX in mind. If you are using a different OS (eg. Windows), additional/different steps might be required.

**Prerequisites:**

- You need python and nodejs installed.
- Install pip: http://www.pip-installer.org/en/latest/installing.html
- Install lxml: `pip install lxml` (preferably within a virtualenv)
- Optional: Install Growl + growlnotify if you are on OSX.

**Usage:**

1. `cd tools/maps/`

2. `./export.py client` or `./export.py server`

You must run both commands in order to export the client and server map files. There is no one-step export command for both map types yet.

**Warning:** depending on the `.tmx` filesize, the exporting process can take up to several minutes.


Things to know
--------------

The client map export will create two almost identical files: `world_client.js` and `world_client.json`
These are both required because, depending on the browser, the game will load the map either by using a web worker (loading `world_client.js`), or via Ajax (loading `world_client.json`).

The client map file contains data about terrain tile layers, collision cells, doors, music areas, etc.
The server map file contains data about static entity spawning points, spawning areas, collision cells, etc.

Depending on what you want to change, it's therefore not always needed to export both maps. Also, each `world_server.json` file change requires a server restart.

**How the exporting process works:**

1. The Tiled map TMX file is converted to a temporary JSON file by `tmx2json.py`.
2. This file is be processed by `processmap.js` and returned as an object. This object will have different properties depending on whether we are exporting the client or the server map.
3. The processed map object is saved as the final world map JSON file(s) in the appropriate directories.
4. The temporary file from step 1. is deleted.


**Known bugs:**
 
    * There currently needs to be an empty layer at the bottom of the Tiled layer stack or else the first terrain layer will be missing.
      (ie. if you remove the "don't remove this layer" layer from the `map.tmx` file, the 'sand' tiles will be missing on the beach.)
    

Contributing / Ideas for improvement
------------------------------------

Here are a few ideas for anyone who might want to help make this tool better:

- Remove hard-coded filenames from export.py (eg. `map.tmx`, `world_client.json`) in order to allow easier switching to different map files.

- Fix known bugs (see section above)

- Write documentation on how to use the exporter on Windows.

- Write documentation about map editing in the Tiled editor (ie. editing BrowserQuest-specific properties of doors, chests, spawning areas, etc.)

- Write documentation about the BrowserQuest map JSON format, both for client and server map types.

- Get rid of the `tmx2json.py` step which can currently take up to several minutes. Note: There is a JSON exporter built in Tiled since version 0.8.0 which could be useful. We didn't use it because our tool was written before the 0.8.0 release.

- A complete rewrite of this tool using a custom Tiled plugin would surely be a better approach than the current one. Being able to export directly from Tiled would be much easier to use. Also, the export process is currently too slow.


**Additional resources:**

- Tiled editor wiki: https://github.com/bjorn/tiled/wiki
- TMX map format documentation: https://github.com/bjorn/tiled/wiki/TMX-Map-Format

