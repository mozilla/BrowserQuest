var requirejs = require('requirejs'),
    should = require('should'),
    sinon = require('sinon');
var globals = new Object();

requirejs.config({nodeRequire: require, baseUrl: 'js/'});

requirejs(['lib/class', '../../shared/js/gametypes'], function(_Class, _Types) {
    globals.Class = _Class;
    globals.Types = _Types;
    global.window = globals
});
