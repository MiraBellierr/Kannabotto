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
const { formatDate } = require('../../functions.js');
const { bot_prefix } = require('../../config.json');

module.exports = {
	name: 'serverinfo',
	aliases: ['server'],
	category: '[📚] info',
	example: `${bot_prefix}serverinfo`,
	description: 'Returns server information',
	run: async (client, message) => {

		const verlvl = {
			NONE: 'None',
			LOW: 'Low',
			MEDIUM: 'Medium',
			HIGH: '(╯°□°）╯︵ ┻━┻',
			VERY_HIGH: '(ノಠ益ಠ)ノ彡┻━┻',
		};
		const verlvl2 = {
			DISABLED: 'Disabled',
			MEMBERS_WITHOUT_ROLES: 'Apply To Members Without Roles Only',
			ALL_MEMBERS: 'Apply To All Members',
		};

		const guild = await client.guilds.fetch(message.guild.id);

		const created = formatDate(message.guild.createdAt);

		const serverembed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle(guild.name)
			.addField('Server Information 1', `**• Name:** ${guild.name}\n**• ID:** ${guild.id}\n**• Owner:** ${guild.members.cache.get(guild.ownerId)}\n**• Owner ID:** ${guild.ownerId}\n**• Created At:** ${created}\n**• Text Channels:** ${guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size} channels\n**• Voice Channels:** ${guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size} channels\n**• Roles:** ${guild.roles.cache.size} roles\n**• Emojis:** ${guild.emojis.cache.size} emojis\n**• Stickers:** ${guild.stickers.cache.size} stickers\n**• Humans:** ${guild.memberCount - guild.members.cache.filter(m => m.user.bot).size} humans\n**• Bots:** ${guild.members.cache.filter(m => m.user.bot).size} bots\n**• Total Members:** ${guild.memberCount} members\n**• Boost Count:** ${guild.premiumSubscriptionCount} boosts\n**• Shard:** ${guild.shard.id}`, true)
			.addField('Server Information 2', `**• Name Acronym:** ${guild.nameAcronym}\n**• Icon URL:** [Link](${guild.iconURL({ dynamic: true, size: 4096 })})\n**• Large Server:** ${guild.large ? 'Yes' : 'No'}\n**• AFK Channel:** ${guild.afkChannel === null ? 'None' : guild.afkChannel}\n**• AFK Channel ID:** ${guild.afkChannelId === null ? 'None' : guild.afkChannelId}\n**• AFK Timeout:** ${guild.afkTimeout} Seconds\n**• Default Message Notifications:** ${guild.defaultMessageNotifications}\n**• Server Description:** ${guild.description === null ? 'None' : guild.description}\n**• Explicit Content Filter:** ${verlvl2[guild.explicitContentFilter]}\n**• Verification Level:** ${verlvl[guild.verificationLevel]}\n**• MFA Level:** ${guild.mfaLevel === 0 ? 'None' : 'High'}\n**• Partnered:** ${guild.partnered ? 'Yes' : 'No'}\n**• Verified:** ${guild.verified ? 'Yes' : 'No'}\n**• Vanity URL Code:** ${guild.vanityURLCode === null ? 'None' : guild.vanityURLCode}`, true)
			.addField(`Server Features [${guild.premiumTier}]`, `${message.guild.features.map(f => `**• ${f}**`).join('\n')}`)
			.setColor('0ED4DA')
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.setImage(guild.bannerURL({ dynamic: true, size: 4096 }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));


		message.reply({ embeds: [serverembed] });
	},
};