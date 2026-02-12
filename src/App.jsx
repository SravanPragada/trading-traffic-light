import { useState } from "react";

const CheckItem = ({ label, checked, onChange, color }) => {
  const colors = {
    green: { bg: "bg-green-900", border: "border-green-500", dot: "bg-green-400" },
    yellow: { bg: "bg-yellow-900", border: "border-yellow-500", dot: "bg-yellow-400" },
    red: { bg: "bg-red-900", border: "border-red-500", dot: "bg-red-400" },
  };
  const c = colors[color];
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border ${checked ? c.border : "border-gray-700"} ${checked ? c.bg : "bg-gray-800"} bg-opacity-40 transition-all duration-200`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checked ? c.border : "border-gray-600"}`}>
        {checked && <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />}
      </div>
      <span className={`text-sm text-left ${checked ? "text-white" : "text-gray-400"}`}>{label}</span>
    </button>
  );
};

const Light = ({ color, active, label, count, total }) => {
  const glow = {
    green: "shadow-green-500/50",
    yellow: "shadow-yellow-500/50",
    red: "shadow-red-500/50",
  };
  const bg = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };
  const dim = {
    green: "bg-green-900",
    yellow: "bg-yellow-900",
    red: "bg-red-900",
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-12 h-12 rounded-full ${active ? bg[color] : dim[color]} ${active ? `shadow-lg ${glow[color]}` : ""} transition-all duration-500 flex items-center justify-center`}>
        {active && <span className="text-black font-bold text-xs">{count}/{total}</span>}
      </div>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
};

export default function App() {
  const [phase, setPhase] = useState("pre");
  const [green, setGreen] = useState([false, false, false]);
  const [yellow, setYellow] = useState([false, false, false]);
  const [redChecks, setRedChecks] = useState([false, false, false, false]);
  const [stopCalc, setStopCalc] = useState({ entry: "", atr: "" });
  const [targets, setTargets] = useState({ t1: "", t2: "", sl: "" });

  const greenItems = [
    "SuperTrend (20,4) is GREEN",
    "Price is ABOVE VWAP",
    "EMA 9 is ABOVE EMA 21",
  ];
  const yellowItems = [
    "SuperTrend (7,2) just flipped GREEN",
    "RSI is between 40–60 and rising",
    "Price bounced off EMA 9 or EMA 21",
  ];
  const redItems = [
    "RSI crossed ABOVE 65 and curling down",
    "SuperTrend (7,2) flipped RED",
    "EMA 9 crossed BELOW EMA 21",
    "Price broke BELOW VWAP",
  ];

  const greenCount = green.filter(Boolean).length;
  const yellowCount = yellow.filter(Boolean).length;
  const redCount = redChecks.filter(Boolean).length;

  const greenLit = greenCount >= 2;
  const yellowLit = yellowCount >= 2;
  const redLit = redCount >= 1;

  const signal = redLit ? "EXIT" : (greenLit && yellowLit) ? "ENTER" : greenLit ? "WAIT" : "NO TRADE";
  const signalColor = redLit ? "text-red-400" : signal === "ENTER" ? "text-green-400" : signal === "WAIT" ? "text-yellow-400" : "text-gray-500";
  const signalBg = redLit ? "border-red-500 bg-red-900" : signal === "ENTER" ? "border-green-500 bg-green-900" : signal === "WAIT" ? "border-yellow-500 bg-yellow-900" : "border-gray-700 bg-gray-800";

  const calcTargets = () => {
    const e = parseFloat(stopCalc.entry);
    const a = parseFloat(stopCalc.atr);
    if (!isNaN(e) && !isNaN(a)) {
      setTargets({
        sl: (e - 1.5 * a).toFixed(2),
        t1: (e + 1.5 * a).toFixed(2),
        t2: (e + 2.5 * a).toFixed(2),
      });
    }
  };

  const reset = () => {
    setGreen([false, false, false]);
    setYellow([false, false, false]);
    setRedChecks([false, false, false, false]);
    setTargets({ t1: "", t2: "", sl: "" });
    setStopCalc({ entry: "", atr: "" });
  };

  const tabs = [
    { id: "pre", label: "Pre-Trade" },
    { id: "entry", label: "Entry" },
    { id: "manage", label: "In Trade" },
    { id: "calc", label: "Calculator" },
    { id: "rules", label: "Rules" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold mb-1">Trading Traffic Light</h1>
        <p className="text-xs text-gray-500">NIFTY Options · 1-Min Scalping · 9:25–10:30 AM</p>
      </div>

      <div className="flex justify-center gap-4 mb-4 bg-gray-900 rounded-full p-3">
        <Light color="green" active={greenLit} label="TREND" count={greenCount} total={3} />
        <Light color="yellow" active={yellowLit} label="TIMING" count={yellowCount} total={3} />
        <Light color="red" active={redLit} label="EXIT" count={redCount} total={4} />
      </div>

      <div className={`text-center py-2 px-4 rounded-lg border ${signalBg} bg-opacity-30 mb-4`}>
        <span className="text-xs text-gray-400">SIGNAL: </span>
        <span className={`font-bold text-lg ${signalColor}`}>{signal}</span>
        {signal === "ENTER" && <p className="text-xs text-green-300 mt-1">At least 2 green + 2 yellow conditions met. Go!</p>}
        {signal === "WAIT" && <p className="text-xs text-yellow-300 mt-1">Trend is favorable. Wait for entry trigger.</p>}
        {signal === "EXIT" && <p className="text-xs text-red-300 mt-1">Exit condition triggered. Close position now!</p>}
        {signal === "NO TRADE" && <p className="text-xs text-gray-400 mt-1">Trend not confirmed. Stay out.</p>}
      </div>

      <div className="flex gap-1 mb-4 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setPhase(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${phase === t.id ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-500 hover:text-gray-300"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {phase === "pre" && (
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">9:15 – 9:25 AM Routine</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>1. Open chart. Do NOT place any trades yet.</p>
              <p>2. Note down ATR value for stop-loss calculation.</p>
              <p>3. Watch where price opens relative to VWAP.</p>
              <p>4. Observe which SuperTrends are green vs red.</p>
              <p>5. Wait for 9:25. Let the first 10 candles form.</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-orange-400 mb-2">Today's Mental Checklist</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• Max 3 trades today. No revenge trading.</p>
              <p>• If 2 losses in a row, stop for the day.</p>
              <p>• If unsure, skip. There's always another trade.</p>
              <p>• Close everything by 10:30 AM sharp.</p>
            </div>
          </div>
        </div>
      )}

      {phase === "entry" && (
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h3 className="text-sm font-semibold text-green-400">GREEN LIGHT — Is the trend with you?</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">Need at least 2 of 3 to proceed</p>
            <div className="space-y-2">
              {greenItems.map((item, i) => (
                <CheckItem key={i} label={item} checked={green[i]} color="green"
                  onChange={v => { const n = [...green]; n[i] = v; setGreen(n); }} />
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <h3 className="text-sm font-semibold text-yellow-400">YELLOW LIGHT — Is the timing right?</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">Need at least 2 of 3 to enter</p>
            <div className="space-y-2">
              {yellowItems.map((item, i) => (
                <CheckItem key={i} label={item} checked={yellow[i]} color="yellow"
                  onChange={v => { const n = [...yellow]; n[i] = v; setYellow(n); }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {phase === "manage" && (
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <h3 className="text-sm font-semibold text-red-400">RED LIGHT — Time to exit?</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">If ANY one triggers, exit immediately</p>
            <div className="space-y-2">
              {redItems.map((item, i) => (
                <CheckItem key={i} label={item} checked={redChecks[i]} color="red"
                  onChange={v => { const n = [...redChecks]; n[i] = v; setRedChecks(n); }} />
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">While in trade, keep watching:</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• RSI approaching 65 → tighten stop to breakeven</p>
              <p>• Price hits Target 1 → book 50% profit</p>
              <p>• Price hits Target 2 → book remaining</p>
              <p>• SuperTrend (7,2) flips → trail stop tight</p>
            </div>
          </div>
        </div>
      )}

      {phase === "calc" && (
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-3">Stop-Loss & Target Calculator</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Entry Price</label>
                <input
                  type="number"
                  value={stopCalc.entry}
                  onChange={e => setStopCalc({ ...stopCalc, entry: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mt-1 outline-none focus:border-blue-500"
                  placeholder="e.g. 120"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">ATR Value</label>
                <input
                  type="number"
                  value={stopCalc.atr}
                  onChange={e => setStopCalc({ ...stopCalc, atr: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm mt-1 outline-none focus:border-blue-500"
                  placeholder="e.g. 4.95"
                />
              </div>
              <button
                onClick={calcTargets}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-colors"
              >
                Calculate
              </button>
            </div>
            {targets.sl && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center p-2 rounded-lg bg-red-900 bg-opacity-30 border border-red-800">
                  <span className="text-xs text-red-400">Stop-Loss (1.5× ATR)</span>
                  <span className="text-sm font-bold text-red-400">{targets.sl}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-green-900 bg-opacity-30 border border-green-800">
                  <span className="text-xs text-green-400">Target 1 (1.5× ATR) — Book 50%</span>
                  <span className="text-sm font-bold text-green-400">{targets.t1}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-green-900 bg-opacity-30 border border-green-800">
                  <span className="text-xs text-green-400">Target 2 (2.5× ATR) — Book 100%</span>
                  <span className="text-sm font-bold text-green-400">{targets.t2}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <span className="text-xs text-gray-400">Risk:Reward</span>
                  <span className="text-sm font-bold text-blue-400">1 : 1.67</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "rules" && (
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-green-400 mb-2">Indicator Settings</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex justify-between"><span>SuperTrend Fast</span><span className="text-green-400">7, 2</span></div>
              <div className="flex justify-between"><span>SuperTrend Slow</span><span className="text-green-400">20, 4</span></div>
              <div className="flex justify-between"><span>EMA Fast</span><span className="text-blue-400">9</span></div>
              <div className="flex justify-between"><span>EMA Slow</span><span className="text-blue-400">21</span></div>
              <div className="flex justify-between"><span>VWAP</span><span className="text-yellow-400">Default</span></div>
              <div className="flex justify-between"><span>RSI</span><span className="text-purple-400">7, EMA, 65/35</span></div>
              <div className="flex justify-between"><span>ATR</span><span className="text-red-400">10</span></div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-400 mb-2">Hard Rules — Never Break These</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>1. No trading before 9:25 AM or after 10:30 AM.</p>
              <p>2. Maximum 3 trades per day.</p>
              <p>3. 2 consecutive losses = done for the day.</p>
              <p>4. Always set stop-loss BEFORE entering.</p>
              <p>5. Never add to a losing position.</p>
              <p>6. If setup isn't obvious in 5 seconds, skip it.</p>
              <p>7. Book 50% at Target 1, trail the rest.</p>
              <p>8. No trading on impulse. Follow the lights.</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-yellow-400 mb-2">Indicators to Remove</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p>✕ MACD — redundant with RSI</p>
              <p>✕ SuperTrend (10,3) — middle layer adds noise</p>
              <p>✕ EMA 50 — SuperTrend (20,4) covers this</p>
              <p>✕ ATR plot — check once at 9:20, then hide</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={reset}
        className="w-full mt-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm hover:bg-gray-700 transition-colors"
      >
        Reset All Checks
      </button>
    </div>
  );
}
