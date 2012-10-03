/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false, undef:true,
    unused:true, curly:true, browser:true, node:true, maxerr:50, camelcase: true, quotmark: single,
    trailing: true*/

var Utils = require('./utils');

var Formulas = {};

Formulas.dmg = function (weaponLevel, armorLevel) {
    var dealt = weaponLevel * Utils.randomInt(5, 10);
    var absorbed = armorLevel * Utils.randomInt(1, 3);
    var dmg =  dealt - absorbed;

    //console.log("abs: "+absorbed+"   dealt: "+ dealt+"   dmg: "+ (dealt - absorbed));
    if (dmg <= 0) {
        return Utils.randomInt(0, 3);
    } else {
        return dmg;
    }
};

Formulas.hp = function (armorLevel) {
    var hp = 80 + ((armorLevel - 1) * 30);
    return hp;
};

if (typeof exports !== 'undefined') {
    module.exports = Formulas;
}
