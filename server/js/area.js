
var cls = require('./lib/class'),
    _ = require('underscore'),
    Utils = require('./utils'),
    Types = require("../../shared/js/gametypes");

module.exports = Area = cls.Class.extend({
    init: function(id, x, y, width, height, world) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.world = world;
        this.entities = [];
        this.hasCompletelyRespawned = true;
    },
    
    _getRandomPositionInsideArea: function() {
        var pos = {},
            valid = false;
        
        while(!valid) {
            pos.x = this.x + Utils.random(this.width + 1);
            pos.y = this.y + Utils.random(this.height + 1);
            valid = this.world.isValidPosition(pos.x, pos.y);
        }
        return pos;
    },
    
    removeFromArea: function(entity) {
        var i = _.indexOf(_.pluck(this.entities, 'id'), entity.id);
        this.entities.splice(i, 1);
        
        if(this.isEmpty() && this.hasCompletelyRespawned && this.empty_callback) {
            this.hasCompletelyRespawned = false;
            this.empty_callback();
        }
    },
    
    addToArea: function(entity) {
        if(entity) {
            this.entities.push(entity);
            entity.area = this;
            if(entity instanceof Mob) {
                this.world.addMob(entity);
            }
        }
        
        if(this.isFull()) {
            this.hasCompletelyRespawned = true;
        }
    },
    
    setNumberOfEntities: function(nb) {
        this.nbEntities = nb;
    },
    
    isEmpty: function() {
        return !_.any(this.entities, function(entity) { return !entity.isDead });
    },
    
    isFull: function() {
        return !this.isEmpty() && (this.nbEntities === _.size(this.entities));
    },
    
    onEmpty: function(callback) {
        this.empty_callback = callback;
    }
});
