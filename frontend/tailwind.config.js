/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                edu: {
                    teal: '#5FB2C0',
                    coral: '#EE6D52',
                    yellow: '#F9C067',
                    deep: '#4A4A4A',
                    cream: '#FDF5E6',
                },
                brand: {
                    deep: '#2D241E',
                    cream: '#FDF5E6',
                },
                tharqiya: {
                    deep: '#1F2937', // A deep charcoal
                    gold: '#D97706', // A rich gold
                    orange: '#EA580C', // A vibrant orange
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
