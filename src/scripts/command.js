var yargs = require('yargs');


module.exports = class Command {

    constructor(options) {
        var {command, description} = options;

        this.command = command;
        this.description = description;
        this.debug = () => {};
		this.log = console.log;
		this.argv = {};

		var config = {};

		config.command = this.command;
		config.builder = this.options.bind(this);
		config.desc    = this.description;

		config.handler = async (argv) => {
			try {
				this.argv = argv;
				this.debug = typeof argv.debug === 'function' ? argv.debug : (argv.debug ? console.log : () => {});
	
				await this.run();
			}
			catch(error) {
				if (this.argv.debug)
					console.log(error);
				else	
					console.log(error.message);

			}
		}

		yargs.command(config);

    }

    options(yargs) {
        yargs.usage(`Usage: $0 ${this.command}`);
        yargs.option('debug', {describe: 'Debug mode', type:'boolean', default:true});
    }

    async run() {
    }

};



