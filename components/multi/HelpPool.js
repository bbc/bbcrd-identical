import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { useDrag } from 'react-use-gesture'

import { getSkillColor } from '../../game/helpers'

import SkillIcon from '../SkillIcon'

const Request = ({ handleSelect, disabled, type }) => {
	const y = useMotionValue(0)
	const rotate = useTransform(y, [-300, 0], [-20, 0])
	const ref = useRef()

	useDrag(({ event, down, movement: [mx, my], direction: [xDir, yDir], velocity, tap }) => {
		event.preventDefault()

		if (!disabled) {
			y.stop()

			if (tap) {
				animate(y, [0, (window.innerHeight * -1) / 5, 0])
			}
			else {
				// TODO: should this be based on velocity rather than distance?
				const trigger = !down && yDir === -1 && Math.abs(my) > 100

				if (trigger) {
					animate(y, window.innerHeight * -1.5, { duration: 0.5 })

					handleSelect()
				}
				else if (!down) {
					animate(y, 0)
				}
				else {
					y.set(my)
				}
			}
		}
	}, { rubberband: true, bounds: { top: -window.innerHeight, left: 0 }, axis: 'y', domTarget: ref, eventOptions: { passive: false }, initial: () => [0, y.get()], filterTaps: true })

	return <motion.div
		className='w-full aspect-w-9 aspect-h-5'
		style={{
			touchAction: 'pan-x',
			userSelect: 'none',
			scrollSnapAlign: 'center',
			y,
			rotate
		}}
		ref={ref}
	>
		<div className={`w-full h-full rounded-2xl border-2 border-black flex flex-col ${disabled && 'opacity-20 filter-grayscale'}`}>
			<div className={`px-4 py-4 flex justify-center border-2 border-l-0 border-${type} absolute left-0 top-1/2 transform -translate-y-1/2 rounded-r-xl z-10`} style={{ background: '#080808' }}>
				<SkillIcon skill={type} className={`h-12 ${type === 'stamina' ? 'text-stamina-red' : `text-${getSkillColor(type)}`}`} />
			</div>
			<div className={`bg-black absolute z-0 rounded-2xl w-full h-full top-0 left-0 border-2 border-${type}`} style={{ backgroundImage: `url('/static/images/${type}-circuit.svg')`, backgroundSize: '60%' }} />
			<div className={`bg-${getSkillColor(type)} absolute right-0 top-5 translate-x-full rounded-r-md w-4 h-1/3 border-2 border-black`} />
			<div className={`bg-${getSkillColor(type)} absolute right-4 bottom-0 translate-y-full rounded-b-md w-10 h-3.5 border-2 border-black`} />
			<div className={`bg-${getSkillColor(type)} absolute right-16 bottom-0 translate-y-full rounded-b-md w-10 h-3.5 border-2 border-black`} />
		</div>
	</motion.div>
}

function HelpPool ({ handleSelect, helpRequest, players, title, instruction, handleCancel }) {
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

	const { crew } = helpRequest
	const helpTypes = ['hack', 'lockpick', 'neutralise', 'stamina', 'actions']
	const typeList = helpTypes.map((type) => {
		const helpers = Object.keys(crew).filter((id) => crew[id].isNear && crew[id].availableUpgrades.includes(type))

		return {
			type,
			helpers
		}
	}).sort((a, b) => a.helpers.length - b.helpers.length).reverse()

	const scroller = useRef()
	const [currentFocus, setFocus] = useState(0)
	const currentType = typeList[currentFocus]

	const handleScroll = useCallback(() => {
		const index = Math.round((scroller.current.scrollLeft / scroller.current.scrollWidth) * typeList.length)
		setFocus(index)
	}, [typeList.length])

	return (
		<motion.div
			transition={spring}
			className='h-full max-w-md flex flex-col bg-black w-full text-center py-6 px-4 absolute top-0 left-0 overflow-x-scroll space-y-4'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
			style={{ scrollSnapType: 'x mandatory' }}
			ref={scroller}
			onScroll={handleScroll}
		>
			<div className='w-full sticky left-0 space-y-8'>
				<div className='capitalize text-xl font-semibold text-white'>
					{title}
					{handleCancel && <button className='z-10 bg-white h-10 w-10 flex justify-center items-center text-black rounded-full text-3xl absolute right-0 top-0 -mt-2' onClick={() => handleCancel()}>×</button>}
				</div>
				<div className='text-txt-grey italic sticky left-0 w-full px-2'>{instruction}</div>
			</div>

			<div className='flex items-center h-1/3 w-full relative z-20' style={{ marginTop: '6vh' }}>
				{typeList.map(({ type, helpers }) => {
					return <div key={type} className='w-10/12 px-3 shrink-0 mx-auto'>
						<Request type={type} disabled={helpers.length === 0} {...helpRequest} handleSelect={() => handleSelect(type)} />
					</div>
				})}
			</div>

			<div className='sticky left-0 space-y-4 h-1/3' style={{ marginTop: '6vh' }}>
				<h2 className={`uppercase tracking-widest text-white font-semibold text-lg text-${currentType.type}`}>{currentType.type}</h2>
				<div className='flex space-x-4 justify-center bg-black px-4 rounded-lg w-full'>
					{Object.keys(crew).map((id, i) => {
						const helpers = currentType.helpers

						return <div
							key={id}
							className={`rounded-md bg-cover bg-center w-16 h-16 transition-all ${!helpers.includes(id) ? 'filter-grayscale opacity-50' : `bg-${players[id].id}`}`}
							style={{
								backgroundImage: `url('/static/images/players/${players[id].id}.jpg')`
							}}
						/>
					})}
				</div>

				<div className={`text-lg text-center ${currentType.helpers.length === 0 ? `text-${getSkillColor(currentType.type)}` : 'text-txt-grey italic'}`}>
					{currentType.helpers.length === 0 ? 'Nobody can help you' : `${currentType.helpers.length} crewmate${currentType.helpers.length > 1 ? 's' : ''} can help`}
				</div>
			</div>
		</motion.div>
	)
}

export default HelpPool
