import { countBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { animate } from 'framer-motion'

function getPaceMultiplier (char) {
	switch (char) {
		case '—':
		case '…':
			return 10
		case '.':
		case ',':
			return 7
		case '-':
		case ' ':
			return 0
		case '\n':
			return 20
		default:
			return 1
	}
}

function Typewriter ({ children, className, duration, onParagraph }) {
	const [output, setOutput] = useState('')

	const multipliers = useMemo(() => {
		return children.split('').map((c) => getPaceMultiplier(c))
	}, [children])

	const pace = useMemo(() => {
		const count = countBy(multipliers)
		const paceMultipliers = Object.keys(count)

		const unitPace = (duration / paceMultipliers.length) / (paceMultipliers.reduce((sum, pace) => (sum += pace * count[pace]), 0) / paceMultipliers.length)

		return unitPace
	}, [duration, multipliers])

	useEffect(() => {
		function setTextForDuration (target) {
			let total = 0
			let i = 0

			while (total < target && i < multipliers.length) {
				total += multipliers[i] * pace
				i++
			}

			const paras = children.slice(0, i).split('\n')

			setOutput(paras.map((t, i) => onParagraph(t, paras.length - 1 === i)))
		}

		const controls = animate(0, duration, {
			duration,
			ease: 'linear',
			onUpdate: (t) => setTextForDuration(t)
		})

		return () => controls.stop()
	}, [children, duration, multipliers, pace, onParagraph])

	return <div className={className}>{output}</div>
}

export default Typewriter
