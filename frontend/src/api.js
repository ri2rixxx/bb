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
    return data.settings || { masterKey: "ri2rixxx" };
  } catch (e) { 
    return { masterKey: "ri2rixxx" }; 
  }
};

export const saveData = async (users, settings) => {
  const payload = {
    users: Array.isArray(users) ? users : [],
    settings: settings || { masterKey: "nstu2026" }
  };

  try {
    const res = await fetch(BASE_URL, {
      method: "POST", // POST на npoint работает стабильнее с CORS
      headers: { 
        "Content-Type": "application/json",
        // Убираем лишние заголовки, чтобы не провоцировать CORS
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    return true;
  } catch (e) {
    console.error("Save error:", e);
    return false;
  }
};
