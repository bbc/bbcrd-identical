import { createContext, useContext } from 'react'

export const SoundContext = createContext()

export function usePlaySound () {
	const ctx = useContext(SoundContext)

	return ctx.playSound
}
