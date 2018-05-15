/**
 * Created by zjy on 16-2-16.
 */

//'use strict';
var gutil = require('gulp-util');
var through = require('through2');
//var path = require('path');

const PLUGIN_NAME = 'gulp-url-replace';
module.exports = function (options) {
    var pattern = [];
    var testClose = /\/$/;
    var pp;
    for (pp in options){
        var odir={};
        if(testClose.test(pp)){
            odir.o = new RegExp(pp,'g');
        }
        else{
            odir.o = new RegExp(pp+'/','g');
        }

        if(testClose.test(options[pp])){
            odir.n = options[pp];
        }
        else{
            odir.n = options[pp]+'/';
        }
        pattern.push(odir);
    }

    return through.obj(function (file, enc, cb) { //流/编码/回调

        if(typeof options !== 'object'){
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var content = file.contents.toString();
        pattern.forEach(function (r) {
            content = content.replace(r.o, r.n);
        });
        file.contents = new Buffer(content);


        this.push(file);
        cb();
    });
};
