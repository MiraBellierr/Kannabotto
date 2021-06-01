const Discord = require('discord.js');
const { Canvas, resolveImage } = require('canvas-constructor');
const { bot_prefix } = require('../../config.json');
const bg = require('../../database/background.json');
const { getMember } = require('../../functions');
const Models = require('../../create-model');

module.exports = {
	name: 'level',
	aliases: ['rank', 'xp'],
	category: '[🎮] level',
	example: `${bot_prefix}level [mention | id | username]`,
	description: 'Shows user level',
	usage: '[mention | id | username]',
	run: async (client, message, args) => {
		let user = getMember(message, args.join(' ')).user || message.author;
		if(!user) user = message.author;
		if (user.bot) return message.channel.send(`**${message.author.username}, Nice bot!**`);

		if(!bg[user.id]) {
			bg[user.id] = {
				background: 'https://cdn.discordapp.com/attachments/710732218254753842/717194057516056576/3430.jpg',
			};
		}

		const Level = Models.Level();

		if (!await Level.findOne({ where: { userId: user.id } })) {
			await Level.create({
				userId: user.id,
			});
		}
		const level = await Level.findOne({ where: { userId: user.id } });

		const curxp = level.get('xp');
		const curlvl = level.get('level');
		const nxtLvlXp = curlvl * 500;
		const difference = curxp / nxtLvlXp * 200;
		const difference2 = nxtLvlXp - curxp;
		const background = bg[user.id].background;

		try {
			// eslint-disable-next-line no-inner-declarations
			async function createCanvas() {
				const imageUrlRegex = /\?size=2048$/g;
				const name = user.tag;
				const avatar = await resolveImage(user.displayAvatarURL({ format: 'jpg' }).replace(imageUrlRegex, '?size=128'));
				const background1 = await resolveImage(background);
				const background2 = await resolveImage('https://cdn.discordapp.com/attachments/710732218254753842/717194056652030115/FamkMs1.png');

				return new Canvas(370, 110)
					.setColor('#000000')
					.printImage(background1, 0, 0, 370, 110)
					.printImage(background2, 81.4, 7.4, 281.2, 92.5)
					.printRoundedImage(avatar, 44.4, 18.5, 74, 74, 74 / 2)
					.setTextFont('bold 15px arial')
					.printText('Level:', 136.9, 68)
					.printText(curlvl, 185.9, 68)
					.setTextFont('bold 12px arial')
					.setTextAlign('right')
					.printText(`${curxp} / ${nxtLvlXp}`, 338, 68)
					.setTextFont('bold 20px arial')
					.setTextAlign('left')
					.printText(name, 136.9, 40, 200)
					.setColor('#008B8B')
					.printRectangle(136.9, 70, 200, 20)
					.setColor('#ffff00')
					.printRectangle(136.9, 70, difference, 20)
					.toBufferAsync();
			}
			const m = await message.channel.send('*Please Wait...*');

			const gumen = `
__**\`${user.username}\`'**s level information__
Current Level: **${curlvl}** - Total XP : **${curxp}**
Progress: ${getProgbar(curxp, nxtLvlXp, 10)}
Needed XP to reach level **${curlvl + 1}** : **${difference2}**
`;
			const attachment = new Discord.MessageAttachment(await createCanvas(), 'rank-card.png');
			message.channel.send(gumen, attachment).then(() => {m.delete();});
		}
		catch (e) {
			message.channel.send(`Oh no an error occurred :( \`${e.message}\` Please report it to the support server.`);
		}
	},

};
function getProgbar(current, max, length) {
	const curBer = Math.floor((current / max) * length);
	let str = '';
	for(let i = 0; i < length; i++) {
		str += i < curBer ? '💙' : '⬛';
	}
	return str;
}

global.progBar = getProgbar;

