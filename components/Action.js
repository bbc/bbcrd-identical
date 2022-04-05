import { getCurrent, isSkill } from '../game/helpers'
import RoomIcon from './RoomIcon'

const Arrows = {
	'left': '←',
	'right': '→',
	'up': '↑',
	'down': '↓',
	'up left': '↖',
	'up right': '↗',
	'down left': '↙',
	'down right': '↘'
}

// This is the component used to display an action as part of the character sheet
// It handles disabled state based on the props passed

const Action = ({ skill, label, difficulty, direction, player, handle, room, hasEnemy, objectiveCompleted, completed, nearPlayers, players, isSingleScreen }) => {
	const enemyCanSeeYou = hasEnemy && ['hack', 'lockpick'].includes(skill)
	const disableTerminals = objectiveCompleted && skill === 'hack'
	const upgradesLimitReached = skill === 'draw' && player && player.upgrades.length >= 8
	const nobodyCanHelp = nearPlayers && nearPlayers.length === 0 && skill === 'request'
	const noBoosts = skill === 'play-boost' && player.upgrades.length === 0
	const isDisabled = enemyCanSeeYou || disableTerminals || upgradesLimitReached || nobodyCanHelp || completed || noBoosts
	const bg = isDisabled ? 'bg-txt-grey' : 'bg-black'
	const icon = skill === 'move' ? <RoomIcon {...room} /> : <img alt={skill} className={`object-contain ${isSkill(skill) ? 'w-7/12' : 'w-full'} ${isDisabled && 'filter-white'}`} src={`/static/images/${skill}.svg`} />

	let actionData = {}

	if (difficulty) {
		const playerSkill = getCurrent(player, skill)
		const delta = playerSkill - difficulty
		const maxUpgrade = player.upgrades.reduce((sum, { effect }) => {
			const value = effect.change === skill ? effect.value : 0

			return sum + value
		}, 0)
		const shouldUpgrade = delta < 2 && maxUpgrade > 0 && (playerSkill + maxUpgrade) - difficulty > -2
		const canRequestHelp = delta < 2 && nearPlayers.some((id) => players[id].upgrades.some(({ effect }) => effect.change === skill))

		let successMessage = 'No chance...'

		if (delta === -1) {
			successMessage = 'Feeling lucky?'
		}
		else if (delta === 0) {
			successMessage = 'Think you can do it?'
		}
		else if (delta === 1) {
			successMessage = 'Well worth a shot!'
		}
		else if (delta >= 2) {
			successMessage = 'Your best shot!'
		}

		if (canRequestHelp) {
			successMessage = 'Request crew boost?'
		}

		if (shouldUpgrade) {
			successMessage = 'Use your boosts?'
		}

		actionData = {
			playerSkill,
			successMessage
		}
	}

	return <button disabled={isDisabled} className={`w-full flex items-stretch text-base text-black bg-white outline-none rounded-xl disabled:bg-btn-grey ${isSingleScreen && 'transform transition-transform hover:scale-95'}`} onClick={handle}>
		{skill && <div className={`h-12 w-12 my-2 ml-2 flex justify-center items-center rounded-lg ${bg} shrink-0 p-1`}>{icon}</div>}
		<div className='flex flex-col justify-center w-full rounded-lg pl-2.5'>
			<div className={`flex items-center w-full h-full font-medium justify-between ${!skill && 'py-2'}`}>
				<div className={`text-left space-y-1 ${isDisabled ? 'text-txt-grey' : undefined} ${!skill && 'text-center w-full'}`}>
					<div className='font-semibold leading-tight'>{label}</div>
					{isDisabled && upgradesLimitReached && <div className='italic text-sm leading-tight'>Too many boosts</div>}
					{isDisabled && enemyCanSeeYou && !completed && <div className='italic text-txt-grey text-left text-sm'>Cog next to you</div>}
					{isDisabled && (disableTerminals || completed) && <div className='italic text-txt-grey text-left text-sm'>{(completed && !disableTerminals) ? 'Hacked, find another...' : 'Terminals completed'}</div>}
					{difficulty && !isDisabled && <div className='italic text-txt-grey text-sm leading-tight'>
						{actionData.successMessage}
					</div>}
					{nobodyCanHelp && <div className='italic text-txt-grey text-sm leading-tight'>
						Crew more than 1 room away
					</div>}
					{noBoosts && <div className='italic text-txt-grey text-sm leading-tight'>
						You’re out of Boosts
					</div>}
				</div>

				{difficulty && !completed && <div className={`flex ${isDisabled ? bg : 'bg-black'} text-white text-sm rounded-r-lg px-2 font-semibold h-full w-8 leading-snug ml-1`}>
					<div className='flex flex-col justify-center'>
						<div>{actionData.playerSkill}</div>
						<div className={!isDisabled ? `text-${skill}` : ''} style={{ fontSize: '0.9em' }}>vs</div>
						<div>{difficulty}</div>
					</div>
				</div>}

				{direction && <div className='flex flex-col justify-center bg-black text-white text-2xl rounded-r-lg px-2 font-normal h-full w-8 ml-1'>
					<div>{Arrows[direction]}</div>
				</div>}
			</div>
		</div>
	</button>
}

export default Action
