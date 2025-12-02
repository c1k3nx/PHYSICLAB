
import React, { useState } from 'react';
import { Experiment } from '../types';
import { useGlobal } from '../contexts/GlobalContext';
import { ProjectileSim } from './simulations/ProjectileSim';
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
import { Beaker, X, BookOpen, Info, Gamepad2, Calculator, ChevronRight, Lightbulb } from 'lucide-react';

interface Props {
  experiment: Experiment;
}

// --- RICH TEXT PARSER COMPONENT ---
const FormattedText: React.FC<{ text: string; type: 'theory' | 'guide' }> = ({ text, type }) => {
    // Safety check if translation is missing
    if (!text) return <div className="text-slate-500 italic">No content available.</div>;

    const lines = text.split('\n');
    
    return (
        <div className="space-y-4 pb-10">
            {lines.map((line, idx) => {
                const cleanLine = line.trim();
                if (!cleanLine) return null;

                // 1. Header detection (Ends with colon or looks like a title)
                if (cleanLine.endsWith(':') || (cleanLine === cleanLine.toUpperCase() && cleanLine.length < 40 && !cleanLine.includes('='))) {
                    return (
                        <div key={idx} className="flex items-center gap-2 mt-8 mb-4 border-b border-blue-500/30 pb-2">
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            <h4 className="text-sm font-bold uppercase tracking-widest text-blue-400">
                                {cleanLine.replace(':', '')}
                            </h4>
                        </div>
                    );
                }

                // 2. Bullet points
                if (cleanLine.startsWith('•') || cleanLine.startsWith('-')) {
                    return (
                        <div key={idx} className="flex gap-3 pl-2 items-start group">
                            <span className="text-blue-500 font-bold mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 block shrink-0"></span>
                            <span className="text-slate-300 group-hover:text-slate-100 transition-colors leading-relaxed">
                                {cleanLine.substring(1).trim()}
                            </span>
                        </div>
                    );
                }

                // 3. Formula detection (Contains = or ≈ and looks math-y)
                const isFormula = (cleanLine.includes('=') || cleanLine.includes('≈') || cleanLine.includes('∝')) && cleanLine.length < 80 && !/^\d+\./.test(cleanLine);
                
                if (type === 'theory' && isFormula) {
                    return (
                        <div key={idx} className="my-4 mx-0 md:mx-4 p-4 bg-[#0b0f19] rounded-lg border-l-4 border-emerald-500 font-mono text-lg text-emerald-100 shadow-lg flex items-center gap-4 hover:translate-x-1 transition-transform">
                            <div className="bg-emerald-500/10 p-2 rounded-md hidden md:block">
                                <Calculator size={20} className="text-emerald-400" />
                            </div>
                            <span className="tracking-wide w-full text-center md:text-left">{cleanLine}</span>
                        </div>
                    );
                }

                // 4. Guide Steps (Numbered like "1. Do this")
                if (type === 'guide' && /^\d+\./.test(cleanLine)) {
                     const splitIdx = cleanLine.indexOf('.');
                     const num = cleanLine.substring(0, splitIdx);
                     const content = cleanLine.substring(splitIdx + 1);
                     
                     return (
                         <div key={idx} className="flex gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/30 transition-all group hover:shadow-lg">
                             <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                 {num}
                             </div>
                             <p className="text-slate-300 mt-1 leading-relaxed group-hover:text-white">{content.trim()}</p>
                         </div>
                     );
                }

                // 5. Standard Paragraph
                return <p key={idx} className="text-slate-400 leading-7 text-[15px]">{cleanLine}</p>;
            })}
        </div>
    );
};

export const SimulationContainer: React.FC<Props> = ({ experiment }) => {
  const { theme, t } = useGlobal();
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'guide'>('theory');
  const isDark = theme === 'dark';
  
  const renderSimulation = () => {
    switch(experiment.id) {
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
    <div className="h-full flex flex-col animate-in fade-in duration-500 relative">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{t(experiment.id)}</h2>
            <p className={`text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{experiment.description}</p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
            <button 
                onClick={() => setShowHelp(true)}
                className={`group px-4 py-2 rounded-lg transition-all flex items-center gap-2 font-bold shadow-lg ${isDark ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:to-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                title="Open Notebook"
            >
                <BookOpen size={18} className="group-hover:scale-110 transition-transform" />
                <span>{t('theory_guide')}</span>
            </button>
        </div>
      </div>
      
      <div className="flex-grow min-h-0 relative z-0">
        {renderSimulation()}
      </div>

      {/* --- PROFESSIONAL NOTEBOOK MODAL --- */}
      {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
              <div className={`w-full max-w-5xl h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border ${isDark ? 'bg-[#0f172a] border-slate-700' : 'bg-white border-slate-200'}`}>
                  
                  {/* Header */}
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

                  {/* Body */}
                  <div className="flex flex-col md:flex-row h-full overflow-hidden">
                      {/* Sidebar */}
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
                          
                          <div className="mt-auto hidden md:block p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 mx-2">
                              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                  <Lightbulb size={16} />
                                  <span className="text-xs font-bold uppercase">Pro Tip</span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                  Try changing one variable at a time to isolate its effect on the system!
                              </p>
                          </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow overflow-y-auto p-6 md:p-12 custom-scrollbar bg-[#0f172a] relative">
                           {/* Notebook Lines Effect */}
                           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px)`, backgroundSize: '100% 32px' }}>
                           </div>

                          {activeTab === 'theory' ? (
                              <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
                                 <div className="mb-8 pb-4 border-b border-slate-800">
                                     <h2 className="text-3xl font-bold text-white mb-2">{t('physics_concepts')}</h2>
                                     <p className="text-slate-400">{t('theory_subtitle')}</p>
                                 </div>
                                 <FormattedText text={t(`theory_${experiment.id}`)} type="theory" />
                              </div>
                          ) : (
                              <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
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
