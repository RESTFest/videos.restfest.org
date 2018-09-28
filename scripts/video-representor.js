const Representor = require('representor').Representor;

function build({
                   rawVideo,
                   rootProps = ['name', 'description', 'duration', 'width', 'language', 'height', 'embed', 'created_time', 'modified_time', 'release_time', 'license'],
                   sizeProps = ['width', 'height']
               }) {
    const repr = new Representor();

    repr.links.add({
        rel: 'self',
        href: rawVideo.uri
    });

    // Get root props
    rootProps.forEach(function (prop) {
        repr.attributes[prop] = rawVideo[prop];
    });

    // We'll treat each size as its own picture
    rawVideo.pictures.sizes.forEach(function (size) {
        const picRepr = repr.embeddeds.add({
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

    return repr;
}

module.exports = build;
