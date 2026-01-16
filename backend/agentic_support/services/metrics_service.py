"""
Metrics service for aggregating and querying agent and category metrics
Author: Vinod Kumar V (VKV)
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

from ..db.database import get_db


class MetricsService:
    """Service for querying and aggregating metrics data."""
    
    @staticmethod
    def get_agent_metrics(
        agent_name: Optional[str] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        """Get agent execution metrics."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM agent_metrics WHERE 1=1"
            params = []
            
            if agent_name:
                query += " AND agent_name = ?"
                params.append(agent_name)
            
            if from_date:
                query += " AND timestamp >= ?"
                params.append(from_date)
            
            if to_date:
                query += " AND timestamp <= ?"
                params.append(to_date)
            
            query += " ORDER BY timestamp DESC LIMIT ?"
            params.append(limit)
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            return [dict(row) for row in rows]
    
    @staticmethod
    def get_agent_aggregates(
        agent_name: Optional[str] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get aggregated metrics for agents."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT 
                    agent_name,
                    COUNT(*) as execution_count,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_executions,
                    SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_executions,
                    AVG(latency_ms) as avg_latency_ms,
                    SUM(tokens_total) as total_tokens,
                    SUM(cost_usd) as total_cost_usd
                FROM agent_metrics
                WHERE 1=1
            """
            params = []
            
            if agent_name:
                query += " AND agent_name = ?"
                params.append(agent_name)
            
            if from_date:
                query += " AND timestamp >= ?"
                params.append(from_date)
            
            if to_date:
                query += " AND timestamp <= ?"
                params.append(to_date)
            
            query += " GROUP BY agent_name"
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            results = []
            for row in rows:
                exec_count = row["execution_count"]
                success_count = row["successful_executions"]
                success_rate = (success_count / exec_count * 100) if exec_count > 0 else 0
                
                results.append({
                    "agent_name": row["agent_name"],
                    "execution_count": exec_count,
                    "successful_executions": success_count,
                    "failed_executions": row["failed_executions"],
                    "success_rate": round(success_rate, 2),
                    "avg_latency_ms": round(row["avg_latency_ms"] or 0, 2),
                    "total_tokens": row["total_tokens"] or 0,
                    "total_cost_usd": round(row["total_cost_usd"] or 0.0, 4),
                })
            
            return results
    
    @staticmethod
    def get_category_metrics(
        category_id: Optional[str] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get category-level metrics."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM category_metrics WHERE 1=1"
            params = []
            
            if category_id:
                query += " AND category_id = ?"
                params.append(category_id)
            
            if from_date:
                query += " AND date >= ?"
                params.append(from_date)
            
            if to_date:
                query += " AND date <= ?"
                params.append(to_date)
            
            query += " ORDER BY date DESC"
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            return [dict(row) for row in rows]
    
    @staticmethod
    def get_resolution_metrics(
        category_id: Optional[str] = None,
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get ticket resolution metrics with breakdown."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT 
                    resolution_type,
                    COUNT(*) as count,
                    AVG(mtr_seconds) as avg_mtr_seconds
                FROM ticket_resolution_metrics
                WHERE 1=1
            """
            params = []
            
            if category_id:
                query += " AND category_id = ?"
                params.append(category_id)
            
            if from_date:
                query += " AND created_at >= ?"
                params.append(from_date)
            
            if to_date:
                query += " AND created_at <= ?"
                params.append(to_date)
            
            query += " GROUP BY resolution_type"
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            total = sum(row["count"] for row in rows)
            
            breakdown = {}
            for row in rows:
                resolution_type = row["resolution_type"] or "unknown"
                count = row["count"]
                breakdown[resolution_type] = {
                    "count": count,
                    "percentage": round((count / total * 100) if total > 0 else 0, 2),
                    "avg_mtr_seconds": round(row["avg_mtr_seconds"] or 0, 2),
                }
            
            return {
                "total": total,
                "breakdown": breakdown,
            }
    
    @staticmethod
    def get_handoff_metrics(
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get human handoff statistics."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT 
                    handoff_type,
                    COUNT(*) as count
                FROM ticket_resolution_metrics
                WHERE handoff_type IS NOT NULL AND handoff_type != 'none'
            """
            params = []
            
            if from_date:
                query += " AND handoff_timestamp >= ?"
                params.append(from_date)
            
            if to_date:
                query += " AND handoff_timestamp <= ?"
                params.append(to_date)
            
            query += " GROUP BY handoff_type"
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            total_handoffs = sum(row["count"] for row in rows)
            
            # Get total tickets for percentage calculation
            total_query = "SELECT COUNT(*) as total FROM ticket_resolution_metrics WHERE 1=1"
            total_params = []
            if from_date:
                total_query += " AND created_at >= ?"
                total_params.append(from_date)
            if to_date:
                total_query += " AND created_at <= ?"
                total_params.append(to_date)
            
            cursor.execute(total_query, total_params)
            total_tickets = cursor.fetchone()["total"] or 0
            
            breakdown = {}
            for row in rows:
                handoff_type = row["handoff_type"]
                count = row["count"]
                breakdown[handoff_type] = {
                    "count": count,
                    "percentage": round((count / total_tickets * 100) if total_tickets > 0 else 0, 2),
                }
            
            return {
                "total_handoffs": total_handoffs,
                "handoff_percentage": round((total_handoffs / total_tickets * 100) if total_tickets > 0 else 0, 2),
                "breakdown": breakdown,
            }
    
    @staticmethod
    def get_channel_volumes(
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get volume by entry channel."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            query = """
                SELECT 
                    channel,
                    COUNT(*) as volume,
                    SUM(CASE WHEN resolution_type = 'auto-resolved' THEN 1 ELSE 0 END) as auto_resolved,
                    SUM(CASE WHEN resolution_type = 'escalated' THEN 1 ELSE 0 END) as escalated
                FROM ticket_resolution_metrics
                WHERE 1=1
            """
            params = []
            
            if from_date:
                query += " AND created_at >= ?"
                params.append(from_date)
            
            if to_date:
                query += " AND created_at <= ?"
                params.append(to_date)
            
            query += " GROUP BY channel ORDER BY volume DESC"
            
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            return [
                {
                    "channel": row["channel"] or "unknown",
                    "volume": row["volume"],
                    "auto_resolved": row["auto_resolved"],
                    "escalated": row["escalated"],
                }
                for row in rows
            ]
    
    @staticmethod
    def get_kpi_metrics(
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get key performance indicators."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Self-heal success rate
            resolution_query = """
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN resolution_type = 'auto-resolved' THEN 1 ELSE 0 END) as auto_resolved
                FROM ticket_resolution_metrics
                WHERE 1=1
            """
            resolution_params = []
            if from_date:
                resolution_query += " AND created_at >= ?"
                resolution_params.append(from_date)
            if to_date:
                resolution_query += " AND created_at <= ?"
                resolution_params.append(to_date)
            
            cursor.execute(resolution_query, resolution_params)
            resolution_row = cursor.fetchone()
            total_tickets = resolution_row["total"] or 0
            auto_resolved = resolution_row["auto_resolved"] or 0
            self_heal_rate = (auto_resolved / total_tickets * 100) if total_tickets > 0 else 0
            
            # Average resolution time
            mtr_query = """
                SELECT AVG(mtr_seconds) as avg_mtr
                FROM ticket_resolution_metrics
                WHERE mtr_seconds IS NOT NULL
            """
            mtr_params = []
            if from_date:
                mtr_query += " AND created_at >= ?"
                mtr_params.append(from_date)
            if to_date:
                mtr_query += " AND created_at <= ?"
                mtr_params.append(to_date)
            
            cursor.execute(mtr_query, mtr_params)
            mtr_row = cursor.fetchone()
            avg_mtr_seconds = mtr_row["avg_mtr"] or 0
            
            # Total cost savings (estimate: human support costs $12.50 per ticket, AI costs from agent_metrics)
            cost_query = """
                SELECT SUM(cost_usd) as total_cost
                FROM agent_metrics
                WHERE 1=1
            """
            cost_params = []
            if from_date:
                cost_query += " AND timestamp >= ?"
                cost_params.append(from_date)
            if to_date:
                cost_query += " AND timestamp <= ?"
                cost_params.append(to_date)
            
            cursor.execute(cost_query, cost_params)
            cost_row = cursor.fetchone()
            total_ai_cost = cost_row["total_cost"] or 0.0
            
            # Estimate human cost (escalated tickets * $12.50)
            escalated_count = total_tickets - auto_resolved
            estimated_human_cost = escalated_count * 12.50
            cost_savings = estimated_human_cost - total_ai_cost
            
            return {
                "self_heal_rate": round(self_heal_rate, 2),
                "avg_resolution_time_seconds": round(avg_mtr_seconds, 2),
                "cost_savings_usd": round(cost_savings, 2),
                "total_tickets": total_tickets,
                "auto_resolved": auto_resolved,
                "escalated": escalated_count,
            }
    
    @staticmethod
    def get_collaboration_metrics(
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get agent collaboration patterns."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Autonomous agent chain (tickets that were auto-resolved)
            auto_query = """
                SELECT COUNT(*) as count
                FROM ticket_resolution_metrics
                WHERE resolution_type = 'auto-resolved'
            """
            auto_params = []
            if from_date:
                auto_query += " AND created_at >= ?"
                auto_params.append(from_date)
            if to_date:
                auto_query += " AND created_at <= ?"
                auto_params.append(to_date)
            
            cursor.execute(auto_query, auto_params)
            auto_count = cursor.fetchone()["count"] or 0
            
            # Get success rate for auto-resolved (from agent metrics)
            agent_success_query = """
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful
                FROM agent_metrics
                WHERE 1=1
            """
            agent_params = []
            if from_date:
                agent_success_query += " AND timestamp >= ?"
                agent_params.append(from_date)
            if to_date:
                agent_success_query += " AND timestamp <= ?"
                agent_params.append(to_date)
            
            cursor.execute(agent_success_query, agent_params)
            agent_row = cursor.fetchone()
            agent_total = agent_row["total"] or 0
            agent_successful = agent_row["successful"] or 0
            agent_success_rate = (agent_successful / agent_total * 100) if agent_total > 0 else 0
            
            # Get avg latency and cost for auto-resolved
            agent_avg_query = """
                SELECT 
                    AVG(latency_ms) as avg_latency,
                    AVG(cost_usd) as avg_cost
                FROM agent_metrics
                WHERE success = 1
            """
            agent_avg_params = []
            if from_date:
                agent_avg_query += " AND timestamp >= ?"
                agent_avg_params.append(from_date)
            if to_date:
                agent_avg_query += " AND timestamp <= ?"
                agent_avg_params.append(to_date)
            
            cursor.execute(agent_avg_query, agent_avg_params)
            agent_avg_row = cursor.fetchone()
            
            # AI-to-Human handoff
            handoff_query = """
                SELECT 
                    COUNT(*) as count,
                    AVG(mtr_seconds) as avg_handoff_time
                FROM ticket_resolution_metrics
                WHERE resolution_type = 'escalated' AND handoff_type IS NOT NULL
            """
            handoff_params = []
            if from_date:
                handoff_query += " AND created_at >= ?"
                handoff_params.append(from_date)
            if to_date:
                handoff_query += " AND created_at <= ?"
                handoff_params.append(to_date)
            
            cursor.execute(handoff_query, handoff_params)
            handoff_row = cursor.fetchone()
            handoff_count = handoff_row["count"] or 0
            
            # Human resolution rate (assume 88% for escalated tickets)
            human_resolution_rate = 88.0
            
            return {
                "autonomous_agent_chain": {
                    "volume": auto_count,
                    "success_rate": round(agent_success_rate, 2),
                    "avg_latency_ms": round(agent_avg_row["avg_latency"] or 0, 2),
                    "cost_per_resolution_usd": round(agent_avg_row["avg_cost"] or 0.0, 4),
                },
                "ai_to_human_handoff": {
                    "volume": handoff_count,
                    "handoff_rate": round((handoff_count / (auto_count + handoff_count) * 100) if (auto_count + handoff_count) > 0 else 0, 2),
                    "avg_handoff_time_seconds": round(handoff_row["avg_handoff_time"] or 0, 2),
                    "human_resolution_rate": human_resolution_rate,
                },
                "human_initiated_ai_assist": {
                    "volume": 0,  # Placeholder - would need additional tracking
                    "delegation_rate": 0.0,
                    "ai_success_rate": 0.0,
                    "time_saved_minutes": 0.0,
                },
            }
    
    @staticmethod
    def get_alerts(
        from_date: Optional[str] = None,
        to_date: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Get system health alerts based on thresholds."""
        alerts = []
        
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check for high latency agents
            latency_query = """
                SELECT agent_name, AVG(latency_ms) as avg_latency
                FROM agent_metrics
                WHERE timestamp >= datetime('now', '-1 hour')
                GROUP BY agent_name
                HAVING AVG(latency_ms) > 2000
            """
            cursor.execute(latency_query)
            latency_rows = cursor.fetchall()
            
            for row in latency_rows:
                alerts.append({
                    "type": "performance",
                    "severity": "warning",
                    "title": "High Latency Detected",
                    "description": f"{row['agent_name']} averaging {row['avg_latency']:.0f}ms (threshold: 2000ms)",
                    "timestamp": datetime.utcnow().isoformat(),
                })
            
            # Check for success rate decline
            success_query = """
                SELECT 
                    agent_name,
                    (SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as current_rate
                FROM agent_metrics
                WHERE timestamp >= datetime('now', '-24 hours')
                GROUP BY agent_name
                HAVING current_rate < 70
            """
            cursor.execute(success_query)
            success_rows = cursor.fetchall()
            
            for row in success_rows:
                alerts.append({
                    "type": "success_rate",
                    "severity": "error",
                    "title": "Success Rate Decline",
                    "description": f"{row['agent_name']} success rate dropped to {row['current_rate']:.1f}%",
                    "timestamp": datetime.utcnow().isoformat(),
                })
            
            # Check for volume spikes by category
            volume_query = """
                SELECT 
                    category_name,
                    COUNT(*) as recent_count
                FROM ticket_resolution_metrics
                WHERE created_at >= datetime('now', '-1 hour')
                GROUP BY category_name
                HAVING recent_count > 50
            """
            cursor.execute(volume_query)
            volume_rows = cursor.fetchall()
            
            for row in volume_rows:
                alerts.append({
                    "type": "volume_spike",
                    "severity": "info",
                    "title": "Volume Spike Detected",
                    "description": f"{row['category_name']} issues up - {row['recent_count']} tickets in last hour",
                    "timestamp": datetime.utcnow().isoformat(),
                })
        
        # Sort by timestamp (most recent first) and limit to 10
        alerts.sort(key=lambda x: x["timestamp"], reverse=True)
        return alerts[:10]
    
    @staticmethod
    def update_category_metrics(
        category_id: str,
        category_name: str,
        date: str,
    ):
        """Update or insert category metrics (called after ticket resolution)."""
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Get ticket counts for this category and date
            resolution_query = """
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN resolution_type = 'auto-resolved' THEN 1 ELSE 0 END) as successful,
                    SUM(CASE WHEN resolution_type = 'failed' THEN 1 ELSE 0 END) as failed,
                    AVG(mtr_seconds) as avg_mtr
                FROM ticket_resolution_metrics
                WHERE category_id = ? AND DATE(created_at) = ?
            """
            cursor.execute(resolution_query, (category_id, date))
            resolution_row = cursor.fetchone()
            
            # Get agent metrics for this category
            agent_query = """
                SELECT 
                    AVG(latency_ms) as avg_latency,
                    SUM(tokens_total) as total_tokens,
                    SUM(cost_usd) as total_cost
                FROM agent_metrics
                WHERE category_id = ? AND DATE(timestamp) = ?
            """
            cursor.execute(agent_query, (category_id, date))
            agent_row = cursor.fetchone()
            
            total = resolution_row["total"] or 0
            successful = resolution_row["successful"] or 0
            success_rate = (successful / total * 100) if total > 0 else 0
            
            # Upsert category metrics
            cursor.execute("""
                INSERT INTO category_metrics (
                    category_id, category_name, date,
                    total_tickets, successful_tickets, failed_tickets,
                    success_rate, avg_latency_ms, total_tokens, total_cost_usd, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(category_id, date) DO UPDATE SET
                    total_tickets = excluded.total_tickets,
                    successful_tickets = excluded.successful_tickets,
                    failed_tickets = excluded.failed_tickets,
                    success_rate = excluded.success_rate,
                    avg_latency_ms = excluded.avg_latency_ms,
                    total_tokens = excluded.total_tokens,
                    total_cost_usd = excluded.total_cost_usd,
                    updated_at = excluded.updated_at
            """, (
                category_id,
                category_name,
                date,
                total,
                successful,
                resolution_row["failed"] or 0,
                success_rate,
                int(agent_row["avg_latency"] or 0),
                agent_row["total_tokens"] or 0,
                agent_row["total_cost"] or 0.0,
                datetime.utcnow(),
            ))


# Global instance
metrics_service = MetricsService()
