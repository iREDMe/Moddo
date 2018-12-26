exports.run = async (client, message) => {
	const reply = await message.channel.send('A ping.');
	const timer = reply.createdTimestamp - message.createdTimestamp;
	reply.edit(`${reply.content} (Reply Speed: ${timer} | Heartbeat: ${client.ws.ping})`);
};

exports.security = 'GENERAL';