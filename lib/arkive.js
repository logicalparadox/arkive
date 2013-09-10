
var archiver = require('archiver');
var fs = require('fs');
var PassThrough = require('stream').PassThrough;
var path = require('path');
var readdir = require('readdir-stream');
var zlib = require('zlib');

exports.create = function(dir, opts) {
  opts = opts || {};
  if (!opts.format) opts.format = 'tar';
  if (false !== opts.compress) opts.compress = true;

  // vars
  var basedir = path.basename(dir);

  // streams
  var ark = archiver('tar');
  var input = readdir(dir);
  var compress = zlib.createGzip();
  var res = new PassThrough;

  input.on('readable', function() {
    var line = this.read();
    if (!line) return;
    if (line.stat.isDirectory()) return;
    var file = fs.createReadStream(line.path);
    var relative = path.relative(dir, line.path);
    if (opts.strip !== true) relative = path.join(basedir, relative);
    res.emit('append', { path: line.path, name: relative });
    ark.append(file, { name: relative });
  });

  input.on('end', function() {
    ark.finalize(function(err, bytes) {
      if (err) res.emit('error', err);
    });
  });

  ark
  .pipe(compress)
  .pipe(res);

  return res;
};
