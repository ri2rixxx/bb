import React, { useState, useEffect } from "react";
import { getUsers, getSettings, saveData } from "../api";
import { Link } from "react-router-dom";
import loadingMeme from "../assets/1.jpg"; 

const ListPage = () => {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({ masterKey: "nstu2026" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const refresh = async () => {
    const u = await getUsers();
    const s = await getSettings();
    setUsers(u);
    setSettings(s);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const handleSaveEdit = async () => {
    const updated = users.map(u => u.id === editId ? editData : u);
    const success = await saveData(updated, settings);
    if (success) {
      setEditId(null);
      await refresh(); // Жёсткий перезапуск данных
    } else {
      alert("ОБЛАКО НЕ ПРИНЯЛО PUT/POST ЗАПРОС");
    }
  };

  if (loading) return (
    <div style={{background:'#020617',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <img src={loadingMeme} style={{width:'150px',borderRadius:'50%'}} alt="loading" />
    </div>
  );

  return (
    <div style={{background:'#020617',minHeight:'100vh',color:'#fff',padding:'40px',fontFamily:'sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px'}}>
        <h2 style={{color:'#38bdf8'}}>АВТФ | SECURITY SYSTEM</h2>
        <div>
          <button onClick={() => {
            const p = prompt("MASTER KEY:");
            if (p === settings.masterKey) setIsAdmin(true);
          }} style={{marginRight:'10px',padding:'10px',cursor:'pointer'}}>АДМИН</button>
          <Link to="/add" style={{background:'#38bdf8',padding:'10px',color:'#000',textDecoration:'none',fontWeight:'bold',borderRadius:'5px'}}>+ ДОБАВИТЬ</Link>
        </div>
      </div>

      <table style={{width:'100%',borderCollapse:'collapse',background:'rgba(255,255,255,0.05)'}}>
        <thead>
          <tr style={{borderBottom:'2px solid #38bdf8'}}>
            <th style={{padding:'15px',textAlign:'left'}}>ФИО СУБЪЕКТА</th>
            {isAdmin && <th style={{padding:'15px',textAlign:'center'}}>УПРАВЛЕНИЕ</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{borderBottom:'1px solid #1e293b'}}>
              <td style={{padding:'15px'}}>
                {editId === u.id ? 
                  <input style={{background:'#0f172a',color:'#fff',border:'1px solid #38bdf8',padding:'5px'}} value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} /> : 
                  u.name}
              </td>
              {isAdmin && (
                <td style={{padding:'15px',textAlign:'center'}}>
                  {editId === u.id ? 
                    <button onClick={handleSaveEdit} style={{background:'#10b981',color:'#fff',border:'none',padding:'5px 10px',borderRadius:'4px',cursor:'pointer'}}>OK</button> : 
                    <button onClick={() => {setEditId(u.id);setEditData(u);}} style={{background:'none',border:'none',color:'#38bdf8',cursor:'pointer',fontSize:'18px'}}>✎</button>
                  }
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPage;
