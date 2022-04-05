import { motion } from 'framer-motion'

import PlayerComms from './PlayerComms'
import Action from './Action'
import UpgradeThumb from './UpgradeThumb'
import SkillIcon from './SkillIcon'
import { canEnemySeeYou, getCurrent } from '../game/helpers'
import intersect from 'path-intersection'

// This is the main component rendered on the player board. It shows the player's character,
// their stats, boosts and available actions.

function CharacterSheet ({ G, ctx, moves, player, currentPlayer, room, doors, isCurrent, playerID, isSingleScreen }) {
	const nearPlayers = doors.reduce((list, { rooms }) => {
		const roomId = rooms.find((id) => id !== room.id)
		const targetRoom = G.board.rooms.find(({ id }) => id === roomId)

		return [...list, ...targetRoom.players]
	}, [...room.players]).filter((id) => id !== playerID)

	const actions = []
	const freeActions = []

	freeActions.push({
		skill: 'play-boost',
		label: 'Use a Boost',
		handle: () => moves.showUpgrades()
	})

	if (Object.keys(G.players).length > 1) {
		freeActions.push({
			skill: 'request',
			label: 'Request crew Boost',
			handle: () => moves.requestHelp()
		})
	}

	actions.push({
		skill: 'draw',
		label: 'Search for more Boosts',
		handle: () => moves.requestUpgrade()
	})

	if (room.terminal) {
		const hackObjectives = Object.keys(G.story.objective).filter((k) => k === 'hack' || G.story.objective[k].type === 'hack')
		// TODO: check location of objective if available
		const objectiveCompleted = !hackObjectives.length || hackObjectives.every((key) => {
			const o = G.story.objective[key]

			return o.current >= o.target
		})

		actions.push({
			skill: 'hack',
			label: 'Hack',
			completed: room.terminal.completed >= room.terminal.level,
			objectiveCompleted,
			difficulty: room.terminal.difficulty,
			handle: () => moves.startAction({ skill: 'hack' })
		})
	}

	room.enemies.forEach(({ id, difficulty, level, completed }, enemyIndex) => {
		if (completed < level) {
			actions.push({
				skill: 'neutralise',
				label: 'Neutralise',
				difficulty,
				enemyId: id,
				handle: () => moves.startAction({ skill: 'neutralise', enemyIndex })
			})
		}
	})

	const directions = []

	doors.forEach(({ rooms, x, y, isVertical, lock }) => {
		const roomId = rooms.find((id) => id !== room.id)

		if (lock && lock.completed < lock.level) {
			actions.push({
				skill: 'lockpick',
				label: 'Lockpick',
				roomId,
				difficulty: lock.difficulty,
				handle: () => moves.startAction({ skill: 'lockpick', roomId })
			})
		}
		else {
			let direction = ''
			const targetRoom = G.board.rooms.find(({ id }) => id === roomId)

			if (isVertical) {
				// left or right
				const line = `M${x},${y}L${x + 5},${y}`
				const isRight = intersect(line, targetRoom.outline).length > 0

				direction = isRight ? 'right' : 'left'
			}
			else {
				// top or bottom
				const line = `M${x},${y}L${x},${y + 5}`
				const isDown = intersect(line, targetRoom.outline).length > 0

				direction = isDown ? 'down' : 'up'
			}

			directions.push({
				skill: 'move',
				roomId,
				doorPosition: { x, y },
				room: targetRoom,
				direction,
				label: `Go ${direction}`,
				handle: () => moves.move(roomId)
			})
		}
	})

	// If there are moves that go in the same direction (e.g. move right * 2)
	// We want to differentiate them and add another qualifier
	directions.forEach((move, i) => {
		const sameMove = directions.find(({ direction }, j) => direction === move.direction && i !== j)

		if (sameMove) {
			if (['up', 'down'].includes(move.direction)) {
				let left = move
				let right = sameMove

				if (move.doorPosition.x > sameMove.doorPosition.x) {
					left = sameMove
					right = move
				}

				left.direction = `${move.direction} left`
				left.label += ' (left)'
				right.direction = `${move.direction} right`
				right.label += ' (right)'
			}
			else if (['left', 'right'].includes(move.direction)) {
				let top = move
				let bottom = sameMove

				if (move.doorPosition.y > sameMove.doorPosition.y) {
					top = sameMove
					bottom = move
				}

				top.direction = `up ${top.direction}`
				top.label += ' (up)'
				bottom.direction = `down ${bottom.direction}`
				bottom.label += ' (down)'
			}
		}
	})

	const movementOrder = [
		'Go up',
		'Go up (left)',
		'Go up (right)',
		'Go down',
		'Go down (left)',
		'Go down (right)',
		'Go left',
		'Go left (up)',
		'Go left (down)',
		'Go right',
		'Go right (up)',
		'Go right (down)'
	]

	directions.sort((a, b) => movementOrder.indexOf(a.label) - movementOrder.indexOf(b.label)).forEach((a) => actions.push(a))

	const spring = {
		type: 'tween',
		duration: 0.7,
		ease: 'anticipate'
	}

	const canTalk = !currentPlayer.comms || currentPlayer.comms.status === 'on'

	return <motion.div
		transition={spring}
		animate={isCurrent && (player.currentAction || player.isRequestingUpgrades || player.isCheckingUpgrades) ? ({ x: '-100%' }) : ({ x: '0%' })}
		className='w-full relative h-full overflow-y-scroll flex flex-col justify-between'
	>
		<div className='p-4'>
			<div className={`bg-white py-2 rounded-xl ${isCurrent ? 'pb-6 px-4' : 'px-2'} space-y-2`}>
				<div className='flex'>
					{!isCurrent && <div className='w-24 h-24 shrink-0 bg-center rounded-md mr-3' style={{ backgroundImage: `url('/static/images/players/${currentPlayer.id}.jpg')`, backgroundSize: '150%' }} />}
					<div className={`flex w-full ${isCurrent ? 'justify-between items-center flex-row' : 'flex-col space-y-2 justify-between'}`}>
						<div className={`flex justify-between items-center ${isCurrent && 'pr-2'} w-full`}>
							<div>{currentPlayer.name} {isCurrent ? '(you)' : `(${currentPlayer.nickname})`}</div>
							<div className='w-8 h-8 rounded-full bg-white flex justify-center items-center shrink-0'>
								<img className='h-7' src={`/static/images/comms-${canTalk ? 'on' : 'off'}-v2.svg`} alt={`Microphone ${canTalk ? 'on' : 'off'}`} />
							</div>
						</div>
						<div className={`bg-${currentPlayer.id} text-black px-2 uppercase tracking-wide rounded-md text-center ${!isCurrent ? 'w-full py-2 text-base' : 'py-1 text-sm'} font-semibold`}>Playing</div>
					</div>
				</div>
			</div>

			<div
				className={`bg-cover rounded-t-xl overflow-hidden ${isCurrent ? '-mt-4 -shadow-md' : 'mt-4'}`} style={{ backgroundImage: `url('/static/images/players/${player.id}.jpg')`, paddingTop: `calc(${isCurrent ? 360 : 250}/380 * 100%)`, backgroundPosition: isCurrent ? 'center center' : '50% 40%' }}
			/>
			<div className='w-full bg-black rounded-b-xl p-4 pb-4 outline-none focus:outline-none flex flex-col justify-center rounded-t-xl -mt-8 -shadow-md'>
				<div className='flex justify-center items-center w-full space-x-2'>
					{Object.keys(player.skills).map((skill) => {
						return <div
							key={skill}
							className={`bg-black rounded-lg py-1.5 px-2.5 text-2xl flex items-center space-x-1 text-${skill} border-2`}
						>
							<div>{getCurrent(player, skill)}</div>
							<SkillIcon skill={skill} className='w-5' />
						</div>
					})}
					<div className={`bg-white rounded-lg py-2 px-2.5 text-2xl flex items-center space-x-1 text-black ${getCurrent(player, 'stamina') < 3 && 'animate-heartbeat'}`}>
						<div>{getCurrent(player, 'stamina')}</div>
						<SkillIcon skill='stamina' className='w-5 text-stamina-red' />
					</div>
				</div>
			</div>

			<div className='mt-4'>
				<div className={`bg-black text-white rounded-t-xl ${!isCurrent && 'rounded-b-xl'} px-4 py-3`}>
					{isCurrent && <div className='flex justify-between items-center space-x-2'>
						<div className=''>Character Boost</div>
						<div className='italic'>Unlimited</div>
					</div>}

					{(!isCurrent && !!player.upgrades.length) && <div className='text-center rounded-md py-1.5 px-4 text-white -mt-1 -mb-8 relative italic w-full'>
						You have {player.upgrades.length} Boost{player.upgrades.length > 1 ? 's' : ''}
					</div>}

					{!!player.upgrades.length && <div className={`flex flex-col-reverse justify-center items-center w-3/5 mx-auto -space-y-7/6 spa space-y-reverse translate3d-0 -mt-5 ${isCurrent && !!player.upgrades.length ? '-mb-12' : '-mb-8'}`}>
						{player.upgrades.map((upgrade) => <UpgradeThumb key={upgrade.id} {...upgrade} />)}
					</div>}
				</div>
				{isCurrent && <div className='flex flex-col bg-black p-3 rounded-b-xl space-y-3'>
					{freeActions.map((action) => <Action isSingleScreen={isSingleScreen} hasEnemy={room.enemies.some(({ completed, level }) => completed < level)} key={`${action.label}-${action.roomId}-${action.enemyId}`} player={player} players={G.players} nearPlayers={nearPlayers} {...action} />)}
				</div>}
			</div>

			{isCurrent && <div className='mt-4 pb-4'>
				<div className='bg-white text-black rounded-t-xl px-4 py-3 flex space-x-2 justify-between items-center'>
					<div className='flex justify-center items-center space-x-1'>
						{new Array(Math.max(player.actions, getCurrent(player, 'actions'))).fill(null).map((v, i) => {
							return <SkillIcon key={i} skill='actions' transparent={i >= player.actions} className={`text-${i < player.actions - getCurrent(player, 'actions') ? 'txt-grey' : 'black'} h-6 transition-all`} />
						})}
					</div>
					<div className='italic text-txt-grey text-right'>{getCurrent(player, 'actions')} action{getCurrent(player, 'actions') > 1 && 's'} left</div>
				</div>
				<div className='flex flex-col bg-btn-grey bg-opacity-75 p-3 rounded-b-xl space-y-3'>
					{actions.map((action) => <Action isSingleScreen={isSingleScreen} hasEnemy={room.enemies.some(({ completed, level }) => completed < level)} key={`${action.label}-${action.roomId}-${action.enemyId}`} player={player} players={G.players} nearPlayers={nearPlayers} {...action} />)}
				</div>
			</div>}
			{isCurrent && <div className='p-4'>
				<Action label='End turn' isSingleScreen={isSingleScreen} handle={() => moves.endTurn()} />
			</div>}
		</div>
		<PlayerComms
			currentPlayer={currentPlayer}
			isCurrent={isCurrent}
			player={player}
			moves={moves}
			playerID={playerID}
			detected={canEnemySeeYou(G.board, room)}
		/>
	</motion.div>
}

export default CharacterSheet
