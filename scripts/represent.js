var fs = require('fs');
var util = require('util')
var Representor = require('representor').Representor;

fs.readdir('./_data/videos', function (errors, filenames) {
    filenames.forEach(function (filename) {
        fs.readFile(`./_data/videos/${filename}`, function (readError, content) {
            var videoId = filename.split('.')[0];
            var rawVideo = JSON.parse(content.toString());
            var repr = new Representor();

            var rootProps = ['name', 'description', 'duration', 'width', 'language', 'height', 'embed', 'created_time', 'modified_time', 'release_time', 'license'];
            var pictureProps = ['active', 'type'];
            var sizeProps = ['width', 'height'];

            repr.links.add({
                rel: 'self',
                href: rawVideo.uri
            })

            // Get root props
            rootProps.forEach(function (prop) {
                repr.attributes[prop] = rawVideo[prop];
            });

            // Embed pictures
            var pictures = repr.embeddeds.add({
                rel: 'http://videos.restfest.org/rels/pictures',
                href: rawVideo.pictures.uri
            });

            pictures.links.add({
                rel: 'self',
                href: rawVideo.pictures.uri
            });

            // Get picture props
            pictureProps.forEach(function (prop) {
                pictures.attributes[prop] = rawVideo.pictures[prop]
            });

            // Add sizes objects
            rawVideo.pictures.sizes.forEach(function (size) {
                var sizeRepr = pictures.embeddeds.add({
                    rel: 'http://videos.restfest.org/rels/size',
                });

                sizeRepr.links.add({
                    rel: 'self',
                    href: size.link
                });

                sizeRepr.links.add({
                    rel: 'http://videos.restfest.org/rels/picture_with_play_button',
                    href: size.link_with_play_button
                });

                sizeProps.forEach(function (prop) {
                    sizeRepr.attributes[prop] = size[prop]
                });
            });

            var hal = adapters.toHal(repr);

            fs.writeFileSync(`./_videos/hal/${videoId}.json`, JSON.stringify(hal, null, 4));
        });
    });
});

var adapters = {
    toHal: function (repr) {
        var hal = {};

        Object.keys(repr.attributes).forEach(function (attribute) {
            hal[attribute] = repr.attributes[attribute];
        });

        repr.links.links.forEach(function (linkRepr) {
            if (!hal._links) { hal._links = {} };
            hal._links[linkRepr.rel] = {
                href: linkRepr.href
            };
        });

        repr.embeddeds.embeddeds.forEach(function (embedRepr) {
            if (!hal._embedded) { hal._embedded = {} };
            hal._embedded[embedRepr.rel] = adapters.toHal(embedRepr);
        });

        return hal;
    }
}
