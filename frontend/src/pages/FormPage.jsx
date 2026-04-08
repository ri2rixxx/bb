import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { getUsers, getSettings, createUser, updateUser } from '../api';

const FormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [formData, setFormData] = useState({ name: '', email: '', password: '', securityLevel: 'Low' });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchUser = async () => {
        try {
          const users = await getUsers();
          const userToEdit = users.find(u => u.id.toString() === id);
          if (userToEdit) {
            setFormData({ ...userToEdit, password: '' });
            setAgreed(true); 
          }
        } catch (err) {
          console.error("Ошибка загрузки данных:", err);
        }
      };
      fetchUser();
    }
  }, [id]);

  const formatName = (val) => {
    return val.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
  };

  const validate = () => {
    const errs = {};

    const nameParts = formData.name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      errs.name = "Введите Фамилию и Имя полностью";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errs.email = "Некорректный формат почты";
    }

    if (!isEdit || formData.password) {
      if (formData.password.length < 8) {
        errs.password = "Минимум 8 символов";
      } else if (!/[0-9]/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
        errs.password = "Нужна цифра и спецсимвол (!@#$)";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      let success = false;
      const dataToSend = { ...formData };

      if (formData.password) {
        dataToSend.password = bcrypt.hashSync(formData.password, 10);
      } else if (isEdit) {
        delete dataToSend.password;
      }

      if (isEdit) {
        success = await updateUser(id, dataToSend);
      } else {
        dataToSend.createdAt = new Date().toISOString();
        success = await createUser(dataToSend);
      }

      if (success) navigate('/');
      else alert("Ошибка записи в базу данных");
    } catch (err) {
      console.error(err);
      alert("Критическая ошибка при сохранении");
    } finally {
      setLoading(false);
    }
  };

  const s = {
    wrap: { background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
    card: { background: '#0f172a', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' },
    label: { display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' },
    input: (hasError) => ({
      width: '100%', padding: '14px', borderRadius: '12px', background: '#020617', border: `1px solid ${hasError ? '#ef4444' : '#1e293b'}`,
      color: '#fff', marginBottom: '20px', outline: 'none', boxSizing: 'border-box'
    }),
    errText: { color: '#ef4444', fontSize: '11px', marginTop: '-15px', marginBottom: '15px' },
    btn: {
      width: '100%', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
      background: (agreed && !loading) ? '#38bdf8' : '#334155', color: (agreed && !loading) ? '#0f172a' : '#94a3b8',
      transition: '0.2s'
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <h2 style={{ color: '#fff', marginBottom: '30px', textAlign: 'center' }}>
          {isEdit ? 'ОБНОВЛЕНИЕ ДАННЫХ' : 'РЕГИСТРАЦИЯ СУБЪЕКТА'}
        </h2>
        <form onSubmit={handleSave}>
          
          <label style={s.label}>ФИО Субъекта</label>
          <input 
            style={s.input(errors.name)} 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            onBlur={e => setFormData({...formData, name: formatName(e.target.value)})}
            placeholder="Иванов Иван"
          />
          {errors.name && <div style={s.errText}>{errors.name}</div>}

          <label style={s.label}>Email / Логин</label>
          <input 
            style={s.input(errors.email)}
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="user@nstu.ru"
          />
          {errors.email && <div style={s.errText}>{errors.email}</div>}

          <label style={s.label}>{isEdit ? 'Новый пароль (оставьте пустым для сохранения)' : 'Пароль доступа'}</label>
          <input 
            type="password"
            style={s.input(errors.password)}
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <div style={s.errText}>{errors.password}</div>}

          <label style={s.label}>Уровень безопасности</label>
          <select 
            style={s.input()}
            value={formData.securityLevel}
            onChange={e => setFormData({...formData, securityLevel: e.target.value})}
          >
            <option value="Low">Low (Public)</option>
            <option value="Medium">Medium (Internal)</option>
            <option value="High">High (Confidential)</option>
          </select>

          <button type="submit" disabled={!agreed || loading} style={s.btn}>
            {loading ? 'ЗАПИСЬ...' : (isEdit ? 'ПОДТВЕРДИТЬ ИЗМЕНЕНИЯ' : 'ВНЕСТИ В РЕЕСТР')}
          </button>

          {!isEdit && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', color: '#64748b', fontSize: '12px' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
              Подтверждаю согласие на обработку данных
            </label>
          )}
        </form>
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: '#38bdf8', textDecoration: 'none', fontSize: '12px' }}>ВЕРНУТЬСЯ В СПИСОК</Link>
      </div>
    </div>
  );
};

export default FormPage;
