# Client - Developer Roadmap Platform

React frontend application for the Developer Roadmap Platform, built with Vite and Tailwind CSS.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` with hot module replacement (HMR).

### Build

```bash
npm run build
```

Production build output goes to `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/     # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── RoleCard.jsx
│   │   ├── RoadmapNode.jsx
│   │   └── RoadmapConnector.jsx
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   └── roadmap/
│   │       ├── DeveloperReadiness.jsx
│   │       ├── FrontendRoadmap.jsx
│   │       └── OnboardingRoadmap.jsx
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles and Tailwind imports
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.js      # Vite configuration
└── postcss.config.js   # PostCSS configuration
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling. Configuration is in `tailwind.config.js`.

### Design System

- **Colors**: Dark theme (`zinc-950`, `zinc-100`) with yellow accent tiles (`yellow-300`)
- **Components**: Custom styled components with consistent shadows and borders
- **Responsive**: Mobile-first responsive design

### Key Components

- **RoadmapNode**: Yellow rounded tiles with black borders and shadows
- **RoadmapConnector**: Blue vertical/horizontal connectors (solid or dashed)
- **Navbar**: Dark sticky navigation bar
- **RoleCard**: Clickable roadmap category cards

## 🛠️ Technologies

- **React 19**: UI library
- **Vite 7**: Build tool and dev server
- **React Router 7**: Client-side routing
- **Tailwind CSS 3**: Utility-first CSS framework
- **ESLint**: Code linting

## 📦 Dependencies

### Production

- `react`: ^19.2.0
- `react-dom`: ^19.2.0
- `react-router-dom`: ^7.13.0

### Development

- `@vitejs/plugin-react`: React plugin for Vite
- `tailwindcss`: CSS framework
- `autoprefixer`: CSS vendor prefixing
- `eslint`: Code linting

## 🗺️ Routes

- `/` - Home page with roadmap tiles
- `/roadmap/onboarding` - Onboarding checklist
- `/roadmap/readiness` - Developer readiness roadmap
- `/roadmap/frontend` - Frontend development roadmap

## 🎯 Features

- **Interactive Roadmaps**: Click tiles to view detailed resources
- **Slide-in Drawer**: Right-side panel for resource details
- **Progress Tracking**: Visual progress indicators
- **Responsive Design**: Works on mobile, tablet, and desktop

## 🔧 Configuration

### Vite

Configuration in `vite.config.js`. Uses React plugin for JSX transformation.

### Tailwind

Configuration in `tailwind.config.js`. Content paths configured for `src/**/*.{js,ts,jsx,tsx}`.

### ESLint

ESLint configuration in `eslint.config.js` with React hooks and refresh plugins.

## 📝 Development Notes

- Components use functional React hooks
- State management via `useState` hooks
- Routing handled by React Router
- All styles use Tailwind utility classes
- Components are modular and reusable

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically use the next available port.

### Build Issues

Clear `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Not Working

Ensure `index.css` imports Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
