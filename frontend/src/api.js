const BIN_ID = "9e3168f8d24c67097e40"; 
const BASE_URL = `https://api.npoint.io/${BIN_ID}`;

const fetchAllData = async () => {
  const res = await fetch(`${BASE_URL}?t=${Date.now()}`, { cache: 'no-store' });
  return await res.json();
};

const pushAllData = async (payload) => {
  const res = await fetch(BASE_URL, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.ok;
};


export const getUsers = async () => {
  const data = await fetchAllData();
  return Array.isArray(data.users) ? data.users : [];
};

export const getSettings = async () => {
  const data = await fetchAllData();
  return data.settings || { masterKey: "nstu2026" };
};

export const updateSettings = async (newSettings) => {
  const data = await fetchAllData();
  return await pushAllData({ ...data, settings: newSettings });
};

export const createUser = async (newUser) => {
  const data = await fetchAllData();
  const updatedUsers = [...(data.users || []), { ...newUser, id: Date.now() }];
  return await pushAllData({ ...data, users: updatedUsers });
};

export const updateUser = async (id, updatedFields) => {
  const data = await fetchAllData();
  const updatedUsers = data.users.map(u => 
    u.id.toString() === id.toString() ? { ...u, ...updatedFields } : u
  );
  return await pushAllData({ ...data, users: updatedUsers });
};

export const deleteUser = async (id) => {
  const data = await fetchAllData();
  const updatedUsers = data.users.filter(u => u.id.toString() !== id.toString());
  return await pushAllData({ ...data, users: updatedUsers });
};
