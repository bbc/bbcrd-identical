import BoardData from '../game/board-data-structure'

function Label ({ x, y, letter, status, visible }) {
	return <g className={`transition-opacity delay-100 ${status === 'visited' && visible ? 'opacity-100' : 'opacity-0'}`}>
		<circle cx={x} cy={y} r={BoardData.labelSize} fill='#353535' />
		<circle cx={x} cy={y} r={BoardData.labelSize + 6} stroke='#353535' strokeWidth='2' />
		<text x={x} y={y + 4} fontSize={BoardData.labelFontSize} fontFamily='IBM Plex Mono' fontWeight='500' fill='#606060' textAnchor='middle' dominantBaseline='middle'>{letter}</text>
	</g>
}

export default Label
