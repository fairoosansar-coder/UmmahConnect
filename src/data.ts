import { RadioShow, RawRadioShow } from './types';

function parseTimecode(time: string): number {
  const [mins, secs] = time.split(':').map(Number);
  return mins * 60 + secs;
}

export function transformShow(raw: RawRadioShow): RadioShow {
  const transcript = raw.timecoded_transcript.map((line, i, arr) => {
    const start = parseTimecode(line.timecode);
    const nextLine = arr[i + 1];
    const end = nextLine ? parseTimecode(nextLine.timecode) : parseTimecode(raw.show_duration);
    
    return {
      start,
      end,
      speaker: line.speaker,
      text: line.text,
    };
  });

  return {
    title: raw.show_title,
    duration: parseTimecode(raw.show_duration),
    summary: raw.two_sentence_summary,
    date: raw.date_of_generation,
    host: raw.timecoded_transcript[0]?.speaker || "Host",
    coverImage: raw.coverImage || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    audioUrl: raw.audioUrl || "https://www.gstatic.com/aistudio/starter-apps/assets/ai_radio/ai_radio.mp3",
    notesUrl: raw.notesUrl,
    transcript,
    language: raw.language || 'en',
  };
}

export const RAW_MOCK_SHOW_EN: RawRadioShow = {
  "show_title": "The Jagged Frontier: Vibe Coding and Valve's Open Windows",
  "show_duration": "05:01",
  "two_sentence_summary": "Jordan leads an intellectual discussion on the rise of 'vibe coding' and the potential for agentic engineering to disrupt traditional software quality standards. The episode also covers Valve's decision to open-source Steam Controller hardware files and the digital longevity of SQLite.",
  "date_of_generation": "2026-05-07",
  "language": "en",
  "coverImage": "https://www.gstatic.com/aistudio/starter-apps/assets/ai_radio/cover.jpg",
  "audioUrl": "https://www.gstatic.com/aistudio/starter-apps/assets/ai_radio/ai_radio.mp3",
  "notesUrl": "/shows/default/show_notes.json",
  "timecoded_transcript": [
    {
      "timecode": "00:00",
      "speaker": "Jordan",
      "text": "If you can go from writing two hundred lines of code a day to two thousand with an AI agent, are you actually a better engineer? Or are you just... vibing?"
    },
    {
      "timecode": "00:13",
      "speaker": "Jordan",
      "text": "Good afternoon. I’m Jordan, broadcasting from our London studio. Today we’re diving into the 'jagged frontier' of vibe coding, Valve’s surprising move into open hardware files, and the Library of Congress’s favorite database. We start with the debate that’s set Hacker News ablaze: the rise of Agentic Engineering. Our first caller is Marcus from San Francisco."
    },
    {
      "timecode": "00:40",
      "speaker": "Marcus",
      "text": "Hey Jordan! Look, I... I think people are being way too precious about this. Simon Willison’s point about 'vibe coding' is spot on. If I’ve been writing Perl for thirty years and I just want to whip up a little JavaScript app for my wife... who cares if the internal design is 'perfect'? It’s about the result, not the ritual."
    },
    {
      "timecode": "01:13",
      "speaker": "Jordan",
      "text": "An interesting take on utility. But what about the technical debt? Elena is calling from Berlin."
    },
    {
      "timecode": "01:24",
      "speaker": "Elena",
      "text": "Marcus is describing the normalization of deviance. It is dangerous. When you produce two thousand lines a day, the review burden doesn't disappear, it multiplies. If the code compiles, people just shrug and ship it. It’s not engineering anymore. It’s just generating future disasters."
    },
    {
      "timecode": "02:01",
      "speaker": "Jordan",
      "text": "The 'jagged frontier' indeed. Moving from the software we write to the hardware we hold—Valve has released the CAD files for the Steam Controller under a Creative Commons license. Chloe is on the line from Seattle."
    },
    {
      "timecode": "02:19",
      "speaker": "Chloe",
      "text": "This is a huge win! I mean, finally. I’ve got a 3D printer and my back panel broke. Now I can just print a new one. And for accessibility, you can design custom grips or controller sweaters for people with motor needs. It’s Valve being the good guys again."
    },
    {
      "timecode": "02:41",
      "speaker": "Jordan",
      "text": "A win for the right-to-repair, certainly. But our next caller, Raj from Bangalore, has some reservations about the fine print."
    },
    {
      "timecode": "02:51",
      "speaker": "Raj",
      "text": "I mean... yeah, it’s friendly, but look at the license: CC BY-NC-SA. That Non-Commercial clause is a bit of a joke in the open-source world. You can’t really build a repair business helping people with these parts. It’s a very comfortable walled garden, but it’s still a wall."
    },
    {
      "timecode": "03:22",
      "speaker": "Jordan",
      "text": "A walled garden with open windows, perhaps. Finally, a nod to the classics. SQLite has officially been recommended by the Library of Congress for digital preservation. We have Sam calling from Chicago."
    },
    {
      "timecode": "03:37",
      "speaker": "Sam",
      "text": "It’s about time! SQLite is the gold standard for 'it just works.' No server, no complex setup. If I want my data to be readable in fifty years, I’m putting it in an .sqlite file. It’s readable, OS-independent, solid engineering."
    },
    {
      "timecode": "04:03",
      "speaker": "Jordan",
      "text": "Solid for history, but what about the enterprise? Sarah joins us from Austin."
    },
    {
      "timecode": "04:10",
      "speaker": "Sarah",
      "text": "Look, I love SQLite for a local cache, but in a corporate environment? It makes it way too easy for some dev to spin up a database that’s just a loose file on their laptop. Then that file gets copied to Slack or a thumb drive. If there’s customer data in there, you’ve lost control of your security perimeter."
    },
    {
      "timecode": "04:43",
      "speaker": "Jordan",
      "text": "From the longevity of our archives to the vibes of our IDEs, the tools are evolving faster than our habits. I’d like to thank Marcus, Elena, Chloe, Raj, Sam, and Sarah for joining the conversation. I’m Jordan, and this is UmmaConnect Talk Radio. Stay curious, stay skeptical. Good night."
    }
  ]
};

export const RAW_MOCK_SHOW_TA: RawRadioShow = {
  "show_title": "தொழில்நுட்ப அலைகள்: செயற்கை நுண்ணறிவும் மென்பொருள் எதிர்காலமும்",
  "show_duration": "04:48",
  "two_sentence_summary": "கொழும்பு அரங்கிலிருந்தான இந்த நேரலை விவாதத்தில் தொகுப்பாளர் கவிதா மற்றும் யாழ்ப்பாணம், கண்டி, மட்டக்களப்பு பகுதி நேயர்கள் செயற்கை நுண்ணறிவின் வளர்ச்சி, நவீன நிரலாக்க முறைகள் மற்றும் இலங்கை இளைஞர்களுக்கான தொழில் வாய்ப்புகளை விவாதிக்கின்றனர்.",
  "date_of_generation": "2026-10-14",
  "language": "ta",
  "coverImage": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
  "audioUrl": "https://www.gstatic.com/aistudio/starter-apps/assets/ai_radio/ai_radio.mp3",
  "notesUrl": "/shows/default/show_notes.json",
  "timecoded_transcript": [
    {
      "timecode": "00:00",
      "speaker": "கவிதா",
      "text": "செயற்கை நுண்ணறிவு உதவியுடன் சில நிமிடங்களில் ஒரு முழுமையான செயலியை உருவாக்க முடியும் என்றால், நிரலாளர்களின் எதிர்கால பங்கு என்னவாக மாறும்?"
    },
    {
      "timecode": "00:15",
      "speaker": "கவிதா",
      "text": "அனைவருக்கும் இனிய வணக்கம். நான் உங்கள் தொகுப்பாளர் கவிதா, கொழும்பு வானொலி அரங்கிலிருந்தான 'தொழில்நுட்ப அலைகள்' நிகழ்ச்சிக்கு உங்களை அன்புடன் வரவேற்கிறேன். இன்று நாம் ஏஐ ஏஜெண்டுகளின் வருகை, வைப் கோடிங் மற்றும் இலங்கையின் மென்பொருள் துறை எதிர்கொள்ளும் சவால்கள் குறித்து பேசவிருக்கிறோம். யாழ்ப்பாணத்திலிருந்து பிரவீன் நமது முதலாவது அழைப்பில் இணைகிறார்."
    },
    {
      "timecode": "00:45",
      "speaker": "பிரவீன்",
      "text": "வணக்கம் கவிதா அக்கா! இன்றைய காலகட்டத்தில் சிறிய ஸ்டார்ட்அப் நிறுவனங்களுக்கு இந்த ஏஐ கருவிகள் ஒரு வரப்பிரசாதம். நாங்கள் யாழ்ப்பாணத்தில் ஒரு சிறிய குழுவாக இருந்துகொண்டு, ஒரு முழு மென்பொருளை சில நாட்களிலேயே உருவாக்கி உலக சந்தைக்கு கொண்டுவர முடிகிறது. தொழில்நுட்பம் இப்போது ஜனநாயகப்படுத்தப்பட்டுள்ளது என்றுதான் நான் கூறுவேன்."
    },
    {
      "timecode": "01:15",
      "speaker": "கவிதா",
      "text": "வேகம் முக்கியம்தான், ஆனால் மென்பொருளின் பாதுகாப்பு மற்றும் நம்பகத்தன்மை என்னவாகும்? கொழும்பிலிருந்து அஞ்சலி தனது கருத்தைப் பகிர்கிறார்."
    },
    {
      "timecode": "01:28",
      "speaker": "அஞ்சலி",
      "text": "பிரவீனின் உற்சாகத்தை என்னால் புரிந்துகொள்ள முடிகிறது, ஆனால் ஒரு மூத்த பொறியாளராக எனக்கு இதில் ஆழ்ந்த கவலை உண்டு. தானியங்கி ஏஐ உருவாக்கும் நிரல்களில் பல நுட்பமான பிழைகளும், பாதுகாப்பு இடைவெளிகளும் இருக்கக்கூடும். வெறும் வேகத்திற்காக தரத்தை நாம் பலிகொடுக்க முடியாது. முழுமையான குறியீட்டு பரிசோதனை இன்றி எதையும் உற்பத்திக்கு அனுப்பக்கூடாது."
    },
    {
      "timecode": "02:05",
      "speaker": "கவிதா",
      "text": "மிகவும் நியாயமான சுட்டிக்காட்டல். அடுத்ததாக, திறந்த மூல வன்பொருள் மற்றும் தயாரிப்பு முறைகள் குறித்து பேச மட்டக்களப்பிலிருந்து குமார் இணைகிறார்."
    },
    {
      "timecode": "02:18",
      "speaker": "குமார்",
      "text": "வணக்கம்! மென்பொருளைப் போலவே திறந்த மூல வன்பொருளும் இலங்கையின் உள்ளூர் இளைஞர்களுக்கு மிக அவசியமானது. 3D பிரிண்டிங் மற்றும் ஓபன் சோர்ஸ் மாதிரிகள் மூலம் மருத்துவ உபகரணங்களின் பாகங்கள் மற்றும் விவசாய சென்சார்களை நாம் உள்ளூரிலேயே மிகக் குறைந்த செலவில் தயாரிக்க முடியும். இது நமது நாட்டின் உற்பத்தித் திறனை பன்மடங்கு உயர்த்தும்."
    },
    {
      "timecode": "02:50",
      "speaker": "கவிதா",
      "text": "உள்ளூர் புத்தாக்கங்களை ஊக்குவிக்கும் சிறந்த பார்வை. இறுதியாக, தரவுப் பாதுகாப்பு மற்றும் SQLite போன்ற இலகுரக தரவுத்தளங்கள் பற்றி கண்டியிலிருந்து தினேஷ் இணைகிறார்."
    },
    {
      "timecode": "03:05",
      "speaker": "தினேஷ்",
      "text": "வணக்கம் கவிதா. இன்றைய காலகட்டத்தில் நமது தரவுகள் எங்கே சேமிக்கப்படுகின்றன என்பது தேசிய ரீதியில் மிக முக்கியமான விஷயம். பெரிய கிளவுட் சர்வர்களை மட்டுமே நம்பியிராமல், எளிய ஆஃப்லைன் தரவுத்தளங்களை பயன்படுத்துவது தரவு இறையாண்மைக்கும், குறைந்த இணைய வேகம் கொண்ட கிராமப்புற பகுதிகளுக்கும் பெரும் துணையாக இருக்கும்."
    },
    {
      "timecode": "03:40",
      "speaker": "கவிதா",
      "text": "தொழில்நுட்பத்தின் அதிவேக மாற்றங்களை இலங்கைச் சூழலில் ஆழமாக அலசிய பிரவீன், அஞ்சலி, குமார் மற்றும் தினேஷ் ஆகியோருக்கு எனது மனமார்ந்த நன்றிகள். தொழில்நுட்பத்தை புரிதலோடும் பொறுப்போடும் பயன்படுத்துவோம். நான் உங்கள் கவிதா, இது உம்மாகனெக்ட் டாக் வானொலி. தொடர்ந்து இணைந்திருங்கள்!"
    }
  ]
};

export const RAW_MOCK_SHOW_SI: RawRadioShow = {
  "show_title": "තාක්ෂණ කතිකාවත: කෘතිම බුද්ධිය සහ ශ්‍රී ලංකාවේ තොරතුරු තාක්ෂණ අනාගතය",
  "show_duration": "04:52",
  "two_sentence_summary": "කොළඹ චිත්‍රාගාරයේ සිට නිවේදක කසුන් සමඟ මහනුවර, ගාල්ල, සහ කුරුණෑගල ප්‍රදේශවලින් එක්වන සවන්දෙන්නන් කෘතිම බුද්ධියේ නව ප්‍රවණතා, මෘදුකාංග ක්ෂේත්‍රයේ රැකියා අනාගතය සහ විවෘත තාක්ෂණය පිළිබඳව සාකච්ඡා කරයි.",
  "date_of_generation": "2026-10-14",
  "language": "si",
  "coverImage": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
  "audioUrl": "https://www.gstatic.com/aistudio/starter-apps/assets/ai_radio/ai_radio.mp3",
  "notesUrl": "/shows/default/show_notes.json",
  "timecoded_transcript": [
    {
      "timecode": "00:00",
      "speaker": "කසුන්",
      "text": "කෘතිම බුද්ධිය නිසා පරිගණක කේතකරණය විනාඩි කිහිපයකින් කළ හැකි යුගයක, ශ්‍රී ලංකාවේ මෘදුකාංග ඉංජිනේරුවන්ට සහ තරුණ පරපුරට විවර වන අලුත්ම මාවත කුමක්ද?"
    },
    {
      "timecode": "00:16",
      "speaker": "කසුන්",
      "text": "ආයුබෝවන් සියලු දෙනාටම! කොළඹ ප්‍රධාන ගුවන්විදුලි මැදිරියේ සිට මම කසුන්. අද අපේ 'තාක්ෂණ කතිකාවත' තුළින් අවධානය යොමු කරන්නේ කෘතිම බුද්ධිය හමුවේ මෘදුකාංග ඉංජිනේරු විද්‍යාවේ වෙනස්වීම් සහ විවෘත මූලාශ්‍ර තාක්ෂණය ගැනයි. මුලින්ම කොළඹින් අප හා සම්බන්ධ වන්නේ මෘදුකාංග සංවර්ධකයෙකු වන චතුර."
    },
    {
      "timecode": "00:44",
      "speaker": "චතුර",
      "text": "ආයුබෝවන් කසුන් අයියේ! ඇත්තෙන්ම AI ඒජන්තවරුන් නිසා අපේ කාර්යක්ෂමතාව දස ගුණයකින් වැඩි වෙලා තියෙනවා. පෙර සති ගණනක් ගිය ව්‍යාපෘති දැන් දින කිහිපයකින් නිම කරන්න පුළුවන්. විශේෂයෙන්ම ශ්‍රී ලංකාවේ ආරම්භක ව්‍යාපාර වලට ලෝකයේ ප්‍රමුඛ සමාගම් සමඟ තරඟ කරන්න මේක විශාල අවස්ථාවක්."
    },
    {
      "timecode": "01:14",
      "speaker": "කසුන්",
      "text": "වේගය වැඩිවීම වාසියක් වුණත්, නිෂ්පාදනයේ ගුණාත්මකභාවය සහ ආරක්ෂාව ගැන කුමක් කිව හැකිද? මහනුවරින් නිලූකා අප හා සම්බන්ධ වෙනවා."
    },
    {
      "timecode": "01:28",
      "speaker": "නිලූකා",
      "text": "කසුන්, මම හිතන්නේ අපි අනවශ්‍ය විදිහට මේ AI කේතකරණය මත පමණක් යැපෙන්න හොඳ නැහැ. AI මඟින් ජනනය කරන කේතවල සූක්ෂම දෝෂ සහ ආරක්ෂක හිඩැස් තියෙන්න පුළුවන්. නිසි අධීක්ෂණයකින් තොරව මෙවැනි පද්ධති සජීවීව ක්‍රියාත්මක කිරීමෙන් අනාගතයේදී විශාල ඩිජිටල් අර්බුද නිර්මාණය වෙන්න පුළුවන්."
    },
    {
      "timecode": "02:04",
      "speaker": "කසුන්",
      "text": "ඉතාමත් කාලෝචිත සහ බරපතල අදහසක්. මීළඟට ගාල්ලෙන් ප්‍රදීප් අපට කතා කරන්නේ විවෘත මෘදුකාංග සහ දෘඩාංග නිර්මාණ ගැනයි."
    },
    {
      "timecode": "02:18",
      "speaker": "ප්‍රදීප්",
      "text": "ස්තූතියි කසුන්. මෘදුකාංග වගේම විවෘත දෘඩාංග සහ 3D ප්‍රින්ටර් තාක්ෂණය ලංකාවේ ප්‍රාදේශීය මට්ටමින් ප්‍රචලිත විය යුතුයි. අපේ ගොවිබිම් වලට අවශ්‍ය පාංශු සංවේදක, ස්වයංක්‍රීය ජල සැපයුම් පද්ධති අපිම ලංකාවේ නිර්මාණය කරගන්න මේ විවෘත තාක්ෂණය උපකාරී වෙනවා."
    },
    {
      "timecode": "02:49",
      "speaker": "කසුන්",
      "text": "ස්වයංපෝෂිත ඩිජිටල් සංස්කෘතියක් පිළිබඳ අපූරු සංකල්පයක්. අවසාන වශයෙන් කුරුණෑගලින් සඳුන් සම්බන්ධ කරගනිමු."
    },
    {
      "timecode": "03:02",
      "speaker": "සඳුන්",
      "text": "ආයුබෝවන්. දත්ත සුරක්ෂිතතාව සහ සැහැල්ලු දත්ත සමුදායන් ගැන කතා කිරීමේදී, SQLite වගේ විසඳුම් ග්‍රාමීය ප්‍රදේශවලට ඉතා වටිනවා. අන්තර්ජාල සම්බන්ධතාවය නොමැතිව වුවත් ක්‍රියාත්මක වන ඔන්-ඩිවයිස් තාක්ෂණය ශ්‍රී ලංකාවට අත්‍යවශ්‍යයි."
    },
    {
      "timecode": "03:36",
      "speaker": "කසුන්",
      "text": "ශ්‍රී ලංකාවේ තාක්ෂණික අනාගතය පිළිබඳ තම සාරවත් අදහස් බෙදාගත් චතුර, නිලූකා, ප්‍රදීප් සහ සඳුන් යන සියලුම දෙනාට බෙහෙවින්ම ස්තූතියි. මම කසුන්, මේ උම්මාකනෙක්ට් ටෝක් රේඩියෝවයි. සුබ දවසක්!"
    }
  ]
};

export const MOCK_SHOW_EN: RadioShow = transformShow(RAW_MOCK_SHOW_EN);
export const MOCK_SHOW_TA: RadioShow = transformShow(RAW_MOCK_SHOW_TA);
export const MOCK_SHOW_SI: RadioShow = transformShow(RAW_MOCK_SHOW_SI);

export const DEFAULT_SHOWS: RadioShow[] = [
  MOCK_SHOW_EN,
  MOCK_SHOW_TA,
  MOCK_SHOW_SI,
];

// Preserves backward compatibility
export const MOCK_SHOW: RadioShow = MOCK_SHOW_EN;
export const RAW_MOCK_SHOW: RawRadioShow = RAW_MOCK_SHOW_EN;
