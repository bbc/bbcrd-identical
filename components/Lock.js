import BoardData from '../game/board-data-structure'

function Lock ({ x, y, lock, offset }) {
	const width = BoardData.lockWidth
	const height = BoardData.lockHeight
	const left = x - BoardData.lockWidth / 2
	const top = y - BoardData.lockHeight / 2

	return <>
		{lock.level > 1 && <rect x={left + offset * 2} y={top + offset * 2} width={width} height={height} rx='3' className={`stroke-2 ${lock.completed >= 1 ? 'fill-map-black stroke-middle-grey' : 'fill-black stroke-lockpick'}`} />}
		<rect x={left} y={top} width={width} height={height} rx='3' className='stroke-2 fill-black stroke-lockpick' />
		<image href='/static/images/lockpick.svg' x={x - 1} y={y - 7.5} width='15' height='15' />
		<text x={x - 9} y={y + 2} fontSize={BoardData.fontSize} fontFamily='IBM Plex Mono' fontWeight='500' fill='#F86132' textAnchor='middle' dominantBaseline='middle'>{lock.difficulty}</text>
	</>
}

export default Lock
