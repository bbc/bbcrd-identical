import { motion } from 'framer-motion'
import Rules from '../Rules'
import SkillIcon from '../SkillIcon'

function SetupScreen ({ players, playerID }) {
	if (players[playerID].needRules) {
		return <motion.div className='w-full h-screen overflow-y-scroll bg-black z-50 absolute left-0 top-0 text-white' exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 1 }}>
			<Rules isSingle />
		</motion.div>
	}
	else {
		return <motion.div className='w-full h-screen overflow-hidden bg-map-black z-50 absolute left-0 top-0 text-white flex' exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 1 }}>
			<div className='space-y-8 w-full'>
				<h1 className='text-lg italic p-8 pb-0'>Setting up the crew</h1>
				<div className={`w-full h-5/6 grid grid-cols-${Object.keys(players).length} grid-rows-2 gap-4 px-8`}>
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
				</div>
			</div>
		</motion.div>
	}
}

export default SetupScreen
