import { useState, useCallback, useRef, useEffect } from 'react'
import { Howl, Howler } from 'howler'

Howler.volume(0.5)

export default function useSound (config) {
	const options = useRef(config)
	const bg = useRef({})
	const [instance] = useState(new Howl(options.current))
	const [muted, setMuted] = useState(true)

	const play = useCallback((id) => {
		const { sprite } = options.current

		const playTrack = () => {
			if (sprite && sprite[id] && bg.current.id !== id) {
				const isBg = sprite[id][2]

				if (isBg && bg.current.ref) {
					instance.fade(0.25, 0, 500, bg.current.ref)
				}

				const ref = instance.play(id)

				if (isBg) {
					bg.current = { ref, id }
					instance.volume(0.25, bg.current.ref)
				}
			}
		}

		if (Howler.ctx.state === 'suspended') {
			Howler.ctx.resume().then(playTrack)
		}
		else {
			playTrack()
		}
	}, [instance])

	useEffect(() => {
		Howler.mute(muted)
	}, [muted])

	const mute = useCallback(() => {
		setMuted((muted) => !muted)
	}, [])

	return [play, mute, muted]
}
