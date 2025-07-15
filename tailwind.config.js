/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        uau: {
          primary: '#667eea',
          'primary-dark': '#764ba2',
          secondary: '#48bb78',
        }
      },
      backgroundImage: {
        'uau-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
}
