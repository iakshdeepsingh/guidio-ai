
# Guidio AI — Frontend

<p align="center">
  <strong>An AI-powered career development platform built to help students prepare, improve, and grow.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Responsive-Design-22C55E" alt="Responsive Design" />
</p>

Guidio AI is an AI-powered student platform that brings career guidance, interview preparation, skill assessment, and personalized assistance together in one place.

This repository contains the frontend application, built with **React 19, Vite, and Tailwind CSS 4**.

---

## ✨ Overview

Guidio AI provides students with an interactive environment to explore career opportunities, evaluate their technical abilities, and prepare for professional growth.

### Core Features

- **AI Student Assistant** — Get personalized academic and career assistance.
- **AI Mock Interviews** — Practice interviews across different fields and improve interview performance.
- **Skill Gap Analysis** — Identify missing skills and receive improvement recommendations.
- **AI Career Guidance** — Explore career opportunities through personalized guidance.
- **Student Dashboard** — Access profile information, progress, and essential platform features in one place.

For complete project documentation, including Windows 11 setup, environment variables, LAN access, deployment, and troubleshooting, see the [Root README](../README.md).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI development |
| Vite | Development server and production build tool |
| Tailwind CSS 4 | Utility-first styling and responsive design |
| React Router | Client-side navigation |
| ESLint | Code quality and linting |

---

## 🚀 Getting Started

Follow these instructions to run the frontend application locally.

### Prerequisites

Make sure the following tools are installed:

- **Node.js 22.22 or newer**
- npm
- Git

### 1. Clone the Repository

```bash
git clone YOUR_FRONTEND_REPOSITORY_URL
cd guidio-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create your local environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**macOS / Linux:**

```bash
cp .env.example .env.local
```

Open `.env.local` and configure the required frontend environment variables.

> Never commit `.env.local` or expose private credentials in your repository.

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, normally:

```text
http://localhost:5173
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server on port 5173 |
| `npm run build` | Generates an optimized production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check code quality |

---

## 🌐 LAN Access

The development server can also be accessed from other devices connected to the same local network when configured to listen on the network interface.

For complete instructions on accessing Guidio AI from another device, refer to the [Root README](../README.md).

---

## 📦 Production Build

Generate an optimized production build:

```bash
npm run build
```

The generated production files will be available inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🚀 Deployment

The frontend is designed for deployment on platforms such as **Vercel**.

### Deployment Configuration

| Setting | Value |
|---|---|
| Framework | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### Before Deployment

1. Configure all required environment variables in your hosting platform.
2. Select the correct frontend repository and root directory.
3. Set the installation command to `npm install`.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Complete the deployment and verify the application.

Refer to the [Root README](../README.md) for complete deployment instructions.

---

## ⚙️ Development Guidelines

- Keep frontend environment variables in `.env.local`.
- Never commit private credentials or secret keys.
- Organize reusable UI components properly.
- Follow the existing project structure when adding new features.
- Maintain responsive layouts across desktop, tablet, and mobile devices.
- Run `npm run lint` before committing changes.
- Run `npm run build` to verify the production build.

---

## 📄 License

See the root repository documentation for licensing information.

---

<p align="center">
  <strong>Guidio AI</strong>
  <br />
  <em>Learn. Prepare. Improve. Grow.</em>
</p>
