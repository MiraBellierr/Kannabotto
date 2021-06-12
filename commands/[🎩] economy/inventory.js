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
const { getMember } = require('../../functions');
const Models = require('../../create-model.js');

module.exports = {
	name: 'inventory',
	aliases: ['inv'],
	category: '[🎩] economy',
	desription: 'This is where your awesome items stored',
	example: `${bot_prefix}inventory [mention | id | username]`,
	usage: '[mention | id | username]',
	run: async (client, message, args) => {
		let user = await getMember(message, args.join(' ')).user || message.author;
		if (!user) user = message.author;

		const Disable = Models.Disable();
		const Blacklist = Models.Blacklist();
		const Cooldown = Models.Cooldown();
		const Inventory = Models.Inventory();
		const Economy = Models.Economy();

		if (!await Disable.findOne({ where: { guildId: message.guild.id } })) {
			await Disable.create({
				guildId: message.guild.id,
			});
		}
		const disable = await Disable.findOne({ where: { guildId: message.guild.id } });

		const warn = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('This command is disabled for this guild')
			.setDescription('This is most likely because this guild has broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();

		if (disable.get('economy') === 1) return message.channel.send(warn);


		if (!await Blacklist.findOne({ where: { userId: message.author.id } })) {
			await Blacklist.create({
				userId: message.author.id,
			});
		}
		const blacklist = await Blacklist.findOne({ where: { userId: message.author.id } });

		const warn1 = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('You have been blacklisted from this command')
			.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();


		if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);


		if (!await Cooldown.findOne({ where: { userId: user.id } })) {
			await Cooldown.create({
				userId: user.id,
			});
		}


		if (!await Inventory.findOne({ where: { userId: user.id } })) {
			await Inventory.create({
				userId: user.id,
			});
		}
		const inventory = await Inventory.findOne({ where: { userId: user.id } });


		if (!await Economy.findOne({ where: { userId: user.id } })) {
			await Economy.create({
				userId: user.id,
			});
		}

		const embed = new MessageEmbed();
		embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
		embed.setDescription(`${user.id === message.author.id ? 'Your' : `${user.username}'s`} Inventory${inventory.get('junk') === 0 && inventory.get('commonFish') === 0 && inventory.get('uncommonFish') === 0 && inventory.get('rareFish') === 0 && inventory.get('legendaryFish') === 0 && inventory.get('commonHunt') === 0 && inventory.get('uncommonHunt') === 0 && inventory.get('rareHunt') === 0 && inventory.get('mythicalHunt') === 0 && inventory.get('legendaryHunt') === 0 && inventory.get('laptop') === 0 && inventory.get('bunny2') === 0 && inventory.get('dog') === 0 && inventory.get('fishingRod') === 0 && inventory.get('huntingRifle') === 0 && inventory.get('guard') === 0 && inventory.get('bear') === 0 ? '\n**•** No item' : ''}${inventory.get('bunny2') === 0 ? '' : `\n**•** **<a:MyMelodyHeart:719100623328378901> Bunny** - ${inventory.get('bunny2')}`}${inventory.get('dog') === 0 ? '' : `\n**•** **<:doggo:843068555201216512> Dog** - ${inventory.get('dog')}`}${inventory.get('laptop') > 0 ? `\n**•** **<:laptop:843067880882700318> Laptop** - ${inventory.get('laptop')}` : ''}${inventory.get('fishingRod') === 0 ? '' : `\n**•** **🎣 Fishing-Rod** - ${inventory.get('fishingRod')}`}${inventory.get('huntingRifle') === 0 ? '' : `\n**•** **<:huntingRifle:843069828658364437> Hunting-Rifle** - ${inventory.get('huntingRifle')}`}${inventory.get('pickaxe') === 0 ? '' : `\n**•** **⛏️ Pickaxe** - ${inventory.get('pickaxe')}`}${inventory.get('guard') > 0 ? `\n**•** **<:bearcop:843071040480608307> Guard** - ${inventory.get('guard')}` : ''}${inventory.get('bear') > 0 ? `\n**•** **<a:bearymad:719100025363234817> Bear** - ${inventory.get('bear')}` : ''}${inventory.get('junk') === 0 ? '' : `\n**•** **🦴 Junk** - ${inventory.get('junk')}`}${inventory.get('commonFish') === 0 ? '' : `\n**•** **<:tuna2:844204159317835816> Tuna** - ${inventory.get('commonFish')}`}${inventory.get('uncommonFish') === 0 ? '' : `\n**•** **<:goldfish2:844204195678388285> GoldFish** - ${inventory.get('uncommonFish')}`}${inventory.get('rareFish') === 0 ? '' : `\n**•** **🦑 Squid** - ${inventory.get('rareFish')}`}${inventory.get('legendaryFish') === 0 ? '' : `\n**•** **🐋 Whale** - ${inventory.get('legendaryFish')}`}${inventory.get('commonHunt') === 0 ? '' : `\n**•** **🐇 Rabbit** - ${inventory.get('commonHunt')}`}${inventory.get('uncommonHunt') === 0 ? '' : `\n**•** **🦃 Turkey** - ${inventory.get('uncommonHunt')}`}${inventory.get('rareHunt') === 0 ? '' : `\n**•** **🐖 Pig** - ${inventory.get('rareHunt')}`}${inventory.get('mythicalHunt') === 0 ? '' : `\n**•** **🦌 Deer** - ${inventory.get('mythicalHunt')}`}${inventory.get('legendaryHunt') === 0 ? '' : `\n**•** **🐉 Dragon** - ${inventory.get('legendaryHunt')}`}${inventory.get('iron') === 0 ? '' : `\n**•** **<:iron:845597360532357120> Iron** - ${inventory.get('iron')}`}${inventory.get('copper') === 0 ? '' : `\n**•** **<:copper:845602173748248617> Copper** - ${inventory.get('copper')}`}${inventory.get('gold') === 0 ? '' : `\n**•** **<:gold:845601566568480778> Gold** - ${inventory.get('gold')}`}${inventory.get('bauxite') === 0 ? '' : `\n**•** **<:bauxite:845605148797435904> Bauxite** - ${inventory.get('bauxite')}`}${inventory.get('manganese') === 0 ? '' : `\n**•** **<:manganese:845606216377827338> Manganese** - ${inventory.get('manganese')}`}`);
		embed.setTimestamp();
		embed.setColor('RANDOM');
		embed.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));


		message.channel.send(embed);

	},
};