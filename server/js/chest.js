/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false, undef:true,
    unused:true, curly:true, browser:true, node:true, indent:4, maxerr:50, camelcase: true,
    quotmark: single, trailing: true*/

var _ = require('underscore');
var Item = require('./item');
var Types = require('../../shared/js/gametypes');
var Utils = require('./utils');

var Chest = Item.extend({
    init: function (id, x, y) {
        this._super(id, Types.Entities.CHEST, x, y);
    },

    setItems: function (items) {
        this.items = items;
    },

    getRandomItem: function () {
        var nbItems = _.size(this.items),
            item = null;

        if (nbItems > 0) {
            item = this.items[Utils.random(nbItems)];
        }
        return item;
    }
});

module.exports = Chest;
