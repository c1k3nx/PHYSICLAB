
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const CollisionSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [m1, setM1] = useState(2);
  const [v1, setV1] = useState(8);
  const [m2, setM2] = useState(2);
  const [v2, setV2] = useState(-5);
  const [x1, setX1] = useState(100);
  const [x2, setX2] = useState(600);
  const [isRunning, setIsRunning] = useState(false);
  const [dragTarget, setDragTarget] = useState<1 | 2 | null>(null);
  const [showControls, setShowControls] = useState(true);

  const requestRef = useRef<number | null>(null);
  const sparksRef = useRef<{x:number, y:number, vx:number, vy:number, life:number, color: string}[]>([]);

  const reset = () => {
      setIsRunning(false);
      setX1(150); setX2(650); setV1(8); setV2(-5); sparksRef.current = [];
      draw();
  };

  const spawnSparks = (x: number, y: number) => {
      for(let i=0; i<20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 2;
          sparksRef.current.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1.0, color: Math.random() > 0.5 ? '#fff' : '#facc15' });
      }
  };

  const animate = () => {
      if (!isRunning) return;
      let nextX1 = x1 + v1; let nextX2 = x2 + v2;
      const r1 = 20 + m1 * 3; const r2 = 20 + m2 * 3;
      if (nextX1 + r1 >= nextX2 - r2) {
          const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
          const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
          setV1(v1f); setV2(v2f);
          const overlap = (nextX1 + r1) - (nextX2 - r2);
          nextX1 -= overlap / 2; nextX2 += overlap / 2;
          spawnSparks((nextX1 + nextX2)/2, 300);
      }
      if (nextX1 - r1 < 0) { setV1(v => -v); nextX1 = r1; spawnSparks(0, 300); }
      if (nextX2 + r2 > 1000) { setV2(v => -v); nextX2 = 1000 - r2; spawnSparks(1000, 300); }
      setX1(nextX1); setX2(nextX2);
      sparksRef.current.forEach(s => { s.x+=s.vx; s.y+=s.vy; s.life-=0.05; });
      sparksRef.current = sparksRef.current.filter(s => s.life > 0);
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
     if(isRunning) requestRef.current = requestAnimationFrame(animate);
     else draw();
     return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, x1, x2]);

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width; const h = canvas.height; const cy = h/2;
      ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,w,h);
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
      for(let x=0; x<w; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      ctx.fillStyle = '#1e293b'; ctx.fillRect(0, cy - 5, w, 10); ctx.strokeStyle = '#334155'; ctx.strokeRect(0, cy - 5, w, 10);
      
      ctx.globalCompositeOperation = 'lighter';
      sparksRef.current.forEach(s => {
          ctx.fillStyle = s.color; ctx.globalAlpha = s.life;
          ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';

      const drawBall = (x: number, m: number, v: number, color: string, glow: string) => {
          const r = 20 + m * 3;
          ctx.shadowColor = glow; ctx.shadowBlur = 20;
          const grad = ctx.createRadialGradient(x-r/3, cy-r/3, r/4, x, cy, r);
          grad.addColorStop(0, '#fff'); grad.addColorStop(0.5, color); grad.addColorStop(1, '#000');
          ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
          if (Math.abs(v) > 0.1) {
              const len = v * 10;
              ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
              ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x + len, cy); ctx.stroke();
              ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x+len, cy, 3, 0, Math.PI*2); ctx.fill();
          }
          ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(`${m}kg`, x, cy + 4);
      };
      drawBall(x1, m1, v1, '#3b82f6', '#60a5fa');
      drawBall(x2, m2, v2, '#ef4444', '#f87171');
  };
  
  useEffect(() => {draw()}, [x1, x2, sparksRef.current.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
      if(isRunning) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const scaleX = 1000 / rect.width;
      const x = (e.clientX - rect.left) * scaleX;
      const r1 = 20 + m1 * 3; const r2 = 20 + m2 * 3;
      if(Math.abs(x - x1) < r1) setDragTarget(1);
      else if(Math.abs(x - x2) < r2) setDragTarget(2);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
      if(!dragTarget) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const scaleX = 1000 / rect.width;
      const x = (e.clientX - rect.left) * scaleX;
      if(dragTarget===1) setX1(Math.min(x, x2 - 60));
      if(dragTarget===2) setX2(Math.max(x, x1 + 60));
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas 
            ref={canvasRef} 
            width={1000} 
            height={600} 
            className={`absolute inset-0 w-full h-full object-contain ${!isRunning ? 'cursor-ew-resize' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragTarget(null)}
        />
        
        {/* HUD */}
        <div className="absolute top-4 right-4 p-4 bg-slate-900/80 backdrop-blur rounded-xl border border-slate-600 text-xs text-slate-300 w-64 shadow-xl pointer-events-none">
             <div className="flex justify-between mb-2 pb-2 border-b border-slate-700">
                 <span className="uppercase font-bold text-slate-500">{t('momentum')} (P)</span>
                 <span className="font-mono text-white text-sm">{((m1*v1) + (m2*v2)).toFixed(1)} kg·m/s</span>
             </div>
             <div className="flex justify-between">
                 <span className="uppercase font-bold text-slate-500">{t('kinetic')}</span>
                 <span className="font-mono text-emerald-400 text-sm">{(0.5*m1*v1*v1 + 0.5*m2*v2*v2).toFixed(1)} J</span>
             </div>
        </div>

        {/* CONTROLS */}
        <div className={`absolute top-4 left-4 transition-all duration-300 z-10 ${showControls ? 'w-80' : 'w-12'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <button onClick={() => setShowControls(!showControls)} className="w-full p-3 flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                    {showControls ? <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Settings2 size={14} className="text-blue-400"/> {t('control_center')}</span> : <Settings2 size={20} className="mx-auto text-blue-400"/>}
                    {showControls && (showControls ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </button>

                {showControls && (
                    <div className="p-5 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{t('obj_1_blue')}</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('mass')}</span><span>{m1} kg</span></div>
                                <input type="range" min="1" max="10" value={m1} onChange={e => {reset(); setM1(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('velocity')}</span><span>{v1} m/s</span></div>
                                <input type="range" min="-15" max="15" value={v1} onChange={e => {reset(); setV1(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{t('obj_2_red')}</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('mass')}</span><span>{m2} kg</span></div>
                                <input type="range" min="1" max="10" value={m2} onChange={e => {reset(); setM2(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('velocity')}</span><span>{v2} m/s</span></div>
                                <input type="range" min="-15" max="15" value={v2} onChange={e => {reset(); setV2(Number(e.target.value))}} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"/>
                            </div>
                        </div>
                        <div className="w-full h-px bg-slate-700/50"></div>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => setIsRunning(!isRunning)} className={`col-span-3 py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isRunning ? 'bg-amber-600' : 'bg-emerald-600'}`}>
                                {isRunning ? <Pause size={18}/> : <Play size={18}/>} {isRunning ? t('pause').toUpperCase() : t('simulate').toUpperCase()}
                            </button>
                            <button onClick={reset} className="col-span-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700">
                                <RotateCcw size={18}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
