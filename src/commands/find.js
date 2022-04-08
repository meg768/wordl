#!/usr/bin/env node


const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');
const LetterStatistics = require('../scripts/letter-statistics.js');
const isArray = require('yow/isArray');

module.exports = class extends Command {

    constructor() {

		let stats = new LetterStatistics();

        super({command: 'find [options]', description: 'Find word'}); 

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
		yargs.option('letters', {describe:'Specifies start letters (default is the entire alphabet)', type:'string', default:undefined});
		yargs.option('omit', {describe:'Omit specified letters in result', type:'string', default:''});
		yargs.option('limit', {describe:'', type:'number', default:30});
		yargs.option('unique', {describe:'Only show words with unique letters', type:'boolean', default:true});
		yargs.option('filter', {describe:'Filter using RegExp', type:'string', default:undefined});
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

/*
		if (this.argv.filter) {
			let filter = isArray(this.argv.filter) ? this.argv.filter : [this.argv.filter];

			filter.forEach((word) => {
				alphabet = this.removeWordFromAlphabet(word.toUpperCase(), alphabet);

			});

		}

*/
		// Filter out words with unique characters
		if (this.argv.unique) {
			words = this.words.filter((word) => {
				return word.match(/(?=^[A-Z]+$)(.)+.*\1.*/g) == null;
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

		let displayedItems = array.length;

		if (array.length > 0) {
			let table = new EasyTable();

			array.forEach(function(item) {
				table.cell('Word', item.word);
				table.cell('Rank A', item.rankA, EasyTable.leftPadder(' '));
				table.cell('Rank B', item.rankB, EasyTable.leftPadder(' '));
				table.newRow();
			})
	
			this.log(table.toString());

			if (displayedItems < allItems) {
				this.log(`Displayed ${displayedItems} out of ${allItems} rows.`);
			}
		
		}
	


	}
};

