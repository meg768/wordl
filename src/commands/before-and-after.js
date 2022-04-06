#!/usr/bin/env node

const Command = require('../scripts/command.js');

module.exports = class extends Command {

    constructor(options) {

        super({command: 'bna [options]', description: 'Displays the most frequent letters before and after each letter', ...options}); 

		this.words = require('../scripts/words.js');
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	}

    options(yargs) {
        super.options(yargs);
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

	async run() {

		let map = this.process(this.words);

		this.alphabet.split('').forEach((letter) => {
			let before = map.before[letter] || '';
			let after = map.after[letter] || '';
			this.log(`${letter}: ${before || '-'}`);
			this.log(`   ${after || '-'}`);
			this.log(``);
		});
	}
};

