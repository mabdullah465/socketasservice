import { useState } from "react";
import axios from "axios";
import { DOCS_CONTEXT } from "./docsContext";

const OPENROUTER_API_KEY = "YOUR_OPENROUTER_KEY";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content: `
You are a documentation assistant.

Rules:
- Answer ONLY using provided documentation
- If not found, say "Not in documentation"

Documentation:
${DOCS_CONTEXT}
              `,
            },
            ...newMessages,
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${"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"}`,
            "Content-Type": "application/json",
          },
        },
      );

      const reply = res.data.choices[0].message;

      setMessages([...newMessages, reply]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Error fetching response" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed cursor-pointer bottom-6 right-6 rounded-full bg-primary px-4 py-3 text-white shadow-lg"
      >
        AI
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 rounded-2xl border bg-card shadow-xl">
          <div className="border-b p-3 font-semibold">Docs Assistant</div>

          <div className="h-72 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div key={i}>
                <strong>{m.role}:</strong> {m.content}
              </div>
            ))}
            {loading && <p>Typing...</p>}
          </div>

          <div className="flex border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 text-sm outline-none"
              placeholder="Ask about docs..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="px-3 text-sm">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
