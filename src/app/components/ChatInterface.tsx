"use client";

import { useChat } from "@ai-sdk/react";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const formatMessageContent = (content: string) => {
    return content
      .split("\n")
      .map((line) => {
        if (line.startsWith("## ")) {
          return `<h2 class="text-xl font-bold my-2">${line.substring(3)}</h2>`;
        } else if (line.startsWith("### ")) {
          return `<h3 class="text-lg font-semibold my-1">${line.substring(
            4
          )}</h3>`;
        } else if (line.startsWith("- ")) {
          return `<li class="ml-4 list-disc">${line.substring(2)}</li>`;
        } else if (line.startsWith("**") && line.endsWith("**")) {
          return `<p class="font-bold">${line.substring(
            2,
            line.length - 2
          )}</p>`;
        }
        return `<p>${line}</p>`;
      })
      .join("");
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PII Scanner Chat</h1>

      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-auto"
                : "bg-white border border-gray-200"
            } max-w-[80%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
          >
            <div className="text-sm text-gray-500 mb-1">
              {message.role === "user" ? "You" : "Assistant"}
            </div>
            <div
              className="whitespace-pre-wrap text-black"
              dangerouslySetInnerHTML={{
                __html: formatMessageContent(message.content),
              }}
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-[80%]">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" />
            <div
              className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something about PII scanning..."
            className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`p-2 rounded-r-lg ${
              isLoading || !input.trim()
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
