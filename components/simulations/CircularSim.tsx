import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export const CircularSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [radius, setRadius] = useState(150);
  const [speed, setSpeed] = useState(1); // rad/s
  const [mass, setMass] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  
  const angleRef = useRef(0);
  const trailRef = useRef<{x: number, y: number, alpha: number}[]>([]);
  const requestRef = useRef<number | null>(null);

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const w = canvas.width;
      const h = canvas.height;
      const cx = w/2;
      const cy = h/2;
      
      // Clear with dark void
      const grad = ctx.createRadialGradient(cx, cy, 100, cx, cy, 600);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);
      
      // 3D Perspective Scale (Flatten Y)
      const scaleY = 0.4;
      
      // Draw Orbit Path
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * scaleY, 0, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Grid Plane
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=-5; i<=5; i++) {
          ctx.moveTo(cx - 300, cy + i * 50 * scaleY);
          ctx.lineTo(cx + 300, cy + i * 50 * scaleY);
      }
      ctx.stroke();

      // Calculate Pos
      const angle = angleRef.current;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle) * scaleY; // Apply perspective
      
      // Draw Trail
      trailRef.current.push({x, y, alpha: 1.0});
      if (trailRef.current.length > 50) trailRef.current.shift();
      
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Draw Glowing Trail
      for(let i=0; i<trailRef.current.length-1; i++) {
          const p1 = trailRef.current[i];
          const p2 = trailRef.current[i+1];
          p1.alpha -= 0.02;
          
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(0, p1.alpha)})`;
          ctx.lineWidth = 4 * p1.alpha;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
      }

      // Center Post
      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2); ctx.fill();
      
      // Radius Line (String)
      ctx.beginPath();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Vectors (Need to unproject for correct direction logic visually)
      // Velocity (Tangent)
      const vMag = speed * 40;
      // In 3D perspective, tangent is tricky. 
      // dx/dt = -r sin(t), dy/dt = r cos(t) * scaleY
      const vx = -Math.sin(angle) * vMag;
      const vy = Math.cos(angle) * vMag * scaleY;
      
      const drawVector = (vx: number, vy: number, color: string, label: string) => {
          ctx.shadowBlur = 10; ctx.shadowColor = color;
          ctx.strokeStyle = color; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x+vx, y+vy); ctx.stroke();
          
          // Arrow
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(x+vx, y+vy, 4, 0, Math.PI*2); ctx.fill();
          
          // Label
          ctx.fillStyle = '#fff'; ctx.font='bold 14px sans-serif'; ctx.shadowBlur=0;
          ctx.fillText(label, x+vx+10, y+vy);
      };

      drawVector(vx, vy, '#ef4444', 'v');

      // Centripetal Force (Inward)
      const fMag = (mass * speed * speed * radius) / 3000 * 50; 
      const fx = (cx - x) / radius * fMag; // Normalized dir * mag
      const fy = (cy - y) / (radius * scaleY) * fMag * scaleY; // Normalized dir * mag
      
      drawVector(fx, fy, '#facc15', 'Fc');

      // Object Sphere (3D Shading)
      const rObj = 15;
      const ballGrad = ctx.createRadialGradient(x-5, y-5, 2, x, y, rObj);
      ballGrad.addColorStop(0, '#60a5fa');
      ballGrad.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = ballGrad;
      ctx.shadowBlur = 15; ctx.shadowColor = '#3b82f6';
      ctx.beginPath(); ctx.arc(x, y, rObj, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
  };
  
  const animate = () => {
      if (!isRunning) return;
      angleRef.current += speed * 0.02;
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
      if (isRunning) requestRef.current = requestAnimationFrame(animate);
      else draw();
      return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, radius, speed]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
         <canvas ref={canvasRef} width={900} height={500} className="w-full h-full object-cover" />
         
         <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
             <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur px-3 py-1 rounded-full border border-red-500/30">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                 <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Velocity Tangent</span>
             </div>
             <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur px-3 py-1 rounded-full border border-yellow-500/30">
                 <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                 <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Centripetal Force</span>
             </div>
         </div>
      </div>
      
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-lg">
           <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase">Orbit Radius (r)</label>
            <input type="range" min="50" max="250" value={radius} onChange={e => { trailRef.current=[]; setRadius(Number(e.target.value))}} className="w-full accent-blue-500" />
            <div className="text-right text-blue-400 font-mono">{radius}m</div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-bold uppercase">Angular Velocity (ω)</label>
            <input type="range" min="0.5" max="5" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-red-500" />
            <div className="text-right text-red-400 font-mono">{speed} rad/s</div>
          </div>
          <div className="space-y-2">
             <label className="text-xs text-slate-400 font-bold uppercase">Mass (m)</label>
             <input type="range" min="5" max="50" value={mass} onChange={e => setMass(Number(e.target.value))} className="w-full accent-yellow-500" />
             <div className="text-right text-yellow-400 font-mono">{mass} kg</div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setIsRunning(!isRunning)} className={`flex-1 py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all ${isRunning ? 'bg-amber-600' : 'bg-emerald-600'}`}>
                {isRunning ? <Pause size={18} className="mx-auto"/> : <Play size={18} className="mx-auto"/>}
             </button>
             <button onClick={() => {trailRef.current=[]; angleRef.current=0; draw();}} className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                 <RotateCcw size={18} />
             </button>
          </div>
      </div>
     </div>
  );
};