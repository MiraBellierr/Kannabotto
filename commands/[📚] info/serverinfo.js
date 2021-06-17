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

		const tier = {
			0: 'None',
			1: 'Tier 1',
			2: 'Tier 2',
			3: 'Tier 3',
		};

		const noti = {
			ALL: 'All Messages',
			MENTIONS: 'Only @mentions',
		};

		const region = {
			singapore: ':flag_sg: Singapore',
			brazil: ':flag_br: Brazil',
			europe: ':flag_eu: Europe',
			hongkong: ':flag_hk: Hong Kong',
			india: ':flag_in: India',
			japan: ':flag_jp: Japan',
			russia: ':flag_ru: Russia',
			southafrica: ':flag_za: South Africa',
			sydney: ':flag_au: Sydney',
			'eu-central': ':flag_eu: EU Central',
			'us-central': ':flag_us: US Central',
			'us-east': ':flag_us: US East',
			'us-south': ':flag_us: US South',
			'us-west': ':flag_us: US West',
		};
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

		const created = formatDate(message.guild.createdAt);

		const serverembed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle(message.guild.name)
			.addField('Server Information 1', `**• Name:** ${message.guild.name}\n**• ID:** ${message.guild.id}\n**• Owner:** ${message.guild.owner}\n**• Owner ID:** ${message.guild.ownerID}\n**• Created At:** ${created}\n**• Text Channels:** ${message.guild.channels.cache.filter(c => c.type === 'text').size} Channels\n**• Voice Channels:** ${message.guild.channels.cache.filter(c => c.type === 'voice').size} Channels\n**• Roles:** ${message.guild.roles.cache.size} Roles\n**• Emojis:** ${message.guild.emojis.cache.size} Emojis\n**• Region:** ${region[message.guild.region]}\n**• Humans:** ${message.guild.memberCount - await message.guild.members.fetch().then(members => members.filter(m => m.user.bot).size)} Humans\n**• Bots:** ${await message.guild.members.fetch().then(members => members.filter(m => m.user.bot).size)} Bots\n**• Total Members:** ${message.guild.memberCount} Members\n**• Boost Count:** ${message.guild.premiumSubscriptionCount} Boosts\n**• Shard:** ${message.guild.shard.id}`, true)
			.addField('Server Information 2', `**• Name Acronym:** ${message.guild.nameAcronym}\n**• Icon URL:** [Link](${message.guild.iconURL({ dynamic: true, size: 4096 })})\n**• Large Server:** ${message.guild.large ? 'Yes' : 'No'}\n**• AFK Channel:** ${message.guild.afkChannel === null ? 'None' : message.guild.afkChannel}\n**• AFK Channel ID:** ${message.guild.afkChannelID === null ? 'None' : message.guild.afkChannelID}\n**• AFK Timeout:** ${message.guild.afkTimeout} Seconds\n**• Default Message Notifications:** ${noti[message.guild.defaultMessageNotifications]}\n**• Server Description:** ${message.guild.description === null ? 'None' : message.guild.description}\n**• Explicit Content Filter:** ${verlvl2[message.guild.explicitContentFilter]}\n**• Verification Level:** ${verlvl[message.guild.verificationLevel]}\n**• MFA Level:** ${message.guild.mfaLevel === 0 ? 'None' : 'High'}\n**• Partnered:** ${message.guild.partnered ? 'Yes' : 'No'}\n**• Verified:** ${message.guild.verified ? 'Yes' : 'No'}\n**• Vanity URL Code:** ${message.guild.vanityURLCode === null ? 'None' : message.guild.vanityURLCode}`, true)
			.addField(`Server Features [${tier[message.guild.premiumTier]}]`, `**• ${message.guild.features.join('\n• ')}**`)
			.setColor('0ED4DA')
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setImage(message.guild.bannerURL({ dynamic: true, size: 4096 }))
			.setTimestamp()
			.setFooter(client.user.tag, client.user.avatarURL({ dynamic: true }));


		message.channel.send(serverembed);
	},
};