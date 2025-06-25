export function loadData(key, def) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : def;
  } catch {
    return def;
  }
}

export function saveData(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}
