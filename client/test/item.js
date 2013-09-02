load_boilerplate = require('../../shared/js/boilerplate.js');
eval(load_boilerplate());

describe('Item', function() {
    var Item;
    var self = this;

    beforeEach(function(done) {
        requirejs(['item'], function(_Module) {
            Item = _Module;
            self.item = new Item(1, 'testKind', 'type');
            done();
        });

    });

    before(function() {
        var stub = sinon.stub(Types, "getKindAsString");
        stub.withArgs('testKind').returns('testKind');
    });

    describe('.init', function() {
       it('sets itemKind to the passed kind', function() {
           self.item.itemKind.should.equal('testKind');
       });

       it('sets type to the passed type', function() {
           self.item.type.should.equal('type');
       });

       it('sets wasDropped to false', function() {
           self.item.wasDropped.should.equal.false;
       });

    });

    describe('#hasShadow', function() {
        it('should return true', function() {
            self.item.hasShadow().should.be.true;
        });
    });

    describe('#onLoot', function() {
        var player;
        var spy;

        beforeEach(function() {
            player = sinon.stub();
            spy = sinon.spy();
        });

        it('calls switchWeapon on passed player if type equals weapon', function() {
            player.switchWeapon = spy;
            self.item.type = 'weapon';

            self.item.onLoot(player)
            spy.calledWith('testKind').should.be.true;
        });

        it('calls armorloot_callback on passed player if type equals armor', function() {
            player.armorloot_callback = spy;
            self.item.type = 'armor';

            self.item.onLoot(player)
            spy.calledWith('testKind').should.be.true;
        });
    });

    describe('#getSpriteName', function() {
        it("should return 'item-' plus itemKind", function() {
            self.item.getSpriteName().should.equal('item-testKind');
        });
    });

    describe('#getLootMessage', function() {
        it("should return lootMessage", function() {
            self.item.lootMessage = 'Loot message';
            self.item.getLootMessage().should.equal('Loot message');
        });
    });
});
