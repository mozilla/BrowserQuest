var _ = require('underscore');
var cls = require('./lib/class');
var Types = require('../../shared/js/gametypes');

var Messages = {};
module.exports = Messages;

var Message = cls.Class.extend({
});

Messages.Spawn = Message.extend({
    init: function (entity) {
        this.entity = entity;
    },
    serialize: function () {
        var spawn = [Types.Messages.SPAWN];
        return spawn.concat(this.entity.getState());
    }
});

Messages.Despawn = Message.extend({
    init: function (entityId) {
        this.entityId = entityId;
    },
    serialize: function () {
        return [Types.Messages.DESPAWN, this.entityId];
    }
});

Messages.Move = Message.extend({
    init: function (entity) {
        this.entity = entity;
    },
    serialize: function () {
        return [Types.Messages.MOVE,
                this.entity.id,
                this.entity.x,
                this.entity.y];
    }
});

Messages.LootMove = Message.extend({
    init: function (entity, item) {
        this.entity = entity;
        this.item = item;
    },
    serialize: function() {
        return [Types.Messages.LOOTMOVE,
                this.entity.id,
                this.item.id];
    }
});

Messages.Attack = Message.extend({
    init: function (attackerId, targetId) {
        this.attackerId = attackerId;
        this.targetId = targetId;
    },
    serialize: function () {
        return [Types.Messages.ATTACK,
                this.attackerId,
                this.targetId];
    }
});

Messages.Health = Message.extend({
    init: function (points, isRegen) {
        this.points = points;
        this.isRegen = isRegen;
    },
    serialize: function() {
        var health = [Types.Messages.HEALTH,
                      this.points];

        if (this.isRegen) {
            health.push(1);
        }
        return health;
    }
});

Messages.HitPoints = Message.extend({
    init: function (maxHitPoints) {
        this.maxHitPoints = maxHitPoints;
    },
    serialize: function () {
        return [Types.Messages.HP,
                this.maxHitPoints];
    }
});

Messages.EquipItem = Message.extend({
    init: function (player, itemKind) {
        this.playerId = player.id;
        this.itemKind = itemKind;
    },
    serialize: function () {
        return [Types.Messages.EQUIP,
                this.playerId,
                this.itemKind];
    }
});

Messages.Drop = Message.extend({
    init: function (mob, item) {
        this.mob = mob;
        this.item = item;
    },
    serialize: function() {
        var drop = [Types.Messages.DROP,
                    this.mob.id,
                    this.item.id,
                    this.item.kind,
                    _.pluck(this.mob.hatelist, 'id')];

        return drop;
    }
});

Messages.Chat = Message.extend({
    init: function (player, message) {
        this.playerId = player.id;
        this.message = message;
    },
    serialize: function () {
        return [Types.Messages.CHAT,
                this.playerId,
                this.message];
    }
});

Messages.Teleport = Message.extend({
    init: function (entity) {
        this.entity = entity;
    },
    serialize: function () {
        return [Types.Messages.TELEPORT,
                this.entity.id,
                this.entity.x,
                this.entity.y];
    }
});

Messages.Damage = Message.extend({
    init: function (entity, points, hp, maxHp) {
        this.entity = entity;
        this.points = points;
        this.hp = hp;
        this.maxHitPoints = maxHp;
    },
    serialize: function () {
        return [Types.Messages.DAMAGE,
                this.entity.id,
                this.points,
                this.hp,
                this.maxHitPoints];
    }
});

Messages.Population = Message.extend({
    init: function (world, total) {
        this.world = world;
        this.total = total;
    },
    serialize: function () {
        return [Types.Messages.POPULATION,
                this.world,
                this.total];
    }
});

Messages.Kill = Message.extend({
    init: function (mob, level, exp) {
        this.mob = mob;
        this.level = level;
        this.exp = exp;
    },
    serialize: function () {
        return [Types.Messages.KILL,
                this.mob.kind,
                this.level,
                this.exp];
    }
});

Messages.List = Message.extend({
    init: function (ids) {
        this.ids = ids;
    },
    serialize: function () {
        var list = this.ids;

        list.unshift(Types.Messages.LIST);
        return list;
    }
});

Messages.Destroy = Message.extend({
    init: function (entity) {
        this.entity = entity;
    },
    serialize: function () {
        return [Types.Messages.DESTROY,
                this.entity.id];
    }
});

Messages.Blink = Message.extend({
    init: function (item) {
        this.item = item;
    },
    serialize: function () {
        return [Types.Messages.BLINK,
                this.item.id];
    }
});

Messages.GuildError = Message.extend({
	init: function (errorType, guildName) {
		this.guildName = guildName;
		this.errorType = errorType;
	},
	serialize: function () {
		return [Types.Messages.GUILDERROR, this.errorType, this.guildName];
	}
});

Messages.Guild = Message.extend({
	init: function (action, info) {
		this.action = action;
		this.info = info;
	},
	serialize: function () {
		return [Types.Messages.GUILD, this.action].concat(this.info);
	}
});

Messages.PVP = Message.extend({
    init: function(isPVP){
        this.isPVP = isPVP;
    },
    serialize: function(){
        return [Types.Messages.PVP,
                this.isPVP];
    }
});

