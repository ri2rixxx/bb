import React, { useState, useEffect } from "react";
import { getUsers, getSettings, saveData } from "../api";
import { Link } from "react-router-dom";

const ListPage = () => {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({ ri2rixxx: "ri2rixxx" });
  const [isAdmin, setIsAdmin] = useState(false);

  const load = async () => {
    const u = await getUsers();
    const s = await getSettings();
    setUsers(u);
    setSettings(s);
  };

  useEffect(() => { 
    load(); 
    // Хоткей для смены ключа: Shift + Alt + K
    const handleKeys = (e) => {
        if (e.shiftKey && e.altKey && e.key === 'K') {
            const newK = prompt("НОВЫЙ МАСТЕР-КЛЮЧ:");
            if (newK) {
                const newSettings = { ri2rixxx: newK };
                saveData(users, newSettings).then(() => setSettings(newSettings));
            }
        }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [users]);

  return (
    <div style={{background: '#020617', minHeight: '100vh', color: '#fff', padding: '40px', fontFamily: 'sans-serif'}}>
      <header style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
        <h2 style={{color: '#38bdf8'}}>РЕЕСТР СУБЪЕКТОВ</h2>
        <div>
          <button onClick={() => {
            const p = prompt("ВВЕДИТЕ КЛЮЧ:");
            if (p === settings.ri2rixxx) setIsAdmin(true);
            else alert("ОТКАЗАНО");
          }} style={{marginRight: '15px', padding: '10px', cursor: 'pointer'}}>АДМИН</button>
          <Link to="/add" style={{background: '#38bdf8', padding: '10px 20px', color: '#000', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold'}}>+ ДОБАВИТЬ</Link>
        </div>
      </header>

      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{borderBottom: '2px solid #334155'}}>
            <th style={{padding: '15px', textAlign: 'left'}}>ФИО</th>
            <th style={{padding: '15px', textAlign: 'left'}}>УРОВЕНЬ</th>
            {isAdmin && <th style={{padding: '15px'}}>ДЕЙСТВИЕ</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{borderBottom: '1px solid #1e293b'}}>
              <td style={{padding: '15px'}}>{u.name}</td>
              <td style={{padding: '15px'}}>{u.securityLevel}</td>
              {isAdmin && <td style={{padding: '15px', textAlign: 'center'}}>✎</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPage;
