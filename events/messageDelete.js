const Discord = require('discord.js');
const fs = require('fs');

function extension(attachment) {
	const imageLink = attachment.split('.');
	const typeOfImage = imageLink[imageLink.length - 1];
	const image = /(jpg|jpeg|png|gif)/gi.test(typeOfImage);
	if(!image) return '';
	return attachment;
}

module.exports = (client, message) => {

	if (message.author.bot) return;

	const image = message.attachments.size > 0 ? extension(message.attachments.array()[0].proxyURL) : false;

	message.content.replace('\n', '');

	if(message.content.length > 200) {
		message.content = message.content.slice(0, 200) + ' ...';
	}

	const snipe = client.snipeMap.get(message.channel.id);

	if(!snipe) {
		client.snipeMap.set(message.channel.id, [[message, image]]);
	}
	else if(snipe.length >= 0) {
		client.snipeMap.get(message.channel.id).pop();
		client.snipeMap.get(message.channel.id).unshift([message, image]);
	}
	else {
		client.snipeMap.get(message.guild.id).unshift([message, image]);
	}
	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[message.guild.id]) {
		logsetting[message.guild.id] = {
			checker: 1,
		};
	}
	if(!log[message.guild.id]) return;
	const values = logsetting[message.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = message.guild.channels.cache.get(`${log[message.guild.id].channel}`);
		if(!logChannel) return;

		const embed = new Discord.MessageEmbed()
			.setAuthor('Message Deleted', message.guild.iconURL({ dynamic: true }))
			.setColor('RANDOM')
			.setDescription(`User: <@${message.author.id}>\nChannel: <#${message.channel.id}>`)
			.addField('Message:', message.content ? message.content : '[IMAGE WAS DELETED]')
			.setTimestamp()
			.setFooter(`ID: ${message.id}`);

		logChannel.send(embed);
	}
};