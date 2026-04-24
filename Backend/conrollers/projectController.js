import { v4 as uuidv4 } from "uuid";
import db from "../db.js";

// CREATE NEW PROJECT
async function CreateProject(req, res) {
  const { name, base_url, authendpoint } = req.body;

  // Basic validation
  if (!name || !base_url || !authendpoint) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const id = uuidv4();
    const api_key = `sk_${uuidv4().replace(/-/g, "")}`;

    const sql =
      "INSERT INTO projects (id, name, base_url, authendpoint, api_key) VALUES (?, ?, ?, ?, ?)";
    await db.query(sql, [id, name, base_url, authendpoint, api_key]);

    return res.status(201).json({
      message: "Project created successfully",
      project: { id, name, api_key, base_url, authendpoint },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create project" });
  }
}

// GET ALL PROJECTS
async function GetAllProjects(req, res) {
  try {
    const sql = "SELECT * FROM projects ORDER BY created_at DESC";
    const [projects] = await db.query(sql);
    return res.json(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching projects" });
  }
}

// GET SINGLE PROJECT BY ID
async function GetProjectById(req, res) {
  const { projectId } = req.params;

  try {
    const sql = "SELECT * FROM projects WHERE id = ?";
    const [data] = await db.query(sql, [projectId]);

    if (data.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json(data[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching project details" });
  }
}

const GetProjectAnalytics = async (req, res) => {
  const { projectId } = req.params;

  try {
    // 1. Total notifications count
    const [totalRes] = await db.query(
      "SELECT COUNT(*) as count FROM notification_logs WHERE project_id = ?",
      [projectId],
    );

    // 2. Breakdown by status (sent vs offline)
    const [statsRes] = await db.query(
      "SELECT status, COUNT(*) as count FROM notification_logs WHERE project_id = ? GROUP BY status",
      [projectId],
    );

    // 3. Optional: Get recent logs
    const [recentLogs] = await db.query(
      "SELECT type, status, created_at FROM notification_logs WHERE project_id = ? ORDER BY created_at DESC LIMIT 10",
      [projectId],
    );

    res.json({
      total: totalRes[0].count,
      stats: statsRes,
      recent: recentLogs,
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { CreateProject, GetAllProjects, GetProjectById, GetProjectAnalytics };
