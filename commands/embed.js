exports.run = (client, message, args, prefix) => {
	const embed = new client.embed();
	if (!args.length) {
		embed.setTitle('Create Your Own Embed!');
		embed.setDescription('**All Possible Fields:**\n'
		+ 'title, description, color, image, '
		+ 'thumbnail, footer, author, field#, '
		+ 'blankfield#, timestamp, authorurl, authoricon, '
		+ 'footericon, ');
		embed.addField('Examples', `${prefix}embed title: Ur mom gay | description: no U\n`
		+ `${prefix}embed color: #ff00ff | title: I am the POOTIS MAN | timestamp: 420\n`
		+ `${prefix}embed color: 0x455555 | author: Nope | authoricon: https://no.u/ | timestamp: current\n`
		+ `${prefix}embed field1: FieldTitle, FieldContents, isInline? | field3: Sandvich, Make Me STRONG, yes | blankField2: inline? | blankField4 | blankField5: ok | color: #ff00ff`);
		return message.channel.send(embed);
	}
	const info = client.util.objectify(message);
	try {
		if (info.title) embed.setTitle(info.title);
		if (info.description) embed.setDescription(info.description);
		if (info.color) embed.setColor(info.color);
		if (info.thumbnail) embed.setThumbnail(info.thumbnail);
		if (info.image) embed.setImage(info.image);
		if (info.author) embed.setAuthor(info.author, info.authoricon ? info.authoricon : null, info.authorurl ? info.authorurl : null);
		if (info.footer) embed.setFooter(info.footer, info.footericon ? info.footericon : null);
		const keys = Object.keys(info);
		if (keys.some(i => i.match(/\bfield\d+\b/) || i.match(/\bblankfield\d+\b/))) {
			const fields = keys.filter(i => i.match(/\bfield\d+\b/) || i.match(/\bblankfield\d+\b/)).sort((a, b) => {
				const [num1, num2] = [a, b].map(i => parseInt(i.match(/\d+/)[0]));
				return num1 - num2;
			});
			if (fields.length > 25) throw new Error('Maximum 25 fields in an embed.');
			for (const field of fields) {
				if (field.match(/\bblankfield\d+\b/)) {
					embed.addBlankField(info[field] ? true : false);
				} else {
					const [title, contents, inline] = info[field].split(', ');
					embed.addField(title, contents, inline ? true : false);
				}
			}
		}
		if (info.timestamp) {
			if (parseInt(info.timestamp)) embed.setTimestamp(parseInt(info.timestamp));
			else if (info.timestamp === 'current') embed.setTimestamp();
			else throw new Error('Timestamp must be \'current\' OR a number greater or less than 0.');
		}
		return message.channel.send(embed);
	} catch (error) {
		return message.channel.send(`${error}`);
	}
};

exports.security = 'GENERAL';