const BIN_ID = "9e3168f8d24c67097e40"; 
const BASE_URL = `https://api.npoint.io/${BIN_ID}`;

export const getUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}?t=${Date.now()}`, { cache: 'no-store' });
    const data = await res.json();
    return Array.isArray(data.users) ? data.users : [];
  } catch (e) { 
    console.error("Fetch users error:", e);
    return []; 
  }
};

export const getSettings = async () => {
  try {
    const res = await fetch(`${BASE_URL}?t=${Date.now()}`, { cache: 'no-store' });
    const data = await res.json();
    return data.settings || { masterKey: "nstu2026" };
  } catch (e) { 
    return { masterKey: "nstu2026" }; 
  }
};

export const saveData = async (users, settings) => {
  const payload = {
    users: Array.isArray(users) ? users : [],
    settings: settings?.masterKey ? settings : { masterKey: "nstu2026" }
  };

  try {
    // Сначала пробуем PUT, так как это стандарт для npoint
    let res = await fetch(BASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // Если PUT не прошел, пробуем POST
    if (!res.ok) {
      res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
    return res.ok;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
};
