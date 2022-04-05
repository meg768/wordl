#!/usr/bin/env node


class App {

	constructor() {
	}

	run() {

		try {
			var fs = require('fs');
			var path = require('path');
			var yargs = require('yargs');
			var folder = path.join(__dirname, './src/commands');

			yargs.scriptName('wordle');
			yargs.usage('Usage: $0 <command>');

			fs.readdirSync(folder).forEach((file) => {
	
				var fileName = path.join(folder, file);
	
				if (fileName.match("^.*\.js$")) {
					var Command = require(fileName);
					new Command(); 
				}
			});

			yargs.help();
			yargs.wrap(null);

			yargs.check(function() {
				return true;
			});

			yargs.demand(1);
			yargs.argv;

		}
		catch(error) {
			console.error(error);
		}

	};

};


var app = new App();
app.run();
