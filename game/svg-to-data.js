const { random } = require('lodash')
const { nanoid } = require('nanoid')
const { parse } = require('svg-parser')
const svgPathBbox = require('svg-path-bbox')
const fs = require('fs').promises

const main = async (file) => {
	const data = await fs.readFile(file, 'utf-8')
	const tree = parse(data)
	const elements = tree.children[0].children[0]

	const board = {
		rooms: [],
		doors: []
	}

	elements.children.forEach((el) => {
		if (el.tagName === 'rect') { // it's a door
			const { id, x, y, width, height, transform, fill } = el.properties
			const isVertical = !!transform
			const disabled = fill === '#C4C4C4'

			board.doors.push({
				isVertical,
				x: x + (isVertical ? height : width) / 2,
				y: y + (isVertical ? -width : height) / 2,
				rooms: id.split('-'),
				disabled
			})
		}
		else if (el.tagName === 'g' && el.children.find((e) => e.tagName === 'path')) { // it's a room
			const room = {
				id: el.properties.id,
				playerPositions: [],
				enemyPositions: [],
				enemies: []
			}

			// Look at what's inside the room
			el.children.forEach((child) => {
				if (child.tagName === 'path') {
					room.outline = child.properties.d
					room.bounds = svgPathBbox(room.outline)

					if (child.properties.stroke === '#FECA19') { // start room is yellow
						room.start = true
						room.visited = true
					}
				}
				else if (child.tagName === 'circle') {
					const { cx, cy, r } = child.properties

					// Circles can be:
					// - Player positions (small)
					// - Enemy positions (medium)
					// - Room label (large)

					if (r === 10) {
						room.playerPositions.push({ x: cx, y: cy })
					}
					else if (r === 21) {
						room.enemyPositions.push({ x: cx, y: cy, r: random(-45, 45, false) })
					}
					else if (r === 34.5) {
						const visible = child.properties.stroke === '#353535'
						room.label = { x: cx, y: cy, visible }
					}
				}
				else if (child.tagName === 'g') {
					// A group can be a terminal or an enemy

					if (child.children.find((e) => e.tagName === 'rect')) {
						const { x, y, width, height } = child.children.find((e) => e.tagName === 'rect').properties
						const text = child.children.find((e) => e.tagName === 'text').children[0].children[0].value
						const [level, difficulty] = text.split('-').map((n) => Number(n))

						room.terminal = {
							position: {
								x: x + width / 2,
								y: y + height / 2
							},
							level,
							difficulty,
							completed: 0
						}
					}
					else if (child.children.find((e) => e.tagName === 'circle')) {
						const { cx, cy } = child.children.find((e) => e.tagName === 'circle').properties
						const text = child.children.find((e) => e.tagName === 'text').children[0].children[0].value
						const [level, difficulty] = text.split('-').map((n) => Number(n))

						room.enemyPositions.push({ x: cx, y: cy, r: random(-45, 45, false) })
						room.enemies.push({ id: nanoid(), difficulty, level, completed: 0 })
					}
				}
			})

			board.rooms.push(room)
		}
		else if (el.tagName === 'g' && el.children.find((e) => e.tagName === 'rect')) {
			const text = el.children.find((e) => e.tagName === 'text').children[0].children[0].value
			const { id, x, y, width, height, transform } = el.children.find((e) => e.tagName === 'rect').properties
			const isVertical = !!transform
			const [level, difficulty] = text.split('-').map((n) => Number(n))

			board.doors.push({
				isVertical,
				x: x + (isVertical ? height : width) / 2,
				y: y + (isVertical ? -width : height) / 2,
				rooms: id.split('-'),
				lock: {
					level,
					difficulty,
					completed: 0
				}
			})
		}
	})

	console.log(JSON.stringify(board, null, '\t'))
}

main(process.argv.slice(2)[0])
