import { useRouter } from 'next/router'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'

import { Identical } from '../../../game/Identical'

import IdenticalBoard from '../../../components/Board'

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8000
const server = `${HOST}:${PORT}`

const App = () => {
	const router = useRouter()
	const { params } = router.query
	const [matchID, playerID] = params || []

	if (matchID) {
		const numPlayers = parseInt(matchID[matchID.length - 1], 10)

		const IdenticalClient = Client({
			game: Identical,
			board: ({ playerID, ...props }) => {
				return <div className='flex h-full'>
					<div className='h-full w-9/12'>
						<IdenticalBoard {...props} playerIndex={playerID} single />
					</div>
					<div className='h-full w-3/12 relative z-10 overflow-scroll'>
						<IdenticalBoard {...props} playerID={playerID} single />
					</div>
				</div>
			},
			multiplayer: SocketIO({ server }),
			numPlayers,
			debug: {
				hideToggleButton: true,
				collapseOnLoad: true
			}
		})

		return <IdenticalClient matchID={matchID} playerID={playerID} />
	}
	else {
		return ''
	}
}

export default App
