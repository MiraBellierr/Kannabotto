const { MessageEmbed } = require('discord.js');
const { bot_prefix } = require('../../config.json');
const axios = require('axios');

module.exports = {
	name: 'meme',
	category: '[🤣] meme',
	description: 'Sends an epic meme',
	example: `${bot_prefix}meme`,
	run: async (client, message) => {
		const reddits = ['memes', 'dankmemes', 'Memes_Of_The_Dank', 'dankmemes', 'wholesomememes', 'terriblefacebookmemes', 'pewdiepiesubmissions'];
		const random = Math.floor(Math.random() * reddits.length);
		const reddit = reddits[random];
		axios({
			method: 'get',
			url: `https://www.reddit.com/r/${reddit}/hot.json`,
		}).then(res => {
			const data = [];
			for (let i = 0; i < res.data.data.children.length; i++) {
				if (res.data.data.children[i].data.over_18 === false && res.data.data.children[i].data.is_video === false) {
					data.push(res.data.data.children[i].data);
				}
			}
			const rand = Math.floor(Math.random() * data.length);
			const result = data[rand];
			const embed = new MessageEmbed()
				.setAuthor(`By ${result.author} - `, result.all_awardings.length > 0 ? result.all_awardings[Math.floor(Math.random() * result.all_awardings.length)].icon_url : '')
				.setTitle(result.title)
				.setURL(`https://www.reddit.com${result.permalink}`)
				.setImage(result.url)
				.setFooter(`⬆️ ${result.ups} | 💬 ${result.num_comments} | 🏅 ${result.total_awards_received}`);

			message.channel.send(embed);
		}).catch(err => message.channel.send(`An error occured \`${err}\``));
	},
};