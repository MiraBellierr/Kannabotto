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
const Models = require('../../create-model');
const { bot_prefix } = require('../../config.json');
const prefixes = require('../../database/prefix.json');

module.exports = {
	name: 'setcustomimage',
	aliases: ['sci'],
	description: 'Custom image for patron',
	category: '[👹] rpg',
	example: `${bot_prefix}setcustomimage <image link>`,
	usage: '<image link>',
	run: async (client, message, args) => {
		if (!message.member.roles.cache.has('867067600378920990')) return message.reply('This command accesible for tier 2 patron only.');
		if (!args.length) return message.reply(`The right syntax is \`${prefixes[message.guild.id]}setcustomimage <image link>\``);

		const pattern = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/g;

		if (!pattern.test(args[0])) return message.reply('please send a correct image link');

		const image = args[0];
		const Images = Models.Images();
		const imagess = await Images.findOne({ where: { id: 1 } });
		const images = imagess.dataValues.data;

		if (!images[message.author.id]) {
			images[message.author.id] = [
				{
					name: 'Default',
					image: null,
					count: 1,
				},
			];
		}

		images[message.author.id][0].image = image;

		await Images.update({ data: images }, { where: { id: 1 } });

		return message.reply('Custom image has successfully been set.');
	},
};