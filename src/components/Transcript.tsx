import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocateFixed } from 'lucide-react';
import { TranscriptLine } from '../types';

interface TranscriptProps {
  transcript: TranscriptLine[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export function Transcript({ transcript, currentTime, onSeek }: TranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const [isUserScrolling, setIsUserScrolling] = useState<boolean>(false);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const programmaticTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastIndexRef = useRef<number>(-1);

  const activeIndex = transcript.findIndex(line => currentTime >= line.start && currentTime < line.end);

  // Smoothly center the target index in the transcript container
  const scrollToLine = useCallback((index: number, behavior: 'smooth' | 'auto' = 'smooth') => {
    const container = containerRef.current;
    if (!container || index < 0 || index >= transcript.length) return;

    const element = document.getElementById(`transcript-line-${index}`);
    if (!element) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    // Exact vertical offset relative to container's scroll coordinate system
    const elementTopInContainer = (elementRect.top - containerRect.top) + container.scrollTop;
    const elementCenter = elementTopInContainer + (elementRect.height / 2);
    const targetScrollTop = elementCenter - (container.clientHeight / 2);

    isProgrammaticScrollRef.current = true;
    if (programmaticTimeoutRef.current) {
      clearTimeout(programmaticTimeoutRef.current);
    }
    // Release programmatic scroll flag once smooth scrolling animation finishes
    programmaticTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 650);

    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior
    });
  }, [transcript.length]);

  // Handle auto-scroll whenever active segment updates during playback
  useEffect(() => {
    if (activeIndex !== -1 && activeIndex !== lastIndexRef.current) {
      const isJump = lastIndexRef.current === -1 || Math.abs(activeIndex - lastIndexRef.current) > 1;
      lastIndexRef.current = activeIndex;

      if (!isUserScrolling) {
        scrollToLine(activeIndex, isJump ? 'auto' : 'smooth');
      }
    }
  }, [activeIndex, isUserScrolling, scrollToLine]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (programmaticTimeoutRef.current) clearTimeout(programmaticTimeoutRef.current);
    };
  }, []);

  // Detect manual user scrolling and temporarily pause auto-scroll
  const handleUserInteraction = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;

    setIsUserScrolling(true);
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }

    // Auto-resume after 4 seconds of inactivity
    resumeTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      const currentIdx = transcript.findIndex(line => currentTime >= line.start && currentTime < line.end);
      if (currentIdx !== -1) {
        scrollToLine(currentIdx, 'smooth');
      }
    }, 4000);
  }, [currentTime, transcript, scrollToLine]);

  // Resume auto-scroll immediately on user request
  const resumeAutoScroll = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    setIsUserScrolling(false);
    const currentIdx = transcript.findIndex(line => currentTime >= line.start && currentTime < line.end);
    if (currentIdx !== -1) {
      scrollToLine(currentIdx, 'smooth');
    }
  }, [currentTime, transcript, scrollToLine]);

  // User click on a specific line: seek playback and center line immediately
  const handleLineClick = (lineStart: number, index: number) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    setIsUserScrolling(false);
    onSeek(lineStart);
    scrollToLine(index, 'smooth');
  };

  return (
    <div className="relative h-full w-full">
      <div 
        ref={containerRef}
        onWheel={handleUserInteraction}
        onTouchMove={handleUserInteraction}
        onScroll={handleUserInteraction}
        className="relative h-full overflow-y-auto scrollbar-hide px-8 pt-[35vh] pb-[45vh]"
      >
        <div className="flex flex-col gap-10">
          {transcript.map((line, index) => {
            const isActive = currentTime >= line.start && currentTime < line.end;
            
            return (
              <motion.div
                key={`${line.start}-${index}`}
                id={`transcript-line-${index}`}
                ref={isActive ? activeLineRef : null}
                initial={{ opacity: 0.1 }}
                animate={{ 
                  opacity: 1,
                }}
                onClick={() => handleLineClick(line.start, index)}
                className="relative cursor-pointer transition-all duration-500 group pl-12"
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeBar"
                    className="absolute left-0 top-1 bottom-1 w-1 bg-gradient-to-b from-[#4285f4] to-[#f4b400] rounded-full shadow-[0_0_15px_rgba(66,133,244,0.4)]"
                  />
                )}
                
                <div className="flex gap-14 items-start">
                  <span className={`font-mono text-xs tabular-nums pt-0.5 tracking-wider w-12 shrink-0 ${isActive ? 'text-[#5770ff] font-bold' : 'text-[#353e6d] font-semibold'}`}>
                    {formatTime(line.start)}
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {line.speaker && (
                      <span className={`text-[10px] uppercase tracking-[0.25em] font-extrabold mt-0.5 ${isActive ? 'text-io-green' : 'text-neutral-500'}`}>
                        {line.speaker}
                      </span>
                    )}
                    <p className={`leading-snug transition-all duration-500 text-lg font-medium tracking-tight ${
                      isActive 
                        ? 'text-white' 
                        : 'text-neutral-500 group-hover:text-neutral-300'
                    }`}>
                      {line.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Auto-Scroll Paused / Re-center Pill */}
      <AnimatePresence>
        {isUserScrolling && activeIndex !== -1 && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={resumeAutoScroll}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/95 border border-white/15 text-xs font-semibold text-white/90 shadow-[0_8px_30px_rgb(0_0_0/0.7)] backdrop-blur-md hover:bg-neutral-800 hover:border-io-blue/50 transition-all cursor-pointer group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span>Auto-scroll paused</span>
            <span className="text-white/30">·</span>
            <span className="text-io-blue group-hover:text-blue-300 flex items-center gap-1 font-bold">
              Re-center
              <LocateFixed className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
