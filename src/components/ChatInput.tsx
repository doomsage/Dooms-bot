import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  return (
    <div className="p-4 bg-[#050505] border-t border-[#1a1a1a]">
      <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-[#111111] rounded-xl neon-border p-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask DOOMSBOT about a JEE concept..."
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 resize-none outline-none max-h-[150px] py-2 px-3 font-sans"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={`p-3 rounded-lg flex-shrink-0 transition-colors ${
            input.trim() && !isLoading
              ? "bg-[#00f3ff]/20 text-[#00f3ff] hover:bg-[#00f3ff]/30"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          <Send size={20} />
        </button>
      </div>
      <div className="text-center mt-2">
        <span className="text-xs text-zinc-600 font-mono">
          DOOMSBOT v1.0 // JEE ADVANCED PROTOCOL
        </span>
      </div>
    </div>
  );
};
