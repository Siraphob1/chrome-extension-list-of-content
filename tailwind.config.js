/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				system: [
					"-apple-system",
					"BlinkMacSystemFont",
					'"Segoe UI"',
					'"Roboto"',
					"sans-serif",
				],
			},
			borderWidth: {
				3: "3px",
			},
		},
	},
	plugins: [],
};
