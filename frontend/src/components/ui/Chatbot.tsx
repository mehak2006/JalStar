import { useState } from "react";
import axios from "axios";

/// <reference types="vite/client" />

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi , I’m Jalsthar Bot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const apiKey = "OPENAI_API_KEY=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";
      console.log("Loaded API Key:", apiKey ? "Found" : " Missing"); // Debug check

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = response.data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: ".. Oops! Something went wrong." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 bg-white/95 shadow-xl rounded-xl border border-blue-300 flex flex-col">
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-t-xl font-semibold">
         Jalsthar Chatbot
      </div>
      <div className="flex-1 p-3 h-80 overflow-y-auto space-y-2 text-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              msg.role === "user"
                ? "bg-sky-100 text-blue-900 self-end"
                : "bg-blue-50 text-slate-800"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-sky-500"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-sky-500 text-white px-3 py-1 rounded-lg hover:bg-sky-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
