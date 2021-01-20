var fs = require('fs');
var Representor = require('representor').Representor;

function adapt (repr) {
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
        result[embed.rel].push(adapt(embed));
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

function indexer (filenames) {
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

    var hal = adapt(repr);

    fs.writeFile('./_videos/hal/index.json', JSON.stringify(hal, null, 4), function () { });
}

module.exports = {
  adapt,
  indexer,
  getOutput: (videoId) => `./_videos/hal/${videoId}.json`
};
