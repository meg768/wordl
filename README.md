# wordle-statistics
Statistics for the game of Wordle - not the game

## Syntax

	Usage: wordle <command>

	Commands:
	wordle lookup <word>      Checks if word exists
	wordle stats [options]    Displays word statistics
	wordle nabo [options]     Displays neighbour letter frequency
	wordle words [options]    Filter Wordle words

	Options:
	--version  Show version number  [boolean]
	--help     Show help  [boolean]


## Example

This is an example how to generate the first "best" words in Wordle

Start by entering the command

	$ ./wordle.js words

This will display all the words in the Wordle dictionary. However,
we want out start word to consist of unique letters. So type the following command

	$ ./wordle.js words --unique

As you may see in the output, every word has a rank. More about this later.
Let us sort output by rank C.

	$ ./wordle.js words --unique --rank C

The word TARES has the highest rank. Let´s use this as a first word.
If you want to continue to eliminate letters and ignore the results from Wordle then proceed.

Since I don´t want duplicate letters in the second word you may
omit these letters in the next search.

	$ ./wordle.js words --unique --rank C --omit TARES

This will give you another list of words. The first one is COLIN
and will be our second start word. Now for the third word, if needed.

	$ ./wordle.js words --unique --rank C --omit TARES --omit COLIN

The word with the heighest rank is BUMPY so this will be our third start word
if necessary. So our "best" start words are TARES, COLIN and BUMPY.

But this is based on rank "C". Rank "A" is based on the letter frequency in the english
alphabet. Rank "B" is based on the letter frequency per column. Rank "C" is the mean value of the two. 
