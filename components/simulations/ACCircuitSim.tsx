
import React, { useState, useEffect, useRef } from 'react';
import { Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const ACCircuitSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [freq, setFreq] = useState(0.5); 
  const [R, setR] = useState(30);
  const [L, setL] = useState(0.8); 
  const [C, setC] = useState(0.008); 
  const [showControls, setShowControls] = useState(true);
  
  const timeRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0,0,w,h);
      
      const omega = 2 * Math.PI * freq;
      const XL = omega * L * 50; const XC = 1 / (omega * C * 0.05); 
      const Z = Math.sqrt(R*R + (XL - XC)**2);
      const phase = Math.atan2(XL - XC, R);
      const V_max = 60; const I_max = (V_max / Math.max(Z, 10)) * 50;
      const t_val = timeRef.current;
      const I_inst = I_max * Math.sin(omega * t_val - phase);
      
      const cx = w * 0.35; const cy = h * 0.4; const boxW = 220; const boxH = 150;
      const left = cx - boxW/2; const right = cx + boxW/2; const top = cy - boxH/2; const bot = cy + boxH/2;

      ctx.save();
      ctx.fillStyle = '#1e293b'; ctx.fillRect(left - 30, top - 40, boxW + 60, boxH + 80);
      ctx.strokeStyle = '#334155'; ctx.strokeRect(left - 30, top - 40, boxW + 60, boxH + 80);
      ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(t('series_rlc'), cx, top - 25);

      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(left, bot); ctx.lineTo(left, top); ctx.lineTo(right, top); ctx.lineTo(right, bot); ctx.lineTo(left, bot); ctx.stroke();

      const sourceY = (top+bot)/2;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(left-15, sourceY-15, 30, 30);
      ctx.beginPath(); ctx.arc(left, sourceY, 15, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(left-8, sourceY); ctx.quadraticCurveTo(left-4, sourceY-8, left, sourceY); ctx.quadraticCurveTo(left+4, sourceY+8, left+8, sourceY); ctx.stroke();
      ctx.fillStyle = '#ef4444'; ctx.textAlign='right'; ctx.fillText("~V(t)", left-20, sourceY);
      
      const rX = cx; 
      ctx.fillStyle = '#1e293b'; ctx.fillRect(rX-20, top-10, 40, 20);
      ctx.beginPath(); ctx.moveTo(rX-20, top); for(let i=0; i<4; i++) { ctx.lineTo(rX-15 + i*10, top-8); ctx.lineTo(rX-10 + i*10, top+8); } ctx.lineTo(rX+20, top); ctx.stroke();
      ctx.fillStyle = '#facc15'; ctx.textAlign='center'; ctx.fillText("R", rX, top-15);

      const lY = (top+bot)/2;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(right-15, lY-20, 30, 40);
      ctx.beginPath(); for(let i=0; i<4; i++) { ctx.arc(right, lY-15 + i*10, 5, -Math.PI/2, Math.PI/2, false); } ctx.stroke();
      ctx.fillStyle = '#3b82f6'; ctx.textAlign='left'; ctx.fillText("L", right+15, lY);

      const cX = cx;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(cX-15, bot-15, 30, 30);
      ctx.beginPath(); ctx.moveTo(cX-5, bot-10); ctx.lineTo(cX-5, bot+10); ctx.stroke(); 
      ctx.beginPath(); ctx.moveTo(cX+5, bot-10); ctx.lineTo(cX+5, bot+10); ctx.stroke(); 
      ctx.fillStyle = '#ef4444'; ctx.textAlign='center'; ctx.fillText("C", cX, bot+25);
      
      if (Math.abs(I_inst) > 1) {
          const pathLen = 2 * (boxW + boxH); const dots = 12; const flowSpeed = timeRef.current * 80;
          ctx.fillStyle = '#fff';
          for(let i=0; i<dots; i++) {
              let pos = (i * (pathLen/dots) + (I_inst > 0 ? flowSpeed : -flowSpeed)) % pathLen;
              if (pos < 0) pos += pathLen;
              let dx = 0, dy = 0;
              if (pos < boxH) { dx = left; dy = bot - pos; } 
              else if (pos < boxH + boxW) { dx = left + (pos-boxH); dy = top; } 
              else if (pos < 2*boxH + boxW) { dx = right; dy = top + (pos-(boxH+boxW)); } 
              else { dx = right - (pos-(2*boxH+boxW)); dy = bot; } 
              ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI*2); ctx.fill();
          }
      }
      ctx.restore();

      const pCx = w * 0.8; const pCy = h * 0.4; const pR_len = 80;
      ctx.strokeStyle = '#334155'; ctx.beginPath(); ctx.arc(pCx, pCy, pR_len, 0, Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pCx-pR_len, pCy); ctx.lineTo(pCx+pR_len, pCy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pCx, pCy-pR_len); ctx.lineTo(pCx, pCy+pR_len); ctx.stroke();
      ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'; ctx.fillText(t('phasor'), pCx, pCy - pR_len - 10);
      
      const angV = omega * t_val;
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(pCx, pCy); ctx.lineTo(pCx + Math.cos(angV)*60, pCy + Math.sin(angV)*60); ctx.stroke();
      ctx.fillStyle='#ef4444'; ctx.fillText("V", pCx + Math.cos(angV)*70, pCy + Math.sin(angV)*70);

      const angI = omega * t_val - phase;
      ctx.strokeStyle = '#3b82f6'; ctx.beginPath(); ctx.moveTo(pCx, pCy); ctx.lineTo(pCx + Math.cos(angI)*50, pCy + Math.sin(angI)*50); ctx.stroke();
      ctx.fillStyle='#3b82f6'; ctx.fillText("I", pCx + Math.cos(angI)*60, pCy + Math.sin(angI)*60);
      ctx.fillStyle = '#fff'; const phaseDeg = (phase * 180 / Math.PI).toFixed(0); ctx.fillText(`${t('phase')} φ: ${phaseDeg}°`, pCx, pCy + pR_len + 20);

      const gx = 50; const gy = h - 50; const gw = w - 100; const gh = 100;
      ctx.strokeStyle = '#475569'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx, gy-gh); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, gy - gh/2); ctx.lineTo(gx+gw, gy - gh/2); ctx.stroke();
      ctx.lineWidth=2;
      ctx.beginPath(); ctx.strokeStyle='#ef4444';
      for(let x=0; x<gw; x++) {
          const simT = t_val - (gw-x)*0.01; const val = 30 * Math.sin(omega * simT); const py = (gy - gh/2) - val;
          if (x===0) ctx.moveTo(gx+x, py); else ctx.lineTo(gx+x, py);
      }
      ctx.stroke();
      ctx.beginPath(); ctx.strokeStyle='#3b82f6';
      for(let x=0; x<gw; x++) {
          const simT = t_val - (gw-x)*0.01; const val = 20 * Math.sin(omega * simT - phase); const py = (gy - gh/2) - val;
          if (x===0) ctx.moveTo(gx+x, py); else ctx.lineTo(gx+x, py);
      }
      ctx.stroke();
      ctx.font = '10px sans-serif'; ctx.fillStyle = '#ef4444'; ctx.fillText(`${t('voltage')} (V)`, gx + 10, gy - gh - 5);
      ctx.fillStyle = '#3b82f6'; ctx.fillText(`${t('current')} (I)`, gx + 80, gy - gh - 5);
  };
  
  const animate = () => { timeRef.current += 0.05; draw(); requestRef.current = requestAnimationFrame(animate); };
  useEffect(() => { requestRef.current = requestAnimationFrame(animate); return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); }; }, [freq, R, L, C, t]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
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
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('frequency')}</span><span>{freq} Hz</span></div>
                                <input type="range" min="0.1" max="2" step="0.1" value={freq} onChange={e => setFreq(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-white"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('resistance')} (R)</span><span className="text-yellow-400">{R} Ω</span></div>
                                <input type="range" min="10" max="100" value={R} onChange={e => setR(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-yellow-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('inductance')} (L)</span><span className="text-blue-400">{L} H</span></div>
                                <input type="range" min="0.1" max="2" step="0.1" value={L} onChange={e => setL(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500"/>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('capacitance')} (C)</span><span className="text-red-400">{C} F</span></div>
                                <input type="range" min="0.001" max="0.02" step="0.001" value={C} onChange={e => setC(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg accent-red-500"/>
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
