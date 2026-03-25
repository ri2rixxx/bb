const BIN_ID = "af97ea51c6cb0e69f2ef"; 
// Используем прокси для обхода блокировки CORS на Vercel
const PROXY = "https://corsproxy.io/?";
const BASE_URL = `${PROXY}https://api.npoint.io/${BIN_ID}`;

export const getUsers = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) return [];
    const data = await res.json();
    return data.users || [];
  } catch (e) {
    return [];
  }
};

export const getSettings = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) return { masterKey: "nstu2026" };
    const data = await res.json();
    return data.settings || { masterKey: "nstu2026" };
  } catch (e) {
    return { masterKey: "nstu2026" };
  }
};

export const saveData = async (users, settings) => {
  try {
    // Для PUT запроса через прокси используем прямой URL npoint в fetch, 
    // но добавляем corsproxy.io в начало
    const res = await fetch(`${PROXY}https://api.npoint.io/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users, settings })
    });
    return res.ok;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
};
