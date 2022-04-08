#!/usr/bin/env node


const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');
const LetterStatistics = require('../scripts/letter-statistics.js');


module.exports = class extends Command {

    constructor() {

        super({command: 'nabo [options]', description: 'Displays neighbour letter frequency'}); 

		this.words = require('../scripts/words.js');
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.stats = [];

	}

    options(yargs) {
        super.options(yargs);
		yargs.option('position', {describe:'', type:'number', default:undefined});
		yargs.option('letter', {describe:'', type:'string', default:undefined});
    }


	async run() {
		let stats = new LetterStatistics();
		let array = [];

		for (let i = 0; i < 5; i++) {
			this.alphabet.split('').forEach((letter) => {
				let freq = stats.getNeighbourFrequency(letter, i);
				array.push({letter:letter, position:i, left:freq.left, right:freq.right});
			});
		}

		console.log(array);
		var table = new EasyTable();

		array.forEach(function(item) {
			table.cell('Letter', `${item.letter}[${item.position+1}]`);
			table.cell('Letter to the left', item.left);
			table.cell('Letter to the right', item.right);
			table.newRow();
		})

		table.sort(['Letter', 'Position']);
		this.log(table.toString());


	}
};

