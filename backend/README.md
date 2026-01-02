# Cogniclaim Backend Server

Express server providing AI-powered claims intelligence API with SSE streaming support.

**Author:** Vinod Kumar V (VKV)

## Features

- **AI Reasoning Engine**: Multi-agent chain of thought analysis for claims
- **AI Chat Assistant**: Context-aware conversational AI
- **SSE Streaming**: Real-time streaming of AI responses
- **LangChain Integration**: Uses GPT-4 via LangChain

## Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. **Start the server**:
   ```bash
   npm run dev    # Development mode with auto-reload
   # or
   npm start      # Production mode
   ```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### POST `/api/v1/ai/analyze`
Analyze a claim using AI reasoning engine.

**Request Body**:
```json
{
  "claimId": "CLM-001"
}
```
or
```json
{
  "claim": { "id": "CLM-001", "member": "...", ... }
}
```

**Response**: Server-Sent Events (SSE) stream with reasoning steps.

### POST `/api/v1/ai/chat`
Send a message to the AI chat assistant.

**Request Body**:
```json
{
  "message": "What SOPs apply to this claim?",
  "claimId": "CLM-001",
  "conversationHistory": []
}
```

**Response**: Server-Sent Events (SSE) stream with chat tokens.

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: GPT model to use (default: gpt-4o-mini)

## Demo Mode vs Backend Mode

- **Demo Mode** (frontend): Uses GPT-4 directly from the browser
- **Backend Mode**: Uses this server for AI processing with SSE streaming

Toggle between modes in the frontend Settings page.

