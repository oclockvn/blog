var fs = require('fs');
var marked = require('marked');
var showdown = require('showdown');
var converter = new showdown.Converter();

fs.readFile('./responsive-menu-css.md', 'utf8', function(err, content){
    if (err) {
        console.log('read file error', err);
        return;
    }

    var html = marked(content);
    // var html = converter.makeHtml(content);

    console.log('writing file');
    fs.writeFile('./responsive-menu-css.html', html, function(werr){
        if (werr) {
            console.log('write file error', werr);
        } else {
            console.log('write file successful');
        }
    });
});