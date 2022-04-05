
module.exports = class Command {

    constructor(options) {
        var {command, description} = options;

        this.command = command;
        this.description = description;
        this.debug = () => {};

        this.builder = (yargs) => {
            this.options(yargs);
        };

        this.handler = async (argv) => {
			try {
				this.argv = argv;
				this.debug = typeof argv.debug === 'function' ? argv.debug : (argv.debug ? console.log : () => {});
				this.log = console.log;
	
				await this.run();
	
			}
			catch(error) {
				if (this.argv.debug)
					console.log(error);
				else	
					console.log(error.message);

			}
        };
    }

    options(yargs) {
        yargs.usage(`Usage: $0 ${this.command}`);
        yargs.option('debug', {describe: 'Debug mode', type:'boolean', default:true});
    }

    async run() {
    }

};



