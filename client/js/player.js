
define(['character', 'exceptions'], function(Character, Exceptions) {

    var Player = Character.extend({
        MAX_LEVEL: 10,

        init: function(id, name, pw, kind, guild) {
            this._super(id, kind);

            this.name = name;
            this.pw = pw;
            
            if (typeof guild !== 'undefined') {
				this.setGuild(guild);
			}

            // Renderer
             this.nameOffsetY = -10;

            // sprites
            this.spriteName = "clotharmor";
            this.armorName = "clotharmor";
            this.weaponName = "sword1";

            // modes
            this.isLootMoving = false;
            this.isSwitchingWeapon = true;

            // PVP Flag
            this.pvpFlag = true;
        },

        getGuild: function() {
			return this.guild;
		},
		
		setGuild: function(guild) {
			this.guild = guild;
			$('#guild-population').addClass("visible");
			$('#guild-name').html(guild.name);
		},
		
		unsetGuild: function(){
			delete this.guild;
			$('#guild-population').removeClass("visible");
		},
		
        hasGuild: function(){
			return (typeof this.guild !== 'undefined');
		},
		
			
		addInvite: function(inviteGuildId){
			this.invite = {time:new Date().valueOf(), guildId: inviteGuildId};
		},
		
		deleteInvite: function(){
			delete this.invite;
		},
		
		checkInvite: function(){
			if(this.invite && ( (new Date().valueOf() - this.invite.time) < 595000)){
				return this.invite.guildId;
			}
			else{
				if(this.invite){
					this.deleteInvite();
					return -1;
				}
				else{
					return false;
				}
			}
		},

        loot: function(item) {
            if(item) {
                var rank, currentRank, msg, currentArmorName;

                if(this.currentArmorSprite) {
                    currentArmorName = this.currentArmorSprite.name;
                } else {
                    currentArmorName = this.spriteName;
                }

                if(item.type === "armor") {
                    rank = Types.getArmorRank(item.kind);
                    currentRank = Types.getArmorRank(Types.getKindFromString(currentArmorName));
                    msg = "You are wearing a better armor";
                } else if(item.type === "weapon") {
                    rank = Types.getWeaponRank(item.kind);
                    currentRank = Types.getWeaponRank(Types.getKindFromString(this.weaponName));
                    msg = "You are wielding a better weapon";
                }

                if(rank && currentRank) {
                    if(rank === currentRank) {
                        throw new Exceptions.LootException("You already have this "+item.type);
                    } else if(rank <= currentRank) {
                        throw new Exceptions.LootException(msg);
                    }
                }

                log.info('Player '+this.id+' has looted '+item.id);
                if(Types.isArmor(item.kind) && this.invincible) {
                    this.stopInvincibility();
                }
                item.onLoot(this);
            }
        },

        /**
         * Returns true if the character is currently walking towards an item in order to loot it.
         */
        isMovingToLoot: function() {
            return this.isLootMoving;
        },

        getSpriteName: function() {
            return this.spriteName;
        },

        setSpriteName: function(name) {
            this.spriteName = name;
        },

        getArmorName: function() {
            var sprite = this.getArmorSprite();
            return sprite.id;
        },

        getArmorSprite: function() {
            if(this.invincible) {
                return this.currentArmorSprite;
            } else {
                return this.sprite;
            }
        },
        setArmorName: function(name){
            this.armorName = name;
        },

        getWeaponName: function() {
            return this.weaponName;
        },
        
        setWeaponName: function(name) {
            this.weaponName = name;
        },

        hasWeapon: function() {
            return this.weaponName !== null;
        },
        equipFromInventory: function(type, inventoryNumber, sprites){
            var itemString = Types.getKindAsString(this.inventory[inventoryNumber]);

            if(itemString){
                var itemSprite = sprites[itemString];
                if(itemSprite){
                    if(type === "armor"){
                        this.inventory[inventoryNumber] = Types.getKindFromString(this.getArmorName());
                        this.setSpriteName(itemString);
                        this.setSprite(itemSprite);
                        this.setArmorName(itemString);
                    } else if(type === "avatar"){
                        this.inventory[inventoryNumber] = null;
                        this.setSpriteName(itemString);
                        this.setSprite(itemSprite);
                    }
                }
            }
        },
        switchArmor: function(armorName, sprite){
            this.setSpriteName(armorName);
            this.setSprite(sprite);
            this.setArmorName(armorName);
            if(this.switch_callback) {
              this.switch_callback();
            }
        },
        switchWeapon: function(newWeaponName) {
            var count = 14,
                value = false,
                self = this;

            var toggle = function() {
                value = !value;
                return value;
            };

            if(newWeaponName !== this.getWeaponName()) {
                if(this.isSwitchingWeapon) {
                    clearInterval(blanking);
                }

                this.switchingWeapon = true;
                var blanking = setInterval(function() {
                    if(toggle()) {
                        self.setWeaponName(newWeaponName);
                    } else {
                        self.setWeaponName(null);
                    }

                    count -= 1;
                    if(count === 1) {
                        clearInterval(blanking);
                        self.switchingWeapon = false;

                        if(self.switch_callback) {
                            self.switch_callback();
                        }
                    }
                }, 90);
            }
        },

        switchArmor: function(newArmorSprite) {
            var count = 14,
                value = false,
                self = this;

            var toggle = function() {
                value = !value;
                return value;
            };

            if(newArmorSprite && newArmorSprite.id !== this.getSpriteName()) {
                if(this.isSwitchingArmor) {
                    clearInterval(blanking);
                }

                this.isSwitchingArmor = true;
                self.setSprite(newArmorSprite);
                self.setSpriteName(newArmorSprite.id);
                var blanking = setInterval(function() {
                    self.setVisible(toggle());

                    count -= 1;
                    if(count === 1) {
                        clearInterval(blanking);
                        self.isSwitchingArmor = false;

                        if(self.switch_callback) {
                            self.switch_callback();
                        }
                    }
                }, 90);
            }
        },

        onArmorLoot: function(callback) {
            this.armorloot_callback = callback;
        },

        onSwitchItem: function(callback) {
            this.switch_callback = callback;
        },

        onInvincible: function(callback) {
            this.invincible_callback = callback;
        },
        
        startInvincibility: function() {
            var self = this;

            if(!this.invincible) {
                this.currentArmorSprite = this.getSprite();
                this.invincible = true;
                this.invincible_callback();
            } else {
                // If the player already has invincibility, just reset its duration.
                if(this.invincibleTimeout) {
                    clearTimeout(this.invincibleTimeout);
                }
            }

            this.invincibleTimeout = setTimeout(function() {
                self.stopInvincibility();
                self.idle();
            }, 15000);
        },

        stopInvincibility: function() {
            this.invincible_callback();
            this.invincible = false;

            if(this.currentArmorSprite) {
                this.setSprite(this.currentArmorSprite);
                this.setSpriteName(this.currentArmorSprite.id);
                this.currentArmorSprite = null;
            }
            if(this.invincibleTimeout) {
                clearTimeout(this.invincibleTimeout);
            }
         },
        flagPVP: function(pvpFlag){
            this.pvpFlag = pvpFlag;
       }
    });

    return Player;
});
