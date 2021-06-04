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

const { MessageEmbed } = require('discord.js');
const { bot_prefix } = require('../../config.json');
const axios = require('axios');

module.exports = {
	name: 'cat',
	category: '[📸] picture',
	description: 'Sends a cat picture',
	example: `${bot_prefix}cat`,
	run: async (client, message) => {
		const reddit = ['cats', 'cat'];
		const random = Math.floor(Math.random() * reddit.length);

		axios({
			method: 'get',
			url: `https://www.reddit.com/r/${reddit[random]}/hot.json`,
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