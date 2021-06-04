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
const fs = require('fs');
const file = require('../../database/welcome.json');

module.exports = {
	name: 'setwelcome',
	aliases: ['sw'],
	category: '[✨] utility',
	description: 'Welcome Message Configuration',
	example: `${bot_prefix}setwelcome <#channel | on | off>`,
	usage: '<#channel | on | off>',
	run: async (client, message, args) => {
		if (!message.member.hasPermission('MANAGE_CHANNELS', { checkAdmin: true, checkOwner: true })) return message.channel.send('You don\'t have `MANAGE_CHANNELS` permission to run this command.');

		if (message.mentions.channels.first()) {

			const channel = message.mentions.channels.first();

			if (!message.guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return message.channel.send('I do not have a permission to send a message in that channel.');

			if (channel.type !== 'text') return message.channel.send('Only Text channel is accepted');

			if (!file[message.guild.id]) {
				file[message.guild.id] = {
					channelID: null,
					switch: 'off',
					authorText: null,
					authorLink: null,
					titleText: null,
					titleLink: null,
					colorCode: null,
					thumbnailLink: null,
					descriptionText: null,
					imageLink: null,
					footerText: null,
					footerLink: null,
				};
			}

			const embed = new Discord.MessageEmbed();

			const example = new Discord.MessageEmbed()
				.setAuthor('Author', 'https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png')
				.setThumbnail('https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png')
				.setColor('#36393F')
				.setImage('https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png')
				.setTitle('Title')
				.setDescription('Description')
				.setFooter('Footer', 'https://www.femtoscientific.com/wp-content/uploads/2014/12/default_image_01.png');
			await message.channel.send(example);

			let authorText = null;
			let authorLink = null;
			let titleText = null;
			let titleLink = null;
			let colorCode = null;
			let thumbnailLink = null;
			let descriptionText = null;
			let imageLink = null;
			let footerText = null;
			let footerLink = null;

			const filter = m => m.author.id === message.author.id;
			await setTimeout(function() {
				message.channel.send({ embed: { description: 'Please provide a text for `author` slot\n`skip` to skip\n`cancel` to cancel\n`{username}` - username of the joined member\n`{tag}` - user tag of the joined member\n`{server}` - your server name\n`{membercount}` - your server member count' } });
			}, 1000);
			const author = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 180000,
			});
			if (!author.size) {
				return message.channel.send('Time is up.');
			}
			if (author.first().content.toLowerCase() === 'skip') {
				message.channel.send('skipped');
			}
			else if (author.first().content.toLowerCase() === 'cancel') {
				return message.channel.send('canceled');
			}
			else {
				authorText = author.first().content;
				if (authorText.length > 256) return message.channel.send('The input is exceeding 256 characters. Command stopped.');

				const authorText2 = authorText.replace('{username}', message.author.username);
				const authorText3 = authorText2.replace('{tag}', message.author.tag);
				const authorText4 = authorText3.replace('{server}', message.guild.name);
				const authorText5 = authorText4.replace('{membercount}', message.guild.memberCount);

				await message.channel.send({ embed: { description: 'Please type what the `author icon` would be.\n`Server Icon`, `Jasmine Avatar`, `User Avatar` or you can attach any `attachment` (picture)?\n`skip` to skip\n`cancel` to cancel' } });
				const authorIcon = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 180000,
				});
				if (!authorIcon.size) {
					return message.channel.send('Time is up.');
				}
				if (authorIcon.first().attachments.first()) {
					embed.setAuthor(authorText5, authorIcon.first().attachments.first().url);
					authorLink = authorIcon.first().attachments.first().url;
				}
				else if (authorIcon.first().content.toLowerCase() === 'server icon') {
					embed.setAuthor(authorText5, message.guild.iconURL());
					authorLink = authorIcon.first().content.toLowerCase();
				}
				else if (authorIcon.first().content.toLowerCase() === 'jasmine avatar') {
					embed.setAuthor(authorText5, client.user.avatarURL());
					authorLink = authorIcon.first().content.toLowerCase();
				}
				else if (authorIcon.first().content.toLowerCase() === 'user avatar') {
					embed.setAuthor(authorText5, message.author.displayAvatarURL({ dynamic: true }));
					authorLink = authorIcon.first().content.toLowerCase();
				}
				else if (authorIcon.first().content.toLowerCase() === 'skip') {
					embed.setAuthor(authorText5);
				}
				else {
					return message.channel.send('Canceled.');
				}
			}

			await message.channel.send({ embed: { description: 'Please provide a text for `title` slot.\n`skip` to skip\n`cancel` to cancel\n`{username}` - username of the joined member\n`{tag}` - user tag of the joined member\n`{server}` - your server name\n`{membercount}` - your server member count' } });
			const title = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 180000,
			});
			if (!title.size) {
				return message.channel.send('Time is up.');
			}
			if (title.first().content.toLowerCase() === 'skip') {
				message.channel.send('skipped');
			}
			else if (title.first().content.toLowerCase() === 'cancel') {
				return message.channel.send('Canceled');
			}
			else {
				if (title.first().content.length > 256) return message.channel.send('The input is exceeding 256 characters. Command stopped.');

				await message.channel.send('any link you want to put? please send a link.\n`skip` to skip\n`cancel` to cancel');
				const url = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 30000,
				});
				if (!url.size) {
					return message.channel.send('Time is up.');
				}
				if (url.first().content.toLowerCase() === 'skip') {
					titleText = title.first().content;
					const titleText2 = titleText.replace('{username}', message.author.username);
					const titleText3 = titleText2.replace('{tag}', message.author.tag);
					const titleText4 = titleText3.replace('{server}', message.guild.name);
					const titleText5 = titleText4.replace('{membercount}', message.guild.memberCount);
					embed.setTitle(titleText5);
					message.channel.send('skipped');
				}
				else if (url.first().content.toLowerCase() === 'cancel') {
					return message.channel.send('canceled');
				}
				else {
					titleText = title.first().content;
					if (titleText.length > 256) return message.channel.send('The input is exceeding 256 characters. Command stopped.');

					const titleText2 = titleText.replace('{username}', message.author.username);
					const titleText3 = titleText2.replace('{tag}', message.author.tag);
					const titleText4 = titleText3.replace('{server}', message.guild.name);
					const titleText5 = titleText4.replace('{membercount}', message.guild.memberCount);
					embed.setTitle(titleText5);
					embed.setURL(url.first().content);
					titleLink = url.first().content;
				}
			}

			await message.channel.send({ embed: { description: 'Please provide a text for `description` slot.\n`skip` to skip\n`cancel` to cancel\n`{username}` - username of the joined member\n`{tag}` - user tag of the joined member\n`{mention} - a mention of the joined member`\n`{server}` - your server name\n`{membercount}` - your server member count' } });
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
			else if (description.first().content === 'cancel') {
				return message.channel.send('canceled');
			}
			else {
				descriptionText = description.first().content;
				if (descriptionText.length > 2048) return message.channel.send('The input is exceeding 2048 characters. Command stopped.');

				const descriptionText2 = descriptionText.replace('{username}', message.author.username);
				const descriptionText3 = descriptionText2.replace('{tag}', message.author.tag);
				const descriptionText4 = descriptionText3.replace('{mention}', message.author);
				const descriptionText5 = descriptionText4.replace('{server}', message.guild.name);
				const descriptionText6 = descriptionText5.replace('{membercount}', message.guild.memberCount);
				embed.setDescription(descriptionText6);
			}

			await message.channel.send(embed);
			await setTimeout(function() {
				message.channel.send({ embed: { description: 'Please provide a text for `footer` slot.\n`skip` to skip\n`cancel` to cancel\n`{username}` - username of the joined member\n`{tag}` - user tag of the joined member\n`{server}` - your server name\n`{membercount}` - your server member count' } });
			}, 1000);
			const footer = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 180000,
			});
			if (!footer.size) {
				return message.channel.send('Time is up.');
			}
			if (footer.first().content.toLowerCase() === 'skip') {
				message.channel.send('skipped');
			}
			else if (footer.first().content.toLowerCase() === 'canceled') {
				return message.channel.send('canceled');
			}
			else {
				footerText = footer.first().content;
				if (footerText.length > 2048) return message.channel.send('The input is exceeding 2048 characters. Command stopped.');

				const footerText2 = footerText.replace('{username}', message.author.username);
				const footerText3 = footerText2.replace('{tag}', message.author.tag);
				const footerText4 = footerText3.replace('{server}', message.guild.name);
				const footerText5 = footerText4.replace('{membercount}', message.guild.memberCount);
				await message.channel.send({ embed: { description: 'Please type what the `footer icon` would be.\n`Server Icon`, `Jasmine Avatar`, `User Avatar` or you can attach any `attachment` (picture)?\n`skip` to skip\n`cancel` to cancel' } });
				const footerIcon = await message.channel.awaitMessages(filter, {
					max: 1,
					time: 180000,
				});
				if (!footerIcon.size) {
					return message.channel.send('Time is up.');
				}
				if (footerIcon.first().attachments.first()) {
					embed.setFooter(footerText5, footerIcon.first().attachments.first().url);
					footerLink = footerIcon.first().attachments.first().url;
				}
				else if (footerIcon.first().content.toLowerCase() === 'server icon') {
					embed.setFooter(footerText5, message.guild.iconURL());
					footerLink = footerIcon.first().content.toLowerCase();
				}
				else if (footerIcon.first().content.toLowerCase() === 'jasmine avatar') {
					embed.setFooter(footerText5, client.user.avatarURL());
					footerLink = footerIcon.first().content.toLowerCase();
				}
				else if (footerIcon.first().content.toLowerCase() === 'user avatar') {
					embed.setFooter(footerText5, message.author.displayAvatarURL({ dynamic: true }));
					footerLink = footerIcon.first().content.toLowerCase();
				}
				else if (footerIcon.first().content.toLowerCase() === 'skip') {
					embed.setFooter(footerText5);
				}
				else {
					return message.channel.send('Canceled.');
				}
			}

			await message.channel.send(embed);
			await setTimeout(function() {
				message.channel.send({ embed: { description: 'What image on the `thumbnail` would be?\n`Server Icon`, `Jasmine Avatar`, `User Avatar` or you can send any attachment (picture)\n `skip` to skip\n`cancel` to cancel' } });

			}, 1000);
			const thumbnail = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 180000,
			});
			if (!thumbnail.size) {
				return message.channel.send('Time is up.');
			}
			if (thumbnail.first().attachments.first()) {
				embed.setThumbnail(thumbnail.first().attachments.first().url);
				thumbnailLink = thumbnail.first().attachments.first().url;
			}
			else if (thumbnail.first().content.toLowerCase() === 'server icon') {
				embed.setThumbnail(message.guild.iconURL());
				thumbnailLink = thumbnail.first().content.toLowerCase();
			}
			else if (thumbnail.first().content.toLowerCase() === 'jasmine avatar') {
				embed.setThumbnail(client.user.avatarURL());
				thumbnailLink = thumbnail.first().content.toLowerCase();
			}
			else if (thumbnail.first().content.toLowerCase() === 'user avatar') {
				embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
				thumbnailLink = thumbnail.first().content.toLowerCase();
			}
			else if (thumbnail.first().content.toLowerCase() === 'skip') {
				message.channel.send('skipped');
			}
			else {
				return message.channel.send('Canceled');
			}

			await message.channel.send(embed);
			await setTimeout(function() {
				message.channel.send({ embed: { description: 'What image you want to put? Attach an attachment to set it.\n`skip` to skip\n`cancel` to cancel' } });
			}, 1000);
			const image = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 180000,
			});
			if (!image.size) {
				return message.channel.send('Time is up.');
			}
			if (image.first().attachments.first()) {
				embed.setImage(image.first().attachments.first().url);
				imageLink = image.first().attachments.first().url;
			}
			else if (image.first().content.toLowerCase() === 'skip') {
				message.channel.send('skipped');
			}
			else {
				return message.channel.send('Canceled.');
			}

			await message.channel.send(embed);
			await setTimeout(function() {
				message.channel.send({ embed: { description: 'What color you want to put?\n`skip` to skip\n`cancel` to cancel', image: { url: 'https://cdn.discordapp.com/attachments/736516166801162240/807973179392786462/color.png' } } });
			}, 1000);
			const color = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 180000,
			});
			if (!color.size) {
				return message.channel.send('Time is up.');
			}
			if (image.first().content.toLowerCase() === 'skip') {
				message.channel.send('skipped');
			}
			else if (image.first().content.toLowerCase() === 'cancel') {
				return message.channel.send('skipped');
			}
			else {
				embed.setColor(color.first().content);
				colorCode = color.first().content;
			}

			await message.channel.send(embed);
			await setTimeout(function() {
				message.channel.send('This is okay? (yes) (no)');
			}, 1000);

			const confirm = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 30000,
			});
			if (!confirm.size) {
				return message.reply('Time is up.');
			}
			if (confirm.first().content.toLowerCase() === 'yes') {
				file[message.guild.id] = {
					channelID: channel.id,
					switch: 'off',
					authorText: authorText,
					authorLink: authorLink,
					titleText: titleText,
					titleLink: titleLink,
					colorCode: colorCode,
					thumbnailLink: thumbnailLink,
					descriptionText: descriptionText,
					imageLink: imageLink,
					footerText: footerText,
					footerLink: footerLink,
				};

				fs.writeFile('./database/welcome.json', JSON.stringify(file, null, 2), err => {
					if (err) return message.channel.send('An error occured!');
					message.channel.send(`Welcome message has been set! Type \`${bot_prefix}setwelcome on\` to turn on the welcome message`);
				});
			}
			else if (confirm.first().content.toLowerCase() === 'no') {
				return message.channel.send('Canceled.');
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
					file[message.guild.id] = {
						channelID: channel.id,
						switch: 'off',
						authorText: authorText,
						authorLink: authorLink,
						titleText: titleText,
						titleLink: titleLink,
						colorCode: colorCode,
						thumbnailLink: thumbnailLink,
						descriptionText: descriptionText,
						imageLink: imageLink,
						footerText: footerText,
						footerLink: footerLink,
					};

					fs.writeFile('./database/welcome.json', JSON.stringify(file, null, 2), err => {
						if (err) return message.channel.send('An error occured!');
						message.channel.send(`Welcome message has been set! Type \`${bot_prefix}setwelcome on\` to turn on the welcome message`);
					});
				}
				else if (confirm2.first().content.toLowerCase() === 'no') {
					return message.channel.send('Canceled.');
				}
				else {
					return message.channel.send('Canceled.');
				}
			}
		}
		else if (args[0] === 'on') {
			if (!file[message.guild.id]) return message.channel.send('You haven\'t set up a welcome message yet.');
			file[message.guild.id].switch = 'on';
			fs.writeFile('./database/welcome.json', JSON.stringify(file, null, 2), err => {
				if (err) return message.channel.send('An error occured!');
				message.channel.send('Welcome message has been turned on');
			});
		}
		else if (args[0] === 'off') {
			if (!file[message.guild.id]) return message.channel.send('You haven\'t set up a welcome message yet.');
			file[message.guild.id].switch = 'off';
			fs.writeFile('./database/welcome.json', JSON.stringify(file, null, 2), err => {
				if (err) return message.channel.send('An error occured!');
				message.channel.send('Welcome message has been turned off');
			});
		}
		else {
			return message.channel.send(`The right syntax is \`${bot_prefix}setwelcome <#channel | on | off>\``);
		}
	},
};