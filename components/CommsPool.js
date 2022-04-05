import SingleCommsPool from './single/CommsPool'
import MultiCommsPool from './multi/CommsPool'

function CommsPool ({ isSingleScreen, ...props }) {
	if (isSingleScreen) {
		return <SingleCommsPool {...props} />
	}
	else {
		return <MultiCommsPool {...props} />
	}
}

export default CommsPool
