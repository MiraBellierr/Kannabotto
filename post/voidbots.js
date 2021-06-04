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
const { voidbots } = require('../config.json');

module.exports = async client => {

	axios({
		method: 'post',
		url: 'https://api.voidbots.net/bot/stats/636748567586930728',
		headers: {
			Authorization: voidbots,
			'Content-Type': 'application/json',
		},
		data: JSON.stringify({
			'server_count': client.guilds.cache.size,
			'shard_count': client.shard.count,
		}),
	}).then(() => {
		console.log('[LOG] voidbots stats posted.');
	}).catch(err => {
		console.error(err);
	});
};