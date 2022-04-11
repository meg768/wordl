# wordle-words
Words and statistics for the game of Wordle

## Syntax

	Usage: wordle words [options]

	Options:
	-v, --version   Show version number  [boolean]
	-h, --help      Show help  [boolean]
	-d, --debug     Debug mode  [boolean]
	-w, --letters   Only use the specified set of letters (default is the entire alphabet)  [string]
	-o, --omit      Omit specified letters in result  [string] [default: ""]
	-c, --contains  The words must contain all these letters, including duplicates  [string]
	-l, --limit     Limit the number of words displayed  [number] [default: 15]
	-p, --pattern   In C/V/X format.  [string]
	-r, --rank      Sort output by rank  [string] [choices: "A", "B", "C", "D"]
	-u, --unique    Only show words with unique set of letters  [boolean] [default: false]
	-f, --filter    Filter using regular expression  [string]

