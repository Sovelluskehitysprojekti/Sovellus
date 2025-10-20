// Simple OpenTDB session token manager with localStorage persistence

const LS_KEY = "opentdb_token_v1";
const TOKEN_API = "https://opentdb.com/api_token.php";

// Optional: expire tokens after a day (OpenTDB tokens are session-based,
// but this makes sure we don't cling to a borked token forever)
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function now() {
  return Date.now();
}

export function getStoredToken() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { token, ts } = JSON.parse(raw);
    if (!token) return null;
    if (ts && now() - ts > MAX_AGE_MS) return null;
    return token;
  } catch {
    return null;
  }
}

export async function requestNewToken() {
  const url = `${TOKEN_API}?command=request`;
  const res = await fetch(url);
  const data = await res.json(); // { response_code, response_message, token }
  if (data?.response_code === 0 && data.token) {
    localStorage.setItem(LS_KEY, JSON.stringify({ token: data.token, ts: now() }));
    return data.token;
  }
  // As a fallback, clear any stored junk
  localStorage.removeItem(LS_KEY);
  return null;
}

export async function resetToken() {
  const token = getStoredToken();
  if (!token) return requestNewToken();
  const url = `${TOKEN_API}?command=reset&token=${token}`;
  const res = await fetch(url);
  const data = await res.json(); // { response_code, ... }
  if (data?.response_code === 0) {
    // After reset, keep same token
    localStorage.setItem(LS_KEY, JSON.stringify({ token, ts: now() }));
    return token;
  }
  // If reset failed, try requesting a completely new one
  return requestNewToken();
}

export async function ensureToken() {
  let token = getStoredToken();
  if (token) return token;
  token = await requestNewToken();
  return token;
}
