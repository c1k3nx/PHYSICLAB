
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Rocket, Clock } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const RelativitySim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [velocity, setVelocity] = useState(0.0); // % of c
  const [isRunning, setIsRunning] = useState(true);
  
  const timeRef = useRef(0);
  const starsRef = useRef<{x:number, y:number, z:number, size:number}[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
      starsRef.current = Array.from({length: 200}, () => ({
          x: Math.random() * 1000,
          y: Math.random() * 600,
          z: Math.random() * 2 + 0.5,
          size: Math.random() * 1.5
      }));
  }, []);

  const reset = () => {
      setIsRunning(true);
      timeRef.current = 0;
  };

  const drawClockFace = (ctx: CanvasRenderingContext2D, x: number, y: number, timeVal: number, color: string, label: string) => {
      // Clock Body
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      
      // Ticks
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
      for(let i=0; i<12; i++) {
          const ang = (i * 30) * Math.PI/180;
          ctx.beginPath(); 
          ctx.moveTo(x + Math.cos(ang)*30, y + Math.sin(ang)*30);
          ctx.lineTo(x + Math.cos(ang)*35, y + Math.sin(ang)*35);
          ctx.stroke();
      }
      
      // Hand
      const handAng = (timeVal % 12) * (Math.PI/6) - Math.PI/2;
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(handAng)*30, y + Math.sin(handAng)*30); ctx.stroke();
      
      // Center
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
      
      // Label
      ctx.fillStyle = color; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(label, x, y + 60);
  };

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      
      // Space BG
      ctx.fillStyle = '#020617';
      ctx.fillRect(0,0,w,h);
      
      const splitY = h/2;
      
      // Draw Stars (Moving)
      ctx.fillStyle = '#fff';
      starsRef.current.forEach(star => {
         const speed = velocity * 40 * star.z;
         const x = (star.x - timeRef.current * speed * 2) % w; // Move stars based on time & velocity
         const drawX = x < 0 ? x + w : x;
         ctx.globalAlpha = 0.6 * star.z;
         ctx.beginPath(); ctx.arc(drawX, star.y, star.size, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Split Line
      ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, splitY); ctx.lineTo(w, splitY); ctx.stroke();
      
      const gamma = 1 / Math.sqrt(1 - velocity*velocity);
      
      // --- Top: Earth Frame ---
      ctx.fillStyle = '#60a5fa'; ctx.font = 'bold 14px monospace'; ctx.textAlign = 'left';
      ctx.fillText(t('earth_clock').toUpperCase() + " (v=0)", 20, 30);
      
      // Draw Earth Clock
      const earthTime = timeRef.current * 2; // Speed multiplier
      drawClockFace(ctx, w/2, splitY/2, earthTime, '#60a5fa', "Δt (Earth)");

      // --- Bottom: Ship Frame ---
      ctx.fillStyle = '#f87171';
      ctx.fillText(t('ship_clock').toUpperCase() + ` (v=${(velocity*100).toFixed(0)}% c)`, 20, splitY + 30);
      
      // Draw Ship Clock (Time Dilation)
      const shipTime = earthTime / gamma;
      drawClockFace(ctx, w/2, splitY + splitY/2, shipTime, '#f87171', "Δt₀ (Ship)");

      // Visualization of spaceship
      const cx = w/2 + 200;
      const cy = splitY + splitY/2;
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.moveTo(cx, cy-20); ctx.lineTo(cx+60, cy); ctx.lineTo(cx, cy+20); ctx.fill();
      // Engine
      if (isRunning && velocity > 0) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath(); ctx.moveTo(cx, cy-10); ctx.lineTo(cx-20-Math.random()*10, cy); ctx.lineTo(cx, cy+10); ctx.fill();
      }
  };

  const animate = () => {
      if (isRunning) timeRef.current += 0.02;
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, velocity, t]); // Add t to deps to re-render texts

  const gamma = 1 / Math.sqrt(1 - velocity*velocity);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-black rounded-xl overflow-hidden border border-slate-700 shadow-2xl flex">
         <canvas ref={canvasRef} width={900} height={500} className="w-full h-full object-cover" />
         
         <div className="absolute top-4 right-4 flex flex-col gap-4">
            <div className="bg-slate-900/90 backdrop-blur p-4 rounded-xl border border-blue-500/30 w-64 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-2">
                    <Clock size={16} className="text-blue-400"/>
                    <span className="text-xs font-bold text-white uppercase">{t('time_dilation')}</span>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-400">{t('lorentz_factor')} (γ):</div>
                        <div className="text-xl font-mono text-yellow-400 font-bold">{gamma.toFixed(3)}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 italic text-center mt-2">
                        Δt = γ · Δt₀
                    </div>
                </div>
            </div>
         </div>
      </div>
      
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl">
           <div className="space-y-4">
               <div className="flex justify-between items-center">
                   <label className="text-sm font-bold uppercase text-red-400 flex items-center gap-2">
                       <Rocket size={16}/> {t('velocity')}
                   </label>
                   <span className="text-xl font-mono font-bold text-white">{(velocity * 100).toFixed(0)}% c</span>
               </div>
               <div className="relative h-6 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-red-600 transition-all duration-300" style={{width: `${velocity*100}%`}}></div>
                    <input type="range" min="0" max="0.99" step="0.01" value={velocity} onChange={e => { reset(); setVelocity(Number(e.target.value)); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               </div>
           </div>
           
           <div className="flex gap-4">
               <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 py-4 rounded-xl font-bold text-white text-sm shadow-lg flex items-center justify-center gap-3 transition-all ${isRunning ? 'bg-amber-600' : 'bg-blue-600'}`}>
                   {isRunning ? <Pause size={20}/> : <Play size={20}/>}
                   {isRunning ? t('pause').toUpperCase() : t('start').toUpperCase()}
               </button>
               <button onClick={reset} className="p-4 bg-slate-800 border border-slate-700 text-slate-400 rounded-xl hover:text-white transition-colors">
                   <RotateCcw size={20}/>
               </button>
           </div>
      </div>
    </div>
  );
};
