import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { getUsers, saveUsers } from '../api';

const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    securityLevel: 'Low' // Низкий, Средний, Высокий
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(formData.password, salt);
    const currentUsers = await getUsers();

    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: hashedPassword,
      securityLevel: formData.securityLevel,
      createdAt: new Date().toLocaleString('ru-RU')
    };

    const success = await saveUsers([...currentUsers, newUser]);
    if (success) {
      alert('Данные субъекта защищены и сохранены!');
      navigate('/');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 style={{ textAlign: 'center' }}>Регистрация в Реестре ПДн</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Полное ФИО" className="form-control" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email / Логин" className="form-control" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Пароль" className="form-control" onChange={e => setFormData({...formData, password: e.target.value})} required />
        
        <label>Уровень конфиденциальности:</label>
        <select className="form-control" value={formData.securityLevel} onChange={e => setFormData({...formData, securityLevel: e.target.value})}>
          <option value="Low">Низкий (Открыто)</option>
          <option value="Medium">Средний (Маскировка части данных)</option>
          <option value="High">Высокий (Полное скрытие)</option>
        </select>

        <button type="submit" className="btn-submit" style={{ backgroundColor: '#27ae60' }}>Зашифровать и добавить</button>
      </form>
    </div>
  );
};

export default FormPage;
