import React, { useState } from 'react';
import axios from 'axios';

export default function RolePermissions() {
  // កំណត់តួនាទីដែលចង់គ្រប់គ្រង (បណ្តោះអាសន្នសិន មុនភ្ជាប់ API)
  const [selectedRole, setSelectedRole] = useState('staff');

  // កំណត់ឈ្មោះទំព័រ (Modules) និងសកម្មភាព (CRUD)
  const modules = [
    { id: 'students', name: '👥 និស្សិត' },
    { id: 'teachers', name: '👨‍🏫 សាស្ត្រាចារ្យ' },
    { id: 'classes', name: '🏫 ថ្នាក់រៀន' },
    { id: 'enrollments', name: '📝 ការចុះឈ្មោះ' },
    { id: 'scores', name: '💯 ពិន្ទុ' },
    { id: 'theses', name: '🔬 និក្ខេបបទ' },
    { id: 'invoices', name: '💰 ហិរញ្ញវត្ថុ' },
    { id: 'users', name: '⚙️ គណនីបុគ្គលិក' }
  ];

  const actions = [
    { id: 'view', name: '👁️ មើល' },
    { id: 'create', name: '➕ បន្ថែម' },
    { id: 'edit', name: '✏️ កែប្រែ' },
    { id: 'delete', name: '🗑️ លុប' }
  ];

  const [permissions, setPermissions] = useState({});

  const handleCheckboxChange = (module, action) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action]
      }
    }));
  };

  const handleRowCheckAll = (module) => {
    const isAllChecked = actions.every(a => permissions[module]?.[a.id]);
    const newModulePerms = {};
    actions.forEach(a => { newModulePerms[a.id] = !isAllChecked; });
    setPermissions(prev => ({ ...prev, [module]: newModulePerms }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/role-permissions', {
        role: selectedRole,       // បញ្ជូន 'staff' ឬ 'admin'
        permissions: permissions  // បញ្ជូន JSON នៃ Checkboxes
      });

      alert(`🎉 ជោគជ័យ! ${response.data.message}`);
    } catch (error) {
      console.error("Error saving permissions:", error);
      alert("❌ មិនអាចរក្សាទុកបានទេ! សូមពិនិត្យមើលថាបងបានបើក Laravel Server (Port 8000) ហើយឬនៅ?");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🛡️ កំណត់សិទ្ធិប្រើប្រាស់ (Permissions)</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-t-4 border-blue-800">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6 pb-6 border-b">
          <label className="font-bold text-gray-700">ជ្រើសរើសតួនាទីដើម្បីកំណត់សិទ្ធិ៖</label>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border-2 border-blue-300 p-2 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold text-blue-800"
          >
            <option value="staff">👤 Staff (បុគ្គលិកធម្មតា)</option>
            <option value="admin">👨‍💻 Admin (អ្នកគ្រប់គ្រង)</option>
          </select>
          <p className="text-sm text-gray-500 italic">ចំណាំ៖ Admin តែងតែមានសិទ្ធិពេញលេញជាលំនាំដើម។</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-[#0a1f44] text-white">
              <tr>
                <th className="py-3 px-4 text-left font-bold border-r border-blue-900">ផ្នែក / ទំព័រ (Modules)</th>
                {actions.map(action => (
                  <th key={action.id} className="py-3 px-4 text-center text-sm font-medium border-r border-blue-900">{action.name}</th>
                ))}
                <th className="py-3 px-4 text-center text-sm font-medium">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod, index) => (
                <tr key={mod.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 border-b transition duration-150`}>
                  <td className="py-3 px-4 font-bold text-gray-700 border-r">{mod.name}</td>
                  
                  {actions.map(action => (
                    <td key={action.id} className="py-3 px-4 text-center border-r">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 cursor-pointer accent-blue-600 rounded"
                        checked={permissions[mod.id]?.[action.id] || false}
                        onChange={() => handleCheckboxChange(mod.id, action.id)}
                      />
                    </td>
                  ))}

                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleRowCheckAll(mod.id)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded shadow-sm transition"
                    >
                      ទាំងអស់ / គ្មាន
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-right flex justify-end gap-3">
          <button 
            onClick={() => setPermissions({})} 
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded shadow transition"
          >
            សម្អាត
          </button>
          <button 
            onClick={handleSave} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded shadow-lg transition transform hover:scale-105"
          >
            💾 រក្សាទុកសិទ្ធិ
          </button>
        </div>
      </div>
    </div>
  );
}