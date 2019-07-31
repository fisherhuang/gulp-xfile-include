var include = require("../");
var gulp = require('gulp');
var path = require('path');

var fixtures = function(glob) { return path.join(__dirname, 'fixtures', glob); }

describe('include', (done) => {
    gulp.src(fixtures('main.js'), { allowEmpty: true })
        .pipe(include([{
            type: 'css',
            rule: new RegExp('//#\s*include\s*((\S|/|.*)+.css)\s*', "g")
        }]))

})