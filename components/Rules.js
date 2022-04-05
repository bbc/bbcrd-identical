import SkillIcon from './SkillIcon'

function Keyword ({ children }) {
	const word = children.toLowerCase()

	return <span className={`uppercase tracking-widest font-bold text-${word} inline-flex items-center align-baseline space-x-1`} style={{ fontSize: '0.875em' }}>
		<span>{word}</span>
		{!['identical', 'objectives', 'corruption'].includes(word) && <SkillIcon skill={word} className={`${word === 'stamina' ? 'text-stamina-red' : ''} h-3.5`} />}
	</span>
}

function RuleSection ({ title, image, children, number }) {
	return <section className='space-y-4 bg-map-black px-5 py-4 sm:px-8 sm:py-7 rounded-xl shrink-0'>
		<h2 className='text-xl sm:text-2xl sm:font-bold text-neutralise flex justify-between items-center'>{title} <span className='border-2 text-neutralise font-bold rounded-full w-6 h-6 text-sm flex justify-center items-center'>{number}</span></h2>

		<div className={`sm:flex space-y-2 sm:space-y-0 sm:space-x-8 w-full ${number % 2 === 0 && 'sm:flex-row-reverse sm:space-x-reverse'}`}>
			<img className='rounded-lg shadow-lg overflow-hidden block w-full sm:w-1/2 shrink-0 self-start' src={`/static/images/rules/${image}`} alt={`${title} interface`} />

			<div className='sm:w-1/2 sm:text-lg sm:leading-relaxed'>
				{children}
			</div>
		</div>
	</section>
}

function Rules ({ handleNext, isSingle }) {
	return <div className={`space-y-5 sm:space-y-8 relative w-full max-w-4xl mx-auto text-white pt-8 pb-24 leading-relaxed px-3 ${!isSingle && 'bg-black'}`}>
		<section className='space-y-4 px-4'>
			<h1 className='uppercase tracking-widest text-neutralise text-4xl font-bold px-2'>How to Play</h1>
		</section>

		<RuleSection title='Objective' number='1' image='objective.jpg'>
			<section className='space-y-4'>
				<p>
					In <Keyword>IDENTICAL</Keyword> you are a character who is part of a crew. Each of you has strengths and weaknesses but ultimately you succeed or fail together by completing <Keyword>OBJECTIVES</Keyword>.
				</p>

				<p>
					After everyone’s turn, the <Keyword>CORRUPTION</Keyword> gauge advances. When it reaches the end, something bad will happen.
				</p>
			</section>
		</RuleSection>

		<RuleSection title='Your Character' number='2' image='abilities.jpg'>
			<section>
				<p>Your character has abilities:</p>
				<ul className='list-disc list-inside'>
					<li><Keyword>HACK</Keyword> to get into computers</li>
					<li><Keyword>LOCKPICK</Keyword> to open doors</li>
					<li><Keyword>NEUTRALISE</Keyword> to stop enemies</li>
					<li><Keyword>STAMINA</Keyword> to resist damages</li>
					<li><Keyword>ACTIONS</Keyword> represent the number of things you can do on your turn</li>
				</ul>
			</section>
		</RuleSection>

		<RuleSection title='Success & Failure' number='3' image='chances.jpg'>
			<p>The chances of <Keyword>HACK</Keyword>, <Keyword>LOCKPICK</Keyword> and <Keyword>NEUTRALISE</Keyword> are based on the difficulty of the target. The higher the difference, the more chance you have to succeed.</p>
		</RuleSection>

		<RuleSection title='Boost Cards' number='4' image='boosts.jpg'>
			<section className='space-y-4'>
				<p><Keyword>BOOSTS</Keyword> increase your abilities for 1 turn, except for <Keyword>STAMINA</Keyword> which is permanent.</p>

				<p>If your crewmates are less than 1 room away, you can request immediate <Keyword>BOOSTS</Keyword> from them. You can also search for new <Keyword>BOOSTS</Keyword> if you’re running out.</p>
			</section>
		</RuleSection>

		<RuleSection title='Communication' number='5' image='comms.jpg'>
			<section className='space-y-4'>
				<p>Talking through what you’re doing is an essential part of collaboration. However, at the beginning of your turn, you must choose whether you will discuss strategy or not.</p>

				<p>If you forbid strategy talk, players cannot discuss their boosts and intentions or give advice. However, choosing no strategy talk will get you <Keyword>BOOSTS</Keyword>.</p>
			</section>
		</RuleSection>

		<RuleSection title='Actions' number='6' image='actions.jpg'>
			<section className='space-y-4'>
				<p>A turn represents just a few minutes inside the story so what you can do is limited by where you are and your remaining <Keyword>ACTIONS</Keyword>.</p>

				<p>Using <Keyword>BOOSTS</Keyword> or requesting <Keyword>BOOSTS</Keyword> from your crew doesn’t use an action, everything else does.</p>
			</section>
		</RuleSection>

		<RuleSection title='The Security System' number='7' image='security.jpg'>
			<section className='space-y-4'>
				<p>When all the crew has taken a turn, you will see if you've tripped up the security system. This might hurt.</p>

				<p>If an ennemy can see you (the room will have a <span className='text-neutralise'>yellow outline</span>) at the end of the security phase, they will attack you and you will lose <Keyword>STAMINA</Keyword>. The ennemies will have a chance to move before the crew plays again.</p>
			</section>
		</RuleSection>

		{!isSingle && <section className='px-5 pt-4'>
			<button className='px-2 py-2 rounded-md border-2 text-xl w-full block text-neutralise' onClick={handleNext}>Choose your character</button>
		</section>}
	</div>
}

export default Rules
