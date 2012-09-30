/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true,
    unused:true, curly:true, browser:true, node:true, maxerr:50, globalstrict:true,
    camelcase: true, quotmark: single, trailing: true*/

'use strict';

var Entity = require('./entity');

var Npc = Entity.extend({
    init: function (id, kind, x, y) {
        this._super(id, 'npc', kind, x, y);
    }
});

module.exports = Npc;
