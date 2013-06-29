var cls = require('./lib/class');
var ProductionConfig = {};

ProductionConfig = cls.Class.extend({

    init: function(config) {

        this.config = config;
        try {
            this.production = require('../production_hosts/' + config.production + '.js');
        }
        catch(err) {
            this.production = null;
        }

    },

    inProduction: function() {
        if(this.production !== null) {
            return this.production.isActive();
        }
        return false;
    },

    getProductionSettings : function() {
        if(this.inProduction()) {
            return this.production;
        }
    }
});

module.exports = ProductionConfig;
