const WordFinder = require('../scripts/word-finder.js');
const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');

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

		let data = {
			'First word': words[0],
			'Second word': words[1],
			'Optional third word': words[2]
		};

		this.log(EasyTable.print(data));
	}

};



