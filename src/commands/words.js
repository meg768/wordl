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
		yargs.option('letters', {alias:'w', describe:'Only use the specified set of letters (default is the entire alphabet)', type:'string', default:undefined});
		yargs.option('omit', {alias:'o', describe:'Omit specified letters in result', type:'string', default:''});
		yargs.option('contains', {alias:'c', describe:'The words must contain all these letters, including duplicates', type:'string', default:undefined});
		yargs.option('limit', {alias:'l', describe:'Limit the number of words displayed', type:'number', default:15});
		yargs.option('pattern', {alias:'p', describe:'In C/V/X format.', type:'string', default:undefined});
		yargs.option('rank', {alias:'r', describe:'Sort output by rank', type:'string', choices:['A', 'B', 'C', 'D'], default:undefined});
		yargs.option('unique', {alias:'u', describe:'Only show words with unique set of letters', type:'boolean', default:false});
		yargs.option('filter', {alias:'f', describe:'Filter using regular expression', type:'string', default:undefined});
    }


	getLetterFrequency() {

		var map = {};
		var max = 0;

		this.alphabet.split('').forEach((letter) => {
			map[letter] = 0;
		});

		this.words.forEach((word) => {

			for (var i = 0; i < word.length; i++) {
				var letter = word.charAt(i);

				map[letter] = map[letter] + 1;

				if (map[letter] > max)
					max = map[letter];
			}
		});

		this.alphabet.split('').forEach((letter) => {
			map[letter] = map[letter] / max;
		});

		return map;
	}

	getLetterPositionFrequency(position) {

		var map = {};
		var max = 0;

		this.alphabet.split('').forEach((letter) => {
			map[letter] = 0;
		});

		this.words.forEach((word) => {

			var letter = word.charAt(position);

			map[letter] = map[letter] + 1;

			if (map[letter] > max)
				max = map[letter];			
		});

		this.alphabet.split('').forEach((letter) => {
			map[letter] = map[letter] / max;
		});

//		console.log(map);
		return map;
	}

	rankWord(word)  {

		let rank = 0;
		let count = 0;

		for (var i = 0; i < word.length; i++, count++) {
			let letter = word.charAt(i);
			rank += this.frequency[letter];
		}

		return Math.floor(rank * 100 / 5 + 0.5);
	}

	rankWordByPosition(word)  {

		let rank = 0;
		let count = 0;

		for (var i = 0; i < word.length; i++, count++) {
			let letter = word.charAt(i);
			rank += this.positionFrequency[i][letter];
		}

		return Math.floor(rank * 100 / count + 0.5);
	}

	rankWordByCombination(word) {
		let rank = 0;
		let count = 0;

		for (var i = 0; i < word.length; i++, count++) {
			let letter = word.charAt(i);
			rank += this.positionFrequency[i][letter] * this.frequency[letter];
		}

		return Math.floor(rank * 100 / count + 0.5);

	}

	async run() {
		let words = this.words;
		let array = [];

		let alphabet = (this.argv.letters || this.alphabet).toUpperCase();

		if (this.argv.omit) {
			let omit = isArray(this.argv.omit) ? this.argv.omit.join('') : this.argv.omit;


			words = words.filter((word) => {
				return word.match(`[${omit.toUpperCase()}]`) == null;
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

		if (this.argv.pattern) {

			let regexp = this.argv.pattern;
			let voul = "[EYUIOA]";
			let consonant = "[^EYUIOA]";

			regexp = regexp.replace(/C/g, consonant);
			regexp = regexp.replace(/V/g, voul);
			regexp = regexp.replace(/X/g, '.');
			regexp = regexp.replace(/_/g, '.'); 
			regexp = regexp.replace(/ /g, '.');
			regexp = regexp.replace(/\?/g, '.');

			regexp = `^${regexp}$`;

			words = words.filter((word) => {
				return word.match(regexp) != null;
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

				let letters = this.argv.contains.toUpperCase().split('');
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
			let isWordInAlphabet = (word, alphabet) => {

				var regexp = new RegExp('[' + alphabet + ']' + '', 'g')
				var match = word.match(regexp);
		
				return match != null && match.length == word.length;
			}	
		
			if (isWordInAlphabet(word, alphabet)) {
				let rankA = this.rankWord(word);
				let rankB = this.rankWordByPosition(word);
				let rankC = this.rankWordByCombination(word);
				let rankD = Math.floor(((rankA + rankB + rankC) / 3 + 0.5));
				array.push({word:word, rankA:rankA, rankB:rankB, rankC:rankC, rankD:rankD});
			}
		});

		if (this.argv.rank) {
			let rank = `rank${this.argv.rank.toUpperCase()}`;

			array.sort((A, B) => {
				return B[rank] - A[rank];
			});

		}
	
		

		let allItems = array.length;

		if (this.argv.limit) {
			array = array.slice(0, this.argv.limit);
		}

		if (this.argv.json) {
			this.log(JSON.stringify(array, null, '\t'));
		}
		else {
			let displayedItems = array.length;

			if (array.length > 0) {
				let table = new EasyTable();
	
				array.forEach(function(item) {
					table.cell('Word', item.word);
					table.cell('Rank A', item.rankA, EasyTable.leftPadder(' '));
					table.cell('Rank B', item.rankB, EasyTable.leftPadder(' '));
					table.cell('Rank C', item.rankC, EasyTable.leftPadder(' '));
					table.cell('Rank D', item.rankD, EasyTable.leftPadder(' '));
					table.newRow();
				})
		
				this.log(table.toString());
	
				this.log(`Displayed ${displayedItems} out of ${allItems} words.`);
			
			}
		
	
		}
	}
};

