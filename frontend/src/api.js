const OWNER = "ri2rixxx";
const REPO = "bb";
const TOKEN = "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"; 
// Проверь, чтобы путь в репо был именно такой:
const URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents/frontend/src/db.json`;

export const getUsers = async () => {
  try {
    const res = await fetch(URL, { 
      headers: { Authorization: `token ${TOKEN}` },
      cache: 'no-store' 
    });
    const data = await res.json();
    // Корректный апдейт для кириллицы
    const content = JSON.parse(decodeURIComponent(escape(atob(data.content))));
    return content.users || [];
  } catch (e) { return []; }
};

export const getSettings = async () => {
  try {
    const res = await fetch(URL, { headers: { Authorization: `token ${TOKEN}` } });
    const data = await res.json();
    const content = JSON.parse(decodeURIComponent(escape(atob(data.content))));
    return content.settings || { ri2rixxx: "ri2rixxx" };
  } catch (e) { return { ri2rixxx: "ri2rixxx" }; }
};

export const saveData = async (users, settings) => {
  try {
    const getRes = await fetch(URL, { headers: { Authorization: `token ${TOKEN}` } });
    const getData = await getRes.json();
    
    // Кодируем обратно в Base64 с поддержкой русских букв
    const jsonString = JSON.stringify({ users, settings }, null, 2);
    const updatedContent = btoa(unescape(encodeURIComponent(jsonString)));

    const res = await fetch(URL, {
      method: "PUT",
      headers: {
        "Authorization": `token ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "database update",
        content: updatedContent,
        sha: getData.sha
      })
    });
    return res.ok;
  } catch (e) { return false; }
};
