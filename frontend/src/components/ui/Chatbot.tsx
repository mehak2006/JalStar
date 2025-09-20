
import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi , I’m Jalsthar Bot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // send conversation to your backend; include includeRealtime if you want server to attach
      const resp = await axios.post("/api/chat", {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        includeRealtime: true, // ask server to attach live sensor data (custom)
      });

      // OpenAI response shape: data.choices[0].message.content
      const reply = resp.data.choices?.[0]?.message?.content ?? "Sorry, no answer.";
      setMessages(prev => [...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...newMessages, { role: "assistant", content: ".. Oops — something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white/95 shadow-xl rounded-xl border border-blue-300 flex flex-col">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-t-xl font-semibold">
         Jalsthar Chatbot
      </div>

      <div className="flex-1 p-3 h-80 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded-lg ${msg.role === "user" ? "bg-sky-100 text-blue-900 self-end" : "bg-blue-50 text-slate-800"}`}>
            {msg.content}
          </div>
        ))}

        {loading && <div className="text-xs text-slate-500 italic">Jalsthar is thinking...</div>}
      </div>

      <div className="p-2 border-t flex">
        <input
          className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-sky-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          placeholder="Ask about groundwater, forecasts, or Jalsthar..."
        />
        <button onClick={sendMessage} className="ml-2 bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600">
          Send
        </button>
      </div>
    </div>
  );
}

