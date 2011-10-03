
var cls = require('class'),
    log = require('log'),
    _ = require('underscore'),
    BISON = require('bison'),
    Types = require("gametypes").Types;

module.exports = GameClient = cls.Class.extend({
    init: function(connection, config) {
        this.connection = connection;
        this.config = config;
    },

    sendMessage: function(json) {
        var data;
        
        if(this.config.useBison) {
            data = BISON.encode(json);
        }
        else {
            data = JSON.stringify(json);
        }
        this.connection.sendUTF(data);
    },

    sendHello: function(name) {
        this.sendMessage([Types.Messages.HELLO,
                          name,
                          Types.Entities.CLOTHARMOR,
                          Types.Entities.SWORD2]);
    },

    sendMove: function(x, y) {
        this.sendMessage([Types.Messages.MOVE,
                          x,
                          y]);
    },
    
    sendLootMove: function(item, x, y) {
        this.sendMessage([Types.Messages.LOOTMOVE,
                          x,
                          y,
                          item.id]);
    },
    
    sendAggro: function(mob) {
        this.sendMessage([Types.Messages.AGGRO,
                          mob.id]);
    },
    
    sendAttack: function(mob) {
        this.sendMessage([Types.Messages.ATTACK,
                          mob.id]);
    },
    
    sendHit: function(mob) {
        this.sendMessage([Types.Messages.HIT,
                          mob.id]);
    },
    
    sendHurt: function(mob) {
        this.sendMessage([Types.Messages.HURT,
                          mob.id]);
    },
    
    sendChat: function(text) {
        this.sendMessage([Types.Messages.CHAT,
                          text]);
    },
    
    sendLoot: function(item) {
        this.sendMessage([Types.Messages.LOOT,
                          item.id]);
    },
    
    sendTeleport: function(x, y) {
        this.sendMessage([Types.Messages.TELEPORT,
                          x,
                          y]);
    },
    
    sendWho: function(ids) {
        ids.unshift(Types.Messages.WHO);
        this.sendMessage(ids);
    },
    
    sendZone: function() {
        this.sendMessage([Types.Messages.ZONE]);
    }
});
