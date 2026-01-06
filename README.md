# Mitsui

> A modern web application for calculating fuel savings when switching from conventional vehicles to Toyota hybrid models.

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.17-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.86.0-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Mitsui is a fuel savings calculator that enables users to compare the operational costs of their current vehicle against Toyota hybrid models. The application provides accurate monthly and annual savings projections based on real fuel efficiency data and user-specific consumption patterns.

### Key Capabilities

- Precise fuel savings calculations based on actual vehicle performance data
- Multi-step wizard interface for intuitive user experience
- Comprehensive comparison across all available Toyota hybrid models
- Annual savings projections with detailed cost breakdowns
- Responsive design optimized for all device sizes
- Real-time data integration with Supabase backend

---

## Features

**Core Functionality**
- Three-step calculation workflow
- Dynamic vehicle data loading from database
- Real-time savings calculations
- Multiple hybrid model comparisons
- Detailed annual cost projections

**Technical Features**
- Type-safe development with TypeScript
- Modern component architecture using React 19
- Server-side data management with Supabase
- Utility-first styling with TailwindCSS
- Component library based on Radix UI primitives

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool and dev server |
| TailwindCSS | 4.1.17 | Styling framework |
| shadcn/ui | Latest | Component system |
| Lucide React | 0.555.0 | Icon library |

### Backend

| Technology | Purpose |
|------------|---------|
| Supabase | Backend as a Service |
| PostgreSQL | Relational database |
| Supabase Client | API integration |

### Development Tools

- **ESLint** - Code linting and quality
- **Bun** - Fast package manager
- **TypeScript ESLint** - TypeScript-specific linting rules

---

## Prerequisites

Ensure the following are installed on your system:

- **Node.js** - Version 18.x or higher
- **Bun** or **npm** - Package manager
- **Supabase Account** - Free tier available at [supabase.com](https://supabase.com)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mitsui.git
cd mitsui
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Using npm:
```bash
npm install
```

---

## Configuration

### Database Setup

Create the following tables in your Supabase project:

#### Brands Table

```sql
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

#### Models Table

```sql
CREATE TABLE models (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES brands(id),
  name VARCHAR(255) NOT NULL
);
```

#### Versions Table

```sql
CREATE TABLE versions (
  id SERIAL PRIMARY KEY,
  model_id INTEGER REFERENCES models(id),
  specific_version VARCHAR(255) NOT NULL,
  km_per_gallon DECIMAL(10,2) NOT NULL,
  is_hybrid BOOLEAN DEFAULT FALSE,
  image_url TEXT
);
```

#### Configuration Table

```sql
CREATE TABLE config (
  key VARCHAR(255) PRIMARY KEY,
  value DECIMAL(10,2) NOT NULL,
  description TEXT
);

-- Insert fuel price configuration
INSERT INTO config (key, value, description) 
VALUES ('FUEL_PRICE_PER_LITER', 5.50, 'Current fuel price per liter in local currency');
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** Obtain these credentials from your Supabase dashboard under `Settings > API`.

### Data Population

Populate the database with:
- Vehicle brands (manufacturers)
- Vehicle models for each brand
- Specific versions with fuel efficiency data
- Mark Toyota hybrid versions with `is_hybrid = true`

---

## Usage

### Development Server

Start the development server with hot module replacement:

```bash
bun run dev
```

Access the application at `http://localhost:5173`

### Production Build

Generate optimized production build:

```bash
bun run build
```

Output will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
bun run preview
```

### Code Linting

Run ESLint to check code quality:

```bash
bun run lint
```

---

## Project Structure

```
mitsui/
├── src/
│   ├── api/                          # API layer and services
│   │   ├── services/
│   │   │   └── vehicleService.ts     # Vehicle data operations
│   │   ├── supabaseClient.ts         # Supabase client configuration
│   │   └── types.ts                  # Type definitions
│   ├── assets/                       # Static resources
│   ├── components/
│   │   └── ui/                       # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       └── select.tsx
│   ├── lib/                          # Utility functions
│   ├── pages/
│   │   └── calculator/               # Application pages
│   │       ├── step-one.tsx          # Data input form
│   │       ├── step-two.tsx          # Hybrid comparison
│   │       └── step-three.tsx        # Detailed results
│   ├── styles/
│   │   └── global.css                # Global styles
│   ├── App.tsx                       # Root component
│   └── main.tsx                      # Application entry point
├── public/                           # Public assets
├── index.html                        # HTML template
├── vite.config.ts                    # Vite configuration
├── tsconfig.json                     # TypeScript configuration
├── components.json                   # shadcn/ui configuration
├── package.json                      # Project dependencies
└── README.md                         # Project documentation
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with HMR |
| `bun run build` | Build production-ready application |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint code quality checks |

---

## How It Works

### Application Flow

The application implements a three-step wizard pattern:

**Step 1: User Input**
- Select vehicle brand and model
- Enter monthly fuel expenditure
- Validate form data

**Step 2: Hybrid Comparison**
- Display calculated monthly distance
- Show comparison cards for all Toyota hybrid models
- Present savings potential for each model
- Allow user to select preferred hybrid

**Step 3: Detailed Results**
- Show annual savings projection
- Display comparative cost analysis
- Present hybrid technology benefits
- Provide navigation options

### Calculation Methodology

The application uses the following formulas:

**Monthly Distance Calculation:**
```
monthly_km = (monthly_spending / price_per_liter) × (km_per_gallon / 3.78541)
```

**Hybrid Monthly Spending:**
```
hybrid_spending = (monthly_km / hybrid_km_per_gallon) × price_per_gallon
```

**Monthly Savings:**
```
savings = current_spending - hybrid_spending
```

**Annual Savings:**
```
annual_savings = monthly_savings × 12
```

**Constants:**
- 1 gallon = 3.78541 liters
- Fuel price obtained from database configuration

---

## Contributing

Contributions are welcome. Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/feature-name`
3. Make your changes with clear, descriptive commits
4. Ensure all tests pass and linting is clean
5. Push to your fork: `git push origin feature/feature-name`
6. Submit a pull request with a detailed description

### Code Standards

- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Ensure TypeScript types are properly defined

### Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, browser, Node version)
- Screenshots or error logs if applicable

---

## Roadmap

**Planned Features**
- User authentication and profile management
- Calculation history and saved comparisons
- Extended brand support beyond Toyota
- Long-term savings visualization with charts
- PDF export functionality
- Dark mode support
- Progressive Web App (PWA) capabilities
- Multi-language support (i18n)
- Real-time fuel price API integration

**Technical Improvements**
- Unit and integration testing
- End-to-end testing with Playwright
- Performance optimization
- CI/CD pipeline implementation
- Error monitoring and analytics

---

## License

This project is private and proprietary.

---

## Contact

For questions or support, please open an issue in the repository.

---

**Built with modern web technologies and best practices.**
