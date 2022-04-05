import SingleEncounter from './single/Encounter'
import MultiEncounter from './multi/Encounter'

function Encounter ({ isSingleScreen, ...props }) {
	if (isSingleScreen) {
		return <SingleEncounter {...props} />
	}
	else {
		return <MultiEncounter {...props} />
	}
}

export default Encounter
