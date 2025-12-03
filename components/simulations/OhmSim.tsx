
import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Battery, Zap, Lightbulb, RotateCw, MousePointer2, Activity, Gauge, CheckCircle, HelpCircle, X, AlertTriangle, Flame, Disc, Settings2, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { useGlobal } from '../../contexts/GlobalContext';

type ComponentType = 'wire' | 'resistor' | 'bulb' | 'battery' | 'switch' | 'voltmeter' | 'ammeter' | 'ohmmeter';
interface Node { id: string; x: number; y: number; v: number; }
interface Component { id: string; type: ComponentType; n1: string; n2: string; value: number; isOpen?: boolean; isBroken?: boolean; }

export const OhmSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useGlobal();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [comps, setComps] = useState<Component[]>([]);
  const [selectedTool, setSelectedTool] = useState<ComponentType | 'select'>('select');
  const [selection, setSelection] = useState<string | null>(null);
  const mountedRef = useRef(true);
  
  const [tutorialStep, setTutorialStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Physics state & Solver logic
  const [probes, setProbes] = useState<{red: {x:number, y:number, nodeId?:string}, black: {x:number, y:number, nodeId?:string}}>({ red: {x: 600, y: 100}, black: {x: 600, y: 200} });
  const [activeProbe, setActiveProbe] = useState<'red' | 'black' | null>(null);
  const [dragStartNode, setDragStartNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({x:0, y:0});
  const electronOffset = useRef(0);
  const GRID = 40;
  
  const [ammeterReading, setAmmeterReading] = useState<number | null>(null);
  const [ammeterPos, setAmmeterPos] = useState({x:0, y:0});
  const [ohmmeterReading, setOhmmeterReading] = useState<string | null>(null);
  const [ohmmeterPos, setOhmmeterPos] = useState({x:0, y:0});

  const [isShortCircuit, setIsShortCircuit] = useState(false);
  const [isOverheating, setIsOverheating] = useState(false);
  const [kirchhoffData, setKirchhoffData] = useState<{totalSourceV: number, totalDropV: number, powerGen: number, powerCons: number}>({ totalSourceV: 0, totalDropV: 0, powerGen: 0, powerCons: 0 });

  const getMousePos = (e: React.MouseEvent) => {
      const canvas = canvasRef.current; if (!canvas) return {x:0, y:0};
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  useEffect(() => { 
      mountedRef.current = true;
      if (showTutorial) { 
          if (tutorialStep === 2 && comps.some(c => c.type === 'battery')) { setTutorialStep(3); } 
          if (tutorialStep === 4 && comps.length > 2) { setTutorialStep(5); } 
      }
      return () => { mountedRef.current = false; };
  }, [comps, tutorialStep, showTutorial]);
  
  // Solver Effect
  useEffect(() => { 
      const interval = setInterval(() => { if (mountedRef.current) solveCircuit(); }, 50); 
      return () => clearInterval(interval); 
  }, [nodes, comps]); 

  const solveCircuit = () => {
      const battery = comps.find(c => c.type === 'battery');
      const groundId = battery ? battery.n2 : nodes[0]?.id;
      const newV = new Map<string, number>();
      nodes.forEach(n => newV.set(n.id, n.v));
      
      if (!groundId) { setIsShortCircuit(false); setIsOverheating(false); return; }
      
      for(let i=0; i<100; i++) {
          newV.set(groundId, 0); 
          comps.filter(c => c.type === 'battery').forEach(b => { if (b.n2 === groundId) newV.set(b.n1, b.value); else if (b.n1 === groundId) newV.set(b.n2, -b.value); });
          nodes.forEach(n => {
              if (n.id === groundId) return;
              const bat = comps.find(c => c.type === 'battery' && (c.n1 === n.id || c.n2 === n.id));
              if (bat) { const other = bat.n1 === n.id ? bat.n2 : bat.n1; if (other === groundId) return; const val = bat.n1 === n.id ? bat.value : -bat.value; newV.set(n.id, (newV.get(other)||0) + val); return; }
              let num = 0, den = 0; den += 0.0001; 
              comps.forEach(c => {
                  if (c.n1 !== n.id && c.n2 !== n.id) return;
                  if ((c.type === 'switch' && c.isOpen) || c.isBroken) return;
                  const otherId = c.n1 === n.id ? c.n2 : c.n1; const vOther = newV.get(otherId) || 0;
                  let g = 0; if (c.type === 'wire' || c.type === 'switch') g = 1000; else if (c.type === 'resistor' || c.type === 'bulb') g = 1 / c.value; else if (c.type === 'battery') g = 0; 
                  num += vOther * g; den += g;
              });
              if (den > 0) newV.set(n.id, num/den);
          });
      }
      
      let changed = false;
      const updatedNodes = nodes.map(n => {
          const v = newV.get(n.id) || 0;
          if (Math.abs(n.v - v) > 0.01) changed = true;
          return {...n, v};
      });
      if (changed && mountedRef.current) setNodes(updatedNodes);

      let tSourceV = 0; let tDropV = 0; let pGen = 0; let pCons = 0; let hasCurrent = false; let maxCurrent = 0; let overheating = false;
      const POWER_LIMIT = 400; 
      const brokenIds: string[] = [];

      comps.forEach(c => {
          if ((c.type === 'switch' && c.isOpen) || c.isBroken) return;
          const n1 = newV.get(c.n1) || 0; const n2 = newV.get(c.n2) || 0; const vDiff = Math.abs(n1 - n2);
          
          if (c.type === 'battery') { tSourceV += c.value; } 
          else if (c.type === 'resistor' || c.type === 'bulb') {
              const i = vDiff / c.value; const power = vDiff * i; tDropV += vDiff; pCons += power; if (i > 0.01) hasCurrent = true;
              if (power > 50) overheating = true; 
              if (power > POWER_LIMIT) brokenIds.push(c.id);
          } else if (c.type === 'wire' || c.type === 'switch') { const i = vDiff / 0.001; if (i > maxCurrent) maxCurrent = i; }
      });
      
      if (brokenIds.length > 0 && mountedRef.current) {
          const newlyBroken = brokenIds.some(bid => {
              const c = comps.find(comp => comp.id === bid);
              return c && !c.isBroken;
          });
          if (newlyBroken) {
              setComps(prev => prev.map(c => brokenIds.includes(c.id) ? { ...c, isBroken: true } : c));
          }
      }

      const shorted = maxCurrent > 100; 
      if (mountedRef.current) {
          setIsShortCircuit(shorted); setIsOverheating(overheating);
          pGen = shorted ? 9999 : pCons;
          setKirchhoffData({ totalSourceV: tSourceV, totalDropV: tDropV, powerGen: pGen, powerCons: pCons });
          if (showTutorial && tutorialStep === 5 && hasCurrent && !shorted) setTutorialStep(6);
      }
  };

  const getSelectedPhysics = () => {
      if (!selection) return null;
      const c = comps.find(comp => comp.id === selection); if (!c) return null;
      if ((c.type === 'switch' && c.isOpen) || c.isBroken) return { vDrop: 0, current: 0, power: 0, resistance: Infinity, type: c.type, isBroken: c.isBroken };
      const n1 = nodes.find(n => n.id === c.n1); const n2 = nodes.find(n => n.id === c.n2); if (!n1 || !n2) return null;
      const vDrop = Math.abs(n1.v - n2.v);
      let current = 0; let power = 0; let resistance = c.value;
      if (c.type === 'wire' || c.type === 'switch') { resistance = 0.001; current = vDrop / resistance; } 
      else if (c.type === 'battery') { resistance = 0; if (isShortCircuit) current = 9999; } 
      else { current = vDrop / c.value; power = vDrop * current; }
      return { vDrop, current, power, resistance, type: c.type, isBroken: false };
  };

  const draw = () => {
      const canvas = canvasRef.current; if (!canvas) return;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      ctx.clearRect(0,0, canvas.width, canvas.height);
      ctx.fillStyle = '#1e293b';
      for(let x=0; x<canvas.width; x+=GRID) { for(let y=0; y<canvas.height; y+=GRID) { ctx.beginPath(); ctx.arc(x,y, 1, 0, Math.PI*2); ctx.fill(); } }

      comps.forEach(c => {
          const n1 = nodes.find(n => n.id === c.n1); const n2 = nodes.find(n => n.id === c.n2); if (!n1 || !n2) return;
          const cx = (n1.x + n2.x)/2; const cy = (n1.y + n2.y)/2;
          const len = Math.hypot(n2.x - n1.x, n2.y - n1.y); const angle = Math.atan2(n2.y - n1.y, n2.x - n1.x);
          ctx.save(); ctx.translate(cx, cy);
          if (c.type === 'battery' && isShortCircuit) ctx.translate((Math.random()-0.5)*5, (Math.random()-0.5)*5);
          ctx.rotate(angle);
          if (selection === c.id) { ctx.shadowColor = 'rgba(59, 130, 246, 0.8)'; ctx.shadowBlur = 15; }
          ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          const vDiff = Math.abs(n1.v - n2.v); const power = (!c.isOpen && !c.isBroken && c.value > 0) ? (vDiff*vDiff)/c.value : 0;

          if (c.type === 'wire') { if (isShortCircuit) ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(len/2, 0); ctx.stroke(); }
          else if (c.type === 'battery') {
              ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(-10, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(len/2, 0); ctx.stroke();
              ctx.strokeStyle = isShortCircuit ? '#ef4444' : '#4ade80'; if (isShortCircuit) { ctx.shadowColor='#ef4444'; ctx.shadowBlur=20; }
              ctx.beginPath(); ctx.lineWidth=4; ctx.moveTo(-6, -15); ctx.lineTo(-6, 15); ctx.stroke(); ctx.beginPath(); ctx.strokeStyle='#fff'; ctx.lineWidth=4; ctx.moveTo(6, -8); ctx.lineTo(6, 8); ctx.stroke();
          } 
          else if (c.type === 'resistor') {
              ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(-20, 0);
              if (c.isBroken) {
                  ctx.strokeStyle = '#1e293b'; ctx.lineTo(-15, -8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(15, 8); ctx.lineTo(20, 0); ctx.lineTo(len/2, 0); ctx.stroke();
                  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill();
              } else {
                  if (power > 50) { ctx.strokeStyle = power < 200 ? '#f97316' : '#ef4444'; ctx.shadowColor=ctx.strokeStyle; ctx.shadowBlur=(power-50)/10; }
                  for(let i=0; i<6; i++) { const x = -20 + (40/6)*i; const y = i%2===0 ? -8 : 8; ctx.lineTo(x + 3, y); }
                  ctx.lineTo(20, 0); ctx.lineTo(len/2, 0); ctx.stroke();
              }
          }
          else if (c.type === 'bulb') {
               ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(-15, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(len/2, 0); ctx.stroke();
               if(c.isBroken) { ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.beginPath(); ctx.arc(0,0,15,0,Math.PI*2); ctx.fill(); }
               else { 
                   if(power>0.1) { ctx.fillStyle=`rgba(250, 204, 21, ${Math.min(1, Math.sqrt(power)/5)})`; ctx.beginPath(); ctx.arc(0,0,15 + Math.min(1, Math.sqrt(power)/5)*40,0,Math.PI*2); ctx.fill(); }
                   ctx.fillStyle= power>0.1 ? '#facc15' : 'rgba(30,41,59,0.5)'; ctx.strokeStyle= power>0.1 ? '#facc15' : '#94a3b8'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,15,0,Math.PI*2); ctx.fill(); ctx.stroke();
               }
          }
          else if (c.type === 'switch') {
              ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(-15, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(15, 0); ctx.lineTo(len/2, 0); ctx.stroke();
              ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-15, 0, 3, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(15, 0, 3, 0, Math.PI*2); ctx.fill();
              ctx.beginPath(); ctx.lineWidth = 3; if (c.isOpen) { ctx.moveTo(-15, 0); ctx.lineTo(12, -15); } else { ctx.moveTo(-15, 0); ctx.lineTo(15, 0); } ctx.stroke();
          }

          const currentMag = Math.abs((n1.v - n2.v) / (c.type === 'wire' || c.type === 'switch' ? 0.01 : c.value));
          const visualCurrent = isShortCircuit ? 20 : Math.min(currentMag, 5);
          if (visualCurrent > 0.1 && (!c.isOpen) && (!c.isBroken)) {
              ctx.fillStyle = isShortCircuit ? '#ef4444' : '#facc15';
              const dir = Math.sign(n1.v - n2.v); const spacing = 20;
              const offset = (electronOffset.current * visualCurrent * dir) % spacing;
              for(let x = -len/2 + 5; x < len/2 - 5; x+=spacing) {
                  let px = x + offset; if (dir === 1 && px > len/2) px -= len; if (dir === -1 && px < -len/2) px += len;
                  if (c.type !== 'wire' && Math.abs(px) < 25) continue; 
                  ctx.beginPath(); ctx.arc(px, 0, isShortCircuit ? 3 : 2, 0, Math.PI*2); ctx.fill();
              }
          }
          if (isShortCircuit && c.type === 'battery') { ctx.fillStyle = `rgba(239, 68, 68, ${Math.random()})`; ctx.beginPath(); ctx.arc(-len/2, 0, Math.random()*10+5, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(len/2, 0, Math.random()*10+5, 0, Math.PI*2); ctx.fill(); }
          
          ctx.rotate(-angle); 
          ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign='center';
          if (c.type === 'resistor' || c.type === 'bulb') ctx.fillText(c.isBroken ? t('burnt') : `${c.value}Ω`, 0, -20);
          if (c.type === 'battery') { ctx.fillStyle = isShortCircuit ? '#ef4444' : '#4ade80'; ctx.fillText(`${c.value}V`, 0, -25); }
          ctx.restore();
      });

      nodes.forEach(n => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, Math.PI*2); ctx.fill(); });
      if (dragStartNode) { const start = nodes.find(n => n.id === dragStartNode); if (start) { const sx = Math.round(mousePos.x/GRID)*GRID; const sy = Math.round(mousePos.y/GRID)*GRID; ctx.strokeStyle = '#fff'; ctx.setLineDash([5,5]); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(sx, sy); ctx.stroke(); ctx.setLineDash([]); } }

      if (selectedTool === 'voltmeter') {
          const rNode = nodes.find(n => Math.hypot(n.x - probes.red.x, n.y - probes.red.y) < 20);
          const bNode = nodes.find(n => Math.hypot(n.x - probes.black.x, n.y - probes.black.y) < 20);
          let reading = (rNode && bNode) ? rNode.v - bNode.v : 0;
          
          const boxX = canvas.width - 150; const boxY = 50;
          ctx.fillStyle = '#1e293b'; ctx.fillRect(boxX, boxY, 120, 150); ctx.strokeStyle = '#facc15'; ctx.lineWidth=2; ctx.strokeRect(boxX, boxY, 120, 150);
          ctx.fillStyle = '#172554'; ctx.fillRect(boxX+10, boxY+10, 100, 40);
          ctx.fillStyle = '#fff'; ctx.font='bold 20px monospace'; ctx.textAlign='right'; ctx.fillText(`${reading.toFixed(2)} V`, boxX+105, boxY+38);

          const drawProbe = (pos: {x:number, y:number}, color: string) => {
              ctx.beginPath(); ctx.moveTo(boxX + 60, boxY + 150); ctx.bezierCurveTo(boxX+60, boxY+200, pos.x, pos.y+50, pos.x, pos.y); ctx.strokeStyle = color; ctx.lineWidth=3; ctx.stroke();
              ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(pos.x, pos.y); ctx.lineTo(pos.x-5, pos.y-30); ctx.lineTo(pos.x+5, pos.y-30); ctx.fill();
          };
          drawProbe(probes.red, '#ef4444'); drawProbe(probes.black, '#3b82f6');
      }
      
      if (selectedTool === 'ammeter' || selectedTool === 'ohmmeter') {
          const { x, y } = selectedTool === 'ammeter' ? ammeterPos : ohmmeterPos;
          const reading = selectedTool === 'ammeter' ? (isShortCircuit ? t('overload') : (ammeterReading!==null ? `${Math.abs(ammeterReading).toFixed(2)} A` : '--')) : (ohmmeterReading || '--');
          const color = selectedTool === 'ammeter' ? '#38bdf8' : '#a855f7';
          ctx.save(); ctx.shadowBlur = 10; ctx.shadowColor = color; ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI*2); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.translate(x + 25, y - 25); ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.roundRect(0, 0, 100, 50, 8); ctx.fill(); ctx.stroke();
          ctx.fillStyle = color; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(selectedTool === 'ammeter' ? t('current') : t('resistance'), 50, 18);
          ctx.fillStyle = '#fff'; ctx.font = 'bold 16px monospace'; ctx.fillText(reading, 50, 38); ctx.restore();
      }
  };

  const animate = () => { electronOffset.current += 1; draw(); requestAnimationFrame(animate); };
  useEffect(() => { const handle = requestAnimationFrame(animate); return () => cancelAnimationFrame(handle); }, [comps, nodes, selection, dragStartNode, mousePos, probes, activeProbe, selectedTool, ammeterReading, ohmmeterReading, isShortCircuit, t]);

  // ... mouse handlers ...
  const handleMouseDown = (e: React.MouseEvent) => {
      const {x, y} = getMousePos(e);
      if (selectedTool === 'voltmeter') {
          if (Math.hypot(x - probes.red.x, y - probes.red.y) < 40) setActiveProbe('red');
          else if (Math.hypot(x - probes.black.x, y - probes.black.y) < 40) setActiveProbe('black');
          return;
      }
      if (selectedTool === 'ammeter' || selectedTool === 'ohmmeter') return; 
      if (selectedTool === 'select') {
          const hit = comps.find(c => { const n1 = nodes.find(n=>n.id===c.n1)!; const n2 = nodes.find(n=>n.id===c.n2)!; const mx = (n1.x+n2.x)/2; const my = (n1.y+n2.y)/2; return Math.hypot(x-mx, y-my) < 25; });
          if (hit) { setSelection(hit.id); if (hit.type === 'switch') { setComps(prev => prev.map(cc => cc.id === hit.id ? {...cc, isOpen: !cc.isOpen} : cc)); } } else { setSelection(null); }
      } else {
          const sx = Math.round(x/GRID)*GRID; const sy = Math.round(y/GRID)*GRID;
          let n = nodes.find(node => Math.hypot(node.x-sx, node.y-sy) < 15);
          if (!n) { n = {id: Math.random().toString(), x:sx, y:sy, v:0}; setNodes(prev=>[...prev, n!]); }
          setDragStartNode(n.id);
          if (showTutorial && tutorialStep === 1 && selectedTool === 'battery') setTutorialStep(2);
          if (showTutorial && tutorialStep === 3 && selectedTool === 'wire') setTutorialStep(4);
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      const {x, y} = getMousePos(e); setMousePos({x, y});
      if (selectedTool === 'ammeter' || selectedTool === 'ohmmeter') {
          if (selectedTool === 'ammeter') setAmmeterPos({x, y}); else setOhmmeterPos({x, y});
          const hit = comps.find(c => {
               const n1 = nodes.find(n=>n.id===c.n1)!; const n2 = nodes.find(n=>n.id===c.n2)!;
               const mx = (n1.x+n2.x)/2; const my = (n1.y+n2.y)/2; return Math.hypot(x-mx, y-my) < 30; 
          });
          if (hit) {
              if (selectedTool === 'ammeter') {
                  const n1 = nodes.find(n=>n.id===hit.n1)!; const n2 = nodes.find(n=>n.id===hit.n2)!; const vDiff = Math.abs(n1.v - n2.v);
                  let current = 0; if ((hit.type === 'switch' && hit.isOpen) || hit.isBroken) current = 0; else { const r = (hit.type === 'wire' || hit.type === 'switch') ? 0.001 : hit.value; current = vDiff/r; }
                  setAmmeterReading(current);
              } else {
                  let readingStr = '';
                  if (hit.isBroken) readingStr = `∞ (${t('open')})`; else if (hit.type === 'switch') readingStr = hit.isOpen ? `∞ (${t('open')})` : '0 Ω'; else if (hit.type === 'wire') readingStr = '0 Ω'; else if (hit.type === 'battery') readingStr = 'N/A'; else readingStr = `${hit.value} Ω`;
                  setOhmmeterReading(readingStr);
              }
          } else { setAmmeterReading(null); setOhmmeterReading(null); }
      }
      if (activeProbe) setProbes(prev => ({...prev, [activeProbe]: {x, y}}));
  };

  const handleMouseUp = () => {
      if (activeProbe) {
          const sx = Math.round(mousePos.x/GRID)*GRID; const sy = Math.round(mousePos.y/GRID)*GRID;
          const n = nodes.find(node => Math.hypot(node.x-sx, node.y-sy) < 20);
          if (n) setProbes(prev => ({...prev, [activeProbe]: {x: n.x, y: n.y, nodeId: n.id}}));
          setActiveProbe(null); return;
      }
      if (dragStartNode && selectedTool !== 'select' && selectedTool !== 'voltmeter' && selectedTool !== 'ammeter' && selectedTool !== 'ohmmeter') {
          const sx = Math.round(mousePos.x/GRID)*GRID; const sy = Math.round(mousePos.y/GRID)*GRID;
          let endNode = nodes.find(n => Math.hypot(n.x - sx, n.y - sy) < 15);
          if (!endNode) { endNode = {id: Math.random().toString(), x:sx, y:sy, v:0}; setNodes(prev => [...prev, endNode!]); }
          if (endNode.id !== dragStartNode) {
               const newComp: Component = { id: Math.random().toString(), type: selectedTool, n1: dragStartNode, n2: endNode.id, value: selectedTool==='battery'?9:10, isOpen: false, isBroken: false };
               setComps(prev => [...prev, newComp]);
          }
      }
      setDragStartNode(null);
  };

  const handleToolSelect = (tool: ComponentType | 'select') => { setSelectedTool(tool); if (showTutorial) { if (tutorialStep === 1 && tool === 'battery') setTutorialStep(2); if (tutorialStep === 3 && tool === 'wire') setTutorialStep(4); } };
  const selectedPhysics = getSelectedPhysics();

  const renderTutorial = () => {
      if (!showTutorial) return null;
      let text = ''; if (tutorialStep === 1) text = t('tutorial_step1'); if (tutorialStep === 2) text = t('tutorial_step2'); if (tutorialStep === 3) text = t('tutorial_step3'); if (tutorialStep === 4) text = t('tutorial_step4'); if (tutorialStep === 5) text = t('tutorial_step5'); if (tutorialStep === 6) text = t('tutorial_complete');
      return (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-4 border border-blue-400 animate-in slide-in-from-bottom-4 pointer-events-none">
              <div className="bg-white/20 p-2 rounded-full">{tutorialStep === 6 ? <CheckCircle size={24}/> : <HelpCircle size={24}/>}</div>
              <div><h4 className="font-bold text-sm uppercase opacity-80">{t('quick_tutorial')}</h4><p className="font-bold">{text}</p></div>
              <button onClick={() => setShowTutorial(false)} className="ml-4 bg-white/20 text-white p-1 rounded pointer-events-auto"><X size={18}/></button>
          </div>
      );
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800">
      <canvas ref={canvasRef} width={1000} height={600} className={`absolute inset-0 w-full h-full object-contain ${selectedTool === 'ammeter' || selectedTool === 'ohmmeter' ? 'cursor-none' : 'cursor-crosshair'}`} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />
      
      {isShortCircuit && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/90 text-white px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center animate-pulse border-4 border-yellow-400 z-50 pointer-events-none">
             <AlertTriangle size={48} className="text-yellow-400 mb-2"/><h2 className="text-2xl font-black uppercase tracking-widest">{t('short_circuit')}</h2><p className="text-sm font-bold opacity-90">{t('short_circuit_desc')}</p>
         </div>
      )}
      {!isShortCircuit && isOverheating && (
         <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-orange-600/80 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-bounce border border-orange-400 z-40 pointer-events-none">
             <Flame size={20} className="text-yellow-300"/><span className="font-bold text-sm uppercase">{t('overheating_warning')}</span>
         </div>
      )}

      {renderTutorial()}

      {/* FLOATING CONTROL CENTER */}
      <div className={`absolute top-4 left-4 transition-all duration-300 z-20 ${showControls ? 'w-80' : 'w-12'}`}>
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
                <button onClick={() => setShowControls(!showControls)} className="w-full p-3 flex items-center justify-between text-slate-300 hover:bg-slate-800 transition-colors border-b border-slate-700/50">
                    {showControls ? <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><Settings2 size={14} className="text-blue-400"/> {t('kirchhoff_analysis')}</span> : <Settings2 size={20} className="mx-auto text-blue-400"/>}
                    {showControls && (showControls ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
                </button>

                {showControls && (
                    <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Selected Component Properties */}
                        {selection ? (
                           <div className="space-y-4 animate-in fade-in">
                               <h3 className="text-xs font-bold text-white uppercase border-b border-slate-700 pb-2">{t('measurements')}</h3>
                               {comps.find(c => c.id === selection)?.type !== 'wire' && comps.find(c => c.id === selection)?.type !== 'switch' && (
                                   <div>
                                       <label className="text-xs text-slate-400 font-bold uppercase flex justify-between">
                                           <span>{comps.find(c => c.id === selection)?.type === 'battery' ? t('voltage') : t('resistance')}</span>
                                           <span className="text-white font-mono">{comps.find(c => c.id === selection)?.value} {comps.find(c => c.id === selection)?.type === 'battery' ? 'V' : 'Ω'}</span>
                                       </label>
                                       <input type="range" min="1" max="50" value={comps.find(c => c.id === selection)?.value || 0} onChange={e => setComps(prev => prev.map(c => c.id === selection ? {...c, value: Number(e.target.value)} : c))} className="w-full h-2 bg-slate-700 rounded-lg accent-blue-500 mt-2 cursor-pointer"/>
                                   </div>
                               )}
                               {selectedPhysics && (
                                   <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 space-y-2">
                                       <div className="flex justify-between text-xs text-slate-300"><span>{t('voltage_drop')}</span><span className="text-yellow-400 font-mono">{selectedPhysics.vDrop.toFixed(2)} V</span></div>
                                       <div className="flex justify-between text-xs text-slate-300"><span>{t('current')}</span><span className="text-cyan-400 font-mono">{isShortCircuit && selectedPhysics.type==='battery' ? '∞' : selectedPhysics.current.toFixed(2)} A</span></div>
                                       <div className="flex justify-between text-xs text-slate-300"><span>{t('power')}</span><span className={`font-mono ${selectedPhysics.power > 50 ? 'text-red-500 animate-pulse' : 'text-red-400'}`}>{selectedPhysics.power.toFixed(2)} W</span></div>
                                   </div>
                               )}
                               <button onClick={() => { setComps(prev=>prev.filter(c=>c.id!==selection)); setSelection(null); }} className="w-full py-2 bg-red-600/20 text-red-500 border border-red-500/30 rounded font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-600/30"><Trash2 size={14}/> {t('remove_comp')}</button>
                           </div>
                        ) : (
                            <div className="text-center text-slate-500 text-xs italic p-4 border border-dashed border-slate-700 rounded">{t('select_comp_hint')}</div>
                        )}

                        {/* Kirchhoff Analysis */}
                        <div className={`p-4 rounded-xl border transition-colors ${isShortCircuit ? 'bg-red-900/50 border-red-500' : 'bg-slate-800/80 border-slate-600'}`}>
                           <h3 className={`text-xs font-bold uppercase mb-3 flex items-center gap-2 ${isShortCircuit ? 'text-red-400' : 'text-green-400'}`}><Activity size={14}/> {t('kirchhoff_analysis')}</h3>
                           <div className="space-y-1 font-mono text-[10px]">
                               <div className="flex justify-between"><span className="text-slate-400">{t('total_source_v')}</span><span className="text-green-400">{kirchhoffData.totalSourceV.toFixed(2)} V</span></div>
                               <div className="flex justify-between"><span className="text-slate-400">{t('total_drop_v')}</span><span className="text-red-400">{kirchhoffData.totalDropV.toFixed(2)} V</span></div>
                               <div className="flex justify-between border-t border-slate-700 pt-1 mt-1"><span className="text-slate-400">{t('power_gen')}</span><span className={isShortCircuit ? "text-red-500 font-bold" : "text-yellow-400"}>{kirchhoffData.powerGen > 1000 ? "∞" : kirchhoffData.powerGen.toFixed(2) + " W"}</span></div>
                           </div>
                        </div>
                        
                        <div className="w-full h-px bg-slate-700/50"></div>
                        <button onClick={() => { setNodes([]); setComps([]); setTutorialStep(1); setIsShortCircuit(false); }} className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 text-xs font-bold uppercase transition-colors">{t('clear_all')}</button>
                    </div>
                )}
            </div>
      </div>

      {/* BOTTOM FLOATING TOOLBAR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl flex gap-2 shadow-2xl border border-slate-700/50 items-end">
             {[
                 { id: 'select', icon: MousePointer2, label: 'tool_cursor' },
                 { id: 'battery', icon: Battery, label: 'tool_battery', step: 1 },
                 { id: 'wire', icon: Minus, label: 'tool_wire', step: 3 },
                 { id: 'resistor', icon: Activity, label: 'tool_resistor', step: 5 }, 
                 { id: 'bulb', icon: Lightbulb, label: 'tool_bulb', step: 5 },
                 { id: 'switch', icon: RotateCw, label: 'tool_switch' },
                 { id: 'voltmeter', icon: Zap, label: 'tool_voltmeter' },
                 { id: 'ammeter', icon: Gauge, label: 'tool_ammeter' },
                 { id: 'ohmmeter', icon: Disc, label: 'tool_ohmmeter' }, 
             ].map(tool => {
                 const isHighlight = showTutorial && ( (tutorialStep === 1 && tool.step === 1) || (tutorialStep === 3 && tool.step === 3) || (tutorialStep === 5 && tool.step === 5) );
                 return (
                     <button
                        key={tool.id}
                        onClick={() => handleToolSelect(tool.id as any)}
                        className={`group relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${selectedTool === tool.id ? 'bg-blue-600 text-white -translate-y-2 shadow-lg shadow-blue-500/50' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:-translate-y-1'} ${isHighlight ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900 animate-pulse' : ''}`}
                     >
                         <tool.icon size={20} />
                         <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-wider">{t(tool.label)}</span>
                     </button>
                 );
             })}
          </div>
      </div>
    </div>
  );
};
