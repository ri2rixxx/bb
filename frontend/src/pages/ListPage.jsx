import React, { useState, useEffect } from 'react';
import { getUsers, saveUsers } from "../api";

const ListPage = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState(''); // Состояние для поля ввода

  // Загрузка данных из облака при заходе на страницу
  useEffect(() => {
    const loadData = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    loadData();
  }, []);

  // Функция добавления
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // 1. Получаем актуальный список (защита от затирания)
    const currentUsers = await getUsers();
    
    // 2. Создаем нового пользователя
    const newUser = { 
      id: Date.now(), 
      name: name,
      createdAt: new Date().toISOString() 
    };
    
    // 3. Сохраняем весь массив в облако
    const updatedList = [...currentUsers, newUser];
    const success = await saveUsers(updatedList);
    
    if (success) {
      setUsers(updatedList); // Обновляем UI
      setName(''); // Чистим поле
    } else {
      alert('Ошибка сохранения!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Реестр субъектов ПДн (Облако)</h2>
      
      <form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Введите имя..."
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit">Добавить в базу</button>
      </form>

      <div className="user-list">
        {users.length === 0 ? (
          <p>База пуста или загружается...</p>
        ) : (
          users.map(u => (
            <div key={u.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <strong>{u.name}</strong> <small>(ID: {u.id})</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListPage;
