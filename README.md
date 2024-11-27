# FC Dimanche 
FC Dimanche allows users to create or join games in just a few clicks, thanks to an intuitive app. Users can invite friends directly, discuss match details, and confirm their participation with ease.

Built using React and TypeScript/JavaScript, FC Dimanche ensures a fast, responsive, and interactive user experience. React’s component-based architecture makes the interface easy to navigate and visually engaging, while TypeScript adds reliability and scalability, reducing errors in code and making the app maintainable as it grows. The app is backed by Firebase and Google Cloud Platform (GCP), providing real-time data synchronization, secure authentication, and robust data storage. With Firebase, users receive real-time updates on match changes, confirmations, and cancellations, enhancing team coordination and streamlining the organization of pickup games.
## Technical Stack 
FC Dimanche uses React + TypeScript + Vite, Google GCP : Authentication, Database and others cloud functions, Tailwind CSS for styling, and PNPM for package manager.
## Environment Variables

To run this project locally, you need to set up a few environment variables. Create a `.env.local` file in the root directory and include the following variables:

```plaintext
VITE_FIREBASE_API_KEY=XXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=XXXXXXXX
VITE_FIREBASE_PROJECT_ID=XXXXXXXX
VITE_FIREBASE_STORAGE_BUCKET=XXXXXXXX
VITE_FIREBASE_MESSAGING_SENDER_ID=XXXXXXXX
VITE_FIREBASE_APP_ID=XXXXXXXX
VITE_BASE_URL=http://localhost:5173
VITE_ENV=dev
```
Make sure to replace thoses values with real data.

## Run Project Locally

To get started with the project locally, ensure you're in the root project folder (`./fc-dimanche`) and follow these steps:

### Running for the First Time

1. Ensure you are in the root project folder (./fc-dimanche)

2. Install dependencies:
   ```bash
   pnpm install
   ```
### Running on Development Environment
  ```bash 
  pnpm run dev
  ```
## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
## Expanding the ESLint configuration

Remove all branches that are not presented in remote anymore: 

- `git fetch -p && git branch -vv | awk '/: gone]/{print $1}' | xargs git branch -d`