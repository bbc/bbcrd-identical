import { getSkillColor, isSkill } from '../game/helpers'
import SkillIcon from './SkillIcon'

function UpgradeCard ({ upgradeId, name, effect, noTitle }) {
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
	let textColor = 'text-white'

	if (isStamina) {
		borderColor = 'bg-black'
		textColor = 'text-black'
	}
	else if (isSkill(effect.change)) {
		borderColor = `bg-${effect.change}`
		textColor = `text-${effect.change}`
	}

	return <div className='w-full aspect-w-7 aspect-h-10'>
		<div
			className={`rounded-lg bg-${getSkillColor(effect.change)}`}
			style={{
				...foil,
				boxShadow: '0px 2px 5px rgba(240, 240, 240, 0.1), 0px -2px 5px rgba(240, 240, 240, 0.1)'
			}}
		>
			<div className={`absolute rounded-md ${borderColor}`} style={{ top: '6px', left: '6px', width: 'calc(100% - 12px)', height: 'calc(100% - 12px)' }} />
			<div className='w-full h-full absolute bottom-0 left-0 bg-contain bg-no-repeat bg-bottom' style={{ backgroundImage: `url('/static/images/upgrades/${upgradeId}.svg')`, ...foilSizing }} />
			<div className='absolute top-0 left-0 text-xl font-semibold w-full rounded-t-lg text-black py-3'>
				<div className={`space-x-2 flex justify-between items-center w-full pl-4 pr-3 ${isStamina && 'text-white'}`}>
					{!noTitle && <div className='italic text-left relative leading-tight'>{name}</div>}

					<div className={`flex shrink-0 ${noTitle ? 'flex-col space-y-1' : 'space-x-1'}`}>
						{[...Array(effect.value)].map((x, i) => {
							// TODO
							return <div key={i} className={`flex items-center p-1.5 rounded-md ${isStamina ? 'bg-white' : 'bg-black'} ${textColor} font-bold`}>
								<SkillIcon skill={effect.change} className={`w-4 ${isStamina && 'text-stamina-red'}`} />
							</div>
						})}
					</div>
				</div>
			</div>
			<div className='absolute bottom-0 flex items-center justify-center w-full'>
				<div className={`px-3 py-1 rounded-t-md ${isStamina ? 'bg-white' : 'bg-black'} ${textColor} font-bold uppercase text-base tracking-wider max-w-full`}>
					{isStamina ? '↑' : '+'}{effect.value} {effect.change}
				</div>
			</div>
		</div>
	</div>
}

export default UpgradeCard
