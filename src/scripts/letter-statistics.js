#!/usr/bin/env node


module.exports = class LetterStatistics {

	constructor() {
		this.words = require('./words.js');
		this.debug = console.log;
	}


	getNeighbourFrequency(letter, position) {

		let left = {};
		let right = {};

		this.words.forEach((word) => {
			let thisChar = word.charAt(position);
			let leftChar = word.charAt(position - 1);
			let rightChar = word.charAt(position + 1);

			if (thisChar == letter)  {
				left[leftChar] = left[leftChar] == undefined ? 1 : left[leftChar] + 1;
				right[rightChar] = right[rightChar] == undefined ? 1 : right[rightChar] + 1;
			}
		});

		let convert = ((map) => {
			let entries = Object.entries(map).sort((A, B) => {
				return B[1] - A[1];
			});
			entries = entries.map((entry) => {
				return entry[0];
			});

			return entries.join('');
	
		});

		return {left:convert(left), right:convert(right)};
	}

	match(pattern) {

		let count = 0;

		this.words.forEach((word) => {
			count += word.match(pattern) != null;
		});

		return Math.floor((100 * count / this.words.length) + 0.5);
	}

	count(pattern) {

		let count = 0;

		this.words.forEach((word) => {

			if (word.match(pattern) != null) {
				console.log(word);
				count++;
	
			}
		});

		return count;
	}



	// Returns a frequency string of all letters
	getLetterFrequency() {

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

	getLetterPositionFrequency(position) {

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



	getFrequency() {

		let stats = {};
		let freq = this.getLetterFrequency();

		stats.alphabet = freq;
		stats.vouls = freq.replace(/[BCDFGHJKLMNPQRSTVWXZ]/g, "");
		stats.consonants = freq.replace(/[EYUIOA]/g, "");

		stats.position = [];

		for (var i = 0; i < this.words[0].length; i++) {
			let freq = this.getLetterPositionFrequency(i);

			stats.position[i] = {
				alphabet: freq,
				vouls: freq.replace(/[BCDFGHJKLMNPQRSTVWXZ]/g, ""),
				consonants: freq.replace(/[EYUIOA]/g, "")
			};
		}

		return stats;

	}


}

