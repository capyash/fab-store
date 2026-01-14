# Cogniclaim

AI-powered claims intelligence and agentic support platform.

## Authors

**Vinod Kumar V (VKV)** - Original Author and Maintainer

**Contributors:**
- Yash Capoor

## Overview

Cogniclaim is a comprehensive platform that includes:

- **Cogniclaim**: AI-powered healthcare claims processing
- **TP FAB Agents**: Agentic support workflows with CCAS integration
- **TP Resolve**: Resolution management system
- **TP Lend**: Lending platform
- **TP Dispatch**: Field service dispatch
- **TP Inventory**: Inventory management

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

Run the automated setup script:

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

Or manually:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### Running the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to `http://localhost:5173`

## Project Structure

```
cogniclaim/
├── src/
│   ├── apps/              # Application modules
│   │   ├── agentic-support/  # TP FAB Agents
│   │   ├── cogniclaim/       # Claims processing
│   │   ├── tp-resolve/       # Resolution management
│   │   └── ...
│   ├── components/        # Shared components
│   └── platforms/         # Platform integrations
├── backend/               # Express API server
│   ├── src/
│   │   ├── routes/        # API routes
│   │   └── services/     # Business logic
│   └── package.json
└── package.json          # Frontend dependencies
```

## Features

### TP FAB Agents (Agentic Support)

- Multi-channel CCAS integration (Voice, SMS, Chat, Email)
- AI-powered intent classification
- Automated workflow orchestration
- Knowledge base integration
- Ticketing system integration (ServiceNow, Jira, Zendesk, Salesforce)
- Real-time telemetry and monitoring
- Executive dashboard with ROI metrics

### Cogniclaim

- AI-powered claim analysis
- SOP navigation and compliance
- Pre-screening automation
- Executive reporting

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Environment Variables

Backend requires `.env` file in `backend/` directory:

```env
OPENAI_API_KEY=sk-...
FRONTEND_URL=localhttp://localhost:5173
PORT=3001
NODE_ENV=development
```

## Demo Setup

### Quick Start (Windows)

**Easiest way to start the demo:**

1. Double-click `Start Demo.bat` in the project root
2. The script will:
   - Check prerequisites (Node.js, npm)
   - Install dependencies if needed (first time only)
   - Start the dev server
   - Attempt to start ngrok (if installed)
   - Fall back to localhost if ngrok is not available
   - Open your browser automatically

**Create Desktop Shortcut:**
- Right-click `Start Demo.bat` → Send to → Desktop (create shortcut)
- Or drag the file to your desktop
- Double-click anytime to start the demo

### Manual Setup

For external demos using ngrok:

```bash
# Install ngrok (macOS)
brew install ngrok/ngrok/ngrok

# Windows: Download from https://ngrok.com/download

# Start ngrok tunnel
npm run ngrok:frontend
```

See `NGROK_DEMO_SETUP.md` for detailed instructions.

## License

ISC

## Support

For issues or questions, contact: Vinod Kumar V

