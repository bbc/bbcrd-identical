import SingleSetupScreen from './single/SetupScreen'
import MultiSetupScreen from './multi/SetupScreen'

function SetupScreen ({ isSingleScreen, ...props }) {
	if (isSingleScreen) {
		return <SingleSetupScreen {...props} />
	}
	else {
		return <MultiSetupScreen {...props} />
	}
}

export default SetupScreen
