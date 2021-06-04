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
const { paradisebots } = require('../config.json');

module.exports = client => {

	axios({
		method: 'post',
		url: `https://paradisebots.net/api/v1/bot/${client.user.id}`,
		headers: {
			Authorization: paradisebots,
			'Content-Type': 'application/json',
		},
		data: {
			'shard_count': client.shard.count,
			'server_count': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] paradisebots stats posted.');
	}).catch(err => {
		console.error(err);
	});
};