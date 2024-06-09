const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const fetch = require('node-fetch');

const utils = require('../utils');
const _ = require('../ui-translations.js');

const annotatedSearcher = require('../searchers/annotated');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('annotated')
		.setDescription('Searches in the Annotated Dictionary for usage examples.')
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
		let reply = await annotatedSearcher.search(query, language);
		if (typeof reply === 'string') {
			await interaction.reply({
				'content': utils.truncate(reply),
				'ephemeral': interaction.options.getBoolean('private')
			});
		} else {
			await interaction.reply({
				'embeds': reply,
				'ephemeral': interaction.options.getBoolean('private')
			});
		}
	}
};

