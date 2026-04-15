import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setAuth }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // បាញ់ទៅសុំកូនសោរពី Laravel
      const response = await axios.post('http://localhost:8000/api/login', formData);
      const token = response.data.token;
      
      // រក្សាទុកកូនសោរក្នុង Browser (Local Storage)
      localStorage.setItem('sbu_token', token);
      
      // បំពាក់កូនសោរនេះទៅកាន់គ្រប់ Request ទាំងអស់របស់ Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // ប្រាប់ App ថា "ចូលជោគជ័យហើយ!"
      setAuth(true); 
    } catch (error) {
      setError('អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🎓</div>
          <h2 className="text-2xl font-bold text-blue-900">SBU Postgrad Hub</h2>
          <p className="text-gray-500 text-sm">សូមបញ្ចូលគណនីដើម្បីបន្ត</p>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center text-sm font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-1">អ៊ីមែល (Email)</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded bg-gray-50" required placeholder="admin@sbu.edu.kh" />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">ពាក្យសម្ងាត់ (Password)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border p-3 rounded bg-gray-50" required placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded transition shadow-lg">
            ចូលប្រព័ន្ធ (Log In)
          </button>
        </form>
      </div>
    </div>
  );
}