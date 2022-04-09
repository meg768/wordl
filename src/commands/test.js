#!/usr/bin/env node


const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');

module.exports = class extends Command {

    constructor() {

        super({command: 'test [options]', description: 'Test command'}); 

		this.words = require('../scripts/words.js');
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


		//this.words = this.words.slice(0, 1000);


	}

    options(yargs) {
        super.options(yargs);
    }


	guessWord(word, guess) {
		let count = 0;

		word = word.split('');
		guess = guess.split('');

		/*
		for (let i = 0; i < secret.count; i++)
			if (secret[i] == guess[i])
				count++;
		*/
		
		guess.forEach((letter) => {
			let index = word.indexOf(letter);

			if (index >= 0) {
				word.splice(index, 1);
				count++;
			}
		});
		
		return count;
	}

	guessWords() {

		let map = {};

		let guesses = this.words.filter((word) => {
			return word.match(/(?=^[A-Z]+$)(.)+.*\1.*/g) == null;
		});

		for (let i = 0, count = 0; i < this.words.length; i++, count++) {

			if ((count % 1000) == 0) {
				console.log(count);
				console.log(this.words[i]);
			}

			for (let ii = 0; ii < guesses.length; ii++) {
				let secret = this.words[i];
				let guess = guesses[ii];

				let match = this.guessWord(secret, guess);

				map[guess] = map[guess] == undefined ? match : map[guess] = map[guess] + 1;
	
			}
		}	
		return map;

	}

	async run() {

		//console.log(this.words.length);
		//return;
		//console.log(this.guessWord(this.argv.A, this.argv.B));
		//return;

		let map = this.guessWords();
		let array = [];

		for (const [word, count] of Object.entries(map)) {
			array.push({word:word, rank:count});
		}

		array = array.sort((A, B) => {
			return A.rank - B.rank;
		});

		array = array.slice(0, 500);

		this.log(EasyTable.print(array));
		
	}
};

