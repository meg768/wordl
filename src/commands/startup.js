const WordFinder = require('../scripts/word-finder.js');
const Command = require('../scripts/command.js');

module.exports = class extends Command {

    constructor() {

        super({command: 'startup [options]', description: 'Finds out good starting words'}); 


	}

    options(yargs) {
        super.options(yargs);
    }

	async run() {


		let finder = new WordFinder();
		let words = finder.findWords();

		this.log(`The best starting words are ${words[0]} and ${words[1]}. Then perhaps use ${words[2]}.`);		
	}

};



