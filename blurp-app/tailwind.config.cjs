/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      /* Tried to place the colors as close as I could against 
      the default Tailwind colors 
      Default colors from: https://tailwindcss.com/docs/customizing-colors 
      */
      colors: {
        neutral: {
          75: '#fcfcfc',
        },
        violet: {
          750: '#543cda',
        },
        purple: {
          750: '#7e34c9',
        },
        fuchsia: {
          750: '#a92cb8',
        },
        pink: {
          550: '#d424a7',
        },
      },
    },
  },
  plugins: [],
};
