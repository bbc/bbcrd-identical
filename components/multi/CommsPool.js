import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useRef } from 'react'
import { useDrag } from 'react-use-gesture'
import UpgradeCard from '../UpgradeCard'

const CommsChoice = ({ handleSelect, status, upgrade }) => {
	const y = useMotionValue(0)
	const rotate = useTransform(y, [-300, 0], [-20, 0])
	const yUpgrade = useMotionValue(0)
	const rotateUpgrade = useTransform(yUpgrade, [300, 0], [20, 0])
	const ref = useRef()

	useDrag(({ event, down, movement: [mx, my], direction: [xDir, yDir], velocity, tap }) => {
		event.preventDefault()
		y.stop()

		if (tap) {
			animate(y, [0, (window.innerHeight * -1) / 5, 0])
		}
		else {
			// TODO: should this be based on velocity rather than distance?
			const trigger = !down && yDir === -1 && Math.abs(my) > 100

			if (trigger) {
				animate(y, window.innerHeight * 1.5 * -1, { duration: 0.5 })
				animate(yUpgrade, window.innerHeight * 1.5, { duration: 0.5 })

				handleSelect(status)
			}
			else if (!down) {
				animate(y, 0)
				animate(yUpgrade, 0)
			}
			else {
				y.set(my)

				if (my < 0) {
					yUpgrade.set(my * -1)
				}
			}
		}
	}, { rubberband: true, bounds: { top: -window.innerHeight, left: 0 }, axis: 'y', domTarget: ref, eventOptions: { passive: false }, initial: () => [0, y.get()], filterTaps: true })

	return <div className='relative'>
		{upgrade && <motion.div className='absolute left-0 w-full' style={{ top: '-42%', y: yUpgrade, rotate: rotateUpgrade, scale: 0.9 }}>
			<UpgradeCard {...upgrade} />
		</motion.div>}
		<motion.div
			className='w-full aspect-w-8 aspect-h-7 shadow-md'
			style={{
				touchAction: 'pan-x',
				userSelect: 'none',
				scrollSnapAlign: 'center',
				y,
				rotate
			}}
			ref={ref}
		>
			<div className={`rounded-lg ${status === 'on' ? 'bg-white border-map-black' : 'bg-black border-white'} border-4 flex justify-center items-center bg-center bg-cover`} style={{ backgroundImage: 'url("/static/images/comms.svg")' }}>
				<div className='w-1/2 -mt-6'>
					<div className='aspect-w-1 aspect-h-1 w-full'>
						<div className={`w-full h-full flex justify-center items-center ${status === 'off' ? 'bg-white' : 'bg-black'} rounded-full border-2 border-map-black`}>
							<img className='w-2/5 block' src={`/static/images/comms-${status}-v2${status === 'on' ? '-white' : ''}.svg`} alt={`Comms ${status}`} />
						</div>
					</div>
				</div>
				<div className='absolute left-0 bottom-0 w-full flex items-center justify-center'>
					<div className={`${status === 'on' ? 'bg-map-black text-white' : 'bg-white text-black'} rounded-t-md px-4 py-1 text-xl font-semibold italic`}>{status === 'off' ? 'No' : ''} Strategy Talk</div>
				</div>
			</div>
		</motion.div>
	</div>
}

function CommsPool ({ handleSelect, comms }) {
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
			<div className='w-full text-white sticky left-0 flex flex-col space-y-4'>
				<h2 className='capitalize text-xl font-semibold'>Allow Strategy Talk?</h2>
				<div className='text-txt-grey w-full px-4 text-base italic'>flick up to choose</div>
			</div>
			<div className='flex items-center h-10/12 w-full relative z-10'>
				<div className='w-4/5 px-2 shrink-0 mx-auto'>
					<CommsChoice status='on' handleSelect={handleSelect} />
				</div>
				<div className='w-4/5 px-2 shrink-0 mx-auto'>
					<CommsChoice status='off' handleSelect={handleSelect} upgrade={comms.upgrade} />
				</div>
			</div>
			<div className='text-white italic sticky left-0 w-full px-2'>
				If you choose no strategy talk, you will get a boost
			</div>
		</motion.div>
	)
}

export default CommsPool
