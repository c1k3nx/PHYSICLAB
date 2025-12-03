
import React, { useState } from 'react';
import { Experiment } from '../types';
import { useGlobal } from '../contexts/GlobalContext';
import { ProjectileSim } from './simulations/ProjectileSim';
import { Motion1DSim } from './simulations/Motion1DSim'; 
import { GasSim } from './simulations/GasSim';
import { OpticsSim } from './simulations/OpticsSim';
import { ElecSim } from './simulations/ElecSim';
import { NewtonSim } from './simulations/NewtonSim';
import { PendulumSim } from './simulations/PendulumSim';
import { CollisionSim } from './simulations/CollisionSim';
import { FluidSim } from './simulations/FluidSim';
import { OhmSim } from './simulations/OhmSim';
import { ElectricFieldSim } from './simulations/ElectricFieldSim';
import { InterferenceSim } from './simulations/InterferenceSim';
import { LensSim } from './simulations/LensSim';
import { CarnotSim } from './simulations/CarnotSim';
import { CircularSim } from './simulations/CircularSim';
import { SpringSim } from './simulations/SpringSim';
import { TorqueSim } from './simulations/TorqueSim';
import { RelativitySim } from './simulations/RelativitySim';
import { ACCircuitSim } from './simulations/ACCircuitSim';
import { PrismSim } from './simulations/PrismSim';
import { PhotoelectricSim } from './simulations/PhotoelectricSim';
import { CalorimetrySim } from './simulations/CalorimetrySim';
import { Beaker, X, BookOpen, Info, Gamepad2, Sparkles, Languages, Sun, Moon } from 'lucide-react';

interface Props {
  experiment: Experiment;
}

// --- PROFESSIONAL FORMULA PARSER ---
const SYMBOL_MAP: Record<string, string> = {
    'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'theta': 'θ', 'lambda': 'λ', 'pi': 'π',
    'Delta': 'Δ', 'rho': 'ρ', 'omega': 'ω', 'phi': 'φ', 'mu': 'μ', 'sigma': 'σ',
    'tau': 'τ', 'epsilon': 'ε', 'varepsilon': 'ε', 'Phi': 'Φ', 'eta': 'η',
    'cdot': '·', 'times': '×', 'approx': '≈', 'le': '≤', 'ge': '≥',
    'rightarrow': '→', 'infty': '∞', 'circ': '°', 'sum': '∑', 'pm': '±', 'angle': '∠',
    'deg': '°'
};

const FormattedText: React.FC<{ text: string; type: 'theory' | 'guide' }> = ({ text, type }) => {
    if (!text) return <div className="text-slate-500 italic p-4">Content updating...</div>;

    // Helper to extract nested argument { ... }
    const extractArg = (s: string): [string, string] => {
        if (!s.startsWith('{')) return ['', s];
        let depth = 0;
        let endIdx = -1;
        for(let i=0; i<s.length; i++) {
            if(s[i] === '{') depth++;
            else if(s[i] === '}') depth--;
            if(depth === 0) { endIdx = i; break; }
        }
        if(endIdx === -1) return ['', s]; // Malformed
        return [s.substring(1, endIdx), s.substring(endIdx+1)];
    };

    const renderMath = (formula: string, isBlock: boolean) => {
        const renderParts = (s: string): React.ReactNode => {
            if (!s) return null;

            const cmdIdx = s.indexOf('\\');
            const subIdx = s.indexOf('_');
            const supIdx = s.indexOf('^');
            
            // Find the earliest significant token
            let indices = [cmdIdx, subIdx, supIdx].filter(i => i !== -1).sort((a,b) => a-b);
            
            // If no commands/sub/sup, return text directly
            if (indices.length === 0) return <span>{s}</span>;
            
            const nextIdx = indices[0];
            const pre = s.substring(0, nextIdx);
            const remainder = s.substring(nextIdx);
            
            const preNode = pre ? <span>{pre}</span> : null;

            // Handle Subscript _
            if (remainder.startsWith('_')) {
                let subContent = '';
                let post = '';
                if (remainder[1] === '{') {
                    const [arg, rest] = extractArg(remainder.substring(1));
                    subContent = arg;
                    post = rest;
                } else {
                    subContent = remainder[1];
                    post = remainder.substring(2);
                }
                return <>{preNode}<sub className="text-[0.75em] opacity-80">{renderParts(subContent)}</sub>{renderParts(post)}</>;
            }

            // Handle Superscript ^
            if (remainder.startsWith('^')) {
                let supContent = '';
                let post = '';
                if (remainder[1] === '{') {
                    const [arg, rest] = extractArg(remainder.substring(1));
                    supContent = arg;
                    post = rest;
                } else {
                    supContent = remainder[1];
                    post = remainder.substring(2);
                }
                return <>{preNode}<sup className="text-[0.75em] opacity-80">{renderParts(supContent)}</sup>{renderParts(post)}</>;
            }

            // Handle Commands starting with \
            if (remainder.startsWith('\\')) {
                // Special Structural Commands
                if (remainder.startsWith('\\frac')) {
                    const afterCmd = remainder.substring(5);
                    const [num, rest1] = extractArg(afterCmd);
                    const [den, rest2] = extractArg(rest1);
                    return (
                        <span className="inline-flex items-center align-middle mx-1">
                            {preNode}
                            <span className="inline-flex flex-col items-center text-[0.9em] leading-tight font-serif">
                                <span className="border-b border-current px-1 pb-[1px] mb-[1px] text-center w-full">{renderParts(num)}</span>
                                <span className="px-1 text-center w-full">{renderParts(den)}</span>
                            </span>
                            {renderParts(rest2)}
                        </span>
                    );
                }

                if (remainder.startsWith('\\sqrt')) {
                    const afterCmd = remainder.substring(5);
                    const [arg, rest] = extractArg(afterCmd);
                    return (
                        <span className="inline-flex items-center align-middle">
                            {preNode}
                            <span className="text-xl leading-none mr-[1px]">√</span>
                            <span className="border-t border-current pt-[1px] ml-[1px]">{renderParts(arg)}</span>
                            {renderParts(rest)}
                        </span>
                    );
                }

                if (remainder.startsWith('\\vec')) {
                    const afterCmd = remainder.substring(4);
                    const [arg, rest] = extractArg(afterCmd);
                    return (
                        <span className="inline-block relative mx-0.5">
                            {preNode}
                            <span className="relative inline-block">
                                <span className="absolute -top-[0.7em] left-1/2 -translate-x-1/2 text-[0.7em] font-sans leading-none opacity-90">→</span>
                                {renderParts(arg)}
                            </span>
                            {renderParts(rest)}
                        </span>
                    );
                }

                if (remainder.startsWith('\\text')) {
                    const afterCmd = remainder.substring(5);
                    const [arg, rest] = extractArg(afterCmd);
                    return (
                        <>
                            {preNode}
                            <span className="font-sans not-italic text-[0.9em] mx-1">{arg}</span>
                            {renderParts(rest)}
                        </>
                    );
                }

                // Detect Command Name (e.g. \alpha, \sin)
                const match = remainder.match(/^\\([a-zA-Z]+)/);
                if (match) {
                    const cmd = match[1];
                    const cmdLength = match[0].length;
                    const rest = remainder.substring(cmdLength);

                    if (SYMBOL_MAP[cmd]) {
                        return <>{preNode}<span className="mx-[1px]">{SYMBOL_MAP[cmd]}</span>{renderParts(rest)}</>;
                    }

                    const funcs = ['sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'ln', 'log'];
                    if (funcs.includes(cmd)) {
                        return <>{preNode}<span className="mx-0.5 font-sans">{cmd}</span>{renderParts(rest)}</>;
                    }
                }
                
                return <>{preNode}{renderParts(remainder.substring(1))}</>;
            }

            return <span>{s}</span>;
        };

        return <span className={isBlock ? "text-lg md:text-xl font-serif italic text-white" : "font-serif italic text-yellow-200"}>{renderParts(formula)}</span>;
    };

    const lines = text.split('\n');
    
    return (
        <div className="space-y-4 pb-10">
            {lines.map((line, idx) => {
                const cleanLine = line.trim();
                if (!cleanLine) return null;

                if (cleanLine.startsWith('# ')) {
                    return (
                        <div key={idx} className="flex items-center gap-3 mt-8 mb-6 pb-2 border-b border-blue-500/20">
                            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20"><BookOpen size={20} className="text-white"/></div>
                            <h3 className="text-2xl font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                {cleanLine.replace(/^#\s+/, '')}
                            </h3>
                        </div>
                    );
                }
                if (cleanLine.startsWith('## ') || (cleanLine.endsWith(':') && !cleanLine.includes(' '))) {
                    return (
                        <h4 key={idx} className="text-lg font-bold text-emerald-400 mt-6 mb-3 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
                            {cleanLine.replace(/^##\s+/, '').replace(/:$/, '')}
                        </h4>
                    );
                }

                if (cleanLine.startsWith('$$') && cleanLine.endsWith('$$')) {
                    const formula = cleanLine.replace(/\$\$/g, '');
                    return (
                        <div key={idx} className="my-6 mx-0 md:mx-8 relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl opacity-30 blur group-hover:opacity-60 transition duration-500"></div>
                            <div className="relative p-6 bg-[#0b0f19] rounded-xl border border-slate-700/50 flex flex-col items-center justify-center shadow-2xl overflow-x-auto">
                                {renderMath(formula, true)}
                            </div>
                        </div>
                    );
                }

                const renderInline = (text: string) => {
                    const parts = text.split(/(\$[^$]+\$|\*\*.*?\*\*)/g);
                    return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-blue-200 font-bold">{part.slice(2, -2)}</strong>;
                        // Strip $ and render math
                        if (part.startsWith('$') && part.endsWith('$')) return <span key={i} className="mx-1 inline-block">{renderMath(part.slice(1, -1), false)}</span>;
                        return part;
                    });
                };

                if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
                    const content = cleanLine.replace(/^[\*\-]\s+/, '');
                    return (
                        <div key={idx} className="flex gap-3 pl-2 items-start group py-1">
                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-blue-400 transition-all shrink-0"></div>
                            <span className="text-slate-300 group-hover:text-slate-100 transition-colors leading-relaxed text-[15px]">
                                {renderInline(content)}
                            </span>
                        </div>
                    );
                }

                if (type === 'guide' && /^\d+\./.test(cleanLine)) {
                     const splitIdx = cleanLine.indexOf('.');
                     const num = cleanLine.substring(0, splitIdx);
                     const content = cleanLine.substring(splitIdx + 1).trim();
                     return (
                         <div key={idx} className="flex gap-4 p-4 mb-3 bg-slate-800/30 rounded-xl border border-slate-700/50 hover:bg-slate-800/80 hover:border-blue-500/40 transition-all group hover:translate-x-1">
                             <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 text-blue-400 border border-slate-600 flex items-center justify-center font-bold text-sm group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white group-hover:border-blue-500 transition-all shadow-lg">{num}</div>
                             <p className="text-slate-300 mt-1 leading-relaxed text-[15px]">{renderInline(content)}</p>
                         </div>
                     );
                }

                return <p key={idx} className="text-slate-400 leading-7 text-[15px] mb-2 text-justify">{renderInline(cleanLine)}</p>;
            })}
        </div>
    );
};

export const SimulationContainer: React.FC<Props> = ({ experiment }) => {
  const { theme, toggleTheme, lang, setLang, t } = useGlobal();
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'guide'>('theory');
  const isDark = theme === 'dark';
  
  const renderSimulation = () => {
    switch(experiment.id) {
        case 'mech-motion-1d': return <Motion1DSim />; 
        case 'mech-projectile': return <ProjectileSim />;
        case 'mech-newton': return <NewtonSim />;
        case 'mech-circular': return <CircularSim />;
        case 'mech-pendulum': return <PendulumSim />;
        case 'mech-spring': return <SpringSim />;
        case 'mech-torque': return <TorqueSim />;
        case 'mech-collisions': return <CollisionSim />;
        case 'mech-fluid': return <FluidSim />;
        case 'mech-relativity': return <RelativitySim />;
        case 'elec-coulomb': return <ElecSim />;
        case 'elec-field': return <ElectricFieldSim />;
        case 'elec-ohm': return <OhmSim />;
        case 'elec-ac': return <ACCircuitSim />;
        case 'opt-refraction': return <OpticsSim />;
        case 'opt-prism': return <PrismSim />;
        case 'opt-lenses': return <LensSim />;
        case 'opt-interference': return <InterferenceSim />;
        case 'opt-photoelectric': return <PhotoelectricSim />;
        case 'therm-gas': return <GasSim />;
        case 'therm-calorimetry': return <CalorimetrySim />;
        case 'therm-carnot': return <CarnotSim />;
        default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col relative animate-in fade-in duration-300">
      <div className={`h-12 shrink-0 border-b flex items-center justify-between px-4 z-20 backdrop-blur-md transition-colors ${isDark ? 'bg-[#0f121a]/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
          <div className="flex items-center gap-4 overflow-hidden">
              <h2 className={`text-sm font-bold uppercase tracking-widest truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {t(experiment.id)}
              </h2>
              <div className={`hidden md:block w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
              <p className={`hidden md:block text-xs truncate max-w-lg ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                  {t('desc_' + experiment.id)}
              </p>
          </div>
          
          <div className="flex items-center gap-3">
              <button 
                  onClick={() => setShowHelp(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isDark 
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20' 
                      : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                  }`}
              >
                  <BookOpen size={14} /> <span className="hidden sm:inline">{t('theory_guide')}</span>
              </button>

              <div className={`w-px h-6 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

              <button 
                onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] font-bold ${
                    isDark 
                    ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
                title="Switch Language"
             >
                 <Languages size={14} />
                 {lang === 'vi' ? 'VI' : 'EN'}
             </button>

             <button 
                onClick={toggleTheme}
                className={`p-1.5 rounded-lg border transition-all ${
                    isDark 
                    ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:text-yellow-300' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
                title="Toggle Theme"
             >
                 {isDark ? <Sun size={14} /> : <Moon size={14} />}
             </button>
          </div>
      </div>
      
      <div className="flex-grow min-h-0 relative z-0 p-0 md:p-2 bg-slate-950/50">
        <div className="w-full h-full md:rounded-lg overflow-hidden border border-slate-800 shadow-2xl bg-black relative">
            {renderSimulation()}
        </div>
      </div>

      {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
              <div className={`w-full max-w-5xl h-full md:h-[85vh] flex flex-col md:rounded-2xl shadow-2xl overflow-hidden border ${isDark ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="px-6 py-4 border-b border-slate-700/50 flex justify-between items-center bg-[#020617] relative overflow-hidden shrink-0">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                      <div className="flex items-center gap-4 relative z-10">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner">
                              <BookOpen size={20} className="text-blue-400"/> 
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-white tracking-wide">{t('theory_guide')}</h3>
                              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{t(experiment.id)}</p>
                          </div>
                      </div>
                      <button onClick={() => setShowHelp(false)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                          <X size={24}/>
                      </button>
                  </div>

                  <div className="flex flex-col md:flex-row h-full overflow-hidden">
                      <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-row md:flex-col p-3 gap-2 shrink-0 overflow-x-auto md:overflow-visible">
                          <button 
                            onClick={() => setActiveTab('theory')}
                            className={`flex-1 md:flex-none p-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-all border ${
                                activeTab === 'theory' 
                                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400' 
                                : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                              <Info size={18} /> 
                              <span>{t('theory')}</span>
                          </button>
                          
                          <button 
                            onClick={() => setActiveTab('guide')}
                            className={`flex-1 md:flex-none p-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-all border ${
                                activeTab === 'guide' 
                                ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-400' 
                                : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800'
                            }`}
                          >
                              <Gamepad2 size={18} /> 
                              <span>{t('guide')}</span>
                          </button>
                          
                          <div className="mt-auto hidden md:block p-4 rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 mx-2 shadow-inner relative overflow-hidden group">
                              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                              <div className="flex items-center gap-2 text-yellow-400 mb-2 font-bold tracking-widest uppercase text-xs">
                                  <Sparkles size={14} className="animate-pulse"/>
                                  <span>{t('pro_tip')}</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                                  {t('pro_tip_content')}
                              </p>
                          </div>
                      </div>

                      <div className="flex-grow overflow-y-auto p-6 md:p-12 custom-scrollbar bg-[#0f172a] relative">
                           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px)`, backgroundSize: '100% 32px' }}>
                           </div>

                          {activeTab === 'theory' ? (
                              <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto pb-10">
                                 <div className="mb-8 pb-4 border-b border-slate-800">
                                     <h2 className="text-3xl font-bold text-white mb-2">{t('physics_concepts')}</h2>
                                     <p className="text-slate-400">{t('theory_subtitle')}</p>
                                 </div>
                                 <FormattedText text={t(`theory_${experiment.id}`)} type="theory" />
                              </div>
                          ) : (
                              <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto pb-10">
                                 <div className="mb-8 pb-4 border-b border-slate-800">
                                     <h2 className="text-3xl font-bold text-white mb-2">{t('interactive_guide')}</h2>
                                     <p className="text-slate-400">{t('guide_subtitle')}</p>
                                 </div>
                                 <FormattedText text={t(`guide_${experiment.id}`)} type="guide" />
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
