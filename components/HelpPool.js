import SingleHelpPool from './single/HelpPool'
import MultiHelpPool from './multi/HelpPool'

function HelpPool ({ isSingleScreen, ...props }) {
	if (isSingleScreen) {
		return <SingleHelpPool {...props} />
	}
	else {
		return <MultiHelpPool {...props} />
	}
}

export default HelpPool
