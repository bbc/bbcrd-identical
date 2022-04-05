import { motion } from 'framer-motion'
import { useRef } from 'react'

import { getSkillColor, isSkill } from '../../game/helpers'

import SkillIcon from '../SkillIcon'

const Upgrade = ({ handleSelect, upgradeId, effect, name }) => {
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
	let textColor = 'text-white'

	if (isStamina) {
		textColor = 'text-black'
	}
	else if (isSkill(effect.change)) {
		textColor = `text-${effect.change}`
	}

	return <button onClick={handleSelect} className='w-full aspect-w-7 aspect-h-10 transition-transform hover:scale-95'>
		<div
			className={`rounded-lg bg-${getSkillColor(effect.change)}`}
			style={{
				...foil
			}}
		>
			<div className={`absolute rounded-md ${effect.change === 'stamina' ? 'bg-black' : `bg-${getSkillColor(effect.change)}`}`} style={{ top: '6px', left: '6px', width: 'calc(100% - 12px)', height: 'calc(100% - 12px)' }} />
			<div className='w-full h-full absolute bottom-0 left-0 bg-contain bg-no-repeat bg-bottom' style={{ backgroundImage: `url('/static/images/upgrades/${upgradeId}.svg')`, ...foilSizing }} />
			<div className='absolute top-0 left-0 font-semibold w-full flex justify-between items-start rounded-t-lg text-black py-3'>
				<div className={`space-x-2 flex justify-between items-start w-full pl-4 pr-3 ${isStamina && 'text-white'}`}>
					<div className='italic text-left relative leading-tight'>{name}</div>

					<div className='flex flex-col space-y-1'>
						{[...Array(effect.value)].map((x, i) => {
							return <div key={i} className={`flex items-center p-1.5 rounded-md ${isStamina ? 'bg-white' : 'bg-black'} ${textColor} font-bold`}>
								<SkillIcon skill={effect.change} className={`w-3.5 ${isStamina && 'text-stamina-red'}`} />
							</div>
						})}
					</div>
				</div>
			</div>
			<div className='absolute bottom-0 flex items-center justify-center w-full'>
				<div className={`px-2 py-1 rounded-t-md ${isStamina ? 'bg-white' : 'bg-black'} ${textColor} font-semibold uppercase text-sm tracking-wider max-w-full`} style={{ fontSize: '0.8rem' }}>
					{isStamina ? '↑' : '+'}{effect.value} {effect.change}
				</div>
			</div>
		</div>
	</button>
}

function UpgradePool ({ handleSelect, upgrades, direction, title, instruction, handleCancel }) {
	const spring = {
		type: 'tween',
		duration: 0.7,
		ease: 'anticipate'
	}

	const variants = {
		initial: {
			x: '-100%'
		},
		animate: {
			x: '0%'
		}
	}

	// We store the list in a ref to prevent a re-render when
	// we update – it causes a layout shift before the anim finishes
	const pool = useRef(upgrades)

	return (
		<motion.div
			transition={spring}
			className='h-full max-w-md bg-black w-full text-center py-6 px-4 absolute top-0 left-0 overflow-y-scroll space-y-4'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='w-full relative capitalize text-xl font-semibold text-white'>
				{title}
				{handleCancel && <button className='z-10 bg-white h-10 w-10 flex justify-center items-center text-black rounded-full text-3xl absolute right-0 top-0 -mt-2' onClick={() => handleCancel()}>×</button>}
			</div>
			<div className='grid grid-cols-2 gap-4 w-full relative z-10'>
				{pool.current.slice().reverse().map((upgrade, i) => {
					return <Upgrade key={upgrade.id} {...upgrade} handleSelect={() => handleSelect(upgrade.id)} direction={direction} />
				})}
			</div>
		</motion.div>
	)
}

export default UpgradePool
