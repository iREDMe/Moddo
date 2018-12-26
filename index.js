/* eslint-disable indent */

const { Client, MessageEmbed } = require('discord.js');
const client = new Client({ disabledEvents: ['TYPING_START'] });
const fs = require('fs');
const prefix = 'm!';

require('dotenv').config();

client.util = require('./util.js');
client.embed = MessageEmbed;
client.categories = {
	GENERAL: 'General',
	MODERATION: 'Moderation',
	OWNER: 'Owner-Only',
	RESTRICTED: 'Restricted'
};

const commands = new Map();
const commandsFound = fs.readdirSync('./commands/')
	.filter(file => file.endsWith('.js'))
	.map(file => file.replace('.js', ''));

for (const command of commandsFound) commands.set(command, require(`./commands/${command}.js`));

client // READY
	.on('ready', () => {
		console.log('Reporting for duty!');
		client.user.setPresence({ activity: { name: `${prefix}embed`, type: 'LISTENING' } });
	}) // MESSAGE
	.on('message', async message => {
		if (message.author.bot || !message.content.startsWith(prefix)) return;
		const [command, ...args] = message.content.slice(prefix.length).split(/ +/g);
		if (!commands.has(command)) return;
		const { run, security } = commands.get(command);
		if (client.categories[security] === 'Owner-Only' && message.member.id !== message.guild.owner.id) return;
		else if (client.categories[security] === 'Restricted' && message.author.id !== process.env.userID) return;
		try {
			await run(client, message, args, prefix);
		} catch (error) {
			message.channel.send('An error has occured!');
			console.log(error);
		}
	});

client.login(process.env.token);

const http = require('http');
const express = require('express')();
express.get('/', (e, r) => {
	r.sendStatus(200);
}).listen(3000);
setInterval(() => {
	http.get('http://moddo-embed.glitch.me/');
}, 280000);