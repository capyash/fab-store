"""
Cost calculation utility for LLM usage
Author: Vinod Kumar V (VKV)
"""

from typing import Optional


# Pricing models (per 1M tokens)
PRICING_MODELS = {
    # Groq pricing (as of 2024)
    "groq/llama-3.1-70b": {"input": 0.59, "output": 0.79},
    "groq/llama-3.1-8b": {"input": 0.05, "output": 0.08},
    "groq/mixtral-8x7b": {"input": 0.24, "output": 0.24},
    
    # Anthropic Claude pricing
    "claude-3-5-sonnet-20241022": {"input": 3.00, "output": 15.00},
    "claude-3-opus-20240229": {"input": 15.00, "output": 75.00},
    "claude-3-sonnet-20240229": {"input": 3.00, "output": 15.00},
    "claude-3-haiku-20240307": {"input": 0.25, "output": 1.25},
    
    # OpenAI pricing
    "gpt-4o": {"input": 2.50, "output": 10.00},
    "gpt-4o-mini": {"input": 0.15, "output": 0.60},
    "gpt-4-turbo": {"input": 10.00, "output": 30.00},
    
    # Default fallback
    "default": {"input": 1.00, "output": 2.00},
}


def calculate_cost(
    model: str,
    tokens_input: int,
    tokens_output: int,
) -> float:
    """
    Calculate cost in USD based on model and token usage.
    
    Args:
        model: Model identifier (e.g., "groq/llama-3.1-70b")
        tokens_input: Number of input tokens
        tokens_output: Number of output tokens
    
    Returns:
        Cost in USD
    """
    pricing = PRICING_MODELS.get(model, PRICING_MODELS["default"])
    
    # Convert tokens to millions and multiply by price
    input_cost = (tokens_input / 1_000_000) * pricing["input"]
    output_cost = (tokens_output / 1_000_000) * pricing["output"]
    
    return round(input_cost + output_cost, 6)


def get_model_from_agent(agent_name: str) -> str:
    """
    Infer model name from agent name or use default.
    
    Args:
        agent_name: Name of the agent
    
    Returns:
        Model identifier
    """
    # Default to a reasonable model for TP FAB Agents
    # In production, this would come from agent configuration
    return "gpt-4o-mini"  # Cost-effective default
