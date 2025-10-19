import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";

const CACHE_KEY = "leaderboardTop10Cache_v1";

export default function LeaderboardTop10() {
  // Seed from cache so something shows after refresh
  const [rows, setRows] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(rows.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    // First try: composite-index live query (score desc + createdAt asc)
    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      orderBy("createdAt", "asc"),
      limit(10)
    );

    let unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }));
        setRows(list);
        setLoading(false);
        setError("");
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {}
      },
      async (err) => {
        console.warn("[Leaderboard] Composite query failed:", err?.code, err?.message);
        // If the composite index is missing or still building, fall back to a single-field query.
        setError(""); // clear visible error; we'll try fallback
        try {
          const qFallback = query(
            collection(db, "leaderboard"),
            orderBy("score", "desc"),
            limit(10)
          );
          const snap = await getDocs(qFallback);
          const list = snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }));
          setRows(list);
          setLoading(false);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(list));
          } catch {}
        } catch (e2) {
          console.error("[Leaderboard] Fallback query failed:", e2);
          setError("Failed to load leaderboard.");
          setLoading(false);
        }
      }
    );

    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, []);

  if (loading && rows.length === 0) {
    return (
      <div style={{ marginTop: "1rem", width: "100%", textAlign: "left", color: "#6b7280" }}>
        Loading leaderboard…
      </div>
    );
  }

  if (error && rows.length === 0) {
    return (
      <div style={{ marginTop: "1rem", width: "100%", textAlign: "left", color: "#b91c1c" }}>
        {error}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div style={{ marginTop: "1rem", width: "100%", textAlign: "left", color: "#6b7280" }}>
        No scores yet. Be the first!
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem", width: "100%", textAlign: "left" }}>
      <h3 style={{ color: "#1e3a8a", marginBottom: 6 }}>🌍 Leaderboard (Top 10)</h3>
      <div style={{ display: "grid", gap: 6 }}>
        {rows.map((r) => (
          <div
            key={r.id || `${r.name}-${r.score}-${r.rank}`}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr auto",
              gap: 10,
              alignItems: "center",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: "8px 12px",
            }}
          >
            <strong style={{ color: "#111" }}>#{r.rank}</strong>
            <div
              style={{
                textAlign: "left",
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={r.name}
            >
              {r.name}
            </div>
            <div style={{ fontWeight: 800, color: "#111" }}>{r.score}/10</div>
          </div>
        ))}
      </div>
    </div>
  );
}
