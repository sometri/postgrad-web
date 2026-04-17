import React, { useState } from 'react';
import axios from 'axios';

// ទាញយក Link API ពីឯកសារ .env (Local ឬ Production គឺវាស្គាល់ដោយស្វ័យប្រវត្តិ)
const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ setAuth }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 👈 បន្ថែមជួរនេះ ដើម្បីកុំឱ្យគាំង (Error: not defined)
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // ឥឡូវនេះវាស្គាល់ពាក្យនេះហើយ

    try {
      const response = await axios.post(`${API_URL}/login`, formData);

      const token = response.data.token;
      const userRole = response.data.user.role;
      
      // ចាប់យកបញ្ជីសិទ្ធិ (បើអត់មាន ដាក់ជា Array ទទេ)
      const userPermissions = response.data.permissions || []; 

      localStorage.setItem('sbu_token', token);
      localStorage.setItem('sbu_role', userRole);
      
      // រក្សាទុកបញ្ជីសិទ្ធិទៅក្នុង Local Storage ដើម្បីឱ្យទំព័រផ្សេងៗអាចអានបាន
      localStorage.setItem('sbu_permissions', JSON.stringify(userPermissions)); 

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuth(true);
    } catch (err) {
      setError('អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។');
    } finally {
      setIsLoading(false); // ឈប់ Loading ពេលដំណើរការចប់
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-blue-700">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🎓</div>
          <h2 className="text-2xl font-bold text-blue-900 uppercase tracking-wide">SBU Postgrad Hub</h2>
          <p className="text-gray-500 text-sm mt-1">សូមបញ្ចូលគណនីដើម្បីគ្រប់គ្រងប្រព័ន្ធ</p>
        </div>

        {/* បង្ហាញ Error បើមានការបញ្ចូលខុស */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center text-sm font-bold border border-red-200 animate-pulse">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-bold mb-1 ml-1">អ៊ីមែល (Email)</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              required 
              placeholder="admin@sbu.edu.kh" 
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1 ml-1">ពាក្យសម្ងាត់ (Password)</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              required 
              placeholder="••••••••" 
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg transform ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 hover:scale-[1.02] active:scale-95'}`}
          >
            {isLoading ? 'កំពុងភ្ជាប់ចូល...' : 'ចូលប្រព័ន្ធ (Log In)'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          © 2026 Preah Sihanouk Raja Buddhist University
        </div>
      </div>
    </div>
  );
}