const { MessageActionRow, MessageSelectMenu } = require('discord.js');

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

		if (interaction.isSelectMenu()) {
			const key = interaction.customId.substring(5);  // remove "mode-"
			const query = queryStore.retrieveQueryFor(key);
			const value = interaction.values[0];
			const buttonRow = utils.createButtonRow(query, language, value);
			let content = '';
			if (value === 'navi') {
				content = await naviSearcher.search(query, language);
			} else if (value === 'english') {
				content = await englishSearcher.search(query, language);
			} else if (value === 'annotated') {
				content = await annotatedSearcher.search(query, language);
			}
			if (content.startsWith('No results')) {
				content = `**${query}**: ${content}`;
			}
			interaction.update({
				'content': utils.truncate(content),
				'components': [buttonRow]
			});
			return;
		}

		if (interaction.isButton()) {
			if (Math.random() < 0.001) {
				interaction.reply({
					'content': 'Uhm yeah you want another word? Not gonna happen'
				});
			} else {
				const response = await fetch('https://reykunyu.wimiso.nl/api/random?holpxay=1')
					.then(response => response.json())
					.catch(async function (error) {
						await interaction.reply({
							'content': 'Something went wrong while getting your random words. ' +
								'This shouldn\'t happen, so let me ping <@163315929760006144> to get the issue fixed.'
						});
						return;
					});
				const buttonRow = utils.createRandomButtonRow();
				await interaction.reply({
					'content': naviSearcher.getSingleWordResult(response, [], language)
				});
			}
			return;
		}

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
};

