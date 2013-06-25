#!/usr/bin/env node

var fs = require('fs');

var sys = require('sys');
var exec = require('child_process').exec;
var Git = require('git-wrapper');


exports.execute = function(version, message) {
    message = message || 'Bump version';

    if(!version) return console.error('No version provided!');

    bumpVersion(version);

    var git = new Git();
    git.exec('commit', {}, ['-a', '-m "' + message + '"'], function(err, msg) {
        if(err) return console.error('commit failed', err);

        git.exec('tag', {}, ['v' + version], function(err, msg) {
            if(err) return console.error('tagging failed', err);
        });
    });
};

function bumpVersion(version) {
    var data = JSON.parse(fs.readFileSync('package.json'));

    data.version = version;

    fs.writeFileSync('package.json', JSON.stringify(data, null, 2));
}
