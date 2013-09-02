var exists, existsSync;
(function () {
    var semver = require('semver');
    var module = (semver.satisfies(process.version, '>=0.7.1') ? require('fs') : require('path'));

    exists = module.exists;
    existsSync = module.existsSync;
})();

if (!(typeof exports === 'undefined')) {
    module.exports.exists = exists;
    module.exports.existsSync = existsSync;
}
