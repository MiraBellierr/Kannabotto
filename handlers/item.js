function loadItems(client) {
	// dog
	client.items.set('dog', {
		name: 'dog',
		price: 1000,
		emoji: '<:dog:868105109647810600>',
		sell: 500,
		info: 'Expand your bank capacity by 1,000',
		usable: true,
	});

	// fishing-rod
	client.items.set('fishing-rod', {
		name: 'fishing-rod',
		price: 5000,
		emoji: '🎣',
		sell: 2500,
		info: 'Allows you to go fishing',
		usable: false,
	});

	// hunting-rifle
	client.items.set('hunting-rifle', {
		name: 'hunting-rifle',
		price: 5000,
		emoji: '<:huntingrifle:868724539121610783>',
		sell: 2500,
		info: 'Allows you to go hunting',
		usable: false,
	});

	// guard
	client.items.set('guard', {
		name: 'guard',
		price: 5000,
		emoji: '<:bearguard:868105110289543188>',
		sell: 2500,
		info: 'Prevents people from robbing you for 12 hours',
		usable: true,
	});

	// bear
	client.items.set('bear', {
		name: 'bear',
		price: 3000,
		emoji: '<a:angrybear:868105109853327370>',
		sell: 1500,
		info: 'Boost XP by 50% for 1 hour',
		usable: true,
	});

	// laptop
	client.items.set('laptop', {
		name: 'laptop',
		price: 3000,
		emoji: '<:laptop:868105109379379221>',
		sell: 1500,
		info: 'Allows you to do a business',
		usable: false,
	});

	// pickaxe
	client.items.set('pickaxe', {
		name: 'pickaxe',
		price: 5100,
		emoji: '⛏',
		sell: 2550,
		info: 'Allows you to dig deep into the cave',
		usable: false,
	});

	// junk
	client.items.set('junk', {
		name: 'junk',
		price: undefined,
		emoji: '🦴',
		sell: 50,
		info: undefined,
		usable: false,
	});

	// tuna
	client.items.set('tuna', {
		name: 'tuna',
		price: undefined,
		emoji: '<:fish:868105109631025163>',
		sell: 250,
		info: undefined,
		usable: false,
	});

	// goldfish
	client.items.set('goldfish', {
		name: 'goldfish',
		price: undefined,
		emoji: '<:goldfish:868115088165462076>',
		sell: 500,
		info: undefined,
		usable: false,
	});

	// squid
	client.items.set('squid', {
		name: 'squid',
		price: undefined,
		emoji: '🦑',
		sell: 750,
		info: undefined,
		usable: false,
	});

	// whale
	client.items.set('squid', {
		name: 'whale',
		price: undefined,
		emoji: '🐋',
		sell: 1000,
		info: undefined,
		usable: false,
	});

	// rabbit
	client.items.set('rabbit', {
		name: 'rabbit',
		price: undefined,
		emoji: '🐇',
		sell: 50,
		info: undefined,
		usable: false,
	});

	// turkey
	client.items.set('turkey', {
		name: 'turkey',
		price: undefined,
		emoji: '🦃',
		sell: 250,
		info: undefined,
		usable: false,
	});

	// pig
	client.items.set('pig', {
		name: 'pig',
		price: undefined,
		emoji: '🐖',
		sell: 500,
		info: undefined,
		usable: false,
	});

	// deer
	client.items.set('deer', {
		name: 'deer',
		price: undefined,
		emoji: '🦌',
		sell: 750,
		info: undefined,
		usable: false,
	});

	// dragon
	client.items.set('dragon', {
		name: 'dragon',
		price: undefined,
		emoji: '🐉',
		sell: 1000,
		info: undefined,
	});

	// iron
	client.items.set('iron', {
		name: 'iron',
		price: undefined,
		emoji: '<:iron:868722021159292978>',
		sell: 52,
		info: undefined,
	});

	// copper
	client.items.set('copper', {
		name: 'copper',
		price: undefined,
		emoji: '<:copper:868722021142523924>',
		sell: 257,
		info: undefined,
	});

	// gold
	client.items.set('gold', {
		name: 'gold',
		price: undefined,
		emoji: '<:gold:868722020945371197>',
		sell: 555,
		info: undefined,
	});

	// bauxite
	client.items.set('bauxite', {
		name: 'bauxite',
		price: undefined,
		emoji: '<:bauxite:868119461243273226>',
		sell: 763,
		info: undefined,
	});

	// manganese
	client.items.set('manganese', {
		name: 'manganese',
		price: undefined,
		emoji: '<:manganese:868119479383646288>',
		sell: 1100,
		info: undefined,
	});
}

module.exports = { loadItems };