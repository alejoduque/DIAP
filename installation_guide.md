# Bioacoustic Algorand Demo - macOS Installation Guide

## Prerequisites

1. **Node.js**: Install the latest LTS version (18.x or higher)
   ```bash
   # Using Homebrew (recommended)
   brew install node

   # Or download from nodejs.org
   # https://nodejs.org/en/download/
   ```

2. **Verify installation**:
   ```bash
   node --version    # Should show v18.x.x or higher
   npm --version     # Should show 9.x.x or higher
   ```

## Setup Instructions

### Step 1: Create a new React project

```bash
# Create the project directory
npx create-react-app bioacoustic-algorand-demo --template typescript
cd bioacoustic-algorand-demo
```

### Step 2: Install dependencies

```bash
# Install required dependencies (latest version for React 19 compatibility)
npm install lucide-react

# Install Tailwind CSS and its dependencies
npm install -D tailwindcss postcss autoprefixer
```

### Step 3: Configure Tailwind CSS

```bash
# Initialize Tailwind configuration
npx tailwindcss init -p
```

Replace the content of `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
```

### Step 4: Add Tailwind directives and custom animations

Replace the content of `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

/* Custom animations for the bioacoustic demo */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from { transform: scale(0.8) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Step 5: Replace App.tsx

Replace the content of `src/App.tsx` with the BioacousticAlgorandDemo component code from your paste.txt file.

### Step 6: Update package.json (optional)

Replace your `package.json` with the one provided above for better organization.

## Running the Application

1. **Start the development server**:
   ```bash
   npm start
   ```

2. **Open your browser** to [http://localhost:3000](http://localhost:3000)

The application should now be running and you'll see the Bioacoustic Algorand Demo interface.

## Project Structure

```
bioacoustic-algorand-demo/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.tsx              # Main component
│   ├── index.tsx           # React entry point
│   ├── index.css           # Tailwind styles
│   └── ...
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Troubleshooting

### Common Issues:

1. **Node.js version issues**:
   ```bash
   # Check your Node version
   node --version
   
   # If too old, update via Homebrew
   brew upgrade node
   ```

2. **Port 3000 already in use**:
   ```bash
   # Kill the process using port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Or run on a different port
   PORT=3001 npm start
   ```

3. **Tailwind styles not loading**:
   - Make sure you've imported `./index.css` in your `src/index.tsx`
   - Verify the Tailwind directives are in `src/index.css`
   - Restart the development server

4. **TypeScript errors**:
   - The component uses TypeScript interfaces, ensure you created the project with the TypeScript template
   - Check that all imports are correctly typed

## Optional Enhancements

### Development Tools (optional):
```bash
# Install useful VS Code extensions
# - ES7+ React/Redux/React-Native snippets
# - Tailwind CSS IntelliSense
# - TypeScript Importer

# Install React Developer Tools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
```

### Production Build:
```bash
# Create optimized production build
npm run build

# Serve the build locally (optional)
npx serve -s build
```

## Features

Once running, you'll have access to:
- Interactive bioacoustic recording analysis
- Real-time neural processing visualization  
- Algorand blockchain integration simulation
- Token generation and ASA creation workflow
- Georeferenced environmental data visualization
- Responsive design optimized for desktop and mobile

The demo showcases the complete pipeline from audio analysis to blockchain tokenization, specifically designed for environmental conservation and biodiversity tracking applications.