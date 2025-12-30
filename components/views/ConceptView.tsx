import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap, Server, Monitor } from 'lucide-react';

export const ConceptView: React.FC = () => {
  const [mode, setMode] = useState<'http' | 'ws'>('http');
  const [httpStatus, setHttpStatus] = useState<'idle' | 'request' | 'response'>('idle');
  const [wsActive, setWsActive] = useState(false);
  // Visual traffic for WS
  const [wsTraffic, setWsTraffic] = useState<{ id: number; direction: 'l2r' | 'r2l'; color: string }[]>([]);

  // HTTP Simulation Logic
  const handleHttpFetch = () => {
    if (httpStatus !== 'idle') return;
    setHttpStatus('request');
    setTimeout(() => {
      setHttpStatus('response');
      setTimeout(() => {
        setHttpStatus('idle');
      }, 1500);
    }, 1500);
  };

  // WS Simulation Logic
  const toggleWs = () => {
    if (wsActive) {
      setWsActive(false);
      setWsTraffic([]);
    } else {
      setWsActive(true);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (wsActive && mode === 'ws') {
      interval = setInterval(() => {
        const id = Date.now();
        const direction = Math.random() > 0.5 ? 'l2r' : 'r2l';
        const color = Math.random() > 0.5 ? 'bg-neon-blue' : 'bg-neon-pink';
        
        setWsTraffic(prev => [...prev, { id, direction, color }]);
        
        // Cleanup old cars
        setTimeout(() => {
          setWsTraffic(prev => prev.filter(car => car.id !== id));
        }, 2000);
      }, 400);
    } else {
      setWsTraffic([]);
    }
    return () => clearInterval(interval);
  }, [wsActive, mode]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          {mode === 'http' ? <RefreshCw className="text-amber-400" /> : <Zap className="text-neon-green" />}
          {mode === 'http' ? 'HTTP: The Walkie-Talkie' : 'WebSocket: The Telephone Call'}
        </h2>
        
        <p className="text-slate-300 mb-6 max-w-2xl">
          {mode === 'http' 
            ? "HTTP is request-response based. Imagine driving a car to the server, picking up a package, and driving back. You have to repeat this trip every time you want new data."
            : "WebSockets create a persistent, full-duplex connection. It's like building a permanent super-highway where traffic can flow in both directions simultaneously without stopping."}
        </p>

        {/* Controls */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setMode('http'); setWsActive(false); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${mode === 'http' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50' : 'bg-slate-700 text-slate-400'}`}
          >
            HTTP Mode
          </button>
          <button
            onClick={() => { setMode('ws'); setHttpStatus('idle'); }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${mode === 'ws' ? 'bg-neon-green/20 text-neon-green border border-neon-green/50' : 'bg-slate-700 text-slate-400'}`}
          >
            WebSocket Mode
          </button>
        </div>

        {/* Simulation Area */}
        <div className="relative h-64 bg-slate-900 rounded-xl overflow-hidden border border-slate-700 flex justify-between items-center px-12 md:px-24">
          
          {/* Client */}
          <div className="z-10 flex flex-col items-center">
            <Monitor size={48} className="text-slate-300" />
            <span className="mt-2 font-mono text-sm text-slate-400">Client</span>
          </div>

          {/* Road/Connection */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-20 flex items-center justify-center">
             
             {/* Road Surface */}
             <div className={`w-full h-4 bg-slate-700 transition-all duration-500 relative ${mode === 'ws' && wsActive ? 'shadow-[0_0_15px_rgba(0,255,157,0.3)] bg-slate-600' : ''}`}>
               
               {/* HTTP Car */}
               {mode === 'http' && (
                 <div 
                   className={`absolute top-1/2 -translate-y-1/2 w-8 h-4 bg-amber-400 rounded-sm shadow-lg transition-all duration-[1500ms] ease-in-out
                   ${httpStatus === 'idle' ? 'left-[10%] opacity-0' : ''}
                   ${httpStatus === 'request' ? 'left-[85%] opacity-100' : ''}
                   ${httpStatus === 'response' ? 'left-[10%] bg-blue-400 opacity-100' : ''}
                   `}
                 />
               )}

                {/* WS Cars */}
                {mode === 'ws' && wsTraffic.map(car => (
                  <div
                    key={car.id}
                    className={`absolute top-1/2 -translate-y-1/2 w-6 h-3 rounded-full shadow-sm ${car.color}`}
                    style={{
                      left: car.direction === 'l2r' ? '10%' : '90%',
                      transition: 'all 2s linear',
                      transform: `translateX(${car.direction === 'l2r' ? '80vw' : '-80vw'})`
                    }}
                  />
                ))}

             </div>
          </div>

          {/* Server */}
          <div className="z-10 flex flex-col items-center">
            <Server size={48} className="text-slate-300" />
            <span className="mt-2 font-mono text-sm text-slate-400">Server</span>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          {mode === 'http' ? (
            <button
              onClick={handleHttpFetch}
              disabled={httpStatus !== 'idle'}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {httpStatus === 'idle' ? 'Fetch Data' : 'Fetching...'}
            </button>
          ) : (
            <button
              onClick={toggleWs}
              className={`px-8 py-3 font-bold rounded-lg shadow-lg transition-all active:scale-95 border ${wsActive ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' : 'bg-neon-green/20 border-neon-green text-neon-green hover:bg-neon-green/30'}`}
            >
              {wsActive ? 'Disconnect' : 'Connect WebSocket'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};