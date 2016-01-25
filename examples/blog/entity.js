var queries = require('./queries');
var store = require('../../massive-store');

module.exports = function(opts) {
	var seneca = this;

	seneca.use(store('-/-/blog', queries));
};
