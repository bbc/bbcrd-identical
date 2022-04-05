import SingleCorruptionPool from './single/CorruptionPool'
import MultiCorruptionPool from './multi/CorruptionPool'

function CorruptionPool ({ isSingleScreen, ...props }) {
	if (isSingleScreen) {
		return <SingleCorruptionPool {...props} />
	}
	else {
		return <MultiCorruptionPool {...props} />
	}
}

export default CorruptionPool
