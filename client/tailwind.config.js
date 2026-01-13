/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0F172A', // Slate 900
                secondary: '#3B82F6', // Blue 500
                accent: '#8B5CF6', // Violet 500
            },
        },
    },
    plugins: [],
}
