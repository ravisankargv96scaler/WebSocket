import React, { useState } from 'react';
import { Network, ArrowRightLeft, MessageSquare, Gauge, Code2, CheckSquare } from 'lucide-react';
import { TabNavigation } from './components/TabNavigation';
import { ConceptView } from './components/views/ConceptView';
import { HandshakeView } from './components/views/HandshakeView';
import { ChatView } from './components/views/ChatView';
import { PollingView } from './components/views/PollingView';
import { CodeView } from './components/views/CodeView';
import { QuizView } from './components/views/QuizView';
import { TabConfig } from './types';

const TABS: TabConfig[] = [
  { id: 'concept', label: 'The Concept', icon: ArrowRightLeft },
  { id: 'handshake', label: 'The Handshake', icon: Network },
  { id: 'chat', label: 'Real-Time Chat', icon: MessageSquare },
  { id: 'polling', label: 'Polling vs WS', icon: Gauge },
  { id: 'code', label: 'Implementation', icon: Code2 },
  { id: 'quiz', label: 'Quiz', icon: CheckSquare },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('concept');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-6 shadow-md z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,204,255,0.3)]">
              <Network className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                WebSocket Academy
              </h1>
              <p className="text-xs text-slate-500 font-mono tracking-wider">INTERACTIVE LEARNING MODULE v1.0</p>
            </div>
          </div>
          <a 
            href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" 
            target="_blank" 
            rel="noreferrer"
            className="hidden md:block text-sm text-slate-400 hover:text-neon-blue transition-colors"
          >
            MDN Documentation &rarr;
          </a>
        </div>
      </header>

      {/* Navigation */}
      <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <TabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'concept' && <ConceptView />}
          {activeTab === 'handshake' && <HandshakeView />}
          {activeTab === 'chat' && <ChatView />}
          {activeTab === 'polling' && <PollingView />}
          {activeTab === 'code' && <CodeView />}
          {activeTab === 'quiz' && <QuizView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        <p>Built for developers learning real-time protocols.</p>
      </footer>
    </div>
  );
}