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

const CACHE_KEY = "endlessLeaderboardTop10Cache_v1";

function formatDate(value) {
  if (!value) return "";
  let date;
  if (value.toDate) {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    const t = Date.parse(value);
    if (Number.isNaN(t)) return "";
    date = new Date(t);
  }
  return date.toLocaleDateString("en-GB");
}

export default function LeaderboardTop10() {
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
    const q = query(
      collection(db, "endlessLeaderboard"),
      orderBy("score", "desc"),
      orderBy("createdAt", "asc"),
      limit(10)
    );

    let unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d, i) => {
          const data = d.data();
          return {
            id: d.id,
            rank: i + 1,
            name: data.name,
            score: data.score,
            createdAt: data.createdAt,
          };
        });
        setRows(list);
        setLoading(false);
        setError("");
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(
              list.map((r) => ({
                ...r,
                createdAt: r.createdAt?.toDate?.() || r.createdAt,
              }))
            )
          );
        } catch {}
      },
      async (err) => {
        console.warn("[Endless Leaderboard] Composite query failed:", err?.code, err?.message);
        setError("");
        try {
          const qFallback = query(
            collection(db, "endlessLeaderboard"),
            orderBy("score", "desc"),
            limit(10)
          );
          const snap = await getDocs(qFallback);
          const list = snap.docs.map((d, i) => {
            const data = d.data();
            return {
              id: d.id,
              rank: i + 1,
              name: data.name,
              score: data.score,
              createdAt: data.createdAt,
            };
          });
          setRows(list);
          setLoading(false);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify(
                list.map((r) => ({
                  ...r,
                  createdAt: r.createdAt?.toDate?.() || r.createdAt,
                }))
              )
            );
          } catch {}
        } catch (e2) {
          console.error("[Endless Leaderboard] Fallback query failed:", e2);
          setError("Failed to load endless leaderboard.");
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
        Loading endless leaderboard…
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
        No endless scores yet. Be the first!
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1rem", width: "100%", textAlign: "left" }}>
      <h3 style={{ color: "#1e3a8a", marginBottom: 6 }}>🌍 Endless Leaderboard (Top 10)</h3>
      <div
      style={{
        display: "grid",
        gap: 6,
        maxHeight: "260px",      
        overflowY: "auto",
        paddingRight: "4px",     
      }}
    >
        {rows.map((r) => (
          <div
            key={r.id || `${r.name}-${r.score}-${r.rank}`}
            style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr auto auto",
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
            <div style={{ fontWeight: 700, color: "#111", fontSize: "0.95rem" }}>
              Streak: {r.score}
            </div>
            <div style={{ color: "#6b7280", fontSize: "0.85rem", textAlign: "right" }}>
              {formatDate(r.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
