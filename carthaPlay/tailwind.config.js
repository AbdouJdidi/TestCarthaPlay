/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        secondary: '#0cbfdf',   
        primary: '#2197bd',
        dark : '#051c49'  
      },
      backgroundImage: {
        'light-dark-gradient': 'linear-gradient(to right, #87cdea, #6888c3)',
      },
    },
  },
  plugins: [],
};
