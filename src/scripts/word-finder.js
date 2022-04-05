#!/usr/bin/env node

let LetterStatistics = require('./letter-statistics.js');

module.exports = class WordFinder {

	constructor() {
		this.sprintf = require('yow/sprintf');
		this.words = require('./words.js');
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.stats = new LetterStatistics();
		this.debug = console.log;
	}


	findWords() {

		let rankWord = (word) => {
			let rank = 0;

			for (var i = 0; i < word.length; i++) {
				let letter = word.charAt(i);
	
				rank += this.stats.frequency.alphabet.indexOf(letter);
				rank += 1000 * this.stats.frequency.position[i].alphabet.indexOf(letter);
			}
	
			return 100000 - rank;
		}

		let replace = (word, search, replace) => {
			let regexp = new RegExp('[' + search + ']', 'g');
			return word.replace(regexp, replace) ;
		}

		let isWordInAlphabet = (word, alphabet) => {

			var regexp = new RegExp('[' + alphabet + ']' + '', 'g')
			var match = word.match(regexp);
	
			return match != null && match.length == word.length;
		}		

		// Filter out words with unique characters
		let words = this.words.filter((word) => {
			return word.match(/(?=^[A-Z]+$)(.)+.*\1.*/g) == null;
		});

		// Sort the words according to rank
		words.sort((A, B) => {
			return rankWord(B) - rankWord(A);
		});	


		let result = {};

		result.wordA = {rank:0};
		result.wordB = {rank:0};
		result.wordC = {rank:0};

		let frequencyAlphabet = this.stats.frequency.vouls.slice(0, 4) + this.stats.frequency.consonants.slice(0, 6);

		for (let i = 0; i < words.length; i++) {
			let wordA = words[i];
			let alphabet = frequencyAlphabet;

			if (isWordInAlphabet(wordA, alphabet)) {
				alphabet = replace(alphabet, wordA, '');

				for (let ii = i+1; ii < words.length; ii++) {
					let wordB = words[ii];				
	
					if (isWordInAlphabet(wordB, alphabet)) {

						let rank = rankWord(wordA) + rankWord(wordB);

						if (rank > result.wordA.rank + result.wordB.rank) {
							result.wordA = {word:wordA, rank:rankWord(wordA)};
							result.wordB = {word:wordB, rank:rankWord(wordB)};
							//this.debug(`Found combination ${result.wordA.word}, ${result.wordB.word} with ranking ${result.wordA.rank + result.wordB.rank}`);


						}
					}
				}	
			}
		}

		for (let i = 0; i < words.length; i++) {
			let wordC = words[i];
			let alphabet = this.alphabet;

			alphabet = replace(alphabet, result.wordA.word, '');
			alphabet = replace(alphabet, result.wordB.word, '');

			if (isWordInAlphabet(wordC, alphabet)) {
				let rank = rankWord(wordC);

				if (rank > result.wordC.rank) {
					result.wordC = {word:wordC, rank:rankWord(wordC)};
					this.debug(`Found optimal combination ${result.wordA.word}, ${result.wordB.word}, ${result.wordC.word}`);

				}
			}
		}

		return [result.wordA.word, result.wordB.word, result.wordC.word];
	}

}

