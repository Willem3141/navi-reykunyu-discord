const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');

const fetch = require('node-fetch');

const queryStore = require('../queryStore');
const utils = require('../utils');
const naviSearcher = require('../searchers/navi');
const englishSearcher = require('../searchers/english');
const annotatedSearcher = require('../searchers/annotated');

module.exports = {
	name: 'interactionCreate',
	async execute(client, interaction) {
		const language = utils.getLanguage(interaction);

		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) {
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}

		if (interaction.isAutocomplete()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) {
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		}
	}
};

