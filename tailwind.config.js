const Characters = require('./game/Characters')

const characterColors = {}

Characters.forEach(({ color, id }) => {
	characterColors[id] = color
})

module.exports = {
	content: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
	safelist: [
		...Characters.reduce((list, { id }) => [...list, `disabled:bg-${id}`, `bg-${id}`, `text-${id}`, `border-${id}`], []),
		...Object.keys(Characters[0].skills).reduce((list, skill) => [...list, `bg-${skill}`, `text-${skill}`, `border-${skill}`], []),
		'grid-cols-2',
		'grid-cols-3',
		'grid-cols-4'
	],
	theme: {
		fontFamily: {
			mono: ['IBM Plex Mono', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace']
		},
		borderWidth: {
			DEFAULT: '2px',
			0: '0',
			1: '1px',
			2: '2px',
			4: '4px',
			6: '6px',
			8: '8px'
		},
		colors: {
			'transparent': 'transparent',
			'current': 'currentColor',
			'black': '#151515',
			'map-black': '#252525',
			'map-grey': '#353535',
			'middle-grey': '#606060',
			'txt-grey': '#8B8B8B',
			'wall-grey': '#C4C4C4',
			'btn-grey': '#EDEDED',
			'white': '#FAFAFA',
			'neutralise': '#FECA19',
			'lockpick': '#F86132',
			'hack': '#2CED0C',
			'stamina-red': '#e41c1c',
			'corruption': 'silver',
			...characterColors
		},
		fill: (theme) => theme('colors'),
		extend: {
			spacing: {
				'full': '100%',
				'6/5': '120%',
				'7/6': '116%'
			},
			keyframes: {
				heartbeat: {
					'0%': { transform: 'scale(1)' },
					'75%': { transform: 'scale(0.75)' },
					'100%': { transform: 'scale(1)' }
				},
				attention: {
					'0%': { transform: 'scale(1.1)' },
					'75%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1.1)' }
				},
				progress: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0%)' }
				}
			},
			animation: {
				heartbeat: 'heartbeat 0.5s ease-in-out infinite',
				attention: 'attention 0.5s ease-in-out infinite',
				progress: 'progress 3s ease-in-out infinite'
			}
		}
	},
	plugins: [
		require('@tailwindcss/aspect-ratio')
	]
}
