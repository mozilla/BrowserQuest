
define(['npc'], function(Npc) {

    var NPCs = {

        Guard: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.GUARD, 1);
            }
        }),

        King: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.KING, 1);
            }
        }),

        Agent: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.AGENT, 1);
            }
        }),

        Rick: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.RICK, 1);
            }
        }),

        VillageGirl: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VILLAGEGIRL, 1);
            }
        }),

        Villager: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VILLAGER, 1);
            }
        }),
        
        Coder: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.CODER, 1);
            }
        }),

        Scientist: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SCIENTIST, 1);
            }
        }),

        Nyan: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.NYAN, 1);
                this.idleSpeed = 50;
            }
        }),
        
        Sorcerer: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SORCERER, 1);
                this.idleSpeed = 150;
            }
        }),

        Priest: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.PRIEST, 1);
            }
        }),
        
        BeachNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEACHNPC, 1);
            }
        }),
        
        ForestNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FORESTNPC, 1);
            }
        }),

        DesertNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.DESERTNPC, 1);
            }
        }),

        LavaNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.LAVANPC, 1);
            }
        }),

        Octocat: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.OCTOCAT, 1);
            }
        })
    };
    
    return NPCs;
});
