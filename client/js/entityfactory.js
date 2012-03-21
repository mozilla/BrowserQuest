
define(['mobs', 'items', 'npcs', 'warrior', 'chest'], function(Mobs, Items, NPCs, Warrior, Chest) {

    var EntityFactory = {};

    EntityFactory.createEntity = function(kind, id, name) {
        if(!kind) {
            log.error("kind is undefined", true);
            return;
        }
    
        if(!_.isFunction(EntityFactory.builders[kind])) {
            throw Error(kind + " is not a valid Entity type");
        }
    
        return EntityFactory.builders[kind](id, name);
    };

    //===== mobs ======

    EntityFactory.builders = [];

    EntityFactory.builders[Types.Entities.WARRIOR] = function(id, name) {
        return new Warrior(id, name);
    };

    EntityFactory.builders[Types.Entities.RAT] = function(id) {
        return new Mobs.Rat(id);
    };

    EntityFactory.builders[Types.Entities.SKELETON] = function(id) {
        return new Mobs.Skeleton(id);
    };

    EntityFactory.builders[Types.Entities.SKELETON2] = function(id) {
        return new Mobs.Skeleton2(id);
    };

    EntityFactory.builders[Types.Entities.SPECTRE] = function(id) {
        return new Mobs.Spectre(id);
    };
    
    EntityFactory.builders[Types.Entities.DEATHKNIGHT] = function(id) {
        return new Mobs.Deathknight(id);
    };

    EntityFactory.builders[Types.Entities.GOBLIN] = function(id) {
        return new Mobs.Goblin(id);
    };

    EntityFactory.builders[Types.Entities.OGRE] = function(id) {
        return new Mobs.Ogre(id);
    };

    EntityFactory.builders[Types.Entities.CRAB] = function(id) {
        return new Mobs.Crab(id);
    };

    EntityFactory.builders[Types.Entities.SNAKE] = function(id) {
        return new Mobs.Snake(id);
    };

    EntityFactory.builders[Types.Entities.EYE] = function(id) {
        return new Mobs.Eye(id);
    };

    EntityFactory.builders[Types.Entities.BAT] = function(id) {
        return new Mobs.Bat(id);
    };

    EntityFactory.builders[Types.Entities.WIZARD] = function(id) {
        return new Mobs.Wizard(id);
    };

    EntityFactory.builders[Types.Entities.BOSS] = function(id) {
        return new Mobs.Boss(id);
    };

    //===== items ======
 
    EntityFactory.builders[Types.Entities.SWORD2] = function(id) {
        return new Items.Sword2(id);
    };

    EntityFactory.builders[Types.Entities.AXE] = function(id) {
        return new Items.Axe(id);
    };

    EntityFactory.builders[Types.Entities.REDSWORD] = function(id) {
        return new Items.RedSword(id);
    };

    EntityFactory.builders[Types.Entities.BLUESWORD] = function(id) {
        return new Items.BlueSword(id);
    };

    EntityFactory.builders[Types.Entities.GOLDENSWORD] = function(id) {
        return new Items.GoldenSword(id);
    };

    EntityFactory.builders[Types.Entities.MORNINGSTAR] = function(id) {
        return new Items.MorningStar(id);
    };

    EntityFactory.builders[Types.Entities.MAILARMOR] = function(id) {
        return new Items.MailArmor(id);
    };

    EntityFactory.builders[Types.Entities.LEATHERARMOR] = function(id) {
        return new Items.LeatherArmor(id);
    };

    EntityFactory.builders[Types.Entities.PLATEARMOR] = function(id) {
        return new Items.PlateArmor(id);
    };

    EntityFactory.builders[Types.Entities.REDARMOR] = function(id) {
        return new Items.RedArmor(id);
    };

    EntityFactory.builders[Types.Entities.GOLDENARMOR] = function(id) {
        return new Items.GoldenArmor(id);
    };

    EntityFactory.builders[Types.Entities.FLASK] = function(id) {
        return new Items.Flask(id);
    };
    
    EntityFactory.builders[Types.Entities.FIREPOTION] = function(id) {
        return new Items.FirePotion(id);
    };

    EntityFactory.builders[Types.Entities.BURGER] = function(id) {
        return new Items.Burger(id);
    };
    
    EntityFactory.builders[Types.Entities.CAKE] = function(id) {
        return new Items.Cake(id);
    };

    EntityFactory.builders[Types.Entities.CHEST] = function(id) {
        return new Chest(id);
    };

    //====== NPCs ======

    EntityFactory.builders[Types.Entities.GUARD] = function(id) {
        return new NPCs.Guard(id);
    };

    EntityFactory.builders[Types.Entities.KING] = function(id) {
        return new NPCs.King(id);
    };

    EntityFactory.builders[Types.Entities.VILLAGEGIRL] = function(id) {
        return new NPCs.VillageGirl(id);
    };

    EntityFactory.builders[Types.Entities.VILLAGER] = function(id) {
        return new NPCs.Villager(id);
    };
    
    EntityFactory.builders[Types.Entities.CODER] = function(id) {
        return new NPCs.Coder(id);
    };

    EntityFactory.builders[Types.Entities.AGENT] = function(id) {
        return new NPCs.Agent(id);
    };

    EntityFactory.builders[Types.Entities.RICK] = function(id) {
        return new NPCs.Rick(id);
    };

    EntityFactory.builders[Types.Entities.SCIENTIST] = function(id) {
        return new NPCs.Scientist(id);
    };

    EntityFactory.builders[Types.Entities.NYAN] = function(id) {
        return new NPCs.Nyan(id);
    };

    EntityFactory.builders[Types.Entities.PRIEST] = function(id) {
        return new NPCs.Priest(id);
    };
    
    EntityFactory.builders[Types.Entities.SORCERER] = function(id) {
        return new NPCs.Sorcerer(id);
    };

    EntityFactory.builders[Types.Entities.OCTOCAT] = function(id) {
        return new NPCs.Octocat(id);
    };
    
    EntityFactory.builders[Types.Entities.BEACHNPC] = function(id) {
        return new NPCs.BeachNpc(id);
    };
    
    EntityFactory.builders[Types.Entities.FORESTNPC] = function(id) {
        return new NPCs.ForestNpc(id);
    };
    
    EntityFactory.builders[Types.Entities.DESERTNPC] = function(id) {
        return new NPCs.DesertNpc(id);
    };
    
    EntityFactory.builders[Types.Entities.LAVANPC] = function(id) {
        return new NPCs.LavaNpc(id);
    };
    
    return EntityFactory;
});
