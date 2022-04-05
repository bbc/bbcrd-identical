import { motion } from 'framer-motion'

function BlockScreen () {
	const spring = {
		type: 'tween',
		duration: 0.7,
		ease: 'anticipate'
	}

	const variants = {
		initial: {
			y: '100%'
		},
		animate: {
			y: '0%'
		}
	}

	return (
		<motion.div
			transition={spring}
			className='h-full max-w-md flex flex-col justify-around bg-white bg-opacity-80 backdrop-filter-glass w-full py-8 px-4 absolute top-0 left-0 z-50'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='flex flex-col justify-between items-center z-10 h-full'>
				<img alt='arrow up' className='w-16 animate-bounce' src='/static/images/arrow-up.svg' />
				<div className='flex justify-center items-center -mt-16 w-full'>
					<img alt='big screen' className='w-8/12' src='/static/images/big-screen.svg' />
					<h1 className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl italic font-semibold text-center'>Something’s happening!</h1>
				</div>
				<div />
			</div>
		</motion.div>
	)
}

export default BlockScreen
