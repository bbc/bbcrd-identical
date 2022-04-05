import { getSkillColor } from '../game/helpers'
import SkillIcon from './SkillIcon'

function PlayerComms ({ currentPlayer, isCurrent, playerID, player, moves, detected }) {
	const { name } = currentPlayer

	let cantHelpMsg = ''
	let helper = null
	let hasUpgrade = false

	if (currentPlayer.helpRequest && !isCurrent) {
		helper = currentPlayer.helpRequest.crew[playerID]
		hasUpgrade = helper.availableUpgrades.includes(currentPlayer.helpRequest.need)

		if (!helper.isNear) {
			cantHelpMsg = "but you're too far to help!"
		}

		if (helper.upgrade) {
			cantHelpMsg = "and you've done your best!"
		}

		if (helper.isNear && !hasUpgrade) {
			cantHelpMsg = "but you don't have any!"
		}
	}

	return <>
		<div className={`sticky bottom-0 z-10 w-full border-t-2 border-${player.id}`}>
			{isCurrent && detected && !player.isWriting && <div className='bg-black text-neutralise px-4 py-2 flex items-center space-x-3 border-b-2 border-map-grey'>
				<div className='text-black bg-neutralise rounded-md flex justify-center items-center w-9 h-9 shrink-0'>
					<SkillIcon skill='neutralise' className='h-1/3 animate-ping' />
				</div>
				<div className='flex flex-col'>
					<div className='font-semibold uppercase tracking-wider'>Detected!</div>
					<div className='italic text-sm'>Neutralise or move to stay safe</div>
				</div>
			</div>}

			{!isCurrent && <div className={`space-y-0.5 bg-${player.id}`}>
				{currentPlayer.helpRequest?.need && <div className='flex justify-between space-x-4 bg-black text-white px-4 py-3'>
					<div className='w-full'>{name} is requesting a {currentPlayer.helpRequest.need} boost... {cantHelpMsg}</div>
					{helper && !helper.upgrade && helper.isNear && hasUpgrade && <button className={`bg-${getSkillColor(currentPlayer.helpRequest.need)} border-2 px-3 py-2 rounded-lg shrink-0 text-black`} onClick={() => moves.answerHelpRequest()}>Give boost</button>}
				</div>}
			</div>}
		</div>
	</>
}

export default PlayerComms
