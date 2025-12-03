
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Scale, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const TorqueSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [m1, setM1] = useState(5);
  const [d1, setD1] = useState(4); 
  const [m2, setM2] = useState(5);
  const [d2, setD2] = useState(4);
  const [showControls, setShowControls] = useState(true);
  
  // Physics State for animation
  const angleRef = useRef(0);
  const angularVelRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  const draw = () => {
      // ... drawing logic unchanged ...
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w/2;
      const cy = 250; 
      
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 600);
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0,0,w,h);
      ctx.fillStyle = '#334155'; ctx.fillRect(0, h-40, w, 40);

      const t1 = m1 * d1 * 9.8; 
      const t2 = m2 * d2 * 9.8;
      const netTorque = t2 - t1; 
      const I = (m1 * d1*d1) + (m2 * d2*d2) + 10; 
      const k = 50; 
      const damping = 0.96;
      const alpha = (netTorque - k * angleRef.current) / I;
      angularVelRef.current += alpha * 0.1;
      angularVelRef.current *= damping;
      angleRef.current += angularVelRef.current;
      const MAX_ANGLE = 30 * Math.PI / 180;
      if (angleRef.current > MAX_ANGLE) { angleRef.current = MAX_ANGLE; angularVelRef.current = 0; }
      if (angleRef.current < -MAX_ANGLE) { angleRef.current = -MAX_ANGLE; angularVelRef.current = 0; }

      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 80, h - 40); ctx.lineTo(cx + 80, h - 40); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 100, Math.PI, 2*Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI*2); ctx.fillStyle='#94a3b8'; ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRef.current);
      
      const beamLen = 600;
      const beamH = 16;
      const beamGrad = ctx.createLinearGradient(0, -beamH/2, 0, beamH/2);
      beamGrad.addColorStop(0, '#cbd5e1'); beamGrad.addColorStop(0.5, '#f1f5f9'); beamGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = beamGrad; ctx.shadowColor = 'black'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.roundRect(-beamLen/2, -beamH/2, beamLen, beamH, 4); ctx.fill(); ctx.shadowBlur = 0;
      
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 1;
      const step = (beamLen/2) / 6;
      ctx.font = '10px sans-serif'; ctx.fillStyle = '#475569'; ctx.textAlign = 'center';
      for(let i=1; i<=5; i++) {
          ctx.beginPath(); ctx.moveTo(-i*step, -beamH/2); ctx.lineTo(-i*step, 0); ctx.stroke();
          ctx.fillText(i.toString(), -i*step, 12);
          ctx.beginPath(); ctx.moveTo(i*step, -beamH/2); ctx.lineTo(i*step, 0); ctx.stroke();
          ctx.fillText(i.toString(), i*step, 12);
      }
      
      const drawWeight = (x: number, m: number, color: string) => {
          ctx.save(); ctx.translate(x, beamH/2); ctx.rotate(-angleRef.current);
          ctx.strokeStyle = '#94a3b8'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, 40); ctx.stroke();
          const size = 30 + m * 2;
          const grad = ctx.createLinearGradient(-size/2, 0, size/2, 0);
          grad.addColorStop(0, color); grad.addColorStop(0.4, '#fff'); grad.addColorStop(1, color);
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.moveTo(-size/2, 40); ctx.lineTo(size/2, 40); ctx.lineTo(size/2, 40 + size * 0.8);
          ctx.quadraticCurveTo(0, 40 + size, -size/2, 40 + size*0.8); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#000'; ctx.font = 'bold 12px sans-serif'; ctx.fillText(`${m}kg`, 0, 40 + size/2);
          ctx.restore();
      };
      drawWeight(-d1 * step, m1, '#3b82f6');
      drawWeight(d2 * step, m2, '#ef4444');
      ctx.restore();
      
      // HUD Panels
      const pW = 160; const pH = 70; const padTop = 30;
      ctx.fillStyle = 'rgba(30, 58, 138, 0.95)'; ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(30, padTop, pW, pH, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#93c5fd'; ctx.font = 'bold 12px uppercase sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`${t('torque')} (${t('left_object')})`, 45, padTop + 25);
      ctx.fillStyle = '#fff'; ctx.font = '28px monospace'; ctx.fillText(t1.toFixed(1), 45, padTop + 55); ctx.font = '14px sans-serif'; ctx.fillText("Nm", 140, padTop + 55);

      ctx.fillStyle = 'rgba(127, 29, 29, 0.95)'; ctx.strokeStyle = '#f87171';
      ctx.beginPath(); ctx.roundRect(w - 30 - pW, padTop, pW, pH, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fca5a5'; ctx.font = 'bold 12px uppercase sans-serif';
      ctx.fillText(`${t('torque')} (${t('right_object')})`, w - 30 - pW + 15, padTop + 25);
      ctx.fillStyle = '#fff'; ctx.font = '28px monospace'; ctx.fillText(t2.toFixed(1), w - 30 - pW + 15, padTop + 55); ctx.font = '14px sans-serif'; ctx.fillText("Nm", w - 55, padTop + 55);
      
      const isBalanced = Math.abs(angleRef.current) < 0.01 && Math.abs(angularVelRef.current) < 0.001;
      const statusText = isBalanced ? t('equilibrium') : (netTorque > 0 ? t('rotating_cw') : (netTorque < 0 ? t('rotating_ccw') : t('balanced')));
      ctx.textAlign = 'center'; ctx.font = 'bold 20px sans-serif'; ctx.fillStyle = isBalanced ? '#4ade80' : '#facc15';
      ctx.shadowColor = 'black'; ctx.shadowBlur = 4; ctx.fillText(statusText, cx, h - 30); ctx.shadowBlur = 0;
  };
  
  const animate = () => { draw(); requestRef.current = requestAnimationFrame(animate); };
  useEffect(() => { requestRef.current = requestAnimationFrame(animate); return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); }; }, [m1, d1, m2, d2, t]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas ref={canvasRef} width={1000} height={600} className="absolute inset-0 w-full h-full object-contain" />

        {/* CONTROLS */}
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 w-[90%] md:w-[600px]`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <button onClick={() => setShowControls(!showControls)} className="w-full p-2 flex items-center justify-center text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                    {showControls ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
                </button>

                {showControls && (
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-blue-400 font-bold uppercase text-xs flex items-center gap-2"><Scale size={16}/> {t('left_object')}</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>Mass</span><span>{m1} kg</span></div>
                                <input type="range" min="1" max="20" value={m1} onChange={e => setM1(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>Pos</span><span>{d1}</span></div>
                                <input type="range" min="1" max="5" step="0.5" value={d1} onChange={e => setD1(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-red-400 font-bold uppercase text-xs flex items-center gap-2"><Scale size={16}/> {t('right_object')}</h3>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>Mass</span><span>{m2} kg</span></div>
                                <input type="range" min="1" max="20" value={m2} onChange={e => setM2(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-red-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>Pos</span><span>{d2}</span></div>
                                <input type="range" min="1" max="5" step="0.5" value={d2} onChange={e => setD2(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-red-500" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
