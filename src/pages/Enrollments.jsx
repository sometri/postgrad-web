import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    student_id: '', academic_class_id: '', enrollment_date: '', status: 'active'
  });

  useEffect(() => { 
    fetchData(); 
  }, []);

  // ទាញទិន្នន័យទាំង ៣ ព្រមគ្នា (ការចុះឈ្មោះ, និស្សិត, ថ្នាក់រៀន)
  const fetchData = async () => {
    try {
      const [enrollRes, studentRes, classRes] = await Promise.all([
        axios.get('http://localhost:8000/api/enrollments'),
        axios.get('http://localhost:8000/api/students'),
        axios.get('http://localhost:8000/api/classes')
      ]);
      setEnrollments(enrollRes.data);
      setStudents(studentRes.data);
      setClasses(classRes.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/enrollments/${editingId}`, formData);
        alert('✅ កែប្រែជោគជ័យ!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:8000/api/enrollments', formData);
        alert('🎉 ចុះឈ្មោះចូលរៀនជោគជ័យ!');
      }
      fetchData();
      setFormData({ student_id: '', academic_class_id: '', enrollment_date: '', status: 'active' });
    } catch (error) { alert('មានបញ្ហា! និស្សិតនេះអាចចុះឈ្មោះក្នុងថ្នាក់នេះរួចហើយ។'); }
  };

  const handleEdit = (enroll) => {
    setEditingId(enroll.id);
    setFormData({
      student_id: enroll.student_id,
      academic_class_id: enroll.academic_class_id,
      enrollment_date: enroll.enrollment_date,
      status: enroll.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?")) {
      await axios.delete(`http://localhost:8000/api/enrollments/${id}`);
      fetchData();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-indigo-800">📝 ការចុះឈ្មោះចូលរៀន (Enrollment)</h1>

      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កែប្រែការចុះឈ្មោះ' : 'ចុះឈ្មោះនិស្សិតចូលថ្នាក់ថ្មី'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <select name="student_id" value={formData.student_id} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- ជ្រើសរើសនិស្សិត --</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.student_id} - {s.khmer_name}</option>)}
          </select>

          <select name="academic_class_id" value={formData.academic_class_id} onChange={handleChange} className="border p-2 rounded" required>
            <option value="">-- ជ្រើសរើសថ្នាក់រៀន --</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
          </select>

          <input type="date" name="enrollment_date" value={formData.enrollment_date} onChange={handleChange} className="border p-2 rounded" required />
          
          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 rounded">
            <option value="active">🟢 កំពុងសិក្សា</option>
            <option value="dropped">🔴 បោះបង់</option>
            <option value="graduated">🎓 បញ្ចប់ការសិក្សា</option>
          </select>

          <div className="col-span-full flex gap-3 mt-2">
            <button type="submit" className={`${editingId ? 'bg-yellow-500' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-2 px-6 rounded`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 ចុះឈ្មោះ'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ student_id: '', academic_class_id: '', enrollment_date: '', status: 'active' }); }} className="bg-gray-400 text-white font-bold py-2 px-6 rounded">បោះបង់</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">អត្តលេខ</th>
              <th className="py-2 px-4 border-b text-left">ឈ្មោះនិស្សិត</th>
              <th className="py-2 px-4 border-b text-left">ថ្នាក់រៀន / ជំនាន់</th>
              <th className="py-2 px-4 border-b text-left">ថ្ងៃចុះឈ្មោះ</th>
              <th className="py-2 px-4 border-b text-center">ស្ថានភាព</th>
              <th className="py-2 px-4 border-b text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(enroll => (
              <tr key={enroll.id} className="hover:bg-gray-50 border-b">
                <td className="py-2 px-4">{enroll.student?.student_id}</td>
                <td className="py-2 px-4 font-bold text-blue-700">{enroll.student?.khmer_name}</td>
                <td className="py-2 px-4 font-bold text-purple-700">{enroll.academic_class?.class_name}</td>
                <td className="py-2 px-4">{enroll.enrollment_date}</td>
                <td className="py-2 px-4 text-center">
                  {enroll.status === 'active' && <span className="text-green-600 font-bold">កំពុងសិក្សា</span>}
                  {enroll.status === 'dropped' && <span className="text-red-600 font-bold">បោះបង់</span>}
                  {enroll.status === 'graduated' && <span className="text-blue-600 font-bold">បញ្ជប់ការសិក្សា</span>}
                </td>
                <td className="py-2 px-4 text-center">
                  <button onClick={() => handleEdit(enroll)} className="text-blue-500 font-bold mr-3">✏️</button>
                  <button onClick={() => handleDelete(enroll.id)} className="text-red-500 font-bold">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}