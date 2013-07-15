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

describe('Chest', function() {
    var Chest;
    var self = this;

    beforeEach(function(done) {

        requirejs(['chest'], function(_Module) {
            Chest = _Module;
            self.chest = new Chest(1);
            done();
        });
    });


    describe('#getSpriteName', function() {
        it('should return "chest"', function() {
            self.chest.getSpriteName().should.equal("chest");
        });
    });

    describe('#isMoving', function() {
        it('should return false', function() {
            self.chest.isMoving().should.be.false
        });
    });

    describe('#onOpen', function() {
        it('sets open_callback to the passed function', function() {
            var func = function() {};
            self.chest.onOpen(func);
            self.chest.open_callback.toString().should.equal(func.toString());
        });
    });

    describe('#open', function() {
        it('calls open_callback if set', function() {
            var spy = sinon.spy();
            self.chest.onOpen(spy);
            self.chest.open();
            spy.called.should.equal.true;
        });

        it('does not call open_callback if not set', function() {
            var spy = sinon.spy(self.chest.open_callback);
            self.chest.open();
            spy.called.should.equal.false;
        });
    });
});
