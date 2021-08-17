const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const { color } = require('../config.json');
const file = require('../database/leave.json');

module.exports = async (client, member) => {

	if (file[member.guild.id]) {
		if (file[member.guild.id].switch === 'off') return;

		const embed = new MessageEmbed();

		const authorText = file[member.guild.id].authorText;

		if (authorText !== null) {
			const authorText2 = authorText.replace('{username}', member.user.username);
			const authorText3 = authorText2.replace('{tag}', member.user.tag);
			const authorText4 = authorText3.replace('{server}', member.guild.name);
			const authorText5 = authorText4.replace('{membercount}', member.guild.memberCount);

			const authorLink = file[member.guild.id].authorLink;

			if (authorLink === 'server icon') {
				embed.setAuthor(authorText5, member.guild.iconURL());
			}
			else if (authorLink === 'Kanna avatar') {
				embed.setAuthor(authorText5, client.user.avatarURL());
			}
			else if (authorLink === 'user avatar') {
				embed.setAuthor(authorText5, member.user.displayAvatarURL({ dynamic: true }));
			}
			else if (authorLink === null) {
				embed.setAuthor(authorText5);
			}
			else {
				embed.setAuthor(authorText5, authorLink);
			}
		}

		const titleText = file[member.guild.id].titleText;

		if (titleText !== null) {
			const titleLink = file[member.guild.id].titleLink;
			const titleText2 = titleText.replace('{username}', member.user.username);
			const titleText3 = titleText2.replace('{tag}', member.user.tag);
			const titleText4 = titleText3.replace('{server}', member.guild.name);
			const titleText5 = titleText4.replace('{membercount}', member.guild.memberCount);

			embed.setTitle(titleText5);

			if (titleLink !== null) {
				embed.setURL(titleLink);
			}
		}

		const colorCode = file[member.guild.id].colorCode;

		if (colorCode !== null) {
			embed.setColor(colorCode);
		}

		const thumbnailLink = file[member.guild.id].thumbnailLink;

		if (thumbnailLink === 'server icon') {
			embed.setThumbnail(member.guild.iconURL());
		}
		else if (thumbnailLink === 'Kanna avatar') {
			embed.setThumbnail(client.user.avatarURL());
		}
		else if (thumbnailLink === 'user avatar') {
			embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }));
		}
		else if (thumbnailLink === null) {
			// do nothing
		}
		else {
			embed.setThumbnail(thumbnailLink);
		}

		const descriptionText = file[member.guild.id].descriptionText;

		if (descriptionText !== null) {
			const descriptionText2 = descriptionText.replace('{username}', member.user.username);
			const descriptionText3 = descriptionText2.replace('{tag}', member.user.tag);
			const descriptionText4 = descriptionText3.replace('{mention}', member.user);
			const descriptionText5 = descriptionText4.replace('{server}', member.guild.name);
			const descriptionText6 = descriptionText5.replace('{membercount}', member.guild.memberCount);

			embed.setDescription(descriptionText6);
		}

		const imageLink = file[member.guild.id].imageLink;

		if (imageLink !== null) {
			embed.setImage(imageLink);
		}

		const footerText = file[member.guild.id].footerText;

		if (footerText !== null) {
			const footerLink = file[member.guild.id].footerLink;
			const footerText2 = footerText.replace('{username}', member.user.username);
			const footerText3 = footerText2.replace('{tag}', member.user.tag);
			const footerText4 = footerText3.replace('{server}', member.guild.name);
			const footerText5 = footerText4.replace('{membercount}', member.guild.memberCount);

			if (footerLink === 'server icon') {
				embed.setFooter(footerText5, member.guild.iconURL());
			}
			else if (footerLink === 'Kanna avatar') {
				embed.setFooter(footerText5, client.user.avatarURL());
			}
			else if (footerLink === 'user avatar') {
				embed.setFooter(footerText5, member.user.displayAvatarURL({ dynamic: true }));
			}
			else if (footerLink === null) {
				embed.setFooter(footerText5);
			}
			else {
				embed.setFooter(footerText5, footerLink);
			}
		}

		const channelID = file[member.guild.id].channelID;
		const channel = member.guild.channels.cache.get(channelID);

		if (!channel) return;

		channel.send(embed);
	}

	const log = JSON.parse(fs.readFileSync('./database/logging.json', 'utf8'));
	const logsetting = JSON.parse(fs.readFileSync('./database/logonoff.json', 'utf8'));

	if(!logsetting[member.guild.id]) {
		logsetting[member.guild.id] = {
			checker: 1,
		};
	}
	if(!log[member.guild.id]) return;
	const values = logsetting[member.guild.id].checker;

	if(values === undefined) return;
	if(values === 0) return;
	if(values === 1) {
		if (!log) return;

		const logChannel = member.guild.channels.cache.get(`${log[member.guild.id].channel}`);
		if(!logChannel) return;

		const embed = new MessageEmbed()
			.setAuthor('Member Left', member.user.displayAvatarURL({ dynamic: true }))
			.setColor(color)
			.setDescription(`User: ${member.user.tag}`)
			.setTimestamp()
			.setFooter(`ID: ${member.user.id}`);

		logChannel.send(embed);
	}
};