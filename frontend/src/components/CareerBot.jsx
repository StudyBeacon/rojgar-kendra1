import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const BOT_INTRO =
  "👋 Hello! I’m your career assistant powered by AI. Ask me anything about jobs, resumes, or interviews.";

async function getBotResponse(userText, topic = "general") {
  try {
    const { data } = await axios.post("/api/v1/gpt/career-help", {
      message: userText,
      topic,
    });
    return data.reply || "Hmm, I didn't get a reply from the career coach.";
  } catch (err) {
    console.error("Gemini Error:", err.response?.data || err.message);
    return "Sorry, I couldn’t reach the career coach. Please try again later.";
  }
}

export default function CareerBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: BOT_INTRO },
  ]);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setTyping(true);

    const botText = await getBotResponse(input);
    console.log("👀 Gemini replied:", botText);

    const botMsg = {
      sender: "bot",
      text:
        botText?.trim().length > 0
          ? botText
          : "Gemini didn’t reply clearly. Try asking about resumes or interviews.",
    };

    setMessages([...updatedMessages, botMsg]);
    setTyping(false);
  };

  const handleInputKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([{ sender: "bot", text: BOT_INTRO }]);
    setTyping(false);
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Career Chatbot"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:justify-end bg-black bg-opacity-30">
          <div className="w-full max-w-sm md:max-w-md bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-2xl shadow-xl flex flex-col h-[70vh] md:h-[32rem] mx-auto md:mr-12 animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="font-bold text-lg text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                CareerBot
              </div>
              <div className="flex gap-2">
                <button
                  className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1 rounded"
                  onClick={handleReset}
                  title="Clear chat"
                >
                  Reset
                </button>
                <button
                  className="text-gray-400 hover:text-red-500 text-xl font-bold px-2"
                  onClick={() => setOpen(false)}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>

            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50 dark:bg-gray-800"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } animate-fadeIn`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] text-sm shadow ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="rounded-lg px-4 py-2 max-w-[80%] bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                    <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"></span>
                    <span
                      className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce mr-1"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              )}
            </div>

            <form
              className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                className="flex-1 rounded border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKey}
                autoFocus
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold text-sm disabled:opacity-50"
                disabled={!input.trim() || typing}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}