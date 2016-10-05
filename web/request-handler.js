var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var url = require('url');
var fs = require('fs');

exports.handleRequest = function (req, res) {
  var urlPath = url.parse(req.url);
  var pathName = urlPath.pathname;
  var filePath;
  //if req is to root or index
  if (req.method === 'GET' && (pathName === '/' || pathName === '/index.html')) {
    //get file path from the url
    filePath = pathName === '/' ? path.join(archive.paths.publicSites, 'index.html') : path.join(archive.paths.publicSites, pathName);
    fs.readFile(filePath, function(err, data) {
      if (err) {
        res.statusCode = 404;
        res.end('File not found.');
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
  } else if (req.method === 'GET') {
    // get the website URL the user is interested in ===> pathName
    // convert to filepath
    filePath = path.join(archive.paths.archivedSites, pathName);
    // read file
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
