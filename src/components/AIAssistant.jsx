
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";

import apiRequest from "../services/api";

function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your BCP Library AI Assistant. Ask me about books and library services.",
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, loading, isOpen]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const question = message.trim();

    if (!question || loading || question.length > 1000) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const result = await apiRequest("/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: question,
        }),
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            result?.data?.reply ||
            "Sorry, I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            error.message ||
            "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    fixed right-4 z-[60]
    bottom-[calc(11rem+env(safe-area-inset-bottom))]
    lg:bottom-5 lg:right-5
  "
    >
      {isOpen && (
        <section
          aria-label="BCP Library AI Assistant"
          className="mb-3 flex h-[min(520px,75dvh)] w-[min(380px,calc(100vw-40px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-[#08233f] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <FaRobot />

              <div>
                <h2 className="text-sm font-bold">
                  BCP Library AI
                </h2>
                <p className="text-xs text-slate-300">
                  Library Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close AI Assistant"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <FaTimes />
            </button>
          </header>

          <div
            role="log"
            aria-live="polite"
            className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4"
          >
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${item.role === "user"
                      ? "whitespace-pre-wrap bg-blue-700 text-white"
                      : "border border-slate-200 bg-white text-slate-800"
                    }`}
                >
                  {item.role === "assistant" ? (
                    <div className="space-y-2 [&_p]:my-1 [&_strong]:font-bold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_a]:text-blue-700 [&_a]:underline">
                      <ReactMarkdown
                        components={{
                          a: ({ children }) => (
                            <span className="font-medium text-blue-700">
                              {children}
                            </span>
                          ),
                        }}
                      >
                        {item.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    item.text
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-xs text-slate-500">
                AI is thinking...
              </p>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              maxLength={1000}
              placeholder="Ask about library books..."
              aria-label="Message to AI Assistant"
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              aria-label="Send message"
              className="rounded-xl bg-blue-700 p-3 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPaperPlane />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={
          isOpen
            ? "Close AI Assistant"
            : "Open AI Assistant"
        }
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-xl text-white shadow-lg transition hover:bg-blue-800"
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>
    </div>
  );
}

export default AIAssistant;
