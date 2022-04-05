import BoardData from '../game/board-data-structure'

function PlayerToken ({ x, y, player, isCurrent, isAttacking }) {
	const strokeWidth = Math.floor(BoardData.playerSize / 3)

	return <g className={`text-${player.id} ${isAttacking && isCurrent && 'animate-heartbeat'}`} style={{ transformOrigin: `${x}px ${y}px` }}>
		{isCurrent && <circle cx={x} cy={y} r={BoardData.playerSize} stroke='#FAFAFA' strokeWidth='3' className='fill-current animate-ping' style={{ transformOrigin: `${x}px ${y}px` }} />}
		<circle cx={x} cy={y} r={BoardData.playerSize} className='fill-current' stroke='#FAFAFA' strokeWidth={strokeWidth} />
		<circle cx={x} cy={y} r={BoardData.playerSize - strokeWidth / 2} stroke='black' strokeOpacity='0.2' />
	</g>
}

export default PlayerToken
