module.exports = {
	env: {
		HOST: process.env.HOST,
		PORT: process.env.PORT
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// the project has ESLint errors.
		ignoreDuringBuilds: true
	}
}
