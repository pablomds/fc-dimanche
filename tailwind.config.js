/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'], // Ajout de la police Montserrat
      },
      keyframes: {
        fcAnimation: {
          '0%': { transform: 'translateY(-100%) translateX(150%)' },  
          '50%': { transform: 'translateY(-0%) translateX(150%)' },  
          '100%': { transform: 'translateX(0%)' }     
        },
        dimancheAnimation: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-100%)' 
          },  
          '50%': { opacity: '1', transform: 'translateX(0)' },     
          '100%': { opacity: '1', transform: 'translateX(0)' }     
        },
        apparitionAnimation: {
          '0%': { opacity: '0', transform: 'translateY(100%)', pointerEvents: 'none' },
          '50%': { opacity: '0', transform: 'translateY(100%)', pointerEvents: 'none' },
          '100%': { opacity: '1', transform: 'translateY(0%)', pointerEvents: 'auto'}
        }
      },
      animation: {
        fcAnimation: 'fcAnimation 2s ease-in-out forwards',  
        dimancheAnimation: 'dimancheAnimation 2s ease-in-out 1s forwards',  
        apparition: 'apparitionAnimation 1s ease-in-out 1.5s forwards',
        apparitionFormMatchCreation: 'apparitionAnimation 0.5s ease-in-out',
        apparitionButton: 'apparitionAnimation 2s forwards',
      }
    }
  },
  plugins: [],
}