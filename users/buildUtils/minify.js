const { readdir, lstatSync, readFile, writeFile } = require("fs");
const { join, extname, resolve } = require("path");
const { minify } = require("uglify-js");

const directoryPath = resolve("./build");

function minifyFiles(dir) {
	readdir(dir, (err, files) => {
		if (err) {
			return console.log("Unable to scan directory: " + err);
		}

		files.forEach((file) => {
			const filePath = join(dir, file);
			if (lstatSync(filePath).isDirectory()) {
				minifyFiles(filePath);
			} else if (extname(filePath) === ".js") {
				readFile(filePath, "utf8", (err, data) => {
					if (err) {
						return console.log("Unable to read file: " + err);
					}
					const result = minify(data);
					if (result.error) {
						return console.log("Error minifying file: " + result.error);
					}
					writeFile(filePath, result.code, (err) => {
						if (err) {
							return console.log("Unable to write file: " + err);
						}
						console.log(`Successfully minified ${filePath}`);
					});
				});
			}
		});
	});
}

minifyFiles(directoryPath);
