const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

const nouns = require('../nouns');
const utils = require('../utils');

module.exports = {
	search: search
};

async function search(query, language) {
	let response;
	try {
		response = await fetch('https://reykunyu.lu/api/search?language=' + language + '&query=' + encodeURIComponent(query))
			.then(response => response.json());
	} catch (e) {
		return 'Something went wrong while searching. This shouldn\'t happen, so let me ping <@163315929760006144> to get the issue fixed.';
	}

	const embed = new MessageEmbed()
		.setColor(0x359BE9);
	let text = '';

	if (response.length === 0) {
		if (query.split(' ').length > 1) {
			return 'No results found for English → Na\'vi. (Reykunyu cannot currently search for English phrases consisting of more than one word, so please enter one word at a time.)';
		} else {
			return 'No results found for English → Na\'vi.';
		}
	}

	for (let i = 0; i < response.length; i++) {
		let r = response[i];

		if (i > 0) {
			text += '\n';
		}
		if (i >= 9 && response.length > 10) {
			embed.setFooter({'text': '(' + (response.length - 10) + ' more results omitted)'});
			break;
		}

		text += '**'
		text += createWordLink(r);
		text += '**'
		text += '    '

		text += singleLineResultMarkdown(r, language);
		
		text += getAllTranslations(language, r['translations'])
			.replace(new RegExp('(' + escapeRegex(query) + ')', 'ig'), '__$1__');
	}
	embed.setDescription(text);

	return [embed];
};

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

// without translation
function createWordLink(link) {
	if (typeof link === "string") {
		return link;
	} else {
		let url = "https://reykunyu.lu/?q=" + link["na'vi"];
		let lemma = lemmaForm(link["na'vi"], link["type"]);
		return utils.markdownLink(lemma, url);
	}
}

function singleLineResultMarkdown(r, language) {

	let text = '(';

	if (r["type"] === "n:si") {
		text += "+ **si**, ";
	}
	text += toReadableType(r["type"]);

	text += ') ';

	if (r["status"]) {
		text += '  :warning:  ';
	}

	return text;
}

function getAllTranslations(language, translations) {
	let text = '';
	if (translations.length > 1) {
		for (let i = 0; i < translations.length; i++) {
			if (i > 0) {
				text += ' ';
			}
			text += '**' + (i + 1) + '.** ' + getTranslation(language, translations[i]);
		}
	} else {
		text += getTranslation(language, translations[0]);
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

function escapeRegex(string) {
	// https://stackoverflow.com/a/3561711/12243952
	return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

