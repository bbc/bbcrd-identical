import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useEffectState } from 'bgio-effects/react'

import { corruptionCheck, getCurrent } from '../game/helpers'
import { skipBlockScreen } from '../game/game-config'

import CorruptionPool from './CorruptionPool'
import Encounter from './Encounter'
import UpgradePool from './UpgradePool'
import CharacterSheet from './CharacterSheet'
import EncounterEffect from './EncounterEffect'
import DamageConfirmation from './DamageConfirmation'
import ChooseCharacter from './ChooseCharacter'
import Rules from './Rules'
import BlockScreen from './BlockScreen'
import HelpPool from './HelpPool'
import HelpNeeded from './HelpNeeded'
import CommsPool from './CommsPool'

const getTarget = ({ doors, room, player }) => {
	if (player.currentAction.skill === 'hack') {
		return room.terminal
	}
	else if (player.currentAction.skill === 'neutralise') {
		return room.enemies[player.currentAction.enemyIndex]
	}
	else {
		const { lock } = doors.find(({ rooms }) => rooms.includes(room.id) && rooms.includes(player.currentAction.roomId))

		return lock
	}
}

function Board (props) {
	const { G, ctx, playerID, moves } = props
	const player = G.players[playerID]
	const currentPlayer = G.players[ctx.currentPlayer]
	const isCurrent = ctx.currentPlayer === playerID
	const [needRules, setNeedRules] = useState(true)
	const isSingleScreen = props.single

	const [, isCorruptionPlaying] = useEffectState('corruption')
	const [, isCorruptionAdvancing] = useEffectState('corruptionUpdate')
	const [, isRolling] = useEffectState('corruptionRoll')
	const [, isStorytelling] = useEffectState('nextChapter')
	const [, isIntroPlaying] = useEffectState('intro')
	const [, isBlocking] = useEffectState('block')
	const [, isStoryBlocking] = useEffectState('storyBlock')

	const shouldBlock = !skipBlockScreen ? isBlocking || isStoryBlocking || isCorruptionPlaying || isCorruptionAdvancing || isIntroPlaying || isRolling || isStorytelling || (ctx.phase === 'encounter' && !isCurrent) : false

	const room = G.board.rooms.find(({ players }) => players.includes(playerID))
	const doors = G.board.doors.filter(({ rooms, disabled }) => rooms.includes(room.id) && !disabled)

	const getSuccessRate = useCallback((skill, difficulty) => {
		const successes = G.corruptionPool.filter((draw) => corruptionCheck(draw, skill, difficulty))

		return Math.floor((successes.length / G.corruptionPool.length) * 100)
	}, [G.corruptionPool])

	if (ctx.phase === 'setup') {
		if (needRules && !isSingleScreen) {
			return <Rules handleNext={() => setNeedRules(false)} />
		}
		else {
			return <ChooseCharacter isSingleScreen={isSingleScreen} players={G.players} playerID={playerID} moves={moves} />
		}
	}
	else {
		return <div className={`relative bg-${player.id} max-w-md mx-auto overflow-hidden h-full select-none`}>
			<CharacterSheet {...{ G, ctx, getSuccessRate, moves, player, currentPlayer, isCurrent, playerID, room, doors, isSingleScreen }} />
			<AnimatePresence>
				{shouldBlock && <BlockScreen key='blocking' isSingleScreen={isSingleScreen} />}

				{isCurrent && player.comms && !player.comms.status && <CommsPool comms={player.comms} handleSelect={moves.changeCommsStatus} isSingleScreen={isSingleScreen} />}
				{isCurrent && player.currentAction && <CorruptionPool key='do-action' {...player} moves={moves} playerSkill={getCurrent(player, player.currentAction.skill)} difficulty={getTarget({ room, doors, player }).difficulty} getSuccessRate={getSuccessRate} isSingleScreen={isSingleScreen} />}
				{isCurrent && player.isRequestingUpgrades && <UpgradePool isSingleScreen={isSingleScreen} key='choose-upgrades' upgrades={player.draw} direction={-1} handleSelect={(id) => moves.getUpgrade(id)} title='Boosts Found!' instruction='flick down to choose a boost' handleCancel={() => moves.cancelRequestUpgrade()} />}
				{isCurrent && currentPlayer.isCheckingUpgrades && <UpgradePool isSingleScreen={isSingleScreen} key='use-upgrades' upgrades={player.upgrades} direction={1} handleSelect={(id) => moves.useUpgrade(id)} title='Use a boost' instruction='flick up to use a boost' handleCancel={() => moves.hideUpgrades()} />}
				{isCurrent && currentPlayer.helpRequest && !currentPlayer.helpRequest.need && <HelpPool isSingleScreen={isSingleScreen} key='help-pool' handleSelect={moves.selectNeed} title='What do you need?' instruction='flick up to request a Boost' players={G.players} helpRequest={currentPlayer.helpRequest} handleCancel={() => moves.cancelHelpRequest()} />}
				{isCurrent && currentPlayer.helpRequest && currentPlayer.helpRequest.need && <HelpNeeded key='help-needed' handleSelect={() => moves.acceptHelp()} title='Boost Request Sent!' players={G.players} helpRequest={currentPlayer.helpRequest} handleCancel={() => moves.cancelHelpRequest()} />}
				{!isCurrent && currentPlayer.helpRequest?.crew[playerID].isHelping && <UpgradePool isSingleScreen={isSingleScreen} upgrades={player.upgrades.filter(({ effect }) => effect.change === currentPlayer.helpRequest.need)} direction={1} handleSelect={(id) => moves.help(id)} title={`Give a boost to ${currentPlayer.name}`} instruction='flick up to give a boost' handleCancel={() => moves.cancelHelp()} />}
				{isCurrent && ctx.phase === 'encounter' && !currentPlayer.encounter.completed && <Encounter key='encounter-symbols' handleReveal={(i) => moves.reveal(i)} {...player} isSingleScreen={isSingleScreen} />}
				{isCurrent && ctx.phase === 'encounter' && currentPlayer.encounter.completed && <EncounterEffect key='encounter-effect' id={currentPlayer.encounter.effect} accept={() => moves.applyEncounter()} />}
				{isCurrent && ctx.phase === 'corruption' && <DamageConfirmation key='damage' player={currentPlayer} accept={() => moves.attacked()} />}
			</AnimatePresence>
		</div>
	}
}

export default Board
