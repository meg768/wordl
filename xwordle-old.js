#!/usr/bin/env node


class LetterStatistics {

	constructor() {
		this.sprintf = require('yow/sprintf');
		this.words = require('./src/words.js');
		this.frequency = this.getFrequency();
		this.debug = console.log;
	}

	match(pattern) {

		let count = 0;

		this.words.forEach((word) => {
			count += word.match(pattern) != null;
		});

		return Math.floor((100 * count / this.words.length) + 0.5);
	}

	getFrequency() {


		var getLetterFrequency = () => {

			var array = [];

			this.words.forEach((word) => {

				for (var i = 0; i < word.length; i++) {
					var letter = word.charAt(i);
					var index = word.charCodeAt(i) - "A".charCodeAt(0);

					if (array[index] == undefined) {
						array[index] = {letter:letter, count:1}
					}
					else {
						array[index].count++;
					}
				}
			});

			array = array.sort((A, B) => {
				return B.count - A.count;

			});

			array = array.map((entry) => {
				return entry.letter;
			});

			return array.join('');
		}

		var getLetterPositionFrequency = (position) => {

			var array = [];

			this.words.forEach((word) => {

				var letter = word.charAt(position);
				var index = word.charCodeAt(position) - "A".charCodeAt(0);

				if (array[index] == undefined) {
					array[index] = {letter:letter, count:1}
				}
				else {
					array[index].count++;
				}
			});

			array = array.sort((A, B) => {
				return B.count - A.count;

			});

			array = array.map((entry) => {
				return entry.letter;
			});

			return array.join('');
		}

		let stats = {};
		let freq = getLetterFrequency();

		stats.alphabet = freq;
		stats.vouls = freq.replace(/[BCDFGHJKLMNPQRSTVWXZ]/g, "");
		stats.consonants = freq.replace(/[EYUIOA]/g, "");

		stats.position = [];

		for (var i = 0; i < this.words[0].length; i++) {
			let freq = getLetterPositionFrequency(i);

			stats.position[i] = {
				alphabet: freq,
				vouls: freq.replace(/[BCDFGHJKLMNPQRSTVWXZ]/g, ""),
				consonants: freq.replace(/[EYUIOA]/g, "")
			};
		}

		return stats;

	}


}



class WordFinder {

	constructor() {
		this.sprintf = require('yow/sprintf');
		this.words = require('./src/words.js');
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
					//this.debug(`Found optimal combination ${result.wordA.word}, ${result.wordB.word}, ${result.wordC.word}`);

				}
			}
		}

		return [result.wordA.word, result.wordB.word, result.wordC.word];
	}

}


class App {


	constructor() {
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.words = require('./src/words.js');
		this.debug = console.log;
	}


	run() {
		try {


			let stats = new LetterStatistics();

			console.log(`Vanligast förekommande bokstäver i Wordl är i ordning:`);
			console.log(`${stats.frequency.alphabet}.`);

			console.log('');

			console.log(`Vanligaste bokstäverna i respektive ruta är följande:`);

			for (let i = 0; i < 5; i++) {
				console.log(`${stats.frequency.position[i].alphabet}`);
			}
			
			console.log();

			console.log(`Ord som börjar och slutar med konsonant: ${stats.match(/^[BCDFGHJKLMNPQRSTVWXZ].*[BCDFGHJKLMNPQRSTVWXZ]$/g)}%`);
			console.log(`Ord som börjar och slutar med vokal: ${stats.match(/^[EYUIOA].*[EYUIOA]$/g)}%`);
			console.log(`Ord med varannan konsonant/vokal: ${stats.match(/^[BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ]$/g)}%`);
			console.log(`Ord med varannan vokal/konsonant: ${stats.match(/^[EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA]$/g)}%`);
			console.log(`Ord som innehåller två vokaler i följd: ${stats.match(/[EYUIOA][EYUIOA]/g)}%`);

			console.log();

			let finder = new WordFinder();
			let words = finder.findWords();
			console.log(`De bästa två ord att börja spelet med enligt uppgifterna ovan är ${words[0]} och ${words[1]}. Tredje ordet kan vara ${words[2]}.`);
		}
		catch(error) {
			console.error(error.stack);
		}

	};

};

var app = new App();
app.run();

