
Types = {
    Messages: {
        HELLO: 0,
        WELCOME: 1,
        SPAWN: 2,
        DESPAWN: 3,
        MOVE: 4,
        LOOTMOVE: 5,
        AGGRO: 6,
        ATTACK: 7,
        HIT: 8,
        HURT: 9,
        HEALTH: 10,
        CHAT: 11,
        LOOT: 12,
        EQUIP: 13,
        DROP: 14,
        TELEPORT: 15,
        DAMAGE: 16,
        POPULATION: 17,
        KILL: 18,
        LIST: 19,
        WHO: 20,
        ZONE: 21,
        DESTROY: 22,
        HP: 23,
        BLINK: 24,
        OPEN: 25,
        CHECK: 26,
        PVP: 27,
        GUILD: 28,
        GUILDERROR: 29,
        GUILDERRORTYPE: {
        	DOESNOTEXIST: 1,
        	BADNAME: 2,
        	ALREADYEXISTS: 3,
        	NOLEAVE: 4,
        	BADINVITE: 5,
        	GUILDRULES: 6,
        	IDWARNING: 7
        },
        GUILDACTION: {
			CONNECT: 8,
			ONLINE: 9,
			DISCONNECT: 10,
			INVITE: 11,
			LEAVE: 12,
			CREATE: 13,
			TALK: 14,
			JOIN: 15,
			POPULATION: 16
		}
    },

    Entities: {
        WARRIOR: 1,

        // Mobs
        RAT: 2,
        SKELETON: 3,
        GOBLIN: 4,
        OGRE: 5,
        SPECTRE: 6,
        CRAB: 7,
        BAT: 8,
        WIZARD: 9,
        EYE: 10,
        SNAKE: 11,
        SKELETON2: 12,
        BOSS: 13,
        DEATHKNIGHT: 14,

        // Armors
        FIREFOX: 20,
        CLOTHARMOR: 21,
        LEATHERARMOR: 22,
        MAILARMOR: 23,
        PLATEARMOR: 24,
        REDARMOR: 25,
        GOLDENARMOR: 26,

        // Objects
        FLASK: 35,
        BURGER: 36,
        CHEST: 37,
        FIREPOTION: 38,
        CAKE: 39,

        // NPCs
        GUARD: 40,
        KING: 41,
        OCTOCAT: 42,
        VILLAGEGIRL: 43,
        VILLAGER: 44,
        PRIEST: 45,
        SCIENTIST: 46,
        AGENT: 47,
        RICK: 48,
        NYAN: 49,
        SORCERER: 50,
        BEACHNPC: 51,
        FORESTNPC: 52,
        DESERTNPC: 53,
        LAVANPC: 54,
        CODER: 55,

        // Weapons
        SWORD1: 60,
        SWORD2: 61,
        REDSWORD: 62,
        GOLDENSWORD: 63,
        MORNINGSTAR: 64,
        AXE: 65,
        BLUESWORD: 66
    },

    Orientations: {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    },

    Keys: {
        ENTER: 13,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        SPACE: 32,
        I: 73,
        H: 72,
        M: 77,
        P: 80,
        KEYPAD_4: 100,
        KEYPAD_6: 102,
        KEYPAD_8: 104,
        KEYPAD_2: 98
    }
};

var kinds = {
    warrior: [Types.Entities.WARRIOR, "player"],

    rat: [Types.Entities.RAT, "mob", 5, 2],
    skeleton: [Types.Entities.SKELETON , "mob", 15, 8],
    goblin: [Types.Entities.GOBLIN, "mob", 8, 5],
    ogre: [Types.Entities.OGRE, "mob", 27, 12],
    spectre: [Types.Entities.SPECTRE, "mob", 53, 21],
    deathknight: [Types.Entities.DEATHKNIGHT, "mob", 70, 24],
    crab: [Types.Entities.CRAB, "mob", 1, 1],
    snake: [Types.Entities.SNAKE, "mob", 25, 10],
    bat: [Types.Entities.BAT, "mob", 6, 3,],
    wizard: [Types.Entities.WIZARD, "mob", 7, 1],
    eye: [Types.Entities.EYE, "mob",45, 18],
    skeleton2: [Types.Entities.SKELETON2, "mob", 38, 15],
    boss: [Types.Entities.BOSS, "mob", 140,  48],

    sword1: [Types.Entities.SWORD1, "weapon"],
    sword2: [Types.Entities.SWORD2, "weapon"],
    axe: [Types.Entities.AXE, "weapon"],
    redsword: [Types.Entities.REDSWORD, "weapon"],
    bluesword: [Types.Entities.BLUESWORD, "weapon"],
    goldensword: [Types.Entities.GOLDENSWORD, "weapon"],
    morningstar: [Types.Entities.MORNINGSTAR, "weapon"],

    firefox: [Types.Entities.FIREFOX, "armor"],
    clotharmor: [Types.Entities.CLOTHARMOR, "armor"],
    leatherarmor: [Types.Entities.LEATHERARMOR, "armor"],
    mailarmor: [Types.Entities.MAILARMOR, "armor"],
    platearmor: [Types.Entities.PLATEARMOR, "armor"],
    redarmor: [Types.Entities.REDARMOR, "armor"],
    goldenarmor: [Types.Entities.GOLDENARMOR, "armor"],

    flask: [Types.Entities.FLASK, "object"],
    cake: [Types.Entities.CAKE, "object"],
    burger: [Types.Entities.BURGER, "object"],
    chest: [Types.Entities.CHEST, "object"],
    firepotion: [Types.Entities.FIREPOTION, "object"],

    guard: [Types.Entities.GUARD, "npc"],
    villagegirl: [Types.Entities.VILLAGEGIRL, "npc"],
    villager: [Types.Entities.VILLAGER, "npc"],
    coder: [Types.Entities.CODER, "npc"],
    scientist: [Types.Entities.SCIENTIST, "npc"],
    priest: [Types.Entities.PRIEST, "npc"],
    king: [Types.Entities.KING, "npc"],
    rick: [Types.Entities.RICK, "npc"],
    nyan: [Types.Entities.NYAN, "npc"],
    sorcerer: [Types.Entities.SORCERER, "npc"],
    agent: [Types.Entities.AGENT, "npc"],
    octocat: [Types.Entities.OCTOCAT, "npc"],
    beachnpc: [Types.Entities.BEACHNPC, "npc"],
    forestnpc: [Types.Entities.FORESTNPC, "npc"],
    desertnpc: [Types.Entities.DESERTNPC, "npc"],
    lavanpc: [Types.Entities.LAVANPC, "npc"],

    getType: function(kind) {
        return kinds[Types.getKindAsString(kind)][1];
    },
    getMobExp: function(kind){
        return kinds[Types.getKindAsString(kind)][2];
    },
    getMobLevel: function(kind){
        return kinds[Types.getKindAsString(kind)][3];
    }

};

Types.rankedWeapons = [
    Types.Entities.SWORD1,
    Types.Entities.SWORD2,
    Types.Entities.AXE,
    Types.Entities.MORNINGSTAR,
    Types.Entities.BLUESWORD,
    Types.Entities.REDSWORD,
    Types.Entities.GOLDENSWORD
];

Types.rankedArmors = [
    Types.Entities.CLOTHARMOR,
    Types.Entities.LEATHERARMOR,
    Types.Entities.MAILARMOR,
    Types.Entities.PLATEARMOR,
    Types.Entities.REDARMOR,
    Types.Entities.GOLDENARMOR
];

Types.expForLevel = [
    1, 2, 5, 16, 39,
    81, 150, 256, 410, 625, // 10

    915, 1296, 1785, 2401, 3164,
    4096, 5220, 6561, 8145, 10000, // 20

    12155, 14641, 17490, 20736, 24414,
    28561, 33215, 38416, 44205, 50625, // 30

    57720, 65536, 74120, 83521, 93789,
    104976, 117135, 130321, 144590, 160000, // 40

    176610, 194481, 213675, 234256, 256289,
    279841, 304980, 331776, 360300, 390625, // 50

    422825, 456976, 493155, 531441, 571914,
    614656, 659750, 707281, 757335, 810000, // 60

    865365, 923521, 984560, 1048576, 1115664,
    1185921, 1259445, 1336336, 1416695, 1500625, // 70

    1588230, 1679616, 1774890, 1874161, 1977539,
    2085136, 2197065, 2313441, 2434380, 2560000, // 80

    2690420, 2825761, 2966145, 3111696, 3262539,
    3418801, 3580610, 3748096, 3921390, 4100625, // 90

    4285935, 4477456, 4675325, 4879681, 5090664,
    5318416, 5553080, 5804801, 6083725, 6410000, // 100

    6765201, 7311616, 7890481, 8503056, 9150625,
    9834496, 10556001, 11316496, 12117361, 12960000, // 110

    13845841, 14776336, 15752961, 16777216, 17850625,
    18974736, 20151121, 21381376, 22667121, 24010000, // 120

    25411681, 26873856, 28398241, 29986576, 31640625,
    33362176, 35153041, 37015056, 38950081, 40960000, // 130

    43046721, 45212176, 47458321, 49787136, 52200625,
    54700816, 57289761, 59969536, 62742241, 65610000, // 140

    68574961, 71639296, 74805201, 78074896, 81450625,
    84934656, 88529281, 92236816, 96059601, 100000000, // 150

    108243216,
];

Types.getLevel = function(exp){
    var i=1;
    for(i=1; i<135; i++){
        if(exp < Types.expForLevel[i]){
            return i;
        }
    }
    return 135;
};
Types.getWeaponRank = function(weaponKind) {
    return _.indexOf(Types.rankedWeapons, weaponKind);
};

Types.getArmorRank = function(armorKind) {
    return _.indexOf(Types.rankedArmors, armorKind);
};
Types.getMobExp = function(mobKind){
    return kinds.getMobExp(mobKind);
};
Types.getMobLevel = function(mobKind){
    return kinds.getMobLevel(mobKind);
};

Types.isPlayer = function(kind) {
    return kinds.getType(kind) === "player";
};

Types.isMob = function(kind) {
    return kinds.getType(kind) === "mob";
};

Types.isNpc = function(kind) {
    return kinds.getType(kind) === "npc";
};

Types.isCharacter = function(kind) {
    return Types.isMob(kind) || Types.isNpc(kind) || Types.isPlayer(kind);
};

Types.isArmor = function(kind) {
    return kinds.getType(kind) === "armor";
};

Types.isWeapon = function(kind) {
    return kinds.getType(kind) === "weapon";
};

Types.isObject = function(kind) {
    return kinds.getType(kind) === "object";
};

Types.isChest = function(kind) {
    return kind === Types.Entities.CHEST;
};

Types.isItem = function(kind) {
    return Types.isWeapon(kind)
        || Types.isArmor(kind)
        || (Types.isObject(kind) && !Types.isChest(kind));
};

Types.isHealingItem = function(kind) {
    return kind === Types.Entities.FLASK
        || kind === Types.Entities.BURGER;
};

Types.isExpendableItem = function(kind) {
    return Types.isHealingItem(kind)
        || kind === Types.Entities.FIREPOTION
        || kind === Types.Entities.CAKE;
};

Types.getKindFromString = function(kind) {
    if(kind in kinds) {
        return kinds[kind][0];
    }
};

Types.getKindAsString = function(kind) {
    for(var k in kinds) {
        if(kinds[k][0] === kind) {
            return k;
        }
    }
};

Types.forEachKind = function(callback) {
    for(var k in kinds) {
        callback(kinds[k][0], k);
    }
};

Types.forEachArmor = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isArmor(kind)) {
            callback(kind, kindName);
        }
    });
};

Types.forEachMobOrNpcKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isMob(kind) || Types.isNpc(kind)) {
            callback(kind, kindName);
        }
    });
};

Types.forEachArmorKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isArmor(kind)) {
            callback(kind, kindName);
        }
    });
};
Types.forEachWeaponKind = function(callback) {
    Types.forEachKind(function(kind, kindName) {
        if(Types.isWeapon(kind)) {
            callback(kind, kindName);
        }
    });
};

Types.getOrientationAsString = function(orientation) {
    switch(orientation) {
        case Types.Orientations.LEFT: return "left"; break;
        case Types.Orientations.RIGHT: return "right"; break;
        case Types.Orientations.UP: return "up"; break;
        case Types.Orientations.DOWN: return "down"; break;
    }
};

Types.getRandomItemKind = function(item) {
    var all = _.union(this.rankedWeapons, this.rankedArmors),
        forbidden = [Types.Entities.SWORD1, Types.Entities.CLOTHARMOR],
        itemKinds = _.difference(all, forbidden),
        i = Math.floor(Math.random() * _.size(itemKinds));

    return itemKinds[i];
};

Types.getMessageTypeAsString = function(type) {
    var typeName;
    _.each(Types.Messages, function(value, name) {
        if(value === type) {
            typeName = name;
        }
    });
    if(!typeName) {
        typeName = "UNKNOWN";
    }
    return typeName;
};

if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}
