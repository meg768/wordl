#!/usr/bin/env node


class App {

	run() {

		try {
			var yargs = require('yargs');

			yargs.scriptName('wordle');
			yargs.usage('Usage: $0 <command>');

			new (require('./src/commands/lookup.js'))();
			new (require('./src/commands/startup.js'))();
			new (require('./src/commands/stats.js'))();
			new (require('./src/commands/nabo.js'))();
//			new (require('./src/commands/find.js'))();
			new (require('./src/commands/words.js'))();

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
