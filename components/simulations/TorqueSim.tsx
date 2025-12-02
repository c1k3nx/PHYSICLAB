
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Scale } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const TorqueSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  
  const [m1, setM1] = useState(5);
  const [d1, setD1] = useState(4); // Distance left
  const [m2, setM2] = useState(5);
  const [d2, setD2] = useState(4); // Distance right
  
  // Physics State for animation
  const angleRef = useRef(0);
  const angularVelRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      
      const cx = w/2;
      const cy = 220; 
      
      // Clear
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 600);
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0,0,w,h);
      
      // Floor
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, h-40, w, 40);

      // --- Physics Update (Damped Harmonic Oscillator) ---
      const t1 = m1 * d1 * 9.8; 
      const t2 = m2 * d2 * 9.8;
      const netTorque = t2 - t1; // CW is positive
      
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

      // --- Draw Stand ---
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 80, h - 40);
      ctx.lineTo(cx + 80, h - 40);
      ctx.fill();
      
      // Protractor Background
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 100, Math.PI, 2*Math.PI); ctx.stroke();
      
      // Pivot Circle
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI*2); ctx.fillStyle='#94a3b8'; ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleRef.current);
      
      // --- Metallic Beam ---
      const beamLen = 600;
      const beamH = 16;
      
      const beamGrad = ctx.createLinearGradient(0, -beamH/2, 0, beamH/2);
      beamGrad.addColorStop(0, '#cbd5e1');
      beamGrad.addColorStop(0.5, '#f1f5f9');
      beamGrad.addColorStop(1, '#94a3b8');
      
      ctx.fillStyle = beamGrad;
      ctx.shadowColor = 'black'; ctx.shadowBlur = 10;
      ctx.beginPath(); 
      ctx.roundRect(-beamLen/2, -beamH/2, beamLen, beamH, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Ruler Markings
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      const step = (beamLen/2) / 6;
      
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      
      for(let i=1; i<=5; i++) {
          ctx.beginPath(); ctx.moveTo(-i*step, -beamH/2); ctx.lineTo(-i*step, 0); ctx.stroke();
          ctx.fillText(i.toString(), -i*step, 12);
          ctx.beginPath(); ctx.moveTo(i*step, -beamH/2); ctx.lineTo(i*step, 0); ctx.stroke();
          ctx.fillText(i.toString(), i*step, 12);
      }
      
      // --- Masses (Hanging Weights) ---
      const drawWeight = (x: number, m: number, color: string) => {
          ctx.save();
          ctx.translate(x, beamH/2);
          ctx.rotate(-angleRef.current); // Keep vertical
          
          ctx.strokeStyle = '#94a3b8'; ctx.lineWidth=2;
          ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0, 40); ctx.stroke();
          
          const size = 30 + m * 2;
          const grad = ctx.createLinearGradient(-size/2, 0, size/2, 0);
          grad.addColorStop(0, color);
          grad.addColorStop(0.4, '#fff');
          grad.addColorStop(1, color);
          ctx.fillStyle = grad;
          
          ctx.beginPath();
          ctx.moveTo(-size/2, 40); 
          ctx.lineTo(size/2, 40);
          ctx.lineTo(size/2, 40 + size * 0.8);
          ctx.quadraticCurveTo(0, 40 + size, -size/2, 40 + size*0.8);
          ctx.closePath();
          ctx.fill();
          
          ctx.fillStyle = '#000';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`${m}kg`, 0, 40 + size/2);
          
          ctx.restore();
      };
      
      drawWeight(-d1 * step, m1, '#3b82f6'); // Left Blue
      drawWeight(d2 * step, m2, '#ef4444'); // Right Red

      ctx.restore();
      
      // --- HUD Data Panels (High Contrast) ---
      ctx.fillStyle = 'rgba(30, 58, 138, 0.9)'; // Dark Blue
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      const pW = 160;
      const pH = 70;
      const padTop = 30;
      
      // Left Top
      ctx.beginPath(); ctx.roundRect(20, padTop, pW, pH, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#93c5fd'; ctx.font = 'bold 12px uppercase sans-serif'; ctx.textAlign = 'left';
      ctx.fillText(`${t('torque')} (${t('left_object')})`, 35, padTop + 25);
      ctx.fillStyle = '#fff'; ctx.font = '28px monospace';
      ctx.fillText(t1.toFixed(1), 35, padTop + 55);
      ctx.font = '14px sans-serif'; ctx.fillText("Nm", 130, padTop + 55);

      // Right Top
      ctx.fillStyle = 'rgba(127, 29, 29, 0.9)'; // Dark Red
      ctx.strokeStyle = '#f87171';
      ctx.beginPath(); ctx.roundRect(w - 20 - pW, padTop, pW, pH, 10); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#fca5a5'; ctx.font = 'bold 12px uppercase sans-serif';
      ctx.fillText(`${t('torque')} (${t('right_object')})`, w - 20 - pW + 15, padTop + 25);
      ctx.fillStyle = '#fff'; ctx.font = '28px monospace';
      ctx.fillText(t2.toFixed(1), w - 20 - pW + 15, padTop + 55);
      ctx.font = '14px sans-serif'; ctx.fillText("Nm", w - 45, padTop + 55);
      
      // Status Center Bottom
      const isBalanced = Math.abs(angleRef.current) < 0.01 && Math.abs(angularVelRef.current) < 0.001;
      const statusText = isBalanced ? t('equilibrium') : (netTorque > 0 ? t('rotating_cw') : (netTorque < 0 ? t('rotating_ccw') : t('balanced')));
      
      ctx.textAlign = 'center';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = isBalanced ? '#4ade80' : '#facc15';
      ctx.shadowColor = 'black'; ctx.shadowBlur = 4;
      ctx.fillText(statusText, cx, h - 20);
      ctx.shadowBlur = 0;
  };
  
  const animate = () => {
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [m1, d1, m2, d2, t]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
         <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain" />
      </div>
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl">
           {/* Left Controls */}
           <div className="space-y-4 border-r border-slate-600 pr-4">
               <h3 className="text-blue-400 font-bold uppercase text-xs flex items-center gap-2"><Scale size={16}/> {t('left_object')}</h3>
               <div className="space-y-1">
                   <label className="text-xs text-slate-400">{t('mass')} (kg)</label>
                   <input type="range" min="1" max="20" value={m1} onChange={e => setM1(Number(e.target.value))} className="w-full accent-blue-500" />
                   <div className="text-right text-xs font-mono text-blue-300">{m1} kg</div>
               </div>
               <div className="space-y-1">
                   <label className="text-xs text-slate-400">{t('position')}</label>
                   <input type="range" min="1" max="5" step="0.5" value={d1} onChange={e => setD1(Number(e.target.value))} className="w-full accent-blue-500" />
                   <div className="text-right text-xs font-mono text-blue-300">Pos {d1}</div>
               </div>
           </div>
           
           {/* Right Controls */}
           <div className="space-y-4">
               <h3 className="text-red-400 font-bold uppercase text-xs flex items-center gap-2"><Scale size={16}/> {t('right_object')}</h3>
               <div className="space-y-1">
                   <label className="text-xs text-slate-400">{t('mass')} (kg)</label>
                   <input type="range" min="1" max="20" value={m2} onChange={e => setM2(Number(e.target.value))} className="w-full accent-red-500" />
                   <div className="text-right text-xs font-mono text-red-300">{m2} kg</div>
               </div>
               <div className="space-y-1">
                   <label className="text-xs text-slate-400">{t('position')}</label>
                   <input type="range" min="1" max="5" step="0.5" value={d2} onChange={e => setD2(Number(e.target.value))} className="w-full accent-red-500" />
                   <div className="text-right text-xs font-mono text-red-300">Pos {d2}</div>
               </div>
           </div>
      </div>
     </div>
  );
};
