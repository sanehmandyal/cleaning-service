import { useEffect, useState } from 'react';
import { api } from './api.js';

export function useApi(url, deps = []) {
  const [state, set] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let alive = true;
    set((s) => ({ ...s, loading: true, error: null }));
    api.get(url).then((r) => alive && set({ data: r.data, loading: false, error: null }))
      .catch((e) => alive && set({ data: null, loading: false, error: e.response?.status === 404 ? 'notfound' : 'error' }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);
  return state;
}

// Keep the tab title/description in sync during client-side navigation.
// (The server already injects the correct head for the initial HTML response.)
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = description;
    }
  }, [title, description]);
}
