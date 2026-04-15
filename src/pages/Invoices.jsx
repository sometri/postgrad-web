import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    student_id: '', description: '', total_amount: '', paid_amount: '0', due_date: ''
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [invoiceRes, studentRes] = await Promise.all([
        axios.get('http://localhost:8000/api/invoices'),
        axios.get('http://localhost:8000/api/students')
      ]);
      setInvoices(invoiceRes.data);
      setStudents(studentRes.data);
    } catch (error) { console.error("Error:", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/invoices/${editingId}`, formData);
        alert('✅ កែប្រែទិន្នន័យហិរញ្ញវត្ថុជោគជ័យ!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:8000/api/invoices', formData);
        alert('🎉 បង្កើតវិក្កយបត្រជោគជ័យ!');
      }
      fetchData();
      setFormData({ student_id: '', description: '', total_amount: '', paid_amount: '0', due_date: '' });
    } catch (error) { alert('មានបញ្ហា! សូមពិនិត្យទិន្នន័យឡើងវិញ។'); }
  };

  const handleEdit = (invoice) => {
    setEditingId(invoice.id);
    setFormData({
      student_id: invoice.student_id,
      description: invoice.description,
      total_amount: invoice.total_amount,
      paid_amount: invoice.paid_amount,
      due_date: invoice.due_date || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("⚠️ តើអ្នកពិតជាចង់លុបវិក្កយបត្រនេះមែនទេ? ទិន្នន័យលុយនឹងបាត់បង់!")) {
      await axios.delete(`http://localhost:8000/api/invoices/${id}`);
      fetchData();
    }
  };

  // មុខងារជំនួយសម្រាប់បំប្លែងលុយទៅជាទម្រង់ដុល្លារស្អាតៗ
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-teal-800">💰 គ្រប់គ្រងហិរញ្ញវត្ថុ និងការបង់ប្រាក់</h1>

      <div className={`p-6 rounded-lg shadow-md mb-8 ${editingId ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-white'}`}>
        <h2 className="text-lg font-bold mb-4">{editingId ? '✏️ កែប្រែវិក្កយបត្រ' : 'បង្កើតវិក្កយបត្រថ្មី / ទទួលប្រាក់'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <select name="student_id" value={formData.student_id} onChange={handleChange} className="border p-2 rounded col-span-1 md:col-span-2" required>
            <option value="">-- ជ្រើសរើសនិស្សិត --</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.student_id} - {s.khmer_name}</option>)}
          </select>

          <input type="text" name="description" placeholder="ការបរិយាយ (ឧ. ថ្លៃសិក្សាឆ្នាំទី១)" value={formData.description} onChange={handleChange} className="border p-2 rounded col-span-1 md:col-span-2" required />

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">ប្រាក់ត្រូវបង់សរុប ($)</label>
            <input type="number" step="0.01" name="total_amount" value={formData.total_amount} onChange={handleChange} className="border p-2 rounded" required />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">ប្រាក់បានបង់ជាក់ស្តែង ($)</label>
            <input type="number" step="0.01" name="paid_amount" value={formData.paid_amount} onChange={handleChange} className="border p-2 rounded bg-teal-50 font-bold" required />
          </div>

          <div className="flex flex-col col-span-1 md:col-span-2">
            <label className="text-sm text-gray-600 mb-1">ថ្ងៃកំណត់បង់ចុងក្រោយ</label>
            <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="border p-2 rounded" />
          </div>

          <div className="col-span-full flex gap-3 mt-4">
            <button type="submit" className={`${editingId ? 'bg-yellow-500' : 'bg-teal-600 hover:bg-teal-700'} text-white font-bold py-2 px-6 rounded`}>
              {editingId ? '💾 រក្សាទុកការកែប្រែ' : '💾 បង្កើតវិក្កយបត្រ'}
            </button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ student_id: '', description: '', total_amount: '', paid_amount: '0', due_date: '' }); }} className="bg-gray-400 text-white font-bold py-2 px-6 rounded">បោះបង់</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">និស្សិត</th>
              <th className="py-2 px-4 border-b text-left">ការបរិយាយ</th>
              <th className="py-2 px-4 border-b text-right">សរុប</th>
              <th className="py-2 px-4 border-b text-right">បានបង់</th>
              <th className="py-2 px-4 border-b text-right text-red-600">នៅខ្វះ</th>
              <th className="py-2 px-4 border-b text-center">ស្ថានភាព</th>
              <th className="py-2 px-4 border-b text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => {
              const balance = invoice.total_amount - invoice.paid_amount;
              return (
                <tr key={invoice.id} className="hover:bg-gray-50 border-b">
                  <td className="py-2 px-4 font-medium text-blue-700">{invoice.student?.khmer_name}</td>
                  <td className="py-2 px-4">{invoice.description}</td>
                  <td className="py-2 px-4 text-right font-bold">{formatMoney(invoice.total_amount)}</td>
                  <td className="py-2 px-4 text-right text-teal-600 font-bold">{formatMoney(invoice.paid_amount)}</td>
                  <td className="py-2 px-4 text-right text-red-500 font-bold">{balance > 0 ? formatMoney(balance) : '$0.00'}</td>
                  <td className="py-2 px-4 text-center">
                    {invoice.status === 'unpaid' && <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold">ជំពាក់ (Unpaid)</span>}
                    {invoice.status === 'partial' && <span className="bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full text-xs font-bold">បង់ខ្លះ (Partial)</span>}
                    {invoice.status === 'paid' && <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold">បង់ដាច់ (Paid)</span>}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button onClick={() => handleEdit(invoice)} className="text-blue-500 font-bold mr-3">✏️</button>
                    <button onClick={() => handleDelete(invoice.id)} className="text-red-500 font-bold">🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}