var _ = require('underscore');
var cls = require('./lib/class');
var Metrics = {};


Metrics = cls.Class.extend({
    init: function(config) {
        var self = this;

        this.config = config;
        this.client = new (require('memcache')).Client(config.memcached_port, config.memcached_host);
        this.client.connect();

        this.isReady = false;

        this.client.on('connect', function () {
            log.info('Metrics enabled: memcached client connected to ' + config.memcached_host + ':' + config.memcached_port);
            self.isReady = true;
            if (self.readyCallback) {
                self.readyCallback();
            }
        });
    },

    ready: function (callback) {
        this.readyCallback = callback;
    },

    updatePlayerCounters: function (worlds, updatedCallback) {
        var self = this;
        var config = this.config;
        var numServers = _.size(config.game_servers);
        var playerCount = _.reduce(worlds, function (sum, world) { return sum + world.playerCount; }, 0);

        if (this.isReady) {
            // Set the number of players on this server
            this.client.set('player_count_'+config.server_name, playerCount, function () {
                var totalPlayers = 0;

                // Recalculate the total number of players and set it
                _.each(config.game_servers, function (server) {
                    self.client.get('player_count_'+server.name, function (error, result) {
                        var count = result ? parseInt(result, 10) : 0;

                        totalPlayers += count;
                        numServers -= 1;
                        if (numServers === 0) {
                            self.client.set('total_players', totalPlayers, function () {
                                if (updatedCallback) {
                                    updatedCallback(totalPlayers);
                                }
                            });
                        }
                    });
                });
            });
        } else {
            log.error('Memcached client not connected');
        }
    },

    updateWorldDistribution: function (worlds) {
        this.client.set('world_distribution_' + this.config.server_name, worlds);
    },

    updateWorldCount: function() {
        this.client.set('world_count_' + this.config.server_name, this.config.nb_worlds);
    },

    getOpenWorldCount: function (callback) {
        this.client.get('world_count_' + this.config.server_name, function (error, result) {
            callback(result);
        });
    },

    getTotalPlayers: function (callback) {
        this.client.get('total_players', function (error, result) {
            callback(result);
        });
    }
});

module.exports = Metrics;
