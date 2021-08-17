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
const database = require('./database/characters.json');
const fs = require('fs');


function getRandomArbitrary(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
function randomNum() {
	const arr = [0, 0, 0, 0, 0, 0];
	while (arr[0] + arr[1] + arr[2] + arr[3] + arr[4] + arr[5] !== 21) {
		arr[0] = getRandomArbitrary(1, 10);
		arr[1] = getRandomArbitrary(1, 10);
		arr[2] = getRandomArbitrary(1, 10);
		arr[3] = getRandomArbitrary(1, 10);
		arr[4] = getRandomArbitrary(1, 10);
		arr[5] = getRandomArbitrary(1, 10);
	}

	return arr;
}

axios({
	method: 'get',
	url: 'https://api.jikan.moe/v3/search/character?letter=a&page=5',
	headers: {
		'Content-Type': 'application/json',
	},
}).then(async res => {
	const characters = res.data.results;
	let id = 183;
	for (let i = 0; i < characters.length; i++) {
		if (characters[i].image_url.includes('questionmark')) {
			continue;
		}
		const arr = randomNum();

		database.push({ id: `${id}`, name: characters[i].name, from: characters[i].anime[0] ? characters[i].anime[0].name : characters[i].manga[0].name, health: arr[0], physical_attack: arr[1], magical_attack: arr[2], physical_resistance: arr[3], magical_resistance: arr[4], speed: arr[5], image: characters[i].image_url });

		id++;
	}

	fs.writeFile('./database/characters.json', JSON.stringify(database, null, 2), (err) => {
		console.log(err);
	});
	console.log('success');
}).catch(err => {
	console.log(err);
});