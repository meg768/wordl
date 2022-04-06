

const Command = require('../scripts/command.js');

module.exports = class extends Command {

    constructor() {
        super({command: 'lookup <word>', description: 'Checks if word exists'}); 
	}

    options(yargs) {
        super.options(yargs);
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



