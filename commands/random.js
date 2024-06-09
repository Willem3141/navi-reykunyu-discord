const { MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const fetch = require('node-fetch');

const naviSearcher = require('../searchers/navi');
const utils = require('../utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Picks random Na\'vi words.')
		.addIntegerOption(option =>
				option.setName('number')
				.setDescription('Number of words to pick.')
				.setRequired(false))
		.addStringOption(option =>
				option.setName('type')
				.setDescription('Pick only words of the given word type.')
				.setRequired(false)
				.addChoices({'name': 'noun', 'value': 'n'},
					{'name': 'adjective', 'value': 'adj'},
					{'name': 'verb (any type)', 'value': 'v:'},
					{'name': 'intransitive verb', 'value': 'v:in'},
					{'name': 'transitive verb', 'value': 'v:tr'},
					{'name': 'adverb', 'value': 'adv'},
					{'name': 'adposition', 'value': 'adp'},
					{'name': 'infix', 'value': 'aff:in'})),

	execute: async function (interaction) {
		let number = interaction.options.getInteger('number');
		if (number === null) {
			number = 1;
		}
		if (number < 1) {
			await interaction.reply({
				'content': 'Please request a positive number of random words.'
			});
			return;
		}
		let tooMany = false;
		if (number > 10) {
			number = 10;
			tooMany = true;
		}
		let type = interaction.options.getString('type');
		const response = await fetch('https://reykunyu.wimiso.nl/api/random?holpxay=' + number + '&fnel=' + type)
			.then(response => response.json())
			.catch(async function (error) {
				await interaction.reply({
					'content': 'Something went wrong while getting your random words. ' +
						'This shouldn\'t happen, so let me ping <@163315929760006144> to get the issue fixed.'
				});
				return;
			});

		const language = utils.getLanguage(interaction);
		if (number === 1) {
			await interaction.reply({
				'embeds': naviSearcher.getSingleWordResult(response, [], language)
			});
		} else {
			let text = '';

			for (let i = 0; i < response.length; i++) {
				if (i > 0) {
					text += '\n';
				}

				text += '**';
				text += response[i]['na\'vi'];
				text += '**';
				text += '    ';
				text += naviSearcher.singleLineResultMarkdown(response[i], language);
				text += naviSearcher.getTranslation(language, response[i]['translations'][0]);
			}

			if (tooMany) {
				text += '\n(returning at most 10 random words)';
			}
			await interaction.reply({
				'content': text
			});
		}
	}
};

