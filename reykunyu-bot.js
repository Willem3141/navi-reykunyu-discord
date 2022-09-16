/**
 * Discord bot for Reykunyu
 */

const nouns = require('./nouns');

const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

const fetch = require('node-fetch');

const { Client, Collection, Intents } = require('discord.js');
const intents = new Intents();
intents.add(Intents.FLAGS.GUILDS);
intents.add(Intents.FLAGS.GUILD_MESSAGES);
intents.add(Intents.FLAGS.DIRECT_MESSAGES);
const client = new Client({
    'intents': intents,
    'partials': ['CHANNEL']
});

const TurndownService = require('turndown');
const turndownService = new TurndownService({strongDelimiter: '`'});
turndownService.addRule('link', {
	filter: ['a'],
	replacement: function (content) {
		return content;
	}
});
turndownService.addRule('small-caps', {
	filter: function (node, options) {
		const nodeClass = node.getAttribute('class');
		return nodeClass === 'source-link';
	},
	replacement: function (content) {
		return '[' + content.toUpperCase() + ']';
	}
});

client.on('raw', packet => {
    console.log('hi!', packet);
});

// read events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
	console.log(`Registered event ${event.name}`);
}

// read commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
	console.log(`Registered command ${command.data.name}`);
}

client.login(config['token']);

client.on('messageCreate', async message => {
	console.log(message.channel);

	// some sanity checks
	if (message.author.bot) {
		return;
	}

	const text = message.content;

	if (text.startsWith('!run ')) {
		query = text.substring(5);
		sendSlashNudge(message);
	} else if (text.startsWith('!find ')) {
		query = text.substring(6);
		sendSlashNudge(message);
	} else if (text.startsWith('!finde ')) {
		query = text.substring(7);
		sendSlashNudge(message);
	} else if (text.startsWith('!trouve ')) {
		query = text.substring(8);
		sendSlashNudge(message);
	} else if (text.startsWith('!vind ')) {
		query = text.substring(6);
		sendSlashNudge(message);
	} else if (text.startsWith('!tslam ')) {
		query = text.substring(7);
		sendSlashNudge(message);
	} else if (text.startsWith('!plltxe ')) {
		query = text.substring(8);
		sendSlashNudge(message);
	} else if (text.startsWith('!ngampam ')) {
		query = text.substring(9);
		sendSlashNudge(message);
	} else if (text.startsWith('!annotated ')) {
		query = text.substring(11);
		sendSlashNudge(message);
	} else if (message.channel.type === "DM") {
		sendSlashNudge(message);
	} else {
		return;
	}
});

async function sendSlashNudge(message) {
    message.channel.send("> Kaltxì! ||Hi!|| Sorry for interrupting... Reykunyu moved to slash commands, so the old way of using `!run <word>` or `!find <word>` won't work anymore. Instead, you can use the slash command `/run <word>`, which works for both Na'vi-to-English and English-to-Na'vi searches.");
}

