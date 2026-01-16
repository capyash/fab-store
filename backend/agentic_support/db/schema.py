"""
Database schema for AI Watchtower metrics tracking
Author: Vinod Kumar V (VKV)
"""

import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Optional

# Database file path
DB_PATH = Path(__file__).parent.parent / "metrics.db"


def get_db_connection():
    """Get SQLite database connection."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """Initialize database with all required tables."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Agent metrics table - individual agent execution records
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS agent_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_name TEXT NOT NULL,
            agent_description TEXT,
            ticket_id TEXT,
            category_id TEXT,
            trace_id TEXT,
            span_id TEXT,
            input_text TEXT,
            output_text TEXT,
            tool_calls TEXT,  -- JSON string
            latency_ms INTEGER,
            tokens_input INTEGER,
            tokens_output INTEGER,
            tokens_total INTEGER,
            cost_usd REAL,
            success BOOLEAN,
            error_message TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Category metrics table - aggregated category statistics
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS category_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id TEXT NOT NULL,
            category_name TEXT NOT NULL,
            date DATE NOT NULL,
            total_tickets INTEGER DEFAULT 0,
            successful_tickets INTEGER DEFAULT 0,
            failed_tickets INTEGER DEFAULT 0,
            success_rate REAL,
            avg_latency_ms INTEGER,
            total_tokens INTEGER DEFAULT 0,
            total_cost_usd REAL DEFAULT 0.0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(category_id, date)
        )
    """)

    # Ticket resolution metrics table - individual ticket resolution data
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS ticket_resolution_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id TEXT NOT NULL UNIQUE,
            category_id TEXT,
            category_name TEXT,
            channel TEXT,  -- voice, chat, email, sms, etc.
            resolution_type TEXT,  -- auto-resolved, escalated, failed
            mtr_seconds INTEGER,  -- Mean time to resolve
            handoff_type TEXT,  -- technical, billing, general, none
            handoff_timestamp DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Create indexes for performance
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent_name ON agent_metrics(agent_name)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_agent_metrics_timestamp ON agent_metrics(timestamp)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_agent_metrics_ticket_id ON agent_metrics(ticket_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_agent_metrics_trace_id ON agent_metrics(trace_id)")
    
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_category_metrics_category_id ON category_metrics(category_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_category_metrics_date ON category_metrics(date)")
    
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_resolution_metrics_ticket_id ON ticket_resolution_metrics(ticket_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_resolution_metrics_category_id ON ticket_resolution_metrics(category_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_resolution_metrics_resolution_type ON ticket_resolution_metrics(resolution_type)")

    conn.commit()
    conn.close()
    print(f"✅ Database initialized at {DB_PATH}")


if __name__ == "__main__":
    init_database()
