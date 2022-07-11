// Component replaces specially formatted text (<x/y>) by the Token
// component passed as a prop. Used to display objectives.

function AugmentedText ({ Token, Partial = (t) => t, children, className }) {
	return (
		<p className={className}>
			{children.split(/<([^>]+)>/).map((capture, i) => {
				if (i % 2 === 1) {
					const [str, attr] = capture.split('/')

					return <Token key={str + attr} str={str} attr={attr} />
				}
				else {
					// Because we use a typewriter effect, we have to hold back when we encounter
					// the beginning of a token but not the end. We don't want the token to be read as text
					// until it's actually finished, otherwise it'll look like this: <in core/m
					return capture.split(/<([^>]+)/).map((partial, j) => {
						if (j % 2 === 1) {
							return <Partial key={partial} partial={partial.split('/')[0]} />
						}
						else {
							return partial
						}
					})
				}
			})}
		</p>
	)
}

export default AugmentedText
