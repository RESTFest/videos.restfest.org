const fs = require('fs');

const hacktivity = {};

// remove `scripts` add `_data`
const hacktivity_dir = __dirname.slice(0, -7) + '_data/hacktivity/';

fs.readdir(hacktivity_dir, (err, files) => {
  for (let file of files) {
    if (file === '__all__.json') continue;
    console.log('reading ', hacktivity_dir + file);
    let data = fs.readFileSync(hacktivity_dir + file);
    let events = JSON.parse(data);
    events.items.forEach((ev) => {
      let [year, month, day] = ev.commit.author.date.split('-');
      day = Number(day.split('T')[0]);
      if (year === '2017' && month === '12') {
        if (!(day in hacktivity)) hacktivity[day] = {};
        if (!(ev.author.login in hacktivity[day])) hacktivity[day][ev.author.login] = {};
        // TODO: keep a count of hacktivity and links to repos?
        hacktivity[day][ev.author.login] = {
          login: ev.author.login,
          avatar_url: ev.author.avatar_url
        };
      }
    });
  }
  console.log('hacktivity', JSON.stringify(hacktivity, null, '  '));
  fs.writeFile(hacktivity_dir + '__all__.json', JSON.stringify(hacktivity, null, '  '), (err) => {
    if (err) console.error(err);
    console.log('Hacktivity summary written!');
  });
});
