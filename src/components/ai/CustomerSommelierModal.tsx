"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Send, Coffee, Bot, User, ArrowRight } from "lucide-react";
import { ChatMessage } from "@/types/ai";
import { askSommelierAction } from "@/actions/ai";

export const CustomerSommelierModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-1",
      role: "assistant",
      content:
        "Greetings! I am your **Movi Digital Sommelier & Barista**. Whether you are looking for a bright pour-over, a velvety iced latte, or pastry pairings in Kaduwela, ask me anything!",
      timestamp: new Date().toISOString(),
      suggestions: [
        "What is your best iced coffee?",
        "Recommend a low-acidity brew",
        "Which pastry pairs with Flat White?",
        "Can I book a quiet work table?",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isThinking) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const result = await askSommelierAction(query.trim(), messages);
      if (result.success && result.message) {
        setMessages((prev) => [...prev, result.message!]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "My apologies, I had a brief moment of distraction while pulling an espresso shot. Please ask again!",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "I am momentarily unavailable. Please check our Menu page or visit our baristas in Kaduwela!",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-5 z-40 lg:bottom-6 lg:right-6 flex items-center gap-2 px-4 py-2.5 bg-espresso/95 hover:bg-espresso text-warm-cream border border-muted-gold/40 hover:border-muted-gold rounded-full shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-md"
        aria-label="Open Coffee Sommelier AI"
      >
        <span className="w-2 h-2 rounded-full bg-muted-gold animate-pulse" />
        <Sparkles className="w-3.5 h-3.5 text-muted-gold" />
        <span className="font-sans text-xs tracking-wider uppercase font-medium">
          Ask Barista AI
        </span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Movi Coffee Sommelier"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg h-[600px] max-h-[92vh] flex flex-col bg-warm-cream border border-espresso/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-espresso text-warm-cream flex items-center justify-between border-b border-muted-gold/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted-gold/20 flex items-center justify-center text-muted-gold border border-muted-gold/40">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-warm-cream leading-tight">
                    Movi Barista Sommelier
                  </h3>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-muted-gold">
                    AI Palate Guide • Kaduwela
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-warm-cream/60 hover:text-warm-cream cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-espresso text-warm-cream rounded-tr-none rounded-2xl"
                        : "bg-soft-beige/50 text-espresso border border-espresso/15 rounded-tl-none rounded-2xl"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase tracking-wider text-muted-coffee font-medium">
                      {msg.role === "user" ? (
                        <>
                          <span>You</span>
                          <User className="w-3 h-3 text-warm-cream/50" />
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-muted-gold" />
                          <span className="text-muted-gold">Movi Sommelier</span>
                        </>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-espresso/10 flex flex-wrap gap-1.5">
                        {msg.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSendMessage(suggestion)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-warm-cream/80 hover:bg-warm-cream border border-espresso/20 text-[11px] text-espresso rounded-full transition-colors cursor-pointer"
                          >
                            <span>{suggestion}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-muted-gold" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-xs text-espresso/60 italic p-3 bg-soft-beige/30 rounded-2xl w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-gold animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-gold animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-gold animate-bounce [animation-delay:0.4s]" />
                  <span>Brewing recommendation...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-warm-cream border-t border-espresso/15 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about roast notes, pairings, seating..."
                className="flex-1 bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-xs sm:text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-espresso font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="p-2.5 bg-espresso text-warm-cream hover:bg-espresso/90 disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Send"
              >
                <Send className="w-4 h-4 text-muted-gold" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
