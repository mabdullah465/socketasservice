// controllers/projectController.js
import db from "../db.js";

export const GetProjectAnalytics = async (req, res) => {
  const { projectId } = req.params;

  try {
    // 1. Total notifications count
    const [totalRes] = await db.query(
      "SELECT COUNT(*) as count FROM notification_logs WHERE project_id = ?",
      [projectId]
    );

    // 2. Breakdown by status (sent vs offline)
    const [statsRes] = await db.query(
      "SELECT status, COUNT(*) as count FROM notification_logs WHERE project_id = ? GROUP BY status",
      [projectId]
    );

    // 3. Optional: Get recent logs
    const [recentLogs] = await db.query(
      "SELECT type, status, created_at FROM notification_logs WHERE project_id = ? ORDER BY created_at DESC LIMIT 10",
      [projectId]
    );

    res.json({
      total: totalRes[0].count,
      stats: statsRes,
      recent: recentLogs
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};