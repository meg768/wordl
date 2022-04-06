#!/usr/bin/env node

const LetterStatistics = require('../scripts/letter-statistics.js');
const Command = require('../scripts/command.js');

module.exports = class extends Command {

    constructor() {

        super({command: 'lf [options]', description: 'Displays the most frequent letters used in Wordle'}); 

		this.words = require('../scripts/words.js');
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	}

    options(yargs) {
        super.options(yargs);
		yargs.option('position', {alias: 'p', describe:'Displays letter freqency by position (1-5)', type:'boolean', default:undefined});
		yargs.option('before', {alias: 'b', describe:'Displays letter freqency before specified letter', type:'string', default:undefined});
		yargs.option('after', {alias: 'a', describe:'Displays letter freqency after specified letter', type:'string', default:undefined});

		yargs.check((argv, option) => {

			return true;
		});


    }

	// Returns a string containing the most common letters
	buildFrequencyString(map) {

		let result = '';
		let array = [];

		this.alphabet.split('').forEach((letter) => {
			if (map[letter] != undefined)
				array.push({letter:letter, count:map[letter]});
		});

		// Sort according to occurance
		array.sort((A, B) => {
			return B.count - A.count;
		});

		array.forEach((entry) => {
			if (map[entry.letter] != undefined) {
//				result += `${entry.letter}(${entry.count})`;
				result += `${entry.letter}`;
			}
		});

		return result;

	}

	buildFrequencyStringMap(map) {

		let result = {};
		
		this.alphabet.split('').forEach((letter) => {
			if (map[letter] != undefined)
				result[letter] = this.buildFrequencyString(map[letter]);
		});

		return result;
	}

	process(words) {

		let before = {};
		let after = {};

		// insert into letter map
		let insert = (map, letter, char) => {
			if (map[letter] == undefined)
				map[letter] = {};

			if (map[letter][char] == undefined)
				map[letter][char] = 0;

			map[letter][char]++;
		}

		words.forEach((word) => {
			for (let i = 0; i < word.length; i++) {
				let letter = word.charAt(i);
				insert(before, letter, word.charAt(i-1));
				insert(after, letter, word.charAt(i+1));
			}
		});

		return {before:this.buildFrequencyStringMap(before), after:this.buildFrequencyStringMap(after)};

	}

	//display0
	async run() {
		let stats = new LetterStatistics();
		let map = this.process(this.words);

		if (this.argv.position) {
			for (let i = 0; i < 5; i++) {
				this.log(`${i+1}: ${stats.frequency.position[i].alphabet}`);
			}
		}
		else if (this.argv.before) {

			if (this.argv.before == undefined) {
				this.alphabet.split('').forEach((letter) => {
					this.log(`${letter}: ${map.before[letter] || ''}`);
				});
			}
			else {
				this.log(`${map.before[this.argv.before.toUpperCase()] || ''}`);

			}
		}
		else if (this.argv.after) {

			if (this.argv.after == '') {
				this.alphabet.split('').forEach((letter) => {
					this.log(`${letter}: ${map.after[letter] || ''}`);
				});
			}
			else {
				this.log(`${map.after[this.argv.after.toUpperCase()] || ''}`);

			}

		}
		else {
			this.log(`${stats.frequency.alphabet}`);

		}

	}
};

