import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUsers, getSettings, deleteUser } from '../api';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isPanic, setIsPanic] = useState(false);

  const loadData = async () => {
    setLoading(true);
    console.log(`%c[SECURITY]: Запрос на чтение объекта UID: ${id}`, "color: #38bdf8; font-weight: bold;");
    
    const all = await getUsers();
    const found = all.find(u => u.id.toString() === id);
    
    if (!found) {
      console.error(`[ERROR]: Объект ${id} не обнаружен в базе.`);
      setLoading(false);
      return;
    }

    const settings = await getSettings();

    // Проверка прав доступа
    if (found.securityLevel === 'High') {
      const pass = prompt("ВНИМАНИЕ: КРИТИЧЕСКИЙ УРОВЕНЬ. Введите мастер-ключ:");
      if (pass !== settings.masterKey) {
        console.warn(`%c[ALERT]: Попытка несанкционированного доступа к High-объекту!`, "color: white; background: red;");
        return setAccessDenied(true);
      }
    } else if (found.securityLevel === 'Medium') {
      const pass = prompt("Доступ ограничен. Введите ключ:");
      if (pass !== settings.masterKey) return setAccessDenied(true);
    }
    
    setUser(found);
    setLoading(false);
    console.log(`%c[SUCCESS]: Досье объекта ${found.name} расшифровано.`, "color: #10b981;");
  };

  useEffect(() => { loadData(); }, [id]);

  // Слушатель для Panic Button (Shift + Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key === 'Escape') {
        setIsPanic(!isPanic);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPanic]);

  const handleDelete = async () => {
    const settings = await getSettings();
    const pass = prompt("Для удаления субъекта подтвердите мастер-ключ:");
    
    if (pass !== settings.masterKey) {
      alert("ОТКАЗАНО: Неверный ключ администратора");
      console.error("[SECURITY]: Отказ в удалении: неверный пароль.");
      return;
    }

    if (window.confirm(`Вы уверены, что хотите безвозвратно удалить субъекта ${user.name}?`)) {
      setLoading(true);
      const success = await deleteUser(id);
      
      if (success) {
        console.log(`%c[SYSTEM]: Объект ${id} изъят из базы данных.`, "color: #ef4444;");
        alert("Субъект успешно удален из реестра");
        navigate('/');
      } else {
        alert("Ошибка при удалении данных");
        setLoading(false);
      }
    }
  };

  const handleEdit = () => navigate(`/edit/${id}`);

  const s = {
    wrap: { 
      background: '#020617', 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: 'monospace',
      filter: isPanic ? 'blur(25px) grayscale(1)' : 'none',
      transition: 'all 0.4s ease'
    },
    card: { 
      background: '#0f172a', 
      padding: '40px', 
      borderRadius: '24px', 
      width: '420px', 
      border: '1px solid #1e293b', 
      color: '#fff', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      position: 'relative',
      overflow: 'hidden'
    },
    label: { color: '#64748b', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '2px' },
    val: { fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '8px', color: '#f8fafc' },
    timeBox: { background: 'rgba(56, 189, 248, 0.03)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.1)', marginBottom: '20px' },
    btnRow: { display: 'flex', gap: '15px', marginTop: '30px' },
    btn: (bg, color = '#fff') => ({ 
      flex: 1, padding: '14px', borderRadius: '10px', border: 'none', 
      color: color, fontWeight: 'bold', cursor: 'pointer', background: bg, 
      transition: 'transform 0.2s', fontSize: '12px', letterSpacing: '1px' 
    }),
    scanLine: {
      position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
      background: 'rgba(56, 189, 248, 0.5)', boxShadow: '0 0 15px #38bdf8',
      animation: 'scan 3s linear infinite'
    }
  };

  if (loading) return (
    <div style={s.wrap}>
      <div style={{color: '#38bdf8', letterSpacing: '5px'}}>DECRYPTING...</div>
    </div>
  );
  
  if (accessDenied) return (
    <div style={s.wrap}>
      <div style={{...s.card, borderColor: '#ef4444', textAlign: 'center'}}>
        <h2 style={{color: '#ef4444', letterSpacing: '2px'}}>ACCESS DENIED</h2>
        <p style={{color: '#64748b', fontSize: '14px', margin: '20px 0'}}>Недостаточно привилегий для чтения протокола.</p>
        <Link to="/" style={{color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px'}}>ВЕРНУТЬСЯ В РЕЕСТР</Link>
      </div>
    </div>
  );

  if (!user) return <div style={s.wrap}><div style={{color: '#ef4444'}}>OBJECT NOT FOUND</div></div>;

  return (
    <div style={s.wrap}>
      <style>{`@keyframes scan { 0% { top: 0; } 100% { top: 100%; } }`}</style>
      <div style={s.card}>
        <div style={s.scanLine} />
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
          <h2 style={{color: '#38bdf8', margin: 0, fontSize: '20px'}}>DOSSIER: {user.id.toString().slice(-6)}</h2>
          <span style={{
            background: user.securityLevel === 'High' ? '#ef4444' : (user.securityLevel === 'Medium' ? '#f59e0b' : '#10b981'), 
            padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'
          }}>
            {user.securityLevel.toUpperCase()}
          </span>
        </div>
        
        <div style={s.label}>Субъект</div>
        <div style={s.val}>{user.name}</div>
        
        <div style={s.label}>Канал связи (Email)</div>
        <div style={s.val}>{user.email}</div>
        
        <div style={s.timeBox}>
          <div style={s.label}>Дата регистрации в NSTU_NETI</div>
          <div style={{...s.val, marginBottom: 0, fontSize: '13px', border: 'none', color: '#38bdf8'}}>
            {user.createdAt 
              ? new Date(user.createdAt).toLocaleString('ru-RU', { 
                  day: '2-digit', month: 'short', year: 'numeric', 
                  hour: '2-digit', minute: '2-digit' 
                }) 
              : "ДАТА НЕ УКАЗАНА"}
          </div>
        </div>

        <div style={s.label}>Системный отпечаток (UID)</div>
        <div style={{fontSize: '11px', color: '#475569', wordBreak: 'break-all'}}>{user.id}</div>

        <div style={s.btnRow}>
          <button onClick={handleEdit} style={s.btn('#1e293b')}>РЕДАКТИРОВАТЬ</button>
          <button onClick={handleDelete} style={s.btn('#450a0a', '#f87171')}>УДАЛИТЬ</button>
        </div>

        <Link to="/" style={{display: 'block', marginTop: '30px', textAlign: 'center', color: '#475569', textDecoration: 'none', fontSize: '12px', letterSpacing: '1px'}}>
          {'<<'} ЗАКРЫТЬ ДОКУМЕНТ
        </Link>
      </div>
    </div>
  );
};

export default DetailPage;
