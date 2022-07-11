import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { usePlaySound } from './SoundContext'

function UseComms ({ status, rotate }) {
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
			playSound('upgrade')

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

	return <motion.div
		className='absolute top-0 left-0 w-full h-full flex justify-center items-center z-40'
		variants={variants}
		initial='initial'
		exit='exit'
		animate={ctrl}
	>
		<div className='h-full w-1/5 relative flex justify-center items-center'>
			<div className='w-full aspect-w-8 aspect-h-7 rotate-12'>
				<div className={`w-full h-full rounded-lg ${status === 'on' ? 'bg-white border-black' : 'bg-black border-white'} border-4 flex justify-center items-center bg-center bg-cover`} style={{ backgroundImage: 'url("/static/images/comms.svg")' }}>
					<div className='w-1/2 -mt-6'>
						<div className='aspect-w-1 aspect-h-1 w-full'>
							<div className={`w-full h-full flex justify-center items-center ${status === 'off' ? 'bg-white' : 'bg-black'} rounded-full border-2 border-black`}>
								<img className='w-2/5 block' src={`/static/images/comms-${status}-v2${status === 'on' ? '-white' : ''}.svg`} alt={`Microphone ${status}`} />
							</div>
						</div>
					</div>
					<div className='absolute left-0 bottom-0 w-full flex items-center justify-center'>
						<div className={`${status === 'on' ? 'bg-black text-white' : 'bg-white text-black'} rounded-t-md px-4 py-1 text-xl font-semibold italic`}>{status === 'off' ? 'No' : ''} Strategy Talk</div>
					</div>
				</div>
			</div>
		</div>
	</motion.div>
}

export default UseComms
