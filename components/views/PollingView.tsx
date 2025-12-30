import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { LaneType } from '../../types';

export const PollingView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [serverLoad, setServerLoad] = useState(0);
  
  // State for logs/status for each lane
  const [laneLogs, setLaneLogs] = useState<{ [key in LaneType]: string[] }>({ short: [], long: [], ws: [] });
  const [laneDataCount, setLaneDataCount] = useState<{ [key in LaneType]: number }>({ short: 0, long: 0, ws: 0 });

  const intervalRefs = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});

  const startRace = () => {
    setIsRunning(true);
    setLaneLogs({ short: [], long: [], ws: [] });
    setLaneDataCount({ short: 0, long: 0, ws: 0 });
    setServerLoad(0);

    // Lane 1: Short Polling (Every 1s)
    intervalRefs.current.short = setInterval(() => {
      setServerLoad(prev => Math.min(prev + 5, 100)); // High load
      setLaneLogs(prev => ({ ...prev, short: [...prev.short.slice(-4), "Check? -> No"] }));
      
      // Occasionally get data
      if (Math.random() > 0.8) {
        setLaneLogs(prev => ({ ...prev, short: [...prev.short.slice(-4), "Check? -> DATA!"] }));
        setLaneDataCount(prev => ({ ...prev, short: prev.short + 1 }));
      }
      // Decay load slightly
      setTimeout(() => setServerLoad(prev => Math.max(prev - 2, 0)), 500);
    }, 1000);

    // Lane 2: Long Polling (Wait 2-4s)
    const runLongPoll = () => {
      setLaneLogs(prev => ({ ...prev, long: [...prev.long.slice(-4), "Request open..."] }));
      setServerLoad(prev => Math.min(prev + 2, 100)); // Medium load
      
      const waitTime = 2000 + Math.random() * 2000;
      intervalRefs.current.long = setTimeout(() => {
        setLaneLogs(prev => ({ ...prev, long: [...prev.long.slice(-4), "DATA RECEIVED"] }));
        setLaneDataCount(prev => ({ ...prev, long: prev.long + 1 }));
        setServerLoad(prev => Math.max(prev - 1, 0));
        if (isRunning) runLongPoll(); // Recurse
      }, waitTime);
    };
    runLongPoll();

    // Lane 3: WebSocket (Random Pushes)
    intervalRefs.current.ws = setInterval(() => {
      // Very low load impact
      setServerLoad(prev => Math.min(prev + 0.5, 100)); 
      
      if (Math.random() > 0.6) {
        setLaneLogs(prev => ({ ...prev, ws: [...prev.ws.slice(-4), "← Pushed Data"] }));
        setLaneDataCount(prev => ({ ...prev, ws: prev.ws + 1 }));
      }
      setTimeout(() => setServerLoad(prev => Math.max(prev - 0.5, 0)), 200);
    }, 800);
  };

  const stopRace = () => {
    setIsRunning(false);
    clearInterval(intervalRefs.current.short);
    clearTimeout(intervalRefs.current.long);
    clearInterval(intervalRefs.current.ws);
    // Cleanup recursive long poll manually if needed by checking isRunning ref, but react state helps here
  };

  // Effect to handle stopping logic cleanly if component unmounts
  useEffect(() => {
    return () => {
        clearInterval(intervalRefs.current.short);
        clearTimeout(intervalRefs.current.long);
        clearInterval(intervalRefs.current.ws);
    };
  }, []);
  
  // Stop long poll recursion if stopped
  useEffect(() => {
    if (!isRunning) {
        clearTimeout(intervalRefs.current.long);
    }
  }, [isRunning]);

  const Lane = ({ title, type, color, logs, count }: { title: string, type: LaneType, color: string, logs: string[], count: number }) => (
    <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col relative overflow-hidden">
      <div className={`text-center font-bold mb-2 pb-2 border-b border-slate-700 ${color}`}>{title}</div>
      <div className="flex-1 space-y-2 font-mono text-xs">
        {logs.map((log, i) => (
          <div key={i} className={`p-1 rounded opacity-80 ${log.includes("DATA") || log.includes("Pushed") ? 'bg-white/10 text-white font-bold' : 'text-slate-400'}`}>
            {log}
          </div>
        ))}
      </div>
      <div className="mt-4 pt-2 border-t border-slate-700 flex justify-between items-center">
        <span className="text-xs text-slate-500">Messages:</span>
        <span className={`text-xl font-bold ${color}`}>{count}</span>
      </div>
      {/* Activity Indicator */}
      {isRunning && (
        <div className={`absolute top-0 right-0 w-2 h-2 rounded-full m-2 ${color === 'text-red-400' ? 'animate-ping bg-red-500' : color === 'text-amber-400' ? 'animate-pulse bg-amber-500' : 'bg-neon-green shadow-[0_0_10px_#00ff9d]'}`}></div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Efficiency Race</h2>
            <p className="text-slate-300 text-sm mb-6">
              See how different methods handle checking for new data. Notice how Polling hammers the server, while WebSockets wait quietly.
            </p>
            <div className="flex gap-4">
              {!isRunning ? (
                <button onClick={startRace} className="flex items-center gap-2 px-6 py-2 bg-neon-blue text-slate-900 font-bold rounded hover:bg-blue-400 transition">
                  <Play size={18} /> Start Simulation
                </button>
              ) : (
                <button onClick={stopRace} className="flex items-center gap-2 px-6 py-2 bg-slate-700 text-white font-bold rounded hover:bg-slate-600 transition">
                  <RotateCcw size={18} /> Stop
                </button>
              )}
            </div>
          </div>
          
          {/* Server Load Meter */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-400 mb-2">Simulated Server Load / Overhead</h3>
            <div className="w-full bg-slate-900 h-6 rounded-full overflow-hidden relative border border-slate-700">
              <div 
                className={`h-full transition-all duration-300 ${serverLoad > 80 ? 'bg-red-500' : serverLoad > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${serverLoad}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0% (Idle)</span>
              <span>100% (Melting)</span>
            </div>
          </div>
        </div>

        {/* Lanes */}
        <div className="flex-1 flex flex-col md:flex-row gap-2 h-96">
          <Lane 
            title="Short Polling" 
            type="short" 
            color="text-red-400" 
            logs={laneLogs.short} 
            count={laneDataCount.short}
          />
          <Lane 
            title="Long Polling" 
            type="long" 
            color="text-amber-400" 
            logs={laneLogs.long} 
            count={laneDataCount.long}
          />
          <Lane 
            title="WebSockets" 
            type="ws" 
            color="text-neon-green" 
            logs={laneLogs.ws} 
            count={laneDataCount.ws}
          />
        </div>
      </div>
    </div>
  );
};