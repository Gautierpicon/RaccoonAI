"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setResponse(data.response || "No response.");
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error during data recovery.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <img src="/logo.svg" alt="Logo" className="h-10 w-10 mr-2" />
        <h1 className="text-3xl font-bold">Raccoon.ai</h1>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full h-32"
        placeholder="Enter your prompt..."
      />
      <button
        onClick={sendPrompt}
        className={`mt-2 ${
          input.trim() === "" || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-700 cursor-pointer"
        } text-white p-2 rounded`}
        disabled={input.trim() === "" || loading}
      >
        {loading ? "Loading..." : "Send"}
      </button>
      <div className="mt-4 p-2 border bg-gray-100 min-h-[100px] whitespace-pre-wrap">
        {response}
      </div>
    </div>
  );
}