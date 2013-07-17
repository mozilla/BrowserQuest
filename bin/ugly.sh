UGLIFYJS="./node_modules/uglify-js/bin/uglifyjs"
TOPLEVELDIR="`dirname $0`/.."
BUILDDIR="$TOPLEVELDIR/client-build"

rm -r $BUILDDIR
cp -r client client-build
find client-build/js -name "*.js" -exec $UGLIFYJS {} --screw-ie8 -o {} \;
