
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const CollisionSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [m1, setM1] = useState(2);
  const [v1, setV1] = useState(8);
  const [m2, setM2] = useState(2);
  const [v2, setV2] = useState(-5);
  
  const [x1, setX1] = useState(100);
  const [x2, setX2] = useState(600);
  
  const [isRunning, setIsRunning] = useState(false);
  const [dragTarget, setDragTarget] = useState<1 | 2 | null>(null);

  const requestRef = useRef<number | null>(null);
  const sparksRef = useRef<{x:number, y:number, vx:number, vy:number, life:number, color: string}[]>([]);

  const reset = () => {
      setIsRunning(false);
      setX1(150);
      setX2(650);
      setV1(8);
      setV2(-5);
      sparksRef.current = [];
      draw();
  };

  const spawnSparks = (x: number, y: number) => {
      for(let i=0; i<20; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 2;
          sparksRef.current.push({
              x, y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1.0,
              color: Math.random() > 0.5 ? '#fff' : '#facc15'
          });
      }
  };

  const animate = () => {
      if (!isRunning) return;
      
      let nextX1 = x1 + v1;
      let nextX2 = x2 + v2;
      
      const r1 = 20 + m1 * 3;
      const r2 = 20 + m2 * 3;

      // Collision Detection
      if (nextX1 + r1 >= nextX2 - r2) {
          // Physics: 1D Elastic Collision
          const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
          const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
          
          setV1(v1f);
          setV2(v2f);
          
          // Separate slightly to prevent stickiness
          const overlap = (nextX1 + r1) - (nextX2 - r2);
          nextX1 -= overlap / 2;
          nextX2 += overlap / 2;
          
          spawnSparks((nextX1 + nextX2)/2, 200);
      }
      
      // Wall Bouncing
      if (nextX1 - r1 < 0) { 
          setV1(v => -v); 
          nextX1 = r1; 
          spawnSparks(0, 200);
      }
      if (nextX2 + r2 > 800) { 
          setV2(v => -v); 
          nextX2 = 800 - r2; 
          spawnSparks(800, 200);
      }

      setX1(nextX1);
      setX2(nextX2);
      
      // Update sparks
      sparksRef.current.forEach(s => { s.x+=s.vx; s.y+=s.vy; s.life-=0.05; });
      sparksRef.current = sparksRef.current.filter(s => s.life > 0);

      requestRef.current = requestAnimationFrame(animate);
  };
  
  // Effect to drive animation loop reference update
  useEffect(() => {
     if(isRunning) requestRef.current = requestAnimationFrame(animate);
     else draw();
     return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, x1, x2]); // Dependencies trigger re-render but requestAnimationFrame handles smooth loop

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const w = canvas.width;
      const h = canvas.height;
      const cy = h/2;
      
      // Clear with dark bg
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0,0,w,h);
      
      // Grid Floor
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for(let x=0; x<w; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      
      // Rail
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, cy - 5, w, 10);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(0, cy - 5, w, 10);
      
      // Sparks
      ctx.globalCompositeOperation = 'lighter';
      sparksRef.current.forEach(s => {
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.life;
          ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      const drawBall = (x: number, m: number, v: number, color: string, glow: string) => {
          const r = 20 + m * 3;
          
          // Glow
          ctx.shadowColor = glow;
          ctx.shadowBlur = 20;
          
          // Gradient Body
          const grad = ctx.createRadialGradient(x-r/3, cy-r/3, r/4, x, cy, r);
          grad.addColorStop(0, '#fff');
          grad.addColorStop(0.5, color);
          grad.addColorStop(1, '#000');
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, cy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Velocity Vector
          if (Math.abs(v) > 0.1) {
              const len = v * 10;
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 3;
              ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x + len, cy); ctx.stroke();
              // Head
              ctx.fillStyle = '#fff';
              ctx.beginPath(); ctx.arc(x+len, cy, 3, 0, Math.PI*2); ctx.fill();
          }
          
          // Label
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${m}kg`, x, cy + 4);
      };
      
      drawBall(x1, m1, v1, '#3b82f6', '#60a5fa');
      drawBall(x2, m2, v2, '#ef4444', '#f87171');
  };
  
  useEffect(() => {draw()}, [x1, x2, sparksRef.current.length]); // Re-draw on state change for clean stops

  // Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      if(isRunning) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const r1 = 20 + m1 * 3;
      const r2 = 20 + m2 * 3;
      if(Math.abs(x - x1) < r1) setDragTarget(1);
      else if(Math.abs(x - x2) < r2) setDragTarget(2);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
      if(!dragTarget) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if(dragTarget===1) setX1(Math.min(x, x2 - 60));
      if(dragTarget===2) setX2(Math.max(x, x1 + 60));
  };

  return (
     <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
         <canvas 
            ref={canvasRef} 
            width={800} 
            height={400} 
            className={`w-full h-full object-contain ${!isRunning ? 'cursor-ew-resize' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragTarget(null)}
         />
         
         <div className="absolute top-4 left-4 p-3 bg-slate-900/80 backdrop-blur rounded border border-slate-600 text-xs text-slate-300">
             <div className="flex justify-between w-48 mb-1">
                 <span>Momentum (P):</span>
                 <span className="font-mono text-white">{((m1*v1) + (m2*v2)).toFixed(1)} kg·m/s</span>
             </div>
             <div className="flex justify-between w-48">
                 <span>Kinetic Energy (K):</span>
                 <span className="font-mono text-white">{(0.5*m1*v1*v1 + 0.5*m2*v2*v2).toFixed(1)} J</span>
             </div>
         </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 grid grid-cols-1 md:grid-cols-5 gap-6 items-end shadow-xl">
          <div className="space-y-1">
              <div className="text-blue-400 font-bold text-xs uppercase">Mass 1 (Blue)</div>
              <input type="range" min="1" max="10" value={m1} onChange={e => {reset(); setM1(Number(e.target.value))}} className="w-full accent-blue-500" />
              <div className="text-right text-xs text-white">{m1} kg</div>
          </div>
           <div className="space-y-1">
              <div className="text-blue-400 font-bold text-xs uppercase">Velocity 1</div>
              <input type="range" min="-15" max="15" value={v1} onChange={e => {reset(); setV1(Number(e.target.value))}} className="w-full accent-blue-500" />
              <div className="text-right text-xs text-white">{v1} m/s</div>
          </div>
          
           <div className="space-y-1">
              <div className="text-red-400 font-bold text-xs uppercase">Mass 2 (Red)</div>
              <input type="range" min="1" max="10" value={m2} onChange={e => {reset(); setM2(Number(e.target.value))}} className="w-full accent-red-500" />
               <div className="text-right text-xs text-white">{m2} kg</div>
          </div>
           <div className="space-y-1">
              <div className="text-red-400 font-bold text-xs uppercase">Velocity 2</div>
              <input type="range" min="-15" max="15" value={v2} onChange={e => {reset(); setV2(Number(e.target.value))}} className="w-full accent-red-500" />
               <div className="text-right text-xs text-white">{v2} m/s</div>
          </div>

          <div className="flex gap-2">
             <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 py-3 px-4 rounded font-bold text-white shadow transition-transform active:scale-95 ${isRunning ? 'bg-amber-600' : 'bg-emerald-600'}`}>
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
             </button>
             <button onClick={reset} className="p-3 bg-slate-700 text-white rounded hover:bg-slate-600"><RotateCcw size={18} /></button>
          </div>
      </div>
     </div>
  );
};
