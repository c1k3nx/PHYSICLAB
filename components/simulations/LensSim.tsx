
import React, { useState, useEffect, useRef } from 'react';
import { Maximize, MoveHorizontal, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const LensSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [focalLength, setFocalLength] = useState(100);
  const [objDist, setObjDist] = useState(200);
  const [objHeight, setObjHeight] = useState(80);
  const [dragTarget, setDragTarget] = useState<'obj' | 'focus' | null>(null);
  const [showControls, setShowControls] = useState(true);

  const getMousePos = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return {x:0, y:0};
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; 
      const scaleY = canvas.height / rect.height;
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      const {x, y} = getMousePos(e);
      const canvas = canvasRef.current; if (!canvas) return;
      const cx = canvas.width / 2; const cy = canvas.height / 2;
      const objX = cx - objDist; const objY = cy - objHeight;
      if (Math.abs(x - objX) < 40 && Math.abs(y - objY) < 100) { setDragTarget('obj'); return; }
      const fX = cx + focalLength;
      if (Math.abs(x - fX) < 30 && Math.abs(y - cy) < 30) { setDragTarget('focus'); return; }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!dragTarget) return;
      const {x, y} = getMousePos(e);
      const canvas = canvasRef.current; if (!canvas) return;
      const cx = canvas.width / 2; const cy = canvas.height / 2;
      if (dragTarget === 'obj') { const newDist = Math.max(20, cx - x); const newHeight = Math.max(10, Math.min(250, cy - y)); setObjDist(newDist); setObjHeight(newHeight); } 
      else if (dragTarget === 'focus') { const newF = Math.max(30, Math.abs(x - cx)); setFocalLength(newF); }
  };

  const draw = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const w = canvas.width; const h = canvas.height; const cy = h / 2; const cx = w / 2;

    ctx.clearRect(0,0,w,h); ctx.fillStyle = '#020617'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.beginPath(); for(let i=0; i<w; i+=50) { ctx.moveTo(i,0); ctx.lineTo(i,h); } for(let i=0; i<h; i+=50) { ctx.moveTo(0,i); ctx.lineTo(w,i); } ctx.stroke();
    ctx.strokeStyle = '#475569'; ctx.setLineDash([5,5]); ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke(); ctx.setLineDash([]);

    const lensGrad = ctx.createLinearGradient(cx - 20, 0, cx + 20, 0);
    lensGrad.addColorStop(0, 'rgba(255, 255, 255, 0.05)'); lensGrad.addColorStop(0.5, 'rgba(147, 197, 253, 0.3)'); lensGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = lensGrad; ctx.strokeStyle = 'rgba(147, 197, 253, 0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, 15, 220, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    
    const drawPoint = (x:number, label: string) => { ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(x, cy, 4, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#94a3b8'; ctx.font='12px sans-serif'; ctx.fillText(label, x-5, cy+20); };
    drawPoint(cx - focalLength, "F"); drawPoint(cx + focalLength, "F'");

    const objX = cx - objDist; const objY = cy - objHeight;
    ctx.shadowBlur = 15; ctx.shadowColor = '#ef4444'; ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(objX, cy); ctx.lineTo(objX, objY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(objX-8, objY+10); ctx.lineTo(objX, objY); ctx.lineTo(objX+8, objY+10); ctx.stroke(); ctx.shadowBlur = 0;

    let imgDist = Infinity; if (objDist !== focalLength) { imgDist = 1 / ((1/focalLength) - (1/objDist)); }
    const mag = -imgDist / objDist; const imgHeight = mag * objHeight; const imgX = cx + imgDist; const isVirtual = imgDist < 0;

    ctx.globalCompositeOperation = 'screen';
    const drawLaser = (x1: number, y1: number, x2: number, y2: number, isVirtualLine = false) => {
        ctx.beginPath();
        if (isVirtualLine) { ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)'; ctx.setLineDash([4,4]); ctx.lineWidth = 1; } 
        else { ctx.strokeStyle = '#f43f5e'; ctx.setLineDash([]); ctx.lineWidth = 2; ctx.shadowBlur = 8; ctx.shadowColor = '#f43f5e'; }
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.shadowBlur = 0; ctx.setLineDash([]);
    };

    const slope1 = (cy - objY) / focalLength; const endX1 = cx + 1000; const endY1 = objY + slope1 * 1000;
    drawLaser(objX, objY, cx, objY); drawLaser(cx, objY, endX1, endY1);
    if (isVirtual) drawLaser(cx, objY, imgX, cy - imgHeight, true);

    const slope2 = (cy - objY) / (cx - objX); const endX2 = cx + 1000; const endY2 = cy + slope2 * 1000;
    drawLaser(objX, objY, endX2, endY2);
    if (isVirtual) drawLaser(cx, cy, imgX, cy - imgHeight, true);

    const slope3 = (cy - objY) / ((cx - focalLength) - objX); const hitY3 = objY + slope3 * (cx - objX);
    drawLaser(objX, objY, cx, hitY3); drawLaser(cx, hitY3, cx + 1000, hitY3); 
    if (isVirtual) { drawLaser(cx, hitY3, imgX, hitY3, true); drawLaser(objX, objY, cx - focalLength, cy, true); }

    ctx.globalCompositeOperation = 'source-over';
    if (Math.abs(imgDist) < 3000) {
        ctx.strokeStyle = isVirtual ? '#fbbf24' : '#fbbf24'; if (isVirtual) ctx.setLineDash([4,4]);
        ctx.lineWidth = 4; ctx.shadowBlur = 10; ctx.shadowColor = '#fbbf24';
        ctx.beginPath(); ctx.moveTo(imgX, cy); ctx.lineTo(imgX, cy - imgHeight); ctx.stroke();
        ctx.shadowBlur = 0; ctx.setLineDash([]);
        ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 14px sans-serif'; ctx.fillText(isVirtual ? t('virtual_image') : t('real_image'), imgX - 30, cy - imgHeight - 15);
    }
  };

  useEffect(() => { draw(); }, [focalLength, objDist, objHeight, dragTarget, t]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
        <canvas 
            ref={canvasRef} 
            width={1600} 
            height={900} 
            className="absolute inset-0 w-full h-full object-contain cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragTarget(null)}
            onMouseLeave={() => setDragTarget(null)}
        />
        
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
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('focal_length')} (f)</span><span className="text-blue-400">{focalLength}px</span></div>
                                <input type="range" min="50" max="300" value={focalLength} onChange={e => setFocalLength(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('object_dist')} (d)</span><span className="text-red-400">{objDist}px</span></div>
                                <input type="range" min="20" max="500" value={objDist} onChange={e => setObjDist(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
