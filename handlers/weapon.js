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

function loadWeapons(client) {
	// sword
	client.weapons.set('sword', {
		name: 'sword',
		price: 5000,
		emoji: '<:sword:868105110100779028>',
		passive: undefined,
		ability: '+10 Physical Attack',
	});

	// staff
	client.weapons.set('staff', {
		name: 'staff',
		price: 5000,
		emoji: '<:staff:868105110138519582>',
		passive: undefined,
		ability: '+10 Magical Attack',
	});

	// shield
	client.weapons.set('shield', {
		name: 'shield',
		price: 8000,
		emoji: '🛡️',
		passive: undefined,
		ability: '+5 Physical Resistance, +5 Magical Resistance',
	});

	// bow
	client.weapons.set('bow', {
		name: 'bow',
		price: 10000,
		emoji: '🏹',
		passive: 'Increase 5% speed every turn',
		ability: '+6 Physical Attack, +4 physical Resistance',
	});

	// fire-sword
	client.weapons.set('fire-sword', {
		name: 'fire-sword',
		price: 10000,
		emoji: '<a:firesword:868105110176301086>',
		passive: 'Deals 80% of your overall damage for the first turn',
		ability: '+5 Physical Attack, +5 Magical Attack',
	});

}

module.exports = { loadWeapons };