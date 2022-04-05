import { isNumber, isString } from 'lodash'

// Helpers to do calculations for both the client and server

export const corruptionCheck = (corruption, skill, difficulty) => {
	return (isNumber(corruption) && skill + corruption - difficulty >= 0) || (isString(corruption) && corruption === 'success')
}

export const getCurrent = (player, skill) => {
	if (player.skills[skill]) {
		return player.skills[skill] + player.modifiers[skill]
	}
	else {
		return player[skill] + player.modifiers[skill]
	}
}

export const getDamage = (player) => {
	return player.attackedBy ? player.attackedBy.reduce((sum, { level }) => (sum += level), 0) : 0
}

export const isKnockedOut = (player, damage) => {
	return player.stamina + player.modifiers.stamina - damage <= 0
}

export const canEnemySeeYou = (board, room) => {
	return room.enemies.some(({ completed, level }) => completed < level)
}

export const isSkill = (skill) => ['hack', 'lockpick', 'neutralise'].includes(skill)

export const getSkillColor = (skill) => {
	if (isSkill(skill)) {
		return skill
	}
	else {
		return 'white'
	}
}
