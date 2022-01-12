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
		.setName('run')
		.setDescription('Translates Na\'vi words into English')
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
		let mode = 'navi';
		let reply = await naviSearcher.search(query, language);
		if (reply.startsWith('No results')) {
			englishReply = await englishSearcher.search(query, language);
			if (!englishReply.startsWith('No results')) {
				mode = 'english';
				reply = englishReply;
			} else {
				reply = `**${query}**: ${reply}`;
			}
		}
		const buttonRow = utils.createButtonRow(query, language, mode);
		await interaction.reply({
			'content': utils.truncate(reply),
			'components': [buttonRow],
			'ephemeral': interaction.options.getBoolean('private')
		});
	}
};

