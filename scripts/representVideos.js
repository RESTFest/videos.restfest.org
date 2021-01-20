var fs = require('fs');
var promisify = require('util').promisify;
const buildRepresentor = require('./video-representor');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const adapters = require(`./adapters`);

async function represent(type, adapter) {

    // Build HAL representations from raw video files
    const filenames = await readdir('./_data/raw/vimeo');

    await adapter.indexer(filenames.slice(0));

    filenames.forEach(async function (filename) {
        const content = await readFile(`./_data/raw/vimeo/${filename}`);

        var videoId = filename.split('.')[0];
        var rawVideo = JSON.parse(content.toString());

        var repr = buildRepresentor({ rawVideo });

        var hal = adapter.adapt(repr);

        await writeFile(adapter.getOutput(videoId), JSON.stringify(hal, null, 4) + "\n");
    });
}

Object.keys(adapters).forEach(async key => {
    const adapter = adapters[key];
    console.log('Representing as', key);
    await represent(key, adapter);
    console.log('Done', key);
});
