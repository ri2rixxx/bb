const OWNER = "ri2rixxx"; // Твой ник на Гитхабе
const REPO = "bb"; // Название твоего репозитория
const TOKEN = "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"; // Тот, что ты создала в Settings
const URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/src/db.json`;

export const getUsers = async () => {
  try {
    const res = await fetch(URL, { headers: { Authorization: `token ${TOKEN}` } });
    const data = await res.json();
    const content = JSON.parse(atob(data.content)); // Декодируем из Base64
    return content.users || [];
  } catch (e) { return []; }
};

export const getSettings = async () => {
  try {
    const res = await fetch(URL, { headers: { Authorization: `token ${TOKEN}` } });
    const data = await res.json();
    const content = JSON.parse(atob(data.content));
    return content.settings || { ri2rixxx: "ri2rixxx" };
  } catch (e) { return { ri2rixxx: "ri2rixxx" }; }
};

export const saveData = async (users, settings) => {
  try {
    // 1. Получаем текущую версию файла (нужен SHA)
    const getRes = await fetch(URL, { headers: { Authorization: `token ${TOKEN}` } });
    const getData = await getRes.json();
    
    // 2. Отправляем обновление
    const res = await fetch(URL, {
      method: "PUT",
      headers: {
        "Authorization": `token ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update db",
        content: btoa(JSON.stringify({ users, settings }, null, 2)),
        sha: getData.sha
      })
    });
    return res.ok;
  } catch (e) { return false; }
};
