import { useRouter } from 'next/router'
import { Client } from 'boardgame.io/react'
import { SocketIO } from 'boardgame.io/multiplayer'

import { Identical } from '../../game/Identical'

import IdenticalBoard from '../../components/Board'

const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8000
const server = `${HOST}:${PORT}`

const App = () => {
	const router = useRouter()
	const { matchID } = router.query

	if (matchID) {
		const numPlayers = parseInt(matchID[matchID.length - 1], 10)

		const IdenticalClient = Client({
			game: Identical,
			board: IdenticalBoard,
			multiplayer: SocketIO({ server }),
			numPlayers,
			debug: {
				hideToggleButton: true,
				collapseOnLoad: true
			}
		})

		return <IdenticalClient matchID={matchID} />
	}
	else {
		return ''
	}
}

export default App
