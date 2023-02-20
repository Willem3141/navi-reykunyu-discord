const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

const queryStore = require('./queryStore');

module.exports = {
	getLanguage: getLanguage,
	getLanguageName: getLanguageName,
	createButtonRow: createButtonRow,
	createRandomButtonRow: createRandomButtonRow,
	truncate: truncate,
	markdownLink: markdownLink
};

function getLanguage(interaction) {
	let channelName = "";
	if (interaction.channel && interaction.channel.name) {
		channelName = interaction.channel.name;
	}
	let guildName = "";
	if (interaction.guild && interaction.guild.name) {
		guildName = interaction.guild.name;
	}
	if (channelName.includes("deutsch") || guildName === "Deutsche Na'vi Lerngruppe") {
		return 'de';
	} else if (channelName.includes("français")) {
		return 'fr';
	} else if (channelName.includes("nederlands")) {
		return 'nl';
	} else if (channelName.includes("nìna’vi-nì’aw")) {
		return 'x-navi';
	}
	return 'en';
}

function getLanguageName(code) {
	if (code === 'de') {
		return 'Deutsch';
	} else if (code === 'fr') {
		return 'Français';
	} else if (code === 'nl') {
		return 'Nederlands';
	} else if (code === 'x-navi') {
		return 'Na’vi';
	}
	return 'English';
}

function createButtonRow(query, language, mode) {
	language = getLanguageName(language);
	let buttonRow = new MessageActionRow().addComponents(
			new MessageSelectMenu()
			.setCustomId('mode-' + queryStore.getKeyFor(query))
			.addOptions([
				{
					'label': 'Na\'vi → ' + language,
					'description': `Enter a Na\'vi word or sentence, get the ${language} translation`,
					'value': 'navi',
					'default': mode === 'navi'
				},
				{
					'label': language + ' → Na\'vi',
					'description': `Enter word in ${language}, get matching Na\'vi words`,
					'value': 'english',
					'default': mode === 'english'
				},
				{
					'label': 'Annotated Dictionary',
					'description': 'Search Plumps\' Annotated Dictionary for usage examples',
					'value': 'annotated',
					'default': mode === 'annotated'
				}
			])
		);
	return buttonRow;
}

function createRandomButtonRow() {
	const buttonRow = new MessageActionRow().addComponents(
			new MessageButton()
			.setCustomId('another-word-button')
			.setLabel('Pick another word')
			.setStyle('SECONDARY')
			);
	return buttonRow;
}

function truncate(text) {
	const limit = 1800;
	if (text.length < limit) {
		return text;
	}
	return text.substring(0, limit) + ' [...]';
}

function markdownLink(text, url) {
	url = url.replaceAll(' ', '%20');
	return "[" + text + "](<" + url + ">)";
}

