
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Grab, Timer } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const PendulumSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [length, setLength] = useState(200); // cm
  const [gravity, setGravity] = useState(9.8);
  const [damping, setDamping] = useState(0.005);
  const [isRunning, setIsRunning] = useState(true);
  const [slowMo, setSlowMo] = useState(false);
  
  // Physics State
  const state = useRef({
      angle: Math.PI / 4, 
      velocity: 0,
      accel: 0
  });
  
  // Dragging State
  const dragRef = useRef({
      active: false,
      mx: 0,
      my: 0
  });

  const requestRef = useRef<number | null>(null);

  const reset = () => {
      state.current = { angle: Math.PI / 4, velocity: 0, accel: 0 };
      draw();
  };

  const updatePhysics = (dt: number) => {
      const L_meters = length / 100;
      const g = gravity;
      const theta = state.current.angle;
      
      const angularAccel = -(g / L_meters) * Math.sin(theta) - (damping * state.current.velocity);
      
      state.current.accel = angularAccel;
      state.current.velocity += angularAccel * dt;
      state.current.angle += state.current.velocity * dt;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const originX = w / 2;
    const originY = 50;

    const availableHeight = h - originY - 100;
    const currentLengthMeters = length / 100;
    
    const dynamicScale = Math.min(350, availableHeight / currentLengthMeters);
    const pixelLen = currentLengthMeters * dynamicScale;

    // Clear
    const grad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, 500);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Ceiling
    ctx.shadowColor = 'black'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#334155';
    ctx.fillRect(originX - 60, originY - 10, 120, 10);
    ctx.shadowBlur = 0;

    // Calculate Bob Position
    const bobX = originX + pixelLen * Math.sin(state.current.angle);
    const bobY = originY + pixelLen * Math.cos(state.current.angle);

    // Draw String
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.moveTo(originX, originY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Draw Protractor
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.setLineDash([5, 5]);
    ctx.arc(originX, originY, pixelLen, Math.PI/2 - 1, Math.PI/2 + 1);
    ctx.stroke();
    ctx.setLineDash([]);
    // Vertical line
    ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(originX, originY + pixelLen + 30); ctx.stroke();

    // Draw Bob
    const bobR = 25;
    const bobGrad = ctx.createRadialGradient(bobX - 8, bobY - 8, 2, bobX, bobY, bobR);
    bobGrad.addColorStop(0, '#fff');
    bobGrad.addColorStop(0.3, dragRef.current.active ? '#fbbf24' : '#ef4444');
    bobGrad.addColorStop(1, dragRef.current.active ? '#b45309' : '#7f1d1d');
    
    ctx.fillStyle = bobGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw Stats on Canvas (Localized)
    ctx.font = '14px monospace';
    ctx.fillStyle = '#94a3b8';
    
    const T = 2 * Math.PI * Math.sqrt(currentLengthMeters / gravity);
    ctx.fillText(`${t('period')} (T): ${T.toFixed(2)}s`, 20, h - 60);
    ctx.fillText(`${t('frequency')} (f):   ${(1/T).toFixed(2)}Hz`, 20, h - 40);
    
    const deg = (state.current.angle * 180 / Math.PI).toFixed(1);
    ctx.fillStyle = '#fff';
    ctx.fillText(`${t('angle')}: ${deg}°`, 20, h - 20);
  };

  const getDynamicScale = () => {
      const cvs = canvasRef.current;
      if (!cvs) return 300;
      const originY = 50;
      const availableHeight = cvs.height - originY - 100;
      return Math.min(350, availableHeight / (length/100));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const scale = getDynamicScale();
      const pixelLen = (length/100) * scale;
      const originX = canvas.width/2;
      const originY = 50;
      const bobX = originX + pixelLen * Math.sin(state.current.angle);
      const bobY = originY + pixelLen * Math.cos(state.current.angle);
      
      if (Math.hypot(x - bobX, y - bobY) < 40) {
          dragRef.current.active = true;
          setIsRunning(false);
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!dragRef.current.active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const originX = canvas.width / 2;
      const originY = 50;
      
      const dx = x - originX;
      const dy = y - originY;
      state.current.angle = Math.atan2(dx, dy);
      state.current.velocity = 0;
      state.current.accel = 0;
      draw();
  };

  const handleMouseUp = () => {
      if (dragRef.current.active) {
          dragRef.current.active = false;
          setIsRunning(true);
      }
  };

  const animate = () => {
      if (isRunning && !dragRef.current.active) {
          const dt = slowMo ? 0.016 / 5 : 0.016; 
          const steps = 4;
          for(let i=0; i<steps; i++) {
              updatePhysics(dt / steps);
          }
      }
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [length, gravity, damping, isRunning, slowMo, t]);

  return (
     <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl select-none">
         <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className={`w-full h-full object-contain ${dragRef.current.active ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
         />
         {!dragRef.current.active && !isRunning && (
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white/50 animate-pulse flex flex-col items-center">
                 <Grab size={48} />
                 <span className="text-xl font-bold">{t('drag_to_start')}</span>
             </div>
         )}
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
           <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase">{t('length')} (L)</label>
            <input type="range" min="10" max="150" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-blue-500" />
            <div className="text-right text-blue-400 font-mono">{(length/100).toFixed(2)} m</div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase">{t('gravity')} (g)</label>
            <input type="range" min="1.6" max="25" step="0.1" value={gravity} onChange={e => setGravity(Number(e.target.value))} className="w-full accent-green-500" />
            <div className="text-right text-green-400 font-mono">{gravity} m/s²</div>
          </div>
          
           <div className="space-y-2">
             <label className="text-xs text-slate-400 font-bold uppercase">Speed</label>
             <button 
                onClick={() => setSlowMo(!slowMo)}
                className={`w-full py-2 rounded-lg border flex items-center justify-center gap-2 text-sm font-bold transition-colors ${slowMo ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-700 text-slate-300 border-slate-600'}`}
             >
                 <Timer size={16} /> {slowMo ? t('slow_motion') : t('real_time')}
             </button>
          </div>
          
           <div className="flex gap-2">
             <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-transform active:scale-95 ${isRunning ? 'bg-amber-600' : 'bg-emerald-600'}`}>
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
             </button>
             <button onClick={reset} className="p-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"><RotateCcw size={20} /></button>
          </div>
      </div>
     </div>
  );
};
