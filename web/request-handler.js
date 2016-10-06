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
    // TODO: check for sites.txt ===> if there, try to find file and retrieve,
    // if not, 404
    filePath = path.join(archive.paths.archivedSites, pathName);
    // read file

    archive.isUrlArchived(pathName, function(exists) {
      if (exists) {
        fs.readFile(filePath, function(err, data) {
          if (err) {
            res.statusCode = 500;
            res.end('Server Error. Could not read file.');
          } else {
            res.statusCode = 200;
            res.end(data);
          }
        });

      } else {
        archive.isUrlInList(pathName, function(exists) {
          if (exists) {
            res.statusCode = 200;
            res.end('Currently archiving site. Try again later.');
          } else {
            res.statusCode = 404;
            res.end('File not found. Use submit to add to archive.');
          }
        });
      }
    });

  } else if (req.method === 'POST') {
    var body = [];
    req.on('data', function(chunk) {
      body.push(chunk);
    });
    req.on('end', function() {
      body = body.join('');
      body = archive.parseFormData(body);
      // add body.url to sites.txt (archive.paths.list)
      archive.addUrlToList(body.url, function(err) {
        if (err) {
          res.statusCode = 500;
          res.end('Problem queueing site.');
        } else {
          res.writeHead(302, {
            'Location': '/' + body.url
          });
          res.end();
        }
      });
    });
  }
};
