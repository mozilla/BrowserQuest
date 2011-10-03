
define(function() {

    var Transition = Class.extend({
        init: function() {
            this.startValue = 0;
            this.endValue = 0;
            this.duration = 0;
            this.inProgress = false;
        },

        start: function(currentTime, updateFunction, stopFunction, startValue, endValue, duration) {
            this.startTime = currentTime;
            this.updateFunction = updateFunction;
            this.stopFunction = stopFunction;
            this.startValue = startValue;
            this.endValue = endValue;
            this.duration = duration;
            this.inProgress = true;
            this.count = 0;
        },

        step: function(currentTime) {
            if(this.inProgress) {
                if(this.count > 0) {
                    this.count -= 1;
                    log.debug(currentTime + ": jumped frame");
                }
                else {
                    var elapsed = currentTime - this.startTime;
            
                    if(elapsed > this.duration) {
                        elapsed = this.duration;
                    }
        
                    var diff = this.endValue - this.startValue;
                    var i = this.startValue + ((diff / this.duration) * elapsed);
            
                    i = Math.round(i);
            
                    if(elapsed === this.duration || i === this.endValue) {
                        this.stop();
                        if(this.stopFunction) {
                            this.stopFunction();
                        }
                    }
                    else if(this.updateFunction) {
                        this.updateFunction(i);
                    }
                }
            }
        },

        restart: function(currentTime, startValue, endValue) {
            this.start(currentTime, this.updateFunction, this.stopFunction, startValue, endValue, this.duration);
            this.step(currentTime);
        },

        stop: function() {
            this.inProgress = false;
        }
    });
    
    return Transition;
});
