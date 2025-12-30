import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export const HandshakeView: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: Req, 2: Res, 3: Connected

  const startHandshake = () => {
    setStep(0);
    setTimeout(() => setStep(1), 500);
    setTimeout(() => setStep(2), 2500);
    setTimeout(() => setStep(3), 4500);
  };

  const reset = () => setStep(0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-neon-purple">The Handshake Inspector</h2>
        <p className="text-slate-300 mb-8">
          WebSockets start life as a standard HTTP request. The client asks for an "Upgrade", and if the server agrees, it responds with status code <span className="text-neon-green font-mono">101</span>.
        </p>

        <div className="relative h-96 bg-slate-900 rounded-lg border border-slate-700 p-8 flex justify-between">
          
          {/* Client Terminal */}
          <div className="w-1/3 flex flex-col gap-2 z-10">
            <div className="bg-slate-800 p-3 rounded-t-lg border-b border-slate-700 font-mono text-sm text-slate-400">Client Terminal</div>
            <div className="flex-1 bg-black/50 p-4 font-mono text-xs text-green-400 rounded-b-lg overflow-hidden border border-slate-700/50">
              <div className="mb-2">$ connect wss://api.app.com</div>
              {step >= 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <span className="text-blue-400">{'>'} GET /chat HTTP/1.1</span><br/>
                  <span className="text-blue-400">{'>'} Host: api.app.com</span><br/>
                  <span className="text-blue-400">{'>'} Connection: Upgrade</span><br/>
                  <span className="text-blue-400">{'>'} Upgrade: websocket</span><br/>
                  <span className="text-blue-400">{'>'} Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==</span>
                </div>
              )}
               {step >= 2 && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <span className="text-yellow-400">{'<'} HTTP/1.1 101 Switching Protocols</span><br/>
                   <span className="text-yellow-400">{'<'} Upgrade: websocket</span><br/>
                   <span className="text-yellow-400">{'<'} Connection: Upgrade</span>
                </div>
              )}
              {step >= 3 && (
                <div className="mt-4 text-neon-green font-bold animate-pulse">
                  [CONNECTED] Stream opened.
                </div>
              )}
            </div>
          </div>

          {/* Connection Visual */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            
            {/* The Pipe */}
            <div className={`absolute w-full h-4 bg-slate-700 transition-all duration-1000 ${step === 3 ? 'bg-neon-green shadow-[0_0_20px_rgba(0,255,157,0.4)] h-6' : ''}`}></div>

            {/* Request Packet */}
            {step === 1 && (
              <div className="absolute bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg animate-[slideRight_2s_ease-in-out_forwards]">
                GET / Upgrade
              </div>
            )}

            {/* Response Packet */}
            {step === 2 && (
              <div className="absolute bg-yellow-500 text-black text-xs px-2 py-1 rounded shadow-lg animate-[slideLeft_2s_ease-in-out_forwards]">
                101 Switching
              </div>
            )}

            {step === 3 && (
              <div className="absolute bg-neon-green text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg z-20 animate-bounce">
                ESTABLISHED
              </div>
            )}
          </div>

          {/* Server Terminal */}
          <div className="w-1/3 flex flex-col gap-2 z-10">
            <div className="bg-slate-800 p-3 rounded-t-lg border-b border-slate-700 font-mono text-sm text-slate-400">Server Terminal</div>
            <div className="flex-1 bg-black/50 p-4 font-mono text-xs text-slate-300 rounded-b-lg overflow-hidden border border-slate-700/50">
              <div className="mb-2 text-slate-500"># Listening on port 8080...</div>
              {step >= 1 && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-1000">
                  <span className="text-blue-400">[INFO] Incoming Handshake Request</span>
                </div>
              )}
              {step >= 2 && (
                <div className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <span className="text-yellow-400">[OK] Valid Key. Switching Protocols.</span>
                </div>
              )}
              {step >= 3 && (
                <div className="mt-4 text-neon-green font-bold">
                  [SUCCESS] Socket ID: 8f92a0
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="flex justify-center mt-8">
          {step === 0 || step === 3 ? (
            <button
              onClick={step === 3 ? reset : startHandshake}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold shadow-lg transition-all active:scale-95 ${step === 3 ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-neon-purple text-white hover:bg-purple-500'}`}
            >
              {step === 3 ? <><RefreshCw size={18} /> Reset Demo</> : <><ArrowRight size={18} /> Initiate Handshake</>}
            </button>
          ) : (
             <div className="flex items-center gap-2 text-slate-400 animate-pulse">
               <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
               Negotiating...
             </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideRight {
          0% { left: 10%; opacity: 0; transform: scale(0.8); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { left: 80%; opacity: 0; transform: scale(0.8); }
        }
        @keyframes slideLeft {
          0% { left: 80%; opacity: 0; transform: scale(0.8); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { left: 10%; opacity: 0; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};