const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const fetch = require('node-fetch');

function outputTree(tree, prefix1 = '', prefix2 = '', role = null) {

	let output = '';
	
	let mainText = '';
	if (role) {
		mainText += '*' + role + ':* ';
	}
	mainText += '**' + tree['word'] + '**';
	if (tree['translation']) {
		mainText += '  → "' + tree['translation'] + '"';
	}
	output += prefix1 + mainText + '\n';

	if (tree['children']) {
		let prefixLength = 1;
		for (let i = 0; i < tree['children'].length; i++) {
			if (i === tree['children'].length - 1) {
				output += outputTree(tree['children'][i],
					prefix2 + spaces(prefixLength) + "・",
					prefix2 + spaces(prefixLength + 1),
					tree['roles'][i]);
			} else {
				output += outputTree(tree['children'][i],
					prefix2 + spaces(prefixLength) + "・",
					prefix2 + spaces(prefixLength + 1),
					tree['roles'][i]);
			}
		}
	}

	return output;
}

function spaces(n) {
	return Array(n + 1).join('　');
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tslam')
		.setDescription('Runs a grammar analyzer on a Na\'vi sentence. (Experimental!)')
		.addStringOption(option =>
				option.setName('input')
				.setDescription('Sentence to analyze.')
				.setRequired(true))
		.addBooleanOption(option =>
				option.setName('private')
				.setDescription('If True, Reykunyu will show the results only to you rather than publicly.')),

	execute: async function (interaction) {
		let text = "";

		const query = interaction.options.getString('input');
		
		let parseResults;
		try {
			parseResults = await fetch('https://reykunyu.lu/api/parse?tìpawm=' + query)
				.then(response => response.json());
		} catch (e) {
			await interaction.reply({
				'content': "Something went wrong while parsing. This shouldn't happen, so let me ping <@163315929760006144> to get the issue fixed.",
				'ephemeral': interaction.options.getBoolean('private')
			});
			return;
		}

		if (parseResults && parseResults['lexingErrors']) {
			for (let i = 0; i < parseResults['lexingErrors'].length; i++) {
				const error = parseResults['lexingErrors'][i];
				text += ":warning: " + error.replace(/[\[\]]/g, '**') + "\n";
			}
		}

		if (parseResults && parseResults['results'] && parseResults['results'].length) {
			let results = parseResults['results'];
			let correct = results[0]['errors'].length === 0;
			let lastTranslation = null;
			for (let i = 0; i < results.length; i++) {
				let result = results[i];
				if (i > 0 && result.penalty > results[0].penalty) {
					break;
				}
				if (i > 0) {
					text += "\n\n";
				}
				for (let j = 0; j < result['errors'].length; j++) {
					text += ":warning: " + result['errors'][j].replace(/[\[\]]/g, '**') + "\n";
				}
				let translation = result.translation;
				if (correct && translation !== lastTranslation) {
					text += outputTree(result.parseTree, "> ", "> ");
					text += "→ \"" + translation + "\"";
					lastTranslation = translation;
				}
			}
		} else {
			text += "Your sentence could not be parsed.\n";
		}

		await interaction.reply({
			'content': text,
			'ephemeral': interaction.options.getBoolean('private')
		});
	}
};

