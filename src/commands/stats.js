const LetterStatistics = require('../scripts/letter-statistics.js');
const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');

module.exports = class extends Command {

    constructor(options) {

        super({command: 'stats', description: 'Displays word statistics', ...options}); 

		this.words = require('../scripts/words.js');
		this.output = [];
	}

    options(yargs) {
        super.options(yargs);
    }



	match(pattern) {

		let count = 0;

		this.words.forEach((word) => {
			count += word.match(pattern) != null;
		});

		return Math.floor((100 * count / this.words.length) + 0.5);
	}



	print(key, value) {
		if (arguments.length > 0) {
			this.output.push({key:key, value:value});
		}
		else {
			let table = new EasyTable();

			this.output.forEach(function(item) {
				table.cell('Description', item.key);
				table.cell('Value', item.value);
				table.newRow();
			})
	
			this.log(table.toString());		
	
		}


	}

	async run() {

		let stats = new LetterStatistics();

		this.print('Most common letters', stats.getLetterFrequency());

		for (let i = 0; i < 5; i++) {
			this.print(`Most common letters in position ${i+1}`, stats.getLetterPositionFrequency(i));
		}

		this.print(`Matches CVCVC`, `${this.match(/^[^EYUIOA][EYUIOA][^EYUIOA][EYUIOA][^EYUIOA]$/g)}%`);
		this.print(`Matches VCVCV`, `${this.match(/^[EYUIOA][^EYUIOA][EYUIOA][^EYUIOA][EYUIOA]$/g)}%`);
		this.print(`Matches CVVCC`, `${this.match(/^[^EYUIOA][EYUIOA][EYUIOA][^EYUIOA][^EYUIOA]$/g)}%`);
		this.print(`Matches C••••`, `${this.match(/^[^EYUIOA].*$/g)}%`);
		this.print(`Matches C•••C`, `${this.match(/^[^EYUIOA].*[^EYUIOA]$/g)}%`);
		this.print(`Matches V••••`, `${this.match(/^[EYUIOA].*$/g)}%`);
		this.print(`Matches V•••V`, `${this.match(/^[EYUIOA].*[EYUIOA]$/g)}%`);

		this.print();
	}
};



