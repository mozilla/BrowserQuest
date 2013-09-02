
define(['lib/astar'], function(AStar) {

    var Pathfinder = Class.extend({
        init: function(width, height) {
            this.width = width;
            this.height = height;
            this.grid = null;
            this.blankGrid = [];
            this.initBlankGrid_();
            this.ignored = [];
        },

        initBlankGrid_: function() {
            for(var i=0; i < this.height; i += 1) {
                this.blankGrid[i] = [];
                for(var j=0; j < this.width; j += 1) {
                    this.blankGrid[i][j] = 0;
                }
            }
        },

        findPath: function(grid, entity, x, y, findIncomplete) {
            var start = [entity.gridX, entity.gridY],
                end = [x, y],
                path;

            this.grid = grid;
            this.applyIgnoreList_(true);
            path = AStar(this.grid, start, end);

            if(path.length === 0 && findIncomplete === true) {
                // If no path was found, try and find an incomplete one
                // to at least get closer to destination.
                path = this.findIncompletePath_(start, end);
            }

            return path;
        },

        /**
         * Finds a path which leads the closest possible to an unreachable x, y position.
         *
         * Whenever A* returns an empty path, it means that the destination tile is unreachable.
         * We would like the entities to move the closest possible to it though, instead of
         * staying where they are without moving at all. That's why we have this function which
         * returns an incomplete path to the chosen destination.
         *
         * @private
         * @returns {Array} The incomplete path towards the end position
         */
        findIncompletePath_: function(start, end) {
            var perfect, x, y,
                incomplete = [];

            perfect = AStar(this.blankGrid, start, end);

            for(var i=perfect.length-1; i > 0; i -= 1) {
                x = perfect[i][0];
                y = perfect[i][1];

                if(this.grid[y][x] === 0) {
                    incomplete = AStar(this.grid, start, [x, y]);
                    break;
                }
            }
            return incomplete;
        },

        /**
         * Removes colliding tiles corresponding to the given entity's position in the pathing grid.
         */
        ignoreEntity: function(entity) {
            if(entity) {
                this.ignored.push(entity);
            }
        },

        applyIgnoreList_: function(ignored) {
            var self = this,
                x, y, g;

            _.each(this.ignored, function(entity) {
                x = entity.isMoving() ? entity.nextGridX : entity.gridX;
                y = entity.isMoving() ? entity.nextGridY : entity.gridY;

                if(x >= 0 && y >= 0) {
                    self.grid[y][x] = ignored ? 0 : 1;
                }
            });
        },

        clearIgnoreList: function() {
            this.applyIgnoreList_(false);
            this.ignored = [];
        }
    });

    return Pathfinder;
});
