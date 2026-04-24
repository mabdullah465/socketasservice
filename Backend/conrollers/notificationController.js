import db from "../db.js"; // Adjust the path based on your folder structure

/**
 * Enhanced Notification handler with Analytics Logging
 * In index.js: app.post("/api/event/notification", createSendNotification(io, onlineUsers));
 */
export default function createSendNotification(io, onlineUsers) {
  return async function sendNotification(req, res) {
    const { user_id, project_id, type, data } = req.body;

    // Validation
    if (!user_id) return res.status(400).json({ error: "user_id required" });
    if (!project_id) return res.status(400).json({ error: "project_id required for analytics" });

    const uid = Number(user_id);
    const targetSocketId = onlineUsers[uid];
    let status = "failed_offline";

    // 1. Attempt to emit via Socket.io
    if (targetSocketId) {
      io.to(targetSocketId).emit("new_notification", {
        event: "NOTIFICATION_STREAM",
        type: type || "info",
        content: data,
        at: new Date().toISOString(),
      });
      status = "sent";
    }

    // 2. Log to Analytics (Database)
    try {
      // project_id is treated as a string (VARCHAR(36)) to match your schema
      await db.query(
        "INSERT INTO notification_logs (project_id, user_id, type, status) VALUES (?, ?, ?, ?)",
        [project_id, uid, type || "info", status]
      );
    } catch (err) {
      // We log the error but don't fail the request, 
      // so the user still gets their notification even if analytics DB is busy.
      console.error("Analytics Logging Error:", err.message);
    }

    // 3. Respond to the Client
    if (status === "sent") {
      return res.json({
        status: "success",
        message: "Notification streamed to active socket",
        sent: true,
      });
    } else {
      console.log(`Notification dropped: User ${uid} is offline.`);
      return res.json({
        status: "ignored",
        message: "User not online, notification discarded",
        sent: false,
      });
    }
  };
}