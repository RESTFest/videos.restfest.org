var fs = require('fs');
var Representor = require('representor').Representor;

fs.readdir('./_data/videos', function (errors, filenames) {
    filenames.forEach(function (filename) {
        fs.readFile(`./_data/videos/${filename}`, function (readError, content) {
            var json = JSON.parse(content.toString());
            var repr = new Representor();
            var rootProps = ['name', 'description'];

            rootProps.forEach(function (prop) {
                repr.attributes[prop] = json[prop];
            });

            // handle pictures
            console.log(repr.toValue());
        })
    })
})
