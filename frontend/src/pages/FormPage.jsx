import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

export default function FormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    accessLevel: 'Low'
  });
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (id) {
      api.get(`/users/${id}`)
        .then(res => {
          setFormData(res.data);
          setAgreed(true);
        })
        .catch(err => console.error("Ошибка архива:", err));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("ВНИМАНИЕ: Регистрация невозможна без подтверждения согласия на обработку ПДн.");
      return;
    }

    try {
      if (id) {
        await api.put(`/users/${id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      navigate('/');
    } catch (err) {
      alert("ОШИБКА СИСТЕМЫ: Запись отклонена сервером.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formWrapper}>
        {}
        <div style={topLine(formData.accessLevel)}></div>
        
        <header style={headerStyle}>
          <h2 style={titleStyle}>
            {id ? ` РЕДАКТИРОВАНИЕ ОБЪЕКТА ID_${id.toString().slice(-4)}` : ' РЕГИСТРАЦИЯ В РЕЕСТРЕ ПДн'}
          </h2>
          <p style={subtitleStyle}>МОДУЛЬ ВВОДА ДАННЫХ В ЗАЩИЩЕННЫЙ КОНТУР</p>
        </header>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>ФИО СУБЪЕКТА:</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="Иванов Иван Иванович"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>ЭЛЕКТРОННАЯ ПОЧТА:</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="user@secure-link.ru"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>ПАРОЛЬ / КЛЮЧ ДОСТУПА:</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
            <small style={hintStyle}>* Данные будут захешированы по алгоритму SHA-256</small>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>КАТЕГОРИЯ КРИТИЧНОСТИ ДАННЫХ:</label>
            <select
              style={selectStyle}
              value={formData.accessLevel}
              onChange={e => setFormData({ ...formData, accessLevel: e.target.value })}
            >
              <option value="Low">🟢 НИЗКАЯ (ОБЩЕДОСТУПНЫЕ)</option>
              <option value="Medium">🟡 СРЕДНЯЯ (ДЛЯ СЛУЖЕБНОГО ПОЛЬЗОВАНИЯ)</option>
              <option value="High">🔴 ВЫСОКАЯ (КОНФИДЕНЦИАЛЬНО)</option>
            </select>
          </div>

          {}
          <div style={checkboxWrapper}>
            <input
              id="consent"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={checkboxStyle}
            />
            <label htmlFor="consent" style={checkboxLabel}>
              Подтверждаю наличие <span style={{color: '#00d2ff'}}>письменного согласия</span> субъекта на обработку ПДн в соответствии с требованиями Федерального закона №152-ФЗ.
            </label>
          </div>

          <div style={actionsStyle}>
            <button type="button" onClick={() => navigate('/')} style={btnCancel}>
              ОТМЕНА
            </button>
            <button type="submit" style={btnSubmit}>
              {id ? 'ОБНОВИТЬ ЗАПИСЬ' : 'ВНЕСТИ В БАЗУ'}
            </button>
          </div>
        </form>
      </div>
      
      <div style={consoleStyle}>
        STATUS: 0x00A1 // NODE: MASTER_RECEPTION // ENCRYPTION: ENABLED
      </div>
    </div>
  );
}

const containerStyle = {
  backgroundColor: '#0a0e14',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: "'JetBrains Mono', monospace",
  color: '#e0e0e0',
  padding: '20px'
};

const formWrapper = {
  backgroundColor: '#0d121a',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '16px',
  border: '1px solid #1f2633',
  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
  overflow: 'hidden'
};

const topLine = (level) => ({
  height: '5px',
  width: '100%',
  backgroundColor: level === 'High' ? '#ff3e3e' : level === 'Medium' ? '#f1c40f' : '#00ff88',
  boxShadow: `0 0 15px ${level === 'High' ? '#ff3e3e' : level === 'Medium' ? '#f1c40f' : '#00ff88'}`
});

const headerStyle = { padding: '40px 40px 10px', textAlign: 'center' };
const titleStyle = { margin: 0, fontSize: '1.1rem', letterSpacing: '1px', color: '#fff' };
const subtitleStyle = { fontSize: '0.6rem', opacity: 0.4, marginTop: '12px', letterSpacing: '2px' };
const formStyle = { padding: '20px 40px 40px' };
const inputGroup = { marginBottom: '20px' };

const labelStyle = {
  display: 'block',
  fontSize: '0.7rem',
  color: '#64748b',
  marginBottom: '8px',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#070a0f',
  border: '1px solid #1f2633',
  borderRadius: '6px',
  color: '#00ff88',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

const selectStyle = { ...inputStyle, cursor: 'pointer' };
const hintStyle = { fontSize: '0.55rem', color: '#4a5568', marginTop: '6px', display: 'block' };

const checkboxWrapper = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  marginTop: '20px',
  padding: '12px',
  background: 'rgba(255,255,255,0.02)',
  borderRadius: '8px',
  border: '1px dashed #1f2633'
};

const checkboxStyle = { marginTop: '3px', cursor: 'pointer', accentColor: '#00d2ff' };
const checkboxLabel = { fontSize: '0.65rem', color: '#94a3b8', lineHeight: '1.5', cursor: 'pointer' };

const actionsStyle = { display: 'flex', gap: '15px', marginTop: '30px' };

const btnSubmit = {
  flex: 2,
  padding: '14px',
  backgroundColor: '#00d2ff',
  color: '#000',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.8rem',
  boxShadow: '0 0 15px rgba(0, 210, 255, 0.3)'
};

const btnCancel = {
  flex: 1,
  padding: '14px',
  backgroundColor: 'transparent',
  color: '#64748b',
  border: '1px solid #1f2633',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.8rem'
};

const consoleStyle = { marginTop: '20px', fontSize: '0.55rem', color: '#1f2633', letterSpacing: '3px' };
