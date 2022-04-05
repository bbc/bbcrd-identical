import SpectatorBoard from './SpectatorBoard'
import PlayerBoard from './PlayerBoard'
import { EffectsBoardWrapper } from 'bgio-effects/react'

const SpectatorBoardWrapped = EffectsBoardWrapper(SpectatorBoard, { updateStateAfterEffects: true })
const PlayerBoardWrapped = EffectsBoardWrapper(PlayerBoard)

function Board (props) {
	if (props.playerID) {
		return <PlayerBoardWrapped {...props} />
	}
	else {
		return <SpectatorBoardWrapped {...props} />
	}
}

export default Board
