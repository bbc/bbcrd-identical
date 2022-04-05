import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { usePlaySound } from './SoundContext'
import UpgradeCard from './UpgradeCard'

function UseUpgrade ({ upgrade, rotate }) {
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
			<div className='transform rotate-12 w-full relative'>
				<UpgradeCard {...upgrade} />
			</div>
		</div>
	</motion.div>
}

export default UseUpgrade
