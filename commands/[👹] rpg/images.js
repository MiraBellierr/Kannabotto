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
const prefixes = require('../../database/prefix.json');
const Discord = require('discord.js');
const { PaginateContent } = require('../../Pagination');
const Models = require('../../create-model.js');

module.exports = {
	name: 'images',
	aliases: ['image'],
	description: 'Shows your image collection',
	category: '[👹] rpg',
	example: `${bot_prefix}images`,
	run: async (client, message) => {
		const user = message.author.id;

		const Player = Models.Player();
		const Images = Models.Images();
		const imagess = await Images.findOne({ where: { id: 1 } });
		const images = imagess.dataValues.data;
		const player = await Player.findOne({ where: { userId: user } });

		const result = new Discord.MessageEmbed()
			.setDescription('No profile found 😓')
			.setFooter(`If you haven't create a profile yet, do \`${prefixes[message.guild.id]}start\` to create one`, client.user.avatarURL({ dynamic: true }));

		if (!player) return message.channel.send(result);
		if (!images[message.author.id]) {
			images[message.author.id] = [
				{
					name: 'Default',
					image: player.get('image'),
					count: 1,
				},
			];
		}
		const pages = [];
		for (let i = 0; i < images[message.author.id].length; i++) {
			if (player.get('image') === images[message.author.id][i].image) {
				const content = `${images[message.author.id][i].name} (**Current equipped image**)`;
				pages.push(content);
			}
			else {
				const content = images[message.author.id][i].name;
				pages.push(content);
			}
		}
		// eslint-disable-next-line prefer-const
		let k, j, temparray, chunk = 10, page = [];
		for (k = 0, j = pages.length; k < j; k += chunk) {
			temparray = pages.slice(k, k + chunk);
			page.push(temparray);
		}


		const paginatePage = [];
		for (let i = 0; i < page.length; i++) {
			const img = page[i].map((x) => `**•** ${x}`).join('\n');
			paginatePage.push(new Discord.MessageEmbed().setAuthor('Your image collection', message.author.displayAvatarURL({ dynamic: true })).setDescription(img).setFooter(`Pages ${i + 1}/${page.length}`));
		}
		const paginated = new PaginateContent.DiscordJS(client, message, paginatePage);
		await paginated.init();
	},
};