import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null); // កំណត់សម្គាល់ថាតើកំពុង Edit ឬអត់
  
  const [formData, setFormData] = useState({
    student_id: '', khmer_name: '', latin_name: '', degree_level: 'master', 
    student_type: 'layperson', gender: '', chhaya_number: '', pagoda_name: '', monk_title: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error("មានបញ្ហាក្នុងការទាញទិន្នន័យ:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // មុខងារពេលចុចប៊ូតុង កែប្រែ (ទាញទិន្នន័យចាស់មកដាក់ក្នុង Form)
  const handleEdit = (student) => {
    setEditingId(student.id); // ប្រាប់ប្រព័ន្ធថាឥឡូវចូល Edit Mode ហើយណា៎
    setFormData(student); // ទាញទិន្នន័យទាំងអស់ទៅទម្លាក់ក្នុងប្រអប់
    window.scrollTo({ top: 0, behavior: 'smooth' }); // អូសទំព័រឡើងលើដោយស្វ័យប្រវត្តិ
  };

  // មុខងារពេលចុចប៊ូតុង លុប
  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបទិន្នន័យនេះមែនទេ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/students/${id}`);
        alert('🗑️ លុបទិន្នន័យជោគជ័យ!');
        fetchStudents(); // ទាញតារាងថ្មី
      } catch (error) {
        console.error("កំហុសក្នុងការលុប:", error);
      }
    }
  };

  // មុខងារ Save (ដើរតួជា Create ផង និង Update ផង អាស្រ័យលើ editingId)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // បើមាន editingId មានន័យថាជាការ Update
        await axios.put(`http://localhost:8000/api/students/${editingId}`, formData);
        alert('✅ កែប្រែទិន្នន័យជោគជ័យ!');
        setEditingId(null); // លុប Edit Mode ចោលវិញ
      } else {
        // បើអត់មានទេ មានន័យថាជាការបញ្ជូលថ្មី
        await axios.post('http://localhost:8000/api/students', formData);
        alert('🎉 បញ្ជូលទិន្នន័យជោគជ័យ!');
      }
      
      fetchStudents(); 
      // សម្អាត Form វិញ
      setFormData({ student_id: '', khmer_name: '', latin_name: '', degree_level: 'master', student_type: 'layperson', gender: '', chhaya_number: '', pagoda_name: '', monk_title: '' });
    } catch (error) {
      console.error("កំហុសក្នុងការរក្សាទុក:", error);
      alert('មានបញ្ហា! សូមពិនិត្យមើលទិន្នន័យឡើងវិញ។');
    }
  };

  // មុខងារបោះបង់ការកែប្រែ
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ student_id: '', khmer_name: '', latin_name: '', degree_level: 'master', student_type: 'layperson', gender: '', chhaya_number: '', pagoda_name: '', monk_title: '' });
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">👥 គ្រប់គ្រងនិស្សិត និងព្រះសង្ឃ</h1>

      {/* ផ្នែកទី ១៖ Form បញ្ចូល/កែប្រែ */}
      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កំពុងកែប្រែទិន្នន័យ' : 'បញ្ចូលនិស្សិតថ្មី'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <input type="text" name="student_id" placeholder="អត្តលេខ (ឧ. SBU-M-001)" value={formData.student_id} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="khmer_name" placeholder="ឈ្មោះ (ខ្មែរ)" value={formData.khmer_name} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="latin_name" placeholder="ឈ្មោះ (ឡាតាំង)" value={formData.latin_name} onChange={handleChange} className="border p-2 rounded" required />
          
          <select name="degree_level" value={formData.degree_level} onChange={handleChange} className="border p-2 rounded">
            <option value="master">ថ្នាក់អនុបណ្ឌិត (Master)</option>
            <option value="phd">ថ្នាក់បណ្ឌិត (PhD)</option>
          </select>

          <select name="student_type" value={formData.student_type} onChange={handleChange} className="border p-2 rounded bg-gray-50">
            <option value="layperson">គ្រហស្ថ</option>
            <option value="monk">ព្រះសង្ឃ</option>
          </select>

          {formData.student_type === 'monk' ? (
            <>
              <input type="text" name="monk_title" placeholder="ងារ (ឧ. ព្រះមហា)" value={formData.monk_title || ''} onChange={handleChange} className="border p-2 rounded border-orange-300" />
              <input type="text" name="chhaya_number" placeholder="លេខឆាយា" value={formData.chhaya_number || ''} onChange={handleChange} className="border p-2 rounded border-orange-300" />
              <input type="text" name="pagoda_name" placeholder="គង់នៅវត្ត" value={formData.pagoda_name || ''} onChange={handleChange} className="border p-2 rounded border-orange-300" />
            </>
          ) : (
            <select name="gender" value={formData.gender || ''} onChange={handleChange} className="border p-2 rounded">
              <option value="">ជ្រើសរើសភេទ...</option>
              <option value="Male">ប្រុស</option>
              <option value="Female">ស្រី</option>
            </select>
          )}

          <div className="col-span-full flex gap-3 mt-2">
            <button type="submit" className={`${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-2 px-6 rounded transition`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 រក្សាទុក'}
            </button>
            
            {/* លោតប៊ូតុងបោះបង់ចេញមក តែពេលកំពុង Edit ប៉ុណ្ណោះ */}
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded transition">
                បោះបង់
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ផ្នែកទី ២៖ តារាងបង្ហាញទិន្នន័យ */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-4">បញ្ជីឈ្មោះនិស្សិត</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">អត្តលេខ</th>
                <th className="py-2 px-4 border-b text-left">ឈ្មោះ</th>
                <th className="py-2 px-4 border-b text-left">កម្រិតសិក្សា</th>
                <th className="py-2 px-4 border-b text-left">ប្រភេទ</th>
                <th className="py-2 px-4 border-b text-center">សកម្មភាព</th> {/* ថែមជួរឈរសកម្មភាព */}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 border-b">
                  <td className="py-2 px-4">{student.student_id}</td>
                  <td className="py-2 px-4 font-medium text-blue-700">
                    {student.student_type === 'monk' ? `${student.monk_title} ` : ''} 
                    {student.khmer_name}
                  </td>
                  <td className="py-2 px-4 uppercase">{student.degree_level}</td>
                  <td className="py-2 px-4">
                    {student.student_type === 'monk' ? <span className="text-orange-600 font-bold">🙏 ព្រះសង្ឃ</span> : '👨‍💼 គ្រហស្ថ'}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {/* ប៊ូតុងកែប្រែ និងលុប */}
                    <button onClick={() => handleEdit(student)} className="text-blue-500 hover:text-blue-700 font-bold mr-4">✏️</button>
                    <button onClick={() => handleDelete(student.id)} className="text-red-500 hover:text-red-700 font-bold">🗑️</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">មិនទាន់មានទិន្នន័យទេ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}