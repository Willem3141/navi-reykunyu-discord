const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { ContextMenuCommandType, ContextMenuCommandBuilder } = require('@discordjs/builders');

const fetch = require('node-fetch');

const utils = require('../utils');

const naviSearcher = require('../searchers/navi');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Search with Reykunyu')
		.setType(3),  // message command

	execute: async function (interaction) {
		const message = await interaction.channel.messages.fetch(interaction.targetId);
		const query = message.content;
		const language = utils.getLanguage(interaction);
		let reply = await naviSearcher.search(query, language);
		await interaction.reply({
			'content': utils.truncate(reply),
			'ephemeral': true
		});
	}
};

