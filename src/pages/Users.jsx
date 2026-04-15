import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: ''
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users');
      setUsers(response.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/users/${editingId}`, formData);
        alert('✅ កែប្រែគណនីជោគជ័យ!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:8000/api/users', formData);
        alert('🎉 បង្កើតគណនីថ្មីជោគជ័យ!');
      }
      fetchUsers();
      setFormData({ name: '', email: '', password: '' });
    } catch (error) { alert('មានបញ្ហា! អ៊ីមែលនេះអាចមានអ្នកប្រើប្រាស់រួចហើយ។'); }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '' // ទុកប្រអប់លេខសម្ងាត់ឱ្យនៅទទេ ពេលចុចកែប្រែ
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ? បុគ្គលិកនេះនឹងលែងអាចចូលប្រព័ន្ធបានទៀតហើយ!")) {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">⚙️ គ្រប់គ្រងគណនីបុគ្គលិក</h1>

      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កែប្រែគណនី' : 'បង្កើតគណនីថ្មី (Admin/Staff)'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">ឈ្មោះបុគ្គលិក</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded" required placeholder="ឧ. Admin Postgrad" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">អ៊ីមែល (សម្រាប់ Log In)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 rounded" required placeholder="admin@sbu.edu.kh" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">ពាក្យសម្ងាត់</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="border p-2 rounded" 
              placeholder={editingId ? "ទុកចំហរបើមិនចង់ប្តូរ" : "••••••••"} 
              required={!editingId} // តម្រូវឱ្យវាយតែពេលបង្កើតថ្មីប៉ុណ្ណោះ
            />
          </div>

          <div className="col-span-full flex gap-3 mt-4">
            <button type="submit" className={`${editingId ? 'bg-yellow-500' : 'bg-gray-800 hover:bg-black'} text-white font-bold py-2 px-6 rounded`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 បង្កើតគណនី'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', email: '', password: '' }); }} className="bg-gray-400 text-white font-bold py-2 px-6 rounded">បោះបង់</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">លេខសម្គាល់ (ID)</th>
              <th className="py-2 px-4 border-b text-left">ឈ្មោះ</th>
              <th className="py-2 px-4 border-b text-left">អ៊ីមែល</th>
              <th className="py-2 px-4 border-b text-left">ថ្ងៃបង្កើត</th>
              <th className="py-2 px-4 border-b text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 border-b">
                <td className="py-2 px-4 text-gray-500">#{user.id}</td>
                <td className="py-2 px-4 font-bold text-gray-800">{user.name}</td>
                <td className="py-2 px-4 text-blue-600">{user.email}</td>
                <td className="py-2 px-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(user)} className="text-blue-500 font-bold mr-3">✏️</button>
                  {/* បង្ការមិនឱ្យលុបគណនីលេខ ១ (Super Admin) ចោលដោយចៃដន្យ */}
                  {user.id !== 1 && user.id !== 4 && (
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 font-bold">🗑️</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}