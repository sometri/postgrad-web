import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AcademicClasses() {
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    class_name: '', degree_level: 'master', major: '', academic_year: '', status: 'active'
  });

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/classes');
      setClasses(response.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/classes/${editingId}`, formData);
        alert('✅ កែប្រែទិន្នន័យជោគជ័យ!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:8000/api/classes', formData);
        alert('🎉 បញ្ជូលថ្នាក់រៀនថ្មីជោគជ័យ!');
      }
      fetchClasses();
      setFormData({ class_name: '', degree_level: 'master', major: '', academic_year: '', status: 'active' });
    } catch (error) { alert('មានបញ្ហា! សូមពិនិត្យមើលទិន្នន័យឡើងវិញ។'); }
  };

  const handleEdit = (cls) => {
    setEditingId(cls.id);
    setFormData(cls);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបថ្នាក់រៀននេះមែនទេ?")) {
      await axios.delete(`http://localhost:8000/api/classes/${id}`);
      fetchClasses();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">🏫 គ្រប់គ្រងថ្នាក់រៀន និងជំនាន់</h1>

      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កំពុងកែប្រែទិន្នន័យ' : 'បង្កើតថ្នាក់រៀន/ជំនាន់ថ្មី'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="col-span-1 md:col-span-2">
            <input type="text" name="class_name" placeholder="ឈ្មោះថ្នាក់ ឬ ជំនាន់ (ឧ. អនុបណ្ឌិតទស្សនវិជ្ជា ជំនាន់ទី១០)" value={formData.class_name} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>

          <select name="degree_level" value={formData.degree_level} onChange={handleChange} className="border p-2 rounded">
            <option value="master">ថ្នាក់អនុបណ្ឌិត (Master)</option>
            <option value="phd">ថ្នាក់បណ្ឌិត (PhD)</option>
          </select>

          <input type="text" name="major" placeholder="ឯកទេស/ជំនាញ (ឧ. ទស្សនវិជ្ជា)" value={formData.major} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="academic_year" placeholder="ឆ្នាំសិក្សា (ឧ. ២០២៦-២០២៨)" value={formData.academic_year} onChange={handleChange} className="border p-2 rounded" />
          
          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
            <option value="active">🟢 កំពុងដំណើរការ (Active)</option>
            <option value="completed">🔴 បញ្ចប់ការសិក្សា (Completed)</option>
          </select>

          <div className="col-span-full flex gap-3 mt-2">
            <button type="submit" className={`${editingId ? 'bg-yellow-500' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold py-2 px-6 rounded`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 បង្កើតថ្នាក់រៀន'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ class_name: '', degree_level: 'master', major: '', academic_year: '', status: 'active' }); }} className="bg-gray-400 text-white font-bold py-2 px-6 rounded">បោះបង់</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">ឈ្មោះថ្នាក់ / ជំនាន់</th>
              <th className="py-2 px-4 border-b text-left">កម្រិតសិក្សា</th>
              <th className="py-2 px-4 border-b text-left">ជំនាញ</th>
              <th className="py-2 px-4 border-b text-left">ឆ្នាំសិក្សា</th>
              <th className="py-2 px-4 border-b text-center">ស្ថានភាព</th>
              <th className="py-2 px-4 border-b text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id} className="hover:bg-gray-50 border-b">
                <td className="py-2 px-4 font-bold text-purple-700">{cls.class_name}</td>
                <td className="py-2 px-4 uppercase">{cls.degree_level}</td>
                <td className="py-2 px-4">{cls.major}</td>
                <td className="py-2 px-4">{cls.academic_year}</td>
                <td className="py-2 px-4 text-center">
                  {cls.status === 'active' ? <span className="text-green-600 font-bold">ដំណើរការ</span> : <span className="text-gray-500">បញ្ចប់</span>}
                </td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(cls)} className="text-blue-500 font-bold mr-3">✏️</button>
                  <button onClick={() => handleDelete(cls.id)} className="text-red-500 font-bold">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}