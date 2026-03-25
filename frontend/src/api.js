const BIN_ID = "9e3168f8d24c67097e40"; 
const BASE_URL = `https://api.npoint.io/${BIN_ID}`;

export const getUsers = async () => {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    return data.users || [];
  } catch (e) { return []; }
};

export const getSettings = async () => {
  try {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    // На скрине у тебя ключ называется "ri2rixxx", а не "masterKey"
    return data.settings || { ri2rixxx: "ri2rixxx" };
  } catch (e) { return { ri2rixxx: "ri2rixxx" }; }
};

export const saveData = async (users, settings) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users, settings })
    });
    return res.ok;
  } catch (e) { return false; }
};
