import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WindupChildren, Pace } from 'windups'

import Story from '../game/story'

import GlitchCanvas from './GlitchCanvas'
import { usePlaySound } from './SoundContext'
import SkillIcon from './SkillIcon'
import Typewriter from './Typewriter'

function ScrollText ({ currentChapter, setFinished, chapter, isFinished, isCorruption, isEnding, isGameOver }) {
	const handlePara = useCallback((text, isCurrent) => {
		return <p key={text} className={`transition-colors ${!isCurrent && 'opacity-30'}`}>{text}</p>
	}, [])

	return <div
		className='z-10 relative w-full max-w-xl h-0 mx-auto -mb-8 flex flex-col items-center justify-end'
	>
		<div className='relative flex flex-col items-center w-full'>
			<h1 className='z-20 text-neutralise mb-4 w-full space-y-2'>
				<WindupChildren onFinished={() => setFinished(true)}>
					{!isEnding && !isGameOver && <p className='uppercase tracking-widest text-lg font-medium'>{isCorruption ? 'Stage' : 'Chapter'} {(currentChapter) + 1}</p>}
					<p className='text-5xl font-bold'><Pace ms={2000 / chapter.title.length}>{chapter.title}</Pace></p>
				</WindupChildren>
			</h1>
		</div>

		{isFinished && <Typewriter className='text-xl text-white max-w-xl space-y-4 w-full' duration={chapter.duration - 8} onParagraph={handlePara}>{chapter.text}</Typewriter>}
	</div>
}

function Confirmation ({ chapter, setNeedObjective, isCorruption }) {
	const spring = {
		type: 'tween',
		duration: 0.7,
		ease: 'anticipate'
	}

	const variants = {
		initial: {
			y: '-100%',
			opacity: 0
		},
		animate: {
			y: '0%',
			opacity: 1
		}
	}

	useEffect(() => {
		const ref = setTimeout(() => {
			setNeedObjective(false)
		}, 3000)

		return () => clearTimeout(ref)
	}, [setNeedObjective])

	return <motion.div
		className={`${isCorruption ? 'text-neutralise' : 'text-hack'} absolute flex items-center justify-center w-full top-1/2  -translate-y-1/2`}
		variants={variants}
		transition={spring}
		initial='initial'
		animate='animate'
		exit='initial'
	>
		<div className='flex items-center justify-center space-x-4 -mt-20'>
			<SkillIcon skill={isCorruption ? 'neutralise' : 'hack'} className='w-24' />
			<div className='space-y-1'>
				<h2 className='text-3xl font-bold'>{isCorruption ? 'System Corrupted' : 'Objective Complete!'}</h2>
				{!isCorruption && <p className='italic text-white text-lg'>{chapter.onUnlock}</p>}
				{isCorruption && <div className='flex space-x-1 pt-4'>
					{[...Array(chapter.threshold)].map((v, i) => {
						return <div key={i} className={`w-full h-3 ${i === 0 && 'rounded-l-full'} ${i === chapter.threshold - 1 && 'rounded-r-full'} transition-colors bg-neutralise ${i + 1 === chapter.threshold && 'animate-pulse'}`} />
					})}
				</div>}
			</div>
		</div>
	</motion.div>
}

function StoryScreen ({ part, currentChapter, type, isEnding }) {
	const isCorruption = type === 'corruption'
	const chapter = isCorruption ? Story[part].corruption[currentChapter] : Story[part].chapters[currentChapter]
	const [isFinished, setFinished] = useState(false)
	const [needObjective, setNeedObjective] = useState(isCorruption || currentChapter > 0)
	const [canStart, setCanStart] = useState(!needObjective)
	const playSound = usePlaySound()
	const isGameOver = isCorruption && currentChapter >= Story[part].corruption.length - 1

	useEffect(() => {
		if (isFinished) {
			playSound(`part-${part}-${type}-${currentChapter}`)
		}
	}, [playSound, isFinished, currentChapter, type, part])

	return <motion.div className='w-full h-screen overflow-hidden flex justify-center items-center bg-black z-50 absolute left-0 top-0' exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
		<GlitchCanvas color={isCorruption ? '#6b5300' : undefined} />
		<AnimatePresence onExitComplete={() => setCanStart(true)}>
			{canStart && <ScrollText key='text' {...{ currentChapter, isFinished, setFinished, chapter, isCorruption, isEnding, isGameOver }} />}
			{needObjective && <Confirmation key='obj' setNeedObjective={setNeedObjective} setCanStart={setCanStart} isCorruption={isCorruption} chapter={chapter} />}
		</AnimatePresence>
	</motion.div>
}

export default StoryScreen
