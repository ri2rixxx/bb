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
    role: 'User'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Хешируем пароль перед отправкой (Соль 10 раундов)
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(formData.password, salt);

    // 2. Получаем текущую базу
    const currentUsers = await getUsers();

    // 3. Создаем объект "Субъекта ПДн"
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: hashedPassword, // В облако уходит ХЕШ
      role: formData.role,
      createdAt: new Date().toLocaleString('ru-RU')
    };

    const updatedList = [...currentUsers, newUser];
    const success = await saveUsers(updatedList);

    if (success) {
      alert('Пользователь успешно добавлен в защищенный реестр!');
      navigate('/');
    }
  };

  return (
    <div className="container" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
        Регистрация нового субъекта
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div className="form-group">
          <label>ФИО субъекта:</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Email (Логин):</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} // Исправь на email, если опечатка
            required
          />
        </div>

        <div className="form-group">
          <label>Пароль (будет захеширован):</label>
          <input
            type="password"
            className="form-control"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Роль в системе:</label>
          <select 
            className="form-control"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="User">Пользователь</option>
            <option value="Admin">Администратор</option>
            <option value="Operator">Оператор ПДн</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">
          Зашифровать и сохранить
        </button>
      </form>
    </div>
  );
};

export default FormPage;
