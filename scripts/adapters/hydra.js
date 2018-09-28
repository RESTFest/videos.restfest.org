const fs = require('fs');
const promisify = require('util').promisify;
const videoRepresentor = require('../video-representor');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function adapt(repr) {
    const resource = {
        '@context': [
            'http://localhost:4000/hydra/@context/video.jsonld',
            {
                '@base': 'http://localhost:4000'
            }
        ],
        '@type': [
            'http://videos.resftest.org/api/Video',
            'http://schema.org/VideoObject'
        ]
    };

    Object.keys(repr.attributes).forEach(function (attribute) {
        if (!repr.attributes[attribute]) {
            return;
        }

        resource[attribute] = repr.attributes[attribute];
    });

    repr.links.links.forEach(function (linkRepr) {
        if(linkRepr.rel === 'self') {
            resource['@id'] = `/hydra${linkRepr.href.replace(/^\/videos/, '/video')}.jsonld`;
            return;
        }

        resource[linkRepr.rel] = {
            '@id': `/hydra${linkRepr.href.replace(/^\/videos/, '/video')}.jsonld`
        };
    });

    return resource;
}

module.exports = {
    adapt,
    indexer: async (filenames) => {
        const pageSize = 20;
        const total = filenames.length;

        let files = filenames.splice(0, pageSize);
        let index = 0;

        while(files.length > 0) {
            index++;

            const page = {
                "@id": "http://localhost:4000/hydra/videos.jsonld",
                "@type": "hydra:Collection",
                "hydra:totalItems": total,
                "member": [],
                "view": {
                    "@id": `http://localhost:4000/hydra/videos/${index}.jsonld`,
                    "@type": "hydra:PartialCollectionView",
                    "first": "http://localhost:4000/hydra/videos/1.jsonld",
                    "last": `http://localhost:4000/hydra/videos/${Math.ceil(total / pageSize)}.jsonld`
                },
                "@context": [
                    {
                        'hydra': 'http://www.w3.org/ns/hydra/core#',
                        'member': 'hydra:member',
                        'view': 'hydra:view',
                        first: { '@id': 'hydra:first', '@type': '@id' },
                        last: { '@id': 'hydra:last', '@type': '@id' },
                        previous: { '@id': 'hydra:previous', '@type': '@id' },
                        next: { '@id': 'hydra:next', '@type': '@id' },
                    }
                ],
            };

            if (index > 1) {
                page.view.previous = `http://localhost:4000/hydra/videos/${index - 1}.jsonld`;
            }

            if ((index + 1) * pageSize <= total) {
                page.view.next = `http://localhost:4000/hydra/videos/${index + 1}.jsonld`;
            }

            await Promise.all(files.map(file =>
                readFile(`./_data/raw/vimeo/${file}`)
                    .then(content => JSON.parse(content.toString()))
                    .then(rawVideo => {
                        const repr = videoRepresentor({
                            rawVideo,
                            rootProps: ['name']
                        });
                        page.member.push(adapt(repr));
                    })
            ));

            await writeFile(`./hydra/videos/${index}.jsonld`, JSON.stringify(page, null, 4));

            files = filenames.splice(0, pageSize);
        }
    },
    getOutput: (videoId) => `./hydra/video/${videoId}.jsonld`
};
