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
const { botlistspace } = require('../config.json');
module.exports = client => {

	axios({
		method: 'post',
		url: `https://api.botlist.space/v1/bots/${client.user.id}`,
		headers: {
			Authorization: botlistspace,
			'Content-Type': 'application/json',
		},
		data: {
			'shards': [client.guilds.cache.size],
			'server_count': client.guilds.cache.size,
		},
	}).then(() => {
		console.log('[LOG] botlist.space stats posted.');
	}).catch(err => {
		console.error(err);
	});
};