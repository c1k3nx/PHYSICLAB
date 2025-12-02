
import React, { useMemo, useState } from 'react';
import { Category, Experiment } from '../types';
import { EXPERIMENTS, CATEGORY_ICONS } from '../constants';
import { ChevronRight, ChevronDown, Atom, Search } from 'lucide-react';
import { useGlobal } from '../contexts/GlobalContext';

interface Props {
  currentExperimentId: string;
  onSelectExperiment: (id: string) => void;
}

export const Sidebar: React.FC<Props> = ({ currentExperimentId, onSelectExperiment }) => {
  const { theme, t } = useGlobal();
  
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
      [Category.MECHANICS]: true,
      [Category.ELECTRICITY]: true,
      [Category.OPTICS]: true,
      [Category.THERMODYNAMICS]: true,
  });
  const [search, setSearch] = useState('');

  const toggleCategory = (cat: string) => {
      setExpanded(prev => ({...prev, [cat]: !prev[cat]}));
  };

  const groupedExperiments = useMemo(() => {
    const groups: Partial<Record<Category, Experiment[]>> = {};
    Object.values(Category).forEach(cat => {
        const exps = EXPERIMENTS.filter(e => 
            e.category === cat && // STRICT CATEGORY CHECK ADDED
            (t(e.id).toLowerCase().includes(search.toLowerCase()) || 
            e.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
        );
        if (exps.length > 0) groups[cat] = exps;
    });
    return groups;
  }, [search, t]);

  const isDark = theme === 'dark';

  return (
    <div className={`w-80 h-screen border-r flex flex-col shadow-2xl z-30 transition-colors duration-300 ${
        isDark ? 'bg-[#0b0d12] border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                <Atom className="text-white" size={24} />
            </div>
            <div>
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    PhysiLab <span className="text-blue-500">Pro</span>
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Simulation Engine</p>
            </div>
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full text-xs rounded-xl pl-9 pr-3 py-3 border focus:outline-none focus:ring-2 transition-all ${
                    isDark 
                    ? 'bg-slate-900/50 border-slate-800 text-slate-300 focus:border-blue-500/50 focus:ring-blue-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
            />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-4 pb-6 space-y-2 custom-scrollbar">
        {Object.entries(groupedExperiments).map(([category, experiments]) => {
            const Icon = CATEGORY_ICONS[category as Category];
            const isExpanded = expanded[category];
            const expList = experiments as Experiment[];
            
            return (
                <div key={category} className={`rounded-xl overflow-hidden transition-all duration-300 ${isDark ? 'bg-slate-900/30' : 'bg-slate-50'}`}>
                    <button 
                        onClick={() => toggleCategory(category)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                            isDark 
                            ? 'text-slate-400 hover:text-slate-200' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Icon size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                            {t(category)}
                        </div>
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    
                    {isExpanded && (
                        <div className="space-y-0.5 px-2 pb-2">
                            {expList.map(exp => {
                                const active = currentExperimentId === exp.id;
                                return (
                                    <button
                                        key={exp.id}
                                        onClick={() => onSelectExperiment(exp.id)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group relative overflow-hidden ${
                                            active
                                            ? (isDark ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-blue-600 text-white shadow-lg shadow-blue-200')
                                            : (isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm')
                                        }`}
                                    >
                                        <span className="truncate font-medium">{t(exp.id)}</span>
                                        {active && <ChevronRight size={14} className="opacity-100" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      <div className={`p-4 border-t ${isDark ? 'border-slate-800 bg-[#0b0e14]' : 'border-slate-200 bg-slate-50'}`}>
        <div className={`text-[10px] text-center font-mono font-semibold ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            V 3.1.0 • {t('system_active')}
        </div>
      </div>
    </div>
  );
};
