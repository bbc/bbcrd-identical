import { Html, Head, Main, NextScript } from 'next/document'

export default function Document () {
	return <Html>
		<Head>
			<link rel='preconnect' href='https://fonts.gstatic.com' />
			<link href='https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap' rel='stylesheet' />

			<link rel='apple-touch-icon' sizes='180x180' href='/static/images/favicon/apple-touch-icon.png' />
			<link rel='icon' href='/static/images/favicon/favicon.ico' type='image/x-icon' />
			<link rel='icon' type='image/png' sizes='32x32' href='/static/images/favicon/favicon-32x32.png' />
			<link rel='icon' type='image/png' sizes='16x16' href='/static/images/favicon/favicon-16x16.png' />
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
}
