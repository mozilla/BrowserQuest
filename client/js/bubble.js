
define(['jquery', 'timer'], function($, Timer) {

    var Bubble = Class.extend({
        init: function(id, element, time) {
            this.id = id;
            this.element = element;
            this.timer = new Timer(5000, time);
        },
    
        isOver: function(time) {
            if(this.timer.isOver(time)) {
                return true;
            }
            return false;
        },
    
        destroy: function() {
            $(this.element).remove();
        },
    
        reset: function(time) {
            this.timer.lastTime = time;
        }
    });

    var BubbleManager = Class.extend({
        init: function(container) {
            this.container = container;
            this.bubbles = {};
        },
    
        getBubbleById: function(id) {
            if(id in this.bubbles) {
                return this.bubbles[id];
            }
            return null;
        },
    
        create: function(id, message, time) {
            if(this.bubbles[id]) {
                this.bubbles[id].reset(time);
                $("#"+id+" p").html(message);
            }
            else {
                var el = $("<div id=\""+id+"\" class=\"bubble\"><p>"+message+"</p><div class=\"thingy\"></div></div>"); //.attr('id', id);
                $(el).appendTo(this.container);
            
                this.bubbles[id] = new Bubble(id, el, time);
            }
        },
    
        update: function(time) {
            var self = this,
                bubblesToDelete = [];
        
            _.each(this.bubbles, function(bubble) {
                if(bubble.isOver(time)) {
                    bubble.destroy();
                    bubblesToDelete.push(bubble.id);
                }
            });
        
            _.each(bubblesToDelete, function(id) {
                delete self.bubbles[id];
            });
        },
    
        clean: function() {
            var self = this,
                bubblesToDelete = [];
        
            _.each(this.bubbles, function(bubble) {
                bubble.destroy();
                bubblesToDelete.push(bubble.id);
            });
        
            _.each(bubblesToDelete, function(id) {
                delete self.bubbles[id];
            });
        
            this.bubbles = {};
        },
    
        destroyBubble: function(id) {
            var bubble = this.getBubbleById(id);
        
            if(bubble) {
                bubble.destroy();
                delete this.bubbles[id];
            }
        },
        
        forEachBubble: function(callback) {
            _.each(this.bubbles, function(bubble) {
                callback(bubble);
            });
        }
    });
    
    return BubbleManager;
});
