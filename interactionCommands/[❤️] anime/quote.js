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

const axios = require('axios');

module.exports = {
	name: 'quote',
	category: '[❤️] anime',
	description: 'Quote from the Anime character',
	run: async (client, interaction) => {

		axios({
			method: 'get',
			url: 'https://animechan.vercel.app/api/random',
		}).then(res => {
			return interaction.reply(`"${res.data.quote}"\n\n*${res.data.character} - ${res.data.anime}*`);
		});
	},
};