import { useState } from "react";
import { WordCloud3D } from "./Wordcloud";
import "./styles.css";

interface WordItem {
  word: string;
  weight: number;
}

function App() {
  const [url, setUrl] = useState("");
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);

  const analyzeArticle = async () => {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setWords(data.words || []);
      setShowKeywords(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <div className="header">
        <h1>3D Word Cloud</h1>

        <div className="controls">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL..."
            className="url-input"
          />

          <button onClick={analyzeArticle} className="btn blue-btn">
            Analyze
          </button>

          {words.length > 0 && (
            <button
              onClick={() => setShowKeywords((p) => !p)}
              className="btn green-btn"
            >
              {showKeywords ? "Hide Keywords" : "Show Keywords"}
            </button>
          )}
        </div>
      </div>

      {/* MAIN CLOUD AREA */}
      <div className="cloud-wrapper">
        {loading && <p className="loading-text">Analyzing...</p>}

        {!loading && words.length === 0 && (
          <p className="loading-text">
            Enter an article URL and press <b>Analyze</b>.
          </p>
        )}

        {!loading && words.length > 0 && (
          <div className="cloud-fullscreen">
            <WordCloud3D words={words} />
          </div>
        )}
      </div>

      {/* KEYWORD PANEL OVERLAY */}
      {showKeywords && (
        <div className="keyword-panel">
          <div className="keyword-header">
            <h2>Keywords</h2>
            <button className="close-btn" onClick={() => setShowKeywords(false)}>
              ✕
            </button>
          </div>

          <ul className="keyword-list">
            {words.map((w, i) => (
              <li key={i}>
                <strong>{w.word}</strong> — {w.weight.toFixed(4)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
