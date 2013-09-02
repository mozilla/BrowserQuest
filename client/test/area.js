load_boilerplate = require('../../shared/js/boilerplate.js');
eval(load_boilerplate());

describe('Area', function() {
    var Area;
    var self = this;

    beforeEach(function(done) {

        requirejs(['area'], function(_Module) {
            Area = _Module;
            self.x = 0;
            self.y = 0;
            self.width = 10;
            self.height = 10;
            self.area = new Area(self.x, self.y, self.width, self.height);
            done();
        });
    });

    describe('.init', function() {
        it('sets x to be the passed value', function() {
            self.area.x.should.equal(self.x);
        });
        it('sets y to be the passed value', function() {
            self.area.y.should.equal(self.y);
        });
        it('sets width to be the passed value', function() {
            self.area.width.should.equal(self.width);
        });
        it('sets height to be the passed value', function() {
            self.area.height.should.equal(self.height);
        });
    });

    describe('#contains', function() {
        it('returns true if the given entity is within the given coordinates', function() {
            var entity = {'gridX': 2, 'gridY': 2};
            self.area.contains(entity).should.be.true;
        });
        it('returns false if the given entity is not within the given coordinates', function() {
            var entity = {'gridX': 20, 'gridY': 20};
            self.area.contains(entity).should.be.false;
        });
    });
});


