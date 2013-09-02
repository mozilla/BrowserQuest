
define(['entity'], function(Entity) {

    var Chest = Entity.extend({
        init: function(id, kind) {
            this._super(id, Types.Entities.CHEST);
        },

        getSpriteName: function() {
            return "chest";
        },

        isMoving: function() {
            return false;
        },

        open: function() {
            if(this.open_callback) {
                this.open_callback();
            }
        },

        onOpen: function(callback) {
            this.open_callback = callback;
        }
    });

    return Chest;
});
