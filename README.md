BrowserQuest
============

BrowserQuest is a HTML5/JavaScript multiplayer game experiment.

It has two major parts:

* the server side, which runs using node.js
* the client side, which runs in your browser


How to get it going
-------------------

Getting the server up and running is pretty easy. You need to
have the following installed:

* node.js
* gcc-c++
* GNU make
* zlib-devel  <-- this is the Fedora/RHEL package name, others may be slightly different

Clone the git repo:

    $ git clone git://github.com/browserquest/BrowserQuest.git
    $ cd BrowserQuest

Then install the nodejs dependencies by running:

    $ npm install -d bison log memcache sanitizer underscore websocket websocket-server

Then start the server by running:

    $ node server/js/main.js

The BrowserQuest server should start up, showing output like
this:

    $ node server/js/main.js
    Could not open config file: ./server/config_local.json
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO Starting BrowserQuest game server...
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world1 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world2 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world3 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world4 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world5 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO Server is listening on port 8000

That means its working.  Ignore the warning about "Could not open config file".
There should not be any other warnings or errors.


Client side
-----------

Still needs to be written. (also not hard)


Node.js for Fedora 16 and RHEL6/CentOS
--------------------------------------

On Fedora 16 and RHEL 6/CentOS 6, the rpms here are known to work:

  http://justinclift.fedorapeople.org/nodejs/

Note, those rpms are ugly, unofficial builds I did myself.  You are
most welcome to improve on them. :)


License
-------

Code is licensed under MPL 2.0. Content is licensed under CC-BY-SA 3.0.
See the LICENSE file for details.


Credits
-------
Originally created by [Little Workshop](http://www.littleworkshop.fr):

* Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
* Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)

Many other people are contributing through GitHub:

* Myles Recny [@mkrecny](https://github.com/mkrecny)
* Ben Noordhuis [@bnoordhuis](https://github.com/bnoordhuis)
* Taylor Fausak [@tfausak](https://github.com/tfausak)
* William Bowers [@willurd](https://github.com/willurd)
* Steve Gricci [@sgricci](https://github.com/sgricci)
* Dave Eddy [@bahamas10](https://github.com/bahamas10)
* Mathias Bynens [@mathiasbynens](https://github.com/mathiasbynens)
* Rob McCann [@unforeseen](https://github.com/unforeseen)
* Scott Noel-Hemming [@frogstarr78](https://github.com/frogstarr78)
* Kornel Lesiński [@pornel](https://github.com/pornel)
* Tom McKay [@thomasmckay](https://github.com/thomasmckay)
* Justin Clift [@justinclift](https://github.com/justinclift)