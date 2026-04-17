import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // ១. បង្កើតកន្លែងចងចាំពាក្យដែលនិស្សិតវាយបញ្ចូល (Search Term)
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // axios.get('http://localhost:8000/api/articles')
    axios.get('/articles')
      .then(response => {
        setArticles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  // ២. បង្កើតតម្រង (Filter) ដើម្បីទាញយកតែអត្ថបទណាដែលត្រូវនឹងពាក្យស្វែងរក
  const filteredArticles = articles.filter((article) => {
    // ស្វែងរកតាម ចំណងជើង ឬ ឈ្មោះអ្នកនិពន្ធ (បំប្លែងជាអក្សរតូចដូចគ្នាដើម្បីងាយធៀប)
    return (
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <div className="flex justify-center items-center h-screen text-xl text-blue-600 font-bold">⏳ កំពុងទាញទិន្នន័យ...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-3">📚 បណ្ណាល័យអត្ថបទស្រាវជ្រាវ</h1>
        <p className="text-gray-500">ស្វែងរក និងទាញយកឯកសារ Journal សម្រាប់ថ្នាក់ក្រោយឧត្តមសិក្សា</p>
      </div>

      {/* ៣. ប្រអប់ស្វែងរក (Search Bar) ស្តង់ដារទំនើប */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input 
            type="text" 
            className="w-full p-4 pl-12 text-sm text-gray-900 bg-white border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-300" 
            placeholder="ស្វែងរកតាមចំណងជើង ឬឈ្មោះអ្នកនិពន្ធ..." 
            value={searchTerm}
            // ពេលវាយអក្សរ វាលោតទៅកែប្រែទិន្នន័យភ្លាមៗ
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
      
      {/* បង្ហាញលទ្ធផលដោយប្រើ filteredArticles ជំនួសឱ្យ articles ដើម */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group overflow-hidden">
              <div className="h-2 bg-blue-500 w-0 group-hover:w-full transition-all duration-500"></div>
              <div className="p-6 flex-grow">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{item.title}</h2>
                <div className="flex items-center text-sm text-gray-600 mb-4 font-medium">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded mr-3">✍️ {item.author}</span>
                  <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">📅 {item.year}</span>
                </div>
                <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">{item.abstract}</p>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100 mt-auto">
                {item.pdf_file ? (
                  <a 
                    // href={`http://localhost:8000/storage/pdfs/${item.pdf_file}`} 
                    href={`https://journal.dhammavicaya.cloud/storage/pdfs/${item.pdf_file}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex justify-center items-center w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300"
                  >
                    <span className="mr-2">📥</span> អាន ឬទាញយក PDF
                  </a>
                ) : (
                  <span className="block w-full text-center text-red-400 font-medium py-2 bg-red-50 rounded-lg border border-red-100">មិនមានឯកសារភ្ជាប់ទេ</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-center text-gray-500 py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <span className="text-4xl mb-3">🧐</span>
            <p className="text-lg font-medium">រកមិនឃើញអត្ថបទទេបង!</p>
            <p className="text-sm">សូមសាកល្បងវាយពាក្យគន្លឹះផ្សេងទៀត</p>
          </div>
        )}
      </div>
    </div>
  );
}