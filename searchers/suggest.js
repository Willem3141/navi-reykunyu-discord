const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

const nouns = require('../nouns');
const utils = require('../utils');
const _ = require('../ui-translations');

module.exports = {
	search: search
};

async function search(query, language, ipa, detailed) {
	let response;
	try {
		response = await fetch('https://reykunyu.lu/api/mok?tìpawm=' + encodeURIComponent(query))
			.then(response => response.json());
	} catch (e) {
		return [];
	}

	let results = response['results'];

	if (response.length > 25) {
		response = response.slice(0, 25);
	}

	let resultObjects = [];
	for (let result of results) {
		resultObjects.push({'name': result['title'], 'value': result['title']});
	}

	return resultObjects;
};

