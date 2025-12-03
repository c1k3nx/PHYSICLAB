
import React, { useState, useEffect, useRef } from 'react';
import { Settings2, ChevronUp, ChevronDown, Layers, RotateCw, MoveVertical, Flashlight, Target } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const PrismSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [angle, setAngle] = useState(60); 
  const [sourceY, setSourceY] = useState(300); 
  const [beamAngle, setBeamAngle] = useState(0); 
  const [material, setMaterial] = useState<'crown' | 'flint' | 'diamond'>('flint');
  const [showControls, setShowControls] = useState(true);

  // Physics Config
  const MATERIALS = {
      crown: { name: 'crown_glass', A: 1.50, B: 4000, color: '#a5f3fc' },
      flint: { name: 'flint_glass', A: 1.62, B: 10000, color: '#ddd6fe' }, 
      diamond: { name: 'diamond', A: 2.42, B: 15000, color: '#e2e8f0' }
  };

  const nmToRGB = (wavelength: number) => {
      let Gamma = 0.80, IntensityMax = 255, factor, red, green, blue;
      if((wavelength >= 380) && (wavelength<440)){ red = -(wavelength - 440) / (440 - 380); green = 0.0; blue = 1.0; }
      else if((wavelength >= 440) && (wavelength<490)){ red = 0.0; green = (wavelength - 440) / (490 - 440); blue = 1.0; }
      else if((wavelength >= 490) && (wavelength<510)){ red = 0.0; green = 1.0; blue = -(wavelength - 510) / (510 - 490); }
      else if((wavelength >= 510) && (wavelength<580)){ red = (wavelength - 510) / (580 - 510); green = 1.0; blue = 0.0; }
      else if((wavelength >= 580) && (wavelength<645)){ red = 1.0; green = -(wavelength - 645) / (645 - 580); blue = 0.0; }
      else if((wavelength >= 645) && (wavelength<781)){ red = 1.0; green = 0.0; blue = 0.0; }
      else{ red = 0.0; green = 0.0; blue = 0.0; }
      if((wavelength >= 380) && (wavelength<420)){ factor = 0.3 + 0.7*(wavelength - 380) / (420 - 380); }
      else if((wavelength >= 420) && (wavelength<701)){ factor = 1.0; }
      else if((wavelength >= 701) && (wavelength<781)){ factor = 0.3 + 0.7*(781 - wavelength) / (781 - 701); }
      else{ factor = 0.0; }
      const r = Math.round(IntensityMax * Math.pow(red * factor, Gamma));
      const g = Math.round(IntensityMax * Math.pow(green * factor, Gamma));
      const b = Math.round(IntensityMax * Math.pow(blue * factor, Gamma));
      return `rgb(${r},${g},${b})`;
  };

  const autoAlign = () => {
      const mat = MATERIALS[material];
      const n = mat.A; 
      if (n > 2.0) { setAngle(180); setBeamAngle(-15); setSourceY(350); } 
      else if (n > 1.6) { setAngle(50); setBeamAngle(-25); setSourceY(400); } 
      else { setAngle(60); setBeamAngle(0); setSourceY(300); }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width; const h = canvas.height; 
    const cx = w/2 - 150; const cy = h/2;
    const SIZE = 200;

    // Dark Room BG
    ctx.fillStyle = '#020617'; ctx.fillRect(0,0,w,h);
    
    // --- 1. Draw Projection Screen (Full Height) ---
    const screenX = w - 80;
    const screenY = 20;
    const screenH = h - 40;
    
    ctx.fillStyle = '#1e293b'; 
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.fillRect(screenX, screenY, 12, screenH); 
    ctx.strokeRect(screenX, screenY, 12, screenH);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    for(let y=screenY; y<screenY+screenH; y+=50) {
        ctx.fillRect(screenX, y, 8, 1);
        if (Math.abs(y - h/2) < 200) ctx.fillText(((y-h/2)/10).toString(), screenX + 15, y+3);
    }
    
    const beamRad = (beamAngle * Math.PI) / 180;
    const srcBoxW = 80; const srcBoxH = 30;
    const srcX = 80; 
    
    ctx.save();
    ctx.translate(srcX, sourceY);
    ctx.rotate(beamRad);
    ctx.fillStyle = '#334155'; 
    ctx.shadowColor='black'; ctx.shadowBlur=10;
    ctx.fillRect(-srcBoxW, -srcBoxH/2, srcBoxW, srcBoxH);
    ctx.fillStyle = '#64748b'; 
    ctx.fillRect(0, -10, 10, 20);
    ctx.restore();
    
    const hTri = SIZE * Math.sqrt(3) / 2;
    const p1 = { x: -SIZE/2, y: hTri/3 }; 
    const p2 = { x: SIZE/2, y: hTri/3 }; 
    const p3 = { x: 0, y: -2*hTri/3 };         
    const rotate = (p: {x:number, y:number}, ang: number) => {
        const rad = ang * Math.PI/180;
        return { x: p.x * Math.cos(rad) - p.y * Math.sin(rad), y: p.x * Math.sin(rad) + p.y * Math.cos(rad) };
    };
    const t1 = { x: cx + rotate(p1, angle).x, y: cy + rotate(p1, angle).y };
    const t2 = { x: cx + rotate(p2, angle).x, y: cy + rotate(p2, angle).y };
    const t3 = { x: cx + rotate(p3, angle).x, y: cy + rotate(p3, angle).y };

    ctx.save();
    const grad = ctx.createLinearGradient(t1.x, t1.y, t2.x, t2.y);
    grad.addColorStop(0, 'rgba(255,255,255,0.05)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
    grad.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.fillStyle = grad;
    ctx.strokeStyle = MATERIALS[material].color; 
    ctx.lineWidth = 2; 
    ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(t1.x, t1.y); ctx.lineTo(t2.x, t2.y); ctx.lineTo(t3.x, t3.y); ctx.closePath(); 
    ctx.fill(); 
    ctx.shadowColor = MATERIALS[material].color; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.restore();

    const start = { 
        x: srcX + Math.cos(beamRad)*10, 
        y: sourceY + Math.sin(beamRad)*10 
    }; 
    const dir = { x: Math.cos(beamRad), y: Math.sin(beamRad) };

    const intersect = (pA:any, pB:any, pC:any, pD:any) => {
        const det = (pB.x - pA.x) * (pD.y - pC.y) - (pD.x - pC.x) * (pB.y - pA.y);
        if (det === 0) return null;
        const lambda = ((pD.y - pC.y) * (pD.x - pA.x) + (pC.x - pD.x) * (pD.y - pA.y)) / det;
        const gamma = ((pA.y - pB.y) * (pD.x - pA.x) + (pB.x - pA.x) * (pD.y - pA.y)) / det;
        if (0 < lambda && 0 < gamma && gamma < 1) return { x: pA.x + lambda * (pB.x - pA.x), y: pA.y + lambda * (pB.y - pA.y) };
        return null;
    };
    
    const faces = [ {a:t1,b:t3}, {a:t3,b:t2}, {a:t2,b:t1} ];
    let entry: any = null; let entryFaceIdx = -1; const far = { x: start.x + Math.cos(beamRad)*1000, y: start.y + Math.sin(beamRad)*1000 }; 
    faces.forEach((f, i) => { const hit = intersect(start, far, f.a, f.b); if (hit && (!entry || hit.x < entry.x)) { entry = hit; entryFaceIdx = i; } });

    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.shadowColor = 'white'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.moveTo(start.x, start.y);
    if (!entry) { ctx.lineTo(far.x, far.y); ctx.stroke(); return; }
    ctx.lineTo(entry.x, entry.y); ctx.stroke(); 
    
    const mat = MATERIALS[material];
    const wavelengths = [];
    for(let l = 380; l <= 750; l += 5) wavelengths.push(l);

    wavelengths.forEach(lambda => {
        const n2 = mat.A + mat.B / (lambda**2); 
        const n1 = 1.0; 
        
        const f1 = faces[entryFaceIdx];
        const dx = f1.b.x - f1.a.x; const dy = f1.b.y - f1.a.y;
        let nx = -dy; let ny = dx; const l = Math.sqrt(nx*nx + ny*ny); nx/=l; ny/=l;
        if (dir.x*nx + dir.y*ny > 0) { nx = -nx; ny = -ny; } 
        
        const r = n1/n2; const dn = dir.x*nx + dir.y*ny; const k = 1 - r*r*(1 - dn*dn);
        if (k < 0) return; 
        
        const dir2 = { x: r*dir.x - (r*dn + Math.sqrt(k))*nx, y: r*dir.y - (r*dn + Math.sqrt(k))*ny };
        
        let exit: any = null; let exitFaceIdx = -1;
        const innerFar = { x: entry.x + dir2.x*1000, y: entry.y + dir2.y*1000 };
        
        faces.forEach((f, i) => {
            if (i === entryFaceIdx) return;
            const hit = intersect(entry, innerFar, f.a, f.b);
            if (hit) { const dist = Math.hypot(hit.x - entry.x, hit.y - entry.y); if (dist > 0.1) { if (!exit || dist < Math.hypot(exit.x - entry.x, exit.y - entry.y)) { exit = hit; exitFaceIdx = i; } } }
        });
        
        if (exit) {
            const color = nmToRGB(lambda);
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.globalAlpha = 0.1; ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.moveTo(entry.x, entry.y); ctx.lineTo(exit.x, exit.y); ctx.stroke();
            
            const f2 = faces[exitFaceIdx];
            const dx2 = f2.b.x - f2.a.x; const dy2 = f2.b.y - f2.a.y;
            let nx2 = -dy2; let ny2 = dx2; const l2 = Math.sqrt(nx2*nx2 + ny2*ny2); nx2/=l2; ny2/=l2;
            if (dir2.x*nx2 + dir2.y*ny2 > 0) { nx2 = -nx2; ny2 = -ny2; }
            const r2 = n2/n1; const dn2 = dir2.x*nx2 + dir2.y*ny2; const k2 = 1 - r2*r2*(1 - dn2*dn2);
            
            if (k2 >= 0) {
                 const dir3 = { x: r2*dir2.x - (r2*dn2 + Math.sqrt(k2))*nx2, y: r2*dir2.y - (r2*dn2 + Math.sqrt(k2))*ny2 };
                 ctx.globalAlpha = 0.15;
                 ctx.beginPath(); ctx.moveTo(exit.x, exit.y);
                 
                 if (dir3.x > 0) {
                    const t = (screenX - exit.x) / dir3.x; const hitY = exit.y + dir3.y * t;
                    ctx.lineTo(screenX, hitY); ctx.stroke();
                    if (hitY > 0 && hitY < h) { 
                        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = color; ctx.shadowBlur = 15; 
                        ctx.fillStyle = color; ctx.fillRect(screenX, hitY - 6, 6, 12); 
                        ctx.restore();
                    }
                 } else { ctx.lineTo(exit.x + dir3.x*1000, exit.y + dir3.y*1000); ctx.stroke(); }
            }
        }
    });
    
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1.0;
  };

  useEffect(() => { draw(); }, [angle, material, sourceY, beamAngle]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
        <canvas ref={canvasRef} width={1000} height={600} className="absolute inset-0 w-full h-full object-contain" />
        
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
                            <button onClick={autoAlign} className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all">
                                <Target size={14}/> {t('auto_align_screen')}
                            </button>

                            <div className="flex justify-between text-xs text-slate-300">
                                <span className="flex items-center gap-2"><MoveVertical size={14}/> {t('light_y_pos')}</span>
                                <span className="text-green-400 font-mono">{sourceY}</span>
                            </div>
                            <input type="range" min="100" max="500" step="5" value={sourceY} onChange={e => setSourceY(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500" />

                            <div className="flex justify-between text-xs text-slate-300">
                                <span className="flex items-center gap-2"><Flashlight size={14}/> {t('light_beam_angle')}</span>
                                <span className="text-yellow-400 font-mono">{beamAngle}°</span>
                            </div>
                            <input type="range" min="-45" max="45" step="1" value={beamAngle} onChange={e => setBeamAngle(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />

                            <div className="flex justify-between text-xs text-slate-300">
                                <span className="flex items-center gap-2"><RotateCw size={14}/> {t('prism_rotation')}</span>
                                <span className="text-purple-400 font-mono">{angle}°</span>
                            </div>
                            <input type="range" min="0" max="360" step="1" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><Layers size={14}/> {t('arch_material')}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(MATERIALS).map(([key, val]) => (
                                    <button 
                                        key={key} 
                                        onClick={() => setMaterial(key as any)}
                                        className={`px-2 py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${material === key ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        {t(val.name)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
