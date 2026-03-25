import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { getUsers, getSettings, saveData } from '../api';

const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', securityLevel: 'Low' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStrength = (p) => {
    if (!p) return { w: '0%', c: '#ccc' };
    if (p.length < 6) return { w: '33%', c: '#ef4444' };
    if (p.length < 10) return { w: '66%', c: '#f59e0b' };
    return { w: '100%', c: '#10b981' };
  };

  const strength = getStrength(formData.password);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const u = await getUsers();
    const st = await getSettings();
    const hash = bcrypt.hashSync(formData.password, 10);
    const newUser = { ...formData, id: Date.now(), password: hash };
    if (await saveData([...u, newUser], st)) {
      alert("Субъект зарегистрирован!");
      navigate('/');
    }
    setLoading(false);
  };

  const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', boxSizing: 'border-box' };

  return (
    <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '20px', width: '350px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2>Регистрация</h2>
        <form onSubmit={handleSave}>
          <input style={inputStyle} placeholder="ФИО" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input style={inputStyle} type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <input style={inputStyle} type="password" placeholder="Пароль" required onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <div style={{ height: '4px', background: '#334155', borderRadius: '2px', marginBottom: '15px' }}>
            <div style={{ width: strength.w, height: '100%', background: strength.c, transition: '0.3s' }}></div>
          </div>

          <select style={inputStyle} value={formData.securityLevel} onChange={e => setFormData({...formData, securityLevel: e.target.value})}>
            <option value="Low">Низкий уровень доступа</option>
            <option value="Medium">Средний уровень доступа</option>
            <option value="High">Критический (Скрыто)</option>
          </select>

          <button type="submit" disabled={!agreed || loading} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: agreed ? '#38bdf8' : '#334155', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'СОХРАНЕНИЕ...' : 'ЗАРЕГИСТРИРОВАТЬ'}
          </button>
          
          <label style={{ display: 'block', marginTop: '15px', fontSize: '12px', cursor: 'pointer' }}>
            <input type="checkbox" onChange={e => setAgreed(e.target.checked)} /> Согласен на обработку ПДн
          </label>
        </form>
        <Link to="/" style={{ color: '#38bdf8', display: 'block', textAlign: 'center', marginTop: '20px', textDecoration: 'none', fontSize: '13px' }}>Назад к списку</Link>
      </div>
    </div>
  );
};

export default FormPage;
