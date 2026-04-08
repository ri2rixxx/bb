import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getUsers, getSettings, deleteUser } from '../api';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const all = await getUsers();
    const found = all.find(u => u.id.toString() === id);
    
    if (!found) {
      setLoading(false);
      return;
    }

    const settings = await getSettings();

    // Проверка прав доступа при входе
    if (found.securityLevel === 'High') {
      const pass = prompt("ВНИМАНИЕ: КРИТИЧЕСКИЙ УРОВЕНЬ. Введите мастер-ключ:");
      if (pass !== settings.masterKey) return setAccessDenied(true);
    } else if (found.securityLevel === 'Medium') {
      const pass = prompt("Доступ ограничен. Введите ключ:");
      if (pass !== settings.masterKey) return setAccessDenied(true);
    }
    
    setUser(found);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  const handleDelete = async () => {
    const settings = await getSettings();
    const pass = prompt("Для удаления субъекта подтвердите мастер-ключ:");
    
    if (pass !== settings.masterKey) {
      alert("ОТКАЗАНО: Неверный ключ администратора");
      return;
    }

    if (window.confirm(`Вы уверены, что хотите безвозвратно удалить субъекта ${user.name}?`)) {
      setLoading(true);
      const success = await deleteUser(id);
      
      if (success) {
        alert("Субъект успешно удален из реестра");
        navigate('/');
      } else {
        alert("Ошибка при удалении данных");
        setLoading(false);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const s = {
    wrap: { background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' },
    card: { background: '#1e293b', padding: '40px', borderRadius: '24px', width: '420px', border: '1px solid #334155', color: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' },
    label: { color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '1px' },
    val: { fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid #334155', paddingBottom: '8px', color: '#f8fafc' },

    timeBox: { background: 'rgba(56, 189, 248, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.1)', marginBottom: '20px' },
    btnRow: { display: 'flex', gap: '10px', marginTop: '30px' },
    btn: (bg) => ({ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', background: bg, transition: 'opacity 0.2s' })
  };

  if (loading) return <div style={s.wrap}><div style={{color: '#38bdf8', fontSize: '1.2rem'}}>СИНХРОНИЗАЦИЯ...</div></div>;
  
  if (accessDenied) return (
    <div style={s.wrap}>
      <div style={{...s.card, borderColor: '#ef4444', textAlign: 'center'}}>
        <h2 style={{color: '#ef4444'}}>ДОСТУП ЗАБЛОКИРОВАН</h2>
        <p style={{color: '#94a3b8'}}>Недостаточно привилегий для просмотра досье.</p>
        <Link to="/" style={{color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold'}}>Вернуться в реестр</Link>
      </div>
    </div>
  );

  if (!user) return <div style={s.wrap}><div style={{color: '#ef4444'}}>СУБЪЕКТ НЕ НАЙДЕН</div></div>;

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px'}}>
          <h2 style={{color: '#38bdf8', margin: 0}}>ДОСЬЕ №{user.id.toString().slice(-6)}</h2>
          <span style={{background: user.securityLevel === 'High' ? '#ef4444' : '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'}}>
            {user.securityLevel}
          </span>
        </div>
        
        <div style={s.label}>Полное имя субъекта</div>
        <div style={s.val}>{user.name}</div>
        
        <div style={s.label}>Зарегистрированный Email</div>
        <div style={s.val}>{user.email}</div>
        
        {}
        <div style={s.timeBox}>
          <div style={s.label}>Время внесения в реестр</div>
          <div style={{...s.val, marginBottom: 0, fontSize: '14px', border: 'none', color: '#38bdf8'}}>
            {user.createdAt 
              ? new Date(user.createdAt).toLocaleString('ru-RU', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) 
              : "МЕТКА ВРЕМЕНИ ОТСУТСТВУЕТ"}
          </div>
        </div>

        <div style={s.label}>Системный идентификатор (UID)</div>
        <div style={{fontSize: '12px', color: '#64748b', fontFamily: 'monospace', marginBottom: '20px'}}>{user.id}</div>

        <div style={s.btnRow}>
          <button onClick={handleEdit} style={s.btn('#334155')}>РЕДАКТИРОВАТЬ</button>
          <button onClick={handleDelete} style={s.btn('#7f1d1d')}>УДАЛИТЬ</button>
        </div>

        <Link to="/" style={{display: 'block', marginTop: '25px', textAlign: 'center', color: '#64748b', textDecoration: 'none', fontSize: '13px'}}>
          ← Закрыть досье
        </Link>
      </div>
    </div>
  );
};

export default DetailPage;
