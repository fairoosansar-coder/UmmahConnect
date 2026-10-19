import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Clock, 
  Sliders, 
  Volume2, 
  ListOrdered, 
  ArrowRight, 
  Check, 
  Radio, 
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SHOW_TYPES, ShowTypeTemplate } from '../data/showTemplates';

interface ShowTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ShowTypeTemplate) => void;
  onDirectWithAI: (templateId: string) => void;
  onApplyPromptText: (promptText: string, duration?: string, mood?: string) => void;
}

export const ShowTemplatesModal: React.FC<ShowTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  onDirectWithAI,
  onApplyPromptText
}) => {
  const [selectedId, setSelectedId] = useState<string>(SHOW_TYPES[0].id);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTemplate = SHOW_TYPES.find(t => t.id === selectedId) || SHOW_TYPES[0];

  const handleApply = (template: ShowTypeTemplate) => {
    onSelectTemplate(template);
    onApplyPromptText(template.blueprintPrompt, template.recommendedDuration, template.recommendedMood);
    onClose();
  };

  const handleApplySample = (text: string, template: ShowTypeTemplate) => {
    onApplyPromptText(text, template.recommendedDuration, template.recommendedMood);
    setCopiedPrompt(text);
    setTimeout(() => {
      setCopiedPrompt(null);
      onClose();
    }, 400);
  };

  const handleLaunchDirector = (templateId: string) => {
    onDirectWithAI(templateId);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0d12] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden z-10"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-io-blue to-purple-600 flex items-center justify-center p-0.5 shadow-md shadow-io-blue/20">
                <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-io-blue" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white tracking-tight">Show Format Templates</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-io-blue/15 text-io-blue border border-io-blue/30 uppercase tracking-wider">
                    5 Formats Available
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  Pre-engineered broadcast architectures with authentic rundowns, timing, sound cues & host chemistry
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
            {/* Left: Template Selector Tabs */}
            <div className="w-full md:w-72 shrink-0 p-3 sm:p-4 space-y-2 bg-black/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-2 block mb-1">
                Select Format
              </span>

              {SHOW_TYPES.map((t) => {
                const isSelected = t.id === selectedId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? `${t.accentBg} ${t.borderColor} shadow-lg shadow-black/40`
                        : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl shrink-0">{t.emoji}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate text-white">{t.name}</div>
                        <div className="text-[10px] text-white/50 truncate">{t.tone.split(',')[0]}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-white/5 px-2">
                <div className="bg-io-blue/10 border border-io-blue/20 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-io-blue text-[11px] font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini Director AI</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed mb-2.5">
                    Need tailored pacing or custom co-host personas for this show?
                  </p>
                  <button
                    onClick={() => handleLaunchDirector(selectedId)}
                    className="w-full py-1.5 px-3 bg-io-blue/20 hover:bg-io-blue/30 text-white border border-io-blue/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open in Director AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Selected Template Deep-Dive Details */}
            <div className="flex-1 p-5 sm:p-6 space-y-6 overflow-y-auto">
              {/* Header Card */}
              <div className={`p-4 sm:p-5 rounded-2xl border ${currentTemplate.accentBg} ${currentTemplate.borderColor} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{currentTemplate.emoji}</span>
                    <h4 className="text-base sm:text-lg font-black text-white">{currentTemplate.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${currentTemplate.badgeBg}`}>
                      {currentTemplate.recommendedDuration} min format
                    </span>
                  </div>
                  <p className="text-xs text-white/70 max-w-xl">
                    {currentTemplate.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => handleApply(currentTemplate)}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Use In Studio</span>
                  </button>
                  <button
                    onClick={() => handleLaunchDirector(currentTemplate.id)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
                    title="Direct with Gemini AI"
                  >
                    <Sparkles className="w-4 h-4 text-io-blue" />
                  </button>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                    <Sliders className="w-3.5 h-3.5 text-io-blue" />
                    <span>Broadcast Tone</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium">{currentTemplate.tone}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pacing & Tempo</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium">{currentTemplate.pacing}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Recommended Settings</span>
                  </div>
                  <p className="text-xs text-white/90 font-medium">
                    {currentTemplate.recommendedDuration} mins • {currentTemplate.recommendedMood}
                  </p>
                </div>
              </div>

              {/* 5-Step Rundown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                    <ListOrdered className="w-4 h-4 text-io-blue" />
                    <span>Broadcast Rundown & Timing Structure</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/40">5 Segments</span>
                </div>

                <div className="space-y-2 bg-white/[0.015] border border-white/5 rounded-xl p-3.5">
                  {currentTemplate.structure.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <span className="w-5 h-5 rounded-md bg-white/5 border border-white/10 text-white/70 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-white/80 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ambient Sound Cues */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <span>Audio & Soundscape Cues</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentTemplate.soundCues.map((cue, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium"
                    >
                      🎵 {cue}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instant Scenario Starters */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Sample Scenarios (Click to Load directly into Studio)
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">1-Click Apply</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {currentTemplate.samplePrompts.map((sp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplySample(sp.text, currentTemplate)}
                      className="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/15 transition-all group flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-io-blue transition-colors flex items-center gap-1.5">
                          <span>{sp.label}</span>
                        </div>
                        <p className="text-[11px] text-white/50 truncate max-w-xl">
                          {sp.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white/40 group-hover:text-white shrink-0">
                        <span>Load</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer action */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  Close Browser
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLaunchDirector(currentTemplate.id)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-io-blue" />
                    <span>Open in Director AI</span>
                  </button>
                  <button
                    onClick={() => handleApply(currentTemplate)}
                    className="px-5 py-2 bg-white text-black hover:bg-zinc-200 rounded-xl text-xs font-black tracking-wide uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Load {currentTemplate.name}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
