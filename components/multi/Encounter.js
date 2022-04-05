import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import useDimensions from '../../hooks/useDimensions'

function getFill (ctx, canvasWidth, canvasHeight, stride = 1) {
	const pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
	const pdata = pixels.data
	const l = pdata.length
	const total = (l / stride)
	let count = 0

	for (let i = count = 0; i < l; i += stride) {
		if (parseInt(pdata[i]) === 0) {
			count++
		}
	}

	return count / total
}

function Scratch ({ symbol, handleReveal }) {
	const canvas = useRef()
	const points = useRef([])
	const dimensions = useRef({})
	const wrapper = useRef()

	const box = useDimensions(wrapper)
	const size = box?.width || 200

	const draw = () => {
		const ctx = canvas.current.getContext('2d')
		ctx.globalCompositeOperation = 'source-over'
		ctx.lineJoin = 'round'
		ctx.lineCap = 'round'
		ctx.lineWidth = size * 0.15
		ctx.strokeStyle = '#000000'

		ctx.fillStyle = '#C4C4C4'
		ctx.fillRect(0, 0, size, size)

		if (points.current.length) {
			ctx.globalCompositeOperation = 'destination-out'

			ctx.beginPath()
			ctx.moveTo(points.current[0].x, points.current[0].y)

			for (let i = 1; i < points.current.length; i++) {
				ctx.quadraticCurveTo(points.current[i].x, points.current[i].y, (points.current[i - 1].x + points.current[i].x) / 2, (points.current[i - 1].y + points.current[i].y) / 2)
			}

			ctx.stroke()
		}
	}

	useEffect(() => {
		draw()
	})

	function handleStart (e, pointInfo) {
		const { x, y } = canvas.current.getBoundingClientRect()
		dimensions.current = { x, y }
	}

	function handlePan (e, pointInfo) {
		points.current.push({
			x: pointInfo.point.x - dimensions.current.x,
			y: pointInfo.point.y - dimensions.current.y
		})

		draw()
	}

	function handleEnd () {
		const ctx = canvas.current.getContext('2d')
		const fill = getFill(ctx, size, size)

		if (fill > 0.25) {
			handleReveal()
		}
	}

	return <div className='w-1/2'>
		<motion.div onPan={handlePan} onPanStart={handleStart} onPanEnd={handleEnd} className='relative rounded-full overflow-hidden touch-none aspect-h-1 aspect-w-1'>
			<div className='flex justify-center items-center rounded-full overflow-hidden' ref={wrapper}>
				<div className='absolute w-full h-full z-0 top-0 left-0 border-neutralise border-6 rounded-full' />
				<img src={`/static/images/encounters/${symbol.id}.svg`} alt='Encounter symbol' className='w-full' />
				<canvas ref={canvas} width={size} height={size} className={`absolute rounded-full left-0 top-0 w-full h-full z-10 ${symbol.revealed && 'scale-150 opacity-0'} transition-all duration-1000 ease-out`} />
			</div>
		</motion.div>
	</div>
}

function Encounter ({ handleReveal, encounter }) {
	const spring = {
		type: 'tween',
		duration: 0.7,
		ease: 'anticipate'
	}

	const variants = {
		initial: {
			x: '-100%'
		},
		animate: {
			x: '0%'
		}
	}

	return (
		<motion.div
			transition={spring}
			className='h-full max-w-md flex flex-col justify-between bg-black w-full text-center py-8 px-4 absolute top-0 left-0 touch-none'
			variants={variants}
			initial='initial'
			animate='animate'
			exit='initial'
		>
			<div className='relative capitalize text-xl font-semibold text-neutralise'>Security System</div>

			<div className='flex flex-col space-y-8 justify-center items-center'>
				<div className='text-txt-grey w-4/5 mx-auto italic'>scratch to reveal if you’ve tripped the security system</div>
				<div className='flex flex-col space-y-6 justify-center items-center w-11/12'>
					<div className='flex space-x-6 justify-center items-center w-full'>
						<Scratch symbol={encounter.scratch[0]} handleReveal={() => handleReveal(0)} />
						<Scratch symbol={encounter.scratch[1]} handleReveal={() => handleReveal(1)} />
					</div>

					<div className='flex space-x-6 justify-center items-center w-full'>
						<Scratch symbol={encounter.scratch[2]} handleReveal={() => handleReveal(2)} />
						<Scratch symbol={encounter.scratch[3]} handleReveal={() => handleReveal(3)} />
					</div>
				</div>
				<div className='text-txt-grey w-4/5 mx-auto italic'>3 of a kind spells danger</div>
			</div>

			<div />
		</motion.div>
	)
}

export default Encounter
