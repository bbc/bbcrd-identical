import { useState, useEffect } from 'react'

function getDimensions (ref) {
	if (ref?.current) {
		return ref.current.getBoundingClientRect()
	}
	else {
		return null
	}
}

function useDimensions (ref) {
	const [dimensions, setDimensions] = useState(() => getDimensions(ref))

	useEffect(() => {
		const handleResize = () => setDimensions(getDimensions(ref))
		const resizeObserver = new ResizeObserver(handleResize)

		handleResize()
		window.addEventListener('resize', handleResize)
		resizeObserver.observe(document.body)

		return () => {
			window.removeEventListener('resize', handleResize)
			resizeObserver.unobserve(document.body)
		}
	}, [ref])

	return dimensions
}

export default useDimensions
