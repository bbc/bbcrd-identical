import { motion } from 'framer-motion'
import { getSkillColor } from '../game/helpers'
import SkillIcon from './SkillIcon'

function HelpNeeded ({ handleSelect, helpRequest, players, title, handleCancel }) {
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

	const { crew } = helpRequest
	const helpers = Object.keys(crew).filter((id) => crew[id].isNear && crew[id].availableUpgrades.includes(helpRequest.need))
	const thinking = helpers.filter((id) => crew[id].isHelping)
	const contributors = helpers.filter((id) => crew[id].upgrade)

	let status = 'Requesting...'

	if (contributors.length) {
		status = `Use ${contributors.length} boost${contributors.length > 1 ? 's' : ''}`
	}
	else if (thinking.length) {
		status = 'Help is on the way!'
	}

	return (
		<motion.div
			transition={spring}
			className='h-full max-w-md flex flex-col justify-between bg-black w-full text-center py-6 px-4 absolute top-0 left-0 space-y-4'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='sticky left-0 flex flex-col space-y-8'>
				<div className='capitalize text-xl font-semibold text-white'>
					{title}
					<button className='z-10 bg-white h-10 w-10 flex justify-center items-center text-black rounded-full text-3xl absolute right-0 top-0 -mt-2' onClick={() => handleCancel()}>×</button>
				</div>
			</div>
			<div className='flex flex-col space-y-8 justify-center items-center h-3/5'>
				<div className='flex items-center h-10/12 w-full relative z-10 justify-center space-x-4'>
					{Object.keys(crew).map((id, i) => {
						const p = crew[id]

						return <div key={id} className='relative'>
							<div
								className={`rounded-md bg-cover bg-center w-16 h-16 flex items-center justify-center ${!helpers.includes(id) ? 'filter-grayscale opacity-50' : `bg-${players[id].id}`} ${p.isNear && helpers.includes(id) && !p.upgrade && `animate-bounce animate-delay-${100 * i}`}`}
								style={{
									backgroundImage: `url('/static/images/players/${players[id].id}.jpg')`
								}}
							>
								{p.upgrade && <SkillIcon skill='boosts' className='w-3/5 text-white' />}
							</div>
						</div>
					})}
				</div>
				<div className={`text-${getSkillColor(helpRequest.need)}`}>
					<button onClick={handleSelect} className={`bg-${getSkillColor(helpRequest.need)} text-black px-3 py-2 rounded-md flex space-x-2 disabled:bg-txt-grey transition-colors items-center`} disabled={contributors.length === 0}>
						<SkillIcon skill={helpRequest.need} className='w-5' />
						<span>{status}</span>
					</button>
				</div>
			</div>
			<div className='text-txt-grey w-full px-4 text-base italic'>the boosts received from your crew will be applied immediately</div>
		</motion.div>
	)
}

export default HelpNeeded
