import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
//  CYCLE LOGIC
// ─────────────────────────────────────────────

function getCycleDay(lastPeriod) {
  if (!lastPeriod) return 1;
  const diff = Math.floor((Date.now() - new Date(lastPeriod).getTime()) / 86400000);
  return (diff % 28) + 1;
}

function getPhase(day) {
  if (day <= 5)  return "Menstrual";
  if (day <= 13) return "Follicular";
  if (day <= 16) return "Ovulation";
  return "Luteal";
}

const PHASE_INFO = {
  Menstrual:  { emoji: "🌑", color: "#C97B7B", bg: "#FDEAEA", fast: "12–14h — keep it gentle", move: "Gentle yoga or rest" },
  Follicular: { emoji: "🌒", color: "#7BA8C9", bg: "#EAF2F9", fast: "14–16h — energy is rising", move: "Strength training & cardio" },
  Ovulation:  { emoji: "🌕", color: "#C9A87B", bg: "#F9F4EA", fast: "16–18h — peak flexibility", move: "HIIT, lift heavy, compete" },
  Luteal:     { emoji: "🌗", color: "#9B7BC9", bg: "#F2EAFA", fast: "12–14h — be gentle again", move: "Walks, pilates, slow down" },
};

// ─────────────────────────────────────────────
//  ONBOARDING
// ─────────────────────────────────────────────

function Onboarding({ onDone }) {
  const [step, setStep]       = useState(1);
  const [name, setName]       = useState("");
  const [lastPeriod, setLast] = useState("");
  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={s.screen}>
      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            height: 8, borderRadius: 100,
            background: i <= step ? "#8FAF8F" : "#D9E8D9",
            width: i === step ? 40 : 16, transition: "width 0.3s",
          }} />
        ))}
      </div>

      {step === 1 && (
        <div style={s.onboardBox}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌿</div>
          <h2 style={s.heading}>Welcome to<br />Lumen Flow</h2>
          <p style={s.sub}>Track your cycle and fasting<br />in sync with your body.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", margin: "20px 0 32px" }}>
            {Object.entries(PHASE_INFO).map(([n, info]) => (
              <span key={n} style={{ ...s.chip, background: info.bg, color: info.color }}>
                {info.emoji} {n}
              </span>
            ))}
          </div>
          <button style={s.btn} onClick={() => setStep(2)}>Get Started →</button>
        </div>
      )}

      {step === 2 && (
        <div style={s.onboardBox}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
          <h2 style={s.heading}>What's your name?</h2>
          <p style={s.sub}>We'll use this to greet you.</p>
          <input style={{ ...s.input, marginTop: 20, marginBottom: 16 }} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          <button style={{ ...s.btn, background: name.trim() ? "#8FAF8F" : "#C5D9C5", cursor: name.trim() ? "pointer" : "default" }} onClick={() => name.trim() && setStep(3)}>Continue →</button>
          <button style={s.backBtn} onClick={() => setStep(1)}>← Back</button>
        </div>
      )}

      {step === 3 && (
        <div style={s.onboardBox}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌑</div>
          <h2 style={s.heading}>When did your<br />last period start?</h2>
          <p style={s.sub}>This lets us calculate your phase.</p>
          <input type="date" max={today} style={{ ...s.input, marginTop: 20, marginBottom: 16 }} value={lastPeriod} onChange={e => setLast(e.target.value)} />
          <button style={{ ...s.btn, background: lastPeriod ? "#8FAF8F" : "#C5D9C5", cursor: lastPeriod ? "pointer" : "default" }} onClick={() => lastPeriod && onDone({ name, lastPeriod })}>Start Flowing 🌿</button>
          <button style={s.backBtn} onClick={() => setStep(2)}>← Back</button>
          <button style={{ ...s.backBtn, color: "#aaa", marginTop: 4 }} onClick={() => onDone({ name, lastPeriod: "" })}>Skip for now</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  HOME SCREEN
// ─────────────────────────────────────────────

function HomeScreen({ name, lastPeriod }) {
  const cycleDay = getCycleDay(lastPeriod);
  const phase    = getPhase(cycleDay);
  const info     = PHASE_INFO[phase];

  const fastOptions = [12, 14, 16, 18, 20];

  const [selectedFast, setSelectedFast] = useState(() => parseInt(localStorage.getItem("lf_selectedFast") || "16"));
  const [fasting, setFasting]           = useState(() => localStorage.getItem("lf_fasting") === "true");
  const [startTime, setStart]           = useState(() => parseInt(localStorage.getItem("lf_startTime") || "0"));
  const [elapsed, setElapsed]           = useState(0);

  useEffect(() => {
    localStorage.setItem("lf_fasting", fasting);
    localStorage.setItem("lf_startTime", startTime);
    localStorage.setItem("lf_selectedFast", selectedFast);
  }, [fasting, startTime, selectedFast]);

  useEffect(() => {
    if (!fasting) { setElapsed(0); return; }
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [fasting, startTime]);

  const toggleFast = () => {
    if (fasting) { setFasting(false); setStart(0); }
    else         { setStart(Date.now()); setFasting(true); }
  };

  const pad = n => String(n).padStart(2, "0");
  const hrs  = Math.floor(elapsed / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;

  const eatAt = () => {
    const d = new Date((fasting ? startTime : Date.now()) + selectedFast * 3600000);
    const isToday = d.toDateString() === new Date().toDateString();
    const t = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return isToday ? `Today at ${t}` : `Tomorrow at ${t}`;
  };

  const progress = Math.min(elapsed / (selectedFast * 3600), 1);
  const R = 70;
  const circ = 2 * Math.PI * R;

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ ...s.header, background: "#EAF2EA" }}>
        <span style={{ fontSize: 22 }}>🌿</span>
        <h2 style={{ margin: 0, fontSize: 18 }}>Lumen Flow</h2>
      </div>

      <div style={{ padding: "0 16px" }}>
        <h3 style={{ ...s.title, marginTop: 16 }}>
          Good {getGreeting()}, {name || "lovely"} 👋
        </h3>

        <div style={{ ...s.phaseCard, background: info.bg, color: info.color }}>
          {info.emoji} {phase} · Day {cycleDay}
        </div>

        <div style={{ ...s.card, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ ...s.label, marginBottom: 12 }}>
            {fasting ? "Fasting in progress" : "Intermittent Fasting"}
          </p>

          <div style={{ position: "relative", width: 160, height: 160 }}>
            <svg width={160} height={160} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={80} cy={80} r={R} fill="none" stroke="#EAF2EA" strokeWidth={10} />
              <circle cx={80} cy={80} r={R} fill="none"
                stroke={fasting ? "#8FAF8F" : "#C5D9C5"}
                strokeWidth={10}
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - progress)}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: fasting ? 22 : 28, fontWeight: "bold", color: "#2D3B2E" }}>
                {fasting ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : "0h"}
              </div>
              <div style={{ fontSize: 12, color: "#8FA090", marginTop: 2 }}>
                {fasting ? `${Math.round(progress * 100)}% complete` : "Not fasting"}
              </div>
            </div>
          </div>

          {fasting && (
            <p style={{ fontSize: 13, color: "#6b7b6b", marginTop: 8 }}>
              Eat window opens: <strong>{eatAt()}</strong>
            </p>
          )}
        </div>

        <div style={{ ...s.card, background: info.bg, border: `1px solid ${info.color}33`, textAlign: "left" }}>
          <p style={{ margin: "0 0 6px", fontWeight: 600, color: info.color }}>{info.emoji} {phase} Phase</p>
          <p style={{ margin: "0 0 4px", fontSize: 13, color: "#4a5a4b" }}>💧 <b>Fast:</b> {info.fast}</p>
          <p style={{ margin: 0, fontSize: 13, color: "#4a5a4b" }}>🏋️ <b>Move:</b> {info.move}</p>
        </div>

        {!fasting && (
          <>
            <p style={{ ...s.label, marginTop: 16, marginBottom: 8 }}>Quick Start</p>
            {fastOptions.map(h => (
              <div key={h} onClick={() => setSelectedFast(h)} style={{
                ...s.fastOption,
                border: selectedFast === h ? "2px solid #8FAF8F" : "1px solid #e0e0e0",
                background: selectedFast === h ? "#EAF2EA" : "#fff",
              }}>
                <strong style={{ color: "#2D3B2E" }}>{h}h fast</strong>
                <span style={{ fontSize: 12, color: "#8FA090" }}>{eatAt()}</span>
              </div>
            ))}
          </>
        )}

        <button onClick={toggleFast} style={{
          ...s.btn, marginTop: 16,
          background: fasting ? "#F2EAFA" : "#8FAF8F",
          color: fasting ? "#9B7BC9" : "#fff",
        }}>
          {fasting ? "End Fast" : `Start ${selectedFast}h Fast Now`}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  DAILY CHECK-IN SCREEN
// ─────────────────────────────────────────────

const MOOD_OPTIONS = [
  { label: "Very Low", color: "#D4736A" },
  { label: "Low",      color: "#D4956A" },
  { label: "Neutral",  color: "#D4C46A" },
  { label: "Good",     color: "#A3C46A" },
  { label: "Great",    color: "#6AB87A" },
];

const ENERGY_OPTIONS = [
  { label: "Low",    color: "#D4736A" },
  { label: "Steady", color: "#D4C46A" },
  { label: "High",   color: "#6AB87A" },
];

const SYMPTOM_TAGS = [
  "Cramps", "Bloating", "Headache", "Fatigue",
  "Mood swings", "Brain fog", "Cravings", "Backache",
  "Tender breasts", "Insomnia", "Acne", "Nausea",
];

function getTodayKey() {
  return "lf_checkin_" + new Date().toISOString().split("T")[0];
}

function CheckInScreen() {
  const todayKey = getTodayKey();

  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(todayKey)); }
    catch { return null; }
  });

  const [mood,     setMood]     = useState(null);
  const [energy,   setEnergy]   = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [notes,    setNotes]    = useState("");

  const toggleSymptom = (sym) => {
    setSymptoms(prev =>
      prev.includes(sym) ? prev.filter(x => x !== sym) : [...prev, sym]
    );
  };

  const saveCheckIn = () => {
    const data = { mood, energy, symptoms, notes, date: new Date().toISOString() };
    localStorage.setItem(todayKey, JSON.stringify(data));
    setSaved(data);
  };

  if (saved) {
    return (
      <div style={{ padding: 16 }}>
        <h3 style={s.title}>Daily Check-In</h3>
        <div style={{ ...s.card, background: "#EAF2EA", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 17, color: "#2D3B2E", margin: "0 0 6px" }}>
            You've checked in today
          </p>
          <p style={{ fontSize: 13, color: "#6b7b6b", margin: 0 }}>
            Mood: <b>{saved.mood != null ? MOOD_OPTIONS[saved.mood].label : "—"}</b> &nbsp;·&nbsp;
            Energy: <b>{saved.energy != null ? ENERGY_OPTIONS[saved.energy].label : "—"}</b>
          </p>
          {saved.symptoms?.length > 0 && (
            <p style={{ fontSize: 13, color: "#6b7b6b", marginTop: 8 }}>
              Symptoms: <b>{saved.symptoms.join(", ")}</b>
            </p>
          )}
          <button onClick={() => setSaved(null)} style={{ ...s.btn, marginTop: 16, background: "#C5D9C5", color: "#2D3B2E" }}>
            Edit Today's Check-In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 16px 90px" }}>
      <h3 style={s.title}>Daily Check-In</h3>
      <p style={{ fontSize: 13, color: "#6b7b6b", marginBottom: 16, marginTop: -8 }}>
        How are you feeling today?
      </p>

      <div style={s.card}>
        <p style={{ ...s.label, marginBottom: 12, textAlign: "left" }}>😊 Mood</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {MOOD_OPTIONS.map((m, i) => (
            <div key={i} onClick={() => setMood(i)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: mood === i ? m.color : "#eee",
                border: mood === i ? `3px solid ${m.color}` : "3px solid transparent",
                boxShadow: mood === i ? `0 0 0 3px ${m.color}44` : "none",
                transition: "all 0.2s",
              }} />
              <span style={{ fontSize: 10, color: mood === i ? m.color : "#aaa", textAlign: "center", lineHeight: 1.2 }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <p style={{ ...s.label, marginBottom: 12, textAlign: "left" }}>⚡ Energy</p>
        <div style={{ display: "flex", gap: 8 }}>
          {ENERGY_OPTIONS.map((e, i) => (
            <button key={i} onClick={() => setEnergy(i)} style={{
              flex: 1, padding: "10px 0", borderRadius: 12, border: "none",
              background: energy === i ? e.color : "#F4F8F4",
              color: energy === i ? "#fff" : "#6b7b6b",
              fontWeight: energy === i ? 700 : 400,
              fontSize: 14, cursor: "pointer", transition: "all 0.2s",
            }}>
              {e.label}
            </button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <p style={{ ...s.label, marginBottom: 12, textAlign: "left" }}>🩺 Symptoms</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SYMPTOM_TAGS.map(tag => (
            <button key={tag} onClick={() => toggleSymptom(tag)} style={{
              padding: "7px 14px", borderRadius: 100, border: "none",
              background: symptoms.includes(tag) ? "#8FAF8F" : "#F4F8F4",
              color: symptoms.includes(tag) ? "#fff" : "#6b7b6b",
              fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <p style={{ ...s.label, marginBottom: 8, textAlign: "left" }}>📝 Notes (optional)</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How are you feeling? Anything to note today..."
          style={{
            width: "100%", minHeight: 80, padding: "10px 12px",
            borderRadius: 12, border: "1.5px solid #C5D9C5",
            fontFamily: "sans-serif", fontSize: 14, color: "#2D3B2E",
            background: "#F4F8F4", boxSizing: "border-box",
            outline: "none", resize: "vertical",
          }}
        />
      </div>

      <button
        onClick={saveCheckIn}
        disabled={mood === null || energy === null}
        style={{
          ...s.btn,
          background: mood !== null && energy !== null ? "#8FAF8F" : "#C5D9C5",
          cursor: mood !== null && energy !== null ? "pointer" : "default",
        }}
      >
        Save Today's Check-In ✓
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CALENDAR SCREEN
// ─────────────────────────────────────────────

function CalendarScreen({ lastPeriod }) {
  const today = new Date();
  const [selDay, setSelDay] = useState(today.getDate());
  const [month, setMonth]   = useState(today.getMonth());
  const [year, setYear]     = useState(today.getFullYear());

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getPhaseForDay(d) {
    const date = new Date(year, month, d);
    const base = new Date(lastPeriod || date);
    const diff = Math.floor((date - base) / 86400000);
    const day  = ((diff % 28) + 28) % 28 + 1;
    return getPhase(day);
  }

  function getCycleDayFor(d) {
    const date = new Date(year, month, d);
    const base = new Date(lastPeriod || date);
    const diff = Math.floor((date - base) / 86400000);
    return ((diff % 28) + 28) % 28 + 1;
  }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); };

  const selPhase = getPhaseForDay(selDay);
  const selInfo  = PHASE_INFO[selPhase];

  return (
    <div style={{ padding: "16px 16px 90px" }}>
      <h3 style={s.title}>Cycle Calendar</h3>

      <div style={s.card}>
        {/* Month navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ background: "#EAF2EA", border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: "pointer", color: "#5C7F60" }}>‹</button>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 17, color: "#2D3B2E", margin: 0 }}>{MONTHS[month]} {year}</p>
          <button onClick={nextMonth} style={{ background: "#EAF2EA", border: "none", borderRadius: 10, width: 36, height: 36, fontSize: 18, cursor: "pointer", color: "#5C7F60" }}>›</button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#8FA090", padding: "2px 0", fontFamily: "sans-serif" }}>{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
          {Array(firstDay).fill(null).map((_, i) => <div key={"e"+i} />)}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const d     = i + 1;
            const phase = getPhaseForDay(d);
            const info  = PHASE_INFO[phase];
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSel   = d === selDay;
            return (
              <button key={d} onClick={() => setSelDay(d)} style={{
                aspectRatio: "1",
                borderRadius: "50%",
                border: isToday ? `2px solid #8FAF8F` : "none",
                background: isSel ? info.color : info.bg,
                cursor: "pointer",
                fontFamily: "sans-serif",
                fontSize: 13,
                color: isSel ? "#fff" : info.color,
                fontWeight: isToday ? 700 : 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {d}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, paddingTop: 12, borderTop: "1px solid #EAF2EA" }}>
          {Object.entries(PHASE_INFO).map(([name, info]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: info.color }} />
              <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "#6b7b6b" }}>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected day detail */}
      <div style={{ ...s.card, background: selInfo.bg, border: `1px solid ${selInfo.color}33`, textAlign: "left", marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 24 }}>{selInfo.emoji}</span>
          <div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: selInfo.color, margin: 0 }}>
              {MONTHS[month]} {selDay}
            </p>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: 0 }}>
              {selPhase} phase · Day {getCycleDayFor(selDay)}
            </p>
          </div>
        </div>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#4a5a4b", margin: "0 0 4px" }}>💧 <b>Fast:</b> {selInfo.fast}</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#4a5a4b", margin: 0 }}>🏋️ <b>Move:</b> {selInfo.move}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  LEARN SCREEN
// ─────────────────────────────────────────────

function LearnScreen() {
  const [tab, setTab] = useState("Phases");

  const tabs = ["Phases", "Fasting", "Workouts", "Nutrition", "Blood Color", "Cravings"];

  const BLOOD_COLORS = [
    { color: "#B22222", label: "Bright Red",   note: "Fresh flow. Healthy and normal at peak flow." },
    { color: "#8B0000", label: "Dark Red",      note: "Older blood. Common at start or end of period." },
    { color: "#3D1C02", label: "Brown",         note: "Very old blood. Normal at the very start or end." },
    { color: "#E8A090", label: "Light Pink",    note: "Diluted blood. May indicate low estrogen or light flow." },
    { color: "#1C0202", label: "Black",         note: "Very old blood. Usually normal but worth noting." },
    { color: "#C4A882", label: "Orange-tinged", note: "Could indicate infection if paired with unusual odor. See your provider." },
  ];

  const CRAVINGS = [
    { craving: "🍫 Chocolate",    why: "Magnesium deficiency. Your body needs this mineral for mood and muscle function." },
    { craving: "🧂 Salty / Crunchy", why: "Aldosterone fluctuates before your period, triggering salt cravings." },
    { craving: "🍬 Sugar / Sweets",  why: "Falling hormones affect serotonin and blood sugar regulation." },
    { craving: "🍞 Carbs / Bread",   why: "Rising progesterone increases your metabolic rate — you need more energy." },
    { craving: "🥩 Red Meat",        why: "Iron and zinc are depleted through blood loss. Your body seeks them instinctively." },
    { craving: "🥑 Fatty Foods",     why: "Prostaglandins are high. Healthy fats support pain modulation." },
    { craving: "😶 No Appetite",     why: "Peak estrogen at ovulation naturally suppresses appetite. Totally normal." },
  ];

  const FASTING_INFO = [
    { phase: "Menstrual 🌑",  tip: "Shorter windows (12–14h). Your body needs steady energy during bleeding." },
    { phase: "Follicular 🌒", tip: "Rising estrogen supports metabolic flexibility. 14–16h windows feel natural." },
    { phase: "Ovulation 🌕",  tip: "Peak performance phase. 16–18h may feel manageable. Stay hydrated." },
    { phase: "Luteal 🌗",     tip: "Progesterone affects blood sugar. Shorter 12–14h windows feel better." },
  ];

  const WORKOUT_INFO = [
    { phase: "Menstrual 🌑",  tip: "Gentle yoga, slow walks, or full rest. Listen above all else." },
    { phase: "Follicular 🌒", tip: "Strength training, cardio, and HIIT workouts thrive now." },
    { phase: "Ovulation 🌕",  tip: "Your absolute peak. Lift heavy, go fast, compete." },
    { phase: "Luteal 🌗",     tip: "Moderate cardio and pilates. Late luteal — slow right down." },
  ];

  const NUTRITION_INFO = [
    { phase: "Menstrual 🌑",  tip: "Iron-rich foods, warming soups, anti-inflammatory choices." },
    { phase: "Follicular 🌒", tip: "Leafy greens, lean proteins, and fermented foods for estrogen support." },
    { phase: "Ovulation 🌕",  tip: "Cruciferous vegetables to help estrogen clearance." },
    { phase: "Luteal 🌗",     tip: "Magnesium, complex carbs, and B6 to ease PMS." },
  ];

  return (
    <div style={{ padding: "0 0 90px" }}>
      <div style={{ padding: "16px 16px 12px" }}>
        <h3 style={s.title}>Learn & Optimise</h3>
        <p style={{ ...s.label, marginBottom: 0 }}>Knowledge synced to your cycle</p>
      </div>

      {/* Tab chips */}
      <div style={{ display: "flex", overflowX: "auto", gap: 8, padding: "0 16px 14px", scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flexShrink: 0,
            padding: "7px 16px",
            borderRadius: 100,
            border: "none",
            background: tab === t ? "#8FAF8F" : "#EAF2EA",
            color: tab === t ? "#fff" : "#6b7b6b",
            fontFamily: "sans-serif",
            fontSize: 13,
            fontWeight: tab === t ? 700 : 400,
            cursor: "pointer",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* PHASES */}
        {tab === "Phases" && Object.entries(PHASE_INFO).map(([name, info]) => (
          <div key={name} style={{ ...s.card, background: info.bg, border: `1px solid ${info.color}22`, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{info.emoji}</span>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: info.color, margin: 0 }}>{name}</p>
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#4a5a4b", margin: "0 0 4px" }}>💧 <b>Fast:</b> {info.fast}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#4a5a4b", margin: "0 0 4px" }}>🏋️ <b>Move:</b> {info.move}</p>
          </div>
        ))}

        {/* FASTING */}
        {tab === "Fasting" && FASTING_INFO.map((f, i) => (
          <div key={i} style={{ ...s.card, textAlign: "left" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>{f.phase}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{f.tip}</p>
          </div>
        ))}

        {/* WORKOUTS */}
        {tab === "Workouts" && WORKOUT_INFO.map((w, i) => (
          <div key={i} style={{ ...s.card, textAlign: "left" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>{w.phase}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{w.tip}</p>
          </div>
        ))}

        {/* NUTRITION */}
        {tab === "Nutrition" && NUTRITION_INFO.map((n, i) => (
          <div key={i} style={{ ...s.card, textAlign: "left" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>{n.phase}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{n.tip}</p>
          </div>
        ))}

        {/* BLOOD COLOR */}
        {tab === "Blood Color" && (
          <>
            <div style={{ ...s.card, background: "#EAF2EA", textAlign: "left" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>What does blood color tell you?</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>Most variations are completely normal. Here's what each color may indicate.</p>
            </div>
            {BLOOD_COLORS.map((bc, i) => (
              <div key={i} style={{ ...s.card, textAlign: "left" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: bc.color, flexShrink: 0, marginTop: 2, boxShadow: `0 2px 8px ${bc.color}55` }} />
                  <div>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 4px" }}>{bc.label}</p>
                    <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{bc.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* CRAVINGS */}
        {tab === "Cravings" && (
          <>
            <div style={{ ...s.card, background: "#EAF2EA", textAlign: "left" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>Why you crave what you crave</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>Cravings aren't weakness — they're your body communicating a real need.</p>
            </div>
            {CRAVINGS.map((cr, i) => (
              <div key={i} style={{ ...s.card, textAlign: "left" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 6px" }}>{cr.craving}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{cr.why}</p>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SETTINGS SCREEN
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
//  RECIPES SCREEN
// ─────────────────────────────────────────────

const RECIPES = [
  { id: 1,  name: "Zucchini Noodle Bowl",      diet: "Low Carb",    time: 20, phases: ["Follicular","Ovulation"], tip: "Supports estrogen metabolism.", ingredients: ["2 zucchinis, spiralized","200g grilled chicken","2 tbsp pesto","Cherry tomatoes","Parmesan"], steps: ["Spiralize zucchinis into noodles.","Grill chicken until cooked through, slice.","Toss zucchini noodles with pesto.","Top with chicken, tomatoes, and parmesan.","Serve immediately."] },
  { id: 2,  name: "Egg & Avocado Salad",        diet: "Low Carb",    time: 15, phases: ["Menstrual","Luteal"],     tip: "Healthy fats support progesterone.", ingredients: ["3 boiled eggs","1 avocado","Dijon mustard","Lemon juice","Mixed greens"], steps: ["Halve and cube avocado.","Slice boiled eggs.","Mix mustard and lemon for dressing.","Toss greens, eggs, and avocado.","Drizzle with dressing."] },
  { id: 3,  name: "Sweet Potato Tacos",         diet: "High Carb",   time: 30, phases: ["Follicular","Ovulation"], tip: "Complex carbs fuel your peak phase.", ingredients: ["2 sweet potatoes, cubed","1 can black beans","Corn tortillas","Avocado","Lime","Cilantro"], steps: ["Roast sweet potatoes at 200°C for 20 min.","Warm black beans with cumin.","Warm tortillas in a dry pan.","Layer beans and potato in tortillas.","Top with avocado, lime, and cilantro."] },
  { id: 4,  name: "Brown Rice Power Bowl",      diet: "High Carb",   time: 40, phases: ["Luteal"],                tip: "Complex carbs stabilise blood sugar.", ingredients: ["1 cup brown rice","1 can chickpeas","Roasted broccoli","Tahini","Lemon","Sesame seeds"], steps: ["Cook brown rice per package.","Roast broccoli and chickpeas at 200°C for 20 min.","Whisk tahini, lemon, and water for dressing.","Assemble bowl with rice as base.","Top with vegetables and drizzle dressing."] },
  { id: 5,  name: "Bacon & Brie Omelette",      diet: "Keto",        time: 15, phases: ["Follicular","Ovulation"], tip: "High fat supports energy in your active phase.", ingredients: ["3 eggs","2 bacon rashers","30g brie","Chives","Butter"], steps: ["Cook bacon until crispy.","Whisk eggs with salt and pepper.","Melt butter in pan, pour in eggs.","Cook until edges set.","Add brie and bacon, fold and serve."] },
  { id: 6,  name: "Keto Cauliflower Rice",      diet: "Keto",        time: 25, phases: ["Luteal","Menstrual"],    tip: "Cauliflower provides vitamin C to ease bloating.", ingredients: ["1 head cauliflower, riced","2 eggs","Tamari","Sesame oil","Spring onions","Ginger"], steps: ["Pulse cauliflower until rice-sized.","Sauté garlic and ginger in sesame oil.","Add cauliflower rice, cook 5 min.","Push aside, scramble eggs in pan.","Combine and add tamari and spring onions."] },
  { id: 7,  name: "Ribeye & Bone Marrow",       diet: "Carnivore",   time: 20, phases: ["Follicular","Ovulation"], tip: "High iron and zinc fuel your peak phase.", ingredients: ["1 ribeye steak","Bone marrow","Butter","Sea salt","Black pepper","Fresh thyme"], steps: ["Season steak with salt and pepper.","Roast bone marrow at 220°C for 15 min.","Sear steak 3-4 min per side.","Rest steak for 5 minutes.","Top with scooped bone marrow and butter."] },
  { id: 8,  name: "Lamb Liver with Bacon",      diet: "Carnivore",   time: 15, phases: ["Menstrual"],             tip: "Liver is one of the richest sources of iron.", ingredients: ["300g lamb liver, sliced","4 bacon rashers","Butter","Sea salt","Black pepper"], steps: ["Cook bacon until crispy, remove.","Season liver with salt and pepper.","Cook liver in bacon fat 2 min per side.","Slight pink centre is ideal.","Serve liver topped with bacon."] },
  { id: 9,  name: "Lentil & Spinach Dal",       diet: "Vegan",       time: 35, phases: ["Menstrual","Follicular"], tip: "Lentils provide plant-based iron.", ingredients: ["1 cup red lentils","1 can coconut milk","2 cups spinach","Curry powder","Turmeric","Ginger","Tomatoes"], steps: ["Sauté garlic and ginger.","Add curry powder and turmeric.","Add lentils, tomatoes, and coconut milk.","Simmer 20 min until soft.","Stir in spinach until wilted."] },
  { id: 10, name: "Roasted Beet Salad",         diet: "Vegan",       time: 40, phases: ["Follicular","Ovulation"], tip: "Beets support detox pathways.", ingredients: ["3 beets, cubed","Walnuts","Mixed greens","Balsamic glaze","Olive oil","Orange zest"], steps: ["Toss beets in olive oil, roast 200°C 30 min.","Toast walnuts in a dry pan.","Arrange greens on a plate.","Top with warm beets and walnuts.","Drizzle with balsamic and orange zest."] },
  { id: 11, name: "Shakshuka",                  diet: "Vegetarian",  time: 25, phases: ["Follicular","Ovulation"], tip: "Eggs provide choline for liver health.", ingredients: ["4 eggs","1 can crushed tomatoes","1 bell pepper","Onion","Cumin, paprika","Feta","Parsley"], steps: ["Sauté onion and pepper.","Add spices and tomatoes, simmer 10 min.","Make wells in sauce, crack in eggs.","Cover and cook until eggs just set.","Top with feta and parsley."] },
  { id: 12, name: "Butternut Squash Soup",      diet: "Vegetarian",  time: 40, phases: ["Luteal","Menstrual"],    tip: "Beta-carotene supports progesterone.", ingredients: ["1 butternut squash","1 onion","Vegetable stock","Coconut milk","Nutmeg","Ginger"], steps: ["Roast squash at 200°C for 30 min.","Scoop flesh and blend with stock.","Sauté onion and ginger, add to blender.","Blend until smooth, add coconut milk.","Season with nutmeg and serve."] },
  { id: 13, name: "Greek Baked Fish",           diet: "Mediterranean",time: 30, phases: ["Follicular","Ovulation"], tip: "Omega-3s and olive oil support estrogen balance.", ingredients: ["2 white fish fillets","Cherry tomatoes","Kalamata olives","Capers","Olive oil","Lemon","Feta"], steps: ["Place fish in baking dish.","Scatter tomatoes, olives, and capers.","Drizzle with olive oil.","Add lemon slices.","Bake at 190°C for 20 min, top with feta."] },
  { id: 14, name: "Lemon Herb Chicken Orzo",    diet: "Mediterranean",time: 35, phases: ["Luteal"],                tip: "B6 in chicken supports serotonin.", ingredients: ["2 chicken thighs","1 cup orzo","Chicken stock","Lemon","Spinach","Garlic","Fresh dill"], steps: ["Sear chicken thighs until golden.","Add garlic, orzo, stock, and lemon.","Simmer 12 min until orzo is cooked.","Stir in spinach until wilted.","Finish with fresh dill."] },
  { id: 15, name: "Paleo Bison Burgers",        diet: "Paleo",       time: 25, phases: ["Follicular","Ovulation"], tip: "Bison is lean and packed with iron.", ingredients: ["400g ground bison","Garlic powder","Onion powder","Lettuce wraps","Avocado","Tomato"], steps: ["Mix bison with garlic and onion powder.","Form into patties.","Grill 4-5 min per side.","Rest patties 3 minutes.","Serve in lettuce wraps with avocado."] },
  { id: 16, name: "Sweet Potato Hash",          diet: "Paleo",       time: 30, phases: ["Menstrual","Luteal"],    tip: "Vitamin B6 is a natural mood supporter.", ingredients: ["2 sweet potatoes, diced","1 onion","Bell pepper","2 eggs","Paprika","Olive oil"], steps: ["Pan-fry sweet potato covered for 15 min.","Add onion and pepper, cook until soft.","Season with paprika.","Make wells, crack in eggs.","Cover and cook until eggs are set."] },
  { id: 17, name: "Quinoa Stuffed Tomatoes",    diet: "Gluten-Free", time: 35, phases: ["Follicular","Ovulation"], tip: "Quinoa is a complete protein.", ingredients: ["4 large tomatoes","1 cup quinoa","Feta","Olives","Cucumber","Mint","Lemon"], steps: ["Cook quinoa per package.","Hollow out tomatoes.","Mix quinoa with feta, olives, cucumber, mint.","Fill tomatoes with mixture.","Bake at 180°C for 15 min."] },
  { id: 18, name: "Mango Chia Pudding",         diet: "Gluten-Free", time: 10, phases: ["Follicular","Ovulation"], tip: "Omega-3s in chia support anti-inflammation.", ingredients: ["4 tbsp chia seeds","1.5 cups coconut milk","1 mango, diced","Lime zest","Honey","Mint"], steps: ["Mix chia seeds with coconut milk.","Stir well and refrigerate 4+ hours.","Stir again before serving.","Top with fresh mango.","Add lime zest, honey, and mint."] },
  { id: 19, name: "Turmeric Golden Soup",       diet: "Vegan",       time: 30, phases: ["Menstrual","Luteal"],    tip: "Curcumin in turmeric eases period pain.", ingredients: ["1 head cauliflower","1 can coconut milk","Vegetable stock","2 tsp turmeric","Ginger","Garlic","Black pepper"], steps: ["Roast cauliflower at 200°C for 25 min.","Blend with stock, coconut milk, and spices.","Heat in pot with garlic and ginger.","Simmer 10 min.","Finish with lemon juice and black pepper."] },
  { id: 20, name: "Walnut & Date Energy Bites", diet: "Vegan",       time: 15, phases: ["Luteal"],                tip: "Magnesium in walnuts eases PMS.", ingredients: ["1 cup walnuts","1 cup medjool dates, pitted","3 tbsp cacao powder","Pinch of sea salt","Desiccated coconut"], steps: ["Blend walnuts in food processor.","Add dates, cacao, and salt.","Blend until mixture sticks together.","Roll into small balls.","Coat in coconut. Refrigerate 30 min."] },
];

const DIET_TYPES = ["All","Low Carb","High Carb","Keto","Carnivore","Vegan","Vegetarian","Mediterranean","Paleo","Gluten-Free"];
const PHASE_FILTERS = ["All","Menstrual","Follicular","Ovulation","Luteal"];

function RecipesScreen({ phase }) {
  const [dietFilter,  setDietFilter]  = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [selected,    setSelected]    = useState(null);

  const filtered = RECIPES.filter(r => {
    const dOk = dietFilter  === "All" || r.diet === dietFilter;
    const pOk = phaseFilter === "All" || r.phases.includes(phaseFilter);
    return dOk && pOk;
  });

  const phaseRecs = RECIPES.filter(r => r.phases.includes(phase)).slice(0, 5);

  if (selected) {
    const info = PHASE_INFO[selected.phases[0]];
    return (
      <div style={{ padding: "16px 16px 90px" }}>
        <button onClick={() => setSelected(null)} style={{ background: "#EAF2EA", border: "none", borderRadius: 10, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#5C7F60", cursor: "pointer", marginBottom: 16 }}>← Back</button>
        <div style={s.card}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ background: "#EAF2EA", color: "#5C7F60", borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{selected.diet}</span>
            <span style={{ background: "#EAF2EA", color: "#5C7F60", borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>⏱ {selected.time} min</span>
            {selected.phases.map(p => (
              <span key={p} style={{ background: PHASE_INFO[p].bg, color: PHASE_INFO[p].color, borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{PHASE_INFO[p].emoji} {p}</span>
            ))}
          </div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#2D3B2E", margin: "0 0 10px", fontWeight: 400 }}>{selected.name}</h2>
          <div style={{ padding: "10px 14px", background: info.bg, borderRadius: 12, marginBottom: 16, borderLeft: `3px solid ${info.color}` }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: info.color, margin: 0 }}>🌿 {selected.tip}</p>
          </div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 10px" }}>Ingredients</p>
          {selected.ingredients.map((ing, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 8, borderBottom: "1px solid #EAF2EA", marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#8FAF8F", flexShrink: 0 }} />
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b7b6b", margin: 0 }}>{ing}</p>
            </div>
          ))}
          <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "16px 0 10px" }}>Method</p>
          {selected.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#8FAF8F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{i+1}</div>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#6b7b6b", lineHeight: 1.55, paddingTop: 3, margin: 0 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 90px" }}>
      <div style={{ padding: "16px 16px 8px" }}>
        <h3 style={s.title}>Recipes</h3>
      </div>

      {/* Best for your phase */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ ...s.label, padding: "0 16px", marginBottom: 10 }}>✨ Best for your phase now</p>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px 4px", scrollbarWidth: "none" }}>
          {phaseRecs.map(r => (
            <button key={r.id} onClick={() => setSelected(r)} style={{ flexShrink: 0, width: 140, background: "#fff", borderRadius: 16, border: "none", boxShadow: "0 2px 12px rgba(122,158,126,0.13)", padding: 14, textAlign: "left", cursor: "pointer" }}>
              <span style={{ background: PHASE_INFO[r.phases[0]].bg, color: PHASE_INFO[r.phases[0]].color, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{r.diet}</span>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#2D3B2E", margin: "8px 0 4px", lineHeight: 1.3 }}>{r.name}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: 0 }}>⏱ {r.time} min</p>
            </button>
          ))}
        </div>
      </div>

      {/* Phase filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 16px 8px", scrollbarWidth: "none" }}>
        {PHASE_FILTERS.map(p => (
          <button key={p} onClick={() => setPhaseFilter(p)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 100, border: "none", background: phaseFilter === p ? "#8FAF8F" : "#EAF2EA", color: phaseFilter === p ? "#fff" : "#6b7b6b", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>{p}</button>
        ))}
      </div>

      {/* Diet filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 16px 12px", scrollbarWidth: "none" }}>
        {DIET_TYPES.map(d => (
          <button key={d} onClick={() => setDietFilter(d)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 100, border: "none", background: dietFilter === d ? "#5C7F60" : "#EAF2EA", color: dietFilter === d ? "#fff" : "#6b7b6b", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>{d}</button>
        ))}
      </div>

      {/* Recipe list */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(r => (
          <button key={r.id} onClick={() => setSelected(r)} style={{ ...s.card, textAlign: "left", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                <span style={{ background: "#EAF2EA", color: "#5C7F60", borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{r.diet}</span>
                {r.phases.map(p => (
                  <span key={p} style={{ background: PHASE_INFO[p].bg, color: PHASE_INFO[p].color, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{PHASE_INFO[p].emoji} {p}</span>
                ))}
              </div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 2px" }}>{r.name}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8FA090", margin: 0 }}>⏱ {r.time} min</p>
            </div>
            <span style={{ color: "#C5D9C5", fontSize: 20, marginLeft: 10 }}>›</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#8FA090", textAlign: "center", padding: 20 }}>No recipes match this filter.</p>
        )}
      </div>
    </div>
  );
}
function SettingsScreen({ settings, onSave }) {
  const [name, setName]       = useState(settings.name);
  const [lastPeriod, setLast] = useState(settings.lastPeriod);
  const [saved, setSaved]     = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const save = () => {
    onSave({ name, lastPeriod });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: 16 }}>
      <h3 style={s.title}>Settings</h3>
      <div style={{ ...s.card, textAlign: "left" }}>
        <label style={s.label}>Your name</label>
        <input style={{ ...s.input, marginTop: 6 }} value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <label style={{ ...s.label, marginTop: 14, display: "block" }}>First day of last period</label>
        <input type="date" max={today} style={{ ...s.input, marginTop: 6 }} value={lastPeriod} onChange={e => setLast(e.target.value)} />
        <button onClick={save} style={{ ...s.btn, marginTop: 16, background: saved ? "#5C7F60" : "#8FAF8F" }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
      <div style={{ ...s.card, background: "#F4F8F4", marginTop: 12 }}>
        <p style={{ fontSize: 12, color: "#8FA090", textAlign: "center", margin: 0 }}>
          Lumen Flow is a wellness tool for education only. Not a medical device.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  BOTTOM NAV
// ─────────────────────────────────────────────

function BottomNav({ current, onChange }) {
  const items = [
    { id: "home",     icon: "🏠", label: "Home" },
    { id: "calendar", icon: "📅", label: "Calendar" },
    { id: "checkin",  icon: "✅", label: "Check-In" },
    { id: "recipes", icon: "🥗", label: "Recipes" },
    { id: "learn",    icon: "📖", label: "Learn" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];
  return (
    <div style={s.nav}>
      {items.map(item => (
        <div key={item.id} onClick={() => onChange(item.id)} style={{
          ...s.navItem,
          color: current === item.id ? "#8FAF8F" : "#8FA090",
          fontWeight: current === item.id ? 700 : 400,
        }}>
          <div style={{ fontSize: 20 }}>{item.icon}</div>
          <div style={{ fontSize: 10, marginTop: 2 }}>{item.label}</div>
          {current === item.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#8FAF8F", marginTop: 3 }} />}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
//  HELPER
// ─────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

// ─────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────

export default function App() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("lf_settings");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [screen, setScreen] = useState("home");

  const saveSettings = (data) => {
    setSettings(data);
    localStorage.setItem("lf_settings", JSON.stringify(data));
  };

  if (!settings) {
    return <Onboarding onDone={saveSettings} />;
  }

  return (
    <div style={s.app}>
      <div style={s.container}>
        {screen === "home"     && <HomeScreen name={settings.name} lastPeriod={settings.lastPeriod} />}
        {screen === "calendar" && <CalendarScreen lastPeriod={settings.lastPeriod} />}
        {screen === "recipes"  && <RecipesScreen phase={getPhase(getCycleDay(settings.lastPeriod))} />}
        {screen === "checkin"  && <CheckInScreen />}
        {screen === "learn"    && <LearnScreen />}
        {screen === "settings" && <SettingsScreen settings={settings} onSave={saveSettings} />}
        <BottomNav current={screen} onChange={setScreen} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────

const s = {
  app:        { minHeight: "100vh", background: "#F4F8F4", display: "flex", justifyContent: "center", fontFamily: "sans-serif" },
  container:  { width: "100%", maxWidth: 480, background: "#fff", minHeight: "100vh", position: "relative", boxShadow: "0 0 40px rgba(0,0,0,0.08)" },
  screen:     { minHeight: "100vh", background: "linear-gradient(160deg, #EAF2EA, #fff)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, boxSizing: "border-box" },
  onboardBox: { width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" },
  heading:    { fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 400, color: "#2D3B2E", margin: "0 0 8px", lineHeight: 1.3 },
  sub:        { fontSize: 14, color: "#6b7b6b", margin: 0, lineHeight: 1.6 },
  chip:       { borderRadius: 100, padding: "5px 14px", fontSize: 13, fontWeight: 600 },
  header:     { display: "flex", alignItems: "center", gap: 8, padding: "14px 16px" },
  title:      { fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 20, color: "#2D3B2E", margin: "0 0 12px" },
  phaseCard:  { padding: "10px 14px", borderRadius: 12, marginBottom: 12, fontWeight: 600, fontSize: 14 },
  card:       { background: "#F8FAF8", padding: 16, borderRadius: 18, textAlign: "center", marginBottom: 12 },
  label:      { margin: 0, fontSize: 13, color: "#6b7b6b" },
  fastOption: { padding: "12px 14px", borderRadius: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.15s" },
  btn:        { width: "100%", padding: 14, borderRadius: 16, border: "none", background: "#8FAF8F", color: "#fff", fontWeight: "bold", fontSize: 15, cursor: "pointer" },
  backBtn:    { marginTop: 10, background: "none", border: "none", color: "#8FA090", fontSize: 14, cursor: "pointer", padding: 8 },
  input:      { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #C5D9C5", fontFamily: "sans-serif", fontSize: 15, color: "#2D3B2E", background: "#F4F8F4", boxSizing: "border-box", outline: "none", marginBottom: 4 },
  nav:        { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #EAF2EA", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", boxShadow: "0 -4px 16px rgba(0,0,0,0.05)", zIndex: 100 },
  navItem:    { cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60, paddingTop: 4 },
};
