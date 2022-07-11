import { useEffect, useRef, useState } from 'react'
import SimplexNoise from 'simplex-noise'
import { transform, useAnimationFrame } from 'framer-motion'

import useWindowSize from '../hooks/useWindowSize'

const simplex = new SimplexNoise()

function GlitchCanvas ({ color = '#3E3961', pW = 40, pH = 20 }) {
	const { width, height } = useWindowSize()
	const canvas = useRef()
	const [isMounted, setMounted] = useState(false)

	function drawGlitch (t) {
		const cols = Math.round(width / pW)
		const rows = Math.round(height / pH)

		if (canvas.current) {
			const ctx = canvas.current.getContext('2d')
			ctx.clearRect(0, 0, width, height)

			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					const noise = simplex.noise3D(i, j, t)

					ctx.fillStyle = `rgba(62, 57, 97, ${transform(noise, [-1, 0.6, 1], [0, 0, 1])})`
					ctx.fillRect(i * pW, j * pH, pW, pH)
				}
			}
		}
	}

	useEffect(() => {
		setMounted(true)
	}, [])

	useAnimationFrame((t) => {
		const x = transform(t % 20000, [0, 10000, 20000], [1, 2, 1])

		drawGlitch(x)
	})

	return <canvas ref={canvas} width={isMounted ? width : 0} height={isMounted ? height : 0} className='fixed w-full h-full top-0 left-0 z-0 bg-black bg-opacity-80' />
}

export default GlitchCanvas
