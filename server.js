var fs = require('fs');
var csv = require('fast-csv');

var invalid_file = fs.createWriteStream(__dirname + '/invalidUrls.txt', { flags: 'w'} );
var valid_file = fs.createWriteStream(__dirname + '/validUrls.txt', { flags: 'w'} );

var REGEX_EMAIL = /^(mailto:)?([a-z\d\[\]])([\w\-\.\+\]\[]*)@([\w\.\-\]\[]+)\.[\w\-\]\[\.]{2,}$/i;
var REGEX_URL_EMAIL = /(^(mailto:)?([a-z\d\[\]])([\w\-\.\+\]\[]*)@([\w\.\-\]\[]+)\.[\w\-\]\[\.]{2,}$)|(^((https?|ftp):\/\/)?(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+\])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$)/i;
var REGEX_URL = /^((https?|ftp):\/\/)?(?:[^:@]+(?::[^@]+)?@)?(?:[^\s:/?#]+|\[[a-f\d:]+\])(?::\d+)?(?:\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/i;

csv
    .fromPath(__dirname + '/links.csv')
    .on("data", function(data){
        if(data[0]) {
            var result = REGEX_URL_EMAIL.test(data[0].trim());
            if (!result) {
                console.error(data[0]);
            } else {
                console.log(data[0]);
            }
        }
    })
    .on('end', function() {
        valid_file.end();
        invalid_file.end();
    });

console.log = function(url) {
    valid_file.write(url + '\n');
};

console.error = function(url) { //
    invalid_file.write(url + '\n');
    process.stderr.write(url + '\n');
};