const SESSION_STORAGE_KEY = "shopbot_session_id";

export function getStoredSessionId(): string | null {
  if (typeof localStorage === "undefined") {
    return null;
  }

  return localStorage.getItem(SESSION_STORAGE_KEY);
}

export function storeSessionId(sessionId: string): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
}

export function clearStoredSessionId(): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(SESSION_STORAGE_KEY);
}
