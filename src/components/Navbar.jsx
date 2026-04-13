import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Postgrad APP</div>
      <ul className="nav-links">
        <li><Link to="/">ទំព័រដើម</Link></li>
        <li><Link to="/articles">អត្ថបទ (Journal)</Link></li>
      </ul>
    </nav>
  );
}