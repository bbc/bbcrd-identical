import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Client } from 'boardgame.io/client'
import { SocketIO } from 'boardgame.io/multiplayer'

import { Identical } from '../../../game/Identical'

import IdenticalBoard from '../../../components/Board'
import GlitchCanvas from '../../../components/GlitchCanvas'

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8000
const server = `${HOST}:${PORT}`

const App = () => {
	const router = useRouter()
	const { matchID } = router.query

	const [gameClient, setClient] = useState()
	const [playerName, setName] = useState('')
	const [playerInfo, setPlayerInfo] = useState()
	const [seats, setSeats] = useState({})

	useEffect(() => {
		if (matchID) {
			const numPlayers = parseInt(matchID[matchID.length - 1], 10)

			const client = Client({
				game: Identical,
				board: IdenticalBoard,
				multiplayer: SocketIO({ server }),
				numPlayers,
				matchID,
				debug: {
					hideToggleButton: true,
					collapseOnLoad: true
				}
			})

			client.start()

			setClient(client)

			return () => client.stop()
		}
	}, [matchID])

	useEffect(() => {
		if (gameClient) {
			const unsub = gameClient.subscribe((state) => {
				if (state !== null) {
					if (playerInfo) {
						if (!state.G.players[playerInfo.playerID].nickname) {
							gameClient.moves.join(playerInfo.playerName)
						}

						router.replace(`/single/play/${matchID}/${playerInfo.playerID}`)
					}
					else {
						setSeats(state.G.players)
					}
				}
			})

			return unsub
		}
	}, [gameClient, matchID, playerInfo, router])

	const handleJoin = () => {
		const playerID = Object.keys(seats).find((playerID) => !seats[playerID].nickname)
		setPlayerInfo({ playerID, playerName })
		gameClient.updatePlayerID(playerID)
	}

	return <div className='w-full relative h-full flex justify-center items-center'>
		<GlitchCanvas />
		<div className='relative text-white w-10/12 max-w-md mx-auto space-y-8 -mt-8'>
			<h1 className='text-4xl tracking-wider uppercase text-neutralise'>Join the adventure</h1>

			<div className='space-y-4'>
				<p className='italic'>This is how other players will see your name</p>
				<div className='flex space-x-4'>
					<input className='px-4 py-2 rounded-md text-black w-full' placeholder='Enter your name' onChange={(ev) => setName(ev.target.value)} value={playerName} />
					<button className='px-2 py-1 border-2 rounded-md disabled:opacity-30 transition-opacity' onClick={handleJoin} disabled={!playerName}>Join</button>
				</div>
			</div>
		</div>
	</div>
}

export default App
