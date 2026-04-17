import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    teacher_id: '', khmer_name: '', latin_name: '', gender: '', 
    phone_number: '', email: '', academic_title: '', specialization: ''
  });

  useEffect(() => { fetchTeachers(); }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/teachers');
      setTeachers(response.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await axios.put(`http://localhost:8000/api/teachers/${editingId}`, formData);
//         alert('✅ កែប្រែទិន្នន័យជោគជ័យ!');
//         setEditingId(null);
//       } else {
//         await axios.post('http://localhost:8000/api/teachers', formData);
//         alert('🎉 បញ្ជូលទិន្នន័យជោគជ័យ!');
//       }
//       fetchTeachers();
//       setFormData({ teacher_id: '', khmer_name: '', latin_name: '', gender: '', phone_number: '', email: '', academic_title: '', specialization: '' });
//     } catch (error) { alert('មានបញ្ហា! លេខអត្តលេខអាចជាន់គ្នា។'); }
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    if (editingId) {
        await axios.put(`/teachers/${editingId}`, formData);
        alert('✅ កែប្រែទិន្នន័យជោគជ័យ!');
        setEditingId(null);
    } else {
        await axios.post('/teachers', formData);
        alert('🎉 បញ្ជូលទិន្នន័យជោគជ័យ!');
    }
    fetchTeachers();
    setFormData({ teacher_id: '', khmer_name: '', latin_name: '', gender: '', phone_number: '', email: '', academic_title: '', specialization: '' });
    } catch (error) { 
    // កូដថ្មី សម្រាប់ចាប់ Error ឱ្យចំៗពី Laravel
    if (error.response && error.response.data && error.response.data.errors) {
        // ទាញយកសារ Error ទាំងអស់មកផ្តុំគ្នា
        const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
        alert(`បរាជ័យ:\n${errorMessages}`);
    } else {
        alert('មានបញ្ហា! សូមពិនិត្យមើលការតភ្ជាប់ទៅកាន់ Server ឡើងវិញ។'); 
    }
    }
};

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setFormData(teacher);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?")) {
      await axios.delete(`/teachers/${id}`);
      fetchTeachers();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">👨‍🏫 គ្រប់គ្រងសាស្ត្រាចារ្យ</h1>

      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កំពុងកែប្រែទិន្នន័យ' : 'បញ្ចូលសាស្ត្រាចារ្យថ្មី'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="teacher_id" placeholder="អត្តលេខ (ឧ. T-001)" value={formData.teacher_id} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="khmer_name" placeholder="ឈ្មោះ (ខ្មែរ)" value={formData.khmer_name} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="latin_name" placeholder="ឈ្មោះ (ឡាតាំង)" value={formData.latin_name} onChange={handleChange} className="border p-2 rounded" />
          
          <select name="gender" value={formData.gender || ''} onChange={handleChange} className="border p-2 rounded">
            <option value="">ជ្រើសរើសភេទ...</option><option value="Male">ប្រុស</option><option value="Female">ស្រី</option>
          </select>
          <input type="text" name="academic_title" placeholder="គោរមងារ (ឧ. បណ្ឌិត)" value={formData.academic_title || ''} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="specialization" placeholder="ឯកទេស (ឧ. ទស្សនវិជ្ជា)" value={formData.specialization || ''} onChange={handleChange} className="border p-2 rounded" />
          
          <input type="text" name="phone_number" placeholder="លេខទូរស័ព្ទ" value={formData.phone_number || ''} onChange={handleChange} className="border p-2 rounded" />
          <input type="email" name="email" placeholder="អ៊ីមែល" value={formData.email || ''} onChange={handleChange} className="border p-2 rounded" />

          <div className="col-span-full flex gap-3 mt-2">
            <button type="submit" className={`${editingId ? 'bg-yellow-500' : 'bg-green-600'} text-white font-bold py-2 px-6 rounded`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 រក្សាទុក'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ teacher_id: '', khmer_name: '', latin_name: '', gender: '', phone_number: '', email: '', academic_title: '', specialization: '' }); }} className="bg-gray-400 text-white font-bold py-2 px-6 rounded">បោះបង់</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">អត្តលេខ</th>
              <th className="py-2 px-4 border-b text-left">ឈ្មោះសាស្ត្រាចារ្យ</th>
              <th className="py-2 px-4 border-b text-left">ឯកទេស</th>
              <th className="py-2 px-4 border-b text-left">ទំនាក់ទំនង</th>
              <th className="py-2 px-4 border-b text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 border-b">
                <td className="py-2 px-4">{t.teacher_id}</td>
                <td className="py-2 px-4 font-medium text-green-700">{t.academic_title} {t.khmer_name}</td>
                <td className="py-2 px-4">{t.specialization}</td>
                <td className="py-2 px-4 text-sm">{t.phone_number}</td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(t)} className="text-blue-500 font-bold mr-3">✏️</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 font-bold">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}