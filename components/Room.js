import { motion } from 'framer-motion'

import Enemy from '../components/Enemy'
import PlayerToken from '../components/PlayerToken'
import Label from '../components/Label'
import Terminal from '../components/Terminal'
import { useEffectState } from 'bgio-effects/dist/react'

function Room ({ outline, id, players, enemies, playerPositions, enemyPositions, label, terminal, status, hasEnemies, playersData, currentPlayer, areTerminalsActive }) {
	const [attack, isAttacking] = useEffectState('attack')

	const outlineVariants = {
		visited: {
			pathLength: 1,
			stroke: hasEnemies ? '#FECA19' : '#C4C4C4'
		},
		inaccessible: {
			pathLength: 0
		},
		accessible: {
			pathLength: 1,
			stroke: '#8B8B8B',
			transition: {
				duration: 2
			}
		}
	}

	const dashVariants = {
		visited: {
			opacity: 0
		},
		inaccessible: {
			opacity: 0
		},
		accessible: {
			opacity: 1
		}
	}

	return <g className={`path ${status}`}>
		<motion.path d={outline} className='stroke-2 stroke-round z-0 relative' variants={outlineVariants} animate={status} />
		<motion.path d={outline} className='stroke-[3] stroke-round z-0 relative stroke-map-black' variants={dashVariants} animate={status} style={{ strokeDasharray: '5 10' }} />
		{label && <Label {...label} letter={id} status={status} />}
		{players?.map((player, i) => <PlayerToken isAttacking={isAttacking} key={player} player={playersData[player]} {...playerPositions[i]} isCurrent={currentPlayer === player} />)}
		{enemies?.map((enemy, i) => <Enemy key={enemy.id} {...enemy} {...enemyPositions[i]} status={status} isAttacking={isAttacking && attack.enemies.includes(enemy.id)} />)}
		{terminal?.difficulty && <Terminal {...terminal} status={status} areTerminalsActive={areTerminalsActive} />}
	</g>
}

export default Room
