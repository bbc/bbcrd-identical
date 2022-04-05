import SkillIcon from './SkillIcon'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { isString } from 'lodash'
import { getCurrent } from '../game/helpers'
import { usePlaySound } from './SoundContext'

function CorruptionRoll ({ player, skill, difficulty, corruption, isSuccess }) {
	const ctrl = useAnimation()
	const ctrlLine = useAnimation()
	const ctrlDoor = useAnimation()
	const ctrlCover = useAnimation()
	const playSound = usePlaySound()

	const [isHalfway, setHalfway] = useState(false)

	const getUpdatedSkill = () => {
		if (isString(corruption)) {
			return <span className='inline-flex items-center'>
				<span className='text-2xl'>{isSuccess ? '+' : '-'}</span>
				<span className='text-3xl'>∞</span>
			</span>
		}
		else {
			return getCurrent(player, skill) + corruption
		}
	}

	const getCircuitName = () => {
		if (isString(corruption)) {
			return <span className='inline-flex items-center'>
				<span>{isSuccess ? '+' : '-'}</span>
				<span style={{ fontSize: '1.5em' }}>∞</span>
			</span>
		}
		else if (corruption >= 0) {
			return `+${corruption}`
		}
		else {
			return corruption
		}
	}

	const variants = {
		initial: {
			y: '100%',
			scale: 2,
			rotate: 90
		},
		exit: {
			opacity: 0,
			transition: {
				duration: 1
			}
		}
	}

	useEffect(() => {
		const anim = async () => {
			playSound('roll')

			await ctrl.start({
				y: '0%',
				scale: 1,
				rotate: 0,
				transition: {
					type: 'tween',
					ease: 'anticipate',
					duration: 2
				}
			})

			await ctrlCover.start({
				y: '-100%',
				transition: {
					type: 'tween',
					ease: 'anticipate',
					duration: 1
				}
			})

			await ctrlLine.start({
				pathLength: 0.5,
				transition: { duration: 0.75 }
			})

			setHalfway(true)

			await ctrlLine.start({
				pathLength: 1,
				transition: { duration: 0.75 }
			})

			if (!isSuccess) {
				playSound('fail')

				ctrl.start({
					x: [-10, 10, -10, 10, -10, 10, -10, 10],
					rotate: [null, -2, 2, -5, 5, 0]
				})
			}
			else {
				playSound(`success-${skill}`)

				ctrl.start({
					scale: [null, 1.1, 0.9, 1.1, 1]
				})
			}

			await ctrlDoor.start({
				y: '-100%',
				transition: {
					type: 'tween',
					ease: 'anticipate',
					duration: 1
				}
			})
		}

		anim()
	}, [ctrl, ctrlLine, ctrlDoor, isSuccess, playSound, skill, ctrlCover])

	return <motion.div
		className='absolute top-0 left-0 w-full h-full flex justify-center items-center z-50'
		variants={variants}
		initial='initial'
		exit='exit'
		animate={ctrl}
	>
		<div className={`relative overflow-hidden bg-black text-${skill} border-4 rounded-lg rotate-12 transform`} style={{ width: '35vmin', height: '35vmin' }}>
			<svg className='w-full h-full' viewBox='0 0 271 271' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<motion.path
					d='M45 92V40H229V136H136V213'
					className='stroke-current'
					strokeWidth='4'
					strokeDasharray='0 1'
					animate={ctrlLine}
					initial={{
						pathLength: 0
					}}
				/>
			</svg>

			<div className={`absolute top-0 w-1/3 text-center text-3xl font-bold uppercase tracking-wide px-2 py-4 text-black bg-${skill} left-1/2 transform -translate-x-1/2 rounded-b-lg`}>
				{getCircuitName()}
			</div>
			<div className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-${player.id} rounded-lg flex flex-col space-y-1 p-1`}>
				<div className='w-12 h-12 bg-cover overflow-hidden rounded-md' style={{ backgroundImage: `url('/static/images/players/${player.id}.jpg')` }} />
				<div className='h-10 text-2xl flex justify-center items-center bg-black rounded-md'>{isHalfway ? getUpdatedSkill() : getCurrent(player, skill)}</div>
			</div>
			<div className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-${skill} rounded-lg flex flex-col space-y-1 p-1`}>
				<div className='w-12 h-12 flex justify-center items-center text-black'>
					<SkillIcon skill={skill} className='w-8 h-8' />
				</div>
				<div className='h-10 text-2xl flex justify-center items-center bg-black rounded-md'>{difficulty}</div>
			</div>
			<div className='absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 border-4 rounded-full overflow-hidden flex justify-center items-start' style={{ width: '15vmin', height: '15vmin' }}>
				{
					isSuccess
						? <svg className='w-2/5 mt-3' viewBox='-5 -5 40 30' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M0.576828 10.1923L11.4906 21.5205L31.3839 0.729248' className='stroke-current' strokeWidth='3' />
						</svg>
						: <svg className='w-1/4 mt-4' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M19 1L1 19.5' className='stroke-current' strokeWidth='3' />
							<path d='M19.5 19.25L1 1.25' className='stroke-current' strokeWidth='3' />
						</svg>

				}
				<motion.div
					className='w-full h-full bg-cover absolute z-10 left-0 top-0 bg-black'
					style={{ backgroundImage: `url('/static/images/${skill}-bg-2.svg')` }}
					animate={ctrlDoor}
				/>
			</div>

			<motion.div
				className='bg-repeat bg-center bg-black w-full h-full absolute top-0 left-0 rounded-lg flex justify-center items-center'
				animate={ctrlCover}
				style={{
					backgroundSize: '70%',
					backgroundImage: `url('/static/images/${skill}-bg-2.svg')`
				}}>
				<div className='bg-black rounded-xl border-2 border-hack text-center font-semibold flex justify-center items-center' style={{ width: '12vmin', height: '12vmin', fontSize: '5vmin' }}>{getCircuitName()}</div>
			</motion.div>
		</div>
	</motion.div>
}

export default CorruptionRoll
