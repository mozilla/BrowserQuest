
define(['entity', 'transition', 'timer'], function(Entity, Transition, Timer) {

    var Character = Entity.extend({
        init: function(id, kind) {
            var self = this;

            this._super(id, kind);

            // Position and orientation
            this.nextGridX = -1;
            this.nextGridY = -1;
            this.orientation = Types.Orientations.DOWN;

            // Speeds
            this.atkSpeed = 50;
            this.moveSpeed = 120;
            this.walkSpeed = 100;
            this.idleSpeed = 450;
            this.setAttackRate(800);

            // Pathing
            this.movement = new Transition();
            this.path = null;
            this.newDestination = null;
            this.adjacentTiles = {};

            // Combat
            this.target = null;
            this.unconfirmedTarget = null;
            this.attackers = {};

            // Health
            this.hitPoints = 0;
            this.maxHitPoints = 0;

            // Modes
            this.isDead = false;
            this.attackingMode = false;
            this.followingMode = false;
        },

        clean: function() {
            this.forEachAttacker(function(attacker) {
                attacker.disengage();
                attacker.idle();
            });
        },

        setMaxHitPoints: function(hp) {
            this.maxHitPoints = hp;
            this.hitPoints = hp;
        },

        setDefaultAnimation: function() {
            this.idle();
        },

        hasWeapon: function() {
            return false;
        },

        hasShadow: function() {
            return true;
        },

        animate: function(animation, speed, count, onEndCount) {
            var oriented = ['atk', 'walk', 'idle'],
                o = this.orientation;

            if(!(this.currentAnimation && this.currentAnimation.name === "death")) { // don't change animation if the character is dying
                this.flipSpriteX = false;
                this.flipSpriteY = false;

                if(_.indexOf(oriented, animation) >= 0) {
                    animation += "_" + (o === Types.Orientations.LEFT ? "right" : Types.getOrientationAsString(o));
                    this.flipSpriteX = (this.orientation === Types.Orientations.LEFT) ? true : false;
                }

                this.setAnimation(animation, speed, count, onEndCount);
            }
        },

        turnTo: function(orientation) {
            this.orientation = orientation;
            this.idle();
        },

        setOrientation: function(orientation) {
            if(orientation) {
                this.orientation = orientation;
            }
        },

        idle: function(orientation) {
            this.setOrientation(orientation);
            this.animate("idle", this.idleSpeed);
        },

        hit: function(orientation) {
            this.setOrientation(orientation);
            this.animate("atk", this.atkSpeed, 1);
        },

        walk: function(orientation) {
            this.setOrientation(orientation);
            this.animate("walk", this.walkSpeed);
        },

        moveTo_: function(x, y, callback) {
            this.destination = { gridX: x, gridY: y };
            this.adjacentTiles = {};

            if(this.isMoving()) {
                this.continueTo(x, y);
            }
            else {
                var path = this.requestPathfindingTo(x, y);

                this.followPath(path);
            }
        },

        requestPathfindingTo: function(x, y) {
            if(this.request_path_callback) {
                return this.request_path_callback(x, y);
            } else {
                log.error(this.id + " couldn't request pathfinding to "+x+", "+y);
                return [];
            }
        },

        onRequestPath: function(callback) {
            this.request_path_callback = callback;
        },

        onStartPathing: function(callback) {
            this.start_pathing_callback = callback;
        },

        onStopPathing: function(callback) {
            this.stop_pathing_callback = callback;
        },

        followPath: function(path) {
            if(path.length > 1) { // Length of 1 means the player has clicked on himself
                this.path = path;
                this.step = 0;

                if(this.followingMode) { // following a character
                    path.pop();
                }

                if(this.start_pathing_callback) {
                    this.start_pathing_callback(path);
                }
                this.nextStep();
            }
        },

        continueTo: function(x, y) {
            this.newDestination = { x: x, y: y };
        },

        updateMovement: function() {
            var p = this.path,
                i = this.step;

            if(p[i][0] < p[i-1][0]) {
                this.walk(Types.Orientations.LEFT);
            }
            if(p[i][0] > p[i-1][0]) {
                this.walk(Types.Orientations.RIGHT);
            }
            if(p[i][1] < p[i-1][1]) {
                this.walk(Types.Orientations.UP);
            }
            if(p[i][1] > p[i-1][1]) {
                this.walk(Types.Orientations.DOWN);
            }
        },

        updatePositionOnGrid: function() {
            this.setGridPosition(this.path[this.step][0], this.path[this.step][1]);
        },

        nextStep: function() {
            var stop = false,
                x, y, path;

            if(this.isMoving()) {
                if(this.before_step_callback) {
                    this.before_step_callback();
                }

                this.updatePositionOnGrid();
                this.checkAggro();

                if(this.interrupted) { // if Character.stop() has been called
                    stop = true;
                    this.interrupted = false;
                }
                else {
                    if(this.hasNextStep()) {
                        this.nextGridX = this.path[this.step+1][0];
                        this.nextGridY = this.path[this.step+1][1];
                    }

                    if(this.step_callback) {
                        this.step_callback();
                    }

                    if(this.hasChangedItsPath()) {
                        x = this.newDestination.x;
                        y = this.newDestination.y;
                        path = this.requestPathfindingTo(x, y);

                        this.newDestination = null;
                        if(path.length < 2) {
                            stop = true;
                        }
                        else {
                            this.followPath(path);
                        }
                    }
                    else if(this.hasNextStep()) {
                        this.step += 1;
                        this.updateMovement();
                    }
                    else {
                        stop = true;
                    }
                }

                if(stop) { // Path is complete or has been interrupted
                    this.path = null;
                    this.idle();

                    if(this.stop_pathing_callback) {
                        this.stop_pathing_callback(this.gridX, this.gridY);
                    }
                }
            }
        },

        onBeforeStep: function(callback) {
            this.before_step_callback = callback;
        },

        onStep: function(callback) {
            this.step_callback = callback;
        },

        isMoving: function() {
            return !(this.path === null);
        },

        hasNextStep: function() {
            return (this.path.length - 1 > this.step);
        },

        hasChangedItsPath: function() {
            return !(this.newDestination === null);
        },

        isNear: function(character, distance) {
            var dx, dy, near = false;

            dx = Math.abs(this.gridX - character.gridX);
            dy = Math.abs(this.gridY - character.gridY);

            if(dx <= distance && dy <= distance) {
                near = true;
            }
            return near;
        },

        onAggro: function(callback) {
            this.aggro_callback = callback;
        },

        onCheckAggro: function(callback) {
            this.checkaggro_callback = callback;
        },

        checkAggro: function() {
            if(this.checkaggro_callback) {
                this.checkaggro_callback();
            }
        },

        aggro: function(character) {
            if(this.aggro_callback) {
                this.aggro_callback(character);
            }
        },

        onDeath: function(callback) {
            this.death_callback = callback;
        },

        /**
         * Changes the character's orientation so that it is facing its target.
         */
        lookAtTarget: function() {
            if(this.target) {
                this.turnTo(this.getOrientationTo(this.target));
            }
        },

        /**
         *
         */
        go: function(x, y) {
            if(this.isAttacking()) {
                this.disengage();
            }
            else if(this.followingMode) {
                this.followingMode = false;
                this.target = null;
            }
            this.moveTo_(x, y);
        },

        /**
         * Makes the character follow another one.
         */
        follow: function(entity) {
            if(entity) {
                this.followingMode = true;
                this.moveTo_(entity.gridX, entity.gridY);
            }
        },

        /**
         * Stops a moving character.
         */
        stop: function() {
            if(this.isMoving()) {
                this.interrupted = true;
            }
        },

        /**
         * Makes the character attack another character. Same as Character.follow but with an auto-attacking behavior.
         * @see Character.follow
         */
        engage: function(character) {
            this.attackingMode = true;
            this.setTarget(character);
            this.follow(character);
        },

        disengage: function() {
            this.attackingMode = false;
            this.followingMode = false;
            this.removeTarget();
        },

        /**
         * Returns true if the character is currently attacking.
         */
        isAttacking: function() {
            return this.attackingMode;
        },

        /**
         * Gets the right orientation to face a target character from the current position.
         * Note:
         * In order to work properly, this method should be used in the following
         * situation :
         *    S
         *  S T S
         *    S
         * (where S is self, T is target character)
         *
         * @param {Character} character The character to face.
         * @returns {String} The orientation.
         */
        getOrientationTo: function(character) {
            if(this.gridX < character.gridX) {
                return Types.Orientations.RIGHT;
            } else if(this.gridX > character.gridX) {
                return Types.Orientations.LEFT;
            } else if(this.gridY > character.gridY) {
                return Types.Orientations.UP;
            } else {
                return Types.Orientations.DOWN;
            }
        },

        /**
         * Returns true if this character is currently attacked by a given character.
         * @param {Character} character The attacking character.
         * @returns {Boolean} Whether this is an attacker of this character.
         */
        isAttackedBy: function(character) {
            return (character.id in this.attackers);
        },

        /**
        * Registers a character as a current attacker of this one.
        * @param {Character} character The attacking character.
        */
        addAttacker: function(character) {
            if(!this.isAttackedBy(character)) {
                this.attackers[character.id] = character;
            } else {
                log.error(this.id + " is already attacked by " + character.id);
            }
        },

        /**
        * Unregisters a character as a current attacker of this one.
        * @param {Character} character The attacking character.
        */
        removeAttacker: function(character) {
            if(this.isAttackedBy(character)) {
                delete this.attackers[character.id];
            } else {
                log.error(this.id + " is not attacked by " + character.id);
            }
        },

        /**
         * Loops through all the characters currently attacking this one.
         * @param {Function} callback Function which must accept one character argument.
         */
        forEachAttacker: function(callback) {
            _.each(this.attackers, function(attacker) {
                callback(attacker);
            });
        },

        /**
         * Sets this character's attack target. It can only have one target at any time.
         * @param {Character} character The target character.
         */
        setTarget: function(character) {
            if(this.target !== character) { // If it's not already set as the target
                if(this.hasTarget()) {
                    this.removeTarget(); // Cleanly remove the previous one
                }
                this.unconfirmedTarget = null;
                this.target = character;
            } else {
                log.debug(character.id + " is already the target of " + this.id);
            }
        },

        /**
         * Removes the current attack target.
         */
        removeTarget: function() {
            var self = this;

            if(this.target) {
                if(this.target instanceof Character) {
                    this.target.removeAttacker(this);
                }
                this.target = null;
            }
        },

        /**
         * Returns true if this character has a current attack target.
         * @returns {Boolean} Whether this character has a target.
         */
        hasTarget: function() {
            return !(this.target === null);
        },

        /**
         * Marks this character as waiting to attack a target.
         * By sending an "attack" message, the server will later confirm (or not)
         * that this character is allowed to acquire this target.
         *
         * @param {Character} character The target character
         */
        waitToAttack: function(character) {
            this.unconfirmedTarget = character;
        },

        /**
         * Returns true if this character is currently waiting to attack the target character.
         * @param {Character} character The target character.
         * @returns {Boolean} Whether this character is waiting to attack.
         */
        isWaitingToAttack: function(character) {
            return (this.unconfirmedTarget === character);
        },

        /**
         *
         */
        canAttack: function(time) {
            if(this.canReachTarget() && this.attackCooldown.isOver(time)) {
                return true;
            }
            return false;
        },

        canReachTarget: function() {
            if(this.hasTarget() && this.isAdjacentNonDiagonal(this.target)) {
                return true;
            }
            return false;
        },

        /**
         *
         */
        die: function() {
            this.removeTarget();
            this.isDead = true;

            if(this.death_callback) {
                this.death_callback();
            }
        },

        onHasMoved: function(callback) {
            this.hasmoved_callback = callback;
        },

        hasMoved: function() {
            this.setDirty();
            if(this.hasmoved_callback) {
                this.hasmoved_callback(this);
            }
        },

        hurt: function() {
            var self = this;

            this.stopHurting();
            this.sprite = this.hurtSprite;
            this.hurting = setTimeout(this.stopHurting.bind(this), 75);
        },

        stopHurting: function() {
            this.sprite = this.normalSprite;
            clearTimeout(this.hurting);
        },

        setAttackRate: function(rate) {
            this.attackCooldown = new Timer(rate);
        }
    });

    return Character;
});
