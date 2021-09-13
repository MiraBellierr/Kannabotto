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

const { bot_prefix } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const { getMember, checkGuildDisable, guildDisableMessage, blacklistMessage, checkBlacklist, createAllDataForNewUser, getUserDataAndCreate } = require('../../functions');
const Models = require('../../create-model.js');

module.exports = {
	name: 'inventory',
	aliases: ['inv'],
	category: '[🎩] economy',
	desription: 'This is where your awesome items stored',
	example: `${bot_prefix}inventory [mention | id | username]`,
	usage: '[mention | id | username]',
	run: async (client, message, args) => {
		const member = await getMember(message, args.join(' '));
		const user = member.user;

		const Inventory = Models.Inventory();

		if (await checkGuildDisable(message, 'economy')) return guildDisableMessage(message);
		if (await checkBlacklist(message, 'blacklist')) return blacklistMessage(message);

		await createAllDataForNewUser(user.id);

		const inventory = await getUserDataAndCreate(Inventory, user.id);

		const embed = new MessageEmbed();

		embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
		embed.setDescription(`${user.id === message.author.id ? 'Your' : `${user.username}'s`} Inventory${inventory.get('junk') === 0 && inventory.get('tuna') === 0 && inventory.get('goldfish') === 0 && inventory.get('squid') === 0 && inventory.get('whale') === 0 && inventory.get('rabbit') === 0 && inventory.get('turkey') === 0 && inventory.get('pig') === 0 && inventory.get('deer') === 0 && inventory.get('dragon') === 0 && inventory.get('laptop') === 0 && inventory.get('bunny2') === 0 && inventory.get('dog') === 0 && inventory.get('fishing-rod') === 0 && inventory.get('hunting-rifle') === 0 && inventory.get('guard') === 0 && inventory.get('bear') === 0 ? '\n**•** No item' : ''}${inventory.get('bunny2') === 0 ? '' : `\n**•** **<a:MyMelodyHeart:719100623328378901> Bunny** - ${inventory.get('bunny2')}`}${inventory.get('dog') === 0 ? '' : `\n**•** **<:dog:868105109647810600> Dog** - ${inventory.get('dog')}`}${inventory.get('laptop') > 0 ? `\n**•** **<:laptop:868105109379379221> Laptop** - ${inventory.get('laptop')}` : ''}${inventory.get('fishing-rod') === 0 ? '' : `\n**•** **🎣 Fishing-Rod** - ${inventory.get('fishing-rod')}`}${inventory.get('hunting-rifle') === 0 ? '' : `\n**•** **<:huntingrifle:868724539121610783> Hunting-Rifle** - ${inventory.get('hunting-rifle')}`}${inventory.get('pickaxe') === 0 ? '' : `\n**•** **⛏️ Pickaxe** - ${inventory.get('pickaxe')}`}${inventory.get('guard') > 0 ? `\n**•** **<:bearguard:868105110289543188> Guard** - ${inventory.get('guard')}` : ''}${inventory.get('bear') > 0 ? `\n**•** **<a:angrybear:868105109853327370> Bear** - ${inventory.get('bear')}` : ''}${inventory.get('junk') === 0 ? '' : `\n**•** **🦴 Junk** - ${inventory.get('junk')}`}${inventory.get('tuna') === 0 ? '' : `\n**•** **<:fish:868105109631025163> Tuna** - ${inventory.get('tuna')}`}${inventory.get('goldfish') === 0 ? '' : `\n**•** **<:goldfish:868115088165462076> GoldFish** - ${inventory.get('goldfish')}`}${inventory.get('squid') === 0 ? '' : `\n**•** **🦑 Squid** - ${inventory.get('squid')}`}${inventory.get('whale') === 0 ? '' : `\n**•** **🐋 Whale** - ${inventory.get('whale')}`}${inventory.get('rabbit') === 0 ? '' : `\n**•** **🐇 Rabbit** - ${inventory.get('rabbit')}`}${inventory.get('turkey') === 0 ? '' : `\n**•** **🦃 Turkey** - ${inventory.get('turkey')}`}${inventory.get('pig') === 0 ? '' : `\n**•** **🐖 Pig** - ${inventory.get('pig')}`}${inventory.get('deer') === 0 ? '' : `\n**•** **🦌 Deer** - ${inventory.get('deer')}`}${inventory.get('dragon') === 0 ? '' : `\n**•** **🐉 Dragon** - ${inventory.get('dragon')}`}${inventory.get('iron') === 0 ? '' : `\n**•** **<:iron:868722021159292978> Iron** - ${inventory.get('iron')}`}${inventory.get('copper') === 0 ? '' : `\n**•** **<:copper:868722021142523924> Copper** - ${inventory.get('copper')}`}${inventory.get('gold') === 0 ? '' : `\n**•** **<:gold:868722020945371197> Gold** - ${inventory.get('gold')}`}${inventory.get('bauxite') === 0 ? '' : `\n**•** **<:bauxite:868119461243273226> Bauxite** - ${inventory.get('bauxite')}`}${inventory.get('manganese') === 0 ? '' : `\n**•** **<:manganese:868119479383646288> Manganese** - ${inventory.get('manganese')}`}`);
		embed.setTimestamp();
		embed.setColor('#CD1C6C');
		embed.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));

		message.reply({ embeds: [embed] });

	},
};