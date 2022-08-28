const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const fetch = require('node-fetch');

function tokenize(text) {
	text = text.replace('.', ' . ');
	text = text.replace(',', ' , ');
	text = text.replace('/', ' / ');
	text = text.replace('-', ' - ');
	text = text.replace(':', ' : ');
	text = text.replace(';', ' ; ');
	text = text.replace('!', ' ! ');
	text = text.replace('?', ' ? ');
	text = text.replace('(', ' ( ');
	text = text.replace(')', ' ) ');
	text = text.replace('  ', ' ');
	return text.split(' ');
}

async function lemmatize(word) {

	let r = await fetch('https://reykunyu.wimiso.nl/api/fwew?tìpawm=' + encodeURIComponent(word))
			.then(r => r.json());

	if (r.length != 1) {
		return word;
	}
	let query = r[0]['tìpawm'];
	let result = r[0]['sì\'eyng'];
	if (result.length === 0) {
		return word;
	}
	if (query === result[0]['na\'vi']) {
		return word;
	}
	if (!(result[0].hasOwnProperty('affixes'))) {
		return word;
	}
	let tokenized = result[0]['na\'vi'];
	for (let affix of result[0]['affixes']) {
		if (affix['type'] === 'prefix') {
			tokenized = affix['affix']['na\'vi'] + '- ' + tokenized;
		} else if (affix['type'] === 'suffix') {
			tokenized = tokenized + ' -' + affix['affix']['na\'vi'];
		} else if (affix['type'] === 'infix') {
			tokenized = tokenized + ' <' + affix['affix']['na\'vi'] + '>';
		}
	}
	return tokenized;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ralpeng')
		.setDescription('"Translates" a Na\'vi sentence to English')
		.addStringOption(option =>
				option.setName('input')
				.setDescription('The sentence to translate')
				.setRequired(true))
		.addBooleanOption(option =>
				option.setName('private')
				.setDescription('If True, then Reykunyu will show the results only to you rather than publicly')),

	execute: async function (interaction) {
		console.log('hi 1');
		const query = interaction.options.getString('input');
		let tokenized = tokenize(query);
		for (let i = 0; i < tokenized.length; i++) {
			tokenized[i] = await lemmatize(tokenized[i]);
		}
		tokenized = tokenized.join(' ');
		console.log('query: ' + tokenized);
		try {
			console.log('hi 5');
			response = await fetch('http://navi-translator.wimiso.nl/translator/translate', {
					"method": "POST",
					"headers": {
						"Content-Type": "application/json"
					},
					body: JSON.stringify([{"id": 0, "src": tokenized}])
				})
				.then(response => response.json());
			console.log('hi 6');
		} catch (e) {
			await interaction.reply({
				'content': 'Something went wrong while translating. Probably the translation server blew up or something... let me ping <@163315929760006144> to get the issue fixed.',
				'ephemeral': interaction.options.getBoolean('private')
			});
		}
		console.log('hi 2');
		let translation = response[0][0]["tgt"];
		translation = translation.split(' ');
		for (let i = 0; i < translation.length; i++) {
			if (translation[i] === 'i') {
				translation[i] = 'I';
			}
			if (translation[i] === 'neytiri') {
				translation[i] = 'Neytiri';
			}
			if (translation[i] === 'ninat') {
				translation[i] = 'Ninat';
			}
			if (translation[i] === 'jake') {
				translation[i] = 'Jake';
			}
			if (translation[i] === 'pandora') {
				translation[i] = 'Pandora';
			}
		}
		translation = translation.join(' ');
		translation = translation.replace(' .', '.');
		translation = translation.replace(' ,', ',');
		translation = translation.replace(' / ', '/');
		translation = translation.replace(' :', ':');
		translation = translation.replace(' ;', ';');
		translation = translation.replace(' !', '!');
		translation = translation.replace(' ?', '?');
		translation = translation.replace('( ', '(');
		translation = translation.replace(' )', ')');
		translation = translation.replace('  ', ' ');

		console.log('hi 3');
		console.log('translation ' + translation);

		await interaction.reply({
			'content': "> **" + query + "**\n> " + translation + "\n> :warning: *This is a machine learning experiment. In most cases, these translations make no sense at all. So have fun playing around with this ‘translator’, but don't take it too serious!*",
			'ephemeral': interaction.options.getBoolean('private')
		});
		console.log('hi 4');
	}
};

