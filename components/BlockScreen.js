import SingleBlockScreen from './single/BlockScreen'
import MultiBlockScreen from './multi/BlockScreen'

// The block screen is the overlay displayed on the interactive
// part of the screen to prevent action and encourage players to focus
// on another screen/part. Different design for single screen.

function BlockScreen ({ isSingleScreen, ...props }) {
	if (isSingleScreen) {
		return <SingleBlockScreen {...props} />
	}
	else {
		return <MultiBlockScreen {...props} />
	}
}

export default BlockScreen
