import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, ensureAnonAuth } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function SubmitScore({ score }) {
  const [name, setName] = useState(() => localStorage.getItem("endlessLastName") || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Persist last used name for endless mode
  useEffect(() => {
    localStorage.setItem("endlessLastName", name);
  }, [name]);

  async function handleSubmit() {
    setError("");
    const trimmed = name.trim();
    if (!trimmed) return setError("Please enter a name");
    if (trimmed.length > 20) return setError("Name too long (max 20 chars)");

    try {
      setBusy(true);
      await ensureAnonAuth();
      await addDoc(collection(db, "endlessLeaderboard"), {
        name: trimmed,
        score: Math.max(0, Number(score)), // streak length, no upper cap
        createdAt: serverTimestamp(),      // server-side time
      });

      // Back to landing so the user sees the leaderboard
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
      setError("Could not submit score. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // If they got 0, don't bother asking to submit
  if (score <= 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>
        Add your endless streak to the global leaderboard?
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={20}
          disabled={busy}
          style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db" }}
        />
        <button className="primary-btn" onClick={handleSubmit} disabled={busy}>
          {busy ? "Saving..." : "Submit"}
        </button>
      </div>
      {error && (
        <div style={{ marginTop: 6, color: "#b91c1c", fontWeight: 600 }}>
          {error}
        </div>
      )}
      <div style={{ marginTop: 6, color: "#6b7280" }}>
        You’ll be taken to the endless leaderboard after submitting.
      </div>
    </div>
  );
}
