import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Theses() {
  const [theses, setTheses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    student_id: '', supervisor_id: '', co_supervisor_id: '', title: '', start_date: '', defense_date: '', status: 'proposal'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [thesisRes, studentRes, teacherRes] = await Promise.all([
        axios.get('https://journal.dhammavicaya.cloud/api/theses'),
        axios.get('https://journal.dhammavicaya.cloud/api/students'),
        axios.get('https://journal.dhammavicaya.cloud/api/teachers')
      ]);
      setTheses(thesisRes.data);
      setStudents(studentRes.data);
      setTeachers(teacherRes.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://journal.dhammavicaya.cloud/api/theses/${editingId}`, formData);
        alert('✅ កែប្រែទិន្នន័យជោគជ័យ!');
        setEditingId(null);
      } else {
        await axios.post('https://journal.dhammavicaya.cloud/api/theses', formData);
        alert('🎉 បញ្ជូលប្រធានបទស្រាវជ្រាវជោគជ័យ!');
      }
      fetchData();
      setFormData({ student_id: '', supervisor_id: '', co_supervisor_id: '', title: '', start_date: '', defense_date: '', status: 'proposal' });
    } catch (error) { alert('មានបញ្ហា! សូមពិនិត្យទិន្នន័យឡើងវិញ។'); }
  };

  const handleEdit = (thesis) => {
    setEditingId(thesis.id);
    setFormData({
      student_id: thesis.student_id,
      supervisor_id: thesis.supervisor_id,
      co_supervisor_id: thesis.co_supervisor_id || '',
      title: thesis.title,
      start_date: thesis.start_date || '',
      defense_date: thesis.defense_date || '',
      status: thesis.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?")) {
      await axios.delete(`https://journal.dhammavicaya.cloud/api/theses/${id}`);
      fetchData();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-800">🔬 ការគ្រប់គ្រងនិក្ខេបបទ និងសារណា</h1>

      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កែប្រែទិន្នន័យ' : 'ចុះឈ្មោះប្រធានបទថ្មី'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <select name="student_id" value={formData.student_id} onChange={handleChange} className="border p-2 rounded col-span-1 md:col-span-3" required>
            <option value="">-- ជ្រើសរើសនិស្សិត --</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.student_id} - {s.khmer_name} ({s.degree_level.toUpperCase()})</option>)}
          </select>

          <select name="supervisor_id" value={formData.supervisor_id} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- សាស្ត្រាចារ្យណែនាំ (Main) --</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.academic_title} {t.khmer_name}</option>)}
          </select>

          <select name="co_supervisor_id" value={formData.co_supervisor_id || ''} onChange={handleChange} className="border p-2 rounded bg-gray-50">
            <option value="">-- សហសាស្ត្រាចារ្យណែនាំ (Co-Supervisor) --</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.academic_title} {t.khmer_name}</option>)}
          </select>

          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
            <option value="proposal">📝 ស្នើប្រធានបទ</option>
            <option value="researching">⏳ កំពុងស្រាវជ្រាវ</option>
            <option value="defended">✅ ការពាររួចរាល់</option>
            <option value="published">📚 បោះពុម្ពផ្សាយ</option>
          </select>

          <div className="col-span-1 md:col-span-3">
            <textarea name="title" placeholder="ចំណងជើងប្រធានបទស្រាវជ្រាវ..." value={formData.title} onChange={handleChange} rows="3" className="border p-2 rounded w-full" required></textarea>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">ថ្ងៃចាប់ផ្តើម</label>
            <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className="border p-2 rounded" />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">ថ្ងៃការពារបញ្ចប់</label>
            <input type="date" name="defense_date" value={formData.defense_date} onChange={handleChange} className="border p-2 rounded" />
          </div>

          <div className="col-span-full flex gap-3 mt-4">
            <button type="submit" className={`${editingId ? 'bg-yellow-500' : 'bg-orange-600 hover:bg-orange-700'} text-white font-bold py-2 px-6 rounded`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 បញ្ចូលប្រធានបទ'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ student_id: '', supervisor_id: '', co_supervisor_id: '', title: '', start_date: '', defense_date: '', status: 'proposal' }); }} className="bg-gray-400 text-white font-bold py-2 px-6 rounded">បោះបង់</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">និស្សិត</th>
              <th className="py-2 px-4 border-b text-left w-1/3">ប្រធានបទ</th>
              <th className="py-2 px-4 border-b text-left">សាស្ត្រាចារ្យណែនាំ</th>
              <th className="py-2 px-4 border-b text-center">ស្ថានភាព</th>
              <th className="py-2 px-4 border-b text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {theses.map(thesis => (
              <tr key={thesis.id} className="hover:bg-gray-50 border-b">
                <td className="py-2 px-4 font-medium text-blue-700">{thesis.student?.khmer_name}</td>
                <td className="py-2 px-4 text-sm">{thesis.title}</td>
                <td className="py-2 px-4">
                  <div className="font-medium text-green-700">ទី១: {thesis.supervisor?.academic_title} {thesis.supervisor?.khmer_name}</div>
                  {thesis.co_supervisor && (
                    <div className="text-sm text-gray-600 mt-1">ទី២: {thesis.co_supervisor?.academic_title} {thesis.co_supervisor?.khmer_name}</div>
                  )}
                </td>
                <td className="py-2 px-4 text-center">
                  {thesis.status === 'proposal' && <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs">ស្នើប្រធានបទ</span>}
                  {thesis.status === 'researching' && <span className="bg-blue-100 text-blue-700 py-1 px-2 rounded text-xs">កំពុងស្រាវជ្រាវ</span>}
                  {thesis.status === 'defended' && <span className="bg-green-100 text-green-700 py-1 px-2 rounded text-xs">ការពាររួច</span>}
                  {thesis.status === 'published' && <span className="bg-purple-100 text-purple-700 py-1 px-2 rounded text-xs">បោះពុម្ពផ្សាយ</span>}
                </td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(thesis)} className="text-blue-500 font-bold mr-3">✏️</button>
                  <button onClick={() => handleDelete(thesis.id)} className="text-red-500 font-bold">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}