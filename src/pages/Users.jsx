import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'staff'
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/users/${editingId}`, formData);
        alert('✅ កែប្រែគណនីជោគជ័យ!');
      } else {
        await axios.post('/users', formData);
        alert('🎉 បង្កើតគណនីថ្មីជោគជ័យ!');
      }
      // សម្អាត Form ឱ្យទទេវិញក្រោយជោគជ័យ
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', role: 'staff' });
      fetchUsers();
    } catch (error) { 
      // បង្ហាញ Error ឱ្យច្បាស់ថាបញ្ហាមកពីអ្វី
      if (error.response && error.response.status === 422) {
        alert('❌ បញ្ហា៖ អ៊ីមែលនេះមានក្នុងប្រព័ន្ធរួចហើយ!');
      } else {
        alert('❌ មានបញ្ហាបច្ចេកទេស! សូមព្យាយាមម្តងទៀត។');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // ទុកចំហរសម្រាប់សន្តិសុខ
      role: user.role || 'staff' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ?")) {
      try {
        await axios.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        alert("មិនអាចលុបបានទេ!");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">⚙️ គ្រប់គ្រងគណនីបុគ្គលិក</h1>

      {/* ផ្ទាំង Form បង្កើត/កែប្រែ */}
      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កែប្រែគណនី' : 'បង្កើតគណនីថ្មី (Admin/Staff)'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-bold">ឈ្មោះបុគ្គលិក</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" required placeholder="ឈ្មោះពិត" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-bold">អ៊ីមែល (Log In)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" required placeholder="admin@sbu.edu.kh" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-bold">ពាក្យសម្ងាត់</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder={editingId ? "ទុកចំហរបើមិនប្តូរ" : "••••••••"} 
              required={!editingId} 
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-bold">តួនាទី (Role)</label>
            <select name="role" value={formData.role} onChange={handleChange} className="border p-2 rounded bg-white outline-none focus:ring-2 focus:ring-blue-400">
                <option value="staff">👤 Staff (បុគ្គលិក)</option>
                <option value="admin">👨‍💻 Admin (អ្នកគ្រប់គ្រង)</option>
            </select>
          </div>

          <div className="col-span-full flex gap-3 mt-4 border-t pt-4">
            <button type="submit" className={`${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-6 rounded transition shadow-md`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 បង្កើតគណនី'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', email: '', password: '', role: 'staff' }); }} className="bg-gray-400 text-white font-bold py-2 px-6 rounded">បោះបង់</button>
            )}
          </div>
        </form>
      </div>

      {/* តារាងបង្ហាញបញ្ជីឈ្មោះ */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left font-bold text-gray-700">លេខសម្គាល់</th>
              <th className="py-3 px-4 text-left font-bold text-gray-700">ឈ្មោះ</th>
              <th className="py-3 px-4 text-left font-bold text-gray-700">អ៊ីមែល</th>
              <th className="py-3 px-4 text-center font-bold text-gray-700">សិទ្ធិ</th>
              <th className="py-3 px-4 text-left font-bold text-gray-700">ថ្ងៃបង្កើត</th>
              <th className="py-3 px-4 text-center font-bold text-gray-700">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 border-b transition">
                <td className="py-3 px-4 text-gray-500">#{user.id}</td>
                <td className="py-3 px-4 font-bold text-gray-800">{user.name}</td>
                <td className="py-3 px-4 text-blue-600">{user.email}</td>              
                <td className="py-3 px-4 text-center">
                  {user.role === 'admin' 
                    ? <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Admin</span>
                    : <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Staff</span>
                  }
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleEdit(user)} className="bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition mr-2" title="កែប្រែ">✏️</button>
                  {/* បង្ការមិនឱ្យលុប User សំខាន់ៗ (ID 1 ឬ 4 ជាដើម) */}
                  {user.id !== 1 && user.id !== 4 && (
                    <button onClick={() => handleDelete(user.id)} className="bg-red-100 p-2 rounded-full hover:bg-red-200 transition" title="លុប">🗑️</button>
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