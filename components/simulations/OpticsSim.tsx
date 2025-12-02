import React, { useState, useEffect, useRef } from 'react';

export const OpticsSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [n1, setN1] = useState(1.00); // Air
  const [n2, setN2] = useState(1.50); // Glass
  const [angleIncidence, setAngleIncidence] = useState(45);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Medium 1 (Top)
    ctx.fillStyle = '#0f172a'; // Dark Air
    ctx.fillRect(0, 0, width, centerY);

    // Draw Medium 2 (Bottom)
    // Opacity based on refractive index to simulate density visually
    const density = (n2 - 1) * 0.5; 
    ctx.fillStyle = `rgba(59, 130, 246, ${0.2 + density})`; // Blue glass tint
    ctx.fillRect(0, centerY, width, centerY);

    // Normal Line
    ctx.beginPath();
    ctx.strokeStyle = '#64748b';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Interface Line
    ctx.beginPath();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Calculations (Snell's Law: n1 * sin(theta1) = n2 * sin(theta2))
    const rad1 = (angleIncidence * Math.PI) / 180;
    // Critical angle check for total internal reflection if going dense -> rare
    let rad2 = 0;
    let tir = false;

    if (n1 > n2) {
        const crit = Math.asin(n2/n1);
        if (rad1 > crit) {
            tir = true;
            rad2 = rad1; // Reflection angle equals incidence
        } else {
            rad2 = Math.asin((n1 * Math.sin(rad1)) / n2);
        }
    } else {
        rad2 = Math.asin((n1 * Math.sin(rad1)) / n2);
    }

    const length = 300;

    // Draw Incident Ray
    ctx.beginPath();
    ctx.strokeStyle = '#ef4444'; // Red laser
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ef4444';
    
    // Start point
    const startX = centerX - length * Math.sin(rad1);
    const startY = centerY - length * Math.cos(rad1);
    
    ctx.moveTo(startX, startY);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Draw Refracted/Reflected Ray
    ctx.beginPath();
    const endX = tir 
        ? centerX + length * Math.sin(rad2) // Reflection goes back up X
        : centerX + length * Math.sin(rad2);
    
    const endY = tir
        ? centerY - length * Math.cos(rad2) // Reflection goes back up Y (negative)
        : centerY + length * Math.cos(rad2); // Refraction continues down Y (positive)

    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Angle Arcs
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1;
    
    // Incidence Angle Arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, -Math.PI/2 - rad1, -Math.PI/2);
    ctx.stroke();

    // Refraction Angle Arc
    if (!tir) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, Math.PI/2, Math.PI/2 + rad2);
        ctx.stroke();
    }
  };

  useEffect(() => {
    draw();
  }, [n1, n2, angleIncidence]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative flex-grow bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
         <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain"
        />
        <div className="absolute top-4 left-4 text-slate-400 text-xs font-mono bg-slate-900/80 p-2 rounded">
            n1: Medium 1 (Top)<br/>
            n2: Medium 2 (Bottom)
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400">Index n1 (Incident)</label>
            <input 
              type="range" 
              min="1.0" 
              max="2.5" 
              step="0.01"
              value={n1} 
              onChange={(e) => setN1(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right font-mono text-blue-400">{n1.toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400">Index n2 (Refracted)</label>
            <input 
              type="range" 
              min="1.0" 
              max="2.5" 
              step="0.01"
              value={n2} 
              onChange={(e) => setN2(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
             <div className="text-right font-mono text-blue-400">{n2.toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400">Angle of Incidence</label>
            <input 
              type="range" 
              min="0" 
              max="89" 
              value={angleIncidence} 
              onChange={(e) => setAngleIncidence(Number(e.target.value))}
              className="w-full accent-red-500 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
            />
             <div className="text-right font-mono text-red-400">{angleIncidence}°</div>
          </div>
      </div>
    </div>
  );
};