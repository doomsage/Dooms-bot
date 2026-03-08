import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Bot, User } from "lucide-react";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      <div
        className={`flex max-w-[85%] sm:max-w-[75%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-3`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-zinc-800 border border-zinc-700"
              : "bg-[#00f3ff]/10 border border-[#00f3ff]"
          }`}
        >
          {isUser ? (
            <User size={20} className="text-zinc-300" />
          ) : (
            <Bot size={20} className="text-[#00f3ff]" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700"
              : "bg-[#111111] text-zinc-300 rounded-tl-none border border-[#1a1a1a] neon-border"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.text}</p>
          ) : (
            <div className="markdown-body">
              <Markdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {message.text}
              </Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
