BrowserQuest
============

[![Build Status](https://travis-ci.org/browserquest/BrowserQuest.png)](https://travis-ci.org/browserquest/BrowserQuest) [![Dependency Status](https://gemnasium.com/browserquest/BrowserQuest.png)](https://gemnasium.com/browserquest/BrowserQuest)

[BrowserQuest](http://browserquest-teambq.rhcloud.com:8000) is a HTML5/JavaScript multiplayer game experiment.

It has three major parts:

* the server side, which runs using Node.js
* the client side, which runs using javascript in your browser
* the database side, which runs using Redis

Browser Support
---------------

* Firefox - Works well.
* Chrome - Works well.
* Chromium - Works well.
* Opera 15.x - Works well.
* Opera 12.16 - Background music doesn't play.  Everything else works (Very slow though).
* Safari 6.x - Background music doesn't play.  Everything else works well.
* IE 10.x - Doesn't work.  Other versions untested.

How to get it going
-------------------

Getting the server up and running is pretty easy. You need to have the following installed:

* Node.js ← Versions 0.8.x-0.10.x work.  **Do not use 0.6.x, it [does not work](https://github.com/senchalabs/connect/issues/858).**
* gcc-c++ ← optional.  Not needed on windows.
* GNU make ← optional.  Not needed on windows.
* Memcached ← optional. This is needed to enable metrics.
* zlib-devel ← this is the Fedora/RHEL package name, others may be sightly different.  Not needed on windows.
* Redis server ← this is needed for the game to connect to the backend database.

Clone the git repo:

    $ git clone git://github.com/browserquest/BrowserQuest.git
    $ cd BrowserQuest

Then install the Node.js dependencies by running:

    $ npm install -d

Then start the server by running:

    $ node server/js/main.js

The BrowserQuest server should start, showing output like this:

    $ node server/js/main.js
    This server can be customized by creating a configuration file named: ./server/config_local.json
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO Starting BrowserQuest game server...
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world1 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world2 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world3 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world4 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO world5 created (capacity: 200 players).
    [Thu Sep 13 2012 17:16:27 GMT-0400 (EDT)] INFO Server (everything) is listening on port 8000

That means its working.  There should not be any warnings or errors.

Using a browser, connect to port 8000 of the server entered above.  The
BrowserQuest start page should appear, and the game should work.

Mac OS X
--------

Node.js, Memcached, and Redis installed through Homebrew are known to work:

    $ brew install node redis memcached
    $ ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents
    $ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
    $ git clone git://github.com/browserquest/BrowserQuest.git
    $ cd BrowserQuest
    $ npm install -d
    $ node server/js/main.js

Or you can download the latest Redis source from http://redis.io/download

    $ tar xzf redis-<version>.tar.gz
    $ cd redis-<version>
    $ make

To start Redis now, you can simply run:

    $ src/redis-server

You can try interacting with it by starting another terminal and typing:

    $ redis-<version>/src/redis-cli
    redis> set foo bar
    OK
    redis> get foo
    "bar"

Node.js, Memcached, and Redis for Fedora 16+ and RHEL/CentOS/SL 6.x
-------------------------------------------------------------------

On Fedora 16+ and RHEL/CentOS/SL 6.x, you can install Redis (required) and Memcached (optional) using
yum.

For just RHEL/CentOS/SL 6.x, you need to add the EPEL repo first.  Not needed for Fedora:

    $ sudo rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm

Then install Node.js and everything else needed:

    $ sudo yum install zlib-devel gcc gcc-c++ autoconf automake make redis nodejs npm memcached
    $ sudo chkconfig redis on
    $ sudo chkconfig memcached on

Start Redis and Memcached by running:

    $ sudo service redis start
    $ sudo service memcached start

Now continue on with the normal steps to clone the BrowserQuest git repo, and start up BrowserQuest:

    $ git clone git://github.com/browserquest/BrowserQuest.git
    $ cd BrowserQuest
    $ npm install -d
    $ node server/js/main.js

Windows
-------

Windows 8 is known to work ok with just the base Node v0.8.18
installed, without Visual Studio, nor Python, nor the native
extensions for npm modules installed.

You can download an experimental Win32/64 version of Redis
from here: http://redis.io/download

You can download the latest version of Memcached for Win32/64 from here:
http://blog.elijaa.org/index.php?post/2010/10/15/Memcached-for-Windows&similar

Deploying BrowserQuest
----------------------

Currently, BrowserQuest can run on the following PAAS (Platform as a Service) providers:
* [OpenShift](https://www.openshift.com)

### Instructions for OpenShift ###
1. Follow the instructions to get started with the OpenShift client tools [here](https://www.openshift.com/get-started).

2. Create a new application by running this command:

        $ rhc app create <app-name> nodejs-0.6
        $ cd <app-name>

   where \<app-name\> is the name of your app, e.g. browserquest.

3. Add the Redis cartridge (necessary for BrowserQuest to be able to store data) with the following command:

        $ rhc add-cartridge \
          http://cartreflect-claytondev.rhcloud.com/reflect?github=smarterclayton/openshift-redis-cart \
          --app <app-name>

4. Add the BrowserQuest repository, and pull its contents with the following commands:

        $ git remote add github https://github.com/browserquest/BrowserQuest.git
        $ git fetch github
        $ git reset --hard github/master


5. Now, deploy to OpenShift with one final command (this will take several minutes):

        $ git push -f

Congratulations! You have now deployed BrowserQuest to Openshift! You can see the url of your instance by running


    $ rhc app show <app-name>

Visit the url shown by the above command to see BrowserQuest running. You will need to add ":8000" to the end. Use the url below as a guide:

    http://your_openshift_browserquest_url.rhcloud.com:8000/


Documentation
-------------

Lots of useful info on the [wiki](https://github.com/browserquest/BrowserQuest/wiki).

Mailing List
------------

The new mailing list for development is [here](https://mail.mozilla.org/listinfo/browserquest). ([archives](https://mail.mozilla.org/pipermail/browserquest/))

The old mailing list on librelist.com is no longer used.  Its archives are online [here](http://librelist.com/browser/browserquest/).

IRC Channel
-----------

\#browserquest on irc.synirc.net

License
-------

Code is licensed under MPL 2.0. Content is licensed under CC-BY-SA 3.0.
See the LICENSE file for details.

Credits
-------
Originally created by [Little Workshop](http://www.littleworkshop.fr):

* Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
* Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)

All of the music in BrowserQuest comes from Creative Commons [Attribution 3.0 Unported (CC BY 3.0)](http://creativecommons.org/licenses/by/3.0/) sources.

* [Aaron Krogh](http://soundcloud.com/aaron-anderson-11) - [beach](http://soundcloud.com/aaron-anderson-11/310-world-map-loop)
* [Terrel O'Brien](http://soundcloud.com/gyrowolf) - [boss](http://soundcloud.com/gyrowolf/gyro-scene001-ogg), [cave](http://soundcloud.com/gyrowolf/gyro-dungeon004-ogg), [desert](http://soundcloud.com/gyrowolf/gyro-dungeon003-ogg), [lavaland](http://soundcloud.com/gyrowolf/gyro-scene002-ogg)
* [Dan Tilden](http://www.dantilden.com) - [forest](http://soundcloud.com/freakified/what-dangers-await-campus-map)
* [Joel Day](http://blog.dayjo.org) - [village](http://blog.dayjo.org/?p=335)

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
* Jeff Lang [@jeffplang](https://github.com/jeffplang)
* Tom McKay [@thomasmckay](https://github.com/thomasmckay)
* Justin Clift [@justinclift](https://github.com/justinclift)
* Brynn Bateman [@brynnb](https://github.com/brynnb)
* Dylen Rivera [@dylenbrivera](https://github.com/dylenbrivera)
* Mathieu Loiseau [@lzbk](https://github.com/lzbk)
* Jason Culwell [@Mawgamoth](https://github.com/Mawgamoth)
* Bryan Biedenkapp [@gatekeep](https://github.com/gatekeep)
* Aaron Hill [@Aaron1011](https://github.com/Aaron1011)
* Fredrik Svantes [@speedis](https://github.com/speedis)
* Sergey Krilov [@sergkr](https://github.com/sergkr)
