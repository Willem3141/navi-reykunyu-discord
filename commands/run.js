const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const fetch = require('node-fetch');

const nouns = require('../nouns');
const queryStore = require('../queryStore');
const utils = require('../utils');
const _ = require('../ui-translations.js');

const naviSearcher = require('../searchers/navi');
const englishSearcher = require('../searchers/english');
const suggestSearcher = require('../searchers/suggest');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('run')
		.setDescription('Translates Na\'vi words into English.')
		.addStringOption(option =>
				option.setName('input')
				.setDescription('Your search query (word or sentence).')
				.setRequired(true)
				.setAutocomplete(true))
		.addBooleanOption(option =>
				option.setName('direction')
				.setDescription('The direction to search in (determined automatically when omitted).')
				/*.addChoices(
					{'name': 'Normal (from Na\'vi to your language)', 'value': 'normal'},
					{'name': 'Reversed (from your language to Na\'vi)', 'value': 'reversed'}
				)*/)
		.addBooleanOption(option =>
				option.setName('ipa')
				.setDescription('If True, Reykunyu will show pronunciations using IPA.'))
		.addBooleanOption(option =>
				option.setName('detailed')
				.setDescription('If True, Reykunyu will include detailed information such as etymology and sources.'))
		.addBooleanOption(option =>
				option.setName('private')
				.setDescription('If True, Reykunyu will show the results only to you rather than publicly.')),

	autocomplete: async function (interaction) {
		let suggestions = await suggestSearcher.search(interaction.options.getFocused());
		await interaction.respond(suggestions);
	},

	execute: async function (interaction) {
		const query = interaction.options.getString('input');
		const language = utils.getLanguage(interaction);
		//const ipa = interaction.options.getBoolean('ipa');
		const detailed = interaction.options.getBoolean('detailed');
		let mode = 'navi';
		let reply = await naviSearcher.search(query, language, true, detailed);
		if (typeof reply === 'string' && reply.startsWith(_('no-results-recognizer', language))) {
			englishReply = await englishSearcher.search(query, language);
			if (typeof englishReply !== 'string' || !englishReply.startsWith(_('no-results-recognizer', language))) {
				mode = 'english';
				reply = englishReply;
			} else {
				reply = [new MessageEmbed()
					.setColor(0xE9359B)
					.setDescription(`**${query}**: ${reply}`)];
			}
		}
		//const buttonRow = utils.createButtonRow(query, language, mode);
		if (typeof reply === 'string') {
			await interaction.reply({
				'content': utils.truncate(reply),
				//'components': [buttonRow],
				'ephemeral': interaction.options.getBoolean('private')
			});
		} else {
			await interaction.reply({
				'embeds': reply,
				//'components': [buttonRow],
				'ephemeral': interaction.options.getBoolean('private')
			});
		}
	}
};

