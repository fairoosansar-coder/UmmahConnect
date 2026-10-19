export interface ShowTypeTemplate {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  accentBg: string;
  borderColor: string;
  badgeBg: string;
  tone: string;
  pacing: string;
  recommendedDuration: string;
  recommendedMood: string;
  soundCues: string[];
  structure: string[];
  blueprintPrompt: string;
  samplePrompts: {
    label: string;
    text: string;
  }[];
}

export const SHOW_TYPES: ShowTypeTemplate[] = [
  {
    id: 'morning_news',
    name: 'Morning News',
    tagline: 'High-energy breakfast drive, breaking headlines, traffic & snappy banter',
    emoji: '🌅',
    accentBg: 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 text-amber-300 border-amber-500/30',
    borderColor: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    tone: 'Brisk, witty, uplifting & time-conscious',
    pacing: 'Rapid-fire (<45s per headline) with lively audio stingers',
    recommendedDuration: '3',
    recommendedMood: 'Lively Debate',
    soundCues: ['Upbeat synth intro bed', 'Morning stinger cue', 'Coffee cup clink', 'Traffic report chime', 'Punchy transition bumper'],
    structure: [
      'Catchy morning drive intro stinger & energy cue',
      'Top 3 rapid-fire news headlines',
      'Dual-anchor banter & hot take on a trending tech/local topic',
      'Commute / weather checkpoint',
      'Punchy outro into upbeat music track'
    ],
    blueprintPrompt: "Design a broadcast-ready prompt and complete script blueprint for a high-energy Morning News talk radio show. Include intro stinger cues, two contrasting witty co-hosts trading 3 rapid headlines, and dynamic breakfast banter.",
    samplePrompts: [
      {
        label: "🌅 Colombo Morning Drive",
        text: "Draft a high-energy 3-minute Morning News show prompt set in Colombo with weather, tech commute traffic, and witty banter between two early-riser hosts."
      },
      {
        label: "⚡ Breaking AI Headlines",
        text: "Give me script instructions for a rapid-fire Morning News segment covering 3 major AI breakthroughs with sharp anchor punchlines."
      },
      {
        label: "📻 Headline Transitions",
        text: "How should two Morning News anchors transition smoothly between a serious headline and an amusing community human-interest story?"
      }
    ]
  },
  {
    id: 'nightly_storytime',
    name: 'Nightly Storytime',
    tagline: 'Soothing nocturnal narratives, soft ambient soundscapes & bedtime tales',
    emoji: '🌙',
    accentBg: 'bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-indigo-500/5 text-indigo-300 border-indigo-500/30',
    borderColor: 'border-indigo-500/30',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    tone: 'Gentle, contemplative, sensory, serene',
    pacing: 'Deliberate, unhurried cadence with soothing pauses & rain/cricket ambience',
    recommendedDuration: '5',
    recommendedMood: 'Casual & Chill',
    soundCues: ['Soft monsoon rain on clay roof', 'Night crickets ambience', 'Gentle acoustic guitar nylon chords', 'Distant ocean swell', 'Warm vinyl fireplace crackle'],
    structure: [
      'Soft rain / night crickets ambient soundscape bed',
      'Atmospheric scene-setting opening',
      'Vivid sensory narrative chapter',
      'Quiet dual-host reflection & philosophical takeaway',
      'Peaceful bedtime fade-out'
    ],
    blueprintPrompt: "Architect a bedtime radio broadcast prompt and full narrative structure for a Nightly Storytime episode. Focus on atmospheric sound cues (rain, gentle acoustic guitar), soothing dual-narrator cadence, and vivid sensory storytelling.",
    samplePrompts: [
      {
        label: "🌙 Galle Fort Moonlight",
        text: "Create a Nightly Storytime prompt about a peaceful midnight walk along the ramparts of Galle Fort with soft ocean wave audio cues."
      },
      {
        label: "🌧️ Monsoon Rain Bedtime Tale",
        text: "What script instructions and vocal cues make a cozy monsoon rain bedtime story deeply relaxing for listeners?"
      },
      {
        label: "✨ Philosophical Reflection",
        text: "Draft a dual-narrator late night story prompt where two reflective hosts discuss the calm beauty of the night sky."
      }
    ]
  },
  {
    id: 'expert_panel',
    name: 'Expert Panel Discussion',
    tagline: 'Deep-dive analytical debates, moderated roundtables & fact-checks',
    emoji: '🎙️',
    accentBg: 'bg-gradient-to-r from-blue-500/15 via-cyan-500/10 to-blue-500/5 text-cyan-300 border-cyan-500/30',
    borderColor: 'border-cyan-500/30',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    tone: 'Inquisitive, authoritative, respectful, analytical',
    pacing: 'Thoughtful structured turns with crisp rebuttals & moderator synthesis',
    recommendedDuration: '5',
    recommendedMood: 'Roundtable',
    soundCues: ['Subtle studio room tone', 'Opening thesis chime', 'Cross-table rebuttal stinger', 'Fact-check data cue', 'Closing gong/bell tone'],
    structure: [
      'Moderator frames central thesis & guest credentials',
      'Opening arguments: Pragmatist vs Skeptic perspectives',
      'Cross-examination & counter-evidence',
      'Moderator intervention & audience takeaway',
      'Synthesized closing conclusions'
    ],
    blueprintPrompt: "Produce a broadcast prompt and complete roundtable framework for an Expert Panel Discussion. Include a firm moderator and two contrasting subject-matter experts passionately debating a future-facing topic.",
    samplePrompts: [
      {
        label: "🎙️ Open Source vs Frontier AI",
        text: "Create a structured Expert Panel Discussion prompt between a regulatory AI ethicist and an open-source engineer, moderated by an inquisitive host."
      },
      {
        label: "⚖️ Moderator Interventions",
        text: "How should an expert panel moderator intervene effectively when two guests begin talking over each other or repeating points?"
      },
      {
        label: "💡 Clean Energy Transition",
        text: "Draft a 4-minute roundtable prompt analyzing the economic realities of green transition with distinct expert perspectives."
      }
    ]
  },
  {
    id: 'cultural_street',
    name: 'Cultural & Street Pulse',
    tagline: 'Colombo street beats, bilingual food trails & lively community banter',
    emoji: '🇱🇰',
    accentBg: 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 text-emerald-300 border-emerald-500/30',
    borderColor: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    tone: 'Vibrant, warm, colloquial, humorous',
    pacing: 'Dynamic street energy with rhythmic sound effects (tuk-tuks, kottu sizzle)',
    recommendedDuration: '3',
    recommendedMood: 'Casual & Chill',
    soundCues: ['Tuk-tuk horn honks', 'Sizzling kottu metal blade rhythm', 'Pettah market street ambience', 'Ceylon tea spoon stirring glass', 'Upbeat baila rhythm bed'],
    structure: [
      'Urban street sound bed (tuk-tuk horns, street buzz)',
      'Local neighborhood deep dive',
      'Culinary / cultural debate (e.g. Kottu showdown)',
      'Listener voice note / community shout-out',
      'Warm bilingual sign-off'
    ],
    blueprintPrompt: "Generate a vibrant Colombo Street Pulse talk radio prompt celebrating local food culture, street sounds, and lively banter with authentic code-switching in English, Tamil, and Sinhala.",
    samplePrompts: [
      {
        label: "🇱🇰 Colombo Kottu Showdown",
        text: "Draft a Colombo street food showdown prompt between kottu roti and isso vade featuring authentic street ambience cues."
      },
      {
        label: "🗣️ Trilingual Banter",
        text: "How can radio hosts naturally weave English, Tamil, and Sinhala colloquialisms together without sounding forced?"
      },
      {
        label: "🛵 Tuk-Tuk Chronicles",
        text: "Create a fun radio segment prompt featuring humorous observations from Colombo tuk-tuk rides and neighborhood gossip."
      }
    ]
  },
  {
    id: 'true_crime_mystery',
    name: 'True Crime & Audio Mystery',
    tagline: 'Suspenseful investigative storytelling, dramatic tension & cliffhangers',
    emoji: '🔍',
    accentBg: 'bg-gradient-to-r from-rose-500/15 via-red-500/10 to-rose-500/5 text-rose-300 border-rose-500/30',
    borderColor: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    tone: 'Tense, observant, investigative, evocative',
    pacing: 'Suspenseful pauses, ticking tempo shifts, dramatic voice drops',
    recommendedDuration: '5',
    recommendedMood: 'Informative',
    soundCues: ['Deep sub-bass drone cue', 'Antique clock ticking', 'Misty hill country wind gust', 'Police siren Doppler fade', 'Sudden stark audio drop silence'],
    structure: [
      'Chilling prologue hook & cold case discovery',
      'Timeline reconstruction with contrasting witness accounts',
      'Host divergence on critical evidence',
      'Midpoint revelation / shocking twist',
      'Unresolved suspenseful cliffhanger for part 2'
    ],
    blueprintPrompt: "Create a suspenseful investigative audio mystery radio prompt. Feature an atmospheric prologue hook, timeline breakdown with dual investigators, evidence dissection, and an unresolved final cliffhanger.",
    samplePrompts: [
      {
        label: "🔍 Nuwara Eliya Mystery",
        text: "Create a suspenseful radio mystery prompt about an abandoned tea estate in Nuwara Eliya with misty wind and wooden floor creak audio cues."
      },
      {
        label: "⏱️ Building Audio Tension",
        text: "What script writing techniques and pause markers create maximum dramatic tension in a 3-minute radio drama?"
      },
      {
        label: "🎭 Dramatic Voice Shifts",
        text: "How should two investigative hosts modulate their vocal intensity from calm exposition to rising realization?"
      }
    ]
  }
];
