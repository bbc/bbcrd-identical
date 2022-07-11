import { motion } from 'framer-motion'

import { getSkillColor } from '../../game/helpers'

import SkillIcon from '../SkillIcon'

const Request = ({ handleSelect, disabled, crew, players, helpers, type }) => {
	return <button className='w-full aspect-w-9 aspect-h-5 transition-transform hover:scale-95' onClick={handleSelect}>
		<div className={`w-full flex items-center justify-center h-full rounded-2xl border-2 border-black flex-col ${disabled && 'opacity-20 filter-grayscale'}`}>
			<div className={`px-4 py-4 flex justify-center border-2 border-l-0 border-${type} absolute left-0 top-1/2 -translate-y-1/2 rounded-r-xl z-10`} style={{ background: '#080808' }}>
				<SkillIcon skill={type} className={`h-6 ${type === 'stamina' ? 'text-stamina-red' : `text-white text-${type}`}`} />
			</div>
			<div className={`bg-black absolute z-0 rounded-2xl w-full h-full top-0 left-0 border-2 border-${type}`} style={{ backgroundImage: `url('/static/images/${type}-circuit.svg')`, backgroundSize: '60%' }} />
			<div className={`bg-${getSkillColor(type)} absolute right-0 top-5 translate-x-full rounded-r-md w-4 h-1/3 border-2 border-black`} />
			<div className={`bg-${getSkillColor(type)} absolute right-4 bottom-0 translate-y-full rounded-b-md w-10 h-3.5 border-2 border-black`} />
			<div className={`bg-${getSkillColor(type)} absolute right-16 bottom-0 translate-y-full rounded-b-md w-10 h-3.5 border-2 border-black`} />

			<div className={`bg-black text-white text-${type} w-4/6 ml-12 h-3/4 border-2 rounded-lg flex items-center flex-col justify-center space-y-2 pt-4 z-10`}>
				<div className='w-full flex space-x-2 justify-center'>
					{Object.keys(crew).map((id, i) => {
						const p = crew[id]

						return <div key={id} className='relative'>
							<div
								className={`rounded-md bg-cover bg-center w-12 h-12 flex items-center justify-center ${!helpers.includes(id) ? 'filter-grayscale opacity-50' : `bg-${players[id].id}`}`}
								style={{
									backgroundImage: `url('/static/images/players/${players[id].id}.jpg')`
								}}
							>
								{p.upgrade && <SkillIcon skill='boosts' className='w-3/5 text-white' />}
							</div>
						</div>
					})}
				</div>
				<div className='uppercase tracking-widest text-sm'>{type}</div>
			</div>
		</div>
	</button>
}

function HelpPool ({ handleSelect, helpRequest, players, title, instruction, handleCancel }) {
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

	const { crew } = helpRequest
	const helpTypes = ['hack', 'lockpick', 'neutralise', 'stamina', 'actions']
	const typeList = helpTypes.map((type) => {
		const helpers = Object.keys(crew).filter((id) => crew[id].isNear && crew[id].availableUpgrades.includes(type))

		return {
			type,
			helpers
		}
	}).sort((a, b) => a.helpers.length - b.helpers.length).reverse()

	return (
		<motion.div
			transition={spring}
			className='h-full max-w-md bg-black w-full text-center py-6 px-4 absolute top-0 left-0 overflow-y-scroll space-y-4'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='w-full space-y-8'>
				<div className='capitalize text-xl font-semibold text-white relative'>
					{title}
					{handleCancel && <button className='z-10 bg-white h-10 w-10 flex justify-center items-center text-black rounded-full text-3xl absolute right-0 top-0 -mt-2' onClick={() => handleCancel()}>×</button>}
				</div>
			</div>

			<div className='flex flex-col items-center w-full relative z-20 space-y-4 pb-16'>
				{typeList.map(({ type, helpers }) => {
					return <div key={type} className='w-10/12 shrink-0 mx-auto'>
						<Request type={type} helpers={helpers} players={players} crew={crew} disabled={helpers.length === 0} {...helpRequest} handleSelect={() => handleSelect(type)} />
					</div>
				})}
			</div>
		</motion.div>
	)
}

export default HelpPool
