
const Command = require('../scripts/command.js');

module.exports = class extends Command {

    constructor(options) {

        super({command: 'check <word>', description: 'Checks if word exists', ...options}); 


	}

    options(yargs) {
        super.options(yargs);
		yargs.option('word',   {word:'Word to check', type: 'strig', default:undefined});
    }


	async run() {

		if (typeof(this.argv.word) != 'string')
			throw new Error('A word must be specified.');

		let words = require('../scripts/words.js');
		let word  = this.argv.word.toUpperCase();

		if (words.indexOf(word) >= 0)
			this.log(`The word ${word} exists.`);
		else
			this.log(`The word ${word} does not exists.`);

	}

};



