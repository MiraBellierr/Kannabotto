// This is just for me, so I can use it later

let part1 = `__${message.author.username}'s Achievement Book__
4
${player.get('won') > 0 && player.get('won') < 100 ? '\n**•** First Won - Win 1 battle' : ''}
${player.get('won') > 99 && player.get('won') < 500 ? '\n**•** Enemy Crusher - Won 100 battles' : ''}
${player.get('won') > 499 && player.get('won') < 1000 ? '\n**•** Superhero - Won 500 battles' : ''}
${player.get('won') > 999 ? '\n**•** 👹 A Monster - Won 1000 battles' : ''}
3
${player.get('level') > 99 && player.get('level') < 500 ? '\n**•** Expert - Level 100 character' : ''}
${player.get('level') > 499 && player.get('level') < 1000 ? '\n**•** Master - Level 500 character' : ''}
${player.get('level') > 999 ? '\n**•** 👼 God - Level 1000 character' : ''}
6
${player.get('battle') > 0 && player.get('battle') < 50 ? '\n**•** 1st Battle - battle 1 time' : ''}
${player.get('battle') > 49 && player.get('battle') < 100 ? '\n**•** Adapted - battle 50 times' : ''}
${player.get('battle') > 99 && player.get('battle') < 500 ? '\n**•** Experienced - battle 100 times' : ''}
${player.get('battle') > 499 && player.get('battle') < 1000 ? '\n**•** Mastered - battle 500 times' : ''}
${player.get('battle') > 999 && player.get('battle') < 5000 ? '\n**•** Goddess - battle 1000 times' : ''}
${player.get('battle') > 4999 ? '\n**•** 🌏 Immortal - battle 5000 times' : ''}
3
${economy.get('balance') >= 100000 && economy.get('balance') < 500000 ? '\n**•** Collector - have <a:jasminecoins:868105109748469780> 100,000 in pocket' : ''}
${economy.get('balance') >= 500000 && economy.get('balance') < 1000000 ? '\n**•** Road to millionaire - have <a:jasminecoins:868105109748469780> 500,000 in pocket' : ''}
${economy.get('balance') >= 1000000 ? '\n**•** 💲 Millionaire - have <a:jasminecoins:868105109748469780> 1,000,000 in pocket' : ''}
3
${economy.get('bank') >= 100000 && economy.get('bank') < 500000 ? '\n**•** The Safer - have <a:jasminecoins:868105109748469780> 100,000 in bank' : ''}
${economy.get('bank') >= 500000 && economy.get('bank') < 1000000 ? '\n**•** Safe Room - have <a:jasminecoins:868105109748469780> 500,000 in bank' : ''}
${economy.get('bank') >= 1000000 ? '\n**•** 🤑 Looks Poor But Actually Rich - have <a:jasminecoins:868105109748469780> 1,000,000 in bank' : ''}
5
${economy.get('totalBank') > 999 && economy.get('totalBank') < 50000 ? '\n**•** The Path Opened - have 1,000 bank space' : ''}
${economy.get('totalBank') >= 50000 && economy.get('totalBank') < 100000 ? '\n**•** Bank Conquerer - have 50,000 bank space' : ''}
${economy.get('totalBank') >= 100000 && economy.get('totalBank') < 500000 ? '\n**•** Own A Bank - have 100,000 bank space' : ''}
${economy.get('totalBank') >= 500000 && economy.get('totalBank') < 1000000 ? '\n**•** Own Every banks in the country - have 500,000 bank space' : ''}
${economy.get('totalBank') >= 1000000 ? '\n**•** 🏦 All Banks are mine - have 1,000,000 bank space' : ''}
6
${achievement.get('beg') > 0 && achievement.get('beg') < 50 ? '\n**•** Be A Begger - beg 1 time' : ''}
${achievement.get('beg') > 49 && achievement.get('beg') < 100 ? '\n**•** Gimme Money - beg 50 times' : ''}
${achievement.get('beg') > 99 && achievement.get('beg') < 500 ? '\n**•** I\'m Poor - beg 100 times' : ''}
${achievement.get('beg') > 499 && achievement.get('beg') < 1000 ? '\n**•** Homeless - beg 500 times' : ''}
${achievement.get('beg') > 999 && achievement.get('beg') < 5000 ? '\n**•** No life - beg 1,000 times' : ''}
${achievement.get('beg') > 4999 ? '\n**•** 💀 Feels Like Don\'t Wanna Live Anymore - beg 5,000 times' : ''}
7
${achievement.get('youtube') > 0 && achievement.get('youtube') < 50 ? '\n**•** Become A Youtuber - Do a youtube business 1 time' : ''}
${achievement.get('youtube') > 49 && achievement.get('youtube') < 100 ? '\n**•** An expert Youtuber - Do a youtube business 50 times' : ''}
${achievement.get('youtube') > 99 && achievement.get('youtube') < 500 ? '\n**•** A Pro Youtuber - Do a youtube business 100 times' : ''}
${achievement.get('youtube') > 499 && achievement.get('youtube') < 1000 ? '\n**•** A Golden Button - Do a youtube business 500 times' : ''}
${achievement.get('youtube') > 999 && achievement.get('youtube') < 5000 ? '\n**•** Youtube staff - Do a youtube business 1,000 times' : ''}
${achievement.get('youtube') > 4999 && achievement.get('youtube') < 10000 ? '\n**•** CEO of youtube Company - Do a youtube business 5,000 times' : ''}
${achievement.get('youtube') > 9999 ? '\n**•** 🛠 Just Bought Youtube - Do a youtube business 10,000 times' : ''}
7
${achievement.get('website') > 0 && achievement.get('website') < 50 ? '\n**•** Become A Website developer - Do a website business 1 time' : ''}
${achievement.get('website') > 49 && achievement.get('website') < 100 ? '\n**•** An expert Website Developer - Do a website business 50 times' : ''}
${achievement.get('website') > 99 && achievement.get('website') < 500 ? '\n**•** A Pro Website Developer - Do a website business 100 times' : ''}
${achievement.get('website') > 499 && achievement.get('website') < 1000 ? '\n**•** Build A Website Company - Do a website business 500 times' : ''}
${achievement.get('website') > 999 && achievement.get('website') < 5000 ? '\n**•** Famous Website Developer - Do a website business 1,000 times' : ''}
${achievement.get('website') > 4999 && achievement.get('website') < 10000 ? '\n**•** Almost Own The Internet - Do a website business 5,000 times' : ''}
${achievement.get('website') > 9999 ? '\n**•** 🛠 It\'s All Yours - Do a website business 10,000 times' : ''}
7
${achievement.get('product') > 0 && achievement.get('product') < 50 ? '\n**•** Become A product Seller - Do a product business 1 time' : ''}
${achievement.get('product') > 49 && achievement.get('product') < 100 ? '\n**•** An expert Product Seller - Do a product business 50 times' : ''}
${achievement.get('product') > 99 && achievement.get('product') < 500 ? '\n**•** A Pro Product Seller - Do a product business 100 times' : ''}
${achievement.get('product') > 499 && achievement.get('product') < 1000 ? '\n**•** Build A Product Company - Do a product business 500 times' : ''}
${achievement.get('product') > 999 && achievement.get('product') < 5000 ? '\n**•** Famous Product Seller - Do a product business 1,000 times' : ''}
${achievement.get('product') > 4999 && achievement.get('product') < 10000 ? '\n**•** Almost Out Of Stock - Do a product business 5,000 times' : ''}
${achievement.get('product') > 9999 ? '\n**•** 📪 Out Of Stock - Do a product business 10,000 times' : ''}
7
${achievement.get('media') > 0 && achievement.get('media') < 50 ? '\n**•** Become A Media Social Influencer - Do a media social influencer business 1 time' : ''}
${achievement.get('media') > 49 && achievement.get('media') < 100 ? '\n**•** An expert Media Social Influencer - Do a Media Social Influencer business 50 times' : ''}
${achievement.get('media') > 99 && achievement.get('media') < 500 ? '\n**•** A Pro Media Social Influencer - Do a media social influencer business 100 times' : ''}
${achievement.get('media') > 499 && achievement.get('media') < 1000 ? '\n**•** Conquer A Media Social Platform - Do a media social influencer business 500 times' : ''}
${achievement.get('media') > 999 && achievement.get('media') < 5000 ? '\n**•** Conquer Every Media Social platforms - Do a media social influencer business 1,000 times' : ''}
${achievement.get('media') > 4999 && achievement.get('media') < 10000 ? '\n**•** Famous Person - Do a media social influencer business 5,000 times' : ''}
${achievement.get('media') > 9999 ? '\n**•** 🤳 Everyone Knows You - Do a media social influencer business 10,000 times' : ''}
1
${inventory.get('fishingRod') === 1 && inventory.get('huntingRifle') === 1 && inventory.get('laptop') == 1 && inventory.get('pickaxe') ? '\n**•** 🛍 In Need - Have bought fishing rod, hunting rifle, laptop and pickaxe' : ''}
6
${achievement.get('crime') > 0 && achievement.get('crime') < 100 ? '\n**•** First time do a crime - Do crime 1 time' : ''}
${achievement.get('crime') > 99 && achievement.get('crime') < 500 ? '\n**•** A bad person - Do crime 100 times' : ''}
${achievement.get('crime') > 499 && achievement.get('crime') < 1000 ? '\n**•** A Criminal - Do crime 500 times' : ''}
${achievement.get('crime') > 999 && achievement.get('crime') < 5000 ? '\n**•** Most Wanted - Do crime 1000 times' : ''}
${achievement.get('crime') > 4999 && achievement.get('crime') < 10000 ? '\n**•** Nowhere is safe - Do crime 5,000 times' : ''}
${achievement.get('crime') > 9999 ? '\n**•** 🦹‍♂️ Should Be in The Prison - Do crime 10,000 time' : ''}
6
${achievement.get('daily') > 0 && achievement.get('daily') < 10 ? '\n**•** 1st Daily - Claim daily 1 time' : ''}
${achievement.get('daily') > 9 && achievement.get('daily') < 20 ? '\n**•** 10th Daily - Claim daily 10 times' : ''}
${achievement.get('daily') > 19 && achievement.get('daily') < 30 ? '\n**•** 20th Daily - Claim daily 20 times' : ''}
${achievement.get('daily') > 29 && achievement.get('daily') < 60 ? '\n**•** 1 Month Daily - Claim daily 30 times' : ''}
${achievement.get('daily') > 59 && achievement.get('daily') < 100 ? '\n**•** 2 Months Daily - Claim daily 60 times' : ''}
${achievement.get('daily') > 99 ? '\n**•**🧠 Strong Memories - Claim daily 100 times' : ''}
7
${achievement.get('fish') > 0 && achievement.get('fish') < 50 ? '\n**•** Fisherman - Fish 1 time' : ''}
${achievement.get('fish') > 49 && achievement.get('fish') < 100 ? '\n**•** An Expert Fisherman - Fish 50 times' : ''}
${achievement.get('fish') > 99 && achievement.get('fish') < 500 ? '\n**•** A Pro Fisherman - Fish 100 times' : ''}
${achievement.get('fish') > 499 && achievement.get('fish') < 1000 ? '\n**•** A Sea Fisherman - Fish 500 times' : ''}
${achievement.get('fish') > 999 && achievement.get('fish') < 5000 ? '\n**•** A Ship Sailer - Fish 1,000 times' : ''}
${achievement.get('fish') > 4999 && achievement.get('fish') < 10000 ? '\n**•** A Pirate - Fish 5000 times' : ''}
${achievement.get('fish') > 9999 ? '\n**•** 🏴‍🦜 A King Pirate - Fish 10,000 times' : ''}
7
${achievement.get('junk') > 0 && achievement.get('junk') < 50 ? '\n**•** Hey I Got A Junk - Fish a junk 1 time' : ''}
${achievement.get('junk') > 49 && achievement.get('junk') < 100 ? '\n**•** OMG Even More Junks - Fish a junk 50 times' : ''}
${achievement.get('junk') > 99 && achievement.get('junk') < 500 ? '\n**•** Basket Filled With Junks - Fish a junk 100 times' : ''}
${achievement.get('junk') > 499 && achievement.get('junk') < 1000 ? '\n**•** Full House Junks - Fish a junk 500 times' : ''}
${achievement.get('junk') > 999 && achievement.get('junk') < 5000 ? '\n**•** 2 Houses of Junks - Fish a junk 1,000 times' : ''}
${achievement.get('junk') > 4999 && achievement.get('junk') < 10000 ? '\n**•** Big City of Junks - Fish a junk 5,000 times' : ''}
${achievement.get('junk') > 9999 ? '\n**•**🦴 Own A Junk Company - Fish a junk 10,000 times' : ''}
7
${achievement.get('commonFish') > 0 && achievement.get('commonFish') < 50 ? '\n**•** Hey I Got A Small fish - Fish a common fish 1 time' : ''}
${achievement.get('commonFish') > 49 && achievement.get('commonFish') < 100 ? '\n**•** Even More Small Fishes - Fish a common fish 50 times' : ''}
${achievement.get('commonFish') > 99 && achievement.get('commonFish') < 500 ? '\n**•** A Big Basket of Small Fishes - Fish a common fish 100 times' : ''}
${achievement.get('commonFish') > 499 && achievement.get('commonFish') < 1000 ? '\n**•** A Lorry of Small Fishes - Fish a common fish 500 times' : ''}
${achievement.get('commonFish') > 999 && achievement.get('commonFish') < 5000 ? '\n**•** A Mountain of Small Fishes - Fish a common fish 1,000 times' : ''}
${achievement.get('commonFish') > 4999 && achievement.get('commonFish') < 10000 ? '\n**•** A Big City of Small Fishes - Fish a common fish 5,000 times' : ''}
${achievement.get('commonFish') > 9999 ? '\n**•** <:fish:868105109631025163> The Extinction of Small Fishes - Fish a common fish 10,000 times' : ''}
7
${achievement.get('uncommonFish') > 0 && achievement.get('uncommonFish') < 50 ? '\n**•** Hey I Got An Uncommon fish - Fish an uncommon fish 1 time' : ''}
${achievement.get('uncommonFish') > 49 && achievement.get('uncommonFish') < 100 ? '\n**•** Even More Uncommon Fishes - Fish an uncommon fish 50 times' : ''}
${achievement.get('uncommonFish') > 99 && achievement.get('uncommonFish') < 500 ? '\n**•** A Big Basket of Uncommon Fishes - Fish an uncommon fish 100 times' : ''}
${achievement.get('uncommonFish') > 499 && achievement.get('uncommonFish') < 1000 ? '\n**•** A Lorry of Uncommon Fishes - Fish an uncommon fish 500 times' : ''}
${achievement.get('uncommonFish') > 999 && achievement.get('uncommonFish') < 5000 ? '\n**•** A Mountain of Uncommon Fishes - Fish an uncommon fish 1,000 times' : ''}
${achievement.get('uncommonFish') > 4999 && achievement.get('uncommonFish') < 10000 ? '\n**•** A Big City of Uncommon Fishes - Fish an uncommon fish 5,000 times' : ''}
${achievement.get('uncommonFish') > 9999 ? '**•** <:goldfish:868115088165462076> The Extinction of Uncommon Fishes - Fish an uncommon fish 10,000 times' : ''}
7
${achievement.get('rareFish') > 0 && achievement.get('rareFish') < 50 ? '\n**•** Hey I Got A Rare fish - Fish a rare fish 1 time' : ''}
${achievement.get('rareFish') > 49 && achievement.get('rareFish') < 100 ? '\n**•** Even More Rare Fishes - Fish a rare fish 50 times' : ''}
${achievement.get('rareFish') > 99 && achievement.get('rareFish') < 500 ? '\n**•** A Big Basket of Rare Fishes - Fish a rare fish 100 times' : ''}
${achievement.get('rareFish') > 499 && achievement.get('rareFish') < 1000 ? '\n**•** A Lorry of Rare Fishes - Fish a rare fish 500 times' : ''}
${achievement.get('rareFish') > 999 && achievement.get('rareFish') < 5000 ? '\n**•** A Mountain of Rare Fishes - Fish a rare fish 1,000 times' : ''}
${achievement.get('rareFish') > 4999 && achievement.get('rareFish') < 10000 ? '\n**•** A Big City of Rare Fishes - Fish a rare fish 5,000 times' : ''}
${achievement.get('rareFish') > 9999 ? '\n**•** 🦑 The Extinction of Rare Fishes - Fish a rare fish 10,000 times' : ''}
7
${achievement.get('legendaryFish') > 0 && achievement.get('legendaryFish') < 50 ? '\n**•** Hey I Got A Whale - Fish a legendary 1 time' : ''}
${achievement.get('legendaryFish') > 49 && achievement.get('legendaryFish') < 100 ? '\n**•** Even More Whales - Fish a legendary fish 50 times' : ''}
${achievement.get('legendaryFish') > 99 && achievement.get('legendaryFish') < 500 ? '\n**•** A ~~Big Basket~~ of Whales - Fish a legendary fish 100 times' : ''}
${achievement.get('legendaryFish') > 499 && achievement.get('legendaryFish') < 1000 ? '\n**•** 100 Lorries of Whales - Fish a legendary fish 500 times' : ''}
${achievement.get('legendaryFish') > 999 && achievement.get('legendaryFish') < 5000 ? '\n**•** A Mountain of whales - Fish a legendary fish 1,000 times' : ''}
${achievement.get('legendaryFish') > 4999 && achievement.get('legendaryFish') < 10000 ? '\n**•** A Big City of Whales - Fish a legendary fish 5,000 times' : ''}
${achievement.get('legendaryFish') > 9999 ? '\n**•** 🐳 The Extinction of Whales - Fish a legendary fish 10,000 times' : ''}
7
${achievement.get('hunt') > 0 && achievement.get('hunt') < 50 ? '\n**•** A Hunter - Hunt 1 time' : ''}
${achievement.get('hunt') > 49 && achievement.get('hunt') < 100 ? '\n**•** An Expert Hunter - Hunt 50 times' : ''}
${achievement.get('hunt') > 99 && achievement.get('hunt') < 500 ? '\n**•** A Pro Hunter - Hunt 100 times' : ''}
${achievement.get('hunt') > 499 && achievement.get('hunt') < 1000 ? '\n**•** An Assassin - Hunt 500 times' : ''}
${achievement.get('hunt') > 999 && achievement.get('hunt') < 5000 ? '\n**•** A Splinter Cell - Hunt 1,000 times' : ''}
${achievement.get('hunt') > 4999 && achievement.get('hunt') < 10000 ? '\n**•** Hunt Human? - Hunt 5,000 times' : ''}
${achievement.get('hunt') > 10000 ? '\n**•** 📛 A Big Bounty - Hunt 10,000 times' : ''}`

let part2 = `__${message.author.username}'s Achievement Book__\n
7
${achievement.get('commonHunt') > 0 && achievement.get('commonHunt') < 50 ? '\n**•** Hey I got a rabbit - hunt common animal 1 time' : ''}
${achievement.get('commonHunt') > 49 && achievement.get('commonHunt') < 100 ? '\n**•** I got more rabbits! - hunt common animal 50 times' : ''}
${achievement.get('commonHunt') > 99 && achievement.get('commonHunt') < 500 ? '\n**•** Plenty-Plunty Rabbits - hunt common animal 100 times' : ''}
${achievement.get('commonHunt') > 499 && achievement.get('commonHunt') < 1000 ? '\n**•** Rabbit Monster - hunt common animal 500 times' : ''}
${achievement.get('commonHunt') > 999 && achievement.get('commonHunt') < 5000 ? '\n**•** Damn, A Giant Rabbit! - hunt common animal 1,000 times' : ''}
${achievement.get('commonHunt') > 4999 && achievement.get('commonHunt') < 10000 ? '\n**•** All Rabbits are mine - hunt common animal 5,000 times' : ''}
${achievement.get('commonHunt') > 9999 ? '\n**•** 🐇 The Extinction of Rabbits - hunt common animal 10,000 times' : ''}
7
${achievement.get('uncommonHunt') > 0 && achievement.get('uncommonHunt') < 50 ? '\n**•** Hey I got a turkey - hunt uncommon animal 1 time' : ''}
${achievement.get('uncommonHunt') > 49 && achievement.get('uncommonHunt') < 100 ? '\n**•** Even More Turkeys - hunt uncommon animal 50 times' : ''}
${achievement.get('uncommonHunt') > 99 && achievement.get('uncommonHunt') < 500 ? '\n**•** Turkey Killer - hunt uncommon animal 100 times' : ''}
${achievement.get('uncommonHunt') > 499 && achievement.get('uncommonHunt') < 1000 ? '\n**•** Turkey is A Country - hunt uncommon animal 500 times' : ''}
${achievement.get('uncommonHunt') > 999 && achievement.get('uncommonHunt') < 5000 ? '\n**•** A Giant Turkey - hunt uncommon animal 1,000 times' : ''}
${achievement.get('uncommonHunt') > 4999 && achievement.get('uncommonHunt') < 10000 ? '\n**•** M-Monster Turkey?!! - hunt uncommon animal 5,000 times' : ''}
${achievement.get('uncommonHunt') > 10000 ? '\n**•** The Extinction of Turkeys - hunt uncommon animal 10,000 times' : ''}
7
${achievement.get('rareHunt') > 0 && achievement.get('rareHunt') < 50 ? '\n**•** Hey I shot a pig - hunt a rare animal 1 time' : ''}
${achievement.get('rareHunt') > 49 && achievement.get('rareHunt') < 100 ? '\n**•** Even more pigs - hunt a rare animal 50 times' : ''}
${achievement.get('rareHunt') > 99 && achievement.get('rareHunt') < 500 ? '\n**•** How many pigs?? - hunt a rare animal 100 times' : ''}
${achievement.get('rareHunt') > 499 && achievement.get('rareHunt') < 1000 ? '\n**•** Pig Assault - hunt a rare animal 500 times' : ''}
${achievement.get('rareHunt') > 999 && achievement.get('rareHunt') < 5000 ? '\n**•** Pigman?? - hunt a rare animal 1,000 times' : ''}
${achievement.get('rareHunt') > 4999 && achievement.get('rareHunt') < 10000 ? '\n**•** No More Pigs In The Forest - hunt a rare animal 5,000 times' : ''}
${achievement.get('rareHunt') > 10000 ? '\n**•** 🐖 The Extinction of Pigs - hunt a rare animal 10,000 times' : ''}
7
${achievement.get('mythicalHunt') > 0 && achievement.get('mythicalHunt') < 50 ? '\n**•** Hey I caught a deer - hunt a mythical animal 1 time' : ''}
${achievement.get('mythicalHunt') > 49 && achievement.get('mythicalHunt') < 100 ? '\n**•** Even More Deer - hunt a mythical animal 50 times' : ''}
${achievement.get('mythicalHunt') > 99 && achievement.get('mythicalHunt') < 500 ? '\n**•** Oh deer! - hunt a mythical animal 100 times' : ''}
${achievement.get('mythicalHunt') > 499 && achievement.get('mythicalHunt') < 1000 ? '\n**•** Own A Deer Farm - hunt a mythical animal 500 times' : ''}
${achievement.get('mythicalHunt') > 999 && achievement.get('mythicalHunt') < 5000 ? '\n**•** Can\'t Fits In - hunt a mythical animal 1,000 times' : ''}
${achievement.get('mythicalHunt') > 4999 && achievement.get('mythicalHunt') < 10000 ? '\n**•** Do Not Hunting! - hunt a mythical animal 5,000 times' : ''}
${achievement.get('mythicalHunt') > 10000 ? '\n**•** 🦌 The Extinction of Deers - hunt a mythical animal 10,000 times' : ''}
7
${achievement.get('legendaryHunt') > 0 && achievement.get('legendaryHunt') < 50 ? '\n**•** OMG a Dragon - hunt a legendary animal 1 time' : ''}
${achievement.get('legendaryHunt') > 49 && achievement.get('legendaryHunt') < 100 ? '\n**•** Fantasy Story - hunt a legendary animal 50 times' : ''}
${achievement.get('legendaryHunt') > 99 && achievement.get('legendaryHunt') < 500 ? '\n**•** Winter Is Coming - hunt a legendary animal 100 times' : ''}
${achievement.get('legendaryHunt') > 499 && achievement.get('legendaryHunt') < 1000 ? '\n**•** Game Of Throne - hunt a legendary animal 500 times' : ''}
${achievement.get('legendaryHunt') > 999 && achievement.get('legendaryHunt') < 5000 ? '\n**•** Time to Conquer The World? - hunt a legendary animal 1,000 times' : ''}
${achievement.get('legendaryHunt') > 4999 && achievement.get('legendaryHunt') < 10000 ? '\n**•** Becomes The King - hunt a legendary animal 5,000 times' : ''}
${achievement.get('legendaryHunt') > 10000 ? '\n**•** 🐉 The Era Of The Dragons - hunt a legendary animal 10,000 times' : ''}
4
${achievement.get('rob') > 0 && achievement.get('rob') < 50000 ? '\n**•** Stealer - rob more than <a:jasminecoins:868105109748469780> 1' : ''}
${achievement.get('rob') > 49999 && achievement.get('rob') < 500000 ? '\n**•** Robber - rob more than <a:jasminecoins:868105109748469780> 50,000' : ''}
${achievement.get('rob') > 499999 && achievement.get('rob') < 1000000 ? '\n**•** Pro Robber - rob more than <a:jasminecoins:868105109748469780> 500,000' : ''}
${achievement.get('rob') > 999999 ? '\n**•** 🎭 Can\'t Catch Me - rob more than <a:jasminecoins:868105109748469780> 1,000,000' : ''}
4
${achievement.get('transfer') > 0 && achievement.get('transfer') < 50000 ? '\n**•** Sharer - Share more than <a:jasminecoins:868105109748469780> 1' : ''}
${achievement.get('transfer') > 49999 && achievement.get('transfer') < 500000 ? '\n**•** Big Sharer - Share more than <a:jasminecoins:868105109748469780> 50,000' : ''}
${achievement.get('transfer') > 499999 && achievement.get('transfer') < 1000000 ? '\n**•** Mega Sharer - Share more than <a:jasminecoins:868105109748469780> 500,000' : ''}
${achievement.get('transfer') > 999999 ? '\n**•** 💸 Monster Sharer - Share more than <a:jasminecoins:868105109748469780> 1,000,000' : ''}
4
${achievement.get('gifted') > 0 && achievement.get('gifted') < 50000 ? '\n**•** Gifted - receive more than <a:jasminecoins:868105109748469780> 1' : ''}
${achievement.get('gifted') > 49999 && achievement.get('gifted') < 500000 ? '\n**•** Big Gifted - receive more than <a:jasminecoins:868105109748469780> 50,000' : ''}
${achievement.get('gifted') > 499999 && achievement.get('gifted') < 1000000 ? '\n**•** Mega Gifted - receive more than <a:jasminecoins:868105109748469780> 500,000' : ''}
${achievement.get('gifted') > 1000000 ? '\n**•** 🏮 Monster Gifted - receive more than <a:jasminecoins:868105109748469780> 1,000,000' : ''}
3
${achievement.get('weekly') > 0 && achievement.get('weekly') < 4 ? '\n**•** A week - claim 1 weekly' : ''}
${achievement.get('weekly') > 3 && achievement.get('weekly') < 8 ? '\n**•** A Month - claim 4 weekly' : ''}
${achievement.get('weekly') > 7 ? '\n**•** 💲 2 Months - claim 8 weekly' : ''}
7
${achievement.get('work') > 0 && achievement.get('work') < 50 ? '\n**•** First Job - work 1 time' : ''}
${achievement.get('work') > 49 && achievement.get('work') < 100 ? '\n**•** I like this job! - work 50 times' : ''}
${achievement.get('work') > 99 && achievement.get('work') < 500 ? '\n**•** I\'m expert on this job! - work 100 times' : ''}
${achievement.get('work') > 499 && achievement.get('work') < 1000 ? '\n**•** Aim for the CEO - work 500 times' : ''}
${achievement.get('work') > 999 && achievement.get('work') < 5000 ? '\n**•** Becoming the CEO - work 1,000 times' : ''}
${achievement.get('work') > 4999 && achievement.get('work') < 10000 ? '\n**•** I took over the Company - work 5,000 times' : ''}
${achievement.get('work') > 10000 ? '\n**•** 😎 I\'m The Boss - work 10,000 times' : ''}
7
${achievement.get('coinflip') > 0 && achievement.get('coinflip') < 50 ? '\n**•** Coinflip Noob - won coinflip 1 time' : ''}
${achievement.get('coinflip') > 49 && achievement.get('coinflip') < 100 ? '\n**•** Coinflip Expert - won coinflip 50 times' : ''}
${achievement.get('coinflip') > 99 && achievement.get('coinflip') < 500 ? '\n**•** Magician - won coinflip 100 times' : ''}
${achievement.get('coinflip') > 499 && achievement.get('coinflip') < 1000 ? '\n**•** Feels so lucky - won coinflip 500 time' : ''}
${achievement.get('coinflip') > 999 && achievement.get('coinflip') < 5000 ? '\n**•** Coinflip Man - won coinflip 1,000 times' : ''}
${achievement.get('coinflip') > 4999 && achievement.get('coinflip') < 10000 ? '\n**•** I can predict your move! - won coinflip 5,000 times' : ''}
${achievement.get('coinflip') > 10000 ? '\n**•** 👑 A King Coinflip! - won coinflip 10,000 times' : ''}
7
${achievement.get('hangman') > 0 && achievement.get('hangman') < 50 ? '\n**•** Hangman Noob - won hangman 1 time' : ''}
${achievement.get('hangman') > 49 && achievement.get('hangman') < 100 ? '\n**•** Hangman Expert - won hangman 50 times' : ''}
${achievement.get('hangman') > 99 && achievement.get('hangman') < 500 ? '\n**•** I save the guy! - won hangman 100 times' : ''}
${achievement.get('hangman') > 499 && achievement.get('hangman') < 1000 ? '\n**•** Superhero - won hangman 500 times' : ''}
${achievement.get('hangman') > 999 && achievement.get('hangman') < 5000 ? '\n**•** Pro Superhero - won hangman 1,000 times' : ''}
${achievement.get('hangman') > 4999 && achievement.get('hangman') < 10000 ? '\n**•** All Might - won hangman 5,000 times' : ''}
${achievement.get('hangman') > 10000 ? '\n**•** 🦸‍♂️ A Hang Man - won hangman 10,000 times' : ''}
5
${achievement.get('green') > 0 && achievement.get('green') < 50 ? '\n**•** Lucky - won with green color in roulette 1 time' : ''}
${achievement.get('green') > 49 && achievement.get('green') < 100 ? '\n**•** Poggers - won with green color in roulette 50 times' : ''}
${achievement.get('green') > 99 && achievement.get('green') < 500 ? '\n**•** Howw?? - won with green color in roulette 100 times' : ''}
${achievement.get('green') > 499 && achievement.get('green') < 1000 ? '\n**•** Dang! - won with green color in roulette 500 times' : ''}
${achievement.get('green') > 1000 ? '\n**•** 💚 Pro Roulette - won with green color in roulette 1,000 times' : ''}
5
${achievement.get('black') > 0 && achievement.get('black') < 50 ? '\n**•** Lucky In Black - won with black color in roulette 1 time' : ''}
${achievement.get('black') > 49 && achievement.get('black') < 100 ? '\n**•** Poggers In Black - won with black color in roulette 50 times' : ''}
${achievement.get('black') > 99 && achievement.get('black') < 500 ? '\n**•** Black is my color charm - won with black color in roulette 100 times' : ''}
${achievement.get('black') > 499 && achievement.get('black') < 1000 ? '\n**•** Hah, Black is the easiest way - won with black color in roulette 500 times' : ''}
${achievement.get('black') > 1000 ? '\n**•** ⚫ Black Expert - won with black color in roulette 1,000 times' : ''}
5
${achievement.get('red') > 0 && achievement.get('red') < 50 ? '\n**•** Lucky In Red - won with red color in roulette 1 time' : ''}
${achievement.get('red') > 49 && achievement.get('red') < 100 ? '\n**•** Poggers In Red - won with red color in roulette 50 times' : ''}
${achievement.get('red') > 99 && achievement.get('red') < 500 ? '\n**•** Red is my color charm - won with red color in roulette 100 times' : ''}
${achievement.get('red') > 499 && achievement.get('red') < 1000 ? '\n**•** Hah, Red is the easiest way - won with red color in roulette 500 times' : ''}
${achievement.get('red') > 1000 ? '\n**•** 🔴 Red Expert - won with red color in roulette 1,000 times' : ''}
7
${achievement.get('rps') > 0 && achievement.get('rps') < 50 ? '\n**•** Rps player - won rps 1 time' : ''}
${achievement.get('rps') > 49 && achievement.get('rps') < 100 ? '\n**•** Casual RPS - won rps 50 times' : ''}
${achievement.get('rps') > 99 && achievement.get('rps') < 500 ? '\n**•** Amateur RPS - won rps 100 times' : ''}
${achievement.get('rps') > 499 && achievement.get('rps') < 1000 ? '\n**•** Expert RPS - won rps 500 times' : ''}
${achievement.get('rps') > 999 && achievement.get('rps') < 5000 ? '\n**•** try-hard RPS - won rps 1,000 times' : ''}
${achievement.get('rps') > 4999 && achievement.get('rps') < 10000 ? '\n**•** This is my game - won rps 5,000 times' : ''}
${achievement.get('rps') > 9999 ? '\n**•** ✂ I only know 3 words - won rps 10,000 times' : ''}
7
${achievement.get('scramble') > 0 && achievement.get('scramble') < 50 ? '\n**•** I\'m a beginner - won scramble 1 time' : ''}
${achievement.get('scramble') > 49 && achievement.get('scramble') < 100 ? '\n**•** I\'m getting good at this - won scramble 50 times' : ''}
${achievement.get('scramble') > 99 && achievement.get('scramble') < 500 ? '\n**•** Now I know - won scramble 100 times' : ''}
${achievement.get('scramble') > 499 && achievement.get('scramble') < 1000 ? '\n**•** I memorize every words - won scramble 500 times' : ''}
${achievement.get('scramble') > 999 && achievement.get('scramble') < 5000 ? '\n**•** This is easy - won scramble 1,000 times' : ''}
${achievement.get('scramble') > 4999 && achievement.get('scramble') < 10000 ? '\n**•** Word Expert - won scramble 5,000 times' : ''}
${achievement.get('scramble') > 10000 ? '\n**•** 🤓 I\'m a scrambler - won scramble 10,000 time' : ''}
7
${achievement.get('slots') > 0 && achievement.get('slots') < 50 ? '\n**•** I love animals - Won slots 1 time' : ''}
${achievement.get('slots') > 49 && achievement.get('slots') < 100 ? '\n**•** match 3 game - Won slots 50 times' : ''}
${achievement.get('slots') > 99 && achievement.get('slots') < 500 ? '\n**•** Slots Gambler - Won slots 100 times' : ''}
${achievement.get('slots') > 499 && achievement.get('slots') < 1000 ? '\n**•** Slots Expert - Won slots 500 times' : ''}
${achievement.get('slots') > 999 && achievement.get('slots') < 5000 ? '\n**•** I can even bet my life - Won slots 1,000 times' : ''}
${achievement.get('slots') > 4999 && achievement.get('slots') < 10000 ? '\n**•** Slots is my thing - Won slots 5,000 times' : ''}
${achievement.get('slots') > 10000 ? '\n**•** 🐰 I spend my entire life - Won slots 10,000 times' : ''}
7
${achievement.get('dig') > 0 && achievement.get('dig') < 50 ? '\n**•** A Digger - Dig 1 time' : ''}
${achievement.get('dig') > 49 && achievement.get('dig') < 100 ? '\n**•** An Expert Digger - Dig 50 times' : ''}
${achievement.get('dig') > 99 && achievement.get('dig') < 500 ? '\n**•** A Pro Digger - Dig 100 times' : ''}
${achievement.get('dig') > 499 && achievement.get('dig') < 1000 ? '\n**•** A Cave Expender - Dig 500 times' : ''}
${achievement.get('dig') > 999 && achievement.get('dig') < 5000 ? '\n**•** A Big Driller - Dig 1,000 times' : ''}
${achievement.get('dig') > 4999 && achievement.get('dig') < 10000 ? '\n**•** To the Earth Core - Dig 5,000 times' : ''}
${achievement.get('dig') > 10000 ? '\n**•** ⛏️ Digger God - Dig 10,000 times' : ''}`