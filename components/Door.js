import Lock from '../components/Lock'
import BoardData from '../game/board-data-structure'

function Door ({ x, y, lock, isVertical, visible }) {
	const offset = lock?.level > 1 ? 3 : 0
	const padding = 14
	const width = isVertical ? BoardData.doorThickness : BoardData.lockWidth + padding + offset * 2
	const height = isVertical ? BoardData.lockHeight + padding + offset * 2 : BoardData.doorThickness
	const top = y - height / 2
	const left = x - width / 2
	const right = x + width / 2
	const bottom = y + height / 2

	return	<g className={`transition-opacity ${visible ? 'opacity-100' : 'opacity-0'}`}>
		<rect x={left} y={top} width={width} height={height} fill='#353535' stroke='#353535' />
		<line x1={left} y1={top} x2={isVertical ? right : left} y2={isVertical ? top : bottom} stroke='#C4C4C4' strokeWidth='2' />
		<line x1={isVertical ? left : right} y1={isVertical ? bottom : top} x2={right} y2={bottom} stroke='#C4C4C4' strokeWidth='2' />
		{lock?.completed < lock?.level && <Lock x={x - offset} y={y - offset} lock={lock} offset={offset} />}
	</g>
}

export default Door
