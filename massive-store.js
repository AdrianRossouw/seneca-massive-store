/* jshint ignore:start */
var senecaStore = require('seneca/lib/store')();
var uuid = require('node-uuid');
var massive = require('massive');

module.exports = function(opts) {
  var seneca = this;

  var opts = opts || {};
  opts.connection = opts.connection || {};

  var db = massive.connectSync(opts.connection);

  function raiseError(name, err, cb) {
    seneca.log.error(err['routine'])
    seneca.log.error(err.detail ? err.detail : err.message);
    seneca.fail({code: name, start: args.meta$.start, store: 'massive-store'}, cb);
    return false;
  }

  var storeCmds = {

    name: opts.name || 'massive-store',

    save: function (args, cb) {
      var ent = args.ent;
      var update = !!ent.id;
      var table = db[ent.name];

      if (update) {
        
        table.update(args, function(err, res) {
          if (err) { return raiseError('update', err, cb);  }
          cb(null, ent);
        });

      } else {
        args.ent.id = args.ent.id$ || uuid();
        
        table.insert(args, function(err, res) {
          if (err) { return raiseError('save', err, cb);  }
          cb(null, args.ent);
        });
      }
    },

    load: function (args, cb) {
      var ent = args.ent;

      var table = db[ent.name];

      table.load(args, function(err, rows) {
        if (err) { return raiseError('load', err, cb);  }

        seneca.log(args.tag$, 'load', ent);

        if (rows && rows.length) {
          ent.data$(rows[0]);
          cb(null, ent);
        } else {
          cb(null, undefined);
        }
      });
    },


    list: function (args, cb) {
      var qent = args.qent;


      db[ent.name].list(args, function(err, rows) {
        if (err) { return raiseError('list', err, cb);  }

        var list = rows.map(function(row) {	return qent.make$(row);	});
        seneca.log(args.tag$, 'list', list.length, list[0]);
        cb(null, list);
      });
    },

    remove: function (args, cb) {
      var qent = args.qent;

      db[ent.name].remove(args, function(err, rows) {
        if (err) { return raiseError('list', err, cb);  }

        var result = {rowCount: res};

        seneca.log(args.tag$, 'remove', res.rowCount);
        cb(null, result);
      });
    },

    close: function (cb) { /* noop */  },
    native: function (args, done) {	done(null, db);	}
  };

  senecaStore.init(seneca, {}, storeCmds);
};
