const LetterStatistics = require('../scripts/letter-statistics.js');
const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');

module.exports = class extends Command {

    constructor(options) {

        super({command: 'stats [options]', description: 'Displays letter frequency', ...options}); 


	}

    options(yargs) {
        super.options(yargs);
    }

	filter(words, pattern) {

		let result = [];

		words.forEach((word) => {

			if (word.match(pattern) != null) {
				result.push(word);
	
			}
		});

		return count;
	}



	async run() {

		let stats = new LetterStatistics();
		let array = [];


		for (let i = 0; i < 5; i++) {
			array.push({position:i+1, frequency:stats.getLetterPositionFrequency(i)});

		}

		array.push({position:'Summary', frequency:stats.getLetterFrequency()});

		var table = new EasyTable();

		array.forEach(function(item) {
			table.cell('Position', item.position);
			table.cell('Frequency', item.frequency);
			table.newRow();
		})

		table.sort(['Letter', 'Position']);
		this.log(table.toString());		

		/*
		let words = stats.words;


		words = words.filter((word) => {
			return word.match(/(?=.*S)(?=.*E)(?=.*A)/) != null;
		});
		words = words.filter((word) => {
			return word.match(/[HTDPK]/) == null;
		});

		words = words.filter((word) => {
			return word.match(/..A../) != null;
		});


		console.log(words);
		console.log(words.length);

		*/
/*		this.log(`The most frequent letters in Wordle are:`);

		this.log('');

		this.log(`The most frequent letters in each position are:`);

		for (let i = 0; i < 5; i++) {
			this.log(`${i+1}: ${stats.frequency.position[i].alphabet}`);
		}
*/		
		/*
		this.log();

		this.log(`Ord som börjar och slutar med konsonant: ${stats.match(/^[BCDFGHJKLMNPQRSTVWXZ].*[BCDFGHJKLMNPQRSTVWXZ]$/g)}%`);
		this.log(`Ord som börjar och slutar med vokal: ${stats.match(/^[EYUIOA].*[EYUIOA]$/g)}%`);
		this.log(`Ord med varannan konsonant/vokal: ${stats.match(/^[BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ]$/g)}%`);

		this.log(`Ord med varannan vokal/konsonant: ${stats.match(/^[EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA]$/g)}%`);

		this.log(`Ord som innehåller två vokaler i följd: ${stats.match(/[EYUIOA][EYUIOA]/g)}%`);

		this.log(`CXXXC: ${stats.match(/^[^EYUIOA].*[^EYUIOA]$/g)}%`);
		this.log(`CVCVC: ${stats.match(/^[^EYUIOA][EYUIOA][^EYUIOA][EYUIOA][^EYUIOA]$/g)}%`);
		this.log(`CVVCC: ${stats.match(/^[^EYUIOA][EYUIOA][EYUIOA][^EYUIOA][^EYUIOA]$/g)}%`);
		this.log(`V••••: ${stats.match(/^[EYUIOA].*$/g)}%`);
		*/

	}

};



