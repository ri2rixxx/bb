import React, { useState, useEffect } from "react";
import { getUsers } from "../api";
import { Link } from "react-router-dom";

const ListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="loader">Загрузка реестра ПДн...</div>;

  return (
    <div className="container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50' }}>🔒 Реестр субъектов ПДн (Cloud)</h2>
        <Link to="/add" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', borderRadius: '5px' }}>
          + Добавить субъекта
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ФИО</th>
            <th style={{ padding: '12px' }}>Роль</th>
            <th style={{ padding: '12px' }}>Статус пароля</th>
            <th style={{ padding: '12px' }}>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}><strong>{user.name}</strong></td>
              <td style={{ padding: '12px' }}>
                <span style={{ 
                  backgroundColor: user.role === 'Admin' ? '#e74c3c' : '#3498db', 
                  color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' 
                }}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: '12px', color: '#27ae60', fontSize: '12px' }}>
                🛡️ Хеширован (BCrypt)
              </td>
              <td style={{ padding: '12px', color: '#7f8c8d' }}>{user.createdAt || 'Не указана'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>Реестр пока пуст.</p>}
    </div>
  );
};

export default ListPage;
