import { motion } from 'framer-motion'
import QRCode from 'qrcode.react'
import { useState } from 'react'
import GlitchCanvas from '../GlitchCanvas'
import SkillIcon from '../SkillIcon'
import { usePlaySound } from '../SoundContext'

function SetupScreen ({ players, matchID }) {
	const url = `http://${window ? window.location.hostname : 'example.com'}/join/${matchID}`
	const [hasStarted, setStarted] = useState(false)
	const playSound = usePlaySound()

	const handleReady = () => {
		setStarted(true)
		playSound('crew')
	}

	return <motion.div className='w-full h-screen overflow-hidden flex justify-center items-center bg-black z-50 absolute left-0 top-0 text-white' exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 1 }}>
		<GlitchCanvas />
		{hasStarted && <div className='text-white w-10/12 flex flex-col justify-center items-center space-y-8 mx-auto h-full -my-8 z-10'>
			<div className='flex justify-center items-baseline space-x-8'>
				<h1 className='text-5xl uppercase text-neutralise tracking-loose font-semibold'>Identical</h1>
				<p className='text-xl italic'>Waiting for players</p>
			</div>
			<div className='flex w-full'>
				<div className='bg-black py-8 px-10 rounded-l-md w-full flex justify-center items-center'>
					<div className='flex space-x-4 justify-start items-start w-full'>
						{Object.keys(players).map((p) => {
							const player = players[p]

							return <div className='w-full space-y-2' key={p}>
								<div className='relative w-full flex flex-col items-center'>
									<div className='w-full aspect-w-1 aspect-h-1 bg-map-black flex items-center justify-center bg-cover rounded-md' style={{ backgroundImage: `url('/static/images/players/${player.id}.jpg')` }}>
										{!player.ready && <div className='w-full h-full flex justify-center items-center text-5xl bg-black bg-opacity-30'>?</div>}
									</div>

									{player.id && <div className='flex justify-center items-center w-auto flex-wrap space-x-2 px-2 py-1.5 rounded-md bottom-2 absolute bg-black'>
										{['hack', 'lockpick', 'neutralise'].map((skill) => {
											return <div
												key={skill}
												className={`bg-black rounded-md text-lg flex items-center space-x-1 text-${skill} border-2 px-1.5 ${!player.ready && 'opacity-75'}`}
											>
												<div>{player.id ? player.skills[skill] : '?'}</div>
												<SkillIcon skill={skill} className='w-3' />
											</div>
										})}
									</div>}
								</div>

								<div className='text-center flex justify-center items-center space-x-4'>
									{player.nickname ? <><div>{player.nickname}</div> {player.ready && <div className={`bg-${player.id} text-black px-2 py-1 uppercase text-sm tracking-wide rounded-md`}>Ready</div>}</> : 'Waiting...'}
								</div>
							</div>
						})}

						<div className='w-full flex flex-col space-y-2'>
							<div className='aspect-w-1 aspect-h-1 flex items-center justify-center rounded-md bg-neutralise'>
								<QRCode size={200} value={url} bgColor='transparent' renderAs='svg' className='w-[90%] h-[90%] absolute top-[5%] left-[5%]' />
							</div>
							<h3 className='tracking-wider uppercase text-center'>Connect</h3>
						</div>
					</div>
				</div>
			</div>
		</div>}
		{!hasStarted && <div className='bg-black shadow-lg text-white flex flex-col justify-center items-center space-y-8 mx-auto -my-8 z-10 p-8'>
			<h1 className='uppercase text-xl tracking-widest text-neutralise'>Connecting another device</h1>
			<p className='max-w-xl'>To play Identical you will need another device. The device you're seeing this page on will act as the board and you need one per physical space where you're playing. Each player needs a mobile device which will act as their controller, from which they can dispatch actions and communicate with other players.</p>
			<button className='border-2 px-4 py-2 rounded-md' onClick={handleReady}>We’re ready!</button>
		</div>}
	</motion.div>
}

export default SetupScreen
