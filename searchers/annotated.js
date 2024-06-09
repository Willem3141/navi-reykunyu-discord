const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

const TurndownService = require('turndown');
const turndownService = new TurndownService({strongDelimiter: '**'});

module.exports = {
	search: search
};

async function search(query, language) {
	let response;
	try {
		response = await fetch('https://reykunyu.wimiso.nl/api/annotated/search?query=' + encodeURIComponent(query))
			.then(response => response.json());
	} catch (e) {
		return 'Something went wrong while searching. This shouldn\'t happen, so let me ping <@163315929760006144> to get the issue fixed.';
	}

	if (response.length === 0) {
		return 'No results found in the Annotated Dictionary.';
	}

	let embeds = [];

	for (let i = 0; i < response.length; i++) {
		text = turndownService.turndown(response[i]);
		// hack: fix broken links in Markdown
		text = text.replace(/\[\*\*([^*]*)\*\*\]\(([^)]*)\)/gm, '**[$1](https://reykunyu.lu$2)**');
		const embed = new MessageEmbed()
			.setColor(0x359BE9)
			.setDescription(text)
			.setFooter({'text': 'source: An Annotated Na\'vi Dictionary by Plumps, 2024-01-06'});
		embeds.push(embed);
	}

	return embeds;
};

