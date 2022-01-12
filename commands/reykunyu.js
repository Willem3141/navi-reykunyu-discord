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
		.setName('reykunyu')
		.setDescription('Allows you to customize your Reykunyu settings')
		.addSubcommand(subcommand =>
				subcommand
					.setName('language')
					.setDescription('Sets your default search language when using Reykunyu in DMs')
					.addStringOption(option =>
						option.setName('language')
						.setDescription('The two-letter code of your preferred language (en, de, fr, nl)')
						.setRequired(true))
				),

	execute: async function (interaction) {
		await interaction.reply({
			'content': 'Sorry, setting your language isn\'t supported just yet!'
		});
	}
};

