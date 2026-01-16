"""
LangTrace integration for distributed tracing
Author: Vinod Kumar V (VKV)
"""

import os
import uuid
from typing import Any, Dict, Optional
from contextlib import contextmanager

# LangTrace SDK - will be imported if available
try:
    from langtrace import LangTrace
    LANGTRACE_AVAILABLE = True
except ImportError:
    LANGTRACE_AVAILABLE = False
    print("⚠️ LangTrace SDK not installed. Using mock tracing.")


class LangTraceWrapper:
    """Wrapper for LangTrace SDK with fallback to mock implementation."""
    
    def __init__(self):
        self.langtrace = None
        if LANGTRACE_AVAILABLE:
            try:
                api_key = os.getenv("LANGTRACE_API_KEY")
                if api_key:
                    self.langtrace = LangTrace(api_key=api_key)
                else:
                    print("⚠️ LANGTRACE_API_KEY not set. Using mock tracing.")
            except Exception as e:
                print(f"⚠️ Failed to initialize LangTrace: {e}. Using mock tracing.")
    
    def generate_trace_id(self) -> str:
        """Generate a unique trace ID."""
        return str(uuid.uuid4())
    
    def generate_span_id(self) -> str:
        """Generate a unique span ID."""
        return str(uuid.uuid4())
    
    @contextmanager
    def trace_agent_execution(
        self,
        agent_name: str,
        trace_id: Optional[str] = None,
        parent_span_id: Optional[str] = None,
    ):
        """Context manager for tracing agent execution."""
        if trace_id is None:
            trace_id = self.generate_trace_id()
        
        span_id = self.generate_span_id()
        
        # If LangTrace is available, use it
        if self.langtrace:
            try:
                # Create span using LangTrace SDK
                with self.langtrace.trace(
                    name=f"agent.{agent_name}",
                    trace_id=trace_id,
                    span_id=span_id,
                    parent_span_id=parent_span_id,
                ):
                    yield {
                        "trace_id": trace_id,
                        "span_id": span_id,
                        "parent_span_id": parent_span_id,
                    }
            except Exception as e:
                print(f"⚠️ LangTrace trace error: {e}")
                yield {
                    "trace_id": trace_id,
                    "span_id": span_id,
                    "parent_span_id": parent_span_id,
                }
        else:
            # Mock implementation - just yield trace info
            yield {
                "trace_id": trace_id,
                "span_id": span_id,
                "parent_span_id": parent_span_id,
            }
    
    def log_agent_input(self, span_id: str, input_data: Dict[str, Any]):
        """Log agent input to trace."""
        if self.langtrace:
            try:
                self.langtrace.log_event(
                    span_id=span_id,
                    event_type="input",
                    data=input_data,
                )
            except Exception:
                pass  # Silently fail if LangTrace not available
    
    def log_agent_output(self, span_id: str, output_data: Dict[str, Any]):
        """Log agent output to trace."""
        if self.langtrace:
            try:
                self.langtrace.log_event(
                    span_id=span_id,
                    event_type="output",
                    data=output_data,
                )
            except Exception:
                pass
    
    def log_tool_call(self, span_id: str, tool_name: str, tool_input: Dict[str, Any], tool_output: Dict[str, Any]):
        """Log tool call to trace."""
        if self.langtrace:
            try:
                self.langtrace.log_event(
                    span_id=span_id,
                    event_type="tool_call",
                    data={
                        "tool_name": tool_name,
                        "input": tool_input,
                        "output": tool_output,
                    },
                )
            except Exception:
                pass


# Global instance
langtrace_wrapper = LangTraceWrapper()
