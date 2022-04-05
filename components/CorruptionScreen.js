import { AnimatePresence, motion } from 'framer-motion'
import GlitchCanvas from './GlitchCanvas'
import Story from '../game/story'

function Confirmation ({ chapter, progress }) {
	const spring = {
		type: 'tween',
		duration: 0.7,
		ease: 'anticipate'
	}

	const variants = {
		initial: {
			y: '-100%',
			opacity: 0
		},
		animate: {
			y: '0%',
			opacity: 1
		}
	}

	const delta = chapter.threshold - progress
	let msg = 'The crew has to work together to complete the objective before the corruption reaches the end'

	if (delta < 4 && delta > 2) {
		msg = 'The corruption is unstoppable. Focus on the objective.'
	}

	if (delta <= 2) {
		msg = 'Next round the corruption will complete. Get ready.'
	}

	return <motion.div
		className='text-neutralise absolute flex items-center justify-center w-full'
		variants={variants}
		transition={spring}
		initial='initial'
		animate='animate'
		exit='initial'
	>
		<div className='flex items-center justify-center space-x-4 max-w-xl -mt-8'>
			<div className='space-y-1'>
				<h2 className='text-3xl font-bold flex space-x-2 items-center'>
					<div className='relative text-neutralise rounded-md flex justify-center items-center w-24 h-24 text-4xl shrink-0'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 23' className='w-3/4'><path d='M18.9 5.7a9.3 9.3 0 012.2 5.8l-.9-.9a.8.8 0 10-1.2 1.2l2.4 2.4a.8.8 0 001.2 0l2.4-2.4a.8.8 0 000-1.2.8.8 0 00-1.2 0l-1 1a11 11 0 10-1.6 6 .9.9 0 00-.3-1.1.8.8 0 00-1.2.2 9.3 9.3 0 11-.8-11z' className='fill-current' /></svg>
						<div className='absolute w-full h-full top-0 left-0 flex items-center justify-center font-semibold'>!</div>
					</div>
					<span>
						Warning!<br />
						Corruption advancing
					</span>
				</h2>
				<div className='flex space-x-1 pt-4'>
					{[...Array(chapter.threshold)].map((v, i) => {
						return <div key={i} className={`w-full h-3 ${i === 0 && 'rounded-l-full'} ${i === chapter.threshold - 1 && 'rounded-r-full'} transition-colors ${i < progress ? 'bg-neutralise' : 'bg-middle-grey'} ${i + 1 === progress + 1 && 'animate-pulse'}`} />
					})}
				</div>

				<p className='text-xl pt-4 text-white'>
					{msg}
				</p>
			</div>
		</div>
	</motion.div>
}

function CorruptionScreen ({ part, currentChapter, progress }) {
	const chapter = Story[part].corruption[currentChapter]

	return <motion.div className='w-full h-screen overflow-hidden flex justify-center items-center bg-black z-50 absolute left-0 top-0' exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
		<GlitchCanvas color='#6b5300' />
		<AnimatePresence>
			<Confirmation chapter={chapter} progress={progress} />
		</AnimatePresence>
	</motion.div>
}

export default CorruptionScreen
