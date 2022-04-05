import { motion } from 'framer-motion'
import UpgradeCard from '../UpgradeCard'

const CommsChoice = ({ handleSelect, status, upgrade }) => {
	return <button className='relative w-full transition-transform hover:scale-95' onClick={() => handleSelect(status)}>
		{upgrade && <div className='absolute left-0 -bottom-6 w-full rotate-90 scale-90'>
			<UpgradeCard noTitle {...upgrade} />
		</div>}
		<div className='w-full aspect-w-9 aspect-h-7 shadow-md'>
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
		</div>
	</button>
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
			className='h-full max-w-md flex flex-col justify-between bg-black w-full text-center py-6 px-4 absolute top-0 left-0 overflow-y-scroll space-y-4'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='w-full text-white flex flex-col space-y-4'>
				<h2 className='capitalize text-xl font-semibold'>Allow Strategy Talk?</h2>
			</div>
			<div className='text-white italic w-full px-2'>
				If you choose no strategy talk, you will get a boost
			</div>
			<div className='flex flex-col h-full items-center w-full relative space-y-4'>
				<div className='w-4/5 px-2 shrink-0'>
					<CommsChoice status='on' handleSelect={handleSelect} />
				</div>
				<div className='w-4/5 px-2 shrink-0' style={{ marginTop: '30%' }}>
					<CommsChoice status='off' handleSelect={handleSelect} upgrade={comms.upgrade} />
				</div>
			</div>
		</motion.div>
	)
}

export default CommsPool
