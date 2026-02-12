import { useState } from “react”;

const CheckItem = ({ label, checked, onChange, color, sub }) => {
const colors = {
green: { bg: “bg-green-900”, border: “border-green-500”, dot: “bg-green-400” },
yellow: { bg: “bg-yellow-900”, border: “border-yellow-500”, dot: “bg-yellow-400” },
red: { bg: “bg-red-900”, border: “border-red-500”, dot: “bg-red-400” },
blue: { bg: “bg-blue-900”, border: “border-blue-500”, dot: “bg-blue-400” },
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
<div className="text-left">
<span className={`text-sm ${checked ? "text-white" : "text-gray-400"}`}>{label}</span>
{sub && <p className={`text-xs mt-0.5 ${checked ? "text-gray-300" : "text-gray-600"}`}>{sub}</p>}
</div>
</button>
);
};

const Light = ({ color, active, label, count, total }) => {
const glow = { green: “shadow-green-500/50”, yellow: “shadow-yellow-500/50”, red: “shadow-red-500/50” };
const bg = { green: “bg-green-500”, yellow: “bg-yellow-500”, red: “bg-red-500” };
const dim = { green: “bg-green-900”, yellow: “bg-yellow-900”, red: “bg-red-900” };
return (
<div className="flex flex-col items-center gap-1">
<div className={`w-14 h-14 rounded-full ${active ? bg[color] : dim[color]} ${active ? `shadow-lg ${glow[color]}` : ""} transition-all duration-500 flex items-center justify-center`}>
{active ? <span className="text-black font-bold text-sm">{count}/{total}</span> : <span className="text-gray-600 font-bold text-sm">{count}/{total}</span>}
</div>
<span className="text-xs text-gray-500 font-medium">{label}</span>
</div>
);
};

const StatBox = ({ label, value, color }) => (

  <div className={`flex-1 text-center p-2 rounded-lg bg-gray-800 border border-gray-700`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className={`text-sm font-bold ${color}`}>{value}</p>
  </div>
);

export default function App() {
const [tab, setTab] = useState(“pre”);
const [entry, setEntry] = useState([false, false, false, false]);
const [exitChecks, setExitChecks] = useState([false, false, false]);
const [entryPrice, setEntryPrice] = useState(””);
const [tradeCount, setTradeCount] = useState(0);
const [wins, setWins] = useState(0);
const [losses, setLosses] = useState(0);
const [consecutiveLosses, setConsecutiveLosses] = useState(0);

const entryItems = [
{ label: “Price is ABOVE VWAP”, sub: “Direction bias confirmed” },
{ label: “Price bouncing off EMA 9”, sub: “Green candle touching/near EMA 9” },
{ label: “VWMA 9 is ABOVE EMA 9”, sub: “Volume is backing the move” },
{ label: “RSI 7 is ABOVE 50 & rising”, sub: “Momentum confirms direction” },
];

const exitItems = [
{ label: “Target hit: Entry + 5 points”, sub: “~₹5,200 profit after slippage (net 4 pts)” },
{ label: “Stop hit: Entry - 4 points”, sub: “~₹5,200 loss — accept it, move on” },
{ label: “10:00 AM reached — no setup”, sub: “Close everything. Easy money window is over.” },
];

const entryCount = entry.filter(Boolean).length;
const exitTriggered = exitChecks.some(Boolean);
const allEntry = entryCount === 4;
const stopped = consecutiveLosses >= 2 || tradeCount >= 3;

const signal = stopped ? “DONE FOR TODAY” : exitTriggered ? “EXIT NOW” : allEntry ? “ENTER” : entryCount >= 2 ? “ALMOST…” : “NO TRADE”;
const signalColor = stopped ? “text-orange-400” : exitTriggered ? “text-red-400” : allEntry ? “text-green-400” : entryCount >= 2 ? “text-yellow-400” : “text-gray-500”;
const signalBg = stopped ? “border-orange-500 bg-orange-900” : exitTriggered ? “border-red-500 bg-red-900” : allEntry ? “border-green-500 bg-green-900” : entryCount >= 2 ? “border-yellow-500 bg-yellow-900” : “border-gray-700 bg-gray-800”;
const signalMsg = stopped ? (consecutiveLosses >= 2 ? “2 consecutive losses. Protect your capital.” : “3 trades done. Discipline > profit.”) : exitTriggered ? “Close position immediately. No second thoughts.” : allEntry ? “All 4 checks passed. Enter at candle close!” : entryCount >= 2 ? `${4 - entryCount} more condition(s) needed. Wait.` : “Conditions not met. Stay out.”;

const ep = parseFloat(entryPrice);
const target = !isNaN(ep) ? (ep + 5).toFixed(2) : “—”;
const sl = !isNaN(ep) ? (ep - 4).toFixed(2) : “—”;
const profit = !isNaN(ep) ? “₹” + (4 * 1300).toLocaleString() : “—”;
const risk = !isNaN(ep) ? “₹” + (4 * 1300).toLocaleString() : “—”;

const logWin = () => { setWins(w => w + 1); setTradeCount(t => t + 1); setConsecutiveLosses(0); resetTrade(); };
const logLoss = () => { setLosses(l => l + 1); setTradeCount(t => t + 1); setConsecutiveLosses(c => c + 1); resetTrade(); };
const resetTrade = () => { setEntry([false, false, false, false]); setExitChecks([false, false, false]); setEntryPrice(””); };
const resetAll = () => { resetTrade(); setTradeCount(0); setWins(0); setLosses(0); setConsecutiveLosses(0); };

const pnl = (wins * 5200) - (losses * 5200);

const tabs = [
{ id: “pre”, label: “☀️ Pre-Trade” },
{ id: “scan”, label: “🔍 Scan” },
{ id: “trade”, label: “🎯 Trade” },
{ id: “rules”, label: “📋 Rules” },
{ id: “log”, label: “📊 Log” },
];

return (
<div className="min-h-screen bg-gray-950 text-white p-4 max-w-md mx-auto">
<div className="text-center mb-3">
<h1 className="text-lg font-bold">4-Point Scalp System</h1>
<p className="text-xs text-gray-500">20 Lots × 65 Qty = 1,300 Units · Target: ₹5,200</p>
</div>

```
  <div className="flex justify-center gap-6 mb-3 bg-gray-900 rounded-full p-3">
    <Light color="green" active={allEntry && !exitTriggered && !stopped} label="ENTRY" count={entryCount} total={4} />
    <Light color="yellow" active={entryCount >= 2 && !allEntry && !exitTriggered && !stopped} label="WAIT" count={entryCount} total={4} />
    <Light color="red" active={exitTriggered || stopped} label="EXIT" count={exitTriggered ? "!" : stopped ? "X" : "0"} total="" />
  </div>

  <div className={`text-center py-2 px-4 rounded-lg border ${signalBg} bg-opacity-30 mb-3`}>
    <span className={`font-bold text-lg ${signalColor}`}>{signal}</span>
    <p className="text-xs text-gray-400 mt-1">{signalMsg}</p>
  </div>

  {tradeCount > 0 && (
    <div className="flex gap-2 mb-3">
      <StatBox label="Trades" value={`${tradeCount}/3`} color="text-white" />
      <StatBox label="W / L" value={`${wins} / ${losses}`} color={wins > losses ? "text-green-400" : wins < losses ? "text-red-400" : "text-gray-400"} />
      <StatBox label="P&L" value={`${pnl >= 0 ? "+" : ""}₹${pnl.toLocaleString()}`} color={pnl >= 0 ? "text-green-400" : "text-red-400"} />
    </div>
  )}

  <div className="flex gap-1 mb-3 overflow-x-auto">
    {tabs.map(t => (
      <button key={t.id} onClick={() => setTab(t.id)}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.id ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-500"}`}>
        {t.label}
      </button>
    ))}
  </div>

  {tab === "pre" && (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-400 mb-1">⏰ 9:15 – 9:20 AM</h3>
        <p className="text-xs text-gray-500 mb-3">Watch only. Do NOT trade.</p>
        <div className="space-y-2 text-sm text-gray-300">
          <p>1. Open your chart with these indicators only:</p>
          <div className="ml-3 space-y-1 text-xs text-gray-400">
            <p>• VWAP (default)</p>
            <p>• EMA 9</p>
            <p>• EMA 21</p>
            <p>• VWMA 9</p>
            <p>• RSI 7 (bottom panel)</p>
          </div>
          <p>2. Watch where VWAP is forming</p>
          <p>3. Watch the first 5 candles build</p>
          <p>4. Note if price is above or below VWAP</p>
          <p>5. At 9:20, switch to Scan tab</p>
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-orange-400 mb-2">🧠 Today's Mindset</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• I only need 4 points. That's ONE good candle.</p>
          <p>• I will be done by 9:35 AM maximum.</p>
          <p>• If I don't find a setup, I earn ₹0 today. That's fine.</p>
          <p>• ₹0 is better than -₹5,200.</p>
          <p>• All 4 checks must pass. No shortcuts.</p>
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-green-400 mb-2">💰 Position Size</h3>
        <div className="space-y-1 text-sm text-gray-300">
          <div className="flex justify-between"><span>Lots</span><span className="text-white font-medium">20</span></div>
          <div className="flex justify-between"><span>Qty per lot</span><span className="text-white font-medium">65</span></div>
          <div className="flex justify-between"><span>Total units</span><span className="text-white font-medium">1,300</span></div>
          <div className="flex justify-between"><span>Per point</span><span className="text-green-400 font-medium">₹1,300</span></div>
          <div className="flex justify-between"><span>Target (4 pts)</span><span className="text-green-400 font-medium">₹5,200</span></div>
          <div className="flex justify-between"><span>Risk (4 pts)</span><span className="text-red-400 font-medium">₹5,200</span></div>
          <div className="flex justify-between"><span>Approx charges</span><span className="text-yellow-400 font-medium">~₹800–1,200</span></div>
        </div>
      </div>
    </div>
  )}

  {tab === "scan" && (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-green-400 mb-1">🔍 Entry Checklist</h3>
        <p className="text-xs text-gray-500 mb-3">ALL 4 must be checked to enter. No exceptions.</p>
        <div className="space-y-2">
          {entryItems.map((item, i) => (
            <CheckItem key={i} label={item.label} sub={item.sub} checked={entry[i]} color="green"
              onChange={v => { const n = [...entry]; n[i] = v; setEntry(n); }} />
          ))}
        </div>
      </div>

      {allEntry && !stopped && (
        <div className="bg-green-900 bg-opacity-30 border border-green-500 rounded-xl p-4 text-center">
          <p className="text-green-400 font-bold text-lg mb-1">ALL CHECKS PASSED</p>
          <p className="text-sm text-green-300">Enter at candle close → Switch to Trade tab</p>
          <p className="text-xs text-gray-400 mt-2">Use LIMIT order. Enter the candle's close price.</p>
        </div>
      )}

      {stopped && (
        <div className="bg-orange-900 bg-opacity-30 border border-orange-500 rounded-xl p-4 text-center">
          <p className="text-orange-400 font-bold text-lg mb-1">TRADING DONE FOR TODAY</p>
          <p className="text-sm text-orange-300">{consecutiveLosses >= 2 ? "2 consecutive losses hit. Protect capital." : "3 trade limit reached."}</p>
        </div>
      )}

      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Do NOT Enter If</h3>
        <div className="space-y-1.5 text-sm text-gray-300">
          <p>• Only 3 out of 4 checks pass — wait or skip</p>
          <p>• Price has already moved 6+ pts from EMA 9 — you're late</p>
          <p>• It's a red candle — wait for green candle close</p>
          <p>• Candle has long upper wick — sellers are present</p>
          <p>• It's after 10:00 AM — window is over</p>
        </div>
      </div>
    </div>
  )}

  {tab === "trade" && (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-400 mb-3">💲 Entry Price</h3>
        <input
          type="number"
          value={entryPrice}
          onChange={e => setEntryPrice(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-lg mt-1 outline-none focus:border-blue-500 text-center font-bold"
          placeholder="Enter your entry price"
        />
      </div>

      {entryPrice && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 bg-green-900 bg-opacity-30 border border-green-700 rounded-xl p-3 text-center">
              <p className="text-xs text-green-400">TARGET (+5 pts)</p>
              <p className="text-xl font-bold text-green-400">{target}</p>
              <p className="text-xs text-gray-400 mt-1">Profit: {profit}</p>
            </div>
            <div className="flex-1 bg-red-900 bg-opacity-30 border border-red-700 rounded-xl p-3 text-center">
              <p className="text-xs text-red-400">STOP-LOSS (-4 pts)</p>
              <p className="text-xl font-bold text-red-400">{sl}</p>
              <p className="text-xs text-gray-400 mt-1">Risk: {risk}</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-400 mb-1">🚪 Exit Conditions</h3>
            <p className="text-xs text-gray-500 mb-3">Check whichever happens first</p>
            <div className="space-y-2">
              {exitItems.map((item, i) => (
                <CheckItem key={i} label={item.label} sub={item.sub} checked={exitChecks[i]} color="red"
                  onChange={v => { const n = [...exitChecks]; n[i] = v; setExitChecks(n); }} />
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-purple-400 mb-3">📝 Log This Trade</h3>
            <div className="flex gap-2">
              <button onClick={logWin}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                ✅ Win (+₹5,200)
              </button>
              <button onClick={logLoss}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg text-sm transition-colors">
                ❌ Loss (-₹5,200)
              </button>
            </div>
          </div>
        </div>
      )}

      {!entryPrice && (
        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500">Enter your entry price above to see targets</p>
        </div>
      )}
    </div>
  )}

  {tab === "rules" && (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-green-400 mb-2">📊 Indicator Setup</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between items-center">
            <span>VWAP</span>
            <span className="text-yellow-400 text-xs">Default · Direction bias</span>
          </div>
          <div className="flex justify-between items-center">
            <span>EMA</span>
            <span className="text-blue-400 text-xs">Period 9 · Entry zone</span>
          </div>
          <div className="flex justify-between items-center">
            <span>EMA</span>
            <span className="text-blue-400 text-xs">Period 21 · Trend support</span>
          </div>
          <div className="flex justify-between items-center">
            <span>VWMA</span>
            <span className="text-green-400 text-xs">Period 9 · Volume confirm</span>
          </div>
          <div className="flex justify-between items-center">
            <span>RSI</span>
            <span className="text-purple-400 text-xs">Period 7, EMA · Momentum</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">⏰ Trading Windows</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between items-start">
            <span className="text-yellow-400">9:15–9:20</span>
            <span className="text-xs text-right text-gray-400">Watch only. Let candles form.</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-green-400">9:20–9:25</span>
            <span className="text-xs text-right text-green-300">PRIME window. Best setups.</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-green-400">9:25–9:35</span>
            <span className="text-xs text-right text-gray-400">Backup window. Pullback entries.</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-yellow-400">9:35–10:00</span>
            <span className="text-xs text-right text-gray-400">Last resort. Lower probability.</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-red-400">After 10:00</span>
            <span className="text-xs text-right text-red-300">STOP. Don't trade.</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-green-400 mb-2">✅ Entry Rules</h3>
        <div className="space-y-1.5 text-sm text-gray-300">
          <p>1. All 4 checks on Scan tab must pass</p>
          <p>2. Enter at GREEN candle CLOSE only</p>
          <p>3. Candle must close near its high (small upper wick)</p>
          <p>4. Use LIMIT order for entry</p>
          <p>5. Set target +5 pts, stop -4 pts immediately</p>
          <p>6. Don't touch it after placing orders</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-red-400 mb-2">🚫 Hard Rules — Never Break</h3>
        <div className="space-y-1.5 text-sm text-gray-300">
          <p>1. No trading before 9:20 AM or after 10:00 AM</p>
          <p>2. Maximum 3 trades per day</p>
          <p>3. 2 consecutive losses = done for the day</p>
          <p>4. ALL 4 entry checks must pass. Not 3. FOUR.</p>
          <p>5. Never move your stop-loss further away</p>
          <p>6. Never add to a losing position</p>
          <p>7. If setup isn't obvious in 5 seconds, skip</p>
          <p>8. Don't chase if price moved 6+ pts from EMA 9</p>
          <p>9. Only enter on green candle closes</p>
          <p>10. Once target hit, STOP. Don't give it back.</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-yellow-400 mb-2">🗑️ Removed Indicators</h3>
        <div className="space-y-1 text-sm text-gray-400">
          <p>✕ SuperTrend — too slow for 4-pt scalps</p>
          <p>✕ MACD — redundant with RSI</p>
          <p>✕ EMA 50 — not needed for quick grabs</p>
          <p>✕ ATR — fixed target/stop, no calc needed</p>
          <p>✕ Raw volume bars — VWMA replaces this</p>
        </div>
      </div>
    </div>
  )}

  {tab === "log" && (
    <div className="space-y-3">
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-purple-400 mb-3">📊 Today's Performance</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Total Trades</p>
            <p className="text-2xl font-bold text-white">{tradeCount}</p>
            <p className="text-xs text-gray-500">of 3 max</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Win Rate</p>
            <p className={`text-2xl font-bold ${tradeCount > 0 ? (wins/tradeCount >= 0.5 ? "text-green-400" : "text-red-400") : "text-gray-500"}`}>
              {tradeCount > 0 ? Math.round((wins/tradeCount)*100) : 0}%
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Wins</p>
            <p className="text-2xl font-bold text-green-400">{wins}</p>
            <p className="text-xs text-green-400">+₹{(wins*5200).toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">Losses</p>
            <p className="text-2xl font-bold text-red-400">{losses}</p>
            <p className="text-xs text-red-400">-₹{(losses*5200).toLocaleString()}</p>
          </div>
        </div>
        <div className={`mt-3 text-center p-3 rounded-lg ${pnl >= 0 ? "bg-green-900 bg-opacity-30 border border-green-700" : "bg-red-900 bg-opacity-30 border border-red-700"}`}>
          <p className="text-xs text-gray-400">Net P&L</p>
          <p className={`text-2xl font-bold ${pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
            {pnl >= 0 ? "+" : ""}₹{pnl.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">(before brokerage & charges)</p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">📈 Monthly Projection (at current rate)</h3>
        <div className="space-y-1.5 text-sm text-gray-300">
          {tradeCount > 0 ? (
            <>
              <div className="flex justify-between">
                <span>Win rate</span>
                <span className="text-white">{Math.round((wins/tradeCount)*100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Trades/day</span>
                <span className="text-white">{tradeCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. monthly (22 days)</span>
                <span className={pnl >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                  {pnl >= 0 ? "+" : ""}₹{(pnl * 22).toLocaleString()}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center">Complete at least 1 trade to see projections</p>
          )}
        </div>
      </div>

      {stopped && (
        <div className="bg-orange-900 bg-opacity-30 border border-orange-500 rounded-xl p-4 text-center">
          <p className="text-orange-400 font-bold mb-1">DONE FOR TODAY</p>
          <p className="text-xs text-orange-300">{consecutiveLosses >= 2 ? "2 consecutive losses. Capital protection rule." : "3 trade daily limit reached."}</p>
          <p className="text-xs text-gray-400 mt-2">Come back tomorrow with a fresh mind.</p>
        </div>
      )}
    </div>
  )}

  <button onClick={resetAll}
    className="w-full mt-4 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm hover:bg-gray-700 transition-colors">
    Reset Everything (New Day)
  </button>
</div>
```

);
}
