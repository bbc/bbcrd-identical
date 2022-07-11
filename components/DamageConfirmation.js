import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { getDamage, isKnockedOut } from '../game/helpers'
import SkillIcon from './SkillIcon'

function DamageConfirmation ({ accept, player }) {
	const [needAction, setNeedAction] = useState(false)

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

	const damage = getDamage(player)
	const isAttacked = damage > 0
	const isKO = isKnockedOut(player, damage)
	let title = 'You snuck past...'
	let result = 'You’re out of sight and safe for now'

	if (isKO) {
		title = 'They got me!'
		result = 'You’ve been knocked out...'
	}
	else if (isAttacked) {
		title = 'You’ve been spotted!'
		result = 'A cog was near and attacked you'
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
			className={`h-full max-w-md flex flex-col justify-around bg-black w-full text-center py-8 px-4 absolute top-0 left-0 ${isAttacked || isKO ? 'text-neutralise' : 'text-white'}`}
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='flex flex-col justify-center items-center space-y-8'>
				<div className='w-4/5 mx-auto text-3xl'>{title}</div>
				{isAttacked && !isKO && <img src='/static/images/attack.svg' alt='warning sign for explosions' className='w-2/4' />}
				{isKO && <img src='/static/images/KO.svg' alt='Punching and breaking' className='w-2/4' />}
				{!isAttacked && !isKO && <img src='/static/images/escape.svg' alt='man running out of a door' className='w-2/4' />}
				<div className='w-4/5 mx-auto text-xl italic'>{result}</div>
			</div>

			<button onClick={() => accept()} className={`border-2 rounded-lg px-4 py-2 w-4/5 mx-auto ${needAction && 'animate-attention'}`}>
				{isAttacked && !isKO && <div className='flex justify-center items-center space-x-2'><div>Continue & lose {damage}</div> <SkillIcon skill='stamina' className='text-stamina-red h-4' /></div>}
				{!isAttacked && !isKO && 'Continue'}
				{isKO && 'Wake up where you started'}
			</button>
		</motion.div>
	)
}

export default DamageConfirmation
