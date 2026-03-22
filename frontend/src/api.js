import axios from 'axios';

export const api = axios.create({
  // Твой новый живой адрес из Localtunnel
  baseURL: 'http://better-zebras-reply.loca.lt',
  headers: {
    // Этот заголовок отключает страницу-предупреждение localtunnel
    'Bypass-Tunnel-Reminder': 'true'
  }
});
