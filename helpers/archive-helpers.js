var fs = require('fs');
var http = require('http');
var path = require('path');
var URL = require('url');
var _ = require('underscore');
var Promise = require('bluebird');

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
      cb(err);
    } else {
      cb(data.split('\n'));
    }
  });
};

exports.readListOfUrlsAsync = () => {
  return new Promise((resolve, reject) => {
    exports.readListOfUrls((result) => {
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
};

exports.isUrlInList = function(url, cb) {
  url = exports.removeLeadingSlash(url);
  exports.readListOfUrls(function(urls) {
    urls.indexOf(url) === -1 ? cb(false) : cb(true);
  });
};

exports.isUrlInListAsync = (url) => {
  return new Promise((resolve) => {
    exports.isUrlInList(url, result => resolve(result)); 
  });
};

exports.removeLeadingSlash = function(url) {
  try {
    if (url.charAt(0) === '/') {
      url = url.slice(1);
    }
    return url;
  } catch (e) {
    return null;
  }
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

exports.addUrlToListAsync = Promise.promisify(exports.addUrlToList);

exports.isUrlArchived = function(url, cb) {
  fs.access(path.join(exports.paths.archivedSites, url), fs.R_OK, function(err) {
    if (err) {
      cb(false);
    } else {
      cb(true);
    }
  });
};

exports.isUrlArchivedAsync = (url) => {
  return new Promise((resolve) => {
    exports.isUrlArchived(url, (result) => resolve(result));
  });
};

exports.downloadUrl = function(url) {
  var options = {
    protocol: 'http:',
    hostname: url,
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) \
        AppleWebKit/537.36 (KHTML, like Gecko) \
        Chrome/53.0.2785.143 Safari/537.36'
    }
  };
  var req = http.get(options, function(res) {
    // on success, save page contents as 'url' in sites folder
    fs.writeFile(path.join(exports.paths.archivedSites, url), '', function(err) {
      if (err) {
        return;
      } else {
        var wStream = fs.createWriteStream(path.join(exports.paths.archivedSites, url));
        res.on('end', function() {
          wStream.end();
        });
        res.pipe(wStream);
      }
    });
  });
};

exports.downloadUrls = function(urls) {
  // go into sites.txt
  urls.forEach(function(url) {
    exports.isUrlArchived(url, function(exists) {
      if (!exists) {
        exports.downloadUrl(url);
      }
    });
  });
};

exports.clearSitesList = function() {
  fs.writeFile(exports.paths.list, '', function(err) {
    if (err) {
      console.log('Error clearing out sites.txt:', err);
    }
  });
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
