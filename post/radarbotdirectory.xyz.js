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
const { radarbotdirectoryxyz } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://radarbotdirectory.xyz/api/bot/${client.user.id}/stats`,
		headers: {
			Authentication: radarbotdirectoryxyz,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		data: {
			shards: parseInt(client.shard.count),
			guilds: parseInt(client.guilds.cache.size),
		},
	}).then(() => {
		console.log('[LOG] radarbotdirectory.xyz stats posted.');
	}).catch(err => {
		console.error(err);
	});
};