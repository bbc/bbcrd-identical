import SingleUpgradePool from './single/UpgradePool'
import MultiUpgradePool from './multi/UpgradePool'

function UpgradePool ({ isSingleScreen, ...props }) {
	if (isSingleScreen) {
		return <SingleUpgradePool {...props} />
	}
	else {
		return <MultiUpgradePool {...props} />
	}
}

export default UpgradePool
