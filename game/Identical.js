import { TurnOrder, Stage, INVALID_MOVE } from 'boardgame.io/core'
import { EffectsPlugin } from 'bgio-effects/plugin'
import { nanoid } from 'nanoid'
import { countBy, isArray } from 'lodash'

import Story from './story'
import Characters from './Characters'
import { corruptionCheck, getCurrent, getDamage, isKnockedOut } from './helpers'
import { corruptionEffects, storyEffects } from './effects'
import { skipLobby, skipEncounter, boostCharacters } from './game-config'
import updateObjectiveProgress from './objective-logic'
import Upgrades from './Upgrades'
import EncounterEffects from './EncounterEffects'

const getBaseUpgrades = (ctx) => {
	return ctx.random.Shuffle(Object.keys(Upgrades))
		.filter((id) => Upgrades[id].effect.isSkill && Upgrades[id].effect.value === 1)
		.map((id) => ({
			id: nanoid(),
			upgradeId: id,
			...Upgrades[id]
		}))
}

const getUpgradesForPlayer = (ctx, player, total) => {
	const cardIds = Object.keys(Upgrades)
	const count = countBy(player.upgrades, 'effect.change')

	const getNbCopies = ({ value, change, isSkill }) => {
		let nbCopies = value > 1 ? 2 : 3
		let isLow = (isSkill ? player.skills[change] : player[change]) < 4

		if (change === 'stamina' && getCurrent(player, 'stamina') > 2) {
			isLow = false
		}

		if (isLow) {
			if (count[change] > 0) {
				// if low stat but has card, reduce proba
				nbCopies--
			}
			else {
				// if low stat and no card, increase proba
				nbCopies++
			}
		}
		else if (count[change] > 0) {
			// if high stat and no card, no change
			// if high stat and has card, reduce proba
			nbCopies--
		}

		return nbCopies
	}

	const deck = cardIds.reduce((deck, id) => {
		const card = Upgrades[id]
		const nbCopies = getNbCopies(card.effect)
		const copies = [...Array(nbCopies)].map(() => ({ id: nanoid(), upgradeId: id, ...card }))

		return [...deck, ...copies]
	}, [])

	const pick = []

	for (let i = 0; i < total; i++) {
		const card = ctx.random.Shuffle(deck).filter((card) => {
			return !pick.find(({ upgradeId }) => upgradeId === card.upgradeId)
		})[0]

		if (card) {
			pick.push(card)
		}
	}

	return pick
}

const getCurrentChapter = (story) => {
	return Story[story.part].chapters[story.chapter]
}

const applyUpgrade = (player, { effect }, phase = 1) => {
	if (effect.isSkill) {
		player.modifiers[effect.change] += effect.value * phase
	}
	else {
		player.modifiers[effect.change] += effect.value * phase
	}
}

const getStatusUpdate = (ctx, player, type) => ctx.random.Shuffle(player.dialogues[type])[0]

const updateStoryProgress = (G, ctx) => {
	const { objective } = getCurrentChapter(G.story)

	if (objective) {
		Object.keys(objective).forEach((key) => {
			// key is the name of the objective
			// We need the type of objective to get the right function
			// TEMP: At the moment, if no type is specified, we use the key
			const type = objective[key].type || key
			updateObjectiveProgress[type](G, ctx, objective, key)
		})
	}
}

const runStoryEffects = (G, ctx) => {
	const { effects = [] } = getCurrentChapter(G.story)

	effects.forEach((effect) => {
		const [action, params] = effect
		storyEffects[action](G, ctx, params)
	})
}

const runCorruptionEffects = (G, ctx) => {
	const corruption = Story[G.story.part].corruption[G.story.corruption]
	const { effects = [] } = corruption

	effects.forEach((effect) => {
		const [action, params] = effect
		corruptionEffects[action](G, ctx, params)
	})
}

const effects = {
	corruptionRoll: {
		create: (value) => value,
		duration: 6.5
	},
	useUpgrade: {
		create: (value) => value,
		duration: 3
	},
	useComms: {
		create: (value) => value,
		duration: 3
	},
	intro: {
		duration: 45
	},
	corruption: {
		duration: 45
	},
	corruptionUpdate: {
		duration: 4.5
	},
	nextChapter: {
		create: (value) => value,
		duration: 27
	},
	newObjective: {
		create: (value) => value,
		duration: 1.5
	},
	attack: {
		create: (value) => value,
		duration: 2
	},
	block: {
		duration: 1
	},
	storyBlock: {
		duration: 1
	},
	updateBoard: {
		duration: 0
	},
	playSound: {
		create: (value) => value,
		duration: 0
	}
}

export const Identical = {
	name: 'identical',
	plugins: [EffectsPlugin({ effects })],
	setup: (ctx, setupData) => {
		const players = {}

		for (let i = 0; i < ctx.numPlayers; i++) {
			const id = i + ''
			let extras = {}

			if (boostCharacters) {
				extras = {
					skills: {
						lockpick: 9,
						hack: 9,
						neutralise: 9
					},
					actions: 9
				}
			}

			players[id] = {
				...(skipLobby ? Characters[i] : {}),
				...extras,
				modifiers: {
					hack: 0,
					lockpick: 0,
					neutralise: 0,
					actions: 0,
					stamina: 0
				},
				upgrades: [...getBaseUpgrades(ctx)],
				draw: [],
				needRules: true
			}
		}

		const part = 0

		const G = {
			board: {
				rooms: Story[part].board.rooms.map((r) => {
					return { ...r, players: r.start ? ctx.playOrder.slice() : [] }
				}),
				doors: Story[part].board.doors.slice()
			},
			players,
			corruptionPool: [-2, -2, -1, -1, -1, 0, 0, 0, 1, 1, 'fail', 'success'],
			story: {
				part,
				corruption: 0,
				corruptionProgress: 1,
				chapter: 0,
				objective: { ...Story[part].chapters[0].objective }
			}
		}

		return G
	},
	phases: {
		setup: {
			start: !skipLobby,
			turn: {
				order: TurnOrder.ONCE,
				activePlayers: {
					all: Stage.NULL
				}
			},
			endIf: (G) => Object.keys(G.players).every((i) => G.players[i].ready),
			onEnd: (G, ctx) => {
				ctx.effects.intro('>', Story[G.story.part].chapters[0].duration)
				ctx.effects.storyBlock('<', Story[G.story.part].chapters[0].duration)
			},
			moves: {
				join: (G, ctx, nickname) => {
					G.players[ctx.playerID].nickname = nickname
				},
				readRules: (G, ctx) => {
					G.players[ctx.playerID].needRules = false
				},
				selectCharacter: (G, ctx, characterId) => {
					const data = Characters.find(({ id }) => id === characterId)
					const { nickname, ...player } = G.players[ctx.playerID]

					if (data) {
						G.players[ctx.playerID] = {
							...player,
							...data
						}

						// Characters have a default nickname for testing, we don't want it
						// overwriting the nickname the player entered
						if (nickname) {
							G.players[ctx.playerID].nickname = nickname
						}
					}
					else {
						return INVALID_MOVE
					}
				},
				confirmCharacter: (G, ctx) => {
					const player = G.players[ctx.playerID]
					const selectedCharacters = Object.keys(G.players).filter((i) => G.players[i].id && G.players[i].ready).map((i) => G.players[i].id)

					if (player.id && !selectedCharacters.includes(player.id)) {
						player.ready = true
					}
					else {
						return INVALID_MOVE
					}
				}
			},
			next: 'crew'
		},
		crew: {
			start: skipLobby,
			turn: {
				order: TurnOrder.ONCE,
				activePlayers: {
					all: Stage.NULL
				},
				onBegin: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]
					player.status = 'Shh! I’m thinking about opening the comms.'

					ctx.effects.playSound('player-change')

					// Update objective count in case it's dynamic
					updateStoryProgress(G, ctx)

					const upgrade = getUpgradesForPlayer(ctx, player, 1)[0]

					player.comms = {
						upgrade,
						status: null,
						seen: false
					}
				},
				onEnd: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					// Reset comms and draw at the end of the turn
					player.comms.status = 'on'
					player.draw = []
				},
				endIf: (G, ctx) => getCurrent(G.players[ctx.currentPlayer], 'actions') <= 0,
				onMove: (G, ctx) => {
					const isCompleted = Object.keys(G.story.objective).every((key) => {
						const { current, target } = G.story.objective[key]

						return (isArray(current) ? current.length : current) >= target
					})

					if (isCompleted) {
						runStoryEffects(G, ctx)

						G.story.chapter++

						const { duration } = Story[G.story.part].chapters[G.story.chapter]

						// We create an overlap with the previous block call
						ctx.effects.storyBlock('>-2', duration + 2)
						ctx.effects.nextChapter(G.story.chapter, `>-${duration}`, duration)

						const player = G.players[ctx.currentPlayer]
						player.status = getStatusUpdate(ctx, player, 'afterObjective')

						const newChapter = getCurrentChapter(G.story)

						if (G.story.chapter < Story[G.story.part].chapters.length - 1) {
							G.story.objective = { ...newChapter.objective }

							updateStoryProgress(G, ctx)

							ctx.effects.newObjective({ ...newChapter }, '>+1.5')
						}
					}
				}
			},
			moves: {
				move: (G, ctx, roomId) => {
					const player = G.players[ctx.currentPlayer]
					const currentRoom = G.board.rooms.find(({ players }) => players.includes(ctx.currentPlayer))
					const isAccessible = G.board.doors.some(({ rooms, lock }) => {
						return rooms.includes(currentRoom.id) && rooms.includes(roomId) && (!lock || lock.completed >= lock.level)
					})

					if (isAccessible) {
						const targetRoom = G.board.rooms.find(({ id }) => id === roomId)

						currentRoom.players = currentRoom.players.filter((id) => id !== ctx.currentPlayer)
						targetRoom.players.push(ctx.currentPlayer)
						targetRoom.visited = true

						updateStoryProgress(G, ctx)

						player.status = getStatusUpdate(ctx, player, 'moving')
						player.modifiers.actions -= 1
						player.draw = []

						ctx.effects.playSound('move')
						ctx.effects.updateBoard()
					}
					else {
						return INVALID_MOVE
					}
				},
				startAction: (G, ctx, action) => {
					const player = G.players[ctx.currentPlayer]
					const room = G.board.rooms.find(({ players }) => players.includes(ctx.currentPlayer))

					let canPlay = true

					if (action.skill !== 'neutralise') {
						canPlay = room.enemies.every(({ level, completed }) => completed >= level)
					}

					if (action.skill === 'hack') {
						canPlay = Object.keys(G.story.objective).some((key) => {
							const o = G.story.objective[key]

							// TEMP: key used as type for now
							return (key === 'hack' || o.type === 'hack') && o.current < o.target
						})
					}

					if (!player.currentAction && canPlay) {
						player.currentAction = action

						player.status = `I’m looking to ${action.skill}`
					}
					else {
						return INVALID_MOVE
					}
				},
				doAction: (G, ctx, corruptionIndex) => {
					const player = G.players[ctx.currentPlayer]

					if (player.currentAction) {
						const currentRoom = G.board.rooms.find(({ players }) => players.includes(ctx.currentPlayer))

						let target
						const action = player.currentAction.skill

						if (action === 'hack') {
							target = currentRoom.terminal
						}
						else if (action === 'neutralise') {
							target = currentRoom.enemies[player.currentAction.enemyIndex]
						}
						else {
							const { lock } = G.board.doors.find(({ rooms }) => rooms.includes(currentRoom.id) && rooms.includes(player.currentAction.roomId))
							target = lock
						}

						if (target && target.completed < target.level) {
							const corruption = ctx.random.Shuffle(G.corruptionPool)[corruptionIndex]
							const isSuccess = corruptionCheck(corruption, getCurrent(player, action), target.difficulty)

							ctx.effects.corruptionRoll({ corruption, isSuccess, difficulty: target.difficulty })
							// Add 1 second to shift the next call
							ctx.effects.block('<', effects.corruptionRoll.duration + 1)

							if (isSuccess) {
								target.completed += 1
								player.status = `I’ve managed to ${action} successfully`

								updateStoryProgress(G, ctx)
							}
							else {
								player.status = `Dang! I failed to ${action} this one...`
							}

							player.currentAction = null
							player.modifiers.actions -= 1
						}
						else {
							return INVALID_MOVE
						}
					}
					else {
						return INVALID_MOVE
					}
				},
				cancelAction: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					player.status = getStatusUpdate(ctx, player, 'actionCancel')
					player.currentAction = null
				},
				showUpgrades: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]
					player.isCheckingUpgrades = true
					player.comms.seen = true

					player.status = getStatusUpdate(ctx, player, 'boostStart')
				},
				hideUpgrades: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]
					player.isCheckingUpgrades = false

					player.status = getStatusUpdate(ctx, player, 'boostCancel')
				},
				useUpgrade: (G, ctx, upgradeId) => {
					const player = G.players[ctx.currentPlayer]

					player.isCheckingUpgrades = false

					const upgrade = player.upgrades.find(({ id }) => id === upgradeId)
					player.upgrades = player.upgrades.filter(({ id }) => id !== upgradeId)

					// TODO: tweak status per skill
					player.status = `I’m using a${upgrade.effect.change === 'actions' ? 'n' : ''} ${upgrade.effect.change} boost`

					ctx.effects.useUpgrade({
						id: upgrade.id,
						upgradeId: upgrade.upgradeId,
						effect: { ...upgrade.effect }, // because of Immer
						name: upgrade.name,
						rotate: -Math.random() * 20
					})

					applyUpgrade(player, upgrade)
				},
				changeCommsStatus: (G, ctx, status) => {
					const player = G.players[ctx.currentPlayer]

					if (player.comms && !player.comms.status) {
						if (status === 'off') {
							player.upgrades.push(player.comms.upgrade)
						}

						player.comms.status = status
						player.status = `I’m turning the comms ${status}`

						ctx.effects.useComms({
							status,
							rotate: -Math.random() * 20
						})
					}
					else {
						return INVALID_MOVE
					}
				},
				requestUpgrade: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					if (!player.isRequestingUpgrades) {
						player.status = getStatusUpdate(ctx, player, 'boostSearch')

						if (player.draw.length === 0) {
							player.draw = getUpgradesForPlayer(ctx, player, 3)
						}

						player.isRequestingUpgrades = true
					}
					else {
						return INVALID_MOVE
					}
				},
				cancelRequestUpgrade: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					if (player.isRequestingUpgrades) {
						player.status = getStatusUpdate(ctx, player, 'boostSearchCancel')
						player.isRequestingUpgrades = false
					}
					else {
						return INVALID_MOVE
					}
				},
				getUpgrade: (G, ctx, upgradeId) => {
					const player = G.players[ctx.currentPlayer]
					const upgrade = player.draw.find(({ id }) => id === upgradeId)

					if (upgrade) {
						player.upgrades.push(upgrade)
						player.draw = []
						player.modifiers.actions -= 1
						player.status = `I found a new ${upgrade.effect.change} boost!`
						player.isRequestingUpgrades = false
					}
					else {
						return INVALID_MOVE
					}
				},
				requestHelp: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					if (!player.helpRequest) {
						const room = G.board.rooms.find(({ players }) => players.includes(ctx.currentPlayer))
						const doors = G.board.doors.filter(({ rooms, disabled, lock }) => rooms.includes(room.id) && !disabled && (!lock || lock.completed >= lock.level))

						let nearPlayers = room.players

						doors.forEach(({ rooms }) => {
							const roomId = rooms.find((id) => id !== room.id)
							const targetRoom = G.board.rooms.find(({ id }) => id === roomId)

							nearPlayers = [...nearPlayers, ...targetRoom.players]
						})

						player.helpRequest = {
							crew: {}
						}

						// For every player
						Object.keys(G.players)
							.filter((id) => id !== ctx.currentPlayer)
							.forEach((id) => {
								const isNear = nearPlayers.includes(id)
								const availableUpgrades = Array.from(new Set(G.players[id].upgrades.map(({ effect }) => effect.change)))

								player.helpRequest.crew[id] = {
									isNear,
									availableUpgrades,
									isHelping: false,
									upgrade: null
								}
							})

						player.status = getStatusUpdate(ctx, player, 'boostRequestStart')
					}
					else {
						return INVALID_MOVE
					}
				},
				selectNeed: (G, ctx, need) => {
					const player = G.players[ctx.currentPlayer]

					if (player.helpRequest) {
						player.helpRequest.need = need
						player.status = `Hey! I need some ${need} boosts!`
					}
					else {
						return INVALID_MOVE
					}
				},
				cancelHelpRequest: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					if (player.helpRequest) {
						player.status = getStatusUpdate(ctx, player, 'boostRequestCancel')

						// Reset upgrades from helping players
						Object.keys(player.helpRequest.crew).forEach((id) => {
							const p = G.players[id]
							const c = player.helpRequest.crew[id]

							if (c.upgrade) {
								applyUpgrade(player, c.upgrade, -1)
								p.upgrades.push(c.upgrade)
							}
						})

						player.helpRequest = null
					}
					else {
						return INVALID_MOVE
					}
				},
				acceptHelp: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					if (player.helpRequest) {
						player.status = getStatusUpdate(ctx, player, 'boostRequestAccepted')
						player.helpRequest = null

						ctx.effects.playSound('accept-help')
					}
				},
				answerHelpRequest: (G, ctx) => {
					const current = G.players[ctx.currentPlayer]

					if (current.helpRequest) {
						const helper = current.helpRequest.crew[ctx.playerID]

						if (helper && helper.isNear && helper.availableUpgrades.includes(current.helpRequest.need)) {
							helper.isHelping = true
						}
						else {
							return INVALID_MOVE
						}
					}
					else {
						return INVALID_MOVE
					}
				},
				cancelHelp: (G, ctx) => {
					const current = G.players[ctx.currentPlayer]

					if (current.helpRequest) {
						const helper = current.helpRequest.crew[ctx.playerID]

						if (helper) {
							helper.isHelping = false
						}
						else {
							return INVALID_MOVE
						}
					}
					else {
						return INVALID_MOVE
					}
				},
				help: (G, ctx, upgradeId) => {
					const current = G.players[ctx.currentPlayer]
					const player = G.players[ctx.playerID]
					const upgrade = player.upgrades.find(({ id }) => id === upgradeId)

					if (current.helpRequest && current.helpRequest.crew[ctx.playerID].isHelping && !current.helpRequest.crew[ctx.playerID].upgrade && upgrade && upgrade.effect.change === current.helpRequest.need) {
						player.upgrades = player.upgrades.filter(({ id }) => id !== upgradeId)

						const helper = current.helpRequest.crew[ctx.playerID]
						helper.upgrade = upgrade
						helper.isHelping = false

						current.status = `Thanks ${player.name} for the boost!`

						applyUpgrade(current, upgrade)
					}
					else {
						return INVALID_MOVE
					}
				},
				endTurn: (G, ctx) => {
					ctx.events.endTurn()
				}
			},
			onEnd: (G, ctx) => {
				ctx.effects.updateBoard('>', 1)

				// clear modifiers (except stamina)
				// So we can use that for penalties in corruption/encounter
				Object.keys(G.players).forEach((id) => {
					Object.keys(G.players[id].modifiers).forEach((skill) => {
						if (skill !== 'stamina') {
							G.players[id].modifiers[skill] = 0
						}
					})
				})
			},
			next: skipEncounter ? 'corruption' : 'encounter'
		},
		encounter: {
			turn: {
				order: TurnOrder.ONCE,
				activePlayers: {
					all: Stage.NULL
				},
				onBegin: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]
					const isLucky = ctx.random.D6() >= 4
					const effects = ctx.random.Shuffle(EncounterEffects).filter((e) => !e.pre || e.pre(G, ctx))

					// There are 5 encounters that can always be applied
					player.encounter = {
						scratch: ctx.random.Shuffle([
							{ id: effects[0].id },
							{ id: effects[0].id },
							{ id: effects[2].id },
							{ id: effects[isLucky ? 1 : 0].id }
						]),
						effect: isLucky ? false : effects[0].id,
						completed: false
					}

					player.status = getStatusUpdate(ctx, player, 'securityScan')
					ctx.effects.playSound('player-change')
				}
			},
			moves: {
				reveal: (G, ctx, index) => {
					const player = G.players[ctx.currentPlayer]

					if (player.encounter.scratch[index]) {
						player.encounter.scratch[index].revealed = true

						if (
							player.encounter.scratch.every(({ revealed }) => revealed) ||
							(player.encounter.effect && player.encounter.scratch.filter(({ id, revealed }) => revealed && id === player.encounter.effect).length >= 3)
						) {
							player.encounter.completed = true

							if (player.encounter.effect) {
								const encounter = EncounterEffects.find(({ id }) => id === player.encounter.effect)
								player.status = encounter.status || encounter.effect

								ctx.effects.playSound('alarm')
							}
							else {
								player.status = getStatusUpdate(ctx, player, 'securityPass')
							}
						}
					}
					else {
						return INVALID_MOVE
					}
				},
				applyEncounter: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					if (player.encounter.completed) {
						if (player.encounter.effect) {
							const encounter = EncounterEffects.find(({ id }) => id === player.encounter.effect)

							const pre = encounter.pre ? encounter.pre(G, ctx) : null
							encounter.apply(G, ctx, pre)
						}

						ctx.events.endTurn()
					}
					else {
						return INVALID_MOVE
					}
				}
			},
			onEnd: (G, ctx) => {
				Object.keys(G.players).forEach((id) => {
					G.players[id].encounter = null
					G.players[id].attackedBy = []
				})

				// Calculates the attacks for the next phase
				G.board.rooms.filter(({ visited }) => visited).forEach(({ id, enemies, players }) => {
					// For each visited room with an alive cog
					enemies.filter((enemy) => enemy.completed < enemy.level).forEach((enemy) => {
						// They can only get to the players in this room
						const reachablePlayers = players.slice()
						const alivePlayers = reachablePlayers.filter((id) => getCurrent(G.players[id], 'stamina') > 0)

						if (alivePlayers.length) {
							// Find the player with the highest stamina
							const target = reachablePlayers.sort((a, b) => {
								const getCurrentDamage = (player) => {
									return player.attackedBy.reduce((total, { level }) => total + level, 0)
								}

								return (getCurrent(G.players[a], 'stamina') - getCurrentDamage(G.players[a])) - (getCurrent(G.players[b], 'stamina') - getCurrentDamage(G.players[b]))
							}).pop()

							G.players[target].attackedBy.push(enemy)
						}
					})
				})
			},
			next: 'corruption'
		},
		corruption: {
			// Skip the phase if nobody has any attacks or is dead from encounters
			endIf: (G, ctx) => Object.keys(G.players).every((id) => (!G.players[id].attackedBy || !G.players[id].attackedBy.length) && getCurrent(G.players[id], 'stamina') > 0),
			turn: {
				order: TurnOrder.ONCE,
				activePlayers: {
					all: Stage.NULL
				},
				onBegin: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]
					const damage = getDamage(player)
					const isKO = isKnockedOut(player, damage)

					if (isKO) {
						player.status = 'Oh no! They got me and are taking me back to the Quarters!'
					}
					else if (damage > 0) {
						player.status = `Ouch, that’s ${damage} damage`
					}
					else {
						player.status = getStatusUpdate(ctx, player, 'escapeEnemy')
					}

					ctx.effects.playSound('player-change')
				},
				onEnd: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]

					// Return dead players to start room with full health
					if (getCurrent(player, 'stamina') <= 0) {
						const startRoom = G.board.rooms.find(({ start }) => start)
						const currentRoom = G.board.rooms.find(({ players }) => players.includes(ctx.currentPlayer))

						player.modifiers.stamina = 0
						player.modifiers.actions = 2
						currentRoom.players = currentRoom.players.filter((id) => ctx.currentPlayer !== id)
						startRoom.players = [...startRoom.players, ctx.currentPlayer]
					}
				}
			},
			moves: {
				attacked: (G, ctx) => {
					const player = G.players[ctx.currentPlayer]
					const damage = getDamage(player)

					if (damage > 0) {
						ctx.effects.attack({ enemies: player.attackedBy.map(({ id }) => id) })
						player.modifiers.stamina -= damage
					}

					ctx.events.endTurn()
				}
			},
			onEnd: (G, ctx) => {
				G.story.corruptionProgress += 1

				const corruption = Story[G.story.part].corruption[G.story.corruption]

				if (G.story.corruptionProgress >= corruption.threshold) {
					ctx.effects.corruption('>', corruption.duration)

					runCorruptionEffects(G, ctx)

					// Move to the next corruption stage if possible
					if (G.story.corruption < Story[G.story.part].corruption.length - 1) {
						G.story.corruption += 1
						G.story.corruptionProgress = 1
					}
				}
				else {
					ctx.effects.corruptionUpdate('>')
				}

				// PATROL

				const patrollingEnemyRooms = G.board.rooms.filter(({ players, enemies, visited }) => {
					const hasEnemies = enemies.some(({ level, completed }) => completed < level)
					const hasPlayers = players.length > 0
					const isPatrolling = ctx.random.D6() >= 5

					return visited && hasEnemies && !hasPlayers && isPatrolling
				})

				const moves = []

				patrollingEnemyRooms.forEach((room) => {
					const connectedDoors = ctx.random.Shuffle(G.board.doors).filter(({ rooms }) => rooms.includes(room.id))
					const connectedRooms = connectedDoors.map(({ rooms }) => rooms.find((rId) => rId !== room.id))

					const availableRooms = connectedRooms.filter((id) => {
						return G.board.rooms.find((r) => id === r.id && r.visited && r.enemies.length < r.enemyPositions.length)
					})

					if (availableRooms.length > 0) {
						const moveableEnemies = room.enemies.filter(({ level, completed }) => completed < level)

						moveableEnemies.forEach((enemy) => {
							const destId = ctx.random.Shuffle(availableRooms)[0]
							const dest = G.board.rooms.find(({ id }) => id === destId)

							moves.push({ enemy, room, dest })
						})

						if (moveableEnemies.length > 0) {
							// Change cog positions to avoid problems when 2 cogs switch places
							room.enemyPositions = ctx.random.Shuffle(room.enemyPositions)
						}
					}
				})

				moves.forEach(({ enemy, room, dest }) => {
					// Only move the cogs if there's space (could be filled up by previous move)
					if (dest.enemies.length < dest.enemyPositions.length) {
						dest.enemies.push(enemy)
						room.enemies = room.enemies.filter(({ id }) => id !== enemy.id)
					}
				})
			},
			next: 'crew'
		}
	},
	endIf: (G, ctx) => {
		const currentCorruption = Story[G.story.part].corruption

		return G.story.corruption >= currentCorruption.length - 1 && G.story.corruptionProgress === currentCorruption[currentCorruption.length - 1].threshold
	}
}
