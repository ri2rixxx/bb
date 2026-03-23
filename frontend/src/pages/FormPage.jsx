import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, saveUsers } from '../api'; // Исправленный импорт

const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Получаем актуальный список из облака
    const currentUsers = await getUsers();

    // 2. Создаем новый объект (добавляем ID сами, т.к. облако это просто хранилище)
    const newUser = { 
      ...formData, 
      id: Date.now(),
      createdAt: new Date().toISOString() 
    };

    // 3. Формируем новый массив и сохраняем его целиком
    const updatedList = [...currentUsers, newUser];
    const success = await saveUsers(updatedList);

    if (success) {
      alert('Данные успешно сохранены в облако!');
      navigate('/'); // Возвращаемся на главную к списку
    } else {
      alert('Ошибка при сохранении в JSONBin. Проверь консоль.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Регистрация в реестре</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="ФИО"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <button type="submit">Отправить в облако</button>
      </form>
    </div>
  );
};

export default FormPage;
