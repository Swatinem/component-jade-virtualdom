/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var fs = require('fs');
var path = require('path');
var jadeV = require('require-cwd')('jade-virtualdom');

module.exports = function (builder) {
	builder.hook('before scripts', function (pkg, fn) {
		if (!pkg.root || !pkg.config.templates)
			return fn();
		var files = pkg.config.templates.filter(filterJade);
		files.forEach(function (file) {
			var fullPath = pkg.path(file);
			try {
				var contents = fs.readFileSync(fullPath, 'utf8');
				var jadeFn = jadeV(contents, {
					filename: fullPath
				});
				contents = 'module.exports = ' + jadeFn.toString();
				pkg.removeFile('templates', file);
				file = file.slice(0, file.length - 5) + '.js';
				pkg.addFile('scripts', file, contents);
			} catch (e) {}
		});
		fn();
	});
};

function filterJade(filename) {
	return path.extname(filename) === '.jade';
}

