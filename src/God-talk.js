/**
 * God-talk.js
 */

// main package is broken, need to git clone & build, or use old archived version
//import wordnets from 'wordnets'
import Dictionary from 'en-dictionary'
import prand from 'pure-rand'
import wordData from '../data/words.json'

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
	words.verbs = getAllPosWords(dictionary, pos.verb)
	words.adjectives = getAllPosWords(dictionary, pos.adjective)
	words.adverbs = getAllPosWords(dictionary, pos.adverb)
	words.pronouns = wordData.words.pronouns
	words.prepositions = wordData.words.prepositions
	words.conjunctions = wordData.words.conjunctions
	words.interjections = wordData.words.interjections
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
	express: [pos.noun, pos.adverb, pos.verb, pos.adjective, pos.noun],
	warning: [pos.conjunction, pos.adjective, pos.pronoun, pos.adverb, pos.verb],
	guide: [pos.conjunction, pos.pronoun, pos.adverb, pos.verb, pos.conjunction, pos.interjection],
	explain: [pos.pronoun, pos.noun, pos.verb, pos.noun, pos.interjection, pos.adjective, pos.noun]
}

function getWord(wordArray) {
	const length = wordArray.length - 1
	const seed = Math.floor(Math.random() * length)
	const rng = prand.xoroshiro128plus(seed)
	const randomIndex = prand.unsafeUniformIntDistribution(0, length, rng)
	return wordArray[randomIndex]
}

function processPosType(posType) {
	switch (posType) {
		case pos.noun:
			return getWord(words.nouns)
		case pos.verb:
			return getWord(words.verbs)
		case pos.adjective:
			return getWord(words.adjectives)
		case pos.adverb:
			return getWord(words.adverbs)
		case pos.pronoun:
			return getWord(words.pronouns)
		case pos.preposition:
			return getWord(words.prepositions)
		case pos.conjunction:
			return getWord(words.conjunctions)
		case pos.interjection:
			return getWord(words.interjections)
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

function _getRandNumWords(min, max) {
	const seed = Math.floor(Math.random() * min * max)
	const rng = prand.xoroshiro128plus(seed)
	const numWords = prand.unsafeUniformIntDistribution(min, max, rng)
	return numWords
}

function _getRandPos() {
	const keys = Object.keys(pos)
	const length = keys.length
	const seed = Math.floor(Math.random() * length)
	const rng = prand.xoroshiro128plus(seed)
	const index = prand.unsafeUniformIntDistribution(0, length-1, rng)
	const _pos = keys[index]
	return _pos.valueOf()
}

function _getRandWordFromPos(_pos) {
	const _words = words[_pos + 's']
	const length = _words.length
	const seed = Math.floor(Math.random() * length)
	const rng = prand.xoroshiro128plus(seed)
	const index = prand.unsafeUniformIntDistribution(0, length-1, rng)
	const word = _words[index].valueOf()
	return word.valueOf()
}

function _getRandWord() {
	const _pos = _getRandPos()
	const word = _getRandWordFromPos(_pos)
	return word.valueOf()
}

function _getRandWords(numWords) {
	const words = []
	for (let i = 0; i < numWords; i++) {
		const word = _getRandWord()
		words.push(word)
	}
	return words
}

function _makeRandom() {
	const minWords = 4
	const maxWords = 15
	const numWords = _getRandNumWords(minWords, maxWords)
	const randWords = _getRandWords(numWords)
	const sentence = { str: randWords.join(' ') }
	sentence.str += '.'
	return sentence.str
}

function _makeContext() {
	const ln = wordData.words.nouns.length
	const lp = wordData.words.prepositions.length
	const context = { sentence: '' }

	const rni = Math.floor(Math.random() * ln)
	context.sentence += wordData.words.nouns[rni]
	context.sentence += ' '
	const rpi = Math.floor(Math.random() * lp)
	context.sentence += wordData.words.prepositions[rpi]
	context.sentence += ' '
	const rni2 = Math.floor(Math.random() * ln)
	context.sentence += wordData.words.nouns[rni2]
	context.sentence += '.'

	return context.sentence
}

function makeSuggestion() {
	const suggestion = _makeSetence(sentenceForumalas.suggestion)
	return suggestion
}

function makeExpression() {
	const expression = _makeSetence(sentenceForumalas.express)
	return expression
}

function makeWarning() {
	const warning = _makeSetence(sentenceForumalas.warning)
	return warning
}

function makeGuide() {
	const guide = _makeSetence(sentenceForumalas.guide)
	return guide
}

function makeExplain() {
	const explain = _makeSetence(sentenceForumalas.explain)
	return explain
}

function makeContext() {
	const context = _makeContext()
	return context
}

function makeRandom() {
	const random = _makeRandom()
	return random
}

await init()

export { makeSuggestion, makeExpression, makeWarning, makeContext, makeGuide, makeExplain, makeRandom }