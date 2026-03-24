import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Mic, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || 'MISSING_API_KEY',
  dangerouslyAllowBrowser: true
});

export default function AgriBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! 🙏 I'm AgriBot. Ask me anything about farming — crop diseases, weather, fertilizers, government schemes, or market prices!"
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('English');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    const userMsg = { id: Date.now(), sender: 'user', text: userText };
    const currentMessages = [...messages, userMsg];
    
    setMessages(currentMessages);
    setInputVal('');
    setIsTyping(true);

    try {
      if (client.apiKey === 'MISSING_API_KEY' || !client.apiKey || client.apiKey.trim() === '') {
        throw new Error("API Key is missing. Ensure VITE_OPENROUTER_API_KEY is saved in agrismart/.env and you restarted the dev server.");
      }

      const apiMessages = [
        { role: 'system', content: `You are AgriBot, an AI farming assistant for Indian farmers. Answer their farming-related queries. Keep responses short and genuinely helpful. CRITICAL INSTRUCTION: You MUST reply entirely in ${language}. Translate your response into ${language} before sending it to the user.` },
        ...messages.filter(m => m.id !== 1).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
          ...(m.reasoning_details ? { reasoning_details: m.reasoning_details } : {})
        })),
        { role: 'user', content: userText }
      ];

      const apiResponse = await client.chat.completions.create({
        model: 'nvidia/nemotron-nano-12b-v2-vl:free',
        messages: apiMessages,
        reasoning: { enabled: true }
      });

      const response = apiResponse.choices[0].message;
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.content || "Sorry, I couldn't understand that.",
        reasoning_details: response.reasoning_details
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: 'Connection failed. Please check your API key and network.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (text) => {
    setInputVal(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl mb-4 w-[340px] sm:w-[380px] overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center">
                    AgriBot
                    <Sparkles className="h-4 w-4 ml-1 text-yellow-300" />
                  </h3>
                  <p className="text-xs text-green-100 opacity-90">Powered by AI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/20 border border-white/30 text-white text-xs font-medium rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer [&>option]:text-gray-800"
                >
                  <option value="English">EN</option>
                  <option value="Hindi">HI</option>
                  <option value="Marathi">MR</option>
                </select>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="h-[400px] overflow-y-auto bg-cream/30 p-4 custom-scrollbar">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-primary text-white rounded-br-sm' 
                          : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm p-4 shadow-sm w-16">
                      <div className="flex space-x-1 justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 py-2 bg-cream/30 border-t border-gray-50 flex gap-2 overflow-x-auto hide-scrollbar">
                {["My crop has yellow leaves", "Best crop for black soil", "PM-KISAN scheme details"].map((reply, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="whitespace-nowrap flex-shrink-0 bg-white border border-primary/20 hover:border-primary text-primary text-xs px-3 py-1.5 rounded-full transition-colors shadow-sm"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <div className="p-3 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex items-center space-x-2 relative">
                <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors">
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button 
                  type="submit" 
                  disabled={!inputVal.trim()}
                  className="bg-primary hover:bg-darkGreen disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors shadow-sm"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-primary hover:bg-darkGreen text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6 relative z-10" />}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-40"></div>
        )}
      </button>

      {/* Pulse badge for first load */}
      {!isOpen && (
        <div className="absolute right-16 bottom-2 bg-white text-darkGreen px-4 py-2 rounded-lg rounded-br-none shadow-lg text-sm font-semibold whitespace-nowrap hidden sm:block">
          Ask me anything!
        </div>
      )}
    </div>
  );
}
