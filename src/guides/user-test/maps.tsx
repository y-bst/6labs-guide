// User Test diagrams: the flow above the story, and the two paths in the recap.

/** Recorder / existing footage → Gameplay Library → User Test → report or answers. */
export function FlowMap() {
  return (
    <svg viewBox="0 0 1450 450" role="img" aria-label="Gameplay Recorder and existing footage (via browser upload or CLI) go into the Gameplay Library. User Test picks videos from it and returns a report or answers, with follow-up questions.">
      {/* this guide */}
      <rect x="896" y="58" width="544" height="384" rx="22" fill="rgba(23,112,239,.05)" stroke="rgba(23,112,239,.4)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text className="k" x="918" y="92">THIS GUIDE</text>
      {/* group labels */}
      <text className="g" x="24" y="50">The studio's testers</text>
      <text className="g" x="24" y="280">Footage the studio already has</text>
      <text className="g" x="616" y="172">Inside 6labs Studio</text>
      {/* edges */}
      <g fill="none" strokeWidth="5" strokeLinecap="round">
        <path d="M244 108H304" stroke="#1770EF" />
        <path d="M540 108C590 108 566 228 616 228" stroke="#1770EF" />
        <path d="M244 338C274 338 274 288 304 288" stroke="#030D2D" />
        <path d="M244 338C274 338 274 388 304 388" stroke="#030D2D" />
        <path d="M540 288C580 288 576 228 616 228" stroke="#030D2D" />
        <path d="M540 388C590 388 566 228 616 228" stroke="#030D2D" />
        <path d="M866 228H930" stroke="#030D2D" />
        <path d="M1150 228C1175 228 1175 138 1200 138" stroke="#1770EF" />
        <path d="M1150 228C1175 228 1175 338 1200 338" stroke="#1770EF" />
        <path d="M1298 180V296" stroke="#1770EF" strokeWidth="3" strokeDasharray="8 8" />
      </g>
      <text className="f" x="1312" y="244">follow-up questions</text>
      {/* nodes */}
      <g strokeWidth="2.5">
        <rect x="24" y="70" width="220" height="76" rx="18" fill="#fff" stroke="#1770EF" />
        <rect x="304" y="70" width="236" height="76" rx="18" fill="#fff" stroke="#1770EF" />
        <rect x="24" y="300" width="220" height="76" rx="18" fill="#fff" stroke="#030D2D" />
        <rect x="304" y="250" width="236" height="76" rx="18" fill="#fff" stroke="#030D2D" />
        <rect x="304" y="350" width="236" height="76" rx="18" fill="#fff" stroke="#030D2D" />
        <rect x="616" y="190" width="250" height="76" rx="18" fill="#fff" stroke="#030D2D" strokeWidth="3" />
        <rect x="930" y="190" width="220" height="76" rx="18" fill="#fff" stroke="#1770EF" strokeWidth="3" />
        <rect x="1200" y="100" width="196" height="76" rx="18" fill="#EAF2FE" stroke="#1770EF" />
        <rect x="1200" y="300" width="196" height="76" rx="18" fill="#fff" stroke="#1770EF" />
      </g>
      <g textAnchor="middle">
        <text className="t" x="134" y="103">Gameplay Recorder</text>
        <text className="d" x="134" y="128">installed once on PC</text>
        <text className="t" x="422" y="103">Tester plays</text>
        <text className="d" x="422" y="128">records &amp; uploads itself</text>
        <text className="t" x="134" y="333">Existing footage</text>
        <text className="d" x="134" y="358">any playtest round</text>
        <text className="t" x="422" y="283">Browser upload</text>
        <text className="d" x="422" y="308">drag &amp; drop, up to 50</text>
        <text className="t" x="422" y="383">CLI upload</text>
        <text className="d" x="422" y="408">hundreds of clips</text>
        <text className="t" x="741" y="223">Gameplay Library</text>
        <text className="d" x="741" y="248">every session, one shelf</text>
        <text className="t" x="1040" y="223">User Test</text>
        <text className="d" x="1040" y="248">pick videos · report or ask</text>
        <text className="t" x="1298" y="133">Report</text>
        <text className="d" x="1298" y="158">findings with clips</text>
        <text className="t" x="1298" y="333">Answers</text>
        <text className="d" x="1298" y="358">ask on the same videos</text>
      </g>
    </svg>
  );
}

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
