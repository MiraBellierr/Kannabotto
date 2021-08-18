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

module.exports = {
	getMember: async function(message, toFind = '') {
		toFind = toFind.toLowerCase();
		let target = false;

		target = await message.guild.members.fetch(toFind).catch(() => target = message.guild.members.cache.get(toFind));

		if (!target) {
			target = message.guild.members.cache.get(toFind);
		}
		else if (!target.user) {
			target = message.guild.members.cache.get(toFind);
		}

		if (!target && message.mentions.members) {
			target = message.mentions.members.first();
		}
		if (!target && toFind) {
			target = message.guild.members.cache.find(member => {
				return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
			});
		}

		if (!target) {
			target = message.member;
		}

		return await target;
	},

	randomRange: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	formatDate: function(date) {
		const options = {
			weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
			timeZone: 'UTC',
		};
		return new Intl.DateTimeFormat('en-US', options).format(date);
	},
	formatTime: function(date) {
		const options = {
			hour: 'numeric', minute: 'numeric', second: 'numeric',
		};
		return new Intl.DateTimeFormat('en-US', options).format(date);
	},

	promptMessage: async function(message, author, time, validReactions) {
		// We put time in the time as seconds, with this it's being transfered to MS
		time *= 1000;

		// For every emoji in the function parameters, react in the good order.
		for (const reaction of validReactions) await message.react(reaction);

		// Only allow reactions from the author,
		// and the emoji must be in array we provided.
		const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

		// And of course, await the reactions
		return message
			.awaitReactions(filter, { max: 1, time: time })
			.then(collected => collected.first() && collected.first().emoji.name);

	},

	getWork: function(coins) {
		const works = [
			`You work as a fortune cookie writer and earn ${coins}`,
			`You mow the lawn of your friend Stacy's mother. She's a nice lady, who pays ${coins} for your services.`,
			`You take a nice stroll around the park, looking down and finding ${coins}. Congrats!`,
			`You see someone struggling to lift a box into their car, you rush over to help them before they hurt themselves. After helping them, they graciously give you ${coins}`,
			`You work as a smarties expert and earn ${coins}`,
			`You get a commission request, the payment is ${coins}.`,
			`You deliver 1,000 pizzas for a YouTube video, and make ${coins}!`,
			`You work as a professional cat-petter and earn ${coins}`,
			`You work as a beaver expert and earn ${coins}`,
			`You clean off the tables and get paid ${coins}`,
			`You work for a private military company, earning ${coins}`,
			`You worked in the cafeteria and have earned ${coins}`,
			`You work as a human statue and earn ${coins}`,
			`You worked your very best at a printing press which was hiring and earned your well deserved ${coins}!`,
			`Somehow you managed to get a job. Milking space cows. Here's ${coins}.`,
			`You take an hour to patch a broken water pipe in the yard and earn ${coins}`,
			`You are hired by the Mojave Express to deliver a package to The King in Freeside. You are paid ${coins}`,
			`A good day's work as an apprentice at the local clinic earns you ${coins}.`,
			`You dabbed so hard that even your mother is proud! You make ${coins} off of donations.`,
			`You carefully clean the spring lock suits and receive ${coins}`,
			`You work as an extra for Avengers 4. You didn't feel so good, but you got ${coins}.`,
			`You work as a professional Minecraft hacker. You manage to rake in ${coins}`,
			`You take part in a Civil War battle and earn ${coins} for your team winning!`,
			`You work as a janitor and earn ${coins}`,
			`You did absolutely nothing and still managed to get paid ${coins}.`,
			`You clean off the animatronics and get paid ${coins}`,
			`You work as a voice actor for SpongeBob and managed to gain ${coins}`,
			`You fail at work, but your boss pays you ${coins} out of pity.`,
			`You sell your crab for ${coins}, you monster`,
			`You save a survivor from a group of zombies. He gives you ${coins}.`,
			`You work as the namer of clouds and earn ${coins}`,
			`You went to work and gained ${coins}`,
			`You receive a check of ${coins} after having done some clever business with a friend in the markets.`,
			`A drunk man pays you ${coins} to walk backwards.`,
			`You are hired as a whiteboard marker salesperson and earn ${coins}`,
			`You work as a wine taster and earn ${coins}`,
			`You work as a dog food taster and earn ${coins}`,
			`You work at a lamp store and earn ${coins}`,
			`You helped people at the retirement home with their bingo game. They paid you ${coins} for the hard work`,
			`The demand for mobile games has increased so you create a new game full of micro-transactions. You earn a total of ${coins} off your new game.`,
			`You cleaned 200 toilets in the prison. The lazy janitor thanked you and gave you ${coins}.`,
			`You work as a professional cleaner. After hiding the body you're handed ${coins}.`,
			`You work as a body pillow factory salesman on the internet for real weebs, the weebs gave you ${coins}`,
			`You worked overtime for ${coins}`,
			`You work as a pilot and earn ${coins}`,
			`You work from 9 to 5 in a law firm as an accountant, going through profits and expenditure accounts. At the end of the day, the papers earns you ${coins}`,
			`Your work at a market selling apples with a shop clerk for a day. They pay you ${coins} for helping them out.`,
			`You work as a Discord bot developer and earn ${coins}`,
			`You go through your bag, and decide to sell some useless items you don't need. It turns out all that junk was worth ${coins}.`,
			`You did a 30 minute workout. While jogging you found ${coins} on the floor.`,
			`You serve the customers and receive ${coins}`,
			`You got hired as a stripper! You work that pole and make ${coins}`,
			`You work as a child birth educator and earn ${coins}`,
			`Somehow you managed to get a job. Milking space cows. Here's ${coins}.`,
			`You work as an elementary school teacher and earn ${coins}`,
			`You get fired for sleeping on the job, but found ${coins} on the way back home!`,
			`You worked as a substitute teacher in a school and earned ${coins}. The students loved you!`,
			`You've worked on a farm cultivating wheat from dawn to dusk. The land lord pays you ${coins} for your struggles.`,
			`You got featured and won ${coins}`,
			`You work 10 minutes at a local Pizza Hut. You earned ${coins}.`,
			`Instead of going to work, you decided to look for money on the ground. Fortunately enough, you found ${coins}`,
			`You work as a cookie cutter and earn ${coins}.`,
			`You work as an Irish dancer and earn ${coins}`,
			`Taxes collected! You have gained ${coins}`,
			`You come home full of sweat after a hard day of boxing, the sponsors give you ${coins}`,
			`You worked as a Bride Kidnapping Expert, for that you were paid ${coins}!`,
			`You worked for the Police and earned ${coins}`,
			`You work as a plumber to fix a blonde housewife's broken pipes and earn ${coins}`,
			`You did some social work for a good cause ! You received ${coins} for your contributions !`,
			`You bought and sold items and profited ${coins}`,
			`You press some buttons on a keyboard, gaining ${coins}`,
			`You sign up for a DJ job and you play Country Road. You make ${coins} just for playing that song, so nice pick!`,
			`You work as a meerkat behaviour consultant and earn ${coins}`,
			`You work as a director of sand bags and earn ${coins}`,
			`Admins are being nice (for once) and grant you ${coins}.`,
			`You work as an iceberg mover and earn ${coins}`,
			`You work as a police officer and earn ${coins}`,
			`You found ${coins} lying on the floor in General Chat!`,
			`You create and launch a game on Roblox, it becomes a hit! You get money from people buying early access, in game passes and currency in game, you convert the Robux you earn into server money you got ${coins}!`,
			`You work as a beefeater and earn ${coins}`,
			`Great job! You work as a professional professional and got ${coins}`,
			`You clean poop off the stalls at Walmart and get ${coins}`,
			`You work as an egg and earn ${coins}`,
			`You work as a professional apologiser and earn ${coins}`,
			`You baked some nice cookies for all, here is ${coins}`,
			`You spend all day creating graphic designs for YouTube channels and Twitter accounts just for a measly ${coins}.`,
			`A sudden gust of wind blows ${coins} in your direction.`,
			`You got more than 1,000 subscribers on YouTube, your last video made you really famous, and then comes the YouTube money ${coins}`,
			`You work as a zombie for The Walking Dead AMC show and earn ${coins}`,
			`You drove new recruits to the base and you got paid ${coins} for doing it`,
			`You got out of bed. Have ${coins}`,
			`You work as a head receiver and earn ${coins}`,
			`You work as a snake milker and earn ${coins}`,
			`You are kidnapped and taken to an underground coliseum where you fought off monsters with people you've never met before. You earn ${coins}, albeit reluctantly.`,
			`You work at a winery and crush grapes for awhile. You are paid ${coins} and given a bottle of wine.`,
			`You worked for a game studio as their program team member. A measly ${coins} was earned.`,
			`You found ${coins} on the floor.`,
			`You help clean up a local bar, the bar owner pays you ${coins} for your work.`,
			`You work as an experienced bra fitter and earn ${coins}`,
			`You clean off the chairs and get paid ${coins}`,
			`You actually finished the plate of vegetables that your parents made you eat! You were awarded ${coins}.`,
			`You work as an actor for the Emoji Movie, and get paid ${coins}.`,
			`You help herd cows for a farmer. For your help he pays you ${coins}.`,
			`You and your mariachi band play music at a wedding for ${coins}`,
			`You gave yourself ${coins} that you didn't even have! What is this wizardry...`,
			`You run a relatively popular Tumblr blog and make ${coins} from ad revenue.`,
			`You work as a DJ in Ibiza and earn ${coins}`,
			`You work as a dumpster diver and earn ${coins}`,
			`You worked as a human windshield wiper in India for ${coins}`,
			`You got cloned for science. You earned ${coins}`,
			`You drive women to the store for ${coins}`,
			`You put on a spring lock suit and entertain the customers. You receive ${coins}`,
			`You begin to code a game you have been thinking about for a while, and your friends give you ${coins} to help fund the project!`,
			`Work at the ice-cream shop of your childhood dreams and earn ${coins}`,
			`You work as an experienced boner and earn ${coins}`,
			`You eat bananas for a living and get ${coins}`,
			`You shine people's shoes in class and they give you ${coins}.`,
			`You take your dog for a walk and gain ${coins}`,
			`You have a successful YouTube channel and make ${coins} for that sweet, sweet AD revenue`,
			`You work as a window cleaner for the Gherkin in London and earn ${coins}`,
			`You try to find out how many licks it takes to get to the center of a Tootsie Pop. Turns out it's 3 and a crunch. The research team pays you ${coins}.`,
			`You work as a breath odour evaluator and earn ${coins}`,
			`You worked at the office overtime for ${coins}`,
			`Your job as a fart collector is very interesting and earns you ${coins}.`,
			`You work as the head of potatoes and earn ${coins}`,
			`You sell Girl Scout Cookies and earn ${coins}.`,
			`You work as a body double for Shakira. And your hips really don’t lie. You earn ${coins}.`,
			`You work as an ostrich baby sitter and earn ${coins}`,
			`You work as a professional cock fighter and earn ${coins}`,
			`You work as a circus clown and earn ${coins}.`,
			`You paint a lovely watercolor Moon and sell it at a local art fair for ${coins}.`,
			`You sweep the floor and get paid ${coins}`,
			`You battled and gained ${coins}.`,
			`You work as a children's toy tester and earn ${coins}`,
			`You do some work around the house for ${coins}`,
			`You did some odd jobs in the city and earned ${coins}. Good job!`,
			`You work as a space lawyer and earn ${coins}`,
			`You spent an 8 hour shift walking around in 10 inch heels and a nice dress handing out flyers to rude customers. Your feet are killing you, and you can't wait to get that dress off. At least you got paid ${coins} for it.`,
			`You work as a cleaner for the Royal Palace and earn ${coins}`,
			`You hastily wipe down the Café counters. Your boss pays you ${coins}.`,
			`You work as a plus sized model and earn ${coins}`,
			`You work as a bush pruner for Donald Trump and earn ${coins}`,
			`You solved the mystery of the Cholera Outbreak and have been rewarded by the government with a sum of ${coins}.`,
			`You work as a flatulence smell reduction underwear maker and earn ${coins}`,
			`Someone adopted a puppy from your shelter and got ${coins} for it!`,
			`You work as a Kanna bot developer and earn ${coins}`,
			`You work as a comedian and earn ${coins}`,
			`You work as a sandcastle builder and earn ${coins}`,
			`You work as a professional worker and earn ${coins}.`,
			`You posted something to the subreddit! You’ve earned ${coins}!`,
			`You work as a pumpkin painter and are surprised to find ${coins} stashed inside one of them.`,
			`You complete a daily quest that takes you about 3 hours and you gain ${coins}! Even though you lost half of your ammo, broke all of your guns, and your spirit is all but crushed`,
			`You work as a toy manufacturer and sell toys to kids for ${coins}`,
			`You work as a taxi driver and earn ${coins}`,
			`Somebody once told me the world was gonna roll me, I ain't the sharpest tool in the sh- oh, uh- you did something good and got ${coins} I think...`,
			`While you were searching for Pokémon in the tall grass, you found ${coins}!`,
			`You find ${coins} randomly lying in the gutter`,
			`You walk dogs for ${coins}.`,
			`You become a game developer and raised ${coins} for charity.`,
			`You work as an IMAX screen cleaner and earn ${coins}`,
			`Your shift at the Kwik-E mart got you a total of ${coins}`,
			`You work as a part time game programmer. You rake in ${coins}`,
			`You work as a bounty hunter and earn ${coins}`,
			`You defended an old lady from robbers. You got a smooch on the cheek and earned ${coins}`,
			`You work as a help desk technician and earn ${coins}`,
			`You work as the president and earn ${coins}`,
			`You sell V-bucks and make ${coins}!`,
			`You clean off the counters and get paid ${coins}`,
			`You bake cupcakes and receive ${coins}`,
			`After a long day of tolerating your annoying co-workers, your boss pays you extra and you earn ${coins}!`,
			`You start up a very small company that made near no money before you sold it for ${coins}.`,
			`You work as an eel ecologist and earn ${coins}`,
			`You overslept and miss work, but a buddy clocked you in so you got paid ${coins}.`,
			`You drive a bus and give free rides. Heres your tip ${coins}.`,
			`You dig around in your yard and gain ${coins}`,
			`You made a great pun! Take this ${coins}.`,
			`You work as a dog breath sniffer and earn ${coins}`,
			`You enter a fidget spinner spinning contest and out-spin the other fidget spinner spinners. You make ${coins}.`,
			`You milk a cow for ${coins}`,
			`You worked hard at Burger King and earned ${coins}`,
			`You work as a personal shopper and earn ${coins}`,
		];

		const work = works[Math.floor(Math.random() * works.length)];

		return work;
	},

	getCrimeSuccess: function(coins) {
		const crimes = [
			`You sell your first mixtape and earn ${coins}`,
			`You sell cellular phones for a whopping ${coins}`,
			`You stole a car and sold it for ${coins}`,
			`You successfully take furniture from the Furniture Store and sell it online for ${coins}!`,
			`You stole a dog and sold it to the old lady next door for ${coins}`,
			`You ransacked your manager's home, found his prized alarm clock, and sold it for ${coins}`,
			`You work for a hacking association and earn ${coins}`,
			`You hacked your parent's bank account and made ${coins}.`,
			`You do a heist on the EU bank for ${coins}`,
			`You were a hacker and stole robux ${coins}`,
			`You kill a guard with a sickle and steal ${coins} from his dead, bloated corpse.`,
			`You mugged a bunch of nuns for ${coins}`,
			`As you exit your backyard, a dog from down the street bites your leg leaving you with deep cuts on your calf. You stumble with pain and kick the dog into your backyard before closing the gate. Later that day a Lost Dog poster is seen on the street offering a reward. You return the dog, only after receiving your ${coins} reward. He shouldn't have bit you on your own property.`,
			`You mug a hobo on the street and manage to get ${coins}`,
			`You rob a liquor store for ${coins}`,
			`You steal change from the homeless. You got ${coins}`,
			`You work for a Mexican cartel and make ${coins}`,
			`You find some farming tools and steal a few when people aren't looking and sell them to a farmer for ${coins}`,
			`What me? No, I didn't commit crime. Crime-who? Crime-what? Acquire ${coins} for something that definitely wasn't illegal`,
			`You find a wallet on the ground containing ${coins}. You pick it up and look at the ID inside. You see the man on the ID card running around frantically looking for said wallet. You pocket the wallet and walk away.`,
			`You stole a prized diamond from the nearby bank vault, selling it for ${coins}.`,
			`You travel back in time to before the Gold Rush began and take all the gold. You travel back to the present and trade it in for ${coins}.`,
			`The Russian government pays you ${coins} after you successfully blow up an arms depot.`,
			`You hack into the government's economy system and manage to steal ${coins}.`,
			`You steal ${coins} from your baby sister's allowance money from her sparkly pink piggy bank.`,
			`You manage to slip some gemstones into your pockets when the store owner isn't looking, selling them later for ${coins}.`,
			`You hacked into a terrorist's computer, and managed to earn ${coins}`,
			`You download and repost an art tutorial on YouTube that gets a lot of hits, ${coins} arrives in the mail the next day.`,
			`You set up a fake kickstarter for a game and end up stealing ${coins} from unsuspecting investors.`,
			`You broke into the Warden's office and stole his chair. You managed to sell it for ${coins}.`,
			`You stole Justin Bieber's wallet and found ${coins} in it.`,
			`You rob an orphanage for ${coins}`,
			`On Highway 9 you come across a courier heading to New Tulsa. You have a small conversation and figure out he is transporting a shipment of scavenged poker chips. Filled with greed you put a bullet in his gut and loot the package. When returning to New Tulsa you sneak the chips into the Hard Rock and cash them in for ${coins}. No one found out... thank God.`,
			`You help an old lady cross the road, ${coins} falls out of her purse and you take it!`,
			`Being the criminal mastermind you are, you decide to rob the next person you see. An old lady approaches, here's your chance! You threaten her & demand money. The poor old lady gives you ${coins} in sheer terror.`,
			`You assassinate an actor for ${coins}`,
			`You bombed Antarctica and received ${coins}`,
			`You call a few friends and raid a newspaper shop with machetes. The operation is successful, and from the loot you earn ${coins}.`,
			`You assassinate a high priority target. Your client pays you ${coins}.`,
			`You robbed ${coins} from a convenience store.`,
			`Your hacker friend wires you ${coins}. Good payroll today gamers.`,
			`You smuggle pugs across the Mexican border for a cool ${coins}.`,
			`You infiltrate the FBI HQ and make out with the secret plans to sell for ${coins}`,
			`You break into Discord Headquarters, you steal ${coins} and escape unnoticed!`,
			`You rob a McDonald's and take ${coins}.`,
			`You steal a painting of a mustached man and sell it for ${coins}.`,
			`You steal the Queen's crown and sell it on the black market for ${coins}`,
			`You pickpocket a passing noble, guess crime does pay after all. You manage to steal ${coins}`,
			`You invaded a hangout party and stole ${coins}`,
			`The "Don't Step on the Grass" sign in the park was taunting you, so you pranced all over the grassy fields before picking the pocket of the nearby patrolling traffic officer, you were able to nab ${coins} from their pockets.`,
			`You successfully created a pyramid scheme making ${coins} in the process.`,
			`You pickpocket someone successfully and steal the money out of their wallet, there was ${coins} in it`,
			`You steal a hobo's money jar for ${coins}`,
			`You milk your videos with clickbait and giveaway-videos, earning ${coins}`,
			`You find a trading vulnerability in a game and duplicate inventory for which you sell and earn ${coins}`,
			`You decided to embrace your inner dark side, and promptly massacre an entire nation, netting you ${coins}`,
			`You steal lamps for ${coins}`,
			`You killed a man and liked it, you got ${coins}`,
			`You break into a builder's workshop and manage to steal ${coins}`,
		];

		const crime = crimes[Math.floor(Math.random() * crimes.length)];

		return crime;
	},

	getCrimeFail: function(coins) {
		const crimes = [
			`You attempt to rob the peasant's village. You don't find any valuable assets, and you get fined ${coins}.`,
			`You got caught stealing cheese wheels and are fined ${coins}`,
			`Dude, you just duped, and got banned. Sorry you lose ${coins}`,
			`You failed stealing candy from a kid and got fined ${coins}`,
			`You choked on a Twinkie and had to pay a hospital fine of ${coins}.`,
			`You sneak into the theatre and try to steal tickets but you get caught and thrown out with a fine of ${coins}`,
			`You hit someone with a rock and they sued you for ${coins}`,
			`The old lady you tried to rob turned out to be a 6'4'' police officer in prime condition. You got the shit beaten out of you and were fined ${coins}`,
			`You have been caught hacking your neighbours wifi, and have been fined a total of ${coins}`,
			`You fail to pickpocket a noble. He summons the guards and they fine you ${coins}`,
			`You eat pizza with pineapple. Disgrace. Fined ${coins}`,
			`During the escape, the police catch up with your gang and confiscate ${coins} from you.`,
			`The cops start chasing you, and ${coins} falls out of your pocket!`,
			`You were caught vaping in the bathroom and have been given a ${coins} fine.`,
			`You attempt to steal, but the person stabs you. You pay ${coins} in hospital expenses...`,
			`You have been fined ${coins} because you ate during work hours.`,
			`You were caught in the act, and fined ${coins}`,
			`Stealing candy from a baby didn't turn out to be as easy as you'd think, you've been fined ${coins}`,
			`You try to mug a rich kid, but end up failing and get fined ${coins}.`,
			`You posted in the wrong Discord channel and have been fined ${coins}.`,
			`You tripped on one of Patrick's Pet Rocks, off to the slammer for you, and you have to pay for injuring his rock, Patrick demands a fine of ${coins}!`,
			`Police did a strip search and found stolen toys, they fined you ${coins}`,
			`You attempt to rob a body builder, you get your ass kicked. Pay ${coins}`,
			`You got caught stealing from a donations jar and in return you get fined ${coins}`,
			`You got caught speeding, your ticket comes to ${coins}`,
			`You did a crime and refuse to do the time. You lose ${coins}.`,
			`Your friend bet you that you couldn't beat him in Madden. He won ${coins}.`,
			`You tripped while running from the cops after robbing a bank. Good job! You lost ${coins}.`,
			`You were caught trying to scam people, and have been given a ${coins} fine!`,
			`You were caught trying to smuggle illegal aliens across the border and have been fined ${coins}`,
			`You try to snipe someone, but get your calculations off, hitting a random guy next to your target, losing you ${coins} in payment for a cleaner.`,
			`You attempted to rob the local bank and got caught by the police. You are fined ${coins}`,
			`You are caught jaywalking while stealing a purse and are fined ${coins}`,
			`You tried to trip an old man and he beats you with a stick. The police then arrive on scene and fine you ${coins} for attempted murder.`,
			`You threaten a police officer, wasn't a smart idea. You got arrested and was fined ${coins}`,
			`During an armed assault, you are knocked unconscious by an old geezer. Afterwards, it seems that you are missing ${coins} when you wake up.`,
			`Steal an extra gram of cocaine from your dealer, Sarah, and get caught. Pay her back ${coins} to dodge death.`,
			`You unsuccessfully bribed a cop. See ya in prison, buddy. You lost ${coins}`,
		];

		const crime = crimes[Math.floor(Math.random() * crimes.length)];

		return crime;
	},

	getAchievements: function() {
		return {
			won: [
				{
					text: 'First Won - Win 1 battle',
					check: function(score) {
						return (score > 0 && score < 100);
					}
				},
				{
					text: 'Enemy Crusher - Won 100 battles',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'Superhero - Won 500 battles',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: '👹 A Monster - Won 1000 battles',
					check: function(score) {
						return (score >= 1_000);
					}
				}
			],
			level: [
				{
					text: 'Expert - Level 100 character',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'Master - Level 500 character',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: '👼 God - Level 1000 character',
					check: function(score) {
						return (score >= 1_000);
					}
				}
			],
			battle: [
				{
					text: '1st Battle - battle 1 time',
					check: function(score) {
						return (score > 0 && score < 50);
					}
				},
				{
					text: 'Adapted - battle 50 times',
					check: function(score) {
						return (score >= 50 && score < 100);
					}
				},
				{
					text: 'Experienced - battle 100 times',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'Mastered - battle 500 times',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: 'Goddess - battle 1000 times',
					check: function(score) {
						return (score >= 1_000 && score < 5_000);
					}
				},
				{
					text: '🌏 Immortal - battle 5000 times',
					check: function(score) {
						return (score >= 5_000);
					}
				}
			],
			balance: [
				{
					text: 'Collector - have <a:jasminecoins:868105109748469780> 100,000 in pocket',
					check: function(score) {
						return (score >= 100_000 && score < 500_000);
					}
				},
				{
					text: 'Road To millionaire - have <a:jasminecoins:868105109748469780> 500,000 in pocket',
					check: function(score) {
						return (score >= 500_000 && score < 1_000_000);
					}
				},
				{
					text: '💲 Millionaire - have <a:jasminecoins:868105109748469780> 1,000,000 in pocket',
					check: function(score) {
						return (score >= 1_000_000);
					}
				}
			],
			bank: [
				{
					text: 'The Safer - have <a:jasminecoins:868105109748469780> 100,000 in bank',
					check: function(score) {
						return (score >= 100_000 && score < 500_000);
					}
				},
				{
					text: 'Safe Room - have <a:jasminecoins:868105109748469780> 500,000 in bank',
					check: function(score) {
						return (score >= 500_000 && score < 1_000_000);
					}
				},
				{
					text: '🤑 Looks Poor But Actually Rich - have <a:jasminecoins:868105109748469780> 1,000,000 in bank',
					check: function(score) {
						return (score >= 1_000_000);
					}
				}
			],
			totalBank: [
				{
					text: 'The Path Opened - have 1,000 bank space',
					check: function(score) {
						return (score >= 1_000 && score < 50_000);
					}
				},
				{
					text: 'Bank Conquerer - have 50,000 bank space',
					check: function(score) {
						return (score >= 50_000 && score < 100_000);
					}
				},
				{
					text: 'Own A Bank - have 100,000 bank space',
					check: function(score) {
						return (score >= 100_000 && score < 500_000);
					}
				},
				{
					text: 'Own Every Bank In The Country - have 500,000 bank space',
					check: function(score) {
						return (score >= 500_000 && score < 1_000_000);
					}
				},
				{
					text: '🏦 All Banks Are Mine - have 1,000,000 bank space',
					check: function(score) {
						return (score >= 1_000_000);
					}
				}
			],
			beg: [
				{
					text: 'Be A Begger - beg 1 time',
					check: function(score) {
						return (score > 0 && score < 50);
					}
				},
				{
					text: 'Gimme Money - beg 50 times',
					check: function(score) {
						return (score >= 50 && score < 100);
					}
				},
				{
					text: 'I\'m Poor - beg 100 times',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'Homeless - beg 500 times',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: 'No life - beg 1,000 times',
					check: function(score) {
						return (score >= 1_000 && score < 5_000);
					}
				},
				{
					text: '💀 Feels Like Don\'t Wanna Live Anymore - beg 5,000 times',
					check: function(score) {
						return (score >= 5_000);
					}
				}
			],
			youtube: [
				{
					text: 'Become A Youtuber - do youtube business 1 time',
					check: function(score) {
						return (score > 0 && score < 50);
					}
				},
				{
					text: 'An Expert Youtuber - do youtube business 50 times',
					check: function(score) {
						return (score >= 50 && score < 100);
					}
				},
				{
					text: 'A Pro Youtuber - do youtube business 100 times',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'A Golden Button - do youtube business 500 times',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: 'Youtube Staff - do youtube business 1,000 times',
					check: function(score) {
						return (score >= 1_000 && score < 5_000);
					}
				},
				{
					text: 'CEO of Youtube - do youtube business 5,000 times',
					check: function(score) {
						return (score >= 5_000 && score < 10_000);
					}
				},
				{
					text: '🛠 Just Bought Youtube - do youtube business 10,000 times',
					check: function(score) {
						return (score >= 10_000);
					}
				}
			],
			website: [
				{
					text: 'Become A Website developer - make 1 website',
					check: function(score) {
						return (score > 0 && score < 50);
					}
				},
				{
					text: 'An Expert Website Developer - make 50 websites',
					check: function(score) {
						return (score >= 50 && score < 100);
					}
				},
				{
					text: 'A Pro Website Developer - make 100 websites',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'Build A Website Company - make 500 websites',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: 'Famous Website Developer - make 1,000 websites',
					check: function(score) {
						return (score >= 1_000 && score < 5_000);
					}
				},
				{
					text: 'Almost Own The Internet - make 5,000 websites',
					check: function(score) {
						return (score >= 5_000 && score < 10_000);
					}
				},
				{
					text: '🛠 It\'s All Yours - make 10,000 websites',
					check: function(score) {
						return (score >= 10_000);
					}
				}
			],
			product: [
				{
					text: 'Become A Product Seller - sell 1 product',
					check: function(score) {
						return (score > 0 && score < 50);
					}
				},
				{
					text: 'An Expert Product Seller - sell 50 products',
					check: function(score) {
						return (score >= 50 && score < 100);
					}
				},
				{
					text: 'A Pro Product Seller - sell 100 products',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'Build A Product Company - sell 500 products',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: 'Famous Product Seller - sell 1,000 products',
					check: function(score) {
						return (score >= 1_000 && score < 5_000);
					}
				},
				{
					text: 'Almost Out Of Stock - sell 5,000 products',
					check: function(score) {
						return (score >= 5_000 && score < 10_000);
					}
				},
				{
					text: '📪 Out Of Stock - sell 10,000 products',
					check: function(score) {
						return (score >= 10_000);
					}
				}
			],
			media: [
				{
					text: 'Become A Media Social Influencer - do a media social influencer business 1 time',
					check: function(score) {
						return (score > 0 && score < 50);
					}
				},
				{
					text: 'An Expert Media Social Influencer - do a Media Social Influencer business 50 times',
					check: function(score) {
						return (score >= 50 && score < 100);
					}
				},
				{
					text: 'A Pro Media Social Influencer - do a media social influencer business 100 times',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'Conquer A Media Social Platform - do a media social influencer business 500 times',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: 'Conquer Every Media Social platforms - do a media social influencer business 1,000 times',
					check: function(score) {
						return (score >= 1_000 && score < 5_000);
					}
				},
				{
					text: 'Famous Person - do a media social influencer business 5,000 times',
					check: function(score) {
						return (score >= 5_000 && score < 10_000);
					}
				},
				{
					text: '🤳 Everyone Knows You - do a media social influencer business 10,000 times',
					check: function(score) {
						return (score >= 10_000);
					}
				}
			],
			tools: [
				{
					text: '🛍 In Need - have bought fishing rod, hunting rifle, laptop and pickaxe',
					check: function(rod, rifle, laptop, pickaxe) {
						return (rod && rifle && laptop && pickaxe);
					}
				}
			],
			crime: [
				{
					text: 'First Time Do A Crime - do crime 1 time',
					check: function(score) {
						return (score > 0 && score < 100);
					}
				},
				{
					text: 'A Bad Person - do crime 100 times',
					check: function(score) {
						return (score >= 100 && score < 500);
					}
				},
				{
					text: 'A Criminal - do crime 500 times',
					check: function(score) {
						return (score >= 500 && score < 1_000);
					}
				},
				{
					text: 'Most Wanted - do crime 1000 times',
					check: function(score) {
						return (score >= 1_000 && score < 5_000);
					}
				},
				{
					text: 'Nowhere is safe - do crime 5,000 times',
					check: function(score) {
						return (score >= 5_000 && score < 10_000);
					}
				},
				{
					text: '🦹‍♂️ Should Be in The Prison - do crime 10,000 time',
					check: function(score) {
						return (score >= 10_000);
					}
				}
			],
			daily: [
				{
					text: '1st Daily - claim daily 1 time',
					check: function (score) {
						return (score > 0 && score < 10);
					}
				},
				{
					text: '10th Daily - claim daily 10 times',
					check: function (score) {
						return (score >= 10 && score < 20);
					}
				},
				{
					text: '20th Daily - claim daily 20 times',
					check: function (score) {
						return (score >= 20 && score < 30);
					}
				},
				{
					text: '1 Month Daily - claim daily 30 times',
					check: function (score) {
						return (score >= 30 && score < 60);
					}
				},
				{
					text: '2 Months Daily - claim daily 60 times',
					check: function (score) {
						return (score >= 60 && score < 100);
					}
				},
				{
					text: '🧠 Strong Memories - claim daily 100 times',
					check: function (score) {
						return (score >= 100);
					}
				}
			]
		};
	}
};
