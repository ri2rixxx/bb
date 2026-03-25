const BIN_ID = "9e3168f8d24c67097e40"; 
const BASE_URL = `https://api.npoint.io/${BIN_ID}`;

// Обязательно проверь наличие слова export перед const
export const getUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}?t=${Date.now()}`);
    const data = await res.json();
    return data.users || [];
  } catch (e) {
    return [];
  }
};

export const getSettings = async () => {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    return data.settings || { masterKey: "nstu2026" };
  } catch (e) {
    return { masterKey: "nstu2026" };
  }
};

export const saveData = async (users, settings, logs = []) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users, settings, logs })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};
