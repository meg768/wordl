const LetterStatistics = require('../scripts/letter-statistics.js');
const Command = require('../scripts/command.js');

module.exports = class extends Command {

    constructor(options) {

        super({command: 'stats [options]', description: 'Displays letter statistics', ...options}); 


	}

    options(yargs) {
        super.options(yargs);
    }


	async run() {



		let stats = new LetterStatistics();

		this.log(`Vanligast förekommande bokstäver i Wordle är i ordning:`);
		this.log(`${stats.frequency.alphabet}`);

		this.log('');

		this.log(`Vanligaste bokstäverna i respektive ruta är följande:`);

		for (let i = 0; i < 5; i++) {
			this.log(`${stats.frequency.position[i].alphabet}`);
		}
		
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

	}

};



