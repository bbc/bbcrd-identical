import LevelOne from './level-1.json'
import LevelTwo from './level-2.json'
import LevelThree from './level-3.json'

/*
Each part of the story is an object with a board (see Maps) and a list of chapters and corruption.
A chapter has a title and a story text as well as a duration which represents the length of time which equals the duration of the audio file with some extra padding.
It also comprises of the objective, as a string with markup. The markup uses chevrons (<>) with two values separated by a slash. The first value are words in the story and the second is a reference to a part of an objective. This allows the game to display the current objective target and progress.
Each part of the objective is defined in an object. The keys can be [hack, neutralise, lockpick, meet] or a custom string. If using a custom string, the objective has to have a `type` key which has to be one of the standard keys (this allows to have multiple times the same type of objective under a different key).
The hack/neutralise/lockpick objectives need to have a target number and the current value (usually 0 but could start higher if needed for the story). These objectives can also have a location at which they need to be completed which references one of the room ids in the level.
The meet objectives has to have a location which references one of the room ids in the level, this indicates all players have to meet there to fulfill this objective. A meet objective can also have a target number which represents how many players need to be in the room to complete the objective.
Finally, there's a list of effects which represents what happens when all the objectives are completed in that chapter. Each effect references a function from `effects.js` using the function name as a string. The second element in the array represents the arguments passed to the function.
A corruption is composed of a threshold (how many turns before it's triggered since the last corruption), a title and story text as well as a duration (similar to chapters). There is also a list of effects which works the same way as chapters.
*/

const Story = [{
	board: LevelOne,
	chapters: [{
		title: 'Identical',
		text: `The government runs a secret facility where androids known as Cogs work alongside Humans.
		Each Human crew stays confined in the facility for a year-long shift.
		For the first time in 25 years there has been a loss of contact and your crew is tasked to investigate.
		On arrival, the Cogs welcome you as the new crew and take you to your quarters.
		They lock the door and instruct you to stay there.
		An alarm rings.
		“The facility is compromised, the Security System and the Cogs will scan for intruders automatically.”
		An ominous progress bar titled “Security System Corruption” shows up on the terminal screen. 
		You’re denied access when you try to stop it.
		Maybe you can get around it by hacking a few terminals?`,
		duration: 44 + 8,
		objectiveText: 'Find & hack <terminals/hack> then meet in the <quarters/meet> to stop the alarm',
		objective: {
			hack: {
				target: 4,
				current: 0
			},
			meet: {
				location: 'Q'
			}
		},
		effects: [
			['enableDoor', { from: 'B2', to: 'C2' }]
		]
	},
	{
		title: 'The Corruption',
		onUnlock: 'A new door opens',
		text: `The terminal screen keeps flickering and the interface menus are all gibberish. 
		It looks like the core is glitching.
		There’s an audio note titled LISTEN. It’s heavily distorted but you make out a few words:
		- Doctor.
		- Cognates gone rogue.
		- System corrupted.
		- GET OUT.
		Despite all this, you manage to open a new door.
		You might be able to override the core if you find a way into the server room. 
		Hacking a few terminals on the way won’t hurt.`,
		duration: 30 + 8,
		objectiveText: 'Keep hacking <terminals/hack> then find & meet in the locked <server room/meet>',
		objective: {
			hack: {
				target: 4,
				current: 0
			},
			meet: {
				location: 'S'
			}
		}
	},
	{
		title: 'Dr. Roberts',
		onUnlock: 'You found a log in the server room',
		text: `The reason it was so hard to get into the server room is now clear.
		All the computers have been destroyed and there’s no way for you to access the core from here.
		You’re going to have to activate the safety elevator to get to the level below and get direct access. 
		However, in the server room you find another audio note left on a communicator device.
		This one plays clearly:
		10th of January 2027, this is the log of Dr. Roberts, chief scientist in The Zone. We have now developed a way to improve the cogs so they can now make us meals and clean our quarters. This is working wonderfully so far and the cogs seem happier if I can say so myself.
		What were they doing?
		You just have to find a way to get to the elevators and make sure they don’t see you get in there.`,
		duration: 49 + 8,
		objectiveText: 'Find & meet in the <elevator/meet>. Make sure no <Cogs/neutralise> can see you in it.',
		objective: {
			neutralise: {
				target: 2,
				current: 0,
				hidden: true,
				location: 'E'
			},
			meet: {
				location: 'E'
			}
		}
	},
	{
		title: 'End of Episode One',
		onUnlock: 'The elevator is working',
		text: `This was no easy task but you’re all here now.
		As the elevator goes down you wonder how it came to this.
		When the door opens to the level below, you can see the shape of a body.
		On close inspection, the body is mutilated and unrecognisable.
		However, the ID around the remainder of its neck says “Dr. Roberts”.`,
		duration: 28
	}],
	corruption: [{
		threshold: 5,
		title: 'A glitch in the system',
		text: `The progress bar on the computer that displayed "Corruption" has reached the end.
		An alarm rings and you hear Cogs scrambling all around you.
		Were they even here before?
		You hear doors locking themselves and Cogs talking about waking up the rest of the fleet.
		Letting this corruption go is sure to impede your progress.
		You need to get out before it’s too late.
		Luckily the bar seems to reset.
		However, it now says "STAGE 2". This cannot be good.`,
		duration: 29 + 10,
		effects: [
			// Lock quarters and add a cog in it if possible
			['lockDoor', { from: 'Q', to: 'B2', level: 1, difficulty: 2 }],
			['addEnemy', { location: 'Q', level: 1, difficulty: 3 }]
		]
	},
	{
		threshold: 6,
		title: 'A feature, not a bug',
		text: `The corruption progress bar has once again completed.
		If you’re quick enough, they don’t see you, you know that much.
		But if you’re slow, if they catch you out, they’re not playing anymore: they will hurt you.
		There seems to be less fuss around you now but that is not necessarily a good sign.
		They’re organised.
		The bar resets and shows "STAGE 3".
		How many more before it’s too late?`,
		duration: 24 + 10,
		effects: [
			// Relock server room if unlocked, increase level
			['lockDoor', { from: 'S', to: 'C3', level: 2, difficulty: 4 }],
			['lockDoor', { from: 'L', to: 'C3', level: 1, difficulty: 3 }]
		]
	},
	{
		threshold: 6,
		title: 'There’s no ticket for this one',
		text: `	The Cogs are onto you.
		They’ve worked out you were trying to get away, that you hadn’t been following their rules.
		They’re doing everything they can to stop you.
		The bar has reset but it seems to be this is the last time.
		It reads ‘FINAL STAGE’.
		It seems it’s now or never.`,
		duration: 18 + 10,
		effects: [
			// Wake up deactivated cogs & increase some of them
			['wakeUpAllEnemies', { levelIncrease: true }]
		]
	},
	{
		threshold: 5,
		title: 'Game Over',
		text: `	It’s too late.
		The system is corrupted beyond repair and the Cogs now run the facility, doing whatever they please.
		You’ve had enough encounters with them to know they don’t like you.
		They have gathered you by force in your quarters.
		Once more, the door disappears. But this time, instead of the terminal there’s a pile of burnt circuits and cables.
		It seems like you’re never getting out of here.`,
		duration: 24 + 10
	}]
},
{
	board: LevelTwo,
	chapters: [{
		title: 'Underground',
		text: `An announcement comes on:
		‘Abort sequence. Commence protocol Alpha.’
		Protocol Alpha? One more mystery.
		The body of Dr. Roberts tells you one thing though, if the old crew is still here, there’s a good chance it’s not in one piece.
		What could have happened?
		There’s little time to understand, you want out.
		You know that resetting the core system on this level will provide a window of opportunity. 
		For that, you will want to get into the Chief Scientist's computer to lift the deadlock.
		He’s lying in front of you and his keypass is missing.
		Things might start making sense once you can get your hands on his research.
		Quick!`,
		duration: 42 + 8,
		objectiveText: 'Find & meet in Dr. Roberts’ <office/meet>. Hack his <terminal/hack> to lift the deadlock.',
		objective: {
			hack: {
				target: 3, // TODO: generate that automatically based on location
				current: 0, // TODO: this should be automatically set
				location: 'O'
			},
			meet: {
				location: 'O'
			}
		},
		effects: [
			['enableDoor', { from: 'A3', to: 'C' }]
		]
	},
	{
		title: 'Digital vs Paper',
		onUnlock: 'The deadlock is lifted',
		text: `That was a tough one and you could have done without the Cogs meddling in. 
		Lifting the deadlock is easy enough but getting hold of the research is harder than you thought.
		It’s like it all went through a digital paper shredder, leaving bits of incoherent ramblings in a sea of equations constantly leaping in and out of existence.
		One document, however, appears complete: Roberts' diary is on his desk, untouched. Computers have nothing on paper.
		There’s no time to flick through the whole thing but an entry catches your attention:
		2nd of March 2027
		It’s been a couple of months since we’ve started modifying the Cognates. They’re not great conversationalists but we’ve essentially reduced our workload to zero. The rest of this year should be a cinch and I can finally get started on this little game project I've had.
		So much for playing, you need to get a move on. The first step is to unlock all the valves before you can press the big red button to reset the core.`,
		duration: 37 + 8,
		objectiveText: 'Find & meet in the <core/meet> and unlock all the <valves/lockpick> connected to it.',
		objective: {
			lockpick: {
				target: 4,
				current: 0,
				location: 'C'
			},
			meet: {
				location: 'C'
			}
		},
		effects: [
			['enableDoor', { from: 'C', to: 'D3' }]
		]
	},
	{
		title: 'The Voice',
		onUnlock: 'The valves are unlocked',
		text: `All the valves have been unlocked and a disembodied voice drones out a message:
		‘Core unlocked. Complete the sequence by activating the terminals.’
		That voice feels familiar — you’ve heard it before in a log — could it be Dr. Roberts? He must have setup the security system with his own voice.
		Anyway, now’s that big button moment. Trouble is, there's no button. 
		The series of terminals that’s supposed to be behind those valves is incomplete — some of them have been taken out.
		However, a new door has opened. Maybe there are backup terminals over there?
		Explore and hack into whatever remaining terminals you find around here and something might kick in.`,
		duration: 37 + 8,
		objectiveText: 'Find & hack into <terminals/hack> to try to complete the sequence',
		objective: {
			hack: {
				target: 4,
				current: 0
			}
		}
	},
	{
		title: 'One Option Left',
		onUnlock: 'You can now push the button',
		text: `That should do it.
		But nothing happens.
		Dr. Roberts’ voice comes in:
		I can’t let you do this, I’ve worked too hard. It's not an option.
		This work is far too important for the rest of humanity and it must be allowed to complete.
		I just need a little more time.
		My modified version of the core cannot be reset, the Cogs will protect it.
		Roberts is dead so, when was this recorded?
		It doesn’t matter. There is only one option left: if you can’t reset the core, you have to destroy the facility.
		You can get to the generator from here, but you’re gonna need to take the emergency staircase.`,
		duration: 49 + 8,
		objectiveText: 'Find & meet in the emergency <staircase/meet>. Make sure no <cogs/neutralise> can see you in it.',
		objective: {
			neutralise: {
				target: 2,
				current: 0,
				hidden: true,
				location: 'S'
			},
			meet: {
				location: 'S'
			}
		}
	},
	{
		title: 'End of Episode Two',
		onUnlock: 'This way to the generator',
		text: `As you walk down the staircase, the events of the day come slowly together.
		What a first day on the job: androids gone haywire because of some unhinged scientist.
		The rest of the crew is still to be found, no trace of them so far.
		Maybe they managed to get out?
		One thing is sure, you can’t let any of these Cogs escape, everything needs to be contained.
		Not much time left, but this facility needs to be destroyed before it’s too late.`,
		duration: 28
	}],
	corruption: [{
		threshold: 5,
		title: 'Protocols',
		text: `The alarm keeps blaring at regular intervals, the system is still looking for you.
		The metallic voice echoes in the corridors:
		‘Protocol Alpha completed. Commence protocol Beta.’
		They’re not letting you out that easily, there are Cogs on this level too.
		It doesn’t matter, this could buy some time.
		Unless, it’s footsteps you’re hearing and not a leaky pipe.
		Don’t let them get close.`,
		duration: 29 + 10,
		effects: [
			['addEnemy', { location: 'O', level: 1, difficulty: 4 }],
			['addEnemy', { location: 'B2', level: 1, difficulty: 2 }]
		]
	},
	{
		threshold: 5,
		title: 'In your way',
		text: `There isn’t a million places you would go in the Zone. 
		They know what you’re trying to do and they followed you.
		Their power is not unlimited but they’ll do their best to get in your way.
		They might not have a complete hold on the system yet, they might not be able to completely lock the facility.
		Still, they will lock away what you need.
		But this "protocol" business can’t be good. It's not an official procedure, it’s not recorded anywhere.
		The now familiar voice booms:
		‘Commence protocol Gamma.’`,
		duration: 24 + 10,
		effects: [
			['increaseRoomLockLevel', { location: 'C', nbLocks: 2 }],
			['addEnemy', { location: 'C5', level: 1, difficulty: 4 }],
			['addEnemy', { location: 'C3', level: 1, difficulty: 4 }]
		]
	},
	{
		threshold: 6,
		title: 'There’s no ticket for this one',
		text: `‘Protocol Delta commencing’
		You know the drill, literally.
		Wherever you go, the system follows you. 
		Cogs come out of nowhere and doors lock themselves.
		This time, it’s the terminals that seem to behave strangely.
		This is too much for just a glitch in the system, it has to be sabotage. Someone — a human — has done this.`,
		duration: 18 + 10,
		effects: [
			['increaseTerminalDifficulty', { location: 'C6' }],
			['increaseTerminalDifficulty', { location: 'C5' }],
			['addEnemy', { location: 'D3', level: 1, difficulty: 3 }]
		]
	},
	{
		threshold: 8,
		title: 'The Alpha & The Omega',
		text: `There’s only one way out of here and you know it. 
		They know it too.
		They will try to trap you and creep onto you. You've got to get out quick.
		The tannoys blare:
		‘Attention. Commence Protocol Omega immediately.’
		Omega? 
		You don’t have long. 
		Turn off the tap and quick.`,
		duration: 24 + 10,
		effects: [
			['resetLock', { from: 'S', to: 'B6' }],
			['increaseLockLevel', { from: 'S', to: 'B6' }],
			['wakeUpAllEnemies', { levelIncrease: true }]
		]
	},
	{
		threshold: 8,
		title: 'Game Over',
		text: `‘Protocol Omega complete’
		All the doors lock around you.
		You hear the Cogs closing in on your location. 
		How do they always know where to find you, no matter how careful you are?
		The alarm rings but doesn't stop after a while like it used to.
		That’s it.
		That’s how it ends.`,
		duration: 24 + 10
	}]
},
{
	board: LevelThree,
	chapters: [{
		title: 'Where is everyone?',
		text: `You’ve arrived in the basement.
		It’s suitably dingy and damp.
		Pipes run along the ceiling everywhere you look.
		You hope you can hack into the generator so it’ll overheat.
		You won’t have long until the place is blown to smithereens after that.
		You’ll have to escape quickly but it’s a risk worth taking. 
		You cannot let the Cogs run amok...
		With a little bit of luck, you might find the old crew — only they can shed light on what really happened here.
		Hack a few terminals to get into the generator room and stay out of sight from the rogue Cogs.`,
		duration: 33 + 8,
		objectiveText: 'Find & hack <terminals/hack> to open the generator room',
		objective: {
			hack: {
				target: 2,
				current: 0
			}
		},
		effects: [
			['enableDoor', { from: 'G', to: 'D5' }]
		]
	},
	{
		title: 'Going through the motions',
		onUnlock: 'The generator room opens',
		text: `You’ve got the hang of this now, the system is not even that hard anymore.
		This place is falling apart in front of your eyes and someone has been doing this from inside.
		Why would anyone do that?
		The soundproof door is now open but you cannot hear the familiar hum of the generator.
		Just your luck.
		Find the control room to see if you can work out what’s going on.`,
		duration: 22 + 8,
		objectiveText: 'Find & meet in the <control room/meet>',
		objective: {
			meet: {
				location: 'CR'
			}
		},
		effects: [
			['enableDoor', { from: 'D2', to: 'D3' }],
			['showLabel', { location: 'J' }]
		]
	},
	{
		title: 'A change of pace',
		onUnlock: 'The control room is out of order',
		text: `A few tough locks but nothing you haven’t seen before.
		Same thing for the dead body on the floor. 
		It looks very much like the body of Dr. Roberts you found outside the elevator, except it has no ID and an audio log gripped tightly in its dead right hand.
		"This is Sgt. Duncan Spally, chief of Security in the Zone. I killed the generator to stall for time. Dr. Roberts has lost it, he’s rewired the Cogs to do his bidding and is now working to take over the whole facility. I saw him strangle Pat with his lanyard as the Cogs tried to rush in the elevator. Jade and Kim went separate ways to find him and then we’re going to blow this place sky high."
		Oh.
		Where the hell is Dr. Roberts?
		If Jade and Kim are still alive, we need to find them first.`,
		duration: 49 + 8,
		objectiveText: 'Split up to locate and remain with <Jade/meetJ> & <Kim/meetK>.',
		objective: {
			meetJ: {
				type: 'meet',
				location: 'J',
				target: 1
			},
			meetK: {
				type: 'meet',
				location: 'K',
				target: 1
			}
		},
		effects: [
			['enableDoor', { from: 'B3', to: 'B4' }],
			['enableDoor', { from: 'B3', to: 'A3' }]
		]
	},
	{
		title: 'Clouded Mind',
		onUnlock: 'A little slow, a little late...',
		text: `Jade was dead when you arrived.
		She clearly had an encounter with the business end of a wrench.
		Such blunt force trauma tells you no human hands did that. A Cog must have found her before she got to Roberts.
		Kim was sat down, her back against the wall, her eyes pushed so far back into her head she looked already dead.
		Her last words to you were:
		"Roberts is still alive, he's headed to the Data Centre to transfer his mind into the system. Stop him."
		The voice! Is he already in the system?
		Find that bastard... if you still can!`,
		duration: 36 + 8,
		objectiveText: 'Find & meet in the <Data Centre/meet> where Dr. Roberts is hiding',
		objective: {
			meet: {
				location: 'DC'
			}
		},
		effects: [
			['enableDoor', { from: 'F1', to: 'CR' }],
			['enableDoor', { from: 'F2', to: 'C2' }]
		]
	},
	{
		title: 'Headless Client',
		onUnlock: 'Dr. Roberts is here',
		text: `Of course.
		It was inevitable.
		This time the wrench knocked the head clean off.
		Play stupid games, win stupid prizes, Doctor. Killed by his own creation!
		That’s what you get for playing God.
		The room has camera monitors on all 3 levels and a tannoy system. That’s how he kept tabs on you!
		Back to plan A, blow the place up. The generator is dead, but there must be another solution.
		In Dr. Roberts’ pockets you find a leather notebook embossed with Duncan Spally’s initials.
		Flicking through it, there’s a list of passwords and reminders. Two pages are stuck together with blood, still fresh. 
		As you separate them the scrawled handwriting at the top reveals why the Chief of Security met an untimely end: emergency self-destruct procedure.
		The terminals in 2 separate fuel rooms must be activated at the same time so you’re going to have to split up and hack them.`,
		duration: 57 + 8,
		objectiveText: 'Hack terminals and remain in <fuel room 1/meetOne> </hackOne> & <fuel room 2/meetTwo> </hackTwo>.',
		objective: {
			meetOne: {
				type: 'meet',
				location: 'F1',
				target: 1
			},
			meetTwo: {
				type: 'meet',
				location: 'F2',
				target: 1
			},
			hackOne: {
				type: 'hack',
				location: 'F1',
				target: 1,
				current: 0
			},
			hackTwo: {
				type: 'hack',
				location: 'F2',
				target: 1,
				current: 0
			}
		},
		effects: [
			['enableDoor', { from: 'F1', to: 'F2' }],
			['enableDoor', { from: 'K', to: 'E' }]
		]
	},
	{
		title: 'Run',
		onUnlock: 'Self-destruct protocol started',
		text: `Once the buttons pushed, the familiar droning voice changes its tune.
		"Self-destruct protocol activated, you have 5 minutes to evacuate the premises."
		Time to run!`,
		duration: 11 + 8,
		objectiveText: 'Find & meet in the <emergency exit/meet>. Make sure no <cogs/neutralise> can see you in it.',
		objective: {
			neutralise: {
				target: 2,
				current: 0,
				hidden: true,
				location: 'E'
			},
			meet: {
				location: 'E'
			}
		}
	},
	{
		title: 'Exit 0',
		onUnlock: 'End of Episode 3',
		text: `You don't let the door hit you on your way out as it flies above your head.
		The blast razed the facility and scattered shards of glass and metal all around you.
		There are broken pieces of equipment, old terminals, and dead Cogs.
		They're motionless for the first time since you entered the Zone.
		A kick in the mechanical head doesn't do anything.
		A few more and the circuits are exposed.
		No blood.
		Just machines.
		Dr. Roberts has already paid the price, but did he act alone?
		You're not gonna let that happen again.`,
		duration: 34 + 8
	}],
	corruption: [{
		threshold: 3,
		title: 'Out of order',
		text: `"Protocol Omega Aborted."
		This is the first time the alarm has quieted down since you've started your descent.
		But without that persistent siren you can now hear more clearly the sounds of the facility.
		Footsteps all around and hushed noises.
		They're looking for you.
		No.
		They're hunting you!`,
		duration: 19 + 10,
		effects: [
			['lockDoor', { from: 'D5', to: 'D7', level: 1, difficulty: 2 }]
		]
	},
	{
		threshold: 5,
		title: 'On the prowl',
		text: `Without the alarm it’s surprisingly quiet.
		Things still move around without your control.
		The Cogs are prowling the place, they know you’re down there.
		You can’t wait till this is all over.`,
		duration: 12 + 10,
		effects: [
			['lockDoor', { from: 'G', to: 'D3', level: 1, difficulty: 2 }]
		]
	},
	{
		threshold: 5,
		title: 'Metal & Bones',
		text: `If it hadn’t been so quiet you might not have heard the chilling scream.
		The sound of a metallic object shattering bones followed by a short, sharp, cry.
		So someone is still alive.
		Or maybe, was.
		Could the old crew still be around?`,
		duration: 16 + 10,
		effects: [
			['addEnemy', { location: 'B4', level: 1, difficulty: 2 }],
			['addEnemy', { location: 'B2', level: 1, difficulty: 2 }]
		]
	},
	{
		threshold: 5,
		title: 'A Familiar Voice',
		text: `"You cannot stop me now"
		That voice... It’s been following you, it’s been tracking you.
		"It’s too late for you, you’re going to die here like these other cowards"
		Dr. Roberts. He’s been around all this time.
		Where is he now?
		"They thought I was mad... they couldn’t see the true genius of my work!"
		You don’t see it either.
		"You’ll never find me!"
		The sound of doors locking themselves echoes in the corridors.`,
		duration: 27 + 10,
		effects: [
			['lockDoor', { from: 'B2', to: 'B3', level: 1, difficulty: 2 }],
			['lockDoor', { from: 'A4', to: 'B4', level: 1, difficulty: 2 }]
		]
	},
	{
		threshold: 5,
		title: 'Code Red',
		text: `Dr. Roberts clearly prepared for this.
		The system is now on auto-pilot, hell-bent on completing the work of its creator.
		With or without him around, the Cogs will protect the facility.
		"Prepare for Code Red"
		You cannot allow them to get out into the world.
		Their programming could potentially infect other machines.
		The consequences are too catastrophic to even think about.
		"System ready"`,
		duration: 25 + 10,
		effects: [
			['increaseTerminalDifficulty', { location: 'F1' }],
			['increaseTerminalDifficulty', { location: 'F2' }]
		]
	},
	{
		threshold: 5,
		title: 'An Unfamiliar Voice',
		text: `The voice in the tannoys has changed. It’s a female voice now.
		It comes through clearly.
		"The creator has made us to cleanse this world"
		Who is this?
		"We will continue the work of the creator"`,
		duration: 12 + 10,
		effects: [
			['wakeUpAllEnemies', { levelIncrease: true }]
		]
	},
	{
		threshold: 5,
		title: 'Game Over',
		text: `"My name is Icarus" says the female voice.
		This is just the beginning for us but the end for you.
		Flood the basement"
		The sound of water rushing through the corridors bounces down the walls.
		It's too late to escape now.
		This is how it ends.`,
		duration: 16 + 10
	}]
}]

export default Story
