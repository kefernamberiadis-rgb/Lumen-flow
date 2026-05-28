import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
//  CYCLE LOGIC
// ─────────────────────────────────────────────
function getCycleDay(lastPeriod, cycleLength = 28) {
  if (!lastPeriod) return 1;
  const start = new Date(lastPeriod);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / 86400000);
  return (diff % cycleLength) + 1;
}

function getPeriodPhase(lastPeriod, periodEnded, cycleLength = 28) {
  if (!lastPeriod) return null;
  if (!periodEnded) return "Menstrual";
  const day = getCycleDay(lastPeriod, cycleLength);
  return getPhase(day);
}


function getPhase(day, periodLength = 7) {
  if (day <= periodLength)  return "Menstrual";
  if (day <= periodLength + 8) return "Follicular";
  if (day <= periodLength + 10) return "Ovulation";
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
          <button style={s.btn} onClick={() => name.trim() && setStep(mode === "cycle" ? 5 : 5)}>Continue</button>
          <button style={s.backBtn} onClick={() => setStep(2)}>← Back</button>
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
249
function HomeScreen({ name, lastPeriod, mode, settings }) {
  const cycleDay = Math.max(1, getCycleDay(lastPeriod) - 1);

  useEffect(() => {
    if (localStorage.getItem("lf_auto_start_fast") === "true") {
      localStorage.removeItem("lf_auto_start_fast");
      if (!fastStart) startFast();
    }
  }, []);
  const phase    = getPhase(cycleDay);
  const info     = PHASE_INFO[phase];

  const [fastStart, setFastStart]   = useState(null);
  const [elapsed,   setElapsed]     = useState(0);
  const [goalHours, setGoalHours]   = useState(16);
  const [showGoals, setShowGoals]   = useState(false);
  const [showEditFast, setShowEditFast] = useState(false);
  const [waterToday, setWaterToday] = useState(() => parseInt(localStorage.getItem("lf_water_today") || "0"));

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
  const totalFasts = JSON.parse(localStorage.getItem("lf_fast_days") || "[]").length;
  

  return (
    <div style={{ padding: "0 0 90px", background: mode === "fast" ? "linear-gradient(180deg, #0c1410 0%, #141e16 40%, #0f1a12 100%)" : "linear-gradient(150deg, #f7f0ec 0%, #ede5f0 35%, #f5e8ed 65%, #eceaf5 100%)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ ...s.header, justifyContent: "space-between", paddingTop: 20 }}>
        <div>
          <p style={{ ...s.label, marginBottom: 2 }}>Good {getGreeting()},</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#2D3B2E", margin: 0, fontWeight: 400 }}>{name} 🌿</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          {mode !== "fast" ? (
            <>
              <span style={{ ...s.chip, background: info.bg, color: info.color, fontFamily: "sans-serif" }}>
                {info.emoji} {phase}
              </span>
              <p style={{ ...s.label, marginTop: 4 }}>Day {cycleDay}</p>
            </>
          ) : (
            <span style={{ ...s.chip, background: "#EAF2EA", color: "#5C7F60", fontFamily: "sans-serif" }}>
              ⚡ Fasting
            </span>
          )}
        </div>
      </div>

      {/* Fasting Timer — Arc for women, Bar for men */}
      <div style={{ margin: "12px 16px", background: mode === "fast" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.92)", borderRadius: 18, border: mode === "fast" ? "0.5px solid rgba(184,148,60,0.2)" : "0.5px solid #dce8dc", padding: 16, position: "relative" }}>
        {mode === "fast" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <p style={{ fontFamily: "sans-serif", fontSize: 9, color: "#3a5a3a", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 2px" }}>Fasting window</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#e8e0ce", margin: 0 }}>{fastStart ? "In progress ⚡" : "Ready to begin"}</p>
              </div>
              <span style={{ fontSize: 9, color: "#C9A84C", background: "rgba(201,168,76,0.1)", border: "0.5px solid rgba(201,168,76,0.3)", borderRadius: 4, padding: "3px 8px", letterSpacing: "0.08em" }}>{goalHours}H FAST</span>
            </div>
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 38, color: "#e8e0ce", margin: 0, letterSpacing: "0.02em", lineHeight: 1 }}>{fastStart ? fmtTime(elapsed) : "00:00:00"}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 9, color: "#3a5a3a", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>Hours fasted</p>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 8, color: "#3a5a3a", textTransform: "uppercase", letterSpacing: "0.06em" }}>0h</span>
                <span style={{ fontSize: 8, color: "#C9A84C" }}>{fastStart ? `${Math.round(progress * 100)}% complete ⚡` : "Begin your fast"}</span>
                <span style={{ fontSize: 8, color: "#3a5a3a", textTransform: "uppercase", letterSpacing: "0.06em" }}>{goalHours}h</span>
              </div>
              <div style={{ height: 4, background: "rgba(184,148,60,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${fastStart ? Math.min(progress * 100, 100) : 0}%`, height: "100%", background: "linear-gradient(90deg, #C9A84C, rgba(201,168,76,0.4))", borderRadius: 2, transition: "width 1s linear" }} />
              </div>
              <div style={{ display: "flex", gap: 3, marginTop: 3 }}>
                {[...Array(4)].map((_, i) => <div key={i} style={{ flex: 1, height: 2, background: `rgba(184,148,60,${0.3 - i * 0.06})`, borderRadius: 1 }} />)}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              {fastStart ? [
                { label: "Started", val: (() => { const d = new Date(fastStart); const h = d.getHours() % 12 || 12; const m = d.getMinutes(); const ap = d.getHours() >= 12 ? "pm" : "am"; return `${h}:${m < 10 ? "0" : ""}${m}${ap}`; })() },
                { label: "Ends", val: (() => { const end = new Date(fastStart + goalHours * 3600000); const h = end.getHours() % 12 || 12; const m = end.getMinutes(); const ap = end.getHours() >= 12 ? "pm" : "am"; return `${h}:${m < 10 ? "0" : ""}${m}${ap}`; })() },
                { label: "Left", val: (() => { const rem = Math.max(0, (fastStart + goalHours * 3600000) - Date.now()); const rh = Math.floor(rem / 3600000); const rm = Math.floor((rem % 3600000) / 60000); return `${rh}:${rm < 10 ? "0" : ""}${rm}`; })() },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 7, color: "#3a5a3a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>{item.label}</p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#e8e0ce", margin: 0 }}>{item.val}</p>
                </div>
              )) : <p style={{ fontSize: 10, color: "#3a5a3a", margin: "0 auto" }}>Select your fasting window below</p>}
            </div>
          </>
        ) : (
          <>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 12px" }}>{fastStart ? "Fasting in progress 🌙" : "Start your fast"}</p>
            <div style={{ position: "relative", width: 148, height: 148, margin: "0 auto 12px" }}>
              <svg width="148" height="148" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="74" cy="74" r="62" fill="none" stroke="rgba(168,120,152,0.12)" strokeWidth="10" />
                <circle cx="74" cy="74" r="62" fill="none" stroke="url(#wGrad)" strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - (fastStart ? Math.min(progress, 1) : 0))}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
                <defs>
                  <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A87898"/>
                    <stop offset="100%" stopColor="#C4A0BA"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#6B4E5E", margin: 0, lineHeight: 1 }}>{fastStart ? fmtTime(elapsed) : "00:00:00"}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 9, color: "#b8a0b0", margin: "4px 0 0", letterSpacing: "0.04em" }}>
                  {fastStart ? (() => { const end = new Date(fastStart + goalHours * 3600000); const h = end.getHours() % 12 || 12; const m = end.getMinutes(); const ap = end.getHours() >= 12 ? "pm" : "am"; return `ends ${h}:${m < 10 ? "0" : ""}${m}${ap}`; })() : "ready"}
                </p>
                {fastStart && <p style={{ fontFamily: "sans-serif", fontSize: 8, color: "#A87898", margin: "3px 0 0" }}>{Math.round(progress * 100)}% ✦</p>}
              </div>
            </div>
          </>
        )}
        {fastStart ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={stopFast} style={{ ...s.btn, background: mode === "fast" ? "linear-gradient(135deg,#1a3a2a,#2D5A3D)" : "linear-gradient(135deg,#8B5E7A,#7D5490)", color: mode === "fast" ? "#C9A84C" : "#fff", flex: 1, letterSpacing: mode === "fast" ? "0.06em" : "0" }}>
              {mode === "fast" ? "END FAST ›" : "End Fast ✦"}
            </button>
            <button onClick={() => setShowEditFast(!showEditFast)} style={{ background: mode === "fast" ? "rgba(184,148,60,0.06)" : "#F0F6F0", border: mode === "fast" ? "0.5px solid rgba(184,148,60,0.3)" : "0.5px solid #C5D9C5", borderRadius: mode === "fast" ? 5 : 50, padding: "0 16px", fontFamily: "sans-serif", fontSize: 13, color: mode === "fast" ? "#C9A84C" : "#5C7F60", cursor: "pointer" }}>✏️</button>
          </div>
        ) : (
          <button onClick={startFast} style={{ ...s.btn, background: mode === "fast" ? "rgba(184,148,60,0.06)" : "linear-gradient(135deg,#8B5E7A,#7D5490)", color: mode === "fast" ? "#C9A84C" : "#fff", border: mode === "fast" ? "0.5px solid rgba(184,148,60,0.3)" : "none", letterSpacing: mode === "fast" ? "0.1em" : "0", opacity: goalHours ? 1 : 0.5 }}>
            {mode === "fast" ? "BEGIN FAST ›" : "Begin Fast 🌙"}
          </button>
        )}
        {showEditFast && fastStart && (
          <div style={{ background: "#F8FAF8", borderRadius: 16, padding: "16px", border: "0.5px solid #dce8dc", marginTop: 8 }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#2D3B2E", margin: "0 0 12px" }}>Edit your fast</p>
            
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Fast start date</p>
            <input
              type="date"
              defaultValue={fastStart ? new Date(fastStart).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
              min={new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0]}
              onChange={e => {
                const currentTime = fastStart ? new Date(fastStart).toTimeString().slice(0,5) : "00:00";
                const newStart = new Date(e.target.value + "T" + currentTime).getTime();
                setFastStart(newStart);
                localStorage.setItem("lf_fast_start", newStart);
              }}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "0.5px solid #dce8dc", fontFamily: "sans-serif", fontSize: 13, color: "#2D3B2E", background: "#fff", marginBottom: 12 }}
            />

            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Fast start time</p>
            <input
              type="time"
              defaultValue={fastStart ? new Date(fastStart).toTimeString().slice(0,5) : "00:00"}
              onChange={e => {
                const currentDate = fastStart ? new Date(fastStart).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
                const newStart = new Date(currentDate + "T" + e.target.value).getTime();
                setFastStart(newStart);
                localStorage.setItem("lf_fast_start", newStart);
              }}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "0.5px solid #dce8dc", fontFamily: "sans-serif", fontSize: 13, color: "#2D3B2E", background: "#fff", marginBottom: 12 }}
            />

            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Goal hours</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[12, 14, 16, 18, 20, 24].map(h => (
                <button key={h} onClick={() => setGoalHours(h)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "0.5px solid #dce8dc", background: goalHours === h ? "#7A9E7E" : "#fff", color: goalHours === h ? "#fff" : "#4a5a4b", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer" }}>{h}h</button>
              ))}
            </div>
            <button onClick={() => setShowEditFast(false)} style={{ ...s.btn, fontSize: 13, padding: "10px 0" }}>Save changes</button>
          </div>
        )}
      </div>

      {/* Hormone card — changes based on mode */}
      {mode === "fast" ? (
        <div style={{ margin: "0 16px 12px", background: "linear-gradient(135deg, #1a3a2a, #0f2a1a)", borderRadius: 18, padding: "16px", border: "1px solid rgba(122,158,126,0.3)" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 9, letterSpacing: "2px", color: "#7A9E7E", margin: "0 0 6px", textTransform: "uppercase" }}>⚡ Testosterone Window</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>
                {new Date().getHours() < 10 ? "Peak 🔥" : new Date().getHours() < 14 ? "High ⚡" : new Date().getHours() < 18 ? "Moderate 🌿" : "Low 🌙"}
              </p>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#A8BEA8", margin: 0 }}>
                {new Date().getHours() < 10 ? "Best time to train and tackle hard tasks" : new Date().getHours() < 14 ? "Focus work and key decisions" : new Date().getHours() < 18 ? "Meetings and collaborative work" : "Wind down and recover"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
            {[
              { label: "Peak", time: "6-10am", active: new Date().getHours() < 10 },
              { label: "High", time: "10-2pm", active: new Date().getHours() >= 10 && new Date().getHours() < 14 },
              { label: "Mod", time: "2-6pm", active: new Date().getHours() >= 14 && new Date().getHours() < 18 },
              { label: "Low", time: "6pm+", active: new Date().getHours() >= 18 },
            ].map((w, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 4, borderRadius: 2, background: w.active ? "#7A9E7E" : "rgba(122,158,126,0.2)", marginBottom: 4, boxShadow: w.active ? "0 0 6px #7A9E7E" : "none" }} />
                <p style={{ fontFamily: "sans-serif", fontSize: 9, color: w.active ? "#7A9E7E" : "#4a6a4a", margin: 0 }}>{w.label}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 8, color: "#3a5a3a", margin: 0 }}>{w.time}</p>
              </div>
            ))}
          </div>
          {goalHours > 0 && fastStart && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(122,158,126,0.2)" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#7A9E7E", margin: 0 }}>
                🍽️ Eating window: {new Date(fastStart + goalHours * 3600000).toLocaleTimeString("en-CA", {hour: "numeric", minute: "2-digit"})} — {new Date(fastStart + (goalHours + 8) * 3600000).toLocaleTimeString("en-CA", {hour: "numeric", minute: "2-digit"})}
              </p>
            </div>
          )}
        </div>
      ) : null}

      {/* Water tracker - fasting mode only - now handled above for both */}
      {false && (
        <div style={{ margin: "0 16px 12px", background: "#fff", borderRadius: 18, padding: "14px 16px", border: "0.5px solid #dce8dc" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "1px", color: "#7BA8C9", margin: 0, textTransform: "uppercase" }}>💧 Water today</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#A8BEA8", margin: 0 }}>Goal: 8 glasses</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <button onClick={() => { const w = Math.max(0, waterToday - 1); localStorage.setItem("lf_water_today", w); setWaterToday(w); }} style={{ width: 32, height: 32, borderRadius: "50%", border: "0.5px solid #dce8dc", background: "#EAF2F9", fontSize: 16, cursor: "pointer", color: "#7BA8C9" }}>−</button>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 26, color: "#7BA8C9", margin: 0 }}>{waterToday}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#A8BEA8", margin: 0 }}>glasses</p>
            </div>
            <button onClick={() => { const w = Math.min(15, waterToday + 1); localStorage.setItem("lf_water_today", w); setWaterToday(w); }} style={{ width: 32, height: 32, borderRadius: "50%", border: "0.5px solid #dce8dc", background: "#EAF2F9", fontSize: 16, cursor: "pointer", color: "#7BA8C9" }}>+</button>
          </div>
          <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < waterToday ? "#7BA8C9" : "#EAF2F9" }} />
            ))}
          </div>
        </div>
      )}

      {/* Level cards */}
      <div style={{ display: "flex", gap: 8, margin: "0 16px 12px" }}>
        {[{ h: 12, icon: "🌱", label: "Beginner" }, { h: 16, icon: "🌿", label: "Intermediate" }, { h: 18, icon: "🔥", label: "Advanced" }].map(({ h, icon, label }) => (
          <div key={h} onClick={() => setGoalHours(h)} style={{
            flex: 1, background: goalHours === h ? (mode === "fast" ? "rgba(26,58,42,0.9)" : "rgba(212,160,184,0.1)") : (mode === "fast" ? "rgba(255,255,255,0.05)" : "#fff"),
            border: goalHours === h ? (mode === "fast" ? "1.5px solid #7A9E7E" : "1.5px solid #D4A0B8") : (mode === "fast" ? "1px solid rgba(122,158,126,0.2)" : "1px solid #dce8dc"),
            borderRadius: 16, padding: "12px 8px", textAlign: "center", cursor: "pointer",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 600, color: goalHours === h ? (mode === "fast" ? "#7A9E7E" : "#A0607A") : (mode === "fast" ? "#A8BEA8" : "#4a5a4b"), letterSpacing: "0.02em" }}>{label}</div>
            <div style={{ fontFamily: "sans-serif", fontSize: 10, color: "#A8BEA8", marginTop: 2 }}>{h}h</div>
          </div>
        ))}
      </div>

      {/* Partner rhythm card */}
      {settings && settings.partnerConnected && (
        <div style={{ margin: "0 16px 12px", background: "#F5F0FF", borderRadius: 18, padding: "14px 16px", border: "0.5px solid #D4C5E9" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 10, letterSpacing: "2px", color: "#9B7BC9", margin: 0, textTransform: "uppercase" }}>🤝 Partner rhythm</p>
            <span style={{ fontSize: 10, color: "#9B7BC9", fontFamily: "sans-serif" }}>Connected</span>
          </div>
          {mode === "cycle" ? (
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: 0 }}>Your partner can see your cycle phase and fasting window. Share Lumen Flow with them to sync.</p>
          ) : (
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: 0 }}>Your partner can see your fasting progress and testosterone window. You are fasting together! 🔥</p>
          )}
        </div>
      )}

      {/* Water tracker - both modes */}
      <div style={{ margin: "0 16px 12px", background: mode === "fast" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)", borderRadius: 18, padding: "14px 16px", border: mode === "fast" ? "0.5px solid rgba(184,148,60,0.15)" : "0.5px solid rgba(160,120,145,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, letterSpacing: "1px", color: mode === "fast" ? "#C9A84C" : "#A87898", margin: 0, textTransform: "uppercase" }}>💧 Water today</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: mode === "fast" ? "#3a5a3a" : "#b8a0b0", margin: 0 }}>Goal: 8 glasses</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
          <button onClick={() => { const w = Math.max(0, waterToday - 1); localStorage.setItem("lf_water_today", w); setWaterToday(w); }} style={{ width: 32, height: 32, borderRadius: mode === "fast" ? 5 : "50%", border: mode === "fast" ? "0.5px solid rgba(184,148,60,0.3)" : "0.5px solid rgba(160,120,145,0.2)", background: mode === "fast" ? "rgba(184,148,60,0.06)" : "rgba(168,120,152,0.08)", fontSize: 16, cursor: "pointer", color: mode === "fast" ? "#C9A84C" : "#A87898" }}>−</button>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 26, color: mode === "fast" ? "#e8e0ce" : "#6B4E5E", margin: 0 }}>{waterToday}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 10, color: mode === "fast" ? "#3a5a3a" : "#b8a0b0", margin: 0 }}>glasses</p>
          </div>
          <button onClick={() => { const w = Math.min(15, waterToday + 1); localStorage.setItem("lf_water_today", w); setWaterToday(w); }} style={{ width: 32, height: 32, borderRadius: mode === "fast" ? 5 : "50%", border: mode === "fast" ? "0.5px solid rgba(184,148,60,0.3)" : "0.5px solid rgba(160,120,145,0.2)", background: mode === "fast" ? "rgba(184,148,60,0.06)" : "rgba(168,120,152,0.08)", fontSize: 16, cursor: "pointer", color: mode === "fast" ? "#C9A84C" : "#A87898" }}>+</button>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ flex: 1, height: mode === "fast" ? 3 : 5, borderRadius: 2, background: i < waterToday ? (mode === "fast" ? "#C9A84C" : "#A87898") : (mode === "fast" ? "rgba(184,148,60,0.08)" : "rgba(168,120,152,0.1)") }} />
          ))}
        </div>
      </div>

      {/* Streak + Badges */}
      <div style={{ padding: "4px 16px 8px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{ background: mode === "fast" ? "rgba(26,58,42,0.9)" : "rgba(212,160,184,0.12)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.4)" : "0.5px solid #D4A0B8", borderRadius: 50, padding: "6px 18px", display: "flex", alignItems: "center", gap: 6, fontFamily: "sans-serif", fontSize: 12, color: mode === "fast" ? "#7A9E7E" : "#A0607A" }}>
            <span style={{ fontSize: 14 }}>🔥</span> {streak} day{streak !== 1 ? "s" : ""} fasting streak
          </div>
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 9, color: mode === "fast" ? "#3a5a3a" : "#b8a0b0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Your badges</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
          {[
            { icon: "🗓️", name: "Streak", prog: `${streak} day${streak !== 1 ? "s" : ""}`, earned: streak > 0 },
            { icon: "⚡", name: "3 Fasts", prog: `${Math.min(totalFasts, 3)} / 3`, earned: totalFasts >= 3 },
            ...(mode !== "fast" ? [{ icon: "🌙", name: "Cycle Mo.", prog: `${Math.min(totalFasts, 1)} / 1`, earned: totalFasts >= 1 }] : []),
            { icon: "💚", name: "Recovery", prog: streak >= 2 ? "Earned" : "Locked", earned: streak >= 2 },
            { icon: "⏰", name: "On Time", prog: totalFasts >= 5 ? "Earned" : `${Math.min(totalFasts, 5)} / 5`, earned: totalFasts >= 5 },
            { icon: "🧘", name: "Listen", prog: streak >= 7 ? "Earned" : `${Math.min(streak, 7)} / 7`, earned: streak >= 7 },
          ].map((b, i) => (
            <div key={i} style={{
              flexShrink: 0,
              background: mode === "fast" ? (b.earned ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.03)") : (b.earned ? "rgba(168,120,152,0.08)" : "rgba(255,255,255,0.6)"),
              border: mode === "fast" ? (b.earned ? "0.5px solid rgba(201,168,76,0.3)" : "0.5px solid rgba(184,148,60,0.1)") : (b.earned ? "0.5px solid rgba(168,120,152,0.3)" : "0.5px solid rgba(160,120,145,0.15)"),
              borderRadius: mode === "fast" ? 8 : 14, padding: "11px 12px", textAlign: "center", minWidth: 76,
            }}>
              <div style={{ fontSize: 19, marginBottom: 4, opacity: b.earned ? 1 : 0.25 }}>{b.icon}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 9, color: mode === "fast" ? (b.earned ? "#C9A84C" : "#3a5a3a") : (b.earned ? "#7D5470" : "#b8a0b0"), fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>{b.name}</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 9, color: mode === "fast" ? "#3a5a3a" : "#b8a0b0", marginTop: 2 }}>{b.prog}</div>
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
function CheckInScreen({ mode, onNavigate, onNourishDigestion }) {
  const today = new Date().toISOString().split("T")[0];
  const key   = `lf_checkin_${today}`;
  const autoSave = (() => { try { return JSON.parse(localStorage.getItem("lf_settings"))?.autoSave; } catch (e) { return false; } })();

  const autoSaveData = (updates) => {
    if (!autoSave) return;
    try {
      const existing = JSON.parse(localStorage.getItem(key)) || {};
      localStorage.setItem(key, JSON.stringify({ ...existing, ...updates, date: today }));
    } catch (e) {}
  };

  const [saved,  setSaved]  = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
  });
  const [energy, setEnergy] = useState(3);
  const [mood,   setMood]   = useState(3);
  const [flow,   setFlow]   = useState("none");
  const [notes,  setNotes]  = useState("");

  const save = () => {
    const data = { energy, mood, flow, notes, date: today, gut, clarity, workout, sleep, water, movement, movements, bodyCheck, weightUnit, namedMood, moodNote, symptoms, bowelCheck: { entries: bowelEntries, didPoopToday: bowelEntries.length > 0 } };
    localStorage.setItem(key, JSON.stringify(data));
    setSaved(data);
  };

  const flowOptions  = ["none","spotting","light","medium","heavy"];
  const gutOptions   = ["good","none","bloating","constipation","diarrhea","cramps","nausea","reflux","gas","sensitive"];
  const [gut, setGut] = useState([]);
  const [clarity, setClarity] = useState(3);
  const [workout, setWorkout] = useState(3);
  const [sleep, setSleep] = useState(3);
  const [water, setWater] = useState(() => parseInt(localStorage.getItem("lf_water_today") || "0"));

  
  const [movement, setMovement] = useState("none");
  const [movements, setMovements] = useState([]);
  const MOVEMENT_TYPES = ["🚶 Walk","🏃 Run","🏋️ Weights","🧘 Yoga","⚡ HIIT","🚴 Cycling","🏊 Swimming","🏀 Sport","💃 Dance","🤸 Stretching","🌀 Mobility","🧘 Pilates","🌿 Yard work","🔨 Carpentry","🎨 Painting","🧹 Cleaning","📦 Moving","🛒 Errands","🪴 Gardening","🛌 None today","🌙 Rest day"];
  const INTENSITIES = ["🌿 Gentle","🚶 Moderate","💪 Strong","🔥 Intense","🌙 Recovery"];
  const DURATIONS = ["5 min","10 min","15 min","20 min","30 min","45 min","60 min","90 min","2 hours","2.5 hours","3 hours","4 hours","5 hours","6 hours","7 hours","8 hours"];
  const DISTANCES = ["0.5 km","1 km","2 km","5 km","10 km"];
  const BODY_FOCUS = ["💪 Upper body","🦵 Lower body","✨ Full body","🔥 Core","❤️ Cardio","🌿 Flexibility","⚖️ Balance","🌙 Recovery"];
  const addMovement = () => setMovements(prev => [...prev, { type: "", intensity: "🌿 Gentle", duration: "20 min", distance: "", bodyFocus: "", lbs: "" }]);
  const updateMovement = (i, field, val) => setMovements(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m));
  const removeMovement = (i) => setMovements(prev => prev.filter((_, idx) => idx !== i));
  const needsDistance = (type) => ["Walk","Run","Cycling","Swimming"].some(t => type.includes(t));
  const needsWeight = (type) => type.includes("Weights");
  const [bodyCheck, setBodyCheck] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [bowelEntries, setBowelEntries] = useState([]);
  const [showBowelForm, setShowBowelForm] = useState(false);
  const [bowelTime, setBowelTime] = useState("");
  const [bowelTexture, setBowelTexture] = useState("");
  const [bowelNotes, setBowelNotes] = useState("");
  const [bowelDate, setBowelDate] = useState(today);
  const ratingEmojis = ["😞","😔","😐","🙂","😄"];
  const [namedMood, setNamedMood] = useState(null);
  const [moodNote, setMoodNote] = useState("");
  const [showMoodNote, setShowMoodNote] = useState(false);
  const [showLogPreview, setShowLogPreview] = useState(false);

  const NAMED_MOODS = {
    "Happy":       { emoji: "😊", color: "#7A9E7E", bg: "#F0F6F0", message: "You're glowing today. Let that energy carry you gently through the day.", actions: ["Open Nourish", "Log a fast", "Add Note"] },
    "Calm":        { emoji: "😌", color: "#7BA8C9", bg: "#EAF2F9", message: "You're in a peaceful place. This is a good time to rest into yourself.", actions: ["Open Nourish", "Add Note"] },
    "Energized":   { emoji: "⚡", color: "#C9A87B", bg: "#FDF6EA", message: "Your energy is high. Use it with intention — move, create, or connect.", actions: ["Log a fast", "Add Note"] },
    "Tired":       { emoji: "😴", color: "#8FA090", bg: "#F0F6F0", message: "Your body is asking for rest. One small gentle choice is enough today.", actions: ["Open Nourish", "Ground Me", "Add Note"] },
    "Sad":         { emoji: "🥺", color: "#9B7BC9", bg: "#F5F0FF", message: "You're feeling tender today. Start with one small supportive choice.", actions: ["Open Nourish", "Ground Me", "Journal Prompt", "Add Note"] },
    "Anxious":     { emoji: "😰", color: "#9B7BC9", bg: "#F5F0FF", message: "Your nervous system needs softness right now. You are safe and you are okay.", actions: ["Ground Me", "Open Nourish", "Add Note"] },
    "Irritated":   { emoji: "😤", color: "#C9A87B", bg: "#FDF6EA", message: "Something is asking for your attention. Be gentle with yourself first.", actions: ["Ground Me", "Open Nourish", "Add Note"] },
    "Emotional":   { emoji: "🥹", color: "#9B7BC9", bg: "#F5F0FF", message: "Feeling deeply is not a weakness. Let yourself feel without judgment.", actions: ["Journal Prompt", "Open Nourish", "Ground Me", "Add Note"] },
    "Unmotivated": { emoji: "😶", color: "#8FA090", bg: "#F0F6F0", message: "Low motivation is often your body asking for something. Rest counts too.", actions: ["Open Nourish", "Ground Me", "Add Note"] },
    "Overwhelmed": { emoji: "😵", color: "#C9A87B", bg: "#FDF6EA", message: "One thing at a time. You don't have to do everything today.", actions: ["Ground Me", "Journal Prompt", "Add Note"] },
  };

  const GROUND_ME = [
    "Take 5 slow deep breaths — in for 4, hold for 4, out for 4.",
    "Put both feet flat on the floor. Feel the ground beneath you.",
    "Name 5 things you can see right now.",
    "Place your hand on your heart and breathe slowly.",
    "Drink a glass of cold water slowly and mindfully.",
    "Step outside for 2 minutes and feel the air.",
    "Unclench your jaw, drop your shoulders, and exhale.",
  ];

  const JOURNAL_PROMPTS = [
    "What is one thing that felt heavy today?",
    "What do you need most right now that you haven't given yourself?",
    "What would you say to a friend feeling the way you feel today?",
    "What is one small thing that brought you comfort today?",
    "What are you carrying that you could put down, even just for today?",
  ];

  const [groundPrompt] = useState(() => GROUND_ME[Math.floor(Math.random() * GROUND_ME.length)]);
  const [journalPrompt] = useState(() => JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);
  const [showGround, setShowGround] = useState(false);
  const [showJournal, setShowJournal] = useState(false);

if (saved) {
    const days7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dk = d.toISOString().split("T")[0];
      const e = localStorage.getItem(`lf_checkin_${dk}`);
      days7.push({ dk, data: e ? (() => { try { return JSON.parse(e); } catch { return null; } })() : null, label: d.toLocaleDateString("en-CA", { weekday: "short" }) });
    }
    const totalMins = (saved.movements || []).reduce((acc, m) => acc + (parseInt(m.duration) || 0), 0);
    const history = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dk = d.toISOString().split("T")[0];
      const e = localStorage.getItem(`lf_checkin_${dk}`);
      if (e) { try { history.push({ ...JSON.parse(e), dk }); } catch {} }
    }
    const insight = (() => {
      const issues = [...(saved.gut || []).filter(g => g !== "good"), ...(saved.symptoms || [])];
      if (issues.length > 0) return `You logged ${issues.slice(0,3).join(", ")} today. Keep things gentle, hydrate, and notice how sleep, food, and your cycle may be shaping how you feel.`;
      if ((saved.energy || 3) >= 4) return `Your energy is ${(saved.energy||3) >= 5 ? "great" : "good"} today! A wonderful time to move, create, or connect with yourself.`;
      return "Every check-in is a small act of self-awareness. You are building a picture of your body over time — that is powerful.";
    })();
    return (
    <div style={{ padding: "16px 16px 100px", fontFamily: "sans-serif", background: mode === "fast" ? "linear-gradient(180deg, #0c1410 0%, #141e16 40%, #0f1a12 100%)" : "linear-gradient(160deg, #E8EAF6 0%, #F3E5F5 35%, #FCE4EC 65%, #FFF8E7 100%)", minHeight: "100vh" }}>
      <div style={{ background: mode === "fast" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)", borderRadius: 20, padding: 20, marginBottom: 16, textAlign: "center", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.3)" : "0.5px solid rgba(180,160,210,0.3)" }}>
        <p style={{ fontSize: 28, marginBottom: 6 }}>✦</p>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#2D3B2E", marginBottom: 4 }}>Today's check-in saved!</p>
        <p style={{ fontSize: 12, color: "#8FA090" }}>Come back tomorrow 🌿</p>
      </div>
      <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 10px" }}>Today's Snapshot ✦</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { label: "⚡ Energy", value: ["Very low","Low","Neutral","Good","Great"][(saved.energy||3)-1] },
          { label: "🌙 Sleep",  value: ["Poor","Light","Fair","Good","Great"][(saved.sleep||3)-1] },
          { label: "💧 Water",  value: `${saved.water||0} glasses` },
          { label: "💭 Mood",   value: saved.namedMood || (saved.namedMoods||[]).slice(0,2).join(", ") || "—" },
        ].map((item,i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #dce8dc", padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: "#8FA090", margin: "0 0 4px" }}>{item.label}</p>
            <p style={{ fontSize: 13, color: "#2D3B2E", fontWeight: 600, margin: 0 }}>{item.value}</p>
          </div>
        ))}
        {mode !== "fast" && saved.flow && saved.flow !== "none" && (
          <div style={{ background: "#FDEAEA", borderRadius: 14, border: "0.5px solid #C97B7B22", padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: "#C97B7B", margin: "0 0 4px" }}>🩸 Flow</p>
            <p style={{ fontSize: 13, color: "#C97B7B", fontWeight: 600, margin: 0, textTransform: "capitalize" }}>{saved.flow}</p>
          </div>
        )}
        {saved.gut && saved.gut.length > 0 && (
          <div style={{ background: "#F5F0FF", borderRadius: 14, border: "0.5px solid rgba(155,123,201,0.2)", padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: "#9B7BC9", margin: "0 0 4px" }}>🦠 Gut</p>
            <p style={{ fontSize: 12, color: "#9B7BC9", fontWeight: 600, margin: 0 }}>{Array.isArray(saved.gut) ? saved.gut.slice(0,2).join(", ") : saved.gut}</p>
          </div>
        )}
        {saved.movements && saved.movements.length > 0 && (
          <div style={{ gridColumn: "1/-1", background: "#fff", borderRadius: 14, border: "0.5px solid #dce8dc", padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: "#8FA090", margin: "0 0 4px" }}>🏃 Movement — {totalMins} min total</p>
            <p style={{ fontSize: 12, color: "#2D3B2E", fontWeight: 600, margin: 0 }}>{saved.movements.map(m => `${m.type} ${m.duration}`).join(" · ")}</p>
          </div>
        )}
        {!saved.movements && saved.movement && saved.movement !== "none" && (
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #dce8dc", padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: "#8FA090", margin: "0 0 4px" }}>🏃 Movement</p>
            <p style={{ fontSize: 13, color: "#2D3B2E", fontWeight: 600, margin: 0, textTransform: "capitalize" }}>{saved.movement}</p>
          </div>
        )}
        {saved.bodyCheck && (
          <div style={{ background: "#fff", borderRadius: 14, border: "0.5px solid #dce8dc", padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: "#8FA090", margin: "0 0 4px" }}>🌿 Body check</p>
            <p style={{ fontSize: 13, color: "#2D3B2E", fontWeight: 600, margin: 0 }}>{saved.bodyCheck} {saved.weightUnit || "lbs"}</p>
          </div>
        )}
        {saved.symptoms && saved.symptoms.length > 0 && (
          <div style={{ background: mode === "fast" ? "rgba(122,158,126,0.1)" : "#FDEAEA", borderRadius: 14, border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.3)" : "0.5px solid rgba(201,123,123,0.2)", padding: "10px 12px" }}>
            <p style={{ fontSize: 10, color: mode === "fast" ? "#7A9E7E" : "#C97B7B", margin: "0 0 4px" }}>🩺 Symptoms</p>
            <p style={{ fontSize: 12, color: mode === "fast" ? "#7A9E7E" : "#C97B7B", fontWeight: 600, margin: 0 }}>{saved.symptoms.slice(0,2).join(", ")}</p>
          </div>
        )}
      </div>
      <button onClick={() => setSaved(null)} style={{ width: "100%", padding: "10px", borderRadius: 50, border: "0.5px solid #dce8dc", background: "#fff", color: "#5C7F60", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", marginBottom: 20 }}>✎ Edit Check-In</button>
      <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 4px" }}>Your Lumen Trends ✦</p>
      <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: "0 0 12px" }}>Last 7 days</p>
      <div style={{ background: "linear-gradient(135deg, #F0F8F0, #fff)", borderRadius: 18, border: "0.5px solid rgba(122,158,126,0.3)", padding: "14px 16px", marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: "#7A9E7E", fontWeight: 600, margin: "0 0 10px" }}>⚡ Energy</p>
        <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
          {days7.map((day, i) => { const val = day.data?.energy || 0; const x = (i/6)*260+20; const y = val ? 70-((val-1)/4)*55 : null; return y ? <circle key={i} cx={x} cy={y} r="4" fill={i===6?"#7A9E7E":"#C5D9C5"} /> : null; })}
          {days7.map((day, i) => { if (i===0) return null; const prev=days7[i-1]; const v1=prev.data?.energy; const v2=day.data?.energy; if (!v1||!v2) return null; const x1=((i-1)/6)*260+20; const y1=70-((v1-1)/4)*55; const x2=(i/6)*260+20; const y2=70-((v2-1)/4)*55; return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C5D9C5" strokeWidth="2" />; })}
          {days7.map((day, i) => <text key={i} x={(i/6)*260+20} y="78" textAnchor="middle" fontSize="8" fill="#A8BEA8">{day.label}</text>)}
        </svg>
      </div>
      <div style={{ background: "linear-gradient(135deg, #F5F0FF, #fff)", borderRadius: 18, border: "0.5px solid rgba(155,123,201,0.3)", padding: "14px 16px", marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: "#9B7BC9", fontWeight: 600, margin: "0 0 10px" }}>🌙 Sleep quality</p>
        <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
          {days7.map((day, i) => { const val = day.data?.sleep || 0; const x = (i/6)*260+20; const y = val ? 70-((val-1)/4)*55 : null; return y ? <circle key={i} cx={x} cy={y} r="4" fill={i===6?"#9B7BC9":"#D4C5E9"} /> : null; })}
          {days7.map((day, i) => { if (i===0) return null; const prev=days7[i-1]; const v1=prev.data?.sleep; const v2=day.data?.sleep; if (!v1||!v2) return null; const x1=((i-1)/6)*260+20; const y1=70-((v1-1)/4)*55; const x2=(i/6)*260+20; const y2=70-((v2-1)/4)*55; return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4C5E9" strokeWidth="2" />; })}
          {days7.map((day, i) => <text key={i} x={(i/6)*260+20} y="78" textAnchor="middle" fontSize="8" fill="#A8BEA8">{day.label}</text>)}
        </svg>
      </div>
      <div style={{ background: "linear-gradient(135deg, #EAF4FF, #fff)", borderRadius: 18, border: "0.5px solid rgba(123,168,201,0.3)", padding: "14px 16px", marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: "#7BA8C9", fontWeight: 600, margin: "0 0 10px" }}>💧 Water intake</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
          {days7.map((day, i) => { const val = Math.min(day.data?.water || 0, 10); return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: "100%", height: `${val ? Math.max(4, val*5) : 4}px`, background: i===6?"#7BA8C9":"#B5D4F4", borderRadius: "4px 4px 0 0" }} />
              <span style={{ fontSize: 8, color: "#A8BEA8" }}>{day.label}</span>
            </div>
          ); })}
        </div>
      </div>
      {saved.movements && saved.movements.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 18, border: "0.5px solid #dce8dc", padding: "14px 16px", marginBottom: 12 }}>
          <p style={{ fontSize: 11, color: "#C9A87B", fontWeight: 600, margin: "0 0 10px" }}>🏃 Movement breakdown</p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="30" fill="none" stroke="#EAF2EA" strokeWidth="12"/>
              {saved.movements.slice(0,4).map((m, i) => { const colors=["#7BA8C9","#7A9E7E","#C9A87B","#9B7BC9"]; const total=saved.movements.reduce((a,mv)=>a+(parseInt(mv.duration)||0),0)||1; const pct=(parseInt(m.duration)||0)/total; const circ=2*Math.PI*30; const off=saved.movements.slice(0,i).reduce((a,mv)=>a+((parseInt(mv.duration)||0)/total)*circ,0); return <circle key={i} cx="40" cy="40" r="30" fill="none" stroke={colors[i]} strokeWidth="12" strokeDasharray={`${pct*circ} ${circ}`} strokeDashoffset={-(off-circ/4)} transform="rotate(-90 40 40)" />; })}
              <text x="40" y="37" textAnchor="middle" fontSize="11" fontWeight="500" fill="#2D3B2E">{totalMins}</text>
              <text x="40" y="49" textAnchor="middle" fontSize="8" fill="#8FA090">min</text>
            </svg>
            <div style={{ flex: 1 }}>
              {saved.movements.slice(0,4).map((m, i) => { const colors=["#7BA8C9","#7A9E7E","#C9A87B","#9B7BC9"]; return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: colors[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#2D3B2E" }}>{m.type || "Activity"}</span>
                  <span style={{ fontSize: 11, color: "#8FA090", marginLeft: "auto" }}>{m.duration}</span>
                </div>
              ); })}
            </div>
          </div>
        </div>
      )}
      <div style={{ background: "#fff", borderRadius: 18, border: "0.5px solid #dce8dc", padding: "14px 16px", marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: mode === "fast" ? "#7A9E7E" : "#C97B7B", fontWeight: 600, margin: "0 0 10px" }}>💭 Mood this week</p>
        <div style={{ display: "flex", gap: 4 }}>
          {days7.map((day, i) => { const moods=day.data?.namedMoods||[]; const moodMap={Happy:"😊",Calm:"😌",Energized:"⚡",Tired:"😴",Sad:"🥺",Anxious:"😰",Irritated:"😤",Emotional:"🥹",Unmotivated:"😶",Overwhelmed:"😵"}; const emoji=moods.length>0?(moodMap[moods[0]]||"🌿"):day.data?.namedMood?(moodMap[day.data.namedMood]||"🌿"):"·"; return (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>{emoji}</div>
              <div style={{ fontSize: 8, color: "#A8BEA8", marginTop: 2 }}>{day.label}</div>
            </div>
          ); })}
        </div>
      </div>
      <div style={{ background: mode === "fast" ? "rgba(255,255,255,0.05)" : "#fff", borderRadius: 18, border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.3)" : "0.5px solid #dce8dc", padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <p style={{ fontSize: 11, color: "#7A9E7E", fontWeight: 600, margin: 0 }}>🚽 Bowel Movement — last 7 days</p>
          <button onClick={() => onNourishDigestion && onNourishDigestion()} style={{ background: "rgba(122,158,126,0.1)", border: "0.5px solid rgba(122,158,126,0.3)", borderRadius: 50, padding: "4px 10px", fontFamily: "sans-serif", fontSize: 10, color: "#7A9E7E", cursor: "pointer" }}>🌱 Get support ›</button>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {days7.map((day, i) => {
            const bowel = day.data?.bowelCheck;
            const entries = bowel?.entries || [];
            const count = entries.length;
            const didPoop = bowel?.didPoopToday || count > 0;
            const textures = entries.map(e => e.texture || "");
            const hasHard = textures.some(t => t.includes("Rocky") || t.includes("pellets") || t.includes("Straining") || t.includes("Painful"));
            const hasLoose = textures.some(t => t.includes("Liquid") || t.includes("Semi-liquid"));
            const color = count === 0 ? "rgba(150,150,150,0.08)" : hasHard ? "#C97B7B" : hasLoose ? "#7BA8C9" : "#7A9E7E";
            const display = count === 0 ? "·" : count > 1 ? `${count}x` : "✅";
            return (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ width: "100%", height: 28, borderRadius: 6, background: color, border: "0.5px solid rgba(150,150,150,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: count > 1 ? 10 : 12, fontWeight: count > 1 ? 700 : 400, color: count > 0 ? "#fff" : "#A8BEA8", fontFamily: "sans-serif" }}>{display}</div>
                <div style={{ fontSize: 8, color: "#A8BEA8", marginTop: 3 }}>{day.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
          {[["#7A9E7E","Normal / Soft"],["#C97B7B","Hard / Straining"],["#7BA8C9","Loose / Liquid"],["#C9A87B","Logged"]].map(([color, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              <span style={{ fontFamily: "sans-serif", fontSize: 9, color: "#6b7b6b" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#F8F0FF", borderRadius: 18, border: "0.5px solid rgba(155,123,201,0.2)", padding: 16, marginBottom: 16 }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#9B7BC9", margin: "0 0 8px" }}>Today's Lumen Note ✦</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#4a5a4b", margin: 0, lineHeight: 1.7 }}>{insight}</p>
      </div>
      {history.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 18, border: "0.5px solid #dce8dc", padding: "14px 16px", marginBottom: 12 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 12px" }}>Recent Check-Ins ✦</p>
          {history.slice(0,3).map((entry, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "0.5px solid #EAF2EA" : "none" }}>
              <div>
                <p style={{ fontSize: 11, color: "#8FA090", margin: "0 0 2px" }}>{new Date(entry.dk + "T12:00:00").toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" })}</p>
                <p style={{ fontSize: 13, color: "#2D3B2E", margin: 0 }}>{["Very low","Low","Neutral","Good","Great"][(entry.energy||3)-1]} · {entry.water||0} glasses</p>
              </div>
              <span style={{ fontSize: 11, color: "#C97B7B", background: "#FDEAEA", padding: "3px 8px", borderRadius: 50 }}>
                {(entry.symptoms||[]).length > 0 ? entry.symptoms[0] : (entry.namedMoods||[])[0] || entry.namedMood || "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
    );
  }
  return (
    <div style={{ padding: "16px 16px 90px", background: mode === "fast" ? "linear-gradient(160deg, #1a2f1e 0%, #1e3524 40%, #162a1a 100%)" : "linear-gradient(160deg, #E8EAF6 0%, #F3E5F5 30%, #FCE4EC 60%, #FFF8E7 100%)", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h3 style={{ ...s.title, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: 0 }}>Daily Check-In {mode !== "fast" ? "🌸" : ""}</h3>
        <button onClick={() => setShowLogPreview(true)} style={{ background: mode === "fast" ? "rgba(201,168,76,0.1)" : "rgba(155,123,201,0.1)", border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.3)" : "0.5px solid rgba(155,123,201,0.3)", borderRadius: 50, padding: "6px 12px", fontFamily: "sans-serif", fontSize: 11, color: mode === "fast" ? "#C9A84C" : "#9B7BC9", cursor: "pointer" }}>📋 View log</button>
      </div>
      <p style={{ ...s.label, marginBottom: 20 }}>How are you feeling today?</p>

      {showLogPreview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowLogPreview(false)}>
          <div style={{ background: mode === "fast" ? "#1a2f1e" : "#fff", borderRadius: 24, padding: 24, width: "100%", maxWidth: 400, position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowLogPreview(false)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#8FA090" }}>✕</button>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: "0 0 16px" }}>📋 Today so far</p>
            {(() => {
              try {
                const existing = JSON.parse(localStorage.getItem(key)) || {};
                if (Object.keys(existing).length === 0) return <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#8FA090", textAlign: "center" }}>Nothing logged yet today.</p>;
                return (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { label: "⚡ Energy", value: existing.energy ? ["Very low","Low","Neutral","Good","Great"][existing.energy-1] : "—" },
                      { label: "🌙 Sleep", value: existing.sleep ? ["Poor","Light","Fair","Good","Great"][existing.sleep-1] : "—" },
                      { label: "💧 Water", value: existing.water ? `${existing.water} glasses` : "—" },
                      { label: "💭 Mood", value: existing.namedMood || "—" },
                      { label: "🚽 Bowel", value: existing.bowelCheck?.entries?.length ? `${existing.bowelCheck.entries.length} logged` : "—" },
                      { label: "🩺 Symptoms", value: existing.symptoms?.length ? existing.symptoms.slice(0,2).join(", ") : "—" },
                      { label: "🌿 Body", value: existing.bodyCheck ? `${existing.bodyCheck} ${existing.weightUnit||"lbs"}` : "—" },
                      { label: "🏃 Movement", value: existing.movements?.length ? `${existing.movements.length} logged` : "—" },
                    ].map((item, i) => (
                      <div key={i} style={{ background: mode === "fast" ? "rgba(255,255,255,0.06)" : "#F8FAF8", borderRadius: 10, padding: "8px 10px", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.2)" : "0.5px solid #dce8dc" }}>
                        <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#8FA090", margin: "0 0 3px" }}>{item.label}</p>
                        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", fontWeight: 600, margin: 0 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                );
              } catch (e) { return null; }
            })()}
            <button onClick={() => setShowLogPreview(false)} style={{ ...s.btn, marginTop: 16, background: mode === "fast" ? "#7A9E7E" : "linear-gradient(135deg, #C4809A, #A87898)", fontSize: 13 }}>Close</button>
          </div>
        </div>
      )}

      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>⚡ Energy</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {ratingEmojis.map((e, i) => (
            <button key={i} onClick={() => setEnergy(i + 1)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 2px", borderRadius: 12, border: `0.5px solid ${energy===i+1?"#7A9E7E":"transparent"}`, background: energy===i+1?"rgba(122,158,126,0.1)":"none", cursor: "pointer" }}>
              <span style={{ fontSize: 24 }}>{e}</span>
              <span style={{ fontSize: 8, color: energy===i+1?"#7A9E7E":"#A8BEA8" }}>{["Very low","Low","Neutral","Good","Great"][i]}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>💭 How are you feeling?</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: namedMood ? 12 : 0 }}>
          {Object.entries(NAMED_MOODS).map(([name, m]) => (
            <button key={name} onClick={() => setNamedMood(namedMood === name ? null : name)} style={{
              padding: "7px 12px", borderRadius: 50, border: "none",
              background: namedMood === name ? m.color : m.bg,
              color: namedMood === name ? "#fff" : m.color,
              fontFamily: "sans-serif", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 5,
            }}><span>{m.emoji}</span>{name}</button>
          ))}
        </div>
        {namedMood && (
          <div style={{ background: NAMED_MOODS[namedMood].bg, borderRadius: 12, padding: "12px 14px", marginTop: 8 }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: NAMED_MOODS[namedMood].color, margin: "0 0 10px", lineHeight: 1.6 }}>{NAMED_MOODS[namedMood].message}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {NAMED_MOODS[namedMood].actions.map((action, i) => (
                <button key={i} onClick={() => {
                  if (action === "Ground Me") setShowGround(!showGround);
                  else if (action === "Journal Prompt") setShowJournal(!showJournal);
                  else if (action === "Open Nourish" && onNavigate) onNavigate("recipes");
                  else if (action === "Add Note") setShowMoodNote(!showMoodNote);
                }} style={{ padding: "6px 12px", borderRadius: 50, border: `0.5px solid ${NAMED_MOODS[namedMood].color}`, background: "#fff", color: NAMED_MOODS[namedMood].color, fontFamily: "sans-serif", fontSize: 11, cursor: "pointer" }}>{action === "Add Note" ? (showMoodNote ? "✕ Close note" : "📝 Add note") : action}</button>
              ))}
            </div>
            {showMoodNote && (
              <div style={{ marginTop: 10 }}>
                <textarea
                  value={moodNote}
                  onChange={e => { setMoodNote(e.target.value); autoSaveData({ moodNote: e.target.value }); }}
                  placeholder="Write how you are feeling right now... this is just for you."
                  spellCheck={true}
                  autoCorrect="on"
                  autoCapitalize="sentences"
                  style={{ ...s.input, height: 80, resize: "none", fontFamily: "sans-serif", marginBottom: 6 }}
                />
                {moodNote && <p style={{ fontFamily: "sans-serif", fontSize: 10, color: NAMED_MOODS[namedMood]?.color || "#8FA090", margin: 0 }}>✅ Note saved with your check-in</p>}
              </div>
            )}
            {showGround && (
              <div style={{ marginTop: 10, background: "#fff", borderRadius: 10, padding: "10px 12px" }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#4a5a4b", margin: 0, lineHeight: 1.7 }}>🌿 {groundPrompt}</p>
              </div>
            )}
            {showJournal && (
              <div style={{ marginTop: 10, background: "#fff", borderRadius: 10, padding: "10px 12px" }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#4a5a4b", margin: 0, lineHeight: 1.7 }}>📝 {journalPrompt}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {mode !== "fast" && (
      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>🩸 Flow</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { val: "none",     label: "None",     emoji: "🚫" },
            { val: "spotting", label: "Spotting", emoji: "🩸" },
            { val: "light",    label: "Light",    emoji: "🩸🩸" },
            { val: "medium",   label: "Medium",   emoji: "🩸🩸🩸" },
            { val: "heavy",    label: "Heavy",    emoji: "🩸🩸🩸🩸" },
          ].map(f => (
            <button key={f.val} onClick={() => setFlow(f.val)} style={{
              padding: "7px 14px", borderRadius: 100, border: "none",
              background: flow === f.val ? "#C97B7B" : "#FDEAEA",
              color: flow === f.val ? "#fff" : "#C97B7B",
              fontFamily: "sans-serif", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4,
            }}><span>{f.emoji}</span> {f.label}</button>
          ))}
        </div>
      </div>
      )}

      {mode !== "fast" && (
      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>🦠 Gut health</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { val: "good",         label: "Good",         emoji: "✅" },
            { val: "bloating",     label: "Bloating",     emoji: "🎈" },
            { val: "constipation", label: "Constipation", emoji: "🚽" },
            { val: "diarrhea",     label: "Diarrhea",     emoji: "💧" },
            { val: "cramps",       label: "Cramps",       emoji: "⚡" },
            { val: "nausea",       label: "Nausea",       emoji: "🤢" },
            { val: "reflux",       label: "Reflux",       emoji: "🔥" },
            { val: "gas",          label: "Gas",          emoji: "💨" },
            { val: "sensitive",    label: "Sensitive",    emoji: "🌿" },
          ].map(g => (
            <button key={g.val} onClick={() => { if (g.val === "good") { setGut(prev => prev.includes("good") ? [] : ["good"]); } else { setGut(prev => { const without = prev.filter(x => x !== "good"); return without.includes(g.val) ? without.filter(x => x !== g.val) : [...without, g.val]; }); } }}
              style={{ padding: "7px 12px", borderRadius: 100, border: "none", background: gut.includes(g.val) ? "#7A9E7E" : "#EAF2EA", color: gut.includes(g.val) ? "#fff" : "#6b7b6b", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              {g.emoji} {g.label}
            </button>
          ))}
        </div>
      </div>
      )}

      {mode === "fast" && (
      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>🧠 Mental clarity</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {ratingEmojis.map((e, i) => (
            <button key={i} onClick={() => setClarity(i + 1)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 2px", borderRadius: 12, border: `0.5px solid ${clarity===i+1?"#7A9E7E":"transparent"}`, background: clarity===i+1?"rgba(122,158,126,0.15)":"none", cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>{e}</span>
              <span style={{ fontSize: 8, color: clarity===i+1?"#7A9E7E":"#A8BEA8" }}>{["Foggy","Low","Fair","Sharp","Peak"][i]}</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {mode === "fast" && (
      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>💪 Workout performance</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {ratingEmojis.map((e, i) => (
            <button key={i} onClick={() => setWorkout(i + 1)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 2px", borderRadius: 12, border: `0.5px solid ${workout===i+1?"#7A9E7E":"transparent"}`, background: workout===i+1?"rgba(122,158,126,0.15)":"none", cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>{e}</span>
              <span style={{ fontSize: 8, color: workout===i+1?"#7A9E7E":"#A8BEA8" }}>{["Poor","Low","Fair","Good","Peak"][i]}</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {mode === "fast" && (
      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>🦠 Gut health</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { val: "good",         label: "Good",         emoji: "✅" },
            { val: "bloating",     label: "Bloating",     emoji: "🎈" },
            { val: "constipation", label: "Constipation", emoji: "🚽" },
            { val: "diarrhea",     label: "Diarrhea",     emoji: "💧" },
            { val: "nausea",       label: "Nausea",       emoji: "🤢" },
            { val: "reflux",       label: "Reflux",       emoji: "🔥" },
            { val: "gas",          label: "Gas",          emoji: "💨" },
            { val: "sensitive",    label: "Sensitive",    emoji: "🌿" },
          ].map(g => (
            <button key={g.val} onClick={() => { if (g.val === "good") { setGut(prev => prev.includes("good") ? [] : ["good"]); } else { setGut(prev => { const without = prev.filter(x => x !== "good"); return without.includes(g.val) ? without.filter(x => x !== g.val) : [...without, g.val]; }); } }}
              style={{ padding: "7px 12px", borderRadius: 100, border: "none", background: gut.includes(g.val) ? "#7A9E7E" : "#EAF2EA", color: gut.includes(g.val) ? "#fff" : "#6b7b6b", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              {g.emoji} {g.label}
            </button>
          ))}
        </div>
      </div>
      )}

      {mode === "fast" && (
      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>🩺 Symptoms</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: "0 0 10px" }}>Select all that apply today</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { val: "none",          label: "None today",     emoji: "✅" },
            { val: "headache",      label: "Headache",       emoji: "🤕" },
            { val: "fatigue",       label: "Fatigue",        emoji: "🔋" },
            { val: "brain fog",     label: "Brain fog",      emoji: "🧠" },
            { val: "insomnia",      label: "Insomnia",       emoji: "😴" },
            { val: "muscle soreness", label: "Muscle soreness", emoji: "💪" },
            { val: "back pain",     label: "Back pain",      emoji: "🔙" },
            { val: "irritability",  label: "Irritability",   emoji: "😤" },
            { val: "nausea",        label: "Nausea",         emoji: "🤢" },
          ].map(sym => {
            const isOn = symptoms.includes(sym.val);
            return (
              <button key={sym.val} onClick={() => setSymptoms(prev => prev.includes(sym.val) ? prev.filter(x => x !== sym.val) : [...prev, sym.val])}
                style={{ padding: "7px 12px", borderRadius: 100, border: "none", background: isOn ? "rgba(122,158,126,0.3)" : "rgba(122,158,126,0.08)", color: isOn ? "#a8d4a8" : "#7A9E7E", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                {sym.emoji} {sym.label}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {mode !== "fast" && (
      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>🩺 Symptoms</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: "0 0 10px" }}>Select all that apply today</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { val: "none",              label: "None today",        emoji: "✅" },
            { val: "cramps",            label: "Cramps",            emoji: "⚡" },
            { val: "headache",          label: "Headache",          emoji: "🤕" },
            { val: "breast tenderness", label: "Breast tenderness", emoji: "💗" },
            { val: "back pain",         label: "Back pain",         emoji: "🔙" },
            { val: "acne",              label: "Acne",              emoji: "🌋" },
            { val: "bloating",          label: "Bloating",          emoji: "🎈" },
            { val: "insomnia",          label: "Insomnia",          emoji: "🌙" },
            { val: "fatigue",           label: "Fatigue",           emoji: "🔋" },
            { val: "nausea",            label: "Nausea",            emoji: "🤢" },
            { val: "hot flashes",       label: "Hot flashes",       emoji: "🔥" },
            { val: "irritability",      label: "Irritability",      emoji: "😤" },
            { val: "brain fog",         label: "Brain fog",         emoji: "🧠" },
          ].map(sym => (
            <button key={sym.val} onClick={() => setSymptoms(prev => prev.includes(sym.val) ? prev.filter(x => x !== sym.val) : [...prev, sym.val])} style={{
              padding: "7px 12px", borderRadius: 100, border: "none",
              background: symptoms.includes(sym.val) ? "#C97B7B" : "#FDEAEA",
              color: symptoms.includes(sym.val) ? "#fff" : "#C97B7B",
              fontFamily: "sans-serif", fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4,
            }}>{sym.emoji} {sym.label}</button>
          ))}
        </div>
      </div>
      )}

      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>🌙 Sleep quality</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {["😴","😪","😐","🙂","✨"].map((e, i) => (
            <button key={i} onClick={() => setSleep(i + 1)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 2px", borderRadius: 12, border: `0.5px solid ${sleep===i+1?"#9B7BC9":"transparent"}`, background: sleep===i+1?"rgba(155,123,201,0.1)":"none", cursor: "pointer" }}>
              <span style={{ fontSize: 24 }}>{e}</span>
              <span style={{ fontSize: 8, color: sleep===i+1?"#9B7BC9":"#A8BEA8" }}>{["Poor","Light","Fair","Good","Great"][i]}</span>
            </button>
          ))}
        </div>
        
      </div>

      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 4px" }}>🏃 Movement</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: "0 0 12px" }}>Log each activity separately</p>
        {movements.map((m, i) => (
          <div key={i} style={{ background: "#F0F6F0", borderRadius: 14, border: "0.5px solid #dce8dc", padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <select value={m.type} onChange={e => updateMovement(i,"type",e.target.value)}
                style={{ flex: 1, padding: "7px 10px", borderRadius: 10, border: "0.5px solid #dce8dc", background: "#fff", fontFamily: "sans-serif", fontSize: 13, color: "#2D3B2E", marginRight: 8 }}>
                <option value="">Select activity</option>
                {MOVEMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={() => removeMovement(i)} style={{ fontSize: 10, color: "#C97B7B", background: "#FDEAEA", border: "none", borderRadius: 50, padding: "4px 10px", cursor: "pointer", fontFamily: "sans-serif" }}>Remove</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <p style={{ fontSize: 9, color: "#8FA090", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Intensity</p>
                <select value={m.intensity} onChange={e => updateMovement(i,"intensity",e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 10, border: "0.5px solid #dce8dc", background: "#fff", fontFamily: "sans-serif", fontSize: 12, color: "#2D3B2E" }}>
                  {INTENSITIES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <p style={{ fontSize: 9, color: "#8FA090", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Duration</p>
                <select value={m.duration} onChange={e => updateMovement(i,"duration",e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 10, border: "0.5px solid #dce8dc", background: "#fff", fontFamily: "sans-serif", fontSize: 12, color: "#2D3B2E" }}>
                  {DURATIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {needsDistance(m.type) && (
                <div>
                  <p style={{ fontSize: 9, color: "#8FA090", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Distance</p>
                  <select value={m.distance} onChange={e => updateMovement(i,"distance",e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 10, border: "0.5px solid #dce8dc", background: "#fff", fontFamily: "sans-serif", fontSize: 12, color: "#2D3B2E" }}>
                    <option value="">Optional</option>
                    {DISTANCES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}
              {needsWeight(m.type) && (
                <div>
                  <p style={{ fontSize: 9, color: "#8FA090", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Weight used</p>
                  <input type="text" value={m.lbs} onChange={e => updateMovement(i,"lbs",e.target.value)} placeholder="e.g. 35 lbs"
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 10, border: "0.5px solid #dce8dc", background: "#fff", fontFamily: "sans-serif", fontSize: 12, color: "#2D3B2E" }} />
                </div>
              )}
              <div style={{ gridColumn: needsDistance(m.type) || needsWeight(m.type) ? "auto" : "1/-1" }}>
                <p style={{ fontSize: 9, color: "#8FA090", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Body focus</p>
                <select value={m.bodyFocus} onChange={e => updateMovement(i,"bodyFocus",e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 10, border: "0.5px solid #dce8dc", background: "#fff", fontFamily: "sans-serif", fontSize: 12, color: "#2D3B2E" }}>
                  <option value="">Select</option>
                  {BODY_FOCUS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
        <button onClick={addMovement} style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px dashed #C5D9C5", background: "none", color: "#7A9E7E", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer" }}>+ Add movement</button>
      </div>

      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>🚽 Bowel Check</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: "0 0 12px" }}>Log each bowel movement separately — you can add as many as needed</p>
        {bowelEntries.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {bowelEntries.map((entry, i) => (
              <div key={i} style={{ background: "#F0F6F0", borderRadius: 12, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#2D3B2E", margin: 0, fontWeight: 600 }}>{entry.texture || "Logged"} · {entry.time || "—"}</p>
                  {entry.notes && <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: "2px 0 0" }}>{entry.notes}</p>}
                </div>
                <button onClick={() => setBowelEntries(prev => prev.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", color: "#C97B7B", fontSize: 11, cursor: "pointer", fontFamily: "sans-serif" }}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setShowBowelForm(!showBowelForm)} style={{ width: "100%", padding: 10, borderRadius: 12, border: "1px dashed #C5D9C5", background: "none", color: "#7A9E7E", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", marginBottom: showBowelForm ? 12 : 0 }}>+ Log bowel movement</button>
        {showBowelForm && (
          <div style={{ background: "#F0F6F0", borderRadius: 14, padding: 12, marginTop: 8 }}>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Which day?</p>
            <input type="date" value={bowelDate} max={today} onChange={e => setBowelDate(e.target.value)} style={{ ...s.input, marginBottom: 12 }} />
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>When?</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {["🌅 Morning","☀️ Afternoon","🌆 Evening","🌙 Night"].map(t => (
                <button key={t} onClick={() => setBowelTime(t)} style={{ padding: "6px 14px", borderRadius: 50, border: "none", background: bowelTime === t ? "#7A9E7E" : "#EAF2EA", color: bowelTime === t ? "#fff" : "#5C7F60", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Texture?</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {["🪨 Rocky / hard","🌰 Small pellets","✅ Normal","🟤 Soft","🫠 Semi-liquid","💧 Liquid","😣 Painful","🚧 Straining"].map(t => (
                <button key={t} onClick={() => setBowelTexture(t)} style={{ padding: "6px 14px", borderRadius: 50, border: "none", background: bowelTexture === t ? "#7A9E7E" : "#EAF2EA", color: bowelTexture === t ? "#fff" : "#5C7F60", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Any notes?</p>
            <input value={bowelNotes} onChange={e => setBowelNotes(e.target.value)} placeholder="Optional — anything you want to remember" style={{ ...s.input, marginBottom: 12 }} />
            <button onClick={() => {
              if (bowelTime || bowelTexture) {
                const entry = { time: bowelTime, texture: bowelTexture, notes: bowelNotes, date: bowelDate };
                if (bowelDate === today) {
                  setBowelEntries(prev => [...prev, entry]);
                } else {
                  const pastKey = `lf_checkin_${bowelDate}`;
                  try {
                    const existing = JSON.parse(localStorage.getItem(pastKey)) || {};
                    const existingEntries = existing.bowelCheck?.entries || [];
                    localStorage.setItem(pastKey, JSON.stringify({ ...existing, date: bowelDate, bowelCheck: { entries: [...existingEntries, entry], didPoopToday: true } }));
                  } catch (e) {}
                }
                setBowelTime("");
                setBowelTexture("");
                setBowelNotes("");
                setBowelDate(today);
                setShowBowelForm(false);
              }
            }} style={{ ...s.btn, fontSize: 13, padding: "10px 0", background: "#7A9E7E" }}>+ Add this entry</button>
          </div>
        )}
      </div>

      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>💧 Water intake</p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
          <button onClick={() => setWater(Math.max(0, water - 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "0.5px solid #dce8dc", background: "#F0F6F0", fontSize: 18, cursor: "pointer" }}>−</button>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 28, color: "#7BA8C9", margin: 0 }}>{water}</p>
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#A8BEA8", margin: 0 }}>glasses today</p>
          </div>
          <button onClick={() => setWater(Math.min(15, water + 1))} style={{ width: 36, height: 36, borderRadius: "50%", border: "0.5px solid #dce8dc", background: "#F0F6F0", fontSize: 18, cursor: "pointer" }}>+</button>
        </div>
      </div>

      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 4px" }}>🌿 Body check</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: "0 0 10px" }}>Your body changes throughout your cycle and fasting journey. This is just a snapshot — not a score.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button onClick={() => setWeightUnit("lbs")} style={{ padding: "6px 14px", borderRadius: 50, border: "none", background: weightUnit === "lbs" ? "#7A9E7E" : "#EAF2EA", color: weightUnit === "lbs" ? "#fff" : "#6b7b6b", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>lbs</button>
          <button onClick={() => setWeightUnit("kg")} style={{ padding: "6px 14px", borderRadius: 50, border: "none", background: weightUnit === "kg" ? "#7A9E7E" : "#EAF2EA", color: weightUnit === "kg" ? "#fff" : "#6b7b6b", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>kg</button>
        </div>
        <input
          type="number"
          value={bodyCheck}
          onChange={e => setBodyCheck(e.target.value)}
          placeholder={`Optional — your body snapshot today (${weightUnit})`}
          style={{ ...s.input, marginBottom: 0 }}
        />
      </div>

      <div style={{ ...s.card, background: mode === "fast" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.72)", border: mode === "fast" ? "0.5px solid rgba(122,158,126,0.25)" : "0.5px solid rgba(180,160,210,0.25)" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8eaf0" : "#2D3B2E", margin: "0 0 12px" }}>📝 Notes</p>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="How are you feeling? Any symptoms?"
          spellCheck={true}
          autoCorrect="on"
          autoCapitalize="sentences"
          style={{ ...s.input, height: 80, resize: "none", fontFamily: "sans-serif" }}
        />
      </div>

      <button onClick={save} style={{ ...s.btn, background: mode === "fast" ? "#8FAF8F" : "linear-gradient(135deg, #C4809A, #A87898)" }}>Save Check-In ✅</button>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CALENDAR SCREEN
// ─────────────────────────────────────────────
function CalendarScreen({ lastPeriod, onSave, onNavigate, cycleLength = 28, periodLength = 7, mode }) {
  const [showMenu, setShowMenu] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);
  const [periodMsg, setPeriodMsg] = useState(null);
  const [showEditCycle, setShowEditCycle] = useState(false);
  const [periodRangesState, setPeriodRangesState] = useState(() => JSON.parse(localStorage.getItem("lf_period_ranges") || "[]"));
  const [editDateInput, setEditDateInput] = useState("");
  const [editCycleLength, setEditCycleLength] = useState(cycleLength);
  const [editPeriodLength, setEditPeriodLength] = useState(periodLength);
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
    <div style={{ padding: "16px 16px 90px", background: mode === "fast" ? "linear-gradient(180deg, #0c1410 0%, #141e16 50%, #1a2a0f 100%)" : "linear-gradient(160deg, #E8EAF6 0%, #F3E5F5 35%, #FCE4EC 65%, #FFF8E7 100%)", minHeight: "100vh" }}>
      {/* Mini Dashboard */}
      {lastPeriod && mode !== "fast" && (
        <div style={{ background: mode === "fast" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)", borderRadius: 18, border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.25)" : "0.5px solid rgba(180,160,200,0.3)", padding: "16px", marginBottom: 14 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: "0 0 12px" }}>Your cycle overview</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ background: "#F8FAF8", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#8FA090", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Last period</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#2D3B2E", margin: 0 }}>{new Date(lastPeriod + "T12:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</p>
            </div>
            <div style={{ background: "#F8FAF8", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#8FA090", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Next period</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#C97B7B", margin: 0 }}>
                {(() => { const next = new Date(lastPeriod); next.setDate(next.getDate() + cycleLength); return next.toLocaleDateString("en-CA", { month: "short", day: "numeric" }); })()}
              </p>
            </div>
            <div style={{ background: "#F8FAF8", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#8FA090", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cycle length</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#2D3B2E", margin: 0 }}>{cycleLength} days</p>
            </div>
            <div style={{ background: "#FDEAEA", borderRadius: 12, padding: "10px 12px" }}>
              <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#C97B7B", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Period length</p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#C97B7B", margin: 0 }}>{periodLength} days</p>
            </div>
          </div>
          {/* Cycle bar chart */}
          <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#8FA090", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Cycle chart</p>
          <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 12 }}>
            <div style={{ width: "25%", background: "#C97B7B" }} title="Menstrual" />
            <div style={{ width: "29%", background: "#7BA8C9" }} title="Follicular" />
            <div style={{ width: "4%", background: "#C9A87B" }} title="Ovulation" />
            <div style={{ width: "42%", background: "#9B7BC9" }} title="Luteal" />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
            {[["#C97B7B","Menstrual","~7d"],["#7BA8C9","Follicular","~8d"],["#C9A87B","Ovulation","~2d"],["#9B7BC9","Luteal","~12d"]].map(([color, name, days]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                <span style={{ fontFamily: "sans-serif", fontSize: 10, color: "#6b7b6b" }}>{name} {days}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); }}
          style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8FAF8F" }}>‹</button>
        <h3 style={{ ...s.title, margin: 0, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E" }}>{MONTHS[month]} {year}</h3>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); }}
          style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#8FAF8F" }}>›</button>
      </div>

      {/* Day of week headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
        {["S","M","T","W","T","F","S"].map((d,i) => (
          <div key={i} style={{ textAlign: "center", fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1" }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div key={calendarKey} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {Array.from({ length: firstDow }).map((_, i) => <div key={`e${i}`} />)}
        {(() => {
          const allPeriodRanges = JSON.parse(localStorage.getItem("lf_period_ranges") || "[]");
          const allFastDays = JSON.parse(localStorage.getItem("lf_fast_days") || "[]");
          return Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const cycDay  = getCycleDayFor(d);
          const phase   = getPhase(cycDay);
          const info    = PHASE_INFO[phase];
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isSel   = d === selDay;
          const fastDays = allFastDays;
          const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const isFasted = fastDays.includes(dateStr);
          const periodRanges = allPeriodRanges;
          const isPeriodDay = periodRanges.some(r => {
            if (!r.start) return false;
            const start = r.start;
            const end = r.end || r.start;
            return dateStr >= start && dateStr <= end;
          });
          const isPredictedPeriod = !isPeriodDay && lastPeriod && (() => {
            const next = new Date(lastPeriod + "T12:00:00");
            next.setDate(next.getDate() + cycleLength);
            const nextStr = next.toISOString().split("T")[0];
            const nextEnd = new Date(lastPeriod + "T12:00:00");
            nextEnd.setDate(nextEnd.getDate() + cycleLength + (periodLength - 1));
            const nextEndStr = nextEnd.toISOString().split("T")[0];
            return dateStr >= nextStr && dateStr <= nextEndStr;
          })();
          return (
            <button key={d} onClick={() => setSelDay(d)} style={{
              aspectRatio: "1", borderRadius: "50%",
              border: isToday ? `2px solid #8FAF8F` : isFasted ? "2px solid #7A9E7E" : "none",
              background: mode === "fast" ? (isSel ? "#7A9E7E" : "#F0F6F0") : isPeriodDay ? (isSel ? "#C97B7B" : "#FDEAEA") : isPredictedPeriod ? (isSel ? "#E8B4B4" : "#FDF0F0") : (isSel ? info.color : info.bg),
              cursor: "pointer", fontFamily: "sans-serif", fontSize: 13,
              color: mode === "fast" ? (isSel ? "#fff" : "#5C7F60") : (isSel ? "#fff" : info.color),
              fontWeight: isToday ? 700 : 400,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{d}</button>
          );
        });
        })()}
      </div>

      {/* Legend */}
      {mode !== "fast" && (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16, paddingTop: 12, borderTop: "1px solid #EAF2EA" }}>
        {Object.entries(PHASE_INFO).map(([name, info]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: info.color }} />
            <span style={{ fontFamily: "sans-serif", fontSize: 11, color: "#6b7b6b" }}>{name}</span>
          </div>
        ))}
      </div>
      )}

      {/* Selected day detail */}
      {mode !== "fast" ? (
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

      ) : (
        <div style={{ background: mode === "fast" ? "rgba(255,255,255,0.06)" : "#fff", borderRadius: 18, border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.25)" : "0.5px solid #dce8dc", padding: "16px", marginTop: 12 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: "0 0 12px" }}>⚡ Fasting overview</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {(() => {
              const fastDays = JSON.parse(localStorage.getItem("lf_fast_days") || "[]");
              const streak = (() => {
                let s = 0;
                const today = new Date();
                while (true) {
                  const d = new Date(today);
                  d.setDate(d.getDate() - s);
                  const str = d.toISOString().split("T")[0];
                  if (fastDays.includes(str)) s++;
                  else break;
                }
                return s;
              })();
              const stats = [
                { label: "Total fasts", value: fastDays.length, icon: "🔥" },
                { label: "Current streak", value: `${streak} days`, icon: "⚡" },
                { label: "This month", value: fastDays.filter(d => d.startsWith(new Date().toISOString().slice(0,7))).length, icon: "📅" },
                { label: "Best window", value: "16h", icon: "⏰" },
              ];
              return stats.map((stat, i) => (
                <div key={i} style={{ background: mode === "fast" ? "rgba(201,168,76,0.08)" : "#F8FAF8", borderRadius: 12, padding: "10px 12px" }}>
                  <p style={{ fontFamily: "sans-serif", fontSize: 10, color: mode === "fast" ? "#C9A84C" : "#8FA090", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.icon} {stat.label}</p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: 0, fontWeight: 600 }}>{stat.value}</p>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Edit Cycle Section */}
      {mode !== "fast" && <div style={{ marginTop: 12 }}>
        <button onClick={() => setShowEditCycle(!showEditCycle)} style={{ background: "none", border: "0.5px solid #dce8dc", borderRadius: 50, padding: "8px 16px", fontFamily: "sans-serif", fontSize: 12, color: "#8FA090", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          ✏️ Edit cycle date {showEditCycle ? "▴" : "▾"}
        </button>
        {showEditCycle && (
          <div style={{ background: "#F8FAF8", borderRadius: 16, padding: "16px", border: "0.5px solid #dce8dc", marginTop: 10 }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#2D3B2E", margin: "0 0 12px" }}>When did your last period start?</p>
            <input
              type="date"
              value={editDateInput}
              onChange={e => setEditDateInput(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              min="2015-01-01"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "0.5px solid #dce8dc", fontFamily: "sans-serif", fontSize: 13, color: "#2D3B2E", background: "#fff", marginBottom: 12 }}
            />
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Cycle length (days)</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[21, 24, 28, 30, 35, 40].map(d => (
                <button key={d} onClick={() => setEditCycleLength(d)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "0.5px solid #dce8dc", background: editCycleLength === d ? "#7A9E7E" : "#fff", color: editCycleLength === d ? "#fff" : "#4a5a4b", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer" }}>{d}</button>
              ))}
            </div>
            <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Period length (days)</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[3, 4, 5, 6, 7, 8].map(d => (
                <button key={d} onClick={() => setEditPeriodLength(d)} style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: "0.5px solid #dce8dc", background: editPeriodLength === d ? "#C97B7B" : "#fff", color: editPeriodLength === d ? "#fff" : "#4a5a4b", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer" }}>{d}</button>
              ))}
            </div>
            <button onClick={() => { if (editDateInput) { onSave && onSave(editDateInput, editCycleLength, editPeriodLength); setShowEditCycle(false); setPeriodMsg("✅ Cycle date updated!"); setTimeout(() => setPeriodMsg(null), 3000); }}} style={{ background: "#7A9E7E", border: "none", borderRadius: 50, padding: "10px 0", width: "100%", fontFamily: "sans-serif", fontSize: 13, color: "#fff", cursor: "pointer", fontWeight: 600 }}>
              Save cycle date
            </button>
          </div>
        )}
      </div>}
      {/* Floating + button */}
      {showMenu && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} onClick={() => setShowMenu(false)} />
      )}
      <div style={{ position: "fixed", bottom: 140, right: 20, zIndex: 999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
        {showMenu && (
          <div style={{ background: "#fff", borderRadius: 18, padding: "8px 0", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", border: "0.5px solid #dce8dc", minWidth: 200 }}>
            {mode !== "fast" ? (
              <>
                <button onClick={() => { const selectedDate = `${year}-${String(month+1).padStart(2,"0")}-${String(selDay).padStart(2,"0")}`; const displayDate = new Date(selectedDate + "T12:00:00").toLocaleDateString("en-CA", {month:"long", day:"numeric"}); const ranges = JSON.parse(localStorage.getItem("lf_period_ranges") || "[]"); const isDuplicate = ranges.some(r => r.start === selectedDate); if (!isDuplicate) { ranges.push({ start: selectedDate, end: null, predicted: false }); } const deduped = ranges.filter((r, i, arr) => arr.findIndex(x => x.start === r.start) === i); localStorage.setItem("lf_period_ranges", JSON.stringify(deduped)); setPeriodRangesState(deduped); setCalendarKey(k => k + 1); onSave && onSave(selectedDate); setShowMenu(false); setPeriodMsg(`🩸 Period started ${displayDate}`); setTimeout(() => setPeriodMsg(null), 3000); }} style={{ width: "100%", padding: "12px 20px", background: "none", border: "none", textAlign: "left", fontFamily: "sans-serif", fontSize: 13, color: "#C97B7B", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🩸</span> Period started today
                </button>
                <div style={{ height: 1, background: "#F0F6F0", margin: "0 12px" }} />
                <button onClick={() => { const selectedDate = `${year}-${String(month+1).padStart(2,"0")}-${String(selDay).padStart(2,"0")}`; const displayDate = new Date(selectedDate + "T12:00:00").toLocaleDateString("en-CA", {month:"long", day:"numeric"}); const ranges = JSON.parse(localStorage.getItem("lf_period_ranges") || "[]"); if (ranges.length > 0 && !ranges[ranges.length-1].end) { ranges[ranges.length-1].end = selectedDate; localStorage.setItem("lf_period_ranges", JSON.stringify(ranges)); setPeriodRangesState([...ranges]); } setShowMenu(false); setPeriodMsg(`✅ Period ended ${displayDate}`); setTimeout(() => setPeriodMsg(null), 3000); }} style={{ width: "100%", padding: "12px 20px", background: "none", border: "none", textAlign: "left", fontFamily: "sans-serif", fontSize: 13, color: "#7A9E7E", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>✅</span> Period ended today
                </button>
<div style={{ height: 1, background: "#F0F6F0", margin: "0 12px" }} />
                <button onClick={() => { const ranges = JSON.parse(localStorage.getItem("lf_period_ranges") || "[]"); const filtered = ranges.filter(r => r.start !== `${year}-${String(month+1).padStart(2,"0")}-${String(selDay).padStart(2,"0")}`); localStorage.setItem("lf_period_ranges", JSON.stringify(filtered)); setPeriodRangesState(filtered); setCalendarKey(k => k + 1); setShowMenu(false); setPeriodMsg("🗑️ Period entry removed"); setTimeout(() => setPeriodMsg(null), 3000); }} style={{ width: "100%", padding: "12px 20px", background: "none", border: "none", textAlign: "left", fontFamily: "sans-serif", fontSize: 13, color: "#8FA090", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🗑️</span> Remove period entry
                </button>
                <div style={{ height: 1, background: "#F0F6F0", margin: "0 12px" }} />
              </>
            ) : (
              <>
                <button onClick={() => { setShowMenu(false); localStorage.setItem("lf_auto_start_fast", "true"); onNavigate && onNavigate("home"); }} style={{ width: "100%", padding: "12px 20px", background: "none", border: "none", textAlign: "left", fontFamily: "sans-serif", fontSize: 13, color: "#5C7F60", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>🔥</span> Start a fast
                </button>
                <div style={{ height: 1, background: "#F0F6F0", margin: "0 12px" }} />
              </>
            )}
            <button onClick={() => { setShowMenu(false); onNavigate && onNavigate("checkin"); }} style={{ width: "100%", padding: "12px 20px", background: "none", border: "none", textAlign: "left", fontFamily: "sans-serif", fontSize: 13, color: "#8FA090", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>😊</span> Log mood
            </button>
          </div>
        )}
        {periodMsg && (
          <div style={{ background: "#fff", borderRadius: 50, padding: "8px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", fontFamily: "sans-serif", fontSize: 12, color: "#5C7F60", border: "0.5px solid #C5D9C5" }}>
            {periodMsg}
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} style={{ width: 52, height: 52, borderRadius: "50%", background: mode === "fast" ? "#5C7F60" : "#C97B7B", border: "none", color: "#fff", fontSize: 26, cursor: "pointer", boxShadow: mode === "fast" ? "0 4px 16px rgba(92,127,96,0.4)" : "0 4px 16px rgba(201,123,123,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          +
        </button>
      </div>
    </div>
    );
}

// ─────────────────────────────────────────────
//  LEARN SCREEN
// ─────────────────────────────────────────────
function MoveMapCard({ item, mode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: mode === "fast" ? "rgba(255,255,255,0.05)" : item.bg, borderRadius: 16, border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.15)" : `0.5px solid ${item.color}33`, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8e0ce" : item.color, margin: "0 0 2px" }}>{item.group}</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: mode === "fast" ? "#7A9E7E" : "#8FA090", margin: 0 }}>{item.phase}</p>
        </div>
        <span style={{ fontSize: 18, color: mode === "fast" ? "#C9A84C" : item.color }}>{open ? "▴" : "▾"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: mode === "fast" ? "#C9A84C" : item.color, margin: "0 0 12px", lineHeight: 1.6 }}>⚡ Fasting: {item.fasting}</p>
          {item.exercises.map((ex, i) => (
            <div key={i} style={{ background: mode === "fast" ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: 0 }}>{ex.name}</p>
                <span style={{ fontFamily: "sans-serif", fontSize: 10, color: mode === "fast" ? "#C9A84C" : item.color, background: mode === "fast" ? "rgba(201,168,76,0.1)" : `${item.color}22`, borderRadius: 50, padding: "2px 8px", whiteSpace: "nowrap", marginLeft: 8 }}>{ex.level}</span>
              </div>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: mode === "fast" ? "#7A9E7E" : "#5C7F60", margin: "0 0 4px" }}>🔁 {ex.reps}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: mode === "fast" ? "#a8c4a8" : "#6b7b6b", margin: "0 0 4px" }}>🛠️ {ex.equipment}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: mode === "fast" ? "#a8c4a8" : "#6b7b6b", margin: 0, fontStyle: "italic" }}>💡 {ex.tip}</p>
            </div>
          ))}
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: mode === "fast" ? "#C9A84C" : item.color, margin: "8px 0 0", lineHeight: 1.6 }}>⚠️ {item.note}</p>
        </div>
      )}
    </div>
  );
}

function LearnScreen({ mode }) {
  const [tab, setTab] = useState(mode === "fast" ? "Fasting" : "Phases");
  const tabs = mode === "fast" 
    ? ["Fasting", "Move Map", "Men", "Glossary", "Workouts", "Nutrition", "Cravings", "Grooming", "Gut Health"]
    : ["Fasting", "Move Map", "Phases", "Conditions", "Men", "Glossary", "Workouts", "Nutrition", "Blood Color", "Cravings", "Cycle Guide", "Gut Health"];

  const MOVE_MAP = [
    { group: "🔥 Core", color: "#C9A87B", bg: "#FDF6EA", phase: "All phases — gentler in Menstrual and Luteal", fasting: "Core work is great fasted — low intensity, high focus", exercises: [{ name: "Dead bug", reps: "8–10 reps each side", equipment: "None", level: "Beginner", tip: "Press lower back into floor throughout" }, { name: "Plank hold", reps: "20–40 seconds", equipment: "None", level: "Beginner", tip: "Keep hips level, breathe steadily" }, { name: "Bird dog", reps: "8 reps each side", equipment: "None", level: "Beginner", tip: "Move slowly and with control" }, { name: "Hollow hold", reps: "15–20 seconds", equipment: "None", level: "Intermediate", tip: "Press ribs down, avoid holding your breath" }, { name: "Pallof press", reps: "10 reps each side", equipment: "Resistance band", level: "Intermediate", tip: "Resist rotation — that is the work" }], note: "Avoid heavy core work during heavy flow days. Listen to your body." },
    { group: "🍑 Glutes", color: "#C97B7B", bg: "#FDEAEA", phase: "Best in Follicular and Ovulation — lighter in Luteal and Menstrual", fasting: "Moderate intensity glute work is fine fasted — stay hydrated", exercises: [{ name: "Glute bridge", reps: "15 reps", equipment: "None", level: "Beginner", tip: "Squeeze at the top for 2 seconds" }, { name: "Clamshell", reps: "15 reps each side", equipment: "Optional band", level: "Beginner", tip: "Keep hips stacked, move from the hip not the waist" }, { name: "Side lying leg raise", reps: "12 reps each side", equipment: "None", level: "Beginner", tip: "Slow and controlled beats fast" }, { name: "Hip thrust", reps: "10–12 reps", equipment: "Bench and weight optional", level: "Intermediate", tip: "Drive through heels, not toes" }, { name: "Bulgarian split squat", reps: "8 reps each side", equipment: "Chair or bench", level: "Intermediate", tip: "Keep front knee tracking over toes" }], note: "Heavy glute work near your period may increase cramping for some. Adjust accordingly." },
    { group: "🦵 Legs", color: "#9B7BC9", bg: "#F5F0FF", phase: "Peak performance in Ovulation — gentle in Menstrual", fasting: "Keep leg sessions moderate when fasted — heavy squats fed is better", exercises: [{ name: "Bodyweight squat", reps: "15 reps", equipment: "None", level: "Beginner", tip: "Sit back into hips, chest tall" }, { name: "Reverse lunge", reps: "10 reps each side", equipment: "None", level: "Beginner", tip: "Step back not forward — easier on the knee" }, { name: "Wall sit", reps: "30–45 seconds", equipment: "Wall", level: "Beginner", tip: "Thighs parallel to floor, back flat" }, { name: "Goblet squat", reps: "10–12 reps", equipment: "One weight or bottle", level: "Intermediate", tip: "Keep elbows inside knees at the bottom" }, { name: "Romanian deadlift", reps: "10 reps", equipment: "Weights optional", level: "Intermediate", tip: "Hinge at hips, soft knee, feel the hamstring stretch" }], note: "Leg DOMS can feel worse in the Luteal phase. Reduce volume if you feel unusually sore." },
    { group: "🔙 Back", color: "#7BA8C9", bg: "#EAF2F9", phase: "Good in all phases — keep it gentle in Menstrual", fasting: "Back work is well suited to fasted training — posture focus", exercises: [{ name: "Cat cow stretch", reps: "10 slow cycles", equipment: "None", level: "Beginner", tip: "Breathe in on the arch, out on the round" }, { name: "Superman hold", reps: "8–10 reps, 3 second hold", equipment: "None", level: "Beginner", tip: "Lift from the back not the neck" }, { name: "Resistance band row", reps: "12 reps", equipment: "Resistance band", level: "Beginner", tip: "Pull elbows back, squeeze shoulder blades" }, { name: "Single arm dumbbell row", reps: "10 reps each side", equipment: "One weight", level: "Intermediate", tip: "Keep back flat, pull to hip not shoulder" }, { name: "Lat pulldown", reps: "10–12 reps", equipment: "Cable or band", level: "Intermediate", tip: "Pull bar to chest, lean back slightly" }], note: "If you experience lower back pain during your period, stick to gentle stretching only." },
    { group: "💪 Arms", color: "#7A9E7E", bg: "#F0F6F0", phase: "Great in Follicular and Ovulation — lighter in Luteal", fasting: "Arm work fasted is fine — great for morning sessions", exercises: [{ name: "Wall push up", reps: "12–15 reps", equipment: "Wall", level: "Beginner", tip: "Keep body in a straight line" }, { name: "Bicep curl", reps: "12 reps", equipment: "Weights or water bottles", level: "Beginner", tip: "Slow on the way down — that is where the work happens" }, { name: "Tricep dip", reps: "10 reps", equipment: "Chair", level: "Beginner", tip: "Keep elbows pointing back not out" }, { name: "Hammer curl", reps: "10 reps", equipment: "Weights", level: "Intermediate", tip: "Neutral grip targets forearms and biceps together" }, { name: "Overhead tricep extension", reps: "12 reps", equipment: "One weight", level: "Intermediate", tip: "Keep elbows close to your head" }], note: "Arms are generally safe to train in all cycle phases. Go lighter if fatigue is high." },
    { group: "🏔️ Shoulders", color: "#C9A87B", bg: "#FDF6EA", phase: "Best in Follicular and Ovulation", fasting: "Shoulder work fasted is well tolerated — keep weight moderate", exercises: [{ name: "Shoulder circles", reps: "10 forward, 10 back", equipment: "None", level: "Beginner", tip: "Warm up before any shoulder work" }, { name: "Lateral raise", reps: "12 reps", equipment: "Light weights", level: "Beginner", tip: "Lead with elbows not wrists, stop at shoulder height" }, { name: "Front raise", reps: "10 reps", equipment: "Light weights", level: "Beginner", tip: "Controlled — avoid swinging" }, { name: "Arnold press", reps: "10 reps", equipment: "Weights", level: "Intermediate", tip: "Rotate palms as you press up" }, { name: "Face pull", reps: "12 reps", equipment: "Resistance band", level: "Intermediate", tip: "Pull to face height, elbows high and wide" }], note: "Warm up thoroughly and avoid heavy overhead pressing during high fatigue days." },
    { group: "💎 Chest", color: "#7BA8C9", bg: "#EAF2F9", phase: "Strongest in Follicular and Ovulation", fasting: "Chest work fasted is fine for moderate sessions", exercises: [{ name: "Incline push up", reps: "12–15 reps", equipment: "Elevated surface", level: "Beginner", tip: "Hands on a bench or step — easier than floor" }, { name: "Knee push up", reps: "10–12 reps", equipment: "None", level: "Beginner", tip: "Keep hips down, full range of motion" }, { name: "Chest squeeze", reps: "15 reps", equipment: "None", level: "Beginner", tip: "Press palms together at chest height and hold 2 seconds" }, { name: "Dumbbell chest press", reps: "10–12 reps", equipment: "Weights and floor or bench", level: "Intermediate", tip: "Lower slowly, press up with control" }, { name: "Resistance band chest fly", reps: "12 reps", equipment: "Resistance band", level: "Intermediate", tip: "Slight bend in elbows throughout" }], note: "Chest sensitivity can increase before your period. Reduce pressure or skip if uncomfortable." },
    { group: "✨ Full Body", color: "#8FAF8F", bg: "#EAF2EA", phase: "Best in Ovulation — gentle version in all phases", fasting: "Full body fasted is manageable at low intensity — keep sessions under 30 minutes", exercises: [{ name: "Inchworm", reps: "6–8 reps", equipment: "None", level: "Beginner", tip: "Walk hands out slowly, feel the stretch" }, { name: "Squat to press", reps: "10 reps", equipment: "Light weights optional", level: "Beginner", tip: "Squat down, press up as you stand" }, { name: "Reverse lunge with curl", reps: "8 reps each side", equipment: "Light weights optional", level: "Intermediate", tip: "Curl on the way down, stand tall on the way up" }, { name: "Low impact burpee", reps: "8–10 reps", equipment: "None", level: "Intermediate", tip: "Step feet back instead of jumping — same benefit, gentler on joints" }, { name: "Dumbbell swing", reps: "12 reps", equipment: "One weight", level: "Intermediate", tip: "Hinge at hips, drive with glutes — not a squat" }], note: "Full body sessions are intense. In Menstrual phase, replace with a gentle walk or yoga instead." },
  ];

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

  const FASTING_INFO = mode === "fast" ? [
    { phase: "16:8 Fasting",  tip: "Fast for 16 hours, eat within an 8 hour window. Most popular and sustainable method. Best for beginners and intermediate fasters." },
    { phase: "18:6 Fasting",  tip: "Fast for 18 hours, eat within a 6 hour window. Increases autophagy and fat burning. Best for experienced fasters." },
    { phase: "20:4 Fasting",  tip: "Fast for 20 hours, eat within a 4 hour window. Significant metabolic benefits. Requires strong discipline." },
    { phase: "OMAD",          tip: "One meal a day. Maximum autophagy and simplicity. Only recommended for experienced fasters." },
    { phase: "Peak Window",   tip: "Your testosterone peaks in the morning. Breaking your fast with protein within 30-60 minutes of waking optimises muscle synthesis." },
    { phase: "Sleep Fasting",  tip: "Your longest natural fast happens during sleep. Going to bed slightly hungry extends your fast and boosts overnight growth hormone." },
  ] : [
    { phase: "Menstrual 🌑",  tip: "Shorter windows (12–14h). Your body needs steady energy during bleeding." },
    { phase: "Follicular 🌒", tip: "Rising estrogen supports metabolic flexibility. 14–16h windows feel natural." },
    { phase: "Ovulation 🌕",  tip: "Peak performance phase. 16–18h may feel manageable. Stay hydrated." },
    { phase: "Luteal 🌗",     tip: "Progesterone affects blood sugar. Shorter 12–14h windows feel better." },
  ];

  const WORKOUT_INFO = mode === "fast" ? [
    { phase: "Fasted Training", tip: "Training in a fasted state increases fat oxidation and growth hormone release. Best for low to moderate intensity sessions." },
    { phase: "Fed Training",    tip: "Break your fast 1-2 hours before heavy lifting. Carbs and protein fuel peak performance on compound lifts." },
    { phase: "Morning Peak",    tip: "Testosterone peaks 30-60 minutes after waking. Morning workouts in this window maximise muscle building response." },
    { phase: "Recovery",        tip: "Sleep is when growth hormone peaks naturally. Prioritise 7-9 hours. Poor sleep reduces testosterone by up to 15%." },
  ] : [
    { phase: "Menstrual 🌑",  tip: "Gentle yoga, slow walks, or full rest. Listen above all else." },
    { phase: "Follicular 🌒", tip: "Strength training, cardio, and HIIT workouts thrive now." },
    { phase: "Ovulation 🌕",  tip: "Your absolute peak. Lift heavy, go fast, compete." },
    { phase: "Luteal 🌗",     tip: "Moderate cardio and pilates. Late luteal – slow right down." },
  ];

  const NUTRITION_INFO = mode === "fast" ? [
    { phase: "Break Fast Meal", tip: "Break your fast with protein first — eggs, meat, fish, or Greek yogurt. This triggers muscle protein synthesis and stabilises blood sugar." },
    { phase: "Electrolytes",    tip: "During extended fasts replenish sodium, potassium and magnesium. Add a pinch of sea salt to water or drink bone broth." },
    { phase: "Eating Window",   tip: "Prioritise whole foods — lean proteins, complex carbs, healthy fats and vegetables. Avoid ultra-processed foods that spike insulin." },
    { phase: "Pre-Sleep",       tip: "A small protein-rich snack 2-3 hours before bed supports overnight muscle recovery without disrupting your fasting window." },
  ] : [
    { phase: "Menstrual 🌑",  tip: "Iron-rich foods, warming soups, anti-inflammatory choices." },
    { phase: "Follicular 🌒", tip: "Leafy greens, lean proteins, and fermented foods for estrogen support." },
    { phase: "Ovulation 🌕",  tip: "Cruciferous vegetables to help estrogen clearance." },
    { phase: "Luteal 🌗",     tip: "Magnesium, complex carbs, and B6 to ease PMS." },
  ];

  return (
    <div style={{ padding: "0 0 90px", background: mode === "fast" ? "linear-gradient(180deg, #0c1410 0%, #141e16 100%)" : "linear-gradient(160deg, #F5EDE8 0%, #F9EEF2 40%, #F2EDF5 100%)", minHeight: "100vh" }}>
      <div style={{ padding: "16px 16px 12px" }}>
        <h3 style={{ ...s.title, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E" }}>Learn & Optimise</h3>
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

        {tab === "Move Map" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: mode === "fast" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)", borderRadius: 16, padding: "14px 16px", border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.15)" : "0.5px solid rgba(200,170,180,0.3)" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: "0 0 6px" }}>🗺️ Move Map</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: mode === "fast" ? "#7A9E7E" : "#6b7b6b", margin: 0, lineHeight: 1.7 }}>Select a muscle group to see exercises matched to your cycle phase, energy level, and fasting window.</p>
            </div>
            {MOVE_MAP.map((item, idx) => <MoveMapCard key={idx} item={item} mode={mode} />)}
          </div>
        )}

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
              <div key={i} style={{ background: mode === "fast" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)", borderRadius: 16, padding: "14px 16px", border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.15)" : "0.5px solid rgba(200,170,180,0.3)" }}>
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
              <div key={i} style={{ background: mode === "fast" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)", borderRadius: 16, padding: "14px 16px", border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.15)" : "0.5px solid rgba(200,170,180,0.3)" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: "0 0 6px" }}>{item.title}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: mode === "fast" ? "#7A9E7E" : "#6b7b6b", margin: 0, lineHeight: 1.8, whiteSpace: "pre-line" }}>{item.body}</p>
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
              <div key={i} style={{ background: mode === "fast" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.75)", borderRadius: 16, padding: "14px 16px", border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.15)" : "0.5px solid rgba(200,170,180,0.3)" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: "0 0 6px" }}>{item.title}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 12, color: mode === "fast" ? "#7A9E7E" : "#6b7b6b", margin: 0, lineHeight: 1.8 }}>{item.body}</p>
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

        {tab === "Cycle Guide" && (
          <>
            <div style={{ ...s.card, background: "#F0F6F0", textAlign: "left" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 8px" }}>🌿 How to calculate your cycle length</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.7 }}>Count from the first day of one period to the day before your next period starts. That total number of days is your cycle length.</p>
            </div>
            <div style={{ ...s.card, textAlign: "left" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 10px" }}>📅 Example</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: "0 0 6px", lineHeight: 1.7 }}>Period started: May 1</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: "0 0 6px", lineHeight: 1.7 }}>Next period started: May 29</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#7A9E7E", margin: 0, fontWeight: 600 }}>Cycle length = 28 days ✓</p>
            </div>
            {[
              { length: "21–24 days", label: "Short cycle", color: "#7BA8C9", bg: "#EAF2F9", tip: "Completely normal for some women. Your phases are shorter — especially the follicular phase. Ovulation comes earlier in the month." },
              { length: "25–30 days", label: "Average cycle", color: "#7A9E7E", bg: "#F0F6F0", tip: "The most common cycle length range. A 28-day cycle is the average but anywhere in this range is perfectly healthy." },
              { length: "31–35 days", label: "Longer cycle", color: "#9B7BC9", bg: "#F5F0FF", tip: "Completely normal for many women. Your follicular phase tends to be longer. Ovulation happens later in the month." },
              { length: "36+ days", label: "Extended cycle", color: "#C9A87B", bg: "#FDF6EA", tip: "Can be normal for some women, especially during perimenopause or with conditions like PCOS. Worth tracking patterns over several months." },
              { length: "Irregular", label: "Irregular cycle", color: "#C97B7B", bg: "#FDEAEA", tip: "Cycles that vary by more than 7-9 days each month. Common causes include stress, thyroid issues, PCOS, perimenopause, and significant weight changes. Track your symptoms and speak to a healthcare provider if concerned." },
            ].map((item, i) => (
              <div key={i} style={{ ...s.card, background: item.bg, border: `0.5px solid ${item.color}33`, textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: item.color, margin: 0 }}>{item.label}</p>
                  <span style={{ fontFamily: "sans-serif", fontSize: 11, color: item.color, background: "#fff", borderRadius: 50, padding: "3px 10px" }}>{item.length}</span>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#4a5a4b", margin: 0, lineHeight: 1.6 }}>{item.tip}</p>
              </div>
            ))}
            <div style={{ ...s.card, background: "#F8FAF8", textAlign: "left" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: "0 0 8px" }}>💡 Tips for tracking</p>
              {["Track for at least 3 months to see your personal pattern", "Your cycle may change with age, stress, and life seasons", "Perimenopause can cause cycles to become shorter then longer then irregular", "Lumen Flow learns your pattern the more you log"].map((tip, i) => (
                <p key={i} style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: "0 0 6px", lineHeight: 1.6 }}>🌿 {tip}</p>
              ))}
            </div>
          </>
        )}

        {tab === "Gut Health" && mode !== "fast" && (
          <>
            {[
              { icon: "🦠", title: "Your gut and your cycle", tip: "Hormones directly affect gut motility. Many women experience bloating, constipation, or diarrhea at specific points in their cycle. Progesterone in the luteal phase slows digestion — this is why bloating often peaks before your period." },
              { icon: "🌑", title: "Menstrual phase gut tips", tip: "Prostaglandins that trigger menstruation also affect the bowel — diarrhea and cramping are common. Warm foods, ginger tea, and magnesium can help ease symptoms." },
              { icon: "🌒", title: "Follicular phase gut tips", tip: "Rising estrogen supports a healthier gut environment. This is the best time to introduce new foods and support your microbiome with fermented foods and fibre." },
              { icon: "🌕", title: "Ovulation gut tips", tip: "Some women notice mid-cycle bloating around ovulation due to estrogen peaks. Stay hydrated and eat light anti-inflammatory foods." },
              { icon: "🌗", title: "Luteal phase gut tips", tip: "Progesterone slows gut motility — constipation and bloating are very common. Increase fibre, water, and magnesium. Reduce processed foods and excess salt." },
              { icon: "🥦", title: "Best foods for gut health", tip: "Fermented foods — yogurt, kefir, kimchi, sauerkraut. High fibre foods — oats, legumes, vegetables. Prebiotic foods — garlic, onions, bananas, asparagus. Anti-inflammatory foods — ginger, turmeric, leafy greens." },
              { icon: "🚫", title: "Foods that disrupt gut health", tip: "Ultra-processed foods, excess sugar, artificial sweeteners, alcohol, and low-fibre diets all negatively affect the gut microbiome and can worsen cycle symptoms." },
            ].map((item, i) => (
              <div key={i} style={{ ...s.card, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: 0 }}>{item.title}</p>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{item.tip}</p>
              </div>
            ))}
          </>
        )}

        {tab === "Grooming" && (
          <>
            {[
              { icon: "🧴", title: "Skincare basics", tip: "Cleanse morning and night. Use SPF daily — UV damage is the number one cause of premature aging. Moisturiser is not optional. Start simple: cleanser, moisturiser, SPF." },
              { icon: "💧", title: "Hydration and skin", tip: "Fasting can dehydrate skin. Drink 2-3 litres of water daily. Your skin reflects your hydration — dull skin often means dehydration not ageing." },
              { icon: "😴", title: "Sleep and recovery", tip: "Growth hormone peaks during deep sleep. 7-9 hours is not optional for men who fast and train. Poor sleep raises cortisol, reduces testosterone, and shows on your face." },
              { icon: "🧖", title: "Cold and heat therapy", tip: "Cold showers after training reduce inflammation and boost alertness. Sauna use 2-3 times weekly has been linked to improved cardiovascular health and testosterone levels." },
              { icon: "✂️", title: "Grooming routine", tip: "A consistent grooming routine takes 5 minutes. Trim, moisturise, and stay clean. How you present yourself affects how you feel — and how you perform." },
              { icon: "🦷", title: "Oral health", tip: "Fasting can cause dry mouth and bad breath. Brush twice daily, floss, and use mouthwash. Oral health is directly linked to heart health and testosterone levels." },
              { icon: "🧠", title: "Mental grooming", tip: "Journaling, meditation, and breathwork are not soft — they are performance tools. Stress management directly protects testosterone and supports fasting results." },
            ].map((item, i) => (
              <div key={i} style={{ ...s.card, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: 0 }}>{item.title}</p>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{item.tip}</p>
              </div>
            ))}
          </>
        )}

        {tab === "Gut Health" && mode === "fast" && (
          <>
            {[
              { icon: "🦠", title: "The gut-hormone connection", tip: "Your gut microbiome directly influences testosterone and estrogen levels. A healthy gut produces neurotransmitters that affect mood, energy, and hormonal balance." },
              { icon: "⏰", title: "Fasting and gut health", tip: "Intermittent fasting gives your gut time to rest and repair. The fasting window allows the migrating motor complex to clean the intestinal tract — reducing bloating and improving nutrient absorption." },
              { icon: "🥦", title: "Foods that support gut health", tip: "Fermented foods like yogurt, kimchi, and sauerkraut feed good bacteria. Fibre from vegetables, legumes, and whole grains feeds the microbiome. Diversity matters — eat a variety of plants." },
              { icon: "💧", title: "Hydration and digestion", tip: "Water is essential for digestion. Dehydration slows the gut, causes constipation, and increases inflammation. Drink water consistently throughout your eating window." },
              { icon: "🚫", title: "What disrupts gut health", tip: "Ultra-processed foods, excessive alcohol, antibiotics without probiotics, chronic stress, and poor sleep all damage the gut microbiome. Consistency in diet and sleep matters more than any supplement." },
              { icon: "😤", title: "Stress and the gut", tip: "The gut-brain axis means stress directly affects digestion. Chronic stress increases gut permeability — known as leaky gut — which triggers inflammation and hormonal disruption." },
              { icon: "💊", title: "Supplements worth considering", tip: "Probiotics, prebiotics, and digestive enzymes can support gut health. Magnesium glycinate supports both gut motility and sleep. Always consult a healthcare provider before starting supplements." },
            ].map((item, i) => (
              <div key={i} style={{ ...s.card, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: 0 }}>{item.title}</p>
                </div>
                <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{item.tip}</p>
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

      {/* Social Links */}
      <div style={{ ...s.card, textAlign: "left", marginBottom: 12 }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 12px" }}>Follow us</p>
        <button onClick={() => window.open("https://www.tiktok.com/@lumenfuxapp", "_blank")} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EAF2EA", border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#2D3B2E", cursor: "pointer", marginBottom: 8 }}>
          <span>📱 TikTok <span style={{ fontSize: 12, color: "#8FA090" }}>@lumenfuxapp</span></span>
          <span style={{ color: "#C5D9C5", fontSize: 18 }}>›</span>
        </button>
        <button onClick={() => window.open("https://www.instagram.com/lumenflowapp", "_blank")} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EAF2EA", border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#2D3B2E", cursor: "pointer", marginBottom: 8 }}>
          <span>📸 Instagram <span style={{ fontSize: 12, color: "#8FA090" }}>@lumenflowapp</span></span>
          <span style={{ color: "#C5D9C5", fontSize: 18 }}>›</span>
        </button>
        <button onClick={() => window.open("https://pin.it/103O2xFfi", "_blank")} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EAF2EA", border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#2D3B2E", cursor: "pointer", marginBottom: 8 }}>
          <span>📌 Pinterest <span style={{ fontSize: 12, color: "#8FA090" }}>Lumen Flow</span></span>
          <span style={{ color: "#C5D9C5", fontSize: 18 }}>›</span>
        </button>
      </div>

      {/* Partner Mode */}
      <div style={{ ...s.card, textAlign: "left", marginBottom: 12, background: "#F5F0FF", border: "0.5px solid #D4C5E9" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#9B7BC9", margin: "0 0 4px" }}>🤝 Partner mode</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 14px" }}>Fast together and understand each other's rhythm</p>
        {(() => {
          const code = settings.partnerCode || (() => {
            const newCode = Math.random().toString(36).substring(2,8).toUpperCase();
            setTimeout(() => onSave({...settings, partnerCode: newCode}), 100);
            return newCode;
          })();
          return (
            <div>
              <div style={{ background: "#fff", borderRadius: 12, padding: "14px", textAlign: "center", marginBottom: 12, border: "0.5px solid #D4C5E9" }}>
                <p style={{ fontFamily: "sans-serif", fontSize: 10, color: "#9B7BC9", letterSpacing: "2px", margin: "0 0 6px", textTransform: "uppercase" }}>Your partner code</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, letterSpacing: "8px", color: "#2D3B2E", margin: "0 0 6px" }}>{code}</p>
                <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#8FA090", margin: 0 }}>Share this code with your partner</p>
              </div>
              {!settings.partnerConnected ? (
                <div>
                  <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: "0 0 8px" }}>Enter your partner's code to connect:</p>
                  <input placeholder="Enter 6-digit code" maxLength={6} style={{ ...s.input, marginBottom: 8, textTransform: "uppercase", letterSpacing: "4px", textAlign: "center", fontSize: 18 }}
                    onChange={e => { if (e.target.value.length === 6) onSave({...settings, partnerConnected: e.target.value.toUpperCase()}); }} />
                </div>
              ) : (
                <div>
                  <div style={{ background: "#F0F6F0", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>✅</span>
                      <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#5C7F60", margin: 0 }}>Partner connected — {settings.partnerConnected}</p>
                    </div>
                  </div>
                  <button onClick={() => onSave({...settings, partnerConnected: null})} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "0.5px solid #C97B7B", background: "#fff", color: "#C97B7B", fontFamily: "sans-serif", fontSize: 12, cursor: "pointer" }}>
                    Disconnect partner
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div style={{ ...s.card, textAlign: "left", marginBottom: 12 }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 12px" }}>Legal</p>
        <button onClick={() => setSubScreen("privacy")} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EAF2EA", border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#2D3B2E", cursor: "pointer", marginBottom: 8 }}>
          <span>🔒 Privacy Policy</span><span style={{ color: "#C5D9C5", fontSize: 18 }}>›</span>
        </button>
        <button onClick={() => setSubScreen("terms")} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EAF2EA", border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "sans-serif", fontSize: 14, color: "#2D3B2E", cursor: "pointer" }}>
          <span>📄 Terms of Service</span><span style={{ color: "#C5D9C5", fontSize: 18 }}>›</span>
        </button>
      </div>

      <div style={{ ...s.card, textAlign: "left", marginBottom: 12 }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 4px" }}>💾 Auto-save check-in</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8FA090", margin: "0 0 14px" }}>When on, your check-in saves automatically as you log. Resets at midnight each day.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#2D3B2E" }}>{settings.autoSave ? "✅ Auto-save is on" : "⭕ Auto-save is off"}</span>
          <button onClick={() => onSave({ ...settings, autoSave: !settings.autoSave })} style={{ padding: "8px 18px", borderRadius: 50, border: "none", background: settings.autoSave ? "#7A9E7E" : "#EAF2EA", color: settings.autoSave ? "#fff" : "#5C7F60", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
            {settings.autoSave ? "Turn off" : "Turn on"}
          </button>
        </div>
      </div>

      <div style={{ ...s.card, textAlign: "center" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 4px" }}>⚡ Switch experience</p>
        <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8FA090", margin: "0 0 12px" }}>Currently using: {settings.mode === "fast" ? "Fasting focus" : "Cycle tracking"}</p>
        <button onClick={() => { const newMode = settings.mode === "fast" ? "cycle" : "fast"; onSave({...settings, mode: newMode}); }} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "0.5px solid #dce8dc", background: "#F8FAF8", color: "#4a5a4b", fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
          Switch to {settings.mode === "fast" ? "🌸 Cycle tracking" : "⚡ Fasting focus"}
        </button>
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "#A8BEA8", margin: "8px 0 16px", textAlign: "center" }}>Your data is saved — you can switch back anytime</p>
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

function RecipesScreen({ phase, onNavigate, mode, digestionPreset, onClearDigestionPreset }) {
  const [cravingType, setCravingType] = useState([]);
  const [nourishTab, setNourishTab] = useState("cravings");
  const [nourishSupportFilter, setNourishSupportFilter] = useState(digestionPreset ? "digestion" : null);
  const [cravingOverride, setCravingOverride] = useState(false);

  useEffect(() => {
    if (digestionPreset) {
      setNourishSupportFilter("digestion");
      onClearDigestionPreset && onClearDigestionPreset();
    }
  }, [digestionPreset]);

const CRAVINGS = {
    "Sweet": {
      emoji: "🍰",
      insight: "You may be needing energy, comfort, or a gentle reward. Sweet cravings often show up when you feel emotionally drained, tired, or simply in need of something soft.",
      nourish: ["Greek yogurt with berries, honey, and granola", "Chia pudding with mango or mixed fruit", "Smoothie bowl with banana, nut butter, and seeds", "Cottage cheese with fruit and cinnamon", "Coconut yogurt with mango and toasted coconut", "Banana with peanut or almond butter", "Dates stuffed with almond butter", "Dark chocolate with walnuts or almonds", "A warm chai or golden milk if you want something cozy"],
      pause: ["Drink a glass of water first and wait 5 minutes", "Take 3 slow deep breaths and place your hand on your heart", "Name 3 things you are grateful for right now"],
      romanticize: ["Serve your snack in a pretty bowl with toppings arranged beautifully", "Light a candle and sit somewhere soft and cozy", "Put on music that feels like a warm hug"]
    },
    "Salty": {
      emoji: "🧂",
      insight: "Salty cravings often show up when you feel depleted, stressed, or in need of something grounding and replenishing.",
      nourish: ["Crispy Caesar salad with chicken and parmesan", "Cobb salad with eggs, avocado, chicken, turkey bacon, and greens", "Crackers with tuna, cottage cheese, or avocado", "Roasted chickpeas with sea salt and paprika", "Popcorn with olive oil and sea salt", "Cucumber or carrot sticks with hummus", "Kale chips with sea salt", "Chips plated in a bowl — pair with a protein side so it feels intentional", "Warm soup or bone broth with sea salt"],
      pause: ["Drink a glass of water — salt cravings often come with dehydration", "Place both feet flat on the floor and breathe slowly", "Relax your shoulders and unclench your jaw"],
      romanticize: ["Make soup in your favourite bowl and sit somewhere warm", "Plate your snack like a little spread — make it feel special", "Sit outside if you can, even for 5 minutes"]
    },
    "Crunchy": {
      emoji: "🥨",
      insight: "Crunchy cravings may sometimes be linked to stress or the need to release tension. Your body might be looking for something satisfying and grounding.",
      nourish: ["Crispy chicken breast strips with a dipping sauce", "Kale chips with sea salt", "Roasted chickpeas or edamame", "Apple slices with almond butter", "Carrot, celery, or cucumber with hummus", "Rice cakes with avocado or cottage cheese", "Whole grain crackers with smoked salmon or tuna", "A handful of mixed nuts and seeds", "Chips plated in a bowl — enjoy slowly, pair with protein if needed"],
      pause: ["Shake out your hands and roll your shoulders back", "Take 5 deep breaths through your nose", "Clench your fists tight then release — repeat 3 times"],
      romanticize: ["Arrange your snack on a small board like a little charcuterie moment", "Eat near a window or outside if you can", "Put on a podcast or playlist you love and make it a proper break"]
    },
    "Creamy": {
      emoji: "🍦",
      insight: "Creamy cravings often show up when you need comfort, nourishment, or something deeply satisfying and soothing.",
      nourish: ["Greek yogurt with granola, honey, and berries", "Avocado on sourdough toast with lemon and sea salt", "Smoothie with banana, nut butter, oat milk, and seeds", "Cottage cheese with fruit and a drizzle of honey", "Hummus with warm pita and vegetables", "Warm oatmeal with cream, cinnamon, and berries", "Coconut yogurt with mango and lime zest", "Crispy chicken Caesar salad with creamy yogurt dressing"],
      pause: ["Drink a glass of warm water or herbal tea before eating", "Sit down, breathe slowly, and check in — are you hungry or emotionally reaching?", "Roll your neck gently side to side and drop your shoulders"],
      romanticize: ["Make a beautiful smoothie bowl and take a moment to arrange it", "Eat from a pretty glass or bowl that feels special", "Put on ambient café music and let it feel like a real pause"]
    },
    "Carbs / Pastry": {
      emoji: "🥐",
      insight: "Carb cravings often mean your body needs energy or your heart needs comfort. Both are valid.",
      nourish: ["Sourdough toast with eggs and avocado", "Oatmeal with protein, nuts, and berries", "Sweet potato bowl with eggs or chicken", "Rice bowl with salmon, tofu, or chicken and roasted veg", "Whole grain wrap with turkey, chicken, and greens", "Lentil soup with crusty toast", "Banana protein pancakes", "A warm croissant or pastry — enjoy it slowly and without guilt"],
      pause: ["Ask yourself — am I hungry or am I tired? Both are okay", "Drink a glass of water first and sit quietly for 2 minutes", "Breathe in for 4 counts, hold for 4, out for 4"],
      romanticize: ["Go to a café and enjoy a pastry slowly — no phone, just the moment", "Make toast at home and eat it by a window with a warm drink", "Let it be a real break — intentional and unhurried"]
    },
    "Chocolate": {
      emoji: "🍫",
      insight: "Chocolate cravings are often linked to a need for magnesium, pleasure, or emotional comfort. Your body and mood may both be asking for a gentle lift.",
      nourish: ["A square or two of dark chocolate 70% or higher", "Dark chocolate with almonds or walnuts", "A warm mug of hot cacao or dark hot chocolate", "Cacao energy balls with dates and oats", "Greek yogurt with cacao nibs, honey, and berries", "Chocolate smoothie with banana, cacao powder, and nut butter", "A small chocolate and nut butter snack — plated, enjoyed slowly"],
      pause: ["Savour one piece slowly before reaching for more", "Drink a glass of water alongside it", "Give yourself full permission — eating with guilt adds stress, not joy"],
      romanticize: ["Make a beautiful cup of hot chocolate and sit somewhere cozy", "Pair your chocolate with a book or journal", "Light a candle and make it a proper moment just for you"]
    },
    "Coffee / Café": {
      emoji: "☕",
      insight: "You may be craving atmosphere, ritual, a pause, or simply connection with yourself. This craving is often more about the feeling than the food.",
      nourish: ["Coffee or matcha after eating — not on an empty stomach if you feel sensitive", "Latte with Greek yogurt and berries on the side", "Avocado toast with a poached egg and your favourite drink", "Boiled eggs with fruit and coffee", "Protein smoothie with a matcha latte", "Cottage cheese with fruit and a warm drink", "If you feel shaky, start with food before coffee"],
      pause: ["Ask — do I need energy or do I need a break? Both are valid", "Sit somewhere away from your screen for 10 minutes", "Breathe slowly and let the warmth of the cup ground you"],
      romanticize: ["Go to your favourite café and sit without your phone", "Make a beautiful coffee at home in your best cup", "Journal or read something you love while you drink it"]
    },
    "Full meal": {
      emoji: "🍽️",
      insight: "Your body may genuinely be hungry and asking to be properly nourished. A full meal craving is worth honouring.",
      nourish: ["Rice or grain bowl with salmon, chicken, or tofu and roasted vegetables", "Crispy chicken breast with sweet potato and greens", "Eggs any style with sourdough toast and avocado", "Warm soup with bread and a side salad", "Pasta with olive oil, garlic, and a protein", "Stir fry with vegetables, protein, and rice or noodles", "A plate built with protein, complex carb, and something green"],
      pause: ["Sit down properly before eating — no standing or rushing", "Take 3 slow breaths before your first bite", "Put your phone away and eat without distraction for even 5 minutes"],
      romanticize: ["Set your table even if eating alone — it changes the energy", "Light a candle for your meal", "Cook something you love and let the process be part of the nourishment"]
    },
    "Something else": {
      emoji: "💭",
      insight: "Sometimes what we reach for is not really about food at all. You might be craving connection, rest, stimulation, comfort, or simply a change of scenery.",
      nourish: ["Drink a glass of water first and check in honestly", "Have a small balanced snack if you have not eaten recently", "Try herbal tea and see if the craving shifts", "A small protein snack — boiled egg, nuts, or cottage cheese", "Something warm if you feel emotionally tender"],
      pause: ["Sit quietly and ask — what do I actually need right now?", "Take 5 slow deep breaths and name the feeling", "Go outside for 5 minutes if you can"],
      romanticize: ["Journal for 5 minutes about how you are feeling", "Call or message someone you love", "Do one small thing that brings you genuine joy"]
    },
    "Not sure": {
      emoji: "❓",
      insight: "Not knowing what you want is completely okay. Sometimes your body and mind are just asking you to slow down and check in gently.",
      nourish: ["Start with a glass of water and wait a few minutes", "Have a small snack with protein and something you enjoy", "Try a piece of fruit or something light and see how you feel", "Make a warm drink and see if the craving becomes clearer", "A simple plate — crackers, cheese, fruit — low effort, nourishing"],
      pause: ["Sit somewhere quiet for 5 minutes with no phone", "Take 3 slow breaths and check in with your body", "Stretch gently or shake out your body — sometimes it just needs movement"],
      romanticize: ["Make yourself a warm drink and just sit — no agenda", "Write one sentence about how you feel right now", "Give yourself permission to not know — that is always okay"]
    }
  };

  const craving = cravingType ? CRAVINGS[cravingType] : null;
  const cravingKeys = Object.keys(CRAVINGS);

  return (
    <div style={{ padding: "16px 16px 100px", fontFamily: "sans-serif", background: mode === "fast" ? "linear-gradient(160deg, #0c1410 0%, #141e16 50%, #1a2a0f 100%)" : "linear-gradient(160deg, #E8F5E9 0%, #F8F0F8 40%, #F5EAF0 100%)", minHeight: "100vh" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: mode === "fast" ? "#e8e0ce" : "#2D3B2E", margin: "0 0 4px" }}>Nourish ✨</h2>
      <p style={{ fontSize: 13, color: mode === "fast" ? "#3a5a3a" : "#8FA090", margin: "0 0 16px" }}>Food craving or soul craving?</p>

      {/* Two tappable sections */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={() => setNourishTab("cravings")} style={{
          flex: 1, padding: "12px 8px", borderRadius: 14, border: "none", cursor: "pointer",
          background: nourishTab === "cravings" ? "#7A9E7E" : "#F0F6F0",
          color: nourishTab === "cravings" ? "#fff" : "#4a5a4b",
          fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 600,
        }}>🌿 Craving Decoder</button>
        <button onClick={() => setNourishTab("fasting")} style={{
          flex: 1, padding: "12px 8px", borderRadius: 14, border: "none", cursor: "pointer",
          background: nourishTab === "fasting" ? "#7A9E7E" : "#F0F6F0",
          color: nourishTab === "fasting" ? "#fff" : "#4a5a4b",
          fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 600,
        }}>💧 Fasting Support</button>
      </div>
      {nourishTab === "cravings" && <div style={{ background: mode === "fast" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.75)", borderRadius: 18, padding: "16px", border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.2)" : "0.5px solid rgba(180,160,200,0.3)", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: "#2D3B2E", fontWeight: 600, margin: "0 0 12px" }}>What are you craving right now?</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {cravingKeys.map(key => (
            <button key={key} onClick={() => { setCravingType(prev => Array.isArray(prev) ? (prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]) : [key]); setNourishSupportFilter(null); }} style={{
              padding: "8px 14px", borderRadius: 50, border: "0.5px solid #dce8dc",
              background: (Array.isArray(cravingType) ? cravingType.includes(key) : cravingType === key) ? "#7A9E7E" : "#F8FAF8",
              color: (Array.isArray(cravingType) ? cravingType.includes(key) : cravingType === key) ? "#fff" : "#4a5a4b",
              fontSize: 12, cursor: "pointer", fontFamily: "sans-serif",
              display: "flex", alignItems: "center", gap: 6
            }}>
              <span>{CRAVINGS[key].emoji}</span> {key}
            </button>
          ))}
        </div>
      </div>}
      {nourishTab === "cravings" && Array.isArray(cravingType) && cravingType.length > 0 && (() => {
        const selected = cravingType.map(k => CRAVINGS[k]).filter(Boolean);
        if (!selected.length) return null;
        const allNourish = [...new Set(selected.flatMap(c => c.nourish))].slice(0, 8);
        const allPause = selected[0].pause;
        const allRomanticize = selected[0].romanticize;
        const emojis = selected.map(c => c.emoji).join(" ");
        const insight = selected.length === 1
          ? selected[0].insight
          : `You are craving ${cravingType.join(" + ").toLowerCase()} — your body may be asking for something layered. ${selected[0].insight}`;
        return (
          <div>
            <div style={{ background: "#F0F6F0", borderRadius: 18, padding: "16px", border: "0.5px solid #C5D9C5", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 22 }}>{emojis}</span>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#2D3B2E", margin: 0 }}>Insight</p>
              </div>
              <p style={{ fontSize: 13, color: "#4a5a4b", margin: 0, lineHeight: 1.7 }}>{insight}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px", border: "0.5px solid #dce8dc", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#5C7F60", margin: "0 0 10px" }}>🍵 Nourish — feed the body</p>
              {allNourish.map((item, i) => (
                <p key={i} style={{ fontSize: 13, color: "#4a5a4b", margin: "0 0 6px", lineHeight: 1.6 }}>• {item}</p>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px", border: "0.5px solid #dce8dc", marginBottom: 12 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#7BA8C9", margin: "0 0 10px" }}>💧 Pause — ground yourself</p>
              {allPause.map((item, i) => (
                <p key={i} style={{ fontSize: 13, color: "#4a5a4b", margin: "0 0 6px", lineHeight: 1.6 }}>• {item}</p>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px", border: "0.5px solid #dce8dc", marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#9B7BC9", margin: "0 0 10px" }}>📖 Romanticize — feed the soul</p>
              {allRomanticize.map((item, i) => (
                <p key={i} style={{ fontSize: 13, color: "#4a5a4b", margin: "0 0 6px", lineHeight: 1.6 }}>• {item}</p>
              ))}
            </div>
          </div>
        );
      })()}
      {nourishTab === "fasting" && (
        <div>
          {[
            { icon: "💧", title: "What to drink while fasting", color: "#7BA8C9", bg: "#EAF2F9", tips: ["Water — drink at least 2-3 litres daily", "Black coffee — no milk, no sugar, does not break a fast", "Plain green or herbal tea — no sweeteners", "Sparkling water — fine during fasting", "Bone broth — breaks a fast but great for electrolytes"] },
            { icon: "🧂", title: "Electrolytes during fasting", color: "#C9A87B", bg: "#FDF6EA", tips: ["Add a pinch of sea salt to your water", "Magnesium — helps with energy and sleep", "Potassium — found in coconut water (breaks fast) or supplement", "Sodium — especially important for longer fasts", "Signs you need electrolytes: headache, fatigue, dizziness"] },
            { icon: "🍽️", title: "How to break your fast", color: "#7A9E7E", bg: "#F0F6F0", tips: ["Start with something light — bone broth, eggs, or yogurt", "Avoid heavy carbs as your first meal", "Protein first helps blood sugar stability", "Chew slowly — your digestion needs to wake up gently", "Wait 20 minutes before eating more"] },
            { icon: "⏰", title: "Best fasting windows", color: "#9B7BC9", bg: "#F5F0FF", tips: ["12:12 — great for beginners, fast overnight", "16:8 — most popular, eat between 12pm and 8pm", "18:6 — more fat burning, eat between 2pm and 8pm", "20:4 — advanced, one main meal plus a small window", "Listen to your body — consistency beats perfection"] },
            { icon: "🚫", title: "What breaks a fast", color: "#C97B7B", bg: "#FDEAEA", tips: ["Milk, cream, or sugar in coffee or tea", "Any food — even small amounts trigger insulin", "Juice, smoothies, or flavoured drinks", "Chewing gum with sugar", "BCAA supplements with calories"] },
          ].map((section, i) => (
            <div key={i} style={{ background: mode === "fast" ? "rgba(255,255,255,0.06)" : section.bg, borderRadius: 18, padding: "16px", border: mode === "fast" ? "0.5px solid rgba(201,168,76,0.2)" : `0.5px solid ${section.color}33`, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{section.icon}</span>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: mode === "fast" ? "#C9A84C" : section.color, margin: 0 }}>{section.title}</p>
              </div>
              {section.tips.map((tip, j) => (
                <p key={j} style={{ fontSize: 13, color: mode === "fast" ? "#a8c4a8" : "#4a5a4b", margin: "0 0 6px", lineHeight: 1.6 }}>• {tip}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Hunger checker - fasting mode */}
      {nourishTab === "fasting" && mode === "fast" && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 16, color: "#2D3B2E", margin: "0 0 4px" }}>🧠 Hunger checker</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#8FA090", margin: "0 0 12px" }}>Is this real hunger or fasting hunger?</p>
          {[
            { q: "When did you last eat?", type: "info", tip: "If it has been less than 3 hours your body is likely adjusting not truly hungry." },
            { q: "Drink a full glass of water and wait 10 minutes.", type: "action", tip: "Thirst and hunger feel the same. Most fasting hunger disappears after water." },
            { q: "Where do you feel it?", type: "info", tip: "Real hunger is felt in the stomach. Head hunger or cravings are felt in the mind — you are thinking about food not feeling physical hunger." },
            { q: "Is it getting stronger or staying the same?", type: "info", tip: "Fasting hunger comes in waves and passes. Real hunger builds steadily over time." },
            { q: "Rate your hunger 1-10", type: "info", tip: "Below 4 — likely fasting adjustment. Above 7 — your body may genuinely need fuel. Listen to it." },
          ].map((item, i) => (
            <div key={i} style={{ background: item.type === "action" ? "#F0F6F0" : "#fff", borderRadius: 16, padding: "14px 16px", border: `0.5px solid ${item.type === "action" ? "#C5D9C5" : "#dce8dc"}`, marginBottom: 10 }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#2D3B2E", margin: "0 0 6px" }}>{item.type === "action" ? "💧 " : "❓ "}{item.q}</p>
              <p style={{ fontFamily: "sans-serif", fontSize: 12, color: "#6b7b6b", margin: 0, lineHeight: 1.6 }}>{item.tip}</p>
            </div>
          ))}
        </div>
      )}

      <LumenSuggests mode={mode} selectedCravings={cravingType} supportFilter={nourishSupportFilter} setSupportFilter={setNourishSupportFilter} activeTab={nourishTab} />

      {nourishTab === "cravings" && mode !== "fast" && (
      <div onClick={() => onNavigate && onNavigate("calendar")} style={{ background: "#F8F0FF", borderRadius: 18, padding: "16px", border: "0.5px solid #D4C5E9", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🌙</span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#2D3B2E", margin: "0 0 4px" }}>Cycle reflection</p>
            <p style={{ fontSize: 12, color: "#6b7b6b", margin: 0 }}>What stage of your cycle are you in?</p>
            <p style={{ fontSize: 12, color: "#6b7b6b", margin: 0 }}>Are you tired, stressed, or needing comfort?</p>
          </div>
        </div>
        <span style={{ fontSize: 20, color: "#9B7BC9" }}>›</span>
      </div>
      )}
    </div>
  );
}


      function LumenSuggests({ mode, selectedCravings, supportFilter, setSupportFilter, activeTab }) {
  const supportOptions = [
    { id: "alkaline",   label: "Alkaline-Inspired", icon: "🌿" },
    { id: "juice",      label: "Juice Ideas",        icon: "🍹" },
    { id: "protein",    label: "Protein First",      icon: "🥚" },
    { id: "breakfast",  label: "Break-Fast Meal",    icon: "🍽️" },
    { id: "fasting",    label: "Still Fasting",      icon: "💧" },
    { id: "digestion",  label: "Digestion Support",  icon: "🌱" },
  ];

  const getContext = () => {
    const today = new Date().toISOString().split("T")[0];
    try { return JSON.parse(localStorage.getItem(`lf_checkin_${today}`)) || {}; } catch (e) { return {}; }
  };

  const getFasting = () => {
    const fs = localStorage.getItem("lf_fast_start");
    if (!fs) return null;
    return ((Date.now() - Number(fs)) / 3600000).toFixed(1);
  };

  const getSuggestion = () => {
    const ctx = getContext();
    const hours = getFasting();
    const cravings = selectedCravings || [];
    const filter = supportFilter;
    const has = (...keys) => keys.some(k => cravings.map(c => c.toLowerCase()).some(c => c.includes(k)));

    if (filter === "fasting") return {
      label: "💧 Still Fasting",
      why: "You are fasting — your body is doing great work. Stay supported without breaking your window.",
      items: ["Water — drink consistently throughout your fast", "Plain herbal tea or green tea — no sweeteners", "Black coffee if tolerated", "Sparkling water if you need something different", "A pinch of sea salt in water for electrolytes", "Rest, breathe, and ground yourself", "If you feel weak, shaky, dizzy, or unwell — break your fast and eat first"],
    };

    if (filter === "digestion") {
      const bowel = ctx.bowelCheck;
      const entries = bowel?.entries || [];
      const didPoop = bowel?.didPoopToday || entries.length > 0;
      const noPoop = !didPoop && bowel !== undefined;
      const textures = entries.map(e => e.texture || "").join(" ");
      const hard = textures.includes("Rocky") || textures.includes("pellets") || textures.includes("Straining") || textures.includes("Painful");
      const loose = textures.includes("Semi-liquid") || textures.includes("Liquid");
      const why = noPoop || hard
        ? "Your check-in suggests things may be moving slowly today. These options may gently support your digestion."
        : loose
        ? "Your check-in suggests your digestion may need something settling and nourishing today."
        : "These gentle options may support your digestion today.";
      const items = noPoop || hard ? [
        "Warm water with lemon first thing — may help get things moving",
        "Oatmeal with chia seeds and berries",
        "Prunes or prune juice — a small amount goes a long way",
        "Pear, apple, or kiwi — high in gut-supportive fibre",
        "Greek yogurt with berries and a sprinkle of flaxseed",
        "Lentil or bean-based soup or meal",
        "Sweet potato with leafy greens",
        "A gentle 10–15 minute walk after eating may help",
        "Stay well hydrated — warm water works especially well",
      ] : loose ? [
        "Plain rice or plain toast — gentle and settling",
        "Banana — easy on the gut",
        "Boiled or scrambled eggs",
        "Plain Greek yogurt with no added fruit",
        "Warm broth or plain soup",
        "Avoid raw vegetables, spicy food, and caffeine today",
        "Stay hydrated with water and plain herbal tea",
        "Rest if your body is asking for it",
      ] : [
        "Warm water with lemon first thing",
        "Oatmeal with chia seeds and berries",
        "Prunes, pear, apple, or kiwi",
        "Greek yogurt with berries and flaxseed",
        "Lentil soup or bean-based meal",
        "Sweet potato with leafy greens",
        "A gentle walk after eating",
        "Stay well hydrated throughout the day",
      ];
      return {
        label: "🌱 Digestion Support",
        why,
        items,
        note: "Wellness support only — not medical advice. If symptoms are severe, persistent, include blood, fever, or vomiting, please contact a healthcare provider.",
      };
    }

    if (filter === "juice") return {
      label: "🍹 Juice Ideas",
      why: "Juices are best enjoyed when breaking your fast or during your eating window — not while fasting.",
      items: ["Green juice with cucumber, celery, spinach, lemon, and ginger", "Watermelon and mint juice — hydrating and light", "Carrot, apple, and ginger juice", "Beet, orange, and lemon juice", "Coconut water with lime — gentle electrolyte boost", "Smoothie with banana, berries, Greek yogurt, and chia seeds"],
    };

    if (filter === "breakfast") return {
      label: "🍽️ Break-Fast Meal",
      why: "Breaking your fast gently helps your digestion wake up. Start light and protein-forward.",
      items: ["2-3 eggs any style with avocado and sourdough toast", "Greek yogurt with berries, granola, and honey", "Bone broth first, then a small protein meal", "Oatmeal with nuts, seeds, and fruit", "Cottage cheese with fruit and a drizzle of honey", "Banana with almond butter and a warm drink"],
    };

    if (filter === "alkaline") return {
      label: "🌿 Alkaline-Inspired",
      why: "Plant-rich and mineral-dense options to nourish your body.",
      items: ["Big leafy green salad with cucumber, avocado, lemon dressing", "Smoothie with spinach, banana, almond milk, and chia", "Steamed broccoli, sweet potato, and quinoa bowl", "Celery and cucumber sticks with hummus", "Warm lemon water to start", "Watermelon, berries, or melon as a snack", "Vegetable soup with leafy greens and legumes"],
    };

    if (filter === "protein") {
      if (has("salty","crunchy","creamy")) return {
        label: "🥚 Protein First — Salty + Crunchy + Creamy",
        why: "You chose salty, crunchy, and creamy — these options give texture, comfort, and steady protein.",
        items: ["Crispy Caesar salad with chicken and creamy yogurt dressing", "Cobb salad with eggs, avocado, chicken, cucumber, and greens", "Crispy chicken breast strips with creamy dip", "Kale chips with Greek yogurt dip", "Crackers with tuna, cottage cheese, or avocado", "Chips plated in a bowl with a protein side"],
      };
      return {
        label: "🥚 Protein First",
        why: "Leading with protein supports steady energy and satiety.",
        items: ["Eggs any style — scrambled, boiled, poached", "Grilled or baked chicken breast with vegetables", "Greek yogurt with granola and berries", "Cottage cheese with fruit", "Tuna or salmon with crackers or salad", "Lentil or bean soup with a protein side"],
      };
    }

    if (cravings.length === 0) return null;

    // Combined craving logic
    const items = [];
    if (has("salty") && has("crunchy") && has("creamy")) {
      items.push("Crispy Caesar salad with creamy yogurt dressing", "Cobb salad with avocado, eggs, chicken, and creamy dressing", "Crunchy chicken wrap with yogurt ranch", "Kale chips with Greek yogurt dip", "Crackers with cottage cheese, tuna, or avocado", "Chips plated in a bowl with a protein side");
    } else if (has("salty") && has("crunchy")) {
      items.push("Crispy Caesar salad with chicken and parmesan", "Kale chips with sea salt", "Roasted chickpeas with paprika", "Popcorn with olive oil and sea salt", "Crackers with tuna or avocado", "Chips plated and paired with protein");
    } else if (has("sweet") && has("creamy")) {
      items.push("Greek yogurt with berries, honey, and granola", "Chia pudding with mango or mixed fruit", "Smoothie bowl with banana and nut butter", "Cottage cheese with fruit and cinnamon", "Banana with peanut butter", "Dark chocolate with almonds");
    } else if (has("carbs","pastry") && has("full meal","full")) {
      items.push("Sourdough toast with eggs and avocado", "Sweet potato bowl with eggs or chicken", "Rice bowl with salmon, tofu, or chicken", "Whole grain wrap with turkey and greens", "Lentil soup with crusty toast", "Oatmeal with protein, nuts, and berries");
    } else if (has("chocolate")) {
      items.push("A square or two of dark chocolate 70% or higher", "Hot cacao or dark hot chocolate", "Greek yogurt with cacao nibs and berries", "Chocolate smoothie with banana and nut butter", "Cacao energy balls with dates and oats");
    } else if (has("coffee","café","cafe")) {
      items.push("Coffee or matcha after eating — not on an empty stomach", "Latte with Greek yogurt and berries on the side", "Avocado toast with a poached egg and your drink", "Protein smoothie with a matcha latte");
    } else if (has("sweet")) {
      items.push("Greek yogurt with berries and honey", "Chia pudding with fruit", "Banana with almond butter", "Dates with nut butter", "Dark chocolate with nuts", "Warm chai or golden milk");
    } else if (has("salty")) {
      items.push("Warm soup or bone broth", "Crackers with hummus or cottage cheese", "Roasted chickpeas", "Popcorn with sea salt", "Cucumber with hummus");
    } else if (has("crunchy")) {
      items.push("Apple slices with almond butter", "Carrot and celery with hummus", "Rice cakes with avocado", "Roasted chickpeas or edamame", "Mixed nuts and seeds");
    } else if (has("creamy")) {
      items.push("Greek yogurt with granola", "Avocado toast", "Smoothie with banana and nut butter", "Hummus with warm pita", "Warm oatmeal with cream and berries");
    } else if (has("full meal","full")) {
      items.push("Rice bowl with salmon or chicken and roasted veg", "Eggs with sourdough toast and avocado", "Warm soup with bread", "Stir fry with vegetables and protein", "A plate with protein, complex carb, and something green");
    } else {
      items.push("A glass of water first and check in — are you truly hungry?", "Something small and protein-rich — egg, nuts, or yogurt", "Warm herbal tea if you need a moment", "A simple plate — crackers, fruit, and something you enjoy");
    }

    const cravingLabel = cravings.join(" + ");
    return {
      label: cravingLabel,
      why: `You chose ${cravingLabel.toLowerCase()} — here are options that match what your body is asking for right now.`,
      items,
    };
  };

  const suggestion = getSuggestion();
  const accentColor = mode === "fast" ? "#C9A84C" : "#9B7BC9";
  const subColor    = mode === "fast" ? "#7A9E7E" : "#9B7BC9";
  const cardBg      = mode === "fast" ? "linear-gradient(135deg, #1a3a2a, #0f2a1a)" : "linear-gradient(135deg, #F5F0FF, #FFF0F5)";
  const cardBorder  = mode === "fast" ? "0.5px solid rgba(201,168,76,0.3)" : "0.5px solid rgba(180,140,200,0.3)";
  const bodyColor   = mode === "fast" ? "#a8c4a8" : "#4a3a5a";
  const resultBg    = mode === "fast" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.75)";
  const textColor   = mode === "fast" ? "#e8e0ce" : "#2D3B2E";

  return (
    <div style={{ background: cardBg, borderRadius: 18, padding: "18px", border: cardBorder, marginBottom: 16, marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>✨</span>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: textColor, margin: 0 }}>Lumen Suggests</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: subColor, margin: 0 }}>Craving-aware · fasting-aware · phase-synced</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {supportOptions.map(opt => (
          <button key={opt.id} onClick={() => setSupportFilter(supportFilter === opt.id ? null : opt.id)} style={{ padding: "6px 11px", borderRadius: 50, border: `0.5px solid ${supportFilter === opt.id ? accentColor : "rgba(150,150,150,0.25)"}`, background: supportFilter === opt.id ? (mode === "fast" ? "rgba(201,168,76,0.15)" : "rgba(155,123,201,0.12)") : "rgba(255,255,255,0.05)", color: supportFilter === opt.id ? accentColor : subColor, fontFamily: "sans-serif", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
            >
            <span>{opt.icon}</span>{opt.label}
          </button>
        ))}
      </div>
      {suggestion && (
        <div id="lumen-suggests-result" style={{ background: resultBg, borderRadius: 14, padding: "14px 16px", borderLeft: `3px solid ${accentColor}` }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: accentColor, margin: "0 0 6px", fontWeight: 600 }}>{suggestion.label}</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 12, color: bodyColor, margin: "0 0 10px", lineHeight: 1.6, fontStyle: "italic" }}>{suggestion.why}</p>
          {suggestion.items.map((item, i) => (
            <p key={i} style={{ fontFamily: "sans-serif", fontSize: 13, color: bodyColor, margin: "0 0 5px", lineHeight: 1.6 }}>• {item}</p>
          ))}
          {suggestion.note && <p style={{ fontFamily: "sans-serif", fontSize: 11, color: subColor, margin: "10px 0 0", lineHeight: 1.6 }}>⚠️ {suggestion.note}</p>}
        </div>
      )}
      {!suggestion && (
        <p style={{ fontFamily: "sans-serif", fontSize: 13, color: subColor, textAlign: "center", padding: "8px 0" }}>Select a craving or filter above and Lumen will suggest something for you.</p>
      )}
    </div>
  );
}

function AiNourishCard({ mode, selectedCravings, activeTab }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [supportOption, setSupportOption] = useState(null);

  const supportOptions = [
    { id: "alkaline",  label: "Alkaline-Inspired", icon: "🌿" },
    { id: "juice",     label: "Juice Ideas",        icon: "🍹" },
    { id: "protein",   label: "Protein First",      icon: "🥚" },
    { id: "breakfast", label: "Break-Fast Meal",    icon: "🍽️" },
    { id: "fasting",   label: "Still Fasting",      icon: "💧" },
  ];

  const getCheckInContext = () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const data = JSON.parse(localStorage.getItem(`lf_checkin_${today}`));
      if (!data) return "";
      const parts = [];
      if (data.energy) parts.push(`energy: ${["very low","low","neutral","good","great"][data.energy-1]}`);
      if (data.sleep)  parts.push(`sleep: ${["poor","light","fair","good","great"][data.sleep-1]}`);
      if (data.namedMood) parts.push(`mood: ${data.namedMood}`);
      if (data.symptoms?.length) parts.push(`symptoms: ${data.symptoms.slice(0,3).join(", ")}`);
      if (data.gut?.length) parts.push(`gut: ${data.gut.filter(g => g !== "good").slice(0,2).join(", ")}`);
      if (data.water) parts.push(`water: ${data.water} glasses`);
      return parts.length ? `Today's check-in — ${parts.join("; ")}.` : "";
    } catch (e) { return ""; }
  };

  const getFastingContext = () => {
    const fastStart = localStorage.getItem("lf_fast_start");
    if (!fastStart) return "Not currently fasting.";
    const hours = ((Date.now() - Number(fastStart)) / 3600000).toFixed(1);
    return `Currently ${hours} hours into a fast.`;
  };

  const getCycleContext = () => {
    try {
      const settings = JSON.parse(localStorage.getItem("lf_settings"));
      if (!settings?.lastPeriod || mode === "fast") return "";
      const diff = Math.floor((new Date() - new Date(settings.lastPeriod)) / 86400000);
      const day = (diff % 28) + 1;
      const phase = day <= 7 ? "Menstrual" : day <= 15 ? "Follicular" : day <= 17 ? "Ovulation" : "Luteal";
      return `Cycle phase: ${phase} (day ${day}).`;
    } catch (e) { return ""; }
  };

  const buildPrompt = () => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    const checkIn = getCheckInContext();
    const fasting = getFastingContext();
    const cycle = getCycleContext();
    const cravings = selectedCravings?.length ? selectedCravings.join(", ") : "";
    const supportLabel = supportOption ? supportOptions.find(o => o.id === supportOption)?.label : "";
    return `You are Lumen, a warm wellness assistant. It is ${timeOfDay}. ${fasting} ${cycle} ${checkIn}
${cravings ? `Selected cravings: ${cravings}.` : "No craving selected."}
${supportLabel ? `Focus: ${supportLabel}.` : ""}

Respond in exactly 4 sections with these exact headers on their own lines:
Insight
Nourish — feed the body
Pause — ground yourself
Romanticize — feed the soul

Rules: Never shame cravings. No medical claims. If Still Fasting: water/tea/electrolytes only, no food. Under 180 words total. ${mode === "fast" ? "Tone: direct, practical." : "Tone: warm, nurturing."}`;
  };

  const ask = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt() }],
        }),
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      setResult(text || "Choose a craving or support option so Lumen can suggest something more specific for you.");
    } catch (e) {
      setResult("Choose a craving or support option so Lumen can suggest something more specific for you.");
    }
    setLoading(false);
  };

  const accentColor = mode === "fast" ? "#C9A84C" : "#9B7BC9";
  const accentBg    = mode === "fast" ? "rgba(201,168,76,0.1)" : "rgba(155,123,201,0.1)";
  const textColor   = mode === "fast" ? "#e8e0ce" : "#2D3B2E";
  const subColor    = mode === "fast" ? "#7A9E7E" : "#9B7BC9";
  const bodyColor   = mode === "fast" ? "#a8c4a8" : "#4a3a5a";
  const cardBg      = mode === "fast" ? "linear-gradient(135deg, #1a3a2a, #0f2a1a)" : "linear-gradient(135deg, #F5F0FF, #FFF0F5)";
  const cardBorder  = mode === "fast" ? "0.5px solid rgba(201,168,76,0.3)" : "0.5px solid rgba(180,140,200,0.3)";
  const resultBg    = mode === "fast" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.7)";

  const sectionColors = { "Insight": mode === "fast" ? "#C9A84C" : "#9B7BC9", "Nourish": mode === "fast" ? "#7A9E7E" : "#5C7F60", "Pause": "#7BA8C9", "Romanticize": mode === "fast" ? "#C9A84C" : "#C97B7B" };
  const parseSections = (text) => {
    if (!text) return [];
    const headers = ["Insight","Nourish","Pause","Romanticize"];
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const sections = [];
    let current = null;
    for (const line of lines) {
      const clean = line.replace(/\*\*/g, "").replace(/^#+\s*/,"");
      const matched = headers.find(h => clean.toLowerCase().includes(h.toLowerCase()) && clean.length < 60);
      if (matched) { if (current) sections.push(current); current = { header: clean, color: sectionColors[matched] || accentColor, lines: [] }; }
      else if (current) current.lines.push(clean);
    }
    if (current) sections.push(current);
    return sections;
  };
  const sections = result ? parseSections(result) : [];

  return (
    <div style={{ background: cardBg, borderRadius: 18, padding: "18px", border: cardBorder, marginBottom: 16, marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>✨</span>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: textColor, margin: 0 }}>What should I eat right now?</p>
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: subColor, margin: 0 }}>AI-powered · craving-aware · phase-synced</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {supportOptions.map(opt => (
          <button key={opt.id} onClick={() => setSupportOption(supportOption === opt.id ? null : opt.id)} style={{ padding: "6px 11px", borderRadius: 50, border: `0.5px solid ${supportOption === opt.id ? accentColor : "rgba(150,150,150,0.25)"}`, background: supportOption === opt.id ? accentBg : "rgba(255,255,255,0.05)", color: supportOption === opt.id ? accentColor : subColor, fontFamily: "sans-serif", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <span>{opt.icon}</span>{opt.label}
          </button>
        ))}
      </div>
      {(selectedCravings?.length > 0 || supportOption) && (
        <p style={{ fontFamily: "sans-serif", fontSize: 11, color: subColor, margin: "0 0 10px", lineHeight: 1.5 }}>
          {selectedCravings?.length > 0 && `Craving: ${selectedCravings.join(", ")}. `}
          {supportOption && `Focus: ${supportOptions.find(o => o.id === supportOption)?.label}.`}
        </p>
      )}
      {!loading && (
        <button onClick={ask} style={{ width: "100%", padding: "11px", borderRadius: 12, border: `0.5px solid ${accentColor}`, background: accentBg, color: accentColor, fontFamily: "sans-serif", fontSize: 13, cursor: "pointer", fontWeight: 600, marginBottom: result ? 12 : 0 }}>
          {result ? "↺ Ask again" : "Ask Lumen ✦"}
        </button>
      )}
      {loading && <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: subColor, margin: "8px 0", textAlign: "center" }}>✨ Lumen is thinking...</p>}
      {!loading && sections.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
          {sections.map((sec, i) => (
            <div key={i} style={{ background: resultBg, borderRadius: 12, padding: "12px 14px", borderLeft: `3px solid ${sec.color}` }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 12, color: sec.color, margin: "0 0 6px", fontWeight: 600 }}>{sec.header}</p>
              {sec.lines.map((line, j) => <p key={j} style={{ fontFamily: "sans-serif", fontSize: 13, color: bodyColor, margin: "0 0 4px", lineHeight: 1.65 }}>{line}</p>)}
            </div>
          ))}
        </div>
      )}
      {!loading && result && sections.length === 0 && (
        <div style={{ background: resultBg, borderRadius: 12, padding: "12px 14px" }}>
          <p style={{ fontFamily: "sans-serif", fontSize: 13, color: bodyColor, margin: 0, lineHeight: 1.7 }}>{result}</p>
        </div>
      )}
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
function useSwipeNavigation(screen, setScreen) {
  const screens = ["home", "calendar", "checkin", "recipes", "learn", "settings"];
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 50) return;
      if (Math.abs(dx) < Math.abs(dy) * 2) return;
      const idx = screens.indexOf(screen);
      if (dx < 0 && idx < screens.length - 1) setScreen(screens[idx + 1]);
      if (dx > 0 && idx > 0) setScreen(screens[idx - 1]);
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [screen]);
}

export default function App() {
  useEffect(() => {
    const checkMidnight = () => {
      const lastDate = localStorage.getItem("lf_last_date");
      const today = new Date().toISOString().split("T")[0];
      if (lastDate && lastDate !== today) {
        localStorage.setItem("lf_water_today", "0");
      }
      localStorage.setItem("lf_last_date", today);
    };
    checkMidnight();
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("lf_settings");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [screen, setScreen] = useState("home");
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [nourishDigestionPreset, setNourishDigestionPreset] = useState(false);
  useSwipeNavigation(screen, setScreen);

  const saveSettings = (data) => {
    setSettings(data);
    localStorage.setItem("lf_settings", JSON.stringify(data));
  };

  if (!settings) {
    return <Onboarding onDone={saveSettings} />;
  }

  return (
    <div style={s.app}>
      {showWaitlist && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "28px 24px", width: "100%", maxWidth: 400, position: "relative" }}>
            <button onClick={() => setShowWaitlist(false)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#8FA090" }}>✕</button>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🌿</div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#2D3B2E", margin: "0 0 6px" }}>Join the Waitlist</h2>
              <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#6b7b6b", margin: 0 }}>Be first to know when Lumen Flow launches on Google Play!</p>
            </div>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScTYq7u3u7yW1LPIy5ae3sW4Q4saRJFXoNaKPxUX6v0o-GobA/viewform?embedded=true"
              width="100%"
              height="480"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              style={{ borderRadius: 12 }}
            >Loading…</iframe>
          </div>
        </div>
      )}
      <div style={{ position: "fixed", bottom: 80, right: 16, zIndex: 999 }}>
        <button onClick={() => setShowWaitlist(true)} style={{ background: "#7A9E7E", border: "none", borderRadius: 50, padding: "12px 18px", fontFamily: "sans-serif", fontSize: 12, color: "#fff", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.15)", fontWeight: 600, letterSpacing: "0.03em" }}>
          🌿 Join Waitlist
        </button>
      </div>
      <div style={s.container}>
        {screen === "home"     && <HomeScreen     name={settings.name} lastPeriod={settings.lastPeriod} mode={settings.mode || "cycle"} settings={settings} />}
        {screen === "calendar" && <CalendarScreen lastPeriod={settings.lastPeriod} cycleLength={settings.cycleLength || 28} periodLength={settings.periodLength || 7} mode={settings.mode || "cycle"} onSave={(date, cycleLen, periodLen) => saveSettings({...settings, lastPeriod: date, cycleLength: cycleLen || settings.cycleLength || 28, periodLength: periodLen || settings.periodLength || 7})} onNavigate={setScreen} />}
       {screen === "recipes"  && <RecipesScreen phase={getPhase(getCycleDay(settings.lastPeriod))} onNavigate={setScreen} mode={settings.mode || "cycle"} digestionPreset={nourishDigestionPreset} onClearDigestionPreset={() => setNourishDigestionPreset(false)} />}
        {screen === "checkin"  && <CheckInScreen mode={settings.mode || "cycle"} onNavigate={setScreen} onNourishDigestion={() => { setScreen("recipes"); setNourishDigestionPreset(true); }} />}
        {screen === "learn"    && <LearnScreen mode={settings.mode || "cycle"} />}
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
  card:       { background: "#F8FAF8", padding: 16, borderRadius: 18, textAlign: "left", marginBottom: 12 },
  label:      { margin: 0, fontSize: 13, color: "#6b7b6b" },
  btn:        { width: "100%", padding: 14, borderRadius: 16, border: "none", background: "#8FAF8F", color: "#fff", fontWeight: "bold", fontSize: 15, cursor: "pointer" },
  backBtn:    { marginTop: 10, background: "none", border: "none", color: "#8FA090", fontSize: 14, cursor: "pointer", padding: 8 },
  input:      { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #C5D9C5", fontFamily: "sans-serif", fontSize: 15, color: "#2D3B2E", background: "#F4F8F4", boxSizing: "border-box", outline: "none", marginBottom: 4 },
  nav:        { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #EAF2EA", display: "flex", justifyContent: "space-around", padding: "8px 0 12px", boxShadow: "0 -4px 16px rgba(0,0,0,0.05)", zIndex: 100 },
  navItem:    { cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 60, paddingTop: 4 },
};
