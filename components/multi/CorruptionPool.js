import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef } from 'react'
import { useDrag } from 'react-use-gesture'

const Token = ({ number, skill, handleEnd }) => {
	const y = useMotionValue(0)
	const rotate = useTransform(y, [-300, 0], [-20, 0])
	const ref = useRef()
	const letterId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

	useDrag(({ event, down, movement: [mx, my], direction: [xDir, yDir], velocity, tap }) => {
		event.preventDefault()
		y.stop()

		if (tap) {
			animate(y, [0, -window.innerHeight / 5, 0])
		}
		else {
			const trigger = !down && yDir === -1 && Math.abs(my) > 100

			if (trigger) {
				animate(y, window.innerHeight * -1.5, { duration: 0.5 })

				handleEnd(number)
			}
			else if (!down) {
				animate(y, 0)
			}
			else {
				y.set(my)
			}
		}
	}, { rubberband: true, bounds: { top: -window.innerHeight, left: 0 }, axis: 'y', domTarget: ref, eventOptions: { passive: false }, initial: () => [0, y.get()], filterTaps: true })

	return <motion.div
		style={{ y, rotate, scrollSnapAlign: 'center', touchAction: 'pan-x', userSelect: 'none' }}
		ref={ref}
		className='w-4/5 shrink-0 px-2'
	>
		<div className='bg-black rounded-lg relative outline-none shadow-md aspect-w-1 aspect-h-1'>
			<div
				className='bg-repeat w-full h-full absolute top-0 left-0 rounded-lg'
				style={{
					backgroundSize: '70%',
					backgroundPosition: `${number * -35}% ${number * 35}%`,
					backgroundImage: `url('/static/images/${skill}-bg-2.svg')`
				}}
			/>
			<div
				className='bg-no-repeat bg-center w-full h-full absolute top-0 left-0 rounded-lg border-4 border-black'
				style={{
					backgroundSize: '90%',
					backgroundImage: `url('/static/images/${skill}-fg.svg')`
				}}
			/>
			<div className={`text-${skill} top-0 right-0 absolute text-lg text-right pr-6 `} style={{ top: '7%', right: '12%' }}>{letterId[number]}</div>
		</div>
	</motion.div>
}

function CorruptionPool ({ currentAction, moves, playerSkill, difficulty, getSuccessRate }) {
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

	const successRate = getSuccessRate(playerSkill, difficulty)

	let location = 'Terminal'

	if (currentAction.skill === 'lockpick') {
		location = 'Locked Door'
	}
	else if (currentAction.skill === 'neutralise') {
		location = 'Cog'
	}

	let successMessage = 'Only one chip will work'

	if (successRate === 25) {
		successMessage = 'A few chips will work'
	}
	else if (successRate === 50) {
		successMessage = 'Half of the chips will work'
	}
	else if (successRate === 75) {
		successMessage = 'Most of the chips will work'
	}
	else if (successRate === 91) {
		successMessage = 'Almost all the chips will work'
	}

	return (
		<motion.div
			className='h-full max-w-md bg-white w-full text-center py-6 px-4 absolute top-0 left-0 overflow-x-scroll'
			transition={spring}
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
			style={{ scrollSnapType: 'x mandatory' }}
		>
			<div className='sticky left-0 flex flex-col space-y-8'>
				<div className='capitalize text-xl font-semibold'>
					{location}
					<button className='z-10 bg-black h-10 w-10 flex justify-center items-center text-white rounded-full text-3xl absolute right-0 top-0 -mt-2' onClick={() => moves.cancelAction()}>×</button>
				</div>
				<div className='text-txt-grey w-full px-4 text-base italic'>choose & flick up a chip</div>
			</div>
			<div className='relative flex items-center px-4 z-50' style={{ marginTop: '5vh' }}>
				{new Array(12).fill(null).map((v, i) => {
					return <Token key={i} number={i} handleEnd={(i) => moves.doAction(i)} skill={currentAction.skill} />
				})}
			</div>
			<div style={{ marginTop: '2rem' }} className='text-txt-grey text-center w-full mx-auto flex flex-col justify-center space-y-4 sticky left-0 z-10'>
				<div className='bg-black text-white flex space-x-2 justify-center items-center px-4 py-1.5 rounded-md'>
					<div>{playerSkill}</div>
					<div className={`text-${currentAction.skill}`} style={{ fontSize: '0.9em' }}>vs</div>
					<div>{difficulty}</div>
				</div>
				<p className='text-black text-left italic flex justify-center items-center'>{successMessage}</p>
			</div>
		</motion.div>
	)
}

export default CorruptionPool
