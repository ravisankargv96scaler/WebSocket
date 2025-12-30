import React, { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatWindowProps {
  user: 'A' | 'B';
  input: string;
  setInput: (val: string) => void;
  messages: ChatMessage[];
  onSend: (user: 'A' | 'B', text: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, input, setInput, messages, onSend, scrollRef }) => (
  <div className="flex flex-col h-80 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
    {/* Header */}
    <div className={`p-3 border-b border-slate-700 flex items-center gap-2 ${user === 'A' ? 'bg-indigo-900/30' : 'bg-emerald-900/30'}`}>
      <div className={`p-1.5 rounded-full ${user === 'A' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
        <User size={14} className="text-white" />
      </div>
      <span className="font-semibold text-sm">User {user}</span>
    </div>
    
    {/* Messages */}
    <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
      {messages.map((msg) => {
        const isMe = msg.sender === user;
        return (
          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
              isMe 
                ? (user === 'A' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white') 
                : 'bg-slate-700 text-slate-200'
            }`}>
              {msg.text}
            </div>
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>

    {/* Input */}
    <div className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend(user, input)}
        placeholder="Type a message..."
        className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-slate-400"
      />
      <button 
        onClick={() => onSend(user, input)}
        className={`p-2 rounded hover:bg-opacity-80 transition ${user === 'A' ? 'bg-indigo-500' : 'bg-emerald-500'}`}
      >
        <Send size={16} className="text-white" />
      </button>
    </div>
  </div>
);

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  
  // Ref for auto-scrolling
  const chatEndRefA = useRef<HTMLDivElement>(null);
  const chatEndRefB = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = (sender: 'A' | 'B', text: string) => {
    if (!text.trim()) return;
    
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, newMsg]);
    if (sender === 'A') setInputA('');
    else setInputB('');
  };

  useEffect(() => {
    chatEndRefA.current?.scrollIntoView({ behavior: 'smooth' });
    chatEndRefB.current?.scrollIntoView({ behavior: 'smooth' });
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Chat Simulation Side */}
      <div className="space-y-4">
         <h2 className="text-xl font-bold text-neon-blue flex items-center gap-2">
           <Send size={20} /> Split-Screen Demo
         </h2>
         <div className="grid grid-cols-2 gap-4">
           <ChatWindow 
             user="A" 
             input={inputA} 
             setInput={setInputA} 
             messages={messages} 
             onSend={sendMessage} 
             scrollRef={chatEndRefA} 
           />
           <ChatWindow 
             user="B" 
             input={inputB} 
             setInput={setInputB} 
             messages={messages} 
             onSend={sendMessage} 
             scrollRef={chatEndRefB} 
           />
         </div>
         <p className="text-xs text-slate-400 text-center">
           Notice how messages appear instantly on both screens without refreshing.
         </p>
      </div>

      {/* Under the Hood Side */}
      <div className="bg-black rounded-xl border border-slate-800 p-4 flex flex-col h-[28rem] lg:h-auto font-mono text-sm">
        <div className="text-slate-500 border-b border-slate-800 pb-2 mb-2 flex justify-between">
          <span>Network Log (WebSocket Frames)</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" /> Live</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar text-xs">
          {messages.length === 0 && <div className="text-slate-600 italic mt-4 text-center">// No frames captured yet...</div>}
          {messages.map((msg) => (
            <div key={msg.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-slate-500">[{msg.timestamp}]</span>{' '}
              <span className={msg.sender === 'A' ? 'text-indigo-400' : 'text-emerald-400'}>
                {msg.sender === 'A' ? 'Client A -> Server -> Client B' : 'Client B -> Server -> Client A'}
              </span>
              <div className="pl-4 text-slate-300 mt-0.5">
                {`{ "event": "message", "sender": "${msg.sender}", "data": "${msg.text}" }`}
              </div>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};