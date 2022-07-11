const Upgrades = {
	'quick-fix': {
		name: 'Quick Fix',
		effect: {
			change: 'stamina',
			value: 1
		}
	},
	'first-aid': {
		name: 'First Aid',
		effect: {
			change: 'stamina',
			value: 2
		}
	},
	'spare-pin': {
		name: 'Spare Pin',
		effect: {
			change: 'lockpick',
			value: 1,
			isSkill: true
		}
	},
	'schematics': {
		name: 'Schematics',
		effect: {
			change: 'lockpick',
			value: 2,
			isSkill: true
		}
	},
	'broken-chip': {
		name: 'Broken Chip',
		effect: {
			change: 'hack',
			value: 1,
			isSkill: true
		}
	},
	'root-access': {
		name: 'Root Access',
		effect: {
			change: 'hack',
			value: 2,
			isSkill: true
		}
	},
	'man-machine': {
		name: 'Man & Machine',
		effect: {
			change: 'neutralise',
			value: 1,
			isSkill: true
		}
	},
	'factory-defect': {
		name: 'Factory Defect',
		effect: {
			change: 'neutralise',
			value: 2,
			isSkill: true
		}
	},
	'sonic-boots': {
		name: 'Sonic Boots',
		effect: {
			change: 'actions',
			value: 1
		}
	},
	'shortcut': {
		name: 'Shortcut',
		effect: {
			change: 'actions',
			value: 2
		}
	}
}

export default Upgrades
