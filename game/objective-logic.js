// TODO: make target variable (e.g. only 2 people)
const updateMeetCount = (G, ctx, objective, key) => {
	const { location } = objective[key]
	const room = G.board.rooms.find(({ id }) => id === location)

	G.story.objective[key] = {
		target: Object.keys(G.players).length,
		...G.story.objective[key],
		current: room.players
	}
}

const updateHackCount = (G, ctx, objective, key) => {
	const { location } = objective[key]
	const player = G.players[ctx.currentPlayer]
	let isInLocation = true

	if (location) {
		const currentRoom = G.board.rooms.find(({ players }) => players.includes(ctx.currentPlayer))
		isInLocation = currentRoom.id === location
	}

	if (isInLocation && player.currentAction && player.currentAction.skill === 'hack') {
		G.story.objective[key].current += 1
	}
}

// TODO: make this without location as well?
const updateLockpickCount = (G, ctx, objective, key) => {
	const { location } = objective[key]

	G.story.objective[key] = {
		current: G.board.doors.filter(({ rooms, lock }) => lock && lock.completed >= lock.level && rooms.includes(location)).length,
		target: G.board.doors.filter(({ rooms, lock }) => lock && rooms.includes(location)).length
	}
}

// TODO: make this without location as well?
const updateNeutraliseCount = (G, ctx, objective, key) => {
	const { location, hidden } = objective[key]
	const room = G.board.rooms.find(({ id }) => id === location)

	const isHidden = hidden && !G.board.rooms.find(({ id, visited }) => id === location && visited)
	const target = room.enemies.length
	const current = room.enemies.filter(({ completed, level }) => level === completed).length

	G.story.objective[key] = { target, current, hidden: isHidden }
}

const updateObjectiveProgress = {
	meet: updateMeetCount,
	hack: updateHackCount,
	lockpick: updateLockpickCount,
	neutralise: updateNeutraliseCount
}

export default updateObjectiveProgress
