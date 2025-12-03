
import React, { useState, useEffect, useRef } from 'react';
import { Settings2, ChevronUp, ChevronDown, Waves, Compass, MousePointer2 } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const OpticsSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [n1, setN1] = useState(1.00); 
  const [n2, setN2] = useState(1.50); 
  
  // Interactive State
  const [laserAngle, setLaserAngle] = useState(45);
  const [showControls, setShowControls] = useState(true);
  const [showWaves, setShowWaves] = useState(false);
  const [showProtractor, setShowProtractor] = useState(false);
  const [isDraggingLaser, setIsDraggingLaser] = useState(false);
  const [protractorPos, setProtractorPos] = useState({x: 500, y: 300});
  const [isDraggingProtractor, setIsDraggingProtractor] = useState(false);

  const waveOffsetRef = useRef(0);
  const requestRef = useRef<number|null>(null);

  const PRESETS = {
      air: 1.00,
      water: 1.33,
      glass: 1.50,
      diamond: 2.42
  };

  const getMousePos = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return {x:0, y:0};
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width; const h = canvas.height;
    const centerX = w / 2; const centerY = h / 2;

    ctx.clearRect(0, 0, w, h);
    
    // --- 1. Draw Mediums ---
    // Medium 1 (Top)
    const opacity1 = (n1 - 1) * 0.3;
    ctx.fillStyle = `rgba(147, 197, 253, ${opacity1})`; 
    ctx.fillRect(0, 0, w, centerY);
    
    // Medium 2 (Bottom)
    const opacity2 = (n2 - 1) * 0.3;
    ctx.fillStyle = `rgba(59, 130, 246, ${opacity2})`; 
    ctx.fillRect(0, centerY, w, centerY);

    // Boundary Line
    ctx.beginPath(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();
    // Normal Line
    ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.setLineDash([5, 5]); ctx.lineWidth = 1; ctx.moveTo(centerX, 0); ctx.lineTo(centerX, h); ctx.stroke(); ctx.setLineDash([]);

    // --- 2. Calculate Ray Physics ---
    // Laser Input Angle (from Normal)
    // Laser is physically at top, so angle is 0 (vertical) to 90 (horizontal)
    const rad1 = (laserAngle * Math.PI) / 180; 
    
    let rad2 = 0;
    let tir = false; // Total Internal Reflection
    if (n1 > n2) {
        const crit = Math.asin(n2/n1);
        if (rad1 > crit) { tir = true; rad2 = rad1; } // Reflection angle = Incident angle
        else { rad2 = Math.asin((n1 * Math.sin(rad1)) / n2); }
    } else { rad2 = Math.asin((n1 * Math.sin(rad1)) / n2); }

    const rayLen = 400;
    // Source Position
    const srcX = centerX - rayLen * Math.sin(rad1);
    const srcY = centerY - rayLen * Math.cos(rad1);

    // --- 3. Draw Laser Body (Interactive Handle) ---
    ctx.save();
    ctx.translate(srcX, srcY);
    ctx.rotate(Math.PI/2 - rad1);
    
    // Laser Device
    ctx.fillStyle = '#333'; ctx.shadowColor = 'black'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.roundRect(-40, -15, 80, 30, 5); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#ef4444'; ctx.fillRect(30, -5, 10, 10); // Red emitter tip
    
    // Glow/Hover State
    if (isDraggingLaser) { ctx.strokeStyle = '#fff'; ctx.lineWidth=2; ctx.strokeRect(-42, -17, 84, 34); }
    ctx.restore();

    // --- 4. Draw Rays ---
    const drawBeam = (x1:number, y1:number, x2:number, y2:number, color: string, width: number) => {
        ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width;
        ctx.shadowColor = color; ctx.shadowBlur = 15; ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.shadowBlur = 0;
    };

    // Incident Ray
    drawBeam(srcX, srcY, centerX, centerY, '#ef4444', 4);

    // Refracted or Reflected Ray
    const endX = tir ? centerX + rayLen * Math.sin(rad2) : centerX + rayLen * Math.sin(rad2);
    const endY = tir ? centerY - rayLen * Math.cos(rad2) : centerY + rayLen * Math.cos(rad2);
    
    drawBeam(centerX, centerY, endX, endY, tir ? '#fbbf24' : '#ef4444', 4); // Yellow if reflected, Red if refracted

    // Weak Reflection (Fresnel) - always exists partially
    if (!tir) {
        const refX = centerX + rayLen * Math.sin(rad1);
        const refY = centerY - rayLen * Math.cos(rad1);
        ctx.globalAlpha = 0.3; drawBeam(centerX, centerY, refX, refY, '#fbbf24', 2); ctx.globalAlpha = 1;
    }

    // --- 5. Draw Wavefronts (Optional) ---
    if (showWaves) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
        const waveSpeed1 = 2 / n1; 
        const waveSpeed2 = 2 / n2;
        
        // Incident Waves
        const offset1 = (waveOffsetRef.current * waveSpeed1) % 40;
        for(let d = 0; d < rayLen; d+=40) {
            const dist = d - offset1;
            const wx = centerX - dist * Math.sin(rad1);
            const wy = centerY - dist * Math.cos(rad1);
            // Perpendicular vector
            const px = Math.cos(rad1) * 30;
            const py = -Math.sin(rad1) * 30;
            ctx.beginPath(); ctx.moveTo(wx - px, wy - py); ctx.lineTo(wx + px, wy + py); ctx.stroke();
        }

        // Refracted Waves
        const offset2 = (waveOffsetRef.current * waveSpeed2) % 40;
        for(let d = 0; d < rayLen; d+=40) {
            const dist = d + offset2;
            const wx = centerX + dist * Math.sin(rad2);
            const wy = centerY + dist * Math.cos(rad2);
            const px = Math.cos(rad2) * 30;
            const py = -Math.sin(rad2) * 30;
            if (!tir) {
                ctx.beginPath(); ctx.moveTo(wx - px, wy - py); ctx.lineTo(wx + px, wy + py); ctx.stroke();
            }
        }
    }

    // --- 6. Protractor (Tool) ---
    if (showProtractor) {
        const px = protractorPos.x; const py = protractorPos.y;
        const r = 150;
        ctx.save(); ctx.translate(px, py);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI, true); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.moveTo(0, -5); ctx.lineTo(0, 5); ctx.stroke(); // Center cross
        
        ctx.font = '10px sans-serif'; ctx.fillStyle = 'white'; ctx.textAlign='center';
        for(let a=0; a<=180; a+=10) {
            const ar = (a * Math.PI)/180;
            const x1 = Math.cos(ar) * r; const y1 = -Math.sin(ar) * r;
            const x2 = Math.cos(ar) * (r-10); const y2 = -Math.sin(ar) * (r-10);
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            if (a%30===0) { 
                const tx = Math.cos(ar) * (r-20); const ty = -Math.sin(ar) * (r-20);
                ctx.fillText((180-a).toString(), tx, ty);
            }
        }
        if (isDraggingProtractor) { ctx.strokeStyle = '#facc15'; ctx.lineWidth=2; ctx.stroke(); }
        ctx.restore();
    }

    // Labels
    ctx.font = 'bold 12px sans-serif'; ctx.fillStyle = '#fff';
    ctx.fillText(`${t('medium_1')} (n=${n1.toFixed(2)})`, 20, 30);
    ctx.fillText(`${t('medium_2')} (n=${n2.toFixed(2)})`, 20, h - 20);
    
    if (tir) {
        ctx.fillStyle = '#facc15'; ctx.font='bold 20px sans-serif'; ctx.textAlign='center';
        ctx.fillText(t('total_internal_reflection'), w/2, h - 50);
    }
  };

  const animate = () => {
      waveOffsetRef.current += 1;
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [n1, n2, laserAngle, showWaves, showProtractor, isDraggingLaser, protractorPos, isDraggingProtractor, t]);

  // Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      const {x, y} = getMousePos(e);
      const w = canvasRef.current!.width; const h = canvasRef.current!.height;
      const centerX = w/2; const centerY = h/2;
      
      // Check Laser Hit
      const rad1 = (laserAngle * Math.PI) / 180;
      const srcX = centerX - 400 * Math.sin(rad1);
      const srcY = centerY - 400 * Math.cos(rad1);
      if (Math.hypot(x - srcX, y - srcY) < 40) { setIsDraggingLaser(true); return; }

      // Check Protractor Hit
      if (showProtractor && Math.hypot(x - protractorPos.x, y - protractorPos.y) < 150 && y < protractorPos.y) {
          setIsDraggingProtractor(true); return;
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      const {x, y} = getMousePos(e);
      if (isDraggingLaser) {
          const w = canvasRef.current!.width; const h = canvasRef.current!.height;
          const cx = w/2; const cy = h/2;
          let theta = Math.atan2(x - cx, cy - y) * 180 / Math.PI; 
          if (Math.abs(theta) > 90) theta = theta > 0 ? 90 : -90;
          setLaserAngle(-theta); 
      }
      if (isDraggingProtractor) {
          setProtractorPos({x, y});
      }
  };

  const handleMouseUp = () => { setIsDraggingLaser(false); setIsDraggingProtractor(false); };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas 
            ref={canvasRef} 
            width={1000} 
            height={600} 
            className={`absolute inset-0 w-full h-full object-contain ${isDraggingLaser || isDraggingProtractor ? 'cursor-grabbing' : 'cursor-default'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        />
        
        <div className="absolute top-4 right-4 pointer-events-none text-center">
             <div className="bg-slate-900/80 backdrop-blur border border-slate-600 rounded-xl p-3 shadow-lg">
                 <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t('drag_laser')}</div>
                 <div className="text-xl font-mono text-red-400 font-bold">{Math.abs(laserAngle).toFixed(1)}°</div>
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
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>{t('medium_1')} (n₁)</span>
                                    <span className="text-blue-300 font-mono">{n1.toFixed(2)}</span>
                                </div>
                                <input type="range" min="1.00" max="3.00" step="0.01" value={n1} onChange={(e) => setN1(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>{t('medium_2')} (n₂)</span>
                                    <span className="text-blue-500 font-mono">{n2.toFixed(2)}</span>
                                </div>
                                <input type="range" min="1.00" max="3.00" step="0.01" value={n2} onChange={(e) => setN2(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(PRESETS).map(([key, val]) => (
                                <button key={key} onClick={() => setN2(val)} className="p-1 rounded bg-slate-800 border border-slate-600 text-[10px] text-slate-300 hover:bg-slate-700 uppercase font-bold">{t(key)}</button>
                            ))}
                        </div>

                        <div className="w-full h-px bg-slate-700/50"></div>

                        <div className="flex gap-2">
                            <button onClick={() => setShowWaves(!showWaves)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 ${showWaves ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                <Waves size={14}/> {t('wavefronts')}
                            </button>
                            <button onClick={() => setShowProtractor(!showProtractor)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-2 ${showProtractor ? 'bg-yellow-600/30 border-yellow-500 text-yellow-300' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                <Compass size={14}/> {t('protractor')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
