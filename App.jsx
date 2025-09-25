import React, { useMemo, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

// -----------------------------
// Full questionnaire (complete wording)
// -----------------------------
const questionnaire = {
  sections: [
    {
      id: "DP",
      title: "Defensive vs Progressive",
      leftLabel: "Defensive",
      rightLabel: "Progressive",
      items: [
        {
          id: "DP1",
          group: "Purpose",
          left: "Maintaining the status quo, making the most of existing capabilities and/or resources.",
          right: "Transforming and changing the organisation, creating new capabilities and/or resources.",
        },
        {
          id: "DP2",
          group: "Purpose",
          left:
            "Preventing threats, being prepared, controlling (e.g. cost) and safeguarding current capacity (e.g. required level of service).",
          right: "Prospecting for opportunities, challenging to improve performance and accomplish more.",
        },
        {
          id: "DP3",
          group: "Purpose",
          left: "Being predictable, having continuity, mitigating risk and reducing vulnerability.",
          right: "Growth, competition, targets and creating new business.",
        },
        { id: "DP4", group: "People", left: "Being cautious and reliable.", right: "Being competitive and achievement oriented." },
        {
          id: "DP5",
          group: "People",
          left:
            "Cascading clear rules, orders and instructions, how to complete core tasks, managing performance through both rewards and punishments.",
          right:
            "Setting ambitious stretch goals and inspiring people to follow and consulting with stakeholders to get ‘buy in’ to the strategy and initiatives.",
        },
        {
          id: "DP6",
          group: "People",
          left:
            "Fixing gaps in knowledge and skills in order to respond to incidents, unexpected events and crises.",
          right: "Creating new knowledge and skills in order to enhance capability and improve performance.",
        },
        {
          id: "DP7",
          group: "Process",
          left:
            "Planning, design and supervision of work - managing at an individual level to ensure the strategy is delivered.",
          right:
            "Setting vision, goals and objectives - creating a space for people to create their own ways of delivering the strategy.",
        },
        {
          id: "DP8",
          group: "Process",
          left:
            "Creating high levels of hierarchy, functional, administrative control systems, work orders, rules and codes of conduct, focusing on auditing, governance and regulation.",
          right:
            "Designing activities organised around geographical, market, or product and service groups: creating each with a clear set of targets aligned to the corporate plan.",
        },
        {
          id: "DP9",
          group: "Process",
          left:
            "Being conservative, mitigate loss and consequences and focused on avoiding the worst -case scenario.",
          right:
            "Being optimistic, maximise opportunities, and focused on generating the most favourable outcome.",
        },
        {
          id: "DP10",
          group: "Product",
          left:
            "Defending market share or position and/or profitability e.g. by making it harder for existing firms or alternatives to challenge.",
          right:
            "Growing position and/or market share and being a proactive market leader or service provider by initiating change to which competitors must react.",
        },
        {
          id: "DP11",
          group: "Product",
          left: "Maintaining the current service levels, delivering existing, trustworthy products and services.",
          right: "Continuously improving cost or features in existing products and/or services.",
        },
        {
          id: "DP12",
          group: "Product",
          left: "Dependability, Reliability, Sustainability.",
          right: "Market Share or position, Goal achievement, Short term growth or target achievement.",
        },
      ],
    },
    {
      id: "CF",
      title: "Consistent vs Flexible",
      leftLabel: "Consistent",
      rightLabel: "Flexible",
      items: [
        {
          id: "CF1",
          group: "Purpose",
          left:
            "Building agreement and support for the declared direction to ensure consistency and repeatability in day to day functioning and operations.",
          right:
            "Articulating the need to work together to create novel solutions and respond to new situations and demands.",
        },
        {
          id: "CF2",
          group: "Purpose",
          left: "Executing, implementing, performing existing work practices, processes and procedures.",
          right:
            "Enhancing flexibility and adaptability by imagining, creating and designing new ways of working.",
        },
        {
          id: "CF3",
          group: "Purpose",
          left: "Meeting set requirements, efficiency gain and improving quality standards.",
          right: "Innovation, forward thinking, being agile and cutting edge.",
        },
        { id: "CF4", group: "People", left: "Being systematic and consistent.", right: "Being creative and responsive." },
        {
          id: "CF5",
          group: "People",
          left: "Establishing common values and beliefs in order for people to work toward common expectations.",
          right:
            "Delegating to people who are closest to the problem/customer and empowering people by giving them the freedom and discretion to act.",
        },
        {
          id: "CF6",
          group: "People",
          left:
            "Complying with processes and work practices and living the organisational values and norms.",
          right:
            "Identifying new possibilities, demonstrating situational awareness and non-conventional thinking.",
        },
        {
          id: "CF7",
          group: "Process",
          left: "Standardising processes and ensuring clear roles and responsibilities.",
          right:
            "Cooperation and informal communication within and between different parts of the organisation acting collectively.",
        },
        {
          id: "CF8",
          group: "Process",
          left: "Centralising services and managing efficient, streamlined operations.",
          right:
            "Decentralising (e.g. networked, loose, project-based, ad hoc structure), constantly adapting, having low levels of hierarchy.",
        },
        {
          id: "CF9",
          group: "Process",
          left:
            "Using established responses, executing them as planned procedures and formal rules and vertical communication that specify what needs to be done and how, when problems occur.",
          right:
            "Allowing people to use their discretion and judgement, horizontal communication and team working to pool collective expertise to resolve problems as they occur.",
        },
        {
          id: "CF10",
          group: "Product",
          left:
            "Exploiting existing markets, capabilities and technologies, optimising existing business models - doing what we do better.",
          right:
            "Exploring new markets, capabilities, technologies and business models – being a first mover or disrupting existing markets / industries – doing different things.",
        },
        {
          id: "CF11",
          group: "Product",
          left: "Narrowing product/service lines, high-volume, transaction-oriented and standardised.",
          right:
            "Focusing on low-volume, highly responsive to customer’s needs, creating bespoke / customised solutions.",
        },
        {
          id: "CF12",
          group: "Product",
          left: "Being efficient, timely and consistent.",
          right: "Being innovative, responsive and customised.",
        },
      ],
    },
  ],
};

// -----------------------------
// Helpers
// -----------------------------
const makeInitialResponses = () => {
  const init = {};
  questionnaire.sections.forEach((s) => s.items.forEach((it) => (init[it.id] = { left: 0, right: 0 })));
  return init;
};

const calcTotals = (responses) => {
  let defensive = 0,
    progressive = 0,
    consistent = 0,
    flexible = 0;
  questionnaire.sections.forEach((s) =>
    s.items.forEach((it) => {
      const { left, right } = responses[it.id] || { left: 0, right: 0 };
      if (s.id === "DP") {
        defensive += left;
        progressive += right;
      } else {
        consistent += left;
        flexible += right;
      }
    })
  );
  return { defensive, progressive, consistent, flexible };
};

// Export helpers
const toCSV = (rows) => {
  if (!rows || rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
};

// -----------------------------
// App (plain UI)
// -----------------------------
export default function App() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState("AS IS");
  const [responsesByMode, setResponsesByMode] = useState({
    "AS IS": makeInitialResponses(),
    "TO BE": makeInitialResponses(),
  });

  const current = responsesByMode[mode];

  const setValue = (id, side, value) => {
    const v = Number(value);
    if (!Number.isInteger(v) || v < 0 || v > 10) return;
    setResponsesByMode((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], [id]: { ...prev[mode][id], [side]: v } },
    }));
  };

  const validity = useMemo(() => {
    const map = {};
    questionnaire.sections.forEach((s) =>
      s.items.forEach((it) => {
        const { left, right } = current[it.id];
        map[it.id] = left + right <= 10;
      })
    );
    return map;
  }, [current]);

  const totalsAsIs = useMemo(() => calcTotals(responsesByMode["AS IS"]), [responsesByMode]);
  const totalsToBe = useMemo(() => calcTotals(responsesByMode["TO BE"]), [responsesByMode]);

  const radarData = [
    { quadrant: "Defensive", asis: totalsAsIs.defensive, tobe: totalsToBe.defensive },
    { quadrant: "Progressive", asis: totalsAsIs.progressive, tobe: totalsToBe.progressive },
    { quadrant: "Consistent", asis: totalsAsIs.consistent, tobe: totalsToBe.consistent },
    { quadrant: "Flexible", asis: totalsAsIs.flexible, tobe: totalsToBe.flexible },
  ];

  // Export builders (current mode + both modes)
  const buildCurrentRow = () => {
    const row = {
      Name: name,
      Mode: mode,
    };
    const currentTotals = mode === "AS IS" ? totalsAsIs : totalsToBe;
    row.Defensive = currentTotals.defensive;
    row.Progressive = currentTotals.progressive;
    row.Consistent = currentTotals.consistent;
    row.Flexible = currentTotals.flexible;
    questionnaire.sections.forEach((s) =>
      s.items.forEach((it, i) => {
        const v = responsesByMode[mode][it.id] || { left: 0, right: 0 };
        row[`${s.id}_${i + 1}_Left`] = v.left;
        row[`${s.id}_${i + 1}_Right`] = v.right;
      })
    );
    return row;
  };

  const exportCurrentCSV = () => {
    const csv = toCSV([buildCurrentRow()]);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, `resilience_${name || "anon"}_${mode.replace(/\s+/g, "").toLowerCase()}.csv`);
  };

  const exportCurrentJSON = () => {
    const payload = {
      name,
      mode,
      responses: responsesByMode[mode],
      totals: mode === "AS IS" ? totalsAsIs : totalsToBe,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    downloadBlob(blob, `resilience_${name || "anon"}_${mode.replace(/\s+/g, "").toLowerCase()}.json`);
  };

  const exportBothCSV = () => {
    const row = { Name: name };
    const quadKey = (q) => ({ Defensive: "DEF", Progressive: "PROG", Consistent: "CONS", Flexible: "FLEX" }[q]);
    [
      ["Defensive", totalsAsIs.defensive, totalsToBe.defensive],
      ["Progressive", totalsAsIs.progressive, totalsToBe.progressive],
      ["Consistent", totalsAsIs.consistent, totalsToBe.consistent],
      ["Flexible", totalsAsIs.flexible, totalsToBe.flexible],
    ].forEach(([q, a, b]) => {
      const base = quadKey(q);
      row[`${base}_ASIS_total`] = a;
      row[`${base}_TOBE_total`] = b;
    });
    questionnaire.sections.forEach((s) =>
      s.items.forEach((it, i) => {
        const a = responsesByMode["AS IS"][it.id] || { left: 0, right: 0 };
        const b = responsesByMode["TO BE"][it.id] || { left: 0, right: 0 };
        row[`${s.id}_${i + 1}_ASIS_Left`] = a.left;
        row[`${s.id}_${i + 1}_ASIS_Right`] = a.right;
        row[`${s.id}_${i + 1}_TOBE_Left`] = b.left;
        row[`${s.id}_${i + 1}_TOBE_Right`] = b.right;
      })
    );
    const csv = toCSV([row]);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, `resilience_${name || "anon"}_bothmodes.csv`);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Instructions</h2>
      <p>
        This tool explores organisational resilience across four quadrants: <strong>Defensive</strong>, <strong>Progressive</strong>,
        <strong> Consistent</strong>, and <strong>Flexible</strong>.
      </p>
      <ul>
        <li>
          For each pair of statements, allocate up to <strong>10 points</strong> in total between the two sides (integers 0–10).
        </li>
        <li>Complete it twice: once for the current situation (<em>AS IS</em>) and once for the desired future state (<em>TO BE</em>).</li>
        <li>Totals and charts update live.</li>
      </ul>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Name: <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <label>
          Mode:
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option>AS IS</option>
            <option>TO BE</option>
          </select>
        </label>
      </div>

      {questionnaire.sections.map((sec) => (
        <div key={sec.id} style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
          <h3>{sec.title}</h3>
          {sec.items.map((it, idx) => {
            const v = current[it.id];
            const ok = validity[it.id];
            return (
              <div
                key={it.id}
                style={{ marginBottom: "0.75rem", border: ok ? "1px solid #ddd" : "1px solid red", padding: "0.75rem" }}
              >
                <div>
                  <strong>{it.group}</strong> (Pair {idx + 1})
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <div><strong>{sec.leftLabel}</strong></div>
                    <div style={{ fontSize: "0.9rem" }}>{it.left}</div>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      value={v.left}
                      onChange={(e) => setValue(it.id, "left", e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div><strong>{sec.rightLabel}</strong></div>
                    <div style={{ fontSize: "0.9rem" }}>{it.right}</div>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      value={v.right}
                      onChange={(e) => setValue(it.id, "right", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  Sum ≤ 10 · Current: <span style={{ color: v.left + v.right <= 10 ? "inherit" : "red" }}>{v.left + v.right}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <h3 style={{ marginTop: "1rem" }}>Totals (AS IS vs TO BE)</h3>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div>Defensive: {totalsAsIs.defensive} → {totalsToBe.defensive}</div>
        <div>Progressive: {totalsAsIs.progressive} → {totalsToBe.progressive}</div>
        <div>Consistent: {totalsAsIs.consistent} → {totalsToBe.consistent}</div>
        <div>Flexible: {totalsAsIs.flexible} → {totalsToBe.flexible}</div>
      </div>

      <h3 style={{ marginTop: "1rem" }}>Charts (Overlay)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", height: "420px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="80%">
            <PolarGrid />
            <PolarAngleAxis dataKey="quadrant" tick={{ fontSize: 12 }} tickMargin={20} />
            <PolarRadiusAxis angle={30} domain={[0, 120]} />
            <Radar name="AS IS" dataKey="asis" stroke="#1f77b4" fill="#1f77b4" fillOpacity={0.35} />
            <Radar name="TO BE" dataKey="tobe" stroke="#ff7f0e" fill="#ff7f0e" fillOpacity={0.25} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={radarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quadrant" interval={0} angle={-20} textAnchor="end" />
            <YAxis domain={[0, 120]} />
            <Tooltip />
            <Legend />
            <Bar name="AS IS" dataKey="asis" fill="#1f77b4" />
            <Bar name="TO BE" dataKey="tobe" fill="#ff7f0e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => setResponsesByMode((p) => ({ ...p, [mode]: makeInitialResponses() }))}>Reset (this mode)</button>
        <button onClick={exportCurrentCSV}>Export CSV (current mode)</button>
        <button onClick={exportCurrentJSON}>Export JSON (current mode)</button>
        <button onClick={exportBothCSV}>Export CSV (both modes)</button>
      </div>
    </div>
  );
}
