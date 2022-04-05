import { getSkillColor, isSkill } from '../game/helpers'
import SkillIcon from './SkillIcon'

function UpgradeThumbnail ({ upgradeId, effect }) {
	const foil = {
		backgroundImage: "url('/static/images/upgrades/foil.svg')",
		backgroundSize: 'cover'
	}

	const foilSizing = {
		top: '6px',
		left: '6px',
		width: 'calc(100% - 12px)',
		height: 'calc(100% - 12px)'
	}

	const isStamina = effect.change === 'stamina'
	let borderColor = 'bg-white'
	let iconColor = 'text-white'

	if (isStamina) {
		borderColor = 'bg-black'
		iconColor = 'text-stamina-red'
	}
	else if (isSkill(effect.change)) {
		borderColor = `bg-${effect.change}`
		iconColor = `text-${effect.change}`
	}

	return <div className='w-full aspect-w-7 aspect-h-9'>
		<div
			className={`rounded-lg bg-${getSkillColor(effect.change)} shadow`}
			style={{
				transform: 'rotateX(58deg) rotateZ(-50deg)',
				...foil
			}}
		>
			<div className={`absolute rounded-sm ${borderColor}`} style={{ top: '6px', left: '6px', width: 'calc(100% - 12px)', height: 'calc(100% - 12px)' }} />
			<div className='w-full h-full absolute bottom-0 left-0 bg-contain bg-no-repeat bg-bottom' style={{ backgroundImage: `url('/static/images/upgrades/${upgradeId}.svg')`, ...foilSizing }} />
			<div className='absolute top-3 z-50 left-3 space-y-1'>
				{[...Array(effect.value)].map((x, i) => {
					return <div key={i} className={`p-2 ${isStamina ? 'bg-white text-black' : 'bg-map-black text-white'} rounded-md flex flex-col items-center`} style={{ left: '12px' }}>
						<SkillIcon skill={effect.change} className={`w-4 ${iconColor}`} />
					</div>
				})}
			</div>
		</div>
	</div>
}

export default UpgradeThumbnail
