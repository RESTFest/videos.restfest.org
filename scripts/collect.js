const fs = require('fs');

const fetch = require('node-fetch');

// remove `scripts` add `_data`
const data_dir = __dirname.slice(0, -7) + '_data/';

fs.readFile(data_dir + 'celebrants.json', (err, data) => {
  let celebrants = JSON.parse(data);
  for (let i = 0; i < celebrants.length; i++) {
    collectProfile(celebrants[i]['github']);
    collectHacktivity(celebrants[i]['github']);
  }
});

function collectHacktivity(username) {
  const url = `https://api.github.com/search/commits?q=author:${username}+author-date:>=2017-12-01`;

  // custom MIME type for "preview" Search API https://developer.github.com/v3/search/
  fetch(url, {headers:{Accept:'application/vnd.github.cloak-preview'}})
    .then(function(res) {
      return res.json();
    }).then(function(body) {
      let file_path = data_dir + 'hacktivity/' + username + '.json';
      // re-stringifying to store the pretty version
      fs.writeFile(file_path, JSON.stringify(body, null, '  '), (err) => {
        if (err) throw err;
        console.log(`Wrote ${username}'s hacktivity file!`);
      });
    });
}

function collectProfile(username) {
  const url = `https://api.github.com/users/${username}`;

  fetch(url)
    .then(function(res) {
      return res.json();
    }).then(function(body) {
      let file_path = data_dir + 'profiles/' + username + '.json';
      // re-stringifying to store the pretty version
      fs.writeFile(file_path, JSON.stringify(body, null, '  '), (err) => {
        if (err) throw err;
        console.log(`Wrote ${username}'s profile file!`);
      });
    });
}
