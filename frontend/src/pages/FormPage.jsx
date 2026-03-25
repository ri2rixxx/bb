import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { getUsers, getSettings, saveData } from '../api';

const FormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', securityLevel: 'Low' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await getUsers();
      const st = await getSettings();
      const hash = bcrypt.hashSync(formData.password, 10);
      
      const ok = await saveData([...u, { ...formData, id: Date.now(), password: hash }], st);
      if (ok) {
        alert("SUCCESS");
        navigate('/');
      } else alert("SAVE ERROR");
    } catch (err) { alert("NETWORK ERROR"); }
    finally { setLoading(false); }
  };

  const inp = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', boxSizing: 'border-box' };

  return (
    <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '20px', width: '350px', color: '#fff' }}>
        <h2>Registration</h2>
        <form onSubmit={handleSave}>
          <input style={inp} placeholder="Full Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <input style={inp} type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <input style={inp} type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} />
          <select style={inp} value={formData.securityLevel} onChange={e => setFormData({...formData, securityLevel: e.target.value})}>
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
          <button type="submit" disabled={!agreed || loading} style={{ width: '100%', padding: '15px', background: agreed ? '#38bdf8' : '#334155', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>
            {loading ? 'WAIT...' : 'SUBMIT'}
          </button>
          <label style={{ display: 'block', marginTop: '10px', fontSize: '11px' }}>
            <input type="checkbox" onChange={e => setAgreed(e.target.checked)} /> Confirm data processing
          </label>
        </form>
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: '#38bdf8', textDecoration: 'none' }}>Back</Link>
      </div>
    </div>
  );
};

export default FormPage;
