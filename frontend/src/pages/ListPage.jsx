import React, { useState, useEffect } from "react";
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
  const [loadingText, setLoadingText] = useState("Инициализация системы...");

  const loadData = async () => {
    setLoading(true);
    const [u, st] = await Promise.all([getUsers(), getSettings()]);
    setUsers(u || []);
    setSettings(st || { masterKey: "nstu2026" });
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // Анимация консольной загрузки
  useEffect(() => {
    if (loading) {
      const phrases = [
        "Установка соединения...",
        "Подключаемся к базочке...",
        "Авторизация в реестре...",
        "Получение зашифрованных данных...",
        "Доступ разрешен. Синхронизация..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(phrases[i % phrases.length]);
        i++;
      }, 600);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Смена мастер-ключа (Ctrl + Alt + A)
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const current = prompt("ТЕКУЩИЙ МАСТЕР-КЛЮЧ:");
        if (current === settings.masterKey) {
          const next = prompt("НОВЫЙ МАСТЕР-КЛЮЧ:");
          if (next?.trim()) {
            const success = await updateSettings({ masterKey: next.trim() });
            if (success) {
              setSettings({ ...settings, masterKey: next.trim() });
              alert("КЛЮЧ ОБНОВЛЕН");
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.masterKey]);

  const stats = {
    total: users.length,
    high: users.filter(u => u.securityLevel === 'High').length,
    medium: users.filter(u => u.securityLevel === 'Medium').length,
    low: users.filter(u => u.securityLevel === 'Low').length
  };

  // Функция генерации CSV отчета
  const downloadReport = () => {
    const headers = ["ID", "Name", "Email", "Security Level"];
    const rows = users.map(u => [
      u.id,
      u.name,
      u.email || "—",
      u.securityLevel
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `security_report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLevelStyle = (lvl) => {
    const map = {
      High: { color: '#ef4444', label: 'КРИТИЧЕСКИЙ', glow: '0 0 15px rgba(239, 68, 68, 0.3)' },
      Medium: { color: '#f59e0b', label: 'СРЕДНИЙ', glow: 'none' },
      Low: { color: '#38bdf8', label: 'ОБЩИЙ', glow: 'none' }
    };
    return map[lvl] || map.Low;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', 
        alignItems: 'center', height: '100vh', background: '#020617', fontFamily: 'monospace' 
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ position: 'relative', marginBottom: '30px' }}>
          <img src={loadingImg} style={{ width: '120px', borderRadius: '50%', border: '2px solid #38bdf8' }} alt="Loading" />
          <div style={{
            position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px',
            border: '2px solid transparent', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite'
          }} />
        </div>
        <div style={{ color: '#38bdf8', fontSize: '14px', letterSpacing: '2px' }}>{'>'} {loadingText}</div>
      </div>
    );
  }

  const filteredUsers = users
    .filter(u => !activeFilter || u.securityLevel === activeFilter)
    .filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ 
      background: '#020617', minHeight: '100vh', width: '100%', 
      margin: 0, padding: '40px', boxSizing: 'border-box',
      color: '#f8fafc', fontFamily: 'sans-serif' 
    }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>РЕЕСТР <span style={{ color: '#38bdf8' }}>ОБЪЕКТОВ</span></h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          {isAdmin && (
            <button 
              onClick={downloadReport}
              style={{ padding: '10px 20px', borderRadius: '6px', background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', cursor: 'pointer', fontWeight: 'bold' }}>
              ОТЧЕТ (.CSV)
            </button>
          )}
          <button 
            onClick={() => {
              if (isAdmin) setIsAdmin(false);
              else if (prompt("ВВЕДИТЕ КЛЮЧ:") === settings.masterKey) setIsAdmin(true);
            }} 
            style={{ padding: '10px 20px', borderRadius: '6px', background: isAdmin ? '#ef4444' : '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
            {isAdmin ? 'ВЫХОД [ADM]' : 'АДМИНИСТРАТОР'}
          </button>
          <Link to="/add" style={{ padding: '10px 20px', borderRadius: '6px', background: '#38bdf8', color: '#020617', textDecoration: 'none', fontWeight: 'bold' }}>+ ОБЪЕКТ</Link>
        </div>
      </header>

      {}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        {[
          { id: null, label: 'В базе', count: stats.total, color: '#94a3b8' },
          { id: 'High', label: 'Критический', count: stats.high, color: '#ef4444' },
          { id: 'Medium', label: 'Средний', count: stats.medium, color: '#f59e0b' },
          { id: 'Low', label: 'Общий', count: stats.low, color: '#38bdf8' }
        ].map(s => (
          <div key={s.label} onClick={() => setActiveFilter(s.id)} style={{ 
            flex: 1, padding: '20px', background: '#0f172a', borderRadius: '12px', 
            border: `1px solid ${activeFilter === s.id ? s.color : 'rgba(255,255,255,0.05)'}`, 
            cursor: 'pointer', textAlign: 'center', transition: '0.2s'
          }}>
            <div style={{ fontSize: '11px', color: s.color, textTransform: 'uppercase', marginBottom: '5px' }}>{s.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{s.count}</div>
          </div>
        ))}
      </div>

      {}
      <div style={{ width: '100%', marginBottom: '30px' }}>
        <input 
          style={{ 
            width: '100%', padding: '18px 25px', borderRadius: '12px', background: '#0f172a', 
            border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: '16px',
            outline: 'none', boxSizing: 'border-box'
          }} 
          placeholder="Поиск по реестру..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
              <th style={{ textAlign: 'left', padding: '20px' }}>Субъект</th>
              {isAdmin && <th style={{ textAlign: 'left', padding: '20px' }}>Email</th>}
              <th style={{ textAlign: 'center', padding: '20px' }}>Доступ</th>
              {isAdmin && <th style={{ textAlign: 'right', padding: '20px' }}>Управление</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => {
              const conf = getLevelStyle(u.securityLevel);
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '20px' }}>
                    {isAdmin || u.securityLevel === 'Low' 
                      ? <Link to={`/detail/${u.id}`} style={{ color: '#fff', textDecoration: 'none' }}>{u.name}</Link> 
                      : <span style={{ color: '#475569' }}>[ЗАСЕКРЕЧЕНО]</span>}
                  </td>
                  {isAdmin && <td style={{ padding: '20px', color: '#38bdf8', fontFamily: 'monospace' }}>{u.email || '—'}</td>}
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <span style={{ 
                      color: conf.color, border: `1px solid ${conf.color}44`, 
                      padding: '4px 12px', borderRadius: '4px', fontSize: '10px', 
                      fontWeight: 'bold', boxShadow: conf.glow 
                    }}>
                      {conf.label}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '20px', textAlign: 'right' }}>
                      <button onClick={() => deleteUser(u.id).then(loadData)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px' }}>УДАЛИТЬ</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPage;
