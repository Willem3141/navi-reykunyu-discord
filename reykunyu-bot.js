/**
 * Discord bot for Reykunyu
 */

const nouns = require('./nouns');

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
				"If you provide more than one word, it will translate all of them. "+
				"If you use `!run random`, Reykunyu will return a random word from the dictionary " +
				"(`!run random <number>` will return the specified number of random words).\n\n" +
				"**Use `!find word` to find Na'vi words whose English definition contains `word`.**\n" +
				"Alternatively, `!finde`, `!trouve`, and `!vind` allow you to search in German, French, or Dutch.\n\n" +
				/*"**Use `!tslam sentence` to run a grammar analyzer on your sentence.**\n" +
				"This will produce a translation if it could understand the sentence, or an error message if it could not " +
				"(because either your sentence was incorrect, or Reykunyu wasn't smart enough to understand it). " +
				"Be aware: this is experimental, so it may produce incorrect results, and works for very simple sentences only.\n\n" +*/
				"Reykunyu responds to DMs as well, and in that case you can omit `!run`." +
				"You can also use Reykunyu's website with more functionality (conjugation tables, word sources, ...): https://reykunyu.wimiso.nl/\n\n" +
				"Reykunyu is maintained by <@163315929760006144>, but uses data collected by many people; see `!run credits` for details.",
				{'allowedMentions': {'users': []}});
		return;
	}
	if (text.startsWith('!run random')) {
		doRandomWord(message);
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
	} else if (text.startsWith('!plltxe ')) {
		query = text.substring(8);
		doSpeak(query, message);
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
		sendSingleWordResult(response[0]['sì\'eyng'], response[0]['aysämok'], message);
	} else {
		sendSentenceResult(response, message, query);
	}
}

function sendSingleWordResult(result, suggestions, message) {

	if (result.length === 0) {
		if (suggestions.length) {
			suggestions = suggestions.map(a => "**" + a + "**");
			console.log(suggestions);
			message.channel.send('No results found.\n' +
					"(Did you mean " + suggestions.join(', ').replace(/, ([^,]*)$/, " or $1") + "?)"
					);
		} else {
			message.channel.send('No results found.');
		}
		return;
	}

	text = '';

	for (let i = 0; i < result.length; i++) {
		let r = result[i];
		text += '**'
		text += lemmaForm(r['na\'vi'], r['type']);
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

		if (r.hasOwnProperty("conjugated")) {
			let explanation = conjugation(r["conjugated"]);
			if (explanation) {
				text += '    ' + explanation + '\n';
			}
		}

		text += '    ';
		text += getTranslation(message, r['translations'][0]);

		text += '\n';

		if (r['meaning_note']) {
			text += '    *';
			text += r['meaning_note'];
			text += '*\n';
		}

		if (r["affixes"] && r["affixes"].length) {
			text += affixesSection(message, r["affixes"]);
		}

		if (r["conjugation"]) {
			text += nounConjugationSection(r["conjugation"]["forms"], r["conjugation_note"]);
		} else if (r["type"] === "n") {
			text += nounConjugationSection(createNounConjugation(r["na'vi"], r["type"], false), r["conjugation_note"]);
		} else if (r["type"] === "n:pr") {
			text += nounConjugationSection(createNounConjugation(r["na'vi"], r["type"], true), r["conjugation_note"]);
		//} else if (r["type"] === "adj") {
		//	$result.append(adjectiveConjugationSection(r["na'vi"], r["type"], r["conjugation_note"]));
		}
	}
	message.channel.send(text);

	for (let i = 0; i < result.length; i++) {
		let r = result[i];
		if (r['image']) {
			text = '';
			text += '\n' + r["na'vi"] + ' drawn by Eana Unil:';
			message.channel.send(text, {
				'file': 'https://reykunyu.wimiso.nl/ayrel/' + r['image']
			});
		}
	}
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
		"aff:suf": "suf."
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

function conjugation(conjugation, short) {
	let text = "";

	for (let i = 0; i < conjugation.length; i++) {
		let type = conjugation[i]["type"];
		let c = conjugation[i]["conjugation"];
		if (c["result"].toLowerCase() == c["root"].toLowerCase()) {
			continue;
		}
		
		if (text !== "") {
			text += short ? '; ' : '\n    ';
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

function verbToNounConjugation(conjugation, short) {
	let text = short ? '< ' : '→  ';
	
	text += conjugation["root"];
	
	text += " + ";
	text += conjugation["affixes"][0];
	
	if (!short) {
		text += "  =  ";
		text += '**' + conjugation["result"] + '**';
	}
	
	return text;
}

function affixesSection(message, affixes) {
	let text = "";
	for (let a of affixes) {
		const affix = a['affix'];
		text += '        **' + lemmaForm(affix["na'vi"], affix['type']) + "**    ";
		text += getTranslation(message, affix['translations'][0]);
		text += "\n";
	}
	return "    *Affixes:*\n" + text;
}

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
		text += lemmaForm(r['na\'vi'], r['type']);
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

function lemmaForm(word, type) {
	if (type === "n:si") {
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

	if (parseResults && parseResults['lexingErrors']) {
		for (let i = 0; i < parseResults['lexingErrors'].length; i++) {
			const error = parseResults['lexingErrors'][i];
			text += ":warning: " + error.replace(/[\[\]]/g, '**') + "\n";
		}
	}

	if (parseResults && parseResults['results'] && parseResults['results'].length) {
		let results = parseResults['results'];
		let correct = results[0]['errors'].length === 0;
		let lastTranslation = null;
		for (let i = 0; i < results.length; i++) {
			let result = results[i];
			if (i > 0 && result.penalty > results[0].penalty) {
				break;
			}
			if (i > 0) {
				text += "\n\n";
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
	} else {
		text += "Your sentence could not be parsed.\n";
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

async function doRandomWord(message) {
	let text = message.content;
	text = text.replace("!run random", "");
	text = text.trim();
	let number = 1;
	if (text !== "") {
		number = Number(text);
		if (isNaN(number) || number < 1 || !Number.isInteger(number)) {
			message.channel.send("If you want to indicate how many random words you want, please put a positive integer behind `!run random`.");
			return;
		}
	}
	let tooMany = false;
	if (number > 10) {
		number = 10;
		tooMany = true;
	}
	const response = await fetch('https://reykunyu.wimiso.nl/api/random?holpxay=' + number)
		.then(response => response.json())
		.catch(error => {
			message.channel.send("Something went wrong while getting your random words. This shouldn't happen, so let me ping <@163315929760006144> to get the issue fixed.")
			return;
		});
	console.log(response);

	if (number === 1) {
		sendSingleWordResult(response, [], message);
	} else {
		text = '';

		for (let i = 0; i < response.length; i++) {
			if (i > 0) {
				text += '\n';
			}

			text += '**'
			text += response[i]['na\'vi'];
			text += '**'
			text += '    '
			text += singleLineResultMarkdown(response[i], message);
			text += getTranslation(message, response[i]['translations'][0]);
		}

		if (tooMany) {
			text += '\n(returning at most 10 random words)';
		}

		message.channel.send(text);
	}
}

async function doSpeak(query, message) {
	query = query.split("-");
	const soundUrl = 'https://reykunyu.wimiso.nl/api/sound?word=' + encodeURIComponent(query[0]) + "&type=" + encodeURIComponent(query[1]);
	const response = await fetch(soundUrl)
		.then(response => {
			if (response.status !== 200) {
				throw "no sound file";
			}
		})
		.catch(error => {
			message.channel.send("There's no audio file available yet for **" + query[0] + "**.");
			return;
		});

	message.channel.send("Pronunciation of **" + query[0] + "**:", {
		"files": [{
			"attachment": "../navi-tsim/fam/" + query[0] + "-" + query[1] + ".mp3",
			"name": "sound.mp3"
		}]
	});
}

