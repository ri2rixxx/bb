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
    navBtn: { padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', transition: '0.3s' },
    th: { padding: '20px', textAlign: 'left', fontSize: '11px', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', textTransform: 'uppercase' },
    td: { padding: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '14px' },
    level: (lvl) => ({ padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', background: lvl === 'High' ? '#ef4444' : lvl === 'Medium' ? '#f59e0b' : '#10b981', color: '#fff' }),
    actionBtn: (c) => ({ background: 'none', border: `1px solid ${c}`, color: c, padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', marginRight: '5px' }),
    editInput: { background: '#0f172a', color: '#fff', border: '1px solid #38bdf8', borderRadius: '4px', padding: '4px', width: '90%' }
  };

  useEffect(() => { 
    const load = async () => {
      setLoading(true);
      const u = await getUsers();
      const st = await getSettings();
      setUsers(u); setSettings(st);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (e.ctrlKey && e.altKey && e.code === 'KeyA') {
        const old = prompt("ПОДТВЕРДИТЕ МАСТЕР-КЛЮЧ:");
        if (old === settings.masterKey) {
          const newK = prompt("НОВЫЙ МАСТЕР-КЛЮЧ:");
          if (newK && newK.length > 3) {
            if (await saveData(users, { masterKey: newK })) {
              setSettings({ masterKey: newK });
              alert("Ключ доступа изменен!");
            }
          }
        } else if (old) alert("ОШИБКА ДОСТУПА");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [users, settings]);

  const exportCSV = () => {
    const data = "Name,Email,Level\n" + users.map(u => `${u.name},${u.email},${u.securityLevel}`).join("\n");
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'audit_report.csv'; a.click();
  };

  const handleAdminLogin = () => {
    const p = prompt("КОД ДОСТУПА:");
    if (p === settings.masterKey) setIsAdmin(true);
    else alert("НЕВЕРНЫЙ КОД");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Удалить запись?")) {
      const upd = users.filter(u => u.id !== id);
      if (await saveData(upd, settings)) setUsers(upd);
    }
  };

  const handleSaveEdit = async () => {
    const upd = users.map(u => u.id === editId ? editData : u);
    if (await saveData(upd, settings)) { setUsers(upd); setEditId(null); }
  };

  const filtered = users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div style={s.page}>ПОДКЛЮЧЕНИЕ К РЕЕСТРУ...</div>;

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <h1 style={{ margin: 0 }}>SMART <span style={{ color: '#38bdf8' }}>SECURITY</span></h1>
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>v2.0: Реестр субъектов ПДн</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin && <button onClick={exportCSV} style={{ ...s.navBtn, background: '#10b981', color: '#fff' }}>ЭКСПОРТ</button>}
          <button onClick={isAdmin ? () => setIsAdmin(false) : handleAdminLogin} style={{ ...s.navBtn, background: isAdmin ? '#ef4444' : '#334155', color: '#fff' }}>
            {isAdmin ? 'ВЫХОД' : 'АДМИН'}
          </button>
          <Link to="/add" style={{ ...s.navBtn, background: '#38bdf8', color: '#0f172a' }}>+ ДОБАВИТЬ</Link>
        </div>
      </header>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={{ color: '#94a3b8', fontSize: '11px' }}>СУБЪЕКТОВ</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{users.length}</div>
        </div>
        <div style={s.statCard}>
          <div style={{ color: '#f87171', fontSize: '11px' }}>КРИТИЧЕСКИЙ УРОВЕНЬ</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f87171' }}>{users.filter(u => u.securityLevel === 'High').length}</div>
        </div>
      </div>

      <input style={s.searchBar} placeholder="Быстрый поиск по фамилии..." onChange={e => setSearchTerm(e.target.value)} />

      <div style={s.glassCard}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
              <th style={s.th}>ФИО</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Уровень</th>
              {isAdmin && <th style={s.th}>Опции</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td style={s.td}>{editId === u.id ? <input style={s.editInput} value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})}/> : (isAdmin || u.securityLevel !== 'High' ? u.name : '•••• ••••••••')}</td>
                <td style={s.td}>{editId === u.id ? <input style={s.editInput} value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})}/> : (isAdmin || u.securityLevel !== 'High' ? u.email : '***@***.ru')}</td>
                <td style={s.td}>{editId === u.id ? (
                  <select style={s.editInput} value={editData.securityLevel} onChange={e => setEditData({...editData, securityLevel: e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select>
                ) : <span style={s.level(u.securityLevel)}>{u.securityLevel}</span>}</td>
                {isAdmin && (
                  <td style={s.td}>
                    {editId === u.id ? <button onClick={handleSaveEdit} style={s.actionBtn('#10b981')}>OK</button> : (
                      <>
                        <button onClick={() => { setEditId(u.id); setEditData({...u}); }} style={s.actionBtn('#38bdf8')}>✎</button>
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
