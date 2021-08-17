// Copyright 2021 Mirabellier

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// 	http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'announce',
	category: '[✨] utility',
	example: `${bot_prefix}announce <channel>`,
	description: 'Sends an announcement to the channel',
	usage: '<channel>',
	run: async (client, message, args) => {

		if (!message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: true, checkOwner: true })) return message.channel.send('You don\'t have `MANAGE_CHANNELS` permission to use this command.');
		if (!args[0]) return message.channel.send(`**${message.author.username}**, The right syntax is \`${prefixes[message.guild.id]}announce <channel>\`.`);
		const channel = message.mentions.channels.first();
		if (!message.guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return message.channel.send('I do not have a permission to send a message in that channel');
		if (!channel || !message.guild.channels.cache.get(channel.id)) return message.channel.send('Please mention a valid #channel.');

		const embed = new Discord.MessageEmbed();
		embed.setColor('#36393F');

		await message.channel.send('An example where the certain slot will be placed');
		const example = new Discord.MessageEmbed()
			.setAuthor('Author', 'https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png')
			.setThumbnail('https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png')
			.setColor('#36393F')
			.setImage('https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png')
			.setTitle('Title')
			.setDescription('Description')
			.setFooter('Footer', 'https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png');
		await message.channel.send(example);
		let authorText;
		let footerText;
		const filter = m => m.author.id === message.author.id;
		await setTimeout(function() {
			message.channel.send('Limit: 256 characters\nTime: 30 seconds\nPlease provide a text for `author` slot. `skip` if you want to skip.');
		}, 1000);
		const author = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000,
		});
		if (!author.size) {
			return message.channel.send('Time is up.');
		}
		if (author.first().content.toLowerCase() === 'skip') {
			message.channel.send('skipped');
		}
		else {
			authorText = author.first().content;
			if (authorText.length > 256) return message.channel.send('The character is exceeding 256 characters. Command stopped.');
			await message.channel.send('Please type what the `author icon` would be.\n`Server Icon`, `Kanna Avatar`, `User Avatar` or you can attach any `attachment` (picture)?\n\nType `Skip` to skip.');
			const authorIcon = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 30000,
			});
			if (!authorIcon.size) {
				return message.channel.send('Time is up.');
			}
			if (authorIcon.first().attachments.first()) {
				embed.setAuthor(authorText, authorIcon.first().attachments.first().url);
			}
			else if (authorIcon.first().content.toLowerCase() === 'server icon') {
				embed.setAuthor(authorText, message.guild.iconURL());
			}
			else if (authorIcon.first().content.toLowerCase() === 'Kanna avatar') {
				embed.setAuthor(authorText, client.user.avatarURL());
			}
			else if (authorIcon.first().content.toLowerCase() === 'user avatar') {
				embed.setAuthor(authorText, message.author.displayAvatarURL({ dynamic: true }));
			}
			else if (authorIcon.first().content.toLowerCase() === 'skip') {
				embed.setAuthor(authorText);
			}
			else {
				return message.channel.send('Incorrect input. Stopped.');
			}
		}
		await message.channel.send('Limit: 256 characters\nTime: 30 seconds\nPlease provide a text for `title` slot. `skip` if you want to skip.');
		const title = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000,
		});
		if (!title.size) {
			return message.channel.send('Time is up.');
		}
		if (title.first().content.toLowerCase() === 'skip') {
			message.channel.send('skipped');
		}
		else {
			if (title.first().content.length > 256) return message.channel.send('The character is exceeding 256 characters. Command stopped.');
			await message.channel.send('any link you want to put? please send a link or type `skip` if you want to skip');
			const url = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 30000,
			});
			if (!url.size) {
				return message.channel.send('Time is up.');
			}
			if (url.first().content.toLowerCase() === 'skip') {
				embed.setTitle(title.first().content);
				message.channel.send('skipped');
			}
			else {
				embed.setTitle(title.first().content);
				embed.setURL(url.first().content);
			}
		}

		await message.channel.send('Limit: 2048 characters\nTime: 5 minutes\nPlease provide a text for `description` slot. `skip` if you want to skip.');
		const description = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 300000,
		});
		if (!description.size) {
			return message.channel.send('Time is up.');
		}
		if (description.first().content === 'skip') {
			message.channel.send('skipped');
		}
		else {
			if (description.first().content.length > 2048) return message.channel.send('The character is exceeding 2048 characters. Command stopped.');
			embed.setDescription(description.first().content);
		}

		await message.channel.send(embed);
		await message.channel.send('Limit: 2048 characters\nTime: 30 seconds\nPlease provide a text for `footer` slot. `skip` if you want to skip.');
		const footer = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000,
		});
		if (!footer.size) {
			return message.channel.send('Time is up.');
		}
		if (footer.first().content.toLowerCase() === 'skip') {
			message.channel.send('skipped');
		}
		else {
			footerText = footer.first().content;
			if (footerText .length > 2048) return message.channel.send('The character is exceeding 2048 characters. Command stopped.');
			await message.channel.send('Please type what the `footer icon` would be.\n`Server Icon`, `Kanna Avatar`, `User Avatar` or you can attach any `attachment` (picture)?\n\nType `Skip` to skip.');
			const footerIcon = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 30000,
			});
			if (!footerIcon.size) {
				return message.channel.send('Time is up.');
			}
			if (footerIcon.first().attachments.first()) {
				embed.setFooter(footerText, footerIcon.first().attachments.first().url);
			}
			else if (footerIcon.first().content.toLowerCase() === 'server icon') {
				embed.setFooter(footerText, message.guild.iconURL());
			}
			else if (footerIcon.first().content.toLowerCase() === 'Kanna avatar') {
				embed.setFooter(footerText, client.user.avatarURL());
			}
			else if (footerIcon.first().content.toLowerCase() === 'user avatar') {
				embed.setFooter(footerText, message.author.displayAvatarURL({ dynamic: true }));
			}
			else if (footerIcon.first().content.toLowerCase() === 'skip') {
				embed.setFooter(footerText);
			}
			else {
				return message.channel.send('Incorrect input. Stopped.');
			}
		}

		await message.channel.send(embed);
		await message.channel.send('What image on the `thumbnail` would be?\n`Server Icon`, `Kanna Avatar`, `User Icon` or you can send any attachment (picture)\n `skip` if you want to skip.');
		const thumbnail = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 90000,
		});
		if (!thumbnail.size) {
			return message.channel.send('Time is up.');
		}
		if (thumbnail.first().attachments.first()) {
			embed.setThumbnail(thumbnail.first().attachments.first().url);
		}
		else if (thumbnail.first().content.toLowerCase() === 'server icon') {
			embed.setThumbnail(message.guild.iconURL());
		}
		else if (thumbnail.first().content.toLowerCase() === 'Kanna avatar') {
			embed.setThumbnail(client.user.avatarURL());
		}
		else if (thumbnail.first().content.toLowerCase() === 'user avatar') {
			embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
		}
		else if (thumbnail.first().content.toLowerCase() === 'skip') {
			message.channel.send('skipped');
		}
		else {
			return message.channel.send('Incorrect input. Stopped.');
		}

		await message.channel.send(embed);
		await message.channel.send('What image you want to put?\nAttach an attachment to set it or `skip` if you want to skip.');
		const image = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 90000,
		});
		if (!image.size) {
			return message.channel.send('Time is up.');
		}
		if (image.first().attachments.first()) {
			embed.setImage(image.first().attachments.first().url);
		}
		else if (image.first().content.toLowerCase() === 'skip') {
			message.channel.send('skipped');
		}
		else {
			return message.channel.send('Incorrect input. stopped.');
		}

		await message.channel.send(embed);
		await message.channel.send('This is okay? (yes) (no)');
		const confirm = await message.channel.awaitMessages(filter, {
			max: 1,
			time: 30000,
		});
		if (!confirm.size) {
			return message.reply('Time is up.');
		}
		if (confirm.first().content.toLowerCase() === 'yes') {
			message.channel.send('Alright');
			channel.send(embed).catch(() => message.channel.send('I can\t send a message to that channel.'));
		}
		else if (confirm.first().content.toLowerCase() === 'no') {
			message.channel.send('Deleted.');
		}
		else {
			await message.channel.send('Last Attempt. This is okay? (yes) (no)');
			const confirm2 = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 30000,
			});
			if (!confirm2.size) {
				return message.reply('Time is up.');
			}
			if (confirm2.first().content.toLowerCase() === 'yes') {
				message.channel.send(`Alright. Sending it to ${channel}.`);
				channel.send(embed).catch(() => message.channel.send('I can\t send a message to that channel.'));
			}
			else if (confirm2.first().content.toLowerCase() === 'no') {
				message.channel.send('Deleted.');
			}
			else {
				message.channel.send('Deleted.');
			}
		}

	},
};