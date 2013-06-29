var config = {}


config.ip = process.env.OPENSHIFT_NODEJS_IP;
config.port = process.env.OPENSHIFT_NODEJS_PORT;
config.redis_port = process.env.OPENSHIFT_REDIS_PORT
config.redis_host = process.env.OPENSHIFT_REDIS_HOST

config.isActive = function() {
  return process.env.OPENSHIFT_NODEJS_IP !== undefined;
}

module.exports = config;
