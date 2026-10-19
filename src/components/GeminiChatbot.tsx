import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RotateCcw, 
  Copy, 
  Check, 
  Radio, 
  ArrowRight,
  Zap,
  Mic,
  FileText,
  Layers,
  ChevronRight,
  Sun,
  Moon,
  Users,
  Compass,
  Flame
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  model?: string;
  showType?: string;
}

export type ChatRole = 'director' | 'prompt_architect' | 'script_doctor';

import { SHOW_TYPES, ShowTypeTemplate } from '../data/showTemplates';
export { SHOW_TYPES };
export type { ShowTypeTemplate };

interface GeminiChatbotProps {
  initialShowType?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyPrompt?: (prompt: string) => void;
  currentShow?: {
    title: string;
    language?: string;
    summary?: string;
    host?: string;
  };
}

const STORAGE_KEY = 'ummaconnect_director_chat_v1';
const TEMPLATE_STORAGE_KEY = 'ummaconnect_director_template_v1';

const INITIAL_SUGGESTIONS = [
  {
    label: "📻 Morning Tech Debate",
    text: "Create a vibrant, high-energy prompt for a 3-minute debate between a skeptical senior engineer and an eager AI enthusiast about vibe-coding."
  },
  {
    label: "🇱🇰 Sri Lankan Street Food",
    text: "Suggest a lively bilingual Colombo talk radio show discussing the best kottu spots with dynamic background urban ambience and caller reactions."
  },
  {
    label: "🎙️ Improve Host Chemistry",
    text: "What are the best script instructions to make dual hosts sound spontaneous, interrupting each other naturally with laughs and witty comebacks?"
  },
  {
    label: "✨ Review Current Show",
    text: "Analyze the currently loaded radio show episode. Give me 3 fresh ideas for a sequel or follow-up broadcast."
  }
];

export function GeminiChatbot({ isOpen, onClose, onApplyPrompt, initialShowType, currentShow }: GeminiChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load chat history from localStorage", e);
    }
    return [
      {
        id: 'welcome',
        role: 'model',
        content: `👋 **Welcome to your Radio Director AI!**\n\nI'm powered by **Gemini** to help you produce standout talk radio shows in English, Tamil, and Sinhala.\n\nChoose any **Show Type Template** above (like **Morning News**, **Nightly Storytime**, or **Expert Panel Discussion**) to guide my pacing, audio cues, and dialogue direction!\n\n* **Broadcast-ready prompts** formatted for one-click studio generation\n* **Dual-speaker dialogue & banter** structuring tips\n* **Cultural concepts & music pacing** advice\n* **Episode reviews & sequel concepts** for your current show`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'gemini-3.8-flash'
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ChatRole>('director');
  const [selectedShowType, setSelectedShowType] = useState<string | null>(() => {
    if (initialShowType) return initialShowType;
    try {
      return localStorage.getItem(TEMPLATE_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (initialShowType !== undefined && initialShowType !== null) {
      setSelectedShowType(initialShowType);
    }
  }, [initialShowType]);
  const [showStructurePreview, setShowStructurePreview] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedPromptId, setAppliedPromptId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Could not save chat history to localStorage", e);
    }
  }, [messages]);

  // Sync selectedShowType to localStorage
  useEffect(() => {
    try {
      if (selectedShowType) {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, selectedShowType);
      } else {
        localStorage.removeItem(TEMPLATE_STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Could not save template to localStorage", e);
    }
  }, [selectedShowType]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const activeTemplate = SHOW_TYPES.find(t => t.id === selectedShowType) || null;

  const getModelForRole = (role: ChatRole): string => {
    switch (role) {
      case 'prompt_architect':
        return 'gemini-3.1-flash-lite';
      case 'script_doctor':
      case 'director':
      default:
        return 'gemini-3.8-flash';
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showType: selectedShowType || undefined
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const targetModel = getModelForRole(selectedRole);

      // Prepare multi-turn history excluding system greetings if needed
      const apiMessages = newMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          role: selectedRole,
          model: targetModel,
          showContext: currentShow?.title ? currentShow : undefined,
          showType: selectedShowType || undefined
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || "I didn't receive a response. Please try asking again.";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || targetModel,
        showType: selectedShowType || undefined
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Unable to complete request**: ${err.message || "Please check your network connection and try again."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'model',
      content: `👋 Chat cleared! ${activeTemplate ? `Operating under the **${activeTemplate.name}** format template.` : 'How can I assist you with your radio broadcast today?'}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: getModelForRole(selectedRole),
      showType: selectedShowType || undefined
    };
    setMessages([welcomeMsg]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Storage clear error", e);
    }
  };

  const handleCopyText = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to extract radio prompts enclosed in [RADIO PROMPT]...[/RADIO PROMPT] or quotes
  const extractRadioPrompt = (text: string): string | null => {
    const blockMatch = text.match(/\[RADIO PROMPT\]([\s\S]*?)\[\/RADIO PROMPT\]/i);
    if (blockMatch && blockMatch[1].trim()) {
      return blockMatch[1].trim();
    }
    const codeBlockMatch = text.match(/```(?:prompt)?\n([\s\S]*?)```/i);
    if (codeBlockMatch && codeBlockMatch[1].trim() && codeBlockMatch[1].length > 30) {
      return codeBlockMatch[1].trim();
    }
    return null;
  };

  // Render text with simple markdown-like formatting
  const renderMessageContent = (content: string, msgId: string) => {
    const extractedPrompt = extractRadioPrompt(content);
    const cleanedContent = content.replace(/\[RADIO PROMPT\]([\s\S]*?)\[\/RADIO PROMPT\]/gi, (match, p1) => {
      return `\n\n> 📻 **Suggested Radio Show Prompt:**\n> "${p1.trim()}"\n\n`;
    });

    const lines = cleanedContent.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return <h4 key={idx} className="font-bold text-white text-base mt-2 mb-1">{line.replace('### ', '')}</h4>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="font-black text-white text-lg mt-3 mb-1">{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('# ')) {
            return <h2 key={idx} className="font-black text-white text-xl mt-3 mb-1">{line.replace('# ', '')}</h2>;
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="border-l-2 border-io-blue pl-3 py-1 my-1.5 bg-io-blue/10 rounded-r text-white/95 italic">
                {renderFormattedInline(line.replace('> ', ''))}
              </blockquote>
            );
          }
          if (line.startsWith('* ') || line.startsWith('- ')) {
            return (
              <div key={idx} className="flex gap-2 items-start pl-1">
                <span className="text-io-blue shrink-0 mt-1">•</span>
                <span>{renderFormattedInline(line.replace(/^[\*\-]\s+/, ''))}</span>
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx}>{renderFormattedInline(line)}</p>;
        })}

        {/* Action card if Gemini suggested a ready-to-run prompt */}
        {extractedPrompt && onApplyPrompt && (
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 bg-io-blue/10 p-3 rounded-xl border border-io-blue/20">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Radio className="w-3.5 h-3.5 text-io-blue shrink-0 animate-pulse" />
              <span>Broadcast Prompt Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyText(extractedPrompt, `prompt-${msgId}`)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedId === `prompt-${msgId}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === `prompt-${msgId}` ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onApplyPrompt(extractedPrompt);
                  setAppliedPromptId(msgId);
                  setTimeout(() => setAppliedPromptId(null), 3000);
                }}
                className="px-3 py-1 rounded-lg bg-io-blue hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {appliedPromptId === msgId ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>Applied to Studio!</span>
                  </>
                ) : (
                  <>
                    <span>Apply to Studio</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFormattedInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const currentSuggestions = activeTemplate ? activeTemplate.samplePrompts : INITIAL_SUGGESTIONS;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop on small screens */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:bg-transparent lg:pointer-events-none"
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] md:w-[500px] z-50 bg-[#0d0d10] border-l border-white/10 flex flex-col shadow-[-12px_0_50px_rgba(0,0,0,0.85)] font-sans"
          >
            {/* Top Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-io-blue via-indigo-500 to-amber-400 p-0.5 shadow-md shadow-io-blue/20 flex items-center justify-center">
                  <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-io-blue animate-pulse" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white tracking-tight">Radio Director AI</h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-io-blue/20 text-io-blue border border-io-blue/30">
                      GEMINI
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50">Production advisor & show architect</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  title="Close Director"
                  className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Role & Model Selector Tabs */}
            <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                Advisory Role:
              </span>
              <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5 flex-1 max-w-xs justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedRole('director')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedRole === 'director'
                      ? 'bg-io-blue text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>Director</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('prompt_architect')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedRole === 'prompt_architect'
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>Fast Prompts</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('script_doctor')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedRole === 'script_doctor'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>Script</span>
                </button>
              </div>
            </div>

            {/* Show Format Templates Selector Bar */}
            <div className="px-4 py-2.5 bg-neutral-950/70 border-b border-white/5 shrink-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                  <Layers className="w-3 h-3 text-io-blue" />
                  <span>Show Type Template:</span>
                </div>
                {selectedShowType && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedShowType(null);
                      setShowStructurePreview(false);
                    }}
                    className="text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    title="Reset to flexible format"
                  >
                    <span>Clear Template</span>
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShowType(null);
                    setShowStructurePreview(false);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                    !selectedShowType
                      ? 'bg-white/15 text-white border-white/20 shadow-xs font-bold'
                      : 'bg-white/[0.03] text-white/60 hover:text-white border-white/5'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Flexible</span>
                </button>

                {SHOW_TYPES.map((tpl) => {
                  const isSelected = selectedShowType === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedShowType(tpl.id);
                        setShowStructurePreview(false);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[11px] whitespace-nowrap shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? `${tpl.badgeBg} font-bold shadow-sm ring-1 ring-white/10`
                          : 'bg-white/[0.03] text-white/60 hover:text-white border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span>{tpl.emoji}</span>
                      <span>{tpl.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Episode Context Chip */}
            {currentShow?.title && (
              <div className="px-4 py-2 bg-io-blue/[0.06] border-b border-io-blue/15 flex items-center justify-between text-xs shrink-0">
                <div className="flex items-center gap-2 truncate text-white/80">
                  <Radio className="w-3.5 h-3.5 text-io-blue shrink-0" />
                  <span className="text-[11px] text-white/50">Active Show:</span>
                  <span className="font-bold truncate text-[11px] text-white">{currentShow.title}</span>
                </div>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60 shrink-0">
                  {currentShow.language?.toUpperCase() || 'EN'}
                </span>
              </div>
            )}

            {/* Active Template Spotlight Card */}
            {activeTemplate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mx-4 mt-3 mb-1 p-3.5 rounded-2xl border ${activeTemplate.accentBg} ${activeTemplate.borderColor} shrink-0 backdrop-blur-md relative shadow-lg`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-black/40 border border-white/10 shadow-inner">
                      {activeTemplate.emoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-white tracking-wide">{activeTemplate.name}</h4>
                        <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${activeTemplate.badgeBg}`}>
                          Format Active
                        </span>
                      </div>
                      <p className="text-[11px] text-white/80 mt-0.5 line-clamp-1">{activeTemplate.tagline}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedShowType(null)}
                    className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                    title="Remove template"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tone and Pacing Specs */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md bg-black/50 text-white/90 font-mono border border-white/10">
                    Tone: {activeTemplate.tone}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/50 text-white/80 font-mono border border-white/10">
                    {activeTemplate.pacing}
                  </span>
                </div>

                {/* Quick Blueprint Trigger & View Structure */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStructurePreview(!showStructurePreview)}
                    className="text-[11px] text-white/70 hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-medium"
                  >
                    <span>{showStructurePreview ? 'Hide Rundown' : 'View Rundown'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showStructurePreview ? 'rotate-90' : ''}`} />
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleSendMessage(activeTemplate.blueprintPrompt)}
                    className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Generate Blueprint</span>
                  </button>
                </div>

                {/* Collapsible 5-Step Structure Preview */}
                {showStructurePreview && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2.5 pt-2.5 border-t border-white/10 text-xs space-y-1.5 text-white/90 font-sans"
                  >
                    <p className="font-bold text-[10px] uppercase tracking-wider text-white/60 mb-1">Standard Broadcast Run-Down:</p>
                    {activeTemplate.structure.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/85 text-[11px]">
                        <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-mono shrink-0 text-white/80">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const msgTemplate = msg.showType ? SHOW_TYPES.find(t => t.id === msg.showType) : null;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-io-blue to-io-green p-0.5 shrink-0 mt-0.5">
                        <div className="w-full h-full bg-neutral-950 rounded-[6px] flex items-center justify-center">
                          <Bot className="w-3.5 h-3.5 text-io-blue" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`relative group rounded-2xl p-4 ${
                        isUser
                          ? 'bg-io-blue/20 border border-io-blue/30 text-white rounded-tr-xs max-w-[85%]'
                          : 'bg-white/[0.04] border border-white/10 text-white/90 rounded-tl-xs max-w-[90%]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-white/40">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold tracking-wider uppercase">
                            {isUser ? 'You' : msg.model ? `Director (${msg.model})` : 'Director AI'}
                          </span>
                          {msgTemplate && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-white/10 text-white/70">
                              {msgTemplate.emoji} {msgTemplate.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.content, msg.id)}
                              className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity cursor-pointer"
                              title="Copy response"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {renderMessageContent(msg.content, msg.id)}
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-white/80" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing / Thinking Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start items-center"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-io-blue to-io-green p-0.5 shrink-0">
                    <div className="w-full h-full bg-neutral-950 rounded-[6px] flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-io-blue animate-pulse" />
                    </div>
                  </div>
                  <div className="bg-white/[0.04] border border-white/10 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-2 text-white/60 text-xs">
                    <Loader2 className="w-3.5 h-3.5 text-io-blue animate-spin" />
                    <span>
                      {activeTemplate 
                        ? `Gemini is composing ${activeTemplate.name} radio direction...`
                        : "Gemini is composing radio direction..."
                      }
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Inspiration Pills tailored to active template */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/40 overflow-x-auto scrollbar-hide flex gap-2 shrink-0">
              {currentSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(item.text)}
                  className="px-2.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/10 text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3.5 border-t border-white/10 bg-[#09090b] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative flex items-end gap-2 bg-white/[0.03] border border-white/10 rounded-2xl p-2 focus-within:border-io-blue/60 transition-colors"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeTemplate
                      ? `Ask for ${activeTemplate.name} advice (${getModelForRole(selectedRole)})...`
                      : `Ask Director AI (${getModelForRole(selectedRole)})...`
                  }
                  rows={2}
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-white text-xs md:text-sm placeholder-white/30 resize-none outline-none p-1.5 scrollbar-hide"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-io-blue hover:bg-blue-600 disabled:opacity-40 disabled:hover:bg-io-blue text-white transition-all cursor-pointer shrink-0 shadow-md shadow-io-blue/20"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-white/35">
                <span>Enter to send · Shift+Enter for newline</span>
                <span>
                  {activeTemplate ? `${activeTemplate.emoji} ${activeTemplate.name} Active` : "Powered by Google Gemini"}
                </span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
