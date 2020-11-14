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
	if (text === '!run help') {
		message.channel.send("Reykunyu is a dictionary bot that allows you to look up the translation of Na'vi words.\n\n" +
				"**Use `!run lì'u` to translate the Na'vi word `lì'u` into English.**\n" +
				"Reykunyu understands most conjugated forms as well, and will automatically return the translation of the root word. " +
				"If you provide more than one word, it will translate all of them.\n\n" +
				"**Use `!find word` to find Na'vi words whose English definition contains `word`.**\n" +
				"Alternatively, `!finde`, `!trouve`, and `!vind` allow you to search in German, French, or Dutch.\n\n" +
				"**Use `!tslam sentence` to run a grammar analyzer on your sentence.**\n" +
				"This will produce a translation if it could understand the sentence, or an error message if it could not " +
				"(because either your sentence was incorrect, or Reykunyu wasn't smart enough to understand it). " +
				"Be aware: this is experimental, so it may produce incorrect results, and works for very simple sentences only.\n\n" +
				"Reykunyu responds to DMs as well, and in that case you can omit `!run`. " +
				"You can also use Reykunyu's website with more functionality (conjugation tables, word sources, ...): https://reykunyu.wimiso.nl/");
		return;
	}

	let query = text;

	if (text.startsWith('!run ')) {
		query = text.substring(5);
		doNaviSearch(query, message);
	} else if (text.startsWith('!find ')) {
		query = text.substring(6);
		doReverseSearch(query, 'en', message);
	} else if (text.startsWith('!finde ')) {
		query = text.substring(7);
		doReverseSearch(query, 'de', message);
	} else if (text.startsWith('!trouve ')) {
		query = text.substring(8);
		doReverseSearch(query, 'fr', message);
	} else if (text.startsWith('!vind ')) {
		query = text.substring(6);
		doReverseSearch(query, 'nl', message);
	} else if (text.startsWith('!tslam ')) {
		query = text.substring(7);
		doParse(query, message);
	} else if (message.channel.type === "dm") {
		doNaviSearch(text, message);
	} else {
		return;
	}

	if (query.startsWith('-r')) {
		message.channel.send("(Want to search for an English word? Try `!find` instead of `!run`, or type `!run help` for more information.)");
	} else if (query.startsWith('-')) {
		message.channel.send("(Trying to get help with Reykunyu? Type `!run help` for more information.)");
	}
});

async function doNaviSearch(query, message) {
	const response = await fetch('https://reykunyu.wimiso.nl/api/fwew?tìpawm=' + encodeURIComponent(query))
		.then(response => response.json())
		.catch(error => {
			message.channel.send("Something went wrong while searching. This shouldn't happen, so let me ping <@163315929760006144> to get the issue fixed.")
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

		if ((r["type"] === "n" || r["type"] === "n:pr" || r.hasOwnProperty("conjugation")) && r["conjugated"]["result"].toLowerCase() !== r["conjugated"]["root"].toLowerCase()) {
			text += '    ';
			text += nounConjugation(r["conjugated"]);
			text += '\n';
		}

		if (r["type"].substring(0, 2) === "v:" && r["conjugated"]["result"].toLowerCase() !== r["conjugated"]["root"].toLowerCase()) {
			text += '    ';
			text += verbConjugation(r["conjugated"]);
			text += '\n';
		}

		if (r["type"] === "adj" && r["conjugated"]["form"] !== "predicative") {
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
		text += '**' + conjugation["result"] + '**';
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
		text += '**' + conjugation["result"] + '**';
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
		text += '**' + conjugation["result"] + '**';
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
	if (!channelName) {
		channelName = "";
	}
	let guildName = "";
	if (message.guild) {
		guildName = message.guild.name;
	}
	if ((channelName.includes("deutsch") || guildName === "Deutsche Na'vi Lerngruppe") &&
			translation.hasOwnProperty("de")) {
		return translation["de"];
	} else if ((channelName.includes("français")) &&
			translation.hasOwnProperty("fr")) {
		return translation["fr"];
	} else if ((channelName.includes("nederlands")) &&
			translation.hasOwnProperty("nl")) {
		return translation["nl"];
	} else {
		return translation["en"];
	}
}

async function doReverseSearch(query, language, message) {
	const response = await fetch('https://reykunyu.wimiso.nl/api/search?language=' + language + '&query=' + query)
		.then(response => response.json())
		.catch(error => {
			message.channel.send("Something went wrong while searching. This shouldn't happen, so let me ping <@163315929760006144> to get the issue fixed.")
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

async function doParse(query, message) {

	if (query.toLowerCase().indexOf('futa futa futa') !== -1) {
		message.react('716455202416361522');
		message.channel.send("Futa futa futa? Nìngay srak, ma " + message.member + "?");
	}

	let text = "";
	
	const parseResults = await fetch('https://reykunyu.wimiso.nl/api/parse?tìpawm=' + query)
		.then(response => response.json())
		.catch(error => {
			message.channel.send("Something went wrong while parsing. This shouldn't happen, so let me ping <@163315929760006144> to get the issue fixed.")
			return;
		});

	if (parseResults) {
		let correct = parseResults[0]['errors'].length === 0;
		let lastTranslation = null;
		for (let i = 0; i < parseResults.length; i++) {
			let result = parseResults[i];
			if (i > 0 && result.penalty > parseResults[0].penalty) {
				break;
			}
			for (let j = 0; j < result['errors'].length; j++) {
				text += ":warning: " + result['errors'][j].replace(/[\[\]]/g, '**') + "\n";
			}
			let translation = result.translation;
			if (correct && translation !== lastTranslation) {
				text += outputTree(result.parseTree, "> ", "> ");
				text += "→ \"" + translation + "\"";
				lastTranslation = translation;
			}
		}
	}

	message.channel.send(text);
}

function outputTree(tree, prefix1 = '', prefix2 = '', role = null) {

	let output = '';
	
	let mainText = '';
	if (role) {
		mainText += '*' + role + ':* ';
	}
	mainText += '**' + tree['word'] + '**';
	if (tree['translation']) {
		mainText += '  → "' + tree['translation'] + '"';
	}
	output += prefix1 + mainText + '\n';

	if (tree['children']) {
		let prefixLength = 1;
		for (let i = 0; i < tree['children'].length; i++) {
			if (i === tree['children'].length - 1) {
				output += outputTree(tree['children'][i],
					prefix2 + spaces(prefixLength) + "・",
					prefix2 + spaces(prefixLength + 1),
					tree['roles'][i]);
			} else {
				output += outputTree(tree['children'][i],
					prefix2 + spaces(prefixLength) + "・",
					prefix2 + spaces(prefixLength + 1),
					tree['roles'][i]);
			}
		}
	}

	return output;
}

function spaces(n) {
	return Array(n + 1).join('　');
}

