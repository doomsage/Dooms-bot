/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { createChatSession } from "./services/geminiService";
import { Message } from "./types";
import { Terminal } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      text: "I am DOOMSBOT. I am here to build your problem-solving intuition for JEE Main and Advanced. What chapter do you want to master today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Store the chat session in a ref so it persists across renders
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = createChatSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession();
      }

      // We use sendMessageStream for a better UX
      const streamResponse = await chatSessionRef.current.sendMessageStream({
        message: text,
      });

      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "",
      };

      setMessages((prev) => [...prev, newModelMessage]);

      let fullText = "";
      for await (const chunk of streamResponse) {
        if (chunk.text) {
          fullText += chunk.text;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === newModelMessage.id ? { ...msg, text: fullText } : msg,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "SYSTEM ERROR: Connection to DOOMSBOT neural network failed. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#e0e0e0] font-sans">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-[#1a1a1a] bg-[#0a0a0a] p-4 flex items-center justify-center gap-3 shadow-md z-10">
        <Terminal className="text-[#00f3ff]" size={28} />
        <h1 className="text-2xl font-mono font-bold tracking-widest neon-text uppercase text-center">
          DOOMSBOT – JEE AI MENTOR
        </h1>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff] flex items-center justify-center">
                  <Terminal
                    size={20}
                    className="text-[#00f3ff] animate-pulse"
                  />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#111111] text-[#00f3ff] rounded-tl-none border border-[#1a1a1a] neon-border font-mono text-sm flex items-center gap-2">
                  <span className="animate-pulse">PROCESSING</span>
                  <span className="flex gap-1">
                    <span className="animate-bounce delay-75">.</span>
                    <span className="animate-bounce delay-150">.</span>
                    <span className="animate-bounce delay-300">.</span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
