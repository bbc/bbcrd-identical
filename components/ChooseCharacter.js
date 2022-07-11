import SingleChooseCharacter from './single/ChooseCharacter'
import MultiChooseCharacter from './multi/ChooseCharacter'

function ChooseCharacter ({ isSingleScreen, ...props }) {
	if (isSingleScreen) {
		return <SingleChooseCharacter {...props} />
	}
	else {
		return <MultiChooseCharacter {...props} />
	}
}

export default ChooseCharacter
