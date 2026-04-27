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
  Menstrual:  { emoji: "🌑", color: "#C97B7B", bg: "#FDEAEA", fast: "12–14h – keep it gentle",    move: "Gentle yoga or rest" },
  Follicular: { emoji: "🌒", color: "#7BA8C9", bg: "#EAF2F9", fast: "14–16h – energy is rising",  move: "Strength training & cardio" },
  Ovulation:  { emoji: "🌕", color: "#C9A87B", bg: "#F9F4EA", fast: "16–18h – peak flexibility",  move: "HIIT, lift heavy, compete" },
  Luteal:     { emoji: "🌗", color: "#9B7BC9", bg: "#F2EAFA", fast: "12–14h – be gentle again",   move: "Walks, pilates, slow down" },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─────────────────────────────────────────────
//  ONBOARDING
// ─────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep]       = useState(1);
  const [name, setName]       = useState("");
  const [lastPeriod, setLast] = useState("");
  const [agreed, setAgreed]   = useState(false);
  const [mode, setMode]       = useState(null);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={s.screen}>
      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        {[1, 2, 3, 4, 5].map(i => (
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
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 400, color: "#2D3B2E", letterSpacing: "0.06em", marginBottom: 4 }}>Lumen Flow</h1>
          <div style={{ width: 36, height: 1, background: "#C5D9C5", margin: "8px auto 16px" }} />
          <p style={{ ...s.sub, marginBottom: 32, letterSpacing: "0.04em" }}>Know your body's rhythm.</p>
          <button style={s.btn} onClick={() => setStep(2)}>Get Started</button>
        </div>
      )}

      {step === 2 && (
        <div style={s.onboardBox}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>✨</div>
          <h2 style={s.heading}>How would you like<br />to use Lumen Flow?</h2>
          <div style={{ width: 36, height: 1, background: "#C5D9C5", margin: "8px auto 20px" }} />
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            <button onClick={() => { setMode("cycle"); setStep(3); }} style={{ width: "100%", padding: "16px 18px", borderRadius: 18, border: "0.5px solid #dce8dc", background: "#fff", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>🌸</span>
              <div>
                <div style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#2D3B2E" }}>I track a cycle</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#A8BEA8", marginTop: 2 }}>Phase-synced fasting + cycle tracking</div>
              </div>
            </button>
            <button onClick={() => { setMode("fast"); setStep(3); }} style={{ width: "100%", padding: "16px 18px", borderRadius: 18, border: "0.5px solid #dce8dc", background: "#fff", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <div>
                <div style={{ fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, color: "#2D3B2E" }}>Fasting focus only</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#A8BEA8", marginTop: 2 }}>Timer, streaks and fasting tools</div>
              </div>
            </button>
          </div>
          <button style={s.backBtn} onClick={() => setStep(1)}>← Back</button>
        </div>
      )}

      {step === 3 && (
        <div style={s.onboardBox}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>
          <h2 style={s.heading}>What's your name?</h2>
          <p style={{ ...s.sub, marginBottom: 24 }}>We'll personalise your experience.</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your first name" style={{ ...s.input, textAlign: "center", marginBottom: 20 }} />
          <button style={s.btn} onClick={() => name.trim() && setStep(mode === "cycle" ? 4 : 5)}>Continue</button>
          <button style={s.backBtn} onClick={() => setStep(2)}>← Back</button>
        </div>
      )}

      {step === 4 && mode === "cycle" && (
        <div style={s.onboardBox}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>💚</div>
          <h2 style={s.heading}>Any health conditions?</h2>
          <div style={{ width: 36, height: 1, background: "#C5D9C5", margin: "8px auto 16px" }} />
          <p style={{ ...s.sub, marginBottom: 20 }}>Optional — helps personalise your tips.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", marginBottom: 20 }}>
            {[
              { dot: "#4A90D9", label: "PCOS" },
              { dot: "#C97B7B", label: "Endometriosis" },
              { dot: "#E0904A", label: "Perimenopause" },
              { dot: "#C9A030", label: "Menopause" },
              { dot: "#5C9E6E", label: "Thyroid" },
              { dot: "#9B7BC9", label: "Fibroids" },
            ].map((c, i) => (
              <button key={i} onClick={e => e.currentTarget.classList.toggle("selected")} style={{ padding: "12px 10px", borderRadius: 14, border: "0.5px solid #dce8dc", background: "#fff", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", color: "#4a5a4b", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, display: "inline-block", flexShrink: 0 }}></span>
                {c.label}
              </button>
            ))}
          </div>
          <button style={s.btn} onClick={() => setStep(5)}>Continue</button>
          <button style={{ ...s.btn, background: "transparent", color: "#8FA090", border: "none", fontSize: 13, marginTop: 8 }} onClick={() => setStep(5)}>Skip for now</button>
          <button style={s.backBtn} onClick={() => setStep(3)}>← Back</button>
        </div>
      )}

      {step === 5 && mode === "cycle" && (
        <div style={s.onboardBox}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <h2 style={s.heading}>When did your<br />last period start?</h2>
          <p style={{ ...s.sub, marginBottom: 24 }}>This helps us calculate your cycle phase.</p>
          <input type="date" value={lastPeriod} max={today} onChange={e => setLast(e.target.value)} style={{ ...s.input, textAlign: "center", marginBottom: 20 }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, textAlign: "left" }}>
            <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: "#8FAF8F", width: 18, height: 18, flexShrink: 0, cursor: "pointer" }} />
            <label htmlFor="agree" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", lineHeight: 1.6, cursor: "pointer" }}>
              I agree to the <span style={{ color: "#8FAF8F", fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: "#8FAF8F", fontWeight: 600 }}>Privacy Policy</span>
            </label>
          </div>
          <button style={{ ...s.btn, opacity: agreed ? 1 : 0.4, cursor: agreed ? "pointer" : "not-allowed" }} onClick={() => lastPeriod && agreed && onDone({ name, lastPeriod, cycleLength: 28, mode })}>
            Start My Journey 🌿
          </button>
          <button style={s.backBtn} onClick={() => setStep(3)}>← Back</button>
        </div>
      )}

      {step === 5 && mode === "fast" && (
        <div style={s.onboardBox}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
          <h2 style={s.heading}>Almost there!</h2>
          <p style={{ ...s.sub, marginBottom: 24 }}>Just one last thing.</p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, textAlign: "left" }}>
            <input type="checkbox" id="agree2" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: "#8FAF8F", width: 18, height: 18, flexShrink: 0, cursor: "pointer" }} />
            <label htmlFor="agree2" style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", lineHeight: 1.6, cursor: "pointer" }}>
              I agree to the <span style={{ color: "#8FAF8F", fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: "#8FAF8F", fontWeight: 600 }}>Privacy Policy</span>
            </label>
          </div>
          <button style={{ ...s.btn, opacity: agreed ? 1 : 0.4, cursor: agreed ? "pointer" : "not-allowed" }} onClick={() => agreed && onDone({ name, lastPeriod: "", cycleLength: 28, mode })}>
            Start My Journey 🌿
          </button>
          <button style={s.backBtn} onClick={() => setStep(3)}>← Back</button>
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

  const [fastStart, setFastStart]   = useState(null);
  const [elapsed,   setElapsed]     = useState(0);
  const [goalHours, setGoalHours]   = useState(16);
  const [showGoals, setShowGoals]   = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lf_fast_start");
    if (saved) setFastStart(Number(saved));
  }, []);

  useEffect(() => {
    if (!fastStart) return;
    const iv = setInterval(() => setElapsed(Date.now() - fastStart), 1000);
    return () => clearInterval(iv);
  }, [fastStart]);

  const startFast = () => {
    const now = Date.now();
    setFastStart(now);
    localStorage.setItem("lf_fast_start", now);
  };
  const stopFast = () => {
    const today = new Date().toISOString().split("T")[0];
    const existing = JSON.parse(localStorage.getItem("lf_fast_days") || "[]");
    if (!existing.includes(today)) {
      localStorage.setItem("lf_fast_days", JSON.stringify([...existing, today]));
    }
    setFastStart(null);
    setElapsed(0);
    localStorage.removeItem("lf_fast_start");
  };

  const fmtTime = ms => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
  };

  const progress  = fastStart ? Math.min(elapsed / (goalHours * 3600000), 1) : 0;
  const circumference = 2 * Math.PI * 54;

  const getFastStreak = () => {
    const days = JSON.parse(localStorage.getItem("lf_fast_days") || "[]");
    if (days.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (days.includes(key)) { streak++; } else if (i > 0) { break; }
    }
    return streak;
  };
  const streak = getFastStreak();
  

  return (
    <div style={{ padding: "0 0 90px" }}>
      {/* Header */}
      <div style={{ ...s.header, justifyContent: "space-between", paddingTop: 20 }}>
        <div>
          <p style={{ ...s.label, marginBottom: 2 }}>Good {getGreeting()},</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#2D3B2E", margin: 0, fontWeight: 400 }}>{name} 🌿</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ ...s.chip, background: info.bg, color: info.color, fontFamily: "sans-serif" }}>
            {info.emoji} {phase}
          </span>
          <p style={{ ...s.label, marginTop: 4 }}>Day {cycleDay}</p>
        </div>
      </div>

      {/* Fasting Timer */}
      <div style={{ ...s.card, margin: "12px 16px", position: "relative" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 16px" }}>
          {fastStart ? "Fasting in progress 🌙" : "Start your fast"}
        </p>

        {/* Circle */}
        <div style={{ position: "relative", width: 128, height: 128, margin: "0 auto 16px" }}>
          <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="64" cy="64" r="54" fill="none" stroke="#EAF2EA" strokeWidth="10" />
            <circle cx="64" cy="64" r="54" fill="none" stroke={info.color} strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#2D3B2E", margin: 0 }}>
              {fastStart ? fmtTime(elapsed) : "00:00:00"}
            </p>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: 0 }}>
              {fastStart ? (() => { const end = new Date(fastStart + goalHours * 3600000); const h = end.getHours() % 12 || 12; const m = end.getMinutes(); const ap = end.getHours() >= 12 ? "pm" : "am"; return `ends ${h}:${m < 10 ? "0" : ""}${m}${ap}`; })() : "ready"}
            </p>
          </div>
        </div>

        {/* Goal selector */}
        

        {fastStart ? (
          <button onClick={stopFast} style={{ ...s.btn, background: "#C97B7B" }}>End Fast</button>
        ) : (
          <button onClick={startFast} style={{ ...s.btn, opacity: goalHours ? 1 : 0.4 }}>Begin Fast 🌙</button>
        )}
      </div>

      {/* Level cards */}
      <div style={{ display: "flex", gap: 8, margin: "0 16px 12px" }}>
        {[{ h: 12, icon: "🌱", label: "Beginner" }, { h: 16, icon: "🌿", label: "Intermediate" }, { h: 18, icon: "🔥", label: "Advanced" }].map(({ h, icon, label }) => (
          <div key={h} onClick={() => setGoalHours(h)} style={{
            flex: 1, background: goalHours === h ? "#F0F6F0" : "#fff",
            border: goalHours === h ? "1.5px solid #7A9E7E" : "1px solid #dce8dc",
            borderRadius: 16, padding: "12px 8px", textAlign: "center", cursor: "pointer",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 600, color: goalHours === h ? "#5C7F60" : "#4a5a4b", letterSpacing: "0.02em" }}>{label}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#A8BEA8", marginTop: 2 }}>{h}h</div>
          </div>
        ))}
      </div>

      {/* Streak + Badges */}
      <div style={{ padding: "4px 16px 8px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{ background: "#F0F6F0", border: "0.5px solid #C5D9C5", borderRadius: 50, padding: "6px 18px", display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 12, color: "#5C7F60" }}>
            <span style={{ fontSize: 14 }}>🔥</span> {streak} day{streak !== 1 ? "s" : ""} fasting streak
          </div>
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#A8BEA8", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Your badges</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
          {[
            { icon: "🗓️", name: "Streak", prog: `${streak} day${streak !== 1 ? "s" : ""}`, earned: streak > 0 },
            { icon: "⚡", name: "3 Fasts", prog: "1 / 3", earned: false },
            { icon: "🌙", name: "Cycle Mo.", prog: "0 / 1", earned: false },
            { icon: "💚", name: "Recovery", prog: "Earned", earned: true },
            { icon: "⏰", name: "On Time", prog: "Locked", earned: false },
            { icon: "🧘", name: "Listen", prog: "Locked", earned: false },
          ].map((b, i) => (
            <div key={i} style={{
              flexShrink: 0, background: b.earned ? "#F0F6F0" : "#fff",
              border: b.earned ? "0.5px solid #C5D9C5" : "0.5px solid #dce8dc",
              borderRadius: 14, padding: "11px 12px", textAlign: "center", minWidth: 76,
            }}>
              <div style={{ fontSize: 19, marginBottom: 4, opacity: b.earned ? 1 : 0.3 }}>{b.icon}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 9, color: b.earned ? "#5C7F60" : "#A8BEA8", fontWeight: 500, letterSpacing: "0.03em", textTransform: "uppercase" }}>{b.name}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 9, color: "#A8BEA8", marginTop: 2 }}>{b.prog}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CHECK-IN SCREEN
// ─────────────────────────────────────────────
function CheckInScreen() {
  const today = new Date().toISOString().split("T")[0];
  const key   = `lf_checkin_${today}`;

  const [saved,  setSaved]  = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
  });
  const [energy, setEnergy] = useState(3);
  const [mood,   setMood]   = useState(3);
  const [flow,   setFlow]   = useState("none");
  const [notes,  setNotes]  = useState("");

  const save = () => {
    const data = { energy, mood, flow, notes, date: today };
    localStorage.setItem(key, JSON.stringify(data));
    setSaved(data);
  };

  const flowOptions  = ["none","spotting","light","medium","heavy"];
  const ratingEmojis = ["😔","😕","😐","🙂","😊"];

  if (saved) return (
    <div style={{ padding: "24px 16px 90px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
      <h3 style={s.title}>Today's check-in saved!</h3>
      <p style={{ ...s.label, marginBottom: 24 }}>Come back tomorrow 🌿</p>
      <div style={{ ...s.card, textAlign: "left" }}>
        <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#4a5a4b", margin: "0 0 6px" }}>⚡ Energy: {ratingEmojis[saved.energy - 1]}</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#4a5a4b", margin: "0 0 6px" }}>💭 Mood: {ratingEmojis[saved.mood - 1]}</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#4a5a4b", margin: "0 0 6px" }}>🩸 Flow: {saved.flow}</p>
        {saved.notes && <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#4a5a4b", margin: 0 }}>📝 {saved.notes}</p>}
      </div>
      <button onClick={() => setSaved(null)} style={{ ...s.btn, background: "#EAF2EA", color: "#5C7F60", marginTop: 12 }}>Edit Check-in</button>
    </div>
  );

  return (
    <div style={{ padding: "16px 16px 90px" }}>
      <h3 style={s.title}>Daily Check-In</h3>
      <p style={{ ...s.label, marginBottom: 20 }}>How are you feeling today?</p>

      <div style={s.card}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 12px" }}>⚡ Energy</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {ratingEmojis.map((e, i) => (
            <button key={i} onClick={() => setEnergy(i + 1)} style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", opacity: energy === i + 1 ? 1 : 0.35, transition: "opacity 0.15s" }}>{e}</button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 12px" }}>💭 Mood</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {ratingEmojis.map((e, i) => (
            <button key={i} onClick={() => setMood(i + 1)} style={{ fontSize: 28, background: "none", border: "none", cursor: "pointer", opacity: mood === i + 1 ? 1 : 0.35, transition: "opacity 0.15s" }}>{e}</button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 12px" }}>🩸 Flow</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {flowOptions.map(f => (
            <button key={f} onClick={() => setFlow(f)} style={{
              padding: "7px 14px", borderRadius: 100, border: "none",
              background: flow === f ? "#C97B7B" : "#EAF2EA",
              color: flow === f ? "#fff" : "#6b7b6b",
              fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", textTransform: "capitalize",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 12px" }}>📝 Notes</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How are you feeling? Any symptoms?"
          style={{ ...s.input, height: 80, resize: "none", fontFamily: "sans-serif" }}
        />
      </div>

      <button onClick={save} style={s.btn}>Save Check-In ✅</button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CALENDAR SCREEN
// ─────────────────────────────────────────────
function CalendarScreen({ lastPeriod }) {
  const today   = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year,  setYear]  = useState(today.getFullYear());
  const [selDay, setSelDay] = useState(today.getDate());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow    = new Date(year, month, 1).getDay();

  const getCycleDayFor = (d) => {
    if (!lastPeriod) return 1;
    const date = new Date(year, month, d);
    const diff = Math.floor((date - new Date(lastPeriod)) / 86400000);
    return ((diff % 28) + 28) % 28 + 1;
  };

  const selPhase = getPhase(getCycleDayFor(selDay));
  const selInfo  = PHASE_INFO[selPhase];

  return (
    <div style={{ padding: "16px 16px 90px" }}>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}
          style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8FAF8F" }}>‹</button>
        <h3 style={{ ...s.title, margin: 0 }}>{MONTHS[month]} {year}</h3>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}
          style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8FAF8F" }}>›</button>
      </div>

      {/* Day of week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
        {["S","M","T","W","T","F","S"].map((d,i) => (
          <div key={i} style={{ textAlign: "center", fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", fontWeight: 600 }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const cycDay  = getCycleDayFor(d);
          const phase   = getPhase(cycDay);
          const info    = PHASE_INFO[phase];
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isSel   = d === selDay;
          return (
            <button key={d} onClick={() => setSelDay(d)} style={{
              aspectRatio: "1", borderRadius: "50%",
              border: isToday ? `2px solid #8FAF8F` : "none",
              background: isSel ? info.color : info.bg,
              cursor: "pointer", fontFamily: "sans-serif", fontSize: 13,
              color: isSel ? "#fff" : info.color,
              fontWeight: isToday ? 700 : 400,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{d}</button>
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
  const tabs = ["Fasting", "Phases", "Conditions", "Men", "Glossary", "Workouts", "Nutrition", "Blood Color", "Cravings"];

  const BLOOD_COLORS = [
    { color: "#B22222", label: "Bright Red",    note: "Fresh flow. Healthy and normal at peak flow." },
    { color: "#8B0000", label: "Dark Red",       note: "Older blood. Common at start or end of period." },
    { color: "#3D1C02", label: "Brown",          note: "Very old blood. Normal at the very start or end." },
    { color: "#E8A090", label: "Light Pink",     note: "Diluted blood. May indicate low estrogen or light flow." },
    { color: "#1C0202", label: "Black",          note: "Very old blood. Usually normal but worth noting." },
    { color: "#C4A882", label: "Orange-tinged",  note: "Could indicate infection if paired with unusual odor. See your provider." },
  ];

  const CRAVINGS = [
    { craving: "🍫 Chocolate",       why: "Magnesium deficiency. Your body needs this mineral for mood and muscle function." },
    { craving: "🧂 Salty / Crunchy", why: "Aldosterone fluctuates before your period, triggering salt cravings." },
    { craving: "🍬 Sugar / Sweets",  why: "Falling hormones affect serotonin and blood sugar regulation." },
    { craving: "🍞 Carbs / Bread",   why: "Rising progesterone increases your metabolic rate – you need more energy." },
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
    { phase: "Luteal 🌗",     tip: "Moderate cardio and pilates. Late luteal – slow right down." },
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

      <div style={{ display: "flex", overflowX: "auto", gap: 8, padding: "0 16px 14px", scrollbarWidth: "none" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flexShrink: 0, padding: "7px 16px", borderRadius: 100, border: "none",
            background: tab === t ? "#8FAF8F" : "#EAF2EA",
            color: tab === t ? "#fff" : "#6b7b6b",
            fontFamily: "sans-serif", fontSize: 13, fontWeight: tab === t ? 700 : 400, cursor: "pointer",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
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

        {tab === "Fasting" && FASTING_INFO.map((f, i) => (
          <div key={i} style={{ ...s.card, textAlign: "left" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>{f.phase}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{f.tip}</p>
          </div>
        ))}

        {tab === "Workouts" && WORKOUT_INFO.map((w, i) => (
          <div key={i} style={{ ...s.card, textAlign: "left" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>{w.phase}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{w.tip}</p>
          </div>
        ))}

        {tab === "Nutrition" && NUTRITION_INFO.map((n, i) => (
          <div key={i} style={{ ...s.card, textAlign: "left" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>{n.phase}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{n.tip}</p>
          </div>
        ))}

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

        {tab === "Conditions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { dot: "#4A90D9", title: "PCOS", body: "Polycystic ovary syndrome affects insulin and androgen levels. Many people with PCOS have insulin resistance.\n\nHow fasting helps: Improves insulin sensitivity, helps regulate cycles and reduce androgens. Start with gentle 12–14h windows and build slowly." },
              { dot: "#C97B7B", title: "Endometriosis", body: "An inflammatory condition where tissue similar to the uterine lining grows outside the uterus.\n\nHow fasting helps: Anti-inflammatory effects may reduce estrogen dominance. Avoid aggressive fasting during flares — gentle 12–14h windows work best." },
              { dot: "#E0904A", title: "Perimenopause", body: "The transition before menopause, often beginning in the 40s, when hormones become irregular.\n\nTips: 12–14h windows support metabolic health without stressing shifting hormones. Prioritise protein and strength training." },
              { dot: "#C9A030", title: "Menopause", body: "After 12 months without a period. Estrogen is consistently low, metabolism slows and body composition shifts.\n\nTips: 12–16h windows improve insulin sensitivity and support weight management. Combine with resistance training." },
              { dot: "#5C9E6E", title: "Thyroid condition", body: "Affects metabolism and energy regulation significantly.\n\nImportant: Fasting can affect T3 levels. Always consult your doctor first. If you do fast, keep to 12–13h maximum and monitor how you feel closely." },
              { dot: "#9B7BC9", title: "Fibroids", body: "Non-cancerous growths in the uterus, often linked to estrogen dominance.\n\nTips: Reducing excess estrogen through diet and fasting may help. Focus on anti-inflammatory foods. 12–14h windows in the follicular phase are a gentle start." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#F8FAF8", borderRadius: 16, padding: "14px 16px", border: "0.5px solid #dce8dc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: 0 }}>{item.title}</p>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: 0, lineHeight: 1.8, whiteSpace: "pre-line" }}>{item.body}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Men" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "🧬 Testosterone + fasting", body: "Short-term fasting increases testosterone by reducing insulin, which suppresses sex hormone binding globulin (SHBG). Lower SHBG means more free testosterone available to your cells.\n\nPractical tip: 16h fasts 3–4 times a week can meaningfully improve free testosterone levels over time." },
              { title: "📈 Growth hormone spike", body: "Growth hormone can increase up to 5x baseline after extended fasting. Even 16–18h fasts produce a significant spike.\n\nWhy it matters for muscle: GH stimulates muscle protein synthesis and accelerates fat burning. It is your body's natural anabolic hormone — fasting amplifies it." },
              { title: "💪 Fasting + muscle growth", body: "Will fasting eat my muscle? The research says no — if you do it right.\n\nKey rules: Hit your daily protein target (1.6–2.2g per kg bodyweight). Break your fast with a protein-rich meal post-workout. Keep fasting windows at 16–18h. Resistance train 3–4x per week." },
              { title: "🏋️ Fasting + lifting performance", body: "Fasted training: Higher fat oxidation, good for lower intensity sessions. Performance may dip slightly on heavy compound lifts.\n\nFed training: Better peak performance for max lifts. Train 1–2h after breaking your fast with carbs and protein." },
              { title: "⚖️ Insulin sensitivity + body composition", body: "Fasting dramatically improves insulin sensitivity. This means less fat storage, better energy use and a leaner body composition over time.\n\nThe result: Lower visceral fat, improved metabolic health markers, and a better muscle-to-fat ratio without crash dieting." },
              { title: "😴 Sleep, recovery + fasting", body: "Finishing your last meal 3–4h before sleep reduces insulin spikes that disrupt deep sleep stages.\n\nWhy this matters for gains: Deep sleep is when GH peaks naturally. Better sleep means more GH which means better muscle recovery." },
              { title: "🧠 Mental clarity + focus", body: "Ketones produced during fasting are a more efficient brain fuel than glucose. Many men report their sharpest thinking 14–18h into a fast.\n\nFasting increases BDNF which supports neuroplasticity, learning and mood regulation." },
              { title: "🔄 Autophagy + cellular repair", body: "Autophagy is your body's cellular clean-up process — damaged proteins get recycled and rebuilt. Kicks in around 16–18h of fasting.\n\nSupports joint health, reduces inflammation from heavy training, and is associated with slower cellular ageing." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#F8FAF8", borderRadius: 16, padding: "14px 16px", border: "0.5px solid #dce8dc" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 6px" }}>{item.title}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: 0, lineHeight: 1.8, whiteSpace: "pre-line" }}>{item.body}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Glossary" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Insulin", body: "A hormone that lets cells absorb glucose for energy. High insulin blocks fat burning — fasting lowers it and resets your metabolic baseline." },
              { title: "Cortisol", body: "Your stress hormone. Rises naturally in the morning. Extended fasting can spike it — which is why being gentle matters." },
              { title: "Estrogen", body: "The primary hormone in the first half of the cycle. Boosts energy, mood and metabolic flexibility. Present in all bodies." },
              { title: "Progesterone", body: "Rises in the second half of the cycle. Increases metabolism slightly and can affect mood and blood sugar stability." },
              { title: "Testosterone", body: "Key hormone for muscle, energy and drive. Present in all bodies. Fasting, strength training and quality sleep all support healthy levels." },
              { title: "Growth Hormone", body: "Spikes during fasting and deep sleep. Supports muscle repair, fat burning and anti-ageing processes." },
              { title: "Ketosis", body: "When your body exhausts glucose stores and switches to burning fat, producing ketones as a byproduct. Activated around 16–18h of fasting." },
              { title: "Autophagy", body: "Your body's cellular recycling system. Damaged cells get broken down and rebuilt. Activated around 16–18h of fasting. Linked to longevity and reduced inflammation." },
              { title: "BDNF", body: "Brain-derived neurotrophic factor. Supports brain cell growth, learning and mood. Fasting increases BDNF — which is why mental clarity often improves during a fast." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#F8FAF8", borderRadius: 16, padding: "14px 16px", border: "0.5px solid #dce8dc" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 6px" }}>{item.title}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: 0, lineHeight: 1.8 }}>{item.body}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Cravings" && (
          <>
            <div style={{ ...s.card, background: "#EAF2EA", textAlign: "left" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 6px" }}>Why you crave what you crave</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>Cravings aren't weakness – they're your body communicating a real need.</p>
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
function SettingsScreen({ settings, onSave }) {
  const [subScreen,    setSubScreen]    = useState(null);
  const [name,         setName]         = useState(settings.name || "");
  const [saved,        setSaved]        = useState(false);

  if (subScreen === "privacy") return <PrivacyScreen onBack={() => setSubScreen(null)} />;
  if (subScreen === "terms")   return <TermsScreen   onBack={() => setSubScreen(null)} />;

  const handleSave = () => {
    onSave({ ...settings, name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: "16px 16px 90px" }}>
      <h3 style={s.title}>Settings</h3>

      <div style={{ ...s.card, textAlign: "left", marginBottom: 12 }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 14px" }}>Profile</p>
        <label style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b" }}>Your name</label>
        <input value={name} onChange={e => setName(e.target.value)} style={{ ...s.input, marginTop: 6, marginBottom: 0 }} />
      </div>

      <button onClick={handleSave} style={{ ...s.btn, marginBottom: 16 }}>
        {saved ? "✓ Saved!" : "Save Changes"}
      </button>

      <div style={{ ...s.card, textAlign: "left", marginBottom: 12 }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 12px" }}>Legal</p>
        <button onClick={() => setSubScreen("privacy")} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EAF2EA", border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#2D3B2E", cursor: "pointer", marginBottom: 8 }}>
          <span>🔒 Privacy Policy</span><span style={{ color: "#C5D9C5", fontSize: 18 }}>›</span>
        </button>
        <button onClick={() => setSubScreen("terms")} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EAF2EA", border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#2D3B2E", cursor: "pointer" }}>
          <span>📄 Terms of Service</span><span style={{ color: "#C5D9C5", fontSize: 18 }}>›</span>
        </button>
      </div>

      <div style={{ ...s.card, textAlign: "center" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 4px" }}>🌿 Lumen Flow</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8FA090", margin: 0 }}>Version 1.0.0 · Made with care</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  RECIPES SCREEN
// ─────────────────────────────────────────────
const RECIPES = [
  { id: 1,  name: "Zucchini Noodle Bowl",      diet: "Low Carb",     time: 20, phases: ["Follicular","Ovulation"], tip: "Supports estrogen metabolism.",                    ingredients: ["2 zucchinis, spiralized","200g grilled chicken","2 tbsp pesto","Cherry tomatoes","Parmesan"],                          steps: ["Spiralize zucchinis into noodles.","Grill chicken until cooked through, slice.","Toss zucchini noodles with pesto.","Top with chicken, tomatoes, and parmesan.","Serve immediately."] },
  { id: 2,  name: "Egg & Avocado Salad",        diet: "Low Carb",     time: 15, phases: ["Menstrual","Luteal"],     tip: "Healthy fats support progesterone.",               ingredients: ["3 boiled eggs","1 avocado","Dijon mustard","Lemon juice","Mixed greens"],                                           steps: ["Halve and cube avocado.","Slice boiled eggs.","Mix mustard and lemon for dressing.","Toss greens, eggs, and avocado.","Drizzle with dressing."] },
  { id: 3,  name: "Sweet Potato Tacos",         diet: "High Carb",    time: 30, phases: ["Follicular","Ovulation"], tip: "Complex carbs fuel your peak phase.",              ingredients: ["2 sweet potatoes, cubed","1 can black beans","Corn tortillas","Avocado","Lime","Cilantro"],                        steps: ["Roast sweet potatoes at 200°C for 20 min.","Warm black beans with cumin.","Warm tortillas in a dry pan.","Layer beans and potato in tortillas.","Top with avocado, lime, and cilantro."] },
  { id: 4,  name: "Brown Rice Power Bowl",      diet: "High Carb",    time: 40, phases: ["Luteal"],                 tip: "Complex carbs stabilise blood sugar.",             ingredients: ["1 cup brown rice","1 can chickpeas","Roasted broccoli","Tahini","Lemon","Sesame seeds"],                          steps: ["Cook brown rice per package.","Roast broccoli and chickpeas at 200°C for 20 min.","Whisk tahini, lemon, and water for dressing.","Assemble bowl with rice as base.","Top with vegetables and drizzle dressing."] },
  { id: 5,  name: "Bacon & Brie Omelette",      diet: "Keto",         time: 15, phases: ["Follicular","Ovulation"], tip: "High fat supports energy in your active phase.",   ingredients: ["3 eggs","2 bacon rashers","30g brie","Chives","Butter"],                                                        steps: ["Cook bacon until crispy.","Whisk eggs with salt and pepper.","Melt butter in pan, pour in eggs.","Cook until edges set.","Add brie and bacon, fold and serve."] },
  { id: 6,  name: "Keto Cauliflower Rice",      diet: "Keto",         time: 25, phases: ["Luteal","Menstrual"],     tip: "Cauliflower provides vitamin C to ease bloating.", ingredients: ["1 head cauliflower, riced","2 eggs","Tamari","Sesame oil","Spring onions","Ginger"],                            steps: ["Pulse cauliflower until rice-sized.","Sauté garlic and ginger in sesame oil.","Add cauliflower rice, cook 5 min.","Push aside, scramble eggs in pan.","Combine and add tamari and spring onions."] },
  { id: 7,  name: "Ribeye & Bone Marrow",       diet: "Carnivore",    time: 20, phases: ["Follicular","Ovulation"], tip: "High iron and zinc fuel your peak phase.",         ingredients: ["1 ribeye steak","Bone marrow","Butter","Sea salt","Black pepper","Fresh thyme"],                               steps: ["Season steak with salt and pepper.","Roast bone marrow at 220°C for 15 min.","Sear steak 3-4 min per side.","Rest steak for 5 minutes.","Top with scooped bone marrow and butter."] },
  { id: 8,  name: "Lamb Liver with Bacon",      diet: "Carnivore",    time: 15, phases: ["Menstrual"],              tip: "Liver is one of the richest sources of iron.",     ingredients: ["300g lamb liver, sliced","4 bacon rashers","Butter","Sea salt","Black pepper"],                                steps: ["Cook bacon until crispy, remove.","Season liver with salt and pepper.","Cook liver in bacon fat 2 min per side.","Slight pink centre is ideal.","Serve liver topped with bacon."] },
  { id: 9,  name: "Lentil & Spinach Dal",       diet: "Vegan",        time: 35, phases: ["Menstrual","Follicular"], tip: "Lentils provide plant-based iron.",                ingredients: ["1 cup red lentils","1 can coconut milk","2 cups spinach","Curry powder","Turmeric","Ginger","Tomatoes"],      steps: ["Sauté garlic and ginger.","Add curry powder and turmeric.","Add lentils, tomatoes, and coconut milk.","Simmer 20 min until soft.","Stir in spinach until wilted."] },
  { id: 10, name: "Roasted Beet Salad",         diet: "Vegan",        time: 40, phases: ["Follicular","Ovulation"], tip: "Beets support detox pathways.",                    ingredients: ["3 beets, cubed","Walnuts","Mixed greens","Balsamic glaze","Olive oil","Orange zest"],                        steps: ["Toss beets in olive oil, roast 200°C 30 min.","Toast walnuts in a dry pan.","Arrange greens on a plate.","Top with warm beets and walnuts.","Drizzle with balsamic and orange zest."] },
  { id: 11, name: "Shakshuka",                  diet: "Vegetarian",   time: 25, phases: ["Follicular","Ovulation"], tip: "Eggs provide choline for liver health.",           ingredients: ["4 eggs","1 can crushed tomatoes","1 bell pepper","Onion","Cumin, paprika","Feta","Parsley"],                  steps: ["Sauté onion and pepper.","Add spices and tomatoes, simmer 10 min.","Make wells in sauce, crack in eggs.","Cover and cook until eggs just set.","Top with feta and parsley."] },
  { id: 12, name: "Butternut Squash Soup",      diet: "Vegetarian",   time: 40, phases: ["Luteal","Menstrual"],     tip: "Beta-carotene supports progesterone.",             ingredients: ["1 butternut squash","1 onion","Vegetable stock","Coconut milk","Nutmeg","Ginger"],                            steps: ["Roast squash at 200°C for 30 min.","Scoop flesh and blend with stock.","Sauté onion and ginger, add to blender.","Blend until smooth, add coconut milk.","Season with nutmeg and serve."] },
  { id: 13, name: "Greek Baked Fish",           diet: "Mediterranean",time: 30, phases: ["Follicular","Ovulation"], tip: "Omega-3s and olive oil support estrogen balance.", ingredients: ["2 white fish fillets","Cherry tomatoes","Kalamata olives","Capers","Olive oil","Lemon","Feta"],               steps: ["Place fish in baking dish.","Scatter tomatoes, olives, and capers.","Drizzle with olive oil.","Add lemon slices.","Bake at 190°C for 20 min, top with feta."] },
  { id: 14, name: "Lemon Herb Chicken Orzo",    diet: "Mediterranean",time: 35, phases: ["Luteal"],                 tip: "B6 in chicken supports serotonin.",                ingredients: ["2 chicken thighs","1 cup orzo","Chicken stock","Lemon","Spinach","Garlic","Fresh dill"],                    steps: ["Sear chicken thighs until golden.","Add garlic, orzo, stock, and lemon.","Simmer 12 min until orzo is cooked.","Stir in spinach until wilted.","Finish with fresh dill."] },
  { id: 15, name: "Paleo Bison Burgers",        diet: "Paleo",        time: 25, phases: ["Follicular","Ovulation"], tip: "Bison is lean and packed with iron.",              ingredients: ["400g ground bison","Garlic powder","Onion powder","Lettuce wraps","Avocado","Tomato"],                      steps: ["Mix bison with garlic and onion powder.","Form into patties.","Grill 4-5 min per side.","Rest patties 3 minutes.","Serve in lettuce wraps with avocado."] },
  { id: 16, name: "Sweet Potato Hash",          diet: "Paleo",        time: 30, phases: ["Menstrual","Luteal"],     tip: "Vitamin B6 is a natural mood supporter.",         ingredients: ["2 sweet potatoes, diced","1 onion","Bell pepper","2 eggs","Paprika","Olive oil"],                            steps: ["Pan-fry sweet potato covered for 15 min.","Add onion and pepper, cook until soft.","Season with paprika.","Make wells, crack in eggs.","Cover and cook until eggs are set."] },
  { id: 17, name: "Quinoa Stuffed Tomatoes",    diet: "Gluten-Free",  time: 35, phases: ["Follicular","Ovulation"], tip: "Quinoa is a complete protein.",                    ingredients: ["4 large tomatoes","1 cup quinoa","Feta","Olives","Cucumber","Mint","Lemon"],                                steps: ["Cook quinoa per package.","Hollow out tomatoes.","Mix quinoa with feta, olives, cucumber, mint.","Fill tomatoes with mixture.","Bake at 180°C for 15 min."] },
  { id: 18, name: "Mango Chia Pudding",         diet: "Gluten-Free",  time: 10, phases: ["Follicular","Ovulation"], tip: "Omega-3s in chia support anti-inflammation.",      ingredients: ["4 tbsp chia seeds","1.5 cups coconut milk","1 mango, diced","Lime zest","Honey","Mint"],                    steps: ["Mix chia seeds with coconut milk.","Stir well and refrigerate 4+ hours.","Stir again before serving.","Top with fresh mango.","Add lime zest, honey, and mint."] },
  { id: 19, name: "Turmeric Golden Soup",       diet: "Vegan",        time: 30, phases: ["Menstrual","Luteal"],     tip: "Curcumin in turmeric eases period pain.",         ingredients: ["1 head cauliflower","1 can coconut milk","Vegetable stock","2 tsp turmeric","Ginger","Garlic","Black pepper"],steps: ["Roast cauliflower at 200°C for 25 min.","Blend with stock, coconut milk, and spices.","Heat in pot with garlic and ginger.","Simmer 10 min.","Finish with lemon juice and black pepper."] },
  { id: 20, name: "Walnut & Date Energy Bites", diet: "Vegan", time: 15, phases: ["Luteal"], tip: "Magnesium in walnuts eases PMS.", ingredients: ["1 cup walnuts","1 cup medjool dates, pitted","3 tbsp cacao powder","Pinch of sea salt","Desiccated coconut"], steps: ["Blend walnuts in food processor.","Add dates, cacao, and salt.","Blend until mixture sticks together.","Roll into small balls.","Coat in coconut. Refrigerate 30 min."] },
  { id: 21, name: "Pesto Chicken Bake", diet: "High Protein", time: 30, phases: ["Follicular","Ovulation"], tip: "Protein and healthy fats support peak phase energy.", ingredients: ["2 chicken breasts","4 tbsp basil pesto","2 large tomatoes, sliced","150g fresh mozzarella, sliced","Olive oil","Salt and pepper","Fresh basil to serve"], steps: ["Preheat oven to 200C.","Season chicken breasts with salt and pepper.","Place in a baking dish and bake for 15 minutes.","Remove and spread pesto generously over each breast.","Layer tomato slices and mozzarella on top.","Return to oven for 10-12 minutes until cheese is melted and bubbly.","Finish with fresh basil and a drizzle of olive oil."] },
  { id: 22, name: "Jar Butter Chicken", diet: "High Protein", time: 25, phases: ["Luteal","Menstrual"], tip: "Warming spices support comfort and reduce inflammation.", ingredients: ["500g chicken breast or thighs, cubed","1 jar butter chicken sauce","2 tbsp butter or ghee","1 onion, diced","Salt to taste","Basmati rice to serve","Fresh coriander to serve"], steps: ["Heat butter in a large pan over medium heat.","Saute onion until soft and golden, about 5 minutes.","Add chicken pieces and cook until sealed on all sides.","Pour the entire jar of butter chicken sauce over the chicken.","Stir well, reduce heat and simmer for 15 minutes until cooked through.","Taste and season with salt.","Serve over basmati rice topped with fresh coriander."] },
  { id: 23, name: "Honey Garlic Chicken Wings", diet: "High Protein", time: 45, phases: ["Follicular","Ovulation"], tip: "High protein fuel for your peak performance phase.", ingredients: ["1kg chicken wings","4 tbsp honey","4 cloves garlic, minced","3 tbsp soy sauce","1 tbsp butter","1 tsp sesame oil","Salt and pepper","Sesame seeds and spring onions to serve"], steps: ["Preheat oven to 220C.","Season wings with salt and pepper.","Bake on a rack for 25 minutes, flipping halfway.","Melt butter in a pan, add garlic and cook 1 minute.","Add honey, soy sauce and sesame oil, stir and simmer 3 minutes.","Toss baked wings in the sauce until fully coated.","Return to oven for 8-10 minutes until sticky and caramelised.","Top with sesame seeds and spring onions."] },
  { id: 24, name: "Hot Chicken Wings", diet: "High Protein", time: 45, phases: ["Follicular","Ovulation"], tip: "Capsaicin in hot sauce boosts metabolism naturally.", ingredients: ["1kg chicken wings","4 tbsp hot sauce","2 tbsp butter, melted","1 tsp garlic powder","1 tsp paprika","Salt and pepper","Blue cheese or ranch dip to serve","Celery sticks to serve"], steps: ["Preheat oven to 220C.","Pat wings dry for crispy skin.","Season with garlic powder, paprika, salt and pepper.","Bake on a rack for 30 minutes, flipping halfway.","Mix hot sauce with melted butter.","Toss wings in hot sauce mixture until coated.","Return to oven for 10 minutes until crispy and glazed.","Serve with blue cheese dip and celery."] },
  { id: 25, name: "Parmesan Garlic Wings", diet: "High Protein", time: 40, phases: ["Follicular","Ovulation"], tip: "Calcium and protein make this a muscle-supporting meal.", ingredients: ["1kg chicken wings","4 tbsp butter, melted","4 cloves garlic, minced","100g parmesan, freshly grated","1 tsp Italian seasoning","Salt and pepper","Fresh parsley to serve"], steps: ["Preheat oven to 220C.","Season wings with salt, pepper and Italian seasoning.","Bake on a rack for 30 minutes, flipping halfway.","Mix melted butter with minced garlic.","Toss hot wings in garlic butter until coated.","Immediately toss in grated parmesan.","Return to oven for 5 minutes to set the coating.","Serve topped with fresh parsley and extra parmesan."] },
  { id: 26, name: "Italian Herb Baked Chicken", diet: "High Protein", time: 35, phases: ["Follicular","Ovulation"], tip: "Lean protein supports muscle and sustained energy.", ingredients: ["4 chicken breasts","2 tsp Italian seasoning","1 tsp garlic powder","1 tsp onion powder","1 tsp paprika","2 tbsp olive oil","Salt and pepper","Lemon wedges to serve"], steps: ["Preheat oven to 200C.","Mix Italian seasoning, garlic powder, onion powder, paprika, salt and pepper.","Coat chicken in olive oil then rub seasoning all over.","Place in a baking dish.","Bake for 22-25 minutes until cooked through.","Rest for 5 minutes before slicing.","Serve with lemon wedges and fresh herbs."] },
  { id: 27, name: "Jamaican Rice & Red Beans", diet: "Caribbean", time: 40, phases: ["Luteal","Menstrual"], tip: "Complex carbs and plant protein stabilise blood sugar.", ingredients: ["2 cups long grain white rice","1 can red kidney beans, drained","1 can coconut milk","2 cups water","3 cloves garlic, minced","2 spring onions","1 sprig fresh thyme","1 whole scotch bonnet pepper","Salt to taste"], steps: ["Combine coconut milk and water in a large pot and bring to a simmer.","Add garlic, spring onions, thyme and whole scotch bonnet - do not pierce it.","Add kidney beans and stir.","Add rice and season generously with salt.","Stir once, bring to a boil then reduce to lowest heat.","Cover tightly and cook for 20-25 minutes until rice is fluffy.","Remove scotch bonnet, thyme and spring onions before serving.","Fluff with a fork and serve."] },
  { id: 28, name: "Jamaican Oxtail Stew", diet: "Caribbean", time: 180, phases: ["Menstrual","Luteal"], tip: "Iron-rich oxtail replenishes what is lost during your period.", ingredients: ["1.5kg oxtail pieces","1 can butter beans","2 onions, diced","4 cloves garlic, minced","2 tbsp browning sauce","2 tbsp soy sauce","1 tbsp allspice","1 scotch bonnet pepper","2 sprigs thyme","2 spring onions","Salt and pepper","2 tbsp oil"], steps: ["Season oxtail with browning sauce, soy sauce, allspice, salt, pepper and half the garlic. Marinate 1 hour or overnight.","Heat oil and brown oxtail pieces in batches.","Remove oxtail. Saute onions and remaining garlic until soft.","Return oxtail to pot. Cover with water and bring to a boil.","Add thyme, spring onions and whole scotch bonnet.","Reduce heat, cover and simmer for 2-2.5 hours until tender.","Add butter beans in the last 20 minutes.","Serve with white rice."] },
  { id: 29, name: "Jamaican Curry Chicken", diet: "Caribbean", time: 60, phases: ["Follicular","Luteal"], tip: "Turmeric in curry powder is powerfully anti-inflammatory.", ingredients: ["1kg chicken pieces, bone-in","3 tbsp Jamaican curry powder","1 onion, diced","4 cloves garlic, minced","1 tsp fresh ginger, grated","2 potatoes, cubed","1 scotch bonnet pepper","2 sprigs thyme","2 tbsp oil","Salt to taste","White rice to serve"], steps: ["Season chicken with curry powder, salt and half the garlic. Marinate 30 minutes.","Heat oil in a pot. Add remaining garlic, onion and ginger. Cook 3 minutes.","Add chicken and brown on all sides.","Add enough water to cover halfway. Add thyme and whole scotch bonnet.","Cover and simmer 30 minutes.","Add potatoes and cook 15-20 minutes until tender.","Taste and adjust seasoning.","Serve over white rice."] },
  { id: 30, name: "Caribbean Stew Chicken", diet: "Caribbean", time: 60, phases: ["Follicular","Ovulation"], tip: "Bone-in chicken provides collagen for joint health.", ingredients: ["1kg chicken pieces, bone-in","2 tbsp browning sauce","1 tbsp soy sauce","1 onion, diced","4 cloves garlic, minced","1 bell pepper, diced","2 tomatoes, diced","2 sprigs thyme","1 scotch bonnet pepper","2 tbsp oil","Salt and pepper"], steps: ["Season chicken with browning sauce, soy sauce, garlic, salt and pepper. Marinate 30 minutes.","Heat oil and brown chicken pieces well on all sides.","Remove chicken. Saute onion, bell pepper and garlic 3 minutes.","Add tomatoes and cook until soft.","Return chicken to pot. Add thyme and whole scotch bonnet.","Add a splash of water, cover and simmer on low for 35-40 minutes.","Taste and adjust seasoning.","Serve with white rice or rice and peas."] },
  { id: 31, name: "Fried Sweet Plantain", diet: "Caribbean", time: 15, phases: ["Luteal","Menstrual"], tip: "Natural sugars in ripe plantain give gentle energy during your period.", ingredients: ["2 very ripe plantains, skin mostly black","Oil for frying","Pinch of salt"], steps: ["Peel plantains and cut on a diagonal into 1cm slices.","Heat about 1cm of oil in a pan over medium heat.","Fry plantain slices for 2-3 minutes per side until golden and caramelised.","They should be soft inside and slightly crispy outside.","Remove and drain on paper towel.","Season with a pinch of salt.","Serve immediately as a side or snack."] },
  { id: 32, name: "Crispy Roasted Potatoes", diet: "Vegan", time: 45, phases: ["Luteal","Follicular"], tip: "Complex carbs from potatoes provide sustained energy.", ingredients: ["800g potatoes, cubed","3 tbsp olive oil","1 tsp garlic powder","1 tsp paprika","1 tsp dried rosemary","Salt and pepper"], steps: ["Preheat oven to 220C.","Cube potatoes into even pieces and pat dry.","Toss with olive oil, garlic powder, paprika, rosemary, salt and pepper.","Spread in a single layer on a baking tray - do not crowd them.","Roast for 35-40 minutes, turning halfway, until golden and crispy.","Season with extra salt immediately out of the oven."] },
];

const DIET_TYPES    = ["All","High Protein","Low Carb","High Carb","Keto","Carnivore","Vegan","Vegetarian","Mediterranean","Paleo","Gluten-Free","Caribbean"];
const PHASE_FILTERS = ["All","Menstrual","Follicular","Ovulation","Luteal"];

function RecipesScreen({ phase }) {
  const [dietFilter,  setDietFilter]  = useState("All");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [selected,    setSelected]    = useState(null);

  const filtered = RECIPES.filter(r => {
    const dOk = dietFilter  === "All" || r.diet   === dietFilter;
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

      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 16px 8px", scrollbarWidth: "none" }}>
        {PHASE_FILTERS.map(p => (
          <button key={p} onClick={() => setPhaseFilter(p)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 100, border: "none", background: phaseFilter === p ? "#8FAF8F" : "#EAF2EA", color: phaseFilter === p ? "#fff" : "#6b7b6b", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>{p}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 16px 12px", scrollbarWidth: "none" }}>
        {DIET_TYPES.map(d => (
          <button key={d} onClick={() => setDietFilter(d)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 100, border: "none", background: dietFilter === d ? "#5C7F60" : "#EAF2EA", color: dietFilter === d ? "#fff" : "#6b7b6b", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>{d}</button>
        ))}
      </div>

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

// ─────────────────────────────────────────────
//  LEGAL SCREENS
// ─────────────────────────────────────────────
function PrivacyScreen({ onBack }) {
  return (
    <div style={{ padding: "16px 16px 90px" }}>
      <button onClick={onBack} style={{ background: "#EAF2EA", border: "none", borderRadius: 10, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#5C7F60", cursor: "pointer", marginBottom: 16 }}>← Back</button>
      <h3 style={s.title}>Privacy Policy</h3>
      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8FA090", marginBottom: 16 }}>Last updated: April 2026</p>
      {[
        { title: "1. Information We Collect",  body: "Lumen Flow does not collect, transmit, or store any personal data on external servers. All information you enter – including your name, last period date, fasting history, and daily check-ins – is stored locally on your device only." },
        { title: "2. How Your Data Is Used",   body: "Your data is used solely to provide app functionality such as cycle phase calculations, fasting timer tracking, and personalised recommendations. This data never leaves your device." },
        { title: "3. Third Party Services",    body: "Lumen Flow does not share your data with any third parties. We do not use advertising networks, analytics services, or any external data processors." },
        { title: "4. Data Security",           body: "Since all data is stored locally on your device, your information is protected by your device's own security measures. We recommend keeping your device secure with a passcode or biometric lock." },
        { title: "5. Children's Privacy",      body: "Lumen Flow is intended for users aged 13 and over. We do not knowingly collect data from children under 13." },
        { title: "6. Changes to This Policy",  body: "We may update this Privacy Policy from time to time. Any changes will be reflected in the app with an updated date." },
        { title: "7. Contact Us",              body: "If you have any questions about this Privacy Policy, please contact us at: lumenfuxbiz@gmail.com" },
      ].map((item, i) => (
        <div key={i} style={{ ...s.card, textAlign: "left", marginBottom: 12 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 6px" }}>{item.title}</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.7 }}>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

function TermsScreen({ onBack }) {
  return (
    <div style={{ padding: "16px 16px 90px" }}>
      <button onClick={onBack} style={{ background: "#EAF2EA", border: "none", borderRadius: 10, padding: "8px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#5C7F60", cursor: "pointer", marginBottom: 16 }}>← Back</button>
      <h3 style={s.title}>Terms of Service</h3>
      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8FA090", marginBottom: 16 }}>Last updated: April 2026</p>
      {[
        { title: "1. Acceptance of Terms",            body: "By using Lumen Flow, you agree to these Terms of Service. If you do not agree, please do not use the app." },
        { title: "2. Medical Disclaimer",             body: "Lumen Flow is a wellness tool for informational and educational purposes only. It is NOT a medical device and does NOT provide medical advice. Always consult a qualified healthcare provider before making decisions about your health, diet, or fasting practices." },
        { title: "3. Not a Substitute for Medical Care", body: "The content in Lumen Flow – including cycle phase information, fasting recommendations, and nutritional guidance – is general in nature and not tailored to your individual medical needs. Never disregard professional medical advice because of something you read in this app." },
        { title: "4. User Responsibilities",          body: "You are responsible for how you use the information provided in Lumen Flow. Listen to your body, and always prioritise your health and wellbeing over any app recommendation." },
        { title: "5. Intellectual Property",          body: "© 2026 Lumen Flow. All content, design, and code within this app is the intellectual property of Lumen Flow. Unauthorised reproduction or distribution is prohibited." },
        { title: "6. Limitation of Liability",        body: "Lumen Flow and its creators shall not be liable for any health outcomes, injuries, or damages arising from use of the app or reliance on its content." },
        { title: "7. Changes to Terms",               body: "We reserve the right to modify these Terms at any time. Continued use of the app after changes constitutes acceptance of the new Terms." },
        { title: "8. Contact Us",                     body: "For questions about these Terms, contact us at: lumenfuxbiz@gmail.com" },
      ].map((item, i) => (
        <div key={i} style={{ ...s.card, textAlign: "left", marginBottom: 12 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 6px" }}>{item.title}</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.7 }}>{item.body}</p>
        </div>
      ))}
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
    { id: "recipes",  icon: "🌿", label: "Nourish" },
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
        {screen === "home"     && <HomeScreen     name={settings.name} lastPeriod={settings.lastPeriod} />}
        {screen === "calendar" && <CalendarScreen lastPeriod={settings.lastPeriod} />}
        {screen === "recipes"  && <RecipesScreen  phase={getPhase(getCycleDay(settings.lastPeriod))} />}
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
  card:       { background: "#F8FAF8", padding: 16, borderRadius: 18, textAlign: "center", marginBottom: 12 },
  label:      { margin: 0, fontSize: 13, color: "#6b7b6b" },
  btn:        { width: "100%", padding: 14, borderRadius: 16, border: "none", background: "#8FAF8F", color: "#fff", fontWeight: "bold", fontSize: 15, cursor: "pointer" },
  backBtn:    { marginTop: 10, background: "none", border: "none", color: "#8FA090", fontSize: 14, cursor: "pointer", padding: 8 },
  input:      { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #C5D9C5", fontFamily: "sans-serif", fontSize: 15, color: "#2D3B2E", background: "#F4F8F4", boxSizing: "border-box", outline: "none", marginBottom: 4 },
  nav:        { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #EAF2EA", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", boxShadow: "0 -4px 16px rgba(0,0,0,0.05)", zIndex: 100 },
  navItem:    { cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60, paddingTop: 4 },
};
