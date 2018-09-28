var fs = require('fs');
var util = require('util')
var Representor = require('representor').Representor;

// Build HAL representations from raw video files
fs.readdir('./_data/raw/vimeo', function (errors, filenames) {
    createIndex(filenames);
    createVideoFiles(filenames);
});

var adapters = {
    toHal: function (repr) {
        var hal = {};

        // We copy the attributes directly from the representor
        Object.keys(repr.attributes).forEach(function (attribute) {
            hal[attribute] = repr.attributes[attribute];
        });

        // HAL allow for grouping links and embeds together when there are more than
        // one reference. For instance, if there are multiple links with the rel of
        // `next`, the value of _links.next will be an array. But if there is only one
        // `next`, the value of _links.next will be the single object.

        var groupedLinks = repr.links.links.reduce(function (result, link) {
            if (!(result[link.rel])) { result[link.rel] = [] };
            result[link.rel].push({ href: link.href });
            return result;
        }, {});

        Object.keys(groupedLinks).forEach(function (rel) {
            if (!hal._links) { hal._links = {} };
            if (groupedLinks[rel].length === 1) {
                hal._links[rel] = groupedLinks[rel][0];
            } else {
                hal._links[rel] = groupedLinks[rel];
            }
        });

        var groupedEmbeds = repr.embeddeds.embeddeds.reduce(function (result, embed) {
            if (!(result[embed.rel])) { result[embed.rel] = [] };
            result[embed.rel].push(adapters.toHal(embed));
            return result;
        }, {});

        Object.keys(groupedEmbeds).forEach(function (rel) {
            if (!hal._embedded) { hal._embedded = {} };
            if (groupedEmbeds[rel].length === 1) {
                hal._embedded[rel] = groupedEmbeds[rel][0];
            } else {
                hal._embedded[rel] = groupedEmbeds[rel];
            }
        });

        return hal;
    }
}

function createIndex(filenames) {
    var repr = new Representor();

    repr.links.add({
        rel: 'self',
        href: '/videos/hal/index.json'
    });

    filenames.forEach(function (filename) {
        repr.links.add({
            rel: 'http://videos.restfest.org/rels/video',
            href: `/videos/hal/${filename}`
        })
    });

    var hal = adapters.toHal(repr);

    fs.writeFile('./_videos/hal/index.json', JSON.stringify(hal, null, 4), function () { });
}

function createVideoFiles(filenames) {
    filenames.forEach(function (filename) {
        fs.readFile(`./_data/raw/vimeo/${filename}`, function (readError, content) {
            var videoId = filename.split('.')[0];
            var rawVideo = JSON.parse(content.toString());
            var repr = new Representor();

            var rootProps = ['name', 'description', 'duration', 'width', 'language', 'height', 'embed', 'created_time', 'modified_time', 'release_time', 'license'];
            var sizeProps = ['width', 'height'];

            repr.links.add({
                rel: 'self',
                href: rawVideo.uri
            })

            // Get root props
            rootProps.forEach(function (prop) {
                repr.attributes[prop] = rawVideo[prop];
            });

            // We'll treat each size as its own picture
            rawVideo.pictures.sizes.forEach(function (size) {
                var picRepr = repr.embeddeds.add({
                    rel: 'http://videos.restfest.org/rels/picture',
                });

                picRepr.links.add({
                    rel: 'self',
                    href: size.link
                });

                picRepr.links.add({
                    rel: 'http://videos.restfest.org/rels/picture_with_play_button',
                    href: size.link_with_play_button
                });

                // Add the relevant size attributes to our "picture"
                sizeProps.forEach(function (prop) {
                    picRepr.attributes[prop] = size[prop]
                });
            });

            var hal = adapters.toHal(repr);

            fs.writeFileSync(`./_videos/hal/${videoId}.json`, JSON.stringify(hal, null, 4) + "\n");
        });
    });
}
