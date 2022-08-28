const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const fetch = require('node-fetch');

const nouns = require('../nouns');
const queryStore = require('../queryStore');
const utils = require('../utils');

const naviSearcher = require('../searchers/navi');
const englishSearcher = require('../searchers/english');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pam')
		.setDescription('Returns an audio clip of a Na\'vi word')
		.addStringOption(option =>
				option.setName('input')
				.setDescription('The word or sentence to search for')
				.setRequired(true))
		.addBooleanOption(option =>
				option.setName('private')
				.setDescription('If True, then Reykunyu will show the results only to you rather than publicly')),

	execute: async function (interaction) {
		const query = interaction.options.getString('input');
		const language = utils.getLanguage(interaction);
		let response;
		try {
			response = await fetch('https://reykunyu.wimiso.nl/api/fwew?tìpawm=' + encodeURIComponent(query))
				.then(response => response.json());
		} catch (e) {
			await interaction.reply({
				'content': 'Something went wrong while searching. This shouldn\'t happen, so let me ping <@163315929760006144> to get the issue fixed.',
				'ephemeral': interaction.options.getBoolean('private')
			});
		}

		let result = response[0]['sì\'eyng']
		if (result.length === 0) {
			await interaction.reply({
				'content': 'No results found for **' + query + '**.',
				'ephemeral': true
			});
			return;
		}
		let word = result[0];

		if (!word.hasOwnProperty('pronunciation') || word['pronunciation'].length < 3) {
			await interaction.reply({
				'content': 'Unfortunately, I don\'t have audio clips for **' + word['na\'vi'] + '**.',
				'ephemeral': true
			});
			return;
		}
		const pronunciation = word['pronunciation'][2];

		let text = 'Pronunciation of **' + word['na\'vi'] + '**';
		const index = Math.floor(Math.random() * pronunciation.length);
		const audio = pronunciation[index];
		files = [{
			'attachment': '../navi-reykunyu/fam/' + audio['file'],
			'name': 'sound.mp3'
		}];
		text += ' (by ' + audio['speaker'] + '):';

		await interaction.reply({
			'content': text,
			'ephemeral': interaction.options.getBoolean('private'),
			'files': files
		});
	}
};

