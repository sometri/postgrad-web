import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import ឧបករណ៍គូរក្រាហ្វពី recharts
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('https://journal.dhammavicaya.cloud/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error("មានបញ្ហាក្នុងការទាញទិន្នន័យ Dashboard:", error);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (!stats) return <div className="p-10 text-center text-xl text-gray-500">កំពុងទាញយកទិន្នន័យសង្ខេប... ⏳</div>;

  // ១. ទិន្នន័យសម្រាប់ក្រាហ្វ "ស្ថានភាពនិក្ខេបបទ" (Pie/Doughnut Chart)
  const thesesData = [
    { name: 'កំពុងស្រាវជ្រាវ (Active)', value: stats.theses.active },
    { name: 'ការពាររួច (Defended)', value: stats.theses.defended }
  ];
  const thesesColors = ['#f97316', '#22c55e']; // លឿងទុំ និង បៃតង

  // ២. ទិន្នន័យសម្រាប់ក្រាហ្វ "ហិរញ្ញវត្ថុ" (Bar Chart)
  const financeData = [
    { 
      name: 'ទិន្នន័យហិរញ្ញវត្ថុសរុប', 
      'ប្រាក់ប្រមូលបាន (Revenue)': stats.finance.revenue, 
      'ប្រាក់កំពុងជំពាក់ (Unpaid)': stats.finance.unpaid 
    }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 ផ្ទាំងគ្រប់គ្រងទូទៅ (Dashboard)</h1>

      {/* --- ជួរទី ១៖ កាតទិន្នន័យសង្ខេប (Cards) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">និស្សិតសរុប</p>
              <h2 className="text-4xl font-extrabold mt-1">{stats.students.total}</h2>
              <p className="text-sm mt-2 font-medium">🙏 ព្រះសង្ឃ៖ {stats.students.monks} អង្គ</p>
            </div>
            <div className="text-5xl opacity-50">👨‍🎓</div>
          </div>
        </div>

        <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-sm font-bold uppercase tracking-wider">សាស្ត្រាចារ្យ</p>
              <h2 className="text-4xl font-extrabold mt-1">{stats.teachers.total}</h2>
            </div>
            <div className="text-5xl opacity-50">👨‍🏫</div>
          </div>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-purple-100 text-sm font-bold uppercase tracking-wider">ថ្នាក់ដំណើរការ</p>
              <h2 className="text-4xl font-extrabold mt-1">{stats.classes.active}</h2>
            </div>
            <div className="text-5xl opacity-50">🏫</div>
          </div>
        </div>

        <div className="bg-orange-500 text-white p-6 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-100 text-sm font-bold uppercase tracking-wider">ប្រធានបទស្រាវជ្រាវ</p>
              <h2 className="text-4xl font-extrabold mt-1">{stats.theses.active}</h2>
              <p className="text-sm mt-2 font-medium">✅ ការពាររួច៖ {stats.theses.defended}</p>
            </div>
            <div className="text-5xl opacity-50">🔬</div>
          </div>
        </div>
      </div>

      {/* --- ជួរទី ២៖ ក្រាហ្វ និងតារាង (Charts Section) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* ក្រាហ្វទី ១៖ ស្ថានភាពនិក្ខេបបទ */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">🔬 ភាគរយនៃស្ថានភាពនិក្ខេបបទ</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={thesesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {thesesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={thesesColors[index % thesesColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ក្រាហ្វទី ២៖ ហិរញ្ញវត្ថុ */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">💰 របាយការណ៍ហិរញ្ញវត្ថុធៀបគ្នា</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Legend />
                {/* សសរចំណូលពណ៌ខៀវទឹកសមុទ្រ (Teal) និងសសរជំពាក់ពណ៌ក្រហម */}
                <Bar dataKey="ប្រាក់ប្រមូលបាន (Revenue)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ប្រាក់កំពុងជំពាក់ (Unpaid)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}