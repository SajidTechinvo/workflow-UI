# Workflow Builder - Frontend

Modern React frontend for the Workflow & Form Builder Platform.

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling and validation
- **Shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment is already configured:
   - `.env` file created with backend API URL: `https://localhost:7138/api`
   - See `ENV_SETUP.md` for configuration details

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/          # Shadcn/ui base components
│   └── layout/      # Layout components (Sidebar, Navbar)
├── pages/            # Page components
│   ├── auth/        # Authentication pages
│   └── dashboard/   # Dashboard and feature pages
├── services/         # API service functions
├── stores/           # Zustand stores
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
│   ├── api.ts       # Axios instance and interceptors
│   └── utils.ts     # Helper functions
└── types/            # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Design System

This project follows the design guidelines in `FrontendGuide/CURSOR_UI_PROMPT.md`:

- Modern, clean aesthetic inspired by Linear, Vercel, Stripe
- Professional color palette with high contrast
- Consistent spacing and typography
- Smooth micro-interactions
- Mobile-first responsive design

## Features

### ✅ Completed
- ✅ **Project Setup** - Vite + React + TypeScript configured
- ✅ **Authentication** - Login/Register pages with form validation
- ✅ **Protected Routes** - Route guards and authentication checks
- ✅ **Dashboard** - Stats cards and quick actions
- ✅ **Layout System** - Responsive sidebar and navbar
- ✅ **UI Components** - Shadcn/ui base components (Button, Card, Input, Label, Badge)
- ✅ **State Management** - Zustand store with persistence
- ✅ **API Integration** - Axios client with token refresh
- ✅ **Toast Notifications** - Sonner integration
- ✅ **Environment Configuration** - Configured for backend at `https://localhost:7138/api`

### 🚧 In Progress / Coming Soon
- 🚧 Workflow builder UI
- 🚧 Form builder UI
- 🚧 Analytics dashboard
- 🚧 Workspace management pages

## API Integration

The frontend connects to the backend API at `VITE_API_BASE_URL`. Make sure your backend is running and accessible.

## License

Private project

