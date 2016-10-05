var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var url = require('url');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  //if req is to root or index
  if (req.method === 'GET') {
    //get file path from the url
    var urlPath = url.parse(req.url);
    var pathName = urlPath.pathname;
    var filePath = pathName === '/' ? path.join(archive.paths.publicSites, 'index.html') : path.join(archive.paths.publicSites, pathName);
    fs.readFile(filePath, function(err, data) {
      if (err) {
        res.statusCode = 404;
        res.end('File not found.');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });

  }
  // res.end(archive.paths.list);
};
