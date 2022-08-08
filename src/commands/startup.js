const WordFinder = require('../scripts/word-finder.js');
const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');
const isArray = require('yow/isArray');
const ProgressBar = require('progress');

module.exports = class extends Command {

    constructor() {

        super({command: 'startup [options]', description: 'Finds out good starting words'}); 


		this.sprintf = require('yow/sprintf');
		this.words = require('../scripts/words.js');
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	}

    options(yargs) {
        super.options(yargs);
		yargs.option('omit', {alias:'o', describe:'Omit specified letters in result', type:'string', default:''});
        yargs.option('unique', {alias:'u', describe:'Only show words with unique set of letters', type:'boolean', default:false});
        yargs.option('green', {alias:'g', describe:'Green value', type:'number', default:1});
        yargs.option('yellow', {alias:'y', describe:'Yellow value', type:'number', default:1});

    }


    match(text, word) {
        text = text.split('');
        word = word.split('');

        let green = 0;
        let yellow = 0;

        for (let i = 0; i < 5; i++) {
            let position = word.indexOf(text[i]);

            if (position >= 0) {
                if (position == i)
                    green++;
                else    
                    yellow++;

                word[position] = ' ';
            }
        }

        let result = Math.floor(yellow * this.argv.yellow + green * this.argv.green);

        return  result;

    }

    computeRatingForWord(text) {

        let rating = 0;

        for (let word of this.words) {
            rating += this.match(text, word);
        }

        return rating;
    }


	async run() {


        let result = [];
        let progress = new ProgressBar(':bar', { incomplete:'▫︎', complete:'◼︎',width: 20, total: this.words.length });

        for (let word of this.words) {
            result.push({word:word, rating:this.computeRatingForWord(word)});
            progress.tick();
        }


        if (this.argv.omit) {
            let omit = isArray(this.argv.omit) ? this.argv.omit.join('') : this.argv.omit;

            result = result.filter((item) => {
                return item.word.match(`[${omit.toUpperCase()}]`) == null;
            });
        }
        
        if (this.argv.unique) {
            result = result.filter((item) => {
                return item.word.match(/(?=^[A-Z]+$)(.)+.*\1.*/g) == null;
            });    
        }
        result.sort((a, b) => {
            return b.rating - a.rating;
        });

        result = result.slice(0, 10);

        if (result.length > 0) {
            let table = new EasyTable();

            result.forEach(function(item) {
                table.cell('Word', item.word);
                table.cell('Rank', item.rating, EasyTable.leftPadder(' '));
                table.newRow();
            })
    
            this.log(table.toString());

        
        }
        else
            this.log('No results');

    }

};



