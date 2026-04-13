import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Articles from './pages/Articles';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar នឹងបង្ហាញគ្រប់ទំព័រទាំងអស់ */}
      <Navbar />
      
      {/* កន្លែងនេះនឹងផ្លាស់ប្តូរទៅតាម Menu ដែលយើងចុច */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;