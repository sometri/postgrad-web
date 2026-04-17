import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// កំណត់ Base URL សម្រាប់ Axios ដោយយកពី .env (វានឹងស្គាល់ដោយស្វ័យប្រវត្តិរវាង Local និង Production)
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// Imports ទំព័រទាំងអស់
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import AcademicClasses from './pages/AcademicClasses';
import Enrollments from './pages/Enrollments';
import Theses from './pages/Theses';
import Invoices from './pages/Invoices';
import Scores from './pages/Scores';
import Users from './pages/Users';
import RolePermissions from './pages/RolePermissions';

const API_URL = import.meta.env.VITE_API_URL;

// មុខងារសម្រាប់ម៉ឺនុយធម្មតា
const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-800 text-yellow-300 shadow-inner border-l-4 border-yellow-400' : 'hover:bg-blue-800 hover:text-white text-gray-300'}`}>
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // ទាញយក Role ពីប្រអប់ផ្ទុក (យកមកដាក់ក្នុង Component នេះដើម្បីឱ្យវា Update ថ្មីរាល់ពេល Log In/Out)
  const userRole = localStorage.getItem('sbu_role');

  // State សម្រាប់បញ្ជាការបិទ/បើក Sidebar និង Sub-menus
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState({
    academic: true, // បើកស្រាប់
    research: false,
    settings: false
  });

  useEffect(() => {
    const token = localStorage.getItem('sbu_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    try { await axios.post(`${API_URL}/logout`); } catch (error) {}
    
    // លុបកូនសោរ និងសិទ្ធិចេញពី Browser
    localStorage.removeItem('sbu_token');
    localStorage.removeItem('sbu_role'); 
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  // មុខងារសម្រាប់បើក/បិទ Sub-menu នីមួយៗ
  const toggleSubMenu = (menuName) => {
    setOpenSubMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-gray-100 text-xl font-bold text-gray-500">កំពុងត្រួតពិនិត្យសុវត្ថិភាព... ⏳</div>;
  if (!isAuthenticated) return <Login setAuth={setIsAuthenticated} />;

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        
        {/* ---------------- ផ្នែកទី ១៖ Sidebar ---------------- */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-[#0a1f44] text-white flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap`}>
          <div className="p-6 border-b border-blue-900/50 flex flex-col items-center justify-center min-w-[16rem]">
            <div className="text-5xl mb-2">🎓</div>
            <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">SBU Postgrad</h2>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar min-w-[16rem]">
            <NavItem to="/" icon="📊" label="Dashboard" />
            
            {/* ក្រុមទី ១៖ សិក្សាធិការ (Sub-menu) */}
            <div className="mt-4">
              <button onClick={() => toggleSubMenu('academic')} className="w-full flex items-center justify-between text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider pl-2 hover:text-blue-300 transition">
                <span>ផ្នែកសិក្សាធិការ</span>
                <span>{openSubMenus.academic ? '▼' : '▶'}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openSubMenus.academic ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <NavItem to="/students" icon="👥" label="និស្សិត" />
                <NavItem to="/teachers" icon="👨‍🏫" label="សាស្ត្រាចារ្យ" />
                <NavItem to="/classes" icon="🏫" label="ថ្នាក់រៀន" />
                <NavItem to="/enrollments" icon="📝" label="ចុះឈ្មោះ" />
                <NavItem to="/scores" icon="📝" label="ពិន្ទុ" />
              </div>
            </div>

            {/* ក្រុមទី ២៖ ស្រាវជ្រាវ & ហិរញ្ញវត្ថុ (Sub-menu) */}
            <div className="mt-4">
              <button onClick={() => toggleSubMenu('research')} className="w-full flex items-center justify-between text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider pl-2 hover:text-blue-300 transition">
                <span>ស្រាវជ្រាវ & ហិរញ្ញវត្ថុ</span>
                <span>{openSubMenus.research ? '▼' : '▶'}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openSubMenus.research ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <NavItem to="/theses" icon="🔬" label="និក្ខេបបទ" />
                <NavItem to="/invoices" icon="💰" label="ហិរញ្ញវត្ថុ" />
              </div>
            </div>

            {/* ក្រុមទី ៣៖ ការកំណត់ (បង្ហាញតែ Admin ប៉ុណ្ណោះ) */}
            {userRole === 'admin' && (
              <div className="mt-4">
                <button onClick={() => toggleSubMenu('settings')} className="w-full flex items-center justify-between text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider pl-2 hover:text-blue-300 transition">
                  <span>ការកំណត់ប្រព័ន្ធ</span>
                  <span>{openSubMenus.settings ? '▼' : '▶'}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openSubMenus.settings ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <NavItem to="/users" icon="⚙️" label="គណនីបុគ្គលិក" />
                  <NavItem to="/permissions" icon="🛡️" label="សិទ្ធិប្រើប្រាស់" /> {/* 👈 ថែមជួរនេះ */}
                </div>
              </div>
            )}
          </nav>
        </aside>

        {/* ---------------- ផ្នែកទី ២៖ Main Content ---------------- */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-4">
              {/* ប៊ូតុង Toggle Sidebar */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="text-gray-500 hover:text-blue-700 focus:outline-none p-2 rounded-lg hover:bg-blue-50 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <div className="text-lg font-bold text-gray-700 hidden sm:block">
                 ប្រព័ន្ធគ្រប់គ្រងការសិក្សាថ្នាក់ក្រោយឧត្តមសិក្សា
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                <span className="text-xl">{userRole === 'admin' ? '👨‍💻' : '👤'}</span>
                <span className="text-blue-900 font-bold text-sm">
                  {userRole === 'admin' ? 'អ្នកគ្រប់គ្រង (Admin)' : 'បុគ្គលិក (Staff)'}
                </span>
              </div>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-200 flex items-center gap-2">
                <span>🚪</span> <span className="hidden sm:block">ចាកចេញ</span>
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/classes" element={<AcademicClasses />} />
              <Route path="/enrollments" element={<Enrollments />} />
              <Route path="/theses" element={<Theses />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/scores" element={<Scores />} />
              
              {/* ការពារ Route /users ជាជាន់ទី ២ បើមិនមែន admin វានឹងរុញចេញ */}
              {userRole === 'admin' && (
                <>
                  <Route path="/users" element={<Users />} />
                  <Route path="/permissions" element={<RolePermissions />} /> {/* 👈 ថែមជួរនេះ */}
                </>                 
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}