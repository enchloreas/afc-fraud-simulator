# AFC Fraud Simulator

> Anti-Fraud Control Intelligence Engine - A real-time transaction fraud detection demonstration for Aktia Bank

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Overview

AFC Fraud Simulator is an interactive demonstration application that showcases how AI-powered fraud detection systems analyze and respond to financial transactions in real-time. The simulator provides a three-panel interface that visualizes the complete fraud detection pipeline from transaction initiation to customer notification.

### Key Features

- **Real-time Transaction Analysis**: Watch AI reasoning unfold step-by-step as transactions are evaluated
- **Multiple Fraud Scenarios**: Four pre-built scenarios covering legitimate purchases, travel verification, impossible travel detection, and high-risk merchant transactions
- **Interactive Mobile Banking View**: Simulated Aktia Mobile banking app showing customer-facing responses
- **Identity Verification Flow**: Complete verification process for high-risk transactions with approve/decline options
- **Responsive Design**: Full desktop and mobile-optimized views with view mode toggle

## Demo Scenarios

| Scenario | Description | Risk Level | Outcome |
|----------|-------------|------------|---------|
| **Local Purchase** | Normal purchase at Helsinki department store | Low (12/100) | Approved |
| **Known Travel** | Purchase in Thailand with confirmed flight booking | Low (28/100) | Approved |
| **Impossible Travel** | Helsinki to Thailand in 2 hours - no flight history | Critical (97/100) | Blocked |
| **High Risk Merchant** | Large crypto purchase from offshore merchant | Medium (65/100) | Verify Identity or Report Fraud |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AFC Fraud Simulator                       │
├─────────────────┬─────────────────────┬─────────────────────────┤
│  Terminal Panel │   Reasoning Panel   │    Mobile Panel         │
│                 │                     │                         │
│  • Transaction  │  • AI Analysis      │  • Customer View        │
│    Payload      │    Steps            │  • Action Buttons       │
│  • Card Reader  │  • Risk Score       │  • Identity             │
│    Animation    │  • Verdict          │    Verification         │
│  • Status       │                     │  • Fraud Reporting      │
└─────────────────┴─────────────────────┴─────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 16.2 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 4.2
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Charts**: Recharts (for data visualization)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm, npm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/enchloreas/afc-fraud-simulator.git
cd afc-fraud-simulator

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   └── page.tsx            # Main simulator page
├── components/
│   ├── simulator.tsx       # Main simulator orchestrator
│   ├── terminal-panel.tsx  # Payment terminal visualization
│   ├── reasoning-panel.tsx # AI analysis display
│   ├── mobile-panel.tsx    # Mobile banking app simulation
│   ├── scenario-selector.tsx
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── scenarios.ts        # Scenario definitions and data generators
│   ├── types.ts            # TypeScript interfaces
│   └── utils.ts            # Utility functions
└── public/
    └── images/
        └── afc-logo.jpg    # Application logo
```

## How It Works

1. **Select a Scenario**: Choose from four pre-defined fraud scenarios
2. **Run Simulation**: Click "Run Simulation" to start the transaction
3. **Watch Analysis**: Observe the AI reasoning process in real-time
4. **View Results**: See the final verdict and customer notification
5. **Interact**: For verification scenarios, approve or report fraud

### Fraud Detection Signals

The simulator evaluates transactions based on:

- **Geographic Analysis**: Location consistency and travel feasibility
- **Temporal Analysis**: Time between transactions vs. physical distance
- **Merchant Risk**: Category codes and jurisdiction assessment
- **Device Verification**: Terminal type, firmware, and network
- **Behavioral Patterns**: Transaction history and spending patterns
- **External Data**: Flight bookings, device GPS, booking systems

## Screenshots

### Desktop View
Three-panel layout showing terminal, AI reasoning, and mobile banking simulation side by side.

### Mobile View
Tab-based navigation optimized for mobile devices with view mode toggle.

## Use Cases

This demo is designed for:

- **Sales Presentations**: Demonstrating AI fraud detection capabilities to potential clients
- **Training**: Educating staff on fraud detection workflows
- **Stakeholder Communication**: Visualizing complex ML/AI processes for non-technical audiences
- **Proof of Concept**: Showcasing integration possibilities with banking systems

## Built with v0

This project was built using [v0](https://v0.app) by Vercel.

[Continue developing on v0](https://v0.app/chat/projects/prj_T5hYWgx4SUZMeldN92E2WVQfdKhm)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

---

**Note**: This is a demonstration application. No real financial data or transactions are processed. All scenarios use mock data for educational and presentation purposes.

<a href="https://v0.app/chat/api/kiro/clone/enchloreas/afc-fraud-simulator" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
