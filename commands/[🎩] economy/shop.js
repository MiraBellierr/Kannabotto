const Discord = require('discord.js');
const { bot_prefix } = require('../../config.json');
const Models = require('../../create-model.js');

module.exports = {
	name:'shop',
	aliases: ['stall', 'store'],
	category: '[🎩] economy',
	description: 'Come and see what is inside that you like to buy',
	example: `${bot_prefix}shop`,
	run: async (client, message) => {

		const user = message.author.id;

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

		const warn = new Discord.MessageEmbed()
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

		const warn1 = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('You have been blacklisted from this command')
			.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
			.setTimestamp();


		if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);


		if (!await Cooldown.findOne({ where: { userId: user } })) {
			await Cooldown.create({
				userId: user,
			});
		}


		if (!await Inventory.findOne({ where: { userId: user } })) {
			await Inventory.create({
				userId: user,
			});
		}


		if (!await Economy.findOne({ where: { userId: user } })) {
			await Economy.create({
				userId: user,
			});
		}
		const economy = await Economy.findOne({ where: { userId: user } });

		const embed = new Discord.MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
			.addField(`Jasmine shop - Your balance: <a:JasmineCoins:718067589984551042> ${(economy.get('balance')).toLocaleString()}`, '**• <:doggo:843068555201216512> Dog** - <a:JasmineCoins:718067589984551042> 1,000 - Expand your bank capacity by 1,000\n**• <a:bearymad:719100025363234817> Bear** - <a:JasmineCoins:718067589984551042> 3,000 - Boost XP by 50% for 1 hour\n**• <:laptop:843067880882700318> Laptop** - <a:JasmineCoins:718067589984551042> 3,000 - Allows you to do a business\n**• <:bearcop:843071040480608307> Guard** - <a:JasmineCoins:718067589984551042> 5,000 - Prevents people from robbing you for 12 hours\n**• 🎣 Fishing-Rod** - <a:JasmineCoins:718067589984551042> 5,000 - Allows you to go fishing\n**• <:huntingRifle:843069828658364437> Hunting-Rifle** - <a:JasmineCoins:718067589984551042> 5,000 - Allows you to go hunting\n**• ⛏️ Pickaxe** - <a:JasmineCoins:718067589984551042> 5,100 - Allows you to dig deep into the cave')
			.setTimestamp()
			.setColor('RANDOM')
			.setThumbnail('https://cdn.discordapp.com/attachments/716107950032420897/723881420585697300/ezgif-3-b250403f94db.gif')
			.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));


		message.channel.send(embed);
	},
};