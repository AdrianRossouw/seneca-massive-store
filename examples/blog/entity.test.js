/* jshint mocha: true */

var assert = require('assert');
var fixture = require('./test.fixture.js');


var seneca = require('seneca')({
  strict: { fatal$: false }
});

seneca.use(require('../../massive-store'), {
  connection: { db: 'massive-test'  }
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
			id = res.data$().id;
			done();
		});
	});

	it('load', function(done) {
		var ent = seneca.make$('-/-/blog');

		ent.load$({ id: id }, function(err, row) {
			loadedEnt = row;

			assert.equal(row.id, id);
			assert.equal(row.createdDate, fixture.createdDate);
			done();
		});
	});

	it('update', function(done) {
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

	it('remove', function(done) {
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
