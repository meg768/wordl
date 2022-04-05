#!/usr/bin/env node


module.exports = class LetterStatistics {

	constructor() {
		this.sprintf = require('yow/sprintf');
		this.words = require('./words.js');
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

