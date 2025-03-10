
import React from 'react';
import '../App.css';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="navigation">
      <div className="nav-logo">MoodTune</div>
      <ul className="nav-links">
        <li className={currentPage === 'home' ? 'active' : ''}>
          <button onClick={() => onNavigate('home')}>Home</button>
        </li>
        <li className={currentPage === 'your-playlist' ? 'active' : ''}>
          <button onClick={() => onNavigate('your-playlist')}>Your Playlist</button>
        </li>
        <li className={currentPage === 'recommended' ? 'active' : ''}>
          <button onClick={() => onNavigate('recommended')}>Recommended</button>
        </li>
        <li className={currentPage === 'about' ? 'active' : ''}>
          <button onClick={() => onNavigate('about')}>About</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
