const colors = require('tailwindcss/colors')

module.exports = {
	mode: (process.env.NODE_ENV === 'production' ? '' : 'jit'),
	purge: {
		content: ["./src/_includes/layouts/**/*.njk", "./src/*.njk"],
		options: {
			keyframes: true
		},
	},
	theme: {
		screens: {
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},
		extend: {
			maxWidth: {
				'prose-full': '85ch',
				'prose': '65ch',
				'prose-short': '45ch'
			},
			padding: {
				'16/9': '56.25%'
			},
			flexGrow: {
				'2': 1,
			},
			colors: {
				'primary-bg': 'var(--primary-bg)',
				'primary-bg-translucent': 'var(--primary-bg-translucent)',
				'header-bg': 'var(--header-bg)',
				'opposite-bg': 'var(--opposite-bg)',
				'primary-border': 'var(--primary-border)',
				'primary-text': 'var(--primary-text)',
				'secondary-bg': 'var(--secondary-bg)',
				'accent': 'var(--accent)',
			},
			boxShadow: {
				DEFAULT: '0 0px 6px -1px rgba(0,0,0,0.1), 0 0px 5px -1px rgba(0,0,0,.06)',
				lg: '0 0px 12px -3px rgba(0,0,0,0.6), 0 0px 6px -1px rgba(0,0,0,.06)',
			},
			fontFamily: {
				heading: ['DM Serif Display', 'serif'],
				body: ['Montserrat', 'sans-serif']
			},
		}
	},
	variants: {
		extend: {
			fontWeight: ['hover'],
			transform: ['hover']

		}
	},
	plugins: [],
};