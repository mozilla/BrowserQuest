
define(['character'], function(Character) {

    var NpcTalk = {
        "guard": [
            "Hello there",
            "We don't need to see your identification",
            "You are not the player we're looking for",
            "Move along, move along..."
        ],
    
        "king": [
            "Hi, I'm the King",
            "I run this place",
            "Like a boss",
            "I talk to people",
            "Like a boss",
            "I wear a crown",
            "Like a boss",
            "I do nothing all day",
            "Like a boss",
            "Now leave me alone",
            "Like a boss"
        ],
    
        "villagegirl": [
            "Hi there, adventurer!",
            "How do you like this game?",
            "It's all happening in a single web page! Isn't it crazy?",
            "It's all made possible thanks to WebSockets.",
            "I don't know much about it, after all I'm just a program.",
            'Why don&#x27;t you read this <a target="_blank" href="http://hacks.mozilla.org/2012/03/browserquest/">blog post</a> and learn all about it?'
        ],
    
        "villager": [
            "Howdy stranger. Do you like poetry?",
            "Roses are red, violets are blue...",
            "I like hunting rats, and so do you...",
            "The rats are dead, now what to do?",
            "To be honest, I have no clue.",
            "Maybe the forest, could interest you...",
            "or instead, cook a rat stew."
        ],
    
        "agent": [
            "Do not try to bend the sword",
            "That's impossible",
            "Instead, only try to realize the truth...",
            "There is no sword."
        ],
    
        "rick": [
            "We're no strangers to love",
            "You know the rules and so do I",
            "A full commitment's what I'm thinking of",
            "You wouldn't get this from any other guy",
            "I just wanna tell you how I'm feeling",
            "Gotta make you understand",
            "Never gonna give you up",
            "Never gonna let you down",
            "Never gonna run around and desert you",
            "Never gonna make you cry",
            "Never gonna say goodbye",
            "Never gonna tell a lie and hurt you"
        ],
        
        "scientist": [
            "Greetings.",
            "I am the inventor of these two potions.",
            "The red one will replenish your health points...",
            "The orange one will turn you into a firefox and make you invincible...",
            "But it only lasts for a short while.",
            "So make good use of it!",
            "Now if you'll excuse me, I need to get back to my experiments..."
        ],
    
        "nyan": [
            "nyan nyan nyan nyan nyan",
            "nyan nyan nyan nyan nyan nyan nyan",
            "nyan nyan nyan nyan nyan nyan",
            "nyan nyan nyan nyan nyan nyan nyan nyan"
        ],
        
        "beachnpc": [
            "lorem ipsum dolor sit amet",
            "consectetur adipisicing elit, sed do eiusmod tempor"
        ],
        
        "forestnpc": [
            "lorem ipsum dolor sit amet",
            "consectetur adipisicing elit, sed do eiusmod tempor"
        ],
        
        "desertnpc": [
            "lorem ipsum dolor sit amet",
            "consectetur adipisicing elit, sed do eiusmod tempor"
        ],
        
        "lavanpc": [
            "lorem ipsum dolor sit amet",
            "consectetur adipisicing elit, sed do eiusmod tempor"
        ],
    
        "priest": [
            "Oh, hello, young man.",
            "Wisdom is everything, so I'll share a few guidelines with you.",
            "You are free to go wherever you like in this world",
            "but beware of the many foes that await you.",
            "You can find many weapons and armors by killing enemies.",
            "The tougher the enemy, the higher the potential rewards.",
            "You can also unlock achievements by exploring and hunting.",
            "Click on the small cup icon to see a list of all the achievements.",
            "Please stay a while and enjoy the many surprises of BrowserQuest",
            "Farewell, young friend."
        ],
        
        "sorcerer": [
            "Ah... I had foreseen you would come to see me.",
            "Well? How do you like my new staff?",
            "Pretty cool, eh?",
            "Where did I get it, you ask?",
            "I understand. It's easy to get envious.",
            "I actually crafted it myself, using my mad wizard skills.",
            "But let me tell you one thing...",
            "There are lots of items in this game.",
            "Some more powerful than others.",
            "In order to find them, exploration is key.",
            "Good luck."
        ],
        
        "octocat": [
            "Welcome to BrowserQuest!",
            "Want to see the source code?",
            'Check out <a target="_blank" href="http://github.com/mozilla/BrowserQuest">the repository on GitHub</a>'
        ],
        
        "coder": [
            "Hi! Do you know that you can also play BrowserQuest on your tablet or mobile?",
            "That's the beauty of HTML5!",
            "Give it a try..."
        ],
    
        "beachnpc": [
            "Don't mind me, I'm just here on vacation.",
            "I have to say...",
            "These giant crabs are somewhat annoying.",
            "Could you please get rid of them for me?"
        ],
        
        "desertnpc": [
            "One does not simply walk into these mountains...",
            "An ancient undead lord is said to dwell here.",
            "Nobody knows exactly what he looks like...",
            "...for none has lived to tell the tale.",
            "It's not too late to turn around and go home, kid."
        ],
    
        "othernpc": [
            "lorem ipsum",
            "lorem ipsum"
        ]
    };

    var Npc = Character.extend({
        init: function(id, kind) {
            this._super(id, kind, 1);
            this.itemKind = Types.getKindAsString(this.kind);
            this.talkCount = NpcTalk[this.itemKind].length;
            this.talkIndex = 0;
        },
    
        talk: function() {
            var msg = null;
        
            if(this.talkIndex > this.talkCount) {
                this.talkIndex = 0;
            }
            if(this.talkIndex < this.talkCount) {
                msg = NpcTalk[this.itemKind][this.talkIndex];
            }
            this.talkIndex += 1;
            
            return msg;
        }
    });
    
    return Npc;
});