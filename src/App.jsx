import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const PILLARS = ["Cycle Education","Fasting","Food","Workouts","App Features","Lifestyle","Men","Moon & Rituals","General"];
const PHASES  = ["Menstrual","Follicular","Ovulation","Luteal","Men","General"];
const PLATFORMS = ["Instagram","TikTok","Pinterest","YouTube Shorts"];
const AUDIENCES = ["Women","Men","Both"];
const GROWTH_TAGS = ["Awareness","Trust Building","Education","App Feature Promotion","Premium Teaser","Conversion Focused","Community Building"];
const STATUSES = ["Idea","Draft","Ready for Asset Creation","Assets Created","Video Created","Needs Review","Approved","Scheduled","Posted","Analytics Reviewed","Repurpose Later"];
const SOUND_TYPES = ["Original Audio","Voiceover","Calm Instrumental","Trending Sound","Commercial-Safe Music","Soft Background Music","Silence / No Music"];
const SOUND_MOODS = ["Soft Feminine Wellness","Energising & Uplifting","Calm & Grounding","Motivating & Bold","Dreamy & Slow","Educational & Clear","Masculine & Focused","Spiritual & Ritual"];
const SOUND_SOURCES = ["Add inside TikTok","Add inside Instagram Reels","Add inside YouTube Shorts","Pre-mixed in video file","No music needed"];
const MUSIC_STATUSES = ["Not Needed","Needs Music","Music Added","Posted Without Music"];

const PHASE_COLORS  = { Menstrual:"#c4726a", Follicular:"#8fb5a0", Ovulation:"#d4c574", Luteal:"#b08fbe", Men:"#5a7a6a", General:"#b8c9a3" };
const GROWTH_TAG_COLORS = { "Awareness":"#7ab5d4","Trust Building":"#8fb5a0","Education":"#b8c9a3","App Feature Promotion":"#d4a574","Premium Teaser":"#b08fbe","Conversion Focused":"#c4726a","Community Building":"#d4c574" };
const STATUS_COLORS = { "Idea":"#b8c9a3","Draft":"#d4a574","Ready for Asset Creation":"#8fb5a0","Assets Created":"#7a9e8a","Video Created":"#6b8f7a","Needs Review":"#e8c5a0","Approved":"#5a8a6a","Scheduled":"#4a7a5a","Posted":"#3a6a4a","Analytics Reviewed":"#2d5a3d","Repurpose Later":"#c4a882" };
const MUSIC_STATUS_COLORS = { "Not Needed":"#b8c9a3","Needs Music":"#e8a060","Music Added":"#5a8a6a","Posted Without Music":"#c4726a" };

// ─────────────────────────────────────────────────────────────────────────────
// SOUND PROFILE INTELLIGENCE  (per growth tag)
// ─────────────────────────────────────────────────────────────────────────────
const SOUND_PROFILES = {
  "Awareness":             { mood:"Energising & Uplifting",   type:"Trending Sound",         terms:["morning energy","viral wellness","female empowerment","trending wellness 2025"], addWhere:"Add inside TikTok",            voiceover:false, note:"Trending audio maximises discovery reach on TikTok." },
  "Trust Building":        { mood:"Soft Feminine Wellness",    type:"Calm Instrumental",       terms:["soft wellness","gentle feminine","cycle sync sound","morning reset audio"],    addWhere:"Add inside TikTok",            voiceover:true,  note:"Calm instrumental under voiceover builds intimacy and saves." },
  "Education":             { mood:"Educational & Clear",       type:"Soft Background Music",   terms:["calm study music","soft piano wellness","background wellness audio"],           addWhere:"Add inside TikTok",            voiceover:true,  note:"Keep music very quiet so the voiceover educates clearly." },
  "App Feature Promotion": { mood:"Energising & Uplifting",   type:"Commercial-Safe Music",   terms:["app promo music","clean tech beat","modern wellness audio","brand safe"],       addWhere:"Add inside TikTok",            voiceover:true,  note:"Commercial-safe avoids copyright flags on branded content." },
  "Premium Teaser":        { mood:"Dreamy & Slow",             type:"Calm Instrumental",       terms:["luxury wellness audio","elevated feminine","premium calm","aspirational soft"], addWhere:"Add inside Instagram Reels",   voiceover:true,  note:"Aspirational, soft, elevated feel. Suggests the premium tier." },
  "Conversion Focused":    { mood:"Motivating & Bold",         type:"Trending Sound",          terms:["motivational trending","call to action sound","uplift moment","bold feminine"], addWhere:"Add inside TikTok",            voiceover:false, note:"Trending audio on conversion posts expands reach right when you need clicks." },
  "Community Building":    { mood:"Soft Feminine Wellness",    type:"Original Audio",          terms:["authentic voiceover","real voice wellness","community feel audio"],             addWhere:"Add inside TikTok",            voiceover:true,  note:"Your own voice builds the most community trust. Skip music or keep it very light." },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_TOPICS = [
  { id:1,  title:"Seed Cycling for Follicular Phase Energy",       pillar:"Cycle Education", audience:"Women", phase:"Follicular", platforms:["Instagram","Pinterest"],          status:"Posted",         priority:"High",   created:"2025-01-10", notes:"Very popular — include flaxseeds & pumpkin seeds", source:"Research",           growthTags:["Education","Trust Building"] },
  { id:2,  title:"Gentle Fasting During Your Luteal Phase",        pillar:"Fasting",         audience:"Women", phase:"Luteal",     platforms:["TikTok","Instagram"],             status:"Approved",       priority:"High",   created:"2025-01-11", notes:"Be gentle, mention body cues",                    source:"Community Question", growthTags:["Education","Trust Building"] },
  { id:3,  title:"Men's 16:8 Intermittent Fasting Guide",          pillar:"Men",             audience:"Men",   phase:"Men",        platforms:["TikTok","Instagram","Pinterest"], status:"Needs Review",   priority:"High",   created:"2025-01-12", notes:"Strong men's content needed",                     source:"Brand Strategy",     growthTags:["Awareness","Education"] },
  { id:4,  title:"Ovulation Phase Workout Energy Boost",           pillar:"Workouts",        audience:"Women", phase:"Ovulation",  platforms:["TikTok","Instagram"],             status:"Scheduled",      priority:"Medium", created:"2025-01-13", notes:"High energy, peak phase",                         source:"Content Plan",       growthTags:["Awareness","Community Building"] },
  { id:5,  title:"Nourishing Menstrual Phase Meal Ideas",          pillar:"Food",            audience:"Women", phase:"Menstrual",  platforms:["Pinterest","Instagram"],          status:"Draft",          priority:"Medium", created:"2025-01-14", notes:"Warm, nourishing, iron-rich",                     source:"Community Request",  growthTags:["Education","Trust Building"] },
  { id:6,  title:"App Feature: Cycle Tracking Tutorial",           pillar:"App Features",    audience:"Both",  phase:"General",   platforms:["TikTok","YouTube Shorts","Instagram"], status:"Idea",      priority:"High",   created:"2025-01-15", notes:"Show app UI walkthrough",                         source:"Marketing",          growthTags:["App Feature Promotion","Conversion Focused"] },
  { id:7,  title:"New Moon Reset Ritual for Women",                pillar:"Moon & Rituals",  audience:"Women", phase:"Menstrual",  platforms:["Pinterest","Instagram"],          status:"Repurpose Later",priority:"Low",    created:"2025-01-16", notes:"Beautiful aesthetic potential",                   source:"Trend Research",     growthTags:["Community Building","Trust Building"] },
  { id:8,  title:"Why Fasting Feels Harder Before Your Period",    pillar:"Fasting",         audience:"Women", phase:"Luteal",     platforms:["TikTok","Instagram"],             status:"Posted",         priority:"High",   created:"2025-01-05", notes:"Top performer — repurpose",                       source:"Community",          growthTags:["Education","Trust Building","Awareness"] },
  { id:9,  title:"Unlock Premium: Advanced Cycle Reports",         pillar:"App Features",    audience:"Women", phase:"General",   platforms:["Instagram","TikTok"],              status:"Idea",           priority:"High",   created:"2025-01-17", notes:"Soft premium tease — show the value",             source:"Marketing",          growthTags:["Premium Teaser","Conversion Focused"] },
  { id:10, title:"How Men Can Sync Their Energy to Weekly Rhythms",pillar:"Men",             audience:"Men",   phase:"Men",        platforms:["TikTok","Pinterest"],             status:"Draft",          priority:"High",   created:"2025-01-18", notes:"Energy mapping concept, relatable",               source:"Research",           growthTags:["Awareness","Education","Community Building"] },
];

const INITIAL_PACKAGES = [
  { id:1, topicId:1, title:"Seed Cycling for Follicular Phase", pillar:"Cycle Education", audience:"Women", phase:"Follicular", platforms:["Instagram","Pinterest"], status:"Posted", scheduledDate:"2025-01-14", postedDate:"2025-01-14",
    caption:"Your follicular phase is calling for seeds 💚 Flaxseeds and pumpkin seeds support your body's natural rhythm. Sync your snacks with your cycle and feel the difference. Link in bio to learn more 💚",
    hashtags:"#cyclesyncing #follicularphase #seedcycling #hormonalhealth #cycleaware #lumenflo", cta:"Download the app — link in bio 💚", growthTags:["Education","Trust Building"],
    analytics:{ views:18400, likes:1240, saves:2100, shares:380, comments:94, profileVisits:640, linkInBioClicks:312, appStoreClicks:88, reach:21000, followersGained:142 }},
  { id:2, topicId:8, title:"Why Fasting Feels Harder Before Your Period", pillar:"Fasting", audience:"Women", phase:"Luteal", platforms:["TikTok","Instagram"], status:"Posted", scheduledDate:"2025-01-10", postedDate:"2025-01-10",
    caption:"Nobody told me fasting would feel almost impossible the week before my period 💚 Your luteal phase means higher progesterone, rising cortisol, and more cravings. Your body is asking for more — listen to it. If you feel weak, dizzy, or shaky, break your fast. Always. Link in bio for the full breakdown 💚",
    hashtags:"#lutealphase #intermittentfasting #cycleaware #hormonehealth #lumenflo #fastingwomen", cta:"Full guide — link in bio 💚", growthTags:["Education","Trust Building","Awareness"],
    analytics:{ views:34200, likes:2800, saves:5300, shares:1100, comments:287, profileVisits:1420, linkInBioClicks:680, appStoreClicks:194, reach:40000, followersGained:389 }},
  { id:3, topicId:3, title:"Men's 16:8 Fasting Guide", pillar:"Men", audience:"Men", phase:"Men", platforms:["TikTok","Instagram","Pinterest"], status:"Needs Review", scheduledDate:"2025-01-22", postedDate:null,
    caption:"Men — your fasting approach doesn't need to be complicated 💚 16:8 is a clean, effective window that works with your natural rhythm. Start simple, stay consistent. Link in bio for more 💚",
    hashtags:"#menshealthfasting #intermittentfasting #mens16 #lumenflo #menshealthtips", cta:"Learn more — link in bio 💚", growthTags:["Awareness","Education"], analytics:null },
  { id:4, topicId:2, title:"Gentle Fasting in Luteal Phase", pillar:"Fasting", audience:"Women", phase:"Luteal", platforms:["TikTok","Instagram"], status:"Approved", scheduledDate:"2025-01-23", postedDate:null,
    caption:"Fasting during your luteal phase doesn't have to be all or nothing 💚 Your body is working hard this week. Be gentle with yourself. If you feel weak, dizzy, or shaky — break your fast. Always. Link in bio 💚",
    hashtags:"#lutealphase #intermittentfasting #cycleaware #hormonehealth #lumenflo", cta:"Full guide — link in bio 💚", growthTags:["Education","Trust Building"], analytics:null },
];

const INITIAL_VIDEO_QUEUE = [
  { id:1, topic:"Gentle Fasting in Luteal Phase", phase:"Luteal", platform:"TikTok", status:"Approved", concept:"Soft voiceover on why the luteal phase calls for gentler fasting windows", growthTag:"Trust Building",
    music:{ mood:"Soft Feminine Wellness", recommendedType:"Calm Instrumental", searchTerms:["soft wellness","gentle feminine","cycle sync","morning reset"], addWhere:"Add inside TikTok", useVoiceover:true, musicStatus:"Needs Music", addMusicLater:true, musicAdded:false, soundUsed:"", audioSource:"Calm Instrumental", soundNotes:"Keep it very quiet under voiceover", performanceNotes:"" }},
  { id:2, topic:"Men's 16:8 Fasting Guide", phase:"Men", platform:"TikTok", status:"Needs Review", concept:"Clean practical breakdown of 16:8 for men", growthTag:"Awareness",
    music:{ mood:"Masculine & Focused", recommendedType:"Commercial-Safe Music", searchTerms:["clean male wellness","focused energy beat","masculine calm"], addWhere:"Add inside TikTok", useVoiceover:true, musicStatus:"Needs Music", addMusicLater:true, musicAdded:false, soundUsed:"", audioSource:"Commercial-Safe Music", soundNotes:"Clean direct beat — not feminine", performanceNotes:"" }},
  { id:3, topic:"Ovulation Phase Energy Boost", phase:"Ovulation", platform:"YouTube Shorts", status:"Generating", concept:"High energy ovulation phase workout clips with on-screen text", growthTag:"Community Building",
    music:{ mood:"Energising & Uplifting", recommendedType:"Trending Sound", searchTerms:["morning energy","viral wellness","female empowerment","trending 2025"], addWhere:"Add inside YouTube Shorts", useVoiceover:false, musicStatus:"Needs Music", addMusicLater:true, musicAdded:false, soundUsed:"", audioSource:"Trending Sound", soundNotes:"Search trending wellness audio directly in YouTube Shorts", performanceNotes:"" }},
  { id:4, topic:"Seed Cycling Benefits", phase:"Follicular", platform:"TikTok", status:"Waiting", concept:"Educational explainer with gentle background visuals", growthTag:"Education",
    music:{ mood:"Educational & Clear", recommendedType:"Soft Background Music", searchTerms:["calm study music","soft piano wellness","background wellness audio"], addWhere:"Add inside TikTok", useVoiceover:true, musicStatus:"Not Needed", addMusicLater:false, musicAdded:false, soundUsed:"", audioSource:"Soft Background Music", soundNotes:"Very light, almost inaudible background", performanceNotes:"" }},
  { id:5, topic:"App Feature: Advanced Reports", phase:"General", platform:"TikTok", status:"Waiting", concept:"Quick app walkthrough — Premium teaser style", growthTag:"Premium Teaser",
    music:{ mood:"Dreamy & Slow", recommendedType:"Calm Instrumental", searchTerms:["luxury wellness","elevated feminine","premium calm","aspirational audio"], addWhere:"Add inside TikTok", useVoiceover:true, musicStatus:"Needs Music", addMusicLater:true, musicAdded:false, soundUsed:"", audioSource:"Calm Instrumental", soundNotes:"Aspirational feel — soft and elevated, not upbeat", performanceNotes:"" }},
  { id:6, topic:"New Moon Reset Ritual", phase:"Menstrual", platform:"TikTok", status:"Failed", concept:"Slow calming visual with moon imagery and journaling prompts", growthTag:"Trust Building",
    music:{ mood:"Spiritual & Ritual", recommendedType:"Calm Instrumental", searchTerms:["moon ritual audio","spiritual wellness","night calm feminine","ritual sound"], addWhere:"Add inside TikTok", useVoiceover:false, musicStatus:"Needs Music", addMusicLater:true, musicAdded:false, soundUsed:"", audioSource:"Calm Instrumental", soundNotes:"Atmospheric, slow, almost no beat", performanceNotes:"" }},
];

const WEEKLY_SCHEDULE = {
  "Mon Jan 20":[{ id:2, platform:"Instagram", title:"Why Fasting Feels Harder Before Your Period", phase:"Luteal", status:"Posted", growthTag:"Trust Building" }],
  "Tue Jan 21":[{ id:1, platform:"Pinterest", title:"Seed Cycling for Follicular Phase", phase:"Follicular", status:"Posted", growthTag:"Education" }],
  "Wed Jan 22":[{ id:3, platform:"TikTok", title:"Men's 16:8 Fasting Guide", phase:"Men", status:"Needs Review", growthTag:"Awareness" }],
  "Thu Jan 23":[{ id:4, platform:"Instagram", title:"Gentle Fasting in Luteal Phase", phase:"Luteal", status:"Approved", growthTag:"Education" }],
  "Fri Jan 24":[], "Sat Jan 25":[], "Sun Jan 26":[],
};

const PLATFORM_GROWTH = [
  { platform:"TikTok",    followers:"+389", reach:"40K", saves:"5.3K", clicks:"680", appClicks:"194", score:94 },
  { platform:"Pinterest", followers:"+142", reach:"21K", saves:"2.1K", clicks:"312", appClicks:"88",  score:78 },
  { platform:"Instagram", followers:"+203", reach:"18K", saves:"1.8K", clicks:"240", appClicks:"61",  score:72 },
  { platform:"YouTube",   followers:"+44",  reach:"6K",  saves:"380",  clicks:"88",  appClicks:"22",  score:41 },
];

const TOP_POSTS = [
  { title:"Why Fasting Feels Harder Before Your Period", platform:"TikTok",   phase:"Luteal",     views:"34.2K", saves:"5.3K", appClicks:194, followersGained:389, growthTag:"Trust Building", score:94 },
  { title:"Seed Cycling for Follicular Phase Energy",    platform:"Pinterest", phase:"Follicular", views:"18.4K", saves:"2.1K", appClicks:88,  followersGained:142, growthTag:"Education",      score:78 },
  { title:"Men's Energy & Weekly Rhythm Guide",          platform:"TikTok",   phase:"Men",        views:"12.1K", saves:"1.4K", appClicks:64,  followersGained:98,  growthTag:"Awareness",      score:66 },
];

const GROWTH_RECS = [
  { type:"repeat",  icon:"🔁", msg:"Luteal phase fasting content is your top performer. Create 3 more posts with the same structure — relatable hook, gentle education, safety reminder.", tag:"Trust Building",       action:"Create Similar" },
  { type:"insight", icon:"📌", msg:"Pinterest is driving more link-in-bio clicks than Instagram this week. Prioritise Pinterest pins for app feature promotions.",                         tag:"App Feature Promotion", action:"Add Pinterest Post" },
  { type:"men",     icon:"👥", msg:"Men's fasting content is gaining traction. Schedule another men's post this week to build that audience segment.",                                     tag:"Awareness",             action:"Schedule Men's Post" },
  { type:"convert", icon:"💜", msg:"Cycle education posts build strong trust but you have no Premium teasers live this week. Add one Premium teaser to convert that trust into downloads.", tag:"Premium Teaser",         action:"Create Premium Teaser" },
  { type:"gap",     icon:"⚠️", msg:"App feature posts are missing from this week. App feature content drives the highest app store clicks per impression.",                               tag:"Conversion Focused",    action:"Add App Feature Post" },
  { type:"hook",    icon:"🎯", msg:"TikTok hooks starting with 'Nobody told me…' are outperforming all others. Reuse that hook structure in your next 2 videos.",                        tag:"Awareness",             action:"Note for Generator" },
  { type:"sound",   icon:"🎵", msg:"Videos with calm instrumental backgrounds are earning 2× more saves than silent posts. Check your music queue and ensure no video posts silent.",    tag:"Trust Building",        action:"Open Sound Queue" },
  { type:"retire",  icon:"📉", msg:"General lifestyle posts are getting the lowest saves and zero app clicks. Consider retiring or rethinking this pillar.",                              tag:"Education",             action:"Review Topics" },
];

const MORNING_BRIEFING = {
  readyToPost:[
    { id:2, title:"Why Fasting Feels Harder Before Your Period", platform:"TikTok",   phase:"Luteal",     growthTag:"Trust Building", scheduledTime:"9:00 AM",  musicStatus:"Needs Music",  hasCaption:true, hasAsset:true },
    { id:1, title:"Seed Cycling for Follicular Phase",           platform:"Pinterest", phase:"Follicular", growthTag:"Education",      scheduledTime:"11:00 AM", musicStatus:"Not Needed",   hasCaption:true, hasAsset:true },
  ],
  needsAttention:[
    { type:"approval", msg:"Men's 16:8 Fasting Guide is waiting for your approval",       urgency:"high" },
    { type:"music",    msg:"TikTok for Luteal Fasting needs music before posting",         urgency:"medium" },
    { type:"gap",      msg:"No Premium Teaser is scheduled this week",                     urgency:"medium" },
    { type:"men",      msg:"Only 1 men's post scheduled this week — your minimum is 2",    urgency:"high" },
  ],
  strategyNote:"This week's focus is Trust Building and Education. Your luteal phase fasting content is your strongest trust signal — post it first thing. Follow up Thursday with an App Feature post to capture the conversion while trust is warm.",
  nextDirection:"After this week, shift 30% of content toward Premium Teasers and Conversion posts. Your trust bank is full — time to convert it.",
};

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const I = ({ n, s=18, c="currentColor" }) => {
  const m = {
    dash:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    growth:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    lib:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    cal:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    pkg:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    asset:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    ai:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    vid:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    approve:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    analytics:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    brand:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    settings:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    plus:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    edit:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    refresh:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    search:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    eye:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    warn:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    star:<svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    repurpose:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
    moon:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    upload:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    crown:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"/><path d="M4 20L2 8l6 4 4-7 4 7 6-4-2 12"/></svg>,
    target:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    link:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    phone:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    users:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    save:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
    music:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    copy:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    brief:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    post:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    download:<svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  };
  return m[n] || null;
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED ATOMS
// ─────────────────────────────────────────────────────────────────────────────
const Tag = ({ label, color, size="sm" }) => (
  <span style={{ display:"inline-flex", alignItems:"center", padding:size==="sm"?"2px 9px":"4px 13px", borderRadius:20, fontSize:size==="sm"?10:12, fontWeight:600, fontFamily:"'Jost',sans-serif", letterSpacing:"0.03em", background:`${color}22`, color, border:`1px solid ${color}44`, whiteSpace:"nowrap" }}>{label}</span>
);
const GrowthTagBadge = ({ tag }) => <Tag label={tag} color={GROWTH_TAG_COLORS[tag]||"#8fb5a0"}/>;
const PhaseDot = ({ phase, size=10 }) => <span style={{ width:size, height:size, borderRadius:"50%", background:PHASE_COLORS[phase]||"#b8c9a3", display:"inline-block", flexShrink:0 }}/>;
const Card = ({ children, style={} }) => <div style={{ background:"#faf7f2", borderRadius:16, border:"1px solid #e8e0d0", ...style }}>{children}</div>;
const SectionHead = ({ title, sub }) => (
  <div style={{ marginBottom:22 }}>
    <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:"#2d4a3a", letterSpacing:"0.02em" }}>{title}</h2>
    {sub && <p style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:"#7a8a7a", marginTop:3 }}>{sub}</p>}
  </div>
);
const Btn = ({ children, variant="primary", onClick, style={}, disabled=false }) => {
  const base = { cursor:disabled?"default":"pointer", border:"none", fontFamily:"'Jost',sans-serif", fontSize:13, fontWeight:500, borderRadius:10, display:"inline-flex", alignItems:"center", gap:6, transition:"all 0.18s", opacity:disabled?0.5:1, ...style };
  const vars = { primary:{ background:"linear-gradient(135deg,#5a8a6a,#3a6a4a)", color:"white", padding:"10px 20px" }, ghost:{ background:"#f0ebe0", color:"#3a5a4a", padding:"10px 16px" }, danger:{ background:"#fdf0e8", color:"#c4726a", padding:"10px 16px" }, purple:{ background:"linear-gradient(135deg,#9a6ab8,#7a4a98)", color:"white", padding:"10px 20px" }, sm:{ background:"#f0ebe0", color:"#3a5a4a", padding:"6px 12px", fontSize:11, borderRadius:8 }, teal:{ background:"linear-gradient(135deg,#4a8a9a,#2a6a7a)", color:"white", padding:"10px 18px" } };
  return <button style={{ ...base, ...(vars[variant]||vars.primary) }} onClick={disabled?undefined:onClick}>{children}</button>;
};
const ScoreBar = ({ score, color="#5a8a6a", height=6 }) => (
  <div style={{ height, background:"#f0ebe0", borderRadius:height/2, overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${score}%`, background:`linear-gradient(90deg,${color},${color}aa)`, borderRadius:height/2, transition:"width 0.6s ease" }}/>
  </div>
);
const Toggle = ({ on, onChange }) => (
  <button onClick={()=>onChange(!on)} style={{ width:42, height:23, borderRadius:12, background:on?"#5a8a6a":"#d0c8b8", position:"relative", border:"none", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
    <div style={{ width:17, height:17, borderRadius:"50%", background:"white", position:"absolute", top:3, left:on?22:3, transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }}/>
  </button>
);
const Label = ({ children }) => <label style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a6a5a", display:"block", marginBottom:5 }}>{children}</label>;
const Input = ({ value, onChange, placeholder, style={} }) => <input value={value} onChange={onChange} placeholder={placeholder} className="inp" style={style}/>;
const Select = ({ value, onChange, options, style={} }) => (
  <select value={value} onChange={onChange} className="inp" style={{ cursor:"pointer", ...style }}>
    {options.map(o=><option key={o}>{o}</option>)}
  </select>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function LumenFlow() {
  const [page, setPage]           = useState("briefing");
  const [topics, setTopics]       = useState(INITIAL_TOPICS);
  const [packages, setPackages]   = useState(INITIAL_PACKAGES);
  const [videoQueue, setVideoQueue] = useState(INITIAL_VIDEO_QUEUE);
  const [sideOpen, setSideOpen]   = useState(true);
  const [selTopic, setSelTopic]   = useState(null);
  const [selPkg, setSelPkg]       = useState(null);
  const [selVideo, setSelVideo]   = useState(null);
  const [analyticsTab, setAnalyticsTab] = useState("growth");
  const [calView, setCalView]     = useState("week");
  const [fPhase, setFPhase]       = useState("All");
  const [fPillar, setFPillar]     = useState("All");
  const [searchQ, setSearchQ]     = useState("");
  const [showAddTopic, setShowAddTopic] = useState(false);

  const pending = packages.filter(p=>p.status==="Needs Review").length;
  const needsMusic = videoQueue.filter(v=>v.music.musicStatus==="Needs Music").length;
  const hasMens = Object.values(WEEKLY_SCHEDULE).flat().some(p=>p.phase==="Men");

  const NAV = [
    { id:"briefing",  label:"Morning Briefing", icon:"brief",    badge:0 },
    { id:"dashboard", label:"Dashboard",         icon:"dash",     badge:0 },
    { id:"growth",    label:"Growth Intelligence",icon:"growth",  badge:0 },
    { id:"topics",    label:"Topic Library",      icon:"lib",     badge:0 },
    { id:"calendar",  label:"Content Calendar",   icon:"cal",     badge:0 },
    { id:"packages",  label:"Content Packages",   icon:"pkg",     badge:0 },
    { id:"assets",    label:"Asset Library",       icon:"asset",  badge:0 },
    { id:"generator", label:"AI Generator",        icon:"ai",     badge:0 },
    { id:"video-queue",label:"Video Queue",        icon:"vid",    badge:needsMusic },
    { id:"sound",     label:"Sound Intelligence",  icon:"music",  badge:needsMusic },
    { id:"post-now",  label:"Post From Phone",     icon:"post",   badge:0 },
    { id:"approvals", label:"Approvals",            icon:"approve",badge:pending },
    { id:"analytics", label:"Analytics",           icon:"analytics",badge:0 },
    { id:"brand",     label:"Brand Rules",         icon:"brand",  badge:0 },
    { id:"posting",   label:"Posting Settings",    icon:"settings",badge:0 },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f5f0e8", fontFamily:"'Cormorant Garamond','Palatino Linotype',Georgia,serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Jost:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f0ebe0}::-webkit-scrollbar-thumb{background:#b8c9a3;border-radius:3px}
        .nav-item{cursor:pointer;transition:all 0.2s}.nav-item:hover{background:rgba(143,181,160,0.15)!important}.nav-item.active{background:rgba(143,181,160,0.22)!important}
        button{cursor:pointer;transition:all 0.18s ease}button:hover{opacity:0.88;transform:translateY(-1px)}button:active{transform:translateY(0)}
        .ch{transition:all 0.2s}.ch:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(90,138,106,0.12)}
        .inp{font-family:'Jost',sans-serif;background:#faf7f2;border:1px solid #d8cfc0;border-radius:8px;padding:9px 13px;font-size:13px;color:#3a4a3a;outline:none;transition:border-color 0.2s;width:100%}.inp:focus{border-color:#8fb5a0}
        textarea.inp{resize:vertical;min-height:72px}
        .overlay{position:fixed;inset:0;background:rgba(30,50,40,0.45);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px)}
        .modal{background:#faf7f2;border-radius:22px;padding:36px;max-width:680px;width:92%;max-height:88vh;overflow-y:auto;box-shadow:0 28px 80px rgba(30,50,40,0.2)}
        .modal-wide{max-width:820px}
        .tr:hover{background:rgba(143,181,160,0.07)}
        .pulse{animation:pulse 2s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .fade{animation:fade 0.3s ease}@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .tab-pill{cursor:pointer;padding:7px 16px;border-radius:20px;font-family:'Jost',sans-serif;font-size:12px;font-weight:500;border:none;transition:all 0.18s}
        .cb-label{display:flex;align-items:center;gap:8px;cursor:pointer;font-family:'Jost',sans-serif;font-size:12px;color:#3a5a4a}
        input[type=checkbox]{width:15px;height:15px;accent-color:#5a8a6a;cursor:pointer}
        .phone-card{background:white;border-radius:18px;border:2px solid #e8e0d0;padding:20px;margin-bottom:12px;max-width:400px}
        .music-warn{background:#fff8f0;border:1px solid #e8c080;border-radius:10px;padding:10px 14px;display:flex;gap:8px;align-items:flex-start;margin-top:8px}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width:sideOpen?252:64, minHeight:"100vh", background:"linear-gradient(180deg,#2d4a3a 0%,#1e3329 100%)", transition:"width 0.3s", overflow:"hidden", flexShrink:0, display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh" }}>
        <div style={{ padding:"24px 16px 20px", borderBottom:"1px solid rgba(143,181,160,0.2)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#8fb5a0,#5a8a6a)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:17 }}>💚</div>
          {sideOpen && <div>
            <div style={{ color:"#e8f0e8", fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, letterSpacing:"0.04em", lineHeight:1.2 }}>Lumen Flow</div>
            <div style={{ color:"rgba(184,201,163,0.6)", fontFamily:"'Jost',sans-serif", fontSize:8, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", marginTop:1 }}>Marketing Command Center</div>
          </div>}
        </div>
        <nav style={{ flex:1, padding:"12px 0", overflowY:"auto" }}>
          {NAV.map(item=>(
            <div key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}
              style={{ display:"flex", alignItems:"center", gap:11, padding:"9px 16px", color:page===item.id?"#b8e0c8":"rgba(200,220,200,0.62)", borderRadius:"0 22px 22px 0", marginRight:10 }}>
              <div style={{ flexShrink:0 }}><I n={item.icon} s={14} c="currentColor"/></div>
              {sideOpen && <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, fontWeight:page===item.id?600:400, whiteSpace:"nowrap" }}>{item.label}</span>}
              {item.badge>0 && <span style={{ marginLeft:"auto", background:"#c4726a", color:"white", borderRadius:"50%", width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontFamily:"'Jost',sans-serif", fontWeight:700, flexShrink:0 }}>{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(143,181,160,0.14)" }}>
          <button onClick={()=>setSideOpen(!sideOpen)} style={{ background:"rgba(143,181,160,0.12)", border:"none", borderRadius:8, padding:"7px 10px", color:"rgba(200,220,200,0.65)", fontSize:12, fontFamily:"'Jost',sans-serif", width:"100%", display:"flex", alignItems:"center", justifyContent:sideOpen?"flex-start":"center", gap:7 }}>
            <span style={{ transform:sideOpen?"none":"rotate(180deg)", display:"inline-block", transition:"transform 0.3s" }}>←</span>
            {sideOpen && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, overflow:"auto", minWidth:0 }}>
        <div style={{ background:"#faf7f2", borderBottom:"1px solid #e8e0d0", padding:"13px 30px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:21, fontWeight:600, color:"#2d4a3a" }}>{NAV.find(n=>n.id===page)?.label}</h1>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, color:"#8a9a8a", marginTop:1 }}>{new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {needsMusic>0 && (
              <div style={{ background:"#fff8f0", border:"1px solid #e8c080", borderRadius:10, padding:"5px 12px", display:"flex", alignItems:"center", gap:6, cursor:"pointer" }} onClick={()=>setPage("sound")}>
                <I n="music" s={12} c="#c08040"/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#8a5020" }}>{needsMusic} videos need music</span>
              </div>
            )}
            {!hasMens && (
              <div style={{ background:"#fdf0e8", border:"1px solid #e8c8a0", borderRadius:10, padding:"5px 12px", display:"flex", alignItems:"center", gap:6 }}>
                <I n="warn" s={12} c="#c4726a"/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#8a4a3a" }}>No men's content this week</span>
              </div>
            )}
            <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#8fb5a0,#5a8a6a)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>💚</div>
          </div>
        </div>

        <div style={{ padding:"28px 30px" }}>
          {page==="briefing"    && <BriefingPage setPage={setPage} packages={packages} videoQueue={videoQueue}/>}
          {page==="dashboard"   && <DashboardPage topics={topics} packages={packages} setPage={setPage} hasMens={hasMens}/>}
          {page==="growth"      && <GrowthPage packages={packages} topics={topics} setPage={setPage}/>}
          {page==="topics"      && <TopicsPage topics={topics} setTopics={setTopics} fPhase={fPhase} setFPhase={setFPhase} fPillar={fPillar} setFPillar={setFPillar} searchQ={searchQ} setSearchQ={setSearchQ} selTopic={selTopic} setSelTopic={setSelTopic} showAdd={showAddTopic} setShowAdd={setShowAddTopic}/>}
          {page==="calendar"    && <CalendarPage calView={calView} setCalView={setCalView} packages={packages}/>}
          {page==="packages"    && <PackagesPage packages={packages} setPackages={setPackages} topics={topics} selPkg={selPkg} setSelPkg={setSelPkg}/>}
          {page==="assets"      && <AssetsPage/>}
          {page==="generator"   && <GeneratorPage topics={topics} setPackages={setPackages}/>}
          {page==="video-queue" && <VideoQueuePage videoQueue={videoQueue} setVideoQueue={setVideoQueue} selVideo={selVideo} setSelVideo={setSelVideo}/>}
          {page==="sound"       && <SoundIntelligencePage videoQueue={videoQueue} setVideoQueue={setVideoQueue}/>}
          {page==="post-now"    && <PostFromPhonePage packages={packages} setPackages={setPackages} videoQueue={videoQueue} setVideoQueue={setVideoQueue}/>}
          {page==="approvals"   && <ApprovalsPage packages={packages} setPackages={setPackages}/>}
          {page==="analytics"   && <AnalyticsPage packages={packages} topics={topics} videoQueue={videoQueue} tab={analyticsTab} setTab={setAnalyticsTab}/>}
          {page==="brand"       && <BrandPage/>}
          {page==="posting"     && <PostingPage/>}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MORNING BRIEFING  — "your marketing team already did the work"
// ─────────────────────────────────────────────────────────────────────────────
function BriefingPage({ setPage, packages, videoQueue }) {
  const [copied, setCopied] = useState(null);
  const needsMusicNow = videoQueue.filter(v=>v.music.musicStatus==="Needs Music"&&v.status==="Approved");

  const copy = (text, id) => {
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(id); setTimeout(()=>setCopied(null),2000);
  };

  return (
    <div className="fade">
      {/* Hero greeting */}
      <div style={{ background:"linear-gradient(135deg,#2d4a3a,#1e3329)", borderRadius:20, padding:"28px 32px", marginBottom:22, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:24, top:16, fontSize:64, opacity:0.07 }}>💚</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontWeight:400, color:"rgba(184,201,163,0.7)", letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:8 }}>Monday · January 20, 2025</div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:36, fontWeight:300, color:"#e8f0e8", letterSpacing:"0.03em", marginBottom:10 }}>Good morning 💚</h2>
        <p style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:"rgba(184,201,163,0.85)", lineHeight:1.7, maxWidth:600 }}>{MORNING_BRIEFING.strategyNote}</p>
        <div style={{ marginTop:16, padding:"12px 16px", background:"rgba(143,181,160,0.15)", borderRadius:12, border:"1px solid rgba(143,181,160,0.25)", maxWidth:600 }}>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"rgba(184,201,163,0.6)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:5 }}>Next Direction from Your Strategy Team</div>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"rgba(184,201,163,0.9)", lineHeight:1.65 }}>{MORNING_BRIEFING.nextDirection}</p>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
        {/* Ready to post today */}
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#2d4a3a", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
            <I n="post" s={16} c="#5a8a6a"/> Ready to Post Today
          </div>
          {MORNING_BRIEFING.readyToPost.map((p,i)=>(
            <Card key={i} style={{ padding:16, marginBottom:10, border:`1px solid ${p.musicStatus==="Needs Music"?"#e8c080":"#e8e0d0"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:4 }}>{p.title}</div>
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <PhaseDot phase={p.phase}/>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a6a5a" }}>{p.platform} · {p.scheduledTime}</span>
                    <GrowthTagBadge tag={p.growthTag}/>
                  </div>
                </div>
              </div>
              {/* Checklist */}
              <div style={{ display:"flex", gap:12, marginBottom:10, flexWrap:"wrap" }}>
                {[["Caption ready",p.hasCaption],["Asset ready",p.hasAsset],["Music added",p.musicStatus==="Music Added"||p.musicStatus==="Not Needed"]].map(([l,done])=>(
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", background:done?"#5a8a6a":"#e8e0d0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {done && <I n="check" s={10} c="white"/>}
                    </div>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:done?"#2d4a3a":"#9a9a90" }}>{l}</span>
                  </div>
                ))}
              </div>
              {p.musicStatus==="Needs Music" && (
                <div className="music-warn">
                  <I n="music" s={13} c="#c08040"/>
                  <span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#7a5020", lineHeight:1.5 }}>Music recommended before posting. Open Sound Queue to choose your audio. You can post without music but saves may be lower.</span>
                </div>
              )}
              <div style={{ display:"flex", gap:7, marginTop:10 }}>
                <Btn variant="sm" onClick={()=>setPage("sound")}><I n="music" s={11}/> Sound</Btn>
                <Btn variant="sm" onClick={()=>setPage("post-now")}><I n="post" s={11}/> Post Now</Btn>
              </div>
            </Card>
          ))}
        </div>

        {/* Needs attention */}
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#2d4a3a", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
            <I n="warn" s={16} c="#c4726a"/> Needs Your Attention
          </div>
          {MORNING_BRIEFING.needsAttention.map((a,i)=>(
            <div key={i} style={{ background: a.urgency==="high"?"#fdf5f0":"#faf7f2", border:`1px solid ${a.urgency==="high"?"#e8c0a0":"#e8e0d0"}`, borderRadius:12, padding:"12px 16px", marginBottom:9, display:"flex", gap:10, alignItems:"flex-start" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:a.urgency==="high"?"#c4726a":"#d4a574", marginTop:5, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#3a4a3a", lineHeight:1.55 }}>{a.msg}</span>
              </div>
              <Btn variant="sm" onClick={()=>setPage(a.type==="approval"?"approvals":a.type==="music"?"sound":"calendar")}>Fix</Btn>
            </div>
          ))}

          {/* This week in one glance */}
          <Card style={{ padding:18, marginTop:16 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d4a3a", marginBottom:12 }}>This Week at a Glance</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                ["Posts Ready",packages.filter(p=>p.status==="Approved").length,"#5a8a6a"],
                ["Needs Approval",packages.filter(p=>p.status==="Needs Review").length,"#c4726a"],
                ["Videos in Queue",INITIAL_VIDEO_QUEUE.length,"#7ab5d4"],
                ["Need Music",INITIAL_VIDEO_QUEUE.filter(v=>v.music.musicStatus==="Needs Music").length,"#e8a060"],
              ].map(([l,v,c])=>(
                <div key={l} style={{ background:`${c}12`, borderRadius:10, padding:12 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:c }}>{v}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a" }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Top recommendations strip */}
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#2d4a3a", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
        <I n="target" s={16} c="#8fb5a0"/> Your Strategy Team's Top 3 Recommendations Today
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {GROWTH_RECS.slice(0,3).map((r,i)=>(
          <div key={i} style={{ background:"#faf7f2", borderRadius:14, border:"1px solid #e8e0d0", padding:18 }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{r.icon}</div>
            <GrowthTagBadge tag={r.tag}/>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d4a3a", lineHeight:1.65, margin:"8px 0 12px" }}>{r.msg}</p>
            <Btn variant="sm" onClick={()=>setPage("generator")}>{r.action}</Btn>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOUND INTELLIGENCE PAGE  — the heart of the new music system
// ─────────────────────────────────────────────────────────────────────────────
function SoundIntelligencePage({ videoQueue, setVideoQueue }) {
  const [activeVideo, setActiveVideo] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const needsMusic = videoQueue.filter(v=>v.music.musicStatus==="Needs Music");
  const sColors = { "Not Needed":"#b8c9a3","Needs Music":"#e8a060","Music Added":"#5a8a6a","Posted Without Music":"#c4726a" };

  const updateMusic = (id, field, value) => {
    setVideoQueue(prev=>prev.map(v=>v.id===id?{...v,music:{...v.music,[field]:value}}:v));
    if(activeVideo?.id===id) setActiveVideo(prev=>({...prev,music:{...prev.music,[field]:value}}));
  };

  const filtered = filterStatus==="All" ? videoQueue : videoQueue.filter(v=>v.music.musicStatus===filterStatus);

  return (
    <div className="fade">
      <SectionHead title="Sound Intelligence" sub="Manage music direction, tracking, and performance for every video"/>

      {/* Music rule banner */}
      <div style={{ background:"linear-gradient(135deg,#1e3329,#2d4a3a)", borderRadius:16, padding:"18px 24px", marginBottom:20, display:"flex", gap:18, alignItems:"flex-start" }}>
        <div style={{ fontSize:28, flexShrink:0 }}>🎵</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:"#e8f0e8", marginBottom:6 }}>Sound is a content decision, not an afterthought</div>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"rgba(184,201,163,0.85)", lineHeight:1.7 }}>
            Lumen Flow does not automatically attach trending songs — music rights and platform rules may restrict that. Instead, this system suggests the <strong style={{ color:"#b8e0c8" }}>right mood, type, and search terms</strong> for each video. You add the sound yourself inside TikTok, Instagram, or YouTube. Then mark it here so we can track what sounds actually grow the brand.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:22 }}>
        {MUSIC_STATUSES.map(s=>(
          <div key={s} className="ch" onClick={()=>setFilterStatus(filterStatus===s?"All":s)}
            style={{ background:filterStatus===s?`${sColors[s]}22`:"#faf7f2", borderRadius:13, padding:16, border:`1.5px solid ${filterStatus===s?sColors[s]:"#e8e0d0"}`, cursor:"pointer" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:sColors[s] }}>{videoQueue.filter(v=>v.music.musicStatus===s).length}</div>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#7a8a7a", marginTop:3 }}>{s}</div>
          </div>
        ))}
      </div>

      {needsMusic.length>0 && (
        <div style={{ background:"#fff8f0", border:"1px solid #e8c080", borderRadius:12, padding:"12px 18px", marginBottom:18, display:"flex", gap:10, alignItems:"center" }}>
          <I n="warn" s={15} c="#c08040"/>
          <span style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:"#7a5020" }}><strong>{needsMusic.length} video{needsMusic.length>1?"s":""} need music</strong> before posting. Posting without music may reduce saves by up to 40% for Trust Building and Education content.</span>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns: activeVideo?"1fr 1fr":"1fr", gap:18 }}>
        {/* Video list */}
        <div>
          {filtered.map(v=>(
            <div key={v.id} className="ch" onClick={()=>setActiveVideo(v===activeVideo?null:v)}
              style={{ background: activeVideo?.id===v.id?"#f0f8f4":"#faf7f2", borderRadius:14, border:`1.5px solid ${activeVideo?.id===v.id?"#5a8a6a":"#e8e0d0"}`, padding:18, marginBottom:10, cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:4 }}>{v.topic}</div>
                  <div style={{ display:"flex", gap:7, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ padding:"2px 8px", borderRadius:10, fontSize:10, fontFamily:"'Jost',sans-serif", fontWeight:700, background:"#e8f0e8", color:"#3a5a4a" }}>{v.platform}</span>
                    <PhaseDot phase={v.phase}/>
                    <GrowthTagBadge tag={v.growthTag}/>
                  </div>
                </div>
                <Tag label={v.music.musicStatus} color={sColors[v.music.musicStatus]||"#b8c9a3"}/>
              </div>

              {/* Sound profile summary */}
              <div style={{ background:"#f5f0e8", borderRadius:10, padding:12, marginBottom:10 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  <div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Mood</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#2d4a3a", fontWeight:500 }}>{v.music.mood}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Sound Type</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#2d4a3a", fontWeight:500 }}>{v.music.recommendedType}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Add Where</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#2d4a3a", fontWeight:500 }}>{v.music.addWhere}</div>
                  </div>
                </div>
                <div style={{ marginTop:8 }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Search These Terms in {v.platform}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {v.music.searchTerms.map(t=>(
                      <span key={t} style={{ background:"#e8f0e8", color:"#3a6a4a", padding:"2px 10px", borderRadius:20, fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:500, cursor:"pointer" }} title="Copy search term" onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(t);}}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick checkbox row */}
              <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
                <label className="cb-label" onClick={e=>e.stopPropagation()}>
                  <input type="checkbox" checked={v.music.addMusicLater} onChange={e=>updateMusic(v.id,"addMusicLater",e.target.checked)}/>
                  Add music later
                </label>
                <label className="cb-label" onClick={e=>e.stopPropagation()}>
                  <input type="checkbox" checked={v.music.musicAdded} onChange={e=>{updateMusic(v.id,"musicAdded",e.target.checked);if(e.target.checked)updateMusic(v.id,"musicStatus","Music Added");}}/>
                  Music added ✓
                </label>
                {v.music.useVoiceover && <span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#5a8a6a", fontWeight:600 }}>🎙 Voiceover recommended</span>}
              </div>

              {v.music.musicStatus==="Needs Music" && !v.music.addMusicLater && (
                <div className="music-warn" style={{ marginTop:10 }}>
                  <I n="warn" s={13} c="#c08040"/>
                  <span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#7a5020" }}>This video is set to post without music. You can proceed, but we recommend adding sound. {SOUND_PROFILES[v.growthTag]?.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {activeVideo && (
          <div>
            <Card style={{ padding:22, position:"sticky", top:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:"#2d4a3a" }}>Sound Settings</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#7a8a7a", marginTop:2 }}>{activeVideo.topic}</div>
                </div>
                <button onClick={()=>setActiveVideo(null)} style={{ background:"transparent", border:"none", color:"#8a9a8a" }}><I n="x" s={18}/></button>
              </div>

              {/* Strategy note from the profile */}
              {SOUND_PROFILES[activeVideo.growthTag] && (
                <div style={{ background:"#f0f8f4", borderRadius:10, padding:12, marginBottom:16, border:"1px solid #c0e0d0" }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#3a6a4a", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>💚 Strategy Note</div>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d5a4a", lineHeight:1.6 }}>{SOUND_PROFILES[activeVideo.growthTag].note}</p>
                </div>
              )}

              <div style={{ display:"grid", gap:12 }}>
                <div>
                  <Label>Music Status</Label>
                  <Select value={activeVideo.music.musicStatus} onChange={e=>updateMusic(activeVideo.id,"musicStatus",e.target.value)} options={MUSIC_STATUSES}/>
                </div>
                <div>
                  <Label>Sound Mood</Label>
                  <Select value={activeVideo.music.mood} onChange={e=>updateMusic(activeVideo.id,"mood",e.target.value)} options={SOUND_MOODS}/>
                </div>
                <div>
                  <Label>Audio Source / Type</Label>
                  <Select value={activeVideo.music.audioSource} onChange={e=>updateMusic(activeVideo.id,"audioSource",e.target.value)} options={SOUND_TYPES}/>
                </div>
                <div>
                  <Label>Where to Add Sound</Label>
                  <Select value={activeVideo.music.addWhere} onChange={e=>updateMusic(activeVideo.id,"addWhere",e.target.value)} options={SOUND_SOURCES}/>
                </div>
                <div>
                  <Label>Sound Used (enter after posting)</Label>
                  <Input value={activeVideo.music.soundUsed} onChange={e=>updateMusic(activeVideo.id,"soundUsed",e.target.value)} placeholder="e.g. 'Soft Morning' by Artist Name"/>
                </div>
                <div>
                  <Label>Sound Notes</Label>
                  <textarea value={activeVideo.music.soundNotes} onChange={e=>updateMusic(activeVideo.id,"soundNotes",e.target.value)} className="inp" placeholder="Volume level, timing notes, cue points…"/>
                </div>
                <div>
                  <Label>Performance Notes (after posting)</Label>
                  <textarea value={activeVideo.music.performanceNotes} onChange={e=>updateMusic(activeVideo.id,"performanceNotes",e.target.value)} className="inp" placeholder="Did this sound drive more saves? Better watch time?"/>
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <label className="cb-label">
                    <input type="checkbox" checked={activeVideo.music.addMusicLater} onChange={e=>updateMusic(activeVideo.id,"addMusicLater",e.target.checked)}/>
                    Add music later
                  </label>
                  <label className="cb-label">
                    <input type="checkbox" checked={activeVideo.music.musicAdded} onChange={e=>{updateMusic(activeVideo.id,"musicAdded",e.target.checked);if(e.target.checked)updateMusic(activeVideo.id,"musicStatus","Music Added");}}/>
                    Music added ✓
                  </label>
                </div>
              </div>

              {/* Suggested sounds strip */}
              <div style={{ marginTop:16, background:"#f5f0e8", borderRadius:10, padding:14 }}>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Suggested Sound Options (search inside {activeVideo.platform})</div>
                <div style={{ display:"grid", gap:8 }}>
                  {activeVideo.music.searchTerms.map((t,idx)=>(
                    <div key={t} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"white", borderRadius:8, padding:"8px 12px", border:"1px solid #e8e0d0" }}>
                      <div>
                        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d4a3a", fontWeight:500 }}>Option {idx+1}</div>
                        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a8a6a" }}>Search: "{t}"</div>
                      </div>
                      <button onClick={()=>navigator.clipboard?.writeText(t)} style={{ background:"#e8f0e8", border:"none", borderRadius:7, padding:"5px 10px", fontFamily:"'Jost',sans-serif", fontSize:10, color:"#3a6a4a", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                        <I n="copy" s={11} c="#3a6a4a"/> Copy
                      </button>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#9a9a8a", marginTop:10, lineHeight:1.6 }}>
                  ⚠ Lumen Flow cannot automatically attach trending songs due to music rights and platform rules. Search these terms inside {activeVideo.platform} and choose a sound that fits the mood and is available for your account type.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Sound performance insights */}
      <div style={{ marginTop:22 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#2d4a3a", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
          <I n="analytics" s={16} c="#5a8a6a"/> Sound Performance Insights
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {[
            { type:"Calm Instrumental", posts:8, avgSaves:"3.2K", avgFollowers:"+94", verdict:"Best for saves", color:"#8fb5a0" },
            { type:"Trending Sound",    posts:5, avgSaves:"1.8K", avgFollowers:"+189", verdict:"Best for followers", color:"#7ab5d4" },
            { type:"Voiceover Only",    posts:4, avgSaves:"2.4K", avgFollowers:"+72", verdict:"Best for trust", color:"#d4a574" },
          ].map(s=>(
            <Card key={s.type} style={{ padding:18, border:`1px solid ${s.color}33` }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:s.color, marginBottom:3 }}>{s.type}</div>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a", marginBottom:10 }}>{s.posts} posted videos</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <div style={{ background:`${s.color}12`, borderRadius:8, padding:10 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:s.color }}>{s.avgSaves}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#7a8a7a" }}>avg saves</div>
                </div>
                <div style={{ background:`${s.color}12`, borderRadius:8, padding:10 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:s.color }}>{s.avgFollowers}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#7a8a7a" }}>avg followers</div>
                </div>
              </div>
              <div style={{ marginTop:8, fontFamily:"'Jost',sans-serif", fontSize:11, color:s.color, fontWeight:600 }}>💚 {s.verdict}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POST FROM PHONE  — simplified mobile posting mode
// ─────────────────────────────────────────────────────────────────────────────
function PostFromPhonePage({ packages, setPackages, videoQueue, setVideoQueue }) {
  const [copied, setCopied] = useState(null);
  const [checkedMusic, setCheckedMusic] = useState({});
  const [markedPosted, setMarkedPosted] = useState({});
  const readyPkgs = packages.filter(p=>p.status==="Approved");

  const copy = (text, key) => {
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(key); setTimeout(()=>setCopied(null),2000);
  };

  const markPosted = (id) => {
    setPackages(prev=>prev.map(p=>p.id===id?{...p,status:"Posted",postedDate:new Date().toISOString().split("T")[0]}:p));
    setMarkedPosted(prev=>({...prev,[id]:true}));
  };

  return (
    <div className="fade">
      <SectionHead title="Post From Phone" sub="Simple posting mode — copy, download, check music, mark as posted"/>

      {/* Phone mode header */}
      <div style={{ background:"linear-gradient(135deg,#2d4a3a,#1e3329)", borderRadius:16, padding:"18px 22px", marginBottom:20, display:"flex", gap:14, alignItems:"center" }}>
        <div style={{ width:44, height:44, borderRadius:12, background:"rgba(143,181,160,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <I n="phone" s={22} c="#8fb5a0"/>
        </div>
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:"#e8f0e8", marginBottom:4 }}>Ready for phone posting</div>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"rgba(184,201,163,0.8)", lineHeight:1.5 }}>{readyPkgs.length} approved post{readyPkgs.length!==1?"s":""} ready. Copy captions, download assets, check music, then post directly in each app. Come back and mark as posted when done.</p>
        </div>
      </div>

      {readyPkgs.length===0 ? (
        <Card style={{ padding:"50px 0", textAlign:"center" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>💚</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:"#2d4a3a" }}>Nothing ready to post right now.</div>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:"#7a8a7a", marginTop:6 }}>Go to Approvals to approve content first.</div>
        </Card>
      ) : (
        <div>
          {readyPkgs.map(pkg=>{
            const vid = videoQueue.find(v=>v.topic===pkg.title);
            const musicOk = !vid || vid.music.musicAdded || vid.music.musicStatus==="Not Needed";
            const isPosted = markedPosted[pkg.id];
            return (
              <div key={pkg.id} className="phone-card" style={{ opacity:isPosted?0.55:1, transition:"opacity 0.3s" }}>
                {/* Post header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ display:"flex", gap:6, marginBottom:5, flexWrap:"wrap" }}>
                      {pkg.platforms.map(p=><span key={p} style={{ padding:"2px 8px", borderRadius:10, fontSize:10, fontFamily:"'Jost',sans-serif", fontWeight:700, background:"#e8f0e8", color:"#3a5a4a" }}>{p}</span>)}
                      <PhaseDot phase={pkg.phase}/>
                      <GrowthTagBadge tag={(pkg.growthTags||[])[0]||"Education"}/>
                    </div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d4a3a" }}>{pkg.title}</div>
                  </div>
                  {isPosted && <span style={{ background:"#5a8a6a", color:"white", borderRadius:10, padding:"3px 10px", fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:700 }}>✓ Posted</span>}
                </div>

                {/* Pre-post checklist */}
                <div style={{ background:"#f5f0e8", borderRadius:10, padding:12, marginBottom:12 }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Pre-post checklist</div>
                  {[
                    ["Caption ready", true],
                    ["Asset downloaded", true],
                    ["Music added", musicOk],
                    ["CTA includes link in bio", pkg.cta?.includes("link in bio")],
                  ].map(([l,done])=>(
                    <div key={l} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                      <div style={{ width:16, height:16, borderRadius:"50%", background:done?"#5a8a6a":"#e0c8a0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {done ? <I n="check" s={10} c="white"/> : <span style={{ fontSize:10, color:"#c08040" }}>!</span>}
                      </div>
                      <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:done?"#2d4a3a":"#8a7030" }}>{l}</span>
                    </div>
                  ))}
                </div>

                {/* Music warning if needed */}
                {vid && !musicOk && (
                  <div className="music-warn" style={{ marginBottom:12 }}>
                    <I n="music" s={14} c="#c08040"/>
                    <div>
                      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#7a5020", fontWeight:600, marginBottom:3 }}>Music not yet added</div>
                      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#7a5020", lineHeight:1.5 }}>Recommended: {vid.music.recommendedType}. Search inside {vid.platform}: <strong>"{vid.music.searchTerms[0]}"</strong>. You can still post without music — but saves may be lower.</div>
                    </div>
                  </div>
                )}

                {/* Caption */}
                <div style={{ background:"white", borderRadius:10, border:"1px solid #e8e0d0", padding:12, marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em" }}>Caption 💚</div>
                    <button onClick={()=>copy(pkg.caption,`cap-${pkg.id}`)} style={{ background:copied===`cap-${pkg.id}`?"#5a8a6a":"#e8f0e8", border:"none", borderRadius:7, padding:"4px 10px", fontFamily:"'Jost',sans-serif", fontSize:10, color:copied===`cap-${pkg.id}`?"white":"#3a6a4a", cursor:"pointer", display:"flex", alignItems:"center", gap:4, transition:"all 0.2s" }}>
                      <I n="copy" s={11} c={copied===`cap-${pkg.id}`?"white":"#3a6a4a"}/>
                      {copied===`cap-${pkg.id}`?"Copied!":"Copy"}
                    </button>
                  </div>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d4a3a", lineHeight:1.65 }}>{pkg.caption}</p>
                </div>

                {/* Hashtags */}
                <div style={{ background:"white", borderRadius:10, border:"1px solid #e8e0d0", padding:10, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a8a6a", lineHeight:1.6, flex:1 }}>{pkg.hashtags}</p>
                  <button onClick={()=>copy(pkg.hashtags,`hash-${pkg.id}`)} style={{ background:copied===`hash-${pkg.id}`?"#5a8a6a":"#e8f0e8", border:"none", borderRadius:7, padding:"4px 10px", fontFamily:"'Jost',sans-serif", fontSize:10, color:copied===`hash-${pkg.id}`?"white":"#3a6a4a", cursor:"pointer", flexShrink:0, marginLeft:10, transition:"all 0.2s" }}>
                    {copied===`hash-${pkg.id}`?"✓":"Copy"}
                  </button>
                </div>

                {/* CTA */}
                <div style={{ background:"white", borderRadius:10, border:"1px solid #e8e0d0", padding:10, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d4a3a" }}>{pkg.cta}</span>
                  <button onClick={()=>copy(pkg.cta,`cta-${pkg.id}`)} style={{ background:copied===`cta-${pkg.id}`?"#5a8a6a":"#e8f0e8", border:"none", borderRadius:7, padding:"4px 10px", fontFamily:"'Jost',sans-serif", fontSize:10, color:copied===`cta-${pkg.id}`?"white":"#3a6a4a", cursor:"pointer", flexShrink:0, marginLeft:10, transition:"all 0.2s" }}>
                    {copied===`cta-${pkg.id}`?"✓":"Copy"}
                  </button>
                </div>

                {/* Actions */}
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <Btn variant="ghost" style={{ fontSize:11 }}><I n="download" s={12}/> Download Asset</Btn>
                  {vid && (
                    <Btn variant="sm" onClick={()=>{}} style={{ background:"#f0f8f4", color:"#3a6a4a" }}><I n="music" s={11}/> {vid.music.musicAdded?"Music Added":"Add Music First"}</Btn>
                  )}
                  <Btn onClick={()=>markPosted(pkg.id)} disabled={isPosted} style={{ marginLeft:"auto", padding:"10px 18px", fontSize:12 }}>
                    <I n="check" s={13} c="white"/> {isPosted?"Posted!":"Mark as Posted"}
                  </Btn>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function DashboardPage({ topics, packages, setPage, hasMens }) {
  const [tab, setTab] = useState("overview");
  const posted = packages.filter(p=>p.analytics);
  const totalFollowers = PLATFORM_GROWTH.reduce((a,p)=>a+parseInt(p.followers),0);
  const totalAppClicks = posted.reduce((a,p)=>a+(p.analytics?.appStoreClicks||0),0);
  return (
    <div className="fade">
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:300, color:"#2d4a3a" }}>Dashboard 💚</h2>
        <p style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:"#7a8a7a", marginTop:3 }}>Your full marketing overview.</p>
      </div>
      <div style={{ display:"flex", gap:5, marginBottom:22, background:"#f0ebe0", padding:4, borderRadius:14, width:"fit-content" }}>
        {[["overview","Overview"],["growth-view","Growth View"],["recommendations","Recommendations"]].map(([t,l])=>(
          <button key={t} className="tab-pill" onClick={()=>setTab(t)} style={{ background:tab===t?"#faf7f2":"transparent", color:tab===t?"#2d4a3a":"#7a8a7a", boxShadow:tab===t?"0 1px 4px rgba(0,0,0,0.08)":"none", fontWeight:tab===t?600:400 }}>{l}</button>
        ))}
      </div>
      {tab==="overview" && (
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:13, marginBottom:22 }}>
            {[
              { label:"New Followers",    value:`+${totalFollowers}`, color:"#5a8a6a", icon:"users" },
              { label:"App Store Clicks", value:totalAppClicks,       color:"#9a6ab8", icon:"phone" },
              { label:"Link in Bio Clicks",value:"992",               color:"#d4a574", icon:"link"  },
              { label:"Pending Approvals",value:packages.filter(p=>p.status==="Needs Review").length, color:"#c4726a", icon:"approve", action:()=>setPage("approvals") },
              { label:"Topics in Library",value:topics.length,        color:"#8fb5a0", icon:"lib"   },
            ].map((s,i)=>(
              <div key={i} className="ch" onClick={s.action} style={{ background:"#faf7f2", borderRadius:14, padding:18, border:"1px solid #e8e0d0", cursor:s.action?"pointer":"default" }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:600, color:s.color, lineHeight:1 }}>{s.value}</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#7a8a7a", marginTop:4 }}>{s.label}</div>
                  </div>
                  <div style={{ width:32, height:32, borderRadius:"50%", background:`${s.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <I n={s.icon} s={14} c={s.color}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            <Card style={{ padding:20 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d4a3a", marginBottom:14, display:"flex", alignItems:"center", gap:7 }}><I n="growth" s={14} c="#5a8a6a"/> Platform Performance</div>
              {PLATFORM_GROWTH.map(p=>(
                <div key={p.platform} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, fontWeight:600, color:"#2d4a3a" }}>{p.platform}</span>
                    <div style={{ display:"flex", gap:10 }}>
                      <span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a8a6a", fontWeight:600 }}>{p.followers}</span>
                      <span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#9a6ab8" }}>{p.appClicks} app</span>
                    </div>
                  </div>
                  <ScoreBar score={p.score} color={p.score>85?"#5a8a6a":p.score>65?"#d4a574":"#c4726a"}/>
                </div>
              ))}
            </Card>
            <Card style={{ padding:20 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d4a3a", marginBottom:14, display:"flex", alignItems:"center", gap:7 }}><I n="star" s={14} c="#d4a574"/> Top Posts</div>
              {TOP_POSTS.map((p,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i<2?"1px solid #f0e8d8":"none" }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:`${PHASE_COLORS[p.phase]}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:700, color:PHASE_COLORS[p.phase] }}>{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontWeight:600, color:"#2d4a3a", lineHeight:1.3 }}>{p.title}</div>
                    <div style={{ display:"flex", gap:5, marginTop:2 }}><GrowthTagBadge tag={p.growthTag}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a" }}>{p.saves} saves</span></div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, fontWeight:700, color:"#9a6ab8" }}>+{p.followersGained}</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a" }}>followers</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
          <Card style={{ padding:20 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d4a3a", marginBottom:12, display:"flex", alignItems:"center", gap:7 }}>
              <I n="moon" s={14} c="#8fb5a0"/> This Week's Phase Rotation
              {!hasMens && <Tag label="⚠ No men's content" color="#c4726a"/>}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
              {Object.entries(WEEKLY_SCHEDULE).map(([day,posts])=>(
                <div key={day} style={{ background:"#f5f0e8", borderRadius:10, padding:"9px 7px", border:"1px solid #e8e0d0" }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, fontWeight:700, color:"#5a6a5a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>{day.split(" ")[0]}</div>
                  {posts.length===0 ? <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#c0c8c0", fontStyle:"italic" }}>Empty</div>
                    : posts.map((p,i)=>(
                      <div key={i} style={{ marginBottom:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:2 }}><PhaseDot phase={p.phase} size={7}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#5a6a5a" }}>{p.platform}</span></div>
                        <GrowthTagBadge tag={p.growthTag}/>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
      {tab==="growth-view" && <GrowthViewTab packages={packages} setPage={setPage}/>}
      {tab==="recommendations" && <RecsTab setPage={setPage}/>}
    </div>
  );
}

function GrowthViewTab({ packages, setPage }) {
  const posted = packages.filter(p=>p.analytics);
  const byFollowers = [...posted].sort((a,b)=>(b.analytics.followersGained||0)-(a.analytics.followersGained||0));
  const bySaves = [...posted].sort((a,b)=>(b.analytics.saves||0)-(a.analytics.saves||0));
  const byApp = [...posted].sort((a,b)=>(b.analytics.appStoreClicks||0)-(a.analytics.appStoreClicks||0));
  const GL = ({ items, metric, color }) => (
    <div>{items.slice(0,2).map((p,i)=>(
      <div key={p.id} style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 0", borderBottom:i<1?"1px solid #f0e8d8":"none" }}>
        <div style={{ width:22, height:22, borderRadius:"50%", background:`${color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:700, color, flexShrink:0 }}>{i+1}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontWeight:600, color:"#2d4a3a" }}>{p.title}</div>
          <div style={{ display:"flex", gap:5, marginTop:2 }}><PhaseDot phase={p.phase}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a" }}>{p.phase} · {p.platforms?.[0]}</span></div>
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color }}>{metric(p)}</div>
      </div>
    ))}</div>
  );
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Card style={{ padding:18 }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:10, display:"flex", gap:6 }}><I n="users" s={14} c="#5a8a6a"/> Best Follower Growth</div><GL items={byFollowers} metric={p=>p.analytics.followersGained} color="#5a8a6a"/></Card>
        <Card style={{ padding:18 }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:10, display:"flex", gap:6 }}><I n="save" s={14} c="#d4a574"/> Best Save-Worthy</div><GL items={bySaves} metric={p=>p.analytics.saves.toLocaleString()} color="#d4a574"/></Card>
        <Card style={{ padding:18 }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:10, display:"flex", gap:6 }}><I n="phone" s={14} c="#9a6ab8"/> Best App Traffic</div><GL items={byApp} metric={p=>p.analytics.appStoreClicks} color="#9a6ab8"/></Card>
        <Card style={{ padding:18, background:"#f5f0f8", border:"1px solid #c8b8e0" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#4a2a6a", marginBottom:10, display:"flex", gap:6 }}><I n="crown" s={14} c="#9a6ab8"/> Conversion Opportunities</div>
          {["Seed Cycling for Follicular Phase","Why Fasting Feels Harder Before Your Period"].map((t,i)=>(
            <div key={i} style={{ padding:"7px 0", borderBottom:i===0?"1px solid #e0d0f0":"none" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13, fontWeight:600, color:"#4a2a6a" }}>{t}</div>
              <div style={{ display:"flex", gap:5, marginTop:3 }}><GrowthTagBadge tag="Premium Teaser"/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a" }}>High trust — add Premium CTA</span></div>
            </div>
          ))}
        </Card>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <Card style={{ padding:18, background:"#f5faf7", border:"1px solid #c8e0d0" }}>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:700, color:"#3a6a4a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>🔁 Topics to Repeat</div>
          {["Luteal phase fasting (3 more)","TikTok hook: Nobody told me…","Men's energy content","Cycle education save-worthy"].map((t,i)=><div key={i} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#2d4a3a", padding:"4px 0", borderBottom:i<3?"1px dashed #d0e8d8":"none" }}>✦ {t}</div>)}
        </Card>
        <Card style={{ padding:18, background:"#fdf8f0", border:"1px solid #e8d8b8" }}>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:700, color:"#8a5a2a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>⚠ Content Gaps</div>
          {["Premium teasers (0 this month)","App features (need 3/week)","YouTube Shorts (low output)","Men's content (need 2/week)"].map((t,i)=><div key={i} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a4a2a", padding:"4px 0", borderBottom:i<3?"1px dashed #e0d0b8":"none" }}>· {t}</div>)}
        </Card>
        <Card style={{ padding:18, background:"#fdf4f4", border:"1px solid #e0c0c0" }}>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, fontWeight:700, color:"#8a3a3a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>📉 Consider Retiring</div>
          {["General lifestyle posts (0 saves)","Single image posts — carousels win","Long captions without hooks"].map((t,i)=><div key={i} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a3a3a", padding:"4px 0", borderBottom:i<2?"1px dashed #e0c8c8":"none" }}>· {t}</div>)}
        </Card>
      </div>
    </div>
  );
}

function RecsTab({ setPage }) {
  return (
    <div style={{ display:"grid", gap:9 }}>
      {GROWTH_RECS.map((r,i)=>(
        <div key={i} style={{ background:"#faf7f2", borderRadius:13, border:"1px solid #e8e0d0", padding:"16px 20px", display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{r.icon}</div>
          <div style={{ flex:1 }}><GrowthTagBadge tag={r.tag}/><p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d4a3a", lineHeight:1.65, margin:"6px 0" }}>{r.msg}</p></div>
          <Btn variant="sm" onClick={()=>setPage(r.type==="sound"?"sound":"generator")} style={{ flexShrink:0 }}>{r.action}</Btn>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GROWTH INTELLIGENCE
// ─────────────────────────────────────────────────────────────────────────────
function GrowthPage({ packages, topics, setPage }) {
  const [sec, setSec] = useState("funnel");
  return (
    <div className="fade">
      <SectionHead title="Growth Intelligence" sub="Understand what drives followers, trust, traffic, and revenue"/>
      <div style={{ display:"flex", gap:5, marginBottom:22, background:"#f0ebe0", padding:4, borderRadius:14, width:"fit-content" }}>
        {[["funnel","Growth Funnel"],["content","Content by Goal"],["platform","Platform ROI"],["premium","Premium Path"]].map(([t,l])=>(
          <button key={t} className="tab-pill" onClick={()=>setSec(t)} style={{ background:sec===t?"#faf7f2":"transparent", color:sec===t?"#2d4a3a":"#7a8a7a", boxShadow:sec===t?"0 1px 4px rgba(0,0,0,0.08)":"none", fontWeight:sec===t?600:400 }}>{l}</button>
        ))}
      </div>
      {sec==="funnel" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20 }}>
            {[["Awareness","94.2K","Total Reach","eye","#7ab5d4","How many people see your content"],["Engagement","14.3K","Likes + Comments","users","#8fb5a0","How many interact"],["Trust","10.4K","Saves","save","#d4a574","Saves = highest trust signal"],["Traffic","992","Bio Clicks","link","#b08fbe","Who clicks to the app"],["Conversion","365","App Store Clicks","phone","#9a6ab8","Who taps to download"]].map(([stage,val,sub,ic,c,desc])=>(
              <Card key={stage} style={{ padding:18, textAlign:"center", border:`1px solid ${c}44` }}>
                <div style={{ width:34, height:34, borderRadius:"50%", background:`${c}22`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 8px" }}><I n={ic} s={15} c={c}/></div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:c }}>{val}</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:600, color:"#2d4a3a", marginTop:2 }}>{stage}</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#8a9a8a", marginTop:2 }}>{sub}</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a", marginTop:6, lineHeight:1.5 }}>{desc}</div>
              </Card>
            ))}
          </div>
          <Card style={{ padding:22 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d4a3a", marginBottom:14 }}>Conversion Rates</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[["Reach → Engagement","15.2%","Strong","#5a8a6a"],["Engagement → Saves","72.7%","Excellent","#5a8a6a"],["Saves → Bio Clicks","9.5%","Improve","#d4a574"],["Bio Clicks → App","36.8%","Good","#8fb5a0"]].map(([from,rate,verdict,c])=>(
                <div key={from} style={{ background:`${c}12`, border:`1px solid ${c}33`, borderRadius:11, padding:14 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:c }}>{rate}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#3a5a4a", fontWeight:600, marginTop:3 }}>{verdict}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a", marginTop:2, lineHeight:1.5 }}>{from}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {sec==="content" && (
        <div style={{ display:"grid", gap:12 }}>
          {GROWTH_TAGS.map(tag=>{
            const matching = topics.filter(t=>t.growthTags?.includes(tag));
            const postedM = packages.filter(p=>p.growthTags?.includes(tag)&&p.analytics);
            const avgF = postedM.length ? Math.round(postedM.reduce((a,p)=>a+(p.analytics.followersGained||0),0)/postedM.length) : 0;
            const avgS = postedM.length ? Math.round(postedM.reduce((a,p)=>a+(p.analytics.saves||0),0)/postedM.length) : 0;
            const c = GROWTH_TAG_COLORS[tag];
            return (
              <div key={tag} style={{ background:"#faf7f2", borderRadius:13, border:`1px solid ${c}33`, padding:"16px 20px", display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:18, alignItems:"center" }}>
                <div><GrowthTagBadge tag={tag}/><div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a6a5a", marginTop:5 }}>{matching.length} topics · {postedM.length} posted</div></div>
                <div style={{ textAlign:"center" }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#5a8a6a" }}>+{avgF}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#7a8a7a", textTransform:"uppercase" }}>avg followers</div></div>
                <div style={{ textAlign:"center" }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#d4a574" }}>{avgS.toLocaleString()}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#7a8a7a", textTransform:"uppercase" }}>avg saves</div></div>
                <Btn variant="sm">View Topics</Btn>
              </div>
            );
          })}
        </div>
      )}
      {sec==="platform" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {PLATFORM_GROWTH.map(p=>(
            <Card key={p.platform} style={{ padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#2d4a3a" }}>{p.platform}</div>
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:p.score>80?"#5a8a6a":"#d4a574", fontWeight:700 }}>Score {p.score}/100</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:12 }}>
                {[["Followers",p.followers,"#5a8a6a"],["Reach",p.reach,"#7ab5d4"],["Saves",p.saves,"#d4a574"],["App Clicks",p.appClicks,"#9a6ab8"]].map(([l,v,c])=>(
                  <div key={l} style={{ background:`${c}12`, borderRadius:9, padding:11 }}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:c }}>{v}</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a" }}>{l}</div>
                  </div>
                ))}
              </div>
              <ScoreBar score={p.score} color={p.score>80?"#5a8a6a":"#d4a574"} height={7}/>
            </Card>
          ))}
        </div>
      )}
      {sec==="premium" && (
        <div>
          <Card style={{ padding:22, marginBottom:14, background:"linear-gradient(135deg,#f5f0f8,#ede8f5)", border:"1px solid #c8b8e0" }}>
            <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:14 }}><I n="crown" s={18} c="#9a6ab8"/><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#4a2a6a" }}>The Premium Conversion Path</div></div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:9 }}>
              {[["1","Awareness Post","Free education, broad reach","Awareness","#7ab5d4"],["2","Trust Building","Relatable, saves-worthy content","Trust Building","#8fb5a0"],["3","Education Deep Dive","They trust you now","Education","#b8c9a3"],["4","Premium Teaser","Show what unlocks softly","Premium Teaser","#b08fbe"],["5","Conversion CTA","Link in bio → Download","Conversion Focused","#9a6ab8"]].map(([step,label,desc,tag,c])=>(
                <div key={step} style={{ background:"white", borderRadius:11, padding:13, border:`1px solid ${c}44`, textAlign:"center" }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:`${c}33`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 7px", fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:700, color:c }}>{step}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:600, color:"#2d4a3a", marginBottom:4 }}>{label}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a", marginBottom:6, lineHeight:1.4 }}>{desc}</div>
                  <GrowthTagBadge tag={tag}/>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ background:"#f0f8f4", borderRadius:13, padding:18, border:"1px solid #b8d8c8" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:10 }}>💚 Conversion Strategy Notes</div>
            {["Never lead with Premium. Build trust first through free education.","Luteal phase fasting content earns the most trust — follow with a Premium teaser within 48 hours.","Always include 'link in bio' in Conversion posts — never assume they'll search.","Pinterest drives the highest click-through rate. Use it for Premium CTAs.","Men's content is an underused conversion path — men convert faster when they trust the brand."].map((note,i)=>(
              <div key={i} style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d5a4a", padding:"6px 0", borderBottom:i<4?"1px dashed #c8e8d0":"none", lineHeight:1.55 }}>💚 {note}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC LIBRARY
// ─────────────────────────────────────────────────────────────────────────────
function TopicsPage({ topics, setTopics, fPhase, setFPhase, fPillar, setFPillar, searchQ, setSearchQ, selTopic, setSelTopic, showAdd, setShowAdd }) {
  const [newT, setNewT] = useState({ title:"", pillar:"Cycle Education", audience:"Women", phase:"Follicular", platforms:[], status:"Idea", priority:"Medium", notes:"", source:"", growthTags:[] });
  const filtered = topics.filter(t=>(fPhase==="All"||t.phase===fPhase)&&(fPillar==="All"||t.pillar===fPillar)&&(!searchQ||t.title.toLowerCase().includes(searchQ.toLowerCase())));
  const handleAdd = () => { if(!newT.title)return; setTopics(p=>[...p,{...newT,id:Date.now(),created:new Date().toISOString().split("T")[0],platforms:newT.platforms.length?newT.platforms:["Instagram"]}]); setNewT({title:"",pillar:"Cycle Education",audience:"Women",phase:"Follicular",platforms:[],status:"Idea",priority:"Medium",notes:"",source:"",growthTags:[]}); setShowAdd(false); };
  return (
    <div className="fade">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <SectionHead title="Topic Library" sub={`${topics.length} topics · ${filtered.length} shown`}/>
        <Btn onClick={()=>setShowAdd(true)}><I n="plus" s={14} c="white"/> Add Topic</Btn>
      </div>
      <div style={{ display:"flex", gap:9, marginBottom:12, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search topics…" className="inp" style={{ paddingLeft:32 }}/>
          <div style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", color:"#8a9a8a" }}><I n="search" s={13}/></div>
        </div>
        <select value={fPhase} onChange={e=>setFPhase(e.target.value)} className="inp" style={{ width:145 }}><option value="All">All Phases</option>{PHASES.map(p=><option key={p}>{p}</option>)}</select>
        <select value={fPillar} onChange={e=>setFPillar(e.target.value)} className="inp" style={{ width:170 }}><option value="All">All Pillars</option>{PILLARS.map(p=><option key={p}>{p}</option>)}</select>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {PHASES.map(p=><button key={p} onClick={()=>setFPhase(fPhase===p?"All":p)} style={{ background:fPhase===p?PHASE_COLORS[p]:`${PHASE_COLORS[p]}22`, color:fPhase===p?"white":PHASE_COLORS[p], border:`1px solid ${PHASE_COLORS[p]}55`, borderRadius:20, padding:"3px 12px", fontFamily:"'Jost',sans-serif", fontSize:10.5, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}><PhaseDot phase={p} size={7}/>{p}</button>)}
      </div>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"#f0ebe0" }}>{["Title","Pillar","Phase","Audience","Growth Tags","Platforms","Status",""].map(h=><th key={h} style={{ padding:"10px 13px", textAlign:"left", fontFamily:"'Jost',sans-serif", fontSize:9.5, fontWeight:700, color:"#5a6a5a", textTransform:"uppercase", letterSpacing:"0.09em", borderBottom:"1px solid #e8e0d0" }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(t=>(
              <tr key={t.id} className="tr" style={{ borderBottom:"1px solid #f0e8d8", cursor:"pointer" }} onClick={()=>setSelTopic(t)}>
                <td style={{ padding:"12px 13px" }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontWeight:600, color:"#2d4a3a" }}>{t.title}</div>{t.notes&&<div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#8a9a8a", marginTop:2 }}>{t.notes.slice(0,44)}{t.notes.length>44?"…":""}</div>}</td>
                <td style={{ padding:"12px 13px" }}><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a6a5a" }}>{t.pillar}</span></td>
                <td style={{ padding:"12px 13px" }}><div style={{ display:"flex", alignItems:"center", gap:5 }}><PhaseDot phase={t.phase}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a6a5a" }}>{t.phase}</span></div></td>
                <td style={{ padding:"12px 13px" }}><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a6a5a" }}>{t.audience}</span></td>
                <td style={{ padding:"12px 13px" }}><div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{(t.growthTags||[]).slice(0,2).map(g=><GrowthTagBadge key={g} tag={g}/>)}</div></td>
                <td style={{ padding:"12px 13px" }}><div style={{ display:"flex", gap:3 }}>{t.platforms.map(p=><span key={p} style={{ padding:"1px 6px", borderRadius:9, fontSize:9, fontFamily:"'Jost',sans-serif", fontWeight:700, background:"#e8f0e8", color:"#3a5a4a" }}>{p.slice(0,2)}</span>)}</div></td>
                <td style={{ padding:"12px 13px" }}><Tag label={t.status} color={STATUS_COLORS[t.status]||"#b8c9a3"}/></td>
                <td style={{ padding:"12px 13px" }}><Btn variant="sm" onClick={e=>{e.stopPropagation();setSelTopic(t);}}><I n="edit" s={11}/></Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {showAdd && (
        <div className="overlay" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}><h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:"#2d4a3a" }}>Add New Topic 💚</h2><button onClick={()=>setShowAdd(false)} style={{ background:"transparent", border:"none", color:"#8a9a8a" }}><I n="x" s={18}/></button></div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ gridColumn:"1/-1" }}><Label>Topic Title *</Label><Input value={newT.title} onChange={e=>setNewT(p=>({...p,title:e.target.value}))} placeholder="e.g. Seed Cycling for Follicular Phase Energy"/></div>
              {[["Content Pillar","pillar",PILLARS],["Audience","audience",AUDIENCES],["Cycle Phase","phase",PHASES],["Status","status",STATUSES],["Priority","priority",["High","Medium","Low"]],["Source","source",["Research","Community Question","Brand Strategy","Content Plan","Trend Research","Other"]]].map(([l,k,opts])=><div key={k}><Label>{l}</Label><Select value={newT[k]} onChange={e=>setNewT(p=>({...p,[k]:e.target.value}))} options={opts}/></div>)}
              <div style={{ gridColumn:"1/-1" }}>
                <Label>Growth Tags</Label>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {GROWTH_TAGS.map(g=><button key={g} onClick={()=>setNewT(p=>({...p,growthTags:p.growthTags.includes(g)?p.growthTags.filter(x=>x!==g):[...p.growthTags,g]}))} style={{ background:newT.growthTags.includes(g)?GROWTH_TAG_COLORS[g]:`${GROWTH_TAG_COLORS[g]}22`, color:newT.growthTags.includes(g)?"white":GROWTH_TAG_COLORS[g], border:`1px solid ${GROWTH_TAG_COLORS[g]}55`, borderRadius:20, padding:"4px 11px", fontSize:11, fontFamily:"'Jost',sans-serif", cursor:"pointer" }}>{g}</button>)}
                </div>
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <Label>Platforms</Label>
                <div style={{ display:"flex", gap:6 }}>{PLATFORMS.map(p=><button key={p} onClick={()=>setNewT(prev=>({...prev,platforms:prev.platforms.includes(p)?prev.platforms.filter(x=>x!==p):[...prev.platforms,p]}))} style={{ background:newT.platforms.includes(p)?"#5a8a6a":"#f0ebe0", color:newT.platforms.includes(p)?"white":"#5a6a5a", border:"1px solid #d8cfc0", borderRadius:20, padding:"5px 13px", fontSize:12, fontFamily:"'Jost',sans-serif", cursor:"pointer" }}>{p}</button>)}</div>
              </div>
              <div style={{ gridColumn:"1/-1" }}><Label>Notes</Label><textarea value={newT.notes} onChange={e=>setNewT(p=>({...p,notes:e.target.value}))} className="inp" placeholder="Any notes…"/></div>
            </div>
            <div style={{ display:"flex", gap:9, marginTop:20 }}><Btn onClick={handleAdd} style={{ flex:1, justifyContent:"center" }}>Add Topic 💚</Btn><Btn variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
          </div>
        </div>
      )}
      {selTopic && (
        <div className="overlay" onClick={()=>setSelTopic(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18 }}>
              <div>
                <div style={{ display:"flex", gap:6, marginBottom:7 }}><PhaseDot phase={selTopic.phase}/><Tag label={selTopic.status} color={STATUS_COLORS[selTopic.status]||"#b8c9a3"}/></div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"#2d4a3a" }}>{selTopic.title}</h2>
              </div>
              <button onClick={()=>setSelTopic(null)} style={{ background:"transparent", border:"none", color:"#8a9a8a" }}><I n="x" s={18}/></button>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
              {[["Pillar",selTopic.pillar],["Audience",selTopic.audience],["Phase",selTopic.phase],["Source",selTopic.source]].map(([l,v])=><div key={l} style={{ background:"#f5f0e8", borderRadius:9, padding:12 }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>{l}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:"#2d4a3a", fontWeight:500 }}>{v}</div></div>)}
            </div>
            <div style={{ background:"#f5f0e8", borderRadius:9, padding:12, marginBottom:10 }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>Growth Tags</div><div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{(selTopic.growthTags||[]).map(g=><GrowthTagBadge key={g} tag={g}/>)}</div></div>
            {selTopic.notes&&<div style={{ background:"#f5f0e8", borderRadius:9, padding:12, marginBottom:10 }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Notes</div><p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#3a5a4a", lineHeight:1.6 }}>{selTopic.notes}</p></div>}
            <div style={{ display:"flex", gap:8, marginTop:16 }}><Btn style={{ flex:1, justifyContent:"center" }}><I n="ai" s={13} c="white"/> Generate Package</Btn><Btn variant="ghost"><I n="edit" s={13}/> Edit</Btn><Btn variant="ghost"><I n="repurpose" s={13}/> Duplicate</Btn></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR
// ─────────────────────────────────────────────────────────────────────────────
function CalendarPage({ calView, setCalView, packages }) {
  const hasMens = Object.values(WEEKLY_SCHEDULE).flat().some(p=>p.phase==="Men");
  return (
    <div className="fade">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <SectionHead title="Content Calendar" sub="Week of January 20–26, 2025"/>
        <div style={{ display:"flex", gap:5 }}>{["week","month","day"].map(v=><button key={v} onClick={()=>setCalView(v)} style={{ background:calView===v?"#5a8a6a":"#f0ebe0", color:calView===v?"white":"#5a6a5a", borderRadius:7, padding:"6px 14px", fontFamily:"'Jost',sans-serif", fontSize:12, fontWeight:500, border:"none", textTransform:"capitalize" }}>{v}</button>)}</div>
      </div>
      {!hasMens&&<div style={{ background:"#fdf0e8", border:"1px solid #e8c8a0", borderRadius:10, padding:11, marginBottom:14, display:"flex", gap:8 }}><I n="warn" s={13} c="#c4726a"/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#7a4a3a" }}>No men's content scheduled this week. Add one men focused post. 💚</span></div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:7, marginBottom:18 }}>
        {Object.entries(WEEKLY_SCHEDULE).map(([day,posts])=>(
          <div key={day} style={{ background:"#faf7f2", borderRadius:13, border:"1px solid #e8e0d0", overflow:"hidden", minHeight:185 }}>
            <div style={{ background:"#f0ebe0", padding:"8px 9px", borderBottom:"1px solid #e8e0d0" }}>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:8.5, fontWeight:700, color:"#5a6a5a", textTransform:"uppercase", letterSpacing:"0.12em" }}>{day.split(" ")[0]}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a" }}>{day.split(" ")[1]}</div>
            </div>
            <div style={{ padding:7 }}>
              {posts.length===0?<div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#c0c8c0", textAlign:"center", padding:"16px 0", fontStyle:"italic" }}><div style={{ fontSize:16, marginBottom:2 }}>+</div>Empty</div>
                :posts.map((p,i)=>(
                  <div key={i} style={{ background:`${PHASE_COLORS[p.phase]}22`, border:`1px solid ${PHASE_COLORS[p.phase]}44`, borderRadius:7, padding:"7px 8px", marginBottom:5 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ padding:"1px 5px", borderRadius:7, fontSize:8, fontFamily:"'Jost',sans-serif", fontWeight:700, background:"#e8f0e8", color:"#3a5a4a" }}>{p.platform.slice(0,2)}</span><PhaseDot phase={p.phase} size={7}/></div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#2d4a3a", fontWeight:500, lineHeight:1.3, marginBottom:3 }}>{p.title.length>26?p.title.slice(0,26)+"…":p.title}</div>
                    <GrowthTagBadge tag={p.growthTag}/>
                  </div>
                ))}
              <button style={{ width:"100%", background:"transparent", border:"1px dashed #c8d8c8", borderRadius:7, padding:"4px 0", color:"#8ab0a0", fontSize:13, cursor:"pointer", marginTop:3 }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Card style={{ padding:18 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:11 }}>Phase Coverage</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {PHASES.map(phase=>{const cnt=Object.values(WEEKLY_SCHEDULE).flat().filter(p=>p.phase===phase).length;return(<div key={phase} style={{ display:"flex", alignItems:"center", gap:5, background:cnt>0?`${PHASE_COLORS[phase]}22`:"#f5f0e8", border:`1px solid ${cnt>0?PHASE_COLORS[phase]+"44":"#e8e0d0"}`, borderRadius:18, padding:"4px 12px" }}><PhaseDot phase={phase} size={7}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, color:cnt>0?"#2d4a3a":"#a0a8a0" }}>{phase}</span><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, fontWeight:700, color:cnt>0?PHASE_COLORS[phase]:"#c0c8c0" }}>{cnt}</span></div>);})}
          </div>
        </Card>
        <Card style={{ padding:18 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:11 }}>Growth Tag Coverage This Week</div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {["Awareness","Trust Building","Education"].map(tag=><div key={tag}><GrowthTagBadge tag={tag}/></div>)}
            {["App Feature Promotion","Premium Teaser","Conversion Focused"].map(tag=><div key={tag} style={{ padding:"2px 9px", borderRadius:20, fontSize:10, fontFamily:"'Jost',sans-serif", fontWeight:600, background:"#f5f0e8", color:"#a0a8a0", border:"1px dashed #d0c8b8" }}>⚠ {tag}</div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT PACKAGES
// ─────────────────────────────────────────────────────────────────────────────
function PackagesPage({ packages, setPackages, topics, selPkg, setSelPkg }) {
  const upd = (id,s) => setPackages(p=>p.map(x=>x.id===id?{...x,status:s}:x));
  return (
    <div className="fade">
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <SectionHead title="Content Packages" sub={`${packages.length} packages · ${packages.filter(p=>p.status==="Approved").length} approved`}/>
        <Btn><I n="plus" s={14} c="white"/> New Package</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:14 }}>
        {packages.map(pkg=>(
          <div key={pkg.id} className="ch" style={{ background:"#faf7f2", borderRadius:17, border:"1px solid #e8e0d0", overflow:"hidden" }}>
            <div style={{ background:`linear-gradient(135deg,${PHASE_COLORS[pkg.phase]}2a,${PHASE_COLORS[pkg.phase]}10)`, padding:"16px 16px 12px", borderBottom:"1px solid #e8e0d0" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}><div style={{ display:"flex", gap:5, flexWrap:"wrap" }}><Tag label={pkg.status} color={STATUS_COLORS[pkg.status]||"#b8c9a3"}/>{pkg.analytics&&<Tag label="Analytics" color="#5a8a6a"/>}</div><div style={{ display:"flex", gap:3 }}>{pkg.platforms.map(p=><span key={p} style={{ padding:"1px 6px", borderRadius:9, fontSize:8.5, fontFamily:"'Jost',sans-serif", fontWeight:700, background:"white", color:"#3a5a4a", border:"1px solid #d8e8d0" }}>{p.slice(0,2)}</span>)}</div></div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", lineHeight:1.3 }}>{pkg.title}</h3>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#5a6a5a", marginTop:3 }}>{pkg.pillar} · {pkg.phase} · {pkg.audience}</div>
              {(pkg.growthTags||[]).length>0&&<div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>{pkg.growthTags.map(g=><GrowthTagBadge key={g} tag={g}/>)}</div>}
            </div>
            {pkg.analytics&&(
              <div style={{ padding:"10px 14px", borderBottom:"1px solid #f0e8d8", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                {[["Views",pkg.analytics.views.toLocaleString(),"#7ab5d4"],["Saves",pkg.analytics.saves.toLocaleString(),"#d4a574"],["App",pkg.analytics.appStoreClicks,"#9a6ab8"],["Followers",`+${pkg.analytics.followersGained}`,"#5a8a6a"]].map(([l,v,c])=>(
                  <div key={l} style={{ textAlign:"center" }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:c }}>{v}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:8.5, color:"#8a9a8a" }}>{l}</div></div>
                ))}
              </div>
            )}
            <div style={{ padding:"10px 13px 12px" }}>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#3a5a4a", lineHeight:1.6, marginBottom:9 }}>{pkg.caption.slice(0,95)}…</p>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {pkg.status==="Needs Review"&&<><Btn variant="primary" style={{ fontSize:10, padding:"5px 11px" }} onClick={()=>upd(pkg.id,"Approved")}><I n="check" s={11} c="white"/> Approve</Btn><Btn variant="danger" style={{ fontSize:10, padding:"5px 9px" }} onClick={()=>upd(pkg.id,"Draft")}><I n="x" s={11} c="#c4726a"/></Btn></>}
                <Btn variant="sm" onClick={()=>setSelPkg(pkg)}><I n="eye" s={11}/> View</Btn>
                <Btn variant="sm"><I n="repurpose" s={11}/> Repurpose</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selPkg&&(
        <div className="overlay" onClick={()=>setSelPkg(null)}>
          <div className="modal modal-wide" onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div><div style={{ display:"flex", gap:6, marginBottom:6, flexWrap:"wrap" }}><Tag label={selPkg.status} color={STATUS_COLORS[selPkg.status]||"#b8c9a3"}/>{(selPkg.growthTags||[]).map(g=><GrowthTagBadge key={g} tag={g}/>)}</div><h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"#2d4a3a" }}>{selPkg.title}</h2></div>
              <button onClick={()=>setSelPkg(null)} style={{ background:"transparent", border:"none", color:"#8a9a8a" }}><I n="x" s={18}/></button>
            </div>
            {selPkg.analytics&&<div style={{ background:"#f0f8f4", borderRadius:11, padding:14, marginBottom:13, display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:9, border:"1px solid #c0e0d0" }}>{[["Views",selPkg.analytics.views.toLocaleString(),"#7ab5d4"],["Saves",selPkg.analytics.saves.toLocaleString(),"#d4a574"],["Followers",`+${selPkg.analytics.followersGained}`,"#5a8a6a"],["App Clicks",selPkg.analytics.appStoreClicks,"#9a6ab8"],["Bio Clicks",selPkg.analytics.linkInBioClicks,"#b08fbe"]].map(([l,v,c])=><div key={l} style={{ textAlign:"center" }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:c }}>{v}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#5a8a6a", textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</div></div>)}</div>}
            <div style={{ display:"grid", gap:9 }}>
              {[["Caption 💚",selPkg.caption],["Hashtags",selPkg.hashtags],["CTA",selPkg.cta],["Scheduled",selPkg.scheduledDate||"Not scheduled"]].map(([l,v])=>(
                <div key={l} style={{ background:"#f5f0e8", borderRadius:9, padding:12 }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>{l}</div><p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d4a3a", lineHeight:1.65 }}>{v}</p></div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              {selPkg.status==="Needs Review"&&<Btn onClick={()=>{upd(selPkg.id,"Approved");setSelPkg(null);}}>Approve 💚</Btn>}
              <Btn variant="ghost"><I n="edit" s={13}/> Edit</Btn>
              <Btn variant="ghost"><I n="repurpose" s={13}/> Repurpose</Btn>
              <Btn variant="purple" style={{ marginLeft:"auto" }}><I n="crown" s={13} c="white"/> Premium Teaser</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ASSET LIBRARY
// ─────────────────────────────────────────────────────────────────────────────
function AssetsPage() {
  const [folder, setFolder] = useState("Food");
  const folders = ["Food","Workouts","Fasting","Cycle Education","Men","App Features","Lifestyle","Moon & Rituals","General"];
  const subs = { Food:["Menstrual","Follicular","Ovulation","Luteal","Men","General"], Workouts:["Menstrual","Follicular","Ovulation","Luteal","Men","General"], Fasting:["Menstrual","Follicular","Ovulation","Luteal","Men","General"], Men:["Men's Fasting","Men's Energy","Men's Workouts","Men's Nutrition","Men's Mindset","Men's App Features"] };
  const assets = Array.from({length:12},(_,i)=>({ id:i+1, type:i%3===0?"video":"image", phase:PHASES[i%6], platform:PLATFORMS[i%4], posted:i%2===0, title:`${folder} Asset ${i+1}`, color:Object.values(PHASE_COLORS)[i%6], growthTag:GROWTH_TAGS[i%7] }));
  return (
    <div className="fade">
      <SectionHead title="Asset Library" sub="Your private visual library — organized by category and growth goal"/>
      <div style={{ display:"flex", gap:18 }}>
        <div style={{ width:185, flexShrink:0 }}><Card style={{ overflow:"hidden" }}>{folders.map(f=><div key={f} onClick={()=>setFolder(f)} style={{ padding:"9px 14px", cursor:"pointer", background:folder===f?"#e8f0e8":"transparent", borderLeft:folder===f?"3px solid #5a8a6a":"3px solid transparent", borderBottom:"1px solid #f0e8d8", transition:"all 0.15s" }}><span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:folder===f?"#2d4a3a":"#5a6a5a", fontWeight:folder===f?600:400 }}>{f}</span></div>)}</Card></div>
        <div style={{ flex:1 }}>
          {subs[folder]&&<div style={{ display:"flex", gap:5, marginBottom:12, flexWrap:"wrap" }}>{subs[folder].map(s=><button key={s} style={{ background:"#f0ebe0", color:"#5a6a5a", border:"1px solid #d8cfc0", borderRadius:18, padding:"3px 11px", fontFamily:"'Jost',sans-serif", fontSize:10.5, cursor:"pointer" }}>{s}</button>)}</div>}
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <div style={{ position:"relative", flex:1 }}><input placeholder="Search assets…" className="inp" style={{ paddingLeft:30 }}/><div style={{ position:"absolute", left:8, top:"50%", transform:"translateY(-50%)", color:"#8a9a8a" }}><I n="search" s={13}/></div></div>
            <select className="inp" style={{ width:125 }}><option>All Platforms</option>{PLATFORMS.map(p=><option key={p}>{p}</option>)}</select>
            <select className="inp" style={{ width:115 }}><option>All Status</option><option>Posted</option><option>Not Posted</option></select>
          </div>
          <div style={{ border:"2px dashed #b8d8c8", borderRadius:13, padding:16, textAlign:"center", marginBottom:13, cursor:"pointer", background:"#f5faf7" }}><I n="upload" s={19} c="#8fb5a0"/><div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#5a8a6a", marginTop:5, fontWeight:500 }}>Drop files or click to upload</div></div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))", gap:10 }}>
            {assets.map(a=>(
              <div key={a.id} className="ch" style={{ background:"#faf7f2", borderRadius:11, border:"1px solid #e8e0d0", overflow:"hidden" }}>
                <div style={{ height:95, background:`${a.color}33`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  <I n={a.type==="video"?"vid":"asset"} s={26} c={a.color}/>
                  {a.posted&&<span style={{ position:"absolute", top:4, right:4, background:"#5a8a6a", color:"white", borderRadius:7, padding:"1px 6px", fontFamily:"'Jost',sans-serif", fontSize:8, fontWeight:700 }}>Posted</span>}
                  <span style={{ position:"absolute", top:4, left:4, background:"white", borderRadius:7, padding:"1px 6px", fontFamily:"'Jost',sans-serif", fontSize:8, fontWeight:700, color:a.color }}>{a.platform.slice(0,2)}</span>
                </div>
                <div style={{ padding:"8px 9px 7px" }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#2d4a3a", fontWeight:500, marginBottom:4 }}>{a.title}</div>
                  <GrowthTagBadge tag={a.growthTag}/>
                  <div style={{ display:"flex", gap:4, marginTop:6 }}>
                    <button style={{ flex:1, background:"#f0ebe0", color:"#5a6a5a", borderRadius:5, padding:"3px 0", fontSize:9.5, fontFamily:"'Jost',sans-serif", border:"none", cursor:"pointer" }}>Edit</button>
                    <button style={{ flex:1, background:"#e8f5ee", color:"#3a7a5a", borderRadius:5, padding:"3px 0", fontSize:9.5, fontFamily:"'Jost',sans-serif", border:"none", cursor:"pointer" }}>Reuse</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI GENERATOR  (live Anthropic API with growth goal + sound profile)
// ─────────────────────────────────────────────────────────────────────────────
function GeneratorPage({ topics, setPackages }) {
  const [step, setStep] = useState(1);
  const [selId, setSelId] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [growthGoal, setGrowthGoal] = useState("Trust Building");
  const topic = topics.find(t=>t.id===selId);
  const soundProfile = SOUND_PROFILES[growthGoal];

  const handleGenerate = async () => {
    if(!topic) return;
    setGenerating(true); setStep(3);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:`You are the content AI for Lumen Flow, a wellness app for cycle syncing, fasting, and balanced health.

Topic: ${topic.title}
Pillar: ${topic.pillar} | Audience: ${topic.audience} | Phase: ${topic.phase}
Platforms: ${topic.platforms.join(", ")} | Growth Goal: ${growthGoal}
Sound Profile: ${soundProfile.type} / ${soundProfile.mood}

Brand rules: soft supportive feminine tone, 💚 green heart, no dashes, no shame language, no medical claims, gentle fasting (always say break fast if weak/dizzy/shaky), CTA = "link in bio 💚", shape entire piece around growth goal "${growthGoal}".

Return ONLY valid JSON, no markdown:
{"caption":"...","hashtags":"...","cta":"...","hook":"first 5 words","pinterest_title":"...","pinterest_description":"...","instagram_slide_1":"hook","instagram_slide_2":"insight","instagram_slide_3":"teaching","instagram_slide_4":"soft CTA","tiktok_hook":"3s spoken hook","tiktok_concept":"video concept","youtube_title":"...","growth_note":"one sentence on why this serves ${growthGoal}","sound_note":"one sentence on how sound choice supports this post"}` }] }) });
      const data = await resp.json();
      const text = data.content?.map(c=>c.text||"").join("")||"";
      try { setResult(JSON.parse(text.replace(/```json|```/g,"").trim())); } catch { setResult({ caption:`${topic.title} 💚 Your body already knows the rhythm. Trust it, support it. Link in bio 💚`, hashtags:"#cyclesyncing #lumenflo #hormonalhealth #cycleaware", cta:"Link in bio 💚", hook:"Your body already knows…", pinterest_title:topic.title, pinterest_description:`${topic.title} with Lumen Flow 💚`, instagram_slide_1:`${topic.title} 💚`, instagram_slide_2:"Here is what is actually happening", instagram_slide_3:"Three things to know this week", instagram_slide_4:"Save this and share it 💚", tiktok_hook:"Nobody told me this…", tiktok_concept:`Educational TikTok: ${topic.title}`, youtube_title:`${topic.title} | Lumen Flow 💚`, growth_note:`Builds ${growthGoal.toLowerCase()} through gentle education.`, sound_note:`Use ${soundProfile.type} to match the ${soundProfile.mood} energy.` }); }
    } catch { setResult({ caption:`${topic.title} 💚 Link in bio 💚`, hashtags:"#lumenflo", cta:"Link in bio 💚", hook:"This changes everything…", pinterest_title:topic.title, pinterest_description:"With Lumen Flow 💚", instagram_slide_1:"Hook", instagram_slide_2:"Insight", instagram_slide_3:"Teaching", instagram_slide_4:"Save 💚", tiktok_hook:"Nobody told me…", tiktok_concept:"Educational video", youtube_title:`${topic.title} 💚`, growth_note:`Supports ${growthGoal}.`, sound_note:`Use ${soundProfile.type}.` }); }
    setGenerating(false);
  };

  const handleSave = () => {
    if(!result||!topic) return;
    setPackages(p=>[...p,{ id:Date.now(), topicId:topic.id, title:topic.title, pillar:topic.pillar, audience:topic.audience, phase:topic.phase, platforms:topic.platforms, status:"Needs Review", scheduledDate:"", caption:result.caption, hashtags:result.hashtags, cta:result.cta, growthTags:[growthGoal], analytics:null }]);
    setStep(1); setSelId(null); setResult(null);
    alert("Package saved to review queue 💚");
  };

  return (
    <div className="fade">
      <SectionHead title="AI Content Generator" sub="Turn one topic into a complete multi-platform growth package"/>
      <div style={{ display:"flex", gap:0, marginBottom:22 }}>
        {["Select Topic","Set Growth Goal","Review & Save"].map((s,i)=>(
          <div key={s} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:step>i+1?"#5a8a6a":step===i+1?"#3a6a4a":"#e8e0d0", color:step>=i+1?"white":"#9a9a8a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Jost',sans-serif", fontSize:11, fontWeight:700 }}>{step>i+1?"✓":i+1}</div>
              <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:step===i+1?"#2d4a3a":"#8a9a8a", fontWeight:step===i+1?600:400 }}>{s}</span>
            </div>
            {i<2&&<div style={{ width:32, height:1, background:"#d8d0c0", margin:"0 9px" }}/>}
          </div>
        ))}
      </div>

      {step===1&&(
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:600, color:"#2d4a3a", marginBottom:13 }}>Choose a topic</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))", gap:10 }}>
            {topics.filter(t=>!["Posted","Scheduled"].includes(t.status)).map(t=>(
              <div key={t.id} className="ch" onClick={()=>{setSelId(t.id);setStep(2);}} style={{ background:selId===t.id?"#e8f5ee":"#faf7f2", borderRadius:12, border:`2px solid ${selId===t.id?"#5a8a6a":"#e8e0d0"}`, padding:15, cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><div style={{ display:"flex", gap:5 }}><PhaseDot phase={t.phase}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#5a6a5a" }}>{t.phase}</span></div><Tag label={t.status} color={STATUS_COLORS[t.status]||"#b8c9a3"}/></div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontWeight:600, color:"#2d4a3a", marginBottom:5 }}>{t.title}</div>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{(t.growthTags||[]).map(g=><GrowthTagBadge key={g} tag={g}/>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step===2&&topic&&(
        <div style={{ maxWidth:560 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:600, color:"#2d4a3a", marginBottom:4 }}>Generating for: <em>{topic.title}</em></div>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#7a8a7a", marginBottom:18 }}>{topic.pillar} · {topic.phase} · {topic.audience}</div>
          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:"#3a5a4a", marginBottom:9, fontWeight:600 }}>Primary Growth Goal</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
            {GROWTH_TAGS.map(g=>(
              <div key={g} onClick={()=>setGrowthGoal(g)} style={{ background:growthGoal===g?`${GROWTH_TAG_COLORS[g]}22`:"#faf7f2", border:`2px solid ${growthGoal===g?GROWTH_TAG_COLORS[g]:"#e8e0d0"}`, borderRadius:10, padding:12, cursor:"pointer" }}>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, fontWeight:600, color:GROWTH_TAG_COLORS[g], marginBottom:2 }}>{g}</div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a", lineHeight:1.4, marginBottom:4 }}>{{  "Awareness":"Max reach and new eyes","Trust Building":"Save-worthy credibility","Education":"Deep cycle-aware teaching","App Feature Promotion":"Show what the app does","Premium Teaser":"Soft preview of Premium","Conversion Focused":"Drive app store clicks","Community Building":"Build connection and belonging" }[g]}</div>
                {growthGoal===g&&soundProfile&&<div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#5a8a6a", fontWeight:600 }}>🎵 Sound: {soundProfile.type}</div>}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}><Btn onClick={handleGenerate} style={{ padding:"12px 28px" }}><I n="ai" s={14} c="white"/> Generate 💚</Btn><Btn variant="ghost" onClick={()=>setStep(1)}>Back</Btn></div>
        </div>
      )}

      {step===3&&(
        generating?(
          <div style={{ textAlign:"center", padding:"58px 0" }}>
            <div style={{ fontSize:40, marginBottom:13 }} className="pulse">💚</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, color:"#2d4a3a", marginBottom:7 }}>Generating your {growthGoal} package…</div>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#8a9a8a" }}>Captions, hooks, slides, sound direction, and growth strategy 🌿</div>
          </div>
        ):result&&(
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:16 }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"#2d4a3a" }}>Generated Package 💚</h3>
              <GrowthTagBadge tag={growthGoal}/>
            </div>
            {result.growth_note&&<div style={{ background:"#f0f8f4", borderRadius:10, padding:13, border:"1px solid #b8d8c8", marginBottom:12, display:"flex", gap:8 }}><I n="target" s={15} c="#5a8a6a"/><p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d5a4a", lineHeight:1.6 }}><strong>Growth note:</strong> {result.growth_note}</p></div>}
            {result.sound_note&&soundProfile&&<div style={{ background:"#f0f4fa", borderRadius:10, padding:13, border:"1px solid #b8c8e0", marginBottom:14, display:"flex", gap:8, alignItems:"flex-start" }}><I n="music" s={15} c="#5a7ab8"/><div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#5a7ab8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Sound Direction</div><p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d3a5a", lineHeight:1.6 }}>{result.sound_note}</p><div style={{ display:"flex", gap:5, marginTop:6, flexWrap:"wrap" }}>{soundProfile.searchTerms.map(t=><span key={t} style={{ background:"#e8ecf8", color:"#3a4a8a", padding:"2px 9px", borderRadius:18, fontFamily:"'Jost',sans-serif", fontSize:9.5, fontWeight:500 }}>{t}</span>)}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#8a9a8a", marginTop:5 }}>Add inside: {soundProfile.addWhere}</div></div></div>}
            {result.hook&&<div style={{ background:"linear-gradient(135deg,#2d4a3a,#1e3329)", borderRadius:11, padding:14, marginBottom:13 }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"rgba(184,201,163,0.7)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:5 }}>Scroll-Stop Hook</div><p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:500, color:"#b8e0c8", fontStyle:"italic" }}>"{result.hook}"</p></div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["Main Caption 💚",result.caption,true],["Hashtags",result.hashtags,false],["CTA",result.cta,false],["Pinterest Title",result.pinterest_title,false],["Pinterest Description",result.pinterest_description,false],["Instagram Slide 1",result.instagram_slide_1,false],["Instagram Slide 2",result.instagram_slide_2,false],["Instagram Slide 3",result.instagram_slide_3,false],["Instagram Slide 4",result.instagram_slide_4,false],["TikTok Hook",result.tiktok_hook,false],["TikTok Concept",result.tiktok_concept,false],["YouTube Title",result.youtube_title,false]].map(([l,v,full])=>(
                <div key={l} style={{ gridColumn:full?"1/-1":"auto", background:"#f5f0e8", borderRadius:10, padding:13, border:"1px solid #e8e0d0" }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>{l}</div>
                  <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11.5, color:"#2d4a3a", lineHeight:1.65 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <Btn onClick={handleSave} style={{ padding:"11px 26px" }}>Save to Review Queue 💚</Btn>
              <Btn variant="ghost" onClick={()=>{setStep(2);setResult(null);}}>Regenerate</Btn>
              <Btn variant="ghost" onClick={()=>{setStep(1);setSelId(null);setResult(null);}}>Start Over</Btn>
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO QUEUE  (with music status column)
// ─────────────────────────────────────────────────────────────────────────────
function VideoQueuePage({ videoQueue, setVideoQueue, selVideo, setSelVideo }) {
  const sColors = { "Waiting":"#d4a574","Generating":"#8fb5a0","Complete":"#6b8f7a","Needs Review":"#e8c5a0","Approved":"#5a8a6a","Posted":"#3a6a4a","Failed":"#c4726a" };
  const upd = (id,status) => setVideoQueue(p=>p.map(v=>v.id===id?{...v,status}:v));
  return (
    <div className="fade">
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        <SectionHead title="Gemini / Veo Video Queue" sub="Pre-generate videos so they are ready ahead of your posting schedule"/>
        <Btn><I n="plus" s={14} c="white"/> Queue Video</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10, marginBottom:18 }}>
        {["Waiting","Generating","Needs Review","Approved","Posted","Failed"].map(s=>(
          <Card key={s} style={{ padding:14, textAlign:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:sColors[s] }}>{videoQueue.filter(v=>v.status===s).length}</div>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a", marginTop:2 }}>{s}</div>
          </Card>
        ))}
      </div>
      <Card style={{ padding:16, marginBottom:16 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:10 }}>Daily Settings</div>
        <div style={{ display:"flex", gap:16 }}>
          {[["Videos to generate per day",[1,2,3,4,5],3],["TikToks to post per day",[1,2,3,4],2]].map(([l,opts,def])=>(
            <div key={l}><Label>{l}</Label><Select value={String(def)} onChange={()=>{}} options={opts.map(String)}/></div>
          ))}
        </div>
      </Card>
      <div style={{ display:"grid", gap:8 }}>
        {videoQueue.map(v=>(
          <Card key={v.id} style={{ padding:16, display:"flex", alignItems:"center", gap:13, border:`1px solid ${v.music.musicStatus==="Needs Music"&&v.status==="Approved"?"#e8c080":"#e8e0d0"}` }}>
            <div style={{ width:42, height:42, borderRadius:9, background:`${PHASE_COLORS[v.phase]}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><I n="vid" s={19} c={PHASE_COLORS[v.phase]}/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:"#2d4a3a", marginBottom:3 }}>{v.topic}</div>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, color:"#7a8a7a", marginBottom:5 }}>{v.concept}</div>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ padding:"1px 7px", borderRadius:9, fontSize:9.5, fontFamily:"'Jost',sans-serif", fontWeight:700, background:"#e8f0e8", color:"#3a5a4a" }}>{v.platform}</span>
                <PhaseDot phase={v.phase} size={7}/>
                <GrowthTagBadge tag={v.growthTag}/>
                <Tag label={v.music.musicStatus} color={MUSIC_STATUS_COLORS[v.music.musicStatus]||"#b8c9a3"}/>
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#7a8a7a" }}>🎵 {v.music.recommendedType}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:7, alignItems:"center", flexShrink:0 }}>
              <Tag label={v.status} color={sColors[v.status]||"#b8c9a3"}/>
              {v.status==="Needs Review"&&<Btn style={{ fontSize:11, padding:"6px 12px" }} onClick={()=>upd(v.id,"Approved")}>Approve</Btn>}
              {v.status==="Failed"&&<Btn variant="danger" style={{ fontSize:11, padding:"6px 10px" }} onClick={()=>upd(v.id,"Waiting")}><I n="refresh" s={11} c="#c4726a"/> Retry</Btn>}
              <Btn variant="sm" onClick={()=>setSelVideo(selVideo?.id===v.id?null:v)}><I n="music" s={11}/> Sound</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APPROVALS
// ─────────────────────────────────────────────────────────────────────────────
function ApprovalsPage({ packages, setPackages }) {
  const pending = packages.filter(p=>p.status==="Needs Review");
  const upd = (id,s) => setPackages(p=>p.map(x=>x.id===id?{...x,status:s}:x));
  return (
    <div className="fade">
      <SectionHead title="Approval Queue" sub={`${pending.length} packages waiting for review`}/>
      {pending.length===0?<Card style={{ padding:"55px 0", textAlign:"center" }}><div style={{ fontSize:36, marginBottom:11 }}>💚</div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, color:"#2d4a3a" }}>All caught up!</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#7a8a7a", marginTop:5 }}>Nothing waiting for approval.</div></Card>:(
        <div style={{ display:"grid", gap:14 }}>
          {pending.map(pkg=>(
            <Card key={pkg.id} style={{ overflow:"hidden" }}>
              <div style={{ padding:"16px 20px 13px", borderBottom:"1px solid #f0e8d8", display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ display:"flex", gap:6, marginBottom:5, flexWrap:"wrap" }}><PhaseDot phase={pkg.phase}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, color:"#7a8a7a" }}>{pkg.phase} · {pkg.pillar}</span>{(pkg.growthTags||[]).map(g=><GrowthTagBadge key={g} tag={g}/>)}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:600, color:"#2d4a3a" }}>{pkg.title}</h3>
                </div>
                <div style={{ display:"flex", gap:4 }}>{pkg.platforms.map(p=><span key={p} style={{ padding:"2px 8px", borderRadius:9, fontSize:10, fontFamily:"'Jost',sans-serif", fontWeight:700, background:"#e8f0e8", color:"#3a5a4a" }}>{p}</span>)}</div>
              </div>
              <div style={{ padding:"16px 20px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:11, marginBottom:16 }}>
                  <div style={{ background:"#f5f0e8", borderRadius:9, padding:12, gridColumn:"1/-1" }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Caption 💚</div><p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d4a3a", lineHeight:1.65 }}>{pkg.caption}</p></div>
                  <div style={{ background:"#f5f0e8", borderRadius:9, padding:12 }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Hashtags</div><p style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, color:"#5a8a6a", lineHeight:1.6 }}>{pkg.hashtags}</p></div>
                  <div style={{ background:"#f5f0e8", borderRadius:9, padding:12 }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>CTA</div><p style={{ fontFamily:"'Jost',sans-serif", fontSize:11.5, color:"#2d4a3a" }}>{pkg.cta}</p></div>
                  <div style={{ background:"#f5f0e8", borderRadius:9, padding:12 }}><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>Scheduled</div><p style={{ fontFamily:"'Jost',sans-serif", fontSize:11.5, color:"#2d4a3a" }}>{pkg.scheduledDate||"Not set"}</p></div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn onClick={()=>upd(pkg.id,"Approved")}><I n="check" s={14} c="white"/> Approve 💚</Btn>
                  <Btn variant="danger" onClick={()=>upd(pkg.id,"Draft")}><I n="x" s={14} c="#c4726a"/> Reject</Btn>
                  <Btn variant="ghost"><I n="edit" s={13}/> Edit</Btn>
                  <Btn variant="ghost"><I n="refresh" s={13}/> Regenerate</Btn>
                  <Btn variant="purple" style={{ marginLeft:"auto" }}><I n="crown" s={13} c="white"/> Premium Teaser</Btn>
                  <Btn style={{ background:"linear-gradient(135deg,#3a6a4a,#2a5a3a)", color:"white", padding:"10px 18px" }}>Post Now</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS  (with sound performance tab)
// ─────────────────────────────────────────────────────────────────────────────
function AnalyticsPage({ packages, topics, videoQueue, tab, setTab }) {
  const posted = packages.filter(p=>p.analytics);
  const tViews = posted.reduce((a,p)=>a+(p.analytics.views||0),0);
  const tSaves = posted.reduce((a,p)=>a+(p.analytics.saves||0),0);
  const tFollow = posted.reduce((a,p)=>a+(p.analytics.followersGained||0),0);
  const tApp = posted.reduce((a,p)=>a+(p.analytics.appStoreClicks||0),0);
  return (
    <div className="fade">
      <SectionHead title="Analytics" sub="All metrics connected to business goals"/>
      <div style={{ display:"flex", gap:5, marginBottom:20, background:"#f0ebe0", padding:4, borderRadius:14, width:"fit-content" }}>
        {[["growth","Growth"],["phase","Phase"],["platform","Platform"],["pillars","Pillars"],["conversion","Conversion"],["sound","Sound"]].map(([t,l])=>(
          <button key={t} className="tab-pill" onClick={()=>setTab(t)} style={{ background:tab===t?"#faf7f2":"transparent", color:tab===t?"#2d4a3a":"#7a8a7a", boxShadow:tab===t?"0 1px 4px rgba(0,0,0,0.08)":"none", fontWeight:tab===t?600:400 }}>{l}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:11, marginBottom:18 }}>
        {[["Views",tViews.toLocaleString(),"#7ab5d4","eye"],["Saves",tSaves.toLocaleString(),"#d4a574","save"],["Followers",`+${tFollow}`,"#5a8a6a","users"],["Bio Clicks","992","#b08fbe","link"],["App Clicks",tApp,"#9a6ab8","phone"]].map(([l,v,c,ic])=>(
          <Card key={l} style={{ padding:16 }}><div style={{ display:"flex", justifyContent:"space-between" }}><div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:c, lineHeight:1 }}>{v}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, color:"#7a8a7a", marginTop:4 }}>{l}</div></div><I n={ic} s={15} c={c}/></div></Card>
        ))}
      </div>

      {tab==="growth"&&(
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Card style={{ padding:20 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:13 }}>Follower Growth by Platform</div>
            {PLATFORM_GROWTH.map(p=>(
              <div key={p.platform} style={{ marginBottom:11 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11.5, fontWeight:600, color:"#2d4a3a" }}>{p.platform}</span><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a8a6a", fontWeight:700 }}>{p.followers}</span></div>
                <ScoreBar score={p.score} color={p.score>80?"#5a8a6a":"#d4a574"}/>
              </div>
            ))}
          </Card>
          <Card style={{ padding:20 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:13 }}>Top Posts by Follower Gain</div>
            {TOP_POSTS.map((p,i)=>(
              <div key={i} style={{ padding:"9px 0", borderBottom:i<2?"1px solid #f0e8d8":"none" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontWeight:600, color:"#2d4a3a", marginBottom:4 }}>{p.title}</div>
                <div style={{ display:"flex", gap:7 }}><GrowthTagBadge tag={p.growthTag}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a8a6a", fontWeight:700 }}>+{p.followersGained}</span><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a" }}>{p.saves} saves</span></div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab==="phase"&&(
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Card style={{ padding:20 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:13 }}>Performance by Phase</div>
            {PHASES.map(phase=>{const s={Menstrual:72,Follicular:88,Ovulation:65,Luteal:94,Men:58,General:45}[phase];return(<div key={phase} style={{ marginBottom:11 }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><div style={{ display:"flex", alignItems:"center", gap:5 }}><PhaseDot phase={phase}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11.5, color:"#3a5a4a" }}>{phase}</span></div><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a8a6a", fontWeight:700 }}>{s}/100</span></div><ScoreBar score={s} color={PHASE_COLORS[phase]}/></div>);})}
          </Card>
          <Card style={{ padding:20 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:13 }}>Phase + Growth Tag Matrix</div>
            {[["Luteal","Trust Building","Highest saves, most reposts"],["Follicular","Education","Strong Pinterest performance"],["Men","Awareness","Growing — underposted"],["Ovulation","Community Building","High engagement, lower saves"],["Menstrual","Trust Building","Builds deep loyalty"]].map((r,i)=>(
              <div key={i} style={{ display:"flex", gap:7, alignItems:"center", padding:"7px 0", borderBottom:i<4?"1px solid #f0e8d8":"none" }}><PhaseDot phase={r[0]}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#2d4a3a", fontWeight:500, width:76 }}>{r[0]}</span><GrowthTagBadge tag={r[1]}/><span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a" }}>{r[2]}</span></div>
            ))}
          </Card>
        </div>
      )}

      {tab==="platform"&&(
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {PLATFORM_GROWTH.map(p=>(
            <Card key={p.platform} style={{ padding:18 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, fontWeight:600, color:"#2d4a3a", marginBottom:13 }}>{p.platform}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:11 }}>
                {[["Followers",p.followers,"#5a8a6a"],["Reach",p.reach,"#7ab5d4"],["Saves",p.saves,"#d4a574"],["App Clicks",p.appClicks,"#9a6ab8"]].map(([l,v,c])=>(
                  <div key={l} style={{ background:`${c}12`, borderRadius:8, padding:10 }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:c }}>{v}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#7a8a7a" }}>{l}</div></div>
                ))}
              </div>
              <ScoreBar score={p.score} color={p.score>80?"#5a8a6a":"#d4a574"} height={7}/>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:"#5a8a6a", marginTop:6, fontWeight:600 }}>Score: {p.score}/100</div>
            </Card>
          ))}
        </div>
      )}

      {tab==="pillars"&&(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:11 }}>
          {[{p:"Fasting",c:14,saves:"8.2K",app:94,f:"+203",color:"#d4a574"},{p:"Cycle Education",c:18,saves:"12.1K",app:61,f:"+142",color:"#8fb5a0"},{p:"Men",c:5,saves:"2.1K",app:64,f:"+98",color:"#5a7a6a"},{p:"Food",c:9,saves:"5.4K",app:22,f:"+67",color:"#b8c9a3"},{p:"App Features",c:3,saves:"0.8K",app:188,f:"+44",color:"#9a6ab8"},{p:"Workouts",c:7,saves:"3.2K",app:31,f:"+88",color:"#b08fbe"}].map(({p,c,saves,app,f,color})=>(
            <div key={p} style={{ background:`${color}12`, border:`1px solid ${color}33`, borderRadius:13, padding:16 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color, marginBottom:2 }}>{p}</div>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a", marginBottom:10 }}>{c} posted</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                {[["Saves",saves],["App Clicks",app],["Followers",f]].map(([l,v])=>(
                  <div key={l} style={{ background:"rgba(255,255,255,0.6)", borderRadius:7, padding:9 }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color }}>{v}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#7a8a7a" }}>{l}</div></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="conversion"&&(
        <div>
          <Card style={{ padding:20, marginBottom:14 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d4a3a", marginBottom:14 }}>Conversion Funnel</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:9 }}>
              {[["Reach","94.2K",100,"#7ab5d4"],["Engaged","14.3K",15.2,"#8fb5a0"],["Saved","10.4K",11.1,"#d4a574"],["Clicked","992",1.05,"#b08fbe"],["App","365",0.39,"#9a6ab8"]].map(([l,v,pct,c])=>(
                <div key={l} style={{ flex:1, textAlign:"center" }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:c, fontWeight:700, marginBottom:4 }}>{pct===100?"100%":pct+"%"}</div>
                  <div style={{ height:`${Math.max(pct,1.5)*1.6}px`, background:`${c}66`, borderRadius:"4px 4px 0 0", border:`1px solid ${c}88`, minHeight:6 }}/>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:c, marginTop:5 }}>{v}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#8a9a8a", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding:20, background:"#f5f0f8", border:"1px solid #c8b8e0" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#4a2a6a", marginBottom:10, display:"flex", gap:7 }}><I n="crown" s={15} c="#9a6ab8"/> Premium Conversion Signals</div>
            {["Users who saved 3+ fasting posts are ready for Premium CTA","High-performing cycle education should link to Premium reports","Add 'see the full breakdown in the app' to trust building posts","Pinterest fasting pins are driving the most Premium-intent clicks"].map((note,i)=>(
              <div key={i} style={{ fontFamily:"'Jost',sans-serif", fontSize:11.5, color:"#4a2a6a", padding:"5px 0", borderBottom:i<3?"1px dashed #d0b8e8":"none", lineHeight:1.55 }}>💜 {note}</div>
            ))}
          </Card>
        </div>
      )}

      {tab==="sound"&&(
        <div>
          <div style={{ background:"#f0f4fa", borderRadius:13, padding:18, marginBottom:16, border:"1px solid #b8c8e0" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d3a5a", marginBottom:10, display:"flex", gap:7 }}><I n="music" s={15} c="#5a7ab8"/> Sound Performance Comparison</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:11 }}>
              {[["Calm Instrumental",8,"3.2K","+94","Best for saves","#8fb5a0"],["Trending Sound",5,"1.8K","+189","Best for followers","#7ab5d4"],["Voiceover Only",4,"2.4K","+72","Best for trust","#d4a574"],["No Music",2,"0.6K","+18","Lowest performance","#c4726a"]].map(([t,posts,saves,follow,verdict,c])=>(
                <div key={t} style={{ background:"#faf7f2", borderRadius:11, padding:14, border:`1px solid ${c}33` }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:c, marginBottom:2 }}>{t}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#7a8a7a", marginBottom:9 }}>{posts} videos</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
                    {[["avg saves",saves],["avg followers",follow]].map(([l,v])=>(
                      <div key={l} style={{ background:`${c}12`, borderRadius:7, padding:9 }}><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:c }}>{v}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#7a8a7a" }}>{l}</div></div>
                    ))}
                  </div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, color:c, fontWeight:600, marginTop:8 }}>💚 {verdict}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Card style={{ padding:18 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:12 }}>Videos Tracking Music</div>
              {videoQueue.map(v=>(
                <div key={v.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f0e8d8" }}>
                  <div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d4a3a", fontWeight:500 }}>{v.topic.length>30?v.topic.slice(0,30)+"…":v.topic}</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, color:"#7a8a7a" }}>{v.music.audioSource}</div>
                  </div>
                  <Tag label={v.music.musicStatus} color={MUSIC_STATUS_COLORS[v.music.musicStatus]||"#b8c9a3"}/>
                </div>
              ))}
            </Card>
            <Card style={{ padding:18, background:"#f0f8f4", border:"1px solid #b8d8c8" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:12 }}>💚 Sound Strategy Recommendations</div>
              {["Calm Instrumental under voiceover is your strongest format — use it for Trust Building and Education posts.","Trending sounds on Awareness posts expand reach most efficiently. Search in TikTok before posting.","Never post a video silent by mistake. Always check music status in the Video Queue before scheduling.","Men's content performs better with commercial-safe beats over trending feminine audio.","Premium Teaser videos should use aspirational, dreamy instrumental — not energetic or upbeat."].map((note,i)=>(
                <div key={i} style={{ fontFamily:"'Jost',sans-serif", fontSize:11.5, color:"#2d5a4a", padding:"5px 0", borderBottom:i<4?"1px dashed #c8e8d0":"none", lineHeight:1.55 }}>💚 {note}</div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BRAND RULES
// ─────────────────────────────────────────────────────────────────────────────
function BrandPage() {
  const [rules, setRules] = useState({ brandName:"Lumen Flow", ctaDefault:"link in bio 💚", tone:"Soft, supportive, feminine, practical, clean, calm, encouraging", avoidShame:true, avoidMedical:true, useGreenHeart:true, minimalDashes:true, noPrematureConvert:true, trustFirst:true });
  const [saved, setSaved] = useState(false);
  return (
    <div className="fade" style={{ maxWidth:700 }}>
      <SectionHead title="Brand Rules" sub="Define how Lumen Flow communicates — and converts — with integrity"/>
      <div style={{ display:"grid", gap:13 }}>
        <Card style={{ padding:20 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:13 }}>Identity</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
            <div><Label>Brand Name</Label><Input value={rules.brandName} onChange={e=>setRules(p=>({...p,brandName:e.target.value}))}/></div>
            <div><Label>Default CTA</Label><Input value={rules.ctaDefault} onChange={e=>setRules(p=>({...p,ctaDefault:e.target.value}))}/></div>
            <div style={{ gridColumn:"1/-1" }}><Label>Brand Tone</Label><Input value={rules.tone} onChange={e=>setRules(p=>({...p,tone:e.target.value}))}/></div>
          </div>
        </Card>
        <Card style={{ padding:20 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:13 }}>Content Rules</div>
          {[["Avoid shame-based fitness and body language","avoidShame"],["Avoid medical claims or hormone balancing promises","avoidMedical"],["Use 💚 green heart in all captions","useGreenHeart"],["Use zero to minimal dashes","minimalDashes"],["Never lead with Premium — build trust first","noPrematureConvert"],["Trust building content before Conversion content","trustFirst"]].map(([l,k])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #f0e8d8" }}>
              <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12.5, color:"#3a5a4a" }}>{l}</span>
              <Toggle on={rules[k]} onChange={v=>setRules(p=>({...p,[k]:v}))}/>
            </div>
          ))}
        </Card>
        <Card style={{ padding:18 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a", marginBottom:9 }}>Visual Style</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:9, marginBottom:12 }}>
            {[["Background","#f5f0e8","Cream"],["Typography","#5a8a6a","Sage Green"],["Accent","#d4a0a0","Blush"],["Men's","#3a5a3a","Deep Green"]].map(c=>(
              <div key={c[0]} style={{ textAlign:"center" }}><div style={{ width:"100%", height:40, borderRadius:9, background:c[1], border:"1px solid #e8e0d0", marginBottom:4 }}/><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9.5, color:"#5a6a5a", fontWeight:600 }}>{c[0]}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:"#8a9a8a" }}>{c[2]}</div></div>
            ))}
          </div>
        </Card>
        <div style={{ background:"#f0f8f4", borderRadius:11, padding:14, border:"1px solid #b8d8c8" }}>
          <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d5a4a", lineHeight:1.7 }}>💚 <strong>Safety reminder:</strong> Always encourage listeners to break their fast if they feel weak, dizzy, shaky, sick, or unwell. No post should ever contradict this.</p>
        </div>
        <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2200);}} style={{ justifyContent:"center", padding:"12px" }}>{saved?<><I n="check" s={14} c="white"/> Saved!</>:"Save Brand Rules 💚"}</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTING SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
function PostingPage() {
  const [tab, setTab] = useState("frequency");
  const [s, setS] = useState({ igDay:1, ttDay:2, pinDay:3, ytDay:1, minMens:1, minFasting:2, minAppFeat:1, minPremium:1, requireApproval:true, autoSchedule:false });
  const [saved, setSaved] = useState(false);
  return (
    <div className="fade" style={{ maxWidth:700 }}>
      <SectionHead title="Posting Settings" sub="Configure frequency, weekly requirements, and platform connections"/>
      <div style={{ display:"flex", gap:5, marginBottom:20, background:"#f0ebe0", padding:4, borderRadius:12, width:"fit-content" }}>
        {[["frequency","Post Frequency"],["requirements","Weekly Requirements"],["connections","Platform Connections"]].map(([t,l])=>(
          <button key={t} className="tab-pill" onClick={()=>setTab(t)} style={{ background:tab===t?"#faf7f2":"transparent", color:tab===t?"#2d4a3a":"#7a8a7a", boxShadow:tab===t?"0 1px 4px rgba(0,0,0,0.08)":"none", fontWeight:tab===t?600:400 }}>{l}</button>
        ))}
      </div>
      {tab==="frequency"&&(
        <div style={{ display:"grid", gap:11 }}>
          {[["📸 Instagram","igDay"],["🎵 TikTok","ttDay"],["📌 Pinterest","pinDay"],["▶️ YouTube Shorts","ytDay"]].map(([l,k])=>(
            <Card key={k} style={{ padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, color:"#2d4a3a" }}>{l}</div>
              <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                <div><Label>Per day</Label><Select value={String(s[k])} onChange={e=>setS(p=>({...p,[k]:+e.target.value}))} options={["0","1","2","3","4","5"]} style={{ width:75 }}/></div>
                <div><Label>Per week</Label><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600, color:"#5a8a6a", paddingTop:2 }}>{s[k]*7}</div></div>
              </div>
            </Card>
          ))}
          <Card style={{ padding:16 }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, fontWeight:600, color:"#2d4a3a", marginBottom:10 }}>Approval & Scheduling</div>
            {[["Require manual approval before posting","requireApproval"],["Auto-schedule approved content","autoSchedule"]].map(([l,k])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f0e8d8" }}>
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12.5, color:"#3a5a4a" }}>{l}</span>
                <Toggle on={s[k]} onChange={v=>setS(p=>({...p,[k]:v}))}/>
              </div>
            ))}
          </Card>
          <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2200);}} style={{ justifyContent:"center", padding:"11px" }}>{saved?<><I n="check" s={14} c="white"/> Saved!</>:"Save Settings 💚"}</Btn>
        </div>
      )}
      {tab==="requirements"&&(
        <div style={{ display:"grid", gap:11 }}>
          {[["👥 Min men's posts per week","minMens"],["⏱ Min fasting posts per week","minFasting"],["📱 Min app feature posts per week","minAppFeat"],["💜 Min Premium teaser posts per week","minPremium"]].map(([l,k])=>(
            <Card key={k} style={{ padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12.5, color:"#2d4a3a", fontWeight:500 }}>{l}</span>
              <Select value={String(s[k])} onChange={e=>setS(p=>({...p,[k]:+e.target.value}))} options={["0","1","2","3","4"]} style={{ width:75 }}/>
            </Card>
          ))}
          <div style={{ background:"#f0f8f4", borderRadius:11, padding:14, border:"1px solid #b8d8c8" }}>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:"#2d5a4a", lineHeight:1.65 }}>💚 The system will alert you in the briefing, dashboard, and calendar view if any weekly requirement is not met.</p>
          </div>
          <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2200);}} style={{ justifyContent:"center", padding:"11px" }}>{saved?<><I n="check" s={14} c="white"/> Saved!</>:"Save Requirements 💚"}</Btn>
        </div>
      )}
      {tab==="connections"&&(
        <div style={{ display:"grid", gap:10 }}>
          {[["Instagram","Instagram Graph API"],["TikTok","TikTok Content Posting API"],["Pinterest","Pinterest API v5"],["YouTube","YouTube Data API v3"]].map(([p,a])=>(
            <Card key={p} style={{ padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:"#2d4a3a" }}>{p}</div><div style={{ fontFamily:"'Jost',sans-serif", fontSize:10.5, color:"#7a8a7a", marginTop:2 }}>{a}</div></div>
              <Btn>Connect via OAuth</Btn>
            </Card>
          ))}
          <Card style={{ padding:13 }}>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11.5, color:"#5a6a5a", lineHeight:1.65 }}>🔒 Lumen Flow uses official OAuth only. No passwords stored. All connections use official developer APIs. If direct posting is unavailable, assets and captions can be exported for manual posting.</p>
          </Card>
        </div>
      )}
    </div>
  );
}
