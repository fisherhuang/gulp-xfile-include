const through = require("through2"),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    htmlmin = require('html-minifier');

module.exports = (options) => {
    var regexes = [{
            type: 'html',
            rule: new RegExp('<%import\s*((\S|/|.*)+.html)\s*(%>)', "g"),
            transform: function(contents) {
                return htmlmin.minify(contents.toString(), {
                    collapseWhitespace: true,
                    quoteCharacter: "'"
                })
            }
        },
        {
            type: 'js',
            rule: new RegExp('//#\s*include\s*((\S|/|.*)+.js)\s*', "g"),
            transform: null
        }
    ];

    return through.obj({ objectMode: true }, (file, enc, cb) => {
        if (file.isNull()) {
            return;
        }

        if (!file.isBuffer())
            return;

        let contents = file.contents.toString();

        if (!!options) {
            regexes = _.merge(_.keyBy(regexes, 'type'), _.keyBy(options, 'type')); //_.unionBy(regexes, options, 'type');
        }

        _.each(regexes, function(regex, index) {
            while (matches = regex.rule.exec(contents)) {
                var _path = matches[1].trim();
                try {
                    let dirname = path.dirname(file.path);
                    if (options && options.path) {
                        dirname = options.path;
                    }

                    let _fileContent = fs.readFileSync(path.resolve(dirname, _path), "utf-8");

                    if (!!regex.transform) {
                        contents = contents.replace(matches[0], regex.transform(_fileContent));
                    } else {
                        contents = contents.replace(matches[0], _fileContent.toString());
                    }
                } catch (ex) {
                    console.warn(ex);
                }
            }
            file.contents = new Buffer(contents.toString());
        });

        cb(null, file)
    });
};