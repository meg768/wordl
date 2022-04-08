#!/usr/bin/env node


const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');
const LetterStatistics = require('../scripts/letter-statistics.js');
const isArray = require('yow/isArray');

module.exports = class extends Command {

    constructor() {

        super({command: 'words [options]', description: 'Filter Wordle words'}); 

		this.words = require('../scripts/words.js');
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.frequency = this.getLetterFrequency();

		this.positionFrequency = [
			this.getLetterPositionFrequency(0),
			this.getLetterPositionFrequency(1),
			this.getLetterPositionFrequency(2),
			this.getLetterPositionFrequency(3),
			this.getLetterPositionFrequency(4)
		];

	}

    options(yargs) {
        super.options(yargs);
		yargs.option('letters', {describe:'Only use the specified set of letters (default is the entire alphabet)', type:'string', default:undefined});
		yargs.option('omit', {describe:'Omit specified letters in result', type:'string', default:''});
		yargs.option('contains', {describe:'The words must contain all these letters, including duplicates', type:'string', default:undefined});
		yargs.option('limit', {describe:'Limit the number of words displayed', type:'number', default:20});
		yargs.option('sort', {describe:'Sort output by column', type:'string', default:undefined});
		yargs.option('unique', {describe:'Only show words with unique set of letters', type:'boolean', default:false});
		yargs.option('filter', {describe:'Filter using regular expression', type:'string', default:undefined});
    }


	getLetterFrequency() {

		var map = {};
		var count = 0;

		this.alphabet.split('').forEach((letter) => {
			map[letter] = 0;
		});

		this.words.forEach((word) => {

			for (var i = 0; i < word.length; i++) {
				var letter = word.charAt(i);

				map[letter]++;
				count++;
			}
		});

		this.alphabet.split('').forEach((letter) => {
			map[letter] = map[letter] / count;
		});

		return map;
	}

	getLetterPositionFrequency(position) {

		var map = {};
		var count = 0;

		this.alphabet.split('').forEach((letter) => {
			map[letter] = 0;
		});

		this.words.forEach((word) => {

			var letter = word.charAt(position);

			map[letter]++;
			count++;
		});

		this.alphabet.split('').forEach((letter) => {
			map[letter] = map[letter] / count;
		});

		return map;
	}

	rankWord(word)  {

		let rank = 0;
		let count = 0;

		for (var i = 0; i < word.length; i++) {
			let letter = word.charAt(i);

			count++;
			rank += this.frequency[letter];
		}

		return Math.floor(1000 * rank / count);
	}

	rankWordByPosition(word)  {

		let rank = 0;
		let count = 0;

		for (var i = 0; i < word.length; i++) {
			let letter = word.charAt(i);

			count++;
			rank += this.positionFrequency[i][letter];
		}

		return Math.floor(1000 * rank / count);
	}

	isWordInAlphabet(word, alphabet) {

		var regexp = new RegExp('[' + alphabet + ']' + '', 'g')
		var match = word.match(regexp);

		return match != null && match.length == word.length;
	}	

	removeWordFromAlphabet = (word, alphabet) => {
		let regexp = new RegExp('[' + word + ']', 'g');
		return alphabet.replace(regexp, '') ;
	}

	async run() {
		let words = this.words;
		let array = [];

		let alphabet = (this.argv.letters || this.alphabet).toUpperCase();

		if (this.argv.omit) {
			let omit = isArray(this.argv.omit) ? this.argv.omit : [this.argv.omit];

			omit.forEach((word) => {
				alphabet = this.removeWordFromAlphabet(word.toUpperCase(), alphabet);

			});
		}

		if (this.argv.filter) {
			let filter = isArray(this.argv.filter) ? this.argv.filter : [this.argv.filter];

			filter.forEach((regexp) => {
				words = words.filter((word) => {
					return word.match(regexp) != null;
				});
			});

		}

		// Filter out words with unique characters
		if (this.argv.unique) {
			words = words.filter((word) => {
				return word.match(/(?=^[A-Z]+$)(.)+.*\1.*/g) == null;
			});
		}

		// Contains all letters 
		if (this.argv.contains) {
			words = words.filter((word) => {
				word = word.split('');

				let letters = this.argv.contains.split('');
				let count = 0;

				letters.forEach((letter) => {
					let index = word.indexOf(letter);

					if (index >= 0) {
						word.splice(index, 1);
						count++;
					}
				});

				return count == letters.length;;
			});
		}
		
		words.forEach((word) => {
			if (this.isWordInAlphabet(word, alphabet)) {
				array.push({word:word, rankA:this.rankWord(word), rankB:this.rankWordByPosition(word)});
			}
		});

		array.sort((A, B) => {
			return (B.rankA - A.rankA) * 1000 + (B.rankB - A.rankB);
		});

		let allItems = array.length;

		if (this.argv.limit) {
			array = array.slice(0, this.argv.limit);
		}

		if (this.argv.json) {
			this.log(JSON.stringify(array, null, '    '));
		}
		else {
			let displayedItems = array.length;

			if (array.length > 0) {
				let table = new EasyTable();
	
				array.forEach(function(item) {
					table.cell('Word', item.word);
					table.cell('Rank A', item.rankA, EasyTable.leftPadder(' '));
					table.cell('Rank B', item.rankB, EasyTable.leftPadder(' '));
					table.newRow();
				})
	
				if (this.argv.sort) {
					let sort = isArray(this.argv.sort) ? this.argv.sort : [this.argv.sort]; 
					table.sort(sort);
				}
		
				this.log(table.toString());
	
				this.log(`Displayed ${displayedItems} out of ${allItems} rows.`);
			
			}
		
	
		}


	}
};

