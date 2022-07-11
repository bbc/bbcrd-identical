import Characters from '../../game/Characters'
import AugmentedText from '../AugmentedText'
import SkillIcon from '../SkillIcon'

function ChooseCharacter ({ playerID, players, moves }) {
	const player = players[playerID]

	const selectedIndex = Object.keys(players).find((i) => players[i].id === player.id && players[i].ready)
	const selectedCharacters = Object.keys(players).filter((i) => players[i].id && players[i].ready).map((playerID) => players[playerID].id)

	if (player.needRules) {
		return <div className='text-white w-full h-full flex flex-col justify-center items-center space-y-8 z-10 p-8 bg-black'>
			<h1>Read the rules carefully then choose your character</h1>

			<button className='px-2 py-2 rounded-md border-2 text-xl w-full block text-neutralise' onClick={() => moves.readRules()}>Choose your character</button>
		</div>
	}
	else {
		return <div className='text-white w-full flex flex-col space-y-8 z-10 p-8 overflow-y-scroll bg-black'>
			<h1 className='text-xl uppercase text-neutralise tracking-widest font-semibold'>Choose your character</h1>
			<div className='text-white w-full space-y-8 h-full z-10'>
				{Characters.filter(({ id }) => !selectedIndex || id === player.id).map((character) => {
					return <div key={character.id} className='space-y-8 flex-start'>
						<div className='w-full space-y-4'>
							<div className='w-full aspect-w-1 aspect-h-1'>
								<div className='w-full h-full bg-black bg-cover rounded-md' style={{ backgroundImage: `url('/static/images/players/${character.id}.jpg')` }} />
							</div>

							<button
								className={`px-2 py-2 rounded-md border-${character.id} text-${character.id} border-2 w-full text-xl disabled:bg-${character.id} disabled:text-black`}
								onClick={() => {
									if (!selectedIndex) {
										moves.selectCharacter(character.id)
										moves.confirmCharacter()
									}
								}}
								disabled={selectedIndex || selectedCharacters.includes(character.id)}
							>
								{selectedIndex && `You are ${character.name}`}
								{!selectedIndex && `${selectedCharacters.includes(character.id) ? `${players[Object.keys(players).find((i) => players[i].id === character.id)].nickname} is ${character.name}` : `Choose ${character.name}`}`}
							</button>
						</div>

						<div className='w-full text-white leading-relaxed space-y-4'>
							<h3 className='font-bold uppercase tracking-widest'>{character.description[0]}</h3>
							{character.description.slice(1).map((text) => {
								const Token = ({ str, attr }) => {
									let skill = character.skills[attr]
									const isSkill = !!skill

									if (!isSkill) {
										skill = character[attr]
									}

									return <span>
										<span className='font-bold uppercase tracking-widest text-sm'>{str}</span>
										<span className={`text-${attr} pl-1 text-sm inline-flex items-center space-x-1 font-bold`}>
											[<span className='font-semibold'>{skill}</span>
											<SkillIcon skill={attr} className={`h-3.5 ${attr === 'stamina' && 'text-stamina-red'}`} />]
										</span>
									</span>
								}

								return <AugmentedText key={text} Token={Token}>{text}</AugmentedText>
							})}
						</div>
					</div>
				})}
				<div className='h-12 w-full' />
			</div>
		</div>
	}
}

export default ChooseCharacter
