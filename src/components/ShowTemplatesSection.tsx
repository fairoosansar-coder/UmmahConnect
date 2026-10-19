import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Check, 
  Clock, 
  Sliders, 
  ChevronRight,
  Info
} from 'lucide-react';
import { SHOW_TYPES, ShowTypeTemplate } from '../data/showTemplates';

interface ShowTemplatesSectionProps {
  onApplyTemplate: (template: ShowTypeTemplate) => void;
  onOpenModal: () => void;
  onOpenDirectorAI: (templateId?: string) => void;
  activeTemplateId?: string | null;
}

export const ShowTemplatesSection: React.FC<ShowTemplatesSectionProps> = ({
  onApplyTemplate,
  onOpenModal,
  onOpenDirectorAI,
  activeTemplateId = 'morning_news'
}) => {
  const [selectedId, setSelectedId] = useState<string>(activeTemplateId || 'morning_news');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const currentTemplate = SHOW_TYPES.find(t => t.id === selectedId) || SHOW_TYPES[0];

  const handleApply = (template: ShowTypeTemplate) => {
    onApplyTemplate(template);
    setAppliedNotice(template.name);
    setTimeout(() => setAppliedNotice(null), 3000);
  };

  return (
    <div className="bg-[#0b0c10]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 backdrop-blur-md relative overflow-hidden shadow-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-bl from-io-blue/10 via-purple-500/5 to-transparent pointer-events-none blur-2xl" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-io-blue to-purple-500 p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-io-blue" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-extrabold text-white tracking-wide uppercase">
                Show Format Templates
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                New
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              Select a predefined broadcast format to preload timing, sound cues &amp; dual-host dialogue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-bold border border-white/10 transition-colors cursor-pointer"
          >
            <span>Browse All (5)</span>
            <ChevronRight className="w-3 h-3 text-white/40" />
          </button>

          <button
            type="button"
            onClick={() => onOpenDirectorAI(currentTemplate.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-io-blue/15 hover:bg-io-blue/25 text-io-blue hover:text-white text-[11px] font-bold border border-io-blue/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>AI Director</span>
          </button>
        </div>
      </div>

      {/* Template Pill Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 relative z-10">
        {SHOW_TYPES.map((t) => {
          const isSelected = t.id === selectedId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 relative overflow-hidden ${
                isSelected
                  ? `${t.accentBg} ${t.borderColor} ring-1 ring-white/20 shadow-lg shadow-black/40`
                  : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-lg">{t.emoji}</span>
                <span className="text-[9px] font-mono text-white/40 font-bold uppercase">
                  {t.recommendedDuration}m
                </span>
              </div>
              <div className="text-[11px] font-extrabold truncate text-white leading-tight">
                {t.name}
              </div>
              <div className="text-[9px] text-white/45 truncate">
                {t.tone.split(',')[0]}
              </div>
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-io-blue to-purple-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Template Spotlight Card */}
      <div className={`p-4 rounded-xl border ${currentTemplate.accentBg} ${currentTemplate.borderColor} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10 transition-all duration-300`}>
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl">{currentTemplate.emoji}</span>
            <span className="text-xs sm:text-sm font-black text-white">{currentTemplate.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${currentTemplate.badgeBg}`}>
              {currentTemplate.tone}
            </span>
            <span className="text-[10px] text-white/40 font-mono">
              • {currentTemplate.recommendedDuration} mins • {currentTemplate.recommendedMood}
            </span>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            {currentTemplate.tagline}
          </p>

          {/* Quick Sound Cue Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-white/40 uppercase font-mono font-bold mr-1">Cues:</span>
            {currentTemplate.soundCues.slice(0, 3).map((cue, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] text-white/70">
                🎵 {cue}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
          <button
            type="button"
            onClick={onOpenModal}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Inspect full 5-step broadcast rundown"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rundown</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDirectorAI(currentTemplate.id)}
            className="px-3.5 py-2.5 rounded-xl bg-io-blue/20 hover:bg-io-blue/30 text-white border border-io-blue/35 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Direct this show format with Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-io-blue animate-pulse" />
            <span>Direct with AI</span>
          </button>

          <button
            type="button"
            onClick={() => handleApply(currentTemplate)}
            className="flex-1 md:flex-none px-4 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Use Template</span>
          </button>
        </div>
      </div>

      {/* Toast Confirmation if applied */}
      {appliedNotice && (
        <div className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Loaded &quot;{appliedNotice}&quot; template into Studio Generator!</span>
        </div>
      )}
    </div>
  );
};
