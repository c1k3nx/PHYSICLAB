import React, { useState, useEffect, useRef } from 'react';
import { Maximize, MoveHorizontal } from 'lucide-react';

export const LensSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focalLength, setFocalLength] = useState(100);
  const [objDist, setObjDist] = useState(200);
  const [objHeight, setObjHeight] = useState(80);
  const [dragTarget, setDragTarget] = useState<'obj' | 'focus' | null>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
      const {x, y} = getMousePos(e);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      const objX = cx - objDist;
      const objY = cy - objHeight;
      
      if (Math.abs(x - objX) < 40 && Math.abs(y - objY) < 100) {
          setDragTarget('obj');
          return;
      }
      const fX = cx + focalLength;
      if (Math.abs(x - fX) < 30 && Math.abs(y - cy) < 30) {
          setDragTarget('focus');
          return;
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!dragTarget) return;
      const {x, y} = getMousePos(e);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (dragTarget === 'obj') {
          const newDist = Math.max(20, cx - x);
          const newHeight = Math.max(10, Math.min(250, cy - y));
          setObjDist(newDist);
          setObjHeight(newHeight); 
      } else if (dragTarget === 'focus') {
          const newF = Math.max(30, Math.abs(x - cx));
          setFocalLength(newF);
      }
  };

  const handleMouseUp = () => setDragTarget(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = canvas.width;
    const h = canvas.height;
    const cy = h / 2;
    const cx = w / 2;

    // --- DARK ROOM AESTHETIC ---
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0,0,w,h);
    
    // Grid (Subtle)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(let i=0; i<w; i+=50) { ctx.moveTo(i,0); ctx.lineTo(i,h); }
    for(let i=0; i<h; i+=50) { ctx.moveTo(0,i); ctx.lineTo(w,i); }
    ctx.stroke();

    // Optical Axis
    ctx.strokeStyle = '#475569';
    ctx.setLineDash([5,5]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
    ctx.setLineDash([]);

    // --- Lens (Glass Effect) ---
    const lensGrad = ctx.createLinearGradient(cx - 20, 0, cx + 20, 0);
    lensGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    lensGrad.addColorStop(0.5, 'rgba(147, 197, 253, 0.3)');
    lensGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    
    ctx.fillStyle = lensGrad;
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx, cy, 15, 220, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    
    // Lens Glint
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx-5, cy-50, 3, 40, 0.1, 0, Math.PI*2); ctx.stroke();

    // Focal Points
    const drawPoint = (x:number, label: string) => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath(); ctx.arc(x, cy, 4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#94a3b8'; ctx.font='12px sans-serif'; ctx.fillText(label, x-5, cy+20);
    };
    drawPoint(cx - focalLength, "F"); 
    drawPoint(cx + focalLength, "F'");

    // --- Object (Light Source) ---
    const objX = cx - objDist;
    const objY = cy - objHeight;
    
    // Glow effect for object
    ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444';
    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(objX, cy); ctx.lineTo(objX, objY); ctx.stroke();
    // Arrow
    ctx.beginPath(); ctx.moveTo(objX-8, objY+10); ctx.lineTo(objX, objY); ctx.lineTo(objX+8, objY+10); ctx.stroke();
    ctx.shadowBlur = 0;

    // --- Image Calc ---
    let imgDist = Infinity;
    if (objDist !== focalLength) {
        imgDist = 1 / ((1/focalLength) - (1/objDist));
    }
    const mag = -imgDist / objDist;
    const imgHeight = mag * objHeight;
    const imgX = cx + imgDist;
    const isVirtual = imgDist < 0;

    // --- Principal Rays (Laser Beams) ---
    // Use additive blending for light
    ctx.globalCompositeOperation = 'screen';
    
    const drawLaser = (x1: number, y1: number, x2: number, y2: number, isVirtualLine = false) => {
        ctx.beginPath();
        if (isVirtualLine) {
            ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
            ctx.setLineDash([4,4]);
            ctx.lineWidth = 1;
        } else {
            ctx.strokeStyle = '#f43f5e';
            ctx.setLineDash([]);
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#f43f5e';
        }
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
    };

    // Ray 1: Parallel -> Focus
    drawLaser(objX, objY, cx, objY); // To lens
    const r1_slope = (cy - objY) / focalLength; // Slope from lens y down to F'
    // F' is at cx + focalLength, cy
    // line: y - cy = m(x - (cx+f))
    // we want to draw from cx, objY to infinity
    const r1_endX = cx + 800;
    const r1_endY = objY + ((objY - cy)/(0 - focalLength)) * 800; // wait, slope logic
    // Just point to Image Tip
    // If real image, rays converge at (imgX, cy - imgHeight)
    // If virtual, they diverge as if coming from (imgX, cy - imgHeight)
    
    // Let's use geometry points strictly
    // Point A: (cx, objY) on lens
    // Point B: (cx + focalLength, cy) is F'
    // Ray goes A -> B -> extend
    const slope1 = (cy - objY) / focalLength;
    const endX1 = cx + 1000;
    const endY1 = objY + slope1 * 1000;
    drawLaser(cx, objY, endX1, endY1);
    
    if (isVirtual) {
        // Trace back to virtual image
        drawLaser(cx, objY, imgX, cy - imgHeight, true);
    }

    // Ray 2: Center (Straight)
    // Point O: (cx, cy)
    const slope2 = (cy - objY) / (cx - objX);
    const endX2 = cx + 1000;
    const endY2 = cy + slope2 * 1000;
    drawLaser(objX, objY, endX2, endY2);
    
    if (isVirtual) {
        drawLaser(cx, cy, imgX, cy - imgHeight, true);
    }

    // Ray 3: Through F -> Parallel
    // If obj outside F: goes through F(left), hits lens, goes parallel
    // If obj inside F: aims as if from F(left)? No.
    // Ray 3 definition: Ray passing through F (front) emerges parallel.
    // Only possible if object is outside F or ray projected back through F.
    
    // Let's simplify visuals. Just show 2 rays is usually enough for clarity, 
    // but users asked for 3.
    // Intersection with lens: y = cy + slope * (cx - x)
    // Ray through F (cx - f, cy)
    const slope3 = (cy - objY) / ((cx - focalLength) - objX);
    const hitY3 = objY + slope3 * (cx - objX);
    
    drawLaser(objX, objY, cx, hitY3); // To Lens
    drawLaser(cx, hitY3, cx + 1000, hitY3); // Parallel Out
    
    if (isVirtual) {
        drawLaser(cx, hitY3, imgX, hitY3, true); // Trace back parallel part
        // And the input part trace back?
        drawLaser(objX, objY, cx - focalLength, cy, true);
    }

    ctx.globalCompositeOperation = 'source-over';

    // --- Draw Image ---
    if (Math.abs(imgDist) < 3000) {
        ctx.strokeStyle = isVirtual ? '#fbbf24' : '#fbbf24';
        if (isVirtual) ctx.setLineDash([4,4]);
        ctx.lineWidth = 4;
        ctx.shadowBlur = 10; ctx.shadowColor = '#fbbf24';
        ctx.beginPath(); ctx.moveTo(imgX, cy); ctx.lineTo(imgX, cy - imgHeight); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
        
        // Label
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(isVirtual ? "Virtual Image" : "Real Image", imgX - 30, cy - imgHeight - 15);
    }
  };

  useEffect(() => { draw(); }, [focalLength, objDist, objHeight, dragTarget]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-black rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
         <canvas 
            ref={canvasRef} 
            width={1600} 
            height={900} 
            className="w-full h-full object-contain cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
         />
         <div className="absolute top-4 left-4 text-xs font-mono text-blue-300 bg-blue-900/20 px-2 py-1 rounded border border-blue-500/30">
             Laser Ray Tracing Active
         </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8 items-end shadow-xl">
           <div className="space-y-2">
            <label className="text-xs text-blue-400 font-bold uppercase flex items-center gap-2"><Maximize size={14}/> Focal Length (f)</label>
            <input 
                type="range" min="50" max="300" value={focalLength} 
                onChange={e => setFocalLength(Number(e.target.value))} 
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" 
            />
            <div className="text-right text-blue-400 font-mono">{focalLength}px</div>
           </div>

           <div className="space-y-2">
            <label className="text-xs text-red-400 font-bold uppercase flex items-center gap-2"><MoveHorizontal size={14}/> Object Distance (do)</label>
            <input 
                type="range" min="20" max="500" value={objDist} 
                onChange={e => setObjDist(Number(e.target.value))} 
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" 
            />
            <div className="text-right text-red-400 font-mono">{objDist}px</div>
           </div>
      </div>
    </div>
  );
};