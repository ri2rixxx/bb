import { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

export default function ListPage() {
  const [users, setUsers] = useState([]);
  const [showRawData, setShowRawData] = useState(false);

  const loadUsers = () => {
    api.get('/users').then(res => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
    const handleKeyDown = async (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        const newPin = prompt("🛠️ ИНИЦИАЛИЗАЦИЯ МАСТЕР-КЛЮЧА\nВведите новый код администратора:");
        if (newPin && newPin.length >= 4) {
          try {
            await api.post('/admin/setup', { pin: newPin });
            alert("✅ Ключ успешно прошит в систему.");
          } catch (err) { alert("❌ Ошибка инициализации."); }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleMasking = async () => {
    if (!showRawData) {
      const pin = prompt("🔐 ТРЕБУЕТСЯ АВТОРИЗАЦИЯ\nВведите код офицера безопасности:");
      if (!pin) return;
      try {
        const res = await api.post('/admin/verify', { pin });
        if (res.data.success) setShowRawData(true);
      } catch (err) { alert("❌ ОТКАЗАНО: Неверный токен доступа."); }
    } else {
      setShowRawData(false);
    }
  };

  const renderSecureName = (name, level) => {
    if (showRawData) return <span style={unmaskedText}>{name}</span>;
    if (level === 'High') return <span style={maskedBadge}>[ЗАШИФРОВАНО]</span>;
    if (level === 'Medium') return <span style={mediumText}>{name[0] + " •••• " + name.slice(-1)}</span>;
    return <span style={lowText}>{name}</span>;
  };

  return (
    <div style={containerStyle}>
      {}
      <div style={headerStyle}>
        <div>
          <h1 style={logoStyle}>🛡️ СЕКТОР<span style={{color: '#00d2ff'}}>ПДн</span> <small style={versionStyle}>v2.4.0</small></h1>
          <div style={statusWrapper}>
            <div style={showRawData ? pulseRed : pulseGreen}></div>
            <span style={statusTextStyle}>
              {showRawData ? "КРИТИЧЕСКИЙ УРОВЕНЬ: ДОСТУП К ОТКРЫТЫМ ДАННЫМ" : "ЗАЩИТА АКТИВНА: МАСКИРОВАНИЕ ВКЛЮЧЕНО"}
            </span>
          </div>
        </div>
        <button onClick={handleToggleMasking} style={showRawData ? btnDanger : btnPrimary}>
          {showRawData ? "🔴 ЗАБЛОКИРОВАТЬ" : "🔓 СНЯТЬ ЗАЩИТУ"}
        </button>
      </div>

      {}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardLabel}>ВСЕГО СУБЪЕКТОВ</div>
          <div style={cardValue}>{users.length}</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabel}>АЛГОРИТМ ШИФРОВАНИЯ</div>
          <div style={cardValue}>AES-256-GCM</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabel}>ДОСТУПНОСТЬ УЗЛА</div>
          <div style={{...cardValue, color: '#00ff88'}}>99.9%</div>
        </div>
      </div>

      {}
      <div style={tableWrapper}>
        <div style={tableHeaderAction}>
          <h2 style={{margin: 0, fontSize: '1.2rem'}}>РЕЕСТР ОБРАБОТКИ / АУДИТ</h2>
          <Link to="/add" style={addUserBtn}>+ РЕГИСТРАЦИЯ</Link>
        </div>
        
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeadRow}>
              <th style={thStyle}>ХЕШ_ID</th>
              <th style={thStyle}>СУБЪЕКТ_ПДн</th>
              <th style={thStyle}>УРОВЕНЬ_ДОСТУПА</th>
              <th style={thStyle}>ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={trStyle}>
                <td style={idCol}>{user.id.toString().slice(-6)}</td>
                <td style={tdStyle}>{renderSecureName(user.name, user.accessLevel)}</td>
                <td style={tdStyle}>
                   <span style={getClearanceStyle(user.accessLevel)}>
                     {user.accessLevel === 'High' ? 'ВЫСОКИЙ' : user.accessLevel === 'Medium' ? 'СРЕДНИЙ' : 'НИЗКИЙ'}
                   </span>
                </td>
                <td style={tdStyle}>
                  <div style={{display: 'flex', gap: '15px'}}>
                    <Link to={`/edit/${user.id}`} style={iconBtnEdit}>⚙️</Link>
                    <button onClick={() => api.delete(`/users/${user.id}`).then(loadUsers)} style={iconBtnDel}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const containerStyle = { backgroundColor: '#0a0e14', minHeight: '100vh', color: '#e0e0e0', fontFamily: "'JetBrains Mono', monospace", padding: '40px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '30px', borderBottom: '1px solid #1a1f29', marginBottom: '30px' };
const logoStyle = { margin: 0, fontSize: '1.8rem', letterSpacing: '2px' };
const versionStyle = { fontSize: '0.7rem', opacity: 0.5, verticalAlign: 'middle' };
const statusWrapper = { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' };
const statusTextStyle = { fontSize: '0.8rem', letterSpacing: '1px', opacity: 0.8 };
const pulseGreen = { width: '10px', height: '10px', backgroundColor: '#00ff88', borderRadius: '50%', boxShadow: '0 0 10px #00ff88' };
const pulseRed = { width: '10px', height: '10px', backgroundColor: '#ff3e3e', borderRadius: '50%', boxShadow: '0 0 10px #ff3e3e' };
const gridStyle = { display: 'flex', gap: '20px', marginBottom: '40px' };
const cardStyle = { flex: 1, background: 'linear-gradient(145deg, #121721, #0d121a)', padding: '20px', borderRadius: '12px', border: '1px solid #1f2633' };
const cardLabel = { fontSize: '0.7rem', color: '#64748b', marginBottom: '8px' };
const cardValue = { fontSize: '1.4rem', fontWeight: 'bold' };
const tableWrapper = { background: '#0d121a', borderRadius: '16px', border: '1px solid #1f2633', padding: '20px' };
const tableHeaderAction = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { textAlign: 'left', padding: '15px', color: '#64748b', fontSize: '0.75rem', borderBottom: '1px solid #1f2633' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #131924' };
const trStyle = { transition: '0.3s' };
const tableHeadRow = { background: 'rgba(255,255,255,0.02)' };
const idCol = { padding: '15px', opacity: 0.4, fontSize: '0.8rem', borderBottom: '1px solid #131924' };
const btnPrimary = { background: 'transparent', border: '1px solid #00d2ff', color: '#00d2ff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const btnDanger = { background: '#ff3e3e', border: 'none', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const addUserBtn = { background: '#00d2ff', color: '#000', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' };
const maskedBadge = { background: 'rgba(255,62,62,0.1)', color: '#ff3e3e', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' };
const mediumText = { color: '#f1c40f', opacity: 0.9 };
const lowText = { color: '#00ff88' };
const unmaskedText = { color: '#ff3e3e', fontWeight: 'bold', textShadow: '0 0 5px rgba(255,62,62,0.4)' };
const iconBtnEdit = { textDecoration: 'none', filter: 'grayscale(1)', opacity: 0.6 };
const iconBtnDel = { background: 'none', border: 'none', cursor: 'pointer', filter: 'grayscale(1)', opacity: 0.6 };
const getClearanceStyle = (level) => {
  const base = { fontSize: '0.65rem', padding: '4px 10px', borderRadius: '20px', border: '1px solid' };
  if (level === 'High') return { ...base, color: '#ff3e3e', borderColor: '#ff3e3e', background: 'rgba(255,62,62,0.1)' };
  if (level === 'Medium') return { ...base, color: '#f1c40f', borderColor: '#f1c40f', background: 'rgba(241,196,15,0.1)' };
  return { ...base, color: '#00ff88', borderColor: '#00ff88', background: 'rgba(0,255,136,0.1)' };
};
