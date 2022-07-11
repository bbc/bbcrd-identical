import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function Scratch ({ symbol, handleReveal }) {
	const [isRevealed, setRevealed] = useState(symbol.revealed)

	useEffect(() => {
		if (isRevealed) {
			const t = setTimeout(() => {
				handleReveal()
			}, 700)

			return () => clearTimeout(t)
		}
	}, [isRevealed]) // TODO: memoize handleReveal

	return <button className={`w-1/2 transition-transform ${!isRevealed && 'hover:scale-95'} outline-none focus:outline-none`} onClick={() => setRevealed(true)}>
		<div className='relative rounded-full overflow-hidden touch-none aspect-h-1 aspect-w-1'>
			<div className='flex justify-center items-center rounded-full overflow-hidden'>
				<div className='absolute w-full h-full z-0 top-0 left-0 border-neutralise border-6 rounded-full' />
				<img src={`/static/images/encounters/${symbol.id}.svg`} alt='Encounter symbol' className='w-full' />
				<div className={`absolute z-30 bg-txt-grey w-full h-full top-0 left-0 rounded-full transition-opacity ${isRevealed && 'opacity-0'}`} />
			</div>
		</div>
	</button>
}

function Encounter ({ handleReveal, encounter }) {
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
			className='h-full max-w-md flex flex-col justify-between bg-black w-full text-center py-8 px-4 absolute top-0 left-0 touch-none'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='relative capitalize text-xl font-semibold text-neutralise'>Security System</div>

			<div className='flex flex-col space-y-8 justify-center items-center'>
				<div className='text-txt-grey w-4/5 mx-auto italic'>click to reveal if you’ve tripped the security system</div>
				<div className='flex flex-col space-y-6 justify-center items-center w-11/12'>
					<div className='flex space-x-6 justify-center items-center w-full'>
						<Scratch symbol={encounter.scratch[0]} handleReveal={() => handleReveal(0)} />
						<Scratch symbol={encounter.scratch[1]} handleReveal={() => handleReveal(1)} />
					</div>

					<div className='flex space-x-6 justify-center items-center w-full'>
						<Scratch symbol={encounter.scratch[2]} handleReveal={() => handleReveal(2)} />
						<Scratch symbol={encounter.scratch[3]} handleReveal={() => handleReveal(3)} />
					</div>
				</div>
				<div className='text-txt-grey w-4/5 mx-auto italic'>3 of a kind spells danger</div>
			</div>

			<div />
		</motion.div>
	)
}

export default Encounter
