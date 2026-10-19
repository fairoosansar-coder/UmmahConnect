# Centered Transcript Auto-Scrolling with Intelligent Manual Override

A smooth, viewport-centered auto-scrolling experience for the UmmaConnect Talk Radio transcript component, ensuring the active spoken segment remains vertically centered during audio playback while granting listeners full control to inspect upcoming or past transcript lines without jarring scroll fighting.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification and are integrated directly into this specification:

- **Confirmed Decision (Manual Scroll Interaction)**: When the user manually scrolls or touches the transcript view during playback, auto-scrolling temporarily pauses to allow uninterrupted reading, then automatically resumes after 4 seconds of scroll inactivity (or immediately when seeking).
- **Confirmed Decision (Centering & Motion)**: Smooth animated scrolling (`behavior: 'smooth'`) calculating dynamic midpoint centering: `element.offsetTop - (containerHeight / 2) + (elementHeight / 2)`.
- **Confirmed Decision (Visual Styling)**: Retain the active Google blue/amber gradient indicator bar with bright white typography and dark contrast for surrounding inactive lines, accompanied by a clean, unobtrusive floating resume pill when manual scrolling is active.

---

### 1. Overview & Core Concept

- **What It Does**: During radio show playback, the transcript continuously keeps the current speaker's dialogue vertically centered in the reader pane. If the listener scrolls manually to read ahead or check a previous remark, auto-scroll gracefully pauses and provides a quick "Resume Auto-scroll" indicator, returning to smooth centering after inactivity or when seeking to a new timestamp.
- **Target Audience / Persona**: Listeners following along with multi-lingual audio shows (English, Tamil, Sinhala), educational listeners learning language pronunciation, and users seeking quick reference to spoken concepts.
- **Key Value**: Eliminates the need to manually track playback position; text stays centered right at the user's natural reading level without jarring snap-jumps or scroll collisions.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Continuous Playback**: As the audio timeline progresses across speech segments, the active segment smoothly scrolls into the exact vertical center of the transcript container.
  2. **Manual Investigation**: The listener drags the scrollbar or scrolls using mouse wheel/touch. Auto-scrolling detects user intent and suspends programmatic repositioning.
  3. **Auto-Resume & Action**: A subtle, semi-transparent pill badge appears at the bottom-center of the transcript viewport ("Auto-scroll paused · Click to re-center"), disappearing as playback re-centers automatically after 4 seconds of idle time or upon clicking.
  4. **Click-to-Seek**: Clicking any transcript segment immediately seeks audio playback to that timestamp and immediately locks centering onto that segment.

- **Visual Identity & Theme**:
  - *Color Palette & Tokens*: Dark charcoal glassmorphism background (`bg-black/60`), vibrant Google multi-color gradient active line (`from-[#4285f4] to-[#f4b400]`), active timestamp accent (`text-[#5770ff]`), speaker tag (`text-io-green`), and muted non-active text (`text-neutral-500 hover:text-neutral-300`).
  - *Typography*: Monospace tabular timestamps (`font-mono text-xs tabular-nums`), clean sans-serif transcript text (`leading-snug text-lg font-medium`).
  - *Resume Pill*: Floating minimal control (`bg-neutral-900/90 text-xs font-semibold text-white/90 border border-white/10 backdrop-blur-md rounded-full shadow-lg`) with smooth fade-in/fade-out via `framer-motion`.

---

### 3. Key Product Decisions & Trade-Offs

- **Dynamic Midpoint Centering Math vs. Simple Top-Alignment**:
  - *Chosen Approach*: `scrollTop = activeElement.offsetTop - (container.clientHeight / 2) + (activeElement.clientHeight / 2)`.
  - *Why*: True center alignment keeps the reader's eye stationary on the middle third of the screen, providing equal contextual headroom for previous context and upcoming phrases.
  - *Alternatives Considered*: Top offset with 80px padding (current behavior) placed segments too high and felt clipped under the top gradient mask.
- **Scroll Intent Detection (User Gesture vs. Programmatic)**:
  - *Chosen Approach*: Track `wheel`, `touchmove`, and `pointerdown` events on the container to flag direct user interaction, setting an idle timeout (4s) before resetting the flag. Programmatic `scrollTo` calls avoid re-triggering the user pause flag.
  - *Why*: Standard `scroll` events trigger on both programmatic and user scrolls; isolating gesture events prevents infinite auto-pause loops.
- **Instant vs. Smooth on Major Timestamp Jumps**:
  - *Chosen Approach*: If the segment index changes by more than 1 (e.g. user scrubber seek or track skip), use `behavior: 'auto'` to snap immediately to the target without sickening long-distance scroll animations; for natural sequential sentence transitions, use `behavior: 'smooth'`.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                      Audio Player                      │
│      currentTime (seconds) ────► playback updates       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Transcript Component                  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Active Segment Calculation                      │  │
│  │  currentTime matches [start, end) segment        │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Scroll Controller & Centering Math              │  │
│  │  • check: isUserInteracting (gesture flag)       │  │
│  │  • target = offsetTop - (H_container/2) + (H/2)  │  │
│  │  • container.scrollTo({ top, behavior })         │  │
│  └────────┬─────────────────────────────────────────┘  │
│           │                                            │
│    User scrolls?                                       │
│    ├── Yes ──► Set paused state + start 4s timer       │
│    │           Show floating "Re-center" button        │
│    └── Timeout / Seek ──► Resume auto-scroll & center  │
└────────────────────────────────────────────────────────┘
```

- **State Management & Ref Strategy**:
  - `containerRef`: Direct DOM access to scroll container.
  - `isUserInteractingRef` / `isPaused`: State to pause automated centering when user is actively scrolling.
  - `resumeTimerRef`: Cleanup and reset mechanism for 4-second delay.
  - `programmaticScrollRef`: Prevents false positives during animated scrolling.
- **Files Modified**:
  - `src/components/Transcript.tsx`: Updated centering logic, user scroll detection, smooth scrolling behavior, and optional re-center control.
