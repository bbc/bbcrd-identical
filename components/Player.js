import { useWindupString } from 'windups'
import { getCurrent } from '../game/helpers'
import SkillIcon from './SkillIcon'

function Stats ({ player, isCurrent }) {
	return <div className='flex flex-col justify-end space-y-1'>
		<div className='flex space-x-2'>
			{Object.keys(player.skills).map((skill) => {
				return <div
					key={skill}
					className={`bg-black rounded-lg py-1 px-2 text-base flex items-center text-${skill} space-x-1`}
				>
					<div>{getCurrent(player, skill)}</div>
					<SkillIcon skill={skill} className='w-4' />
				</div>
			})}
			<div className={`bg-white rounded-lg py-1 px-2 text-base flex items-center text-black space-x-1 ${getCurrent(player, 'stamina') < 3 && 'animate-heartbeat'}`}>
				<div>{getCurrent(player, 'stamina')}</div>
				<SkillIcon skill='stamina' className='w-4 text-stamina-red' />
			</div>
		</div>
		{isCurrent && <div className='flex space-x-1 justify-start items-center text-black'>
			{new Array(Math.max(player.actions, getCurrent(player, 'actions'))).fill(null).map((v, i) => {
				return <SkillIcon key={i} skill='actions' transparent={i >= player.actions} className={`${i < player.actions - getCurrent(player, 'actions') && 'opacity-25'} w-4 transition-colors`} />
			})}
		</div>}
	</div>
}

function MiniEncounter ({ scratch = [], isCurrent }) {
	return <div className='flex space-x-2 w-full'>
		{new Array(4).fill(null).map((v, i) => {
			const symbol = scratch[i]

			return <div key={i} className={`rounded-full bg-black ${isCurrent ? 'w-12 h-12' : 'w-10 h-10'} flex justify-center items-center relative overflow-hidden`}>
				{symbol?.revealed && <img src={`/static/images/encounters/${symbol.id}.svg`} alt='Encounter symbol' style={{ width: '120%', maxWidth: '120%' }} />}
			</div>
		})}
	</div>
}

function Player ({ player, index, isCurrent, isEncounter }) {
	const { id, status, encounter } = player

	const [animatedStatus] = useWindupString(isCurrent ? (status || ' ') : '')

	return <div className={`${isCurrent && 'py-2 w-full'} relative`}>
		<div className={`flex pl-1 pr-2 py-1 justify-start items-center space-x-2 ${isCurrent ? `rounded-t-lg bg-${id}` : 'rounded-lg bg-map-grey'}`}>
			<div className={`${isCurrent ? 'w-16 h-16' : 'w-10 h-10'} bg-cover overflow-hidden rounded-lg shrink-0`} style={{ backgroundImage: `url('/static/images/players/${id}.jpg')` }} />
			{isEncounter && <MiniEncounter {...encounter} isCurrent={isCurrent} />}
			{!isEncounter && <Stats player={player} isCurrent={isCurrent} />}
		</div>
		{isCurrent && <div className={`border-l-2 border-r-2 border-b-2 rounded-b-lg border-${id}`}>
			<div className='bg-black rounded-b-lg p-2 text-center italic text-base' style={{ minHeight: '2.5rem' }}>{animatedStatus}</div>
		</div>}
	</div>
}

export default Player
