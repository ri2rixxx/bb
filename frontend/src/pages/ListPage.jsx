import React, { useState, useEffect } from "react";
import { getUsers, getSettings, saveData } from "../api";
import { Link } from "react-router-dom";

const ListPage = () => {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({ masterKey: "nstu2026" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const s = {
    page: { background: 'radial-gradient(circle at top right, #1e293b, #0f172a, #020617)', minHeight: '100vh', color: '#f8fafc', padding: '40px', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statCard: { flex: 1, background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' },
    searchBar: { width: '100%', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff', marginBottom: '20px', outline: 'none', boxSizing: 'border-box' },
    glassCard: { background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(12px)', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden' },
    navBtn: { padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' },
    th: { padding: '20px', textAlign: 'left', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', textTransform: 'uppercase' },
    td: { padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '15px' },
    level: (lvl) => ({ padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', background: lvl === 'High' ? '#ef4444' : lvl === 'Medium' ? '#f59e0b' : '#10b981', color: '#fff' }),
    actionBtn: (color) => ({ background: 'none', border: `1px solid ${color}`, color: color, padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', marginRight: '5px', fontWeight: 'bold' }),
    editInput: { background: '#0f172a', color: '#fff', border: '1px solid #38bdf8', borderRadius: '4px', padding: '5px', width: '90%' }
  };

  const loadData = async () => {
    setLoading(true);
    const u = await getUsers();
    const st = await getSettings();
    setUsers(u || []);
    setSettings(st || { masterKey: "nstu2026" });
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // СЕКРЕТНАЯ КОМБИНАЦИЯ С ПРОВЕРКОЙ СТАРОГО КЛЮЧА
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.ctrlKey && e.altKey && e.code === 'KeyA') {
        const oldKeyCheck = prompt("ПОДТВЕРДИТЕ ТЕКУЩИЙ МАСТЕР-КЛЮЧ:");
        
        if (oldKeyCheck === settings.masterKey) {
          const newKey = prompt("ВВЕДИТЕ НОВЫЙ МАСТЕР-КЛЮЧ:");
          if (newKey && newKey.length > 3) {
            const ok = await saveData(users, { masterKey: newKey });
            if (ok) {
              setSettings({ masterKey: newKey });
              alert("Ключ успешно обновлен в облаке!");
            }
          } else if (newKey) {
            alert("Слишком короткий ключ!");
          }
        } else if (oldKeyCheck !== null) {
          alert("ОТКАЗАНО В ДОСТУПЕ: Неверный старый ключ.");
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [users, settings]);

  const handleAdminLogin = () => {
    const pass = prompt("ВВЕДИТЕ МАСТЕР-КЛЮЧ:");
    if (pass === settings.masterKey) {
      setIsAdmin(true);
    } else {
      alert("НЕВЕРНЫЙ КОД");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Удалить субъекта?")) {
      const updated = users.filter(u => u.id !== id);
      const ok = await saveData(updated, settings);
      if (ok) setUsers(updated);
    }
  };

  const startEdit = (u) => {
    setEditId(u.id);
    setEditData({ ...u });
  };

  const handleSaveEdit = async () => {
    const updated = users.map(u => u.id === editId ? editData : u);
    const ok = await saveData(updated, settings);
    if (ok) {
      setUsers(updated);
      setEditId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={s.page}>ЗАГРУЗКА РЕЕСТРА...</div>;

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <h1 style={{ margin: 0 }}>SMART <span style={{ color: '#38bdf8' }}>SECURITY</span></h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Система управления ПДн</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {!isAdmin ? (
            <button onClick={handleAdminLogin} style={{ ...s.navBtn, background: '#334155', color: '#fff' }}>ВХОД</button>
          ) : (
            <button onClick={() => setIsAdmin(false)} style={{ ...s.navBtn, background: '#ef4444', color: '#fff' }}>ВЫХОД</button>
          )}
          <Link to="/add" style={{ ...s.navBtn, background: '#38bdf8', color: '#0f172a' }}>+ ДОБАВИТЬ</Link>
        </div>
      </header>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}>БАЗА ДАННЫХ</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{users.length} зап.</div>
        </div>
        <div style={s.statCard}>
          <div style={{ color: '#38bdf8', fontSize: '11px' }}>РЕЖИМ</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{isAdmin ? "ADMIN" : "VIEWER"}</div>
        </div>
      </div>

      <input style={s.searchBar} placeholder="Поиск по ФИО..." onChange={(e) => setSearchTerm(e.target.value)} />

      <div style={s.glassCard}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)' }}>
              <th style={s.th}>ФИО</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Статус</th>
              {isAdmin && <th style={s.th}>Действие</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td style={s.td}>
                  {editId === u.id ? 
                    <input style={s.editInput} value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} /> : 
                    (isAdmin || u.securityLevel === 'Low' ? u.name : '•••• ••••••••')}
                </td>
                <td style={s.td}>
                  {editId === u.id ? 
                    <input style={s.editInput} value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} /> : 
                    (isAdmin || u.securityLevel === 'Low' ? u.email : '***@***.ru')}
                </td>
                <td style={s.td}>
                  {editId === u.id ? (
                    <select style={s.editInput} value={editData.securityLevel} onChange={e => setEditData({...editData, securityLevel: e.target.value})}>
                      <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                    </select>
                  ) : <span style={s.level(u.securityLevel)}>{u.securityLevel}</span>}
                </td>
                {isAdmin && (
                  <td style={s.td}>
                    {editId === u.id ? (
                      <button onClick={handleSaveEdit} style={s.actionBtn('#10b981')}>OK</button>
                    ) : (
                      <>
                        <button onClick={() => startEdit(u)} style={s.actionBtn('#38bdf8')}>✎</button>
                        <button onClick={() => handleDelete(u.id)} style={s.actionBtn('#ef4444')}>✖</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPage;
