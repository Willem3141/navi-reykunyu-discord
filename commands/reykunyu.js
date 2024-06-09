const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reykunyu')
		.setDescription('Allows you to customize your Reykunyu settings.')
		.addSubcommand(subcommand =>
				subcommand
					.setName('defaults')
					.setDescription('Sets your default search options when using /run.')
					.addBooleanOption(option =>
							option.setName('ipa')
							.setDescription('If True, Reykunyu will show pronunciations using IPA.'))
					.addBooleanOption(option =>
							option.setName('detailed')
							.setDescription('If True, Reykunyu will include detailed information such as etymology and sources.'))
				)
		.addSubcommand(subcommand =>
				subcommand
					.setName('language')
					.setDescription('Sets your search language. (Applies only in DMs: in channels, Reykunyu uses the channel language.)')
					.addStringOption(option =>
						option.setName('language')
						.setDescription('The two-letter code of your preferred language (en, de, fr, nl).')
						.setRequired(true))
				),

	execute: async function (interaction) {
		await interaction.reply({
			'content': 'Sorry, saving your Reykunyu settings isn\'t supported just yet!'
		});
	}
};

