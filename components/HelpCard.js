import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { getSkillColor } from '../game/helpers'
import SkillIcon from './SkillIcon'
import { usePlaySound } from './SoundContext'

function HelpCard ({ need, crew, players }) {
	const rotate = 5

	const variants = {
		initial: {
			y: '125%',
			scale: 2,
			rotate: 180
		},
		exit: {
			opacity: 0,
			transition: {
				duration: 1
			}
		}
	}

	const ctrl = useAnimation()
	const playSound = usePlaySound()

	useEffect(() => {
		const anim = async () => {
			playSound('request')

			await ctrl.start({
				y: '0%',
				scale: 1,
				rotate,
				transition: {
					type: 'tween',
					ease: 'anticipate',
					duration: 2
				}
			})
		}

		anim()
	}, [ctrl, playSound, rotate])

	const helpers = Object.keys(crew).filter((id) => crew[id].isNear && crew[id].availableUpgrades.includes(need))
	const skillColor = getSkillColor(need)

	return <motion.div
		className='absolute top-0 left-0 w-full h-full flex justify-center items-center z-50'
		variants={variants}
		initial='initial'
		exit='exit'
		animate={ctrl}
	>
		<div className='h-full w-1/4 relative flex justify-center items-center'>
			<div className='w-full aspect-w-9 aspect-h-5 shadow-md'>
				<div className={`w-full h-full rounded-2xl border-2 border-black bg-${skillColor} flex items-center`}>
					<div className={`flex justify-center items-center px-3 py-1 bg-black text-${skillColor} border-2 border-l-0 rounded-r-xl h-1/3 z-10`}>
						<SkillIcon skill={need} className={`h-2/3 ${need === 'stamina' ? 'text-stamina-red' : `text-${skillColor}`}`} />
					</div>

					<div className={`bg-black text-${skillColor} w-full mx-8 h-3/4 border-2 rounded-lg flex items-center flex-col justify-center space-y-2 pt-4 z-10`}>
						<div className='w-full flex space-x-2 justify-center'>
							{Object.keys(crew).map((id, i) => {
								const p = crew[id]

								return <div key={id} className='relative'>
									<div
										className={`rounded-md bg-cover bg-center w-12 h-12 flex items-center justify-center ${!helpers.includes(id) ? 'filter-grayscale opacity-50' : `bg-${players[id].id}`} ${p.isNear && helpers.includes(id) && !p.upgrade && `animate-bounce animate-delay-${100 * i}`}`}
										style={{
											backgroundImage: `url('/static/images/players/${players[id].id}.jpg')`
										}}
									>
										{p.upgrade && <SkillIcon skill='boosts' className='w-3/5 text-white' />}
									</div>
								</div>
							})}
						</div>
						<div className='uppercase tracking-widest text-sm'>Boost Request</div>
					</div>

					<div className={`bg-black absolute z-0 rounded-2xl w-full h-full top-0 left-0 border-2 border-${need}`} style={{ backgroundImage: `url('/static/images/${need}-circuit.svg')`, backgroundSize: '60%' }} />
					<div className={`bg-${skillColor} absolute right-0 top-5 transform translate-x-full rounded-r-md w-4 h-1/3 shadow-md border-2 border-black`} />
					<div className={`bg-${skillColor} absolute right-4 bottom-0 transform translate-y-full rounded-b-md w-10 h-3.5 shadow-md border-2 border-black`} />
					<div className={`bg-${skillColor} absolute right-16 bottom-0 transform translate-y-full rounded-b-md w-10 h-3.5 shadow-md border-2 border-black`} />
				</div>
			</div>
		</div>
	</motion.div>
}

export default HelpCard
