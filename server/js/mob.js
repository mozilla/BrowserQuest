
var cls = require("./lib/class"),
    _ = require("underscore"),
    Messages = require("./message"),
    Properties = require("./properties"),
    Types = require("../../shared/js/gametypes");

module.exports = Mob = Character.extend({
    init: function(id, kind, x, y) {
        this._super(id, "mob", kind, x, y);
        
        this.updateHitPoints();
        this.spawningX = x;
        this.spawningY = y;
        this.armorLevel = Properties.getArmorLevel(this.kind);
        this.weaponLevel = Properties.getWeaponLevel(this.kind);
        this.hatelist = [];
        this.respawnTimeout = null;
        this.returnTimeout = null;
        this.isDead = false;
    },
    
    destroy: function() {
        this.isDead = true;
        this.hatelist = [];
        this.clearTarget();
        this.updateHitPoints();
        this.resetPosition();
        
        this.handleRespawn();
    },
    
    receiveDamage: function(points, playerId) {
        this.hitPoints -= points;
    },
    
    hates: function(playerId) {
        return _.any(this.hatelist, function(obj) { 
            return obj.id === playerId; 
        });
    },
    
    increaseHateFor: function(playerId, points) {
        if(this.hates(playerId)) {
            _.detect(this.hatelist, function(obj) {
                return obj.id === playerId;
            }).hate += points;
        }
        else {
            this.hatelist.push({ id: playerId, hate: points });
        }

        /*
        log.debug("Hatelist : "+this.id);
        _.each(this.hatelist, function(obj) {
            log.debug(obj.id + " -> " + obj.hate);
        });*/
        
        if(this.returnTimeout) {
            // Prevent the mob from returning to its spawning position
            // since it has aggroed a new player
            clearTimeout(this.returnTimeout);
            this.returnTimeout = null;
        }
    },
    
    getHatedPlayerId: function(hateRank) {
        var i, playerId,
            sorted = _.sortBy(this.hatelist, function(obj) { return obj.hate; }),
            size = _.size(this.hatelist);
        
        if(hateRank && hateRank <= size) {
            i = size - hateRank;
        }
        else {
            i = size - 1;
        }
        if(sorted && sorted[i]) {
            playerId = sorted[i].id;
        }
        
        return playerId;
    },
    
    forgetPlayer: function(playerId, duration) {
        this.hatelist = _.reject(this.hatelist, function(obj) { return obj.id === playerId; });
        
        if(this.hatelist.length === 0) {
            this.returnToSpawningPosition(duration);
        }
    },
    
    forgetEveryone: function() {
        this.hatelist = [];
        this.returnToSpawningPosition(1);
    },
    
    drop: function(item) {
        if(item) {
            return new Messages.Drop(this, item);
        }
    },
    
    handleRespawn: function() {
        var delay = 30000,
            self = this;
        
        if(this.area && this.area instanceof MobArea) {
            // Respawn inside the area if part of a MobArea
            this.area.respawnMob(this, delay);
        }
        else {
            if(this.area && this.area instanceof ChestArea) {
                this.area.removeFromArea(this);
            }
            
            setTimeout(function() {
                if(self.respawn_callback) {
                    self.respawn_callback();
                }
            }, delay);
        }
    },
    
    onRespawn: function(callback) {
        this.respawn_callback = callback;
    },
    
    resetPosition: function() {
        this.setPosition(this.spawningX, this.spawningY);
    },
    
    returnToSpawningPosition: function(waitDuration) {
        var self = this,
            delay = waitDuration || 4000;
        
        this.clearTarget();
        
        this.returnTimeout = setTimeout(function() {
            self.resetPosition();
            self.move(self.x, self.y);
        }, delay);
    },
    
    onMove: function(callback) {
        this.move_callback = callback;
    },
    
    move: function(x, y) {
        this.setPosition(x, y);
        if(this.move_callback) {
            this.move_callback(this);
        }
    },
    
    updateHitPoints: function() {
        this.resetHitPoints(Properties.getHitPoints(this.kind));
    },
    
    distanceToSpawningPoint: function(x, y) {
        return Utils.distanceTo(x, y, this.spawningX, this.spawningY);
    }
});
