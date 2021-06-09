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

module.exports = {
	name: 'changeimage',
	aliases: ['ci'],
	description: 'Custom image for patron',
	example: '<id> <link>',
	run: async (client, message, args) => {
		if (message.author.id !== '275989071774351360') return;
		if (!args.length) return message.channel.send('<id> <link>');
		const id = args[0];
		const image = args[1];
		const Images = Models.Images();
		const imagess = await Images.findOne({ where: { id: 1 } });
		const images = imagess.dataValues.data;
		if (!images[id]) {
			images[id] = [
				{
					name: 'Default',
					image: null,
					count: 1,
				},
			];
		}

		images[id][0].image = image;
		await Images.update({ data: images }, { where: { id: 1 } });
		return message.channel.send('Custom image has successfully been set.');
	},
};