# StakeYourTake - Bitcoin Prediction Platform

🚀 **Decentralized Bitcoin prediction market built on OP_NET blockchain**

## ✨ Features

- **📊 Bitcoin Predictions** - Make predictions on Bitcoin price movements
- **💰 Multi-Token Support** - Stake with BTC, MOTO, and PIIL tokens
- **⚡ Blockchain Integration** - Real OP_NET blockchain transactions
- **🎯 Gamified Experience** - Earn reputation, badges, and rewards
- **💎 Beautiful UI** - Modern design with animations and golden rain effects
- **📱 Responsive Design** - Works perfectly on desktop and mobile

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Blockchain**: OP_NET + OP20 Tokens
- **Deployment**: Vercel + GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/stakeyourtake.git
cd stakeyourtake
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
