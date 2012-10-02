/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false, undef:true,
    unused:true, curly:true, browser:true, node:true, indent:4, maxerr:50, camelcase: true,
    quotmark: single, trailing: true*/

var Entity = require('./entity');

var Npc = Entity.extend({
    init: function (id, kind, x, y) {
        this._super(id, 'npc', kind, x, y);
    }
});

module.exports = Npc;
