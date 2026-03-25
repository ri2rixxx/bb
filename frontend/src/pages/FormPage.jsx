import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsers, getSettings, saveData } from '../api';

const FormPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [lvl, setLvl] = useState('Low');
  const [loading, setLoading] = useState(false);

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentUsers = await getUsers();
      const currentSettings = await getSettings();
      
      const newUser = {
        id: "ID_" + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        password: "HIDDEN_" + btoa(pass).substr(0, 8),
        securityLevel: lvl
      };

      const ok = await saveData([...currentUsers, newUser], currentSettings);
      if (ok) {
        alert("ДАННЫЕ СОХРАНЕНЫ");
        navigate('/');
      } else {
        alert("ОШИБКА ОБЛАКА (Check Console)");
      }
    } catch (err) {
      alert("СБОЙ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{background:'#020617',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',color:'#fff'}}>
      <form onSubmit={onSave} style={{background:'rgba(30,41,59,0.8)',padding:'40px',borderRadius:'20px',width:'350px',border:'1px solid #38bdf8'}}>
        <h2 style={{marginBottom:'20px',textAlign:'center'}}>РЕГИСТРАЦИЯ</h2>
        <input style={{width:'100%',padding:'12px',marginBottom:'15px',background:'#0f172a',color:'#fff',border:'1px solid #1e293b'}} placeholder="ФИО" required onChange={e=>setName(e.target.value)} />
        <input style={{width:'100%',padding:'12px',marginBottom:'15px',background:'#0f172a',color:'#fff',border:'1px solid #1e293b'}} type="email" placeholder="EMAIL" required onChange={e=>setEmail(e.target.value)} />
        <input style={{width:'100%',padding:'12px',marginBottom:'15px',background:'#0f172a',color:'#fff',border:'1px solid #1e293b'}} type="password" placeholder="PASSWORD" required onChange={e=>setPass(e.target.value)} />
        <select style={{width:'100%',padding:'12px',marginBottom:'20px',background:'#0f172a',color:'#fff'}} value={lvl} onChange={e=>setLvl(e.target.value)}>
          <option value="Low">LOW ACCESS</option>
          <option value="Medium">MEDIUM ACCESS</option>
          <option value="High">HIGH ACCESS</option>
        </select>
        <button type="submit" disabled={loading} style={{width:'100%',padding:'15px',background:'#38bdf8',color:'#000',fontWeight:'bold',cursor:'pointer',border:'none'}}>
          {loading ? "SENDING..." : "СОХРАНИТЬ В ОБЛАКО"}
        </button>
        <Link to="/" style={{display:'block',textAlign:'center',marginTop:'15px',color:'#94a3b8',textDecoration:'none'}}>ОТМЕНА</Link>
      </form>
    </div>
  );
};

export default FormPage;
