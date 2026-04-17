import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Scores() {
  const [scoresList, setScoresList] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    student_id: '', academic_class_id: '', subject_name: '', semester: '1', score: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [scoreRes, studentRes, classRes] = await Promise.all([
        axios.get('/scores'),
        axios.get('/students'),
        axios.get('/classes')
      ]);
      setScoresList(scoreRes.data);
      setStudents(studentRes.data);
      setClasses(classRes.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/scores/${editingId}`, formData);
        alert('✅ កែប្រែពិន្ទុជោគជ័យ!');
        setEditingId(null);
      } else {
        await axios.post('/scores', formData);
        alert('🎉 បញ្ចូលពិន្ទុជោគជ័យ!');
      }
      fetchData();
      setFormData({ student_id: '', academic_class_id: '', subject_name: '', semester: '1', score: '' });
    } catch (error) { alert('មានបញ្ហា! សូមពិនិត្យទិន្នន័យឡើងវិញ។'); }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      student_id: item.student_id,
      academic_class_id: item.academic_class_id,
      subject_name: item.subject_name,
      semester: item.semester,
      score: item.score
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបទិន្នន័យពិន្ទុនេះមែនទេ?")) {
      await axios.delete(`/scores/${id}`);
      fetchData();
    }
  };

  // ពណ៌និទ្ទេស
  const getGradeColor = (grade) => {
    if (grade === 'A') return 'bg-green-100 text-green-700';
    if (grade === 'B') return 'bg-blue-100 text-blue-700';
    if (grade === 'C') return 'bg-yellow-100 text-yellow-700';
    if (grade === 'D') return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-pink-800">📝 គ្រប់គ្រងពិន្ទុ និងលទ្ធផលសិក្សា</h1>

      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កែប្រែពិន្ទុ' : 'បញ្ចូលពិន្ទុថ្មី'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <select name="student_id" value={formData.student_id} onChange={handleChange} className="border p-2 rounded col-span-1 lg:col-span-2" required>
            <option value="">-- ជ្រើសរើសនិស្សិត --</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.student_id} - {s.khmer_name}</option>)}
          </select>

          <select name="academic_class_id" value={formData.academic_class_id} onChange={handleChange} className="border p-2 rounded col-span-1 lg:col-span-2" required>
            <option value="">-- ជ្រើសរើសថ្នាក់រៀន --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
          </select>

          <div className="flex flex-col col-span-1 lg:col-span-1">
            <label className="text-xs text-gray-500 mb-1">ឆមាស</label>
            <select name="semester" value={formData.semester} onChange={handleChange} className="border p-2 rounded">
              {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>ឆមាសទី {num}</option>)}
            </select>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <input type="text" name="subject_name" placeholder="ឈ្មោះមុខវិជ្ជា (ឧ. វិធីសាស្ត្រស្រាវជ្រាវ)" value={formData.subject_name} onChange={handleChange} className="border p-2 rounded w-full" required />
          </div>

          <div className="flex flex-col col-span-1 lg:col-span-2">
            <label className="text-xs text-gray-500 mb-1">ពិន្ទុទទួលបាន (លេខ)</label>
            <input type="number" step="0.01" name="score" value={formData.score} onChange={handleChange} className="border p-2 rounded bg-pink-50 font-bold" required />
          </div>

          <div className="col-span-full flex gap-3 mt-4">
            <button type="submit" className={`${editingId ? 'bg-yellow-500' : 'bg-pink-600 hover:bg-pink-700'} text-white font-bold py-2 px-6 rounded`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 បញ្ចូលពិន្ទុ'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ student_id: '', academic_class_id: '', subject_name: '', semester: '1', score: '' }); }} className="bg-gray-400 text-white font-bold py-2 px-6 rounded">បោះបង់</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">និស្សិត</th>
              <th className="py-2 px-4 border-b text-left">ថ្នាក់រៀន</th>
              <th className="py-2 px-4 border-b text-left">មុខវិជ្ជា (ឆមាស)</th>
              <th className="py-2 px-4 border-b text-center">ពិន្ទុ</th>
              <th className="py-2 px-4 border-b text-center">និទ្ទេស</th>
              <th className="py-2 px-4 border-b text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {scoresList.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 border-b">
                <td className="py-2 px-4 font-medium text-blue-700">{item.student?.khmer_name}</td>
                <td className="py-2 px-4 text-sm">{item.academic_class?.class_name}</td>
                <td className="py-2 px-4">
                  <div className="font-bold">{item.subject_name}</div>
                  <div className="text-xs text-gray-500">ឆមាសទី {item.semester}</div>
                </td>
                <td className="py-2 px-4 text-center font-extrabold text-gray-700">{item.score}</td>
                <td className="py-2 px-4 text-center">
                  <span className={`py-1 px-3 rounded-full text-sm font-bold ${getGradeColor(item.grade)}`}>
                    {item.grade}
                  </span>
                </td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 font-bold mr-3">✏️</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 font-bold">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}