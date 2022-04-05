import { nanoid } from 'nanoid'

// NOTE: Only use from (and not to) to get all doors leading to X?

const addEnemy = (G, ctx, { location, level, difficulty }) => {
	const room = G.board.rooms.find(({ id }) => id === location)

	if (room.enemies.length < room.enemyPositions.length) {
		room.enemies.push({ id: nanoid(), level, difficulty, completed: 0 })
	}
}

const increaseTerminalDifficulty = (G, ctx, { location }) => {
	const room = G.board.rooms.find(({ id }) => id === location)
	room.terminal.difficulty += 1
}

const findDoor = (G, from, to) => {
	return G.board.doors.find(({ rooms }) => rooms.includes(from) && rooms.includes(to))
}

const enableDoor = (G, ctx, { from, to }) => {
	const door = findDoor(G, from, to)
	door.disabled = false
}

const showLabel = (G, ctx, { location }) => {
	const room = G.board.rooms.find(({ id }) => id === location)
	room.label.visible = true
}

const lockDoor = (G, ctx, { from, to, level, difficulty }) => {
	const door = findDoor(G, from, to)

	door.lock = {
		level,
		difficulty,
		completed: 0
	}
}

const increaseLockLevel = (G, ctx, { from, to }) => {
	const door = findDoor(G, from, to)
	door.lock.level += 1
}

const increaseRoomLockLevel = (G, ctx, { location, nbLocks }) => {
	G.board.doors
		.filter(({ lock, rooms }) => rooms.includes(location) && lock && lock.completed < lock.level)
		.slice(0, nbLocks)
		.forEach((door) => (door.lock.level += 1))
}

const resetLock = (G, ctx, { from, to }) => {
	const door = findDoor(G, from, to)
	door.lock.completed = 0
}

const wakeUpEnemies = (G, ctx, { levelIncrease, location }) => {
	const room = G.board.rooms.find(({ id }) => id === location)

	room.enemies.forEach((enemy) => {
		enemy.completed = 0

		if (levelIncrease && enemy.level < 2 && ctx.random.D6() > 4) {
			enemy.level = 2
		}
	})
}

const wakeUpAllEnemies = (G, ctx, { levelIncrease }) => {
	G.board.rooms.forEach((room) => {
		wakeUpEnemies(G, ctx, { levelIncrease, location: room.id })
	})
}

export const storyEffects = {
	enableDoor,
	showLabel
}

export const corruptionEffects = {
	addEnemy,
	wakeUpAllEnemies,
	wakeUpEnemies,
	resetLock,
	increaseRoomLockLevel,
	increaseLockLevel,
	lockDoor,
	increaseTerminalDifficulty
}
