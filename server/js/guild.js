var cls = require("./lib/class"),
    _ = require("underscore"),
    Messages = require("./message"),
    Utils = require("./utils"),
    check = require("./format").check,
    Types = require("../../shared/js/gametypes");

module.exports = Guild = cls.Class.extend({
    init: function(id, name, server) {
		this.members = {};//playerid:playername
		this.sentInvites = {};//time
        this.id = id;
        this.name = name;
        this.server = server;
        //TODO have a history variable to advise users of what happened while they were offline ? wait for DB…
        //with DB also update structure to make members permanent
    },
    addMember: function(player, reply) {
		if(typeof this.members[player.id] !== "undefined"){
			log.error('Add to guild: player conflict (' + player.id + ' already exists)');
			this.deleteInvite(player.id);
            return false;
        }
        else {
			//When guildRules is created, use here (or in invite)
			var proceed = true;
			if (typeof reply !== "undefined"){
				proceed = this.checkInvite(player) && reply;
				if(reply === false){
					this.server.pushToGuild(this, new Messages.Guild(Types.Messages.GUILDACTION.JOIN, [player.name, false]), player);
					this.deleteInvite(player.id);
					return false;
				}	
			}
			if(proceed){
				this.members[player.id] = player.name;
				player.setGuildId(this.id);
				this.server.pushToGuild(this, new Messages.Guild(Types.Messages.GUILDACTION.POPULATION, [this.name, this.onlineMemberCount()]));
				if (typeof reply !== "undefined"){
					this.server.pushToGuild(this, new Messages.Guild(Types.Messages.GUILDACTION.JOIN, [player.name, player.id,this.id,this.name]));
					this.deleteInvite(player.id);
				}
			}
			return player.id;
		}
	},
	
	invite: function(invitee, invitor){
		if(typeof this.members[invitee.id] !== "undefined"){
			this.server.pushToPlayer(invitor, new Messages.GuildError(Types.Messages.GUILDERRORTYPE.BADINVITE, invitee.name));
		}
		else{
			this.sentInvites[invitee.id]=new Date().valueOf();
			this.server.pushToPlayer(invitee, new Messages.Guild(Types.Messages.GUILDACTION.INVITE, [this.id, this.name, invitor.name]));
		}
	},
	
	deleteInvite: function(inviteeId){
		delete this.sentInvites[inviteeId];
	},
	
	checkInvite: function(invitee){
		var now = new Date().valueOf(), self=this;
		_.each(this.sentInvites, function(time, id){
			if (now - time > 600000){
				var belated = self.server.getEntityById(id);
				self.deleteInvite(id);
				self.server.pushToGuild(self, new Messages.Guild(Types.Messages.GUILDACTION.JOIN, belated.name), belated);
			}});
		return (typeof this.sentInvites[invitee.id] !== "undefined");
	},

	removeMember: function(player) {
		if(typeof this.members[player.id] !== undefined){
			delete this.members[player.id];
			this.server.pushToGuild(this, new Messages.Guild(Types.Messages.GUILDACTION.POPULATION, [this.name, this.onlineMemberCount()]));
			return true;
        }
        else {
			log.error('Remove from guild: player conflict (' + id + ' does not exist)');
			return false;
		}
	},
	
	forEachMember: function(iterator){
		_.each(this.members, iterator);
	},

	memberNames: function(){
		return _.map(this.members, function(name){return name;});
	},
	
	onlineMemberCount: function(){
		return _.size(this.members);
	}
});
