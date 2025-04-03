'use client';

import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, X, SendHorizonal } from 'lucide-react';

type Message = {
  sender: 'user' | 'ai';
  text: string;
}

// Enhanced AI Helper with contextual awareness and guide features
export default function AIHelperChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'ai', 
      text: "Hello! I'm your Savannah Intelligence AI assistant. How can I help you analyze data today?" 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI typing with a slight delay
  const simulateResponse = (userQuery: string) => {
    setIsTyping(true);
    
    // Generate contextual response based on user query keywords
    let aiResponse = '';
    
    if (userQuery.toLowerCase().includes('security') || userQuery.toLowerCase().includes('risk')) {
      aiResponse = `Based on recent security data in East Africa, I'm seeing a moderate downward trend in incidents over the past 3 months (15% reduction). The regional stability index is currently at 6.8/10, with most concern focused on urban areas. Would you like more detailed metrics or a breakdown by country?`;
    } 
    else if (userQuery.toLowerCase().includes('economic') || userQuery.toLowerCase().includes('investment')) {
      aiResponse = `I've analyzed economic indicators for Nigeria over the past quarter. GDP growth is trending at +5.1%, with foreign direct investment up 23% year-over-year. The primary growth sectors are technology, financial services, and agriculture. Would you like a visualization of this trend or comparison with other regional economies?`;
    }
    else if (userQuery.toLowerCase().includes('identify') || userQuery.toLowerCase().includes('ahmed')) {
      aiResponse = `Looking at the entity profile for Ahmed Hassan (Egyptian Finance Minister), I notice his risk score is currently Low, with 37 identified connections to other entities. Recent activities include meetings with IMF representatives and a foreign investment framework announcement. Would you like to see his network connections or run a scenario analysis?`;
    }
    else if (userQuery.toLowerCase().includes('compare') || userQuery.toLowerCase().includes('trend')) {
      aiResponse = `I've generated a comparison of investment trends between Kenya and Ethiopia. Over the past year, Kenya has seen an 18% increase in foreign investment while Ethiopia shows a 12% increase. Tech investment leads in Kenya, while manufacturing dominates in Ethiopia. Would you like a detailed chart of this data?`;
    }
    else {
      aiResponse = `I've analyzed your query about "${userQuery.substring(0, 30)}..." and found some relevant insights. The data suggests a pattern worth exploring further. Would you like me to generate a detailed report or visualize this data in the dashboard?`;
    }
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    const userMessage: Message = { sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    simulateResponse(inputText);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // Contextual suggestions based on current application state
  const suggestedPrompts = [
    "Summarize recent security events in East Africa.",
    "Show economic forecast for Nigeria.",
    "Identify key risks related to Ahmed Hassan.",
    "Compare investment trends in Kenya vs Ethiopia.",
    "What's the stability outlook for West Africa?",
    "How are oil prices affecting regional economies?"
  ];

  return (
    <div className="fixed bottom-20 right-6 w-96 h-[60vh] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
        <div className="flex items-center">
          <BrainCircuit className="h-5 w-5 mr-2" />
          <h3 className="font-semibold text-md">AI Assistant</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-white/20"
          aria-label="Close AI Assistant"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`p-2.5 rounded-lg max-w-[80%] ${
              msg.sender === 'ai' 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-blue-600 text-white'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-2.5 rounded-lg">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-1 px-2">Suggestions:</p>
        <div className="flex flex-wrap gap-1.5 px-1">
          {suggestedPrompts.slice(0,3).map((prompt, i) => (
            <button 
              key={i} 
              onClick={() => setInputText(prompt)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
          <textarea 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about data, trends, risks..."
            className="flex-1 p-2 bg-transparent focus:outline-none resize-none text-sm h-10 max-h-20"
            rows={1}
          />
          <button 
            onClick={handleSend} 
            className="p-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            disabled={!inputText.trim() || isTyping}
            aria-label="Send message"
          >
            <SendHorizonal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
