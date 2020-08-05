/**
 * Discord bot for Reykunyu
 */

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

const fetch = require('node-fetch');

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(config['bot-token']);

client.once('ready', () => {
	console.log('Logged in successfully to Discord');
});

client.on('message', async message => {

	// some sanity checks
	if (message.author.bot) {
		return;
	}

	const text = message.content;
	if (text.startsWith('!run ')) {
		const query = text.substring(5);
		doNaviSearch(query, message);
	} else if (text.startsWith('!find ')) {
		const query = text.substring(6);
		doReverseSearch(query, 'en', message);
	} else if (text.startsWith('!finde ')) {
		const query = text.substring(7);
		doReverseSearch(query, 'de', message);
	} else if (text.startsWith('!trouve ')) {
		const query = text.substring(8);
		doReverseSearch(query, 'fr', message);
	} else if (text.startsWith('!vind ')) {
		const query = text.substring(6);
		doReverseSearch(query, 'nl', message);
	} else if (message.channel.type === "dm") {
		doNaviSearch(text, message);
	}
});

async function doNaviSearch(query, message) {
	const response = await fetch('https://reykunyu.wimiso.nl/api/fwew?tìpawm=' + query)
		.then(response => response.json())
		.catch(error => {
			message.channel.send("Something went wrong while searching. Please try again later, or ping Wllìm if this problem persists.")
			return;
		});

	if (response.length === 0) {
		return;
	} else if (response.length === 1) {
		sendSingleWordResult(response[0]['sì\'eyng'], message);
	} else {
		sendSentenceResult(response, message, query);
	}
}

function sendSingleWordResult(result, message) {

	if (result.length === 0) {
		message.channel.send('No results found.');
		return;
	}

	text = '';

	for (let i = 0; i < result.length; i++) {
		let r = result[i];
		text += '**'
		text += r['na\'vi'];
		if (r['type'] === 'n:si') {
			text += ' si';
		}
		text += '**';

		text += '  (' + toReadableType(r["type"]);
		text += ', ';
		text += pronunciationToMarkdown(r["pronunciation"], r["type"]);
		if (r['infixes']) {
			text += ', ';
			text += r['infixes'].replace(/\./g, '·');
		}
		text += ')';
	
		if (r["status"]) {
			text += '  :warning: ' + r["status"];
		}
		
		text += '\n';

		if ((r["type"] === "n" || r["type"] === "n:pr" || r.hasOwnProperty("conjugation")) && r["conjugated"][0].toLowerCase() !== r["conjugated"][1].toLowerCase()) {
			text += '    ';
			text += nounConjugation(r["conjugated"]);
			text += '\n';
		}

		if (r["type"].substring(0, 2) === "v:" && r["conjugated"][0].toLowerCase() !== r["conjugated"][1].toLowerCase()) {
			text += '    ';
			text += verbConjugation(r["conjugated"]);
			text += '\n';
		}

		if (r["type"] === "adj" && r["conjugated"][2] !== "predicative") {
			text += '    ';
			text += adjectiveConjugation(r["conjugated"]);
			text += '\n';
		}

		text += '    ';
		text += getTranslation(message, r['translations'][0]);

		text += '\n';

		if (r['meaning_note']) {
			text += '    *';
			text += r['meaning_note'];
			text += '*\n';
		}
	}
	message.channel.send(text);
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
	}
	return '*' + mapping[type] + '*';
}

function pronunciationToMarkdown(pronunciation, type) {
	if (!pronunciation || pronunciation.length === 0) {
		return "unknown stress";
	}
	
	let text = "";
	syllables = pronunciation[0].split("-");
	for (let i = 0; i < syllables.length; i++) {
		if (i > 0) {
			text += "-";
		}
		if (syllables.length > 1 && i + 1 === pronunciation[1]) {
			text += "__" + syllables[i] + "__";
		} else {
			text += syllables[i];
		}
	}
	if (type === "n:si") {
		text += " si";
	}
	
	return text;
}

function nounConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';
	
	for (let i = 0; i <= 2; i++) {
		if (conjugation[2][i]) {
			text += conjugation[2][i];
			text += " + ";
		}
	}
	
	text += conjugation[1];
	
	for (let i = 3; i <= 6; i++) {
		if (conjugation[2][i]) {
			text += " + ";
			text += conjugation[2][i];
		}
	}
	
	if (!short) {
		text += "  =  ";
		text += '**' + conjugation[0] + '**';
	}
	
	return text;
}

function verbConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';
	text += conjugation[1];

	for (let i = 0; i < 3; i++) {
		if (conjugation[2][i]) {
			text += " + ";
			text += "‹" + conjugation[2][i] + "›";
		}
	}
	
	if (!short) {
		text += "  =  ";
		text += '**' + conjugation[0] + '**';
	}

	return text;
}

function adjectiveConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';

	if (conjugation[2] === "postnoun") {
		text += "a + ";
	}

	text += conjugation[1];

	if (conjugation[2] === "prenoun") {
		text += " + a";
	}
	
	if (!short) {
		text += "  =  ";
		text += '**' + conjugation[0] + '**';
	}

	return text;
}

async function sendSentenceResult(results, message, query) {

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
		text += results[i]['tìpawm'];
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

			text += singleLineResultMarkdown(r, message);

			text += getTranslation(message, r['translations'][0]);
		}
	}

	const parseResults = await fetch('https://reykunyu.wimiso.nl/api/parse?tìpawm=' + query)
		.then(response => response.json())
		.catch(error => {
			console.log('parsing failed for: ' + query);
			return;
		});

	if (parseResults) {
		let lastTranslation = null;
		for (let i = 0; i < parseResults.length; i++) {
			let result = parseResults[i];
			if (i > 0 && result.penalty > parseResults[0].penalty) {
				break;
			}
			if (result.errors.length > 0) {
				break;
			}
			let translation = result.translation;
			if (translation !== lastTranslation) {
				text += "\n";
				text += "→ \"" + translation + "\"";
				lastTranslation = translation;
			}
		}
	}

	message.channel.send(text);
}

function singleLineResultMarkdown(r, message) {

	let text = '(';

	if (r["type"] === "n:si") {
		text += "+ **si**, ";
	}
	text += toReadableType(r["type"]);
	if ((r["type"] === "n" || r["type"] === "n:pr" || r.hasOwnProperty("conjugation")) &&
			r.hasOwnProperty('conjugated') &&
			r["conjugated"][0].toLowerCase() !== r["conjugated"][1].toLowerCase()) {
		text += ', ' + nounConjugation(r["conjugated"], true);
	}

	if (r["type"].substring(0, 2) === "v:" && r.hasOwnProperty('conjugated') &&
			r["conjugated"][0].toLowerCase() !== r["conjugated"][1].toLowerCase()) {
		text += ', ' + verbConjugation(r["conjugated"], true);
	}

	if (r["type"] === "adj" && r.hasOwnProperty('conjugated') && r["conjugated"][2] !== "predicative") {
		text += ', ' + adjectiveConjugation(r["conjugated"], true);
	}
	text += ') ';

	if (r["status"]) {
		text += '  :warning:  ';
	}

	return text;
}

function getTranslation(message, translation) {
	let channelName = message.channel.name;
	let guildName = "";
	if (message.guild) {
		guildName = message.guild.name;
	}
	if ((channelName === "deutsch" || guildName === "Deutsche Na'vi Lerngruppe") &&
			translation.hasOwnProperty("de")) {
		return translation["de"];
	} else {
		return translation["en"];
	}
}

async function doReverseSearch(query, language, message) {
	const response = await fetch('https://reykunyu.wimiso.nl/api/search?language=' + language + '&query=' + query)
		.then(response => response.json())
		.catch(error => {
			message.channel.send("Something went wrong while searching. Please try again later, or ping Wllìm if this problem persists.")
			return;
		});

	let text = '';

	if (response.length === 0) {
		message.channel.send('No results found.');
		return;
	}

	for (let i = 0; i < response.length; i++) {
		let r = response[i];

		if (i > 0) {
			text += '\n';
		}
		if (i >= 9 && response.length > 10) {
			text += '(' + (response.length - 10) + ' more results omitted)';
			break;
		}

		text += '**'
		text += r['na\'vi'];
		text += '**'
		text += '    '

		text += singleLineResultMarkdown(r, message);
		
		text += r['translations'][0][language]
			.replace(new RegExp('(' + escapeRegex(query) + ')', 'ig'), '__$1__');
	}

	message.channel.send(text);
}

function escapeRegex(string) {
	// https://stackoverflow.com/a/3561711/12243952
	return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

