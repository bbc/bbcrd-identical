import { AnimatePresence, motion } from 'framer-motion'
import { useWindupString } from 'windups'
import { useEffectState, useLatestPropsOnEffect } from 'bgio-effects/react'
import { useEffect, useState } from 'react'
import useSound from '../hooks/useSound'
import Sprites from '../public/static/sounds/sprites.json'

import { canEnemySeeYou } from '../game/helpers'
import { showMap } from '../game/game-config'
import Story from '../game/story'

import Door from './Door'
import Room from './Room'
import Player from './Player'
import CorruptionRoll from './CorruptionRoll'
import UseUpgrade from './UseUpgrade'
import StoryScreen from './StoryScreen'
import SetupScreen from './SetupScreen'
import GlitchCanvas from './GlitchCanvas'
import { SoundContext } from './SoundContext'
import AugmentedText from './AugmentedText'
import SkillIcon from './SkillIcon'
import HelpCard from './HelpCard'
import UseComms from './UseComms'
import CorruptionScreen from './CorruptionScreen'

function Objective ({ isCorruption }) {
	const { G } = useLatestPropsOnEffect('newObjective')
	const { objective, chapter, part } = G.story
	const objectiveStatic = Story[part].chapters[chapter].objectiveText
	const [objectiveText] = useWindupString(objectiveStatic || '')

	const Token = ({ str, attr }) => {
		if (objective[attr]) {
			const { current, target, hidden, location, type } = objective[attr]
			const objectiveType = type || attr
			const isCompleted = !hidden && objectiveType !== 'meet' && current >= target

			return <span className={`inline-flex items-center ${str ? 'align-baseline' : 'align-middle'}`}>
				{str && <span className={`font-bold uppercase tracking-widest text-sm ${!hidden && `text-${objectiveType}`} ${isCompleted && 'line-through'}`}>{str}</span>}
				{[...Array(hidden ? 0 : target)].map((v, i) => {
					let color = 'text-wall-grey'
					let isIncomplete = true

					if (!hidden) {
						if (objectiveType === 'meet') {
							const id = current[i]
							color = id ? `text-${G.players[id].id}` : 'text-middle-grey'
							isIncomplete = !id
						}
						else if (i < current) {
							color = `text-${objectiveType}`
							isIncomplete = false
						}
					}

					return <SkillIcon transparent={hidden} key={i} skill={objectiveType} letter={location} className={`h-5 ${str && 'ml-1'} inline-block ${color} ${isIncomplete && !hidden && `animate-pulse animate-delay-${i * 100}`}`} />
				})}
			</span>
		}
		else {
			return ''
		}
	}

	const Partial = ({ partial }) => {
		return <span className='font-bold uppercase tracking-widest text-sm'>{partial}</span>
	}

	return <div className='w-full leading-relaxed bg-black rounded-lg px-4 pt-3 pb-4 -mt-3 z-10 relative'>
		{!isCorruption && <AugmentedText key={objectiveText} Partial={Partial} Token={Token} className='inline'>{objectiveText}</AugmentedText>}
		{isCorruption && <div className='space-y-2'>
			<div className='flex text-neutralise'>
				<h2 className='leading-tight font-bold'>SECURITY SCAN IN&nbsp;PROGRESS...</h2>
				<div className='relative flex justify-center items-center w-10 h-10 shrink-0'>
					<SkillIcon skill='neutralise' className='h-1/2 animate-ping' />
				</div>
			</div>
			<div className='italic leading-snug'>Anyone found in a yellow zone will be hurt</div>
		</div>}
	</div>
}

function CorruptionBar ({ isCorruption, story }) {
	const threshold = Story[story.part].corruption[story.corruption].threshold

	const [prompt, setPrompt] = useState(0)

	useEffect(() => {
		const loop = setInterval(() => {
			setPrompt((v) => v + 1 > 1 ? 0 : 1)
		}, 1000)

		return () => {
			setPrompt(0)
			clearInterval(loop)
		}
	}, [])

	return <div className='flex justify-between items-center rounded-lg space-x-2 w-full bg-corruption text-black px-4 py-3 pb-6'>
		<div className='relative text-corruption bg-black rounded-md flex justify-center items-center w-10 h-10 shrink-0'>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 23' className='w-3/4'><path d='M18.9 5.7a9.3 9.3 0 012.2 5.8l-.9-.9a.8.8 0 10-1.2 1.2l2.4 2.4a.8.8 0 001.2 0l2.4-2.4a.8.8 0 000-1.2.8.8 0 00-1.2 0l-1 1a11 11 0 10-1.6 6 .9.9 0 00-.3-1.1.8.8 0 00-1.2.2 9.3 9.3 0 11-.8-11z' className='fill-current' /></svg>
			<div className='absolute w-full h-full top-0 left-0 flex items-center justify-center font-semibold'>{prompt === 0 ? story.corruption + 1 : '!'}</div>
		</div>
		<div className='w-full space-y-1'>
			<h2 className='uppercase leading-tight transition-colors tracking-wider flex w-full items-center font-bold'>
				<div className='w-full'>System Corruption</div>
			</h2>
			<div className='flex justify-center space-x-1 w-full'>
				{[...Array(threshold)].map((v, i) => {
					return <div key={i} className={`relative overflow-hidden w-full h-3 ${i === 0 && 'rounded-l-full'} ${i === threshold - 1 && 'rounded-r-full'} transition-colors ${i < story.corruptionProgress ? 'bg-black' : isCorruption && i === story.corruptionProgress ? 'animate-pulse bg-black' : 'bg-white'}`} />
				})}
			</div>
		</div>
	</div>
}

function Board ({ G, ctx, matchID, single, playerIndex, moves }) {
	const { G: { board } } = useLatestPropsOnEffect('updateBoard')

	const isDoorVisible = (rooms) => rooms.some((id) => visitedIds.includes(id))
	// Here we use the old G so we don't display new rooms too soon but use the new
	// board data lower down to update player position and terminals/etc. immediately
	const visitedIds = G.board.rooms.filter(({ visited }) => visited).map(({ id }) => id)
	const visibleDoors = G.board.doors.filter(({ rooms, disabled }) => !disabled && isDoorVisible(rooms))
	const accessibleIds = Array.from(visibleDoors.reduce((acc, { rooms }) => {
		rooms.forEach((r) => acc.add(r))

		return acc
	}, new Set())).filter((r) => !visitedIds.includes(r))

	const currentPlayer = G.players[ctx.currentPlayer]
	const isCorruption = ['encounter', 'corruption'].includes(ctx.phase)

	const [corruptionEffect, isRolling] = useEffectState('corruptionRoll')
	const [playedUpgrade, isUpgrading] = useEffectState('useUpgrade')
	const [playedComms, isComms] = useEffectState('useComms')
	const [storyChapter, isStorytelling] = useEffectState('nextChapter')
	const [, isAttacking] = useEffectState('attack')
	const [, isCorruptionPlaying] = useEffectState('corruption')
	const [, isCorruptionAdvancing] = useEffectState('corruptionUpdate')
	const [, isIntroPlaying] = useEffectState('intro')
	const [soundId, isPlayingSound] = useEffectState('playSound')
	const [isSetupFinished, setSetupFinished] = useState(false)
	const isEnding = G.story.chapter === (Story[G.story.part].chapters.length - 1)
	const isGameOver = ctx.gameover
	const isSingleScreen = single
	const needCorruptionStory = isCorruptionPlaying || isGameOver
	const needStory = isStorytelling || isIntroPlaying || isEnding || needCorruptionStory

	// Only way to track if we need to hide the setup
	// The event plays before the setup is finished in G
	// This also avoids infinite re-renders in useEffect
	useEffect(() => {
		setSetupFinished(isIntroPlaying || isSetupFinished)
	}, [isIntroPlaying, isSetupFinished])

	const [playSound, toggleMute, isMuted] = useSound({
		src: ['/static/sounds/sprites.mp3'],
		sprite: Sprites.sprite
	})

	useEffect(() => {
		if (['corruption', 'encounter'].includes(ctx.phase)) {
			playSound('corruption')
		}
		else {
			playSound('crew')
		}
	}, [ctx.phase, playSound])

	useEffect(() => {
		if (isPlayingSound && soundId) {
			playSound(soundId)
		}
	}, [soundId, isPlayingSound, playSound])

	useEffect(() => {
		if (isAttacking) {
			playSound('damage')
		}
	}, [isAttacking, playSound])

	// TODO: check location to see if that one is active
	const areTerminalsActive = Object.keys(G.story.objective).some((key) => {
		const o = G.story.objective[key]

		// TEMP: key used as type for now
		return (key === 'hack' || o.type === 'hack') && o.current < o.target
	})

	const canTalk = !currentPlayer.comms || currentPlayer.comms.status === 'on'

	return <SoundContext.Provider value={{ playSound }}>
		<div className={`w-full h-full flex items-center justify-between overflow-hidden relative ${isAttacking && 'animate-smash'}`}>
			<div className='shrink-0 h-full flex flex-col space-y-8 text-white w-80 items-start mr-4 py-5 z-50 relative pl-4'>
				<div className='w-full'>
					<CorruptionBar isCorruption={isCorruption} story={G.story} />
					{ctx.phase !== 'setup' && !isIntroPlaying && <Objective isCorruption={isCorruption} />}
				</div>
				{ctx.phase !== 'setup' &&
					<div className='w-full'>
						<div className='flex flex-col justify-start items-start space-y-3 w-full'>
							{Object.keys(G.players).map((id) => <Player key={id} player={G.players[id]} isCurrent={ctx.currentPlayer === id} index={id} isEncounter={ctx.phase === 'encounter'} />)}
						</div>
					</div>}
			</div>
			<div className='h-full w-full'>
				{isCorruption && <GlitchCanvas />}
				<motion.div className='h-full w-full z-20 relative'>
					<svg className='h-full w-full' viewBox='0 0 1140 780' fill='none' xmlns='http://www.w3.org/2000/svg'>
						{board.rooms.map((room) => {
							let status = 'inaccessible'
							let hasEnemies = false

							if (visitedIds.includes(room.id)) {
								status = 'visited'
								hasEnemies = canEnemySeeYou(board, room)
							}
							else if (accessibleIds.includes(room.id)) {
								status = 'accessible'
							}

							if (showMap) {
								status = 'visited'
							}

							return <Room key={room.id} {...room} status={status} hasEnemies={hasEnemies} playersData={G.players} currentPlayer={ctx.currentPlayer} areTerminalsActive={areTerminalsActive} />
						})}
						{/* We use the old G for the doors so they get revealed at the same time as the rooms */}
						{G.board.doors.map((door) => <Door key={`${door.x}-${door.y}`} {...door} visible={!door.disabled && (isDoorVisible(door.rooms) || showMap)} />)}
					</svg>
				</motion.div>
				<AnimatePresence>
					{currentPlayer.currentAction && isRolling && <CorruptionRoll player={currentPlayer} skill={currentPlayer.currentAction.skill} {...corruptionEffect} />}
					{isUpgrading && <UseUpgrade key={playedUpgrade.id} rotate={playedUpgrade.rotate} upgrade={playedUpgrade} />}
					{isComms && <UseComms key='play-comms' {...playedComms} />}
					{currentPlayer.helpRequest?.need && <div>
						{Object.keys(currentPlayer.helpRequest.crew).filter((id) => currentPlayer.helpRequest.crew[id].upgrade).map((id, i) => <UseUpgrade key={currentPlayer.helpRequest.crew[id].upgrade.id} upgrade={currentPlayer.helpRequest.crew[id].upgrade} rotate={-30 + (i + 1) * 20} />)}
						<HelpCard key='help-request' {...currentPlayer.helpRequest} players={G.players} />
					</div>}
				</AnimatePresence>
			</div>
			<AnimatePresence>
				{ctx.phase === 'setup' && !isSetupFinished && <SetupScreen key='setup' matchID={matchID} players={G.players} playerID={playerIndex} isSingleScreen={isSingleScreen} />}
				{needStory && <StoryScreen key='story' part={G.story.part} currentChapter={needCorruptionStory ? G.story.corruption : (storyChapter || G.story.chapter)} isEnding={isEnding} type={needCorruptionStory ? 'corruption' : 'story'} />}
				{isCorruptionAdvancing && <CorruptionScreen key='corruption-screen' part={G.story.part} currentChapter={G.story.corruption} progress={G.story.corruptionProgress} />}
			</AnimatePresence>
			{ctx.phase !== 'setup' && <div className='absolute z-50 bottom-4 left-4 flex justify-center items-center space-x-2'>
				<div className={`flex space-x-2 items-center ${!canTalk ? 'text-black bg-white' : 'text-white bg-black'} rounded-lg px-2 py-1 w-48 font-bold leading-snug`}>
					<img className='h-10' src={`/static/images/comms-${canTalk ? 'on' : 'off'}-v2${canTalk ? '-white' : ''}.svg`} alt={`Strategy talk ${canTalk ? 'allowed' : 'forbidden'}`} />
					<span>{canTalk ? 'Strategy Talk Allowed' : 'Strategy Talk Forbidden'}</span>
				</div>
			</div>}
			<button className='z-50 absolute bottom-4 right-4 rounded-full w-10 h-10 bg-black text-white border-2 border-white flex items-center justify-center focus:outline-none' onClick={() => toggleMute()}>
				<img alt={`turn sound ${isMuted ? 'on' : 'off'}`} src={`/static/images/sound-${isMuted ? 'off' : 'on'}.svg`} className='w-6' />
			</button>
		</div>
	</SoundContext.Provider>
}

export default Board
