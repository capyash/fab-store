# Claude Project Understanding - FAB Store Platform

> Comprehensive understanding document for AI assistants and engineers working on this project.
> Created: 2026-01-14

---

## 1. Executive Summary

**Project Name**: FAB Store Platform (formerly Cogniclaim)
**Author**: Vinod Kumar V (VKV)
**Status**: Production-Ready Core Platform
**Current Branch**: `main` (clean)

### What This Is

FAB Store is an **AI-native, enterprise-grade platform** for rapid development of SOP-driven and field service applications. It features:

- **Central Marketplace**: Applications, AI models, platforms, and templates
- **5 Live Applications**: Across healthcare, financial services, and field service industries
- **2 Reusable Platforms**: SOP Executor and Field Service Platform
- **Low-Code/No-Code Builder**: AppBuilder with 67 components
- **Role-Based Access Control**: Admin, Developer, User personas
- **TP FAB Agents**: AI-powered device & customer support (printer support focus)

### Tech Stack

**Frontend**:
- React 19.1.1, Vite 7.1.7
- Material-UI 7.3.6, TailwindCSS 4.1.16
- Framer Motion 12.23.24, Lucide React 0.552.0
- @dnd-kit for drag-and-drop

**Backend**:
- Node.js / Express
- LangChain 1.0.3, LangGraph 1.0.1
- OpenAI integration (@langchain/openai 1.0.0)
- Server-Sent Events (SSE) for streaming

**AI/ML**:
- GPT-4 / GPT-4o-mini via LangChain
- Multi-agent reasoning architecture
- RAG (Retrieval-Augmented Generation)

---

## 2. Platform Architecture

### 2.1 Core Components

```
FAB Store Platform
├── FAB Store (Marketplace)
│   ├── Application Gallery
│   ├── AI Models Gallery
│   ├── Platforms Showcase
│   └── Templates Marketplace
│
├── Platforms (Reusable Infrastructure)
│   ├── SOP Executor Platform (3 solutions)
│   └── Field Service Platform (2 solutions)
│
├── Applications (5 Live)
│   ├── Cogniclaim (Healthcare Claims)
│   ├── TP Resolve (Appeals & Grievances)
│   ├── TP Lend (Mortgage Processing)
│   ├── TP Dispatch (Field Service)
│   ├── TP Inventory (Inventory Management)
│   └── TP FAB Agents (Agentic Support)
│
└── AppBuilder (Low-Code/No-Code)
    ├── Component Library (67 components)
    ├── Data Model Configurator
    ├── Visual Canvas
    └── AI-Powered Generation
```

### 2.2 Platform Layers

1. **Presentation Layer**
   - FAB Store marketplace
   - SolutionLayout (shared app shell)
   - Consistent theming and branding

2. **Application Layer**
   - 5 live applications
   - 3 in pipeline (Assist, Collect, Banking Command)
   - Industry-specific solutions

3. **Platform Layer**
   - SOP Executor: Multi-agent AI reasoning for regulated operations
   - Field Service: Route optimization, scheduling, work order management

4. **AI Layer**
   - AI Watchtower (unified AI console)
   - Multi-agent reasoning
   - Streaming responses
   - Context-aware chat

5. **Data Layer**
   - Mock data (JSON files)
   - Local/Session storage
   - Future: Database integration

---

## 3. Applications in Detail

### 3.1 Cogniclaim (Healthcare Claims)
- **Platform**: SOP Executor
- **Status**: ✅ Live
- **Features**:
  - AI-powered claims analysis with multi-line item support
  - SOP-driven decision making
  - AI Watchtower reasoning dashboard
  - Duplicate/split claims detection
  - Executive dashboard with metrics
  - Knowledge base (SOP browser)
- **Data**: Claims with CPT codes, denial codes, member info

### 3.2 TP Resolve Appeals (Healthcare Appeals)
- **Platform**: SOP Executor
- **Status**: ✅ Live
- **Features**:
  - Appeals and grievances management
  - Deadline tracking and regulatory compliance
  - SOP-driven resolution workflows
  - Multi-line item support
- **Data**: Cases with deadlines, status, member info

### 3.3 TP Lend (Mortgage Processing)
- **Platform**: SOP Executor
- **Status**: ✅ Live
- **Features**:
  - Mortgage underwriting automation
  - DTI (Debt-to-Income) ratio calculation
  - Bankruptcy rules processing
  - SLA tracking
- **Data**: Loans with applicant info, financial data
- **SOPs**: 150+ page mortgage processing guide

### 3.4 TP Dispatch (Field Service)
- **Platform**: Field Service Platform
- **Status**: ✅ Live
- **Features**:
  - Work order management with AI Watchtower integration
  - Technician routing optimization
  - SLA tracking
  - Customer tier management
  - Asset tracking
  - Contract and warranty management
- **Integration**: Full AI reasoning for work orders

### 3.5 TP Inventory (Inventory Management)
- **Platform**: Field Service Platform
- **Status**: ✅ Live
- **Features**:
  - Parts and equipment tracking
  - Multi-location inventory
  - Low-stock alerts
  - Cost tracking

### 3.6 TP FAB Agents (Agentic Support)
- **Platform**: TP FAB Agents Platform
- **Status**: ✅ Live
- **Industry**: Device & Customer Support (Printer Support focus)
- **Key Features**:
  - Multi-channel CCAS integration (Voice, SMS, Chat, Email, WhatsApp)
  - AI-powered intent classification
  - Self-healing workflows with ticket creation
  - Knowledge base integration with PDF viewer
  - Real-time telemetry monitoring
  - Live interaction monitor
  - Executive dashboard with ROI metrics
  - Genesys Cloud integration (in progress)

**Important TP FAB Agents Details**:
- Product name is **"TP FAB Agents"** (not "Agentic Support")
- Always creates tickets (both self-healed and escalated)
- No "demo mode" text or "mock" labels in UI
- Three main cards: Customer Input, Intent Brain, Input Datapoints
- Knowledge Source shown inside Intent Brain card
- CCAS Integration Layer with FreeSWITCH-style simulation (designed for Genesys/CCAI swap)

---

## 4. Platform Details

### 4.1 SOP Executor Platform

**Purpose**: SOP-native platform for regulated operations

**Core Capabilities**:
- Multi-agent AI reasoning (4 agents):
  1. Analysis Agent
  2. SOP Matching Agent
  3. Risk Assessment Agent
  4. Recommendation Agent
- SOP document viewer with step navigation
- AI chat agent with context awareness
- Confidence scoring
- Streaming AI responses (SSE)
- Industry-agnostic architecture

**Technology**: React, LangChain, GPT-4, RAG

**Key Components**:
- `SOPDataProvider` - Generic SOP data access
- `createPlatformAgents` - Multi-agent reasoning
- `SOPViewer` - Document viewer
- `ReasoningCard` - AI reasoning display

**Solutions Built**: 3 (Cogniclaim, TP Resolve, TP Lend)

### 4.2 Field Service Platform

**Purpose**: AI-powered field service management

**Core Capabilities**:
- AI-powered route optimization
- Intelligent technician scheduling
- Work order lifecycle management
- SLA tracking and compliance
- Technician skill matching
- Asset management
- Inventory integration

**Technology**: React, GPT-4, Routing algorithms

**Key Components**:
- `FieldServiceDataProvider` - Generic field service data access
- `createFieldServiceAgents` - Routing and scheduling AI
- `WorkOrderCard` - Work order display
- `ScheduleView` - Scheduling interface
- `AssetCard` - Asset information display

**Solutions Built**: 2 (TP Dispatch, TP Inventory)

---

## 5. AppBuilder (Low-Code/No-Code)

### 5.1 Current Status

**Status**: ⚠️ Partial (~45% MVP Complete)

**What's Complete** ✅:
- Drag-and-drop canvas
- Component palette with 67 components (8 categories)
- Enhanced property panel (ToolJet-style)
- Preview modes (canvas, split, preview)
- Component search/filter
- Component templates/pre-built blocks
- Responsive breakpoint controls
- Multi-page support
- AI-powered app generation with progress bar
- Basic entity designer

**What's Partial** ⚠️:
- Data Model Configurator (~30% complete)
  - Basic entities ✅
  - Missing: field types, relationships, auto-generation
- Template Engine (~40% complete)
  - Basic cloning ✅
  - Missing: customization wizard, preview, marketplace integration
- AI Watchtower Integration (~20% complete)
  - Platform detection ✅
  - Missing: auto-suggest, auto-generate AI Hub

**What's Missing** ❌:
- Workflow Designer (0% complete)
- Code Generator & Deployment (0% complete)
- Layer panel, undo/redo
- Data source connections
- Visual query builder

### 5.2 Component Library (67 Components)

**Layout** (5): Header, Toolbar, Container, Grid, Section

**Platform Components** (4): SOP Reasoning, SOP Viewer, Work Order Card, Asset Card

**Form Controls** (11): Button, Input, Textarea, Dropdown, Checkbox, Radio, Switch, Date Picker, File Upload, Slider, Rating

**Data Display** (8): Data Table, List, Card, Badge, Tag, Metric Card, Stat Card, Timeline

**Charts & Graphs** (6): Bar, Line, Pie, Area, Gauge, Heatmap

**Navigation** (5): Tabs, Breadcrumbs, Pagination, Menu, Steps

**Feedback** (9): Alert, Progress Bar, Spinner, Skeleton, Toast, Modal, Drawer, Notification

**Advanced** (8): Splitter, Resizer, Accordion, Carousel, Advanced Tabs, Tree, Transfer, Advanced Timeline

**Templates** (3): Pre-built layouts (Dashboard, Form, Detail View)

### 5.3 My Space

**Purpose**: User dashboard for managing applications

**Features**:
- View published/in-development applications
- Create new applications
- Edit existing applications
- Delete applications
- Filter by status
- Stats display

---

## 6. Role-Based Access Control (RBAC)

### 6.1 Three Roles

**Admin**:
- Full platform access
- Publish apps, models, platforms
- Manage users

**Developer**:
- Build and edit applications
- Submit for review
- Cannot publish

**User**:
- Use published applications only
- No building/editing access

### 6.2 Implementation

**Hook**: `usePermissions()` - Centralized permission checks

**Features**:
- Role-based UI visibility
- Feature gating (AppBuilder, My Space, Publishing)
- Navigation filtering
- Action restrictions

**Role Switcher**: Testing tool in user menu for switching personas

---

## 7. AI Capabilities

### 7.1 AI Watchtower

**Status**: ✅ Live across all applications

**Purpose**: Unified AI reasoning interface

**Features**:
- Multi-agent reasoning display
- Step-by-step AI reasoning with confidence scores
- SOP references with page numbers
- Recommendations with detailed reasoning
- Chat interface for follow-up questions
- Streaming responses (SSE)
- Context-aware responses

**Integration**:
- Platform-agnostic architecture
- Integrated with TP Dispatch
- Ready for all SOP Executor solutions
- Adapters for different platforms

### 7.2 AI Models Gallery

**Status**: ✅ Live

**Features**:
- Model cards with descriptions
- Category filtering
- Modality filtering
- Search functionality

### 7.3 AI-Powered App Generation

**Status**: ✅ Live

**Features**:
- Progress bar with steps
- Auto-generate data models
- Auto-generate components
- Platform integration suggestions

---

## 8. File Structure

```
fab-store/
├── src/
│   ├── apps/                    # 6 applications
│   │   ├── agentic-support/    # TP FAB Agents
│   │   ├── cogniclaim/         # Healthcare claims
│   │   ├── tp-resolve/         # Appeals & grievances
│   │   ├── tp-lend/            # Mortgage processing
│   │   ├── tp-dispatch/        # Field service dispatch
│   │   └── tp-inventory/       # Inventory management
│   ├── platforms/              # 2 reusable platforms
│   │   ├── sop-navigator/      # SOP Executor
│   │   └── field-service/      # Field Service Platform
│   ├── components/             # Shared components
│   │   ├── FabStore.jsx        # Main marketplace
│   │   ├── AppBuilder.jsx      # Low-code builder
│   │   ├── SolutionLayout.jsx  # App shell
│   │   ├── MySpace.jsx         # User dashboard
│   │   ├── RoleSwitcher.jsx    # Role testing tool
│   │   └── AIWatchtower/       # AI Watchtower system
│   ├── auth/                   # Authentication
│   │   └── AuthContext.jsx     # Auth with roles
│   ├── hooks/                  # Custom hooks
│   │   └── usePermissions.js   # RBAC hook
│   └── data/                   # Static data
│       ├── fabApps.js          # Application catalog
│       ├── fabPlatforms.js     # Platform catalog
│       ├── fabModels.js        # AI models catalog
│       └── templates.js        # App templates (5 industry templates)
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   └── genesysRoutes.js
│   │   ├── services/
│   │   │   ├── ai/             # AI agents
│   │   │   └── data/           # Data services
│   │   └── server.js
│   ├── agentic_support/        # Python agents (alternative)
│   └── package.json
│
├── public/                     # Assets
├── DOCS/                       # Documentation
├── Start Demo.bat             # Windows launcher
└── package.json               # Frontend deps
```

---

## 9. Key TP FAB Agents Files

**Main Console**:
- `src/apps/agentic-support/components/Console.jsx` - Main console with multi-channel input, intent brain, knowledge source, telemetry, workflow outcome

**CCAS Layer**:
- `src/apps/agentic-support/components/CCASConnectionPanel.jsx` - CCAS provider status
- `src/apps/agentic-support/components/LiveDemoController.jsx` - Multi-channel traffic simulation

**Knowledge & Documents**:
- `src/apps/agentic-support/components/KnowledgeDocViewer.jsx` - SOP-style PDF viewer
- `src/apps/agentic-support/services/knowledgeBase.js` - Semantic search service

**Tickets & Watchtower**:
- `src/apps/agentic-support/services/ticketsService.js` - Ticket storage
- `src/apps/agentic-support/components/TicketsTable.jsx` - Ticket worklist
- `src/apps/agentic-support/components/Watchtower.jsx` - Operational view

**Executive Reporting**:
- `src/apps/agentic-support/components/ExecutiveDashboard.jsx` - Business impact metrics

**Admin & Config**:
- `src/apps/agentic-support/components/Admin.jsx` - Admin page (CCAS Config, Integrations, Security, Notifications)

**Layout & Navigation**:
- `src/apps/agentic-support/components/Layout.jsx` - Left-nav for TP FAB Agents

---

## 10. UI/UX Design Rules (CRITICAL)

### 10.1 General Rules

**Branding**:
- Brand colors: Purple gradient (`#612D91` to `#A64AC9`)
- Product names: "TP FAB Agents" (not "Agentic Support")
- Status colors: Standardized by status type
- No "demo mode" text or "mock" labels in customer-facing UI

**Theming**:
- Consistent styling across all applications
- Dark mode support
- Professional, enterprise-grade appearance

**Navigation**:
- Standardized collapsible sidebar
- Role-based filtering
- Active state visual indicators
- Tooltips for collapsed state

**User Menu**:
- Circular avatar button with chevron badge
- Enhanced dropdown with avatar, name, email, role badge, role switcher, logout

### 10.2 TP FAB Agents Specific Rules

**Card Layout**:
- Three main cards: Customer Input, Intent Brain, Input Datapoints
- **Consistent height & padding** - no visible jumps
- No scrollbar jitter during AI flow
- Avoid `overflow-y-auto` unless strictly needed

**Knowledge Source**:
- Shown **inside Intent Brain card**
- Must **not increase card height noticeably**
- Compact strip with: category, 1-2 lines reasoning, doc/page ref, "View document"
- Alternative matches remain visible

**Telemetry (Input Datapoints)**:
- Renamed from "Device telemetry"
- Smart & compact display
- Show: device, OS, connection, last error, sentiment based on detected issue

**Workflow & Tickets**:
- Flow proceeds through stages even when intent is unknown
- **Ticket always created** with full context (both self-healed and escalated)
- Ticket modal shown for all flows

**CCAS / Live Interaction**:
- Headers: "CCAS Integration Layer" (top), "TP Console Core" (main console)
- CCAS cards and Live Interaction Monitor share purple/dark theme
- No "agentic storyboard" or extra progress chips

**Scrolling**:
- Entire workflow visible with minimal scrolling on typical laptop
- Compact spacing but breathable UI

---

## 11. Development Workflows

### 11.1 Quick Start

```bash
# Install dependencies
npm install
cd backend && npm install

# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
npm run dev

# Open browser
http://localhost:5173
```

### 11.2 Windows Demo Launcher

- Double-click `Start Demo.bat`
- Auto-checks prerequisites
- Installs dependencies if needed
- Starts dev server
- Optionally starts ngrok
- Opens browser automatically

### 11.3 Ngrok Setup (External Demos)

```bash
# Install ngrok
brew install ngrok/ngrok/ngrok  # macOS
# Windows: Download from https://ngrok.com/download

# Start ngrok tunnel
npm run ngrok:frontend
```

See `NGROK_DEMO_SETUP.md` for details.

---

## 12. Recent Work & Git History

**Recent Commits** (from newest):
1. `4584156` - genesys integrated more changes
2. `3860526` - genesys integrated first cut
3. `caea6e6` - docs from mac to windows vm
4. `3a02c76` - demo cleanup, landing page
5. `fddb216` - demo bat file created

**Recent Features**:
- Genesys Cloud integration (OAuth, webhook handling, live queue)
- AI Watchtower integration with TP Dispatch
- Multi-vertical template showcase (Manufacturing, Retail)
- Enhanced template marketplace with industry filtering
- Windows demo launcher improvements

---

## 13. Known TODOs

**TP FAB Agents / Agentic Support**:
- Replace mock PDF parsing with real pdf-parse library
- Replace mock embedding model with real ML service
- Replace keyword matching with vector similarity search
- Complete Genesys Cloud telephony integration

**AppBuilder**:
- Complete Data Model Configurator (field types, relationships, auto-generation)
- Build Workflow Designer (visual flow builder)
- Build Code Generator & Deployment system
- Enhance AI Watchtower auto-integration
- Add template customization wizard

**Platform**:
- Real backend API (currently demo mode)
- Database integration
- Authentication service
- File storage
- Webhook support

---

## 14. Pending Features (From Original Plan)

### High Priority (MVP Critical):

1. **Enhanced Data Model Configurator**
   - Field types: Reference, File/Image, Enum/Select, JSON
   - Field properties: Required, Default, Validation, Min/Max
   - Relationships: One-to-Many, Many-to-Many
   - Auto-generate forms/tables from schema

2. **Code Generator**
   - Generate solution structure
   - Generate platform adapter
   - Auto-wire AI Watchtower
   - Auto-configure routing
   - Deploy to FAB Store

3. **AI Watchtower Auto-Integration**
   - Auto-suggest AI components
   - Auto-generate AI Hub for entities
   - Auto-configure reasoning agents
   - AI component library

### Medium Priority:

4. **Workflow Designer**
   - Visual flow builder (node-based)
   - Triggers: "On Create", "On Update", "On Status Change"
   - Actions: "Send Email", "Create Record", "Call API"
   - Conditions: "If/Else", "Switch", "Filter"
   - AI actions: "Run AI Reasoning", "Get Recommendation"

5. **Template Customization**
   - Customization wizard
   - Visual diff view
   - Component override
   - Data model extension UI

### Low Priority (Post-MVP):

6. Advanced features:
   - Real-time collaboration
   - Version control
   - Data source connections (ToolJet-style)
   - Visual query builder
   - Export/import
   - Layer panel
   - Undo/redo

---

## 15. CCAS Integration Direction (Future Work)

**Current State**: FreeSWITCH-like simulation

**Future Architecture** (designed but not fully implemented):

**Backend Structure**:
- `backend/src/services/ccas/genesys/GenesysClient.js` - OAuth client
- `backend/src/services/ccas/genesys/GenesysWebhookHandler.js` - Webhook normalization
- `backend/src/services/ccas/events/EventRouter.js` - Event routing to workflow engine
- `backend/src/routes/ccasRoutes.js` - Routes: `/api/v1/ccas/genesys/webhook`, `/status`

**Frontend Integration**:
- `apps/agentic-support/services/genesysService.js` - SSE/WebSocket client
- `Console.jsx` - `handleGenesysEvent` normalizes CCAS events

**Goal**: Plug-in architecture for Genesys, Google CCAI, or other CCAS providers

---

## 16. Templates Marketplace

**Status**: ✅ 5 Industry Templates Available

**Manufacturing**:
1. Quality Control System (SOP Executor)
2. Equipment Maintenance (Field Service Platform)

**Retail**:
3. Returns & Refunds (SOP Executor)
4. Inventory Management (Field Service Platform)
5. Order Fulfillment (Field Service Platform)

**Template Configuration**:
- Platform ID
- Item labels, statuses, priorities, fields
- Industry categorization
- Ready-to-clone structure

---

## 17. Key Metrics

**Applications**: 5 live, 3 in pipeline
**Platforms**: 2 production-ready
**Components**: 67 in AppBuilder, 4 platform-specific, 3 templates
**Industries**: Healthcare, Financial Services, Field Service, Contact Center, Travel, Banking
**Lines of Code**: ~15,000+
**React Components**: 100+
**Status**: ✅ Production-Ready Core Platform

---

## 18. Working with AI Assistants (Critical Guidelines)

### Branding:
- Use **"TP FAB Agents"** (solution) and **"TP FAB Agents Platform"** (platform)
- FAB Store should never say "demo" in customer-facing text
- TP FAB Agents status is **"Live"** (not Preview/Coming Soon)

### Design Constraints:
- Maintain **consistent card sizing and padding** across Console cards
- Do not add sections that push workflow off-screen without strong reason
- Preserve UI/UX rules documented in Section 10

### Content:
- Avoid "Coming Soon" and "Copy" items unless explicitly intended
- TP FAB Agents is a first-class app in FAB Store

### File Operations:
- ALWAYS read files before editing
- NEVER create files unless explicitly required
- PREFER editing existing files over creating new ones
- Use specialized tools (Read, Edit, Write) instead of bash commands

### Security:
- Never commit secrets (.env, credentials.json)
- Be careful of security vulnerabilities (XSS, SQL injection, command injection)

---

## 19. Environment Variables

**Backend** (`.env` in `backend/` directory):

```env
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

---

## 20. Demo Flows

### TP FAB Agents Auto Demo (C-Suite):

1. Start **AI Auto** mode in LiveInteractionMonitor
2. Auto SMS: "printer inkjet / cartridge not recognized"
3. Console stages:
   - Customer Input (transcribed issue)
   - Intent Brain (matches `ink_error`, shows alternatives + knowledge strip)
   - Knowledge Source (reasoning + SOP snippet)
   - Input Datapoints (device & context)
   - Workflow Outcome (self-heal or escalate)
4. Ticket modal (always appears, saved to ticketsService)
5. Visible in Watchtower → TicketsTable

### Manual Demo:

- Use **Manual** mode in LiveInteractionMonitor
- Trigger: Voice, SMS, WhatsApp, Chat
- Same downstream flow

---

## 21. Support & Resources

**Author**: Vinod Kumar V (VKV)
**Email**: vinod.kumar.v@example.com
**License**: ISC

**Genesys Resources**:
- Genesys Cloud Help: https://help.mypurecloud.com
- API Documentation: https://developer.mypurecloud.com/api/rest/v2/
- Telephony Guide: https://help.mypurecloud.com/articles/configure-a-phone/

---

## 22. Next Steps (Roadmap)

### Immediate Priorities:
1. Complete Genesys Cloud telephony integration
2. Enhance Data Model Configurator (field types, relationships)
3. Build Code Generator for AppBuilder
4. Complete AI Watchtower auto-integration

### Platform Enhancements:
- Additional platforms (Customer Service, Supply Chain)
- Enhanced AI capabilities (multi-modal, vision)
- Real-time collaboration
- Version control for applications
- Application analytics dashboard

### Enterprise Features:
- Team/organization management
- Approval workflows for Developer submissions
- Audit logging
- API access management
- SSO integration
- Multi-tenancy support

### Backend Integration:
- Real backend API (replace demo mode)
- Database integration
- Authentication service
- File storage
- Webhook support

---

**Last Updated**: 2026-01-14
**Document Version**: 1.0
**For**: AI Assistants (Claude, GPT, etc.) and Engineers

---

*This document consolidates information from: PROJECT_STATUS.md, COMPLETED_WORK_SUMMARY.md, BUILD_COMPLETE_SUMMARY.md, PENDING_FEATURES.md, TP_FAB_Agents_Notes.md, GENESYS_TELEPHONY_SETUP.md, AUTHOR_ATTRIBUTION.md, README.md, package.json, and repository structure.*
