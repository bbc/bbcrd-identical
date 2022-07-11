import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import EncounterEffects from '../game/EncounterEffects'

function Encounter ({ id, accept }) {
	const [needAction, setNeedAction] = useState(false)
	const { name, effect } = EncounterEffects.find((e) => e.id === id) || {}

	const spring = {
		type: 'tween',
		duration: 0.7,
		ease: 'anticipate'
	}

	const variants = {
		initial: {
			x: '100%'
		},
		animate: {
			x: '0%'
		}
	}

	useEffect(() => {
		const ref = setTimeout(() => {
			setNeedAction(true)
		}, 4000)

		return () => clearTimeout(ref)
	}, [])

	return (
		<motion.div
			transition={spring}
			className={`h-full max-w-md flex flex-col justify-around bg-black w-full text-center py-8 px-4 absolute top-0 left-0 ${id ? 'text-neutralise' : 'text-white'}`}
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='flex flex-col justify-center items-center space-y-8'>
				{name && <div className='w-4/5 mx-auto text-3xl'>{name}</div>}
				{id && <div className='w-2/3'><div className='rounded-full text-black aspect-w-1 aspect-h-1'>
					<div className='flex justify-center items-center border-6 border-neutralise rounded-full'>
						<img src={`/static/images/encounters/${id}.svg`} alt='Encounter symbol' className='w-full' />
					</div>
				</div></div>}
				{!id && <img src='/static/images/escape.svg' alt='man running out of a door' className='w-2/4' />}
				<div className='w-4/5 mx-auto text-xl italic'>{effect || 'Seems like you escaped the danger'}</div>
			</div>

			<button onClick={() => accept()} className={`border-2 rounded-lg px-4 py-2 w-4/5 mx-auto ${needAction && 'animate-attention'}`}>
				Continue
			</button>
		</motion.div>
	)
}

export default Encounter
