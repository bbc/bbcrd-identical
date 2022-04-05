import BoardData from '../game/board-data-structure'

function Terminal ({ position, level, difficulty, status, completed, areTerminalsActive }) {
	const offset = level > 1 ? 3 : 0
	const mainTerminalOffset = level === 2 ? offset : 0
	const width = BoardData.terminalWidth
	const height = BoardData.terminalHeight
	const left = position.x - BoardData.terminalWidth / 2
	const top = position.y - BoardData.terminalHeight / 2

	const TerminalBlock = ({ x, y, isCompleted }) => {
		return <rect rx={3} x={x} y={y} width={width} height={height} className={`stroke-2 ${isCompleted ? 'fill-map-black stroke-middle-grey' : 'fill-black stroke-hack'}`} />
	}

	return <g className={`transition-opacity delay-200 ${status === 'visited' ? 'opacity-100' : 'opacity-0'}`}>
		{level === 2 && <TerminalBlock x={left + offset} y={top + offset * 2} isCompleted={completed >= 1 || !areTerminalsActive} />}
		{level === 3 && <TerminalBlock x={left - offset * 2} y={top + offset * 2} isCompleted={completed >= 1 || !areTerminalsActive} />}
		{level === 3 && <TerminalBlock x={left + width / 2 + offset} y={top + offset * 2} isCompleted={completed >= 2 || !areTerminalsActive} />}
		<TerminalBlock x={left - mainTerminalOffset} y={top} isCompleted={completed === level || !areTerminalsActive} />
		{completed < level && <>
			<image href={`/static/images/${areTerminalsActive ? 'hack' : 'hack-grey'}.svg`} x={position.x - 1 - offset} y={position.y - 8} width='16' height='16' /> :
			<text x={position.x - 9 - offset} y={position.y + 2} fontSize={BoardData.fontSize} fontFamily='IBM Plex Mono' fontWeight='500' fill={areTerminalsActive ? '#2CED0C' : '#606060'} textAnchor='middle' dominantBaseline='middle'>{difficulty}</text>
		</>}
	</g>
}

export default Terminal
