import { useState } from 'react'
import { useRouter } from 'next/router'
import FriendlyWords from 'friendly-words'
import { sample } from 'lodash'
import GlitchCanvas from '../components/GlitchCanvas'

function Index () {
	const router = useRouter()
	const [joinCode, setCode] = useState()
	const minPlayers = 2
	const maxPlayers = 4

	const handleCreate = (numPlayers) => {
		const code = `${sample(FriendlyWords.predicates)}-${sample(FriendlyWords.teams)}-${numPlayers}`

		router.push(`/watch/${code}`)
	}

	const handleJoin = () => {
		router.push(`/watch/${joinCode}`)
	}

	return <div className='w-full h-full'>
		<GlitchCanvas />
		<div className='relative text-white w-10/12 flex flex-col justify-center items-center space-y-8 mx-auto h-full -my-8'>
			<div className='flex justify-center items-baseline space-x-8'>
				<h1 className='text-5xl uppercase text-neutralise tracking-loose font-semibold'>Identical</h1>
				<p className='text-xl italic'>Setup the board</p>
			</div>
			<div className='flex'>
				<div className='bg-black space-y-4 py-8 px-10 rounded-l-md'>
					<h2 className='text-2xl tracking-wider uppercase text-neutralise'>Create a new adventure</h2>
					<div className='space-y-4'>
						<h3 className='italic'>How many players?</h3>
						<div className='space-x-3 flex'>
							{[...Array(maxPlayers - minPlayers + 1)].map((v, i) => {
								const nb = i + minPlayers

								return <button key={nb} className='px-4 py-1 border-2 rounded-md focus:outline-none focus-visible:ring-white bg-map-black' onClick={() => handleCreate(nb)}>{nb}</button>
							})}
						</div>
					</div>
				</div>

				<div className='bg-neutralise text-black py-8 px-10 rounded-r-md space-y-4'>
					<h3 className='text-2xl tracking-wider uppercase'>Join an adventure</h3>
					<div className='space-y-4'>
						<h3 className='italic'>What’s your adventure code?</h3>
						<div className='space-x-2 flex'>
							<input className='px-4 py-2 rounded-md text-black' placeholder='Adventure code' onChange={(ev) => setCode(ev.target.value)} value={joinCode} />
							<button className='px-2 py-1 border-2 rounded-md disabled:opacity-30 transition-opacity' onClick={handleJoin} disabled={!joinCode}>Join</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default Index
