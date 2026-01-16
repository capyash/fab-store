"""
Metrics tracking context manager for agent executions
Author: Vinod Kumar V (VKV)
"""

import json
import time
from contextlib import contextmanager
from datetime import datetime
from typing import Any, Dict, List, Optional

from ..db.database import get_db
from ..integrations.langtrace import langtrace_wrapper
from .cost_calculator import calculate_cost, get_model_from_agent


@contextmanager
def track_agent_execution(
    agent_name: str,
    agent_description: Optional[str] = None,
    ticket_id: Optional[str] = None,
    category_id: Optional[str] = None,
    category_name: Optional[str] = None,
    trace_id: Optional[str] = None,
    parent_span_id: Optional[str] = None,
    input_text: Optional[str] = None,
):
    """
    Context manager for tracking agent execution metrics.
    
    Usage:
        with track_agent_execution("intent_detection", ticket_id="TKT-123") as tracker:
            # Agent execution code
            result = await agent.run(ctx, state)
            tracker.set_output(result)
            tracker.add_tool_call("search_kb", {"query": "..."}, {"results": [...]})
    """
    start_time = time.time()
    trace_info = None
    output_text: Optional[str] = None
    tool_calls: List[Dict[str, Any]] = []
    error_message: Optional[str] = None
    success = True
    
    # Start LangTrace span
    trace_ctx = langtrace_wrapper.trace_agent_execution(
        agent_name=agent_name,
        trace_id=trace_id,
        parent_span_id=parent_span_id,
    )
    
    with trace_ctx:
        trace_info = trace_ctx.__enter__()
        span_id = trace_info["span_id"]
        final_trace_id = trace_info["trace_id"]
        
        # Log input
        if input_text:
            langtrace_wrapper.log_agent_input(span_id, {"input": input_text})
        
        class Tracker:
            def set_output(self, output: Any):
                nonlocal output_text
                if isinstance(output, str):
                    output_text = output
                else:
                    output_text = json.dumps(output) if output else None
                langtrace_wrapper.log_agent_output(span_id, {"output": output_text})
            
            def add_tool_call(self, tool_name: str, tool_input: Dict[str, Any], tool_output: Dict[str, Any]):
                tool_calls.append({
                    "tool_name": tool_name,
                    "input": tool_input,
                    "output": tool_output,
                })
                langtrace_wrapper.log_tool_call(span_id, tool_name, tool_input, tool_output)
            
            def set_error(self, error: str):
                nonlocal error_message, success
                error_message = error
                success = False
        
        tracker = Tracker()
        
        try:
            yield tracker
        except Exception as e:
            success = False
            error_message = str(e)
            raise
        finally:
            try:
                trace_ctx.__exit__(None, None, None)
            except Exception:
                pass
            # Calculate metrics
            latency_ms = int((time.time() - start_time) * 1000)
            
            # For now, estimate tokens (in production, get from LLM response)
            # This is a placeholder - real implementation would get from LLM API response
            tokens_input = len(input_text.split()) * 1.3 if input_text else 0  # Rough estimate
            tokens_output = len(output_text.split()) * 1.3 if output_text else 0
            tokens_total = tokens_input + tokens_output
            
            # Calculate cost
            model = get_model_from_agent(agent_name)
            cost_usd = calculate_cost(model, int(tokens_input), int(tokens_output))
            
            # Store in database
            try:
                with get_db() as conn:
                    cursor = conn.cursor()
                    cursor.execute("""
                        INSERT INTO agent_metrics (
                            agent_name, agent_description, ticket_id, category_id,
                            trace_id, span_id, input_text, output_text, tool_calls,
                            latency_ms, tokens_input, tokens_output, tokens_total,
                            cost_usd, success, error_message, timestamp
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        agent_name,
                        agent_description,
                        ticket_id,
                        category_id,
                        final_trace_id,
                        span_id,
                        input_text,
                        output_text,
                        json.dumps(tool_calls) if tool_calls else None,
                        latency_ms,
                        int(tokens_input),
                        int(tokens_output),
                        int(tokens_total),
                        cost_usd,
                        success,
                        error_message,
                        datetime.utcnow(),
                    ))
            except Exception as e:
                print(f"⚠️ Failed to store agent metrics: {e}")


def get_trace_id_for_workflow(workflow_id: str) -> str:
    """Get or create trace ID for a workflow."""
    # In production, this might be stored in workflow state
    # For now, generate a new one
    return langtrace_wrapper.generate_trace_id()
