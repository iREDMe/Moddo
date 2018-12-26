const { inspect } = require('util');
// const base = require('sqlite3').verbose().Database;

class util {
	constructor() { throw new Error('Not to be instantiated.'); }

	static get configuration() {
		return {
			test: {
				activated: false,
				otherConfig: ['sand', 0, 'bitch'],
			},
			welcome: {
				activated: false,
				message: 'Welcome to $guild, $user!',
				channel: null,
				role: null,
				waitBeforeRole: 0
			}
		};
	}

	static get configurationDescriptions() {
		return {
			activated: 'Whether or not the module is enabled.',
			otherConfig: 'Test.',
			message: 'The message to output when a user joins the server.',
			channel: 'The channel to send the message to.',
			role: 'The role to automatically give to the user.',
			waitBeforeRole: 'The number of MILLISECONDS to wait until giving the role to the user.'
		};
	}

	static get prefix() {
		return 'm!';
	}

	static get MENTION_PATTERN() {
		return /<@!?(\d+)>/gi;
	}

	static info(g) {
		return { $guildID: g.id, $prefix: this.prefix, $config: this.configuration };
	}

	static shortenConfiguration() {
		const result = {};
		const valuesOfConfig = Object.values(this.configuration).map(i => Object.values(i));
		const keysOfConfig = Object.values(this.configuration).map(i => '$' + Object.keys(i));
		for (let i = 0; i < keysOfConfig.length; i++) {
			for (let j = 0; j < keysOfConfig[i].length; j++) {
				result[keysOfConfig[i]] = valuesOfConfig[i];
			}
		}
		return result;
	}

	static log(message) {
		return console.log('\x1b[31m%s\x1b[0m', inspect(message));
	}

	static replace(string, search, replacement) {
		let t = string;
		for (let i = 0; i < search.length; i++) t = t.split(search[i]).join(replacement[i]);
		return t;
	}

	static random(number) {
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
		let text = '';
		for (let i = 0; i < number; i++) text += possible[Math.floor(Math.random() * possible.length)];
		return text;
	}

	static clean(text) {
		if (typeof text === 'string') return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
		else return text;
	}

	static table(data) {
		return Object.keys(data).map(i => `${i} | ${inspect(data[i])}`).join('\n');
	}

	static resetAllGuilds(client) {
		client.database.run('DROP TABLE Guild', () => this.ensureGuildsInDatabase(client));
	}

	static ensureGuildsInDatabase(client) {
		client.database.run(`CREATE TABLE IF NOT EXISTS Guild (
					guildID TEXT NOT NULL,
					prefix TEXT NOT NULL,
					config BLOB )`, (e) => this.fetchAllGuilds(e, client));
	}

	static fetchAllGuilds(error, client) {
		if (error) return this.log(error);
		client.database.all('SELECT guildID FROM Guild', (e, allIDs) => this.ensureAllGuilds(e, client, allIDs.map(i => i.guildID)));
	}

	static ensureAllGuilds(error, client, guildIDs) {
		if (error) return this.log(error);
		console.log(guildIDs);
		for (const [, guild] of client.guilds.filter(g => !guildIDs.includes(g.id))) this.addGuildToDatabase(client, guild);
	}

	static addGuildToDatabase(client, guild) {
		return client.database.run('INSERT INTO Guild (guildID, prefix, config) VALUES ($guildID, $prefix, $config)',
			this.info(guild),
			(e) => {
				if (e) return this.log(`--> Adding ${guild} <--\n\n${e}`);
				else console.log(`${guild} saved to Database.`);
			});
	}

	static removeGuildFromDatabase(client, guild) {
		return client.database.run(`DELETE FROM Guild WHERE id = ${guild.id}`,
			(e) => {
				if (e) return this.log(e);
				else console.log(`${guild} deleted from Database.`);
			});
	}

	static trim(str) {
		return str.trim().toLowerCase();
	}

	static mentions(message) {
		if (!message.mentions.members.size) return [];
		return message.content.match(this.MENTION_PATTERN).map(mention => {
			let id = mention.slice(2, -1);
			if (id.startsWith('!')) id = id.slice(1);
			return id;
		});
	}

	static async mentionMembers(client, message) {
		const data = this.mentions(message).map(async i => message.guild.members.get(i) || await message.guild.members.fetch(i));
		return data;
	}

	static objectify(message) {
		const values = message.content.split(/ +/g).slice(1).join(' ').split(' | ');
		const returnValue = {};
		for (const value of values) {
			const [a, b] = value.split(': ');
			returnValue[this.trim(a)] = b;
		}
		return returnValue;
	}

	static keyValue(arr) {
		const obj = {};
		for (const i of arr) obj[i] = i;
		return obj;
	}
}

module.exports = util;