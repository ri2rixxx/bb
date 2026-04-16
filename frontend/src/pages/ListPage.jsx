import React, { useState, useEffect, useRef } from "react";
import { getUsers, getSettings, deleteUser, updateSettings } from '../api';
import { Link } from "react-router-dom";
import loadingImg from "../assets/1.jpg";

const ListPage = () => {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({ masterKey: "nstu2026" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [isPanic, setIsPanic] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [systemLogs, setSystemLogs] = useState([]);
  const fullLogHistory = useRef([]);

  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    loadData();
    return () => clearInterval(timeInterval);
  }, []);

  const addLog = (message, type = "INFO") => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] [${type}] ${message}`;
    setSystemLogs(prev => [entry, ...prev.slice(0, 18)]);
    fullLogHistory.current.push(entry);
  };

  const loadData = async () => {
    try {
      const [u, st] = await Promise.all([getUsers(), getSettings()]);
      setUsers(u || []);
      setSettings(st || { masterKey: "nstu2026" });
      addLog(`СИНХРОНИЗАЦИЯ БАЗЫ: ${u ? u.length : 0} ОБЪЕКТОВ`);
    } catch (err) {
      addLog("ОШИБКА ЯДРА СИСТЕМЫ", "CRITICAL");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const cur = prompt("ТЕКУЩИЙ МАСТЕР-КЛЮЧ:");
        if (cur === settings.masterKey) {
          const next = prompt("НОВЫЙ МАСТЕР-КЛЮЧ:");
          if (next?.trim()) {
            await updateSettings({ masterKey: next.trim() });
            setSettings(p => ({ ...p, masterKey: next.trim() }));
            addLog("КЛЮЧ БЕЗОПАСНОСТИ ОБНОВЛЕН", "SECURITY");
          }
        }
      }

      if (e.shiftKey && e.key === 'Escape') {
        setIsPanic(prev => !prev);
        addLog(isPanic ? "МАСКИРОВКА СНЯТА" : "РЕЖИМ ПАНИКИ АКТИВИРОВАН", "SYSTEM");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.masterKey, isPanic]);

  const handleAdminAuth = () => {
    if (isAdmin) {
      setIsAdmin(false);
      addLog("СЕССИЯ АДМИНИСТРАТОРА ЗАКРЫТА");
    } else {
      const input = prompt("КЛЮЧ_ДОСТУПА:");
      if (input === settings.masterKey) {
        setIsAdmin(true);
        addLog("ДОСТУП РАЗРЕШЕН", "AUTH");
      } else if (input !== null) {
        addLog("ОТКАЗ В ДОСТУПЕ: НЕВЕРНЫЙ КЛЮЧ", "WARNING");
      }
    }
  };

  const exportCSV = () => {
    const headers = "ID,NAME,EMAIL,LEVEL,TIMESTAMP\n";
    const rows = users.map(u => `${u.id},${u.name},${u.email},${u.securityLevel},${u.createdAt || 'N/A'}`).join("\n");
    const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `DB_DUMP_${new Date().getTime()}.csv`;
    link.click();
    addLog("БАЗА ДАННЫХ ЭКСПОРТИРОВАНА В CSV", "ADMIN");
  };

  const neon = { blue: '#38bdf8', red: '#ef4444', orange: '#f59e0b', green: '#10b981', bg: '#020617', border: '#1e293b' };

  if (loading) return (
    <div style={{ background: neon.bg, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: neon.blue, fontFamily: 'monospace' }}>
      <img src={loadingImg} style={{ width: '150px', borderRadius: '50%', border: `2px solid ${neon.blue}`, boxShadow: `0 0 30px ${neon.blue}`, marginBottom: '20px' }} alt="L" />
      <div style={{ letterSpacing: '5px' }}>[ ПОДКЛЮЧАЕМСЯ К БАЗОЧКЕ... ]</div>
    </div>
  );

  const safeUsers = users || [];
  const filtered = safeUsers
    .filter(u => !activeFilter || u.securityLevel === activeFilter)
    .filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ 
      background: neon.bg, minHeight: '100vh', padding: '35px', color: '#fff', fontFamily: 'monospace',
      backgroundImage: `linear-gradient(${neon.blue}05 1px, transparent 1px), linear-gradient(90deg, ${neon.blue}05 1px, transparent 1px)`,
      backgroundSize: '40px 40px', filter: isPanic ? 'blur(90px) brightness(0.1)' : 'none', transition: 'all 0.4s ease'
    }}>
      <style>{`
        .scanline { position: absolute; width: 100%; height: 2px; background: ${neon.blue}44; box-shadow: 0 0 10px ${neon.blue}; animation: s 5s linear infinite; pointer-events: none; z-index: 10; }
        @keyframes s { 0% { top: 0; } 100% { top: 100%; } }
        .row:hover { background: rgba(56, 189, 248, 0.05); }
        .neon-text { text-shadow: 0 0 10px ${neon.blue}; }
      `}</style>
      
      {}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: neon.blue, marginBottom: '15px', borderBottom: `1px solid ${neon.blue}33`, paddingBottom: '5px' }}>
        <span>ГДЕ НАХОДИШЬСЯ: СИБИРЬ МАТУШКА</span>
        <span className="neon-text">ВРЕМЕЧКО: {currentTime}</span>
      </div>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <h1 className="neon-text" style={{ margin: 0, color: neon.blue, fontSize: '24px' }}>РЕЕСТР СУБЪЕКТОВ</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          {isAdmin && (
            <button onClick={exportCSV} style={{ background: 'transparent', border: `1px solid ${neon.green}`, color: neon.green, padding: '10px 18px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
              [ CSV REPORT ]
            </button>
          )}
          <button onClick={handleAdminAuth} style={{ background: 'transparent', border: `1px solid ${isAdmin ? neon.red : neon.blue}`, color: isAdmin ? neon.red : neon.blue, padding: '10px 18px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
            {isAdmin ? '[ ВЫХОД АДМИН ]' : '[ АВТОРИЗАЦИЯ ]'}
          </button>
          <Link to="/add" style={{ background: neon.blue, color: neon.bg, padding: '10px 20px', textDecoration: 'none', fontWeight: 'bold', fontSize: '11px' }}>+ НОВЫЙ ОБЪЕКТ</Link>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '25px' }}>
        <div style={{ flex: 1 }}>
          {}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
            {[
              { k: null, l: 'ВСЕ', c: safeUsers.length, cl: neon.blue },
              { k: 'High', l: 'КРИТ', c: safeUsers.filter(u => u.securityLevel === 'High').length, cl: neon.red },
              { k: 'Medium', l: 'СРЕД', c: safeUsers.filter(u => u.securityLevel === 'Medium').length, cl: neon.orange },
              { k: 'Low', l: 'ОБЩ', c: safeUsers.filter(u => u.securityLevel === 'Low').length, cl: neon.green }
            ].map(s => (
              <div key={s.l} onClick={() => { setActiveFilter(s.k); addLog(`ФИЛЬТР: ${s.l}`); }} style={{ 
                flex: 1, padding: '15px', background: 'rgba(15, 23, 42, 0.7)', border: `1px solid ${activeFilter === s.k ? s.cl : neon.border}`, 
                cursor: 'pointer', textAlign: 'center', transition: '0.2s'
              }}>
                <div style={{ color: s.cl, fontSize: '9px', fontWeight: 'bold' }}>{s.l}</div>
                <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{s.c}</div>
              </div>
            ))}
          </div>

          {}
          <input 
            style={{ width: '100%', padding: '18px', background: 'rgba(2, 6, 23, 0.9)', border: `1px solid ${neon.blue}`, color: neon.blue, outline: 'none', marginBottom: '25px', boxSizing: 'border-box' }} 
            placeholder="> ВВЕДИТЕ ФИО ДЛЯ СКАНИРОВАНИЯ..." 
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length % 4 === 0) addLog(`ПОИСК: "${e.target.value}"`);
            }} 
          />

          {}
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: `1px solid ${neon.border}`, position: 'relative', overflow: 'hidden' }}>
            <div className="scanline"></div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: neon.blue, fontSize: '11px', textAlign: 'left', borderBottom: `2px solid ${neon.blue}`, background: 'rgba(56, 189, 248, 0.05)' }}>
                  <th style={{ padding: '15px' }}>ИДЕНТИФИКАТОР</th>
                  {isAdmin && <th style={{ padding: '15px' }}>ДАТА РЕГИСТРАЦИИ</th>}
                  <th style={{ padding: '15px', textAlign: 'center' }}>СТАТУС</th>
                  {isAdmin && <th style={{ padding: '15px', textAlign: 'right' }}>УПРАВЛЕНИЕ</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="row" style={{ borderBottom: `1px solid ${neon.border}` }}>
                    <td style={{ padding: '15px' }}>
                      {isAdmin || u.securityLevel === 'Low' ? (
                        <Link to={`/detail/${u.id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>{u.name.toUpperCase()}</Link>
                      ) : (
                        <span style={{ color: '#475569' }}>[ ДОСТУП ОГРАНИЧЕН ]</span>
                      )}
                    </td>
                    {isAdmin && <td style={{ padding: '15px', color: neon.blue, opacity: 0.6, fontSize: '12px' }}>{u.createdAt || "---"}</td>}
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ color: u.securityLevel === 'High' ? neon.red : (u.securityLevel === 'Medium' ? neon.orange : neon.green), border: '1px solid currentColor', padding: '2px 8px', fontSize: '9px', fontWeight: 'bold' }}>
                        {u.securityLevel.toUpperCase()}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        <button onClick={() => { if(window.confirm('КИКНУТЬ?')) deleteUser(u.id).then(loadData); }} style={{ color: neon.red, background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px' }}>[ КИКНУТЬ ]</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {}
        <div style={{ width: '320px', background: 'rgba(15, 23, 42, 0.7)', padding: '20px', borderLeft: `1px solid ${neon.blue}44`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: neon.blue, fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', borderBottom: `1px solid ${neon.blue}`, paddingBottom: '10px' }}>ЛОГ СОБЫТИЙ СИСТЕМЫ</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {systemLogs.map((log, i) => (
              <div key={i} style={{ fontSize: '10px', color: neon.blue, opacity: 1 - (i * 0.04), marginBottom: '8px', lineHeight: '1.3' }}>{`> ${log}`}</div>
            ))}
          </div>
          <button onClick={() => {
            const blob = new Blob([fullLogHistory.current.join("\n")], { type: 'text/plain' });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `LOGS_${new Date().getTime()}.txt`;
            a.click();
            addLog("ЛОГИ СЕАНСА СОХРАНЕНЫ");
          }} style={{ marginTop: '20px', background: 'transparent', border: `1px solid ${neon.blue}`, color: neon.blue, padding: '12px', fontSize: '11px', cursor: 'pointer' }}>
            [ СКАЧАТЬ_LOGS.TXT ]
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListPage;
