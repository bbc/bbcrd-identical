const RoomIcon = ({ outline, visited, bounds }) => {
	return <svg className='w-full h-full' viewBox={`${bounds[0] - 10} ${bounds[1] - 10} ${bounds[2] - bounds[0] + 20} ${bounds[3] - bounds[1] + 20}`} fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path d={outline} stroke='#FAFAFA' strokeLinejoin='round' strokeWidth={visited ? 7 : 9} strokeDasharray={visited ? null : '10 10'} />
	</svg>
}

export default RoomIcon
