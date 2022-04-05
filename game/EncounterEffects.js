import { nanoid } from 'nanoid'

const EncounterEffects = [
	{
		id: 'new-enemy',
		name: 'What can I do for you?',
		effect: 'A new cog appears next to you',
		status: 'What?! A cog just showed up here.',
		pre: (G, ctx) => {
			return G.board.rooms.find(({ players, enemies }) => players.includes(ctx.currentPlayer) && enemies.length < 4)
		},
		apply: (G, ctx, room) => {
			const level = ctx.random.D6() === 6 ? 2 : 1
			const difficulty = level === 2 ? ctx.random.D4() : ctx.random.D6()

			room.enemies.push({ id: nanoid(), level, difficulty, completed: 0 })
		}
	},
	{
		id: 'enemy-move',
		name: 'Over there!',
		effect: 'A cog moves next to you',
		status: 'Arg! A cog has moved next to me!',
		pre: (G, ctx) => {
			const currentRoom = G.board.rooms.find(({ players }) => players.includes(ctx.currentPlayer))

			if (currentRoom.enemies.length < 4) {
				const connectedDoors = ctx.random.Shuffle(G.board.doors).filter(({ rooms }) => rooms.includes(currentRoom.id))
				const connectedRooms = connectedDoors.map(({ rooms }) => rooms.find((rId) => rId !== currentRoom.id))
				const connectedRoomWithEnemies = connectedRooms.find((id) => {
					return G.board.rooms.find((r) => id === r.id && r.visited && r.enemies.some(({ completed, level }) => completed < level))
				})

				if (connectedRoomWithEnemies) {
					return {
						currentRoom,
						roomWithEnemy: G.board.rooms.find((r) => connectedRoomWithEnemies === r.id)
					}
				}
				else {
					return false
				}
			}
			else {
				return false
			}
		},
		apply: (G, ctx, { roomWithEnemy, currentRoom }) => {
			const enemyIndex = roomWithEnemy.enemies.findIndex(({ completed, level }) => completed < level)
			const enemy = roomWithEnemy.enemies.splice(enemyIndex, 1)
			currentRoom.enemies.push(enemy[0])
		}
	},
	{
		id: 'terminal-up',
		name: 'Encrypted?',
		effect: 'The terminal is harder to hack',
		status: 'This terminal has become harder...',
		pre: (G, ctx) => {
			const currentRoom = G.board.rooms.find(({ players, terminal }) => players.includes(ctx.currentPlayer) && terminal && terminal.completed < terminal.level)

			return currentRoom
		},
		apply: (G, ctx, room) => {
			room.terminal.difficulty += 1
		}
	},
	{
		id: 'lock-up',
		name: 'Forced shut?',
		effect: 'The lock is harder to pick',
		status: 'This lock looks more difficult...',
		pre: (G, ctx) => {
			const room = G.board.rooms.find(({ players }) => players.includes(ctx.currentPlayer))
			const lockedDoor = G.board.doors.find(({ rooms, disabled, lock }) => rooms.includes(room.id) && !disabled && lock && lock.completed < lock.level)

			return lockedDoor
		},
		apply: (G, ctx, door) => {
			door.lock.difficulty += 1
		}
	},
	{
		id: 'stamina-loss',
		name: 'Ouch!',
		effect: 'You lose one stamina',
		status: 'I just took a hit!',
		apply: (G, ctx) => {
			G.players[ctx.currentPlayer].modifiers.stamina -= 1
		}
	},
	{
		id: 'action-loss',
		name: 'I’m stuck!',
		effect: 'You have one less action next turn',
		status: 'I’ve been slowed down!',
		apply: (G, ctx) => {
			G.players[ctx.currentPlayer].modifiers.actions = -1
		}
	},
	{
		id: 'hack-loss',
		name: 'RTFM!',
		effect: 'You temporarily lose one Hack',
		status: 'My hack codes have been scrambled!',
		apply: (G, ctx) => {
			G.players[ctx.currentPlayer].modifiers.hack = -1
		}
	},
	{
		id: 'lockpick-loss',
		name: 'Did you see my tools?',
		effect: 'You temporarily lose one Lockpick',
		status: 'My lockpicking kit has been demagnetised!',
		apply: (G, ctx) => {
			G.players[ctx.currentPlayer].modifiers.lockpick = -1
		}
	},
	{
		id: 'neutralise-loss',
		name: 'Can I do this?',
		effect: 'You temporarily lose one Neutralise',
		status: 'I’m feeling weak...',
		apply: (G, ctx) => {
			G.players[ctx.currentPlayer].modifiers.neutralise = -1
		}
	},
	{
		id: 'upgrade-loss',
		name: 'I swear I had it just there!',
		effect: 'You lose one of your boosts',
		status: 'One of my boosts has just disappeared!',
		pre: (G, ctx) => {
			return ctx.random.Shuffle(G.players[ctx.currentPlayer].upgrades)[0]
		},
		apply: (G, ctx, card) => {
			G.players[ctx.currentPlayer].upgrades = G.players[ctx.currentPlayer].upgrades.filter(({ id }) => id !== card.id)
		}
	}
]

export default EncounterEffects
