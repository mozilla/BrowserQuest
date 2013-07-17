load_boilerplate = require('../../shared/js/boilerplate.js');
eval(load_boilerplate());

describe('LootException', function() {
    var Exceptions;
    var self = this;

    beforeEach(function(done) {

        requirejs(['exceptions'], function(_Module) {
            Exceptions = _Module;
            self.message = "Loot Exception";
            self.loot_exception = new Exceptions.LootException(self.message);
            done();
        });
    });

    describe('#init', function() {
        it('sets message to be the passed value', function() {
            self.loot_exception.message.should.equal(self.message);
        });
    });
});
