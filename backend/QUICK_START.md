# Quick Start Guide

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-key-here
```

## 3. Start Backend Server

```bash
npm run dev
```

You should see:
```
🚀 Cogniclaim Backend Server running on http://localhost:3001
📡 API Base URL: http://localhost:3001/api/v1
🔑 OpenAI API Key: ✅ Configured
```

## 4. Test Backend

### Test Health Endpoint
```bash
curl http://localhost:3001/health
```

### Test AI Analyze (requires claim data)
```bash
curl -X POST http://localhost:3001/api/v1/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"claimId": "CLM-001"}'
```

## 5. Toggle in Frontend

1. Start frontend: `npm run dev` (from project root)
2. Go to Settings (gear icon in sidebar)
3. Toggle "Demo mode" OFF to use backend
4. Navigate to a claim and trigger AI analysis
5. You should see SSE streaming from backend instead of frontend processing

## Troubleshooting

- **Port 3001 already in use**: Change `PORT` in `.env`
- **CORS errors**: Check `FRONTEND_URL` in `.env` matches your frontend URL
- **OpenAI API errors**: Verify your API key is correct and has credits
- **Module not found**: Run `npm install` again

