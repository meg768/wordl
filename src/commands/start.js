const WordFinder = require('../scripts/word-finder.js');
const Command = require('../scripts/command.js');
const EasyTable = require('easy-table');
const isArray = require('yow/isArray');
const ProgressBar = require('progress');

module.exports = class extends Command {

    constructor() {

        super({command: 'start [options]', description: 'Finds out good starting words'}); 


		this.sprintf = require('yow/sprintf');
		this.words = require('../scripts/words.js');
		this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	}

    options(yargs) {
        super.options(yargs);
        yargs.option('contains', {alias:'c', describe:'Contains letters', type:'string', default:undefined});
        yargs.option('omit', {alias:'o', describe:'Omit letters', type:'string', default:undefined});
        yargs.option('unique', {alias:'u', describe:'Only uniqe letter words', type:'boolean', default:true});
        yargs.option('limit', {alias:'l', describe:'Limit number of displayed words', type:'number', default:10});
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

        return result;

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
        let words = this.words;
        let ratings = [];


        if (this.argv.unique) {
            words = words.filter((word) => {
                return word.match(/(?=^[A-Z]+$)(.)+.*\1.*/g) == null;
             });
        }


        if (this.argv.omit) {
            let omit = isArray(this.argv.omit) ? this.argv.omit.join('') : this.argv.omit;

            words = words.filter((word) => {
                return word.match(`[${omit.toUpperCase()}]`) == null;
            });
        }


        this.log(`Computing ratings for ${words.length} words...`);

        for (let word of words) {
            ratings[word] = this.computeRatingForWord(word);
        }


        let progress = new ProgressBar(':bar', { incomplete:'▫︎', complete:'◼︎',width: 20, total: words.length });

        this.log(`Simulating...`);

        for (let i = 0; i < words.length; i++) {
           progress.tick();
           let wordA = words[i];

           for (let ii = i + 1; ii < words.length; ii++) {
                let wordB  = words[ii];
                let rating = ratings[wordA] + ratings[wordB];
                let entry  = {wordA:wordA, wordB:wordB, letters:wordA+wordB, rating:rating};

                if (wordA.match(`[${wordB}]`) == null) {
                    result.push(entry);
                } 
            }
        }

        if (this.argv.contains != undefined) {
            let contains = isArray(this.argv.contains) ? this.argv.contains.join('') : this.argv.contains;
            
            contains = contains.split('').map((letter) => {
                return `(?=.*${letter})`
            });
    
            contains = `^${contains.join('')}.+$`;

            result = result.filter((item) => {
                return (item.letters).match(contains) != null;

            });
        }




        this.log(`Sorting by rank...`);
        result.sort((a, b) => {
            return b.rating - a.rating;
        });


        let array = result;

        if (this.argv.limit) {
			array = result.slice(0, this.argv.limit);
		}

        
        if (array.length > 0) {
            let table = new EasyTable();

            array.forEach(function(item) {
                table.cell('WordA', item.wordA);
                table.cell('WordB', item.wordB);
                table.cell('Rank', item.rating, EasyTable.leftPadder(' '));
                table.newRow();
            })

            this.log(table.toString());
            this.log(`Displayed ${array.length} out of ${result.length} entries.`);
        }
        else
            this.log('No results');

    }

};



