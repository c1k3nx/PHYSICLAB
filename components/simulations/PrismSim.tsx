import React, { useState, useEffect, useRef } from 'react';

export const PrismSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0); 

  // Physics Config
  const SIZE = 140;
  
  // Refractive Indices (Cauchy Approx)
  // Higher index = more bending (Violet)
  // Lower index = less bending (Red)
  const colors = [
      { nm: 650, color: '#ff3b30', n: 1.51 }, // Red
      { nm: 590, color: '#ff9500', n: 1.515 }, // Orange
      { nm: 570, color: '#ffcc00', n: 1.518 }, // Yellow
      { nm: 510, color: '#4cd964', n: 1.522 }, // Green
      { nm: 475, color: '#007aff', n: 1.528 }, // Blue
      { nm: 400, color: '#af52de', n: 1.535 }  // Violet
  ];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w/2 - 50; // Shift left to make room for screen
    const cy = h/2;

    // Dark Room Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0,0,w,h);

    // Light Beam Source (Flashlight)
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(255,255,255,0.5)';
    ctx.fillStyle = '#333';
    ctx.fillRect(0, cy - 10, 80, 20);
    ctx.shadowBlur = 0;

    // --- Prism Geometry ---
    const hTri = SIZE * Math.sqrt(3) / 2;
    // Vertices relative to center (0,0)
    const p1 = { x: -SIZE/2, y: hTri/3 };      
    const p2 = { x: SIZE/2, y: hTri/3 };       
    const p3 = { x: 0, y: -2*hTri/3 };         
    
    const rotate = (p: {x:number, y:number}, ang: number) => {
        const rad = ang * Math.PI/180;
        return {
            x: p.x * Math.cos(rad) - p.y * Math.sin(rad),
            y: p.x * Math.sin(rad) + p.y * Math.cos(rad)
        };
    };
    
    const t1 = { x: cx + rotate(p1, angle).x, y: cy + rotate(p1, angle).y };
    const t2 = { x: cx + rotate(p2, angle).x, y: cy + rotate(p2, angle).y };
    const t3 = { x: cx + rotate(p3, angle).x, y: cy + rotate(p3, angle).y };

    // Draw Prism Body
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(t1.x, t1.y);
    ctx.lineTo(t2.x, t2.y);
    ctx.lineTo(t3.x, t3.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // --- Ray Tracing ---
    // Source Ray
    const start = { x: 80, y: cy };
    const dir = { x: 1, y: 0 };
    
    // Intersection Helper
    const intersect = (pA:any, pB:any, pC:any, pD:any) => {
        const det = (pB.x - pA.x) * (pD.y - pC.y) - (pD.x - pC.x) * (pB.y - pA.y);
        if (det === 0) return null;
        const lambda = ((pD.y - pC.y) * (pD.x - pA.x) + (pC.x - pD.x) * (pD.y - pA.y)) / det;
        const gamma = ((pA.y - pB.y) * (pD.x - pA.x) + (pB.x - pA.x) * (pD.y - pA.y)) / det;
        if (0 < lambda && 0 < gamma && gamma < 1) return { x: pA.x + lambda * (pB.x - pA.x), y: pA.y + lambda * (pB.y - pA.y) };
        return null;
    };
    
    // Prism Faces
    const faces = [ {a:t1,b:t3}, {a:t3,b:t2}, {a:t2,b:t1} ];
    
    // 1. Find Entry Point
    let entry: any = null;
    let entryFaceIdx = -1;
    const far = { x: start.x + 1000, y: start.y }; // Ray cast far right
    
    faces.forEach((f, i) => {
        const hit = intersect(start, far, f.a, f.b);
        if (hit && (!entry || hit.x < entry.x)) {
            entry = hit;
            entryFaceIdx = i;
        }
    });

    // Draw White Beam
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    if (!entry) {
        ctx.lineTo(far.x, far.y);
        ctx.stroke();
        return; // Miss
    }
    ctx.lineTo(entry.x, entry.y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 2. Dispersion Loop
    colors.forEach(c => {
        const n1 = 1.0; // Air
        const n2 = c.n; // Glass
        
        // Calculate Refraction Vector (Snell's) at Entry
        const f1 = faces[entryFaceIdx];
        const dx = f1.b.x - f1.a.x;
        const dy = f1.b.y - f1.a.y;
        let nx = -dy; let ny = dx; // Normal
        const l = Math.sqrt(nx*nx + ny*ny);
        nx/=l; ny/=l;
        if (dir.x*nx + dir.y*ny > 0) { nx = -nx; ny = -ny; } // Point against ray
        
        // Refract Entry
        // v2 = r*v1 + (r*cos1 - sqrt(1 - r^2 sin^2))*n
        // simple vector Snell implementation
        const r = n1/n2;
        const dn = dir.x*nx + dir.y*ny;
        const k = 1 - r*r*(1 - dn*dn);
        
        if (k < 0) return; // TIR
        
        const dir2 = {
            x: r*dir.x - (r*dn + Math.sqrt(k))*nx,
            y: r*dir.y - (r*dn + Math.sqrt(k))*ny
        };
        
        // Find Exit
        let exit: any = null;
        let exitFaceIdx = -1;
        const innerFar = { x: entry.x + dir2.x*1000, y: entry.y + dir2.y*1000 };
        
        faces.forEach((f, i) => {
            if (i === entryFaceIdx) return;
            const hit = intersect(entry, innerFar, f.a, f.b);
            if (hit && (!exit || (hit.x - entry.x)*dir2.x + (hit.y - entry.y)*dir2.y < (exit.x - entry.x)*dir2.x + (exit.y - entry.y)*dir2.y)) {
                // Check closest forward hit
                 // Ensure distance is positive (simple dot check above)
                 const dist = Math.hypot(hit.x - entry.x, hit.y - entry.y);
                 if (dist > 0.1) { // Avoid self intersect
                    if (!exit || dist < Math.hypot(exit.x - entry.x, exit.y - entry.y)) {
                        exit = hit;
                        exitFaceIdx = i;
                    }
                 }
            }
        });
        
        if (exit) {
            // Draw internal ray
            ctx.strokeStyle = c.color;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.moveTo(entry.x, entry.y); ctx.lineTo(exit.x, exit.y); ctx.stroke();
            
            // Refract Exit
            const f2 = faces[exitFaceIdx];
            const dx2 = f2.b.x - f2.a.x;
            const dy2 = f2.b.y - f2.a.y;
            let nx2 = -dy2; let ny2 = dx2;
            const l2 = Math.sqrt(nx2*nx2 + ny2*ny2);
            nx2/=l2; ny2/=l2;
            if (dir2.x*nx2 + dir2.y*ny2 > 0) { nx2 = -nx2; ny2 = -ny2; }
            
            const r2 = n2/n1;
            const dn2 = dir2.x*nx2 + dir2.y*ny2;
            const k2 = 1 - r2*r2*(1 - dn2*dn2);
            
            if (k2 >= 0) {
                 const dir3 = {
                    x: r2*dir2.x - (r2*dn2 + Math.sqrt(k2))*nx2,
                    y: r2*dir2.y - (r2*dn2 + Math.sqrt(k2))*ny2
                };
                
                // Draw Output Ray
                ctx.globalAlpha = 0.8;
                ctx.beginPath(); ctx.moveTo(exit.x, exit.y);
                // Extend to screen
                const screenX = w - 50;
                // t = (screenX - x) / dir.x
                if (dir3.x > 0) {
                    const t = (screenX - exit.x) / dir3.x;
                    const hitY = exit.y + dir3.y * t;
                    ctx.lineTo(screenX, hitY);
                    ctx.stroke();
                    
                    // Draw on Screen (Spectrum)
                    if (hitY > 0 && hitY < h) {
                        ctx.shadowColor = c.color;
                        ctx.shadowBlur = 15;
                        ctx.fillStyle = c.color;
                        ctx.fillRect(screenX, hitY - 2, 4, 15); // Smear vertical slightly
                        ctx.shadowBlur = 0;
                    }
                } else {
                    ctx.lineTo(exit.x + dir3.x*1000, exit.y + dir3.y*1000);
                    ctx.stroke();
                }
            }
        }
    });
    ctx.globalAlpha = 1.0;
    
    // Draw Screen Object
    ctx.fillStyle = '#1e1e1e';
    ctx.fillRect(w - 50, 50, 10, h - 100);
    ctx.strokeStyle = '#555';
    ctx.strokeRect(w - 50, 50, 10, h - 100);

  };

  useEffect(() => { draw(); }, [angle]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-black rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
         <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain" />
         <div className="absolute bottom-4 left-4 text-xs text-slate-500 font-mono">
            Dispersion Model: Cauchy Equation n(λ)
         </div>
         <div className="absolute top-4 right-4 text-slate-400 text-xs font-bold uppercase tracking-widest bg-black/50 p-2 border border-slate-700 rounded">
             Spectrum Screen
         </div>
      </div>
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 flex items-center gap-6">
            <div className="flex-grow space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase">Prism Angle</label>
                <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-mono">-60°</span>
                    <input 
                        type="range" 
                        min="-60" 
                        max="60" 
                        step="1"
                        value={angle} 
                        onChange={e => setAngle(Number(e.target.value))} 
                        className="flex-grow h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" 
                    />
                    <span className="text-white font-mono w-10 text-right">{angle}°</span>
                </div>
            </div>
            <div className="text-xs text-slate-400 max-w-xs leading-relaxed">
                <strong className="text-white">Explanation:</strong> Violet light has a higher refractive index than Red light, causing it to bend (refract) more. This difference separates white light into a spectrum.
            </div>
      </div>
     </div>
  );
};