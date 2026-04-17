import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Students() {
  // ១. អាន Role និង Permissions ពី LocalStorage
  const userRole = localStorage.getItem('sbu_role');
  const userPerms = JSON.parse(localStorage.getItem('sbu_permissions') || '[]');

  // ២. មុខងារឆែកសិទ្ធិដ៏ឆ្លាតវៃ (បើជា Admin គឺ true ជានិច្ច)
  const can = (permission) => {
    if (userRole === 'admin') return true; 
    return userPerms.includes(permission);
  };
  
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  
  const [formData, setFormData] = useState({
    student_id: '', khmer_name: '', latin_name: '', degree_level: 'master', 
    student_type: 'layperson', gender: '', chhaya_number: '', pagoda_name: '', monk_title: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error("មានបញ្ហាក្នុងការទាញទិន្នន័យ:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (student) => {
    setEditingId(student.id); 
    setFormData(student); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?")) {
      try {
        await axios.delete(`/students/${id}`);
        alert('🗑️ លុបទិន្នន័យជោគជ័យ!');
        fetchStudents(); 
      } catch (error) {
        console.error("កំហុសក្នុងការលុប:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/students/${editingId}`, formData);
        alert('✅ កែប្រែទិន្នន័យជោគជ័យ!');
        setEditingId(null); 
      } else {
        await axios.post('/students', formData);
        alert('🎉 បញ្ជូលទិន្នន័យជោគជ័យ!');
      }
      
      fetchStudents(); 
      setFormData({ student_id: '', khmer_name: '', latin_name: '', degree_level: 'master', student_type: 'layperson', gender: '', chhaya_number: '', pagoda_name: '', monk_title: '' });
    } catch (error) {
      console.error("កំហុសក្នុងការរក្សាទុក:", error);
      alert('មានបញ្ហា! សូមពិនិត្យមើលទិន្នន័យឡើងវិញ។ (អាចមកពីអត្តលេខជាន់គ្នា)');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ student_id: '', khmer_name: '', latin_name: '', degree_level: 'master', student_type: 'layperson', gender: '', chhaya_number: '', pagoda_name: '', monk_title: '' });
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">👥 គ្រប់គ្រងនិស្សិត និងព្រះសង្ឃ</h1>

      {/* បង្ហាញ Form បញ្ចូល តែចំពោះអ្នកមានសិទ្ធិ 'create_students' ឬ 'edit_students' ប៉ុណ្ណោះ */}
      {(can('create_students') || can('edit_students')) && (
        <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
          <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កំពុងកែប្រែទិន្នន័យ' : 'បញ្ចូលនិស្សិតថ្មី'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <input type="text" name="student_id" placeholder="អត្តលេខ (ឧ. SBU-M-001)" value={formData.student_id} onChange={handleChange} className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" required />
            <input type="text" name="khmer_name" placeholder="ឈ្មោះ (ខ្មែរ)" value={formData.khmer_name} onChange={handleChange} className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" required />
            <input type="text" name="latin_name" placeholder="ឈ្មោះ (ឡាតាំង)" value={formData.latin_name} onChange={handleChange} className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400" required />
            
            <select name="degree_level" value={formData.degree_level} onChange={handleChange} className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400">
              <option value="master">ថ្នាក់អនុបណ្ឌិត (Master)</option>
              <option value="phd">ថ្នាក់បណ្ឌិត (PhD)</option>
            </select>

            <select name="student_type" value={formData.student_type} onChange={handleChange} className="border p-2 rounded bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400">
              <option value="layperson">គ្រហស្ថ</option>
              <option value="monk">ព្រះសង្ឃ</option>
            </select>

            {formData.student_type === 'monk' ? (
              <>
                <input type="text" name="monk_title" placeholder="ងារ (ឧ. ព្រះមហា)" value={formData.monk_title || ''} onChange={handleChange} className="border p-2 rounded border-orange-300 outline-none focus:ring-2 focus:ring-orange-400" />
                <input type="text" name="chhaya_number" placeholder="លេខឆាយា" value={formData.chhaya_number || ''} onChange={handleChange} className="border p-2 rounded border-orange-300 outline-none focus:ring-2 focus:ring-orange-400" />
                <input type="text" name="pagoda_name" placeholder="គង់នៅវត្ត" value={formData.pagoda_name || ''} onChange={handleChange} className="border p-2 rounded border-orange-300 outline-none focus:ring-2 focus:ring-orange-400" />
              </>
            ) : (
              <select name="gender" value={formData.gender || ''} onChange={handleChange} className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">ជ្រើសរើសភេទ...</option>
                <option value="Male">ប្រុស</option>
                <option value="Female">ស្រី</option>
              </select>
            )}

            <div className="col-span-full flex gap-3 mt-2 border-t pt-4">
              <button type="submit" className={`${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-6 rounded transition shadow-md`}>
                {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 រក្សាទុក'}
              </button>
              
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition shadow-md">
                  បោះបង់
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ផ្នែកទី ២៖ តារាងបង្ហាញទិន្នន័យ */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">បញ្ជីឈ្មោះនិស្សិត</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-gray-700 font-bold">អត្តលេខ</th>
                <th className="py-3 px-4 border-b text-left text-gray-700 font-bold">ឈ្មោះ</th>
                <th className="py-3 px-4 border-b text-left text-gray-700 font-bold">កម្រិតសិក្សា</th>
                <th className="py-3 px-4 border-b text-left text-gray-700 font-bold">ប្រភេទ</th>
                
                {/* ក្បាលតារាង សកម្មភាព នឹងបង្ហាញបើមានសិទ្ធិកែប្រែ ឬ លុប */}
                {(can('edit_students') || can('delete_students')) && (
                  <th className="py-3 px-4 border-b text-center text-gray-700 font-bold">សកម្មភាព</th>
                )}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 border-b transition">
                  <td className="py-3 px-4 text-gray-600">{student.student_id}</td>
                  <td className="py-3 px-4 font-bold text-blue-800">
                    {student.student_type === 'monk' ? `${student.monk_title} ` : ''} 
                    {student.khmer_name}
                  </td>
                  <td className="py-3 px-4 uppercase text-gray-600 font-medium">{student.degree_level}</td>
                  <td className="py-3 px-4">
                    {student.student_type === 'monk' ? <span className="text-orange-600 font-bold">🙏 ព្រះសង្ឃ</span> : <span className="text-gray-600 font-bold">👨‍💼 គ្រហស្ថ</span>}
                  </td>
                  
                  {/* បង្ហាញប៊ូតុងសកម្មភាពទៅតាមសិទ្ធិរៀងៗខ្លួន */}
                  {(can('edit_students') || can('delete_students')) && (
                    <td className="py-3 px-4 text-center">
                      {can('edit_students') && (
                         <button onClick={() => handleEdit(student)} className="bg-blue-50 p-2 rounded-full text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition mr-2" title="កែប្រែ">✏️</button>
                      )}
                      {can('delete_students') && (
                         <button onClick={() => handleDelete(student.id)} className="bg-red-50 p-2 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700 transition" title="លុប">🗑️</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan="5" className="text-center py-6 text-gray-500 font-medium">មិនទាន់មានទិន្នន័យទេ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}