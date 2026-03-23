import React, { useState, useEffect } from "react";
import { getUsers, saveUsers } from "../api";
import { Link } from "react-router-dom";

const ListPage = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("admin123"); // Мастер-ключ

  useEffect(() => {
    fetchData();
    
    // Слушатель хоткея Ctrl + Alt + A
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.code === 'KeyA') {
        const pass = prompt("Введите мастер-ключ администратора:");
        if (pass === adminKey) {
          setIsAdmin(prev => !prev);
        } else {
          alert("Доступ запрещен!");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminKey]);

  const fetchData = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Удалить запись?")) {
      const updated = users.filter(u => u.id !== id);
      await saveUsers(updated);
      setUsers(updated);
    }
  };

  const maskData = (value, level) => {
    if (isAdmin) return value;
    if (level === 'High') return '••••••••';
    if (level === 'Medium') return value.substring(0, 3) + '***@***';
    return value;
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="logo">
          <span className="icon">🛡️</span>
          <h1>Security SPA <small>v2.0 Cloud</small></h1>
        </div>
        <div className="actions">
          {isAdmin && <button className="btn-key" onClick={() => setAdminKey(prompt("Новый мастер-ключ:", adminKey))}>🔑 Сменить ключ</button>}
          <Link to="/add" className="btn-add">+ Добавить запись</Link>
        </div>
      </header>

      <div className="table-container">
        <div className="status-bar">
          Статус системы: <span className={isAdmin ? "status-admin" : "status-user"}>
            {isAdmin ? "🔓 АДМИНИСТРАТОР (ПОЛНЫЙ ДОСТУП)" : "🔒 ПОЛЬЗОВАТЕЛЬ (ОГРАНИЧЕННЫЙ ДОСТУП)"}
          </span>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>ФИО СУБЪЕКТА</th>
              <th>КОНТАКТЫ</th>
              <th>УРОВЕНЬ</th>
              <th>ХЕШ ПАРОЛЯ</th>
              <th>ДЕЙСТВИЯ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className={`row-${user.securityLevel.toLowerCase()}`}>
                <td>{maskData(user.name, user.securityLevel)}</td>
                <td>{maskData(user.email, user.securityLevel)}</td>
                <td><span className={`badge ${user.securityLevel}`}>{user.securityLevel}</span></td>
                <td className="hash-cell">{isAdmin ? user.password : "********************"}</td>
                <td>
                  <button className="btn-delete" onClick={() => deleteUser(user.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPage;
