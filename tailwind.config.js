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
          '0%': { transform: 'translateY(-100%) translateX(150%)' },  // Part du haut
          '50%': { transform: 'translateY(-0%) translateX(150%)' },  // Part du haut
          '100%': { transform: 'translateX(0%)' }     // Revient à la position d'origine
        },
        dimancheAnimation: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-100%)' 
          },  // Part de la gauche
          '50%': { opacity: '1', transform: 'translateX(0)' },     // Atterrit à sa position initiale
          '100%': { opacity: '1', transform: 'translateX(0)' }     // Reste en place pour finir
        },
        apparitionAnimation: {
          '0%': { opacity: '0', transform: 'translateY(100%)',},
          '50%': { opacity: '0', transform: 'translateY(100%)',},
          '100%': { opacity: '1', transform: 'translateY(0%)',}
        }
      },
      animation: {
        fcAnimation: 'fcAnimation 2s ease-in-out forwards',  // Animation du logo FC avec retour à la position initiale
        dimancheAnimation: 'dimancheAnimation 2s ease-in-out 1s forwards',  // Animation du logo DIMANCHE avec un retour,
        apparition: 'apparitionAnimation 1s ease-in-out 1.5s forwards',
        apparitionButton: 'apparitionAnimation 1s ease-in-out 2s forwards',
      }
    }
  },
  plugins: [],
}