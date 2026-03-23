import axios from 'axios';

const BIN_ID = '69c0b96dc3097a1dd54e0419'; 
const MASTER_KEY = '$2a$10$yqXDSfRml6O4hbGFt.qyguo41TP.f5WFiYWWfCjVLydqzsSmsrlW.'; 

export const api = axios.create({
  baseURL: `https://api.jsonbin.io/v3/b/${BIN_ID}`,
  headers: {
    'X-Master-Key': MASTER_KEY,
    'Content-Type': 'application/json',
    'X-Bin-Versioning': 'false' 
  }
});

export const getUsers = async () => {
  try {
    const res = await api.get('/latest');
    // Проверяем наличие record и users, чтобы не упасть, если база пустая
    return res.data?.record?.users || [];
  } catch (e) {
    console.error("Ошибка при получении данных:", e);
    return [];
  }
};

export const saveUsers = async (usersList) => {
  try {
    // ВАЖНО: JSONBin всегда ожидает объект, в котором лежит твой массив
    await api.put('', { users: usersList });
    return true;
  } catch (e) {
    console.error("Ошибка при сохранении данных:", e);
    return false;
  }
};
