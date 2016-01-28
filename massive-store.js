/* jshint ignore:start */
var senecaStore = require('seneca/lib/store')();
var uuid = require('node-uuid');
var massive = require('massive');

function fixquery(q) {
  var qq = {};

  for( var qp in q ) {
    if( !qp.match(/\$$/) ) {
      qq[qp] = q[qp];
    }
  }

  return qq;
}

module.exports = function(opts) {
  var db;
  var seneca = this;

  var opts = opts || {};
  opts.connection = opts.connection || {};

  function configure(opts, cb) {
    massive.connect(opts.connection, function(err, dbinst) {
      if (!err) {
        db = dbinst;
      }
      cb(err); 
    });
  };

  var store = {

    name: opts.name || 'massive-store',

    save: function (args, cb) {
      var ent = args.ent;
      var update = !!ent.id;
      var table = db[args.name];

      var data = fixquery(ent.data$());

      if (update) {
        table.save(data, function(err, res) {
          if (err) { return raiseError('update', err, cb);  }
          console.log(ent);
          cb(null, ent);
        });

      } else {
        data.id = data.id$ || uuid();
        
        console.log(data);
        table.save(data, function(err, res) {
          if (err) { return raiseError('save', err, cb);  }
          console.log(arguments);
          cb(null, args.ent);
        });
      }
    },

    load: function (args, cb) {
      var ent = args.ent;
      var name = args.name;

      var data = fixquery(args.qent.data$());

      db[name].find(data, function(err, rows) {
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
        if (err) { return raiseError('remove', err, cb);  }

        var result = {rowCount: res};

        seneca.log(args.tag$, 'remove', result.rowCount);
        cb(null, result);
      });
    },

    close: function (cb) { /* noop */  },
    native: function (args, done) {	done(null, db);	}
  };

  var meta = seneca.store.init(seneca, opts, store)
  desc = meta.desc


  seneca.add({init:store.name,tag:meta.tag},function(args,done){
    configure(opts,function(err){
      if( err ) return seneca.die('store',err,{store:store.name,desc:desc});
      return done();
    });
  });

  return {name:store.name,tag:meta.tag}


  function raiseError(name, err, cb) {
    seneca.log.error(err['routine'])
    seneca.log.error(err.detail ? err.detail : err.message);
    seneca.fail({code: name, start: args.meta$.start, store: 'massive-store'}, cb);
    return false;
  }
};
