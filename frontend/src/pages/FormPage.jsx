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
      
      const newUser = { 
        id: Date.now(), // Генерируем ЧИСЛО, а не строку
        name: formData.name,
        email: formData.email,
        password: formData.password,
        securityLevel: formData.securityLevel
      };
      
      const success = await saveData([...u, newUser], st);
      
      if (success) {
        alert("Записано!");
        navigate('/');
      } else {
        alert("Ошибка сервера при сохранении!");
      }
    } catch (err) {
      alert("Сбой: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: 'sans-serif'}}>
      <div style={{background: 'rgba(30, 41, 59, 0.7)', padding: '40px', borderRadius: '24px', width: '380px', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
        <h2 style={{marginBottom: '20px'}}>Регистрация</h2>
        <form onSubmit={handleSave}>
          <input style={{width: '100%', padding: '12px', marginBottom: '15px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px', boxSizing: 'border-box'}} placeholder="ФИО" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input style={{width: '100%', padding: '12px', marginBottom: '15px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px', boxSizing: 'border-box'}} type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <input style={{width: '100%', padding: '12px', marginBottom: '15px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px', boxSizing: 'border-box'}} type="password" placeholder="Пароль" required onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <select style={{width: '100%', padding: '12px', marginBottom: '20px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px'}} value={formData.securityLevel} onChange={e => setFormData({...formData, securityLevel: e.target.value})}>
            <option value="Low">Защита: Низкая</option>
            <option value="Medium">Защита: Средняя</option>
            <option value="High">Защита: Высокая</option>
          </select>

          <label style={{display: 'flex', gap: '10px', fontSize: '12px', marginBottom: '20px', cursor: 'pointer'}}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            Я согласен на обработку персональных данных
          </label>

          <button type="submit" disabled={!agreed || loading} style={{width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: agreed ? '#38bdf8' : '#334155', color: '#000', fontWeight: 'bold', cursor: 'pointer'}}>
            {loading ? "СОХРАНЕНИЕ..." : "ЗАПИСАТЬ"}
          </button>
          <Link to="/" style={{display: 'block', textAlign: 'center', marginTop: '15px', color: '#38bdf8', textDecoration: 'none'}}>Вернуться к списку</Link>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
