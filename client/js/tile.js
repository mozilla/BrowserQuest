
define(function() {
    
    var Tile = Class.extend({
    });

    var AnimatedTile = Tile.extend({
        init: function(id, length, speed, index) {
            this.startId = id;
        	this.id = id;
        	this.length = length;
        	this.speed = speed;
        	this.index = index;
        	this.lastTime = 0;
        },
    
        tick: function() {
            if((this.id - this.startId) < this.length - 1) {
    	        this.id += 1;
    	    } else {
    	        this.id = this.startId;
    	    }
        },

        animate: function(time) {
            if((time - this.lastTime) > this.speed) {
        	    this.tick();
        	    this.lastTime = time;
        	    return true;
            } else {
                return false;
            }
        }
    });
    
    return AnimatedTile;
});