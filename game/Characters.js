module.exports = [
	{
		id: 'mercy',
		name: 'Mercy',
		nickname: 'Henry',
		color: '#F9A604',
		skills: {
			lockpick: 6,
			hack: 4,
			neutralise: 1
		},
		stamina: 5,
		actions: 4,
		description: ['Mercy Haze is a spiritual infiltrator', 'She uses her privileged connections with the spiritual plane to achieve some miraculous <breaking and entering/lockpick>. Though she won’t <fight/neutralise> she can <withstand punches/stamina> or <flee/actions> if she likes.', 'Mercy grew up in the local monastery, learning how to access the astral plane but she earned her money <hacking/hack> stubborn terminals. Spiritual doesn’t mean nice...'],
		dialogues: {
			afterObjective: ['We are as one, together we shall overcome', 'The spirits flow through all of us', 'The spirits will guide us to the next victory'],
			moving: ['This is the way', 'The answer might be over there', 'Stepping through the world'],
			actionCancel: ['That didn’t feel right', 'I sensed some dark designs', 'Too much negative energy for this to work'],
			boostStart: ['I need to strengthen my connection', 'I need help from beyond the veil', 'I need to improve myself'],
			boostCancel: ['I will rely on my inner strength', 'My inner strength will see me through', 'There was nothing I could use'],
			boostSearch: ['Boosts, reveal yourselves to me!', 'My third eye will show me where the boosts are', 'I can sense the boosts within the room'],
			boostSearchCancel: ['I choose not to take anything', 'These boosts had the wrong energy'],
			boostRequestStart: ['I’m calling out for your help!', 'Only the crew can help me now', 'The crew is connected to me'],
			boostRequestCancel: ['I should have known it would not be fruitful', 'Maybe someone can help me next time', 'We help one another, and sometimes we fail'],
			boostRequestAccepted: ['I accept your graceful offer!', 'I am eternally grateful for your help', 'I will not forget this act of kindness'],
			securityScan: ['I can sense the system peering through me', 'The system is messing with my aura', 'I can feel the corruption in the system'],
			securityPass: ['I am invisible to the system', 'I operate on a higher plane', 'The system is no match for my energy'],
			escapeEnemy: ['I can see through the Cogs and they cannot touch me', 'The Cogs cannot hurt me on the spiritual plane', 'The Cogs are only cold metal']
		}
	},
	{
		id: 'tz',
		name: 'TZ-2375',
		nickname: 'Mathieu',
		color: '#7DC556',
		skills: {
			lockpick: 4,
			hack: 4,
			neutralise: 4
		},
		stamina: 5,
		actions: 3,
		description: ['TZ-2375 is a repair android', 'TZ is <not fast/actions> but can sustain <some mistreatment/stamina>, he’s the ideal companion when it comes to getting into a <terminal/hack> or <neutralising/neutralise> a threat. Handy for many things, he won’t be afraid of a rusty mechanism or a <locked door/lockpick>.', ' 2375 is from the TZ series of android, successor to the TK series, notably improving his text to speech system as well as his overall friendliness.'],
		dialogues: {
			afterObjective: ['Now onto the next task.', 'Great teamwork! Let’s see what’s next.'],
			moving: ['I‘m on the move', 'I’ll check what’s over there for you', 'Maybe this way?'],
			actionCancel: ['I will try something else', 'This wasn’t going to work', 'I’m not one to take a risk.'],
			boostStart: ['I must have something I can use', 'My bag is full of tricks', 'A good maintenance robot is never without boosts'],
			boostCancel: ['It seems I don’t have what I require', 'Sorry, I needed to inspect my boosts'],
			boostSearch: ['My chance of finding new boosts is high', 'I hope I can find what I require'],
			boostSearchCancel: ['Well, there was nothing for me there...', 'Unfortunately, I could not locate anything of interest...', 'I was unable to find the required boost...'],
			boostRequestStart: ['I am in need of assistance!', 'I will need to rely on the crew'],
			boostRequestCancel: ['I don’t need assistance anymore', 'It seems the crew cannot help me'],
			boostRequestAccepted: ['Thank you! I am now fully prepared.', 'I knew I could count on you.'],
			securityScan: ['I’m being scanned by the system!', 'I can tell the system is looking at me'],
			securityPass: ['This system doesn’t seem to be very effective...', 'I avoided detection this time', 'I escaped the system!'],
			escapeEnemy: ['The Cogs did not notice me', 'It seems I’ve evaded the Cogs']
		}
	},
	{
		id: 'doc',
		name: 'Dr. McPhearson',
		nickname: 'Andrew',
		color: '#4895DD',
		skills: {
			lockpick: 1,
			hack: 4,
			neutralise: 7
		},
		stamina: 5,
		actions: 3,
		description: ['Dr. McPhearson is a street brawler', 'Despite the honourific title, he is not a medical doctor: he’s the one who sends you to the doctor. He’s <strong/stamina> and learned how to <use his fists/neutralise> on the streets of Glesca. He’s rather good at it and with reason, he’s <hacked/hack> into his own stim tech giving him an advantage over pretty much anyone.', ' McPhearson is not known for his finesse, <moving purposefully/actions>, a closed door will rather be unhinged than <unlocked/lockpick>.'],
		dialogues: {
			afterObjective: ['No time to waste, let’s move.', 'No celebration, we must carry on.'],
			moving: ['Moving on!', 'Watch out!', 'I want to know what’s in there', 'Let us move on'],
			actionCancel: ['No, scratch that!', 'No reason to do this', 'It didn’t feel right', 'That won’t work'],
			boostStart: ['I’m going to need a pick-me-up', 'What have I got in store?', 'Let me check my inventory'],
			boostCancel: ['That was not the moment to use these', 'Maybe I’ll save these boosts for later', 'Nothing I want to use'],
			boostSearch: ['If there is a boost around here, I will find it', 'Scrounging around for my next boost', 'This room must give me something'],
			boostSearchCancel: ['Nothing for me here', 'Just a load of old junk!', 'Can’t believe I even bothered'],
			boostRequestStart: ['Youze better help me!', 'Prepare your boosts, I’m gonna need them'],
			boostRequestCancel: ['Not what I needed', 'Ach! None of you can help!', 'I’m on my own and I’m OK with that'],
			boostRequestAccepted: ['I’m tooled up and ready to go!', 'That’s the stuff! Nothing can stop me now!', 'Just what the Doctor ordered!'],
			securityScan: ['I swear I will rip out that system', 'This system better not get in my way', 'I should be the one in charge of security around here'],
			securityPass: ['That system is just junk', 'Hard to believe they didn’t spot me', 'That system will soon be scrap metal'],
			escapeEnemy: ['These Cogs are just glorified vacuum cleaners!', 'Hurt me? I didn’t think so.', 'These Cogs should just take a seat']
		}
	},
	{
		id: 'kai',
		name: 'Kai',
		nickname: 'Barbara',
		color: '#B86CE5',
		skills: {
			lockpick: 5,
			hack: 6,
			neutralise: 1
		},
		stamina: 3,
		actions: 4,
		description: ['Kai is a hacking expert', '<Quick/actions> but <fragile/stamina>, they’d rather find a <way out/lockpick> than <fight/neutralise> their opponent — unless that opponent is a computer terminal, in which case they’ll have a field day <taking it apart/hack>.', 'Kai was born in New Korea where they learnt to deal with the fiercest of encryptions and the latest tech. They defected to The Government shortly after the riots started, however now they’ve seen the damage done, they’re starting to question their involvement.'],
		dialogues: {
			afterObjective: ['Right, this will be a piece of cake!', 'This should take no time at all', 'Almost too easy...'],
			moving: ['Watch me go!', 'Time for a change of scenery', 'What’s over there?'],
			actionCancel: ['Hmmm... Maybe not?', 'Nah, that’s not gonna work', 'Didn’t like the odds...'],
			boostStart: ['Right, what do I have on me?', 'Let me look through my pockets', 'A boost might help?'],
			boostCancel: ['I was just checking on my gadgets...', 'Nope, nothing I can use...', 'Not gonna use any of these yet...'],
			boostSearch: ['I can find some boosts around here', 'Bet I can find some good boosts', 'Just need to look around for some boosts'],
			boostSearchCancel: ['Dang! Nothing good...', 'Ratbags! Just some junk...', 'Well that was a waste of time...'],
			boostRequestStart: ['Right, I need a favour', 'Can y’all give me a hand with something?', 'Just need a small boost for this next trick'],
			boostRequestCancel: ['I knew I shouldn’t have put my hopes up', 'Guess y’all don’t have what I need', 'So you can’t help? No sweat.'],
			boostRequestAccepted: ['Just what I needed! Watch out!', 'I feel great, watch closely!', 'Sometimes it’s the little things...'],
			securityScan: ['Dang that security system!', 'Ah man, I hate this security system', 'This system is a real pain in the neck'],
			securityPass: ['I’m too good for this crappy system!', 'I’m a sneakmaster, you’ll never catch me!', 'I could code a better system in my sleep!'],
			escapeEnemy: ['See you later, Cogs!', 'Man, even I could take on these stupid tin boxes', 'Better luck next time, Cogs!']
		}
	},
	{
		id: 'ari',
		name: 'Ari',
		nickname: 'Ant',
		color: '#CA2F49',
		skills: {
			lockpick: 6,
			hack: 2,
			neutralise: 5
		},
		stamina: 3,
		actions: 4,
		description: ['Ari is a shock assassin', 'She moves <fast/actions>, allowing her to <bust in/lockpick> and  <neutralise/neutralise> a target with ease. However, she’s more comfortable letting someone else deal with the target’s <computer/hack>.', 'Though she’s strong, she’ll know when to <run from a fight/stamina> when necessary. Ari was born in Greece but has seen the world on assignment. She speaks 6 languages and can order an espresso martini in 12.'],
		dialogues: {
			afterObjective: ['Let’s get on with it!', 'Bring it on!'],
			moving: ['Keep your eyes on me', 'Whatever’s in that room is no match for me', 'I’m not afraid to explore'],
			actionCancel: ['I’ve changed my mind...', 'I don’t need to do this now...', 'I’ll do it when the odds are better...'],
			boostStart: ['Right, what’s in that backpack?', 'I’m always prepared', 'Surely I’ve got the right fix'],
			boostCancel: ['Nope, nothing good enough...', 'I’ll save it for a bigger challenge', 'I don’t need a boost to be up to the task'],
			boostSearch: ['I bet I can find something useful in here', 'Boosts are easy to find if you know where to look', 'Just need to find a quick boost...'],
			boostSearchCancel: ['None of these will do the job...', 'I can find better elsewhere', 'I don’t need any of these now'],
			boostRequestStart: ['I hate to do this, but give me a hand?', 'Alright, someone throw me a boost!', 'My crew always has my back'],
			boostRequestCancel: ['Meh, I can do this on my own...', 'Fine! I’ve got this.', 'Not sure why I asked for help...'],
			boostRequestAccepted: ['Locked and loaded, ready to take this on', 'I’m pumped and ready to go', 'Now success is within my reach'],
			securityScan: ['Who do they think they are, scanning me?!', 'Someone should take this system down...', 'Security scan some other chump!'],
			securityPass: ['Once again, I’ve passed through', 'This system is no match for me', 'I didn’t even try and I passed...'],
			escapeEnemy: ['Some old tins won’t get in my way', 'They know not to mess with me', 'Touch me and I’ll rip your circuits out!']
		}
	},
	{
		id: 'ash',
		name: 'Ash',
		nickname: 'David',
		color: '#07CEAA',
		skills: {
			lockpick: 4,
			hack: 5,
			neutralise: 5
		},
		stamina: 3,
		actions: 3,
		description: ['Ash is a corporate thief', 'Half-cyborg, Ash has a versatile mastery of anything that can get him in a building and out with the payload without a scratch. <Hacking/hack> is probably what he excels at and anyone in the way will get a <knuckle sandwich/neutralise> because the blood runs hot through his artificial veins.', 'The <lockpicking/lockpick> implant he got on the black market was worth it but left Ash somewhat <fragile/stamina> and forces him to <tread carefully/actions>'],
		dialogues: {
			afterObjective: ['One down... how many to go?', 'Well done, what’s next?', 'OK, we got to keep going...'],
			moving: ['I’ll see what’s over here', 'Maybe this way?', 'Another day, another room'],
			actionCancel: ['Let’s try something else...', 'I’m not sure this is gonna work', 'Why did I think this would work?', 'I’m not feeling confident about this...'],
			boostStart: ['Maybe I need a pick-me-up?', 'I swear I have something for this', 'Let’s see what I got on me...'],
			boostCancel: ['I should have know I had nothing useful', 'Nothing quite right there...', 'I just needed a reminder...'],
			boostSearch: ['Let‘s see if I can find a new boost', 'Hopefully I can find something useful in here', 'This room better have something for me...'],
			boostSearchCancel: ['Nothing interesting...', 'Nope, I don’t want any of these boosts', 'None of that will help me...'],
			boostRequestStart: ['I’m gonna need some help!', 'Can anyone help me?!', 'I hope someone can help!'],
			boostRequestCancel: ['Can I do this on my own?', 'I guess it’s up to me then...', 'I feel the pressure is all on me...'],
			boostRequestAccepted: ['Thanks, I hope this will help', 'Let’s see if it helps with my problem', 'I feel little better, I’m going for it'],
			securityScan: ['I’m being scanned by the system!', 'They’re scanning me now!', 'This scanning is making me uncomfortable...'],
			securityPass: ['The system didn’t catch me!', 'I was lucky not to be caught this time...', 'Wow, how did I do that?'],
			escapeEnemy: ['Seems like the Cogs didn’t detect me...', 'I escaped just under the wire', 'Am I invisible to these Cogs?']
		}
	}
]
