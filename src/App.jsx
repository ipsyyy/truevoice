import { useState } from "react";
import { scoreBrandVoice } from "./scorer";
import { scrapeUrl } from "./scraper";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [brandName, setBrandName] = useState("");
  const [tone, setTone] = useState(3);
  const [formality, setFormality] = useState(3);
  const [forbiddenWords, setForbiddenWords] = useState("");
  const [activeTab, setActiveTab] = useState("manual");
  const [url, setUrl] = useState("");
  const [manualMessages, setManualMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    if (!url) return;
    setScraping(true);
    setError(null);
    const result = await scrapeUrl(url);
    if (result.success) {
      setManualMessages(result.messages.join("\n"));
      setActiveTab("manual");
    } else {
      setError(result.error);
    }
    setScraping(false);
  };

  const handleAnalyze = async () => {
    const messages = manualMessages
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    if (!brandName) {
      setError("Please enter your brand name.");
      return;
    }
    if (messages.length < 3) {
      setError("Please enter at least 3 messages to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const brandConfig = { name: brandName, tone, formality, forbiddenWords };
      const data = await scoreBrandVoice(brandConfig, messages);
      setResults(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#d97706";
    return "#dc2626";
  };

  const getConsistencyLabel = (c) => {
    if (c === "Consistent") return { label: "Consistent", color: "#16a34a" };
    if (c === "Drifting") return { label: "Drifting", color: "#d97706" };
    return { label: "Fragmented", color: "#dc2626" };
  };

  const radarData = results
    ? [
        { dimension: "Tone", score: results.dimensions.tone },
        { dimension: "Formality", score: results.dimensions.formality },
        { dimension: "Personality", score: results.dimensions.personality },
        { dimension: "Vocabulary", score: results.dimensions.vocabulary },
        { dimension: "Visual", score: results.dimensions.visualLanguage },
      ]
    : [];

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#f5f5f5", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ borderBottom: "1px solid #222", padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: 32, height: 32, background: "#7c3aed", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>T</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>TrueVoice</div>
          <div style={{ fontSize: 12, color: "#888" }}>Brand voice consistency scorer</div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>

        {/* Brand Setup */}
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "1rem", fontSize: 14, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em" }}>Brand Setup</div>
          
          <input
            placeholder="Brand name (e.g. Liquid Death)"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", color: "#f5f5f5", fontSize: 14, marginBottom: "1rem", boxSizing: "border-box" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <div style={{ fontSize: 13, color: "#aaa", marginBottom: 6 }}>Tone: {tone === 1 ? "Very Irreverent" : tone === 2 ? "Irreverent" : tone === 3 ? "Neutral" : tone === 4 ? "Sincere" : "Very Sincere"}</div>
              <input type="range" min={1} max={5} value={tone} onChange={(e) => setTone(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555" }}>
                <span>Irreverent</span><span>Sincere</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#aaa", marginBottom: 6 }}>Formality: {formality === 1 ? "Very Casual" : formality === 2 ? "Casual" : formality === 3 ? "Neutral" : formality === 4 ? "Professional" : "Very Professional"}</div>
              <input type="range" min={1} max={5} value={formality} onChange={(e) => setFormality(Number(e.target.value))} style={{ width: "100%", accentColor: "#7c3aed" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555" }}>
                <span>Casual</span><span>Professional</span>
              </div>
            </div>
          </div>

          <input
            placeholder="Words this brand would NEVER use (e.g. synergy, leverage)"
            value={forbiddenWords}
            onChange={(e) => setForbiddenWords(e.target.value)}
            style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", color: "#f5f5f5", fontSize: 14, boxSizing: "border-box" }}
          />
        </div>

        {/* Content Input */}
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontWeight: 600, marginBottom: "1rem", fontSize: 14, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em" }}>Brand Messages</div>

          <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
            <button onClick={() => setActiveTab("url")} style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #333", background: activeTab === "url" ? "#7c3aed" : "#111", color: "#f5f5f5", cursor: "pointer", fontSize: 13 }}>Fetch from URL</button>
            <button onClick={() => setActiveTab("manual")} style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid #333", background: activeTab === "manual" ? "#7c3aed" : "#111", color: "#f5f5f5", cursor: "pointer", fontSize: 13 }}>Paste Manually</button>
          </div>

          {activeTab === "url" && (
            <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
              <input
                placeholder="Paste a public URL (e.g. Reddit post, blog)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ flex: 1, background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", color: "#f5f5f5", fontSize: 14 }}
              />
              <button onClick={handleScrape} disabled={scraping} style={{ padding: "10px 20px", background: "#7c3aed", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                {scraping ? "Fetching..." : "Fetch"}
              </button>
            </div>
          )}

          <textarea
            placeholder={"Paste one message per line (minimum 3):\n\nMurder your thirst.\nDeath to plastic.\nYour hydration is our business."}
            value={manualMessages}
            onChange={(e) => setManualMessages(e.target.value)}
            rows={8}
            style={{ width: "100%", background: "#111", border: "1px solid #333", borderRadius: 8, padding: "10px 14px", color: "#f5f5f5", fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
          />
          <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>{manualMessages.split("\n").filter((m) => m.trim().length > 0).length} messages entered</div>
        </div>

        {error && (
          <div style={{ background: "#2a1a1a", border: "1px solid #dc2626", borderRadius: 8, padding: "12px 16px", marginBottom: "1rem", fontSize: 14, color: "#fca5a5" }}>{error}</div>
        )}

        <button onClick={handleAnalyze} disabled={loading} style={{ width: "100%", padding: "14px", background: loading ? "#444" : "#7c3aed", border: "none", borderRadius: 10, color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginBottom: "2rem" }}>
          {loading ? "Analyzing voice consistency..." : "Analyze Brand Voice"}
        </button>

        {/* Results */}
        {results && (
          <div>
            {/* Overall Score */}
            <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#aaa", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Overall Voice Consistency</div>
              <div style={{ fontSize: 72, fontWeight: 800, color: getScoreColor(results.overallScore), lineHeight: 1 }}>{results.overallScore}</div>
              <div style={{ fontSize: 14, color: "#888", marginBottom: 12 }}>out of 100</div>
              <div style={{ display: "inline-block", padding: "4px 16px", borderRadius: 20, background: getConsistencyLabel(results.consistency).color + "22", color: getConsistencyLabel(results.consistency).color, fontWeight: 600, fontSize: 14 }}>
                {getConsistencyLabel(results.consistency).label}
              </div>
              <div style={{ marginTop: "1rem", fontSize: 14, color: "#ccc", fontStyle: "italic", maxWidth: 500, margin: "1rem auto 0" }}>"{results.diagnosis}"</div>
            </div>

            {/* Radar Chart */}
            <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 13, color: "#aaa", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Voice Dimension Breakdown</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                {Object.entries(results.dimensions).map(([key, val]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#111", borderRadius: 8 }}>
                    <span style={{ fontSize: 13, color: "#aaa", textTransform: "capitalize" }}>{key === "visualLanguage" ? "Visual Language" : key}</span>
                    <span style={{ fontWeight: 700, color: getScoreColor(val), fontSize: 16 }}>{val}</span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: "#888", fontSize: 12 }} />
                  <Radar dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Flagged Messages */}
            <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 12, padding: "1.5rem" }}>
              <div style={{ fontSize: 13, color: "#aaa", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Most Inconsistent Messages</div>
              {results.flaggedMessages.map((msg, i) => (
                <div key={i} style={{ borderBottom: i < results.flaggedMessages.length - 1 ? "1px solid #222" : "none", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 6, fontWeight: 600 }}>ORIGINAL</div>
                  <div style={{ fontSize: 14, color: "#f5f5f5", background: "#111", padding: "10px 14px", borderRadius: 8, marginBottom: 8, borderLeft: "3px solid #dc2626" }}>"{msg.original}"</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>⚠ {msg.issue}</div>
                  <div style={{ fontSize: 12, color: "#16a34a", marginBottom: 6, fontWeight: 600 }}>SUGGESTED REWRITE</div>
                  <div style={{ fontSize: 14, color: "#f5f5f5", background: "#111", padding: "10px 14px", borderRadius: 8, borderLeft: "3px solid #16a34a" }}>"{msg.rewrite}"</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}