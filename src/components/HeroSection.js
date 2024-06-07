import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform any necessary login actions
    navigate('/login');
  };

  const handleRegister = () => {
    // Perform any necessary login actions
    navigate('/register');
  };

  return (
    <div className='hero-container'>
      <video src='/videos/video-3.mp4' autoPlay loop muted />
      <h1>Drone Service made easy</h1>
      <p>Elevate your productivity with our advanced drone service cloud technology</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
          onClick={handleRegister}
        >
          Register
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
