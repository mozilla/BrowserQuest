
var _ = require('underscore'),
    Types = require("../../shared/js/gametypes");

(function() {
    FormatChecker = Class.extend({
        init: function() {
            this.formats = [];
            this.formats[Types.Messages.HELLO] = ['s', 'n', 'n'],
            this.formats[Types.Messages.MOVE] = ['n', 'n'],
            this.formats[Types.Messages.LOOTMOVE] = ['n', 'n', 'n'],
            this.formats[Types.Messages.AGGRO] = ['n'],
            this.formats[Types.Messages.ATTACK] = ['n'],
            this.formats[Types.Messages.HIT] = ['n'],
            this.formats[Types.Messages.HURT] = ['n'],
            this.formats[Types.Messages.CHAT] = ['s'],
            this.formats[Types.Messages.LOOT] = ['n'],
            this.formats[Types.Messages.TELEPORT] = ['n', 'n'],
            this.formats[Types.Messages.ZONE] = [],
            this.formats[Types.Messages.OPEN] = ['n'],
            this.formats[Types.Messages.CHECK] = ['n']
        },
        
        check: function(msg) {
            var message = msg.slice(0),
                type = message[0],
                format = this.formats[type];
            
            message.shift();
            
            if(format) {    
                if(message.length !== format.length) {
                    return false;
                }
                for(var i = 0, n = message.length; i < n; i += 1) {
                    if(format[i] === 'n' && !_.isNumber(message[i])) {
                        return false;
                    }
                    if(format[i] === 's' && !_.isString(message[i])) {
                        return false;
                    }
                }
                return true;
            }
            else if(type === Types.Messages.WHO) {
                // WHO messages have a variable amount of params, all of which must be numbers.
                return message.length > 0 && _.all(message, function(param) { return _.isNumber(param) });
            }
            else {
                log.error("Unknown message type: "+type);
                return false;
            }
        }
    });

    var checker = new FormatChecker;
    
    exports.check = checker.check.bind(checker);
})();