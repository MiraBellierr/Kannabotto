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

const { stripIndents } = require('common-tags');
const { bot_prefix } = require('../../config.json');
const Discord = require('discord.js');
const playing = new Set();
const animals = ['aardvark', 'abalone', 'african elephant', 'african gray parrot', 'african penguin', 'african rock python', 'african wild cat', 'agouti', 'airedale malamute', 'albatross', 'algae', 'alligator', 'alpaca', 'american bison', 'american cocker spaniel', 'american crocodile', 'american flamingo', 'american golden plover', 'american robin', 'american tree sparrow', 'amoeba', 'amphibian', 'anaconda', 'angelfish', 'angelshark', 'angonoka', 'animal', 'anole', 'ant', 'anteater', 'antelope', 'apatosaurus', 'ape', 'aphid', 'arachnid', 'archaeopteryx', 'arctic fox', 'arctic tern', 'arctic wolf', 'armadillo', 'arsinoitherium', 'arthropod', 'artiodactyls', 'asp', 'assassin bug', 'aye-aye', 'baboon', 'bactrian camel', 'badger', 'bald eagle', 'bandicoot', 'barnacle', 'barracuda', 'basilisk', 'basking shark', 'bass', 'basset hound', 'bat', 'beagle', 'bear', 'bearded dragon', 'beaver', 'bed bug', 'bee', 'beetle', 'beluga whale', 'bichon frise', 'bighorn sheep', 'bilby', 'binturong', 'bird', 'bison', 'bivalve', 'black bear', 'black bear hamster', 'black caiman', 'black racer', 'black swan', 'blackbird', 'bloodhound', 'blowfish', 'blue jay', 'blue morpho butterfly', 'blue ring octopus', 'blue shark', 'blue whale', 'blue-tongued skink', 'bluebird', 'bluefin tuna', 'boa constrictor', 'bobcat', 'bongo', 'bonobo', 'bony fish', 'border collie', 'boston terrier', 'bowhead whale', 'box turtle', 'boxer', 'brittle star', 'brown bear', 'brown pelican', 'buffalo', 'bug', 'bull', 'bull shark', 'bull snake', 'bulldog', 'bullfrog', 'bumblebee', 'bushbaby', 'butterfly', 'caiman', 'california sea lion', 'camel', 'canada goose', 'canary', 'cape buffalo', 'cape hunting dog', 'capybera', 'caracal', 'cardinal', 'caribou', 'carnivora', 'carpenter ant', 'cassowary', 'cat', 'catamount', 'caterpillar', 'cattle', 'cavy', 'centipede', 'cephalpod', 'chameleon', 'cheetah', 'chickadee', 'chicken', 'chihuahua', 'chimpanzee', 'chinchilla', 'chipmunk', 'chiton', 'chrysalis', 'cicada', 'clam', 'clownfish', 'coati', 'cobra', 'cockatoo', 'cockroach', 'cod', 'coelacanth', 'collared lizard', 'collared peccary', 'collie', 'coluga', 'common rhea', 'companion dog', 'conch', 'cookiecutter shark', 'copepod', 'copperhead snake', 'coral', 'coral snake', 'corn snake', 'cottonmouth', 'cougar', 'cow', 'coyote', 'coypu', 'crab', 'crane', 'crayfish', 'cricket', 'crocodile', 'crow', 'crustacean', 'cryptoclidus', 'cuttlefish', 'cutworm', 'dachshund', 'dall sheep', 'dall\'s porpoise', 'dalmatian', 'damselfly', 'dark-eyed junco', 'darkling beetle', 'deer', 'deinonychus', 'desert tortoise', 'desmatosuchus', 'dhole', 'diatom', 'dilophosaurus', 'dimetrodon', 'dingo', 'dinichthys', 'dinornis', 'dinosaur', 'diplodocus', 'doberman pinscher', 'dodo', 'doedicurus', 'dog', 'dogfish', 'dolphin', 'dolphin, bottlenose', 'dolphin, spotted', 'donkey', 'dory', 'dove', 'downy woodpecker', 'dragonfly', 'dromedary', 'duck', 'duck-billed platypus', 'dugong', 'dung beetle', 'dunkleosteus', 'eagle', 'earthworm', 'earwig', 'eastern bluebird', 'eastern quoll', 'echidna', 'echinoderms', 'edenta', 'edmontonia', 'edmontosaurus', 'eel', 'egg', 'egret', 'ekaltadelta', 'eland', 'elasmosaurus', 'elasmotherium', 'electric eel', 'elephant', 'elephant seal', 'elk', 'emerald tree boa', 'emperor angelfish', 'emperor penguin', 'emu', 'endangered species', 'eohippus', 'eoraptor', 'ermine', 'estemmenosuchus', 'extinct animals', 'fabrosaurus', 'falcon', 'farm animals', 'fennec fox', 'ferret', 'fiddler crab', 'fin whale', 'finch', 'fireant', 'firefly', 'fish', 'flamingo', 'flatworm', 'flea', 'flightless birds', 'flounder', 'fly', 'flying fish', 'flying squirrel', 'forest antelope', 'forest giraffe', 'fossa', 'fowl', 'fox', 'frilled lizard', 'frog', 'fruit bat', 'fruit fly', 'fugu', 'galagos', 'galapagos shark', 'gar', 'gastropod', 'gavial', 'gazelle', 'gecko', 'gerbil', 'german shepherd', 'giant squid', 'gibbon', 'gila monster', 'giraffe', 'glyptodon', 'gnat', 'gnu', 'goat', 'golden eagle', 'golden lion tamarin', 'golden retriever', 'goldfinch', 'goldfish', 'goose', 'gopher', 'gorilla', 'grasshopper', 'gray whale', 'great apes', 'great dane', 'great egret', 'great horned owl', 'great white shark', 'green darner dragonfly', 'green iguana', 'greenland shark', 'greyhound', 'grizzly bear', 'groundhog', 'grouper', 'grouse', 'grub', 'guinea pig', 'gull', 'gulper eel', 'hammerhead shark', 'hamster', 'hare', 'harlequin bug', 'harp seal', 'harpy eagle', 'hatchetfish', 'hawaiian goose', 'hawk', 'hedgehog', 'hen', 'hermit crab', 'heron', 'herring', 'hippo', 'hippopotamus', 'honey bee', 'hornet', 'horse', 'horseshoe crab', 'hound', 'house fly', 'howler monkey', 'human being', 'hummingbird', 'humpback whale', 'husky', 'hyena', 'hyracotherium', 'hyrax', 'ibis', 'ichthyornis', 'ichthyosaurus', 'iguana', 'iguanodon', 'imago', 'impala', 'indian elephant', 'insect', 'insectivores', 'invertebrates', 'irish setter', 'isopod', 'jack rabbit', 'jack russell terrier', 'jaguar', 'janenschia', 'japanese crane', 'javelina', 'jay', 'jellyfish', 'jerboa', 'joey', 'john dory', 'jumping bean moth', 'junco', 'junebug', 'kakapo', 'kangaroo', 'kangaroo rat', 'karakul', 'katydid', 'keel-billed toucan', 'kentrosaurus', 'killer whale', 'king cobra', 'king crab', 'kinkajou', 'kiwi', 'knobbed whelk', 'koala', 'komodo dragon', 'kookaburra', 'krill', 'kronosaurus', 'kudu', 'labrador retriever', 'ladybug', 'lagomorph', 'lake trout', 'lanternfish', 'larva', 'leafcutter ant', 'leghorn', 'lemming', 'lemon shark', 'lemur', 'leopard', 'lhasa apso', 'lice', 'lightning bug', 'limpet', 'lion', 'liopleurodon', 'lizard', 'llama', 'lobster', 'locust', 'loggerhead turtle', 'longhorn', 'loon', 'lorikeet', 'loris', 'louse', 'luminous shark', 'luna moth', 'lynx', 'macaque', 'macaw', 'mackerel', 'macrauchenia', 'maggot', 'mako shark', 'mallard duck', 'mamba', 'mammal', 'mammoth', 'man-o\'-war', 'manatee', 'mandrill', 'manta ray', 'mantid', 'mantis', 'marbled murrelet', 'marine mammals', 'marmoset', 'marmot', 'marsupial', 'mastiff', 'mastodon', 'meadowlark', 'mealworm', 'meerkat', 'megalodon', 'megamouth shark', 'merganser', 'mice', 'midge', 'migrate', 'millipede', 'mink', 'minnow', 'moa', 'mockingbird', 'mole', 'mollusk', 'monarch butterfly', 'mongoose', 'monitor lizard', 'monkey', 'monotreme', 'moose', 'moray eel', 'morganucodon', 'morpho butterfly', 'mosquito', 'moth', 'mountain lion', 'mouse', 'mudpuppy', 'musk ox', 'mussels', 'mustelids', 'nabarlek', 'naked mole-rat', 'nandu', 'narwhal', 'nautilus', 'nene', 'nest', 'newt', 'nightingale', 'nine-banded armadillo', 'north american beaver', 'north american porcupine', 'northern cardinal', 'northern elephant seal', 'northern fur seal', 'northern right whale', 'numbat', 'nurse shark', 'nuthatch', 'nutria', 'nymph', 'ocelot', 'octopus', 'okapi', 'old english sheepdog', 'onager', 'opossum', 'orangutan', 'orca', 'oregon silverspot butterfly', 'oriole', 'ornitholestes', 'ornithomimus', 'oropendola', 'orthacanthus', 'oryx', 'ostrich', 'otter, river', 'otter, sea', 'oviraptor', 'owl', 'ox', 'oxpecker', 'oyster', 'painted lady butterfly', 'painted turtle', 'panda', 'pangolin', 'panther', 'parakeet', 'parrot', 'peacock', 'peafowl', 'pekingese', 'pelican', 'penguin', 'peregrine falcon', 'perissodactyls', 'petrel', 'pig', 'pigeon', 'pika', 'pill bug', 'pinnipeds', 'piranha', 'placental mammals', 'plankton', 'platybelodon', 'platypus', 'ploughshare tortoise', 'plover', 'polar bear', 'polliwog', 'pomeranian', 'pompano', 'pond skater', 'poodle', 'porpoise', 'port jackson shark', 'portuguese water dog', 'postosuchus', 'prairie chicken', 'praying mantid', 'praying mantis', 'primates', 'proboscideans', 'pronghorn', 'protozoan', 'pufferfish', 'puffin', 'pug', 'puma', 'pupa', 'pupfish', 'python', 'quaesitosaurus', 'quagga', 'quail', 'queen alexandra\'s birdwing', 'queen conch', 'quetzal', 'quokka', 'quoll', 'rabbit', 'raccoon', 'rat', 'rattlesnake', 'ray', 'red hooded duck', 'red kangaroo', 'red panda', 'red wolf', 'red-tailed hawk', 'redbilled oxpecker', 'reindeer', 'reptile', 'rhea', 'rhino', 'rhinoceros', 'rhode island red', 'right whale', 'ring-billed gull', 'ring-tailed lemur', 'ringtail possum', 'river otter', 'roach', 'roadrunner', 'robin', 'rock dove', 'rockhopper penguin', 'rodent', 'rooster', 'rottweiler', 'roundworm', 'ruby-throated hummingbird', 'sailfish', 'salamander', 'salmon', 'sand dollar', 'sandpiper', 'scallop', 'scarlet macaw', 'scorpion', 'scottish terrier', 'sea anemone', 'sea cow', 'sea cucumber', 'sea otter', 'sea star', 'sea turtle', 'sea urchin', 'sea worm', 'seahorse', 'seal', 'sealion', 'serval', 'shark', 'sheep', 'shrew', 'shrimp', 'siamang', 'siberian husky', 'silkworm', 'silverfish', 'skink', 'skipper', 'skunk', 'sloth', 'slow worm', 'slug', 'smilodon', 'snail', 'snake', 'snapper', 'snapping turtle', 'snow goose', 'snow leopard', 'snowy owl', 'softshell turtle', 'sparrow', 'spectacled caiman', 'spectacled porpoise', 'spider', 'spiny anteater', 'spiny lizard', 'sponge', 'spotted owl', 'springtail', 'squid', 'squirrel', 'st. bernard', 'starfish', 'starling', 'stegosaurus', 'stingray', 'stonefly', 'stork', 'sugar glider', 'sunfish', 'swallowtail butterfly', 'swan', 'swift', 'swordfish', 't. rex', 'tadpole', 'tamarin', 'tanager', 'tapir', 'tarantula', 'tarpon', 'tarsier', 'tasmanian devil', 'tasmanian tiger', 'teratosaurus', 'termite', 'tern', 'terrier', 'thecodontosaurus', 'thescelosaurus', 'three-toed sloth', 'thresher shark', 'thrip', 'tick', 'tiger', 'tiger shark', 'tiger swallowtail butterfly', 'toad', 'torosaurus', 'tortoise', 'toucan', 'trachodon', 'tree shrew', 'tree sparrow', 'treefrog', 'triceratops', 'trilobite', 'troodon', 'trout', 'trumpeter swan', 'tsetse fly', 'tuatara', 'tuna', 'tundra wolf', 'turkey', 'turtle', 'tyrannosaurus rex', 'ultrasaurus', 'ulysses butterfly', 'umbrellabird', 'ungulates', 'uniramians', 'urchin', 'utahraptor', 'valley quail', 'vampire bat', 'veiled chameleon', 'velociraptor', 'venomous animals', 'vertebrates', 'viceroy butterfly', 'vinegarroon', 'viper',
	'virginia opossum', 'vulcanodon', 'vulture', 'walkingstick', 'wallaby', 'walrus', 'warthog', 'wasp', 'water moccasin', 'water strider', 'waterbug', 'weasel', 'weddell seal', 'weevil', 'west highland white terrier', 'western meadowlark', 'western spotted owl', 'whale', 'whale shark', 'whelk', 'whip scorpion', 'whippet', 'white bengal tiger', 'white dove', 'white pelican', 'white rhinoceros', 'white tiger', 'white-breasted nuthatch', 'white-spotted dolphin', 'white-tailed deer', 'wild cat', 'wild dog', 'wildebeest', 'wolf', 'wolverine', 'wombat', 'wood louse', 'woodchuck', 'woodland caribou', 'woodpecker', 'woolly bear caterpillar', 'woolly mammoth', 'woolly rhinoceros', 'working dog', 'worm', 'wren', 'xenarthra', 'edentata', 'xenops', 'xiaosaurus', 'yak', 'yellow mealworm', 'yellow mongoose', ' yellowjacket', 'yorkshire terrier', 'zebra', 'zebra bullhead shark', 'zebra longwing butterfly', 'zebra swallowtail butterfly', 'zooplankton', 'zorilla', 'zorro'];
const categories = [animals];
const Models = require('../../create-model.js');

module.exports = {
	name: 'hangman',
	category: '[🎮] games',
	aliases: ['hg'],
	description: 'Prevent a man from being hanged by guessing words as fast as you can. Win <a:jasminecoins:868105109748469780> 100 if you can guess the word',
	example: `${bot_prefix}hangman`,
	run: async (client, message) => {
		import('parse-ms').then(async ms => {
			const user = message.author.id;

			const Disable = Models.Disable();
			const Blacklist = Models.Blacklist();
			const Cooldown = Models.Cooldown();
			const Inventory = Models.Inventory();
			const Economy = Models.Economy();
			const Achievement = Models.Achievement();

			if (!await Disable.findOne({ where: { guildId: message.guild.id } })) {
				await Disable.create({
					guildId: message.guild.id,
				});
			}
			const disable = await Disable.findOne({ where: { guildId: message.guild.id } });

			const warn = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('This command is disabled for this guild')
				.setDescription('This is most likely because this guild has broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
				.setTimestamp();

			if (disable.get('economy') === 1) return message.channel.send(warn);
			if (disable.get('games') === 1) return message.channel.send(warn);


			if (!await Blacklist.findOne({ where: { userId: message.author.id } })) {
				await Blacklist.create({
					userId: message.author.id,
				});
			}
			const blacklist = await Blacklist.findOne({ where: { userId: message.author.id } });

			const warn1 = new Discord.MessageEmbed()
				.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
				.setTitle('You have been blacklisted from this command')
				.setDescription('This is most likely because you have broken one of our rules.\n To appeal: [click here](https://forms.gle/Fj2322CcFAsTn6pr6)')
				.setTimestamp();


			if (blacklist.get('blacklist') === 1) return message.channel.send(warn1);
			if (blacklist.get('games') === 1) return message.channel.send(warn1);


			if (!await Cooldown.findOne({ where: { userId: user } })) {
				await Cooldown.create({
					userId: user,
				});
			}
			const cooldown = await Cooldown.findOne({ where: { userId: user } });


			if (!await Inventory.findOne({ where: { userId: user } })) {
				await Inventory.create({
					userId: user,
				});
			}


			if (!await Economy.findOne({ where: { userId: user } })) {
				await Economy.create({
					userId: user,
				});
			}
			const economy = await Economy.findOne({ where: { userId: user } });


			if (!await Achievement.findOne({ where: { userId: user } })) {
				await Achievement.create({
					userId: user,
				});
			}
			const achievement = await Achievement.findOne({ where: { userId: user } });

			const timeOut = 15000;
			const lastHangman = await cooldown.get('hangman');
			if (lastHangman !== null && timeOut - (Date.now() - lastHangman) > 0) {
				const timeObj = ms.default(timeOut - (Date.now() - lastHangman));
				message.channel.send(`**${message.author.username}**, please wait **${timeObj.seconds}s** till you can play again.`);
			}
			else {
				await Cooldown.update({ hangman: Date.now() }, { where: { userId: user } });

				const category = categories[Math.floor(Math.random() * categories.length)];
				let theme;
				if (category === animals) theme = 'Animals';
				if (playing.has(message.channel.id)) return message.reply('Only one game may be occurring per channel.');
				playing.add(message.channel.id);
				try {
					const word = category[Math.floor(Math.random() * category.length)];
					console.log(word);
					let points = 0;
					let displayText = null;
					let guessed = false;
					const confirmation = [];
					const incorrect = [];
					const display = new Array(word.length).fill('◯');
					for (let i = 0; i < word.length; i++) {
						if (word.charAt(i) === ' ') {
							display[i] = word.charAt(i);
							confirmation.push(word.charAt(i));
						}
						if (word.charAt(i) === '-') {
							display[i] = word.charAt(i);
							confirmation.push(word.charAt(i));
						}
						if (word.charAt(i) === '\'') {
							display[i] = word.charAt(i);
							confirmation.push(word.charAt(i));
						}
						if (word.charAt(i) === ',') {
							display[i] = word.charAt(i);
							confirmation.push(word.charAt(i));
						}
						if (word.charAt(i) === '.') {
							display[i] = word.charAt(i);
							confirmation.push(word.charAt(i));
						}
					}
					while (word.length !== confirmation.length && points < 6) {
						const embed = new Discord.MessageEmbed()
							.setColor('RANDOM')
							.setTitle(`Hangman game - Theme: ${theme}`)
							.setDescription(stripIndents`
					${displayText === null ? 'Here we go!' : displayText ? 'Good job!' : 'Nope!'}
					\`${display.join(' ')}\`. Which letter do you choose?
					Incorrect Tries: ${incorrect.join(', ') || 'None'}
					\`\`\`
				 . ┌─────┐
				 . ┃      ┋
				 . ┃      ${points > 0 ? 'O' : ''}
				 . ┃     ${points > 2 ? '/' : ' '}${points > 1 ? '|' : ''}${points > 3 ? '\\' : ''}
				 . ┃     ${points > 4 ? '/' : ''}${points > 5 ? '\\' : ''}
				  =============
					\`\`\`
				`);
						const m = await message.channel.send(embed);
						const filter = res => {
							const choice = res.content.toLowerCase();
							return res.author.id === message.author.id && !confirmation.includes(choice) && !incorrect.includes(choice);
						};
						const guess = await message.channel.awaitMessages(filter, {
							max: 1,
							time: 30000,
						});
						m.delete();
						if (!guess.size) {
							playing.delete(message.channel.id);
							await message.reply(`Sorry, time is up! The answer was **${word}**`);
							return;
						}
						const choice = guess.first().content.toLowerCase();
						if (choice === 'end') break;
						if (choice.length > 1 && choice === word) {
							guessed = true;
							break;
						}
						else if (word.includes(choice)) {
							displayText = true;
							for (let i = 0; i < word.length; i++) {
								if (word.charAt(i) !== choice) continue; // eslint-disable-line max-depth
								confirmation.push(word.charAt(i));
								display[i] = word.charAt(i);
							}
						}
						else {
							displayText = false;
							if (choice.length === 1) incorrect.push(choice);
							points++;
						}
					}
					playing.delete(message.channel.id);
					if (word.length === confirmation.length || guessed) {
						await Economy.update({ balance: economy.get('balance') + 100 }, { where: { userId: user } });
						await Achievement.update({ hangman: achievement.get('hangman') + 1 }, { where: { userId: user } });

						message.channel.send(`You're correct! It was **${word}**. You won **<a:jasminecoins:868105109748469780> 100**.`);
						return;
					}
					message.channel.send(`You couldn't guess it... Too bad... The answer was **${word}**`);
					return;
				}
				catch (err) {
					playing.delete(message.channel.id);
					return message.reply(`Oh no, an error occurred :( \`${err.message}\`. Try again later!`);
				}
			}
		});
	},
};