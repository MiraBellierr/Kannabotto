const { MessageEmbed } = require('discord.js');
const { bot_prefix } = require('../../config.json');
const Models = require('../../create-model');

module.exports = {
	name: 'leaderboard',
	aliases: ['lb'],
	category: '[🎮] level',
	example: `${bot_prefix}leaderboard [global]`,
	description: 'See the top 10 highest user in your server or global',
	run: async (client, message) => {

		message.guild.members.fetch(). then(async members => {
			const m = await message.channel.send('*Please wait...*');
			const Level = Models.Level();
			if (!await Level.findOne({ where: { userId: message.author.id } })) {
				await Level.create({
					userId: message.author.id,
				});
			}


			let board = [];
			const levelList = await Level.findAll({ attributes: ['userId'] });
			const levelListString2 = levelList.map(p => p.userId);
			const levelListString = [];
			levelListString2.forEach(id => {
				if (!members.get(id)) return;
				levelListString.push(id);
			});
			for(let i = 0; i < levelListString.length; i++) {
				const value = Object.assign({ user: members.get(levelListString[i]) }, await Level.findOne({ where: { UserId: levelListString[i] } }));
				board.push(value);
			}

			board = board.filter(x => x.user);
			board = board.sort((a, b) => b.dataValues.xp - a.dataValues.xp).splice(0, 10);
			const top = board.map((x, i) => `[${i + 1}] ${x.user} - Level: **${x.dataValues.level.toLocaleString()}** | XP: **${x.dataValues.xp.toLocaleString()}**`).join('\n');
			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.setDescription(`**🆙 | Top 10 Level XP Users in The Server**\n\n${top}`);

			m.delete();
			return message.channel.send(embed);
		});
	},
};