
import React, { useState, useEffect, useRef } from 'react';
import { MousePointer2, Zap } from 'lucide-react';

export const ElecSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [q1, setQ1] = useState(5); 
  const [q2, setQ2] = useState(-5);
  const [distance, setDistance] = useState(250); 
  const [dragging, setDragging] = useState<'q1'|'q2'|null>(null);

  const getMousePos = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return {x:0, y:0};
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
      };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;
    const cx = w / 2;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const p1 = { x: cx - distance/2, y: cy, q: q1 };
    const p2 = { x: cx + distance/2, y: cy, q: q2 };

    // --- 1. Draw Field Lines (Optimized) ---
    ctx.lineWidth = 1;
    const spacing = 40;
    
    for(let x=0; x<w; x+=spacing) {
        for(let y=0; y<h; y+=spacing) {
            let Ex = 0, Ey = 0;
            // Q1
            let dx = x - p1.x; let dy = y - p1.y;
            let r2 = dx*dx + dy*dy;
            let E = (p1.q * 500) / (r2 + 100); 
            let r = Math.sqrt(r2);
            Ex += E * (dx/r);
            Ey += E * (dy/r);
            
            // Q2
            dx = x - p2.x; dy = y - p2.y;
            r2 = dx*dx + dy*dy;
            E = (p2.q * 500) / (r2 + 100);
            r = Math.sqrt(r2);
            Ex += E * (dx/r);
            Ey += E * (dy/r);
            
            const Emag = Math.sqrt(Ex*Ex + Ey*Ey);
            if(Emag < 0.1) continue;
            
            const len = Math.min(20, Emag * 5);
            const nx = Ex/Emag; const ny = Ey/Emag;
            
            const alpha = Math.min(0.4, Emag/10);
            ctx.strokeStyle = `rgba(255,255,255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(x - nx*len/2, y - ny*len/2);
            ctx.lineTo(x + nx*len/2, y + ny*len/2);
            ctx.stroke();
            
            // Arrowhead for strong fields
            if (Emag > 0.5) {
                ctx.fillStyle = `rgba(255,255,255, ${alpha})`;
                ctx.beginPath();
                ctx.arc(x + nx*len/2, y + ny*len/2, 1.5, 0, Math.PI*2);
                ctx.fill();
            }
        }
    }

    // --- 2. Draw Forces (Glowing Arrows) ---
    const forceMag = Math.abs(q1 * q2) / (distance * distance) * 80000; 
    const attract = (q1 > 0 && q2 < 0) || (q1 < 0 && q2 > 0);
    const fColor = '#facc15';

    const drawForce = (x:number, y:number, dir: number) => {
        const len = Math.min(forceMag, 150);
        const endX = x + dir * len;
        
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = fColor;
        ctx.strokeStyle = fColor;
        ctx.fillStyle = fColor;
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
        
        ctx.beginPath();
        if (dir > 0) {
            ctx.moveTo(endX, y); ctx.lineTo(endX-10, y-5); ctx.lineTo(endX-10, y+5);
        } else {
            ctx.moveTo(endX, y); ctx.lineTo(endX+10, y-5); ctx.lineTo(endX+10, y+5);
        }
        ctx.fill();
        ctx.restore();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`F = ${(forceMag/50).toFixed(0)}N`, x + dir*(len/2) - 20, y - 15);
    };

    if (attract) {
        drawForce(p1.x + 25, p1.y, 1); 
        drawForce(p2.x - 25, p2.y, -1); 
    } else {
        drawForce(p1.x - 25, p1.y, -1); 
        drawForce(p2.x + 25, p2.y, 1); 
    }

    // --- 3. Draw Charges (Enhanced 3D Spheres) ---
    const drawCharge = (x: number, y: number, q: number, label: string) => {
        const r = 30;
        const baseColor = q > 0 ? {r:239, g:68, b:68} : {r:59, g:130, b:246};
        
        // Outer Glow
        const glow = ctx.createRadialGradient(x, y, r, x, y, r*2.5);
        glow.addColorStop(0, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0.6)`);
        glow.addColorStop(1, `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x, y, r*2.5, 0, Math.PI*2); ctx.fill();
        
        // Sphere Gradient (3D look)
        const grad = ctx.createRadialGradient(x - 10, y - 10, 2, x, y, r);
        if (q > 0) {
            grad.addColorStop(0, '#fee2e2');
            grad.addColorStop(0.3, '#ef4444');
            grad.addColorStop(1, '#991b1b');
        } else {
            grad.addColorStop(0, '#dbeafe');
            grad.addColorStop(0.3, '#3b82f6');
            grad.addColorStop(1, '#1e40af');
        }
        
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        
        // Symbol
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(q > 0 ? '+' : '-', x, y + 2);
        ctx.shadowBlur = 0;
        
        // Label
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`${label}: ${q}µC`, x, y + 55);
    };

    drawCharge(p1.x, p1.y, p1.q, "Q1");
    drawCharge(p2.x, p2.y, p2.q, "Q2");

    // Distance Line
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y + 85);
    ctx.lineTo(p2.x, p2.y + 85);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`r = ${distance}px`, cx, cy + 105);
  };

  useEffect(() => { draw(); }, [q1, q2, distance]);

  const handleMouseDown = (e: React.MouseEvent) => {
      const {x} = getMousePos(e);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cx = canvas.width/2;
      
      if (Math.abs(x - (cx - distance/2)) < 40) setDragging('q1');
      else if (Math.abs(x - (cx + distance/2)) < 40) setDragging('q2');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!dragging) return;
      const {x} = getMousePos(e);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cx = canvas.width/2;
      
      let newDist = distance;
      if (dragging === 'q1') {
          const d = (cx - x) * 2;
          newDist = Math.max(50, Math.min(600, d));
      } else {
          const d = (x - cx) * 2;
          newDist = Math.max(50, Math.min(600, d));
      }
      setDistance(newDist);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
         <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className="w-full h-full object-contain cursor-ew-resize"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragging(null)}
            onMouseLeave={() => setDragging(null)}
         />
         <div className="absolute top-4 left-4 pointer-events-none">
             <div className="bg-slate-900/80 backdrop-blur p-3 rounded-lg border border-slate-600 text-xs text-slate-300">
                <div className="flex items-center gap-2 mb-1 text-yellow-400 font-bold"><Zap size={14}/> Electrostatic Force</div>
                Drag the charges to change distance.
             </div>
         </div>
      </div>

      <div className="bg-slate-900/90 backdrop-blur p-6 rounded-xl border border-slate-700 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                <span>Charge Q1 (Left)</span>
                <span className={`px-2 py-0.5 rounded ${q1 > 0 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{q1} µC</span>
            </div>
            <input 
              type="range" min="-10" max="10" value={q1} 
              onChange={(e) => setQ1(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                <span>Charge Q2 (Right)</span>
                <span className={`px-2 py-0.5 rounded ${q2 > 0 ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{q2} µC</span>
            </div>
            <input 
              type="range" min="-10" max="10" value={q2} 
              onChange={(e) => setQ2(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
      </div>
    </div>
  );
};
