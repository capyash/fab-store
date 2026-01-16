from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Dict, Optional

from fastapi import BackgroundTasks, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .engine import engine
from .models import (
    SimulateTelemetryRequest,
    TriggerWorkflowResponse,
    WorkflowStatusResponse,
    WorkflowTriggerRequest,
)

logger = logging.getLogger("agentic_support")
logging.basicConfig(level=logging.INFO)

# Initialize database on startup
try:
    from ..db.schema import init_database
    from ..services.metrics_service import metrics_service
    init_database()
except ImportError as e:
    logger.warning(f"Could not import metrics modules: {e}")
    metrics_service = None

app = FastAPI(
    title="Agentic Customer Support Self-Healing API",
    version="0.1.0",
    description=(
        "Agentic workflows for printer support scenarios.\n\n"
        "This service hosts multiple autonomous workflows that can diagnose, act, "
        "verify and optionally escalate issues such as 'Printer Offline' or "
        "'Ink Cartridge Error'.\n\n"
        "Integrations with CCaaS, device telemetry and CRM systems are mocked via "
        "well-defined boundaries so they can be replaced with real clients later."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/trigger-workflow", response_model=TriggerWorkflowResponse)
async def trigger_workflow(payload: WorkflowTriggerRequest, background: BackgroundTasks) -> TriggerWorkflowResponse:
    """
    Entry point for starting a new agentic workflow.

    The request includes customer interaction, device metadata, telemetry and entitlement.
    Optionally, a specific workflow_type can be supplied; otherwise an intent-detection
    step will infer the best matching workflow.

    The orchestration runs asynchronously in the background. This endpoint returns
    immediately with a workflow_id that can be used to query status.
    """
    state = await engine.trigger(payload)
    logger.info("Triggered workflow %s of type %s", state.id, state.workflow_type.value)

    return TriggerWorkflowResponse(
        workflow_id=state.id,
        workflow_type=state.workflow_type,
        status=state.status,
        stage=state.stage,
        created_at=state.created_at,
    )


@app.get("/get-workflow-status", response_model=WorkflowStatusResponse)
async def get_workflow_status(workflow_id: str) -> WorkflowStatusResponse:
    """
    Retrieve the latest state for a workflow.

    This returns:
      - current stage and status
      - diagnosis details
      - actions executed
      - verification and escalation info
      - AI-generated summary and resolution reason
      - full structured log of all agent steps
    """
    state = await engine.get_state(workflow_id)
    if not state:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return WorkflowStatusResponse(workflow=state)


# In-memory telemetry store used for /simulate-telemetry
_TELEMETRY_STORE: Dict[str, Dict] = {}


@app.post("/simulate-telemetry")
async def simulate_telemetry(payload: SimulateTelemetryRequest) -> Dict[str, str]:
    """
    Mock endpoint to upsert device telemetry.

    In a production deployment this would typically be replaced with:
      - a webhook from a device telemetry platform, or
      - a polling job that reads from an IoT / streaming source (e.g., Kafka, MQTT).
    """
    _TELEMETRY_STORE[payload.device_id] = payload.telemetry.model_dump()
    logger.info("Updated simulated telemetry for device %s", payload.device_id)
    return {"status": "ok", "device_id": payload.device_id}


@app.get("/api/v1/metrics/channels")
async def get_channel_metrics(
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
) -> Dict:
    """Get entry channel volumes."""
    if not metrics_service:
        return {"channels": []}
    return {"channels": metrics_service.get_channel_volumes(from_date, to_date)}


@app.get("/api/v1/metrics/kpi")
async def get_kpi_metrics(
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
) -> Dict:
    """Get key performance indicators."""
    if not metrics_service:
        return {"self_heal_rate": 0, "avg_resolution_time_seconds": 0, "cost_savings_usd": 0}
    return metrics_service.get_kpi_metrics(from_date, to_date)


@app.get("/api/v1/metrics/agents")
async def get_agent_metrics(
    agent_name: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
) -> Dict:
    """Get agent performance data."""
    if not metrics_service:
        return {"agents": []}
    if agent_name:
        # Get individual agent details
        executions = metrics_service.get_agent_metrics(agent_name, from_date, to_date)
        aggregates = metrics_service.get_agent_aggregates(agent_name, from_date, to_date)
        return {
            "agent_name": agent_name,
            "aggregates": aggregates[0] if aggregates else {},
            "executions": executions,
        }
    else:
        # Get all agents aggregates
        aggregates = metrics_service.get_agent_aggregates(None, from_date, to_date)
        return {"agents": aggregates}


@app.get("/api/v1/metrics/agents/{agent_name}/details")
async def get_agent_details(
    agent_name: str,
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    limit: int = Query(100),
) -> Dict:
    """Get detailed agent execution history."""
    if not metrics_service:
        return {"agent_name": agent_name, "aggregates": {}, "executions": []}
    executions = metrics_service.get_agent_metrics(agent_name, from_date, to_date, limit)
    aggregates = metrics_service.get_agent_aggregates(agent_name, from_date, to_date)
    return {
        "agent_name": agent_name,
        "aggregates": aggregates[0] if aggregates else {},
        "executions": executions,
    }


@app.get("/api/v1/metrics/categories")
async def get_category_metrics(
    category_id: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
) -> Dict:
    """Get category performance data."""
    if not metrics_service:
        return {"categories": [], "resolution": {"total": 0, "breakdown": {}}}
    categories = metrics_service.get_category_metrics(category_id, from_date, to_date)
    resolution = metrics_service.get_resolution_metrics(category_id, from_date, to_date)
    return {
        "categories": categories,
        "resolution": resolution,
    }


@app.get("/api/v1/metrics/collaboration")
async def get_collaboration_metrics(
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
) -> Dict:
    """Get agent collaboration patterns."""
    if not metrics_service:
        return {
            "autonomous_agent_chain": {},
            "ai_to_human_handoff": {},
            "human_initiated_ai_assist": {},
        }
    return metrics_service.get_collaboration_metrics(from_date, to_date)


@app.get("/api/v1/metrics/insights")
async def get_insights(
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
) -> Dict:
    """Get category insights comparing AI vs Human performance."""
    if not metrics_service:
        return {"insights": []}
    categories = metrics_service.get_category_metrics(None, from_date, to_date)
    resolution = metrics_service.get_resolution_metrics(None, from_date, to_date)
    
    # Build insights for each category
    insights = []
    for cat in categories[:10]:  # Top 10 categories
        cat_id = cat["category_id"]
        cat_resolution = metrics_service.get_resolution_metrics(cat_id, from_date, to_date)
        
        # Get AI metrics for this category
        ai_metrics = metrics_service.get_agent_aggregates(None, from_date, to_date)
        # Filter by category (would need category_id in agent_metrics for real implementation)
        
        insights.append({
            "category_id": cat_id,
            "category_name": cat["category_name"],
            "ai_handled": {
                "resolution_rate": cat["success_rate"],
                "avg_time_seconds": (cat.get("avg_latency_ms", 0) / 1000) if cat.get("avg_latency_ms") else 0,
                "accuracy": cat["success_rate"],  # Simplified
                "cost_usd": cat.get("total_cost_usd", 0.0),
            },
            "human_handled": {
                "resolution_rate": 82.0,  # Placeholder
                "avg_time_seconds": 432.0,  # 7.2 minutes placeholder
                "csat": 4.3,  # Placeholder
                "cost_usd": 12.50,  # Placeholder
            },
        })
    
    return {"insights": insights}


@app.get("/api/v1/metrics/alerts")
async def get_alerts(
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
) -> Dict:
    """Get system health alerts."""
    if not metrics_service:
        return {"alerts": []}
    alerts = metrics_service.get_alerts(from_date, to_date)
    return {"alerts": alerts}


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


"""
Integration Notes
-----------------

CCaaS / Contact Center (e.g., Genesys, Twilio, Amazon Connect)
--------------------------------------------------------------
- The /trigger-workflow endpoint can be invoked from:
  - IVR flows (e.g., when a caller says 'my printer is offline')
  - Agent assist widgets (send the current conversation transcript)
  - Bot flows as a 'self-heal' action before routing to a human

- The WorkflowState.summary and resolution_reason fields can be surfaced
  in an agent desktop UI as a ready-made wrap-up note or guidance script.

Device Telemetry Platforms
---------------------------
- Replace the in-memory _TELEMETRY_STORE and TelemetrySnapshot with a thin
  adapter around your real telemetry source:
  - e.g., a service that queries a device management API
  - or a subscriber to telemetry events on Kafka/IoT Core.

- The DiagnosticAgent and VerificationAgent are the natural extension points:
  replace the mocked checks with real API calls and business rules.

CRM / Ticketing Systems (ServiceNow, Zendesk, Salesforce)
---------------------------------------------------------
- When EscalationDecisionAgent marks a workflow as escalated, you can:
  - Create or update a ticket with the full WorkflowState payload.
  - Attach state.logs as a structured diagnostic trace.
  - Use workflow_id as an external reference ID to correlate events.

- The /get-workflow-status endpoint can be used by downstream systems to
  poll or subscribe for changes to workflow outcomes.
"""


