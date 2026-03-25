import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, getSettings, saveData } from '../api';

const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', securityLevel: 'Low' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    
    setLoading(true);
    try {
      const u = await getUsers();
      const st = await getSettings();
      
      // Создаем объект в точности как в твоем npoint (ID - число!)
      const newUser = { 
        id: Date.now(), 
        name: formData.name,
        email: formData.email,
        password: formData.password,
        securityLevel: formData.securityLevel
      };
      
      const success = await saveData([...u, newUser], st);
      
      if (success) {
        alert("Субъект успешно добавлен в систему!");
        navigate('/');
      } else {
        alert("Ошибка сервера при сохранении!");
      }
    } catch (err) {
      alert("Критическая ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: { background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: 'sans-serif' },
    card: { background: 'rgba(30, 41, 59, 0.7)', padding: '40px', borderRadius: '24px', width: '400px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' },
    input: { width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', boxSizing: 'border-box' },
    button: (valid) => ({ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: valid ? '#38bdf8' : '#334155', color: valid ? '#0f172a' : '#94a3b8', fontWeight: 'bold', cursor: valid ? 'pointer' : 'not-allowed', transition: '0.3s' })
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={{marginBottom: '10px'}}>Регистрация</h2>
        <p style={{color: '#94a3b8', marginBottom: '30px', fontSize: '14px'}}>Внесите данные субъекта в систему</p>
        <form onSubmit={handleSave}>
          <input style={s.input} placeholder="ФИО" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input style={s.input} type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <input style={s.input} type="password" placeholder="Пароль" required onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <select style={s.input} value={formData.securityLevel} onChange={e => setFormData({...formData, securityLevel: e.target.value})}>
            <option value="Low">Защита: Низкая</option>
            <option value="Medium">Защита: Средняя</option>
            <option value="High">Защита: Высокая</option>
          </select>

          <label style={{display: 'flex', gap: '10px', fontSize: '12px', color: '#94a3b8', marginBottom: '20px', cursor: 'pointer'}}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            Я согласен на обработку персональных данных
          </label>

          <button type="submit" style={s.button(agreed && !loading)} disabled={!agreed || loading}>
            {loading ? "СОХРАНЕНИЕ..." : "СОХРАНИТЬ"}
          </button>
          
          <Link to="/" style={{display: 'block', textAlign: 'center', marginTop: '20px', color: '#38bdf8', textDecoration: 'none', fontSize: '14px'}}>Вернуться к списку</Link>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
