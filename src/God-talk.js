/**
 * God-talk.js
 */

// main package is broken, need to git clone & build, or use old archived version
//import wordnets from 'wordnets'
import Dictionary from 'en-dictionary'

// dataPath for when clone & build wordnets
//const dataPath = 'wordnets/' + wordnets.en_wordnet_3_1.path

// use old archived en-wordnet package, manually add datapath
const dataPath = 'node_modules/en-wordnet/database/3.1'
const dictionary = new Dictionary(dataPath)

const pos = {
	noun: 'noun',
	pronoun: 'pronoun',
	verb: 'verb',
	adjective: 'adjective',
	adverb: 'adverb',
	preposition: 'preposition',
	conjunction: 'conjunction',
	interjection: 'interjection',
}

const words = {
	nouns: null,
	pronouns: null,
	verbs: null,
	adjectives: null,
	adverbs: null,
	prepositions: null,
	conjunctions: null,
	interjections: null,
}

function getAllPosWords(dictionary, posType) {
	const entries = dictionary.database.index.filter((entry) => entry.pos == posType)
	const words = entries.map((entry) => entry.lemma)
	return words
}

function initWords(dictionary) {
	words.nouns = getAllPosWords(dictionary, pos.noun)
	words.pronouns = getAllPosWords(dictionary, pos.pronoun)
	words.verbs = getAllPosWords(dictionary, pos.verb)
	words.adjectives = getAllPosWords(dictionary, pos.adjective)
	words.adverbs = getAllPosWords(dictionary, pos.adverb)
	words.prepositions = getAllPosWords(dictionary, pos.preposition)
	words.conjunctions = getAllPosWords(dictionary, pos.conjunction)
	words.interjections = getAllPosWords(dictionary, pos.interjection)
}

function printWordStats() {
	console.log('word stats:')
	Object.keys(words).map((pos) => console.log(`# of ${pos}: ${words[pos].length}`))
}

async function init() {
	await dictionary.init()

	/* console.dir(dictionary.__proto__)

	console.log(typeof dictionary.database) */
	//console.log(Object.entries(dictionary.database))

	/**
	 * database.index
	 * 	- array of dictionary items
	 * 	- array items
	 * 		database.index[140022].lemma -> dictionary word
	 *      database.index[140022].pos -> words part of speech (noun, verb, adjective, etc.)
	 *
	 * database.indexLemmaIndex
	 * 	- map of dictionary items
	 */
	initWords(dictionary)
	/* printWordStats()

	console.log('-----------------------------')
	const target = 'please'
	let result = dictionary.searchFor([target])
	console.log(result.get(target))
	console.log('-----------------------------') */
}

/**
 * test making a suggestion
 */
const sentenceForumalas = {
	suggestion: [pos.adverb, pos.verb, pos.noun],
	express: [pos.noun, pos.adverb, pos.verb, pos.noun, pos.adjective]
}

function getWord(wordArray) {
	const length = wordArray.length
	const randomIndex = Math.floor(Math.random() * length)
	return wordArray[randomIndex]
}

function processPosType(posType) {
	switch (posType) {
		case pos.noun:
			return getWord(words.nouns)
			break;
		case pos.verb:
			return getWord(words.verbs)
			break;
		case pos.adjective:
			return getWord(words.adjectives)
			break;
		case pos.adverb:
			return getWord(words.adverbs)
			break;
	}
}

function _makeSetence(forumla) {
	let sentence = '"'
	const maxWords = forumla.length
	forumla.forEach((posType, index) => {
		sentence += processPosType(posType)
		if (index == maxWords - 1) {
			sentence += '."'
		} else {
			sentence += ' '
		}
	})
	return sentence
}

function makeSuggestion() {
	const suggestion = _makeSetence(sentenceForumalas.suggestion)
	return suggestion
}

function makeExpression() {
	const expression = _makeSetence(sentenceForumalas.express)
	return expression
}

function sentenceTest() {
	const suggestion = makeSuggestion()
	console.log(`suggestion: ${suggestion}`)
}

await init()
//sentenceTest()

export { makeSuggestion, makeExpression }