#!/bin/bash

# Script to generate an optimized client build of BrowserQuest

BUILDDIR="../client-build"
PROJECTDIR="../client/js"
CURDIR=$(pwd)


echo "Deleting previous build directory"
rm -rf $BUILDDIR

echo "Building client with RequireJS"
cd $PROJECTDIR
node ../../bin/r.js -o build.js
cd $CURDIR

echo "Removing unnecessary js files from the build directory"
find $BUILDDIR/js -type f \( -iname "game.js" -or -iname "home.js" -or -iname "log.js" -or -iname "require-jquery.js" -or -iname "modernizr.js" -or -iname "css3-mediaqueries.js" -or -iname "mapworker.js" -or -iname "detect.js" -or -iname "underscore.min.js" -or -iname "text.js" -or - \) -delete

echo "Removing sprites directory"
rm -rf $BUILDDIR/sprites

echo "Removing config directory"
rm -rf $BUILDDIR/config

echo "Moving build.txt to current dir"
mv $BUILDDIR/build.txt $CURDIR

echo "Build complete"