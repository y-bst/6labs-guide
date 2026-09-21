// User Test diagrams. The flow above the story is the shared TestingMap; this is the recap.

/** Report path and ask path, side by side. */
export function RecapMap() {
  return (
    <>
      <div className="glance-map recapmap">
        <svg viewBox="0 0 1480 340" role="img" aria-label="Gameplay Library, then User Test, pick videos and choose a mode. Report mode: the agent analyses, giving a summary, a full report and questions about the report. Ask mode: answers only, no report.">
          <g fill="none" strokeWidth="4.5" strokeLinecap="round">
            <path d="M186 180H220M360 180H394M544 180H578" stroke="#030D2D" />
            <path d="M738 180C769 180 769 92 800 92M960 92H994" stroke="#1770EF" />
            <path d="M1154 92C1182 92 1182 38 1210 38M1154 92C1182 92 1182 116 1210 116" stroke="#1770EF" />
            <path d="M1154 92C1182 92 1182 194 1210 194" stroke="#7B4CFF" />
            <path d="M738 180C769 180 769 294 800 294M960 294H994" stroke="#7B4CFF" />
          </g>
          <g strokeWidth="2.5">
            <rect x="16" y="148" width="170" height="64" rx="16" fill="#fff" stroke="#030D2D" />
            <rect x="220" y="148" width="140" height="64" rx="16" fill="#fff" stroke="#030D2D" />
            <rect x="394" y="148" width="150" height="64" rx="16" fill="#fff" stroke="#030D2D" />
            <rect x="578" y="148" width="160" height="64" rx="16" fill="#fff" stroke="#030D2D" strokeWidth="3" />
            <rect x="800" y="60" width="160" height="64" rx="16" fill="#EAF2FE" stroke="#1770EF" />
            <rect x="994" y="60" width="160" height="64" rx="16" fill="#fff" stroke="#1770EF" />
            <rect x="1210" y="6" width="250" height="64" rx="16" fill="#fff" stroke="#1770EF" />
            <rect x="1210" y="84" width="250" height="64" rx="16" fill="#fff" stroke="#1770EF" />
            <rect x="1210" y="162" width="250" height="64" rx="16" fill="#fff" stroke="#7B4CFF" />
            <rect x="800" y="262" width="160" height="64" rx="16" fill="#F1ECFF" stroke="#7B4CFF" />
            <rect x="994" y="262" width="160" height="64" rx="16" fill="#fff" stroke="#7B4CFF" />
          </g>
          <g textAnchor="middle">
            <text className="t2" x="101" y="177">Gameplay Library</text>
            <text className="d2" x="101" y="199">videos ready</text>
            <text className="t2" x="290" y="177">User Test</text>
            <text className="d2" x="290" y="199">open the tab</text>
            <text className="t2" x="469" y="177">Pick videos</text>
            <text className="d2" x="469" y="199">one tag, whole batch</text>
            <text className="t2" x="658" y="177">Choose mode</text>
            <text className="d2" x="658" y="199">report or ask</text>
            <text className="t2" x="880" y="89">Generate report</text>
            <text className="d2" x="880" y="111">mode 1</text>
            <text className="t2" x="1074" y="89">Agent analyses</text>
            <text className="d2" x="1074" y="111">every session</text>
            <text className="t2" x="1335" y="35">Summary</text>
            <text className="d2" x="1335" y="57">numbers &amp; top findings</text>
            <text className="t2" x="1335" y="113">Full report</text>
            <text className="d2" x="1335" y="135">every finding, with clips</text>
            <text className="t2" x="1335" y="191">Ask about the report</text>
            <text className="d2" x="1335" y="213">answers below the report</text>
            <text className="t2" x="880" y="291">Ask questions</text>
            <text className="d2" x="880" y="313">mode 2 · no report</text>
            <text className="t2" x="1074" y="291">Answers</text>
            <text className="d2" x="1074" y="313">with clips</text>
          </g>
        </svg>
      </div>
      <p className="legend"><span className="lg r" />Report path<span className="lg a" />Ask path</p>
    </>
  );
}
