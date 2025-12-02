import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Flame, Snowflake } from 'lucide-react';

export const CarnotSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const progressRef = useRef(0);
  const requestRef = useRef<number | null>(null);
  
  // Gas Particles
  const particlesRef = useRef(Array.from({length: 30}, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: Math.random()-0.5,
      vy: Math.random()-0.5
  })));

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    
    ctx.clearRect(0,0,w,h);
    
    // Cycle Progress (0-4)
    // 0-1: Isothermal Exp (Hot Source)
    // 1-2: Adiabatic Exp (Insulated)
    // 2-3: Isothermal Comp (Cold Sink)
    // 3-4: Adiabatic Comp (Insulated)
    const p = progressRef.current % 4;
    
    // --- 1. Draw Cylinder (Right Side) ---
    const cx = w * 0.6;
    const cy = h/2 - 100;
    const cw = 200;
    const ch = 250;
    
    // Calculate Piston Position (Volume)
    // Sinusoidal approximation for smooth animation
    // Max expansion at p=2, Min at p=0 (roughly)
    // Let's map phases accurately to Carnot logic:
    // 0->1 (Exp): V increases
    // 1->2 (Exp): V increases more
    // 2->3 (Comp): V decreases
    // 3->4 (Comp): V decreases more
    
    let vol = 0.5; // 0 to 1
    if (p < 1) vol = 0.2 + 0.3 * p;         // 0.2 -> 0.5
    else if (p < 2) vol = 0.5 + 0.3 * (p-1);// 0.5 -> 0.8
    else if (p < 3) vol = 0.8 - 0.3 * (p-2);// 0.8 -> 0.5
    else vol = 0.5 - 0.3 * (p-3);           // 0.5 -> 0.2
    
    const pistonH = ch * vol;
    
    // Draw Chamber
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx, cy, cw, ch);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(cx, cy, cw, ch);
    
    // Temperature Color (Gas)
    // Hot during 0-1, Cooling 1-2, Cold 2-3, Warming 3-4
    let temp = 0; // 0 (Cold) to 1 (Hot)
    if (p < 1) temp = 1;
    else if (p < 2) temp = 1 - (p-1);
    else if (p < 3) temp = 0;
    else temp = (p-3);
    
    const r = Math.floor(59 + temp * (239-59)); // Blue 59 to Red 239
    const b = Math.floor(246 - temp * (246-68)); // Blue 246 to Red 68
    ctx.fillStyle = `rgba(${r}, 130, ${b}, 0.3)`;
    ctx.fillRect(cx + 4, cy + ch - pistonH, cw - 8, pistonH);

    // Draw Piston Head
    ctx.fillStyle = '#64748b';
    ctx.fillRect(cx + 4, cy + ch - pistonH - 20, cw - 8, 20);
    // Piston Rod
    ctx.fillStyle = '#475569';
    ctx.fillRect(cx + cw/2 - 10, cy + ch - pistonH - 120, 20, 100);

    // Draw Particles
    const particleSpeed = 0.5 + temp * 2;
    particlesRef.current.forEach(pt => {
        // Update
        pt.x += pt.vx * particleSpeed;
        pt.y += pt.vy * particleSpeed;
        
        // Bounce
        if (pt.x < 0 || pt.x > 1) pt.vx *= -1;
        if (pt.y < 0 || pt.y > 1) pt.vy *= -1;
        
        // Render mapped to cylinder volume
        const px = cx + 4 + (Math.abs(pt.x % 1)) * (cw - 8);
        const py = (cy + ch - pistonH) + (Math.abs(pt.y % 1)) * pistonH;
        
        ctx.fillStyle = `rgba(${r}, 255, ${b}, 0.8)`;
        ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI*2); ctx.fill();
    });

    // --- 2. Heat Source / Sink Indicators ---
    const sourceY = cy + ch + 20;
    
    if (p < 1) { // Isothermal Expansion (Heat In)
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(cx + cw/2, sourceY + 20, 30, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'white'; ctx.fillText("🔥 Heat In", cx + cw/2 - 25, sourceY + 25);
        
        // Arrows Up
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
        for(let i=-1; i<=1; i++) {
            const ax = cx + cw/2 + i*30;
            ctx.beginPath(); ctx.moveTo(ax, sourceY); ctx.lineTo(ax, sourceY - 30); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ax-5, sourceY-20); ctx.lineTo(ax, sourceY-30); ctx.lineTo(ax+5, sourceY-20); ctx.stroke();
        }
    } else if (p >= 2 && p < 3) { // Isothermal Comp (Heat Out)
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(cx + cw/2 - 30, sourceY, 60, 40);
        ctx.fillStyle = 'white'; ctx.fillText("❄️ Heat Out", cx + cw/2 - 30, sourceY + 25);
        
        // Arrows Down
         ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 3;
        for(let i=-1; i<=1; i++) {
            const ax = cx + cw/2 + i*30;
            ctx.beginPath(); ctx.moveTo(ax, sourceY - 40); ctx.lineTo(ax, sourceY); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ax-5, sourceY-10); ctx.lineTo(ax, sourceY); ctx.lineTo(ax+5, sourceY-10); ctx.stroke();
        }
    } else {
        // Adiabatic - Insulated
        ctx.fillStyle = '#475569';
        ctx.fillText("Insulated (No Heat Transfer)", cx + cw/2 - 60, sourceY + 25);
    }
    
    // --- 3. P-V Diagram (Left Side) ---
    const gx = 50; 
    const gy = h - 50;
    const gw = 250;
    const gh = 250;
    
    // Axes
    ctx.strokeStyle = 'white'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(gx, gy - gh); ctx.lineTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke();
    ctx.fillText("P", gx - 20, gy - gh + 10);
    ctx.fillText("V", gx + gw + 10, gy);
    
    // Calculate P-V Curve Points (Approx)
    // V1=0.2, V2=0.5, V3=0.8, V4=0.5 (Using vol logic above roughly)
    // P ~ 1/V (Isotherm) or 1/V^1.4 (Adiabatic)
    
    const getP = (v: number, t: number) => (t+0.5) / v; // Ideal gas law proxy
    
    // We draw the full cycle path static
    ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2;
    ctx.beginPath();
    // 4 points
    const pts = [
        {v: 0.2, p: getP(0.2, 1)}, // 1 (Start Exp)
        {v: 0.5, p: getP(0.5, 1)}, // 2 (End Iso Exp)
        {v: 0.8, p: getP(0.8, 0)}, // 3 (End Adia Exp)
        {v: 0.5, p: getP(0.5, 0)}  // 4 (End Iso Comp)
    ];
    
    // Scale to canvas
    const sX = (v:number) => gx + v * gw;
    const sY = (p:number) => gy - (p/8) * gh;
    
    ctx.moveTo(sX(pts[0].v), sY(pts[0].p));
    ctx.quadraticCurveTo(sX(0.35), sY(pts[0].p), sX(pts[1].v), sY(pts[1].p)); // Iso Exp
    ctx.lineTo(sX(pts[2].v), sY(pts[2].p)); // Adia Exp (approx linear visual)
    ctx.quadraticCurveTo(sX(0.65), sY(pts[2].p), sX(pts[3].v), sY(pts[3].p)); // Iso Comp
    ctx.lineTo(sX(pts[0].v), sY(pts[0].p)); // Adia Comp
    ctx.stroke();
    
    // Dot for current state
    // Vol is already calculated. Need P.
    const currentP = getP(vol, temp);
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(sX(vol), sY(currentP), 6, 0, Math.PI*2); ctx.fill();
    
    // Labels
    const labels = ["Isothermal Expansion", "Adiabatic Expansion", "Isothermal Compression", "Adiabatic Compression"];
    const idx = Math.floor(p);
    ctx.fillStyle = 'white';
    ctx.font = '16px font-bold sans-serif';
    ctx.fillText(labels[idx], gx, gy - gh - 20);

  };

  const animate = () => {
      if (isRunning) {
          progressRef.current = (progressRef.current + 0.01 * speed) % 4;
      }
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [isRunning, speed]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
         <canvas ref={canvasRef} width={800} height={400} className="w-full h-full object-contain" />
      </div>
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
           <div className="flex gap-4">
             <button 
                onClick={() => setIsRunning(!isRunning)} 
                className={`flex-1 py-3 px-6 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 ${isRunning ? 'bg-amber-600' : 'bg-emerald-600'}`}
             >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'PAUSE ENGINE' : 'START ENGINE'}
             </button>
           </div>
           
           <div className="space-y-2">
               <label className="text-xs text-slate-400 font-bold uppercase">Simulation Speed</label>
               <input type="range" min="0.5" max="3" step="0.5" value={speed} onChange={e => setSpeed(Number(e.target.value))} className="w-full accent-blue-500" />
           </div>
      </div>
     </div>
  );
};