import BoardData from '../game/board-data-structure'

function Enemy ({ level, difficulty, x, y, r, status, completed, isAttacking }) {
	const offset = level > 1 ? 3 : 0

	const angle = (2 * Math.PI) / 3
	const points = []

	for (let i = 0; i < 3; i++) {
		const o = {}
		o.x = x + BoardData.enemySize / 2 * Math.cos(i * angle)
		o.y = y + BoardData.enemySize / 2 * Math.sin(i * angle)
		points.push(o)
	}

	return <g key={`${x}-${y}`} className={`${status === 'visited' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} transition-all delay-500 ${isAttacking && 'animate-heartbeat'}`} style={{ 'transformOrigin': `${x}px ${y}px`, '--tw-rotate': `${r}deg` }}>
		{level > 1 && <polygon points={points.map(({ x, y }) => `${x}, ${y}`).join(' ')} transform={`rotate(30 ${x} ${y})`} className={`stroke-round stroke-2 ${completed >= 1 ? 'fill-map-black stroke-middle-grey' : 'stroke-neutralise fill-black'}`} />}
		<polygon points={points.map(({ x, y }) => `${x}, ${y + offset * 4}`).join(' ')} transform={`rotate(30 ${x} ${y + offset * 4})`} className={`stroke-round stroke-2 ${completed >= level ? 'fill-map-black stroke-middle-grey' : 'stroke-neutralise fill-black'}`} />
		{completed < level && <text x={x} y={y + offset * 4 + 1} textAnchor='middle' dominantBaseline='middle' fontSize={BoardData.fontSize} fontFamily='IBM Plex Mono' fontWeight='500' fill='#feca19'>{difficulty}</text>}
	</g>
}

export default Enemy
