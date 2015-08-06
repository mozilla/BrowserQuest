BrowserQuest [updated & with Socket.IO]
============

![alt tag](https://raw.github.com/nenuadrian/BrowserQuest/master/screens/1.png)

Changes
============
  * Updated backend and frontend to use Socket.IO server and Client
  * Main changes were made to ws.js and gameclient.js.
  * Updated dependencies such as requirejs and jQuery to their latest versions
  * Fixed build script
  * Created a mini-dispatcher on the server side that provides the IP and Port in the configs as the ones for the game server.
  * Added a demo to http://browserquest.codevolution.com
  * A few minor edits to server side handling

TODO
============
  * Quest system and more awesome features
 




This is my take on Mozilla's amazing multiplayer open source game.

I've yet to find any other game that's so well done from graphics, implementation and features point of view (did I mention open source, multiplayer and browser based?).

![alt tag](https://raw.github.com/nenuadrian/BrowserQuest/master/screens/2.png)

I've wanted to use the game for a while and found many of its dependencies to be deprecated and even obsolete.

I've just taken the time to understand the code and thank you guys for making it so well structured.

![alt tag](https://raw.github.com/nenuadrian/BrowserQuest/master/screens/3.png)

This now works on the latest Socket.IO. Everything should work just as in the original developers intended.

Enjoy this amazing open source browser based role playing multiplayer 2D game!

And a big thank you to the original developers is in order! THANK YOU!

HOW TO RUN?
============
Run from a console:

Make sure you have NodeJS installed.

npm install

node server/js/main.js

Then go inside the Client folder and open index.html.

You might want to use a webserver and open index.html from there.

Also read the original README files you'll find inside the Client and Server folders to learn the basics of configuring (it's preconfigured right now).


Original README
============
BrowserQuest is a HTML5/JavaScript multiplayer game experiment.


Documentation
-------------

Documentation is located in client and server directories.


License
-------

Code is licensed under MPL 2.0. Content is licensed under CC-BY-SA 3.0.
See the LICENSE file for details.


Credits
-------
Created by [Little Workshop](http://www.littleworkshop.fr):

* Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
* Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)
