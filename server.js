const { Server, Origins } = require('boardgame.io/server')
const { Identical } = require('./game/Identical')

try {
	const server = Server({
		games: [Identical],
		origins: [
			// Allow localhost to connect, except when NODE_ENV is 'production'.
			Origins.LOCALHOST_IN_DEVELOPMENT
		]
	})
	const PORT = process.env.PORT || 8000

	server.run(PORT)
}
catch (err) {
	console.log(err)
}
