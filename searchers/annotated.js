const fetch = require('node-fetch');

const TurndownService = require('turndown');
const turndownService = new TurndownService({strongDelimiter: '`'});

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

	text = '';

	for (let i = 0; i < response.length; i++) {
		if (i > 0) {
			text += "\n\n";
		}
		text += '> ' + turndownService.turndown(response[i]).replace(/\n/g, '\n> ');
	}

	text += '\n*(source: An Annotated Na\'vi Dictionary by Plumps, 2021-05-09)*';
	return text;
};

