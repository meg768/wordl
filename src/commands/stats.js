const LetterStatistics = require('../scripts/letter-statistics.js');
const Command = require('../scripts/command.js');

module.exports = class extends Command {

    constructor(options) {

        super({command: 'stats [options]', description: 'Displays letter frequency', ...options}); 


	}

    options(yargs) {
        super.options(yargs);
		yargs.option('position', {alias: 'p', describe:'Displays letter freqency by position', type:'boolean', default:undefined});
    }


	async run() {



		let stats = new LetterStatistics();

		if (this.argv.position) {
			for (let i = 0; i < 5; i++) {
				this.log(`${stats.frequency.position[i].alphabet}`);
			}
		}
		else {
			this.log(`${stats.frequency.alphabet}`);
		}

/*		this.log(`The most frequent letters in Wordle are:`);

		this.log('');

		this.log(`The most frequent letters in each position are:`);

		for (let i = 0; i < 5; i++) {
			this.log(`${i+1}: ${stats.frequency.position[i].alphabet}`);
		}
*/		
		/*
		this.log();

		this.log(`Ord som börjar och slutar med konsonant: ${stats.match(/^[BCDFGHJKLMNPQRSTVWXZ].*[BCDFGHJKLMNPQRSTVWXZ]$/g)}%`);
		this.log(`Ord som börjar och slutar med vokal: ${stats.match(/^[EYUIOA].*[EYUIOA]$/g)}%`);
		this.log(`Ord med varannan konsonant/vokal: ${stats.match(/^[BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ]$/g)}%`);

		this.log(`Ord med varannan vokal/konsonant: ${stats.match(/^[EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA][BCDFGHJKLMNPQRSTVWXZ][EYUIOA]$/g)}%`);

		this.log(`Ord som innehåller två vokaler i följd: ${stats.match(/[EYUIOA][EYUIOA]/g)}%`);

		this.log(`CXXXC: ${stats.match(/^[^EYUIOA].*[^EYUIOA]$/g)}%`);
		this.log(`CVCVC: ${stats.match(/^[^EYUIOA][EYUIOA][^EYUIOA][EYUIOA][^EYUIOA]$/g)}%`);
		this.log(`CVVCC: ${stats.match(/^[^EYUIOA][EYUIOA][EYUIOA][^EYUIOA][^EYUIOA]$/g)}%`);
		this.log(`V••••: ${stats.match(/^[EYUIOA].*$/g)}%`);
		*/

	}

};



