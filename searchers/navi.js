const fetch = require('node-fetch');

const nouns = require('../nouns');
const utils = require('../utils');

module.exports = {
	search: search,
	getSingleWordResult: getSingleWordResult,
	singleLineResultMarkdown: singleLineResultMarkdown,
	getTranslation: getTranslation
};

async function search(query, language) {
	let response;
	try {
		response = await fetch('https://reykunyu.wimiso.nl/api/fwew?tìpawm=' + encodeURIComponent(query))
			.then(response => response.json());
	} catch (e) {
		return 'Something went wrong while searching. This shouldn\'t happen, so let me ping <@163315929760006144> to get the issue fixed.';
	}

	if (response.length === 0) {
		return '';
	} else if (response.length === 1) {
		return getSingleWordResult(response[0]['sì\'eyng'], response[0]['aysämok'], language);
	} else {
		return getSentenceResult(response, language);
	}
};

function getSingleWordResult(result, suggestions, language) {

	if (result.length === 0) {
		if (suggestions.length) {
			suggestions = suggestions.map(a => "**" + a + "**");
			return 'No results found for Na\'vi → English.\n' +
					"(Did you mean " + suggestions.join(', ').replace(/, ([^,]*)$/, " or $1") + "?)";
		}
		return 'No results found for Na\'vi → English.';
	}

	text = '';

	for (let i = 0; i < result.length; i++) {
		if (i > 0) {
			text += "\n";
		}

		let r = result[i];
		text += '**'
		text += createWordLink(language, r, true);
		text += '**';

		text += '  (' + toReadableType(r["type"]);
		text += ', ';
		text += pronunciationToMarkdown(r["pronunciation"], r["type"]);
		if (r['infixes']) {
			text += ', inf. ';
			text += r['infixes'].replace(/\./g, '·');
		}
		text += ')';

		if (r["status"]) {
			text += '  :warning: ' + r["status"];
		}
		
		text += '\n';

		if (r.hasOwnProperty("conjugated")) {
			let explanation = conjugation(r["conjugated"]);
			if (explanation) {
				text += '> [ ' + explanation + ' ]\n';
			}
		}

		text += '> **';
		text += getTranslation(language, r['translations'][0]);
		text += '**\n';

		if (r['etymology'] || r['meaning_note']) {
			text += etymologyAndNoteSection(language,
					r["etymology"], r["meaning_note"]);
		}
		if (r['derived']) {
			text += derivedSection(language, r["derived"]);
		}
		if (r["status_note"]) {
			text += statusSection(r["status"], r["status_note"]);
		}
		if (r["source"] && r["source"].length > 0 && r["source"][0].length > 0) {
			text += sourceSection(r["source"]);
		}

		/*if (r["affixes"] && r["affixes"].length) {
			text += affixesSection(language, r["affixes"]);
		}*/
		
		/*
		if (r["conjugation"]) {
			text += nounConjugationSection(r["conjugation"]["forms"], r["conjugation_note"]);
		} else if (r["type"] === "n") {
			text += nounConjugationSection(createNounConjugation(r["na'vi"], r["type"], false), r["conjugation_note"]);
		} else if (r["type"] === "n:pr") {
			text += nounConjugationSection(createNounConjugation(r["na'vi"], r["type"], true), r["conjugation_note"]);
		//} else if (r["type"] === "adj") {
		//	$result.append(adjectiveConjugationSection(r["na'vi"], r["type"], r["conjugation_note"]));
		}
		*/
	}

	let options = {};

	for (let i = 0; i < result.length; i++) {
		let r = result[i];
		if (r['image']) {
			options['file'] = 'https://reykunyu.wimiso.nl/ayrel/' + r['image'];
			text += `\n[${r["na'vi"]} drawn by Eana Unil](https://reykunyu.wimiso.nl/ayrel/${r['image']})`;
			break;
		}
	}

	return text;
}

function createNounConjugation(word, type, uncountable) {

	let conjugation = [];
	let caseFunctions = [nouns.subjective, nouns.agentive, nouns.patientive, nouns.dative, nouns.genitive, nouns.topical]
	let plurals = [nouns.singular(word), nouns.dual(word), nouns.trial(word), nouns.plural(word)]

	for (let j = 0; j < 4; j++) {
		let row = [];
		if (!uncountable || j === 0) {
			for (let i = 0; i < 6; i++) {
				row.push(caseFunctions[i](plurals[j]));
			}
		}
		conjugation.push(row);
	}

	return conjugation;
}

function toReadableType(type) {
	const mapping = {
		"n": "n.",
		"n:unc": "n.",
		"n:si": "v.",
		"n:pr": "prop. n.",
		"pn": "pn.",
		"adj": "adj.",
		"num": "num.",
		"adv": "adv.",
		"adp": "adp.",
		"adp:len": "adp+",
		"intj": "intj.",
		"part": "part.",
		"conj": "conj.",
		"ctr": "sbd.",
		"v:?": "v.",
		"v:in": "vin.",
		"v:tr": "vtr.",
		"v:m": "vm.",
		"v:si": "v.",
		"v:cp": "vcp.",
		"phr": "phr.",
		"inter": "inter.",
		"aff:pre": "pref.",
		"aff:in": "inf.",
		"aff:suf": "suf.",
		"nv:si": "vin."
	}
	return '*' + mapping[type] + '*';
}

function pronunciationToMarkdown(pronunciation, type) {
	if (!pronunciation || pronunciation.length === 0) {
		return "unknown stress";
	}
	
	let text = "";
	for (let i = 0; i < pronunciation.length; i++) {
		if (i > 0) {
			text += " or ";
		}
		syllables = pronunciation[i]['syllables'].split("-");
		for (let j = 0; j < syllables.length; j++) {
			if (j > 0) {
				text += "-";
			}
			if (syllables.length > 1 && j + 1 === pronunciation[i]['stressed']) {
				text += "__" + syllables[j] + "__";
			} else {
				text += syllables[j];
			}
		}
		if (type === "n:si" || type === "nv:si") {
			text += " si";
		}

		if (pronunciation.hasOwnProperty('audio')) {
			const audios = pronunciation['audio'];
			for (let audio of audios) {
				text += " [▸](https://reykunyu.wimiso.nl/fam/" + audio["file"] + ")";
			}
		}
	}
	
	return text;
}

function conjugation(conjugation, short) {
	let text = "";

	for (let i = 0; i < conjugation.length; i++) {
		let type = conjugation[i]["type"];
		let c = conjugation[i]["conjugation"];
		if (c["result"].toLowerCase() == c["root"].toLowerCase()) {
			continue;
		}
		
		if (text !== "") {
			text += short ? '; ' : '\n>    ';
		}

		switch (type) {
			case "n":
				text += nounConjugation(c, short);
				break;
			case "v":
				text += verbConjugation(c, short);
				break;
			case "adj":
				text += adjectiveConjugation(c, short);
				break;
			case "v_to_n":
				text += verbToNounConjugation(c, short);
				break;
			case "v_to_adj":
				text += verbToAdjectiveConjugation(c, short);
				break;
			case "adj_to_adv":
				text += adjectiveToAdverbConjugation(c, short);
				break;
		}
	}

	return text;
}

function nounConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';
	
	for (let i = 0; i <= 2; i++) {
		if (conjugation["affixes"][i]) {
			text += conjugation["affixes"][i];
			text += " + ";
		}
	}
	
	text += conjugation["root"];
	
	for (let i = 3; i <= 6; i++) {
		if (conjugation["affixes"][i]) {
			text += " + ";
			text += conjugation["affixes"][i];
		}
	}
	
	if (!short) {
		text += "  =  ";
		text += conjugation["result"];
	}
	
	return text;
}

function verbConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';
	text += conjugation["root"];

	for (let i = 0; i < 3; i++) {
		if (conjugation["infixes"][i]) {
			text += " + ";
			text += "‹" + conjugation["infixes"][i] + "›";
		}
	}
	
	if (!short) {
		text += "  =  ";
		text += conjugation["result"];
	}

	return text;
}

function adjectiveConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';

	if (conjugation["form"] === "postnoun") {
		text += "a + ";
	}

	text += conjugation["root"];

	if (conjugation["form"] === "prenoun") {
		text += " + a";
	}
	
	if (!short) {
		text += "  =  ";
		text += conjugation["result"];
	}

	return text;
}

function verbToNounConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';
	
	text += conjugation["root"];
	
	text += " + ";
	text += conjugation["affixes"][0];
	
	if (!short) {
		text += "  =  *(n.)* ";
		text += conjugation["result"];
	}
	
	return text;
}

function verbToAdjectiveConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';
	
	text += conjugation["root"];
	
	text += " + ";
	text += conjugation["affixes"][0];
	
	if (!short) {
		text += "  =  *(adj.)* ";
		text += conjugation["result"];
	}
	
	return text;
}

function adjectiveToAdverbConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';
	
	text += conjugation["root"];
	
	text += " + ";
	text += conjugation["affixes"][0];
	
	if (!short) {
		text += "  =  *(adv.)* ";
		text += conjugation["result"];
	}
	
	return text;
}

function affixesSection(language, affixes) {
	let text = "";
	for (let a of affixes) {
		if (text) {
			text += ", ";
		}
		const affix = a['affix'];
		text += createWordLink(language, affix);
	}
	return "> Affixes: " + text;
}

function etymologyAndNoteSection(language, etymology, note) {
	let text = [];
	if (etymology) {
		text.push(linkStringToMarkdown(language, etymology));
	}
	if (note) {
		text.push(linkStringToMarkdown(language, note));
	}
	return "> " + text.join(" ") + "\n";
}

function derivedSection(language, derived) {
	let text = "";
	for (let i = 0; i < derived.length; i++) {
		if (text) {
			text += ", ";
		}
		if (text.length > 200) {
			text += '... *(' + (derived.length - i) + ' more)*';
			break;
		}
		const word = derived[i];
		text += createWordLink(language, word);
	}
	return "> Derivations: " + text + "\n";
}

function linkStringToMarkdown(language, linkString) {
	let result = "";
	for (let piece of linkString) {
		if (typeof piece === 'string') {
			result += piece;
		} else {
			result += createWordLink(language, piece);
		}
	}
	return result;
}

function createBareLink(word) {
	let url = "https://reykunyu.wimiso.nl/?q=" + word;
	return utils.markdownLink(word, url);
}

function createWordLink(language, link, hideTranslation) {
	if (typeof link === "string") {
		return link;
	} else {
		let url = "https://reykunyu.wimiso.nl/?q=" + link["na'vi"];
		let lemma = lemmaForm(link["na'vi"], link["type"]);
		let result = utils.markdownLink(lemma, url);
		if (!hideTranslation) {
			result += " (" + getShortTranslation(language, link) + ")";
		}
		return result;
	}
}

function getShortTranslation(language, result) {
	if (result["short_translation"]) {
		return result["short_translation"];
	}

	let translation = getTranslation(language, result["translations"][0]);
	translation = translation.split(',')[0];
	translation = translation.split(';')[0];
	translation = translation.split(' | ')[0];
	translation = translation.split(' (')[0];

	if (translation.startsWith('(') && translation.endsWith(')')) {
		translation = translation.substring(1, translation.length - 1);
	}

	if (result["type"][0] === "v"
		&& translation.indexOf("to ") === 0) {
		translation = translation.substr(3);
	}

	return translation;
}

function statusSection(status, statusNote) {
	if (status === "") {
		return "";
	}
	status = status[0].toUpperCase() + status.slice(1);
	return "> " + status + " word: " + statusNote + "\n";
}

function sourceSection(sources) {
	let sourceText = "";
	for (let source of sources) {
		if (sourceText.length) {
			sourceText += "  |  ";
		}
		if (source.length == 1) {
			sourceText += source[0];
		} else {
			sourceText += utils.markdownLink(source[0], source[1]);
		}
		if (source.length >= 3 && source[2]) {
			sourceText += " (" + source[2] + ")";
		}
		if (source.length >= 4 && source[3]) {
			sourceText += " [" + source[3] + "]";
		}
	}
	return "> Source: " + sourceText + "\n";
}

// currently unused
function nounConjugationSection(conjugation) {
	let text = "";
	for (let j = 1; j < 4; j++) {
		if (conjugation[j].length === 0) {
			continue;
		}
		let c = conjugation[j][0];
		let formatted = nounConjugationString(c);
		if (j > 1) {
			text += ", ";
		}
		text += formatted;
	}

	if (text !== "") {
		text += "  /  ";
	}

	let first = true;
	for (let i = 1; i < 6; i++) {
		let c;
		if (conjugation[0].length === 0) {
			c = conjugation[1][i];
		} else {
			c = conjugation[0][i];
		}
		if (!c) {
			continue;
		}
		let formatted = nounConjugationString(c);
		if (!first) {
			text += ", ";
		}
		first = false;
		text += formatted;
	}
	return "    *Conjugated forms:*\n        " + text + "\n";
}

function nounConjugationString(c) {
	let formatted = "";
	c = c.split(";");
	for (let k = 0; k < c.length; k++) {
		if (k > 0) {
			formatted += " *or* ";
		}

		let m = c[k].match(/(.*-\)?)(.*)(-.*)/);

		if (m) {
			if (m[1] !== "-") {
				formatted += "**" + m[1] + "**";
			}
			formatted += m[2].replace(/\{(.*)\}/, "**$1**");
			if (m[3] !== "-") {
				formatted += "**" + m[3] + "**";
			}
		} else {
			formatted += c[k];
		}
	}
	formatted = formatted.replace(/\*\*\*\*/g, "");
	return formatted;
}

function getSentenceResult(results, language) {

	text = '';

	for (let i = 0; i < results.length; i++) {
		if (i > 0) {
			text += '\n';
		}
		if (i >= 9 && results.length > 10) {
			text += '(' + (results.length - 9) + ' more words omitted)';
			break;
		}

		text += '**'
		text += createBareLink(results[i]['tìpawm']);
		text += '**'
		text += '    '

		const result = results[i]['sì\'eyng'];
		if (result.length === 0) {
			text += '*(not found)*';
		}

		for (let j = 0; j < result.length; j++) {
			if (j > 0) {
				text += "  **|**  ";
			}
			let r = result[j];

			text += singleLineResultMarkdown(r, language);

			text += getTranslation(language, r['translations'][0]);
		}
	}

	return text;
}

function singleLineResultMarkdown(r, language) {

	let text = '(';

	if (r["type"] === "n:si") {
		text += "+ **si**, ";
	}
	text += toReadableType(r["type"]);
	if (r.hasOwnProperty("conjugated")) {
		let explanation = conjugation(r["conjugated"], true);
		if (explanation) {
			text += ', ' + explanation;
		}
	}

	text += ') ';

	if (r["status"]) {
		text += '  :warning:  ';
	}

	return text;
}

function getTranslation(language, translation) {
	if (translation.hasOwnProperty(language)) {
		return translation[language];
	}
	return translation['en'];
}

function lemmaForm(word, type) {
	console.log('lemma form of', word, type);
	if (type === "n:si" || type === "nv:si") {
		return word + ' si';
	} else if (type === 'aff:pre') {
		return word + "-";
	} else if (type === 'aff:in') {
		return '‹' + word + '›';
	} else if (type === 'aff:suf') {
		return '-' + word;
	}
	return word;
}

