import React from "react";
import ChatWidget from "./ChatWidget";

function Section({ title, children }) {
  return (
    <section className="space-y-4 border-b border-border/50 pb-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-4 text-sm leading-7 text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ code }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function StepCard({ step, title, children }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
        {step}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export default function DocumentationPage() {
  const backendEnv = `SOCKET_SERVICE_URL=http://localhost:4000`;

  const frontendEnv = `VITE_SOCKET_URL=http://localhost:4000
VITE_SOCKET_API_KEY=sk_xxxxxxxxxxxxxxxxx`;

  const backendRequest = `const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL;

await fetch(\`\${SOCKET_SERVICE_URL}/api/event/notification\`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    user_id: 123,
    type: "info",
    data: {
      title: "New Message",
      body: "You have received a new message."
    }
  })
});`;

  const backendAxiosRequest = `import axios from "axios";

const SOCKET_SERVICE_URL = process.env.SOCKET_SERVICE_URL;

await axios.post(\`\${SOCKET_SERVICE_URL}/api/event/notification\`, {
  user_id: 123,
  type: "info",
  data: {
    title: "New Message",
    body: "You have received a new message."
  }
});`;

  const payloadShape = `{
  "user_id": 123,
  "type": "info",
  "data": {
    "title": "New Message",
    "body": "You have received a new message."
  }
}`;

  const frontendSocketCode = `import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket", "polling"],
  auth: {
    apikey: import.meta.env.VITE_SOCKET_API_KEY,
    token: userToken
  }
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection failed:", err.message);
});

socket.on("new_notification", (payload) => {
  console.log("Realtime notification:", payload);
});`;

  const reactExample = `import { useEffect } from "react";
import { io } from "socket.io-client";

function NotificationListener({ userToken }) {
  useEffect(() => {
    if (!userToken) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
      auth: {
        apikey: import.meta.env.VITE_SOCKET_API_KEY,
        token: userToken
      }
    });

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("new_notification", (payload) => {
      console.log("Realtime notification:", payload);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection failed:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [userToken]);

  return null;
}

export default NotificationListener;`;

  const incomingPayload = `{
  "event": "NOTIFICATION_STREAM",
  "type": "info",
  "content": {
    "title": "New Message",
    "body": "You have received a new message."
  },
  "at": "2026-04-23T12:00:00.000Z"
}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="cursor-pointer">
        {" "}
        <ChatWidget />
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
        <div className="rounded-3xl border bg-card p-6 md:p-8">
          <p className="text-sm font-medium text-muted-foreground">
            Client Integration Guide
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Realtime Notification Integration
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            Connect your frontend to receive realtime notifications and send
            notification events from your backend to our socket service.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StepCard step="1" title="Set environment variables">
            Add the socket service URL in backend and frontend env files. Add
            your project API key in frontend env.
          </StepCard>

          <StepCard step="2" title="Send notification from backend">
            Your backend sends notification requests to our socket service with
            user ID, type, and data payload.
          </StepCard>

          <StepCard step="3" title="Receive notification on frontend">
            Your frontend connects using socket URL, project API key, and user
            token, then listens for realtime events.
          </StepCard>
        </div>

        <div className="mt-10 space-y-10">
          <Section title="1. Required Environment Variables">
            <p>Add the socket service URL to your backend environment file.</p>
            <CodeBlock code={backendEnv} />

            <p>
              Add the socket URL and your project API key to your frontend
              environment file.
            </p>
            <CodeBlock code={frontendEnv} />

            <div className="rounded-2xl border bg-muted/30 p-4 text-sm leading-6">
              <p>
                <strong>Frontend requires:</strong> socket URL, project API key,
                and the logged-in user token.
              </p>
              <p>
                <strong>Why?</strong> The socket connection is authenticated
                using <code>apikey</code> and <code>token</code>.
              </p>
            </div>
          </Section>

          <Section title="2. Send Notification from Your Backend">
            <p>
              Send a POST request from your backend to our socket service
              endpoint:
            </p>

            <CodeBlock code={`POST /api/event/notification`} />

            <p>Request body:</p>
            <CodeBlock code={payloadShape} />

            <p>Example using fetch:</p>
            <CodeBlock code={backendRequest} />

            <p>Example using axios:</p>
            <CodeBlock code={backendAxiosRequest} />

            <div className="rounded-2xl border bg-muted/30 p-4 text-sm leading-6">
              <p>
                <strong>user_id</strong> — ID of the user who should receive the
                notification
              </p>
              <p>
                <strong>type</strong> — Notification type such as info, success,
                warning, or error
              </p>
              <p>
                <strong>data</strong> — Custom payload that will be delivered to
                the frontend
              </p>
            </div>
          </Section>

          <Section title="3. Receive Realtime Notification on Frontend">
            <p>Install Socket.IO client in your frontend application:</p>

            <CodeBlock code={`npm install socket.io-client`} />

            <p>
              Then connect to the socket service using the socket URL from env,
              your project API key, and the logged-in user token.
            </p>

            <CodeBlock code={frontendSocketCode} />

            <p>React example:</p>
            <CodeBlock code={reactExample} />

            <p>Incoming notification payload:</p>
            <CodeBlock code={incomingPayload} />
          </Section>

          <Section title="Authentication Requirements">
            <div className="rounded-2xl border bg-muted/30 p-4 text-sm leading-6">
              <p>
                <strong>To receive notifications on frontend:</strong>
              </p>
              <p>
                - <code>VITE_SOCKET_URL</code> is required
              </p>
              <p>
                - <code>VITE_SOCKET_API_KEY</code> is required
              </p>
              <p>
                - user auth <code>token</code> is required
              </p>
            </div>

            <div className="rounded-2xl border bg-amber-500/10 p-4 text-sm leading-6">
              <p>
                <strong>Important:</strong> Your current backend notification
                endpoint does not require a secret key when sending requests.
              </p>
              <p>
                If you want to secure backend-to-backend notification delivery,
                add a private secret or API key validation on{" "}
                <code>/api/event/notification</code>.
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
