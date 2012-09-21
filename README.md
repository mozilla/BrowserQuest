BrowserQuest
============

[BrowserQuest](http://browserquest.mozilla.org/) is a HTML5/JavaScript multiplayer game experiment.

It has two major parts:

* the server side, which runs using node.js
* the client side, which runs in your browser


How to get it going
-------------------

Getting the server up and running is pretty easy. You need to
have the following installed:

* Node.js (**v0.8.8** works, v0.6.x series should work, other versions are unknown - let us know if you test them!)
* gcc-c++
* GNU make
* zlib-devel  <-- this is the Fedora/RHEL package name, others may be slightly different

Clone the git repo:

    $ git clone git://github.com/browserquest/BrowserQuest.git
    $ cd BrowserQuest

Then install the Node.js dependencies by running:

    $ npm install -d

Then start the server by running:

    $ node server/js/main.js

The BrowserQuest server should start up, showing output like
this:

    $ node server/js/main.js
    This server can be customized by creating a configuration file named: ./server/config_local.json
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO Starting BrowserQuest game server...
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world1 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world2 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world3 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world4 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world5 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO Server is listening on port 8000

That means its working.  There should not be any warnings or errors.


Client side
-----------

First, set the "host" value in client/config/config_build.json-dist, then copy it to/client/config/config_build.json:

    $ vi client/config/config_build.json-dist
    $ cp client/config/config_build.json-dist client/config/config_build.json

The updated host value must be the IP address of the BrowserQuest server.  For example:

    {
        "host": "100.200.300.400",
        "port": 8000
    }

Then do the same thing for client/config/config_local.json-dist, editing the host value, then copying it to client/config/config_local.json:

    $ vi client/config/config_local.json-dist
    $ cp client/config/config_local.json-dist client/config/config_local.json

Next, copy the "shared" directory from the root of the git repo, into the "client" directory:

    $ cp -r shared client/

Now start the client side server up:

    $ node start_dev_client.js
    BrowserQuest client server started on port 8080

No warning messages should be displayed.

Using a browser, connect to port 8080 of the IP address you entered above.  The BrowserQuest start page should appear.

If you have the BrowserQuest server running too, then you should be able to launch and play the game.


Node.js for Fedora 16 and RHEL6/CentOS
--------------------------------------

On Fedora 16 and RHEL 6/CentOS 6, the rpms here are known to work:

  http://justinclift.fedorapeople.org/nodejs/

Note, those rpms are ugly, unofficial builds I did myself.  You are
most welcome to improve on them. :)

Mailing List
------------

The mailing list for development is at browserquest@librelist.com. ([archives](http://librelist.com/browser/browserquest/))

To subscribe, just send an email to that address.  Your initial email will be dropped, but will start the subscription.

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
* Korvin Szanto [@KorvinSzanto](https://github.com/KorvinSzanto)
* Tom McKay [@thomasmckay](https://github.com/thomasmckay)
* Justin Clift [@justinclift](https://github.com/justinclift)
