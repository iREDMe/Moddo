exports.run = async (client, message, args) => {
	const code = args.join(' ');
	const input = client.util.clean(code);
	const embed = new client.embed();

	try {
		const returned = eval(code);
		const evaled = typeof returned !== 'string' ? require('util').inspect(returned) : returned;
		const result = client.util.clean(evaled);
		const clear = client.util.replace(result, [client.token], [client.util.random(59)]);

		embed.setTitle('**Success!**');
		embed.setDescription('-----');
		embed.addField('**Code Input**', `\`\`\`js\n${input}\`\`\``);
		embed.addField('**Result**', `\`\`\`js\n${clear.length > 1000 ? 'Result too long; Displayed in Console' : clear}\`\`\``);
		embed.setTimestamp();
		embed.setColor('#00ff00');

		await message.channel.send(embed);
		console.log(client.util.clean(clear));
	} catch (err) {
		embed.setTitle('**Error Occurred!**');
		embed.setDescription('-----');
		embed.addField('**Code Input**', `\`\`\`js\n${input}\`\`\``);
		embed.addField('**Error Result**', `\`\`\`js\n${client.util.clean(err).length > 1000 ? 'ERROR too long?!!; Displayed in Console' : client.util.clean(err)}\`\`\``);
		embed.setTimestamp();
		embed.setColor('#00ff00');

		await message.channel.send(embed);
		console.log(client.util.clean(err));
	}
};

exports.security = 'RESTRICTED';