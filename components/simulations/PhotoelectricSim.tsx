
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Zap, Settings2, ChevronUp, ChevronDown } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

export const PhotoelectricSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [wavelength, setWavelength] = useState(400); 
  const [intensity, setIntensity] = useState(50); 
  const [voltage, setVoltage] = useState(0); 
  const [metal, setMetal] = useState<'sodium' | 'zinc' | 'copper' | 'platinum'>('sodium');
  const [showControls, setShowControls] = useState(true);

  const METALS = { sodium: { name: 'sodium', wf: 2.36, color: '#fcd34d' }, zinc: { name: 'zinc', wf: 4.3, color: '#94a3b8' }, copper: { name: 'copper', wf: 4.7, color: '#fb923c' }, platinum: { name: 'platinum', wf: 6.35, color: '#cbd5e1' } };
  const currentMetal = METALS[metal];
  const photonE = 1240 / wavelength; 
  const keMax = photonE - currentMetal.wf; 
  
  const electronsRef = useRef<{x:number, y:number, vx:number, vy:number, stopped: boolean}[]>([]);
  const photonsRef = useRef<{x:number, y:number, t:number}[]>([]);
  const requestRef = useRef<number | null>(null);
  const ammeterRef = useRef(0);

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width; const h = canvas.height;
      ctx.clearRect(0,0,w,h); ctx.fillStyle = '#0f172a'; ctx.fillRect(0,0,w,h);
      
      const tubeX = 100; const tubeY = 100; const tubeW = w - 200; const tubeH = 250;
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(w/2, tubeY + tubeH/2, tubeW/2 + 20, tubeH/2 + 20, 0, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = currentMetal.color; ctx.fillRect(tubeX + 20, tubeY + 40, 20, tubeH - 80);
      ctx.fillStyle = '#fff'; ctx.font='12px sans-serif'; ctx.fillText(t(currentMetal.name), tubeX, tubeY + 30);
      ctx.fillStyle = '#64748b'; ctx.fillRect(tubeX + tubeW - 40, tubeY + 80, 10, tubeH - 160); ctx.fillText("Anode", tubeX + tubeW - 40, tubeY + 70);
      
      const wireY = h - 80;
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(tubeX + 30, tubeY + tubeH/2); ctx.lineTo(tubeX + 30, wireY); ctx.lineTo(w/2 - 50, wireY);
      ctx.moveTo(tubeX + tubeW - 35, tubeY + tubeH/2); ctx.lineTo(tubeX + tubeW - 35, wireY); ctx.lineTo(w/2 + 50, wireY); ctx.stroke();
      
      const batX = w/2; const batY = wireY;
      ctx.fillStyle = '#1e293b'; ctx.fillRect(batX - 40, batY - 20, 80, 40);
      ctx.strokeStyle = voltage >= 0 ? '#4ade80' : '#f87171'; ctx.lineWidth = 3;
      const rH = voltage >= 0 ? 30 : 15; const lH = voltage >= 0 ? 15 : 30;
      ctx.beginPath(); ctx.moveTo(batX+10, batY-rH/2); ctx.lineTo(batX+10, batY+rH/2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(batX-10, batY-lH/2); ctx.lineTo(batX-10, batY+lH/2); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(`${voltage.toFixed(1)}V`, batX, batY + 35);
      
      const amX = tubeX + tubeW - 35; const amY = (tubeY + tubeH/2 + wireY)/2;
      ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(amX, amY, 25, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#38bdf8'; ctx.font='bold 14px monospace';
      const currentI = electronsRef.current.filter(e => e.x > tubeX + tubeW - 50).length;
      ammeterRef.current = ammeterRef.current * 0.9 + (currentI * 0.5) * 0.1; 
      ctx.fillText(`${ammeterRef.current.toFixed(1)}μA`, amX, amY + 5);

      const hue = 280 - ((wavelength - 200) / 600) * 280; const lightColor = `hsl(${hue}, 100%, 70%)`;
      ctx.shadowBlur = 20; ctx.shadowColor = lightColor; ctx.fillStyle = lightColor; ctx.beginPath(); ctx.arc(tubeX - 40, tubeY - 20, 15, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
      
      ctx.strokeStyle = lightColor; ctx.lineWidth = 2;
      photonsRef.current.forEach(p => {
          ctx.beginPath(); for(let i=0; i<20; i++) { const wx = p.x + i; const wy = p.y + Math.sin((i + p.t)*0.5) * 5; if (i===0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy); } ctx.stroke();
      });
      electronsRef.current.forEach(e => { ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI*2); ctx.fill(); });
  };

  const animate = () => {
      if (Math.random() < intensity * 0.005) { photonsRef.current.push({ x: 80, y: 150 + Math.random() * 150, t: 0 }); }
      const photonSpeed = 8; let hits = 0; const hitY: number[] = [];
      const nextPhotons: any[] = [];
      photonsRef.current.forEach(p => {
          p.x += photonSpeed * 0.7; p.y += photonSpeed * 0.3; p.t += 1;
          if (p.x > 120 && p.x < 140 && p.y > 140 && p.y < 350) { hits++; hitY.push(p.y); } else if (p.x < 800 && p.y < 500) { nextPhotons.push(p); }
      });
      photonsRef.current = nextPhotons;
      
      if (hits > 0 && keMax > 0) { for(let i=0; i<hits; i++) { const vMag = Math.sqrt(keMax) * 3; electronsRef.current.push({ x: 140, y: hitY[i], vx: vMag * (0.8 + Math.random()*0.4), vy: (Math.random()-0.5) * 2, stopped: false }); } }
      
      const nextElec: any[] = [];
      electronsRef.current.forEach(e => {
          const ax = voltage * 0.2; e.vx += ax; e.x += e.vx; e.y += e.vy;
          const anodeX_real = canvasRef.current!.width - 140;
          if (e.x >= anodeX_real) {} else if (e.x < 140 && e.vx < 0) {} else { nextElec.push(e); }
      });
      electronsRef.current = nextElec;
      
      draw();
      requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => { requestRef.current = requestAnimationFrame(animate); return () => { if(requestRef.current) cancelAnimationFrame(requestRef.current); }; }, [wavelength, intensity, voltage, metal]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
        <canvas ref={canvasRef} width={800} height={500} className="absolute inset-0 w-full h-full object-contain" />
        
        {/* DATA PANEL */}
        <div className="absolute top-4 right-4 w-64 bg-slate-900/90 backdrop-blur rounded-xl border border-slate-600 p-4 shadow-xl pointer-events-none">
             <div className="text-center border-b border-slate-700 pb-2 mb-2">
                  <div className="text-xs font-bold text-slate-400 uppercase">{t('target_metal')}: {t(currentMetal.name)}</div>
                  <div className="text-xs text-slate-500">Φ = {currentMetal.wf} eV</div>
             </div>
             <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400"><span>{t('photon_energy')}</span><span className="text-white">{photonE.toFixed(2)} eV</span></div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full" style={{ width: `${Math.min(100, photonE*10)}%` }}></div></div>
                  <div className="flex justify-between text-xs text-slate-400 mt-2"><span>{t('max_ke')}</span><span className={keMax > 0 ? "text-green-400" : "text-red-400"}>{keMax > 0 ? keMax.toFixed(2) : '0.00'} eV</span></div>
                  {keMax <= 0 && (<div className="bg-red-500/20 text-red-400 text-[10px] p-1 rounded text-center font-bold border border-red-500/30">{t('no_emission')}</div>)}
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
                            <div className="flex gap-2 justify-center pointer-events-auto">
                                {Object.keys(METALS).map(m => (
                                    <button key={m} onClick={() => setMetal(m as any)} className={`w-8 h-8 rounded-full border-2 transition-all ${metal===m ? 'border-blue-500 scale-110' : 'border-transparent opacity-50'}`} style={{ backgroundColor: METALS[m as keyof typeof METALS].color }} title={t(METALS[m as keyof typeof METALS].name)} />
                                ))}
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('wavelength')} (λ)</span><span className="font-mono text-lg" style={{ color: `hsl(${280 - ((wavelength - 200) / 600) * 280}, 100%, 70%)` }}>{wavelength} nm</span></div>
                                <input type="range" min="200" max="800" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('stopping_voltage')}</span><span className="font-mono text-green-400">{voltage.toFixed(1)} V</span></div>
                                <input type="range" min="-5" max="5" step="0.1" value={voltage} onChange={e => setVoltage(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-slate-300"><span>{t('intensity')}</span><span className="font-mono text-yellow-400">{intensity}%</span></div>
                                <input type="range" min="0" max="100" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};
