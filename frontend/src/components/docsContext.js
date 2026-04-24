export const DOCS_CONTEXT = `
Realtime Notification Integration

1. Environment Variables:
- SOCKET_SERVICE_URL
- VITE_SOCKET_URL
- VITE_SOCKET_API_KEY

2. Backend:
POST /api/event/notification
Payload:
{
  user_id,
  type,
  data: { title, body }
}

3. Frontend:
- Uses socket.io-client
- Requires apikey + token
- Listens to "new_notification"

4. Authentication:
- apikey required
- user token required

5. Notes:
- Backend endpoint is not secured by default
`;