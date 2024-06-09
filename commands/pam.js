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
		.setDescription('Returns an audio clip of a Na\'vi word.')
		.addStringOption(option =>
				option.setName('input')
				.setDescription('Your search query (a single word).')
				.setRequired(true))
		.addBooleanOption(option =>
				option.setName('private')
				.setDescription('If True, Reykunyu will show the results only to you rather than publicly.')),

	execute: async function (interaction) {
		const query = interaction.options.getString('input');
		const language = utils.getLanguage(interaction);
		let response;
		try {
			response = await fetch('https://reykunyu.lu/api/fwew?tìpawm=' + encodeURIComponent(query))
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

		if (!word.hasOwnProperty('pronunciation') || word['pronunciation'].length === 0) {
			await interaction.reply({
				'content': 'Unfortunately, I don\'t know the pronunciation for **' + word['na\'vi'] + '**.',
				'ephemeral': true
			});
			return;
		}
		const pronunciation = word['pronunciation'][0];
		if (!pronunciation.hasOwnProperty('audio')) {
			await interaction.reply({
				'content': 'Unfortunately, I don\'t have audio clips for **' + word['na\'vi'] + '**.',
				'ephemeral': true
			});
			return;
		}
		const audio = pronunciation['audio'];
		let text = 'Pronunciation of **' + word['na\'vi'] + '**';
		const index = Math.floor(Math.random() * audio.length);
		const clip = audio[index];
		files = [{
			'attachment': '../navi-reykunyu/data/fam/' + clip['file'],
			'name': 'sound.mp3'
		}];
		text += ' (by ' + clip['speaker'] + '):';

		await interaction.reply({
			'content': text,
			'ephemeral': interaction.options.getBoolean('private'),
			'files': files
		});
	}
};

