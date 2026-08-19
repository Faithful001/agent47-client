# Agent47 Client

Agent47 Client is the modern web frontend for Agent47, an autonomous AI code review and continuous integration intelligence platform. Built with React 19, TypeScript, TanStack Router, TanStack Query, and Tailwind CSS v4, Agent47 Client provides developers and engineering teams with an intuitive dashboard to monitor repository builds, analyze pull request diffs, inspect CI logs, and configure AI-driven code resolution workflows.

---

## Features

### Repository Onboarding & Configuration
* **One-Click Repository Tracking**: Discover and connect GitHub repositories directly from your connected account.
* **Custom Build Pipelines**: Set custom install, build, test, and start commands alongside project root directory definitions.
* **Environment Variable Management**: Dynamically add and configure key-value environment variables per repository.

### CI Build & Deployment Monitoring
* **Real-Time Status Tracking**: Monitor builds across statuses including Passed, Failed, Building, and Pending.
* **Infinite Scroll History**: View historical builds per repository with automated pagination powered by Intersection Observer APIs.
* **Commit & Branch Context**: Track pusher avatars, branch names, commit titles, descriptions, and short SHA hashes.

### Deep AI Analysis & Visual Inspection
* **File-by-File Diff Viewer**: Inspect commit changes with color-coded additions, deletions, hunk numbers, and file change summaries.
* **Structured Build Log Viewer**: Browse grouped logs across install, build, and test phases with automated error line detection.
* **Automated AI Issue Summaries**: View AI-generated root cause analyses, critical issue breakdowns, and suggested fix pull request links.

### Multi-Provider LLM & Agent Engine Settings
* **Flexible AI Provider Routing**: Route AI agent queries through OpenRouter, Google Gemini, OpenAI GPT, Anthropic Claude, or Groq.
* **Model Hyperparameter Tuning**: Adjust model selection (including Gemini 1.5 Pro, Claude 3.5 Sonnet, GPT-4o, and DeepSeek Coder) alongside sampling temperature.
* **Secure API Key Management**: Store and view masked API keys with Fernet symmetric encryption safeguards.

### Webhook & Platform Management
* **GitHub Webhook Integration**: View automatically generated webhook payload URLs and secret tokens for GitHub integration.
* **Developer Profile & Analytics**: Track account statistics including resolution rates, average build durations, and interactive activity logs.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework & Runtime** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 7](https://vite.dev/) |
| **Routing** | [TanStack Router](https://tanstack.com/router) (File-based routing with automatic code splitting) |
| **State & Data Fetching** | [TanStack Query v5](https://tanstack.com/query) (Async state & caching), [Zustand](https://github.com/pmndrs/zustand) (Client auth state) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`), [Lucide React](https://lucide.dev/), [Radix UI](https://www.radix-ui.com/), [Sonner](https://sonner.emilkowal.si/) |
| **HTTP & Security** | [Axios](https://axios-http.com/) (Interceptors & Auth headers), [Fernet](https://github.com/csquared/fernet.js) (Symmetric key encryption) |
| **Testing** | [Vitest](https://vitest.dev/), [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) |

---

## Project Structure

```
agent47-client/
├── public/                     # Static assets (logos, icons)
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Atomic UI elements
│   │   │   ├── buttons/        # Custom styled buttons
│   │   │   ├── modals/         # Reusable dialogs (e.g. DeleteModal)
│   │   │   ├── Aurora.tsx      # WebGL background visual effects
│   │   │   ├── build-log-viewer.tsx  # CI log parser and viewer
│   │   │   └── diff-viewer.tsx       # Code diff and hunk viewer
│   │   ├── Footer.tsx          # Global footer component
│   │   ├── Header.tsx          # Navigation header
│   │   └── ThemeToggle.tsx     # Theme switcher control
│   ├── lib/                    # Utilities and API setup
│   │   ├── utils/              # Crypto and error helper utilities
│   │   │   ├── crypto.ts       # Fernet encryption and decryption helpers
│   │   │   └── get-error-message.ts # Standardized error message extraction
│   │   └── api.ts              # Axios instance with auth interceptors
│   ├── routes/                 # TanStack file-based routes
│   │   ├── __root.tsx          # Root app layout and provider wrapper
│   │   ├── _authenticated.tsx  # Auth guard layout with sidebar nav
│   │   ├── _authenticated/     # Protected route tree
│   │   │   └── dashboard/      # Main application pages
│   │   │       ├── index.tsx   # Repositories dashboard overview
│   │   │       ├── profile.tsx # Developer profile and activity timeline
│   │   │       ├── settings.tsx# Agent engine and API key configuration
│   │   │       └── repos/      # Repository management and build details
│   │   │           ├── add.tsx # Import and configure repository
│   │   │           ├── $repoId.tsx # Repo detail and build list
│   │   │           └── builds/
│   │   │               └── $buildId.tsx # Full build analysis view
│   │   ├── index.tsx           # Public landing page
│   │   ├── login.tsx           # Authentication page
│   │   ├── privacy.tsx         # Privacy policy page
│   │   ├── about.tsx           # About platform page
│   │   └── auth.callback.tsx   # OAuth callback handler
│   ├── store/                  # Global Zustand state stores
│   │   └── auth.ts             # Auth session and user state management
│   ├── types/                  # TypeScript interface definitions
│   │   ├── index.ts            # Base API response types
│   │   └── repo.type.ts        # Repository, build, diff and issue models
│   ├── main.tsx                # Client application entry point
│   ├── router.tsx              # TanStack router initialization
│   ├── routeTree.gen.ts        # Auto-generated TanStack route tree
│   └── styles.css              # Main CSS imports and utility styles
├── index.html                  # HTML template entry
├── package.json                # Project dependencies and script runner
├── tsconfig.json               # TypeScript compiler config
├── vercel.json                 # Vercel deployment rewrite rules
└── vite.config.ts              # Vite plugin configuration
```

---

## Environment Variables

Create a `.env` file in the project root directory with the following configuration:

```env
# URL for the Agent47 backend server
VITE_API_BASE_URL=https://agent47-server.pxxl.click/api/v1

# Encryption key used for client-side credential encryption (Fernet key format)
VITE_ENCRYPTION_KEY=your_fernet_secret_key_here
```

---

## Getting Started

### Prerequisites
Ensure Node.js (version 18 or higher) and npm are installed on your environment.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Faithful001/agent47-client.git
   cd agent47-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory following the environment variables section above.

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` in your web browser to open the application.

---

## Available Scripts

In the project directory, you can run:

* `npm run dev`: Starts the local Vite development server on port 3000 with hot module replacement (HMR).
* `npm run build`: Compiles TypeScript code and packages static production assets into the `dist/` folder.
* `npm run preview`: Launches a local server to preview the built `dist/` production bundle.
* `npm run test`: Runs unit tests using Vitest.

---

## Authentication & Architecture Flow

1. **OAuth Authentication**: When a user authenticates via GitHub, the backend completes OAuth processing and passes a bearer token back to the client via the `/auth/callback` route.
2. **Session Persistence**: The client stores the bearer token in local storage and executes `checkSession()` through the Zustand auth store to load the user profile.
3. **API Interceptors**: All HTTP calls made with the shared `api` Axios client attach the bearer authorization header automatically. If a call returns `401 Unauthorized`, local tokens are cleared and the user state is reset.
4. **Route Guarding**: The TanStack Router layout for `_authenticated` validates active user session state before rendering protected pages, redirecting unauthenticated requests back to the home view.
