import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef } from 'react'
import { useDrag } from 'react-use-gesture'

import { getSkillColor, isSkill } from '../../game/helpers'

import SkillIcon from '../SkillIcon'

const Upgrade = ({ handleSelect, direction = 1, upgradeId, effect, name }) => {
	const y = useMotionValue(0)
	const rotate = useTransform(y, [-300 * direction, 0], [-20 * direction, 0])
	const ref = useRef()

	const foil = {
		backgroundImage: "url('/static/images/upgrades/foil.png')",
		backgroundSize: 'cover'
	}

	const foilSizing = {
		top: '6px',
		left: '6px',
		width: 'calc(100% - 12px)',
		height: 'calc(100% - 12px)'
	}

	useDrag(({ event, down, movement: [mx, my], direction: [xDir, yDir], velocity, tap }) => {
		event.preventDefault()
		y.stop()

		if (tap) {
			animate(y, [0, (window.innerHeight * (direction * -1)) / 5, 0])
		}
		else {
			// TODO: should this be based on velocity rather than distance?
			const trigger = !down && yDir === direction * -1 && Math.abs(my) > 100

			if (trigger) {
				animate(y, window.innerHeight * 1.5 * (direction * -1), { duration: 0.5 })

				handleSelect()
			}
			else if (!down) {
				animate(y, 0)
			}
			else {
				y.set(my)
			}
		}
	}, { rubberband: true, bounds: { top: -window.innerHeight, left: 0 }, axis: 'y', domTarget: ref, eventOptions: { passive: false }, initial: () => [0, y.get()], filterTaps: true })

	const isStamina = effect.change === 'stamina'
	let textColor = 'text-white'

	if (isStamina) {
		textColor = 'text-black'
	}
	else if (isSkill(effect.change)) {
		textColor = `text-${effect.change}`
	}

	return <motion.div
		className='w-full aspect-w-7 aspect-h-10'
		style={{
			touchAction: 'pan-x',
			userSelect: 'none',
			scrollSnapAlign: 'center',
			y,
			rotate
		}}
		ref={ref}
	>
		<div
			className={`rounded-lg bg-${getSkillColor(effect.change)}`}
			style={{
				...foil
			}}
		>
			<div className={`absolute rounded-md ${effect.change === 'stamina' ? 'bg-black' : `bg-${getSkillColor(effect.change)}`}`} style={{ top: '6px', left: '6px', width: 'calc(100% - 12px)', height: 'calc(100% - 12px)' }} />
			<div className='w-full h-full absolute bottom-0 left-0 bg-contain bg-no-repeat bg-bottom' style={{ backgroundImage: `url('/static/images/upgrades/${upgradeId}.svg')`, ...foilSizing }} />
			<div className='absolute top-0 left-0 text-xl font-semibold w-full flex justify-between items-start rounded-t-lg text-black py-3'>
				<div className={`space-x-2 flex justify-between items-center w-full pl-4 pr-3 ${isStamina && 'text-white'}`}>
					<div className='italic text-left relative leading-tight'>{name}</div>

					<div className='flex space-x-1'>
						{[...Array(effect.value)].map((x, i) => {
							return <div key={i} className={`flex items-center p-1.5 rounded-md ${isStamina ? 'bg-white' : 'bg-black'} ${textColor} font-bold`}>
								<SkillIcon skill={effect.change} className={`w-5 ${isStamina && 'text-stamina-red'}`} />
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
	</motion.div>
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
			className='h-full max-w-md flex flex-col justify-between bg-black w-full text-center py-6 px-4 absolute top-0 left-0 overflow-x-scroll space-y-4'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
			style={{ scrollSnapType: 'x mandatory' }}
		>
			<div className='w-full capitalize text-xl font-semibold text-white sticky left-0'>
				{title}
				{handleCancel && <button className='z-10 bg-white h-10 w-10 flex justify-center items-center text-black rounded-full text-3xl absolute right-0 top-0 -mt-2' onClick={() => handleCancel()}>×</button>}
			</div>
			<div className='flex items-center h-10/12 w-full relative z-10'>
				{pool.current.slice().reverse().map((upgrade, i) => {
					return <div key={upgrade.id} className='w-4/5 px-2 shrink-0 mx-auto'><Upgrade {...upgrade} handleSelect={() => handleSelect(upgrade.id)} direction={direction} /></div>
				})}
			</div>
			<div className='text-txt-grey italic sticky left-0 w-full px-2'>{instruction}</div>
		</motion.div>
	)
}

export default UpgradePool
