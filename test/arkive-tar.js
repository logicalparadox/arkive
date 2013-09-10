var fs = require('fs');
var join = require('path').join;

var FOLDER = join(__dirname, 'fixtures/folder');

describe('.create()', function() {
  describe('folder', function() {
    it('{ format: "tar", compress: true }', function(done) {
      var files = [
          'folder/hello.txt'
        , 'folder/universe.txt'
        , 'folder/nested/world.txt'
      ];

      var clen = 0;

      var append = chai.spy('append', function(file) {
        var name = file.name;
        files.should.contain(name);
      });

      var readable = chai.spy('readable', function() {
        var data = this.read();
        if (data) clen += data.length;
      });

      var tar = arkive.create(FOLDER);
      tar.on('append', append);
      tar.on('readable', readable);
      tar.on('end', function() {
        append.should.have.been.called(files.length);
        clen.should.be.above(0);
        done();
      });
    });
  });
});
