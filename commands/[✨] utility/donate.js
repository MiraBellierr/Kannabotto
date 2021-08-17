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

module.exports = {
	name: 'donate',
	description: 'Donate to get extra perks',
	category: '[✨] utility',
	example: `${bot_prefix}donate`,
	run: async (client, message) => {


		message.channel.send('Donate any amount you want! It helps a creator afford a faster server for Kanna! As a return, you will receive benefits!\nLink: https://www.patreon.com/kannacoco');
	},
};