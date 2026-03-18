# Notification Service Documentation

This service handles real-time user notifications via a combination of WebSocket connections and REST API endpoints.

---

## 🔌 Socket Handshake

To establish a socket connection, the client must include the following headers in the handshake request. These are required for authentication and authorizing access to socket events.

### Required Headers

| Header | Description |
| :--- | :--- |
| `apikey` | The unique API key assigned to your project. |
| `token` | The authentication token of the user. |

---

## 🔔 Notification Endpoint

The `/api/event/notification` endpoint is used to send notifications to specific users.

### Request Details

* **Method:** `POST`
* **URL:** `/api/event/notification`

### Request Body (JSON)

| Property | Type | Description |
| :--- | :--- | :--- |
| `user_id` | String/Number | The ID of the recipient user. |
| `type` | String | The category of notification (e.g., `"info"`, `"error"`). |
| `data` | String | The actual content or message of the notification. |

#### Example Payload
```json
{
  "user_id": 12345,
  "type": "info",
  "data": "Your update has been processed successfully."
}
