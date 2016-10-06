// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(urls) {
  if (urls) {
    urls.forEach(function(url) {
      if (url !== '') {
        archive.downloadUrl(url);
      }
    });
    archive.clearSitesList();
  }
});
