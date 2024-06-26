# frontend-palletsync

# How to Run

## NodeJS 
```
Install NodeJS
```

## NPM setup
```
npm install -g @vue/cli
```
## Project setup
```
npm install
```

## Environments setup
view .env file and change accordingly
```
Database URLs: Change URLs based on chosen database method (Localhost or Hosted).
Face Recognition URLs: Change URLs based on local camera's ip.
Raspberry pi URLs: Change URLs based on raspberry pi's ip.
```

### Run project
```
npm run dev
```

### Visual Studio Code Extentions
```
ESLint
Prettier ESLint
Prettier - Code formatter
Typescript Vue Plugin (Volar)
Vue Language Features (Volar)
```

### Dependencies versions
```
{
  "name": "cabin-view-ui",
  "version": "0.0.0",
  "private": true,
  "types": "vite-plugin-eslint/dist/index.d.ts",
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "test:unit": "vitest",
    "build-only": "vite build",
    "type-check": "vue-tsc --noEmit -p tsconfig.vitest.json --composite false",
    "lint": "eslint --ext .ts,.js,.cjs,.vue --ignore-path .gitignore --fix src",
    "format": "prettier .  --write"
  },
  "dependencies": {
    "pinia": "^2.1.7",
    "vue": "^3.3.4",
    "vue-router": "^4.2.5"
  },
  "devDependencies": {
    "@rushstack/eslint-patch": "^1.3.3",
    "@tsconfig/node18": "^18.2.2",
    "@types/jsdom": "^21.1.3",
    "@types/node": "^18.18.5",
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "@typescript-eslint/parser": "^6.11.0",
    "@vitejs/plugin-vue": "^4.4.0",
    "@vue/eslint-config-prettier": "^8.0.0",
    "@vue/eslint-config-typescript": "^12.0.0",
    "@vue/test-utils": "^2.4.1",
    "@vue/tsconfig": "^0.4.0",
    "cors": "^2.8.5",
    "eslint": "^8.54.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-vue": "^9.18.1",
    "jsdom": "^22.1.0",
    "npm-run-all2": "^6.1.1",
    "prettier": "3.1.0",
    "primeicons": "^6.0.1",
    "primevue": "^3.50.0",
    "sass": "^1.69.5",
    "typescript": "^5.2.2",
    "vite": "^4.4.11",
    "vite-plugin-eslint": "^1.8.1",
    "vitest": "^0.34.6",
    "vue-tsc": "^1.8.19"
  }
}
```

### To use prettier formatting.
```
// Code/User/settings.json
"editor.formatOnSave": true,
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
},
"[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
