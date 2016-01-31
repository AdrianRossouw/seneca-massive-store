/* jshint mocha: true */

var assert = require('assert');

var fixture = {
	id: '12345',
	title: 'Entity Test',
	content: 'Entity Test',
	createdDate: new Date(),
	createdBy: 'adrian'
};

var seneca = require('seneca')({
  strict: { fatal$: false }
});

seneca.use(require('../../massive-store'), {
  connection: { db: 'massive-test'  }
});

before(function(done) {
  seneca.on('ready', done);
});

describe('blog seneca calls', function() {
	var id = null;
	var loadedEnt = null;

	it('insert', function(done) {
		var ent = seneca.make$('-/-/blog');

		ent.title = fixture.title;
		ent.content = fixture.content;
		ent.createdBy = fixture.createdBy;
		ent.createdDate = fixture.createdDate;

    ent.save$(function(err, res) {
			id = res.id;
			done();
		});
	});

	it('load', function(done) {
		var ent = seneca.make$('-/-/blog');

    ent.load$(id, function(err, row) {
			loadedEnt = row;

      assert.equal(row.id, id, 'id equals');
      assert.equal(row.createdBy, fixture.createdBy);
			assert.equal(row.createdDate.toISOString(), fixture.createdDate.toISOString());
			done();
		});
	});

	it.skip('update', function(done) {
		loadedEnt.content = 'test changed';

		loadedEnt.save$(function(err, ent) {
			var _query = {
				q: {
					id: ent.id
				}
			}

		  	queries.load(_query)
				.then(function(rows) {

					assert.equal(rows[0].content, loadedEnt.content);
					done();
				});
		});
	});

	it.skip('remove', function(done) {
		var ent = seneca.make$('-/-/blog');
		ent.id = id;

		ent.remove$(function(err, result) {
			assert.equal(1, result.rowCount);
			done();
		})
	});

	it('native', function(done) {
		var ent = seneca.make$('-/-/blog');
		ent.id = id;

		ent.native$(function(err, db) {
			assert.ok(db.blog);
			done();
		})
	});
});
