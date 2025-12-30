import React, { useState } from 'react';
import { SAMPLE_CODE } from '../../constants';
import { Terminal, Play } from 'lucide-react';

export const CodeView: React.FC = () => {
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [highlightLine, setHighlightLine] = useState<number | null>(null);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim();
      if (!cmd) return;
      
      setConsoleOutput(prev => [...prev, `> ${cmd}`]);
      
      // Simulate server logic
      setHighlightLine(11); // Highlight the 'message' event line
      setTimeout(() => {
        setConsoleOutput(prev => [...prev, `< Echo: ${cmd}`]);
        setHighlightLine(13); // Highlight the 'send' line
        
        setTimeout(() => {
          setHighlightLine(null);
        }, 1000);
      }, 300);

      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Code Editor */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-slate-400 ml-2">server.js</span>
        </div>
        <div className="p-4 font-mono text-sm overflow-auto flex-1 relative">
          {SAMPLE_CODE.split('\n').map((line, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlightLine === lineNum;
            return (
              <div 
                key={i} 
                className={`flex ${isHighlighted ? 'bg-slate-700/60 -mx-4 px-4' : ''} transition-colors duration-200`}
              >
                <span className="text-slate-600 select-none w-8 text-right mr-4">{lineNum}</span>
                <span className={`${
                  line.includes('//') ? 'text-slate-500' : 
                  line.includes('const') || line.includes('require') ? 'text-purple-400' :
                  line.includes('ws.on') ? 'text-blue-400' :
                  line.includes('ws.send') ? 'text-green-400' : 
                  'text-slate-300'
                }`}>{line}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Console */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Terminal size={20} className="text-neon-pink" />
            Try it out
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            This simulated Node.js environment is running the code on the left. 
            Send a message to see the event handlers fire in real-time.
          </p>
        </div>

        <div className="flex-1 bg-black rounded-xl border border-slate-800 p-4 font-mono text-sm flex flex-col shadow-inner">
          <div className="flex-1 overflow-y-auto space-y-2 mb-4 custom-scrollbar">
            <div className="text-slate-500 italic">Server started on port 8080...</div>
            {consoleOutput.map((log, i) => (
              <div key={i} className={log.startsWith('<') ? 'text-neon-green' : 'text-slate-300'}>
                {log}
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center border-t border-slate-800 pt-3">
            <span className="text-neon-blue">{'>'}</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleCommand}
              placeholder="Type hello..."
              className="flex-1 bg-transparent focus:outline-none text-white placeholder-slate-600"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
};