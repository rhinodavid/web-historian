var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  publicSites: path.join(__dirname, '../web/public')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, 'utf-8', function(err, data) {
    if (err) {
      cb(null);
    } else {
      cb(data.split('\n'));
    }
  });
};

exports.isUrlInList = function(url, cb) {
  exports.readListOfUrls(function(urls) {
    urls.indexOf(url) === -1 ? cb(false) : cb(true);
  });
};

exports.addUrlToList = function(url, cb) {
  exports.isUrlInList(url, function(exists) {
    if (exists) {
      cb(null);
    } else {
      fs.appendFile(exports.paths.list, url + '\n', function(err) {
        if (err) {
          cb(new Error('Error queuing site.'));
        } else {
          cb(null);
        }
      });
    }
  });
};

exports.isUrlArchived = function(url, cb) {
  fs.access(path.join(exports.paths.archivedSites, url), fs.R_OK, function(err) {
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
};

exports.downloadUrls = function() {
};

exports.parseFormData = function(formData) {
  formData = formData.split('&');
  formData = formData.map(function(pair) {
    return pair.split('=');
  });
  var result = {};
  formData.forEach(function(pair) {
    result[pair[0]] = pair[1];
  });
  return result;
};
