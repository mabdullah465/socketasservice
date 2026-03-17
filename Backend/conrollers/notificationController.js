/**
 * Returns a notification handler that has access to io and onlineUsers.
 * In index.js: app.post("/api/event/notification", createSendNotification(io, onlineUsers));
 */
export default function createSendNotification(io, onlineUsers) {
  return function sendNotification(req, res) {
    const { user_id, type, data } = req.body;

    if (!user_id) return res.status(400).json({ error: "user_id required" });

    const uid = Number(user_id);
    const targetSocketId = onlineUsers[uid];

    if (targetSocketId) {
      io.to(targetSocketId).emit("new_notification", {
      event: "NOTIFICATION_STREAM",
      type: type || "info",
      content: data,
      at: new Date().toISOString(),
    });

      return res.json({
        status: "success",
        message: "Notification streamed to active socket",
        sent: true,
      });
    }

    console.log(`Notification dropped: User ${uid} is offline.`);
    return res.json({
      status: "ignored",
      message: "User not online, notification discarded",
      sent: false,
    });
  };
}
