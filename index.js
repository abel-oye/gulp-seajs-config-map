"use strict";
var crypto = require("crypto");
var path = require("path");
var gutil = require("gulp-util");
var file = require("vinyl-file");
var through = require("through2");
var fs = require("fs");

function md5(str) {
	return crypto
		.createHash("md5")
		.update(str)
		.digest("hex");
}

function getNewConfig(opts, cb) {
	file.read(opts.path, opts, function(err, file) {
		if (err) {
			// not found
			if (err.code === "ENOENT") {
				cb(null, new gutil.File(opts));
			} else {
				cb(err);
			}

			return;
		}

		cb(null, file);
	});
}

var plugin = function(options) {
	options = Object.assign({ base: "./", configFile: "js/seajs-config.js" }, options) 

	return through.obj(function(file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(
				new gutil.PluginError(
					"gulp-seajs-rev",
					"Streaming not supported"
				)
			);
			return;
		}
		var seajsConfigPath = path.join(options.base, options.configFile);

		var manifest = JSON.parse(file.contents);

		var jsManifest = [];

		for (var fileName in manifest) {
			//if (fileName.endsWith('.js')) {
			jsManifest.push([fileName, manifest[fileName]]);
			//}
		}

		var configString =
			";seajs.config({ map:" + JSON.stringify(jsManifest) + "});\n";
		var seajsConfig = fs.readFileSync(seajsConfigPath, "utf-8");
		seajsConfig += configString;

		var hash = md5(seajsConfig).slice(0, 8);
		var ext = path.extname(seajsConfigPath);
		//var filename = path.basename(seajsConfigPath, ext) + '-' + hash + ext;
		var filename = manifest[options.configFile] || path.basename(seajsConfigPath, ext) + ext;

		var opts = {
			path: filename,
			merge: false
		};

		getNewConfig(
			opts,
			function(err, newfile) {
				if (err) {
					cb(err);
					return;
				}
				newfile.contents = new Buffer(seajsConfig);
				this.push(newfile);
				cb();
			}.bind(this)
		);
	});
};

module.exports = plugin;
