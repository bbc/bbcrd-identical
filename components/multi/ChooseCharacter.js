import Characters from '../../game/Characters'
import AugmentedText from '../AugmentedText'
import GlitchCanvas from '../GlitchCanvas'
import SkillIcon from '../SkillIcon'

function ChooseCharacter ({ playerID, players, moves }) {
	const player = players[playerID]

	const selectedIndex = Object.keys(players).find((i) => players[i].id === player.id && players[i].ready)

	return <div className={`relative max-w-md mx-auto overflow-hidden ${!player.id ? 'h-full' : 'pb-32'} overflow-y-scroll select-none text-white`}>
		<GlitchCanvas />

		<div className='relative w-10/12 mx-auto h-full'>
			{!player.id && <div className='h-full flex justify-center items-center -my-8'>
				<h1 className='text-neutralise text-3xl tracking-wider text-center uppercase'>Choose a character</h1>
			</div>}

			{player.id && <div className='pt-8 space-y-4'>
				<div className='w-full aspect-w-1 aspect-h-1'>
					<div className='w-full h-full bg-black bg-cover rounded-md' style={{ backgroundImage: `url('/static/images/players/${player.id}.jpg')` }} />
				</div>

				<button className={`px-2 py-2 rounded-md border-${player.id} text-${player.id} border-2 w-full text-xl disabled:bg-${player.id} disabled:text-black`} onClick={() => !selectedIndex && moves.confirmCharacter()} disabled={selectedIndex}>{
					selectedIndex
						? `${playerID !== selectedIndex ? `${players[selectedIndex].nickname} is` : 'You are'} ${player.name}`
						: `Choose ${player.name}`
				}</button>

				<div className='text-white align-center leading-relaxed space-y-4 pt-4'>
					<h3 className='font-bold uppercase tracking-widest'>{player.description[0]}</h3>
					{player.description.slice(1).map((text) => {
						const Token = ({ str, attr }) => {
							let skill = player.skills[attr]
							const isSkill = !!skill

							if (!isSkill) {
								skill = player[attr]
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
			</div>}
		</div>

		{!player.ready && <div className='fixed bottom-0 left-0 w-full overflow-x-scroll flex flex-nowrap z-10 bg-black'>
			{Characters.map((character) => {
				const selectedCharacters = Object.keys(players).filter((i) => players[i].id && players[i].ready).map((playerID) => players[playerID].id)

				return <div key={character.id} className='shrink-0 px-1 py-2 first:pl-2 last:pr-2'>
					<button onClick={() => moves.selectCharacter(character.id)} className={`focus:outline-none h-20 w-20 rounded-md overflow-hidden border-2 ${character.id === player.id ? 'border-neutralise' : 'border-transparent'}`}>
						<div className={`w-full h-full bg-black bg-cover ${selectedCharacters.includes(character.id) && 'opacity-30'}`} style={{ backgroundImage: `url('/static/images/players/${character.id}.jpg')` }} />
					</button>
				</div>
			})}
		</div>}
	</div>
}

export default ChooseCharacter
