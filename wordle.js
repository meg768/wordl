#!/usr/bin/env node


class App {


    addCommand(options) {

    }

	run() {


		try {
			var yargs = require('yargs');

			yargs.scriptName('wordle');
			yargs.usage('Usage: $0 <command>');

            this.addCommand({
                name: 'Foo',
                module: './commands/test.js',
                options: {
                    'letters':{alias:'w', describe:'Only use the specified set of letters (default is the entire alphabet)', type:'string', default:undefined}
                }
            }); 
			new (require('./src/commands/words.js'))();
			new (require('./src/commands/lookup.js'))();
			new (require('./src/commands/startup.js'))();
			new (require('./src/commands/start.js'))();
			new (require('./src/commands/stats.js'))();
			new (require('./src/commands/nabo.js'))();
//			new (require('./src/commands/test.js'))();

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
